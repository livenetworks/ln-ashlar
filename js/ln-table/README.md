# ln-table

A zero-dependency, high-performance table presenter component that supports both Server-Rendered (SSR) Mode and Data-Driven Mode in `ln-ashlar`.

---

## 🧭 Philosophical Modes

1. **Server-Rendered (SSR) Mode**:
   Hydrates standard, backend-printed HTML tables in-place. Reads the existing `<tbody>` rows once on load and layers sorting, filtering, text searches, and scroll virtualization on top of pre-rendered markup.
2. **Data-Driven Mode**:
   Operates as a dynamic presenter engine. Clones templates, interpolates double-curly braces (`{{ field }}`), manages checkbox selection lists, updates footers, and coordinates dataset requests via AJAX coordinators.

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
  Requests a fresh dataset when sort, filter, or search is changed.
- **`ln-table:rendered`** `{ table, total, visible }`  
  Fired after a dynamic template render finishes drawing.
- **`ln-table:row-click`** `{ table, id, record }`  
  Fired when clicking on row contents.
- **`ln-table:row-action`** `{ table, id, action, record }`  
  Fired when clicking row buttons.

### Received Events

- **`ln-table:set-data`** `{ data, total, filtered, filterOptions }`  
  Applies the payload array and triggers rendering.
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
