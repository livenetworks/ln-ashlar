# http — architecture

> A ~165-line global service that wraps `window.fetch` for transparent
> URL-keyed dedup (Path A) and listens for `ln-http:request` to provide
> explicit-key dedup on any method (Path B). Two closure-private maps,
> no DOM state, no instances.

The implementation lives in
[`js/ln-http/ln-http.js`](../../js/ln-http/ln-http.js). This document
covers internals — the wrapper composition, the two dedup maps'
lifecycles, the request-composition pipeline for each path, and the
design decisions behind the particular shape of the contract. For
consumer-facing usage see
[`js/ln-http/README.md`](../../js/ln-http/README.md).

## Where this sits in the layered architecture

`ln-http` is a **transport coordinator**. It is a service-style
component — global listener on `document`, wrapped reference on
`window.fetch`, no `data-ln-*` attribute, no DOM instance, no
MutationObserver. It does not own data, does not own forms, does not
own validation. It owns two narrow rules:

1. **Path A** — when two GETs to the same URL race, keep only the
   newer one.
2. **Path B** — when the consumer dispatches `ln-http:request` with a
   string `key`, supersede any previous in-flight request bearing the
   same key (any method).

Both rules are about cancellation. Neither rule is about composition,
parsing, or auth. Those concerns are the dispatch site's.

The component is **parasitic**: other components in this library
(`ln-form`, `ln-ajax`, `ln-store`, `ln-data-table`,
`ln-icons`) call `fetch()` directly without importing or referencing
ln-http. When ln-http loads, those `fetch` calls are silently routed
through the wrapper and inherit Path A dedup. When ln-http does NOT
load, the same components still work — they just don't get URL
auto-dedup. No component has a hard dependency on ln-http; the
contract is one-way.

## Embodied principles

ln-http embodies the same cross-cutting principles as the rest of the
library:

- **Event-driven coordination (Path B).** Consumers dispatch
  `ln-http:request` instead of importing an HTTP client. Same pattern
  as `ln-form:submit`, `ln-store:change`, `ln-validate:set-custom`.
- **Response on the original target, not on `document` (Path B).** The
  service captures `e.target` at the start of the handler
  (`js/ln-http/ln-http.js:125`) and uses the captured reference for
  every later `dispatch` call (`js/ln-http/ln-http.js:156, 165`). This
  scopes responses by DOM subtree.
- **No `document.querySelectorAll` post-init.** ln-http never scans
  the DOM. Its only state is two closure-private maps keyed by strings.
- **Attribute-as-contract is N/A.** Global service — there is no
  per-element attribute or instance. The contract is the wrapped
  `fetch` signature (Path A) and the event detail (Path B).
- **Idempotent operations.** Both paths' aborts are idempotent: calling
  `.abort()` twice on the same controller does nothing the second time;
  the cleanup checks (`_inflight.get(key) === controller`,
  `_keyed.get(userKey) === controller`) prevent stale entries from
  wiping fresh ones during reentrant cleanup.

## Internal state

The component has exactly two pieces of state, declared at lines 58-59:

```js
const _inflight  = new Map();   // "METHOD URL" → AbortController (Path A)
const _keyed     = new Map();   // consumer key → AbortController (Path B)
```

Plus one private reference at line 57:

```js
const _origFetch = window.fetch.bind(window);
```

`_origFetch` is the unwrapped `fetch`, captured at script load before
the wrapper is installed. Used internally (Path B re-enters the
wrapped `fetch` deliberately to compose the two paths) and restored
on `destroy()` (line 215).

### `_inflight` lifecycle (Path A)

| Step | When | Code | Effect |
|---|---|---|---|
| Add | wrapped `fetch` is called | line 108 | After any abort of a previous controller, store the new controller under `_key(url, method)` = `"METHOD URL"`. |
| Abort previous | new request lands on idempotent (GET/HEAD) key already in map | lines 91-94 | `_inflight.get(key).abort()`, then `_inflight.delete(key)`. |
| Remove on resolve | original `fetch` settled (resolve OR reject) | lines 110-113 | `.finally(...)` checks `_inflight.get(key) === controller` before deleting. The check matters: if a newer call replaced the entry between this call's start and finish, deleting unconditionally would wipe the new entry. |
| Remove on `cancel(url)` | consumer called `lnHttp.cancel(url)` | lines 178-188 | Iterates `_inflight`, finds entries whose key ends with ` ` + url, aborts and deletes. |
| Remove on `cancelAll()` | consumer called `lnHttp.cancelAll()` | lines 195-200 | Aborts every entry, then `.clear()`. |

