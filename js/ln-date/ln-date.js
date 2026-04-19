import { guardBody, dispatch, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-date';
	const DOM_ATTRIBUTE = 'lnDate';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Formatter Cache ──────────────────────────────────────

	const _formatters = {};

	function _getLocale(el) {
		const langEl = el.closest('[lang]');
		return (langEl ? langEl.lang : null) || navigator.language;
	}

	function _getFormatter(locale, options) {
		const key = locale + '|' + JSON.stringify(options);
		if (!_formatters[key]) {
			_formatters[key] = new Intl.DateTimeFormat(locale, options);
		}
		return _formatters[key];
	}

	// ─── Format Detection ─────────────────────────────────────

	const KEYWORD_RE = /^(short|medium|long)(\s+datetime)?$/;

	const KEYWORD_OPTIONS = {
		'short':          { dateStyle: 'short' },
		'medium':         { dateStyle: 'medium' },
		'long':           { dateStyle: 'long' },
		'short datetime':  { dateStyle: 'short', timeStyle: 'short' },
		'medium datetime': { dateStyle: 'medium', timeStyle: 'short' },
		'long datetime':   { dateStyle: 'long', timeStyle: 'short' }
	};

	function _getIntlOptions(format) {
		if (!format || format === '') return { dateStyle: 'medium' };
		const match = format.match(KEYWORD_RE);
		if (match) {
			return KEYWORD_OPTIONS[format] || { dateStyle: 'medium' };
		}
		return null; // custom pattern
	}

	// ─── Custom Pattern Formatting ────────────────────────────

	function _formatCustom(date, pattern, locale) {
		const day = date.getDate();
		const month = date.getMonth(); // 0-based
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes();

		// Get locale-aware month names when needed
		let monthShort = '';
		let monthLong = '';
		if (pattern.indexOf('MMMM') !== -1) {
			monthLong = _getFormatter(locale, { month: 'long' }).format(date);
		}
		if (pattern.indexOf('MMM') !== -1 && pattern.indexOf('MMMM') === -1) {
			monthShort = _getFormatter(locale, { month: 'short' }).format(date);
		}

		// Replace tokens (order matters — longest first)
		let result = pattern;
		result = result.replace('yyyy', String(year));
		result = result.replace('yy', String(year).slice(-2));
		result = result.replace('MMMM', monthLong);
		result = result.replace('MMM', monthShort);
		result = result.replace('MM', String(month + 1).padStart(2, '0'));
		// Single M — must not match MM already replaced
		result = result.replace(/(?<![M0-9])M(?![M0-9])/, String(month + 1));
		result = result.replace('dd', String(day).padStart(2, '0'));
		result = result.replace(/(?<![d0-9])d(?![d0-9])/, String(day));
		result = result.replace('HH', String(hours).padStart(2, '0'));
		result = result.replace('mm', String(minutes).padStart(2, '0'));

		return result;
	}

	// ─── Format Date ──────────────────────────────────────────

	function _formatDate(date, format, locale) {
		const intlOptions = _getIntlOptions(format);
		if (intlOptions) {
			return _getFormatter(locale, intlOptions).format(date);
		}
		return _formatCustom(date, format, locale);
	}

	// ─── Constructor ──────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ────────────────────────────────────────────

	function _component(dom) {
		if (dom.tagName !== 'INPUT') {
			console.warn('[ln-date] Can only be applied to <input>, got:', dom.tagName);
			return this;
		}

		this.dom = dom;
		const self = this;

		// ── Read initial state ──────────────────────────────
		const initialValue = dom.value; // ISO string (YYYY-MM-DD) or empty
		const name = dom.name;

		// ── Create hidden input for form submission ─────────
		const hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = name;
		dom.removeAttribute('name');
		dom.insertAdjacentElement('afterend', hidden);
		this._hidden = hidden;

		// ── Create hidden date input for native picker ──────
		const picker = document.createElement('input');
		picker.type = 'date';
		picker.tabIndex = -1;
		picker.style.cssText = 'position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none';
		hidden.insertAdjacentElement('afterend', picker);
		this._picker = picker;

		// ── Transform original input to text display ────────
		dom.type = 'text';
		dom.readOnly = true;

		// ── Create calendar button ──────────────────────────
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('aria-label', 'Open date picker');
		btn.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>';
		picker.insertAdjacentElement('afterend', btn);
		this._btn = btn;

		// ── Intercept programmatic value sets on hidden input
		const originalDescriptor = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
		Object.defineProperty(hidden, 'value', {
			get: function () {
				return originalDescriptor.get.call(hidden);
			},
			set: function (val) {
				originalDescriptor.set.call(hidden, val);
				if (val && val !== '') {
					const date = _parseISO(val);
					if (date) {
						self._displayFormatted(date);
						originalDescriptor.set.call(picker, val);
					}
				} else if (val === '') {
					self.dom.value = '';
					originalDescriptor.set.call(picker, '');
				}
			}
		});

		// ── Bind events ─────────────────────────────────────
		this._onPickerChange = function () {
			const val = picker.value; // ISO YYYY-MM-DD
			if (val) {
				const date = _parseISO(val);
				if (date) {
					self._setHiddenRaw(val);
					self._displayFormatted(date);
					dispatch(self.dom, 'ln-date:change', {
						value: val,
						formatted: self.dom.value,
						date: date
					});
				}
			} else {
				self._setHiddenRaw('');
				self.dom.value = '';
				dispatch(self.dom, 'ln-date:change', {
					value: '',
					formatted: '',
					date: null
				});
			}
		};
		picker.addEventListener('change', this._onPickerChange);

		this._onDisplayClick = function () {
			self._openPicker();
		};
		dom.addEventListener('click', this._onDisplayClick);

		this._onBtnClick = function () {
			self._openPicker();
		};
		btn.addEventListener('click', this._onBtnClick);

		// ── Handle pre-filled value ─────────────────────────
		if (initialValue && initialValue !== '') {
			const date = _parseISO(initialValue);
			if (date) {
				this._setHiddenRaw(initialValue);
				originalDescriptor.set.call(picker, initialValue);
				this._displayFormatted(date);
			}
		}

		return this;
	}

	// ─── Helpers ──────────────────────────────────────────────

	function _parseISO(str) {
		// Parse YYYY-MM-DD (and optionally YYYY-MM-DDTHH:mm)
		if (!str || typeof str !== 'string') return null;
		const parts = str.split('T');
		const dateParts = parts[0].split('-');
		if (dateParts.length < 3) return null;
		const y = parseInt(dateParts[0], 10);
		const m = parseInt(dateParts[1], 10) - 1;
		const d = parseInt(dateParts[2], 10);
		if (isNaN(y) || isNaN(m) || isNaN(d)) return null;
		let h = 0, min = 0;
		if (parts[1]) {
			const timeParts = parts[1].split(':');
			h = parseInt(timeParts[0], 10) || 0;
			min = parseInt(timeParts[1], 10) || 0;
		}
		const date = new Date(y, m, d, h, min);
		// Validate the date is real (e.g., Feb 30 would roll over)
		if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) return null;
		return date;
	}

	_component.prototype._openPicker = function () {
		if (typeof this._picker.showPicker === 'function') {
			try {
				this._picker.showPicker();
			} catch (e) {
				// showPicker() can throw if not triggered by user gesture
				this._picker.click();
			}
		} else {
			this._picker.click();
		}
	};

	_component.prototype._setHiddenRaw = function (val) {
		Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(this._hidden, val);
	};

	_component.prototype._displayFormatted = function (date) {
		const format = this.dom.getAttribute(DOM_SELECTOR) || '';
		const locale = _getLocale(this.dom);
		this.dom.value = _formatDate(date, format, locale);
	};

	// ─── Public API ───────────────────────────────────────────

	Object.defineProperty(_component.prototype, 'value', {
		get: function () {
			return Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').get.call(this._hidden);
		},
		set: function (isoStr) {
			if (!isoStr || isoStr === '') {
				this._setHiddenRaw('');
				Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(this._picker, '');
				this.dom.value = '';
				return;
			}
			const date = _parseISO(isoStr);
			if (!date) return;
			this._setHiddenRaw(isoStr);
			Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(this._picker, isoStr);
			this._displayFormatted(date);
			dispatch(this.dom, 'ln-date:change', {
				value: isoStr,
				formatted: this.dom.value,
				date: date
			});
		}
	});

	Object.defineProperty(_component.prototype, 'date', {
		get: function () {
			const val = this.value;
			if (!val) return null;
			return _parseISO(val);
		},
		set: function (dateObj) {
			if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
				this.value = '';
				return;
			}
			const y = dateObj.getFullYear();
			const m = String(dateObj.getMonth() + 1).padStart(2, '0');
			const d = String(dateObj.getDate()).padStart(2, '0');
			this.value = y + '-' + m + '-' + d;
		}
	});

	Object.defineProperty(_component.prototype, 'formatted', {
		get: function () {
			return this.dom.value;
		}
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._picker.removeEventListener('change', this._onPickerChange);
		this.dom.removeEventListener('click', this._onDisplayClick);
		this._btn.removeEventListener('click', this._onBtnClick);
		// Restore original input
		this.dom.name = this._hidden.name;
		this.dom.type = 'date';
		this.dom.readOnly = false;
		const isoVal = this.value;
		// Remove created elements
		this._hidden.remove();
		this._picker.remove();
		this._btn.remove();
		// Restore value
		if (isoVal) this.dom.value = isoVal;
		dispatch(this.dom, 'ln-date:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── DOM Observer ─────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (let i = 0; i < mutations.length; i++) {
					const mutation = mutations[i];
					if (mutation.type === 'childList') {
						for (let j = 0; j < mutation.addedNodes.length; j++) {
							const node = mutation.addedNodes[j];
							if (node.nodeType === 1) {
								findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							}
						}
					} else if (mutation.type === 'attributes') {
						findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-date');
	}

	// ─── Locale Observer ──────────────────────────────────────

	function _localeObserver() {
		new MutationObserver(function () {
			const els = document.querySelectorAll('[' + DOM_SELECTOR + ']');
			for (let i = 0; i < els.length; i++) {
				const inst = els[i][DOM_ATTRIBUTE];
				if (inst && inst.value) {
					const date = _parseISO(inst.value);
					if (date) inst._displayFormatted(date);
				}
			}
		}).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
	}

	// ─── Init ─────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();
	_localeObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
