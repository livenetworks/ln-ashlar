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

## ⚡ DOM Events (Path B response lifecycle)

Both events bubble from the element that dispatched the original `'ln-http:request'`.

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
