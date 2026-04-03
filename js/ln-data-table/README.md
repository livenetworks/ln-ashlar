# ln-data-table

Event-driven data table. Receives data via `ln-data-table:set-data`, renders rows from `<template>`. Sort, filter, search, selection, virtual scroll, keyboard navigation.

Unlike `ln-table` (which parses existing `<tbody>` rows), `ln-data-table` is fed data programmatically — a coordinator listens for `ln-data-table:request-data`, queries the data source (e.g. `ln-store`), and dispatches `ln-data-table:set-data` back.

## Attributes

### Container

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-data-table` | wrapper | Table name (unique per page). Marks the component root. |
| `data-ln-data-table-selectable` | wrapper | Enable row checkboxes + select-all. |
| `data-ln-data-table-body` | `<tbody>` | Explicit tbody target (falls back to first `<tbody>`). |
| `data-ln-data-table-search` | `<input>` | Search input — emits on every keystroke. |
| `data-ln-data-table-clear-all` | `<button>` | Clears all active column filters. |

### Column headers

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-col="field"` | `<th>` | Maps column to a data field name. |
| `data-ln-col-sort` | `<button>` | Sort toggle (3-state cycle: asc → desc → none). |
| `data-ln-col-filter` | `<button>` | Opens filter dropdown with unique column values. |
| `data-ln-col-select` | `<th>` | Select-all checkbox column. Auto-creates checkbox if empty. |

### Row template

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-row` | `<tr>` | Row wrapper — click target for row navigation. |
| `data-ln-row-id` | `<tr>` | Set by JS from `record.id`. |
| `data-ln-row-select` | `<input>` | Row selection checkbox. |
| `data-ln-row-action="name"` | `<button>` | Row action button (e.g. `edit`, `delete`). |
| `data-ln-cell="field"` | `<td>` | JS fills `textContent` with `record[field]`. |
| `data-ln-cell-attr="field:attr"` | any | JS sets `setAttribute(attr, record[field])`. Comma-separated for multiple: `"id:data-id,url:href"`. |

### Footer

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-data-table-total` | `<span>` | Displays total record count (formatted via `Intl.NumberFormat`). |
| `data-ln-data-table-filtered` | `<span>` | Displays filtered count (hidden when no filter active). |
| `data-ln-data-table-filtered-wrap` | parent | Wrapper hidden when no filter is active. |
| `data-ln-data-table-selected` | `<span>` | Displays selected row count (hidden when 0). |
| `data-ln-data-table-selected-wrap` | parent | Wrapper hidden when no rows selected. |

## Events — Emitted by table

| Event | When | `detail` |
|-------|------|----------|
| `ln-data-table:request-data` | Table needs data (init, sort, filter, search) | `{ table, sort, filters, search }` |
| `ln-data-table:rendered` | Rows rendered | `{ table, total, visible }` |
| `ln-data-table:sort` | User clicks sort | `{ table, field, direction }` |
| `ln-data-table:filter` | User changes column filter | `{ table, field, values }` |
| `ln-data-table:clear-filters` | User clears all filters | `{ table }` |
| `ln-data-table:search` | User types in search | `{ table, query }` |
| `ln-data-table:row-click` | User clicks a row | `{ table, id, record }` |
| `ln-data-table:row-action` | User clicks action button | `{ table, id, action, record }` |
| `ln-data-table:select` | Selection changes | `{ table, selectedIds, count }` |
| `ln-data-table:select-all` | Select-all toggled | `{ table, selected }` |

## Events — Received by table

| Event | When | `detail` |
|-------|------|----------|
| `ln-data-table:set-data` | Feed data to render | `{ data: [], total, filtered }` |
| `ln-data-table:set-loading` | Toggle loading state | `{ loading: Boolean }` |

## Coordinator Pattern

The table does **not** fetch data. A coordinator script bridges data source and table:

```javascript
// Listen for data requests
document.addEventListener('ln-data-table:request-data', function (e) {
    if (e.detail.table !== 'my-table') return;

    // Query data source (ln-store, fetch, etc.)
    storeEl.lnStore.getAll({
        sort: e.detail.sort,
        filters: e.detail.filters,
        search: e.detail.search
    }).then(function (result) {
        // Feed back to table
        tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
            bubbles: true,
            detail: {
                data: result.data,
                total: result.total,
                filtered: result.filtered
            }
        }));
    });
});
```

## Templates

Three named `<template>` elements (using `data-ln-template`):

| Template name | Purpose |
|--------------|---------|
| `{table}-row` | Row template — cloned for each record |
| `{table}-empty` | Shown when total is 0 (no data at all) |
| `{table}-empty-filtered` | Shown when filters return 0 results |
| `{table}-column-filter` | Column filter dropdown (falls back to `column-filter`) |

