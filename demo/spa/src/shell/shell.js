(function () {
	'use strict';

	App.defineModule(function () {
		const sidebar = document.getElementById('app-sidebar');
		const scrim = document.querySelector('.app-scrim');
		const offlineBanner = document.getElementById('offline-banner');

		function closeDrawerIfMobile() {
			if (sidebar && scrim && getComputedStyle(scrim).display !== 'none') {
				sidebar.setAttribute('data-ln-toggle', 'close');
			}
		}

		// Close mobile sidebar drawer after navigating
		document.addEventListener('ln-router:navigated', function () {
			closeDrawerIfMobile();
		});

		// Helper to force sync both stores
		function forceSyncBoth() {
			const packagesStoreEl = document.getElementById('packages-store');
			const tenantsStoreEl = document.getElementById('tenants-store');
			if (packagesStoreEl && packagesStoreEl.lnDataStore) packagesStoreEl.lnDataStore.forceSync();
			if (tenantsStoreEl && tenantsStoreEl.lnDataStore) tenantsStoreEl.lnDataStore.forceSync();
		}

		// Reset demo data trigger
		document.addEventListener('click', function (e) {
			const btn = e.target.closest('#reset-demo');
			if (!btn) return;
			fetch('/docuflow/api/reset').then(function (r) {
				if (!r.ok) throw new Error('HTTP ' + r.status);
				forceSyncBoth();
				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: { type: 'success', title: 'Demo data', message: 'Demo data has been reset' }
				}));
			}).catch(function () {
				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: { type: 'error', title: 'Demo data', message: 'Could not reset demo data' }
				}));
			});
		});

		// Offline banner logic wired to store offline/online events
		document.addEventListener('ln-store:offline', function () {
			if (offlineBanner) offlineBanner.classList.remove('hidden');
		});
		document.addEventListener('ln-store:online', function () {
			if (offlineBanner) offlineBanner.classList.add('hidden');
		});

		// API connector error display
		document.addEventListener('ln-api-connector:error', function (e) {
			const msg = (e.detail && e.detail.error) || 'Unknown error';
			const status = (e.detail && e.detail.status) || '';
			const region = document.querySelector('[data-view-error]');
			if (region) {
				const msgEl = region.querySelector('[data-view-error-msg]');
				if (msgEl) msgEl.textContent = (status ? status + ' — ' : '') + msg;
				region.removeAttribute('hidden');
			}
		});

		// View error retry trigger
		document.addEventListener('click', function (e) {
			const btn = e.target.closest('[data-view-retry]');
			if (!btn) return;
			const region = btn.closest('[data-view-error]');
			if (region) region.setAttribute('hidden', '');
			forceSyncBoth();
		});
	});
})();
