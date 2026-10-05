import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/api-connector.html (#demo-api-connector,
// playground triggers, telemetry <pre>) and components/ln-api-connector/src/*.js.
// The connector talks to https://jsonplaceholder.typicode.com. That host is not reachable
// from the test, so every non-served request is answered by puppeteer request interception
// with a synthetic response. The test therefore verifies what the connector SENDS (method,
// URL, headers, body) and what it EMITS, not the real third-party API.

const PAGE_URL = BASE_URL + 'api-connector.html';
const API_ORIGIN = 'https://jsonplaceholder.typicode.com';
const NEW_API_ORIGIN = 'https://api.example.test';

const CORS = {
	'access-control-allow-origin': '*',
	'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
	'access-control-allow-headers': '*'
};

run('demo/admin/api-connector.html', async ({ page }) => {

	// ─── Network stub ──────────────────────────────────────────

	const requests = [];
	await page.setRequestInterception(true);
	page.on('request', req => {
		const url = req.url();
		if (url.startsWith('http://localhost')) {
			req.continue();
			return;
		}
		if (req.method() === 'OPTIONS') {
			req.respond({ status: 204, headers: CORS });
			return;
		}
		requests.push({
			method: req.method(),
			url,
			headers: req.headers(),
			body: req.postData() || null
		});
		const json = (status, statusText, body) => req.respond({
			status,
			headers: Object.assign({ 'content-type': 'application/json' }, CORS),
			body: JSON.stringify(body)
		});
		if (url.endsWith('/posts/99')) {
			json(404, 'Not Found', { message: 'Missing record' });
		} else if (req.method() === 'GET') {
			json(200, 'OK', [{ id: 1, title: 'stub' }]);
		} else if (req.method() === 'POST') {
			json(201, 'Created', { id: 101, title: 'ISO 27001 Manual' });
		} else if (req.method() === 'PUT') {
			json(200, 'OK', { id: 42, title: 'ISO 27001 v2 (edited)' });
		} else {
			json(200, 'OK', { message: 'Removed' });
		}
	});

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Waits for the connector instance, then records every ln-api-connector:* event
	// emitted on it into window.__events (name + detail).
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => {
			const el = document.getElementById('demo-api-connector');
			return !!(el && el.lnApiConnector);
		}, { timeout: 10000 });
		await page.evaluate(() => {
			window.__events = [];
			const el = document.getElementById('demo-api-connector');
			['config-changed', 'fetched', 'created', 'updated', 'deleted', 'bulk-deleted', 'error'].forEach(name => {
				el.addEventListener('ln-api-connector:' + name, e => {
					window.__events.push({ name, detail: JSON.parse(JSON.stringify(e.detail)) });
				});
			});
		});
		requests.length = 0;
	}

	async function waitEvent(name, count) {
		await page.waitForFunction((n, c) => window.__events.filter(e => e.name === n).length >= c,
			{ timeout: 5000 }, name, count);
		return page.evaluate(n => window.__events.filter(e => e.name === n).pop().detail, name);
	}

	const click = id => page.click('#' + id);

	async function setValue(id, value) {
		await page.$eval('#' + id, (el, v) => { el.value = v; }, value);
	}

	const logText = () => page.$eval('#api-event-log', el => el.textContent);

	const lastRequest = () => requests[requests.length - 1];

	// ─── 1. Mount + initial configuration ──────────────────────

	section('Mount and initial configuration');
	await load();

	const initial = await page.evaluate(() => {
		const el = document.getElementById('demo-api-connector');
		const inst = el.lnApiConnector;
		return { baseUrl: inst.baseUrl, path: inst.path, headers: inst.headers, namespace: inst.namespace, alias: el.lnConnector === inst };
	});
	assert(initial.baseUrl === API_ORIGIN, 'Instance baseUrl read from data-ln-api-base-url');
	assert(initial.path === '/posts', 'Instance path read from data-ln-api-path');
	assert(initial.headers['X-Test-Header'] === 'ln-ashlar-telemetry', 'Instance headers parsed from data-ln-api-headers JSON');
	assert(initial.namespace === 'ln-api-connector', 'Instance namespace is ln-api-connector');
	assert(initial.alias, 'el.lnConnector alias points to the same instance');

	const initialLog = await logText();
	assert(initialLog.includes('Component loaded. Instance registered. MutationObserver armed.'), 'Telemetry log shows the initial load line');

	// ─── 2. Delta fetch (GET) ──────────────────────────────────

	section('Delta fetch (GET)');
	await click('btn-fetch');
	let detail = await waitEvent('fetched', 1);
	let req = lastRequest();
	assert(req.method === 'GET', 'request-sync issues GET');
	assert(req.url === API_ORIGIN + '/posts', 'Without a since value the URL is baseUrl + path (' + req.url + ')');
	assert(req.headers['x-test-header'] === 'ln-ashlar-telemetry', 'Custom X-Test-Header is sent');
	assert(req.headers['accept'] === 'application/json', 'Accept defaults to application/json');
	assert(Array.isArray(detail.data) && detail.data.length === 1 && detail.data[0].id === 1, 'fetched event carries the parsed JSON body');
	assert(detail.meta === null, 'fetched event meta defaults to null');

	await setValue('trig-since', '1700000000');
	await click('btn-fetch');
	detail = await waitEvent('fetched', 2);
	req = lastRequest();
	assert(req.url === API_ORIGIN + '/posts?since=1700000000', 'A since value is appended as ?since= (' + req.url + ')');
	assert(detail.since === 1700000000, 'fetched event echoes the since value');

	// ─── 3. Create (POST) ──────────────────────────────────────

	section('Create (POST)');
	await click('btn-create');
	detail = await waitEvent('created', 1);
	req = lastRequest();
	assert(req.method === 'POST', 'request-create issues POST');
	assert(req.url === API_ORIGIN + '/posts', 'POST goes to baseUrl + path');
	assert(req.headers['content-type'] === 'application/json', 'Content-Type defaults to application/json');
	assert(JSON.stringify(JSON.parse(req.body)) === JSON.stringify({ title: 'ISO 27001 Manual', body: 'ln-ashlar local-first payload', userId: 1 }),
		'POST body is the detail.data JSON');
	assert(detail.record && detail.record.id === 101, 'created event record is the (unwrapped) response body');
	assert(detail.tempId === 'temp_12345', 'created event echoes tempId');
	assert(detail.message === null, 'created event message is null without an envelope message');

	// ─── 4. Update (PUT) ───────────────────────────────────────

	section('Update (PUT)');
	await click('btn-update');
	detail = await waitEvent('updated', 1);
	req = lastRequest();
	assert(req.method === 'PUT', 'request-update issues PUT');
	assert(req.url === API_ORIGIN + '/posts/42', 'PUT URL appends the id to baseUrl + path (' + req.url + ')');
	const putBody = JSON.parse(req.body);
	assert(putBody.title === 'ISO 27001 v2 (edited)' && putBody.body === 'updated body content', 'PUT body carries the data fields');
	assert(putBody.expected_version === 1, 'expected_version is merged into the PUT body');
	assert(detail.id === 42 && detail.record.id === 42, 'updated event carries id and record');

	// ─── 5. Delete (DELETE) ────────────────────────────────────

	section('Delete (DELETE)');
	await click('btn-delete');
	detail = await waitEvent('deleted', 1);
	req = lastRequest();
	assert(req.method === 'DELETE', 'request-delete issues DELETE');
	assert(req.url === API_ORIGIN + '/posts/42', 'DELETE URL appends the id (' + req.url + ')');
	assert(detail.id === 42, 'deleted event echoes the id');
	assert(detail.message === 'Removed', 'deleted event surfaces the response message');

	// ─── 6. Bulk delete ────────────────────────────────────────

	section('Bulk delete (DELETE)');
	await click('btn-bulk');
	detail = await waitEvent('bulk-deleted', 1);
	req = lastRequest();
	assert(req.method === 'DELETE', 'request-bulk-delete issues DELETE');
	assert(req.url === API_ORIGIN + '/posts/bulk-delete', 'Bulk URL is baseUrl + path + /bulk-delete (' + req.url + ')');
	assert(JSON.stringify(JSON.parse(req.body)) === JSON.stringify({ ids: [17, 23, 45] }), 'Bulk body is {ids:[17,23,45]} parsed from the input');
	assert(JSON.stringify(detail.ids) === JSON.stringify([17, 23, 45]), 'bulk-deleted event echoes the ids');

	// ─── 7. Error event ────────────────────────────────────────

	section('Error event');
	await setValue('trig-delete-id', '99');
	await click('btn-delete');
	detail = await waitEvent('error', 1);
	assert(detail.action === 'delete', 'error event reports action "delete"');
	assert(detail.status === 404, 'error event carries the HTTP status');
	assert(detail.error.startsWith('HTTP 404'), 'error message starts with "HTTP 404" (' + detail.error + ')');
	assert(detail.data && detail.data.message === 'Missing record', 'error event carries the parsed error body');
	assert(detail.id === 99, 'error event echoes the id');

	// ─── 8. Telemetry stream + clear ───────────────────────────

	section('Telemetry log');
	const log = await logText();
	assert(log.includes('ln-api-connector:request-sync'), 'Log records the dispatched request-sync (IN)');
	assert(log.includes('ln-api-connector:fetched'), 'Log records the fetched event (OUT)');
	assert(log.includes('ln-api-connector:created'), 'Log records the created event');
	assert(log.includes('ln-api-connector:updated'), 'Log records the updated event');
	assert(log.includes('ln-api-connector:bulk-deleted'), 'Log records the bulk-deleted event');
	assert(log.includes('ln-api-connector:error'), 'Log records the error event');

	await click('btn-clear-log');
	await page.waitForFunction(() => document.getElementById('api-event-log').childElementCount === 0, { timeout: 5000 });
	assert((await logText()) === '', 'Clear Telemetry empties the log');

	// ─── 9. Dynamic attribute mutation ─────────────────────────

	section('Dynamic configuration (MutationObserver)');
	await load();

	await setValue('cfg-base-url', NEW_API_ORIGIN);
	await setValue('cfg-path', '/comments');
	await setValue('cfg-headers', '{"X-Other": "v2"}');
	await page.click('#config-form button[type="submit"]');

	await page.waitForFunction(() => {
		const inst = document.getElementById('demo-api-connector').lnApiConnector;
		return inst.baseUrl === 'https://api.example.test' && inst.path === '/comments' && inst.headers['X-Other'] === 'v2';
	}, { timeout: 5000 });

	const el = await page.evaluate(() => {
		const dom = document.getElementById('demo-api-connector');
		return {
			baseAttr: dom.getAttribute('data-ln-api-base-url'),
			pathAttr: dom.getAttribute('data-ln-api-path'),
			headersAttr: dom.getAttribute('data-ln-api-headers'),
			lastConfig: window.__events.filter(e => e.name === 'config-changed').pop()
		};
	});
	assert(el.baseAttr === NEW_API_ORIGIN, 'Form submit writes data-ln-api-base-url');
	assert(el.pathAttr === '/comments', 'Form submit writes data-ln-api-path');
	assert(el.headersAttr === '{"X-Other": "v2"}', 'Form submit writes data-ln-api-headers');
	assert(!!el.lastConfig, 'config-changed event fired after the attribute mutation');
	assert(el.lastConfig.detail.baseUrl === NEW_API_ORIGIN && el.lastConfig.detail.path === '/comments'
		&& el.lastConfig.detail.headers['X-Other'] === 'v2', 'config-changed detail carries baseUrl, path and headers');

	const telemetry = await logText();
	assert(telemetry.includes('Mutating DOM attributes recursively to trigger MutationObserver'), 'Log records the IN line for the mutation');
	assert(telemetry.includes('ln-api-connector:config-changed'), 'Log records the config-changed event');

	await click('btn-fetch');
	await waitEvent('fetched', 1);
	req = lastRequest();
	assert(req.url === NEW_API_ORIGIN + '/comments', 'Next request uses the hot-reloaded base URL and path (' + req.url + ')');
	assert(req.headers['x-other'] === 'v2', 'Next request carries the hot-reloaded header');
	assert(req.headers['x-test-header'] === undefined, 'Old header is no longer sent');
});
