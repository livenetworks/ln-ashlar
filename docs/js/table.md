# Table

> Architecture mirror for `js/ln-table/ln-table.js`. Companion to the
> consumer-facing README at `js/ln-table/README.md`. This file
> documents internal state, render pipeline, and design decisions for
> library maintainers.

## Imports

```js
import { dispatch, registerComponent } from '../ln-core';
```

Two helpers from `ln-core`:

- `dispatch(el, name, detail)` — bubbling, non-cancelable
  CustomEvent. Used for the four emitted events.
- `registerComponent(selector, attribute, ComponentFn, componentTag)`
  — global init plumbing. Sets up the document-body MutationObserver
  with `attributeFilter: ['data-ln-table']`, attaches the constructor
  to `window.lnTable`, and runs `findElements` on init.

No `dispatchCancelable` — none of the four emitted events are
cancelable. The component's "before" gate is the implicit one:
`_applyFilterAndSort()` runs synchronously inside the handler before
the dispatch, so consumers cannot intercept between filter and render.

No `cloneTemplate` — empty-state cloning uses `document.importNode`
on a directly-located `<template data-ln-table-empty>` (selected via
`this.dom.querySelector` so each table can carry its own empty
template). The `cloneTemplate` helper looks up by `data-ln-template`
name with a global cache; ln-table predates that pattern.

## Instance state

Every property on `this`, with intent:

| Property | Type | Initial | Purpose |
|---|---|---|---|
| `dom` | HTMLElement | — | The `[data-ln-table]` wrapper. |
| `table` | HTMLTableElement \| null | — | Cached `dom.querySelector('table')`. Rendering operates on `tbody`, but `_lockColumnWidths` reads + injects on `table`. |
| `tbody` | HTMLTableSectionElement \| null | — | Render target. `null` triggers a no-op in `_render()`. |
| `thead` | HTMLTableSectionElement \| null | — | Used to compute virtual-scroll offsets (`theadH = thead.offsetHeight`). |
| `ths` | HTMLTableCellElement[] | from `thead` | Sort-type lookup, filter-column-key lookup, colspan source. |
| `_data` | Array<RowEntry> | `[]` | Parsed row cache. Each entry: `{ html, sortKeys, rawTexts, searchText }`. |
| `_filteredData` | Array<RowEntry> | `[]` | Current filtered + sorted view. Re-derived on every event. |
| `_searchTerm` | string | `''` | Lowercased search query. |
| `_sortCol` | number | `-1` | Index in `ths`. `-1` means no sort. |
| `_sortDir` | `'asc' \| 'desc' \| null` | `null` | Sort direction. |
| `_sortType` | `'string' \| 'number' \| 'date' \| null` | `null` | Cached from the last `ln-table:sort` event. |
| `_columnFilters` | `{ [key: string]: string[] }` | `{}` | Active per-column filters; values are lowercased. |
| `_virtual` | boolean | `false` | Whether virtual-scroll mode is active. |
| `_rowHeight` | number | `0` | Measured from row 0 at parse time. Falls back to `40` if `offsetHeight === 0`. |
| `_vStart` | number | `-1` | First row in current virtual window. `-1` forces recalc. |
| `_vEnd` | number | `-1` | Last row in current virtual window (exclusive). |
| `_rafId` | number \| null | `null` | `requestAnimationFrame` id used to coalesce scroll/resize fires. |
| `_scrollHandler` | Function \| null | `null` | The single scroll/resize listener; stored for `removeEventListener` on destroy. |
| `_colgroup` | HTMLElement \| null | `null` | Reference to the injected `<colgroup>`. Removed on destroy. |
| `_emptyTbodyObserver` | MutationObserver \| null | `null` | **NEW (post-fix)** — watches the empty tbody for the first row insertion. Stored so `destroy()` can disconnect. |
| `_onSearch` | Function | bound | `ln-search:change` handler. Stored as instance property for symmetric `removeEventListener`. |
| `_onSort` | Function | bound | `ln-table:sort` handler. |
| `_onColumnFilter` | Function | bound | `ln-filter:changed` handler. |
| `_onClear` | Function | bound | Document-delegated click handler for `[data-ln-table-clear]`. |

