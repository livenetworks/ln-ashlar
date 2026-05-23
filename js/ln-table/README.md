# ln-table

A zero-dependency, high-performance **Server-Rendered Table Primitive** that enhances standard, pre-populated HTML tables in-place. It parses existing DOM `<tbody>` elements once on load and layers ultra-fast, client-side in-memory sorting, column filtering, text searches, and scroll virtualization on top of pre-rendered markup.

---

## 🧭 Philosophy & Architecture

1. **`ln-table` vs `ln-data-table`:**
   - Use `ln-table` when rows are already printed in `<tbody>` by your backend server on page load. It parses existing elements and manipulates visibility in-place.
   - Use `ln-data-table` when your data source is an active JS array (such as an `ln-store` IndexedDB cache or REST fetch API) and needs to clone structural templates.
2. **Platform-First Search Indexing:** Search and column filters scan the visible display texts of cells, whereas sorting reads numeric or date values defined in `data-ln-value` overrides.
3. **Actions Column Exclusivity:** The last cell (`<td>`) of each row is automatically ignored during search indexes. This prevents buttons (e.g. Edit / Delete) from polluting search results.

---

## 📦 Minimal Blueprint

```html
<div id="employees-table" data-ln-table>
  <!-- Empty State Template -->
  <template data-ln-table-empty>
    <article class="ln-table__empty-state">
      <h3>No matches found</h3>
      <button type="button" data-ln-table-clear>Clear filters</button>
    </article>
  </template>

  <table>
    <thead>
      <tr>
        <th data-ln-sort="string">Name</th>
        <th data-ln-sort="number">Salary</th>
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

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-table` | `<div>` wrapper | Root marker. Target must carry a unique `id`. |
| `data-ln-sort="type"` | `<th>` | Marks column sortable. Values: `string`, `number`, `date`. |
| `data-ln-value="raw"` | `<td>` | Raw value used exclusively by sort comparators. |
| `data-ln-filter-col="key"` | `<th>` | Maps the column to an active `ln-filter` key. |
| `data-ln-table-clear` | `<button>` | Click delegate. Instantly clears search query and active filters. |

### JS API

Access the parsed database model directly via the `lnTable` property on the wrapper element:

```javascript
const table = document.getElementById('employees-table');

// 1. Inspect parsed arrays
const cachedRows = table.lnTable._data;         // All parsed DOM rows
const visibleRows = table.lnTable._filteredData; // Current matches

// 2. Tear down listeners and unlock column widths
table.lnTable.destroy();
```

---

## ⚡ DOM Events

### Emitted

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-table:ready` | `{ total }` | Dispatched after the initial DOM parse is complete. |
| `ln-table:filter` | `{ term, matched, total }` | Dispatched after any search or filter state updates. |
| `ln-table:sorted` | `{ column, direction }` | Dispatched after sorting is recalculated in-place. |

### Received

`ln-table` coordinates with sibling UI primitives through standard DOM event channels:

- **Listens to `ln-search:change`:** Updates text queries and filters the DOM.
- **Listens to `ln-table:sort`:** Triggers structural sorting in-place.
- **Listens to `ln-filter:changed`:** Triggers column filters and highlights headers.

---

## ⚠️ Common Pitfalls

- **Bypassing the ID Requirement:** Sibling search controls (`ln-search`) target wrappers by calling `getElementById(targetId)`. The table wrapper **must** carry a unique `id`.
- **Dynamic Row Replacements:** Modifying cell values after initial paint using `innerHTML` will be lost. The script caches rows as static strings on page load. Use `ln-data-table` instead for dynamic writes.
- **Scroll Container Wrapping:** Do not wrap tables in scroll trapping boxes (`overflow-y: auto`). Scroll virtualization and sticky headers automatically bind to the outer window scroll bounds.