The map never grows unbounded — every entry is either replaced by a
newer same-key call, removed by `.finally` on resolve, or wiped by
`cancel*`. There is no GC code, no TTL, no size cap; the namespace is
bounded by the number of distinct (method, URL) pairs the page has
in flight, which is at most a handful.

### `_keyed` lifecycle (Path B)

| Step | When | Code | Effect |
|---|---|---|---|
| Add | `ln-http:request` dispatched with `detail.key` | line 145 | `_keyed.set(userKey, controller)`. Only happens if `userKey` is truthy — keyless dispatches contribute no entry. |
| Abort previous | new dispatch lands on a userKey already in map | lines 130-133 | `_keyed.get(userKey).abort()`, then `_keyed.delete(userKey)`. |
| Remove on resolve | wrapped `fetch` resolved (any HTTP status) | line 155 | `if (userKey && _keyed.get(userKey) === controller) _keyed.delete(userKey)`. Same identity check as Path A. |
| Remove on reject (non-AbortError) | network failure | line 163 | Same identity check, then dispatch `ln-http:error`. |
| Skip on `AbortError` | rejected because superseded | lines 162-164 | The `if (err.name === 'AbortError') return` short-circuits silently. The `_keyed` entry was already replaced at line 132 by the new dispatch's `set`, and the identity check at line 163 — which fires unconditionally before the AbortError check — would incorrectly remove the new entry if it ran. **Important:** read lines 162-164 carefully — the cleanup runs BEFORE the AbortError test. The identity check (`=== controller`) is what saves it: by the time the aborted promise rejects, `_keyed.get(userKey)` is the newer controller, not this one, so the delete is skipped. |
| Remove on `cancelByKey(key)` | consumer called `lnHttp.cancelByKey(key)` | lines 189-194 | Aborts the entry under `userKey` and deletes. |
| Remove on `cancelAll()` | consumer called `lnHttp.cancelAll()` | lines 195-200 | Aborts every entry, then `.clear()`. |

## The fetch wrapper

### Composition at script load

1. Capture original: `_origFetch = window.fetch.bind(window)` (line 57).
2. Define `_wrappedFetch` (lines 83-114).
3. Add a `toString` override on the wrapper (line 116) that returns
   `'function fetch() { [ln-http wrapped] }'`. This is purely diagnostic
   — `console.log(window.fetch)` shows the wrapper's annotated
   string instead of the native source. It does not affect behavior;
   most code never `toString`'s `fetch`.
4. Install: `window.fetch = _wrappedFetch` (line 117).

The capture at line 57 happens before the IIFE installs the wrapper,
so re-loading the script after `destroy()` would re-capture the
already-wrapped fetch — but `destroy()` restores the original first
(line 215), so a re-init lands on the genuine `fetch`.

### Per-call flow (Path A — `_wrappedFetch`)

Every call to `fetch` in the page (on any URL, any method) flows
through `_wrappedFetch` (lines 83-114). Step by step:

1. **Normalize options.** `options = options || {}` (line 84). The
   browser's `fetch` accepts a missing second arg; the wrapper does too.
2. **Extract URL.** `_extractUrl(resource)` (lines 64-69) handles three
   shapes: `string`, `URL`, `Request`. Anything else is coerced via
   `String()`.
3. **Extract method.** `_extractMethod(resource, options)` (lines 72-76).
   Precedence: `options.method` > `resource.method` (when `resource` is
   a `Request`) > `'GET'`. Always uppercased.
4. **Build key.** `_key(url, method)` = `method + ' ' + url` (line 78).
   Single space separator chosen so that `cancel(url)` can identify
   the URL portion via `key.endsWith(' ' + url)` without parsing.
5. **Idempotent dedup.** If `_isIdempotent(method)` (line 79) and
   `_inflight.has(key)`, abort and delete the previous entry (lines
   91-94). Idempotent here means GET or HEAD — RFC-safe to drop.
6. **Compose abort signal.** Always create a fresh `AbortController`
   (line 97). If the consumer passed `options.signal`, hook it: aborts
   on the consumer signal call `controller.abort` with the consumer's
   reason (lines 99-104). The `{ once: true }` listener avoids leaks if
   the consumer signal is reused.
