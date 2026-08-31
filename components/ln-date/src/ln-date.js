import {
	buildDict,
	dispatch,
	ensureLocaleObserver,
	formatDateToISO,
	getLocale,
	getLocaleFallback,
	interceptValueProperty,
	parseDateInput,
	registerComponent,
	registerLocaleFallback
} from '../../ln-core';

import {
	formatDateValue,
	KEYWORD_RE,
	parseTypedDate
} from './date-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-date';
	const DOM_ATTRIBUTE = 'lnDate';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const _inputValueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');

	// ─── Component Helpers ────────────────────────────────────

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

	// ─── Component Constructor & Methods ──────────────────────

	function _component(dom) {
		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		dom[DOM_ATTRIBUTE] = this;

		this.dom = dom;
		const self = this;

		// Subscribe to global locale changes
		this._onLocaleChange = function () {
			if (self.isTextElement) {
				self._formatTextContent();
			} else if (self.value) {
				const date = parseDateInput(self.value);
				if (date) self._displayFormatted(date);
			}
		};
		ensureLocaleObserver();
		document.addEventListener('ln-core:locale-change', this._onLocaleChange);

		if (dom.tagName !== 'INPUT') {
			this.isTextElement = true;
			this._initTextElement();
			return this;
		}

		this.isTextElement = false;

		// Read initial state
		const initialValue = dom.value;
		const name = dom.name;

		// Check for declarative HTML dictionary nearby
		const container = dom.closest('.form-element, form') || dom.parentNode;
		if (container) {
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
		}

		// Wrap field: <span data-ln-date-field>
		const wrapper = document.createElement('span');
		wrapper.setAttribute('data-ln-date-field', '');
		dom.parentNode.insertBefore(wrapper, dom);
		wrapper.appendChild(dom);
		this._wrapper = wrapper;

		// Create hidden input for form submission
		const hidden = document.createElement('input');
		hidden.type = 'hidden';
		hidden.name = name;
		dom.removeAttribute('name');
		if (dom.hasAttribute('data-ln-fill-as')) {
			hidden.setAttribute('data-ln-fill-as', dom.getAttribute('data-ln-fill-as'));
		}
		dom.insertAdjacentElement('afterend', hidden);
		this._hidden = hidden;

		// Create hidden date input for native picker
		const picker = document.createElement('input');
		picker.type = 'date';
		picker.tabIndex = -1;
		picker.setAttribute('tabindex', '-1');
		picker.setAttribute('aria-hidden', 'true');
		picker.setAttribute('aria-label', dom.getAttribute('data-ln-date-label') || 'Date picker');
		picker.style.cssText = 'position:absolute;opacity:0;width:0;height:0;overflow:hidden;pointer-events:none';
		hidden.insertAdjacentElement('afterend', picker);
		this._picker = picker;

		// Transform visible input to text
		dom.type = 'text';

		// Create calendar button
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.setAttribute('aria-label', dom.getAttribute('data-ln-date-label') || 'Open date picker');
		btn.innerHTML = '<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-calendar"></use></svg>';
		picker.insertAdjacentElement('afterend', btn);
		this._btn = btn;
		this._lastISO = '';

		// Intercept programmatic value sets on hidden input
		Object.defineProperty(hidden, 'value', {
			get: function () {
				return _inputValueDesc.get.call(hidden);
			},
			set: function (val) {
				_inputValueDesc.set.call(hidden, val);
				if (val && val !== '') {
					const date = parseDateInput(val);
					if (date) _updateState(self, val, date);
				} else if (val === '') {
					_clearState(self);
				}
			}
		});

		// Intercept programmatic value sets on visible input (2-way binding)
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

				const date = parseDateInput(val) || parseTypedDate(val);
				if (date) {
					const iso = formatDateToISO(date);
					const format = dom.getAttribute(DOM_SELECTOR) || '';
					const locale = getLocale(dom);
					const fallback = getLocaleFallback(locale);
					const formatted = formatDateValue(date, format, locale, fallback);
					originalSet(formatted);
					_updateState(self, iso, date, formatted);
				} else {
					originalSet(String(val));
					_clearState(self);
				}
			}
		});

		// Bind events
		this._onPickerChange = function () {
			const val = picker.value;
			if (val) {
				const date = parseDateInput(val);
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
				const currentDate = parseDateInput(self._lastISO);
				if (currentDate) {
					const format = self.dom.getAttribute(DOM_SELECTOR) || '';
					const locale = getLocale(self.dom);
					const fallback = getLocaleFallback(locale);
					if (typed === formatDateValue(currentDate, format, locale, fallback)) return;
				}
			}

			const parsed = parseTypedDate(typed);
			if (parsed) {
				const iso = formatDateToISO(parsed);
				_updateState(self, iso, parsed);
			} else {
				if (self._lastISO) {
					const prevDate = parseDateInput(self._lastISO);
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

		// Handle initial pre-filled value
		if (initialValue && initialValue !== '') {
			const date = parseDateInput(initialValue);
			if (date) _updateState(self, initialValue, date);
		}

		return this;
	}

	_component.prototype._initTextElement = function () {
		const dom = this.dom;
		const valAttr = dom.getAttribute('data-ln-value');
		const dateAttr = dom.getAttribute('data-ln-date');
		const datetimeAttr = dom.getAttribute('datetime');

		let candidate = null;
		if (valAttr !== null && valAttr !== '') {
			candidate = valAttr;
		} else if (datetimeAttr !== null && datetimeAttr !== '') {
			candidate = datetimeAttr;
		} else if (dateAttr !== null && dateAttr !== '' && dateAttr !== 'true' && !KEYWORD_RE.test(dateAttr)) {
			candidate = dateAttr;
		} else {
			candidate = dom.textContent.trim();
		}

		const date = parseDateInput(candidate) || parseTypedDate(candidate);
		if (date && !isNaN(date.getTime())) {
			const iso = formatDateToISO(date);
			this._rawValue = iso;
			if (!dom.hasAttribute('data-ln-value')) {
				dom.setAttribute('data-ln-value', iso);
			}
			this._formatTextContent();
		} else {
			this._rawValue = null;
		}
	};

	_component.prototype._formatTextContent = function () {
		if (this._rawValue) {
			const date = parseDateInput(this._rawValue);
			if (date) {
				const formatAttr = this.dom.getAttribute('data-ln-date-format');
				let format = formatAttr;
				if (!format) {
					const dateAttr = this.dom.getAttribute('data-ln-date');
					if (dateAttr && KEYWORD_RE.test(dateAttr)) {
						format = dateAttr;
					}
				}
				const locale = getLocale(this.dom);
				const fallback = getLocaleFallback(locale);
				this.dom.textContent = formatDateValue(date, format || 'medium', locale, fallback);
			}
		}
	};

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
		const fallback = getLocaleFallback(locale);
		this._isFormatting = true;
		this.dom.value = formatDateValue(date, format, locale, fallback);
		this._isFormatting = false;
	};

	// ─── Public API ───────────────────────────────────────────

	Object.defineProperty(_component.prototype, 'value', {
		get: function () {
			if (this.isTextElement) {
				return this._rawValue || '';
			}
			return _inputValueDesc.get.call(this._hidden);
		},
		set: function (isoStr) {
			if (this.isTextElement) {
				if (!isoStr || isoStr === '') {
					this._rawValue = null;
					this.dom.removeAttribute('data-ln-value');
					this.dom.textContent = '';
					return;
				}
				const date = parseDateInput(isoStr) || parseTypedDate(isoStr);
				if (!date) return;
				const iso = formatDateToISO(date);
				this._rawValue = iso;
				this.dom.setAttribute('data-ln-value', iso);
				this._formatTextContent();
				return;
			}
			if (!isoStr || isoStr === '') {
				_clearState(this);
				return;
			}
			const date = parseDateInput(isoStr);
			if (!date) return;
			_updateState(this, isoStr, date);
		}
	});

	Object.defineProperty(_component.prototype, 'date', {
		get: function () {
			const val = this.value;
			if (!val) return null;
			return parseDateInput(val);
		},
		set: function (dateObj) {
			if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
				this.value = '';
				return;
			}
			this.value = formatDateToISO(dateObj);
		}
	});

	Object.defineProperty(_component.prototype, 'formatted', {
		get: function () {
			if (this.isTextElement) {
				return this.dom.textContent;
			}
			return this.dom.value;
		}
	});

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this.isTextElement) {
			dispatch(this.dom, 'ln-date:destroyed', { target: this.dom });
			delete this.dom[DOM_ATTRIBUTE];
			return;
		}
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
		if (this._onLocaleChange) {
			document.removeEventListener('ln-core:locale-change', this._onLocaleChange);
		}
		dispatch(this.dom, 'ln-date:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ─────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-date', {
		extraAttributes: ['data-ln-date-format', 'data-ln-date-locale', 'data-ln-value', 'datetime', 'lang'],
		onAttributeChange: function (el) {
			const inst = el[DOM_ATTRIBUTE];
			if (!inst) return;
			if (inst.isTextElement) {
				inst._initTextElement();
			} else if (inst.value) {
				const date = parseDateInput(inst.value);
				if (date) inst._displayFormatted(date);
			}
		}
	});
})();
