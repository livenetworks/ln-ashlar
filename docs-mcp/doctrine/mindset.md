---
name: mindset
classification: doctrine
status: draft
domain: frontend
summary: Operational and strategic mindset of ln-ashlar - DOM-first architecture, performance, security, and longevity.
source: docs/architecture/mindset.md, docs/architecture/philosophy.md
tags: [doctrine, mindset, DOM-first, performance, security]
---

# 🧠 Operational and Strategic Mindset

## Summary

This document defines the core philosophy and operational principles of `ln-ashlar`. It outlines why the library employs a **DOM-First (client-side decentralized but server-side rendered)** model, compares IndexedDB caching against typical SPA loading patterns, examines framework longevity and dependency security, and detail eleven core authoring principles that govern the library's behavior.

---

## 1. Architectural Philosophy: The Progressive DOM-First Model

### Computing Cycles and the Pendulum of Architecture
Historically, computing architectures swing between centralized server processing and distributed client processing:
1. **Centralized (Mainframe):** Dumb terminals displaying output; all processing on a central mainframe.
2. **Distributed (Fat Client):** Computational power shifts to local desktop applications.
3. **Centralized (Early Web):** Server-side HTML generation; the browser simply paints the markup.
4. **Distributed (Single-Page Apps - SPA):** Frameworks (React, Vue, Angular) ship massive JS bundles to construct the entire UI in browser memory at runtime.
5. **Progressive / DOM-First (ln-ashlar):** The server renders complete, structured semantic HTML. Lightweight client-side scripts progressively enhance and enliven it, using the browser's native DOM as the single source of truth.

### The Virtual DOM Myth vs. Web Standards
Browsers natively understand HTML DOM, not Virtual DOM. Heavy frameworks download megabytes of JS, run runtime diffing, and construct a Virtual DOM in memory, only to inject it into the real DOM. 

`ln-ashlar` bypasses this overhead. Ready-to-render HTML is delivered directly from the backend, rendering instantly (First Contentful Paint) while native progressive components take over and activate behavior in milliseconds.

---

## 2. Performance: Caching over API Waterfalls

In typical SPAs, the user interface experiences network latency because pages depend on a waterfall of asynchronous API requests (menus, profiles, settings, tables, statistics). Skeletons and gray loading states are not design features; they are cosmetic workarounds for application architectures that lack a local cache.

`ln-ashlar` solves this via:
- **Instant FCP:** Complete HTML delivered on initial load.
- **IndexedDB as Local Cache:** Data queries execute instantly against the local browser database. The UI updates in milliseconds without loading screens, while delta-synchronization runs asynchronously in the background.

---

## 3. Stability, Longevity, and Security

### The Framework Obsolescence Trap
Mainstream JavaScript frameworks suffer from short lifecycles and frequent breaking upgrades:
- **Angular:** End-Of-Life (EOL) cycles every 6 months; migrations (like AngularJS to Angular 2+) require complete rewrites.
- **React:** Shifted paradigms multiple times (Class Components → Hooks → Server Components), forcing continuous refactoring.
- **Vue & Next.js:** Vue 2 EOL forced migrations due to ecosystem incompatibilities; Next.js router and Server Actions caused widespread deprecations.

`ln-ashlar` relies strictly on **permanent W3C web standards** (native HTML attributes, `CustomEvent` interfaces, `MutationObserver`). These specifications guarantee that written code runs securely and natively for decades without forced refactorings.

### NPM Supply Chain Security
Modern JS apps pull hundreds to thousands of transitive packages into `node_modules`. This creates massive vulnerability surfaces:
- **Hijacked Packages:** Incidents like `event-stream`, `ua-parser-js`, and `coa` injected malware directly into developer environments via minor version updates.
- **Unpatched Dependencies:** Hobbyist packages frequently suffer from unpatched CVEs.

`ln-ashlar` enforces a strict **zero-dependency** runtime policy, relying entirely on clean, custom-built native JavaScript.

---

## 4. Eleven Core Operational Doctrines

Contributors and AI agents must adhere to the following eleven operational principles:

### 1. Markup Is the Application
The HTML structure is authored, complete, and semantic. JavaScript never dynamically constructs visual chrome (e.g., navigation panels, modal wrappers, dropdown list options). The `<template>` tag is used solely for data-driven list/row repetition, not for building UI shell structures.

### 2. SSR and SPA Share Identical Markup
The same HTML structure is used whether pages are server-rendered (e.g., Laravel Blade templates) or data-driven. The structure remains identical; only the data-binding source differs. This ensures zero hydration mismatch and progressive enhancement out of the box.

### 3. Behavior Is Attached, Not Owned
Components are self-initializing IIFE modules that attach behavior via `data-ln-*` attributes. They monitor changes using `MutationObserver` and communicate globally via `CustomEvent` flows addressed by target element IDs. Components are completely decoupled from their position in the DOM tree, so behavior never depends on where an element happens to live in the markup.

### 4. CSS Owns All Presentation and State
JavaScript toggles state classes (`.ln-state-name`) or semantic attributes, while CSS manages visual changes. JavaScript must never write inline styles for visual states. `data-ln-*` attributes are strictly for behavioral configuration, not CSS selection.

### 5. Composition Over Features
Features are composed by nesting and wiring distinct, decoupled components together rather than building monolithic components. For example, a filterable list uses `ln-popover` + `ln-search` + `ln-filter` + `ln-list`. Components remain simple and communicate via custom events rather than direct API calls.

### 6. Domain Truth Lives at the Source
Filter options are defined by the backend domain model (e.g., database lookup, enum), not dynamically derived from the currently visible page dataset. Deriving options from visible rows breaks under pagination and hides valid options that happen to have zero items in the current page window.

### 7. Raw vs. Formatted Values
Sorting, filtering, and validation read raw, machine-readable values from `data-ln-value` or `data-ln-filter-value` attributes. The text content (`textContent`) is reserved purely for visual rendering and presentation formatting (e.g., currency symbols, relative dates).

### 8. Core Owns Standard Layout Compositions
The library must support standard UI layouts out of the box. Projects must not write custom, local SCSS overrides to fix missing layout styles. If a common composition requires a custom CSS patch in a consumer project, the layout styling belongs in the core library.

### 9. Lean JS (CSS affordances over Console Warnings)
Developer configuration errors (e.g., missing target IDs) should be flagged using CSS `::after` content rules visible only in development mode. Avoid bloating JavaScript files with defensive checks and console statements.

### 10. Declarative Wiring Over Coordinators
Actions triggered directly by user clicks (e.g., clicking edit to open and fill a modal) should be defined declaratively in HTML attributes:
- Use `data-ln-modal-for="id"` to open.
- Use `data-ln-fill-form="form-id"` and `data-ln-fill-*` to bind data.

JavaScript controllers (Coordinators) are reserved for non-declarative actions, such as handling conflicts, offline synch, and deep-linking.

### 11. Templates Are Authored Markup
The library never dynamically generates or injects default templates as raw JS strings. Every `<template>` is explicitly written in the HTML markup. If a component (e.g., [`ln-toast`](../components/ln-toast.md)) clones a template, the container or page must declare it. A missing template fails loudly in development mode.
