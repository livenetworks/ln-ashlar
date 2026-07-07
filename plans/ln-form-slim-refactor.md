# ln-form slim refactor — form manipulation only

## Decision (owner, 2026-07-05, final)

ln-ashlar components must be simple and dumb. ln-form's ONLY job is
manipulating the form element:

1. **Populate** the form when the `ln-fill` event delivers a record.
2. **RESTful action routing** — rewrite `action` + `_method` on fill,
   restore them on `form.reset()` (the existing `data-ln-form-action-edit`
   mechanism, unchanged).

Nothing else. Submit is **native HTML** — ln-form must NOT intercept it,
NOT serialize data, NOT dispatch a submit event, NOT do transport.
Interception (ajax) is a separate component's concern (e.g. ln-ajax) —
that component listens to the native `submit` event itself. Validation is
owned by the browser (constraint validation gates invalid native submits —
no form in the library uses `novalidate`) and by `ln-validate` for field
error display. ln-form drops its validation orchestration entirely.

## Scope

ONLY the ln-form component: `js/ln-form/src/ln-form.js`,
`js/ln-form/README.md`, `docs/js/form.md`, plus the repo build.
Do NOT touch ln-fill, ln-validate, ln-ajax, demo pages, or any consumer.

## 1. Replace `js/ln-form/src/ln-form.js` with exactly:

```js
import { populateForm, dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-form';
	const DOM_ATTRIBUTE = 'lnForm';
	const ACTION_EDIT_ATTR   = 'data-ln-form-action-edit';
	const ACTION_METHOD_ATTR = 'data-ln-form-action-method';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		this.dom = form;
		this._baseAction = form.getAttribute('action') || '';

		const self = this;

		this._onLnFill = function (e) {
			// Guard: only handle direct dispatches at this form, not bubbled
			// events from [data-ln-fillable] children inside the form.
			if (e.target !== self.dom) return;
			if (e.detail) {
				self.fill(e.detail);
				self._applyActionMode(e.detail);
			} else {
				// Null record = "new" mode. Native reset fires the 'reset'
				// event, which restores the base action below.
				self.dom.reset();
			}
		};

		this._onReset = function () {
			self._applyActionMode(null);
		};

		form.addEventListener('ln-fill', this._onLnFill);
		form.addEventListener('reset', this._onReset);

		return this;
	}

	_component.prototype.fill = function (data) {
		const filled = populateForm(this.dom, data);

		// Trigger events so reactive consumers (ln-validate, ln-autoresize)
		// pick up the changes. SELECT/checkbox/radio -> 'change',
		// everything else -> 'input'.
		for (let k = 0; k < filled.length; k++) {
			const el = filled[k];
			const isChangeBased = el.tagName === 'SELECT' || el.type === 'checkbox' || el.type === 'radio';
			el.dispatchEvent(new Event(isChangeBased ? 'change' : 'input', { bubbles: true }));
		}
	};

	_component.prototype._ensureMethodInput = function () {
		let input = this.dom.querySelector('input[name="_method"]');
		if (!input) {
			input = document.createElement('input');
			input.type  = 'hidden';
			input.name  = '_method';
			input.value = '';
			this.dom.appendChild(input);
		}
		return input;
	};

	_component.prototype._applyActionMode = function (record) {
		if (!this.dom.hasAttribute(ACTION_EDIT_ATTR)) return;

		const id = record && record.id != null && record.id !== '' ? record.id : null;
		const methodInput = this._ensureMethodInput();

		if (id !== null) {
			const template = this.dom.getAttribute(ACTION_EDIT_ATTR);
			if (template) {
				this.dom.setAttribute('action', template.replace(':id', encodeURIComponent(id)));
			} else {
				this.dom.setAttribute('action', this._baseAction.replace(/\/$/, '') + '/' + encodeURIComponent(id));
			}
			methodInput.value = this.dom.getAttribute(ACTION_METHOD_ATTR) || 'PUT';
		} else {
			this.dom.setAttribute('action', this._baseAction);
			methodInput.value = '';
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-fill', this._onLnFill);
		this.dom.removeEventListener('reset', this._onReset);
		dispatch(this.dom, 'ln-form:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-form');
})();
```

Tabs for indentation (as in the block above). This removes, deliberately:
`serializeForm`, the `submit` listener + `preventDefault`, the
`ln-form:submit` event, `data-ln-form-typed`, `data-ln-form-auto` +
`data-ln-form-debounce`, submit-button disable logic
(`_updateSubmitButton` + `ln-validate:valid/invalid` listeners), the
`ln-form:fill` / `ln-form:reset` command events, the `reset()` method with
its redispatch machinery, `ln-form:reset-complete`, `_resetValidation`,
and the `isValid` getter.

## 2. Rewrite `js/ln-form/README.md`

Document ONLY the slim contract, following the structure/tone of a
completed component README in this repo (pick one as benchmark, e.g.
ln-toggle or ln-fill):

- Purpose: form manipulation — populate on `ln-fill`, RESTful action
  routing. Submit is native; ln-form never intercepts it.
- Forms MUST carry real `action` + `method` in HTML (HTML-first; without
  JS they do a normal native submit; PUT/DELETE ride on POST via the
  auto-ensured hidden `_method` input — Laravel method spoofing).
- Attributes: `data-ln-form`, `data-ln-form-action-edit` (opt-in; empty =
  `baseAction + '/' + id`, non-empty = `:id` template),
  `data-ln-form-action-method` (default `PUT`).
- Fill state table (new vs edit → action / `_method` value) — keep from
  the existing README's "RESTful action routing" section.
- Events: consumes `ln-fill` (record | null); emits `ln-form:destroyed`.
- A short "What ln-form does NOT do" section: no transport, no
  serialization, no validation (browser constraint validation +
  ln-validate), no submit event — ajax interception belongs to a
  transport component listening to the native `submit` event.
- Remove all documentation of the deleted attributes/events listed above.

## 3. Truth-sync `docs/js/form.md`

Same contract as the README, in that file's existing style. Remove
references to removed events/attributes.

## 4. Build + verify

- Run `npm run build` in `c:\laragon\www\ln-ashlar` (builds standalone
  bundles + demos CSS; demo HTML/JS referencing removed events will still
  build — dead references at runtime are EXPECTED and out of scope).
- Verify compiled `js/ln-form/ln-form.js` no longer contains
  `ln-form:submit`, `serializeForm`, `data-ln-form-auto`,
  `data-ln-form-typed` and DOES contain `data-ln-form-action-edit`.

## Acceptance criteria

1. `js/ln-form/src/ln-form.js` matches the source above (≈115 lines).
2. Grep of `js/ln-form/src/ln-form.js` finds NO: `serializeForm`,
   `'submit'`, `ln-form:submit`, `AUTO_ATTR`, `TYPED_ATTR`, `DEBOUNCE`,
   `_updateSubmitButton`, `ln-form:reset-complete`.
3. README + docs/js/form.md contain `data-ln-form-action-edit` and no
   `data-ln-form-typed` / `data-ln-form-auto` / `ln-form:submit` (except
   optionally inside an explicit "removed / does not do" note).
4. Build exits 0; compiled bundle checks per §4 pass.

## Report back (do not fix)

List every in-repo location (demo pages, other components' docs) that
still references the removed ln-form events/attributes — follow-ups are
handled separately. Also note that ln-validate currently relies on ln-form
to reset field error state on form reset; that responsibility now has no
owner (known follow-up for ln-validate, out of scope).
