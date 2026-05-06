# ln-toast

Toast notification component — temporary status messages with side accent and icon. Auto-dismisses after a timeout.

The toast `<li>` is built from a `<template data-ln-template="ln-toast-item">` that the project must provide. The template lives in HTML — the library never injects markup beyond cloning it.

## HTML

### Template (required, once per page)

```html
<template data-ln-template="ln-toast-item">
    <li class="ln-toast__item">
        <div class="ln-toast__card" data-ln-attr="role:role, aria-live:ariaLive">
            <div class="ln-toast__side"></div>
            <div class="ln-toast__content">
                <div class="ln-toast__head">
                    <strong class="ln-toast__title" data-ln-field="title"></strong>
                </div>
                <button type="button" class="ln-toast__close" aria-label="Close">
                    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
                </button>
                <div class="ln-toast__body" data-ln-show="hasBody"></div>
            </div>
        </div>
    </li>
</template>
```

### Container

```html
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5"></ul>
```

### Server-rendered toasts (Laravel flash)

```html
<ul data-ln-toast>
    <li data-ln-toast-item data-type="success" data-title="Saved">
        Changes have been saved successfully.
    </li>
</ul>
```

## Container attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-toast` | Marks the container `<ul>` |
| `data-ln-toast-timeout="6000"` | Default auto-dismiss in ms (0 = persistent) |
| `data-ln-toast-max="5"` | Max simultaneous toasts (oldest evicted first) |

## SSR-toast attributes (on `<li>` inside container)

| Attribute | Description |
|-----------|-------------|
| `data-ln-toast-item` | Marks an SSR toast for hydration |
| `data-type="success\|error\|warn\|info"` | Toast type |
| `data-title="..."` | Optional title (default depends on type) |

## Events

| Event | Target | Direction | Description |
|-------|--------|-----------|-------------|
| `ln-toast:enqueue` | `window` | in | Show a toast. Detail = enqueue options |
| `ln-toast:clear` | `window` | in | Dismiss all toasts (or a specific container) |

### enqueue detail

| Field | Type | Description |
|-------|------|-------------|
| `type` | `success\|error\|warn\|info` | Toast type (defaults to `info`) |
| `title` | string | Optional, defaults by type |
| `message` | string \| string[] | Body content |
| `data.errors` | `{ [field]: string[] }` | Laravel-style field errors |
| `timeout` | number | ms; 0 = persistent; omitted = container default |
| `container` | string \| Element | Optional target container; defaults to first `[data-ln-toast]` |

### clear detail

| Field | Type | Description |
|-------|------|-------------|
| `container` | string \| Element | Optional; without it, all containers clear |

## Examples

```js
// Basic toast
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', title: 'Saved', message: 'Changes have been saved.' }
}));

// Validation errors (Laravel-style)
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: {
        type: 'error',
        title: 'Validation failed',
        data: { errors: { email: ['Email is required'], name: ['Name is too short'] } }
    }
}));

// Persistent toast (no auto-dismiss)
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'warn', message: 'Your session is about to expire.', timeout: 0 }
}));

// Clear all toasts
window.dispatchEvent(new CustomEvent('ln-toast:clear'));

// Clear a specific container
window.dispatchEvent(new CustomEvent('ln-toast:clear', {
    detail: { container: '#my-toasts' }
}));
```

## Project helper (optional)

If you fire toasts often, wrap the dispatch:

```js
function toast(detail) {
    window.dispatchEvent(new CustomEvent('ln-toast:enqueue', { detail }));
}
toast({ type: 'success', message: 'Saved' });
```

The wrapper lives in your project, not in the library.

## Types

| Type | Default title | `aria-live` | `role` |
|------|--------------|-------------|--------|
| `success` | Success | `polite` | `status` |
| `error` | Error | `assertive` | `alert` |
| `warn` | Warning | `polite` | `status` |
| `info` | Information | `polite` | `status` |
