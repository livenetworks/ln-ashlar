# Form — architecture

Form coordinator — intercepts native submit, manages fill/reset, tracks
validation state across all child `ln-validate` fields, emits
`ln-form:submit` with serialized data. Source:
[`js/ln-form/ln-form.js`](../../js/ln-form/ln-form.js).

For consumer-facing usage see
[`js/ln-form/README.md`](../../js/ln-form/README.md).

---

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

---

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-form` | `<form>` | Creates a form coordinator instance |
| `data-ln-form-auto` | `<form>` | Auto-submit on any `input` or `change` event |
| `data-ln-form-debounce="300"` | `<form>` | Debounce delay in ms before auto-submit fires |

All three attributes are read once at init. Changing them on a live form
has no effect.

---

## Events — Emitted

| Event | Bubbles | Cancelable | `detail` |
|---|---|---|---|
| `ln-form:submit` | yes | **no** | `{ data: Object }` |
| `ln-form:reset-complete` | yes | no | `{ target }` |
| `ln-form:destroyed` | yes | no | `{ target }` |

## Events — Received

| Event | `detail` | Description |
|---|---|---|
| `ln-form:fill` | `{ name: value, ... }` | Populate inputs by `name` attribute |
| `ln-form:reset` | — | Reset form and clear validation state |

---

## API

```javascript
form.lnForm.fill({ name: 'Alex', email: 'a@example.com' })
form.lnForm.submit()   // force-validate all fields, emit ln-form:submit if valid
form.lnForm.reset()    // native reset + synthetic events + clear validation state
form.lnForm.isValid    // getter — checks all [data-ln-validate] fields
form.lnForm.destroy()
```

---

## Internal architecture

### Instance state

| Property | Type | Description |
|---|---|---|
| `dom` | Element | The `<form>` element |
| `_debounceTimer` | Number \| null | Timer ID for auto-submit debounce |

There is no internal index of invalid fields. Submit-button state is
computed live from the DOM on every event — see "Validation tracking" below.

### Validation tracking

`ln-form` does not validate fields itself. It listens to events that
bubble from `ln-validate` instances. Each bubbled event is a trigger to
re-evaluate state:

```
[ln-validate input]  →  ln-validate:valid    →  bubbles  →  ln-form._onValid
                     →  ln-validate:invalid  →  bubbles  →  ln-form._onInvalid
                                                               ↓
                                                  _updateSubmitButton()
                                                               ↓
                                          re-query [data-ln-validate]
                                          read instance._touched per field
                                          read field.checkValidity() per field
                                          set submit.disabled = anyInvalid || !anyTouched
