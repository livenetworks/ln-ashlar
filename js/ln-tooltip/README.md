# ln-tooltip

> A two-layer tooltip primitive: a CSS-only baseline that activates on
> any `[data-ln-tooltip]` element with zero JavaScript, and a 159-line
> JS enhance layer that opts in per element for viewport-aware
> auto-flip placement, `aria-describedby` wiring, and a portal that
> escapes `overflow: hidden` ancestors. The component exists because
> the browser's native `title` attribute is unstyleable, keyboard-
> hostile in some browsers, and uncoordinated with the rest of the
> design system — but the answer to that is not "always run JS." Most
> tooltips fit safely inside their layout, so most tooltips don't pay
> for JS.

## Philosophy

A tooltip is mechanically the simplest floating-UI primitive in the
library. Hover an element, a small dark bubble appears next to it,
move away and it vanishes. There is no internal state worth speaking
of, no async, no cancelable workflow — just an ephemeral hover
affordance that renders text the user already could not act on.

What `ln-tooltip` adds is the **architecture** around that bubble, so
the library can ship a single, predictable shape for two very
different costs.

The contract is one sentence: **`data-ln-tooltip` is the contract;
the rendering layer is an implementation detail.** Put the attribute
on any element and a tooltip appears on hover or `:focus-visible`.
Whether the bubble is rendered by a `::after` pseudo-element (no
JS) or by a real DOM node inside `#ln-tooltip-portal` (JS opt-in)
depends on whether the consumer also added `data-ln-tooltip-enhance`
— or whether the element happens to carry a native `title` that
forces auto-enhance to suppress the browser's built-in tooltip
(see "Auto-enhance" below). The HTML stays identical; the
text source stays identical (`data-ln-tooltip` value, falling back
to `title` if empty); the position attribute stays identical
(`data-ln-tooltip-position`). The two layers are semantically the
same component with two render strategies — one cheap, one
viewport-aware.

That shape is what makes the cost-tier choice consequence-free at
the call site. A consumer drops `data-ln-tooltip="Edit"` on an icon
button and ships. If a designer later notices the tooltip clipping
on a sidebar's right edge, the consumer adds `data-ln-tooltip-enhance`
to that one button and the rest of the page does not change. There
is no separate "JS tooltip component" to introduce, no API surface to
relearn, no second selector to register. The CSS baseline keeps
working everywhere it already worked; the JS layer takes over only
where the consumer asked for it (or where a native `title` forced
the issue).

This dual-layer shape exists for a specific economic reason. Of the
fifty or so tooltip targets on a typical admin page — every icon
button in a toolbar, every truncated table cell, every help icon next
to a form label — fewer than five sit anywhere near a viewport edge,
and zero need an `aria-describedby` wired across a portal until a
keyboard user actually focuses one. Routing all fifty through a JS
positioning calculator is paying a real cost (event listeners, a
portal node, a `getBoundingClientRect`, a placement search) for a
benefit none of them use. The CSS baseline gets the cheap 95% for
free; the JS enhance is the 5% escape hatch when CSS positioning
runs out of room.

