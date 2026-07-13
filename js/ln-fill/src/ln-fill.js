import { } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnFill';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// data-ln-fill-store is RESERVED for a future store-source seam.
	// When implemented, the click handler will look up a record from a named
	// store (e.g. window.lnCore stores) instead of reading flat data-* attributes.
	const RESERVED = { lnFillForm: true, lnFillStore: true };

	function _recordFrom(source) {
		const record = {};
		const ds = source.dataset;
		for (const key in ds) {
			if (!key.startsWith('lnFill')) continue;
			if (RESERVED[key]) continue;
			const suffix = key.slice(6); // strip 'lnFill'
			if (!suffix) continue;
			record[suffix.charAt(0).toLowerCase() + suffix.slice(1)] = ds[key];
		}
		return record;
	}

	function _findSource(container, param) {
		const escaped = (window.CSS && CSS.escape) ? CSS.escape(param) : param;
		const candidates = document.querySelectorAll('[data-ln-fill-id="' + escaped + '"]');
		if (candidates.length === 0) return null;
		// Prefer a source whose data-ln-fill-form resolves to a form INSIDE container
		for (let i = 0; i < candidates.length; i++) {
			const formId = candidates[i].getAttribute('data-ln-fill-form');
			if (formId) {
				const form = document.getElementById(formId);
				if (form && container.contains(form)) return candidates[i];
			}
		}
		return candidates[0];
	}

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		const trigger = e.target.closest('[data-ln-fill-form]');
		if (!trigger) return;

		// Prevent double fill: if this trigger is a hash-bound anchor (e.g. href="#user-modal:142"),
		// we skip the click-based fill. The resulting hash change will trigger ln-modal:open,
		// and the ln-modal-fill coordinator will request the fill via ln-fill:request.
		const href = trigger.getAttribute('href');
		if (href && href.indexOf('#') !== -1) return;

		// No e.preventDefault() — the same click may also be handled by
		// [data-ln-modal-for] listener in ln-modal. Leave it alone.

		const formId = trigger.getAttribute('data-ln-fill-form');
		const form = document.getElementById(formId);
		if (!form) return;

		const record = _recordFrom(trigger);
		const hasKeys = Object.keys(record).length > 0;
		window.lnCore.lnFill(form, hasKeys ? record : null);
	});

	document.addEventListener('ln-fill:request', function (e) {
		const detail = e.detail;
		if (!detail) return;

		const target = e.target;
		const param = detail.id;

		if (param == null) {
			window.lnCore.lnFill(target, null);
			return;
		}

		const source = _findSource(target, param);
		if (!source) return;

		const record = _recordFrom(source);
		window.lnCore.lnFill(target, record);
	});

	// Sentinel: boolean (not a constructor). Guards against double-binding
	// across inlined standalone bundles.
	window[DOM_ATTRIBUTE] = true;
})();
