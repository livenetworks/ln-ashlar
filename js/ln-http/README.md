# ln-http

> Two-path HTTP coordinator. Path A transparently wraps `window.fetch`
> so racing GETs / HEADs to the same URL auto-cancel the older one.
> Path B listens for `ln-http:request` with a string `key` and
> supersedes any previous in-flight request bearing the same key
> (any method).

## Philosophy

Two patterns recur: (a) search-as-you-type, where racing GETs to
the same URL should collapse to "newest wins"; (b) drag-reorder
POST, where racing non-idempotent requests must collapse explicitly
because the consumer — not the wrapper — knows two POSTs are
interchangeable. Path A handles (a) transparently by wrapping
`window.fetch` and deduplicating GET / HEAD. Path B handles (b)
opt-in: dispatch `ln-http:request` with a string `key` and ln-http
aborts any previous in-flight request carrying the same key, any
method.

Both paths cancel a predecessor and do nothing else. ln-http does
not inject headers, parse bodies, retry, time out, or render UI.
The dispatch site owns request composition, response parsing, and
visual feedback. Components in this library that call `fetch`
directly (`ln-ajax`, `ln-store`, …) get Path A dedup transparently
when ln-http is loaded; nothing imports ln-http.

For internal mechanics — wrapper composition, the two dedup maps'
lifecycles, the cooperation rules between paths — see
[`docs/js/http.md`](../../docs/js/http.md).

## Request shape

ln-http is a global service with no attributes. There is no `data-ln-*`
hook, no element marking, no per-element instance.

Per-request parameters live in different places depending on the path.

### Path A — fetch options (consumer-owned)

Path A reads URL and method off your `fetch(url, options)` call.
Everything else passes through. Your `signal` is composed with
ln-http's controller — either side aborting cancels the request.

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

Namespace per component / record where collisions are possible.

### Path A vs Path B — when to use which

| Need | Use |
|---|---|
| Fire-and-forget GET, dedup by URL automatic | Path A (just call `fetch`) |
| Programmatic cancel of a specific URL | Path A + `lnHttp.cancel(url)` |
| Need explicit cancel of POST / PUT / DELETE | Path B with a `key` |
| Need response delivered as a DOM event (so a coordinator higher up the tree can listen) | Path B |
| Need maximum header / option control | Path A (raw `fetch`) |

## Events

### Listened to by the service

ln-http listens for `ln-http:request` on `document`. The dispatch must
`bubbles: true`. ln-http reads `detail`, validates `detail.url`, and
silently returns if `url` is missing.

### Dispatched by the service (on the original target)

Both response events fire via the `dispatch` helper from `ln-core`,
which sets `bubbles: true` and `cancelable: false`. They are
notifications, not commands.

| Event | Bubbles | `detail` | When |
|---|---|---|---|
| `ln-http:response` | yes | `{ ok, status, response }` | `fetch` resolved (any HTTP status). `response` is the raw `Response`. `ok` mirrors `response.ok` (true on 2xx). The consumer is responsible for branching on `ok` and `status`, and for consuming the body via `.json()` / `.text()` / `.blob()`. |
| `ln-http:error` | yes | `{ ok: false, status: 0, error }` | `fetch` itself rejected (network failure: DNS, offline, CORS). `error` is the original Error object. Aborts (`AbortError`) do NOT fire this — they fire nothing. |

There is no `ln-http:success` — branch on `e.detail.ok` or `e.detail.status`.

### What the service does NOT dispatch

- No `ln-http:before-request` (cancel via `key` / `lnHttp.cancelByKey` / `signal`).
- No `ln-http:progress` (fetch upload/download progress not exposed).

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

There is no `lnHttp.request(...)` function — wrap the dispatch yourself if
you want a Promise interface.

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

Three rules at the dispatch site:

1. **`bubbles: true` on the request.** ln-http listens on `document`, so
   the event must bubble up. A non-bubbling dispatch dies on the target
   and ln-http never sees it. There is no warning.
2. **Listen on the dispatch target.** Response and error events fire on
   the original target (the element you dispatched from), and they
   bubble. Listening on the same element scopes responses by DOM subtree.
3. **`.json()` / `.text()` is your call.** `e.detail.response` is the
   raw `Response`. ln-http never reads the body — that's a one-shot
   operation, and the consumer is the one who knows what shape to expect.

### Example 3 — Independent POSTs (no dedup)

Two POSTs to the same URL with different bodies. Both should run.
Path A does not auto-cancel POSTs, so this Just Works:

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

Each `fetch` call returns its own Promise; both resolve on their own schedule.

### Example 4 — Programmatic cancel by URL or key

```js
// Cancel any in-flight Path A GET to /api/slow-report.
lnHttp.cancel('/api/slow-report');

// Cancel a Path B in-flight by its consumer key.
lnHttp.cancelByKey('reorder-list-1');

// Tear everything down (e.g. SPA route change).
lnHttp.cancelAll();
```

`cancel(url)` aborts across methods — every entry whose key ends with
` ` + url. Useful when you don't know the method or want to cancel all
in-flight calls to a path.

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

### Mistake 2 — Forgetting to call `.json()` on `e.detail.response`

```js
// WRONG — response is the raw Response, not parsed
list.addEventListener('ln-http:response', function (e) {
    renderUsers(e.detail.response.users);  // undefined
});
```

Path B forwards the raw `Response` object so the consumer chooses how
to parse it. The fix:

```js
list.addEventListener('ln-http:response', async function (e) {
    if (!e.detail.ok) return;
    const json = await e.detail.response.json();
    renderUsers(json);
});
```

### Mistake 3 — Treating an `AbortError` rejection as a real error

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
request is the answer. Swallow `AbortError` explicitly:

```js
try {
    const r = await fetch('/api/search?q=' + q);
    // ... use r ...
} catch (err) {
    if (err.name === 'AbortError') return;
    showError('Search broke: ' + err.message);
}
```

## Related

- **`ln-ajax`** ([`js/ln-ajax/README.md`](../ln-ajax/README.md)) —
  HTML-page navigation: forms and links that swap server-rendered
  fragments. ln-ajax has its own `X-Requested-With` and CSRF handling
  and is unrelated to ln-http's transport concern. ln-ajax's internal
  `fetch` calls go through Path A's wrapper transparently when ln-http
  is loaded; the URL-dedup applies to its GET path.
- **`ln-form`** ([`js/ln-form/README.md`](../ln-form/README.md)) —
  serializes form fields and dispatches `ln-form:submit`. The consumer's
  submit handler decides what to do with the payload; using Path B with
  `key: 'submit-' + formId` is the canonical way to make repeated submits
  last-wins.
- **`ln-store`** ([`js/ln-store/README.md`](../ln-store/README.md)) —
  the data layer. Calls `fetch` directly; gets Path A dedup on its
  list-load endpoint for free. Mutations (save/delete) are independent.
- **`ln-data-table`** ([`js/ln-data-table/README.md`](../ln-data-table/README.md))
  — the consumer's data layer typically calls `fetch` per filter / sort
  change; Path A makes those calls resilient to rapid input.
- **Architecture deep-dive:** [`docs/js/http.md`](../../docs/js/http.md)
  — the wrapper internals, `_inflight` / `_keyed` lifecycles, the
  cooperation rules between the two paths, and the design decisions
  that shape the contract.
