import { registerComponent, dispatch, dispatchCancelable, isVisible } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-modal';
	const DOM_ATTRIBUTE = 'lnModal';

	if (window[DOM_ATTRIBUTE] !== undefined) return;




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
			// Self-excluding: a still-attached modal reads "open" during its own destroy.
			// No attribute write here — it would race the observer into re-creating an instance.
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

	// ─── Event Delegation ──────────────────────────────────────

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		// Handle trigger click [data-ln-modal-for]
		const trigger = e.target.closest('[data-ln-modal-for]');
		if (trigger) {
			const modalId = trigger.getAttribute('data-ln-modal-for');
			const target = document.getElementById(modalId);
			if (target && target[DOM_ATTRIBUTE]) {
				e.preventDefault();

				// Build display record from data-ln-modal-* dataset keys (excluding reserved).
				const MODAL_RESERVED = { lnModalFor: true, lnModalClose: true, lnModalMode: true };
				const record = {};
				const ds = trigger.dataset;
				for (const key in ds) {
					if (!key.startsWith('lnModal')) continue;
					if (MODAL_RESERVED[key]) continue;
					const suffix = key.slice(7); // strip 'lnModal'
					if (!suffix) continue;
					record[suffix.charAt(0).toLowerCase() + suffix.slice(1)] = ds[key];
				}

				const hasRecord = Object.keys(record).length > 0;

				// Fill display fields or clear them.
				if (hasRecord) {
					window.lnCore.fill(target, record);
				} else {
					const fields = target.querySelectorAll('[data-ln-field]');
					for (let i = 0; i < fields.length; i++) {
						fields[i].textContent = '';
					}
				}

				// Set modal mode: explicit trigger attribute wins; else infer from record.
				// Composes with [data-ln-modal-when]/[data-ln-modal-mode] SCSS toggle.
				if (trigger.hasAttribute('data-ln-modal-mode')) {
					target.dataset.lnModalMode = trigger.getAttribute('data-ln-modal-mode');
				} else {
					target.dataset.lnModalMode = hasRecord ? 'edit' : 'new';
				}

				const current = target.getAttribute(DOM_SELECTOR);
				target.setAttribute(DOM_SELECTOR, current === 'open' ? 'close' : 'open');
			}
			return;
		}

		// Handle close button click [data-ln-modal-close]
		const closeBtn = e.target.closest('[data-ln-modal-close]');
		if (closeBtn) {
			const modal = closeBtn.closest('[' + DOM_SELECTOR + ']');
			if (modal && modal[DOM_ATTRIBUTE]) {
				e.preventDefault();
				modal.setAttribute(DOM_SELECTOR, 'close');
			}
		}
	});

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-modal', {
		onAttributeChange: _syncAttribute
	});
})();
