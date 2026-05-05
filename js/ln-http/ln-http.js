// ═══════════════════════════════════════════════════════════════
// ln-http — Transparent fetch interceptor + explicit-key dedup
// ═══════════════════════════════════════════════════════════════
//
// On load, this module does two things:
//
//   PATH A — fetch wrapping (transparent, GET/HEAD only).
//     Wraps window.fetch. All fetch calls in the page route through
//     this wrapper. Components keep calling fetch() natively — they
//     do not import or know about ln-http.
//       1. Tracks in-flight requests in _inflight, keyed by URL + method.
//       2. For idempotent methods (GET, HEAD): if a new request lands
//          on the same key while the previous is still in flight, the
//          previous is aborted. Only the latest GET to a given URL wins.
//       3. For non-idempotent methods (POST, PUT, PATCH, DELETE, …):
//          NO auto-cancel. Two simultaneous POSTs both run.
//       4. Combines a consumer-provided AbortSignal with the wrapper's
//          own controller.
//
//   PATH B — event API (explicit key, any method, opt-in).
//     Listens for `ln-http:request` at document level. Consumer
//     dispatches:
//       el.dispatchEvent(new CustomEvent('ln-http:request', {
//           bubbles: true,
//           detail: { url, method, body, signal, key }
//       }));
//     If `detail.key` is present and a previous request with the same
//     key is in flight, the previous is aborted regardless of method.
//     Use case: drag-reorder POSTs — each drag fires a POST to
//     /api/reorder; only the latest order should reach the server.
//     Without `key`, the dispatch is a one-shot (no dedup beyond
//     whatever Path A does for GET/HEAD).
//     Response dispatched on the original target element:
//       ln-http:response  { ok, status, response }
//       ln-http:error     { ok: false, status: 0, error }
//
//   The two paths coexist. A GET dispatched via Path B with
//   `detail.key: 'foo'` lives in BOTH _inflight (Path A, URL-keyed)
//   and _keyed (Path B, key-keyed). Aborts from either side are
//   idempotent and cooperate cleanly.
//
// Public API (window.lnHttp):
//   .cancel(url)         — abort any Path A in-flight whose URL matches.
//   .cancelByKey(key)    — abort the Path B in-flight with this key.
//   .cancelAll()         — abort every in-flight (both paths).
//   .inflight            — getter; returns Array<{ url, method, key? }>
//                          covering both paths, for debugging.
//   .destroy()           — restore the original fetch, remove the
//                          document listener, clear both queues.
//                          Used in dev hot-reload and tests.

import { dispatch } from '../ln-core';

