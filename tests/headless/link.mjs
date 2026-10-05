import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/link.html (three live demos:
// two [data-ln-link] tables and one <article data-ln-link>) and
// components/ln-link/src/ln-link.js (click/hover/destroy/observer contract).

const PAGE_URL = BASE_URL + 'link.html';

// Table 1 (Table with clickable rows): row -> href of its first <a>.
const T1_HREFS = ['tables.html', 'forms.html', 'cards.html', 'icons.html'];
// Table 2 (Rows with interactive elements).
const T2_HREFS = ['typography.html', 'layout.html'];
const ARTICLE = 'article[data-ln-link]';
const ARTICLE_HREF = 'index.html';

run('demo/admin/link.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated so one broken demo behaviour does not hide the rest;
	// failures are collected and re-thrown at the end (run exits 1).
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// Waits until ln-link has initialised every demo container and its rows.
	async function ready() {
		await page.waitForFunction((t1, t2, art) => {
			const tables = document.querySelectorAll('table[data-ln-link]');
			if (tables.length !== 2) return false;
			if (!Array.from(tables).every(t => t.lnLinkInit === true)) return false;
			const rows = document.querySelectorAll('table[data-ln-link] tbody tr');
			if (rows.length !== t1 + t2) return false;
			if (!Array.from(rows).every(r => r.lnLinkRow === true)) return false;
			const article = document.querySelector(art);
			return !!article && article.lnLinkInit === true && article.lnLinkRow === true;
		}, { timeout: 10000 }, T1_HREFS.length, T2_HREFS.length, ARTICLE);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await ready();
	}

	// Clicks a cell of a row with a real mouse click. cellIndex: 0 name, 1 email/date, 2 status/actions.
	async function clickCell(n, i, cellIndex, opts) {
		await page.evaluate((tn, ri, ci) => {
			document.querySelectorAll('[data-test-mark]').forEach(el => el.removeAttribute('data-test-mark'));
			const row = document.querySelectorAll('table[data-ln-link]')[tn - 1].tBodies[0].rows[ri - 1];
			row.cells[ci].setAttribute('data-test-mark', 'cell');
		}, n, i, cellIndex);
		await page.click('[data-test-mark="cell"]', opts);
	}

	const currentFile = () => page.evaluate(() => location.pathname.split('/').pop());

	// Records ln-link:navigate events and (optionally) cancels them.
	function spyNavigate(cancel) {
		return page.evaluate(c => {
			window.__nav = [];
			document.addEventListener('ln-link:navigate', e => {
				window.__nav.push({
					href: e.detail.href,
					targetIsRow: e.detail.target === e.target,
					linkIsAnchor: e.detail.link instanceof HTMLAnchorElement,
					linkHref: e.detail.link.getAttribute('href'),
					cancelable: e.cancelable
				});
				if (c) e.preventDefault();
			});
		}, !!cancel);
	}

	const navEvents = () => page.evaluate(() => window.__nav);

	async function clickAndNavigate(n, i, cellIndex) {
		await Promise.all([
			page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
			clickCell(n, i, cellIndex)
		]);
	}

	// ─── Structure ─────────────────────────────────────────────

	await check('Structure and initialisation', async () => {
		await load();
		const info = await page.evaluate(() => ({
			tables: document.querySelectorAll('table[data-ln-link]').length,
			rows: Array.from(document.querySelectorAll('table[data-ln-link]'))
				.map(t => Array.from(t.tBodies[0].rows).map(r => r.querySelector('a').getAttribute('href'))),
			articles: document.querySelectorAll('article[data-ln-link]').length,
			articleHref: document.querySelector('article[data-ln-link] a').getAttribute('href'),
			apiInit: typeof window.lnLink.init,
			apiDestroy: typeof window.lnLink.destroy,
			statusEls: document.querySelectorAll('body > .ln-link-status').length,
			statusVisible: document.querySelector('.ln-link-status').classList.contains('ln-link-status--visible'),
			plainBehaviourTable: document.querySelectorAll('table:not([data-ln-link]) tbody tr').length
		}));
		assert(info.tables === 2, 'Two [data-ln-link] tables are mounted');
		assert(JSON.stringify(info.rows[0]) === JSON.stringify(T1_HREFS), `Table 1 rows link to ${T1_HREFS.join(', ')}`);
		assert(JSON.stringify(info.rows[1]) === JSON.stringify(T2_HREFS), `Table 2 rows link to ${T2_HREFS.join(', ')}`);
		assert(info.articles === 1 && info.articleHref === ARTICLE_HREF, 'Generic container article links to index.html');
		assert(info.apiInit === 'function' && info.apiDestroy === 'function', 'window.lnLink exposes init and destroy');
		assert(info.statusEls === 1, 'Exactly one .ln-link-status element is appended to body');
		assert(info.statusVisible === false, 'Status bar is hidden before any hover');
		assert(info.plainBehaviourTable === 5, 'Behavior table (no data-ln-link) is untouched (5 rows, not initialised)');
		const behaviourInit = await page.evaluate(() => document.querySelector('table:not([data-ln-link])')
			&& Array.from(document.querySelectorAll('table:not([data-ln-link]) tbody tr')).some(r => r.lnLinkRow));
		assert(!behaviourInit, 'Rows of tables without data-ln-link are not initialised');
	});

	// ─── Row click navigates ───────────────────────────────────

	await check('Table 1: clicking a non-link cell navigates to the first anchor', async () => {
		for (let i = 0; i < T1_HREFS.length; i++) {
			await load();
			await clickAndNavigate(1, i + 1, 1);
			const file = await currentFile();
			assert(file === T1_HREFS[i], `Row ${i + 1} email cell click navigates to ${T1_HREFS[i]} (got ${file})`);
		}
	});

	await check('Table 1: clicking the status cell (badge) navigates too', async () => {
		await load();
		await clickAndNavigate(1, 2, 2);
		const file = await currentFile();
		assert(file === T1_HREFS[1], `Status cell click navigates to ${T1_HREFS[1]} (got ${file})`);
	});

	await check('Generic container: clicking the paragraph navigates', async () => {
		await load();
		await Promise.all([
			page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
			page.click(`${ARTICLE} p`)
		]);
		const file = await currentFile();
		assert(file === ARTICLE_HREF, `Article paragraph click navigates to ${ARTICLE_HREF} (got ${file})`);
	});

	// ─── Event contract ────────────────────────────────────────

	await check('ln-link:navigate is cancelable and carries target/href/link', async () => {
		await load();
		await spyNavigate(true);
		await clickCell(1, 3, 1);
		await page.waitForFunction(() => window.__nav.length === 1, { timeout: 5000 });
		const ev = (await navEvents())[0];
		assert(ev.cancelable === true, 'Event is cancelable');
		assert(ev.href === 'cards.html', 'detail.href is the anchor href attribute');
		assert(ev.linkHref === 'cards.html' && ev.linkIsAnchor, 'detail.link is the first anchor');
		assert(ev.targetIsRow, 'detail.target is the row (event target)');
		assert((await currentFile()) === 'link.html', 'Cancelled event prevents navigation');
	});

	await check('Cancelled navigate does not call link.click()', async () => {
		await load();
		await spyNavigate(true);
		await page.evaluate(() => {
			window.__anchorClicks = 0;
			document.querySelector('table[data-ln-link] tbody tr a').addEventListener('click', e => {
				window.__anchorClicks++;
				e.preventDefault();
			});
		});
		await clickCell(1, 1, 1);
		await page.waitForFunction(() => window.__nav.length === 1, { timeout: 5000 });
		assert((await page.evaluate(() => window.__anchorClicks)) === 0, 'Anchor received no click when navigate was cancelled');
	});

	await check('Uncancelled navigate delegates a native click to the anchor', async () => {
		await load();
		await spyNavigate(false);
		await page.evaluate(() => {
			window.__anchorClicks = 0;
			document.querySelector('table[data-ln-link] tbody tr a').addEventListener('click', e => {
				window.__anchorClicks++;
				e.preventDefault();
			});
		});
		await clickCell(1, 1, 1);
		await page.waitForFunction(() => window.__anchorClicks === 1, { timeout: 5000 });
		assert((await page.evaluate(() => window.__anchorClicks)) === 1, 'Anchor received exactly one delegated click');
		assert((await navEvents()).length === 1, 'One navigate event fired');
	});

	// ─── Bypass of interactive targets ─────────────────────────

	await check('Direct anchor click is not intercepted', async () => {
		await load();
		await spyNavigate(false);
		await page.evaluate(() => {
			document.querySelector('table[data-ln-link] tbody tr a').addEventListener('click', e => e.preventDefault());
		});
		await page.click('table[data-ln-link] tbody tr a');
		assert((await navEvents()).length === 0, 'No ln-link:navigate event for a click on the anchor itself');
	});

	await check('Delete button click does not navigate', async () => {
		await load();
		await spyNavigate(false);
		await page.evaluate(() => {
			window.__toasts = [];
			window.addEventListener('ln-toast:enqueue', e => window.__toasts.push(e.detail.message));
		});
		await page.evaluate(() => {
			document.querySelectorAll('table[data-ln-link]')[1].tBodies[0].rows[0].querySelector('button').setAttribute('data-test-mark', 'btn');
		});
		await page.click('[data-test-mark="btn"]');
		await page.waitForFunction(() => window.__toasts.length === 1, { timeout: 5000 });
		assert((await page.evaluate(() => window.__toasts[0])) === 'Delete clicked! (demo)', 'Button handler ran (ln-toast:enqueue dispatched)');
		assert((await navEvents()).length === 0, 'No ln-link:navigate event for a click on the button');
		assert((await currentFile()) === 'link.html', 'Page did not navigate');
	});

	await check('Table 2: clicking the date cell navigates to the first anchor', async () => {
		await load();
		await clickAndNavigate(2, 2, 1);
		const file = await currentFile();
		assert(file === T2_HREFS[1], `Date cell click navigates to ${T2_HREFS[1]} (got ${file})`);
	});

	// ─── Ctrl/Cmd click ────────────────────────────────────────

	await check('Ctrl+click opens a new tab and does not navigate', async () => {
		await load();
		await spyNavigate(false);
		await page.evaluate(() => {
			window.__open = [];
			window.open = (...args) => { window.__open.push(args); return null; };
		});
		await page.keyboard.down('Control');
		try {
			await clickCell(1, 2, 1);
		} finally {
			await page.keyboard.up('Control');
		}
		await page.waitForFunction(() => window.__open.length === 1, { timeout: 5000 });
		const args = await page.evaluate(() => window.__open[0]);
		assert(args[0] === 'forms.html' && args[1] === '_blank' && args[2] === 'noopener,noreferrer',
			'window.open(href, "_blank", "noopener,noreferrer") called');
		assert((await navEvents()).length === 0, 'No navigate event on Ctrl+click');
		assert((await currentFile()) === 'link.html', 'Current page did not navigate');
	});

	// ─── Hover status bar ──────────────────────────────────────

	await check('Hover shows the target URL in the status bar, leaving hides it', async () => {
		await load();
		await page.evaluate(() => {
			document.querySelectorAll('table[data-ln-link]')[0].tBodies[0].rows[2].cells[1].setAttribute('data-test-mark', 'cell');
		});
		await page.hover('[data-test-mark="cell"]');
		await page.waitForFunction(() => {
			const el = document.querySelector('.ln-link-status');
			return el.classList.contains('ln-link-status--visible') && el.textContent === 'cards.html';
		}, { timeout: 5000 });
		assert(true, 'Status bar visible with text "cards.html" on row hover');
		await page.mouse.move(2, 2);
		await page.waitForFunction(() => !document.querySelector('.ln-link-status').classList.contains('ln-link-status--visible'), { timeout: 5000 });
		assert(true, 'Status bar hidden after mouse leaves the row');
	});

	await check('Hover on the generic container shows its URL', async () => {
		await load();
		await page.hover(`${ARTICLE} p`);
		await page.waitForFunction(() => {
			const el = document.querySelector('.ln-link-status');
			return el.classList.contains('ln-link-status--visible') && el.textContent === 'index.html';
		}, { timeout: 5000 });
		assert(true, 'Status bar shows "index.html" on article hover');
	});

	// ─── Dynamic DOM / API ─────────────────────────────────────

	await check('Rows added later are initialised by the observer; rows without an anchor are not', async () => {
		await load();
		await page.evaluate(() => {
			const tbody = document.querySelectorAll('table[data-ln-link]')[0].tBodies[0];
			const withLink = document.createElement('tr');
			withLink.id = 'dyn-link';
			withLink.innerHTML = '<td>Dyn</td><td><a href="typography.html">Dyn link</a></td>';
			const noLink = document.createElement('tr');
			noLink.id = 'dyn-nolink';
			noLink.innerHTML = '<td>None</td><td>no anchor</td>';
			tbody.appendChild(withLink);
			tbody.appendChild(noLink);
		});
		await page.waitForFunction(() => document.getElementById('dyn-link').lnLinkRow === true, { timeout: 5000 });
		assert(true, 'Dynamically appended row with an anchor is initialised');
		assert((await page.evaluate(() => document.getElementById('dyn-nolink').lnLinkRow)) === undefined,
			'Dynamically appended row without an anchor is not initialised');
		await Promise.all([
			page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
			page.evaluate(() => document.getElementById('dyn-link').cells[0].setAttribute('data-test-mark', 'cell'))
				.then(() => page.click('[data-test-mark="cell"]'))
		]);
		assert((await currentFile()) === 'typography.html', 'Click on the dynamic row navigates to its anchor');
	});

	await check('lnLink.destroy removes row behaviour; lnLink.init restores it', async () => {
		await load();
		await spyNavigate(false);
		await page.evaluate(() => window.lnLink.destroy(document.querySelectorAll('table[data-ln-link]')[1]));
		const state = await page.evaluate(() => ({
			init: document.querySelectorAll('table[data-ln-link]')[1].lnLinkInit,
			rows: Array.from(document.querySelectorAll('table[data-ln-link]')[1].tBodies[0].rows).map(r => r.lnLinkRow)
		}));
		// evaluate() serialises undefined array items to null, so test falsiness.
		assert(!state.init && state.rows.length === 2 && state.rows.every(v => !v), `destroy clears container and row flags (got ${JSON.stringify(state)})`);
		await page.evaluate(() => document.querySelectorAll('table[data-ln-link]')[1].tBodies[0].rows[0].cells[1].setAttribute('data-test-mark', 'cell'));
		await page.click('[data-test-mark="cell"]');
		assert((await navEvents()).length === 0, 'Click on a destroyed row fires no navigate event');
		assert((await currentFile()) === 'link.html', 'Click on a destroyed row does not navigate');
		await page.evaluate(() => window.lnLink.init(document.body));
		await page.waitForFunction(() => document.querySelectorAll('table[data-ln-link]')[1].tBodies[0].rows[0].lnLinkRow === true, { timeout: 5000 });
		assert(true, 'init(document.body) re-initialises the rows');
	});

	await check('Removing data-ln-link from a container destroys its behaviour', async () => {
		await load();
		await page.evaluate(() => document.querySelector('article[data-ln-link]').removeAttribute('data-ln-link'));
		await page.waitForFunction(() => document.querySelector('.demo-link-article').lnLinkRow === undefined, { timeout: 5000 });
		assert(true, 'Article row flag cleared after attribute removal');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
