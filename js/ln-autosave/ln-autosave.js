import { guardBody, dispatch, dispatchCancelable } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-autosave';
	const DOM_ATTRIBUTE = 'lnAutosave';
	const CLEAR_SELECTOR = 'data-ln-autosave-clear';
	const STORAGE_PREFIX = 'ln-autosave:';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		const key = _getStorageKey(form);
		if (!key) {
			console.warn('ln-autosave: form needs an id or data-ln-autosave value', form);
			return;
		}

		this.dom = form;
		this.key = key;

		const self = this;

		this._onFocusout = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name) {
				self.save();
			}
		};

		this._onChange = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name) {
				self.save();
			}
		};

		this._onSubmit = function () {
			self.clear();
		};

		this._onReset = function () {
			self.clear();
		};

		this._onClearClick = function (e) {
			const btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
			if (btn) self.clear();
		};

		form.addEventListener('focusout', this._onFocusout);
		form.addEventListener('change', this._onChange);
		form.addEventListener('submit', this._onSubmit);
		form.addEventListener('reset', this._onReset);
		form.addEventListener('click', this._onClearClick);

		this.restore();

		return this;
	}

	_component.prototype.save = function () {
		const data = _serialize(this.dom);
		try {
			localStorage.setItem(this.key, JSON.stringify(data));
		} catch (e) {
			return;
		}
		dispatch(this.dom, 'ln-autosave:saved', { target: this.dom, data: data });
	};

	_component.prototype.restore = function () {
		let raw;
		try {
			raw = localStorage.getItem(this.key);
		} catch (e) {
			return;
		}
		if (!raw) return;

		let data;
		try {
			data = JSON.parse(raw);
		} catch (e) {
			return;
		}

		const before = dispatchCancelable(this.dom, 'ln-autosave:before-restore', { target: this.dom, data: data });
		if (before.defaultPrevented) return;

		_populateForm(this.dom, data);
		dispatch(this.dom, 'ln-autosave:restored', { target: this.dom, data: data });
	};

	_component.prototype.clear = function () {
		try {
			localStorage.removeItem(this.key);
		} catch (e) {
			return;
		}
		dispatch(this.dom, 'ln-autosave:cleared', { target: this.dom });
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('focusout', this._onFocusout);
		this.dom.removeEventListener('change', this._onChange);
		this.dom.removeEventListener('submit', this._onSubmit);
		this.dom.removeEventListener('reset', this._onReset);
		this.dom.removeEventListener('click', this._onClearClick);
		dispatch(this.dom, 'ln-autosave:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _getStorageKey(form) {
		const value = form.getAttribute(DOM_SELECTOR);
		const identifier = value || form.id;
		if (!identifier) return null;
		return STORAGE_PREFIX + window.location.pathname + ':' + identifier;
	}

	function _isFormField(el) {
		const tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
	}

	function _serialize(form) {
		const data = {};
		const elements = form.elements;

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
	}

	function _populateForm(form, data) {
		const elements = form.elements;
		const restored = [];

		for (let i = 0; i < elements.length; i++) {
			const el = elements[i];
			if (!el.name || !(el.name in data) || el.type === 'file' || el.type === 'submit' || el.type === 'button') continue;

			const value = data[el.name];

			if (el.type === 'checkbox') {
				el.checked = Array.isArray(value) && value.indexOf(el.value) !== -1;
				restored.push(el);
			} else if (el.type === 'radio') {
				el.checked = el.value === value;
				restored.push(el);
			} else if (el.type === 'select-multiple') {
				if (Array.isArray(value)) {
					for (let j = 0; j < el.options.length; j++) {
						el.options[j].selected = value.indexOf(el.options[j].value) !== -1;
					}
				}
				restored.push(el);
			} else {
				el.value = value;
				restored.push(el);
			}
		}

		for (let k = 0; k < restored.length; k++) {
			restored[k].dispatchEvent(new Event('input', { bubbles: true }));
			restored[k].dispatchEvent(new Event('change', { bubbles: true }));

			if (restored[k].lnSelect && restored[k].lnSelect.setValue) {
				restored[k].lnSelect.setValue(data[restored[k].name]);
			}
		}
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (let i = 0; i < mutations.length; i++) {
					if (mutations[i].type === 'childList') {
						const nodes = mutations[i].addedNodes;
						for (let j = 0; j < nodes.length; j++) {
							if (nodes[j].nodeType === 1) {
								_findElements(nodes[j]);
							}
						}
					} else if (mutations[i].type === 'attributes') {
						_findElements(mutations[i].target);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-autosave');
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
