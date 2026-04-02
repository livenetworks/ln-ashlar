# ln-data-table — Virtual Scroll Data Table Component

> ln-acme UI component for rendering, sorting, filtering, and interacting with tabular data.
> Design spec → see `ui/components/data-table.md`
> Data layer → see `ln-store.md`

---

## What This Is

A pure UI component. It renders table rows from data it receives, handles virtual scroll, sticky header/footer, column sort/filter, row selection, and search. It does NOT fetch, cache, or sync data — that's ln-store's job.

---

## HTML Structure (Blade Template)

Blade renders the TABLE SHELL. JS fills the data rows.

```html
<section data-ln-data-table="documents"
         data-ln-data-table-store="documents"
         data-ln-data-table-row-click="/documents/{id}"
         data-ln-data-table-selectable>

    <!-- Toolbar (SSR) -->
    <header>
        <input type="search" data-ln-data-table-search
               placeholder="Search documents...">
        <a href="/documents/create" class="btn">+ Create</a>
    </header>

    <!-- Table (SSR shell, JS fills rows) -->
    <table>
        <thead>
            <tr>
                <th data-ln-col-select></th>
                <th data-ln-col="title" data-ln-col-sortable data-ln-col-sticky>
                    Name
                    <button data-ln-col-sort class="ln-icon-sort"></button>
                </th>
                <th data-ln-col="status" data-ln-col-sortable data-ln-col-filterable>
                    Status
                    <button data-ln-col-sort class="ln-icon-sort"></button>
                    <button data-ln-col-filter class="ln-icon-filter"></button>
                </th>
                <th data-ln-col="category" data-ln-col-filterable>
                    Category
                    <button data-ln-col-filter class="ln-icon-filter"></button>
                </th>
                <th data-ln-col="updated_at" data-ln-col-sortable>
                    Date
                    <button data-ln-col-sort class="ln-icon-sort"></button>
                </th>
                <th data-ln-col-actions></th>
            </tr>
        </thead>
        <tbody data-ln-data-table-body>
            <!-- JS renders rows here -->
            <!-- Skeleton rows shown via CSS until data arrives -->
        </tbody>
        <tfoot>
            <tr>
                <td colspan="99" data-ln-data-table-footer>
                    <span data-ln-data-table-count></span>
                    <span data-ln-data-table-aggregates></span>
                </td>
            </tr>
        </tfoot>
    </table>

    <!-- Row template -->
    <template data-ln-template="documents-row">
        <tr data-ln-row>
            <td><input type="checkbox" data-ln-row-select></td>
            <td data-ln-cell="title"></td>
            <td data-ln-cell="status"></td>
            <td data-ln-cell="category"></td>
            <td data-ln-cell="updated_at"></td>
            <td>
                <button data-ln-row-action="edit" class="ln-icon-edit" aria-label="Edit"></button>
                <button data-ln-row-action="delete" class="ln-icon-delete" aria-label="Delete"></button>
            </td>
        </tr>
    </template>

    <!-- Filter dropdown template -->
    <template data-ln-template="column-filter">
        <div class="column-filter-dropdown">
            <input type="search" data-ln-filter-search placeholder="Search...">
            <ul data-ln-filter-options>
                <!-- JS populates with checkboxes -->
            </ul>
            <button data-ln-filter-clear>Clear filter</button>
        </div>
    </template>

    <!-- Empty state -->
    <template data-ln-template="documents-empty">
        <tr>
            <td colspan="99">
                <article class="section-empty">
                    <h3>No documents yet</h3>
                    <p>Create your first document to get started</p>
                    <a href="/documents/create" class="btn">+ Create Document</a>
                </article>
            </td>
        </tr>
    </template>

    <!-- Empty filtered state -->
    <template data-ln-template="documents-empty-filtered">
        <tr>
            <td colspan="99">
                <article class="section-empty">
                    <h3>No results</h3>
                    <p>Try adjusting your search or filters</p>
                    <button data-ln-data-table-clear-all class="btn btn--secondary">Clear all filters</button>
                </article>
            </td>
        </tr>
    </template>
</section>
```

---

## Data Attributes

