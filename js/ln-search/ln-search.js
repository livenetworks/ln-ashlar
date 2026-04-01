import { guardBody, dispatchCancelable, findElements } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-search';
	const DOM_ATTRIBUTE = 'lnSearch';
	const INIT_ATTR = 'data-ln-search-initialized';
	const HIDE_ATTR = 'data-ln-search-hide';
	const DEBOUNCE_MS = 150;

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

		// Support data-ln-search directly on <input> or on a wrapper element
		const tag = dom.tagName;
		this.input = (tag === 'INPUT' || tag === 'TEXTAREA') ? dom
			: dom.querySelector('[name="search"]')
			|| dom.querySelector('input[type="search"]')
			|| dom.querySelector('input[type="text"]');

		this._debounceTimer = null;

		this._attachHandler();

		dom.setAttribute(INIT_ATTR, '');
		return this;
	}

	// ─── Handler ───────────────────────────────────────────────

	_component.prototype._attachHandler = function () {
		if (!this.input) return;
		const self = this;

		this._onInput = function () {
			clearTimeout(self._debounceTimer);
			self._debounceTimer = setTimeout(function () {
				self._search(self.input.value.trim().toLowerCase());
			}, DEBOUNCE_MS);
		};

		this.input.addEventListener('input', this._onInput);
	};

	_component.prototype._search = function (term) {
		const target = document.getElementById(this.targetId);
		if (!target) return;

		// Dispatch cancelable event on target.
		// Consumers (e.g. ln-table) can call preventDefault() to handle filtering
		// themselves and skip the default DOM show/hide behaviour.
		const evt = dispatchCancelable(target, 'ln-search:change', { term: term, targetId: this.targetId });
		if (evt.defaultPrevented) return;

		// Default behaviour: show/hide direct children of target
		const children = target.children;
		let matched = 0;
		const total = children.length;

		for (let i = 0; i < children.length; i++) {
			const el = children[i];
			el.removeAttribute(HIDE_ATTR);

			if (term && !el.textContent.replace(/\s+/g, ' ').toLowerCase().includes(term)) {
				el.setAttribute(HIDE_ATTR, 'true');
			} else {
				matched++;
			}
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		clearTimeout(this._debounceTimer);
		if (this.input && this._onInput) {
			this.input.removeEventListener('input', this._onInput);
		}
		this.dom.removeAttribute(INIT_ATTR);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── DOM Observer ──────────────────────────────────────────

	function _domObserver() {
		guardBody(function () {
			const observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					if (mutation.type === 'childList') {
						mutation.addedNodes.forEach(function (node) {
							if (node.nodeType === 1) {
								findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
							}
						});
					} else if (mutation.type === 'attributes') {
						findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
					}
				});
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
				attributeFilter: [DOM_SELECTOR]
			});
		}, 'ln-search');
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
