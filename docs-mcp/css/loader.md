---
name: loader
classification: css
status: draft
domain: frontend
summary: Pure CSS loading spinners, size variants, and is-loading container overlays.
source: theme/config/mixins/_loader.scss
tags: [loader, spinner, loading, progress, feedback]
---

# ⏳ loader

---

## 1. Core Behavior & Responsibility

The `loader` component (`theme/components/_loader.scss` and `theme/config/mixins/_loader.scss`) provides lightweight visual loading feedback:
- **`@include loader` / `.loader`:** Pure CSS spinning ring using CSS border animations.
- **Sizes:** Supports `.loader-sm` (16px), default (24px), and `.loader-lg` (36px).
- **Container Overlay (`.is-loading`):** Centered overlay on parent containers during async data fetches.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="loader" role="status" aria-label="Loading content..."></div>
```

### Variant 1: Button Loading State

```html
<button type="button" class="btn is-loading" disabled>
    <div class="loader loader-sm" aria-hidden="true"></div>
    <span>Saving...</span>
</button>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `loader` | mixin | — | Base CSS spinning ring with accent border color |
| `loader-sm` | mixin | — | Small spinner size (16px) |
| `loader-lg` | mixin | — | Large spinner size (36px) |
| `.loader` | class | — | Default component class applying @include loader |
| `.loader-sm` | class | — | Small size modifier class |
| `.loader-lg` | class | — | Large size modifier class |
| `.is-loading` | class | — | State class applied to buttons and containers during async operations |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Add `role="status"`:** Standalone loaders must carry `role="status"` and an `aria-label` so screen readers inform users that content is loading.

---

## 5. Related Documents

- [`empty-state`](./empty-state.md) — Zero-data state vs loading states.
- [`motion`](./motion.md) — Motion-safe animations.
