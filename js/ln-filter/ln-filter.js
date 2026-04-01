import { dispatch, guardBody, findElements } from '../ln-core';
import { reactiveState, createBatcher } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const INIT_ATTR = 'data-ln-filter-initialized';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';
	const ACTIVE_ATTR = 'data-active';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		if (dom.hasAttribute(INIT_ATTR)) return this;

		this.dom = dom;
		this.targetId = dom.getAttribute(DOM_SELECTOR);
		this.buttons = Array.from(dom.querySelectorAll('button'));
		this._pendingEvents = [];

		const self = this;

		const queueRender = createBatcher(
			function () { self._render(); },
			function () { self._afterRender(); }
		);

		this.state = reactiveState({
			key: null,
			value: null
		}, queueRender);

		this._attachHandlers();

		// Initialize from existing DOM — find pre-active button
		for (let i = 0; i < this.buttons.length; i++) {
			const btn = this.buttons[i];
			if (btn.hasAttribute(ACTIVE_ATTR) && btn.getAttribute(VALUE_ATTR) !== '') {
				// Set state directly on the proxy target to avoid triggering render
				this.state.key = btn.getAttribute(KEY_ATTR);
				this.state.value = btn.getAttribute(VALUE_ATTR);
				break;
			}
		}

		// Initialize aria-pressed on all filter buttons
		this.buttons.forEach(function (btn) {
			btn.setAttribute('aria-pressed', btn.hasAttribute(ACTIVE_ATTR) ? 'true' : 'false');
		});

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handlers ──────────────────────────────────────────────

	_component.prototype._attachHandlers = function () {
		const self = this;

		this.buttons.forEach(function (btn) {
			if (btn[DOM_ATTRIBUTE + 'Bound']) return;
			btn[DOM_ATTRIBUTE + 'Bound'] = true;

			btn.addEventListener('click', function () {
				const key = btn.getAttribute(KEY_ATTR);
				const value = btn.getAttribute(VALUE_ATTR);

				if (value === '') {
					self._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: '' } });
					self.reset();
				} else {
					self._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: value } });
					self.state.key = key;
					self.state.value = value;
				}
			});
		});
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		const self = this;
		const activeKey = this.state.key;
		const activeValue = this.state.value;

		// Update button states
		this.buttons.forEach(function (btn) {
			const btnKey = btn.getAttribute(KEY_ATTR);
			const btnValue = btn.getAttribute(VALUE_ATTR);
			let isActive = false;

			if (activeKey === null && activeValue === null) {
				// Reset state — "all" button is active
				isActive = btnValue === '';
			} else {
				isActive = btnKey === activeKey && btnValue === activeValue;
			}

			if (isActive) {
				btn.setAttribute(ACTIVE_ATTR, '');
				btn.setAttribute('aria-pressed', 'true');
			} else {
				btn.removeAttribute(ACTIVE_ATTR);
				btn.setAttribute('aria-pressed', 'false');
			}
		});

		// Apply filter to target children
		const target = document.getElementById(self.targetId);
		if (!target) return;

		const children = target.children;
		for (let i = 0; i < children.length; i++) {
			const el = children[i];

			if (activeKey === null && activeValue === null) {
				// Reset — show all
				el.removeAttribute(HIDE_ATTR);
				continue;
			}

			const attr = el.getAttribute('data-' + activeKey);
			el.removeAttribute(HIDE_ATTR);

			if (attr === null) continue;

			if (activeValue && attr.toLowerCase() !== activeValue.toLowerCase()) {
				el.setAttribute(HIDE_ATTR, 'true');
			}
		}
	};

	_component.prototype._afterRender = function () {
		const events = this._pendingEvents;
		this._pendingEvents = [];

		for (let i = 0; i < events.length; i++) {
			this._dispatchOnBoth(events[i].name, events[i].detail);
		}
	};

	_component.prototype._dispatchOnBoth = function (eventName, detail) {
		dispatch(this.dom, eventName, detail);
		const target = document.getElementById(this.targetId);
		if (target && target !== this.dom) {
			dispatch(target, eventName, detail);
		}
	};

	// ─── Public API ────────────────────────────────────────────

	_component.prototype.filter = function (key, value) {
		this._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: value } });
		this.state.key = key;
		this.state.value = value;
	};

	_component.prototype.reset = function () {
		this._pendingEvents.push({ name: 'ln-filter:reset', detail: {} });
		this.state.key = null;
		this.state.value = null;
	};

	_component.prototype.getActive = function () {
		if (this.state.key === null && this.state.value === null) return null;
		return { key: this.state.key, value: this.state.value };
	};

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				for (const mutation of mutations) {
					if (mutation.type === 'childList') {
						for (const node of mutation.addedNodes) {
							if (node.nodeType === 1) {
								findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							}
						}
					} else if (mutation.type === 'attributes') {
						findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-filter');
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
