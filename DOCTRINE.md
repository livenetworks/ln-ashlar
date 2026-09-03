# 📜 ln-ashlar Engineering & Component Authoring Doctrines

> **Official Engineering Standards and Architectural Doctrines for `ln-ashlar`**  
> This document defines the mandatory design principles, state management models, event contracts, and authoring guidelines for both human developers and AI assistants.

---

## 🏛️ 1. Three-Layer Architecture

`ln-ashlar` applications are strictly structured into three distinct layers:

```
┌─────────────────────────────────────────────────────────┐
│ Layer 2: Coordinator (Project UI Wiring & Mediator)     │
│ (Catches UI triggers, dispatches request events, bridges)│
└───────────────────────────┬─────────────────────────────┘
                            │ CustomEvents / setAttribute
┌───────────────────────────▼─────────────────────────────┐
│ Layer 1: Component (Reusable Data & DOM Layer)          │
│ (Manages internal DOM, state observer, emits events)    │
└───────────────────────────┬─────────────────────────────┘
                            │ Native APIs / Core Helpers
┌───────────────────────────▼─────────────────────────────┐
│ Layer 3: ln-ashlar Core                                 │
│ (ln-core primitives, fill(), buildDict, interceptors)   │
└─────────────────────────────────────────────────────────┘
```

* **Layer 1: Component (Reusable Data & DOM Layer):** Manages internal component DOM, `MutationObserver` state, CRUD operations, and ARIA attributes. Components with non-trivial domain/algorithmic logic follow the **Two-Tier Archetype** (`src/{name}-model.js` + `src/ln-{name}.js` — see [`docs/architecture/component-coding-standards.md`](docs/architecture/component-coding-standards.md)). Components **MUST NOT** open modals, show toasts, or read external forms directly.
* **Layer 2: Coordinator (Project UI Wiring & Mediator):** Catches UI triggers (clicks, form submits), dispatches request events, bridges attributes across components, and reacts to notification events (toasts/modals).
* **Layer 3: ln-ashlar Core:** Low-level primitives (`ln-core`), DOM utilities (`fill()`, `buildDict()`, `interceptValueProperty()`), and base component prototypes.

---

## ⚖️ 2. Simple Components vs. Coordinators (Command & Query Separation)

* **Simple Components** (e.g. `ln-toggle`, `ln-modal`, `ln-toast`, `ln-validate`, `ln-search`, `ln-table`):
  Must remain completely isolated, managing only their own DOM state and ARIA properties. They have **zero awareness** of other components.
* **Coordinators** (e.g. `ln-table-coordinator`, `ln-data-coordinator`, `ln-ui-coordinator`):
  Listen to events bubbling from simple components and orchestrate state across components strictly via `setAttribute` or request events.
* **Commands (Mutations):**
  Coordinators **MUST NOT** call prototype mutation methods directly (e.g. `el.lnProfile.create()`). They **ALWAYS** dispatch request events (e.g. `ln-profile:request-create`).
* **Queries (Reading State):**
  Coordinators **MAY** read component state properties directly (e.g. `el.lnProfile.currentId`).
* **Component Isolation & Zero Sibling Imports:**
  Components **NEVER** import or reference sibling components. Communication is 100% event-driven via CustomEvents (`{ bubbles: true }`) or attribute bridging by coordinators.
* **The 2-Consumer Lifting Rule:**
  If a pure algorithm, parsing logic, or math formula is needed by 2 or more distinct components (e.g. `calculateProgress`, `parseDateInput`, `formatNumber`, `matchesSearchTokens`), it **MUST** be lifted centrally into `ln-core` sub-modules (`progress.js`, `date.js`, `number.js`, `matching.js`, `compare.js`) rather than cross-imported between components.
* **No Speculative Code (Definition of Done):**
  Functions enter a model **only if the DOM shell or system already actively calls them** — never for hypothetical "might be needed" utilities. Uncalled or dead functions are strictly forbidden.

---

## 🔄 3. Attribute Bridge Pattern & Observable Single Source of Truth

> **Core Axiom:** *The DOM is the public/observable state surface (Control Plane), while JS maintains implementation state and local-first application data.*

* **DOM as Public Control Plane:** Every control state attribute (`data-ln-*`) is observed via `MutationObserver` registered at the component level. For all component control state (e.g. open/closed, active tab, sort direction, search term, page offset, validation state), the attribute in the DOM is the **Single Source of Truth** — a component never keeps a private mirror of a control value it also writes to an attribute. **Because there is no global mutable state tree, the blast radius of any state bug is strictly contained to the individual component.**
* **Separation of Control State vs. Implementation State:**
  1. **Public Control State (DOM Attributes):** Observable, inspectable in DevTools, and mutable via standard DOM APIs (`setAttribute`).
  2. **Application Data Layer (`ln-data-store` + IndexedDB):** Row caches, record sets, sync queues, and conflict metadata live in Layer 3 storage, never serialized as DOM attribute strings.
  3. **Operational Mechanics (JS Memory):** In-flight promises, `AbortController` handles, `MutationObserver` instances, query generations (`queryGen`), and render batching queues (`createBatcher`) are runtime implementation mechanics managed in JS memory.
