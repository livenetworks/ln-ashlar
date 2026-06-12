import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-data-coordinator';
	const DOM_ATTRIBUTE = 'lnDataCoordinator';
	const DOM_ALIAS = 'lnCoordinator';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._name = dom.getAttribute(DOM_SELECTOR);
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this;

		this.mapper = null;
		this._handlers = null;
		this._boundQueries = new WeakMap();
		this._boundDelivered = new WeakMap();

		this.refreshMapper();
		_bindEvents(this);

		return this;
	}

	// ─── Resolve and Refresh Mapper ──────────────────────────

	_component.prototype.refreshMapper = function () {
		this.mapper = null;

		// 1. Check for deprecated/insecure inline script mapper
		const inlineScript = this.dom.querySelector('script[data-ln-mapper]');
		if (inlineScript) {
			console.error('[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.');
		}

		// 2. Resolve to registered external mapper
		const mapperName = this.dom.getAttribute('data-ln-data-mapper') || this.dom.getAttribute('data-ln-data-coordinator');
		if (mapperName && window.lnCore && typeof window.lnCore.getDataMapper === 'function') {
			this.mapper = window.lnCore.getDataMapper(mapperName);
		}

		// 3. Ultimate safe fallback: no-op mapper
		if (!this.mapper) {
			this.mapper = {};
		}

		// Ensure ingress and egress are safe callable functions
		if (typeof this.mapper.ingress !== 'function') {
			this.mapper.ingress = function (r) { return r; };
		}
		if (typeof this.mapper.egress !== 'function') {
			this.mapper.egress = function (r) { return r; };
		}
	};

	// ─── Dynamic Child Discovery ──────────────────────────────

	_component.prototype.findChildren = function () {
		const storeEl = this.dom.querySelector('[data-ln-data-store]');
		const connectorEl = this.dom.querySelector('[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector], [data-ln-rest-connector]');

		return {
			storeEl: storeEl,
			connectorEl: connectorEl,
			store: storeEl ? (storeEl.lnDataStore || storeEl.lnStore) : null,
			connector: connectorEl ? (connectorEl.lnConnector || connectorEl.lnApiConnector || connectorEl.lnCouchDbConnector) : null
		};
	};

	// ─── Event Binding ────────────────────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			sync: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector) {
					console.warn('[ln-data-coordinator] Cannot sync: store or connector not found in subtree');
					return;
				}

				const since = e.detail.since;

				children.connector.fetchDelta(since)
					.then(function (rawResponse) {
						let rawRecords = [];
						let deletedIds = [];
						let syncedAt = null;

						if (rawResponse && Array.isArray(rawResponse)) {
							rawRecords = rawResponse;
							syncedAt = Math.floor(Date.now() / 1000);
						} else if (rawResponse) {
							rawRecords = Array.isArray(rawResponse.data) ? rawResponse.data : [];
							deletedIds = Array.isArray(rawResponse.deleted) ? rawResponse.deleted : [];
							syncedAt = rawResponse.synced_at !== undefined ? rawResponse.synced_at : (rawResponse.since !== undefined ? rawResponse.since : null);
						}

						const normalizedData = rawRecords.map(r => self.mapper.ingress(r));
						children.store.applySync(normalizedData, deletedIds, syncedAt);
					})
					.catch(function (err) {
						console.error('[ln-data-coordinator] Sync failed:', err);
					});
			},

			create: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector) return;

				const tempId = e.detail.tempId;
				const data = e.detail.data || {};

				// Apply egress mapping
				const serverPayload = self.mapper.egress(data);

				children.connector.create(serverPayload)
					.then(function (serverRawResponse) {
						const confirmedLocalRecord = self.mapper.ingress(serverRawResponse);
						children.store.confirmMutation(tempId, confirmedLocalRecord, 'create');
					})
					.catch(function (err) {
						console.error('[ln-data-coordinator] Create mutation failed:', err);
						children.store.revertMutation(tempId, 'create', err.message || err);
					});
			},

			update: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector) return;

				const id = e.detail.id;
				const expectedVersion = e.detail.expected_version;

				// Fetch complete merged local record to pass to egress for full PUT mapping
				children.store.getById(id)
					.then(function (localRecord) {
						if (!localRecord) throw new Error('Record not found in cache store: ' + id);

						const cleanRecord = Object.assign({}, localRecord);
						delete cleanRecord._pending;

						const serverPayload = self.mapper.egress(cleanRecord);

						return children.connector.update(id, serverPayload, expectedVersion);
					})
					.then(function (serverRawResponse) {
						const confirmedLocalRecord = self.mapper.ingress(serverRawResponse);
						children.store.confirmMutation(id, confirmedLocalRecord, 'update');
					})
					.catch(function (err) {
						console.error('[ln-data-coordinator] Update mutation failed:', err);
						if (err.status === 409) {
							const remoteRecord = err.data && err.data.remote ? self.mapper.ingress(err.data.remote) : null;
							const fieldDiffs = err.data ? err.data.field_diffs : null;
							children.store.resolveConflict(id, remoteRecord, fieldDiffs);
						} else {
							children.store.revertMutation(id, 'update', err.message || err);
						}
					});
			},

			delete: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector) return;

				const id = e.detail.id;

				children.connector.delete(id)
					.then(function () {
						children.store.confirmMutation(id, null, 'delete');
					})
					.catch(function (err) {
						console.error('[ln-data-coordinator] Delete mutation failed:', err);
						children.store.revertMutation(id, 'delete', err.message || err);
					});
			},

			bulkDelete: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector) return;

				const ids = e.detail.ids || [];
				const bulkKey = ids.join(',');

				children.connector.bulkDelete(ids)
					.then(function () {
						children.store.confirmMutation(bulkKey, null, 'bulk-delete');
					})
					.catch(function (err) {
						console.error('[ln-data-coordinator] Bulk delete mutation failed:', err);
						children.store.revertMutation(bulkKey, 'bulk-delete', err.message || err);
					});
			},

			// ─── View Binder Handlers ─────────────────────────────
			reqTableData: function (e) { self._serveData(e, 'table'); },
			reqListData:  function (e) { self._serveData(e, 'list'); },
			reqOptions:   function (e) { self._serveOptions(e); },
			reqStat:      function (e) { self._serveStat(e); },
			refresh:      function ()  { self._refreshAll(); },
			refreshSynced: function (e) { if (e.detail && e.detail.changed) self._refreshAll(); }
		};

		// Listen to all request-remote events bubbling up from the child store
		self.dom.addEventListener('ln-store:request-remote-sync', self._handlers.sync);
		self.dom.addEventListener('ln-store:request-remote-create', self._handlers.create);
		self.dom.addEventListener('ln-store:request-remote-update', self._handlers.update);
		self.dom.addEventListener('ln-store:request-remote-delete', self._handlers.delete);
		self.dom.addEventListener('ln-store:request-remote-bulk-delete', self._handlers.bulkDelete);

		// View binder — request handlers (document-level to reach tables/lists outside this subtree)
		document.addEventListener('ln-table:request-data', self._handlers.reqTableData);
		document.addEventListener('ln-list:request-data',  self._handlers.reqListData);
		document.addEventListener('ln-options:request-data', self._handlers.reqOptions);
		document.addEventListener('ln-stat:request-count',  self._handlers.reqStat);

		// Store-change refresh — attach to self.dom so bubbling store events are caught
		self.dom.addEventListener('ln-store:ready',   self._handlers.refresh);
		self.dom.addEventListener('ln-store:loaded',  self._handlers.refresh);
		self.dom.addEventListener('ln-store:created', self._handlers.refresh);
		self.dom.addEventListener('ln-store:updated', self._handlers.refresh);
		self.dom.addEventListener('ln-store:deleted', self._handlers.refresh);
		self.dom.addEventListener('ln-store:synced',  self._handlers.refreshSynced);
	}

	// ─── Store↔View Binder ───────────────────────────────────

	_component.prototype._ownsStore = function (name) {
		const children = this.findChildren();
		return !!(children.store && children.store._name === name && name);
	};

	_component.prototype._harvestFilterOptions = function (tableEl) {
		const result = {};
		const ths = tableEl.querySelectorAll('th[data-ln-table-col]');
		for (let i = 0; i < ths.length; i++) {
			const th = ths[i];
			if (!th.querySelector('[data-ln-table-col-filter]')) continue;
			const raw = th.getAttribute('data-ln-table-filter-options');
			if (!raw) continue;
			const field = th.getAttribute('data-ln-table-col');
			try {
				result[field] = JSON.parse(raw);
			} catch (_) {
				console.warn('[ln-data-coordinator] bad filter-options JSON on column "' + field + '"');
			}
		}
		return result;
	};

	_component.prototype._serveData = function (e, kind) {
		const el = e.target;
		const attrName = kind === 'table' ? 'data-ln-table-store' : 'data-ln-list-store';
		const storeName = el.getAttribute(attrName);
		if (!storeName) return;
		if (!this._ownsStore(storeName)) return;

		this._boundQueries.set(el, {
			sort: e.detail.sort,
			filters: e.detail.filters,
			search: e.detail.search
		});

		const store = this.findChildren().store;
		if (!store.isLoaded) {
			dispatch(el, 'ln-' + kind + ':set-loading', { loading: true });
			return;
		}

		const self = this;
		const query = { sort: e.detail.sort, filters: e.detail.filters, search: e.detail.search };
		const filterOptions = kind === 'table' ? self._harvestFilterOptions(el) : undefined;
		store.getAll(query).then(function (r) {
			const detail = { data: r.data, total: r.total, filtered: r.filtered };
			if (filterOptions) detail.filterOptions = filterOptions;
			dispatch(el, 'ln-' + kind + ':set-data', detail);
			self._boundDelivered.set(el, true);
		});
	};

	_component.prototype._serveOptions = function (e) {
		const el = e.target;
		const name = el.getAttribute('data-ln-options');
		if (!this._ownsStore(name)) return;

		const store = this.findChildren().store;
		store.getAll({}).then(function (r) {
			dispatch(el, 'ln-options:set-data', { data: r.data });
		});
	};

	_component.prototype._serveStat = function (e) {
		const el = e.target;
		const name = el.getAttribute('data-ln-stat');
		if (!this._ownsStore(name)) return;

		const filters = e.detail.filters || null;
		const store = this.findChildren().store;
		store.count(filters).then(function (n) {
			dispatch(el, 'ln-stat:set-count', { count: n });
		});
	};

	_component.prototype._refreshAll = function () {
		const self = this;
		const allBound = document.querySelectorAll('[data-ln-table-store],[data-ln-list-store],[data-ln-options],[data-ln-stat]');
		for (let i = 0; i < allBound.length; i++) {
			const el = allBound[i];
			let storeName, kind;

			if (el.hasAttribute('data-ln-table-store')) {
				storeName = el.getAttribute('data-ln-table-store');
				kind = 'table';
			} else if (el.hasAttribute('data-ln-list-store')) {
				storeName = el.getAttribute('data-ln-list-store');
				kind = 'list';
			} else if (el.hasAttribute('data-ln-options')) {
				storeName = el.getAttribute('data-ln-options');
				kind = 'options';
			} else if (el.hasAttribute('data-ln-stat')) {
				storeName = el.getAttribute('data-ln-stat');
				kind = 'stat';
			}

			if (!this._ownsStore(storeName)) continue;

			const store = this.findChildren().store;

			if (kind === 'table' || kind === 'list') {
				const cached = self._boundQueries.get(el) || { sort: null, filters: {}, search: '' };
				const filterOptions = kind === 'table' ? self._harvestFilterOptions(el) : undefined;
				(function (capturedEl, capturedKind, capturedFilterOptions) {
					store.getAll(cached).then(function (r) {
						const detail = { data: r.data, total: r.total, filtered: r.filtered };
						if (capturedFilterOptions) detail.filterOptions = capturedFilterOptions;
						dispatch(capturedEl, 'ln-' + capturedKind + ':set-data', detail);
						self._boundDelivered.set(capturedEl, true);
					});
				})(el, kind, filterOptions);
			} else if (kind === 'options') {
				(function (capturedEl) {
					store.getAll({}).then(function (r) {
						dispatch(capturedEl, 'ln-options:set-data', { data: r.data });
					});
				})(el);
			} else if (kind === 'stat') {
				const raw = el.getAttribute('data-ln-stat-filter');
				let filters = null;
				if (raw) {
					const colonIdx = raw.indexOf(':');
					if (colonIdx !== -1) {
						const field = raw.slice(0, colonIdx);
						const val = raw.slice(colonIdx + 1);
						filters = {};
						filters[field] = [val];
					}
				}
				(function (capturedEl, capturedFilters) {
					store.count(capturedFilters).then(function (n) {
						dispatch(capturedEl, 'ln-stat:set-count', { count: n });
					});
				})(el, filters);
			}
		}
	};

	// ─── Destroy and Cleanup ──────────────────────────────────

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		const self = this;
		if (self._handlers) {
			self.dom.removeEventListener('ln-store:request-remote-sync', self._handlers.sync);
			self.dom.removeEventListener('ln-store:request-remote-create', self._handlers.create);
			self.dom.removeEventListener('ln-store:request-remote-update', self._handlers.update);
			self.dom.removeEventListener('ln-store:request-remote-delete', self._handlers.delete);
			self.dom.removeEventListener('ln-store:request-remote-bulk-delete', self._handlers.bulkDelete);

			// View binder — document-level listeners
			document.removeEventListener('ln-table:request-data', self._handlers.reqTableData);
			document.removeEventListener('ln-list:request-data',  self._handlers.reqListData);
			document.removeEventListener('ln-options:request-data', self._handlers.reqOptions);
			document.removeEventListener('ln-stat:request-count',  self._handlers.reqStat);

			// Store-change listeners
			self.dom.removeEventListener('ln-store:ready',   self._handlers.refresh);
			self.dom.removeEventListener('ln-store:loaded',  self._handlers.refresh);
			self.dom.removeEventListener('ln-store:created', self._handlers.refresh);
			self.dom.removeEventListener('ln-store:updated', self._handlers.refresh);
			self.dom.removeEventListener('ln-store:deleted', self._handlers.refresh);
			self.dom.removeEventListener('ln-store:synced',  self._handlers.refreshSynced);

			self._handlers = null;
		}

		self._boundQueries = null;
		self._boundDelivered = null;

		delete this.dom[DOM_ATTRIBUTE];
		delete this.dom[DOM_ALIAS];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;

		if (attrName === 'data-ln-data-mapper') {
			instance.refreshMapper();
		}
	}

	// ─── Registration ──────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-coordinator', {
		extraAttributes: [
			'data-ln-data-mapper'
		],
		onAttributeChange: _syncAttribute
	});
})();
