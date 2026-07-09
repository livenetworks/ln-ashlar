# ln-data-store

A zero-dependency, local-first **Database Cache Store** backed by standard browser `IndexedDB`. It acts as a pure client-side database cache, maintaining records locally, executing high-performance querying in-memory, and applying optimistic mutations directly — a record is a record, with no pending state, snapshots, or rollback machinery.

It possesses no visual interface and is **completely blind to the network** (no fetch, status codes, paths, or urls). Instead, it communicates strictly via custom DOM events, allowing the parent **Data Coordinator** to orchestrate syncs and mutations.

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

| Attribute | Description |
|---|---|
| `data-ln-data-store="name"` | Declares the store (also `data-ln-store="name"`) |
| `data-ln-data-store-stale="N"` | Seconds before cache is considered stale (default 300, `-1` = never) |
| `data-ln-data-store-indexes="…"` | Comma-separated IDB index fields |
| `data-ln-data-store-search-fields="…"` | Comma-separated text-search fields |
| `data-ln-data-store-no-autosync` | Back-compat fallback only — see below. Prefer `data-ln-data-coordinator-no-autosync` on the coordinator. |

---

## 🔄 Sync Ownership Moved to the Coordinator

`ln-data-store` no longer decides WHEN to sync. It is a **pure cache**: no
self-sync on init, no `visibilitychange` listener, no `window 'online'` /
`'offline'` listener of its own. All of that now lives in
`ln-data-coordinator` — see its
[README](../ln-data-coordinator/README.md#sync-ownership).

**What the store still does:** at the end of `_initStore` it emits
`ln-store:initialized { store, hasCache, lastSyncedAt, count }` — in every
branch (cache present, empty, schema-mismatch-after-clear) — and stops
there. It reports its cache state; it does not act on it.

**Two breaking changes from earlier releases:**

1. **The store no longer auto-syncs on init, visibility change, or
   reconnect.** A store used WITHOUT a coordinator on the page no longer
   performs any of these (previously it dispatched a `request-remote-sync`
   event that, without a coordinator, nobody handled anyway — so this is not
   a functional regression for the 3-tier setup). With a coordinator
   present, the coordinator drives initial load, staleness, and
   reconnect sync via `store.forceSync()`.
2. **`ln-store:online` / `ln-store:offline` now require a coordinator on
   the page.** These events are dispatched by `ln-data-coordinator`, not by
   the store. A store with no coordinator will never emit them.

**Opt-out** moved to the coordinator too:
```html
<div data-ln-data-coordinator="chat" data-ln-data-coordinator-no-autosync>
  <div data-ln-data-store="chat"></div>
</div>
```
The coordinator also honors the store's own `data-ln-data-store-no-autosync`
/ `data-ln-store-no-autosync` attribute as a fallback for back-compat.

---

## 🛠️ JS API (On the element)

Access the database layer directly via the `lnDataStore` property on the store container:

```javascript
const store = document.querySelector('[data-ln-data-store="documents"]');

// 1. Queries (returns Promise)
const { data, total, filtered } = await store.lnDataStore.getAll({
  sort: { field: 'updated_at', direction: 'desc' },
  filters: { status: ['Approved'] },
  search: 'ISO 27001',
  limit: 50
});

const doc = await store.lnDataStore.getById(42);

// 2. Decorators / Computed Fields Configuration
store.lnDataStore.setPresenters({
  computed: {
    size_display: record => (record.file_size / 1024).toFixed(1) + ' MB'
  }
});
```

---

## ⚡ DOM Events

### Commands (Dispatched TO the store)

*Never invoke write methods directly.* Route all mutations through DOM commands. The
**caller supplies `tempId`** on create — the store has no fallback ID generator; a
parent coordinator (or any other caller) is responsible for minting one (e.g.
`'_temp_' + crypto.randomUUID()`):

```javascript
// Create optimistically — caller-supplied tempId is required
store.dispatchEvent(new CustomEvent('ln-store:request-create', {
  detail: { tempId: '_temp_abc123', data: { title: 'New Document', status: 'Draft' } }
}));

// Update — an id-swap happens automatically when data.id differs from the current id
// (this is how a server-confirmed create is applied: request-update with the temp id
// as the target and the server record — including its real id — as data)
store.dispatchEvent(new CustomEvent('ln-store:request-update', {
  detail: { id: 42, data: { title: 'Updated title' } }
}));
```

There is no `expected_version` handling at the store layer — version locks are a
connector/coordinator transport concern (`ln-api-connector:request-update`'s
`expected_version` field), not a local-cache one.

### Sync Request (Bubbles UP to the Coordinator)

*The Coordinator catches this event to run transport sync:*

* `ln-store:request-remote-sync` (detail: `{ since }`)

There are no `request-remote-create` / `-update` / `-delete` / `-bulk-delete`
events. Remote transport is fanned out in parallel by the coordinator directly
from its own intake events — see the
[ln-data-coordinator README](../ln-data-coordinator/README.md) — not chained off
store confirmation.

### Lifecycle Notification

* `ln-store:initialized` (detail: `{ store, hasCache, lastSyncedAt, count }`) — emitted once at the end of `_initStore`, in every branch (cache present, empty, schema-mismatch-after-clear). This is how a coordinator decides whether to perform an initial `forceSync()` — the store itself never decides.

---

## 🚀 Public Synchronization APIs (Invoked by the Coordinator)

Once the network connector returns backend payloads, the Coordinator feeds the results back to the store using this public method:

```javascript
// Feed delta updates or initial load data
store.lnDataStore.applySync(upsertedRecords, deletedIds, syncedAt);
```

**No `confirmMutation`, `revertMutation`, or `resolveConflict`.** A record is a
record — there is no `_pending` flag, no per-mutation snapshot, and no rollback.
Server confirmation of a create/update is just an ordinary
`ln-store:request-update` dispatched by the coordinator (id-swap handled
automatically when the incoming `data.id` differs from the target `id`). The
only marker of an unsynced record is its `_temp_`-prefixed id — there is no
separate `synced` flag. If a create is ultimately rejected by the server, the
coordinator issues an ordinary `ln-store:request-delete` for that temp id;
there is no automatic revert-to-previous-snapshot behavior.
