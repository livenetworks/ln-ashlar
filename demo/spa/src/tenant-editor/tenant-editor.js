(function () {
	'use strict';

	// Tenant form submit
	document.addEventListener('ln-form:submit', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="tenant-form"]');
		if (!form) return;
		const tenantsStoreEl = document.getElementById('tenants-store');
		if (!tenantsStoreEl) return;

		const data = Object.assign({}, e.detail.data);
		const id = data.id;
		delete data.id;
		if (id) {
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
				detail: { id: Number(id), data: data }
			}));
		} else {
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
		}
		window.lnRouter.navigate('/spa/tenants');
	});
})();
