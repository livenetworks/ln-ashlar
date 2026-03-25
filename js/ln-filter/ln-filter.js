(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const INIT_ATTR = 'data-ln-filter-initialized';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const ACTIVE_ATTR = 'data-active';

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
		this.buttons = Array.from(dom.querySelectorAll('button'));

		this._attachHandlers();

		// Initialize aria-pressed on all filter buttons
		this.buttons.forEach(function (btn) {
			btn.setAttribute('aria-pressed', btn.hasAttribute(ACTIVE_ATTR) ? 'true' : 'false');
		});

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handlers ──────────────────────────────────────────────

	_component.prototype._attachHandlers = function () {
		var self = this;

		this.buttons.forEach(function (btn) {
			if (btn[DOM_ATTRIBUTE + 'Bound']) return;
			btn[DOM_ATTRIBUTE + 'Bound'] = true;

			btn.addEventListener('click', function () {
				var key = btn.getAttribute(KEY_ATTR);
				var value = btn.getAttribute(VALUE_ATTR);

				if (value === '') {
					self.reset();
				} else {
					self._setActive(btn);
					self._applyFilter(key, value);
					_dispatch(self.dom, 'ln-filter:changed', { key: key, value: value });
				}
			});
		});
	};

	// ─── Filter logic ──────────────────────────────────────────

	_component.prototype._applyFilter = function (key, value) {
		var target = document.getElementById(this.targetId);
		if (!target) return;

		var children = Array.from(target.children);

		for (var i = 0; i < children.length; i++) {
			var el = children[i];
			var attr = el.getAttribute('data-' + key);

			el.removeAttribute(HIDE_ATTR);

			if (attr === null) continue;

			if (value && attr.toLowerCase() !== value.toLowerCase()) {
				el.setAttribute(HIDE_ATTR, 'true');
			}
		}
	};

	_component.prototype._setActive = function (btn) {
		this.buttons.forEach(function (b) {
			b.removeAttribute(ACTIVE_ATTR);
			b.setAttribute('aria-pressed', 'false');
		});
		if (btn) {
			btn.setAttribute(ACTIVE_ATTR, '');
			btn.setAttribute('aria-pressed', 'true');
		}
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.filter = function (key, value) {
		this._setActive(null);

		// Highlight matching button if one exists
		for (var i = 0; i < this.buttons.length; i++) {
			var btn = this.buttons[i];
			if (btn.getAttribute(KEY_ATTR) === key && btn.getAttribute(VALUE_ATTR) === value) {
				this._setActive(btn);
				break;
			}
		}

		this._applyFilter(key, value);
		_dispatch(this.dom, 'ln-filter:changed', { key: key, value: value });
	};

	_component.prototype.reset = function () {
		var target = document.getElementById(this.targetId);
		if (target) {
			var children = Array.from(target.children);
			for (var i = 0; i < children.length; i++) {
				children[i].removeAttribute(HIDE_ATTR);
			}
		}

		// Activate the "all" button (empty value)
		var allBtn = null;
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].getAttribute(VALUE_ATTR) === '') {
				allBtn = this.buttons[i];
				break;
			}
		}
		this._setActive(allBtn);

		_dispatch(this.dom, 'ln-filter:reset', {});
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
