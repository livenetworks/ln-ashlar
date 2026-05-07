# ln-form

Form coordinator — manages fill, validation state, submit, reset, and
auto-submit. Works with `ln-validate` for per-field validation. Emits
`ln-form:submit` with serialized data instead of native form submission.

## Philosophy

`ln-form` is a coordinator, not a validator. The browser runs the
rules, `ln-validate` decides when to surface them, and `ln-form` only
gates the submit button by re-querying `[data-ln-validate]` fields on
every `:valid` / `:invalid` event. There is no internal field index —
adding a `[data-ln-validate]` field after init is picked up
automatically.

`ln-form:submit` carries the serialized data and stops there. No
fetch, no XHR — wire the network layer through `ln-http`, `ln-store`,
or a manual handler.

`ln-form:submit` is intentionally **not cancelable**. The submit
handler IS the gate: `ln-form` force-validates every field before
dispatching, so the handler only ever runs on valid data. Mechanism
detail (`isValid` vs button-disabled, the reset event order, the
native reset path) lives in
[docs/js/form.md](../../docs/js/form.md).

---

## HTML contract

```html
<form id="user-form" data-ln-form>
	<!-- Each field that needs validation gets data-ln-validate.      -->
	<!-- ln-form does not require ln-validate — it works without it,  -->
	<!-- but has no submit-button management unless fields are present.-->
	<div class="form-element">
		<label for="name">Name</label>
		<input id="name" name="name" required data-ln-validate>
		<ul data-ln-validate-errors>
			<li hidden data-ln-validate-error="required">Name is required</li>
		</ul>
	</div>

	<div class="form-element">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" required data-ln-validate>
		<ul data-ln-validate-errors>
			<li hidden data-ln-validate-error="required">Email is required</li>
			<li hidden data-ln-validate-error="typeMismatch">Invalid email format</li>
		</ul>
	</div>

	<!-- Footer: cancel (type="button") + save (type="submit").         -->
	<!-- No .btn class needed — global button styles handle both.       -->
	<ul class="form-actions">
		<li><button type="button" data-ln-modal-close>Cancel</button></li>
		<li><button type="submit">Save</button></li>
	</ul>
</form>
```

- `data-ln-form` on `<form>` creates the instance and runs the submit-button
  gate once at init.
- `type="button"` is required on Cancel — without it the browser treats
  the button as `type="submit"`, and Cancel submits the form.

---

## JS API

```javascript
const form = document.getElementById('user-form');

// Populate inputs by name attribute.
// Fires synthetic input/change per field so ln-validate, ln-autoresize react.
form.lnForm.fill({ name: 'Alex', email: 'a@example.com', role: 'admin' });

// Force-validate all [data-ln-validate] fields.
// Serializes and emits ln-form:submit if all pass.
// Aborts silently if any field fails (no event).
form.lnForm.submit();

// Native reset + synthetic events per field + clear validation state
// + emit ln-form:reset-complete.
form.lnForm.reset();

// Boolean getter — checks checkValidity() on all [data-ln-validate] fields.
// Does NOT check _touched. See "isValid getter vs button logic" above.
form.lnForm.isValid;

// Remove all event listeners. Emits ln-form:destroyed.
form.lnForm.destroy();
```

**Constructor** — for non-standard cases (Shadow DOM, iframe, manual
mount of dynamically inserted HTML):

```javascript
// window.lnForm(element) — runs the MutationObserver's upgrade logic
// on the given container. For normal AJAX inserts the shared observer
// handles this automatically.
window.lnForm(container);
```

---

## Attribute reference

| Attribute | On | Read | Description |
|---|---|---|---|
| `data-ln-form` | `<form>` | once at init | Creates the form coordinator instance. |
| `data-ln-form-auto` | `<form>` | once at init | Auto-submit on any `input` or `change` event. |
| `data-ln-form-debounce="300"` | `<form>` | once at init | Debounce delay in ms before auto-submit fires. Requires `data-ln-form-auto`. |

All three attributes are read **once at init**. Changing
`data-ln-form-auto` or `data-ln-form-debounce` on a live form has
no effect. To change the debounce value, call `form.lnForm.destroy()`,
update the attribute, then add `data-ln-form` back (the MutationObserver
will re-initialize).

---

## Events

### Emitted