### On Container

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-ln-data-table` | Yes | Table name (unique per page) |
| `data-ln-data-table-store` | Yes | Name of the `data-ln-store` to read from |
| `data-ln-data-table-row-click` | No | URL pattern for row click navigation. `{id}` is replaced with row ID. |
| `data-ln-data-table-selectable` | No | Enable row selection (checkboxes) |

### On Column Headers

| Attribute | Description |
|-----------|-------------|
| `data-ln-col="{field}"` | Maps this column to a data field |
| `data-ln-col-sortable` | Column can be sorted (sort toggle button rendered) |
| `data-ln-col-filterable` | Column can be filtered (filter dropdown button rendered) |
| `data-ln-col-sticky` | Column stays fixed during horizontal scroll |
| `data-ln-col-select` | Checkbox column header (select all) |
| `data-ln-col-actions` | Actions column (no sort, no filter) |
| `data-ln-col-align="{left\|right\|center}"` | Column alignment (default: left) |
| `data-ln-col-type="{text\|numeric\|date\|status\|boolean}"` | Column type for formatting and alignment |

### On Cells (in Template)

| Attribute | Description |
|-----------|-------------|
| `data-ln-cell="{field}"` | JS fills this cell with the field value |
| `data-ln-row` | Marks a row for click handling |
| `data-ln-row-select` | Row selection checkbox |
| `data-ln-row-action="{action}"` | Row action button |

---

## Instance API (on DOM Element)

```javascript
const tableEl = document.querySelector('[data-ln-data-table="documents"]');

// State
tableEl.lnDataTable.selectedIds        // → Set<id>
tableEl.lnDataTable.selectedCount      // → Number
tableEl.lnDataTable.currentSort        // → { field, direction } | null
tableEl.lnDataTable.currentFilters     // → { field: [values] }
tableEl.lnDataTable.currentSearch      // → String
tableEl.lnDataTable.isLoaded           // → Boolean

// Read-only queries (delegated to store)
tableEl.lnDataTable.visibleCount       // → Number (after filters + search)
tableEl.lnDataTable.totalCount         // → Number (unfiltered)
```

---

## CustomEvents — Emitted by Table

### User Interactions

| Event | When | Detail |
|-------|------|--------|
| `ln-data-table:sort` | User clicks sort toggle | `{ table, field, direction }` |
| `ln-data-table:filter` | User changes column filter | `{ table, field, values }` |
| `ln-data-table:search` | User types in search (debounced) | `{ table, query }` |
| `ln-data-table:clear-filters` | User clears all filters | `{ table }` |
| `ln-data-table:row-click` | User clicks a row | `{ table, id, record }` |
| `ln-data-table:row-action` | User clicks row action button | `{ table, id, action, record }` |
| `ln-data-table:select` | Selection changes | `{ table, selectedIds, count }` |
| `ln-data-table:select-all` | Select all toggled | `{ table, selected: Boolean }` |

### Request Events (for Coordinator)

| Event | When | Detail |
|-------|------|--------|
| `ln-data-table:request-data` | Table needs data (on init, after sort/filter/search) | `{ table, sort, filters, search }` |
| `ln-data-table:request-delete` | User confirmed row delete | `{ table, id }` |
| `ln-data-table:request-bulk-delete` | User confirmed bulk delete | `{ table, ids }` |

---

## CustomEvents — Received by Table

The coordinator dispatches these to feed data to the table.

| Event | When | Detail |
|-------|------|--------|
| `ln-data-table:set-data` | Data ready to render | `{ data: [], total, filtered, aggregates }` |
| `ln-data-table:set-loading` | Show loading state | `{ loading: Boolean }` |
| `ln-data-table:set-error` | Show error state | `{ message, retryable }` |

---

## Coordinator Wiring Example

```javascript
// Page coordinator — connects ln-store to ln-data-table
(function() {
    const storeEl = document.querySelector('[data-ln-store="documents"]');
    const tableEl = document.querySelector('[data-ln-data-table="documents"]');
    if (!storeEl || !tableEl) return;

    // Table requests data → query store → feed back to table
    document.addEventListener('ln-data-table:request-data', function(e) {
        if (e.detail.table !== 'documents') return;

        storeEl.lnStore.getAll({
            sort: e.detail.sort,
            filters: e.detail.filters,
            search: e.detail.search
        }).then(function(result) {
            tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
                bubbles: true,
                detail: result    // { data, total, filtered, aggregates }
            }));
        });
    });

    // Store synced → re-query with current table state
    document.addEventListener('ln-store:synced', function(e) {
        if (e.detail.store !== 'documents') return;

        // Re-query with current sort/filter/search
        storeEl.lnStore.getAll({
            sort: tableEl.lnDataTable.currentSort,
            filters: tableEl.lnDataTable.currentFilters,
            search: tableEl.lnDataTable.currentSearch
        }).then(function(result) {
            tableEl.dispatchEvent(new CustomEvent('ln-data-table:set-data', {
                bubbles: true,
                detail: result
            }));
        });
    });

    // Row click → navigate
    document.addEventListener('ln-data-table:row-click', function(e) {
        if (e.detail.table !== 'documents') return;
        window.location.href = '/documents/' + e.detail.id;
    });

    // Row action → delegate to store
    document.addEventListener('ln-data-table:row-action', function(e) {
        if (e.detail.table !== 'documents') return;
        if (e.detail.action === 'delete') {
            storeEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
                bubbles: true,
                detail: { id: e.detail.id }
            }));
        }
    });

    // Store mutation confirmed/reverted → toast feedback
    document.addEventListener('ln-store:confirmed', function(e) {
        if (e.detail.store !== 'documents') return;
        // Show success toast
    });

    document.addEventListener('ln-store:reverted', function(e) {
        if (e.detail.store !== 'documents') return;
        // Show error toast
    });
})();
```

---

## Virtual Scroll

### Rendering

- Only visible rows + buffer are in the DOM
- Scroll container has computed height based on `totalCount × rowHeight`
- As user scrolls, rows are recycled (removed from top, added at bottom, or vice versa)
- Template cloning for row creation (never `createElement` chains)

### Row Height

- Estimated row height calculated from first rendered batch
- Variable row heights supported (virtual scroll adjusts scroll container dynamically)
- If exact heights matter: pre-compute from data (e.g., multi-line text fields)

### Scroll Position Preservation

- On filter/sort change: scroll to top
- On return from detail page: restore previous scroll position (stored in sessionStorage)
- On data update (delta sync): maintain current scroll position

---

## Column Filter Dropdown

### Behavior

```
User clicks filter icon ▾ on column header
  → Dropdown opens below the header cell
  → Dropdown shows checkboxes with unique values from that column
  → If >8 values: search input at top of dropdown
  → User checks/unchecks values
  → On change: table emits ln-data-table:filter event
  → Dropdown stays open until outside click
