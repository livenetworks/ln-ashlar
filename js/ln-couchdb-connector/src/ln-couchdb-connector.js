import { registerComponent, dispatch, buildUrl, getHeaders, parseHeaders } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-couchdb-connector';
	const DOM_ATTRIBUTE = 'lnCouchDbConnector';
	const DOM_ALIAS = 'lnConnector';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// ─── Response Envelope Unwrap (presence-checked `{message, content}`) ──
	// Raw CouchDB never sends this envelope (content=body, message=null — no-op).
	// A proxy/gateway in front of CouchDB may wrap responses; this makes that
	// transparent without requiring it. Mirrors ln-api-connector.js's unwrap.
	function _unwrapEnvelope(body) {
		const content = (body && body.content !== undefined) ? body.content : body;
		const message = (body && body.message) ? body.message : null;
		return { content: content, message: message };
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		dom[DOM_ATTRIBUTE] = this;
		dom[DOM_ALIAS] = this; // Alias for 3-tier compatibility

		this.refreshConfig();
		this._handlers = null;
		_bindEvents(this);

		return this;
	}

	// ─── Refresh Config from DOM Attributes ─────────────────

	_component.prototype.refreshConfig = function () {
		const dom = this.dom;

		this.url = dom.getAttribute('data-ln-couchdb-url') || '';
		this.db = dom.getAttribute('data-ln-couchdb-db') || '';
		this.auth = dom.getAttribute('data-ln-couchdb-auth') || '';
		this.credentials = 'same-origin';

		const rawHeaders = dom.getAttribute('data-ln-couchdb-headers') || '';
		this.headers = parseHeaders(rawHeaders, 'ln-couchdb-connector');

		if (this.auth) {
			console.warn('[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-auth attribute. Storing basic authentication credentials in HTML DOM attributes is highly discouraged and vulnerable to XSS credential extraction. Please use HttpOnly session cookies or a Backend Proxy Gateway instead.');
		}
		if (rawHeaders.toLowerCase().includes('authorization')) {
			console.warn('[ln-couchdb-connector] Security Warning: Sensitive authorization credentials detected in data-ln-couchdb-headers attribute. Please use HttpOnly session cookies or a Backend Proxy Gateway instead.');
		}

		dispatch(dom, 'ln-couchdb-connector:config-changed', {
			url: this.url,
			db: this.db,
			auth: this.auth ? '[REDACTED]' : '',
			headers: this.headers
		});
	};

	// ─── CouchDB REST API Methods (Promises) ────────────────

	/**
	 * Fetch changed records since a sequence.
	 * Calls CouchDB /{db}/_changes?include_docs=true&since={since}
	 */
	_component.prototype.fetchDelta = function (since) {
		const self = this;
		const params = ['include_docs=true', 'feed=normal'];
		if (since) params.push('since=' + encodeURIComponent(since));
		const url = buildUrl(self.url, self.db, '_changes') + '?' + params.join('&');

		return window.fetch(url, { method: 'GET', headers: getHeaders(self.headers, self.auth), credentials: self.credentials })
			.then(res => {
				if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
				return res.json();
			})
			.then(data => {
				const results = data.results || [];
				return {
					data: results.filter(r => !r.deleted && r.doc).map(r => Object.assign({}, r.doc, { id: r.doc._id })),
					deleted: results.filter(r => r.deleted).map(r => r.id),
					synced_at: data.last_seq || since || ''
				};
			});
	};

	/**
	 * Create a document in CouchDB.
	 * Sends POST /{db}
	 */
	function _rawCreate(self, payload) {
		const doc = Object.assign({ _id: payload.id }, payload);
		if (!doc._id) delete doc._id;

		return window.fetch(buildUrl(self.url, self.db), {
			method: 'POST',
			headers: getHeaders(self.headers, self.auth),
			credentials: self.credentials,
			body: JSON.stringify(doc)
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		})
		.then(body => {
			const unwrapped = _unwrapEnvelope(body);
			const resData = unwrapped.content;
			const record = Object.assign({}, doc, { id: resData.id, _id: resData.id, _rev: resData.rev });
			return { record: record, message: unwrapped.message };
		});
	}

	_component.prototype.create = function (payload) {
		return _rawCreate(this, payload).then(r => r.record);
	};

	/**
	 * Update a document in CouchDB.
	 * Sends PUT /{db}/{id}
	 * Handles revision checks and automatic revision fetching if rev is missing.
	 */
	function _rawUpdate(self, id, payload) {
		const doc = Object.assign({ id: String(id), _id: String(id) }, payload);
		const rev = doc._rev || doc.rev;

		const getRevPromise = rev ? Promise.resolve(rev) :
			window.fetch(buildUrl(self.url, self.db, null, id), { method: 'GET', headers: getHeaders(self.headers, self.auth), credentials: self.credentials })
				.then(res => {
					if (!res.ok) throw new Error('Could not retrieve document for revision mapping');
					return res.json().then(d => d._rev);
				});

		return getRevPromise.then(activeRev => {
			const finalDoc = Object.assign({}, doc, { _rev: activeRev });
			delete finalDoc.rev;

			const headers = Object.assign(getHeaders(self.headers, self.auth), { 'If-Match': activeRev });
			return window.fetch(buildUrl(self.url, self.db, null, id), {
				method: 'PUT',
				headers: headers,
				credentials: self.credentials,
				body: JSON.stringify(finalDoc)
			})
			.then(res => {
				if (res.ok) return res.json().then(body => {
					const unwrapped = _unwrapEnvelope(body);
					const record = Object.assign({}, finalDoc, { _rev: unwrapped.content.rev });
					return { record: record, message: unwrapped.message };
				});
				if (res.status === 409) return res.json().then(data => {
					const err = new Error('Conflict');
					err.status = 409;
					err.data = data;
					throw err;
				});
				throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			});
		});
	}

	_component.prototype.update = function (id, payload) {
		return _rawUpdate(this, id, payload).then(r => r.record);
	};

	/**
	 * Delete a document in CouchDB.
	 * Sends DELETE /{db}/{id}?rev={rev}
	 */
	function _rawDelete(self, id, rev) {
		const getRevPromise = rev ? Promise.resolve(rev) :
			window.fetch(buildUrl(self.url, self.db, null, id), { method: 'GET', headers: getHeaders(self.headers, self.auth), credentials: self.credentials })
				.then(res => {
					if (!res.ok) throw new Error('Could not retrieve document for revision delete');
					return res.json().then(d => d._rev);
				});

		return getRevPromise.then(activeRev => {
			const deleteUrl = buildUrl(self.url, self.db, null, id) + '?rev=' + encodeURIComponent(activeRev);
			return window.fetch(deleteUrl, { method: 'DELETE', headers: getHeaders(self.headers, self.auth), credentials: self.credentials })
				.then(res => {
					if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
					return res.json();
				})
				.then(body => {
					const unwrapped = _unwrapEnvelope(body);
					return { response: unwrapped.content, message: unwrapped.message };
				});
		});
	}

	_component.prototype.delete = function (id, rev) {
		return _rawDelete(this, id, rev).then(r => r.response);
	};

	/**
	 * Bulk delete documents in CouchDB.
	 * Sends POST /{db}/_bulk_docs with {"docs": [{"_id": "...", "_rev": "...", "_deleted": true}]}
	 */
	function _rawBulkDelete(self, ids) {
		if (!ids || ids.length === 0) return Promise.resolve({ response: { ok: true, deletedCount: 0 }, message: null });

		return window.fetch(buildUrl(self.url, self.db, '_all_docs'), {
			method: 'POST',
			headers: getHeaders(self.headers, self.auth),
			credentials: self.credentials,
			body: JSON.stringify({ keys: ids })
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		})
		.then(data => {
			const rows = data.rows || [];
			const docsToDelete = rows
				.filter(r => !r.error && r.value && r.value.rev)
				.map(r => ({ _id: r.id, _rev: r.value.rev, _deleted: true }));

			if (docsToDelete.length === 0) return { response: { ok: true, deletedCount: 0 }, message: null };

			return window.fetch(buildUrl(self.url, self.db, '_bulk_docs'), {
				method: 'POST',
				headers: getHeaders(self.headers, self.auth),
				credentials: self.credentials,
				body: JSON.stringify({ docs: docsToDelete })
			})
			.then(res => {
				if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
				return res.json();
			})
			.then(body => {
				const unwrapped = _unwrapEnvelope(body);
				return { response: { ok: true, results: unwrapped.content, deletedCount: docsToDelete.length }, message: unwrapped.message };
			});
		});
	}

	_component.prototype.bulkDelete = function (ids) {
		return _rawBulkDelete(this, ids).then(r => r.response);
	};

	// ─── DOM Event Routing ────────────────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			sync: function (e) {
				const detail = e.detail || {};
				self.fetchDelta(detail.since)
					.then(function (data) {
						dispatch(self.dom, 'ln-couchdb-connector:fetched', { data: data, since: detail.since, meta: detail.meta || null });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'sync',
							error: err.message,
							status: err.status || 0,
							since: detail.since,
							meta: detail.meta || null
						});
					});
			},
			create: function (e) {
				const detail = e.detail || {};
				_rawCreate(self, detail.data)
					.then(function (r) {
						dispatch(self.dom, 'ln-couchdb-connector:created', { record: r.record, tempId: detail.tempId, message: r.message, meta: detail.meta || null });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'create',
							error: err.message,
							status: err.status || 0,
							tempId: detail.tempId,
							meta: detail.meta || null
						});
					});
			},
			update: function (e) {
				const detail = e.detail || {};
				const payload = Object.assign({}, detail.data);

				// Handle expected revision details
				if (detail.expected_version !== undefined) {
					payload._rev = detail.expected_version;
				}

				_rawUpdate(self, detail.id, payload)
					.then(function (r) {
						dispatch(self.dom, 'ln-couchdb-connector:updated', { record: r.record, id: detail.id, message: r.message, meta: detail.meta || null });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'update',
							error: err.message,
							status: err.status || 0,
							id: detail.id,
							data: err.status === 409 ? err.data : null,
							conflictData: err.status === 409 ? err.data : null,
							meta: detail.meta || null
						});
					});
			},
			delete: function (e) {
				const detail = e.detail || {};
				_rawDelete(self, detail.id, detail.rev)
					.then(function (r) {
						dispatch(self.dom, 'ln-couchdb-connector:deleted', { response: r.response, id: detail.id, message: r.message, meta: detail.meta || null });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'delete',
							error: err.message,
							status: err.status || 0,
							id: detail.id,
							meta: detail.meta || null
						});
					});
			},
			bulkDelete: function (e) {
				const detail = e.detail || {};
				_rawBulkDelete(self, detail.ids)
					.then(function (r) {
						dispatch(self.dom, 'ln-couchdb-connector:bulk-deleted', { response: r.response, ids: detail.ids, message: r.message, meta: detail.meta || null });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'bulk-delete',
							error: err.message,
							status: err.status || 0,
							ids: detail.ids,
							meta: detail.meta || null
						});
					});
			}
		};

		// Bind events for CouchDB namespaces and also REST/API connector namespaces for 3-tier compatibility
		const namespaces = ['ln-couchdb-connector', 'ln-api-connector', 'ln-rest-connector'];
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
			const namespaces = ['ln-couchdb-connector', 'ln-api-connector', 'ln-rest-connector'];
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

		dispatch(this.dom, 'ln-couchdb-connector:destroyed', { target: this.dom });

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

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-couchdb-connector', {
		extraAttributes: [
			'data-ln-couchdb-url',
			'data-ln-couchdb-db',
			'data-ln-couchdb-auth',
			'data-ln-couchdb-headers'
		],
		onAttributeChange: _syncAttribute
	});
})();
