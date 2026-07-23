---
name: js-component-model
classification: doctrine
status: draft
domain: frontend
summary: JavaScript component architecture of ln-ashlar - IIFE registration, the Attribute Bridge, MutationObserver auto-initialization, and event-driven data flow.
source: docs/js/component-guide.md, docs/js/core.md, js/COMPONENTS.md
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

## 3. The Attribute Bridge Pattern

To maintain the HTML DOM as the single source of truth, `ln-ashlar` enforces the **Attribute Bridge Pattern**:

- **Mutations Write Attributes:** Public prototype methods that change state must **only** call `setAttribute` on the root DOM element (e.g., `this.dom.setAttribute('data-ln-toggle', 'open')`).
- **Observer Synchronizes State:** A `MutationObserver` watches attribute changes and triggers an internal synchronization method (`_syncAttribute()`), which performs the actual DOM modifications and dispatches events.

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

## 7. Naming Conventions

All naming must follow strict, predictable conventions:

| Target | Pattern | Example |
|---|---|---|
| Functional Attribute | `data-ln-{name}` | `data-ln-modal` |
| JS Instance | `el.ln{Name}` | `el.lnModal` |
| Before Event (cancelable) | `ln-{name}:before-{action}` | `ln-modal:before-close` |
| After Event (notification) | `ln-{name}:{action}` | `ln-modal:close` |
| Request Event (mutation) | `ln-{name}:request-{action}` | `ln-data-store:request-create` |
| Dictionary Attribute | `data-ln-{name}-dict` | `data-ln-upload-dict` |
| Template Identifier | `data-ln-template="{tmpl}"` | `data-ln-template="row"` |
