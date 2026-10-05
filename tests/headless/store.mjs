import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/store.html. The live demo is a
// self-contained in-memory MOCK (no real ln-data-store element is mounted on the page):
// its inline script dispatches ln-data-store:* CustomEvents on document and renders
// state / records / an event log. The test drives the demo's buttons and the
// online/offline indicator listeners. The real component is NOT exercised here.

const PAGE_URL = BASE_URL + 'store.html';

const SEED = [
	'#1 — ISO 27001 Policy (Approved, v1)',
	'#2 — Risk Assessment (Draft, v1)',
	'#3 — Access Control (Approved, v1)'
];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/store.html', async ({ page }) => {

	const failures = [];

	// Each section is isolated so one broken demo behavior does not hide the others.
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  ✗ Section failed: ${title}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => document.getElementById('demo-is-loaded')
			&& document.getElementById('demo-is-loaded').textContent === 'true', { timeout: 10000 });
	}

	const state = () => page.evaluate(() => ({
		isLoaded: document.getElementById('demo-is-loaded').textContent,
		totalCount: document.getElementById('demo-total-count').textContent,
		isSyncing: document.getElementById('demo-is-syncing').textContent
	}));

	const records = () => page.evaluate(() => Array.from(document.querySelectorAll('#demo-records > li'))
		.map(li => li.textContent));

	const logLines = () => page.evaluate(() => document.getElementById('demo-event-log').textContent
		.split('\n').filter(l => l !== ''));

	const click = id => page.evaluate(i => document.getElementById(i).click(), id);

	const countLog = async needle => (await logLines()).filter(l => l.includes(needle)).length;

	// Waits until the log holds `n` lines containing `needle`.
	async function waitLog(needle, n) {
		await page.waitForFunction((nd, cnt) => document.getElementById('demo-event-log').textContent
			.split('\n').filter(l => l.includes(nd)).length === cnt, { timeout: 5000 }, needle, n);
	}

	await section('Initial mock load', async () => {
		await load();
		const s = await state();
		assert(s.isLoaded === 'true' && s.totalCount === '3' && s.isSyncing === 'false',
			'state table after load: isLoaded true, totalCount 3, isSyncing false');
		assert(same(await records(), SEED), 'records list shows the three seed records with status and version');
		const lines = await logLines();
		const order = ['ln-data-store:syncing', 'ln-data-store:loaded', 'ln-data-store:ready']
			.map(n => lines.findIndex(l => l.includes(n)));
		assert(order.every(i => i >= 0) && order[0] < order[1] && order[1] < order[2],
			'log has syncing, loaded, ready in that order');
		assert(lines.some(l => /\] ln-data-store:syncing {2}\{"store":"demo"\}$/.test(l)), 'syncing line carries {"store":"demo"}');
		assert(lines.some(l => /\] ln-data-store:loaded {2}\{"count":3\}$/.test(l)), 'loaded line carries {"count":3}');
		assert(lines.some(l => /\] ln-data-store:ready {2}\{"count":3,"source":"server"\}$/.test(l)), 'ready line carries {"count":3,"source":"server"}');
	});

	await section('Create record', async () => {
		await load();
		await page.evaluate(() => {
			window.__events = [];
			['created', 'confirmed'].forEach(n => document.addEventListener('ln-data-store:' + n, e => {
				window.__events.push({ name: n, detail: JSON.parse(JSON.stringify(e.detail)) });
			}));
		});
		await click('demo-create');
		assert((await state()).totalCount === '4', 'totalCount becomes 4');
		const list = await records();
		assert(same(list, SEED.concat(['#4 — New record #4 (Draft, v1)'])), 'new record #4 "New record #4" (Draft, v1) appended');
		await waitLog('ln-data-store:confirmed', 1);
		const lines = await logLines();
		const created = lines.findIndex(l => l.includes('ln-data-store:created'));
		const confirmed = lines.findIndex(l => l.includes('ln-data-store:confirmed'));
		assert(created >= 0 && created < confirmed, 'log has created before confirmed');
		assert(lines[confirmed].includes('"action":"create"'), 'confirmed line carries action "create"');
		const ev = await page.evaluate(() => window.__events);
		assert(ev.length === 2 && ev[0].name === 'created' && ev[1].name === 'confirmed',
			'created then confirmed events bubble to document');
		assert(ev[0].detail.tempId === 4 && ev[0].detail.record.title === 'New record #4' && ev[0].detail.record.status === 'Draft',
			'created detail: { tempId: 4, record: { title, status "Draft" } }');
		assert(ev[1].detail.action === 'create' && ev[1].detail.record.id === 4, 'confirmed detail: { action "create", record.id 4 }');
		await click('demo-create');
		assert((await state()).totalCount === '5', 'second create: totalCount 5');
		assert((await records())[4] === '#5 — New record #5 (Draft, v1)', 'second record gets the next id #5');
	});

	await section('Update first record', async () => {
		await load();
		await click('demo-update');
		const list = await records();
		assert(list[0] === '#1 — ISO 27001 Policy (edited) (Approved, v2)', 'first record title gets " (edited)" and version 2');
		assert(same(list.slice(1), SEED.slice(1)), 'other records unchanged');
		assert((await state()).totalCount === '3', 'totalCount unchanged (3)');
		await waitLog('ln-data-store:confirmed', 1);
		const lines = await logLines();
		const updated = lines.findIndex(l => l.includes('ln-data-store:updated'));
		const confirmed = lines.findIndex(l => l.includes('ln-data-store:confirmed'));
		assert(updated >= 0 && updated < confirmed, 'log has updated before confirmed');
		await click('demo-update');
		assert((await records())[0] === '#1 — ISO 27001 Policy (edited) (edited) (Approved, v3)', 'second update stacks: version 3, title edited twice');
	});

	await section('Delete first record', async () => {
		await load();
		await click('demo-delete');
		assert(same(await records(), SEED.slice(1)), 'record #1 removed, #2 and #3 remain');
		assert((await state()).totalCount === '2', 'totalCount becomes 2');
		await waitLog('ln-data-store:confirmed', 1);
		const lines = await logLines();
		const deleted = lines.findIndex(l => l.includes('ln-data-store:deleted'));
		const confirmed = lines.findIndex(l => l.includes('ln-data-store:confirmed'));
		assert(deleted >= 0 && deleted < confirmed, 'log has deleted before confirmed');
		assert(/ln-data-store:deleted {2}\{"id":1\}$/.test(lines[deleted]), 'deleted line carries {"id":1}');
		assert(lines[confirmed].includes('"id":1') && lines[confirmed].includes('"action":"delete"'), 'confirmed line carries id 1 and action "delete"');
	});

	await section('Empty store: placeholder and warnings', async () => {
		await load();
		for (let i = 0; i < 3; i++) await click('demo-delete');
		assert((await state()).totalCount === '0', 'totalCount 0 after deleting all three');
		assert(same(await records(), ['(no records)']), 'records list shows the "(no records)" placeholder');
		await click('demo-delete');
		await click('demo-update');
		const lines = await logLines();
		assert(lines.some(l => /\] WARN {2}No records to delete$/.test(l)), 'delete on empty logs "WARN  No records to delete"');
		assert(lines.some(l => /\] WARN {2}No records to update$/.test(l)), 'update on empty logs "WARN  No records to update"');
		assert((await state()).totalCount === '0', 'totalCount stays 0');
		await click('demo-create');
		assert(same(await records(), ['#4 — New record #4 (Draft, v1)']), 'create after emptying continues ids (#4) and replaces the placeholder');
	});

	await section('Clear log', async () => {
		await load();
		assert((await logLines()).length > 0, 'log is non-empty before clearing');
		await click('demo-clear-log');
		assert((await logLines()).length === 0, 'clear log empties the event log');
		assert(same(await records(), SEED), 'records are untouched by clearing the log');
		await click('demo-create');
		assert(await countLog('ln-data-store:created') === 1, 'log accepts new lines after clearing');
	});

	await section('Online / offline indicators', async () => {
		await load();
		const flags = () => page.evaluate(() => ({
			online: document.getElementById('store-online-indicator').classList.contains('hidden'),
			offline: document.getElementById('store-offline-indicator').classList.contains('hidden')
		}));
		let f = await flags();
		assert(f.online && f.offline, 'both indicators start with class "hidden"');
		await page.evaluate(() => document.dispatchEvent(new CustomEvent('ln-data-store:offline')));
		f = await flags();
		assert(f.offline === false && f.online === true, 'ln-data-store:offline reveals the offline indicator, hides the online one');
		await page.evaluate(() => document.dispatchEvent(new CustomEvent('ln-data-store:online')));
		f = await flags();
		assert(f.online === false && f.offline === true, 'ln-data-store:online reveals the online indicator, hides the offline one');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
