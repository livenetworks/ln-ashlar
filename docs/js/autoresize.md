# Autoresize — architecture reference

> Implementation notes for `ln-autoresize`. The user-facing contract
> lives in [`js/ln-autoresize/README.md`](../../js/ln-autoresize/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-autoresize/ln-autoresize.js`.

## Position in the architecture

`ln-autoresize` is a **pure presentation utility**. It owns no data,
emits no custom events, and cooperates with no other component. It
sits outside the four-layer data flow described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md) — it
is not a Data, Submit, Render, or Validate participant. It listens
to a single platform event (`input`) on its own element and writes a
single inline style (`style.height`). Nothing else.

The component exists as a centralisation: every project would otherwise
reinvent the two-step `auto → scrollHeight` dance, and most reinventions
ship with at least one of the bugs the canonical version avoids
(flicker, no-shrink, no initial measure).

## State

Each `[data-ln-autoresize]` textarea gets a `_component` instance
stored at `element.lnAutoresize` (the `lnAutoresize` key matches
`DOM_ATTRIBUTE` exported via `registerComponent`). Instance state is
two properties:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | `HTMLTextAreaElement` | Reference to the textarea — the constructor's argument |
| `_onInput` | `Function` | Bound handler for the `input` event; held as a reference so `destroy()` can unbind it |

There is no internal "current height" cache. `_resize` always reads
`scrollHeight` fresh, so external CSS changes (`max-height`,
`min-height`, font-size, padding) are picked up automatically on the
next user keystroke.

## Resize mechanism — the two-step

```
input event (or initial construction)
    │
    ▼
_resize():
    1. Set this.dom.style.height = 'auto'
    2. Read this.dom.scrollHeight
    3. Set this.dom.style.height = scrollHeight + 'px'
```

The reset to `'auto'` in step 1 is the part that distinguishes a
working auto-resize from a textarea that only grows. `scrollHeight`
is defined as the height required to display all content **without**
overflow — but if the element already has an explicit `height`
larger than its content, the browser keeps `scrollHeight` equal to
that explicit height (because content fits within it). Without the
reset, `_resize` becomes a one-way ratchet: every measurement equals
or exceeds the previous one, so the textarea grows but never shrinks.
Resetting to `'auto'` collapses the box to its content-driven natural
height for the duration of the read, then step 3 pins it back up.

The reflow between steps 1 and 3 is synchronous inside the same JS
tick, so the browser never paints the intermediate `auto` state. The
user sees one transition: old height → new height. There is no
flicker, no `requestAnimationFrame`, no scheduled re-measure.

## Initial resize

The constructor calls `_resize()` once before returning. This handles
two cases that the `input` listener cannot:

- **Server-rendered pre-filled values.** A textarea with content
  inside it (`<textarea>Lorem ipsum...</textarea>`) needs to size
  to that content on first paint, not on first keystroke.
- **Late attachment.** When `[data-ln-autoresize]` is added to an
  existing textarea (via `setAttribute` or as part of a fragment
  insert), the field may already have a value; the initial resize
  matches the height to it.

If the textarea is hidden at construction time (`display: none` on
an ancestor), `scrollHeight` returns `0` and `style.height` is set
to `0px`. The component does not detect this — it has no
`IntersectionObserver`, no `ResizeObserver`. The user has to call
`_resize()` manually after the parent becomes visible. See the
README "Hidden-then-revealed" example.

## MutationObserver via `registerComponent`

Initialization is delegated to the shared `registerComponent` helper
in `js/ln-core/helpers.js`, called at the bottom of the IIFE with the
selector, attribute key, constructor, and tag name as arguments.

The helper sets up a single global `MutationObserver` on
`document.body` configured with:

- `childList: true, subtree: true` — fires on any descendant
  insertion. New `[data-ln-autoresize]` textareas anywhere in the
  document are caught.
- `attributes: true, attributeFilter: ['data-ln-autoresize']` — fires
  when the attribute is added to or removed from an existing element.
  On addition, `findElements` runs the constructor; on removal,
  nothing happens (the helper does not call any `destroy` bridge).

There is no `onAttributeChange` callback registered, so attribute
*value* changes (e.g., `setAttribute('data-ln-autoresize', 'whatever')`)
do not re-trigger any logic — only attribute *presence* matters, and
once an instance exists `findElements` skips the element on subsequent
calls (`if (!el[attribute])`).

## Tag validation

The constructor checks `dom.tagName !== 'TEXTAREA'` immediately and,
if true, logs a warning and returns `this` early.

The early-`return this` produces an instance with no `dom` property
and no listener. The element is still marked as initialized via
`element[DOM_ATTRIBUTE]`, so re-attaching `data-ln-autoresize` after
swapping to a real `<textarea>` will not re-init — the developer must
remove and re-add the attribute (or call `destroy()`) to recover.

## Destroy lifecycle

Three steps (see the `destroy` prototype in `ln-autoresize.js`):

1. **Idempotency guard.** If the instance is already destroyed (or
   was never properly initialized — see "Tag validation"), exit
   silently. This is the standard pattern across ln components.
2. **Listener unbind.** The `_onInput` reference is the same closure
   held during `addEventListener`, so `removeEventListener` matches
   and the handler detaches cleanly.
3. **Inline height clear + instance delete.** Clearing `style.height`
   reverts the textarea to its CSS-driven height (typically the
   `rows` attribute × line-height + padding). Deleting the property
   on the DOM element lets `findElements` re-initialize the textarea
   if `lnAutoresize(domRoot)` is called again.

The `data-ln-autoresize` attribute is **not** removed by destroy. The
caller controls the attribute; destroy only tears down the JS instance.
If the attribute is still present after destroy, a future
`registerComponent` rescan (e.g., from a `MutationObserver` mutation
on a sibling) will re-create the instance.

## Cross-component coordination

`ln-autoresize` does not import, listen to, or dispatch any
ln-prefixed event. The only platform event it cares about is `input`
on its own element.

That said, two components in the library can interact with it
indirectly through that `input` listener:

- **`ln-form` via `ln-form:fill`.** When a form receives an
  `ln-form:fill` CustomEvent, `ln-form`'s `fill()` method calls
  `populateForm` to write `.value` on each named field, then
  dispatches `input` on every populated field. `ln-autoresize`'s
  listener catches that synthetic `input` and re-measures. This is
  the supported "programmatic value write" path — direct
  `.value =` writes from project code do not go through this path
  and will not re-measure.
- **`ln-form` reset.** `ln-form.reset()` calls `this.dom.reset()`
  (native `<form>.reset()`), which clears textarea values but does
  **not** itself dispatch `input`. To bridge that gap, `ln-form`'s
  `reset()` walks every field and dispatches synthetic `input` /
  `change` (same discriminator as `fill()`) AFTER `dom.reset()` and
  BEFORE `_resetValidation()`. `ln-autoresize` catches the synthetic
  `input` and re-measures, shrinking back to the cleared content's
  natural height. No coordinator wiring needed — invoking
  `form.lnForm.reset()` (or dispatching `ln-form:reset` on the form)
  is enough.

  The bare native path — `<button type="reset">` clicked, native
  `reset` event fires, `ln-form`'s `_onNativeReset` listener calls
  only `_resetValidation()` on a `setTimeout` — does NOT include the
  synthetic `input` dispatch. Native reset is intentionally minimal
  on this path because the user explicitly triggered the platform
  behavior. Projects that need auto-shrink on bare native reset
  must wire it manually (see the README's §Common mistakes section for
  the `setTimeout`-after-native-`reset` fallback) or switch to the
  `lnForm.reset()` API path.

No other library component talks to the textarea's height path.

## Performance notes

The `input` handler runs on every keystroke. Each run does:

1. One inline-style write (`'auto'`)
2. One forced layout (the `scrollHeight` read flushes pending layout)
3. One inline-style write (`scrollHeight + 'px'`)

For a single textarea this is imperceptible. For a page with hundreds
of `[data-ln-autoresize]` textareas, only the *focused* textarea
runs `_resize` per keystroke (because `input` fires only on the
target element), so the per-frame cost stays at one resize regardless
of total field count. There is no `ResizeObserver` watching layout
changes, so external layout shifts (window resize, font load) do
NOT trigger a resize cascade.
