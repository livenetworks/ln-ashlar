import { run, assert } from './_harness.mjs';

// Driven by the REAL components (ln-router, ln-nav, ln-data-store, ln-data-coordinator,
// ln-api-connector, ln-table, ln-table-coordinator, ln-search, ln-sort, ln-filter, ln-popover,
// ln-modal, ln-form, ln-fill, ln-validate, ln-options, ln-stat, ln-confirm, ln-toast, ln-slug)
// against the REAL mock backend demo/docuflow/api.php. Nothing is mocked or stubbed.
//
// Every fact below is read from demo/spa/src/** (index.template.html, shell/, dashboard/,
// data/, packages/, tenants/, tenant-editor/, not-found/) and the seed data in
// demo/docuflow/api.php. Statements tagged [source] assert what the source code does where
// the README prose or the visible behaviour differs.
//
// URL: the built SPA contains <base href="/demo/spa/"> that is only switched to /spa/ when the
// path starts with /spa, so http://localhost/ln-ashlar/demo/spa/ cannot load dist/app.js (404).
// The Laragon vhost http://ln-ashlar.test/spa/ (docroot = demo/) is tried first; the localhost
// URL is the fallback. If neither mounts the router the run fails with the evidence.
//
// The mock backend persists to demo/docuflow/data/db.json. Every section starts from
// GET api/reset and the run ends with a reset, so the seed state is restored.

const CANDIDATES = [
	'http://ln-ashlar.test/spa/',
	'http://localhost/ln-ashlar/demo/spa/'
];

