---
name: ln-ajax
classification: simple
status: stable
domain: frontend
summary: An HTML-over-the-wire network orchestration component that converts navigation links and form submissions into AJAX calls.
source: js/ln-ajax/src/ln-ajax.js
tags: [ajax, navigation, form, network]
---

# 🌐 ln-ajax

> **Classification:** 🟢 Simple component (Layer 1 - Dynamic Content & Network Engine)

---

## 1. Core Behavior & Responsibility

The `ln-ajax` component implements **HTML-over-the-wire** interactions. It intercepts standard link navigations and form submissions inside an observed container and converts them into AJAX requests, updating designated DOM regions dynamically. It is defined in [ln-ajax.js](../../js/ln-ajax/src/ln-ajax.js).

*   **Navigation Hijacking:** Intercepts click events on all child `<a>` links and submit events on all child `<form>` elements (unless exempted with `data-ln-ajax="false"`).
*   **Write Pipeline Precedence:** Form structures that carry the `data-ln-form-scope` write routing attribute are ignored by `ln-ajax` (the coordinator's write workflow handles them). `ln-ajax` prints a single `console.warn` notifying the developer of the override.
*   **HTML-over-the-wire Updates:** Upon receiving a successful JSON response, `ln-ajax` performs the following updates:
    *   `title`: Updates `document.title`.
    *   `content`: Iterates through a key-value map `{ "target-id": "HTML content" }`, finding each DOM node by ID and overwriting its `innerHTML`.
    *   `message`: Automatically dispatches `ln-toast:enqueue` to prompt notification popups.
*   **History Synchronization:** Updates the browser's URL address via `window.history.pushState` on successful GET actions or link navigations to preserve Back/Forward capability.
*   **Visual Loading States:** Disables form submission triggers during in-flight network requests, applies the `.ln-ajax--loading` class to the triggering element, and appends a temporary loader spinner (`.ln-ajax-spinner`).
*   **Security Integration:** Automatically appends CSRF tokens in headers (`X-CSRF-TOKEN`) and form parameters (`_token`) on non-idempotent actions.

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **No Client-side State Persistence:** Does not store data parameters offline (use [`ln-data-store`](./ln-data-store.md)).
> - **No Local Validation Gating:** Does not validate input criteria before submission (use [`ln-validate`](./ln-validate.md)).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup: Container Navigation

LInks inside the container are loaded via fetch, and targets are updated based on the server response structure.

```html
<!-- Container where all child link navigations are handled via AJAX -->
<div data-ln-ajax id="main-content">
    <nav>
        <a href="/dashboard/analytics">Analytics</a>
        <!-- This link navigates normally (no AJAX) -->
        <a href="/logout" data-ln-ajax="false">Logout</a>
    </nav>
    
    <div id="dynamic-panel">
        <!-- Content will be replaced dynamically here -->
    </div>
</div>
```

### Variant 1: AJAX Form Submit

Submits form data asynchronously and receives updating DOM fragments.

#### HTML Markup
```html
<form action="/api/posts/save" method="POST" data-ln-ajax>
    <input type="text" name="title" required />
    <button type="submit">Save Post</button>
</form>
```

### Variant 2: AJAX Container with Excluded Elements

Excludes specific nested elements (links/forms) from being intercepted inside an AJAX-enabled container by using `data-ln-ajax="false"`.

#### HTML Markup
```html
<!-- Container triggers AJAX routing for all descendants -->
<div data-ln-ajax id="app-container">
    <!-- These will use AJAX -->
    <a href="/dashboard">Dashboard</a>
    <form action="/update-settings" method="POST"> ... </form>

    <!-- Excluded: These will perform native browser navigation / submission -->
    <a href="/download-pdf" data-ln-ajax="false">Download PDF</a>
    <form action="/legacy-logout" method="POST" data-ln-ajax="false"> ... </form>
</div>
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-ajax` | Container/Form/Link | *none* (empty attribute) | — | Enables AJAX routing for the container and its descendants (or the specific form/link). Acts as a boolean flag. |
| `data-ln-ajax="false"` | Link/Form | `"false"` | — | **The only supported value.** Exempts/excludes the specific link or form from AJAX interception. |

> [!IMPORTANT]
> **Attribute Value Restriction:** The `data-ln-ajax` attribute operates as a presence-based trigger (like a boolean flag). 
> * **The only valid and supported value is `"false"`**, which is used to exclude/opt-out specific elements inside an AJAX-enabled container.
> * **Do not use custom values** (e.g., `data-ln-ajax="loginform"` or `data-ln-ajax="my-widget"`). The component does **not** accept, process, or assign behavior based on other string values. Using custom values will simply activate normal AJAX routing (acting the same as an empty attribute) but is a major anti-pattern that confuses both developers and AI agents.

### Events API

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-ajax:before-start` | Emits | Yes | Fires before sending the request. Calling `e.preventDefault()` cancels the fetch. | `{ method: String, url: String }` |
| `ln-ajax:start` | Emits | No | Fires when the request is sent and loading spinners are attached. | `{ method: String, url: String }` |
| `ln-ajax:success` | Emits | No | Fires upon receiving a successful response (HTTP 2xx). | `{ method: String, url: String, data: Object }` |
| `ln-ajax:error` | Emits | No | Fires when the request fails (network error or HTTP error codes). | `{ method: String, url: String, status: Number, data: Object }` |
| `ln-ajax:complete` | Emits | No | Fires after clean-up actions have completed. | `{ method: String, url: String }` |

*Notification Integration:* If the server response contains a `message` envelope (e.g. `{ "message": { "type": "success", "body": "Saved!" } }`), `ln-ajax` automatically dispatches the `ln-toast:enqueue` event to the `window` object.

---

## 4. CSS Styling & Behavioral Concept

Visual styling governs the disabled loading states and the injection spinner element.

```scss
.ln-ajax--loading {
    position: relative;
    pointer-events: none; // Prevent duplicate clicks
    opacity: 0.8;
}

.ln-ajax-spinner {
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: ln-ajax-spin 0.75s linear infinite;
    margin-left: 0.5rem;
    vertical-align: text-bottom;
}

@keyframes ln-ajax-spin {
    to { transform: rotate(360deg); }
}
```

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard

- **aria-live:** Since content is swapped dynamically inside target nodes without full-page reloads, target containers should carry `aria-live="polite"` so screen readers declare changes to visually impaired users.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Mismatched Server Response format:** The server must return a structured JSON response specifying target elements. If the server yields raw HTML directly instead of structured JSON, parsing fails.
>    *Expected JSON format:*
>    ```json
>    {
>      "title": "New Title",
>      "content": {
>        "dynamic-panel": "<p>Updated content</p>"
>      }
>    }
>    ```
> 2. **Neglecting Hash Anchors:** anchors navigating internally to page fragments (e.g., `<a href="#settings">`) should carry `data-ln-ajax="false"` to prevent unneeded routing scans.
> 3. **Form Scope Collision:** Do not combine `data-ln-ajax` and `data-ln-form-scope` on the same form. Form-scope targets are reserved for local-first coordinator routing and will bypass `ln-ajax`.

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant Link as a[data-ln-ajax]
    participant AjaxJS as ln-ajax JS
    participant Browser as Browser History
    participant Server as Backend API
    participant Target as DOM Target Container

    User->>Link: Click
    Link->>AjaxJS: Intercept click event
    AjaxJS->>Link: dispatch ln-ajax:before-start
    AjaxJS->>Link: dispatch ln-ajax:start
    AjaxJS->>Link: Add class .ln-ajax--loading & append spinner
    
    AjaxJS->>Server: Send fetch request (headers: XMLHttpRequest, Accept: json)
    Server-->>AjaxJS: Return JSON { title, content: { 'target-id': '...' } }
    
    alt HTTP Success (200)
        AjaxJS->>Target: innerHTML = new content
        AjaxJS->>Browser: history.pushState(url)
        AjaxJS->>Link: dispatch ln-ajax:success
    else HTTP Error (500/404)
        AjaxJS->>Link: dispatch ln-ajax:error
    end

    AjaxJS->>Link: Remove class .ln-ajax--loading & remove spinner
    AjaxJS->>Link: dispatch ln-ajax:complete
```

---

## 7. Related Components

- [`ln-toast`](./ln-toast.md) — Receives global `ln-toast:enqueue` notifications triggered by response messages.
- [`ln-router`](./ln-router.md) — Listens for history state shifts to keep UI routing synchronized.
- [`ln-form`](./ln-form.md) — Normal forms can be enriched with `ln-ajax` for async submissions. Forms utilizing `data-ln-form-scope` are managed by the [`ln-data-coordinator`](./ln-data-coordinator.md).
