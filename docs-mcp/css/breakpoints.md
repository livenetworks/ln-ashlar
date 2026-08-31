---
name: breakpoints
classification: css
status: draft
domain: frontend
summary: Media queries and Container Queries resolution system using unified SCSS mixins and CSS custom properties.
source: theme/config/_breakpoints.scss
tags: [breakpoints, media-queries, container-queries, responsive, layout]
---

# 📐 breakpoints

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` responsive system uses a dual-axis strategy:
1. **Media Queries (`@include mq-up` / `@include mq-down`)**: Reserved strictly for macro layout columns (e.g., shell sidebar collapse, page grid shifts).
2. **Container Queries (`@include cq-up` / `@include cq-down`)**: Used for micro components (e.g., table responsiveness, stat-card grids, forms, page headers) to make them self-contained and context-agnostic.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="user-table-container">
    <table>...</table>
</div>
```

```scss
.user-table-container {
    @include container(userstable);
}

.user-table-container table {
    @include cq-down(compact, userstable) {
        @include table-responsive;
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `mq-up` | mixin | `$name: sm, md, lg, xl, 2xl, 3xl` | Emits media query min-width rule |
| `mq-down` | mixin | `$name: sm, md, lg, xl, 2xl, 3xl` | Emits media query max-width rule |
| `cq-up` | mixin | `$name, $container: optional` | Emits container query min-width rule |
| `cq-down` | mixin | `$name, $container: optional` | Emits container query max-width rule |
| `container` | mixin | `$name: null` | Declares container-type: inline-size |
| `$bp-md` | variable | `768px` | Tablet / collapsible sidebar media breakpoint |
| `$bp-lg` | variable | `1024px` | Desktop viewport media breakpoint |
| `$cq-compact` | variable | `580px` | Compact table / 2-col KPI shelf container breakpoint |
| `$cq-medium` | variable | `880px` | Full multi-col layout / 4-col KPI shelf container breakpoint |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Never Hardcode Pixels:** Always use `@include mq-up(...)` or `@include cq-down(...)` rather than writing raw `@media (min-width: 768px)`.
> 2. **Component vs Layout Separation:** Components must never use media queries (`@media`) directly — use Container Queries (`@container`) so components adapt when placed in sidebars or modals.

---

## 5. Related Documents

- [`app-shell`](./app-shell.md) — Macro layout responsiveness.
- [`forms`](./forms.md) — Container query form grids.
- [`tables`](./tables.md) — Responsive table stacking.