```

The handlers receive no meaningful detail — they are pure triggers.
`_onValid` and `_onInvalid` have identical bodies after Phase 1 cleanup:
call `_updateSubmitButton()` and nothing else.

### `_updateSubmitButton()`

Queries all `button[type="submit"]` and `input[type="submit"]` within the
form. If none exist, returns immediately. Then queries all
`[data-ln-validate]` fields and computes:

```
Fields present?
	No  → do nothing (don't touch button state)
	Yes → anyTouched = any field where instance._touched === true
	      anyInvalid = any field where checkValidity() === false
	      shouldDisable = anyInvalid || !anyTouched
```

Sets `button.disabled = shouldDisable` for every submit button. The
re-query on every event means fields added after init participate
automatically — there is no registration step.

### `submit()` — flow

```
1. Query all [data-ln-validate] fields
2. For each: instance.validate()  ← force-validates even untouched fields
3. If any returned false → abort (do not serialize or dispatch)
4. serializeForm(form) → data object
5. dispatch(form, 'ln-form:submit', { data })
```

Step 2 may dispatch `ln-validate:invalid` events, which bubble and
trigger `_onInvalid` → `_updateSubmitButton()` again (disabling the
button on invalid fields). Step 3's abort means `ln-form:submit` is
never dispatched when validation fails — the handler always receives
valid data.

Force-validating in step 2 ensures untouched required fields are
shown as invalid when the user clicks submit without interacting with
the form first.

### `fill(data)` — flow

```
1. populateForm(form, data) — iterates form.elements, writes values
   by name key:
   - checkbox → el.checked = Boolean(value)
   - radio    → el.checked = (el.value === String(value))
   - select-multiple → options[n].selected
   - others   → el.value = value
2. For each filled element, dispatch ONE event:
   isChangeBased = tagName === 'SELECT' || type === 'checkbox' || type === 'radio'
   → isChangeBased ? 'change' : 'input'
```

Step 2 mirrors the `isChangeBased` discriminator from `ln-validate`'s
listener registration and `ln-autoresize`. This guarantees each field
receives the event it actually listens to — no double fires,
no missed reactions.

### `_serialize()` — rules

Serialization is delegated to `serializeForm()` from `ln-core`. Rules:

| Input type | Serialized as |
|---|---|
| `checkbox` | Array of checked values, keyed by `name` |
| `radio` | Single value of the checked option |
| `select-multiple` | Array of selected option values |
| All others | `el.value` string |

Skipped: `disabled`, unnamed, `type="file"`, `type="submit"`, `type="button"`.

### `reset()` — flow

```
1. dom.reset()                   ← native reset (clears .value)
2. For each input/textarea/select:
   isChangeBased = tagName === 'SELECT' || type === 'checkbox' || type === 'radio'
   → el.dispatchEvent(isChangeBased ? 'change' : 'input', bubbles: true)
3. _resetValidation():
   a. For each [data-ln-validate]: instance.reset()
   b. _updateSubmitButton()
4. dispatch(form, 'ln-form:reset-complete', { target: form })
```

Step 2 is the synthetic-event loop (same `isChangeBased` fork as `fill()`)
so reactive children re-react to cleared values. Without it, `ln-autoresize`
keeps its pre-reset height, custom listeners are not notified.

Step 2 MUST precede step 3. The synthetic events trigger `ln-validate`
to mark default-empty required fields as invalid. Step 3's `instance.reset()`
clears that transient state. Reordering leaves fields visibly invalid.

`ln-form:reset-complete` (step 4) is distinct from the incoming
`ln-form:reset` (a request) to prevent recursion: the form's
`_onFormReset` listener calls `this.reset()`, which dispatches
`reset-complete` — not another `ln-form:reset`.

### Native `<button type="reset">` path — `_onNativeReset`

A `<button type="reset">` click fires the platform `reset` event. The
component intercepts it and runs ONLY `_resetValidation()`, deferred by
one tick via `setTimeout(..., 0)` so the browser has applied the DOM reset first.

Intentionally absent from this path: synthetic input/change loop and
`ln-form:reset-complete` dispatch. Projects that use native reset get
exactly what HTML defines. The `lnForm.reset()` path or `ln-form:reset`
event are the full reactive paths.

### Auto-submit

When `data-ln-form-auto` is present, both `input` and `change` events on
the form trigger `submit()` via the same `_onAutoInput` handler.

With `data-ln-form-debounce="N"`, each event clears and restarts a timer.
`submit()` fires only after N ms of silence.

Auto-submit forms typically have no `[data-ln-validate]` fields — `submit()`
serializes and dispatches immediately without validation gating. If they
do have `[data-ln-validate]` fields, `submit()` force-validates and
aborts silently on failure.

### `isValid` getter vs `_updateSubmitButton`

These two surfaces answer different questions:

**`form.lnForm.isValid`** — "Is the form's data acceptable for submission
right now?" Reads `field.checkValidity()` across all `[data-ln-validate]`
fields. Ignores `instance._touched`. Returns `true` the moment all fields
are natively valid, even on a fresh form the user has not touched.

**Submit button `disabled` (managed by `_updateSubmitButton`)** — "Is
the form in a state where the user should be invited to submit?" Checks
BOTH `checkValidity()` AND `instance._touched`. A fresh form with no
interaction has `isValid === true` (if no required fields are blank) but
Save is still disabled — no field has been touched, so the
"you haven't started" guard triggers.

The deliberate gap: a freshly mounted edit form filled via `lnForm.fill()`
has `isValid === true` (data was populated) and the button is enabled
(fill dispatches synthetic events, setting `_touched = true` per field).
A freshly mounted empty form with `required` fields has `isValid === false`
(required but blank) and the button is disabled. A freshly mounted empty
form with no `required` fields has `isValid === true` but the button is
still disabled (no touched fields). These are three distinct conditions
worth distinguishing.

---

## Why no Set

The `_invalidFields` Set was removed. It was initialized in the
constructor, mutated in `_onValid` / `_onInvalid`, and cleared in
`_resetValidation` — but never read. Every piece of code that needed
to know "how many fields are invalid" called `_updateSubmitButton()`,
which re-queries `[data-ln-validate]` and reads `checkValidity()` directly.

The removal is not a performance improvement — the DOM walk was happening
anyway. The gain is one fewer source of truth to keep in sync. An internal
Set that tracks field names can become stale (e.g. a field removed from
the DOM after an `:invalid` event was still in the Set until a matching
`:valid` fired). The DOM is always authoritative; re-querying it on every
event is the correct pattern.

Future audits: do NOT re-introduce the Set. If a performance problem
is observed, measure first — `querySelectorAll('[data-ln-validate]')` on
a form with 10-20 fields is negligible.

---

## Relation to ln-validate

`ln-form` and `ln-validate` are independent components. `ln-form` integrates
with `ln-validate` through three touch points:

1. **Events (up)** — `ln-validate` dispatches `:valid` / `:invalid`;
   `ln-form` listens at the form element via delegation.
2. **Direct API (down on submit)** — `lnForm.submit()` calls
   `instance.validate()` on every `[data-ln-validate]` field.
3. **Direct API (down on reset)** — `lnForm.reset()` calls
   `instance.reset()` on every `[data-ln-validate]` field, and reads
   `instance._touched` inside `_updateSubmitButton()`.

A form without `[data-ln-validate]` fields works fully — no validation
tracking, submit button unmanaged.

---

## Dependencies

- `ln-core` — `dispatch`, `serializeForm`, `populateForm`, `registerComponent`
  (these are the actual imports on `js/ln-form/ln-form.js:1`).
- `ln-validate` — optional. Read `instance._touched`, call
  `instance.validate()` and `instance.reset()` at the touch points above.

---

## Where this code could change

- **`ln-form.isValid` does not check custom errors.** The getter reads
  `field.checkValidity()` directly, not `field.lnValidate.isValid`. A
  field with `_customErrors.size > 0` but native-valid would report
  as valid at the form level. Consider aligning with
  `field.lnValidate.isValid` if custom-error correctness in `isValid`
  is needed.
- **`set-custom` + form-level submit gate.** `_onSetCustom` does not
  dispatch `ln-validate:invalid`. A coordinator wiring server-side
  errors must call `instance.validate()` after `set-custom` to
  trigger the submit-button re-evaluation. A future change could make
  `_onSetCustom` dispatch `:invalid` always, at the cost of redundant
  events for callers that don't need the bubbling path.
- **`_debounceTimer` not cleared on `_resetValidation()`.** Calling
  `lnForm.reset()` mid-debounce fires the queued `submit()` on the
  now-empty form. `submit()` force-validates and aborts (fields are
  blank, native `required` fails), so no bad data reaches the server.
  The aborted submit is silent. If explicit cancellation is required,
  consumers must do `clearTimeout(form.lnForm._debounceTimer)` before
  calling `reset()`. The fix would be to clear the timer inside
  `reset()` — low-risk but currently undocumented as behavior.
