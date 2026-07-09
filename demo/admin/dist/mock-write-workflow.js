// Mock REST Interceptor for the Write Workflow demo (data-ln-form-scope).
// Only intercepts requests to the demo's resource path (/documents);
// everything else falls through to the real window.fetch.
(function () {
	const realFetch = window.fetch.bind(window);
	const STORAGE_KEY = 'ln-demo-write-workflow';
	const ENDPOINT = '/documents';

	let idCounter = 100;

	function loadRecords() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : [
				{ id: 1, title: 'Onboarding Checklist', status: 'draft', expected_version: 1 },
				{ id: 2, title: 'Q3 Compliance Report', status: 'published', expected_version: 1 }
			];
		} catch (_) {
			return [];
		}
	}

	function saveRecords(records) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	}

	function nextId(records) {
		let max = idCounter;
		for (let i = 0; i < records.length; i++) {
			if (records[i].id > max) max = records[i].id;
		}
		return max + 1;
	}

	function jsonResponse(body, status) {
		return new Response(JSON.stringify(body), {
			status: status || 200,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	function delay(ms) {
		return new Promise(function (resolve) { setTimeout(resolve, ms); });
	}

	async function handleMockRequest(url, init) {
		init = init || {};
		await delay(400);

		const u = new URL(url, window.location.origin);
		const method = (init.method || 'GET').toUpperCase();
		const path = u.pathname;
		const records = loadRecords();

		// GET /documents (delta sync — always returns the full set for this demo)
		if (path === ENDPOINT && method === 'GET') {
			return jsonResponse({ data: records, deleted: [], synced_at: Math.floor(Date.now() / 1000) });
		}

		// POST /documents (create)
		if (path === ENDPOINT && method === 'POST') {
			const body = JSON.parse(init.body || '{}');
			const record = Object.assign({}, body, { id: nextId(records), expected_version: 1 });
			records.push(record);
			saveRecords(records);
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document created' }, content: record }, 201);
		}

		// PUT /documents/:id (update)
		const putMatch = path.match(/^\/documents\/([^/]+)$/);
		if (putMatch && method === 'PUT') {
			const id = Number(putMatch[1]) || putMatch[1];
			const idx = records.findIndex(function (r) { return r.id === id; });
			if (idx === -1) return jsonResponse({ message: 'Not found' }, 404);

			const body = JSON.parse(init.body || '{}');
			const updated = Object.assign({}, records[idx], body, {
				id: records[idx].id,
				expected_version: (records[idx].expected_version || 1) + 1
			});
			records[idx] = updated;
			saveRecords(records);
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document updated' }, content: updated }, 200);
		}

		// DELETE /documents/:id (delete)
		const delMatch = path.match(/^\/documents\/([^/]+)$/);
		if (delMatch && method === 'DELETE') {
			const id = Number(delMatch[1]) || delMatch[1];
			const filtered = records.filter(function (r) { return r.id !== id; });
			saveRecords(filtered);
			return jsonResponse({ message: { type: 'success', title: 'Deleted', body: 'Document deleted' }, content: null }, 200);
		}

		return realFetch(url, init);
	}

	window.fetch = function (input, init) {
		const url = typeof input === 'string' ? input : input.url;
		if (url && url.indexOf(ENDPOINT) !== -1) {
			return handleMockRequest(url, init);
		}
		return realFetch(input, init);
	};
})();
