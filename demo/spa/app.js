(function () {
	'use strict';

	// ─── 1. Data mappers (must register before stores boot) ────────────
	// Egress builds the COMPLETE typed payload (PUT is full replace).
	// Tolerant of both serialized-form shapes (checkbox arrays, string
	// numbers) and already-typed store records. Whitelist drops `id` and
	// any render-decorated fields.

	function toBool(v) {
		if (Array.isArray(v)) return v.length > 0;
		return v === true || v === 'true' || v === 1 || v === '1';
	}

	function toInt(v, fallback) {
		const n = Number(v);
		return Number.isFinite(n) ? n : fallback;
	}

	function packagePayload(r) {
		return {
			name: String(r.name || ''),
			max_users: toInt(r.max_users, 0),
			max_guests: toInt(r.max_guests, 0),
			max_standards: toInt(r.max_standards, 0),
			max_documents: toInt(r.max_documents, 0),
			max_storage: toInt(r.max_storage, 0),
			active: toBool(r.active)
		};
	}

	function tenantPayload(r) {
		return {
			name: String(r.name || ''),
			slug: String(r.slug || ''),
			custom_domain: String(r.custom_domain || ''),
			package_id: toInt(r.package_id, 0),
			auth_method: String(r.auth_method || 'Local'),
			doc_numbering_scheme: String(r.doc_numbering_scheme || '{TYPE}-{SEQ:4}'),
			review_interval: toInt(r.review_interval, 365),
			brand_primary: String(r.brand_primary || '#2563eb'),
			brand_secondary: String(r.brand_secondary || '#1e40af'),
			read_confirmation: toBool(r.read_confirmation),
			active: toBool(r.active)
		};
	}

	window.lnCore.registerDataMapper('packages', {
		ingress: function (r) { return r; },
		egress: packagePayload
	});

	window.lnCore.registerDataMapper('tenants', {
		ingress: function (r) { return r; },
		egress: tenantPayload
	});

	// ─── Element refs (persistent shell elements) ───────────────────────
	const packagesStoreEl = document.getElementById('packages-store');
	const tenantsStoreEl = document.getElementById('tenants-store');
	const packageModal = document.getElementById('package-modal');
	const packageForm = document.getElementById('package-form');
	const packageTitle = document.getElementById('package-modal-title');
	const offlineBanner = document.getElementById('offline-banner');
	const sidebar = document.getElementById('app-sidebar');
	const scrim = document.querySelector('.app-scrim');

	if (!packagesStoreEl || !tenantsStoreEl) {
		console.warn('[spa] Missing store elements — aborting');
		return;
	}

	// ─── 2. Dictionary (all user-facing strings live in index.html) ────
	// lnCore.buildDict is ESM-only (not on window.lnCore) — local reader.
	const dict = (function () {
		const root = document.getElementById('spa-dict');
		const map = {};
		if (!root) return map;
		root.querySelectorAll('[data-spa-dict]').forEach(function (el) {
			map[el.getAttribute('data-spa-dict')] = el.textContent.trim();
		});
		root.remove();
		return map;
	})();

	function t(key, vars) {
		let s = dict[key] || key;
		if (vars) {
			Object.keys(vars).forEach(function (k) {
				s = s.replace('{' + k + '}', vars[k]);
			});
		}
		return s;
	}

	function toast(type, title, message) {
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: { type: type, title: title, message: message }
		}));
	}

	// ─── Store helpers ──────────────────────────────────────────────────
	// Live read of the store instance's loaded state — no flag/listener
	// ordering hazard, and covers the warm-cache boot where only
	// 'ln-store:ready' fires (stale="-1" → no 'loaded'/'synced').
	function storeLoaded(name) {
		const el = name === 'packages' ? packagesStoreEl : tenantsStoreEl;
		return !!(el.lnDataStore && el.lnDataStore.isLoaded);
	}

	// Status filter labels → raw store values (decision 2)
	const statusFilterMap = {};
	statusFilterMap[dict['status-active']] = 'true';
	statusFilterMap[dict['status-inactive']] = 'false';

	// ─── 3. Render decorators (store records stay raw) ─────────────────
	let pkgNameById = new Map();

	function decoratePackage(r) {
		return Object.assign({}, r, {
			status_display: r.active ? dict['status-active'] : dict['status-inactive'],
			status_class: r.active ? 'badge success' : 'badge neutral',
			max_users_display: r.max_users === 0 ? dict['unlimited'] : r.max_users
		});
	}

	function decorateTenant(r) {
		return Object.assign({}, r, {
			status_display: r.active ? dict['status-active'] : dict['status-inactive'],
			status_class: r.active ? 'badge success' : 'badge neutral',
			package_name: pkgNameById.get(r.package_id) || dict['no-package']
		});
	}

	function rebuildPkgMap() {
		const store = packagesStoreEl.lnDataStore;
		if (!store) return Promise.resolve();
		return store.getAll({}).then(function (r) {
			pkgNameById = new Map(r.data.map(function (p) { return [p.id, p.name]; }));
		});
	}

	// ─── 4. Entity view factory ─────────────────────────────────────────
	function makeEntityView(cfg) {
		// cfg: { name, storeEl, tableId, countSelector, decorate, onRowAction }
		let lastQuery = { sort: null, filters: {}, search: '' };

		function tableEl() {
			return document.getElementById(cfg.tableId);
		}

		function translateFilters(filters) {
			const f = Object.assign({}, filters || {});
			if (f.status_display) {
				const mapped = f.status_display
					.map(function (v) { return statusFilterMap[v]; })
					.filter(function (v) { return v !== undefined; });
				if (mapped.length) f.active = mapped;
				delete f.status_display;
			}
			return f;
		}

		function updateCount() {
			const store = cfg.storeEl.lnDataStore;
			const span = document.querySelector(cfg.countSelector);
			if (!store || !span) return;
			store.count().then(function (n) { span.textContent = n; });
		}

		function refresh() {
			// No set-data before first load — empty-state flash guard
			if (!storeLoaded(cfg.name)) return;
			const el = tableEl();
			const store = cfg.storeEl.lnDataStore;
			if (!el || !store) return;
			store.getAll({
				sort: lastQuery.sort,
				filters: translateFilters(lastQuery.filters),
				search: lastQuery.search
			}).then(function (r) {
				el.dispatchEvent(new CustomEvent('ln-table:set-data', {
					detail: { data: r.data.map(cfg.decorate), total: r.total, filtered: r.filtered }
				}));
			});
			updateCount();
		}

		['ready', 'loaded', 'created', 'updated', 'deleted', 'confirmed', 'reverted'].forEach(function (ev) {
			cfg.storeEl.addEventListener('ln-store:' + ev, refresh);
		});
		cfg.storeEl.addEventListener('ln-store:synced', function (e) {
			if (e.detail && e.detail.changed) refresh();
		});

		document.addEventListener('ln-table:request-data', function (e) {
			if (e.detail.table !== cfg.name) return;
			lastQuery = { sort: e.detail.sort, filters: e.detail.filters, search: e.detail.search };
			refresh();
		});

		document.addEventListener('ln-table:row-action', function (e) {
			if (e.detail.table !== cfg.name) return;
			cfg.onRowAction(e.detail);
		});

		function mount() {
			const el = tableEl();
			if (el && !storeLoaded(cfg.name)) {
				el.dispatchEvent(new CustomEvent('ln-table:set-loading', { detail: { loading: true } }));
			}
			refresh();
			updateCount();
		}

		return { refresh: refresh, mount: mount };
	}

	// ─── 5. Packages view (modal editor) ────────────────────────────────
	let pkgEditMode = false;
	let pkgEditingId = null;

	const packagesView = makeEntityView({
		name: 'packages',
		storeEl: packagesStoreEl,
		tableId: 'packages-table',
		countSelector: '[data-count-packages]',
		decorate: decoratePackage,
		onRowAction: function (detail) {
			if (detail.action === 'edit') {
				pkgEditMode = true;
				pkgEditingId = Number(detail.record.id);
				packageModal.setAttribute('data-ln-modal', 'open');
				packageForm.lnForm.fill(detail.record);
				packageTitle.textContent = packageTitle.dataset.titleEdit + ' — ' + detail.record.name;
			} else if (detail.action === 'delete') {
				// Client-side dependent guard before the server 422 kicks in
				const tStore = tenantsStoreEl.lnDataStore;
				tStore.count({ package_id: [String(detail.record.id)] }).then(function (n) {
					if (n > 0) {
						toast('warn', dict['blocked-title'], t('blocked', { count: n }));
						return;
					}
					packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
						detail: { id: Number(detail.record.id) }
					}));
				});
			}
		}
	});

	packageModal.addEventListener('ln-modal:before-open', function () {
		if (!pkgEditMode) {
			pkgEditingId = null;
			packageForm.lnForm.reset();
			packageTitle.textContent = packageTitle.dataset.titleNew;
		}
		pkgEditMode = false;
	});

	packageForm.addEventListener('ln-form:submit', function (e) {
		const data = packagePayload(e.detail.data);
		if (pkgEditingId != null) {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-update', {
				detail: { id: pkgEditingId, data: data }
			}));
		} else {
			packagesStoreEl.dispatchEvent(new CustomEvent('ln-store:request-create', {
				detail: { data: data }
			}));
		}
		packageModal.setAttribute('data-ln-modal', 'close');
	});

	// New-package buttons (header button + empty-state button)
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#new-package, [data-spa-empty-new]');
		if (!btn) return;
		pkgEditMode = false;
		packageModal.setAttribute('data-ln-modal', 'open');
	});

	// ─── 6. Tenants view (route editor + bulk delete) ───────────────────
	const tenantsView = makeEntityView({
		name: 'tenants',
		storeEl: tenantsStoreEl,
		tableId: 'tenants-table',
		countSelector: '[data-count-tenants]',
		decorate: decorateTenant,
		onRowAction: function (detail) {
			if (detail.action === 'edit') {
				window.lnRouter.navigate('/demo/spa/tenants/' + detail.record.id);
			} else if (detail.action === 'delete') {
				tenantsStoreEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
					detail: { id: Number(detail.record.id) }
				}));
			}
		}
	});

	// Bulk delete (ln-confirm releases the 2nd click)
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

	// Join map: rebuild on packages events, then re-render dependents
	function onPackagesChanged() {
		rebuildPkgMap().then(function () {
			tenantsView.refresh();
			refreshDashboardIfMounted();
			rebuildEditorOptionsIfMounted();
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
	let slugPristine = true;

	function editorForm() {
		return document.querySelector('[data-ln-form="tenant-form"]');
	}

	function rebuildPackageOptions(select) {
		const store = packagesStoreEl.lnDataStore;
		if (!store || !select) return Promise.resolve();
		return store.getAll({}).then(function (r) {
			const placeholder = select.querySelector('option[value=""]');
			const prevValue = select.value;
			window.lnCore.renderList(
				select, r.data, 'package-option',
				function (p) { return p.id; },
				function (el, p) {
					el.value = p.id;
					el.textContent = p.name;
				},
				'spa'
			);
			if (placeholder) select.prepend(placeholder);
			select.value = prevValue;
		});
	}

	function rebuildEditorOptionsIfMounted() {
		const form = editorForm();
		if (!form) return;
		rebuildPackageOptions(form.querySelector('[name="package_id"]'));
	}

	function fillTenant(form, id) {
		tenantsStoreEl.lnDataStore.getById(id).then(function (record) {
			if (record) {
				pendingFillId = null;
				form.lnForm.fill(record);
				slugPristine = true;
				const titleEl = document.querySelector('[data-tenant-title]');
				if (titleEl) titleEl.textContent = record.name;
				document.title = record.name + ' — DocuFlow';
			} else if (storeLoaded('tenants')) {
				toast('warn', dict['unknown-tenant-title'], dict['unknown-tenant']);
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
		slugPristine = true;
		pendingFillId = null;
		rebuildPackageOptions(form.querySelector('[name="package_id"]')).then(function () {
			if (id == null || id === 'new') {
				tenantEditingId = null;
				form.lnForm.reset();
			} else {
				tenantEditingId = Number(id);
				fillTenant(form, Number(id));
			}
		});
	}

	// Deep-link retry: fill once the tenants store loads, if still mounted.
	// 'ready' covers the warm-cache boot where 'loaded' never fires.
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

	// Auto-slugify (decision 8): only trusted user input moves the flag
	function slugify(s) {
		return String(s).toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/-+/g, '-')
			.replace(/^-|-$/g, '');
	}

	document.addEventListener('input', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="tenant-form"]');
		if (!form || !e.isTrusted) return;
		if (e.target.name === 'slug') {
			slugPristine = false;
			return;
		}
		if (e.target.name === 'name' && slugPristine) {
			const slugInput = form.querySelector('[name="slug"]');
			if (slugInput) {
				slugInput.value = slugify(e.target.value);
				slugInput.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
	});

	// Tenant form submit (document-level: form is recreated per mount)
	document.addEventListener('ln-form:submit', function (e) {
		const form = e.target.closest && e.target.closest('[data-ln-form="tenant-form"]');
		if (!form) return;
		const data = tenantPayload(e.detail.data);
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

	function fillStats() {
		const dash = document.getElementById('dashboard');
		if (!dash) return;
		const pStore = packagesStoreEl.lnDataStore;
		const tStore = tenantsStoreEl.lnDataStore;
		if (!pStore || !tStore) return;
		Promise.all([
			pStore.count(),
			tStore.count(),
			tStore.count({ active: ['true'] }),
			pStore.count({ active: ['true'] })
		]).then(function (counts) {
			const set = function (stat, value) {
				const el = dash.querySelector('[data-stat="' + stat + '"]');
				if (el) el.textContent = value;
			};
			set('packages', counts[0]);
			set('tenants', counts[1]);
			set('tenants-active', counts[2]);
			set('packages-active', counts[3]);
			if (storeLoaded('packages') && storeLoaded('tenants')) {
				dash.classList.remove('is-loading');
			}
		});
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

	function refreshDashboardIfMounted() {
		if (!document.getElementById('dashboard')) return;
		fillStats();
		renderUsage();
	}

	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		['ready', 'loaded', 'confirmed'].forEach(function (ev) {
			storeEl.addEventListener('ln-store:' + ev, refreshDashboardIfMounted);
		});
		storeEl.addEventListener('ln-store:synced', function (e) {
			if (e.detail && e.detail.changed) refreshDashboardIfMounted();
		});
	});

	// ─── 9. Shell module ────────────────────────────────────────────────

	// Hand-rolled nav active state (decision 1) — exact match for the
	// dashboard link, prefix match for section links.
	function updateNav(path) {
		document.querySelectorAll('#app-sidebar nav a').forEach(function (a) {
			const href = a.getAttribute('href');
			const active = href === '/demo/spa'
				? (path === '/demo/spa' || path === '/demo/spa/')
				: (path === href || path.indexOf(href + '/') === 0);
			if (active) {
				a.setAttribute('aria-current', 'page');
			} else {
				a.removeAttribute('aria-current');
			}
		});
	}

	// Mobile drawer (decision 10): CSS owns the breakpoint — the scrim is
	// display:none on desktop, so its computed display is the mobile probe.
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
			toast('success', dict['reset-title'], dict['reset-done']);
		}).catch(function () {
			toast('error', dict['reset-title'], dict['reset-failed']);
		});
	});

	function forceSyncBoth() {
		if (packagesStoreEl.lnDataStore) packagesStoreEl.lnDataStore.forceSync();
		if (tenantsStoreEl.lnDataStore) tenantsStoreEl.lnDataStore.forceSync();
	}

	// Offline banner (decision 5) — mutations are ROLLED BACK while
	// offline; the lib has no offline queue.
	window.addEventListener('offline', function () {
		if (offlineBanner) offlineBanner.classList.remove('hidden');
	});
	window.addEventListener('online', forceSyncBoth);

	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		['ready', 'loaded', 'synced', 'confirmed'].forEach(function (ev) {
			storeEl.addEventListener('ln-store:' + ev, function () {
				if (offlineBanner) offlineBanner.classList.add('hidden');
			});
		});
	});

	// Reverted mutations → error toast (server 422 dependents mapped to
	// the same wording as the client guard)
	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		storeEl.addEventListener('ln-store:reverted', function (e) {
			const err = String((e.detail && e.detail.error) || '');
			if (err.indexOf('has_dependents') !== -1 || err.indexOf('dependents') !== -1) {
				toast('warn', dict['blocked-title'], dict['blocked-server']);
				return;
			}
			toast('error', dict['reverted-title'], t('reverted', { error: err || dict['reverted-unknown'] }));
		});
	});

	// Confirmed mutations → success toast
	[packagesStoreEl, tenantsStoreEl].forEach(function (storeEl) {
		storeEl.addEventListener('ln-store:confirmed', function (e) {
			const d = e.detail || {};
			if (d.ids) {
				toast('success', dict['deleted-title'], t('bulk-deleted', { count: d.ids.length }));
			} else if (d.action === 'delete') {
				toast('success', dict['deleted-title'], dict['deleted']);
			} else if (d.action === 'create') {
				toast('success', dict['saved-title'], t('saved-create', { name: (d.record && d.record.name) || '' }));
			} else {
				toast('success', dict['saved-title'], t('saved-update', { name: (d.record && d.record.name) || '' }));
			}
		});
	});

	// Boot watchdog: known lib gap — a failed sync is silent. If a view is
	// mounted and its store never reached ready/loaded within 6s, surface
	// the per-view error region.
	let watchdogTimer = null;

	function armWatchdog(storeNames) {
		clearTimeout(watchdogTimer);
		watchdogTimer = setTimeout(function () {
			const allLoaded = storeNames.every(storeLoaded);
			if (allLoaded) return;
			const region = document.querySelector('[data-view-error]');
			if (region) region.removeAttribute('hidden');
		}, 6000);
	}

	// Retry: resync BOTH stores (a view may join across them)
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('[data-view-retry]');
		if (!btn) return;
		const region = btn.closest('[data-view-error]');
		if (region) region.setAttribute('hidden', '');
		forceSyncBoth();
	});

	// ─── 10. Router wiring ──────────────────────────────────────────────
	// Single mount dispatch shared by the navigated handler and boot.
	// Without View Transitions the router renders the initial route
	// synchronously during bundle boot — before this script registers its
	// listener — so boot must replay the mount from lnRouter.current().
	// No same-path dedupe inside mountRoute: the router re-clones the
	// template on EVERY navigated (incl. re-clicking the active link), so
	// each event needs a fresh mount. Only the boot replay is deduped.
	let navigatedFired = false;

	function mountRoute(state) {
		const path = state.path.split('?')[0];
		updateNav(path.replace(/\/+$/, '') || '/');

		const pattern = state.route && state.route.pattern;
		if (pattern === '/demo/spa') {
			refreshDashboardIfMounted();
			armWatchdog(['packages', 'tenants']);
		} else if (pattern === '/demo/spa/packages') {
			packagesView.mount();
			armWatchdog(['packages']);
		} else if (pattern === '/demo/spa/tenants') {
			tenantsView.mount();
			armWatchdog(['tenants']);
		} else if (pattern === '/demo/spa/tenants/new') {
			mountEditor(null);
		} else if (pattern === '/demo/spa/tenants/:id') {
			mountEditor(state.params.id);
		}
	}

	document.addEventListener('ln-router:navigated', function (e) {
		navigatedFired = true;
		closeDrawerIfMobile();
		mountRoute(e.detail);
	});

	// Boot: drawer must not start open on mobile; mount the current route
	// if the router already resolved it (sync initial render — no VT).
	// Under View Transitions current() is still null here and the
	// navigated listener above handles the async initial render.
	closeDrawerIfMobile();
	const booted = window.lnRouter && window.lnRouter.current();
	if (booted && !navigatedFired) {
		mountRoute(booted);
	} else if (!booted && !navigatedFired && window.lnRouter) {
		// Router boots on the FIRST template registration and resolves the
		// URL before the remaining routes exist — deep links can miss
		// (docuflow masked this with its not-found redirect hack). Re-resolve
		// against the now-complete registry; same path, so the deep link is
		// lossless. The resulting navigated event mounts the view.
		window.lnRouter.replace(window.location.pathname + window.location.search);
	}
})();
