# ln-http

A zero-dependency, global **HTTP Concurrency Coordinator** that intercepts browser network operations to prevent race conditions, out-of-order responses, and duplicate submission side-effects.

It manages requests on two distinct pipelines: **Path A** (transparent GET/HEAD URL-deduplication wrapping `window.fetch`) and **Path B** (explicit key-based event-driven cancellations for POST/PUT/DELETE).

---

## 🧭 Philosophy & Architecture

1. **Path A (Transparent GET/HEAD Concurrency):** Automatically intercepts global `fetch()` calls. If a GET/HEAD request to the exact same URL is already in-flight (e.g., search-as-you-type), the predecessor is instantly aborted. POST and unsafe methods are bypassed to preserve intent.
2. **Path B (Event-Driven Keyed Concurrency):** Listens globally for `ln-http:request` events containing a distinct `key` (e.g. `reorder-list-1`). A new dispatch instantly aborts any existing in-flight request bearing the same key (any method), preventing double-submit or drag-and-drop overlaps.
3. **Composition, Not Modification:** `ln-http` is a transport supervisor. It does not inject headers, manipulate bodies, or parse responses. It focuses entirely on socket cancellation via standard browser `AbortController` signals.

---

## 📦 Minimal Blueprint

### Path A (Transparent URL-Deduplication)
Just use the standard native `fetch` API. Older identical GET requests are aborted automatically.
```js
// Rapid keystrokes abort previous search GETs transparently
try {
  const res = await fetch('/api/search?q=query');
  const data = await res.json();
} catch (err) {
  if (err.name === 'AbortError') return; // Swallowed abort
}
```

### Path B (Event-Driven Concurrency)
Dispatch an `ln-http:request` event with a unique `key` from any element.
```js
element.dispatchEvent(new CustomEvent('ln-http:request', {
  bubbles: true, // Must bubble to document!
  detail: {
    url: '/api/items/reorder',
    method: 'POST',
    body: JSON.stringify({ ids }),
    key: 'items-reorder'
  }
}));
```

---

## 🛠️ Declarative API Contract

### Path B Request Object (`detail`)

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `url` | `string` | *Required* | Target endpoint URL. |
| `method` | `string` | `'GET'` | HTTP verb. Automatically capitalized. |
| `body` | `any` | `null` | Request payload (JSON string, FormData, Blob, etc.). |
| `key` | `string` | `null` | Unique identifier to cancel previous in-flight requests under this key. |
| `signal` | `AbortSignal` | `null` | Optional external signal to compose with the internal abort controller. |

### Global JavaScript API (`window.lnHttp`)

| Member | Type | Description |
| :--- | :--- | :--- |
| `cancel(url)` | `(url: string) => boolean` | Aborts all Path A in-flight requests matching `url`. |
| `cancelByKey(key)` | `(key: string) => boolean` | Aborts the Path B in-flight request matching `key`. |
| `cancelAll()` | `() => void` | Aborts all active in-flight requests (both paths). |
| `inflight` | `getter` | Returns snapshot of active requests: `{ url, method }` or `{ key }`. |
| `destroy()` | `() => void` | Clears all pending requests, removes event listeners, restores native `fetch`. |

---

## ⚡ DOM Events (Path B response lifecycle & declarative control)

### `ln-http:cancel`
Listened on `document`. Declaratively cancels in-flight requests without calling imperative window methods.
- `detail`: `{ key?: string, url?: string, all?: boolean }`

Both response events bubble from the element that dispatched the original `'ln-http:request'`.

### `ln-http:response`
Fired when `fetch` resolves. The consumer must branch on `ok`/`status` and parse the raw body.
- `detail`: `{ ok: boolean, status: number, response: Response }`

### `ln-http:error`
Fired when network-level failures reject the fetch promise (excluding aborts).
- `detail`: `{ ok: false, status: 0, error: Error }`

---

## ⚠️ Common Pitfalls

- **Forgetting `bubbles: true`:** Path B listens on the `document` level. Events dispatched without `bubbles: true` will never reach the service and fail silently.
- **Ignoring `AbortError`:** Canceled Path A GET promises reject with an `AbortError`. Presenters must explicitly check and catch this error to avoid logging false failures.
- **Accessing response body twice:** `response` in the `ln-http:response` detail is a native `Response` stream. It can only be parsed (e.g., `.json()`, `.text()`) once.

---

## 🔧 Internals

