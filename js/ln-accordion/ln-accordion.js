import { dispatch, guardBody, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-accordion';
	const DOM_ATTRIBUTE = 'lnAccordion';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;

		this._onToggleOpen = function (e) {
			const toggles = dom.querySelectorAll('[data-ln-toggle]');
			for (const el of toggles) {
				if (el !== e.detail.target && el.getAttribute('data-ln-toggle') === 'open') {
					el.setAttribute('data-ln-toggle', 'close');
				}
			}
			dispatch(dom, 'ln-accordion:change', { target: e.detail.target });
		};
		dom.addEventListener('ln-toggle:open', this._onToggleOpen);

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-toggle:open', this._onToggleOpen);
		dispatch(this.dom, 'ln-accordion:destroyed', { target: this.dom });
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
		}, 'ln-accordion');
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
