# ln-data-store

A zero-dependency, local-first **Database Cache Store** backed by standard browser `IndexedDB`. It acts as a pure client-side database cache, maintaining records locally, executing high-performance querying in-memory, and managing optimistic mutations with automatic snapshots for transaction safety.

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

### Remote Request Events (Bubbles UP to the Coordinator)

*The Coordinator catches these events to run transport sync and mutations:*

* `ln-store:request-remote-sync` (detail: `{ since }`)
* `ln-store:request-remote-create` (detail: `{ tempId, data }`)
* `ln-store:request-remote-update` (detail: `{ id, data, expected_version }`)
* `ln-store:request-remote-delete` (detail: `{ id }`)
* `ln-store:request-remote-bulk-delete` (detail: `{ ids }`)

---

## 🚀 Public Synchronization APIs (Invoked by the Coordinator)

Once the network connector returns backend payloads, the Coordinator feeds the results back to the store using these public methods:

```javascript
// Feed delta updates or initial load data
store.lnDataStore.applySync(upsertedRecords, deletedIds, syncedAt);

// Confirm an optimistic transaction (swaps temp IDs, clears pending flag)
store.lnDataStore.confirmMutation(tempIdOrId, serverRecord, action);

// Revert an optimistic transaction (restores snapshot on error)
store.lnDataStore.revertMutation(tempIdOrId, action, errorMessage);

// Trigger conflict merge flow
store.lnDataStore.resolveConflict(id, remoteRecord, fieldDiffs);
```