(function () {
	if (window.lnHttp) return;                    // double-load guard

	const _origFetch = window.fetch.bind(window);
	const _inflight  = new Map();                 // "METHOD URL" → AbortController (Path A)
	const _keyed     = new Map();                 // consumer key   → AbortController (Path B)

	// ─── helpers ───────────────────────────────────────────────────

	// Accept string | URL | Request → return absolute URL string.
	function _extractUrl(resource) {
		if (typeof resource === 'string')   return resource;
		if (resource instanceof URL)        return resource.href;
		if (resource instanceof Request)    return resource.url;
		return String(resource);              // last-resort coercion
	}

	// Extract method from options OR Request, default GET, uppercased.
	function _extractMethod(resource, options) {
		if (options && options.method) return String(options.method).toUpperCase();
		if (resource instanceof Request) return resource.method.toUpperCase();
		return 'GET';
	}

	function _key(url, method) { return method + ' ' + url; }
	function _isIdempotent(method) { return method === 'GET' || method === 'HEAD'; }

	// ─── Path A: window.fetch wrapper ─────────────────────────────

	function _wrappedFetch(resource, options) {
		options = options || {};

		const url    = _extractUrl(resource);
		const method = _extractMethod(resource, options);
		const key    = _key(url, method);

		// Idempotent dedup — abort previous in-flight on same key.
		if (_isIdempotent(method) && _inflight.has(key)) {
			_inflight.get(key).abort();
			_inflight.delete(key);
		}

		// Combine consumer signal with wrapper controller.
		const controller = new AbortController();
		const consumerSignal = options.signal;
		if (consumerSignal) {
			if (consumerSignal.aborted) controller.abort(consumerSignal.reason);
			else consumerSignal.addEventListener('abort', function () {
				controller.abort(consumerSignal.reason);
			}, { once: true });
		}

		const merged = Object.assign({}, options, { signal: controller.signal });

		_inflight.set(key, controller);

		return _origFetch(resource, merged).finally(function () {
			// Only clear if THIS controller is still the one in the map.
			if (_inflight.get(key) === controller) _inflight.delete(key);
		});
	}

	_wrappedFetch.toString = function () { return 'function fetch() { [ln-http wrapped] }'; };
	window.fetch = _wrappedFetch;

	// ─── Path B: ln-http:request event listener ───────────────────

	function _onRequest(e) {
		const opts = e.detail || {};
		if (!opts.url) return;

		const target = e.target;
		const method = (opts.method || (opts.body ? 'POST' : 'GET')).toUpperCase();
		const userKey = opts.key;

		// Explicit-key dedup — abort previous on same key, any method.
		if (userKey && _keyed.has(userKey)) {
			_keyed.get(userKey).abort();
			_keyed.delete(userKey);
		}

		// Combine consumer signal (if any) with our own controller.
		const controller = new AbortController();
		const consumerSignal = opts.signal;
		if (consumerSignal) {
			if (consumerSignal.aborted) controller.abort(consumerSignal.reason);
			else consumerSignal.addEventListener('abort', function () {
				controller.abort(consumerSignal.reason);
			}, { once: true });
		}

		if (userKey) _keyed.set(userKey, controller);

		const fetchOptions = { method: method, signal: controller.signal };
		if (opts.body !== undefined) fetchOptions.body = opts.body;

		// fetch() here IS the wrapped fetch — Path A still applies
		// for GET/HEAD on top of Path B's explicit-key dedup. Aborts
		// from either side are idempotent.
		window.fetch(opts.url, fetchOptions)
			.then(function (response) {
				if (userKey && _keyed.get(userKey) === controller) _keyed.delete(userKey);
				dispatch(target, 'ln-http:response', {
					ok: response.ok,
					status: response.status,
					response: response
				});
			})
			.catch(function (err) {
				if (userKey && _keyed.get(userKey) === controller) _keyed.delete(userKey);
				if (err && err.name === 'AbortError') return; // silent on abort
				dispatch(target, 'ln-http:error', {
					ok: false,
					status: 0,
					error: err
				});
			});
	}

	document.addEventListener('ln-http:request', _onRequest);

	// ─── Public API ───────────────────────────────────────────────

	window.lnHttp = {
		cancel: function (url) {
			let any = false;
			_inflight.forEach(function (controller, key) {
				if (key.endsWith(' ' + url)) {
					controller.abort();
					_inflight.delete(key);
					any = true;
				}
			});
			return any;
		},
		cancelByKey: function (userKey) {
			if (!_keyed.has(userKey)) return false;
			_keyed.get(userKey).abort();
			_keyed.delete(userKey);
			return true;
		},
		cancelAll: function () {
			_inflight.forEach(function (c) { c.abort(); });
			_inflight.clear();
			_keyed.forEach(function (c) { c.abort(); });
			_keyed.clear();
		},
		get inflight() {
			const list = [];
			_inflight.forEach(function (_c, key) {
				const sp = key.indexOf(' ');
				list.push({ method: key.slice(0, sp), url: key.slice(sp + 1) });
			});
			_keyed.forEach(function (_c, userKey) {
				list.push({ key: userKey });
			});
			return list;
		},
		destroy: function () {
			window.lnHttp.cancelAll();
			document.removeEventListener('ln-http:request', _onRequest);
			window.fetch = _origFetch;
			delete window.lnHttp;
		}
	};
})();
