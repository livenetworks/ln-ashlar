# `data-ln-websocket-connector`

> Applied to an element inside a `ln-data-coordinator`. Opens a WebSocket, turns server pushes into
> `ln-websocket-connector:fetched`, and answers the same request events as `ln-api-connector` and
> `ln-couchdb-connector`. Connection status is private state announced by events — never an attribute.

A zero-dependency push transport. Beside a REST connector it only delivers live changes; on its own
it carries reads, writes and pushes over one socket.

---

## Declarative DOM Setup

### Live changes beside REST

The REST connector takes every request; the socket only pushes changes into the store.

```html
<ul data-ln-data-coordinator="tasks" hidden>
	<li data-ln-data-store="tasks" id="tasks"></li>
	<li data-ln-api-connector data-ln-api-base-url="https://api.example.com" data-ln-api-path="tasks"></li>
	<li data-ln-websocket-connector data-ln-websocket-connector-url="wss://api.example.com/live"></li>
</ul>
```

### Socket alone

With no REST or CouchDB connector in the coordinator, the socket takes every request too.

```html
<ul data-ln-data-coordinator="tasks" hidden>
	<li data-ln-data-store="tasks" id="tasks"></li>
	<li data-ln-websocket-connector data-ln-websocket-connector-url="wss://api.example.com/live"></li>
</ul>
```

---

## Attributes

Both attributes are commands set from outside; the component obeys them.

| Attribute | Values | Default | Description |
|-----------|--------|---------|-------------|
| `data-ln-websocket-connector` | `connect` \| `disconnect` | `connect` | Opens or closes the socket. A bare attribute connects. |
| `data-ln-websocket-connector-url` | `ws://…` \| `wss://…` | — | Endpoint. Changing it while connected closes and reopens on the new URL. |

There is no attribute for the connection status. `connecting`, `connected` and `disconnected` are
what the component observes, not something anyone can set — writing `connected` into an attribute
would not connect anything. The status is announced by events; whoever listens decides how to show it.

---

## DOM Events

### Commands (dispatched TO the connector)

Only the `ln-websocket-connector:*` namespace is handled.

| Event | `detail` | Description |
|-------|----------|-------------|
| `ln-websocket-connector:request-sync` | `{ since, meta? }` | Delta sync since a token. |
| `ln-websocket-connector:request-query` | `{ query, meta? }` | One page of a query (`search`, `filters`, `sort`, `offset`, `limit`). |
| `ln-websocket-connector:request-create` | `{ data, tempId?, idempotencyKey?, meta? }` | Create a record. |
| `ln-websocket-connector:request-update` | `{ id, data, expected_version?, idempotencyKey?, meta? }` | Update a record. |
| `ln-websocket-connector:request-delete` | `{ id, idempotencyKey?, meta? }` | Delete a record. |
| `ln-websocket-connector:request-bulk-delete` | `{ ids, idempotencyKey?, meta? }` | Delete several records. |

### Notifications (emitted BY the connector)

| Event | `detail` | Description |
|-------|----------|-------------|
| `ln-websocket-connector:connecting` | `{ url, attempt }` | A connection attempt starts. `attempt` counts from 1 and resets on open. |
| `ln-websocket-connector:connected` | `{ url }` | The socket is open. |
| `ln-websocket-connector:disconnected` | `{ url, code, reason, willReconnect }` | The socket closed, or a pending reconnect was cancelled. |
| `ln-websocket-connector:fetched` | `{ data, since, meta }` / `{ data, total, filtered, offset, queryGen, meta }` | A sync reply, a query page, or a server push (`meta: null`). |
| `ln-websocket-connector:created` | `{ record, tempId, message, meta }` | Create confirmed. |
| `ln-websocket-connector:updated` | `{ record, id, message, meta }` | Update confirmed. |
| `ln-websocket-connector:deleted` | `{ response, id, message, meta }` | Delete confirmed. |
| `ln-websocket-connector:bulk-deleted` | `{ response, ids, message, meta }` | Bulk delete confirmed. |
| `ln-websocket-connector:error` | `{ action, error, status, data, conflictData, meta, … }` | A rejected request, or one that could not be delivered (`status: 0`). |

`meta` is echoed unchanged and never leaves the page.

---

## Wire Protocol

JSON text frames.

**Request** — `{ "ref": "<string>", "type": "<type>", ...payload }`

| `type` | payload |
|--------|---------|
| `sync` | `since` |
| `query` | `query` |
| `create` | `data`, `idempotencyKey` |
| `update` | `id`, `data`, `expected_version`, `idempotencyKey` |
| `delete` | `id`, `idempotencyKey` |
| `bulk-delete` | `ids`, `idempotencyKey` |

**Reply** — the same `ref`, then either `{ "ok": true, "content": …, "message": … }` or
`{ "ok": false, "status": 409, "error": "…", "data": … }`. `content` is `{ data, deleted, synced_at }`
for `sync`, `{ data, total, filtered }` for `query`, the record for `create` / `update`, and the
server response for `delete` / `bulk-delete`. `message` is the same opaque toast payload as the REST
`{ message, content }` envelope.

**Push** — no `ref`: `{ "type": "changes", "data": [...], "deleted": [...], "synced_at": … }`.

`synced_at` is the same token the REST delta takes as `since`. Beside REST, a push advances the
store's `lastSyncedAt`, and the next REST sync sends it — the server must keep both in one currency.

---

## Coordinator Integration

`ln-data-coordinator` needs no wiring:

- **Request connector:** `[data-ln-api-connector]` or `[data-ln-couchdb-connector]` when present,
  otherwise `[data-ln-websocket-connector]`.
- **Pushes:** `:fetched` without `meta.kind` goes to `store.applySync` — upsert plus delete, the path
  CouchDB sync already uses. Bound tables and lists refresh on `ln-data-store:synced`.
- **Catch-up:** on every `:connected` the coordinator runs `store.forceSync()`, a delta since
  `lastSyncedAt`, over whichever connector takes requests.

### Showing the status

The coordinator does not render connection status. Page wiring listens and draws it — here with
an app-owned `data-status`, since app state stays out of `data-ln-*`:

```js
const chip = document.getElementById('tasks-status');
['connecting', 'connected', 'disconnected'].forEach(function (status) {
	coordinatorEl.addEventListener('ln-websocket-connector:' + status, function () {
		chip.setAttribute('data-status', status);
	});
});
```

---

## 🔧 Internals

Source: `components/ln-websocket-connector/src/ln-websocket-connector.js`.

### Requests while not connected

- **Command `connect`, socket not open** (first connect, or between reconnect attempts): the request
  is held and sent in order on open. `:connected` is dispatched before the flush, so the coordinator's
  catch-up sync sees the store already syncing and does not send a second one.
- **Command `disconnect`:** the request fails at once with `:error { status: 0 }`.
- **Socket closes with replies outstanding:** each one fails with `:error { status: 0 }`. The
  coordinator treats status 0 as transient and never deletes local data on it.

### Reconnect

An unexpected close while the command is `connect` retries after 1 s, doubling up to 30 s, and the
counter resets on a successful open. `new WebSocket()` throwing synchronously (an invalid URL, or
`ws://` blocked on an `https://` page) is not retried: retrying cannot fix it. The component reports
`:disconnected { willReconnect: false }`; a new URL or a new `connect` command opens again.

### Teardown

`destroy()` closes the socket, clears the reconnect timer, removes the request listeners and
deletes the instance. It dispatches nothing, so held and outstanding requests are discarded, not
failed.
