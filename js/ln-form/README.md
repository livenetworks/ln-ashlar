# ln-form

Form coordinator — manages fill, validation state, submit, reset, and
auto-submit. Works with `ln-validate` for per-field validation. Emits
`ln-form:submit` with serialized data instead of native form submission.

## Philosophy

### ln-form is a coordinator, not a validator

`ln-form` does not run validation rules. The browser runs them, and
`ln-validate` decides when to surface the result. `ln-form`'s only
validation concern is **coordinating the submit-button gate** based on
what the fields report.

It does this by listening for `ln-validate:valid` / `ln-validate:invalid`
events that bubble from child fields. Each bubbled event is a **trigger**
— a signal to re-evaluate state. On each trigger, `_updateSubmitButton()`
re-queries every `[data-ln-validate]` field and reads `field.checkValidity()`
and `instance._touched` directly from the DOM and the validate instance.
`checkValidity()` is the source of truth, not an internal index.

The implication: if you add a `[data-ln-validate]` field after the form
initializes, it is picked up automatically on the next event — there is
nothing to register.

### Submit produces a data event, not a network request

`ln-form:submit` carries the serialized form data in `e.detail.data`.
The component stops there. No `fetch`, no `XMLHttpRequest`, no server
roundtrip. Wire the network layer via `ln-http`, `ln-store`, a
coordinator, or a manual `fetch()` in your event handler.

This keeps `ln-form` ignorant of server state, which means it also does
not know about server-side errors. If you need server errors to block
the submit button, see "What it does NOT do" and "Cross-component
composition" below.

### Reset is reactive

`lnForm.reset()` calls `dom.reset()` to clear `.value` on every form
control, then dispatches a synthetic `input` or `change` event on every
field (same `isChangeBased` discriminator as `fill()`). Those events
wake up `ln-autoresize` (which shrinks back to initial height),
`ln-validate` (which re-validates), and any custom listener that keys
off `input` / `change`. After the dispatch loop, `_resetValidation()`
clears the transient validation state left by the synthetic events.

Native `<button type="reset">` does NOT go through this path. See
"Native `<button type="reset">` path" below.

### There is no before-submit cancelable event — intentional

`ln-form:submit` is not cancelable. `e.preventDefault()` inside a
`ln-form:submit` handler is a no-op. This is deliberate.

The submit handler IS the gate. When the user clicks submit, `ln-form`
force-validates every `[data-ln-validate]` field. If any field fails,
the submit aborts silently — no `ln-form:submit` event is dispatched.
The submit handler therefore receives only valid-form submissions.
Consumers that want post-validation logic (e.g. "wait for a CAPTCHA")
add it inside the `ln-form:submit` handler, not a before-event.

### `isValid` getter ≠ submit-button logic

These two answer different questions:

- **`form.lnForm.isValid`** — "Is the form's data acceptable for
  submission right now?" Checks `field.checkValidity()` across all
  `[data-ln-validate]` fields. Ignores `_touched`.
- **Submit button `disabled`** — "Is the form in a state where the
  user should be invited to submit?" Checks BOTH `checkValidity()`
  AND `instance._touched`. A fresh form with no interaction has
  `isValid === true` (if no required fields are blank by default)
  but Save is still disabled — no field has been touched yet, so
  the "you haven't started" guard keeps the button disabled.

This is **deliberate and observable**. The two surfaces answer
different questions and should not be conflated.

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

What each piece does:

- `data-ln-form` on `<form>` — creates the component instance. The
  coordinator attaches its listeners immediately and runs
  `_updateSubmitButton()` once at init.
- `data-ln-validate` on inputs — marks the field as part of the
  validation gate. `ln-form` only manages button state and the
  submit gate for marked fields.
- `type="button"` on Cancel — required. Without it the browser
  treats the button as `type="submit"`, causing Cancel to submit
  the form.
- No class on buttons — `type="submit"` gets primary fill from
  the library's global button styling. Cancel inherits neutral.

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

**Mutations through requests, queries through API.** Reading
`form.lnForm.isValid` is fine. Calling `form.lnForm.reset()` is fine.
Setting the instance properties directly (`form.lnForm._debounceTimer =
null`) is not — it bypasses the component's own cleanup. Always go
through the public methods.

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

