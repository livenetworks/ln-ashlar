# ln-toast

Toast notification component — temporary status messages with side
accent and icon. Auto-dismisses after a timeout.

The library ships a default item template and injects it into the
DOM on init. Drop a `<ul data-ln-toast>` somewhere in your page and
toasts work — no template setup required.

**Bundler caveat:** the default template is loaded via a `?raw` import
(`./template.html?raw`). This resolves at build time under Vite
(and Webpack with `raw-loader`, esbuild with a raw plugin). Source
consumers without `?raw` support must manually inline a
`<template data-ln-template="ln-toast-item">` in their HTML to
override the auto-injection path.

## HTML

### Container (required)

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

### Override the item template (optional)

To customize the toast layout, place a
`<template data-ln-template="ln-toast-item">` anywhere in the page
**before** the first toast fires. The library detects it on init and
skips its built-in default. Lookup order matches the rest of the
library's templating: per-container scoped first, then
document-global.

```html
<!-- Document-global override — applies to every [data-ln-toast] -->
<template data-ln-template="ln-toast-item">
    <li class="ln-toast__item">
        <!-- your custom layout here; required slots listed below -->
    </li>
</template>

<ul data-ln-toast></ul>
```

#### Required slots

Your override MUST keep these elements/attributes — the component
reads them when filling the toast:

| Element | Attribute | Purpose |
|---------|-----------|---------|
| `.ln-toast__card` root | `data-ln-attr="role:role, aria-live:ariaLive"` | a11y attrs filled per toast type |
| Title element | `data-ln-field="title"` | toast title text |
| Body element | `data-ln-show="hasBody"` | hidden when no message/errors |
| `.ln-toast__side > svg > use` | (no attribute) | `href` is set per toast type to `#ln-{icon}` |
| `.ln-toast__close` | (any element) | click handler is bound to dismiss |

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
