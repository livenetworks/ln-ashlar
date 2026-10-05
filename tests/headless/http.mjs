import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/http.html (live demos 1-6),
// demo/admin/src/mock-http.js (synthetic /api/* endpoints served by the page itself)
// and components/ln-http/src/ln-http.js (Path A fetch wrapper, Path B ln-http:request).

const PAGE_URL = BASE_URL + 'http.html';
const WRAPPED_FETCH = 'function fetch() { [ln-http wrapped] }';

run('demo/admin/http.html', async ({ page }) => {

	const failures = [];

	// ─── Helpers ───────────────────────────────────────────────

	// Runs one section; a failing assertion is recorded so later sections still run.
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => !!window.lnHttp && !!document.getElementById('demo2-list').children.length,
			{ timeout: 10000 });
	}

	const logText = id => page.evaluate(i => document.getElementById(i).textContent, id);

	// Waits until the log of `id` matches the regex source, then returns the log text.
	async function waitLog(id, source, timeout = 8000) {
		await page.waitForFunction((i, s) => new RegExp(s).test(document.getElementById(i).textContent),
			{ timeout }, id, source);
		return logText(id);
	}

	const countMatches = (text, re) => (text.match(re) || []).length;
	const click = sel => page.click(sel);
	const inflight = () => page.evaluate(() => window.lnHttp.inflight);

	async function waitInflight(predSource, label) {
		await page.waitForFunction(s => new Function('list', 'return (' + s + ')(list)')(window.lnHttp.inflight),
			{ timeout: 5000 }, predSource).catch(() => {});
		return inflight();
	}

	// ─── Library presence ──────────────────────────────────────

	await section('ln-http is installed over the mock fetch', async () => {
		await load();
		const info = await page.evaluate(() => ({
			api: typeof window.lnHttp,
			cancel: typeof window.lnHttp.cancel,
			cancelByKey: typeof window.lnHttp.cancelByKey,
			cancelAll: typeof window.lnHttp.cancelAll,
			destroy: typeof window.lnHttp.destroy,
			fetchSrc: window.fetch.toString(),
			mock: window.__demoHttpMockInstalled === true,
			inflight: window.lnHttp.inflight
		}));
		assert(info.api === 'object', 'window.lnHttp is an object');
		assert(info.cancel === 'function' && info.cancelByKey === 'function'
			&& info.cancelAll === 'function' && info.destroy === 'function', 'cancel / cancelByKey / cancelAll / destroy are functions');
		assert(info.mock, 'mock-http.js installed before ln-http (window.__demoHttpMockInstalled)');
		assert(info.fetchSrc === WRAPPED_FETCH, 'window.fetch is the ln-http wrapper');
		assert(Array.isArray(info.inflight) && info.inflight.length === 0, 'inflight is an empty array at load');
	});

	// ─── Demo 1: search-as-you-type (Path A) ───────────────────

	await section('Demo 1 — different URLs run independently, only latest query renders', async () => {
		await load();
		await page.focus('#demo1-input');
		await page.keyboard.type('mar');
		const log = await waitLog('demo1-log', 'resolved q="mar"');
		assert(countMatches(log, /fetch {2}\/api\/search\?q=/g) === 3, 'three keystrokes logged three fetches');
		assert(/fetch {2}\/api\/search\?q=m\n/.test(log) && /fetch {2}\/api\/search\?q=ma\n/.test(log)
			&& /fetch {2}\/api\/search\?q=mar\n/.test(log), 'fetch URLs are q=m, q=ma, q=mar');
		await page.waitForFunction(() => (document.getElementById('demo1-log').textContent.match(/resolved q=/g) || []).length === 3,
			{ timeout: 5000 });
		assert(countMatches(await logText('demo1-log'), /aborted q=/g) === 0, 'different URLs are not aborted');
		const items = await page.$$eval('#demo1-results li', els => els.map(e => e.textContent));
		assert(items.length === 1 && items[0] === 'Marko Petrovski — Engineering',
			`only the latest query renders: ["Marko Petrovski — Engineering"], got ${JSON.stringify(items)}`);

		// Clearing the input empties the results without a fetch.
		await page.focus('#demo1-input');
		for (let i = 0; i < 3; i++) await page.keyboard.press('Backspace');
		await page.waitForFunction(() => document.querySelectorAll('#demo1-results li').length === 0, { timeout: 3000 });
		assert((await page.$$('#demo1-results li')).length === 0, 'emptying the input clears the results');
	});

	await section('Demo 1 — same URL aborts the older request', async () => {
		await load();
		await page.focus('#demo1-input');
		await page.keyboard.type('a');
		await page.keyboard.press('Backspace');
		await page.keyboard.type('a');
		const log = await waitLog('demo1-log', 'aborted q="a" \\(superseded by newer keystroke\\)');
		assert(countMatches(log, /fetch {2}\/api\/search\?q=a\n/g) === 2, 'q=a fetched twice');
		await waitLog('demo1-log', 'resolved q="a"  matches=6');
		const after = await logText('demo1-log');
		assert(countMatches(after, /aborted q="a"/g) === 1, 'exactly one aborted entry');
		assert(countMatches(after, /resolved q="a"/g) === 1, 'exactly one resolved entry (older one aborted)');
		const items = await page.$$eval('#demo1-results li', els => els.length);
		assert(items === 6, `six employees contain "a", got ${items}`);
	});

	// ─── Demo 2: keyed POST (Path B) ───────────────────────────

	await section('Demo 2 — initial list and disabled edge buttons', async () => {
		await load();
		const rows = await page.$$eval('#demo2-list li', lis => lis.map(li => ({
			label: li.firstChild.textContent.trim(),
			upDisabled: li.querySelectorAll('button')[0].disabled,
			downDisabled: li.querySelectorAll('button')[1].disabled
		})));
		assert(rows.map(r => r.label).join('|') === 'Plan sprint|Review designs|Sync with backend|Update changelog', 'four todo items in source order');
		assert(rows[0].upDisabled && !rows[0].downDisabled, 'first item: Move up disabled, Move down enabled');
		assert(!rows[3].upDisabled && rows[3].downDisabled, 'last item: Move down disabled, Move up enabled');
	});

	await section('Demo 2 — rapid keyed POSTs collapse to one ln-http:response', async () => {
		await load();
		// Two clicks in the same task so the first request is still in flight.
		await page.evaluate(() => {
			document.querySelectorAll('#demo2-list li')[0].querySelectorAll('button')[1].click();
			document.querySelectorAll('#demo2-list li')[1].querySelectorAll('button')[1].click();
		});
		const log = await waitLog('demo2-log', 'response {2}status=200');
		assert(countMatches(log, /dispatch {2}POST \/api\/lists\/1\/reorder/g) === 2, 'two POST dispatches logged');
		assert(log.includes('ids=[2,1,3,4]  key=reorder-list-1') && log.includes('ids=[2,3,1,4]  key=reorder-list-1'),
			'dispatches carry ids [2,1,3,4] then [2,3,1,4] with key=reorder-list-1');
		assert(countMatches(log, /response {2}status=/g) === 1, 'only one ln-http:response (earlier request aborted)');
		assert(/order=\[2,3,1,4\]/.test(log), 'the surviving response is the latest order [2,3,1,4]');
		assert(!/error {2}/.test(log), 'no ln-http:error (abort is silent)');
		const labels = await page.$$eval('#demo2-list li', lis => lis.map(li => li.firstChild.textContent.trim()));
		assert(labels.join('|') === 'Review designs|Sync with backend|Plan sprint|Update changelog', 'list order reflects both moves');
	});

	// ─── Demo 3: independent POSTs ─────────────────────────────

	await section('Demo 3 — two POSTs both succeed, no dedup', async () => {
		await load();
		await click('#demo3-btn');
		const log = await waitLog('demo3-log', 'resolved {2}name=Ana Kovachevska[\\s\\S]*resolved {2}name=Marko Petrovski|resolved {2}name=Marko Petrovski[\\s\\S]*resolved {2}name=Ana Kovachevska');
		assert(countMatches(log, /fetch {2}POST \/api\/users {2}name=/g) === 2, 'two POST fetches logged');
		assert(/resolved {2}name=Ana Kovachevska {2}id=\d+ {2}status=201/.test(log), 'Ana Kovachevska resolved with status=201');
		assert(/resolved {2}name=Marko Petrovski {2}id=\d+ {2}status=201/.test(log), 'Marko Petrovski resolved with status=201');
		assert(!/rejected/.test(log), 'neither POST rejected');
	});

	// ─── Demo 4: cancel by URL (Path A) ────────────────────────

	await section('Demo 4 — cancel a slow GET by URL', async () => {
		await load();
		await click('#demo4-cancel');
		let log = await waitLog('demo4-log', 'lnHttp\\.cancel\\("/api/slow"\\) → false');
		assert(log.includes('lnHttp.cancel("/api/slow") → false'), 'cancel with nothing in flight returns false');

		await click('#demo4-start');
		const list = await waitInflight('l => l.some(e => e.url === "/api/slow")');
		assert(list.some(e => e.method === 'GET' && e.url === '/api/slow'), 'inflight shows { method: GET, url: /api/slow }');
		await click('#demo4-cancel');
		log = await waitLog('demo4-log', 'aborted {2}/api/slow \\(cancel button pressed\\)');
		assert(log.includes('lnHttp.cancel("/api/slow") → true'), 'cancel while in flight returns true');
		assert(!/resolved {2}/.test(log), 'the slow GET never resolves');
		const after = await inflight();
		assert(!after.some(e => e.url === '/api/slow'), 'inflight no longer lists /api/slow');
	});

	// ─── Demo 5: cancel by key (Path B) ────────────────────────

	await section('Demo 5 — keyed POST completes with ln-http:response', async () => {
		await load();
		await click('#demo5-start');
		const list = await waitInflight('l => l.some(e => e.key === "demo5-key")');
		assert(list.some(e => e.key === 'demo5-key'), 'inflight lists { key: demo5-key }');
		const log = await waitLog('demo5-log', 'ln-http:response {2}status=200 {2}savedAt=');
		assert(log.includes('dispatch  POST /api/lists/2/reorder  key=demo5-key'), 'dispatch logged');
		const after = await waitInflight('l => l.length === 0');
		assert(after.length === 0, 'inflight empty after the response');
	});

	await section('Demo 5 — cancelByKey aborts silently', async () => {
		await load();
		await click('#demo5-cancel');
		let log = await waitLog('demo5-log', 'lnHttp\\.cancelByKey\\("demo5-key"\\) → false');
		assert(log.includes('→ false'), 'cancelByKey with nothing in flight returns false');

		await click('#demo5-start');
		await waitInflight('l => l.some(e => e.key === "demo5-key")');
		await click('#demo5-cancel');
		log = await waitLog('demo5-log', 'lnHttp\\.cancelByKey\\("demo5-key"\\) → true');
		assert(log.includes('→ true  (no event will fire — silent abort)'), 'cancelByKey while in flight returns true');
		const after = await waitInflight('l => l.length === 0');
		assert(after.length === 0, 'aborted request leaves inflight (both maps)');
		log = await logText('demo5-log');
		assert(!/ln-http:response {2}status/.test(log) && !/ln-http:error/.test(log), 'no ln-http:response and no ln-http:error after abort');
	});

	// ─── Demo 6: inflight inspector ────────────────────────────

	const out6 = () => page.evaluate(() => JSON.parse(document.getElementById('demo6-out').textContent));

	async function waitOut6(predSource) {
		await page.waitForFunction(s => {
			try { return new Function('list', 'return (' + s + ')(list)')(JSON.parse(document.getElementById('demo6-out').textContent)); }
			catch (e) { return false; }
		}, { timeout: 5000 }, predSource).catch(() => {});
		return out6();
	}

	await section('Demo 6 — inspector mirrors lnHttp.inflight', async () => {
		await load();
		let list = await waitOut6('l => Array.isArray(l) && l.length === 0');
		assert(Array.isArray(list) && list.length === 0, 'readout starts as []');

		await click('#demo6-trigger-a');
		list = await waitOut6('l => l.length === 2');
		assert(list.length === 2
			&& list.some(e => e.method === 'GET' && e.url === '/api/slow')
			&& list.some(e => e.method === 'GET' && e.url === '/api/search?q=demo6'), 'two Path A entries: GET /api/slow and GET /api/search?q=demo6');

		await click('#demo6-cancel-all');
		list = await waitOut6('l => l.length === 0');
		assert(list.length === 0, 'Cancel all empties the readout');

		await click('#demo6-trigger-b');
		list = await waitOut6('l => l.length === 2');
		assert(list.length === 2
			&& list.some(e => e.method === 'GET' && e.url === '/api/slow')
			&& list.some(e => e.key === 'demo6-poll'), 'keyed GET appears in both maps: { GET /api/slow } and { key: demo6-poll }');

		await click('#demo6-cancel-all');
		list = await waitOut6('l => l.length === 0');
		assert(list.length === 0, 'Cancel all clears Path A and Path B entries');
	});

	// ─── ln-http vs ln-ajax table ──────────────────────────────

	await section('Comparison table structure', async () => {
		await load();
		const info = await page.evaluate(() => {
			const table = document.querySelector('.table-container table');
			return {
				heads: Array.from(table.tHead.rows[0].cells).map(c => c.textContent.trim()),
				rows: table.tBodies[0].rows.length
			};
		});
		assert(info.heads.join('|') === '|ln-http|ln-ajax', 'header columns: (blank), ln-http, ln-ajax');
		assert(info.rows === 10, `ten comparison rows, got ${info.rows}`);
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
