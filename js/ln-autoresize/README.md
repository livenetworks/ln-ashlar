# ln-autoresize

> A `<textarea>` whose height tracks its content — set the attribute, the
> field grows as the user types and shrinks when text is deleted. 47 lines
> of JS that exist so no project ever writes them again.

## Philosophy

The browser does not auto-size `<textarea>`. Every project that wants
growing comment fields, note inputs, or chat composers ends up writing
the same five lines: listen for `input`, set `height` to `auto`, read
`scrollHeight`, set `height` to that. The five lines are easy to write
and hard to write *right* — the naive version flickers on every
keystroke, miscounts when the textarea inherits a fixed `rows`, drifts
across font loads, and silently breaks if anyone hides the parent. So
ln-autoresize is the canonical version, and that is the entire feature
surface. There is no resize sensor, no "max-rows" config, no "shrink
gracefully" mode — just `data-ln-autoresize` on a textarea and the
height follows the content.

The component does one trick that matters and is worth understanding
before you use it. To make the textarea shrink as well as grow, the
height has to be reset to `auto` *before* `scrollHeight` is read —
otherwise the previous tall height keeps `scrollHeight` pinned to the
old value and the textarea never collapses. That's why `_resize` is
two lines instead of one: `style.height = 'auto'` first, *then*
`style.height = scrollHeight + 'px'`. Browsers reflow synchronously
inside that single function call, so there is no visible flash —
the user only ever sees the final height.

What this component does **not** do:

- **Does not shrink to fit `rows`.** The `rows="1"` attribute sets
  the *initial* rendered height before any JS runs. Once
  ln-autoresize attaches and runs the first `_resize`, the inline
  `style.height` it writes overrides `rows` for the lifetime of the
  instance. `rows` is a starting line count, not a minimum.
- **Does not enforce min-height or max-height.** Use CSS — `min-height`
  on the textarea sets a floor that `scrollHeight` cannot drop below;
  `max-height` plus `overflow-y: auto` caps growth and lets content
  scroll past. The component never reads those properties; it just
  trusts the layout engine to produce the right `scrollHeight`.
- **Re-measures on `lnForm.reset()`.** Inside `<form data-ln-form>`,
  calling `form.lnForm.reset()` (or dispatching `ln-form:reset`)
  clears values AND dispatches synthetic `input` events on every
  field, which `ln-autoresize` catches and uses to shrink back. The
  bare native path — `<button type="reset">` clicked, no `lnForm` API
  call — does NOT dispatch synthetic input; the height stays tall.
  See "Common mistakes" item 4.
- **Does not re-measure when `.value` is set programmatically.**
  Setting `el.value = 'something'` does not fire `input`. Either
  dispatch the event yourself (`el.dispatchEvent(new Event('input'))`)
  or use `[data-ln-form]`'s `ln-form:fill` event, which dispatches
  `input` for every populated field automatically.
- **Does not own visual styling.** Default textarea chrome —
  padding, border, focus ring — comes from `@mixin form-input` /
  `@mixin form-textarea`. The component touches only `style.height`
  inline.

## Markup anatomy

The complete invocation:

```html
<textarea data-ln-autoresize rows="1" placeholder="Notes..."></textarea>
```

That is the entire markup contract. The element MUST be a `<textarea>`;
the component logs a warning and bails on anything else. The attribute
takes no value — its presence creates the instance.

### `rows="1"` — initial height before JS runs

`rows` controls the rendered height *before* ln-autoresize attaches.
Without it, browsers default to `rows="2"`, which means the textarea
shows two lines of empty whitespace on first paint and then snaps
shut as soon as the component runs the initial `_resize`. The visible
flash is harmless but ugly; setting `rows="1"` makes the empty starting
state match the post-init state. Pre-filled textareas don't need
`rows` — the initial `_resize` runs immediately and sizes to the
pre-filled content.

### Pairing with `max-height` for capped growth

Pure auto-resize grows forever. Most real use cases want a ceiling
past which the field starts scrolling instead. The component does
nothing here — that is CSS:

```scss
textarea[data-ln-autoresize] {
    resize: none;
    max-height: 6rem;
    overflow-y: auto;
}
```

