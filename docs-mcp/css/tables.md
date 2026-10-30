---
name: tables
classification: css
status: active
domain: frontend
summary: Semantic data table styling, sunken thead headers, row hover washes, striped variants, and page-sticky headers.
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
- **Sticky Headers:** Every `<thead>` pins to the top of the page scroller while its rows scroll (`table-base` default). Table wrappers — `.card`, `.section-card`, panel bodies, `.table-container`, `[data-ln-table]` — use `overflow: clip`, never a scrolling overflow, so none of them becomes the header's scroll container. `table-base($sticky: false)` opts a table out. A sticky search toolbar placed directly before the table (`.ln-table__toolbar`, `[data-ln-table] > header`) pins with it as one unit: the parent declares `--table-toolbar-block-size` from tokens (one control row) and the `<thead>` pins at that offset, under the toolbar. Override the property on the parent for a taller toolbar.
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

### Variant 1: Striped Table

```scss
#audit-table {
    @include table-base;
    @include table-striped;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `table-base` | mixin | `$sticky: true` | Base table recipe (borders, header fill, row hover, sticky `<thead>`) |
| `table-striped` | mixin | — | Alternating row background fills |
| `table-responsive` | mixin | — | Stacked record cards: label column from `td[data-label]`; unlabeled cells span the card |
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
> 3. **Narrow Screens:** Below the `md` viewport breakpoint every table renders one record per card (`table-base`'s `$responsive`, via `table-responsive`). Put `data-label` on each `<td>` — unlabeled cells span the card without a label. `.table-container` also switches by its own width (`cq-down(md)`) for narrow desktop columns. Column sort/filter controls live in the hidden `<thead>`. Never give a table ancestor `overflow: auto`/`hidden`: it becomes the header's scroll container.

---

## 5. Related Documents

- [`ln-table`](../components/ln-table.md) — JavaScript data table with sorting, search, pagination, and virtual scrolling.
- [`density`](./density.md) — Table row height and spacing scaling.
- [`status-badge`](./status-badge.md) — Status badges for table cell indicators.
