import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/src/pages/websocket-connector.html — what drives the page:
//   * REAL library components: ln-websocket-connector, ln-api-connector, ln-data-coordinator,
//     ln-data-store, ln-table (data-driven). Page wiring: demo/admin/src/websocket-demo.js
//     (status chip listener + connect/disconnect buttons writing data-ln-websocket-connector).
//   * The page ships NO mock WebSocket. The real mock is a separate PHP process
//     (demo/websocket/ws-mock.php, port 8090) that is not available here.
//   * So this test replaces window.WebSocket and window.fetch (only for http://localhost:8090)
//     with a scripted in-page fake server (evaluateOnNewDocument) that mirrors ws-mock.php's
//     protocol: ws_route (sync/query/create/update/delete/bulk-delete replies), "changes" pushes
//     broadcast to every open socket after a write, and the REST router (only the exact path
//     /tasks exists; anything else answers 404 exactly like the mock's router).
//   * It proves the library <-> wire-protocol contract and the page wiring. It cannot prove
//     the real PHP server, real network timing, or real RFC6455 behavior.

const PAGE_URL = BASE_URL + 'websocket-connector.html';
const WS_URL = 'ws://localhost:8090';
const REST_TASKS_URL = 'http://localhost:8090/tasks';
const REST = 'ws-rest-socket';
const SOCK = 'ws-socket-socket';

const SEED = [
	{ id: 1, title: 'Seed alpha', status: 'open', priority: 'high', assignee: 'Person A' },
	{ id: 2, title: 'Seed beta', status: 'done', priority: 'low', assignee: 'Person B' },
	{ id: 3, title: 'Seed gamma', status: 'open', priority: 'normal', assignee: 'Person C' }
];

