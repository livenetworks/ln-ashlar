(function () {
	'use strict';

	// Write path is native-first (data-ln-form-scope="packages" on
	// #package-form, which serves both create and edit via modal-mode) —
	// react to either store outcome by closing the modal.
	['ln-store:created', 'ln-store:updated'].forEach(function (ev) {
		document.addEventListener(ev, function (e) {
			if (e.detail.store !== 'packages') return;
			const packageModal = document.getElementById('package-modal');
			if (packageModal) packageModal.setAttribute('data-ln-modal', 'close');
		});
	});

	// Listen to packages table row action (specifically 'delete')
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'packages' && d.action === 'delete') {
			const packagesCoordEl = document.querySelector('[data-ln-data-coordinator="packages"]');
			if (!packagesCoordEl) return;
			packagesCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: Number(d.record.id) }
			}));
		}
	});
})();
