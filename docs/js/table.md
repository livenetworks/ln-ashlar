# Table

Data table component — client-side search, per-column filtering, sorting, virtual scroll. File: `js/ln-table/ln-table.js`.

Companion: `js/ln-table/ln-table-sort.js` (sort header clicks).

## HTML

```html
<div data-ln-table>
    <div class="ln-table__toolbar">
        <!-- ln-search, ln-filter, or custom controls here -->
    </div>
    <table>
        <thead>
            <tr>
                <th data-ln-sort="string">Name</th>
                <th data-ln-sort="number" data-ln-filter-col="dept">Dept</th>
                <th data-ln-sort="date">Joined</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Alice</td>
                <td>Engineering</td>
                <td data-ln-value="1672531200">2023-01-01</td>
                <td><button>Edit</button></td>
            </tr>
            <!-- server-rendered rows -->
        </tbody>
    </table>

    <template data-ln-table-empty>
        <p>No results found.</p>
    </template>
</div>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-table` | component root | Initializes the table component |
| `data-ln-sort="type"` | `<th>` | Sort type: `string`, `number`, or `date`. Enables sorting on this column |
| `data-ln-filter-col="key"` | `<th>` | Maps this column to a filter key (used by `ln-filter` per-column filtering) |
| `data-ln-value="raw"` | `<td>` | Override cell value for sorting (e.g., timestamp for dates) |
| `data-ln-table-empty` | `<template>` | Content to show when filter/search yields zero results |

## Events

### Emitted

| Event | Bubbles | `detail` | When |
|-------|---------|----------|------|
| `ln-table:ready` | yes | `{ total }` | After initial row parse completes |
| `ln-table:filter` | yes | `{ term, matched, total }` | After search or column filter changes |
| `ln-table:sorted` | yes | `{ column, direction, matched, total }` | After sort changes |
| `ln-table:empty` | yes | `{ term, total }` | When filter/search produces zero results |

### Consumed

| Event | From | Purpose |
|-------|------|---------|
| `ln-search:change` | ln-search | Full-text search. `e.preventDefault()` tells ln-search to skip its own DOM hiding |
| `ln-table:sort` | ln-table-sort | Sort by column. Detail: `{ column, sortType, direction }` |
| `ln-filter:changed` | ln-filter | Per-column filter. Detail: `{ key, value }` |

## API

```js
const el = document.querySelector('[data-ln-table]');
el.lnTable.destroy();   // remove all listeners, virtual scroll, column locks
```

## CSS (consumer provides)

```css
.ln-table__toolbar { /* toolbar above the table */ }
.ln-table__empty td { text-align: center; padding: 2rem; }
.ln-table__spacer { /* virtual scroll spacer rows — styled inline, usually no overrides needed */ }
```

---

## Internal Architecture

This section explains how the component works internally. The goal: a developer or AI reading this should fully understand the data flow, state model, and render pipeline without reading the source.

### Data Model

ln-table is a **server-rendered** table component. Rows arrive as HTML in `<tbody>`, not from a JS data source. On initialization, `_parseRows()` reads the existing DOM rows once and builds an in-memory array (`_data`). Each entry stores:

```
{
    html:       String    // tr.outerHTML — the full row markup, frozen at parse time
    sortKeys:   Array     // per-column: parsed float for number/date, string for string, null for unsortable
    rawTexts:   Array     // per-column: td.textContent.trim().toLowerCase()
    searchText: String    // all columns except the last, joined with space (lowercase)
}
```

After parsing, the original `<tbody>` rows are replaced by re-rendering from these cached HTML strings. All subsequent filtering, sorting, and rendering operate on this in-memory array — the DOM is output-only.

**Why `outerHTML` strings?** The component supports virtual scroll (only visible rows in DOM). Storing pre-rendered HTML strings means rendering a window of rows is a single `innerHTML` assignment. No `createElement` chains, no template cloning, no `fill()` — the markup was already built by the server.

### State Properties

Filter/sort parameters are plain instance properties — no reactive proxy, no batching:

```
this._searchTerm    = ''       // from ln-search:change
this._sortCol       = -1       // column index, -1 = no sort
this._sortDir       = null     // 'asc' | 'desc' | null
this._sortType      = null     // 'string' | 'number' | 'date' | null
this._columnFilters = {}       // { filterKey: [values], ... }
```

Each event handler (search, sort, column filter) updates these properties directly, then calls `_applyFilterAndSort()` → `_render()` → `dispatch()` synchronously in the same handler.

### Update Flow

```
event handler (e.g. _onSearch):
    1. set this._searchTerm = term
    2. _applyFilterAndSort()    — recompute _filteredData from _data
    3. reset _vStart/_vEnd      — force virtual scroll recalc
    4. _render()                — choose render path based on count
    5. dispatch('ln-table:filter', { term, matched, total })
```

No microtask batching, no pending events queue. Each handler runs the full pipeline synchronously and dispatches its event immediately after rendering.

**Initial render** (`_parseRows`) sets `_filteredData = _data.slice()` and calls `_render()` directly, then dispatches `ln-table:ready`.

### Render Paths

`_render()` decides which path based on filtered row count and active filters:

