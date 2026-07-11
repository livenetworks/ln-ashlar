---
name: data-flow
classification: doctrine
status: draft
domain: frontend
summary: Unidirectional data flow in ln-ashlar - concern boundaries, template binding matrix, and dynamic form synchronization.
source: docs/architecture/data-flow.md
tags: [doctrine, data-flow, events, templates, forms]
---

# 🔄 Data Flow Architecture

## Summary

This document explains how data flows unidirectionally through `ln-ashlar` across the boundaries of its core components. It maps the responsibilities of the four major concerns (Data, Render, Submit, Validate), details the decision matrix for data-to-DOM rendering (`{{ }}` vs. `data-ln-field`), and details form binding and region filling strategies.

---

## 1. The Four Concerns

`ln-ashlar` divides data operations into four isolated concerns. Concerns must only interact via events and never directly manipulate or query another concern's private states:

| # | Concern | Component(s) | Primary Responsibility |
|---|---|---|---|
| **1** | **Data** | `ln-data-store` | Manages local IndexedDB caches, local query execution, offline synchronization, and state updates. |
| **2** | **Render** | [`ln-table`](../components/ln-table.md), [`ln-list`](../components/ln-list.md) | Visual rendering of datasets, virtual scrolling, and translating visual actions (sort, page) into query intent. |
| **3** | **Submit** | [`ln-form`](../components/ln-form.md), [`ln-confirm`](../components/ln-confirm.md), [`ln-http`](../components/ln-http.md) | Form serialization, submit gating, UX confirmation, and transport payloads. |
| **4** | **Validate** | [`ln-validate`](../components/ln-validate.md) | Field-level validation constraints, custom rules, and UI error displays. |

---

## 2. Unidirectional Read and Write Flows

Data moves strictly in predictable, asynchronous loops:

### A. The Read Loop
1. The **Data Store** (`ln-data-store`) loads records from its local cache or syncs them from the server.
2. The store dispatches an `ln-store:change` event containing the records.
3. Subscribed **Renderers** (`ln-table` or `ln-list`) listen to the change event and redraw themselves dynamically. Renderers are reactive stream consumers; they do not pull state.

### B. The Write Loop
1. The user fills a form and triggers submit.
2. `ln-form` intercepts the event, triggers validation via `ln-validate`, and if valid, dispatches `ln-form:submit`.
3. The store captures the payload, performs an **optimistic write** (updates the local cache with `_pending: true`), and immediately dispatches `ln-store:change` to update the visual renderers.
4. The coordinator/queue pushes the payload to the server.
5. On a `2xx` success response, the store **reconciles** the data (overwrites local temporary IDs with server-assigned IDs, sets `_pending: false`) and dispatches `ln-store:change` with a `"reconcile"` source type.
6. On a `4xx`/`5xx` error response, the store **reverts** the write, restores the cache to the pre-submit snapshot, and dispatches `ln-store:change` with a `"revert"` source type to restore the old UI.

---

## 3. Template Syntax Decision Matrix

`ln-ashlar` features three ways to map data fields onto DOM nodes. Choosing the correct mechanism depends on **who** populates the element and **when** it occurs:

| Mechanism | Syntax | Processor | Lifecycle | Use Case |
|---|---|---|---|---|
| **One-Shot Text** | `{{ field }}` | `fillTemplate()` | Once, at clone time. | Flat text insertion inside cloned templates (e.g. table rows, list items). Once cloned, the template placeholders are consumed. |
| **One-Shot Attribute** | `data-ln-table-cell-attr="field:attr"` | Renderer (`_fillRow`) | Once, at clone time. | Stamping element attributes (like `href` or `title`) inside cloned table rows. |
| **Reactive Field** | `data-ln-field="prop"` | `fill(root, data)` | Re-runnable on every `fill()` call. | Fields populated dynamically via explicit JavaScript calls (e.g. forms, overlays, dynamic display regions). |

> [!WARNING]
> **The Row Template Trap:** Putting `data-ln-field` inside a cloned `ln-table` or `ln-list` row template is a silent no-op. The renderer's row-compilation pipeline only executes `fillTemplate()` and `data-ln-table-cell-attr` at clone time. It does **not** call `fill()`.

---

## 4. Form Binding via `name` and `data-ln-fill-as`

Forms exchange data in two directions:
- **Serialization (Out):** `serializeForm()` parses inputs, mapping element `name` attributes to flat JSON record keys.
- **Population (In):** `populateForm()` maps JSON record keys to input elements.

### Keys and Attribute Decoupling:
- **`data-ln-fill-as`:** To decouple the backend data structure from form submission keys, set `data-ln-fill-as="key"` on an input. `populateForm()` will fill the input from `record[key]`, while the form submission payload will still use the standard `name` attribute.
- **Type Coercion:** If `opts.typed = true` is passed to `serializeForm()`, inputs are cast:
  - Single checkboxes return `true`/`false`.
  - Checkbox groups return a string array.
  - Number and range inputs return parsed floats (or `null` if empty).
  - Hidden inputs are **never** coerced, preserving their raw wire format.

---

## 5. Region Filling via `lnFill`

To fill both form inputs and display elements inside a container simultaneously (such as filling an edit modal), use the `lnFill` helper:

```js
window.lnCore.lnFill(container, record);
```

### Flow and Behaviors:
- **Declarative triggers:** In HTML, click triggers can configure region fills via attributes:
  - `data-ln-fill-form="form-id"`: targets a form.
  - `data-ln-fill-{key}="value"`: configures data fields.
- **Null resets:** Calling `lnFill(container, null)` resets forms via `form.reset()` and clears all display elements matching `data-ln-field`.
- **Target Guards:** Components listening for `ln-fill` events that can contain nested fillable regions must guard themselves using `if (e.target !== this.dom) return;` to prevent bubbled descendant events from double-triggering.
