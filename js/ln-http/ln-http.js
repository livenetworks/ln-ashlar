// ═══════════════════════════════════════════════════════════════
// ln-http — Event-driven fetch component
// ═══════════════════════════════════════════════════════════════
//
// Dispatch:
//   el.dispatchEvent(new CustomEvent('ln-http:request', {
//       bubbles: true,
//       detail: { url, method, body, ajax, abort, tag }
//   }));
//
// Response events (dispatched on the original target element):
//   ln-http:success  { tag, ok, status, data }
//   ln-http:error    { tag, ok, status, data }
//
// Options:
//   url    — request URL (required)
//   method — HTTP method (default: POST if body, GET otherwise)
//   body   — object: GET → query string, POST/PUT/DELETE → JSON
//   ajax   — if true, adds X-Requested-With: XMLHttpRequest
//   abort  — string key: aborts previous in-flight request with same key
//   tag    — passed back in response events for consumer filtering

(function () {
	const DOM_ATTRIBUTE = 'lnHttp';
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const _pending = {};

	document.addEventListener('ln-http:request', function (e) {
		const opts = e.detail || {};
		if (!opts.url) return;

		const target = e.target;
		const method = (opts.method || (opts.body ? 'POST' : 'GET')).toUpperCase();
		const abortKey = opts.abort;
		const tag = opts.tag;
		let url = opts.url;

		// Abort previous in-flight request for same key
		if (abortKey) {
			if (_pending[abortKey]) _pending[abortKey].abort();
			_pending[abortKey] = new AbortController();
		}

		const headers = { 'Accept': 'application/json' };
		if (opts.ajax) headers['X-Requested-With'] = 'XMLHttpRequest';

		const fetchOptions = {
			method: method,
			credentials: 'same-origin',
			headers: headers
		};

		if (abortKey) fetchOptions.signal = _pending[abortKey].signal;

		// GET: body → query string; POST/PUT/DELETE: body → JSON
		if (opts.body && method === 'GET') {
			const params = new URLSearchParams();
			for (const key in opts.body) {
				if (opts.body[key] != null) params.set(key, opts.body[key]);
			}
			const qs = params.toString();
			if (qs) url += (url.includes('?') ? '&' : '?') + qs;
		} else if (opts.body) {
			headers['Content-Type'] = 'application/json';
			fetchOptions.body = JSON.stringify(opts.body);
		}

		fetch(url, fetchOptions)
			.then(function (response) {
				if (abortKey) delete _pending[abortKey];
				const ok = response.ok;
				const status = response.status;
				return response.json()
					.then(function (data) { return { ok: ok, status: status, data: data }; })
					.catch(function () { return { ok: false, status: status, data: { error: true, message: 'Invalid response' } }; });
			})
			.then(function (result) {
				result.tag = tag;
				const eventName = result.ok ? 'ln-http:success' : 'ln-http:error';
				target.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: result }));
			})
			.catch(function (err) {
				if (abortKey && err.name !== 'AbortError') delete _pending[abortKey];
				if (err.name === 'AbortError') return; // Silently ignore aborted requests
				target.dispatchEvent(new CustomEvent('ln-http:error', {
					bubbles: true,
					detail: { tag: tag, ok: false, status: 0, data: { error: true, message: 'Network error' } }
				}));
			});
	});

	window[DOM_ATTRIBUTE] = true;
})();
