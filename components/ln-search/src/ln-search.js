import { dispatchCancelable, hashGet, hashSet, queueBoot, registerComponent, resolveHashNamespace } from '../../ln-core';
import { collapseSearchParts, matchesSearchTokens, normalizeSearchTerm, parseSearchFields, tokenizeSearchQuery } from './search-model.js';

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

	// ─── DOM Helpers ───────────────────────────────────────────

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

	function _resolveInput(host) {
		return host.matches('input, textarea') ? host : host.querySelector('input, textarea');
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

	function _searchText(el) {
		if (el._lnSearchText !== undefined) return el._lnSearchText;
		const parts = [];
		_collectText(el, parts);
		const text = collapseSearchParts(parts);
		el._lnSearchText = text;
		return text;
	}

	function _syncControls(target, term) {
		if (!target.id) return;
		const controls = document.querySelectorAll('[' + CONTROL_SELECTOR + '="' + target.id + '"]');
		for (const control of controls) {
			const input = _resolveInput(control);
			if (input && input.value !== term) input.value = term;
		}
	}

	// ─── State Component (Search Target) ───────────────────────

	function _stateComponent(dom) {
		this.dom = dom;
		this.term = dom.getAttribute(DOM_SELECTOR) || '';
		this._destroyed = false;

		const self = this;
		this.nsKey = _resolveSearchHashNamespace(dom);
		this.hashEnabled = !!this.nsKey;

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
			if (normalizeSearchTerm(self.term)) {
				_syncControls(self.dom, self.term);
				self._apply();
			}
		});

		return this;
	}

	_stateComponent.prototype._apply = function () {
		const dom = this.dom;
		const term = normalizeSearchTerm(this.term);
		const tokens = tokenizeSearchQuery(term);

		if (this.hashEnabled) {
			hashSet(this.nsKey, this.term ? this.term : null);
		}

		const fields = parseSearchFields(dom.getAttribute(FIELDS_ATTR));
		const evt = dispatchCancelable(dom, 'ln-search:change', {
			term: term,
			tokens: tokens,
			targetId: dom.id,
			fields: fields
		});
		if (evt.defaultPrevented) return;

		const itemsSelector = dom.getAttribute(ITEMS_ATTR);
		const items = itemsSelector ? dom.querySelectorAll(itemsSelector) : dom.children;

		for (let i = 0; i < items.length; i++) {
			const el = items[i];
			el.removeAttribute(HIDE_ATTR);
			if (el.hasAttribute(EXCLUDE_ATTR)) continue;
			if (tokens.length === 0) continue;

			const text = _searchText(el);
			if (!matchesSearchTokens(text, tokens)) {
				el.setAttribute(HIDE_ATTR, 'true');
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

	// ─── Control Component (Search Input / Proxy) ──────────────

	function _controlComponent(dom) {
		this.dom = dom;
		this.targetId = dom.getAttribute(CONTROL_SELECTOR);
		this.input = _resolveInput(dom);

		this._attachHandler();

		if (this.input && this.input.value.trim()) {
			const self = this;
			queueBoot(function () {
				const target = document.getElementById(self.targetId);
				if (!target) return;
				if ((target.getAttribute(DOM_SELECTOR) || '').trim()) return;
				self._write(self.input.value);
			});
		}

		return this;
	}

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

	function _resolveTargetAndInputFromClearBtn(btn) {
		const explicitId = btn.getAttribute('data-ln-search-clear-for');
		if (explicitId) {
			const target = document.getElementById(explicitId);
			const control = document.querySelector('[' + CONTROL_SELECTOR + '="' + explicitId + '"]');
			const input = control ? _resolveInput(control) : null;
			return { target: target, input: input };
		}

		const target = btn.closest('[' + DOM_SELECTOR + ']');
		if (target) {
			const control = target.id ? document.querySelector('[' + CONTROL_SELECTOR + '="' + target.id + '"]') : null;
			const input = control ? _resolveInput(control) : null;
			return { target: target, input: input };
		}

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

		const controlWrap = btn.closest('[' + CONTROL_SELECTOR + ']');
		if (controlWrap) {
			const targetId = controlWrap.getAttribute(CONTROL_SELECTOR);
			const target = targetId ? document.getElementById(targetId) : null;
			const input = _resolveInput(controlWrap);
			return { target: target, input: input };
		}

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

	// ─── Attribute Sync ────────────────────────────────────────

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
		if (next === instance.term) return;

		instance.term = next;
		_syncControls(el, next);
		instance._apply();
	}

	// ─── Registration ──────────────────────────────────────────

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
