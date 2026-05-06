# Tooltip

> Implementation notes for `ln-tooltip`. The user-facing contract
> lives in [`js/ln-tooltip/README.md`](../../js/ln-tooltip/README.md);
> this document explains *how* the two-layer tooltip works internally
> and why the JS enhance layer was built the way it was.

File: `js/ln-tooltip/ln-tooltip.js`

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
the page's data flow. There is no show/hide event surface — tooltips
are passive labels, not workflows.

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
show and removed on hide.

## Show / hide flow

### `_show(trigger)` — line 44

1. **Same-trigger guard.** If `activeTrigger === trigger`, return immediately. Prevents a second
   `mouseenter` (browsers fire this when a child element is hovered) from recreating the bubble.
2. **Hide previous.** Call `_hide()` to clear any active tooltip from a different trigger.
3. **Read text.** `trigger.getAttribute('data-ln-tooltip')`, falling back to
   `trigger.getAttribute('title')` if empty. If both are empty, abort silently.
4. **Ensure portal.** `_ensurePortal()` creates the portal `<div>` if it does not exist.
5. **Stash `title`.** If the trigger has a `title` attribute, save it on the module-scoped
   `activeStashedTitle` and remove it from the element. Prevents the browser's native tooltip from
   appearing alongside the styled one. Restored on hide.
6. **Build and attach the node.** Create `<div class="ln-tooltip">`, set `node.textContent = text`,
   assign a stable id (`'ln-tooltip-' + uidCounter` on first show — reused on subsequent shows to
   keep `aria-describedby` stable). `portal.appendChild(node)` — must be in the DOM before
   measuring so `offsetWidth` / `offsetHeight` read real layout values.
7. **Compute placement.** `getBoundingClientRect()` on the trigger plus the preferred side from
   `data-ln-tooltip-position` (default `top`) feed into `computePlacement(rect, size, preferred, 6)`.
   The `6` is the pixel gap. Returns `{ top, left, placement }` — the side that won after auto-flip.
8. **Position and reflect.** Write `node.style.top` / `node.style.left` (the only two inline styles
   `ln-tooltip.js` writes) and `data-ln-tooltip-placement` on the bubble.
9. **Wire `aria-describedby` and track active.** `trigger.setAttribute('aria-describedby', node.id)`,
   then `activeTooltipNode = node; activeTrigger = trigger;`.
10. **Ensure ESC listener.** `_ensureEscListener()` registers a `document` keydown listener if not
    already present.

### `_hide()` — line 95

1. **No-active guard.** If `activeTooltipNode` is `null`, remove the
   ESC listener (idempotent) and return.
2. **Restore `title`.** If `activeStashedTitle !== null`, write it
   back on the trigger.
3. **Remove `aria-describedby`.** Clear the description wiring.
4. **Detach the bubble.** `parentNode.removeChild(node)` — the
   tooltip node is destroyed, not cached.
5. **Clear active state.** `activeStashedTitle = null;
   activeTooltipNode = null; activeTrigger = null;`.
6. **Remove ESC listener.** Zero document-level listeners while no
   tooltip is visible.

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
hover dwell of about 1 second. The CSS baseline cannot solve this —
`attr()` reads the attribute but cannot remove it. Only JS can.

The stash uses a module-level variable (`activeStashedTitle`).
A module-level slot is sufficient because of the one-tooltip invariant.

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

`content: none` removes the generated box entirely, avoiding any risk of an empty pseudo-element interfering with hover detection on the trigger.

### JS-disabled degradation

If the JS bundle is absent or has not yet executed, the auto-enhance
suppressor `[data-ln-tooltip][title]::after { content: none }`
still fires — it is static CSS that loads with the rest of the
library stylesheet. The affected element falls back to the
browser's native `title` tooltip with no styled bubble. There is no
flash of the CSS baseline before JS init, because the suppressor is
already in effect at parse time.

For elements with explicit `data-ln-tooltip-enhance` but no
`title`, JS-disabled degradation suppresses the bubble entirely.
That is acceptable — explicit `-enhance` is a deliberate consumer
choice, and a JS-disabled environment is a known consumer cost.

## Visual recipe sharing — `@mixin tooltip-bubble`

The "small dark bubble" visual chrome lives in
`@mixin tooltip-bubble` (`scss/config/mixins/_tooltip.scss`
lines 11–24). It is composed by three component mixins:

| Component | Mixin | Selector | Purpose |
|-----------|-------|----------|---------|
| CSS baseline | `@mixin tooltip` (line 26) | `[data-ln-tooltip]::after` | Pseudo-element bubble with four position variants |
| JS portal | `@mixin tooltip-element` (line 102) | `.ln-tooltip` | Real DOM bubble with `max-width: 20rem` and slide-in animation |
| Confirm icon-mode | `@mixin confirm-tooltip` (line 14) | `.ln-confirm-tooltip::after` | Pseudo-element prompt above an armed icon-only confirm button |

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
