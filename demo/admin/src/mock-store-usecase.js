// Documents REST API Mock Backend for Store Usecase
(function () {
	const STORAGE_KEY = 'ln-mock-documents';
	const ENDPOINT = '/api/documents';
	const realFetch = window.fetch.bind(window);

	function nowSec() { return Math.floor(Date.now() / 1000); }

	function load() {
		try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') || []; }
		catch (_) { return []; }
	}
	function save(records) { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
	function nextId(records) {
		let max = 0;
		for (let i = 0; i < records.length; i++) if (records[i].id > max) max = records[i].id;
		return max + 1;
	}

	// Seed pulled once from the shared 10k-record fixture. Cached as a
	// promise so concurrent in-flight handle() calls all await the same
	// fetch and only save once.
	let seedPromise = null;
	function loadSeed() {
		if (!seedPromise) {
			seedPromise = realFetch('./data/documents.json')
				.then((res) => res.json())
				.then((payload) => {
					save(payload.data);
					return payload.data;
				});
		}
		return seedPromise;
	}

	async function getRecords() {
		let r = load();
		if (r.length === 0) r = await loadSeed();
		return r;
	}

	// Toggle state — read live from DOM each call so user can flip mid-session
	function $sim(id) { const el = document.getElementById(id); return el && el.checked; }

	function delay(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

	function jsonResponse(body, status) {
		return new Response(JSON.stringify(body), {
			status: status || 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	async function handle(input, init) {
		// Optional latency
		if ($sim('sim-latency')) await delay(600);

		const url = typeof input === 'string' ? input : input.url;
		const u = new URL(url, window.location.origin);
		const method = (init && init.method) || (typeof input !== 'string' && input.method) || 'GET';
		const path = u.pathname;
		const records = await getRecords();

		// GET /api/documents (full or delta)
		if (path === ENDPOINT && method === 'GET') {
			const since = u.searchParams.get('since');
			if (since != null) {
				const sinceN = Number(since);
				const upserted = records.filter((r) => r.updated_at > sinceN);
				return jsonResponse({ data: upserted, deleted: [], synced_at: nowSec() });
			}
			return jsonResponse({ data: records, synced_at: nowSec() });
		}

		// POST /api/documents (create)
		if (path === ENDPOINT && method === 'POST') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const data = JSON.parse(init.body || '{}');
			const t = nowSec();
			const rec = Object.assign(
				{ file_size: 10 + Math.floor(Math.random() * 49990) },
				data,
				{
					id: nextId(records),
					created_at: t,
					updated_at: t
				}
			);
			records.push(rec);
			save(records);
			return jsonResponse(rec); // BARE record — store reads response.json() directly
		}

		// PUT /api/documents/:id (update)
		const putMatch = path.match(/^\/api\/documents\/(\d+)$/);
		if (putMatch && method === 'PUT') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const id = Number(putMatch[1]);
			const idx = records.findIndex((r) => r.id === id);
			if (idx === -1) return jsonResponse({ error: 'not found' }, 404);
			const body = JSON.parse(init.body || '{}');
			const expected = body.expected_version;
			delete body.expected_version;
			const stored = records[idx];

			// Conflict check — only if caller passed expected_version AND sim-conflict on
			if (expected != null && $sim('sim-conflict') && Math.random() < 0.10) {
				// Bump stored.updated_at to simulate that someone else edited it,
				// then return 409 with current
				stored.updated_at = nowSec();
				save(records);
				return jsonResponse({ current: stored }, 409); // store reads conflict.current
			}

			const updated = Object.assign({}, stored, body, { updated_at: nowSec() });
			records[idx] = updated;
			save(records);
			return jsonResponse(updated); // BARE record
		}

		// DELETE /api/documents/:id
		const delMatch = path.match(/^\/api\/documents\/(\d+)$/);
		if (delMatch && method === 'DELETE') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const id = Number(delMatch[1]);
			const filtered = records.filter((r) => r.id !== id);
			save(filtered);
			return jsonResponse({ ok: true });
		}

		// DELETE /api/documents/bulk-delete
		if (path === ENDPOINT + '/bulk-delete' && method === 'DELETE') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const body = JSON.parse(init.body || '{}');
			const ids = (body.ids || []).map(Number);
			const filtered = records.filter((r) => ids.indexOf(r.id) === -1);
			save(filtered);
			return jsonResponse({ ok: true });
		}

		// Fall through to real fetch for any other URL
		return realFetch(input, init);
	}

	window.fetch = function (input, init) {
		const url = typeof input === 'string' ? input : input.url;
		// Only intercept our endpoint
		if (url && url.indexOf(ENDPOINT) !== -1) return handle(input, init);
		return realFetch(input, init);
	};

	// Reset Data Listener
	document.addEventListener('DOMContentLoaded', function() {
		const resetBtn = document.getElementById('reset-data');
		if (resetBtn) {
			resetBtn.addEventListener('click', function(e) {
				e.preventDefault();
				localStorage.removeItem(STORAGE_KEY);
				if (window.lnDataStore) {
					window.lnDataStore.clearAll().then(() => location.reload());
				} else {
					location.reload();
				}
			});
		}
	});
})();
