# ln-tooltip

> `data-ln-tooltip` is the contract. CSS baseline ships zero JS — every `[data-ln-tooltip]` element
> gets a styled bubble via `::after`. The JS enhance layer is opt-in per element
> (`data-ln-tooltip-enhance`) for viewport-aware placement, portal rendering, and `aria-describedby`
> wiring. For click-triggered or interactive content, use `ln-popover`.

## When to use the JS enhance

Default: CSS baseline. Add `data-ln-tooltip-enhance` only when the trigger needs one of:

| Need | Reason |
|---|---|
| Viewport-edge auto-flip | CSS baseline picks one side and accepts overflow; JS auto-flips. |
| Escape from `overflow: hidden` ancestor | The `::after` pseudo-element clips to the ancestor; the JS portal is appended to `<body>`. |
| Long text that wraps | The CSS baseline is `white-space: nowrap`; JS bubble has `max-width: 20rem` and wraps. |
| `aria-describedby` for screen readers | JS layer wires `aria-describedby` on the trigger while visible. |

**Forced auto-enhance.** Any element with both `data-ln-tooltip` and a native `title` attribute is
enhanced automatically — the JS selector is `[data-ln-tooltip-enhance], [data-ln-tooltip][title]`.
The reason is mechanical: the CSS baseline has no way to suppress the browser's native `title`
tooltip, so without JS the user would see two tooltips at once. This makes the semantic
`<abbr data-ln-tooltip title="…">short</abbr>` pattern work without an explicit `-enhance` flag.

## HTML structure

### CSS baseline — icon button (no JS)

```html
<button type="button" data-ln-tooltip="Edit document" aria-label="Edit document">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg>
</button>
```

`aria-label` is still required — the tooltip text is purely visual and does not enter the
accessibility tree. The icon button is not "labeled by tooltip"; it is labeled by `aria-label`,
and the tooltip is a sighted-user-only mirror of that label.

### CSS baseline — semantic `<abbr>` with `title` fallback

```html
<abbr data-ln-tooltip title="International Organization for Standardization">ISO</abbr>
```

When `data-ln-tooltip` is empty, the baseline reads the `title` attribute via `attr(title)` inside
the same `::after` rule (see `@mixin tooltip` in `scss/config/mixins/_tooltip.scss`). The JS layer
applies the same fallback. Because `title` is present, this element auto-enhances — the JS layer
attaches without `data-ln-tooltip-enhance`, so the browser's native `title` tooltip is suppressed
during hover.

### JS enhance — viewport-aware placement

```html
<button type="button" data-ln-tooltip="Save as draft" data-ln-tooltip-enhance aria-label="Save as draft">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-device-floppy"></use></svg>
</button>
```

