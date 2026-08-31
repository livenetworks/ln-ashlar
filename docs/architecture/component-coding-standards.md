# 🏛️ Component Authoring & Code Architecture Standards

> **Developer Reference Guide for `ln-ashlar` JavaScript Components**  
> This guide establishes the modern coding standard, architectural archetype, and design principles modeled after the reference implementation in [`ln-key`](../../components/ln-key/).

---

## 1. Overview & The Golden Archetype

Every JavaScript component in `ln-ashlar` must adhere to a strict **Two-Tier Component Architecture**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Component Directory                             │
│                                                                        │
│  ┌─────────────────────────────────┐   ┌─────────────────────────────┐ │
│  │    src/{component}-model.js     │   │      src/{component}.js     │ │
│  │   (Pure Domain & Logic Layer)   │   │   (DOM Shell & Lifecycle)   │ │
│  │                                 │   │                             │ │
│  │ • 100% Pure Functions           │◄──┤ • registerComponent         │ │
│  │ • String parsing & normalizing  │   │ • MutationObserver sync     │ │
│  │ • State transitions & math      │   │ • Lazy Event Hub (RefCount) │ │
│  │ • ZERO DOM / window / document  │   │ • ARIA & class toggles      │ │
│  │ • 100% Isolated Unit Tests      │   │ • CustomEvent dispatching   │ │
│  └─────────────────────────────────┘   └─────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Why this standard?
1. **Radical Readability & Low Cognitive Load:** Business rules are not lost inside DOM traversals or event listener callbacks.
2. **100% Isolated Testability:** You can test all parsing, normalization, edge-case math, and decision logic in Node.js or Vitest without heavy DOM mocks (`jsdom`).
3. **Zero Idle Overhead:** Event listeners are attached lazily to `document` when the first instance appears and removed when the last instance is destroyed (`Set` reference counting).
4. **Leak-Proof Lifecycles:** Simplified `destroy()` contracts eliminate lingering event listeners and memory leaks.

---

## 2. Tier 1: Pure Domain Model (`src/{component}-model.js`)

The `*-model.js` file is a collection of **pure, exported functions and static lookup tables**.

### Mandatory Rules for `*-model.js`:
- **NO DOM Mutations or Reads:** Never access `document`, `window`, `localStorage`, or mutate `HTMLElement` properties inside model functions.
- **Pure Input/Output:** Functions receive primitive values, arrays, or plain objects, and return computed results or booleans.
- **Predicates & Resolvers:** Normalization, tokenization, action inference, and browser capability predicates live here.

### Standard Model Skeleton:
```javascript
// src/example-model.js

export const CONFIG_DEFAULTS = {
    mode: 'auto',
    limit: 10
};

export const ALIAS_MAP = {
    esc: 'Escape',
    del: 'Delete'
};

/**
 * Normalizes input string or token list.
 */
export function normalizeValue(raw) {
    if (!raw) return '';
    return String(raw).trim().toLowerCase();
}

/**
 * Pure predicate to determine if an action should be triggered.
 */
export function shouldPerformAction(state, input) {
    if (!state || !input) return false;
    return state.active && normalizeValue(input) === state.target;
}

/**
 * Computes next state transition given current state and action.
 */
export function getNextState(current, action) {
    switch (action) {
        case 'open': return 'open';
        case 'close': return 'close';
        case 'toggle': return current === 'open' ? 'close' : 'open';
        default: return current;
    }
}
```

---

## 3. Tier 2: DOM Shell & Lifecycle (`src/{component}.js`)

The main component file handles DOM registration, observer syncing, lazy event listeners, ARIA properties, and event dispatches.

### Mandatory Rules for `src/{component}.js`:
1. **Lazy Singleton Listeners:** If listening to global events (like `keydown`, `click`, `pointermove`), use a shared `Set` of active instances and lazy listeners. Do **not** bind separate handlers in loops per element unless strictly isolated.
2. **Encapsulated Guard Clauses:** Use centralized guard predicates (e.g. `_isUsableTarget`) to check visibility, disabled states, and inertness before performing actions.
3. **Paired Lifecycle Events:**
   - Cancelable before event: `dispatchCancelable(el, 'ln-{name}:before-{action}', detail)`
   - Post-fact bubbling event: `dispatch(el, 'ln-{name}:{action}', detail)`
4. **Attribute as Single Source of Truth:** State changes write to DOM attributes (`setAttribute`), and `_syncAttribute` updates internal state.

