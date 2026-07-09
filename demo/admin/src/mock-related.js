// Virtual REST Backend Mock & Telemetry Logging Script
(function() {
	// =========================================================================
	// 1. Virtual REST Backend Mock Script
	// =========================================================================
	const STORAGE_KEY = 'ln-demo-documents';
	const ENDPOINT = '/api/documents';
	const realFetch = window.fetch.bind(window);

	const initialSeed = [
		{ doc_id: 1, title: 'ISO 27001 Security Manual', department: 'IT', status: 'Approved', file_size_bytes: 45210, server_timestamp: '2026-05-24T10:00:00Z', author: { name: 'Dalibor Sojic' } },
		{ doc_id: 2, title: 'Q1 Financial Balance Sheet', department: 'Finance', status: 'Pending', file_size_bytes: 124800, server_timestamp: '2026-05-24T11:15:00Z', author: { name: 'Dalibor Sojic' } },
		{ doc_id: 3, title: 'Employment Agreement Template', department: 'HR', status: 'Approved', file_size_bytes: 8400, server_timestamp: '2026-05-24T12:00:00Z', author: { name: 'HR Manager' } }
	];

	function loadBackendData() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			return saved ? JSON.parse(saved) : initialSeed;
		} catch (_) {
			return initialSeed;
		}
	}

	function saveBackendData(records) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
	}

	function getNextId(records) {
		let max = 0;
		for (let i = 0; i < records.length; i++) {
			if (records[i].doc_id > max) max = records[i].doc_id;
		}
		return max + 1;
	}

	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function jsonResponse(body, status = 200) {
		return new Response(JSON.stringify(body), {
			status: status,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	async function handleMockRequest(url, init = {}) {
		const simLatencyEl = document.getElementById('sim-latency');
		if (simLatencyEl && simLatencyEl.checked) {
			await delay(600);
		}

		const u = new URL(url, window.location.origin);
		const method = init.method || 'GET';
		const path = u.pathname;
		const records = loadBackendData();

		// GET /api/documents (sync / changes feed)
		if (path === ENDPOINT && method === 'GET') {
			const since = u.searchParams.get('since');
			if (since != null && since !== '' && since !== 'null') {
				const sinceN = Number(since);
				const updatedRecords = records.filter(r => Math.floor(Date.parse(r.server_timestamp) / 1000) > sinceN);
				window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
					detail: { message: `GET /api/documents?since=${since} -> Returned ${updatedRecords.length} updated records` }
				}));
				return jsonResponse({ data: updatedRecords, deleted: [], synced_at: Math.floor(Date.now() / 1000) });
			}
			window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
				detail: { message: `GET /api/documents -> Full Load (${records.length} records)` }
			}));
			return jsonResponse({ data: records, deleted: [], synced_at: Math.floor(Date.now() / 1000) });
		}

		const simFailureEl = document.getElementById('sim-failure');
		const shouldSimulateFailure = simFailureEl && simFailureEl.checked && Math.random() < 0.15;

		// POST /api/documents (create)
		if (path === ENDPOINT && method === 'POST') {
			if (shouldSimulateFailure) {
				window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
					detail: { message: `POST /api/documents -> Simulated 500 Server Error`, error: true }
				}));
				return jsonResponse({ error: 'Internal Server Error' }, 500);
			}

			const body = JSON.parse(init.body || '{}');
			const newRecord = Object.assign({
				file_size_bytes: 1024 + Math.floor(Math.random() * 499000)
			}, body, {
				doc_id: getNextId(records),
				server_timestamp: new Date().toISOString()
			});

			records.push(newRecord);
			saveBackendData(records);

			window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
				detail: { message: `POST /api/documents -> Created doc_id #${newRecord.doc_id}`, payload: newRecord }
			}));
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document created' }, content: newRecord });
		}

		// PUT /api/documents/:id (update)
		const putMatch = path.match(/^\/api\/documents\/(\d+)$/);
		if (putMatch && method === 'PUT') {
			if (shouldSimulateFailure) {
				window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
					detail: { message: `PUT /api/documents/${putMatch[1]} -> Simulated 500 Server Error`, error: true }
				}));
				return jsonResponse({ error: 'Internal Server Error' }, 500);
			}

			const id = Number(putMatch[1]);
			const idx = records.findIndex(r => r.doc_id === id);
			if (idx === -1) return jsonResponse({ error: 'Not Found' }, 404);

			const body = JSON.parse(init.body || '{}');
			const updated = Object.assign({}, records[idx], body, {
				server_timestamp: new Date().toISOString()
			});

			records[idx] = updated;
			saveBackendData(records);

			window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
				detail: { message: `PUT /api/documents/${id} -> Confirmed update`, payload: updated }
			}));
			return jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Document updated' }, content: updated });
		}

		// DELETE /api/documents/:id (delete)
		const delMatch = path.match(/^\/api\/documents\/(\d+)$/);
		if (delMatch && method === 'DELETE') {
			if (shouldSimulateFailure) {
				window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
					detail: { message: `DELETE /api/documents/${delMatch[1]} -> Simulated 500 Server Error`, error: true }
				}));
				return jsonResponse({ error: 'Internal Server Error' }, 500);
			}

			const id = Number(delMatch[1]);
			const filtered = records.filter(r => r.doc_id !== id);
			saveBackendData(filtered);

			window.dispatchEvent(new CustomEvent('demo-telemetry-net', {
				detail: { message: `DELETE /api/documents/${id} -> Confirmed deletion` }
			}));
			return jsonResponse({ message: { type: 'success', title: 'Deleted', body: 'Document deleted' }, content: null });
		}

		return realFetch(url, init);
	}

	// Intercept fetch calls targeting our endpoint
	window.fetch = function(input, init) {
		const url = typeof input === 'string' ? input : input.url;
		if (url && url.indexOf(ENDPOINT) !== -1) {
			return handleMockRequest(url, init);
		}
		return realFetch(input, init);
	};

	// =========================================================================
	// 2. Interactive Live Demo Wiring & Telemetry Logging
	// =========================================================================
	document.addEventListener('DOMContentLoaded', function() {
		const logConsole = document.getElementById('telemetry-log');
		if (!logConsole) return; // Only execute logging on pages that have the log panel

		const coordEl = document.getElementById('demo-coordinator');
		if (!coordEl) return;
		const storeEl = coordEl.querySelector('[data-ln-data-store]');
		if (!storeEl) return;

		// ─── Telemetry Console Logging ───────────────────────────
		function formatTime() {
			const d = new Date();
			return d.toLocaleTimeString() + '.' + String(d.getMilliseconds()).padStart(3, '0');
		}

		function logTelemetry(type, msg, detail) {
			let prefix = '🌐 ';
			let color = '#a1a1aa'; // Muted gray

			if (type === 'store-in') {
				prefix = '📥 [STORE EVENT] ';
				color = '#38bdf8'; // Blue
			} else if (type === 'store-out') {
				prefix = '📤 [STORE REMOTE EVENT] ';
				color = '#f472b6'; // Pink
			} else if (type === 'mapper') {
				prefix = '🔄 [MAPPER ACTION] ';
				color = '#c084fc'; // Purple
			} else if (type === 'connector-net') {
				prefix = '🌐 [CONNECTOR HTTP] ';
				color = '#fbbf24'; // Amber
			} else if (type === 'connector-event') {
				prefix = '📥 [CONNECTOR EVENT] ';
				color = '#34d399'; // Green
			}

			let line = `[${formatTime()}] ${prefix}${msg}`;
			if (detail) {
				line += ` ${JSON.stringify(detail)}`;
			}

			const span = document.createElement('span');
			span.textContent = line + '\n';
			span.style.color = color;

			logConsole.appendChild(span);
			logConsole.scrollTop = logConsole.scrollHeight;
		}

		const clearBtn = document.getElementById('clear-telemetry');
		if (clearBtn) {
			clearBtn.addEventListener('click', function() {
				logConsole.replaceChildren();
			});
		}

		// ─── Network Simulation Event Interception ──────────────
		window.addEventListener('demo-telemetry-net', function(e) {
			logTelemetry('connector-net', e.detail.message, e.detail.payload || null);
		});

		// ─── 3-Tier Data Layer Telemetry ─────────────────────────
		// Store Event Telemetry
		const storeEvents = ['ready', 'loaded', 'synced', 'created', 'updated', 'deleted', 'confirmed', 'reverted', 'conflict'];
		storeEvents.forEach(ev => {
			storeEl.addEventListener('ln-store:' + ev, function(e) {
				logTelemetry('store-in', `ln-store:${ev} was captured by UI Presenter`, e.detail);
			});
		});

		// Store request events caught by parent coordinator
		const coordinatorIntercepts = ['request-remote-sync', 'request-remote-create', 'request-remote-update', 'request-remote-delete', 'request-remote-bulk-delete'];
		coordinatorIntercepts.forEach(ev => {
			storeEl.addEventListener('ln-store:' + ev, function(e) {
				logTelemetry('store-out', `ln-store:${ev} bubbled UP to Parent Coordinator`, e.detail);
				
				// Show mapping telemetry in action!
				const mapper = coordEl.lnDataCoordinator ? coordEl.lnDataCoordinator.mapper : null;
				if (mapper) {
					if (ev === 'request-remote-create') {
						const serverPayload = mapper.egress(e.detail.data);
						logTelemetry('mapper', `egress() mapped Local Form -> Raw Server JSON payload`, { local: e.detail.data, serverRaw: serverPayload });
					} else if (ev === 'request-remote-update') {
						// Full updated record pulled by coordinator
						if (storeEl.lnDataStore) {
							storeEl.lnDataStore.getById(e.detail.id).then(function(localRecord) {
								const clean = Object.assign({}, localRecord);
								const serverPayload = mapper.egress(clean);
								logTelemetry('mapper', `egress() mapped Flat Local Cache Record -> Nested Server JSON PUT payload`, { local: clean, serverRaw: serverPayload });
							});
						}
					}
				}
			});
		});

		// Connector response event telemetry
		const connectorEvents = ['fetched', 'created', 'updated', 'deleted', 'bulk-deleted', 'error'];
		const connectorEl = coordEl.querySelector('[data-ln-api-connector]');
		if (connectorEl) {
			connectorEvents.forEach(ev => {
				connectorEl.addEventListener('ln-api-connector:' + ev, function(e) {
					logTelemetry('connector-event', `ln-api-connector:${ev} bubbled UP to Parent Coordinator`, e.detail);
					
					// Show mapping telemetry in action!
					const mapper = coordEl.lnDataCoordinator ? coordEl.lnDataCoordinator.mapper : null;
					if (mapper && (ev === 'created' || ev === 'updated')) {
						const localRecord = mapper.ingress(e.detail.record);
						logTelemetry('mapper', `ingress() mapped Raw Server JSON -> Normalized Flat Local Cache Record`, { serverRaw: e.detail.record, local: localRecord });
					}
				});
			});
		}

		// ─── Seeding & Wiping ──────────────────────────────
		const resetBtn = document.getElementById('reset-db');
		if (resetBtn) {
			resetBtn.addEventListener('click', function() {
				localStorage.removeItem(STORAGE_KEY);
				if (window.lnDataStore) {
					window.lnDataStore.clearAll().then(function() {
						location.reload();
					});
				} else {
					location.reload();
				}
			});
		}

		logTelemetry('store-in', 'Interactive Coordinator Sandbox initialized. Ingress/Egress data mapper evaluated.');
	});
})();
