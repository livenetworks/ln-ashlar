# ln-data-store

A zero-dependency, local-first **Database Cache Store** backed by standard browser `IndexedDB`. It acts as a pure client-side database cache, maintaining records locally, executing high-performance querying in-memory, and applying optimistic mutations directly — a record is a record, with no pending state, snapshots, or rollback machinery.

It possesses no visual interface and is **completely blind to the network** (no fetch, status codes, paths, or URLs). Instead, it communicates strictly via custom DOM events, allowing the parent **Data Coordinator** to orchestrate syncs and mutations.

---

## 📦 Declarative Setup in HTML

```html
<div data-ln-data-store="documents"
     data-ln-data-store-stale="300"
     data-ln-data-store-indexes="status,department,updated_at"
     data-ln-data-store-search-fields="title,owner">
</div>
```

---

## 🌐 Declarative Attributes

| Attribute | Description | Default |
|---|---|---|
| `data-ln-data-store="name"` | Declares the store name. | *Required* |
| `data-ln-data-store-stale="N"` | Seconds before cache is considered stale. Set to `never` or `-1` to disable staleness. | `300` |
| `data-ln-data-store-indexes="…"` | Comma-separated list of IndexedDB index fields. | `""` |
| `data-ln-data-store-search-fields="…"` | Comma-separated list of text-search fields for local query search matching. | `""` |

---

## 🗄️ Dynamic IndexedDB Schema Management

`ln-data-store` registers and operates on a single IndexedDB database named `ln_app_cache`. 

- **Dynamic Schema Discovery:** Upon initialization, the component scans the document for all `[data-ln-data-store]` elements. It collects their store names and index definitions.
- **Auto Upgrade:** If new stores or indexes are declared in the HTML markup, the component closes the active connection, increments the database version, and dynamically creates the missing stores and indexes in `onupgradeneeded`.
- **Memory Fallback:** If the browser does not support IndexedDB, or if database open/upgrade operations fail/are blocked, the component transparently falls back to an in-memory data store.

---

## 🔒 At-Rest AES-GCM Encryption

The store supports local record encryption to secure cached data in IndexedDB:

- **Activation:** Set a storage key by calling `window.lnCore.setStorageKey(key)` or `window.lnDataStore.setStorageKey(key)`. The key is derived using a SHA-256 hash of the input string.
- **Indexable Payload:** Only the data properties of the record are encrypted using `AES-GCM` (using helper methods from `ln-core`). The record's primary identifier `id` is preserved in plain text to allow IndexedDB index lookups and queries.
- **Automatic Decryption:** All queries and retrievals automatically decrypt records if a storage key is active.

---

## 🛠️ JS API (Access via `el.lnDataStore`)

Access the database layer directly via the `lnDataStore` property on the store container element:

```javascript
const storeEl = document.querySelector('[data-ln-data-store="documents"]');
const store = storeEl.lnDataStore;
```

### 1. In-Memory Query Engine

Queries execute against in-memory copies of the IndexedDB records for near-zero latency:

```javascript
const { data, total, filtered } = await store.getAll({
  sort: { field: 'updated_at', direction: 'desc' },
  filters: { status: ['Approved', 'Pending'] },
  search: 'ISO 27001',
  offset: 0,
  limit: 50
});
```

- **Natural Sorting:** Sorting uses `Intl.Collator` configured with `{ numeric: true, sensitivity: 'base' }` for natural alphabetical/numeric ordering. `null` and `undefined` values are correctly sorted to the end of the collection (or the beginning if sorting descending).
- **Filtering:** Filters perform exact string matches against arrays of values.
- **Text Search:** Compares the lowercase query string against the lowercase values of fields declared under `data-ln-data-store-search-fields`.

### 2. Presenters / Decorators

Configure computed virtual fields that are dynamically appended to records when queried:

```javascript
store.setPresenters({
  computed: {
    size_display: record => (record.file_size / 1024).toFixed(1) + ' MB',
    full_name: record => `${record.first_name} ${record.last_name}`
  }
});
```

### 3. Public Methods

