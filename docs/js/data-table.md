# data-table — architecture

> The component is a render engine, not a data source. It owns rendering, sort/filter/search UI, selection, virtual scroll and keyboard navigation; it never owns data.

The implementation lives in [`js/ln-data-table/ln-data-table.js`](../../js/ln-data-table/ln-data-table.js).
This document covers internal mechanics — instance state, render flow,
event lifecycle, performance considerations and the design decisions that
shape the shape of the component. For consumer-facing usage see
[`js/ln-data-table/README.md`](../../js/ln-data-table/README.md).

## Internal state

Each instance is a JS object created by `_component(dom)` and stored as
`dom.lnDataTable`. The state is plain instance fields — no Proxy, no
reactive layer. Re-renders are imperative and triggered explicitly by
the methods that mutate data.

### DOM references (set once at init)

| Field | Source | Used by |
|---|---|---|
| `dom` | constructor argument | Event dispatch target, lookup root |
| `name` | `dom.getAttribute('data-ln-data-table')` | Template lookup, event detail routing |
| `table`, `tbody`, `thead`, `ths` | `dom.querySelector(...)` / `Array.from(querySelectorAll('th'))` | Render targets, header click delegation |
| `_searchInput` | `[data-ln-data-table-search]` | Search keystroke listener |
| `_totalSpan`, `_filteredSpan`, `_selectedSpan` | `[data-ln-data-table-total/...]` | Footer text update |
| `_filteredWrap`, `_selectedWrap` | closest `[data-ln-data-table-*-wrap]` | Hide/show wrapper for "· N filtered" / "· N selected" |
| `_selectAllCheckbox` | input inside `[data-ln-col-select]` (auto-created if `<th>` empty) | Select-all change listener |
| `_filterableFields` | derived from `<th>` having `data-ln-col` + `[data-ln-col-filter]` descendant | Auto-derive filter options on `set-data` without explicit `filterOptions` |

### Public state (read by consumers, mutated by handlers)

| Field | Mutated by | Read by |
|---|---|---|
| `isLoaded` | `_onSetData` (true), `_onSetLoading(true)` (false) | Consumer code |
| `totalCount` | `_onSetData` (from `detail.total`) | Footer + consumer |
| `visibleCount` | `_onSetData` (from `detail.filtered`) | Footer + consumer |
| `currentSort` | `_handleSort` | `_requestData` payload |
| `currentFilters` | `_onFilterChange`, `_onClearAll`, filter-clear button | `_requestData` payload, `_updateFilterIndicators` |
| `currentSearch` | `_onSearchInput` | `_requestData` payload |
| `selectedIds` | `_onSelectionChange`, `_onSelectAll` | `_buildRow` (restore selection on re-render), consumer |
| `selectedCount` | computed property over `selectedIds.size` | Footer |

### Internal cache (not part of public API)

| Field | Purpose |
|---|---|
| `_data` | Last received `data: []` payload — needed for virtual-scroll re-render and for auto-deriving filter options |
| `_lastTotal`, `_lastFiltered` | Cached so `_renderRows` and `_updateFooter` can compare without re-reading from the event |
| `_filterOptions` | `{ field: string[] }` — additive cache that grows; never shrinks on filtered payloads (see "Filter options cache" below) |
| `_virtual`, `_rowHeight`, `_vStart`, `_vEnd` | Virtual-scroll state |
| `_rafId`, `_scrollHandler` | Virtual-scroll RAF debouncing |
| `_activeDropdown` | `{ field, th, el }` — currently open filter dropdown, or `null` |
| `_focusedRowIndex` | Keyboard navigation pointer; `-1` means no row focused |
| `_selectable` | Cached `dom.hasAttribute('data-ln-data-table-selectable')` |

## Render flow

Each entry point is listed with the line range in `ln-data-table.js`
where the logic lives.

### Init (constructor, lines 24–416)

1. Read DOM references.
2. Initialize state fields (`isLoaded = false`, empty `selectedIds`, empty `_filterOptions`).
3. Compute `_filterableFields` from `<th>` markup.
4. Attach all event listeners (set-data, set-loading, sort, filter, doc click, clear-all, selection, row click, row action, search, keydown).
5. Restore initial selection from any pre-checked checkboxes inside `<tbody>` (browser form-restore case).
6. Dispatch initial `ln-data-table:request-data` to announce readiness.

The component does NOT call `_renderRows` at init. The first render
happens when the coordinator responds to the initial `request-data`
with `set-data`.

### Receiving `set-data` (lines 86–115)

1. Cache the payload — `_data`, `_lastTotal`, `_lastFiltered`.
2. Update public counters — `totalCount`, `visibleCount`, set `isLoaded = true`.
3. Refresh `_filterOptions`:
   - If `detail.filterOptions` is an object → replace cache per provided field.
   - Otherwise → additively merge unique values from `_data` into cache (the auto-derive path; see "Filter options cache" below).
