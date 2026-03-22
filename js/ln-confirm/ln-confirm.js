(function () {
	const DOM_SELECTOR = 'data-ln-confirm';
	const DOM_ATTRIBUTE = 'lnConfirm';
	const REVERT_TIMEOUT = 3000;

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
		this.confirming = false;
		this.originalText = dom.textContent.trim();
		this.confirmText = dom.getAttribute(DOM_SELECTOR) || 'Confirm?';
		this.revertTimer = null;

		const self = this;
		this._onClick = function (e) {
			if (!self.confirming) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self._enterConfirm();
			} else {
				// Second click — allow form submit
				self._reset();
			}
		};

		dom.addEventListener('click', this._onClick);
		return this;
	}

	_component.prototype._enterConfirm = function () {
		this.confirming = true;
		this.dom.setAttribute('data-confirming', 'true');

		if (this.dom.className.match(/ln-icon-/) && this.originalText === '') {
			this.isIconButton = true;
			// Extract existing icon class
			this.originalIconClass = Array.from(this.dom.classList).find(c => c.startsWith('ln-icon-'));
			if (this.originalIconClass) {
				this.dom.classList.remove(this.originalIconClass);
			}
			this.dom.classList.add('ln-icon-check', 'text-success', 'ln-confirm-tooltip');
			this.dom.setAttribute('data-tooltip-text', this.confirmText);
		} else {
			this.dom.textContent = this.confirmText;
		}

		var self = this;
		this.revertTimer = setTimeout(function () {
			self._reset();
		}, REVERT_TIMEOUT);

		_dispatch(this.dom, 'ln-confirm:waiting', { target: this.dom });
	};

	_component.prototype._reset = function () {
		this.confirming = false;
		this.dom.removeAttribute('data-confirming');
		
		if (this.isIconButton) {
			this.dom.classList.remove('ln-icon-check', 'text-success', 'ln-confirm-tooltip');
			if (this.originalIconClass) {
				this.dom.classList.add(this.originalIconClass);
			}
			this.dom.removeAttribute('data-tooltip-text');
			this.isIconButton = false;
		} else {
			this.dom.textContent = this.originalText;
		}

		if (this.revertTimer) {
			clearTimeout(this.revertTimer);
			this.revertTimer = null;
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._reset();
		this.dom.removeEventListener('click', this._onClick);
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
		var observer = new MutationObserver(function (mutations) {
			for (var i = 0; i < mutations.length; i++) {
				if (mutations[i].type === 'childList') {
					for (var j = 0; j < mutations[i].addedNodes.length; j++) {
						var node = mutations[i].addedNodes[j];
						if (node.nodeType === 1) {
							_findElements(node);
						}
					}
				}
			}
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
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
