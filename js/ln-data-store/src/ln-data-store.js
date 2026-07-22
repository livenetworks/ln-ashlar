import { registerComponent, dispatch, setCryptoKey, getCryptoKey, encryptData, decryptData } from '../../ln-core';

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
			const name = el.getAttribute(DOM_SELECTOR);
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
		this._name = dom.getAttribute(DOM_SELECTOR);

		const staleAttr = dom.getAttribute('data-ln-data-store-stale');
		const _parsed = parseInt(staleAttr, 10);
		this._staleThreshold = (staleAttr === 'never' || staleAttr === '-1') ? -1 : (isNaN(_parsed) ? 300 : _parsed);

		const searchAttr = dom.getAttribute('data-ln-data-store-search-fields') || '';
		this._searchFields = searchAttr.split(',').map(s => s.trim()).filter(Boolean);

		this._handlers = null;

		this.isLoaded = false;
		this.isSyncing = false;
		this.lastSyncedAt = null;
		this.totalCount = 0;
		this.presenters = null;

		_stores[this._name] = this;

		_bindEvents(this);
		_initStore(this);
		return this;
	}

	// ─── DOM Mutation Requests Listeners ────────────────────

	function _bindEvents(self) {
		self._handlers = {
			'create': e => _handleCreateRequest(self, e.detail),
			'update': e => _handleUpdateRequest(self, e.detail),
			'delete': e => _handleDeleteRequest(self, e.detail),
			'bulk-delete': e => _handleBulkDeleteRequest(self, e.detail)
		};
		for (const [event, fn] of Object.entries(self._handlers)) {
			self.dom.addEventListener(`ln-data-store:request-${event}`, fn);
		}
	}

	// ─── Optimistic Writing Pipeline ─────────────────────────

	function _handleCreateRequest(self, { tempId, data = {} } = {}) {
		const record = { ...data, id: tempId };

		_putRecord(self._name, record).then(() => {
			self.totalCount++;
			dispatch(self.dom, 'ln-data-store:created', { store: self._name, record, tempId });
		});
	}

	function _handleUpdateRequest(self, { id, data = {} } = {}) {
		_getRecord(self._name, id).then(existing => {
			if (!existing) throw new Error(`Record not found: ${id}`);

			const updated = { ...existing, ...data };
			const newId = data.id;
			const isRekey = newId !== undefined && newId !== id;

			const write = isRekey
				? _rekeyRecord(self._name, id, updated)
				: _putRecord(self._name, updated);

			return write.then(() => {
				dispatch(self.dom, 'ln-data-store:updated', { store: self._name, record: updated, previous: existing });
			});
		}).catch(err => console.error('[ln-data-store] Optimistic update failed:', err));
	}

	function _handleDeleteRequest(self, { id } = {}) {
		_getRecord(self._name, id).then(existing => {
			if (!existing) return;

			return _deleteRecord(self._name, id).then(() => {
				self.totalCount--;
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, id });
			});
		}).catch(err => console.error('[ln-data-store] Optimistic delete failed:', err));
	}

	function _handleBulkDeleteRequest(self, { ids = [] } = {}) {
		if (!ids.length) return;

		Promise.all(ids.map(id => _getRecord(self._name, id))).then(records => {
			const savedIds = records.filter(Boolean).map(r => r.id);

			return _deleteBulk(self._name, savedIds).then(() => {
				self.totalCount -= savedIds.length;
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, ids: savedIds });
			});
		}).catch(err => console.error('[ln-data-store] Optimistic bulk delete failed:', err));
	}

	// ─── Initialization ────────────────────────────────────

	function _initStore(self) {
		_openDatabase().then(() => _getMeta(self._name)).then(meta => {
			if (meta && meta.schema_version === SCHEMA_VERSION) {
				self.lastSyncedAt = meta.last_synced_at || null;
				self.totalCount = meta.record_count || 0;

				if (self.totalCount > 0) {
					self.isLoaded = true;
					dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'cache' });
				}

				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: self.totalCount > 0, lastSyncedAt: self.lastSyncedAt, count: self.totalCount });
			} else if (meta && meta.schema_version !== SCHEMA_VERSION) {
				_clearStore(self._name)
					.then(() => _setMeta(self._name, { schema_version: SCHEMA_VERSION, last_synced_at: null, record_count: 0 }))
					.then(() => dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: false, lastSyncedAt: null, count: 0 }));
			} else {
				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: false, lastSyncedAt: null, count: 0 });
			}
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

	_component.prototype.applySync = function (upsertedRecords, deletedIds, syncedAt) {
		const self = this;
		const hasChanges = upsertedRecords.length > 0 || deletedIds.length > 0;

		let chain = Promise.resolve();
		if (upsertedRecords.length > 0) chain = chain.then(() => _putBulk(self._name, upsertedRecords));
		if (deletedIds.length > 0) chain = chain.then(() => _deleteBulk(self._name, deletedIds));

		return chain.then(() => _countRecords(self._name)).then(count => {
			self.totalCount = count;
			return _setMeta(self._name, {
				schema_version: SCHEMA_VERSION,
				last_synced_at: syncedAt,
				record_count: count
			});
		}).then(() => {
			const isInitialLoad = !self.isLoaded;
			self.isLoaded = true;
			self.isSyncing = false;
			self.lastSyncedAt = syncedAt;

			if (isInitialLoad) {
				dispatch(self.dom, 'ln-data-store:loaded', { store: self._name, count: self.totalCount });
				dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'server' });
			} else {
				dispatch(self.dom, 'ln-data-store:synced', {
					store: self._name,
					added: upsertedRecords.length,
					deleted: deletedIds.length,
					changed: hasChanges
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
		return _clearStore(self._name).then(() => {
			self.isLoaded = false;
			self.lastSyncedAt = null;
			self.totalCount = 0;
			_triggerRemoteSync(self);
		});
	};

	_component.prototype.destroy = function () {
		if (this._handlers) {
			for (const [event, fn] of Object.entries(this._handlers)) {
				this.dom.removeEventListener(`ln-data-store:request-${event}`, fn);
			}
			this._handlers = null;
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
				inst.isSyncing = false;
				inst.lastSyncedAt = null;
				inst.totalCount = 0;
			});
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
