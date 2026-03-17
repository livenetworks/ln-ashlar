(function () {
	const DOM_SELECTOR = 'data-ln-search';
	const DOM_ATTRIBUTE = 'lnSearch';
	const INIT_ATTR = 'data-ln-search-initialized';
	const HIDE_ATTR = 'data-ln-search-hide';
	const DEBOUNCE_MS = 150;

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
		if (dom.hasAttribute(INIT_ATTR)) return this;

		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);
		this.input = dom.querySelector('[name="search"]') ||
		             dom.querySelector('input[type="search"]') ||
		             dom.querySelector('input[type="text"]');
		this._debounceTimer = null;

		this._attachHandler();

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handler ───────────────────────────────────────────────

	_component.prototype._attachHandler = function () {
		if (!this.input) return;
		var self = this;

		this.input.addEventListener('input', function () {
			clearTimeout(self._debounceTimer);
			self._debounceTimer = setTimeout(function () {
				self._search(self.input.value.trim().toLowerCase());
			}, DEBOUNCE_MS);
		});
	};

	_component.prototype._search = function (term) {
		var target = document.getElementById(this.targetId);
		if (!target) return;

		var children = target.children;
		var matched = 0;
		var total = children.length;

		for (var i = 0; i < children.length; i++) {
			var el = children[i];
			el.removeAttribute(HIDE_ATTR);

			if (term && !el.textContent.replace(/\s+/g, ' ').toLowerCase().includes(term)) {
				el.setAttribute(HIDE_ATTR, 'true');
			} else {
				matched++;
			}
		}

		_dispatch(this.dom, 'ln-search:change', {
			targetId: this.targetId,
			term: term,
			matched: matched,
			total: total
		});
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
