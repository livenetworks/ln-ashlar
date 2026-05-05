# ln-http

> Two-path HTTP coordinator. Path A wraps `window.fetch` so any GET on the
> same URL auto-cancels the previous in-flight one. Path B is an event
> contract — dispatch `ln-http:request` with a string `key` and any
> request (including POST) supersedes the previous one with the same
> `key`. ~165 lines of JS that exist so search-as-you-type and
> drag-reorder both have one canonical answer.

## Philosophy

Two patterns show up in every project, and they have the same shape but
different needs.

The first is **search-as-you-type**: the user types, the page fires a
GET on every keystroke, and only the last response should ever land. The
right behavior is "if a previous GET to this URL is in flight, abort
it." The wrong behavior is "race them and hope the network preserves
order." Components that care about this — search inputs, sort handlers,
filter changes — call `fetch()` natively. They should not have to know
about an HTTP coordinator. So Path A wraps `window.fetch`: the dedup is
transparent, keyed on URL+method, and only kicks in for GET / HEAD
(idempotent methods, where dropping the older request is safe).

The second is **drag-reorder POST**: the user drags an item, the page
fires a POST with the new order, the user drags again before the network
returns. Two concurrent POSTs to the same URL are NOT safe to dedup by
URL — the server must accept both, or accept the latest. The consumer
knows which it wants; the wrapper does not. So Path B is an opt-in event
contract — dispatch `ln-http:request` with `detail.key: 'reorder-list-1'`
and ln-http supersedes the previous request carrying the same key,
regardless of method. Without a `key`, Path B does not dedup beyond
whatever Path A would do for a GET. The consumer's choice of key IS the
contract: "these requests are interchangeable; only the latest matters."

Both paths share one feature surface and nothing else. There is no
header injection, no auth handling, no body shaping, no JSON parsing, no
retry, no timeout, no progress events, no request interceptor. Path A
hands the consumer's `fetch` arguments to the original `fetch`
unchanged. Path B forwards the consumer's `body` to fetch unchanged
(string, FormData, Blob — whatever fetch accepts) and forwards the raw
`Response` back to the consumer (the consumer calls `.json()`, `.text()`,
`.blob()` themselves). The whole component sits between the dispatch site
and `fetch`, doing one thing each path: cancel a predecessor.

### Two paths, one process

The two paths share state-tracking maps but otherwise do not interact.

- **Path A (`_inflight`)** — keyed by `"METHOD URL"`, populated on every
  call to the wrapped fetch. Idempotent dedup runs only for GET and HEAD.
  Two POSTs to the same URL produce two separate entries that both run.
- **Path B (`_keyed`)** — keyed by the consumer's chosen string from
  `detail.key`, populated on every Path B dispatch that has a `key`. Any
  method is eligible. A dispatch with no `key` is a one-shot — it goes
  through the wrapped fetch (so a GET still gets Path A dedup) but
  contributes no entry to `_keyed`.

A Path B GET dispatched with a `key` lives in BOTH maps. Aborts from
either side are idempotent — calling `.abort()` twice on the same
controller does nothing the second time, and `_inflight` and `_keyed`
each clean up only their own entries on resolve.

### Parasitic shape

ln-http does not advertise itself to other components. Components in
this library — `ln-form`, `ln-ajax`, `ln-store`, `ln-data-table` — call
`fetch()` directly. When ln-http is loaded, those `fetch` calls go
through the wrapper transparently, and idempotent dedup happens for
free. When ln-http is NOT loaded, those same components fall back to
native `fetch` and behave as if no coordinator exists. No component
imports ln-http; no component checks `window.lnHttp`. The wrapper is a
parasite on the global, optional, and one-way.

The implication: dropping ln-http into a project changes nothing
visibly. If two GETs to `/api/search?q=foo` are racing, the older one
quietly aborts and only the newer's response arrives. If a project never
fires concurrent GETs to the same URL, ln-http is a no-op. The cost is
~165 lines of JS and one wrapped `fetch` reference.

### What this component does NOT do

- **Does not handle auth or CSRF.** Whoever dispatches sets credentials
  and tokens. ln-http never reads meta tags, never sniffs cookies, never
  injects an `Authorization` header.
- **Does not inject any headers.** No `Accept: application/json`, no
  `X-Requested-With`, no `Content-Type`. If the consumer wants those,
  the consumer sets them on the fetch options or in `detail.body`.
