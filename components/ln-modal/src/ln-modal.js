import { registerComponent, dispatch, dispatchCancelable, isVisible, shouldIgnoreClick, isTargetDisabled } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';
	const TRIGGER_ATTRIBUTE = 'data-ln-modal-for';
	const CLOSE_TRIGGER_ATTRIBUTE = 'data-ln-modal-close';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-modal': {
			type: 'enum',
			values: ['open', 'close'],
			fallback: 'close',
			effect: _syncAttribute,
			description: 'Control state of the modal dialog'
		},
		'data-ln-modal-for': {
			type: 'string',
			description: 'Target modal ID to open on trigger click'
		},
		'data-ln-modal-mode': {
			type: 'enum',
			values: ['new', 'edit'],
			fallback: 'new',
			description: 'Operational mode of the modal (new vs edit)'
		},
		'data-ln-modal-close': {
			type: 'trigger',
			description: 'Click dismiss trigger inside the modal'
		}
	};

	const instances = new Set();
	let clickListener = null;

	function _ensureClickListener() {
		if (clickListener) return;
		clickListener = function (e) {
			if (shouldIgnoreClick(e)) return;

			const trigger = e.target.closest('[' + TRIGGER_ATTRIBUTE + ']');
			if (!trigger || isTargetDisabled(trigger)) return;

			const targetId = trigger.getAttribute(TRIGGER_ATTRIBUTE);
			if (!targetId) return;

			const target = document.getElementById(targetId);
			if (!target || !target[DOM_ATTRIBUTE]) return;

			e.preventDefault();
			if (trigger.hasAttribute('data-ln-modal-mode')) {
				target.setAttribute('data-ln-modal-mode', trigger.getAttribute('data-ln-modal-mode'));
			} else if (target.hasAttribute('data-ln-modal-mode')) {
				target.setAttribute('data-ln-modal-mode', 'new');
			}
			target.setAttribute(DOM_SELECTOR, 'open');
		};
		document.addEventListener('click', clickListener);
	}

	function _maybeRemoveClickListener() {
		if (instances.size > 0 || !clickListener) return;
		document.removeEventListener('click', clickListener);
		clickListener = null;
	}

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

		// Native dialog close synchronization (e.g. <form method="dialog"> or dialog.close())
		this._onClose = function () {
			if (!self.isOpen || self.dom.getAttribute(DOM_SELECTOR) !== 'open' || self.dom.open) return;
			self._isNativeClosing = true;
			self.dom.setAttribute(DOM_SELECTOR, 'close');
		};

		// Dismiss trigger buttons inside modal [data-ln-modal-close]
		this._onClickClose = function (e) {
			const closeBtn = e.target.closest('[' + CLOSE_TRIGGER_ATTRIBUTE + ']');
			if (closeBtn && self.dom.contains(closeBtn)) {
				e.preventDefault();
				self.dom.setAttribute(DOM_SELECTOR, 'close');
			}
		};

		this.dom.addEventListener('ln-modal:request-open', this._onRequestOpen);
		this.dom.addEventListener('ln-modal:request-close', this._onRequestClose);
		this.dom.addEventListener('cancel', this._onCancel);
		this.dom.addEventListener('close', this._onClose);
		this.dom.addEventListener('click', this._onClickClose);

		instances.add(this);
		_ensureClickListener();

		// Apply initial state if rendered with open attribute
		if (this.isOpen) {
			if (typeof this.dom.showModal === 'function') this.dom.showModal();
			document.body.classList.add('ln-modal-open');
			dispatch(this.dom, 'ln-modal:open', { modalId: this.dom.id, target: this.dom });
		}

		return this;
	}

	_component.prototype.open = function () {
		this.dom.setAttribute(DOM_SELECTOR, 'open');
	};

	_component.prototype.close = function () {
		this.dom.setAttribute(DOM_SELECTOR, 'close');
	};

	_component.prototype.toggle = function () {
		const current = this.dom.getAttribute(DOM_SELECTOR);
		this.dom.setAttribute(DOM_SELECTOR, current === 'open' ? 'close' : 'open');
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		this.dom.removeEventListener('ln-modal:request-open', this._onRequestOpen);
		this.dom.removeEventListener('ln-modal:request-close', this._onRequestClose);
		this.dom.removeEventListener('cancel', this._onCancel);
		this.dom.removeEventListener('close', this._onClose);
		this.dom.removeEventListener('click', this._onClickClose);

		instances.delete(this);
		_maybeRemoveClickListener();

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

		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync (Single Source of Truth) ───────────

	function _syncAttribute(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		const isNativeClose = Boolean(instance._isNativeClosing);
		instance._isNativeClosing = false;

		const value = el.getAttribute(DOM_SELECTOR);
		const shouldBeOpen = value === 'open';

		if (shouldBeOpen === instance.isOpen) {
			if (shouldBeOpen && el.isConnected && !el.open && typeof el.showModal === 'function') {
				el.showModal();
			}
			return;
		}

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
			if (!isNativeClose) {
				const before = dispatchCancelable(el, 'ln-modal:before-close', { modalId: el.id, target: el });
				if (before.defaultPrevented) {
					el.setAttribute(DOM_SELECTOR, 'open');
					return;
				}
			}
			instance.isOpen = false;
			if (el.hasAttribute('data-ln-modal-mode')) {
				el.setAttribute('data-ln-modal-mode', 'new');
			}

			if (typeof el.close === 'function' && el.open) el.close();

			if (!document.querySelector('[' + DOM_SELECTOR + '="open"]')) {
				document.body.classList.remove('ln-modal-open');
			}

			dispatch(el, 'ln-modal:close', { modalId: el.id, target: el });
		}
	}

	// ─── Init ──────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-modal', {
		attributes: ATTRIBUTES
	});
})();
