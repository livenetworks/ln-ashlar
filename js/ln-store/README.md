# ln-store

A zero-dependency, local-first **Optimistic Sync Store** backed by standard browser `IndexedDB`. It functions as a data-access layer that caches server payloads locally, performs offline-safe write mutations instantly (optimistic state), and reconciles changes via background sync delta loops.

It possesses no visual interface; instead, it coordinates data states through declarative API queries and CustomEvents.

---

## 🧭 Philosophy & Architecture

1. **Local-First Database:** The local IndexedDB is the single source of truth for the UI. Views query local store states instantly without awaiting HTTP responses.
2. **Optimistic Mutations:** Creating, updating, or deleting records writes immediately to the local cache and fires optimistic events (e.g. `ln-store:updated`) so that list views refresh instantly.
3. **Delta Sync Protocol:** Syncing is incremental. The outbox pushes out mutations with automatic backoffs, while the inbox fetches only modified server rows using a `?since=timestamp` query.
4. **Version Conflict Resolution:** Updates gate validation using version-locking (`expected_version`). Standard HTTP 409 status codes trigger conflict events for custom UI merges.

---

## 📦 Minimal Blueprint

```html
<!-- One per resource, declared anywhere in the page -->
<div data-ln-store="documents"
     data-ln-store-endpoint="/api/documents"
     data-ln-store-stale="300"
     data-ln-store-indexes="status,department,updated_at"
     data-ln-store-search-fields="title,owner">
</div>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-store` | `<div>` | Store namespace and target IndexedDB table name. |
| `data-ln-store-endpoint` | `<div>` | Base server API endpoint (supports GET, POST, PUT, DELETE). |
| `data-ln-store-stale` | `<div>` | Staleness limit in seconds (default `300`). `"0"` always syncs. |
| `data-ln-store-indexes` | `<div>` | Comma-separated fields to index for high-performance queries. |

### JS API (On the element)

Access the database layer directly via the `lnStore` property on the store container:

```javascript
const store = document.querySelector('[data-ln-store="documents"]');

// 1. Queries (returns Promise)
const { data, total, filtered } = await store.lnStore.getAll({
  sort: { field: 'updated_at', direction: 'desc' },
  filters: { status: ['Approved'] },
  search: 'ISO 27001',
  limit: 50
});

const doc = await store.lnStore.getById(42);

// 2. States
const loaded = store.lnStore.isLoaded;   // Boolean
const syncing = store.lnStore.isSyncing; // Boolean

// 3. Sync Triggers
store.lnStore.forceSync();  // Initiates delta synchronization
store.lnStore.fullReload(); // Purges cache and runs fresh pull
```

---

## ⚡ DOM Events

### Commands (Dispatched TO the store)

*Never invoke write methods directly.* Route all mutations through DOM commands:

```javascript
// Create optimistically
store.dispatchEvent(new CustomEvent('ln-store:request-create', {
  detail: { data: { title: 'New Document', status: 'Draft' } }
}));

// Update with version locks
store.dispatchEvent(new CustomEvent('ln-store:request-update', {
  detail: { id: 42, data: { title: 'Updated title' }, expected_version: 3 }
}));
```

### Notifications (Emitted BY the store)

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-store:ready` | `{ store, count, source }` | Cache loaded (`cache`) or delta sync finished (`server`). |
| `ln-store:created` | `{ store, record, tempId }` | Dispatched instantly on optimistic create. |
| `ln-store:updated` | `{ store, record, previous }` | Dispatched instantly on optimistic update. |
| `ln-store:confirmed` | `{ store, record, action }` | Server verified mutation; outbox item cleared. |
| `ln-store:reverted` | `{ store, record, action, error }` | Server mutation failed; UI rolled back. |
| `ln-store:conflict` | `{ store, local, remote }` | Server returned 409 conflict; triggers data-merge flow. |

---

## ⚠️ Common Pitfalls

- **Bypassing the Optimistic Event Loop:** Modifying local arrays in memory directly avoids saving changes to IndexedDB and leaves background outbox queues empty. Always dispatch `ln-store:request-*` events.
- **Nameless Store Identifiers:** `data-ln-store` must have a value matching a unique table name, or the database constructor will fail to initialize.
- **Skipping Server Delta Handlers:** Server endpoints must support the delta structure: returning lists under `"data"`, soft deletes under `"deleted"`, and the next query stamp under `"synced_at"`.