`resize: none` removes the manual drag handle (the global
`@mixin form-textarea` sets `resize: vertical` by default; override it
when you opt into autoresize, since the manual handle and auto-grow
are conceptually the same affordance done two different ways).
`max-height` caps the inline height the component sets — once
`scrollHeight` exceeds the cap, the browser overflow rule takes over
and `overflow-y: auto` reveals the scrollbar.

### What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this textarea auto-size? | `data-ln-autoresize` (presence) | `ln-autoresize` (instance creation) |
| Current height | `style.height` (inline) on the textarea | `ln-autoresize` (writes after `input` and on construct) |
| Maximum height | CSS `max-height` on the selector | Project SCSS |
| Minimum height | CSS `min-height` on the selector | Project SCSS |
| Initial height before JS | `rows` attribute | Browser layout |

Inline `style.height` is the only thing the component writes. Attribute
removal, instance teardown, and class changes are all out of scope.

## States & visual feedback

There is no "resize state" — the textarea has the same chrome whether
it is one line or twenty. The visible change is height alone.

| Trigger | What JS does | What the user sees |
|---|---|---|
| Component constructed (initial run) | Reads `scrollHeight`, sets `style.height` to match | Pre-filled content shows at full height; empty textarea shows at `rows`-attribute height |
| User types / pastes / cuts | `input` event fires → `_resize` runs | Textarea grows or shrinks to match; no flash |
| `style.height` exceeds CSS `max-height` | (nothing extra) | Browser caps the height; `overflow-y: auto` shows a scrollbar |
| `destroy()` called | Removes listener; clears `style.height` | Textarea reverts to its CSS-driven height (typically `rows` × line-height + padding) |

There are no JS-driven classes. There is no `aria` state. `_resize`
writes one inline style and nothing else.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-autoresize` | `<textarea>` | Marks the textarea as auto-sizing. No value. | Presence creates the instance and runs the initial `_resize`. The component validates `tagName === 'TEXTAREA'` — applying it to anything else logs a warning and aborts. |

`rows`, `placeholder`, `id`, `name`, `required`, `maxlength`, etc. are
all native textarea attributes — ln-autoresize does not read or write
any of them. They behave as the platform documents. Width is whatever
CSS the project applies; the component is purely a height controller.

## Events

The component dispatches no custom events and listens only to the DOM
`input` event on its own element. There is no `ln-autoresize:resize`
or `ln-autoresize:before-resize`. If you need to react to height
changes, listen for `input` directly on the textarea — by the time
your handler runs, ln-autoresize's listener has already executed and
the new height is in the DOM (handlers fire in registration order;
ln-autoresize attaches its listener at construction, before user code
typically runs).

## API (component instance)

`window.lnAutoresize(root)` re-runs the init scan over `root`. The
global `MutationObserver` already covers AJAX inserts and attribute
mutations on the live document; call this manually only when you
inject markup into a Shadow DOM root or another document context the
observer cannot see.

`el.lnAutoresize` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLTextAreaElement` | Back-reference to the textarea |
| `_resize()` | method | Forces a re-measure. Use after programmatic `.value` writes, after revealing a hidden parent, or after a font load completes. |
| `destroy()` | method | Removes the `input` listener and clears the inline `style.height`. After destroy, the textarea reverts to its CSS-driven height; the `data-ln-autoresize` attribute is left in place (DOM-state remains for the user to clean up if they want). |

`_resize` is prefixed with an underscore by convention but is safe to
call from outside — the prefix only marks it as "implementation
detail you don't normally need." If you find yourself calling it
often, that's a signal that something else is bypassing the `input`
event; consider dispatching `input` from that path instead so the
listener handles it.

## Examples

### Minimal — basic auto-grow

```html
<textarea data-ln-autoresize rows="1" placeholder="Notes..."></textarea>
```

No CSS needed; the textarea grows with content and never shrinks
below the `rows="1"` initial height (because empty content has the
same `scrollHeight` as one line of text). The default
`@mixin form-textarea` applies `resize: vertical` — for autoresize
you typically want to override that, see next example.

### With max-height cap and scrolling

```html
<textarea id="comment" data-ln-autoresize rows="1" placeholder="Comment..."></textarea>
```

