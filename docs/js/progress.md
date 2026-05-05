# Progress — architecture reference

> Implementation notes for `ln-progress`. The user-facing contract
> lives in [`js/ln-progress/README.md`](../../js/ln-progress/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-progress/ln-progress.js` (145 lines).

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
| `_attrObserver` | `MutationObserver` | built in `_listenValues` (lines 81–97) | watches the bar's own `data-ln-progress` and `data-ln-progress-max`; fires `_render` on change |
| `_parentObserver` | `MutationObserver \| null` | built in `_listenParent` (lines 99–118) — conditional | watches the parent track's `data-ln-progress-max`. `null` if the parent did not have that attribute at construction. |

There is no JS-side cached "value" property. `_render` reads the
attribute fresh on every call (line 121) — the DOM is the source of
truth, no synchronisation needed. The same applies to max: re-resolved
(parent → own → default) on every `_render` invocation.

The track element gets NO instance. The track is marked with
`class="progress"` and is purely a styling hook — `class="progress"`
matches `@include progress` in `scss/components/_progress.scss`. The
track holds the wrapper for the bars and the optional
`data-ln-progress-max` for shared-max mode.

## Construction flow

The bottom of the IIFE wires three things:

1. `window.lnProgress = constructor` (line 136) — the public manual
   re-init handle. Calling `window.lnProgress(root)` runs
   `findElements(root)` over `root`.
2. `_domObserver()` (line 79) — the document-level observer that
   catches AJAX inserts and `data-ln-progress` attribute changes
   anywhere in `document.body`.
3. The DOMContentLoaded gate (lines 138–144) runs
   `constructor(document.body)` on initial load.

When `findElements` runs over a subtree:

1. Iterates every `[data-ln-progress]` descendant.
2. For each, checks `!item[DOM_ATTRIBUTE]` — not already
   instantiated. (No value filter — the track is class-based now;
   every match IS a bar candidate.)
3. For each match, runs `new _constructor(item)` and assigns the
   result to `item.lnProgress`.
4. Handles the case where the subtree root itself has the attribute
   (lines 28–30) — `domRoot.querySelectorAll` does not include the
   root, so it is checked separately.

The `_constructor` (lines 33–41) does four things in order:

1. `this.dom = dom` — store back-reference.
2. `_render.call(this)` — compute the initial width from current
   attribute values and dispatch the first `ln-progress:change`.
3. `_listenValues.call(this)` — register the per-bar attribute
   observer.
4. `_listenParent.call(this)` — register the parent-track observer
   (conditional; bails if the parent has no `data-ln-progress-max`).

The instance is returned and the construction guard via
`!item[DOM_ATTRIBUTE]` in `findElements` prevents double-init. JS is
single-threaded, so the read-then-assign sequence inside
`findElements` (lines 22–25) is race-safe — no other code can
interleave between the check and the assignment.

The first `:change` event fires inside `_render` during construction.
A document-level listener attached BEFORE the bundle loads will see
this event for every bar on the page during `DOMContentLoaded`. A
listener attached AFTER `DOMContentLoaded` will miss the initial
render for any bar that constructed earlier — the event has already
dispatched.

## Render flow

`_render` (lines 120–134 of `js/ln-progress/ln-progress.js`) is the only function
that mutates DOM after construction. It reads three attributes (value, parent's max,
own max), computes one number (clamped percentage), and writes six DOM artefacts:
`style.width`, the four ARIA attributes (`role`, `aria-valuemin`, `aria-valuemax`,
`aria-valuenow` — `aria-valuenow` clamped to `[0, max]`), and the dispatched event.

Five implementation choices worth flagging:

1. **`|| 0` / `|| 100` fallbacks.** `parseFloat('')` is `NaN`, which
   is falsy, so `NaN || 0` is `0`. Same for any non-numeric string.
   There is no warning or error path — invalid input silently becomes
   the default. Typos like `data-ln-progress="abc"` produce 0% bars
   without console feedback.

2. **Parent-max precedence.** Line 126 reads
   `const max = parentMax || ownMax || 100`. The parent always wins
   when it declares a positive max — this is the shared-max mode
   that makes stacked bars work. The `parentMax || ...` chain
   (rather than a strict `parentMax !== null` check) means a parent
   declaring `data-ln-progress-max="0"` falls through to the
   own/default, because `0` is falsy. Same for non-numeric parent
   values (`NaN` is falsy).

3. **`max > 0` guard.** Avoids divide-by-zero and divide-by-negative.
   If `max` after the chain is `0` or negative, percentage is forced
   to 0%.

4. **Clamping at the percentage level, not the attribute level.** The
   clamp runs on the computed percentage (lines 129–130), not on the
   input value. The attribute is left as-written. A listener gets
   the *raw* value in `e.detail.value` and the *clamped* percentage
   in `e.detail.percentage` — two different numbers, intentionally
   exposed. Consumers that care about overshoot (`value > max`) read
   `value` directly.

5. **`style.width` write, not a class swap.** Width is per-instance
   continuous state; class is per-instance discrete state (colour
   variant). Writing the percentage as an inline style is the
   simplest path — `style.width = '57.143%'` is a one-liner. A
   class-based approach would need 100+ classes (`.w-57`, `.w-58`,
   …) or a CSS variable rebind (`--bar-width: 57.143%`); the inline
   style is shorter and identical in effect.

6. **Auto-managed ARIA.** Each render writes
   `role="progressbar"`, `aria-valuemin="0"`,
   `aria-valuemax="<max>"`, and `aria-valuenow="<clamped value>"` on
   the bar. `aria-valuenow` clamps to `[0, max]` (mirroring the
   visual width clamp), so screen-reader reports match the rendered
   bar even on overshoot. The four ARIA attributes are NOT in the
   `_attrObserver`'s `attributeFilter`, so the component's own writes
   do not retrigger `_render` — no loop. `destroy()` does NOT remove
   them, symmetric with `style.width` / `data-ln-progress` already
   being left on the element.

## MutationObserver — what triggers a re-render

There are **three** observers in play for any given bar:

1. **`_domObserver`** (lines 54–77) — document-level, one per page
   (the IIFE registers it once via the double-load guard at line 7).
   Watches `document.body` with
   `attributeFilter: ['data-ln-progress']`. Catches:
   - `childList` mutations: new elements added to the DOM (AJAX
     inserts, `innerHTML` writes). Calls `findElements(item)` on
     each added element.
   - `attributes` mutations on `data-ln-progress`: an existing
     element gains the attribute. `findElements(mutation.target)`
     is called, which initialises an instance if not already present.

2. **`_attrObserver` per bar** (lines 81–97) — built by
   `_listenValues`, attached to the bar element with
   `attributeFilter: ['data-ln-progress', 'data-ln-progress-max']`.
   Fires `_render` on any mutation matching either attribute name.

3. **`_parentObserver` per bar (conditional)** (lines 99–118) —
   built by `_listenParent`, attached to the parent track element
   with `attributeFilter: ['data-ln-progress-max']`. ONLY attached
   if `parent.hasAttribute('data-ln-progress-max')` at construction
   time (line 102). Fires `_render` on the bar when the parent's
   max changes.

Two things NOT observed, deliberately:

1. **`class`** — colour variants are class-driven. The visual change
   happens via plain CSS rules in `scss/components/_progress.scss`;
   no JS reaction is needed because nothing about the bar's width
   computation depends on the class.

2. **The parent's `data-ln-progress-max` if it lands AFTER
   construction.** Watching for the parent to gain the attribute
   would require either a document-wide observer scanning every
   potential parent (expensive), or a per-bar observer on the parent
   that fires for ANY attribute write (with an internal filter),
   which is the same overhead. The current design treats
   parent-shared-max as a markup-time declaration, not a runtime
   feature. See "Edge case: late parent-max" below.

The shared `_domObserver` watches for *new* bars; the per-instance
observers watch an already-instantiated bar for *value* changes.

## Max priority resolution

The resolution chain in `_render` (line 126) reads parent max first,
then own max, then defaults to 100 — all via `||` short-circuit.

Three sources, in order:

| Priority | Source | Truthy check |
|---|---|---|
| 1 | `parent.getAttribute('data-ln-progress-max')` parsed as float | finite number > 0 (NaN and 0 are both falsy) |
| 2 | `this.dom.getAttribute('data-ln-progress-max')` parsed as float | own-max parses to a finite number > 0 |
| 3 | `100` (default) | always |

Two consequences worth noting:

- **`parentMax = 0`** falls through to own-max (because `0 || x = x`).
  Same for `parentMax = NaN`. A parent that intentionally declares
  `0` to "force empty bars" does not work — though that is a
  meaningless visual anyway, and the subsequent `(max > 0)` guard
  would force 0% even if the chain ended at `0`.
- **An own-max declaration is always overridden by parent-max.** Even
  if the bar declares `data-ln-progress-max="50"` and the parent
  declares `data-ln-progress-max="100"`, the bar's own max is
  silently ignored. If you genuinely need per-bar maxes inside a
  shared-max parent, do not declare the parent max — set each bar's
  own max individually and accept that the bars no longer fill the
  track in proportional fashion.

## Edge case: late parent-max

`_listenParent` (lines 99–118) bails on line 102 if the parent does
not currently declare `data-ln-progress-max`. The observer is not
lazy — it is conditional at construction.

Sequence that fails:

```js
// Markup: <div class="progress"><div id="b" data-ln-progress="4"></div></div>

// Bar #b constructs. Parent has no max. _listenParent bails immediately.
// b.lnProgress._parentObserver === null

// Later:
document.querySelector('.progress').setAttribute('data-ln-progress-max', '7');
// → Bar #b does NOT re-render. The parent's max change is not observed.
//   Bar #b still renders 4 / 100 = 4%.
```

The fix is one of three patterns:

1. Declare the parent max in markup (canonical).
2. After setting the parent max, force each bar to re-render by
   rewriting one of its own observed attributes (the bar's own
   `_attrObserver` fires, `_render` re-resolves max from scratch
   including the now-set parent max).
3. Destroy and re-init.

Adding a "watch the parent permanently" path would mean a per-bar
observer registered on the parent unconditionally, with an internal
guard checking whether the attribute is currently present. The
overhead is small per bar but multiplies across hundreds of bars on
a dashboard page. The current design optimises for the common case
(parent max declared in markup) and accepts the edge case (late
parent max).

## Cleanup

`destroy()` (lines 43–52) does three things:

1. Disconnects the per-bar `_attrObserver`.
2. Disconnects the per-bar `_parentObserver` if it exists.
3. Deletes `el.lnProgress`.

What it does NOT do:

- Does NOT remove `data-ln-progress`, `data-ln-progress-max`, the
  colour class, or the inline `style.width`. The bar element remains
  visually unchanged after destroy; only the JS plumbing is gone.
- Does NOT dispatch a `:destroyed` event. Cleanup is silent.
- Does NOT clean up the document-level `_domObserver` — that
  observer is shared across the whole page and runs for the
  lifetime of the document.
- Does NOT prevent re-instantiation. The bar's attribute is still on
  the element. Any subsequent attribute write that touches
  `data-ln-progress` triggers the document-level `_domObserver`,
  which runs `findElements`, which sees
  `!item.lnProgress` (true because destroy deleted it) and constructs
  a new instance. This is intentional: destroy is "stop watching this
  element," not "make it impossible to watch this element."

The `destroy()` path is rarely exercised in practice — the typical
lifecycle is "construct on page load, never destroy." The path
exists because the project's component contract requires it.

## Why local `findElements` (intentional divergence)

Most components in the project initialise via `registerComponent`
from `ln-core/helpers.js` — the shared scaffolding that handles
auto-init, MutationObserver, attribute filtering, and instance
storage. `ln-progress` does NOT use it. It carries its own local
`findElements` (lines 19–31) and `_domObserver` (lines 54–77).

The local `findElements` does no value filtering — every
`[data-ln-progress]` element is treated as a bar. The track is
marked structurally via `class="progress"`, never via the JS
attribute, so there is no ambiguity to discriminate.

The cost: `_domObserver` (lines 54–77) duplicates some scaffolding
that `registerComponent` provides. The benefit: a clean structural
split — track as CSS class, bar as JS attribute — instead of a
separate `data-ln-progress-track` / `data-ln-progress-bar` attribute
pair.

## What's NOT in the source

The 145-line size is partially the result of explicit decisions not
to include things:

- **No indeterminate / striped / pulsing mode.** The component IS
  the determinate bar; indeterminate is a different idiom
  (`@mixin loader` for a spinner). No `data-ln-progress="indeterminate"`
  switch.
- **No threshold colour logic.** No "auto-red below 30%, green
  above 70%." Colour is via class, set by the consumer.
- **No animation curves / easing options.** The transition is a
  fixed `var(--transition-base)`; consumers wanting different
  curves rebind the token on the bar scope.
- **No `setValue(n)` / `setMax(n)` / `redraw()` API.** The
  attribute is the API.
- **No `:initialized` / `:destroyed` events.** Only `:change` (which
  fires once at construction, serving the same purpose).
- **No debounce / throttle on rapid attribute writes.** Each write
  triggers a render. Consumer responsibility for high-frequency
  flows.
- **No late-parent-max watching.** The parent observer is
  conditional at construction. Consumer responsibility to declare
  the parent max in markup or to manually trigger a re-render
  after a late attribute write.

Each absence is a maintenance saving: every feature would be code,
attribute filters, edge cases, and tests to keep alive. Keeping the
component to "two attributes (or three with parent-shared), one
render path" is the design.
