import { run, assert } from './_harness.mjs';

// Driven by the REAL components (ln-router, ln-nav, ln-data-store, ln-data-coordinator,
// ln-api-connector, ln-table, ln-table-coordinator, ln-search, ln-sort, ln-modal, ln-form,
// ln-fill, ln-options, ln-confirm, ln-toast) against the REAL mock backend
// demo/docuflow/api.php. Nothing is mocked or stubbed except one section that aborts the
// GET /api/packages request with Puppeteer request interception to reach the error region.
//
// Every fact below is read from demo/docuflow/index.html, demo/docuflow/app.js and the seed
// data in demo/docuflow/api.php. Statements tagged [source] assert what the source does where
// the visible behaviour or the prose around it differs.
//
// URL: demo/docuflow/index.html has no <base> and no data-ln-router-base, so the router sees
// the real pathname. The page is opened at <harness BASE_URL>../docuflow/index.html (localhost);
// the router reports ln-router:not-found for that pathname and app.js replaces it with "/".
// http://ln-ashlar.test/docuflow/ is the fallback. The first URL that mounts the router and
// both data stores is used and printed.
//
// The mock backend persists to demo/docuflow/data/db.json. Every section starts from
// GET api/reset and the run ends with a reset, so the seed state is restored.

const PACKAGES = ['Starter', 'Professional', 'Enterprise', 'Legacy'];
const TENANTS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/docuflow (ln-router + DocuFlow Admin views)', async ({ page, baseUrl }) => {

	const CANDIDATES = [
		new URL('../docuflow/index.html', baseUrl).href,
		'http://ln-ashlar.test/docuflow/'
	];

	let PAGE_URL = null;
	let ORIGIN = null;
	let RESET_URL = null;
	let ASSET_URL = null;

	// ─── Helpers ───────────────────────────────────────────────

	const failures = [];
	async function check(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  !! section failed: ${err.message}`);
		}
	}

	let requests = [];
	page.on('request', r => {
		if (r.method() !== 'GET') requests.push({ method: r.method(), url: r.url(), body: r.postData() });
	});

	const resetBackend = () => fetch(RESET_URL).then(r => {
		if (!r.ok) throw new Error('reset failed: HTTP ' + r.status);
	});

	// Drops IndexedDB + localStorage of the origin from a page that has no open store.
	// The mock never reports deletions, so stale cached records would survive a reset.
	async function clearClientState() {
		await page.goto(ASSET_URL, { waitUntil: 'load' });
		await page.evaluate(async () => {
			localStorage.clear();
			const dbs = await indexedDB.databases();
			await Promise.all(dbs.map(d => new Promise(resolve => {
				const req = indexedDB.deleteDatabase(d.name);
				req.onsuccess = req.onerror = req.onblocked = () => resolve();
			})));
		});
	}

	const waitBoot = () => page.waitForFunction(() => {
		if (!window.lnRouter) return false;
		const p = document.getElementById('packages');
		const t = document.getElementById('tenants');
		return !!(p && p.lnDataStore && p.lnDataStore.isLoaded && t && t.lnDataStore && t.lnDataStore.isLoaded);
	}, { timeout: 15000 });

	const waitPath = (path, timeout = 8000) => page.waitForFunction(
		p => window.lnRouter.current() && window.lnRouter.current().path === p, { timeout }, path);

	// Fresh backend + fresh client state, then open the app and (optionally) click through to a view.
	async function fresh(via = null) {
		await resetBackend();
		await clearClientState();
		requests = [];
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await waitBoot();
		await ensureRoute();
		if (via) {
			await clickNav(via.href, via.path);
		}
	}

	// [demo bug] On load the router reports ln-router:not-found one microtask after the bundle
	// runs, before app.js has attached its listener, so no route is ever mounted at boot (see
	// the "Boot: router mounts a route on load" section, which asserts that and fails). Every
	// other section starts from the same state a user reaches by clicking the sidebar:
	// lnRouter.navigate('/').
	async function ensureRoute() {
		const has = await page.evaluate(() => !!window.lnRouter.current());
		if (!has) {
			await page.evaluate(() => window.lnRouter.navigate('/'));
			await waitPath('/');
		}
	}

	const current = () => page.evaluate(() => ({
		path: window.lnRouter.current().path,
		pattern: window.lnRouter.current().route.pattern,
		title: document.title
	}));

	const navLink = href => 'nav[aria-label="Main navigation"] a[href="' + href + '"]';

	// Clicks only once the element is the topmost hit at its centre.
	async function click(selector) {
		await page.waitForFunction(s => {
			const e = document.querySelector(s);
			if (!e) return false;
			e.scrollIntoView({ block: 'center' });
			const r = e.getBoundingClientRect();
			const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
			return !!hit && e.contains(hit);
		}, { timeout: 8000 }, selector);
		await page.click(selector);
	}

	async function clickNav(href, expectedPath) {
		await click(navLink(href));
		await waitPath(expectedPath);
	}

	// Waits for a table's column texts to equal `expected`, then asserts.
	async function expectCol(tableId, col, expected, label) {
		await page.waitForFunction((id, c, exp) => {
			const rows = Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row]'));
			const texts = rows.map(tr => tr.cells[c].textContent.trim());
			return texts.length === exp.length && texts.every((n, i) => n === exp[i]);
		}, { timeout: 6000 }, tableId, col, expected).catch(() => {});
		const actual = await colTexts(tableId, col);
		assert(same(actual, expected), `${label}: expected [${expected.join(' | ')}], got [${actual.join(' | ')}]`);
	}

	const colTexts = (tableId, col) => page.evaluate((id, c) => Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row]'))
		.map(tr => tr.cells[c].textContent.trim()), tableId, col);

	const rowTexts = (tableId, upto) => page.evaluate((id, n) => Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row]'))
		.map(tr => Array.from(tr.cells).slice(0, n).map(c => c.textContent.replace(/\s+/g, ' ').trim()).join('|')), tableId, upto);

	// Text of selected cell indexes per row (decorator-derived columns excluded by callers).
	const cellTexts = (tableId, cols) => page.evaluate((id, cs) => Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row]'))
		.map(tr => cs.map(c => tr.cells[c].textContent.replace(/\s+/g, ' ').trim()).join('|')), tableId, cols);

	// [demo bug] index.html forms carry data-ln-form-scope, which no component reads; the
	// coordinator reads data-ln-data-coordinator-scope. The write-path sections set the real
	// attribute so the rest of the pipeline (coordinator -> store -> connector -> api.php ->
	// app.js modal close -> table refresh) is still covered. The "Write path" sections assert the
	// markup as authored and fail.
	const applyScope = (formId, scope) => page.evaluate((id, sc) => document.getElementById(id)
		.setAttribute('data-ln-data-coordinator-scope', sc), formId, scope);

	const footer = tableId => page.evaluate(id => {
		const t = document.getElementById(id);
		const filteredSpan = t.querySelector('[data-ln-table-filtered]');
		return {
			total: t.querySelector('[data-ln-table-total]').textContent.trim(),
			filtered: filteredSpan.textContent.trim(),
			filteredHidden: filteredSpan.parentElement.classList.contains('hidden')
		};
	}, tableId);

	const emptyState = tableId => page.evaluate(id => {
		const el = document.querySelector('#' + id + ' .ln-table__empty-state');
		return el ? el.querySelector('h3').textContent.trim() : null;
	}, tableId);

	const sortState = (tableId, field) => page.evaluate((id, f) => {
		const ul = document.querySelector('#' + id + ' ul[data-ln-sort-field="' + f + '"]');
		return { state: ul.getAttribute('data-ln-sort-state'), aria: ul.closest('th').getAttribute('aria-sort') };
	}, tableId, field);

	const clickSort = (tableId, field, dir) => page.evaluate((id, f, d) => {
		document.querySelector('#' + id + ' ul[data-ln-sort-field="' + f + '"] button[data-ln-sort-dir="' + d + '"]').click();
	}, tableId, field, dir);

	async function typeSearch(storeName, term) {
		const sel = 'input[data-ln-search-for="' + storeName + '"]';
		await page.focus(sel);
		await page.keyboard.type(term);
	}

	const clearSearch = storeName => page.evaluate(n => {
		document.querySelector('input[data-ln-search-for="' + n + '"]').closest('search')
			.querySelector('button[data-ln-search-clear]').click();
	}, storeName);

	const toasts = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-toast-item]'))
		.map(t => t.textContent.replace(/\s+/g, ' ').trim()));

	const modalState = id => page.evaluate(i => {
		const d = document.getElementById(i);
		return { open: d.open, attr: d.getAttribute('data-ln-modal'), mode: d.getAttribute('data-ln-modal-mode') };
	}, id);

	const waitModal = (id, open) => page.waitForFunction((i, o) => document.getElementById(i).open === o,
		{ timeout: 5000 }, id, open);

	const formValues = id => page.evaluate(i => Object.fromEntries(new FormData(document.getElementById(i))), id);

	async function setInput(selector, text) {
		await click(selector);
		await page.$eval(selector, e => e.select());
		await page.keyboard.press('Backspace');
		if (text !== '') await page.keyboard.type(text);
	}

	// Marks the row whose `col` text equals `name` and returns a selector for `inner` inside it.
	const rowSel = (tableId, name, col, inner) => page.evaluate((id, n, c, i) => {
		document.querySelectorAll('[data-test-row]').forEach(e => e.removeAttribute('data-test-row'));
		const tr = Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row]'))
			.find(t => t.cells[c].textContent.trim() === n);
		if (!tr) return null;
		tr.setAttribute('data-test-row', '1');
		return '[data-test-row] ' + i;
	}, tableId, name, col, inner);

	// Two-click ln-confirm button: first click arms, second click performs.
	async function confirmClick(selector) {
		await page.evaluate(s => document.querySelector(s).click(), selector);
		await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming',
			{ timeout: 3000 }, selector);
		await page.evaluate(s => document.querySelector(s).click(), selector);
	}

	// Opens the row's edit button (data-ln-modal-for + data-ln-fill-form) and waits for the form fill.
	async function openEdit(tableId, modalId, nameInputId, name, col) {
		const sel = await rowSel(tableId, name, col, '[data-ln-table-row-action="edit"]');
		assert(sel !== null, `"${name}" row has an edit button`);
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await waitModal(modalId, true);
		await page.waitForFunction((i, n) => document.getElementById(i).value === n, { timeout: 3000 }, nameInputId, name);
	}

	// ═══ 0. URL resolution + boot ═════════════════════════════

	await check('Boot: bundle loads, router and both data stores exist', async () => {
		const evidence = [];
		for (const url of CANDIDATES) {
			const failed = [];
			const onResp = r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); };
			page.on('response', onResp);
			try {
				await page.goto(url, { waitUntil: 'load' });
				const ok = await page.waitForFunction(() => !!(window.lnRouter
					&& document.getElementById('packages') && document.getElementById('packages').lnDataStore), { timeout: 8000 })
					.then(() => true, () => false);
				if (ok) {
					PAGE_URL = url;
					break;
				}
				evidence.push(`${url} -> router not mounted; HTTP>=400: [${failed.join(', ')}]`);
			} finally {
				page.off('response', onResp);
			}
		}
		assert(PAGE_URL !== null, 'a docuflow URL loads the bundle and mounts the data stores. Evidence: ' + evidence.join(' || '));
		ORIGIN = new URL(PAGE_URL).origin + '/';
		RESET_URL = new URL('api/reset', PAGE_URL).href;
		ASSET_URL = new URL('dist/docuflow.css', PAGE_URL).href;
		console.log(`  using ${PAGE_URL}`);
		await waitBoot();

		const info = await page.evaluate(() => ({
			base: window.lnRouter.base(),
			baseEl: !!document.querySelector('base'),
			outlets: document.querySelectorAll('[data-ln-outlet]').length,
			outletTag: document.getElementById('app-content').tagName,
			routes: Array.from(document.querySelectorAll('template[data-ln-route]')).map(t => t.getAttribute('data-ln-route')).sort(),
			pkgConn: document.querySelector('#packages-coordinator [data-ln-api-connector]').getAttribute('data-ln-api-base-url'),
			pkgCoord: !!document.getElementById('packages-coordinator').lnDataCoordinator,
			tenCoord: !!document.getElementById('tenants-coordinator').lnDataCoordinator
		}));
		assert(!info.baseEl && info.base === '', 'no <base>, router base() is "" (index.html sets none)');
		assert(info.outlets === 1 && info.outletTag === 'MAIN', 'exactly one [data-ln-outlet] (main#app-content)');
		assert(same(info.routes, ['/', '/packages', '/tenants']), `route templates are /, /packages, /tenants (got ${info.routes.join(',')})`);
		assert(info.pkgConn === new URL('api', PAGE_URL).pathname, `inline script rewrites data-ln-api-base-url to <page dir>/api (got ${info.pkgConn})`);
		assert(info.pkgCoord && info.tenCoord, 'both data coordinators are mounted outside the outlet');
	});

	if (PAGE_URL === null) {
		throw new Error('FAILED: no docuflow URL works. ' + failures.join(' | '));
	}

	await check('Boot: router mounts a route on load', async () => {
		await resetBackend();
		await clearClientState();
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await waitBoot();
		await page.waitForFunction(() => document.readyState === 'complete', { timeout: 5000 });
		const r = await page.evaluate(() => ({
			current: window.lnRouter.current() ? window.lnRouter.current().path : null,
			pathname: location.pathname,
			outlet: document.getElementById('app-content').children.length
		}));
		assert(r.current !== null && r.outlet > 0,
			`[source] index.html has no route for the page's own pathname; ln-router:not-found must make app.js replace it with "/", and the outlet must render the dashboard on load (current=${r.current}, location.pathname="${r.pathname}", outlet children=${r.outlet})`);
	});

	// ═══ 1. Shell + boot redirect ═════════════════════════════

	await check('Shell: header, sidebar, initial route', async () => {
		await fresh();
		const shell = await page.evaluate(() => ({
			brand: document.querySelector('#app-brand span').textContent.trim(),
			links: Array.from(document.querySelectorAll('nav[aria-label="Main navigation"] a'))
				.map(a => [a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').trim()]),
			search: !!document.querySelector('#app-search input[type="search"][aria-label="Global search"]'),
			title: document.title,
			pathname: location.pathname,
			pkgRows: document.querySelectorAll('#packages-table').length
		}));
		assert(shell.brand === 'DocuFlow Admin', 'brand reads "DocuFlow Admin"');
		assert(same(shell.links.map(l => l[0]), ['/', '/packages', '/tenants']), 'sidebar hrefs: /, /packages, /tenants');
		assert(same(shell.links.map(l => l[1]), ['Dashboard', 'Packages', 'Tenants']), 'sidebar labels: Dashboard, Packages, Tenants');
		assert(shell.search, 'global search input is present');
		assert(shell.title === 'Dashboard — DocuFlow', 'document title comes from data-ln-route-title');
		const c = await current();
		assert(c.path === '/' && c.pattern === '/', 'initial route is "/"');
		const stores = await page.evaluate(async () => {
			const p = await document.getElementById('packages').lnDataStore.getAll({});
			const t = await document.getElementById('tenants').lnDataStore.getAll({});
			return { p: p.data.map(r => r.name), t: t.data.map(r => r.name) };
		});
		assert(same(stores.p, PACKAGES), 'packages store holds the 4 seed packages (api.php seed_data)');
		assert(same(stores.t, TENANTS), 'tenants store holds the 5 seed tenants (api.php seed_data)');
	});

	// ═══ 2. Dashboard ═════════════════════════════════════════

	await check('Dashboard: stat counters (fillDashboard) and live refresh', async () => {
		await fresh();
		await page.waitForFunction(() => document.querySelector('#dashboard [data-stat="tenants"]').textContent.trim() !== '—', { timeout: 8000 });
		const stat = () => page.evaluate(() => Object.fromEntries(Array.from(document.querySelectorAll('#dashboard [data-stat]'))
			.map(e => [e.getAttribute('data-stat'), e.textContent.trim()])));
		const labels = await page.evaluate(() => Array.from(document.querySelectorAll('#dashboard article h3')).map(h => h.textContent.trim()));
		assert(same(labels, ['Packages', 'Tenants', 'Active tenants', 'Unlimited-user packages']), 'four stat labels in markup order');
		const s = await stat();
		assert(s.packages === '4', 'Packages stat is 4 (seed: 4 packages)');
		assert(s.tenants === '5', 'Tenants stat is 5 (seed: 5 tenants)');
		assert(s['tenants-active'] === '5', 'Active tenants stat is 5 (seed: all 5 active)');
		assert(s['packages-unlimited'] === '1', 'Unlimited-user packages stat is 1 (seed: only Enterprise has max_users 0)');
		assert(await page.evaluate(() => document.querySelector('#dashboard [data-view-error]').hidden), 'dashboard error region is hidden when stats load');
	});

	// ═══ 3. Router / nav ══════════════════════════════════════

	await check('Router: sidebar navigation updates path, title, outlet and ln-nav state', async () => {
		await fresh();
		const navState = () => page.evaluate(() => Object.fromEntries(['/', '/packages', '/tenants'].map(h => [h,
			document.querySelector('nav[aria-label="Main navigation"] a[href="' + h + '"]').getAttribute('aria-current')])));
		let n = await navState();
		assert(n['/'] === 'page' && n['/packages'] === null && n['/tenants'] === null, 'on /: only Dashboard link has aria-current="page"');
		await clickNav('/packages', '/packages');
		let c = await current();
		assert(c.pattern === '/packages' && c.title === 'Packages — DocuFlow', 'Packages: pattern /packages and title');
		assert(await page.evaluate(() => !!document.getElementById('packages-view') && !document.getElementById('dashboard')), 'outlet swapped: #packages-view in, #dashboard out');
		assert(await page.evaluate(() => location.pathname) === '/packages', 'history pushState updates location to /packages');
		n = await navState();
		assert(n['/packages'] === 'page' && n['/'] === null && n['/tenants'] === null, 'on /packages: only Packages link aria-current="page"');
		await clickNav('/tenants', '/tenants');
		c = await current();
		assert(c.title === 'Tenants — DocuFlow', 'Tenants: title');
		assert(await page.evaluate(() => !!document.getElementById('tenants-view') && !document.getElementById('packages-view')), 'outlet swapped: #tenants-view in, #packages-view out');
		n = await navState();
		assert(n['/tenants'] === 'page' && n['/packages'] === null, 'on /tenants: only Tenants link aria-current="page"');
		await clickNav('/', '/');
		c = await current();
		assert(c.title === 'Dashboard — DocuFlow' && await page.evaluate(() => !!document.getElementById('dashboard')), 'Dashboard: title and #dashboard rendered');
	});

	await check('Router: brand link, back / forward, programmatic unknown path redirects to dashboard', async () => {
		await fresh();
		await page.evaluate(() => { window.__marker = 'alive'; });
		await clickNav('/packages', '/packages');
		await clickNav('/tenants', '/tenants');
		await page.goBack();
		await waitPath('/packages');
		assert(await page.evaluate(() => !!document.getElementById('packages-view')), 'back: packages view rendered');
		await page.goBack();
		await waitPath('/');
		assert(await page.evaluate(() => !!document.getElementById('dashboard')), 'back x2: dashboard rendered');
		await page.goForward();
		await waitPath('/packages');
		await page.waitForFunction(() => document.querySelectorAll('#packages-table tbody tr[data-ln-table-row]').length === 4, { timeout: 5000 });
		assert(true, 'forward: packages table repopulated with 4 rows');
		await click('#app-brand');
		await waitPath('/');
		assert(await page.evaluate(() => !!document.getElementById('dashboard')), 'brand link (href="/") renders the dashboard');
		await page.evaluate(() => window.lnRouter.navigate('/no/such/page'));
		await page.waitForFunction(() => location.pathname === '/' && !!document.getElementById('dashboard'), { timeout: 5000 });
		assert(true, 'ln-router:not-found for an unknown path -> app.js replaces with "/" (dashboard stays)');
		assert(await page.evaluate(() => window.__marker) === 'alive', 'in-app navigation never reloads the document');
	});

	await check('Stores persist across route changes (no re-init)', async () => {
		await fresh();
		await page.evaluate(() => { window.__storeRef = document.getElementById('packages').lnDataStore; });
		await clickNav('/packages', '/packages');
		await clickNav('/tenants', '/tenants');
		await clickNav('/', '/');
		assert(await page.evaluate(() => document.getElementById('packages').lnDataStore === window.__storeRef), 'packages store instance is the same object after navigating around');
	});

	// ═══ 4. Packages ══════════════════════════════════════════

	const PKG = { href: '/packages', path: '/packages' };
	const TEN = { href: '/tenants', path: '/tenants' };

	await check('Packages: table renders the seed rows', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'packages in server order');
		const v = await page.evaluate(() => ({
			table: !!document.getElementById('packages-table').lnTable,
			coord: !!document.querySelector('#packages-view [data-ln-table-coordinator]').lnTableCoordinator,
			h2: document.querySelector('#packages-table h2').textContent.trim(),
			heads: Array.from(document.querySelectorAll('#packages-table thead th')).map(th => th.firstChild.textContent.trim()),
			values: Array.from(document.querySelectorAll('#packages-table tbody tr[data-ln-table-row]')).map(tr => tr.cells[1].getAttribute('data-ln-value'))
		}));
		assert(v.table && v.coord, 'ln-table and ln-table-coordinator mounted on the route view');
		assert(v.h2 === 'Packages', 'toolbar heading "Packages"');
		assert(same(v.heads, ['Name', 'Max users', 'Max docs', 'Max storage', 'Status', 'Actions']), 'column headers');
		assert(same(await cellTexts('packages-table', [0, 2, 3]), [
			'Starter|100|5 GB',
			'Professional|1000|50 GB',
			'Enterprise|100000|500 GB',
			'Legacy|250|10 GB'
		]), 'rows: name | max_documents | max_storage GB (template columns that need no decorator)');
		assert(same(v.values, ['5', '25', '0', '10']), 'Max users cells carry raw data-ln-value from {{ max_users }}');
		const f = await footer('packages-table');
		assert(f.total === '4', 'footer total is 4');
	});

	await check('Packages: decorator-derived columns (max_users_display, status_display)', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'packages in server order');
		const got = await cellTexts('packages-table', [1, 4]);
		assert(same(got, ['5|Active', '25|Active', 'Unlimited|Active', '10|Inactive']),
			`app.js decoratePackage: Max users shows the number or "Unlimited" (0), Status shows Active/Inactive; got [${got.join(', ')}]`);
	});

	await check('Packages: search (store search-fields="name")', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'before search');
		await typeSearch('packages', 'pro');
		await expectCol('packages-table', 0, ['Professional'], 'search "pro"');
		const f = await footer('packages-table');
		assert(f.total === '4' && f.filtered === '1', 'footer: total 4, filtered 1');
		await clearSearch('packages');
		await expectCol('packages-table', 0, PACKAGES, 'clear button restores all');
		await typeSearch('packages', 'zzzz');
		await page.waitForFunction(() => !!document.querySelector('#packages-table .ln-table__empty-state'), { timeout: 5000 });
		assert(await emptyState('packages-table') === 'No results', 'no match shows the "No results" empty-filtered template');
		await click('#packages-table [data-ln-table-clear-all]');
		await expectCol('packages-table', 0, PACKAGES, 'Clear all filters restores every row');
		assert(await page.evaluate(() => document.querySelector('input[data-ln-search-for="packages"]').value) === '', 'Clear all filters also empties the search input');
	});

	await check('Packages: sort by column', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'before sort');
		await clickSort('packages-table', 'name', 'asc');
		await expectCol('packages-table', 0, ['Enterprise', 'Legacy', 'Professional', 'Starter'], 'name asc');
		const s = await sortState('packages-table', 'name');
		assert(s.state === 'asc' && s.aria === 'ascending', 'name list data-ln-sort-state="asc", th aria-sort="ascending"');
		await clickSort('packages-table', 'name', 'desc');
		await expectCol('packages-table', 0, ['Starter', 'Professional', 'Legacy', 'Enterprise'], 'name desc');
		await clickSort('packages-table', 'max_users', 'asc');
		await expectCol('packages-table', 0, ['Enterprise', 'Starter', 'Legacy', 'Professional'], 'max_users asc is numeric (0,5,10,25)');
		assert((await sortState('packages-table', 'name')).state === 'none', 'sorting another column resets the name list to "none"');
		await clickSort('packages-table', 'max_documents', 'desc');
		await expectCol('packages-table', 0, ['Enterprise', 'Professional', 'Legacy', 'Starter'], 'max_documents desc (100000,1000,250,100)');
		await clickSort('packages-table', 'max_storage', 'asc');
		await expectCol('packages-table', 0, ['Starter', 'Legacy', 'Professional', 'Enterprise'], 'max_storage asc (5,10,50,500)');
		await clickSort('packages-table', 'max_storage', 'none');
		await expectCol('packages-table', 0, PACKAGES, 'none restores the server order');
	});

	// Submits the real Save button and reports whether the browser navigated away (native POST).
	async function saveNavigates(formId, modalId) {
		const nav = page.waitForNavigation({ waitUntil: 'load', timeout: 4000 }).then(() => true, () => false);
		const closed = page.waitForFunction(i => { const d = document.getElementById(i); return !d || !d.open; }, { timeout: 4000 }, modalId)
			.then(() => false, () => new Promise(() => {}));
		await click('#' + formId + ' button[type=submit]');
		return Promise.race([nav, closed]);
	}

	await check('Write path: package-form is scoped to the coordinator (as authored in index.html)', async () => {
		await fresh(PKG);
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.type('#pkg-name', 'Native Probe');
		const attrs = await page.evaluate(() => {
			const f = document.getElementById('package-form');
			return { scope: f.getAttribute('data-ln-data-coordinator-scope'), legacy: f.getAttribute('data-ln-form-scope') };
		});
		assert(attrs.scope === 'packages',
			`[source] package-form must carry data-ln-data-coordinator-scope="packages" (ln-data-coordinator reads that attribute); it carries data-ln-form-scope="${attrs.legacy}" which no component reads (scope=${attrs.scope})`);
		const navigated = await saveNavigates('package-form', 'package-modal');
		assert(!navigated, 'Save is intercepted by the coordinator (no native form POST navigation)');
	});

	await check('Write path: tenant-form is scoped to the coordinator (as authored in index.html)', async () => {
		await fresh(TEN);
		await click('#new-tenant');
		await waitModal('tenant-modal', true);
		await page.type('#tenant-name', 'Native Probe');
		const attrs = await page.evaluate(() => {
			const f = document.getElementById('tenant-form');
			return { scope: f.getAttribute('data-ln-data-coordinator-scope'), legacy: f.getAttribute('data-ln-form-scope') };
		});
		assert(attrs.scope === 'tenants',
			`[source] tenant-form must carry data-ln-data-coordinator-scope="tenants"; it carries data-ln-form-scope="${attrs.legacy}" which no component reads (scope=${attrs.scope})`);
		const navigated = await saveNavigates('tenant-form', 'tenant-modal');
		assert(!navigated, 'Save is intercepted by the coordinator (no native form POST navigation)');
	});

	await check('Packages modal: new mode, create, row appears, modal closes (scope attribute applied by the test)', async () => {
		await fresh(PKG);
		await applyScope('package-form', 'packages');
		await expectCol('packages-table', 0, PACKAGES, 'before');
		await click('#new-package');
		await waitModal('package-modal', true);
		const m = await modalState('package-modal');
		assert(m.mode === 'new' && m.attr === 'open', 'New opens the modal with data-ln-modal-mode="new"');
		const title = await page.evaluate(() => Array.from(document.querySelectorAll('#package-modal [data-ln-modal-when]'))
			.filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent.trim()));
		assert(same(title, ['New package']), 'only the "new" title variant is visible');
		const form = await page.evaluate(() => ({ action: document.getElementById('package-form').getAttribute('action'), active: document.getElementById('package-form').elements.active.checked, mu: document.getElementById('pkg-max-users').value }));
		assert(form.action === '/packages' && form.active === false && form.mu === '0', 'markup defaults: action "/packages", Active unchecked (no checked attr), max users 0');

		await page.type('#pkg-name', 'Zeta Test');
		await setInput('#pkg-max-users', '7');
		await setInput('#pkg-max-documents', '12');
		await setInput('#pkg-max-storage', '3');
		await page.evaluate(() => document.getElementById('package-form').elements.active.click());
		await click('#package-form button[type=submit]');
		await waitModal('package-modal', false);
		await expectCol('packages-table', 0, [...PACKAGES, 'Zeta Test'], 'created package appended');
		const post = requests.filter(r => r.method === 'POST');
		assert(post.length === 1 && post[0].url === new URL('api/packages', PAGE_URL).href, 'one POST to <page dir>/api/packages');
		const body = JSON.parse(post[0].body);
		assert(body.name === 'Zeta Test' && Number(body.max_users) === 7 && Number(body.max_documents) === 12 && Number(body.max_storage) === 3,
			'POST body carries the typed values');
		const rows = await rowTexts('packages-table', 5);
		assert(rows[4].startsWith('Zeta Test|'), `new row starts with the name (got "${rows[4]}")`);
		assert((await cellTexts('packages-table', [0, 2, 3]))[4] === 'Zeta Test|12|3 GB', 'new row: name Zeta Test, documents 12, storage "3 GB"');
		assert((await footer('packages-table')).total === '5', 'footer total is 5');
		const saved = await fetch(new URL('api/packages', PAGE_URL).href).then(r => r.json());
		assert(saved.data.length === 5 && saved.data[4].name === 'Zeta Test' && saved.data[4].id === 5, 'backend persisted id 5 (api.php next_id)');
	});

	await check('Packages modal: edit button opens in edit mode with the "Edit package" title', async () => {
		await fresh(PKG);
		await openEdit('packages-table', 'package-modal', 'pkg-name', 'Legacy', 0);
		const title = await page.evaluate(() => Array.from(document.querySelectorAll('#package-modal [data-ln-modal-when]'))
			.filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent.replace(/\s+/g, ' ').trim()));
		const mode = (await modalState('package-modal')).mode;
		assert(mode === 'edit' && same(title, ['Edit package — Legacy']),
			`[source] the edit button has no data-ln-modal-mode="edit", so ln-modal resets the mode to "new"; expected mode "edit" and title "Edit package — Legacy" (got mode="${mode}", title="${title.join('|')}")`);
	});

	await check('Packages modal: edit button fills the record, PUT updates the row (scope attribute applied by the test)', async () => {
		await fresh(PKG);
		await applyScope('package-form', 'packages');
		await expectCol('packages-table', 0, PACKAGES, 'before');
		await openEdit('packages-table', 'package-modal', 'pkg-name', 'Legacy', 0);
		const f = await formValues('package-form');
		assert(f.id === '4' && f.name === 'Legacy' && f.max_users === '10' && f.max_guests === '0' && f.max_standards === '2'
			&& f.max_documents === '250' && f.max_storage === '10' && !('active' in f),
			'form filled from the Legacy record (id 4, 10/0/2/250/10, active unchecked)');
		assert(await page.evaluate(() => document.getElementById('package-form').getAttribute('action')) === '/packages/4', 'form action becomes "/packages/4" (data-ln-form-action-edit)');

		await setInput('#pkg-name', 'Legacy Plus');
		await click('#package-form button[type=submit]');
		await waitModal('package-modal', false);
		await expectCol('packages-table', 0, ['Starter', 'Professional', 'Enterprise', 'Legacy Plus'], 'renamed in place');
		const put = requests.filter(r => r.method === 'PUT');
		assert(put.length === 1 && put[0].url === new URL('api/packages/4', PAGE_URL).href, 'one PUT to <page dir>/api/packages/4');
		assert(JSON.parse(put[0].body).name === 'Legacy Plus', 'PUT body carries the new name');
	});

	await check('Packages modal: Cancel and Escape close without saving', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'before');
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.type('#pkg-name', 'Should not persist');
		await click('#package-modal footer [data-ln-modal-close]');
		await waitModal('package-modal', false);
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.keyboard.press('Escape');
		await waitModal('package-modal', false);
		assert(requests.length === 0, 'no mutating request was sent');
		await expectCol('packages-table', 0, PACKAGES, 'rows unchanged');
	});

	await check('Packages modal: New after an edit starts from the markup defaults', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'before');
		await openEdit('packages-table', 'package-modal', 'pkg-name', 'Legacy', 0);
		await click('#package-modal header [data-ln-modal-close]');
		await waitModal('package-modal', false);
		await click('#new-package');
		await waitModal('package-modal', true);
		const f = await formValues('package-form');
		const problems = [];
		if (f.name !== '') problems.push(`name="${f.name}"`);
		if (f.id !== '') problems.push(`hidden id="${f.id}"`);
		if (f.max_users !== '0' || f.max_guests !== '0' || f.max_standards !== '0' || f.max_documents !== '0' || f.max_storage !== '0') {
			problems.push(`limits ${f.max_users}/${f.max_guests}/${f.max_standards}/${f.max_documents}/${f.max_storage} instead of 0/0/0/0/0`);
		}
		if ('active' in f) problems.push('Active checked');
		const action = await page.evaluate(() => document.getElementById('package-form').getAttribute('action'));
		if (action !== '/packages') problems.push(`action="${action}"`);
		assert(problems.length === 0, `new-mode form equals the markup defaults (empty name and id, limits 0, Active unchecked, action "/packages"); deviations: [${problems.join('; ')}]`);
	});

	await check('Packages: delete (two-click confirm) and referenced-package block toast', async () => {
		await fresh(PKG);
		await expectCol('packages-table', 0, PACKAGES, 'before');

		let sel = await rowSel('packages-table', 'Legacy', 0, '[data-ln-table-row-action="delete"]');
		assert(sel !== null, 'Legacy row has a delete button');
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming', { timeout: 3000 }, sel);
		assert(requests.filter(r => r.method === 'DELETE').length === 0, 'first click only arms the confirm (no request)');
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await expectCol('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'Legacy removed (0 tenants reference it)');
		const del = requests.filter(r => r.method === 'DELETE');
		assert(del.length === 1 && del[0].url === new URL('api/packages/4', PAGE_URL).href, 'one DELETE to <page dir>/api/packages/4');
		assert((await footer('packages-table')).total === '3', 'footer total is 3');

		sel = await rowSel('packages-table', 'Starter', 0, '[data-ln-table-row-action="delete"]');
		await confirmClick(sel);
		await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-ln-toast-item]')).some(t => t.textContent.includes('2 tenants use this package')), { timeout: 4000 }).catch(() => {});
		assert(requests.filter(r => r.method === 'DELETE').length === 1, 'no second DELETE was sent for the referenced package');
		await expectCol('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'Starter is still listed');
		const hasContainer = await page.evaluate(() => !!(document.querySelector('[data-ln-toast]') || document.getElementById('ln-toast-container')));
		assert(hasContainer, `[source] index.html has no [data-ln-toast] / #ln-toast-container, so ln-toast:enqueue has nowhere to render`);
		assert((await toasts()).some(t => t.includes('Blocked') && t.includes('2 tenants use this package')), 'toast "Blocked — 2 tenants use this package" (app.js handleDelete)');
	});

	// ═══ 5. Tenants ═══════════════════════════════════════════

	await check('Tenants: table renders the seed rows', async () => {
		await fresh(TEN);
		await expectCol('tenants-table', 0, TENANTS, 'tenants in server order');
		const v = await page.evaluate(() => ({
			table: !!document.getElementById('tenants-table').lnTable,
			heads: Array.from(document.querySelectorAll('#tenants-table thead th')).map(th => th.firstChild.textContent.trim())
		}));
		assert(v.table, 'ln-table mounted');
		assert(same(v.heads, ['Name', 'Slug', 'Package', 'Auth method', 'Status', 'Actions']), 'column headers');
		assert(same(await cellTexts('tenants-table', [0, 1, 3]), [
			'Acme Corp|acme|Local',
			'Globex|globex|LDAP',
			'Initech|initech|Local',
			'Umbrella|umbrella|LDAP',
			'Wayne Enterprises|wayne|Local'
		]), 'rows: name|slug|auth_method (columns that need no decorator)');
		const f = await footer('tenants-table');
		assert(f.total === '5', 'footer total is 5');
	});

	await check('Tenants: decorator-derived columns (package_name, status_display)', async () => {
		await fresh(TEN);
		await expectCol('tenants-table', 0, TENANTS, 'tenants in server order');
		const got = await cellTexts('tenants-table', [2, 4]);
		assert(same(got, ['Starter|Active', 'Starter|Active', 'Professional|Active', 'Professional|Active', 'Enterprise|Active']),
			`app.js decorateTenant: Package shows the joined package name, Status shows Active/Inactive; got [${got.join(', ')}]`);
	});

	await check('Tenants: search over name, slug and custom_domain', async () => {
		await fresh(TEN);
		await expectCol('tenants-table', 0, TENANTS, 'before search');
		await typeSearch('tenants', 'example');
		await expectCol('tenants-table', 0, ['Globex', 'Umbrella'], 'search "example" matches custom_domain');
		await clearSearch('tenants');
		await expectCol('tenants-table', 0, TENANTS, 'clear restores all');
		await typeSearch('tenants', 'wayne');
		await expectCol('tenants-table', 0, ['Wayne Enterprises'], 'search "wayne" matches slug and name');
		const f = await footer('tenants-table');
		assert(f.total === '5' && f.filtered === '1', 'footer total 5, filtered 1');
		await clearSearch('tenants');
		await typeSearch('tenants', 'nomatch');
		await page.waitForFunction(() => !!document.querySelector('#tenants-table .ln-table__empty-state'), { timeout: 5000 });
		assert(await emptyState('tenants-table') === 'No results', 'no match shows "No results"');
		await click('#tenants-table [data-ln-table-clear-all]');
		await expectCol('tenants-table', 0, TENANTS, 'Clear all filters restores every row');
	});

	await check('Tenants: sort by name and slug', async () => {
		await fresh(TEN);
		await expectCol('tenants-table', 0, TENANTS, 'before sort');
		await clickSort('tenants-table', 'name', 'desc');
		await expectCol('tenants-table', 0, ['Wayne Enterprises', 'Umbrella', 'Initech', 'Globex', 'Acme Corp'], 'name desc');
		await clickSort('tenants-table', 'slug', 'asc');
		await expectCol('tenants-table', 0, ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'], 'slug asc (acme, globex, initech, umbrella, wayne)');
		assert((await sortState('tenants-table', 'name')).state === 'none', 'name list reset when slug is sorted');
		await clickSort('tenants-table', 'slug', 'desc');
		await expectCol('tenants-table', 0, ['Wayne Enterprises', 'Umbrella', 'Initech', 'Globex', 'Acme Corp'], 'slug desc');
		await clickSort('tenants-table', 'slug', 'none');
		await expectCol('tenants-table', 0, TENANTS, 'none restores the server order');
	});

	await check('Tenants modal: new mode, package select from ln-options, create (scope attribute applied by the test)', async () => {
		await fresh(TEN);
		await applyScope('tenant-form', 'tenants');
		await expectCol('tenants-table', 0, TENANTS, 'before');
		await click('#new-tenant');
		await waitModal('tenant-modal', true);
		assert((await modalState('tenant-modal')).mode === 'new', 'New opens the modal with data-ln-modal-mode="new"');
		const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#tenant-package-id option')).map(o => [o.value, o.textContent.trim()].join('|')));
		assert(same(opts, ['|—', '1|Starter', '2|Professional', '3|Enterprise', '4|Legacy']),
			`package select: placeholder + the 4 packages from the packages store via ln-options (got ${opts.join(',')})`);
		const d = await formValues('tenant-form');
		assert(d.auth_method === 'Local' && d.doc_numbering_scheme === '{TYPE}-{SEQ:4}' && d.review_interval === '365'
			&& d.brand_primary === '#2563eb' && d.brand_secondary === '#1e40af' && !('read_confirmation' in d) && !('active' in d),
			'markup defaults: Local, {TYPE}-{SEQ:4}, 365, #2563eb/#1e40af, checkboxes unchecked');

		await page.type('#tenant-name', 'Zeta Tenant');
		await page.type('#tenant-slug', 'zeta-tenant');
		await page.select('#tenant-package-id', '2');
		await page.select('#tenant-auth-method', 'LDAP');
		await page.evaluate(() => document.getElementById('tenant-form').elements.active.click());
		await click('#tenant-form button[type=submit]');
		await waitModal('tenant-modal', false);
		await expectCol('tenants-table', 0, [...TENANTS, 'Zeta Tenant'], 'created tenant appended');
		const post = requests.filter(r => r.method === 'POST');
		assert(post.length === 1 && post[0].url === new URL('api/tenants', PAGE_URL).href, 'one POST to <page dir>/api/tenants');
		const body = JSON.parse(post[0].body);
		assert(body.name === 'Zeta Tenant' && body.slug === 'zeta-tenant' && String(body.package_id) === '2' && body.auth_method === 'LDAP',
			'POST body carries the typed values');
		const rows = await rowTexts('tenants-table', 5);
		assert(rows[5].startsWith('Zeta Tenant|zeta-tenant|'), `new row starts with name and slug (got "${rows[5]}")`);
		assert((await cellTexts('tenants-table', [0, 1, 3]))[5] === 'Zeta Tenant|zeta-tenant|LDAP', 'new row: name, slug, auth LDAP');
		assert((await footer('tenants-table')).total === '6', 'footer total is 6');
	});

	await check('Tenants modal: edit button fills the record, PUT updates the row (scope attribute applied by the test)', async () => {
		await fresh(TEN);
		await applyScope('tenant-form', 'tenants');
		await expectCol('tenants-table', 0, TENANTS, 'before');
		await openEdit('tenants-table', 'tenant-modal', 'tenant-name', 'Globex', 0);
		const f = await formValues('tenant-form');
		assert(f.id === '2' && f.name === 'Globex' && f.slug === 'globex' && f.custom_domain === 'globex.example.com'
			&& f.package_id === '1' && f.auth_method === 'LDAP' && f.brand_primary === '#16a34a' && f.brand_secondary === '#15803d'
			&& f.review_interval === '365' && !('read_confirmation' in f) && 'active' in f,
			`form filled from the Globex record (got ${JSON.stringify(f)})`);
		assert(await page.evaluate(() => document.getElementById('tenant-form').getAttribute('action')) === '/tenants/2', 'form action becomes "/tenants/2"');

		await setInput('#tenant-name', 'Globex Intl');
		await click('#tenant-form button[type=submit]');
		await waitModal('tenant-modal', false);
		await expectCol('tenants-table', 0, ['Acme Corp', 'Globex Intl', 'Initech', 'Umbrella', 'Wayne Enterprises'], 'renamed in place');
		const put = requests.filter(r => r.method === 'PUT');
		assert(put.length === 1 && put[0].url === new URL('api/tenants/2', PAGE_URL).href, 'one PUT to <page dir>/api/tenants/2');
	});

	await check('Tenants: delete (two-click confirm)', async () => {
		await fresh(TEN);
		await expectCol('tenants-table', 0, TENANTS, 'before');
		const sel = await rowSel('tenants-table', 'Umbrella', 0, '[data-ln-table-row-action="delete"]');
		await confirmClick(sel);
		await expectCol('tenants-table', 0, ['Acme Corp', 'Globex', 'Initech', 'Wayne Enterprises'], 'Umbrella removed');
		const del = requests.filter(r => r.method === 'DELETE');
		assert(del.length === 1 && del[0].url === new URL('api/tenants/4', PAGE_URL).href, 'one DELETE to <page dir>/api/tenants/4');
		assert((await footer('tenants-table')).total === '4', 'footer total is 4');
	});

	await check('Cross-view: deleting a tenant unblocks its package; dashboard counters follow', async () => {
		await fresh(TEN);
		for (const name of ['Initech', 'Umbrella']) {
			const sel = await rowSel('tenants-table', name, 0, '[data-ln-table-row-action="delete"]');
			await confirmClick(sel);
			await page.waitForFunction(n => !Array.from(document.querySelectorAll('#tenants-table tbody tr[data-ln-table-row]')).some(tr => tr.cells[0].textContent.trim() === n), { timeout: 5000 }, name);
		}
		await clickNav('/packages', '/packages');
		await expectCol('packages-table', 0, PACKAGES, 'packages before delete');
		const sel = await rowSel('packages-table', 'Professional', 0, '[data-ln-table-row-action="delete"]');
		await confirmClick(sel);
		await expectCol('packages-table', 0, ['Starter', 'Enterprise', 'Legacy'], 'Professional deletes once no tenant references it');
		assert(requests.filter(r => r.method === 'DELETE').length === 3, 'two tenant DELETEs + one package DELETE were sent');
		await clickNav('/', '/');
		await page.waitForFunction(() => document.querySelector('#dashboard [data-stat="packages"]').textContent.trim() === '3', { timeout: 5000 });
		const s = await page.evaluate(() => Object.fromEntries(Array.from(document.querySelectorAll('#dashboard [data-stat]'))
			.map(e => [e.getAttribute('data-stat'), e.textContent.trim()])));
		assert(s.packages === '3' && s.tenants === '3' && s['tenants-active'] === '3' && s['packages-unlimited'] === '1',
			`dashboard: 3 packages, 3 tenants, 3 active, 1 unlimited (got ${JSON.stringify(s)})`);
	});

	// ═══ 6. Error region ══════════════════════════════════════

	await check('Dashboard: api-connector error shows the error region; Retry re-syncs', async () => {
		await resetBackend();
		await clearClientState();
		requests = [];
		const packagesUrl = new URL('api/packages', PAGE_URL).href;
		let blocked = true;
		let release;
		const gate = new Promise(resolve => { release = resolve; });
		await page.setRequestInterception(true);
		// The 500 is held back until the dashboard route is mounted (see ensureRoute), so the
		// error region exists when ln-api-connector:error fires.
		const onReq = r => {
			if (blocked && r.method() === 'GET' && r.url().split('?')[0] === packagesUrl) {
				gate.then(() => r.respond({ status: 500, contentType: 'application/json', body: '{"error":"Boom"}' }));
			} else {
				r.continue();
			}
		};
		page.on('request', onReq);
		try {
			await page.goto(PAGE_URL, { waitUntil: 'load' });
			await page.waitForFunction(() => !!window.lnRouter, { timeout: 8000 });
			await ensureRoute();
			await page.waitForFunction(() => !!document.querySelector('#dashboard [data-view-error]'), { timeout: 5000 });
			release();
			await page.waitForFunction(() => !document.querySelector('#dashboard [data-view-error]').hidden, { timeout: 8000 });
			const msg = await page.evaluate(() => document.querySelector('#dashboard [data-view-error-msg]').textContent.trim());
			assert(msg.startsWith('500 — ') && msg.includes('HTTP 500'), `error region shows "<status> — <connector error>" (app.js ln-api-connector:error handler); got "${msg}"`);
			blocked = false;
			// The click handler hides the region synchronously; read it in the same task, because the
			// connector may still deliver late error events for requests held back by the gate.
			const hid = await page.evaluate(() => {
				document.querySelector('#dashboard [data-view-retry]').click();
				return document.querySelector('#dashboard [data-view-error]').hidden;
			});
			const st = await page.evaluate(() => ({
				hidden: document.querySelector('#dashboard [data-view-error]').hidden,
				stat: document.querySelector('#dashboard [data-stat="packages"]').textContent.trim()
			}));
			assert(hid, `Retry (data-view-retry) hides the error region (hidden=${st.hidden}, packages stat="${st.stat}")`);
			const synced = await page.waitForFunction(() => document.querySelector('#dashboard [data-stat="packages"]').textContent.trim() === '4', { timeout: 6000 })
				.then(() => true, () => false);
			const stat = await page.evaluate(() => document.querySelector('#dashboard [data-stat="packages"]').textContent.trim());
			assert(synced, `after Retry the forced sync (storeToRetry.lnDataStore.forceSync()) loads the 4 packages into the dashboard stat; got "${stat}"`);
		} finally {
			page.off('request', onReq);
			await page.setRequestInterception(false);
		}
	});

	// ═══ End ══════════════════════════════════════════════════

	await resetBackend();

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ` + failures.join('\n  - '));
	}
});
