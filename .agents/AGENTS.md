# ln-ashlar Project Rules

> 📜 **Standalone Document:** Full human- and AI-readable engineering doctrines are maintained in [DOCTRINE.md](../DOCTRINE.md).

## 1. Ashlar Architecture & Component Authoring Doctrines

### A. Three-Layer Architecture
- **Layer 1: Component (Reusable Data & DOM Layer)**: Manages state, CRUD, internal child DOM. Does NOT open modals, show toasts, or read external forms.
- **Layer 2: Coordinator (Project UI Wiring & Mediator)**: Catches UI triggers (clicks, form submits), dispatches request events, bridges attributes across components, reacts to notification events (toasts/modals).
- **Layer 3: ln-ashlar Core**: Low-level primitives (`ln-core`), utilities (`fill`, `buildDict`, `interceptValueProperty`), and base components.

### B. Simple Components vs. Coordinators (Command & Query Separation)
- **Simple Components** (e.g., `ln-toggle`, `ln-modal`, `ln-toast`, `ln-validate`): Must remain isolated, managing only their own DOM state and ARIA properties, completely unaware of other components.
- **Coordinators** (e.g., `ln-accordion`, custom project JS controllers): Listen to events bubbling from simple components and orchestrate state across components strictly via `setAttribute` or request events.
- **Commands (Mutations)**: Coordinators MUST NOT call prototype mutation methods directly (`el.lnProfile.create()`). They ALWAYS dispatch request events (`ln-profile:request-create`).
- **Queries (Reading State)**: Coordinators MAY read component state properties directly (`el.lnProfile.currentId`).
- **Component Isolation & Zero Sibling Imports**: Components NEVER import or reference sibling components. Communication is 100% event-driven via CustomEvents (`{ bubbles: true }`) or attribute bridging by coordinators.
- **The 2-Consumer Lifting Rule**: If a pure helper/math algorithm is needed by 2+ components (e.g. `calculateProgress`, `parseDateInput`, `formatNumber`), it MUST be lifted into `ln-core` (`progress.js`, `date.js`, `number.js`, `matching.js`, `compare.js`) rather than cross-imported.
- **No Speculative Code (DoD)**: Functions enter a model ONLY if the DOM shell or system already actively calls them. Uncalled or dead functions are strictly forbidden.

### C. Attribute Bridge Pattern & Observable Single Source of Truth
- **Core Axiom**: The DOM is the public/observable state surface (Control Plane), while JS maintains implementation mechanics and application data.
- **All `data-ln-*` Control Attributes Are Observable**: Every state attribute is observed via `MutationObserver` registered at the core/component level. For all component control state, the attribute in the DOM is the **Single Source of Truth** — a component never keeps a private mirror of a value it also writes to an attribute. Row caches, record sets, and sync queues live in `ln-data-store`, never on attributes. Operational mechanics (promises, `AbortController`, `queryGen`, batching queues) live in JS memory.
- **Instant DOM Attribute Writes**: Prototype methods and input controls MUST write state directly to target DOM attributes via `setAttribute` (e.g. `this.dom.setAttribute('data-ln-toggle', 'open')`, `target.setAttribute('data-ln-search', input.value)`).
- **Attribute Observer Debouncing**: Debounce timers (e.g., for search throttling) MUST reside in the component's attribute observer (`_syncAttribute`), NOT in the input control event handlers. This ensures input events update the DOM attribute immediately, while `_syncAttribute` handles debouncing the heavy work (events / fetches). Programmatic resets (`setAttribute('data-ln-search', '')`) or `0ms` debounces execute instantly without delay.
- `MutationObserver` detects attribute changes and triggers internal state synchronization (`_syncAttribute()`).
- **Forbidden ("Checkbox Hack")**: Using `<input type="checkbox">` for toggle state is strictly forbidden (breaks `MutationObserver`, teleportation, ARIA semantics, and encapsulation).

