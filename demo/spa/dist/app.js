/* ── module: _core/runtime.js ─────────────────────────── */
/* ──────────────────────────────────────────────────────────────────────────
 * _core/runtime.js — the starter's micro-runtime (loaded first; '_core' sorts
 * ahead of every lowercase module folder).
 *
 * It exposes window.App with two declarative registrars, built ONLY on the
 * public globals shipped by the ln-ashlar bundle:
 *
 *   App.defineModule(setup)            → persistent: runs once when the DOM is
 *                                        ready. For shell chrome, stores,
 *                                        modals, toasts, offline banners —
 *                                        anything that lives the whole session.
 *
 *   App.defineView(pattern, { mount, unmount })
 *                                      → transient: mount(ctx) when its route
 *                                        becomes active, unmount() when leaving.
 *                                        ctx = { target, params, query, path }.
 *
 * Why a runtime instead of ln-core's registerComponent? registerComponent is
 * an ESM export and is NOT on window.lnCore, so a plain (non-bundled) script
 * cannot call it. The route lifecycle below uses the ln-router:navigated event,
 * which IS public — keeping every module file concatenation-friendly.
 * ────────────────────────────────────────────────────────────────────────── */
(function () {
	'use strict';

	var views = [];     // { pattern, mount, unmount }
	var modules = [];    // persistent setup fns
	var active = null;   // currently mounted view record

	var App = {
		defineModule: function (setup) { modules.push(setup); },
		defineView: function (pattern, hooks) {
			views.push({ pattern: pattern, mount: hooks.mount, unmount: hooks.unmount });
		}
	};
	window.App = App;

	function safe(fn, label, arg) {
		if (!fn) return;
		try { fn(arg); } catch (err) { console.error('[App] ' + label + ' failed:', err); }
	}

	function onNavigated(e) {
		var pattern = e.detail.route && e.detail.route.pattern;

		// Tear down the outgoing view before mounting the incoming one.
		if (active && active.pattern !== pattern) {
			safe(active.unmount, 'unmount (' + active.pattern + ')');
		}
		active = null;

		for (var i = 0; i < views.length; i++) {
			if (views[i].pattern === pattern) {
				active = views[i];
				safe(active.mount, 'mount (' + pattern + ')', {
					target: e.detail.target,
					params: e.detail.params,
					query: e.detail.query,
					path: e.detail.path
				});
				return;
			}
		}
	}

	// ln-router defers its boot 'navigated' one microtask, so this listener —
	// attached from a <script defer> placed after the bundle — still receives it.
	document.addEventListener('ln-router:navigated', onNavigated);

	function bootModules() {
		for (var i = 0; i < modules.length; i++) safe(modules[i], 'module');
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', bootModules);
	} else {
		bootModules();
	}
})();

/* ── module: dashboard/dashboard.js ─────────────────────────── */
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

	App.defineView('/spa', {
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
				storeEl.addEventListener('ln-data-store:' + ev, refreshDashboardUsageIfMounted);
			});
			storeEl.addEventListener('ln-data-store:synced', function (e) {
				if (e.detail && e.detail.changed) refreshDashboardUsageIfMounted();
			});
			storeEl.addEventListener('ln-data-store:loaded', onDashStoreLoaded, { once: true });
		});

		window.addEventListener('app:packages-rebuild', refreshDashboardUsageIfMounted);
	});
})();

/* ── module: data/data.js ─────────────────────────── */
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

/* ── module: packages/packages.js ─────────────────────────── */
(function () {
	'use strict';

	// Write path is native-first (data-ln-form-scope="packages" on
	// #package-form, which serves both create and edit via modal-mode) —
	// react to either store outcome by closing the modal.
	['ln-data-store:created', 'ln-data-store:updated'].forEach(function (ev) {
		document.addEventListener(ev, function (e) {
			if (e.detail.store !== 'packages') return;
			const packageModal = document.getElementById('package-modal');
			if (packageModal) packageModal.setAttribute('data-ln-modal', 'close');
		});
	});

	// Listen to packages table row action (specifically 'delete')
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'packages' && d.action === 'delete') {
			const packagesCoordEl = document.querySelector('[data-ln-data-coordinator="packages"]');
			if (!packagesCoordEl) return;
			packagesCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: Number(d.record.id) }
			}));
		}
	});
})();

/* ── module: shell/shell.js ─────────────────────────── */
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
		document.addEventListener('ln-data-store:offline', function () {
			if (offlineBanner) offlineBanner.classList.remove('hidden');
		});
		document.addEventListener('ln-data-store:online', function () {
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

/* ── module: tenant-editor/tenant-editor.js ─────────────────────────── */
(function () {
	'use strict';

	// Write path is native-first (data-ln-form-scope="tenants" on
	// #tenant-form) — react to the store outcome instead of a form-level event.
	document.addEventListener('ln-data-store:updated', function (e) {
		if (e.detail.store !== 'tenants') return;
		window.lnRouter.navigate('/spa/tenants');
	});
})();

/* ── module: tenants/tenants.js ─────────────────────────── */
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
