# ln-data-coordinator

> Maintainer documentation. Component source: `js/ln-data-coordinator/src/ln-data-coordinator.js`.

`ln-data-coordinator` is the single orchestrator that bridges `ln-data-store` mutations to remote connectors (sync, create, update, delete, bulk-delete) **and** delivers live data to bound view components (tables, lists, selects, stat counters) without any app-side glue code.

---

## Role Summary

- Listens on its subtree (`this.dom`) for `ln-data-coordinator:request-create/update/delete/bulk-delete` (and `ln-form:submit-record` on `document`) → fans out in parallel to the local store AND the remote connector/queue. Listens for `ln-store:request-remote-sync` → delegates to the child connector. See [`js/ln-data-coordinator/README.md`](../../js/ln-data-coordinator/README.md) for the full write pipeline (this document covers the VIEW-BINDING role only).
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

### ~~`data-ln-table-filter-options`~~ — Removed

This attribute and the `_harvestFilterOptions` / auto-accumulate path that read it have been removed. Filter options are now static authored markup inside `[data-ln-popover]` blocks — the domain owner (backend enum or lookup) determines the option list, not the dataset.

See [docs/architecture/reference.md#column-filter-architecture](../architecture/reference.md#column-filter-architecture) for the current canonical markup pattern.

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
  → _refreshAll: getAll(cached query)
      → dispatch ln-table:set-data {data, total, filtered}
  → ln-table renders rows

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
- The write-pipeline fan-out (parallel local + remote dispatch, no pending/confirm/revert machinery) is documented separately in `js/ln-data-coordinator/README.md` — out of scope for this view-binding document.
- `store-usecase.html`'s hand-wired section has no coordinator — untouched.
