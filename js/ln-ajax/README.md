# ln-ajax

AJAX navigation component — links and forms are sent asynchronously, the response updates the DOM without a full page reload.
Supports browser history (pushState), CSRF token, and JSON response protocol.

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
- After a successful response, the URL is added to browser history (pushState)

### Forms (`<form>`)
- Submit makes an AJAX request (method and action from the form)
- FormData is automatically created from the form
- Buttons are disabled during the request
- GET forms: parameters go in URL query string + pushState
- POST/PUT/DELETE: body is FormData

### CSS class for loading
- `.ln-ajax--loading` is added to the element during the request

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
| `message` | Message — available in `ln-ajax:success` event, the project decides how to display it |

## Events

All events are dispatched on the element that initiated the request (link or form) and bubble up.

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-ajax:before-start` | yes | Before everything (can cancel request) | `{ method, url }` |
| `ln-ajax:start` | no | After adding spinner, before fetch | `{ method, url }` |
| `ln-ajax:success` | no | After successful response | `{ method, url, data }` |
| `ln-ajax:error` | no | After fetch error | `{ method, url, error }` |
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

### Integration with ln-toast

`ln-ajax` doesn't know about `ln-toast`. To display messages, listen to `ln-ajax:success` in your project:

```javascript
document.addEventListener('ln-ajax:success', function(e) {
    const message = e.detail.data.message;
    if (message && window.lnToast) {
        window.lnToast.enqueue({
            type: message.type,
            title: message.title,
            message: message.body,
            data: message.data
        });
    }
});
```

### Other examples

```javascript
// Show custom loading indicator
document.addEventListener('ln-ajax:start', function(e) {
    console.log('Request started:', e.detail.method, e.detail.url);
});

// Refresh component after successful response
document.addEventListener('ln-ajax:success', function(e) {
    window.lnSelect && window.lnSelect.reinit();
});

// Global error handler
document.addEventListener('ln-ajax:error', function(e) {
    console.error('AJAX failed:', e.detail.url, e.detail.error);
});

// Completion (always)
document.addEventListener('ln-ajax:complete', function(e) {
    console.log('Request complete:', e.detail.url);
});
```

## Headers

Every AJAX request sends:
- `X-Requested-With: XMLHttpRequest`
- `Accept: application/json`
- `X-CSRF-TOKEN: {token}` (from `<meta name="csrf-token">`)

## HTML Structure

```html
<!-- AJAX container — all links and forms inside are AJAX -->
<div data-ln-ajax>
    <nav>
        <a href="/users">Users</a>
        <a href="/settings">Settings</a>
        <a href="/external" data-ln-ajax="false">External (no AJAX)</a>
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

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnAjax(document.getElementById('new-content'));
```
