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
	filterAvailableLocales
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

		// Detect pre-rendered server translations
		this._detectExisting();

		return this;
	}

	// ─── Default language flag ─────────────────────────────────

	_component.prototype._applyDefaultLang = function () {
		if (!this.defaultLang) return;

		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			const originals = wrapper.querySelectorAll('input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])');
			for (const el of originals) {
				el.setAttribute('data-ln-translatable-lang', this.defaultLang);
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

		const placeholderPattern = (this.dict && this.dict['placeholder']) || this.placeholderLabel;
		const placeholderText = formatPlaceholder(placeholderPattern, langName);

		// Clone inputs for each translatable field
		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			const field = wrapper.getAttribute('data-ln-translatable');
			const prefix = wrapper.getAttribute('data-ln-translations-prefix') || '';

			// The original input is the base field (flagged defaultLang or first input)
			const original = wrapper.querySelector('[data-ln-translatable-lang="' + this.defaultLang + '"]') || wrapper.querySelector('input, textarea, select');
			if (!original) continue;

			const clone = original.cloneNode(original.tagName === 'SELECT');

			// Set deterministic nested name: trans[lang][field]
			clone.name = buildFieldName(field, lang, prefix);

			// Set value
			clone.value = (values[field] !== undefined) ? values[field] : '';

			// Remove id to avoid duplicates in document
			clone.removeAttribute('id');

			// Set placeholder and accessible label
			if ('placeholder' in clone) {
				clone.placeholder = placeholderText;
			}
			clone.setAttribute('aria-label', placeholderText);
			clone.setAttribute('data-ln-translatable-lang', lang);

			// Insert after the last translation or after original
			const existing = wrapper.querySelectorAll('[data-ln-translatable-lang]');
			const insertAfter = existing.length > 0 ? existing[existing.length - 1] : original;
			insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
		}

		this._updateDropdown();
		this._updateBadges();

		dispatch(this.dom, 'ln-translations:added', {
			target: this.dom, lang: lang, langName: langName
		});
	};

	_component.prototype.removeLanguage = function (lang) {
		// Default language can never be removed; only active translations
		if (!lang || lang === this.defaultLang || !this.activeLanguages.has(lang)) return;

		const before = dispatchCancelable(this.dom, 'ln-translations:before-remove', {
			target: this.dom, lang: lang
		});
		if (before.defaultPrevented) return;

		// Remove all translation inputs for this language
		const fields = this.dom.querySelectorAll('[data-ln-translatable-lang="' + lang + '"]');
		for (const el of fields) {
			el.parentNode.removeChild(el);
		}

		this.activeLanguages.delete(lang);
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

		this.activeLanguages.clear();
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-translations', {
		attributes: ATTRIBUTES
	});
})();
