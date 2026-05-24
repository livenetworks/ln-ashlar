import { registerComponent, dispatch, buildUrl, getHeaders, parseHeaders } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-api-connector';
	const DOM_ATTRIBUTE = 'lnApiConnector';
	const DOM_ALIAS = 'lnConnector';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this; // Set alias for compatibility

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

		const rawHeaders = dom.getAttribute('data-ln-api-headers') || '';
		this.headers = parseHeaders(rawHeaders, 'ln-api-connector');

		if (rawHeaders.toLowerCase().includes('authorization') || rawHeaders.toLowerCase().includes('bearer') || rawHeaders.toLowerCase().includes('basic')) {
			console.warn('[ln-api-connector] Security Warning: Sensitive authorization credentials detected in data-ln-api-headers attribute. Storing secrets in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead.');
		}

		dispatch(dom, 'ln-api-connector:config-changed', {
			baseUrl: this.baseUrl,
			path: this.path,
			headers: this.headers
		});
	};

	// ─── JS API Methods (Promises) ──────────────────────────

	_component.prototype.fetchDelta = function (since) {
		const self = this;
		let url = buildUrl(self.baseUrl, self.path);

		if (since !== undefined && since !== null && since !== '') {
			url += (url.indexOf('?') !== -1 ? '&' : '?') + 'since=' + encodeURIComponent(since);
		}

		return window.fetch(url, { method: 'GET', headers: getHeaders(self.headers), credentials: self.credentials })
			.then(res => {
				if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
				return res.json();
			});
	};

	_component.prototype.create = function (payload) {
		const self = this;
		return window.fetch(buildUrl(self.baseUrl, self.path), {
			method: 'POST',
			headers: getHeaders(self.headers),
			credentials: self.credentials,
			body: JSON.stringify(payload)
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		});
	};

	_component.prototype.update = function (id, payload) {
		const self = this;
		return window.fetch(buildUrl(self.baseUrl, self.path, id), {
			method: 'PUT',
			headers: getHeaders(self.headers),
			credentials: self.credentials,
			body: JSON.stringify(payload)
		})
		.then(res => {
			if (res.ok) return res.json();
			if (res.status === 409) return res.json().then(data => {
				const err = new Error('Conflict');
				err.status = 409;
				err.data = data;
				throw err;
			});
			throw new Error('HTTP ' + res.status + ': ' + res.statusText);
		});
	};

	_component.prototype.delete = function (id) {
		const self = this;
		return window.fetch(buildUrl(self.baseUrl, self.path, id), {
			method: 'DELETE',
			headers: getHeaders(self.headers),
			credentials: self.credentials
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		});
	};

	_component.prototype.bulkDelete = function (ids) {
		const self = this;
		return window.fetch(buildUrl(self.baseUrl, self.path) + '/bulk-delete', {
			method: 'DELETE',
			headers: getHeaders(self.headers),
			credentials: self.credentials,
			body: JSON.stringify({ ids: ids })
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		});
	};

	// ─── DOM Event Routing ────────────────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			sync: function (e) {
				const detail = e.detail || {};
				self.fetchDelta(detail.since)
					.then(function (data) {
						dispatch(self.dom, 'ln-api-connector:fetched', { data: data, since: detail.since });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'sync',
							error: err.message,
							status: err.status || 0,
							since: detail.since
						});
					});
			},
			create: function (e) {
				const detail = e.detail || {};
				self.create(detail.data)
					.then(function (record) {
						dispatch(self.dom, 'ln-api-connector:created', { record: record, tempId: detail.tempId });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'create',
							error: err.message,
							status: err.status || 0,
							tempId: detail.tempId
						});
					});
			},
			update: function (e) {
				const detail = e.detail || {};
				// Merge expected_version into payload for conflict checking
				const payload = Object.assign({}, detail.data);
				if (detail.expected_version !== undefined) {
					payload.expected_version = detail.expected_version;
				}
				self.update(detail.id, payload)
					.then(function (record) {
						dispatch(self.dom, 'ln-api-connector:updated', { record: record, id: detail.id });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'update',
							error: err.message,
							status: err.status || 0,
							id: detail.id,
							conflictData: err.status === 409 ? err.data : null
						});
					});
			},
			delete: function (e) {
				const detail = e.detail || {};
				self.delete(detail.id)
					.then(function (res) {
						dispatch(self.dom, 'ln-api-connector:deleted', { response: res, id: detail.id });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'delete',
							error: err.message,
							status: err.status || 0,
							id: detail.id
						});
					});
			},
			bulkDelete: function (e) {
				const detail = e.detail || {};
				self.bulkDelete(detail.ids)
					.then(function (res) {
						dispatch(self.dom, 'ln-api-connector:bulk-deleted', { response: res, ids: detail.ids });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-api-connector:error', {
							action: 'bulk-delete',
							error: err.message,
							status: err.status || 0,
							ids: detail.ids
						});
					});
			}
		};

		// Support both general and REST namespaces for incoming requests
		const namespaces = ['ln-api-connector', 'ln-rest-connector'];
		namespaces.forEach(function (ns) {
			self.dom.addEventListener(ns + ':request-sync', self._handlers.sync);
			self.dom.addEventListener(ns + ':request-fetch', self._handlers.sync);
			self.dom.addEventListener(ns + ':request-create', self._handlers.create);
			self.dom.addEventListener(ns + ':request-update', self._handlers.update);
			self.dom.addEventListener(ns + ':request-delete', self._handlers.delete);
			self.dom.addEventListener(ns + ':request-bulk-delete', self._handlers.bulkDelete);
		});
	}

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		const self = this;
		if (self._handlers) {
			const namespaces = ['ln-api-connector', 'ln-rest-connector'];
			namespaces.forEach(function (ns) {
				self.dom.removeEventListener(ns + ':request-sync', self._handlers.sync);
				self.dom.removeEventListener(ns + ':request-fetch', self._handlers.sync);
				self.dom.removeEventListener(ns + ':request-create', self._handlers.create);
				self.dom.removeEventListener(ns + ':request-update', self._handlers.update);
				self.dom.removeEventListener(ns + ':request-delete', self._handlers.delete);
				self.dom.removeEventListener(ns + ':request-bulk-delete', self._handlers.bulkDelete);
			});
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
			'data-ln-api-headers'
		],
		onAttributeChange: _syncAttribute
	});
})();