### D. HTML Template System & Zero JS Display Text
- **HTML-First DOM Structure**: Component DOM structures belong in `<template data-ln-template="...">` in HTML, cloned via `cloneTemplate()` and populated via `fill()`. Never build DOM trees via `createElement` chains in JS.
  - **Micro-Component Exception**: Behavioral button decorators (e.g. `ln-confirm`) are exempt from `<template>` cloning to avoid over-engineering. They use Two-Element Mode (`data-ln-confirm-idle`/`data-ln-confirm-active`) or declarative attribute strings (`data-ln-confirm="..."`). Hardcoded JS strings are strictly developer failsafes.
- **Zero Display Text in JS**: Hardcoded UI text/labels in JS are strictly forbidden. Translatable text lives in `<ul hidden><li data-{component}-dict="key">...</li></ul>` (read via `buildDict`) or relies on browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`).
  - **Measurement Units Fallback Exception**: Standardized, universal technical/measurement unit symbols (e.g. byte units `'B'`, `'KB'`, `'MB'`, `'GB'`, time units `'ms'`, `'s'`) are permissible as built-in runtime fallback defaults when a custom translation dictionary entry is absent, provided that dictionary lookup (`dict['unit-kb']`) is always attempted first.
- **Semantic HTML5 & Accessibility First**:
  - Always use semantic HTML5 elements for data presentation instead of generic `<div>` or `<span>` containers:
    - **Dates & Times**: MUST use `<time datetime="...">` with `data-ln-date` or `data-ln-time` (e.g. `<time datetime="2026-07-25" data-ln-date="long">2026-07-25</time>`).
    - **Numbers & Totals**: MUST use semantic inline tags (`<strong>`, `<b>`, `<data value="...">`, `<td>`) with `data-ln-number`.
    - **Controls & Actions**: MUST use `<button type="button">` / `<button type="submit">`, `<label>`, `<fieldset>`, `<legend>`.
    - **Structural Lists vs. Editorial Prose**: `<ul>` and `<ol>` are clean UI primitives by default (`list-style: none`, `margin: 0`, `padding: 0`) for repeating components (menus, tabs, chips, accordions, button groups). Editorial text lists with bullet discs, decimal numbers, and vertical rhythm are opt-in and live strictly within `.prose` (`@include prose`).
  - Machine-readable attributes (`datetime`, `data-ln-value`) MUST be preserved for screen readers and ARIA accessibility while the visible text content is formatted dynamically according to locale.

### E. Lifecycle Events, Detail Guards & Async Cancellation Invariants
- **Paired Events**: Components emit `ln-{name}:before-{action}` (cancelable) before state changes, and `ln-{name}:{action}` (post-fact, bubbling) after state changes.
- **Detail Guard Pattern**: Always check `e.detail && e.detail.prop` when listening to external events.
- **Async Cancellation & Destroyed Invariant**: Components running asynchronous operations (`fetch`, timers, IndexedDB) MUST maintain an `AbortController`. On `destroy()`, in-flight requests MUST be aborted (`abort()`) and timers cleared. A destroyed component MUST NOT mutate DOM, commit async state, or dispatch events. Data consumers MUST use generation counters (`queryGen`) to discard stale responses.

### F. Local Encapsulation vs. Window-Level Coordinators (Multi-Instance Isolation)
- **Local Multi-Instance Isolation**: Components that can be instantiated multiple times on a page (`form`, `ln-validate`, `ln-autosave`, `ln-accordion`, `ln-tabs`) are strictly self-contained. The validator (`ln-validate`) operates as an encapsulated child of its parent `<form>`. Multiple instances or forms on the same page operate completely independently.
- **Window-Level Scope Boundary (`ln-ui-coordinator`)**: Window-level coordinators manage only shared, window-wide UI services (hash routing for modals `#modal-id`, toast dispatching, global AJAX success/error toast mediation, upload notifications). They MUST NEVER couple with, inspect, or manage the internal validation/submission state of local forms or components.

