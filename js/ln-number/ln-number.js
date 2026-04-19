import { dispatch, getLocale, registerComponent } from '../ln-core';

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

	function _component(dom) {
		if (dom.tagName !== 'INPUT') {
			console.warn('[ln-number] Can only be applied to <input>, got:', dom.tagName);
			return this;
		}

		this.dom = dom;

		// ── Create hidden input ─────────────────────────────
		const hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = dom.name;
		dom.removeAttribute('name');
		dom.type = 'text';
		dom.setAttribute('inputmode', 'decimal');
		dom.insertAdjacentElement('afterend', hidden);
		this._hidden = hidden;

		// ── Intercept programmatic value sets on hidden input ──
		const self = this;
		Object.defineProperty(hidden, 'value', {
			get: function () {
				return _inputValueDesc.get.call(hidden);
			},
			set: function (val) {
				_inputValueDesc.set.call(hidden, val);
				// If set programmatically (e.g., populateForm), update display
				if (val !== '' && !isNaN(parseFloat(val))) {
					self._displayFormatted(parseFloat(val));
				} else if (val === '') {
					self.dom.value = '';
				}
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
			if (!isNaN(num)) {
				self.value = num;
			} else {
				dom.value = '';
				self._hidden.value = '';
			}
		};
		dom.addEventListener('paste', this._onPaste);

		// ── Handle pre-filled value ─────────────────────────
		const initial = dom.value;
		if (initial !== '') {
			const num = parseFloat(initial);
			if (!isNaN(num)) {
				this._displayFormatted(num);
				_inputValueDesc.set.call(hidden, String(num));
			}
		}

		return this;
	}

	_component.prototype._handleInput = function () {
		const dom = this.dom;
		const info = _getFormatter(getLocale(dom));
		const raw = dom.value;

		// Edge case: empty
		if (raw === '') {
			this._hidden.value = '';
			dispatch(dom, 'ln-number:input', { value: NaN, formatted: '' });
			return;
		}

		// Edge case: just minus sign
		if (raw === '-') {
			this._hidden.value = '';
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

		dom.value = formatted;

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

	_component.prototype._setHiddenRaw = function (num) {
		_inputValueDesc.set.call(this._hidden, String(num));
	};

	_component.prototype._displayFormatted = function (num) {
		this.dom.value = _formatNum(getLocale(this.dom), num, this.dom.getAttribute('data-ln-number-decimals'));
	};

	// ─── Public API ───────────────────────────────────────────

	Object.defineProperty(_component.prototype, 'value', {
		get: function () {
			const raw = this._hidden.value;
			return raw === '' ? NaN : parseFloat(raw);
		},
		set: function (num) {
			if (typeof num !== 'number' || isNaN(num)) {
				this.dom.value = '';
				this._setHiddenRaw('');
				return;
			}
			this._displayFormatted(num);
			this._setHiddenRaw(num);
			dispatch(this.dom, 'ln-number:input', {
				value: num,
				formatted: this.dom.value
			});
		}
	});

	Object.defineProperty(_component.prototype, 'formatted', {
		get: function () {
			return this.dom.value;
		}
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('input', this._onInput);
		this.dom.removeEventListener('paste', this._onPaste);
		// Restore name to visible input
		this.dom.name = this._hidden.name;
		this.dom.type = 'number';
		this.dom.removeAttribute('inputmode');
		// Remove hidden input
		this._hidden.remove();
		dispatch(this.dom, 'ln-number:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Locale Observer ──────────────────────────────────────

	function _localeObserver() {
		new MutationObserver(function () {
			const els = document.querySelectorAll('[' + DOM_SELECTOR + ']');
			for (let i = 0; i < els.length; i++) {
				const inst = els[i][DOM_ATTRIBUTE];
				if (inst && !isNaN(inst.value)) {
					inst._displayFormatted(inst.value);
				}
			}
		}).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-number');
	_localeObserver();
})();
