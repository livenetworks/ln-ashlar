# ln-router

> A zero-dependency, template-driven, client-side SPA router that maps URLs to route templates and renders them declaratively.

---

## 1. Philosophy & The Primitive Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy router that handles data fetching, state management, and HTML sanitization, `ln-router` separates these concerns:

1. **The Route Mounter (JavaScript)**: The `ln-router` component only manages path matching, history states (`pushState`/`popstate`), accessibility focus shifting, and DOM swapping. It does not fetch data, sanitise markup, or touch database stores.
2. **The Declarative Layout (HTML)**: Route configurations and view templates live in HTML as `<template data-ln-route="...">` tags. The router never constructs HTML inside JS. It simply clones the templates into the designated outlet.
3. **Decoupled Data Binding (Coordinator)**: The coordinator listens to the `ln-router:navigated` event, retrieves params/query, fetches from a store or HTTP endpoint, and updates the mounted view using core helpers:
   - **`fillTemplate(clone, data)`**: Replaces inline `{{ placeholder }}` text-node variables in the cloned view. Since it operates strictly on text nodes (via `TreeWalker`), it is 100% safe from reflected XSS.
   - **`fill(el, data)`**: Performs attribute-driven binding (`data-ln-field` → `textContent`, `data-ln-attr` → `setAttribute`), which is also inherently secure.
   
