# ln-store — Client-Side Data Cache Component

> ln-acme component for IndexedDB caching, delta sync, and client-side querying.
> Architecture pattern → see `architecture/data-layer.md`

---

## What This Is

A generic data layer component. It manages IndexedDB stores, syncs with server endpoints, handles optimistic mutations, and exposes data to UI components through CustomEvents and a direct read API.

It does NOT render anything. It does NOT know about tables, forms, or any UI. It is a data pipe.

---

## Registration

```html
<!-- One per resource, anywhere in the page (typically in layout) -->
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300">
</div>

<div data-ln-store="users"
     data-ln-store-endpoint="/api/users"
     data-ln-store-stale="1800">
</div>
```

### Attributes

| Attribute | Required | Description |
|-----------|----------|-------------|
| `data-ln-store` | Yes | Store name (IndexedDB object store name, event namespace) |
| `data-ln-store-endpoint` | Yes | Server API base URL for this resource |
| `data-ln-store-stale` | No | Staleness threshold in seconds (default: 300 = 5 min) |
| `data-ln-store-indexes` | No | Comma-separated list of fields to index: `"status,category,updated_at"` |
| `data-ln-store-search-fields` | No | Comma-separated fields for text search: `"title,description,author_name"` |

---

## IIFE Structure

```javascript
(function() {
    const DOM_SELECTOR = 'data-ln-store';
    const DOM_ATTRIBUTE = 'lnStore';

    if (window[DOM_ATTRIBUTE] !== undefined) return;

    const DB_NAME = 'ln_app_cache';
    const META_STORE = '_meta';
    const SCHEMA_VERSION = '1.0';

    // ... private functions

    window[DOM_ATTRIBUTE] = { init: _initStore };

    _domObserver();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _initializeAll);
    } else {
        _initializeAll();
    }
})();
```

---

## Instance API (Read-Only, on DOM Element)

```javascript
const storeEl = document.querySelector('[data-ln-store="documents"]');

// Queries — synchronous from IndexedDB (returns Promise)
storeEl.lnStore.getAll(options)        // → Promise<Array>
storeEl.lnStore.getById(id)            // → Promise<Object|null>
storeEl.lnStore.count(filters)         // → Promise<Number>
storeEl.lnStore.aggregate(field, fn)   // → Promise<Number> (sum, avg, count)

// State
storeEl.lnStore.isLoaded               // → Boolean (initial load complete)
storeEl.lnStore.isSyncing              // → Boolean (sync in progress)
storeEl.lnStore.lastSyncedAt           // → String|null (ISO timestamp)
storeEl.lnStore.totalCount             // → Number (total records in store)

// Manual triggers
storeEl.lnStore.forceSync()            // → Promise (force delta sync regardless of staleness)
storeEl.lnStore.fullReload()           // → Promise (clear cache + full reload from server)
```

### Query Options

```javascript
storeEl.lnStore.getAll({
    sort: { field: 'title', direction: 'asc' },         // single field sort
    filters: { status: ['approved', 'draft'], category: ['Policy'] },  // AND logic
    search: 'ISO 27001',                                 // text search across search-fields
    offset: 0,                                            // for virtual scroll windowing
    limit: 100                                            // chunk size
})
```

Returns a Promise resolving to:
```javascript
{
    data: [ { id: 42, title: '...', ... }, ... ],
    total: 1247,           // total records (unfiltered)
    filtered: 45,          // records matching current filters + search
    aggregates: {          // if requested
        amount: { sum: 24500, avg: 544.44 }
    }
}
```

---

## CustomEvents — Commands (Request Events)

Mutations go through request events. The coordinator dispatches these.

### Create

```javascript
storeEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
    bubbles: true,
    detail: {
        data: { title: 'New Document', status: 'draft', category: 'Policy' }
    }
}));
```

Flow:
1. Generate temp ID (`_temp_{uuid}`)
2. Insert into IndexedDB with temp ID
3. Emit `ln-store:created` (optimistic — UI updates immediately)
4. POST to server endpoint
5. On success: replace temp ID with server ID, emit `ln-store:confirmed`
6. On error: remove from IndexedDB, emit `ln-store:reverted` with error detail

