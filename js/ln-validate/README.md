# ln-validate

Per-field validation using the native ValidityState API. Shows/hides error messages, toggles CSS classes, emits valid/invalid events. Works standalone or with `ln-form`.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-validate` | `<input>`, `<select>`, `<textarea>` | Creates a validation instance for this field. |
| `data-ln-validate-errors` | `<ul>` | Error list container — sibling of the input inside `.form-element`. |
| `data-ln-validate-error="key"` | `<li>` | Individual error message. Shown when the matching validity check fails. |

## Error Key Mapping

| `data-ln-validate-error` value | HTML attribute | ValidityState property |
|---|---|---|
| `required` | `required` | `valueMissing` |
| `typeMismatch` | `type="email"`, `type="url"` | `typeMismatch` |
| `tooShort` | `minlength` | `tooShort` |
| `tooLong` | `maxlength` | `tooLong` |
| `patternMismatch` | `pattern` | `patternMismatch` |
| `rangeUnderflow` | `min` | `rangeUnderflow` |
| `rangeOverflow` | `max` | `rangeOverflow` |

Validation rules come from native HTML attributes — zero JS configuration. Error messages live in HTML, rendered by the backend (multilanguage ready).

## API

```javascript
const input = document.getElementById('email');

input.lnValidate.validate();  // Force validate — returns boolean
input.lnValidate.reset();     // Clear touched state, remove classes, hide errors
input.lnValidate.isValid;     // Boolean (getter — native checkValidity() AND no active custom errors)
input.lnValidate.destroy();   // Remove listeners, cleanup

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM: MutationObserver auto-initializes
window.lnValidate(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-validate:valid` | yes | no | `{ target: HTMLElement, field: String }` |
| `ln-validate:invalid` | yes | no | `{ target: HTMLElement, field: String }` |
| `ln-validate:destroyed` | yes | no | `{ target: HTMLElement }` |

### Events — Received

| Event | Detail | Description |
|-------|--------|-------------|
| `ln-validate:set-custom` | `{ error: String }` | Show a custom error by name. Marks field as invalid. |
| `ln-validate:clear-custom` | `{ error: String }` or `{}` | Hide a custom error. Omit `error` to clear all custom errors. |

```javascript
// Listen for validation state changes
document.addEventListener('ln-validate:valid', function (e) {
    console.log(e.detail.field + ' is now valid');
});

document.addEventListener('ln-validate:invalid', function (e) {
    console.log(e.detail.field + ' is invalid');
});
```

## Behavior

### Untouched Fields

Fields start clean — no errors, no CSS classes. Validation begins only after the first interaction (`input` event for text fields, `change` event for select/checkbox/radio). This prevents a wall of errors on page load.

### Timing

- Text inputs: validates on every `input` event (keystrokes, paste, autofill)
- Select/checkbox/radio: validates on `change` event
- Errors appear immediately when input becomes invalid
- Errors clear immediately when input becomes valid

### CSS Classes

- `ln-validate-valid` — added to input when valid
- `ln-validate-invalid` — added to input when invalid
- Both removed on `reset()`

## Examples

### Basic Input with Errors

```html
<div class="form-element">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required minlength="5" data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">This field is required</li>
        <li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
        <li class="hidden" data-ln-validate-error="tooShort">Must be at least 5 characters</li>
    </ul>
</div>
```

### Select Field

```html
<div class="form-element">
    <label for="role">Role</label>
    <select id="role" name="role" required data-ln-validate>
        <option value="">Select...</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
    </select>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">Please select a role</li>
    </ul>
</div>
```

### Programmatic Validation

```javascript
// Force validate (e.g. before form submit)
const isValid = document.getElementById('email').lnValidate.validate();

// Reset after form clear
document.getElementById('email').lnValidate.reset();
```

### Custom Validation (Coordinator-driven)

For errors that native HTML can't express — password mismatch, async uniqueness, server 422:

```html
<div class="form-element">
    <label for="password-confirm">Confirm Password</label>
    <input id="password-confirm" name="password_confirmation" type="password" required data-ln-validate>
    <ul data-ln-validate-errors>
        <li class="hidden" data-ln-validate-error="required">This field is required</li>
        <li class="hidden" data-ln-validate-error="passwordMismatch">Passwords do not match</li>
    </ul>
</div>
```

```javascript
// Coordinator — set custom error
const input = document.getElementById('password-confirm');
input.dispatchEvent(new CustomEvent('ln-validate:set-custom', {
    bubbles: true,
    detail: { error: 'passwordMismatch' }
}));

// Coordinator — clear when resolved
input.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
    bubbles: true,
    detail: { error: 'passwordMismatch' }
}));

// Clear all custom errors at once
input.dispatchEvent(new CustomEvent('ln-validate:clear-custom', {
    bubbles: true,
    detail: {}
}));
```
