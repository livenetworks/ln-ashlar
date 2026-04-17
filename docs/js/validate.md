# Validate

Per-field validation using the native `ValidityState` API. Shows/hides error messages, toggles CSS classes, emits events. Works standalone or managed by `ln-form`. File: `js/ln-validate/ln-validate.js`.

## HTML

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

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-validate` | `<input>`, `<select>`, `<textarea>` | Creates a validation instance |
| `data-ln-validate-errors` | `<ul>` | Error list container (sibling of input inside `.form-element`) |
| `data-ln-validate-error="key"` | `<li>` | Error message — shown when the matching `ValidityState` check fails |

## Error Key → ValidityState Mapping

| `data-ln-validate-error` | HTML constraint | `ValidityState` property |
|---|---|---|
| `required` | `required` | `valueMissing` |
| `typeMismatch` | `type="email"`, `type="url"` | `typeMismatch` |
| `tooShort` | `minlength` | `tooShort` |
| `tooLong` | `maxlength` | `tooLong` |
| `patternMismatch` | `pattern` | `patternMismatch` |
| `rangeUnderflow` | `min` | `rangeUnderflow` |
| `rangeOverflow` | `max` | `rangeOverflow` |

Keys not in this map are treated as **custom errors** — managed exclusively via `ln-validate:set-custom` / `ln-validate:clear-custom`.

## Events — Emitted

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-validate:valid` | yes | no | `{ target, field }` |
| `ln-validate:invalid` | yes | no | `{ target, field }` |
| `ln-validate:destroyed` | yes | no | `{ target }` |

## Events — Received

| Event | `detail` | Description |
|-------|----------|-------------|
| `ln-validate:set-custom` | `{ error: String }` | Show a custom error by name, mark field invalid |
| `ln-validate:clear-custom` | `{ error: String }` or `{}` | Hide a custom error. Omit `error` to clear all custom errors |

## API

```javascript
input.lnValidate.validate()  // Force validate — returns boolean
input.lnValidate.reset()     // Clear touched, remove classes, hide all errors
input.lnValidate.isValid     // Getter: checkValidity() && no active custom errors
input.lnValidate.destroy()   // Remove listeners, cleanup
```

---

## Internal Architecture

### Instance State

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The input/select/textarea element |
| `_touched` | Boolean | `false` until first `input` or `change` event. Untouched fields don't render errors |
| `_customErrors` | Set | Active custom error keys added via `ln-validate:set-custom` |

### Event Listener Strategy

On construction, `isChangeBased` is determined:

```javascript
const isChangeBased = tag === 'SELECT' || type === 'checkbox' || type === 'radio';
```

| `isChangeBased` | Listeners attached | When validation runs |
|---|---|---|
| `false` (text, email, tel, etc.) | `input` + `change` | On every keystroke AND on blur/change |
| `true` (select, checkbox, radio) | `change` only | On selection change |

Both `input` and `change` set `_touched = true` and call `validate()`.

**Important:** `ln-form.fill()` dispatches exactly one event per element — `input` for non-change-based, `change` for change-based — mirroring this same logic. This prevents double validation fires on programmatic fill.

### `validate()` — Flow

```
1. dom.checkValidity()                    → nativeValid (Boolean)
2. isValid = nativeValid && _customErrors.size === 0
3. For each [data-ln-validate-error] in the parent .form-element:
   a. Read errorKey from attribute
   b. Look up validityProp = ERROR_MAP[errorKey]
   c. If validityProp is undefined → skip (custom error, managed separately)
   d. Toggle .hidden based on validity[validityProp]
4. Toggle CSS classes: ln-validate-valid / ln-validate-invalid
5. Dispatch ln-validate:valid or ln-validate:invalid
6. Return isValid
```

Step 3c is the key integration point: custom error `<li>` elements are invisible to the native validation loop — they are only shown/hidden by `_onSetCustom` / `_onClearCustom`.

### Custom Error Flow

**`ln-validate:set-custom` → `_onSetCustom`:**

```
1. Add error key to _customErrors Set
2. Set _touched = true
3. Find [data-ln-validate-error="key"] in parent .form-element → removeClass('hidden')
4. Add ln-validate-invalid / remove ln-validate-valid from input
```

Does NOT call `validate()` — the CSS and error visibility are applied directly. This avoids overwriting custom error visibility with the native validation loop.

**`ln-validate:clear-custom` → `_onClearCustom`:**

```
1. If detail.error provided → delete from _customErrors, hide that specific error element
   If no error → clear all custom errors, hide all their elements
2. If _touched → call validate()
```

After clearing, `validate()` re-runs to correctly update CSS classes and native error visibility based on current field state.

### `isValid` Getter

```javascript
get isValid() {
    return this.dom.checkValidity() && this._customErrors.size === 0;
}
```

Reads live state — does not trigger a render or emit events.

### `reset()`

```
1. _touched = false
2. _customErrors.clear()
3. Remove ln-validate-valid, ln-validate-invalid from dom
4. Hide ALL [data-ln-validate-error] elements (native + custom)
```

### Dependencies

- `ln-core` — `dispatch`, `findElements`, `guardBody`