The four `_on*` handlers are bound as closures over `self = this` to
avoid `.bind(this)` allocation on every render. They are stored on
the instance specifically for `removeEventListener` symmetry — every
listener attached in the constructor is detached in `destroy()`.

## Init topology

Single-call init via `ln-core`'s `registerComponent`:

```
registerComponent('data-ln-table', 'lnTable', _component, 'ln-table')
    → guardBody — ensures document.body exists
    → MutationObserver on document.body
        watches:
            childList: subtree              (new wrappers inserted)
            attributes: [data-ln-table]     (attribute set on existing element)
    → window.lnTable = constructor
    → DOMContentLoaded → constructor(document.body)
```

Per-instance constructor flow:

```
new _component(dom):
    1. cache dom, table, tbody, thead, ths
    2. zero state (_data, _filteredData, _searchTerm, _sortCol, _columnFilters)
    3. zero virtual state (_virtual=false, _rowHeight=0, _vStart=_vEnd=-1)
    4. measure toolbar height → CSS var --ln-table-toolbar-h
    5. branch on tbody state:
        if rows.length > 0  → _parseRows() now (synchronous)
        else                → start MutationObserver on tbody;
                              when rows arrive, disconnect + parse
    6. attach _onSearch, _onSort, _onColumnFilter listeners on dom
    7. attach _onClear (delegated click) on dom
```

`_parseRows` is the only path that populates `_data`. It runs once
per instance lifetime — there is no "re-parse on tbody mutation"
beyond the initial empty-tbody wait. After parse, the tbody becomes
output-only.

## Method flows

### `_parseRows()`

```
_parseRows:
    1. read sortType per column from th[data-ln-sort]
    2. _rowHeight = rows[0].offsetHeight || 40
    3. _lockColumnWidths()
    4. for each row:
        - per cell: textContent, raw (data-ln-value || textContent),
                    type (from sortTypes[j])
        - sortKeys[j] = parseFloat(raw)||0  (number/date)
                      | String(raw)         (string)
                      | null                (no type)
        - rawTexts[j] = textContent.toLowerCase()
        - searchParts.push(textContent.lowercase) IF j < cells.length-1
        - push { sortKeys, rawTexts, html: tr.outerHTML, searchText }
    5. _filteredData = _data.slice()
    6. _render()
    7. dispatch('ln-table:ready', { total })
```

Last column exclusion (step 4, `j < cells.length - 1`) is the actions
column convention. Search index built BEFORE virtual-scroll math —
`_render()` reads `_data.length` to decide between virtual and
all-rows path.

### `_applyFilterAndSort()`

```
_applyFilterAndSort:
    1. resolve hasColFilters, build colIndexByKey: { key → idx }
    2. if !term && !hasColFilters:
           _filteredData = _data.slice()
       else:
           filter _data → _filteredData via:
               (a) row.searchText includes term
               (b) for each colFilter: row.rawTexts[idx] in values
    3. early-return if _sortCol < 0 || !_sortDir
    4. sort _filteredData in-place:
           numeric/date: (a.sortKeys[col] - b.sortKeys[col]) * mult
           string:       _collator.compare(a.sortKeys[col], b.sortKeys[col]) * mult
```

`_collator` is a module-level singleton initialized once at script
load with `document.documentElement.lang || undefined`. Same
collator across all table instances on the page.

### `_render()`

```
_render:
    if !tbody                              → return
    count = _filteredData.length
    if count === 0 && (term || colFilters) → _disableVirtualScroll() + _showEmptyState()
    elif count > 200                       → _enableVirtualScroll() + _renderVirtual()
    else                                   → _disableVirtualScroll() + _renderAll()
```