### Update

```javascript
storeEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
    bubbles: true,
    detail: {
        id: 42,
        data: { title: 'Updated Title', status: 'approved' },
        expected_version: '2025-01-15T10:30:00Z'    // for conflict detection
    }
}));
```

Flow:
1. Save previous version in memory (for revert)
2. Update IndexedDB
3. Emit `ln-store:updated` (optimistic)
4. PUT to server endpoint (include `expected_version`)
5. On success: update with server response (final timestamps), emit `ln-store:confirmed`
6. On 409 conflict: revert IndexedDB, emit `ln-store:conflict` with both versions
7. On other error: revert IndexedDB, emit `ln-store:reverted`

### Delete

```javascript
storeEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
    bubbles: true,
    detail: { id: 42 }
}));
```

Flow:
1. Save record in memory (for revert)
2. Remove from IndexedDB
3. Emit `ln-store:deleted` (optimistic)
4. DELETE to server endpoint
5. On success: emit `ln-store:confirmed`
6. On error: restore in IndexedDB, emit `ln-store:reverted`

### Bulk Delete

```javascript
storeEl.dispatchEvent(new CustomEvent('ln-store:request-bulk-delete', {
    bubbles: true,
    detail: { ids: [42, 43, 44] }
}));
```

---

## CustomEvents — Notifications (Emitted by Store)

UI components and coordinators listen for these.

### Data Events

| Event | When | Detail |
|-------|------|--------|
| `ln-store:loaded` | Initial load complete (first visit) | `{ store, count }` |
| `ln-store:ready` | Data available (from cache or server) | `{ store, count, source: 'cache'\|'server' }` |
| `ln-store:synced` | Delta sync completed | `{ store, added: N, updated: N, deleted: N }` |
| `ln-store:unchanged` | Delta sync found no changes | `{ store }` |

### Mutation Events

| Event | When | Detail |
|-------|------|--------|
| `ln-store:created` | Optimistic create applied | `{ store, record, tempId }` |
| `ln-store:updated` | Optimistic update applied | `{ store, record, previous }` |
| `ln-store:deleted` | Optimistic delete applied | `{ store, id }` |
| `ln-store:confirmed` | Server confirmed mutation | `{ store, record, action }` |
| `ln-store:reverted` | Mutation failed, reverted | `{ store, record, action, error }` |
| `ln-store:conflict` | Update conflict detected | `{ store, local, remote, field_diffs }` |

### Error Events

| Event | When | Detail |
|-------|------|--------|
| `ln-store:error` | Sync or mutation failed | `{ store, action, error, status }` |
| `ln-store:offline` | Server unreachable | `{ store }` |

---

## Sync Lifecycle

### On Component Init

```
_initStore(el):
  1. Open/create IndexedDB database and object store
  2. Read _meta for this store (schema_version, last_synced_at)
  3. Schema version mismatch? → clear store, do full load
  4. Has cached data? → emit ln-store:ready (source: 'cache')
  5. Is stale? → trigger delta sync in background
  6. No cached data? → trigger full load, emit ln-store:loaded when done
```

### On Visibility Change

```
document visibilitychange → visible:
  For each registered store:
    → trigger delta sync (always, regardless of staleness — user was away)
```

### Delta Sync

```
_deltaSync(el):
  1. Set isSyncing = true
  2. GET {endpoint}?since={last_synced_at}
  3. Response: { data: [...], deleted: [...], synced_at: '...' }
  4. Apply to IndexedDB:
     - Upsert each record in data[]
     - Delete each ID in deleted[]
  5. Update _meta.last_synced_at = synced_at
  6. Set isSyncing = false
  7. If changes found: emit ln-store:synced with counts
  8. If no changes: emit ln-store:unchanged
  9. On error: emit ln-store:error (data from IndexedDB is still usable)
```

---

## IndexedDB Schema

### Database

