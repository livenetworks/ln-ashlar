# ln-tooltip

A zero-dependency, progressively enhanced **Dual-Layer Tooltip Primitive** that displays lightweight contextual descriptions on hover and focus.

It supports two levels of execution: a **pure CSS baseline** (zero JS footprint, utilizing pseudo-elements) and a **JS progressive enhancement layer** (top-layer promoted via the native Popover API to escape parent clipping, viewport-aware auto-flipping, and automated `aria-describedby` wiring).

---

## 🧭 Philosophy & Architecture

1. **CSS-First Baseline (Zero-JS):** Every element carrying `data-ln-tooltip="text"` immediately receives a beautiful hover/focus visual tooltip via pure CSS `::after` pseudo-elements.
2. **JS Top-Layer Enhancement (`data-ln-tooltip-enhance`):** Opt-in to activate JS features. The component detaches the tooltip from the trigger and mounts it in a shared `<body>` container (`#ln-tooltip-portal`) promoted to the browser's top layer via the native Popover API (`popover="manual"`, `showPopover()`/`hidePopover()`), avoiding parent `overflow: hidden` clipping and any ancestor stacking context, wrapping long texts safely, and auto-flipping the bubble if it hits viewport boundaries.
3. **Automated `<abbr>` Semantic Integration:** Elements containing both `data-ln-tooltip` and a native `title` attribute (such as standard `<abbr>` elements) auto-enhance without requiring the `-enhance` flag. The JS layer intercepts the native browser hover tooltip and replaces it dynamically to avoid double tooltips.

---

## 📦 Minimal Blueprint

### CSS Baseline (Zero JS)
```html
<button type="button" data-ln-tooltip="Save document" aria-label="Save document">
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-device-floppy"></use></svg>
</button>
```

### JS Progressive Enhancement (Viewport-Aware & Top-Layer Promoted)
Add `data-ln-tooltip-enhance` to activate advanced positioning and accessibility wiring.
```html
<button type="button" 
        data-ln-tooltip="Delete this document permanently" 
        data-ln-tooltip-enhance 
        data-ln-tooltip-position="right"
        aria-label="Delete document">
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-trash"></use></svg>
</button>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-tooltip="text"` | Trigger element | Tooltip text. Required. If empty, falls back to the native `title` attribute. |
| `data-ln-tooltip-position` | Trigger element | Preferred placement side: `top` (default), `bottom`, `left`, `right`. |
| `data-ln-tooltip-enhance` | Trigger element | Opt-in. Activates top-layer promotion, edge auto-flipping, and accessibility descriptions. |
| `title` | Trigger element | When present alongside `data-ln-tooltip`, forces auto-enhance to suppress native tooltips. |
| `aria-describedby` | Trigger element | *State*. Automatically wired by the JS layer at runtime to point to the portal bubble ID. |

---

## ⚠️ Common Pitfalls

- **Omitting `aria-label` on Icon Buttons:** Sighted users see the tooltip, but screen readers require standard labeling. Sighted tooltips are visual mirrors; always include a matching `aria-label` on icon-only controls.
- **Triggering on Non-Focusable Elements:** Tooltips rely on hover and keyboard focus. Putting `data-ln-tooltip` on plain `<span>` or `<div>` elements without `tabindex="0"` makes them completely inaccessible to keyboard users.
- **Applying to Native Disabled Buttons:** Standard disabled buttons (e.g. `<button disabled>`) block pointer events in many browsers, preventing tooltips from firing. Use `aria-disabled="true"` instead to preserve tooltips while indicating disabled status.

---

## 🔧 Internals

Source: `components/ln-tooltip/ln-tooltip.js`. Tooltips are mechanically inert from the data layer's perspective — no coordinator wiring, the only event dispatched is `ln-tooltip:destroyed`.

### Two render strategies, one attribute

`theme/components/_tooltip.scss` applies `@mixin tooltip` to every `[data-ln-tooltip]` element unconditionally — a `::after` pseudo-element reading `attr(data-ln-tooltip)` (falling back to `attr(title)`), toggled on `:hover`/`:focus-visible`. Zero JS. The JS layer attaches only when an element matches `[data-ln-tooltip-enhance]` (explicit opt-in) or `[data-ln-tooltip][title]` (auto-enhance, so the CSS baseline can't otherwise stop the native `title` tooltip from leaking through). For either match, co-located CSS sets `content: none` on the `::after`, suppressing the baseline so only one bubble ever renders:

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after,
[data-ln-tooltip][title]::after { content: none; }
```

This suppressor is static CSS, in effect before JS executes — no flash of the baseline pre-init. If JS never runs, an auto-enhance element (has `title`) degrades to the browser's native tooltip; an explicit `-enhance` element with no `title` degrades to nothing, an accepted cost of that opt-in.

### Portal architecture

A single `<div id="ln-tooltip-portal">` is created lazily in `<body>` on the first `_show` call — `position: fixed` at `(0,0)`, `pointer-events: none`, `z-index: var(--z-toast)` (shares the toast layer, so tooltips render above modals/dropdowns regardless of ancestor stacking context). It is never destroyed. Each tooltip node is its own `position: fixed` `<div class="ln-tooltip">`, so its placement is independent of the portal's box — only one node exists inside the portal at any time, created on show, removed on hide.

### Show / hide flow

`_show(trigger)`: same-trigger guard (a second `mouseenter` from a hovered child doesn't recreate the bubble) → `_hide()` any previous tooltip → read `data-ln-tooltip` (fallback `title`), abort silently if both empty → ensure portal → stash and remove `title` (prevents the native browser tooltip appearing after ~1s hover dwell; restored on hide) → build the node with a stable id and append it (must be in the DOM before `computePlacement` reads `offsetWidth`/`offsetHeight`) → `computePlacement(rect, size, preferred, 6)` returns `{ top, left, placement }` after viewport auto-flip → write the two inline styles + `data-ln-tooltip-placement` → wire `aria-describedby` → register the ESC listener if not already present.

`_hide()`: no-op if nothing is active; otherwise restores the stashed `title`, clears `aria-describedby`, removes the node from the DOM (not cached), clears the active-state variables, and removes the ESC listener.

### One visible at a time

Module-level `activeTrigger`/`activeTooltipNode` enforce a hard single-tooltip invariant — every `_show` hides the previous bubble first, mirroring the CSS baseline's natural one-hover-at-a-time behavior. This is also why the `title` stash can live in a single module-level variable rather than a per-trigger map.

### Lifecycle

`registerComponent` wires a `MutationObserver` watching for `[data-ln-tooltip-enhance], [data-ln-tooltip][title]`. On init, four listeners attach to the trigger: `mouseenter`/`focus` → `_show(el)`; `mouseleave`/`blur` → `_hide()` guarded by `activeTrigger === el` (so one trigger can't hide another's tooltip). `focus`/`blur` use the capture phase so events from focusable descendants reach the trigger reliably.

The component never auto-destroys on element removal — listeners are garbage-collected with the element. `destroy()` exists for the rarer case of unwiring without removing the element: removes all four listeners, `_hide()`s if this trigger is currently active, deletes the instance properties, dispatches `ln-tooltip:destroyed`.
