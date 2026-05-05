# ln-table

> Drop-in component for **server-rendered HTML tables** that need
> client-side search, sort, per-column filter, and virtual scroll
> without a JS data source. Parses the existing `<tbody>` once, holds
> the rows as outerHTML strings, and re-renders by `innerHTML`
> assignment. ~458 lines of JS. The legacy sibling of `ln-data-table`.

## Philosophy

### `ln-table` ≠ `ln-data-table` — pick the right one

`ln-table` and `ln-data-table` look superficially similar — both render
sortable, filterable rows with virtual scroll above 200 records. They
are NOT interchangeable. The contract is fundamentally different:

- **`ln-table`** parses an existing populated `<tbody>` rendered by the
  server. Rows arrive as HTML; the component reads them once into an
  in-memory array of `{ html, sortKeys, rawTexts, searchText }`
  records and re-renders by `innerHTML` assignment of the cached
  HTML strings. There is no data source, no template, no fetch loop.
  Sort and filter work on the parsed strings.
- **`ln-data-table`** is the inverse: it owns an empty `<tbody>` and
  a `<template>` for row markup. Data arrives via the
  `ln-data-table:set-data` event from a coordinator. The component
  clones the template per record, fills cells via
  `data-ln-cell="field"`, and renders. There is no parsing — the data
  source is whoever dispatches `set-data`.

**Use `ln-table` when:** the page is a Laravel/Rails-style
server-rendered listing where the rows already exist as `<tr>` markup
in the response body, and you want to add client-side sort/filter/
virtual scroll without rewriting the data path. The HTML is the source
of truth; JS is a thin layer on top.

**Use `ln-data-table` when:** the data lives in a JS source — an
`ln-store` IndexedDB cache, a `fetch()` to a REST endpoint, a static
JS array, or a cross-frame message bus. You want one row template
defined once in HTML, and the component fills it per record.

If you are not sure, check what your `<tbody>` looks like in the HTTP
response. If it has `<tr>` rows already populated with cell data, you
want `ln-table`. If it is empty (or absent), you want `ln-data-table`.

### Server-rendered means cached as outerHTML strings

Each row is captured as `tr.outerHTML` at parse time and stored
verbatim in `_data[i].html`. Subsequent sort/filter/render operations
work on the array; `_render()` joins selected entries into a single
HTML string and writes it via `this.tbody.innerHTML = html.join('')`.

This gives you three useful properties:

1. **Zero rebuild cost.** The markup was already constructed
   server-side. Switching from "all rows" to a filtered subset is a
   substring lookup + array filter + one `innerHTML` write.
2. **Virtual scroll works without per-cell formatting logic.** The
   component does not know what your cells look like — they were
   already rendered. It just chooses which `outerHTML` strings to
   write into the tbody.
3. **Cell content is frozen at parse time.** Mutating a cell's text
   AFTER `_parseRows()` runs will NOT survive the next render — the
   cached `outerHTML` overwrites the live DOM. If your cells need to
   change after init, you are using the wrong component (use
   `ln-data-table` or do not use a virtual-scroll table at all).

### Search and filter compare display text, not raw values

`row.searchText` is built from `td.textContent.trim().toLowerCase()`
joined with spaces — covering all cells **except the last** (the
actions column convention; see "Last-column rule" below). Column
filters compare `row.rawTexts[colIndex]` (also `textContent`-derived,
lowercased) against the lowercased values supplied by `ln-filter`.

`data-ln-value` on a `<td>` is read by `_parseRows()` ONLY for sort
keys — it overrides what the sort comparator sees, but it does NOT
override what search and column filters see. If you set
`<td data-ln-value="1700000000">15.11.2023</td>`, sort uses the
timestamp; search and column filters still see the string
`"15.11.2023"`.

This is a deliberate split: sort needs a canonical value (a timestamp
sorts correctly; "15.11.2023" sorts as a string). Search and filter
work on what the user reads on screen — the user typing "Nov" expects
to find rows whose date text contains `"Nov"`, not rows whose
timestamp falls in November.

### Last-column rule — the actions column is invisible to search

`searchText` is built from `cells[0..n-2]` only (line 227,
`j < tr.cells.length - 1`). The last cell is excluded.

