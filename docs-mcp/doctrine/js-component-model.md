---
name: js-component-model
classification: doctrine
status: draft
domain: frontend
summary: JavaScript component architecture of ln-ashlar - IIFE registration, the Attribute Bridge, MutationObserver auto-initialization, and event-driven data flow.
source: docs/architecture/component-guide.md, components/ln-core/README.md, components/COMPONENTS.md
tags: [doctrine, javascript, components, events, reactive]
---

# ⚙️ JavaScript Component Model

## Summary

This document describes the JavaScript component architecture of `ln-ashlar`. It explains the three-layer pattern (Component vs. Coordinator), IIFE encapsulation, the Attribute Bridge pattern (Attribute as Single Source of Truth), automatic initialization via `MutationObserver`, the reactive rendering pipeline, and strict naming conventions for events and APIs.

---

## 1. The Three-Layer Architecture

`ln-ashlar` application logic is separated into three distinct layers to ensure modularity, separation of concerns, and clean testing boundaries:

```
┌────────────────────────────────────────────────────────┐
│  1. Coordinator (Project UI Mediator / Controller)     │
│  Listens to DOM triggers → dispatches request events →  │
│  reacts to notification events to show toasts/modals   │
├────────────────────────────────────────────────────────┤
│  2. Components (Reusable DOM & State Modules)          │
│  Owns state, CRUD, internal template rendering, and DOM│
├────────────────────────────────────────────────────────┤
│  3. ln-ashlar Core (Library Primitives)                │
│  Low-level helpers: ln-core, fill(), buildDict(), etc. │
└────────────────────────────────────────────────────────┘
```

### Component vs. Coordinator Rule (Command & Query Separation)
- **Component (State & DOM):** Manages local state and its own DOM tree. It must **never** open a modal, trigger a toast notification, read an external form, or import sibling components.
- **Coordinator (Wiring):** Mediates between components and UI feedback. It catches triggers (e.g., button clicks or form submits), reads inputs, and orchestrates actions.
- **Commands (Mutations):** A coordinator must **never** call state-mutation prototype methods directly (e.g., `el.lnProfile.create()` is forbidden). It must instead dispatch a custom request event (`ln-profile:request-create`).
- **Queries (Reading):** A coordinator is allowed to query a component's current state properties directly (e.g., reading `el.lnProfile.currentId`).

### Coordinator Mindset: Wrapper-Level Scoping & Child Component Orchestration
- **Wrapper Encapsulation:** A Coordinator component resides on a parent container element (e.g. `<div data-ln-table-coordinator>`, `<ul data-ln-accordion>`, `<section data-ln-data-coordinator>`) and orchestrates child components within its DOM subtree.
- **Role-Based Definition (Naming Convention):** A coordinator is defined by its architectural role (wrapper-level mediator orchestrating child components), not by a mandatory `-coordinator` suffix. While complex system mediators use explicit `-coordinator` suffixes (e.g., `data-ln-table-coordinator`, `data-ln-data-coordinator`, `data-ln-ui-coordinator`), structural UI coordinators use natural component names (e.g., `data-ln-accordion` coordinating child `ln-toggle` items, `data-ln-tabs`).
- **Unscoped Coexistence:** Coordinators operate at the wrapper level without requiring explicit scope names or target ID linkages. This allows multiple coordinator blocks (e.g., multiple table/filter sections or multiple accordions) to run concurrently on the same page without ID collisions or cross-component interference.
- **Child Orchestration:** The coordinator listens to events from child components (`ln-search`, `ln-filter`, `ln-toggle`, `ln-form`) inside its wrapper and bridges commands directly to sibling child primitives (`ln-table`, `ln-data-store`).

### Local Encapsulation vs. Window-Level Scope Boundaries (Multi-Instance Isolation)
- **Local Multi-Instance Isolation:** Components that can be instantiated multiple times on a page (`<form>`, `ln-validate`, `ln-autosave`, `ln-accordion`, `ln-tabs`) are strictly self-contained. For example, `ln-validate` operates as an encapsulated child of its parent `<form>`. A page can have $N$ independent forms or modal instances, each operating with complete autonomy over its own lifecycle, DOM state, and submit gates.
- **Window-Level Scope Boundary:** A window-level coordinator (like `ln-ui-coordinator`) is strictly reserved for shared, window-wide UI services (hash routing for modals `#modal-id`, toast dispatching, global AJAX success/error toast mediation, upload notifications). It **must never** couple with, inspect, or manage the internal validation/submission state of local forms or multi-instance components. Anything that can be multi-instantiated belongs to its own local wrapper/form lifecycle.

