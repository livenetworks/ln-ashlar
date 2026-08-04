import { registerComponent, dispatch } from '../../ln-core';
import { QueueStorage } from './queue-storage';

(function () {
	const DOM_SELECTOR = 'data-ln-api-queue';
	const DOM_ATTRIBUTE = 'lnApiQueue';
	const BACKOFF_LADDER = [2000, 5000, 15000, 60000, 300000];
	const MAX_ATTEMPTS = 8;
	const LEASE_MS = 60000;

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _uuid() {
		try { return crypto.randomUUID(); }
		catch (_) {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
				const r = Math.random() * 16 | 0;
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});
		}
	}

	const _storage = new QueueStorage({
		indexedDB: window.indexedDB,
		IDBKeyRange: window.IDBKeyRange,
		uuid: _uuid
	});

	function _component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;

		const coordinatorEl = dom.closest('[data-ln-data-coordinator]');
		this.scope = dom.id || (coordinatorEl ? coordinatorEl.id : null) || 'default';

		this._paused = false;
		this._timers = new Map();
		this._workerId = _uuid();
		this._drainPromise = null;
		this._onlineHandler = () => this._drain();

		this._bindEvents();
		window.addEventListener('online', this._onlineHandler);

		const self = this;
		_storage.open()
			.then(db => {
				if (!db) {
					console.warn('[ln-api-queue] IndexedDB not available — queue disabled');
					return false;
				}
				return _storage.getPaused(self.scope);
			})
			.then(paused => {
				self._paused = !!paused;
				if (self._paused) dispatch(self.dom, 'ln-api-queue:paused', { reason: 'auth', restored: true });
				return self._emitPendingCount();
			})
			.then(() => self._drain())
			.catch(error => {
				console.error('[ln-api-queue] Initialization failed:', error);
				dispatch(self.dom, 'ln-api-queue:error', { operation: 'initialize', error });
			});

		return this;
	}

	_component.prototype._isOnline = function () {
		const attr = this.dom.getAttribute('data-ln-api-queue-online');
		if (attr === 'true') return true;
		if (attr === 'false') return false;
		return navigator.onLine;
	};

	_component.prototype._emitPendingCount = function () {
		const self = this;
		return _storage.allForScope(self.scope).then(entries => {
			dispatch(self.dom, 'ln-api-queue:pending-count', { count: entries.length, scope: self.scope });
			if (entries.length === 0) {
				dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
			}
			return entries;
		});
	};

	_component.prototype._clearTimer = function (chainKey) {
		const timer = this._timers.get(chainKey);
		if (timer) {
			clearTimeout(timer);
			this._timers.delete(chainKey);
		}
	};

	_component.prototype._scheduleTimer = function (chainKey, delta) {
		const delay = Math.max(0, delta);
		const current = this._timers.get(chainKey);
		if (current) clearTimeout(current);

		const self = this;
		const timer = setTimeout(() => {
			self._timers.delete(chainKey);
			self._drain();
		}, delay);
		this._timers.set(chainKey, timer);
	};

	_component.prototype._drain = function () {
		const self = this;
		if (self._paused || !self._isOnline()) return Promise.resolve();
		if (self._drainPromise) return self._drainPromise;

		self._drainPromise = _storage.claimReady(self.scope, self._workerId, LEASE_MS)
			.then(result => {
				for (const wakeup of result.wakeups) {
					self._scheduleTimer(wakeup.chainKey, wakeup.at - Date.now());
				}

				for (const entry of result.entries) {
					self._clearTimer(entry.chainKey);
					dispatch(self.dom, 'ln-api-queue:send', {
						entryId: entry.entryId,
						chainKey: entry.chainKey,
						op: entry.op,
						targetId: entry.targetId,
						payload: entry.payload,
						expectedVersion: entry.expectedVersion,
						idempotencyKey: entry.entryId,
						meta: entry.meta
					});
				}
			})
			.catch(error => {
				console.error('[ln-api-queue] Drain failed:', error);
				dispatch(self.dom, 'ln-api-queue:error', { operation: 'drain', error });
			})
			.finally(() => {
				self._drainPromise = null;
			});

		return self._drainPromise;
	};

	_component.prototype._onEnqueue = function (e) {
		const self = this;
		return _storage.enqueue(self.scope, e.detail || {})
			.then(entry => {
				if (!entry) return;
				return self._emitPendingCount().then(entries => {
					dispatch(self.dom, 'ln-api-queue:enqueued', {
						entryId: entry.entryId,
						chainKey: entry.chainKey,
						count: entries.length
					});
					return self._drain();
				});
			})
			.catch(error => {
				dispatch(self.dom, 'ln-api-queue:error', { operation: 'enqueue', error });
			});
	};

	_component.prototype._onAck = function (e) {
		const self = this;
		const detail = e.detail || {};
		return _storage.ack(self.scope, detail.entryId)
			.then(() => self._emitPendingCount())
			.then(() => self._drain())
			.catch(error => {
				dispatch(self.dom, 'ln-api-queue:error', { operation: 'ack', entryId: detail.entryId, error });
			});
	};

	_component.prototype._onNack = function (e) {
		const self = this;
		const detail = e.detail || {};

		return _storage.nack(self.scope, detail.entryId, detail.reason, {
			maxAttempts: MAX_ATTEMPTS,
			backoff: BACKOFF_LADDER
		}).then(result => {
			if (!result) return;

			if (result.status === 'failed') {
				dispatch(self.dom, 'ln-api-queue:failed', {
					entryId: result.entry.entryId,
					chainKey: result.entry.chainKey,
					attempts: result.entry.attempts
				});
			} else if (result.status === 'retry') {
				self._scheduleTimer(result.entry.chainKey, result.delay);
			} else if (result.status === 'auth') {
				self._paused = true;
				dispatch(self.dom, 'ln-api-queue:paused', { reason: 'auth' });
				dispatch(self.dom, 'ln-api-queue:auth-required', {
					entryId: result.entry.entryId,
					chainKey: result.entry.chainKey
				});
			}

			return self._emitPendingCount().then(() => {
				if (result.status === 'dropped') return self._drain();
			});
		}).catch(error => {
			dispatch(self.dom, 'ln-api-queue:error', { operation: 'nack', entryId: detail.entryId, error });
		});
	};

	_component.prototype._onRemap = function (e) {
		const self = this;
		const detail = e.detail || {};
		return _storage.remap(self.scope, detail.oldKey, detail.newId)
			.catch(error => {
				dispatch(self.dom, 'ln-api-queue:error', { operation: 'remap', error });
			});
	};

	_component.prototype._onResolveCreate = function (e) {
		const self = this;
		const detail = e.detail || {};
		return _storage.resolveCreate(self.scope, detail.entryId, detail.oldKey, detail.newId)
			.then(() => self._emitPendingCount())
			.then(() => self._drain())
			.catch(error => {
				dispatch(self.dom, 'ln-api-queue:error', {
					operation: 'resolve-create',
					entryId: detail.entryId,
					error
				});
			});
	};

	_component.prototype._onResume = function () {
		const self = this;
		return _storage.setPaused(self.scope, false).then(() => {
			self._paused = false;
			dispatch(self.dom, 'ln-api-queue:resumed', {});
			return self._drain();
		}).catch(error => {
			dispatch(self.dom, 'ln-api-queue:error', { operation: 'resume', error });
		});
	};

	_component.prototype._onDrain = function () {
		const self = this;
		return _storage.resetFailed(self.scope).then(() => {
			const activeDrain = self._drainPromise;
			return activeDrain ? activeDrain.then(() => self._drain()) : self._drain();
		}).catch(error => {
			dispatch(self.dom, 'ln-api-queue:error', { operation: 'manual-drain', error });
		});
	};

	_component.prototype._onClear = function () {
		const self = this;
		self._timers.forEach(timer => clearTimeout(timer));
		self._timers.clear();
		return _storage.clear(self.scope).then(() => {
			self._paused = false;
			dispatch(self.dom, 'ln-api-queue:pending-count', { count: 0, scope: self.scope });
			dispatch(self.dom, 'ln-api-queue:drained', { scope: self.scope });
		}).catch(error => {
			dispatch(self.dom, 'ln-api-queue:error', { operation: 'clear', error });
		});
	};

	_component.prototype._bindEvents = function () {
		const self = this;
		self._handlers = {
			enqueue: e => self._onEnqueue(e),
			ack: e => self._onAck(e),
			nack: e => self._onNack(e),
			remap: e => self._onRemap(e),
			resolveCreate: e => self._onResolveCreate(e),
			resume: () => self._onResume(),
			drain: () => self._onDrain(),
			clear: () => self._onClear()
		};

		self.dom.addEventListener('ln-api-queue:request-enqueue', self._handlers.enqueue);
		self.dom.addEventListener('ln-api-queue:ack', self._handlers.ack);
		self.dom.addEventListener('ln-api-queue:nack', self._handlers.nack);
		self.dom.addEventListener('ln-api-queue:request-remap', self._handlers.remap);
		self.dom.addEventListener('ln-api-queue:resolve-create', self._handlers.resolveCreate);
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
		self.dom.removeEventListener('ln-api-queue:resolve-create', self._handlers.resolveCreate);
		self.dom.removeEventListener('ln-api-queue:request-resume', self._handlers.resume);
		self.dom.removeEventListener('ln-api-queue:request-drain', self._handlers.drain);
		self.dom.removeEventListener('ln-api-queue:request-clear', self._handlers.clear);
		window.removeEventListener('online', self._onlineHandler);

		self._timers.forEach(timer => clearTimeout(timer));
		self._timers.clear();

		dispatch(self.dom, 'ln-api-queue:destroyed', { scope: self.scope });
		delete self.dom[DOM_ATTRIBUTE];
	};

	function _syncAttr(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance._drain();
	}

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-api-queue', {
		extraAttributes: ['data-ln-api-queue-online'],
		onAttributeChange: _syncAttr
	});
})();
