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
