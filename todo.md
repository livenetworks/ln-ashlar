# 📋 ln-ashlar Component Architecture & Domain Refactoring Roadmap

> **Multi-Agent Task Tracking & Coordination Document**  
> This file tracks the architectural alignment of all `ln-ashlar` components according to the **Pragmatic Complexity Principle** established in [`docs/architecture/component-coding-standards.md`](docs/architecture/component-coding-standards.md).

---

## 🎯 Architecture Decision Matrix: Model vs Single-File

| Component Category | Architecture | Description |
|---|---|---|
| **Category A: Domain Logic Components** | **Two-Tier Model** (`src/{name}-model.js` + `src/ln-{name}.js` + `tests/{name}.test.js`) | Components with non-trivial string parsing, tokenization, sorting/filtering algorithms, math formulas, or validation rules that require isolated unit testing. |
| **Category B: Behavioral Micro-Components** | **Single-File DOM Component** (`src/ln-{name}.js`) | Micro-components and DOM triggers that manage native elements, popovers, or classes. They rely directly on shared primitives from `ln-core` (`shouldIgnoreClick`, `isTargetDisabled`, `isUsableTarget`, `computePlacement`). |
| **Category C: Coordinators & Infrastructure** | **Mediators & Primitives** (Layer 2 & Layer 3) | Low-level network connectors, global UI mediators, and `ln-core` utilities. |

---

## 🟢 Category A: Domain Logic Components (Two-Tier Model)

### ✅ Gold Standard Reference (100% Complete)
- [x] **`ln-key`** — `components/ln-key/src/key-model.js` + `components/ln-key/src/ln-key.js` + `tests/ln-key.test.js`
  - *Status:* Reference implementation. Pure domain model + lean, declarative DOM shell.

---

### 🔄 Modernization of Existing Models (DOM Shell Alignment)
- [ ] **`ln-number`** *(Model exists, DOM shell needs modernization)*
  - **Files:** `components/ln-number/src/number-model.js` + `components/ln-number/src/ln-number.js`
  - **Scope:** Clean up 395-line DOM shell: remove redundant registration boilerplate, decouple text vs input paths, modernize global locale subscription.
- [ ] **`ln-chart`** *(Model exists, DOM shell needs modernization)*
  - **Files:** `components/ln-chart/src/chart-model.js` + `components/ln-chart/src/ln-chart.js`
  - **Scope:** Move leftover helpers (`parseSort`, `formatNumber`) from `ln-chart.js` into `chart-model.js` / `ln-core`, add `onAttributeChange` observer for dynamic chart attributes.

---

### 🚀 Priority 1: Search, Filter & Sort Engines
- [x] **`ln-search`**
  - **Model:** `components/ln-search/src/search-model.js`
  - **Tests:** `tests/ln-search.test.js`
  - **Domain Logic:** Search term normalization, multi-token AND matching, field selector parsing, exclude-tree text extraction.
- [x] **`ln-filter`**
  - **Model:** `components/ln-filter/src/filter-model.js`
  - **Tests:** `tests/ln-filter.test.js`
  - **Domain Logic:** Active filter derivation, array comparison diffing, multi-value AND/OR matching, URL hash codec integration.
- [x] **`ln-sort`**
  - **Model:** `components/ln-sort/src/sort-model.js`
  - **Tests:** `tests/ln-sort.test.js`
  - **Domain Logic:** 3-state direction cycling (`asc` → `desc` → `none`), multi-column comparator chain generator, type-aware value comparison (`detectValueType`, `compareValues`).

---

### 🚀 Priority 2: Validation, Data & Persistence
- [x] **`ln-validate`**
  - **Model:** `components/ln-validate/src/validate-model.js`
  - **Tests:** `tests/ln-validate.test.js`
  - **Domain Logic:** HTML5 validity state mapping (`valueMissing`, `typeMismatch`, `patternMismatch`), error list item resolution, custom error state registry, form validity aggregation.
- [x] **`ln-data-store`**
  - **Model:** `components/ln-data-store/src/data-store-model.js`
  - **Tests:** `tests/ln-data-store.test.js`
  - **Domain Logic:** In-memory record CRUD mutations, primary key indexing, query filtering predicate engine, pagination window slicing.
- [x] **`ln-table`**
  - **Model:** `components/ln-table/src/table-model.js`
  - **Tests:** `tests/ln-table.test.js`
  - **Domain Logic:** Column metadata parsing, row selection state math, pagination offset/limit calculations, virtual scrolling window math.
