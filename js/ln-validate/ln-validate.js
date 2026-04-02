import { guardBody, dispatch, findElements } from '../ln-core';

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

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._touched = false;

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

		if (!isChangeBased) {
			dom.addEventListener('input', this._onInput);
		}
		dom.addEventListener('change', this._onChange);

		return this;
	}

	_component.prototype.validate = function () {
		const dom = this.dom;
		const validity = dom.validity;
		const isValid = dom.checkValidity();

		// Show/hide error messages
		const parent = dom.closest('.form-element');
		if (parent) {
			const errorList = parent.querySelector('[' + ERRORS_SELECTOR + ']');
			if (errorList) {
				const items = errorList.querySelectorAll('[' + ERROR_SELECTOR + ']');
				for (let i = 0; i < items.length; i++) {
					const errorKey = items[i].getAttribute(ERROR_SELECTOR);
					const validityProp = ERROR_MAP[errorKey];
					if (validityProp && validity[validityProp]) {
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
		get: function () { return this.dom.checkValidity(); }
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('input', this._onInput);
		this.dom.removeEventListener('change', this._onChange);
		this.dom.classList.remove(CSS_VALID, CSS_INVALID);
		dispatch(this.dom, 'ln-validate:destroyed', { target: this.dom });
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
		}, 'ln-validate');
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