The submit button is automatically disabled/enabled based on validation.
State is computed by `_updateSubmitButton()` on every `ln-validate:valid`
/ `ln-validate:invalid` event that bubbles to the form, and once at init.

Rules:

- If no `[data-ln-validate]` fields exist → button state is not managed.
- If `[data-ln-validate]` fields exist:
  - **No field has been touched yet** → disabled (fresh-form guard).
  - **Any field fails `checkValidity()`** → disabled.
  - **All fields pass `checkValidity()` AND at least one was touched** → enabled.

Targets: `button[type="submit"]` and `input[type="submit"]` within the
form. All are set to the same `disabled` value — no "primary submit only"
distinction.

The guard logic re-queries `[data-ln-validate]` and reads
`instance._touched` + `field.checkValidity()` on **every trigger event**,
not from a cached Set. This means a field added to the form after init is
picked up automatically on the next user interaction.

---

## Validation flow

1. User interacts with a field → `ln-validate` dispatches
   `ln-validate:valid` or `ln-validate:invalid` (bubbles up to the form).
2. `ln-form._onValid` / `._onInvalid` catches the event and calls
   `_updateSubmitButton()`. The event's `detail` is ignored — the handler
   is a pure re-evaluation trigger.
3. `_updateSubmitButton()` re-queries all `[data-ln-validate]` fields,
   reads `instance._touched` and `field.checkValidity()` per field, and
   sets `submit.disabled = anyInvalid || !anyTouched`.
4. On submit: `ln-form.submit()` force-validates each field via
   `instance.validate()`. If any return false, abort. Otherwise serialize
   + dispatch `ln-form:submit`.

---

## Reset flow

`lnForm.reset()` does four things in order:

1. **Native form reset** — `dom.reset()` clears `.value` on every form
   control to its default.
2. **Synthetic input/change dispatch** — for each `<input>`, `<textarea>`,
   `<select>` in the form, dispatch `input` (or `change` for SELECT,
   checkbox, radio — same `isChangeBased` discriminator as `fill()`). This
   wakes reactive children:
   - `ln-autoresize` re-measures and shrinks to initial height.
   - `ln-validate` re-validates the now-empty value (transient — see step 3).
3. **Validation cleanup** — `_resetValidation()` calls `instance.reset()`
   on every `[data-ln-validate]` field (clears `_touched`, removes classes,
   hides error messages), then calls `_updateSubmitButton()`.
4. **`ln-form:reset-complete`** — dispatched on the form element. Custom
   controls that hold their own value outside `<input>` / `<textarea>` /
   `<select>` listen for this to reset themselves.

Step 2 MUST run before step 3. The synthetic events trigger `ln-validate`
to mark default-empty required fields as invalid. Step 3 then clears that
transient state. Reordering would leave fields visibly invalid after reset.

`ln-form:reset-complete` is named to avoid clashing with the incoming
`ln-form:reset` request event — the form's listener for `ln-form:reset`
calls `this.reset()`, which dispatches `reset-complete`. The distinct names
prevent recursion.

---

## Native `<button type="reset">` path

When a `<button type="reset">` inside the form is clicked, the browser
fires a native `reset` event. `ln-form` listens for it and runs:

```javascript
this._onNativeReset = function () {
	setTimeout(function () { self._resetValidation(); }, 0);
};
```

This is the minimal path: only `_resetValidation()`, deferred by one
tick so the browser has applied the reset to the DOM first.

**What is NOT on this path:**

- Synthetic `input` / `change` dispatch — `ln-autoresize` keeps its
  height; custom listeners do not re-react.
- `ln-form:reset-complete` dispatch — custom controls are not notified.

This is deliberate. The native path is platform behavior, kept minimal
so projects that opt into it get exactly what HTML defines. Use
`lnForm.reset()` or dispatch `ln-form:reset` for the full reactive reset.

---

## Auto-submit + validation interaction

When `data-ln-form-auto` is present, both `input` and `change` events on
the form trigger `submit()`. With `data-ln-form-debounce="N"`, each event
clears and restarts a timer; `submit()` fires only after N ms of silence.

