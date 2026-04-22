import { dispatch, registerComponent } from '../ln-core';

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
		this._menuParent = null;
		this._placeholder = null;

		if (this.toggleEl) {
			this.toggleEl.setAttribute('data-ln-dropdown-menu', '');
			this.toggleEl.setAttribute('role', 'menu');
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
			if (e.detail.target !== self.toggleEl) return;
			if (self.triggerBtn) self.triggerBtn.setAttribute('aria-expanded', 'true');
			self._teleportToBody();
			self._addOutsideClickListener();
			self._addScrollRepositionListener();
			self._addResizeCloseListener();
			dispatch(dom, 'ln-dropdown:open', { target: e.detail.target });
		};

		this._onToggleClose = function (e) {
			if (e.detail.target !== self.toggleEl) return;
			if (self.triggerBtn) self.triggerBtn.setAttribute('aria-expanded', 'false');
			self._removeOutsideClickListener();
			self._removeScrollRepositionListener();
			self._removeResizeCloseListener();
			self._teleportBack();
			dispatch(dom, 'ln-dropdown:close', { target: e.detail.target });
		};

		if (this.toggleEl) {
			this.toggleEl.addEventListener('ln-toggle:open', this._onToggleOpen);
			this.toggleEl.addEventListener('ln-toggle:close', this._onToggleClose);
		}

		return this;
	}

	// ─── Positioning ───────────────────────────────────────────

	_component.prototype._positionMenu = function () {
		const trigger = this.dom.querySelector('[data-ln-toggle-for]');
		if (!trigger || !this.toggleEl) return;

		const rect = trigger.getBoundingClientRect();

		// Measure menu dimensions (briefly show off-screen to get size)
		const wasHidden = this.toggleEl.style.display === 'none' || this.toggleEl.style.display === '';
		if (wasHidden) {
			this.toggleEl.style.visibility = 'hidden';
			this.toggleEl.style.display = 'block';
		}
		const menuW = this.toggleEl.offsetWidth;
		const menuH = this.toggleEl.offsetHeight;
		if (wasHidden) {
			this.toggleEl.style.visibility = '';
			this.toggleEl.style.display = '';
		}

		// Viewport bounds
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--size-xs')) * 16 || 4;

		// Vertical: prefer below, flip above if no room
		let top;
		if (rect.bottom + gap + menuH <= vh) {
			top = rect.bottom + gap;
		} else if (rect.top - gap - menuH >= 0) {
			top = rect.top - gap - menuH;
		} else {
			top = Math.max(0, vh - menuH);
		}

		// Horizontal: prefer right-aligned to trigger, flip left-aligned if no room
		let left;
		if (rect.right - menuW >= 0) {
			left = rect.right - menuW;
		} else if (rect.left + menuW <= vw) {
			left = rect.left;
		} else {
			left = Math.max(0, vw - menuW);
		}

		this.toggleEl.style.top = top + 'px';
		this.toggleEl.style.left = left + 'px';
		this.toggleEl.style.right = 'auto';
		this.toggleEl.style.transform = 'none';
		this.toggleEl.style.margin = '0';
	};

	// ─── Teleport ──────────────────────────────────────────────

	_component.prototype._teleportToBody = function () {
		if (!this.toggleEl || this.toggleEl.parentNode === document.body) return;

		this._menuParent = this.toggleEl.parentNode;
		this._placeholder = document.createComment('ln-dropdown');
		this._menuParent.insertBefore(this._placeholder, this.toggleEl);

		document.body.appendChild(this.toggleEl);

		this.toggleEl.style.position = 'fixed';
		this._positionMenu();
	};

	_component.prototype._teleportBack = function () {
		if (!this._placeholder || !this._menuParent) return;

		this.toggleEl.style.position = '';
		this.toggleEl.style.top = '';
		this.toggleEl.style.left = '';
		this.toggleEl.style.right = '';
		this.toggleEl.style.transform = '';
		this.toggleEl.style.margin = '';

		this._menuParent.insertBefore(this.toggleEl, this._placeholder);
		this._menuParent.removeChild(this._placeholder);
		this._menuParent = null;
		this._placeholder = null;
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
			self._positionMenu();
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
		this._teleportBack();
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
