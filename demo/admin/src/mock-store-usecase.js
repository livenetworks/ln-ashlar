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

		// GET /api/documents (full, delta sync, or query)
		if (path === ENDPOINT && method === 'GET') {
			const since = u.searchParams.get('since');
			if (since != null && since !== '' && since !== 'null') {
				const sinceN = Number(since);
				const upserted = records.filter((r) => r.updated_at > sinceN);
				return jsonResponse({ data: upserted, deleted: [], synced_at: nowSec() });
			}

			let result = records.slice();

			// 1. Text search across title, department, owner
			const search = (u.searchParams.get('search') || '').toLowerCase().trim();
			if (search) {
				result = result.filter((r) =>
					(r.title && r.title.toLowerCase().includes(search)) ||
					(r.department && r.department.toLowerCase().includes(search)) ||
					(r.owner && r.owner.toLowerCase().includes(search))
				);
			}

			// 2. Field Filters (department, status, priority)
			const dept = u.searchParams.get('department');
			if (dept) {
				const allowed = dept.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
				if (allowed.length) {
					result = result.filter((r) => r.department && allowed.includes(r.department.toLowerCase()));
				}
			}

			const status = u.searchParams.get('status');
			if (status) {
				const allowed = status.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
				if (allowed.length) {
					result = result.filter((r) => r.status && allowed.includes(r.status.toLowerCase()));
				}
			}

			const priority = u.searchParams.get('priority');
			if (priority) {
				const allowed = priority.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
				if (allowed.length) {
					result = result.filter((r) => r.priority && allowed.includes(r.priority.toLowerCase()));
				}
			}

			const filteredCount = result.length;

			// 3. Sorting
			const sortField = u.searchParams.get('sort_field');
			const sortDir = u.searchParams.get('sort_dir') || 'asc';
			if (sortField) {
				result.sort((a, b) => {
					const valA = a[sortField];
					const valB = b[sortField];
					if (valA == null && valB == null) return 0;
					if (valA == null) return 1;
					if (valB == null) return -1;
					let cmp = 0;
					if (typeof valA === 'number' && typeof valB === 'number') {
						cmp = valA - valB;
					} else {
						cmp = String(valA).localeCompare(String(valB));
					}
					return sortDir === 'desc' ? -cmp : cmp;
				});
			}

			// 4. Pagination
			const offsetParam = u.searchParams.get('offset');
			const limitParam = u.searchParams.get('limit');
			if (offsetParam != null || limitParam != null) {
				const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
				const limit = limitParam ? parseInt(limitParam, 10) : 25;
				result = result.slice(offset, offset + limit);
			}

			return jsonResponse({
				data: result,
				total: records.length,
				filtered: filteredCount,
				synced_at: nowSec()
			});
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
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document created' }, content: rec }, 201);
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
				return jsonResponse({ remote: stored }, 409);
			}

			const updated = Object.assign({}, stored, body, { updated_at: nowSec() });
			records[idx] = updated;
			save(records);
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document updated' }, content: updated }, 200);
		}

		// DELETE /api/documents/:id
		const delMatch = path.match(/^\/api\/documents\/(\d+)$/);
		if (delMatch && method === 'DELETE') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const id = Number(delMatch[1]);
			const filtered = records.filter((r) => r.id !== id);
			save(filtered);
			return jsonResponse({ message: { type: 'success', title: 'Deleted', body: 'Document deleted' }, content: null }, 200);
		}

		// DELETE /api/documents/bulk-delete
		if (path === ENDPOINT + '/bulk-delete' && method === 'DELETE') {
			if ($sim('sim-failure') && Math.random() < 0.15) return jsonResponse({ error: 'simulated failure' }, 500);
			const body = JSON.parse(init.body || '{}');
			const ids = (body.ids || []).map(Number);
			const filtered = records.filter((r) => ids.indexOf(r.id) === -1);
			save(filtered);
			return jsonResponse({ message: { type: 'success', title: 'Deleted', body: 'Documents deleted' }, content: null }, 200);
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