4. Invalidate virtual-scroll window cache (`_vStart = -1`, `_vEnd = -1`) — required because the same viewport range may now point at different records.
5. Call `_renderRows()`.
6. Call `_updateFooter()`.
7. Dispatch `ln-data-table:rendered`.

### `_renderRows` decision tree (lines 683–711)

```
total === 0                   → empty state (`{name}-empty`)
data.length === 0 ||
filtered === 0                → empty-filtered state (`{name}-empty-filtered`)
data.length > 200             → virtual scroll (_renderVirtual)
otherwise                     → render all (_renderAll)
```

### `_renderAll` (lines 713–727)

1. Iterate `_data`, clone `{name}-row` template per record.
2. Append into a `DocumentFragment` (one reflow at end).
3. Replace `<tbody>` content atomically.
4. Refresh select-all state if selectable.

### `_renderVirtual` (lines 802–860)

Computes which slice of `_data` is currently visible:

1. Get `<table>` bounding rect, calculate `dataStartInPage` (top of `<tbody>` in absolute page coords).
2. `scrollIntoData = window.scrollY - dataStartInPage`.
3. `startRow = max(0, floor(scrollIntoData / rowHeight) - BUFFER_ROWS)`.
4. `endRow = min(startRow + ceil(window.innerHeight / rowHeight) + BUFFER_ROWS*2, total)`.
5. Early-return if `startRow`/`endRow` unchanged from last call (memoized via `_vStart` / `_vEnd`).
6. Build a fragment containing:
   - top spacer `<tr>` of height `startRow * rowHeight`
   - real rows from `startRow` to `endRow`
   - bottom spacer `<tr>` of height `(total - endRow) * rowHeight`
7. Replace `<tbody>` content.

`BUFFER_ROWS = 15` and `VIRTUAL_THRESHOLD = 200` are constants at the
top of the file. `BUFFER_ROWS` provides scroll headroom so the user
doesn't see blank space when scrolling fast (RAF lag tolerance).

### Sort click (`_handleSort`, lines 420–450)

1. Compute next direction — three-state cycle: `null → asc → desc → null`.
2. Reset all `<th>` sort classes (clears any previous active column).
3. If `newDir` is non-null → set `currentSort = { field, direction }` and add `ln-sort-asc` or `ln-sort-desc` to the clicked `<th>`.
4. Dispatch `ln-data-table:sort`.
5. Call `_requestData()` — re-fetch with new sort.

The class change on `<th>` is the only state mutation needed for the
icon swap. CSS reads the class and shows the matching
`data-ln-sort-icon` SVG. No JS touches the icons directly.

### Filter change (`_onFilterChange`, lines 595–624)

1. Read all checkboxes in the dropdown's `[data-ln-filter-options]` list.
2. Compute `checked` array and `allChecked` boolean.
3. If all checked or none checked → `delete currentFilters[field]` (no filter active).
4. Otherwise → `currentFilters[field] = checked`.
5. `_updateFilterIndicators()` — toggle `ln-filter-active` on each `<th>`'s filter button.
6. Dispatch `ln-data-table:filter`.
7. `_requestData()`.

Treating "all checked" the same as "no filter" is intentional — the
event payload `values: []` signals "clear this column's filter" rather
than "match every value individually." The coordinator never has to
enumerate the full option list.

### Selection change (`_onSelectionChange`, lines 184–209)

Per-row checkbox change:

1. Resolve the `<tr>` and `data-ln-row-id`.
2. Add or delete `id` in `selectedIds` (stored as string).
3. Toggle `ln-row-selected` class on the row.
4. Refresh select-all state via `_updateSelectAll`.
5. Update footer.
6. Dispatch `ln-data-table:select`.

`_onSelectAll` (lines 224–256) does the equivalent across all currently
visible rows. Because virtual scroll only renders visible rows,
"select-all" technically only selects what's in the DOM — the consumer
must know whether they're working with a windowed render before doing
a "delete all selected" bulk action. The exposed `selectedIds` reflects
exactly what was checked.

### Search keystroke (`_onSearchInput`, lines 324–333)

1. Update `currentSearch` from the input value.
2. Dispatch `ln-data-table:search`.
3. `_requestData()`.

There is no debounce. Adding one would be wrong at this layer: in
client-side mode the filter is in-memory and fast; in server-side mode
the coordinator can debounce its `fetch` call without blocking the
event for analytics consumers.

## Event lifecycle

