import { dispatch, registerComponent, defineAttrs, attrSpec, attrStr } from '../../ln-core';
import { formatStatValue, parseStatFilter } from './stat-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-stat';
	const DOM_ATTRIBUTE = 'lnStat';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-stat':        { prop: '_storeName', read: attrStr, fallback: '' },
		'data-ln-stat-filter': { prop: '_filterRaw', read: attrStr, fallback: '' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);

		const self = this;

		this._onSetCount = function (e) {
			dom.textContent = formatStatValue(e.detail && e.detail.count);
			dom.classList.remove('is-loading');
		};
		dom.addEventListener('ln-stat:set-count', this._onSetCount);

		// Request initial count from coordinator
		dispatch(dom, 'ln-stat:request-count', {
			stat: this._storeName,
			filters: parseStatFilter(this._filterRaw)
		});

		return this;
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-stat:set-count', this._onSetCount);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-stat', {
		attributes: ATTRIBUTES
	});
})();
