import { dispatch, dispatchCancelable, serializeForm, populateForm, registerComponent } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-autosave';
	const DOM_ATTRIBUTE = 'lnAutosave';
	const CLEAR_SELECTOR = 'data-ln-autosave-clear';
	const STORAGE_PREFIX = 'ln-autosave:';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
		const data = serializeForm(this.dom);
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

		const restored = populateForm(this.dom, data);
		for (let k = 0; k < restored.length; k++) {
			restored[k].dispatchEvent(new Event('input', { bubbles: true }));
			restored[k].dispatchEvent(new Event('change', { bubbles: true }));

			if (restored[k].lnSelect && restored[k].lnSelect.setValue) {
				restored[k].lnSelect.setValue(data[restored[k].name]);
			}
		}
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

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-autosave');
})();
