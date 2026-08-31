---
name: tooltip
classification: css
status: draft
domain: frontend
summary: Pure CSS baseline tooltip using data-tooltip attributes and hover pseudo-elements.
source: theme/config/mixins/_tooltip.scss
tags: [tooltip, css-only, popover, hover, hint]
---

# 💬 tooltip

---

## 1. Core Behavior & Responsibility

The `tooltip` SCSS mixin (`theme/components/_tooltip.scss` and `theme/config/mixins/_tooltip.scss`) provides lightweight, CSS-only baseline tooltips:
- **Zero-JS Activation:** Anchors to `[data-tooltip]` and renders via `::after` on hover and `:focus-visible`.
- **Top-Layer Promotion:** For interactive tooltips requiring rich HTML or collision avoidance, use the JavaScript [`ln-tooltip`](../components/ln-tooltip.md) component instead.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<button type="button" class="btn btn-ghost" data-tooltip="Copy invoice link to clipboard">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-copy"></use></svg>
</button>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `tooltip` | mixin | — | Styles CSS-only hover tooltip using ::after pseudo-element |
| `[data-tooltip]` | class | — | Default component selector applying @include tooltip |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Keyboard Focus:** Ensure the triggering element is keyboard-focusable (e.g. `<button>`) so `:focus-visible` reveals the tooltip for keyboard navigation.
> 2. **Overflow Clipping:** CSS pseudo-element tooltips can be clipped by ancestor containers with `overflow: hidden`. For complex interfaces, use [`ln-tooltip`](../components/ln-tooltip.md).

---

## 5. Related Documents

- [`ln-tooltip`](../components/ln-tooltip.md) — JavaScript-enhanced Popover API tooltip.
- [`motion`](./motion.md) — Transition tokens.
