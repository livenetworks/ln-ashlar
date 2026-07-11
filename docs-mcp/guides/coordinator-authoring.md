---
name: coordinator-authoring
classification: guide
status: draft
domain: frontend
summary: Tutorial on authoring project-specific coordinators (Mediators) to orchestrate data-flow and UI feedback in ln-ashlar.
source: js/COMPONENTS.md, docs/architecture/coordinator.md
tags: [coordinator, mediator, authoring, developer, guide]
---

# 🧭 Coordinator Authoring Guide

## Summary

This guide explains how to write custom project-level coordinators (Mediators) in `ln-ashlar`. It outlines the core responsibilities of a coordinator, details the command/query separation rules, defines component isolation guidelines, and walks through a complete implementation example.

---

## 1. What is a Coordinator?

In `ln-ashlar`, **simple components** (like `ln-toggle`, `ln-modal`, and `ln-validate`) are intentionally dumb and isolated. They manage only their own DOM state and accessibility properties and are completely unaware of other components on the page.

A **Coordinator** is a component or script that acts as the decoupled "brain" (the Mediator pattern). It coordinates layouts and data flow by bridging these simple components together. 

---

## 2. The Four Responsibilities of a Coordinator

A coordinator manages exactly four types of operations:

1. **UI Trigger ──> Request Event:** Captures user actions (e.g., clicking a button or submitting a custom control) and dispatches a request event targeting the appropriate component (e.g., `ln-store:request-create`).
2. **Form Handling:** Intercepts form submissions, serializes inputs using core helpers, handles optimistic state submissions, and manages server replies.
3. **Notification ──> UI Feedback:** Listens for component status changes (e.g. `ln-store:created`) and provides UI feedback (e.g. displaying success toast messages or closing modals).
4. **Bridge Component A ──> Component B:** Bridges states across different components (e.g. listening to a record selection event in a table and updating attributes to fill and open an edit form).

---

## 3. Command and Query Separation (CQS)

To prevent tight coupling between coordinators and components, coordinators must adhere to CQS rules:

- **Commands (Mutations):** A coordinator must **never** call state-mutation prototype methods directly (e.g. executing `sidebarEl.lnToggle.open()` is forbidden). It must instead dispatch custom request events (`ln-toggle:request-open`) or write attributes directly (`sidebarEl.setAttribute('data-ln-toggle', 'open')`).
- **Queries (Reading):** A coordinator is permitted to read public instance properties directly to inspect state (e.g. checking `if (sidebarEl.lnToggle.isOpen)`).

---

## 4. Component Isolation Rules

When writing a coordinator, follow these strict development guidelines:
- **No Imports:** A coordinator must never import or require the JavaScript files of the components it coordinates. Communication is 100% event-driven.
- **Local DOM Scoping:** Never query the global document (e.g. `document.querySelectorAll` is forbidden). Always scope selectors to the coordinator's local DOM subtree (e.g. `this.dom.querySelectorAll`) to ensure multiple instances of the coordinator can run concurrently on a single page without resource collisions.
- **Teardown Cleanup:** The `destroy()` method must cleanly remove all event listeners added to global surfaces (such as `window` or `document`) and delete the instance DOM references.

---

## 5. Normalizing Surfaces at the Open Boundary

Because panels, drawers, and modals persist in the DOM and are reused across different records, they accumulate residual states. 

Coordinators must reset and normalize reusable surfaces at the **open boundary** (before opening) rather than on close:
- **Clear lingures:** Execute a null-fill `window.lnCore.lnFill(modal, null)` to clear lingering inputs from prior records.
- **Mode Tracking:** Write the current mode directly to a DOM attribute (e.g. `modal.setAttribute('data-ln-modal-mode', 'edit')`).
- **Single Use:** Keep records inside JavaScript in a temporary variable and nullify them immediately after filling.

```javascript
// Inside the coordinator open handler
modalEl.addEventListener('ln-modal:before-open', function () {
    const record = pendingRecord;
    pendingRecord = null; // Consume once

    // Fans out: null -> resets forms and clears fields; record -> fills fields
    window.lnCore.lnFill(modalEl, record);
    modalEl.dataset.lnModalMode = record ? 'edit' : 'new';
});
```

