# ln-data-coordinator

> Maintainer documentation. Component source: `js/ln-data-coordinator/src/ln-data-coordinator.js`.

`ln-data-coordinator` is the single orchestrator that bridges `ln-data-store` mutations to remote connectors (sync, create, update, delete, bulk-delete) **and** delivers live data to bound view components (tables, lists, selects, stat counters) without any app-side glue code.

---

## Role Summary

- Listens on its subtree (`this.dom`) for `ln-store:request-remote-*` events → delegates to the child connector.
- Listens on `document` for view-binding request events → resolves its own child store → delivers data back to the requesting element.
- Listens on its subtree for store-change events → refreshes all bound view elements automatically.

A page may have multiple coordinators. Each serves only its own child store — isolation is enforced by the `_ownsStore(name)` guard on every document-level handler.

---

## Declarative View Binding

### Binding Attributes

| Attribute | Applied To | Description |
|---|---|---|
| `data-ln-table-store="<storeName>"` | `[data-ln-table]` element | Binds a table to this coordinator's store. |
| `data-ln-list-store="<storeName>"` | `[data-ln-list]` element | Binds a list to this coordinator's store. |
| `data-ln-options="<storeName>"` | `<select>` | Binds a select to the store (see `ln-options`). |
| `data-ln-stat="<storeName>"` | Inline element | Binds a count display to the store (see `ln-stat`). |

`<storeName>` must match the `data-ln-data-store` attribute value of the coordinator's child store element.

### `data-ln-table-filter-options` (declarative filter labels, D3)

Add this JSON attribute to a `<th>` that has a `[data-ln-table-col-filter]` button to supply human-readable labels for raw filter values:

```html
<th data-ln-table-col="status"
    data-ln-table-filter-options='[{"value":"approved","label":"Approved"},{"value":"draft","label":"Draft"}]'>
  Status <button data-ln-table-col-filter …></button>
</th>
```

The coordinator parses these once per request (via `_harvestFilterOptions`) and includes them in `ln-table:set-data`'s `filterOptions` payload. The dropdown shows human labels; `checkbox.value` carries the raw value; the request echoes raw — no app-side translation needed.

Columns without this attribute fall back to auto-accumulate (distinct string values from the data), exactly as before.

---

## Store-Change Refresh

The coordinator listens on `this.dom` for:
- `ln-store:ready`, `ln-store:loaded` — initial data available
- `ln-store:created`, `ln-store:updated`, `ln-store:deleted` — mutations confirmed
- `ln-store:synced` (only when `e.detail.changed`) — delta sync with changes

On any of these, `_refreshAll()` re-queries all bound view elements for this coordinator's store using the last cached query parameters (or defaults).

---

## Presenter / Binder Split

- **Presenters** (`store.setPresenters({computed})`) — registered once per store; computed fields flow through `getAll → set-data` as display-ready values in every record.
- **Binder** (this coordinator) — transports decorated records from `getAll` to the view elements. It does not transform data; it delivers what the store's pipeline produces.

Use `store.setPresenters` for fields like `updated_display`, `size_display`, `status_label`. The binder delivers them without needing to know about them.

---

## Event Flow (zero-JS bound table)

```
page load
  → ln-table (data-ln-table-store="tenants") dispatches
      ln-table:request-data {sort, filters, search}  ── bubbles ──▶ document
  → coordinator _serveData: _ownsStore("tenants")? yes
      store not loaded → dispatch ln-table:set-loading {loading:true}; cache query; wait
  → ln-data-store finishes sync → dispatches ln-store:ready ── bubbles ──▶ coordinator.dom
  → _refreshAll: getAll(cached query) + _harvestFilterOptions
      → dispatch ln-table:set-data {data, total, filtered, filterOptions}
  → ln-table renders rows + filter dropdown shows labels

user picks filter value
  → ln-table dispatches ln-table:request-data {filters:{status:['approved']}}
  → coordinator: store loaded → getAll({filters}) → ln-table:set-data → re-render
```

---

## `_ownsStore(name)` Guard

```js
_component.prototype._ownsStore = function (name) {
    const children = this.findChildren();
    return !!(children.store && children.store._name === name && name);
};
```

Every document-level handler calls this first. A coordinator only responds to requests whose store name matches its own child store. Multiple coordinators on one page coexist cleanly.

---

## Backward Compatibility

- Coordinators with no bound elements (`data-ln-table-store` etc.) behave exactly as before — the new document listeners fire but find no matching binding attribute and return immediately.
- The existing `ln-store:request-remote-*` mutation handling is unchanged.
- `store-usecase.html`'s hand-wired section has no coordinator — untouched.