```scss
#comment {
    resize: none;
    max-height: 6rem;
    overflow-y: auto;
}
```

Up to `6rem` the textarea grows; past that, growth stops and a
vertical scrollbar appears inside.

### Pre-filled content (server-rendered)

```html
<textarea data-ln-autoresize>This long server-rendered text will appear at full height on first paint — the initial _resize runs synchronously inside the constructor.</textarea>
```

The constructor calls `_resize()` once before returning, so by the
time the page is interactive the height already matches the content.
There is no flash of the default `rows`-height before the resize
catches up.

### Inside `[data-ln-form]` with fill

```html
<form data-ln-form id="profile-form">
    <div class="form-element">
        <label for="bio">Bio</label>
        <textarea id="bio" name="bio" data-ln-autoresize rows="1"></textarea>
    </div>
</form>
```

```js
const form = document.getElementById('profile-form');
form.dispatchEvent(new CustomEvent('ln-form:fill', {
    detail: { bio: 'Lorem ipsum dolor sit amet…' }
}));
// → ln-form's fill() calls populateForm, which dispatches an `input`
//   event on the textarea after writing .value
// → ln-autoresize's input listener fires and the height adjusts
```

This is the supported coordinator path for programmatic value writes.
Direct `.value =` assignment from your own scripts will set the text
but **not** resize — you must dispatch `input` yourself.

### Reset inside `<form data-ln-form>` — works automatically

```html
<form data-ln-form id="reply-form">
    <div class="form-element">
        <label for="reply">Reply</label>
        <textarea id="reply" name="reply" data-ln-autoresize rows="1"></textarea>
    </div>
    <div class="form-actions">
        <button type="button" id="reply-cancel">Cancel</button>
        <button type="submit">Send</button>
    </div>
</form>
```

```js
const form = document.getElementById('reply-form');
document.getElementById('reply-cancel').addEventListener('click', function () {
    form.lnForm.reset();
    // → ln-form clears values, then dispatches synthetic `input` on
    //   every field. ln-autoresize catches it and shrinks the
    //   textarea back to its initial one-row height. No workaround
    //   needed.
});
```

The bare `<button type="reset">` path (without going through
`lnForm.reset()`) does NOT dispatch synthetic input events — only
the API / event path does. If you must use `<button type="reset">`,
see "Common mistakes" item 4 below for the manual fallback.

### Dynamically inserted textareas

```js
const textarea = document.createElement('textarea');
textarea.setAttribute('data-ln-autoresize', '');
textarea.setAttribute('rows', '1');
container.appendChild(textarea);
// → MutationObserver picks up the new node
// → ln-autoresize constructor runs, attaches the listener, runs initial _resize
```

No manual `lnAutoresize(container)` call is needed for live document
inserts. The global observer watches `document.body` with `subtree:
true`. If you are working inside a `<dialog>` element or any context
the observer reaches, it just works.

### Hidden-then-revealed (collapsed nav, lazy tab)

A textarea inside `display: none` or inside a closed `[data-ln-toggle]`
panel measures `scrollHeight` as zero-ish at construction time. When
the parent becomes visible later, the textarea will be too short.
Force a re-measure when the panel opens:

```js
panelEl.addEventListener('ln-toggle:open', function () {
    const ta = panelEl.querySelector('[data-ln-autoresize]');
    if (ta && ta.lnAutoresize) ta.lnAutoresize._resize();
});
```

The same trick applies to modals, accordion panels, and any
visibility-gated container. Construction-time measurement is correct
only for elements that are visible at construction.

## Common mistakes

### Mistake 1 — Setting `.value` directly and expecting the height to update

```js
// WRONG — height stays at whatever it was before
document.querySelector('[data-ln-autoresize]').value = longString;
```

Setting `.value` programmatically is silent — the platform does not
fire `input`. Either dispatch the event yourself, or go through
`[data-ln-form]`'s `ln-form:fill` event which dispatches it for you.

```js
// RIGHT — explicit
const ta = document.querySelector('[data-ln-autoresize]');
ta.value = longString;
ta.dispatchEvent(new Event('input'));
```

