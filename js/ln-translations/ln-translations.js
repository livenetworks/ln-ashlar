(function () {
	const DOM_SELECTOR = 'data-ln-translations';
	const DOM_ATTRIBUTE = 'lnTranslations';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Default locales (override via data-ln-translations-locales JSON) ──

	var DEFAULT_LOCALES = {
		en: 'English',
		sq: 'Shqip',
		sr: 'Srpski'
	};

	// ─── Template cache ────────────────────────────────────────

	var _tmplCache = {};
	function _cloneTemplate(name) {
		if (!_tmplCache[name]) {
			_tmplCache[name] = document.querySelector('[data-ln-template="' + name + '"]');
		}
		return _tmplCache[name].content.cloneNode(true);
	}

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.activeLanguages = new Set();
		this.defaultLang = dom.getAttribute(DOM_SELECTOR + '-default') || '';
		this.badgesEl = dom.querySelector('[' + DOM_SELECTOR + '-active]');
		this.menuEl = dom.querySelector('[data-ln-dropdown] > [data-ln-toggle]');

		// Parse locales from attribute or use defaults
		var localesAttr = dom.getAttribute(DOM_SELECTOR + '-locales');
		this.locales = DEFAULT_LOCALES;
		if (localesAttr) {
			try { this.locales = JSON.parse(localesAttr); }
			catch (e) { console.warn('[ln-translations] Invalid JSON in data-ln-translations-locales'); }
		}

		// Set default language flag on original inputs
		this._applyDefaultLang();

		// Populate dropdown menu
		this._updateDropdown();

		// Bind request events
		const self = this;
		this._onRequestAdd = function (e) {
			if (e.detail && e.detail.lang) self.addLanguage(e.detail.lang);
		};
		this._onRequestRemove = function (e) {
			if (e.detail && e.detail.lang) self.removeLanguage(e.detail.lang);
		};
		dom.addEventListener('ln-translations:request-add', this._onRequestAdd);
		dom.addEventListener('ln-translations:request-remove', this._onRequestRemove);

		// Detect existing translations in DOM (server-rendered)
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
		const self = this;
		let availableCount = 0;

		for (const lang in this.locales) {
			if (!this.locales.hasOwnProperty(lang)) continue;
			if (this.activeLanguages.has(lang)) continue;
			availableCount++;

			const frag = _cloneTemplate('ln-translations-menu-item');
			const btn = frag.querySelector('[data-ln-translations-lang]');
			btn.setAttribute('data-ln-translations-lang', lang);
			btn.textContent = this.locales[lang];

			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				e.stopPropagation();
				self.menuEl.dispatchEvent(new CustomEvent('ln-toggle:request-close'));
				self.addLanguage(lang);
			});

			this.menuEl.appendChild(frag);
		}

		// Hide trigger if no languages available
		var triggerBtn = this.dom.querySelector('[' + DOM_SELECTOR + '-add]');
		if (triggerBtn) {
			triggerBtn.style.display = availableCount === 0 ? 'none' : '';
		}
	};

	// ─── Badges update ─────────────────────────────────────────

	_component.prototype._updateBadges = function () {
		if (!this.badgesEl) return;

		this.badgesEl.textContent = '';
		const self = this;

		this.activeLanguages.forEach(function (lang) {
			const frag = _cloneTemplate('ln-translations-badge');
			const p = frag.querySelector('[data-ln-translations-lang]');
			p.setAttribute('data-ln-translations-lang', lang);

			const label = p.querySelector('span');
			label.textContent = self.locales[lang] || lang.toUpperCase();

			const closeBtn = p.querySelector('button');
			closeBtn.setAttribute('aria-label', 'Remove ' + (self.locales[lang] || lang.toUpperCase()));

			closeBtn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				e.stopPropagation();
				self.removeLanguage(lang);
			});

			self.badgesEl.appendChild(frag);
		});
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.addLanguage = function (lang, values) {
		if (this.activeLanguages.has(lang)) return;

		const langName = this.locales[lang] || lang;
		const before = _dispatchCancelable(this.dom, 'ln-translations:before-add', {
			target: this.dom, lang: lang, langName: langName
		});
		if (before.defaultPrevented) return;

		this.activeLanguages.add(lang);
		values = values || {};

		// Clone inputs for each translatable field
		const translatables = this.dom.querySelectorAll('[data-ln-translatable]');
		for (const wrapper of translatables) {
			const field = wrapper.getAttribute('data-ln-translatable');
			const prefix = wrapper.getAttribute('data-ln-translations-prefix') || '';

			// Find the original input/textarea (first one without data-ln-translatable-lang, or with default lang)
			const original = wrapper.querySelector(
				this.defaultLang
					? '[data-ln-translatable-lang="' + this.defaultLang + '"]'
					: 'input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])'
			);
			if (!original) continue;

			const clone = original.cloneNode(false);

			// Set name
			if (prefix) {
				clone.name = prefix + '[trans][' + lang + '][' + field + ']';
			} else {
				clone.name = 'trans[' + lang + '][' + field + ']';
			}

			// Set value
			clone.value = (values[field] !== undefined) ? values[field] : '';

			// Remove id to avoid duplicates
			clone.removeAttribute('id');

			// Set placeholder
			clone.placeholder = langName + ' translation';

			// Mark with language attribute
			clone.setAttribute('data-ln-translatable-lang', lang);

			// Insert after original or after last clone for this field
			const existing = wrapper.querySelectorAll('[data-ln-translatable-lang]:not([data-ln-translatable-lang="' + this.defaultLang + '"])');
			const insertAfter = existing.length > 0 ? existing[existing.length - 1] : original;
			insertAfter.parentNode.insertBefore(clone, insertAfter.nextSibling);
		}

		this._updateDropdown();
		this._updateBadges();

		_dispatch(this.dom, 'ln-translations:added', {
			target: this.dom, lang: lang, langName: langName
		});
	};

	_component.prototype.removeLanguage = function (lang) {
		if (!this.activeLanguages.has(lang)) return;

		const before = _dispatchCancelable(this.dom, 'ln-translations:before-remove', {
			target: this.dom, lang: lang
		});
		if (before.defaultPrevented) return;

		// Remove all clones for this language
		const clones = this.dom.querySelectorAll('[data-ln-translatable-lang="' + lang + '"]');
		for (const clone of clones) {
			clone.parentNode.removeChild(clone);
		}

		this.activeLanguages.delete(lang);
		this._updateDropdown();
		this._updateBadges();

		_dispatch(this.dom, 'ln-translations:removed', {
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

		// Remove all translation clones (not default lang)
		const defaultLang = this.defaultLang;
		const clones = this.dom.querySelectorAll('[data-ln-translatable-lang]');
		for (const clone of clones) {
			if (clone.getAttribute('data-ln-translatable-lang') !== defaultLang) {
				clone.parentNode.removeChild(clone);
			}
		}

		// Remove event listeners
		this.dom.removeEventListener('ln-translations:request-add', this._onRequestAdd);
		this.dom.removeEventListener('ln-translations:request-remove', this._onRequestRemove);

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					}
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [DOM_SELECTOR]
		});
	}

	// ─── Init ──────────────────────────────────────────────────

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			constructor(document.body);
		});
	} else {
		constructor(document.body);
	}
})();
