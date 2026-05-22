# ln-ajax

Intercepts clicks on `<a>` and submits on `<form>` inside `data-ln-ajax`,
sends the request via `fetch`, and swaps DOM regions named in the JSON
response. Re-attaches handlers in any injected nodes.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-ajax` | container, `<a>`, or `<form>` | Activates AJAX on the element and all its children |
| `data-ln-ajax="false"` | `<a>` or `<form>` | Disables AJAX for a specific element inside an AJAX container |

## Behavior

### Links (`<a>`)
- Click makes a GET AJAX request to `href`
- Ctrl/Cmd+Click and middle-click work normally (open in new tab)
- Links with `#` in href are skipped
- Links to a different hostname are skipped (open as normal links)
- After a successful response, the URL is added to browser history (pushState)

### Forms (`<form>`)
- Submit makes an AJAX request (method and action from the form)
- FormData is automatically created from the form
- Buttons are disabled during the request
- GET forms: parameters go in URL query string + pushState
- POST/PUT/DELETE: body is FormData

### Loading state

During the request, `.ln-ajax--loading` is added to the trigger element and a `<span class="ln-ajax-spinner">` is appended as a child.

### Request headers

Every AJAX request sends:
- `X-Requested-With: XMLHttpRequest`
- `Accept: application/json`
- `X-CSRF-TOKEN: {token}` (from `<meta name="csrf-token">`)

## Server JSON Response Protocol

```json
{
    "title": "New page",
    "content": {
        "main-content": "<h1>Content</h1><p>New HTML</p>",
        "sidebar-nav": "<ul><li>New navigation</li></ul>"
    },
    "message": {
        "type": "success",
        "title": "Saved",
        "body": "Changes have been saved.",
        "data": {}
    }
}
```

| Field | Description |
|-------|-------------|
| `title` | Update `document.title` |
| `content` | Object: key = element ID, value = new innerHTML |
| `message` | If present (success OR error), auto-dispatched on `window` as `ln-toast:enqueue`. See [ln-toast README](../ln-toast/README.md#enqueue-detail) for the envelope shape. |

## Events

All events are dispatched on the element that initiated the request (link or form) and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-ajax:before-start` | yes | Before everything (can cancel request) | `{ method, url }` |
| `ln-ajax:start` | no | After adding spinner, before fetch | `{ method, url }` |
| `ln-ajax:success` | no | After successful response | `{ method, url, data }` |
| `ln-ajax:error` | no | HTTP-status error or fetch rejection | HTTP error: `{ method, url, status, data }` · Fetch rejection: `{ method, url, error }` |
| `ln-ajax:complete` | no | After completion (success or error) | `{ method, url }` |

### Cancelling a request

```javascript
// Prevent AJAX for a specific element conditionally
document.addEventListener('ln-ajax:before-start', function(e) {
    if (!userIsAuthenticated()) {
        e.preventDefault(); // request is cancelled, no spinner
        redirectToLogin();
    }
});
```

## HTML Structure

```html
<!-- AJAX container — all links and forms inside are AJAX -->
<div data-ln-ajax>
    <nav>
        <a href="/users">Users</a>
        <a href="/settings">Settings</a>
        <a href="/download.pdf" data-ln-ajax="false">Download (full page)</a>
    </nav>

    <form method="POST" action="/users/create">
        <input name="name" type="text">
        <button type="submit">Save</button>
    </form>
</div>

<!-- Or directly on an element -->
<a href="/dashboard" data-ln-ajax>Dashboard</a>
<form data-ln-ajax method="POST" action="/api/save">...</form>
```

## API

ln-ajax is attribute-driven: set `data-ln-ajax` on an element and the
MutationObserver picks it up. Removal is symmetric — drop the
attribute, the observer ignores it.

```javascript
// Manual init — only when the element is unreachable by the observer
// (detached DOM tree, Shadow DOM root, sandboxed iframe).
window.lnAjax(element);

// Manual destroy — remove all listeners attached by the constructor.
window.lnAjax.destroy(element);
```

## Integration & Development

### Integration

#### 1. In-Bundle (Standard Integration)
To use `ln-ajax` as part of the main `ln-ashlar` bundle, include the compiled IIFE in your document:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you wish to use `ln-ajax` standalone without the rest of the bundle, load its individual IIFE compiled script:
```html
<script src="js/ln-ajax/ln-ajax.js" defer></script>
```

### Source Files

For development, testing, and debugging, refer to the following local file paths:
- **Source of Truth (Active Development):** [js/ln-ajax/src/ln-ajax.js](file:///c:/laragon/www/ln-ashlar/js/ln-ajax/src/ln-ajax.js)
- **Compiled Standalone Build:** [js/ln-ajax/ln-ajax.js](file:///c:/laragon/www/ln-ashlar/js/ln-ajax/ln-ajax.js)

