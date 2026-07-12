# ln-filter

A zero-dependency, event-driven **Generic List & Table Filter Primitive** that manages item visibility states through declarative checkbox controls.

It filters target elements either by comparing child dataset attributes (for custom cards/lists) or scanning table column cell contents (for plain HTML tables). It operates independently of and in harmony with `ln-search`, combining multiple filter criteria seamlessly.

---

## 🧭 Philosophy & Architecture

1. **Declarative State Model:** The component has no custom imperative state-change methods. Filter state is driven entirely by native checkboxes. External scripts update selections by writing `input.checked = true` and dispatching a standard bubbled `change` event.
2. **Sentinel Rules:** The `data-ln-filter-reset` ("All") checkbox is kept in sync
   automatically through three rules:
   - **Check sentinel** → unchecks all value inputs (resets to All).
   - **Uncheck last value** → re-checks the sentinel (never allows empty selection).
   - **Check all values** → collapses to sentinel: unchecks all values, re-checks
     sentinel. Guard: only applies when a reset sentinel exists in the list.
3. **Table Column & Auto-Population Mode:** By defining `data-ln-filter-col="N"`, the component filters plain HTML `<table>` rows by column cell text. When a `<template>` tag is nested inside, the component automatically populates value checkboxes from the column's unique values on page load.
4. **Local State Persistence:** Adding the `data-ln-persist` attribute saves active filter selections to `localStorage` under `lnf:{id}`, ensuring filter states survive page reloads and browser transitions.

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

### Table Column Filter with Auto-Population & Persistence
Auto-populates filter checkboxes from Column Index `2` (Department) and saves state to storage.
```html
<nav id="dept-filter" data-ln-filter="users-table" data-ln-filter-col="2" data-ln-persist>
  <label><input type="checkbox" data-ln-filter-key="dept" data-ln-filter-reset checked> All Departments</label>
  <!-- Checklist generated dynamically here -->
  <template>
    <label><input type="checkbox"> {{ text }}</label>
  </template>
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
| `data-ln-persist` | Container root | Opt-in. Persists active checkbox selections in `localStorage` under `lnf:{id}`. |
| `data-ln-filter-hide` | Children of target | *State*. Automatically toggled on non-matching elements (`display: none !important`). |

---

## ⚡ DOM Events

Events are dispatched on **both** the filter navigation container and the target element (dual dispatch).

### `ln-filter:changed`
Fired when any filter selection is modified.
- **Payload (`detail`)**: `{ key: string, values: string[] }` (where `values` lists active filter options).

### `ln-filter:reset`
Fired when the reset sentinel is activated.
- **Payload (`detail`)**: `{}`

---

---

## Table Column Filter with Popover

The canonical composition for `ln-table` per-column filters. `ln-filter` handles mutual exclusion and dispatches to the table by id — DOM position is irrelevant because dispatch uses `getElementById`.

```html
<!-- th: data-ln-table-filter-col maps the filter key to this column -->
<th data-ln-table-sort="string" data-ln-table-filter-col="department">
	Department
	<button class="table-filter" type="button"
	        data-ln-table-col-filter
	        data-ln-popover-for="filter-my-table-dept"
	        aria-label="Filter department">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-filter"></use></svg>
	</button>
</th>

<!-- Popover: sibling to [data-ln-table], NOT inside it -->
<!-- ln-popover promotes this to the top layer via showPopover() on open — no overflow clipping -->
<div data-ln-popover id="filter-my-table-dept">
	<!-- search targets the OPTIONS UL id, not the table id -->
	<input type="search" placeholder="Search..."
	       data-ln-search="filter-my-table-dept-list"
	       data-ln-search-items="label">
	<ul id="filter-my-table-dept-list" data-ln-filter="my-table">
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Engineering"> Engineering</label></li>
		<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Legal"> Legal</label></li>
	</ul>
</div>
```

### Attribute roles in this composition

| Attribute | Where | Purpose |
|---|---|---|
| `data-ln-filter-key="department"` | `<input type="checkbox">` | Column field name — must match `data-ln-table-filter-col` on `<th>` |
| `data-ln-filter-value="Engineering"` | `<input type="checkbox">` | Raw machine value — must match `data-ln-value` in the corresponding `<td>` |
| `data-ln-filter-reset` | `<input type="checkbox">` | Marks the "All" sentinel; checking it unchecks all value inputs |
| `data-ln-filter="my-table"` | `<ul>` | Targets the TABLE wrapper id — not the popover id |

### How dispatch reaches ln-table

`ln-filter` fires `ln-filter:changed` on both the filter container and on `getElementById(tableId)` (see `_dispatchOnBoth` in `js/ln-filter/src/ln-filter.js:293`). `ln-table` receives the event directly on its root element regardless of where in the DOM the filter markup lives.

---

## ⚠️ Common Pitfalls

- **Driving State Programmatically Without Events:** Changing `input.checked = true` using JavaScript does not trigger browser `change` listeners. You must explicitly dispatch the event:
  ```javascript
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  ```
- **Missing `id` on Persisted Filters:** The `data-ln-persist` storage key relies on the filter element's ID (e.g. `<nav id="my-filter" data-ln-persist>`). If the ID is missing, the component will fail to initialize persistence.
- **Using `data-ln-filter-col` for ln-table column filters:** The `data-ln-filter-col` attribute (0-based column index for plain table row filtering) is for standalone `ln-filter` targeting a plain `<table>` — not for the `ln-table` component. When composing with `ln-table`, use `data-ln-filter="<tableId>"` on the `<ul>` and `data-ln-table-filter-col="<fieldName>"` on the `<th>`. `ln-table` receives `ln-filter:changed` and maps keys to columns via `data-ln-table-filter-col`.
