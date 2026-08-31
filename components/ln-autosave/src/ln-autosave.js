import { dispatch, dispatchCancelable, populateForm, registerComponent, serializeForm } from '../../ln-core';
import { buildAutosaveKey, parseAutosaveDebounce } from './autosave-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-autosave';
	const DOM_ATTRIBUTE = 'lnAutosave';
	const CLEAR_SELECTOR = 'data-ln-autosave-clear';
	const DEBOUNCE_SELECTOR = 'data-ln-autosave-debounce-input';
	const EXCLUDE_SELECTOR = '[data-ln-autosave-exclude], input[type="password"]';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _isFormField(el) {
		const tag = el.tagName;
		return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(form) {
		const value = form.getAttribute(DOM_SELECTOR);
		const identifier = value || form.id;
		const key = buildAutosaveKey(window.location.pathname, identifier);

		if (!key) {
			console.warn('ln-autosave: form needs an id or data-ln-autosave value', form);
			return;
		}

		this.dom = form;
		this.key = key;

		let inputTimer = null;

		function _save() {
			const data = serializeForm(form, { exclude: EXCLUDE_SELECTOR });
			try {
				localStorage.setItem(key, JSON.stringify(data));
			} catch (_) {
				return;
			}
			dispatch(form, 'ln-autosave:saved', { target: form, data: data });
		}

		function _restore() {
			let raw;
			try {
				raw = localStorage.getItem(key);
			} catch (_) {
				return;
			}
			if (!raw) return;
			let data;
			try {
				data = JSON.parse(raw);
			} catch (_) {
				return;
			}
			const before = dispatchCancelable(form, 'ln-autosave:before-restore', { target: form, data: data });
			if (before.defaultPrevented) return;
			const restored = populateForm(form, data);
			for (let k = 0; k < restored.length; k++) {
				restored[k].dispatchEvent(new Event('input', { bubbles: true }));
				restored[k].dispatchEvent(new Event('change', { bubbles: true }));
			}
			dispatch(form, 'ln-autosave:restored', { target: form, data: data });
		}

		function _clear() {
			try {
				localStorage.removeItem(key);
			} catch (_) {
				return;
			}
			dispatch(form, 'ln-autosave:cleared', { target: form });
		}

		this._onFocusout = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name && !el.matches(EXCLUDE_SELECTOR)) _save();
		};

		this._onChange = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name && !el.matches(EXCLUDE_SELECTOR)) _save();
		};

		this._onSubmit = function () {
			_clear();
		};

		this._onReset = function () {
			_clear();
		};

		this._onClearClick = function (e) {
			const btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
			if (btn) _clear();
		};

		form.addEventListener('focusout', this._onFocusout);
		form.addEventListener('change', this._onChange);
		form.addEventListener('submit', this._onSubmit);
		form.addEventListener('reset', this._onReset);
		form.addEventListener('click', this._onClearClick);

		const debounceMs = parseAutosaveDebounce(form.getAttribute(DEBOUNCE_SELECTOR));
		if (debounceMs > 0) {
			this._onInput = function (e) {
				const el = e.target;
				if (!_isFormField(el) || !el.name || el.matches(EXCLUDE_SELECTOR)) return;
				if (inputTimer !== null) clearTimeout(inputTimer);
				inputTimer = setTimeout(_save, debounceMs);
			};
			form.addEventListener('input', this._onInput);
		}

		this._getInputTimer = function () {
			return inputTimer;
		};

		_restore();
		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('focusout', this._onFocusout);
		this.dom.removeEventListener('change', this._onChange);
		this.dom.removeEventListener('submit', this._onSubmit);
		this.dom.removeEventListener('reset', this._onReset);
		this.dom.removeEventListener('click', this._onClearClick);
		if (this._onInput) {
			this.dom.removeEventListener('input', this._onInput);
			const t = this._getInputTimer();
			if (t !== null) clearTimeout(t);
		}
		dispatch(this.dom, 'ln-autosave:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-autosave');
})();