| Event | Bubbles | Cancelable | Detail |
|---|---|---|---|
| `ln-form:submit` | yes | **no** | `{ data: Object }` — serialized form data. |
| `ln-form:reset-complete` | yes | no | `{ target: HTMLElement }` — the form element. |
| `ln-form:destroyed` | yes | no | `{ target: HTMLElement }` — the form element. |

`ln-form:submit` is intentionally not cancelable. Gate logic belongs
inside the handler; the component's force-validate pass already ensures
the handler receives only valid submissions.

### Received

| Event | Detail | Description |
|---|---|---|
| `ln-form:fill` | `{ name: value, ... }` | Populates inputs by `name` attribute. Prefer the direct API. |
| `ln-form:reset` | — | Resets the form and clears validation state. Prefer the direct API. |

Prefer the direct API (`form.lnForm.fill()`, `form.lnForm.reset()`) over
dispatching events on the form element. The received events exist for
cross-frame / detached-DOM edge cases where holding a direct reference
to the form is inconvenient.

---

## Submit-button state

`button[type="submit"]` and `input[type="submit"]` inside a
`data-ln-form` are auto-disabled based on `[data-ln-validate]` fields:

- No `[data-ln-validate]` fields → button state not managed.
- No field touched yet → disabled (fresh-form guard).
- Any field fails `checkValidity()` → disabled.
- All fields pass AND at least one was touched → enabled.