> [!WARNING]
> **Reflected XSS Security**: The route coordinator is responsible for populating the view. When binding URL parameters (e.g., username in `/profile/:username`) or query parameters to the DOM, **never** use unsafe methods like `innerHTML` or `outerHTML`. Always use `fillTemplate`, `fill`, or set `textContent` directly to avoid reflected XSS injections. For more, see [Security Architecture](file:///c:/laragon/www/ln-ashlar/docs/architecture/security.md#safe-dom-interpolation).

---

## 2. Minimal Blueprint

Route templates and outlets are declared in HTML. Triggers are plain same-origin `<a>` tags.

```html
<!-- Default Outlet (where views render by default) -->
<main data-ln-outlet></main>

<!-- Route Templates (lives anywhere, commonly grouped near outlet) -->
<template data-ln-route="/">
    <article>
        <h1>Home</h1>
        <p>Welcome to Ashlar SPA.</p>
    </article>
</template>

<template data-ln-route="/users">
    <article>
        <h1>Users List</h1>
        <ul id="user-list"></ul>
    </article>
</template>

<!-- Parameter route -->
<template data-ln-route="/users/:id" data-ln-route-title="User Details">
    <article>
        <h1 id="user-name-title">Loading User...</h1>
    </article>
</template>

<!-- Catch-all fallback route -->
<template data-ln-route="*">
    <article>
        <h1>404 - Not Found</h1>
    </article>
</template>
```

---

## 3. The Declarative API & State Contract

There is no need to manually instantiate or initialize the router. Discovered `<template data-ln-route>` elements register themselves automatically.

```js
import { router } from '../ln-router';

// Programmatic navigation
router.navigate('/users/42?tab=profile');

// Programmatic replace state
router.replace('/dashboard');

// Read-only state query
const current = router.current();
// Returns:
// {
//   path: '/users/42?tab=profile',
//   params: { id: '42' },
//   query: { tab: 'profile' },
//   route: { 
//     pattern: '/users/:id', 
//     target: null, // The string ID of the custom target outlet, or null if using default
//     title: 'User Details', 
//     templateNode: HTMLTemplateElement 
//   }
// }
```

### Target Outlet Resolution Fallback
When a route matches, the router resolves the target DOM element to render into by checking the following hierarchy:
1. An explicit element ID specified by `data-ln-route-target="..."` on the `<template>`.
2. A default outlet element marked with the `data-ln-outlet` attribute.
3. The first `<main>` element found in the document.

If no matching target element can be resolved in the DOM, the router logs a `console.warn` and aborts navigation, leaving the current page state intact.

### Attributes
- `data-ln-route="pattern"`: Declares a route on a `<template>`. Supports static segments (`/users`), parameters (`/users/:id`), and wildcards (`*`).
- `data-ln-route-target="id"`: Sets an explicit element ID to render this route into (overrides the default outlet).
- `data-ln-route-title="text"`: Sets `document.title` on successful navigation.
- `data-ln-outlet`: Marks the default outlet element (falls back to the first `<main>` element if omitted).
- `data-ln-router-hydrate`: Placed on the outlet element to signal that initial SSR (Server-Side Rendered) content is already present, letting the router skip the initial clone and register events cleanly.

---

## 4. Transition Events

All events bubble from the target outlet element.

| Event | Cancelable | Detail | Dispatched When |
|---|---|---|---|
| **`ln-router:before-navigate`** | **Yes** | `{ from, to, params, query }` | After pattern matches, before view swap. Calling `event.preventDefault()` aborts navigation. |
| **`ln-router:navigated`** | No | `{ path, params, query, route, target }` | After the new view clone is mounted in the DOM. |
| **`ln-router:not-found`** | No | `{ path }` | When a path fails to match any route (and no `*` catch-all exists). DOM is left untouched. |

### Timing guarantee

The initial `ln-router:navigated` (on a matched route) and boot-path `ln-router:not-found` (on no match) dispatches are **deferred one microtask** via `queueMicrotask`. This ensures that listeners registered during the same `DOMContentLoaded` burst — i.e. in a `<script defer>` tag that appears after the router bundle — always receive the boot event. When the View Transitions API is available, the deferral is handled via the VT callback rather than literally `queueMicrotask`, but the guarantee is identical — listeners in a later `defer` script still receive the boot event.

All subsequent navigations (link clicks, `popstate`, programmatic `router.navigate()`/`router.replace()`) dispatch **synchronously**; no deferral applies once the boot phase is complete.

**Consumers no longer need a `current()` boot-replay block.** The pattern:

```js
// OBSOLETE — no longer needed
const booted = window.lnRouter && window.lnRouter.current();
if (booted && !navigatedFired) {
    mountRoute(booted);
}
```

can be replaced by simply attaching a `ln-router:navigated` listener — it will fire even if the router booted before the listener was added.

```js
// Example: Block navigation out of unsaved forms
document.addEventListener('ln-router:before-navigate', (e) => {
    if (hasUnsavedChanges && !confirm('Discard changes?')) {
        e.preventDefault(); // Cancels transition and keeps current view
    }
});
```

## 5. Accessibility & Screen Reader Continuity

`ln-router` shifts focus automatically on each successful navigation to ensure compatibility with assistive technologies (screen readers):
1. **Focus Shifting**: The router looks for the first heading element (`h1` through `h6`) in the newly mounted template. If found, it dynamically assigns `tabindex="-1"` and calls `.focus()` on it. If no heading element is present, focus is shifted to the outlet container itself.
2. **Title Updates**: When `data-ln-route-title` is defined, the router updates `document.title`, which is announced by screen readers upon focus shifting.
3. **Scroll Management**: The router automatically scrolls the target element into view via `.scrollIntoView({ block: 'start', behavior: 'instant' })` to reset the viewport for the new content.

---

## 6. Server Integration & Deep Links

Since `ln-router` operates client-side using history `pushState`, direct access or page refresh on a deep path (e.g., direct opening of `/users/42`) will bypass the client-side router and hit the web server directly. This results in a server 404 error if not configured correctly.

### 1. Server Catch-All Fallback
Your web server must serve the main shell entrypoint (e.g., `index.html` or main layout view) for all deep URLs, allowing the client-side router to boot and handle the path.

In **Laravel**, define a fallback route at the end of `routes/web.php`:
```php
Route::fallback(function () {
    return view('app'); // returns your main blade layout shell
});
```

In **Nginx**, configure the fallback in your site configuration:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

### 2. Relative Assets & `<base>` Tag
If your app references assets using relative paths, deep paths will attempt to load assets relative to the current route path (e.g., loading `/users/assets/app.js` instead of `/assets/app.js`). To prevent this:
- **Configure the base tag**: Add `<base href="/">` in the `<head>` of your main HTML shell.
- **Or use absolute asset paths**: Ensure script and link tags point to absolute URLs (e.g., `/dist/main.js` instead of `dist/main.js`).

---

## 7. Limitations & Nested Routing

> [!NOTE]
> **No Nested Routing**: `ln-router` supports a flat routing table only. There is no support for nested outlets or child routes (e.g. rendering a nested sub-view within an already routed parent view). All routes are defined flat in the template list and swapped into their designated target elements.

---

## 8. Integration Patterns

### Coordinator Data Binding (Secure Interpolation)
Coordinators listen to `ln-router:navigated`, fetch data, and populate the view. Use `fillTemplate` for safe `{{ placeholder }}` text-node substitutions:

```html
<template data-ln-route="/profile/:username">
    <section>
        <h1>Profile: {{username}}</h1>
    </section>
</template>
```

```js
import { fillTemplate } from '../ln-core';

document.addEventListener('ln-router:navigated', function (e) {
	if (e.detail.route.pattern !== '/profile/:username') return;

	const username = e.detail.params.username;
	// Populate read-only placeholders like {{username}} inside the outlet
	// fillTemplate walks text nodes and is completely safe from XSS.
	fillTemplate(e.detail.target, { username: username });
});
```

---

## 9. Integration & Source Files

`ln-ashlar` is a source-only package. Products should bundle it from source using their asset compilation pipelines (Vite, Laravel Mix, Webpack, etc.):

- **Vite / ES Modules**:
  ```js
  import '@livenetworks/ashlar/js/ln-router';
  ```
- **Git Submodule ESM import**:
  ```js
  import 'resources/ln-ashlar/js/ln-router/src/ln-router.js';
  ```
- **Development Demo**:
  The compiled build in `demo/dist/ln-ashlar.iife.js` exists solely for running the local repository demo environment and should not be referenced in production consumer applications.
