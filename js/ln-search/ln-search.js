(function () {
	const DOM_SELECTOR = 'data-ln-search';
	const DOM_ATTRIBUTE = 'lnSearch';

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
		dom[DOM_ATTRIBUTE] = this;

		this._query = '';
		this._debounceMs = parseInt(dom.getAttribute('data-ln-search-debounce') || '0', 10);
		this._debounceTimer = null;
		this._target = null;
		this._targetObserver = null;

		this._input = dom.querySelector('[data-ln-search-input]');

		this._bindEvents();
		return this;
	}

	_component.prototype._bindEvents = function () {
		const self = this;
		if (!this._input) return;

		this._inputHandler = function () {
			const value = self._input.value;
			if (self._debounceMs > 0) {
				clearTimeout(self._debounceTimer);
				self._debounceTimer = setTimeout(function () {
					self.search(value);
				}, self._debounceMs);
			} else {
				self.search(value);
			}
		};
		this._input.addEventListener('input', this._inputHandler);
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.search = function (query) {
		this._query = (query || '').toLowerCase().trim();
		if (this._input && this._input.value !== (query || '')) {
			this._input.value = query || '';
		}
		this._apply();
		this._ensureTargetObserver();

		const items = this._getItems();
		let count = 0;
		for (const el of items) {
			if (!el.hasAttribute('data-ln-search-hide')) count++;
		}

		_dispatch(this.dom, 'ln-search:input', {
			query: this._query,
			count: count,
			total: items.length
		});
	};

	_component.prototype.clear = function () {
		this._query = '';
		if (this._input) this._input.value = '';
		this._apply();

		const items = this._getItems();
		_dispatch(this.dom, 'ln-search:clear', {
			count: items.length,
			total: items.length
		});
	};

	_component.prototype.getQuery = function () {
		return this._query;
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this._input && this._inputHandler) {
			this._input.removeEventListener('input', this._inputHandler);
		}
		clearTimeout(this._debounceTimer);
		if (this._targetObserver) {
			this._targetObserver.disconnect();
		}
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Private ───────────────────────────────────────────────

	_component.prototype._resolveTarget = function () {
		if (!this._target) {
			const targetId = this.dom.getAttribute(DOM_SELECTOR);
			this._target = targetId ? document.getElementById(targetId) : null;
		}
		return this._target;
	};

	_component.prototype._getItems = function () {
		const target = this._resolveTarget();
		if (!target) return [];
		return Array.from(target.children);
	};

	_component.prototype._apply = function () {
		const q = this._query;
		for (const el of this._getItems()) {
			if (q === '' || el.textContent.toLowerCase().indexOf(q) !== -1) {
				el.removeAttribute('data-ln-search-hide');
			} else {
				el.setAttribute('data-ln-search-hide', '');
			}
		}
	};

	_component.prototype._ensureTargetObserver = function () {
		const target = this._resolveTarget();
		if (!target || this._targetObserver) return;

		const self = this;
		this._targetObserver = new MutationObserver(function () {
			if (self._query) self._apply();
		});
		this._targetObserver.observe(target, { childList: true });
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
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
