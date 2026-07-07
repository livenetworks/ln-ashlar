# Form — architecture

Form manipulation only: populates the form on `ln-fill`, rewrites
`action`/`_method` for RESTful edit routing. Submit is native HTML —
`ln-form` never intercepts it, never serializes data, never dispatches a
submit event. Source: [`js/ln-form/ln-form.js`](../../js/ln-form/ln-form.js).

For consumer-facing usage see
[`js/ln-form/README.md`](../../js/ln-form/README.md).

---

## HTML

```html
<form id="user-form" data-ln-form action="/users" method="post">
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
| `data-ln-form-action-edit` | `<form>` | Opt-in RESTful action routing. Empty value = `baseAction/{id}`; non-empty value = template with `:id`. |
| `data-ln-form-action-method="PUT"` | `<form>` | HTTP verb written to `_method` on edit. Default `PUT`. Requires `data-ln-form-action-edit`. |

Both attributes are read once at init. Changing them on a live form has
no effect.

---

## Events — Emitted

| Event | Bubbles | Cancelable | `detail` |
|---|---|---|---|
| `ln-form:destroyed` | yes | no | `{ target }` |

## Events — Received

| Event | `detail` | Description |
|---|---|---|
| `ln-fill` | `record \| null` | Canonical fan-out fill. `detail` → populate + apply action mode; `null` → native `form.reset()`. Guarded: only handled when `e.target === self.dom`. |

---

## API

```javascript
form.lnForm.fill({ name: 'Alex', email: 'a@example.com' })
form.lnForm.destroy()
```

---

## Internal architecture

### Instance state

| Property | Type | Description |
|---|---|---|
| `dom` | Element | The `<form>` element |
| `_baseAction` | String | `action` attribute value captured at init, restored on "new" mode |

There is no internal validation index, no debounce timer, no submit
button state — `ln-form` does not orchestrate submission.

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

Step 2 mirrors the `isChangeBased` discriminator used by `ln-validate`'s
listener registration and `ln-autoresize`. This guarantees each field
receives the event it actually listens to — no double fires, no missed
reactions.

### `_onLnFill(e)` — flow

```
1. Guard: if (e.target !== self.dom) return
   (ignore bubbled ln-fill from [data-ln-fillable] children inside the form)
2. e.detail present (record):
   a. this.fill(e.detail)
   b. this._applyActionMode(e.detail)
3. e.detail absent (null = "new" mode):
   a. this.dom.reset() — native reset fires the platform 'reset' event
```

### `_onReset` — flow

The native `reset` event (fired by `form.reset()` above, or a
`<button type="reset">` click, or any other native reset trigger) always
calls `_applyActionMode(null)` — restoring the base action and clearing
`_method`. There is no synthetic input/change loop on reset and no
`ln-form:reset-complete` event; reset is otherwise exactly what the
browser defines.

### `destroy()` — flow

```
1. Remove 'ln-fill' and 'reset' listeners
2. dispatch(form, 'ln-form:destroyed', { target: form })
3. delete form.lnForm
```

---

## RESTful action mode (opt-in)

When `data-ln-form-action-edit` is present, `_onLnFill` calls
`_applyActionMode(record)` after fill (and on reset via `_onReset`). On
edit (record with a usable `id`): rewrites `form.action` and
auto-ensures `<input name="_method">` with the configured verb. On new
(null record or no `id`): restores `this._baseAction` and sets `_method`
to `''`. The guard on the first line of `_applyActionMode` ensures forms
without `data-ln-form-action-edit` exit immediately — unrelated forms
are completely unaffected.

```
_ensureMethodInput():
	find input[name="_method"] in the form
	if absent, create a hidden input named _method and append it
	return it

_applyActionMode(record):
	if !hasAttribute(ACTION_EDIT_ATTR) → return
	id = record && record.id != null && record.id !== '' ? record.id : null
	methodInput = _ensureMethodInput()
	if id !== null:
		action = ACTION_EDIT_ATTR template ? template.replace(':id', id)
		         : baseAction (trailing slash stripped) + '/' + id
		form.action = action
		methodInput.value = ACTION_METHOD_ATTR value || 'PUT'
	else:
		form.action = baseAction
		methodInput.value = ''
```

---

## What ln-form does NOT do

- No `submit` listener, no `preventDefault()`.
- No `serializeForm` call, no `ln-form:submit` event, no JSON payload.
- No auto-submit (`data-ln-form-auto` / `data-ln-form-debounce` removed).
- No typed serialization (`data-ln-form-typed` removed).
- No validation orchestration — no submit-button disable logic, no
  `_updateSubmitButton`, no `isValid` getter, no `_resetValidation`.
- No `ln-form:fill` / `ln-form:reset` command events, no
  `ln-form:reset-complete`.

Ajax interception (if a project wants it) is a separate component's
concern — it listens to the native `submit` event itself. Validation
remains the browser's job (constraint validation; no form in this
library uses `novalidate`) plus `ln-validate` for field error display.

---

## Relation to ln-validate

`ln-form` no longer integrates with `ln-validate` — there are no shared
touch points. `ln-validate` currently relies on the form's `reset` event
to clear field error state; since `ln-form` no longer runs a validation
reset step, that responsibility currently has no owner (known follow-up
for `ln-validate`, tracked separately).

---

## Dependencies

- `ln-core` — `dispatch`, `populateForm`, `registerComponent`.
