(function () {
	const DOM_SELECTOR = 'data-ln-search';
	const DOM_ATTRIBUTE = 'lnSearch';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		var items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		});
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
		var self = this;
		if (!this._input) return;

		this._input.addEventListener('input', function () {
			var value = self._input.value;
			if (self._debounceMs > 0) {
				clearTimeout(self._debounceTimer);
				self._debounceTimer = setTimeout(function () {
					self.search(value);
				}, self._debounceMs);
			} else {
				self.search(value);
			}
		});
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.search = function (query) {
		this._query = (query || '').toLowerCase().trim();
		if (this._input && this._input.value !== (query || '')) {
			this._input.value = query || '';
		}
		this._apply();
		this._ensureTargetObserver();

		var items = this._getItems();
		var count = 0;
		items.forEach(function (el) {
			if (!el.hasAttribute('data-ln-search-hide')) count++;
		});

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

		var items = this._getItems();
		_dispatch(this.dom, 'ln-search:clear', {
			count: items.length,
			total: items.length
		});
	};

	_component.prototype.getQuery = function () {
		return this._query;
	};

	// ─── Private ───────────────────────────────────────────────

	_component.prototype._resolveTarget = function () {
		if (!this._target) {
			var targetId = this.dom.getAttribute(DOM_SELECTOR);
			this._target = targetId ? document.getElementById(targetId) : null;
		}
		return this._target;
	};

	_component.prototype._getItems = function () {
		var target = this._resolveTarget();
		if (!target) return [];
		return Array.from(target.children);
	};

	_component.prototype._apply = function () {
		var q = this._query;
		this._getItems().forEach(function (el) {
			if (q === '' || el.textContent.toLowerCase().indexOf(q) !== -1) {
				el.removeAttribute('data-ln-search-hide');
			} else {
				el.setAttribute('data-ln-search-hide', '');
			}
		});
	};

	_component.prototype._ensureTargetObserver = function () {
		var target = this._resolveTarget();
		if (!target || this._targetObserver) return;

		var self = this;
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
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					});
				}
			});
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
