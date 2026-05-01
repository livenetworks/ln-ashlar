import { registerComponent, dispatch } from '../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-store';
	const DOM_ATTRIBUTE = 'lnStore';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const DB_NAME = 'ln_app_cache';
	const META_STORE = '_meta';
	const SCHEMA_VERSION = '1.0';

	let _db = null;
	let _dbReady = null; // Promise that resolves when db is open
	const _stores = {};  // name → { el, config }

	function _uuid() {
		try { return crypto.randomUUID(); }
		catch (_) {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				const r = Math.random() * 16 | 0;
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
	}

	function _checkQuota(err) {
		if (err && err.name === 'QuotaExceededError') {
			dispatch(document, 'ln-store:quota-exceeded', { error: err });
		}
	}

	// ─── Database ──────────────────────────────────────────

	function _getRequiredStores() {
		const els = document.querySelectorAll('[' + DOM_SELECTOR + ']');
		const required = {};
		for (let i = 0; i < els.length; i++) {
			const name = els[i].getAttribute(DOM_SELECTOR);
			if (name) {
				required[name] = {
					indexes: (els[i].getAttribute('data-ln-store-indexes') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean)
				};
			}
		}
		return required;
	}

	function _openDatabase() {
		if (_dbReady) return _dbReady;

		_dbReady = new Promise(function (resolve, reject) {
			if (typeof indexedDB === 'undefined') {
				console.warn('[ln-store] IndexedDB not available — falling back to in-memory store');
				resolve(null);
				return;
			}

			const required = _getRequiredStores();
			const requiredNames = Object.keys(required);

			// First open to check existing stores
			const probe = indexedDB.open(DB_NAME);

			probe.onerror = function () {
				console.warn('[ln-store] IndexedDB open failed — falling back to in-memory store');
				resolve(null);
			};

			probe.onsuccess = function (e) {
				const db = e.target.result;
				const existing = Array.from(db.objectStoreNames);
				let needsUpgrade = false;

				// Check if _meta store exists
				if (existing.indexOf(META_STORE) === -1) needsUpgrade = true;

				// Check if all required stores exist
				for (let i = 0; i < requiredNames.length; i++) {
					if (existing.indexOf(requiredNames[i]) === -1) {
						needsUpgrade = true;
						break;
					}
				}

				if (!needsUpgrade) {
					// All stores exist — use this connection
					_setupVersionChangeHandler(db);
					_db = db;
					resolve(db);
					return;
				}

				// Need upgrade — close probe and reopen with version+1
				const currentVersion = db.version;
				db.close();

				const upgrade = indexedDB.open(DB_NAME, currentVersion + 1);

				upgrade.onblocked = function () {
					console.warn('[ln-store] Database upgrade blocked — waiting for other tabs to close connection');
				};

				upgrade.onerror = function () {
					console.warn('[ln-store] Database upgrade failed');
					resolve(null);
				};

				upgrade.onupgradeneeded = function (e) {
					const db = e.target.result;

					// Create _meta store if needed
					if (!db.objectStoreNames.contains(META_STORE)) {
						db.createObjectStore(META_STORE, { keyPath: 'key' });
					}

					// Create resource stores
					for (let i = 0; i < requiredNames.length; i++) {
						const storeName = requiredNames[i];
						if (!db.objectStoreNames.contains(storeName)) {
							const store = db.createObjectStore(storeName, { keyPath: 'id' });
							// Create indexes
							const indexes = required[storeName].indexes;
							for (let j = 0; j < indexes.length; j++) {
								store.createIndex(indexes[j], indexes[j], { unique: false });
							}
						}
					}
				};

				upgrade.onsuccess = function (e) {
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
		db.onversionchange = function () {
			db.close();
			_db = null;
			_dbReady = null;
			// Other tabs triggered an upgrade — re-open lazily on next operation
		};
	}

	function _getDb() {
		if (_db) return Promise.resolve(_db);
		_dbReady = null; // force re-open
		return _openDatabase();
	}

	// ─── IndexedDB Helpers ─────────────────────────────────

	function _tx(storeName, mode) {
		return _getDb().then(function (db) {
			if (!db) return null;
			const tx = db.transaction(storeName, mode);
			return tx.objectStore(storeName);
		});
	}

	function _idbRequest(request) {
		return new Promise(function (resolve, reject) {
			request.onsuccess = function () { resolve(request.result); };
			request.onerror = function () {
				_checkQuota(request.error);
				reject(request.error);
			};
		});
	}

	function _getAllRecords(storeName) {
		return _tx(storeName, 'readonly').then(function (store) {
			if (!store) return [];
			return _idbRequest(store.getAll());
		});
	}

	function _getRecord(storeName, id) {
		return _tx(storeName, 'readonly').then(function (store) {
			if (!store) return null;
			return _idbRequest(store.get(id));
		});
	}

	function _putRecord(storeName, record) {
		return _tx(storeName, 'readwrite').then(function (store) {
			if (!store) return;
			return _idbRequest(store.put(record));
		});
	}

	function _deleteRecord(storeName, id) {
		return _tx(storeName, 'readwrite').then(function (store) {
			if (!store) return;
			return _idbRequest(store.delete(id));
		});
	}

	function _clearStore(storeName) {
		return _tx(storeName, 'readwrite').then(function (store) {
			if (!store) return;
			return _idbRequest(store.clear());
		});
	}

	function _countRecords(storeName) {
		return _tx(storeName, 'readonly').then(function (store) {
			if (!store) return 0;
			return _idbRequest(store.count());
		});
	}

	// ─── Meta ──────────────────────────────────────────────

	function _getMeta(storeName) {
		return _tx(META_STORE, 'readonly').then(function (store) {
			if (!store) return null;
			return _idbRequest(store.get(storeName));
		});
	}

	function _setMeta(storeName, data) {
		return _tx(META_STORE, 'readwrite').then(function (store) {
			if (!store) return;
			data.key = storeName;
			return _idbRequest(store.put(data));
		});
	}

	// ─── Component ─────────────────────────────────────────

	function _component(dom) {
		this.dom = dom;
		this._name = dom.getAttribute(DOM_SELECTOR);
		this._endpoint = dom.getAttribute('data-ln-store-endpoint') || '';
		const staleAttr = dom.getAttribute('data-ln-store-stale');
		const _parsed = parseInt(staleAttr, 10);
		this._staleThreshold = (staleAttr === 'never' || staleAttr === '-1') ? -1 : (isNaN(_parsed) ? 300 : _parsed);
		this._searchFields = (dom.getAttribute('data-ln-store-search-fields') || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
		this._abortController = null;
		this._handlers = null;

		this.isLoaded = false;
		this.isSyncing = false;
		this.lastSyncedAt = null;
		this.totalCount = 0;

		_stores[this._name] = this;

		const self = this;
		_bindEvents(self);
		_initStore(self);
		return this;
	}

	// ─── Request Event Listeners ───────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			create: function (e) { _handleCreate(self, e.detail); },
			update: function (e) { _handleUpdate(self, e.detail); },
			delete: function (e) { _handleDelete(self, e.detail); },
			bulkDelete: function (e) { _handleBulkDelete(self, e.detail); }
		};
		self.dom.addEventListener('ln-store:request-create', self._handlers.create);
		self.dom.addEventListener('ln-store:request-update', self._handlers.update);
		self.dom.addEventListener('ln-store:request-delete', self._handlers.delete);
		self.dom.addEventListener('ln-store:request-bulk-delete', self._handlers.bulkDelete);
	}

	// ─── Optimistic Mutations ──────────────────────────────

	function _handleCreate(self, detail) {
		const data = detail.data || {};
		const tempId = '_temp_' + _uuid();
		const record = Object.assign({}, data, { id: tempId });

		_putRecord(self._name, record).then(function () {
			self.totalCount++;

			dispatch(self.dom, 'ln-store:created', {
				store: self._name,
				record: record,
				tempId: tempId
			});

			// POST to server
			return fetch(self._endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				body: JSON.stringify(data)
			});
		}).then(function (response) {
			if (!response.ok) throw new Error('HTTP ' + response.status);
			return response.json();
		}).then(function (serverRecord) {
			// Replace temp record with server record
			return _deleteRecord(self._name, tempId).then(function () {
				return _putRecord(self._name, serverRecord);
			}).then(function () {
				dispatch(self.dom, 'ln-store:confirmed', {
					store: self._name,
					record: serverRecord,
					tempId: tempId,
					action: 'create'
				});
			});
		}).catch(function (err) {
			// Revert — remove temp record
			_deleteRecord(self._name, tempId).then(function () {
				self.totalCount--;
				dispatch(self.dom, 'ln-store:reverted', {
					store: self._name,
					record: record,
					action: 'create',
					error: err.message
				});
			});
		});
	}

	function _handleUpdate(self, detail) {
		const id = detail.id;
		const data = detail.data || {};
		const expectedVersion = detail.expected_version;
		let previous = null;

		_getRecord(self._name, id).then(function (existing) {
			if (!existing) throw new Error('Record not found: ' + id);
			previous = Object.assign({}, existing);

			// Optimistic update
			const updated = Object.assign({}, existing, data);
			return _putRecord(self._name, updated).then(function () {
				dispatch(self.dom, 'ln-store:updated', {
					store: self._name,
					record: updated,
					previous: previous
				});
				return updated;
			});
		}).then(function (updated) {
			// PUT to server
			const body = Object.assign({}, data);
			if (expectedVersion) body.expected_version = expectedVersion;

			return fetch(self._endpoint + '/' + id, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
				body: JSON.stringify(body)
			});
		}).then(function (response) {
			if (response.status === 409) {
				return response.json().then(function (conflict) {
					// Revert to previous
					return _putRecord(self._name, previous).then(function () {
						dispatch(self.dom, 'ln-store:conflict', {
							store: self._name,
							local: previous,
							remote: conflict.current || conflict,
							field_diffs: conflict.field_diffs || null
						});
					});
				});
			}
			if (!response.ok) throw new Error('HTTP ' + response.status);
			return response.json().then(function (serverRecord) {
				return _putRecord(self._name, serverRecord).then(function () {
					dispatch(self.dom, 'ln-store:confirmed', {
						store: self._name,
						record: serverRecord,
						action: 'update'
					});
				});
			});
		}).catch(function (err) {
			if (previous) {
				_putRecord(self._name, previous).then(function () {
					dispatch(self.dom, 'ln-store:reverted', {
						store: self._name,
						record: previous,
						action: 'update',
						error: err.message
					});
				});
			}
		});
	}

	function _handleDelete(self, detail) {
		const id = detail.id;
		let saved = null;

		_getRecord(self._name, id).then(function (existing) {
			if (!existing) return;
			saved = Object.assign({}, existing);

			return _deleteRecord(self._name, id).then(function () {
				self.totalCount--;
				dispatch(self.dom, 'ln-store:deleted', {
					store: self._name,
					id: id
				});

				return fetch(self._endpoint + '/' + id, {
					method: 'DELETE',
					headers: { 'Accept': 'application/json' }
				});
			});
		}).then(function (response) {
			if (!response || !response.ok) throw new Error('HTTP ' + (response ? response.status : 'unknown'));
			dispatch(self.dom, 'ln-store:confirmed', {
				store: self._name,
				record: saved,
				action: 'delete'
			});
		}).catch(function (err) {
			if (saved) {
				_putRecord(self._name, saved).then(function () {
					self.totalCount++;
					dispatch(self.dom, 'ln-store:reverted', {
						store: self._name,
						record: saved,
						action: 'delete',
						error: err.message
					});
				});
			}
		});
	}

	function _handleBulkDelete(self, detail) {
		const ids = detail.ids || [];
		if (ids.length === 0) return;

		let savedRecords = [];

		// Save all records before deleting
		const fetches = ids.map(function (id) {
			return _getRecord(self._name, id);
		});

		Promise.all(fetches).then(function (records) {
			savedRecords = records.filter(Boolean);

			return _deleteBulk(self._name, ids).then(function () {
				self.totalCount -= ids.length;
				dispatch(self.dom, 'ln-store:deleted', {
					store: self._name,
					ids: ids
				});

				return fetch(self._endpoint + '/bulk-delete', {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
					body: JSON.stringify({ ids: ids })
				});
			});
		}).then(function (response) {
			if (!response.ok) throw new Error('HTTP ' + response.status);
			dispatch(self.dom, 'ln-store:confirmed', {
				store: self._name,
				record: null,
				ids: ids,
				action: 'bulk-delete'
			});
		}).catch(function (err) {
			if (savedRecords.length > 0) {
				_putBulk(self._name, savedRecords).then(function () {
					self.totalCount += savedRecords.length;
					dispatch(self.dom, 'ln-store:reverted', {
						store: self._name,
						record: null,
						ids: ids,
						action: 'bulk-delete',
						error: err.message
					});
				});
			}
		});
	}

	function _initStore(self) {
		_openDatabase().then(function () {
			return _getMeta(self._name);
		}).then(function (meta) {
			if (meta && meta.schema_version === SCHEMA_VERSION) {
				self.lastSyncedAt = meta.last_synced_at || null;
				self.totalCount = meta.record_count || 0;

				if (self.totalCount > 0) {
					self.isLoaded = true;
					dispatch(self.dom, 'ln-store:ready', {
						store: self._name,
						count: self.totalCount,
						source: 'cache'
					});

					// Background delta sync if stale
					if (_isStale(self)) {
						_deltaSync(self);
					}
				} else {
					// No cached data — full load
					_fullLoad(self);
				}
			} else if (meta && meta.schema_version !== SCHEMA_VERSION) {
				// Schema mismatch — clear and full reload
				_clearStore(self._name).then(function () {
					return _setMeta(self._name, {
						schema_version: SCHEMA_VERSION,
						last_synced_at: null,
						record_count: 0
					});
				}).then(function () {
					_fullLoad(self);
				});
			} else {
				// No meta at all — first time, full load
				_fullLoad(self);
			}
		});
	}

	function _isStale(self) {
		if (self._staleThreshold === -1) return false;
		if (!self.lastSyncedAt) return true;
		const now = Math.floor(Date.now() / 1000);
		return (now - self.lastSyncedAt) > self._staleThreshold;
	}

	// ─── Full Load ─────────────────────────────────────────

	function _fullLoad(self) {
		if (!self._endpoint) return Promise.resolve();

		self.isSyncing = true;
		self._abortController = new AbortController();

		return fetch(self._endpoint, { signal: self._abortController.signal })
			.then(function (response) {
				if (!response.ok) throw new Error('HTTP ' + response.status);
				return response.json();
			})
			.then(function (json) {
				const records = json.data || [];
				const syncedAt = json.synced_at || Math.floor(Date.now() / 1000);

				return _putBulk(self._name, records).then(function () {
					return _setMeta(self._name, {
						schema_version: SCHEMA_VERSION,
						last_synced_at: syncedAt,
						record_count: records.length
					});
				}).then(function () {
					self.isLoaded = true;
					self.isSyncing = false;
					self.lastSyncedAt = syncedAt;
					self.totalCount = records.length;
					self._abortController = null;

					dispatch(self.dom, 'ln-store:loaded', {
						store: self._name,
						count: records.length
					});

					dispatch(self.dom, 'ln-store:ready', {
						store: self._name,
						count: records.length,
						source: 'server'
					});
				});
			})
			.catch(function (err) {
				self.isSyncing = false;
				self._abortController = null;

				if (err.name === 'AbortError') return;

				if (self.isLoaded) {
					dispatch(self.dom, 'ln-store:offline', { store: self._name });
				} else {
					dispatch(self.dom, 'ln-store:error', {
						store: self._name,
						action: 'full-load',
						error: err.message,
						status: null
					});
				}
			});
	}

	// ─── Delta Sync ────────────────────────────────────────

	function _deltaSync(self) {
		if (!self._endpoint || !self.lastSyncedAt) return _fullLoad(self);

		self.isSyncing = true;
		self._abortController = new AbortController();

		const url = self._endpoint + (self._endpoint.indexOf('?') === -1 ? '?' : '&') + 'since=' + self.lastSyncedAt;

		return fetch(url, { signal: self._abortController.signal })
			.then(function (response) {
				if (!response.ok) throw new Error('HTTP ' + response.status);
				return response.json();
			})
			.then(function (json) {
				const upserted = json.data || [];
				const deleted = json.deleted || [];
				const syncedAt = json.synced_at || Math.floor(Date.now() / 1000);
				const hasChanges = upserted.length > 0 || deleted.length > 0;

				let chain = Promise.resolve();

				// Upsert changed records
				if (upserted.length > 0) {
					chain = chain.then(function () {
						return _putBulk(self._name, upserted);
					});
				}

				// Delete removed records
				if (deleted.length > 0) {
					chain = chain.then(function () {
						return _deleteBulk(self._name, deleted);
					});
				}

				// Update count and meta
				return chain.then(function () {
					return _countRecords(self._name);
				}).then(function (count) {
					self.totalCount = count;
					return _setMeta(self._name, {
						schema_version: SCHEMA_VERSION,
						last_synced_at: syncedAt,
						record_count: count
					});
				}).then(function () {
					self.isSyncing = false;
					self.lastSyncedAt = syncedAt;
					self._abortController = null;

					dispatch(self.dom, 'ln-store:synced', {
						store: self._name,
						added: upserted.length,
						deleted: deleted.length,
						changed: hasChanges
					});
				});
			})
			.catch(function (err) {
				self.isSyncing = false;
				self._abortController = null;

				if (err.name === 'AbortError') return;

				dispatch(self.dom, 'ln-store:offline', { store: self._name });
			});
	}

	// ─── Bulk IndexedDB Operations ─────────────────────────

	function _putBulk(storeName, records) {
		return _getDb().then(function (db) {
			if (!db) return;
			return new Promise(function (resolve, reject) {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				for (let i = 0; i < records.length; i++) {
					store.put(records[i]);
				}
				tx.oncomplete = function () { resolve(); };
				tx.onerror = function () {
					_checkQuota(tx.error);
					reject(tx.error);
				};
			});
		});
	}

	function _deleteBulk(storeName, ids) {
		return _getDb().then(function (db) {
			if (!db) return;
			return new Promise(function (resolve, reject) {
				const tx = db.transaction(storeName, 'readwrite');
				const store = tx.objectStore(storeName);
				for (let i = 0; i < ids.length; i++) {
					store.delete(ids[i]);
				}
				tx.oncomplete = function () { resolve(); };
				tx.onerror = function () { reject(tx.error); };
			});
		});
	}

	// ─── Visibility Change ─────────────────────────────────

	let _visibilityHandler = null;
	_visibilityHandler = function () {
		if (document.visibilityState !== 'visible') return;
		const names = Object.keys(_stores);
		for (let i = 0; i < names.length; i++) {
			const inst = _stores[names[i]];
			if (inst.isLoaded && !inst.isSyncing && _isStale(inst)) {
				_deltaSync(inst);
			}
		}
	};
	document.addEventListener('visibilitychange', _visibilityHandler);

	// ─── Query Engine ──────────────────────────────────────

	const _collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

	function _sort(records, sort) {
		if (!sort || !sort.field) return records;
		const field = sort.field;
		const desc = sort.direction === 'desc';

		return records.slice().sort(function (a, b) {
			const va = a[field];
			const vb = b[field];

			if (va == null && vb == null) return 0;
			if (va == null) return desc ? 1 : -1;
			if (vb == null) return desc ? -1 : 1;

			let result;
			if (typeof va === 'string' && typeof vb === 'string') {
				result = _collator.compare(va, vb);
			} else {
				result = va < vb ? -1 : va > vb ? 1 : 0;
			}
			return desc ? -result : result;
		});
	}

	function _filter(records, filters) {
		if (!filters) return records;
		const keys = Object.keys(filters);
		if (keys.length === 0) return records;

		return records.filter(function (record) {
			for (let i = 0; i < keys.length; i++) {
				const field = keys[i];
				const accepted = filters[field];
				if (!Array.isArray(accepted) || accepted.length === 0) continue;
				const val = record[field];
				// Coerce to string for comparison
				let match = false;
				for (let j = 0; j < accepted.length; j++) {
					if (String(val) === String(accepted[j])) {
						match = true;
						break;
					}
				}
				if (!match) return false;
			}
			return true;
		});
	}

	function _search(records, query, searchFields) {
		if (!query || !searchFields || searchFields.length === 0) return records;
		const lower = query.toLowerCase();

		return records.filter(function (record) {
			for (let i = 0; i < searchFields.length; i++) {
				const val = record[searchFields[i]];
				if (val != null && String(val).toLowerCase().indexOf(lower) !== -1) {
					return true;
				}
			}
			return false;
		});
	}

	function _aggregate(records, field, fn) {
		if (records.length === 0) return 0;

		if (fn === 'count') return records.length;

		let sum = 0;
		let count = 0;
		for (let i = 0; i < records.length; i++) {
			const val = parseFloat(records[i][field]);
			if (!isNaN(val)) {
				sum += val;
				count++;
			}
		}

		if (fn === 'sum') return sum;
		if (fn === 'avg') return count > 0 ? sum / count : 0;
		return 0;
	}

	// ─── Read API ──────────────────────────────────────────

	_component.prototype.getAll = function (options) {
		const self = this;
		options = options || {};

		return _getAllRecords(self._name).then(function (records) {
			const total = records.length;

			// Filter
			if (options.filters) {
				records = _filter(records, options.filters);
			}

			// Search
			if (options.search) {
				records = _search(records, options.search, self._searchFields);
			}

			const filtered = records.length;

			// Sort
			if (options.sort) {
				records = _sort(records, options.sort);
			}

			// Offset + Limit
			if (options.offset || options.limit) {
				const offset = options.offset || 0;
				const limit = options.limit || records.length;
				records = records.slice(offset, offset + limit);
			}

			return {
				data: records,
				total: total,
				filtered: filtered
			};
		});
	};

	_component.prototype.getById = function (id) {
		return _getRecord(this._name, id);
	};

	_component.prototype.count = function (filters) {
		const self = this;
		if (!filters) return _countRecords(self._name);

		return _getAllRecords(self._name).then(function (records) {
			return _filter(records, filters).length;
		});
	};

	_component.prototype.aggregate = function (field, fn) {
		const self = this;
		return _getAllRecords(self._name).then(function (records) {
			return _aggregate(records, field, fn);
		});
	};

	// ─── Manual Triggers ───────────────────────────────────

	_component.prototype.forceSync = function () {
		return _deltaSync(this);
	};

	_component.prototype.fullReload = function () {
		const self = this;
		return _clearStore(self._name).then(function () {
			self.isLoaded = false;
			self.lastSyncedAt = null;
			self.totalCount = 0;
			return _fullLoad(self);
		});
	};

	_component.prototype.destroy = function () {
		// Cancel pending fetches
		if (this._abortController) {
			this._abortController.abort();
			this._abortController = null;
		}

		// Remove event listeners
		if (this._handlers) {
			this.dom.removeEventListener('ln-store:request-create', this._handlers.create);
			this.dom.removeEventListener('ln-store:request-update', this._handlers.update);
			this.dom.removeEventListener('ln-store:request-delete', this._handlers.delete);
			this.dom.removeEventListener('ln-store:request-bulk-delete', this._handlers.bulkDelete);
			this._handlers = null;
		}

		delete _stores[this._name];

		if (Object.keys(_stores).length === 0 && _visibilityHandler) {
			document.removeEventListener('visibilitychange', _visibilityHandler);
			_visibilityHandler = null;
		}

		delete this.dom[DOM_ATTRIBUTE];

		dispatch(this.dom, 'ln-store:destroyed', { store: this._name });
	};

	// ─── clearAll (global) ─────────────────────────────────

	function _clearAll() {
		return _getDb().then(function (db) {
			if (!db) return;
			const storeNames = Array.from(db.objectStoreNames);
			return new Promise(function (resolve, reject) {
				const tx = db.transaction(storeNames, 'readwrite');
				for (let i = 0; i < storeNames.length; i++) {
					tx.objectStore(storeNames[i]).clear();
				}
				tx.oncomplete = function () { resolve(); };
				tx.onerror = function () { reject(tx.error); };
			});
		}).then(function () {
			// Reset all instance state
			const names = Object.keys(_stores);
			for (let i = 0; i < names.length; i++) {
				const inst = _stores[names[i]];
				inst.isLoaded = false;
				inst.isSyncing = false;
				inst.lastSyncedAt = null;
				inst.totalCount = 0;
			}
		});
	}

	// ─── Registration + Public API ─────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-store');

	// Preserve legacy public API documented in js/ln-store/README.md:
	//   window.lnStore.clearAll()  — wipe all IndexedDB stores
	//   window.lnStore.init(el)    — manual init alias for the constructor
	// `registerComponent` writes the bare constructor to window[DOM_ATTRIBUTE];
	// we hang the legacy methods on it so both call shapes keep working.
	window[DOM_ATTRIBUTE].clearAll = _clearAll;
	window[DOM_ATTRIBUTE].init = window[DOM_ATTRIBUTE];
})();