| Condition | Path | Description |
|-----------|------|-------------|
| count = 0 AND (search or column filter active) | `_showEmptyState()` | Clones `<template data-ln-table-empty>` into a full-width `<td>`, dispatches `ln-table:empty` |
| count > 200 (`VIRTUAL_THRESHOLD`) | `_renderVirtual()` | Only visible rows + buffer in DOM |
| otherwise | `_renderAll()` | All filtered rows via `innerHTML` |

Transitions between paths are automatic. Entering virtual scroll calls `_enableVirtualScroll()` (attaches scroll/resize listeners). Leaving it calls `_disableVirtualScroll()` (removes listeners, cancels pending rAF).

### Virtual Scroll

Activated when `_filteredData.length > 200`. The mechanism:

1. **Row height**: measured from the first row at parse time (`_rowHeight`). Assumed uniform.
2. **Column widths**: locked via `<colgroup>` with explicit `col.style.width` values + `table-layout: fixed`. Prevents layout shift when rows change.
3. **Visible window**: on each scroll/resize (throttled via `requestAnimationFrame`), compute which rows are visible based on `window.scrollY` and the table's position.
4. **Buffer**: `BUFFER_ROWS = 15` rows above and below the viewport to prevent flicker during fast scroll.
5. **Spacer rows**: `<tr class="ln-table__spacer" aria-hidden="true">` with calculated height above/below the visible window to maintain scroll height.
6. **Skip check**: if `startRow` and `endRow` haven't changed since last render, skip DOM update entirely.

Virtual scroll listeners are passive (no `preventDefault`). Cleanup on destroy removes both `scroll` and `resize` listeners.

### Filter + Sort Pipeline

`_applyFilterAndSort()` is called by each event handler. It produces `_filteredData` from `_data`:

1. **Text search**: if `_searchTerm` is set, rows where `searchText.indexOf(term) === -1` are excluded. Search covers all columns except the last (assumed to be an actions column).
2. **Column filters**: if `_columnFilters` has entries, each key is mapped to a column index via `th[data-ln-filter-col]`. Only columns with a mapped `data-ln-filter-col` are processed — unmapped filter keys are ignored. Multiple column filters are AND-combined; values within a single filter are OR-combined (any match passes).
3. **Sort**: if `_sortCol >= 0` and `_sortDir` is set, `_filteredData` is sorted in-place. Numeric/date columns compare `sortKeys` (pre-parsed floats). String columns use `Intl.Collator` (locale-aware, case-insensitive) with fallback to `<`/`>` comparison.

Search and column filters stack — both must pass for a row to appear.

### Event Flow

Events dispatch synchronously at the end of each handler, after render completes:

```
_onSearch handler:
    1. e.preventDefault()
    2. set _searchTerm = term
    3. _applyFilterAndSort()
    4. reset virtual scroll range
    5. _render()
    6. dispatch('ln-table:filter', { term, matched, total })
```

Because dispatch happens after `_render()`, event listeners receive correct `matched`/`total` counts that reflect the already-updated DOM.

The `ln-search:change` handler calls `e.preventDefault()` — this tells ln-search to skip its own DOM show/hide logic (ln-table handles all rendering itself).

### Companion: ln-table-sort

`ln-table-sort.js` is a separate component that auto-initializes on any `<table>` containing `th[data-ln-sort]`. It handles:

- Click cycle on `<th>`: asc → desc → unsorted → asc
- `data-ln-sort-active="asc|desc"` attribute on the active `<th>`
- Dispatches `ln-table:sort` event (bubbles up to `[data-ln-table]`)

ln-table and ln-table-sort communicate only via events — no direct coupling.

### Companion: ln-filter (column filters)

Per-column dropdown filters are implemented by placing `ln-filter` components inside `<th>` elements. When a filter button is clicked, `ln-filter` dispatches `ln-filter:changed` which bubbles up to `[data-ln-table]`. ln-table matches the filter `key` to a column via `th[data-ln-filter-col="key"]`.

### Internal Properties

| Property | Purpose |
|----------|---------|
| `_data` | Full parsed row array. Set once in `_parseRows` |
| `_filteredData` | Derived from `_data` by `_applyFilterAndSort` |
| `_searchTerm` | Current search term (string) |
| `_sortCol`, `_sortDir`, `_sortType` | Current sort state |
| `_columnFilters` | Active column filters (`{ key: [values] }`) |
| `_virtual` | Boolean — whether virtual scroll is currently active |
| `_vStart`, `_vEnd` | Current visible row range. Reset to -1 to force recalc |
| `_rowHeight` | Measured once at parse time. Assumed uniform for virtual scroll math |
| `_colgroup` | Reference to injected `<colgroup>` for width locking |
| `_rafId`, `_scrollHandler` | Virtual scroll rAF and listener references for cleanup |

### Lifecycle

1. **Init**: MutationObserver or DOMContentLoaded → `findElements` → `new _component(dom)`
2. **Parse**: if `<tbody>` has rows, `_parseRows()` runs immediately. Otherwise, a MutationObserver waits for rows to appear (AJAX-loaded tables).
3. **Steady state**: event handler → update properties → `_applyFilterAndSort()` → `_render()` → `dispatch()`
4. **Destroy**: `destroy()` removes event listeners, virtual scroll, colgroup, clears data, deletes instance from DOM element
