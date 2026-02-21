(function () {
	const DOM_SELECTOR = 'data-ln-accordion';
	const DOM_ATTRIBUTE = 'lnAccordion';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		var items = root.querySelectorAll('[' + DOM_SELECTOR + ']') || [];
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items = Array.from(items);
			items.push(root);
		}
		items.forEach(function (el) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		});
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;

		dom.addEventListener('ln-toggle:open', function (e) {
			var toggles = dom.querySelectorAll('[data-ln-toggle]');
			toggles.forEach(function (el) {
				if (el !== e.detail.target && el.lnToggle && el.lnToggle.isOpen) {
					el.lnToggle.close();
				}
			});
		});

		return this;
	}

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				if (mutation.type === 'childList') {
					mutation.addedNodes.forEach(function (node) {
						if (node.nodeType === 1) {
							_findElements(node);
						}
					});
				}
			});
		});

		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
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
