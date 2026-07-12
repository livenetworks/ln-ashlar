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

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-ajax` | Container, `<a>`, `<form>` | Activates AJAX capture on the element and its descendants. |
| `data-ln-ajax="false"` | `<a>`, `<form>` | Excludes the specific link or form from AJAX interception. |

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
- **Respects `e.defaultPrevented`.** If a prior `submit` listener on the
  same form (e.g. a validation gate) already called `preventDefault()`,
  `ln-ajax` does nothing — no fetch, no loader class.
