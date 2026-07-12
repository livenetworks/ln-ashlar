# Form — architecture

Form manipulation only: populates the form on `ln-fill`, rewrites
`action`/`_method` for RESTful edit routing. Submit is native HTML by
default — without `data-ln-form-scope`, `ln-form` never intercepts it,
never serializes data, never dispatches a custom event. Adding
`data-ln-form-scope` opts the form into the declarative write pipeline
(see §Write Intake below): `ln-form` intercepts `POST`/`PUT`/`PATCH`
submits only to run a validation gate, calling `preventDefault()` solely
when a field is invalid. A valid submit is left native — `ln-data-coordinator`
claims it via its own `preventDefault()` on a document-level `submit`
listener (bubble phase).
Source: [`js/ln-form/ln-form.js`](../../js/ln-form/ln-form.js).

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

## Write Intake (`data-ln-form-scope`)

Opting a form into the declarative write pipeline (form → `ln-data-coordinator` → `ln-data-store`/connector) requires the `data-ln-form-scope` attribute. Without it, `ln-form` never intercepts `submit` — native HTML submission (or `ln-ajax`) proceeds untouched.

| Attribute | On | Description |
|---|---|---|
| `data-ln-form-scope` | `<form data-ln-form>` | Opts the form into write intake. Value = **named scope**, matched against a coordinator by its `data-ln-data-coordinator="<name>"` value — the form does NOT need to be a DOM descendant of the coordinator. **Empty value** (`data-ln-form-scope=""` or bare `data-ln-form-scope`) falls back to **nearest-ancestor containment**: the form must be inside a `[data-ln-data-coordinator]` element. |

### Behavior

On `submit`, if `data-ln-form-scope` is present and the effective HTTP method is `POST`/`PUT`/`PATCH` (read from `<form method>` or a hidden `_method` input), `ln-form` runs the validation gate:

1. Dispatches `ln-validate:request-validate` on the form (collector `{ invalidFields: [] }`).
2. If any field is invalid: prevents the native submit, sorts invalid fields by document position, focuses the first one, and returns.
3. If every field is valid: does nothing further. `ln-form` never serializes, never dispatches a custom event, never calls `preventDefault()` — the native submit proceeds.
4. A `ln-data-coordinator` listening for the native `submit` on `document` (bubble phase) checks `e.defaultPrevented` first (skips if the gate above already blocked it, or another coordinator already claimed it), matches `data-ln-form-scope`/containment, resolves the effective method itself, and — only then — calls `preventDefault()` to claim the write. It serializes the form and routes the record through the store → queue → connector pipeline.

Methods other than `POST`/`PUT`/`PATCH` (e.g. a `GET` search form) skip the validation gate entirely, and `ln-data-coordinator` never claims them either.

A scoped form with no matching coordinator (wrong scope name, or not contained in any) falls through as an ordinary native submit — no console warning, no claim. This is the progressive-enhancement fallback.

See [`js/ln-data-coordinator/README.md`](../../js/ln-data-coordinator/README.md) for the coordinator-side native-submit intake this enables.

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

- Intercepts submit only to run the validation gate on scoped mutation paths (`data-ln-form-scope` + POST/PUT/PATCH method); `preventDefault()` is called only when validation fails. It never serializes and never dispatches a custom submit event — see `js/ln-data-coordinator/README.md` for what claims a valid submit.
- Performs full-form validation orchestration on scoped submit: dispatches `ln-validate:request-validate` on the form, and if any fields fail validation, prevents submission, sorts the invalid fields by document position, and focuses the first invalid one.
- No auto-submit (`data-ln-form-auto` / `data-ln-form-debounce` removed).
- No typed serialization (`data-ln-form-typed` removed).
- No submit-button disabling logic (submit button stays active; invalid submit displays inline errors).
- No `ln-form:fill` / `ln-form:reset` command events, no `ln-form:reset-complete`.

Ajax interception for non-scoped forms (if a project wants it) is a separate component's concern — it listens to the native `submit` event itself.

---

## Relation to ln-validate

`ln-form` integrates with `ln-validate` on submit for scoped mutation forms:
- On submit, `ln-form` dispatches the synchronous custom event `ln-validate:request-validate` on the form with a collector array `invalidFields` in the event detail.
- Each `ln-validate` field instance listens to this event on its parent form. If invalid, it pushes its input element to `detail.invalidFields`.
- If the collector array contains any items, `ln-form` halts submission and focuses the first invalid element in document order.
- To support this inline validation gate, any form using scoped submits **MUST** have the `novalidate` attribute set on the `<form>` markup to bypass native browser bubbles.
- `ln-validate` also listens to the native `reset` event on the form to clear field error classes and reset its internal `_touched` state.

---

## Dependencies

- `ln-core` — `dispatch`, `populateForm`, `registerComponent`.
