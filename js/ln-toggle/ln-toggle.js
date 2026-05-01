import { registerComponent, dispatch, dispatchCancelable } from '../ln-core';
import { persistGet, persistSet } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-toggle';
	const DOM_ATTRIBUTE = 'lnToggle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;


	function _attachTriggers(root) {
		const triggers = Array.from(root.querySelectorAll('[data-ln-toggle-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-toggle-for')) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			const handler = function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const targetId = btn.getAttribute('data-ln-toggle-for');
				const target = document.getElementById(targetId);
				if (!target || !target[DOM_ATTRIBUTE]) return;

				const action = btn.getAttribute('data-ln-toggle-action') || 'toggle';
				target[DOM_ATTRIBUTE][action]();
			};
			btn.addEventListener('click', handler);
			btn[DOM_ATTRIBUTE + 'Trigger'] = handler;
			const targetId = btn.getAttribute('data-ln-toggle-for');
			const target = document.getElementById(targetId);
			if (target && target[DOM_ATTRIBUTE]) {
				btn.setAttribute('aria-expanded', target[DOM_ATTRIBUTE].isOpen ? 'true' : 'false');
			}
		}
	}

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

	_component.prototype.open = function () {
		if (this.isOpen) return;
		this.dom.setAttribute(DOM_SELECTOR, 'open');
	};

	_component.prototype.close = function () {
		if (!this.isOpen) return;
		this.dom.setAttribute(DOM_SELECTOR, 'close');
	};

	_component.prototype.toggle = function () {
		this.isOpen ? this.close() : this.open();
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		dispatch(this.dom, 'ln-toggle:destroyed', { target: this.dom });
		const triggers = document.querySelectorAll('[data-ln-toggle-for="' + this.dom.id + '"]');
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) {
				btn.removeEventListener('click', btn[DOM_ATTRIBUTE + 'Trigger']);
				delete btn[DOM_ATTRIBUTE + 'Trigger'];
			}
		}
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

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-toggle', {
		extraAttributes: ['data-ln-toggle-for'],
		onAttributeChange: _syncAttribute,
		onInit: _attachTriggers
	});
})();
