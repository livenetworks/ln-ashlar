# `data-ln-couchdb-connector` Architecture Reference

This document describes the internal state, protocol mappings, and event lifecycles of the CouchDB Sync Gateway Transport Connector component (`data-ln-couchdb-connector`).

---

## Protocol Lifecycle Mapping

CouchDB and Sync Gateways rely on document-revision protocols (`_rev` identifiers) and a sequencing changes feed (`_changes` feed). This connector bridges standard relational cache actions into CouchDB-compliant REST invocations.

```mermaid
sequenceDiagram
    participant Coordinator as data-ln-data-coordinator
    participant Store as data-ln-data-store
    participant Connector as data-ln-couchdb-connector
    participant CouchDB as CouchDB Sync Gateway

    %% INITIAL LOAD / DELTA FETCH
    Store->>Coordinator: Event: ln-store:request-remote-sync (since: "1-g1A...")
    Coordinator->>Connector: Event: ln-couchdb-connector:request-sync (since: "1-g1A...")
    Connector->>CouchDB: GET /{db}/_changes?include_docs=true&since=1-g1A...
    CouchDB-->>Connector: JSON changes feed (results, last_seq)
    Note over Connector: Map rows.deleted -> deletedIds<br/>Map rows.doc -> clean items (id = _id)
    Connector->>Coordinator: Event: ln-couchdb-connector:fetched (data: { data, deleted, synced_at })
    Coordinator->>Store: applySync(data, deleted, synced_at)

    %% OPTIMISTIC UPDATE
    Store->>Coordinator: Event: ln-store:request-remote-update (id: doc1, data: {...})
    Coordinator->>Connector: Event: ln-couchdb-connector:request-update (id: doc1, data: {...})
    alt Has revision in memory
        Connector->>CouchDB: PUT /{db}/doc1 with If-Match (revision)
    else Revision missing in memory
        Connector->>CouchDB: GET /{db}/doc1 (Retrieve current _rev)
        CouchDB-->>Connector: Document with _rev
        Connector->>CouchDB: PUT /{db}/doc1 with If-Match (fetched revision)
    end
    CouchDB-->>Connector: JSON confirmation (ok: true, rev: "2-xyz...")
    Note over Connector: Merge _rev back into local record
    Connector->>Coordinator: Event: ln-couchdb-connector:updated (record)
    Coordinator->>Store: confirmMutation(doc1, record, 'update')
```

---

## Key Design Patterns

### 1. Zero-Friction Revisions Integration
CouchDB requires the active revision string `_rev` for document modifications and deletions to prevent data overwrites. To make integrations friction-free, the connector:
- Inspects the update payload for `_rev` or `rev`.
- If absent, it proactively fetches the current document state via a fast HTTP `GET` query to resolve the revision before proceeding with the `PUT` or `DELETE` mutation.
- When conflicts (`409 Conflict`) occur on CouchDB, the connector captures the standard error, constructs a `conflictData` payload, and dispatches `ln-couchdb-connector:error` with status `409` to prompt coordinate-level conflict merges.

### 2. Standard ID Translation
CouchDB utilizes `_id` as the primary key. In `ln-ashlar` cache-store databases, records are accessed via the standard `id` field. The CouchDB connector solves this mapping mismatch transparently:
- **Ingress Mapping**: Every document fetched via `_changes` gets mapped so that `id = _id` before forwarding to the Coordinator.
- **Egress Mapping**: Creators and updates automatically map the `id` property to `_id` before uploading payloads to CouchDB database endpoints.

### 3. Bulk Deletes Coordination
To execute bulk deletions safely, the connector first calls standard CouchDB `_all_docs` querying only target document revisions:
1. `POST /{db}/_all_docs` with `{"keys": [id1, id2, ...]}`
2. Filters out errors or missing documents to compile current revisions (`rev`).
3. Formulates a bulk operation array where each doc contains `{ _id: id, _rev: rev, _deleted: true }`.
4. Executes the transaction via `POST /{db}/_bulk_docs`.
