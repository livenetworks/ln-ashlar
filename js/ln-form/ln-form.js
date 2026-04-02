import { guardBody, dispatch, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-form';
	const DOM_ATTRIBUTE = 'lnForm';
	const AUTO_ATTR = 'data-ln-form-auto';
	const DEBOUNCE_ATTR = 'data-ln-form-debounce';
	const VALIDATE_SELECTOR = 'data-ln-validate';
	const VALIDATE_ATTRIBUTE = 'lnValidate';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		this.dom = form;
		this._invalidFields = new Set();
		this._debounceTimer = null;

		const self = this;

		this._onValid = function (e) {
			self._invalidFields.delete(e.detail.field);
			self._updateSubmitButton();
		};

		this._onInvalid = function (e) {
			self._invalidFields.add(e.detail.field);
			self._updateSubmitButton();
		};

		this._onSubmit = function (e) {
			e.preventDefault();
			self.submit();
		};

		this._onFill = function (e) {
			if (e.detail) self.fill(e.detail);
		};

		this._onFormReset = function () {
			self.reset();
		};

		this._onNativeReset = function () {
			setTimeout(function () { self._resetValidation(); }, 0);
		};

		form.addEventListener('ln-validate:valid', this._onValid);
		form.addEventListener('ln-validate:invalid', this._onInvalid);
		form.addEventListener('submit', this._onSubmit);
		form.addEventListener('ln-form:fill', this._onFill);
		form.addEventListener('ln-form:reset', this._onFormReset);
		form.addEventListener('reset', this._onNativeReset);

		// Auto-submit
		this._onAutoInput = null;
		if (form.hasAttribute(AUTO_ATTR)) {
			const debounceMs = parseInt(form.getAttribute(DEBOUNCE_ATTR)) || 0;
			this._onAutoInput = function () {
				if (debounceMs > 0) {
					clearTimeout(self._debounceTimer);
					self._debounceTimer = setTimeout(function () { self.submit(); }, debounceMs);
				} else {
					self.submit();
				}
			};
			form.addEventListener('input', this._onAutoInput);
			form.addEventListener('change', this._onAutoInput);
		}

		// Initial submit button state
		this._updateSubmitButton();

		return this;
	}

	_component.prototype._updateSubmitButton = function () {
		const buttons = this.dom.querySelectorAll('button[type="submit"], input[type="submit"]');
		if (!buttons.length) return;

		const fields = this.dom.querySelectorAll('[' + VALIDATE_SELECTOR + ']');
		let shouldDisable = false;

		if (fields.length > 0) {
			// Disable if any field is invalid OR if no fields have been touched yet
			let anyTouched = false;
			let anyInvalid = false;
			for (let i = 0; i < fields.length; i++) {
				const instance = fields[i][VALIDATE_ATTRIBUTE];
				if (instance && instance._touched) anyTouched = true;
				if (!fields[i].checkValidity()) anyInvalid = true;
			}
			shouldDisable = anyInvalid || !anyTouched;
		}

		for (let j = 0; j < buttons.length; j++) {
			buttons[j].disabled = shouldDisable;
		}
	};

	_component.prototype._serialize = function () {
		const data = {};
		const elements = this.dom.elements;

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (!el.name || el.disabled || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

			if (el.type === 'checkbox') {
				if (!data[el.name]) data[el.name] = [];
				if (el.checked) data[el.name].push(el.value);
			} else if (el.type === 'radio') {
				if (el.checked) data[el.name] = el.value;
			} else if (el.type === 'select-multiple') {
				data[el.name] = [];
				for (let j = 0; j < el.options.length; j++) {
					if (el.options[j].selected) data[el.name].push(el.options[j].value);
				}
			} else {
				data[el.name] = el.value;
			}
		}

		return data;
	};

	_component.prototype.fill = function (data) {
		const elements = this.dom.elements;
		const filled = [];

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (!el.name || !(el.name in data) || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

			const value = data[el.name];

			if (el.type === 'checkbox') {
				el.checked = Array.isArray(value) ? value.indexOf(el.value) !== -1 : !!value;
				filled.push(el);
			} else if (el.type === 'radio') {
				el.checked = el.value === String(value);
				filled.push(el);
			} else if (el.type === 'select-multiple') {
				if (Array.isArray(value)) {
					for (let j = 0; j < el.options.length; j++) {
						el.options[j].selected = value.indexOf(el.options[j].value) !== -1;
					}
				}
				filled.push(el);
			} else {
				el.value = value;
				filled.push(el);
			}
		}

		// Trigger events so ln-validate picks up the changes
		for (let k = 0; k < filled.length; k++) {
			filled[k].dispatchEvent(new Event('input', { bubbles: true }));
			filled[k].dispatchEvent(new Event('change', { bubbles: true }));
		}
	};

	_component.prototype.submit = function () {
		// Force-validate all fields
		const fields = this.dom.querySelectorAll('[' + VALIDATE_SELECTOR + ']');
		let allValid = true;

		for (let i = 0; i < fields.length; i++) {
			const instance = fields[i][VALIDATE_ATTRIBUTE];
			if (instance) {
				if (!instance.validate()) allValid = false;
			}
		}

		if (!allValid) return;

		const data = this._serialize();
		dispatch(this.dom, 'ln-form:submit', { data: data });
	};

	_component.prototype.reset = function () {
		this.dom.reset();
		this._resetValidation();
	};

	_component.prototype._resetValidation = function () {
		this._invalidFields.clear();

		const fields = this.dom.querySelectorAll('[' + VALIDATE_SELECTOR + ']');
		for (let i = 0; i < fields.length; i++) {
			const instance = fields[i][VALIDATE_ATTRIBUTE];
			if (instance) instance.reset();
		}

		this._updateSubmitButton();
	};

	Object.defineProperty(_component.prototype, 'isValid', {
		get: function () {
			const fields = this.dom.querySelectorAll('[' + VALIDATE_SELECTOR + ']');
			for (let i = 0; i < fields.length; i++) {
				if (!fields[i].checkValidity()) return false;
			}
			return true;
		}
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-validate:valid', this._onValid);
		this.dom.removeEventListener('ln-validate:invalid', this._onInvalid);
		this.dom.removeEventListener('submit', this._onSubmit);
		this.dom.removeEventListener('ln-form:fill', this._onFill);
		this.dom.removeEventListener('ln-form:reset', this._onFormReset);
		this.dom.removeEventListener('reset', this._onNativeReset);
		if (this._onAutoInput) {
			this.dom.removeEventListener('input', this._onAutoInput);
			this.dom.removeEventListener('change', this._onAutoInput);
		}
		clearTimeout(this._debounceTimer);
		dispatch(this.dom, 'ln-form:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (let i = 0; i < mutations.length; i++) {
					if (mutations[i].type === 'childList') {
						const nodes = mutations[i].addedNodes;
						for (let j = 0; j < nodes.length; j++) {
							if (nodes[j].nodeType === 1) {
								findElements(nodes[j], DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							}
						}
					} else if (mutations[i].type === 'attributes') {
						findElements(mutations[i].target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-form');
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
