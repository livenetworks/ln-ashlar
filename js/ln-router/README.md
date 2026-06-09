# ln-router

> A zero-dependency, template-driven, client-side SPA router that maps URLs to route templates and renders them declaratively.

---

## 1. Philosophy & The Primitive Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating a heavy router that handles data fetching, state management, and HTML sanitization, `ln-router` separates these concerns:

1. **The Route Mounter (JavaScript)**: The `ln-router` component only manages path matching, history states (`pushState`/`popstate`), accessibility focus shifting, and DOM swapping. It does not fetch data, sanitise markup, or touch database stores.
2. **The Declarative Layout (HTML)**: Route configurations and view templates live in HTML as `<template data-ln-route="...">` tags. The router never constructs HTML inside JS. It simply clones the templates into the designated outlet.
3. **Decoupled Data Binding (Coordinator)**: The coordinator listens to the `ln-router:navigated` event, retrieves params/query, fetches from a store or HTTP endpoint, and updates the mounted view using core helpers (`fillTemplate` or `fill`).

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
//   route: { pattern: '/users/:id', target: null, title: 'User Details', ... }
// }
```

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

```js
// Example: Block navigation out of unsaved forms
document.addEventListener('ln-router:before-navigate', (e) => {
    if (hasUnsavedChanges && !confirm('Discard changes?')) {
        e.preventDefault(); // Cancels transition and keeps current view
    }
});
```

---

## 5. Integration Patterns

### Coordinator Data Binding
Coordinators listen to `ln-router:navigated`, fetch data, and populate the view. Use `fillTemplate` for static display variables:

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
	fillTemplate(e.detail.target, { username: username });
});
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [js/ln-router/src/ln-router.js](file:///c:/laragon/www/ln-ashlar/js/ln-router/src/ln-router.js).
