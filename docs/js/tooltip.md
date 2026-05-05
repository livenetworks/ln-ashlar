# Tooltip

> Implementation notes for `ln-tooltip`. The user-facing contract
> lives in [`js/ln-tooltip/README.md`](../../js/ln-tooltip/README.md);
> this document explains *how* the two-layer tooltip works internally
> and why the JS enhance layer was built the way it was.

File: `js/ln-tooltip/ln-tooltip.js` (159 lines).

## Layer in the architecture

`ln-tooltip` is a **UI primitive** — it sits outside the four-layer
data architecture (Data, Submit, Render, Validate; see
[`docs/architecture/data-flow.md`](../architecture/data-flow.md)).
It does not own state, does not validate, does not submit, does not
render records. Its only job is to surface a small visual hint
adjacent to a trigger element while the user is hovering or focusing
that element.

That positioning matters: tooltips never participate in coordinator
events for data flow. They share no event channel with `ln-form`,
`ln-validate`, `ln-store`, or `ln-data-table`. The only event the
component dispatches is `ln-tooltip:destroyed`, a cleanup
notification. Tooltips are mechanically inert from the data layer's
perspective — adding or removing a tooltip changes nothing about
the page's data flow.

## Two layers, one contract

The `data-ln-tooltip` attribute drives both render strategies. Which
one renders depends on whether the JS layer attaches:

### CSS baseline

`scss/components/_tooltip.scss` applies `@mixin tooltip` to every
`[data-ln-tooltip]` element. The mixin generates a `::after`
pseudo-element with `content: attr(data-ln-tooltip)` (and
`attr(title)` as fallback when the attribute value is empty),
positions it relative to the trigger via `position: absolute`,
honors `data-ln-tooltip-position`, and toggles opacity on
`:hover` / `:focus-visible`.

Zero JS runs. This is the cheap path for the 95% of tooltips that
fit safely inside their layout. It works in any browser, has no
event listeners, and adds no DOM nodes.

### JS enhance

`js/ln-tooltip/ln-tooltip.js` attaches when an element matches one
of two selectors:

1. `[data-ln-tooltip-enhance]` — explicit opt-in.
2. `[data-ln-tooltip][title]` — auto-enhance, because the CSS
   baseline cannot strip the native `title` attribute and would
   otherwise let the browser's built-in tooltip leak alongside the
   styled one.

For elements that match either selector, `js/ln-tooltip/ln-tooltip.scss`
sets `content: none` on the `::after`, suppressing the CSS baseline.
The JS layer takes over rendering: a real DOM node inside
`#ln-tooltip-portal`, positioned via `computePlacement` with
viewport auto-flip, with `aria-describedby` wired on the trigger
while visible.

The HTML stays identical between the two layers. The text source
stays identical (`data-ln-tooltip` value, `title` fallback when
empty). The position attribute stays identical
(`data-ln-tooltip-position`). The two layers are semantically the
same component with two render strategies — one cheap, one
viewport-aware.

## Portal architecture

A single `<div id="ln-tooltip-portal">` is created lazily in `<body>`
on the first `_show` call (`_ensurePortal`, line 19). It is positioned
`fixed` at `(0, 0)` with `pointer-events: none` and
`z-index: var(--z-toast)` — the same z-layer as the toast container,
so tooltips render above modals and dropdowns regardless of stacking
context.

Each tooltip node is a `<div class="ln-tooltip">` with
`position: fixed` (set by `@mixin tooltip-element` in
`scss/config/mixins/_tooltip.scss` line 102). Coordinates are
viewport-relative and match what `computePlacement` returns. Using
`position: fixed` directly on the node — rather than
`position: absolute` inside the portal — avoids any dependency on
the portal as a positioning context, so the portal can be moved or
its containing block can change without affecting tooltip placement.

The portal is never destroyed. Once created, it persists in `<body>`
for the lifetime of the page. Tooltip nodes inside it are created on
show and removed on hide. This matches `ln-toast`'s container
pattern and avoids the cost of tearing down and recreating a
singleton DOM node every time the last tooltip closes.

## Show / hide flow

### `_show(trigger)` — line 44