* **Instant DOM Attribute Writes:** Prototype methods and input controls **MUST** write state directly to target DOM attributes via `setAttribute` (e.g. `this.dom.setAttribute('data-ln-toggle', 'open')`, `target.setAttribute('data-ln-search', input.value)`).
* **Attribute Observer Debouncing:** Debounce timers (e.g. for search throttling) **MUST** reside in the component's attribute observer (`_syncAttribute`), **NOT** in input control event handlers. This ensures input events update the DOM attribute immediately, while `_syncAttribute` handles debouncing heavy work (events / fetches). Programmatic resets (`setAttribute('data-ln-search', '')`) or `0ms` debounces execute instantly without delay.
* **Forbidden ("Checkbox Hack"):** Using `<input type="checkbox">` for toggle state is strictly forbidden (breaks `MutationObserver`, teleportation, ARIA semantics, and encapsulation).

---

## 🎨 4. HTML Template System & Zero JS Display Text

* **HTML-First DOM Structure:** Component DOM structures belong in `<template data-ln-template="...">` in HTML, cloned via `cloneTemplate()` and populated via `fill()`. Never build DOM trees via `createElement` chains in JS.
  * *Micro-Component Exception:* Behavioral button decorators (e.g. `ln-confirm`) are exempt from `<template>` cloning to avoid over-engineering. They use Two-Element Mode (`data-ln-confirm-idle`/`data-ln-confirm-active`) or declarative attribute strings (`data-ln-confirm="..."`). Hardcoded JS strings are strictly developer failsafes.
* **Zero Display Text in JS:** Hardcoded UI text/labels in JS are strictly forbidden. Translatable text lives in `<ul hidden><li data-{component}-dict="key">...</li></ul>` (read via `buildDict()`) or relies on browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`).
  * *Measurement Units Fallback Exception:* Standardized, universal technical/measurement unit symbols (e.g. byte units `'B'`, `'KB'`, `'MB'`, `'GB'`, time units `'ms'`, `'s'`) are permissible as built-in runtime fallback defaults when a custom translation dictionary entry is absent, provided that dictionary lookup (`dict['unit-kb']`) is always attempted first.
* **Semantic HTML5 & Accessibility First:**
  * **Dates & Times:** MUST use `<time datetime="...">` with `data-ln-date` or `data-ln-time` (e.g. `<time datetime="2026-07-25" data-ln-date="long">2026-07-25</time>`).
  * **Numbers & Totals:** MUST use semantic inline tags (`<strong>`, `<b>`, `<data value="...">`, `<td>`) with `data-ln-number`.
  * **Controls & Actions:** MUST use `<button type="button">` / `<button type="submit">`, `<label>`, `<fieldset>`, `<legend>`.
  * **Structural Lists vs. Editorial Prose:** `<ul>` and `<ol>` are clean UI primitives by default (`list-style: none`, `margin: 0`, `padding: 0`) for repeating components (menus, tabs, chips, accordions, button groups). Editorial text lists with bullet discs, decimal numbers, and vertical rhythm are opt-in and live strictly within `.prose` (`@include prose`).
* Machine-readable attributes (`datetime`, `data-ln-value`) **MUST** be preserved for screen readers and ARIA accessibility while visible text content is formatted dynamically according to locale.

---

## ⏱️ 5. Lifecycle Events, Detail Guards & Async Invariants

* **Paired Events:** Components emit cancelable `ln-{name}:before-{action}` before state changes, and post-fact bubbling `ln-{name}:{action}` after state changes.
  ```js
  // 1. Before event (cancelable)
  const beforeEvt = new CustomEvent('ln-modal:before-open', { cancelable: true, bubbles: true, detail: { modalId } });
  if (!this.dom.dispatchEvent(beforeEvt)) return;

  // ... state change ...

  // 2. After event (bubbling)
  this.dom.dispatchEvent(new CustomEvent('ln-modal:open', { bubbles: true, detail: { modalId } }));
  ```
* **Detail Guard Pattern:** Always check `e.detail && e.detail.prop` when listening to external events:
  ```js
  element.addEventListener('ln-search:change', function (e) {
    if (!e.detail || typeof e.detail.value === 'undefined') return;
    // Handle verified search query
  });
  ```
* **Async Lifecycle & Cancellation Protocol:**
  Any component performing asynchronous operations (`fetch`, IndexedDB transactions, streaming, network queues, debounced timers) MUST adhere to the **Destroyed Component Invariant**:
  - **Zero Post-Destroy Side Effects:** A destroyed component MUST NOT mutate the DOM, MUST NOT dispatch state updates or CustomEvents, and MUST NOT commit asynchronous results.
  - **Explicit Cancellation on Teardown:** The component MUST manage an active `AbortController` (or equivalent cancellation handle). When `destroy()` is called:
    1. In-flight network requests MUST be aborted immediately (`this._abortController.abort()`).
    2. Active timers/intervals MUST be cleared (`clearTimeout` / `clearInterval`).
    3. Outstanding pending receipts/promises MUST be rejected or safely discarded.
  - **Generation Tracking (`queryGen`):** Data-consuming components (`ln-table`, `ln-list`, `ln-data-store`, `createWindowIndex`) MUST track request generation counters (`queryGen` / `requestId`) to silently drop stale asynchronous responses that arrive after a subsequent reset or query transition.

---

## 🔒 6. Local Encapsulation vs. Window-Level Coordinators

* **Local Multi-Instance Isolation:** Components that can be instantiated multiple times on a page (`form`, `ln-validate`, `ln-autosave`, `ln-accordion`, `ln-tabs`) are strictly self-contained. The validator (`ln-validate`) operates as an encapsulated child of its parent `<form>`. Multiple instances or forms on the same page operate completely independently.
* **Window-Level Scope Boundary (`ln-ui-coordinator`):** Window-level coordinators manage only shared, window-wide UI services (hash routing for modals `#modal-id`, toast dispatching, global AJAX success/error toast mediation, upload notifications). They **MUST NEVER** couple with, inspect, or manage internal validation/submission state of local forms or components.
* **Cross-Component Invariants:** Any invariant that spans multiple autonomous components (e.g. ensuring Component A and Component B cannot be active simultaneously) **MUST** be explicitly managed via event coordination by a coordinator layer, never by the components themselves. Components remain blind to their siblings.

