---
name: component-authoring
classification: guide
status: draft
domain: frontend
summary: Tutorial on authoring reusable progressive JavaScript components in ln-ashlar.
source: js/COMPONENTS.md, docs/js/component-guide.md, docs/architecture/reference.md
tags: [component, authoring, developer, guide, js]
---

# 🛠️ JS Component Authoring Guide

## Summary

This guide provides a step-by-step tutorial on how to author custom, reusable JavaScript components within the `ln-ashlar` framework. It details IIFE encapsulation, the Attribute Bridge pattern, MutationObserver configurations, lifecycle events, templating structures, localization patterns, and resource teardown rules.

---

## 1. Component Skeleton and Encapsulation

Every component in `ln-ashlar` is structured as a self-initializing Immediately Invoked Function Expression (IIFE). This encapsulates private helpers, prevents global scope pollution, and allows tree-shaking of imports from [`ln-core`](../components/ln-core.md).

> [!IMPORTANT]
> **Custom Namespace Recommendation:** When authoring custom, project-specific components, it is highly recommended to use your own namespace prefix (e.g. `data-acme-*` and JavaScript `acmeName`) instead of the default core library prefix (`data-ln-*`). This prevents future naming collisions with core library updates and keeps the architecture clean.

### Non-Negotiable Naming Rules:
- **`DOM_SELECTOR`:** The functional data-attribute name, e.g., `'data-acme-awesome'`.
- **`DOM_ATTRIBUTE`:** The camelCased JavaScript key used as both the window constructor and the element's instance property, e.g., `'acmeAwesome'`.

### The Core Component Blueprint:
```javascript
import { registerComponent, dispatch, dispatchCancelable } from '../ln-core';

(function () {
    const DOM_SELECTOR = 'data-acme-awesome';
    const DOM_ATTRIBUTE = 'acmeAwesome';

    // 1. Guard against duplicate script loading
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    // 2. Private module-level state / pools (shared across all instances)
    const _instances = new Set();

    // 3. Constructor
    function _component(dom) {
        this.dom = dom;
        this.isOpen = false;
        
        _instances.add(this);
        this._init();
    }

    // 4. Initialization
    _component.prototype._init = function () {
        // Setup initial attributes and DOM bindings
    };

    // 5. Prototype Action (The Attribute Bridge Wrapper)
    _component.prototype.toggle = function () {
        const nextState = !this.isOpen ? 'open' : 'close';
        
        // Dispatches cancelable 'before' event
        const beforeEvent = dispatchCancelable(this.dom, 'acme-awesome:before-toggle', { state: nextState });
        if (beforeEvent.defaultPrevented) return;

        // WRITE: Update attribute. The observer will sync the actual state.
        this.dom.setAttribute(DOM_SELECTOR, nextState);
    };

    // 6. State Sync (Called by the MutationObserver registration)
    _component.prototype.sync = function () {
        const val = this.dom.getAttribute(DOM_SELECTOR);
        this.isOpen = (val === 'open');
        
        this.dom.classList.toggle('active', this.isOpen);

        // Dispatches notification event
        dispatch(this.dom, 'acme-awesome:toggle', { state: val });
    };

    // 7. Teardown Contract
    _component.prototype.destroy = function () {
        _instances.delete(this);
        // Remove event listeners, disconnect observers, etc.
        delete this.dom[DOM_ATTRIBUTE];
    };

    // 8. Register component with ln-core
    registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'acme-awesome', {
        extraAttributes: [],
        onAttributeChange: function (target) {
            if (target[DOM_ATTRIBUTE]) {
                target[DOM_ATTRIBUTE].sync();
            }
        }
    });
})();
```

---

## 2. The Attribute Bridge Pattern

In `ln-ashlar`, the DOM is the single source of truth. Direct, in-memory state manipulation inside public API methods is forbidden.

