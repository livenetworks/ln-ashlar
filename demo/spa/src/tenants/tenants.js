(function () {
	'use strict';

	// Write path is native-first (data-ln-form-scope="tenants" on
	// #tenant-create-form) — ln-data-coordinator claims the native submit;
	// react to the store outcome instead of a form-level event.
	document.addEventListener('ln-data-store:created', function (e) {
		if (e.detail.store !== 'tenants') return;
		const tenantModal = document.getElementById('tenant-modal');
		if (tenantModal) tenantModal.setAttribute('data-ln-modal', 'close');
	});

	// Listen to tenants table row actions (delete)
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'tenants' && d.action === 'delete') {
			const tenantsCoordEl = document.querySelector('[data-ln-data-coordinator="tenants"]');
			if (!tenantsCoordEl) return;
			tenantsCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: Number(d.record.id) }
			}));
		}
	});

	// Bulk delete tenants trigger
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#bulk-delete-tenants');
		if (!btn) return;
		const table = document.getElementById('tenants-table');
		if (!table || !table.lnTable) return;
		const ids = Array.from(table.lnTable.selectedIds).map(Number);
		if (!ids.length) return;
		const tenantsCoordEl = document.querySelector('[data-ln-data-coordinator="tenants"]');
		if (!tenantsCoordEl) return;
		tenantsCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-bulk-delete', {
			detail: { ids: ids }
		}));
	});
})();