### Standard Component Skeleton:
```javascript
// src/ln-example.js
import { dispatch, dispatchCancelable, isVisible, registerComponent } from '../../ln-core';
import { getNextState, normalizeValue, shouldPerformAction } from './example-model.js';

(function () {
    const DOM_SELECTOR = 'data-ln-example';
    const DOM_ATTRIBUTE = 'lnExample';
    const TARGET_ATTR = 'data-ln-example-target';

    if (window[DOM_ATTRIBUTE] !== undefined) return;

    // --- Lazy Event Hub (Shared across all instances) ---
    const instances = new Set();
    let globalClickListener = null;

    function _ensureClickListener() {
        if (globalClickListener) return;
        globalClickListener = function (event) {
            const trigger = event.target.closest('[' + DOM_SELECTOR + ']');
            if (!trigger) return;

            const instance = trigger[DOM_ATTRIBUTE];
            if (!instance || !_isUsableTarget(trigger)) return;

            event.preventDefault();
            instance.toggle();
        };
        document.addEventListener('click', globalClickListener);
    }

    function _maybeRemoveClickListener() {
        if (instances.size > 0 || !globalClickListener) return;
        document.removeEventListener('click', globalClickListener);
        globalClickListener = null;
    }

    function _isUsableTarget(target) {
        if (!target || !document.contains(target)) return false;
        if (target.disabled || target.getAttribute('aria-disabled') === 'true') return false;
        if (typeof target.closest === 'function' && target.closest('[inert]')) return false;
        return isVisible(target);
    }

    // --- Component Constructor ---
    function _component(dom) {
        this.dom = dom;
        this.state = normalizeValue(dom.getAttribute(DOM_SELECTOR)) || 'closed';

        instances.add(this);
        _ensureClickListener();

        return this;
    }

    // --- Prototype Methods ---
    _component.prototype.toggle = function () {
        const next = getNextState(this.state, 'toggle');
        this.dom.setAttribute(DOM_SELECTOR, next);
    };

    _component.prototype.destroy = function () {
        if (!this.dom[DOM_ATTRIBUTE]) return;

        instances.delete(this);
        delete this.dom[DOM_ATTRIBUTE];
        _maybeRemoveClickListener();

        dispatch(this.dom, 'ln-example:destroyed', { target: this.dom });
    };

    // --- Attribute Synchronizer (Single Source of Truth) ---
    function _syncAttribute(el) {
        const instance = el[DOM_ATTRIBUTE];
        if (!instance) return;

        const next = normalizeValue(el.getAttribute(DOM_SELECTOR));
        if (next === instance.state) return;

        const detail = { target: el, previousState: instance.state, nextState: next };
        const before = dispatchCancelable(el, 'ln-example:before-change', detail);
        if (before.defaultPrevented) {
            el.setAttribute(DOM_SELECTOR, instance.state);
            return;
        }

        instance.state = next;
        el.classList.toggle('open', next === 'open');
        el.setAttribute('aria-expanded', next === 'open' ? 'true' : 'false');
        dispatch(el, 'ln-example:change', detail);
    }

    // --- Registration ---
    registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-example', {
        onAttributeChange: _syncAttribute
    });
})();
```

---

## 4. Architectural Patterns & Comparisons

### Pattern A: Centralized Event Delegation vs. Per-Element Handler Arrays

```javascript
// ❌ BAD: Attaching handlers to every item and managing manual teardown arrays
function _initBad(dom) {
    this.items = Array.from(dom.querySelectorAll('.item'));
    this._handlers = [];
    for (const item of this.items) {
        const h = (e) => this.handle(item, e);
        item.addEventListener('click', h);
        this._handlers.push({ item, h });
    }
}
_badDestroy() {
    for (const { item, h } of this._handlers) {
        item.removeEventListener('click', h);
    }
}

// ✅ GOOD: Delegated listener on the host or Lazy Document Hub
function _initGood(dom) {
    this._onClick = (e) => {
        const item = e.target.closest('.item');
        if (item && this.dom.contains(item)) this.handle(item, e);
    };
    this.dom.addEventListener('click', this._onClick);
}
_goodDestroy() {
    this.dom.removeEventListener('click', this._onClick);
}
```

### Pattern B: Isolated Guard Predicates vs. Scattered Defensive Checks

```javascript
// ❌ BAD: Inlined, repetitive, and incomplete checks scattered everywhere
if (btn.disabled || btn.getAttribute('aria-disabled') === 'true' || !isVisible(btn)) {
    return;
}

// ✅ GOOD: Reusable, clear predicate function
function _isUsableTarget(target, action = 'click') {
    if (!target || !document.contains(target)) return false;
    if (target.disabled || target.getAttribute('aria-disabled') === 'true') return false;
    if (typeof target.closest === 'function' && target.closest('[inert]')) return false;
    if (action && typeof target[action] !== 'function') return false;
    return isVisible(target);
}
```

### Pattern C: Polymorphic / Multi-Decorator Registration

When a component supports both a host element (`data-ln-xyz`) and proxy trigger elements (`data-ln-xyz-for` or `data-ln-xyz-target`), define separate light constructor functions that share the model and event hub:

```javascript
// Primary component
registerComponent('data-ln-search', 'lnSearch', _searchStateComponent, 'ln-search');

// Secondary control component (proxy input)
registerComponent('data-ln-search-for', 'lnSearchControl', _searchControlComponent, 'ln-search-control');
```

---

## 5. Developer Checklist for New and Refactored Components

Before marking a component as complete, verify:

- [ ] **Model Isolation:** All parsing, normalization, math, and filtering rules are in `src/{component}-model.js`.
- [ ] **No DOM in Model:** The model file has zero references to `window`, `document`, or `HTMLElement` properties.
- [ ] **Unit Tests:** `tests/{component}.test.js` exercises the model with 100% coverage.
- [ ] **Lazy Event Hub:** Global event listeners are reference-counted via `instances = new Set()` and cleaned up on zero instances.
- [ ] **Guard Predicates:** All user triggers check `_isUsableTarget` (or `isEditableEventTarget`) before execution.
- [ ] **Attribute Source of Truth:** State writes to DOM attributes; `_syncAttribute` reacts and dispatches paired cancelable events.
- [ ] **Zero Display Text:** Translatable text uses `<template>` or `buildDict()`; never hardcode user-facing strings in JS.
- [ ] **Safe `destroy()`:** Calling `el.lnComponent.destroy()` cleanly removes instances, observers, listeners, and properties.
