(function () {
	'use strict';

	function fillTenantEditor(id) {
		const tenantsStoreEl = document.getElementById('tenants');
		if (!tenantsStoreEl) return;

		function applyRecord(record) {
			if (!record) return;
			const form = document.getElementById('tenant-form');
			if (!form) return;
			if (window.lnCore && window.lnCore.lnFill) {
				window.lnCore.lnFill(form, record);
			}
			const titleEl = document.querySelector('[data-tenant-title]');
			if (titleEl) titleEl.textContent = 'Edit tenant — ' + record.name;
		}

		const store = tenantsStoreEl.lnDataStore;
		if (store) {
			(store.ready || Promise.resolve()).then(function () {
				return store.get(Number(id));
			}).then(applyRecord);
		}
	}

	// Route navigation to tenant editor: populate form with store record
	document.addEventListener('ln-router:navigated', function (e) {
		const pattern = e.detail && e.detail.route && e.detail.route.pattern;
		if (pattern !== '/spa/tenants/:id') return;

		const id = e.detail.params && e.detail.params.id;
		if (id) {
			fillTenantEditor(id);
		}
	});

	// If store loads after view was already mounted (e.g. direct deep-link load)
	document.addEventListener('DOMContentLoaded', function () {
		const tenantsStoreEl = document.getElementById('tenants');
		if (tenantsStoreEl) {
			tenantsStoreEl.addEventListener('ln-data-store:loaded', function () {
				const cur = window.lnRouter && window.lnRouter.current();
				if (cur && cur.route && cur.route.pattern === '/spa/tenants/:id' && cur.params && cur.params.id) {
					fillTenantEditor(cur.params.id);
				}
			});
		}
	});

	// Write path is native-first (data-ln-data-coordinator-scope="tenants" on
	// #tenant-form) — react to the store outcome instead of a form-level event.
	document.addEventListener('ln-data-store:updated', function (e) {
		if (e.detail.store !== 'tenants') return;
		window.lnRouter.navigate('/spa/tenants');
	});
})();
