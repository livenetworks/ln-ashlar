---
name: ln-nav
classification: simple
status: stable
domain: frontend
summary: Dynamically highlights active navigation links matching current URL location pathname with SPA history patch and ARIA aria-current attributes.
source: js/ln-nav/src/ln-nav.js
tags: [navigation, routing, active-state, accessibility]
---

# 🧭 ln-nav

> **Classification:** 🟢 Simple component / UI Navigation (Layer 1 - UI Navigation)

---

## 1. Core Behavior & Responsibility

The `ln-nav` component automatically evaluates and highlights active links within navigation menus based on the browser's current `window.location.pathname`. It is located in [`js/ln-nav/src/ln-nav.js`](../../js/ln-nav/src/ln-nav.js).

*   **Active Route Highlight:** Queries all child `<a>` elements within host container `[data-ln-nav]`, compares link `href` targets against `window.location.pathname`, and applies the configured active CSS class and `aria-current="page"`.
*   **SPA Navigation Detection (History Patching):** Listens to `popstate` events and monkey-patches `history.pushState` to re-evaluate active links during client-side SPA route transitions (e.g. via [`ln-router`](./ln-router.md)).
*   **Dynamic DOM Observation:** Manages a `MutationObserver` watching host child nodes for dynamically added/removed links (e.g. asynchronously loaded submenus or templates).
*   **Attribute Bridge Pattern:** Reacts to changes on `data-ln-nav` (active class name) or `data-ln-nav-exact` (exact matching flag) in real time.

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **Does NOT handle routing or page fetching:** Intercepting link clicks for page loading or URL mutations is owned by [`ln-router`](./ln-router.md).
> - **Does NOT provide hardcoded CSS visual styles:** Visual styling is owned strictly by CSS rules targeting the applied active class.
> - **Does NOT persist state:** Navigation state is strictly derived from `window.location.pathname`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Prefix Parent Matching)

Highlights links matching current path or parent paths (e.g., when visiting `/posts/123`, link `/posts` receives active class):

```html
<nav data-ln-nav="is-active" id="main-navigation">
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/posts">Posts</a></li>
        <li><a href="/about">About Us</a></li>
    </ul>
</nav>
```

### Variant 1: Exact URL Path Matching (`data-ln-nav-exact`)

Disables parent prefix matching. Links are highlighted only if their `href` strictly equals `window.location.pathname`:

```html
<nav data-ln-nav="active-tab" data-ln-nav-exact id="settings-tabs">
    <a href="/settings">General</a>
    <a href="/settings/security">Security</a>
</nav>
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Target Element | Type | Default | Description |
|---|---|---|---|---|
| `data-ln-nav` | Host (`<nav>`, `<div>`) | String | `"active"` | Initializes component on container and defines the active CSS class name (e.g. `is-active`, `active`). |
| `data-ln-nav-exact` | Host (`<nav>`, `<div>`) | Flag | `false` | When present, disables parent prefix matching and requires exact path equality. |

### Events API

| Event | Direction | Cancelable | Payload `detail` | Description |
|---|---|---|---|---|
| `ln-nav:before-update` | Emits | Yes | `{ target: HTMLElement }` | Dispatched before evaluating and updating active link states. Cancelable. |
| `ln-nav:update` | Emits | No | `{ target: HTMLElement }` | Dispatched after link active classes and `aria-current` attributes are applied. |
| `ln-nav:destroyed` | Emits | No | `{ target: HTMLElement }` | Dispatched when `destroy()` is called on the component instance. |

---

## 4. CSS Styling & Behavioral Concept

Visual styling targets the dynamic class configured via `data-ln-nav="is-active"`:

```scss
// SCSS visual layer implementation
nav[data-ln-nav] {
    display: flex;
    gap: 0.5rem;

    a {
        color: var(--color-text-muted, #64748b);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        transition: color 0.2s, background-color 0.2s;

        // Dynamic active class applied by component (e.g. .is-active)
        &.is-active {
            color: var(--color-primary, #3b82f6);
            background-color: var(--color-primary-light, #eff6ff);
            font-weight: 600;
        }
    }
}
```

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Semantics

- **Active Page Announcement:** Automatically assigns `aria-current="page"` to the active matching link so screen reader users hear which menu item corresponds to the active page. Attribute is automatically removed when navigation changes.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **External Domain Links:** Links targeting external domains (e.g. `https://external.com/posts`) are automatically ignored to prevent false active state highlighting.
> 2. **Non-Routable Links Filtered:** Anchors with `href="#"`, `href="javascript:..."`, `mailto:`, or `tel:` are automatically skipped.

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant Browser as Browser URL (location.pathname)
    participant Nav as Host Container [data-ln-nav]
    participant Component as ln-nav Instance
    participant Links as Child <a> Elements

    DOM->>Component: Component Mount (via registerComponent)
    Component->>Component: Patch history.pushState & bind popstate
    Component->>Nav: dispatch ln-nav:before-update
    Component->>Links: Match href against normalized pathname
    Component->>Links: Apply active class & aria-current="page"
    Component->>Nav: dispatch ln-nav:update

    Note over Browser, Component: SPA Route Transition (pushState / popstate)
    Browser->>Component: Route changes
    Component->>Nav: dispatch ln-nav:before-update
    Component->>Links: Re-evaluate links & update active class
    Component->>Nav: dispatch ln-nav:update
```

---

## 7. Related Components

- [`ln-router.md`](./ln-router.md) — SPA client router driving `history.pushState` navigation updates.
- [`ln-ajax.md`](./ln-ajax.md) — Asynchronous content loader affecting DOM structure.
