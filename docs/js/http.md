# HTTP

Event-driven JSON fetch service with abort support. Global singleton — no `data-ln-*` attribute needed. File: `js/ln-http/ln-http.js`.

## Usage

Dispatch a `ln-http:request` event on any element. Response events fire back on the same element.

```js
el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: {
        url: '/api/users',
        method: 'GET',
        tag: 'load-users'
    }
}));

el.addEventListener('ln-http:success', function (e) {
    console.log(e.detail.data);
});
```

## Request Options

| Option | Type | Description |
|--------|------|-------------|
| `url` | string | Request URL (required) |
| `method` | string | HTTP method (default: POST if body, GET otherwise) |
| `body` | object | GET → query string, POST/PUT/DELETE → JSON body |
| `ajax` | boolean | If true, adds `X-Requested-With: XMLHttpRequest` header |
| `abort` | string | Abort key — cancels previous in-flight request with same key |
| `tag` | string | Passed back in response events for consumer filtering |

## Events

### Request

| Event | Bubbles | On | Description |
|-------|---------|-----|-------------|
| `ln-http:request` | yes | any element | Triggers a fetch request |

### Response (dispatched on the original target element)

| Event | Bubbles | `detail` |
|-------|---------|----------|
| `ln-http:success` | yes | `{ tag, ok, status, data }` |
| `ln-http:error` | yes | `{ tag, ok, status, data }` |

## Abort Support

Pass an `abort` key to cancel previous in-flight requests with the same key. Aborted requests are silently ignored (no error event).

```js
// Each new request cancels the previous one
el.dispatchEvent(new CustomEvent('ln-http:request', {
    bubbles: true,
    detail: { url: '/api/search?q=' + query, abort: 'search' }
}));
```

## Dependencies

None — standalone global service. Imported by other components (e.g., `ln-ajax`).
