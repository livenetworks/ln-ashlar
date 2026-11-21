import { run, assert, BASE_URL } from './_harness.mjs';

// Windowed ln-table (data-ln-table-window). A store-less coordinator + api connector + windowed table are
// injected at runtime into a quiet admin page (technique of coordinator.mjs section 10); no page is edited.
// Backend: demo/admin/data/api.php (10000 documents; offset/limit/search/sort_field/sort_dir; { data, total, filtered }).

const PAGE_URL = BASE_URL + 'table.html';
const API_URL = BASE_URL + 'data/api.php';
const TABLE = '#win-table';
const HOST = '#win-coordinator';
const WINDOW = 400;
const PAGE = 100;
const GRAND_TOTAL = 10000;

run('windowed ln-table (data-ln-table-window)', async ({ page }) => {

	const net = [];
	page.on('request', req => {
		if (req.url().includes('api.php')) net.push(new URL(req.url()));
	});

	const failures = [];
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	const wait = (fn, arg, timeout = 15000) => page.waitForFunction(fn, { timeout }, arg).then(() => true, () => false);
	const reqs = () => page.evaluate(() => window.__reqs.slice());
	const ids = () => page.evaluate(sel => Array.from(document.querySelectorAll(sel + ' tbody tr[data-ln-table-row]'))
		.map(tr => Number(tr.getAttribute('data-ln-table-row-id'))), TABLE);
	const placeholders = () => page.evaluate(sel => document.querySelectorAll(sel + ' tbody tr.ln-table__placeholder').length, TABLE);
	const label = id => page.evaluate(sel => document.querySelector(sel).textContent, id);
	const scrollFraction = f => page.evaluate(sel => {
		const el = document.querySelector(sel);
		return el.scrollHeight;
	}, TABLE).then(h => page.evaluate((sel, top) => { document.querySelector(sel).scrollTop = top; }, TABLE, Math.floor(h * f)));
	const settled = () => wait(sel => {
		const t = document.querySelector(sel);
		return t && !t.classList.contains('ln-table--loading')
			&& t.querySelectorAll('tbody tr[data-ln-table-row]').length > 0
			&& t.querySelectorAll('tbody tr.ln-table__placeholder').length === 0;
	}, TABLE);
	const setCoord = (name, value) => page.evaluate((sel, n, v) => {
		const h = document.querySelector(sel);
		if (v === null) h.removeAttribute(n); else h.setAttribute(n, v);
	}, HOST, name, value);
	const apiJson = async qs => (await (await fetch(`${API_URL}?${qs}`)).json());

	async function load() {
		net.length = 0;
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => {
			window.__reqs = [];
			window.__empty = [];
			document.addEventListener('ln-table:request-data', e => {
				if (e.target.id !== 'win-table') return;
				const t = e.target;
				window.__reqs.push(Object.assign({}, e.detail, {
					loading: t.classList.contains('ln-table--loading'),
					rows: t.querySelectorAll('tbody tr[data-ln-table-row]').length,
					placeholders: t.querySelectorAll('tbody tr.ln-table__placeholder').length
				}));
			});
			document.addEventListener('ln-table:empty', e => {
				if (e.target.id === 'win-table') window.__empty.push(e.detail);
			});
			const host = document.createElement('div');
			host.id = 'win-coordinator';
			host.setAttribute('data-ln-data-coordinator', 'wintbl');
			host.innerHTML = '<div data-ln-api-connector data-ln-api-base-url="data" data-ln-api-path="/api.php" data-ln-api-connector-query-debounce="0"></div>';
			document.body.append(host);
		});
		await page.waitForFunction(() => {
			const h = document.getElementById('win-coordinator');
			return !!(h && h.lnDataCoordinator && h.firstElementChild.lnApiConnector);
		}, { timeout: 10000 });
		await page.evaluate((win, pg) => {
			const t = document.createElement('section');
			t.id = 'win-table';
			t.setAttribute('data-ln-table', 'wintbl');
			t.setAttribute('data-ln-table-source', 'wintbl');
			t.setAttribute('data-ln-table-selectable', '');
			t.setAttribute('data-ln-table-window', String(win));
			t.setAttribute('data-ln-table-window-page', String(pg));
			t.setAttribute('data-ln-table-window-threshold', '10');
			t.style.cssText = 'max-height:400px;overflow-y:auto';
			t.innerHTML = '<table><thead><tr><th data-ln-table-col-select></th><th data-ln-table-col="title">Title</th><th data-ln-table-col="department">Department</th></tr></thead>'
				+ '<tbody data-ln-table-body></tbody></table>'
				+ '<footer><span class="hidden"><span data-ln-table-filtered></span> / </span><span data-ln-table-total></span> items'
				+ ' <span class="hidden"><span data-ln-table-selected></span> selected</span></footer>'
				+ '<template data-ln-template="wintbl-row"><tr data-ln-table-row><td><input type="checkbox" data-ln-table-row-select></td><td>{{ title }}</td><td>{{ department }}</td></tr></template>';
			document.body.append(t);
		}, WINDOW, PAGE);
		await settled();
	}

	await section('Initial window fetch', async () => {
		await load();
		const r = await reqs();
		assert(r.length >= 1 && r[0].offset === 0 && r[0].limit === PAGE && r[0].queryGen === 0 && r[0].table === 'wintbl',
			`first request-data is page 0: offset 0, limit ${PAGE}, queryGen 0`);
		assert(net.some(u => u.searchParams.get('offset') === '0' && u.searchParams.get('limit') === String(PAGE)), 'api.php received offset=0&limit=' + PAGE);
		assert((await label('#win-table [data-ln-table-total]')) === String(GRAND_TOTAL), `total label = ${GRAND_TOTAL}`);
		const list = await ids();
		assert(list.length > 0 && list.length < PAGE && list[0] === 1, 'a bounded slice of rows is in the DOM, first id 1');
		assert(list.every((id, i) => i === 0 || id === list[i - 1] + 1), 'ids consecutive in server order');
		const geo = await page.evaluate(sel => {
			const el = document.querySelector(sel);
			return { scroll: el.scrollHeight, client: el.clientHeight, spacer: el.querySelectorAll('tbody tr.ln-table__spacer').length, busy: el.getAttribute('aria-busy') };
		}, TABLE);
		assert(geo.spacer >= 1 && geo.scroll > geo.client * 10, 'bottom spacer gives the full virtual height');
		assert(geo.busy !== 'true', 'aria-busy cleared');
	});

	await section('Scroll fetches page-aligned slices; placeholders then rows', async () => {
		await load();
		const before = (await reqs()).length;
		await scrollFraction(0.5);
		assert(await wait(() => document.querySelectorAll('#win-table tbody tr.ln-table__placeholder').length > 0, null, 3000), 'placeholder rows render while the page is out');
		assert(await wait(n => window.__reqs.length > n, before), 'scrolling past the resident rows triggers a request');
		const fresh = (await reqs()).slice(before);
		assert(fresh.every(q => q.offset > 0 && q.offset % PAGE === 0 && q.limit === PAGE && q.queryGen === 0), `requests are page-aligned (offset multiple of ${PAGE}, limit ${PAGE})`);
		assert(await settled(), 'placeholders replaced by rows');
		const list = await ids();
		assert(list[0] > 1000, 'rows are from the scrolled region');
		assert(list.every((id, i) => i === 0 || id === list[i - 1] + 1), 'ids consecutive');
		assert(await page.evaluate(sel => document.querySelector(sel + ' tbody').firstElementChild.classList.contains('ln-table__spacer'), TABLE), 'top spacer holds the skipped rows');
		assert((await label('#win-table [data-ln-table-total]')) === String(GRAND_TOTAL), 'total unchanged while scrolling');
	});

	await section('Eviction keeps the resident window bounded', async () => {
		await load();
		for (const f of [0.1, 0.3, 0.6, 0.9]) {
			await scrollFraction(f);
			await settled();
		}
		const size = await page.evaluate(sel => document.querySelector(sel).lnTable._cache.size, TABLE);
		assert(size <= WINDOW, `resident rows (${size}) <= data-ln-table-window (${WINDOW})`);
		const before = (await reqs()).length;
		await scrollFraction(0);
		assert(await wait(n => window.__reqs.length > n && window.__reqs.slice(n).some(q => q.offset === 0), before), 'page 0 is re-requested after it was evicted');
		assert(await settled(), 'top rows render again');
		assert((await ids())[0] === 1, 'first row is id 1 again');
	});

	await section('Sort via coordinator: stale rows stay, queryGen bumps, page 0 restarts', async () => {
		await load();
		const prevGen = Math.max(...(await reqs()).map(q => q.queryGen));
		await setCoord('data-ln-data-coordinator-sort-field', 'title');
		await setCoord('data-ln-data-coordinator-sort-direction', 'asc');
		assert(await wait(g => window.__reqs.some(q => q.queryGen > g), prevGen), 'a request with a newer queryGen was emitted');
		const q = (await reqs()).filter(x => x.queryGen > prevGen)[0];
		assert(q.offset === 0, 'a new query restarts the window at offset 0');
		assert(q.loading === true && q.rows > 0 && q.placeholders === 0, 'at request time old rows are still shown with ln-table--loading (stale-while-revalidate)');
		assert(net.some(u => u.searchParams.get('sort_field') === 'title' && u.searchParams.get('sort_dir') === 'asc' && u.searchParams.get('offset') === '0'), 'api.php received the composed sort');
		assert(await settled(), 'new result rendered, loading cleared');
		const expected = (await apiJson('limit=1&sort_field=title&sort_dir=asc')).data[0].title;
		const first = await page.evaluate(sel => document.querySelector(sel + ' tbody tr[data-ln-table-row]').cells[1].textContent.trim(), TABLE);
		assert(first === expected, `first row is the server's first title ("${expected}")`);
	});

	await section('A response from a superseded query generation is dropped', async () => {
		await load();
		await setCoord('data-ln-data-coordinator-sort-field', 'title');
		await setCoord('data-ln-data-coordinator-sort-direction', 'asc');
		await settled();
		await page.evaluate(sel => document.querySelector(sel).dispatchEvent(new CustomEvent('ln-table:set-data', {
			bubbles: true, detail: { data: [{ id: 999999, title: 'STALE', department: 'x' }], total: 1, filtered: 1, offset: 0, queryGen: 0 }
		})), TABLE);
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
		assert(!(await ids()).includes(999999), 'stale set-data (queryGen 0) did not reach the DOM');
		assert((await label('#win-table [data-ln-table-total]')) === String(GRAND_TOTAL), 'total unchanged by the stale response');
	});

	await section('Search via coordinator: filtered count, empty state', async () => {
		await load();
		const expected = (await apiJson('limit=1&search=' + encodeURIComponent('security policy'))).filtered;
		await setCoord('data-ln-data-coordinator-search', 'security policy');
		assert(await wait(n => document.querySelector('#win-table [data-ln-table-filtered]').textContent === String(n), expected), `filtered label = ${expected}`);
		assert(await page.evaluate(() => !document.querySelector('#win-table [data-ln-table-filtered]').parentElement.classList.contains('hidden')), 'filtered wrap shown');
		assert((await label('#win-table [data-ln-table-total]')) === String(GRAND_TOTAL), 'total unchanged');
		assert(net.some(u => u.searchParams.get('search') === 'security policy' && u.searchParams.get('offset') === '0'), 'api.php received the search at offset 0');
		await settled();
		const titles = await page.evaluate(sel => Array.from(document.querySelectorAll(sel + ' tbody tr[data-ln-table-row]')).map(tr => tr.cells[1].textContent.toLowerCase()), TABLE);
		assert(titles.length > 0 && titles.every(t => t.includes('security policy')), 'every rendered row matches');
		await setCoord('data-ln-data-coordinator-search', 'zzzzqq');
		assert(await wait(() => window.__empty.length > 0), 'ln-table:empty emitted for a zero-result query');
		assert((await page.evaluate(() => window.__empty[window.__empty.length - 1].total)) === GRAND_TOTAL, 'empty detail.total = grand total');
		assert((await ids()).length === 0, 'no rows rendered');
	});

	await section('Revalidate keeps rows and re-requests the current page', async () => {
		await load();
		await scrollFraction(0.5);
		await settled();
		const before = await reqs();
		const gen = Math.max(...before.map(q => q.queryGen));
		await page.evaluate(sel => document.querySelector(sel).dispatchEvent(new CustomEvent('ln-table:request-revalidate', { bubbles: true, detail: {} })), TABLE);
		assert(await wait(n => window.__reqs.length > n, before.length), 'revalidate re-requests a page');
		const q = (await reqs())[before.length];
		assert(q.queryGen === gen + 1, 'queryGen bumped by one');
		assert(q.offset > 0 && q.offset % PAGE === 0, 'it is the page at the current scroll position, not page 0');
		assert(q.rows > 0 && q.placeholders === 0, 'rows stayed visible at request time');
		assert(await settled(), 'revalidated rows rendered');
	});

	await section('Selection survives eviction; select-all hidden', async () => {
		await load();
		assert(await page.evaluate(sel => document.querySelector(sel + ' [data-ln-table-col-select] input').hidden === true, TABLE), 'header select-all is hidden in windowed mode');
		await page.evaluate(sel => document.querySelector(sel + ' tbody tr[data-ln-table-row-id="1"] input[data-ln-table-row-select]').click(), TABLE);
		assert((await label('#win-table [data-ln-table-selected]')) === '1', 'selected count 1');
		for (const f of [0.3, 0.6, 0.9]) {
			await scrollFraction(f);
			await settled();
		}
		await scrollFraction(0);
		await settled();
		const checked = await page.evaluate(sel => {
			const tr = document.querySelector(sel + ' tbody tr[data-ln-table-row-id="1"]');
			return !!tr && tr.querySelector('input[data-ln-table-row-select]').checked && tr.classList.contains('ln-row-selected');
		}, TABLE);
		assert(checked, 'row 1 is still selected after its page was evicted and re-fetched');
		assert((await label('#win-table [data-ln-table-selected]')) === '1', 'selected count still 1');
	});

	await section('Live: removing then re-adding data-ln-table-window', async () => {
		await load();
		const before = (await reqs()).length;
		await page.evaluate(sel => document.querySelector(sel).removeAttribute('data-ln-table-window'), TABLE);
		assert(await wait(n => window.__reqs.length > n, before), 'removing the attribute re-issues request-data');
		const q = (await reqs())[before];
		assert(q.offset === undefined && q.limit === undefined, 'that request carries no offset/limit (non-windowed)');
		assert(await page.evaluate(sel => document.querySelector(sel + ' [data-ln-table-col-select] input').hidden === false, TABLE), 'select-all is visible again');
		assert(await wait(sel => !document.querySelector(sel).lnTable._windowed && document.querySelector(sel).lnTable._cache === null, TABLE), 'cache destroyed');
		assert(await wait(sel => document.querySelectorAll(sel + ' tbody tr[data-ln-table-row]').length > 0, TABLE, 30000), 'dense render of the full answer');
		const mark = (await reqs()).length;
		await page.evaluate((sel, w) => document.querySelector(sel).setAttribute('data-ln-table-window', String(w)), TABLE, WINDOW);
		assert(await wait(sel => document.querySelector(sel).lnTable._windowed === true, TABLE), 'window mode re-entered live');
		assert(await wait(n => window.__reqs.slice(n).some(x => x.offset === 0 && x.limit === 100), mark), 'page 0 requested after re-entering');
		assert(await settled(), 'rows render again');
		assert(await page.evaluate(sel => document.querySelector(sel).lnTable._cache.size, TABLE) <= WINDOW, 'resident rows bounded again');
	});

	await section('Two pages of one view requested back-to-back both land (no cross-cancel)', async () => {
		await load();
		await page.evaluate((sel, pg) => {
			const t = document.querySelector(sel);
			window.__sets = [];
			t.addEventListener('ln-table:set-data', e => window.__sets.push(e.detail.offset));
			[3000, 5000].forEach(offset => t.dispatchEvent(new CustomEvent('ln-table:request-data', { bubbles: true, detail: { offset, limit: pg, queryGen: 0 } })));
		}, TABLE, PAGE);
		assert(await wait(() => window.__sets.includes(3000) && window.__sets.includes(5000), null, 10000), 'both pages answered (offsets 3000 and 5000)');
		assert(await page.evaluate(sel => { const c = document.querySelector(sel).lnTable._cache; return c.has(3000) && c.has(5000); }, TABLE), 'both pages are resident in the window cache');
	});

	await section('A page that fails at the connector is released and re-requested', async () => {
		await load();
		await page.evaluate(sel => {
			window.__failedPages = [];
			window.__connErrors = [];
			document.querySelector(sel).addEventListener('ln-table:page-failed', e => window.__failedPages.push(e.detail.offset));
			document.addEventListener('ln-data-coordinator:error', e => window.__connErrors.push(e.detail.operation));
		}, TABLE);
		let failedOffset = null;
		const failOnce = req => {
			const u = new URL(req.url());
			const off = u.searchParams.get('offset');
			if (failedOffset === null && req.url().includes('api.php') && off !== null && off !== '0') {
				failedOffset = Number(off);
				req.respond({ status: 500, contentType: 'application/json', body: '{}' });
			} else {
				req.continue();
			}
		};
		await page.setRequestInterception(true);
		page.on('request', failOnce);
		try {
			await scrollFraction(0.5);
			assert(await wait(() => window.__failedPages.length > 0, null, 10000), 'ln-table:page-failed reached the table');
			assert((await page.evaluate(() => window.__failedPages[0])) === failedOffset, 'page-failed carries the failed page offset (' + failedOffset + ')');
			assert((await placeholders()) > 0, 'the failed page leaves placeholder rows');
			await scrollFraction(0.9);
			await settled();
			await scrollFraction(0.5);
			assert(await settled(), 'the released page is re-requested on the next pass and its rows render');
		} finally {
			page.off('request', failOnce);
			await page.setRequestInterception(false);
		}
	});

	await section('Removing the element destroys the instance', async () => {
		await load();
		await page.evaluate(sel => { window.__t = document.querySelector(sel); window.__t.remove(); }, TABLE);
		assert(await wait(() => !window.__t.lnTable), 'lnTable instance removed');
	});

	if (failures.length > 0) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
