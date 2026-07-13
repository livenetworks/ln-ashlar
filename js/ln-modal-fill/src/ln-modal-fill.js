import { } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnModalFill';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Coordinator: bridges the ln-modal:open event contract to the ln-fill
	// request contract — no component import. On open it dispatches an ln-fill:request
	// event on the modal with e.detail.id containing the hash param (null or string).
	document.addEventListener('ln-modal:open', function (e) {
		const detail = e.detail;
		if (!detail) return;
		// Only HASH modals carry a `param` key (null → new mode, value → edit).
		// Plain non-hash (no-id) modals omit the key entirely → opt out, no fill.
		if (!('param' in detail)) return;
		const modal = detail.target;
		if (!modal) return;

		modal.dispatchEvent(new CustomEvent('ln-fill:request', {
			bubbles: true,
			detail: { id: detail.param }
		}));
	});

	// Boolean sentinel (not a constructor) — global singleton, mirrors ln-fill.
	window[DOM_ATTRIBUTE] = true;
})();
