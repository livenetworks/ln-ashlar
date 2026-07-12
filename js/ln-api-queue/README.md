# `data-ln-api-queue`

A zero-dependency, Local-First **offline write outbox** component that implements the persistent-queue tier of `ln-ashlar`'s 3-tier data layer.

This component persists pending mutations to its own `IndexedDB` database and replays them, FIFO per chain, once the coordinator can execute transport for them. It is **connector-blind and id-blind** — it never calls the network itself, never knows about REST paths, and never interprets `entryId`/`targetId`/`chainKey` beyond bookkeeping. The parent `ln-data-coordinator` executes the actual transport call on the queue's `ln-api-queue:send` command and reports the outcome back via `ack` / `nack`.

---

## Declarative DOM Setup

Place the queue inside your parent coordinator element alongside your store and connector — it is an **optional** third child:

```html
<ul data-ln-data-coordinator="documents" hidden>
    <!-- Storage Layer Cache (Blind to networking) -->
    <li data-ln-data-store
        data-ln-store-indexes="status,updated_at">
    </li>

    <!-- Transport Gateway (REST / API Connector) -->
    <li data-ln-api-connector
        data-ln-api-base-url="https://api.livenetworks.com/v1"
        data-ln-api-path="/documents">
    </li>

    <!-- Offline Outbox (optional Child 3) -->
    <li data-ln-api-queue></li>
</ul>
```

When this child is absent, the coordinator's write handlers call the connector directly (unchanged, queue-absent path). When present, every mutation is routed through the queue instead.

---

## Attributes

