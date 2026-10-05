(function () {
	'use strict';

	// 1. Table row action: delete single tenant
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (!d || d.table !== 'tenants' || d.action !== 'delete') return;

		const targetId = Number(d.id || (d.record && d.record.id));
		if (!targetId) return;

		const coord = document.getElementById('tenants-coordinator');
		if (coord) {
			coord.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: targetId }
			}));
		}
	});

	// 2. Toolbar action: bulk delete selected tenants
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#bulk-delete-tenants');
		if (!btn) return;

		const table = document.getElementById('tenants-table');
		const ids = Array.from((table && table.lnTable && table.lnTable.selectedIds) || []).map(Number);
		if (!ids.length) return;

		const coord = document.getElementById('tenants-coordinator');
		if (coord) {
			coord.dispatchEvent(new CustomEvent('ln-data-coordinator:request-bulk-delete', {
				detail: { ids: ids }
			}));
		}
	});

	// 3. React to store creation by closing the create modal
	document.addEventListener('ln-data-store:created', function (e) {
		if (e.detail && e.detail.store && e.detail.store !== 'tenants') return;
		const modal = document.getElementById('tenant-modal');
		if (modal) {
			modal.setAttribute('data-ln-modal', 'close');
		}
	});
})();
