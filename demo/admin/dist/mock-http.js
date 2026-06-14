// Mock HTTP Server endpoints for Concurrency Test
(function () {
	if (window.__demoHttpMockInstalled) return;
	window.__demoHttpMockInstalled = true;

	const _nativeFetch = window.fetch.bind(window);

	function _delay(ms, signal) {
		return new Promise(function (resolve, reject) {
			const t = setTimeout(resolve, ms);
			if (signal) {
				if (signal.aborted) { clearTimeout(t); reject(_abortError()); return; }
				signal.addEventListener('abort', function () {
					clearTimeout(t);
					reject(_abortError());
				}, { once: true });
			}
		});
	}

	function _abortError() {
		const err = new Error('The operation was aborted.');
		err.name = 'AbortError';
		return err;
	}

	function _jsonResponse(payload, status) {
		return new Response(JSON.stringify(payload), {
			status:  status || 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const EMPLOYEES = [
		{ id: 1, name: 'Marko Petrovski',   department: 'Engineering' },
		{ id: 2, name: 'Ana Kovachevska',   department: 'Design'      },
		{ id: 3, name: 'Stefan Iliev',      department: 'Sales'       },
		{ id: 4, name: 'Elena Stojanovska', department: 'Engineering' },
		{ id: 5, name: 'Nikola Ristov',     department: 'Marketing'   },
		{ id: 6, name: 'Ivana Dimitrova',   department: 'Engineering' }
	];

	const TODOS = [
		{ id: 1, label: 'Plan sprint',        order: 0 },
		{ id: 2, label: 'Review designs',     order: 1 },
		{ id: 3, label: 'Sync with backend',  order: 2 },
		{ id: 4, label: 'Update changelog',   order: 3 }
	];

	async function _handle(url, options) {
		const u = new URL(url, window.location.origin);
		const path = u.pathname;
		const method = ((options && options.method) || 'GET').toUpperCase();
		const signal = options && options.signal;

		// /api/search?q=…  → 600ms delay, filtered employees
		if (path === '/api/search' && method === 'GET') {
			await _delay(600, signal);
			const q = (u.searchParams.get('q') || '').toLowerCase();
			const matches = q
				? EMPLOYEES.filter(function (e) { return e.name.toLowerCase().includes(q); })
				: [];
			return _jsonResponse({ q: q, results: matches });
		}

		// /api/slow  → 4000ms delay, used for cancel-by-url demo
		if (path === '/api/slow' && method === 'GET') {
			await _delay(4000, signal);
			return _jsonResponse({ note: 'Slow request finished.' });
		}

		// /api/users  → 250ms delay, returns user with body echoed (POST)
		if (path === '/api/users' && method === 'POST') {
			await _delay(250, signal);
			let body;
			try { body = options && options.body ? JSON.parse(options.body) : {}; }
			catch (e) { body = {}; }
			return _jsonResponse({ id: Math.floor(Math.random() * 9000) + 1000, name: body.name || 'Unknown' }, 201);
		}

		// /api/lists/:id/reorder  → 800ms delay, echoes order (POST)
		if (/^\/api\/lists\/\d+\/reorder$/.test(path) && method === 'POST') {
			await _delay(800, signal);
			let body;
			try { body = options && options.body ? JSON.parse(options.body) : {}; }
			catch (e) { body = {}; }
			return _jsonResponse({ ok: true, savedAt: new Date().toISOString(), order: body.ids || [] });
		}

		// /api/todos  → 250ms delay, returns todo list (GET)
		if (path === '/api/todos' && method === 'GET') {
			await _delay(250, signal);
			return _jsonResponse(TODOS);
		}

		// Anything else → pass through to native fetch
		return _nativeFetch(url, options);
	}

	window.fetch = function (resource, options) {
		const url = typeof resource === 'string'
			? resource
			: (resource instanceof URL ? resource.href
				: (resource instanceof Request ? resource.url : String(resource)));
		// Defer the dispatch one microtask so the wrapper's signal is fully
		// installed before _delay runs (Path B composes signals after we run).
		return _handle(url, options);
	};
})();
