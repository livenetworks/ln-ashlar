# ln-tooltip

Progressive enhancement over the CSS-only `[data-ln-tooltip]` baseline. Adds smart viewport-aware positioning and `aria-describedby` wiring. Opt-in per element via `data-ln-tooltip-enhance`.

## When to use the JS enhance vs the CSS baseline

- Use **CSS baseline** (no `-enhance`) for inline labels that fit safely in any layout — anchored tooltips with predictable position, no screen-reader description needed.
- Use **JS enhance** (`-enhance`) for:
  - Triggers near viewport edges where the CSS pseudo-element would clip or overflow.
  - Scrollable lists or panels where position context may shift.
  - Elements where screen-reader accessibility (`aria-describedby`) is required.
  - Any case where auto-flip on viewport overflow is needed.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-tooltip="text"` | trigger element | Tooltip text (required for both CSS baseline and JS enhance) |
| `data-ln-tooltip-position` | trigger element | Preferred placement side: `top` (default), `bottom`, `left`, `right` |
| `data-ln-tooltip-enhance` | trigger element | Opt-in flag — activates JS enhance for this element |

## Events

| Event | Cancelable | `detail` |
|-------|-----------|----------|
| `ln-tooltip:destroyed` | no | `{ trigger }` — fired when the cleanup function removes the instance |

No before/show/hide events. Tooltips are ephemeral hover affordances; cancelable open events would add no consumer value (see implementation notes for reasoning). If a future consumer needs them, add them then.

## Behavior

- **Singleton portal**: a single `<div id="ln-tooltip-portal">` is created lazily in `<body>` on first show. All tooltip nodes are appended to this portal.
- **One visible at a time**: a new `_show` call always hides the previous tooltip first. This matches CSS-only behavior (hover can only be on one element at a time).
- **Auto-flip**: the preferred side is tried first; if the tooltip doesn't fit, the opposite side is tried, then the perpendicular pair. The element is clamped to the viewport.
- **ESC hides**: a `keydown` listener is registered on `document` only while a tooltip is visible. Removed immediately on hide.
- **`aria-describedby` wiring**: on show, the trigger gets `aria-describedby="ln-tooltip-N"` pointing at the portal node. The attribute is removed on hide. Screen readers announce the tooltip text as a description.
- **Stable uid**: each trigger is assigned a stable id (`ln-tooltip-N`) on first show, stored on the element. Re-shows reuse the same id — good for screen reader consistency.

## HTML Structure

### CSS-only baseline (unchanged by JS enhance)

```html
<button data-ln-tooltip="Edit this item">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
    <span class="sr-only">Edit</span>
</button>
```

### JS-enhanced (same markup, add the enhance flag)

```html
<button data-ln-tooltip="Edit this item" data-ln-tooltip-enhance>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
    <span class="sr-only">Edit</span>
</button>
```

On focus, the button above gets `aria-describedby="ln-tooltip-1"` and a tooltip node with `id="ln-tooltip-1"` appears in the portal.

### With explicit position preference

```html
<button data-ln-tooltip="Remove" data-ln-tooltip-enhance data-ln-tooltip-position="bottom">
    Delete
</button>
```

## Coexistence with CSS baseline

The CSS baseline (`scss/components/_tooltip.scss`) uses `content: attr(data-ln-tooltip)` on `::after`. It activates whenever `[data-ln-tooltip]` is present, regardless of `-enhance`.

A single CSS rule in `ln-tooltip.scss` suppresses the pseudo-element on enhanced elements:

```scss
[data-ln-tooltip][data-ln-tooltip-enhance]::after {
    content: none;
}
```

Un-enhanced elements keep the CSS behavior entirely unchanged — this rule is purely additive.

To verify: `getComputedStyle(enhancedButton, '::after').content === 'none'` (DevTools).
