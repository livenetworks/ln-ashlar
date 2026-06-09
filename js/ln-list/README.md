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

## ⚡ DOM Events

### Listened Events

* `ln-list:set-data` `{ data, total, filtered }`: Hydrates/renders the items.
* `ln-list:set-loading` `{ loading: true|false }`: Toggles the loading dimming overlay class (`.ln-list--loading`).
* `ln-search:change` `{ term }`: Captures search query from `data-ln-search` inputs.

### Emitted Events

* `ln-list:request-data` `{ list, search, sort, filters }`: Requests data query from the Coordinator.
* `ln-list:ready` `{ total }`: Fired when initial markup parsing completes.
* `ln-list:rendered` `{ list, total, visible }`: Fired after items have been drawn to DOM.
* `ln-list:item-click` `{ list, id, record }`: Fired when clicking item body (excluding buttons, anchors, inputs).
* `ln-list:item-action` `{ list, id, action, record }`: Fired when clicking `[data-ln-item-action]`.
* `ln-list:select` `{ list, selectedIds, count }`: Fired when selection updates.
* `ln-list:select-all` `{ list, selected: true|false }`: Fired when select-all triggers.
