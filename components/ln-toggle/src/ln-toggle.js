import { dispatch, dispatchCancelable, persistGet, persistSet, registerComponent } from '../../ln-core';
import { getNextToggleState, isTargetDisabled, normalizeToggleState, shouldIgnoreClick } from './toggle-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-toggle';
	const DOM_ATTRIBUTE = 'lnToggle';
	const TRIGGER_ATTRIBUTE = 'data-ln-toggle-for';
	const ACTION_ATTRIBUTE = 'data-ln-toggle-action';
	const PERSIST_ATTRIBUTE = 'data-ln-persist';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const instances = new Set();
	let clickListener = null;

	function _ensureClickListener() {
		if (clickListener) return;
		clickListener = function (e) {
			if (shouldIgnoreClick(e)) return;

			const trigger = e.target.closest('[' + TRIGGER_ATTRIBUTE + ']');
			if (!trigger || isTargetDisabled(trigger)) return;

			const targetId = trigger.getAttribute(TRIGGER_ATTRIBUTE);
			if (!targetId) return;

			const target = document.getElementById(targetId);
			if (!target || !target[DOM_ATTRIBUTE]) return;

			e.preventDefault();
			const action = trigger.getAttribute(ACTION_ATTRIBUTE) || 'toggle';
			const current = target.getAttribute(DOM_SELECTOR);
			const nextState = getNextToggleState(current, action);
			target.setAttribute(DOM_SELECTOR, nextState);
		};
		document.addEventListener('click', clickListener);
	}

	function _maybeRemoveClickListener() {
		if (instances.size > 0 || !clickListener) return;
		document.removeEventListener('click', clickListener);
		clickListener = null;
	}

	function _syncTriggerAria(panelEl, isOpen) {
		if (!panelEl || !panelEl.id) return;
		const triggers = document.querySelectorAll(
			'[' + TRIGGER_ATTRIBUTE + '="' + panelEl.id + '"]'
		);
		for (let i = 0; i < triggers.length; i++) {
			triggers[i].setAttribute('aria-expanded', isOpen ? 'true' : 'false');
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;

		const self = this;
		this._onRequestOpen = function () {
			self.open();
		};
		this._onRequestClose = function () {
			self.close();
		};
		this._onRequestToggle = function () {
			self.toggle();
		};

		this.dom.addEventListener('ln-toggle:request-open', this._onRequestOpen);
		this.dom.addEventListener('ln-toggle:request-close', this._onRequestClose);
		this.dom.addEventListener('ln-toggle:request-toggle', this._onRequestToggle);

		// Restore persisted state
		if (dom.hasAttribute(PERSIST_ATTRIBUTE)) {
			const saved = persistGet('toggle', dom);
			if (saved !== null) {
				dom.setAttribute(DOM_SELECTOR, normalizeToggleState(saved));
			}
		}

		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		if (this.isOpen) {
			dom.classList.add('open');
		}

		_syncTriggerAria(dom, this.isOpen);

		instances.add(this);
		_ensureClickListener();

		return this;
	}

	_component.prototype.open = function () {
		this.dom.setAttribute(DOM_SELECTOR, 'open');
	};

	_component.prototype.close = function () {
		this.dom.setAttribute(DOM_SELECTOR, 'close');
	};

	_component.prototype.toggle = function () {
		const current = this.dom.getAttribute(DOM_SELECTOR);
		this.dom.setAttribute(DOM_SELECTOR, getNextToggleState(current, 'toggle'));
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-toggle:request-open', this._onRequestOpen);
		this.dom.removeEventListener('ln-toggle:request-close', this._onRequestClose);
		this.dom.removeEventListener('ln-toggle:request-toggle', this._onRequestToggle);

		instances.delete(this);
		delete this.dom[DOM_ATTRIBUTE];
		_maybeRemoveClickListener();

		dispatch(this.dom, 'ln-toggle:destroyed', { target: this.dom });
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
			if (el.hasAttribute(PERSIST_ATTRIBUTE)) {
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
			if (el.hasAttribute(PERSIST_ATTRIBUTE)) {
				persistSet('toggle', el, 'close');
			}
		}
	}

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-toggle', {
		onAttributeChange: _syncAttribute
	});
})();
