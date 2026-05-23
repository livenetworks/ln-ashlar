# ln-data-table

A zero-dependency, event-driven **Data Presentation Shell** that manages row template rendering, interactive sorting, column filtering, search states, multi-row selections, virtual scrolling (10,000+ items), and keyboard layouts.

It decouples data presentation from data fetching: announcing query intents via request events and awaiting rendered datasets asynchronously.

---

## 🧭 Philosophy & Architecture

1. **Presenter Separation:** The component possesses no fetching capabilities. It translates column and search interactions into unified query events and delegates execution to a coordinator (such as `ln-store` or direct server fetchers).
2. **Dynamic Template Scoping:** Row designs are written cleanly inside standard HTML `<template>` slots. Values are safely bound using double-curly brackets (`{{ field }}`) using browser-native `textContent` for robust XSS protection.
3. **Flicker-Free Virtual Rendering:** Massive tables auto-activate high-performance virtual scrolling. Only the visible portion of rows plus a buffer are mounted, keeping the DOM extremely small.

---

## 📦 Minimal Blueprint

```html
<section data-ln-data-table="documents" data-ln-data-table-selectable id="documents-table">
  <header class="ln-table__toolbar">
    <h3>Documents</h3>
    <input type="search" placeholder="Search..." data-ln-data-table-search>
  </header>

  <table>
    <thead>
      <tr>
        <th data-ln-col-select></th>
        <th data-ln-col="title">
          Title
          <button data-ln-col-sort aria-label="Sort">
            <svg class="ln-icon" data-ln-sort-icon="none"><use href="#ln-arrows-sort"></use></svg>
            <svg class="ln-icon" data-ln-sort-icon="asc"><use href="#ln-arrow-up"></use></svg>
            <svg class="ln-icon" data-ln-sort-icon="desc"><use href="#ln-arrow-down"></use></svg>
          </button>
        </th>
      </tr>
    </thead>
    <tbody data-ln-data-table-body></tbody>
  </table>

  <!-- Row Template -->
  <template data-ln-template="documents-row">
    <tr data-ln-row>
      <td><input type="checkbox" data-ln-row-select></td>
      <td>{{ title }}</td>
    </tr>
  </template>
</section>
```

> [!IMPORTANT]
> Directly nested `<table>` elements must not be wrapped in scroll-trapping `overflow-y: auto` containers. The sticky header and virtual scroll calculations automatically bind to the nearest scrollable page-level container.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-data-table` | `<section>` | Component root and namespace. |
| `data-ln-data-table-selectable` | `<section>` | Opt-in. Activates checkbox columns and selection tracking. |
| `data-ln-col="field"` | `<th>` | Binds column interactions (sort, filter) to a data property. |
| `data-ln-data-table-search` | `<input>` | Binds keystroke entries to instant search events. |

### JS API

Access the presentation state directly via the `lnDataTable` property on the section container:

```javascript
const table = document.getElementById('documents-table');

// 1. Inspect state
const selection = table.lnDataTable.selectedIds; // Set of active string IDs
const sortedBy = table.lnDataTable.currentSort;   // { field, direction }

// 2. Tear down listeners
table.lnDataTable.destroy();
```

---

## ⚡ DOM Events

### Emitted (Telemetry & Intent)

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-data-table:request-data` | `{ table, sort, filters, search }` | Intent event. Fired whenever query states change. |
| `ln-data-table:row-click` | `{ table, id, record }` | Fired when clicking a row (ignored on inputs/links). |
| `ln-data-table:row-action` | `{ table, id, action, record }` | Fired on clicking `[data-ln-row-action="action"]` slots. |
| `ln-data-table:select` | `{ table, selectedIds, count }` | Fired on selecting row checkboxes. |

### Received (State Synchronization)

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-data-table:set-data` | `{ data: Array, total, filtered }` | Populates table, rebuilds filters, formats counts. |
| `ln-data-table:set-loading` | `{ loading: Boolean }` | Toggles dim loading state (pointer-events disabled). |

---

## ⚠️ Common Pitfalls

- **Bypassing the Template Slot:** Putting static row markup directly inside `<tbody>` will result in it being immediately purged on the first data render event. Always build row cells within `<template>`.
- **Horizontal Overflow Traps:** Attempting to wrap tables in scroll layers breaks sticky header positioning. Let layout views manage full viewport boundaries instead.
- **Direct JS string injections:** Attempting to render raw HTML inside templates bypasses the safe `textContent` parser, opening XSS risks. Use custom action dispatchers for complex fields.
