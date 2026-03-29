(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findModals(domRoot);
		_attachTriggers(domRoot);
	}

	function _findModals(root) {
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
		const triggers = Array.from(root.querySelectorAll('[data-ln-modal-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-modal-for')) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;
			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const modalId = btn.getAttribute('data-ln-modal-for');
				const target = document.getElementById(modalId);
				if (!target || !target[DOM_ATTRIBUTE]) return;
				target[DOM_ATTRIBUTE].toggle();
			});
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		const self = this;

		this._onEscape = function (e) {
			if (e.key === 'Escape') self.close();
		};

		this._onFocusTrap = function (e) {
			if (e.key !== 'Tab') return;
			var focusable = self.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
			if (focusable.length === 0) return;
			var first = focusable[0];
			var last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last.focus(); }
			} else {
				if (document.activeElement === last) { e.preventDefault(); first.focus(); }
			}
		};

		this._onClose = function (e) {
			e.preventDefault();
			self.close();
		};

		_attachCloseButtons(this);

		// Apply initial state if open
		if (this.isOpen) {
			this.dom.setAttribute('aria-modal', 'true');
			this.dom.setAttribute('role', 'dialog');
			document.body.classList.add('ln-modal-open');
			document.addEventListener('keydown', this._onEscape);
			document.addEventListener('keydown', this._onFocusTrap);
		}

		return this;
	}

	_component.prototype.open = function () {
		if (this.isOpen) return;
		this.dom.setAttribute(DOM_SELECTOR, 'open');
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		this.dom.setAttribute(DOM_SELECTOR, 'close');
	};

	_component.prototype.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this.isOpen) {
			this.dom.removeAttribute('aria-modal');
			document.removeEventListener('keydown', this._onEscape);
			document.removeEventListener('keydown', this._onFocusTrap);
			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}
		}

		const closeButtons = this.dom.querySelectorAll('[data-ln-modal-close]');
		for (const btn of closeButtons) {
			if (btn[DOM_ATTRIBUTE + 'Close']) {
				btn.removeEventListener('click', btn[DOM_ATTRIBUTE + 'Close']);
				delete btn[DOM_ATTRIBUTE + 'Close'];
			}
		}

		_dispatch(this.dom, 'ln-modal:destroyed');
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el) {
		var instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		var value = el.getAttribute(DOM_SELECTOR);
		var shouldBeOpen = value === 'open';

		if (shouldBeOpen === instance.isOpen) return;

		if (shouldBeOpen) {
			var before = _dispatchCancelable(el, 'ln-modal:before-open');
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'close');
				return;
			}
			instance.isOpen = true;
			el.setAttribute('aria-modal', 'true');
			el.setAttribute('role', 'dialog');
			document.body.classList.add('ln-modal-open');
			document.addEventListener('keydown', instance._onEscape);
			document.addEventListener('keydown', instance._onFocusTrap);

			var firstInput = el.querySelector('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
			if (firstInput) firstInput.focus();
			else {
				var firstFocusable = el.querySelector('a[href], button:not([disabled])');
				if (firstFocusable) firstFocusable.focus();
			}

			_dispatch(el, 'ln-modal:open');
		} else {
			var before = _dispatchCancelable(el, 'ln-modal:before-close');
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance.isOpen = false;
			el.removeAttribute('aria-modal');
			document.removeEventListener('keydown', instance._onEscape);
			document.removeEventListener('keydown', instance._onFocusTrap);
			_dispatch(el, 'ln-modal:close');

			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}
		}
	}

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: Object.assign({ modalId: element.id, target: element }, detail || {})
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		var event = new CustomEvent(eventName, {
			bubbles: true,
			cancelable: true,
			detail: Object.assign({ modalId: element.id, target: element }, detail || {})
		});
		element.dispatchEvent(event);
		return event;
	}

	function _attachCloseButtons(instance) {
		const closeButtons = instance.dom.querySelectorAll('[data-ln-modal-close]');
		for (const btn of closeButtons) {
			if (btn[DOM_ATTRIBUTE + 'Close']) continue;
			btn.addEventListener('click', instance._onClose);
			btn[DOM_ATTRIBUTE + 'Close'] = instance._onClose;
		}
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				var mutation = mutations[i];
				if (mutation.type === 'childList') {
					for (var j = 0; j < mutation.addedNodes.length; j++) {
						var node = mutation.addedNodes[j];
						if (node.nodeType === 1) {
							_findModals(node);
							_attachTriggers(node);
						}
					}
				} else if (mutation.type === 'attributes') {
					if (mutation.attributeName === DOM_SELECTOR && mutation.target[DOM_ATTRIBUTE]) {
						_syncAttribute(mutation.target);
					} else {
						_findModals(mutation.target);
						_attachTriggers(mutation.target);
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: [DOM_SELECTOR, 'data-ln-modal-for']
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
