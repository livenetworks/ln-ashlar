# Data Store & Coordinator Architecture Reference

This document outlines the core architecture of the 3-Tier Local-First Data Layer in `ln-ashlar`. It defines how data storage, transport, and schema mapping are decoupled and orchestrated using the **`ln-ashlar` Coordinator Doctrine**. For a comprehensive guide on what coordinators are and how they operate across the entire library, see the [Coordinator Doctrine Reference](coordinator.md).

In this model, a parent **Data Coordinator Component (`data-ln-data-coordinator`)** wraps its child components—a pure **Storage Cache (`data-ln-data-store`)** and a **Transport Gateway (`data-ln-*-connector`)**—and coordinates the entire data lifecycle.

---

## 🧭 The Decoupled 3-Tier Hierarchy (DOM-Tree View)

Below is the visual structure representing how elements are nested in the DOM, isolating storage and transport concerns under the parent coordinator.

```
┌────────────────────────────────────────────────────────────────────────┐
│  DOM: <div data-ln-data-coordinator="documents">                       │
│                                                                        │
│  [COORDINATOR (Parent Brain)]                                          │
│  - Traverses and monitors its DOM children                             │
│  - Captures optimistic writes & request-sync events                    │
│  - Executes JS Ingress/Egress data restructuring                       │
│                                                                        │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │  DOM: <div data-ln-data-store>                             │     │
│     │                                                            │     │
│     │  [STORAGE CACHE DATABASE (Child 1)]                        │     │
│     │  - Standard IndexedDB storage, schemas, & indexes          │     │
│     │  - Pure local queries (filter, sort, search)               │     │
│     │  - Reactive event dispatching to UI tables & lists         │     │
│     │  - ZERO awareness of REST paths, socket URLs, or cookies   │     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                        │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │  DOM: <div data-ln-rest-connector>                         │     │
│     │                                                            │     │
│     │  [TRANSPORT GATEWAY (Child 2)]                             │     │
│     │  - Manages secure connection pathways, endpoints, & sync   │     │
│     │  - Agnostic of store data schema and Ingress/Egress mappers│     │
│     └────────────────────────────────────────────────────────────┘     │
│                                                                        │
│     ┌────────────────────────────────────────────────────────────┐     │
│     │  JS REGISTRY: window.lnCore.getDataMapper('documents')     │     │
│     │                                                            │     │
│     │  [JS MAPPER LOGIC (Secure Compiled Registry Mapper)]       │     │
│     │  - Defines ingress(serverRaw) and egress(localDb)          │     │
│     │  - Safe against XSS; strict CSP-compliant (no dynamic eval)│     │
│     └────────────────────────────────────────────────────────────┘     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 1. System Flow Diagram

The diagram below maps how the DOM boundary isolates system flows. The UI presentation components interact only with the local Storage child, while the parent Coordinator wires the Storage cache and Transport gateway together.

```mermaid
flowchart TD
    %% DOM Boundaries
    subgraph UI ["1. Presentation Layer (UI)"]
        Table["ln-data-table / Grid"]
        Form["ln-form / Modal Editor"]
    end

    subgraph Subtree ["DOM: data-ln-data-coordinator"]
        Coord["data-ln-data-coordinator (Parent Orchestrator)"]
        Mapper["Registry Data Mapper (Ingress/Egress)"]
        Store["data-ln-data-store (Local Cache)"]
        Connector["data-ln-*-connector (Transport)"]
    end

    subgraph Backend ["Server Backend Gateway"]
        API["REST API / WebSockets / CouchDB Sync Gateway"]
    end

    %% UI Interaction (Storage Layer only)
    Table -- "Queries locally" --> Store
    Table -- "Listens to store changes" --> Store
    Form -- "Dispatches request-create/update" --> Store

    %% Parent-Child Coordination Loop
    Coord -- "Monitors and intercepts events" --> Store
    Coord -- "Reads mapping functions" --> Mapper
    Coord -- "Applies Ingress/Egress data restructuring" --> Coord
    Coord -- "Updates cache / confirms mutations" --> Store
    Coord -- "Triggers fetch / socket sync" --> Connector

    %% Transport Boundary
    Connector <--> API
```

---

## 2. Declarative HTML Setup

All transport-specific connection properties (base URLs, endpoints, and path configs) are kept strictly inside the **Transport child component**, completely removing connectivity configuration from the parent Coordinator.

> [!WARNING]
> **Credential Safety**: Never hardcode credentials, session tokens, or authentication headers inside HTML attributes. `ln-ashlar` transport components are designed to use secure, browser-managed HttpOnly session cookies (by implicitly sending `credentials: 'same-origin'`). Alternatively, use a secure Same-Origin backend API Proxy Gateway. See [Security Architecture & Best Practices](security.md) for full context.

### Scenario A: REST API Resource Coordinator
```html
<!-- Parent Coordinator: encapsulates documents domain, no gateway or path attributes -->
<div data-ln-data-coordinator="documents" data-ln-data-mapper="demo-docs">
     
    <!-- Child 1: Storage Layer (IndexedDB Database Cache - pure and blind) -->
    <div data-ln-data-store 
         data-ln-store-indexes="department,status,updated_at">
    </div>

    <!-- Child 2: Transport Gateway (REST Connector - owns path and base URL) -->
    <div data-ln-rest-connector 
         data-ln-rest-base-url="https://api.livenetworks.com/v1"
         data-ln-rest-path="/documents">
    </div>
