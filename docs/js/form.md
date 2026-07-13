# Form — architecture

Form manipulation only: populates the form on `ln-fill`, rewrites
`action`/`_method` for RESTful edit routing. Submit is native HTML —
`ln-form` never serializes data, never dispatches a custom event, and
never listens for `submit` at all. Validation display and the submit
gate are entirely [`ln-validate`](validate.md)'s responsibility. Adding
`data-ln-form-scope` additionally opts the form into the declarative
write pipeline (see §Write Intake below): a valid submit is claimed by
`ln-data-coordinator` via its own `preventDefault()` on a document-level
`submit` listener (bubble phase).
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

Opting a form into the declarative write pipeline (form → `ln-data-coordinator` → `ln-data-store`/connector) requires the `data-ln-form-scope` attribute. Without it, a valid submit proceeds as native HTML submission (or `ln-ajax`) — `ln-validate`'s validation gate (see [`docs/js/validate.md`](validate.md)) still runs regardless of scope; `ln-form` itself has no gate.

| Attribute | On | Description |
|---|---|---|
| `data-ln-form-scope` | `<form data-ln-form>` | Opts the form into write intake. Value = **named scope**, matched against a coordinator by its `data-ln-data-coordinator="<name>"` value — the form does NOT need to be a DOM descendant of the coordinator. **Empty value** (`data-ln-form-scope=""` or bare `data-ln-form-scope`) falls back to **nearest-ancestor containment**: the form must be inside a `[data-ln-data-coordinator]` element. |

### Behavior

On `submit`, `ln-validate` runs its own gate on every form that contains
at least one `data-ln-validate` field — any method, GET included, exactly
like the native browser validation it replaces:

1. Dispatches `ln-validate:request-validate` on the form (collector `{ invalidFields: [] }`).
2. If any field is invalid: prevents the native submit, sorts invalid fields by document position, focuses the first one, and returns.
3. If every field is valid: does nothing further — the native submit proceeds. `ln-form` plays no role in either branch: it never serializes, never dispatches a custom event, and never listens for `submit`.
4. A `ln-data-coordinator` listening for the native `submit` on `document` (bubble phase) checks `e.defaultPrevented` first (skips if `ln-validate`'s gate above already blocked it, or another coordinator already claimed it), matches `data-ln-form-scope`/containment, resolves the effective method itself, and — only then — calls `preventDefault()` to claim the write. It serializes the form and routes the record through the store → queue → connector pipeline.

Methods other than `POST`/`PUT`/`PATCH` (e.g. a `GET` search form) still run `ln-validate`'s gate if the form has validated fields — an invalid GET search form is blocked the same as any other. `ln-data-coordinator` never claims a `GET` submit for the write pipeline, valid or not.

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

- No submit listener at all, and no validation orchestration. `ln-form` never dispatches `ln-validate:request-validate`, never calls `preventDefault()`, and never serializes — see `js/ln-validate/README.md` for the submit gate (owned entirely by `ln-validate`) and `js/ln-data-coordinator/README.md` for what claims a valid submit on scoped forms.
- No auto-submit (`data-ln-form-auto` / `data-ln-form-debounce` removed).
- No typed serialization (`data-ln-form-typed` removed).
- No submit-button disabling logic (submit button stays active; invalid submit displays inline errors).
- No `ln-form:fill` / `ln-form:reset` command events, no `ln-form:reset-complete`.

Ajax interception for non-scoped forms (if a project wants it) is a separate component's concern — it listens to the native `submit` event itself.

---

## Relation to ln-validate

`ln-form` and `ln-validate` are independent siblings on the same `<form>` — no imports, no method calls between them:
- `ln-validate` owns the entire submit gate (see [`docs/js/validate.md`](validate.md) §The submit gate). `ln-form` does not listen for `submit` and takes no part in it.
- `ln-form.fill()` dispatches synthetic `input`/`change` events for every populated field; `ln-validate`'s own listeners on those fields react and validate, exactly as if the user had typed the value.
- `ln-validate` injects `novalidate` on the host `<form>` the moment one of its fields initializes — authors never write `novalidate` by hand. A form with zero `data-ln-validate` fields keeps native browser validation as the default.
- `ln-validate` also listens to the native `reset` event on the form to clear field error classes and reset its internal `_touched` state — unrelated to `ln-form`'s own `reset` listener, which only restores the base `action`/`_method`.

---

## Dependencies

- `ln-core` — `dispatch`, `populateForm`, `registerComponent`.
