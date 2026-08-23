import { dispatch, computePlacement, measureHidden, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-dropdown';
	const DOM_ATTRIBUTE = 'lnDropdown';
	const POSITION_ATTR = 'data-ln-dropdown-position';
	const PLACEMENT_ATTR = 'data-ln-dropdown-placement';
	const DEFAULT_POSITION = 'bottom-end';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.toggleEl = dom.querySelector('[data-ln-toggle]');
		this._boundDocClick = null;
		this._docClickTimeout = null;
		this._boundScrollReposition = null;
		this._boundResizeClose = null;

		if (this.toggleEl) {
			this.toggleEl.setAttribute('data-ln-dropdown-menu', '');
			this.toggleEl.setAttribute('role', 'menu');
			this.toggleEl.setAttribute('popover', 'manual');
			this._initMenuAria();
		}

		// ARIA on trigger button
		this.triggerBtn = dom.querySelector('[data-ln-toggle-for]');
		if (this.triggerBtn) {
			this.triggerBtn.setAttribute('aria-haspopup', 'menu');
			this.triggerBtn.setAttribute('aria-expanded', 'false');
		}

		const self = this;

		this._onRequestOpen = function () {
			if (self.toggleEl) self.toggleEl.setAttribute('data-ln-toggle', 'open');
		};
		this._onRequestClose = function () {
			if (self.toggleEl) self.toggleEl.setAttribute('data-ln-toggle', 'close');
		};
		this._onRequestToggle = function () {
			if (self.toggleEl) {
				const current = self.toggleEl.getAttribute('data-ln-toggle');
				self.toggleEl.setAttribute('data-ln-toggle', current === 'open' ? 'close' : 'open');
			}
		};

		// ─── Keyboard Navigation (ARIA APG menu pattern) ───────────
		this._onKeydown = function (e) {
			const isOpen = self.toggleEl && self.toggleEl.getAttribute('data-ln-toggle') === 'open';

			if (e.key === 'Escape') {
				if (isOpen) {
					e.preventDefault();
					e.stopPropagation();
					self.toggleEl.setAttribute('data-ln-toggle', 'close');
					if (self.triggerBtn) self.triggerBtn.focus();
				}
				return;
			}

			if (e.key === 'Tab') {
				if (isOpen) {
					// Return focus to trigger button before closing so native Tab advance starts from trigger
					if (self.triggerBtn) self.triggerBtn.focus();
					self.toggleEl.setAttribute('data-ln-toggle', 'close');
				}
				return;
			}

			const items = self._getMenuItems();
			if (items.length === 0) return;

			// Open from trigger on ArrowDown or ArrowUp
			if (!isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
				e.preventDefault();
				self.toggleEl.setAttribute('data-ln-toggle', 'open');
				// Macrotask deferral: ensures ln-toggle's MutationObserver microtask has finished opening and showing the popover before moving focus
				setTimeout(function () {
					const freshItems = self._getMenuItems();
					if (freshItems.length > 0) {
						self._focusItem(freshItems, e.key === 'ArrowDown' ? 0 : freshItems.length - 1);
					}
				}, 0);
				return;
			}

			if (!isOpen) return;

			const currentIndex = items.indexOf(document.activeElement);

			if (e.key === 'ArrowDown') {
				e.preventDefault();
				const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
				self._focusItem(items, nextIndex);
			} else if (e.key === 'ArrowUp') {
				e.preventDefault();
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
				self._focusItem(items, prevIndex);
			} else if (e.key === 'Home') {
				e.preventDefault();
				self._focusItem(items, 0);
			} else if (e.key === 'End') {
				e.preventDefault();
				self._focusItem(items, items.length - 1);
			}
		};

		this.dom.addEventListener('ln-dropdown:request-open', this._onRequestOpen);
		this.dom.addEventListener('ln-dropdown:request-close', this._onRequestClose);
		this.dom.addEventListener('ln-dropdown:request-toggle', this._onRequestToggle);
		this.dom.addEventListener('keydown', this._onKeydown);

		this._onToggleOpen = function (e) {
			if (!e.detail || e.detail.target !== self.toggleEl) return;
			if (self.triggerBtn) self.triggerBtn.setAttribute('aria-expanded', 'true');
			if (typeof self.toggleEl.showPopover === 'function') self.toggleEl.showPopover();
			self._initMenuAria();
			self._reposition();
			self._addOutsideClickListener();
			self._addScrollRepositionListener();
			self._addResizeCloseListener();
			dispatch(dom, 'ln-dropdown:open', { target: e.detail.target });
		};

		this._onToggleClose = function (e) {
			if (!e.detail || e.detail.target !== self.toggleEl) return;
			if (self.triggerBtn) self.triggerBtn.setAttribute('aria-expanded', 'false');
			self._removeOutsideClickListener();
			self._removeScrollRepositionListener();
			self._removeResizeCloseListener();
			self.toggleEl.style.top = '';
			self.toggleEl.style.left = '';
			self.toggleEl.removeAttribute(PLACEMENT_ATTR);
			// :popover-open guard — a boot-opened menu (persist/static "open") was never shown via showPopover()
			if (typeof self.toggleEl.hidePopover === 'function' && self.toggleEl.matches(':popover-open')) self.toggleEl.hidePopover();
			dispatch(dom, 'ln-dropdown:close', { target: e.detail.target });
		};

		if (this.toggleEl) {
			this.toggleEl.addEventListener('ln-toggle:open', this._onToggleOpen);
			this.toggleEl.addEventListener('ln-toggle:close', this._onToggleClose);
		}

		return this;
	}

	// ─── Menu Items & ARIA Helpers ─────────────────────────────

	_component.prototype._initMenuAria = function () {
		if (!this.toggleEl) return;
		const listItems = this.toggleEl.querySelectorAll('li');
		for (const li of listItems) {
			li.setAttribute('role', 'none');
		}
		const items = this._getMenuItems();
		for (let i = 0; i < items.length; i++) {
			items[i].setAttribute('role', 'menuitem');
			items[i].setAttribute('tabindex', i === 0 ? '0' : '-1');
		}
	};

	_component.prototype._getMenuItems = function () {
		if (!this.toggleEl) return [];
		return Array.from(this.toggleEl.querySelectorAll('a[href], button:not([disabled]), [role="menuitem"]:not([disabled])'));
	};

	_component.prototype._focusItem = function (items, index) {
		for (let i = 0; i < items.length; i++) {
			items[i].setAttribute('tabindex', i === index ? '0' : '-1');
		}
		if (items[index]) {
			items[index].focus();
		}
	};

	// ─── Positioning ───────────────────────────────────────────

	_component.prototype._reposition = function () {
		if (!this.triggerBtn || !this.toggleEl) return;
		const rect = this.triggerBtn.getBoundingClientRect();
		const size = measureHidden(this.toggleEl);
		const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size-xs')) * 16 || 4;
		const position = this.dom.getAttribute(POSITION_ATTR) || DEFAULT_POSITION;
		const p = computePlacement(rect, size, position, gap);
		this.toggleEl.style.top = p.top + 'px';
		this.toggleEl.style.left = p.left + 'px';
		this.toggleEl.setAttribute(PLACEMENT_ATTR, p.placement);
	};

	// ─── Outside click ─────────────────────────────────────────

	_component.prototype._addOutsideClickListener = function () {
		if (this._boundDocClick) return;
		const self = this;
		this._boundDocClick = function (e) {
			if (self.dom.contains(e.target)) return;
			if (self.toggleEl && self.toggleEl.contains(e.target)) return;
			if (self.toggleEl && self.toggleEl.getAttribute('data-ln-toggle') === 'open') {
				self.toggleEl.setAttribute('data-ln-toggle', 'close');
			}
		};
		self._docClickTimeout = setTimeout(function () {
			self._docClickTimeout = null;
			document.addEventListener('click', self._boundDocClick);
		}, 0);
	};

	_component.prototype._removeOutsideClickListener = function () {
		if (this._docClickTimeout) {
			clearTimeout(this._docClickTimeout);
			this._docClickTimeout = null;
		}
		if (this._boundDocClick) {
			document.removeEventListener('click', this._boundDocClick);
			this._boundDocClick = null;
		}
	};

	// ─── Scroll → reposition ──────────────────────────────────

	_component.prototype._addScrollRepositionListener = function () {
		const self = this;
		this._boundScrollReposition = function () {
			self._reposition();
		};
		window.addEventListener('scroll', this._boundScrollReposition, { passive: true, capture: true });
	};

	_component.prototype._removeScrollRepositionListener = function () {
		if (this._boundScrollReposition) {
			window.removeEventListener('scroll', this._boundScrollReposition, { capture: true });
			this._boundScrollReposition = null;
		}
	};

	// ─── Resize → close ───────────────────────────────────────

	_component.prototype._addResizeCloseListener = function () {
		const self = this;
		this._boundResizeClose = function () {
			if (self.toggleEl && self.toggleEl.getAttribute('data-ln-toggle') === 'open') {
				self.toggleEl.setAttribute('data-ln-toggle', 'close');
			}
		};
		window.addEventListener('resize', this._boundResizeClose);
	};

	_component.prototype._removeResizeCloseListener = function () {
		if (this._boundResizeClose) {
			window.removeEventListener('resize', this._boundResizeClose);
			this._boundResizeClose = null;
		}
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-dropdown:request-open', this._onRequestOpen);
		this.dom.removeEventListener('ln-dropdown:request-close', this._onRequestClose);
		this.dom.removeEventListener('ln-dropdown:request-toggle', this._onRequestToggle);
		this.dom.removeEventListener('keydown', this._onKeydown);
		this._removeOutsideClickListener();
		this._removeScrollRepositionListener();
		this._removeResizeCloseListener();
		if (this.toggleEl && typeof this.toggleEl.hidePopover === 'function' && this.toggleEl.matches(':popover-open')) {
			this.toggleEl.hidePopover();
		}
		if (this.toggleEl) {
			this.toggleEl.removeAttribute(PLACEMENT_ATTR);
			this.toggleEl.removeEventListener('ln-toggle:open', this._onToggleOpen);
			this.toggleEl.removeEventListener('ln-toggle:close', this._onToggleClose);
		}
		dispatch(this.dom, 'ln-dropdown:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-dropdown');
})();
