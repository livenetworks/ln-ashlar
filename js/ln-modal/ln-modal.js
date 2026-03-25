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
		const items = Array.from(root.querySelectorAll('.ln-modal'));
		if (root.classList && root.classList.contains('ln-modal')) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
	}

	function _attachTriggers(root) {
		const triggers = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;
			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const modalId = btn.getAttribute(DOM_SELECTOR);
				const target = document.getElementById(modalId);
				if (!target || !target[DOM_ATTRIBUTE]) return;
				target[DOM_ATTRIBUTE].toggle();
			});
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.classList.contains('ln-modal--open');

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

		return this;
	}

	_component.prototype.open = function () {
		if (this.isOpen) return;
		const before = _dispatchCancelable(this.dom, 'ln-modal:before-open');
		if (before.defaultPrevented) return;

		this.isOpen = true;
		this.dom.classList.add('ln-modal--open');
		this.dom.setAttribute('aria-modal', 'true');
		this.dom.setAttribute('role', 'dialog');
		document.body.classList.add('ln-modal-open');
		document.addEventListener('keydown', this._onEscape);
		document.addEventListener('keydown', this._onFocusTrap);

		// Focus first focusable element inside modal
		var firstFocusable = this.dom.querySelector('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])');
		if (firstFocusable) firstFocusable.focus();

		_dispatch(this.dom, 'ln-modal:open');
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		const before = _dispatchCancelable(this.dom, 'ln-modal:before-close');
		if (before.defaultPrevented) return;

		this.isOpen = false;
		this.dom.classList.remove('ln-modal--open');
		this.dom.removeAttribute('aria-modal');
		document.removeEventListener('keydown', this._onEscape);
		document.removeEventListener('keydown', this._onFocusTrap);
		_dispatch(this.dom, 'ln-modal:close');

		if (!document.querySelector('.ln-modal.ln-modal--open')) {
			document.body.classList.remove('ln-modal-open');
		}
	};

	_component.prototype.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this.isOpen) {
			this.dom.classList.remove('ln-modal--open');
			this.dom.removeAttribute('aria-modal');
			document.removeEventListener('keydown', this._onEscape);
			document.removeEventListener('keydown', this._onFocusTrap);
			if (!document.querySelector('.ln-modal.ln-modal--open')) {
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

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: Object.assign({ modalId: element.id, target: element }, detail || {})
		}));
	}

	function _dispatchCancelable(element, eventName, detail) {
		const event = new CustomEvent(eventName, {
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
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_findModals(node);
							_attachTriggers(node);
						}
					}
				} else if (mutation.type === 'attributes') {
					_findModals(mutation.target);
					_attachTriggers(mutation.target);
				}
			}
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
