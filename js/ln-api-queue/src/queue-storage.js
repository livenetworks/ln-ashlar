const DEFAULT_DB_NAME = 'ln_api_queue';
const DB_VERSION = 2;
const OUTBOX = 'outbox';
const META = '_queue_meta';

function requestError(request, fallback) {
	return request.error || new Error(fallback);
}

function scopeRange(keyRange, scope) {
	return keyRange.bound([scope, -Infinity], [scope, Infinity]);
}

function seqKey(scope) {
	return 'seq:' + scope;
}

function pauseKey(scope) {
	return 'paused:' + scope;
}

function clearLease(entry) {
	entry.leaseOwner = null;
	entry.leaseUntil = 0;
}

function remapAction(action, oldKey, newId) {
	if (typeof action !== 'string' || action.indexOf(oldKey) === -1) return action;
	return action.split(oldKey).join(newId);
}

export function claimQueueHeads(entries, ownerId, leaseMs, now) {
	const groups = new Map();
	const claimed = [];
	const wakeups = [];

	for (const entry of entries || []) {
		if (!groups.has(entry.chainKey)) groups.set(entry.chainKey, []);
		groups.get(entry.chainKey).push(entry);
	}

	groups.forEach((group, chainKey) => {
		group.sort((a, b) => a.seq - b.seq);
		const head = group[0];
		if (!head || head.status === 'failed') return;

		if (head.status === 'inflight' && (head.leaseUntil || 0) > now) {
			wakeups.push({ chainKey, at: head.leaseUntil });
			return;
		}
		if ((head.nextAttemptAt || 0) > now) {
			wakeups.push({ chainKey, at: head.nextAttemptAt });
			return;
		}

		head.status = 'inflight';
		head.leaseOwner = ownerId;
		head.leaseUntil = now + leaseMs;
		head.updatedAt = now;
		claimed.push(head);
	});

	return { entries: claimed, wakeups };
}

export function remapQueueEntries(entries, acknowledgedEntryId, oldKey, newId, now) {
	const changed = [];
	const deleted = [];

	for (const entry of entries || []) {
		if (entry.entryId === acknowledgedEntryId) {
			deleted.push(entry.entryId);
			continue;
		}
		if (entry.chainKey !== oldKey) continue;

		entry.chainKey = newId;
		if (entry.targetId === oldKey) entry.targetId = newId;
		if (entry.meta && entry.meta.id === oldKey) entry.meta.id = newId;
		if (entry.meta && typeof entry.meta.action === 'string') {
			entry.meta.action = remapAction(entry.meta.action, oldKey, newId);
		}
		entry.updatedAt = now;
		changed.push(entry);
	}

	return { changed, deleted };
}

export class QueueStorage {
	constructor(options) {
		options = options || {};
		this.indexedDB = options.indexedDB || globalThis.indexedDB;
		this.keyRange = options.IDBKeyRange || globalThis.IDBKeyRange;
		this.dbName = options.dbName || DEFAULT_DB_NAME;
		this.now = options.now || (() => Date.now());
		this.uuid = options.uuid || (() => crypto.randomUUID());
		this._db = null;
		this._ready = null;
	}

	open() {
		if (this._ready) return this._ready;
		if (!this.indexedDB || !this.keyRange) return Promise.resolve(null);

		this._ready = new Promise((resolve, reject) => {
			const request = this.indexedDB.open(this.dbName, DB_VERSION);

			request.onupgradeneeded = event => {
				const db = event.target.result;
				let outbox;
				if (!db.objectStoreNames.contains(OUTBOX)) {
					outbox = db.createObjectStore(OUTBOX, { keyPath: 'entryId' });
				} else {
					outbox = event.target.transaction.objectStore(OUTBOX);
				}
				if (!outbox.indexNames.contains('by_scope_chain')) {
					outbox.createIndex('by_scope_chain', ['scope', 'chainKey'], { unique: false });
				}
				if (!outbox.indexNames.contains('by_scope_seq')) {
					outbox.createIndex('by_scope_seq', ['scope', 'seq'], { unique: false });
				}
				if (!db.objectStoreNames.contains(META)) {
					db.createObjectStore(META, { keyPath: 'key' });
				}
			};

			request.onerror = () => reject(requestError(request, 'Queue database open failed'));
			request.onsuccess = event => {
				this._db = event.target.result;
				this._db.onversionchange = () => this.close();
				resolve(this._db);
			};
		});

		return this._ready;
	}

	close() {
		if (this._db) this._db.close();
		this._db = null;
		this._ready = null;
	}

	deleteDatabase() {
		this.close();
		if (!this.indexedDB) return Promise.resolve();
		return new Promise((resolve, reject) => {
			const request = this.indexedDB.deleteDatabase(this.dbName);
			request.onsuccess = () => resolve();
			request.onerror = () => reject(requestError(request, 'Queue database delete failed'));
			request.onblocked = () => reject(new Error('Queue database delete blocked'));
		});
	}

