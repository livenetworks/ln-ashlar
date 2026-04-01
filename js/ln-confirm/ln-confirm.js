import { guardBody } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-confirm';
	const DOM_ATTRIBUTE = 'lnConfirm';
	const TIMEOUT_ATTR = 'data-ln-confirm-timeout';
	const DEFAULT_TIMEOUT = 3;

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

	_component.prototype._getTimeout = function () {
		const val = parseFloat(this.dom.getAttribute(TIMEOUT_ATTR));
		return (isNaN(val) || val <= 0) ? DEFAULT_TIMEOUT : val;
	};

	_component.prototype._enterConfirm = function () {
		this.confirming = true;
		this.dom.setAttribute('data-confirming', 'true');

		if (this.dom.className.match(/ln-icon-/) && this.originalText === '') {
			this.isIconButton = true;
			this.originalIconClass = Array.from(this.dom.classList).find(function (c) { return c.startsWith('ln-icon-'); });
			if (this.originalIconClass) {
				this.dom.classList.remove(this.originalIconClass);
			}
			this.dom.classList.add('ln-icon-check', 'text-success', 'ln-confirm-tooltip');
			this.dom.setAttribute('data-tooltip-text', this.confirmText);
		} else {
			this.dom.textContent = this.confirmText;
		}

		this._startTimer();

		_dispatch(this.dom, 'ln-confirm:waiting', { target: this.dom });
	};

	_component.prototype._startTimer = function () {
		if (this.revertTimer) {
			clearTimeout(this.revertTimer);
		}
		const self = this;
		const ms = this._getTimeout() * 1000;
		this.revertTimer = setTimeout(function () {
			self._reset();
		}, ms);
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

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncTimeout(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || !instance.confirming) return;
		// Restart timer with new timeout value
		instance._startTimer();
	}

	// ─── Helpers ───────────────────────────────────────────────

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true,
			detail: detail || {}
		}));
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
								_findElements(node);
							}
						}
					} else if (mutation.type === 'attributes') {
						if (mutation.attributeName === TIMEOUT_ATTR && mutation.target[DOM_ATTRIBUTE]) {
							_syncTimeout(mutation.target);
						} else {
							_findElements(mutation.target);
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR, TIMEOUT_ATTR]
			});
		}, 'ln-confirm');
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