Where `{table}` is the value of `data-ln-data-table`.

## Virtual Scroll

Activates automatically when data exceeds **200 rows**. Renders only visible rows + 15 buffer rows above/below viewport. Deactivates when data drops below threshold.

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate rows |
| `Home` / `End` | Jump to first/last row |
| `Enter` | Trigger row-click on focused row |
| `Space` | Toggle selection on focused row (if selectable) |
| `Escape` | Close filter dropdown |
| `/` | Focus search input |

## CSS Classes

| Class | Applied by | Description |
|-------|-----------|-------------|
| `ln-data-table--loading` | JS | Loading state on container |
| `ln-sort-asc` / `ln-sort-desc` | JS | Active sort direction on `<th>` |
| `ln-filter-active` | JS | Filter button has active filter |
| `ln-row-selected` | JS | Row is selected |
| `ln-row-focused` | JS | Row has keyboard focus |

## HTML Structure

```html
<section data-ln-data-table="documents"
         data-ln-data-table-selectable
         id="documents-table">

    <header>
        <h3>Documents</h3>
        <aside>
            <label>
                <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
                <input type="search" placeholder="Search..." data-ln-data-table-search>
            </label>
        </aside>
    </header>

    <table>
        <thead>
            <tr>
                <th data-ln-col-select></th>
                <th data-ln-col="title">
                    Title
                    <button data-ln-col-sort aria-label="Sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg></button>
                </th>
                <th data-ln-col="department">
                    Department
                    <button data-ln-col-sort aria-label="Sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-arrows-sort"></use></svg></button>
                    <button data-ln-col-filter aria-label="Filter"><svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg></button>
                </th>
                <th data-ln-col="status">
                    Status
                    <button data-ln-col-filter aria-label="Filter"><svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg></button>
                </th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody data-ln-data-table-body></tbody>
        <tfoot>
            <tr>
                <td colspan="99">
                    <span data-ln-data-table-total></span> items
                    <span data-ln-data-table-filtered-wrap>
                        · <span data-ln-data-table-filtered></span> filtered
                    </span>
                    <span data-ln-data-table-selected-wrap>
                        · <span data-ln-data-table-selected></span> selected
                    </span>
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Row template -->
    <template data-ln-template="documents-row">
        <tr data-ln-row>
            <td><input type="checkbox" data-ln-row-select></td>
            <td data-ln-cell="title"></td>
            <td data-ln-cell="department"></td>
            <td data-ln-cell="status"></td>
            <td>
                <button data-ln-row-action="edit" aria-label="Edit"><svg class="ln-icon" aria-hidden="true"><use href="#ln-edit"></use></svg></button>
                <button data-ln-row-action="delete" aria-label="Delete"><svg class="ln-icon" aria-hidden="true"><use href="#ln-trash"></use></svg></button>
            </td>
        </tr>
    </template>

    <!-- Empty states -->
    <template data-ln-template="documents-empty">
        <tr><td colspan="99"><h3>No documents yet</h3></td></tr>
    </template>

    <template data-ln-template="documents-empty-filtered">
        <tr><td colspan="99">
            <h3>No results</h3>
            <button data-ln-data-table-clear-all>Clear all filters</button>
        </td></tr>
    </template>

    <!-- Column filter dropdown template (scoped: {table}-column-filter, falls back to column-filter) -->
    <template data-ln-template="documents-column-filter">
        <div class="column-filter-dropdown">
            <input type="search" data-ln-filter-search placeholder="Search...">
            <ul data-ln-filter-options></ul>
            <button data-ln-filter-clear>Clear filter</button>
        </div>
    </template>
</section>
```

## Column Filter Dropdown

The column filter template is cloned when a `[data-ln-col-filter]` button is clicked. JS looks for `{table}-column-filter` first (e.g. `documents-column-filter`), then falls back to `column-filter` as a shared default. It auto-populates with unique values from the current data for that field. Checkboxes allow multi-select filtering. A search input within the dropdown filters the list (hidden when ≤8 values).

## API

```javascript
// Manual init (MutationObserver handles dynamic DOM automatically)
window.lnDataTable(document.body);

// Instance state (on DOM element)
var el = document.querySelector('[data-ln-data-table]');
el.lnDataTable.isLoaded        // Boolean
el.lnDataTable.totalCount      // Number
el.lnDataTable.visibleCount    // Number
el.lnDataTable.currentSort     // { field, direction } | null
el.lnDataTable.currentFilters  // { field: [values] }
el.lnDataTable.currentSearch   // String
el.lnDataTable.selectedIds     // Set
el.lnDataTable.selectedCount   // Number (computed)

// Destroy
el.lnDataTable.destroy()
```

## Dependencies

- `ln-core` — `cloneTemplate`, `dispatch`, `findElements`, `guardBody`
