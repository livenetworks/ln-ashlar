(function () {
	'use strict';

	function fillUsageItem(el, item) {
		const nameEl = el.querySelector('[data-pkg-usage-name]');
		const countEl = el.querySelector('[data-pkg-usage-count]');
		const barEl = el.querySelector('[data-ln-progress]');
		if (nameEl) nameEl.textContent = item.name;
		if (countEl) countEl.textContent = item.count;
		if (barEl) barEl.setAttribute('data-ln-progress', item.pct);
	}

	function renderUsage() {
		const list = document.querySelector('[data-pkg-usage]');
		const packagesStoreEl = document.getElementById('packages-store');
		const tenantsStoreEl = document.getElementById('tenants-store');
		if (!list || !packagesStoreEl || !tenantsStoreEl) return;
		const pStore = packagesStoreEl.lnDataStore;
		const tStore = tenantsStoreEl.lnDataStore;
		if (!pStore || !tStore) return;

		Promise.all([pStore.getAll({}), tStore.getAll({})]).then(function (results) {
			const counts = new Map();
			results[1].data.forEach(function (tn) {
				counts.set(tn.package_id, (counts.get(tn.package_id) || 0) + 1);
			});
			const totalTenants = results[1].data.length || 1;
			const items = results[0].data.map(function (p) {
				const n = counts.get(p.id) || 0;
				return {
					id: p.id,
					name: p.name,
					count: n,
					pct: Math.round((n / totalTenants) * 100)
				};
			});
			window.lnCore.renderList(
				list, items, 'pkg-usage-item',
				function (i) { return i.id; },
				fillUsageItem,
				'spa'
			);
		});
	}

	function refreshDashboardUsageIfMounted() {
		if (!document.getElementById('dashboard')) return;
		renderUsage();
	}

	// Dashboard is-loading removal: once both stores have data, remove #dashboard.is-loading
	let dashLoadCount = 0;
	function onDashStoreLoaded() {
		dashLoadCount++;
		if (dashLoadCount >= 2) {
			const dash = document.getElementById('dashboard');
			if (dash) dash.classList.remove('is-loading');
		}
	}

	App.defineView('/demo/spa', {
		mount: function () {
			refreshDashboardUsageIfMounted();
		},
		unmount: function () {}
	});

	// Register persistent store event listeners to auto-refresh the dashboard usage
	App.defineModule(function () {
		const packagesStoreEl = document.getElementById('packages-store');
		const tenantsStoreEl = document.getElementById('tenants-store');

		if (!packagesStoreEl || !tenantsStoreEl) return;

		[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
			['ready', 'loaded', 'confirmed'].forEach(function (ev) {
				storeEl.addEventListener('ln-store:' + ev, refreshDashboardUsageIfMounted);
			});
			storeEl.addEventListener('ln-store:synced', function (e) {
				if (e.detail && e.detail.changed) refreshDashboardUsageIfMounted();
			});
			storeEl.addEventListener('ln-store:loaded', onDashStoreLoaded, { once: true });
		});

		window.addEventListener('app:packages-rebuild', refreshDashboardUsageIfMounted);
	});
})();