This is a convention baked into the component: the last column is
assumed to be an "Actions" column with `<button>`s like Edit / Delete,
which would otherwise pollute search ("Edit" matching every row).

**If your table does NOT have a trailing actions column, the last
real-data column will not be searchable.** The fix is to add a
trailing presentational column (even an empty `<td></td>`) so the
real data column is `n-2` rather than `n-1`. The contract is
non-negotiable — there is no opt-out attribute. This is the cost of
the simplification.

### Virtual scroll is window-scoped, not container-scoped

When `_filteredData.length > 200` the component switches to virtual
mode, attaching `scroll` and `resize` listeners on `window` (not on
the table or its container). Position math reads `window.scrollY`,
`window.innerHeight`, and `table.getBoundingClientRect()`. This works
when the table is in normal page flow.

It does **not** work when the table sits inside a scrollable
container (e.g. a modal body with `overflow: auto`). Scrolling that
container does not fire `window` scroll events; the visible row range
will not update until the user scrolls the page itself or the
container resizes. If you need a virtual-scroll table inside a
scrollable container, use `ln-data-table` (which has the same
window-scoped limitation but is more commonly composed in
non-overflowing layouts) or render fewer rows.

### Synchronous pipeline — no batcher, no microtask

Each event handler runs the full pipeline in one tick: update state →
`_applyFilterAndSort()` → reset virtual range → `_render()` →
`dispatch()`. There is no Proxy, no `createBatcher`, no debounce.
This works because:

- Sort + filter on a few thousand pre-parsed entries is a few
  milliseconds; running it per keystroke is fine.
- The render path is one `innerHTML` assignment for the all-rows
  case, or three `innerHTML` chunks (top spacer + window + bottom
  spacer) for the virtual case.
- `ln-search:change` already debounces upstream (see ln-search
  source) — it does not fire per character.

If you find yourself needing to debounce at this layer, you are
either past the threshold the component was built for or you should
move to `ln-data-table` with a server-paginated coordinator.

### Three independent concerns, three event boundaries

`ln-table` does not own search input, sort headers, or filter
dropdowns. Three sibling components do:

- **`ln-search`** captures keystrokes on its `<input>`, dispatches
  `ln-search:change` on the table wrapper. `ln-table` calls
  `e.preventDefault()` to tell ln-search "I'll handle filtering, you
  skip your default DOM hide".
- **`ln-table-sort`** (companion in the same folder) attaches click
  listeners to `th[data-ln-sort]`, manages the asc/desc/null cycle,
  dispatches `ln-table:sort` on the table wrapper. Toggles
  `data-ln-sort-active` on the active `<th>`.
- **`ln-filter`** (per-column dropdown) dispatches `ln-filter:changed`
  on the table wrapper when checkboxes change. ln-table maps the
  `key` to a column via `th[data-ln-filter-col="key"]`.

Each boundary is just a CustomEvent. Replace any of them with a
custom widget that dispatches the same event and ln-table will not
notice.

## HTML contract

Minimal — sortable, searchable, with column filter and an empty state:

```html
<div id="employees" data-ln-table>
	<header class="ln-table__toolbar">
		<h3>Employees</h3>
		<aside>
			<label>
				<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
				<input type="search" placeholder="Search..." data-ln-search="employees">
			</label>
			<button data-ln-table-clear>Clear</button>
		</aside>
	</header>

	<table>
		<thead>
			<tr>
				<th data-ln-sort="number">
					#
					<svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
					<svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
					<svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
				</th>
				<th data-ln-sort="string">Name
					<svg class="ln-icon" data-ln-sort-icon aria-hidden="true"><use href="#ln-arrows-sort"></use></svg>
					<svg class="ln-icon hidden" data-ln-sort-icon="asc" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
					<svg class="ln-icon hidden" data-ln-sort-icon="desc" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
				</th>
				<th data-ln-sort="string" data-ln-filter-col="dept">Department</th>
				<th data-ln-sort="date">Joined</th>
				<th>Actions</th>
			</tr>
		</thead>
		<tbody>
			<tr>
				<td>1</td>
				<td>John Smith</td>
				<td>Engineering</td>
				<td data-ln-value="1700000000">15.11.2023</td>
				<td><button>Edit</button></td>
			</tr>
			<!-- more server-rendered rows... -->
		</tbody>
	</table>

	<template data-ln-table-empty>
		<article class="ln-table__empty-state">
			<h3>No results</h3>
			<button type="button" data-ln-table-clear>Clear</button>
		</article>
	</template>
</div>
```