1. **Same-trigger guard.** If `activeTrigger === trigger`, return
   immediately. This prevents a second `mouseenter` event (which
   browsers can fire when a child element is hovered) from
   recreating the bubble.
2. **Hide previous.** Call `_hide()` to clear any active tooltip
   from a different trigger. Only one tooltip is visible at a time
   — see "One visible at a time" below.
3. **Read text.** `trigger.getAttribute('data-ln-tooltip')`, falling
   back to `trigger.getAttribute('title')` if empty. If both are
   empty, abort silently — there is nothing to render.
4. **Ensure portal.** `_ensurePortal()` creates the portal `<div>`
   if it does not exist. Subsequent shows reuse it.
5. **Stash `title`.** If the trigger has a `title` attribute, save
   it on the module-scoped `activeStashedTitle` and remove it from
   the element. This prevents the browser's native `title` tooltip
   from appearing alongside the styled one during long hover dwells.
   Restored on hide.
6. **Build the node.** Create `<div class="ln-tooltip">`,
   `node.textContent = text`. The mixin chrome
   (`@mixin tooltip-element`) gives the node its dark bubble look,
   `max-width: 20rem`, and a slide-in animation gated by
   `motion-safe`.
7. **Assign id.** `trigger[DOM_ATTRIBUTE + 'Uid']` is the element's
   stable tooltip id, generated on first show
   (`'ln-tooltip-' + uidCounter`). Re-shows reuse the same id, which
   keeps `aria-describedby` references stable across multiple
   focus cycles — useful for assistive tech that may cache id
   references.
8. **Attach.** `portal.appendChild(node)`. The node is now in the
   DOM, so layout is real and `offsetWidth` / `offsetHeight` read
   accurate dimensions.
9. **Measure.** `node.offsetWidth` / `node.offsetHeight`. Because
   the node is already in the DOM with default styles applied, no
   `measureHidden` workaround is needed — that helper is for
   `display: none` elements (used by `ln-popover` because the
   popover element pre-exists in DOM and is hidden until open).
10. **Compute placement.** `getBoundingClientRect()` on the
    trigger plus the preferred side from
    `data-ln-tooltip-position` (default `top`) feed into
    `computePlacement(rect, size, preferred, 6)`. The `6` is the
    pixel gap between trigger and bubble. Returns
    `{ top, left, placement }` — the side that won after auto-flip.
11. **Position.** `node.style.top` and `node.style.left` get the
    viewport coordinates. These are the only two inline styles
    `ln-tooltip.js` writes — same accepted exception as
    `ln-popover.js` for floating-element coordinates that cannot
    be expressed in static CSS.
12. **Reflect placement.** `data-ln-tooltip-placement="top|bottom|left|right"`
    on the bubble. Useful for CSS-driven arrow direction in custom
    consumer styling.
13. **Wire `aria-describedby`.** `trigger.setAttribute('aria-describedby', node.id)`.
    Screen readers announce the tooltip text as a description after
    the trigger's accessible name.
14. **Track active.** `activeTooltipNode = node;
    activeTrigger = trigger;`.
15. **Ensure ESC listener.** `_ensureEscListener()` registers a
    `document` keydown listener if not already registered. Hides
    the tooltip on Escape.

### `_hide()` — line 95

1. **No-active guard.** If `activeTooltipNode` is `null`, just
   remove the ESC listener (idempotent) and return.
2. **Restore `title`.** If `activeStashedTitle !== null`, write it
   back on the trigger via `setAttribute('title', …)`.
3. **Remove `aria-describedby`.** Clear the description wiring.
4. **Detach the bubble.** `parentNode.removeChild(node)` — the
   tooltip node is destroyed, not cached.
5. **Clear active state.** `activeStashedTitle = null;
   activeTooltipNode = null; activeTrigger = null;`.
6. **Remove ESC listener.** `_removeEscListener()` — zero
   document-level listeners while no tooltip is visible.

## One visible at a time

The module-level `activeTrigger` and `activeTooltipNode` enforce a
hard single-tooltip invariant. A new `_show` call always hides the
previous bubble before rendering the new one. This matches the
CSS baseline (a hover can only be on one element at a time) and
avoids any bookkeeping for multi-bubble cases.

