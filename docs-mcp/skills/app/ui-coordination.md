---
name: ui-coordination
classification: skill
status: draft
domain: frontend
summary: Decision rules for when and how an AI agent should introduce a project-level coordinator vs simple component binding or data store.
tags: [ui, architecture, coordinator, mediator, cqs, isolation]
---

# 🧭 Architectural Coordination Rules

## Summary

This skill governs WHEN and HOW an AI agent should introduce a project-level Coordinator (Mediator). Consult it when deciding whether a user interface interaction requires a custom project-level coordinator script or if simple component bindings and declarative attributes are sufficient.

> For component selection and layout decisions → [`./ui.md`](./ui.md)  
> For interaction feedback strategies → [`./ux.md`](./ux.md)

---

## 1. When to Introduce a Coordinator

A Coordinator acts as the decoupled "brain" (the Mediator pattern) that orchestrates complex UI interactions across independent components.

### Decision Matrix

| Scenario | Architectural Pattern | Rationale |
|---|---|---|
| Single isolated element (e.g. toggle dropdown, simple accordion, field validation) | **Simple Component** | Self-contained state; no external side-effects or multi-component choreography needed. |
| Single form submitting to an endpoint with toast feedback | **Form + Store / Service** | Standard form lifecycle handles submission directly without custom coordination logic. |
| Table selection updates a detail form, which opens a modal and updates a stat badge upon response | **Coordinator (Mediator)** | Cross-component choreography where Component A triggers state changes in Components B, C, and D. |
| Multi-step wizard or stepper with dynamic validation and branching steps | **Coordinator (Mediator)** | Stateful workflow across multiple DOM panels requiring step gating and state assembly. |
| Synchronizing client-side UI filters, URL hash state, and background data fetching | **Coordinator (Mediator)** | Multi-channel state synchronization spanning DOM components, URL, and remote endpoints. |

---

## 2. Core Responsibilities of a Coordinator

When an agent determines a coordinator is needed, the coordinator MUST manage up to four explicit responsibilities:

1. **UI Trigger → Request Event:** Intercept user actions (e.g., button click, row selection) and dispatch a request event targeting the appropriate subsystem.
2. **Form & Data Interception:** Capture form submissions, serialize input fields, and manage server response handling.
3. **Notification → UI Feedback:** Listen to data state changes (e.g. record created, update failed) and trigger user feedback (toasts, modal closures, view switches).
4. **Attribute & State Bridging:** Bridge state across components (e.g. reading selected table ID and pre-filling an edit panel before opening).

---

## 3. Command and Query Separation (CQS)

To prevent tight coupling between coordinators and components, coordinators MUST follow CQS rules:

- **Commands (Mutations):** A coordinator MUST NEVER call internal prototype mutation methods of sibling components directly. Mutations MUST be executed either by writing DOM attributes directly or by dispatching custom request events.
- **Queries (Reading State):** A coordinator MAY inspect public component properties or attributes directly to evaluate current state.

```
[ User Interaction ] ──> [ Coordinator (Mediator) ]
                                 │
           ┌─────────────────────┴─────────────────────┐
           ▼ (Query: Read property)                    ▼ (Command: Dispatch request event)
    [ Component A ]                             [ Component B ]
```

---

## 4. Component Isolation and Scoping Rules

- **No Component Imports:** Coordinators MUST NOT directly import or reference concrete JS implementations of sibling components. All communication is 100% event-driven.
- **Local Subtree Scoping:** Coordinators MUST scope DOM queries strictly to their local DOM container (`this.dom.querySelectorAll`). Querying the global document root is forbidden to allow multiple coordinator instances on the same page.
- **Open Boundary Normalization:** Reusable overlay surfaces (panels, modals) MUST be reset and normalized at the *open boundary* (before opening), rather than on close, to ensure fresh state regardless of previous usage.

---

## 5. Anti-Patterns — NEVER Do These

- Creating a coordinator for a single component that could manage its own ARIA and DOM state.
- Calling private prototype methods directly on sibling components instead of using events or attributes.
- Querying `document.querySelector` globally inside a coordinator instance.
- Coupling coordinators directly to specific backend API endpoints instead of using an abstracted data layer.
- Accumulating lingering form state across modal re-opens instead of normalizing at the open boundary.