---

## 6. Implementation Example: Multi-Step Wizard Coordinator

Coordinators are almost always project-specific mediators. Therefore, developers should use their own namespace or prefix (e.g. `data-acme-wizard` and `acmeWizard`) instead of the core library prefix `data-ln-wizard`.

Below is a complete, progressive ES component implementing a custom multi-step form wizard coordinator using a project-specific namespace:

```javascript
import { registerComponent, dispatch } from '../ln-core';

(function () {
    const DOM_SELECTOR = 'data-acme-wizard';
    const DOM_ATTRIBUTE = 'acmeWizard';

    if (window[DOM_ATTRIBUTE] !== undefined) return;

    function _coordinator(dom) {
        this.dom = dom;
        this.steps = Array.from(dom.querySelectorAll('[data-acme-wizard-step]'));
        this.prevBtn = dom.querySelector('[data-acme-wizard-action="prev"]');
        this.nextBtn = dom.querySelector('[data-acme-wizard-action="next"]');
        
        const self = this;

        // Event listener: intercept clicks inside this subtree only
        this._onControlClick = function (e) {
            const actionBtn = e.target.closest('[data-acme-wizard-action]');
            if (!actionBtn) return;

            const action = actionBtn.getAttribute('data-acme-wizard-action');
            const activeStep = parseInt(self.dom.getAttribute('data-acme-wizard-active-step')) || 1;
            const activeIndex = activeStep - 1;
            
            let nextIndex = activeIndex;
            if (action === 'next' && activeIndex < self.steps.length - 1) {
                nextIndex++;
            } else if (action === 'prev' && activeIndex > 0) {
                nextIndex--;
            }

            if (nextIndex !== activeIndex) {
                self.goToStep(nextIndex + 1);
            }
        };

        this.dom.addEventListener('click', this._onControlClick);
        this.syncControls();
    }

    // Coordinate transitions purely via attribute writes on child nodes
    _coordinator.prototype.goToStep = function (stepNumber) {
        const targetIndex = stepNumber - 1;
        if (targetIndex < 0 || targetIndex >= this.steps.length) return;

        // 1. Write state back to coordinator attribute
        this.dom.setAttribute('data-acme-wizard-active-step', stepNumber);

        // 2. Drive child primitives via attributes (open active, close others)
        this.steps.forEach((stepEl, idx) => {
            const shouldOpen = idx === targetIndex;
            stepEl.setAttribute('data-ln-toggle', shouldOpen ? 'open' : 'close');
        });

        this.syncControls();

        // 3. Notify parent application of page transition
        dispatch(this.dom, 'acme-wizard:change', { activeStep: stepNumber });
    };

    // Update controls state based on DOM attributes
    _coordinator.prototype.syncControls = function () {
        const activeStep = parseInt(this.dom.getAttribute('data-acme-wizard-active-step')) || 1;
        
        if (this.prevBtn) {
            this.prevBtn.disabled = (activeStep === 1);
        }
        if (this.nextBtn) {
            if (activeStep === this.steps.length) {
                this.nextBtn.textContent = 'Finish';
                this.nextBtn.setAttribute('data-acme-wizard-action', 'submit');
            } else {
                this.nextBtn.textContent = 'Next';
                this.nextBtn.setAttribute('data-acme-wizard-action', 'next');
            }
        }
    };

    _coordinator.prototype.destroy = function () {
        this.dom.removeEventListener('click', this._onControlClick);
        delete this.dom[DOM_ATTRIBUTE];
    };

    registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _coordinator, 'acme-wizard');
})();
```

---

## Related Documents

- [JS Component Model doctrine](../doctrine/js-component-model.md)
- [Data Layer doctrine](../doctrine/data-layer.md)
- [Component Authoring Guide](./component-authoring.md)
- [`ln-data-coordinator`](../components/ln-data-coordinator.md)
