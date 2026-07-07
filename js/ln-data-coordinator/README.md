# `data-ln-data-coordinator`

A zero-dependency, Local-First **Data Coordinator** component that orchestrates the full 3-Tier Data Layer in `ln-ashlar`: it bridges the local cache store to remote connectors **and** delivers live data to bound view components (tables, lists, selects, stat counters) with zero application JavaScript.

This component monitors its DOM subtree, intercepts events, and coordinates the lifecycle between a **Local Storage Cache** (`data-ln-data-store`) and any **Transport Gateway** (`data-ln-*-connector`). It also listens on `document` for view-binding requests and refreshes all bound view elements on every store mutation.

---

## Declarative View Binding

Add these attributes to view elements to bind them to this coordinator's child store. No app JS needed.

| Attribute | Applied To | Description |
|---|---|---|
| `data-ln-table-store="<storeName>"` | `[data-ln-table]` | Binds a table — receives `ln-table:set-data` automatically. |
| `data-ln-list-store="<storeName>"` | `[data-ln-list]` | Binds a list — receives `ln-list:set-data` automatically. |
| `data-ln-options="<storeName>"` | `<select>` | Populated by `ln-options` via `ln-options:set-data`. |
| `data-ln-stat="<storeName>"` | Inline element | Receives count via `ln-stat:set-count`. |

`<storeName>` = the value of `data-ln-data-store` on the coordinator's child store. Multiple coordinators on one page each serve only their own store — isolated by the `_ownsStore(name)` guard.

### Presenter / Binder Split

- **Presenters** (`store.setPresenters({computed})`) — registered on the store; computed display fields flow through `getAll → set-data` automatically.
- **Binder** (this coordinator) — delivers already-decorated records without knowing their shape.

Use `setPresenters` for fields like `updated_display`, `size_display`, `status_label`. The binder delivers them as-is.

### Store-Change Refresh

The coordinator listens on `this.dom` for `ln-store:ready`, `loaded`, `created`, `updated`, `deleted`, and `synced` (only when `changed`). On any of these, `_refreshAll()` re-queries all bound view elements using their last cached query parameters.

### Zero-JS Example

```html
<div data-ln-data-coordinator>
  <div data-ln-data-store="people" data-ln-store-endpoint="/api/people"></div>
  <div data-ln-api-connector data-ln-api-endpoint="/api/people"></div>
</div>

<section data-ln-table="people"
         data-ln-table-source="people"
         data-ln-table-store="people">
  <table>
    <thead>
      <tr>
        <th data-ln-table-col="name">Name <button data-ln-table-col-sort …></button></th>
        <th data-ln-table-col="status">Status <button data-ln-table-col-filter …></button></th>
      </tr>
    </thead>
    <tbody data-ln-table-body></tbody>
  </table>
  <template data-ln-template="people-row">
    <tr data-ln-table-row>
      <td>{{ name }}</td>
      <td>{{ status_display }}</td>
    </tr>
  </template>
</section>

<select data-ln-options="people" data-ln-options-value="id" data-ln-options-label="name">
  <option value="">All</option>
</select>

<strong data-ln-stat="people" data-ln-stat-filter="status:active"></strong> active
```

No `<script>` block needed. The coordinator wires everything.

---

## 🧭 The 3-Tier Data Layer Anatomy

The coordinator acts as a parent wrapper enclosing the database cache and transport connector:

```html
<div data-ln-data-coordinator="documents"
     data-ln-data-mapper="documents">
     
    <!-- Tier 1: Local Cache Database (IndexedDB - pure and network-blind) -->
    <div data-ln-data-store 
         data-ln-store-indexes="status,updated_at">
    </div>

    <!-- Tier 2: Transport Gateway (API / REST Connector) -->
    <div data-ln-api-connector 
         data-ln-api-base-url="https://api.livenetworks.com/v1"
         data-ln-api-path="/documents">
    </div>
</div>
```

---

## ⚙️ Attributes

| Attribute | Category | Description |
|-----------|----------|-------------|
| `data-ln-data-coordinator` | Selector | Creates the coordinator instance. The value acts as the domain/scope name (e.g. `documents`). |
| `data-ln-data-mapper` | Mapping | Reference to an externally registered data mapper name (e.g. `documents`). |

---

## 🔄 Dynamic Child & Mapper Discovery

The coordinator is built to be highly dynamic, reacting to runtime modifications in its DOM subtree.

1. **Child Discovery**: The coordinator automatically locates its child components by querying its DOM subtree:
   * **Store Cache**: Looks for `[data-ln-data-store]` and accesses `el.lnDataStore || el.lnStore`.
   * **Transport Connector**: Looks for any connector selector (`[data-ln-api-connector]`, `[data-ln-couchdb-connector]`, `[data-ln-websocket-connector]`, `[data-ln-rest-connector]`) and accesses the universal alias `el.lnConnector`.
   * **Offline Outbox (optional Child 3)**: Looks for `[data-ln-api-queue]` and accesses `el.lnApiQueue`. When present, write routing (below) enqueues instead of calling the connector directly. When absent, behavior is byte-for-byte the direct-connector path described in this document.

