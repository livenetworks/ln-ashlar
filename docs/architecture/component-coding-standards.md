# 🏛️ Component Authoring & Code Architecture Standards

> **Developer Reference Guide for `ln-ashlar` JavaScript Components**  
> This guide establishes the pragmatic coding standards, model separation boundaries, and architectural patterns in `ln-ashlar`.

---

## 1. The Pragmatic Model Principle: When to Split

In `ln-ashlar`, the decision to extract a standalone `src/{component}-model.js` is governed by **algorithmic complexity and testability**, not dogmatic formality:

```
                 Does the component contain:
 • Complex string parsing / tokenization / normalization?
 • Mathematical / date / formatting calculations?
 • Non-trivial comparison / filtering / sorting algorithms?
 • Rich domain rules with edge cases that need unit tests?
                     /               \
                   YES                NO (Micro-behavior / DOM trigger)
                  /                     \
       ┌──────────────────────┐      ┌─────────────────────────────┐
       │ Extract *-model.js   │      │ Single File Component       │
       │ + 100% Unit Tests    │      │ Consumes ln-core helpers    │
       │                      │      │ (shouldIgnoreClick,         │
       │ (ln-key, ln-number,  │      │  isTargetDisabled,          │
       │  ln-chart, ln-search,│      │  isUsableTarget...)         │
       │  ln-sort, ln-filter, │      │                             │
       │  ln-validate,        │      │ (ln-confirm, ln-toggle,     │
       │  ln-date, ln-table,  │      │  ln-accordion, ln-dropdown, │
       │  ln-data-store)      │      │  ln-tooltip, ln-popover)    │
       └──────────────────────┘      └─────────────────────────────┘
```

### The Honest Model Boundary
* A **Model (`*-model.js`)** must be **deterministic, pure, and free of global dependencies**.
* **Zero Globals & Zero Side-Effects:** No access to `window`, `document`, or `localStorage`. Functions take inputs and return outputs.
* **Testing Value:** If a function merely wraps `a || b` or `Boolean(x)`, it does **not** belong in a separate model file. Model files exist to protect complex business and algorithmic logic against regressions.

---

## 2. Core Shared Primitives in `ln-core`

General browser event predicates and DOM guards belong centrally in **`ln-core`** to eliminate duplication across components:

* **`shouldIgnoreClick(event)`**: Detects modifier keys (`Ctrl`, `Meta`, `Shift`, `Alt`) or non-primary mouse buttons (`button !== 0`).
* **`isTargetDisabled(element)`**: Checks `.disabled`, `aria-disabled="true"`, or `[inert]` ancestors.
* **`isUsableTarget(element, action)`**: Full predicate verifying connection, enablement, visibility (`isVisible`), and method support.

---

## 3. Two-Tier Component Structure (For Domain-Heavy Components)

When a component meets the Pragmatic Model Principle (e.g. `ln-search`, `ln-filter`, `ln-sort`, `ln-validate`, `ln-key`), it is structured into two tiers:

```
components/ln-{name}/
├── src/
│   ├── {name}-model.js    <-- Pure domain logic & algorithms (Tested in tests/{name}.test.js)
│   └── ln-{name}.js       <-- DOM shell (registerComponent, MutationObserver, events)
└── ln-{name}.js           <-- Compiled bundle
```

### Example: Domain Model (`src/search-model.js`)
```javascript
/**
 * Normalizes a raw query string.
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeSearchTerm(value) {
    return String(value || '').trim().toLowerCase();
}

/**
 * Splits query into search tokens for AND-based substring matching.
 * @param {string} term
 * @returns {string[]}
 */
export function tokenizeSearchQuery(term) {
    if (!term) return [];
    return term.split(/\s+/).filter(Boolean);
}

/**
 * Evaluates whether text matches all search tokens.
 * @param {string} text
 * @param {string[]} tokens
 * @returns {boolean}
 */
export function matchesSearchTokens(text, tokens) {
    if (!tokens || tokens.length === 0) return true;
    if (!text) return false;
    for (let i = 0; i < tokens.length; i++) {
        if (text.indexOf(tokens[i]) === -1) return false;
    }
    return true;
}
```

---

## 4. Lifecycle & Event Contract Rules

1. **Cancelable `before-*` Events:**
   * Dispatch `dispatchCancelable(el, 'ln-{name}:before-{action}', detail)` **only when the state transition is logically cancelable** by an application coordinator.
   * Do not invent cancelable pre-events for actions where the browser must unconditionally proceed with a native default (e.g. final button clicks).

2. **Attribute as Single Source of Truth:**
   * Component state is written to DOM attributes (`setAttribute`), and `_syncAttribute` reacts to update visual/ARIA state and emit post-fact events.

3. **Zero Hardcoded Display Text in JS:**
   * User-facing text must come from `<template>` clones, `data-ln-*-dict` dictionaries via `buildDict()`, or browser `Intl` APIs. Never hardcode English labels into JS models or components.

4. **Clean, Leak-Proof `destroy()`:**
   * Teardown must remove any event listeners, clear instance references, and delete `el[DOM_ATTRIBUTE]`.