const PACKAGES = ['Starter', 'Professional', 'Enterprise', 'Legacy'];
const TENANTS = ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/spa (ln-router + DocuFlow views)', async ({ page }) => {

	let SPA_URL = null;
	let ORIGIN = null;
	let RESET_URL = null;

	// ─── Helpers ───────────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	const failures = [];
	async function check(title, fn) {
		section(title);
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

	// Drops every IndexedDB database of the origin from a page that has no open store.
	// The mock backend never reports deletions, so stale cached records would survive a reset.
	async function clearClientState() {
		await page.goto(ORIGIN + 'spa/dist/app.css', { waitUntil: 'load' });
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
		if (!window.lnRouter || !window.lnRouter.current()) return false;
		const p = document.getElementById('packages');
		const t = document.getElementById('tenants');
		return !!(p && p.lnDataStore && p.lnDataStore.isLoaded && t && t.lnDataStore && t.lnDataStore.isLoaded);
	}, { timeout: 15000 });

	// Fresh backend + fresh client state, then open `path` (relative to the SPA root).
	async function fresh(path = '') {
		await resetBackend();
		await clearClientState();
		requests = [];
		await page.goto(SPA_URL + path, { waitUntil: 'load' });
		await waitBoot();
	}

	const current = () => page.evaluate(() => ({
		path: window.lnRouter.current().path,
		pattern: window.lnRouter.current().route.pattern,
		loc: location.pathname,
		title: document.title
	}));

	const waitPath = (path, timeout = 8000) => page.waitForFunction(
		p => window.lnRouter.current() && window.lnRouter.current().path === p, { timeout }, path);

	const navLink = href => 'nav[aria-label="Main navigation"] a[href="' + href + '"]';

	async function clickNav(href, expectedPath) {
		await click(navLink(href));
		await waitPath(expectedPath);
	}

	// Waits for a table's first-cell-column names to equal `expected`, then asserts.
	async function expectNames(tableId, col, expected, label) {
		await page.waitForFunction((id, c, exp) => {
			const rows = Array.from(document.querySelectorAll('#' + id + ' tbody tr[data-ln-table-row], #' + id + ' tbody tr'))
				.filter(tr => tr.cells && tr.cells.length > c && !tr.classList.contains('ln-table__spacer'));
			const names = rows.map(tr => tr.cells[c].textContent.trim());
			return names.length === exp.length && names.every((n, i) => n === exp[i]);
		}, { timeout: 6000 }, tableId, col, expected).catch(() => {});
		const actual = await names(tableId, col);
		assert(same(actual, expected), `${label}: expected [${expected.join(' | ')}], got [${actual.join(' | ')}]`);
	}

	const names = (tableId, col) => page.evaluate((id, c) => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
		.filter(tr => tr.cells && tr.cells.length > c && !tr.classList.contains('ln-table__spacer'))
		.map(tr => tr.cells[c].textContent.trim()), tableId, col);

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

	const clickFilter = (popoverId, key, value) => page.evaluate((pid, k, v) => {
		const sel = v === null
			? 'input[data-ln-filter-key="' + k + '"][data-ln-filter-reset]'
			: 'input[data-ln-filter-key="' + k + '"][data-ln-filter-value="' + v + '"]';
		document.querySelector('#' + pid + ' ' + sel).click();
	}, popoverId, key, value);

	const checkedFilter = popoverId => page.evaluate(pid => Array.from(document.querySelectorAll('#' + pid + ' input:checked'))
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), popoverId);

	const toasts = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-toast-item]'))
		.map(t => t.textContent.replace(/\s+/g, ' ').trim()));

	const modalState = id => page.evaluate(i => {
		const d = document.getElementById(i);
		return { open: d.open, attr: d.getAttribute('data-ln-modal'), mode: d.getAttribute('data-ln-modal-mode') };
	}, id);

	const waitModal = (id, open) => page.waitForFunction((i, o) => document.getElementById(i).open === o,
		{ timeout: 5000 }, id, open);

	const formValues = id => page.evaluate(i => Object.fromEntries(new FormData(document.getElementById(i))), id);

	// Clicks only once the element is the topmost hit at its centre: right after a route change the
	// page is briefly covered (elementFromPoint returns <html>) and a click would be swallowed.
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

	async function setInput(selector, text) {
		await click(selector);
		await page.$eval(selector, e => e.select());
		await page.keyboard.press('Backspace');
		if (text !== '') await page.keyboard.type(text);
	}

	// Two-click ln-confirm button: first click arms, second click performs.
	async function confirmClick(selector) {
		await page.evaluate(s => document.querySelector(s).click(), selector);
		await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming',
			{ timeout: 3000 }, selector);
		await page.evaluate(s => document.querySelector(s).click(), selector);
	}

	const rowSel = (tableId, name, nameCol, inner) => {
		// Resolved in the page; returns a unique selector via a data marker on the row.
		return page.evaluate((id, n, c, i) => {
			document.querySelectorAll('[data-test-row]').forEach(e => e.removeAttribute('data-test-row'));
			const tr = Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
				.find(t => t.cells && t.cells[c] && t.cells[c].textContent.trim() === n);
			if (!tr) return null;
			tr.setAttribute('data-test-row', '1');
			return '[data-test-row] ' + i;
		}, tableId, name, nameCol, inner);
	};

	// ═══ 0. URL resolution + boot ═════════════════════════════

	await check('Boot: SPA loads app.js and mounts the router', async () => {
		const evidence = [];
		for (const url of CANDIDATES) {
			const failed = [];
			const onResp = r => { if (r.status() >= 400) failed.push(r.status() + ' ' + r.url()); };
			page.on('response', onResp);
			try {
				await page.goto(url, { waitUntil: 'load' });
				const ok = await page.waitForFunction(() => !!(window.lnRouter && window.lnRouter.current()
					&& document.getElementById('packages') && document.getElementById('packages').lnDataStore), { timeout: 8000 })
					.then(() => true, () => false);
				if (ok) {
					SPA_URL = url;
					break;
				}
				evidence.push(`${url} -> router not mounted; HTTP>=400: [${failed.join(', ')}]`);
			} finally {
				page.off('response', onResp);
			}
		}
		assert(SPA_URL !== null, 'a SPA URL mounts ln-router and the data stores. Evidence: ' + evidence.join(' || '));
		ORIGIN = new URL(SPA_URL).origin + '/';
		RESET_URL = new URL('../docuflow/api/reset', SPA_URL).href;
		console.log(`  using ${SPA_URL}`);
		await waitBoot();

		const info = await page.evaluate(() => ({
			base: window.lnRouter.base(),
			baseHref: document.querySelector('base').getAttribute('href'),
			outlet: document.querySelectorAll('[data-ln-outlet]').length,
			routes: Array.from(document.querySelectorAll('template[data-ln-route]')).map(t => t.getAttribute('data-ln-route')).sort(),
			pkgConn: document.querySelector('#packages-coordinator [data-ln-api-connector]').getAttribute('data-ln-api-base-url')
		}));
		assert(info.baseHref === '/spa/' && info.base === '/spa', `<base> switched to "/spa/", router base() is "/spa" (got ${info.baseHref}, ${info.base})`);
		assert(info.outlet === 1, 'exactly one [data-ln-outlet] (section#app-view)');
		assert(same(info.routes, ['*', '/', '/packages', '/tenants', '/tenants/:id']),
			`route templates are *, /, /packages, /tenants, /tenants/:id (got ${info.routes.join(',')})`);
		const c = await current();
		assert(c.path === '/' && c.pattern === '/', 'initial route is "/"');
		assert(c.title === 'Dashboard — DocuFlow', 'document title comes from data-ln-route-title');
	});

	if (SPA_URL === null) {
		await page.close().catch(() => {});
		throw new Error('FAILED: no SPA URL works. ' + failures.join(' | '));
	}

	// ═══ 1. Shell ═════════════════════════════════════════════

	await check('Shell: chrome, sidebar nav, persistent stores', async () => {
		await fresh();
		const shell = await page.evaluate(() => ({
			links: Array.from(document.querySelectorAll('nav[aria-label="Main navigation"] a'))
				.map(a => [a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').trim()]),
			brand: document.querySelector('.app-brand span').textContent.trim(),
			resetBtn: !!document.getElementById('reset-demo'),
			outletIsSection: document.getElementById('app-view').tagName === 'SECTION',
			pkgCoord: !!document.getElementById('packages-coordinator').lnDataCoordinator,
			tenCoord: !!document.getElementById('tenants-coordinator').lnDataCoordinator,
			offlineHidden: document.getElementById('offline-banner').classList.contains('hidden')
		}));
		assert(same(shell.links.map(l => l[0]), ['./', 'packages', 'tenants']), 'sidebar links: ./, packages, tenants');
		assert(same(shell.links.map(l => l[1]), ['Dashboard', 'Packages', 'Tenants']), 'sidebar labels: Dashboard, Packages, Tenants');
		assert(shell.brand === 'DocuFlow' && shell.resetBtn && shell.outletIsSection, 'brand, #reset-demo and outlet section#app-view present');
		assert(shell.pkgCoord && shell.tenCoord, 'both data coordinators mounted outside the outlet');
		assert(shell.offlineHidden, 'offline banner is hidden while online');

		const syncs = await page.evaluate(async () => {
			const p = await document.getElementById('packages').lnDataStore.getAll({});
			const t = await document.getElementById('tenants').lnDataStore.getAll({});
			return { p: p.data.map(r => r.name), t: t.data.map(r => r.name) };
		});
		assert(same(syncs.p, PACKAGES), 'packages store holds the 4 seed packages (api.php seed_data)');
		assert(same(syncs.t, TENANTS), 'tenants store holds the 5 seed tenants (api.php seed_data)');
	});

	await check('Shell: stores persist across route changes (no re-init)', async () => {
		await fresh();
		await page.evaluate(() => { window.__storeRef = document.getElementById('packages').lnDataStore; window.__marker = 'alive'; });
		await clickNav('packages', '/packages');
		await clickNav('tenants', '/tenants');
		await clickNav('./', '/');
		const r = await page.evaluate(() => ({
			sameStore: document.getElementById('packages').lnDataStore === window.__storeRef,
			marker: window.__marker
		}));
		assert(r.sameStore, 'packages store instance is the same object after navigating around');
		assert(r.marker === 'alive', 'in-app link clicks do not reload the document (window marker survives)');
	});

	// ═══ 2. Dashboard ═════════════════════════════════════════

	await check('Dashboard: stats and tenants-per-package usage', async () => {
		await fresh();
		await page.waitForFunction(() => !document.getElementById('dashboard').classList.contains('is-loading')
			&& Array.from(document.querySelectorAll('[data-ln-stat-value]')).every(e => !e.classList.contains('is-loading')),
			{ timeout: 8000 });
		const d = await page.evaluate(() => ({
			mounted: !!document.getElementById('dashboard').docuflowDashboard,
			h1: document.querySelector('#dashboard h1').textContent.trim(),
			labels: Array.from(document.querySelectorAll('[data-ln-stat-label]')).map(e => e.textContent.trim()),
			values: Array.from(document.querySelectorAll('[data-ln-stat-value]')).map(e => e.textContent.trim())
		}));
		assert(d.mounted && d.h1 === 'Dashboard', 'dashboard coordinator mounted, h1 "Dashboard"');
		assert(same(d.labels, ['Packages', 'Tenants', 'Active tenants', 'Active packages']), 'four stat labels in markup order');
		assert(d.values[0] === '4', 'Packages stat is 4 (seed: 4 packages)');
		assert(d.values[1] === '5', 'Tenants stat is 5 (seed: 5 tenants)');
		assert(d.values[2] === '5', 'Active tenants stat is 5 (seed: all 5 tenants active)');
		assert(d.values[3] === '3', `Active packages stat is 3 (seed: Legacy is inactive); got ${d.values[3]}`);

		await page.waitForFunction(() => document.querySelectorAll('[data-pkg-usage] li').length === 4, { timeout: 5000 });
		const usage = await page.evaluate(() => Array.from(document.querySelectorAll('[data-pkg-usage] li')).map(li => ({
			name: li.querySelector('[data-pkg-usage-name]').textContent.trim(),
			count: li.querySelector('[data-pkg-usage-count]').textContent.trim(),
			pct: li.querySelector('[data-ln-progress]').getAttribute('data-ln-progress')
		})));
		const expected = [['Starter', '2', '40'], ['Professional', '2', '40'], ['Enterprise', '1', '20'], ['Legacy', '0', '0']];
		assert(same(usage.map(u => [u.name, u.count, u.pct].join('|')), expected.map(e => e.join('|'))),
			'usage list: Starter 2/40, Professional 2/40, Enterprise 1/20, Legacy 0/0 (tenants per package_id / 5)');
	});

	await check('Dashboard: stat cards link into the other views', async () => {
		await fresh();
		await click('#dashboard .stat-grid a[href="tenants"]');
		await waitPath('/tenants');
		assert((await current()).title === 'Tenants — DocuFlow', 'stat card "tenants" routes to /tenants');
		await page.goBack();
		await waitPath('/');
		await click('#dashboard .stat-grid a[href="packages"]');
		await waitPath('/packages');
		assert((await current()).title === 'Packages — DocuFlow', 'stat card "packages" routes to /packages');
	});

	// ═══ 3. Router: navigation, history, deep links, 404 ══════

	await check('Router: sidebar navigation updates path, title, outlet and nav state', async () => {
		await fresh();
		await clickNav('packages', '/packages');
		let c = await current();
		assert(c.loc === '/spa/packages' && c.pattern === '/packages' && c.title === 'Packages — DocuFlow', 'Packages: /spa/packages, pattern /packages, title');
		assert(await page.evaluate(() => !!document.getElementById('packages-view') && !document.getElementById('dashboard')), 'outlet swapped: #packages-view in, #dashboard out');
		let nav = await page.evaluate(() => ({
			pk: document.querySelector('nav[aria-label="Main navigation"] a[href="packages"]').getAttribute('aria-current'),
			tn: document.querySelector('nav[aria-label="Main navigation"] a[href="tenants"]').getAttribute('aria-current')
		}));
		assert(nav.pk === 'page' && nav.tn === null, 'on /packages: Packages link aria-current="page", Tenants link not');
		await clickNav('tenants', '/tenants');
		c = await current();
		assert(c.loc === '/spa/tenants' && c.title === 'Tenants — DocuFlow', 'Tenants: /spa/tenants and title');
		assert(await page.evaluate(() => !!document.getElementById('tenants-view') && !document.getElementById('packages-view')), 'outlet swapped: #tenants-view in, #packages-view out');
		nav = await page.evaluate(() => ({
			pk: document.querySelector('nav[aria-label="Main navigation"] a[href="packages"]').getAttribute('aria-current'),
			tn: document.querySelector('nav[aria-label="Main navigation"] a[href="tenants"]').getAttribute('aria-current')
		}));
		assert(nav.tn === 'page' && nav.pk === null, 'on /tenants: Tenants link aria-current="page", Packages link not');
		await clickNav('./', '/');
		c = await current();
		assert(c.loc === '/spa/' && c.title === 'Dashboard — DocuFlow', 'Dashboard: /spa/ and title');
	});

	await check('Router: ln-router:navigated fires with region, path and pattern', async () => {
		await fresh();
		await page.evaluate(() => {
			window.__nav = [];
			document.addEventListener('ln-router:navigated', e => window.__nav.push(e.detail.path + '|' + e.detail.route.pattern));
		});
		await clickNav('packages', '/packages');
		await page.waitForFunction(() => window.__nav.length >= 1, { timeout: 3000 });
		const nav = await page.evaluate(() => window.__nav.slice());
		assert(nav[nav.length - 1] === '/packages|/packages', `navigated detail path|pattern is "/packages|/packages" (got ${nav.join(',')})`);
	});

	await check('Router: back / forward through dashboard > packages > tenants > editor', async () => {
		await fresh();
		await clickNav('packages', '/packages');
		await clickNav('tenants', '/tenants');
		await page.waitForSelector('#tenants-table tbody tr a[href="tenants/1"]');
		await click('#tenants-table tbody tr a[href="tenants/1"]');
		await waitPath('/tenants/1');
		assert((await current()).loc === '/spa/tenants/1', 'editor URL is /spa/tenants/1');
		await page.goBack();
		await waitPath('/tenants');
		assert(await page.evaluate(() => !!document.getElementById('tenants-view') && !document.getElementById('tenant-editor')), 'back: tenants list rendered, editor gone');
		await page.goBack();
		await waitPath('/packages');
		await page.goBack();
		await waitPath('/');
		assert(await page.evaluate(() => !!document.getElementById('dashboard')), 'back x3: dashboard rendered');
		assert((await current()).title === 'Dashboard — DocuFlow', 'back restores the dashboard title');
		await page.goForward();
		await waitPath('/packages');
		await page.goForward();
		await waitPath('/tenants');
		await page.waitForFunction(() => document.querySelectorAll('#tenants-table tbody tr').length === 5, { timeout: 5000 });
		assert(true, 'forward x2: tenants list repopulated with 5 rows');
	});

	await check('Router: deep links boot straight into the view', async () => {
		for (const [path, pattern, marker] of [
			['packages', '/packages', '#packages-view'],
			['tenants', '/tenants', '#tenants-view'],
			['tenants/3', '/tenants/:id', '#tenant-editor']
		]) {
			await fresh(path);
			const c = await current();
			assert(c.pattern === pattern, `deep link /spa/${path} resolves pattern ${pattern} (got ${c.pattern})`);
			assert(await page.evaluate(m => !!document.querySelector(m), marker), `deep link /spa/${path} renders ${marker}`);
		}
	});

	await check('404: unknown path renders the not-found view; link returns to dashboard', async () => {
		await fresh('nope');
		let c = await current();
		assert(c.pattern === '*' && c.title === 'Not found — DocuFlow', 'deep link /spa/nope matches "*" with the not-found title');
		const nf = await page.evaluate(() => ({
			h1: document.querySelector('#not-found h1').textContent.trim(),
			link: document.querySelector('#not-found a.btn').getAttribute('href')
		}));
		assert(nf.h1 === 'Page not found' && nf.link === './', 'not-found view: h1 "Page not found", link href "./"');
		await click('#not-found a.btn');
		await waitPath('/');
		assert(await page.evaluate(() => !!document.getElementById('dashboard') && !document.getElementById('not-found')), 'link "Back to dashboard" renders the dashboard');

		await page.evaluate(() => window.lnRouter.navigate('/spa/also/missing'));
		await page.waitForFunction(() => !!document.getElementById('not-found'), { timeout: 5000 });
		c = await current();
		assert(c.pattern === '*', 'programmatic navigate to an unknown path also lands on "*"');
	});

	// ═══ 4. Packages ══════════════════════════════════════════

	await check('Packages: table renders the seed rows with presenters', async () => {
		await fresh();
		await clickNav('packages', '/packages');
		await expectNames('packages-table', 0, PACKAGES, 'packages in server order');
		const v = await page.evaluate(() => ({
			coord: !!document.getElementById('packages-view').packagesCoordinator,
			table: !!document.getElementById('packages-table').lnTable,
			heading: document.querySelector('#packages-view .page-title p').textContent.replace(/\s+/g, ' ').trim(),
			rows: Array.from(document.querySelectorAll('#packages-table tbody tr')).map(tr => Array.from(tr.cells).slice(0, 5).map(c => c.textContent.replace(/\s+/g, ' ').trim()).join('|')),
			values: Array.from(document.querySelectorAll('#packages-table tbody tr')).map(tr => tr.cells[1].getAttribute('data-ln-value'))
		}));
		assert(v.coord && v.table, 'packagesCoordinator and ln-table mounted on the route view');
		assert(v.heading === '4 packages defined', 'ln-stat in the page header reads "4 packages defined"');
		assert(same(v.rows, [
			'Starter|5|100|5 GB|Active',
			'Professional|25|1000|50 GB|Active',
			'Enterprise|Unlimited|100000|500 GB|Active',
			'Legacy|10|250|10 GB|Inactive'
		]), 'rows: name | max_users_display | documents | storage | status_display');
		assert(same(v.values, ['5', '25', '0', '10']), 'Max users cells carry the raw data-ln-value (0 shown as "Unlimited")');
		const f = await footer('packages-table');
		assert(f.total === '4' && f.filteredHidden, 'footer total 4, filtered note hidden');
	});

	await check('Packages: search (store search-fields="name")', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before search');
		await typeSearch('packages', 'pro');
		await expectNames('packages-table', 0, ['Professional'], 'search "pro"');
		const f = await footer('packages-table');
		assert(f.total === '4' && f.filtered === '1' && !f.filteredHidden, 'footer: total 4, filtered 1 shown');
		await clearSearch('packages');
		await expectNames('packages-table', 0, PACKAGES, 'clear button restores all');
		await typeSearch('packages', 'zzzz');
		await page.waitForFunction(() => !!document.querySelector('#packages-table .ln-table__empty-state'), { timeout: 5000 });
		assert(await emptyState('packages-table') === 'No results', 'no match shows the "No results" empty-filtered template');
		await click('#packages-table [data-ln-table-clear-all]');
		await expectNames('packages-table', 0, PACKAGES, 'Clear all filters restores every row');
		const input = await page.evaluate(() => document.querySelector('input[data-ln-search-for="packages"]').value);
		assert(input === '', 'Clear all filters also empties the search input');
	});

	await check('Packages: sort by column', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before sort');
		await clickSort('packages-table', 'name', 'asc');
		await expectNames('packages-table', 0, ['Enterprise', 'Legacy', 'Professional', 'Starter'], 'name asc');
		let s = await sortState('packages-table', 'name');
		assert(s.state === 'asc' && s.aria === 'ascending', 'name list data-ln-sort-state="asc", th aria-sort="ascending"');
		await clickSort('packages-table', 'name', 'desc');
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Legacy', 'Enterprise'], 'name desc');
		await clickSort('packages-table', 'max_users', 'asc');
		await expectNames('packages-table', 0, ['Enterprise', 'Starter', 'Legacy', 'Professional'], 'max_users asc is numeric (0,5,10,25)');
		s = await sortState('packages-table', 'name');
		assert(s.state === 'none', 'sorting another column resets the name list to "none"');
		await clickSort('packages-table', 'max_documents', 'desc');
		await expectNames('packages-table', 0, ['Enterprise', 'Professional', 'Legacy', 'Starter'], 'max_documents desc (100000,1000,250,100)');
		await clickSort('packages-table', 'max_storage', 'asc');
		await expectNames('packages-table', 0, ['Starter', 'Legacy', 'Professional', 'Enterprise'], 'max_storage asc (5,10,50,500)');
		await clickSort('packages-table', 'max_storage', 'none');
		await expectNames('packages-table', 0, PACKAGES, 'none restores the server order');
	});

	await check('Packages: status filter popover, filter + search combined', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before filter');
		await click('button[data-ln-popover-for="filter-packages-active"]');
		await page.waitForFunction(() => document.getElementById('filter-packages-active').getAttribute('data-ln-popover') === 'open', { timeout: 5000 });
		assert(await page.evaluate(() => document.getElementById('filter-packages-active').matches(':popover-open')), 'popover opens (:popover-open)');
		await page.evaluate(() => document.querySelector('#filter-packages-active input[data-ln-filter-value="false"]').closest('label').click());
		await expectNames('packages-table', 0, ['Legacy'], 'status Inactive');
		assert(same(await checkedFilter('filter-packages-active'), ['false']), 'only "Inactive" checked, "All" unchecked');
		assert(await page.evaluate(() => document.querySelector('button[data-ln-popover-for="filter-packages-active"]').classList.contains('ln-filter-active')), 'header filter button marked ln-filter-active');
		await page.keyboard.press('Escape');
		await page.waitForFunction(() => document.querySelector('button[data-ln-popover-for="filter-packages-active"]').getAttribute('aria-expanded') === 'false', { timeout: 5000 });
		await clickFilter('filter-packages-active', 'active', 'false');
		await clickFilter('filter-packages-active', 'active', 'true');
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'status Active');
		await typeSearch('packages', 'e');
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'Active AND search "e" (all three names contain e)');
		await clearSearch('packages');
		await typeSearch('packages', 'st');
		await expectNames('packages-table', 0, ['Starter'], 'Active AND search "st"');
		await clickFilter('filter-packages-active', 'active', null);
		await expectNames('packages-table', 0, ['Starter'], 'resetting the filter leaves only the search');
		assert(await page.evaluate(() => !document.querySelector('button[data-ln-popover-for="filter-packages-active"]').classList.contains('ln-filter-active')), 'indicator cleared after reset');
	});

	await check('Packages modal: new mode, validation, create, row appears, modal closes', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');
		await click('#new-package');
		await waitModal('package-modal', true);
		let m = await modalState('package-modal');
		assert(m.mode === 'new' && m.attr === 'open', 'New package opens the modal with data-ln-modal-mode="new"');
		const title = await page.evaluate(() => Array.from(document.querySelectorAll('#package-modal [data-ln-modal-when]'))
			.filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent.trim()));
		assert(same(title, ['New package']), 'only the "new" title variant is visible');
		const form = await page.evaluate(() => ({ action: document.getElementById('package-form').getAttribute('action'), active: document.getElementById('pkg-active').checked, mu: document.getElementById('pkg-max-users').value }));
		assert(form.action === '/packages' && form.active && form.mu === '0', 'defaults: action "/packages", Active checked, max users 0');

		await click('#package-form button[type=submit]');
		await page.waitForFunction(() => document.getElementById('pkg-name').classList.contains('ln-validate-invalid'), { timeout: 3000 });
		assert((await modalState('package-modal')).open, 'empty submit keeps the modal open (required name)');
		assert(requests.filter(r => r.method === 'POST').length === 0, 'empty submit sends no request');
		assert(await page.evaluate(() => !document.querySelector('#package-form [data-ln-validate-error="required"]').hidden
			&& getComputedStyle(document.querySelector('#package-form [data-ln-validate-error="required"]')).display !== 'none'), '"Name is required." message shown');

		await page.type('#pkg-name', 'Zeta Test');
		await setInput('#pkg-max-users', '7');
		await setInput('#pkg-max-documents', '12');
		await setInput('#pkg-max-storage', '3');
		await click('#package-form button[type=submit]');
		await waitModal('package-modal', false);
		await expectNames('packages-table', 0, [...PACKAGES, 'Zeta Test'], 'created package appended');
		const post = requests.filter(r => r.method === 'POST');
		assert(post.length === 1 && post[0].url.endsWith('/docuflow/api/packages'), 'one POST to api/packages');
		const body = JSON.parse(post[0].body);
		assert(body.name === 'Zeta Test' && body.max_users === 7 && Number(body.max_documents) === 12 && Number(body.max_storage) === 3 && body.active === true,
			'POST body carries the typed values and active=true');
		const row = await page.evaluate(() => Array.from(document.querySelectorAll('#packages-table tbody tr')).pop().textContent.replace(/\s+/g, ' ').trim());
		assert(row.startsWith('Zeta Test 7 12 3 GB Active'), `new row text "Zeta Test 7 12 3 GB Active" (got "${row}")`);
		assert((await footer('packages-table')).total === '5', 'footer total is 5');
		assert(await page.evaluate(() => document.querySelector('#packages-view .page-title p').textContent.trim()) === '5 packages defined', 'header stat updates to "5 packages defined"');
	});

	await check('Packages modal: edit mode fills the record, PUT updates the row', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');
		await page.evaluate(() => {
			const tr = Array.from(document.querySelectorAll('#packages-table tbody tr')).find(t => t.cells[0].textContent.trim() === 'Legacy');
			tr.querySelector('a[data-ln-modal-mode="edit"]').click();
		});
		await waitModal('package-modal', true);
		const m = await modalState('package-modal');
		assert(m.mode === 'edit', 'edit link sets data-ln-modal-mode="edit"');
		const title = await page.evaluate(() => Array.from(document.querySelectorAll('#package-modal [data-ln-modal-when]'))
			.filter(e => getComputedStyle(e).display !== 'none').map(e => e.textContent.trim()));
		assert(same(title, ['Edit package — Legacy']), `edit title is "Edit package — Legacy" (got ${title.join('|')})`);
		await page.waitForFunction(() => document.getElementById('pkg-name').value === 'Legacy', { timeout: 3000 });
		const f = await formValues('package-form');
		assert(f.id === '4' && f.name === 'Legacy' && f.max_users === '10' && f.max_guests === '0' && f.max_standards === '2'
			&& f.max_documents === '250' && f.max_storage === '10' && !('active' in f),
			'form filled from the Legacy record (id 4, 10/0/2/250/10, active unchecked)');
		assert(await page.evaluate(() => document.getElementById('package-form').getAttribute('action')) === '/packages/4', 'form action becomes "/packages/4" (data-ln-form-action-edit)');

		await setInput('#pkg-name', 'Legacy Plus');
		await click('#package-form button[type=submit]');
		await waitModal('package-modal', false);
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Enterprise', 'Legacy Plus'], 'renamed in place');
		const put = requests.filter(r => r.method === 'PUT');
		assert(put.length === 1 && put[0].url.endsWith('/docuflow/api/packages/4'), 'one PUT to api/packages/4');
		assert(JSON.parse(put[0].body).name === 'Legacy Plus', 'PUT body carries the new name');
	});

	await check('Packages modal: Cancel and Escape close without saving', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.type('#pkg-name', 'Should not persist');
		await click('#package-modal footer [data-ln-modal-close]');
		await waitModal('package-modal', false);
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.keyboard.press('Escape');
		await waitModal('package-modal', false);
		assert(requests.filter(r => r.method !== 'GET').length === 0, 'no mutating request was sent');
		await expectNames('packages-table', 0, PACKAGES, 'rows unchanged');
	});

	await check('Packages modal: "New package" after an edit-save starts from the form defaults', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');
		await page.evaluate(() => {
			const tr = Array.from(document.querySelectorAll('#packages-table tbody tr')).find(t => t.cells[0].textContent.trim() === 'Legacy');
			tr.querySelector('a[data-ln-modal-mode="edit"]').click();
		});
		await waitModal('package-modal', true);
		await page.waitForFunction(() => document.getElementById('pkg-name').value === 'Legacy', { timeout: 3000 });
		await click('#package-form button[type=submit]');
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
		if (f.active !== '1') problems.push('Active unchecked');
		assert(problems.length === 0, `new-mode form equals the markup defaults (empty name and id, limits 0, Active checked); deviations: [${problems.join('; ')}]`);
	});

	await check('Packages: delete (two-click confirm) and referenced-package block', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');

		let sel = await rowSel('packages-table', 'Legacy', 0, '[data-ln-table-row-action="delete"]');
		assert(sel !== null, 'Legacy row has a delete button');
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming', { timeout: 3000 }, sel);
		assert(requests.filter(r => r.method === 'DELETE').length === 0, 'first click only arms the confirm (no request)');
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'Legacy removed (0 tenants reference it)');
		const del = requests.filter(r => r.method === 'DELETE');
		assert(del.length === 1 && del[0].url.endsWith('/docuflow/api/packages/4'), 'one DELETE to api/packages/4');
		assert((await footer('packages-table')).total === '3', 'footer total is 3');

		sel = await rowSel('packages-table', 'Starter', 0, '[data-ln-table-row-action="delete"]');
		await confirmClick(sel);
		await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-ln-toast-item]')).some(t => t.textContent.includes('2 tenants use this package')), { timeout: 5000 });
		assert((await toasts()).some(t => t.includes('Blocked') && t.includes('2 tenants use this package')), 'toast "Blocked — 2 tenants use this package"');
		assert(requests.filter(r => r.method === 'DELETE').length === 1, 'no second DELETE was sent for the referenced package');
		await expectNames('packages-table', 0, ['Starter', 'Professional', 'Enterprise'], 'Starter is still listed');
	});

	// ═══ 5. Tenants ═══════════════════════════════════════════

	await check('Tenants: table renders the seed rows with joined package names', async () => {
		await fresh();
		await clickNav('tenants', '/tenants');
		await expectNames('tenants-table', 1, TENANTS, 'tenants in server order');
		const v = await page.evaluate(() => ({
			table: !!document.getElementById('tenants-table').lnTable,
			heading: document.querySelector('#tenants-view .page-title p').textContent.replace(/\s+/g, ' ').trim(),
			rows: Array.from(document.querySelectorAll('#tenants-table tbody tr')).map(tr => Array.from(tr.cells).slice(1, 7).map(c => c.textContent.replace(/\s+/g, ' ').trim()).join('|'))
		}));
		assert(v.table, 'ln-table mounted');
		assert(v.heading === '5 tenants registered', 'ln-stat in the page header reads "5 tenants registered"');
		assert(same(v.rows, [
			'Acme Corp|acme||Starter|Local|Active',
			'Globex|globex|globex.example.com|Starter|LDAP|Active',
			'Initech|initech||Professional|Local|Active',
			'Umbrella|umbrella|umbrella.example.com|Professional|LDAP|Active',
			'Wayne Enterprises|wayne||Enterprise|Local|Active'
		]), 'rows: name|slug|domain|package_name (joined from packages)|auth|status');
		const f = await footer('tenants-table');
		assert(f.total === '5' && f.filteredHidden, 'footer total 5, filtered note hidden');
	});

	await check('Tenants: search over name, slug and custom_domain', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before search');
		await typeSearch('tenants', 'example');
		await expectNames('tenants-table', 1, ['Globex', 'Umbrella'], 'search "example" matches custom_domain');
		await clearSearch('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'clear restores all');
		await typeSearch('tenants', 'wayne');
		await expectNames('tenants-table', 1, ['Wayne Enterprises'], 'search "wayne" matches slug and name');
		const f = await footer('tenants-table');
		assert(f.total === '5' && f.filtered === '1', 'footer total 5, filtered 1');
		await clearSearch('tenants');
		await typeSearch('tenants', 'nomatch');
		await page.waitForFunction(() => !!document.querySelector('#tenants-table .ln-table__empty-state'), { timeout: 5000 });
		assert(await emptyState('tenants-table') === 'No results', 'no match shows "No results"');
	});

	await check('Tenants: sort by name and slug', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before sort');
		await clickSort('tenants-table', 'name', 'desc');
		await expectNames('tenants-table', 1, ['Wayne Enterprises', 'Umbrella', 'Initech', 'Globex', 'Acme Corp'], 'name desc');
		await clickSort('tenants-table', 'slug', 'asc');
		await expectNames('tenants-table', 1, ['Acme Corp', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'], 'slug asc (acme, globex, initech, umbrella, wayne)');
		const s = await sortState('tenants-table', 'name');
		assert(s.state === 'none', 'name list reset when slug is sorted');
		await clickSort('tenants-table', 'slug', 'none');
		await expectNames('tenants-table', 1, TENANTS, 'none restores the server order');
	});

	await check('Tenants: auth and status column filters', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before filter');
		await clickFilter('filter-tenants-auth', 'auth_method', 'LDAP');
		await expectNames('tenants-table', 1, ['Globex', 'Umbrella'], 'auth LDAP');
		assert(await page.evaluate(() => document.querySelector('button[data-ln-popover-for="filter-tenants-auth"]').classList.contains('ln-filter-active')), 'auth header button marked ln-filter-active');
		await clickFilter('filter-tenants-auth', 'auth_method', 'LDAP');
		await clickFilter('filter-tenants-auth', 'auth_method', 'Local');
		await expectNames('tenants-table', 1, ['Acme Corp', 'Initech', 'Wayne Enterprises'], 'auth Local');
		await typeSearch('tenants', 'a');
		await expectNames('tenants-table', 1, ['Acme Corp', 'Wayne Enterprises'], 'Local AND search "a" (Initech has no "a" in name/slug/domain)');
		await clearSearch('tenants');
		await clickFilter('filter-tenants-auth', 'auth_method', null);
		await clickFilter('filter-tenants-active', 'active', 'false');
		await page.waitForFunction(() => !!document.querySelector('#tenants-table .ln-table__empty-state'), { timeout: 5000 });
		assert(await emptyState('tenants-table') === 'No results', 'status Inactive: no tenant is inactive, "No results" shown');
		await clickFilter('filter-tenants-active', 'active', null);
		await expectNames('tenants-table', 1, TENANTS, 'status "All" restores every row');
	});

	await check('Tenants: row selection and bulk delete', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before');
		const hidden = () => page.evaluate(() => document.getElementById('bulk-delete-tenants').classList.contains('hidden'));
		assert(await hidden(), 'bulk delete button is hidden with no selection');
		await page.evaluate(() => {
			const rows = document.querySelectorAll('#tenants-table tbody tr');
			rows[1].querySelector('input[data-ln-table-row-select]').click();
			rows[3].querySelector('input[data-ln-table-row-select]').click();
		});
		await page.waitForFunction(() => document.querySelector('#tenants-table [data-ln-table-selected]').textContent.trim() === '2', { timeout: 3000 });
		assert(!(await hidden()), 'bulk delete button shown with 2 selected, "Delete selected (2)"');
		await page.evaluate(() => document.querySelectorAll('#tenants-table tbody tr')[1].querySelector('input[data-ln-table-row-select]').click());
		await page.waitForFunction(() => document.querySelector('#tenants-table [data-ln-table-selected]').textContent.trim() === '1', { timeout: 3000 });
		await page.evaluate(() => document.querySelectorAll('#tenants-table tbody tr')[1].querySelector('input[data-ln-table-row-select]').click());
		await page.waitForFunction(() => document.querySelector('#tenants-table [data-ln-table-selected]').textContent.trim() === '2', { timeout: 3000 });
		await confirmClick('#bulk-delete-tenants');
		await expectNames('tenants-table', 1, ['Acme Corp', 'Initech', 'Wayne Enterprises'], 'Globex and Umbrella removed');
		const del = requests.filter(r => r.method === 'DELETE');
		assert(del.length === 1 && del[0].url.endsWith('/docuflow/api/tenants/bulk-delete'), 'one DELETE to api/tenants/bulk-delete');
		assert(same(JSON.parse(del[0].body).ids.map(Number).sort(), [2, 4]), 'bulk body ids are [2,4]');
		assert((await footer('tenants-table')).total === '3', 'footer total is 3');
	});

	await check('Tenants: single-row delete (two-click confirm)', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before');
		const sel = await rowSel('tenants-table', 'Wayne Enterprises', 1, '[data-ln-table-row-action="delete"]');
		await confirmClick(sel);
		await expectNames('tenants-table', 1, ['Acme Corp', 'Globex', 'Initech', 'Umbrella'], 'Wayne Enterprises removed');
		const del = requests.filter(r => r.method === 'DELETE');
		assert(del.length === 1 && del[0].url.endsWith('/docuflow/api/tenants/5'), 'one DELETE to api/tenants/5');
	});

	await check('Tenants create modal: validation, package options, create', async () => {
		await fresh('tenants');
		await expectNames('tenants-table', 1, TENANTS, 'before');
		await click('#new-tenant');
		await waitModal('tenant-modal', true);
		const opts = await page.evaluate(() => Array.from(document.querySelectorAll('#tc-tenant-package-id option')).map(o => o.value + ':' + o.textContent.trim()));
		assert(same(opts, [':Select a package…', '1:Starter', '2:Professional', '3:Enterprise', '4:Legacy']), 'package <select> is filled by ln-options from the packages store');
		await click('#tenant-create-form button[type=submit]');
		await page.waitForFunction(() => document.getElementById('tc-tenant-name').classList.contains('ln-validate-invalid'), { timeout: 3000 });
		assert((await modalState('tenant-modal')).open && requests.filter(r => r.method === 'POST').length === 0, 'empty submit keeps the modal open and sends nothing');

		await page.type('#tc-tenant-name', 'Test Co');
		await page.waitForFunction(() => document.getElementById('tc-tenant-slug').value === 'test-co', { timeout: 3000 });
		assert(true, 'slug is derived from the name ("test-co") by ln-slug');
		await page.select('#tc-tenant-package-id', '2');
		await page.select('#tc-tenant-auth-method', 'LDAP');
		await click('#tenant-create-form button[type=submit]');
		await waitModal('tenant-modal', false);
		await expectNames('tenants-table', 1, [...TENANTS, 'Test Co'], 'created tenant appended');
		const post = requests.filter(r => r.method === 'POST');
		assert(post.length === 1 && post[0].url.endsWith('/docuflow/api/tenants'), 'one POST to api/tenants');
		const b = JSON.parse(post[0].body);
		assert(b.name === 'Test Co' && b.slug === 'test-co' && Number(b.package_id) === 2 && b.auth_method === 'LDAP' && b.active === true,
			'POST body: name, slug test-co, package_id 2, LDAP, active');
		const row = await page.evaluate(() => Array.from(document.querySelectorAll('#tenants-table tbody tr')).pop().textContent.replace(/\s+/g, ' ').trim());
		assert(row.includes('Test Co') && row.includes('test-co') && row.includes('Professional') && row.includes('LDAP') && row.includes('Active'),
			`new row shows name, slug, joined package "Professional", LDAP, Active (got "${row}")`);
		assert((await footer('tenants-table')).total === '6', 'footer total is 6');
	});

	// ═══ 6. Tenant editor ═════════════════════════════════════

	await check('Tenant editor: opened from the list, form filled from the record', async () => {
		await fresh();
		await clickNav('tenants', '/tenants');
		await page.waitForSelector('#tenants-table tbody tr a[href="tenants/1"]');
		await click('#tenants-table tbody tr a[href="tenants/1"]');
		await waitPath('/tenants/1');
		await page.waitForFunction(() => document.getElementById('tenant-name').value !== '', { timeout: 5000 });
		const c = await current();
		assert(c.pattern === '/tenants/:id' && c.loc === '/spa/tenants/1' && c.title === 'Tenant — DocuFlow', 'route /tenants/:id, URL /spa/tenants/1, title "Tenant — DocuFlow"');
		const v = await page.evaluate(() => ({
			mounted: !!document.getElementById('tenant-editor').docuflowTenantEditor,
			h1: document.querySelector('#tenant-editor h1').textContent.replace(/\s+/g, ' ').trim(),
			crumb: document.querySelector('#tenant-editor li[aria-current="page"]').textContent.trim(),
			opts: Array.from(document.querySelectorAll('#tenant-package-id option')).map(o => o.value + ':' + o.textContent.trim()),
			action: document.getElementById('tenant-form').getAttribute('action'),
			active: document.getElementById('tenant-active').checked,
			rc: document.getElementById('tenant-read-confirmation').checked
		}));
		assert(v.mounted, 'docuflowTenantEditor mounted on #tenant-editor');
		assert(v.h1 === 'Edit tenant — Acme Corp' && v.crumb === 'Acme Corp', 'h1 and breadcrumb filled with "Acme Corp" (data-ln-field="name")');
		assert(same(v.opts, [':Select a package…', '1:Starter', '2:Professional', '3:Enterprise', '4:Legacy']), 'package options loaded');
		const f = await formValues('tenant-form');
		assert(f.id === '1' && f.name === 'Acme Corp' && f.custom_domain === '' && f.package_id === '1' && f.auth_method === 'Local'
			&& f.doc_numbering_scheme === '{TYPE}-{SEQ:4}' && f.review_interval === '365'
			&& f.brand_primary === '#2563eb' && f.brand_secondary === '#1e40af', 'form values equal the Acme Corp seed record');
		assert(v.active && v.rc, 'Active and Read confirmation checkboxes checked (seed: both true)');
		assert(v.action === '/tenants/1', `form action is "/tenants/1" via data-ln-form-action-edit (got ${v.action})`);
		assert(f.slug === 'acme', `slug field equals the record slug "acme" and is not overwritten from the name (got "${f.slug}")`);
	});

	await check('Tenant editor: second record via deep link', async () => {
		await fresh('tenants/4');
		await page.waitForFunction(() => document.getElementById('tenant-name').value !== '', { timeout: 5000 });
		const f = await formValues('tenant-form');
		assert(f.id === '4' && f.name === 'Umbrella' && f.custom_domain === 'umbrella.example.com' && f.package_id === '2' && f.auth_method === 'LDAP',
			'tenants/4 fills Umbrella: domain umbrella.example.com, package 2, LDAP');
		assert(!('read_confirmation' in f), 'Umbrella has read_confirmation false: checkbox unchecked');
		assert(f.slug === 'umbrella', `slug field equals the record slug "umbrella" (got "${f.slug}")`);
	});

	await check('Tenant editor: validation blocks save, valid save sends PUT and toasts', async () => {
		await fresh('tenants/1');
		await page.waitForFunction(() => document.getElementById('tenant-name').value === 'Acme Corp', { timeout: 5000 });
		await setInput('#tenant-name', '');
		await click('#tenant-form button[type=submit]');
		await page.waitForFunction(() => document.getElementById('tenant-name').classList.contains('ln-validate-invalid'), { timeout: 3000 });
		assert(requests.filter(r => r.method !== 'GET').length === 0, 'empty required name blocks the submit (no request)');

		await setInput('#tenant-name', 'Acme Renamed');
		await setInput('#tenant-custom-domain', 'acme.example.com');
		await click('#tenant-form button[type=submit]');
		await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-ln-toast-item]')).some(t => t.textContent.includes('Tenant saved successfully')), { timeout: 6000 });
		assert((await toasts()).some(t => t.includes('Tenant updated')), 'toast "Tenant updated — Tenant saved successfully"');
		const put = requests.filter(r => r.method === 'PUT');
		assert(put.length === 1 && put[0].url.endsWith('/docuflow/api/tenants/1'), 'one PUT to api/tenants/1');
		const b = JSON.parse(put[0].body);
		assert(b.name === 'Acme Renamed' && b.custom_domain === 'acme.example.com' && Number(b.package_id) === 1, 'PUT body: new name, custom_domain, package_id 1');
		await page.evaluate(() => document.querySelector('#tenant-editor nav[aria-label="Breadcrumb"] a[href="tenants"]').click());
		await waitPath('/tenants');
		await expectNames('tenants-table', 1, ['Acme Renamed', 'Globex', 'Initech', 'Umbrella', 'Wayne Enterprises'], 'list shows the renamed tenant');
	});

	await check('Tenant editor: Cancel link returns to the tenants list', async () => {
		await fresh('tenants/2');
		await page.waitForFunction(() => document.getElementById('tenant-name').value === 'Globex', { timeout: 5000 });
		await click('#tenant-form a.btn-outline');
		await waitPath('/tenants');
		assert((await current()).title === 'Tenants — DocuFlow', 'Cancel routes to /tenants');
		assert(requests.filter(r => r.method !== 'GET').length === 0, 'Cancel sends no request');
	});

	await check('Tenant editor: sidebar nav state (source: ln-nav resolves relative hrefs against location)', async () => {
		await fresh('tenants/1');
		await page.waitForFunction(() => document.getElementById('tenant-name').value !== '', { timeout: 5000 });
		const links = await page.evaluate(() => ({
			dash: document.querySelector('nav[aria-label="Main navigation"] a[href="./"]').getAttribute('aria-current'),
			pk: document.querySelector('nav[aria-label="Main navigation"] a[href="packages"]').getAttribute('aria-current'),
			tn: document.querySelector('nav[aria-label="Main navigation"] a[href="tenants"]').getAttribute('aria-current')
		}));
		// [source] ln-nav.js update(): new URL('tenants', location.href) resolves to /spa/tenants/tenants on
		// /spa/tenants/1, so the Tenants link is NOT marked there although ln-nav README documents parent-prefix matching.
		assert(links.pk === null, 'Packages link is not marked on /tenants/1');
		assert(links.tn === null, '[source] Tenants link is not marked on /tenants/1 (documented parent-prefix match does not apply to relative hrefs)');
	});

	// ═══ 7. Reset demo data ═══════════════════════════════════

	await check('Reset demo data: sidebar button restores the backend and re-syncs both stores', async () => {
		await fresh('packages');
		await expectNames('packages-table', 0, PACKAGES, 'before');
		await click('#new-package');
		await waitModal('package-modal', true);
		await page.type('#pkg-name', 'Injected');
		await click('#package-form button[type=submit]');
		await waitModal('package-modal', false);
		await expectNames('packages-table', 0, [...PACKAGES, 'Injected'], 'package created through the modal');
		await click('#reset-demo');
		await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-ln-toast-item]')).some(t => t.textContent.includes('Demo data has been reset')), { timeout: 6000 });
		assert(true, 'toast "Demo data has been reset" shown');
		await expectNames('packages-table', 0, PACKAGES, 'after reset the table is back to the 4 seed packages');
	});

	// ─── Finish ────────────────────────────────────────────────

	await resetBackend().catch(err => failures.push('final reset: ' + err.message));

	if (failures.length) {
		console.error(`\n${failures.length} section(s) failed:`);
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