```

### Unique Values

Extracted from the current dataset in the store. If filters on OTHER columns are active, the unique values for THIS column should reflect the filtered data (cascading filters).

### Active Filter Indicator

- Column header shows ▾● (dot indicator) when filter is active
- Footer shows active filter pills (dismissible)

---

## Cell Rendering

### By Column Type

| Type (data-ln-col-type) | Rendering |
|--------------------------|-----------|
| `text` (default) | Plain text, truncate with `title` attribute for tooltip |
| `numeric` | Right-aligned, thousands separator, monospace font |
| `date` | Short format ("Jan 15"), `title` attribute with full date |
| `status` | Badge component (dot + text + tint) |
| `boolean` | Icon (✓ / ✕) |

### Custom Renderers

For complex cells (status badges, linked names), the template can contain nested elements:

```html
<template data-ln-template="documents-row">
    <tr data-ln-row>
        <td data-ln-cell="title"></td>
        <td data-ln-cell="status">
            <span class="status-badge" data-ln-cell-attr="status:class">
                <span data-ln-cell="status_label"></span>
            </span>
        </td>
    </tr>
</template>
```

`data-ln-cell-attr="status:class"` sets the element's class based on the `status` field value.

---

## Skeleton Loading

### CSS-Only Skeletons (SSR)

Blade renders skeleton rows that are visible until JS takes over:

```html
<tbody data-ln-data-table-body>
    <!-- Skeleton rows: CSS-only, replaced by JS when data arrives -->
    <tr class="ln-skeleton-row" aria-hidden="true">
        <td><span class="ln-skeleton"></span></td>
        <td><span class="ln-skeleton"></span></td>
        <td><span class="ln-skeleton"></span></td>
        <td><span class="ln-skeleton"></span></td>
    </tr>
    <!-- Repeat 8-10 times to fill viewport -->
</tbody>
```

When JS renders real rows, skeleton rows are removed. On subsequent visits (IndexedDB cache), skeletons are replaced so fast they're invisible.

---

## Anti-Patterns

- **Table fetching its own data** — table is UI only, store provides data
- **createElement chains for rows** — use `<template>` + cloneNode
- **Rendering all rows in DOM** — virtual scroll, always
- **Sort/filter making server requests** — client-side from store (IndexedDB)
- **Filter dropdown inside sort toggle** — separate controls, different interaction frequency
- **Inline styles for column widths** — SCSS handles sizing
- **Table knowing about routes/navigation** — emit events, coordinator handles navigation
- **Rebuilding the entire table on data change** — diff and update changed rows only