| Method | Return Type | Description |
|---|---|---|
| `getAll(options)` | `Promise<Object>` | Retrieves records. Options support `sort` (`{ field, direction }`), `filters` (`{ field: Array }`), `search` (`String`), `offset`, `limit`. Returns `{ data, total, filtered }`. |
| `getById(id)` | `Promise<Object\|null>` | Returns a single record (decorated with presenters) or `null`. |
| `count(filters)` | `Promise<Number>` | Returns the total count of records. If filters are provided, returns the filtered count. |
| `aggregate(field, fn)` | `Promise<Number>` | Performs aggregation. `fn` must be `'count'`, `'sum'`, or `'avg'`. |
| `setPresenters(presenters)` | `void` | Registers presenters (decorators) for computed fields. |
| `applySync(upserted, deleted, syncedAt)` | `Promise<void>` | Feeds synchronization delta updates into the cache. |
| `forceSync()` | `void` | Dispatches `ln-data-store:request-remote-sync` with the current last sync timestamp. |
| `fullReload()` | `Promise<void>` | Clears the IndexedDB store, resets sync metadata, and triggers a sync. |
| `destroy()` | `void` | Cleans up the instance, removes event listeners, and deletes the DOM reference. |

---

## ⚡ DOM Events

### Commands (Listened to by the Store)

All mutations must be routed via DOM events. **Never invoke write methods directly.** The caller is responsible for supplying a `tempId` (e.g. `'_temp_' + crypto.randomUUID()`) when creating records:

```javascript
// Create record optimistically
store.dispatchEvent(new CustomEvent('ln-data-store:request-create', {
  detail: { 
    tempId: '_temp_abc123', 
    data: { title: 'New Document', status: 'Draft' } 
  }
}));

// Update record optimistically
// Note: If data.id is different from the target id, the store performs an atomic id-swap (rekey)
store.dispatchEvent(new CustomEvent('ln-data-store:request-update', {
  detail: { 
    id: '_temp_abc123', 
    data: { id: 42, title: 'Server Confirmed Document' } 
  }
}));

// Delete record optimistically
store.dispatchEvent(new CustomEvent('ln-data-store:request-delete', {
  detail: { id: 42 }
}));

// Bulk delete records optimistically
store.dispatchEvent(new CustomEvent('ln-data-store:request-bulk-delete', {
  detail: { ids: [42, 43, 44] }
}));
```

---

### Notifications (Emitted by the Store)

These events bubble up and can be listened to by coordinators or rendering views (`ln-table` / `ln-list`):

| Event | `e.detail` payload | Description |
|---|---|---|
| `ln-data-store:initialized` | `{ store, hasCache, lastSyncedAt, count }` | Emitted once after IndexedDB connection opens. |
| `ln-data-store:ready` | `{ store, count, source }` | Emitted when data is ready. `source` is `'cache'` (init) or `'server'` (first sync). |
| `ln-data-store:loaded` | `{ store, count }` | Emitted on initial load sync completion (first sync). |
| `ln-data-store:created` | `{ store, record, tempId }` | Emitted after optimistic creation. |
| `ln-data-store:updated` | `{ store, record, previous }` | Emitted after optimistic update or id-swap rekey. |
| `ln-data-store:deleted` | `{ store, id \| ids }` | Emitted after optimistic delete or bulk delete. |
| `ln-data-store:synced` | `{ store, added, deleted, changed }` | Emitted after subsequent delta sync merges. |
| `ln-data-store:destroyed` | `{ store }` | Emitted when the store instance is destroyed. |

### Global System Events

| Event | Target | `e.detail` payload | Description |
|---|---|---|---|
| `ln-data-store:quota-exceeded` | `document` | `{ error }` | Emitted globally on `document` if database storage exceeds browser quotas. |

---

## 🌐 Global API (On `window.lnDataStore`)

| Static Method | Description |
|---|---|
| `window.lnDataStore.clearAll()` | Clears all records and metadata from all stores in the IndexedDB database. |
| `window.lnDataStore.setStorageKey(key)` | Sets the global cryptographic key for record encryption. |