Source: `components/ln-http/ln-http.js`. A **service-style global**: wraps `window.fetch`, listens on `document`, no DOM instance, no `data-ln-*`, no MutationObserver. Two closure-private `Map`s hold all state — `_inflight` (`"METHOD URL" → AbortController`, Path A) and `_keyed` (`consumer key → AbortController`, Path B) — plus `_origFetch`, the unwrapped `fetch` captured at load, used to restore on `destroy()`.

### Parasitic design

Other library components (`ln-form`, `ln-ajax`, `ln-store`, `ln-table`, `ln-icon`) call `fetch()` directly with no reference to ln-http. If ln-http loads, those calls are silently routed through the wrapper and inherit Path A dedup; if it doesn't load, they still work, just without dedup. No component has a hard dependency on ln-http.

### Path A — wrapped `fetch`

Every `fetch()` call in the page flows through `_wrappedFetch`: extract URL (`string`/`URL`/`Request`, in that precedence) and method (`options.method` > `Request.method` > `'GET'`), build key `method + ' ' + url`. If idempotent (**GET/HEAD only** — DELETE/PUT are RFC-idempotent but dropping an in-flight one because a newer one landed silently discards user intent, so auto-dedup is deliberately conservative) and a same-key entry exists, abort + delete it. A fresh `AbortController` is always created and composed with any consumer-passed `options.signal` (a `{ once: true }` listener re-aborts the wrapper's controller when the consumer's signal fires). The merged options substitute the composed signal; `_origFetch` is called with them. On settle, `.finally` deletes the `_inflight` entry **only if it still holds this call's controller** — an identity check that prevents a newer same-key call's fresher entry from being wiped by an older call's cleanup.

The wrapper never touches the response — no `.json()`, no header injection, no body mutation. The returned Promise is `_origFetch`'s own, with only the signal substituted.

### Path B — `ln-http:request` event

A single `document` listener (`_onRequest`) handles `ln-http:request`. It reads `e.detail` (bails silently if `detail.url` is missing), captures `e.target` for the eventual response dispatch, resolves method (`opts.method || (opts.body ? 'POST' : 'GET')`), and — if `opts.key` is truthy — aborts+deletes any existing `_keyed` entry under that key (method-agnostic; no method check). A fresh controller is composed with `opts.signal` the same way as Path A, and stored in `_keyed` **only if a key was given** (keyless dispatches are one-shots; `cancelByKey` can't reach them). `opts.body` is forwarded with a strict `!== undefined` check, so intentional falsy bodies (`0`, `''`, `false`) still get sent.

The actual network call **re-enters the wrapped `fetch`** (not `_origFetch`) — so a Path B GET with a key is tracked in both maps simultaneously via two separate, signal-linked `AbortController`s; aborting the Path B entry cascades into aborting the Path A one via the composed signal, but not vice-versa.

On resolve (any HTTP status): identity-checked `_keyed` cleanup, then dispatch `ln-http:response` `{ ok, status, response }` — the raw, unparsed `Response`. On reject: identity-checked cleanup runs **before** the `AbortError` check (correct because the identity check itself distinguishes "superseded" from "actually failed" — if superseded, the map already holds the newer controller and the check no-ops); non-abort errors dispatch `ln-http:error` `{ ok: false, status: 0, error }`.

### Init / destroy

Script-load IIFE bails early if `window.lnHttp` already exists (double-load guard — prevents double-wrapping `fetch`, which would double every dedup update per call). Otherwise: capture `_origFetch`, init both maps, install `_wrappedFetch` on `window.fetch`, register the `ln-http:request` listener, publish `window.lnHttp`. `destroy()` reverses all of it (`cancelAll()`, remove listener, restore `window.fetch = _origFetch`, `delete window.lnHttp`) — meant for hot-reload/test teardown, not production use.

### Why two maps, why raw Response

`_inflight` is unconditional per-request bookkeeping the wrapper does for every idempotent call; `_keyed` is opt-in, consumer-chosen supersede semantics via Path B. Merging them would force synthetic keys onto one or the other. The `Response` is forwarded unparsed because its body can only be read once (`.json()`/`.text()`/etc. are mutually exclusive) and ln-http doesn't know — or want to presume — which the consumer needs; two listeners on the same target must `.clone()` if both need the body, same as any other `fetch` consumer.

### Risk surface

Wrapping `window.fetch` is a global mutation — third-party scripts (analytics, A/B SDKs) get wrapped too, but since Path A only touches GET/HEAD, the practical effect is limited to their own racing GETs cancelling each other. A `fetch` polyfill installed *after* ln-http loads will overwrite the wrapper and bypass it; one installed before is captured as `_origFetch` and composes fine.