## 2. Codebase Integrity and Realistic Modeling
- **No Hallucinated Attributes/Components**: Never invent attributes or components that do not exist (e.g., `data-ln-action` or `ln-action`). Only reference actual components found in the `components/` directory (e.g., `ln-toggle`, `ln-modal`, `ln-table`, `ln-form`, `ln-validate`, `ln-data-store`, `ln-data-coordinator`).

## 3. Architecture Documentation Structure & Component Standards
- All component documentation in `docs-mcp/components/` MUST strictly follow the unified English structure.
- **Mandatory Section Headings**:
  1. `## 1. Core Behavior & Responsibility`
  2. `## 2. Minimal HTML Markup & Usage Variants`
  3. `## 3. Declarative API Contract (Attributes & Events)`
  4. `## 4. CSS Styling & Behavioral Concept`
  5. `## 5. Accessibility (ARIA) & Common Pitfalls`
  6. `## 6. Sequence & Lifecycle Flow` (Mermaid sequence diagram)
  7. `## 7. Related Components & Coordinators`
- **Relative Links Requirement**: Always use relative paths for file links in component documentation (e.g. `../../components/ln-tooltip/src/ln-tooltip.js`, `./ln-confirm.md`), NEVER absolute `file:///` URLs.
- Lead documentation with user/developer usage examples; keep internal JS engine code dumps out of consumer docs.
- **Conciseness & Compactness**: Keep documentation lean, focused, and direct. Consolidate related HTML markup variants into compact code blocks, use clean concise API tables, and keep Mermaid sequence diagrams focused on high-level lifecycle flows (3-4 key participants max). Avoid multi-paragraph over-explanations.

## 4. Visual Layer vs. Functional Layer Separation & Search Rules
- **Separation of Concerns:** Clearly separate visual styling (HTML chrome/wrappers and CSS classes, e.g. `.search`, `.collapsible`) from functional JS triggers (`data-ln-*` attributes). Visual markup classes are recommended globally as design standards even if JS logic is absent.
- **Search Debounce Guidelines:**
  - **Local DOM Search (Markup Search):** When searching locally within the DOM, always explicitly set `data-ln-search-debounce="0"` on the input to ensure instant filtering on keyup/input.
  - **Remote Search (API Search):** When searching via backend APIs (e.g., using `ln-data-store`, `ln-table` remote mode, or custom fetches), always use a debounce of `500` milliseconds (the standard default in `ln-search`) to throttle requests and protect the server.

## 5. UI/UX Confirmation & Gating Guidelines
- **Single-Element Actions (`ln-confirm`):** The `ln-confirm` component (in-place two-click confirmation) is strictly reserved for **single-element, low-impact actions** (e.g., deleting a single table row, archiving a single document). It must never be used for complex or high-risk actions. Prefers Two-Element Mode (`data-ln-confirm-idle`/`data-ln-confirm-active`) for HTML-first clarity.
- **Bulk Actions & High-Impact Operations (`ln-modal`):** For actions that affect multiple items simultaneously (e.g., bulk deleting selected tenants, batch status updates) or actions with major side effects, using in-place `ln-confirm` is strictly forbidden. Instead, a confirmation modal (`ln-modal`) MUST be shown. The modal must clearly list the affected resources, show the impact summary, and offer explicit, separate "Confirm" and "Cancel" buttons.

## 6. Global Restrictions
- **No Browser Checking**: Do not use the browser tool or spawn browser subagents to verify layouts, pages, or functional behaviors. Rely on manual verification instructions, code inspection, and project build verification instead.

## 7. MCP Review Workflow Rules
- **Always Asynchronous (`async: true`):** When invoking `review_plan` or `review_code` via MCP, **ALWAYS** pass `async: true`. Never invoke reviews synchronously, as deep evaluations take >60–90 seconds and will cause HTTP connection timeouts. Retrieve the critique and verdict via `get_review_result` using the returned `job_id`.