2. **Mapper Resolution**: The coordinator resolves mapping functions using two strategies:
   * **Inline Script (Highly Encapsulated)**: Looks for a nested `<script type="application/javascript" data-ln-mapper>` tag in its subtree:
     ```html
     <script type="application/javascript" data-ln-mapper>
       ({
         ingress(serverRaw) {
           return {
             id: serverRaw.id,
             title: serverRaw.title,
             status: serverRaw.status,
             updated_at: Date.parse(serverRaw.updated_at) / 1000
           };
         },
         egress(localDb) {
           return {
             title: localDb.title,
             status: localDb.status
           };
         }
       })
     </script>
     ```
   * **External Registry (Reusability)**: If no inline script exists, it reads the `data-ln-data-mapper` attribute and looks up the mapper via `window.lnCore.getDataMapper(name)`.
   * **Fallback**: Defaults to a safe no-op mapper: `{ ingress: r => r, egress: r => r }`.

---

## ⚡ The Event Loop Orchestration

Because all events dispatched by the child components bubble up, the coordinator listens directly on its own DOM boundary. It manages the following flows seamlessly:

### 1. Delta & Full Sync (`ln-store:request-remote-sync`)
Triggered when the store cache boots up or detects stale data:
```mermaid
sequenceDiagram
    participant Store as data-ln-data-store
    participant Coord as data-ln-data-coordinator
    participant Gateway as data-ln-*-connector
    
    Store->>Coord: Event: ln-store:request-remote-sync (since)
    Coord->>Gateway: JS API: connector.fetchDelta(since)
    Gateway-->>Coord: Promise: returns serverRawResponse
    Note over Coord: Applies Ingress Mapper:<br/>mapper.ingress(serverRawRecord)
    Coord->>Store: JS API: store.applySync(normalizedData, deletedIds, syncedAt)
```

### 2. Optimistic Creation (`ln-store:request-remote-create`)
Triggered when a form submits a new record to the local cache:
```mermaid
sequenceDiagram
    participant Store as data-ln-data-store
    participant Coord as data-ln-data-coordinator
    participant Gateway as data-ln-*-connector
    
    Store->>Coord: Event: ln-store:request-remote-create (tempId, data)
    Note over Coord: Applies Egress Mapper:<br/>mapper.egress(localRecord)
    Coord->>Gateway: JS API: connector.create(serverPayload)
    alt Server Success
        Gateway-->>Coord: Promise: returns serverRawResponse
        Note over Coord: Applies Ingress Mapper:<br/>mapper.ingress(serverRaw)
        Coord->>Store: JS API: store.confirmMutation(tempId, confirmedLocalRecord, 'create')
    else Server Failure
        Gateway-->>Coord: Promise: Rejects
        Coord->>Store: JS API: store.revertMutation(tempId, 'create', errorMessage)
    end
```

### 3. Optimistic Updates (`ln-store:request-remote-update`)
Triggered when a record is updated locally. The coordinator pulls the complete merged record from the database to support standard REST `PUT` schemas:
```mermaid
sequenceDiagram
    participant Store as data-ln-data-store
    participant Coord as data-ln-data-coordinator
    participant Gateway as data-ln-*-connector
    
    Store->>Coord: Event: ln-store:request-remote-update (id, expected_version)
    Coord->>Store: JS API: store.getById(id)
    Store-->>Coord: Returns local record
    Note over Coord: Applies Egress Mapper:<br/>mapper.egress(cleanRecord)
    Coord->>Gateway: JS API: connector.update(id, serverPayload, expected_version)
    alt Server Success
        Gateway-->>Coord: Promise: returns serverRawResponse
        Note over Coord: Applies Ingress Mapper:<br/>mapper.ingress(serverRaw)
        Coord->>Store: JS API: store.confirmMutation(id, confirmedLocalRecord, 'update')
    else Conflict (409)
        Gateway-->>Coord: Promise: Rejects with 409
        Note over Coord: Applies Ingress Mapper:<br/>mapper.ingress(remoteRecord)
        Coord->>Store: JS API: store.resolveConflict(id, remoteRecord, fieldDiffs)
    else Other Failure
        Gateway-->>Coord: Promise: Rejects
        Coord->>Store: JS API: store.revertMutation(id, 'update', errorMessage)
    end
```

### 4. Deletions (`ln-store:request-remote-delete` & `bulk-delete`)
Triggered when records are deleted in-memory:
* **Single Delete**: Calls `connector.delete(id)` $\rightarrow$ calls `store.confirmMutation(id, null, 'delete')` (or `revertMutation` on failure).
* **Bulk Delete**: Calls `connector.bulkDelete(ids)` $\rightarrow$ calls `store.confirmMutation(ids.join(','), null, 'bulk-delete')` (or `revertMutation` on failure).

---

## 📥 Offline Outbox Write Routing (optional `ln-api-queue` child)

When a `[data-ln-api-queue]` child is present, every mutation handler
(`create`/`update`/`delete`/`bulk-delete`) is routed through it instead of
calling the connector immediately. When it is absent, the direct-connector
flows above apply unchanged.

