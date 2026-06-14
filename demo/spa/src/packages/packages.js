(function () {
	'use strict';

	// Package modal form submit handler
	document.addEventListener('ln-form:submit', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="package-form"]');
		if (!form) return;
		const packagesStoreEl = document.getElementById('packages-store');
		if (!packagesStoreEl) return;

		const data = Object.assign({}, e.detail.data);
		const id = data.id;
		delete data.id;
		if (id) {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
				detail: { id: Number(id), data: data }
			}));
		} else {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
		}
		const packageModal = document.getElementById('package-modal');
		if (packageModal) packageModal.setAttribute('data-ln-modal', 'close');
	});

	// Listen to packages table row action (specifically 'delete')
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'packages' && d.action === 'delete') {
			const packagesStoreEl = document.getElementById('packages-store');
			if (!packagesStoreEl) return;
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
				detail: { id: Number(d.record.id) }
			}));
		}
	});
})();
