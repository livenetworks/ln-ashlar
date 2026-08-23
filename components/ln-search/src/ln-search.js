import { dispatchCancelable, registerComponent, queueBoot, hashGet, hashSet, resolveHashNamespace } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-search';
	const DOM_ATTRIBUTE = 'lnSearch';
	const CONTROL_SELECTOR = 'data-ln-search-for';
	const CONTROL_ATTRIBUTE = 'lnSearchControl';
	const ITEMS_ATTR = 'data-ln-search-items';
	const FIELDS_ATTR = 'data-ln-search-fields';
	const EXCLUDE_ATTR = 'data-ln-search-exclude';
	const HIDE_ATTR = 'data-ln-search-hide';
	const HASH_ATTR = 'data-ln-hash';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Helpers ───────────────────────────────────────────────

	// Resolves the hash namespace for search from target or its control
	function _resolveSearchHashNamespace(target) {
		const fromTarget = resolveHashNamespace(target, 'search');
		if (fromTarget) return fromTarget;
		if (target.id) {
			const control = document.querySelector('[' + CONTROL_SELECTOR + '="' + target.id + '"]');
			if (control) {
				const fromControl = resolveHashNamespace(control, 'search');
				if (fromControl) return fromControl;
			}
		}
		return null;
	}

	// Matching form of the term — unchanged from the previous implementation.
	// The attribute keeps the raw string, so writing it back into the input is
	// byte-identical and the caret never jumps.
	function _normalizeTerm(value) {
		return (value || '').trim().toLowerCase();
	}

	// Whitespace separates tokens. Every token must be found (AND), order does
	// not matter. Plain substring tests only — never a RegExp built from input.
	function _tokenize(term) {
		if (!term) return [];
		return term.split(/\s+/).filter(Boolean);
	}

	// Control host is the input itself, or a wrapper around it.
	function _resolveInput(host) {
		return host.matches('input, textarea') ? host : host.querySelector('input, textarea');
	}

	// Forwarded to consumers in the event detail; never matched here.
	function _parseFields(target) {
		const raw = target.getAttribute(FIELDS_ATTR);
		if (raw === null) return null;
		const fields = raw.split(',').map(function (f) { return f.trim(); }).filter(Boolean);
		return fields.length ? fields : null;
	}

	function _collectText(node, parts) {
		const children = node.childNodes;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			if (child.nodeType === 3) {
				parts.push(child.nodeValue);
				continue;
			}
			if (child.nodeType !== 1) continue;
			if (child.hasAttribute(EXCLUDE_ATTR)) continue;
			_collectText(child, parts);
		}
	}

	// Item text minus every [data-ln-search-exclude] subtree. Parts join with a
	// space so a token cannot match across an element boundary. Same collapse +
	// lower-case the previous textContent path applied.
	// Results are cached on el._lnSearchText to avoid repetitive DOM walks during keystrokes;
	// cache is automatically invalidated when childList or characterData mutates.
	// Never called for an exempt item — _apply short-circuits those before here.
	function _searchText(el) {
		if (el._lnSearchText !== undefined) return el._lnSearchText;
		const parts = [];
		_collectText(el, parts);
		const text = parts.join(' ').replace(/\s+/g, ' ').toLowerCase();
		el._lnSearchText = text;
		return text;
	}

	// Attribute is the truth: push it back into every control pointing here.
	// The target holds no control reference, so the lookup is by id.
	function _syncControls(target, term) {
		if (!target.id) return;
		const controls = document.querySelectorAll('[' + CONTROL_SELECTOR + '="' + target.id + '"]');
		for (const control of controls) {
			const input = _resolveInput(control);
			if (input && input.value !== term) input.value = term;
		}
	}

	// ─── State Component (the target) ──────────────────────────

	function _stateComponent(dom) {
		this.dom = dom;
		this.term = dom.getAttribute(DOM_SELECTOR) || '';
		this._destroyed = false;

		const self = this;
		this.nsKey = _resolveSearchHashNamespace(dom);
		this.hashEnabled = !!this.nsKey;

		// Hash change listener
		this._onHashChange = function () {
			if (self._destroyed || !self.hashEnabled) return;
			const query = hashGet(self.nsKey);
			const current = self.dom.getAttribute(DOM_SELECTOR) || '';
			if (query !== null && query !== current) {
				self.dom.setAttribute(DOM_SELECTOR, query);
			} else if (query === null && current !== '') {
				self.dom.setAttribute(DOM_SELECTOR, '');
			}
		};
		if (this.hashEnabled) {
			window.addEventListener('hashchange', this._onHashChange);
		}

		// Seed an authored / deep-linked term. Deferred through queueBoot so
		// consumers on this same element have finished init and can prevent
		// the default before the first dispatch.
		queueBoot(function () {
			if (self._destroyed) return;
			if (self.hashEnabled) {
				const hashVal = hashGet(self.nsKey);
				if (hashVal !== null && hashVal !== self.term) {
					self.term = hashVal;
					self.dom.setAttribute(DOM_SELECTOR, hashVal);
					_syncControls(self.dom, hashVal);
					self._apply();
					return;
				}
			}
			if (_normalizeTerm(self.term)) {
				_syncControls(self.dom, self.term);
				self._apply();
			}
		});

		return this;
	}


	_stateComponent.prototype._apply = function () {
		const dom = this.dom;
		const term = _normalizeTerm(this.term);
		const tokens = _tokenize(term);

		if (this.hashEnabled) {
			hashSet(this.nsKey, this.term ? this.term : null);
		}

		// Consumers (ln-table, ln-list, ln-data-store) call preventDefault() to
		// filter their own records. term keeps exactly its previous meaning;
		// tokens and fields are forwarded for them to adopt.
		const evt = dispatchCancelable(dom, 'ln-search:change', {
			term: term,
			tokens: tokens,
			targetId: dom.id,
			fields: _parseFields(dom)
		});
		if (evt.defaultPrevented) return;

		// Default behaviour: show/hide items in the target.
		// data-ln-search-items="selector" enables deep targeting.
		const itemsSelector = dom.getAttribute(ITEMS_ATTR);
		const items = itemsSelector ? dom.querySelectorAll(itemsSelector) : dom.children;

		for (let i = 0; i < items.length; i++) {
			const el = items[i];

			// Removal first: an item that just became exempt, or that no longer
			// fails a token, has to come back into view.
			el.removeAttribute(HIDE_ATTR);

			// data-ln-search-exclude on the item itself means "do not search me":
			// exempt from filtering, never walked, never tested, never hidden.
			if (el.hasAttribute(EXCLUDE_ATTR)) continue;

			// No tokens = no query = nothing to hide.
			if (tokens.length === 0) continue;

			// AND across tokens, order-independent, plain substring per token.
			const text = _searchText(el);
			for (let t = 0; t < tokens.length; t++) {
				if (text.indexOf(tokens[t]) === -1) {
					el.setAttribute(HIDE_ATTR, 'true');
					break;
				}
			}
		}
	};

	_stateComponent.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._destroyed = true;
		if (this.hashEnabled && this._onHashChange) {
			window.removeEventListener('hashchange', this._onHashChange);
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Control Component (the input side) ────────────────────

	function _controlComponent(dom) {
		this.dom = dom;
		this.targetId = dom.getAttribute(CONTROL_SELECTOR);
		this.input = _resolveInput(dom);

		this._attachHandler();

		// The browser can fill the input with no event fired — form restore on reload /
		// back-forward, or a server-rendered value attribute. Only a read catches that.
		// Deferred through queueBoot so consumers on the target finish init first.
		if (this.input && this.input.value.trim()) {
			const self = this;
			queueBoot(function () {
				const target = document.getElementById(self.targetId);
				if (!target) return;
				// An authored or deep-linked term wins; a restored input fills only an
				// empty attribute, so there is nothing to reconcile.
				if ((target.getAttribute(DOM_SELECTOR) || '').trim()) return;
				self._write(self.input.value);
			});
		}

		return this;
	}

	// Target resolved per write, never at init — the control may boot first.
	_controlComponent.prototype._write = function (value) {
		const target = document.getElementById(this.targetId);
		if (!target) return;
		if (target.getAttribute(DOM_SELECTOR) === value) return;
		target.setAttribute(DOM_SELECTOR, value);
	};

	_controlComponent.prototype._attachHandler = function () {
		if (!this.input) return;
		const self = this;

		this._onInput = function () {
			self._write(self.input.value);
		};

		this.input.addEventListener('input', this._onInput);
	};

	_controlComponent.prototype.destroy = function () {
		if (!this.dom[CONTROL_ATTRIBUTE]) return;
		if (this.input && this._onInput) {
			this.input.removeEventListener('input', this._onInput);
		}
		delete this.dom[CONTROL_ATTRIBUTE];
	};

	// ─── Global Delegated Clear Triggers ───────────────────────
	// Handles clearing search on:
	// 1. <button data-ln-search-clear-for="targetId"> (explicit target, anywhere on page / data-driven empty states)
	// 2. <button data-ln-search-clear> inside [data-ln-search] (SSR empty states in lists, tables, sections)
	// 3. <button data-ln-search-clear> inside [data-ln-search-for] control wrapper
	// 4. <button data-ln-search-clear> sibling to input inside .search chrome

	function _resolveTargetAndInputFromClearBtn(btn) {
		const explicitId = btn.getAttribute('data-ln-search-clear-for');
		if (explicitId) {
			const target = document.getElementById(explicitId);
			const control = document.querySelector('[' + CONTROL_SELECTOR + '="' + explicitId + '"]');
			const input = control ? _resolveInput(control) : null;
			return { target: target, input: input };
		}

		// 1. Clear button is inside a search state target (e.g. SSR empty-state inside [data-ln-search])
		const target = btn.closest('[' + DOM_SELECTOR + ']');
		if (target) {
			const control = target.id ? document.querySelector('[' + CONTROL_SELECTOR + '="' + target.id + '"]') : null;
			const input = control ? _resolveInput(control) : null;
			return { target: target, input: input };
		}

		// 1b. Clear button is inside a view bound to a search target (data-ln-table-source / data-ln-list-source)
		const view = btn.closest('[data-ln-table-source], [data-ln-list-source]');
		if (view) {
			const sourceId = view.getAttribute('data-ln-table-source') || view.getAttribute('data-ln-list-source');
			const sourceTarget = sourceId ? document.getElementById(sourceId) : null;
			if (sourceTarget && sourceTarget.hasAttribute(DOM_SELECTOR)) {
				const control = document.querySelector('[' + CONTROL_SELECTOR + '="' + sourceId + '"]');
				const input = control ? _resolveInput(control) : null;
				return { target: sourceTarget, input: input };
			}
		}

		// 2. Clear button is inside a search control wrapper (when data-ln-search-for is on wrapper)
		const controlWrap = btn.closest('[' + CONTROL_SELECTOR + ']');
		if (controlWrap) {
			const targetId = controlWrap.getAttribute(CONTROL_SELECTOR);
			const target = targetId ? document.getElementById(targetId) : null;
			const input = _resolveInput(controlWrap);
			return { target: target, input: input };
		}

		// 3. Clear button is a sibling to the search input in the chrome (when data-ln-search-for is on <input>)
		const parent = btn.parentElement;
		if (parent) {
			const controlEl = parent.querySelector('[' + CONTROL_SELECTOR + ']');
			if (controlEl) {
				const targetId = controlEl.getAttribute(CONTROL_SELECTOR);
				const target = targetId ? document.getElementById(targetId) : null;
				const input = _resolveInput(controlEl);
				return { target: target, input: input };
			}
		}

		return { target: null, input: null };
	}

	document.addEventListener('click', function (e) {
		const btn = e.target.closest('[data-ln-search-clear], [data-ln-search-clear-for]');
		if (!btn) return;

		const res = _resolveTargetAndInputFromClearBtn(btn);
		if (!res.target && !res.input) return;

		e.preventDefault();

		if (res.input) {
			res.input.value = '';
			res.input.focus();
		}

		if (res.target) {
			res.target.setAttribute(DOM_SELECTOR, '');
		}
	});

	// ─── Attribute Sync (state is the single source of truth) ──

	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || instance._destroyed) return;

		if (attrName === HASH_ATTR) {
			if (instance._onHashChange) window.removeEventListener('hashchange', instance._onHashChange);
			instance.nsKey = _resolveSearchHashNamespace(el);
			instance.hashEnabled = !!instance.nsKey;
			if (instance.hashEnabled) window.addEventListener('hashchange', instance._onHashChange);
			return;
		}

		const next = el.getAttribute(DOM_SELECTOR) || '';
		// Breaks the input → attribute → input round trip.
		if (next === instance.term) return;

		instance.term = next;
		_syncControls(el, next);
		instance._apply();
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _stateComponent, 'ln-search', {
		extraAttributes: [HASH_ATTR],
		onAttributeChange: _syncAttribute,
		onSubtreeChange: function (el, mut) {
			const target = mut.target;
			if (target && target._lnSearchText !== undefined) delete target._lnSearchText;
			if (target && target.parentElement && target.parentElement._lnSearchText !== undefined) {
				delete target.parentElement._lnSearchText;
			}
		}
	});

	registerComponent(CONTROL_SELECTOR, CONTROL_ATTRIBUTE, _controlComponent, 'ln-search-control');
})();

