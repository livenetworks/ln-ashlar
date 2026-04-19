import { dispatch, registerComponent } from '../ln-core';

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

		// Emit event
		const eventName = isValid ? 'ln-validate:valid' : 'ln-validate:invalid';
		dispatch(dom, eventName, { target: dom, field: dom.name });

		return isValid;
	};

	_component.prototype.reset = function () {
		this._touched = false;
		this._customErrors.clear();
		this.dom.classList.remove(CSS_VALID, CSS_INVALID);

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
		this.dom.classList.remove(CSS_VALID, CSS_INVALID);
		dispatch(this.dom, 'ln-validate:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-validate');
})();
