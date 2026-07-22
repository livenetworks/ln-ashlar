import { registerComponent, dispatch, buildDict, serializeForm, resolveFormMethod } from '../../ln-core';

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
				if (store && store.isLoaded && !store.isSyncing && !coord._noAutosync && coord._isStale()) {
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
		this._name = dom.getAttribute(DOM_SELECTOR);
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this;

		this.mapper = null;
		this._handlers = null;
		this._boundQueries = new WeakMap();
		this._boundDelivered = new WeakMap();
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
		if (!store || this._noAutosync) return;
		if (!(store.isLoaded && !store.isSyncing)) return;
		store.forceSync();
	};

	// ─── Race Guard: evaluate initial sync directly at children-resolve ────

	_component.prototype._checkInitialSync = function () {
		const children = this.findChildren();
		const store = children.store;
		if (!store || !store.isLoaded) return;
		if (this._noAutosync) return;

		if (store.totalCount === 0) {
			store.forceSync();
		} else if (this._isStale()) {
			store.forceSync();
		}
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

				if (op === 'create') {
					dispatch(children.connectorEl, 'ln-api-connector:request-create', {
						data: payload, url: resourceUrl,
						meta: { entryId: entryId, queued: true, op: 'create', tempId: queueMeta.tempId }
					});
				} else if (op === 'update') {
					dispatch(children.connectorEl, 'ln-api-connector:request-update', {
						id: targetId, data: payload, expected_version: expectedVersion, url: resourceUrl,
						meta: { entryId: entryId, queued: true, op: 'update', id: queueMeta.id !== undefined ? queueMeta.id : targetId }
					});
				} else if (op === 'delete') {
					dispatch(children.connectorEl, 'ln-api-connector:request-delete', {
						id: targetId,
						meta: { entryId: entryId, queued: true, op: 'delete', id: queueMeta.id !== undefined ? queueMeta.id : targetId }
					});
				} else if (op === 'bulk-delete') {
					dispatch(children.connectorEl, 'ln-api-connector:request-bulk-delete', {
						ids: (payload && payload.ids) ? payload.ids : [],
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
					isMine = (scopeAttr === self._name);
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
				const children = self.findChildren();
				if (!children.store) return;

				const rawResponse = e.detail.data;
				let rawRecords = [], deletedIds = [], syncedAt = null;

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
			},

			connCreated: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				const serverRecord = self.mapper.ingress(e.detail.record);

				dispatch(children.storeEl, 'ln-data-store:request-update', { id: meta.tempId, data: serverRecord });
				self._toastFromMessage(e.detail.message);

				if (meta.queued && children.queue) {
					dispatch(children.queueEl, 'ln-api-queue:request-remap', { oldKey: meta.tempId, newId: serverRecord.id });
					dispatch(children.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
				}
			},

			connUpdated: function (e) {
				const children = self.findChildren();
				if (!children.storeEl) return;
				const meta = e.detail.meta || {};
				const serverRecord = self.mapper.ingress(e.detail.record);

				dispatch(children.storeEl, 'ln-data-store:request-update', { id: meta.id, data: serverRecord });
				self._toastFromMessage(e.detail.message);

				if (meta.queued && children.queue) {
					dispatch(children.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
				}
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

				if (op === 'sync') {
					console.error('[ln-data-coordinator] Sync failed:', detail.error);
					return;
				}

				const children = self.findChildren();
				if (!children.storeEl) return;

				const isAuth      = status === 401 || status === 419;
				const isTransient = status === 0 || status >= 500;
				const isConflict  = status === 409;

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
				if (isConflict && op === 'update') {
					const remote = detail.data && detail.data.remote ? self.mapper.ingress(detail.data.remote) : null;
					if (remote) {
						dispatch(children.storeEl, 'ln-data-store:request-update', { id: meta.id, data: remote });
					}
					self._toastFromDict('conflict');
				} else if (op === 'create') {
					dispatch(children.storeEl, 'ln-data-store:request-delete', { id: meta.tempId });
					self._toastFromDict('rejected');
				} else {
					// update/delete/bulk generic 4xx (incl. 404): leave local, next sync reconciles
					self._toastFromDict('rejected');
				}

				if (meta.queued && children.queue) {
					dispatch(children.queueEl, 'ln-api-queue:nack', { entryId: meta.entryId, reason: 'drop' });
				}
			},

			// ─── Store Initialized (Sync Ownership) ───────────────
			storeInitialized: function (e) {
				const children = self.findChildren();
				const store = children.store;
				if (!store || self._noAutosync) return;

				const detail = e.detail || {};
				if (!detail.hasCache) {
					store.forceSync();
				} else if (self._isStale()) {
					store.forceSync();
				}
			},

			// ─── View Binder Handlers ─────────────────────────────
			reqTableData: function (e) { self._serveData(e, 'table'); },
			reqListData:  function (e) { self._serveData(e, 'list'); },
			reqOptions:   function (e) { self._serveOptions(e); },
			reqStat:      function (e) { self._serveStat(e); },
			refresh:      function ()  { self._refreshAll(); },
			refreshSynced: function (e) { if (e.detail && e.detail.changed) self._refreshAll(); }
		};

		// Sync request bubbling up from the child store
		self.dom.addEventListener('ln-data-store:request-remote-sync', self._handlers.sync);

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
		document.addEventListener('ln-list:request-data',  self._handlers.reqListData);
		document.addEventListener('ln-options:request-data', self._handlers.reqOptions);
		document.addEventListener('ln-stat:request-count',  self._handlers.reqStat);

		// Store-change refresh — attach to self.dom so bubbling store events are caught
		self.dom.addEventListener('ln-data-store:ready',   self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:loaded',  self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:created', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:updated', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:deleted', self._handlers.refresh);
		self.dom.addEventListener('ln-data-store:synced',  self._handlers.refreshSynced);
	}

	// ─── Store↔View Binder ───────────────────────────────────

	_component.prototype._ownsStore = function (name) {
		const children = this.findChildren();
		return !!(children.store && children.store._name === name && name);
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
		store.getAll(query).then(function (r) {
			const detail = { data: r.data, total: r.total, filtered: r.filtered };
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
				(function (capturedEl, capturedKind) {
					store.getAll(cached).then(function (r) {
						const detail = { data: r.data, total: r.total, filtered: r.filtered };
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
			document.removeEventListener('ln-list:request-data',  self._handlers.reqListData);
			document.removeEventListener('ln-options:request-data', self._handlers.reqOptions);
			document.removeEventListener('ln-stat:request-count',  self._handlers.reqStat);

			// Store-change listeners
			self.dom.removeEventListener('ln-data-store:ready',   self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:loaded',  self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:created', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:updated', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:deleted', self._handlers.refresh);
			self.dom.removeEventListener('ln-data-store:synced',  self._handlers.refreshSynced);

			self._handlers = null;
		}

		self._boundQueries = null;
		self._boundDelivered = null;

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
