(function () {
	'use strict';

	function initData() {
		// Data mappers for packages and tenants
		if (window.lnCore && typeof window.lnCore.registerDataMapper === 'function') {
			window.lnCore.registerDataMapper('packages', {
				ingress: function (r) { return r; },
				egress: function (r) {
					const out = Object.assign({}, r);
					if (out.id != null && out.id !== '') out.id = Number(out.id);
					if (out.price_monthly != null && out.price_monthly !== '') out.price_monthly = Number(out.price_monthly);
					if (out.max_users != null && out.max_users !== '') out.max_users = Number(out.max_users);
					if (out.storage_gb != null && out.storage_gb !== '') out.storage_gb = Number(out.storage_gb);
					if (Array.isArray(out.active)) out.active = out.active.length > 0;
					else if (out.active !== undefined) out.active = Boolean(out.active);
					return out;
				}
			});
			window.lnCore.registerDataMapper('tenants', {
				ingress: function (r) { return r; },
				egress: function (r) {
					const out = Object.assign({}, r);
					if (out.id != null && out.id !== '') out.id = Number(out.id);
					if (out.package_id != null && out.package_id !== '') out.package_id = Number(out.package_id);
					if (out.review_interval != null && out.review_interval !== '') out.review_interval = Number(out.review_interval);
					if (Array.isArray(out.active)) out.active = out.active.length > 0;
					else if (out.active !== undefined) out.active = Boolean(out.active);
					if (Array.isArray(out.read_confirmation)) out.read_confirmation = out.read_confirmation.length > 0;
					else if (out.read_confirmation !== undefined) out.read_confirmation = Boolean(out.read_confirmation);
					return out;
				}
			});
		}

		const packagesStoreEl = document.getElementById('packages');
		const tenantsStoreEl = document.getElementById('tenants');

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
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initData);
	} else {
		initData();
	}
})();
