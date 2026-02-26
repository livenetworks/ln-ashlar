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

	function _attachTriggers(root) {
		var triggers = Array.from(root.querySelectorAll('[data-ln-toggle-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-toggle-for')) {
			triggers.push(root);
		}
		triggers.forEach(function (btn) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) return;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;
			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
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

		var self = this;
		dom.addEventListener('ln-toggle:request-close', function () {
			if (self.isOpen) {
				self.close();
			}
		});

		dom.addEventListener('ln-toggle:request-open', function () {
			if (!self.isOpen) {
				self.open();
			}
		});

		return this;
	}

	_component.prototype.open = function () {
		if (this.isOpen) return;
		var before = _dispatchCancelable(this.dom, 'ln-toggle:before-open', { target: this.dom });
		if (before.defaultPrevented) return;
		this.isOpen = true;
		this.dom.classList.add('open');
		_dispatch(this.dom, 'ln-toggle:open', { target: this.dom });
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		var before = _dispatchCancelable(this.dom, 'ln-toggle:before-close', { target: this.dom });
		if (before.defaultPrevented) return;
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

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
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
