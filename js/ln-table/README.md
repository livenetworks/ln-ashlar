# ln-table

> Adds client-side search, sort, per-column filter, and virtual scroll
> to a server-rendered `<table>` — by parsing the existing `<tbody>`
> once and re-rendering rows via cached `outerHTML` strings.

## Philosophy

### `ln-table` ≠ `ln-data-table` — pick the right one

Both components render sortable, filterable rows with virtual scroll above 200 records, but the contract is fundamentally different:

- **`ln-table`** parses an existing populated `<tbody>` rendered by the server into an in-memory array and re-renders by `innerHTML` assignment of cached row strings. There is no data source, template, or fetch loop. Use this when your page is a server-rendered listing (Laravel, Rails, etc.) and you want to add client-side sort/filter/virtual scroll without rewriting the data path.
- **`ln-data-table`** owns an empty `<tbody>` plus a `<template>`, receives data via the `ln-data-table:set-data` event, clones the template per record, and fills cells via `data-ln-cell="field"`. Use this when your data lives in a JS source — `ln-store` cache, `fetch()` to a REST endpoint, a static array, or a cross-frame message bus.

### Search and filter compare display text, not raw values

`data-ln-value` on a `<td>` is read ONLY for sort keys — it overrides what the sort comparator sees, but it does NOT override what search and column filters see. If you set `<td data-ln-value="1700000000">15.11.2023</td>`, sort uses the timestamp; search and column filters still see the string `"15.11.2023"`.

This is a deliberate split: sort needs a canonical value; search and filter work on what the user reads on screen.

### Last-column rule — the actions column is invisible to search

The last cell of each row is excluded from the search index. This is a convention baked into the component: the last column is assumed to be an "Actions" column with `<button>`s like Edit / Delete, which would otherwise pollute search.

**If your table does NOT have a trailing actions column, the last real-data column will not be searchable.** The fix is to add a trailing presentational column (even an empty `<td></td>`) so the real data column is `n-2` rather than `n-1`.

### Virtual scroll is window-scoped, not container-scoped

When `_filteredData.length > 200` the component attaches scroll listeners on `window`, not on the table's container. This works when the table is in normal page flow. It does **not** work when the table sits inside a scrollable container (e.g. a modal body with `overflow: auto`). If you need a virtual-scroll table inside a scrollable container, use `ln-data-table` or render fewer rows.

## HTML contract

Minimal — sortable, searchable, with column filter and an empty state:

```html
<div id="employees" data-ln-table>
	<template data-ln-table-empty>
		<article class="ln-table__empty-state">
			<h3>No results</h3>
			<button type="button" data-ln-table-clear>Clear</button>
		</article>
	</template>

	<table>
		<thead>
			<tr>
				<th colspan="5">
					<div>
						<h3>Employees</h3>
						<aside>
							<label>
								<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
								<input type="search" placeholder="Search..." data-ln-search="employees">
							</label>
							<button data-ln-table-clear>Clear</button>
						</aside>
					</div>
				</th>
			</tr>
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

// Cleanup
el.lnTable.destroy();
```

The instance has no mutation API. All mutations go through CustomEvents
(`ln-search:change`, `ln-table:sort`, `ln-filter:changed`) or
`data-ln-table-clear` clicks. `destroy()` removes all listeners,
disconnects the empty-tbody observer, and removes the colgroup.

## What it does NOT do

- **Does NOT fetch data.** Rows must be in `<tbody>` at init (or arrive via `innerHTML` while the empty-tbody MutationObserver is watching).
- **Does NOT respect `data-ln-value` for search or column filters.** Only sort comparators read it. Search and column filters compare the lowercased `td.textContent`.
- **Does NOT include the last column in the search index.** Last cell is assumed to be an actions column. Add a trailing empty `<td></td>` if your table has no actions column.
- **Does NOT virtual-scroll inside a scrollable container.** Listens on `window`, not on the table's overflow parent. Tables inside modal bodies or other scroll containers will not update the visible row window when the container scrolls.
- **Does NOT debounce.** Each `ln-search:change` triggers an immediate filter+sort+render pass. ln-search debounces upstream; this layer expects throttled traffic already.

## Cross-component composition

### With `ln-search`

The standard pairing. ln-search dispatches `ln-search:change` on the
target element resolved via `getElementById(targetId)`. ln-table
catches it, calls `e.preventDefault()` (which tells ln-search to
skip its built-in DOM walk + hide pass), and runs its own in-memory
filter.

