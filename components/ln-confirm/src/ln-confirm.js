import { registerComponent, dispatch, shouldIgnoreClick, defineAttrs, attrSpec } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-confirm';
	const DOM_ATTRIBUTE = 'lnConfirm';
	const STATE_ATTR = 'data-ln-confirm-state';
	const ANNOUNCER_ATTR = 'data-ln-confirm-announcer';
	const DEFAULT_TIMEOUT = 3;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// `attrStr` would keep an empty attribute as '' and blank the button.
	function _readPrompt(el, name, fallback) {
		return el.getAttribute(name) || fallback;
	}

	// Seconds, fractional allowed; non-positive or unparseable counts as unset.
	// `attrInt` does neither.
	function _readTimeout(el, name, fallback) {
		const val = parseFloat(el.getAttribute(name));
		return (isNaN(val) || val <= 0) ? fallback : val;
	}

	// The bubble is a CSS ::after — invisible to AT. `role="alert"` is its own
	// assertive live region, so the button must NOT also be one: a live region
	// nested in a live region gets announced twice.
	function _makeAnnouncer(text) {
		const el = document.createElement('span');
		el.setAttribute(ANNOUNCER_ATTR, '');
		el.setAttribute('role', 'alert');
		el.textContent = text;
		return el;
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-confirm':         { prop: 'confirmText', type: 'string', read: _readPrompt, fallback: 'Confirm?', description: 'Prompt text or confirmation action trigger' },
		'data-ln-confirm-timeout': { prop: 'timeout', type: 'float', read: _readTimeout, fallback: DEFAULT_TIMEOUT, min: 0.1, description: 'Confirmation timeout in seconds before reverting' },
		'data-ln-confirm-state':   { prop: 'confirming', type: 'enum', values: ['confirming'], read: (el, name) => el.getAttribute(name) === 'confirming', description: 'Active confirmation state marker on button ("confirming")' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);
		this.revertTimer = null;
		this._submitted = false;

		// Detect two-element mode
		this.idleEl = dom.querySelector('[data-ln-confirm-idle]');
		this.activeEl = dom.querySelector('[data-ln-confirm-active]');
		this.isTwoElementMode = Boolean(this.idleEl || this.activeEl);

		// Not an attribute — a snapshot of the authored label, restored on revert.
		this.originalText = this.isTwoElementMode ? '' : dom.textContent.trim();

		const self = this;
		this._onClick = function (e) {
			if (shouldIgnoreClick(e)) return;

			if (!self.confirming) {
				e.preventDefault();
				e.stopImmediatePropagation();
				self._enterConfirm();
			} else {
				if (self._submitted) return;
				self._submitted = true;
				// Second click — the gate opens for THIS button's own default
				// action (submit / href), but the click still must not reach
				// an ancestor click surface.
				e.stopPropagation();
				self._reset();
			}
		};

		dom.addEventListener('click', this._onClick);
		return this;
	}

	_component.prototype._enterConfirm = function () {
		this.dom.setAttribute(STATE_ATTR, 'confirming');

		this.originalAriaLabel = this.dom.getAttribute('aria-label');
		this.originalAriaLive = this.dom.getAttribute('aria-live');

		if (this.isTwoElementMode) {
			if (this.idleEl) this.idleEl.setAttribute('hidden', 'true');
			if (this.activeEl) this.activeEl.removeAttribute('hidden');

			const promptText = this.activeEl ? this.activeEl.textContent.trim() : '';
			if (promptText) {
				this.dom.setAttribute('aria-label', promptText);
				this.dom.setAttribute('aria-live', 'polite');
			}
		} else {
			const iconUse = this.dom.querySelector('svg.ln-icon use');
			if (iconUse && this.originalText === '') {
				this.isIconButton = true;
				this.originalIconHref = iconUse.getAttribute('href');
				iconUse.setAttribute('href', '#ln-icon-check');
				this.dom.setAttribute('aria-label', this.confirmText);
				this.dom.appendChild(_makeAnnouncer(this.confirmText));
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
		const ms = this.timeout * 1000;
		this.revertTimer = setTimeout(function () {
			self._reset();
		}, ms);
	};

	_component.prototype._reset = function () {
		this._submitted = false;
		this.dom.removeAttribute(STATE_ATTR);

		if (this.isTwoElementMode) {
			if (this.idleEl) this.idleEl.removeAttribute('hidden');
			if (this.activeEl) this.activeEl.setAttribute('hidden', 'true');
		} else {
			if (this.isIconButton) {
				const iconUse = this.dom.querySelector('svg.ln-icon use');
				if (iconUse && this.originalIconHref) {
					iconUse.setAttribute('href', this.originalIconHref);
				}
				const announcer = this.dom.querySelector('[' + ANNOUNCER_ATTR + ']');
				if (announcer) announcer.remove();
				this.isIconButton = false;
				this.originalIconHref = null;
			} else {
				this.dom.textContent = this.originalText;
			}
		}

		// Restore Accessibility Attributes directly on host button
		if (this.originalAriaLabel !== null && this.originalAriaLabel !== undefined) {
			this.dom.setAttribute('aria-label', this.originalAriaLabel);
		} else {
			this.dom.removeAttribute('aria-label');
		}
		this.originalAriaLabel = null;

		if (this.originalAriaLive !== null && this.originalAriaLive !== undefined) {
			this.dom.setAttribute('aria-live', this.originalAriaLive);
		} else {
			this.dom.removeAttribute('aria-live');
		}
		this.originalAriaLive = null;

		if (this.revertTimer) {
			clearTimeout(this.revertTimer);
			this.revertTimer = null;
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		if (this.confirming) this._reset();
		this.dom.removeEventListener('click', this._onClick);
		delete this.dom[DOM_ATTRIBUTE];
		dispatch(this.dom, 'ln-confirm:destroyed', { target: this.dom });
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-confirm', {
		attributes: ATTRIBUTES
	});
})();
