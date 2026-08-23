import { dispatch, getLocale, registerComponent, interceptValueProperty, ensureLocaleObserver } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-number';
	const DOM_ATTRIBUTE = 'lnNumber';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Formatter Cache ──────────────────────────────────────

	const _formatters = {};
	const _inputValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

	function _getFormatter(locale) {
		if (!_formatters[locale]) {
			const fmt = new Intl.NumberFormat(locale, { useGrouping: true });
			const parts = fmt.formatToParts(1234.5);
			let groupSep = '';
			let decimalSep = '.';
			for (let i = 0; i < parts.length; i++) {
				if (parts[i].type === 'group') groupSep = parts[i].value;
				if (parts[i].type === 'decimal') decimalSep = parts[i].value;
			}
			_formatters[locale] = { fmt: fmt, groupSep: groupSep, decimalSep: decimalSep };
		}
		return _formatters[locale];
	}

	function _formatNum(locale, num, maxDecimals) {
		if (maxDecimals !== null) {
			const max = parseInt(maxDecimals, 10);
			const key = locale + '|d' + max;
			if (!_formatters[key]) {
				_formatters[key] = new Intl.NumberFormat(locale, { useGrouping: true, minimumFractionDigits: 0, maximumFractionDigits: max });
			}
			return _formatters[key].format(num);
		}
		return _getFormatter(locale).fmt.format(num);
	}

	// ─── Component ─────────────────────────────────────────────

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		dom[DOM_ATTRIBUTE] = this;
		this.dom = dom;
		const self = this;

		// ── Subscribe to global locale changes ──────────────
		this._onLocaleChange = function () {
			if (self.isTextElement) {
				self._formatTextContent();
			} else if (!isNaN(self.value)) {
				self._displayFormatted(self.value);
			}
		};
		ensureLocaleObserver();
		document.addEventListener('ln-core:locale-change', this._onLocaleChange);

		if (dom.tagName !== 'INPUT') {
			this.isTextElement = true;
			this._initTextElement();
			return this;
		}

		// ── Create hidden input ─────────────────────────────
		const hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = dom.name;
		dom.removeAttribute('name');
		if (dom.hasAttribute('data-ln-fill-as')) {
			hidden.setAttribute('data-ln-fill-as', dom.getAttribute('data-ln-fill-as'));
		}
		dom.type = 'text';
		dom.setAttribute('inputmode', 'decimal');
		dom.insertAdjacentElement('afterend', hidden);
		this._hidden = hidden;

		// ── Intercept programmatic value sets on hidden input ──
		Object.defineProperty(hidden, 'value', {
			get: function () {
				return _inputValueDesc.get.call(hidden);
			},
			set: function (val) {
				_inputValueDesc.set.call(hidden, val);                      // store raw natively
				if (val !== '' && !isNaN(parseFloat(val))) {
					self._setDisplayRaw(_formatNum(getLocale(self.dom), parseFloat(val), self.dom.getAttribute('data-ln-number-decimals')));
				} else {
					self._setDisplayRaw('');
				}
				self.dom.dispatchEvent(new Event('input', { bubbles: true })); // single ecosystem signal → _handleInput emits ln-number:input
			}
		});

		// ── Intercept programmatic value sets on visible input (2-way binding) ──
		interceptValueProperty(dom, _inputValueDesc, {
			get: function () {
				return _inputValueDesc.get.call(dom);
			},
			set: function (val) {
				if (val === '') {
					self._setDisplayRaw('');
					self._setHiddenRaw('');
					dom.dispatchEvent(new Event('input', { bubbles: true }));
					return;
				}
				const num = typeof val === 'number' ? val : parseFloat(String(val).replace(/[^\d.-]/g, ''));
				if (isNaN(num)) {
					self._setDisplayRaw(String(val));
					self._setHiddenRaw('');
				} else {
					self._setHiddenRaw(num);
					self._setDisplayRaw(_formatNum(getLocale(dom), num, dom.getAttribute('data-ln-number-decimals')));
				}
				dom.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});

		// ── Bind input event ────────────────────────────────
		this._onInput = function () {
			self._handleInput();
		};
		dom.addEventListener('input', this._onInput);

		// ── Bind paste event ────────────────────────────────
		this._onPaste = function (e) {
			e.preventDefault();
			const pasted = (e.clipboardData || window.clipboardData).getData('text');
			const info = _getFormatter(getLocale(dom));
			const decSepEscaped = info.decimalSep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			// Strip everything except digits, minus, and decimal separators
			let cleaned = pasted.replace(new RegExp('[^0-9\\-' + decSepEscaped + '.]', 'g'), '');
			// Strip group separators before normalizing decimal
			if (info.groupSep) {
				cleaned = cleaned.split(info.groupSep).join('');
			}
			// Normalize: if locale decimal is not '.', replace it
			if (info.decimalSep !== '.') {
				cleaned = cleaned.replace(info.decimalSep, '.');
			}
			const num = parseFloat(cleaned);
			self.value = isNaN(num) ? NaN : num;
		};
		dom.addEventListener('paste', this._onPaste);

		// ── Handle pre-filled value ─────────────────────────
		const initial = dom.value;
		if (initial !== '') {
			const num = parseFloat(initial);
			if (!isNaN(num)) {
				this._setHiddenRaw(num);
				this._setDisplayRaw(_formatNum(getLocale(dom), num, dom.getAttribute('data-ln-number-decimals')));
				dom.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}

		return this;
	}

	function _parseRawNumber(val) {
		if (typeof val === 'number') return isNaN(val) ? null : val;
		if (!val || typeof val !== 'string') return null;
		let str = val.trim();
		if (str === '') return null;
		// Remove spaces/non-breaking spaces/currency symbols
		str = str.replace(/[\s\u00A0$€£]/g, '');

		// Handle "1.234,56" (DE/MK) vs "1,234.56" (EN)
		if (str.indexOf(',') !== -1 && str.indexOf('.') !== -1) {
			if (str.indexOf('.') < str.indexOf(',')) {
				// DE/MK style: 1.234,56 -> 1234.56
				str = str.replace(/\./g, '').replace(',', '.');
			} else {
				// EN style: 1,234.56 -> 1234.56
				str = str.replace(/,/g, '');
			}
		} else if (str.indexOf(',') !== -1) {
			// Only comma e.g. "1499,50" -> 1499.50
			str = str.replace(',', '.');
		}
		// Strip any remaining invalid chars
		str = str.replace(/[^\d.-]/g, '');
		const num = parseFloat(str);
		return isNaN(num) ? null : num;
	}

	_component.prototype._initTextElement = function () {
		const dom = this.dom;
		let valAttr = dom.getAttribute('data-ln-value');
		let numAttr = dom.getAttribute('data-ln-number');

		let candidate = null;
		if (valAttr !== null && valAttr !== '') {
			candidate = valAttr;
		} else if (numAttr !== null && numAttr !== '' && numAttr !== 'true') {
			candidate = numAttr;
		} else {
			candidate = dom.textContent.trim();
		}

		const num = _parseRawNumber(candidate);
		if (num !== null) {
			this._rawValue = num;
			if (!dom.hasAttribute('data-ln-value')) {
				dom.setAttribute('data-ln-value', String(num));
			}
			this._formatTextContent();
		} else {
			this._rawValue = null;
		}
	};

	_component.prototype._formatTextContent = function () {
		if (this._rawValue !== null && !isNaN(this._rawValue)) {
			const decimals = this.dom.getAttribute('data-ln-number-decimals');
			this.dom.textContent = _formatNum(getLocale(this.dom), this._rawValue, decimals);
		}
	};

	_component.prototype._handleInput = function () {
		const dom = this.dom;
		const info = _getFormatter(getLocale(dom));
		const raw = _inputValueDesc.get.call(dom);

		// Edge case: empty
		if (raw === '') {
			this._setHiddenRaw('');
			dispatch(dom, 'ln-number:input', { value: NaN, formatted: '' });
			return;
		}

		// Edge case: just minus sign
		if (raw === '-') {
			this._setHiddenRaw('');
			return;
		}

		// Save cursor context: count digits to the left of cursor
		const cursorPos = dom.selectionStart;
		let digitsBeforeCursor = 0;
		for (let i = 0; i < cursorPos; i++) {
			if (/[0-9]/.test(raw[i])) digitsBeforeCursor++;
		}

		// Parse: strip group separators, normalize decimal
		let cleaned = raw;
		if (info.groupSep) {
			cleaned = cleaned.split(info.groupSep).join('');
		}
		cleaned = cleaned.replace(info.decimalSep, '.');

		// Edge case: trailing decimal separator (user about to type decimals)
		if (raw.endsWith(info.decimalSep) || raw.endsWith('.')) {
			const beforeDecimal = cleaned.replace(/\.$/, '');
			const num = parseFloat(beforeDecimal);
			if (!isNaN(num)) {
				this._setHiddenRaw(num);
			}
			return;
		}

		// Edge case: trailing zeros after decimal (user still typing)
		const decimalIndex = cleaned.indexOf('.');
		if (decimalIndex !== -1) {
			const afterDecimal = cleaned.slice(decimalIndex + 1);
			if (afterDecimal.endsWith('0')) {
				const num = parseFloat(cleaned);
				if (!isNaN(num)) {
					this._setHiddenRaw(num);
				}
				return;
			}
		}

		// Enforce decimal limit
		const maxDecimals = dom.getAttribute('data-ln-number-decimals');
		if (maxDecimals !== null && decimalIndex !== -1) {
			const allowed = parseInt(maxDecimals, 10);
			const afterDec = cleaned.slice(decimalIndex + 1);
			if (afterDec.length > allowed) {
				cleaned = cleaned.slice(0, decimalIndex + 1 + allowed);
			}
		}

		const num = parseFloat(cleaned);
		if (isNaN(num)) return;

		// Enforce min/max
		const minAttr = dom.getAttribute('data-ln-number-min');
		const maxAttr = dom.getAttribute('data-ln-number-max');
		if (minAttr !== null && num < parseFloat(minAttr)) return;
		if (maxAttr !== null && num > parseFloat(maxAttr)) return;

		// Format
		let formatted;
		if (maxDecimals !== null) {
			formatted = _formatNum(getLocale(dom), num, maxDecimals);
		} else {
			// Preserve the user's decimal places
			const userDecimals = decimalIndex !== -1 ? cleaned.slice(decimalIndex + 1).length : 0;
			if (userDecimals > 0) {
				const key = getLocale(dom) + '|u' + userDecimals;
				if (!_formatters[key]) {
					_formatters[key] = new Intl.NumberFormat(getLocale(dom), { useGrouping: true, minimumFractionDigits: userDecimals, maximumFractionDigits: userDecimals });
				}
				formatted = _formatters[key].format(num);
			} else {
				formatted = info.fmt.format(num);
			}
		}

		this._setDisplayRaw(formatted);

		// Restore cursor position
		let targetDigits = digitsBeforeCursor;
		let newPos = 0;
		for (let i = 0; i < formatted.length && targetDigits > 0; i++) {
			newPos = i + 1;
			if (/[0-9]/.test(formatted[i])) targetDigits--;
		}
		// If we didn't consume all digits, put cursor at end
		if (targetDigits > 0) newPos = formatted.length;
		dom.setSelectionRange(newPos, newPos);

		// Update hidden input (bypass our setter to avoid feedback loop)
		this._setHiddenRaw(num);

		dispatch(dom, 'ln-number:input', { value: num, formatted: formatted });
	};

	_component.prototype._setHiddenRaw = function (val) {
		if (this._hidden) {
			_inputValueDesc.set.call(this._hidden, String(val));
		}
	};

	_component.prototype._setDisplayRaw = function (str) {
		if (this.isTextElement) {
			this.dom.textContent = String(str);
		} else {
			_inputValueDesc.set.call(this.dom, String(str));
		}
	};

	_component.prototype._displayFormatted = function (num) {
		if (this.isTextElement) {
			this._formatTextContent();
		} else {
			this._setDisplayRaw(_formatNum(getLocale(this.dom), num, this.dom.getAttribute('data-ln-number-decimals')));
		}
	};

	// ─── Public API ───────────────────────────────────────────

	Object.defineProperty(_component.prototype, 'value', {
		get: function () {
			if (this.isTextElement) {
				return this._rawValue;
			}
			const raw = _inputValueDesc.get.call(this._hidden);
			return raw === '' ? NaN : parseFloat(raw);
		},
		set: function (num) {
			if (this.isTextElement) {
				if (typeof num !== 'number' || isNaN(num)) {
					this._rawValue = null;
					this.dom.textContent = '';
				} else {
					this._rawValue = num;
					this.dom.setAttribute('data-ln-value', String(num));
					this._formatTextContent();
				}
				return;
			}

			if (typeof num !== 'number' || isNaN(num)) {
				this._setDisplayRaw('');
				this._setHiddenRaw('');
				this.dom.dispatchEvent(new Event('input', { bubbles: true }));
				return;
			}
			this._setHiddenRaw(num);
			this._setDisplayRaw(_formatNum(getLocale(this.dom), num, this.dom.getAttribute('data-ln-number-decimals')));
			this.dom.dispatchEvent(new Event('input', { bubbles: true }));
		}
	});

	Object.defineProperty(_component.prototype, 'formatted', {
		get: function () {
			if (this.isTextElement) {
				return this.dom.textContent;
			}
			return _inputValueDesc.get.call(this.dom);
		}
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._onLocaleChange) {
			document.removeEventListener('ln-core:locale-change', this._onLocaleChange);
		}
		if (!this.isTextElement) {
			this.dom.removeEventListener('input', this._onInput);
			this.dom.removeEventListener('paste', this._onPaste);
			if (this._hidden) {
				this.dom.name = this._hidden.name;
				this._hidden.remove();
			}
			this.dom.type = 'number';
			this.dom.removeAttribute('inputmode');
		}
		dispatch(this.dom, 'ln-number:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-number', {
		extraAttributes: [
			'data-ln-value',
			'data-ln-number-decimals',
			'data-ln-number-min',
			'data-ln-number-max',
			'lang'
		],
		onAttributeChange: function (el) {
			const inst = el[DOM_ATTRIBUTE];
			if (!inst) return;
			if (inst.isTextElement) {
				inst._initTextElement();
			} else if (!isNaN(inst.value)) {
				inst._displayFormatted(inst.value);
			}
		}
	});
})();
