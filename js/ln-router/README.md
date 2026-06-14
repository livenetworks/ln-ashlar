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

### Multi-Region Blueprint

```html
<!-- Primary outlet -->
<main data-ln-outlet></main>

<!-- Persistent sidebar — keeps state on param-only changes -->
<aside id="side" data-ln-route-keep></aside>

<!-- Primary region templates -->
<template data-ln-route="/users/:id">
    <article><h1>User {{id}}</h1></article>
</template>

<!-- Sidebar templates -->
<template data-ln-route="/users/:id" data-ln-route-target="side">
    <section>
        <h2>Sidebar: User {{id}}</h2>
        <input type="text" placeholder="Type something — survives param changes">
    </section>
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
//   params: { id: '42' },          // primary region params
//   query: { tab: 'profile' },
//   route: { 
//     pattern: '/users/:id', 
//     target: null, // The string ID of the custom target outlet, or null if using default
//     title: 'User Details', 
//     templateNode: HTMLTemplateElement 
//   },
//   regions: Map {                  // NEW — per-region snapshot
//     '__primary__' => { route: {...}, params: { id: '42' } },
//     'side'        => { route: {...}, params: { id: '42' } } | null
//   }
// }
```

### Target Outlet Resolution Fallback
When a route matches, the router resolves the target DOM element to render into by checking the following hierarchy:
1. An explicit element ID specified by `data-ln-route-target="..."` on the `<template>`.
2. A default outlet element marked with the `data-ln-outlet` attribute.
3. The first `<main>` element found in the document.

If the **primary** outlet cannot be resolved, the router logs a `console.warn` and aborts the navigation, leaving the current page state intact. If an **auxiliary** region's target element cannot be resolved, the router warns and skips only that region — the remaining regions still render.

### Attributes
- `data-ln-route="pattern"`: Declares a route on a `<template>`. Supports static segments (`/users`), parameters (`/users/:id`), and wildcards (`*`).
- `data-ln-route-target="id"`: Sets an explicit element ID to render this route into. Templates with no `data-ln-route-target` belong to the **primary region** (default outlet).
- `data-ln-route-title="text"`: Sets `document.title` on successful navigation (primary region only).
- `data-ln-outlet`: Marks the default outlet element (falls back to the first `<main>` element if omitted).
- `data-ln-router-hydrate`: Placed on the outlet element to signal that initial SSR (Server-Side Rendered) content is already present, letting the router skip the initial clone and register events cleanly.
- `data-ln-route-keep`: Placed on a **target element** (not a template). When present, the router skips teardown and DOM swap for that region if the matched template is the same as the one currently mounted — surviving param-only URL changes while preserving DOM state (inputs, scroll, open panels). When the matched template changes, teardown and swap proceed normally. Ignored on the primary outlet (the primary always re-renders).

---

## 4. Transition Events

All events bubble from the target outlet element.

| Event | Cancelable | Detail | Dispatched When |
|---|---|---|---|
| **`ln-router:before-navigate`** | **Yes** | `{ from, to, params, query }` | Fired **once per navigation** on the primary outlet before any region swap. `preventDefault()` aborts the entire navigation (no history update, no region swaps). |
| **`ln-router:navigated`** | No | `{ path, params, query, route, target, region }` | Fired **per region that actually swapped**. `region` is `'__primary__'` for the default outlet, or the target element's id string for auxiliary regions. All existing keys (`path, params, query, route, target`) remain present for backward compatibility. |
| **`ln-router:not-found`** | No | `{ path }` | When the primary region has no match (and no catch-all `*` exists). DOM is left untouched. Not fired on auxiliary-only pages. |

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

## 7. Routing Model — Parallel Regions, Not Nested Routes

> [!NOTE]
> **No Nested Routing**: `ln-router` does not support nested outlets or child routes (rendering a sub-view inside an already-routed parent). All routes are flat.

> [!NOTE]
> **Multi-region routing is PARALLEL (sibling), not nested.** When a single URL simultaneously paints a sidebar region and a main region, both regions are siblings at the page level — neither is a child of the other's outlet. The "No Nested Routing" doctrine applies: there is no concept of a parent route whose outlet contains another router outlet.

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

