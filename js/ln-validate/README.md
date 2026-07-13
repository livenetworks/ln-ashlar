# ln-validate

A zero-dependency, high-performance **Validity Primitive** that wraps the browser's native `ValidityState` API. It manages when to evaluate inputs, how to toggle visual error indicators, and when to dispatch validation events to form-level coordinators.

It maintains no custom rules in JavaScript; instead, it relies fully on native HTML markup constraints (`required`, `minlength`, `type="email"`, `pattern`) and standard CSS classes.

---

## 🧭 Philosophy & Architecture

1. **Platform First:** Browsers compile and execute rules in native C++ instantly. `ln-validate` simply acts as a visual layer: translating native `ValidityState` properties into visible HTML elements on demand.
2. **The Touch Gate:** To prevent annoying page-load errors, validation is completely visual-silent until a field receives its first user interaction (`input` or `change`), setting its internal state `_touched = true`.
3. **The Custom Escape Hatch:** Validation rules the browser cannot express (such as checking if an email is taken via a server lookup, or confirming passwords match) are routed through asynchronous `set-custom` / `clear-custom` events.
4. **Owns Browser Validation:** The moment a form contains at least one
   `data-ln-validate` field, that field's constructor injects
   `novalidate` on the host `<form>` (via `field.form`, so `form="id"`
   attribute association works too). Authors never write `novalidate`
   by hand. A form with zero `data-ln-validate` fields is untouched and
   keeps native browser validation as the default. The injection is
   idempotent and one-way — it is never removed on field `destroy()`,
   since other validated fields on the same form may still own the
   gate.
5. **Owns the Submit Gate:** The same field that injects `novalidate`
   also attaches (once per form) a `submit` listener: on submit, it
   dispatches `ln-validate:request-validate` to collect invalid fields;
   if any exist, it calls `preventDefault()`, sorts them by document
   position, and focuses the first one. Runs on every HTTP method — GET
   included, exactly like the native validation it replaces. `ln-form`
   has no role in this at all.

---

## 📦 Minimal Blueprint

```html
<div class="form-element">
  <label for="email">Email Address</label>
  <input id="email" name="email" type="email" required minlength="5" data-ln-validate>
  
  <ul data-ln-validate-errors>
    <li class="hidden" data-ln-validate-error="required">Email is required</li>
    <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
    <li class="hidden" data-ln-validate-error="tooShort">Must be at least 5 characters</li>
    <!-- Custom unmapped error -->
    <li class="hidden" data-ln-validate-error="emailTaken">This email is already in use</li>
  </ul>
</div>
```

> [!IMPORTANT]
> The surrounding wrapper **must** carry the class `.form-element` for the sibling error lookup to succeed.

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Value / Mapped Rule |
| :--- | :--- | :--- |
| `data-ln-validate` | `<input>`, `<select>`, `<textarea>` | Participation marker. Presence creates the instance. |
| `data-ln-validate-errors` | `<ul>` | Identifies the sibling error list container. |
| `data-ln-validate-error="key"` | `<li>` | Maps to standard native rules or custom keys (see list below). |

### Mapped Native Keys

| Key | Native HTML Attribute | Browser ValidityState Property |
| :--- | :--- | :--- |
| `required` | `required` | `valueMissing` |
| `typeMismatch` | `type="email"`, `type="url"`, etc. | `typeMismatch` |
| `tooShort` | `minlength="N"` | `tooShort` |
| `tooLong` | `maxlength="N"` | `tooLong` |
| `patternMismatch` | `pattern="regex"` | `patternMismatch` |
| `rangeUnderflow` | `min="N"` | `rangeUnderflow` |
| `rangeOverflow` | `max="N"` | `rangeOverflow` |

*Note: Any key not present in the native mapping table is automatically treated as a **custom error**.*

### JS API

Access the validation instance directly via the `lnValidate` property on the input element:

```javascript
const input = document.getElementById('email');

// 1. Force-validate the field (returns boolean; ignores the touched gate)
const isValid = input.lnValidate.validate();

// 2. Revert the touched state, clear visual classes, and hide error lists
input.lnValidate.reset();

// 3. Live boolean check (native validity + custom errors)
if (input.lnValidate.isValid) { ... }

// 4. Tear down listeners and delete instance reference
input.lnValidate.destroy();
```

---

## ⚡ DOM Events

### Emitted

| Event | Bubbles | Payload | Description |
| :--- | :--- | :--- | :--- |
| `ln-validate:valid` | Yes | `{ target, field }` | Dispatched after every validation pass that succeeds. |
| `ln-validate:invalid` | Yes | `{ target, field }` | Dispatched after every validation pass that fails. |
| `ln-validate:destroyed` | Yes | `{ target }` | Dispatched when the validation instance is torn down. |

### Received

| Event | Payload | Description |
| :--- | :--- | :--- |
| `ln-validate:set-custom` | `{ error: String }` | Injects a custom error key, highlights the field as invalid. |
| `ln-validate:clear-custom` | `{ error: String }` / `{}` | Clears a specific custom error, or all custom errors at once. |
| `ln-validate:request-validate` | `{ invalidFields: Array }` | Dispatched by `ln-validate`'s own submit gate (see Philosophy §5). Forces validation (sets `_touched = true`, calls `validate()`) and pushes the field element to the `invalidFields` array if invalid. |

---

## ⚠️ Common Pitfalls

- **Skipping the `.form-element` wrapper:** `ln-validate` locates sibling error elements relative to the closest `.form-element` ancestor. If you omit the wrapper class, no error lists will be toggled.
- **Relying on Native browser CSS (`:invalid`):** The browser applies `:invalid` to empty required fields on page load. **Always** use our custom classes `.ln-validate-valid` and `.ln-validate-invalid` for visual borders and focus states.
- **Injecting custom errors without validating:** Dispatching `ln-validate:set-custom` updates visual classes, but it **does not** bubble an `:invalid` event. If you need form-level coordinators (`ln-form`) to react immediately, call `input.lnValidate.validate()` right after injecting.
- **Expecting `novalidate` in your own markup:** Don't write it by hand
  — `ln-validate` injects it on the host form as soon as one field
  initializes. Writing it yourself is harmless (the injection checks
  `hasAttribute` first) but unnecessary.