Same markup as the CSS baseline plus the `data-ln-tooltip-enhance` flag. Hover or focus the button:
the JS layer renders a `<div class="ln-tooltip">` node inside `#ln-tooltip-portal`, positions it
via `computePlacement`, sets `aria-describedby="ln-tooltip-N"` on the button, and writes
`data-ln-tooltip-placement="top|bottom|left|right"` on the bubble to communicate which side
actually won the auto-flip.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-tooltip="text"` | trigger element | Tooltip text. **Required** — the value is read by both the CSS baseline (via `attr(data-ln-tooltip)`) and the JS layer. If the value is empty, both layers fall back to the `title` attribute, enabling the semantic `<abbr title="…">` pattern. |
| `data-ln-tooltip-position` | trigger element | Preferred placement side: `top` (default), `bottom`, `left`, `right`. The CSS baseline honors this as-is. The JS layer treats it as the **starting point** of an auto-flip search and may render on a different side if the preferred side does not fit. |
| `data-ln-tooltip-enhance` | trigger element | Opt-in flag — activates JS enhance for this specific element. Not required when the element also has a `title` attribute (auto-enhance handles that case). When present, suppresses the CSS `::after` pseudo-element via `js/ln-tooltip/ln-tooltip.scss`. |
| `data-ln-tooltip-placement` | tooltip portal node (auto) | **Set by JS on the rendered bubble.** Reflects the side that won after viewport-aware auto-flip: `top`, `bottom`, `left`, or `right`. Useful for CSS arrow-direction styling that needs to follow the actual placement, not the requested one. |
| `aria-describedby` | trigger element (auto, JS layer only) | **Set by JS while a tooltip is visible**, pointing at the portal node's `id`. Removed on hide. Causes screen readers to announce the tooltip text as a description of the trigger after announcing its accessible name. The CSS baseline does not write this attribute — it is purely visual. |
| `title` | trigger element (consumer-provided) | When present alongside `data-ln-tooltip`, **forces auto-enhance** — the JS layer attaches, stashes `title` while showing the styled tooltip, and restores it on hide. Prevents the browser's native `title` tooltip from appearing alongside the styled one. |

## Events

| Event | Cancelable | `detail` | When |
|-------|-----------|----------|------|
| `ln-tooltip:destroyed` | no | `{ trigger }` | Fired when a trigger's listeners and DOM instance are removed via `instance.destroy()`. |

## Cross-component

The bubble's visual chrome comes from `@mixin tooltip-bubble`, shared with `ln-confirm`'s
icon-only mode — see
[docs/js/tooltip.md](../../docs/js/tooltip.md#visual-recipe-sharing--mixin-tooltip-bubble).

The most common consumer pattern is an icon-only `<button>` with both `aria-label` and
`data-ln-tooltip` carrying the same text:

```html
<button type="button" data-ln-tooltip="Delete document" aria-label="Delete document">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg>
</button>
```

`aria-label` is the accessibility-tree label — what a screen reader announces. `data-ln-tooltip`
is the sighted-user-only visual echo. Both are required: without `aria-label`, screen readers
announce nothing useful; without `data-ln-tooltip`, sighted users see only an icon and have to
guess at its meaning.

## Common mistakes

- **Putting `data-ln-tooltip` on a non-focusable element.** The CSS baseline activates on
  `:hover` and `:focus-visible`. A `<div>` or `<span>` with `data-ln-tooltip` and no `tabindex`
  will show on mouse hover but be invisible to keyboard users. Use a `<button>` for actions, or
  add `tabindex="0"` to a non-interactive trigger (e.g. `<abbr tabindex="0">`).

- **Forgetting `aria-label` on icon-only buttons.** Tooltip text does not enter the accessibility
  tree under the CSS baseline. Without `aria-label`, screen readers announce the button as
  "button" with no further context. The JS layer's `aria-describedby` is **additional** to the
  label, not a replacement for it.

- **Putting tooltips on disabled buttons.** Disabled `<button>` elements do not fire `mouseenter`
  or `focus` in some browsers. The tooltip will not appear. If the disabled state needs to explain
  itself, wrap the button in a focusable container with the tooltip on the wrapper, or use a
  non-disabled `<button>` with `aria-disabled="true"` (which still fires events).

## Integration & Development

### Integration

#### 1. In-Bundle (Standard Integration)
To load `ln-tooltip` as part of the main `ln-ashlar` bundle, include the compiled IIFE in your document:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you wish to load the `ln-tooltip` component standalone, include its compiled zero-dependency IIFE script directly:
```html
<script src="js/ln-tooltip/ln-tooltip.js" defer></script>
```

### Source Files

For development, testing, and debugging, refer to the following local file paths:
- **Source of Truth (Active Development):** [js/ln-tooltip/src/ln-tooltip.js](file:///c:/laragon/www/ln-ashlar/js/ln-tooltip/src/ln-tooltip.js)
- **Compiled Standalone:** [js/ln-tooltip/ln-tooltip.js](file:///c:/laragon/www/ln-ashlar/js/ln-tooltip/ln-tooltip.js)
