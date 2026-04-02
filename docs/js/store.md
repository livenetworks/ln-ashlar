# Store

Generic IndexedDB data layer — caches server data locally, syncs via delta protocol, handles optimistic mutations. It renders NOTHING. UI components consume data through its API and CustomEvents. File: `js/ln-store/ln-store.js`.

## HTML

```html
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300"
     data-ln-store-indexes="status,category,updated_at"
     data-ln-store-search-fields="title,description,author_name">
</div>
```

One element per resource, anywhere in the page (typically in layout). Multiple UI components share the same store.

## Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-ln-store` | yes | Store name (IndexedDB object store name, event namespace) |
| `data-ln-store-endpoint` | yes | Server API base URL for this resource |
| `data-ln-store-stale` | no | Staleness threshold in seconds (default: 300 = 5 min) |
| `data-ln-store-indexes` | no | Comma-separated fields to index: `"status,category,updated_at"` |
| `data-ln-store-search-fields` | no | Comma-separated fields for text search: `"title,description,author_name"` |

## Events — Commands (dispatched TO the store)

Mutations go through request events. The coordinator dispatches these on the store element.

| Event | `detail` | Description |
|-------|----------|-------------|
| `ln-store:request-create` | `{ data }` | Create a new record (optimistic with temp ID) |
| `ln-store:request-update` | `{ id, data, expected_version }` | Update a record (optimistic, conflict detection via `expected_version`) |
| `ln-store:request-delete` | `{ id }` | Delete a record (optimistic) |
| `ln-store:request-bulk-delete` | `{ ids }` | Delete multiple records (optimistic) |

## Events — Notifications (emitted BY the store)

### Data Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-store:ready` | Data available (cache or server) | `{ store, count, source: 'cache'\|'server' }` |
| `ln-store:loaded` | Initial full load complete | `{ store, count }` |
| `ln-store:synced` | Delta sync found changes | `{ store, added, updated, deleted }` |
| `ln-store:unchanged` | Delta sync found no changes | `{ store }` |

### Mutation Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-store:created` | Optimistic create applied | `{ store, record, tempId }` |
| `ln-store:updated` | Optimistic update applied | `{ store, record, previous }` |
| `ln-store:deleted` | Optimistic delete applied | `{ store, id }` or `{ store, ids }` |
| `ln-store:confirmed` | Server confirmed mutation | `{ store, record, action }` |
| `ln-store:reverted` | Mutation failed, reverted | `{ store, record, action, error }` |
| `ln-store:conflict` | Update conflict (409) | `{ store, local, remote, field_diffs }` |

### Error Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-store:error` | Initial load failed (no cache) | `{ store, action, error, status }` |
| `ln-store:offline` | Server unreachable during sync | `{ store }` |
| `ln-store:destroyed` | Store instance destroyed | `{ store }` |

## Sync Lifecycle

```
Init:
  1. Open IndexedDB → read _meta
  2. Schema mismatch? → clear, full load
  3. Has cache? → emit ready (source: 'cache'), delta sync if stale
  4. No cache? → full load → emit loaded, ready (source: 'server')

Visibility change (tab returns):
  → delta sync all stores (always, regardless of staleness)

Delta sync:
  1. GET {endpoint}?since={last_synced_at}
  2. Upsert data[], delete deleted[]
  3. Emit synced (if changes) or unchanged
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

## API (instance on DOM element)

```javascript
const storeEl = document.querySelector('[data-ln-store="documents"]');

// Queries (all return Promise)
storeEl.lnStore.getAll(options)        // → { data, total, filtered }
storeEl.lnStore.getById(id)            // → Object|null
storeEl.lnStore.count(filters)         // → Number
storeEl.lnStore.aggregate(field, fn)   // → Number (sum, avg, count)

// State
storeEl.lnStore.isLoaded               // Boolean
storeEl.lnStore.isSyncing              // Boolean
storeEl.lnStore.lastSyncedAt           // Number|null (Unix timestamp)
storeEl.lnStore.totalCount             // Number

// Manual triggers
storeEl.lnStore.forceSync()            // → Promise (delta sync)
storeEl.lnStore.fullReload()           // → Promise (clear cache + full reload)
storeEl.lnStore.destroy()              // Remove listeners, cancel pending fetches
```

### Query Options

```javascript
storeEl.lnStore.getAll({
    sort: { field: 'title', direction: 'asc' },
    filters: { status: ['approved', 'draft'], category: ['Policy'] },
    search: 'ISO 27001',
    offset: 0,
    limit: 100
})
```

### Global

```javascript
window.lnStore.clearAll()   // Wipe all IndexedDB stores + meta (for logout)
window.lnStore.init(el)     // Manual init
```

## Server Response Format

### Full load / Delta sync

```json
{
    "data": [{ "id": 42, "title": "...", "updated_at": 1736952600 }],
    "deleted": [17, 23],
    "synced_at": 1736953500
}
```

- `data` — records created or updated (full load: all records, delta: only changed)
- `deleted` — IDs removed since last sync (delta only)
- `synced_at` — server timestamp, becomes next `?since=` value

## Error Handling

| Situation | Behavior |
|-----------|----------|
| Server unreachable (initial load) | Emit `ln-store:error`, no cached data |
| Server unreachable (delta sync) | Emit `ln-store:offline`, cached data still usable |
| Server 4xx/5xx on mutation | Revert optimistic update, emit `ln-store:reverted` |
| Server 409 on update | Revert, emit `ln-store:conflict` with both versions |
| IndexedDB unavailable | Fall back to in-memory, warn via console |
| Schema version mismatch | Clear all stores, full reload |

## Dependencies

- IndexedDB (browser built-in)
- Fetch API (browser built-in)
- `ln-core` — `dispatch`, `findElements`