7. **Merge options.** `Object.assign({}, options, { signal: controller.signal })`
   (line 106) — a shallow copy with the controller's signal substituted.
   The original `options.signal` is replaced; the consumer's signal still
   triggers the abort via the listener installed at step 6.
8. **Store and call.** `_inflight.set(key, controller)` (line 108), then
   `_origFetch(resource, merged)` (line 110).
9. **`.finally` cleanup.** Lines 110-113. Identity check `_inflight.get(key) === controller`
   before delete. The check is the load-bearing detail: if a newer
   call between (8) and the network resolution wrote a fresher entry
   under the same key, we must NOT delete it.

The wrapper does not touch the response. It does not call `.json()`,
does not add headers, does not modify the body. The Promise returned
to the consumer is the same Promise `_origFetch` returned, with the
substituted signal as the only difference.

### Per-event flow (Path B — `_onRequest`)

`document.addEventListener('ln-http:request', _onRequest)` (line 173)
registers a single listener at script load. The handler (lines 121-171)
runs synchronously during `dispatchEvent` and returns; the actual fetch
runs asynchronously after.

1. **Read detail.** `const opts = e.detail || {}` (line 122). Tolerates
   missing detail (a `new Event('ln-http:request')` would still reach
   us — we just bail at the next step).
2. **Validate URL.** `if (!opts.url) return` (line 123). Silent — no
   warning, no error event. Mirrors Path A's "missing URL" behavior
   (browser fetch would throw, but our event API has nothing to throw
   to).
3. **Capture target.** `const target = e.target` (line 125). Held in
   the closure for the eventual response dispatch.
4. **Pick method.** `(opts.method || (opts.body ? 'POST' : 'GET')).toUpperCase()`
   (line 126). The body-implies-POST convention is a convenience for
   the common case; explicit `method` always wins.
5. **Capture key.** `const userKey = opts.key` (line 127).
6. **Explicit-key dedup.** Lines 130-133. If `userKey` is truthy AND
   the map already has it, abort and delete. No method check — Path B
   dedup is method-agnostic. This is the explicit-key cancel surface.
7. **Compose abort signal.** Same pattern as Path A (lines 136-143).
   Consumer's `opts.signal` is composed into `controller`.
8. **Store the controller (only if `userKey`).** Line 145. Keyless
   dispatches deliberately do NOT register an entry — they are
   one-shots; `cancelByKey` cannot abort them. Keyless aborts only
   reach them via the consumer's own `signal` or via `cancelAll()`.
9. **Build fetch options.** Line 147. `method` and `signal` are set;
   `body` is added at line 148 only if `opts.body !== undefined` —
   important so a `body: 0` or `body: ''` (intentional zero/empty
   payloads) DO get forwarded.
10. **Re-enter the wrapped `fetch`.** Line 153: `window.fetch(opts.url,
    fetchOptions)`. This is **deliberately the wrapped fetch**, not
    `_origFetch`. A Path B GET dispatched with a key passes through
    Path A's URL-dedup as well; both maps end up with entries for the
    same controller's request. Idempotent aborts make this safe.
11. **Resolve handler.** Lines 154-161. On any HTTP status (2xx, 4xx,
    5xx — fetch resolves regardless), clean up `_keyed` entry under
    the identity check, then `dispatch(target, 'ln-http:response',
    { ok, status, response })`. The raw `Response` is forwarded; no
    parse, no truncation.
12. **Reject handler.** Lines 162-170. Identity-checked cleanup, then
    early return on `AbortError` (silent), else
    `dispatch(target, 'ln-http:error', { ok: false, status: 0,
    error: err })`.

### Init / destroy

**Init** (the IIFE):

1. Script loads. `(function () { ... })()` runs immediately (line 54).
2. `if (window.lnHttp) return` (line 55) — double-load guard. If the
   script already loaded, bail. This protects against double-wrapping
   `fetch` (which would compose the wrapper with itself, doubling the
   dedup map updates per call — observable via `lnHttp.inflight`
   getting two entries per request).
3. Capture `_origFetch`, initialize `_inflight` and `_keyed`.
4. Define `_wrappedFetch`, install `window.fetch = _wrappedFetch`.
5. Register `document.addEventListener('ln-http:request', _onRequest)`.
6. Assign `window.lnHttp = { ... }` with the public API surface.

**Destroy** (`window.lnHttp.destroy`, lines 212-217):