Three branches, mutually exclusive. Mode transitions
(virtual→all, all→virtual, anything→empty) are handled by the
adjacent `_enableVirtualScroll` / `_disableVirtualScroll` calls.
`_disableVirtualScroll()` is idempotent (the `if (!this._virtual)
return` guard at the top), so repeatedly calling it on every
non-virtual render is safe.

### `_renderAll()` and `_renderVirtual()`

```
_renderAll:
    join _filteredData[].html → tbody.innerHTML

_renderVirtual:
    1. compute scroll offset:
           tableTopInPage = table.getBoundingClientRect().top + scrollY
           dataStartInPage = tableTopInPage + thead.offsetHeight
           scrollIntoData = scrollY - dataStartInPage
    2. compute window:
           startRow = max(0, floor(scrollIntoData / rowH) - BUFFER)
           endRow   = min(startRow + ceil(innerHeight / rowH) + BUFFER*2, total)
    3. skip if (startRow, endRow) === (_vStart, _vEnd)
    4. emit:
           top spacer    (if startRow > 0)
           rows[start..end]  joined
           bottom spacer (if endRow < total)
       tbody.innerHTML = html
```

Spacer rows are `<tr class="ln-table__spacer" aria-hidden="true">`
with inline `height: Npx; padding: 0; border: none`. The inline
styles bypass any project SCSS that might re-pad table rows. Spacer
rows have a single `<td colspan="N">`.

## Lifecycle

```
init                    → constructor → wait-or-parse
attribute change        → registerComponent's observer re-runs constructor
                          (no-op if already initialized — findElements guards by attribute presence)
event (search/sort/filter/clear)
                        → handler → _applyFilterAndSort → _render → dispatch
destroy()               → _disableVirtualScroll
                        → remove the four event listeners
                        → disconnect _emptyTbodyObserver if present
                        → remove colgroup, reset table-layout
                        → clear _data, _filteredData
                        → delete dom[DOM_ATTRIBUTE]
```

There is no auto-destroy on element removal. The global
MutationObserver from `registerComponent` does NOT detect node
removal; it only watches `addedNodes` and the `attributeFilter`.
Manually call `destroy()` before removing a table from the DOM if
you care about listener cleanup. In practice, page navigation makes
this irrelevant.

## Why this, not that

### Why parse to `outerHTML` strings, not to records?

The component is opinionated about its scope: it does not own row
markup. The server already produced it; the JS layer adds in-place
sort/filter/virtual-scroll. Storing `outerHTML` strings means render
is a single `innerHTML` write — no `createElement` chains, no
template clones, no per-cell formatting calls. Sort and filter only
need the canonical sort keys and lowercased text; both are computed
once at parse and cached on the entry.

Cost: cell content is frozen. If you need live cells, use
`ln-data-table`.

### Why no Proxy / no batcher?

State is flat and updates are coarse — one event handler runs the
full pipeline. There is no scenario where two state changes batch
into one render: each event handler is the unit of work. Adding a
batcher would only delay events past the user-perceptible threshold
(every render is microtask-or-later) for no benefit.

`ln-data-table` does the same — its render is also synchronous per
event, no batcher. Both predate the `createBatcher` helper that
later components use; both have no reason to migrate.

### Why window-level scroll listener, not container-scoped?

Tables are typically the dominant content of a page; the page
scrolls. Window scroll covers the common case. A container-scoped
listener would require resolving the scroll parent (which is
not always obvious — `overflow: auto` ancestors, sticky parents,
contained-block stacking), and would still need a window-scroll
fallback for tables in normal flow.

The trade-off: tables inside scroll containers do not virtual-scroll
correctly. This is documented under "What it does NOT do" in the
README. In practice, server-rendered listings live on standalone
admin pages, not inside modal bodies. If you need a virtual table
inside an overflow container, this is the wrong component.

### Why is the last column excluded from search?