| Attribute | Category | Description |
|-----------|----------|-------------|
| `data-ln-api-queue` | Selector | Creates the component instance. Optional value serves as a scope/name (defaults to the coordinator's scope). |
| `data-ln-api-queue-online` | Status (read-only, reflected) | Set by the component itself — `"true"` when the scope is draining/idle normally, `"false"` while paused (e.g. auth pause). Useful for CSS hooks on a connectivity indicator; not meant to be written by consumers. |

---

## IndexedDB Schema

The queue owns its **own** IndexedDB database, `ln_api_queue` — entirely separate from the store's cache database. Nothing in `ln-data-store` reads or writes this database.

| Object store | Key path | Indexes | Purpose |
|---|---|---|---|
| `outbox` | `entryId` | `by_scope_chain` (`[scope, chainKey]`), `by_scope_seq` (`[scope, seq]`) | One row per pending mutation. `seq` is a monotonically increasing per-scope counter used to preserve global FIFO ordering within a scope; `by_scope_chain` is used to find the head entry per chain. |
| `_queue_meta` | scope name | — | Holds the per-scope `seq` counter and pause state. |

Each `outbox` entry carries: `entryId`, `scope`, `chainKey`, `seq`, `op`, `targetId`, `payload`, `expectedVersion`, `meta`, `attempts`, `status` (`pending` / `failed`), and timestamps. The queue never inspects `payload` — it passes it through untouched to whatever the coordinator sends on `ln-api-queue:send`.

---

## JavaScript API Methods

Access the instance directly on the element via the `.lnApiQueue` property:

```javascript
const queueEl = document.querySelector('[data-ln-api-queue]');
const queue = queueEl.lnApiQueue;

// Programmatic equivalents of the DOM commands below also exist,
// but the canonical interface is event-driven (see next section) —
// this keeps the coordinator's write-routing code identical whether
// it is reacting to a DOM event or calling a method directly.
```

---

## DOM Events

### Commands (Dispatched TO the queue)

| Event | `detail` Payload | Effect |
|-------|------------------|--------|
| `ln-api-queue:request-enqueue` | `{ chainKey, op, targetId, payload, expectedVersion, meta }` | Assigns `entryId` + `seq`, persists the entry, emits `enqueued` + `pending-count`, then attempts a drain. |
| `ln-api-queue:ack` | `{ entryId }` | Deletes the entry, emits `pending-count`, advances that chain (drain). |
| `ln-api-queue:nack` | `{ entryId, reason }` — `reason` is `'retry'`, `'drop'`, or `'auth'` | `retry` → schedules backoff and re-sends later; `drop` → deletes the entry and advances the chain; `auth` → pauses the scope and emits `auth-required`. |
| `ln-api-queue:request-remap` | `{ oldKey, newId }` | For pending entries whose chain is `oldKey`: any entry with `targetId === oldKey` gets `targetId = newId`; the chain itself is re-keyed from `oldKey` to `newId`; if `meta.action` contains `oldKey` as a substring, it is string-replaced with `newId` too (keeps a persisted per-record URL in sync after a create resolves). |
| `ln-api-queue:request-resume` | `{}` | Clears the pause on this scope and resumes draining. |
| `ln-api-queue:request-drain` | `{}` | Manually triggers a drain attempt (e.g. to retry `failed` entries). |
| `ln-api-queue:request-clear` | `{}` | Deletes all entries for this scope (e.g. on logout). |

### Notifications (Emitted BY the queue, bubble to the coordinator)

| Event | `detail` Payload | Meaning |
|-------|------------------|---------|
| `ln-api-queue:send` | `{ entryId, chainKey, op, targetId, payload, expectedVersion, meta }` | **Command to the coordinator** — execute transport for this head-of-chain entry. The queue never calls `fetch` itself. |
| `ln-api-queue:enqueued` | `{ entryId, chainKey, count }` | An entry was persisted. |
| `ln-api-queue:pending-count` | `{ count, scope }` | Live outbox depth for the scope — the primary UI-facing signal (badge, banner). |
| `ln-api-queue:auth-required` | `{ entryId, chainKey }` | The scope paused after a `401`/`419` nack. The consumer drives re-authentication, then dispatches `request-resume`. |
| `ln-api-queue:paused` | `{ reason }` | Draining paused for this scope. |
| `ln-api-queue:resumed` | `{}` | Draining resumed for this scope. |
| `ln-api-queue:failed` | `{ entryId, chainKey, attempts }` | Retries exhausted (see backoff below); the entry is retained (not deleted) for a manual `request-drain`. |
| `ln-api-queue:drained` | `{ scope }` | The outbox for this scope is empty. |
| `ln-api-queue:destroyed` | `{ scope }` | The instance was torn down. |

---

## FIFO-per-Chain Semantics

Entries are ordered **per `(scope, chainKey)`**, not globally. Each chain drains strictly in the order its entries were enqueued (via the `seq` counter), and the queue keeps **one inflight entry per chain** at a time — it will not dispatch `ln-api-queue:send` for the next entry in a chain until the current head is `ack`'d or `nack`'d with `'drop'`. Different chains drain concurrently and independently of each other.

`chainKey` is typically the record id (or temp id, pre-confirmation) — this is what makes a create followed by an update on the same not-yet-confirmed record safe: the update waits behind the create in the same chain, and `request-remap` re-keys the chain once the create resolves.

---

## Drain-on-Init

On construction, the queue reads its persisted entries from `ln_api_queue` and immediately attempts to drain every chain that isn't paused. This means pending writes from a previous page load (browser closed mid-offline-session, tab crashed, etc.) resume automatically without any explicit "resume" call from the consumer.

---

## Backoff & Retry Limits

On a `nack {reason:'retry'}` (5xx or network failure), the entry is retried with exponential backoff: **2s, 5s, 15s, 60s, 5min**. After **8 attempts** the entry's status becomes `'failed'` and `ln-api-queue:failed` fires — the entry is **retained**, not deleted, so a manual `ln-api-queue:request-drain` (or a UI-driven "retry failed" action) can attempt it again later.

---

## Auth Pause / Resume

A `nack {reason:'auth'}` (401/419) pauses the **entire scope** — not just the one chain — and emits `ln-api-queue:auth-required`. The optimistic write is **not** reverted; it stays pending in the cache. The consumer is expected to drive re-authentication (e.g. redirect to login, refresh a token) and then dispatch `ln-api-queue:request-resume` on the queue element to clear the pause and resume draining.

---

## Temp-ID Remap Collaboration

The queue itself has no idea what a "temp id" is — remap is purely a re-keying operation the coordinator asks for. On a successful `create`, the coordinator:

1. Reconciles the store (`confirmMutation`).
2. Dispatches `ln-api-queue:request-remap { oldKey: tempId, newId: serverId }` — **before** acking.
3. Dispatches `ln-api-queue:ack { entryId }` for the create entry.

Doing the remap before the ack matters: if a queued `update` for the same not-yet-confirmed record is waiting behind the `create` in the same chain, its `targetId` and the chain's key are both corrected to the real server id before that chain advances to send the update. Both dispatches are synchronous, so there is no window where the update could be sent with the stale temp id.

---

## Connector- and ID-Blind by Design

The queue never imports or references a connector, never constructs a URL, and never distinguishes a temp id from a real id except as an opaque `chainKey`/`targetId` string it is told to match and re-key. All transport execution, id semantics, and REST/verb mapping live in the coordinator (`ln-data-coordinator`) and the connector it drives — see their READMEs for that half of the contract.

---

## 3-Tier Integration Architecture (Coordinator Example)

```javascript
(function () {
    const parent = document.querySelector('[data-ln-data-coordinator="documents"]');
    const queueEl = parent.querySelector('[data-ln-api-queue]');
    const connectorEl = parent.querySelector('[data-ln-api-connector]');

    if (!queueEl || !connectorEl) return;

    // The queue commands the coordinator to execute transport for its head entry.
    queueEl.addEventListener('ln-api-queue:send', function (e) {
        const { entryId, op, targetId, payload, expectedVersion, meta } = e.detail;

        const call = op === 'create' ? connectorEl.lnConnector.create(payload)
            : op === 'update' ? connectorEl.lnConnector.update(targetId, payload, expectedVersion)
            : op === 'delete' ? connectorEl.lnConnector.delete(targetId)
            : connectorEl.lnConnector.bulkDelete(meta.ids);

        call.then(function (record) {
            // ... confirmMutation on the store, then remap-before-ack on create ...
            queueEl.dispatchEvent(new CustomEvent('ln-api-queue:ack', { detail: { entryId } }));
        }).catch(function (err) {
            const reason = (err.status === 401 || err.status === 419) ? 'auth'
                : (!err.status || err.status >= 500) ? 'retry'
                : 'drop';
            queueEl.dispatchEvent(new CustomEvent('ln-api-queue:nack', { detail: { entryId, reason } }));
        });
    });

    // Surface outbox depth for a UI badge.
    queueEl.addEventListener('ln-api-queue:pending-count', function (e) {
        document.querySelector('#pending-badge').textContent = e.detail.count;
    });

    // Drive re-login on auth pause, then resume.
    queueEl.addEventListener('ln-api-queue:auth-required', function () {
        // redirect / refresh token, then:
        queueEl.dispatchEvent(new CustomEvent('ln-api-queue:request-resume'));
    });
})();
```
