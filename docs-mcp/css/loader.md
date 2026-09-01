---
name: loader
classification: css
status: active
domain: frontend
summary: Lightweight CSS-only animated spinner scaling proportionally via font-size and inheriting theme primary color.
source: theme/config/mixins/_loader.scss
tags: [loader, spinner, loading, progress, animation, feedback]
---

# ⏳ loader

---

## 1. Core Behavior & Responsibility

The `loader` module (`theme/config/mixins/_loader.scss` and `theme/components/_loader.scss`) provides a pure CSS rotating spinner:

- **CSS-Only Geometry:** Constructed using animated pseudo-elements and `box-shadow` with zero external SVG assets or image dependencies.
- **Proportional Font-Size Scaling:** All dimensions use relative `em` units; setting `font-size: 24px` scales the entire spinner, stroke thickness, and radius proportionally.
- **Primary Hue Inheritance:** Automatically renders in the active `--color-primary` theme color.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Page Spinner)

```html
<div class="loader" role="status" aria-label="Loading content..."></div>
```

### Variant 1: Inline Sized Spinner

```html
<div id="section-spinner" role="status" aria-label="Loading data..."></div>
```

```scss
// SCSS Usage:
#section-spinner {
    @include loader;
    font-size: 32px;
    @include my(var(--size-lg));
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `loader` | mixin | — | Base CSS spinner recipe scaling with `font-size` |
| `.loader` | class | — | Prototyping class with default page-level vertical margin |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Screen Reader Announcement:** Always add `role="status"` and `aria-label="Loading..."` on loader elements so screen readers announce the in-progress activity.
> 2. **Avoid Inner Text:** The CSS spinner uses pseudo-elements; do not place visible inner text inside the loader container.
> 3. **Indeterminate vs. Determinate:** For operations with a known completion percentage, use `ln-progress` instead of an indeterminate loader.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Primary brand colors and transition durations.
- [`motion`](./motion.md) — Motion gating and keyframe standards.
- [`ln-progress`](../components/ln-progress.md) — Determinate progress bars.