Recomputed on every `ln-validate:valid` / `:invalid` event that bubbles
to the form. Fields added after init participate automatically — no
registration step. Full event-trigger flow: see
[docs/js/form.md](../../docs/js/form.md#validation-tracking).

---

## Reset

`lnForm.reset()` clears every form control, dispatches synthetic
`input` / `change` per field so reactive children (`ln-autoresize`,
`ln-validate`) re-react, then clears validation state and emits
`ln-form:reset-complete`. Custom controls that hold their own state
outside `<input>` / `<textarea>` / `<select>` listen for
`ln-form:reset-complete` to reset themselves. Internal flow:
[docs/js/form.md](../../docs/js/form.md#reset--flow).

---

## Native `<button type="reset">` path

A native `<button type="reset">` click runs ONLY validation cleanup —
no synthetic `input` / `change` dispatch and no
`ln-form:reset-complete`. `ln-autoresize` keeps its pre-reset height,
custom listeners are not notified. Use `lnForm.reset()` (or dispatch
`ln-form:reset`) for the full reactive path. Mechanism:
[docs/js/form.md](../../docs/js/form.md#native-button-typereset-path--_onnativereset).

---

## Auto-submit + validation

With `data-ln-form-auto`, both `input` and `change` events trigger
`submit()`. With `data-ln-form-debounce="N"`, each event clears and
restarts the timer; `submit()` fires after N ms of silence.

Auto-submit forms with `[data-ln-validate]` fields force-validate on
each fire — invalid data aborts silently, no `ln-form:submit` event.

---

## What it does NOT do

- **Make network requests on submit.** `ln-form:submit` carries serialized
  data. The consumer runs the fetch. Wire via `ln-http`, `ln-store`, or
  a manual `fetch()` in the handler.
- **Validate fields itself.** Delegation is complete: `ln-validate` owns
  per-field rules, `checkValidity()`, and event dispatch. `ln-form` only
  consumes the bubbled result.
- **Manage submit-button state when no `[data-ln-validate]` fields are
  present.** If the form has no marked fields, `_updateSubmitButton()`
  early-returns. Button state is left to the browser / consumer.
- **Expose a `ln-form:before-submit` cancelable event.** Intentional —
  the force-validate pass already gates dispatch; gate logic belongs
  inside the `ln-form:submit` handler.

---

## Composes with

`ln-form` is data-only — it neither imports nor is imported by other
components. It composes with:

- **[ln-validate](../ln-validate/README.md)** — bubbled `:valid` /
  `:invalid` events drive the submit gate; `submit()` calls
  `instance.validate()` on each field; `reset()` calls
  `instance.reset()`. See
  [ln-validate README §Cross-component coordination](../ln-validate/README.md#cross-component-coordination)
  for the mirrored contract.
- **[ln-modal](../ln-modal/README.md)** — modal hosts the form on a
  separate element. No shared API; both attach to different roots.
- **[ln-autoresize](../ln-autoresize/README.md)** — receives the
  synthetic `input` events that `fill()` / `reset()` dispatch, so
  programmatic value writes re-measure correctly.
- **[ln-autosave](../ln-autosave/README.md)** — restored draft values
  fire synthetic `input` / `change` per field; `ln-validate` reacts
  and the submit gate updates automatically. Zero direct wiring.
- **ln-http / ln-store / coordinator** — listens for `ln-form:submit`
  and runs the network request. Server errors are translated into
  `ln-validate:set-custom` dispatches by the consumer's coordinator,
  not by `ln-form`.

---

## Common mistakes

### Setting `el.value` directly

`el.value = 'Alex'` is silent — neither `input` nor `change` fires.
`ln-validate` does not react, `ln-autoresize` does not re-measure, and
`ln-form`'s validation state does not update. Use `lnForm.fill({ name: 'Alex' })`.

### Relying on native `<button type="reset">` for ln-autoresize re-measure

Native reset only clears validation state. Use `lnForm.reset()` for
synthetic-event dispatch and full reactive reset.

### Calling `lnForm.fill()` on an auto-submit form

`fill()` fires synthetic `input` / `change` per field. On an auto-submit
form each of those events triggers `submit()`. If your debounce is 0,
the submit fires immediately per field; with debounce, it fires N ms
after the last fill event. This is consistent with the architecture but
can be surprising. Either populate the form before attaching
`data-ln-form-auto`, or accept the auto-submit fire.

### Trying to cancel submit via `e.preventDefault()` on `ln-form:submit`

The event is not cancelable. Gate logic goes inside the handler; the
force-validate gate is the only abort path.

### Adding a separate `addEventListener('submit', ...)` with `preventDefault()`

`ln-form` already calls `e.preventDefault()` in its own submit handler
(`_onSubmit`). A second listener with `preventDefault()` is redundant.
Listening for `ln-form:submit` instead of native `submit` is the correct
pattern.

### Mutating `data-ln-form-debounce` at runtime

Attributes are read once at init. To change the debounce: call
`lnForm.destroy()`, set the attribute, restore `data-ln-form` (the
observer re-initializes).

---

## Examples

### Standard form with validation

```html
<form id="user-form" data-ln-form>
	<div class="form-element">
		<label for="name">Name</label>
		<input id="name" name="name" required data-ln-validate>
		<ul data-ln-validate-errors>
			<li hidden data-ln-validate-error="required">Name is required</li>
		</ul>
	</div>

	<div class="form-element">
		<label for="email">Email</label>
		<input id="email" name="email" type="email" required data-ln-validate>
		<ul data-ln-validate-errors>
			<li hidden data-ln-validate-error="required">Email is required</li>
			<li hidden data-ln-validate-error="typeMismatch">Invalid email format</li>
		</ul>
	</div>

	<ul class="form-actions">
		<li><button type="button" data-ln-modal-close>Cancel</button></li>
		<li><button type="submit">Save</button></li>
	</ul>
</form>
```

### Auto-submit search form

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

### Auto-submit filter form

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

### Programmatic fill (edit mode)

```javascript
const form = document.getElementById('user-form');
form.lnForm.fill({ name: 'Alex', email: 'a@example.com', role: 'admin' });
```

### Coordinator pattern

Components don't know about each other. The coordinator is the glue:

```javascript
const table = document.getElementById('users-table');
const form  = document.getElementById('user-form');
const modal = document.getElementById('user-modal');

// Fill form from table row click
table.addEventListener('ln-data-table:row-click', function (e) {
	form.lnForm.fill(e.detail.record);
	modal.setAttribute('data-ln-modal', 'open');
});

// Submit form to server
form.addEventListener('ln-form:submit', function (e) {
	fetch('/api/users', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(e.detail.data)
	})
	.then(function (res) { return res.json(); })
	.then(function () {
		modal.setAttribute('data-ln-modal', 'close');
		// Refresh table, show toast...
	});
});
```

### Custom controls that need reset notification

Components holding their own value outside `<input>` / `<textarea>` /
`<select>` (e.g. a `<div data-my-custom-input>` storing state in JS)
cannot be cleared by DOM `input` / `change` events. Listen for
`ln-form:reset-complete`:

```javascript
form.addEventListener('ln-form:reset-complete', function () {
	myCustomInput.clear();
});
```

---

## See also

- `js/ln-validate/README.md` — per-field validation primitive.
- `js/ln-modal/README.md` — modal dialog that typically hosts forms.
- `js/ln-autoresize/README.md` — textarea auto-resize, reacts to `input`.
- `js/ln-autosave/README.md` — draft persistence; composes via synthetic events.
- `docs/js/form.md` — internal architecture for library maintainers.