The wrapper element MUST have `id` if `ln-search` is wired to the
table — `data-ln-search="<id>"` resolves the target by `getElementById`.
The `id` also feeds the `data-ln-table-clear` resolver path.

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-table` | wrapper | Component root. Initializes the instance, parses rows on load. |
| `data-ln-persist` | wrapper | Persist active sort column + direction across page loads. Storage key = wrapper `id` (or attribute value). Read by the companion `ln-table-sort`, not by `ln-table` itself. |
| `data-ln-sort="number\|string\|date"` | `<th>` | Marks column sortable. Value picks comparison: `number`/`date` use numeric `parseFloat`, `string` uses `Intl.Collator`. Read by `ln-table-sort`; `ln-table` only consumes the dispatched `sortType`. |
| `data-ln-sort-active="asc\|desc"` | `<th>` | **Set by JS** (companion `ln-table-sort`). Do not set manually. |
| `data-ln-filter-col="key"` | `<th>` | Maps a column to a filter key. When `ln-filter:changed` arrives with that key, the column's `rawTexts` value is matched against the supplied values. |
| `data-ln-filter-active` | `<th>` | **Set by JS** (`ln-table` itself). Present when the column has a non-empty filter. CSS uses this to highlight the filter trigger. |
| `data-ln-value="raw"` | `<td>` | Raw value used **for sort only**. Falls back to `td.textContent` when absent. Filters and search ignore this attribute. |
| `data-ln-table-empty` | `<template>` | Markup cloned into a full-width `<td>` when filter/search produces zero results. |
| `data-ln-table-clear` | `<button>` | Click resets search term and column filters, then dispatches a synthetic `change` event on each connected filter's `[data-ln-filter-reset]` checkbox to clear filter UI, then re-renders. Resolves the search input via `[data-ln-search="<wrapper-id>"]`. |

## Events

### Emitted

| Event | Bubbles | Cancelable | `detail` | When |
|---|---|---|---|---|
| `ln-table:ready` | yes | no | `{ total }` | After initial `_parseRows()` completes. |
| `ln-table:filter` | yes | no | `{ term, matched, total }` | After search, after column filter changes, after clear. |
| `ln-table:sorted` | yes | no | `{ column, direction, matched, total }` | After sort applied (in response to `ln-table:sort`). |
| `ln-table:empty` | yes | no | `{ term, total }` | When filter/search produces zero rows. Fires in addition to `ln-table:filter`. |

### Received

| Event | From | `detail` | Effect |
|---|---|---|---|
| `ln-search:change` | `ln-search` (sibling input) | `{ term }` | Updates `_searchTerm`, re-runs filter+sort+render. Calls `e.preventDefault()` so ln-search skips its default DOM hide pass. |
| `ln-table:sort` | `ln-table-sort` (companion in same folder) | `{ column, sortType, direction }` | Updates sort state, re-runs filter+sort+render, dispatches `ln-table:sorted`. |
| `ln-filter:changed` | `ln-filter` (per-column dropdown) | `{ key, values }` | Maps `key` to column via `data-ln-filter-col`, updates `_columnFilters[key]`, re-runs. Toggles `data-ln-filter-active` on matching `<th>`. |
| `click` (root delegated) | UI buttons | — | Resolved against `[data-ln-table-clear]` via `closest`; if matched, runs the clear pipeline. |

## JS API

```js
const el = document.querySelector('[data-ln-table]');

// Read state — fine
el.lnTable._data;          // full parsed array (read-only convention)
el.lnTable._filteredData;  // current visible array
el.lnTable._sortCol;       // -1 if no sort
el.lnTable._searchTerm;    // current search term

// Mutate — go through events, not direct calls
// (No public method API — sort/filter/search are coordinator-driven via events.)

