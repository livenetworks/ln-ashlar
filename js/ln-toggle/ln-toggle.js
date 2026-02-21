(function () {
	const DOM_SELECTOR = 'data-ln-toggle';
	const DOM_ATTRIBUTE = 'lnToggle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
		_attachTriggers(domRoot);
	}

	function _findElements(root) {
		var items = root.querySelectorAll('[' + DOM_SELECTOR + ']') || [];
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items = Array.from(items);
			items.push(root);
		}
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		});
	}

	function _attachTriggers(root) {
		var triggers = root.querySelectorAll('[data-ln-toggle-for]') || [];
		if (root.hasAttribute && root.hasAttribute('data-ln-toggle-for')) {
			triggers = Array.from(triggers);
			triggers.push(root);
		}
		triggers.forEach(function (btn) {
			btn.addEventListener('click', function (e) {
				e.preventDefault();
				var targetId = btn.getAttribute('data-ln-toggle-for');
				var target = document.getElementById(targetId);
				if (!target || !target[DOM_ATTRIBUTE]) return;

				var action = btn.getAttribute('data-ln-toggle-action') || 'toggle';
				target[DOM_ATTRIBUTE][action]();
			});
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		if (this.isOpen) {
			dom.classList.add('open');
		}

		return this;
	}

	_component.prototype.open = function () {
		if (this.isOpen) return;
		this.isOpen = true;
		this.dom.classList.add('open');
		_dispatch(this.dom, 'ln-toggle:open', { target: this.dom });
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		this.isOpen = false;
		this.dom.classList.remove('open');
		_dispatch(this.dom, 'ln-toggle:close', { target: this.dom });
	};

	_component.prototype.toggle = function () {
		this.isOpen ? this.close() : this.open();
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
							_attachTriggers(node);
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
