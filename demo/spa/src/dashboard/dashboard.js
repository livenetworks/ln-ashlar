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
