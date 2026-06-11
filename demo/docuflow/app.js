(function () {
	'use strict';

	// ── Identity mappers (must register before stores sync) ────────────
	const identity = { ingress: r => r, egress: r => r };
	window.lnCore.registerDataMapper('packages', identity);
	window.lnCore.registerDataMapper('tenants', identity);

	// ── Store / table / modal element refs ────────────────────────────
	const packagesStoreEl = document.getElementById('packages-store');
	const tenantsStoreEl  = document.getElementById('tenants-store');

	if (!packagesStoreEl || !tenantsStoreEl) {
		console.warn('[docuflow] Missing store elements — aborting coordinator');
		return;
	}

	// ── Toasts ─────────────────────────────────────────────────────────
	const toast = (type, title, message) =>
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: { type, title, message }
		}));

	// ── Package name lookup map (rebuilt on packages load/sync) ───────
	let pkgNameById = new Map();

	function rebuildPkgMap() {
		packagesStoreEl.lnDataStore?.getAll({}).then(r => {
			pkgNameById = new Map(r.data.map(p => [p.id, p.name]));
			// Rebuild tenant package select options
			rebuildPackageSelect();
		});
	}

	function rebuildPackageSelect() {
		const select = document.getElementById('tenant-package-id');
		if (!select) return;
		// Keep placeholder option, remove the rest
		while (select.options.length > 1) select.remove(1);
		const tmpl = document.querySelector('[data-template="package-option"]');
		packagesStoreEl.lnDataStore?.getAll({}).then(r => {
			r.data.forEach(pkg => {
				let opt;
				if (tmpl) {
					opt = tmpl.content.cloneNode(true).querySelector('option');
				} else {
					opt = document.createElement('option');
				}
				opt.value = pkg.id;
				opt.textContent = pkg.name;
				select.appendChild(opt);
			});
		});
	}

	// Rebuild on packages store events
	['loaded', 'confirmed', 'synced'].forEach(ev =>
		packagesStoreEl.addEventListener(`ln-store:${ev}`, e => {
			// 'synced' only if changed
			if (ev === 'synced' && !e.detail?.changed) return;
			rebuildPkgMap();
		})
	);

	// ── Entity view factory ────────────────────────────────────────────
	function makeEntityView({ name, storeEl, tableId, formEl, modalEl, modalTitleEl, decorate, newBtnId }) {
		let lastQuery = { sort: null, filters: {}, search: '' };
		let editMode = false;

		function getTableEl() {
			return document.getElementById(tableId);
		}

		function refresh() {
			const tableEl = getTableEl();
			if (!tableEl) return;
			storeEl.lnDataStore?.getAll(lastQuery).then(r => {
				tableEl.dispatchEvent(new CustomEvent('ln-table:set-data', {
					bubbles: true,
					detail: { data: r.data.map(decorate), total: r.total, filtered: r.filtered }
				}));
			});
		}

		// Store events → refresh
		['ready', 'loaded', 'created', 'updated', 'deleted', 'confirmed', 'reverted'].forEach(ev =>
			storeEl.addEventListener(`ln-store:${ev}`, refresh)
		);
		storeEl.addEventListener('ln-store:synced', e => e.detail?.changed && refresh());

		// Table request-data
		document.addEventListener('ln-table:request-data', e => {
			if (e.detail.table !== name) return;
			lastQuery = { sort: e.detail.sort, filters: e.detail.filters, search: e.detail.search };
			refresh();
		});

		// Row actions
		document.addEventListener('ln-table:row-action', e => {
			if (e.detail.table !== name) return;
			if (e.detail.action === 'edit') {
				editMode = true;
				formEl.lnForm.fill(e.detail.record);
				if (modalTitleEl) modalTitleEl.textContent = `Edit ${name.slice(0, -1)}`;
				modalEl.setAttribute('data-ln-modal', 'open');
			} else if (e.detail.action === 'delete') {
				handleDelete(e.detail);
			}
		});

		function handleDelete(detail) {
			if (name === 'packages') {
				// Pre-check: block if tenants reference this package
				tenantsStoreEl.lnDataStore?.count({ package_id: [detail.id] }).then(n => {
					if (n > 0) {
						toast('warning', 'Blocked', `${n} tenant${n !== 1 ? 's' : ''} use this package`);
						return;
					}
					storeEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
						detail: { id: Number(detail.id) }
					}));
				});
			} else {
				storeEl.dispatchEvent(new CustomEvent('ln-store:request-delete', {
					detail: { id: Number(detail.id) }
				}));
			}
		}

		// Modal before-open: reset form when not in edit mode
		modalEl.addEventListener('ln-modal:before-open', () => {
			if (!editMode) {
				formEl.lnForm.reset();
				if (modalTitleEl) modalTitleEl.textContent = `New ${name.slice(0, -1)}`;
			}
			editMode = false;
		});

		// Form submit → create or update
		formEl.addEventListener('ln-form:submit', e => {
			const data = Object.assign({}, e.detail.data);
			const id = data.id;
			delete data.id;
			const eventName = id ? 'ln-store:request-update' : 'ln-store:request-create';
			const evt = id
				? new CustomEvent(eventName, { detail: { id: Number(id), data } })
				: new CustomEvent(eventName, { detail: { data } });
			storeEl.dispatchEvent(evt);
			modalEl.setAttribute('data-ln-modal', 'close');
		});

		// New button: reset form first, then open
		document.addEventListener('click', e => {
			const btn = e.target.closest(`#${newBtnId}`);
			if (!btn) return;
			editMode = false;
			formEl.lnForm.reset();
			if (modalTitleEl) modalTitleEl.textContent = `New ${name.slice(0, -1)}`;
			modalEl.setAttribute('data-ln-modal', 'open');
		});

		// Toast events for this store
		storeEl.addEventListener('ln-store:confirmed', e =>
			toast('success', 'Saved', `${e.detail?.action || 'Change'} confirmed`)
		);
		storeEl.addEventListener('ln-store:reverted', e =>
			toast('error', 'Reverted', e.detail?.error || 'Server rejected the change')
		);
		storeEl.addEventListener('ln-store:offline', () =>
			toast('warning', 'Offline', 'Server unreachable — changes queued')
		);

		return { refresh };
	}

	// ── Packages decorator ─────────────────────────────────────────────
	const decoratePackage = r => Object.assign({}, r, {
		max_users_display: r.max_users === 0 ? 'Unlimited' : r.max_users,
		status_display: r.active ? 'Active' : 'Inactive'
	});

	// ── Tenants decorator ──────────────────────────────────────────────
	const decorateTenant = r => Object.assign({}, r, {
		package_name: pkgNameById.get(r.package_id) || '—',
		status_display: r.active ? 'Active' : 'Inactive'
	});

	// ── Package view ───────────────────────────────────────────────────
	const packageFormEl   = document.getElementById('package-form');
	const packageModalEl  = document.getElementById('package-modal');
	const packageTitleEl  = document.getElementById('package-modal-title');

	if (!packageFormEl || !packageModalEl) {
		console.warn('[docuflow] Missing package modal/form elements');
	}

	const packagesView = packageFormEl && packageModalEl
		? makeEntityView({
			name:         'packages',
			storeEl:      packagesStoreEl,
			tableId:      'packages-table',
			formEl:       packageFormEl,
			modalEl:      packageModalEl,
			modalTitleEl: packageTitleEl,
			decorate:     decoratePackage,
			newBtnId:     'new-package'
		})
		: { refresh: () => {} };

	// ── Tenant view ────────────────────────────────────────────────────
	const tenantFormEl   = document.getElementById('tenant-form');
	const tenantModalEl  = document.getElementById('tenant-modal');
	const tenantTitleEl  = document.getElementById('tenant-modal-title');

	if (!tenantFormEl || !tenantModalEl) {
		console.warn('[docuflow] Missing tenant modal/form elements');
	}

	const tenantsView = tenantFormEl && tenantModalEl
		? makeEntityView({
			name:         'tenants',
			storeEl:      tenantsStoreEl,
			tableId:      'tenants-table',
			formEl:       tenantFormEl,
			modalEl:      tenantModalEl,
			modalTitleEl: tenantTitleEl,
			decorate:     decorateTenant,
			newBtnId:     'new-tenant'
		})
		: { refresh: () => {} };

	// ── Active nav ─────────────────────────────────────────────────────
	function setActiveNav(path) {
		document.querySelectorAll('#app-sidebar nav a').forEach(a => {
			const href = a.getAttribute('href');
			if (href === path) {
				a.setAttribute('aria-current', 'page');
			} else {
				a.removeAttribute('aria-current');
			}
		});
	}

	// ── Dashboard fill ─────────────────────────────────────────────────
	function fillDashboard(target) {
		const set = (stat, value) => {
			const el = target?.querySelector?.(`[data-stat="${stat}"]`);
			if (el) el.textContent = value;
		};

		Promise.all([
			packagesStoreEl.lnDataStore?.count() ?? Promise.resolve(0),
			tenantsStoreEl.lnDataStore?.count() ?? Promise.resolve(0),
			tenantsStoreEl.lnDataStore?.count({ active: [true] }) ?? Promise.resolve(0),
			packagesStoreEl.lnDataStore?.count({ max_users: [0] }) ?? Promise.resolve(0)
		]).then(([pkgs, tenants, activeTenants, unlimitedPkgs]) => {
			set('packages', pkgs);
			set('tenants', tenants);
			set('tenants-active', activeTenants);
			set('packages-unlimited', unlimitedPkgs);
		});
	}

	// ── C1: redirect to dashboard when path matches no known route ────
	// Catches subdir initial load (not-found fires at boot) and any
	// runtime unmatched path. Guard against infinite loop with path check.
	document.body.addEventListener('ln-router:not-found', e => {
		if (e.detail?.path !== '/') {
			window.lnRouter.replace('/');
		}
	});

	// Boot-safety: if the router already finished boot before our listener
	// attached (defer ordering), current() is null on a no-match → redirect.
	window.addEventListener('load', () => {
		if (!window.lnRouter.current()) {
			window.lnRouter.replace('/');
		}
	});

	// ── W2: re-fill dashboard after stores finish loading/syncing ──────
	// fillDashboard reads count() from the live cache; on first load the
	// sync is still in flight when navigated fires → counts are 0.
	// Re-run once either store finishes, but only while dashboard is mounted.
	function refreshDashboardIfMounted() {
		const dashEl = document.getElementById('dashboard');
		if (dashEl) fillDashboard(dashEl);
	}

	[packagesStoreEl, tenantsStoreEl].forEach(storeEl => {
		storeEl.addEventListener('ln-store:loaded', refreshDashboardIfMounted);
		storeEl.addEventListener('ln-store:synced', e => {
			if (e.detail?.changed) refreshDashboardIfMounted();
		});
	});

	// ── Router: navigated ──────────────────────────────────────────────
	document.addEventListener('ln-router:navigated', e => {
		const pattern = e.detail.route?.pattern;
		const path    = e.detail.path;

		setActiveNav(path);

		if (pattern === '/packages') {
			packagesView.refresh();
		} else if (pattern === '/tenants') {
			tenantsView.refresh();
		} else if (pattern === '/') {
			fillDashboard(e.detail.target);
		}
	});

	// ── API connector errors → per-view error region ───────────────────
	document.addEventListener('ln-api-connector:error', e => {
		const msg    = e.detail?.error  || 'Unknown error';
		const status = e.detail?.status || '';

		// Only the mounted route's error region exists in live DOM
		// (the others are inside inert <template> nodes)
		const errorRegion = document.querySelector('[data-view-error]');
		if (errorRegion) {
			const msgEl = errorRegion.querySelector('[data-view-error-msg]');
			if (msgEl) msgEl.textContent = `${status ? status + ' — ' : ''}${msg}`;
			errorRegion.removeAttribute('hidden');
		}
	});

	// Single delegated retry handler — bound once, never stacks
	document.addEventListener('click', e => {
		const btn = e.target.closest('[data-view-retry]');
		if (!btn) return;

		const errorRegion = btn.closest('[data-view-error]');
		if (errorRegion) errorRegion.setAttribute('hidden', '');

		// Determine which store to retry from the current route pattern
		const pattern = window.lnRouter.current()?.route?.pattern;
		const storeToRetry = pattern === '/tenants' ? tenantsStoreEl : packagesStoreEl;
		storeToRetry.lnDataStore?.forceSync();
	});

})();
