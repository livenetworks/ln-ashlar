import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/couchdb-connector.html,
// demo/admin/src/mock-couchdb-connector.js (the fetch interceptor + trigger wiring)
// and components/ln-couchdb-connector/src/ln-couchdb-connector.js.
// The page has no real CouchDB: the mock answers every request to
// couch.livenetworks.com. Mock DB seed: task_1, task_2, task_3 (all rev 1-abc/def/ghi).

const PAGE_URL = BASE_URL + 'couchdb-connector.html';
const CONNECTOR = '#demo-couchdb-connector';
const EVENT_NAMES = ['config-changed', 'fetched', 'created', 'updated', 'deleted', 'bulk-deleted', 'error'];

run('demo/admin/couchdb-connector.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction(() => {
			const el = document.querySelector('#demo-couchdb-connector');
			const log = document.getElementById('api-event-log');
			return !!(el && el.lnCouchDbConnector && log && log.textContent.includes('CouchDB Gateway Connector initialized'));
		}, { timeout: 10000 });
		// Record every connector event (JSON-cloned detail) from here on.
		await page.evaluate((sel, names) => {
			window.__events = [];
			const el = document.querySelector(sel);
			names.forEach(n => el.addEventListener('ln-couchdb-connector:' + n, e => {
				window.__events.push({ name: n, detail: JSON.parse(JSON.stringify(e.detail)) });
			}));
		}, CONNECTOR, EVENT_NAMES);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const clearEvents = () => page.evaluate(() => { window.__events = []; });

	const setValue = (sel, value) => page.$eval(sel, (el, v) => { el.value = v; }, value);

	const setChecked = async (sel, checked) => {
		const current = await page.$eval(sel, el => el.checked);
		if (current !== checked) await page.click(sel);
	};

	// Clicks a trigger button and returns the first connector event named `name`.
	async function fire(buttonSel, name) {
		await clearEvents();
		await page.click(buttonSel);
		await page.waitForFunction(n => window.__events.some(e => e.name === n), { timeout: 5000 }, name);
		return page.evaluate(n => window.__events.find(e => e.name === n).detail, name);
	}

	const logText = () => page.$eval('#api-event-log', el => el.textContent);

	// ─── Mounting ──────────────────────────────────────────────
	section('Mount and initial telemetry');
	await load();
	const mounted = await page.evaluate(sel => {
		const i = document.querySelector(sel).lnCouchDbConnector;
		return { url: i.url, db: i.db, auth: i.auth, ns: i.namespace };
	}, CONNECTOR);
	assert(mounted.url === 'https://couch.livenetworks.com', 'Instance url read from data-ln-couchdb-url');
	assert(mounted.db === 'tasks', 'Instance db read from data-ln-couchdb-db');
	assert(mounted.auth === 'Basic dXNlcjpwYXNz', 'Instance auth read from data-ln-couchdb-auth');
	assert(mounted.ns === 'ln-couchdb-connector', 'Instance namespace is ln-couchdb-connector');

	// ─── Changes feed ──────────────────────────────────────────
	section('Changes feed sync (request-sync)');
	await load();
	let d = await fire('#btn-fetch', 'fetched');
	assert(Array.isArray(d.data.data) && d.data.data.length === 3, 'fetched carries 3 seeded documents');
	assert(d.data.data.map(r => r.id).join(',') === 'task_1,task_2,task_3', 'fetched record ids are task_1,task_2,task_3');
	assert(d.data.data.every(r => r.id === r._id), 'Every fetched record maps _id to id');
	assert(d.data.data[0].title === 'Setup CouchDB Sync Gateway', 'First fetched record keeps its title');
	assert(Array.isArray(d.data.deleted) && d.data.deleted.length === 0, 'fetched reports no deleted ids');
	assert(d.data.synced_at === '2-def', 'synced_at is the feed last_seq');
	assert(d.since === undefined, 'No since token when the input is empty');
	let log = await logText();
	assert(log.includes('GET Request -> https://couch.livenetworks.com/tasks/_changes?include_docs=true&feed=normal'), 'Telemetry shows the _changes URL built from url + db');
	assert(!log.includes('since='), 'No since query param without a token');

	await setValue('#trig-since', '1-abc');
	d = await fire('#btn-fetch', 'fetched');
	assert(d.since === '1-abc', 'fetched echoes the since token');
	log = await logText();
	assert(log.includes('_changes?include_docs=true&feed=normal&since=1-abc'), 'since token is appended to the _changes URL');

	// ─── Create ────────────────────────────────────────────────
	section('Create document (request-create)');
	await load();
	d = await fire('#btn-create', 'created');
	assert(d.record.title === 'Setup CouchDB gateway sync', 'created record carries the typed title');
	assert(d.record.priority === 'High', 'created record carries priority from the request');
	assert(/^task_\d+$/.test(d.record.id) && d.record.id === d.record._id, 'created record id equals _id (assigned by server)');
	assert(/^1-new\d+$/.test(d.record._rev), 'created record carries the server _rev');
	assert(d.tempId === 'temp_couch_54321', 'created echoes tempId');
	log = await logText();
	assert(log.includes('POST Request -> https://couch.livenetworks.com/tasks'), 'Telemetry shows POST to url/db');

	// ─── Update ────────────────────────────────────────────────
	section('Update document (request-update)');
	await load();
	d = await fire('#btn-update', 'error');
	assert(d.action === 'update' && d.status === 409 && d.error === 'Conflict', 'Forced 409 yields error {action: update, status: 409, error: Conflict}');
	assert(d.id === 'task_101', 'Conflict error carries the doc id');
	assert(d.conflictData.error === 'conflict' && d.data.error === 'conflict', 'Conflict error carries server body in data and conflictData');

	await setChecked('#trig-update-conflict', false);
	d = await fire('#btn-update', 'updated');
	assert(d.id === 'task_101', 'updated echoes the doc id');
	assert(d.record.title === 'Setup CouchDB gateway sync (completed)', 'updated record carries the new title');
	assert(/^1-rev\d+$/.test(d.record._rev), 'updated record carries the new server _rev');
	log = await logText();
	assert(log.includes('PUT Request -> https://couch.livenetworks.com/tasks/task_101'), 'Telemetry shows PUT to url/db/id');

	// The successful update above stored task_101 in the mock DB, so use an id it never saw.
	await setChecked('#trig-update-has-rev', false);
	await setValue('#trig-update-id', 'task_999');
	d = await fire('#btn-update', 'error');
	assert(d.action === 'update' && d.error === 'Could not retrieve document for revision mapping', 'Missing rev on an unknown doc fails the revision lookup');

	await setValue('#trig-update-id', 'task_1');
	d = await fire('#btn-update', 'updated');
	assert(d.id === 'task_1' && /^2-rev\d+$/.test(d.record._rev), 'Missing rev on a known doc is auto-fetched (1-abc) and the update succeeds with rev 2-');
	log = await logText();
	assert(log.includes('GET Request -> https://couch.livenetworks.com/tasks/task_1'), 'Telemetry shows the revision GET');

	// ─── Delete ────────────────────────────────────────────────
	section('Delete document (request-delete)');
	await load();
	d = await fire('#btn-delete', 'error');
	assert(d.action === 'delete' && d.error === 'Could not retrieve document for revision delete', 'Blank rev on an unknown doc fails the revision lookup');

	await setValue('#trig-delete-id', 'task_1');
	d = await fire('#btn-delete', 'deleted');
	assert(d.id === 'task_1' && d.response.ok === true && d.response.rev === '3-del', 'Blank rev on a known doc is auto-fetched and delete succeeds');
	log = await logText();
	assert(log.includes('DELETE Request -> https://couch.livenetworks.com/tasks/task_1?rev=1-abc'), 'DELETE URL carries the auto-fetched rev');

	await setValue('#trig-delete-id', 'task_101');
	await setValue('#trig-delete-rev', '1-x');
	d = await fire('#btn-delete', 'deleted');
	assert(d.id === 'task_101' && d.response.ok === true, 'Explicit rev skips the lookup and delete succeeds');
	log = await logText();
	assert(log.includes('DELETE Request -> https://couch.livenetworks.com/tasks/task_101?rev=1-x'), 'DELETE URL carries the explicit rev');

	// ─── Bulk delete ───────────────────────────────────────────
	section('Bulk delete (request-bulk-delete)');
	await load();
	d = await fire('#btn-bulk', 'bulk-deleted');
	assert(d.ids.join(',') === 'task_1,task_2,task_3', 'bulk-deleted echoes the requested ids');
	assert(d.response.ok === true && d.response.deletedCount === 3, 'Three existing docs are deleted');
	assert(Array.isArray(d.response.results) && d.response.results.length === 3, 'Server results list has 3 entries');
	log = await logText();
	assert(log.includes('/tasks/_all_docs') && log.includes('/tasks/_bulk_docs'), 'Bulk flow hits _all_docs then _bulk_docs');

	await setValue('#trig-bulk-ids', 'nope_1');
	d = await fire('#btn-bulk', 'bulk-deleted');
	assert(d.response.ok === true && d.response.deletedCount === 0, 'Unknown ids delete nothing (deletedCount 0)');

	// ─── Dynamic config ────────────────────────────────────────
	section('Dynamic attribute mutation (config-changed)');
	await load();
	await clearEvents();
	await setValue('#cfg-couchdb-url', 'https://couch2.livenetworks.com');
	await setValue('#cfg-couchdb-db', 'tasks2');
	await page.click('#config-form button[type="submit"]');
	await page.waitForFunction(() => window.__events.some(e => e.name === 'config-changed'
		&& e.detail.url === 'https://couch2.livenetworks.com' && e.detail.db === 'tasks2'
		&& e.detail.headers && e.detail.headers['X-Custom-Header'] === 'AshlarClient'), { timeout: 5000 });
	const cfg = await page.evaluate(sel => {
		const el = document.querySelector(sel);
		const i = el.lnCouchDbConnector;
		const last = window.__events.filter(e => e.name === 'config-changed').pop().detail;
		return {
			attrUrl: el.getAttribute('data-ln-couchdb-url'),
			attrDb: el.getAttribute('data-ln-couchdb-db'),
			attrHeaders: el.getAttribute('data-ln-couchdb-headers'),
			url: i.url, db: i.db, auth: i.auth, headers: i.headers, last
		};
	}, CONNECTOR);
	assert(cfg.attrUrl === 'https://couch2.livenetworks.com' && cfg.attrDb === 'tasks2', 'Form writes the new url and db onto the element');
	assert(cfg.attrHeaders === '{"X-Custom-Header": "AshlarClient"}', 'Form writes the headers JSON onto the element');
	assert(cfg.url === 'https://couch2.livenetworks.com' && cfg.db === 'tasks2', 'Instance url and db follow the attributes');
	assert(cfg.headers['X-Custom-Header'] === 'AshlarClient', 'Instance headers are parsed from the JSON attribute');
	assert(cfg.last.auth === '[REDACTED]', 'config-changed redacts the auth value');
	assert(cfg.auth === 'Basic dXNlcjpwYXNz', 'Instance still holds the real auth value');

	await clearEvents();
	await setValue('#cfg-couchdb-auth', '');
	await page.click('#config-form button[type="submit"]');
	await page.waitForFunction(() => window.__events.some(e => e.name === 'config-changed' && e.detail.auth === ''), { timeout: 5000 });
	assert(true, 'Clearing the auth input yields config-changed with empty auth');

	// ─── Requests use the new config ───────────────────────────
	section('Requests follow the mutated config');
	await load();
	await setValue('#cfg-couchdb-db', 'tasks2');
	await clearEvents();
	await page.click('#config-form button[type="submit"]');
	await page.waitForFunction(() => window.__events.some(e => e.name === 'config-changed' && e.detail.db === 'tasks2'), { timeout: 5000 });
	d = await fire('#btn-fetch', 'fetched');
	assert(d.data.data.length === 3, 'Sync still resolves after the db changes');
	log = await logText();
	assert(log.includes('https://couch.livenetworks.com/tasks2/_changes?'), 'Sync URL uses the mutated db name');

	// ─── Clear telemetry ───────────────────────────────────────
	section('Clear telemetry');
	assert((await logText()).length > 0, 'Telemetry log has content before clearing');
	await page.click('#btn-clear-log');
	await page.waitForFunction(() => document.getElementById('api-event-log').childElementCount === 0, { timeout: 5000 });
	assert((await logText()) === '', 'Clear Telemetry empties the log');
});