- **Does not shape bodies.** Path A passes `options` through unchanged.
  Path B forwards `detail.body` to fetch as-is. Stringify your JSON,
  build your `FormData`, set your `Content-Type` — ln-http does not.
- **Does not parse responses.** Path B forwards the raw `Response`
  object on `ln-http:response`. The consumer calls `.json()` / `.text()`
  themselves. Path A is invisible — the consumer's `fetch` call returns
  the same Promise it always would.
- **Does not retry.** A failed fetch is final. Retry policy is per-feature.
- **Does not implement a timeout.** `fetch` has none; if you need one,
  pass an `AbortSignal` from a `setTimeout` (Path A) or use Path B with
  an external `signal` in `detail`.
- **Does not own visual feedback.** No spinner, no disabled state, no
  toast. The dispatch site owns the UI.

### What sits on top

ln-http is a transport coordinator. The components that benefit from
Path A simply call `fetch` and never know:

- **`ln-form`** — submits via `fetch`. Path A dedup applies to GET
  endpoints (search forms, filter forms); POST submits are independent
  by design.
- **`ln-ajax`** — has its own `X-Requested-With` and CSRF handling
  ([`js/ln-ajax/ln-ajax.js`](../ln-ajax/ln-ajax.js)) — that stays
  ln-ajax's concern. It calls `fetch` and benefits from Path A dedup
  on the GET path; POST page-navigation submits are not deduped by URL
  (and should not be).
- **`ln-store`** — calls `fetch` directly for list/get/save/delete.
  Path A dedup means "two concurrent reloads of the same list" collapse
  into one. Mutations go through unchanged.
- **`ln-data-table`** — its coordinator typically `fetch`-es a list
  endpoint. Path A makes that call resilient to rapid-fire filter
  changes.

The drag-reorder use case is Path B's reason for existing. The
consumer dispatches `ln-http:request` from the list element on every
drop, with `detail.key: 'reorder-' + listId`, and writes the response
handler on the same element. See "Examples" below for the full wiring.

## Markup anatomy

There is no markup. ln-http is a **global service** (see js skill §10) —
on load it wraps `window.fetch` and registers a `document`-level
listener for `ln-http:request`. There is no `data-ln-*` attribute, no
DOM instance, no MutationObserver, no per-element state.

The "markup" of an ln-http call is one of two consumer dispatch sites:

### Path A — call `fetch` directly

```js
// Plain fetch — Path A is invisible. Two rapid calls to the same URL
// will auto-cancel the older one (idempotent only).
const response = await fetch('/api/search?q=' + encodeURIComponent(query));
const json = await response.json();
```

The consumer never imports ln-http, never references `window.lnHttp`,
never knows the dedup happened. If another `fetch('/api/search?q=...')`
fires before this one resolves, the older one rejects with `AbortError`
(consumer should treat that as "ignore, the newer one is the answer").

### Path B — dispatch `ln-http:request`

```js
const list = document.getElementById('reorder-list');

list.addEventListener('ln-http:response', async function (e) {
    if (!e.detail.ok) return;
    const json = await e.detail.response.json();
    showToast('Order saved (' + json.savedAt + ')');
});

list.addEventListener('ln-http:error', function (e) {
    showToast('Save failed: ' + e.detail.error.message);
});

list.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: {
        url:    '/api/lists/1/reorder',
        method: 'POST',
        body:   JSON.stringify({ ids: currentOrder }),
        key:    'reorder-list-1'
    }
}));
```

Three rules at the dispatch site:

1. **`bubbles: true` on the request.** ln-http listens on `document`, so
   the event must bubble up. A non-bubbling dispatch dies on the target
   and ln-http never sees it. There is no warning.
2. **Listen on the dispatch target.** Response and error events fire on
   the original target (the element you dispatched from), and they
   bubble. Listening on the same element scopes responses by DOM
   subtree.
3. **`.json()` / `.text()` is your call.** `e.detail.response` is the
   raw `Response`. ln-http never reads the body — that's a one-shot
   operation, and the consumer is the one who knows what shape to
   expect.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Path A in-flight controllers | `_inflight: Map` (closure-private) | ln-http |
