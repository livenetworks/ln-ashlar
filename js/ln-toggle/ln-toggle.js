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

	function _attachTriggers(root) {
		const triggers = Array.from(root.querySelectorAll('[data-ln-toggle-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-toggle-for')) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) return;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;
			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const targetId = btn.getAttribute('data-ln-toggle-for');
				const target = document.getElementById(targetId);
				if (!target || !target[DOM_ATTRIBUTE]) return;

				const action = btn.getAttribute('data-ln-toggle-action') || 'toggle';
				target[DOM_ATTRIBUTE][action]();
			});
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		if (this.isOpen) {
			dom.classList.add('open');
		}

		const self = this;
		this._onRequestClose = function () {
			if (self.isOpen) self.close();
		};
		this._onRequestOpen = function () {
			if (!self.isOpen) self.open();
		};
		dom.addEventListener('ln-toggle:request-close', this._onRequestClose);
		dom.addEventListener('ln-toggle:request-open', this._onRequestOpen);

		return this;
	}

	_component.prototype.open = function () {
		if (this.isOpen) return;
		const before = _dispatchCancelable(this.dom, 'ln-toggle:before-open', { target: this.dom });
		if (before.defaultPrevented) return;
		this.isOpen = true;
		this.dom.classList.add('open');
		_dispatch(this.dom, 'ln-toggle:open', { target: this.dom });
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		const before = _dispatchCancelable(this.dom, 'ln-toggle:before-close', { target: this.dom });
		if (before.defaultPrevented) return;
		this.isOpen = false;
		this.dom.classList.remove('open');
		_dispatch(this.dom, 'ln-toggle:close', { target: this.dom });
	};

	_component.prototype.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-toggle:request-close', this._onRequestClose);
		this.dom.removeEventListener('ln-toggle:request-open', this._onRequestOpen);
		_dispatch(this.dom, 'ln-toggle:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		const event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: detail || {}
		});
		element.dispatchEvent(event);
		return event;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_findElements(node);
							_attachTriggers(node);
						}
					}
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
					_attachTriggers(mutation.target);
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [DOM_SELECTOR, 'data-ln-toggle-for']
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
