---
name: data-views
classification: skill
status: draft
domain: frontend
summary: List and table screens — layout, search/sort/filter composition, virtual scroll over pagination, selection and bulk actions, and empty states.
tags: [skill, data-table, list, search, filter, ln-specific]
---

# Data Views

Users work with data, not "pages". The data lives in a client-side cache (store), and search/sort/filter run synchronously against it; the render layer (`ln-table`, `ln-list`) is separate from the data layer (`ln-data-store` + `ln-data-coordinator`). Contracts: `../../components/ln-table.md`, `../../components/ln-data-store.md`, `../../components/ln-filter.md`, `../../components/ln-search.md`.

---

## List page layout

```
[🔍 Search…]                  [+ Create]   ← toolbar: search + primary action (top-right)
Name ⇅ │ Status ▾ ⇅ │ Date ↑              ← sticky header: sort + filter per column
… rows, virtual scroll …
1,247 items · 45 filtered                  ← sticky footer: counts, aggregates, bulk bar
```

- Filters live in column headers, never in a sidebar.
- Virtual scroll, never pagination — sort/filter/search operate on the full dataset.
- Shimmer on first load; consistent row heights; scroll position preserved on back-navigation.

## Table vs cards

Default to **table** for business data: 4+ comparable attributes, sort/filter/compare needs, density. Card grid only when items are visual, self-contained units with 1–2 key attributes. A 2-column table is a list.

## Search

- Client-side data → filter on every keystroke, no debounce (`Array.filter` on cache is synchronous). Debounce only when search hits a server endpoint.
- ✕ clear button when text present; `/` focuses search; term and results survive back-navigation.
- Zero results → the query-empty state, never a blank area.

## Sort

- Three-state cycle per column: unsorted ⇅ → ascending ↑ → descending ↓ → unsorted. Single-column only; indicator always visible; sortable columns are declared.
- Sorting/filtering read the raw value from the universal `data-ln-value` attribute — formatted display text is never sorted; behavior config stays scoped to the component.

## Filter

Anatomy: filter icon button in the column header → `ln-popover` containing an optional `ln-search` + a `ul` checkbox list bound to `ln-filter`.

- Options come from the **domain source** (enum) as authored markup — never derived from the data. Same markup serves SSR and SPA.
- State model is native checkboxes with an "All" reset sentinel (check sentinel → clear values; uncheck last value → sentinel returns; never-empty).
- Filters intersect (AND), and combine with search.
- Active-filter visibility is mandatory: ● dot on the column's filter icon + count in the footer ("45 of 1,247") + "Clear all" whenever any filter is active.
- Filter state survives back-navigation; `data-ln-persist` for reload persistence.

This is the **filter context** of the popover pattern — inputs carry filter attributes, not `name`. The form context is `./forms.md`.

## Selection + bulk actions

- Row checkbox → highlight + sticky bulk bar (count, actions, "Clear selection").
- Header checkbox selects visible rows only; optional "Select all N" banner for the full dataset.
- Destructive bulk → modal confirm with count; partial failure reported as "2 deleted, 3 failed".

## Row actions

- Row click = navigate to detail; action buttons stop propagation; checkbox toggles selection.
- Actions always visible (no hover-only — touch exists); overflow menu at 3+ actions; show only permitted actions.

## Empty states — two types, never confused

| Type | When | CTA |
|---|---|---|
| No data exists | resource never created | [+ Create] (onboarding) |
| Query returned zero | search/filter matched nothing | [Clear search] / [Clear filters] |

## Anti-patterns

Pagination; sidebar filters; filter options generated from displayed data; sorting formatted text; hover-only actions; a "View" button when the row is clickable; a data table without search/sort/virtual scroll (that's a raw `<table>`); same empty state for both types.
</content>
