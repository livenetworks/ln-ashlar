# ln-table

A zero-dependency, high-performance table presenter component that supports both Server-Rendered (SSR) Mode and Data-Driven Mode in `ln-ashlar`.

---

## 🧭 Philosophical Modes

1. **Server-Rendered (SSR) Mode**:
   Hydrates standard, backend-printed HTML tables in-place. Reads the existing `<tbody>` rows once on load and layers sorting, filtering, text searches, and scroll virtualization on top of pre-rendered markup.
2. **Data-Driven Mode**:
   Operates as a dynamic presenter engine. Clones templates, interpolates double-curly braces (`{{ field }}`), manages checkbox selection lists, updates footers, and coordinates dataset requests via AJAX coordinators.

---

## 🏛️ Layer 1 vs Layer 2 Architecture

`ln-table` strictly operates as a **Layer 1 Component** (Data & DOM presenter):
- Manages internal data arrays, virtual scroll rendering, sliding window cache, row template cloning, cell formatting, and selection state.
- Responds to command/request events (`ln-table:set-search`, `ln-table:set-filter`, `ln-table:set-data`, `ln-table:set-loading`, `ln-table:request-clear-filters`).
- Emits lifecycle notifications (`ln-table:ready`, `ln-table:rendered`, `ln-table:filter`, `ln-table:sorted`, `ln-table:select`).

External UI controls (`ln-search`, `ln-filter`, filter header buttons, clear buttons, keyboard focus shortcuts) are orchestrated by **Layer 2 Coordinator** [`ln-table-coordinator`](../ln-table-coordinator/README.md).

---

## 📦 Minimal Blueprint

### 1. SSR / Markup Mode
```html
<div id="employees-table" data-ln-table>
  <template data-ln-table-empty>
    <article class="ln-table__empty-state">
      <h3>No matches found</h3>
      <button type="button" data-ln-table-clear>Clear filters</button>
    </article>
  </template>

  <table>
    <thead>
      <tr>
        <th data-ln-table-sort="string">Name</th>
        <th data-ln-table-sort="number">Salary</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Dalibor Sojic</td>
        <td data-ln-value="120000">$120,000</td>
      </tr>
    </tbody>
  </table>
</div>
```

### 2. Data-Driven Mode
```html
<section data-ln-table="products" data-ln-table-source="products" id="products-table">
  <table>
    <thead>
      <tr>
        <th data-ln-table-col="name">Product Name</th>
        <th data-ln-table-col="category">Category</th>
      </tr>
    </thead>
    <tbody data-ln-table-body></tbody>
  </table>

  <!-- Row Template -->
  <template data-ln-template="products-row">
    <tr data-ln-table-row>
      <td>{{ name }}</td>
      <td>{{ category }}</td>
    </tr>
  </template>
</section>
```

> Row templates support `{{ field }}` (text) and
> `data-ln-table-cell-attr="field:attr"` (attributes) only — both stamped once
> at clone time. `data-ln-field` is **not** processed in rows (the row
> pipeline never calls `fill()`); it would sit inert in the DOM.

---

