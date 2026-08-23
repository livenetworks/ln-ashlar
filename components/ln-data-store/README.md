# ln-data-store

A zero-dependency, local-first **Database Cache Store** backed by standard browser `IndexedDB`. It acts as a pure client-side database cache, maintaining records locally, executing high-performance querying in-memory, and applying optimistic mutations directly — a record is a record, with no pending state, snapshots, or rollback machinery.

It possesses no visual interface and is **completely blind to the network** (no fetch, status codes, paths, or URLs). Instead, it communicates strictly via custom DOM events, allowing the parent **Data Coordinator** to orchestrate syncs and mutations.

---

## 📦 Declarative Setup in HTML

```html
<ul id="documents"
    data-ln-data-store
    data-ln-data-store-stale="300"
    data-ln-data-store-indexes="status,department,updated_at"
    data-ln-data-store-search-fields="title,owner"
    hidden>
</ul>
```

---

## 🌐 Declarative Attributes

| Attribute | Description | Default |
|---|---|---|
| `id="name"` | Unique identifier of the store (the store name). | *Required* |
| `data-ln-data-store` | Marker attribute to declare the component. | *Required* |
| `data-ln-data-store-stale="N"` | Seconds before cache is considered stale. Set to `never` or `-1` to disable staleness. | `300` |
| `data-ln-data-store-indexes="…"` | Comma-separated list of IndexedDB index fields. | `""` |
| `data-ln-data-store-search-fields="…"` | Comma-separated list of text-search fields for local query search matching. | `""` |
| `data-ln-data-store-window="N"` | Enables windowed residency mode. Caps how many records stay resident — both the LRU position index and the records held in IndexedDB. | *Disabled* |
| `data-ln-data-store-window-page="N"` | Page size of slices requested from the server. | `200` |
| `data-ln-data-store-no-local-query` | Leave queries to the server: the store stops answering reads from its own records. Read live, so it can be flipped per situation. | *Absent* |

---

## 🗄️ Dynamic IndexedDB Schema Management

`ln-data-store` registers and operates on a single IndexedDB database named `ln_app_cache`. 

- **Dynamic Schema Discovery:** Upon initialization, the component scans the document for all `[data-ln-data-store]` elements. It collects their store names and index definitions.
- **Auto Upgrade:** If new stores or indexes are declared in the HTML markup, the component closes the active connection, increments the database version, and dynamically creates the missing stores and indexes in `onupgradeneeded`.
- **Initialization Failure:** If the browser does not support IndexedDB, or if database open/upgrade operations fail/are blocked, the component fails initialization, sets `initializationError`, and dispatches `ln-data-store:initialization-error`. There is no in-memory fallback; consumers are responsible for handling storage unavailability.

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
const storeEl = document.getElementById('documents');
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

### 3. Public Properties & Methods

| Property/Method | Type / Return Type | Description |
|---|---|---|
| `query` | `Object` | Active query filters and search terms: `{ filters: {}, search: '' }`. |
| `getAll(options)` | `Promise<Object>` | Retrieves records. Options support `sort` (`{ field, direction }`), `filters` (`{ field: Array }`), `search` (`String`), `offset`, `limit`. Returns `{ data, total, filtered }`. |
| `getById(id)` | `Promise<Object\|null>` | Returns a single record (decorated with presenters) or `null`. |
| `count(filters)` | `Promise<Number>` | Returns the total count of records. If filters are provided, returns the filtered count. |
| `aggregate(field, fn)` | `Promise<Number>` | Performs aggregation. `fn` must be `'count'`, `'sum'`, or `'avg'`. |
| `setPresenters(presenters)` | `void` | Registers presenters (decorators) for computed fields. |
| `applySync(upserted, deleted, syncedAt)` | `Promise<void>` | Feeds synchronization delta updates into the cache. |
| `forceSync()` | `void` | Dispatches `ln-data-store:request-remote-sync` with the current last sync timestamp. |
| `fullReload()` | `Promise<void>` | Clears the IndexedDB store, resets sync metadata, and triggers a sync. |
| `destroy()` | `void` | Cleans up the instance, removes event listeners, and deletes the DOM reference. |