### The Rule:
- **Write to the DOM:** Prototype methods that mutate state must **only** modify HTML attributes (e.g. calling `setAttribute`).
- **Read from the DOM:** The `registerComponent` MutationObserver intercepts the attribute modification, invokes the `onAttributeChange` hook, which in turn calls the component's prototype `sync()` method to update internal properties (`this.isOpen`) and classes.

This ensures that mutating state programmatically via JS behaves identically to modifying elements directly in the browser's developer console.

---

## 3. Lifecycle Events Contract

To allow page coordinators and parent applications to intercept and react to component state changes, components must dispatch paired bubbling custom events:

1. **Before Events (Cancelable):** Emitted *before* a state transition occurs. Structured as `ln-{name}:before-{action}`. The event detail must contain the target state, and it must be cancelable:
   ```javascript
   const ev = dispatchCancelable(this.dom, 'ln-toggle:before-open');
   if (ev.defaultPrevented) return; // Abort transition
   ```
2. **After Events (Notification):** Emitted *after* the state transition has completed and classes have updated. Structured as `ln-{name}:{action}` (e.g., `ln-toggle:open`). These bubble but are not cancelable.

---

## 4. Cloned Templates and Declarative Data Fills

Components must never construct UI structures dynamically using strings (e.g. `innerHTML`) or `createElement` chains. All DOM configurations must be defined as authored `<template>` markup.

### Cloning Templates:
- Use `cloneTemplateScoped(root, name, tag)` to find a `<template data-ln-template="name">` element. This searches inside the local component element subtree first, before falling back to the global document scope, allowing developers to override layouts on specific instances.

### Filling Data:
- **`fillTemplate(fragment, data)`:** Replaces flat `{{ key }}` tokens inside text nodes and element attributes at clone time. Placeholders are consumed and will not update dynamically afterwards.
- **`fill(element, data)`:** Dynamically writes data values to elements containing reactive binding attributes (`data-ln-field`, `data-ln-attr`, `data-ln-show`, `data-ln-class`) at runtime. Use this inside list update functions.

---

## 5. Localization and the Dictionary Pattern

JavaScript files must not contain hardcoded user-facing display strings. All text and labels must reside in the HTML markup.

- Use **`buildDict(root, selector)`** to extract translation keys from a hidden list element:
  ```html
  <ul hidden>
      <li data-acme-awesome-dict="error">An error occurred</li>
  </ul>
  ```
  ```javascript
  const dict = buildDict(this.dom, 'data-acme-awesome-dict');
  const errorText = dict['error'] || 'Error';
  ```
- The helper parses the list once during initialization, returns a flat key-value mapping, and removes the list from the DOM.
- For dates, times, and numbers, leverage native browser `Intl` APIs (e.g. `Intl.NumberFormat`).

---

## 6. Shared Resource Pools

If multiple instances of a component share heavy resources (like timers or Web API connections), manage them as module-level variables inside the IIFE scope to prevent performance degradation:

- **Shared Intervals:** For polling or relative timestamp tickers, use a single shared `setInterval`. The interval is initialized when the first component mounts and is cleared when the last component is destroyed.
- **Orphan Guard:** Tickers must verify that target elements are still present in the document tree using `document.body.contains(instance.dom)`. If the element was removed (e.g. via an outer `innerHTML` rewrite) without calling `destroy()`, remove it from the pool.

---

## 7. The Teardown Contract (`destroy()`)

To safeguard against memory leaks, every component must clean up completely when `destroy()` is invoked:

- Remove the instance from any shared module-level pools or interval lists.
- Disconnect any internal observers (such as local MutationObservers).
- Remove **all** event listeners added by the instance (e.g. escape key listeners on `document`, click listeners on triggers, or global scroll bindings).
- Delete the DOM instance reference (`delete this.dom[DOM_ATTRIBUTE]`).

---

## Related Documents

- [JS Component Model doctrine](../doctrine/js-component-model.md)
- [HTML Markup Rules doctrine](../doctrine/html-markup-rules.md)
- [SCSS Architecture doctrine](../doctrine/scss-architecture.md)
- [Coordinator Authoring Guide](./coordinator-authoring.md)
