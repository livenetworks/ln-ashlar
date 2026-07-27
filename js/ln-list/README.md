# ln-list

A unified, structure-agnostic, and local-first **Data Presenter Component** designed to render datasets in list, card, section, or grid layouts. It connects to `ln-data-store` via CustomEvents using the **Coordinator Pattern**, supporting client-side filtering, sorting, searching, and high-performance **Virtual Scrolling** for large datasets.

---

## 📦 Declarative Setup in HTML

### 1. Simple SSR List
For a server-rendered list where the backend outputs `<li>` elements directly:

```html
<form role="search" onsubmit="return false;">
    <input type="search" data-ln-search="documents-list" placeholder="Search...">
</form>

<ul id="documents-list" data-ln-list="documents">
    <li data-ln-item-id="1">Document A</li>
    <li data-ln-item-id="2">Document B</li>
</ul>
```

### 2. Data-Driven Grid List (with Virtual Scroll)
Opted-in by adding the `data-ln-list-source` attribute. It clones and renders the specified `<template>`:

```html
<form role="search" onsubmit="return false;">
    <input type="search" data-ln-search="documents-grid" placeholder="Search...">
</form>

<section id="documents-grid" 
         data-ln-list="documents" 
         data-ln-list-source="documents" 
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
| `data-ln-list-window="N"` | Root wrapper | Opt-in server-side sliding-window virtualization. `N` sets the resident-item cap (default 1000). Requires Data-Driven Mode. Observable: add/remove toggles windowed mode ON/OFF live; changing `N` while windowed reconfigures the live cache. `data-ln-list-window-page`, `data-ln-list-window-threshold`, and `data-ln-list-count` are likewise observable. |

---

## ⚡ DOM Events

### Listened Events

* `ln-list:set-data` `{ data, total, filtered }`: Hydrates/renders the items. Windowed mode expects `{ offset, queryGen }` echoed back — routed into the internal window cache.
* `ln-list:set-loading` `{ loading: true|false }`: Toggles the loading dimming overlay class (`.ln-list--loading`).
* `ln-search:change` `{ term }`: Captures search query from `data-ln-search` inputs.

### Emitted Events

* `ln-list:request-data` `{ list, search, sort, filters }`: Requests data query from the Coordinator. Windowed mode (`data-ln-list-window`) adds `{ offset, limit, queryGen }`. Disabling windowed mode live issues a fresh full `ln-list:request-data` (no `offset`/`limit`) to repopulate the complete dataset.
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

Virtual scroll (both plain and windowed) needs top/bottom spacer elements to preserve scroll height without rendering off-screen rows. If `[data-ln-list-body]` is a `<ul>`/`<ol>`, spacers are `<li class="ln-list__spacer">` to stay HTML5-valid; any other container gets `<div class="ln-list__spacer">`.

### `_renderVirtual()` vs `_renderWindowed()`

Both compute the visible `start`/`end` index range from the measured first-child height and the nearest scrollable ancestor's viewport, then mount spacers and clone the row template for the visible slice via `fillTemplate`/`fill`. They differ only in row source: `_renderVirtual()` reads `this._data[i]` (the full parsed/fetched dataset); `_renderWindowed()` reads `this._cache.get(i)` (the resident sliding window) and renders a blank placeholder spacer — no shimmer — for indices outside the cache, calling `this._cache.ensure(startRow, endRow)` every pass to debounce-fetch missing rows.

### Windowed mode (`data-ln-list-window="N"`)

Owns an `ln-core.createWindowCache` instance (`N` = resident cap, default 1000) instead of the full dataset. `ln-list:request-data` gains `{offset, limit, queryGen}`; `ln-list:set-data` echoes `{offset, queryGen}` back into `cache.ingest()`. Select-all is hidden under `data-ln-list-selectable` + windowed mode together — a windowed list can't select rows it hasn't fetched.

Every windowing attribute is live-observable, no re-init required: `data-ln-list-window-page`/`-threshold`/`data-ln-list-count` reconfigure the cache via `configure()`/`setGrandTotal()`. Adding `data-ln-list-window` to an already-initialized, non-windowed, data-driven list seeds the cache from resident items and enables windowing live. Removing it destroys the cache and issues one full (no `offset`/`limit`) `ln-list:request-data` to repopulate before rendering non-windowed again.

### `_parseChildren()`

Parses static children inside `[data-ln-list-body]` into `this._data` at mount (excluding existing spacers), and measures the first child's height for `this._itemHeight`.
