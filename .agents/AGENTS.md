# ln-ashlar Project Rules

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
- **Component Isolation**: Components NEVER import or reference sibling components. Communication is 100% event-driven via CustomEvents (`{ bubbles: true }`) or attribute bridging by coordinators.

### C. Attribute Bridge Pattern (Single Source of Truth)
- Prototype methods that change state MUST ONLY call `setAttribute` (e.g. `this.dom.setAttribute('data-ln-toggle', 'open')`).
- `MutationObserver` detects attribute changes and triggers internal state synchronization (`_syncAttribute()`).
- **Forbidden ("Checkbox Hack")**: Using `<input type="checkbox">` for toggle state is strictly forbidden (breaks `MutationObserver`, teleportation, ARIA semantics, and encapsulation).

### D. HTML Template System & Zero JS Display Text
- **HTML-First DOM Structure**: Component DOM structures belong in `<template data-ln-template="...">` in HTML, cloned via `cloneTemplate()` and populated via `fill()`. Never build DOM trees via `createElement` chains in JS.
- **Zero Display Text in JS**: Hardcoded UI text/labels in JS are strictly forbidden. Translatable text lives in `<ul hidden><li data-{component}-dict="key">...</li></ul>` (read via `buildDict`) or relies on browser `Intl` APIs (`Intl.DateTimeFormat`, `Intl.NumberFormat`).

### E. Lifecycle Events & Detail Guards
- **Paired Events**: Components emit `ln-{name}:before-{action}` (cancelable) before state changes, and `ln-{name}:{action}` (post-fact, bubbling) after state changes.
- **Detail Guard Pattern**: Always check `e.detail && e.detail.prop` when listening to external events.

## 2. Codebase Integrity and Realistic Modeling
- **No Hallucinated Attributes/Components**: Never invent attributes or components that do not exist (e.g., `data-ln-action` or `ln-action`). Only reference actual components found in the `js/` directory (e.g., `ln-toggle`, `ln-modal`, `ln-table`, `ln-form`, `ln-validate`, `ln-data-store`, `ln-data-coordinator`).

## 3. Architecture Documentation Structure & Component Template
- All component documentation in `architecture_docs_draft/components/` MUST strictly follow the unified structure defined in [`../COMPONENT_DOCUMENTATION_TEMPLATE.md`](../COMPONENT_DOCUMENTATION_TEMPLATE.md).
- **Mandatory Section Headings**:
  1. `## 1. Заднинско дејство и одговорност`
  2. `## 2. Минимален HTML Маркап и Варијанти на Употреба`
  3. `## 3. Декларативен API Договор (Атрибути и Настани)`
  4. `## 4. CSS Стилизирање и Поведенски Концепт`
  5. `## 5. Пристапност (ARIA) и Чести Грешки`
  6. `## 6. Дијаграм на Текот и Животен Циклус` (Mermaid sequence diagram saved for the end of the doc)
  7. `## 7. Поврзани Компоненти` (For listing related components & coordinators)
- **Relative Links Requirement**: Always use relative paths for file links in component documentation (e.g. `../../js/ln-tooltip/src/ln-tooltip.js`, `./ln-confirm.md`), NEVER absolute `file:///` URLs.
- Lead documentation with user/developer usage examples; keep internal JS engine code dumps out of consumer docs.
- **Conciseness & Compactness**: Keep documentation lean, focused, and direct. Consolidate related HTML markup variants into compact code blocks, use clean concise API tables, and keep Mermaid sequence diagrams focused on high-level lifecycle flows (3-4 key participants max). Avoid multi-paragraph over-explanations.

## 4. Visual Layer vs. Functional Layer Separation & Search Rules
- **Separation of Concerns:** Clearly separate visual styling (HTML chrome/wrappers and CSS classes, e.g. `.search`, `.collapsible`) from functional JS triggers (`data-ln-*` attributes). Visual markup classes are recommended globally as design standards even if JS logic is absent.
- **Search Debounce Guidelines:**
  - **Local DOM Search (Markup Search):** When searching locally within the DOM, always explicitly set `data-ln-search-debounce="0"` on the input to ensure instant filtering on keyup/input.
  - **Remote Search (API Search):** When searching via backend APIs (e.g., using `ln-table` or custom fetches), always use a debounce of `150` milliseconds or higher to throttle requests and protect the server.

## 5. UI/UX Confirmation & Gating Guidelines
- **Single-Element Actions (`ln-confirm`):** The `ln-confirm` component (in-place two-click confirmation) is strictly reserved for **single-element, low-impact actions** (e.g., deleting a single table row, archiving a single document). It must never be used for complex or high-risk actions.
- **Bulk Actions & High-Impact Operations (`ln-modal`):** For actions that affect multiple items simultaneously (e.g., bulk deleting selected tenants, batch status updates) or actions with major side effects, using in-place `ln-confirm` is strictly forbidden. Instead, a confirmation modal (`ln-modal`) MUST be shown. The modal must clearly list the affected resources, show the impact summary, and offer explicit, separate "Confirm" and "Cancel" buttons.

