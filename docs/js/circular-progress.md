# Circular Progress — architecture reference

> Implementation notes for `ln-circular-progress`. The user-facing
> contract lives in [`js/ln-circular-progress/README.md`](../../js/ln-circular-progress/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-circular-progress/ln-circular-progress.js` (133 lines).

## Position in the architecture

`ln-circular-progress` is a **passive renderer** in the architecture
described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md).
It owns no data, no transport, no command surface — it derives a
single visual (an SVG ring with a label) from two attributes
(`data-ln-circular-progress` and `data-ln-circular-progress-max`)
plus an optional label override. Every state change comes from
outside the component; every internal state change comes from a
re-read of the attributes.

This is the same shape as `ln-progress` (linear sibling),
`ln-stepper` (step indicator), and the display layer of
`ln-data-table`. Each one consumes attributes, produces visuals,
announces a change event, and exposes no setter API. The pattern is
deliberate: it forces the consumer's mutation channel to be the
attribute, which means the state is always visible in DOM Inspector,
serialisable, replayable from server-rendered markup, and reactive
to declarative updates without a separate "JS state" to keep in sync.

The architectural decision worth flagging: the component dispatches
a **non-cancelable** notification event (`ln-circular-progress:change`),
not a cancelable command event. There is no analogue of
`ln-search:change`'s "preventDefault to opt out of default behaviour"
— `_render` always runs, the SVG always updates, and the event is
purely a notification. This is correct for a passive renderer:
there is no default behaviour for a consumer to override. The
rendering IS the contract.

The contrast with `ln-search` is instructive: `ln-search` exists to
announce user intent, and the right shape for "intent" is a
cancelable event the listener can claim. `ln-circular-progress`
exists to display state, and the right shape for "state" is an
attribute that drives a render — cancelability would mean
"prevent the visual from updating," which is meaningless for a
display component.

## State

Each `[data-ln-circular-progress]` element gets a `_constructor`
instance stored at `element.lnCircularProgress`. Instance state is
the constructed DOM and the observer; nothing else.

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLElement` | Whole instance | The host element carrying `data-ln-circular-progress` |
| `svg` | `SVGSVGElement` | Built in `_buildSvg` (immediately after construction) | The constructed `<svg viewBox="0 0 36 36">` |
| `trackCircle` | `SVGCircleElement` | Built in `_buildSvg` | The grey background circle, stroke = `var(--color-border)` |
| `progressCircle` | `SVGCircleElement` | Built in `_buildSvg` | The fill circle whose `stroke-dashoffset` carries the progress, stroke = `var(--color-accent)` |
| `labelEl` | `HTMLElement` | Built in `_buildSvg` | The `<strong class="ln-circular-progress__label">` element |
| `_attrObserver` | `MutationObserver` | Built in `_listenValues` | Watches the host's `data-ln-circular-progress` and `-max` attributes; fires `_render` on change |

There is no JS-side cached "value" property. `_render` reads the
attribute fresh on every call (line 109) — the DOM is the source of
truth, no synchronisation needed. The same applies to max and label:
each is read inside `_render` at the moment it executes.

The `_buildSvg` function runs once at construction and is
non-idempotent: it creates the SVG and label as new DOM nodes via
`document.createElementNS` and `document.createElement`, then
appends them to the host. There is no rebuild path; if you destroy
and re-init, the constructor runs fresh and creates new nodes. The
`registerComponent` re-init guard via `el.lnCircularProgress`
prevents accidental double-build.

## Construction flow

`registerComponent('data-ln-circular-progress', 'lnCircularProgress', _constructor, 'ln-circular-progress')`
at line 132 wires the standard scaffolding:

1. **Selector + attribute** registers the element type with
   ln-core's shared MutationObserver.
2. The shared observer watches `document.body` for new
   `[data-ln-circular-progress]` elements (childList) and for the
   attribute landing on existing elements (attribute filter). New
   matches run `new _constructor(el)`.
3. The constructor sets `this.dom = dom`, then immediately calls
   `_buildSvg.call(this)` to create and append the SVG and label.
4. `_render.call(this)` runs to compute the initial arc offset
   from the current attribute values and dispatch the first
   `ln-circular-progress:change` event.
5. `_listenValues.call(this)` registers the per-instance
   MutationObserver that watches the host's value and max
   attributes for subsequent changes.
6. `dom.setAttribute('data-ln-circular-progress-initialized', '')`
   marks the element as initialised. (Defensive — `registerComponent`'s
   own guard via `el.lnCircularProgress` covers the same case.)

The instance is returned (line 25) and assigned to
`el.lnCircularProgress` by `registerComponent`'s standard wiring.

The first `:change` event fires inside `_render` during construction.
A document-level listener attached before the bundle loads will see
this event for every initial render on the page. A listener attached
AFTER `DOMContentLoaded` will miss the initial render for any
component that constructed earlier — the event has already
dispatched. This is normal behaviour for passive renderers; if you
need to know the post-init values, read them from the attributes
directly (or from `e.detail` of subsequent events).

## SVG geometry

The geometric constants are module-level (lines 10–12) and not
configurable per instance:

```js
const VIEW_SIZE = 36;
const RADIUS = 16;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;   // ≈ 100.531
```

The `viewBox` is `"0 0 36 36"`, the SVG element fills the host
(`width: 100%`, `height: 100%`), and both circles have `cx=18`,
`cy=18`, `r=16`. That leaves a 2-unit margin on each side of the
viewBox to accommodate the `stroke-width="3"` (which centres on the
radius — 1.5 inside, 1.5 outside).

The progress circle has:

- `stroke-linecap="round"` — softens the start and end of the arc;
  matters most when the value is small (so a short arc still has
  rounded ends).
- `stroke-dasharray="100.531..."` — the full circumference, so
  exactly one "dash" wraps the circle.
- `stroke-dashoffset="100.531..."` — initial offset = full
  circumference, which renders as 0% drawn (the dash starts at
  position 0 but is offset by the full length, so nothing is
  visible).
- `transform="rotate(-90 18 18)"` — rotates the circle so the dash
  starts at 12 o'clock instead of 3 o'clock.

`_render` computes the new offset:

```js
const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
```

At percentage=0: offset = circumference (full offset, nothing
drawn). At percentage=100: offset = 0 (no offset, full circle
drawn). Between those, offset decreases linearly with percentage.

The CSS rule `transition: stroke-dashoffset var(--transition-base)`
in `@mixin circular-progress` (gated through `@include motion-safe`)
animates the change over the project's standard transition duration.
Reduced-motion users see an instant snap.

## Render flow

`_render` is the only function that mutates DOM after construction.
It reads three attributes, computes one number, and writes two DOM
properties:

```js
function _render() {
    const value = parseFloat(this.dom.getAttribute('data-ln-circular-progress')) || 0;
    const max = parseFloat(this.dom.getAttribute('data-ln-circular-progress-max')) || 100;
    let percentage = (max > 0) ? (value / max) * 100 : 0;

    if (percentage < 0) percentage = 0;
    if (percentage > 100) percentage = 100;

    const offset = CIRCUMFERENCE - (percentage / 100) * CIRCUMFERENCE;
    this.progressCircle.setAttribute('stroke-dashoffset', offset);

    const label = this.dom.getAttribute('data-ln-circular-progress-label');
    this.labelEl.textContent = label !== null ? label : Math.round(percentage) + '%';

    dispatch(this.dom, 'ln-circular-progress:change', { ... });
}
```

Three implementation choices worth flagging:

1. **`|| 0` / `|| 100` fallbacks.** `parseFloat('')` is `NaN`,
   which is falsy, so `NaN || 0` is `0`. Same for any non-numeric
   string. There is no warning or error path — invalid input
   silently becomes the default. This is consistent with the
   passive-renderer pattern (the component reflects state, doesn't
   police it) but means typos like `data-ln-circular-progress="abc"`
   produce 0% rings without console feedback.

2. **`max > 0` guard.** Avoids divide-by-zero and divide-by-negative.
   If max is 0 or negative (after parseFloat), percentage is forced
   to 0%. Mathematically a max of 0 is undefined; rendering 0% is a
   reasonable fallback.

3. **Clamping at the percentage level, not the attribute level.**
   The clamp runs on the computed percentage (lines 113–114), not on
   the input value. The attribute is left as-written. This means a
   listener gets the *raw* value in `e.detail.value` and the
   *clamped* percentage in `e.detail.percentage` — two different
   numbers, intentionally exposed. Consumers that care about
   overshoot (`value > max`) read `value` directly.

The `:change` event dispatches `{ target, value, max, percentage }`
where `value` is unclamped, `max` is the parsed max, and
`percentage` is clamped 0–100. Listeners that want to render a
"completing!" badge gate on `percentage >= 100`; listeners that want
to detect "buggy upstream sent value=200" gate on
`value > max`.

## MutationObserver — what triggers a re-render

`_listenValues` registers a per-instance `MutationObserver` watching
the host element with `attributeFilter: ['data-ln-circular-progress',
'data-ln-circular-progress-max']` (line 102). On any mutation
matching either name, `_render` runs.

Two things NOT in the filter, deliberately:

1. **`data-ln-circular-progress-label`** — the label attribute is
   read inside `_render` but is not a trigger. Mutating it alone
   does not update the displayed label. The user-facing reasoning:
   labels are a display concern, values are state; re-rendering on
   label change would mean re-rendering the arc on every label
   write, which is wasted work for the common case (label is set
   once with the value). The trade-off is the consumer must
   re-write a value (or rewrite the same value to itself) to flush
   a label-only change.

2. **`class`** — colour and size variants are class-driven. The
   visual change happens via plain CSS rules in
   `scss/components/_circular-progress.scss`; no JS reaction is
   needed because nothing about the SVG geometry depends on the
   class. The arc length is the same; only the stroke colour or the
   container size changes.

The observer is per-instance (each component creates its own),
which is acceptable here because there is no shared state to
coordinate. The shared observer in `registerComponent` watches for
*new* `[data-ln-circular-progress]` elements appearing in the DOM;
the per-instance observer watches an already-instantiated host for
*value* changes. They are different concerns; running both is the
canonical pattern across the project's components.

## Cleanup

`destroy()` (lines 28–41) does four things:

1. Disconnects the per-instance attribute observer.
2. Removes the SVG element from the DOM.
3. Removes the label element from the DOM.
4. Removes the `data-ln-circular-progress-initialized` marker and
   deletes the `el.lnCircularProgress` reference.

What it does NOT do:

- Does NOT remove `data-ln-circular-progress` itself. The attribute
  remains on the host. The consequence: the `registerComponent`
  shared observer will not auto-re-init unless the attribute is
  also re-set (which the observer interprets as a new mutation).
  Setting any value on the attribute after `destroy()` does
  trigger re-initialisation.
- Does NOT remove the colour or size class. The host keeps
  `class="success lg"` after destroy.
- Does NOT dispatch a `:destroyed` event. Cleanup is silent.
- Does NOT clean up CSS rules. The `@mixin circular-progress` is
  applied via the global `[data-ln-circular-progress]` selector;
  if the attribute remains, the selector still matches, but the
  ring is gone (no SVG inside). The host is now an empty styled
  element.

The `destroy()` path is rarely exercised in practice — the typical
lifecycle is "construct on page load, never destroy." The path
exists because the project's component contract requires it; it
covers the case where a parent component is removed and wants to
clean up its descendants explicitly, or test scaffolding wants to
recycle elements.

## Integration with theme tokens

The two SCSS variables read by the mixin are:

- `--color-border` — track stroke. Default vocabulary:
  `var(--border-subtle)`. Themes rebind `--border-subtle` at theme
  `:root`; the track follows automatically.
- `--color-accent` — fill stroke. Default vocabulary:
  `var(--color-primary)` (resolved through the project's accent
  layer in `_tokens.scss`). Themes rebind the accent vocabulary;
  the fill follows.

Both are read at the consumer (the SVG circle elements), not at the
mixin definition site, which means the cascade through theme
overrides resolves correctly. A `[data-theme="glass"]` ancestor
shifts both the track and fill simultaneously, no per-component CSS
needed.

The shipped colour variants (`.success`, `.error`, `.warning`)
override `stroke` directly on `.ln-circular-progress__fill`, NOT
via `--color-accent`. This was the choice in `scss/components/_circular-progress.scss`
because the variant colours are absolute (a "success" indicator
should be green even if the theme's accent is blue) and rebinding
the accent token would propagate the colour into elsewhere. The
direct stroke override is selector-scoped to the fill circle and
does not leak.

There are TWO valid override paths, both documented:

**Path 1 — token cascade (theme-aware).** Override `--color-primary`
on the element or a wrapper. The `--color-accent` token is wired at
`:root` to `hsl(var(--color-primary))`, so changing `--color-primary`
at consumer scope re-resolves `--color-accent` at the fill's read
site. The mixin's header comment documents this path:

```scss
// [data-ln-circular-progress].success { --color-primary: var(--color-success); }
```

This is the right path for custom variants that should follow theme
shifts (Glass, Dark, etc).

**Path 2 — direct stroke override.** The shipped `.success`,
`.warning`, `.error` variants in `scss/components/_circular-progress.scss`
override `stroke` directly on `.ln-circular-progress__fill` with
absolute status colours. They intentionally bypass the token cascade
because a "success" indicator should be green regardless of theme
accent. The selector is scoped to the fill circle so it does not
leak.

Use Path 1 when the variant should adapt to theme. Use Path 2 when
the colour is semantically absolute.

## Why not derive from `<progress>` or use a Web Component?

Two architectural alternatives that were not chosen:

**Native `<progress>` with overlay SVG.** The native element would
provide implicit ARIA (`role="progressbar"`, `aria-valuenow`
synchronised with the value attribute), saving the consumer the
manual ARIA wiring documented in the README. The trade-off: the
native element is a non-replaceable inline-block that cannot be
visually replaced, only overlaid. The component would render an
absolutely-positioned SVG on top of an invisible `<progress>`,
which would mean the host element has two overlapping children
with conflicting layout expectations, and the value / max
attributes would have to be synchronised between the `<progress>`
attributes (`value`, `max`) and the data-attributes the SVG reads
(`data-ln-circular-progress`, `-max`). The save-on-ARIA is real
but small; the cost in markup complexity and synchronisation bugs
is larger.

**Custom Element / Web Component.** A `<ln-circular-progress>` tag
with a Shadow DOM would encapsulate the SVG construction. The
trade-off: the project's components are universally
data-attribute-based for consistency, server-side rendering
friendliness (a custom tag in a Blade template might not register
before the browser parses it), and zero-build SCSS coupling
(`@mixin circular-progress` applies to a CSS selector, not a
shadow-root host). Adopting Custom Elements for one component
would create a stylistic split with the rest of the library.
The consistency win of staying with `data-*` attributes outweighs
the encapsulation that Shadow DOM provides for a 133-line component.

Neither alternative is wrong; the project's choice is a coherence
choice, not a correctness one.

## Performance characteristics

| Operation | Cost |
|---|---|
| Construction | O(1) per instance — three DOM nodes created (SVG + 2 circles + 1 label), one MutationObserver. Multiple instances on a page scale linearly. |
| Attribute write (value or max) | O(1) — one MutationObserver fire, one `_render` call, two `setAttribute` writes (one for `stroke-dashoffset`, the implicit `textContent` write), one event dispatch. |
| Attribute write (label only) | O(0) — the observer does not fire; nothing happens until the next value/max write |
| Class change | O(0) on the JS side — the CSS rule re-matches automatically; no JS reaction. |
| Initial render at construction | Same as a value write — one `_render` call. |
| Destroy | O(1) — one MutationObserver disconnect, two DOM removals. |

The component's runtime cost is dominated by the CSS transition
(GPU compositing of the `stroke-dashoffset` change), not by the JS.
A full-page upload-progress flow with one ring at 60Hz mutation
rate produces 60 MutationObserver fires per second per ring — fine
on a typical page, profileable as a hot spot if a thousand rings
are on screen at once. The READMEs's "Common mistakes" item 5
documents the throttle pattern.

## What's NOT in the source — anti-features

The 133-line size is partially the result of explicit decisions
not to include things:

- **No indeterminate mode.** No spinning ring, no
  `data-ln-circular-progress="indeterminate"` switch. The component
  IS the determinate ring; indeterminate is a different idiom
  (`@mixin loader` for a spinner).
- **No threshold colour logic.** No "auto-red below 30%, green
  above 70%." Colour is via class, set by the consumer.
- **No animation curves / easing options.** The transition is a
  fixed `var(--transition-base)`; consumers wanting different
  curves rebind the token on the host scope.
- **No `setValue(n)` / `setMax(n)` / `redraw()` API.** The
  attribute is the API.
- **No `:initialized` / `:destroyed` events.** Only `:change` (which
  fires once at construction, serving the same purpose).
- **No parent-track shared max** (which `ln-progress` does support).
  A consumer that wants three rings to share a denominator sets
  `data-ln-circular-progress-max` on each.
- **No automatic ARIA writing** (`role`, `aria-valuenow`, etc.).
  Consumer responsibility.
- **No debounce / throttle on rapid attribute writes.** Each write
  triggers a render. Consumer responsibility for high-frequency
  flows.

Each absence is a maintenance saving: every feature would be code,
attribute filters, edge cases, and tests to keep alive. Keeping the
component to "two attributes, one render path" is the design.
