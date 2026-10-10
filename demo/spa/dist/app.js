/* ── module: dashboard/dashboard.js ─────────────────────────── */
(function () {
	'use strict';

	const DOM_SELECTOR = 'data-docuflow-dashboard';
	const DOM_ATTRIBUTE = 'docuflowDashboard';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function fillUsageItem(el, item) {
		const nameEl = el.querySelector('[data-pkg-usage-name]');
		const countEl = el.querySelector('[data-pkg-usage-count]');
		const barEl = el.querySelector('[data-ln-progress]');
		if (nameEl) nameEl.textContent = item.name;
		if (countEl) countEl.textContent = item.count;
		if (barEl) barEl.setAttribute('data-ln-progress', item.pct);
	}

	function renderUsage(dom) {
		const list = dom.querySelector('[data-pkg-usage]');
		const packagesStoreEl = document.getElementById('packages');
		const tenantsStoreEl = document.getElementById('tenants');
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

	function DocuflowDashboard(dom) {
		this.dom = dom;
		this.dom[DOM_ATTRIBUTE] = this;

		this._onStoreMutation = () => renderUsage(this.dom);

		const pStoreEl = document.getElementById('packages');
		const tStoreEl = document.getElementById('tenants');

		this._checkLoaded = () => {
			if (pStoreEl?.lnDataStore?.isLoaded && tStoreEl?.lnDataStore?.isLoaded) {
				this.dom.classList.remove('is-loading');
			}
		};

		[pStoreEl, tStoreEl].forEach(storeEl => {
			if (!storeEl) return;
			storeEl.addEventListener('ln-data-store:synced', this._onStoreMutation);
			storeEl.addEventListener('ln-data-store:ready', this._onStoreMutation);
			storeEl.addEventListener('ln-data-store:loaded', this._checkLoaded);
		});

		window.addEventListener('app:packages-rebuild', this._onStoreMutation);

		this._checkLoaded();
		renderUsage(this.dom);
	}

	DocuflowDashboard.prototype.destroy = function () {
		const pStoreEl = document.getElementById('packages');
		const tStoreEl = document.getElementById('tenants');

		[pStoreEl, tStoreEl].forEach(storeEl => {
			if (!storeEl) return;
			storeEl.removeEventListener('ln-data-store:synced', this._onStoreMutation);
			storeEl.removeEventListener('ln-data-store:ready', this._onStoreMutation);
			storeEl.removeEventListener('ln-data-store:loaded', this._checkLoaded);
		});

		window.removeEventListener('app:packages-rebuild', this._onStoreMutation);
		delete this.dom[DOM_ATTRIBUTE];
	};

	window[DOM_ATTRIBUTE] = DocuflowDashboard;

	if (window.lnCore && window.lnCore.registerComponent) {
		window.lnCore.registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, DocuflowDashboard, 'docuflow-dashboard');
	}
})();

/* ── module: data/data.js ─────────────────────────── */
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

/* ── module: packages/packages.js ─────────────────────────── */
(function () {
	'use strict';

	const DOM_ATTRIBUTE = 'packagesCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Packages Coordinator (Layer 2) ─────────────────────
	function PackagesCoordinator(dom) {
		this.dom = dom;
		this.dom[DOM_ATTRIBUTE] = this;
		this._bindEvents();
		return this;
	}

	PackagesCoordinator.prototype._bindEvents = function () {
		const self = this;

		// 1. Table row action: delete package (with tenant reference pre-check)
		// Scoped to this.dom subtree (bubbles from ln-table up to coordinator host)
		this._onRowAction = function (e) {
			const d = e.detail;
			if (!d || d.table !== 'packages' || d.action !== 'delete') return;

			const targetId = Number(d.id || (d.record && d.record.id));
			if (!targetId) return;

			// Pre-check: query tenants store to block deletion if tenants reference this package
			const tenantsStoreEl = document.getElementById('tenants');
			if (tenantsStoreEl && tenantsStoreEl.lnDataStore && typeof tenantsStoreEl.lnDataStore.count === 'function') {
				tenantsStoreEl.lnDataStore.count({ package_id: [targetId] }).then(function (n) {
					if (n > 0) {
						window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
							detail: {
								type: 'warning',
								title: 'Blocked',
								message: n + ' tenant' + (n !== 1 ? 's' : '') + ' use this package'
							}
						}));
						return;
					}
					self._requestDelete(targetId);
				});
				return;
			}

			self._requestDelete(targetId);
		};

		this.dom.addEventListener('ln-table:row-action', this._onRowAction);

		// 2. React to package store mutation by closing the package modal
		this._onStoreMutation = function (e) {
			if (e.detail && e.detail.store && e.detail.store !== 'packages') return;
			const packageModal = document.getElementById('package-modal');
			if (packageModal) {
				packageModal.setAttribute('data-ln-modal', 'close');
			}
		};

		const packagesStore = document.getElementById('packages');
		if (packagesStore) {
			packagesStore.addEventListener('ln-data-store:created', this._onStoreMutation);
			packagesStore.addEventListener('ln-data-store:updated', this._onStoreMutation);
		}
	};

	PackagesCoordinator.prototype._requestDelete = function (id) {
		const packagesCoordEl = document.getElementById('packages-coordinator') || document.querySelector('[data-ln-data-coordinator="packages"]');
		if (!packagesCoordEl) return;
		packagesCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
			detail: { id: id }
		}));
	};

	// ─── Destroy (Teardown Lifecycle) ───────────────────────
	PackagesCoordinator.prototype.destroy = function () {
		if (this._onRowAction) {
			this.dom.removeEventListener('ln-table:row-action', this._onRowAction);
			this._onRowAction = null;
		}

		const packagesStore = document.getElementById('packages');
		if (packagesStore && this._onStoreMutation) {
			packagesStore.removeEventListener('ln-data-store:created', this._onStoreMutation);
			packagesStore.removeEventListener('ln-data-store:updated', this._onStoreMutation);
			this._onStoreMutation = null;
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	window[DOM_ATTRIBUTE] = PackagesCoordinator;

	if (window.lnCore && window.lnCore.registerComponent) {
		window.lnCore.registerComponent('data-packages-coordinator', DOM_ATTRIBUTE, PackagesCoordinator, 'packages-coordinator');
	}
})();