---

## 🛡️ 7. UI/UX Confirmation & Gating Guidelines

* **Single-Element Actions (`ln-confirm`):** The `ln-confirm` component (in-place two-click confirmation) is strictly reserved for **single-element, low-impact actions** (e.g. deleting a single table row, archiving a single document). It must never be used for complex or high-risk actions. Prefers Two-Element Mode (`data-ln-confirm-idle`/`data-ln-confirm-active`) for HTML-first clarity.
* **Bulk Actions & High-Impact Operations (`ln-modal`):** For actions that affect multiple items simultaneously (e.g. bulk deleting selected tenants, batch status updates) or actions with major side effects, using in-place `ln-confirm` is strictly forbidden. Instead, a confirmation modal (`ln-modal`) **MUST** be shown listing affected resources, impact summary, and explicit "Confirm" / "Cancel" actions.

---

## 🎨 8. Visual Layer vs. Functional Layer Separation & Search Rules

* **Separation of Concerns:** Clearly separate visual styling (HTML chrome/wrappers and CSS classes, e.g. `.search`, `.collapsible`) from functional JS triggers (`data-ln-*` attributes). Visual markup classes are recommended globally as design standards even if JS logic is absent.
* **Search Debounce Guidelines:**
  * **Local DOM Search (Markup Search):** When searching locally within the DOM, always explicitly set `data-ln-search-debounce="0"` on the input to ensure instant filtering on keyup/input.
  * **Remote Search (API Search):** When searching via backend APIs (e.g., using `ln-data-store`, `ln-table` remote mode, or custom fetches), always use a debounce of `500` milliseconds (the standard default in `ln-search`) to throttle requests and protect the server.

---

## 📖 9. Extended Doctrine Reference & Sub-Doctrines

For deep-dive technical specs on specific domains, consult the sub-doctrines in [`docs-mcp/doctrine/`](docs-mcp/doctrine/README.md):

* 🧩 **[JS Component Model Doctrine](docs-mcp/doctrine/js-component-model.md)** — Lifecycle hooks, shadow-free encapsulation, and Proxy traps.
* 🏷️ **[HTML Markup Rules](docs-mcp/doctrine/html-markup-rules.md)** — Template cloning, accessibility ARIA patterns, and micro-component specs.
* 🌊 **[Data Flow Architecture](docs-mcp/doctrine/data-flow.md)** — Event propagation, request-event dispatching, and CQS flows.
* 🗄️ **[Data Layer Doctrine](docs-mcp/doctrine/data-layer.md)** — Stores, IndexedDB persistence, HTTP connector contracts, and offline caching.
* 🎨 **[SCSS Architecture Doctrine](docs-mcp/doctrine/scss-architecture.md)** — Mixin scoping, BEM naming, tokens, and theme layers.
* 🧠 **[Engineering Mindset & Philosophy](docs-mcp/doctrine/mindset.md)** — Philosophical foundations of Ashlar's DOM-first approach.