### Mistake 2 — Using `rows` as a "max rows" cap

```html
<!-- WRONG — rows="5" does not limit growth -->
<textarea data-ln-autoresize rows="5"></textarea>
```

`rows` is the *initial* visible row count. Once ln-autoresize attaches,
the inline `style.height` it writes overrides whatever height `rows`
produced. The textarea will grow past five rows. To cap at five rows,
use CSS `max-height` plus `overflow-y: auto` (and pick a value in
`em` or `rem` that corresponds to your line-height × 5).

### Mistake 3 — Adding `data-ln-autoresize` to a hidden parent and expecting it to work after reveal

```html
<!-- WRONG — measured at construction (when hidden) -->
<section style="display: none">
    <textarea data-ln-autoresize>Pre-filled long text...</textarea>
</section>
```

When the section is hidden, `scrollHeight` returns 0 and the inline
height is set to `0px`. When the section becomes visible later, the
textarea is collapsed. The component does not know about the visibility
change. Call `_resize()` manually after reveal (see "Hidden-then-revealed"
example).

### Mistake 4 — Bare `<button type="reset">` outside `[data-ln-form]` leaves the height stuck

```html
<!-- WRONG — bare native reset, no lnForm API in the loop -->
<form>
    <textarea data-ln-autoresize>Lots of text...</textarea>
    <button type="reset">Reset</button>
</form>
```

After clicking **Reset**, `.value` becomes empty but the height stays
tall — the platform does not fire `input` on reset, and there's no
`ln-form` coordinator to synthesize it. Two fixes:

1. **Add `data-ln-form` to the form** and replace `<button type="reset">`
   with a button that calls `form.lnForm.reset()`. This is the
   canonical path — see "Reset inside `<form data-ln-form>`" above.
2. **If you cannot use `data-ln-form`**, dispatch `input` manually
   after the native reset event fires:

   ```js
   form.addEventListener('reset', function () {
       setTimeout(function () {
           form.querySelectorAll('[data-ln-autoresize]').forEach(function (ta) {
               ta.dispatchEvent(new Event('input'));
           });
       }, 0);
   });
   ```

### Mistake 5 — Applying `data-ln-autoresize` to something other than a `<textarea>`

```html
<!-- WRONG — silent except for a console warning -->
<div data-ln-autoresize contenteditable>...</div>
```

The component checks `dom.tagName !== 'TEXTAREA'` and bails after
logging `[ln-autoresize] Can only be applied to <textarea>, got: DIV`.
The attribute on the element does nothing useful in this case. Use a
real `<textarea>` for auto-sizing input; for `contenteditable`
auto-grow, that is a different problem with a different solution
(usually nothing — `contenteditable` already grows naturally with
content because it is not constrained by `rows`).

### Mistake 6 — Forgetting to override `resize: vertical` on the textarea selector

```html
<textarea data-ln-autoresize rows="1"></textarea>
```

By default, the global `@mixin form-textarea` sets `resize: vertical`,
which gives the user a manual drag handle in the bottom-right corner.
The handle works — the user can drag — but as soon as they type,
`_resize` overwrites their dragged height with `scrollHeight`. The
result is a confusing "I just resized this and it snapped back"
moment. When you opt into auto-resize, set `resize: none` on the
selector to remove the conflicting affordance.

## Related

- **`@mixin form-textarea`** (`scss/config/mixins/_form.scss`) — the
  default textarea chrome (`min-height: 6rem`, `resize: vertical`).
  Override `resize` to `none` whenever you apply `data-ln-autoresize`.
- **`@mixin form-input`** (same file) — padding, border, focus ring
  used by every textarea regardless of autoresize.
- **[`ln-form`](../ln-form/README.md)** — the only library component
  that programmatically sets textarea values via a path that ALSO
  dispatches `input`. Use `ln-form:fill` instead of direct
  `.value =` writes whenever the textarea lives inside a
  `[data-ln-form]`.
- **Architecture deep-dive:** [`docs/js/autoresize.md`](../../docs/js/autoresize.md)
  for component internals, the two-step resize technique, and lifecycle.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  for why ln-autoresize sits outside the four-layer data flow (it is a
  pure presentation utility — no events, no state, no data).
