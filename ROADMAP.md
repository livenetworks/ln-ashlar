# ln-ashlar Project Roadmap & Session Backlog

> 📌 **Purpose:** Centralized, persistent planning document for upcoming development sessions. Tracks performance optimizations, planned components, and showcase demos.
> ⚖️ **Core Constraint:** Performance optimizations must never overcomplicate CSS architecture or compromise visual design invariants.

---

## 🚀 Track 1: Performance & Runtime Optimization (Zero CSS Complexity)

*Focus: Clean DOM, event throttling, microtask batching, and elimination of forced layouts without convoluted CSS selector hacks.*

- [x] **1.1. Eliminate Forced Synchronous Layouts (Layout Thrashing) in Demo Event Loggers**
  - **Context:** Several admin demos (`validate`, `forms`, `http`) invoked `pre.scrollTop = pre.scrollHeight` directly inside high-frequency event listeners (`ln-validate:valid`, `input`, `ajax`).
  - **Action:** Wrapped scroll offset updates in `requestAnimationFrame` across `demo/admin/src/pages/validate.html`, `forms.html`, and `http.html`.
  - **Benefit:** Eliminates immediate browser reflow during interactive typing without touching framework CSS.

- [x] **1.2. DOM Query Caching in `ln-validate`**
  - **Context:** On every single character input, `validate()` performed `dom.closest('.form-element')`, `parent.querySelector('[data-ln-validate-errors]')`, and `querySelectorAll('[data-ln-validate-error]')`.
  - **Action:** Implemented lazy cached resolution (`_getErrorItems`) storing parsed `{ el, key }` references; reused across `validate()`, `reset()`, and custom error triggers with clean teardown in `destroy()`.
  - **Benefit:** Eliminates repetitive DOM tree traversals and string lookups on high-frequency input strokes with zero CSS footprint.

- [ ] **1.3. State Transition Event Gating in `ln-validate`**
  - **Context:** `ln-validate:valid` and `ln-validate:invalid` currently dispatch on every keystroke, even if the validity state and active error set have not changed since the last character.
  - **Action:** Dispatch `ln-validate:valid` or `invalid` only on actual state transitions (valid ↔ invalid, or changes in active error keys), or provide a flag to avoid flooding the event bus.
  - **Benefit:** Reduces downstream listener executions and CPU wakeups.

- [ ] **1.4. Real-world Core Web Vitals (CWV) & INP Benchmarking**
  - **Context:** Synthetic headless latency benchmarks measure engine-level style recalculations under Puppeteer; real user interaction needs Interaction to Next Paint (INP) tracking.
  - **Action:** Run Chrome DevTools Performance traces on the admin dashboard to confirm INP remains strictly below the 50ms "Good" threshold.

---


## 🎨 Track 2: New Showcase Demos (Real-world Applications)

*Focus: Proving the complete Ashlar stack (CSS framework + JS components + reactive data layer) in authentic, realistic business scenarios.*

- [ ] **3.1. E-Commerce Catalog & Checkout Flow**
  - **Components highlighted:** `ln-filter`, `ln-search`, `ln-options`, `ln-data-store`, `ln-persist`, `ln-validate`, `ln-number`, `ln-confirm`.
  - **Scenario:** Product listing with multi-attribute filtering (facets, price range, categories), shopping cart persisted in IndexedDB, and multi-step checkout form with real-time validation and receipt generation.

- [ ] **3.2. SaaS Analytics & KPI Metrics Dashboard**
  - **Components highlighted:** `ln-chart`, `ln-date` (date range pickers), `ln-stat` (metric trends, counter animations), `ln-table` (virtual windowing), `ln-tabs`.
  - **Scenario:** Live financial/analytics overview with date presets (Today, 7D, 30D, YTD), trend indicators, and scheduled data polling.

- [ ] **3.3. Kanban Project Management Board**
  - **Components highlighted:** `ln-sortable`, `ln-api-queue`, `ln-modal`, `ln-dropdown`, `ln-tooltip`.
  - **Scenario:** Interactive task board (Backlog, In Progress, Code Review, Done) with drag-and-drop between columns, optimistic UI updates, and offline sync via `ln-api-queue`.

---

## 📋 Session Log & Status

| Session | Focus Area | Status | Key Deliverables |
|---|---|---|---|
| Oct 25, 2026 | v2.1.13 Release & SCSS Matching | Completed | Reduced negative `:not(:has())`, adopted CSS Logical Properties, 239/239 tests green |
| Current | Roadmap & Clean Optimization | Completed | ROADMAP.md created, eliminated demo log layout thrash, cached DOM error queries in ln-validate |
| Oct 30, 2026 | v2.2.0 Release & UI Refresh | Completed | Stefan's design as the default look, `relaxed` bundle, sticky + mobile-card tables, ln-table resize re-measure, 239/239 tests green |
