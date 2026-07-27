# ln-ajax

A zero-dependency, event-driven **HTML Fragment Swapping Primitive** that intercepts clicks on `<a>` elements and submits on `<form>` tags to enable instant, SPA-like navigation without full page reloads.

It communicates via a structured server JSON protocol, exchanging targeted DOM updates, updating browser history states, and re-attaching lifecycle managers to newly injected nodes.

---

## 🧭 Philosophy & Architecture

1. **HTML-First Swapping:** The server remains the single source of truth for both data and markup. Instead of client routers rendering JSON arrays, the server compiles standard HTML fragments and returns them inside a structured JSON payload.
2. **Selective DOM Merges:** The response maps selector IDs (e.g. `main-content`) directly to their new HTML chunks, replacing only the specified regions in-place.
3. **Transparent Enhancements:** Intercepts only native interactions (links to the same origin, form submissions). Safely falls back to native browser redirects on errors or external hosts.

---

## 📦 Minimal Blueprint

Wrap interactive elements or entire layouts with the `data-ln-ajax` selector.

```html
<div data-ln-ajax>
  <!-- Clicking this fetches /dashboard and swaps only the returned targets -->
  <a href="/dashboard">Dashboard</a>
  
  <!-- Submitting this posts data and swaps target parts on success -->
  <form method="POST" action="/users/create">
    <input name="username" type="text" required>
    <button type="submit">Create User</button>
  </form>

  <!-- Exclude specific elements from AJAX handling -->
  <a href="/logout" data-ln-ajax="false">Logout</a>
</div>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Values | Description |
| :--- | :--- | :--- | :--- |
| `data-ln-ajax` | Container, `<a>`, `<form>` | *none* (empty attribute) | Activates AJAX capture on the element and its descendants. Acts as a boolean flag. |
| `data-ln-ajax="false"` | `<a>`, `<form>` | `"false"` | **The only supported value.** Excludes the specific link or form from AJAX interception. |

> [!IMPORTANT]
> **Attribute Value Restriction:** The `data-ln-ajax` attribute operates as a presence-based trigger (like a boolean flag). 
> * **The only valid and supported value is `"false"`**, which is used to exclude/opt-out specific elements inside an AJAX-enabled container.
> * **Do not use custom values** (e.g., `data-ln-ajax="loginform"` or `data-ln-ajax="my-widget"`). The component does **not** accept, process, or assign behavior based on other string values. Using custom values will simply activate normal AJAX routing (acting the same as an empty attribute) but is a major anti-pattern that confuses both developers and AI agents.

### Server Response Protocol

The server must return JSON with the `application/json` Content-Type:

```json
{
  "title": "New Dashboard Page",
  "content": {
    "main-content": "<h1>Dashboard</h1><p>Welcome back!</p>",
    "sidebar-nav": "<ul><li>Active Nav Item</li></ul>"
  },
  "message": {
    "type": "success",
    "title": "User Created",
    "body": "The user was registered successfully."
  }
}
```

* **`title`**: Updates `document.title` on page swap.
* **`content`**: Key-value pairs matching container `id` selectors to their new `innerHTML` content.
* **`message`**: Optional. If present, automatically dispatches `ln-toast:enqueue` on the `window` to trigger native notifications.

---

## ⚡ DOM Events

All events are dispatched on the initiating element (`<a>` or `<form>`) and bubble.

| Event | Cancelable | Description | Payload (`detail`) |
| :--- | :--- | :--- | :--- |
| `ln-ajax:before-start` | **Yes** | Fires before any network activity. Call `e.preventDefault()` to cancel. | `{ method, url }` |
| `ln-ajax:start` | No | Fires as the loader class is added and fetch begins. | `{ method, url }` |
| `ln-ajax:success` | No | Fires after successful DOM swaps. | `{ method, url, data }` |
| `ln-ajax:error` | No | Fires on HTTP status failure or network rejects. | `{ method, url, status, data }` or `{ method, url, error }` |
| `ln-ajax:complete` | No | Fires at the very end of the lifecycle (success or error). | `{ method, url }` |

---

## ⚠️ Common Pitfalls

- **Missing DOM IDs on Swap Targets:** If the server returns a key in `content` that does not match a mounting ID in the active document (e.g. `id="main-content"`), that segment swap fails silently.
- **Forgetting CSRF Meta:** `ln-ajax` automatically reads `<meta name="csrf-token" content="...">` to inject the `X-CSRF-TOKEN` header on non-GET calls. If this meta tag is missing, POST/PUT requests may fail authentication.
- **Breaking External Links:** Links with different hostnames are ignored automatically, but absolute paths on the same host are captured. Ensure assets/downloads use `data-ln-ajax="false"`.
- **Forms carrying `data-ln-form-scope` are skipped entirely** (one-time `console.warn`) — the `ln-data-coordinator` write pipeline takes precedence over ajax progressive enhancement.
- **Respects `e.defaultPrevented`.** If a prior `submit` listener on the same form (e.g. a validation gate) already called `preventDefault()`, `ln-ajax` does nothing — no fetch, no loader class.

---

## 🔧 Internals

Source: `js/ln-ajax/ln-ajax.js`.

### Request lifecycle

In order, per intercepted click/submit:

1. **Intercept** — click on `<a>` or submit on `<form>`. Modifier-key clicks (Ctrl/Cmd/middle) and `#`-href links pass through untouched.
2. **External-hostname skip** — if the link's hostname differs from `location.hostname`, ln-ajax aborts and the browser follows the link normally (no opt-out needed).
3. **`ln-ajax:before-start`** — cancelable; `preventDefault()` stops here (no spinner, no fetch).
4. **Spinner mount** — `.ln-ajax--loading` on the trigger, `<span class="ln-ajax-spinner">` appended, form buttons disabled.
5. **`ln-ajax:start`** — non-cancelable; fetch is about to begin.
6. **`fetch()`** — built from `href`/`action`, `method`, `FormData`. Headers always include `X-Requested-With`, `Accept: application/json`, and `X-CSRF-TOKEN` from the page meta. A `<input name="_method">` (auto-added by `ln-form`'s RESTful mode) rides in `FormData` transparently — the HTTP verb stays POST while `_method` travels in the body.
7. **Response** — see the branches below.
8. **`ln-ajax:success` / `ln-ajax:error`** — dispatched on the trigger, bubbling.
9. **Cleanup** — loading class + spinner removed, buttons re-enabled.
10. **`ln-ajax:complete`** — always fires last, success or error.

Response branches:
- **HTTP error** (`!response.ok`): parse JSON, dispatch `ln-ajax:error` `{ method, url, status, data }`, auto-toast if `data.message`.
- **Fetch rejection** (network / JSON parse): dispatch `ln-ajax:error` `{ method, url, error }`.
- **Success**: update `document.title`, swap `target.innerHTML` for each `data.content[id]`, auto-toast if `data.message`, `history.pushState` for `<a>` and GET `<form>`.

### MutationObserver flow

A single observer on `document.body` handles three cases:
- **New `data-ln-ajax` root injected** → `new lnAjax(node)` attaches listeners (covers AJAX-swapped frames and `innerHTML` writes).
- **Elements injected inside a live root** → `findElements` re-runs on the subtree and attaches to any new `<a>`/`<form>` — no full re-init of the root.
- **`data-ln-ajax` set on an existing element** → the attributes branch runs `new lnAjax(node)`, so programmatic opt-in works.

### DOM mutations performed

| Phase | Mutation |
|-------|----------|
| Request start | `.ln-ajax--loading` on trigger |
| Request start | `<span class="ln-ajax-spinner">` appended to trigger |
| Request start | `disabled` on all `<button>` descendants of a `<form>` trigger |
| Success | `target.innerHTML` replaced per `id` in `data.content` |
| Success | `document.title` updated from `data.title` |
| Success (`<a>` / GET `<form>`) | `history.pushState` |
| Completion | loading class + spinner removed, form buttons re-enabled |

### `findElements` local divergence

ln-ajax uses a local `findElements` rather than the ln-core helper of the same name: it needs a `{ links, forms }` partition (to bind `click` on links and `submit` on forms in one pass), where ln-core returns a flat list. The two must not be merged without updating all call sites.

### Trust boundary

ln-ajax operates under a trusted, same-origin model: it expects every HTML fragment in the JSON response to be safe. It performs **no** client-side sanitization or regex script/attribute filtering — that would be fragile and would corrupt valid markup (e.g. stripping `data-ln-confirm` values that contain event-like substrings). Sanitizing user-submitted HTML is the server's job, done before the fragment is rendered. See [Security §5 — AJAX Fragment Trust Boundary](../../docs/architecture/security.md#5-ajax-fragment-trust-boundary).

### Error detail shape

`ln-ajax:error` carries one of two shapes depending on failure mode:

- **HTTP-status error** (response received, `!ok`): `{ method, url, status, data }` — `data` is the parsed body (may contain `message`).
- **Fetch rejection** (network / DNS / JSON parse): `{ method, url, error }` — the caught `Error`, no `status`/`data`.

A single `ln-ajax:error` listener must guard with `'status' in e.detail` before reading `status`, and `'error' in e.detail` before reading `error`. (`ln-api-connector`, the data-layer transport tier, emits a single unified error shape — `{ action, error, status, data }` — and is the pattern to prefer for new data-flow code.)
