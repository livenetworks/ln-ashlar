import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/api-queue.html (playground wiring),
// demo/admin/src/mock-api-queue.js (mocked /queue-tasks backend: 400ms latency, ids from 1001,
// modes success/auth/server) and components/ln-api-queue + ln-data-coordinator sources.

const PAGE_URL = BASE_URL + 'api-queue.html';

const QUEUE_EVENTS = ['send', 'enqueued', 'pending-count', 'auth-required', 'paused', 'resumed', 'failed', 'drained'];
const STORE_EVENTS = ['created', 'updated', 'deleted'];

run('demo/admin/api-queue.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Fresh state: the queue and the store live in IndexedDB, so delete every database before
	// reloading (deletion proceeds once the old page closes its connections on unload).
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => {
			localStorage.clear();
			if (indexedDB.databases) {
				indexedDB.databases().then(dbs => dbs.forEach(db => indexedDB.deleteDatabase(db.name)));
			}
		});
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const q = document.getElementById('demo-queue');
			const s = document.getElementById('demo-queue-store');
			const log = document.getElementById('api-event-log');
			return !!(q && q.lnApiQueue && s && s.lnDataStore && log
				&& log.textContent.includes('Mock queue backend armed')
				&& log.textContent.includes('Component loaded'));
		}, { timeout: 10000 });
		// Record every queue/store event (detail kept) for ordered assertions.
		await page.evaluate((qEvents, sEvents) => {
			window.__ev = [];
			const q = document.getElementById('demo-queue');
			const s = document.getElementById('demo-queue-store');
			qEvents.forEach(n => q.addEventListener('ln-api-queue:' + n, e => window.__ev.push({ name: 'queue:' + n, detail: e.detail })));
			sEvents.forEach(n => s.addEventListener('ln-data-store:' + n, e => window.__ev.push({ name: 'store:' + n, detail: e.detail })));
		}, QUEUE_EVENTS, STORE_EVENTS);
	}

	const click = id => page.evaluate(i => document.getElementById(i).click(), id);
	const setMode = mode => page.evaluate(m => {
		const r = document.querySelector('input[name="queue-demo-mode"][value="' + m + '"]');
		r.click();
	}, mode);

	const badge = () => page.evaluate(() => document.getElementById('pending-count-badge').textContent);
	const logText = () => page.evaluate(() => document.getElementById('api-event-log').textContent);
	const evNames = () => page.evaluate(() => window.__ev.map(e => e.name));
	const evCount = name => page.evaluate(n => window.__ev.filter(e => e.name === n).length, name);
	const evDetails = name => page.evaluate(n => window.__ev.filter(e => e.name === n).map(e => e.detail), name);
	const bannerDisplay = () => page.evaluate(() => getComputedStyle(document.getElementById('auth-banner')).display);

	async function waitBadge(value, timeout = 8000) {
		await page.waitForFunction(v => document.getElementById('pending-count-badge').textContent === v,
			{ timeout }, value);
	}

	async function waitEvents(name, count, timeout = 8000) {
		await page.waitForFunction((n, c) => window.__ev.filter(e => e.name === n).length >= c,
			{ timeout }, name, count);
	}

	async function waitLog(text, timeout = 8000) {
		await page.waitForFunction(t => document.getElementById('api-event-log').textContent.includes(t),
			{ timeout }, text);
	}

	// ═══ 0. Initial state ═════════════════════════════════════

	section('Initial state');
	await load();
	assert(await page.evaluate(() => document.getElementById('demo-queue').hasAttribute('data-ln-api-queue')),
		'#demo-queue carries data-ln-api-queue and is mounted (lnApiQueue)');
	assert(await page.evaluate(() => !!document.getElementById('demo-queue').closest('[data-ln-data-coordinator]')),
		'queue is nested inside the data coordinator');
	assert(await badge() === '0', 'pending badge starts at 0');
	assert(await page.evaluate(() => document.getElementById('connectivity-state').textContent) === 'Online',
		'connectivity badge starts at "Online"');
	assert(await page.evaluate(() => document.getElementById('btn-toggle-offline').textContent) === 'Simulate Offline',
		'toggle button starts as "Simulate Offline"');
	assert(await page.evaluate(() => document.querySelector('input[name="queue-demo-mode"]:checked').value) === 'success',
		'mock backend mode starts on "success"');
	assert(await bannerDisplay() === 'none', 'auth banner is hidden on load');
	assert(await page.evaluate(() => window.__queueDemoMode) === 'success', 'window.__queueDemoMode is "success"');

	// ═══ 1. Online create: enqueue -> send -> ack with id remap ══

	section('Online create goes through the outbox and remaps the temp id');
	await page.evaluate(() => { document.getElementById('trig-create-title').value = 'Synthetic task A'; });
	await click('btn-create');
	await waitEvents('queue:enqueued', 1);
	await waitEvents('queue:send', 1);
	await waitBadge('0');
	await waitEvents('queue:drained', 1);
	await waitEvents('store:updated', 1);

	const created = (await evDetails('store:created'))[0];
	assert(typeof created.tempId === 'string' && created.tempId.startsWith('_temp_'),
		'store:created carries a "_temp_" tempId');
	const sends = await evDetails('queue:send');
	assert(sends.length === 1, 'exactly one queue:send for the create');
	assert(sends[0].op === 'create' && sends[0].targetId === null, 'send op is "create" with null targetId');
	assert(sends[0].chainKey === created.tempId, 'send chainKey equals the temp id');
	assert(sends[0].payload.title === 'Synthetic task A' && sends[0].payload.status === 'Draft',
		'send payload is the dispatched { title, status: "Draft" }');
	assert(sends[0].idempotencyKey === sends[0].entryId, 'idempotencyKey equals entryId');
	const enq = (await evDetails('queue:enqueued'))[0];
	assert(enq.count === 1 && enq.entryId === sends[0].entryId, 'enqueued reports count 1 and the same entryId');
	const upd = (await evDetails('store:updated'))[0];
	assert(upd.record.id === 1001 && upd.record.title === 'Synthetic task A',
		'store:updated reconciles the record with the server id 1001 (mock idCounter)');
	assert(await badge() === '0', 'pending badge returns to 0 after acknowledgement');
	const names = await evNames();
	assert(names.indexOf('queue:enqueued') < names.indexOf('queue:send'), 'enqueued fires before send');
	assert((await logText()).includes('POST') && (await logText()).includes('queue-tasks'),
		'mock backend logged the POST to /queue-tasks');
	assert((await evDetails('queue:pending-count')).some(d => d.count === 1),
		'a pending-count of 1 was emitted while the entry was in the outbox');

	// ═══ 2. Update and delete the last task ═══════════════════

	section('Update last task');
	await page.evaluate(() => { document.getElementById('trig-update-title').value = 'Synthetic task A (revised)'; });
	await click('btn-update');
	await waitEvents('queue:send', 2);
	await waitBadge('0');
	await waitLog('PUT');
	const send2 = (await evDetails('queue:send'))[1];
	assert(send2.op === 'update' && send2.targetId === 1001, 'second send is an "update" targeting id 1001');
	assert(send2.payload.title === 'Synthetic task A (revised)', 'update payload carries the new title');
	assert(await evCount('store:updated') >= 2, 'optimistic store:updated fired for the update');

	section('Delete last task');
	await click('btn-delete');
	await waitEvents('queue:send', 3);
	await waitEvents('store:deleted', 1);
	await waitBadge('0');
	await waitLog('DELETE');
	const send3 = (await evDetails('queue:send'))[2];
	assert(send3.op === 'delete' && send3.targetId === 1001, 'third send is a "delete" targeting id 1001');
	assert(send3.payload === null, 'delete payload is null');

	section('Update/Delete without a task log a hint');
	await click('btn-update');
	await waitLog('No task created yet');
	const sendsBefore = await evCount('queue:send');
	await click('btn-delete');
	await page.waitForFunction(() => (document.getElementById('api-event-log').textContent.match(/No task created yet/g) || []).length >= 2,
		{ timeout: 5000 });
	assert(await evCount('queue:send') === sendsBefore, 'no send is produced when there is no task');

	section('Clear telemetry button');
	await click('btn-clear-log');
	assert((await logText()) === '', 'telemetry console is empty after Clear Telemetry');

	// ═══ 3. Simulated offline: writes accumulate, FIFO replay on online ══

	section('Offline toggle');
	await load();
	await click('btn-toggle-offline');
	assert(await page.evaluate(() => document.getElementById('demo-queue').getAttribute('data-ln-api-queue-online')) === 'false',
		'queue gets data-ln-api-queue-online="false"');
	assert(await page.evaluate(() => document.getElementById('connectivity-state').textContent) === 'Offline (simulated)',
		'connectivity badge reads "Offline (simulated)"');
	assert(await page.evaluate(() => document.getElementById('btn-toggle-offline').textContent) === 'Simulate Online',
		'toggle button reads "Simulate Online"');

	section('Offline writes are queued, not sent');
	await click('btn-create');
	await waitBadge('1');
	await click('btn-update');
	await waitBadge('2');
	await waitEvents('queue:enqueued', 2);
	assert(await evCount('queue:send') === 0, 'no queue:send while offline');
	assert(!(await logText()).includes('POST /api') && !(await logText()).includes('PUT /api'),
		'mock backend received no request while offline');
	assert((await evDetails('queue:enqueued')).map(d => d.count).join(',') === '1,2',
		'enqueued counts grow 1, 2');

	section('Back online: FIFO replay with id remap inside the chain');
	await click('btn-toggle-offline');
	assert(await page.evaluate(() => document.getElementById('demo-queue').getAttribute('data-ln-api-queue-online')) === 'true',
		'queue gets data-ln-api-queue-online="true"');
	assert(await page.evaluate(() => document.getElementById('connectivity-state').textContent) === 'Online',
		'connectivity badge back to "Online"');
	await waitEvents('queue:send', 2, 12000);
	await waitBadge('0', 12000);
	const replay = await evDetails('queue:send');
	assert(replay[0].op === 'create' && replay[1].op === 'update', 'replay order is create then update (FIFO per chain)');
	assert(replay[1].targetId === 1001, 'queued update was remapped from the temp id to the server id 1001');
	await waitEvents('queue:drained', 1);

	// ═══ 4. Clear Outbox ══════════════════════════════════════

	section('Clear Outbox empties the queue');
	await load();
	await click('btn-toggle-offline');
	await click('btn-create');
	await click('btn-create');
	await waitBadge('2');
	await click('btn-clear');
	await waitBadge('0');
	await waitEvents('queue:drained', 1);
	assert(await evCount('queue:send') === 0, 'cleared entries are never sent');
	await click('btn-toggle-offline');
	await waitLog('Simulating online');
	assert(await badge() === '0', 'nothing replays after going back online');

	// ═══ 5. Auth failure pauses the queue; Resume continues ═══

	section('Auth failure (401) pauses the queue');
	await load();
	await setMode('auth');
	assert(await page.evaluate(() => window.__queueDemoMode) === 'auth', 'selecting the radio sets window.__queueDemoMode');
	await click('btn-create');
	await waitEvents('queue:auth-required', 1);
	await waitEvents('queue:paused', 1);
	assert((await evDetails('queue:paused'))[0].reason === 'auth', 'paused reason is "auth"');
	await page.waitForFunction(() => getComputedStyle(document.getElementById('auth-banner')).display === 'block',
		{ timeout: 5000 });
	assert(await bannerDisplay() === 'block', 'auth banner is shown');
	assert(await badge() === '1', 'the entry stays in the outbox');
	assert(await evCount('queue:send') === 1, 'exactly one send attempt happened');

	section('Resume after switching the backend to success');
	await setMode('success');
	await click('btn-resume');
	await waitEvents('queue:resumed', 1);
	await page.waitForFunction(() => getComputedStyle(document.getElementById('auth-banner')).display === 'none',
		{ timeout: 5000 });
	assert(await bannerDisplay() === 'none', 'auth banner is hidden after resume');
	await waitEvents('queue:send', 2);
	await waitBadge('0');
	assert(await evCount('queue:send') === 2, 'resume re-sends the paused entry');
	assert((await evDetails('queue:send'))[1].entryId === (await evDetails('queue:send'))[0].entryId,
		'the re-sent entry is the same outbox entry');

	// ═══ 6. Server error: backoff retry ═══════════════════════

	section('Server error (500) keeps the entry and retries with backoff');
	await load();
	await setMode('server');
	await click('btn-create');
	await waitEvents('queue:send', 1);
	await waitLog('500 Internal Server Error simulated');
	assert(await badge() === '1', 'entry stays pending after a 500');
	assert(await evCount('queue:paused') === 0, 'a 500 does not pause the queue');
	assert(await bannerDisplay() === 'none', 'auth banner stays hidden on a 500');
	await setMode('success');
	await waitEvents('queue:send', 2, 10000);
	await waitBadge('0', 10000);
	const retried = await evDetails('queue:send');
	assert(retried[0].entryId === retried[1].entryId, 'the backoff retry re-sends the same entry');
	assert(await evCount('queue:failed') === 0, 'no queue:failed after a single retryable error');

	// ═══ 7. Static structure ══════════════════════════════════

	section('Playground structure');
	assert(await page.evaluate(() => document.querySelectorAll('input[name="queue-demo-mode"]').length) === 3,
		'three mock backend mode radios');
	assert(await page.evaluate(() => ['btn-toggle-offline', 'btn-create', 'btn-update', 'btn-delete', 'btn-drain', 'btn-clear', 'btn-clear-log', 'btn-resume']
		.every(id => !!document.getElementById(id))), 'all playground buttons exist');
});
