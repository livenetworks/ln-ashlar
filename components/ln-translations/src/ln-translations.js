import {
	buildDict,
	cloneTemplateScoped,
	cloneTemplate,
	dispatch,
	dispatchCancelable,
	getLocale,
	registerComponent,
	defineAttrs,
	attrSpec,
	attrStr,
	attrJson,
	shouldIgnoreClick
} from '../../ln-core';

import {
	buildFieldName,
	formatPlaceholder,
	formatRemoveLabel,
	parseLocales,
	resolveLanguageName,
	filterAvailableLocales,
	resolveTranslationValue
} from './translations-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-translations';
	const DOM_ATTRIBUTE = 'lnTranslations';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-translations': { type: 'marker', description: 'Mounts multi-language translation coordinator on form container' },
		'data-ln-translations-default': { prop: 'defaultLang', read: attrStr, type: 'string', fallback: '', description: 'Default primary language code (e.g. en)' },
		'data-ln-translations-placeholder': { prop: 'placeholderLabel', read: attrStr, type: 'string', fallback: '{lang} translation', description: 'Placeholder label pattern for cloned translation inputs' },
		'data-ln-translations-remove-label': { prop: 'removeLabel', read: attrStr, type: 'string', fallback: 'Remove {lang}', description: 'Accessible label template for translation removal buttons' },
		'data-ln-translations-locales': { prop: '_localesRaw', read: attrJson, type: 'json', fallback: null, description: 'JSON dictionary of supported locale codes and display labels' },
		'data-ln-translations-dict': { type: 'string', description: 'Dictionary key prefix mapping for translatable labels' },
		'data-ln-translations-menu': { type: 'marker', description: 'Menu container holding available language items' },
		'data-ln-translations-active': { type: 'marker', description: 'Container holding active language badge tags' },
		'data-ln-translations-add': { type: 'trigger', description: 'Trigger button to open translation language menu' },
		'data-ln-translations-lang': { type: 'string', description: 'Language code associated with active language badge or menu item' },
		'data-ln-translations-prefix': { type: 'string', description: 'Prefix format pattern for nested translatable field names' },
		'data-ln-translatable': { type: 'string', description: 'Marks form control container as translatable, value is field name' },
		'data-ln-translatable-lang': { type: 'string', description: 'Language code assigned to specific translatable input instance' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);
		this.dict = buildDict(dom, 'data-ln-translations-dict');
		this.locale = getLocale(dom);
		this.activeLanguages = new Set();

		this.badgesEl = dom.querySelector('[data-ln-translations-active]');
		this.menuEl = dom.querySelector('[data-ln-translations-menu]') || dom.querySelector('[data-ln-dropdown] > [data-ln-toggle]');

		// Parse locales from attribute (or empty fallback)
		this.locales = parseLocales(this._localesRaw, {});

		// Flag original inputs with default language
		this._applyDefaultLang();

		const self = this;

		// Delegated click listener for dropdown menu items
		if (this.menuEl) {
			this._boundMenuClick = function (e) {
				if (shouldIgnoreClick(e)) return;
				const btn = e.target.closest('button[data-ln-translations-lang]');
				if (!btn || !self.menuEl.contains(btn)) return;

				e.preventDefault();
				e.stopPropagation();

				const lang = btn.getAttribute('data-ln-translations-lang');
				if (self.menuEl.getAttribute('data-ln-toggle') === 'open') {
					self.menuEl.setAttribute('data-ln-toggle', 'close');
				}
				if (lang) {
					self.addLanguage(lang);
				}
			};
			this.menuEl.addEventListener('click', this._boundMenuClick);
		}

		// Delegated click listener for active badges remove button
		if (this.badgesEl) {
			this._boundBadgesClick = function (e) {
				if (shouldIgnoreClick(e)) return;
				const btn = e.target.closest('button');
				if (!btn || !self.badgesEl.contains(btn)) return;
				const item = btn.closest('[data-ln-translations-lang]');
				const lang = item ? item.getAttribute('data-ln-translations-lang') : null;
				if (lang) {
					e.preventDefault();
					e.stopPropagation();
					self.removeLanguage(lang);
				}
			};
			this.badgesEl.addEventListener('click', this._boundBadgesClick);
		}

		// Populate dropdown menu
		this._updateDropdown();

		// Bind request events
		this._onRequestAdd = function (e) {
			if (e.detail && e.detail.lang) {
				self.addLanguage(e.detail.lang, e.detail.values);
			}
		};
		this._onRequestRemove = function (e) {
			if (e.detail && e.detail.lang) {
				self.removeLanguage(e.detail.lang);
			}
		};
		dom.addEventListener('ln-translations:request-add', this._onRequestAdd);
		dom.addEventListener('ln-translations:request-remove', this._onRequestRemove);

		// Rebuild translations from an ln-fill record. Handle only a dispatch at this
		// host, not events bubbled from [data-ln-fillable] descendants.
		this._onFill = function (e) {
			if (e.target !== self.dom) return;
			self._clearLanguages();
			if (!e.detail) return;
			// record.trans: object or JSON string -> plain object (same contract as locales)
			const trans = parseLocales(e.detail.trans);
			for (const lang of Object.keys(trans)) {
				self.addLanguage(lang, trans[lang]);
			}
		};
		dom.addEventListener('ln-fill', this._onFill);

		// Detect pre-rendered server translations
		this._detectExisting();

		return this;
	}

	// ─── Default language flag ─────────────────────────────────

	_component.prototype._applyDefaultLangToWrapper = function (wrapper) {
		if (!this.defaultLang || !wrapper) return;
		const originals = wrapper.querySelectorAll('input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])');
		for (const el of originals) {
			el.setAttribute('data-ln-translatable-lang', this.defaultLang);
		}
	};

	_component.prototype._applyDefaultLang = function () {
		if (!this.defaultLang) return;

		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			this._applyDefaultLangToWrapper(wrapper);
		}
	};

	_component.prototype._cloneForWrapper = function (wrapper, lang, values) {
		if (!wrapper || !lang) return;
		if (wrapper.querySelector('[data-ln-translatable-lang="' + lang + '"]')) return;

		const field = wrapper.getAttribute('data-ln-translatable');
		const prefix = wrapper.getAttribute('data-ln-translations-prefix') || '';

		const original = wrapper.querySelector('[data-ln-translatable-lang="' + this.defaultLang + '"]') || wrapper.querySelector('input, textarea, select');
		if (!original) return;

		const langName = resolveLanguageName(lang, this.locales, this.locale);
		const placeholderPattern = (this.dict && this.dict['placeholder']) || this.placeholderLabel;
		const placeholderText = formatPlaceholder(placeholderPattern, langName);

		const clone = original.cloneNode(original.tagName === 'SELECT');
		clone.name = buildFieldName(field, lang, prefix);
		clone.value = values ? resolveTranslationValue(values, field, prefix) : '';
		clone.removeAttribute('id');

		if ('placeholder' in clone) {
			clone.placeholder = placeholderText;
		}
		clone.setAttribute('aria-label', placeholderText);
		clone.setAttribute('data-ln-translatable-lang', lang);

		const existing = wrapper.querySelectorAll('[data-ln-translatable-lang]');
		const insertAfter = existing.length > 0 ? existing[existing.length - 1] : original;
		insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
	};

	_component.prototype._syncWrapper = function (wrapper) {
		if (!wrapper) return;
		this._applyDefaultLangToWrapper(wrapper);
		for (const lang of this.activeLanguages) {
			this._cloneForWrapper(wrapper, lang, null);
		}
	};

	_component.prototype._onSubtreeChange = function (mutation) {
		if (!mutation || !mutation.addedNodes || !mutation.addedNodes.length) return;

		for (let i = 0; i < mutation.addedNodes.length; i++) {
			const node = mutation.addedNodes[i];
			if (node.nodeType !== 1) continue;

			if (node.matches && node.matches('[data-ln-translatable]')) {
				this._syncWrapper(node);
			}
			if (node.querySelectorAll) {
				const nested = node.querySelectorAll('[data-ln-translatable]');
				for (let j = 0; j < nested.length; j++) {
					this._syncWrapper(nested[j]);
				}
			}
		}
	};

	// ─── Detect existing translations ──────────────────────────

	_component.prototype._detectExisting = function () {
		const existing = this.dom.querySelectorAll('[data-ln-translatable-lang]');
		for (const el of existing) {
			const lang = el.getAttribute('data-ln-translatable-lang');
			if (lang && lang !== this.defaultLang) {
				this.activeLanguages.add(lang);
			}
		}

		if (this.activeLanguages.size > 0) {
			this._updateBadges();
			this._updateDropdown();
		}
	};

	// ─── Dropdown update ───────────────────────────────────────

	_component.prototype._updateDropdown = function () {
		if (!this.menuEl) return;

		this.menuEl.textContent = '';
		const available = filterAvailableLocales(this.locales, this.activeLanguages, this.defaultLang);

		for (let i = 0; i < available.length; i++) {
			const [lang, langName] = available[i];
			const frag = cloneTemplateScoped(this.dom, 'ln-translations-menu-item') || cloneTemplate('ln-translations-menu-item', 'ln-translations');
			if (!frag) return;

			const btn = frag.querySelector('[data-ln-translations-lang]');
			if (!btn) continue;
			btn.setAttribute('data-ln-translations-lang', lang);
			btn.textContent = langName;

			this.menuEl.appendChild(frag);
		}

		// Hide trigger if no languages available
		const triggerBtn = this.dom.querySelector('[data-ln-translations-add]');
		if (triggerBtn) {
			triggerBtn.hidden = available.length === 0;
		}
	};

	// ─── Badges update ─────────────────────────────────────────

	_component.prototype._updateBadges = function () {
		if (!this.badgesEl) return;

		this.badgesEl.textContent = '';
		const self = this;
		const removePattern = (this.dict && this.dict['remove-label']) || this.removeLabel;

		this.activeLanguages.forEach(function (lang) {
			const frag = cloneTemplateScoped(self.dom, 'ln-translations-badge') || cloneTemplate('ln-translations-badge', 'ln-translations');
			if (!frag) return;

			const p = frag.querySelector('[data-ln-translations-lang]');
			if (!p) return;
			p.setAttribute('data-ln-translations-lang', lang);

			const langName = resolveLanguageName(lang, self.locales, self.locale);
			const label = p.querySelector('span');
			if (label) {
				label.textContent = langName;
			}

			const closeBtn = p.querySelector('button');
			if (closeBtn) {
				closeBtn.setAttribute('aria-label', formatRemoveLabel(removePattern, langName));
			}

			self.badgesEl.appendChild(frag);
		});
	};

	// ─── Language field cleanup ────────────────────────────────

	_component.prototype._removeLanguageFields = function (lang) {
		const fields = this.dom.querySelectorAll('[data-ln-translatable-lang="' + lang + '"]');
		for (const el of fields) {
			el.parentNode.removeChild(el);
		}
		this.activeLanguages.delete(lang);
	};

	// Silent bulk removal (no before-remove / removed events): used by ln-fill, where a veto must not leave stale languages.
	_component.prototype._clearLanguages = function () {
		for (const lang of Array.from(this.activeLanguages)) {
			this._removeLanguageFields(lang);
		}
		this._updateDropdown();
		this._updateBadges();
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.addLanguage = function (lang, values) {
		if (!lang || lang === this.defaultLang || this.activeLanguages.has(lang)) return;

		const langName = resolveLanguageName(lang, this.locales, this.locale);
		const before = dispatchCancelable(this.dom, 'ln-translations:before-add', {
			target: this.dom, lang: lang, langName: langName
		});
		if (before.defaultPrevented) return;

		this.activeLanguages.add(lang);
		values = values || {};

		// Clone inputs for each translatable field
		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			this._cloneForWrapper(wrapper, lang, values);
		}

		this._updateDropdown();
		this._updateBadges();

		dispatch(this.dom, 'ln-translations:added', {
			target: this.dom, lang: lang, langName: langName
		});
	};

	_component.prototype.sync = function () {
		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			this._syncWrapper(wrapper);
		}
	};

	_component.prototype.removeLanguage = function (lang) {
		// Default language can never be removed; only active translations
		if (!lang || lang === this.defaultLang || !this.activeLanguages.has(lang)) return;

		const before = dispatchCancelable(this.dom, 'ln-translations:before-remove', {
			target: this.dom, lang: lang
		});
		if (before.defaultPrevented) return;

		// Remove all translation inputs for this language
		this._removeLanguageFields(lang);
		this._updateDropdown();
		this._updateBadges();

		dispatch(this.dom, 'ln-translations:removed', {
			target: this.dom, lang: lang
		});
	};

	_component.prototype.getActiveLanguages = function () {
		return new Set(this.activeLanguages);
	};

	_component.prototype.hasLanguage = function (lang) {
		return this.activeLanguages.has(lang);
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		// Remove all dynamically added translation inputs
		for (const lang of this.activeLanguages) {
			const fields = this.dom.querySelectorAll('[data-ln-translatable-lang="' + lang + '"]');
			for (const el of fields) {
				el.parentNode.removeChild(el);
			}
		}

		if (this.badgesEl) {
			this.badgesEl.textContent = '';
			if (this._boundBadgesClick) {
				this.badgesEl.removeEventListener('click', this._boundBadgesClick);
				this._boundBadgesClick = null;
			}
		}

		if (this.menuEl) {
			this.menuEl.textContent = '';
			if (this._boundMenuClick) {
				this.menuEl.removeEventListener('click', this._boundMenuClick);
				this._boundMenuClick = null;
			}
		}

		const triggerBtn = this.dom.querySelector('[data-ln-translations-add]');
		if (triggerBtn) triggerBtn.hidden = false;

		this.dom.removeEventListener('ln-translations:request-add', this._onRequestAdd);
		this.dom.removeEventListener('ln-translations:request-remove', this._onRequestRemove);
		this.dom.removeEventListener('ln-fill', this._onFill);

		this.activeLanguages.clear();
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-translations', {
		attributes: ATTRIBUTES,
		onSubtreeChange: function (host, mutation) {
			if (host[DOM_ATTRIBUTE]) host[DOM_ATTRIBUTE]._onSubtreeChange(mutation);
		}
	});
})();