/* ── module: shell/shell.js ─────────────────────────── */
(function () {
	'use strict';

	function initShell() {
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
			const packagesStoreEl = document.getElementById('packages');
			const tenantsStoreEl = document.getElementById('tenants');
			if (packagesStoreEl && packagesStoreEl.lnDataStore) packagesStoreEl.lnDataStore.fullReload();
			if (tenantsStoreEl && tenantsStoreEl.lnDataStore) tenantsStoreEl.lnDataStore.fullReload();
		}

		// Reset demo data trigger
		document.addEventListener('click', function (e) {
			const btn = e.target.closest('#reset-demo');
			if (!btn) return;
			fetch('../docuflow/api/reset').then(function (r) {
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
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', initShell);
	} else {
		initShell();
	}
})();

/* ── module: tenant-editor/tenant-editor.js ─────────────────────────── */
(function () {
	'use strict';

	const DOM_SELECTOR = 'data-docuflow-tenant-editor';
	const DOM_ATTRIBUTE = 'docuflowTenantEditor';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	/**
	 * Per-project Route Coordinator for Tenant Editor.
	 * Mounted automatically on <section id="tenant-editor" data-docuflow-tenant-editor>
	 * by ln-core lifecycle MutationObserver when the route view is rendered.
	 */
	function DocuflowTenantEditor(dom) {
		this.dom = dom;
		this.dom[DOM_ATTRIBUTE] = this;

		const match = window.location.pathname.match(/\/tenants\/(\d+)/);
		this.tenantId = match ? Number(match[1]) : null;

		this._bindEvents();
		this.loadRecord();
	}

	DocuflowTenantEditor.prototype.loadRecord = function () {
		const store = document.getElementById('tenants').lnDataStore;
		store.getById(this.tenantId).then(record => {
			if (record) window.lnCore.lnFill(this.dom, record);
		});
	};

	DocuflowTenantEditor.prototype._bindEvents = function () {
		const storeEl = document.getElementById('tenants');

		this._onStoreSync = () => this.loadRecord();
		storeEl.addEventListener('ln-data-store:synced', this._onStoreSync);
		storeEl.addEventListener('ln-data-store:ready', this._onStoreSync);

		this._onStoreUpdated = (e) => {
			if (e.detail && e.detail.store === 'tenants') {
				window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
					detail: { type: 'success', title: 'Tenant updated', message: 'Tenant saved successfully' }
				}));
			}
		};
		document.addEventListener('ln-data-store:updated', this._onStoreUpdated);
	};

	DocuflowTenantEditor.prototype.destroy = function () {
		const storeEl = document.getElementById('tenants');
		if (storeEl) {
			storeEl.removeEventListener('ln-data-store:synced', this._onStoreSync);
			storeEl.removeEventListener('ln-data-store:ready', this._onStoreSync);
		}
		document.removeEventListener('ln-data-store:updated', this._onStoreUpdated);
		delete this.dom[DOM_ATTRIBUTE];
	};

	window[DOM_ATTRIBUTE] = DocuflowTenantEditor;

	if (window.lnCore && window.lnCore.registerComponent) {
		window.lnCore.registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, DocuflowTenantEditor, 'docuflow-tenant-editor');
	}
})();

/* ── module: tenants/tenants.js ─────────────────────────── */
(function () {
	'use strict';

	// 1. Table row action: delete single tenant
	document.addEventListener('ln-table:row-action', function (e) {
		const d = e.detail;
		if (!d || d.table !== 'tenants' || d.action !== 'delete') return;

		const targetId = Number(d.id || (d.record && d.record.id));
		if (!targetId) return;

		const coord = document.getElementById('tenants-coordinator');
		if (coord) {
			coord.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
				detail: { id: targetId }
			}));
		}
	});

	// 2. Toolbar action: bulk delete selected tenants
	document.addEventListener('click', function (e) {
		const btn = e.target.closest('#bulk-delete-tenants');
		if (!btn) return;

		const table = document.getElementById('tenants-table');
		const ids = Array.from((table && table.lnTable && table.lnTable.selectedIds) || []).map(Number);
		if (!ids.length) return;

		const coord = document.getElementById('tenants-coordinator');
		if (coord) {
			coord.dispatchEvent(new CustomEvent('ln-data-coordinator:request-bulk-delete', {
				detail: { ids: ids }
			}));
		}
	});

	// 3. React to store creation by closing the create modal
	document.addEventListener('ln-data-store:created', function (e) {
		if (e.detail && e.detail.store && e.detail.store !== 'tenants') return;
		const modal = document.getElementById('tenant-modal');
		if (modal) {
			modal.setAttribute('data-ln-modal', 'close');
		}
	});
})();