## 🛠️ Attributes Reference

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-table` | Root wrapper | Component identifier. Target must carry a unique `id`. |
| `data-ln-table-source` | Root wrapper | Opt-in indicator for Data-Driven Mode. |
| `data-ln-table-selectable` | Root wrapper | Enables checkbox-based row selections. |
| `data-ln-table-window="N"` | Root wrapper | Opt-in server-side sliding-window virtualization. `N` sets the resident-row cap (default 1000). Requires Data-Driven Mode. Observable: add/remove toggles windowed mode ON/OFF live; changing `N` while windowed reconfigures the live cache. |
| ~~`data-ln-table-search`~~ | — | **Removed.** Drive the search input with `data-ln-search="<tableId>"` — `ln-table` consumes `ln-search:change` in both modes. |
| `data-ln-table-col="field"` | `<th>` | Maps column header to data object field keys. |
| `data-ln-value` | `<td>` | Raw machine value behind a formatted cell — sorting/filtering operate on this, not the displayed text. Read via `ln-core.readValue`. |
| `data-ln-table-col-sort` | `<button>` | Column sorting trigger button. |
| `data-ln-table-col-filter` | `<button>` | JS id hook — identifies the filter button in a `<th>`. Pair with `data-ln-popover-for` to open the filter popover. |
| `data-ln-table-col-select` | `<th>` | Header checkbox column selector. |
| `data-ln-table-row` | `<tr>` | Target row container in row templates. |
| `data-ln-table-row-select` | `<input>` | Selection checkbox in row templates. |
| `data-ln-table-row-action="name"`| `<button>` | Action button trigger in row templates. |

---

## ⚡ DOM Events

### Emitted Events

- **`ln-table:ready`** `{ total }`  
  Fired after the initial DOM rows are parsed.
- **`ln-table:request-data`** `{ table, sort, filters, search }`  
  Requests a fresh dataset when sort, filter, or search is changed. Windowed mode (`data-ln-table-window`) adds `{ offset, limit, queryGen }`.
- **`ln-table:rendered`** `{ table, total, visible }`  
  Fired after a dynamic template render finishes drawing.
- **`ln-table:row-click`** `{ table, id, record }`  
  Fired when clicking on row contents.
- **`ln-table:row-action`** `{ table, id, action, record }`  
  Fired when clicking row buttons.  
  Note: the row-action click handler calls `e.stopPropagation()`, so a `data-ln-table-row-action` button cannot be combined with document-delegated triggers like `data-ln-modal-for` or `data-ln-fill-*` on the same button — the click never reaches those listeners. Pick one mechanism per button.

### Received Events

- **`ln-table:set-data`** `{ data, total, filtered, filterOptions }`  
  Applies the payload array and triggers rendering. Windowed mode expects `{ offset, queryGen }` echoed back — routed straight into the internal window cache.
- **`ln-table:set-loading`** `{ loading }`  
  Toggles the visual loading dimmed state overlay.

---

## Column Filters

Column filters use static authored markup — a `[data-ln-popover]` block containing `[data-ln-filter]` checkboxes. `ln-table` consumes one event: `ln-filter:changed`.

### What ln-table does

1. Receives `ln-filter:changed` on the table element.
2. Maps `e.detail.key` to a column via `data-ln-table-filter-col` on `<th>`.
3. Stores active filter values in `_columnFilters`.
4. **SSR mode**: runs `_applyFilterAndSort()` + `_render()` in-memory.
5. **Data-driven mode**: calls `_requestData()` — the coordinator handles fetching.
6. Toggles `.ln-filter-active` on the funnel `<button>` (the dot indicator).
7. Dispatches `ln-table:filter`.

### What ln-table does NOT do

- Does not generate filter dropdown markup.
- Does not track which options exist in the dataset.
- Does not handle mutual exclusion of checkboxes (`ln-filter` owns that).

### Markup contract

```html
<!-- th attribute maps filter key → column -->
<th data-ln-table-filter-col="department">
	Department
	<button class="table-filter" type="button"
	        data-ln-table-col-filter
	        data-ln-popover-for="filter-dept"
	        aria-label="Filter department">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
	</button>
</th>

<!-- Popover: sibling to [data-ln-table], not inside it -->
<div data-ln-popover id="filter-dept">
	<input type="search" data-ln-search="filter-dept-list" data-ln-search-items="label" placeholder="Search...">
	<ul id="filter-dept-list" data-ln-filter="my-table">
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
	</ul>
</div>
```

Options come from the domain (backend enum or lookup), never derived from the dataset. Include options that may have zero matches — they represent valid domain states.

### Clear-all

**SSR mode:** `data-ln-table-clear` on a button inside the table wrapper. Clears search term and all `[data-ln-filter]` containers targeting this table.

**Data-driven mode:** `data-ln-table-clear-all` on a button. Resets `currentFilters`, clears visual indicators on all filter buttons, and calls `_requestData()`.

---

## Windowed Mode

Opt-in server-side sliding-window virtualization for datasets too large to cache client-side. Add `data-ln-table-window="N"` to a Data-Driven Mode table; the component owns a bounded `ln-core.createWindowCache` instance instead of the full dataset.

### What it does

1. Caches at most `N` rows (default 1000), LRU-evicting the least-recently-touched rows once the cap is exceeded.
2. Extends `ln-table:request-data` with `{ offset, limit, queryGen }` on every scroll pass that needs new rows.
3. Reads `{ offset, queryGen }` off `ln-table:set-data` and routes it into the window cache, dropping the response if `queryGen` no longer matches the current query.
4. Renders blank placeholder rows (no shimmer) for logical rows not yet resident.
5. Hides the select-all checkbox (D4) — per-row selection still works and survives eviction.

### Live observability

`data-ln-table-window`, `data-ln-table-window-page`, `data-ln-table-window-threshold`, and `data-ln-table-count` are all observed and apply live, without re-init. Adding `data-ln-table-window` to an initialized, non-windowed, data-driven table enables windowing live — the cache seeds from resident rows, honoring `data-ln-table-count` if present. Removing it disables windowing live: the cache is destroyed and the table issues a fresh full `ln-table:request-data` (no `offset`/`limit`) to repopulate the complete dataset before rendering non-windowed again.

### What it does NOT do

- Does not cache the full dataset client-side — that's the non-windowed Data-Driven path.
- Does not paginate — scrolling stays continuous; `offset`/`limit` address server-side pages, not user-facing "Page 2" navigation.
- Does not retry a dropped stale response — the next `ensure()` pass re-requests it under the current `queryGen`.

### Markup contract

```html
<section data-ln-table="documents" data-ln-table-source="documents" data-ln-table-window="1000" id="documents-table">
    ...
