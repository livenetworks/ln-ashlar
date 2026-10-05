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
