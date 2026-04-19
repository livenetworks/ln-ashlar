import { dispatch, registerComponent } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-accordion';
	const DOM_ATTRIBUTE = 'lnAccordion';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-accordion');
})();
