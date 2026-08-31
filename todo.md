# 📋 ln-ashlar Domain Model Refactoring Roadmap

> **Multi-Agent Task Tracking Document**  
> This file tracks the refactoring of complex `ln-ashlar` components to the **Two-Tier Isolated Domain Model** standard.  
> 📖 **Specification & Criteria:** [`docs/architecture/component-coding-standards.md`](docs/architecture/component-coding-standards.md)

---

## 🎯 The Pragmatic Rule: Which Components Get a Model?

* **YES (`src/{name}-model.js` + `tests/{name}.test.js`):** Components with non-trivial domain logic, string parsing, tokenization, sorting/filtering algorithms, math formulas, or validation rules that benefit from 100% isolated unit testing.
* **NO (Single-File DOM Component):** Micro-components and behavioral triggers (`ln-confirm`, `ln-accordion`, `ln-dropdown`, `ln-popover`, `ln-tooltip`, `ln-modal`) rely directly on shared `ln-core` primitives (`shouldIgnoreClick`, `isTargetDisabled`, `isUsableTarget`, `computePlacement`).

---

## ✅ Reference Implementations (Complete)

- [x] **`ln-key`** — `components/ln-key/src/key-model.js` + `tests/ln-key.test.js` (shortcut normalization, key aliases, event mapping)
- [x] **`ln-number`** — `components/ln-number/src/number-model.js` + `tests/ln-number.test.js` (locale-aware parsing, formatting, cursor calculation)
- [x] **`ln-chart`** — `components/ln-chart/src/chart-model.js` + `tests/chart-model.test.js` (SVG path generation, coordinate math, value scales)
- [x] **`ln-toggle`** — `components/ln-toggle/src/toggle-model.js` + `tests/ln-toggle.test.js` (state normalization, next state transitions)

---

## 🚀 Active Roadmap: Complex Domain Components to Refactor

### Priority 1: Search, Filter & Sort Engines
- [ ] **`ln-search`**
  - Model: `components/ln-search/src/search-model.js`
  - Tests: `tests/ln-search.test.js`
  - Scope: Query tokenization, multi-word AND matching, field extraction, exclude-subtree filtering logic.
- [ ] **`ln-filter`**
  - Model: `components/ln-filter/src/filter-model.js`
  - Tests: `tests/ln-filter.test.js`
  - Scope: Active filter derivation, array comparison (`_arraysDiffer`), AND/OR matching logic, URL hash codec integration.
- [ ] **`ln-sort`**
  - Model: `components/ln-sort/src/sort-model.js`
  - Tests: `tests/ln-sort.test.js`
  - Scope: Direction cycling (`asc`/`desc`/`none`), comparator generation, type-aware value comparison, multi-sort state.

### Priority 2: Validation, Data & Persistence
- [ ] **`ln-validate`**
  - Model: `components/ln-validate/src/validate-model.js`
  - Tests: `tests/ln-validate.test.js`
  - Scope: Constraint validation mappings, error key resolution, custom error state registry, validation aggregation.
- [ ] **`ln-data-store`**
  - Model: `components/ln-data-store/src/data-store-model.js`
  - Tests: `tests/ln-data-store.test.js`
  - Scope: In-memory CRUD mutations, indexing, query filtering engine, pagination slicing.
- [ ] **`ln-table`**
  - Model: `components/ln-table/src/table-model.js`
  - Tests: `tests/ln-table.test.js`
  - Scope: Column metadata parsing, selection state, pagination slicing math, sort/filter integration.

### Priority 3: Formatting & Text Utilities
- [ ] **`ln-date` / `ln-time`**
  - Model: `components/ln-time/src/time-model.js`
  - Tests: `tests/ln-time.test.js`
  - Scope: ISO timestamp parsing, relative time duration math, format cache key derivation.
- [ ] **`ln-slug`**
  - Model: `components/ln-slug/src/slug-model.js`
  - Tests: `tests/ln-slug.test.js`
  - Scope: Unicode normalization, diacritic stripping, separator collapsing, URL-safe slug generation.
- [ ] **`ln-tabs`**
  - Model: `components/ln-tabs/src/tabs-model.js`
  - Tests: `tests/ln-tabs.test.js`
  - Scope: Trigger key derivation (`data-ln-tab` vs `<a href="#ns:key">`), URL hash fragment extraction, panel key mapping.
