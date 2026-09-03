import { registerComponent, dispatch, setCryptoKey, getCryptoKey, encryptData, decryptData } from '../../ln-core';
import { createWindowIndex } from './window-index.js';
import { aggregateRecords, decorateRecords, filterRecords, queryRecords } from './data-store-model.js';

(function () {
	const DOM_SELECTOR = 'data-ln-data-store';
	const DOM_ATTRIBUTE = 'lnDataStore';
	const NO_LOCAL_QUERY_ATTR = 'data-ln-data-store-no-local-query';

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
		this.query = { filters: {}, search: '', sort: null };
		const winAttr = dom.getAttribute('data-ln-data-store-window');
		if (winAttr !== null) {
			const winSize = parseInt(winAttr, 10) || 1000;
			const pageSize = parseInt(dom.getAttribute('data-ln-data-store-window-page'), 10) || 200;
			this._windowIndex = createWindowIndex({
				windowSize: winSize,
				pageSize: pageSize,
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
		this.windowed = this._windowIndex !== null;
		// Opt out of answering reads from the cache: queries wait for the server.
		// Read live so it can be flipped per situation — see onAttributeChange.
		this.noLocalQuery = dom.hasAttribute(NO_LOCAL_QUERY_ATTR);
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
			'ln-filter:change': e => {
				e.preventDefault();
				const key = e.detail && e.detail.key;
				if (!key) return;
				const values = (e.detail.values || []).slice();
				// Same no-op guard the search and sort handlers carry: a reset of a
				// filter that was never set is not a query change, and clear-all
				// resets every filter control on the page at once.
				const prev = self.query.filters[key];
				const unchanged = prev
					? (prev.length === values.length && prev.every((v, i) => v === values[i]))
					: !values.length;
				if (unchanged) return;
				if (values.length) self.query.filters[key] = values;
				else delete self.query.filters[key];
				_emitQueryChanged(self);
			},
			'ln-sort:change': e => {
				e.preventDefault();
				const field = e.detail && e.detail.field;
				const direction = e.detail && e.detail.direction;
				// ln-sort emits direction 'none' to mean "sort removed" — a truthy
				// string, so it has to be excluded explicitly or it travels to the
				// server as sort_dir=none.
				const next = (direction && direction !== 'none') ? { field, direction } : null;
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

	function _persistMutationMeta(self, deltaCount = 0) {
		return _countRecords(self._name).then(count => {
			if (self._windowIndex || self.windowed) {
				const current = self.totalCount != null ? self.totalCount : count;
				self.totalCount = Math.max(0, current + deltaCount);
			} else {
				self.totalCount = count;
			}
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

		return _putRecord(self._name, record).then(() => _persistMutationMeta(self, 1)).then(() => {
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

			return write.then(() => _persistMutationMeta(self, 0)).then(() => {
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

			return _deleteRecord(self._name, id).then(() => _persistMutationMeta(self, -1)).then(() => {
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

			return _deleteBulk(self._name, savedIds).then(() => _persistMutationMeta(self, -savedIds.length)).then(() => {
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

	const _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	function _filterKeys(filters) {
		if (!filters) return [];
		return Object.keys(filters).filter(k => Array.isArray(filters[k]) && filters[k].length > 0);
	}

	function _matchesFilters(record, keys, filters) {
		return keys.every(field => filters[field].map(String).includes(String(record[field])));
	}

	function _tokenize(query) {
		return String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
	}

	function _matchesTokens(record, tokens, searchFields) {
		return tokens.every(token =>
			searchFields.some(field => {
				const val = record[field];
				return val != null && String(val).toLowerCase().includes(token);
			})
		);
	}

	function _aggregate(records, field, fn) {
		return aggregateRecords(records, field, fn);
	}

	function _decorate(self, records) {
		return decorateRecords(records, self.presenters && self.presenters.computed);
	}

	// ─── Public CRUD & Sync APIs ───────────────────────────

	// ─── Query vs Paging ───────────────────────────────────
	//
	// Two separate concerns, deliberately kept apart. _queryLocal answers "which
	// records match, in what order" over the records this store actually holds.
	// _positionalPage answers "which record sits at logical row N" using the
	// server's ordering held in _windowIndex. A windowed store needs both; it must
	// not let the second stand in for the first.

	// Walks in primary-key order collecting matches and stops the moment the
	// requested slice is full, so the cost tracks the viewport instead of the store
	// (31ms vs 117ms for a 200-row slice out of 10k records).
	//
	// Legal only when the cursor's order already IS the output order, otherwise a
	// match past the cut could belong ahead of one inside it — so an active sort
	// disqualifies it. An encrypted store disqualifies it too: decryption is async
	// and an await inside the cursor callback lets the transaction close.
	//
	// When a full pass is unavoidable the getAll path is measurably cheaper than a
	// cursor (117ms vs 232ms over 10k), so that case is not routed here.
	function _canScanEarly(options) {
		return !options.sort && !getCryptoKey();
	}

	function _scanLocal(self, options, need) {
		const keys = _filterKeys(options.filters);
		const tokens = options.search ? _tokenize(options.search) : [];
		const searchFields = self._searchFields;
		const useSearch = tokens.length > 0 && searchFields && searchFields.length > 0;

		return _tx(self._name, 'readonly').then(store => {
			if (!store) return [];
			return new Promise((resolve, reject) => {
				const found = [];
				const request = store.openCursor();
				request.onsuccess = () => {
					const cursor = request.result;
					if (!cursor || found.length >= need) {
						resolve(found);
						return;
					}
					const record = cursor.value;
					const passes = (!keys.length || _matchesFilters(record, keys, options.filters))
						&& (!useSearch || _matchesTokens(record, tokens, searchFields));
					if (passes) found.push(record);
					cursor.continue();
				};
				request.onerror = () => reject(request.error);
			});
		});
	}

	function _queryLocal(self, records, options) {
		return queryRecords(records, options, self._searchFields, _collator);
	}

	function _positionalPage(self, offset, limit) {
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

	_component.prototype.getAll = function (options = {}) {
		const self = this;
		if (self._windowIndex) {
			const offset = options.offset || 0;
			const limit = options.limit || 200;
			self._windowIndex.ensure(offset, offset + limit, options);

			// The index holds no ordering for this query — it was reset the moment
			// the query changed. Until the server's first page lands the positions
			// are ours to assign, so the query is answered from the records already
			// held and flagged provisional; the server's answer supersedes it at the
			// next generation. Once the index HAS loaded its ordering is authoritative
			// and a page still missing stays a placeholder — splicing local records
			// into server positions would put the wrong record on the row.
			// Told to leave queries to the server: report the window as unresolved and
			// let the view hold the previous generation until the server answers. The
			// positional page below stays available either way — those rows are the
			// server's own answer, only materialised from cache.
			if (!self._windowIndex.hasLoaded && !self.noLocalQuery) {
				const need = offset + limit;
				// Rows only, never totals — see window-cache.ingest. Nothing to show
				// (empty store, or nothing matched locally) is not an answer either:
				// the positional page reports the window as unresolved and the view
				// keeps the previous generation until the server settles it.
				const provisional = records => records.length
					? {
						data: _decorate(self, records),
						offset: offset,
						queryGen: self._windowIndex.queryGen,
						provisional: true
					}
					: _positionalPage(self, offset, limit);

				if (_canScanEarly(options)) {
					return _scanLocal(self, options, need).then(matches =>
						provisional(matches.slice(offset, need)));
				}
				return _getAllRecords(self._name).then(records =>
					provisional(_queryLocal(self, records, options).records));
			}

			return _positionalPage(self, offset, limit);
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
		const hasFilters = filters && Object.keys(filters).length > 0;
		if (!hasFilters) {
			if (this.totalCount != null) return Promise.resolve(this.totalCount);
			return _countRecords(this._name);
		}
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
		if (self._windowIndex && meta.queryGen != null && meta.queryGen !== self._windowIndex.queryGen) {
			return Promise.resolve();
		}

		const hasChanges = upsertedRecords.length > 0 || deletedIds.length > 0;

		let chain = Promise.resolve();
		if (upsertedRecords.length > 0) chain = chain.then(() => _putBulk(self._name, upsertedRecords));
		if (deletedIds.length > 0) chain = chain.then(() => _deleteBulk(self._name, deletedIds));

		return chain.then(() => {
			if (self._windowIndex && (meta.offset != null || meta.total != null)) {
				const offset = meta.offset != null ? meta.offset : 0;
				const ids = upsertedRecords.map(r => r.id);
				// Residency is the index: what the window pushed out stops being held.
				const evicted = self._windowIndex.ingest(offset, ids, meta.total, meta.filtered, meta.queryGen);
				if (evicted && evicted.length) return _deleteBulk(self._name, evicted);
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
		}).catch(err => {
			self.isSyncing = false;
			console.error('[ln-data-store] applySync failed:', err);
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
		if (this._windowIndex) {
			this._windowIndex.clear();
			this._windowIndex = null;
			this.windowed = false;
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

	// The opt-out is policy for the next read, so a flip needs no invalidation —
	// nothing already delivered becomes wrong, the following query just resolves
	// under the new rule.
	function _syncAttribute(el, attrName) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || attrName !== NO_LOCAL_QUERY_ATTR) return;
		instance.noLocalQuery = el.hasAttribute(NO_LOCAL_QUERY_ATTR);
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-data-store', {
		extraAttributes: [NO_LOCAL_QUERY_ATTR],
		onAttributeChange: _syncAttribute
	});

	window[DOM_ATTRIBUTE].clearAll = _clearAll;
	window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];
	window[DOM_ATTRIBUTE].setStorageKey = setCryptoKey;

	if (typeof window !== 'undefined') {
		window.lnCore = window.lnCore || {};
		window.lnCore.setStorageKey = setCryptoKey;
	}
})();
