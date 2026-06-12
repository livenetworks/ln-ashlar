# ln-options

> Consumer-facing documentation. Component source: `js/ln-options/src/ln-options.js`.

`ln-options` populates a `<select>` element with records from an `ln-data-store`, served by `ln-data-coordinator`. It is a pure event client — it never imports or reads the store directly.

---

## Declarative Attribute Contract

| Attribute | Applied To | Description |
|---|---|---|
| `data-ln-options="<storeName>"` | `<select>` | Store name to bind. Must match the coordinator's child store name. |
| `data-ln-options-value="<field>"` | `<select>` | Record field used as `<option value>`. Default: `id`. |
| `data-ln-options-label="<field>"` | `<select>` | Record field for option text. Default: `name`. May be a presenter-computed field. |

---

## Event Architecture

### Dispatched
- `ln-options:request-data` `{ options: storeName }` — fired on init; bubbles to coordinator.

### Listened
- `ln-options:set-data` `{ data }` — coordinator response; component rebuilds options and restores previous selection.

---

## Coordinator Wiring

The coordinator's `_serveOptions` method handles `ln-options:request-data`:
1. Reads `data-ln-options` from the dispatching element.
2. Guards with `_ownsStore(name)` — only serves if the coordinator's child store matches.
3. Calls `store.getAll({})` (all records, no sort/filter/pagination).
4. Dispatches `ln-options:set-data { data }` back on the element.

On every store mutation (`ln-store:ready`, `created`, `updated`, `deleted`, `synced`), the coordinator calls `_refreshAll()` which re-serves all bound options elements.

---

## No Template Needed

`ln-options` creates `<option>` elements via `document.createElement('option')` — native options carry only value and label, so a template would add ceremony for two string assignments. This is the one sanctioned `createElement` case in the library (mirrors ln-table's select-all checkbox creation).

---

## Example

```html
<div data-ln-data-coordinator>
  <div data-ln-data-store="tenants" data-ln-store-endpoint="/api/tenants"></div>
  <div data-ln-api-connector data-ln-api-endpoint="/api/tenants"></div>

  <select data-ln-options="tenants"
          data-ln-options-value="id"
          data-ln-options-label="display_name">
    <option value="">All tenants</option>
  </select>
</div>
```

`display_name` can be a presenter-computed field — the coordinator delivers already-decorated records.