Convention: the last column is "Actions" (Edit / Delete / View
buttons). Including button text in search would mean every row
matches "Edit". The convention is baked in; there is no
`data-ln-no-search` opt-out per cell. Tables without an actions
column either accept the limitation, add a trailing empty
presentational column, or use `ln-data-table` (which has no
last-column convention — search is per-cell-explicit via
`data-ln-cell` attributes).

### Why is `data-ln-value` honored for sort but not for filter/search?

Sort needs a canonical comparable value (timestamps for dates,
numbers for currency strings). Filter and search work on what the
user reads — typing "Nov" should match `"15.11.2023"` if the cell
displays in DD.MM.YYYY format, not the underlying timestamp.

This split is also implicit in the `_parseRows` pipeline: `sortKeys`
reads `data-ln-value`, `rawTexts` and `searchText` read
`textContent` only.

### Why three independent components instead of one mega-table?

`ln-search`, `ln-table-sort`, `ln-filter`, and `ln-table` evolved as
independent units that compose via CustomEvents. Each can be
replaced (custom search bar, custom sort UI, custom filter dropdown)
by anything that dispatches the same event shape. The cost is wiring
overhead in HTML — every consumer page repeats the toolbar markup.
The benefit is that each unit is small, testable, and evolves
independently. (`ln-data-table` chose the opposite trade-off: one
big component that owns its toolbar.)

## Where this could change

Forward-looking notes for future maintainers — these are NOT bugs,
but areas where the design has known limitations that may be revisited.

- **`aria-sort`** — currently not set by `ln-table-sort`. Adding it
  is non-controversial; the only reason it is missing is that the
  companion was written before the team standardized on full ARIA
  coverage. A 3-line patch in `ln-table-sort.js` (`th.setAttribute(
  'aria-sort', dir === 'asc' ? 'ascending' : 'descending')`) closes
  the gap. Tracked separately from the ln-table audit.

- **Empty-tbody MutationObserver leak** — fixed in the current pass
  (Phase 4 below). The observer reference is now stored as
  `_emptyTbodyObserver` and disconnected in `destroy()`.

- **Container-scoped virtual scroll** — would require resolving the
  scroll parent at init, attaching scroll listeners to that parent
  instead of `window`, and recomputing scroll offsets relative to
  that parent's scroll position. Doable but adds ~50 lines and
  edge cases (resize observer for parent dimension changes,
  fallback chain when the parent has its own
  `overflow-anchor: none`, etc.). Not on the roadmap; consumers
  with this need use `ln-data-table` or render fewer rows.

- **`data-ln-value` honored by filter** — would let date columns be
  filtered by raw timestamp values. This is more invasive than it
  looks: ln-filter populates its checkbox list from the data, so
  the filter options would need to be the formatted display string
  but the comparison would need to be against the raw value. The
  cleanest path is "use ln-data-table". Not on the roadmap for
  ln-table.

- **Coordinator/component split** — the current model has events
  flowing INTO the table (`ln-search:change`, `ln-filter:changed`)
  but no "request" events flowing out beyond the four notifications.
  The pattern in newer components is "request events for mutations,
  notification events for state changes" — ln-table's API is read-
  only because there are no mutation paths to expose. If the
  component ever grows a "set rows from JS" path (effectively
  becoming a half-ln-data-table), that path SHOULD use a
  `ln-table:request-set-data` request event, not a direct method
  call. Not on the roadmap.

## See also

- [`../../js/ln-table/README.md`](../../js/ln-table/README.md) — consumer doc.
- [`./table-sort.md`](./table-sort.md) — companion architecture mirror.
- [`./data-table.md`](./data-table.md) — the event-driven sibling.
- [`./search.md`](./search.md) — the search input that fires `ln-search:change`.
- [`./filter.md`](./filter.md) — per-column filter dropdown.
- [`./core.md`](./core.md) — `dispatch`, `registerComponent`, helper layer.
