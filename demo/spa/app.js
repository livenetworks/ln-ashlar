(function () {
	'use strict';

	// ─── Element refs (persistent shell elements) ───────────────────────
	const packagesStoreEl = document.getElementById('packages-store');
	const tenantsStoreEl = document.getElementById('tenants-store');
	const packageModal = document.getElementById('package-modal');
	const packageForm = document.getElementById('package-form');
	const tenantModal = document.getElementById('tenant-modal');
	const tenantCreateForm = document.getElementById('tenant-create-form');
	const offlineBanner = document.getElementById('offline-banner');
	const sidebar = document.getElementById('app-sidebar');
	const scrim = document.querySelector('.app-scrim');

	if (!packagesStoreEl || !tenantsStoreEl) {
		console.warn('[spa] Missing store elements — aborting');
		return;
	}

	function toast(type, title, message) {
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: { type: type, title: title, message: message }
		}));
	}

	// ─── 3. Presenters (store records stay raw; binder delivers decorated) ──
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

	// Attempt immediately, and retry on each store's first ready (once-guard)
	registerPresenters();
	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		storeEl.addEventListener('ln-store:ready', function () {
			if (!presentersRegistered) registerPresenters();
		}, { once: true });
	});

	// ─── Row-action listener (standalone, replaces factory per-store listeners) ──
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (d.table === 'packages') {
			if (d.action === 'delete') {
				const tStore = tenantsStoreEl.lnDataStore;
				tStore.count({ package_id: [String(d.record.id)] }).then(function (n) {
					if (n > 0) { toast('warn', 'Blocked', n + ' tenant(s) use this package'); return; }
					packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete',
						{ detail: { id: Number(d.record.id) } }));
				});
			}
		} else if (d.table === 'tenants') {
			if (d.action === 'edit') {
				window.lnRouter.navigate('/demo/spa/tenants/' + d.record.id);
			} else if (d.action === 'delete') {
				tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete',
					{ detail: { id: Number(d.record.id) } }));
			}
		}
	});

	// ─── 5. Packages view (modal editor) ────────────────────────────────
	packageForm.addEventListener('ln-form:submit', function (e) {
		const data = Object.assign({}, e.detail.data);
		const id = data.id;
		delete data.id;
		if (id) {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
				detail: { id: Number(id), data: data }
			}));
		} else {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
		}
		packageModal.setAttribute('data-ln-modal', 'close');
	});

	// ─── 6. Bulk delete (tenants) ───────────────────────────────────────
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#bulk-delete-tenants');
		if (!btn) return;
		const table = document.getElementById('tenants-table');
		if (!table || !table.lnTable) return;
		const ids = Array.from(table.lnTable.selectedIds).map(Number);
		if (!ids.length) return;
		tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-bulk-delete', {
			detail: { ids: ids }
		}));
	});

	// Tenant create modal — submit
	if (tenantCreateForm) {
		tenantCreateForm.addEventListener('ln-form:submit', function (e) {
			const data = Object.assign({}, e.detail.data);
			delete data.id;
			// ln-form-typed handles boolean coercion for checkboxes
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
			if (tenantModal) tenantModal.setAttribute('data-ln-modal', 'close');
		});
	}

	// ─── Join map: rebuild on packages events ───────────────────────────
	function onPackagesChanged() {
		rebuildPkgMap().then(function () {
			// NOTE: tenant rows' package_name presenter reads pkgNameById, but the tenants
			// coordinator only refreshes the tenants table on TENANTS store events. A package
			// rename leaves open tenant rows stale until the next tenants-store event. Accepted
			// (demo-grade): the only force-refresh paths are private component methods.
			refreshDashboardUsageIfMounted();
		});
	}
	['ready', 'loaded', 'confirmed'].forEach(function (ev) {
		packagesStoreEl.addEventListener('ln-store:' + ev, onPackagesChanged);
	});
	packagesStoreEl.addEventListener('ln-store:synced', function (e) {
		if (e.detail && e.detail.changed) onPackagesChanged();
	});

	// ─── 7. Tenant editor module ────────────────────────────────────────
	let tenantEditingId = null;
	let pendingFillId = null;

	function editorForm() {
		return document.querySelector('[data-ln-form="tenant-form"]');
	}

	function fillTenant(form, id) {
		tenantsStoreEl.lnDataStore.getById(id).then(function (record) {
			if (record) {
				pendingFillId = null;
				window.lnCore.lnFill(form, record);
				const titleEl = document.querySelector('[data-tenant-title]');
				if (titleEl) titleEl.textContent = record.name;
				document.title = record.name + ' — DocuFlow';
			} else if (tenantsStoreEl.lnDataStore && tenantsStoreEl.lnDataStore.isLoaded) {
				toast('warn', 'Not found', 'That tenant does not exist');
				window.lnRouter.replace('/demo/spa/tenants');
			} else {
				// Deep-link refresh: retry once the store finishes loading
				pendingFillId = id;
			}
		});
	}

	function mountEditor(id) {
		const form = editorForm();
		if (!form) return;
		pendingFillId = null;
		if (id == null || id === 'new') {
			tenantEditingId = null;
			window.lnCore.lnFill(form, null);
		} else {
			tenantEditingId = Number(id);
			fillTenant(form, Number(id));
		}
		// fill-before-options race is handled by the ln-options:set-data repair listener below.
	}

	// Deep-link retry: fill once the tenants store loads, if still mounted
	['ready', 'loaded'].forEach(function (ev) {
		tenantsStoreEl.addEventListener('ln-store:' + ev, function () {
			if (pendingFillId == null) return;
			const current = window.lnRouter.current();
			const pattern = current && current.route && current.route.pattern;
			if (pattern !== '/demo/spa/tenants/:id') { pendingFillId = null; return; }
			const form = editorForm();
			if (form) fillTenant(form, pendingFillId);
		});
	});

	// Repair listener: if ln-options finishes populating after lnForm.fill set the value,
	// restore the tenant's package_id into the now-populated select.
	document.addEventListener('ln-options:set-data', function (e) {
		if (tenantEditingId == null || e.target.value !== '') return;
		const form = editorForm();
		if (!form || !form.contains(e.target)) return;
		const store = tenantsStoreEl.lnDataStore;
		if (!store) return;
		store.getById(tenantEditingId).then(function (r) {
			if (r && e.target.value === '') e.target.value = String(r.package_id);
		});
	});

	// Tenant form submit (document-level: form is recreated per mount)
	document.addEventListener('ln-form:submit', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="tenant-form"]');
		if (!form) return;
		const data = Object.assign({}, e.detail.data);
		delete data.id;
		// ln-form-typed handles boolean coercion for checkboxes
		if (tenantEditingId != null) {
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
				detail: { id: tenantEditingId, data: data }
			}));
		} else {
			tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
		}
		window.lnRouter.navigate('/demo/spa/tenants');
	});

	// ─── 8. Dashboard module ────────────────────────────────────────────
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
		const pStore = packagesStoreEl.lnDataStore;
		const tStore = tenantsStoreEl.lnDataStore;
		if (!list || !pStore || !tStore) return;
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
	// VERIFY: _dashboard.scss depends on #dashboard.is-loading for the shimmer animation.
	// ln-stat removes is-loading from each <strong> individually; we remove the section
	// class once both stores are loaded so the shimmer CSS rule (.is-loading [data-ln-stat-value])
	// no longer applies to already-filled stats.
	let dashLoadCount = 0;
	function onDashStoreLoaded() {
		dashLoadCount++;
		if (dashLoadCount >= 2) {
			const dash = document.getElementById('dashboard');
			if (dash) dash.classList.remove('is-loading');
		}
	}

	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		['ready', 'loaded', 'confirmed'].forEach(function (ev) {
			storeEl.addEventListener('ln-store:' + ev, refreshDashboardUsageIfMounted);
		});
		storeEl.addEventListener('ln-store:synced', function (e) {
			if (e.detail && e.detail.changed) refreshDashboardUsageIfMounted();
		});
		storeEl.addEventListener('ln-store:loaded', onDashStoreLoaded, { once: true });
	});

	// ─── 9. Shell module ────────────────────────────────────────────────

	function closeDrawerIfMobile() {
		if (sidebar && scrim && getComputedStyle(scrim).display !== 'none') {
			sidebar.setAttribute('data-ln-toggle', 'close');
		}
	}

	// Reset demo data
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#reset-demo');
		if (!btn) return;
		fetch('/demo/docuflow/api/reset').then(function (r) {
			if (!r.ok) throw new Error('HTTP ' + r.status);
			forceSyncBoth();
			toast('success', 'Demo data', 'Demo data has been reset');
		}).catch(function () {
			toast('error', 'Demo data', 'Could not reset demo data');
		});
	});

	function forceSyncBoth() {
		if (packagesStoreEl.lnDataStore) packagesStoreEl.lnDataStore.forceSync();
		if (tenantsStoreEl.lnDataStore) tenantsStoreEl.lnDataStore.forceSync();
	}

	// Offline banner — wired to store events (store auto-resyncs on reconnection)
	document.addEventListener('ln-store:offline', function () {
		if (offlineBanner) offlineBanner.classList.remove('hidden');
	});
	document.addEventListener('ln-store:online', function () {
		if (offlineBanner) offlineBanner.classList.add('hidden');
	});

	// Reverted mutations → error toast (packages only; tenants via ln-store-notify)
	packagesStoreEl.addEventListener('ln-store:reverted', function (e) {
		const err = String((e.detail && e.detail.error) || '');
		if (err.indexOf('has_dependents') !== -1 || err.indexOf('dependents') !== -1) {
			toast('warn', 'Blocked', 'Tenants still use this package');
			return;
		}
		toast('error', 'Not saved', 'Change was rolled back — ' + (err || 'server rejected the change'));
	});

	// Confirmed mutations → success toast (packages only; tenants via ln-store-notify)
	packagesStoreEl.addEventListener('ln-store:confirmed', function (e) {
		const d = e.detail || {};
		if (d.action === 'delete') {
			toast('success', 'Deleted', 'Record removed');
		} else if (d.action === 'create') {
			toast('success', 'Saved', (d.record && d.record.name ? d.record.name : '') + ' created');
		} else {
			toast('success', 'Saved', (d.record && d.record.name ? d.record.name : '') + ' updated');
		}
	});

	// API connector errors → per-view error region
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

	// Retry: resync BOTH stores (a view may join across them)
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('[data-view-retry]');
		if (!btn) return;
		const region = btn.closest('[data-view-error]');
		if (region) region.setAttribute('hidden', '');
		forceSyncBoth();
	});

	// ─── 10. Router wiring ──────────────────────────────────────────────

	function mountRoute(state) {
		const pattern = state.route && state.route.pattern;
		if (pattern === '/demo/spa') {
			refreshDashboardUsageIfMounted();
		} else if (pattern === '/demo/spa/tenants/:id') {
			mountEditor(state.params.id);
		}
		// /demo/spa/packages and /demo/spa/tenants: binder + ln-stat self-serve, no JS mount.
	}

	document.addEventListener('ln-router:navigated', function (e) {
		closeDrawerIfMobile();
		mountRoute(e.detail);
	});

	// ln-nav (data-ln-nav="active" on <nav>) owns active link state.
	// Boot event is deferred one microtask — this listener receives it reliably.
})();
