# ln-store — architecture

> Internal architecture: IndexedDB layout, sync lifecycle, optimistic
> mutation flow, error / state machine. For consumer docs (attributes,
> events, API), see [README](../../js/ln-store/README.md).

Source: `js/ln-data-store/ln-data-store.js`

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
  2. Schema mismatch? → clear, reset meta
  3. Has cache? → emit ready (source: 'cache')
  4. Emit ln-store:initialized { store, hasCache, lastSyncedAt, count } — in EVERY branch
     (cache, empty, schema-mismatch-after-clear)

Delta sync:
  1. GET {endpoint}?since={last_synced_at}
  2. Upsert data[], delete deleted[]
  3. Emit synced
```

The store no longer decides WHEN to sync. `_initStore` never triggers a
remote sync itself — it only emits `ln-store:initialized` and lets the
consumer (normally `ln-data-coordinator`) decide. There is no visibility-change
or online-reconnect self-sync inside the store anymore; both moved to
`ln-data-coordinator`, which listens for `ln-store:initialized` (plus its own
`window 'online'` / `document 'visibilitychange'` listeners) and calls
`store.forceSync()` when appropriate. A store used without a coordinator on
the page simply never syncs beyond its initial cache read — see
[README](../../js/ln-data-store/README.md).

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
| `_stores` | `{ name: instance }` — global registry (lookup only; no longer drives any self-sync) |

There is no module-level visibility/online/offline handling left in the
store — `_visibilityHandler`, `_onlineHandler`, and `_offlineNotify` were
removed along with their listeners. That responsibility (and the
`ln-store:online`/`ln-store:offline` document dispatch) now lives in
`ln-data-coordinator`. The per-instance `_noAutosync` opt-out flag was
removed too — the opt-out is now read by the coordinator (as
`data-ln-data-coordinator-no-autosync`, falling back to the store's own
`data-ln-data-store-no-autosync` / `data-ln-store-no-autosync` attribute for
back-compat).

The page holds **one** IDBDatabase connection shared by all store
instances (multiple `data-ln-store` elements). Stores share the
connection via `_getDb()`; transactions are scoped per store name.

## Event surface

See [README §Events — Commands](../../js/ln-data-store/README.md#events--commands-dispatched-to-the-store)
and [§Events — Notifications](../../js/ln-data-store/README.md#events--notifications-emitted-by-the-store)
for the full table of dispatched events. This document covers WHEN
each event fires within the lifecycle / mutation flow above.

`ln-store:initialized` is emitted once at the end of `_initStore`, in every
branch (cache present, empty, schema-mismatch-after-clear). It replaces the
store's old self-sync trigger — the store no longer decides to sync on init;
it only reports its cache state and lets the coordinator decide.

## API surface

See [README §API](../../js/ln-data-store/README.md#api-instance-on-dom-element)
for the full API + query options + global methods.

The store has **no persistent write queue of its own**. There is no
FIFO-per-record pending-writes IndexedDB store inside `ln-data-store` — the
offline outbox is the standalone `ln-api-queue` component (its own IndexedDB
database, `ln_api_queue`). `ln-data-store` only holds the record cache plus
the `lastSyncedAt` watermark.

`_triggerRemoteSync` (the internal call that dispatches
`ln-store:request-remote-sync`) is never invoked by the store's own
lifecycle. It is reachable ONLY via the two explicit public commands
`forceSync()` and `fullReload()` — always consumer/coordinator initiated,
never a self-sync.

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

## Database Encryption at Rest

To protect local cache data on client devices, `ln-data-store` features transparent envelope encryption using high-performance **AES-GCM 256-bit** encryption backed by the browser **Web Crypto API**.

### The Encryption Pipeline

When a database key is active (via `window.lnCore.setStorageKey`):
1. **Write Intervention (`_putRecord` / `_putBulk`)**: 
   The framework extracts the record `id` and the sync marker `_pending` to keep them in plaintext. The remaining record payload is encrypted using a unique, random 12-byte IV.
   ```
   Plaintext:  { id: 'usr_1', name: 'Alice', role: 'admin', _pending: true }
   Encrypted:  { id: 'usr_1', encrypted: true, iv: '...', data: '...', _pending: true }
   ```
   This ensures that IndexedDB store keys and indexes can be searched natively by the browser without reading/writing the decrypted data to disk.
2. **Read Intervention (`_getAllRecords` / `_getRecord`)**: 
   Whenever records are read from IndexedDB, they are automatically decrypted in memory before they are passed to the in-memory sorting, filtering, and search engine.
3. **Index & Query Integrity**:
   Because the sorting, filtering, and searching functions run **in-memory** over the retrieved records rather than querying IndexedDB indexes directly, all search, pagination, and multi-field filtering capabilities function identically whether storage encryption is enabled or disabled.

### Activation

Call `window.lnCore.setStorageKey(passphrase)` to activate database encryption. All subsequent writes will be encrypted.

For detailed security guidelines, see [Security Architecture & Best Practices](../architecture/security.md).

## DOM mutations

The store renders nothing. The only DOM-side effects are:

- attaches `request-*` listeners on the store element
- writes `dom.lnStore = instance` on the store element
- dispatches `ln-store:*` events on the store element
  (`quota-exceeded` dispatches on `document`)
