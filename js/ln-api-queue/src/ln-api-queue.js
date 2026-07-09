import { registerComponent, dispatch } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-api-queue';
	const DOM_ATTRIBUTE = 'lnApiQueue';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const DB_NAME = 'ln_api_queue';
	const OUTBOX = 'outbox';
	const META = '_queue_meta';
	const BACKOFF_LADDER = [2000, 5000, 15000, 60000, 300000];
	const MAX_ATTEMPTS = 8;

	let _db = null;
	let _dbReady = null;

	function _uuid() {
		try { return crypto.randomUUID(); }
		catch (_) {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
				const r = Math.random() * 16 | 0;
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
	}

	// ─── Database ──────────────────────────────────────────

	function _openDb() {
		if (_dbReady) return _dbReady;

		_dbReady = new Promise(resolve => {
			if (typeof indexedDB === 'undefined') {
				console.warn('[ln-api-queue] IndexedDB not available — queue disabled');
				return resolve(null);
			}

			const req = indexedDB.open(DB_NAME, 1);

			req.onerror = () => {
				console.warn('[ln-api-queue] IndexedDB open failed — queue disabled');
				resolve(null);
			};

			req.onupgradeneeded = e => {
				const db = e.target.result;
				if (!db.objectStoreNames.contains(OUTBOX)) {
					const store = db.createObjectStore(OUTBOX, { keyPath: 'entryId' });
					store.createIndex('by_scope_chain', ['scope', 'chainKey'], { unique: false });
					store.createIndex('by_scope_seq', ['scope', 'seq'], { unique: false });
				}
				if (!db.objectStoreNames.contains(META)) {
					db.createObjectStore(META, { keyPath: 'key' });
				}
			};

			req.onsuccess = e => {
				const db = e.target.result;
				db.onversionchange = () => {
					db.close();
					_db = null;
					_dbReady = null;
				};
				_db = db;
				resolve(db);
			};
		});

		return _dbReady;
	}

	function _getDb() {
		if (_db) return Promise.resolve(_db);
		_dbReady = null;
		return _openDb();
	}

	function _idbRequest(request) {
		return new Promise((resolve, reject) => {
			request.onsuccess = () => resolve(request.result);
			request.onerror = () => reject(request.error);
		});
	}

	const _tx = (storeName, mode) => _getDb().then(db => db ? db.transaction(storeName, mode).objectStore(storeName) : null);

	function _putEntry(entry) {
		return _tx(OUTBOX, 'readwrite').then(store => store ? _idbRequest(store.put(entry)) : null);
	}

	function _deleteEntry(entryId) {
		return _tx(OUTBOX, 'readwrite').then(store => store ? _idbRequest(store.delete(entryId)) : null);
	}

	function _allForScope(scope) {
		return _tx(OUTBOX, 'readonly').then(store => {
			if (!store) return [];
			const index = store.index('by_scope_seq');
			const range = IDBKeyRange.bound([scope, -Infinity], [scope, Infinity]);
			return _idbRequest(index.getAll(range));
		});
	}

	function _nextSeq(scope) {
		return _tx(META, 'readwrite').then(store => {
			if (!store) return 0;
			return _idbRequest(store.get('seq')).then(record => {
				const next = (record && typeof record.value === 'number' ? record.value : 0) + 1;
				return _tx(META, 'readwrite').then(s2 => _idbRequest(s2.put({ key: 'seq', value: next }))).then(() => next);
			});
		});
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;

		const coordinatorEl = dom.closest('[data-ln-data-coordinator]');
		this.scope = dom.getAttribute(DOM_SELECTOR) || (coordinatorEl ? coordinatorEl.getAttribute('data-ln-data-coordinator') : null) || 'default';

		this._paused = false;
		this._timers = new Map();
		this._onlineHandler = () => this._drain();

		this._bindEvents();
		window.addEventListener('online', this._onlineHandler);

		const self = this;
		_openDb().then(() => {
			self._emitPendingCount();
			self._drain();
		});

		return this;
	}

	_component.prototype._isOnline = function () {
		const attr = this.dom.getAttribute('data-ln-api-queue-online');
		if (attr === 'true') return true;
		if (attr === 'false') return false;
		return navigator.onLine;
	};

	// ─── Pending Count ──────────────────────────────────────

	_component.prototype._emitPendingCount = function () {
		const self = this;
		return _allForScope(self.scope).then(entries => {
			dispatch(self.dom, 'ln-api-queue:pending-count', { count: entries.length, scope: self.scope });
			if (entries.length === 0) {
				dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
			}
		});
	};

	// ─── Drain ──────────────────────────────────────────────

	_component.prototype._clearTimer = function (chainKey) {
		const timer = this._timers.get(chainKey);
		if (timer) {
			clearTimeout(timer);
			this._timers.delete(chainKey);
		}
	};

	_component.prototype._scheduleTimer = function (chainKey, delta) {
		if (this._timers.has(chainKey)) return;
		const self = this;
		const timer = setTimeout(() => {
			self._timers.delete(chainKey);
			self._drain();
		}, delta);
		this._timers.set(chainKey, timer);
	};

	_component.prototype._drain = function () {
		const self = this;

		if (self._paused) return;
		if (!self._isOnline()) return;

		return _allForScope(self.scope).then(entries => {
			const groups = new Map();
			for (const entry of entries) {
				if (!groups.has(entry.chainKey)) groups.set(entry.chainKey, []);
				groups.get(entry.chainKey).push(entry);
			}

			groups.forEach((group, chainKey) => {
				group.sort((a, b) => a.seq - b.seq);
				const head = group.find(e => e.status !== 'failed');
				if (!head || head.status === 'inflight') return;

				const now = Date.now();
				if (head.nextAttemptAt > now) {
					self._scheduleTimer(chainKey, head.nextAttemptAt - now);
					return;
				}

				self._clearTimer(chainKey);
				head.status = 'inflight';
				_putEntry(head).then(() => {
					dispatch(self.dom, 'ln-api-queue:send', {
						entryId: head.entryId,
						chainKey: head.chainKey,
						op: head.op,
						targetId: head.targetId,
						payload: head.payload,
						expectedVersion: head.expectedVersion,
						meta: head.meta
					});
				});
			});
		});
	};

	// ─── Command Handlers ──────────────────────────────────

	_component.prototype._onEnqueue = function (e) {
		const self = this;
		const detail = e.detail || {};

		return _nextSeq(self.scope).then(seq => {
			const entry = {
				entryId: _uuid(),
				scope: self.scope,
				chainKey: detail.chainKey,
				seq: seq,
				op: detail.op,
				targetId: detail.targetId !== undefined ? detail.targetId : null,
				payload: detail.payload,
				expectedVersion: detail.expectedVersion !== undefined ? detail.expectedVersion : null,
				meta: detail.meta || {},
				attempts: 0,
				nextAttemptAt: 0,
				status: 'pending'
			};

			return _putEntry(entry).then(() => _allForScope(self.scope)).then(entries => {
				dispatch(self.dom, 'ln-api-queue:enqueued', { entryId: entry.entryId, chainKey: entry.chainKey, count: entries.length });
				dispatch(self.dom, 'ln-api-queue:pending-count', { count: entries.length, scope: self.scope });
				self._drain();
			});
		});
	};

	_component.prototype._onAck = function (e) {
		const self = this;
		const detail = e.detail || {};

		return _deleteEntry(detail.entryId).then(() => _allForScope(self.scope)).then(entries => {
			dispatch(self.dom, 'ln-api-queue:pending-count', { count: entries.length, scope: self.scope });
			if (entries.length === 0) {
				dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
			}
			self._drain();
		});
	};

	_component.prototype._onNack = function (e) {
		const self = this;
		const detail = e.detail || {};
		const reason = detail.reason;

		return _allForScope(self.scope).then(entries => {
			const entry = entries.find(en => en.entryId === detail.entryId);
			if (!entry) return;

			if (reason === 'retry') {
				entry.attempts = (entry.attempts || 0) + 1;
				if (entry.attempts >= MAX_ATTEMPTS) {
					entry.status = 'failed';
					return _putEntry(entry).then(() => {
						dispatch(self.dom, 'ln-api-queue:failed', { entryId: entry.entryId, chainKey: entry.chainKey, attempts: entry.attempts });
						return _allForScope(self.scope);
					}).then(all => {
						dispatch(self.dom, 'ln-api-queue:pending-count', { count: all.length, scope: self.scope });
					});
				}
				entry.nextAttemptAt = Date.now() + BACKOFF_LADDER[Math.min(entry.attempts - 1, BACKOFF_LADDER.length - 1)];
				entry.status = 'pending';
				return _putEntry(entry).then(() => {
					self._scheduleTimer(entry.chainKey, entry.nextAttemptAt - Date.now());
					return _allForScope(self.scope);
				}).then(all => {
					dispatch(self.dom, 'ln-api-queue:pending-count', { count: all.length, scope: self.scope });
				});
			}

			if (reason === 'drop') {
				return _deleteEntry(entry.entryId).then(() => _allForScope(self.scope)).then(all => {
					dispatch(self.dom, 'ln-api-queue:pending-count', { count: all.length, scope: self.scope });
					if (all.length === 0) {
						dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
					}
					self._drain();
				});
			}

			if (reason === 'auth') {
				entry.status = 'pending';
				return _putEntry(entry).then(() => {
					self._paused = true;
					dispatch(self.dom, 'ln-api-queue:paused', { reason: 'auth' });
					dispatch(self.dom, 'ln-api-queue:auth-required', { entryId: entry.entryId, chainKey: entry.chainKey });
				});
			}
		});
	};

	_component.prototype._onRemap = function (e) {
		const self = this;
		const detail = e.detail || {};
		const oldKey = detail.oldKey;
		const newId = detail.newId;

		return _allForScope(self.scope).then(entries => {
			const targets = entries.filter(en => en.chainKey === oldKey && en.status !== 'failed');
			return Promise.all(targets.map(entry => {
				if (entry.targetId === oldKey) entry.targetId = newId;
				entry.chainKey = newId;
				return _putEntry(entry);
			}));
		});
	};

	_component.prototype._onResume = function () {
		this._paused = false;
		dispatch(this.dom, 'ln-api-queue:resumed', {});
		this._drain();
	};

	_component.prototype._onDrain = function () {
		this._drain();
	};

	_component.prototype._onClear = function () {
		const self = this;
		return _allForScope(self.scope).then(entries => Promise.all(entries.map(e => _deleteEntry(e.entryId)))).then(() => {
			dispatch(self.dom, 'ln-api-queue:pending-count', { count: 0, scope: self.scope });
			dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
		});
	};

	// ─── DOM Event Routing ──────────────────────────────────

	_component.prototype._bindEvents = function () {
		const self = this;
		self._handlers = {
			enqueue: e => self._onEnqueue(e),
			ack: e => self._onAck(e),
			nack: e => self._onNack(e),
			remap: e => self._onRemap(e),
			resume: e => self._onResume(e),
			drain: e => self._onDrain(e),
			clear: e => self._onClear(e)
		};

		self.dom.addEventListener('ln-api-queue:request-enqueue', self._handlers.enqueue);
		self.dom.addEventListener('ln-api-queue:ack', self._handlers.ack);
		self.dom.addEventListener('ln-api-queue:nack', self._handlers.nack);
		self.dom.addEventListener('ln-api-queue:request-remap', self._handlers.remap);
		self.dom.addEventListener('ln-api-queue:request-resume', self._handlers.resume);
		self.dom.addEventListener('ln-api-queue:request-drain', self._handlers.drain);
		self.dom.addEventListener('ln-api-queue:request-clear', self._handlers.clear);
	};

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		const self = this;
		self.dom.removeEventListener('ln-api-queue:request-enqueue', self._handlers.enqueue);
		self.dom.removeEventListener('ln-api-queue:ack', self._handlers.ack);
		self.dom.removeEventListener('ln-api-queue:nack', self._handlers.nack);
		self.dom.removeEventListener('ln-api-queue:request-remap', self._handlers.remap);
		self.dom.removeEventListener('ln-api-queue:request-resume', self._handlers.resume);
		self.dom.removeEventListener('ln-api-queue:request-drain', self._handlers.drain);
		self.dom.removeEventListener('ln-api-queue:request-clear', self._handlers.clear);
		window.removeEventListener('online', self._onlineHandler);

		self._timers.forEach(timer => clearTimeout(timer));
		self._timers.clear();

		dispatch(self.dom, 'ln-api-queue:destroyed', { scope: self.scope });

		delete self.dom[DOM_ATTRIBUTE];
	};

	// ─── Attribute Sync ────────────────────────────────────

	function _syncAttr(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance._drain();
	}

	// ─── Registration ──────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-api-queue', {
		extraAttributes: ['data-ln-api-queue-online'],
		onAttributeChange: _syncAttr
	});
})();
