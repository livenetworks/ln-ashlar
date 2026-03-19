(function () {
	const DOM_SELECTOR = 'data-ln-translations';
	const DOM_ATTRIBUTE = 'lnTranslations';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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
		this.locales = {};
		this.actionsEl = null;
		this.badgesEl = null;
		this.dropdownEl = null;

		// Parse locales
		const localesAttr = dom.getAttribute(DOM_SELECTOR + '-locales');
		if (localesAttr) {
			try { this.locales = JSON.parse(localesAttr); } catch (e) { /* invalid JSON */ }
		}

		// Build header actions
		this._buildHeaderActions();

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

		// Close dropdown on outside click
		this._onDocumentClick = function (e) {
			if (self.dropdownEl && !self.dropdownEl.contains(e.target)) {
				const menu = self.dropdownEl.querySelector('.ln-translations__menu');
				if (menu) menu.removeAttribute('data-open');
			}
		};
		document.addEventListener('click', this._onDocumentClick);

		// Load active translations
		const activeAttr = dom.getAttribute(DOM_SELECTOR + '-active');
		if (activeAttr) {
			try {
				const active = JSON.parse(activeAttr);
				for (const lang in active) {
					if (active.hasOwnProperty(lang)) {
						this.addLanguage(lang, active[lang]);
					}
				}
			} catch (e) { /* invalid JSON */ }
		}

		return this;
	}

	// ─── Header Actions ────────────────────────────────────────

	_component.prototype._buildHeaderActions = function () {
		const header = this.dom.querySelector(':scope > header');
		if (!header) return;

		// Actions container
		this.actionsEl = document.createElement('span');
		this.actionsEl.className = 'ln-translations__actions';

		// Badges container
		this.badgesEl = document.createElement('span');
		this.actionsEl.appendChild(this.badgesEl);

		// Dropdown
		this.dropdownEl = document.createElement('span');
		this.dropdownEl.className = 'ln-translations__dropdown';

		const addBtn = document.createElement('button');
		addBtn.type = 'button';
		addBtn.className = 'ln-translations__add-btn';
		addBtn.textContent = '+';
		addBtn[DOM_ATTRIBUTE + 'Trigger'] = true;

		const self = this;
		addBtn.addEventListener('click', function (e) {
			if (e.ctrlKey || e.metaKey || e.button === 1) return;
			e.preventDefault();
			e.stopPropagation();
			const menu = self.dropdownEl.querySelector('.ln-translations__menu');
			if (menu) {
				menu.hasAttribute('data-open') ? menu.removeAttribute('data-open') : menu.setAttribute('data-open', '');
			}
		});

		this.dropdownEl.appendChild(addBtn);

		// Menu
		const menu = document.createElement('ul');
		menu.className = 'ln-translations__menu';
		this.dropdownEl.appendChild(menu);

		this.actionsEl.appendChild(this.dropdownEl);
		header.appendChild(this.actionsEl);

		this._updateDropdown();
	};

	_component.prototype._updateDropdown = function () {
		if (!this.dropdownEl) return;

		const menu = this.dropdownEl.querySelector('.ln-translations__menu');
		if (!menu) return;

		menu.textContent = '';
		const self = this;
		let availableCount = 0;

		for (const lang in this.locales) {
			if (!this.locales.hasOwnProperty(lang)) continue;
			if (this.activeLanguages.has(lang)) continue;
			availableCount++;

			const li = document.createElement('li');
			const btn = document.createElement('button');
			btn.type = 'button';
			btn.textContent = this.locales[lang];
			btn.setAttribute('data-lang', lang);

			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				e.stopPropagation();
				menu.removeAttribute('data-open');
				self.addLanguage(lang);
			});

			li.appendChild(btn);
			menu.appendChild(li);
		}

		// Hide dropdown if no languages available
		this.dropdownEl.style.display = availableCount === 0 ? 'none' : '';
	};

	_component.prototype._updateBadges = function () {
		if (!this.badgesEl) return;

		this.badgesEl.textContent = '';
		const self = this;

		this.activeLanguages.forEach(function (lang) {
			const badge = document.createElement('span');
			badge.className = 'ln-translations__badge';
			badge.setAttribute('data-lang', lang);

			const label = document.createTextNode(lang.toUpperCase() + ' ');
			badge.appendChild(label);

			const closeBtn = document.createElement('button');
			closeBtn.type = 'button';
			closeBtn.className = 'ln-translations__badge-remove';
			closeBtn.textContent = '\u00D7';
			closeBtn.setAttribute('aria-label', 'Remove ' + lang.toUpperCase());

			closeBtn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				e.stopPropagation();
				self.removeLanguage(lang);
			});

			badge.appendChild(closeBtn);
			self.badgesEl.appendChild(badge);
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

			// Find the original input/textarea (first one without data-ln-translatable-lang)
			const original = wrapper.querySelector('input:not([data-ln-translatable-lang]), textarea:not([data-ln-translatable-lang]), select:not([data-ln-translatable-lang])');
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
			const existing = wrapper.querySelectorAll('[data-ln-translatable-lang]');
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

		// Remove all clones
		const clones = this.dom.querySelectorAll('[data-ln-translatable-lang]');
		for (const clone of clones) {
			clone.parentNode.removeChild(clone);
		}

		// Remove header actions
		if (this.actionsEl && this.actionsEl.parentNode) {
			this.actionsEl.parentNode.removeChild(this.actionsEl);
		}

		// Remove event listeners
		this.dom.removeEventListener('ln-translations:request-add', this._onRequestAdd);
		this.dom.removeEventListener('ln-translations:request-remove', this._onRequestRemove);
		document.removeEventListener('click', this._onDocumentClick);

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
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
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
