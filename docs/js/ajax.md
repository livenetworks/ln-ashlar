# AJAX

SPA-like navigation for links and forms. File: `js/ln-ajax/ln-ajax.js`.

## HTML

```html
<div data-ln-ajax>
    <a href="/users">Users</a>
    <a href="/settings">Settings</a>

    <form method="POST" action="/users">
        <input name="name">
        <button type="submit">Save</button>
    </form>

    <!-- Exclude from AJAX -->
    <a href="/download.pdf" data-ln-ajax="false">Download</a>
</div>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-ajax` | Container — all links and forms inside are AJAX |
| `data-ln-ajax="false"` | Exclude specific element |

## Expected JSON Response

```json
{
    "title": "Page Title",
    "content": {
        "main": "<p>HTML content</p>",
        "sidebar": "<nav>...</nav>"
    },
    "message": {
        "type": "success",
        "title": "Saved",
        "body": "Record updated"
    }
}
```

- `title` -- Updates `document.title`
- `content` -- Keys map to element IDs, values replace `innerHTML`
- `message` -- Dispatched to `lnToast.enqueue()`

## Behavior

- CSRF token from `<meta name="csrf-token">`
- `X-Requested-With: XMLHttpRequest` header
- GET forms append data as query params
- Links and GET forms push to `history.pushState`
- Ctrl/Cmd+click and middle-click open normally (not intercepted)
- `.ln-ajax--loading` class added during request
- Buttons disabled during form submission