Auto-submit forms typically have no `[data-ln-validate]` fields — `submit()`
serializes and dispatches immediately without validation gating.

If they do have `[data-ln-validate]` fields, each `input` / `change` event
triggers `submit()`, which force-validates via `instance.validate()`. A
failed validation aborts the auto-submit silently — no event dispatched,
no network call. The user-perceived effect: invalid fields show errors,
no submit fires.

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
- **Expose a `ln-form:before-submit` cancelable event.** Intentional.
  The submit handler IS the gate. The force-validate pass ensures the
  handler only runs on valid data.
- **Track invalid fields in a Set.** The `_invalidFields` Set was removed
  (it was initialized and mutated but never read — `_updateSubmitButton`
  always re-queried the DOM). If you are migrating from a pre-cleanup
  version: there is no `_invalidFields` on the instance. Use
  `form.lnForm.isValid` or read the `ln-validate:valid` / `:invalid`
  event flow directly.
- **Clear `_debounceTimer` on `_resetValidation()`.** Calling
  `lnForm.reset()` mid-debounce on an auto-submit form WILL fire the
  queued submit on the now-empty form. This is known behavior — the timer
  runs `submit()`, which force-validates and aborts (fields are empty,
  native `required` fails). In practice the aborted submit is silent. If
  you need to cancel the timer explicitly, do
  `clearTimeout(form.lnForm._debounceTimer)` before calling `reset()`.
- **Cancel a queued auto-submit when fields become invalid mid-debounce.**
  Each `input` / `change` event clears and restarts the timer. The timer
  eventually fires `submit()`, which force-validates and aborts if invalid.
  Bad data won't reach the server, but the timer fire itself cannot be
  suppressed mid-flight.

---

## Cross-component composition

### ln-form + ln-modal

Modal hosts the form. `data-ln-modal` on the overlay, `data-ln-form` on
the `<form>` — different elements, no overlap:

```html
<div class="ln-modal" data-ln-modal id="user-modal">
	<form data-ln-form>
		<header>
			<h3>Edit User</h3>
			<button type="button" data-ln-modal-close aria-label="Close">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
			</button>
		</header>
		<main>
			<div class="form-element">
				<label for="name">Name</label>
				<input id="name" name="name" required data-ln-validate>
				<ul data-ln-validate-errors>
					<li hidden data-ln-validate-error="required">Name is required</li>
				</ul>
			</div>
		</main>
		<footer>
			<button type="button" data-ln-modal-close>Cancel</button>
			<button type="submit">Save</button>
		</footer>
	</form>
</div>
```

Neither component imports the other. `ln-modal` owns the overlay state;
`ln-form` owns form submission. They coexist because they attach to
different elements.

### ln-form + ln-validate

The core composition. `ln-form` reads two surfaces from `ln-validate`:

- `instance._touched` — read inside `_updateSubmitButton()` to guard the
  fresh-form case.
- `instance.validate()` — called on every `[data-ln-validate]` field
  during the force-validate gate in `submit()`.
- `instance.reset()` — called on every `[data-ln-validate]` field during
  `_resetValidation()`.

Events go the other direction: `ln-validate` dispatches `:valid` /
`:invalid`; `ln-form` listens. These are the only touch points — no
shared module, no import.

### ln-form + ln-autoresize

`ln-autoresize` listens to `input` events. `lnForm.fill()` and
`lnForm.reset()` dispatch synthetic `input` per text field, so
`ln-autoresize` re-measures correctly after programmatic value writes.
No direct integration — they share the platform event.

### ln-form + ln-autosave

Independent. `ln-autosave` restores draft values by calling
`populateForm()` and dispatching synthetic `input` / `change` per field.
Those events are caught by `ln-validate`'s own listeners (which set
`_touched = true` and run `validate()`), which in turn dispatch
`:valid` / `:invalid` up to `ln-form`. The submit-button state reflects
the restored draft's validity automatically — with zero direct wiring
between `ln-autosave` and `ln-form`.

### ln-form + ln-http / ln-store

`ln-form` emits `ln-form:submit` with serialized data. `ln-http` (or a
coordinator) listens for it and runs the network request. Server-side
errors are dispatched as `ln-form:error` on the form element by the data
layer. `ln-validate` does NOT subscribe to `ln-form:error` — a
coordinator or application code translates server errors into
`ln-validate:set-custom` dispatches per field, then calls
`instance.validate()` to push the `:invalid` event that updates the
submit-button gate.

