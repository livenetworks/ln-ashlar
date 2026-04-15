# Tooltip (JS enhance)

Progressive enhancement layer over the CSS-only tooltip baseline. File: `js/ln-tooltip/ln-tooltip.js`.

## Two layers

### CSS baseline

`scss/components/_tooltip.scss` — activates on any `[data-ln-tooltip]` element via `::after { content: attr(data-ln-tooltip) }`. No JS required. Position is fixed relative to the trigger via CSS (typically above, using `::before` for the arrow). Works in any browser, zero overhead.

**Use when:** the trigger is in a predictable position, no screen-reader description is needed, and viewport-edge clipping is not a concern.

### JS enhance

`js/ln-tooltip/ln-tooltip.js` — opt-in per element via `data-ln-tooltip-enhance`. Intercepts hover and focus events, creates a portal node, positions it via `computePlacement`, and wires `aria-describedby`.

**Use when:** triggers are near viewport edges, in scrollable containers, or when screen-reader `aria-describedby` wiring is required.

## Portal architecture

A single `<div id="ln-tooltip-portal">` is created lazily in `<body>` on the first `_show` call. It is positioned `fixed` at `(0, 0)` with `pointer-events: none` and a high `z-index` (shared with toast layer). All tooltip nodes are appended to this container.

Each tooltip node is a `<div class="ln-tooltip">` with `position: fixed` — coordinates are viewport-relative and match what `computePlacement` returns. Using `position: fixed` on the node directly (rather than `position: absolute` inside the portal) avoids any dependency on the portal as a positioning context.

The portal is never destroyed — it persists in `<body>` once created. Tooltip nodes inside it are created on show and removed on hide.

## Show/hide flow

### Show (`_show(trigger)`)

1. If the same trigger is already active, return immediately.
2. Call `_hide()` to clear any previous tooltip.
3. Read `data-ln-tooltip` text from the trigger. If empty, abort.
4. Call `_ensurePortal()` — creates the portal `<div>` lazily if it doesn't exist.
5. Create `<div class="ln-tooltip">`, set `textContent` to the tooltip text.
6. Assign a stable id to the node (`ln-tooltip-N`). The id is stored on `el[DOM_ATTRIBUTE + 'Uid']` so re-shows reuse the same value.
7. Append the node to the portal.
8. Measure `offsetWidth` / `offsetHeight` (the node is in the DOM, so layout is accurate without `measureHidden`).
9. Read the trigger's `getBoundingClientRect()` and preferred position from `data-ln-tooltip-position` (default: `top`).
10. Call `computePlacement(rect, size, preferred, 6)` — returns `{ top, left, placement }`.
11. Set `node.style.top` and `node.style.left` (coordinate-only inline styles — accepted exception, same as ln-popover).
12. Set `data-ln-tooltip-placement` on the node.
13. Set `aria-describedby` on the trigger pointing at the node's id.
14. Store `activeTooltipNode` and `activeTrigger`.
15. Register the ESC listener (`_ensureEscListener`).

### Hide (`_hide()`)

1. Remove `aria-describedby` from the trigger.
2. Remove the tooltip node from the portal.
3. Clear `activeTooltipNode` and `activeTrigger`.
4. Remove the ESC listener (`_removeEscListener`).

## Coexistence rule

The CSS baseline generates a pseudo-element via `::after { content: attr(data-ln-tooltip) }`. This fires on any `[data-ln-tooltip]` regardless of `-enhance`.

A single additive CSS rule in `js/ln-tooltip/ln-tooltip.scss` suppresses it for enhanced elements:

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after {
    content: none;
}
```

This is purely additive — no changes to `scss/components/_tooltip.scss` or `scss/config/mixins/_tooltip.scss`. Un-enhanced elements are completely unaffected.

The `content: none` approach is preferred over `display: none` because it removes the generated box entirely, not just its visibility.

## Why no before/after events

Tooltips are ephemeral hover affordances. A `before-show` event that is cancelable would add no meaningful consumer value: there is no realistic use case where a consumer needs to prevent a tooltip from appearing based on async state. If that use case ever arises, add the events then. The same reasoning applies to how `ln-toast` skips before/after enqueue events — keep the API surface minimal until a concrete need is demonstrated.

This is distinct from popover, which does have cancelable events because popovers contain interactive content and a consumer may need to validate state (e.g., unsaved changes) before allowing close.
