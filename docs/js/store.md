# ln-store — architecture

> Internal architecture: IndexedDB layout, sync lifecycle, optimistic
> mutation flow, error / state machine. For consumer docs (attributes,
> events, API), see [README](../../js/ln-store/README.md).

Source: `js/ln-store/ln-store.js`

## HTML

```html
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300"
     data-ln-store-indexes="status,category,updated_at"
     data-ln-store-search-fields="title,description,author_name">
</div>
```

One per resource at layout level. Multiple UI components consume the
same store via events.

## Sync Lifecycle

```
Init:
  1. Open IndexedDB → read _meta
  2. Schema mismatch? → clear, full load
  3. Has cache? → emit ready (source: 'cache'), delta sync if stale
  4. No cache? → full load → emit loaded, ready (source: 'server')

Visibility change (tab returns):
  → delta sync all stores if stale

Delta sync:
  1. GET {endpoint}?since={last_synced_at}
  2. Upsert data[], delete deleted[]
  3. Emit synced
```

## Optimistic Mutation Flow

```
Create:
  1. Insert with temp ID (_temp_{uuid}) → emit created
  2. POST to server
  3. Success: replace temp → emit confirmed
  4. Error: remove from IDB → emit reverted

Update:
  1. Save previous, update IDB → emit updated
  2. PUT to server (with expected_version)
  3. Success: update with server response → emit confirmed
  4. 409: revert IDB → emit conflict
  5. Other error: revert IDB → emit reverted

Delete:
  1. Save record, remove from IDB → emit deleted
  2. DELETE to server
  3. Success: emit confirmed
  4. Error: restore in IDB → emit reverted
```

## State

### Per-instance (on `storeEl.lnStore`)

| Field | Type | Purpose |
|-------|------|---------|
| `isLoaded` | Boolean | Cache populated (from IDB or full load) |
| `isSyncing` | Boolean | A delta sync or full load is in flight |
| `lastSyncedAt` | Number\|null | Unix ts of last successful sync (`?since=` value) |
| `totalCount` | Number | Last-known record count (cached in `_meta`) |
| `_abortController` | AbortController\|null | Cancels pending fetch on `destroy()` |
| `_handlers` | Object\|null | Stored references for `removeEventListener` on destroy |

### Module-level

| Field | Purpose |
|-------|---------|
| `_db` | Open IDBDatabase connection (one per page) |
| `_dbReady` | Promise — resolves when `_db` is ready or null (no IDB) |
| `_stores` | `{ name: instance }` — global registry, drives visibility-change sync |
| `_visibilityHandler` | Listener attached only while `_stores` non-empty |

The page holds **one** IDBDatabase connection shared by all store
instances (multiple `data-ln-store` elements). Stores share the
connection via `_getDb()`; transactions are scoped per store name.

## Event surface

See [README §Events — Commands](../../js/ln-store/README.md#events--commands-dispatched-to-the-store)
and [§Events — Notifications](../../js/ln-store/README.md#events--notifications-emitted-by-the-store)
for the full table of dispatched events. This document covers WHEN
each event fires within the lifecycle / mutation flow above.

## API surface

See [README §API](../../js/ln-store/README.md#api-instance-on-dom-element)
for the full API + query options + global methods.

## Error Handling

| Situation | Behavior |
|-----------|----------|
| Server unreachable (initial load) | Emit `ln-store:error`, no cached data |
| Server unreachable (delta sync) | Emit `ln-store:offline`, cached data still usable |
| Server 4xx/5xx on mutation | Revert optimistic update, emit `ln-store:reverted` |
| Server 409 on update | Revert, emit `ln-store:conflict` with both versions |
| IndexedDB quota exceeded | Dispatch `ln-store:quota-exceeded` on `document` (write fails, in-memory fallback) |
| IndexedDB unavailable | Fall back to in-memory, warn via console |
| Schema version mismatch | Clear all stores, full reload |

## DOM mutations

The store renders nothing. The only DOM-side effects are:

- attaches `request-*` listeners on the store element
- attaches one `visibilitychange` listener on `document` (shared
  across all store instances; removed when last store is destroyed)
- writes `dom.lnStore = instance` on the store element
- dispatches `ln-store:*` events on the store element
  (`quota-exceeded` dispatches on `document`)
