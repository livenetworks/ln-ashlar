---
name: mixins
classification: css
status: draft
domain: frontend
summary: Master index of SCSS mixins covering spacing, typography, layout, surfaces, and visual components.
source: theme/config/_mixins.scss
tags: [mixins, scss, layout, primitives, components]
---

# 🛠️ mixins

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` mixin architecture separates SCSS into **Primitives** (atomic layout, spacing, typography) and **Composites** (card, table, form, modal recipes). Mixins contain zero direct CSS selectors or output unless applied to a semantic target.

Import syntax:
```scss
@use 'ln-ashlar/theme/config/mixins' as *;
```

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<section id="user-profile">
    <header>
        <h3>User Profile</h3>
    </header>
    <main>
        <p>Profile details...</p>
    </main>
</section>
```

```scss
#user-profile {
    @include card;
    @include p(var(--size-lg));

    header {
        @include typography(title-md);
        @include pb(var(--size-sm));
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `p`, `px`, `py` | mixin | `$val: CSS length` | Spacing: padding shorthand |
| `m`, `mx`, `my` | mixin | `$val: CSS length` | Spacing: margin shorthand |
| `gap` | mixin | `$val: CSS length` | Flexbox / Grid gap |
| `flex`, `flex-col`, `flex-row` | mixin | — | Display & flexbox directions |
| `items-center`, `justify-between` | mixin | — | Flex alignment utilities |
| `grid`, `grid-2`, `grid-4` | mixin | — | Responsive column grid presets |
| `stack` | mixin | `$gap: var(--gap)` | Vertical flex column with gap |
| `row`, `row-between`, `row-center` | mixin | `$gap: var(--gap)` | Horizontal flex rows |
| `container` | mixin | `$name: null` | Declares container query context |
| `typography` | mixin | `$role: keyword` | Semantic typography role rebind |
| `focus-ring` | mixin | — | Accessible focus outline |
| `card` | mixin | — | Standard card shell |
| `section` | mixin | — | Page section rhythm |
| `table-base` | mixin | `$sticky: false` | Table structure with sunken header |
| `form-grid` | mixin | — | 6-column responsive form grid |
| `form-input` | mixin | — | Standard input styling |
| `btn`, `btn-soft`, `btn-ghost` | mixin | — | Button styling presets |
| `chip` | mixin | — | Dismissible token badge |
| `badge` | mixin | — | Read-only status indicator badge |
| `stat-card` | mixin | — | KPI metric tile layout |
| `app-wrapper`, `app-header`, `app-main` | mixin | — | Application shell layout scaffolding |
| `page-header` | mixin | — | Responsive page header container-query grid |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Re-implement Primitives:** Always use `@include typography($role)` and `@include focus-ring` to ensure accessibility and density responsiveness.
> 2. **Never Output Selectors Inside Mixins:** Mixins must only emit style properties, leaving the DOM selector binding to the project or theme layer.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 3-layer design tokens.
- [`typography`](./typography.md) — Typography roles and scales.
- [`density`](./density.md) — Density-reactive mixin adaptations.
