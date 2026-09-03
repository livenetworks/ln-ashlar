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
         data-ln-data-store-indexes="due_date,priority">
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
| `data-ln-couchdb-url` | Connection | The base URL of the CouchDB Server or Sync Gateway (e.g. `https://couch.example.com`). |
| `data-ln-couchdb-db` | Connection | Database name endpoint (e.g. `tasks`). |
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

You can trigger mutations and fetches asynchronously by dispatching standard events directly on the connector DOM element. All events are supported in both `ln-couchdb-connector` and `ln-api-connector` namespaces.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-couchdb-connector:request-sync` | `{ since }` | Triggers a Changes Feed fetch request. |
| `ln-couchdb-connector:request-create` | `{ data, tempId, idempotencyKey? }` | Triggers a creation request. |
| `ln-couchdb-connector:request-update` | `{ id, data, expected_version, idempotencyKey? }` | Triggers a PUT update (expected_version maps to CouchDB's revision). |
| `ln-couchdb-connector:request-delete` | `{ id, rev, idempotencyKey? }` | Triggers a deletion request. |
| `ln-couchdb-connector:request-bulk-delete` | `{ ids, idempotencyKey? }` | Triggers a bulk-deletion request. |

### Notifications (Emitted BY the connector)

The connector dispatches bubbles-enabled events to notify parent coordinators of response states.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-couchdb-connector:fetched` | `{ data, since }` | Dispatched upon successful fetch completion. |
| `ln-couchdb-connector:created` | `{ record, tempId, message, meta }` | Dispatched upon successful server record confirmation. `message` opaque from the response envelope (null if absent). `meta` echoes the request's `meta` unchanged. |
| `ln-couchdb-connector:updated` | `{ record, id, message, meta }` | Dispatched upon successful server update confirmation. |
| `ln-couchdb-connector:deleted` | `{ response, id, message, meta }` | Dispatched upon successful server deletion. |
| `ln-couchdb-connector:bulk-deleted`| `{ response, ids, message, meta }` | Dispatched upon successful server bulk deletion. |
| `ln-couchdb-connector:error` | `{ action, error, status, meta, ... }` | Dispatched on failures. Update errors additionally include `data`/`conflictData` (same value) if status is 409. `meta` echoes the request's `meta` unchanged — required for coordinator-side queue ack/nack and id-swap reconciliation. |
| `ln-couchdb-connector:config-changed` | `{ url, db, auth, headers }` | Dispatched when configuration attributes are mutated. |

---

## Mutation Response Envelope

`create`/`update`/`delete`/`bulkDelete` presence-check the parsed JSON body for an optional `{ message, content }` envelope, mirroring `ln-api-connector`'s contract:

- `content` present → used as the CouchDB response body (`{id, rev}` etc.) in place of the bare body.
- `message` present → passed opaquely on the `:created`/`:updated`/`:deleted`/`:bulk-deleted` event detail; a coordinator surfaces it as a success toast. Absent → `message: null`, no toast.
- Raw CouchDB never sends this envelope — `content` falls back to the bare body, `message` is always `null`, so a direct CouchDB backend never produces a toast. A proxy/gateway placed in front of CouchDB (e.g. to add cross-cutting audit messages) can opt in by wrapping its response in `{ message, content }`.
- `fetchDelta` (sync) is NOT part of this envelope — sync keeps its own `{ data, deleted, synced_at }` collection-delta shape.
- The JS API methods (`create`, `update`, `delete`, `bulkDelete`) resolve to the SAME shape as before this change (record / record / response / response) — the envelope unwrap is internal; direct JS callers are unaffected. `message` is only surfaced via the DOM-event path (`:created`/`:updated`/`:deleted`/`:bulk-deleted` `detail.message`).

---

## 3-Tier Integration Architecture (Coordinator Example)

Here is how a parent Coordinator links a Cache Store and the CouchDB Connector using standard DOM events:

```js
(function () {
    const parent = document.querySelector('[data-ln-data-coordinator="tasks"]');
    // ln-data-coordinator wires store <-> connector automatically once both
    // are present in its subtree — no hand-written glue is needed for the
    // write pipeline. This snippet only illustrates what the coordinator
    // does internally; in a real page, just declare the markup (see
    // "Declarative DOM Setup" above) and let ln-data-coordinator do the rest.

    // Server confirmation reconciles via an ORDINARY store update (id-swap),
    // not a special confirm/revert method:
    //   connectorEl.addEventListener('ln-couchdb-connector:created', function (e) {
    //       const meta = e.detail.meta || {};
    //       storeEl.dispatchEvent(new CustomEvent('ln-data-store:request-update', {
    //           detail: { id: meta.tempId, data: e.detail.record }
    //       }));
    //   });
    //
    // See components/ln-data-coordinator/README.md for the full fan-out + error
    // reconciliation policy (auth/transient/deterministic) that ships with
    // the coordinator — this connector never needs to be wired by hand.
})();
```

---

## 🔧 Internals

Source: `components/ln-couchdb-connector/*`. Bridges CouchDB's revision-based (`_rev`) document protocol and `_changes`/`_bulk_docs` endpoints to the same coordinator-facing event contract as `ln-api-connector`.

### Sync flow

`request-sync {since}` → `GET /{db}/_changes?include_docs=true&since=<since>` → maps `rows.doc` to `{..., id: _id}` and `rows.deleted` to `deletedIds` → `:fetched { data, deleted, synced_at }`. The coordinator hands this straight to `store.applySync`.

### Revision resolution (zero-friction `_rev`)

Every update/delete payload is inspected for `_rev`/`rev`. If present, `PUT`/`DELETE` fires immediately with `If-Match`. If absent, the connector first `GET`s the current document to read `_rev`, then issues the mutation — callers never need to track revisions themselves. A `409 Conflict` fires `:error` with `status: 409` and `data`/`conflictData` set to CouchDB's raw `{error, reason}` body. Unlike a REST backend, CouchDB's 409 carries no document snapshot, so the coordinator's server-wins reconciliation is a no-op on this path — only the error toast fires; the optimistic local write stays in place until the next sync reconciles it.

### ID translation

Ingress: every fetched/created/updated document gets `id = _id` before reaching the coordinator. Egress: `create`/`update` map `id` back to `_id` before the request body is sent. The mapping is entirely internal — JS API callers and DOM-event consumers never see `_id`.

### Bulk delete

1. `POST /{db}/_all_docs` with `{"keys": [...]}` to resolve current `_rev` per id.
2. Filter out any ids that errored or are missing.
3. Build `{_id, _rev, _deleted: true}` per surviving doc.
4. `POST /{db}/_bulk_docs` with the array.

### Envelope unwrap

Same `{message, content}` presence-check as `ln-api-connector` (see its README) — `content` replaces the bare CouchDB body when present, `message` rides opaquely on the `:created`/`:updated`/`:deleted`/`:bulk-deleted` event detail. Raw CouchDB never sends this envelope, so a direct CouchDB backend never toasts; only a proxy/gateway that wraps responses can opt in.
