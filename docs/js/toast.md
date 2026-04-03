# Toast

Notification system with side accent and icons. File: `js/ln-toast/ln-toast.js`.

## HTML

```html
<!-- Template (once per layout) -->
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

<!-- Container (once per page) -->
<div data-ln-toast></div>
```

If the template is missing, the component injects a fallback into `document.body` and logs a warning. The preferred path is to include `<template data-ln-template="ln-toast-item">` in the shared layout.

## JS API

```js
// Basic toast — returns numeric id
var id = window.lnToast.enqueue({
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

SSR items are parsed into reactive state on init, then replaced with template-based elements.

## Decoupled Event

Components can trigger toasts without importing:
```js
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', title: 'OK', message: 'Done' }
}));
```

## Icons

Icons use the ln-acme icon system (`ln-icon-*` classes with `mask-image` + `currentColor`). No inline SVGs in JS.

| Type | Icon class |
|------|-----------|
| `success` | `#ln-circle-check` |
| `error` | `#ln-circle-x` |
| `warn` | `ln-icon-warning` |
| `info` | `ln-icon-info-circle` |

The sidebar background color is set via `--ln-toast-accent` CSS variable per type. Icon color inherits white via `currentColor`.

## Internal Architecture

### State

Each `_Component` instance (one per `[data-ln-toast]` container) holds:

```
state = deepReactive({ toasts: [] })
```

Each toast object in the array:

| Property | Type | Description |
|----------|------|-------------|
| `id` | number | Unique auto-increment key (module-level `_nextId`) |
| `type` | string | `success`, `error`, `warn`, `info` |
| `title` | string | Display title (defaults by type if omitted) |
| `message` | string, array, or null | Body text — string for paragraph, array for `<ul>` list |
| `data` | object or null | Optional `{ errors: { field: [msgs] } }` for Laravel validation |
| `dismissing` | boolean | `true` during exit animation (200ms), then spliced from array |

Timers live in a separate `_timers` map (`{ [id]: timeoutId }`) outside reactive state — timer handles are not renderable data.

### Render Cycle

1. `enqueue()` or SSR hydration pushes a toast object to `state.toasts`
2. `deepReactive` Proxy detects the mutation and calls `onChange`
3. `createBatcher` defers the render to a `queueMicrotask` — multiple rapid pushes coalesce into one render
4. `_render()` executes:
   - Enforces `max` by dismissing oldest non-dismissing toasts
   - Diffs DOM children against state by `data-ln-key`
   - Creates new elements via `cloneTemplate` + `fill` + icon class + body content
   - Applies `--out` class to elements whose toast has `dismissing: true`
   - Removes orphaned DOM children (already spliced from state)
5. `_afterRender()` dispatches any pending events via `dispatch()`
6. New elements get `ln-toast__item--in` class via `requestAnimationFrame` (entrance transition)

### Two-Phase Dismiss

Dismiss is split into two phases to preserve CSS exit animation:

1. **Phase 1**: `_dismiss(id)` sets `toast.dismissing = true` → triggers batcher → `_render()` swaps `--in` for `--out` class
2. **Phase 2**: `setTimeout(200ms)` → splices toast from `state.toasts` → triggers batcher → `_render()` removes the now-orphaned DOM element

This ensures the 200ms CSS `--out` transition completes before the node is removed.

### Template

The component uses `cloneTemplate('ln-toast-item', 'ln-toast')` from ln-core to clone `<template data-ln-template="ln-toast-item">`. This template should be in the page HTML (shared layout).

If the template is not found at init, the component injects a fallback into `document.body` and logs:
```
[ln-toast] Template "ln-toast-item" not found — injected fallback.
Add <template data-ln-template="ln-toast-item"> to your layout for best practice.
```

`fill()` handles declarative bindings: `data-ln-field="title"`, `data-ln-attr="role:role, aria-live:ariaLive"`, `data-ln-show="hasBody"`. Type class, icon class, and body content are set manually in `_createToastEl()`.

### Why Not renderList

`renderList()` calls `container.textContent = ''` on every render, which detaches and reattaches all children. This would interfere with CSS enter/exit transitions. Toast rendering is incremental (add one, remove one) — the custom diff by `data-ln-key` is simpler and preserves animation state.
