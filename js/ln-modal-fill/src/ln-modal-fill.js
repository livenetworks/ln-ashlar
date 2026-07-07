import { } from '../../ln-core';

(function () {
	const DOM_ATTRIBUTE = 'lnModalFill';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// Reuse ln-fill's reserved set so the SAME source attributes produce the
	// SAME record whether driven by a click (ln-fill) or by a hash-param open
	// (this coordinator). data-ln-fill-id is NOT reserved → it becomes record.id.
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

	function _findSource(modal, param) {
		const escaped = (window.CSS && CSS.escape) ? CSS.escape(param) : param;
		const candidates = document.querySelectorAll('[data-ln-fill-id="' + escaped + '"]');
		if (candidates.length === 0) return null;
		// Prefer a source whose data-ln-fill-form resolves to a form INSIDE this
		// modal — disambiguates when several modals/tables share the page.
		for (let i = 0; i < candidates.length; i++) {
			const formId = candidates[i].getAttribute('data-ln-fill-form');
			if (formId) {
				const form = document.getElementById(formId);
				if (form && modal.contains(form)) return candidates[i];
			}
		}
		// Fallback: first match (single-modal pages, or sources whose
		// data-ln-fill-form is not modal-scoped).
		return candidates[0];
	}

	// Coordinator: bridges the ln-modal:open event contract to the ln-fill
	// attribute contract — no component import. On an EDIT-mode open (param
	// present) it fills the form from the matching [data-ln-fill-id] source;
	// on a NEW-mode open it dispatches a null fill so ln-form resets.
	document.addEventListener('ln-modal:open', function (e) {
		const detail = e.detail;
		if (!detail) return;
		// Only HASH modals carry a `param` key (null → new mode, value → edit).
		// Plain non-hash (no-id) modals omit the key entirely → opt out, no fill.
		if (!('param' in detail)) return;
		const modal = detail.target;
		if (!modal) return;

		const param = detail.param;
		if (param == null) {
			// New mode (bare #modal-id, param === null): dispatch a null fill so
			// ln-form runs reset() + _applyActionMode(null) — restore its base
			// action and clear _method (RESTful action routing) — and display
			// fillables clear. Without this, stale fields from a prior edit-mode
			// open would linger. lnFill(modal, null) reaches ln-form's ln-fill
			// listener with a null detail; no attribute or hash write.
			window.lnCore.lnFill(modal, null);
			return;
		}

		const source = _findSource(modal, param);
		if (!source) return;                // deep-link to a record not in the DOM → graceful no-op

		const record = _recordFrom(source);
		// Programmatic fill — NEVER a synthetic click on the source. The source
		// is the <a href="#id:param"> trigger (and may carry data-ln-modal-for);
		// a click would re-write the hash / re-fire modal-open / navigate.
		// lnFill only dispatches ln-fill CustomEvents to [data-ln-form] /
		// [data-ln-fillable] descendants, so the open modal stays open and the
		// hash is untouched.
		window.lnCore.lnFill(modal, record);
	});

	// Boolean sentinel (not a constructor) — global singleton, mirrors ln-fill.
	window[DOM_ATTRIBUTE] = true;
})();