1. `cancelAll()` — abort every entry in both maps and clear them.
2. `removeEventListener('ln-http:request', _onRequest)`.
3. `window.fetch = _origFetch` — restore the unwrapped reference.
4. `delete window.lnHttp` — let a re-init succeed (the double-load
   guard checks `window.lnHttp`).

`destroy()` is intended for hot-reload during development and test
teardown. Production pages do not need to call it.

## Event lifecycle

### Inbound — what the service listens to

| Event | Source | Phase | Effect |
|---|---|---|---|
| `ln-http:request` | any element (must bubble) | bubble | Reads `detail`, runs `_onRequest`. Silent return if `detail.url` is missing. |

The listener is registered with the default `useCapture: false`, so it
runs after any capturing listeners on `document`. Multiple
`ln-http:request` events from different consumers are handled
independently — the wrapper does not serialize them; the underlying
`fetch` calls run concurrently.

### Outbound — what the service dispatches

Both events fire via `dispatch(target, eventName, detail)` from
[`js/ln-core/helpers.js`](../../js/ln-core/helpers.js), which sets
`bubbles: true` and `cancelable: false`.

| Event | Bubbles | Cancelable | `detail` | When |
|---|---|---|---|---|
| `ln-http:response` | yes | no | `{ ok, status, response }` | wrapped `fetch` resolved with any HTTP status. `response` is the raw `Response`. |
| `ln-http:error` | yes | no | `{ ok: false, status: 0, error }` | wrapped `fetch` rejected with a non-Abort error (network failure: DNS, offline, CORS rejection). |

Aborted requests dispatch nothing. The dispatch target is **always
the original element the consumer fired from** — captured at line 125
and held in the closure for the duration of the async chain.

### Why no `ln-http:success` event

A separate "success" event would force consumers to wire two listeners
(`response` for non-2xx, `success` for 2xx) and provide no benefit —
the consumer already knows how to read `response.ok` or branch on
`status`. Forwarding the raw `Response` and letting the consumer
inspect it is simpler and matches `fetch`'s own contract: `fetch` does
not reject on 4xx/5xx; neither does `ln-http:response`.

## Coordinator / cross-component contract

### Path A inbound contract

Any caller of `window.fetch` is a Path A consumer. The wrapper
intercepts all calls with no opt-in. The contract is:
- Pass `(resource, options)` as you would to native `fetch`.
- The returned Promise resolves or rejects on the same conditions.
- An `AbortError` rejection means a newer GET/HEAD on the same URL
  superseded this one. Treat it as "the newer answer is the answer."
- A consumer-passed `options.signal` is honored; aborting it cancels
  the request.

### Path B inbound contract

Consumer dispatches `ln-http:request` with at minimum `{ url }`. The
event must bubble. ln-http's listener sits on `document`. Optional
fields:
- `method` — `string`, defaults to `'POST'` if `body` is given else `'GET'`.
- `body` — anything `fetch` accepts. Forwarded raw.
- `key` — `string`. Triggers explicit-key dedup; without it, the
  dispatch is a one-shot.
- `signal` — `AbortSignal`. Composed into ln-http's controller; either
  side aborting cancels.

### Path B outbound contract

ln-http dispatches `ln-http:response` or `ln-http:error` on the
original target. Both bubble. Detail shape:

```ts
// ln-http:response
{
    ok:       boolean,    // === response.ok
    status:   number,     // HTTP status (200, 404, 500, …)
    response: Response    // raw Response — consumer calls .json()/.text()/.blob()
}

// ln-http:error
{
    ok:     false,
    status: 0,
    error:  Error         // the original rejection reason from fetch
}
```

The `Response` is forwarded raw rather than pre-parsed for two reasons.
First, `Response.body` is consumed by any read call — there is exactly
one shot at parsing it; the consumer is the one who knows whether to
try JSON, text, or blob. Second, ln-http does not advertise itself as
a JSON transport; pre-parsing as JSON would break consumers that
expect HTML, text, or binary.

### What the contract does NOT include

- **No retry.** A failed fetch is final.
- **No timeout.** Consumer schedules its own abort via
  `AbortController` + `setTimeout`, or via Path B `key` collision
  scheduled by the consumer.
- **No request interceptor / hook.** Path A is unconditional; consumer
  cannot mutate outbound requests via global config.