### 4. Windowed Residency (Virtualization)

When `data-ln-data-store-window` is present, the store operates in windowed residency mode. The server is the authority on record order: the store keeps a memory index of logical positions to record IDs (`Map<position, id>`) capped at the window size. A view's range request is resolved through that index and materialised from IndexedDB; a missing page dispatches `ln-data-store:request-page`. Records the index evicts are deleted from IndexedDB too, so the window bounds what is stored, not only what is positioned. Only IDs the index itself placed can be evicted, so a locally created record the server has not positioned is never dropped.

A query change resets the index — positions are query-relative and become meaningless. Until the server's first page for the new query lands, the store answers from the records it already holds and marks the answer **provisional**: rows only, no totals. Counts and scroll geometry hold at whatever the last authoritative answer established, and the server's answer supersedes the provisional one at the next generation. The local pass stops as soon as the requested slice is full, so its cost tracks the viewport rather than the store.

`data-ln-data-store-no-local-query` turns that off: the store reports the window as unresolved and the view waits for the server. Already-positioned rows are still served from cache — those are the server's own answer, only materialised locally.

Windowed residency and coordinator autosync are mutually exclusive in practice: a full sync inserts records the index never positioned, which the window cannot bound.

---

## ⚡ DOM Events

### Commands & Query Events (Listened to by the Store)

| Event | `e.detail` payload | Description |
|---|---|---|
| `ln-search:change` | `{ term }` | Updates the active `query.search` term and dispatches `ln-data-store:query-changed`. |
| `ln-filter:change` | `{ key, values, targetId }` | Updates the active `query.filters[key]` and dispatches `ln-data-store:query-changed`. |

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

Every mutation command may include an opaque `requestId`. The store serializes
the write, persists record-count metadata, and then echoes that id on exactly
one terminal notification: `created` / `updated` / `deleted`, or
`mutation-error`. The protocol has no wall-clock timeout; lifecycle owners must
cancel their own pending receipts when they are destroyed.

An empty bulk-delete is an explicit no-op: it returns a resolved mutation,
emits `deleted {ids: []}`, and does not rewrite record-count metadata because
no local state changed.

---

### Notifications (Emitted by the Store)

These events bubble up and can be listened to by coordinators or rendering views (`ln-table` / `ln-list`):

| Event | `e.detail` payload | Description |
|---|---|---|
| `ln-data-store:request-page` | `{ store, offset, limit, query, queryGen }` | Dispatched in windowed residency when pages within the sliding window are missing and must be fetched from the server. |
| `ln-data-store:query-changed` | `{ store, query }` | Emitted when store search query or column filters change. |
| `ln-data-store:initialized` | `{ store, hasCache, lastSyncedAt, count }` | Emitted once after IndexedDB connection opens. The instance's `ready` promise resolves after this state is committed. |
| `ln-data-store:initialization-error` | `{ store, error }` | IndexedDB could not be initialized. `ready` still resolves after `initializationError` is set, allowing a coordinator to route reads to its connector. |
| `ln-data-store:ready` | `{ store, count, source }` | Emitted when data is ready. `source` is `'cache'` (init) or `'server'` (first sync). |
| `ln-data-store:loaded` | `{ store, count }` | Emitted on initial load sync completion (first sync). |
| `ln-data-store:created` | `{ store, record, tempId, requestId? }` | Emitted after optimistic creation. |
| `ln-data-store:updated` | `{ store, record, previous, requestId? }` | Emitted after optimistic update or id-swap rekey. |
| `ln-data-store:deleted` | `{ store, id \| ids, requestId? }` | Emitted after optimistic delete or bulk delete. |
| `ln-data-store:synced` | `{ store, added, deleted, changed }` | Emitted after subsequent delta sync merges. |
| `ln-data-store:sync-error` | `{ store, error, status }` | A connector sync failed; `isSyncing` has been cleared so online/visibility retry can proceed. |
| `ln-data-store:destroyed` | `{ store }` | Emitted when the store instance is destroyed. |
| `ln-data-store:mutation-error` | `{ store, action, requestId, error }` | A serialized local mutation failed. `requestId` lets a coordinator correlate reconciliation failures. |

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

