# ln-http

Event-driven fetch service — lightweight JSON transport layer for coordinators and components.
Global listener on `document`, no DOM instances, no MutationObserver.

## How It Works

1. Consumer dispatches `ln-http:request` on any DOM element
2. ln-http makes the fetch request
3. ln-http dispatches `ln-http:success` or `ln-http:error` back on the **same element**
4. Consumer filters responses by `tag`

## Request Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | string | *required* | Request URL |
| `method` | string | `POST` if body, `GET` otherwise | HTTP method |
| `body` | object | — | GET: query string, POST/PUT/DELETE: JSON body |
| `ajax` | boolean | `false` | Adds `X-Requested-With: XMLHttpRequest` header |
| `abort` | string | — | Abort key: cancels previous in-flight request with same key |
| `tag` | string | — | Passed back in response events for consumer filtering |

## Response Events

| Event | Dispatched on | Detail |
|-------|---------------|--------|
| `ln-http:success` | original target element | `{ tag, ok: true, status, data }` |
| `ln-http:error` | original target element | `{ tag, ok: false, status, data }` |

On network failure: `{ tag, ok: false, status: 0, data: { error: true, message: 'Network error' } }`
On invalid JSON: `{ tag, ok: false, status, data: { error: true, message: 'Invalid response' } }`

## Usage

### Basic GET

```javascript
const el = document.getElementById('user-list');

el.addEventListener('ln-http:success', function (e) {
    if (e.detail.tag !== 'load-users') return;
    renderUsers(e.detail.data);
});

el.addEventListener('ln-http:error', function (e) {
    if (e.detail.tag !== 'load-users') return;
    showError(e.detail.data.message);
});

el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: { url: '/api/users', tag: 'load-users' }
}));
```

### POST with JSON Body

```javascript
el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: {
        url: '/api/users',
        method: 'POST',
        body: { name: 'John', email: 'john@example.com' },
        tag: 'create-user'
    }
}));
```

### Search with Abort

Typing in a search field — each keystroke cancels the previous in-flight request:

```javascript
input.addEventListener('input', function () {
    el.dispatchEvent(new CustomEvent('ln-http:request', {
        bubbles: true,
        detail: {
            url: '/api/search',
            body: { q: input.value },
            abort: 'user-search',
            tag: 'search'
        }
    }));
});
```

### DELETE with CSRF Token

CSRF is the coordinator's responsibility — include it in the body:

```javascript
var token = document.querySelector('meta[name="csrf-token"]').content;

el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: {
        url: '/api/users/' + id,
        method: 'DELETE',
        body: { _token: token },
        tag: 'delete-user'
    }
}));
```

### With ln-toast Integration (Coordinator Pattern)

```javascript
el.addEventListener('ln-http:success', function (e) {
    if (e.detail.tag !== 'save') return;
    if (window.lnToast) {
        lnToast.enqueue({ type: 'success', message: e.detail.data.message });
    }
});

el.addEventListener('ln-http:error', function (e) {
    if (e.detail.tag !== 'save') return;
    if (window.lnToast) {
        lnToast.enqueue({ type: 'error', message: e.detail.data.message || 'Request failed' });
    }
});
```

## ln-http vs ln-ajax

| | ln-http | ln-ajax |
|---|---------|---------|
| Purpose | JSON API transport | Page navigation |
| Format | JSON only | FormData + HTML |
| DOM | No instances | `data-ln-ajax` on elements |
| Features | Abort, tag | CSRF, toast, history, spinner, HTML replace |
| Consumer | Coordinators, components | Links, forms |