- **No response interceptor / middleware.** Same.
- **No `headers` field on Path B request detail.** Auth headers, X-CSRF-TOKEN,
  custom correlation IDs — consumer adds them at the dispatch site
  (typically by calling `fetch` directly for those paths) or accepts
  that Path B is for endpoints that don't need them.
- **No Promise return on Path B.** `dispatchEvent` returns boolean;
  the response is async and arrives as an event. Wrap in a Promise
  yourself if needed (README example).
- **No `ln-http:before-request`.** Cancellation channel is `key`,
  `cancelByKey`, or `signal`.

## Edge cases

### `AbortError` cleanup ordering

Lines 162-170 of `_onRequest`:

```js
.catch(function (err) {
    if (userKey && _keyed.get(userKey) === controller) _keyed.delete(userKey);
    if (err && err.name === 'AbortError') return;
    dispatch(target, 'ln-http:error', { ok: false, status: 0, error: err });
});
```

The cleanup line runs BEFORE the AbortError check. This is correct
because the identity check `_keyed.get(userKey) === controller`
naturally distinguishes "I was aborted because a newer request
overwrote me" (the get returns the newer controller, the check fails,
no delete) from "I was aborted via cancelByKey or cancelAll" (the
delete already happened in the cancel function, the check fails again,
no delete). Either way, the right thing happens.

### Path B GET with a key — both maps tracked

A consumer dispatch like:

```js
el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: { url: '/api/data', method: 'GET', key: 'my-key' }
}));
```

…enters _onRequest, which stores the controller in `_keyed['my-key']`,
then calls `window.fetch('/api/data', ...)`. That call is the wrapped
fetch, which builds key `'GET /api/data'` and stores the SAME
controller (well — it stores its own freshly-created controller — see
below) in `_inflight`.

Subtlety: each path creates its own `AbortController`. _onRequest's
controller (line 136) is the one stored in `_keyed`. The wrapped
fetch creates ANOTHER controller (line 97) and stores that in
`_inflight`. The two controllers are linked because _onRequest passes
its `controller.signal` as `options.signal` to the wrapped fetch —
the wrapper's signal-composition code (lines 99-104) listens on it and
aborts the wrapper's own controller when ours aborts.

So aborting the Path B entry (`cancelByKey('my-key')`) cascades:
1. Path B's controller aborts.
2. Path B's signal — passed as `options.signal` to the wrapped fetch
   — fires its abort event.
3. The wrapped fetch's listener (line 101-103) aborts the wrapped
   fetch's controller.
4. The original `fetch` rejects with `AbortError`.

Aborting the Path A entry (`cancel('/api/data')`) does NOT cascade
back — Path A's controller is internal to the wrapper; aborting it
rejects the original `fetch` Promise but does not trigger Path B's
controller. The `_keyed` entry remains, and the `.catch` in _onRequest
runs, sees `AbortError`, returns silently, and the identity-checked
cleanup leaves `_keyed` consistent.

### Body forwarding semantics

Path A: `options.body` is forwarded to `fetch` exactly as the consumer
passed it. ln-http does not stringify, does not call `JSON.stringify`,
does not coerce. Whatever `fetch` supports — string, `FormData`,
`Blob`, `URLSearchParams`, `ArrayBuffer`, `ReadableStream` — works.

Path B: `detail.body` is forwarded to `fetch` exactly as well, but
only if `opts.body !== undefined` (line 148). The strict
`!== undefined` check (rather than truthy) preserves intentional
falsy bodies: `body: 0`, `body: ''`, `body: false`. A consumer that
passes `body: null` gets `body: null` forwarded (which `fetch` accepts).

### `_extractUrl` precedence — Request before string

`_extractUrl` (lines 64-69) checks `string` first, then `URL`, then
`Request`. The order matters when a consumer passes a `Request`
object: we extract `request.url`, NOT `request.toString()`. The
last-resort `String(resource)` covers exotic inputs (e.g. a Blob URL
created via `URL.createObjectURL`) and is a defensive fallback rather
than a documented behavior.

### `_extractMethod` precedence — options before Request

If the consumer constructs a `new Request('/api', { method: 'POST' })`
and then calls `fetch(request, { method: 'PUT' })`, the wrapper picks
`'PUT'` (line 73) — `options.method` wins. This matches native fetch
semantics: when both forms are provided, the second-arg options take
precedence over the Request's pre-baked configuration.

### Idempotent set is hardcoded to GET / HEAD