// Cleanup
el.lnTable.destroy();
```

There is no `fill()`, `submit()`, or `reset()` API on the instance.
The component is event-driven on the receive side and does not expose
mutation methods. Reading `_data`, `_filteredData`, etc. for
inspection is fine; mutating them directly bypasses
`_applyFilterAndSort()` and the next render will NOT reflect your
changes.

## What it does NOT do

- **Does NOT fetch data.** Rows must be in `<tbody>` at init (or
  arrive via `innerHTML` while the empty-tbody MutationObserver is
  watching).
- **Does NOT respect `data-ln-value` for search or column filters.**
  Only sort comparators read it. Search and column filters compare
  the lowercased `td.textContent`. If you want to filter a date
  column by timestamp range, use `ln-data-table` (which can compute
  filter sets in the coordinator) — or pre-format your dates in a
  way that sorts and filters lexicographically.
- **Does NOT include the last column in the search index.** Last cell
  is assumed to be an actions column. If your table has no actions
  column, the last data column will not match search queries. Add a
  trailing empty `<td></td>` or accept the limitation.
- **Does NOT virtual-scroll inside a scrollable container.** Listens
  on `window`, not on the table's overflow parent. Tables inside
  modal bodies with `overflow: auto`, sticky panels, or other
  scroll containers will not update the visible row window when
  the container scrolls.
- **Does NOT mutate cell content after parse.** Cached `outerHTML`
  strings are written back on every render. Live DOM edits to a
  rendered row are erased on the next sort/filter/clear.
- **Does NOT set `aria-sort` on the active `<th>`.** The companion
  `ln-table-sort` sets `data-ln-sort-active="asc|desc"` for CSS, but
  does not set the ARIA attribute. Screen-reader announcement of the
  sorted column is the consumer's responsibility — add an
  `aria-sort` attribute manually in your sort listener if needed.
  (This may be promoted into the companion in a future pass; see
  `docs/js/table-sort.md`.)
- **Does NOT debounce.** Each `ln-search:change` triggers an
  immediate filter+sort+render pass. ln-search debounces upstream;
  this layer expects throttled traffic already.
- **Does NOT auto-destroy on element removal.** The MutationObserver
  on `document.body` re-initializes new instances but does not tear
  down removed ones. Call `lnTable.destroy()` manually before
  removing the wrapper if you care about cleanup (see "Edge cases").
- **Does NOT manage row keyboard focus or selection.** Use
  `ln-data-table` for built-in selection + keyboard navigation, or
  layer `ln-link` on top of `ln-table` for clickable rows.

## Cross-component composition

### With `ln-search`

The standard pairing. ln-search dispatches `ln-search:change` on the
target element resolved via `getElementById(targetId)`. ln-table
catches it, calls `e.preventDefault()` (which tells ln-search to
skip its built-in DOM walk + hide pass), and runs its own in-memory
filter.

```html
<div id="users" data-ln-table>
	<header class="ln-table__toolbar">
		<input type="search" data-ln-search="users" placeholder="Search...">
	</header>
	<table>...</table>
</div>
```

The `data-ln-search` value MUST match the table wrapper's `id`. Both
wiring directions (input directly carrying `data-ln-search`, or a
wrapping `<label>` with the attribute on the wrapper) are supported
by ln-search; either works.

### With `ln-table-sort` (companion)

Always present together — the file `js/ln-table/ln-table-sort.js`
ships in the same folder as `js/ln-table/ln-table.js` and
auto-initializes on any `<table>` with `th[data-ln-sort]`. No
explicit wiring. The two communicate exclusively via the
`ln-table:sort` event and `data-ln-sort-active` attribute. Either can
be used standalone:

- `ln-table-sort` without `ln-table`: useful if you want native
  sorting via your own listener (`document.addEventListener('ln-table:sort', ...)`)
  but do not want client-side filter/virtual-scroll.
- `ln-table` without `ln-table-sort`: rarer — the table will not
  respond to header clicks, only to programmatically dispatched
  `ln-table:sort` events.

### With `ln-filter` (per-column dropdown)

Per-column filters are typically rendered via `ln-popover` triggered
from a button inside the `<th>`. The popover content is an
`ln-filter` component. When checkboxes change, ln-filter dispatches
`ln-filter:changed` on the target (the table wrapper). ln-table maps
the key to a column index via `th[data-ln-filter-col="key"]` and
filters accordingly. The `<th>` gets `data-ln-filter-active` for CSS.

```html
<th data-ln-sort="string" data-ln-filter-col="dept">
	Department
	<button class="filter" type="button" data-ln-popover-for="filter-dept" aria-label="Filter">
		<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-filter"></use></svg>
	</button>
