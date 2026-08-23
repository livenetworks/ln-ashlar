import { registerComponent, dispatch, getHeaders, parseHeaders } from '../../ln-core';
import { buildQueryParams, buildQueryUrl, joinUrl, unwrapEnvelope } from './connector-core';

(function () {
	const DOM_SELECTOR = 'data-ln-api-connector';
	const DOM_ATTRIBUTE = 'lnApiConnector';
	const DOM_ALIAS = 'lnConnector';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Response Resolver ──────────────────────────────────

	function _resolve(res) {
		if (res.ok) return res.status === 204 ? null : res.json();
		return res.json().catch(() => null).then(body => {
			const err = new Error('HTTP ' + res.status + ': ' + res.statusText);
			err.status = res.status;
			err.data = body;
			throw err;
		});
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this; // Set alias for compatibility

		this._inflight = new Map();
		this._queryTimers = new Map(); // per-key: { timer, pendingDetail, pendingParams, pendingTarget }
		this.refreshConfig();
		this._handlers = null;
		_bindEvents(this);

		return this;
	}

	// ─── Refresh Config from DOM Attributes ─────────────────

	_component.prototype.refreshConfig = function () {
		const dom = this.dom;

		this.baseUrl = dom.getAttribute('data-ln-api-base-url') || '';
		this.path = dom.getAttribute('data-ln-api-path') || '';
		this.credentials = 'same-origin';
		this.rawHeaders = dom.getAttribute('data-ln-api-headers');
		this.headers = parseHeaders(this.rawHeaders);

		const paramKeys = {};
		const offset = dom.getAttribute('data-ln-api-param-offset');
		if (offset) paramKeys.offset = offset;
		const limit = dom.getAttribute('data-ln-api-param-limit');
		if (limit) paramKeys.limit = limit;
		const search = dom.getAttribute('data-ln-api-param-search');
		if (search) paramKeys.search = search;
		const sortField = dom.getAttribute('data-ln-api-param-sort-field');
		if (sortField) paramKeys.sortField = sortField;
		const sortDir = dom.getAttribute('data-ln-api-param-sort-dir');
		if (sortDir) paramKeys.sortDir = sortDir;
		this.paramKeys = paramKeys;

		const qd = dom.getAttribute('data-ln-api-connector-query-debounce');
		this.queryDebounce = qd !== null ? +qd : 300;

		dispatch(this.dom, 'ln-api-connector:config-changed', {
			baseUrl: this.baseUrl,
			path: this.path,
			headers: this.headers,
			paramKeys: this.paramKeys
		});
	};

	// ─── Request Headers (forces X-LN-Response) ─────────────

	_component.prototype._reqHeaders = function (idempotencyKey) {
		const headers = Object.assign({}, this.headers);
		if (!headers['Accept'] && !headers['accept']) {
			headers['Accept'] = 'application/json';
		}
		if (!headers['Content-Type'] && !headers['content-type']) {
			headers['Content-Type'] = 'application/json';
		}
		if (idempotencyKey) {
			headers['X-Idempotency-Key'] = idempotencyKey;
		}
		return headers;
	};

	// ─── Cancellation API ────────────────────────────────────

	_component.prototype.cancel = function (key) {
		if (!key) return false;
		if (this._inflight.has(key)) {
			this._inflight.get(key).abort();
			this._inflight.delete(key);
			return true;
		}
		return false;
	};

	// ─── JS API Methods (Promises) ──────────────────────────

	_component.prototype.fetchDelta = function (since, targetEl) {
		const self = this;
		let url = joinUrl(self.baseUrl, self.path);

		if (since !== undefined && since !== null && since !== '') {
			url += (url.indexOf('?') !== -1 ? '&' : '?') + 'since=' + encodeURIComponent(since);
		}

		const key = targetEl || 'sync';
		if (self._inflight.has(key)) {
			self._inflight.get(key).abort();
		}
		const controller = new AbortController();
		self._inflight.set(key, controller);

		return window.fetch(url, {
			method: 'GET',
			headers: self._reqHeaders(),
			credentials: self.credentials,
			signal: controller.signal
		})
		.then(_resolve)
		.finally(function () {
			if (self._inflight.get(key) === controller) {
				self._inflight.delete(key);
			}
		});
	};

	_component.prototype.query = function (queryParams, targetEl) {
		const self = this;
		const qs = buildQueryParams(queryParams, self.paramKeys);
		const url = buildQueryUrl(self.baseUrl, self.path, qs);

		const key = targetEl || 'query';
		if (self._inflight.has(key)) {
			self._inflight.get(key).abort();
		}
		const controller = new AbortController();
		self._inflight.set(key, controller);

		return window.fetch(url, {
			method: 'GET',
			headers: self._reqHeaders(),
			credentials: self.credentials,
			signal: controller.signal
		})
		.then(_resolve)
		.finally(function () {
			if (self._inflight.get(key) === controller) {
				self._inflight.delete(key);
			}
		});
	};

	_component.prototype.create = function (payload, url, idempotencyKey) {
		const self = this;
		return window.fetch(joinUrl(self.baseUrl, url || self.path), {
			method: 'POST',
			headers: self._reqHeaders(idempotencyKey),
			credentials: self.credentials,
			body: JSON.stringify(payload)
		})
		.then(_resolve);
	};

	_component.prototype.update = function (id, payload, expectedVersion, url, idempotencyKey) {
		const self = this;
		if (expectedVersion !== undefined && expectedVersion !== null) {
			payload = Object.assign({}, payload, { expected_version: expectedVersion });
		}
		// An explicit `url` is the COMPLETE resource URL — it already carries the
		// id (e.g. the form's resolved action `/documents/42`). Do NOT re-append
		// id, symmetric with create(). Only the path fallback needs id appended.
		const target = url ? joinUrl(self.baseUrl, url) : joinUrl(self.baseUrl, self.path, id);
		return window.fetch(target, {
			method: 'PUT',
			headers: self._reqHeaders(idempotencyKey),
			credentials: self.credentials,
			body: JSON.stringify(payload)
		})
		.then(_resolve);
	};

	_component.prototype.delete = function (id, url, idempotencyKey) {
		const self = this;
		return window.fetch(joinUrl(self.baseUrl, url || self.path, id), {
			method: 'DELETE',
			headers: self._reqHeaders(idempotencyKey),
			credentials: self.credentials
		})
		.then(_resolve);
	};

	_component.prototype.bulkDelete = function (ids, url, idempotencyKey) {
		const self = this;
		return window.fetch(joinUrl(self.baseUrl, url || self.path, 'bulk-delete'), {
			method: 'DELETE',
			headers: self._reqHeaders(idempotencyKey),
			credentials: self.credentials,
			body: JSON.stringify({ ids: ids })
		})
		.then(_resolve);
	};

	// ─── DOM Event Routing ────────────────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			sync: function (e) {
				const detail = e.detail || {};
				const targetEl = (detail.meta && detail.meta.targetEl) ? detail.meta.targetEl : null;
				self.fetchDelta(detail.since, targetEl)
					.then(function (data) {
						dispatch(self.dom, 'ln-api-connector:fetched', { data: data, since: detail.since, meta: detail.meta || null });
					})
					.catch(function (err) {
						if (err && err.name === 'AbortError') return;
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'sync',
							error: err.message,
							status: err.status || 0,
							data: err.data || null,
							since: detail.since,
							meta: detail.meta || null
						});
					});
			},
			query: function (e) {
				const detail = e.detail || {};
				const queryParams = detail.query || detail;
				const targetEl = (detail.meta && detail.meta.targetEl) ? detail.meta.targetEl : null;
				const key = targetEl || 'query';
				const delay = self.queryDebounce;

				function _doQuery(d, qp, tel) {
					self.query(qp, tel)
						.then(function (res) {
							const payload = res || {};
							dispatch(self.dom, 'ln-api-connector:fetched', {
								data: payload.data || (Array.isArray(payload) ? payload : []),
								total: payload.total,
								filtered: payload.filtered,
								offset: qp.offset,
								queryGen: qp.queryGen,
								meta: d.meta || null
							});
						})
						.catch(function (err) {
							if (err && err.name === 'AbortError') return;
							dispatch(self.dom, 'ln-api-connector:error', {
								action: 'query',
								error: err.message,
								status: err.status || 0,
								data: err.data || null,
								meta: d.meta || null
							});
						});
				}

				if (delay === 0) {
					_doQuery(detail, queryParams, targetEl);
					return;
				}

				if (self._queryTimers.has(key)) {
					clearTimeout(self._queryTimers.get(key));
				}

				const timer = setTimeout(function () {
					self._queryTimers.delete(key);
					_doQuery(detail, queryParams, targetEl);
				}, delay);

				self._queryTimers.set(key, timer);
			},
			cancel: function (e) {
				const detail = e.detail || {};
				const targetKey = (detail.meta && detail.meta.targetEl) ? detail.meta.targetEl : (detail.targetEl || detail.key);
				if (targetKey) self.cancel(targetKey);
			},
			create: function (e) {
				const detail = e.detail || {};
				self.create(detail.data, detail.url, detail.idempotencyKey)
					.then(function (body) {
						const unwrapped = unwrapEnvelope(body);
						dispatch(self.dom, 'ln-api-connector:created', {
							record: unwrapped.record,
							tempId: detail.tempId,
							message: unwrapped.message,
							meta: detail.meta || null
						});
					})
					.catch(function (err) {
						if (err && err.name === 'AbortError') return;
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'create',
							error: err.message,
							status: err.status || 0,
							data: err.data || null,
							tempId: detail.tempId,
							meta: detail.meta || null
						});
					});
			},
			update: function (e) {
				const detail = e.detail || {};
				self.update(detail.id, detail.data, detail.expected_version, detail.url, detail.idempotencyKey)
					.then(function (body) {
						const unwrapped = unwrapEnvelope(body);
						dispatch(self.dom, 'ln-api-connector:updated', {
							record: unwrapped.record,
							id: detail.id,
							message: unwrapped.message,
							meta: detail.meta || null
						});
					})
					.catch(function (err) {
						if (err && err.name === 'AbortError') return;
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'update',
							error: err.message,
							status: err.status || 0,
							data: err.data || null,
							id: detail.id,
							conflictData: err.status === 409 ? err.data : null,
							meta: detail.meta || null
						});
					});
			},
			delete: function (e) {
				const detail = e.detail || {};
				self.delete(detail.id, detail.url, detail.idempotencyKey)
					.then(function (body) {
						const message = (body && body.message) ? body.message : null;
						dispatch(self.dom, 'ln-api-connector:deleted', {
							response: body,
							id: detail.id,
							message: message,
							meta: detail.meta || null
						});
					})
					.catch(function (err) {
						if (err && err.name === 'AbortError') return;
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'delete',
							error: err.message,
							status: err.status || 0,
							data: err.data || null,
							id: detail.id,
							meta: detail.meta || null
						});
					});
			},
			bulkDelete: function (e) {
				const detail = e.detail || {};
				self.bulkDelete(detail.ids, detail.url, detail.idempotencyKey)
					.then(function (body) {
						const message = (body && body.message) ? body.message : null;
						dispatch(self.dom, 'ln-api-connector:bulk-deleted', {
							response: body,
							ids: detail.ids,
							message: message,
							meta: detail.meta || null
						});
					})
					.catch(function (err) {
						if (err && err.name === 'AbortError') return;
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'bulk-delete',
							error: err.message,
							status: err.status || 0,
							data: err.data || null,
							ids: detail.ids,
							meta: detail.meta || null
						});
					});
			}
		};

		self.dom.addEventListener('ln-api-connector:request-sync', self._handlers.sync);
		self.dom.addEventListener('ln-api-connector:request-query', self._handlers.query);
		self.dom.addEventListener('ln-api-connector:request-fetch', self._handlers.query);
		self.dom.addEventListener('ln-api-connector:request-cancel', self._handlers.cancel);
		self.dom.addEventListener('ln-api-connector:request-create', self._handlers.create);
		self.dom.addEventListener('ln-api-connector:request-update', self._handlers.update);
		self.dom.addEventListener('ln-api-connector:request-delete', self._handlers.delete);
		self.dom.addEventListener('ln-api-connector:request-bulk-delete', self._handlers.bulkDelete);
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		const self = this;
		if (self._inflight) {
			self._inflight.forEach(function (controller) {
				controller.abort();
			});
			self._inflight.clear();
		}

		if (this._queryTimers) {
			this._queryTimers.forEach(function (timer) {
				if (timer) clearTimeout(timer);
			});
			this._queryTimers.clear();
		}

		if (this._handlers) {
			self.dom.removeEventListener('ln-api-connector:request-sync', self._handlers.sync);
			self.dom.removeEventListener('ln-api-connector:request-query', self._handlers.query);
			self.dom.removeEventListener('ln-api-connector:request-fetch', self._handlers.query);
			self.dom.removeEventListener('ln-api-connector:request-cancel', self._handlers.cancel);
			self.dom.removeEventListener('ln-api-connector:request-create', self._handlers.create);
			self.dom.removeEventListener('ln-api-connector:request-update', self._handlers.update);
			self.dom.removeEventListener('ln-api-connector:request-delete', self._handlers.delete);
			self.dom.removeEventListener('ln-api-connector:request-bulk-delete', self._handlers.bulkDelete);
			self._handlers = null;
		}

		dispatch(this.dom, 'ln-api-connector:destroyed', { target: this.dom });

		delete this.dom[DOM_ATTRIBUTE];
		delete this.dom[DOM_ALIAS];
	};

	// ─── Attribute Sync ────────────────────────────────────────

	function _syncAttribute(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		instance.refreshConfig();
	}

	// ─── Registration ──────────────────────────────────────

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-api-connector', {
		extraAttributes: [
			'data-ln-api-base-url',
			'data-ln-api-path',
			'data-ln-api-headers',
			'data-ln-api-param-offset',
			'data-ln-api-param-limit',
			'data-ln-api-param-search',
			'data-ln-api-param-sort-field',
			'data-ln-api-param-sort-dir',
			'data-ln-api-connector-query-debounce'
		],
		onAttributeChange: _syncAttribute
	});
})();