The same invariant means there is exactly one DOM node inside the
portal at any moment, and exactly one trigger has `aria-describedby`
wired. Nothing accumulates.

## Title fallback and native tooltip suppression

When `data-ln-tooltip` is empty, both the CSS baseline (lines 51–53
of `scss/config/mixins/_tooltip.scss`) and the JS layer (line 50 of
`ln-tooltip.js`) fall back to the `title` attribute. This enables
the semantic `<abbr data-ln-tooltip title="…">` pattern: HTML's
own way of carrying an abbreviation expansion drives the styled
tooltip's text.

The JS layer additionally **strips** the `title` attribute on show
and **restores** it on hide. The reason: the browser's built-in
`title` tooltip otherwise renders alongside the styled one after a
hover dwell of about 1 second, producing two visible bubbles. The
CSS baseline cannot solve this — `attr()` reads the attribute but
cannot remove it. Only JS can. That is why elements with
`[data-ln-tooltip][title]` auto-enhance: the JS layer is the only
thing that can suppress the native tooltip without removing
`title` permanently (which would harm accessibility tools that
read the attribute directly).

The stash uses a module-level variable (`activeStashedTitle`),
not a property on the trigger. This matches the
"one visible at a time" invariant — there is at most one stashed
title at any moment, so a single module-scoped slot is sufficient.
A multi-tooltip world would need a `WeakMap`; the single-tooltip
invariant makes the simpler approach safe.

## Coexistence with the CSS baseline

