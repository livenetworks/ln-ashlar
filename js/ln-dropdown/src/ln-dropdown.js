import { dispatch, computePlacement, measureHidden, registerComponent } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-dropdown';
	const DOM_ATTRIBUTE = 'lnDropdown';

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
		}

		// ARIA on trigger button
		this.triggerBtn = dom.querySelector('[data-ln-toggle-for]');
		if (this.triggerBtn) {
			this.triggerBtn.setAttribute('aria-haspopup', 'menu');
			this.triggerBtn.setAttribute('aria-expanded', 'false');
		}

		// role="menuitem" on direct children of menu
		if (this.toggleEl) {
			for (const item of this.toggleEl.children) {
				item.setAttribute('role', 'menuitem');
			}
		}

		const self = this;

		this._onToggleOpen = function (e) {
			if (!e.detail || e.detail.target !== self.toggleEl) return;
			if (self.triggerBtn) self.triggerBtn.setAttribute('aria-expanded', 'true');
			if (typeof self.toggleEl.showPopover === 'function') self.toggleEl.showPopover();
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

	// ─── Positioning ───────────────────────────────────────────

	_component.prototype._reposition = function () {
		if (!this.triggerBtn || !this.toggleEl) return;
		const rect = this.triggerBtn.getBoundingClientRect();
		const size = measureHidden(this.toggleEl);
		const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size-xs')) * 16 || 4;
		const p = computePlacement(rect, size, 'bottom-end', gap);
		this.toggleEl.style.top = p.top + 'px';
		this.toggleEl.style.left = p.left + 'px';
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
		this._removeOutsideClickListener();
		this._removeScrollRepositionListener();
		this._removeResizeCloseListener();
		if (this.toggleEl && typeof this.toggleEl.hidePopover === 'function' && this.toggleEl.matches(':popover-open')) {
			this.toggleEl.hidePopover();
		}
		if (this.toggleEl) {
			this.toggleEl.removeEventListener('ln-toggle:open', this._onToggleOpen);
			this.toggleEl.removeEventListener('ln-toggle:close', this._onToggleClose);
		}
		dispatch(this.dom, 'ln-dropdown:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-dropdown');
})();
