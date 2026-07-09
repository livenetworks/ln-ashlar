// Mock REST Interceptor for the ln-api-queue Offline Outbox demo.
// Only intercepts requests to the demo queue's base path (/api/queue-tasks);
// everything else falls through to the real window.fetch.
(function () {
	const realFetch = window.fetch.bind(window);
	const MOCK_PATH = '/queue-tasks';

	let idCounter = 1000;

	const logConsole = document.getElementById('api-event-log');
	function formatTime() {
		const d = new Date();
		return d.toLocaleTimeString() + '.' + String(d.getMilliseconds()).padStart(3, '0');
	}

	function writeTelemetry(direction, message, meta) {
		if (!logConsole) return;
		const prefix = direction === 'NET' ? '🌐 [MOCK_NET]  ' : direction === 'IN' ? '📥 [EVENT IN]  ' : '📤 [EVENT OUT] ';
		let line = '[' + formatTime() + '] ' + prefix + message;
		if (meta) {
			line += ' ' + JSON.stringify(meta);
		}
		const span = document.createElement('span');
		span.textContent = line + '\n';
		span.style.color = direction === 'NET' ? '#f59e0b' : direction === 'IN' ? '#38bdf8' : '#34d399';
		logConsole.appendChild(span);
		logConsole.scrollTop = logConsole.scrollHeight;
	}

	function currentMode() {
		return window.__queueDemoMode || 'success';
	}

	function jsonResponse(body, status) {
		return new Response(JSON.stringify(body), {
			status: status,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	window.fetch = function (input, init) {
		const url = typeof input === 'string' ? input : input.url;
		const method = ((init && init.method) || 'GET').toUpperCase();

		if (url.indexOf(MOCK_PATH) === -1) {
			return realFetch(input, init);
		}

		const mode = currentMode();
		writeTelemetry('NET', `${method} ${url} (mode: ${mode})`, init && init.body ? JSON.parse(init.body) : null);

		return new Promise(function (resolve) {
			setTimeout(function () {
				// Delta fetch always succeeds — the demo focuses on write-path failures.
				if (method === 'GET') {
					resolve(jsonResponse([], 200));
					return;
				}

				if (mode === 'auth') {
					writeTelemetry('NET', '401 Unauthorized simulated (session expired).');
					resolve(jsonResponse({ message: 'Session expired' }, 401));
					return;
				}

				if (mode === 'server') {
					writeTelemetry('NET', '500 Internal Server Error simulated.');
					resolve(jsonResponse({ message: 'Internal server error' }, 500));
					return;
				}

				// mode === 'success'
				if (method === 'POST' && url.indexOf('/bulk-delete') === -1) {
					const body = JSON.parse((init && init.body) || '{}');
					const record = Object.assign({}, body, { id: ++idCounter });
					resolve(jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Task created' }, content: record }, 201));
					return;
				}

				if (method === 'PUT') {
					const id = url.split('/').filter(Boolean).pop();
					const body = JSON.parse((init && init.body) || '{}');
					const record = Object.assign({}, body, { id: Number(id) || id });
					resolve(jsonResponse({ message: { type: 'success', title: 'Saved', body: 'Task updated' }, content: record }, 200));
					return;
				}

				if (method === 'DELETE') {
					resolve(jsonResponse({ message: { type: 'success', title: 'Deleted', body: 'Task deleted' }, content: null }, 200));
					return;
				}

				resolve(jsonResponse({ message: 'Unhandled mock route' }, 404));
			}, 400);
		});
	};

	writeTelemetry('NET', 'Mock queue backend armed. Intercepting ' + MOCK_PATH);
})();
