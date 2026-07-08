# Progress — architecture reference

> Implementation notes for `ln-progress`. The user-facing contract
> lives in [`js/ln-progress/README.md`](../../js/ln-progress/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-progress/src/ln-progress.js` (around 85 lines).

## Position in the architecture

`ln-progress` is a passive renderer. It owns no data, no transport,
no command surface — it derives a single visual (a `<div>` whose
`width` is a percentage) from two attributes (`data-ln-progress` on
the bar and `data-ln-progress-max` either on the bar or on its
parent track). Every state change comes from outside the component;
every internal state change comes from a re-read of the attributes.

The component dispatches a non-cancelable notification event
(`ln-progress:change`), not a cancelable command event. `_render`
always runs; the bar always updates; the event is purely a
notification. There is no default behaviour for a consumer to
override — rendering IS the contract.

## State

Each bar element gets a `_constructor` instance stored at
`element.lnProgress`. Instance state is one DOM reference and two
observers; nothing else.

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLElement` | whole instance | the bar element carrying `data-ln-progress` |
| `_attrObserver` | `MutationObserver` | built in `_listenValues` | watches the bar's own `data-ln-progress` and `data-ln-progress-max`; fires `_render` on change |
| `_parentObserver` | `MutationObserver \| null` | built in `_listenParent` | watches the parent track's `data-ln-progress-max`. |

There is no JS-side cached "value" property. `_render` reads the
attribute fresh on every call — the DOM is the source of
truth, no synchronisation needed. The same applies to max: re-resolved
(parent → own → default) on every `_render` invocation.

The track element gets NO instance. The track is marked with
`class="progress"` and is purely a styling hook — `class="progress"`
matches `@include progress` in `scss/components/_progress.scss`. The
track holds the wrapper for the bars and the optional
`data-ln-progress-max` for shared-max mode.

## Construction flow

`ln-progress` uses the standard `registerComponent` helper from `ln-core/helpers.js` to handle lifecycle management:

1. Wire up `registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _constructor, 'ln-progress')`.
2. A document-level observer managed by `registerComponent` catches new components added to the DOM.
3. For each match, it runs `new _constructor(item)` and assigns the result to `item.lnProgress`.

The `_constructor` does four things in order:

1. `this.dom = dom` — store back-reference.
2. `_render.call(this)` — compute the initial width from current
   attribute values and dispatch the first `ln-progress:change`.
3. `_listenValues.call(this)` — register the per-bar attribute observer.
4. `_listenParent.call(this)` — register the parent-track observer.

The first `:change` event fires inside `_render` during construction.
A document-level listener attached BEFORE the bundle loads will see
this event for every bar on the page during `DOMContentLoaded`.

## Render flow

`_render` is the only function that mutates DOM after construction. It reads three attributes (value, parent's max,
own max), computes one number (clamped percentage), and writes six DOM artefacts:
`style.width`, the four ARIA attributes (`role`, `aria-valuemin`, `aria-valuemax`,
`aria-valuenow` — `aria-valuenow` clamped to `[0, max]`), and the dispatched event.

Five implementation choices worth flagging:

1. **`|| 0` / `|| 100` fallbacks.** `parseFloat('')` is `NaN`, which
   is falsy, so `NaN || 0` is `0`. Same for any non-numeric string.
   There is no warning or error path — invalid input silently becomes
   the default. Typos like `data-ln-progress="abc"` produce 0% bars
   without console feedback.

2. **Parent-max precedence.** The parent always wins when it declares a positive max — this is the shared-max mode that makes stacked bars work. The `parentMax || ...` chain means a parent declaring `data-ln-progress-max="0"` falls through to the own/default, because `0` is falsy.

3. **`max > 0` guard.** Avoids divide-by-zero and divide-by-negative.
   If `max` after the chain is `0` or negative, percentage is forced
   to 0%.

4. **Clamping at the percentage level, not the attribute level.** The
   clamp runs on the computed percentage, not on the input value. The attribute is left as-written. A listener gets the *raw* value in `e.detail.value` and the *clamped* percentage in `e.detail.percentage`.

5. **`style.width` write, not a class swap.** Width is per-instance
   continuous state; class is per-instance discrete state (colour
   variant). Writing the percentage as an inline style is the
   simplest path.

6. **Auto-managed ARIA.** Each render writes `role="progressbar"`, `aria-valuemin="0"`, `aria-valuemax="<max>"`, and `aria-valuenow="<clamped value>"` on the bar.

## MutationObserver — what triggers a re-render

There are **three** observers in play for any given bar:

1. **`registerComponent` observer** — document-level, managed by `ln-core`. Watches `document.body` for added/removed nodes and instantiates matching bars.

2. **`_attrObserver` per bar** — built by `_listenValues`, attached to the bar element. Fires `_render` on any mutation of `data-ln-progress` or `data-ln-progress-max`.

3. **`_parentObserver` per bar** — built by `_listenParent`, attached to the parent track element. Fires `_render` on the bar when the parent's max changes. Unlike previous versions, this observer is always registered if a parent element exists, allowing dynamic runtime updates of parent max.

## Max priority resolution

The resolution chain in `_render` reads parent max first, then own max, then defaults to 100 — all via `||` short-circuit.

| Priority | Source | Truthy check |
|---|---|---|
| 1 | parent track's `data-ln-progress-max` parsed as float | finite number > 0 (NaN and 0 are both falsy) |
| 2 | this.dom.getAttribute('data-ln-progress-max') parsed as float | own-max parses to a finite number > 0 |
| 3 | `100` (default) | always |

## Cleanup

`destroy()` does three things:

1. Disconnects the per-bar `_attrObserver`.
2. Disconnects the per-bar `_parentObserver` if it exists.
3. Deletes `el.lnProgress`.

What it does NOT do:

- Does NOT remove `data-ln-progress`, `data-ln-progress-max`, the
  colour class, or the inline `style.width`. The bar element remains
  visually unchanged after destroy; only the JS plumbing is gone.
- Does NOT prevent re-instantiation. Any subsequent attribute write that touches `data-ln-progress` triggers the global observer, which will re-instantiate the component.

## What's NOT in the source

- **No indeterminate / striped / pulsing mode.** The component IS
  the determinate bar; indeterminate is a different idiom (`@mixin loader` for a spinner).
- **No threshold colour logic.** Colour is via class, set by the consumer.
- **No `setValue(n)` / `setMax(n)` / `redraw()` API.** The attribute is the API.
