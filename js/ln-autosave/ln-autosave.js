import { dispatch, dispatchCancelable, serializeForm, populateForm, registerComponent } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-autosave';
	const DOM_ATTRIBUTE = 'lnAutosave';
	const CLEAR_SELECTOR = 'data-ln-autosave-clear';
	const DEBOUNCE_SELECTOR = 'data-ln-autosave-debounce-input';
	const STORAGE_PREFIX = 'ln-autosave:';
	const DEFAULT_DEBOUNCE_MS = 1000;

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

		let inputTimer = null;

		// Closure-scoped helpers (NOT on prototype — internal only)
		function _save() {
			const data = serializeForm(form);
			try { localStorage.setItem(key, JSON.stringify(data)); }
			catch (e) { return; }
			dispatch(form, 'ln-autosave:saved', { target: form, data: data });
		}

		function _restore() {
			let raw;
			try { raw = localStorage.getItem(key); } catch (e) { return; }
			if (!raw) return;
			let data;
			try { data = JSON.parse(raw); } catch (e) { return; }
			const before = dispatchCancelable(form, 'ln-autosave:before-restore', { target: form, data: data });
			if (before.defaultPrevented) return;
			const restored = populateForm(form, data);
			for (let k = 0; k < restored.length; k++) {
				restored[k].dispatchEvent(new Event('input', { bubbles: true }));
				// ln-select integration is via the dispatched 'change' event below.
				restored[k].dispatchEvent(new Event('change', { bubbles: true }));
			}
			dispatch(form, 'ln-autosave:restored', { target: form, data: data });
		}

		function _clear() {
			try { localStorage.removeItem(key); } catch (e) { return; }
			dispatch(form, 'ln-autosave:cleared', { target: form });
		}

		// Listener handlers (held on `this` for symmetric removal in destroy)
		this._onFocusout = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name) _save();
		};

		this._onChange = function (e) {
			const el = e.target;
			if (_isFormField(el) && el.name) _save();
		};

		this._onSubmit = function () { _clear(); };

		this._onReset = function () { _clear(); };

		this._onClearClick = function (e) {
			const btn = e.target.closest('[' + CLEAR_SELECTOR + ']');
			if (btn) _clear();
		};

		form.addEventListener('focusout', this._onFocusout);
		form.addEventListener('change',   this._onChange);
		form.addEventListener('submit',   this._onSubmit);
		form.addEventListener('reset',    this._onReset);
		form.addEventListener('click',    this._onClearClick);

		// Optional debounced input listener (opt-in via data-ln-autosave-debounce-input)
		const debounceMs = _resolveDebounceMs(form);
		if (debounceMs > 0) {
			this._onInput = function (e) {
				const el = e.target;
				if (!_isFormField(el) || !el.name) return;
				if (inputTimer !== null) clearTimeout(inputTimer);
				inputTimer = setTimeout(_save, debounceMs);
			};
			form.addEventListener('input', this._onInput);
		}

		// Thunk so destroy() can reach the closure-scoped inputTimer
		this._getInputTimer = function () { return inputTimer; };

		_restore();

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('focusout', this._onFocusout);
		this.dom.removeEventListener('change',   this._onChange);
		this.dom.removeEventListener('submit',   this._onSubmit);
		this.dom.removeEventListener('reset',    this._onReset);
		this.dom.removeEventListener('click',    this._onClearClick);
		if (this._onInput) {
			this.dom.removeEventListener('input', this._onInput);
			const t = this._getInputTimer();
			if (t !== null) clearTimeout(t);
		}
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

	function _resolveDebounceMs(form) {
		if (!form.hasAttribute(DEBOUNCE_SELECTOR)) return 0;
		const raw = form.getAttribute(DEBOUNCE_SELECTOR);
		if (raw === '' || raw === null) return DEFAULT_DEBOUNCE_MS;
		const ms = parseInt(raw, 10);
		if (isNaN(ms) || ms < 0) {
			console.warn('ln-autosave: invalid debounce value, using default', form);
			return DEFAULT_DEBOUNCE_MS;
		}
		return ms;
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-autosave');
})();
