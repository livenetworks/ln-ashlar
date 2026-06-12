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
| `data-ln-table-col-filter` | `<button>` | Column filter dropdown trigger. |
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

## Filter Options — `{value, label}` Shape

The `filterOptions` payload in `ln-table:set-data` supports two entry shapes per field:

- **Plain string** (existing): `['Draft', 'Approved', 'Pending']` — the string is both the filter value and the dropdown label.
- **Object** (new): `[{value: 'true', label: 'Active'}, {value: 'false', label: 'Inactive'}]` — the `label` is shown in the dropdown; `value` (raw) is echoed in the `ln-table:request-data` filters and passed to the store as-is. Both shapes may coexist in the same field array.

Example:
```js
// set-data payload
filterOptions: {
  status: [
    { value: 'approved', label: 'Approved' },
    { value: 'draft',    label: 'Draft' }
  ]
}
```

### Raw Key / Presented Label Recipe

A column's `data-ln-table-col` attribute drives sort and filter — it is the **raw field key** used in requests. The row template `{{ field }}` placeholders are independent and can reference a **different, computed display field** without affecting filter behaviour.

Example: filter on raw `active` (boolean string), display a human label from a presenter:
```html
<th data-ln-table-col="active">
  Status <button data-ln-table-col-filter …></button>
</th>
```
```html
<!-- row template cell -->
<td>{{ status_display }}</td>
```
`data-ln-table-col="active"` → filter key; `{{ status_display }}` → presented cell (filled by a `setPresenters` computed field or app decorator). The column key only drives sort/filter; cell rendering comes exclusively from the row template.