</th>

<!-- ln-filter elsewhere on the page -->
<div data-ln-popover id="filter-dept">
	<div data-ln-filter="users">
		<!-- ln-filter populates checkboxes; see ln-filter README -->
	</div>
</div>
```

`data-ln-filter` on the filter component must equal the table
wrapper's `id`. If the filter `key` does not match any
`data-ln-filter-col` on the table's `<th>` elements, ln-table returns
early and lets ln-filter's default behavior (DOM-attribute hide pass)
take over — useful if you have non-table consumers of the same filter.

### With `ln-link` (clickable rows)

Compose by adding `data-ln-link` on the same `<table>` element. ln-link
operates on each `<tr>` independently; ln-table re-renders rows by
`innerHTML` overwrite. Because `innerHTML` replaces the `<tr>`
elements, ln-link's per-row listeners are LOST after each
filter/sort/render cycle.

ln-link's MutationObserver handles this: when a new `<tr>` is added
under the watched container, it calls `_initRow` automatically. The
combination works in practice — but performance is sensitive on
large tables (every render re-wires every visible row). Above ~5000
filtered rows the re-init cost can be visible.

If this is a problem, use event delegation for row clicks instead of
ln-link:

```js
table.addEventListener('click', function (e) {
	const tr = e.target.closest('tr');
	if (!tr || tr.classList.contains('ln-table__spacer')) return;
	const link = tr.querySelector('a');
	if (link) link.click();
});
```

### With `ln-data-table` — they don't compose, they replace each other

Do not put `data-ln-table` and `data-ln-data-table` on the same
element or nested inside each other. They have different render
contracts (one parses, one renders from template) and overlapping
event names (`ln-table:sort` vs `ln-data-table:sort`). Pick one for
the table; if you need both shapes on the same page, they are
separate tables with separate roots.

## Common mistakes

1. **Mutating cell text after init and expecting it to survive a
   re-render.** Cached `outerHTML` is rewritten on every render. If
   you need to update a cell's content, you are using the wrong
   component — use `ln-data-table` and dispatch fresh `set-data` with
   the updated record.

2. **Forgetting the trailing actions-column convention.** A 3-column
   table with `<th>Name</th><th>Email</th><th>Phone</th>` makes the
   Phone column unsearchable. Add a trailing `<th></th>` + `<td></td>`
   or restructure the table.

3. **Using `data-ln-value` for filter columns and expecting the
   filter to compare timestamps.** It will compare the formatted
   display text. The `<th data-ln-filter-col="joined">` filter on a
   date column shows `["15.11.2023", "16.11.2023", ...]` as filter
   options, not timestamp ranges. Filter ranges are out of scope of
   this component; consider `ln-data-table` with a coordinator that
   computes range buckets.

4. **Wiring search without giving the wrapper an `id`.** ln-search
   resolves the target by `getElementById(targetId)`. No id → no
   target → `ln-search:change` is dispatched but never reaches the
   table. The clear button also relies on `dom.id` to find the input.
   Always set an `id` on the `[data-ln-table]` wrapper when search is
   present.

5. **Placing `[data-ln-table]` inside a scroll container and
   expecting virtual scroll to work.** The component listens on
   `window.scrollY`. Container-scoped scroll fires no window event;
   the visible row window will not update.

6. **Calling `el.lnTable._applyFilterAndSort()` after directly
   mutating `_data`.** The `_data` array IS the source of truth, but
   adding/removing entries directly skips the `_render()` step that
   normally follows an event handler. After mutation you also need
   to call `el.lnTable._render()`. In practice, this is the wrong
   API — there is no supported "add a row" path. Use `ln-data-table`
   if you need that.

7. **Stacking column filter values that the data does not produce.**
   ln-filter populates its checkbox list from the data; if the user
   selects every option, the filter passes everything (effectively
   off). If you set `_columnFilters[key]` to a value that no row's
   `rawTexts[idx]` matches, you'll see the empty-state template —
   correct, but easy to misdiagnose as a bug.

8. **Calling `destroy()` and then re-using the same DOM element
   without re-init.** `destroy()` deletes `dom[DOM_ATTRIBUTE]`,
   removes listeners, drops the colgroup. The MutationObserver on
   `document.body` re-initializes the wrapper if its attribute is
   re-set or it is re-inserted into the DOM. To re-init in place
   without removing/re-adding the element, set `data-ln-table` again
   (any value).

9. **Expecting `aria-sort` to be set automatically.** It is not. The
   companion ln-table-sort sets `data-ln-sort-active` for CSS only.
   For assistive-tech announcement, add an `aria-sort` listener:

```js
table.addEventListener('ln-table:sort', function (e) {
	const ths = table.querySelectorAll('thead th');
	ths.forEach(function (th, i) {
		th.removeAttribute('aria-sort');
		if (i === e.detail.column && e.detail.direction) {
			th.setAttribute('aria-sort', e.detail.direction === 'asc' ? 'ascending' : 'descending');
		}
	});
});
```

## Edge cases

- **Empty `<tbody>` at init.** Constructor checks
  `tbody.rows.length === 0` and starts a local MutationObserver
  watching the tbody for `childList` mutations. When rows arrive
  (AJAX `innerHTML` insert), the observer disconnects itself and
  calls `_parseRows()`. The reference is stored on the instance and
  cleaned up on `destroy()`.

- **Wrapper without `id` + search disabled.** The component still
  works — sort, filter, virtual scroll all run. Only the search
  pairing breaks. The README marks this requirement explicitly.

- **`<tbody>` replaced via `innerHTML` AFTER initial parse.** The
  component does NOT re-parse on subsequent tbody mutations. Rows
  inserted later are visible (they're in the DOM) but invisible to
  sort, filter, search. To re-parse, call `el.lnTable.destroy()`
  then re-set `data-ln-table` (or insert/re-insert the wrapper) so
  the global MutationObserver re-initializes. Reflowing live data
  is `ln-data-table`'s job.

- **Single-row tables.** `_rowHeight = rows[0].offsetHeight || 40`
  measures from row 0. Width-locking via `<colgroup>` runs even with
  one row. Virtual scroll never activates (count <= 200).

- **Tables in `display: none` containers at init.** `offsetHeight`
  and `offsetWidth` return 0 for hidden elements. `_rowHeight` falls
  back to 40px (literal in the source). Column-width locking
  captures width 0 for every column — when the table later becomes
  visible, the colgroup pins columns to 0 and the layout is broken.
  Workaround: ensure the table is visible at init, OR call
  `el.lnTable.destroy()` after the container becomes visible and
  re-init via attribute reset to re-measure.

- **Multiple `[data-ln-table]` instances on one page.** Independent.
  Each has its own search input (separate `data-ln-search` ids),
  its own filter components, its own state. The `Intl.Collator`
  singleton is shared across all instances (same `<html lang>` for
  the whole page).

- **Sorting an unsortable column** (no `data-ln-sort` on `<th>`). The
  click never fires — `ln-table-sort` only attaches listeners to
  headers carrying the attribute. If you programmatically dispatch
  `ln-table:sort` with `sortType: null`, the comparator falls into
  the string branch (`String(null)` = `"null"` for every row), so
  no rows reorder.

- **Re-init after destroy.** `destroy()` deletes
  `dom[DOM_ATTRIBUTE]` and removes the colgroup. Re-setting
  `data-ln-table` (any value) on the wrapper triggers the global
  MutationObserver's attribute path → `findElements` → fresh
  instance. Rows are re-parsed from the current `<tbody>` (which now
  contains the rendered rows from the previous instance — same
  outerHTML, no problem).

## See also

- [`docs/js/table.md`](../../docs/js/table.md) — architecture mirror (state, render pipeline, virtual scroll math, lifecycle).
- [`docs/js/table-sort.md`](../../docs/js/table-sort.md) — the click-cycle companion.
- [`js/ln-data-table/README.md`](../ln-data-table/README.md) — the event-driven sibling. Pick this if your data lives in JS, not HTML.
- [`js/ln-search/README.md`](../ln-search/README.md) — the search input that fires `ln-search:change`.
- [`js/ln-filter/README.md`](../ln-filter/README.md) — per-column filter dropdown.
- [`js/ln-link/README.md`](../ln-link/README.md) — composes for clickable rows.
- [`scss/config/mixins/_table.scss`](../../scss/config/mixins/_table.scss) — table mixin family.
- [`demo/admin/src/pages/table.html`](../../demo/admin/src/pages/table.html) — interactive demo.
