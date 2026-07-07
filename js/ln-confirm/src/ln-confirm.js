import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-confirm';
	const DOM_ATTRIBUTE = 'lnConfirm';
	const TIMEOUT_ATTR = 'data-ln-confirm-timeout';
	const DEFAULT_TIMEOUT = 3;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _log(...args) {
		const isDebug = document.documentElement.hasAttribute('data-ln-debug') ||
			(document.body && document.body.hasAttribute('data-ln-debug'));
		if (isDebug) {
			console.warn('[ln-confirm]', ...args);
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		_log('constructor called on', dom);
		this.dom = dom;
		this.confirming = false;
		this.revertTimer = null;
		this._submitted = false;

		// Detect two-element mode
		this.idleEl = dom.querySelector('[data-ln-confirm-idle]');
		this.activeEl = dom.querySelector('[data-ln-confirm-active]');
		this.isTwoElementMode = !!(this.idleEl || this.activeEl);

		if (this.isTwoElementMode) {
			this.originalText = '';
			this.confirmText = '';
		} else {
			this.originalText = dom.textContent.trim();
			this.confirmText = dom.getAttribute(DOM_SELECTOR) || 'Confirm?';
		}

		const self = this;
		this._onClick = function (e) {
			_log('click handler, confirming:', self.confirming, 'submitted:', self._submitted, 'target:', e.target);
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

		if (this.isTwoElementMode) {
			if (this.idleEl) this.idleEl.setAttribute('hidden', 'true');
			if (this.activeEl) this.activeEl.removeAttribute('hidden');

			// Screen Reader announcement for Two-Element Mode
			this.originalAriaLabel = this.dom.getAttribute('aria-label');
			const promptText = this.activeEl ? this.activeEl.textContent.trim() : '';
			if (promptText) {
				this.dom.setAttribute('aria-label', promptText);
				this.alertNode = document.createElement('span');
				this.alertNode.className = 'sr-only';
				this.alertNode.setAttribute('role', 'alert');
				this.alertNode.textContent = promptText;
				this.dom.appendChild(this.alertNode);
			}
		} else {
			var iconUse = this.dom.querySelector('svg.ln-icon use');
			if (iconUse && this.originalText === '') {
				this.isIconButton = true;
				this.originalIconHref = iconUse.getAttribute('href');
				iconUse.setAttribute('href', '#ln-check');
				this.dom.classList.add('ln-confirm-tooltip');
				this.dom.setAttribute('data-tooltip-text', this.confirmText);
				this.originalAriaLabel = this.dom.getAttribute('aria-label');
				this.dom.setAttribute('aria-label', this.confirmText);
				this.alertNode = document.createElement('span');
				this.alertNode.className = 'sr-only';
				this.alertNode.setAttribute('role', 'alert');
				this.alertNode.textContent = this.confirmText;
				this.dom.appendChild(this.alertNode);
			} else {
				this.dom.textContent = this.confirmText;
			}
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

		if (this.isTwoElementMode) {
			if (this.idleEl) this.idleEl.removeAttribute('hidden');
			if (this.activeEl) this.activeEl.setAttribute('hidden', 'true');

			// Restore Accessibility
			if (this.originalAriaLabel !== null && this.originalAriaLabel !== undefined) {
				this.dom.setAttribute('aria-label', this.originalAriaLabel);
			} else {
				this.dom.removeAttribute('aria-label');
			}
			this.originalAriaLabel = null;
			if (this.alertNode && this.alertNode.parentNode === this.dom) {
				this.dom.removeChild(this.alertNode);
			}
			this.alertNode = null;
		} else {
			if (this.isIconButton) {
				var iconUse = this.dom.querySelector('svg.ln-icon use');
				if (iconUse && this.originalIconHref) {
					iconUse.setAttribute('href', this.originalIconHref);
				}
				this.dom.classList.remove('ln-confirm-tooltip');
				this.dom.removeAttribute('data-tooltip-text');
				if (this.originalAriaLabel !== null && this.originalAriaLabel !== undefined) {
					this.dom.setAttribute('aria-label', this.originalAriaLabel);
				} else {
					this.dom.removeAttribute('aria-label');
				}
				this.originalAriaLabel = null;
				if (this.alertNode && this.alertNode.parentNode === this.dom) {
					this.dom.removeChild(this.alertNode);
				}
				this.alertNode = null;
				this.isIconButton = false;
				this.originalIconHref = null;
			} else {
				this.dom.textContent = this.originalText;
			}
		}

		if (this.revertTimer) {
			clearTimeout(this.revertTimer);
			this.revertTimer = null;
		}
	};

	_component.prototype.destroy = function () {
		_log('destroy called on', this.dom);
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._reset();
		this.dom.removeEventListener('click', this._onClick);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-confirm');
})();
