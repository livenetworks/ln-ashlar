---
name: tooltip
classification: css
status: active
domain: frontend
summary: CSS-only pseudo-element tooltips triggered on hover/focus via data-ln-tooltip attribute, with directional placement.
source: theme/config/mixins/_tooltip.scss
tags: [tooltip, overlay, hover, hint, css-only]
---

# 💬 tooltip

---

## 1. Core Behavior & Responsibility

The CSS-only `tooltip` styling system (`theme/config/mixins/_tooltip.scss` and `theme/components/_tooltip.scss`) provides lightweight, zero-JS tooltips:

- **CSS Pseudo-Element Driven:** Renders using `::before` / `::after` on `:hover` and `:focus-visible`.
- **Declarative Content:** Reads text from `data-ln-tooltip="Text"` or falls back to the native `title` attribute (useful for `<abbr>` tags).
- **Directional Anchoring:** Positions top (default), bottom, left, or right via `data-ln-tooltip-position`.
- **Motion Gated:** Uses `@include motion-safe` to provide smooth opacity transitions for users without reduced-motion preferences.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Icon Button Tooltip)

```html
<button type="button" data-ln-tooltip="Save document" aria-label="Save document">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-device-floppy"></use></svg>
</button>
```

### Variant 1: Semantic `<abbr>` with Title Fallback

```html
<abbr data-ln-tooltip title="HyperText Markup Language">HTML</abbr>
```

### Variant 2: Directional Positioning

```html
<button type="button" data-ln-tooltip="Settings" data-ln-tooltip-position="bottom" aria-label="Settings">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-settings"></use></svg>
</button>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `tooltip-bubble` | mixin | — | Base tooltip bubble geometry, dark background, and resting shadow |
| `data-ln-tooltip` | attribute | string | Declares tooltip hint string |
| `data-ln-tooltip-position` | attribute | `top` \| `bottom` \| `left` \| `right` | Anchor position |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Tooltips Are Not Accessible Name Replacements:** Always provide an explicit `aria-label` on icon-only buttons. The `data-ln-tooltip` attribute is a visual hint, not a guaranteed accessible label.
> 2. **No Interactive Content:** CSS tooltips cannot contain interactive links or buttons. For interactive rich overlays, use `ln-popover`.
> 3. **Viewport Collision:** Pure CSS tooltips do not perform viewport collision detection. For collision-aware top-layer tooltips, use the `ln-tooltip` JS component.

---

## 5. Related Documents

- [`ln-tooltip`](../components/ln-tooltip.md) — JavaScript-enhanced tooltip with top-layer anchoring and viewport collision avoidance.
- [`ln-popover`](../components/ln-popover.md) — Rich interactive popovers.
