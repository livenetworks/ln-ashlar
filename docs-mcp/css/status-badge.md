---
name: status-badge
classification: css
status: draft
domain: frontend
summary: Compact read-only status indicator badges with status dots and semantic tone variants.
source: theme/config/mixins/_badge.scss
tags: [badge, status-badge, status, dot, tone, pill]
---

# 🏷️ status-badge

---

## 1. Core Behavior & Responsibility

The `status-badge` component (`theme/components/_status-badge.scss` and `theme/config/mixins/_badge.scss`) displays read-only status indicators:
- **`@include badge` / `.badge`:** Compact inline badge with rounded pill radius and uppercase caption typography.
- **Status Dot (`.badge-dot`):** Renders a circular 6px color-coded indicator preceding the status text.
- **Tone Classes:** Changes background tint and dot color via `.success`, `.warning`, `.error`, and `.info`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<span class="badge success">
    <span class="badge-dot" aria-hidden="true"></span>
    <span>Active</span>
</span>
```

### Variant 1: Neutral Badge

```html
<span class="badge">
    <span>Draft</span>
</span>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `badge` | mixin | — | Base read-only indicator badge with uppercase caption styling |
| `badge-dot` | mixin | — | Circular 6px status dot positioned before the badge label |
| `.badge` | class | — | Default component class applying @include badge |
| `.badge-dot` | class | — | Circular status dot decorator class |
| `.success` | class | — | Tone modifier applying success emerald colors |
| `.warning` | class | — | Tone modifier applying warning amber colors |
| `.error` | class | — | Tone modifier applying error red colors |
| `.info` | class | — | Tone modifier applying info sky colors |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Hide Text:** Never render a status dot alone without accompanying visible text or an explicit `aria-label`.
> 2. **Badge vs Chip:** Use `status-badge` for read-only status indicators; use `chip` for interactive or dismissible filters.

---

## 5. Related Documents

- [`chip`](./chip.md) — Dismissible token badges.
- [`alert`](./alert.md) — Full feedback banners.
