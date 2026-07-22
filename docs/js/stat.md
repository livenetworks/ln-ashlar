# ln-stat

> Consumer-facing documentation. Component source: `js/ln-stat/src/ln-stat.js`.

`ln-stat` displays a live count from an `ln-data-store`, served by `ln-data-coordinator`. Updates automatically on every store mutation. Pure event client — never imports or reads the store directly.

---

## Declarative Attribute Contract

| Attribute | Applied To | Description |
|---|---|---|
| `data-ln-stat="<storeName>"` | Any inline element | Store name to bind. |
| `data-ln-stat-filter="<field>:<value>"` | Same element | Optional single-field filter. Format: `field:value`. Passed as `{ [field]: [value] }` to `store.count()`. |

---

## Event Architecture

### Dispatched
- `ln-stat:request-count` `{ stat: storeName, filters }` — fired on init; bubbles to coordinator.

### Listened
- `ln-stat:set-count` `{ count }` — coordinator response; component sets `textContent` and removes `is-loading` class.

---

## Coordinator Wiring

The coordinator's `_serveStat` method handles `ln-stat:request-count`:
1. Reads `data-ln-stat` from the dispatching element.
2. Guards with `_ownsStore(name)`.
3. Calls `store.count(filters)` — `filters` comes from `e.detail.filters`.
4. Dispatches `ln-stat:set-count { count }` back on the element.

On store mutations, `_refreshAll()` re-parses `data-ln-stat-filter` from each stat element's attribute and re-calls `store.count()`.

---

## Example

```html
<div data-ln-data-coordinator>
  <div data-ln-data-store="packages"></div>
  <div data-ln-api-connector data-ln-api-endpoint="/api/packages"></div>

  <p>
    <strong data-ln-stat="packages"></strong> total packages,
    <strong data-ln-stat="packages"
            data-ln-stat-filter="active:true"
            class="is-loading"></strong> active
  </p>
</div>
```

The `is-loading` class is removed on first delivery. v1 supports one `field:value` pair per element; for complex multi-field counts, listen to `ln-data-store:ready` + `ln-data-store:synced` and call `store.count()` directly.
