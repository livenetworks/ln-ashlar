# ln-form

Form coordinator — manages fill, validation state, submit, reset, and auto-submit. Works with `ln-validate` for per-field validation. Emits `ln-form:submit` with serialized data instead of native form submission.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-form` | `<form>` | Creates a form coordinator instance. |
| `data-ln-form-auto` | `<form>` | Auto-submit on any input change (for search/filter forms). |
| `data-ln-form-debounce="300"` | `<form>` | Debounce delay in ms before auto-submit fires. |

## API

```javascript
const form = document.getElementById('user-form');

form.lnForm.fill({ name: 'Dalibor', email: 'd@test.com' });  // Populate by name attribute
form.lnForm.submit();    // Force-validate all fields, emit ln-form:submit if valid
form.lnForm.reset();     // Native reset + clear validation state
form.lnForm.isValid;     // Boolean (getter — checks all ln-validate fields)
form.lnForm.destroy();   // Remove all listeners, cleanup

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM: MutationObserver auto-initializes
window.lnForm(container);
```

## Events — Emitted

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-form:submit` | yes | no | `{ data: Object }` |
| `ln-form:destroyed` | yes | no | `{ target: HTMLElement }` |

## Events — Received

| Event | Detail | Description |
|-------|--------|-------------|
| `ln-form:fill` | `{ name: 'val', email: 'val' }` | Populates inputs by `name` attribute. |
| `ln-form:reset` | — | Resets form and clears validation state. |

```javascript
// Listen for form submit
document.addEventListener('ln-form:submit', function (e) {
    console.log('Form data:', e.detail.data);
    // { name: 'Dalibor', email: 'd@test.com', role: 'admin' }
});

// Fill form programmatically via event
const form = document.getElementById('user-form');
form.dispatchEvent(new CustomEvent('ln-form:fill', {
    detail: { name: 'Dalibor', email: 'd@test.com' }
}));

// Reset form via event
form.dispatchEvent(new CustomEvent('ln-form:reset'));
```

## Submit Button State

The submit button is automatically disabled/enabled based on validation:

- If `[data-ln-validate]` fields exist but none have been touched → **disabled**
- If any field is invalid → **disabled**
- If all fields are valid and at least one has been touched → **enabled**
- If no `[data-ln-validate]` fields exist → button state is not managed

Targets: `button[type="submit"]` and `input[type="submit"]` within the form.

## Validation Flow

1. User interacts with a field → `ln-validate` emits `ln-validate:valid` or `ln-validate:invalid`
2. `ln-form` listens, tracks invalid field names in a Set
3. Submit button updates based on whether all fields are valid
4. On submit: force-validates ALL fields (including untouched), serializes if valid, emits `ln-form:submit`

## Examples

### Standard Form with Validation

```html
<form id="user-form" data-ln-form>
    <p class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" required data-ln-validate>
        <ul data-ln-validate-errors>
            <li hidden data-ln-validate-error="required">Name is required</li>
        </ul>
    </p>

    <p class="form-element">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required data-ln-validate>
        <ul data-ln-validate-errors>
            <li hidden data-ln-validate-error="required">Email is required</li>
            <li hidden data-ln-validate-error="typeMismatch">Invalid email format</li>
        </ul>
    </p>

    <ul class="form-actions">
        <li><button type="button" data-ln-modal-close>Cancel</button></li>
        <li><button type="submit">Save</button></li>
    </ul>
</form>
```

### Auto-Submit Search Form

```html
<form action="/search" method="get" data-ln-form data-ln-form-auto data-ln-form-debounce="300">
    <input name="q" type="search" placeholder="Search...">
</form>
```

```javascript
document.addEventListener('ln-form:submit', function (e) {
    // Fires 300ms after user stops typing
    console.log('Search query:', e.detail.data.q);
});
```

### Auto-Submit Filter Form

```html
<form data-ln-form data-ln-form-auto>
    <input name="q" placeholder="Search...">
    <select name="role">
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
    </select>
    <select name="status">
        <option value="">All statuses</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
    </select>
</form>
```

### Programmatic Fill (Edit Mode)

```javascript
// From a data-table row click
document.addEventListener('ln-data-table:row-click', function (e) {
    var form = document.getElementById('user-form');
    form.lnForm.fill(e.detail.record);
});

// Or via event dispatch
document.getElementById('user-form').dispatchEvent(
    new CustomEvent('ln-form:fill', {
        detail: { name: 'Dalibor', email: 'd@test.com', role: 'admin' }
    })
);
```

### Coordinator Pattern

```javascript
// Listen for form submissions
document.addEventListener('ln-form:submit', function (e) {
    var form = e.target;
    if (form.id !== 'user-form') return;

    // Send to server
    fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(e.detail.data)
    })
    .then(function (res) { return res.json(); })
    .then(function (result) {
        // Success: close modal, show toast
    })
    .catch(function (err) {
        // Error: show toast
    });
});
```
