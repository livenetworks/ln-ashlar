# ln-store

> Coordinator/store for cached, synced server data. Caches in
> IndexedDB, syncs via delta protocol, handles optimistic mutations.
> Renders nothing — UI components consume data via its API and CustomEvents.

`data-ln-store` on a `<div>` (one per resource) is the contract. The
`window.lnStore` API is a thin convenience layer for manual init and
global operations.

## Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-ln-store` | yes | Store name (IndexedDB object store name, event namespace) |
| `data-ln-store-endpoint` | yes | Server API base URL for this resource |
| `data-ln-store-stale` | no | Staleness threshold in seconds (default: 300). `"0"` = always stale (syncs on every mount). `"-1"` or `"never"` = never auto-sync (only `forceSync()`) |
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
| `ln-store:synced` | Delta sync complete | `{ store, added, deleted, changed: bool }` |

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
| `ln-store:quota-exceeded` | IndexedDB write quota exceeded | `{ error }` |
| `ln-store:destroyed` | Store instance destroyed | `{ store }` |

> `ln-store:quota-exceeded` bubbles from `document` (it can fire
> before any store instance exists). All other events are dispatched
> on the store element.

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
window.lnStore.init(el)     // Manual init (MutationObserver handles dynamic DOM automatically)
```

## Dependencies

- IndexedDB (browser built-in)
- Fetch API (browser built-in)
- `ln-core` — `registerComponent`, `dispatch`

## HTML Structure

```html
<!-- One per resource, anywhere in the page -->
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300"
     data-ln-store-indexes="status,category,updated_at"
     data-ln-store-search-fields="title,description,author_name">
</div>
```

## Examples

### Coordinator wiring

```javascript
const storeEl = document.querySelector('[data-ln-store="documents"]');

// Read after data is ready
storeEl.addEventListener('ln-store:ready', async () => {
	const { data } = await storeEl.lnStore.getAll({
		sort: { field: 'updated_at', direction: 'desc' },
		limit: 50
	});
	renderTable(data);
});

// Mutate via request event (never call methods directly)
saveBtn.addEventListener('click', () => {
	storeEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
		detail: { id: 42, data: { title: 'New' }, expected_version: 3 }
	}));
});

// React to confirmed / reverted / conflict
storeEl.addEventListener('ln-store:reverted', (e) => {
	showToast(`Save failed: ${e.detail.error}`);
});
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

The store treats records as opaque except for `id` (the keyPath).
Conflict detection on update uses `expected_version` if the
coordinator passes it in the request `detail`.

## Lifecycle

See [docs/js/store.md](../../docs/js/store.md#sync-lifecycle) for the
full sync + optimistic mutation flow (init, visibility-change sync,
delta sync, optimistic create/update/delete).
