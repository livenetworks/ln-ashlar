import { registerComponent, dispatch, dispatchCancelable, isVisible } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		const self = this;

		// Command listeners for request events
		this._onRequestOpen = function () {
			self.dom.setAttribute(DOM_SELECTOR, 'open');
		};

		this._onRequestClose = function () {
			self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		// Native dialog ESC cancel interception
		this._onCancel = function (e) {
			e.preventDefault();
			self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		// Dismiss trigger buttons inside modal [data-ln-modal-close]
		this._onClickClose = function (e) {
			const closeBtn = e.target.closest('[data-ln-modal-close]');
			if (closeBtn && self.dom.contains(closeBtn)) {
				e.preventDefault();
				self.dom.setAttribute(DOM_SELECTOR, 'close');
			}
		};

		this.dom.addEventListener('ln-modal:request-open', this._onRequestOpen);
		this.dom.addEventListener('ln-modal:request-close', this._onRequestClose);
		this.dom.addEventListener('cancel', this._onCancel);
		this.dom.addEventListener('click', this._onClickClose);

		// Apply initial state if rendered with open attribute
		if (this.isOpen) {
			if (typeof this.dom.showModal === 'function') this.dom.showModal();
			document.body.classList.add('ln-modal-open');
		}

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this.dom.removeEventListener('ln-modal:request-open', this._onRequestOpen);
		this.dom.removeEventListener('ln-modal:request-close', this._onRequestClose);
		this.dom.removeEventListener('cancel', this._onCancel);
		this.dom.removeEventListener('click', this._onClickClose);

		if (this.isOpen) {
			const dom = this.dom;
			const otherOpen = Array.prototype.some.call(
				document.querySelectorAll('[' + DOM_SELECTOR + '="open"]'),
				function (el) { return el !== dom; }
			);
			if (!otherOpen) {
				document.body.classList.remove('ln-modal-open');
			}
		}

		dispatch(this.dom, 'ln-modal:destroyed', { modalId: this.dom.id, target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync (Single Source of Truth) ───────────

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
			document.body.classList.add('ln-modal-open');
			if (typeof el.showModal === 'function') el.showModal();

			// Focus placement
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
			dispatch(el, 'ln-modal:close', { modalId: el.id, target: el });

			if (typeof el.close === 'function') el.close();

			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}
		}
	}

	// ─── Init ──────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-modal', {
		onAttributeChange: _syncAttribute
	});
})();
