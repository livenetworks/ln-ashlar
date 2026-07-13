import { } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnFill';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// data-ln-fill-store is RESERVED for a future store-source seam.
	// When implemented, the click handler will look up a record from a named
	// store (e.g. window.lnCore stores) instead of reading flat data-* attributes.
	const RESERVED = { lnFillForm: true, lnFillStore: true };

	document.addEventListener('click', function (e) {
		if (e.ctrlKey || e.metaKey || e.button === 1) return;

		const trigger = e.target.closest('[data-ln-fill-form]');
		if (!trigger) return;
		// No e.preventDefault() — the same click may also be handled by
		// [data-ln-modal-for] listener in ln-modal. Leave it alone.

		const formId = trigger.getAttribute('data-ln-fill-form');
		const form = document.getElementById(formId);
		if (!form) return;

		// Build record from data-ln-fill-* dataset keys.
		// Dataset keys are camelCase: data-ln-fill-event-id → dataset.lnFillEventId
		// Strip the 'lnFill' prefix, lowercase first char → 'eventId'.
		const record = {};
		const ds = trigger.dataset;
		for (const key in ds) {
			if (!key.startsWith('lnFill')) continue;
			if (RESERVED[key]) continue;
			const suffix = key.slice(6); // e.g. 'EventId'
			if (!suffix) continue;
			record[suffix.charAt(0).toLowerCase() + suffix.slice(1)] = ds[key];
		}

		const hasKeys = Object.keys(record).length > 0;
		window.lnCore.lnFill(form, hasKeys ? record : null);
	});

	// Sentinel: boolean (not a constructor). Guards against double-binding
	// across inlined standalone bundles.
	window[DOM_ATTRIBUTE] = true;
})();
