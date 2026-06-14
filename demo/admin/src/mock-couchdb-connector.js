// Mock CouchDB Interceptor and Dashboard Setup
(function() {
	const realFetch = window.fetch.bind(window);

	// Log formatting helpers
	const logConsole = document.getElementById('api-event-log');
	function formatTime() {
		const d = new Date();
		return d.toLocaleTimeString() + '.' + String(d.getMilliseconds()).padStart(3, '0');
	}

	function writeTelemetry(direction, message, meta) {
		if (!logConsole) return;
		const prefix = direction === 'IN' ? '📥 [EVENT IN]  ' : direction === 'OUT' ? '📤 [EVENT OUT] ' : '🌐 [COUCH_NET] ';
		let line = '[' + formatTime() + '] ' + prefix + message;
		if (meta) {
			line += ' ' + JSON.stringify(meta);
		}
		const span = document.createElement('span');
		span.textContent = line + '\n';
		if (direction === 'IN') span.style.color = '#38bdf8'; // Blue
		else if (direction === 'OUT') span.style.color = '#34d399'; // Green
		else span.style.color = '#f59e0b'; // Amber

		logConsole.appendChild(span);
		logConsole.scrollTop = logConsole.scrollHeight;
	}

	const clearBtn = document.getElementById('btn-clear-log');
	if (clearBtn) {
		clearBtn.addEventListener('click', function() {
			if (logConsole) logConsole.replaceChildren();
		});
	}

	// Simulated remote document store
	const mockDatabase = {
		"task_1": { _id: "task_1", _rev: "1-abc", title: "Setup CouchDB Sync Gateway", priority: "High", due_date: "2026-06-01" },
		"task_2": { _id: "task_2", _rev: "1-def", title: "Configure IndexedDB cache store", priority: "Medium", due_date: "2026-06-02" },
		"task_3": { _id: "task_3", _rev: "1-ghi", title: "Build coordinator mapping layers", priority: "Low", due_date: "2026-06-03" }
	};

	// Mock Network Interceptor
	window.fetch = function(input, init) {
		const url = typeof input === 'string' ? input : input.url;
		const method = (init && init.method) || 'GET';

		// Catch requests made to livenetworks CouchDB path
		if (url.indexOf('couch.livenetworks.com') !== -1 || url.indexOf('/tasks') !== -1) {
			writeTelemetry('NET', `${method} Request -> ${url}`, init && init.body ? JSON.parse(init.body) : null);

			return new Promise(function(resolve) {
				setTimeout(function() {
					// 1. Changes Feed Sync (_changes)
					if (method === 'GET' && url.indexOf('_changes') !== -1) {
						const search = new URL(url).searchParams;
						const since = search.get('since') || '';
						
						const results = [];
						// Return mock database rows
						Object.keys(mockDatabase).forEach(function(key) {
							results.push({
								id: key,
								seq: mockDatabase[key]._rev,
								doc: mockDatabase[key]
							});
						});

						resolve(new Response(JSON.stringify({
							results: results,
							last_seq: "2-def"
						}), { status: 200 }));
					} 
					// 2. Fetch single document (GET /{db}/{id}) for revision checks
					else if (method === 'GET') {
						const id = url.split('/').pop().split('?')[0];
						const doc = mockDatabase[id];
						if (doc) {
							resolve(new Response(JSON.stringify(doc), { status: 200 }));
						} else {
							resolve(new Response(JSON.stringify({ error: "not_found", reason: "missing" }), { status: 404 }));
						}
					}
					// 3. Document insertion (POST /{db})
					else if (method === 'POST' && url.indexOf('_bulk_docs') === -1 && url.indexOf('_all_docs') === -1) {
						const body = JSON.parse(init.body || '{}');
						const newId = body._id || 'task_' + Math.floor(Math.random() * 1000 + 200);
						const newRev = "1-new" + Math.floor(Math.random() * 100);
						
						mockDatabase[newId] = Object.assign({}, body, { _id: newId, _rev: newRev });

						resolve(new Response(JSON.stringify({
							ok: true,
							id: newId,
							rev: newRev
						}), { status: 201 }));
					}
					// 4. Document update (PUT /{db}/{id})
					else if (method === 'PUT') {
						const id = url.split('/').pop().split('?')[0];
						const body = JSON.parse(init.body || '{}');

						// Simulate conflict if checked
						const conflictEl = document.getElementById('trig-update-conflict');
						const isConflictChecked = conflictEl && conflictEl.checked;
						if (isConflictChecked) {
							writeTelemetry('NET', '409 Conflict Simulated! CouchDB expected revision mismatch.');
							resolve(new Response(JSON.stringify({
								error: "conflict",
								reason: "Document update conflict."
							}), { status: 409 }));
						} else {
							const currentDoc = mockDatabase[id];
							const oldRev = currentDoc ? currentDoc._rev : '0-old';
							const revNum = parseInt(oldRev.split('-')[0]) + 1;
							const newRev = revNum + '-rev' + Math.floor(Math.random() * 100);

							mockDatabase[id] = Object.assign({}, body, { _id: id, _rev: newRev });

							resolve(new Response(JSON.stringify({
								ok: true,
								id: id,
								rev: newRev
							}), { status: 200 }));
						}
					}
					// 5. Single deletion (DELETE /{db}/{id}?rev=)
					else if (method === 'DELETE') {
						const parts = url.split('/');
						const id = parts.pop().split('?')[0];
						delete mockDatabase[id];
						resolve(new Response(JSON.stringify({ ok: true, id: id, rev: "3-del" }), { status: 200 }));
					}
					// 6. Retrieve active revisions for bulk delete (_all_docs keys query)
					else if (method === 'POST' && url.indexOf('_all_docs') !== -1) {
						const body = JSON.parse(init.body || '{}');
						const keys = body.keys || [];
						const rows = keys.map(function(k) {
							const doc = mockDatabase[k];
							if (doc) {
								return { id: k, value: { rev: doc._rev } };
							} else {
								return { id: k, error: "not_found" };
							}
						});
						resolve(new Response(JSON.stringify({ rows: rows }), { status: 200 }));
					}
					// 7. Bulk deletions confirmation (_bulk_docs)
					else if (method === 'POST' && url.indexOf('_bulk_docs') !== -1) {
						const body = JSON.parse(init.body || '{}');
						const docs = body.docs || [];
						
						const results = docs.map(function(d) {
							if (d._deleted) {
								delete mockDatabase[d._id];
							}
							return { ok: true, id: d._id, rev: d._rev };
						});

						resolve(new Response(JSON.stringify(results), { status: 200 }));
					}
				}, 400);
			});
		}

		return realFetch(input, init);
	};

	document.addEventListener('DOMContentLoaded', function() {
		// DOM Events Wiring and Logging
		const connectorEl = document.getElementById('demo-couchdb-connector');
		if (!connectorEl) return;

		// Log configuration mutations
		connectorEl.addEventListener('ln-couchdb-connector:config-changed', function(e) {
			writeTelemetry('OUT', 'ln-couchdb-connector:config-changed', e.detail);
		});

		// Log incoming requests and outgoing confirmations/errors
		const eventsToLog = [
			'fetched', 'created', 'updated', 'deleted', 'bulk-deleted', 'error'
		];
		eventsToLog.forEach(function(evName) {
			connectorEl.addEventListener('ln-couchdb-connector:' + evName, function(e) {
				writeTelemetry('OUT', 'ln-couchdb-connector:' + evName, e.detail);
			});
		});

		// Handle Form configuration change
		const configForm = document.getElementById('config-form');
		if (configForm) {
			configForm.addEventListener('submit', function(e) {
				e.preventDefault();
				const url = document.getElementById('cfg-couchdb-url').value;
				const db = document.getElementById('cfg-couchdb-db').value;
				const auth = document.getElementById('cfg-couchdb-auth').value;
				const headers = document.getElementById('cfg-couchdb-headers').value;

				writeTelemetry('IN', 'Mutating DOM attributes to trigger dynamic MutationObserver rebuild');
				connectorEl.setAttribute('data-ln-couchdb-url', url);
				connectorEl.setAttribute('data-ln-couchdb-db', db);
				connectorEl.setAttribute('data-ln-couchdb-auth', auth);
				connectorEl.setAttribute('data-ln-couchdb-headers', headers);
			});
		}

		// Interactive triggers dispatching CustomEvents to connector element
		const btnFetch = document.getElementById('btn-fetch');
		if (btnFetch) {
			btnFetch.addEventListener('click', function() {
				const since = document.getElementById('trig-since').value;
				const detail = since ? { since: since } : {};
				writeTelemetry('IN', 'ln-couchdb-connector:request-sync', detail);
				connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-sync', { detail: detail }));
			});
		}

		const btnCreate = document.getElementById('btn-create');
		if (btnCreate) {
			btnCreate.addEventListener('click', function() {
				const title = document.getElementById('trig-create-title').value;
				const detail = { data: { title: title, priority: 'High', due_date: '2026-06-05' }, tempId: 'temp_couch_54321' };
				writeTelemetry('IN', 'ln-couchdb-connector:request-create', detail);
				connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-create', { detail: detail }));
			});
		}

		const btnUpdate = document.getElementById('btn-update');
		if (btnUpdate) {
			btnUpdate.addEventListener('click', function() {
				const id = document.getElementById('trig-update-id').value;
				const title = document.getElementById('trig-update-title').value;
				
				const data = { title: title };
				const includeRevEl = document.getElementById('trig-update-has-rev');
				const includeRev = includeRevEl && includeRevEl.checked;
				if (includeRev) {
					data._rev = "1-abc"; // simulated active revision
				}

				const detail = { id: id, data: data };
				writeTelemetry('IN', 'ln-couchdb-connector:request-update', detail);
				connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-update', { detail: detail }));
			});
		}

		const btnDelete = document.getElementById('btn-delete');
		if (btnDelete) {
			btnDelete.addEventListener('click', function() {
				const id = document.getElementById('trig-delete-id').value;
				const rev = document.getElementById('trig-delete-rev').value;
				const detail = { id: id };
				if (rev) {
					detail.rev = rev;
				}
				writeTelemetry('IN', 'ln-couchdb-connector:request-delete', detail);
				connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-delete', { detail: detail }));
			});
		}

		const btnBulk = document.getElementById('btn-bulk');
		if (btnBulk) {
			btnBulk.addEventListener('click', function() {
				const idsStr = document.getElementById('trig-bulk-ids').value;
				const ids = idsStr.split(',').map(s => s.trim()).filter(Boolean);
				const detail = { ids: ids };
				writeTelemetry('IN', 'ln-couchdb-connector:request-bulk-delete', detail);
				connectorEl.dispatchEvent(new CustomEvent('ln-couchdb-connector:request-bulk-delete', { detail: detail }));
			});
		}

		// Log initial load
		writeTelemetry('NET', 'CouchDB Gateway Connector initialized. Observability layers active. Simulation server connected.');
	});
})();