</div>
```

### Scenario B: WebSocket Real-Time Coordinator
```html
<div data-ln-data-coordinator="chat-messages">

    <!-- Child 1: Storage Cache -->
    <div data-ln-data-store 
         data-ln-store-indexes="timestamp">
    </div>

    <!-- Child 2: Transport Gateway (WebSocket Connector - owns ws URL and channel) -->
    <div data-ln-websocket-connector 
         data-ln-websocket-url="wss://api.livenetworks.com/realtime"
         data-ln-websocket-channel="rooms:lobby">
    </div>
</div>
```

### Scenario C: CouchDB Sync Gateway Coordinator
```html
<div data-ln-data-coordinator="tasks">

    <!-- Child 1: Storage Cache -->
    <div data-ln-data-store 
         data-ln-store-indexes="due_date,priority">
    </div>

    <!-- Child 2: Transport Gateway (CouchDB Sync Connector - owns db details and local sync endpoint) -->
    <div data-ln-couchdb-connector 
         data-ln-couchdb-url="https://couch.livenetworks.com"
         data-ln-couchdb-db="tasks">
    </div>
</div>
```

---

## 3. Ingress & Egress Data Restructuring (Secure Mapper)

To support flexibility while maintaining strict security, data restructuring is represented by a JavaScript Ingress/Egress contract registered securely via the compiled **Core Mapper Registry**.

> [!CAUTION]
> **Deprecated Evaluation**: Inline script mappers using `<script data-ln-mapper>` are deprecated and disabled. Storing executable logic inside HTML tags violates strict Content Security Policies (CSP) and relies on insecure execution vectors (`new Function` / `eval`) which are vulnerable to XSS credential extraction.

### JS-Registered Domain Mappers (Standard & Secure)
This is the standard secure pattern. Define and compile your mapping logic within your application's compiled modules, registering them globally with the core framework barrel.

```javascript
// js/domain/mappers/documents.js
import { registerDataMapper } from '../../ln-core';

registerDataMapper('documents', {
  // INGRESS: Server Raw -> Local IndexedDB Cache
  ingress(serverRaw) {
    return {
      id: serverRaw.id,
      title: serverRaw.title,
      file_size: serverRaw.file_size_bytes,
      updated_at: Date.parse(serverRaw.updated_at) / 1000,
      author_name: serverRaw.author?.name || 'System'
    };
  },
  // EGRESS: Local IndexedDB Cache -> Server Raw payload
  egress(localDb) {
    return {
      title: localDb.title,
      file_size_bytes: localDb.file_size,
      updated_at: new Date(localDb.updated_at * 1000).toISOString()
    };
  }
});
```

This mapper is then bound cleanly and safely in HTML via a reference attribute:
```html
<div data-ln-data-coordinator="documents" data-ln-data-mapper="documents">
    <!-- Child 1: Database Store Cache -->
    <div data-ln-data-store data-ln-store-indexes="department,status"></div>

    <!-- Child 2: Transport Connector Gateway -->
    <div data-ln-rest-connector data-ln-rest-base-url="/api" data-ln-rest-path="/documents"></div>
</div>
```

---

## 4. How the Coordinator Orchestrates the Loop (Illustrative Reference)

*Note: This is an illustrative execution skeleton showing how the Coordinator manages the event loop between the storage and transport child nodes.*

```javascript
// Inside ln-data-coordinator initialization:
function _initCoordinator(self) {
  const storeEl = self.dom.querySelector('[data-ln-data-store]');
  const transportEl = self.dom.querySelector('[data-ln-rest-connector], [data-ln-websocket-connector], [data-ln-couchdb-connector]');
  
  if (!storeEl || !transportEl) return;

  // Resolve the mapper (either inline from script or registered external mapper)
  const mapper = _resolveMapper(self);

  // ─── 1. Intercept Delta Sync Triggers ───
  storeEl.addEventListener('ln-store:request-sync', function(e) {
    const since = e.detail.since;
    
    // Coordinator asks transport to fetch raw delta data
    transportEl.lnConnector.fetchDelta(since).then(function(rawResponse) {
      // Apply INGRESS transformation on server raw data
      const normalizedData = rawResponse.data.map(r => mapper.ingress(r));
      const normalizedDeleted = (rawResponse.deleted || []);

      // Coordinator feeds clean data back to store's database cache
      storeEl.lnStore.applySync(normalizedData, normalizedDeleted, rawResponse.synced_at);
    });
  });

  // ─── 2. Intercept Optimistic Mutations (Write Egress) ───
  storeEl.addEventListener('ln-store:optimistic-created', function(e) {
    const localRecord = e.detail.record;
    
    // Apply EGRESS transformation before sending to server
    const serverPayload = mapper.egress(localRecord);

    transportEl.lnConnector.create(serverPayload)
      .then(function(serverRawResponse) {
        // Run Ingress on the confirmed server response
        const confirmedLocalRecord = mapper.ingress(serverRawResponse);
        
        // Confirm write back in store's database cache
        storeEl.lnStore.confirmMutation(e.detail.tempId, confirmedLocalRecord, 'create');
      })
      .catch(function(err) {
        // Revert write back in store
        storeEl.lnStore.revertMutation(e.detail.tempId, 'create', err);
      });
  });
}

function _resolveMapper(self) {
  // 1. Scan for deprecated/insecure inline script mapper
  const inlineScript = self.dom.querySelector('script[data-ln-mapper]');
  if (inlineScript) {
    console.error('[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.');
  }

  // 2. Resolve to registered external mapper
  const mapperName = self.dom.getAttribute('data-ln-data-mapper') || self.dom.getAttribute('data-ln-data-coordinator');
  if (mapperName) {
    return window.lnCore.getDataMapper(mapperName);
  }

  // 3. Ultimate safe fallback: no-op mapper
  return { ingress: r => r, egress: r => r };
}
```