### Overlay Exception
Overlay components (modal, dropdown, popover, tooltip) get exactly three document-level touchpoints, paired to the open/close lifecycle: dismissal listeners (Escape/outside-click), focus management, and one `.ln-*` body state class. Listeners attach on open, detach on close — they remain sensors that funnel into the component's own attribute state machine, never actuators on foreign DOM. Prefer native top-layer primitives (`<dialog>.showModal()`, Popover API) over hand-rolled stacking.

---

## 2. Component Structure and IIFE Encapsulation

Every component is written as an Immediately Invoked Function Expression (IIFE) that self-registers via `registerComponent` from `ln-core`.

### Non-Negotiable Architecture Rules:
1. **Paired Selectors:** The HTML hook `data-ln-{name}` corresponds directly to the JavaScript instance identifier `el.ln{Name}` (e.g., `data-ln-modal` maps to `el.lnModal`).
2. **DOM-Bound Instances:** Component instances reside directly on the DOM element (`el.ln{Name}`), not in a global JavaScript registry. Multiple instances coexist safely on the same page.
3. **The `destroy()` Contract:** Every component must implement a prototype `destroy()` method to clean up memory. It must disconnect observers, remove all event listeners added to parent elements or document hooks, remove shared pool memberships, and delete the DOM element reference.

### Global Service Variant
A component with no own DOM — no instances, no observer — is a document-level listener that any element dispatches to (`window` registration = `true`, in place of an instance constructor).

---

## 3. The Attribute Bridge Pattern & Two-Host Architecture

To maintain the HTML DOM as the single source of truth, `ln-ashlar` enforces the **Attribute Bridge Pattern** across all components:

### The Two-Host Pattern (Control vs. State Host)
Components with separate triggers/inputs and targets use a decoupled two-host architecture:
1. **Control / Trigger (`data-ln-{name}-for="targetId"`)**:
   - Resides on the user control (e.g. `<input data-ln-search-for="my-table">`, `<button data-ln-modal-for="user-modal">`, `<button data-ln-toggle-for="details">`).
   - Owns user interactions (keystrokes, debounce, clear buttons, clicks).
   - **Does NOT mutate target state directly in JS**: It strictly writes to the target DOM attribute (e.g. `target.setAttribute('data-ln-search', value)` or `target.setAttribute('data-ln-modal', 'open')`).
2. **State Host (`data-ln-{name}="state"`)**:
   - Resides on the target container/element (e.g. `<table id="my-table" data-ln-search="">`, `<div id="user-modal" data-ln-modal="closed">`).
   - Owns the true state property (`this.term`, `this.isOpen`).
   - Monitored by a `MutationObserver` (`onAttributeChange: _syncAttribute`).

### Attribute-Driven Commands vs. Event-Driven Notifications
- **Commands & Requests (Mutations):** Come strictly through **Attributes** via `setAttribute` (or request events from coordinators). Modifying the HTML attribute is how anything in the system asks a component to change. The component's `MutationObserver` catches this change, validates it against the current instance state (idempotency guard `if (next === instance.state) return`), updates internal state, and syncs controls.
- **Events (Lifecycle & Intent Announcements):**
  - **Before / Intent Events (`ln-{name}:before-{action}` / cancelable hooks like `ln-search:change`):** Announces *"I am preparing to act / search / close — does an external consumer want to take over or cancel?"*. Calling `event.preventDefault()` allows coordinators or parent components (like `ln-table` or `ln-data-store`) to handle the action.
  - **After / Notification Events (`ln-{name}:{action}`):** Announces *"Action completed / state has transitioned"*. Bubbles up for coordinators, analytics, or UI feedback.

### Two-Way Attribute-to-Control Synchronization
When an attribute is modified directly on the State Host (e.g. via deep-linking, coordinator, or DevTools), the State Host automatically updates all matching controls via reverse ID query:
```js
function _syncControls(target, value) {
    if (!target.id) return;
    const controls = document.querySelectorAll('[' + CONTROL_SELECTOR + '="' + target.id + '"]');
    for (const control of controls) {
        const input = _resolveInput(control);
        if (input && input.value !== value) input.value = value;
    }
}
```

