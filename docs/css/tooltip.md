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

## Title fallback

When `data-ln-tooltip` has no value, the tooltip text is pulled from the
element's `title` attribute. This enables the semantic HTML `<abbr>`
pattern without duplicating the text:

```html
<abbr data-ln-tooltip title="International Organization for Standardization">ISO</abbr>
```

Use this form whenever the description is naturally the element's
`title` — abbreviations, dates, coordinates, any content where `title`
is already the semantic home for the long form. Use the explicit
`data-ln-tooltip="…"` form when the tooltip is a UI hint that is not
part of the element's accessible description (e.g. "Save as draft" on
an icon button).

**Note on native browser tooltips:** when `title` is present, browsers
also show their own native tooltip after a long hover dwell
(~1 second). The two will briefly coexist. For instant-only styled
tooltips, use the JS enhance layer (`data-ln-tooltip-enhance`) which
stashes `title` while the styled tooltip is visible.

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
