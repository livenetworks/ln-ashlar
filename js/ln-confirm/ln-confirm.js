import { guardBody, dispatch, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-confirm';
	const DOM_ATTRIBUTE = 'lnConfirm';
	const TIMEOUT_ATTR = 'data-ln-confirm-timeout';
	const DEFAULT_TIMEOUT = 3;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.confirming = false;
		this.originalText = dom.textContent.trim();
		this.confirmText = dom.getAttribute(DOM_SELECTOR) || 'Confirm?';
		this.revertTimer = null;
		this._submitted = false;

		const self = this;
		this._onClick = function (e) {
			if (!self.confirming) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self._enterConfirm();
			} else {
				if (self._submitted) return;
				self._submitted = true;
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

		var iconUse = this.dom.querySelector('svg.ln-icon use');
		if (iconUse && this.originalText === '') {
			this.isIconButton = true;
			this.originalIconHref = iconUse.getAttribute('href');
			iconUse.setAttribute('href', '#ln-check');
			this.dom.classList.add('ln-confirm-tooltip');
			this.dom.setAttribute('data-tooltip-text', this.confirmText);
		} else {
			this.dom.textContent = this.confirmText;
		}

		this._startTimer();

		dispatch(this.dom, 'ln-confirm:waiting', { target: this.dom });
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
		this._submitted = false;
		this.confirming = false;
		this.dom.removeAttribute('data-confirming');

		if (this.isIconButton) {
			var iconUse = this.dom.querySelector('svg.ln-icon use');
			if (iconUse && this.originalIconHref) {
				iconUse.setAttribute('href', this.originalIconHref);
			}
			this.dom.classList.remove('ln-confirm-tooltip');
			this.dom.removeAttribute('data-tooltip-text');
			this.isIconButton = false;
			this.originalIconHref = null;
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
								findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							}
						}
					} else if (mutation.type === 'attributes') {
						if (mutation.attributeName === TIMEOUT_ATTR && mutation.target[DOM_ATTRIBUTE]) {
							_syncTimeout(mutation.target);
						} else {
							findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
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
