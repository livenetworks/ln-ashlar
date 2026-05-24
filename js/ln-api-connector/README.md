# `data-ln-api-connector`

A zero-dependency, Local-First sync transport component that implements the Transport Gateway pattern of `ln-ashlar`.

This component encapsulates all connection parameters (base URLs, auth tokens, headers, paths) and provides a declarative, event-driven, or programmatic way to talk to any RESTful or JSON API backend. It isolates networking concerns completely, making your cache store (`data-ln-data-store`) and visual presentation layers fully network-agnostic.

---

## Declarative DOM Setup

Place the connector inside your parent coordinator element alongside your store:

```html
<div data-ln-data-coordinator="documents">
    <!-- Storage Layer Cache (Blind to networking) -->
    <div data-ln-data-store 
         data-ln-store-indexes="status,updated_at">
    </div>

    <!-- Transport Gateway (REST / API Connector) -->
    <div data-ln-api-connector
         data-ln-api-base-url="https://api.livenetworks.com/v1"
         data-ln-api-path="/documents"
         data-ln-api-headers='{"Authorization": "Bearer tok_123"}'>
    </div>
</div>
```

---

## Attributes

All attributes are dynamically observed. Any runtime changes to these attributes instantly update the connector's internal configurations.

| Attribute | Category | Description |
|-----------|----------|-------------|
| `data-ln-api-connector` | Selector | Creates the component instance. Optional value serves as name. |
| `data-ln-api-base-url` | Connection | The base URL of the API gateway (e.g. `https://api.example.com/v1` or `/api`). Fallback: `data-ln-api-connector-base-url`, `data-ln-rest-base-url`. |
| `data-ln-api-path` | Connection | Resource path endpoint (e.g. `/documents`). Fallback: `data-ln-api-connector-path`, `data-ln-rest-path`. |
| `data-ln-api-headers` | Credentials | JSON-formatted string of request headers (e.g. `{"Authorization": "Bearer tok_123"}`). Fallback: `data-ln-api-connector-headers`, `data-ln-rest-headers`. |

---

## JavaScript API Methods

You can access the instance methods directly on the element via the `.lnApiConnector` or `.lnConnector` properties:

```javascript
const connectorEl = document.querySelector('[data-ln-api-connector]');
const connector = connectorEl.lnApiConnector; // or connectorEl.lnConnector

// 1. Fetch changed records since a Unix timestamp (delta protocol)
connector.fetchDelta(1736952600)
    .then(data => console.log('Sync arrays loaded:', data));

// 2. Create a new record
connector.create({ title: 'New Document', status: 'Draft' })
    .then(record => console.log('Created record:', record));

// 3. Update an existing record
connector.update(42, { title: 'Updated Title' })
    .then(record => console.log('Updated record:', record));

// 4. Delete a record
connector.delete(42)
    .then(res => console.log('Deleted:', res));

// 5. Bulk Delete records
connector.bulkDelete([17, 23])
    .then(res => console.log('Bulk deleted:', res));
```

---

## DOM Events

### Commands (Dispatched TO the connector)

You can trigger mutations and fetches asynchronously by dispatching standard events directly on the connector DOM element. All events are supported in both `ln-api-connector` and legacy `ln-rest-connector` namespaces.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-api-connector:request-sync` | `{ since }` | Triggers a delta fetch request. |
| `ln-api-connector:request-create` | `{ data, tempId }` | Triggers a creation request. |
| `ln-api-connector:request-update` | `{ id, data, expected_version }` | Triggers a PUT update (supports 409 conflict checks). |
| `ln-api-connector:request-delete` | `{ id }` | Triggers a deletion request. |
| `ln-api-connector:request-bulk-delete` | `{ ids }` | Triggers a bulk-deletion request. |

### Notifications (Emitted BY the connector)

The connector dispatches bubbles-enabled events to notify parent coordinators of response states.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-api-connector:fetched` | `{ data, since }` | Dispatched upon successful fetch completion. |
| `ln-api-connector:created` | `{ record, tempId }` | Dispatched upon successful server record confirmation. |
| `ln-api-connector:updated` | `{ record, id }` | Dispatched upon successful server update confirmation. |
| `ln-api-connector:deleted` | `{ response, id }` | Dispatched upon successful server deletion. |
| `ln-api-connector:bulk-deleted`| `{ response, ids }` | Dispatched upon successful server bulk deletion. |
| `ln-api-connector:error` | `{ action, error, status, ... }` | Dispatched on failures. Includes `conflictData` if status is 409. |
| `ln-api-connector:config-changed` | `{ baseUrl, path, headers }` | Dispatched when configuration attributes are mutated. |

---

## 3-Tier Integration Architecture (Coordinator Example)

Here is how a parent Coordinator links a Cache Store and the API Connector using standard DOM events:

```javascript
(function () {
    const parent = document.querySelector('[data-ln-data-coordinator="documents"]');
    const storeEl = parent.querySelector('[data-ln-data-store]');
    const connectorEl = parent.querySelector('[data-ln-api-connector]');

    if (!storeEl || !connectorEl) return;

    // 1. Storage needs remote sync -> forward request to Connector
    storeEl.addEventListener('ln-store:request-remote-sync', function (e) {
        connectorEl.dispatchEvent(new CustomEvent('ln-api-connector:request-sync', {
            detail: { since: e.detail.since }
        }));
    });

    // 2. Connector finishes sync -> feed delta back to Storage
    connectorEl.addEventListener('ln-api-connector:fetched', function (e) {
        const payload = e.detail.data;
        storeEl.lnStore.applySync(payload.data, payload.deleted || [], payload.synced_at);
    });

    // 3. Storage requests remote creation -> forward payload to Connector
    storeEl.addEventListener('ln-store:request-remote-create', function (e) {
        connectorEl.dispatchEvent(new CustomEvent('ln-api-connector:request-create', {
            detail: { data: e.detail.data, tempId: e.detail.tempId }
        }));
    });

    // 4. Connector confirms creation -> swap optimistic temp records in Storage
    connectorEl.addEventListener('ln-api-connector:created', function (e) {
        storeEl.lnStore.confirmMutation(e.detail.tempId, e.detail.record, 'create');
    });

    // 5. In case of network errors -> trigger rollback in Cache Store
    connectorEl.addEventListener('ln-api-connector:error', function (e) {
        if (e.detail.action === 'create') {
            storeEl.lnStore.revertMutation(e.detail.tempId, 'create', e.detail.error);
        }
        // ... handle updates and deletions similarly
    });
})();
```
