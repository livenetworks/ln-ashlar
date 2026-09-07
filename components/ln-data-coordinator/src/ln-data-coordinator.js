import { registerComponent, dispatch, buildDict, serializeForm, resolveFormMethod } from '../../ln-core';
import { normalizeDataQuery, selectDataSource, composeQuery } from './data-read-policy';
import { MutationReceipts } from './mutation-receipts';

(function () {
	const DOM_SELECTOR = 'data-ln-data-coordinator';
	const DOM_ATTRIBUTE = 'lnDataCoordinator';
	const DOM_ALIAS = 'lnCoordinator';
	const SCOPE_ATTR = 'data-ln-form-scope';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Sync Orchestration Singleton ──────────────────────

	const _coordinators = new Set();
	let _globalSyncInstalled = false;
	let _onlineHandler = null;
	let _offlineHandler = null;
	let _visibilityHandler = null;

	function _installGlobalSync() {
		if (_globalSyncInstalled) return;
		_globalSyncInstalled = true;

		_onlineHandler = function () {
			dispatch(document, 'ln-data-store:online', {});
			_coordinators.forEach(function (coord) {
				coord._maybeSync();
			});
		};

		_offlineHandler = function () {
			dispatch(document, 'ln-data-store:offline', {});
		};

		_visibilityHandler = function () {
			if (document.visibilityState !== 'visible') return;
			_coordinators.forEach(function (coord) {
				const children = coord.findChildren();
				const store = children.store;
				if (store && children.connector && store.isInitialized && !store.initializationError && !store.isSyncing && !coord._noAutosync && (!store.hasCache || coord._isStale())) {
					store.forceSync();
				}
			});
		};

		window.addEventListener('online', _onlineHandler);
		window.addEventListener('offline', _offlineHandler);
		document.addEventListener('visibilitychange', _visibilityHandler);
	}

	function _uninstallGlobalSync() {
		if (!_globalSyncInstalled) return;
		if (_coordinators.size > 0) return;

		window.removeEventListener('online', _onlineHandler);
		window.removeEventListener('offline', _offlineHandler);
		document.removeEventListener('visibilitychange', _visibilityHandler);

		_onlineHandler = null;
		_offlineHandler = null;
		_visibilityHandler = null;
		_globalSyncInstalled = false;
	}

	// ─── Local Helpers ──────────────────────────────────────

	function _uuid() {
		try { return crypto.randomUUID(); }
		catch (_) {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
				const r = Math.random() * 16 | 0;
				const v = c === 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
		}
	}

	// Connector response namespaces — generalized so writes work whether the
	// paired connector is ln-api-connector or ln-couchdb-connector.
	const CONNECTOR_RESPONSE_NAMESPACES = ['ln-api-connector', 'ln-couchdb-connector'];

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._name = dom.getAttribute('data-ln-data-coordinator') || dom.id;
		if (!this._name) console.warn('[ln-data-coordinator] missing id — the coordinator cannot be addressed', dom);
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this;

		this.mapper = null;
		this._handlers = null;
		this._boundQueries = new WeakMap();
		this._boundDelivered = new WeakMap();
		this._mutationReceipts = new MutationReceipts();
		this._dict = buildDict(dom, 'data-ln-data-coordinator-dict'); // flat key→string error-toast map; {} if none

		this._parseStaleAttributes();

		this.refreshMapper();
		_bindEvents(this);

		_coordinators.add(this);
		_installGlobalSync();

		this._checkInitialSync();

		return this;
	}

	// ─── Stale / No-Autosync Attribute Parsing ──────────────

	_component.prototype._parseStaleAttributes = function () {
		const children = this.findChildren();
		const storeEl = children.storeEl;

		const staleAttr = this.dom.getAttribute('data-ln-data-coordinator-stale')
			|| (storeEl ? storeEl.getAttribute('data-ln-data-store-stale') : null);
		const parsed = parseInt(staleAttr, 10);
		this._staleThreshold = (staleAttr === 'never' || staleAttr === '-1') ? -1 : (isNaN(parsed) ? 300 : parsed);

		const noAutosyncAttr = this.dom.hasAttribute('data-ln-data-coordinator-no-autosync')
			|| (storeEl ? storeEl.hasAttribute('data-ln-data-store-no-autosync') : false);
		this._noAutosync = !!noAutosyncAttr;
	};

	_component.prototype._isStale = function () {
		if (this._staleThreshold === -1) return false;
		const children = this.findChildren();
		const store = children.store;
		if (!store || !store.lastSyncedAt) return true;
		const ageSeconds = (Date.now() / 1000) - store.lastSyncedAt;
		return ageSeconds > this._staleThreshold;
	};

	_component.prototype._maybeSync = function () {
		const children = this.findChildren();
		const store = children.store;
		if (!store || store.initializationError || !children.connector || this._noAutosync) return;
		if (!store.isInitialized || store.isSyncing) return;
		if (!store.hasCache || this._isStale()) store.forceSync();
	};

	// ─── Race Guard: evaluate initial sync directly at children-resolve ────

	_component.prototype._checkInitialSync = function () {
		const self = this;
		const initial = this.findChildren();
		const store = initial.store;
		if (!store) return;

		Promise.resolve(store.ready).then(function () {
			const children = self.findChildren();
			const currentStore = children.store;
			if (currentStore && currentStore.initializationError) {
				self._reportReconciliationError('store-initialize', currentStore.initializationError, null);
				return;
			}
			if (!currentStore || !children.connector || self._noAutosync || currentStore.isSyncing) return;
			if (!currentStore.hasCache || self._isStale()) currentStore.forceSync();
		}).catch(function (error) {
			self._reportReconciliationError('store-initialize', error, null);
		});
	};

	// ─── Resolve and Refresh Mapper ──────────────────────────

	_component.prototype.refreshMapper = function () {
		this.mapper = null;

		// 1. Check for deprecated/insecure inline script mapper
		const inlineScript = this.dom.querySelector('script[data-ln-mapper]');
		if (inlineScript) {
			console.error('[ln-data-coordinator] Security Error: Inline script mappers using <script data-ln-mapper> are deprecated and disabled due to XSS vulnerability risks (unsafe-eval). Please register your mappers securely via window.lnCore.registerDataMapper() instead.');
		}

		// 2. Resolve to registered external mapper
		const mapperName = this.dom.getAttribute('data-ln-data-mapper') || this.dom.id;
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
		const connectorEl = this.dom.querySelector('[data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]');
		const queueEl = this.dom.querySelector('[data-ln-api-queue]');

		return {
			storeEl: storeEl,
			connectorEl: connectorEl,
			queueEl: queueEl,
			store: storeEl ? (storeEl.lnDataStore || storeEl.lnStore) : null,
			connector: connectorEl ? (connectorEl.lnConnector || connectorEl.lnApiConnector || connectorEl.lnCouchDbConnector) : null,
			queue: queueEl ? queueEl.lnApiQueue : null
		};
	};

	// ─── Form Write Intake (native submit, claimed via preventDefault) ──

	_component.prototype._handleSubmitRecord = function (detail) {
		const children = this.findChildren();
		if (!children.storeEl) {
			console.warn('[ln-data-coordinator] form submit claimed but no [data-ln-data-store] child found in "' + (this._name || '') + '"');
			return;
		}

		const raw = detail.data || {};
		const id = raw.id;
		const expectedVersion = raw.expected_version;
		const data = Object.assign({}, raw);
		delete data.id;
		delete data.expected_version;

		const method = detail.method.toUpperCase();

		if (method === 'POST') {
			this._fanOutCreate(children, data, detail.action);
		} else if (method === 'PUT' || method === 'PATCH') {
			this._fanOutUpdate(children, id, data, expectedVersion, detail.action);
		}
	};

	// ─── Parallel Fan-Out (local store write + remote connector/queue) ──────

	_component.prototype._fanOutCreate = function (children, data, action) {
		this.refreshMapper();
		const tempId = '_temp_' + _uuid();

		dispatch(children.storeEl, 'ln-data-store:request-create', { tempId: tempId, data: data });

		if (children.queue) {
			dispatch(children.queueEl, 'ln-api-queue:request-enqueue', {
				chainKey: tempId, op: 'create', targetId: null,
				payload: this.mapper.egress(data), expectedVersion: null,
				meta: { tempId: tempId, action: action }
			});
		} else if (children.connector) {
			dispatch(children.connectorEl, 'ln-api-connector:request-create', {
				data: this.mapper.egress(data), url: action,
				meta: { entryId: _uuid(), queued: false, op: 'create', tempId: tempId }
			});
		}
	};

	_component.prototype._fanOutUpdate = function (children, id, data, expectedVersion, action) {
		this.refreshMapper();

		dispatch(children.storeEl, 'ln-data-store:request-update', { id: id, data: data });

		if (children.queue) {
			dispatch(children.queueEl, 'ln-api-queue:request-enqueue', {
				chainKey: id, op: 'update', targetId: id,
				payload: this.mapper.egress(data), expectedVersion: expectedVersion,
				meta: { id: id, action: action }
			});
		} else if (children.connector) {
			dispatch(children.connectorEl, 'ln-api-connector:request-update', {
				id: id, data: this.mapper.egress(data), expected_version: expectedVersion, url: action,
				meta: { entryId: _uuid(), queued: false, op: 'update', id: id }
			});
		}
	};

	_component.prototype._fanOutDelete = function (children, id) {
		this.refreshMapper();

		dispatch(children.storeEl, 'ln-data-store:request-delete', { id: id });

		if (children.queue) {
			dispatch(children.queueEl, 'ln-api-queue:request-enqueue', {
				chainKey: id, op: 'delete', targetId: id, payload: null, expectedVersion: null, meta: { id: id }
			});
		} else if (children.connector) {
			dispatch(children.connectorEl, 'ln-api-connector:request-delete', {
				id: id, meta: { entryId: _uuid(), queued: false, op: 'delete', id: id }
			});
		}
	};

	_component.prototype._fanOutBulkDelete = function (children, ids) {
		this.refreshMapper();
		const bulkKey = ids.join(',');

		dispatch(children.storeEl, 'ln-data-store:request-bulk-delete', { ids: ids });

		if (children.queue) {
			dispatch(children.queueEl, 'ln-api-queue:request-enqueue', {
				chainKey: bulkKey, op: 'bulk-delete', targetId: null, payload: { ids: ids }, expectedVersion: null, meta: { bulkKey: bulkKey, ids: ids }
			});
		} else if (children.connector) {
			dispatch(children.connectorEl, 'ln-api-connector:request-bulk-delete', {
				ids: ids, meta: { entryId: _uuid(), queued: false, op: 'bulk-delete', bulkKey: bulkKey }
			});
		}
	};

	// ─── Toast Helpers ────────────────────────────────────────

	_component.prototype._toastFromMessage = function (message) {
		if (!message) return;
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: {
				type: message.type || 'success',
				title: message.title || '',
				message: message.body || ''
			}
		}));
	};

	_component.prototype._toastFromDict = function (key) {
		const text = this._dict[key];
		if (!text) return;
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
			detail: { type: 'error', title: '', message: text }
		}));
	};

	_component.prototype._requestStoreMutation = function (children, action, detail) {
		const storeEl = children.storeEl;
		if (!storeEl) return Promise.reject(new Error('Store element not found'));

		const requestId = _uuid();
		const receipt = this._mutationReceipts.wait(requestId);
		dispatch(storeEl, 'ln-data-store:request-' + action, Object.assign({}, detail, { requestId }));
		return receipt;
	};

	_component.prototype._reportReconciliationError = function (operation, error, meta) {
		dispatch(this.dom, 'ln-data-coordinator:error', {
			operation,
			error,
			meta: meta || null
		});
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
				dispatch(children.connectorEl, 'ln-api-connector:request-sync', { since: e.detail.since, meta: { op: 'sync' } });
			},

			requestPage: function (e) {
				const children = self.findChildren();
				if (!children.connectorEl) return;
				const detail = e.detail || {};
				dispatch(children.connectorEl, 'ln-api-connector:request-query', {
					query: Object.assign({}, detail.query, {
						offset: detail.offset,
						limit: detail.limit,
						queryGen: detail.queryGen
					})
				});
			},

			reqCreate: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				self._fanOutCreate(children, e.detail.data || {}, e.detail.action);
			},

			reqUpdate: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				self._fanOutUpdate(children, e.detail.id, e.detail.data || {}, e.detail.expected_version, e.detail.action);
			},

			reqDelete: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				self._fanOutDelete(children, e.detail.id);
			},

			reqBulkDelete: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				self._fanOutBulkDelete(children, e.detail.ids || []);
			},

			queueFailed: function () {
				self._toastFromDict('network');
			},

			// ─── Queue Transport Executor ─────────────────────────
			queueSend: function (e) {
				self.refreshMapper();
				const children = self.findChildren();
				if (!children.store || !children.connector || !children.queue) return;

				const detail = e.detail || {};
				const entryId = detail.entryId;
				const op = detail.op;
				const targetId = detail.targetId;
				const payload = detail.payload;
				const expectedVersion = detail.expectedVersion;
				const queueMeta = detail.meta || {};
				const resourceUrl = queueMeta.action || null;
				const idempotencyKey = detail.idempotencyKey || entryId;

				if (op === 'create') {
					dispatch(children.connectorEl, 'ln-api-connector:request-create', {
						data: payload, url: resourceUrl, idempotencyKey: idempotencyKey,
						meta: { entryId: entryId, queued: true, op: 'create', tempId: queueMeta.tempId }
					});
				} else if (op === 'update') {
					dispatch(children.connectorEl, 'ln-api-connector:request-update', {
						id: targetId, data: payload, expected_version: expectedVersion, url: resourceUrl, idempotencyKey: idempotencyKey,
						meta: { entryId: entryId, queued: true, op: 'update', id: targetId }
					});
				} else if (op === 'delete') {
					dispatch(children.connectorEl, 'ln-api-connector:request-delete', {
						id: targetId, idempotencyKey: idempotencyKey,
						meta: { entryId: entryId, queued: true, op: 'delete', id: targetId }
					});
				} else if (op === 'bulk-delete') {
					dispatch(children.connectorEl, 'ln-api-connector:request-bulk-delete', {
						ids: (payload && payload.ids) ? payload.ids : [],
						idempotencyKey: idempotencyKey,
						meta: { entryId: entryId, queued: true, op: 'bulk-delete', bulkKey: queueMeta.bulkKey }
					});
				} else {
					console.warn('[ln-data-coordinator] Unknown queue op:', op);
				}
			},

			// ─── Form Write Intake — native submit, bubble phase ──────
			formSubmit: function (e) {
				const form = e.target;
				if (e.defaultPrevented) return; // ln-validate's submit gate blocked it, or another coordinator already claimed it

				const scopeAttr = form.hasAttribute(SCOPE_ATTR) ? form.getAttribute(SCOPE_ATTR) : null;
				if (scopeAttr === null) return; // form never opted in — leave native submit alone

				let isMine;
				if (scopeAttr) {
					isMine = (scopeAttr === self._name || self._ownsStore(scopeAttr));
				} else {
					isMine = (form.closest('[data-ln-data-coordinator]') === self.dom);
				}
				if (!isMine) return;

				const method = resolveFormMethod(form);
				if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH') return;

				e.preventDefault(); // claim

				const raw = serializeForm(form);
				delete raw._method;
				delete raw._token;

				self._handleSubmitRecord({ data: raw, method: method, action: form.getAttribute('action') || '' });
			},

			// ─── Connector Response Handlers (direct + queued paths) ──
			connFetched: function (e) {
				const meta = e.detail.meta || {};
				const children = self.findChildren();

				self.refreshMapper();
				const rawResponse = e.detail.data;
				let fetchedRecords = [], deletedIds = [], syncedAt = null;

				if (Array.isArray(rawResponse)) {
					fetchedRecords = rawResponse;
					syncedAt = Math.floor(Date.now() / 1000);
				} else if (rawResponse) {
					fetchedRecords = Array.isArray(rawResponse.data) ? rawResponse.data : [];
					deletedIds = Array.isArray(rawResponse.deleted) ? rawResponse.deleted : [];
					syncedAt = rawResponse.synced_at !== undefined ? rawResponse.synced_at : (rawResponse.since !== undefined ? rawResponse.since : null);
				}

				const normalizedData = fetchedRecords.map(r => self.mapper.ingress(r));

				// 1. Pass fetched remote data strictly to ln-data-store (Single Source of Truth)
				if (children.store && !children.store.initializationError) {
					if (meta.kind) {
						if (meta.kind === 'table' || meta.kind === 'list' || meta.kind === 'chart') {
							children.store.applyQuery(normalizedData, { total: e.detail.total }).then(function (decorated) {
								dispatch(meta.targetEl, 'ln-' + meta.kind + ':set-loading', { loading: false });
								dispatch(meta.targetEl, 'ln-' + meta.kind + ':set-data', {
									data: decorated,
									total: e.detail.total !== undefined ? e.detail.total : decorated.length,
									filtered: e.detail.filtered !== undefined ? e.detail.filtered : decorated.length,
									offset: e.detail.offset,
									queryGen: e.detail.queryGen
								});
								self._boundDelivered.set(meta.targetEl, true);
							});
						} else if (meta.kind === 'options') {
							children.store.applyQuery(normalizedData, { total: e.detail.total }).then(function () {
								return children.store.getAll({});
							}).then(function (r) {
								dispatch(meta.targetEl, 'ln-options:set-data', { data: r.data });
							});
						} else if (meta.kind === 'stat') {
							children.store.applyQuery(normalizedData, { total: e.detail.total }).then(function () {
								const count = e.detail.filtered !== undefined
									? e.detail.filtered
									: (e.detail.total !== undefined ? e.detail.total : normalizedData.length);
								dispatch(meta.targetEl, 'ln-stat:set-count', { count: count });
							});
						}
					} else {
						children.store.applySync(normalizedData, deletedIds, syncedAt || Math.floor(Date.now() / 1000), {
							total: e.detail.total,
							filtered: e.detail.filtered,
							offset: e.detail.offset,
							queryGen: e.detail.queryGen,
							targetEl: meta.targetEl
						});
					}
				} else if (meta.targetEl && meta.kind) {
					if (meta.kind === 'table' || meta.kind === 'list' || meta.kind === 'chart') {
						dispatch(meta.targetEl, 'ln-' + meta.kind + ':set-loading', { loading: false });
						dispatch(meta.targetEl, 'ln-' + meta.kind + ':set-data', {
							data: normalizedData,
							total: e.detail.total !== undefined ? e.detail.total : normalizedData.length,
							filtered: e.detail.filtered !== undefined ? e.detail.filtered : normalizedData.length,
							offset: e.detail.offset,
							queryGen: e.detail.queryGen
						});
						self._boundDelivered.set(meta.targetEl, true);
					} else if (meta.kind === 'options') {
						dispatch(meta.targetEl, 'ln-options:set-data', { data: normalizedData });
					} else if (meta.kind === 'stat') {
						const count = e.detail.filtered !== undefined
							? e.detail.filtered
							: (e.detail.total !== undefined ? e.detail.total : normalizedData.length);
						dispatch(meta.targetEl, 'ln-stat:set-count', { count: count });
					}
				}
			},

			connCreated: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				const serverRecord = self.mapper.ingress(e.detail.record);

				self._requestStoreMutation(children, 'update', { id: meta.tempId, data: serverRecord })
					.then(function () {
						self._toastFromMessage(e.detail.message);
						if (meta.queued && children.queue) {
							dispatch(children.queueEl, 'ln-api-queue:resolve-create', {
								entryId: meta.entryId,
								oldKey: meta.tempId,
								newId: serverRecord.id
							});
						}
					})
					.catch(function (error) {
						self._reportReconciliationError('create-reconcile', error, meta);
					});
			},

			connUpdated: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				const serverRecord = self.mapper.ingress(e.detail.record);

				self._requestStoreMutation(children, 'update', { id: meta.id, data: serverRecord })
					.then(function () {
						self._toastFromMessage(e.detail.message);
						if (meta.queued && children.queue) {
							dispatch(children.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
						}
					})
					.catch(function (error) {
						self._reportReconciliationError('update-reconcile', error, meta);
					});
			},

			connDeleted: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				// Optimistic delete already applied; no local reconciliation.
				self._toastFromMessage(e.detail.message); // null on 204 → silent
				if (meta.queued && children.queue) {
					dispatch(children.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
				}
			},

			connBulkDeleted: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				self._toastFromMessage(e.detail.message);
				if (meta.queued && children.queue) {
					dispatch(children.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
				}
			},

			connError: function (e) {
				const detail = e.detail || {};
				const meta = detail.meta || {};
				const op = meta.op || detail.action;
				const status = detail.status || 0;
				const children = self.findChildren();

				if (op === 'sync') {
					if (children.storeEl) {
						dispatch(children.storeEl, 'ln-data-store:request-sync-failed', {
							error: detail.error,
							status: status
						});
					}
					console.error('[ln-data-coordinator] Sync failed:', detail.error);
					return;
				}

				if (op === 'query') {
					if (meta.targetEl && meta.kind) {
						dispatch(meta.targetEl, 'ln-' + meta.kind + ':set-loading', { loading: false });
						if (meta.kind === 'table' || meta.kind === 'list') {
							dispatch(meta.targetEl, 'ln-' + meta.kind + ':page-failed', { offset: meta.offset });
						}
					}
					self._reportReconciliationError('query', detail.error || detail, meta);
					return;
				}

				if (!children.storeEl) return;

				const isAuth = status === 401 || status === 419;
				const isTransient = status === 0 || status >= 500;
				const isConflict = status === 409 || status === 412;

				// ── Auth: pause queue, keep local write ──
				if (isAuth) {
					self._toastFromDict('auth');
					if (meta.queued && children.queue) {
						dispatch(children.queueEl, 'ln-api-queue:nack', { entryId: meta.entryId, reason: 'auth' });
					}
					return;
				}

				// ── Transient (5xx / network / 0): NEVER delete local ──
				if (isTransient) {
					if (meta.queued && children.queue) {
						// Retry via queue ladder; toast deferred to ln-api-queue:failed
						dispatch(children.queueEl, 'ln-api-queue:nack', { entryId: meta.entryId, reason: 'retry' });
					} else {
						// No queue: single attempt spent; record stays local, surface now
						self._toastFromDict('network');
					}
					return;
				}

				// ── Deterministic (4xx / 3xx): never retry ──
				let reconciliation = Promise.resolve();
				if (isConflict && op === 'update') {
					const remote = detail.data && detail.data.remote ? self.mapper.ingress(detail.data.remote) : null;
					if (remote) {
						reconciliation = self._requestStoreMutation(children, 'update', { id: meta.id, data: remote });
					}
					self._toastFromDict('conflict');
				} else if (op === 'create') {
					reconciliation = self._requestStoreMutation(children, 'delete', { id: meta.tempId });
					self._toastFromDict('rejected');
				} else {
					// update/delete/bulk generic 4xx (incl. 404): leave local, next sync reconciles
					self._toastFromDict('rejected');
				}

				if (meta.queued && children.queue) {
					reconciliation.then(function () {
						dispatch(children.queueEl, 'ln-api-queue:nack', { entryId: meta.entryId, reason: 'drop' });
					}).catch(function (error) {
						self._reportReconciliationError('deterministic-reconcile', error, meta);
					});
				} else {
					reconciliation.catch(function (error) {
						self._reportReconciliationError('deterministic-reconcile', error, meta);
					});
				}
			},

			// ─── Store Initialized (Sync Ownership) ───────────────
			storeInitialized: function (e) {
				const children = self.findChildren();
				const store = children.store;
				if (!store || store.initializationError || !children.connector || self._noAutosync || store.isSyncing) return;

				const detail = e.detail || {};
				if (!detail.hasCache) {
					store.forceSync();
				} else if (self._isStale()) {
					store.forceSync();
				}
			},

			// ─── View Binder Handlers ─────────────────────────────
			reqTableData: function (e) { self._serveData(e, 'table'); },
			reqListData: function (e) { self._serveData(e, 'list'); },
			reqChartData: function (e) { self._serveData(e, 'chart'); },
			reqOptions: function (e) { self._serveOptions(e); },
			reqStat: function (e) { self._serveStat(e); },
			refreshQuery: function () { self._refreshAll(null, true); },
			refresh: function (e) {
				self._mutationReceipts.resolve(e.detail);
				self._refreshAll(null, false);
			},
			mutationError: function (e) {
				self._mutationReceipts.reject(e.detail);
			},
			refreshSynced: function (e) {
				if (e.detail && e.detail.changed) self._refreshAll(e.detail.meta, false);
			}
		};

		// Sync request bubbling up from the child store
		self.dom.addEventListener('ln-data-store:request-remote-sync', self._handlers.sync);
		self.dom.addEventListener('ln-data-store:request-page', self._handlers.requestPage);

		// Coordinator-namespaced intake events (parallel fan-out)
		self.dom.addEventListener('ln-data-coordinator:request-create', self._handlers.reqCreate);
		self.dom.addEventListener('ln-data-coordinator:request-update', self._handlers.reqUpdate);
		self.dom.addEventListener('ln-data-coordinator:request-delete', self._handlers.reqDelete);
		self.dom.addEventListener('ln-data-coordinator:request-bulk-delete', self._handlers.reqBulkDelete);

		// Queue transport executor + terminal failure
		self.dom.addEventListener('ln-api-queue:send', self._handlers.queueSend);
		self.dom.addEventListener('ln-api-queue:failed', self._handlers.queueFailed);

		// Sync ownership — store initialization
		self.dom.addEventListener('ln-data-store:initialized', self._handlers.storeInitialized);

		// Form write intake — native submit, document-level, bubble phase (never
		// capture: ln-validate's own submit gate on the form must run first)
		document.addEventListener('submit', self._handlers.formSubmit);

		// Connector responses — generalized across concrete connector implementations
		CONNECTOR_RESPONSE_NAMESPACES.forEach(function (ns) {
			self.dom.addEventListener(ns + ':fetched', self._handlers.connFetched);
			self.dom.addEventListener(ns + ':created', self._handlers.connCreated);
			self.dom.addEventListener(ns + ':updated', self._handlers.connUpdated);
			self.dom.addEventListener(ns + ':deleted', self._handlers.connDeleted);
			self.dom.addEventListener(ns + ':bulk-deleted', self._handlers.connBulkDeleted);
			self.dom.addEventListener(ns + ':error', self._handlers.connError);
		});

		// View binder — request handlers (document-level to reach tables/lists outside this subtree)
		document.addEventListener('ln-table:request-data', self._handlers.reqTableData);
		document.addEventListener('ln-list:request-data', self._handlers.reqListData);
		document.addEventListener('ln-chart:request-data', self._handlers.reqChartData);
		document.addEventListener('ln-options:request-data', self._handlers.reqOptions);
		document.addEventListener('ln-stat:request-count', self._handlers.reqStat);

		// Store-change refresh — attach to self.dom so bubbling store events are caught
		self.dom.addEventListener('ln-data-store:ready', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:created', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:updated', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:deleted', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:mutation-error', self._handlers.mutationError);
		self.dom.addEventListener('ln-data-store:synced', self._handlers.refreshSynced);
		self.dom.addEventListener('ln-data-store:query-changed', self._handlers.refreshQuery);
	}

	// ─── Store↔View Binder ───────────────────────────────────

	_component.prototype._ownsStore = function (name) {
		const children = this.findChildren();
		if (children.store && children.store._name === name && name) return true;
		return false;
	};

	_component.prototype._serveData = function (e, kind) {
		const el = e.target;
		const attrName = kind === 'table' ? 'data-ln-table-source'
			: (kind === 'list' ? 'data-ln-list-source' : 'data-ln-chart-source');
		const storeName = el.getAttribute(attrName);
		if (!storeName) return;
		if (!this._ownsStore(storeName)) return;

		const request = e.detail || {};
		const query = normalizeDataQuery(request);
		this._boundQueries.set(el, query);

		const children = this.findChildren();
		const self = this;
		const store = children.store;
		const ready = store && store.ready ? store.ready : Promise.resolve();

		return ready.then(function () {
			const source = selectDataSource(store, children.connector);
			const effective = composeQuery(query, store && store.query);
			if (source === 'remote') {
				// The source owns search/filter/sort even when it holds no rows yet —
				// the view only contributes the page window, so the server must be
				// asked with the composed query, not the view's request as it arrived.
				dispatch(el, 'ln-' + kind + ':set-loading', { loading: true });
				dispatch(children.connectorEl, 'ln-api-connector:request-query', {
					query: effective,
					meta: { targetEl: el, kind: kind, offset: effective.offset, limit: effective.limit }
				});
				return;
			}

			if (source !== 'store') {
				dispatch(el, 'ln-' + kind + ':set-loading', { loading: false });
				return;
			}

			return store.getAll(effective).then(function (r) {
				const detail = {
					data: r.data,
					total: r.total,
					filtered: r.filtered,
					offset: request.offset !== undefined ? request.offset : r.offset,
					queryGen: request.queryGen !== undefined ? request.queryGen : r.queryGen,
					// The store answered from its own records while the server query
					// is still out; the view renders it but keeps the refresh showing.
					provisional: r.provisional === true
				};
				dispatch(el, 'ln-' + kind + ':set-data', detail);
				self._boundDelivered.set(el, true);
			});
		}).catch(function (error) {
			dispatch(el, 'ln-' + kind + ':set-loading', { loading: false });
			dispatch(self.dom, 'ln-data-coordinator:error', {
				operation: 'query',
				kind: kind,
				store: storeName,
				target: el,
				error: error
			});
		});
	};

	_component.prototype._serveOptions = function (e) {
		const el = e.target;
		const name = el.getAttribute('data-ln-options');
		if (!this._ownsStore(name)) return;

		const children = this.findChildren();
		const store = children.store;
		const ready = store && store.ready ? store.ready : Promise.resolve();
		const self = this;

		return ready.then(function () {
			const source = selectDataSource(store, children.connector, false);
			if (source === 'remote') {
				dispatch(children.connectorEl, 'ln-api-connector:request-query', {
					query: {},
					meta: { targetEl: el, kind: 'options' }
				});
				return;
			}
			if (source !== 'store') return;
			return store.getAll({}).then(function (r) {
				dispatch(el, 'ln-options:set-data', { data: r.data });
			});
		}).catch(function (error) {
			self._reportReconciliationError('options-query', error, { targetEl: el, kind: 'options' });
		});
	};

	_component.prototype._serveStat = function (e) {
		const el = e.target;
		const name = el.getAttribute('data-ln-stat');
		if (!this._ownsStore(name)) return;

		const filters = e.detail && e.detail.filters ? e.detail.filters : null;
		const children = this.findChildren();
		const store = children.store;
		const ready = store && store.ready ? store.ready : Promise.resolve();
		const self = this;

		return ready.then(function () {
			const hasFilters = filters && Object.keys(filters).length > 0;
			const requiresRemote = !!(children.connector && store && (((store.windowed || store._windowIndex) && hasFilters) || store.noLocalQuery));
			const source = requiresRemote ? 'remote' : selectDataSource(store, children.connector, false);
			if (source === 'remote') {
				dispatch(children.connectorEl, 'ln-api-connector:request-query', {
					query: { filters: filters },
					meta: { targetEl: el, kind: 'stat' }
				});
				return;
			}
			if (source !== 'store') return;
			return store.count(filters).then(function (n) {
				dispatch(el, 'ln-stat:set-count', { count: n });
			});
		}).catch(function (error) {
			self._reportReconciliationError('stat-query', error, { targetEl: el, kind: 'stat' });
		});
	};

	_component.prototype._refreshAll = function (syncMeta, isQueryChange) {
		const self = this;
		const allBound = document.querySelectorAll('[data-ln-table-source],[data-ln-list-source],[data-ln-chart-source],[data-ln-options],[data-ln-stat]');
		for (let i = 0; i < allBound.length; i++) {
			const el = allBound[i];
			let storeName, kind;

			if (el.hasAttribute('data-ln-table-source')) {
				storeName = el.getAttribute('data-ln-table-source');
				kind = 'table';
			} else if (el.hasAttribute('data-ln-list-source')) {
				storeName = el.getAttribute('data-ln-list-source');
				kind = 'list';
			} else if (el.hasAttribute('data-ln-chart-source')) {
				storeName = el.getAttribute('data-ln-chart-source');
				kind = 'chart';
			} else if (el.hasAttribute('data-ln-options')) {
				storeName = el.getAttribute('data-ln-options');
				kind = 'options';
			} else if (el.hasAttribute('data-ln-stat')) {
				storeName = el.getAttribute('data-ln-stat');
				kind = 'stat';
			}

			if (!self._ownsStore(storeName)) continue;

			const children = self.findChildren();
			const store = children.store;

			if (kind === 'table' || kind === 'list') {
				const windowAttr = kind === 'table' ? 'data-ln-table-window' : 'data-ln-list-window';
				if (el.hasAttribute(windowAttr)) {
					// A windowed view holds no rows to re-serve — it is told to restart
					// its window (query change) or refresh it in place (post-mutation),
					// and pulls the pages back through request-data.
					dispatch(el, 'ln-' + kind + (isQueryChange ? ':request-invalidate' : ':request-revalidate'), {});
					continue;
				}
			}
			if (kind === 'table' || kind === 'list' || kind === 'chart') {
				const cached = self._boundQueries.get(el) || { sort: null, filters: {}, search: '' };
				const effective = composeQuery(cached, store.query);

				// Same read policy the view-initiated path applies. Without this the
				// store-change refresh would query the cache even when the store has
				// been told to leave queries to the server.
				if (selectDataSource(store, children.connector) === 'remote') {
					dispatch(el, 'ln-' + kind + ':set-loading', { loading: true });
					dispatch(children.connectorEl, 'ln-api-connector:request-query', {
						query: effective,
						meta: { targetEl: el, kind: kind, offset: effective.offset, limit: effective.limit }
					});
					continue;
				}

				(function (capturedEl, capturedKind) {
					store.getAll(effective).then(function (r) {
						const detail = {
							data: r.data,
							total: (syncMeta && syncMeta.total !== undefined) ? syncMeta.total : r.total,
							filtered: (syncMeta && syncMeta.filtered !== undefined) ? syncMeta.filtered : r.filtered,
							offset: (r.offset !== undefined) ? r.offset
								: ((syncMeta && syncMeta.offset !== undefined) ? syncMeta.offset : cached.offset),
							queryGen: (r.queryGen !== undefined) ? r.queryGen
								: ((syncMeta && syncMeta.queryGen !== undefined) ? syncMeta.queryGen : cached.queryGen)
						};
						dispatch(capturedEl, 'ln-' + capturedKind + ':set-loading', { loading: false });
						dispatch(capturedEl, 'ln-' + capturedKind + ':set-data', detail);
						self._boundDelivered.set(capturedEl, true);
					});
				})(el, kind);
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
			self.dom.removeEventListener('ln-data-store:request-remote-sync', self._handlers.sync);
			self.dom.removeEventListener('ln-data-store:request-page', self._handlers.requestPage);

			self.dom.removeEventListener('ln-data-coordinator:request-create', self._handlers.reqCreate);
			self.dom.removeEventListener('ln-data-coordinator:request-update', self._handlers.reqUpdate);
			self.dom.removeEventListener('ln-data-coordinator:request-delete', self._handlers.reqDelete);
			self.dom.removeEventListener('ln-data-coordinator:request-bulk-delete', self._handlers.reqBulkDelete);

			self.dom.removeEventListener('ln-api-queue:send', self._handlers.queueSend);
			self.dom.removeEventListener('ln-api-queue:failed', self._handlers.queueFailed);
			self.dom.removeEventListener('ln-data-store:initialized', self._handlers.storeInitialized);

			document.removeEventListener('submit', self._handlers.formSubmit);

			CONNECTOR_RESPONSE_NAMESPACES.forEach(function (ns) {
				self.dom.removeEventListener(ns + ':fetched', self._handlers.connFetched);
				self.dom.removeEventListener(ns + ':created', self._handlers.connCreated);
				self.dom.removeEventListener(ns + ':updated', self._handlers.connUpdated);
				self.dom.removeEventListener(ns + ':deleted', self._handlers.connDeleted);
				self.dom.removeEventListener(ns + ':bulk-deleted', self._handlers.connBulkDeleted);
				self.dom.removeEventListener(ns + ':error', self._handlers.connError);
			});

			// View binder — document-level listeners
			document.removeEventListener('ln-table:request-data', self._handlers.reqTableData);
			document.removeEventListener('ln-list:request-data', self._handlers.reqListData);
			document.removeEventListener('ln-chart:request-data', self._handlers.reqChartData);
			document.removeEventListener('ln-options:request-data', self._handlers.reqOptions);
			document.removeEventListener('ln-stat:request-count', self._handlers.reqStat);

			// Store-change listeners
			self.dom.removeEventListener('ln-data-store:ready', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:created', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:updated', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:deleted', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:mutation-error', self._handlers.mutationError);
			self.dom.removeEventListener('ln-data-store:synced', self._handlers.refreshSynced);
			self.dom.removeEventListener('ln-data-store:query-changed', self._handlers.refreshQuery);

			self._handlers = null;
		}

		self._boundQueries = null;
		self._boundDelivered = null;
		self._mutationReceipts.close(new Error('Data coordinator destroyed'));
		self._mutationReceipts = null;

		_coordinators.delete(this);
		_uninstallGlobalSync();

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
