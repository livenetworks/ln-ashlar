# Plan: ln-store Component

## Context

ln-store is a generic IndexedDB data layer — caches server data locally, syncs via delta protocol, handles optimistic mutations. It renders NOTHING. UI components (ln-data-table, dashboards) consume data through its API and CustomEvents.

Full spec: `docs/js/ln-store.md`
Architecture: `.claude/skills/architecture/data-layer.md`

## Implementation Phases

This is a complex component. Build incrementally — each phase is testable on its own.

### Phase 1: IndexedDB Core + Read API

**Goal:** Open database, create object stores, read/write records.

Files:
```
js/ln-store/ln-store.js      ← IIFE component
js/index.js                   ← add import
```

What to build:
- IIFE skeleton: `DOM_SELECTOR = 'data-ln-store'`, `DOM_ATTRIBUTE = 'lnStore'`
- `_openDatabase()` — open/create `ln_app_cache` IndexedDB database
- `_meta` store for per-resource metadata (schema_version, last_synced_at, record_count)
- Dynamic object store creation from `data-ln-store` elements (one store per resource)
- Index creation from `data-ln-store-indexes` attribute
- Schema version check — mismatch → clear store
- Instance API on DOM element:
  - `storeEl.lnStore.getAll(options)` → Promise<{data, total, filtered}>
  - `storeEl.lnStore.getById(id)` → Promise<Object|null>
  - `storeEl.lnStore.count(filters)` → Promise<Number>
  - `storeEl.lnStore.isLoaded`, `.totalCount`
- MutationObserver for dynamic `data-ln-store` elements

**Verify:** Create a `<div data-ln-store="test" data-ln-store-endpoint="/api/test">`, manually insert records into IndexedDB via DevTools, call `storeEl.lnStore.getAll()` and confirm it returns them.

### Phase 2: Full Load + Delta Sync

**Goal:** Fetch data from server, cache in IndexedDB, delta sync.

What to build:
- `_fullLoad(el)` — GET `{endpoint}`, store all records, set `last_synced_at`
- `_deltaSync(el)` — GET `{endpoint}?since={last_synced_at}`, upsert/delete changed records
- Init flow: cached data? → emit `ln-store:ready` (source: 'cache') → if stale → delta sync background
- No cached data → full load → emit `ln-store:loaded`
- Visibility change listener: `document.addEventListener('visibilitychange', ...)` → delta sync all stores when tab becomes visible
- `.isSyncing`, `.lastSyncedAt` state properties
- Events: `ln-store:ready`, `ln-store:loaded`, `ln-store:synced`, `ln-store:unchanged`

**Verify:** Register a store with a real endpoint. First visit: full load, records in IndexedDB. Refresh: instant from cache + background delta sync. Switch tabs and back: delta sync fires.

### Phase 3: Client-Side Query Engine

**Goal:** Sort, filter, search on cached data.

What to build:
- `_sort(records, { field, direction })` — in-memory sort, use `Intl.Collator` for strings
- `_filter(records, { status: ['approved'], ... })` — AND logic, array of accepted values per field
- `_search(records, query, searchFields)` — case-insensitive substring across configured fields (from `data-ln-store-search-fields`)
- `_aggregate(records, field, fn)` — sum, avg, count
- Wire into `getAll(options)`: filter → search → sort → offset/limit → return with counts
- `storeEl.lnStore.aggregate(field, fn)` API

**Verify:** Load 100+ records, call `getAll({ filters: {...}, search: 'term', sort: {field, direction} })`, confirm correct results and counts.

### Phase 4: Optimistic Mutations

**Goal:** CRUD through request events, optimistic UI updates, server confirm/revert.

What to build:
- Listen for request events on store element:
  - `ln-store:request-create` → temp ID (`_temp_{crypto.randomUUID()}`), insert, POST, confirm/revert
  - `ln-store:request-update` → save previous, update, PUT with `expected_version`, confirm/revert/conflict
  - `ln-store:request-delete` → save record, remove, DELETE, confirm/revert
  - `ln-store:request-bulk-delete` → same for array of IDs
- Emit mutation events: `ln-store:created`, `ln-store:updated`, `ln-store:deleted`
- Emit result events: `ln-store:confirmed`, `ln-store:reverted`, `ln-store:conflict`
- On server success: replace temp ID with real ID, update timestamps
- On server error: revert IndexedDB, emit revert event with error detail
- On 409: emit conflict event with local + remote versions

**Verify:** Dispatch `ln-store:request-create` event, confirm record appears in IndexedDB with temp ID, server gets POST, temp ID replaced. Disconnect network, dispatch update, confirm revert fires.