```
                        ┌─────────────────────┐
                        │  Coordinator (page) │
                        └─────────────────────┘
                          ▲                ▲
              set-data    │                │   request-data
              set-loading │                │   sort, filter, search,
                          │                │   row-click, row-action,
                          │                │   select, select-all,
                          │                │   clear-filters, rendered
                          ▼                │
                        ┌─────────────────────┐
                        │   ln-data-table     │
                        │   (DOM element)     │
                        └─────────────────────┘
                          │                ▲
              keydown,    │                │   user interaction
              click,      ▼                │   (clicks, typing, keys)
              input       ┌─────────────────────┐
                          │   Browser DOM       │
                          └─────────────────────┘
```

### Inbound — events the table consumes

`ln-data-table:set-data` and `ln-data-table:set-loading` are listened
to on the table root. The component never listens at `document` —
each table only reacts to events targeting itself. This means a page
with two tables can drive each independently, even if both are
named identically (though that's discouraged).

### Outbound — events the table emits

All emitted via `dispatch(this.dom, name, detail)` from `ln-core`,
which constructs a `CustomEvent` with `bubbles: true`. None are
cancelable — the component does not offer a "cancel this sort" hook.
If you need that, intercept the user click upstream.

`request-data` is the only outbound event the coordinator MUST
handle — without a response, the table sits empty. The others are
informational and may have zero listeners.

### Cancelable events

None. The component's design is fire-and-forget — it announces
intentions, the coordinator decides how to respond. If a coordinator
wants to "block" a sort, it can ignore the next `request-data` and
respond with the previous data set, which causes the table to
re-render with the old order; the sort class on `<th>` will already
have been updated optically, so this is a discouraged pattern. Use
`set-loading` to indicate the request is in flight instead.

## Coordinator / cross-component contract

The component intentionally does not call `fetch`, does not import
`ln-store`, and does not know about modals or toasts. The expected
wiring at the project level is:

```
[data-ln-data-table]    →    request-data    →    coordinator    →    fetch / store / static
[data-ln-data-table]    ←    set-data        ←    coordinator    ←    fetch / store / static

[data-ln-data-table]    →    row-click       →    coordinator    →    open ln-modal (detail)
[data-ln-data-table]    →    row-action      →    coordinator    →    open ln-modal (edit) / dispatch delete confirm

[data-ln-data-table]    →    select          →    coordinator    →    show/hide bulk toolbar
```

The coordinator is typically a small `<script>` block per page (10-30
lines). It is the only place that knows both about the table and about
the data source. Components on the data side (`ln-store`) and on the
UI side (`ln-modal`, `ln-toast`) communicate with the coordinator via
their own events, never with the table directly.

## Performance considerations

### Virtual scroll math

Two constants govern behavior:

- `VIRTUAL_THRESHOLD = 200` — under this, `_renderAll` paints every row.
- `BUFFER_ROWS = 15` — extra rows above and below the viewport so RAF lag during fast scroll doesn't expose blank space.

Row height is **measured once** from the first rendered row
(`_rowHeight = tempRow.offsetHeight || 40`). If rows have variable
heights (multi-line cells, expandable content), virtual-scroll math
will drift — the alignment between scroll offset and visible row count
becomes incorrect. The component is designed for uniform-height rows.

### Scroll listener — passive + RAF-coalesced

`_scrollHandler` is registered with `{ passive: true }` to allow the
browser to scroll without waiting for JS. Inside, all rendering is
coalesced into a single `requestAnimationFrame` — multiple scroll
events between two RAFs result in one render. `cancelAnimationFrame`
is called on `_disableVirtualScroll` to clean up.

The `<tbody>` window-cache (`_vStart` / `_vEnd`) early-returns when
scroll position has not crossed a row boundary. This matters on
trackpad scrolling where wheel events fire at sub-row deltas — without
the cache, every event would trigger a re-render even when the visible
slice is unchanged.

### `set-data` cache invalidation

When new data arrives, `_vStart` and `_vEnd` are reset to `-1`. The
viewport may not have changed but the underlying data did, so the
cached slice is stale. Without this reset, sort and filter changes
that preserve the viewport position would early-return in
`_renderVirtual` and keep showing the previous data.

### Atomic tbody replacement

Every render builds a `DocumentFragment` first and replaces `<tbody>`
content with `tbody.textContent = ''; tbody.appendChild(frag)`. This
produces a single reflow and avoids the flicker of inserting rows one
at a time. Selection state is restored in `_buildRow` from
`selectedIds` rather than tracked through DOM mutations.

### Filter options cache

`_filterOptions` is the most subtle perf detail. The cache exists so
that filter dropdowns can show the full set of possible values even
after the user has narrowed the visible rows. Without the cache, after
filtering by `department=IT` the "status" filter dropdown would only
show statuses present in IT records — locking the user out of values
they could otherwise filter by.

Two paths populate it:

- **Authoritative** — `set-data.detail.filterOptions = { field: [values] }`. The coordinator computes once (typically from the unfiltered source) and includes on every dispatch. The component replaces the cache for those fields. This is the recommended path when the data set is small or pre-known.
- **Auto-derive** — when `filterOptions` is absent, the component additively merges unique non-null values from `_data` into the cache for each filterable column. The first unfiltered response seeds the full list; subsequent filtered responses only ADD new values, never remove existing ones. This is correct for client-side caches that always return everything but pessimistic for server-side mode where the first request might already be filtered.

The "filterable column" detection happens once at init: any `<th>` with
both `data-ln-col` and a descendant `[data-ln-col-filter]` is considered
filterable, and its field name is added to `_filterableFields`.

## Extension points

The component is extended through markup and events, never through
subclassing or callbacks.

### Templates as extension points

- `{table}-row` — controls per-row layout. Add cells, change cell elements (`<td><a>` instead of `<td>`), add badges around `[data-ln-cell]` text. The component reads `data-ln-cell` / `data-ln-cell-attr` regardless of the surrounding markup.
- `{table}-empty` and `{table}-empty-filtered` — the entire empty-state UI is yours; the component just clones the template into `<tbody>`.
- `{table}-column-filter` (or shared `column-filter`) — change the dropdown layout, add a "select all" link, replace checkboxes with toggle pills, etc. The component requires only `[data-ln-filter-options]` (the `<ul>` it populates), `[data-ln-filter-search]` (optional), `[data-ln-filter-clear]` (optional).

The lookup is scoped: `cloneTemplateScoped(this.dom, name, ...)` first
looks for a `<template data-ln-template="{name}">` inside the component
root, then falls back to a document-level template with the same name.
This lets a page have multiple tables with shared row layouts (use a
document-level template) or per-table customization (use a
component-scoped template).

### Events as extension points

The table emits enough information for any consumer to react without
needing to read its internal state:
- `row-click.detail.record` — full record object on the clicked row.
- `row-action.detail.action` + `record` — which button, on which record.
- `select.detail.selectedIds` — current selection set after change.
- `sort` / `filter` / `search` events — current intent, before
  `request-data` is dispatched, useful for analytics.

## Why not X?

### Why not built-in pagination?

Pagination is a UI affordance for "the data is too big to scroll
through." Virtual scroll solves the same problem with a 1-D mental
model — there is one list, you scroll through it. Pagination forces
the user to track "page N of M" alongside sort and filter. Server-side
pagination is also incompatible with virtual scroll's "I know all
totals" assumption — you'd need to either fetch the whole list or
introduce a "page size + scroll-to-load-more" pattern that's its own
component (a `ln-feed` or `ln-infinite-scroll`, not a `data-table`).

If a project genuinely needs paginated server output, the coordinator
can implement it — fetch page 1, dispatch `set-data` with
`total: <full count>` and `data: <first page>`, listen for scroll
position to fetch the next page. The component does not need to know.

### Why not built-in fetch?

Configuration explosion. A built-in fetch would need to know about
URLs, request methods, query-param shape, response shape, error
handling, retry, abort, auth headers, CSRF tokens. Each project has
opinions; the coordinator owns those opinions. The component contract
stays at "I announce, you respond."

### Why coordinator events instead of direct method calls?

Direct calls (`tableEl.lnDataTable.setData([...])`) would couple the
caller to the component's identity and import path. With events, any
script that has a reference to the table element (or listens at
`document`) can drive it. Multiple coordinators can listen to the
same `request-data` (e.g., a primary fetcher + an analytics logger)
without knowing about each other. This is the same coordinator
pattern documented in [`docs/js/core.md`](core.md).

### Why `<template>` clone instead of `innerHTML`?

`innerHTML` is unsafe with untrusted data, parses as HTML so a
record value containing `<script>` becomes executable, requires
re-parsing on every render, and forces the row layout into a JS
string. `<template>` is parsed once when the page loads, the
content is `cloneNode`'d cheaply, and `data-ln-cell` uses
`textContent` which is XSS-safe by construction.

### Why no row-level dirty tracking / virtual DOM?

The component's renders are atomic — `<tbody>` is replaced wholesale
on every `set-data`. A virtual-DOM diff would help only if rows
mutated frequently while their neighbors did not, which is not the
expected pattern: data tables receive bulk updates (a fresh page,
a fresh search result), not per-cell streams. Atomic replacement
also keeps selection restoration simple — `_buildRow` consults
`selectedIds` and re-applies `ln-row-selected` to rows whose IDs
match.

### Why classes for sort state instead of attributes on the icons?

Two reasons. First, the active state is a property of the column
(the `<th>`), not of any single icon — the icon visibility derives
from the column state. Second, swapping classes is the fastest
DOM operation and keeps CSS as the single owner of which icon
shows. If the active state were an attribute on the icons, JS
would have to set it on three siblings on every sort cycle and
reset all other columns' icons too — more code, more chances to
desync.
