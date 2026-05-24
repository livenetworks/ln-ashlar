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
			}
		};

		// Listen to all request-remote events bubbling up from the child store
		self.dom.addEventListener('ln-store:request-remote-sync', self._handlers.sync);
		self.dom.addEventListener('ln-store:request-remote-create', self._handlers.create);
		self.dom.addEventListener('ln-store:request-remote-update', self._handlers.update);
		self.dom.addEventListener('ln-store:request-remote-delete', self._handlers.delete);
		self.dom.addEventListener('ln-store:request-remote-bulk-delete', self._handlers.bulkDelete);
	}

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
			self._handlers = null;
		}

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
