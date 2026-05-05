import { registerComponent, dispatch, dispatchCancelable, isVisible } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;


	function _attachTriggers(root) {
		const triggers = Array.from(root.querySelectorAll('[data-ln-modal-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-modal-for')) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			const handler = function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const modalId = btn.getAttribute('data-ln-modal-for');
				const target = document.getElementById(modalId);
				if (!target) {
					console.warn('[ln-modal] No modal found for data-ln-modal-for="' + modalId + '"');
					return;
				}
				if (!target[DOM_ATTRIBUTE]) return;
				const current = target.getAttribute(DOM_SELECTOR);
				target.setAttribute(DOM_SELECTOR, current === 'open' ? 'close' : 'open');
			};
			btn.addEventListener('click', handler);
			btn[DOM_ATTRIBUTE + 'Trigger'] = handler;
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		const self = this;

		this._onEscape = function (e) {
			if (e.key === 'Escape') self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		this._onFocusTrap = function (e) {
			if (e.key !== 'Tab') return;
			// Focuses in DOM order — positive tabindex not supported (anti-pattern per WCAG)
			const focusable = Array.prototype.filter.call(
				self.dom.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'),
				isVisible
			);
			if (focusable.length === 0) return;
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) { e.preventDefault(); last.focus(); }
			} else {
				if (document.activeElement === last) { e.preventDefault(); first.focus(); }
			}
		};

		this._onClose = function (e) {
			e.preventDefault();
			self.dom.setAttribute(DOM_SELECTOR, 'close');
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

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		if (this.isOpen) {
			this.dom.removeAttribute('aria-modal');
			document.removeEventListener('keydown', this._onEscape);
			document.removeEventListener('keydown', this._onFocusTrap);
			this._returnFocusEl = null;
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

		const triggers = document.querySelectorAll('[data-ln-modal-for="' + this.dom.id + '"]');
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) {
				btn.removeEventListener('click', btn[DOM_ATTRIBUTE + 'Trigger']);
				delete btn[DOM_ATTRIBUTE + 'Trigger'];
			}
		}

		dispatch(this.dom, 'ln-modal:destroyed', { modalId: this.dom.id, target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		const value = el.getAttribute(DOM_SELECTOR);
		const shouldBeOpen = value === 'open';

		if (shouldBeOpen === instance.isOpen) return;

		if (shouldBeOpen) {
			const before = dispatchCancelable(el, 'ln-modal:before-open', { modalId: el.id, target: el });
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

			const previouslyFocused = document.activeElement;
			instance._returnFocusEl = (previouslyFocused && previouslyFocused !== document.body) ? previouslyFocused : null;

			const autoFocusEl = el.querySelector('[autofocus]');
			if (autoFocusEl && isVisible(autoFocusEl)) {
				autoFocusEl.focus();
			} else {
				const inputs = el.querySelectorAll('input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled])');
				const firstInput = Array.prototype.find.call(inputs, isVisible);
				if (firstInput) firstInput.focus();
				else {
					const buttons = el.querySelectorAll('a[href], button:not([disabled])');
					const firstFocusable = Array.prototype.find.call(buttons, isVisible);
					if (firstFocusable) firstFocusable.focus();
				}
			}

			dispatch(el, 'ln-modal:open', { modalId: el.id, target: el });
		} else {
			const before = dispatchCancelable(el, 'ln-modal:before-close', { modalId: el.id, target: el });
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance.isOpen = false;
			el.removeAttribute('aria-modal');
			document.removeEventListener('keydown', instance._onEscape);
			document.removeEventListener('keydown', instance._onFocusTrap);
			dispatch(el, 'ln-modal:close', { modalId: el.id, target: el });

			if (instance._returnFocusEl
				&& document.contains(instance._returnFocusEl)
				&& typeof instance._returnFocusEl.focus === 'function') {
				instance._returnFocusEl.focus();
			}
			instance._returnFocusEl = null;

			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}
		}
	}

	// ─── Helpers ───────────────────────────────────────────────

	function _attachCloseButtons(instance) {
		const closeButtons = instance.dom.querySelectorAll('[data-ln-modal-close]');
		for (const btn of closeButtons) {
			if (btn[DOM_ATTRIBUTE + 'Close']) continue;
			btn.addEventListener('click', instance._onClose);
			btn[DOM_ATTRIBUTE + 'Close'] = instance._onClose;
		}
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-modal', {
		extraAttributes: ['data-ln-modal-for'],
		onAttributeChange: _syncAttribute,
		onInit: _attachTriggers
	});
})();