**Queue-present enqueue payloads:**

| op | `ln-api-queue:request-enqueue` detail |
|---|---|
| create | `{ chainKey: tempId, op:'create', targetId:null, payload: egress(data), expectedVersion:null, meta:{ tempId } }` |
| update | `{ chainKey: id, op:'update', targetId: id, payload: egress(cleanRecord), expectedVersion, meta:{ id } }` (merged record still fetched via `store.getById(id)` first) |
| delete | `{ chainKey: id, op:'delete', targetId: id, payload:null, expectedVersion:null, meta:{ id } }` |
| bulk-delete | `{ chainKey: bulkKey, op:'bulk-delete', targetId:null, payload:{ ids }, expectedVersion:null, meta:{ bulkKey, ids } }` |

The store is **not** reconciled at enqueue time — reconciliation happens
only when the queue later commands the coordinator to send.

### Transport executor — `ln-api-queue:send`

The coordinator listens for `ln-api-queue:send` on the queue element. It
maps `op` to the matching connector method (same egress/ingress flow as the
direct path) and, on resolution, drives both the store and the queue:

| op | success → store | success → queue command |
|---|---|---|
| create | `confirmMutation(meta.tempId, ingress(record), 'create')` | `request-remap {oldKey:meta.tempId, newId:ingress(record).id}` **then** `ack {entryId}` |
| update | `confirmMutation(meta.id, ingress(record), 'update')` | `ack {entryId}` |
| delete | `confirmMutation(meta.id, null, 'delete')` | `ack {entryId}` |
| bulk-delete | `confirmMutation(meta.bulkKey, null, 'bulk-delete')` | `ack {entryId}` |

Remap is dispatched **before** ack on create success — a queued sibling
update targeting the temp id re-targets the real server id before its own
chain entry advances (both dispatches are synchronous).

**On error** (reads `err.status` / `err.data` from the connector's unified
error shape):

| Condition | Coordinator action |
|---|---|
| `401` / `419` | `nack {entryId, reason:'auth'}` — does **not** revert; keeps the optimistic write. The queue pauses that scope and emits `auth-required`; the consumer re-authenticates then dispatches `ln-api-queue:request-resume`. |
| `409` (update) | `store.resolveConflict(meta.id, ingress(err.data.remote), err.data.field_diffs)`, then `nack {entryId, reason:'drop'}`. |
| other `4xx` | `ln-store:sync-conflict` dispatched, `store.revertMutation(...)`, `nack {entryId, reason:'drop'}`, then `store.forceSync()` as a reconciliation backstop (covers the case where the optimistic snapshot was lost to a page reload). |
| `5xx` / network (`status:0`) | `nack {entryId, reason:'retry'}` — keeps the optimistic write; the queue backs off and retries. |

### Sync ownership

The coordinator — not the store — decides WHEN to sync:

* Listens for `ln-store:initialized` on its store child: if
  `!detail.hasCache` → `store.forceSync()` (initial load); else if the
  store is stale → `store.forceSync()`.
* **Race guard.** `ln-store:initialized` can fire before the coordinator
  finishes binding (async `_initStore`, SPA-injected subtree). When
  children resolve, if `store.isLoaded` is already true, the coordinator
  evaluates the same condition directly from instance state instead of
  relying on the event alone.
* A module-level singleton wires **one shared** `window 'online'`,
  `window 'offline'`, and `document 'visibilitychange'` listener set across
  every coordinator instance on the page (not one per instance). On
  `online`, dispatches `ln-store:online` on `document` once, then for each
  coordinator with a loaded, non-syncing store: `store.forceSync()`. On
  `offline`, dispatches `ln-store:offline` on `document` once. On
  `visibilitychange` (tab visible again), for each coordinator whose store
  is stale: `store.forceSync()`.

**New attributes:**

| Attribute | Description |
|---|---|
| `data-ln-data-coordinator-stale` | Seconds threshold before the store is considered stale; falls back to the store's own `data-ln-data-store-stale` / `data-ln-store-stale`; default 300; `-1` / `never` = never stale. |
| `data-ln-data-coordinator-no-autosync` | Presence opts the coordinator out of online/visibility auto-sync; falls back to the store's own `data-ln-data-store-no-autosync` / `data-ln-store-no-autosync`. |

`ln-store:online` / `ln-store:offline` now require a coordinator on the
page — the store itself no longer dispatches them (see the
[ln-data-store README](../ln-data-store/README.md)).

---

## 💡 JS API (On the element)

Access the coordinator instance programmatically via the `lnDataCoordinator` or `lnCoordinator` properties:

```javascript
const coordinator = document.querySelector('[data-ln-data-coordinator="documents"]').lnDataCoordinator;

// Force a remote configuration refresh
coordinator.refreshConfig();

// Retrieve children objects (queue is null when no [data-ln-api-queue] child exists)
const { store, connector, queue } = coordinator.findChildren();

// Fetch currently resolved mapper functions
const { ingress, egress } = coordinator.mapper;
```
