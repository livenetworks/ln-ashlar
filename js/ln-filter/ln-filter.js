(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const INIT_ATTR = 'data-ln-filter-initialized';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';

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

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handlers ──────────────────────────────────────────────

	_component.prototype._attachHandlers = function () {
		var self = this;

		this.buttons.forEach(function (btn) {
			if (btn[DOM_ATTRIBUTE + 'Bound']) return;
			btn[DOM_ATTRIBUTE + 'Bound'] = true;

			btn.addEventListener('click', function (e) {
				// Update active state
				self.buttons.forEach(function (b) {
					b.classList.remove('active');
				});
				btn.classList.add('active');

				// Apply filter
				self._filter(btn);
			});
		});
	};

	_component.prototype._filter = function (btn) {
		var target = document.getElementById(this.targetId);
		if (!target) return;

		var key = btn.getAttribute(KEY_ATTR);
		var value = btn.getAttribute(VALUE_ATTR);
		if (!key) return;

		var elements = target.querySelectorAll('[data-' + key + ']');
		var matched = 0;
		var total = elements.length;

		for (var i = 0; i < elements.length; i++) {
			var el = elements[i];
			el.removeAttribute(HIDE_ATTR);

			if (value !== '' && !el.getAttribute('data-' + key).toLowerCase().includes(value.toLowerCase())) {
				el.setAttribute(HIDE_ATTR, 'true');
			} else {
				matched++;
			}
		}

		_dispatch(this.dom, 'ln-filter:change', {
			targetId: this.targetId,
			key: key,
			value: value,
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
