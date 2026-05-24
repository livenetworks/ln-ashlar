# `data-ln-couchdb-connector`

A zero-dependency, Local-First sync transport component that implements the Transport Gateway pattern of `ln-ashlar` for CouchDB and Sync Gateway instances.

This component encapsulates all connection parameters (CouchDB base URL, database name, auth credentials, headers) and provides a declarative, event-driven, or programmatic way to talk to any CouchDB-compatible backend using standard Changes Feed (`_changes`) protocols. It isolates networking concerns completely, making your cache store (`data-ln-data-store`) and visual presentation layers fully network-agnostic.

---

## Declarative DOM Setup

Place the connector inside your parent coordinator element alongside your store:

```html
<div data-ln-data-coordinator="tasks">
    <!-- Storage Layer Cache (Blind to networking) -->
    <div data-ln-data-store 
         data-ln-store-indexes="due_date,priority">
    </div>

    <!-- Transport Gateway (CouchDB Connector) -->
    <div data-ln-couchdb-connector 
         data-ln-couchdb-url="https://couch.livenetworks.com"
         data-ln-couchdb-db="tasks"
         data-ln-couchdb-auth="Basic dXNlcjpwYXNz">
    </div>
</div>
```

---

## Attributes

All attributes are dynamically observed. Any runtime changes to these attributes instantly update the connector's internal configurations.

| Attribute | Category | Description |
|-----------|----------|-------------|
| `data-ln-couchdb-connector` | Selector | Creates the component instance. |
| `data-ln-couchdb-url` | Connection | The base URL of the CouchDB Server or Sync Gateway (e.g. `https://couch.example.com`). Fallbacks: `data-ln-couchdb-connector-url`, `data-ln-api-base-url`, `data-ln-rest-base-url`. |
| `data-ln-couchdb-db` | Connection | Database name endpoint (e.g. `tasks`). Fallbacks: `data-ln-couchdb-connector-db`, `data-ln-api-path`, `data-ln-rest-path`. |
| `data-ln-couchdb-auth` | Credentials | Authorization header value (e.g. `Basic dXNlcjpwYXNz` or standard token). |
| `data-ln-couchdb-headers` | Credentials | JSON-formatted string of custom request headers. |

---

## JavaScript API Methods

You can access the instance methods directly on the element via the `.lnCouchDbConnector` or `.lnConnector` properties:

```javascript
const connectorEl = document.querySelector('[data-ln-couchdb-connector]');
const connector = connectorEl.lnCouchDbConnector; // or connectorEl.lnConnector

// 1. Fetch changed records since a sequence ID (CouchDB delta protocol)
connector.fetchDelta("1-g1AAA...")
    .then(payload => {
        console.log('Upserted docs:', payload.data);
        console.log('Deleted IDs:', payload.deleted);
        console.log('New sync seq:', payload.synced_at);
    });

// 2. Create a new document (maps payload to CouchDB _id if id is provided)
connector.create({ title: 'New task', priority: 'High' })
    .then(doc => console.log('Created CouchDB document:', doc));

// 3. Update an existing document (handles _rev fetching automatically if omitted)
connector.update("doc_123", { title: 'Updated Task Title' })
    .then(doc => console.log('Updated CouchDB document:', doc));

// 4. Delete a document (handles _rev fetching automatically if omitted)
connector.delete("doc_123")
    .then(res => console.log('Deleted successfully:', res));

// 5. Bulk Delete records (queries all revisions first, then performs _bulk_docs deletion)
connector.bulkDelete(["doc_17", "doc_23"])
    .then(res => console.log('Bulk deleted result:', res));
```

---

## DOM Events

### Commands (Dispatched TO the connector)

You can trigger mutations and fetches asynchronously by dispatching standard events directly on the connector DOM element. All events are supported in `ln-couchdb-connector`, `ln-api-connector`, and `ln-rest-connector` namespaces for 100% backward compatibility.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-couchdb-connector:request-sync` | `{ since }` | Triggers a Changes Feed fetch request. |
| `ln-couchdb-connector:request-create` | `{ data, tempId }` | Triggers a creation request. |
| `ln-couchdb-connector:request-update` | `{ id, data, expected_version }` | Triggers a PUT update (expected_version maps to CouchDB's revision). |
| `ln-couchdb-connector:request-delete` | `{ id, rev }` | Triggers a deletion request. |
| `ln-couchdb-connector:request-bulk-delete` | `{ ids }` | Triggers a bulk-deletion request. |

### Notifications (Emitted BY the connector)

The connector dispatches bubbles-enabled events to notify parent coordinators of response states.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-couchdb-connector:fetched` | `{ data, since }` | Dispatched upon successful fetch completion. |
| `ln-couchdb-connector:created` | `{ record, tempId }` | Dispatched upon successful server record confirmation. |
| `ln-couchdb-connector:updated` | `{ record, id }` | Dispatched upon successful server update confirmation. |
| `ln-couchdb-connector:deleted` | `{ response, id }` | Dispatched upon successful server deletion. |
| `ln-couchdb-connector:bulk-deleted`| `{ response, ids }` | Dispatched upon successful server bulk deletion. |
| `ln-couchdb-connector:error` | `{ action, error, status, ... }` | Dispatched on failures. Includes `conflictData` if status is 409. |
| `ln-couchdb-connector:config-changed` | `{ url, db, auth, headers }` | Dispatched when configuration attributes are mutated. |

---

## 3-Tier Integration Architecture (Coordinator Example)

Here is how a parent Coordinator links a Cache Store and the CouchDB Connector using standard DOM events:

```javascript
(function () {
    const parent = document.querySelector('[data-ln-data-coordinator="tasks"]');
    const storeEl = parent.querySelector('[data-ln-data-store]');
    const connectorEl = parent.querySelector('[data-ln-couchdb-connector]');

    if (!storeEl || !connectorEl) return;

    // 1. Storage needs remote sync -> forward request to CouchDB Connector
    storeEl.addEventListener('ln-store:request-remote-sync', function (e) {
        connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-sync', {
            detail: { since: e.detail.since }
        }));
    });

    // 2. CouchDB Connector finishes changes feed sync -> feed delta back to Storage
    connectorEl.addEventListener('ln-couchdb-connector:fetched', function (e) {
        const payload = e.detail.data;
        // payload: { data: Array, deleted: Array, synced_at: String }
        storeEl.lnStore.applySync(payload.data, payload.deleted || [], payload.synced_at);
    });

    // 3. Storage requests remote creation -> forward payload to CouchDB Connector
    storeEl.addEventListener('ln-store:request-remote-create', function (e) {
        connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-create', {
            detail: { data: e.detail.data, tempId: e.detail.tempId }
        }));
    });

    // 4. CouchDB Connector confirms creation -> swap optimistic temp records in Storage
    connectorEl.addEventListener('ln-couchdb-connector:created', function (e) {
        storeEl.lnStore.confirmMutation(e.detail.tempId, e.detail.record, 'create');
    });

    // 5. In case of network errors -> trigger rollback in Cache Store
    connectorEl.addEventListener('ln-couchdb-connector:error', function (e) {
        if (e.detail.action === 'create') {
            storeEl.lnStore.revertMutation(e.detail.tempId, 'create', e.detail.error);
        }
        // ... handle updates and deletions similarly
    });
})();
```