- [x] **`ln-autosave`**
  - **Model:** `components/ln-autosave/src/autosave-model.js`
  - **Tests:** `tests/ln-autosave.test.js`
  - **Domain Logic:** Deterministic path-scoped storage key generation, debounce interval parsing and sanitization.
- [x] **`ln-upload`**
  - **Model:** `components/ln-upload/src/upload-model.js`
  - **Tests:** `tests/ln-upload.test.js`
  - **Domain Logic:** File size/mime-type validation rules, extension extraction, human-readable byte formatting.

---

### 🚀 Priority 3: Formatting & Text Utilities
- [ ] **`ln-date` / `ln-time`**
  - **Model:** `components/ln-time/src/time-model.js`
  - **Tests:** `tests/ln-time.test.js`
  - **Domain Logic:** ISO timestamp parsing, relative time duration math, formatting options resolution, format cache key derivation.
- [ ] **`ln-slug`**
  - **Model:** `components/ln-slug/src/slug-model.js`
  - **Tests:** `tests/ln-slug.test.js`
  - **Domain Logic:** Unicode normalization, transliteration / diacritic stripping, separator collapsing, URL-safe slug generation.
- [ ] **`ln-tabs`**
  - **Model:** `components/ln-tabs/src/tabs-model.js`
  - **Tests:** `tests/ln-tabs.test.js`
  - **Domain Logic:** Trigger key derivation (`data-ln-tab` vs `<a href="#ns:key">`), URL hash fragment extraction, panel key mapping.
- [ ] **`ln-stat`**
  - **Model:** `components/ln-stat/src/stat-model.js`
  - **Tests:** `tests/ln-stat.test.js`
  - **Domain Logic:** Numeric diffing, percentage change formulas, trend direction formatting (`up`/`down`/`neutral`).
- [ ] **`ln-progress` / `ln-circular-progress`**
  - **Model:** `components/ln-progress/src/progress-model.js`
  - **Tests:** `tests/ln-progress.test.js`
  - **Domain Logic:** Value clamping (`min`/`max`), percentage calculation, SVG stroke-dasharray & stroke-dashoffset math.

---

## 🟡 Category B: Behavioral Micro-Components (Single-File, No Fake Model)

These components manage DOM state directly using `ln-core` shared helpers (`shouldIgnoreClick`, `isTargetDisabled`, `isUsableTarget`, `computePlacement`). They do **not** need a separate model file:

- [x] **`ln-confirm`** — Two-click in-place confirmation button decorator (uses `shouldIgnoreClick` from `ln-core`).
- [x] **`ln-toggle`** — Simple panel/state toggle (uses `isTargetDisabled` & `shouldIgnoreClick` from `ln-core`).
- [ ] **`ln-accordion`** — Expand/collapse panel disclosure coordinator.
- [ ] **`ln-dropdown`** — Dropdown menu trigger using Popover API.
- [ ] **`ln-popover`** — Declarative anchored popover using `computePlacement`.
- [ ] **`ln-tooltip`** — Tooltip enhancement with title stashing and `computePlacement`.
- [ ] **`ln-modal`** — Native `<dialog>` modal wrapper with autofocus management.
- [ ] **`ln-nav`** — Navigation active item syncing and scroll spy.
- [ ] **`ln-link` / `ln-external-links`** — Anchor enhancement and external link decorator.
- [ ] **`ln-toast`** — Global notification toast queue renderer.
- [ ] **`ln-sortable`** — Drag-and-drop list item reordering.
- [ ] **`ln-autoresize`** — Textarea automatic height adjustment.
- [ ] **`ln-translations`** — Dictionary element extractor.
- [ ] **`ln-router`** — Client-side route hash synchronizer.
- [ ] **`ln-form`** — Form submission gate and serialization coordinator.
- [ ] **`ln-list`** — Template-based list renderer.
- [ ] **`ln-options`** — Dynamic select option population from store records.

---

## 🔵 Category C: Coordinators & Infrastructure (Layers 2 & 3)

- **`ln-core`** — Low-level primitives (`fill`, `buildDict`, `shouldIgnoreClick`, `isTargetDisabled`, `isUsableTarget`, `computePlacement`, `hash`, `persist`, `crypto`).
- **`ln-data-coordinator`** — Layer 2 data mutation and write pipeline mediator.
- **`ln-table-coordinator`** — Layer 2 table action mediator.
- **`ln-ui-coordinator`** — Window-level UI service mediator (modal routing, global toast bridge).
- **`ln-http` / `ln-ajax` / `ln-api-connector` / `ln-api-queue` / `ln-couchdb-connector`** — Network primitives.
- **`ln-debug` / `ln-fill`** — Developer diagnostics & DOM filling.
