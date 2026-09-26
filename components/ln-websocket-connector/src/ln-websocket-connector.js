import { registerComponent, dispatch, defineAttrs, attrSpec, attrStr } from '../../ln-core';

(function () {
	const DOM_SELECTOR = 'data-ln-websocket-connector';
	const DOM_ATTRIBUTE = 'lnWebsocketConnector';
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const RECONNECT_MIN_MS = 1000;
	const RECONNECT_MAX_MS = 30000;

	// ─── Attribute Contract (SSOT) ──────────────────────────
	// Both attributes are commands from outside. Connection status is private
	// state announced by events — never an attribute (DOCTRINE §3).
	function _applyCommand(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance) return;
		if (instance.command === 'connect') instance._open();
		else instance._disconnect();
	}

	function _applyUrl(el) {
		const instance = el[DOM_ATTRIBUTE];
		if (!instance || instance.command !== 'connect') return;
		instance._drop('url-changed');
		instance._open();
	}

	const ATTRIBUTES = {
		'data-ln-websocket-connector':     { prop: 'command', type: 'enum', values: ['connect', 'disconnect'], fallback: 'connect', effect: _applyCommand, description: 'Connection command set from outside: connect or disconnect' },
		'data-ln-websocket-connector-url': { prop: 'url', read: attrStr, type: 'string', fallback: '', effect: _applyUrl, description: 'WebSocket endpoint URL (ws:// or wss://)' }
	};
	const ATTR_SPEC = attrSpec(ATTRIBUTES);

	// Request event → wire type. Keys are literal event names for the scanners.
	const REQUESTS = {
		'ln-websocket-connector:request-sync':        'sync',
		'ln-websocket-connector:request-query':       'query',
		'ln-websocket-connector:request-create':      'create',
		'ln-websocket-connector:request-update':      'update',
		'ln-websocket-connector:request-delete':      'delete',
		'ln-websocket-connector:request-bulk-delete': 'bulk-delete'
	};

	// Only wire fields leave the page — `meta` stays local (it carries DOM refs).
	function _payload(type, detail) {
		if (type === 'sync') return { since: detail.since };
		if (type === 'query') return { query: detail.query || {} };
		if (type === 'create') return { data: detail.data, idempotencyKey: detail.idempotencyKey };
		if (type === 'update') return { id: detail.id, data: detail.data, expected_version: detail.expected_version, idempotencyKey: detail.idempotencyKey };
		if (type === 'delete') return { id: detail.id, idempotencyKey: detail.idempotencyKey };
		return { ids: detail.ids, idempotencyKey: detail.idempotencyKey };
	}

	// ─── Component Constructor ─────────────────────────────

	function _component(dom) {
		this.dom = dom;
		defineAttrs(this, dom, ATTR_SPEC);
		dom[DOM_ATTRIBUTE] = this;

		this._socket = null;
		this._status = 'disconnected';
		this._attempt = 0;
		this._timer = null;
		this._seq = 0;
		this._pending = new Map(); // ref → { type, detail } awaiting a reply
		this._held = [];           // { ref, type, detail } waiting for the socket to open

		const self = this;
		this._onRequest = function (e) {
			self._request(REQUESTS[e.type], e.detail || {});
		};
		for (const name in REQUESTS) dom.addEventListener(name, this._onRequest);

		if (this.command === 'connect') this._open();
		return this;
	}

	// ─── Connection ──────────────────────────────────────────

	_component.prototype._open = function () {
		if (this._socket || this._timer) return;
		const self = this;
		const url = this.url;

		this._attempt++;
		this._status = 'connecting';
		dispatch(this.dom, 'ln-websocket-connector:connecting', { url: url, attempt: this._attempt });

		let socket;
		try {
			socket = new WebSocket(url);
		} catch (err) {
			// Invalid URL or blocked mixed content — retrying cannot fix it.
			// A new URL (or a new connect command) opens again.
			this._status = 'disconnected';
			this._attempt = 0;
			this._failAll(this._held, err.message);
			this._held = [];
			dispatch(this.dom, 'ln-websocket-connector:disconnected', { url: url, code: 0, reason: err.message, willReconnect: false });
			return;
		}
		this._socket = socket;

		socket.onopen = function () {
			self._status = 'connected';
			self._attempt = 0;
			dispatch(self.dom, 'ln-websocket-connector:connected', { url: url });
			const held = self._held;
			self._held = [];
			for (let i = 0; i < held.length; i++) self._send(held[i]);
		};

		socket.onmessage = function (e) {
			self._receive(e.data);
		};

		socket.onclose = function (e) {
			self._socket = null;
			self._status = 'disconnected';
			self._failPending('connection closed');
			const willReconnect = self.command === 'connect';
			dispatch(self.dom, 'ln-websocket-connector:disconnected', { url: url, code: e.code, reason: e.reason, willReconnect: willReconnect });
			if (willReconnect) self._scheduleReconnect();
		};
	};

	_component.prototype._scheduleReconnect = function () {
		const self = this;
		const delay = Math.min(RECONNECT_MIN_MS * Math.pow(2, Math.max(0, this._attempt - 1)), RECONNECT_MAX_MS);
		this._timer = setTimeout(function () {
			self._timer = null;
			self._open();
		}, delay);
	};

	// Closes the socket (or cancels a pending reconnect) without the reconnect
	// path. Replies still awaited cannot arrive on a new socket, so they fail;
	// held requests stay held.
	_component.prototype._drop = function (reason) {
		const active = !!(this._socket || this._timer);
		clearTimeout(this._timer);
		this._timer = null;
		this._attempt = 0;
		if (this._socket) {
			this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
			this._socket.close(1000, reason);
			this._socket = null;
		}
		if (!active) return;
		this._status = 'disconnected';
		this._failPending('connection closed');
		dispatch(this.dom, 'ln-websocket-connector:disconnected', { url: this.url, code: 1000, reason: reason, willReconnect: false });
	};

	_component.prototype._disconnect = function () {
		this._drop('disconnect');
		this._failAll(this._held, 'disconnected');
		this._held = [];
	};

	// ─── Requests & Replies ──────────────────────────────────

	_component.prototype._request = function (type, detail) {
		const entry = { ref: String(++this._seq), type: type, detail: detail };
		if (this._status === 'connected') {
			this._send(entry);
		} else if (this.command === 'connect') {
			this._held.push(entry);
		} else {
			this._fail(entry, 0, 'disconnected', null);
		}
	};

	_component.prototype._send = function (entry) {
		this._pending.set(entry.ref, entry);
		this._socket.send(JSON.stringify(Object.assign({ ref: entry.ref, type: entry.type }, _payload(entry.type, entry.detail))));
	};

	_component.prototype._receive = function (raw) {
		let msg;
		try {
			msg = JSON.parse(raw);
		} catch (_) {
			console.warn('[ln-websocket-connector] Ignored a frame that is not JSON:', raw);
			return;
		}

		if (msg.ref !== undefined) {
			const entry = this._pending.get(String(msg.ref));
			if (!entry) return;
			this._pending.delete(entry.ref);
			if (msg.ok) this._resolve(entry, msg.content, msg.message || null);
			else this._fail(entry, msg.status || 0, msg.error, msg.data);
			return;
		}

		if (msg.type === 'changes') {
			dispatch(this.dom, 'ln-websocket-connector:fetched', {
				data: { data: msg.data || [], deleted: msg.deleted || [], synced_at: msg.synced_at },
				since: null,
				meta: null
			});
		}
	};

	_component.prototype._resolve = function (entry, content, message) {
		const d = entry.detail;
		const meta = d.meta || null;
		const dom = this.dom;

		if (entry.type === 'sync') {
			dispatch(dom, 'ln-websocket-connector:fetched', { data: content, since: d.since, meta: meta });
		} else if (entry.type === 'query') {
			const q = d.query || {};
			const page = content || {};
			dispatch(dom, 'ln-websocket-connector:fetched', {
				data: page.data || [], total: page.total, filtered: page.filtered,
				offset: q.offset, queryGen: q.queryGen, meta: meta
			});
		} else if (entry.type === 'create') {
			dispatch(dom, 'ln-websocket-connector:created', { record: content, tempId: d.tempId, message: message, meta: meta });
		} else if (entry.type === 'update') {
			dispatch(dom, 'ln-websocket-connector:updated', { record: content, id: d.id, message: message, meta: meta });
		} else if (entry.type === 'delete') {
			dispatch(dom, 'ln-websocket-connector:deleted', { response: content, id: d.id, message: message, meta: meta });
		} else {
			dispatch(dom, 'ln-websocket-connector:bulk-deleted', { response: content, ids: d.ids, message: message, meta: meta });
		}
	};

	_component.prototype._fail = function (entry, status, error, data) {
		const d = entry.detail;
		dispatch(this.dom, 'ln-websocket-connector:error', {
			action: entry.type,
			error: error,
			status: status,
			data: data || null,
			conflictData: status === 409 ? (data || null) : null,
			since: d.since, id: d.id, ids: d.ids, tempId: d.tempId,
			meta: d.meta || null
		});
	};

	_component.prototype._failAll = function (entries, error) {
		for (let i = 0; i < entries.length; i++) this._fail(entries[i], 0, error, null);
	};

	_component.prototype._failPending = function (error) {
		const entries = Array.from(this._pending.values());
		this._pending.clear();
		this._failAll(entries, error);
	};

	// ─── Teardown ────────────────────────────────────────────
	// Silent by doctrine: a destroyed component dispatches nothing, so held
	// and awaited requests are discarded, not failed.

	_component.prototype.destroy = function () {
		if (!this.dom[DOM_ATTRIBUTE]) return;

		for (const name in REQUESTS) this.dom.removeEventListener(name, this._onRequest);
		clearTimeout(this._timer);
		this._timer = null;
		if (this._socket) {
			this._socket.onopen = this._socket.onmessage = this._socket.onclose = null;
			this._socket.close(1000, 'destroy');
			this._socket = null;
		}
		this._pending.clear();
		this._held = [];

		delete this.dom[DOM_ATTRIBUTE];
	};

	registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-websocket-connector', {
		attributes: ATTRIBUTES
	});
})();
