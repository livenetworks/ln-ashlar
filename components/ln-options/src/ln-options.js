import { registerComponent, dispatch, defineAttrs, attrSpec, attrStr } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-options';
	const DOM_ATTRIBUTE = 'lnOptions';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-options':       { prop: '_storeName', type: 'string', read: attrStr, fallback: '', description: 'Store or coordinator addressing to populate options from' },
		'data-ln-options-value': { prop: '_valueField', type: 'string', read: attrStr, fallback: 'id', description: 'Field name used for option value attribute' },
		'data-ln-options-label': { prop: '_labelField', type: 'string', read: attrStr, fallback: 'name', description: 'Field name used for option visible label text' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// ─── Component ─────────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);

		const self = this;

		this._onSetData = function (e) {
			self._rebuild(e.detail.data || []);
		};
		dom.addEventListener('ln-options:set-data', this._onSetData);

		// Request initial data from coordinator
		dispatch(dom, 'ln-options:request-data', { options: this._storeName });

		return this;
	}

	_component.prototype._rebuild = function (records) {
		const dom = this.dom;
		const valueField = this._valueField;
		const labelField = this._labelField;

		// Preserve current selection
		const prev = dom.value;

		// Remove all non-placeholder options (keep option[value=""])
		const existing = dom.querySelectorAll('option');
		for (let i = existing.length - 1; i >= 0; i--) {
			if (existing[i].value !== '') {
				dom.removeChild(existing[i]);
			}
		}

		// Append one option per record
		for (let i = 0; i < records.length; i++) {
			const rec = records[i];
			const opt = document.createElement('option');
			opt.value = String(rec[valueField]);
			opt.textContent = rec[labelField] != null ? rec[labelField] : '';
			dom.appendChild(opt);
		}

		// Restore previous selection if still available
		const opts = dom.options;
		for (let i = 0; i < opts.length; i++) {
			if (opts[i].value === prev) {
				dom.value = prev;
				break;
			}
		}
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this.dom.removeEventListener('ln-options:set-data', this._onSetData);
		delete this.dom[DOM_ATTRIBUTE];
	};

	// ─── Init ──────────────────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-options', {
		attributes: ATTRIBUTES
	});
})();