```
Database: ln_app_cache
  ├── _meta                          → schema_version, app_version, per-store timestamps
  ├── documents                      → document records
  ├── users                          → user records
  └── ... (one store per registered resource)
```

### Object Store Creation

On first init or schema upgrade, create stores based on registered `data-ln-store` elements:

```javascript
// Indexes created from data-ln-store-indexes attribute
const indexes = el.getAttribute('data-ln-store-indexes');
// "status,category,updated_at" → create index per field
```

### Meta Store

```javascript
// _meta store, keyed by store name
{
    key: 'documents',
    schema_version: '1.0',
    last_synced_at: '2025-01-15T15:05:00Z',
    record_count: 1247
}
```

---

## Client-Side Query Engine

### Sort

```javascript
// Uses IndexedDB index if available, otherwise in-memory sort
_sort(records, { field: 'title', direction: 'asc' })
```

- If field has an IndexedDB index → use cursor with direction (fast)
- If no index → read all, sort in memory (fine for <10,000 records)

### Filter

```javascript
// AND logic: all filters must match
_filter(records, { status: ['approved', 'draft'], category: ['Policy'] })
```

- Each filter key = field name, value = array of accepted values
- Compound index used if available
- Multiple filters = AND (record must match ALL filters)

### Search

```javascript
// Searches across fields defined in data-ln-store-search-fields
_search(records, 'ISO 27001')
```

- Case-insensitive substring match across configured search fields
- In-memory scan (sufficient for <5,000 records)
- Searches within already-filtered results (filter first, then search)

### Aggregates

```javascript
// Compute aggregates on numeric fields
_aggregate(records, 'amount', 'sum')    // → 24500
_aggregate(records, 'amount', 'avg')    // → 544.44
_aggregate(records, 'id', 'count')      // → 45
```

---

## Configuration

### Via Data Attributes

```html
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300"
     data-ln-store-indexes="status,category,updated_at"
     data-ln-store-search-fields="title,description,author_name">
</div>
```

### Via JavaScript (after init)

```javascript
storeEl.lnStore.configure({
    staleThreshold: 300,
    onConflict: 'notify'    // 'notify' | 'silent' | 'reject'
});
```

---

## Error Handling

| Situation | Behavior |
|-----------|----------|
| Server unreachable (initial load) | Show error state, no cached data available |
| Server unreachable (delta sync) | Silent — cached data is still usable. Emit `ln-store:offline`. |
| Server returns 4xx on mutation | Revert optimistic update, emit `ln-store:reverted` with error |
| Server returns 5xx on mutation | Revert optimistic update, emit `ln-store:reverted` with error |
| Server returns 409 on update | Emit `ln-store:conflict` with both versions |
| IndexedDB full/unavailable | Fall back to in-memory store (Map), warn via console |
| Schema version mismatch | Clear all stores, full reload |

All errors emit events — the coordinator decides how to show them to the user (toast, inline, etc.).

---

## Cleanup

### On Logout

```javascript
// Clear all stores (called by auth coordinator)
window.lnStore.clearAll();    // wipes all IndexedDB stores + _meta
```

### On Destroy

```javascript
storeEl.lnStore.destroy();
  → Remove event listeners
  → Cancel pending sync requests
  → Emit ln-store:destroyed
```

---

## Anti-Patterns

- **Store knowing about UI** — ln-store never opens modals, shows toasts, or manipulates DOM
- **Direct method calls for mutations** — always use request events (coordinator pattern)
- **Storing raw IDs** — server must return display-ready data (resolved names, labels, formatted values)
- **Multiple stores for same resource** — one `data-ln-store` per resource, shared by all UI components on the page
- **Syncing inside UI components** — UI components receive data, they don't fetch it
- **localStorage instead of IndexedDB** — wrong tool (size limits, no indexes, no async)
- **Polling on timer** — sync on mount + visibility is sufficient
- **Temp IDs leaked to server** — temp IDs are client-only, replaced before any server request
- **Swallowing errors** — always emit error events, let coordinator decide what to show
