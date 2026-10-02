(function () {
	'use strict';

	// Write path is native-first (data-ln-data-coordinator-scope="packages" on
	// #package-form, which serves both create and edit via modal-mode) —
	// react to either store outcome by closing the modal.
	['ln-data-store:created', 'ln-data-store:updated'].forEach(function (ev) {
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
			const targetId = Number(d.id || (d.record && d.record.id));
			if (!targetId) return;

			// Pre-check: block deletion if tenants reference this package
			const tenantsStoreEl = document.querySelector('#tenants-coordinator [data-ln-data-store]');
			if (tenantsStoreEl && tenantsStoreEl.lnDataStore && typeof tenantsStoreEl.lnDataStore.count === 'function') {
				tenantsStoreEl.lnDataStore.count({ package_id: [targetId] }).then(function (n) {
					if (n > 0) {
						window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
							detail: {
								type: 'warning',
								title: 'Blocked',
								message: n + ' tenant' + (n !== 1 ? 's' : '') + ' use this package'
							}
						}));
						return;
					}
					const packagesCoordEl = document.querySelector('[data-ln-data-coordinator="packages"]');
					if (!packagesCoordEl) return;
					packagesCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
						detail: { id: targetId }
					}));
				});
				return;
			}

			const packagesCoordEl = document.querySelector('[data-ln-data-coordinator="packages"]');
			if (!packagesCoordEl) return;
			packagesCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: targetId }
			}));
		}
	});
})();
