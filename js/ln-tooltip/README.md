# ln-tooltip

A zero-dependency, progressively enhanced **Dual-Layer Tooltip Primitive** that displays lightweight contextual descriptions on hover and focus.

It supports two levels of execution: a **pure CSS baseline** (zero JS footprint, utilizing pseudo-elements) and a **JS progressive enhancement layer** (portaled to the body to escape parent clipping, viewport-aware auto-flipping, and automated `aria-describedby` wiring).

---

## 🧭 Philosophy & Architecture

1. **CSS-First Baseline (Zero-JS):** Every element carrying `data-ln-tooltip="text"` immediately receives a beautiful hover/focus visual tooltip via pure CSS `::after` pseudo-elements.
2. **JS Portaled Enhancement (`data-ln-tooltip-enhance`):** Opt-in to activate JS features. The component detaches the tooltip from the trigger and mounts it in a global `<body>` portal (`#ln-tooltip-portal`), avoiding parent `overflow: hidden` clipping, wrapping long texts safely, and auto-flipping the bubble if it hits viewport boundaries.
3. **Automated `<abbr>` Semantic Integration:** Elements containing both `data-ln-tooltip` and a native `title` attribute (such as standard `<abbr>` elements) auto-enhance without requiring the `-enhance` flag. The JS layer intercepts the native browser hover tooltip and replaces it dynamically to avoid double tooltips.

---

## 📦 Minimal Blueprint

### CSS Baseline (Zero JS)
```html
<button type="button" data-ln-tooltip="Save document" aria-label="Save document">
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-device-floppy"></use></svg>
</button>
```

### JS Progressive Enhancement (Viewport-Aware & Portaled)
Add `data-ln-tooltip-enhance` to activate advanced positioning and accessibility wiring.
```html
<button type="button" 
        data-ln-tooltip="Delete this document permanently" 
        data-ln-tooltip-enhance 
        data-ln-tooltip-position="right"
        aria-label="Delete document">
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
</button>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-tooltip="text"` | Trigger element | Tooltip text. Required. If empty, falls back to the native `title` attribute. |
| `data-ln-tooltip-position` | Trigger element | Preferred placement side: `top` (default), `bottom`, `left`, `right`. |
| `data-ln-tooltip-enhance` | Trigger element | Opt-in. Activates JS portaling, edge auto-flipping, and accessibility descriptions. |
| `title` | Trigger element | When present alongside `data-ln-tooltip`, forces auto-enhance to suppress native tooltips. |
| `aria-describedby` | Trigger element | *State*. Automatically wired by the JS layer at runtime to point to the portal bubble ID. |

---

## ⚠️ Common Pitfalls

- **Omitting `aria-label` on Icon Buttons:** Sighted users see the tooltip, but screen readers require standard labeling. Sighted tooltips are visual mirrors; always include a matching `aria-label` on icon-only controls.
- **Triggering on Non-Focusable Elements:** Tooltips rely on hover and keyboard focus. Putting `data-ln-tooltip` on plain `<span>` or `<div>` elements without `tabindex="0"` makes them completely inaccessible to keyboard users.
- **Applying to Native Disabled Buttons:** Standard disabled buttons (e.g. `<button disabled>`) block pointer events in many browsers, preventing tooltips from firing. Use `aria-disabled="true"` instead to preserve tooltips while indicating disabled status.
