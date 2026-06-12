# ln-options

Populates a `<select>` element with records from an `ln-data-store` via the `ln-data-coordinator` binder. Opt-in: add `data-ln-options="<storeName>"` to any `<select>` inside (or reachable by) a coordinator subtree.

No `<template>` needed — ln-options writes `<option>` elements directly (value + label only).

---

## Attributes

| Attribute | Element | Description |
|---|---|---|
| `data-ln-options="<storeName>"` | `<select>` | Store name to bind. Must match the coordinator's child store name. |
| `data-ln-options-value="<field>"` | `<select>` | Record field used as `<option value>`. Default: `id`. |
| `data-ln-options-label="<field>"` | `<select>` | Record field used as `<option>` text. Default: `name`. May be a presenter-computed field. |

---

## Events

### Dispatched
- `ln-options:request-data` `{ options: storeName }` — fired on init (bubbles to coordinator).

### Received
- `ln-options:set-data` `{ data }` — coordinator delivers this; component rebuilds options and restores previous selection.

---

## Example

```html
<div data-ln-data-coordinator>
  <div data-ln-data-store="tenants" data-ln-store-endpoint="/api/tenants"></div>
  <div data-ln-api-connector data-ln-api-endpoint="/api/tenants"></div>

  <select data-ln-options="tenants"
          data-ln-options-value="id"
          data-ln-options-label="name">
    <option value="">All tenants</option>
  </select>
</div>
```

The placeholder `<option value="">` is preserved across refreshes. The previous selection is restored if it still exists in the refreshed data.

---

## Notes

- ln-options never imports or reads `ln-data-store` directly — it is a pure event client.
- The coordinator re-serves `ln-options:set-data` on every store mutation (`ln-store:ready`, `created`, `updated`, `deleted`, `synced`).
- `data-ln-options-label` may reference a presenter-computed field (e.g. `full_name`) because the coordinator delivers already-decorated records from `store.getAll({})`.
