import { dispatch, dispatchCancelable, registerComponent, attrBool } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-scroll';
	const DOM_ATTRIBUTE = 'lnScroll';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-scroll':             { effect: null, type: 'string', description: 'Target element ID or CSS selector to scroll into view' },
		'data-ln-scroll-behavior':    { effect: null, type: 'enum', values: ['smooth', 'auto'], fallback: 'smooth', description: 'Scroll animation behavior transition' },
		'data-ln-scroll-block':       { effect: null, type: 'enum', values: ['start', 'center', 'end', 'nearest'], fallback: 'start', description: 'Vertical alignment positioning of scrolled target' },
		'data-ln-scroll-set':         { effect: null, type: 'string', description: 'Optional state attribute assignment on target after scroll (e.g. data-ln-toggle=open)' },
		'data-ln-scroll-focus':       { effect: null, type: 'string', description: 'CSS selector of element to focus after scroll, or "false" to disable' },
		'data-ln-scroll-delay':       { effect: null, type: 'integer', fallback: 450, min: 0, description: 'Delay in milliseconds before shifting keyboard focus' },
		'data-ln-scroll-update-hash': { effect: null, type: 'boolean', fallback: false, description: 'Whether to update URL hash with target ID' }
	};

	// ─── Component Constructor ───────────────────────────────
	function _component(dom) {
		if (dom[DOM_ATTRIBUTE]) return dom[DOM_ATTRIBUTE];
		// Allow both <a> and <button> elements
		if (!dom || (dom.tagName !== 'A' && dom.tagName !== 'BUTTON')) return;

		dom[DOM_ATTRIBUTE] = this;
		this.dom = dom;
		this._handleClick = this._handleClick.bind(this);
		this.dom.addEventListener('click', this._handleClick);

		return this;
	}

	// ─── Click & Smooth Scroll Handler ───────────────────────
	_component.prototype._handleClick = function (e) {
		// Allow native navigation if modifier keys are pressed on <a> links
		if (this.dom.tagName === 'A' && (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0)) {
			return;
		}

		// Target resolution: data-ln-scroll="#apply" takes priority, falls back to href
		let targetSelector = (this.dom.getAttribute('data-ln-scroll') || '').trim();
		if (!targetSelector) {
			targetSelector = (this.dom.getAttribute('href') || '').trim();
		}
		if (!targetSelector || targetSelector === '#') {
			return;
		}
		// If provided as a raw ID without '#', normalize to ID selector
		if (!targetSelector.startsWith('#') && !targetSelector.startsWith('.') && !targetSelector.startsWith('[')) {
			targetSelector = '#' + targetSelector;
		}

		let targetEl = null;
		try {
			targetEl = document.querySelector(targetSelector);
		} catch (_) {
			const id = targetSelector.replace(/^#/, '');
			targetEl = document.getElementById(id);
		}

		if (!targetEl) return;

		e.preventDefault();

		// Optional field preset: selector:value (e.g. data-ln-scroll-set="#opportunity_type:Company Driver")
		const setAttr = this.dom.getAttribute('data-ln-scroll-set');
		if (setAttr) {
			const colonIdx = setAttr.indexOf(':');
			if (colonIdx !== -1) {
				const selector = setAttr.slice(0, colonIdx).trim();
				const val = setAttr.slice(colonIdx + 1).trim();
				try {
					const field = document.querySelector(selector);
					if (field) {
						field.value = val;
						field.dispatchEvent(new Event('input', { bubbles: true }));
						field.dispatchEvent(new Event('change', { bubbles: true }));
					}
				} catch (_) {}
			}
		}

		// Dispatch cancelable before-scroll event
		const beforeEvent = dispatchCancelable(this.dom, 'ln-scroll:before-scroll', {
			target: targetEl,
			link: this.dom,
			href: targetSelector
		});
		if (beforeEvent.defaultPrevented) return;

		// Perform smooth scroll
		const behavior = this.dom.getAttribute('data-ln-scroll-behavior') || 'smooth';
		const block = this.dom.getAttribute('data-ln-scroll-block') || 'start';
		targetEl.scrollIntoView({ behavior: behavior, block: block });

		// Optional URL hash update
		const updateHash = attrBool(this.dom, 'data-ln-scroll-update-hash', false);
		if (updateHash) {
			try {
				if (window.history && window.history.pushState) {
					window.history.pushState(null, '', targetSelector);
				}
			} catch (_) {}
		}

		// Shift focus after scrolling to preserve keyboard flow
		const focusTargetAttr = this.dom.getAttribute('data-ln-scroll-focus');
		if (focusTargetAttr !== 'false' && focusTargetAttr !== '0') {
			const rawDelay = parseInt(this.dom.getAttribute('data-ln-scroll-delay'), 10);
			const delay = isNaN(rawDelay) ? 450 : rawDelay;

			window.setTimeout(function () {
				let focusEl = null;
				if (focusTargetAttr && focusTargetAttr !== 'true' && focusTargetAttr !== '1') {
					try {
						focusEl = document.querySelector(focusTargetAttr);
					} catch (_) {}
				}
				if (!focusEl) {
					focusEl = targetEl.querySelector('input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])');
				}
				if (!focusEl && targetEl.getAttribute('tabindex') !== null) {
					focusEl = targetEl;
				}
				if (focusEl && typeof focusEl.focus === 'function') {
					focusEl.focus({ preventScroll: true });
				}
			}, delay);
		}

		// Dispatch post-scroll event
		dispatch(this.dom, 'ln-scroll:scrolled', {
			target: targetEl,
			link: this.dom,
			href: targetSelector
		});
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('click', this._handleClick);
		dispatch(this.dom, 'ln-scroll:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Registration ─────────────────────────────────────────
	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-scroll', {
		attributes: ATTRIBUTES
	});
})();
