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
       │  ln-chart, ln-tabs,  │      │  isUsableTarget,            │
       │  ln-sortable,        │      │  isEditableTarget,          │
       │  ln-validate,        │      │  matching, progress, date,  │
       │  ln-date, ln-slug,   │      │  number...)                 │
       │  ln-upload,          │      │                             │
       │  ln-autosave,        │      │ (ln-search, ln-filter,      │
       │  ln-data-store)      │      │  ln-confirm, ln-toggle,     │
       │                      │      │  ln-accordion, ln-dropdown, │
       │                      │      │  ln-tooltip, ln-popover)    │
       └──────────────────────┘      └─────────────────────────────┘
```

### The Honest Model Boundary & Definition of Done (DoD)
* A **Model (`*-model.js`)** must be **deterministic, pure, and free of global dependencies**.
* **Zero Globals & Zero Side-Effects:** No access to `window`, `document`, or `localStorage`. Functions take inputs and return outputs.
* **No Speculative Code:** A function enters a model **only if the DOM shell or system already actively calls it** — never for hypothetical "might be needed" utilities.
* **The 2-Consumer Lifting Rule:** If a pure helper is consumed by 2 or more distinct components (e.g. `calculateProgress`, `parseDateInput`, `formatNumber`, `matchesSearchTokens`, `matchesFilterValues`), it is lifted to `ln-core` sub-modules (`progress.js`, `date.js`, `number.js`, `matching.js`, `compare.js`) to guarantee **0 sibling cross-component imports**.
* **Testing Value:** If a function merely wraps `a || b` or `Boolean(x)`, it does **not** belong in a separate model file. Model files exist to protect complex business and algorithmic logic against regressions.

---

## 2. Core Shared Primitives in `ln-core`

General browser event predicates, DOM guards, and domain primitives belong centrally in **`ln-core`** to eliminate duplication across components:

* **`shouldIgnoreClick(event)`**: Detects modifier keys (`Ctrl`, `Meta`, `Shift`, `Alt`) or non-primary mouse buttons (`button !== 0`).
* **`isTargetDisabled(element)`**: Checks `.disabled`, `aria-disabled="true"`, or `[inert]` ancestors.
* **`isUsableTarget(element, action)`**: Full predicate verifying connection, enablement, visibility (`isVisible`), and method support.
* **`isEditableTarget(element)`**: Detects if the target is an editable input, textarea, select, or `[contenteditable]` container.

---

## 3. Two-Tier Component Structure (For Domain-Heavy Components)

When a component meets the Pragmatic Model Principle (e.g. `ln-key`, `ln-validate`, `ln-date`, `ln-number`, `ln-chart`, `ln-tabs`, `ln-slug`), it is structured into two tiers:

```
components/ln-{name}/
├── src/
│   ├── {name}-model.js    <-- Pure domain logic & algorithms (Tested in tests/ln-{name}.test.js)
│   └── ln-{name}.js       <-- DOM shell (registerComponent, MutationObserver, events)
└── ln-{name}.js           <-- Compiled bundle
```

### Example: Domain Model (`src/key-model.js`)
```javascript
/**
 * Normalizes shortcut keys to canonical forms and sorts modifiers.
 * @param {string} raw
 * @returns {string}
 */
export function normalizeShortcut(raw) {
    if (!raw || typeof raw !== 'string') return '';
    const parts = raw.split('+').map(p => p.trim()).filter(Boolean);
    if (!parts.length) return '';
    // ... modifier sorting and key canonicalization ...
    return parts.join('+');
}

/**
 * Normalizes keyboard event to shortcut string descriptor.
 * @param {KeyboardEvent} event
 * @returns {string}
 */
export function eventToShortcut(event) {
    if (!event) return '';
    const key = canonicalKey(event.key);
    if (!key || MODIFIER_ORDER.indexOf(key) !== -1) return '';
    const parts = [];
    if (event.ctrlKey) parts.push('Ctrl');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');
    if (event.metaKey) parts.push('Meta');
    parts.push(key);
    return parts.join('+');
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
