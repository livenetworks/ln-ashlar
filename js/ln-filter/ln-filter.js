import { dispatch, guardBody, findElements } from '../ln-core';
import { reactiveState, createBatcher } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-filter';
	const DOM_ATTRIBUTE = 'lnFilter';
	const INIT_ATTR = 'data-ln-filter-initialized';
	const KEY_ATTR = 'data-ln-filter-key';
	const VALUE_ATTR = 'data-ln-filter-value';
	const HIDE_ATTR = 'data-ln-filter-hide';

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
		this.inputs = Array.from(dom.querySelectorAll('[' + KEY_ATTR + ']'));
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

		// Initialize from existing DOM — find pre-checked input
		for (let i = 0; i < this.inputs.length; i++) {
			const input = this.inputs[i];
			if (input.checked && input.getAttribute(VALUE_ATTR) !== '') {
				// Set state directly on the proxy target to avoid triggering render
				this.state.key = input.getAttribute(KEY_ATTR);
				this.state.value = input.getAttribute(VALUE_ATTR);
				break;
			}
		}

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handlers ──────────────────────────────────────────────

	_component.prototype._attachHandlers = function () {
		const self = this;

		this.inputs.forEach(function (input) {
			if (input[DOM_ATTRIBUTE + 'Bound']) return;
			input[DOM_ATTRIBUTE + 'Bound'] = true;

			input._lnFilterChange = function () {
				const key = input.getAttribute(KEY_ATTR);
				const value = input.getAttribute(VALUE_ATTR);

				if (value === '') {
					// "All" checkbox — reset
					self._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: '' } });
					self.reset();
				} else if (self.state.key === key && self.state.value === value) {
					// Same filter clicked again — toggle OFF (reset)
					self._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: '' } });
					self.reset();
				} else {
					// New filter selected
					self._pendingEvents.push({ name: 'ln-filter:changed', detail: { key: key, value: value } });
					self.state.key = key;
					self.state.value = value;
				}
			};
			input.addEventListener('change', input._lnFilterChange);
		});
	};

	// ─── Render ────────────────────────────────────────────────

	_component.prototype._render = function () {
		const self = this;
		const activeKey = this.state.key;
		const activeValue = this.state.value;

		// Update input states
		this.inputs.forEach(function (input) {
			const inputKey = input.getAttribute(KEY_ATTR);
			const inputValue = input.getAttribute(VALUE_ATTR);
			let isActive = false;

			if (activeKey === null && activeValue === null) {
				// Reset state — "All" input is active
				isActive = inputValue === '';
			} else {
				isActive = inputKey === activeKey && inputValue === activeValue;
			}

			input.checked = isActive;
		});

		// Apply filter to target children (unchanged logic)
		const target = document.getElementById(self.targetId);
		if (!target) return;

		const children = target.children;
		for (let i = 0; i < children.length; i++) {
			const el = children[i];

			if (activeKey === null && activeValue === null) {
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

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.inputs.forEach(function (input) {
			if (input._lnFilterChange) {
				input.removeEventListener('change', input._lnFilterChange);
				delete input._lnFilterChange;
			}
			delete input[DOM_ATTRIBUTE + 'Bound'];
		});
		this.dom.removeAttribute(INIT_ATTR);
		delete this.dom[DOM_ATTRIBUTE];
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
