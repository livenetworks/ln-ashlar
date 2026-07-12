# `data-ln-api-connector`

A zero-dependency, Local-First sync transport component that implements the Transport Gateway pattern of `ln-ashlar`.

This component encapsulates all connection parameters (base URLs, auth tokens, headers, paths) and provides a declarative, event-driven, or programmatic way to talk to any RESTful or JSON API backend. It isolates networking concerns completely, making your cache store (`data-ln-data-store`) and visual presentation layers fully network-agnostic.

---

## 🔒 Forced `X-LN-Response: data` Header

Every request (`fetchDelta`, `create`, `update`, `delete`, `bulkDelete`) sends
`X-LN-Response: data` in addition to any configured `data-ln-api-headers`.
This header is **forced** — it rides on all five verbs via a single internal
helper and cannot be removed or overridden by consumer-supplied headers. The
backend uses it to select a JSON "data" response mode; it doubles as a CSRF
guard.

## ⚠️ Unified 4xx / 5xx Body Parsing

Every non-2xx response (not just 409) has its JSON body parsed best-effort
and attached to the rejected error as `err.data` (`null` if the body isn't
parseable JSON), alongside `err.status`. This means server validation
messages (422, etc.) survive on every verb, not just conflict responses.

## `update(id, payload, expectedVersion, url)` — optional third/fourth argument

`update` accepts an optional third argument. When provided (not `null`/
`undefined`), the connector merges it into the outgoing PUT body as
`expected_version`: `payload = Object.assign({}, payload, { expected_version: expectedVersion })`.
This is a single merge point — the `ln-api-connector:request-update` event
path passes `detail.expected_version` straight through to it, so there is
no second place version-locking logic lives. The optional fourth argument,
`url`, when present, is treated as the COMPLETE resource URL for that call
— it already carries the record id (e.g. a form's resolved `action`
`/documents/42`), so `update()` does NOT append the id again (symmetric
with `create()`). Only the `path` fallback (no `url` given) appends the id.

```javascript
// Programmatic call with version lock
connector.update(42, { title: 'Updated title' }, 3)
    .then(record => console.log('Updated record:', record));
```

---

## Declarative DOM Setup

Place the connector inside your parent coordinator element alongside your store:

```html
<ul data-ln-data-coordinator="documents" hidden>
    <!-- Storage Layer Cache (Blind to networking) -->
    <li data-ln-data-store 
        data-ln-store-indexes="status,updated_at">
    </li>

    <!-- Transport Gateway (REST / API Connector) -->
    <li data-ln-api-connector
         data-ln-api-base-url="https://api.livenetworks.com/v1"
         data-ln-api-path="/documents"
         data-ln-api-headers='{"Authorization": "Bearer tok_123"}'>
    </li>
</ul>
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
| `ln-api-connector:request-sync` | `{ since, meta }` | Triggers a delta fetch request. |
| `ln-api-connector:request-create` | `{ data, tempId, url, meta }` | Triggers a creation request. |
| `ln-api-connector:request-update` | `{ id, data, expected_version, url, meta }` | Triggers a PUT update (supports 409 conflict checks). |
| `ln-api-connector:request-delete` | `{ id, url, meta }` | Triggers a deletion request. |
| `ln-api-connector:request-bulk-delete` | `{ ids, url, meta }` | Triggers a bulk-deletion request. |

`url` is optional — when present, it replaces the connector's own `path`
for that call (still joined with `data-ln-api-base-url`). For `update`,
`delete`, and `bulk-delete`, a supplied `url` is the complete resource URL
already carrying the id — the connector does not append the id a second
time (create has no id to append; delete/bulk-delete currently receive no
url in practice). `meta` is
opaque, default `null`, echoed untouched on the response.

`url` is same-origin-relative by convention (it originates from a form's
HTML `action` attribute) and always passes through the same `buildUrl()`
join as `path` — `data-ln-api-base-url` still prepends when configured.

### Notifications (Emitted BY the connector)

The connector dispatches bubbles-enabled events to notify parent coordinators of response states.

| Event | `detail` Payload | Description |
|-------|------------------|-------------|
| `ln-api-connector:fetched` | `{ data, since, meta }` | Dispatched upon successful fetch completion. Echoes `detail.meta` from the triggering request untouched, `null` if not provided. |
| `ln-api-connector:created` | `{ record, tempId, message, meta }` | Dispatched upon successful server record confirmation. `record` is the unwrapped `content` (or the bare body — see envelope below). `message` is opaque, `null` if absent. Echoes `detail.meta` untouched, `null` if not provided. |
| `ln-api-connector:updated` | `{ record, id, message, meta }` | Dispatched upon successful server update confirmation. Same `record`/`message` unwrap as `:created`. Echoes `detail.meta` untouched, `null` if not provided. |
| `ln-api-connector:deleted` | `{ response, id, message, meta }` | Dispatched upon successful server deletion. `response` is the (possibly null) parsed body; `message` is `null` on a 204. Echoes `detail.meta` untouched, `null` if not provided. |
| `ln-api-connector:bulk-deleted`| `{ response, ids, message, meta }` | Dispatched upon successful server bulk deletion. Same `message` pass-through as the others. Echoes `detail.meta` untouched, `null` if not provided. |
| `ln-api-connector:error` | `{ action, error, status, ..., meta }` | Dispatched on failures. Includes `conflictData` if status is 409. `status` is always present (`0` for network failure). Echoes `detail.meta` from the triggering request untouched, `null` if not provided. |
| `ln-api-connector:config-changed` | `{ baseUrl, path, headers }` | Dispatched when configuration attributes are mutated. |

---

## Mutation Response Envelope

The three mutation response handlers (`create`/`update`/`delete`, and
`bulk-delete` for symmetry) presence-check the parsed JSON body for an
optional `{ message, content }` envelope, mirroring the unwrap `ln-ajax`
already does for HTML fragment responses (`ln-ajax.js:160` `if (data.content)`):

```json
{
  "message": { "type": "success", "title": "Saved", "body": "Document created" },
  "content": { "id": 42, "title": "New Document", "status": "Draft" }
}
```

- **`content`** — the record payload. `ln-api-connector:created`/`:updated`
  unwrap `body.content` (presence-checked with `!== undefined`) into
  `detail.record`; if the response has no `content` key, the bare body is
  used as-is (back-compat with a plain-record response).
- **`content` duality** — this is the *same* envelope shape `ln-ajax` consumes,
  just with a different content type: `ln-ajax` treats `content` as an
  `{ targetId: html }` map for DOM fragment swaps, while `ln-api-connector`
  treats it as JSON record data. One envelope, two consumers, two
  interpretations of the payload.
- **`message` PRESENCE = toast opt-in.** If `message` is absent (or the whole
  body has no envelope), `detail.message` is `null` and nothing renders. There
  is no hardcoded toast text at the connector layer — the backend authors
  the entire user-facing string.
- **The connector passes `message` opaquely** — it does not read `message.type`/
  `title`/`body` itself. That happens one level up, in whichever consumer
  turns it into an `ln-toast:enqueue` (see `js/ln-data-coordinator/README.md`
  → Toasts).
- **204 caveat.** `_resolve` returns `null` for a 204 response (no body to
  parse), so a DELETE answering `204 No Content` has no envelope and no
  `message` — no toast fires. A backend that wants a delete confirmation
  toast must answer `200 OK` with the envelope (`content` can be `null`).

Nothing else in the connector is touched by this: the JS API methods
(`create`/`update`/`delete`/`bulkDelete`), `_resolve`, config, and the error
path are unchanged — the unwrap happens only in the DOM-event handlers, at
the point the parsed body arrives.

---

## 3-Tier Integration Architecture (Coordinator Example)

Here is how a parent Coordinator links a Cache Store and the API Connector using
standard DOM events — parallel fan-out (local store write + remote connector
call happen from the same intake handler), no `_pending`/confirm/revert, and
success toasts riding the envelope's `message`:

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
        storeEl.lnDataStore.applySync(payload.data, payload.deleted || [], payload.synced_at);
    });

    // 3. Intake fans out in parallel: local optimistic write AND remote call,
    //    from the same handler — not chained off each other.
    const tempId = '_temp_' + crypto.randomUUID();
    storeEl.dispatchEvent(new CustomEvent('ln-store:request-create', { detail: { tempId, data: { title: 'New Document' } } }));
    connectorEl.dispatchEvent(new CustomEvent('ln-api-connector:request-create', {
        detail: { data: { title: 'New Document' }, tempId: tempId }
    }));

    // 4. Connector confirms creation -> ordinary id-swap update (no confirmMutation)
    connectorEl.addEventListener('ln-api-connector:created', function (e) {
        storeEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
            detail: { id: e.detail.tempId, data: e.detail.record }
        }));
        // Success toast rides the envelope's message — no hardcoded string.
        if (e.detail.message) {
            window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
                detail: { type: e.detail.message.type || 'success', title: e.detail.message.title || '', message: e.detail.message.body || '' }
            }));
        }
    });

    // 5. Errors are classified deterministic vs transient — never a blind revert.
    //    status 0/5xx -> transient (retry via queue, or leave local on single attempt);
    //    status 401/419 -> auth (pause queue); status 409/4xx -> deterministic (never retry).
    connectorEl.addEventListener('ln-api-connector:error', function (e) {
        if (e.detail.action === 'create' && e.detail.status >= 400 && e.detail.status < 500) {
            storeEl.dispatchEvent(new CustomEvent('ln-store:request-delete', { detail: { id: e.detail.tempId } }));
        }
        // ... see ln-data-coordinator README's "Error reconciliation policy" for the full table
    });
})();
```
