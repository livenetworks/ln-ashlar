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

		// Support data-ln-search directly on <input> or on a wrapper element
		var tag = dom.tagName;
		this.input = (tag === 'INPUT' || tag === 'TEXTAREA') ? dom
			: dom.querySelector('[name="search"]')
			|| dom.querySelector('input[type="search"]')
			|| dom.querySelector('input[type="text"]');

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

		// Dispatch cancelable event on target.
		// Consumers (e.g. ln-table) can call preventDefault() to handle filtering
		// themselves and skip the default DOM show/hide behaviour.
		var evt = new CustomEvent('ln-search:change', {
			bubbles: true,
			cancelable: true,
			detail: { term: term, targetId: this.targetId }
		});

		if (!target.dispatchEvent(evt)) return; // preventDefault() called — bail out

		// Default behaviour: show/hide direct children of target
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
	};

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
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
				}
			});
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
