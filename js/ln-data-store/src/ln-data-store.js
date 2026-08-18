import { registerComponent, dispatch, setCryptoKey, getCryptoKey, encryptData, decryptData } from '../../ln-core';
import { createWindowIndex } from './window-index';

(function () {
	const DOM_SELECTOR = 'data-ln-data-store';
	const DOM_ATTRIBUTE = 'lnDataStore';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const DB_NAME = 'ln_app_cache';
	const META_STORE = '_meta';
	const SCHEMA_VERSION = '1.0';

	let _db = null;
	let _dbReady = null;
	const _stores = {};

	function _checkQuota(err) {
		if (err && err.name === 'QuotaExceededError') {
			dispatch(document, 'ln-data-store:quota-exceeded', { error: err });
		}
	}

	// ─── Database ──────────────────────────────────────────

	function _getRequiredStores() {
		const required = {};
		for (const el of document.querySelectorAll(`[${DOM_SELECTOR}]`)) {
			const name = el.id;
			if (name) {
				const indexAttr = el.getAttribute('data-ln-data-store-indexes') || '';
				required[name] = {
					indexes: indexAttr.split(',').map(s => s.trim()).filter(Boolean)
				};
			}
		}
		return required;
	}

	function _openDatabase() {
		if (_dbReady) return _dbReady;

		_dbReady = new Promise(resolve => {
			if (typeof indexedDB === 'undefined') {
				console.warn('[ln-data-store] IndexedDB not available — falling back to in-memory store');
				return resolve(null);
			}

			const required = _getRequiredStores();
			const requiredNames = Object.keys(required);
			const probe = indexedDB.open(DB_NAME);

			probe.onerror = () => {
				console.warn('[ln-data-store] IndexedDB open failed — falling back to in-memory store');
				resolve(null);
			};

			probe.onsuccess = e => {
				const db = e.target.result;
				const existing = Array.from(db.objectStoreNames);
				const needsUpgrade = !existing.includes(META_STORE) || requiredNames.some(name => !existing.includes(name));

				if (!needsUpgrade) {
					_setupVersionChangeHandler(db);
					_db = db;
					return resolve(db);
				}

				const currentVersion = db.version;
				db.close();

				const upgrade = indexedDB.open(DB_NAME, currentVersion + 1);

				upgrade.onblocked = () => {
					console.warn('[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection');
				};

				upgrade.onerror = () => {
					console.warn('[ln-data-store] Database upgrade failed');
					resolve(null);
				};

				upgrade.onupgradeneeded = e => {
					const db = e.target.result;
					if (!db.objectStoreNames.contains(META_STORE)) {
						db.createObjectStore(META_STORE, { keyPath: 'key' });
					}
					for (const storeName of requiredNames) {
						if (!db.objectStoreNames.contains(storeName)) {
							const store = db.createObjectStore(storeName, { keyPath: 'id' });
							for (const idx of required[storeName].indexes) {
								store.createIndex(idx, idx, { unique: false });
							}
						}
					}
				};

				upgrade.onsuccess = e => {
					const db = e.target.result;
					_setupVersionChangeHandler(db);
					_db = db;
					resolve(db);
				};
			};
		});

		return _dbReady;
	}

	function _setupVersionChangeHandler(db) {
		db.onversionchange = () => {
			db.close();
			_db = null;
			_dbReady = null;
		};
	}

	function _getDb() {
		if (_db) return Promise.resolve(_db);
		_dbReady = null;
		return _openDatabase();
	}

	// ─── Cryptographic Wrappers (DRY using ln-core) ──────────

	async function _encryptRecord(record) {
		if (!getCryptoKey() || !record) return record;

		// Isolate ID and metadata we want in plain text for IndexedDB queries
		const plainRecord = { ...record };
		const recordId = plainRecord.id;

		// Encrypt payload using core helper
		const encryptedPayload = await encryptData(plainRecord);
		if (!encryptedPayload || !encryptedPayload.encrypted) return record;

		return {
			id: recordId,
			encrypted: true,
			iv: encryptedPayload.iv,
			data: encryptedPayload.data
		};
	}

	async function _decryptRecord(record) {
		if (!record || !record.encrypted || !getCryptoKey()) return record;
		return decryptData(record);
	}

	// ─── IndexedDB CRUD Helpers ────────────────────────────

	const _tx = (storeName, mode) => _getDb().then(db => db ? db.transaction(storeName, mode).objectStore(storeName) : null);

	function _idbRequest(request) {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => {
				_checkQuota(request.error);
				reject(request.error);
			};
		});
	}

	const _getAllRecords = storeName => _tx(storeName, 'readonly')
		.then(store => store ? _idbRequest(store.getAll()) : [])
		.then(records => getCryptoKey() ? Promise.all(records.map(r => _decryptRecord(r))) : records);

	const _getRecord = (storeName, id) => _tx(storeName, 'readonly')
		.then(store => store ? _idbRequest(store.get(id)) : null)
		.then(record => record ? _decryptRecord(record) : null);

	const _getMultipleRecords = (storeName, ids) => _getDb().then(db => {
		if (!db) return [];
		const tx = db.transaction(storeName, 'readonly');
		const store = tx.objectStore(storeName);
		const promises = ids.map(id => _idbRequest(store.get(id)));
		return Promise.all(promises).then(records => {
			if (getCryptoKey()) {
				return Promise.all(records.map(r => _decryptRecord(r)));
			}
			return records;
		});
	});

	const _putRecord = (storeName, record) => {
		const prepPromise = getCryptoKey() ? _encryptRecord(record) : Promise.resolve(record);
		return prepPromise.then(prepped => _tx(storeName, 'readwrite').then(store => store ? _idbRequest(store.put(prepped)) : null));
	};

	const _deleteRecord = (storeName, id) => _tx(storeName, 'readwrite').then(store => store ? _idbRequest(store.delete(id)) : null);
	const _clearStore = storeName => _tx(storeName, 'readwrite').then(store => store ? _idbRequest(store.clear()) : null);
	const _countRecords = storeName => _tx(storeName, 'readonly').then(store => store ? _idbRequest(store.count()) : 0);

	// ─── Meta Store ────────────────────────────────────────

	const _getMeta = storeName => _tx(META_STORE, 'readonly').then(store => store ? _idbRequest(store.get(storeName)) : null);
	const _setMeta = (storeName, data) => _tx(META_STORE, 'readwrite').then(store => {
		if (!store) return;
		data.key = storeName;
		return _idbRequest(store.put(data));
	});

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._name = dom.id;
		if (!this._name) console.warn('[ln-data-store] missing id — the store cannot be addressed', dom);

		const staleAttr = dom.getAttribute('data-ln-data-store-stale');
		const _parsed = parseInt(staleAttr, 10);
		this._staleThreshold = (staleAttr === 'never' || staleAttr === '-1') ? -1 : (isNaN(_parsed) ? 300 : _parsed);

		const searchAttr = dom.getAttribute('data-ln-data-store-search-fields') || '';
		this._searchFields = searchAttr.split(',').map(s => s.trim()).filter(Boolean);

		this._handlers = null;

		this.isLoaded = false;
		this.isInitialized = false;
		this.initializationError = null;
		this.hasCache = false;
		this.isSyncing = false;
		this.lastSyncedAt = null;
		this.query = { filters: {}, search: '', sort: null };
		const winAttr = dom.getAttribute('data-ln-data-store-window');
		if (winAttr !== null) {
			const winSize = parseInt(winAttr, 10) || 1000;
			const pageSize = parseInt(dom.getAttribute('data-ln-data-store-window-page'), 10) || 200;
			const threshold = parseInt(dom.getAttribute('data-ln-data-store-window-threshold'), 10) || 25;
			this._windowIndex = createWindowIndex({
				windowSize: winSize,
				pageSize: pageSize,
				threshold: threshold,
				requestPage: (offset, limit, query) => {
					dispatch(this.dom, 'ln-data-store:request-page', {
						store: this._name,
						offset: offset,
						limit: limit,
						query: query,
						queryGen: this._windowIndex.queryGen
					});
				}
			});
		} else {
			this._windowIndex = null;
		}
		this.totalCount = 0;
		this.presenters = null;
		this._mutationChain = Promise.resolve();

		_stores[this._name] = this;

		_bindEvents(this);
		this.ready = _initStore(this);
		return this;
	}

	// ─── DOM Mutation Requests Listeners ────────────────────

	function _bindEvents(self) {
		self._handlers = {
			'create': e => _queueMutation(self, 'create', e.detail, () => _handleCreateRequest(self, e.detail)),
			'update': e => _queueMutation(self, 'update', e.detail, () => _handleUpdateRequest(self, e.detail)),
			'delete': e => _queueMutation(self, 'delete', e.detail, () => _handleDeleteRequest(self, e.detail)),
			'bulk-delete': e => _queueMutation(self, 'bulk-delete', e.detail, () => _handleBulkDeleteRequest(self, e.detail)),
			'sync-failed': e => {
				self.isSyncing = false;
				dispatch(self.dom, 'ln-data-store:sync-error', {
					store: self._name,
					error: e.detail && e.detail.error,
					status: e.detail && e.detail.status
				});
			}
		};
		for (const [event, fn] of Object.entries(self._handlers)) {
			self.dom.addEventListener(`ln-data-store:request-${event}`, fn);
		}

		self._queryHandlers = {
			'ln-search:change': e => {
				e.preventDefault();
				const term = (e.detail && e.detail.term != null) ? e.detail.term : '';
				if (term === self.query.search) return;
				self.query.search = term;
				_emitQueryChanged(self);
			},
			'ln-filter:changed': e => {
				const key = e.detail && e.detail.key;
				if (!key) return;
				const values = (e.detail.values || []).slice();
				if (values.length) self.query.filters[key] = values;
				else delete self.query.filters[key];
				_emitQueryChanged(self);
			},
			'ln-sort:changed': e => {
				const field = e.detail && e.detail.field;
				const direction = e.detail && e.detail.direction;
				const next = direction ? { field, direction } : null;
				const prev = self.query.sort;
				const unchanged = (!prev && !next) || (prev && next && prev.field === next.field && prev.direction === next.direction);
				if (unchanged) return;
				self.query.sort = next;
				_emitQueryChanged(self);
			}
		};
		for (const [event, fn] of Object.entries(self._queryHandlers)) {
			self.dom.addEventListener(event, fn);
		}
	}

	function _queueMutation(self, action, detail, operation) {
		const requestId = detail && detail.requestId;
		self._mutationChain = self._mutationChain
			.then(() => self.ready)
			.then(() => {
				if (self.initializationError) throw self.initializationError;
				return operation();
			})
			.catch(error => _mutationError(self, action, requestId, error));
		return self._mutationChain;
	}

	function _persistMutationMeta(self) {
		return _countRecords(self._name).then(count => {
			self.totalCount = count;
			self.hasCache = true;
			self.isLoaded = true;
			return _setMeta(self._name, {
				schema_version: SCHEMA_VERSION,
				last_synced_at: self.lastSyncedAt,
				has_cache: true,
				record_count: count
			});
		});
	}

	// ─── Optimistic Writing Pipeline ─────────────────────────

	function _handleCreateRequest(self, { tempId, data = {}, requestId } = {}) {
		const record = { ...data, id: tempId };

		return _putRecord(self._name, record).then(() => _persistMutationMeta(self)).then(() => {
			dispatch(self.dom, 'ln-data-store:created', { store: self._name, record, tempId, requestId });
		});
	}

	function _handleUpdateRequest(self, { id, data = {}, requestId } = {}) {
		return _getRecord(self._name, id).then(existing => {
			if (!existing) throw new Error(`Record not found: ${id}`);

			const updated = { ...existing, ...data };
			const newId = data.id;
			const isRekey = newId !== undefined && newId !== id;

			const write = isRekey
				? _rekeyRecord(self._name, id, updated)
				: _putRecord(self._name, updated);

			return write.then(() => _persistMutationMeta(self)).then(() => {
				dispatch(self.dom, 'ln-data-store:updated', { store: self._name, record: updated, previous: existing, requestId });
			});
		});
	}

	function _handleDeleteRequest(self, { id, requestId } = {}) {
		return _getRecord(self._name, id).then(existing => {
			if (!existing) {
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, id, requestId, missing: true });
				return;
			}

			return _deleteRecord(self._name, id).then(() => _persistMutationMeta(self)).then(() => {
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, id, requestId });
			});
		});
	}

	function _handleBulkDeleteRequest(self, { ids = [], requestId } = {}) {
		if (!ids.length) {
			dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, ids: [], requestId });
			return Promise.resolve();
		}

		return Promise.all(ids.map(id => _getRecord(self._name, id))).then(records => {
			const savedIds = records.filter(Boolean).map(r => r.id);

			return _deleteBulk(self._name, savedIds).then(() => _persistMutationMeta(self)).then(() => {
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, ids: savedIds, requestId });
			});
		});
	}

	function _mutationError(self, action, requestId, error) {
		console.error('[ln-data-store] ' + action + ' failed:', error);
		dispatch(self.dom, 'ln-data-store:mutation-error', {
			store: self._name,
			action,
			requestId,
			error
		});
	}

	// ─── Initialization ────────────────────────────────────

	function _initStore(self) {
		return _openDatabase().then(db => {
			if (!db) throw new Error('IndexedDB is unavailable');
			return _getMeta(self._name);
		}).then(meta => {
			self.initializationError = null;
			if (meta && meta.schema_version === SCHEMA_VERSION) {
				self.lastSyncedAt = meta.last_synced_at || null;
				self.totalCount = meta.record_count || 0;
				self.hasCache = meta.has_cache === true || self.totalCount > 0;

				if (self.hasCache) {
					self.isLoaded = true;
					dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'cache' });
				}

				self.isInitialized = true;
				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: self.hasCache, lastSyncedAt: self.lastSyncedAt, count: self.totalCount });
			} else if (meta && meta.schema_version !== SCHEMA_VERSION) {
				return _clearStore(self._name)
					.then(() => _setMeta(self._name, { schema_version: SCHEMA_VERSION, last_synced_at: null, has_cache: false, record_count: 0 }))
					.then(() => {
						self.isInitialized = true;
						self.hasCache = false;
						dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: false, lastSyncedAt: null, count: 0 });
					});
			} else {
				self.isInitialized = true;
				self.hasCache = false;
				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: false, lastSyncedAt: null, count: 0 });
			}
		}).catch(error => {
			self.isInitialized = true;
			self.isLoaded = false;
			self.hasCache = false;
			self.isSyncing = false;
			self.initializationError = error;
			dispatch(self.dom, 'ln-data-store:initialization-error', { store: self._name, error });
			return { ok: false, error };
		});
	}

	function _triggerRemoteSync(self) {
		self.isSyncing = true;
		dispatch(self.dom, 'ln-data-store:request-remote-sync', { since: self.lastSyncedAt });
	}

	// ─── Bulk IndexedDB Operations ─────────────────────────

	function _putBulk(storeName, records) {
		return _getDb().then(db => {
			if (!db) return;

			const prepPromise = getCryptoKey()
				? Promise.all(records.map(r => _encryptRecord(r)))
				: Promise.resolve(records);

			return prepPromise.then(preppedRecords => {
				return new Promise((resolve, reject) => {
					const tx = db.transaction(storeName, 'readwrite');
					const store = tx.objectStore(storeName);
					preppedRecords.forEach(r => store.put(r));
					tx.oncomplete = () => resolve();
					tx.onerror = () => {
						_checkQuota(tx.error);
						reject(tx.error);
					};
				});
			});
		});
	}

	function _deleteBulk(storeName, ids) {
		return _getDb().then(db => {
			if (!db) return;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				ids.forEach(id => store.delete(id));
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
		});
	}

	function _rekeyRecord(storeName, oldId, newRecord) {
		const prepPromise = getCryptoKey() ? _encryptRecord(newRecord) : Promise.resolve(newRecord);
		return prepPromise.then(prepped => _getDb().then(db => {
			if (!db) return;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				store.put(prepped);
				store.delete(oldId);
				tx.oncomplete = () => resolve();
				tx.onerror = () => { _checkQuota(tx.error); reject(tx.error); };
			});
		}));
	}

	// ─── Query Engine (In-Memory over Cache) ───────────────

	const _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	function _sort(records, sort) {
		if (!sort || !sort.field) return records;
		const { field, direction } = sort;
		const desc = direction === 'desc';

		return [...records].sort((a, b) => {
			const va = a[field];
			const vb = b[field];

			if (va == null && vb == null) return 0;
			if (va == null) return desc ? 1 : -1;
			if (vb == null) return desc ? -1 : 1;

			const result = (typeof va === 'string' && typeof vb === 'string')
				? _collator.compare(va, vb)
				: (va < vb ? -1 : va > vb ? 1 : 0);

			return desc ? -result : result;
		});
	}

	function _filter(records, filters) {
		if (!filters) return records;
		const keys = Object.keys(filters).filter(k => Array.isArray(filters[k]) && filters[k].length > 0);
		if (!keys.length) return records;

		return records.filter(record =>
			keys.every(field => filters[field].map(String).includes(String(record[field])))
		);
	}

	function _search(records, query, searchFields) {
		if (!query || !searchFields || !searchFields.length) return records;
		const lower = query.toLowerCase();
		return records.filter(record =>
			searchFields.some(field => {
				const val = record[field];
				return val != null && String(val).toLowerCase().includes(lower);
			})
		);
	}

	function _aggregate(records, field, fn) {
		if (!records.length) return 0;
		if (fn === 'count') return records.length;

		const numbers = records.map(r => parseFloat(r[field])).filter(v => !isNaN(v));
		const sum = numbers.reduce((a, b) => a + b, 0);

		if (fn === 'sum') return sum;
		if (fn === 'avg') return numbers.length ? sum / numbers.length : 0;
		return 0;
	}

	function _decorate(self, records) {
		if (!self.presenters || !self.presenters.computed) return records;
		const computed = self.presenters.computed;
		return records.map(record => {
			if (!record) return null;
			const copy = { ...record };
			for (const [fieldName, fn] of Object.entries(computed)) {
				try {
					copy[fieldName] = fn(record);
				} catch (err) {
					console.error(`[ln-data-store] Decorator computed field failed for ${fieldName}`, err);
				}
			}
			return copy;
		});
	}

	// ─── Public CRUD & Sync APIs ───────────────────────────

	_component.prototype.getAll = function (options = {}) {
		const self = this;
		if (self._windowIndex) {
			const offset = options.offset || 0;
			const limit = options.limit || 200;
			self._windowIndex.ensure(offset, offset + limit, options);

			const ids = [];
			for (let i = offset; i < offset + limit; i++) {
				const id = self._windowIndex.getId(i);
				ids.push(id);
			}

			const uniqueResolvedIds = Array.from(new Set(ids.filter(id => id !== undefined)));

			return _getMultipleRecords(self._name, uniqueResolvedIds).then(records => {
				const recordMap = new Map();
				for (let i = 0; i < records.length; i++) {
					const rec = records[i];
					if (rec) {
						recordMap.set(String(rec.id), rec);
					}
				}
				const data = [];
				for (let i = 0; i < ids.length; i++) {
					const id = ids[i];
					if (id === undefined) {
						data.push(null);
					} else {
						const rec = recordMap.get(String(id));
						data.push(rec || null);
					}
				}
				return {
					data: _decorate(self, data),
					total: self._windowIndex.grandTotal,
					filtered: self._windowIndex.logicalTotal,
					offset: offset,
					queryGen: self._windowIndex.queryGen
				};
			});
		}

		return _getAllRecords(self._name).then(records => {
			const total = records.length;

			if (options.filters) records = _filter(records, options.filters);
			if (options.search) records = _search(records, options.search, self._searchFields);

			const filtered = records.length;

			if (options.sort) records = _sort(records, options.sort);

			if (options.offset || options.limit) {
				const offset = options.offset || 0;
				const limit = options.limit || records.length;
				records = records.slice(offset, offset + limit);
			}

			return {
				data: _decorate(self, records),
				total,
				filtered
			};
		});
	};

	_component.prototype.getById = function (id) {
		return _getRecord(this._name, id).then(record => record ? _decorate(this, [record])[0] : null);
	};

	_component.prototype.count = function (filters) {
		return filters
			? _getAllRecords(this._name).then(records => _filter(records, filters).length)
			: _countRecords(this._name);
	};

	_component.prototype.aggregate = function (field, fn) {
		return _getAllRecords(this._name).then(records => _aggregate(records, field, fn));
	};

	_component.prototype.setPresenters = function (presenters) {
		this.presenters = presenters;
	};

	// ─── Public Remote Response Synchronization Methods ────

	_component.prototype.applySync = function (upsertedRecords, deletedIds, syncedAt, meta) {
		meta = meta || {};
		const self = this;

		if (self._windowIndex && meta.queryGen != null && meta.queryGen !== self._windowIndex.queryGen) {
			return Promise.resolve();
		}

		const hasChanges = upsertedRecords.length > 0 || deletedIds.length > 0;

		let chain = Promise.resolve();
		if (upsertedRecords.length > 0) chain = chain.then(() => _putBulk(self._name, upsertedRecords));
		if (deletedIds.length > 0) chain = chain.then(() => _deleteBulk(self._name, deletedIds));

		return chain.then(() => {
			if (self._windowIndex && meta.offset != null) {
				const ids = upsertedRecords.map(r => r.id);
				self._windowIndex.ingest(meta.offset, ids, meta.total, meta.filtered, meta.queryGen);
			}
		}).then(() => _countRecords(self._name)).then(count => {
			self.totalCount = meta.total !== undefined ? meta.total : count;
			self.hasCache = true;
			return _setMeta(self._name, {
				schema_version: SCHEMA_VERSION,
				last_synced_at: syncedAt,
				has_cache: true,
				record_count: self.totalCount
			});
		}).then(() => {
			const isInitialLoad = !self.isLoaded;
			self.isLoaded = true;
			self.isSyncing = false;
			self.lastSyncedAt = syncedAt;

			if (isInitialLoad) {
				dispatch(self.dom, 'ln-data-store:loaded', { store: self._name, count: self.totalCount, meta: meta });
				dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'server', meta: meta });
			} else {
				dispatch(self.dom, 'ln-data-store:synced', {
					store: self._name,
					added: upsertedRecords.length,
					deleted: deletedIds.length,
					changed: true,
					meta: meta
				});
			}
		}).catch(err => {
			self.isSyncing = false;
			console.error('[ln-data-store] applySync failed:', err);
		});
	};

	// ─── Manual Triggers & Cleanup ─────────────────────────

	_component.prototype.forceSync = function () {
		_triggerRemoteSync(this);
	};

	_component.prototype.fullReload = function () {
		const self = this;
		return _clearStore(self._name).then(() => _setMeta(self._name, {
			schema_version: SCHEMA_VERSION,
			last_synced_at: null,
			has_cache: false,
			record_count: 0
		})).then(() => {
			self.isLoaded = false;
			self.hasCache = false;
			self.lastSyncedAt = null;
			self.totalCount = 0;
			_triggerRemoteSync(self);
		});
	};

	_component.prototype.destroy = function () {
		if (this._windowIndex) {
			this._windowIndex.clear();
			this._windowIndex = null;
		}
		if (this._handlers) {
			for (const [event, fn] of Object.entries(this._handlers)) {
				this.dom.removeEventListener(`ln-data-store:request-${event}`, fn);
			}
			this._handlers = null;
		}
		if (this._queryHandlers) {
			for (const [event, fn] of Object.entries(this._queryHandlers)) {
				this.dom.removeEventListener(event, fn);
			}
			this._queryHandlers = null;
		}

		delete _stores[this._name];

		delete this.dom[DOM_ATTRIBUTE];
		dispatch(this.dom, 'ln-data-store:destroyed', { store: this._name });
	};

	// ─── clearAll (global) ─────────────────────────────────

	function _clearAll() {
		return _getDb().then(db => {
			if (!db) return;
			const storeNames = Array.from(db.objectStoreNames);
			return new Promise((resolve, reject) => {
				const tx = db.transaction(storeNames, 'readwrite');
				storeNames.forEach(name => tx.objectStore(name).clear());
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error);
			});
		}).then(() => {
			Object.values(_stores).forEach(inst => {
				inst.isLoaded = false;
				inst.isInitialized = false;
				inst.initializationError = null;
				inst.hasCache = false;
				inst.isSyncing = false;
				inst.lastSyncedAt = null;
				inst.totalCount = 0;
			});
		});
	}

	function _emitQueryChanged(self) {
		if (self._windowIndex) {
			self._windowIndex.reset();
		}
		dispatch(self.dom, 'ln-data-store:query-changed', {
			store: self._name,
			query: {
				filters: Object.assign({}, self.query.filters),
				search: self.query.search,
				sort: self.query.sort ? Object.assign({}, self.query.sort) : null
			}
		});
	}

	// ─── Registration ──────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-store');

	window[DOM_ATTRIBUTE].clearAll = _clearAll;
	window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];
	window[DOM_ATTRIBUTE].setStorageKey = setCryptoKey;

	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore.setStorageKey = setCryptoKey;
	}
})();
