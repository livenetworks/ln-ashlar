---
name: tables
classification: css
status: draft
domain: frontend
summary: Base data table styling, sunken header bars, sticky headers, and responsive stacked cards.
source: theme/config/mixins/_table.scss
tags: [table, data-table, responsive, layout, tabular-nums]
---

# 📊 tables

---

## 1. Core Behavior & Responsibility

The `tables` SCSS module (`theme/components/_table.scss` and `theme/config/mixins/_table.scss`) styles enterprise data tables:
- **`@include table-base($sticky)`:** Full table chrome with rounded clipping (`overflow: clip`), sunken `<thead>`, tabular numbers, and density-reactive cell padding. Automatically bound to bare `table` elements.
- **`@include table-responsive`:** Stacks table rows into card blocks on narrow viewports using `data-label` attributes on each `<td>`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="table-container">
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Jane Doe</td>
                <td>Administrator</td>
                <td><span class="badge success">Active</span></td>
            </tr>
        </tbody>
    </table>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `table-base` | mixin | `$sticky: false` | Primary table mixin; $sticky: true enables sticky <thead> |
| `table-responsive` | mixin | — | Transforms rows into stacked mobile card blocks |
| `table-striped` | mixin | — | Alternates odd row backgrounds via --bg-sunken |
| `.table-container` | class | — | Scrollable table wrapper container |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Numeric Column Alignment:** Always include numeric headers with `text-align: right` and pair numeric cells with `data-ln-number` and tabular numbers.
> 2. **Responsive Labels:** When using `@include table-responsive`, ensure each `<td>` contains a `data-label="..."` attribute matching its column header.

---

## 5. Related Documents

- [`density`](./density.md) — Table row density and height floors.
- [`chip`](./chip.md) — Filter chips in tables.
- [`status-badge`](./status-badge.md) — Status badges inside table cells.
