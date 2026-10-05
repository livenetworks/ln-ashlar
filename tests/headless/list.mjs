import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/list.html (the #hybrid-list demo)
// and the components it mounts: ln-list (windowed data-driven mode), ln-search,
// ln-data-coordinator / ln-data-store / ln-api-connector, ln-core window-cache.
// The backend (demo/admin/data/api.php) is the real served PHP endpoint; no request
// interception is used.

const PAGE_URL = BASE_URL + 'list.html';
const API_URL = BASE_URL + 'data/api.php';

const LIST = '#hybrid-list';
const INPUT = 'input[data-ln-search-for="hybrid-docs"]';
const WINDOW_PAGE = 200; // data-ln-list-window-page
const GRAND_TOTAL = 10000; // data-ln-list-count
const SEARCH_TERM = 'security policy';

run('demo/admin/list.html', async ({ page }) => {

	// ─── Network tracking (list page requests only: they carry offset=) ───

	let requests = [];
	let inflight = 0;
	page.on('request', req => {
		if (req.url().includes('api.php') && req.url().includes('offset=')) {
			requests.push(new URL(req.url()));
			inflight++;
		}
	});
	const done = req => {
		if (req.url().includes('api.php') && req.url().includes('offset=')) inflight = Math.max(0, inflight - 1);
	};
	page.on('requestfinished', done);
	page.on('requestfailed', done);

	// ─── Section runner: a failing section does not stop the others ───

	const failures = [];
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// ─── Page helpers ──────────────────────────────────────────

	const wait = (fn, arg) => page.waitForFunction(fn, { timeout: 10000 }, arg).then(() => true, () => false);

	const renderedCount = () => page.evaluate(() =>
		(document.getElementById('hybrid-log').textContent.match(/'ln-list:rendered'/g) || []).length);

	// Fresh page; waits for the SSR seed to hydrate and the initial window fetch to land.
	async function load() {
		requests = [];
		inflight = 0;
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => {
			const ul = document.getElementById('hybrid-list');
			const log = document.getElementById('hybrid-log').textContent;
			return ul && ul.lnList && log.includes("'ln-list:ready'") && log.includes("'ln-list:rendered'");
		}, { timeout: 10000 });
		await wait(() => true);
		const deadline = Date.now() + 8000;
		while (Date.now() < deadline) {
			if (requests.length > 0 && inflight === 0 && (await renderedCount()) >= 2) break;
			await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())));
		}
		// Quiet = neither the list nor the log mutated for 45 consecutive frames and no request is in flight
		// (the store's follow-up events re-render the list shortly after the first window lands).
		const quiet = async () => {
			await page.evaluate(() => new Promise(resolve => {
				let still = 0;
				let dirty = false;
				const mo = new MutationObserver(() => { dirty = true; });
				mo.observe(document.getElementById('hybrid-list'), { childList: true, subtree: true, attributes: true });
				mo.observe(document.getElementById('hybrid-log'), { childList: true, subtree: true, characterData: true });
				const tick = () => {
					still = dirty ? 0 : still + 1;
					dirty = false;
					if (still >= 45) { mo.disconnect(); resolve(); } else requestAnimationFrame(tick);
				};
				requestAnimationFrame(tick);
			}));
		};
		do {
			await quiet();
		} while (inflight > 0);
	}

	const logText = () => page.evaluate(() => document.getElementById('hybrid-log').textContent);

	const labels = () => page.evaluate(() => ({
		total: document.getElementById('lbl-total').textContent,
		filtered: document.getElementById('lbl-filtered').textContent,
		filteredHidden: document.getElementById('lbl-filtered-wrap').classList.contains('hidden'),
		selected: document.getElementById('lbl-selected').textContent,
		selectedHidden: document.getElementById('lbl-selected-wrap').classList.contains('hidden')
	}));

	const itemTitles = () => page.evaluate(() => Array.from(document.querySelectorAll('#hybrid-list > li[data-ln-item]'))
		.map(li => li.querySelector('strong').textContent.trim()));

	const itemIds = () => page.evaluate(() => Array.from(document.querySelectorAll('#hybrid-list > li[data-ln-item]'))
		.map(li => Number(li.getAttribute('data-ln-item-id'))));

	const typeSearch = async term => {
		await page.focus(INPUT);
		await page.keyboard.type(term);
	};

	// The page header has its own <search>; scope to the one holding the list input.
	const clickClear = async () => {
		const btn = await page.evaluateHandle(sel => document.querySelector(sel).closest('search').querySelector('button[data-ln-search-clear]'), INPUT);
		await btn.asElement().click();
	};

	const inputValue = () => page.evaluate(sel => document.querySelector(sel).value, INPUT);

	// Waits for an item's checkbox to exist (real, rendered item), then clicks it.
	async function clickSelect(id) {
		const sel = `${LIST} > li[data-ln-item][data-ln-item-id="${id}"] [data-ln-item-select]`;
		await page.waitForSelector(sel, { timeout: 5000 });
		await page.click(sel);
	}

	const isSelected = id => page.evaluate(i => {
		const li = document.querySelector(`#hybrid-list > li[data-ln-item][data-ln-item-id="${i}"]`);
		return li ? {
			checked: li.querySelector('[data-ln-item-select]').checked,
			cls: li.classList.contains('ln-item-selected')
		} : null;
	}, id);

	// Oracle for the expected result count: the same served endpoint the demo calls.
	async function apiFiltered(search) {
		const res = await fetch(`${API_URL}?limit=1&search=${encodeURIComponent(search)}`);
		return (await res.json()).filtered;
	}

	// Number of server-printed items in the page markup (data-ln-item-id on <li>).
	async function seededCount() {
		const html = await (await fetch(PAGE_URL)).text();
		return (html.match(/data-ln-item-id="/g) || []).length;
	}

	// ═══ 1. SSR seed hydration ════════════════════════════════

	await section('SSR seed hydration', async () => {
		await load();
		const seeded = await seededCount();
		assert(seeded > 0, `page markup contains ${seeded} server-printed items`);
		const log = await logText();
		assert(log.includes(`'ln-list:ready' (Total parsed: ${seeded})`), `ln-list:ready reports all ${seeded} SSR items parsed`);
		assert(log.includes('Page loaded. 100 SSR pre-rendered items visible in list.'), 'page log line "Page loaded" is present');

		const first = await page.evaluate(() => {
			const li = document.querySelector('#hybrid-list > li[data-ln-item]');
			const badge = li.querySelector('.badge');
			return {
				id: li.getAttribute('data-ln-item-id'),
				title: li.querySelector('strong').textContent.trim(),
				author: li.querySelector('.card-tile-author').textContent.trim(),
				badge: badge.textContent.trim(),
				dept: badge.getAttribute('data-dept')
			};
		});
		assert(first.id === '1' && first.title === 'Security Policy #1', 'first rendered item is id 1 "Security Policy #1"');
		assert(first.author === 'By Sofia Risteska', 'row template filled owner ("By Sofia Risteska")');
		assert(first.badge === 'Operations' && first.dept === 'Operations', 'row template filled department text and data-dept via data-ln-attr');

		const l = await labels();
		assert(l.total === String(GRAND_TOTAL), `Total label shows the declared data-ln-list-count (${GRAND_TOTAL})`);
		assert(l.filteredHidden === true, 'Filtered wrap is hidden while visible === total');
		assert(l.selectedHidden === true, 'Selected wrap is hidden while nothing is selected');

		const geo = await page.evaluate(() => {
			const ul = document.getElementById('hybrid-list');
			return {
				spacer: ul.querySelectorAll(':scope > li.ln-list__spacer').length,
				scroll: ul.scrollHeight,
				client: ul.clientHeight
			};
		});
		assert(geo.spacer >= 1, 'windowed virtualization renders a bottom spacer li.ln-list__spacer');
		assert(geo.scroll > geo.client * 10, 'list scroll height is far larger than its viewport (virtual height for 10000 items)');
	});

	// ═══ 2. Initial window fetch ══════════════════════════════

	await section('Initial window fetch (source: padded range crosses the seeded edge)', async () => {
		await load();
		assert(requests.length >= 1, 'a page request reached api.php');
		const u = requests[0];
		assert(u.pathname.endsWith('/data/api.php'), 'request targets data/api.php (data-ln-api-base-url + data-ln-api-path)');
		assert(u.searchParams.get('offset') === '0' && u.searchParams.get('limit') === String(WINDOW_PAGE),
			`first request is page-aligned: offset=0, limit=${WINDOW_PAGE} (data-ln-list-window-page)`);
		assert(!u.searchParams.has('search'), 'no search param without a search term');
		assert((await logText()).includes(`'ln-list:request-data' (offset: 0, limit: ${WINDOW_PAGE})`), 'ln-list:request-data was emitted for it');
		// Page prose: "No fetch fires on load". Source: window-cache.ensure() pads the visible
		// range by data-ln-list-window-threshold (25) and the seed ends at 100, so one fetch fires.
	});

	// ═══ 3. Remote full-text search ═══════════════════════════

	await section(`Search "${SEARCH_TERM}" goes to the server`, async () => {
		await load();
		const expected = await apiFiltered(SEARCH_TERM);
		assert(expected > 0 && expected < GRAND_TOTAL, `server reports ${expected} matches for "${SEARCH_TERM}"`);
		await typeSearch(SEARCH_TERM);
		const settled = await wait(n => document.getElementById('lbl-filtered').textContent === String(n)
			&& !document.getElementById('lbl-filtered-wrap').classList.contains('hidden'), expected);
		assert(settled, `Filtered label shows ${expected}`);
		const last = requests[requests.length - 1];
		assert(last.searchParams.get('search') === SEARCH_TERM, `last request carries search="${SEARCH_TERM}"`);
		assert(last.searchParams.get('offset') === '0', 'a new query restarts the window at offset 0');
		const l = await labels();
		assert(l.total === String(GRAND_TOTAL), 'Total label is unchanged');
		assert(l.filteredHidden === false, 'Filtered wrap is shown while narrowed');
		assert((await logText()).includes(`'ln-list:rendered' (Visible: ${expected}, Total: ${GRAND_TOTAL})`), 'ln-list:rendered logged Visible/Total');
		const titles = await itemTitles();
		assert(titles.length > 0 && titles.every(t => t.toLowerCase().includes(SEARCH_TERM)), 'every rendered item matches the search term');
		assert(titles[0] === 'Security Policy #1', 'results keep server order (Security Policy #1 first)');
		const loading = await page.evaluate(() => document.getElementById('hybrid-list').classList.contains('ln-list--loading'));
		assert(loading === false, 'loading class is removed once the answer is rendered');
	});

	await section('Search clear button restores the full list', async () => {
		await load();
		await typeSearch(SEARCH_TERM);
		assert(await wait(() => !document.getElementById('lbl-filtered-wrap').classList.contains('hidden')), 'list is narrowed');
		await clickClear();
		const restored = await wait(() => document.getElementById('lbl-filtered-wrap').classList.contains('hidden')
			&& Array.from(document.querySelectorAll('#hybrid-list > li[data-ln-item] strong'))
				.some(s => s.textContent.trim() === 'Privacy Plan #2'));
		assert(restored, 'full list is back (Privacy Plan #2 visible again, Filtered wrap hidden)');
		assert((await inputValue()) === '', 'search input is empty');
		assert((await labels()).total === String(GRAND_TOTAL), 'Total label still ' + GRAND_TOTAL);
	});

	// ═══ 4. No-results empty state ════════════════════════════

	await section('No matches: filtered empty state and its clear button', async () => {
		await load();
		await page.evaluate(() => {
			window.__empty = [];
			document.getElementById('hybrid-list').addEventListener('ln-list:empty', e => window.__empty.push(e.detail));
		});
		await typeSearch('zzzzqqq');
		const shown = await wait(() => !!document.querySelector('#hybrid-list [data-ln-empty-state="no-results"]'));
		assert(shown, 'hybrid-docs-empty-filtered template is rendered ([data-ln-empty-state="no-results"])');
		const state = await page.evaluate(() => {
			const ul = document.getElementById('hybrid-list');
			return {
				heading: ul.querySelector('[data-ln-empty-state] h3').textContent.trim(),
				items: ul.querySelectorAll('[data-ln-item]').length,
				events: window.__empty.slice()
			};
		});
		assert(state.heading === 'No matches found', 'empty state heading is "No matches found"');
		assert(state.items === 0, 'no items are rendered');
		assert(state.events.length >= 1, 'ln-list:empty was dispatched');
		assert(await wait(n => window.__empty.some(d => d.total === n), GRAND_TOTAL), `ln-list:empty detail.total reaches ${GRAND_TOTAL}`);
		assert(await wait(() => document.getElementById('lbl-filtered').textContent === '0'
			&& !document.getElementById('lbl-filtered-wrap').classList.contains('hidden')), 'Filtered label shows 0 and its wrap is visible');

		await page.click('button[data-ln-search-clear-for="hybrid-docs"]');
		const back = await wait(() => !document.querySelector('#hybrid-list [data-ln-empty-state]')
			&& document.querySelectorAll('#hybrid-list > li[data-ln-item]').length > 0);
		assert(back, 'empty state replaced by items after the in-state Clear Search button');
		assert((await inputValue()) === '', 'search input is cleared');
		assert(await wait(() => document.getElementById('lbl-filtered-wrap').classList.contains('hidden')), 'Filtered wrap hidden again');
	});

	await section('ln-list:empty detail.term carries the search term (README: { term, total })', async () => {
		await load();
		await page.evaluate(() => {
			window.__empty = [];
			document.getElementById('hybrid-list').addEventListener('ln-list:empty', e => window.__empty.push(e.detail));
		});
		await typeSearch('zzzzqqq');
		assert(await wait(n => window.__empty.some(d => d.total === n), GRAND_TOTAL), 'ln-list:empty settled with the grand total');
		const last = await page.evaluate(() => window.__empty[window.__empty.length - 1]);
		assert(last.term === 'zzzzqqq', `last ln-list:empty detail.term is "zzzzqqq" (got "${last.term}")`);
	});

	// ═══ 5. Selection ═════════════════════════════════════════

	await section('Selection: checkboxes, count label, ln-list:select', async () => {
		await load();
		await page.evaluate(() => {
			window.__sel = [];
			document.getElementById('hybrid-list').addEventListener('ln-list:select', e => window.__sel.push(e.detail.count));
		});
		await clickSelect(1);
		assert(await wait(() => document.getElementById('lbl-selected').textContent === '1'), 'Selected label shows 1');
		let s = await isSelected(1);
		assert(s.checked && s.cls, 'item 1 is checked and carries ln-item-selected');
		assert((await labels()).selectedHidden === false, 'Selected wrap is visible');
		assert((await logText()).includes('Selection updated. Count: 1'), 'log: "Selection updated. Count: 1"');

		await clickSelect(2);
		assert(await wait(() => document.getElementById('lbl-selected').textContent === '2'), 'Selected label shows 2');

		await clickSelect(1);
		assert(await wait(() => document.getElementById('lbl-selected').textContent === '1'), 'unchecking item 1 drops the count to 1');
		s = await isSelected(1);
		assert(!s.checked && !s.cls, 'item 1 is unchecked and ln-item-selected is removed');
		const counts = await page.evaluate(() => window.__sel);
		assert(counts.join(',') === '1,2,1', `ln-list:select detail.count sequence is 1,2,1 (got ${counts.join(',')})`);
		assert(!(await logText()).includes('Item clicked'), 'clicking a checkbox does not emit ln-list:item-click');
	});

	await section('Selection survives a re-render (search narrows the list)', async () => {
		await load();
		await clickSelect(1);
		assert(await wait(() => document.getElementById('lbl-selected').textContent === '1'), 'item 1 selected');
		const expected = await apiFiltered(SEARCH_TERM);
		await typeSearch(SEARCH_TERM);
		assert(await wait(n => document.getElementById('lbl-filtered').textContent === String(n), expected), 'list narrowed');
		const restored = await wait(() => {
			const li = document.querySelector('#hybrid-list > li[data-ln-item][data-ln-item-id="1"]');
			return !!li && li.querySelector('[data-ln-item-select]').checked;
		});
		assert(restored, 'item 1 is re-rendered already checked');
		assert((await labels()).selected === '1', 'Selected label still shows 1');
	});

	await section('Clear Selection button resets the selection', async () => {
		await load();
		await clickSelect(1);
		await clickSelect(2);
		assert(await wait(() => document.getElementById('lbl-selected').textContent === '2'), 'two items selected');
		await page.click('#btn-clear-selection');
		const cleared = await wait(() => document.getElementById('lbl-selected-wrap').classList.contains('hidden'));
		assert(cleared, 'Selected wrap is hidden after Clear Selection');
		const s = await isSelected(1);
		assert(s && !s.checked && !s.cls, 'item 1 is unchecked after Clear Selection');
	});

	// ═══ 6. Item click / action events ════════════════════════

	await section('Item action and item click events', async () => {
		await load();
		await page.click(`${LIST} > li[data-ln-item][data-ln-item-id="3"] [data-ln-item-action="delete"]`);
		assert((await logText()).includes('Item action: [delete] clicked for ID: 3'), 'Delete button emits ln-list:item-action (action=delete, id=3)');
		assert(!(await logText()).includes('Item clicked'), 'the action button does not also emit ln-list:item-click');
		const stillThere = await page.evaluate(() => !!document.querySelector('#hybrid-list > li[data-ln-item][data-ln-item-id="3"]'));
		assert(stillThere, 'the list itself does not remove the item (the page only logs the action)');

		await page.click(`${LIST} > li[data-ln-item][data-ln-item-id="2"] strong`);
		assert((await logText()).includes('Item clicked: "Privacy Plan #2" (ID: 2)'), 'clicking item body emits ln-list:item-click with the record');
	});

	// ═══ 7. Clear Log ═════════════════════════════════════════

	await section('Clear Log button empties the log', async () => {
		await load();
		assert((await logText()).length > 0, 'log has content');
		await page.click('#btn-clear-log');
		assert((await logText()) === '', 'log is empty after Clear Log');
	});

	// ═══ 8. Windowed scroll ═══════════════════════════════════

	await section('Scrolling fetches page-aligned slices and renders them', async () => {
		await load();
		const before = requests.length;
		await page.evaluate(() => { document.getElementById('hybrid-list').scrollTop = 200000; });
		const fetched = await (async () => {
			const deadline = Date.now() + 10000;
			while (Date.now() < deadline) {
				if (requests.length > before) return true;
				await page.evaluate(() => new Promise(r => requestAnimationFrame(() => r())));
			}
			return false;
		})();
		assert(fetched, 'scrolling past the resident window triggers a request');
		const fresh = requests.slice(before);
		assert(fresh.every(u => Number(u.searchParams.get('offset')) > 0 && Number(u.searchParams.get('offset')) % WINDOW_PAGE === 0
			&& u.searchParams.get('limit') === String(WINDOW_PAGE) && !u.searchParams.has('search')),
		`requests are page-aligned (offset a positive multiple of ${WINDOW_PAGE}, limit ${WINDOW_PAGE}) with no search`);
		const arrived = await wait(() => {
			const ul = document.getElementById('hybrid-list');
			const ids = Array.from(ul.querySelectorAll(':scope > li[data-ln-item]')).map(li => Number(li.getAttribute('data-ln-item-id')));
			return ids.length > 0 && ul.querySelectorAll(':scope > li.ln-list__placeholder').length === 0 && ids[0] > 1000;
		});
		assert(arrived, 'real items (id > 1000) replace the placeholders');
		const ids = await itemIds();
		assert(ids.every((id, i) => i === 0 || id === ids[i - 1] + 1), 'rendered ids are consecutive in server order');
		const topSpacer = await page.evaluate(() => document.getElementById('hybrid-list').firstElementChild.classList.contains('ln-list__spacer'));
		assert(topSpacer, 'a top spacer li.ln-list__spacer holds the skipped rows');
		assert((await labels()).total === String(GRAND_TOTAL), 'Total label is unchanged while scrolling');

		await page.evaluate(() => { document.getElementById('hybrid-list').scrollTop = 0; });
		const back = await wait(() => {
			const ul = document.getElementById('hybrid-list');
			const first = ul.querySelector(':scope > li[data-ln-item]');
			return !!first && first.getAttribute('data-ln-item-id') === '1'
				&& ul.querySelectorAll(':scope > li.ln-list__placeholder').length === 0;
		});
		assert(back, 'scrolling back to the top renders item 1 again');
	});

	if (failures.length > 0) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
