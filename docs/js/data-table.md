# Data Table

Event-driven data table — receives data programmatically, renders rows from templates. File: `js/ln-data-table/ln-data-table.js`.

Unlike `ln-table` (parses existing `<tbody>` rows), `ln-data-table` is fed data via events. A coordinator bridges the data source and the table.

## HTML

```html
<section data-ln-data-table="documents" data-ln-data-table-selectable>
    <table>
        <thead>
            <tr>
                <th data-ln-col-select></th>
                <th data-ln-col="title">Title <button data-ln-col-sort></button></th>
                <th data-ln-col="dept">Dept <button data-ln-col-filter></button></th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody data-ln-data-table-body></tbody>
    </table>

    <template data-ln-template="documents-row">
        <tr data-ln-row>
            <td><input type="checkbox" data-ln-row-select></td>
            <td data-ln-cell="title"></td>
            <td data-ln-cell="dept"></td>
            <td><button data-ln-row-action="edit"></button></td>
        </tr>
    </template>
</section>
```

## Attributes

### Container

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-data-table` | wrapper | Table name (unique per page) |
| `data-ln-data-table-selectable` | wrapper | Enables row checkboxes + select-all |
| `data-ln-data-table-body` | `<tbody>` | Explicit render target (falls back to first `<tbody>`) |
| `data-ln-data-table-search` | `<input>` | Search input — emits on every keystroke |
| `data-ln-data-table-clear-all` | `<button>` | Clears all active column filters |

### Column Headers

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-col="field"` | `<th>` | Maps column to data field name |
| `data-ln-col-sort` | `<button>` | Sort toggle (asc → desc → none) |
| `data-ln-col-filter` | `<button>` | Opens filter dropdown with unique values |
| `data-ln-col-select` | `<th>` | Select-all checkbox column |

### Row Template

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-row` | `<tr>` | Row wrapper — click target |
| `data-ln-row-select` | `<input>` | Row selection checkbox |
| `data-ln-row-action="name"` | `<button>` | Row action button |
| `data-ln-cell="field"` | `<td>` | Fills `textContent` with `record[field]` |
| `data-ln-cell-attr="field:attr"` | any | Sets `setAttribute(attr, record[field])` |

### Footer

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-data-table-total` | `<span>` | Total record count |
| `data-ln-data-table-filtered` | `<span>` | Filtered count (hidden when no filter) |
| `data-ln-data-table-filtered-wrap` | parent | Wrapper hidden when no filter active |

## Events — Emitted

All events dispatch on the `[data-ln-data-table]` element and bubble.

| Event | When | `detail` |
|-------|------|----------|
| `ln-data-table:request-data` | Needs data (init, sort, filter, search) | `{ table, sort, filters, search }` |
| `ln-data-table:rendered` | Rows rendered | `{ table, total, visible }` |
| `ln-data-table:sort` | User clicks sort | `{ table, field, direction }` |
| `ln-data-table:filter` | User changes column filter | `{ table, field, values }` |
| `ln-data-table:clear-filters` | User clears all filters | `{ table }` |
| `ln-data-table:search` | User types in search | `{ table, query }` |
| `ln-data-table:row-click` | User clicks a row | `{ table, id, record }` |
| `ln-data-table:row-action` | User clicks action button | `{ table, id, action, record }` |
| `ln-data-table:select` | Selection changes | `{ table, selectedIds, count }` |
| `ln-data-table:select-all` | Select-all toggled | `{ table, selected }` |

## Events — Received

| Event | When | `detail` |
|-------|------|----------|
| `ln-data-table:set-data` | Feed data to render | `{ data: [], total, filtered }` |
| `ln-data-table:set-loading` | Toggle loading state | `{ loading: Boolean }` |

## Data Flow — Coordinator Pattern

```
ln-data-table:request-data  →  coordinator  →  ln-data-table:set-data
     (table emits)              (your JS)         (table receives)
```

The table never fetches data. A coordinator script listens for `request-data`, queries the source (ln-store, fetch, static array), and dispatches `set-data` back.

```javascript
document.addEventListener('ln-data-table:request-data', function (e) {
    if (e.detail.table !== 'documents') return;

    storeEl.lnStore.getAll({
        sort: e.detail.sort,
        filters: e.detail.filters,
        search: e.detail.search
    }).then(function (result) {
        tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
            bubbles: true,
            detail: { data: result.data, total: result.total, filtered: result.filtered }
        }));
    });
});
```

## Templates

Three named `<template data-ln-template="...">` elements:

| Name | Purpose |
|------|---------|
| `{table}-row` | Cloned for each record |
| `{table}-empty` | Shown when total = 0 |
| `{table}-empty-filtered` | Shown when filters return 0 |

Where `{table}` = value of `data-ln-data-table`.

## Row Rendering

For each record in `data`:

1. Clone `{table}-row` template
2. Fill `[data-ln-cell="field"]` → `el.textContent = record[field]`
3. Fill `[data-ln-cell-attr="field:attr"]` → `el.setAttribute(attr, record[field])`
4. Set `data-ln-row-id` from `record.id`
5. Attach `record` as `tr._lnRecord` (used by row-click/row-action events)

## Column Filter Dropdown

Clicking `[data-ln-col-filter]` clones the `column-filter` template and populates it with unique values from the current dataset for that column. Checkboxes allow multi-select. A search input filters the list (hidden when ≤8 unique values).

## Virtual Scroll

Activates when data exceeds **200 rows**. Renders only visible rows + 15 buffer above/below. Uses spacer `<tr>` elements for correct scroll height. Row height measured from first rendered row.

## Keyboard Navigation

| Key | Action |
|-----|--------|
| `↑` / `↓` | Navigate rows |
| `Home` / `End` | Jump to first/last row |
| `Enter` | Trigger row-click |
| `Space` | Toggle selection (if selectable) |
| `Escape` | Close filter dropdown |
| `Ctrl+K` | Focus search input |

## CSS Classes (applied by JS)

| Class | Description |
|-------|-------------|
| `ln-data-table--loading` | Loading state on container |
| `ln-sort-asc` / `ln-sort-desc` | Sort direction on `<th>` |
| `ln-filter-active` | Filter button has active filter |
| `ln-row-selected` | Row is selected |
| `ln-row-focused` | Row has keyboard focus |

## API

```javascript
window.lnDataTable(document.body);        // Manual init

var el = document.querySelector('[data-ln-data-table]');
el.lnDataTable.isLoaded                   // Boolean
el.lnDataTable.totalCount                 // Number
el.lnDataTable.visibleCount               // Number
el.lnDataTable.currentSort                // { field, direction } | null
el.lnDataTable.currentFilters             // { field: [values] }
el.lnDataTable.currentSearch              // String
el.lnDataTable.selectedIds                // Set
el.lnDataTable.selectedCount              // Number (computed)
el.lnDataTable.destroy()                  // Cleanup
```

## Dependencies

- `ln-core` — `cloneTemplate`, `dispatch`, `findElements`, `guardBody`
