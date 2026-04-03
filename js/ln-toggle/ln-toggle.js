import { guardBody, dispatch, dispatchCancelable, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-toggle';
	const DOM_ATTRIBUTE = 'lnToggle';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
		_attachTriggers(domRoot);
	}

	function _attachTriggers(root) {
		const triggers = Array.from(root.querySelectorAll('[data-ln-toggle-for]'));
		if (root.hasAttribute && root.hasAttribute('data-ln-toggle-for')) {
			triggers.push(root);
		}
		for (const btn of triggers) {
			if (btn[DOM_ATTRIBUTE + 'Trigger']) continue;
			btn[DOM_ATTRIBUTE + 'Trigger'] = true;
			btn.addEventListener('click', function (e) {
				if (e.ctrlKey || e.metaKey || e.button === 1) return;
				e.preventDefault();
				const targetId = btn.getAttribute('data-ln-toggle-for');
				const target = document.getElementById(targetId);
				if (!target || !target[DOM_ATTRIBUTE]) return;

				const action = btn.getAttribute('data-ln-toggle-action') || 'toggle';
				target[DOM_ATTRIBUTE][action]();
			});
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open';

		if (this.isOpen) {
			dom.classList.add('open');
		}

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
			dispatch(el, 'ln-toggle:open', { target: el });
		} else {
			const before = dispatchCancelable(el, 'ln-toggle:before-close', { target: el });
			if (before.defaultPrevented) {
				el.setAttribute(DOM_SELECTOR, 'open');
				return;
			}
			instance.isOpen = false;
			el.classList.remove('open');
			dispatch(el, 'ln-toggle:close', { target: el });
		}
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
								_attachTriggers(node);
							}
						}
					} else if (mutation.type === 'attributes') {
						if (mutation.attributeName === DOM_SELECTOR && mutation.target[DOM_ATTRIBUTE]) {
							_syncAttribute(mutation.target);
						} else {
							findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							_attachTriggers(mutation.target);
						}
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR, 'data-ln-toggle-for']
			});
		}, 'ln-toggle');
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
