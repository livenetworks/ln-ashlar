import { dispatch, getLocale, registerComponent, interceptValueProperty, getLocaleFallback, registerLocaleFallback, buildDict } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-date';
	const DOM_ATTRIBUTE = 'lnDate';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Formatter Cache ──────────────────────────────────────

	const _formatters = {};
	const _inputValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

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
			return KEYWORD_OPTIONS[format];
		}
		return null; // custom pattern
	}

	// ─── Custom Pattern Formatting ────────────────────────────

	function _formatCustom(date, pattern, locale) {
		const day = date.getDate();
		const month = date.getMonth();
		const year = date.getFullYear();
		const hours = date.getHours();
		const minutes = date.getMinutes();

		let mmmmVal, mmmVal;
		const fallback = getLocaleFallback(locale);
		const langPrefix = (locale || '').toLowerCase().split('-')[0];
		const formatter = _getFormatter(locale, { month: 'long' });
		const resolvedLocale = formatter.resolvedOptions().locale.toLowerCase().split('-')[0];
		const isFallbackNeeded = fallback && resolvedLocale !== langPrefix;

		if (isFallbackNeeded && fallback.monthsLong) {
			mmmmVal = fallback.monthsLong[month];
		} else {
			mmmmVal = _getFormatter(locale, { month: 'long' }).format(date);
		}

		if (isFallbackNeeded && fallback.monthsShort) {
			mmmVal = fallback.monthsShort[month];
		} else {
			mmmVal = _getFormatter(locale, { month: 'short' }).format(date);
		}

		const tokens = {
			'yyyy': String(year),
			'yy':   String(year).slice(-2),
			'MMMM': mmmmVal,
			'MMM':  mmmVal,
			'MM':   String(month + 1).padStart(2, '0'),
			'M':    String(month + 1),
			'dd':   String(day).padStart(2, '0'),
			'd':    String(day),
			'HH':   String(hours).padStart(2, '0'),
			'mm':   String(minutes).padStart(2, '0')
		};

		return pattern.replace(/yyyy|yy|MMMM|MMM|MM|M|dd|d|HH|mm/g, function (m) { return tokens[m]; });
	}

	// ─── Format Date ──────────────────────────────────────────

	function _formatDate(date, format, locale) {
		const intlOptions = _getIntlOptions(format);
		if (intlOptions) {
			const formatter = _getFormatter(locale, intlOptions);
			const langPrefix = (locale || '').toLowerCase().split('-')[0];
			const resolvedLocale = formatter.resolvedOptions().locale.toLowerCase().split('-')[0];
			const fallback = getLocaleFallback(locale);

			if (fallback && resolvedLocale !== langPrefix) {
				return _formatCustom(date, 'dd.MM.yyyy', locale);
			}
			return formatter.format(date);
		}
		return _formatCustom(date, format, locale);
	}

	// ─── Component Helpers ────────────────────────────────────

	function _toISO(date) {
		if (!date) return '';
		const y = date.getFullYear();
		const m = String(date.getMonth() + 1).padStart(2, '0');
		const d = String(date.getDate()).padStart(2, '0');
		return y + '-' + m + '-' + d;
	}

	function _notifyChange(self, iso, date) {
		dispatch(self.dom, 'ln-date:change', {
			value: iso,
			formatted: self.dom.value,
			date: date
		});
		self.dom.dispatchEvent(new Event('change', { bubbles: true }));
	}

	function _updateState(self, iso, date, formattedText) {
		self._setHiddenRaw(iso);
		_inputValueDesc.set.call(self._picker, iso);
		self._lastISO = iso;
		if (formattedText !== undefined) {
			self._isFormatting = true;
			self.dom.value = formattedText;
			self._isFormatting = false;
		} else if (date) {
			self._displayFormatted(date);
		}
		_notifyChange(self, iso, date);
	}

	function _clearState(self) {
		self._setHiddenRaw('');
		_inputValueDesc.set.call(self._picker, '');
		self._isFormatting = true;
		self.dom.value = '';
		self._isFormatting = false;
		self._lastISO = '';
		_notifyChange(self, '', null);
	}

	// ─── Component ────────────────────────────────────────────

	function _component(dom) {
		if (dom.tagName !== 'INPUT') {
			return this;
		}

		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		dom[DOM_ATTRIBUTE] = this;

		this.dom = dom;
		const self = this;

		// ── Read initial state ──────────────────────────────
		const initialValue = dom.value;
		const name = dom.name;

		// Check for declarative HTML dictionary nearby
		const container = dom.closest('.form-element, form') || dom.parentNode;
		const dictEls = container.querySelectorAll('[data-ln-date-dict]');
		for (let i = 0; i < dictEls.length; i++) {
			const lang = dictEls[i].getAttribute('data-ln-date-dict');
			if (lang) {
				const dictData = buildDict(dictEls[i], 'data-ln-date-dict-key');
				if (dictData['months-long']) {
					dictData.monthsLong = dictData['months-long'].split(',').map(s => s.trim());
				}
				if (dictData['months-short']) {
					dictData.monthsShort = dictData['months-short'].split(',').map(s => s.trim());
				}
				registerLocaleFallback(lang, dictData);
			}
		}

		// ── Wrap field: replace dom with <span data-ln-date-field> and move dom inside ──
		const wrapper = document.createElement('span');
		wrapper.setAttribute('data-ln-date-field', '');
		dom.parentNode.insertBefore(wrapper, dom);
		wrapper.appendChild(dom);
		this._wrapper = wrapper;

		// ── Create hidden input for form submission ─────────
		const hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = name;
		dom.removeAttribute('name');
		if (dom.hasAttribute('data-ln-fill-as')) {
			hidden.setAttribute('data-ln-fill-as', dom.getAttribute('data-ln-fill-as'));
		}
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

		// ── Create calendar button ──────────────────────────
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('aria-label', dom.getAttribute('data-ln-date-label') || 'Open date picker');
		btn.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-calendar"></use></svg>';
		picker.insertAdjacentElement('afterend', btn);
		this._btn = btn;
		this._lastISO = '';

		// ── Intercept programmatic value sets on hidden input ──
		Object.defineProperty(hidden, 'value', {
			get: function () {
				return _inputValueDesc.get.call(hidden);
			},
			set: function (val) {
				_inputValueDesc.set.call(hidden, val);
				if (val && val !== '') {
					const date = _parseISO(val);
					if (date) _updateState(self, val, date);
				} else if (val === '') {
					_clearState(self);
				}
			}
		});

		// ── Intercept programmatic value sets on visible input (2-way binding) ──
		interceptValueProperty(dom, _inputValueDesc, {
			get: function () {
				return _inputValueDesc.get.call(dom);
			},
			set: function (val, originalSet) {
				if (self._isFormatting) {
					originalSet(val);
					return;
				}
				if (!val || val === '') {
					originalSet('');
					_clearState(self);
					return;
				}

				const date = _parseISO(val) || _parseTyped(val);

				if (date) {
					const iso = _toISO(date);
					const format = dom.getAttribute(DOM_SELECTOR) || '';
					const locale = getLocale(dom);
					const formatted = _formatDate(date, format, locale);
					originalSet(formatted);
					_updateState(self, iso, date, formatted);
				} else {
					originalSet(String(val));
					_clearState(self);
				}
			}
		});

		// ── Bind events ─────────────────────────────────────
		this._onPickerChange = function () {
			const val = picker.value;
			if (val) {
				const date = _parseISO(val);
				if (date) _updateState(self, val, date);
			} else {
				_clearState(self);
			}
		};
		picker.addEventListener('change', this._onPickerChange);

		this._onBlur = function () {
			const typed = self.dom.value.trim();

			if (typed === '') {
				if (self._lastISO !== '') _clearState(self);
				return;
			}

			if (self._lastISO) {
				const currentDate = _parseISO(self._lastISO);
				if (currentDate) {
					const format = self.dom.getAttribute(DOM_SELECTOR) || '';
					const locale = getLocale(self.dom);
					if (typed === _formatDate(currentDate, format, locale)) return;
				}
			}

			const parsed = _parseTyped(typed);
			if (parsed) {
				const iso = _toISO(parsed);
				_updateState(self, iso, parsed);
			} else {
				if (self._lastISO) {
					const prevDate = _parseISO(self._lastISO);
					if (prevDate) self._displayFormatted(prevDate);
				} else {
					self.dom.value = '';
				}
			}
		};
		dom.addEventListener('blur', this._onBlur);

		this._onBtnClick = function () {
			self._openPicker();
		};
		btn.addEventListener('click', this._onBtnClick);

		// ── Handle pre-filled value ─────────────────────────
		if (initialValue && initialValue !== '') {
			const date = _parseISO(initialValue);
			if (date) _updateState(self, initialValue, date);
		}

		return this;
	}

	// ─── Parsing Helpers ──────────────────────────────────────

	function _parseISO(str) {
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
		if (date.getFullYear() !== y || date.getMonth() !== m || date.getDate() !== d) return null;
		return date;
	}

	function _parseTyped(str) {
		if (!str || typeof str !== 'string') return null;
		str = str.trim();
		if (str.length < 6) return null;

		let sep, parts;
		if (str.indexOf('.') !== -1) {
			sep = '.'; parts = str.split('.');
		} else if (str.indexOf('/') !== -1) {
			sep = '/'; parts = str.split('/');
		} else if (str.indexOf('-') !== -1) {
			sep = '-'; parts = str.split('-');
		} else {
			return null;
		}

		if (parts.length !== 3) return null;
		const nums = [];
		for (let i = 0; i < 3; i++) {
			const n = parseInt(parts[i], 10);
			if (isNaN(n)) return null;
			nums.push(n);
		}

		let day, month, year;
		if (sep === '.') {
			day = nums[0]; month = nums[1]; year = nums[2];
		} else if (sep === '/') {
			month = nums[0]; day = nums[1]; year = nums[2];
		} else {
			if (parts[0].length === 4) {
				year = nums[0]; month = nums[1]; day = nums[2];
			} else {
				day = nums[0]; month = nums[1]; year = nums[2];
			}
		}

		if (year < 100) {
			year += (year < 50) ? 2000 : 1900;
		}

		const date = new Date(year, month - 1, day);
		if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
			return null;
		}
		return date;
	}

	_component.prototype._openPicker = function () {
		if (typeof this._picker.showPicker === 'function') {
			try {
				this._picker.showPicker();
			} catch (e) {
				this._picker.click();
			}
		} else {
			this._picker.click();
		}
	};

	_component.prototype._setHiddenRaw = function (val) {
		_inputValueDesc.set.call(this._hidden, val);
	};

	_component.prototype._displayFormatted = function (date) {
		const format = this.dom.getAttribute(DOM_SELECTOR) || '';
		const locale = getLocale(this.dom);
		this._isFormatting = true;
		this.dom.value = _formatDate(date, format, locale);
		this._isFormatting = false;
	};

	// ─── Public API ───────────────────────────────────────────

	Object.defineProperty(_component.prototype, 'value', {
		get: function () {
			return _inputValueDesc.get.call(this._hidden);
		},
		set: function (isoStr) {
			if (!isoStr || isoStr === '') {
				_clearState(this);
				return;
			}
			const date = _parseISO(isoStr);
			if (!date) return;
			_updateState(this, isoStr, date);
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
			this.value = _toISO(dateObj);
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
		this.dom.removeEventListener('blur', this._onBlur);
		this._btn.removeEventListener('click', this._onBtnClick);
		const isoVal = this.value;
		this._hidden.remove();
		this._picker.remove();
		this._btn.remove();
		if (this._wrapper && this._wrapper.parentNode) {
			this._wrapper.parentNode.insertBefore(this.dom, this._wrapper);
			this._wrapper.remove();
		}
		delete this.dom.value;
		this.dom.name = this._hidden.name;
		this.dom.type = 'date';
		if (isoVal) this.dom.value = isoVal;
		dispatch(this.dom, 'ln-date:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

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

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-date');
	_localeObserver();
})();
