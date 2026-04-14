# Tooltip

File: `scss/config/mixins/_tooltip.scss` + `scss/components/_tooltip.scss`.

CSS-only tooltip that uses a pseudo-element and the `data-ln-tooltip`
attribute. Zero JS, zero positioning math.

## Usage

```html
<button type="button" data-ln-tooltip="Save as draft" aria-label="Save">
	<svg class="ln-icon" aria-hidden="true"><use href="#ln-device-floppy"></use></svg>
</button>
```

Shows on `:hover` and `:focus-visible`.

## Positions

| Attribute | Position |
|---|---|
| (default) | Top, centered |
| `data-ln-tooltip-position="top"` | Top, centered |
| `data-ln-tooltip-position="bottom"` | Bottom, centered |
| `data-ln-tooltip-position="left"` | Left of element |
| `data-ln-tooltip-position="right"` | Right of element |

## Limitations

- **No viewport collision detection.** If the tooltip would render
  off-screen, it clips. For smart positioning, use `ln-tooltip` (JS,
  Phase 8).
- **No rich content.** Tooltip text is the `data-ln-tooltip` attribute
  value — plain string only. For interactive content, use
  `ln-popover` (Phase 8).
- **No delay.** Appears instantly on hover.

## Motion safety

The fade transition is gated behind `prefers-reduced-motion:
no-preference`. Users with reduced motion see the tooltip snap in.

## Accessibility

- Always set `aria-label` on icon-only buttons — `data-ln-tooltip` is
  not a screen-reader text substitute.
- `aria-describedby` linkage requires the JS variant (`ln-tooltip`).