---

## 10. Multi-Region Routing

One URL can simultaneously paint multiple sibling regions. Each region independently maintains its own route table and matches the current URL.

### Declaring regions

Regions are ordinary DOM elements. Each is identified by an `id`. Route templates target a region via `data-ln-route-target="<id>"`. Templates with no `data-ln-route-target` belong to the **primary region** (the default outlet).

```html
<!-- Primary outlet (default region) -->
<main data-ln-outlet></main>

<!-- Auxiliary region: sidebar -->
<aside id="side" data-ln-route-keep></aside>

<!-- Primary templates -->
<template data-ln-route="/users/:id" data-ln-route-title="User Details">
    <article><h1>User {{id}}</h1></article>
</template>

<!-- Sidebar templates — same or different patterns -->
<template data-ln-route="/users/:id" data-ln-route-target="side">
    <section><h2>Sidebar for User {{id}}</h2></section>
</template>

<!-- Sidebar catch-all — shown on all other routes -->
<template data-ln-route="*" data-ln-route-target="side">
    <section><p>Select a user to see details.</p></section>
</template>
```

### The primary region

The primary region is the default outlet (`[data-ln-outlet]` or first `<main>`). It is authoritative for:
- The single cancelable `ln-router:before-navigate` event (fires once per navigation)
- `document.title` updates
- Focus shifting and scroll management
- `ln-router:not-found` (when the primary has no match)
- `router.current()` return value

`data-ln-route-keep` is ignored on the primary region: the primary always tears down and re-renders on every matched navigation.

> [!IMPORTANT]
> **Each region matches the URL independently.** A route targeting an
> auxiliary region (`data-ln-route-target="…"`) no longer competes with primary
> routes for a single "best match" — every region runs its own match. If you
> have a route like `/users/:id/logs` that targets only an auxiliary region,
> the primary region will independently try to match `/users/42/logs` against
> its own templates and fall back to its `*` catch-all (or fire `not-found`) if
> it has no template for that path. Author a primary template for such paths if
> you want the main outlet to show meaningful content alongside the auxiliary
> region. This is a deliberate consequence of the parallel-regions model.

### `data-ln-route-keep` — persistent regions

Add `data-ln-route-keep` to any target element to make it a **keep region**.

```html
<aside id="side" data-ln-route-keep></aside>
```

Keep-region logic:
- **Same template matches again** (e.g. param-only change `/users/42` → `/users/43`): the region is left completely untouched. No teardown, no DOM swap, no `ln-router:navigated` event. Input values, scroll position, and open panels survive.
- **Different template matches** (e.g. navigating to a route that has a different sidebar template): normal teardown + DOM swap + `ln-router:navigated` event.
- **No match for this URL**: the region is left as-is (untouched content persists). To clear a keep region on certain routes, declare an explicit empty `<template>` for those patterns.

Keep is a property of the **region target element**, not of the template.

### `navigated` event — per swapped region

`ln-router:navigated` fires once per region that actually swapped. The `region` key identifies which region fired:

```js
document.addEventListener('ln-router:navigated', function (e) {
    const { path, params, query, route, target, region } = e.detail;

    if (region === '__primary__') {
        // Primary outlet navigated
    } else if (region === 'side') {
        // Sidebar region swapped
    }
});
```

The `region` value is `'__primary__'` for the default outlet, or the target element's `id` string for auxiliary regions.

**Backward compatibility:** all existing keys (`path, params, query, route, target`) remain in the event detail unchanged. Single-outlet pages continue to receive one `navigated` event with the same payload they always have.

### `router.current()` — multi-region state

```js
const state = router.current();
// {
//   path: '/users/42',
//   params: { id: '42' },       // primary region params
//   query: {},
//   route: { ... },             // primary region matched route
//   regions: Map {
//     '__primary__' => { route: {...}, params: { id: '42' } },
//     'side'        => { route: {...}, params: { id: '42' } },
//   }
// }
```

### Atomicity

All region swaps for a single navigation are wrapped in a single `document.startViewTransition` call. History push/replace happens once. `before-navigate` fires once.
