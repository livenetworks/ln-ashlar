# Toast

Notification system with side accent and icons. File: `js/ln-toast/ln-toast.js`.

## HTML

```html
<!-- Container (once per layout) -->
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

Toasts are built imperatively via `createElement` — no `<template>` element needed.

## Container Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-toast` | Container element (`<ul>`) |
| `data-ln-toast-timeout="6000"` | Default timeout in ms (0 = persistent) |
| `data-ln-toast-max="5"` | Max visible toasts |

## JS API

```js
// Enqueue toast — returns the <li> element
var li = window.lnToast.enqueue({
    type: 'success',           // success | error | warn | info
    title: 'Saved',            // optional, defaults by type
    message: 'Changes saved',  // string or array of strings
    timeout: 6000,             // optional, 0 = persistent
    container: '#my-toasts'    // optional, default = first [data-ln-toast]
});

// Laravel validation errors
window.lnToast.enqueue({
    type: 'error',
    data: { errors: { email: ['Required'], name: ['Too short'] } }
});

// Clear all toasts from container
window.lnToast.clear();
window.lnToast.clear('#my-toasts');

// Decoupled event (no direct reference needed)
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', message: 'Done!' }
}));
```

## Icons

Icons are hardcoded inline SVGs per type (not loaded via the icon loader):

| Type | Default title | Color |
|------|--------------|-------|
| `success` | Success | Green (`--color-success`) |
| `error` | Error | Red (`--color-error`) |
| `warn` | Warning | Amber (`--color-warn`) |
| `info` | Information | Blue (`--color-info`) |

---

## Internal Architecture

### State

One `_Component` instance per `[data-ln-toast]` container. No reactive proxy — DOM is manipulated directly via `createElement`.

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The `<ul>` container |
| `timeoutDefault` | number | From `data-ln-toast-timeout` (default 6000) |
| `max` | number | From `data-ln-toast-max` (default 5) |

### Enqueue Flow

`enqueue(opts)`:

1. Resolve container: explicit `opts.container` → first `[data-ln-toast]` in document
2. Get or create `_Component` for the container
3. Build `<li>` with `_buildCard()`:
   - Creates `.ln-toast__card--{type}`, sets `role`/`aria-live`
   - Inserts inline SVG icon from `ICONS` map into `.ln-toast__side`
   - Creates `.ln-toast__head` with title `<strong>` and close `<button>`
   - If `opts.message` (string → `<p>`, array → `<ul>`) or `opts.data.errors` → appends `.ln-toast__body`
4. Enforce max: while `container.children.length >= max` → `removeChild(firstElementChild)`
5. `appendChild(li)` + `requestAnimationFrame(() => li.classList.add('ln-toast__item--in'))`
6. If `timeout > 0`: `setTimeout(_dismiss, timeout)`
7. Return `li` element

### SSR Hydration

On `_Component` construction, all `[data-ln-toast-item]` children are processed by `_hydrateLI(li)`:
reads `data-type` and `data-title` attributes + `textContent` → calls `_buildCard()` → replaces `li.innerHTML` with the built card → triggers entrance animation.

### Dismiss Flow

`_dismiss(li)`:
1. `clearTimeout(li._timer)` — cancel auto-dismiss if active
2. Remove `ln-toast__item--in`, add `ln-toast__item--out` → CSS exit transition (200ms)
3. `setTimeout(200ms)` → `parentNode.removeChild(li)` (if still attached)

### Close Button

Built in `_buildCard()` via `createElement`. Icon: `<svg><use href="#ln-x">` (loaded via icon loader). Click calls `_dismiss(li)`.

### `window.ln-toast:enqueue` Event

The component listens on `window` for `ln-toast:enqueue` CustomEvent — `e.detail` is passed directly to `enqueue()`. Allows decoupled toasts from any component without a direct reference.

### `destroy()`

Dismisses all current toast items (triggers exit animation) and removes the instance reference from the container element.

### MutationObserver

Global observer on `document.body` — `childList` (subtree) + `attributes` (`data-ln-toast`). Auto-initializes new containers.