### Phase 5: Error Handling + Cleanup

**Goal:** Graceful degradation, cleanup.

What to build:
- IndexedDB unavailable → fallback to in-memory Map, console.warn
- Server unreachable during sync → emit `ln-store:offline`, cached data still usable
- Server unreachable during initial load (no cache) → emit `ln-store:error`
- `window.lnStore.clearAll()` — wipe all stores + meta (for logout)
- `storeEl.lnStore.destroy()` — remove listeners, cancel pending fetches
- `storeEl.lnStore.forceSync()` / `.fullReload()` manual triggers
- Abort pending fetch on destroy (AbortController)

**Verify:** Block network in DevTools, trigger sync, confirm `ln-store:offline` event. Call `clearAll()`, confirm IndexedDB empty. Destroy store, confirm no orphan listeners.

## Key Patterns

### Import from ln-core
```javascript
import { dispatch, findElements } from '../ln-core';
```

### All timestamps are Unix epoch (seconds)
- `?since=` parameter: Unix timestamp
- `synced_at` in response: Unix timestamp
- `expected_version` for conflict detection: Unix timestamp
- `last_synced_at` in _meta: Unix timestamp

### Event dispatch via ln-core helper
```javascript
dispatch(storeEl, 'ln-store:ready', { store: name, count: N, source: 'cache' });
```

### Single database, multiple object stores
One IndexedDB database `ln_app_cache` shared by all stores. Each `data-ln-store` element creates one object store. Database version increments when new stores are needed (IndexedDB requires version bump for schema changes).

### IndexedDB version management
IndexedDB requires `onupgradeneeded` to create/modify stores. Strategy:
- On init, read all `data-ln-store` elements to know required stores
- Compare with existing stores in database
- If new stores needed → close db, reopen with version + 1, create in `onupgradeneeded`

## Reference Files

- `docs/js/ln-store.md` — full API spec (read BEFORE implementing)
- `.claude/skills/architecture/data-layer.md` — sync protocol, optimistic mutations, conflict resolution
- `js/COMPONENTS.md` — IIFE pattern, MutationObserver conventions
- `js/ln-core/helpers.js` — dispatch, findElements
- `js/ln-progress/ln-progress.js` — simple IIFE reference

## Documentation & Demo

### Phase 6: Component README

Create `js/ln-store/README.md` — quick-reference bundled with the component.

Sections (follow pattern from `js/ln-accordion/README.md`, `js/ln-ajax/README.md`):
- Overview (what it does, NOT a UI component)
- Attributes (table: attribute, required, description)
- Events — Commands (request events the coordinator dispatches)
- Events — Notifications (events the store emits)
- API (instance methods on `storeEl.lnStore`)
- Dependencies (IndexedDB, fetch)
- Example (minimal registration + query)

### Phase 7: Detailed Documentation

Update `docs/js/ln-store.md` — this file already exists as the API spec. After implementation, extend it with:
- Internal Architecture section (state model, sync lifecycle, IndexedDB version management)
- Code flow diagrams for delta sync and optimistic mutations
- Follow the depth/pattern of `docs/js/sortable.md` (which has extensive internal architecture sections)

### Phase 8: Demo Page

Create `demo/admin/store.html` — follow the existing demo page template pattern.

Sections (match existing demo pages like `demo/admin/sortable.html`):
- **Basics** — attributes table, what ln-store is
- **Example — Basic** — register a store, show data loading, display record count
- **Example — Complex** — two stores, delta sync demo, optimistic create/update/delete with revert simulation
- **API & Events** — constructor, instance methods, all events with detail structure
- **HTML Structure** — registration markup
- **Dependencies** — IndexedDB, fetch API

The demo needs a mock API endpoint. Options:
- Inline `<script>` that intercepts fetch and returns mock data (self-contained, no server needed)
- Or use `demo/api/` JSON files if that pattern exists

## After Implementation

Update `todo.md` — mark `ln-store.js` as done in "ln-acme Implementation" section.

## Verification (End-to-End)

1. Register store: `<div data-ln-store="documents" data-ln-store-endpoint="/api/documents">`
2. First visit: full load, data in IndexedDB, `ln-store:loaded` fires
3. Refresh: instant from cache (`ln-store:ready` source: 'cache'), delta sync background
4. Filter + search + sort via `getAll(options)` — correct results
5. Dispatch `ln-store:request-create` — optimistic insert, server confirm
6. Dispatch `ln-store:request-update` — optimistic update, conflict on 409
7. Tab switch → return: delta sync fires
8. Network off: cached data still works, `ln-store:offline` fires
9. `clearAll()` wipes everything
