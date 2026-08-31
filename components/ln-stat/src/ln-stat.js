import { dispatch, registerComponent } from '../../ln-core';
import { formatStatValue, parseStatFilter } from './stat-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-stat';
	const DOM_ATTRIBUTE = 'lnStat';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._storeName = dom.getAttribute(DOM_SELECTOR);
		this._filters = parseStatFilter(dom.getAttribute('data-ln-stat-filter'));

		const self = this;

		this._onSetCount = function (e) {
			dom.textContent = formatStatValue(e.detail && e.detail.count);
			dom.classList.remove('is-loading');
		};
		dom.addEventListener('ln-stat:set-count', this._onSetCount);

		// Request initial count from coordinator
		dispatch(dom, 'ln-stat:request-count', {
			stat: this._storeName,
			filters: this._filters
		});

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-stat:set-count', this._onSetCount);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-stat');
})();
