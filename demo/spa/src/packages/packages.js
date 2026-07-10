(function () {
	'use strict';

	// Write path is now declarative (data-ln-form-scope="packages" on
	// #package-form) — the coordinator claims ln-form:submit-record itself.
	document.addEventListener('ln-form:submit-record', function (e) {
		if (e.detail.scope !== 'packages' || e.target.id !== 'package-form') return;
		const packageModal = document.getElementById('package-modal');
		if (packageModal) packageModal.setAttribute('data-ln-modal', 'close');
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
