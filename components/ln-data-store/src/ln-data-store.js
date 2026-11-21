import { registerComponent, dispatch, setCryptoKey, getCryptoKey, encryptData, decryptData, defineAttrs, attrSpec, attrBool, attrList } from '../../ln-core';
import { aggregateRecords, decorateRecords, filterRecords, queryRecords, checkNeedsUpgrade, normalizeSyncError, parseSeedRecords } from './data-store-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-data-store';
	const DOM_ATTRIBUTE = 'lnDataStore';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Custom Attribute Readers ───────────────────────────
	// 'never' / '-1' mean "no staleness", everything unparsable means the default.
	function _readStale(el, name, fallback) {
		const raw = el.getAttribute(name);
		if (raw === 'never' || raw === '-1') return -1;
		const parsed = parseInt(raw, 10);
		return isNaN(parsed) ? fallback : parsed;
	}

	// ─── Attribute Contract (SSOT) ──────────────────────────
	const ATTRIBUTES = {
		'data-ln-data-store':                  { type: 'marker', effect: _markFrozen, description: 'Identifies the element as a data-store definition container' },
		'data-ln-data-store-indexes':          { type: 'list', effect: _markFrozen, description: 'Comma-separated index field names for the IndexedDB store' },
		'data-ln-data-store-seed':             { type: 'string', description: 'Selector or element ID of an external seed script block' },
		'data-ln-data-store-stale':            { prop: '_staleThreshold', type: 'integer', read: _readStale, fallback: 300, description: 'Cache staleness threshold in seconds, or -1/never' },
		'data-ln-data-store-search-fields':    { prop: '_searchFields', type: 'list', read: attrList, description: 'Record fields to index for client-side search' },
		'data-ln-data-store-no-local-query':   { prop: 'noLocalQuery', type: 'boolean', read: attrBool, description: 'Bypasses local IndexedDB query resolution, forcing remote fetching' },
		'data-ln-data-store-frozen':           { type: 'marker', description: 'Applied at runtime to indicate store schema is locked in IndexedDB' }
	};

	const ATTR_SPEC = attrSpec(ATTRIBUTES);

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
				console.warn('[ln-data-store] IndexedDB is not available in this environment');
				return resolve(null);
			}

			const required = _getRequiredStores();
			const requiredNames = Object.keys(required);
			const probe = indexedDB.open(DB_NAME);

			probe.onerror = () => {
				console.warn('[ln-data-store] IndexedDB open failed');
				resolve(null);
			};

			probe.onsuccess = e => {
				const db = e.target.result;
				const existing = Array.from(db.objectStoreNames);
				const existingRequired = requiredNames.filter(name => existing.includes(name));

				let existingIndexMap = {};
				if (existingRequired.length > 0) {
					const tx = db.transaction(existingRequired, 'readonly');
					for (const name of existingRequired) {
						existingIndexMap[name] = Array.from(tx.objectStore(name).indexNames);
					}
				}

				const needsUpgrade = checkNeedsUpgrade(existing, required, existingIndexMap, META_STORE);

				if (!needsUpgrade) {
					_setupVersionChangeHandler(db);
					_db = db;
					return resolve(db);
				}

				const currentVersion = db.version;
				db.close();

				const upgrade = indexedDB.open(DB_NAME, currentVersion + 1);
				let settled = false;
				let blockedTimeout = null;

				upgrade.onblocked = () => {
					console.warn('[ln-data-store] Database upgrade blocked — waiting for other tabs to close connection');
					dispatch(document, 'ln-data-store:blocked', { db: DB_NAME });
					if (!blockedTimeout) {
						blockedTimeout = setTimeout(() => {
							if (settled) return;
							console.warn('[ln-data-store] Database upgrade timed out while blocked');
							settled = true;
							_dbReady = null;
							resolve(null);
						}, 5000);
					}
				};

				upgrade.onerror = () => {
					if (settled) return;
					if (blockedTimeout) clearTimeout(blockedTimeout);
					settled = true;
					_dbReady = null;
					console.warn('[ln-data-store] Database upgrade failed');
					resolve(null);
				};

				upgrade.onupgradeneeded = e => {
					const db = e.target.result;
					const tx = e.target.transaction;
					if (!db.objectStoreNames.contains(META_STORE)) {
						db.createObjectStore(META_STORE, { keyPath: 'key' });
					}
					for (const storeName of requiredNames) {
						if (!db.objectStoreNames.contains(storeName)) {
							const store = db.createObjectStore(storeName, { keyPath: 'id' });
							for (const idx of required[storeName].indexes) {
								store.createIndex(idx, idx, { unique: false });
							}
						} else {
							const store = tx.objectStore(storeName);
							for (const idx of required[storeName].indexes) {
								if (!store.indexNames.contains(idx)) {
									store.createIndex(idx, idx, { unique: false });
								}
							}
						}
					}
				};

				upgrade.onsuccess = e => {
					if (settled) {
						if (e.target.result) e.target.result.close();
						return;
					}
					if (blockedTimeout) clearTimeout(blockedTimeout);
					settled = true;
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
			...encryptedPayload,
			id: recordId
		};
	}

	async function _decryptRecord(record) {
		if (!record || !record.encrypted || !getCryptoKey()) return record;
		return decryptData(record, { silent: true });
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
		.then(store => {
			if (!store) return null;
			return _idbRequest(store.get(id)).then(res => {
				if (res !== undefined) return res;
				if (typeof id === 'string' && id.trim() !== '' && !isNaN(Number(id))) {
					return _idbRequest(store.get(Number(id)));
				}
				if (typeof id === 'number') {
					return _idbRequest(store.get(String(id)));
				}
				return null;
			});
		})
		.then(record => record ? _decryptRecord(record) : null);

	const _putRecord = (storeName, record) => {
		const prepPromise = getCryptoKey() ? _encryptRecord(record) : Promise.resolve(record);
		return prepPromise.then(prepped => _tx(storeName, 'readwrite').then(store => store ? _idbRequest(store.put(prepped)) : null));
	};

	const _deleteRecord = (storeName, id) => _tx(storeName, 'readwrite').then(store => {
		if (!store) return null;
		return _idbRequest(store.delete(id)).then(() => {
			if (typeof id === 'string' && id.trim() !== '' && !isNaN(Number(id))) {
				return _idbRequest(store.delete(Number(id)));
			}
			if (typeof id === 'number') {
				return _idbRequest(store.delete(String(id)));
			}
		});
	});
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

		defineAttrs(this, dom, ATTR_SPEC);

		this._handlers = null;

		this.isLoaded = false;
		// Two different questions that shared one flag until they were split.
		// isLoaded: a full sync has landed, so the cache is authoritative and sync
		// staleness may be judged against it. canServe: records are held that can
		// answer a read. A page fetch grants the second without granting the first.
		this.canServe = false;
		this.isInitialized = false;
		this.initializationError = null;
		this.hasCache = false;
		this.isSyncing = false;
		this.lastSyncedAt = null;
		// Opt out of answering reads from the cache: queries wait for the server.
		// Read live off the host — see the effects map at registration.
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
			self.canServe = true;
			return _setMeta(self._name, {
				schema_version: SCHEMA_VERSION,
				last_synced_at: self.lastSyncedAt,
				has_cache: true,
				record_count: self.totalCount
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

			const canonicalId = existing.id;
			const updated = { ...existing, ...data, id: canonicalId };
			const newId = data.id;
			const isRekey = newId !== undefined && newId !== canonicalId;

			const write = isRekey
				? _rekeyRecord(self._name, canonicalId, { ...updated, id: newId })
				: _putRecord(self._name, updated);

			return write.then(() => _persistMutationMeta(self)).then(() => {
				dispatch(self.dom, 'ln-data-store:updated', { store: self._name, record: isRekey ? { ...updated, id: newId } : updated, previous: existing, requestId });
			});
		});
	}

	function _handleDeleteRequest(self, { id, requestId } = {}) {
		return _getRecord(self._name, id).then(existing => {
			if (!existing) {
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, id, requestId, missing: true });
				return;
			}

			const canonicalId = existing.id;
			return _deleteRecord(self._name, canonicalId).then(() => _persistMutationMeta(self)).then(() => {
				dispatch(self.dom, 'ln-data-store:deleted', { store: self._name, id: canonicalId, requestId });
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

	function _readSeedRecords(self) {
		let scriptEl = null;
		const seedSelector = self.dom.getAttribute('data-ln-data-store-seed');
		if (seedSelector) {
			scriptEl = document.getElementById(seedSelector);
			if (!scriptEl) {
				try {
					scriptEl = document.querySelector(seedSelector);
				} catch (_) {}
			}
		}
		if (!scriptEl) {
			scriptEl = self.dom.querySelector('script[type="application/json"]') || self.dom.querySelector('script');
		}
		if (scriptEl && scriptEl.textContent) {
			return parseSeedRecords(scriptEl.textContent);
		}
		return null;
	}

	function _initStore(self) {
		const seedRecords = _readSeedRecords(self);
		self._seedRecords = seedRecords;

		if (seedRecords) {
			self.lastSyncedAt = Math.floor(Date.now() / 1000);
			self.totalCount = seedRecords.length;
			self.hasCache = true;
			self.isLoaded = true;
			self.canServe = true;
			self.isInitialized = true;
			setTimeout(() => {
				dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'seed' });
				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: true, lastSyncedAt: self.lastSyncedAt, count: self.totalCount, source: 'seed' });
			}, 0);

			// Persist seed asynchronously to IndexedDB in background without blocking immediate queries
			_openDatabase().then(db => {
				if (!db) return;
				return _clearStore(self._name)
					.then(() => _putBulk(self._name, seedRecords))
					.then(() => _setMeta(self._name, {
						schema_version: SCHEMA_VERSION,
						last_synced_at: self.lastSyncedAt,
						has_cache: true,
						record_count: self.totalCount
					}));
			}).catch(() => {});

			return Promise.resolve({ ok: true, source: 'seed' });
		}

		return _openDatabase().then(db => {
			if (!db) throw new Error('IndexedDB is unavailable');
			return _getMeta(self._name);
		}).then(meta => {
			if (seedRecords) return;
			self.initializationError = null;
			if (meta && meta.schema_version === SCHEMA_VERSION) {
				self.lastSyncedAt = meta.last_synced_at || null;
				self.totalCount = meta.record_count || 0;
				self.hasCache = meta.has_cache === true || self.totalCount > 0;

				if (self.hasCache) {
					self.isLoaded = true;
					self.canServe = true;
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
			if (seedRecords) {
				self.lastSyncedAt = Math.floor(Date.now() / 1000);
				self.totalCount = seedRecords.length;
				self.hasCache = true;
				self.isLoaded = true;
				self.canServe = true;
				self.isInitialized = true;
				dispatch(self.dom, 'ln-data-store:ready', { store: self._name, count: self.totalCount, source: 'seed' });
				dispatch(self.dom, 'ln-data-store:initialized', { store: self._name, hasCache: true, lastSyncedAt: self.lastSyncedAt, count: self.totalCount, source: 'seed' });
				return { ok: true, source: 'seed' };
			}
			self.isInitialized = true;
			self.isLoaded = false;
			self.canServe = false;
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
				ids.forEach(id => {
					store.delete(id);
					if (typeof id === 'string' && id.trim() !== '' && !isNaN(Number(id))) {
						store.delete(Number(id));
					} else if (typeof id === 'number') {
						store.delete(String(id));
					}
				});
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

	const _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	function _aggregate(records, field, fn) {
		return aggregateRecords(records, field, fn);
	}

	function _decorate(self, records) {
		return decorateRecords(records, self.presenters && self.presenters.computed);
	}

	// ─── Public CRUD & Sync APIs ───────────────────────────

	function _queryLocal(self, records, options) {
		return queryRecords(records, options, self._searchFields, _collator);
	}

	_component.prototype.getAll = function (options = {}) {
		const self = this;
		if (self._seedRecords) {
			const r = _queryLocal(self, self._seedRecords, options);
			return Promise.resolve({
				data: _decorate(self, r.records),
				total: r.total,
				filtered: r.filtered
			});
		}

		return _getAllRecords(self._name).then(records => {
			const r = _queryLocal(self, records, options);
			return {
				data: _decorate(self, r.records),
				total: r.total,
				filtered: r.filtered
			};
		});
	};

	_component.prototype.getById = function (id) {
		return _getRecord(this._name, id).then(record => record ? _decorate(this, [record])[0] : null);
	};

	_component.prototype.count = function (filters) {
		if (this._seedRecords) {
			const hasFilters = filters && Object.keys(filters).length > 0;
			return Promise.resolve(hasFilters ? filterRecords(this._seedRecords, filters).length : this._seedRecords.length);
		}
		const hasFilters = filters && Object.keys(filters).length > 0;
		if (!hasFilters) return _countRecords(this._name);
		return _getAllRecords(this._name).then(records => filterRecords(records, filters).length);
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

		let chain = _getDb().then(db => {
			if (!db) throw new Error('IndexedDB unavailable');
		});
		if (upsertedRecords.length > 0) chain = chain.then(() => _putBulk(self._name, upsertedRecords));
		if (deletedIds.length > 0) chain = chain.then(() => _deleteBulk(self._name, deletedIds));

		return chain.then(() => _countRecords(self._name)).then(count => {
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
			self.canServe = true;
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
			return { ok: true };
		}).catch(err => {
			self.isSyncing = false;
			const errorMsg = (err && err.message) ? err.message : String(err);
			console.error('[ln-data-store] applySync failed:', err);
			dispatch(self.dom, 'ln-data-store:sync-error', {
				store: self._name,
				error: errorMsg
			});
			return normalizeSyncError(err);
		});
	};

	_component.prototype.applyQuery = function (upsertedRecords, meta) {
		meta = meta || {};
		const self = this;

		let chain = Promise.resolve();
		if (upsertedRecords.length > 0) {
			chain = chain.then(() => _putBulk(self._name, upsertedRecords));
		}

		return chain.then(() => _countRecords(self._name)).then(count => {
			self.totalCount = meta.total !== undefined ? meta.total : count;
			// record_count/has_cache/isLoaded stay untouched — a page fetch is not an
			// authoritative cache; it would corrupt _isStale/storeInitialized sync gating.
			// It does leave records behind, so the store can serve reads from here on.
			if (upsertedRecords.length > 0) self.canServe = true;
			return _decorate(self, upsertedRecords);
		}).catch(err => {
			console.error('[ln-data-store] applyQuery failed:', err);
			return [];
		});
	};

	// ─── Manual Triggers & Cleanup ─────────────────────────

	_component.prototype.forceSync = function () {
		if (this.isSyncing) return;
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
		if (this._handlers) {
			for (const [event, fn] of Object.entries(this._handlers)) {
				this.dom.removeEventListener(`ln-data-store:request-${event}`, fn);
			}
			this._handlers = null;
		}

		delete _stores[this._name];

		delete this.dom[DOM_ATTRIBUTE];
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
				inst.canServe = false;
				inst.isInitialized = false;
				inst.initializationError = null;
				inst.hasCache = false;
				inst.isSyncing = false;
				inst.lastSyncedAt = null;
				inst.totalCount = 0;
			});
		});
	}

	// ─── Registration ──────────────────────────────────────

	const FROZEN_ATTR = 'data-ln-data-store-frozen';

	// The IndexedDB schema and the store's registered name are fixed at open
	// time: createIndex is only legal inside a versionchange transaction
	// (see onupgradeneeded). A post-init edit is recorded on the host
	// for the dev stylesheet to surface; nothing is applied.
	function _markFrozen(el, attrName) {
		el.setAttribute(FROZEN_ATTR, attrName);
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-store', {
		attributes: ATTRIBUTES
	});

	window[DOM_ATTRIBUTE].clearAll = _clearAll;
	window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];
	window[DOM_ATTRIBUTE].setStorageKey = setCryptoKey;

	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore.setStorageKey = setCryptoKey;
	}
})();