---

## Common mistakes

### Setting `el.value` directly

`el.value = 'Alex'` is silent — neither `input` nor `change` fires.
`ln-validate` does not react, `ln-autoresize` does not re-measure, and
`ln-form`'s validation state does not update. Use `lnForm.fill({ name: 'Alex' })`.

### Relying on native `<button type="reset">` for ln-autoresize re-measure

The native reset path runs `_resetValidation()` only — no synthetic
`input` dispatch. `ln-autoresize` keeps its pre-reset height. Use
`lnForm.reset()` or dispatch `ln-form:reset` for the full reactive path.

### Calling `lnForm.fill()` on an auto-submit form

`fill()` fires synthetic `input` / `change` per field. On an auto-submit
form each of those events triggers `submit()`. If your debounce is 0,
the submit fires immediately per field; with debounce, it fires N ms
after the last fill event. This is consistent with the architecture but
can be surprising. Either populate the form before attaching
`data-ln-form-auto`, or accept the auto-submit fire.

### Listening for "valid form" via `_invalidFields`

The `_invalidFields` Set was removed. It was never the right API — it
tracked field names as strings, which collapsed nameless fields and
could be stale. Use `form.lnForm.isValid` for a synchronous boolean
check, or listen to `ln-validate:valid` / `:invalid` events at the form
level for reactive tracking.

### Trying to cancel submit via `e.preventDefault()` on `ln-form:submit`

`ln-form:submit` is not cancelable. `e.preventDefault()` is a no-op. The
force-validate gate (which runs before the event is dispatched) is the
only abort path. Gate logic belongs inside the `ln-form:submit` handler.

### Adding a separate `addEventListener('submit', ...)` with `preventDefault()`

`ln-form` already calls `e.preventDefault()` in its own submit handler
(`_onSubmit`). A second listener with `preventDefault()` is redundant.
Listening for `ln-form:submit` instead of native `submit` is the correct
pattern.

### Mutating `data-ln-form-debounce` at runtime

Attributes are read once at init. Changing `data-ln-form-debounce` on a
live form has no effect. To change the debounce: call `form.lnForm.destroy()`,
update the attribute, then restore `data-ln-form` (the MutationObserver
re-initializes).

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

## Edge cases

- **Form with no fields.** `submit()` passes the force-validate loop
  (no iterations), serializes, and dispatches `ln-form:submit` with
  empty data. The form is always "valid" in the trivial sense.
- **Form with `[data-ln-validate]` but no submit button.**
  `_updateSubmitButton()` early-returns (`if (!buttons.length) return`).
  No error, no loop — safe no-op.
- **Form with multiple submit buttons.** All are targeted by
  `querySelectorAll('button[type="submit"], input[type="submit"]')`.
  All get the same `disabled` value simultaneously.
- **`dom.reset()` called externally** (not via `lnForm.reset()`).
  The browser fires a native `reset` event, which triggers
  `_onNativeReset`, which runs `_resetValidation()` only. Synthetic
  events and `ln-form:reset-complete` are not dispatched.
- **Field added to the form after init.** Picked up automatically.
  `_updateSubmitButton()` re-queries on every event — there is no
  static field index. The new field participates in the submit gate
  as soon as the user interacts with any field.
- **`lnForm.submit()` called when an auto-submit timer is queued.**
  Submit fires immediately. The queued timer eventually fires again
  (another `submit()` call). In most cases this is a double-serialize
  of an already-submitted form — usually harmless (the server sees two
  identical requests). In advanced cases, do
  `clearTimeout(form.lnForm._debounceTimer)` before calling `submit()`
  manually.

---

## See also

- `js/ln-validate/README.md` — per-field validation primitive.
- `js/ln-modal/README.md` — modal dialog that typically hosts forms.
- `js/ln-autoresize/README.md` — textarea auto-resize, reacts to `input`.
- `js/ln-autosave/README.md` — draft persistence; composes via synthetic events.
- `docs/js/form.md` — internal architecture for library maintainers.
