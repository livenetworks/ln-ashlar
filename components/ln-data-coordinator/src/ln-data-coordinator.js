import { registerComponent, dispatch, serializeForm, resolveFormMethod, createBatcher, attrSpec, defineAttrs, uuid } from '../../ln-core';
import { normalizeDataQuery, selectDataSource, composeQuery } from './data-read-policy';
import { MutationReceipts } from './mutation-receipts';

(function () {
	const DOM_SELECTOR = 'data-ln-data-coordinator';
	const DOM_ATTRIBUTE = 'lnDataCoordinator';
	const SCOPE_ATTR = 'data-ln-data-coordinator-scope';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const SEARCH_ATTR = 'data-ln-data-coordinator-search';
	const FILTERS_ATTR = 'data-ln-data-coordinator-filters';
	const SORT_FIELD_ATTR = 'data-ln-data-coordinator-sort-field';
	const SORT_DIR_ATTR = 'data-ln-data-coordinator-sort-direction';

	const ATTRIBUTES = {
		'data-ln-data-coordinator':                { prop: '_name', type: 'string', description: 'Coordinator name or identifier for data routing' },
		'data-ln-data-coordinator-scope':          { type: 'string', description: 'Scope name addressing the bound data store and connector' },
		'data-ln-data-coordinator-connector':      { type: 'string', description: 'Selector, identifier, or namespace of the bound connector' },
		'data-ln-data-coordinator-mapper':         { type: 'string', description: 'Name of the registered data mapper transform' },
		'data-ln-data-coordinator-search':         { prop: '_searchAttr', type: 'string', description: 'Active search query term' },
		'data-ln-data-coordinator-filters':        { prop: '_filtersAttr', type: 'string', description: 'Active encoded filter parameters' },
		'data-ln-data-coordinator-sort-field':     { prop: '_sortFieldAttr', type: 'string', description: 'Sort field name' },
		'data-ln-data-coordinator-sort-direction': { prop: '_sortDirAttr', type: 'enum', values: ['asc', 'desc'], fallback: 'asc', description: 'Sort direction' },
		'data-ln-data-coordinator-stale':          { type: 'marker', description: 'Flag indicating data needs re-synchronization' },
		'data-ln-data-coordinator-no-autosync':    { type: 'boolean', description: 'Disables automatic synchronization upon state changes' }
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);
	const VIEW_TARGETS = [
		['[data-ln-table-source]', 'data-ln-table-source', 'table'],
		['[data-ln-list-source]', 'data-ln-list-source', 'list'],
		['[data-ln-chart-source]', 'data-ln-chart-source', 'chart'],
		['[data-ln-options]', 'data-ln-options', 'options'],
		['[data-ln-stat]', 'data-ln-stat', 'stat']
	];

	function _findConnectorEl(dom) {
		const target = dom.getAttribute('data-ln-data-coordinator-connector');
		if (target) return dom.querySelector(target) || document.querySelector(target) || document.getElementById(target);
		const standard = dom.querySelector('[data-ln-connector], [data-ln-api-connector], [data-ln-couchdb-connector], [data-ln-websocket-connector]');
		if (standard) return standard;
		for (const el of dom.querySelectorAll('*')) {
			if (el.lnConnector) return el;
			for (const a of el.attributes) if (a.name.startsWith('data-ln-') && a.name.endsWith('-connector')) return el;
		}
		return null;
	}

	function _connNs(el) {
		if (!el) return 'ln-connector';
		if (el.lnConnector?.namespace) return el.lnConnector.namespace;
		const exp = el.getAttribute('data-ln-connector');
		if (exp && exp !== 'true') return exp.startsWith('ln-') ? exp : ('ln-' + exp + (exp.endsWith('-connector') ? '' : '-connector'));
		for (const a of el.attributes) if (a.name.startsWith('data-ln-') && a.name.endsWith('-connector')) return a.name.replace(/^data-/, '');
		return 'ln-connector';
	}

	// ─── Component Constructor ─────────────────────────────
	function _component(dom) {
		const self = this;
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);
		if (!this._name) console.warn('[ln-data-coordinator] missing id — the coordinator cannot be addressed', dom);
		dom[DOM_ATTRIBUTE] = this;

		this._destroyed = false;
		this.mapper = null;
		this._unsubs = [];
		this._boundQueries = new WeakMap();
		this._boundDelivered = new WeakMap();
		this._mutationReceipts = new MutationReceipts();

		this._queueQueryRefresh = createBatcher(() => { if (!self._destroyed) self._refreshAll(null, true); });
		this.refreshMapper();
		_bindEvents(this);
		this._checkInitialSync();
		return this;
	}

	_component.prototype._noAutosync = function (c) {
		return this.dom.hasAttribute('data-ln-data-coordinator-no-autosync') || !!(c.storeEl?.hasAttribute('data-ln-data-store-no-autosync'));
	};

	_component.prototype._isStale = function (c) {
		const s = this.dom.getAttribute('data-ln-data-coordinator-stale') || c.storeEl?.getAttribute('data-ln-data-store-stale');
		if (s === 'never' || s === '-1') return false;
		return !c.store?.lastSyncedAt || ((Date.now() / 1000) - c.store.lastSyncedAt) > (parseInt(s, 10) || 300);
	};

	_component.prototype._checkInitialSync = function () {
		const self = this, c = this.findChildren();
		if (!c.store) return;
		Promise.resolve(c.store.ready).then(() => {
			if (self._destroyed) return;
			const cur = self.findChildren();
			if (cur.store && cur.connector && !self._noAutosync(cur) && !cur.store.isSyncing && (!cur.store.hasCache || self._isStale(cur))) {
				cur.store.forceSync();
			}
		}).catch(err => self._reportError('store-initialize', err, null));
	};

	_component.prototype.refreshMapper = function () {
		const name = this.dom.getAttribute('data-ln-data-coordinator-mapper') || this.dom.id;
		const m = (name && window.lnCore?.getDataMapper?.(name)) || null;
		this.mapper = { ingress: m?.ingress || (r => r), egress: m?.egress || (r => r) };
	};

	_component.prototype.findChildren = function () {
		const s = this.dom.querySelector('[data-ln-data-store]'), c = _findConnectorEl(this.dom), q = this.dom.querySelector('[data-ln-api-queue]');
		return { storeEl: s, connectorEl: c, queueEl: q, store: s?.lnDataStore || null, connector: c?.lnConnector || c?.lnApiConnector || c?.lnCouchDbConnector || c?.lnWebsocketConnector || null, queue: q?.lnApiQueue || null };
	};

	// ─── CRUD Intake & Fan-Out ───────────────────────────────
	_component.prototype._fanOutRemote = function (c, op, qPayload, cPayload) {
		this.refreshMapper();
		if (c.queue) dispatch(c.queueEl, 'ln-api-queue:request-enqueue', qPayload);
		else if (c.connector) dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-' + op, cPayload);
	};

	_component.prototype._fanOutCreate = function (c, data, action) {
		const tempId = '_temp_' + uuid(), payload = this.mapper.egress(data);
		if (c.storeEl) dispatch(c.storeEl, 'ln-data-store:request-create', { tempId, data: payload });
		this._fanOutRemote(c, 'create', { chainKey: tempId, op: 'create', targetId: null, payload, expectedVersion: null, meta: { tempId, action } }, { data: payload, url: action, meta: { entryId: uuid(), queued: false, op: 'create', tempId } });
	};

	_component.prototype._fanOutUpdate = function (c, id, data, v, action) {
		const payload = this.mapper.egress(data);
		if (c.storeEl) dispatch(c.storeEl, 'ln-data-store:request-update', { id, data: payload });
		this._fanOutRemote(c, 'update', { chainKey: id, op: 'update', targetId: id, payload, expectedVersion: v, meta: { id, action } }, { id, data: payload, expected_version: v, url: action, meta: { entryId: uuid(), queued: false, op: 'update', id } });
	};

	_component.prototype._fanOutDelete = function (c, id) {
		if (c.storeEl) dispatch(c.storeEl, 'ln-data-store:request-delete', { id });
		this._fanOutRemote(c, 'delete', { chainKey: id, op: 'delete', targetId: id, payload: null, expectedVersion: null, meta: { id } }, { id, meta: { entryId: uuid(), queued: false, op: 'delete', id } });
	};

	_component.prototype._fanOutBulkDelete = function (c, ids) {
		const bulkKey = ids.join(',');
		if (c.storeEl) dispatch(c.storeEl, 'ln-data-store:request-bulk-delete', { ids });
		this._fanOutRemote(c, 'bulk-delete', { chainKey: bulkKey, op: 'bulk-delete', targetId: null, payload: { ids }, expectedVersion: null, meta: { bulkKey, ids } }, { ids, meta: { entryId: uuid(), queued: false, op: 'bulk-delete', bulkKey } });
	};

	_component.prototype._requestStoreMutation = function (c, action, detail) {
		if (!c.storeEl) return Promise.reject(new Error('Store element not found'));
		const requestId = uuid(), receipt = this._mutationReceipts.wait(requestId);
		dispatch(c.storeEl, 'ln-data-store:request-' + action, Object.assign({}, detail, { requestId }));
		return receipt;
	};

	_component.prototype._reportError = function (operation, error, meta) {
		if (!this._destroyed) dispatch(this.dom, 'ln-data-coordinator:error', { operation, error, meta: meta || null });
	};

	// ─── Query State & View Serving ──────────────────────────
	_component.prototype._owns = function (name) {
		return !!name && name === this._name;
	};

	_component.prototype._currentQuery = function () {
		const field = this.dom.getAttribute(SORT_FIELD_ATTR), direction = this.dom.getAttribute(SORT_DIR_ATTR);
		const params = new URLSearchParams(this.dom.getAttribute(FILTERS_ATTR) || ''), filters = {};
		for (const key of new Set(params.keys())) filters[key] = params.getAll(key);
		return { search: this.dom.getAttribute(SEARCH_ATTR) || '', filters, sort: (field && direction) ? { field, direction } : null };
	};

	_component.prototype._refreshAll = function (syncMeta, isQueryChange) {
		for (const [sel, attr, kind] of VIEW_TARGETS) {
			for (const el of this.dom.ownerDocument.querySelectorAll(sel)) {
				if (!this._owns(el.getAttribute(attr))) continue;
				if ((kind === 'table' || kind === 'list') && el.hasAttribute(kind === 'table' ? 'data-ln-table-window' : 'data-ln-list-window')) {
					dispatch(el, 'ln-' + kind + (isQueryChange ? ':request-invalidate' : ':request-revalidate'), {});
					continue;
				}
				this._serveElement(el, kind, null, syncMeta);
			}
		}
	};

	_component.prototype._serveElement = function (el, kind, reqQuery, syncMeta) {
		const c = this.findChildren(), store = c.store;
		if (!store) return;
		if (reqQuery) this._boundQueries.set(el, reqQuery);
		const cached = this._boundQueries.get(el) || { sort: null, filters: {}, search: '' };
		const effective = composeQuery(cached, this._currentQuery());

		const self = this;
		return Promise.resolve(store.ready).then(() => {
			if (self._destroyed) return;
			const source = selectDataSource(store, c.connector);
			if (kind === 'table' || kind === 'list' || kind === 'chart') {
				if (source === 'remote') {
					dispatch(el, 'ln-' + kind + ':set-loading', { loading: true });
					return dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-query', { query: effective, meta: { targetEl: el, kind, offset: effective.offset, limit: effective.limit, queryGen: cached.queryGen } });
				}
				if (source !== 'store') return dispatch(el, 'ln-' + kind + ':set-loading', { loading: false });
				return store.getAll(effective).then(r => {
					if (self._destroyed || !self._boundDelivered) return;
					dispatch(el, 'ln-' + kind + ':set-loading', { loading: false });
					dispatch(el, 'ln-' + kind + ':set-data', { data: r.data, total: syncMeta?.total ?? r.total, filtered: syncMeta?.filtered ?? r.filtered, offset: r.offset ?? syncMeta?.offset ?? cached.offset, queryGen: cached.queryGen !== undefined ? cached.queryGen : (syncMeta?.queryGen ?? r.queryGen), provisional: r.provisional === true });
					self._boundDelivered.set(el, true);
				});
			}
			if (kind === 'options') {
				if (source === 'remote') return dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-query', { query: {}, meta: { targetEl: el, kind } });
				if (source === 'store') return store.getAll({}).then(r => !self._destroyed && dispatch(el, 'ln-options:set-data', { data: r.data }));
			}
			if (kind === 'stat') {
				let filters = reqQuery?.filters;
				if (!filters) {
					const raw = el.getAttribute('data-ln-stat-filter');
					if (raw?.includes(':')) { const p = raw.split(':'); filters = { [p[0].trim()]: [p.slice(1).join(':').trim()] }; }
				}
				const statSource = (c.connector && store && ((store.windowed && filters && Object.keys(filters).length) || store.noLocalQuery)) ? 'remote' : source;
				if (statSource === 'remote') return dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-query', { query: { filters }, meta: { targetEl: el, kind } });
				if (statSource === 'store') return store.count(filters).then(n => !self._destroyed && dispatch(el, 'ln-stat:set-count', { count: n }));
			}
		}).catch(err => {
			if (self._destroyed) return;
			if (kind === 'table' || kind === 'list' || kind === 'chart') dispatch(el, 'ln-' + kind + ':set-loading', { loading: false });
			self._reportError(kind + '-query', err, { targetEl: el, kind });
		});
	};

	// ─── Event Binding & Handlers ─────────────────────────────
	function _bindEvents(self) {
		const unsubs = self._unsubs = [];
		const addEventListener = (target, type, fn) => { target.addEventListener(type, fn); unsubs.push(() => target.removeEventListener(type, fn)); };

		addEventListener(self.dom, 'ln-data-store:request-remote-sync', e => {
			self.refreshMapper();
			const c = self.findChildren();
			if (c.store && c.connector) dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-sync', { since: e.detail.since, meta: { op: 'sync' } });
		});

		addEventListener(self.dom, 'ln-data-store:request-page', e => {
			const c = self.findChildren(), d = e.detail || {};
			if (!c.connectorEl) return;
			const effective = composeQuery(d.query || {}, self._currentQuery());
			dispatch(c.connectorEl, _connNs(c.connectorEl) + ':request-query', {
				query: Object.assign({}, effective, { offset: d.offset, limit: d.limit, queryGen: d.queryGen })
			});
		});

		addEventListener(self.dom, 'ln-data-coordinator:request-create', e => self._fanOutCreate(self.findChildren(), e.detail.data || {}, e.detail.action));
		addEventListener(self.dom, 'ln-data-coordinator:request-update', e => self._fanOutUpdate(self.findChildren(), e.detail.id, e.detail.data || {}, e.detail.expected_version, e.detail.action));
		addEventListener(self.dom, 'ln-data-coordinator:request-delete', e => self._fanOutDelete(self.findChildren(), e.detail.id));
		addEventListener(self.dom, 'ln-data-coordinator:request-bulk-delete', e => self._fanOutBulkDelete(self.findChildren(), e.detail.ids || []));
		addEventListener(self.dom, 'ln-api-queue:send', e => self._onQueueSend(e.detail || {}));
		addEventListener(self.dom, 'ln-api-queue:failed', e => self._reportError('queue-failed', e?.detail?.error || new Error('Queue failed'), e?.detail || null));

		addEventListener(self.dom, 'ln-data-store:initialized', e => {
			const c = self.findChildren();
			if (c.store && !c.store.initializationError && c.connector && !self._noAutosync(c) && !c.store.isSyncing && (!e.detail?.hasCache || self._isStale(c))) c.store.forceSync();
		});

		const onConnected = () => {
			const c = self.findChildren();
			if (c.store && !c.store.initializationError && c.connector && !self._noAutosync(c) && c.store.isInitialized && !c.store.isSyncing) c.store.forceSync();
		};
		addEventListener(self.dom, 'ln-websocket-connector:connected', onConnected);

		addEventListener(document, 'submit', e => self._onFormSubmit(e));
		const serve = (e, kind, attr) => {
			if (self._owns(e.target.getAttribute(attr))) self._serveElement(e.target, kind, kind === 'stat' ? { filters: e.detail?.filters || null } : (kind === 'options' ? null : normalizeDataQuery(e.detail || {})), null);
		};
		addEventListener(document, 'ln-table:request-data', e => serve(e, 'table', 'data-ln-table-source'));
		addEventListener(document, 'ln-list:request-data', e => serve(e, 'list', 'data-ln-list-source'));
		addEventListener(document, 'ln-chart:request-data', e => serve(e, 'chart', 'data-ln-chart-source'));
		addEventListener(document, 'ln-options:request-data', e => serve(e, 'options', 'data-ln-options'));
		addEventListener(document, 'ln-stat:request-count', e => serve(e, 'stat', 'data-ln-stat'));

		const refresh = e => { self._mutationReceipts.resolve(e.detail); self._refreshAll(null, false); };
		addEventListener(self.dom, 'ln-data-store:ready', refresh);
		addEventListener(self.dom, 'ln-data-store:created', refresh);
		addEventListener(self.dom, 'ln-data-store:updated', refresh);
		addEventListener(self.dom, 'ln-data-store:deleted', refresh);
		addEventListener(self.dom, 'ln-data-store:mutation-error', e => self._mutationReceipts.reject(e.detail));
		addEventListener(self.dom, 'ln-data-store:synced', e => { if (e.detail?.changed) self._refreshAll(e.detail.meta, false); });
		addEventListener(self.dom, 'ln-data-store:query-changed', () => self._refreshAll(null, true));

		addEventListener(self.dom, 'ln-search:change', e => {
			e.preventDefault();
			const term = e.detail?.term != null ? e.detail.term : '';
			if (term !== (self.dom.getAttribute(SEARCH_ATTR) || '')) self.dom.setAttribute(SEARCH_ATTR, term);
		});

		addEventListener(self.dom, 'ln-filter:change', e => {
			e.preventDefault();
			const key = e.detail?.key;
			if (!key) return;
			const values = (e.detail.values || []).slice(), filters = self._currentQuery().filters, prev = filters[key];
			if (prev ? (prev.length === values.length && prev.every((v, i) => v === values[i])) : !values.length) return;
			if (values.length) filters[key] = values; else delete filters[key];
			const p = new URLSearchParams();
			Object.keys(filters).forEach(k => filters[k].forEach(v => p.append(k, v)));
			const next = p.toString();
			if (next) self.dom.setAttribute(FILTERS_ATTR, next); else self.dom.removeAttribute(FILTERS_ATTR);
		});

		addEventListener(self.dom, 'ln-sort:change', e => {
			e.preventDefault();
			const f = e.detail?.field, d = e.detail?.direction;
			const next = (f && d && d !== 'none') ? { field: f, direction: d } : null, prev = self._currentQuery().sort;
			if ((!prev && !next) || (prev && next && prev.field === next.field && prev.direction === next.direction)) return;
			if (next) { self.dom.setAttribute(SORT_FIELD_ATTR, next.field); self.dom.setAttribute(SORT_DIR_ATTR, next.direction); }
			else { self.dom.removeAttribute(SORT_FIELD_ATTR); self.dom.removeAttribute(SORT_DIR_ATTR); }
		});

		const connNamespaces = new Set(['ln-api-connector', 'ln-couchdb-connector', 'ln-websocket-connector', 'ln-connector']);
		const childConn = self.findChildren().connectorEl;
		if (childConn) { const customNs = _connNs(childConn); connNamespaces.add(customNs); addEventListener(self.dom, customNs + ':connected', onConnected); }
		connNamespaces.forEach(ns => {
			addEventListener(self.dom, ns + ':fetched', e => self._reconcileServerFetch(e.detail));
			addEventListener(self.dom, ns + ':created', e => self._reconcileServerMutation('create', e.detail));
			addEventListener(self.dom, ns + ':updated', e => self._reconcileServerMutation('update', e.detail));
			addEventListener(self.dom, ns + ':deleted', e => self._reconcileServerMutation('ack', e.detail));
			addEventListener(self.dom, ns + ':bulk-deleted', e => self._reconcileServerMutation('ack', e.detail));
			addEventListener(self.dom, ns + ':error', e => self._reconcileServerMutation('error', e.detail));
		});
	}

	_component.prototype._onQueueSend = function (d) {
		this.refreshMapper();
		const c = this.findChildren();
		if (!c.store || !c.connector || !c.queue) return;
		const m = d.meta || {}, ns = _connNs(c.connectorEl), key = d.idempotencyKey || d.entryId;
		const actions = {
			create: () => dispatch(c.connectorEl, ns + ':request-create', { data: d.payload, url: m.action || null, idempotencyKey: key, meta: { entryId: d.entryId, queued: true, op: 'create', tempId: m.tempId } }),
			update: () => dispatch(c.connectorEl, ns + ':request-update', { id: d.targetId, data: d.payload, expected_version: d.expectedVersion, url: m.action || null, idempotencyKey: key, meta: { entryId: d.entryId, queued: true, op: 'update', id: d.targetId } }),
			delete: () => dispatch(c.connectorEl, ns + ':request-delete', { id: d.targetId, idempotencyKey: key, meta: { entryId: d.entryId, queued: true, op: 'delete', id: d.targetId } }),
			'bulk-delete': () => dispatch(c.connectorEl, ns + ':request-bulk-delete', { ids: d.payload?.ids || [], idempotencyKey: key, meta: { entryId: d.entryId, queued: true, op: 'bulk-delete', bulkKey: m.bulkKey } })
		};
		if (actions[d.op]) actions[d.op]();
	};

	_component.prototype._onFormSubmit = function (e) {
		const form = e.target;
		if (e.defaultPrevented) return;
		const scope = form.hasAttribute(SCOPE_ATTR) ? form.getAttribute(SCOPE_ATTR) : null;
		if (scope === null || (scope ? !this._owns(scope) : form.closest('[' + DOM_SELECTOR + ']') !== this.dom)) return;
		const method = resolveFormMethod(form);
		if (method !== 'POST' && method !== 'PUT' && method !== 'PATCH') return;
		e.preventDefault();
		const raw = serializeForm(form);
		delete raw._method; delete raw._token;
		const id = raw.id, v = raw.expected_version, action = form.getAttribute('action') || '', c = this.findChildren();
		delete raw.id; delete raw.expected_version;
		if (method === 'POST') this._fanOutCreate(c, raw, action);
		else this._fanOutUpdate(c, id, raw, v, action);
	};

	_component.prototype._reconcileServerFetch = function (d) {
		if (!d) return;
		const meta = d.meta || {}, c = this.findChildren(), raw = d.data;
		this.refreshMapper();
		const fetched = Array.isArray(raw) ? raw : (raw?.data || []);
		const deleted = Array.isArray(raw?.deleted) ? raw.deleted : [];
		const syncedAt = Array.isArray(raw) ? Math.floor(Date.now() / 1000) : (raw?.synced_at ?? raw?.since ?? Math.floor(Date.now() / 1000));
		const records = fetched.map(r => this.mapper.ingress(r));
		if (!c.store || c.store.initializationError) return;

		if (!meta.kind) return c.store.applySync(records, deleted, syncedAt, { total: d.total, filtered: d.filtered, offset: d.offset, queryGen: d.queryGen, targetEl: meta.targetEl });
		c.store.applyQuery(records, { total: d.total }).then(dec => {
			const k = meta.kind;
			if (k === 'table' || k === 'list' || k === 'chart') {
				dispatch(meta.targetEl, 'ln-' + k + ':set-loading', { loading: false });
				dispatch(meta.targetEl, 'ln-' + k + ':set-data', { data: dec, total: d.total ?? dec.length, filtered: d.filtered ?? dec.length, offset: d.offset, queryGen: meta.queryGen });
				this._boundDelivered.set(meta.targetEl, true);
			} else if (k === 'options') {
				c.store.getAll({}).then(r => dispatch(meta.targetEl, 'ln-options:set-data', { data: r.data }));
			} else if (k === 'stat') {
				dispatch(meta.targetEl, 'ln-stat:set-count', { count: d.filtered ?? d.total ?? records.length });
			}
		});
	};

	_component.prototype._reconcileServerMutation = function (type, d) {
		if (!d) return;
		const c = this.findChildren(), meta = d.meta || {};
		if (type === 'create') {
			if (!d.record) return this._reportError('create-empty-response', new Error('Create response missing record payload'), meta);
			const rec = this.mapper.ingress(d.record);
			(c.storeEl ? this._requestStoreMutation(c, 'update', { id: meta.tempId, data: rec }) : Promise.resolve()).then(() => {
				if (meta.queued && c.queue) dispatch(c.queueEl, 'ln-api-queue:resolve-create', { entryId: meta.entryId, oldKey: meta.tempId, newId: rec.id });
			}).catch(err => this._reportError('create-reconcile', err, meta));
		} else if (type === 'update') {
			const rec = d.record ? this.mapper.ingress(d.record) : null;
			(c.storeEl && rec ? this._requestStoreMutation(c, 'update', { id: meta.id, data: rec }) : Promise.resolve()).then(() => {
				if (meta.queued && c.queue) dispatch(c.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
			}).catch(err => this._reportError('update-reconcile', err, meta));
		} else if (type === 'ack') {
			if (meta.queued && c.queue) dispatch(c.queueEl, 'ln-api-queue:ack', { entryId: meta.entryId });
		} else if (type === 'error') {
			const status = d.status || d.error?.status || 0;
			if (meta.queued && c.queue) {
				dispatch(c.queueEl, 'ln-api-queue:nack', { entryId: meta.entryId, reason: (status === 401 || status === 419) ? 'auth' : ((status === 0 || status >= 500) ? 'retry' : 'drop') });
			}
			this._reportError('connector-error', d.error || d, meta);
		}
	};

	// ─── Destroy and Cleanup ──────────────────────────────────
	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;
		this._destroyed = true;
		while (this._unsubs?.length) this._unsubs.pop()();
		this._unsubs = this._boundQueries = this._boundDelivered = this._queueQueryRefresh = null;
		this._mutationReceipts.close(new Error('Data coordinator destroyed'));
		this._mutationReceipts = null;
		delete this.dom[DOM_ATTRIBUTE];
	};

	function _syncAttribute(el, attrName) {
		const inst = el[DOM_ATTRIBUTE];
		if (!inst) return;
		if (attrName === 'data-ln-data-coordinator-mapper') inst.refreshMapper();
		else if (attrName === SEARCH_ATTR || attrName === FILTERS_ATTR || attrName === SORT_FIELD_ATTR || attrName === SORT_DIR_ATTR) inst._queueQueryRefresh();
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-coordinator', {
		extraAttributes: ['data-ln-data-coordinator-mapper', SEARCH_ATTR, FILTERS_ATTR, SORT_FIELD_ATTR, SORT_DIR_ATTR],
		onAttributeChange: _syncAttribute
	});

	window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];
})();
