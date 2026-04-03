# ln-toast

Toast notification component — displays temporary messages (success, error, warn, info).
Each toast has an icon, title, message and close button. Automatically disappears after timeout.

Builds toast DOM imperatively via `createElement`. Supports both server-side rendered toasts (hydrated on init via `data-ln-toast-item`) and programmatic enqueueing via JS API or `ln-toast:enqueue` event.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-toast` | container (`<ul>`) | Marks the container for toast messages |
| `data-ln-toast-timeout="6000"` | container | Default timeout in ms (default: 6000) |
| `data-ln-toast-max="5"` | container | Maximum number of visible toasts (default: 5) |
| `data-ln-toast-item` | `<li>` inside container | Server-side rendered toast (hydrated on init) |
| `data-type="success\|error\|warn\|info"` | `<li>` | Type of SSR toast |
| `data-title="..."` | `<li>` | Title of SSR toast (optional) |

## API

```javascript
// Add toast programmatically — returns numeric toast id
var id = lnToast.enqueue({
    type: 'success',           // success | error | warn | info
    title: 'Saved',            // optional, default by type
    message: 'Changes have been saved.',
    timeout: 6000,             // optional, 0 = doesn't disappear
    container: '#my-toasts'    // optional, default = first [data-ln-toast]
});

// List of messages
lnToast.enqueue({
    type: 'error',
    message: ['Error 1', 'Error 2']
});

// Laravel validation errors
lnToast.enqueue({
    type: 'error',
    data: { errors: { email: ['Email is required'], name: ['Name is required'] } }
});

// Clear all toasts
lnToast.clear();
lnToast.clear('#my-toasts');

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
lnToast(document.body);
```

## Events

| Event | On | Description |
|-------|-----|-------------|
| `ln-toast:enqueue` | `window` | Enqueue toast via CustomEvent (decoupled) |

```javascript
// Another component can send a toast without a direct reference
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', message: 'Done!' }
}));
```

## Types

| Type | Default title | Icon class |
|------|--------------|------------|
| `success` | Success | `#ln-circle-check` |
| `error` | Error | `#ln-circle-x` |
| `warn` | Warning | `ln-icon-warning` |
| `info` | Information | `ln-icon-info-circle` |

## HTML Structure

```html
<!-- Template (once per layout — fallback injected if missing) -->
<template data-ln-template="ln-toast-item">
    <li class="ln-toast__item">
        <div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">
            <div class="ln-toast__side"></div>
            <div class="ln-toast__content">
                <div class="ln-toast__head">
                    <strong class="ln-toast__title" data-ln-field="title"></strong>
                </div>
                <button type="button" class="ln-toast__close" aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg aria-label="Close"></button>
                <div class="ln-toast__body" data-ln-show="hasBody"></div>
            </div>
        </div>
    </li>
</template>

<!-- Container (usually in the layout, top right) -->
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5"></ul>

<!-- Server-side rendered toasts (Laravel flash) -->
<ul data-ln-toast>
    <li data-ln-toast-item data-type="success" data-title="Saved">
        Changes have been saved successfully.
    </li>
    <li data-ln-toast-item data-type="error">
        An error occurred while saving.
    </li>
</ul>
```

## Programmatic

```javascript
// From AJAX callback
fetch('/api/save', { method: 'POST', body: data })
    .then(res => res.json())
    .then(data => {
        lnToast.enqueue({ type: 'success', message: data.message });
    })
    .catch(() => {
        lnToast.enqueue({ type: 'error', message: 'Server error' });
    });
```