| Path B in-flight controllers | `_keyed: Map` (closure-private) | ln-http |
| Original `fetch` reference | `_origFetch` (closure-private) | ln-http |
| Request URL, method, body | fetch args (Path A) or event detail (Path B) | consumer |
| Headers (Accept, Content-Type, Auth) | fetch options or `detail.body` envelope | consumer |
| Auth / CSRF tokens | inside the request (consumer's choice of where) | consumer |
| Response data | `Response` object on `e.detail.response` | consumer |
| Visual feedback | nothing | consumer |

`window.lnHttp` is the public API surface (see "API" below) — `cancel`,
`cancelByKey`, `cancelAll`, `inflight`, `destroy`. It does not hold the
in-flight maps directly; those are closed over.

## States & visual feedback

ln-http has no visible state. It does not set `aria-busy`, does not add
classes, does not toggle attributes. The "states" below describe the
**request lifecycle** for each path — what happens when, in what order.

### Path A lifecycle

| Phase | What ln-http does | What the consumer sees |
|---|---|---|
| Call to wrapped `fetch` | Synchronously: extracts URL + method, builds key `"METHOD URL"`. If method is GET/HEAD and the key is in `_inflight`, calls `.abort()` on the existing controller and removes the entry. Creates a new controller, merges any consumer `signal` into it, stores the controller under the key, calls the original `fetch`. | Their `fetch` call returned a Promise; that's all. |
| Network in flight | Awaiting the original `fetch` promise. | Optionally: consumer set their own `aria-busy` / spinner / disabled state — none of it through ln-http. |
| Resolution (any status) | `.finally` clears the entry from `_inflight` only if THIS controller is still the one stored under the key (i.e. it wasn't replaced). | Consumer's promise resolves with the `Response`. They handle it as they always would. |
| Aborted (replaced) | The previous controller's `.abort()` was called when the new request landed. The original fetch promise rejects with an `AbortError`. The `_inflight` entry was already overwritten by the new controller; the `.finally` cleanup correctly skips because `_inflight.get(key) !== controller`. | Consumer's promise rejects with `AbortError`. They typically catch and ignore — the newer call's response is the answer. |

### Path B lifecycle

| Phase | What ln-http does | What the consumer sees |
|---|---|---|
| `ln-http:request` dispatched | Synchronously inside the dispatch: reads detail, picks method (`detail.method` or `body ? 'POST' : 'GET'`), resolves `userKey = detail.key`. If `userKey` is set and present in `_keyed`, calls `.abort()` and removes the entry. Creates a new controller, merges any `detail.signal`, stores it under `userKey` (only if `userKey` was provided), calls the wrapped `fetch`. | Nothing yet. The `dispatchEvent` call returns synchronously. |
| Network in flight | Awaiting fetch resolution. | Same as Path A — consumer's UI feedback is their job. |
| 2xx or non-2xx (any status, fetch resolves) | If `userKey` is set and the entry still belongs to this controller, removes it from `_keyed`. Dispatches `ln-http:response` on the original target with `{ ok, status, response }`. The `Response` is forwarded raw. | `ln-http:response` listener fires. Consumer reads `e.detail.ok` (= `response.ok`), `e.detail.status`, and consumes `e.detail.response` (typically `.json()`). |
| Network failure (DNS, offline, CORS rejection) | Cleans up the `_keyed` entry. Dispatches `ln-http:error` on the original target with `{ ok: false, status: 0, error }`. | `ln-http:error` listener fires. Consumer reads `e.detail.error` (the original Error object). |
| Aborted (replaced or via `cancelByKey`) | Cleans up the `_keyed` entry IF the entry is still ours. The fetch promise rejects with `AbortError`; the `.catch` detects `err.name === 'AbortError'` and **silently returns** — no event dispatched. | Nothing. The consumer should not rely on a fixed event count per dispatch count. |

There is no `ln-http:before-request` event and no way to cancel a Path B
request by listening to its dispatch. The cancellation channels are
the `key` (a newer dispatch with the same key) and the public API
methods `cancel(url)`, `cancelByKey(key)`, `cancelAll()`.

## Attributes

ln-http is a global service with no attributes. There is no `data-ln-*`
hook, no element marking, no per-element instance.

Per-request parameters live in different places depending on the path.

### Path A — fetch options (consumer-owned)

The consumer calls `fetch(url, options)`. ln-http reads two things off
that call:

| Read | From | Purpose |
|---|---|---|
| URL | first arg (string, `URL`, or `Request`) | dedup key (`"METHOD URL"`) |
| method | `options.method`, or `Request.method`, default `GET` | dedup eligibility — only GET / HEAD dedup |

Everything else — headers, body, credentials, mode, cache, redirect,
referrer, integrity — is opaque to ln-http and passes through to
`fetch` unchanged. The consumer's `signal`, if present, is composed
with ln-http's own controller signal (so the consumer can still abort
the request manually).

### Path B — `ln-http:request` event detail

| Field | Type | Default | Description |
|---|---|---|---|
| `url` | string | *required* — request silently returns if absent | Request URL. Forwarded to `fetch` unchanged. |
| `method` | string | `'POST'` if `body` is provided, else `'GET'` | HTTP method. Uppercased internally. |
| `body` | any | none | Forwarded to `fetch` unchanged. Pass a string for JSON, `FormData` for multipart, `Blob` for binary — whatever `fetch` accepts. ln-http does not call `JSON.stringify`. |
| `key` | string | none | Dedup key. New dispatches with the same key abort the previous in-flight one (any method). Aborted requests fire NO events. Without a key, the dispatch is a one-shot. |
| `signal` | AbortSignal | none | Consumer's abort signal. Composed with ln-http's controller; either side aborting cancels the request. |

The detail intentionally has no `headers`, no `credentials`, no `mode`.
Headers go inside `body` if you need them as multipart form fields, or —
for richer header control — call `fetch` directly (Path A): you get
URL-keyed dedup automatically without a contract limitation.

### `key` — request identity, not request id

The Path B `key` is a stable string identifying "a logical class of
requests where only the latest matters." Typical keys:

- `"reorder-list-1"` — every drag-drop POSTs the new order; only the
  latest reaches the server.
- `"poll-status"` — a polling loop where a fresh poll supersedes any
  in-flight one.
- `"upload-file-7"` — re-uploading the same file slot supersedes a
  previous upload in flight (different from `"upload-file-8"`).

Two different consumers using the same key cancel each other.
Namespace per component / record where collisions are possible.

### Path A vs Path B — when to use which

| Need | Use |
|---|---|
| Fire-and-forget GET, dedup by URL automatic | Path A (just call `fetch`) |
| Programmatic cancel of a specific URL | Path A + `lnHttp.cancel(url)` |
| Need explicit cancel of POST / PUT / DELETE | Path B with a `key` |
| Need response delivered as a DOM event (so a coordinator higher up the tree can listen) | Path B |
| Need maximum header / option control | Path A (raw `fetch`) |
| Need to pass through a third-party library that already calls `fetch` | Path A (transparent — the third-party gets dedup for free) |

## Events

### Listened to by the service (on `document`)

| Event | Source | What ln-http does |
|---|---|---|
| `ln-http:request` | any element (must bubble) | Reads `detail`, validates `detail.url`, applies key dedup, calls the wrapped `fetch`, dispatches `ln-http:response` or `ln-http:error` back on the original target. Returns silently if `detail.url` is missing. |

The listener is registered once at script load. Every bubbling
`ln-http:request` is handled — there is no opt-out per-subtree.

### Dispatched by the service (on the original target)

Both response events fire via the `dispatch` helper from `ln-core`,
which sets `bubbles: true` and `cancelable: false`. They are
notifications, not commands.

| Event | Bubbles | `detail` | When |
|---|---|---|---|
| `ln-http:response` | yes | `{ ok, status, response }` | `fetch` resolved (any HTTP status). `response` is the raw `Response`. `ok` mirrors `response.ok` (true on 2xx). The consumer is responsible for branching on `ok` and `status`, and for consuming the body via `.json()` / `.text()` / `.blob()`. |
| `ln-http:error` | yes | `{ ok: false, status: 0, error }` | `fetch` itself rejected (network failure: DNS, offline, CORS). `error` is the original Error object. Aborts (`AbortError`) do NOT fire this — they fire nothing. |

There is no `ln-http:success` event — the name was deliberately
avoided. A 4xx HTTP response is a successful network round-trip; the
consumer should branch on `e.detail.ok` rather than on event type.

### What the service does NOT dispatch

- No `ln-http:before-request` (you can't cancel a request from the
  dispatch side; cancel via the `key` channel or `lnHttp.cancelByKey`).
- No `ln-http:request-started` / `-finished` (lifecycle hooks beyond
  response/error are not exposed).
- No `ln-http:abort` (aborted requests are silent).
- No `ln-http:progress` (fetch upload/download progress is not
  exposed).
- No `ln-http:retry` (no retries).

## API

`window.lnHttp` is the only public surface. It is set on script load
and removed by `destroy()`.

| Member | Type | Returns | Description |
|---|---|---|---|
| `cancel(url)` | function | `boolean` | Aborts every Path A in-flight whose URL matches `url`, regardless of method. Returns `true` if at least one was aborted. |
| `cancelByKey(key)` | function | `boolean` | Aborts the Path B in-flight with this key. Returns `true` if a request was aborted, `false` if no entry existed. |
| `cancelAll()` | function | `void` | Aborts every in-flight request (both paths). Useful in test teardown and SPA route changes. |
| `inflight` | getter | `Array` | Snapshot of currently tracked requests. Path A entries: `{ method, url }`. Path B entries: `{ key }`. The two shapes are exclusive — a Path B request that also lives in `_inflight` (a GET dispatched via Path B with a `key`) appears in BOTH entries. |
| `destroy()` | function | `void` | Calls `cancelAll()`, removes the document listener, restores the original `window.fetch`, deletes `window.lnHttp`. Used by hot-reload and tests. |

There is no `lnHttp.request(...)` function. Path B is the event API;
there is no method-based equivalent. If you want a Promise-shaped
interface, wrap the dispatch yourself (see "Examples").

## Examples

### Example 1 — Search-as-you-type (Path A, transparent)

The most common use case. The consumer never references ln-http; it
just calls `fetch`. Older requests are silently dropped.

```js
const input   = document.getElementById('user-search');
const results = document.getElementById('user-results');

input.addEventListener('input', async function () {
    const q = input.value.trim();
    if (!q) { results.innerHTML = ''; return; }

    try {
        const response = await fetch('/api/users/search?q=' + encodeURIComponent(q));
        if (!response.ok) {
            results.textContent = 'Search failed.';
            return;
        }
        const users = await response.json();
        renderUsers(results, users);
    } catch (err) {
        // Aborted by a newer keystroke — ignore. ln-http handles
        // the abort; the newer call is now in flight.
        if (err.name === 'AbortError') return;
        results.textContent = 'Network error.';
    }
});
```

The dedup is keyed on the full URL, so two GETs to
`/api/users/search?q=ab` and `/api/users/search?q=abc` are NOT the same
request — both run. Two GETs to the SAME URL (e.g. the user backspaces
to a query already in flight) DO collapse — the older aborts.

### Example 2 — Drag-reorder with explicit-key cancel (Path B)

Each drop fires a POST. Path B aborts the previous one regardless of
method, so only the latest order reaches the server.

```js
const list = document.getElementById('todo-list');

list.addEventListener('ln-http:response', async function (e) {
    if (!e.detail.ok) {
        showToast('Save failed (' + e.detail.status + ')');
        return;
    }
    const json = await e.detail.response.json();
    showToast('Order saved at ' + json.savedAt);
});

list.addEventListener('ln-http:error', function (e) {
    showToast('Network error: ' + e.detail.error.message);
});

function onReorder(currentIds) {
    list.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true,
        detail: {
            url:    '/api/lists/' + list.dataset.listId + '/reorder',
            method: 'POST',
            body:   JSON.stringify({ ids: currentIds }),
            key:    'reorder-' + list.dataset.listId
        }
    }));
}
```

Three rapid drags fire three POSTs. The first two are aborted on
arrival of the second and third dispatches; only the third dispatch's
response arrives. The first two listeners never fire.

### Example 3 — Independent POSTs (no dedup)

Two POSTs to the same URL with different bodies. Both should run.
Path A does not auto-cancel POSTs, and Path B without a `key` does
no key-dedup, so this Just Works:

```js
// Two creates, both proceed independently.
fetch('/api/users', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name: 'Ana' })
});

fetch('/api/users', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ name: 'Marko' })
});
```

Each `fetch` call returns its own Promise; both resolve on their own
schedule.

### Example 4 — Path B GET with key (both paths cooperate)

A GET dispatched via Path B with a `key` lives in BOTH dedup maps:
URL-keyed in `_inflight`, key-keyed in `_keyed`. Aborts from either
side are idempotent.

```js
const board = document.getElementById('kanban-board');

board.addEventListener('ln-http:response', async function (e) {
    if (!e.detail.ok) return;
    const cards = await e.detail.response.json();
    renderCards(board, cards);
});

function refreshBoard() {
    board.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true,
        detail: {
            url: '/api/board/' + board.dataset.id + '/cards',
            key: 'board-' + board.dataset.id  // explicit cancel + URL dedup
        }
    }));
}

setInterval(refreshBoard, 5000);
```

If two timers somehow fire near-simultaneously, the URL match in Path A
catches it. If the consumer manually fires `refreshBoard` while a
poll is in flight, the `key` match in Path B catches it. Either way,
only one is alive.

### Example 5 — Programmatic cancel by URL or key

```js
// Cancel any in-flight Path A GET to /api/slow-report.
lnHttp.cancel('/api/slow-report');

// Cancel a Path B in-flight by its consumer key.
lnHttp.cancelByKey('reorder-list-1');

// Tear everything down (e.g. SPA route change).
lnHttp.cancelAll();
```

`cancel(url)` aborts across methods — every entry whose key ends with
` ` + url. Useful when you don't know the method or want to nuke all
in-flight calls to a path.

### Example 6 — Reading `lnHttp.inflight` for diagnostics

```js
// Snapshot of currently tracked requests (both paths).
console.table(lnHttp.inflight);
// Path A entry: { method: 'GET', url: '/api/users' }
// Path B entry: { key: 'reorder-list-1' }
```

The shape is exclusive: a Path B entry has only `key`; a Path A entry
has `method` and `url`. A Path B GET dispatched with a key appears as
TWO entries (one per map). For a debug overlay, you can poll this
getter on a timer.

### Example 7 — Promise-shaped wrapper around Path B

If your call site wants `await`, wrap the dispatch:

```js
function lnHttpRequest(el, detail) {
    return new Promise(function (resolve, reject) {
        function onResponse(e) {
            cleanup();
            resolve(e.detail);
        }
        function onError(e) {
            cleanup();
            reject(e.detail.error);
        }
        function cleanup() {
            el.removeEventListener('ln-http:response', onResponse);
            el.removeEventListener('ln-http:error',    onError);
        }
        el.addEventListener('ln-http:response', onResponse);
        el.addEventListener('ln-http:error',    onError);
        el.dispatchEvent(new CustomEvent('ln-http:request', {
            bubbles: true, detail: detail
        }));
    });
}

// Usage
const result = await lnHttpRequest(list, {
    url:    '/api/lists/1/reorder',
    method: 'POST',
    body:   JSON.stringify({ ids: order }),
    key:    'reorder-list-1'
});
const json = await result.response.json();
```

This wrapper is fine in coordinator code. The library does not ship
it because most callers want long-lived listeners (every reorder, not
just the next), and Promises are one-shot.

## Common mistakes

### Mistake 1 — Forgetting `bubbles: true` on a Path B dispatch

```js
// WRONG — ln-http never sees this
list.dispatchEvent(new CustomEvent('ln-http:request', {
    detail: { url: '/api/whatever', key: 'foo' }
}));
```

ln-http listens on `document`. A non-bubbling event dies on the
target. There is no console warning — your handler simply never fires.
Always pass `bubbles: true`.

### Mistake 2 — Listening for `ln-http:success`

```js
// WRONG — that event does not exist
list.addEventListener('ln-http:success', renderResults);
```

The name is `ln-http:response` and it fires for ALL HTTP responses,
including 4xx / 5xx. Branch on `e.detail.ok` (or `e.detail.status`) to
distinguish success from failure. There is no `ln-http:success`.

### Mistake 3 — Forgetting to call `.json()` on `e.detail.response`

```js
// WRONG — response is the raw Response, not parsed
list.addEventListener('ln-http:response', function (e) {
    renderUsers(e.detail.response.users);  // undefined
});
```

Path B forwards the raw `Response` object so the consumer chooses how
to parse it (JSON, text, blob, none at all). The fix:

```js
list.addEventListener('ln-http:response', async function (e) {
    if (!e.detail.ok) return;
    const json = await e.detail.response.json();
    renderUsers(json);
});
```

### Mistake 4 — Expecting Path A to dedup POSTs

```js
// Two POSTs to the same URL — both run.
fetch('/api/save', { method: 'POST', body: a });
fetch('/api/save', { method: 'POST', body: b });
```

Path A only deduplicates idempotent methods (GET, HEAD). POST / PUT /
PATCH / DELETE are NEVER auto-cancelled by the wrapper — losing one of
two POSTs would silently drop user-intent data. If you want POST cancel
behavior, dispatch via Path B with a `key`. The choice is explicit by
design.

### Mistake 5 — Expecting ln-http to add CSRF or auth headers

```js
// WRONG — ln-http will not inject anything
fetch('/api/secure');  // no Authorization, no X-CSRF-TOKEN
```

ln-http never reads meta tags, never adds headers, never composes
bodies. Auth and CSRF are the dispatch site's responsibility. Set
the header on the fetch options yourself, or attach it via your own
wrapper/coordinator. ln-http is transport coordination, not request
composition.

### Mistake 6 — Mutating a body across multiple POSTs and expecting last-wins

```js
// WRONG — Path A does not dedup POSTs, so both go through;
// "the last one wins" is not what the wrapper does.
const body = { name: '' };
input.addEventListener('input', function () {
    body.name = input.value;
    fetch('/api/save', { method: 'POST', body: JSON.stringify(body) });
});
```

Two consequences. First, Path A does not cancel POSTs, so every
keystroke fires a real POST. Second, mutating the shared `body` after
calling `JSON.stringify` does not affect the in-flight request — the
JSON snapshot is taken at the call site. If you want last-wins POST
behavior, use Path B with a `key`:

```js
input.addEventListener('input', function () {
    target.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true,
        detail: {
            url:    '/api/save',
            method: 'POST',
            body:   JSON.stringify({ name: input.value }),
            key:    'autosave-' + target.dataset.id
        }
    }));
});
```

### Mistake 7 — Treating an `AbortError` rejection as a real error

```js
// WRONG — AbortError on dedup is expected, not a failure
try {
    const r = await fetch('/api/search?q=' + q);
} catch (err) {
    showError('Search broke: ' + err.message);  // fires on every keystroke
}
```

When Path A aborts the previous in-flight request, the original
`fetch` promise rejects with `AbortError`. This is normal — the newer
request is the answer. Either swallow `AbortError` explicitly:

```js
try {
    const r = await fetch('/api/search?q=' + q);
    // ... use r ...
} catch (err) {
    if (err.name === 'AbortError') return;
    showError('Search broke: ' + err.message);
}
```

…or use Path B (which silently drops aborted dispatches).

### Mistake 8 — Reusing one Path B `key` for unrelated requests

```js
// WRONG — drag-reorder and autosave cancel each other
dragHandle.addEventListener('drop', function () {
    list.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true, detail: { url: '/api/reorder', method: 'POST', body: r, key: 'foo' }
    }));
});

input.addEventListener('input', function () {
    list.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true, detail: { url: '/api/autosave', method: 'POST', body: a, key: 'foo' }
    }));
});
```

The Path B `key` namespace is global. Sharing one across logically
unrelated requests means the autosave aborts the reorder. Namespace
per request class: `'reorder-list-1'`, `'autosave-list-1'`.

## Related

- **`ln-ajax`** ([`js/ln-ajax/README.md`](../ln-ajax/README.md)) —
  HTML-page navigation: forms and links that swap server-rendered
  fragments. ln-ajax has its own `X-Requested-With` and CSRF handling
  and is unrelated to ln-http's transport concern. ln-ajax's internal
  `fetch` calls go through Path A's wrapper transparently when ln-http
  is loaded; the URL-dedup applies to its GET path.
- **`ln-form`** ([`js/ln-form/README.md`](../ln-form/README.md)) —
  serializes form fields and dispatches `ln-form:submit`. The consumer
  decides what to do with the payload; using Path B (with `key:
  'submit-' + formId`) is the canonical way to make repeated submits
  last-wins.
- **`ln-store`** ([`js/ln-store/README.md`](../ln-store/README.md)) —
  the data layer. Calls `fetch` directly; gets Path A dedup on its
  list-load endpoint for free. Mutations (save/delete) are independent.
- **`ln-data-table`** ([`js/ln-data-table/README.md`](../ln-data-table/README.md))
  — its coordinator typically `fetch`-es a list endpoint per filter
  / sort change. Path A makes that resilient to rapid input.
- **Architecture deep-dive:** [`docs/js/http.md`](../../docs/js/http.md)
  — the wrapper internals, `_inflight` / `_keyed` lifecycles, the
  cooperation rules between the two paths, and the design decisions
  that shape the contract.
