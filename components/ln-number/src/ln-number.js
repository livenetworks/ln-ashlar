import { dispatch, getLocale, registerComponent, interceptValueProperty, ensureLocaleObserver } from '../../ln-core';
import { getSeparators, cleanNumericString, parseNumber, formatNumber, calculateCursorPosition } from './number-model';

(function () {
	const DOM_SELECTOR = 'data-ln-number';
	const DOM_ATTRIBUTE = 'lnNumber';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const _inputValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

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
				_inputValueDesc.set.call(hidden, val);
				if (val !== '' && !isNaN(parseFloat(val))) {
					const maxDecimals = self.dom.getAttribute('data-ln-number-decimals');
					self._setDisplayRaw(formatNumber(parseFloat(val), getLocale(self.dom), { maxDecimals }));
				} else {
					self._setDisplayRaw('');
				}
				self.dom.dispatchEvent(new Event('input', { bubbles: true }));
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
				const num = typeof val === 'number' ? val : parseNumber(String(val), getLocale(dom));
				if (isNaN(num)) {
					self._setDisplayRaw(String(val));
					self._setHiddenRaw('');
				} else {
					self._setHiddenRaw(num);
					const maxDecimals = dom.getAttribute('data-ln-number-decimals');
					self._setDisplayRaw(formatNumber(num, getLocale(dom), { maxDecimals }));
				}
				dom.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});

		// ── Bind input event ────────────────────────────────
		this._onInput = function () {
			self._handleInput();
		};
		dom.addEventListener('input', this._onInput);

		// ── Bind keydown event (Backspace over group separators) ──
		this._onKeyDown = function (e) {
			if (e.key !== 'Backspace') return;
			const start = dom.selectionStart;
			const end = dom.selectionEnd;

			if (start !== end || start === 0) return;

			const info = getSeparators(getLocale(dom));
			const val = _inputValueDesc.get.call(dom);
			const charBefore = val[start - 1];

			if (charBefore === info.groupSep || /\s/.test(charBefore)) {
				e.preventDefault();
				const deleteIdx = start - 2 >= 0 ? start - 2 : 0;
				const newVal = val.slice(0, deleteIdx) + val.slice(start);
				_inputValueDesc.set.call(dom, newVal);
				dom.setSelectionRange(deleteIdx, deleteIdx);
				dom.dispatchEvent(new Event('input', { bubbles: true }));
			}
		};
		dom.addEventListener('keydown', this._onKeyDown);

		// ── Bind paste event ────────────────────────────────
		this._onPaste = function (e) {
			e.preventDefault();
			const pasted = (e.clipboardData || window.clipboardData).getData('text');
			const num = parseNumber(pasted, getLocale(dom));
			self.value = isNaN(num) ? NaN : num;
		};
		dom.addEventListener('paste', this._onPaste);

		// ── Handle pre-filled value ─────────────────────────
		const initial = dom.value;
		if (initial !== '') {
			const num = parseNumber(initial, getLocale(dom));
			if (!isNaN(num)) {
				const maxDecimals = dom.getAttribute('data-ln-number-decimals');
				this._setHiddenRaw(num);
				this._setDisplayRaw(formatNumber(num, getLocale(dom), { maxDecimals }));
				dom.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}

		return this;
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

		const num = parseNumber(candidate, getLocale(dom));
		if (!isNaN(num)) {
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
			const maxDecimals = this.dom.getAttribute('data-ln-number-decimals');
			this.dom.textContent = formatNumber(this._rawValue, getLocale(this.dom), { maxDecimals });
		}
	};

	_component.prototype._handleInput = function () {
		const dom = this.dom;
		const raw = _inputValueDesc.get.call(dom);

		// Branch 1: empty
		if (raw === '') {
			this._setHiddenRaw('');
			dispatch(dom, 'ln-number:input', { value: NaN, formatted: '' });
			return;
		}

		// Branch 2: just minus sign
		if (raw === '-') {
			this._setHiddenRaw('');
			dispatch(dom, 'ln-number:input', { value: NaN, formatted: '-' });
			return;
		}

		// Save cursor context: count digits to the left of cursor
		const cursorPos = dom.selectionStart;
		let digitsBeforeCursor = 0;
		for (let i = 0; i < cursorPos; i++) {
			if (/[0-9]/.test(raw[i])) digitsBeforeCursor++;
		}

		const locale = getLocale(dom);
		const info = getSeparators(locale);
		let workingStr = raw;
		let cleaned = cleanNumericString(raw, info.groupSep, info.decimalSep);
		let num = parseFloat(cleaned);

		if (isNaN(num)) {
			this._setHiddenRaw('');
			dispatch(dom, 'ln-number:input', { value: NaN, formatted: raw });
			return;
		}

		// Transformation (Non-Terminal): Apply data-ln-number-decimals truncation
		const maxDecimalsAttr = dom.getAttribute('data-ln-number-decimals');
		const decimalIndex = cleaned.indexOf('.');
		if (maxDecimalsAttr !== null && decimalIndex !== -1) {
			const allowed = parseInt(maxDecimalsAttr, 10);
			const afterDec = cleaned.slice(decimalIndex + 1);
			if (allowed === 0) {
				cleaned = cleaned.slice(0, decimalIndex);
				workingStr = workingStr.split(info.decimalSep)[0];
				num = parseFloat(cleaned);
				this._setDisplayRaw(workingStr);
			} else if (afterDec.length > allowed) {
				cleaned = cleaned.slice(0, decimalIndex + 1 + allowed);
				const parts = workingStr.split(info.decimalSep);
				workingStr = parts[0] + info.decimalSep + parts[1].slice(0, allowed);
				num = parseFloat(cleaned);
				this._setDisplayRaw(workingStr);
			}
		}

		// Max Clamping: Evaluated BEFORE trailing separator / zero branches
		const maxAttr = dom.getAttribute('data-ln-number-max');
		if (maxAttr !== null && num > parseFloat(maxAttr)) {
			const maxVal = parseFloat(maxAttr);
			const formatted = formatNumber(maxVal, locale, { maxDecimals: maxDecimalsAttr });
			this._setDisplayRaw(formatted);
			this._setHiddenRaw(maxVal);
			dom.setSelectionRange(formatted.length, formatted.length);
			dispatch(dom, 'ln-number:input', { value: maxVal, formatted: formatted });
			return;
		}

		// Trailing Decimal Separator (user is about to type decimals)
		if (workingStr.endsWith(info.decimalSep) || (info.decimalSep !== '.' && workingStr.endsWith('.'))) {
			this._setHiddenRaw(num);
			dispatch(dom, 'ln-number:input', { value: num, formatted: workingStr });
			return;
		}

		// Trailing Zeros after Decimal (user is still typing fractional part)
		const curDecIdx = cleaned.indexOf('.');
		if (curDecIdx !== -1) {
			const afterDec = cleaned.slice(curDecIdx + 1);
			if (afterDec.endsWith('0')) {
				this._setHiddenRaw(num);
				dispatch(dom, 'ln-number:input', { value: num, formatted: workingStr });
				return;
			}
		}

		// Standard Formatting
		let formatted;
		if (maxDecimalsAttr !== null) {
			formatted = formatNumber(num, locale, { maxDecimals: maxDecimalsAttr });
		} else {
			const userDecimals = curDecIdx !== -1 ? cleaned.slice(curDecIdx + 1).length : 0;
			formatted = formatNumber(num, locale, { userDecimals });
		}

		this._setDisplayRaw(formatted);

		// Restore cursor position
		const newPos = calculateCursorPosition(formatted, digitsBeforeCursor);
		dom.setSelectionRange(newPos, newPos);

		// Update hidden input
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
			const maxDecimals = this.dom.getAttribute('data-ln-number-decimals');
			this._setDisplayRaw(formatNumber(num, getLocale(this.dom), { maxDecimals }));
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
			const maxDecimals = this.dom.getAttribute('data-ln-number-decimals');
			this._setDisplayRaw(formatNumber(num, getLocale(this.dom), { maxDecimals }));
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
			this.dom.removeEventListener('keydown', this._onKeyDown);
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
