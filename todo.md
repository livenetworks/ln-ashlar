# 📋 ln-ashlar Component Refactoring Roadmap (Two-Tier Model Archetype)

> **Multi-Agent Task Tracking Document**  
> This file coordinates the refactoring of all `ln-ashlar` components to the **Two-Tier Isolated Domain Model & Lazy Lifecycle** standard established by `ln-key`.  
> 📖 **Specification & Standards:** [`docs/architecture/component-coding-standards.md`](docs/architecture/component-coding-standards.md)

---

## 🎯 Definition of Done (DoD) per Component

When refactoring a component, ensure:
1. **`src/{name}-model.js`:** Pure functions only (string parsing, tokenizing, math, normalization, predicates). **Zero DOM / window / document dependencies**.
2. **`src/ln-{name}.js`:** Lightweight DOM shell, `registerComponent`, `instances = new Set()` for global listeners, event delegation (no per-element listener arrays).
3. **Guard Clauses:** Centralized `_isUsableTarget` or `isEditableEventTarget` checks.
4. **Lifecycle Events:** Paired cancelable `ln-{name}:before-{action}` and post-fact `ln-{name}:{action}`.
5. **Zero Display Text:** Uses `<template>` or `buildDict()`; no hardcoded user strings in JS.
6. **Tests:** Dedicated unit tests for `*-model.js` in `tests/{name}.test.js`.
7. **Clean `destroy()`:** Clean teardown in 3–5 lines without memory leaks.

---

## 🟢 Phase 1: Primitive & Micro-Components (Start Here)

- [ ] **`ln-toggle`** *(Refinement)*
  - Model: `components/ln-toggle/src/toggle-model.js` *(exists)*
  - Scope: Refactor global click listener to lazy listener pattern (`_ensureClickListener`/`_maybeRemoveClickListener`), clean instance Set tracking, verify unit tests.
- [ ] **`ln-confirm`**
  - Model: `components/ln-confirm/src/confirm-model.js`
  - Scope: Extract single vs two-element mode detection, timeout parsing, icon swapping predicates into pure model. Unit test suite.
- [ ] **`ln-accordion`**
  - Model: `components/ln-accordion/src/accordion-model.js`
  - Scope: Multi vs single expansion rules, target resolving, panel state derivations. Unit test suite.
- [ ] **`ln-tooltip`**
  - Model: `components/ln-tooltip/src/tooltip-model.js`
  - Scope: Positioning math, title stashing/restoration logic, placement attribute resolvers. Unit test suite.
- [ ] **`ln-dropdown`**
  - Model: `components/ln-dropdown/src/dropdown-model.js`
  - Scope: Toggle state, outside-click detection predicate, keyboard item traversal. Unit test suite.
- [ ] **`ln-popover`**
  - Model: `components/ln-popover/src/popover-model.js`
  - Scope: Position placement math, trigger binding resolution, dismiss guards. Unit test suite.
- [ ] **`ln-modal`**
  - Model: `components/ln-modal/src/modal-model.js`
  - Scope: Dialog open/close state transitions, ESC stack handling, focus target placement logic. Unit test suite.

---

## 🟡 Phase 2: Interactive UI & Navigation Components

- [ ] **`ln-tabs`**
  - Model: `components/ln-tabs/src/tabs-model.js`
  - Scope: URL hash parsing, tab-to-panel key derivation, replace `_clickHandlers` loop with container event delegation.
- [ ] **`ln-search`**
  - Model: `components/ln-search/src/search-model.js`
  - Scope: Query tokenization, AND substring filtering, field parser, extract clear button resolver.
- [ ] **`ln-filter`**
  - Model: `components/ln-filter/src/filter-model.js`
  - Scope: Active filter derivation, `_arraysDiffer`, hash filter encode/decode, plain table column filter logic.
- [ ] **`ln-sort`**
  - Model: `components/ln-sort/src/sort-model.js`
  - Scope: Direction cycling (`asc`/`desc`/`none`), comparator builders, hash sort encode/decode.
- [ ] **`ln-validate`**
  - Model: `components/ln-validate/src/validate-model.js`
  - Scope: Constraint validation mappings, error list resolution, custom error state handling.

---

## 🟠 Phase 3: Data, Forms & Persistence

- [ ] **`ln-table`**
  - Model: `components/ln-table/src/table-model.js`
  - Scope: Column metadata parsing, row selection state, pagination calculations, sort/filter integration.
- [ ] **`ln-options`**
  - Model: `components/ln-options/src/options-model.js`
  - Scope: Option value extraction, multi/single select state, keyboard arrow index navigation.
- [ ] **`ln-data-store`**
  - Model: `components/ln-data-store/src/data-store-model.js`
  - Scope: In-memory CRUD mutations, indexing, query filtering engine.
- [ ] **`ln-form`**
  - Model: `components/ln-form/src/form-model.js`
  - Scope: Form data serialization, method resolution, dirty state tracking.
- [ ] **`ln-autosave`**
  - Model: `components/ln-autosave/src/autosave-model.js`
  - Scope: Dirty comparison diffing, debounce timer orchestration, payload formatting.
- [ ] **`ln-upload`**
  - Model: `components/ln-upload/src/upload-model.js`
  - Scope: File size/mime validation, dropzone state transitions, upload queue math.
- [ ] **`ln-list`**
  - Model: `components/ln-list/src/list-model.js`
  - Scope: Item template rendering orchestration, data binding extraction.

---

## 🔵 Phase 4: Formatting, Numbers & Utilities

- [x] **`ln-key`** *(Reference Standard - Complete)*
  - Model: `components/ln-key/src/key-model.js`
- [x] **`ln-number`** *(Complete)*
  - Model: `components/ln-number/src/number-model.js`
- [x] **`ln-chart`** *(Complete)*
  - Model: `components/ln-chart/src/chart-model.js`
- [ ] **`ln-date` / `ln-time`**
  - Model: `components/ln-time/src/time-model.js`
  - Scope: ISO timestamp parsing, relative time math, `Intl` formatter key caching.
- [ ] **`ln-stat`**
  - Model: `components/ln-stat/src/stat-model.js`
  - Scope: Numeric diffing, percentage change formulas, trend direction formatting.
- [ ] **`ln-progress` / `ln-circular-progress`**
  - Model: `components/ln-progress/src/progress-model.js`
  - Scope: Value clamping (`min`/`max`), stroke-dasharray SVG math, percentage calculation.
- [ ] **`ln-slug` / `ln-autoresize`**
  - Model: `components/ln-slug/src/slug-model.js`
  - Scope: String slugification, unicode normalization, textarea line height math.
- [ ] **`ln-toast`**
  - Model: `components/ln-toast/src/toast-model.js`
  - Scope: Toast queue stack, auto-dismiss timeout management, deduplication.
- [ ] **`ln-nav` / `ln-link` / `ln-external-links` / `ln-router` / `ln-sortable`**
  - Scope: Utility model separation and lightweight shell bindings.
