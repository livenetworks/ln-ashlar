---
name: data-layer
classification: doctrine
status: draft
domain: frontend
summary: 3-Tier offline-first data layer in ln-ashlar - stores, connectors, coordinators, the secure mapper, and dynamic write queues.
source: docs/architecture/data-store-architecture.md, docs/architecture/coordinator.md
tags: [doctrine, data, store, database, queue, offline-first]
---

# 🗄️ 3-Tier Data Layer and Sync Architecture

## Summary

This document explains the decoupled 3-tier local-first data architecture of `ln-ashlar`. It maps how storage, transport, and synchronization are isolated using parent coordinators (`data-ln-data-coordinator`, see [`ln-data-coordinator`](../components/ln-data-coordinator.md)), local database caches (`data-ln-data-store`, see [`ln-data-store`](../components/ln-data-store.md)), network connectors (`data-ln-*-connector`), and the persistent offline queue (`data-ln-api-queue`, see [`ln-api-queue`](../components/ln-api-queue.md)). It also details the Ingress/Egress data mapper registry.

---

## 1. The Decoupled 3-Tier Hierarchy

The data layer separates concerns strictly by nesting child components inside a parent coordinator within the HTML DOM tree. This isolates storage caches from transport protocols:

```
┌────────────────────────────────────────────────────────┐
│  data-ln-data-coordinator (Parent Orchestrator)        │
│  - Captures local mutations and sync requests.         │
│  - Executes Ingress/Egress data mapping conversions.   │
├────────────────────────────────────────────────────────┤
│  data-ln-data-store (Child 1: Storage Cache Database)  │
│  - Manages local IndexedDB storage, queries, indexes.  │
│  - Stateless reactive stream emitter.                  │
│  - Blind to REST endpoints, network state, or credentials.│
├────────────────────────────────────────────────────────┤
│  data-ln-*-connector (Child 2: Transport Gateway)      │
│  - Manages HTTP REST/WebSockets/CouchDB channels.     │
│  - Agnostic to schemas and data transformation maps.   │
├────────────────────────────────────────────────────────┤
│  data-ln-api-queue (Child 3: Offline Outbox - Optional)│
│  - IndexedDB outbox (ln_api_queue) for offline edits.  │
│  - FIFO-per-chain queuing with retry backoffs.         │
└────────────────────────────────────────────────────────┘
```

---

## 2. Ingress & Egress Data Mapping

To bridge server-side API payloads with local normalized cache formats, coordinators use compiled JavaScript mapping functions registered globally with the core registry.

> [!CAUTION]
> **No Inline Script Mappers:** Insecure inline mapping using `<script data-ln-mapper>` is deprecated and disabled. Storing executable scripts inside HTML attributes violates Content Security Policies (CSP) and relies on unsafe execution wrappers (`eval`/`new Function`) vulnerable to cross-site scripting (XSS).

### Safe Registry Mappers
Mappers must be declared inside compiled JS modules using `registerDataMapper`:

```javascript
import { registerDataMapper } from '../../ln-core';

registerDataMapper('documents', {
  // INGRESS: Server Raw API -> Local Cache Database Format
  ingress(serverRaw) {
    return {
      id: serverRaw.id,
      title: serverRaw.title,
      file_size: serverRaw.file_size_bytes,
      updated_at: Date.parse(serverRaw.updated_at) / 1000
    };
  },
  // EGRESS: Local Cache Database -> Server Payload Format
  egress(localDb) {
    return {
      title: localDb.title,
      file_size_bytes: localDb.file_size,
      updated_at: new Date(localDb.updated_at * 1000).toISOString()
    };
  }
});
```

Binding is declared in HTML using the mapping reference (where the coordinator itself is a hidden `<ul>` and its headless configuration children are `<li>` elements):
```html
<ul data-ln-data-coordinator="documents" data-ln-data-mapper="documents" hidden>
    <li data-ln-data-store data-ln-store-indexes="status"></li>
    <li data-ln-rest-connector data-ln-rest-base-url="/api" data-ln-rest-path="/documents"></li>
</ul>
```

---

## 3. The Optimistic & Offline Write Pipeline

When a user submits a mutation (Create, Update, Delete), `ln-ashlar` routes the transaction through a parallel fan-out pipeline:

```
Submit Form ──> Document-level Native Submit Intercept (preventDefault)
                      │
                      ├──> Optimistic Cache Write (IndexedDB) ──> Update UI (Instant)
                      │
             Parallel Outbound Path
                      │
           ┌──────────┴──────────┐
           ▼                     ▼
     [Direct Path]        [Queued Path]
     (No API Queue)       (data-ln-api-queue present)
           │                     │
     REST Request          Enqueue in Outbox DB
           │                     │
     Reconcile (2xx/409)   Drain Head in FIFO order
```

### A. Direct Pipeline (Queue Absent)
1. **Submit Intake:** `ln-data-coordinator` claims the native submit (bubble phase) at the document level via `preventDefault()`, serializes inputs, and applies egress mapping.
2. **Optimistic Mutation:** The coordinator dispatches `ln-store:request-create` (or `request-update`/`request-delete`) to the store. The store updates IndexedDB with a temporary ID (`_temp_<uuid>`). Bound view components refresh instantly.
3. **API Submission:** The coordinator dispatches `ln-api-connector:request-create` directly to the connector carrying the payload.
4. **Reconciliation (2xx/409):** 
   - On success (`2xx`), the connector returns the server record. The coordinator dispatches `ln-store:request-update` to swap the temporary ID with the permanent database ID.
   - On conflict (`409` on update), the server wins; the coordinator forces the server's remote record into the cache.
   - On rejection (deterministic `4xx` on create), the coordinator dispatches `ln-store:request-delete` to discard the temporary record.

### B. Persistent Offline Pipeline (Queue Present)
If the optional `data-ln-api-queue` element is present:
1. **Enqueue:** Instead of calling the connector directly, the coordinator serializes the mutation into the outbox database (`ln_api_queue`) carrying the base resource URL in its metadata.
2. **FIFO Chains:** Operations are queued in FIFO order per record chain (based on primary key or temporary ID).
3. **API Drain:** While online, the queue dispatches `ln-api-queue:send` for head items. The coordinator intercepts this and directs the connector to perform the REST request.
4. **Id Remapping:** On successful creation, the coordinator dispatches `ln-api-queue:request-remap` to update subsequent queued updates targeting that temporary ID *before* acknowledging the completed entry (`ack`).
5. **Retries:** Network/5xx failures retry using exponential backoffs (`2s, 5s, 15s, 60s, 300s`). After 8 failures, the queue pauses and flags the item for manual correction.
6. **Authentication Pauses:** A `401`/`419` response pauses the queue and emits `auth-required`. The user's optimistic writes remain visible in the UI while they re-authenticate, after which the coordinator resumes the queue via `request-resume`.