The CSS baseline activates on every `[data-ln-tooltip]` regardless
of whether the JS layer attaches. Two suppressor rules in
`js/ln-tooltip/ln-tooltip.scss` prevent the two bubbles from
rendering simultaneously:

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after,
[data-ln-tooltip][title]::after {
    content: none;
}
```

The first clause matches explicit opt-in. The second matches
auto-enhance triggers. Both clauses are purely additive — no
changes to `scss/components/_tooltip.scss` or
`scss/config/mixins/_tooltip.scss`. Elements that match neither
clause keep the CSS baseline completely unchanged.

`content: none` is preferred over `display: none` or
`visibility: hidden` because it removes the generated box entirely
rather than just hiding it. There is no risk of an invisible
empty pseudo-element interfering with hover detection on the
trigger.

### JS-disabled degradation

If the JS bundle is absent or has not yet executed, the auto-enhance
suppressor `[data-ln-tooltip][title]::after { content: none }`
still fires — it is static CSS that loads with the rest of the
library stylesheet. The affected element falls back to the
browser's native `title` tooltip with no styled bubble. This is the
cleanest possible degradation: matching browser defaults exactly.
There is no flash of the CSS baseline before JS init, because the
suppressor is already in effect at parse time.

For elements with explicit `data-ln-tooltip-enhance` but no
`title`, JS-disabled degradation suppresses the bubble entirely
(no styled tooltip, no native `title`). That is acceptable —
explicit `-enhance` is a deliberate consumer choice, and a
JS-disabled environment is a known consumer cost.

## Visual recipe sharing — `@mixin tooltip-bubble`

The "small dark bubble" visual chrome lives in
`@mixin tooltip-bubble` (`scss/config/mixins/_tooltip.scss`
lines 11–24). It is composed by three component mixins:

| Component | Mixin | Selector | Purpose |
|-----------|-------|----------|---------|
| CSS baseline | `@mixin tooltip` | `[data-ln-tooltip]::after` | Pseudo-element bubble with four position variants |
| JS portal | `@mixin tooltip-element` | `.ln-tooltip` | Real DOM bubble with `max-width: 20rem` and slide-in animation |
| Confirm icon-mode | `@mixin confirm-tooltip` | `.ln-confirm-tooltip::after` | Pseudo-element prompt above an armed icon-only confirm button |

The shared bubble defines the dark surface, the inverted text
color, the caption typography, the rounded corners, the floating
shadow, the `pointer-events: none`, and the
`z-index: var(--z-dropdown)`. The three composing mixins each add
their own positioning, content source, and activation rules.

This is a clean SCSS-mixin reuse pattern: **the visual recipe is
shared, but the JS components are independent.** `ln-tooltip` reads
`data-ln-tooltip` and runs hover/focus listeners; `ln-confirm`
reads `data-ln-confirm` and runs a click-armed two-stage state
machine, writing `data-tooltip-text` to drive its own `::after`
content. The two components share no JS code and reference each
other in zero places.

## Why no show/hide events

`ln-tooltip:show` and `ln-tooltip:before-show` events do not exist.
The reasoning mirrors `ln-toast`'s decision to skip enqueue events:

- A cancelable show event would add no realistic consumer value.
  No consumer needs to async-validate before letting a tooltip
  render — the tooltip is an ephemeral hover affordance, not a
  workflow gate. There is no business state that should ever
  prevent a tooltip from appearing.
- A fired show event would notify the consumer of the same hover
  the consumer already saw. The trigger is the consumer's own
  element; if the consumer wants to know about hover, they can
  attach a `mouseenter` listener directly. Adding a tooltip-
  specific event channel for hover would duplicate the platform's
  own event surface for no gain.

This is distinct from `ln-popover`, which **does** ship cancelable
open/close events because popovers contain interactive content and
a consumer may legitimately need to validate state (e.g., unsaved
changes) before allowing close. Tooltips have no interactive
content and no state to validate.

If a future use case ever demands show/hide events, add them then.
The current API surface is intentionally minimal until a concrete
need is demonstrated.

## Lifecycle

`registerComponent` (see `js/ln-core/helpers.js` line 293) wires
the component into a `MutationObserver` watching `document.body`
for matches against
`[data-ln-tooltip-enhance], [data-ln-tooltip][title]`. The observer
filter narrows attribute mutations to the two attribute names in
the selector — adding `data-ln-tooltip-enhance` to an existing
element initializes it on the next observer tick.

On init, the component attaches four listeners to the trigger
(lines 130–133):

- `mouseenter` (bubble) → `_show(el)`
- `mouseleave` (bubble) → `_hide()` if `activeTrigger === el`
- `focus` (capture) → `_show(el)`
- `blur` (capture) → `_hide()` if `activeTrigger === el`

Capture phase is used for focus/blur so events on focusable
descendants reach the trigger reliably. The mouseleave/blur
handlers check `activeTrigger === el` to avoid hiding a tooltip
that another trigger has since claimed.

The component never auto-destroys on element removal. If a trigger
is removed from the DOM, its event listeners are garbage-collected
along with the element. The explicit `destroy()` method (line 138)
exists for projects that need to unwire a tooltip without removing
the element — rare in practice. `destroy()` removes all four
listeners, calls `_hide()` if this trigger is currently active,
deletes the DOM-instance properties, and dispatches
`ln-tooltip:destroyed`.

The portal `<div>` and the ESC listener follow opposite lifecycles:

- **Portal** — created on first `_show`, never destroyed. Persists
  for the lifetime of the page.
- **ESC listener** — registered on `_show`, removed on `_hide`.
  Zero document-level overhead while no tooltip is visible.

## Why not a single shared tooltip node

An alternative implementation would cache one `<div class="ln-tooltip">`
inside the portal and reuse it across all triggers — only the
`textContent`, `top`, `left`, and `data-ln-tooltip-placement` would
update on each show. The current implementation creates and destroys
the node on every show/hide.

The chosen implementation wins on three points:

1. **Animation correctness.** `@mixin tooltip-element` ships a
   `motion-safe` `ln-tooltip-fade` slide-in keyframe. A reused node
   would not trigger the animation on subsequent shows because the
   keyframe binds to the element's lifecycle. A fresh node animates
   in every time, matching consumer expectations.
2. **Identity per trigger.** `aria-describedby` points at the
   bubble's `id`. A reused node would force the same id across
   triggers, requiring extra logic to ensure the description is
   the right one for the currently focused trigger. A fresh node
   has its own `id` — simpler.
3. **Cost is negligible.** Tooltip shows are user-initiated hover
   events at human latency (hundreds of milliseconds apart at
   minimum). Creating a `<div>` and one text node per show is in
   the noise compared to the layout work browsers do anyway when
   rendering the bubble.

The reuse pattern would be the right call if tooltips were
high-frequency (hundreds per second, e.g., a virtualized list's
visible-row tooltips). They are not.