```html
<div id="users" data-ln-table>
	<table>
		<thead>
			<tr>
				<th colspan="N">
					<div>
						<input type="search" data-ln-search="users" placeholder="Search...">
					</div>
				</th>
			</tr>
			<tr>
				<!-- column headers -->
			</tr>
		</thead>
		<tbody>...</tbody>
	</table>
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
combination works in practice. If row-click count is large or render
frequency is high, use plain `click` event delegation on the `<table>`
instead of `ln-link`.

### With `ln-data-table` — they don't compose, they replace each other

Do not put `data-ln-table` and `data-ln-data-table` on the same
element or nested inside each other. They have different render
contracts (one parses, one renders from template) and overlapping
event names (`ln-table:sort` vs `ln-data-table:sort`). Pick one for
the table; if you need both shapes on the same page, they are
separate tables with separate roots.

## Common mistakes

1. **Mutating cell text after init and expecting it to survive a
   re-render.** Cached `outerHTML` is rewritten on every render. Use
   `ln-data-table` if cells need to change after init.

2. **Forgetting the trailing actions-column convention.** A 3-column
   table with `<th>Name</th><th>Email</th><th>Phone</th>` makes the
   Phone column unsearchable. Add a trailing `<th></th>` + `<td></td>`
   or restructure the table.

3. **Using `data-ln-value` for filter columns and expecting the
   filter to compare timestamps.** It will compare the formatted
   display text. The `<th data-ln-filter-col="joined">` filter on a
   date column shows `["15.11.2023", "16.11.2023", ...]` as filter
   options, not timestamp ranges.

4. **Wiring search without giving the wrapper an `id`.** ln-search
   resolves the target by `getElementById(targetId)`. No id → no
   target → `ln-search:change` is dispatched but never reaches the
   table. Always set an `id` on the `[data-ln-table]` wrapper when
   search is present.

5. **Placing `[data-ln-table]` inside a scroll container and
   expecting virtual scroll to work.** The component listens on
   `window.scrollY`. Container-scoped scroll fires no window event;
   the visible row window will not update.

6. **Wrapping `[data-ln-table]`'s `<table>` in
   `<div class="table-container">`.** `.table-container` declares
   `overflow-x: auto`, which makes it a scroll container on both
   axes for sticky positioning. The sticky `<thead>` then binds to
   `.table-container` instead of escaping to the outer page-scroll
   surface, so the header does not pin as the user scrolls the page.
   Put the `<table>` directly inside `[data-ln-table]`.

## Edge cases

- **Empty `<tbody>` at init.** If the `<tbody>` is empty when the
  component initializes, a local MutationObserver waits for the first
  row insertion (e.g. an AJAX populate), then parses. The observer
  disconnects after parse.

- **`<tbody>` replaced via `innerHTML` AFTER initial parse.** The
  component does NOT re-parse on subsequent tbody mutations. Rows
  inserted later are visible (they're in the DOM) but invisible to
  sort, filter, search. To re-parse, call `el.lnTable.destroy()` then
  re-set `data-ln-table` so the global MutationObserver re-initializes.

- **Tables in `display: none` containers at init.** `offsetHeight`
  returns 0 for hidden elements; `_rowHeight` falls back to 40px and
  column-width locking captures 0 for every column. Ensure the table
  is visible at init, or call `el.lnTable.destroy()` after the
  container becomes visible and re-init via attribute reset.

## Integration & Development

### Integration

This component can be loaded in one of two ways depending on your application structure:

#### 1. In-Bundle (Standard Integration)
Include the main compiled bundle which includes `ln-table` along with the rest of the `ln-ashlar` component library:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you only need table capabilities without the entire library, you can import the standalone, compiled self-initializing IIFE directly:
```html
<script src="js/ln-table/ln-table.js" defer></script>
```

### Development & Source Files

- **Active Development Source**: The raw, uncompiled ES module source of truth is located at [js/ln-table/src/ln-table.js](file:///c:/laragon/www/ln-ashlar/js/ln-table/src/ln-table.js).
- **Compiled Standalone Distribution**: The built standalone bundle is located at [js/ln-table/ln-table.js](file:///c:/laragon/www/ln-ashlar/js/ln-table/ln-table.js).

## See also

- [`docs/js/table.md`](../../docs/js/table.md) — architecture mirror (state, render pipeline, virtual scroll math, lifecycle).
- [`docs/js/table-sort.md`](../../docs/js/table-sort.md) — the click-cycle companion.
- [`js/ln-data-table/README.md`](../ln-data-table/README.md) — the event-driven sibling. Pick this if your data lives in JS, not HTML.
- [`js/ln-search/README.md`](../ln-search/README.md) — the search input that fires `ln-search:change`.
- [`js/ln-filter/README.md`](../ln-filter/README.md) — per-column filter dropdown.
- [`js/ln-link/README.md`](../ln-link/README.md) — composes for clickable rows.
- [`scss/config/mixins/_table.scss`](../../scss/config/mixins/_table.scss) — table mixin family.
- [`demo/admin/src/pages/table.html`](../../demo/admin/src/pages/table.html) — interactive demo.
