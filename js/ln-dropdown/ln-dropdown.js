(function () {
	const DOM_SELECTOR = 'data-ln-dropdown';
	const DOM_ATTRIBUTE = 'lnDropdown';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
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

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.toggleEl = dom.querySelector('[data-ln-toggle]');
		this._boundDocClick = null;
		this._boundScrollClose = null;
		this._menuParent = null;
		this._placeholder = null;

		if (this.toggleEl) {
			this.toggleEl.setAttribute('data-ln-dropdown-menu', '');
		}

		const self = this;

		this._onToggleOpen = function (e) {
			if (e.detail.target !== self.toggleEl) return;
			self._teleportToBody();
			self._addOutsideClickListener();
			self._addScrollCloseListener();
			_dispatch(dom, 'ln-dropdown:open', { target: e.detail.target });
		};

		this._onToggleClose = function (e) {
			if (e.detail.target !== self.toggleEl) return;
			self._removeOutsideClickListener();
			self._removeScrollCloseListener();
			self._teleportBack();
			_dispatch(dom, 'ln-dropdown:close', { target: e.detail.target });
		};

		this.toggleEl.addEventListener('ln-toggle:open', this._onToggleOpen);
		this.toggleEl.addEventListener('ln-toggle:close', this._onToggleClose);

		return this;
	}

	// ─── Teleport ──────────────────────────────────────────────

	_component.prototype._teleportToBody = function () {
		if (!this.toggleEl || this.toggleEl.parentNode === document.body) return;

		const trigger = this.dom.querySelector('[data-ln-toggle-for]');
		if (!trigger) return;

		const rect = trigger.getBoundingClientRect();

		this._menuParent = this.toggleEl.parentNode;
		this._placeholder = document.createComment('ln-dropdown');
		this._menuParent.insertBefore(this._placeholder, this.toggleEl);

		document.body.appendChild(this.toggleEl);

		// Measure menu dimensions (briefly show off-screen to get size)
		this.toggleEl.style.position = 'fixed';
		this.toggleEl.style.visibility = 'hidden';
		this.toggleEl.style.display = 'block';
		const menuW = this.toggleEl.offsetWidth;
		const menuH = this.toggleEl.offsetHeight;
		this.toggleEl.style.visibility = '';
		this.toggleEl.style.display = '';

		// Viewport bounds
		const vw = window.innerWidth;
		const vh = window.innerHeight;
		const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--spacing-xs')) * 16 || 4;

		// Vertical: prefer below, flip above if no room
		var top;
		if (rect.bottom + gap + menuH <= vh) {
			top = rect.bottom + gap;
		} else if (rect.top - gap - menuH >= 0) {
			top = rect.top - gap - menuH;
		} else {
			top = Math.max(0, vh - menuH);
		}

		// Horizontal: prefer right-aligned to trigger, flip left-aligned if no room
		var left;
		if (rect.right - menuW >= 0) {
			// Right-aligned: menu's right edge = trigger's right edge
			left = rect.right - menuW;
		} else if (rect.left + menuW <= vw) {
			// Left-aligned: menu's left edge = trigger's left edge
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
			if (self.toggleEl) {
				self.toggleEl.dispatchEvent(new CustomEvent('ln-toggle:request-close'));
			}
		};
		setTimeout(function () {
			document.addEventListener('click', self._boundDocClick);
		}, 0);
	};

	_component.prototype._removeOutsideClickListener = function () {
		if (this._boundDocClick) {
			document.removeEventListener('click', this._boundDocClick);
			this._boundDocClick = null;
		}
	};

	// ─── Scroll / resize close ─────────────────────────────────

	_component.prototype._addScrollCloseListener = function () {
		const self = this;
		this._boundScrollClose = function () {
			if (self.toggleEl) {
				self.toggleEl.dispatchEvent(new CustomEvent('ln-toggle:request-close'));
			}
		};
		window.addEventListener('scroll', this._boundScrollClose, { passive: true, capture: true });
		window.addEventListener('resize', this._boundScrollClose);
	};

	_component.prototype._removeScrollCloseListener = function () {
		if (this._boundScrollClose) {
			window.removeEventListener('scroll', this._boundScrollClose, { capture: true });
			window.removeEventListener('resize', this._boundScrollClose);
			this._boundScrollClose = null;
		}
	};

	// ─── Destroy ───────────────────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._removeOutsideClickListener();
		this._removeScrollCloseListener();
		this._teleportBack();
		this.toggleEl.removeEventListener('ln-toggle:open', this._onToggleOpen);
		this.toggleEl.removeEventListener('ln-toggle:close', this._onToggleClose);
		_dispatch(this.dom, 'ln-dropdown:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					}
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
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