Read [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
if you want the broader principle: components in ln-ashlar are
declared by writing attributes the components observe, never by
calling each other. `ln-tooltip` is a UI primitive — it sits
**outside** the data-flow layers entirely (Data, Submit, Render,
Validate). It does not own state, does not validate, does not
submit, does not render records. It is hover affordance, full stop.
The same hover-affordance role is also why it ships no `:open` or
`:before-show` events: tooltips are not workflows, they are visual
echoes of `aria-label` and `title`.

The component reads three attributes from the DOM and writes two:

- **Reads:** `data-ln-tooltip` (the text, may fall back to `title`),
  `data-ln-tooltip-position` (preferred side; default `top`),
  `data-ln-tooltip-enhance` (opt-in flag for the JS layer).
- **Writes (JS layer only):** `aria-describedby` on the trigger
  while the tooltip is visible (and removes it on hide);
  `data-ln-tooltip-placement` on the rendered tooltip node (so
  CSS arrow direction can adapt after auto-flip).

Plus one transient mutation: the JS layer **stashes and removes**
the element's `title` attribute on show and restores it on hide,
so the browser's native tooltip does not appear alongside the
styled one. This is why elements with `[data-ln-tooltip][title]`
auto-enhance: only JS can suppress the native `title`.

That is the entire surface. Anything beyond it — rich HTML
content, dismiss-on-click, manual `show()`/`hide()` API,
touch-device long-press, anchored repositioning during scroll —
lives in another component or is intentionally absent (see "What
ln-tooltip does NOT do" below).

### What `ln-tooltip` does NOT do

- **Does NOT support rich HTML content.** The bubble's text comes
  from `attr(data-ln-tooltip)` (CSS) or `textContent` (JS). HTML
  inside the attribute value renders as text. Rich-content floating
  panels are `ln-popover`'s job — popovers click-trigger, contain
  interactive children, and have a cancelable open/close lifecycle.
  Tooltips are passive labels.
- **Does NOT dismiss on outside click.** No document-level click
  listener exists. The tooltip vanishes on `mouseleave` or `blur`,
  and ESC hides it (JS layer only). It is not a focus trap, it is
  not modal — there is nothing inside it the user could click on.
- **Does NOT show on touch.** Hover events do not fire reliably on
  touch devices, and there is no replacement gesture. A touch-device
  user sees the underlying `aria-label` (icon button) or the literal
  text (`<abbr>` content). If a touch experience needs to surface the
  same hint, the answer is `ln-popover` with a tap trigger or a
  visible help icon — not a tooltip.
- **Does NOT reposition during scroll.** Once shown, the JS layer
  pins the bubble at the coordinates `computePlacement` returned.
  Scrolling the page detaches the bubble from its anchor visually.
  This is acceptable because tooltips are ephemeral hover state —
  starting a scroll typically generates a `mouseleave` on the
  trigger, hiding the tooltip. `ln-popover` reattaches scroll/resize
  listeners because popovers are click-pinned and persist across
  scrolls; tooltips do not.
- **Does NOT emit before/after show events.** No `ln-tooltip:show`,
  no `ln-tooltip:before-show`. There is one event in the file —
  `ln-tooltip:destroyed`, fired when a trigger's listeners are
  unwired. A cancelable show event would add no realistic consumer
  value (no consumer needs to async-validate before letting a
  tooltip render); a fired show event would notify of the same
  hover the consumer already saw. If a future use case demands
  them, add them then. Same reasoning as `ln-toast` skipping
  enqueue events.
- **Does NOT mount one tooltip node per trigger.** The JS layer has
  exactly one visible tooltip at a time. A new `_show` call hides
  the previous bubble first, removes its DOM node, and creates a
  fresh one for the new trigger. This matches the CSS baseline
  (a hover can only land on one element at a time) and avoids the
  bookkeeping cost of caching DOM nodes that almost always get
  garbage-collected anyway.
- **Does NOT escalate from CSS to JS automatically.** Adding
  `data-ln-tooltip` alone does not register the JS component. The
  JS layer attaches only when the element matches one of two
  selectors: `[data-ln-tooltip-enhance]` (explicit opt-in) or
  `[data-ln-tooltip][title]` (auto-enhance). Everything else stays
  CSS-only.

## When to use the JS enhance vs the CSS baseline

The CSS baseline is the default. Reach for the JS enhance only when
one of the conditions below applies — and only on the specific
element that needs it, not the whole page.

**Use the CSS baseline (no `-enhance`)** when:

- The trigger sits comfortably inside its layout (toolbar buttons,
  body-text help icons, anything with at least 1.5 rem of clearance
  on the preferred side).
- The tooltip text is short enough to fit on one line — the baseline
  uses `white-space: nowrap` and does not wrap.
- The trigger is not inside an `overflow: hidden` ancestor that
  would clip the `::after` pseudo-element.
- Screen-reader users already get the information through
  `aria-label` (icon buttons) or the inline text content
  (`<abbr>`-style abbreviations).

**Use the JS enhance (`data-ln-tooltip-enhance`)** when:

- The trigger is near a viewport edge and the preferred side might
  not fit. The JS layer auto-flips to the opposite side, then to
  the perpendicular pair, then clamps to viewport. The CSS baseline
  has no equivalent — it picks one side and accepts overflow.
- The trigger is inside a scrollable panel or a card with
  `overflow: hidden`. The CSS pseudo-element is clipped by the
  ancestor's overflow rule; the JS portal is appended to `<body>`
  and escapes any clipping.
- The tooltip text is long and needs to wrap. The JS bubble caps at
  `max-width: 20rem` and wraps via the portal mixin (see
  `@mixin tooltip-element` in `scss/config/mixins/_tooltip.scss`).
- Screen-reader users need the tooltip text exposed as an accessible
  description. The JS layer wires `aria-describedby` on the trigger
  while the tooltip is visible; a screen reader announces the
  tooltip text after the trigger's accessible name. The CSS baseline
  is purely visual and does not affect the accessibility tree.

**Forced auto-enhance.** Any element with both `data-ln-tooltip`
and a native `title` attribute is enhanced automatically — the JS
selector is `[data-ln-tooltip-enhance], [data-ln-tooltip][title]`.
The reason is mechanical: the CSS baseline has no way to suppress
the browser's native `title` tooltip, so without JS the user would
see two tooltips at once (the styled `::after` and the OS-rendered
`title`). The JS layer stashes and removes `title` on show and
restores it on hide. This makes the semantic
`<abbr data-ln-tooltip title="…">short</abbr>` pattern work
without forcing consumers to add an explicit `-enhance` flag.

## HTML structure

### CSS baseline — icon button (no JS)

```html
<button type="button" data-ln-tooltip="Edit document" aria-label="Edit document">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
</button>
```

`aria-label` is still required — the tooltip text is purely visual
and does not enter the accessibility tree. The icon button is not
"labeled by tooltip"; it is labeled by `aria-label`, and the tooltip
is a sighted-user-only mirror of that label.

### CSS baseline — explicit position

```html
<button type="button" data-ln-tooltip="Remove" data-ln-tooltip-position="bottom" aria-label="Remove">
    Delete
</button>
```

Default placement is `top`. The four valid values are `top`,
`bottom`, `left`, `right`. The CSS baseline honors the requested
side as-is; if the bubble does not fit on that side, it overflows.
The JS enhance auto-flips. **There is no "auto" value** — that is
the JS layer's job by default.

### CSS baseline — semantic `<abbr>` with `title` fallback

```html
<abbr data-ln-tooltip title="International Organization for Standardization">ISO</abbr>
```

When `data-ln-tooltip` is empty, the baseline reads the `title`
attribute via `attr(title)` inside the same `::after` rule (see
`@mixin tooltip` in `scss/config/mixins/_tooltip.scss`, lines
51–53). The JS layer applies the same fallback. Because `title` is
present, this element auto-enhances — the JS layer attaches without
`data-ln-tooltip-enhance`, so the browser's native `title` tooltip
is suppressed during hover.

### JS enhance — viewport-aware placement

```html
<button type="button" data-ln-tooltip="Save as draft" data-ln-tooltip-enhance aria-label="Save as draft">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-device-floppy"></use></svg>
</button>
```

Same markup as the CSS baseline plus the `data-ln-tooltip-enhance`
flag. Hover or focus the button: the JS layer renders a
`<div class="ln-tooltip">` node inside `#ln-tooltip-portal`,
positions it via `computePlacement`, sets
`aria-describedby="ln-tooltip-N"` on the button, and writes
`data-ln-tooltip-placement="top|bottom|left|right"` on the bubble
to communicate which side actually won the auto-flip.

### JS enhance — long text wrapping

```html
<button type="button" data-ln-tooltip="A long help message that exceeds twenty rem and demonstrates the JS layer's max-width wrap" data-ln-tooltip-enhance>
    Help
</button>
```

The CSS baseline uses `white-space: nowrap` and overflows. The JS
layer's `@mixin tooltip-element` applies `max-width: 20rem` and
`white-space: normal` (inherited from `tooltip-bubble`'s lack of an
override at portal scope), so long text wraps cleanly.

### Form-label help pattern

```html
<label for="email">
    Email address
    <button type="button" data-ln-tooltip="We never share your email." aria-label="Help">
        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-info-circle"></use></svg>
    </button>
</label>
<input id="email" type="email" name="email">
```

The icon button is still `<button>` — never a bare `<span>` or `<i>`.
That keeps it focusable, keyboard-activatable, and announced by
screen readers via `aria-label`. The tooltip is the sighted-user
echo of that `aria-label`. If the help text is long enough to wrap
or sits near a viewport edge, add `data-ln-tooltip-enhance`.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-tooltip="text"` | trigger element | Tooltip text. **Required** — the value is read by both the CSS baseline (via `attr(data-ln-tooltip)`) and the JS layer. If the value is empty, both layers fall back to the `title` attribute, enabling the semantic `<abbr title="…">` pattern. |
| `data-ln-tooltip-position` | trigger element | Preferred placement side: `top` (default), `bottom`, `left`, `right`. The CSS baseline honors this as-is. The JS layer treats it as the **starting point** of an auto-flip search and may render on a different side if the preferred side does not fit. |
| `data-ln-tooltip-enhance` | trigger element | Opt-in flag — activates JS enhance for this specific element. Not required when the element also has a `title` attribute (auto-enhance handles that case). When present, suppresses the CSS `::after` pseudo-element via the rule in `js/ln-tooltip/ln-tooltip.scss`. |
| `data-ln-tooltip-placement` | tooltip portal node (auto) | **Set by JS on the rendered bubble.** Reflects the side that won after viewport-aware auto-flip: `top`, `bottom`, `left`, or `right`. Useful for CSS arrow-direction styling that needs to follow the actual placement, not the requested one. |
| `aria-describedby` | trigger element (auto, JS layer only) | **Set by JS while a tooltip is visible**, pointing at the portal node's `id`. Removed on hide. Causes screen readers to announce the tooltip text as a description of the trigger after announcing its accessible name. The CSS baseline does not write this attribute — it is purely visual. |
| `title` | trigger element (consumer-provided) | Optional. When present alongside `data-ln-tooltip`, **forces auto-enhance** — the JS layer attaches even without `data-ln-tooltip-enhance`, stashes the `title` while showing the styled tooltip, and restores it on hide. This prevents the browser's native `title` tooltip from leaking alongside the styled one. |

## Events

| Event | Cancelable | `detail` | When |
|-------|-----------|----------|------|
| `ln-tooltip:destroyed` | no | `{ trigger }` | Fired when a trigger's listeners and DOM instance are removed (currently only via direct `instance.destroy()` call — no automatic destroy on element removal, see "Lifecycle" below). |

There are no show/hide or before-show/before-hide events. See
"Why no show/hide events" in
[`docs/js/tooltip.md`](../../docs/js/tooltip.md) for the reasoning,
which mirrors `ln-toast`'s decision to skip enqueue events.

## Cross-component

### Sharing the visual recipe with `ln-confirm`

`@mixin tooltip-bubble` (`scss/config/mixins/_tooltip.scss` lines
11–24) is the single source of truth for the "small dark bubble"
visual chrome — the dark background, the inverted text color, the
caption typography, the rounded corners, the floating shadow, the
`pointer-events: none`, the `z-index: var(--z-dropdown)`. Three
components compose it:

1. **`@mixin tooltip`** (`scss/config/mixins/_tooltip.scss` line 30)
   — applies the bubble to `[data-ln-tooltip]::after` for the CSS
   baseline. The mixin adds `position: absolute`, the four position
   variants, the `:hover` / `:focus-visible` activation, the
   `motion-safe` opacity transition, and the `attr(title)` fallback.
2. **`@mixin tooltip-element`** (`scss/config/mixins/_tooltip.scss`
   line 102) — applies the bubble to `.ln-tooltip` for the JS portal
   node. The mixin adds `position: fixed`, `max-width: 20rem`, and
   the `motion-safe` `ln-tooltip-fade` slide-in animation.
3. **`@mixin confirm-tooltip`** (`scss/config/mixins/_confirm.scss`
   line 14) — applies the bubble to `.ln-confirm-tooltip::after` for
   `ln-confirm`'s icon-only mode. The mixin adds `position: absolute`
   above the button, the `attr(data-tooltip-text)` content source,
   and the `--margin-block` gap. Used when an icon-only destructive
   button arms its confirm prompt and needs to surface the prompt
   text without space for inline characters.

This is a clean SCSS-mixin reuse pattern worth highlighting: **the
visual recipe is shared, but the JS components are independent.**
`ln-tooltip` reads `data-ln-tooltip`, attaches hover and focus
listeners, manages a portal. `ln-confirm` reads `data-ln-confirm`,
manages a click-armed two-stage state machine, writes
`data-tooltip-text` (different attribute on purpose). The two
components never reference each other in JS — they share a SCSS
mixin and nothing else. If `ln-confirm` is armed on an icon button
that also has `data-ln-tooltip`, both bubbles can technically render
through different `::after` rules with no JS interference, because
the data-attribute namespaces are disjoint (`data-ln-tooltip` vs
`data-tooltip-text`).

In dark mode the bubble's `--color-fg` / `--color-bg` rebind
through the neutral-scale inversion automatically — no theme-
specific override exists for the bubble. That is intentional: the
bubble's "dark surface, light text" reads as "high-contrast caption"
in either theme, and the inversion produces the expected visual.

### Composing with `aria-label` on icon buttons

The most common consumer pattern is an icon-only `<button>` with
both `aria-label` and `data-ln-tooltip` carrying the same text:

```html
<button type="button" data-ln-tooltip="Delete document" aria-label="Delete document">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
</button>
```

`aria-label` is the accessibility-tree label — what a screen reader
announces. `data-ln-tooltip` is the sighted-user-only visual echo.
Both are required: without `aria-label`, screen readers read the
SVG (which is `aria-hidden`) and announce nothing useful; without
`data-ln-tooltip`, sighted users see only an icon and have to guess
at its meaning.

The JS enhance layer adds a third connection — `aria-describedby` —
when the user focuses the button. A screen reader then announces:
*"Delete document, button. Delete document."* — once for the label,
once for the description. That is technically duplicative, but the
pattern is industry-standard: `aria-describedby` is the slot where
help text and additional context belong, even when it overlaps the
label. If the tooltip text is genuinely different from the label
(e.g., label `"Save"`, tooltip `"Save as draft (Ctrl+S)"`), the
duplication disappears.

### Composing with `<abbr>` elements

```html
<p>The <abbr data-ln-tooltip title="International Organization for Standardization">ISO</abbr> standard 9001 covers …</p>
```

The semantic anchor is the `<abbr>` element's `title` attribute —
the platform's own way of carrying an abbreviation expansion.
`data-ln-tooltip` (with no value) opts the element into the styled
tooltip chrome; the empty value triggers the `attr(title)` fallback
in both the CSS baseline and the JS layer. Auto-enhance kicks in
because of the `title` attribute's presence.

The element does not need `tabindex="0"` for hover-only access.
Add it (`<abbr tabindex="0">`) if keyboard users should be able to
focus the abbreviation and see the expansion via `:focus-visible`.

### Independence from data flow

`ln-tooltip` does not participate in the four-layer data architecture
(see `docs/architecture/data-flow.md`). It does not own state, does
not validate, does not submit, does not render records. It is a UI
primitive in the same family as `ln-icon` — content-adjacent visual
chrome that the data layers never need to know about. Coordinator
code never dispatches to or from `ln-tooltip`; the JS layer's only
event (`ln-tooltip:destroyed`) is a cleanup notification, not a
workflow signal.

## Lifecycle

The JS component is registered via `registerComponent` (see
`js/ln-core/helpers.js` line 293) with the selector
`[data-ln-tooltip-enhance], [data-ln-tooltip][title]`. The
`MutationObserver` set up by `registerComponent` watches `<body>`
for:

- New elements added to the DOM matching either selector (init).
- The `data-ln-tooltip-enhance` or `title` attribute appearing on
  an existing element (init).

On init the component attaches four listeners to the trigger:
`mouseenter`, `mouseleave`, `focus` (capture phase), `blur` (capture
phase). Capture phase is used for focus/blur because some focusable
descendants do not bubble those events to the trigger — capture
catches them on the way down.

The component never auto-destroys. If a trigger is removed from the
DOM, its listeners are garbage-collected with the element. The
explicit `instance.destroy()` exists for projects that need to
unwire a tooltip while keeping the element in the DOM (rare).

The portal `<div id="ln-tooltip-portal">` is created lazily on the
first show and persists for the lifetime of the page. Tooltip
nodes inside it are created on show and removed on hide; the portal
itself is never destroyed. This matches `ln-toast`'s container
pattern and avoids the bookkeeping of tearing down a singleton DOM
node every time the last tooltip closes.

The ESC keydown listener on `document` is registered on first show
and removed on hide. While no tooltip is visible, there is zero
listener overhead at the document level. This is the same on/off
pattern `ln-modal` uses for its ESC handler — register only when a
listener is actually needed.

## SCSS

The CSS baseline ships unconditionally — every `[data-ln-tooltip]`
element gets the `tooltip` mixin via `scss/components/_tooltip.scss`.
Consumers do not need to opt in or apply a mixin. To re-use the
chrome on a different selector (rare — typically when extending a
custom component), apply the mixin directly:

```scss
.my-floating-hint { @include tooltip; }
```

To opt out for a specific element (rare — when the consumer wants
the data attribute for purely JS reasons), suppress the
pseudo-element on a project selector:

```scss
.no-tooltip-bubble[data-ln-tooltip]::after { content: none; }
```

The JS layer's portal node and tooltip-element styling are also
shipped unconditionally — `#ln-tooltip-portal` and `.ln-tooltip` are
defined in `scss/components/_tooltip.scss`. No project-side
configuration is needed; if `ln-tooltip.js` never runs, the portal
is never created and those rules apply to no elements.

## CSS / JS coexistence

The CSS baseline activates on any `[data-ln-tooltip]` regardless of
whether the JS layer attaches. To prevent the two bubbles from
rendering simultaneously when JS does take over, two suppressor
rules in `js/ln-tooltip/ln-tooltip.scss` set `content: none` on the
`::after` pseudo-element:

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after,
[data-ln-tooltip][title]::after {
    content: none;
}
```

The first clause matches explicit opt-in. The second matches
auto-enhance triggers (any element with `[data-ln-tooltip][title]`).
The rules are purely additive — they live in `js/ln-tooltip/` and
load alongside the JS bundle, so consumers who never load the JS
bundle never see them.

`content: none` removes the generated box entirely (rather than just
hiding it via `display: none` or `visibility: hidden`). The
generated layout is genuinely absent, which avoids any risk of an
empty box affecting hover detection on the trigger.

If the JS bundle is missing or has not yet executed, the
`[data-ln-tooltip][title]` suppressor still fires — it is static
CSS. The element falls back to the browser's native `title` tooltip
with no styled bubble, which is the cleanest possible degradation.
There is no flash of the CSS baseline before JS init, because the
suppressor is in effect at parse time.

## Common mistakes

- **Putting `data-ln-tooltip` on a non-focusable element.** The CSS
  baseline activates on `:hover` and `:focus-visible`. A `<div>` or
  `<span>` with `data-ln-tooltip` and no `tabindex` will show on
  mouse hover but be invisible to keyboard users. Use a `<button>`
  for actions, or add `tabindex="0"` to a non-interactive trigger
  (e.g. `<abbr tabindex="0">`).
- **Forgetting `aria-label` on icon-only buttons.** Tooltip text
  does not enter the accessibility tree under the CSS baseline.
  Without `aria-label`, screen readers announce the button as
  "button" with no further context. The JS layer's
  `aria-describedby` is **additional** to the label, not a
  replacement for it.
- **Using long text in the CSS baseline.** The baseline is
  `white-space: nowrap` and does not wrap. A 200-character string
  produces a bubble that overflows the viewport. For long text, add
  `data-ln-tooltip-enhance` — the JS layer's `tooltip-element`
  applies `max-width: 20rem` and lets text wrap.
- **Putting tooltips on disabled buttons.** Disabled `<button>`
  elements do not fire `mouseenter` or `focus` in some browsers.
  The tooltip will not appear. If the disabled state needs to
  explain itself, wrap the button in a focusable container with the
  tooltip on the wrapper, or use a non-disabled `<button>` with
  `aria-disabled="true"` (which still fires events).
- **Expecting tooltips on touch.** Hover does not fire on touch.
  The tooltip is invisible on phones and tablets. For touch-
  reachable hints, use a visible help icon with `ln-popover`, not a
  tooltip.
- **Mixing `data-ln-tooltip` with `data-tooltip-text`.** They are
  different components. `data-ln-tooltip` is `ln-tooltip`;
  `data-tooltip-text` is written automatically by `ln-confirm` in
  icon-only mode. Do not write `data-tooltip-text` by hand — it is
  not a public API. If a button needs both a hover tooltip and a
  confirm flow, write `data-ln-tooltip="…"` for the tooltip and
  `data-ln-confirm="…"` for the confirm; `ln-confirm` will manage
  its own `data-tooltip-text` lifecycle while armed.
- **Trying to style the bubble per-page.** The bubble's chrome
  comes from `@mixin tooltip-bubble` — the dark surface, the
  inverted text, the caption typography. To restyle for a single
  page, override the primitives the mixin reads on a parent scope
  (`.my-page { --color-fg: hsl(...); --color-bg: hsl(...); }`).
  Do not target `.ln-tooltip` directly with new colors; you will
  fight the cascade and lose the dark-mode inversion.