run('demo/admin/websocket-connector.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each check is isolated so one broken demo behavior does not hide the others.
	async function check(name, fn) {
		try {
			await fn();
		} catch (err) {
			failures.push(`${name}: ${err.message}`);
			console.error(`  ✗ CHECK FAILED [${name}]: ${err.message}`);
		}
	}

	// ─── In-page fake server (installed before every navigation) ─────────

	await page.evaluateOnNewDocument((seed, wsUrl, restUrl) => {
		const fake = {
			hold: false,
			sockets: [],
			fetches: [],
			events: [],
			tasks: seed.map(t => Object.assign({}, t)),
			rev: {},
			deletedLog: [],
			seq: 0,
			nextId: seed.length + 1
		};
		seed.forEach(t => { fake.rev[t.id] = ++fake.seq; });
		window.__fake = fake;

		// Event log (document-level, bubbling) — read by the test.
		['connecting', 'connected', 'disconnected', 'fetched', 'created', 'error'].forEach(name => {
			document.addEventListener('ln-websocket-connector:' + name, e => {
				const d = e.detail || {};
				const entry = { type: name, target: e.target.id };
				if (name === 'connecting') Object.assign(entry, { url: d.url, attempt: d.attempt });
				if (name === 'connected') Object.assign(entry, { url: d.url });
				if (name === 'disconnected') Object.assign(entry, { url: d.url, code: d.code, reason: d.reason, willReconnect: d.willReconnect });
				if (name === 'fetched') Object.assign(entry, { since: d.since, meta: d.meta, synced_at: d.data && d.data.synced_at, ids: d.data && d.data.data && d.data.data.map(r => r.id), deleted: d.data && d.data.deleted });
				if (name === 'created') Object.assign(entry, { title: d.record && d.record.title, tempId: d.tempId });
				if (name === 'error') Object.assign(entry, { action: d.action, error: d.error, status: d.status });
				fake.events.push(entry);
			}, true);
		});

		function broadcast(change) {
			const frame = JSON.stringify({ type: 'changes', data: change.data, deleted: change.deleted, synced_at: fake.seq });
			fake.sockets.forEach(s => {
				if (s.readyState === 1) setTimeout(() => s._deliver(frame), 0);
			});
		}

		function delta(since) {
			const s = since === null || since === undefined ? null : Number(since);
			return {
				data: fake.tasks.filter(t => s === null || fake.rev[t.id] > s),
				deleted: fake.deletedLog.filter(d => s === null || d.rev > s).map(d => d.id),
				synced_at: fake.seq
			};
		}

		function createTask(data) {
			const rec = { id: fake.nextId++, title: (data && data.title) || '', status: 'open', priority: 'normal', assignee: 'Person Z' };
			fake.tasks.push(rec);
			fake.rev[rec.id] = ++fake.seq;
			return rec;
		}

		// Mirrors ws_route() of demo/websocket/ws-mock.php.
		function route(msg) {
			const ok = content => ({ ref: msg.ref, ok: true, content: content, message: null });
			if (msg.type === 'sync') return { reply: ok(delta(msg.since)) };
			if (msg.type === 'create') {
				const rec = createTask(msg.data);
				return { reply: ok(rec), change: { data: [rec], deleted: [] } };
			}
			return { reply: { ref: msg.ref, ok: false, status: 400, error: 'Unknown type', data: null } };
		}

		class FakeWS {
			constructor(url) {
				this.url = url;
				this.readyState = 0;
				this.sent = [];
				this.closeArgs = null;
				const lastConnecting = fake.events.filter(e => e.type === 'connecting').pop();
				this.owner = lastConnecting ? lastConnecting.target : null;
				fake.sockets.push(this);
				if (!fake.hold) setTimeout(() => this._open(), 0);
			}
			_open() {
				if (this.readyState !== 0) return;
				this.readyState = 1;
				if (this.onopen) this.onopen({});
			}
			_deliver(raw) {
				if (this.readyState === 1 && this.onmessage) this.onmessage({ data: raw });
			}
			_serverClose(code, reason) {
				if (this.readyState === 3) return;
				this.readyState = 3;
				if (this.onclose) this.onclose({ code: code, reason: reason });
			}
			send(raw) {
				if (this.readyState !== 1) throw new Error('FakeWS not open');
				const msg = JSON.parse(raw);
				this.sent.push(msg);
				setTimeout(() => {
					const out = route(msg);
					this._deliver(JSON.stringify(out.reply));
					if (out.change) broadcast(out.change);
				}, 0);
			}
			close(code, reason) {
				this.closeArgs = { code: code, reason: reason };
				this.readyState = 3;
			}
		}
		window.WebSocket = FakeWS;

		// REST: only http://localhost:8090/tasks exists (ws-mock.php's router answers 404 otherwise).
		const realFetch = window.fetch.bind(window);
		window.fetch = function (url, opts) {
			const u = String(url);
			if (u.indexOf('http://localhost:8090') !== 0) return realFetch(url, opts);
			const method = (opts && opts.method) || 'GET';
			const entry = { method: method, url: u, body: opts && opts.body ? JSON.parse(opts.body) : null };
			fake.fetches.push(entry);
			const json = (status, body) => Promise.resolve(new Response(JSON.stringify(body), { status: status, headers: { 'Content-Type': 'application/json' } }));
			const base = u.split('?')[0];
			if (base !== restUrl) return json(404, { error: 'Not found' });
			if (method === 'GET') {
				const q = u.indexOf('?') === -1 ? new URLSearchParams() : new URLSearchParams(u.split('?')[1]);
				const d = delta(q.has('since') ? q.get('since') : null);
				return json(200, { data: d.data, deleted: d.deleted, synced_at: d.synced_at, total: fake.tasks.length, filtered: fake.tasks.length });
			}
			if (method === 'POST') {
				const rec = createTask(entry.body);
				setTimeout(() => broadcast({ data: [rec], deleted: [] }), 0);
				return json(201, rec);
			}
			return json(400, { error: 'Unsupported route' });
		};
	}, SEED, WS_URL, REST_TASKS_URL);

	const cdp = await page.createCDPSession();

	// ─── Page helpers ──────────────────────────────────────────

	async function load() {
		await page.goto('about:blank');
		await cdp.send('Storage.clearDataForOrigin', { origin: 'http://localhost', storageTypes: 'all' });
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction((rest, sock) => {
			const f = window.__fake;
			return f && f.sockets.length >= 2
				&& document.getElementById(rest) && document.getElementById(rest).lnWebsocketConnector
				&& document.getElementById(sock) && document.getElementById(sock).lnWebsocketConnector;
		}, { timeout: 10000 }, REST, SOCK);
	}

	const chip = id => page.evaluate(i => document.querySelector('[data-ws-status-for="' + i + '"]').getAttribute('data-status'), id);

	const waitChip = (id, status) => page.waitForFunction((i, s) => {
		const c = document.querySelector('[data-ws-status-for="' + i + '"]');
		return c && c.getAttribute('data-status') === s;
	}, { timeout: 5000 }, id, status);

	// The one visible status label inside a chip (display comes from the page SCSS).
	const chipVisibleText = id => page.evaluate(i => Array.from(document.querySelector('[data-ws-status-for="' + i + '"]').querySelectorAll('[data-when]'))
		.filter(s => getComputedStyle(s).display !== 'none')
		.map(s => s.textContent.trim()), id);

	const tableRows = id => page.evaluate(i => Array.from(document.querySelectorAll('#' + i + ' tbody tr'))
		.map(tr => Array.from(tr.cells).map(td => td.textContent.trim())), id);

	const waitRow = (tableId, title, present = true) => page.waitForFunction((i, t, p) => {
		const has = Array.from(document.querySelectorAll('#' + i + ' tbody tr')).some(tr => tr.cells[1] && tr.cells[1].textContent.trim() === t);
		return has === p;
	}, { timeout: 5000 }, tableId, title, present);

	const socketsOf = owner => page.evaluate(o => window.__fake.sockets.map((s, i) => ({ s, i })).filter(x => x.s.owner === o).map(x => x.i), owner);

	const sentOf = idx => page.evaluate(i => window.__fake.sockets[i].sent, idx);

	const events = (type, target) => page.evaluate((t, g) => window.__fake.events.filter(e => e.type === t && e.target === g), type, target);

	const click = sel => page.evaluate(s => document.querySelector(s).click(), sel);

	// ═══ 1. Boot ═══════════════════════════════════════════════

	section('Boot: both connectors open a socket to their data-ln-websocket-connector-url');
	await load();

	await check('boot sockets', async () => {
		const restSockets = await socketsOf(REST);
		const sockSockets = await socketsOf(SOCK);
		assert(restSockets.length === 1 && sockSockets.length === 1, 'each connector constructed exactly one WebSocket');
		const urls = await page.evaluate(() => window.__fake.sockets.map(s => s.url));
		assert(urls.every(u => u === WS_URL), `both sockets target ${WS_URL}`);
	});

	await check('boot events', async () => {
		await waitChip(REST, 'connected');
		await waitChip(SOCK, 'connected');
		for (const id of [REST, SOCK]) {
			const connecting = await events('connecting', id);
			assert(connecting.length === 1 && connecting[0].attempt === 1 && connecting[0].url === WS_URL, `${id}: one :connecting {attempt:1, url}`);
			const connected = await events('connected', id);
			assert(connected.length === 1 && connected[0].url === WS_URL, `${id}: one :connected {url}`);
		}
	});

	await check('boot chips', async () => {
		for (const id of [REST, SOCK]) {
			assert(await chip(id) === 'connected', `${id}: chip data-status = connected (written by the page from the event)`);
			const text = await chipVisibleText(id);
			assert(text.length === 1 && text[0] === 'Connected', `${id}: only the "Connected" label is visible`);
		}
	});

	await check('status is not an attribute', async () => {
		const attrs = await page.evaluate(id => Array.from(document.getElementById(id).attributes).map(a => a.name).sort(), SOCK);
		assert(JSON.stringify(attrs) === JSON.stringify(['data-ln-websocket-connector', 'data-ln-websocket-connector-url', 'id']),
			`socket element carries no status attribute (got ${attrs.join(',')})`);
	});

	section('Boot: initial data arrives per transport');

	await check('example 2 loads over the socket', async () => {
		await page.waitForFunction(() => document.querySelectorAll('#ws-socket-table tbody tr').length === 3, { timeout: 5000 });
		const rows = await tableRows('ws-socket-table');
		assert(JSON.stringify(rows.map(r => r.slice(0, 2))) === JSON.stringify(SEED.map(t => [String(t.id), t.title])), 'ws-socket table shows the 3 seed tasks (id, title)');
		const idx = (await socketsOf(SOCK))[0];
		const sent = await sentOf(idx);
		const sync = sent.filter(m => m.type === 'sync');
		assert(sync.length >= 1 && typeof sync[0].ref === 'string' && 'since' in sync[0], 'a "sync" frame with string ref and since was sent on the socket');
	});

	await check('example 1 loads over REST, socket sends nothing', async () => {
		await page.waitForFunction(() => document.querySelectorAll('#ws-rest-table tbody tr').length === 3, { timeout: 5000 });
		const rows = await tableRows('ws-rest-table');
		assert(JSON.stringify(rows.map(r => r.slice(0, 2))) === JSON.stringify(SEED.map(t => [String(t.id), t.title])), 'ws-rest table shows the 3 seed tasks (id, title)');
		const gets = await page.evaluate(() => window.__fake.fetches.filter(f => f.method === 'GET').map(f => f.url));
		assert(gets.length >= 1 && gets.every(u => u.indexOf('http://localhost:8090/tasks') === 0), 'REST connector fetched GET http://localhost:8090/tasks');
		const idx = (await socketsOf(REST))[0];
		assert((await sentOf(idx)).length === 0, 'the push-only socket beside REST sent no request frame');
	});

	// ═══ 2. Disconnect command ═════════════════════════════════

	section('Disconnect button (example 2)');

	await check('disconnect', async () => {
		await click('button[data-ws-command="disconnect"][data-ws-for="' + SOCK + '"]');
		await waitChip(SOCK, 'disconnected');
		const cmd = await page.evaluate(id => document.getElementById(id).getAttribute('data-ln-websocket-connector'), SOCK);
		assert(cmd === 'disconnect', 'button wrote data-ln-websocket-connector="disconnect"');
		const text = await chipVisibleText(SOCK);
		assert(text.length === 1 && text[0] === 'Disconnected', 'only the "Disconnected" label is visible');
		const idx = (await socketsOf(SOCK))[0];
		const closed = await page.evaluate(i => ({ rs: window.__fake.sockets[i].readyState, args: window.__fake.sockets[i].closeArgs }), idx);
		assert(closed.rs === 3 && closed.args.code === 1000 && closed.args.reason === 'disconnect', 'socket.close(1000, "disconnect") was called');
		const ev = (await events('disconnected', SOCK)).pop();
		assert(ev && ev.code === 1000 && ev.reason === 'disconnect' && ev.willReconnect === false, ':disconnected {code:1000, reason:"disconnect", willReconnect:false}');
		assert(await chip(REST) === 'connected', 'the other example stays connected (chip is per socket id)');
	});

	section('Request while disconnected fails at once (example 2)');

	await check('create while disconnected', async () => {
		const idx = (await socketsOf(SOCK))[0];
		const before = (await sentOf(idx)).length;
		await page.focus('#ws-socket-title');
		await page.keyboard.type('Offline task');
		await click('form[data-ln-data-coordinator-scope="ws-socket"] button[type="submit"]');
		await page.waitForFunction(() => window.__fake.events.some(e => e.type === 'error' && e.target === 'ws-socket-socket'), { timeout: 5000 });
		const err = (await events('error', SOCK)).pop();
		assert(err.action === 'create' && err.status === 0 && err.error === 'disconnected', ':error {action:"create", status:0, error:"disconnected"}');
		assert((await sentOf(idx)).length === before, 'no frame was sent');
	});

	// ═══ 3. Connect command, connecting state, catch-up ════════

	section('Connect button (example 2): connecting -> connected -> catch-up sync');

	await check('connect', async () => {
		await page.evaluate(() => { window.__fake.hold = true; });
		await click('button[data-ws-command="connect"][data-ws-for="' + SOCK + '"]');
		await waitChip(SOCK, 'connecting');
		const text = await chipVisibleText(SOCK);
		assert(text.length === 1 && text[0] === 'Connecting…', 'only the "Connecting…" label is visible');
		const cmd = await page.evaluate(id => document.getElementById(id).getAttribute('data-ln-websocket-connector'), SOCK);
		assert(cmd === 'connect', 'button wrote data-ln-websocket-connector="connect"');
		const socks = await socketsOf(SOCK);
		assert(socks.length === 2, 'a second WebSocket was constructed for the example');
		const ev = (await events('connecting', SOCK)).pop();
		assert(ev.attempt === 1 && ev.url === WS_URL, 'second :connecting is {attempt:1, url}');
		await page.evaluate(i => { window.__fake.hold = false; window.__fake.sockets[i]._open(); }, socks[1]);
		await waitChip(SOCK, 'connected');
		await page.waitForFunction(i => window.__fake.sockets[i].sent.some(m => m.type === 'sync'), { timeout: 5000 }, socks[1]);
		const seq = await page.evaluate(() => window.__fake.seq);
		const sync = (await sentOf(socks[1])).find(m => m.type === 'sync');
		assert(sync.since === seq && seq === SEED.length, `[source] catch-up sync sends since = store.lastSyncedAt = last synced_at (${seq})`);
	});

	// ═══ 4. Server push ════════════════════════════════════════

	section('Server push (no ref) lands in the store and the table (example 2 only)');

	await check('push upsert', async () => {
		const socks = await socketsOf(SOCK);
		const cur = socks[socks.length - 1];
		await page.evaluate(i => {
			window.__fake.sockets[i]._deliver(JSON.stringify({ type: 'changes', data: [{ id: 50, title: 'Pushed task', status: 'open', priority: 'high', assignee: 'Person P' }], deleted: [], synced_at: 50 }));
		}, cur);
		await waitRow('ws-socket-table', 'Pushed task');
		const rows = await tableRows('ws-socket-table');
		const row = rows.find(r => r[1] === 'Pushed task');
		assert(JSON.stringify(row) === JSON.stringify(['50', 'Pushed task', 'open', 'high', 'Person P']), 'pushed row renders id, title, status, priority, assignee');
		const rest = await tableRows('ws-rest-table');
		assert(!rest.some(r => r[1] === 'Pushed task'), 'the other example (own socket) did not receive it');
		const ev = (await events('fetched', SOCK)).filter(e => e.synced_at === 50).pop();
		assert(ev && ev.meta === null && ev.since === null && JSON.stringify(ev.ids) === '[50]', ':fetched {data:{data,deleted,synced_at}, since:null, meta:null} for a push');
	});

	await check('push delete', async () => {
		const socks = await socketsOf(SOCK);
		const cur = socks[socks.length - 1];
		await page.evaluate(i => {
			window.__fake.sockets[i]._deliver(JSON.stringify({ type: 'changes', data: [], deleted: [50], synced_at: 51 }));
		}, cur);
		await waitRow('ws-socket-table', 'Pushed task', false);
		const rows = await tableRows('ws-socket-table');
		assert(!rows.some(r => r[0] === '50'), 'deleted id 50 is removed from the table');
	});

	// ═══ 5. Writes ═════════════════════════════════════════════

	section('Write over the socket (example 2) is broadcast to the other example');

	await check('socket create', async () => {
		const socks = await socketsOf(SOCK);
		const cur = socks[socks.length - 1];
		await page.$eval('#ws-socket-title', el => { el.value = ''; });
		await page.focus('#ws-socket-title');
		await page.keyboard.type('Socket task');
		await click('form[data-ln-data-coordinator-scope="ws-socket"] button[type="submit"]');
		await page.waitForFunction(i => window.__fake.sockets[i].sent.some(m => m.type === 'create'), { timeout: 5000 }, cur);
		const frame = (await sentOf(cur)).find(m => m.type === 'create');
		assert(typeof frame.ref === 'string' && frame.data.title === 'Socket task', 'a "create" frame {ref, type, data:{title}} was sent on the socket');
		// The push can render the real row before the reply swaps out the optimistic temp row; wait for the swap.
		await page.waitForFunction(() => {
			const rows = Array.from(document.querySelectorAll('#ws-socket-table tbody tr')).filter(tr => tr.cells[1].textContent.trim() === 'Socket task');
			return rows.length === 1 && /^\d+$/.test(rows[0].cells[0].textContent.trim());
		}, { timeout: 5000 });
		const rows = (await tableRows('ws-socket-table')).filter(r => r[1] === 'Socket task');
		assert(rows.length === 1 && rows[0][0] === String(SEED.length + 1), 'example 2 shows exactly one row with the server-assigned id');
		const created = (await events('created', SOCK)).pop();
		assert(created && created.title === 'Socket task', ':created {record} fired with the server record');
	});

	await check('write appears in the other example', async () => {
		await waitRow('ws-rest-table', 'Socket task');
		const rows = (await tableRows('ws-rest-table')).filter(r => r[1] === 'Socket task');
		assert(rows.length === 1 && rows[0][0] === String(SEED.length + 1), '[page prose] a task added in one example appears in the other (via the other socket push)');
	});

	section('Write over REST (example 1): the form action is the request URL, never the socket');

	await check('REST create URL', async () => {
		await page.focus('#ws-rest-title');
		await page.keyboard.type('Rest task');
		await click('form[data-ln-data-coordinator-scope="ws-rest"] button[type="submit"]');
		await page.waitForFunction(() => window.__fake.fetches.some(f => f.method === 'POST'), { timeout: 5000 });
		const posts = await page.evaluate(() => window.__fake.fetches.filter(f => f.method === 'POST'));
		assert(posts.length === 1 && posts[0].body.title === 'Rest task', 'exactly one POST carrying {title}');
		// [source] ln-api-connector.create joins baseUrl with the form action via joinUrl(); the form action
		// here is already absolute. The demo intends the POST to hit the mock's /tasks route.
		assert(posts[0].url === REST_TASKS_URL, `POST url is ${REST_TASKS_URL} (got ${posts[0].url})`);
	});

	await check('REST create sends no socket frame', async () => {
		const idx = (await socketsOf(REST))[0];
		assert((await sentOf(idx)).length === 0, 'the push-only socket in example 1 still sent no request frame');
	});

	await check('REST create shows in example 1', async () => {
		await waitRow('ws-rest-table', 'Rest task');
		assert((await tableRows('ws-rest-table')).filter(r => r[1] === 'Rest task').length === 1, 'example 1 shows exactly one "Rest task" row');
	});

	await check('REST create is pushed to example 2', async () => {
		await waitRow('ws-socket-table', 'Rest task');
		assert((await tableRows('ws-socket-table')).filter(r => r[1] === 'Rest task').length === 1, '[page prose] the REST write is pushed to every open socket, so example 2 shows it');
	});

	// ═══ 6. Unexpected close -> reconnect ══════════════════════

	section('Unexpected close reconnects (example 2): 1 s backoff, then catch-up sync');

	await check('reconnect', async () => {
		const socks = await socketsOf(SOCK);
		const cur = socks[socks.length - 1];
		await page.evaluate(i => window.__fake.sockets[i]._serverClose(1006, 'gone'), cur);
		await waitChip(SOCK, 'disconnected');
		const ev = (await events('disconnected', SOCK)).pop();
		assert(ev.code === 1006 && ev.reason === 'gone' && ev.willReconnect === true, ':disconnected {code:1006, reason:"gone", willReconnect:true}');
		await page.waitForFunction(n => window.__fake.sockets.filter(s => s.owner === 'ws-socket-socket').length === n + 1, { timeout: 5000 }, socks.length);
		await waitChip(SOCK, 'connected');
		const after = await socketsOf(SOCK);
		const connecting = (await events('connecting', SOCK)).pop();
		assert(connecting.attempt === 1, 'reconnect :connecting attempt is 1 (counter was reset by the previous open)');
		await page.waitForFunction(i => window.__fake.sockets[i].sent.some(m => m.type === 'sync'), { timeout: 5000 }, after[after.length - 1]);
		const seq = await page.evaluate(() => window.__fake.seq);
		const sync = (await sentOf(after[after.length - 1])).find(m => m.type === 'sync');
		assert(sync.since === seq, `[source] reconnect catch-up sync since = last synced_at (${seq})`);
		assert(await chip(REST) === 'connected', 'example 1 stayed connected throughout');
	});

	if (failures.length) {
		throw new Error(`${failures.length} check(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
