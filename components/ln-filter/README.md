# ln-filter

> Applied to a `<nav data-ln-filter="targetId">` control containing `<input type="checkbox">` filters with `data-ln-filter-value`
> and a `data-ln-filter-reset` sentinel. On checkbox `change`, it updates active values and keeps the sentinel in sync. It evaluates
> items on the target container or table by dataset attributes or column index, sets `data-ln-filter-hide` and `.hidden` on non-matching
> elements, and emits a cancelable `ln-filter:change` CustomEvent.

---

## 🧭 Philosophy & Architecture

1. **Declarative State Model:** The component has no custom imperative state-change methods. Filter state is driven entirely by native checkboxes. External scripts update selections by writing `input.checked = true` and dispatching a standard bubbled `change` event.
2. **Sentinel Rules:** The `data-ln-filter-reset` ("All") checkbox is kept in sync automatically through mutual exclusion and collapse rules:
   - **Check sentinel** → unchecks all value inputs (resets to All).
   - **Uncheck last value** → re-checks the sentinel (never allows empty selection).
   - **Check all values** → collapses to sentinel: unchecks all values, re-checks sentinel.
3. **Plain Table Column Filtering:** By defining `data-ln-filter-col="N"`, the component filters plain HTML `<table>` rows by column cell text with AND logic across columns and OR logic within columns.
4. **Local State Persistence:** Adding the `data-ln-persist` attribute saves the active filter values (`data-ln-filter-values`) to `localStorage` under `ln:{id}:data-ln-filter-values` (global by default), or `ln:{id}:{path}:data-ln-filter-values` when `data-ln-persist-scope="page"` is present. The filter *key* is never persisted — only the active values.
5. **Decoupled Two-Host Bridge:** Dispatches cancelable `ln-filter:change` events. Consumers (such as `ln-table` in SSR mode or `ln-data-store`) call `e.preventDefault()` to claim filtering and prevent default DOM item hiding.

---

## 📦 Minimal Blueprint

### Generic List Attribute Filter (Zero-JS)
Bind the filter to a container `id`. Target items declare attributes matching the filter key.
```html
<nav data-ln-filter="employees-list">
  <!-- Reset Sentinel -->
  <label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-reset checked> All</label>
  <!-- Values -->
  <label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="design"> Design</label>
  <label><input type="checkbox" data-ln-filter-key="category" data-ln-filter-value="dev"> Development</label>
</nav>

<ul id="employees-list">
  <li data-category="design">Ana Petrova — UI Designer</li>
  <li data-category="dev">Marko Nikolov — Developer</li>
</ul>
```

### Table Column Filter with Plain HTML Table
Filters plain `<table>` rows by Column Index `2` (Department) and saves state to storage.
```html
<nav id="dept-filter" data-ln-filter="users-table" data-ln-filter-col="2" data-ln-persist>
  <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All Departments</label>
  <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Engineering"> Engineering</label>
  <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-value="Design"> Design</label>
</nav>

<table id="users-table">
  <thead>
    <tr><th>ID</th><th>Name</th><th>Department</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>Ana Petrova</td><td>Engineering</td></tr>
    <tr><td>2</td><td>Marko Nikolov</td><td>Design</td></tr>
  </tbody>
</table>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-filter` | Container root | Component root. Value is the `id` of the target container whose items are filtered. |
| `data-ln-filter-key` | `<input type="checkbox">` | The field name representing the target dataset attribute (e.g. `category` matches `data-category`). |
| `data-ln-filter-value` | `<input type="checkbox">` | The value to match. Active checkboxes show matching items; others are hidden. |
| `data-ln-filter-reset` | `<input type="checkbox">` | Marks the reset ("All") sentinel. |
| `data-ln-filter-col` | Container root | Opt-in. 0-based column index to filter plain `<table>` rows by column cell text. |
| `data-ln-persist` | Container root | Opt-in. Persists active checkbox selections (`data-ln-filter-values`) in `localStorage`. |
| `data-ln-persist-scope` | Container root | Opt-in, independent attribute. `"page"` scopes the persisted key to the current URL pathname. |
| `data-ln-hash` | Container root | Opt-in. Synchronizes active filters to URL hash fragment (e.g. `#users-filter:status:active,pending`). Value is custom namespace; if empty defaults to `[targetId]-filter`. |
| `data-ln-filter-values` | Container root | *State*. Comma-joined, percent-encoded list of currently active filter values. Written by the component, read by `ln-persist` for restore/save. |
| `data-ln-filter-hide` | Children of target | *State*. Automatically toggled on non-matching elements (`display: none !important`). |


---

## ⚡ DOM Events

### `ln-filter:change`
Fired when any filter selection is modified.
- **Cancelable**: Yes (`preventDefault`)
- **Payload (`detail`)**: `{ key: string, values: string[], targetId: string }`

### `ln-filter:reset`
Fired when the reset sentinel is activated.
- **Payload (`detail`)**: `{ targetId: string }`

---

## Table Column Filter with Popover

The canonical composition for table per-column filters.

```html
<th data-ln-table-filter-col="department">
	Department
	<button class="table-filter" type="button"
	        data-ln-table-col-filter
	        data-ln-popover-for="filter-my-table-dept"
	        aria-label="Filter department">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-filter"></use></svg>
	</button>
</th>

<div data-ln-popover id="filter-my-table-dept">
	<ul id="filter-my-table-dept-list" data-ln-filter="my-table">
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Legal"> Legal</label></li>
	</ul>
</div>
```

---

## ⚠️ Common Pitfalls

- **Driving State Programmatically Without Events:** Changing `input.checked = true` using JavaScript does not trigger browser `change` listeners. You must explicitly dispatch the event:
  ```javascript
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  ```
- **Missing `id` on Persisted Filters:** The `data-ln-persist` storage key relies on the filter element's ID (e.g. `<nav id="my-filter" data-ln-persist>`), unless an explicit `data-ln-persist="key"` value is given. If neither exists, `ln-persist` warns once and skips persistence for that element.
- **Using `data-ln-filter-col` for ln-table column filters:** The `data-ln-filter-col` attribute (0-based column index for plain table row filtering) is for standalone `ln-filter` targeting a plain `<table>` — not for the `ln-table` component. For `ln-table`, use `data-ln-filter="<tableId>"` on the `<ul>` and `data-ln-table-filter-col="<fieldName>"` on the `<th>`.
