# ln-form

A high-performance **Form Coordinator** that upgrades native HTML forms. It acts as the orchestration layer: coordinating bulk population (`fill`), native reset procedures, reactive validation state gating, and debounced auto-submission.

It delegates per-field validation rules to the `ln-validate` primitive and visual formatting to SCSS layout mixins, focusing purely on gating the submission flow and serializing form data into clean JSON.

---

## 🧭 Philosophy & Architecture

1. **The Form as Coordinator:** `ln-form` maintains no internal registry of validation rules or values. It listens to bubbled DOM events (`ln-validate:valid`, `ln-validate:invalid`) and enforces a single rule: *the form submit button is disabled until all marked fields are valid and at least one has been touched.*
2. **Zero Network Coupling:** The component does not make XHR or fetch requests. On successful submission, it serializes values and dispatches an uncancellable `ln-form:submit` CustomEvent carrying the payload. Network integration belongs entirely in a separate transport layer (`ln-http` or a custom controller).
3. **Reactive Integrity:** Data flows strictly through DOM events. Programmatic changes must trigger standard events (`input` / `change`) so that dependent primitives (`ln-validate`, `ln-autoresize`) can react in synchrony.

---

## 📦 Minimal Blueprint

```html
<form id="user-form" data-ln-form>
  <!-- Sibling elements wrapped in a semantic form-element -->
  <div class="form-element">
    <label for="username">Username</label>
    <input id="username" name="username" required data-ln-validate>
    <ul data-ln-validate-errors>
      <li class="hidden" data-ln-validate-error="required">Username is required</li>
    </ul>
  </div>

  <!-- Form Actions Footer -->
  <ul class="form-actions">
    <li><button type="button" data-ln-modal-close>Cancel</button></li>
    <li><button type="submit">Save</button></li>
  </ul>
</form>
```

> [!WARNING]
> Always set `type="button"` on Cancel buttons. Otherwise, the browser defaults to `type="submit"` and triggers validation/submission.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-form` | `<form>` | Initializes the coordinator. Evaluates initial button states. |
| `data-ln-form-auto` | `<form>` | Automatically submits the form on any user value change. |
| `data-ln-form-debounce="ms"` | `<form>` | Debounce duration in milliseconds before auto-submitting. |

### JS API

Access the coordinator instance directly via the `lnForm` property on the form element:

```javascript
const form = document.getElementById('user-form');

// 1. Bulk populate fields by name (fires synthetic input/change events)
form.lnForm.fill({ username: 'dalibor', role: 'admin' });

// 2. Force-validate all fields and trigger submission if clean
form.lnForm.submit();

// 3. Clear all fields, reset validity states, and re-enable the fresh guard
form.lnForm.reset();

// 4. Check if all data-ln-validate fields are valid (Boolean getter)
if (form.lnForm.isValid) { ... }

// 5. Clean up listeners and destroy the instance
form.lnForm.destroy();
```

---

## ⚡ DOM Events

### Emitted

| Event | Bubbles | Payload | Description |
| :--- | :--- | :--- | :--- |
| `ln-form:submit` | Yes | `{ data: Object }` | Dispatched with serialized form key-values on valid submission. |
| `ln-form:reset-complete` | Yes | `{ target: HTMLElement }` | Dispatched after a complete reactive reset cycle. |
| `ln-form:destroyed` | Yes | `{ target: HTMLElement }` | Dispatched when the coordinator is torn down. |

### Received

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-form:fill` | `{ key: value }` | Triggers form population. (Prefer direct `form.lnForm.fill()` API). |
| `ln-form:reset` | None | Triggers form reset. (Prefer direct `form.lnForm.reset()` API). |

---

## ⚠️ Common Pitfalls

- **Setting `input.value` directly:** Doing `input.value = 'new'` is silent in the DOM. Neither validation nor layout systems will detect the change. **Always** use `form.lnForm.fill()` or manually dispatch an `input` or `change` event.
- **Relying on Native Form Resets:** Clicking a `<button type="reset">` only reverts DOM attributes. It does not trigger synthetic events, leaving textareas at expanded heights and custom controls out of sync. Use `form.lnForm.reset()` instead.
- **Debounced fill on auto-submit forms:** Calling `fill()` on an auto-submit form will trigger an automatic submission after the debounce timeout.