`_isIdempotent` (line 79) returns `true` for GET and HEAD only. RFC
7231 defines DELETE and PUT as idempotent too, but that's about
**server-side effect**, not about safe-to-drop client-side. Cancelling
an in-flight DELETE because a newer DELETE landed silently drops the
older one — which the user might have intended. The conservative
choice is to limit auto-dedup to truly safe-to-drop methods. Path B's
`key` channel exists exactly for the cases where the consumer wants
DELETE / PUT cancel behavior on demand.

### Third-party scripts on the page get their fetch wrapped too

Once `window.fetch = _wrappedFetch` (line 117), every script in the
page sees the wrapper — including third-party SDKs (analytics, error
reporting, A/B test frameworks). The dedup applies to their GETs as
well. This is acceptable because:

- Path A is GET/HEAD only. Third-party GETs that race the same URL
  would have been racing anyway; ln-http makes the loser quiet.
- Browsers have per-host connection caps (HTTP/1.1: ~6 per host) —
  on a busy page, racing GETs already serialize at the network layer.
- Third-party POSTs are NEVER auto-cancelled (Path A leaves them
  alone; Path B requires a `key` they don't dispatch).

The cost is a closure dispatch per `fetch` call, regardless of
origin. For pages with thousands of `fetch` calls per second, this
overhead is negligible compared to the network. For pages that
disagree with this trade-off, `lnHttp.destroy()` restores the original
fetch.

### Body mutation after dispatch (Path B)

`opts.body` is captured at the start of `_onRequest` and used at line
148. The `fetch` call that uses it (line 153) runs synchronously inside
the dispatch, so any mutation of the consumer's body object after
`dispatchEvent` returns happens AFTER the fetch starts — fetch has
already taken its snapshot by then. Mutation between dispatch and the
synchronous fetch call (a capture-phase listener that mutates
`e.detail.body`) WOULD leak. Don't do that.

### Concurrent dispatches with different `key`s

`_keyed` is keyed by string. Two simultaneous dispatches with different
keys are independent — both run, both produce events. The map's lookup
is `O(1)`; the listener does not serialize. The browser's connection
pool is the only throttle.

## Performance considerations

Cost per Path A `fetch`:

- One `_extractUrl` call — three `instanceof` tests at most.
- One `_extractMethod` call — at most one method-property read.
- One `_key` string concat.
- One `Map.has` + `Map.get` + maybe `.abort()` + `Map.delete`.
- One `AbortController` allocation.
- One conditional `.addEventListener` on the consumer signal.
- One `Object.assign` shallow-copy of options.
- One `Map.set`.
- One `_origFetch` call (the real network).
- One `.finally` callback registration.

All of this is O(1) and synchronous. The dominant cost is the network
itself.

Cost per Path B dispatch:

- All of the above (the wrapped fetch is called from line 153).
- Plus: one `Map.has` + maybe `.abort()` + `Map.delete` for `_keyed`.
- Plus: one `Map.set` if `userKey` is truthy.
- Plus: two `.then` / `.catch` callback registrations.
- Plus: one `dispatch` (CustomEvent + dispatchEvent) on response /
  error.

The two maps are tiny in normal usage (typically 0-5 entries each).
Lookups are O(1). There is no batching, queue, throttle, or rate
limit; the browser's connection pool is the only natural throttle.

## Design decisions

### Why wrap `window.fetch` instead of providing an API?

A `lnHttp.fetch(url, options)` API would force every call site to
import or reference ln-http. That would either:

1. Make every component depend on ln-http (violates the
   parasitic-shape principle — components must work without ln-http).
2. Make consumers wrap `fetch` everywhere themselves (duplicates the
   library's job).

Wrapping `window.fetch` is invisible to call sites. Components keep
calling `fetch` natively. ln-http loaded → dedup happens. ln-http not
loaded → no dedup, same code paths.

### Why two paths instead of one?

Path A solves the case where dedup must be transparent — search inputs
inside components that don't know ln-http exists. Without Path A, every
search component would have to wrap fetch itself.

Path B solves the case where dedup must be explicit — POST / PUT /
DELETE cancellation that Path A intentionally refuses to do
automatically. A consumer that wants reorder-POST cancel can dispatch
`ln-http:request` with a key; a consumer that wants two independent
POSTs to the same URL just calls `fetch` twice (Path A leaves
non-idempotent methods alone).

Combining both into one path would force a choice: either auto-cancel
everything (silently drops POSTs — wrong) or never auto-cancel (loses
the transparent search behavior — also wrong). Two paths with
different defaults match the actual use cases.

### Why no auto-cancel for non-idempotent methods (Path A)?

POST / PUT / PATCH / DELETE encode user intent. Dropping an older POST
because a newer POST landed silently discards the older intent — and
the API call that would have happened just doesn't, with no event,
no signal, nothing visible. That is a class of bug nobody would write
on purpose.

The consumer who wants "supersede old POSTs" knows they want it and
can opt in via Path B with a `key`. Defaulting to "preserve POSTs"
matches the principle of least surprise.

### Why forward the raw `Response` instead of pre-parsing JSON?

Three reasons.

First, `Response.body` is consumed by any read call (`.json()`,
`.text()`, `.blob()`, `.arrayBuffer()`, `.formData()`). Calling one of
them inside ln-http means consumers cannot call any of the others
afterward. ln-http does not know which the consumer wants.

Second, parsing eagerly biases the contract. Pre-parsing JSON makes
ln-http look like a JSON transport; it is not. The same component
should be able to dispatch a `ln-http:request` to an HTML endpoint or
a binary blob endpoint and get the body in the right shape.

Third, error handling shifts. A pre-parsed JSON path would have to
synthesize a new error shape on parse failure ("invalid response"), and
the consumer would lose access to the raw status code and headers. By
forwarding the raw `Response`, the consumer gets the full HTTP
information and chooses the parse strategy themselves.

### Why no `ln-http:request-success` event for POST without a `key`?

A keyless Path B dispatch is a one-shot. The consumer chose not to
opt into dedup. Adding a parallel "success" event for that path
would create a contract surface that says "fire-and-forget POSTs
have a different success channel" — but they don't; they have the
same `ln-http:response` channel as keyed dispatches. The simpler
contract: every Path B dispatch (keyed or not) gets `ln-http:response`
on resolve and `ln-http:error` on network failure.

### Why is `_inflight` keyed by `"METHOD URL"` instead of just URL?

So two methods to the same URL are independent entries. Without
the method prefix, a GET and a POST to `/api/users` would collide and
the GET arriving while a POST was in flight would dedup against the
POST — which is wrong (the POST is not a "previous version" of the
GET). The method is part of the request identity at the network layer;
including it in the dedup key matches that.

### Why is `_keyed` a separate map from `_inflight`?

The two maps have different semantics:

- `_inflight` is "what's currently in flight via the wrapper" — even
  for keyless wrapped fetches, every call is in there. The consumer
  did not choose to dedup; the wrapper did it for them on GET/HEAD.
- `_keyed` is "what the consumer has explicitly opted into supersede
  semantics for via Path B". Every entry has a consumer-chosen key.

Merging them would force one of the two namespaces to accommodate the
other. Keyed entries would need synthetic URL-method keys; URL-method
entries would need synthetic keys. Both would be lies. Two maps, two
clear ownership boundaries.

### Why does `cancel(url)` scan `_inflight` instead of taking method as a parameter?

The common use case is "cancel all in-flight calls to this URL,
regardless of method." A consumer typically wants `cancel('/api/slow-report')`
to nuke whatever's racing on that URL. Adding a method parameter
would force consumers to know which method is in flight, which they
often don't care about.

If we needed `cancel(url, method)` for finer control, we'd add an
overload. So far no consumer has requested it.

### Why is `cancelByKey` a separate API from `cancel`?

The two namespaces are different. `cancel('/api/users')` operates on
URL strings; `cancelByKey('my-poll')` operates on consumer-chosen
keys. A unified API would have to disambiguate ("is `'reorder'` a URL
or a key?") with a heuristic — leading-slash detection, for example —
and that heuristic is exactly the kind of magic that breaks when a
URL happens to look like a key or vice versa. Two methods, two
explicit namespaces.

## Why not X?

### Why not auto-cancel POSTs with same URL + body hash?

Body hashing is expensive per-request (every body is hashed even when
no dedup will trigger), the equivalence check is wrong for `FormData`
(streams, files), and "I want this POST to supersede a previous one
with the same body" is not a real use case — if the consumer wanted
that, the previous POST was redundant and should not have been fired.

The Path B `key` channel handles "supersede previous non-idempotent
request" explicitly. The consumer chooses the key; the wrapper does
not guess.

### Why not return a Promise from `dispatchEvent` (Path B)?

`dispatchEvent` is a DOM API; its return type is boolean (the
`cancelable` flag). Wrapping every Path B dispatch to return a
Promise would either monkey-patch every event (no) or split the
contract into "use the event" and "use a function" (which one is
authoritative? what happens if both fire?). The README provides a
15-line wrapper for the Promise-shaped consumer; that lives in
consumer code where it belongs.

### Why not bake in retry logic?

Per-feature. Search retry = "type again." Save retry = "queue and
drain on online" (an `ln-store` pending-queue concern). Polling retry
= "wait for next interval." None of these are uniform enough to
deserve a default.

### Why not handle CSRF via meta tag automatically?

It is consumer-specific. Laravel uses `X-CSRF-TOKEN` or `_token`
body field. Rails uses `X-CSRF-Token`. Other frameworks use other
names. Sniffing one specific tag and one specific header would be
wrong for every other framework. The dispatch site adds the token
itself — three lines of code, one place per project.

### Why not parse non-JSON responses?

ln-http forwards the raw `Response`. Parsing is the consumer's job.
Adding a `responseType` field on Path B would mean shipping a
discriminated union, doubled error paths, and a meaningful chance of
mis-parsing. The consumer knows what shape the endpoint returns;
they call `.json()`, `.text()`, `.blob()` themselves.

### Why no per-element `data-ln-http` attribute?

There is nothing per-element to configure. The contract IS the event
detail (Path B) or the `fetch` call signature (Path A). A
`data-ln-http` attribute would have to do one of:

- Mark elements as "request anchors" (gain: nothing — any element can
  dispatch today).
- Pre-configure default URLs / methods (gain: marginal — JS could put
  them in the detail directly).
- Auto-bind submit handlers (overlaps with `ln-form`).

None of those carry their weight against "no attribute, just dispatch
the event."

### Why is `inflight` a getter that returns a snapshot, not a live `Map`?

Returning the live `Map` would let consumer code mutate it and break
the dedup invariants. A getter that builds a fresh array on each access
is safe to inspect without leaking ownership of the underlying state.
The cost is one allocation per call; consumers that need this for a
dev overlay typically poll once per animation frame, which is fine.

## Risk surface

**Wrapping `window.fetch` is a mutation of a global.** The wrapper is
the right abstraction layer for what the library does (transparent
URL-dedup), but it has implications:

- **Other libraries' fetches are wrapped.** Analytics, error
  reporting, A/B test SDKs, Service Worker registrations — they all go
  through `_wrappedFetch`. Path A is GET/HEAD-only and POST is
  untouched, so the practical impact is "their racing GETs cancel each
  other," which is at worst harmless (browsers limit per-host
  connections anyway) and at best beneficial.

- **Hot-reload / re-init.** A reloading dev tool that loads ln-http
  twice without `destroy()` between would hit the double-load guard
  (line 55) and bail. This protects against double-wrapping. Tests
  that need clean state should call `destroy()` in teardown.

- **Custom fetch polyfills.** A page that imports a `fetch` polyfill
  (e.g. for IE) needs the polyfill installed BEFORE ln-http loads.
  Otherwise `_origFetch` captures the polyfill, the wrapper installs
  on top, and everything works fine — but if the polyfill loads
  AFTER ln-http, it will overwrite `window.fetch` with the unwrapped
  polyfill and ln-http's wrapper is bypassed.

- **`Response` re-use.** Because `e.detail.response` on Path B is the
  raw `Response`, two consumers listening on the same target both see
  the same Response object. The first one to call `.json()` (or any
  read method) consumes the body; the second sees an already-consumed
  Response and gets a TypeError. If two listeners genuinely need the
  body, one of them must `.clone()` first. This is a `fetch`
  contract, not a ln-http quirk.

These risks are acceptable because the alternative — every component
implementing its own dedup — is worse. The risk is concentrated and
auditable.

## Reading order

If you have just been onboarded and need to understand how an HTTP
request flows through the library:

1. **README.md** — what the component does and how to use both paths.
2. **This document, "The fetch wrapper"** — the per-call flow for
   Path A, top to bottom.
3. **This document, "Per-event flow"** — the per-dispatch flow for
   Path B and how it composes with Path A.
4. **`js/ln-http/ln-http.js`** — the full source, ~165 lines.
5. **"Edge cases" + "Risk surface"** — re-read on unexpected behavior;
   most of it is in the listed cases.
