import { guardBody } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-autoresize';
	const DOM_ATTRIBUTE = 'lnAutoresize';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Constructor ───────────────────────────────────────────

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
			items.push(root);
		}
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
	}

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		if (dom.tagName !== 'TEXTAREA') {
			console.warn('[ln-autoresize] Can only be applied to <textarea>, got:', dom.tagName);
			return this;
		}

		this.dom = dom;

		const self = this;
		this._onInput = function () {
			self._resize();
		};

		dom.addEventListener('input', this._onInput);

		// Initial resize (content may be pre-filled)
		this._resize();

		return this;
	}

	_component.prototype._resize = function () {
		this.dom.style.height = 'auto';
		this.dom.style.height = this.dom.scrollHeight + 'px';
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('input', this._onInput);
		this.dom.style.height = '';
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
								_findElements(node);
							}
						}
					} else if (mutation.type === 'attributes') {
						_findElements(mutation.target);
					}
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-autoresize');
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