	allForScope(scope) {
		return this.open().then(db => {
			if (!db) return [];
			return new Promise((resolve, reject) => {
				const tx = db.transaction(OUTBOX, 'readonly');
				const request = tx.objectStore(OUTBOX).index('by_scope_seq').getAll(scopeRange(this.keyRange, scope));
				request.onsuccess = () => resolve(request.result || []);
				request.onerror = () => reject(requestError(request, 'Queue scope read failed'));
			});
		});
	}

	enqueue(scope, detail) {
		detail = detail || {};
		return this.open().then(db => {
			if (!db) return null;

			return new Promise((resolve, reject) => {
				const tx = db.transaction([META, OUTBOX], 'readwrite');
				const meta = tx.objectStore(META);
				const outbox = tx.objectStore(OUTBOX);
				const key = seqKey(scope);
				let entry = null;

				const allocate = current => {
					const next = current + 1;
					entry = {
						entryId: this.uuid(),
						scope,
						chainKey: detail.chainKey,
						seq: next,
						op: detail.op,
						targetId: detail.targetId !== undefined ? detail.targetId : null,
						payload: detail.payload,
						expectedVersion: detail.expectedVersion !== undefined ? detail.expectedVersion : null,
						meta: detail.meta || {},
						attempts: 0,
						nextAttemptAt: 0,
						status: 'pending',
						leaseOwner: null,
						leaseUntil: 0,
						createdAt: this.now(),
						updatedAt: this.now()
					};
					meta.put({ key, value: next });
					outbox.put(entry);
				};

				const metaRequest = meta.get(key);
				metaRequest.onerror = () => reject(requestError(metaRequest, 'Queue sequence read failed'));
				metaRequest.onsuccess = () => {
					const record = metaRequest.result;
					if (record && typeof record.value === 'number') {
						allocate(record.value);
						return;
					}

					// Migration path from v1: initialize the per-scope counter above
					// the largest already-persisted sequence in this scope.
					const existingRequest = outbox.index('by_scope_seq').getAll(scopeRange(this.keyRange, scope));
					existingRequest.onerror = () => reject(requestError(existingRequest, 'Queue sequence migration failed'));
					existingRequest.onsuccess = () => {
						const current = (existingRequest.result || []).reduce((max, item) => Math.max(max, item.seq || 0), 0);
						allocate(current);
					};
				};

				tx.oncomplete = () => resolve(entry);
				tx.onerror = () => reject(tx.error || new Error('Queue enqueue transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue enqueue transaction aborted'));
			});
		});
	}

