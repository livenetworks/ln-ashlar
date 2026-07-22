(function () {
	'use strict';

	App.defineModule(function () {
		const packagesStoreEl = document.getElementById('packages-store');
		const tenantsStoreEl = document.getElementById('tenants-store');

		if (!packagesStoreEl || !tenantsStoreEl) {
			console.warn('[spa:data] Missing store elements — aborting');
			return;
		}

		let pkgNameById = new Map();

		function rebuildPkgMap() {
			const store = packagesStoreEl.lnDataStore;
			if (!store) return Promise.resolve();
			return store.getAll({}).then(function (r) {
				pkgNameById = new Map(r.data.map(function (p) { return [String(p.id), p.name]; }));
			});
		}

		let presentersRegistered = false;
		function registerPresenters() {
			const p = packagesStoreEl.lnDataStore;
			const t = tenantsStoreEl.lnDataStore;
			if (p) p.setPresenters({ computed: {
				status_display: function (r) { return r.active ? 'Active' : 'Inactive'; },
				status_class:   function (r) { return r.active ? 'badge success' : 'badge neutral'; },
				max_users_display: function (r) { return Number(r.max_users) === 0 ? 'Unlimited' : r.max_users; }
			}});
			if (t) t.setPresenters({ computed: {
				status_display: function (r) { return r.active ? 'Active' : 'Inactive'; },
				status_class:   function (r) { return r.active ? 'badge success' : 'badge neutral'; },
				package_name:   function (r) { return pkgNameById.get(String(r.package_id)) || '—'; }
			}});
			if (p && t) presentersRegistered = true;
		}

		// Register store computed presenters
		registerPresenters();
		[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
			storeEl.addEventListener('ln-data-store:ready', function () {
				if (!presentersRegistered) registerPresenters();
			}, { once: true });
		});

		// Join map: rebuild on packages events and dispatch custom rebuild event
		function onPackagesChanged() {
			rebuildPkgMap().then(function () {
				window.dispatchEvent(new CustomEvent('app:packages-rebuild'));
			});
		}

		['ready', 'loaded', 'confirmed'].forEach(function (ev) {
			packagesStoreEl.addEventListener('ln-data-store:' + ev, onPackagesChanged);
		});
		packagesStoreEl.addEventListener('ln-data-store:synced', function (e) {
			if (e.detail && e.detail.changed) onPackagesChanged();
		});
	});
})();
