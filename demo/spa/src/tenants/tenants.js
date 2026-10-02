(function () {
	'use strict';

	const DOM_ATTRIBUTE = 'tenantsCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Tenants Coordinator (Layer 2) ──────────────────────
	function TenantsCoordinator(dom) {
		this.dom = dom;
		this.dom[DOM_ATTRIBUTE] = this;
		this._bindEvents();
		return this;
	}

	TenantsCoordinator.prototype._bindEvents = function () {
		const self = this;

		// 1. Table row action: delete single tenant
		// Scoped to this.dom subtree (bubbles from ln-table up to coordinator host)
		this._onRowAction = function (e) {
			const d = e.detail;
			if (!d || d.table !== 'tenants' || d.action !== 'delete') return;

			const targetId = Number(d.id || (d.record && d.record.id));
			if (!targetId) return;

			self._requestDelete(targetId);
		};

		this.dom.addEventListener('ln-table:row-action', this._onRowAction);

		// 2. Toolbar action: bulk delete selected tenants
		// Scoped to this.dom subtree (catches button click inside view header)
		this._onBulkDeleteClick = function (e) {
			const btn = e.target.closest('#bulk-delete-tenants');
			if (!btn) return;

			const table = self.dom.querySelector('#tenants-table');
			if (!table || !table.lnTable) return;

			const ids = Array.from(table.lnTable.selectedIds).map(Number);
			if (!ids.length) return;

			self._requestBulkDelete(ids);
		};

		this.dom.addEventListener('click', this._onBulkDeleteClick);

		// 3. React to tenant store creation by closing tenant modal
		this._onStoreCreated = function (e) {
			if (e.detail && e.detail.store && e.detail.store !== 'tenants') return;
			const tenantModal = document.getElementById('tenant-modal');
			if (tenantModal) {
				tenantModal.setAttribute('data-ln-modal', 'close');
			}
		};

		const tenantsStore = document.getElementById('tenants');
		if (tenantsStore) {
			tenantsStore.addEventListener('ln-data-store:created', this._onStoreCreated);
		}
	};

	TenantsCoordinator.prototype._requestDelete = function (id) {
		const tenantsCoordEl = document.getElementById('tenants-coordinator') || document.querySelector('[data-ln-data-coordinator="tenants"]');
		if (!tenantsCoordEl) return;
		tenantsCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-delete', {
			detail: { id: id }
		}));
	};

	TenantsCoordinator.prototype._requestBulkDelete = function (ids) {
		const tenantsCoordEl = document.getElementById('tenants-coordinator') || document.querySelector('[data-ln-data-coordinator="tenants"]');
		if (!tenantsCoordEl) return;
		tenantsCoordEl.dispatchEvent(new CustomEvent('ln-data-coordinator:request-bulk-delete', {
			detail: { ids: ids }
		}));
	};

	// ─── Destroy (Teardown Lifecycle) ───────────────────────
	TenantsCoordinator.prototype.destroy = function () {
		if (this._onRowAction) {
			this.dom.removeEventListener('ln-table:row-action', this._onRowAction);
			this._onRowAction = null;
		}

		if (this._onBulkDeleteClick) {
			this.dom.removeEventListener('click', this._onBulkDeleteClick);
			this._onBulkDeleteClick = null;
		}

		const tenantsStore = document.getElementById('tenants');
		if (tenantsStore && this._onStoreCreated) {
			tenantsStore.removeEventListener('ln-data-store:created', this._onStoreCreated);
			this._onStoreCreated = null;
		}

		delete this.dom[DOM_ATTRIBUTE];
	};

	window[DOM_ATTRIBUTE] = TenantsCoordinator;

	// ─── Route Lifecycle Mount / Unmount ─────────────────────
	let activeCoordinator = null;

	function mount(viewEl) {
		if (activeCoordinator) activeCoordinator.destroy();
		if (viewEl) activeCoordinator = new TenantsCoordinator(viewEl);
	}

	function unmount() {
		if (activeCoordinator) {
			activeCoordinator.destroy();
			activeCoordinator = null;
		}
	}

	document.addEventListener('ln-router:navigated', function (e) {
		const pattern = e.detail && e.detail.route && e.detail.route.pattern;
		if (pattern === '/spa/tenants') {
			const viewEl = e.detail.target || document.getElementById('tenants-view');
			mount(viewEl);
		} else {
			unmount();
		}
	});

	// If page was loaded directly on this route
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () {
			const viewEl = document.getElementById('tenants-view');
			if (viewEl && !activeCoordinator) mount(viewEl);
		});
	} else {
		const viewEl = document.getElementById('tenants-view');
		if (viewEl && !activeCoordinator) mount(viewEl);
	}
})();
