# Form

Form coordinator — intercepts native submit, manages fill/reset, tracks validation state across all child `ln-validate` fields, emits `ln-form:submit` with serialized data. File: `js/ln-form/ln-form.js`.

## HTML

```html
<form id="user-form" data-ln-form>
    <div class="form-element">
        <label for="name">Name</label>
        <input id="name" name="name" required data-ln-validate>
        <ul data-ln-validate-errors>
            <li hidden data-ln-validate-error="required">Name is required</li>
        </ul>
    </div>
    <ul class="form-actions">
        <li><button type="button">Cancel</button></li>
        <li><button type="submit">Save</button></li>
    </ul>
</form>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-form` | `<form>` | Creates a form coordinator instance |
| `data-ln-form-auto` | `<form>` | Auto-submit on any `input` or `change` event |
| `data-ln-form-debounce="300"` | `<form>` | Debounce delay in ms before auto-submit fires |

## Events — Emitted

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-form:submit` | yes | no | `{ data: Object }` |
| `ln-form:destroyed` | yes | no | `{ target }` |

## Events — Received

| Event | `detail` | Description |
|-------|----------|-------------|
| `ln-form:fill` | `{ name: value, ... }` | Populate inputs by `name` attribute |
| `ln-form:reset` | — | Reset form and clear validation state |

## API

```javascript
form.lnForm.fill({ name: 'Dalibor', email: 'd@test.com' })
form.lnForm.submit()   // force-validate all fields, emit ln-form:submit if valid
form.lnForm.reset()    // native reset + clear validation state
form.lnForm.isValid    // getter — checks all [data-ln-validate] fields
form.lnForm.destroy()
```

---

## Internal Architecture

### Instance State

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The `<form>` element |
| `_invalidFields` | Set | Field `name` values currently invalid (tracked via bubbled `ln-validate` events) |
| `_debounceTimer` | Number \| null | Timer ID for auto-submit debounce |

### Validation Tracking

`ln-form` does not validate fields itself — it listens to events that bubble from `ln-validate` instances:

```
[ln-validate input]  →  ln-validate:valid   →  bubbles  →  ln-form._onValid
                     →  ln-validate:invalid →  bubbles  →  ln-form._onInvalid
```

- `_onValid`: deletes `e.detail.field` from `_invalidFields`, calls `_updateSubmitButton()`
- `_onInvalid`: adds `e.detail.field` to `_invalidFields`, calls `_updateSubmitButton()`

The Set holds field **names** (not elements). If a field emits `valid`, it is removed regardless of how it was added.

### `_updateSubmitButton()`

Queries all `button[type="submit"]` and `input[type="submit"]` within the form. Disables them if:

- **Any `[data-ln-validate]` field fails `checkValidity()`**, OR
- **No field has been touched yet** (guards against submitting a blank form)

If the form has no `[data-ln-validate]` fields, submit button state is not managed.

```
Fields present?
    No  → do nothing (don't touch button state)
    Yes → anyTouched = any field where instance._touched === true
          anyInvalid = any field where checkValidity() === false
          shouldDisable = anyInvalid || !anyTouched
```

### `submit()` — Flow

```
1. Query all [data-ln-validate] fields
2. For each: instance.validate()  ← force-validates even untouched fields
3. If any returned false → abort (do not serialize or dispatch)
4. _serialize() → data object
5. dispatch(form, 'ln-form:submit', { data })
```

Force-validate in step 2 ensures untouched required fields are shown as invalid when the user clicks submit without interacting with the form.

### `fill(data)` — Flow

```
1. Iterate form.elements
2. For each named, non-disabled element that has a matching key in data:
   - checkbox → el.checked
   - radio    → el.checked = (el.value === String(value))
   - select-multiple → options[n].selected
   - others   → el.value
3. For each filled element, dispatch ONE event:
   isChangeBased = tagName === 'SELECT' || type === 'checkbox' || type === 'radio'
   → isChangeBased ? 'change' : 'input'
```

Step 3 mirrors the exact same `isChangeBased` logic used by `ln-validate` to register listeners. This guarantees each field receives the event it actually listens to — no double fires.

### `_serialize()` — Rules

| Input type | Serialized as |
|---|---|
| `checkbox` | Array of checked values, keyed by `name` |
| `radio` | Single value of the checked option |
| `select-multiple` | Array of selected option values |
| All others | `el.value` string |

Skipped: `disabled`, unnamed, `type="file"`, `type="submit"`, `type="button"`.

### `reset()`

```
1. form.reset()              ← native reset (clears values)
2. setTimeout(0)             ← wait for native reset to complete
3. _resetValidation():
   a. _invalidFields.clear()
   b. For each [data-ln-validate]: instance.reset()
   c. _updateSubmitButton()
```

The `setTimeout(0)` in `_onNativeReset` is intentional — the native `reset` event fires before the browser has cleared input values. The delay ensures `_resetValidation()` runs after the DOM reflects the reset state.

### Auto-Submit

When `data-ln-form-auto` is present, both `input` and `change` events on the form trigger `submit()`:

```javascript
form.addEventListener('input', this._onAutoInput);
form.addEventListener('change', this._onAutoInput);
```

With `data-ln-form-debounce="N"`, each event clears and restarts a timer. `submit()` fires only after `N`ms of silence.

Auto-submit forms typically have no `[data-ln-validate]` fields — `submit()` serializes and dispatches immediately without validation gating.

### Relation to ln-validate

`ln-form` and `ln-validate` are independent components. `ln-form` integrates with `ln-validate` through events — it never calls `ln-validate` methods directly (except `validate()` on submit and `reset()` on reset). A form without `[data-ln-validate]` fields works fully — no validation tracking, submit button unmanaged.

### Dependencies

- `ln-core` — `dispatch`, `findElements`, `guardBody`
- `ln-validate` — optional, for per-field validation integration