</section>
```

---

## 🔧 Internals

Source: `js/ln-table/ln-table.js`, `js/ln-table/ln-table-sort.js` (a separate, co-loaded component). Imports from `ln-core`: `cloneTemplateScoped`, `dispatch`, `fill`, `fillTemplate`, `registerComponent`, `createWindowCache`.

### Mode detection & lifecycle

- The constructor branches once, at construction: `this.isDataDriven = dom.hasAttribute('data-ln-table-source')`.
- **SSR**: reads `<tbody>` rows once at bootstrap, caches them as static HTML strings in `_data`, and re-sorts/filters that in-memory cache on `ln-search:change` / `ln-table:sort` / `ln-filter:changed`.
- **Data-driven**: `isLoaded = false` until the first `ln-table:set-data`. If `<tbody>` already has rows (hybrid), they're parsed synchronously first — instant local sort/filter/search response before the authoritative dataset arrives. When the background sync lands, `_vStart`/`_vEnd` reset to `-1` and virtual scroll re-initializes against the full dataset.
- **Loading dimming**: `ln-table:set-loading {loading:true}` adds `.ln-table--loading` to the wrapper; `ln-table:set-data` clears it automatically.

### DOM mutations

| Phase | Mutation |
|---|---|
| `set-loading` | `.ln-table--loading` on the wrapper |
| `set-data` / sort / filter / search | `<tbody>` rows re-rendered (cloned templates in data-driven mode, cached HTML in SSR); footer counters (`data-ln-table-total` / `-filtered` / `-selected`) updated |
| sort click | `.ln-sort-asc` / `.ln-sort-desc` on the active `<th>`; sort direction icon visibility toggled via those classes |
| filter change | `.ln-filter-active` toggled on the column's filter button |

### Sort internals (`ln-table-sort.js`)

A separate component instance lives at `table.lnTableSort`, tracking `ths` (all sortable `<th>`), `_col` (active column index, `-1` = none), `_dir` (`'asc'|'desc'|null`).

- Click cycle: `(none) → asc → desc → (none)`; clicking a different column resets and starts at `asc`.
- Each `<th>` gets `lnTableSortBound = true` to prevent duplicate listeners on MutationObserver re-fires.
- **Persistence** (opt-in): `data-ln-persist` on the `[data-ln-table]` **wrapper** (not the `<table>`). Key: `ln:table-sort:{pagePath}:{wrapperId}`. Stored value: `{col, dir}` or `null`. Restored in the constructor, after click handlers bind, by replaying `_handleClick` (once for `asc`, twice for `desc`). A stale saved column index (`saved.col >= ths.length`) silently skips restore.
- A dedicated MutationObserver (separate from `ln-table`'s own) watches for new sortable `<th>` (childList) and `data-ln-table-sort` attribute additions (re-scans the parent table).
- **Dev diagnostic**: `ln-ashlar-dev.css` (dev-only stylesheet) renders a `⚠ missing sort button` warning next to any `<th data-ln-table-sort>` lacking the required `<button data-ln-table-col-sort>` child — sort silently no-ops without it otherwise.

### MutationObserver flow (`ln-table.js`)

A single observer on `document.body`: new `data-ln-table` root injected → `new lnTable(node)`; elements injected inside a live root → local rescan (no full re-init); `data-ln-table-source`/`-window` attribute set on an existing element → re-evaluated live (see Windowed Mode below).

### Windowed cache mechanics

Backed by `ln-core.createWindowCache` — the table owns the cache instance, not the full dataset:

- LRU eviction by touch-recency (not viewport distance) once resident rows exceed `windowSize`.
- `_renderWindowed()` calls `cache.ensure(startRow, endRow)` on every scroll pass; unresident logical rows render as blank placeholder `<tr>`s (no shimmer) until their page arrives.
- `requestPage` dispatches `ln-table:request-data` with `{offset, limit, queryGen}`; `cache.ingest()` consumes the matching `ln-table:set-data {offset, queryGen}` and splices the page in. A response whose `queryGen` doesn't match the cache's current generation is dropped — the guard against a stale sort/filter/search response landing after a newer query superseded it.
- Live reconfiguration routes through `configure()`/`setGrandTotal()`: enabling `data-ln-table-window` on an initialized non-windowed table seeds the cache from resident rows (honoring `data-ln-table-count` if present, else the resident count); removing it destroys the cache and re-issues a full `ln-table:request-data` (no `offset`/`limit`) to repopulate non-windowed.

### Filter options — `{value, label}` shape

`filterOptions` in `ln-table:set-data` accepts per-field arrays mixing plain strings (`'Draft'` — used as both raw value and label) and `{value, label}` objects (`{value:'true', label:'Active'}` — label renders in the dropdown, raw `value` is echoed verbatim in `ln-table:request-data` filters). This lets a column filter on a raw boolean/enum field (`data-ln-table-col="active"`) while displaying a human-readable computed field in the row template (`{{ status_display }}`) — no app-side label↔value translation needed.

### Sticky header/footer

`@include ln-table-toolbar` / `@include ln-table-footer` mixins (in `scss/components/_ln-table.scss`) pin the header/footer flush at the scroll container's bounds, with fallback rules targeting direct-child `[data-ln-table] > header` / `> footer`.