	claimReady(scope, ownerId, leaseMs) {
		return this.open().then(db => {
			if (!db) return { entries: [], wakeups: [] };

			return new Promise((resolve, reject) => {
				const tx = db.transaction(OUTBOX, 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const request = outbox.index('by_scope_seq').getAll(scopeRange(this.keyRange, scope));
				const now = this.now();
				let result = { entries: [], wakeups: [] };

				request.onerror = () => reject(requestError(request, 'Queue claim read failed'));
				request.onsuccess = () => {
					result = claimQueueHeads(request.result || [], ownerId, leaseMs, now);
					for (const entry of result.entries) outbox.put(entry);
				};

				tx.oncomplete = () => resolve(result);
				tx.onerror = () => reject(tx.error || new Error('Queue claim transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue claim transaction aborted'));
			});
		});
	}

	ack(scope, entryId) {
		return this._updateEntry(scope, entryId, (entry, outbox) => {
			outbox.delete(entry.entryId);
			return { status: 'acked', entry };
		});
	}

	nack(scope, entryId, reason, options) {
		options = options || {};
		const maxAttempts = options.maxAttempts || 8;
		const backoff = options.backoff || [2000, 5000, 15000, 60000, 300000];

		return this.open().then(db => {
			if (!db) return null;
			return new Promise((resolve, reject) => {
				const tx = db.transaction([OUTBOX, META], 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const meta = tx.objectStore(META);
				const request = outbox.get(entryId);
				let result = null;

				request.onerror = () => reject(requestError(request, 'Queue nack read failed'));
				request.onsuccess = () => {
					const entry = request.result;
					if (!entry || entry.scope !== scope) return;

					if (reason === 'drop') {
						outbox.delete(entry.entryId);
						result = { status: 'dropped', entry };
						return;
					}

					clearLease(entry);
					entry.updatedAt = this.now();

					if (reason === 'auth') {
						entry.status = 'pending';
						outbox.put(entry);
						meta.put({ key: pauseKey(scope), value: true });
						result = { status: 'auth', entry };
						return;
					}

					if (reason === 'retry') {
						entry.attempts = (entry.attempts || 0) + 1;
						if (entry.attempts >= maxAttempts) {
							entry.status = 'failed';
							entry.nextAttemptAt = 0;
							outbox.put(entry);
							result = { status: 'failed', entry };
							return;
						}

						const delay = backoff[Math.min(entry.attempts - 1, backoff.length - 1)];
						entry.status = 'pending';
						entry.nextAttemptAt = this.now() + delay;
						outbox.put(entry);
						result = { status: 'retry', entry, delay };
					}
				};

				tx.oncomplete = () => resolve(result);
				tx.onerror = () => reject(tx.error || new Error('Queue nack transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue nack transaction aborted'));
			});
		});
	}

	remap(scope, oldKey, newId) {
		return this._remapTransaction(scope, null, oldKey, newId);
	}

	resolveCreate(scope, entryId, oldKey, newId) {
		return this._remapTransaction(scope, entryId, oldKey, newId);
	}

	_remapTransaction(scope, acknowledgedEntryId, oldKey, newId) {
		return this.open().then(db => {
			if (!db) return [];
			return new Promise((resolve, reject) => {
				const tx = db.transaction(OUTBOX, 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const request = outbox.index('by_scope_seq').getAll(scopeRange(this.keyRange, scope));
				let result = { changed: [], deleted: [] };

				request.onerror = () => reject(requestError(request, 'Queue remap read failed'));
				request.onsuccess = () => {
					result = remapQueueEntries(request.result || [], acknowledgedEntryId, oldKey, newId, this.now());
					for (const entryId of result.deleted) outbox.delete(entryId);
					for (const entry of result.changed) outbox.put(entry);
				};

				tx.oncomplete = () => resolve(result.changed);
				tx.onerror = () => reject(tx.error || new Error('Queue remap transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue remap transaction aborted'));
			});
		});
	}

	resetFailed(scope) {
		return this.open().then(db => {
			if (!db) return 0;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(OUTBOX, 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const request = outbox.index('by_scope_seq').getAll(scopeRange(this.keyRange, scope));
				let count = 0;

				request.onerror = () => reject(requestError(request, 'Queue failed-entry read failed'));
				request.onsuccess = () => {
					for (const entry of request.result || []) {
						if (entry.status !== 'failed') continue;
						entry.status = 'pending';
						entry.attempts = 0;
						entry.nextAttemptAt = 0;
						entry.updatedAt = this.now();
						clearLease(entry);
						outbox.put(entry);
						count++;
					}
				};

				tx.oncomplete = () => resolve(count);
				tx.onerror = () => reject(tx.error || new Error('Queue failed-entry reset failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue failed-entry reset aborted'));
			});
		});
	}

	getPaused(scope) {
		return this.open().then(db => {
			if (!db) return false;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(META, 'readonly');
				const request = tx.objectStore(META).get(pauseKey(scope));
				request.onsuccess = () => resolve(!!(request.result && request.result.value));
				request.onerror = () => reject(requestError(request, 'Queue pause-state read failed'));
			});
		});
	}

	setPaused(scope, paused) {
		return this.open().then(db => {
			if (!db) return;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(META, 'readwrite');
				tx.objectStore(META).put({ key: pauseKey(scope), value: !!paused });
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error || new Error('Queue pause-state write failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue pause-state write aborted'));
			});
		});
	}

	clear(scope) {
		return this.open().then(db => {
			if (!db) return;
			return new Promise((resolve, reject) => {
				const tx = db.transaction([OUTBOX, META], 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const request = outbox.index('by_scope_seq').openCursor(scopeRange(this.keyRange, scope));
				request.onsuccess = event => {
					const cursor = event.target.result;
					if (!cursor) return;
					cursor.delete();
					cursor.continue();
				};
				request.onerror = () => reject(requestError(request, 'Queue clear failed'));
				tx.objectStore(META).delete(seqKey(scope));
				tx.objectStore(META).delete(pauseKey(scope));
				tx.oncomplete = () => resolve();
				tx.onerror = () => reject(tx.error || new Error('Queue clear transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue clear transaction aborted'));
			});
		});
	}

	_updateEntry(scope, entryId, mutate) {
		return this.open().then(db => {
			if (!db) return null;
			return new Promise((resolve, reject) => {
				const tx = db.transaction(OUTBOX, 'readwrite');
				const outbox = tx.objectStore(OUTBOX);
				const request = outbox.get(entryId);
				let result = null;

				request.onerror = () => reject(requestError(request, 'Queue entry read failed'));
				request.onsuccess = () => {
					const entry = request.result;
					if (!entry || entry.scope !== scope) return;
					result = mutate(entry, outbox);
				};

				tx.oncomplete = () => resolve(result);
				tx.onerror = () => reject(tx.error || new Error('Queue entry transaction failed'));
				tx.onabort = () => reject(tx.error || new Error('Queue entry transaction aborted'));
			});
		});
	}
}

export const QUEUE_DB_NAME = DEFAULT_DB_NAME;