---

## 🔧 Internals

Source: `components/ln-data-store/ln-data-store.js`.

### Shared IndexedDB connection

The page holds one `IDBDatabase` connection (`ln_app_cache`) shared by every `[data-ln-data-store]` instance; each store scopes its own transactions by name via a shared `_getDb()`. A module-level `_stores` registry (`{name: instance}`) exists purely for lookup — it does not drive any cross-store sync.

### No self-sync

`_initStore` only emits `ln-data-store:initialized` — in every branch (cache present, empty, schema-mismatch-after-clear) — it never triggers a remote sync itself. Deciding WHEN to sync (on init, on `online`, on `visibilitychange`) is entirely `ln-data-coordinator`'s job; the store keeps no visibility/online listeners of its own. `_triggerRemoteSync` (which dispatches `ln-data-store:request-remote-sync`) is reachable only through the two public commands `forceSync()` / `fullReload()` — always consumer-initiated, never automatic.

### Instance state

`storeEl.lnDataStore` carries `ready` (initialization promise),
`isInitialized` (metadata inspection completed), `initializationError` (the
IndexedDB failure, or `null`), `hasCache` (a local snapshot
exists, including an intentionally empty snapshot), `isLoaded` (the snapshot
is queryable), `isSyncing` (a remote-sync request is outstanding — set when
the store emits `ln-data-store:request-remote-sync`, cleared on `applySync`),
`lastSyncedAt` (the last sync watermark, passed to the coordinator as the
`since` field of that request event — the store itself never fetches), and
`totalCount`.

Local mutations are serialized per store instance. After the record write,
the store recounts and persists `_meta` before emitting the post-event. The
mutation chain waits for `ready`; an unavailable store emits `mutation-error`
instead of reporting a no-op write as successful.
Reconciliation commands may include a `requestId`; the same id is returned on
`created`/`updated`/`deleted` or `mutation-error`.

`hasCache` is deliberately not derived from `record_count`. A synchronized or
optimistically-mutated snapshot with zero rows is still authoritative local
state; treating it as "no cache" would allow a remote query to resurrect rows
that were just deleted. Only initialization without metadata, schema reset,
`clearAll`, and `fullReload` transition the instance back to no-snapshot state.

### Encryption pipeline

When a storage key is active: `_putRecord`/`_putBulk` keep `id` in plaintext (IndexedDB keys/indexes must stay queryable) and encrypt the rest of the payload with a fresh random 12-byte IV — `{ id, encrypted: true, iv, data }`. An unsynced record is identified solely by its `_temp_`-prefixed `id` (itself plaintext) — there is no separate pending/sync-state marker field. `_getAllRecords`/`_getRecord` decrypt in memory before a record reaches the in-memory sort/filter/search engine, so query behavior is identical whether encryption is active or not.

### DOM mutations

The store renders nothing. Its only DOM-side effects: attaches `request-*` listeners on the store element, writes `dom.lnDataStore = instance`, and dispatches `ln-data-store:*` events on the store element (`quota-exceeded` dispatches on `document` instead).

### Mutation error reconciliation

`ln-data-store` has no concept of "confirm" or "revert" — a `request-update`/`request-delete` is applied unconditionally to the local cache. Reconciling server-side mutation errors (retry, drop, conflict-server-wins, auth-pause) is `ln-data-coordinator`'s job — see [`components/ln-data-coordinator/README.md`](../ln-data-coordinator/README.md) §Error reconciliation policy.

### At-rest encryption reference

For encryption threat model and operational guidance, see [Security Architecture & Best Practices](../../docs/architecture/security.md).
