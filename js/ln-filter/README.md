# ln-filter

A zero-dependency, event-driven **Generic List & Table Filter Primitive** that manages item visibility states through declarative checkbox controls.

It filters target elements either by comparing child dataset attributes (for custom cards/lists) or scanning table column cell contents (for plain HTML tables). It operates independently of and in harmony with `ln-search`, combining multiple filter criteria seamlessly.

---

## 🧭 Philosophy & Architecture

1. **Declarative State Model:** The component has no custom imperative state-change methods. Filter state is driven entirely by native checkboxes. External scripts update selections by writing `input.checked = true` and dispatching a standard bubbled `change` event.
2. **Sentinel Mutual Exclusion:** The `data-ln-filter-reset` ("All") checkbox is kept in sync automatically: checking any value checkbox unchecks the reset sentinel; checking the sentinel unchecks all value inputs; unchecking all value inputs re-checks the sentinel.
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

## ⚠️ Common Pitfalls

- **Driving State Programmatically Without Events:** Changing `input.checked = true` using JavaScript does not trigger browser `change` listeners. You must explicitly dispatch the event:
  ```javascript
  input.checked = true;
  input.dispatchEvent(new Event('change', { bubbles: true }));
  ```
- **Missing `id` on Persisted Filters:** The `data-ln-persist` storage key relies on the filter element's ID (e.g. `<nav id="my-filter" data-ln-persist>`). If the ID is missing, the component will fail to initialize persistence.
- **Filtering Coordinated Tables:** `ln-filter` is designed for static lists or plain native tables. Do not target virtualised components like `ln-table` or `ln-data-table`, which manage their own column filters internally.
