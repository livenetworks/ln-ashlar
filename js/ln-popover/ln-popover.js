import { guardBody, dispatch, dispatchCancelable, computePlacement, teleportToBody, measureHidden } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-popover';
	const DOM_ATTRIBUTE = 'lnPopover';
	const TRIGGER_SELECTOR = 'data-ln-popover-for';
	const POSITION_SELECTOR = 'data-ln-popover-position';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Open-stack (Escape closes top of stack) ───────────────

	const openStack = [];
	let escListener = null;

	function _ensureEscListener() {
		if (escListener) return;
		escListener = function (e) {
			if (e.key !== 'Escape') return;
			if (openStack.length === 0) return;
			const top = openStack[openStack.length - 1];
			top.close();
		};
		document.addEventListener('keydown', escListener);
	}

	function _maybeRemoveEscListener() {
		if (openStack.length > 0) return;
		if (!escListener) return;
		document.removeEventListener('keydown', escListener);
		escListener = null;
	}

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findPopovers(domRoot);
		_attachTriggers(domRoot);
	}

	function _findPopovers(root) {
		if (!root || root.nodeType !== 1) return;
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
		if (!root || root.nodeType !== 1) return;
		const triggers = Array.from(root.querySelectorAll('[' + TRIGGER_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(TRIGGER_SELECTOR)) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;

			const popoverId = btn.getAttribute(TRIGGER_SELECTOR);
			btn.setAttribute('aria-haspopup', 'dialog');
			btn.setAttribute('aria-expanded', 'false');
			btn.setAttribute('aria-controls', popoverId);

			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const target = document.getElementById(popoverId);
				if (!target || !target[DOM_ATTRIBUTE]) return;
				target[DOM_ATTRIBUTE].toggle(btn);
			});
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';
		this.trigger = null;
		this._teleportRestore = null;
		this._previousFocus = null;
		this._boundDocClick = null;
		this._boundReposition = null;

		// Make the popover container itself programmatically focusable
		// as a fallback when it has no focusable children.
		if (!dom.hasAttribute('tabindex')) {
			dom.setAttribute('tabindex', '-1');
		}
		if (!dom.hasAttribute('role')) {
			dom.setAttribute('role', 'dialog');
		}

		// If the markup says open at boot, sync immediately.
		if (this.isOpen) {
			this._applyOpen(null);
		}

		return this;
	}

	_component.prototype.open = function (trigger) {
		if (this.isOpen) return;
		this.trigger = trigger || null;
		this.dom.setAttribute(DOM_SELECTOR, 'open');
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		this.dom.setAttribute(DOM_SELECTOR, 'closed');
	};

	_component.prototype.toggle = function (trigger) {
		if (this.isOpen) {
			this.close();
		} else {
			this.open(trigger);
		}
	};

	// ─── Apply open/close (called from _syncAttribute) ─────────

	_component.prototype._applyOpen = function (trigger) {
		this.isOpen = true;
		if (trigger) this.trigger = trigger;
		this._previousFocus = document.activeElement;

		// Teleport into <body> so position:fixed coordinates are reliable
		// regardless of any ancestor with `transform` or `contain`.
		this._teleportRestore = teleportToBody(this.dom);

		// Measure (works even though it just got `display: block` by the
		// attribute switch — measureHidden is safe either way).
		const size = measureHidden(this.dom);

		// Position relative to the trigger (if any).
		if (this.trigger) {
			const rect = this.trigger.getBoundingClientRect();
			const preferred = this.dom.getAttribute(POSITION_SELECTOR) || 'bottom';
			const placement = computePlacement(rect, size, preferred, 8);
			// Inline coordinates are unavoidable for floating UI; CSS
			// supplies position:fixed via the co-located scss, JS only
			// writes `top`/`left`. This is consistent with ln-dropdown.
			this.dom.style.top = placement.top + 'px';
			this.dom.style.left = placement.left + 'px';
			this.dom.setAttribute('data-ln-popover-placement', placement.placement);
			this.trigger.setAttribute('aria-expanded', 'true');
		}

		// Focus management — first focusable, or popover itself.
		const focusable = this.dom.querySelector('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
		if (focusable) {
			focusable.focus();
		} else {
			this.dom.focus();
		}

		// Outside-click listener (delayed by one tick so the opening
		// click doesn't immediately close).
		const self = this;
		this._boundDocClick = function (e) {
			if (self.dom.contains(e.target)) return;
			if (self.trigger && self.trigger.contains(e.target)) return;
			self.close();
		};
		setTimeout(function () {
			document.addEventListener('click', self._boundDocClick);
		}, 0);

		// Reposition on scroll/resize while open.
		this._boundReposition = function () {
			if (!self.trigger) return;
			const r = self.trigger.getBoundingClientRect();
			const sz = measureHidden(self.dom);
			const preferred = self.dom.getAttribute(POSITION_SELECTOR) || 'bottom';
			const p = computePlacement(r, sz, preferred, 8);
			self.dom.style.top = p.top + 'px';
			self.dom.style.left = p.left + 'px';
			self.dom.setAttribute('data-ln-popover-placement', p.placement);
		};
		window.addEventListener('scroll', this._boundReposition, { passive: true, capture: true });
		window.addEventListener('resize', this._boundReposition);

		openStack.push(this);
		_ensureEscListener();

		dispatch(this.dom, 'ln-popover:open', {
			popoverId: this.dom.id,
			target: this.dom,
			trigger: this.trigger
		});
	};

	_component.prototype._applyClose = function () {
		this.isOpen = false;

		if (this._boundDocClick) {
			document.removeEventListener('click', this._boundDocClick);
			this._boundDocClick = null;
		}
		if (this._boundReposition) {
			window.removeEventListener('scroll', this._boundReposition, { capture: true });
			window.removeEventListener('resize', this._boundReposition);
			this._boundReposition = null;
		}

		// Clear positioning inline styles so re-open re-measures cleanly.
		this.dom.style.top = '';
		this.dom.style.left = '';
		this.dom.removeAttribute('data-ln-popover-placement');

		if (this.trigger) {
			this.trigger.setAttribute('aria-expanded', 'false');
		}

		// Restore teleport.
		if (this._teleportRestore) {
			this._teleportRestore();
			this._teleportRestore = null;
		}

		// Remove from open stack.
		const idx = openStack.indexOf(this);
		if (idx !== -1) openStack.splice(idx, 1);
		_maybeRemoveEscListener();

		// Restore focus to trigger if Escape closed it; on outside-click
		// we deliberately don't yank focus.
		if (this._previousFocus && this.trigger && this._previousFocus === this.trigger) {
			this.trigger.focus();
		} else if (this.trigger && document.activeElement === document.body) {
			// User dismissed via Escape — focus was inside popover; return it.
			this.trigger.focus();
		}
		this._previousFocus = null;

		dispatch(this.dom, 'ln-popover:close', {
			popoverId: this.dom.id,
			target: this.dom,
			trigger: this.trigger
		});
		this.trigger = null;
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this.isOpen) this._applyClose();
		dispatch(this.dom, 'ln-popover:destroyed', {
			popoverId: this.dom.id,
			target: this.dom
		});
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
			const before = dispatchCancelable(el, 'ln-popover:before-open', {
				popoverId: el.id,
				target: el,
				trigger: instance.trigger
			});
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'closed');
				return;
			}
			instance._applyOpen(instance.trigger);
		} else {
			const before = dispatchCancelable(el, 'ln-popover:before-close', {
				popoverId: el.id,
				target: el,
				trigger: instance.trigger
			});
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance._applyClose();
		}
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (let i = 0; i < mutations.length; i++) {
					const mutation = mutations[i];
					if (mutation.type === 'childList') {
						for (let j = 0; j < mutation.addedNodes.length; j++) {
							const node = mutation.addedNodes[j];
							if (node.nodeType === 1) {
								_findPopovers(node);
								_attachTriggers(node);
							}
						}
					} else if (mutation.type === 'attributes') {
						if (mutation.attributeName === DOM_SELECTOR && mutation.target[DOM_ATTRIBUTE]) {
							_syncAttribute(mutation.target);
						} else {
							_findPopovers(mutation.target);
							_attachTriggers(mutation.target);
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR, TRIGGER_SELECTOR]
			});
		}, 'ln-popover');
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
