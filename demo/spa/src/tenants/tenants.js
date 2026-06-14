(function () {
	'use strict';

	// Tenant creation modal submit handler
	document.addEventListener('ln-form:submit', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="tenant-create"]');
		if (!form) return;
		const tenantsStoreEl = document.getElementById('tenants-store');
		if (!tenantsStoreEl) return;

		const data = Object.assign({}, e.detail.data);
		delete data.id;
		tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
			detail: { data: data }
		}));
		const tenantModal = document.getElementById('tenant-modal');
		if (tenantModal) tenantModal.setAttribute('data-ln-modal', 'close');
	});

	// Listen to tenants table row actions (delete)
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'tenants' && d.action === 'delete') {
			const tenantsStoreEl = document.getElementById('tenants-store');
			if (!tenantsStoreEl) return;
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
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
		const tenantsStoreEl = document.getElementById('tenants-store');
		if (!tenantsStoreEl) return;
		tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-bulk-delete', {
			detail: { ids: ids }
		}));
	});
})();
