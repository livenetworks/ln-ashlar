# Toast

Notification system with side accent and icons. File: `js/ln-toast/ln-toast.js`.

## HTML

```html
<!-- Container (once per page) -->
<div data-ln-toast></div>
```

## JS API

```js
// Basic toast
window.lnToast.enqueue({
    type: 'success',      // success | error | warn | info
    title: 'Title',
    message: 'Description'
});

// Error with list
window.lnToast.enqueue({
    type: 'error',
    title: 'Validation',
    message: ['Field required', 'Invalid email']
});

// Laravel validation errors
window.lnToast.enqueue({
    type: 'error',
    title: 'Error',
    data: { errors: { name: ['Required'], email: ['Invalid'] } }
});

// Custom timeout (ms, 0 = persistent)
window.lnToast.enqueue({ type: 'info', title: 'Info', timeout: 10000 });

// Clear all
window.lnToast.clear();
```

## Container Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-toast` | Container element |
| `data-ln-toast-timeout="6000"` | Default timeout (ms) |
| `data-ln-toast-max="5"` | Max visible toasts |

## Static Toast (SSR)

```html
<div data-ln-toast>
    <div data-ln-toast-item data-type="success" data-title="OK">
        Saved!
    </div>
</div>
```

## Decoupled Event

Components can trigger toasts without importing:
```js
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', title: 'OK', message: 'Done' }
}));
```
