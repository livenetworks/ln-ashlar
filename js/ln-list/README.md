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
Opted-in by adding the `data-ln-list-source` attribute. It clones and renders the specified `<template>`:

```html
<label class="search">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <input type="search" placeholder="Search..." data-ln-search-for="documents-grid" data-ln-search-debounce="0">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</label>

<section id="documents-grid" 
         data-ln-list="documents" 
         data-ln-list-source="documents" 
         data-ln-search=""
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
| `data-ln-list-source` | Root wrapper | Opt-in indicator for Data-Driven Mode. |
| `data-ln-list-selectable` | Root wrapper | Enables checkbox-based item selections. |
| ~~`data-ln-list-window`~~ | Root wrapper | **Removed.** Windowed residency is now configured on the store via `data-ln-data-store-window`. |

---

## ⚡ DOM Events

### Listened Events

* `ln-list:set-data` `{ data, total, filtered }`: Hydrates/renders the items. If `{ offset }` is supplied, it is treated as a slice update of size `data.length` at the given offset within the total records count.
* `ln-list:set-loading` `{ loading: true|false }`: Toggles the loading dimming overlay class (`.ln-list--loading`).
* `ln-list:page-failed` `{ offset }`: Windowed mode — the coordinator reports the page fetch at `offset` failed. Releases it from the cache's in-flight set; no auto-retry, the next `ensure()` requests it again.
* `ln-list:request-revalidate`: Windowed mode — the coordinator asks the cache to revalidate the currently visible page after a local mutation. Stale rows stay visible, no jump to page 0.
* `ln-sort:change` `{ field, column, direction }`: Sets `currentSort` and re-sorts (data-driven only). Ignored when `field` is `null` (index-only events have nothing to key a record by).

### Emitted Events

* `ln-list:request-data` `{ list, sort }`: Requests data query from the Coordinator. When partially rendered (windowed residency on the store), it includes `{ offset, limit }` parameters to request missing slices.
* `ln-list:ready` `{ total }`: Fired when initial markup parsing completes.
* `ln-list:rendered` `{ list, total, visible }`: Fired after items have been drawn to DOM.
* `ln-list:item-click` `{ list, id, record }`: Fired when clicking item body (excluding buttons, anchors, inputs).
* `ln-list:item-action` `{ list, id, action, record }`: Fired when clicking `[data-ln-item-action]`.
* `ln-list:select` `{ list, selectedIds, count }`: Fired when selection updates.
* `ln-list:select-all` `{ list, selected: true|false }`: Fired when select-all triggers.

---

## 🔧 Internals

Source: `js/ln-list/src/ln-list.js`.

### Spacer element matches container semantics

Virtual scroll needs top/bottom spacer elements to preserve scroll height without rendering off-screen rows. If `[data-ln-list-body]` is a `<ul>`/`<ol>`, spacers are `<li class="ln-list__spacer">` to stay HTML5-valid; any other container gets `<div class="ln-list__spacer">`.

### Slice / Windowed virtualization

When windowed residency is enabled on the store, `ln-list` operates with slice rendering. Only a single page/slice of records is kept resident in the view at any time. When the user scrolls, `ln-list` renders placeholder items for records that are not yet loaded and dispatches `ln-list:request-data` with `{ offset, limit }` to fetch the missing slice from the coordinator.

### `_parseChildren()`

Parses static children inside `[data-ln-list-body]` into `this._data` at mount (excluding existing spacers), and measures the first child's height for `this._itemHeight`.

### Sort (`ln-sort:change`)

Data-driven only — the SSR branch has no sort logic. `field === null` events (index-only, from an
`ln-sort` instance authored without `data-ln-sort-field`) are ignored; `ln-list` records are
field-keyed, not positional, so there is nothing to sort by without a field name. On a matching
event: `preventDefault()`, `currentSort = { field, direction }` (or `null` on `direction: 'none'`),
then mirrors `ln-table`'s own data-driven sort handling exactly — windowed lists call
`_requestData()` (cache invalidate + re-fetch, same scheme as `ln-table`'s windowed
`_requestData()`); non-windowed lists re-sort the already-fetched in-memory data directly
(`_applyFilterAndSort()` + `_render()`, no server round-trip).
