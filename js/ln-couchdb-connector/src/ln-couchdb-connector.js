import { registerComponent, dispatch, buildUrl, getHeaders, parseHeaders } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-couchdb-connector';
	const DOM_ATTRIBUTE = 'lnCouchDbConnector';
	const DOM_ALIAS = 'lnConnector';

	if (window[DOM_ATTRIBUTE] !== undefined) return;

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

		const rawHeaders = dom.getAttribute('data-ln-couchdb-headers') || '';
		this.headers = parseHeaders(rawHeaders, 'ln-couchdb-connector');

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

		return window.fetch(url, { method: 'GET', headers: getHeaders(self.headers, self.auth) })
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
	_component.prototype.create = function (payload) {
		const self = this;
		const doc = Object.assign({ _id: payload.id }, payload);
		if (!doc._id) delete doc._id;

		return window.fetch(buildUrl(self.url, self.db), {
			method: 'POST',
			headers: getHeaders(self.headers, self.auth),
			body: JSON.stringify(doc)
		})
		.then(res => {
			if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			return res.json();
		})
		.then(resData => Object.assign({}, doc, { id: resData.id, _id: resData.id, _rev: resData.rev }));
	};

	/**
	 * Update a document in CouchDB.
	 * Sends PUT /{db}/{id}
	 * Handles revision checks and automatic revision fetching if rev is missing.
	 */
	_component.prototype.update = function (id, payload) {
		const self = this;
		const doc = Object.assign({ id: String(id), _id: String(id) }, payload);
		const rev = doc._rev || doc.rev;

		const getRevPromise = rev ? Promise.resolve(rev) : 
			window.fetch(buildUrl(self.url, self.db, null, id), { method: 'GET', headers: getHeaders(self.headers, self.auth) })
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
				body: JSON.stringify(finalDoc)
			})
			.then(res => {
				if (res.ok) return res.json().then(data => Object.assign({}, finalDoc, { _rev: data.rev }));
				if (res.status === 409) return res.json().then(data => {
					const err = new Error('Conflict');
					err.status = 409;
					err.data = data;
					throw err;
				});
				throw new Error('HTTP ' + res.status + ': ' + res.statusText);
			});
		});
	};

	/**
	 * Delete a document in CouchDB.
	 * Sends DELETE /{db}/{id}?rev={rev}
	 */
	_component.prototype.delete = function (id, rev) {
		const self = this;
		const getRevPromise = rev ? Promise.resolve(rev) : 
			window.fetch(buildUrl(self.url, self.db, null, id), { method: 'GET', headers: getHeaders(self.headers, self.auth) })
				.then(res => {
					if (!res.ok) throw new Error('Could not retrieve document for revision delete');
					return res.json().then(d => d._rev);
				});

		return getRevPromise.then(activeRev => {
			const deleteUrl = buildUrl(self.url, self.db, null, id) + '?rev=' + encodeURIComponent(activeRev);
			return window.fetch(deleteUrl, { method: 'DELETE', headers: getHeaders(self.headers, self.auth) })
				.then(res => {
					if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
					return res.json();
				});
		});
	};

	/**
	 * Bulk delete documents in CouchDB.
	 * Sends POST /{db}/_bulk_docs with {"docs": [{"_id": "...", "_rev": "...", "_deleted": true}]}
	 */
	_component.prototype.bulkDelete = function (ids) {
		const self = this;
		if (!ids || ids.length === 0) return Promise.resolve({ ok: true, deletedCount: 0 });

		return window.fetch(buildUrl(self.url, self.db, '_all_docs'), {
			method: 'POST',
			headers: getHeaders(self.headers, self.auth),
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

			if (docsToDelete.length === 0) return { ok: true, deletedCount: 0 };

			return window.fetch(buildUrl(self.url, self.db, '_bulk_docs'), {
				method: 'POST',
				headers: getHeaders(self.headers, self.auth),
				body: JSON.stringify({ docs: docsToDelete })
			})
			.then(res => {
				if (!res.ok) throw new Error('HTTP ' + res.status + ': ' + res.statusText);
				return res.json();
			})
			.then(bulkData => ({ ok: true, results: bulkData, deletedCount: docsToDelete.length }));
		});
	};

	// ─── DOM Event Routing ────────────────────────────────────

	function _bindEvents(self) {
		self._handlers = {
			sync: function (e) {
				const detail = e.detail || {};
				self.fetchDelta(detail.since)
					.then(function (data) {
						dispatch(self.dom, 'ln-couchdb-connector:fetched', { data: data, since: detail.since });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
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
						dispatch(self.dom, 'ln-couchdb-connector:created', { record: record, tempId: detail.tempId });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'create',
							error: err.message,
							status: err.status || 0,
							tempId: detail.tempId
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

				self.update(detail.id, payload)
					.then(function (record) {
						dispatch(self.dom, 'ln-couchdb-connector:updated', { record: record, id: detail.id });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
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
				self.delete(detail.id, detail.rev)
					.then(function (res) {
						dispatch(self.dom, 'ln-couchdb-connector:deleted', { response: res, id: detail.id });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
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
						dispatch(self.dom, 'ln-couchdb-connector:bulk-deleted', { response: res, ids: detail.ids });
					})
					.catch(function (err) {
						dispatch(self.dom, 'ln-couchdb-connector:error', {
							action: 'bulk-delete',
							error: err.message,
							status: err.status || 0,
							ids: detail.ids
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
