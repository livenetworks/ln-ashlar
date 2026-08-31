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
* **Component Isolation:**
  Components **NEVER** import or reference sibling components. Communication is 100% event-driven via CustomEvents (`{ bubbles: true }`) or attribute bridging by coordinators.

---

## 🔄 3. Attribute Bridge Pattern & Observable Single Source of Truth

* **All `data-ln-*` Attributes Are Observable:** Every state attribute is observed via `MutationObserver` registered at the component level. The attribute in the DOM is the **Single Source of Truth** at all times.
* **Instant DOM Attribute Writes:** Prototype methods and input controls **MUST** write state directly to target DOM attributes via `setAttribute` (e.g. `this.dom.setAttribute('data-ln-toggle', 'open')`, `target.setAttribute('data-ln-search', input.value)`).
* **Attribute Observer Debouncing:** Debounce timers (e.g. for search throttling) **MUST** reside in the component's attribute observer (`_syncAttribute`), **NOT** in input control event handlers. This ensures input events update the DOM attribute immediately, while `_syncAttribute` handles debouncing heavy work (events / fetches). Programmatic resets (`setAttribute('data-ln-search', '')`) or `0ms` debounces execute instantly without delay.
* **Forbidden ("Checkbox Hack"):** Using `<input type="checkbox">` for toggle state is strictly forbidden (breaks `MutationObserver`, teleportation, ARIA semantics, and encapsulation).

---

## 🎨 4. HTML Template System & Zero JS Display Text

* **HTML-First DOM Structure:** Component DOM structures belong in `<template data-ln-template="...">` in HTML, cloned via `cloneTemplate()` and populated via `fill()`. Never build DOM trees via `createElement` chains in JS.
  * *Micro-Component Exception:* Behavioral button decorators (e.g. `ln-confirm`) are exempt from `<template>` cloning to avoid over-engineering. They use Two-Element Mode (`data-ln-confirm-idle`/`data-ln-confirm-active`) or declarative attribute strings (`data-ln-confirm="..."`). Hardcoded JS strings are strictly developer failsafes.
* **Zero Display Text in JS:** Hardcoded UI text/labels in JS are strictly forbidden. Translatable text lives in `<ul hidden><li data-{component}-dict="key">...</li></ul>` (read via `buildDict()`) or relies on browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`).
* **Semantic HTML5 & Accessibility First:**
  * **Dates & Times:** MUST use `<time datetime="...">` with `data-ln-date` or `data-ln-time` (e.g. `<time datetime="2026-07-25" data-ln-date="long">2026-07-25</time>`).
  * **Numbers & Totals:** MUST use semantic inline tags (`<strong>`, `<b>`, `<data value="...">`, `<td>`) with `data-ln-number`.
  * **Controls & Actions:** MUST use `<button type="button">` / `<button type="submit">`, `<label>`, `<fieldset>`, `<legend>`.
* Machine-readable attributes (`datetime`, `data-ln-value`) **MUST** be preserved for screen readers and ARIA accessibility while visible text content is formatted dynamically according to locale.

---

## ⏱️ 5. Lifecycle Events & Detail Guards

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

---

## 🔒 6. Local Encapsulation vs. Window-Level Coordinators

* **Local Multi-Instance Isolation:** Components that can be instantiated multiple times on a page (`form`, `ln-validate`, `ln-autosave`, `ln-accordion`, `ln-tabs`) are strictly self-contained. The validator (`ln-validate`) operates as an encapsulated child of its parent `<form>`. Multiple instances or forms on the same page operate completely independently.
* **Window-Level Scope Boundary (`ln-ui-coordinator`):** Window-level coordinators manage only shared, window-wide UI services (hash routing for modals `#modal-id`, toast dispatching, global AJAX success/error toast mediation, upload notifications). They **MUST NEVER** couple with, inspect, or manage internal validation/submission state of local forms or components.

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
