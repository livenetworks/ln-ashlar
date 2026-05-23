# ln-toast

> Service-style non-blocking status notifications, managed reactively via window events.

---

## 1. Philosophy & The Toast Mindset

In `ln-ashlar`, the core design principle is **decoupling**. Toasts are a pure application-level service.

1. **Zero-Markup Dispatch (JavaScript)**: Components and pages never import toast files or call imperative layout methods directly. To show a notification, any script or controller simply dispatches an `ln-toast:enqueue` event to the global `window` object.
2. **Central Coordination (The Service)**: A single viewport container (`[data-ln-toast]`) listens for these window-level events, builds card elements dynamically from templates, coordinates automatic 6-second exit timers, pauses timers on mouse hover, and destroys elements after animations.
3. **Decoupled Styling (CSS)**: Visual alert chrome, slide-in animations, and side-accent status colors are handled in Vanilla CSS. The library ships mixins like `@include toast-container` and `@include toast-card` for styling.

---

## 2. Minimal Blueprint

To enable toasts, simply place a single container `<ul>` in your HTML layout (typically right before the closing `</body>` tag).

```html
<!-- The Central Toast Container -->
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5"></ul>
```

### Key Anatomy Rules
- **The Container (`data-ln-toast`)**: Creates the toast listener service.
- **Auto-Dismiss Timeout (`data-ln-toast-timeout="6000"`)**: Default dismissal duration in milliseconds. Use `0` for persistent notifications.
- **Max Stack size (`data-ln-toast-max="5"`)**: Evicts the oldest toast when the count exceeds the threshold.

---

## 3. The Window API Contract

Toasts are triggered exclusively by dispatching CustomEvents on the global `window` object. **The window event is the sole contract.**

```js
// Dispatch a success notification
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { 
        type: 'success', 
        title: 'Saved', 
        message: 'Changes have been saved successfully.' 
    }
}));
```

### Enqueue Event Options (`ln-toast:enqueue`)
Pass options inside the event's `detail` object:

| Field | Type | Description |
|---|---|---|
| `type` | `success\|error\|warn\|info` | Toast category. Drives accents, aria-live roles, and default titles. |
| `title` | string | Optional card title. |
| `message` | string \| string[] | Card body content. Pass an array of strings to render a bulleted validation error list. |
| `timeout` | number | Dismissal timeout in ms. Use `0` to make it persistent. |

### Clear Event (`ln-toast:clear`)
Dismiss all active toasts in the viewport:
```js
window.dispatchEvent(new CustomEvent('ln-toast:clear'));
```

---

## 4. Toast Types & Default Accessibility

ARIA roles and accessibility live-regions are injected automatically by the component depending on the category:

| Category | Default Title | `aria-live` | `role` |
|---|---|---|---|
| `success` | Success | `polite` | `status` |
| `error` | Error | `assertive` | `alert` |
| `warn` | Warning | `polite` | `status` |
| `info` | Information | `polite` | `status` |

---

## 5. Integration Patterns

### A. SSR-Rendered Flash Messages (Hydration)
For server-side frameworks (like Laravel, Rails, or ASP.NET), you can place initial toast cards inside the container. The component will hydrate and auto-dismiss them on load:
```html
<ul data-ln-toast>
    <li data-ln-toast-item data-type="success" data-title="Saved">
        Changes have been saved successfully.
    </li>
</ul>
```

### B. Bulleted Validation Error Maps
To display a list of form validation errors inside a single toast, pass an array of strings to `message`:
```js
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: {
        type: 'error',
        title: 'Validation Failed',
        message: ['Email is required.', 'Password is too short.']
    }
}));
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="js/ln-toast/ln-toast.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-toast/src/ln-toast.js](file:///c:/laragon/www/ln-ashlar/js/ln-toast/src/ln-toast.js).

---

## Related
- **[`ln-modal`](../ln-modal/README.md)** — Viewport-blocking focus-gated dialogs.
- **[`ln-confirm`](../ln-confirm/README.md)** — Lightweight inline action confirmations.
- **Architecture deep-dive** — [`docs/js/toast.md`](../../docs/js/toast.md).
