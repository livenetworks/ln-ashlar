import { dispatch, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-validate';
	const DOM_ATTRIBUTE = 'lnValidate';
	const ERRORS_SELECTOR = 'data-ln-validate-errors';
	const ERROR_SELECTOR = 'data-ln-validate-error';
	const CSS_VALID = 'ln-validate-valid';
	const CSS_INVALID = 'ln-validate-invalid';

	const ERROR_MAP = {
		required: 'valueMissing',
		typeMismatch: 'typeMismatch',
		tooShort: 'tooShort',
		tooLong: 'tooLong',
		patternMismatch: 'patternMismatch',
		rangeUnderflow: 'rangeUnderflow',
		rangeOverflow: 'rangeOverflow'
	};

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._touched = false;
		this._customErrors = new Set();

		const self = this;
		const tag = dom.tagName;
		const type = dom.type;
		const isChangeBased = tag === 'SELECT' || type === 'checkbox' || type === 'radio';

		this._onInput = function () {
			self._touched = true;
			self.validate();
		};

		this._onChange = function () {
			self._touched = true;
			self.validate();
		};

		this._onSetCustom = function (e) {
			const error = e.detail && e.detail.error;
			if (!error) return;
			self._customErrors.add(error);
			self._touched = true;
			const parent = dom.closest('.form-element');
			if (parent) {
				const el = parent.querySelector('[' + ERROR_SELECTOR + '="' + error + '"]');
				if (el) el.classList.remove('hidden');
			}
			dom.classList.remove(CSS_VALID);
			dom.classList.add(CSS_INVALID);
			dom.setAttribute('aria-invalid', 'true');
		};

		this._onClearCustom = function (e) {
			const error = e.detail && e.detail.error;
			const parent = dom.closest('.form-element');
			if (error) {
				self._customErrors.delete(error);
				if (parent) {
					const el = parent.querySelector('[' + ERROR_SELECTOR + '="' + error + '"]');
					if (el) el.classList.add('hidden');
				}
			} else {
				// clear all custom errors
				self._customErrors.forEach(function (err) {
					if (parent) {
						const el = parent.querySelector('[' + ERROR_SELECTOR + '="' + err + '"]');
						if (el) el.classList.add('hidden');
					}
				});
				self._customErrors.clear();
			}
			// Re-run native validation to update visual state
			if (self._touched) self.validate();
		};

		if (!isChangeBased) {
			dom.addEventListener('input', this._onInput);
		}
		dom.addEventListener('change', this._onChange);
		dom.addEventListener('ln-validate:set-custom', this._onSetCustom);
		dom.addEventListener('ln-validate:clear-custom', this._onClearCustom);

		const form = dom.form;
		if (form) {
			// One validated field is enough to own the form's gate —
			// browser bubbles must yield to ln-validate's own error display.
			if (!form.hasAttribute('novalidate')) {
				form.setAttribute('novalidate', '');
			}

			this._onFormReset = function () {
				self.reset();
			};
			this._onValidateRequest = function (e) {
				self._touched = true;
				const isValid = self.validate();
				if (!isValid && e.detail && e.detail.invalidFields) {
					e.detail.invalidFields.push(self.dom);
				}
			};
			form.addEventListener('reset', this._onFormReset);
			form.addEventListener('ln-validate:request-validate', this._onValidateRequest);

			// Submit gate — attached once per form, by whichever validated
			// field initializes first (marker lives on the form itself,
			// same one-shot-guard shape as ln-fill's _fillBound). Runs on
			// every method, GET included — this is a straight replacement
			// for the native browser validation `novalidate` just silenced
			// above, and native validation never had a method condition
			// either. ln-data-coordinator's own POST/PUT/PATCH method gate
			// for the write pipeline is a separate, later decision — it
			// reads e.defaultPrevented first, so it never claims a submit
			// this gate already blocked.
			if (!form._lnValidateGateBound) {
				form._lnValidateGateBound = true;
				form.addEventListener('submit', function (e) {
					const validationDetail = { invalidFields: [] };
					dispatch(form, 'ln-validate:request-validate', validationDetail);

					if (validationDetail.invalidFields.length > 0) {
						e.preventDefault();
						validationDetail.invalidFields.sort((a, b) => {
							return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1;
						});
						validationDetail.invalidFields[0].focus();
					}
					// Valid — nothing left to do. Native submit continues;
					// ln-data-coordinator (document, bubble phase) or plain
					// HTML/ln-ajax decides what happens to it next.
				});
			}
		}

		return this;
	}

	_component.prototype.validate = function () {
		const dom = this.dom;
		const validity = dom.validity;
		const nativeValid = dom.checkValidity();
		const isValid = nativeValid && this._customErrors.size === 0;

		// Show/hide error messages
		const parent = dom.closest('.form-element');
		if (parent) {
			const errorList = parent.querySelector('[' + ERRORS_SELECTOR + ']');
			if (errorList) {
				const items = errorList.querySelectorAll('[' + ERROR_SELECTOR + ']');
				for (let i = 0; i < items.length; i++) {
					const errorKey = items[i].getAttribute(ERROR_SELECTOR);
					const validityProp = ERROR_MAP[errorKey];
					if (!validityProp) continue; // custom error — managed by set-custom/clear-custom
					if (validity[validityProp]) {
						items[i].classList.remove('hidden');
					} else {
						items[i].classList.add('hidden');
					}
				}
			}
		}

		// Toggle CSS classes on input
		dom.classList.toggle(CSS_VALID, isValid);
		dom.classList.toggle(CSS_INVALID, !isValid);

		// Manage ARIA invalid attribute
		dom.setAttribute('aria-invalid', isValid ? 'false' : 'true');

		// Emit event
		const eventName = isValid ? 'ln-validate:valid' : 'ln-validate:invalid';
		dispatch(dom, eventName, { target: dom, field: dom.name });

		return isValid;
	};

	_component.prototype.reset = function () {
		this._touched = false;
		this._customErrors.clear();
		this.dom.classList.remove(CSS_VALID, CSS_INVALID);
		this.dom.removeAttribute('aria-invalid');

		const parent = this.dom.closest('.form-element');
		if (parent) {
			const items = parent.querySelectorAll('[' + ERROR_SELECTOR + ']');
			for (let i = 0; i < items.length; i++) {
				items[i].classList.add('hidden');
			}
		}
	};

	Object.defineProperty(_component.prototype, 'isValid', {
		get: function () { return this.dom.checkValidity() && this._customErrors.size === 0; }
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('input', this._onInput);
		this.dom.removeEventListener('change', this._onChange);
		this.dom.removeEventListener('ln-validate:set-custom', this._onSetCustom);
		this.dom.removeEventListener('ln-validate:clear-custom', this._onClearCustom);

		const form = this.dom.form;
		if (form) {
			if (this._onFormReset) form.removeEventListener('reset', this._onFormReset);
			if (this._onValidateRequest) form.removeEventListener('ln-validate:request-validate', this._onValidateRequest);
		}

		this.dom.classList.remove(CSS_VALID, CSS_INVALID);
		this.dom.removeAttribute('aria-invalid');
		dispatch(this.dom, 'ln-validate:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-validate');
})();
