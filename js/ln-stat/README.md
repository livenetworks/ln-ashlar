# ln-stat

Displays a live count from an `ln-data-store` via the `ln-data-coordinator` binder. Updates automatically on every store mutation. Opt-in: add `data-ln-stat="<storeName>"` to any inline element.

---

## Attributes

| Attribute | Element | Description |
|---|---|---|
| `data-ln-stat="<storeName>"` | Any inline element | Store name to bind. |
| `data-ln-stat-filter="<field>:<value>"` | Same element | Optional single-field filter. Format: `field:value`. The value is String-matched against the store's `_filter` (treated as an array `[value]`). Multi-field filters are out of scope for v1. |

---

## Events

### Dispatched
- `ln-stat:request-count` `{ stat: storeName, filters }` — fired on init (bubbles to coordinator).

### Received
- `ln-stat:set-count` `{ count }` — coordinator delivers this; component sets `textContent` and removes `is-loading` class.

---

## Example

```html
<div data-ln-data-coordinator>
  <div data-ln-data-store="tenants" data-ln-store-endpoint="/api/tenants"></div>
  <div data-ln-api-connector data-ln-api-endpoint="/api/tenants"></div>

  <!-- Total count -->
  <strong data-ln-stat="tenants"></strong> tenants

  <!-- Filtered count -->
  <strong data-ln-stat="tenants" data-ln-stat-filter="active:true" class="is-loading"></strong> active
</div>
```

The `is-loading` class is removed on first delivery — add it to show a loading placeholder.

---

## Notes

- ln-stat never imports or reads `ln-data-store` directly — it is a pure event client.
- The coordinator re-serves `ln-stat:set-count` on every store mutation.
- `data-ln-stat-filter` supports one `field:value` pair. The value is passed as `[value]` (array) to `store.count(filters)`.
