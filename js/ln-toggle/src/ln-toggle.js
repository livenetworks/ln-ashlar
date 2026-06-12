import { registerComponent, dispatch, dispatchCancelable } from '../../ln-core';
import { persistGet, persistSet } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-toggle';
	const DOM_ATTRIBUTE = 'lnToggle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;




	function _syncTriggerAria(panelEl, isOpen) {
		const triggers = document.querySelectorAll(
			'[data-ln-toggle-for="' + panelEl.id + '"]'
		);
		for (const trigger of triggers) {
			trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;

		// ─── Restore persisted state ──────────────────────────────
		if (dom.hasAttribute('data-ln-persist')) {
			const saved = persistGet('toggle', dom);
			if (saved !== null) {
				dom.setAttribute(DOM_SELECTOR, saved);
			}
		}

		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		if (this.isOpen) {
			dom.classList.add('open');
		}

		_syncTriggerAria(dom, this.isOpen);

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		dispatch(this.dom, 'ln-toggle:destroyed', { target: this.dom });
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		const value = el.getAttribute(DOM_SELECTOR);
		const shouldBeOpen = value === 'open';

		if (shouldBeOpen === instance.isOpen) return;

		if (shouldBeOpen) {
			const before = dispatchCancelable(el, 'ln-toggle:before-open', { target: el });
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'close');
				return;
			}
			instance.isOpen = true;
			el.classList.add('open');
			_syncTriggerAria(el, true);
			dispatch(el, 'ln-toggle:open', { target: el });
			if (el.hasAttribute('data-ln-persist')) {
				persistSet('toggle', el, 'open');
			}
		} else {
			const before = dispatchCancelable(el, 'ln-toggle:before-close', { target: el });
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance.isOpen = false;
			el.classList.remove('open');
			_syncTriggerAria(el, false);
			dispatch(el, 'ln-toggle:close', { target: el });
			if (el.hasAttribute('data-ln-persist')) {
				persistSet('toggle', el, 'close');
			}
		}
	}

	// ─── Event Delegation ──────────────────────────────────────

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		const trigger = e.target.closest('[data-ln-toggle-for]');
		if (trigger) {
			const targetId = trigger.getAttribute('data-ln-toggle-for');
			const target = document.getElementById(targetId);
			if (target && target[DOM_ATTRIBUTE]) {
				e.preventDefault();
				const action = trigger.getAttribute('data-ln-toggle-action') || 'toggle';
				if (action === 'open') {
					target.setAttribute(DOM_SELECTOR, 'open');
				} else if (action === 'close') {
					target.setAttribute(DOM_SELECTOR, 'close');
				} else if (action === 'toggle') {
					const current = target.getAttribute(DOM_SELECTOR);
					target.setAttribute(DOM_SELECTOR, current === 'open' ? 'close' : 'open');
				}
			}
		}
	});

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-toggle', {
		onAttributeChange: _syncAttribute
	});
})();
