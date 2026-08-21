# ln-list

A unified, structure-agnostic, and local-first **Data Presenter Component** designed to render datasets in list, card, section, or grid layouts. It connects to `ln-data-store` via CustomEvents using the **Coordinator Pattern**, supporting client-side filtering, sorting, searching, and high-performance **Virtual Scrolling** for large datasets.

---

## 📦 Declarative Setup in HTML

### 1. Simple SSR List
For a server-rendered list where the backend outputs `<li>` elements directly:

```html
<label class="search">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Search..." data-ln-search-for="documents-list" data-ln-search-debounce="0">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</label>

<ul id="documents-list" data-ln-list="documents" data-ln-search="">
    <li data-ln-item-id="1">Document A</li>
    <li data-ln-item-id="2">Document B</li>
</ul>
```

### 2. Data-Driven Grid List (with Virtual Scroll)
Opted-in by adding the `data-ln-list-source` attribute pointing to a `data-ln-data-store`. The search input targets the store:

```html
<!-- Store is the State Host for queries in Data-Driven mode -->
<div data-ln-data-store="documents" data-ln-search=""></div>

<label class="search">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Search..." data-ln-search-for="documents" data-ln-search-debounce="500">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</label>

<section id="documents-grid" 
         data-ln-list="documents" 
         data-ln-list-source="documents" 
         data-ln-list-window="1000"
         data-ln-list-selectable>
    
    <!-- Items container -->
    <ul class="grid-layout" data-ln-list-body></ul>

    <!-- Row Template (Must contain an element with data-ln-item attribute) -->
    <template data-ln-template="documents-row">
        <li data-ln-item class="card-item">
            <header>
                <input type="checkbox" data-ln-item-select>
                <h3 data-ln-field="title"></h3>
            </header>
            <p>{{ description }}</p>
            <button type="button" data-ln-item-action="delete">Delete</button>
        </li>
    </template>

    <!-- Empty States -->
    <template data-ln-template="documents-empty">
        <div class="empty-state">No documents found.</div>
    </template>

    <template data-ln-template="documents-empty-filtered">
        <div class="empty-state">No matching documents found.</div>
    </template>
</section>
```

---

## 🛠️ Attributes Reference

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-list` | Root wrapper | Component identifier. Target must carry a unique `id`. |
| `data-ln-list-source` | Root wrapper | Opt-in indicator for Data-Driven Mode (points to Store ID). |
| `data-ln-list-selectable` | Root wrapper | Enables checkbox-based item selections. |
| `data-ln-list-window="N"` | Root wrapper | Opt-in server-side sliding-window virtualization. `N` sets the resident-row cap (default 1000). Requires Data-Driven Mode. |
| `data-ln-list-window-page="N"` | Root wrapper | Chunk/page fetch size for windowed requests (default 200). |
| `data-ln-list-window-threshold="N"` | Root wrapper | Prefetch margin threshold in rows before reaching edge (default 25). |
| `data-ln-list-count="N"` | Root wrapper | Declares unfiltered grand total for windowed lists. |
| `data-ln-list-body` | Sub-element | Target container where items are rendered (falls back to root). |
| `data-ln-item` | Template element | Identifies an item root inside a template or hydrated markup. |
| `data-ln-item-id` | `[data-ln-item]` | Unique ID of the row item. |
| `data-ln-item-select` | `<input>` | Checkbox inside item template for row selection. |
| `data-ln-item-action="name"` | `<button>` | Item action button (dispatches `ln-list:item-action`). |
| `data-ln-list-select-all` | `<input>` | Global select-all checkbox for list items. |
| `data-ln-list-field="key"` | Sub-element | Maps element value (via `readValue()`) to record property for sorting/filtering. |
| `data-ln-list-total` | `<span>` | Target element to display total record count. |
| `data-ln-list-filtered` | `<span>` | Target element to display filtered count. |
| `data-ln-list-selected` | `<span>` | Target element to display active selection count. |
| `data-ln-list-empty` | `<template>` | Empty state template in SSR mode. |
| `data-ln-empty` | `<template>` | Generic empty state template in Data-Driven mode. |
| `data-ln-empty-when="initial\|search"` | Sub-element | Conditional empty state view inside `template[data-ln-empty]`. |

---

## ⚡ DOM Events

### Listened Events

* `ln-list:set-data` `{ data, total, filtered }`: Hydrates/renders the items in Data-Driven mode.
* `ln-list:set-loading` `{ loading: true|false }`: Toggles the loading dimming overlay class (`.ln-list--loading`).
* `ln-list:page-failed` `{ offset }`: Windowed mode — the coordinator reports the page fetch at `offset` failed.
* `ln-list:request-revalidate`: Windowed mode — asks the cache to revalidate the currently visible page after a local mutation.
* `ln-list:request-invalidate`: Windowed mode — invalidates window cache and resets to page 0.
* `ln-list:request-clear-filters`: Layer 1 command to clear search and active filters.
* `ln-search:change` `{ term }`: SSR mode — filters in-memory records and updates virtual scroll / DOM.
* `ln-filter:change` `{ key, values }`: SSR mode — filters in-memory records by field / data attributes.
* `ln-sort:change` `{ field, direction }`: In Data-Driven mode, triggers cache re-fetch (windowed) or local sort (non-windowed). In SSR mode, sorts in-memory records and updates virtual scroll.

### Emitted Events

* `ln-list:request-data` `{ list, sort, filters, search }`: Requests data query from the Coordinator. When windowed, includes `{ offset, limit, queryGen }`.
* `ln-list:ready` `{ total }`: Fired when initial markup parsing completes.
* `ln-list:rendered` `{ list, total, visible }`: Fired after items have been drawn to DOM.
* `ln-list:filter` `{ term, matched, total }`: Fired in SSR mode when search/filter narrows visible items.
* `ln-list:sorted` `{ field, direction, matched, total }`: Fired when items are sorted.
* `ln-list:item-click` `{ list, id, record }`: Fired when clicking item body (excluding buttons, anchors, inputs).
* `ln-list:item-action` `{ list, id, action, record }`: Fired when clicking `[data-ln-item-action]`.
* `ln-list:select` `{ list, selectedIds, count }`: Fired when selection updates.
* `ln-list:select-all` `{ list, selected: true|false }`: Fired when select-all triggers.
* `ln-list:empty` `{ term, total }`: Fired when the list becomes empty.
* `ln-list:clear-filters` `{ list }`: Fired in Data-Driven mode when filters are cleared.

---

## 🔧 Internals

Source: `js/ln-list/src/ln-list.js`.

### Spacer element matches container semantics

Virtual scroll needs top/bottom spacer elements to preserve scroll height without rendering off-screen rows. If `[data-ln-list-body]` is a `<ul>`/`<ol>`, spacers are `<li class="ln-list__spacer" aria-hidden="true">` to stay HTML5-valid and accessible; any other container gets `<div class="ln-list__spacer" aria-hidden="true">`.

### Slice / Windowed virtualization

When windowed virtualization is enabled (`data-ln-list-window`), `ln-list` operates with slice rendering via `createWindowCache`. Only a sliding window of records is kept resident in the view. When the user scrolls, `ln-list` renders placeholder items for records that are not yet loaded and dispatches `ln-list:request-data` with `{ offset, limit }` to fetch the missing slice from the coordinator.

### `_parseChildren()`

Parses static children inside `[data-ln-list-body]` into `this._data` at mount (excluding existing spacers), extracting `searchText` and structured values via `readValue()` (`data-ln-value`), and measures the first child's height for `this._itemHeight`.
