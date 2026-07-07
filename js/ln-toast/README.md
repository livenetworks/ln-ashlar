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
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5" aria-live="polite" aria-atomic="false"></ul>
```

### Key Anatomy Rules
- **The Container (`data-ln-toast`)**: Creates the toast listener service.
- **Auto-Dismiss Timeout (`data-ln-toast-timeout="6000"`)**: Default dismissal duration in milliseconds. Use `0` for persistent notifications.
- **Max Stack size (`data-ln-toast-max="5"`)**: Evicts the oldest toast when the count exceeds the threshold.
- **ARIA (`aria-live`/`aria-atomic`)**: authored once on the container — the live region announces every appended/hydrated toast. Individual toast items never carry `role` or `aria-live`.

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
| `type` | `success\|error\|warn\|info` | Toast category. Becomes the `<li>` class verbatim (`success`/`error`/`warn`/`info`); unrecognized or absent values render with no icon and neutral tone (documented degradation, not an error). |
| `title` | string | Optional card title. |
| `message` | string \| string[] | Card body content. Pass an array of strings to render a bulleted validation error list. |
| `timeout` | number | Dismissal timeout in ms. Use `0` to make it persistent. |

### Clear Event (`ln-toast:clear`)
Dismiss all active toasts in the viewport:
```js
window.dispatchEvent(new CustomEvent('ln-toast:clear'));
```

---

## 4. Toast Types & Tone

`type` drives CSS tone and icon selection only — nothing else. Recognized
values: `success`, `error`, `warn`, `info`. Each becomes the class on the
toast `<li>` (the card itself — no nested wrapper): the SSR path authors
`class="success"`, the dynamic path fills it via `data-ln-attr="class:type"`.
The SCSS maps the type class → color family (`.warn` → the `warning` family)
and shows the matching icon from the authored 4-icon list. An unrecognized or
omitted `type` renders with no icon and neutral tone — no JS whitelist.

There are no default titles. If `title` is omitted, the title element stays
empty and collapses (`:empty`) — the same rule applies to `message`.

---

## 5. Integration Patterns

### A. SSR-Rendered Flash Messages (Hydration)
For server-side frameworks (like Laravel, Rails, or ASP.NET), the server authors the full toast markup — icon, title, body, and close button are real HTML written by the backend template. `ln-toast` only binds behavior on load: it wires the close button and starts the auto-dismiss timer. There is no template clone and no DOM replacement — the authored `<li>` is never touched, only queried:
```html
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5" aria-live="polite" aria-atomic="false">
	<li data-ln-toast-item class="success">
		<div class="icon">
			<svg class="ln-icon" aria-hidden="true"><use href="#ln-circle-check"></use></svg>
		</div>
		<section class="content">
			<header>
				<strong class="title">Saved</strong>
				<button type="button" data-ln-toast-close aria-label="Close"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>
			</header>
			<main class="body"><p>Changes have been saved successfully.</p></main>
		</section>
	</li>
</ul>
```
An optional per-item `data-ln-toast-timeout` overrides the container's default timeout (`0` = persistent — e.g. a blocking error the user must dismiss manually).

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

### C. The Dynamic Template Is Authored Markup
The `ln-toast:enqueue` path renders from a `<template data-ln-template="ln-toast-item">`
that the page provides. `ln-toast` ships no hidden runtime default — the
library never generates or injects this markup. Nest the `<template>` inside
your `[data-ln-toast]` container for scoped lookup (`cloneTemplateScoped`
resolves container-local templates first — the recommended placement), or
place it anywhere else in the document body for a global fallback. Copy
[`js/ln-toast/template.html`](template.html) as your starting point — it is a
developer example to adapt, not a runtime artifact. Binding contract: the
root `<li>` carries `data-ln-toast-item` (eviction, clear, and hydration
address items by it; the JS stamps it defensively if omitted) plus
`data-ln-attr="class:type"` and NO static class (fill
sets the class via setAttribute, which would clobber an authored one);
`data-ln-field="title"` / `data-ln-field="message"` for text; a
`data-ln-toast-when="{type}"` icon list if you want per-type icons. A missing
template fails loudly — `console.warn('[ln-toast] Template "ln-toast-item"
not found')` at clone time, no silent fallback.

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