#### Correct State Transition (Attribute Bridge):
```js
_component.prototype.open = function () {
    if (this.isOpen) return;
    this.dom.setAttribute('data-ln-toggle', 'open');
    // Observer triggers _syncAttribute() -> updates DOM, dispatches events
};
```

### Why the "Checkbox Hack" is Forbidden
Using hidden checkboxes (`<input type="checkbox">`) to toggle styling state is strictly forbidden. 
1. Setting `.checked = true` programmatically in JS does **not** trigger native browser `input`/`change` events, nor does it fire `MutationObserver` attribute watches.
2. It breaks encapsulation by exposing internal inputs to external controllers.
3. It violates semantic accessibility (ARIA) standards.

### No Inline Styling from JS
Consistent with the Attribute Bridge, JS never sets styles directly (`el.style.*`) — it toggles classes/attributes and lets SCSS style the resulting state. (Accepted exception on record: `ln-date`'s hidden native picker.) Dev-misuse warnings surface via a CSS `::after` affordance, not `console.warn`. Recoverable runtime issues use a `[component-name]`-prefixed `console.warn` + bail — never throw across handlers, never `alert`/`confirm`/`prompt`.

---

## 4. MutationObserver and Auto-Initialization

Dynamic HTML injected into the page (via AJAX, router transitions, or raw `innerHTML` replacements) is automatically initialized by a document-level `MutationObserver`.

### Rules:
- The observer filters on target attributes via `attributeFilter` to ensure performance is not degraded by unrelated class or style mutations.
- Double-initialization is prevented by checking the presence of the instance property (e.g., `if (el.lnName) return`).
- **Instant Inspector Activation:** Because the observer tracks target attribute additions globally across the document tree, a developer can dynamically add a component selector (e.g. `data-ln-toggle="close"`) to any element directly inside the browser's developer tools inspector, and the framework will instantly bootstrap the component instance without requiring a page refresh.

### The Three Core Assertions of DOM-First Architecture
1. **Control State Lives on the DOM (No Inaccessible Closures):**
   Component control state — open/closed, active, sort direction, mode, validation status — is never trapped inside private closures or hidden memory trees. It lives openly and visibly on the DOM element's attributes (`data-ln-*`). Application data (records, caches, sync queues) lives in `ln-data-store` and IndexedDB; operational mechanics (in-flight requests, observers, query generations, batchers) live in JS memory. Those are runtime internals, not application state, and never belong on attributes.
2. **Declarative, Testable & Reproducible:**
   Any control state — a search term, an open modal, an expanded accordion, a deep-linked view — can be authored, inspected, automated, restored, or server-rendered from HTML attributes alone, with no orchestration script. Application data is restored by the store from its own cache, not from markup.
3. **DevTools Inspector as the Control Plane:**
   Editing any attribute in the browser's DevTools Inspector immediately activates the component's functionality in real-time. The underlying `MutationObserver` instantly synchronizes the internal engine, updates the DOM, syncs matching controls (`[data-ln-*-for]`), and dispatches lifecycle events.

### Hydration Polarity (SSR)
Server-rendered content is authored as full markup; JS hydration adds behavior only. `<template>` + fill is reserved for runtime data — not for content that already exists in the server-rendered page. Content is visible without JS; transient enter-states (`.ln-enter`) are the exception, not the default.

---

## 5. Reactive Rendering Pattern

When a component manages complex internal states that update the DOM, it uses `reactiveState` (shallow proxy) or `deepReactive` (recursive proxy) combined with `createBatcher` and `fill`.

```
State Mutation (state.key = 'value')
        ↓
Microtask Queue (createBatcher coalesces updates)
        ↓
One Render (fill() updates DOM once per tick)
```

- **Coalescing:** Multiple synchronous state writes in the same execution tick are batched. The DOM renders exactly once in the next microtask, preventing layout thrashing.
- **Batcher:** The batched render loop completes by triggering an `afterRender` callback, which dispatches notification events.

---

## 6. Shared Resource Pools and Caching

To optimize memory usage, components must share heavy resources at the module level rather than instantiating them per-instance:

- **Shared Intervals:** Components requiring ticks (like [`ln-time`](../components/ln-time.md) for relative timestamps) must use a single module-level `setInterval` loop. The ticker iterates over a registered `Set` of active instances and cleans up orphaned elements using `document.body.contains(instance.dom)`.
- **Formatter Cache:** Native localization formatters (e.g. `Intl.DateTimeFormat` or `Intl.RelativeTimeFormat`) are expensive to initialize. Cache them globally by key:
```js
const _formatters = {};
function _getFormatter(locale, options) {
    const key = locale + ':' + JSON.stringify(options);
    if (!_formatters[key]) {
        _formatters[key] = new Intl.DateTimeFormat(locale, options);
    }
    return _formatters[key];
}
```

---

## 7. URL Hash State Synchronization Doctrine (`data-ln-hash`)

Ashlar components support opt-in URL hash synchronization (`data-ln-hash`) to enable shareable URLs, deep-linking, and browser back/forward history navigation without violating component isolation.

### Core Architectural Principles:
1. **Isolated Multi-Namespace Ownership:**
   - URL fragment grammar: `#namespaceA:valueA&namespaceB:valueB`.
   - Each component owns exactly ONE namespace, reads/writes only its own segment, and **strictly preserves foreign segments** during mutations (`hashSet(ns, value)`).
   - Multi-Table & Multi-Control Coexistence: Multiple tables, search inputs, filter bars, tabs, and modals can sync to the URL simultaneously without collision:
     `#users-search:john&users-filter:dept:design&users-sort:created-at.desc&orders-sort:total.asc&modal:edit-item`
2. **Namespace Resolution Strategy:**
   - When authored with an explicit string (`data-ln-hash="q"`), that exact namespace is used.
   - When authored as a boolean flag (`data-ln-hash` or empty), the namespace defaults to `[targetId]-[defaultSuffix]` (e.g. `users-table-sort`, `users-table-search`, `users-table-filter`).
3. **Codec & Value Separation (Zero Hyphen Collision):**
   - **Sort Codec (`hashSortEncode` / `hashSortDecode`):** Uses dot separator with suffix parsing (`field.asc`, `field.desc`, e.g. `price.asc`, `created-at.desc`, `billing-address-zip.asc`). Suffix parsing prevents collisions with hyphens, underscores, or numbers in field names.
   - **Filter Codec (`hashFilterEncode` / `hashFilterDecode`):** Uses key-value colon with comma lists (`key:val1,val2`, e.g. `category:design,dev`).
   - **Deletion on Reset:** When a sort is cleared (`none`), search query is emptied (`""`), or filter is reset, the component deletes its namespace from the hash (`hashSet(ns, null)`), leaving foreign segments intact.
4. **Boot Priority Matrix:**
   - **1. URL Hash (`hashGet`):** Highest authority. Deep-linked or bookmarked URLs override local caches.
   - **2. LocalStorage (`data-ln-persist`):** Intermediate authority. Restores past user session when no URL hash is present.
   - **3. Authored HTML Markup:** Fallback default when neither hash nor storage exists.
5. **Reactive Browser History Navigation:**
   - Components attach `window.addEventListener('hashchange')` to synchronize DOM states when the user clicks the browser Back or Forward buttons.

---

## 8. Naming Conventions

All naming must follow strict, predictable conventions:

| Target | Pattern | Example |
|---|---|---|
| State Host Attribute | `data-ln-{name}` | `data-ln-modal`, `data-ln-search` |
| Control Pointer Attribute | `data-ln-{name}-for` | `data-ln-modal-for="id"`, `data-ln-search-for="id"` |
| Hash Sync Attribute | `data-ln-hash` | `data-ln-hash`, `data-ln-hash="q"` |
| Storage Persist Attribute | `data-ln-persist` | `data-ln-persist`, `data-ln-persist="key"` |
| JS State Instance | `el.ln{Name}` | `el.lnModal`, `el.lnSearch` |
| JS Control Instance | `el.ln{Name}Control` | `el.lnSearchControl`, `el.lnModalTrigger` |
| Before Event (cancelable) | `ln-{name}:before-{action}` | `ln-modal:before-close` |
| After Event (notification) | `ln-{name}:{action}` | `ln-modal:close` |
| Request Event (mutation) | `ln-{name}:request-{action}` | `ln-data-store:request-create` |
| Dictionary Attribute | `data-ln-{name}-dict` | `data-ln-upload-dict` |
| Template Identifier | `data-ln-template="{tmpl}"` | `data-ln-template="row"` |

