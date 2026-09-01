---
name: tables
classification: css
status: active
domain: frontend
summary: Semantic data table styling, sunken thead headers, row hover washes, striped variants, and sticky headers.
source: theme/config/mixins/_table.scss
tags: [tables, data, thead, tbody, striped, sticky, tabular-nums]
---

# 📊 tables

---

## 1. Core Behavior & Responsibility

The `tables` module (`theme/config/mixins/_table.scss` and `theme/components/_table.scss`) provides tabular data presentation:

- **Global Baseline:** Standard `<table>` elements automatically receive `@include table-base` (sunken header fill `--bg-sunken`, borders, row hover highlights, and tabular numerals for numbers).
- **Sunken Headers:** Header `<th>` cells use `--bg-sunken` with high-contrast text and subtle bottom borders.
- **Interactive Row Hover:** Hovering over `<tbody> <tr>` rows activates `--bg-hover` and accent row tints.
- **Sticky Headers (`$sticky: true`):** Mixin option for sticky `<thead>` elements in scrollable card containers.
- **Striped Table Variant (`table-striped`):** Alternates row fills using subtle neutral tints.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Data Table)

```html
<table class="table">
    <thead>
        <tr>
            <th>Name</th>
            <th>Role</th>
            <th class="numeric">Score</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Jane Doe</td>
            <td>Admin</td>
            <td class="numeric">98.5</td>
            <td><span class="badge success">Active</span></td>
        </tr>
    </tbody>
</table>
```

### Variant 1: Striped Table with Sticky Header

```scss
#audit-table {
    @include table-base($sticky: true);
    @include table-striped;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `table-base` | mixin | `$sticky: false` | Base table recipe (borders, header fill, row hover) |
| `table-striped` | mixin | — | Alternating row background fills |
| `table-responsive` | mixin | — | Mobile stacked table layout using `data-label` |
| `table-section-header` | mixin | — | Section divider row styling |
| `.table` | class | — | Prototyping class for `table-base` |
| `.numeric` | class | — | Right-aligns numbers and enables tabular numerals (`tnum`) |
| `.nowrap` | class | — | Disables text wrapping for tight columns |
| `--density-row-h` | token | `2.25rem` – `3.25rem` | Minimum table row height across density tiers |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Numeric Column Alignment:** Always use `.numeric` or apply `font-variant-numeric: tabular-nums` and `text-align: right` on currency, scores, and timestamps to ensure decimal alignment.
> 2. **Header Semantics:** Always structure tables with explicit `<thead>`, `<tbody>`, and `<th>` elements for screen readers.
> 3. **Horizontal Scrolling Wrappers:** For wide tables, wrap the table in an `overflow-x: auto` container rather than forcing table elements to shrink.

---

## 5. Related Documents

- [`ln-table`](../components/ln-table.md) — JavaScript data table with sorting, search, pagination, and virtual scrolling.
- [`density`](./density.md) — Table row height and spacing scaling.
- [`status-badge`](./status-badge.md) — Status badges for table cell indicators.
