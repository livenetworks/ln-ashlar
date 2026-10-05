import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/include.html (live demo, #documents-table),
// components/ln-include/src/ln-include.js, ln-table (data-driven mode), ln-sort, ln-search and the
// page's mock backend (demo/admin/dist/mock-store-usecase.js, seeded from data/documents.json).
// Expected data is derived in-page from that same fixture, never hard-coded.

const PAGE_URL = BASE_URL + 'include.html';
const ROW_URL = 'tpl/documents-row.html';
const EMPTY_URL = 'tpl/documents-empty.html';
const INPUT = 'input[data-ln-search-for="documents"]';
const TABLE = '#documents-table';
const SORT_LISTS = 3;
const MISSING_URL = 'tpl/__missing-template__.html';

const digits = s => Number(String(s).replace(/[^\d]/g, ''));

run('demo/admin/include.html', async ({ page }) => {

	const failures = [];
	const tplRequests = [];
	page.on('request', req => {
		if (req.url().includes('/tpl/')) tplRequests.push(req.url());
	});

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs a section; a failure is recorded and the next section still runs.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction((sortLists) => {
			const table = document.getElementById('documents-table');
			if (!table || !table.lnTable) return false;
			const sorts = document.querySelectorAll('ul[data-ln-sort="documents"]');
			if (sorts.length !== sortLists || !Array.from(sorts).every(el => el.lnSort)) return false;
			return table.querySelectorAll('tbody tr[data-ln-table-row]').length > 0;
		}, { timeout: 15000 }, SORT_LISTS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		tplRequests.length = 0;
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Fixture the mock backend serves, as records.
	const fixture = () => page.evaluate(async () => (await (await fetch('./data/documents.json')).json()).data);

	const rowIds = () => page.evaluate(() => Array.from(document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]'))
		.map(tr => Number(tr.getAttribute('data-ln-table-row-id'))));

	const rowCells = () => page.evaluate(() => Array.from(document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]'))
		.map(tr => Array.from(tr.cells).map(td => td.textContent.trim())));

	const footer = () => page.evaluate(() => {
		const t = document.getElementById('documents-table');
		const filtered = t.querySelector('[data-ln-table-filtered]');
		return {
			total: t.querySelector('[data-ln-table-total]').textContent,
			filtered: filtered.textContent,
			wrapHidden: filtered.parentElement.classList.contains('hidden')
		};
	});

	const sizeDisplay = fs => (fs || 0) >= 1024 ? ((fs || 0) / 1024).toFixed(1) + ' MB' : (fs || 0) + ' KB';

	async function waitFiltered(n) {
		await page.waitForFunction(count => {
			const t = document.getElementById('documents-table');
			return Number(t.querySelector('[data-ln-table-filtered]').textContent.replace(/[^\d]/g, '') || -1) === count
				&& t.querySelectorAll('tbody tr').length > 0 || (count === 0 && t.querySelector('[data-ln-table-filtered]').textContent === '0');
		}, { timeout: 15000 }, n);
	}

	async function clearSearch() {
		await page.click(`${TABLE} [data-ln-search-clear]`);
		await page.waitForFunction(() => {
			const f = document.querySelector('#documents-table [data-ln-table-filtered]');
			return f.textContent === '' && document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]').length > 0;
		}, { timeout: 15000 });
	}

	async function clickSort(field, dir) {
		await page.click(`ul[data-ln-sort-field="${field}"] button[data-ln-sort-dir="${dir}"]`);
	}

	async function waitFirstRow(predicateSrc, arg) {
		await page.waitForFunction((src, a) => {
			const tr = document.querySelector('#documents-table tbody tr[data-ln-table-row]');
			if (!tr) return false;
			return new Function('tr', 'a', 'return ' + src)(tr, a);
		}, { timeout: 15000 }, predicateSrc, arg);
	}

	await load();
	const data = await fixture();

	// ─── Template loading (ln-include) ─────────────────────────

	await check('External templates are fetched and injected', async () => {
		const state = await page.evaluate(() => Array.from(document.querySelectorAll('#documents-table template[data-ln-include]')).map(t => ({
			name: t.getAttribute('data-ln-template'),
			url: t.getAttribute('data-ln-include'),
			instance: !!t.lnInclude,
			children: t.content.childElementCount
		})));
		assert(state.length === 2, 'Two include templates exist in #documents-table');
		assert(state.every(s => s.instance), 'Each include template has an ln-include instance');
		assert(state.every(s => s.children === 1), 'Each include template content holds exactly one injected root element');

		const rowTpl = await page.evaluate(() => {
			const tr = document.querySelector('#documents-table template[data-ln-template="documents-row"]').content.firstElementChild;
			return { tag: tr.tagName, hasMarker: tr.hasAttribute('data-ln-table-row'), cells: tr.cells.length, checkbox: !!tr.querySelector('td input[type="checkbox"][data-ln-table-row-select]') };
		});
		assert(rowTpl.tag === 'TR' && rowTpl.hasMarker, 'Row template injected as a <tr data-ln-table-row> (table elements survive parsing)');
		assert(rowTpl.cells === 5 && rowTpl.checkbox, 'Row template has 5 cells including the row-select checkbox');

		const emptyTpl = await page.evaluate(() => {
			const tr = document.querySelector('#documents-table template[data-ln-template="documents-empty"]').content.firstElementChild;
			const td = tr.querySelector('td');
			return { tag: tr.tagName, colspan: td.getAttribute('colspan'), heading: td.querySelector('article.ln-table__empty-state h3').textContent.trim() };
		});
		assert(emptyTpl.tag === 'TR' && emptyTpl.colspan === '99', 'Empty template injected as <tr><td colspan="99">');
		assert(emptyTpl.heading === 'No documents found', 'Empty template heading is "No documents found"');
	});

	await check('Each include URL is requested once on load', async () => {
		const rowReq = tplRequests.filter(u => u.endsWith(ROW_URL)).length;
		const emptyReq = tplRequests.filter(u => u.endsWith(EMPTY_URL)).length;
		assert(rowReq === 1, `${ROW_URL} requested exactly once (got ${rowReq})`);
		assert(emptyReq === 1, `${EMPTY_URL} requested exactly once (got ${emptyReq})`);
	});

	await check('Table renders rows from the included row template', async () => {
		const ids = await rowIds();
		assert(ids.length > 0 && ids[0] === 1, 'First rendered row is record id 1');
		const cells = await rowCells();
		const rec = data[0];
		assert(cells[0][1] === rec.title, `Title cell = "${rec.title}"`);
		assert(cells[0][2] === rec.department, `Department cell = "${rec.department}"`);
		assert(cells[0][3] === rec.status, `Status cell = "${rec.status}"`);
		assert(cells[0][4] === sizeDisplay(rec.file_size), `Size cell = presenter size_display "${sizeDisplay(rec.file_size)}"`);
		const f = await footer();
		assert(digits(f.total) === data.length, `Footer total = ${data.length}`);
		assert(f.filtered === '' && f.wrapHidden, 'Footer filtered wrapper is hidden when unfiltered');
	});

	await check('Dynamic include: loaded event, shared fetch, error event', async () => {
		const before = tplRequests.filter(u => u.endsWith(ROW_URL)).length;
		const res = await page.evaluate((rowUrl, missing) => new Promise(resolve => {
			const out = {};
			const t1 = document.createElement('template');
			t1.setAttribute('data-ln-include', rowUrl);
			t1.addEventListener('ln-include:loaded', e => {
				out.loadedUrl = e.detail.url;
				out.loadedTarget = e.detail.target === t1;
				out.children = t1.content.childElementCount;
				const t2 = document.createElement('template');
				t2.setAttribute('data-ln-include', missing);
				t2.addEventListener('ln-include:error', ev => {
					out.errorUrl = ev.detail.url;
					out.errorTarget = ev.detail.target === t2;
					out.hasError = ev.detail.error instanceof Error;
					out.errorChildren = t2.content.childElementCount;
					resolve(out);
				});
				document.body.appendChild(t2);
			});
			document.body.appendChild(t1);
		}), ROW_URL, MISSING_URL);
		assert(res.loadedUrl === ROW_URL && res.loadedTarget, 'ln-include:loaded dispatched on the new template with its url');
		assert(res.children === 1, 'Loaded content appended to the new template .content');
		const after = tplRequests.filter(u => u.endsWith(ROW_URL)).length;
		assert(after === before, 'Second template with the same URL reuses the shared fetch (no new request)');
		assert(res.errorUrl === MISSING_URL && res.errorTarget && res.hasError, 'ln-include:error dispatched for a failing URL with an Error');
		assert(res.errorChildren === 0, 'Failed include leaves template content empty');
	});

	// ─── Search ────────────────────────────────────────────────

	await check('Search filters rows and footer count', async () => {
		await load();
		const term = 'security';
		const expected = data.filter(r => [r.title, r.department, r.owner].some(v => v && v.toLowerCase().includes(term))).length;
		await page.type(INPUT, 'Security');
		await waitFiltered(expected);
		const f = await footer();
		assert(digits(f.filtered) === expected, `Footer filtered = ${expected}`);
		assert(!f.wrapHidden, 'Filtered wrapper visible while filtered');
		assert(digits(f.total) === data.length, 'Footer total unchanged');
		const matching = new Set(data.filter(r => [r.title, r.department, r.owner].some(v => v && v.toLowerCase().includes(term))).map(r => r.id));
		const ids = await rowIds();
		assert(ids.length > 0 && ids.every(id => matching.has(id)), 'Every rendered row is a matching record');
		await clearSearch();
		const f2 = await footer();
		assert(f2.filtered === '' && f2.wrapHidden, 'Clear button restores unfiltered footer');
		assert(digits(f2.total) === data.length, 'Total remains full count after clear');
	});

	await check('No-match search: empty event and zero count', async () => {
		await load();
		await page.evaluate(() => {
			window.__empty = 0;
			document.getElementById('documents-table').addEventListener('ln-table:empty', () => { window.__empty++; });
		});
		await page.type(INPUT, 'zzzzqqxx');
		await page.waitForFunction(() => window.__empty > 0, { timeout: 15000 });
		const f = await footer();
		assert(f.filtered === '0', 'Footer filtered = 0');
		assert((await rowIds()).length === 0, 'No data rows rendered');
		// Source: ln-table _showEmptyState uses "<name>-empty-filtered" when filtered to zero with total > 0.
		const emptyShown = await page.evaluate(() => !!document.querySelector('#documents-table tbody .ln-table__empty-state'));
		assert(emptyShown, 'The fetched documents-empty template ("No documents found") is shown for a no-match search');
	});

	// ─── Sort ──────────────────────────────────────────────────

	// ln-data-store sorts with this collator (ln-data-store.js _collator).
	const COLLATE = "new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' })";

	// Waits for the first rendered row's cell `col` to equal `value`.
	async function waitFirstCell(col, value) {
		await page.waitForFunction((c, v) => {
			const tr = document.querySelector('#documents-table tbody tr[data-ln-table-row]');
			return !!tr && tr.cells[c].textContent.trim() === v;
		}, { timeout: 15000 }, col, value);
	}

	// True when the rendered column is ordered by the store collator in the given direction.
	const isOrdered = (col, dir) => page.evaluate((c, d, src) => {
		const collator = new Function('return ' + src)();
		const v = Array.from(document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]')).map(tr => tr.cells[c].textContent.trim());
		return v.every((x, i) => i === 0 || (d === 'asc' ? collator.compare(v[i - 1], x) <= 0 : collator.compare(v[i - 1], x) >= 0));
	}, col, dir, COLLATE);

	// Extreme (first in asc / last in asc order) value of a record field under the store collator.
	const extreme = (field, dir) => page.evaluate((f, d, src) => {
		const collator = new Function('return ' + src)();
		return fetch('./data/documents.json').then(r => r.json()).then(j => {
			const v = j.data.map(r => String(r[f])).sort((a, b) => collator.compare(a, b));
			return d === 'asc' ? v[0] : v[v.length - 1];
		});
	}, field, dir, COLLATE);

	const sortState = field => page.evaluate(f => document.querySelector(`ul[data-ln-sort-field="${f}"]`).getAttribute('data-ln-sort-state'), field);

	// ln-sort is a 3-state cycle: only the button for the next state is visible (none -> asc -> desc -> none).
	await check('Sort by title: asc, desc, none', async () => {
		await load();
		const first = await extreme('title', 'asc');
		const last = await extreme('title', 'desc');
		await clickSort('title', 'asc');
		await waitFirstCell(1, first);
		assert((await rowCells())[0][1] === first, `Title asc first row = "${first}"`);
		assert(await isOrdered(1, 'asc'), 'Rendered titles ascending');
		const aria = await page.evaluate(() => document.querySelector('th[data-ln-table-col="title"]').getAttribute('aria-sort'));
		assert(await sortState('title') === 'asc' && aria === 'ascending', 'Title list state=asc, th aria-sort=ascending');

		await clickSort('title', 'desc');
		await waitFirstCell(1, last);
		assert((await rowCells())[0][1] === last, `Title desc first row = "${last}"`);
		assert(await isOrdered(1, 'desc'), 'Rendered titles descending');
		assert(await sortState('title') === 'desc', 'Title list state=desc');

		await clickSort('title', 'none');
		await waitFirstCell(1, data[0].title);
		assert((await rowIds())[0] === 1, 'Sort none restores original order (id 1 first)');
		assert(await sortState('title') === 'none', 'Title list state=none');
	});

	await check('Sort by size and mutual exclusion between columns', async () => {
		await load();
		const maxSize = Math.max(...data.map(r => r.file_size));
		await clickSort('file_size', 'asc');
		await page.waitForFunction(() => document.querySelector('ul[data-ln-sort-field="file_size"]').getAttribute('data-ln-sort-state') === 'asc', { timeout: 5000 });
		await clickSort('file_size', 'desc');
		await waitFirstCell(4, sizeDisplay(maxSize));
		const sizes = (await rowIds()).map(id => data.find(r => r.id === id).file_size);
		assert(sizes[0] === maxSize, `Size desc first row has max file_size ${maxSize}`);
		assert(sizes.every((s, i) => i === 0 || sizes[i - 1] >= s), 'Rendered sizes non-increasing');

		await clickSort('department', 'asc');
		await page.waitForFunction(() => document.querySelector('ul[data-ln-sort-field="file_size"]').getAttribute('data-ln-sort-state') === 'none', { timeout: 5000 });
		assert(await sortState('file_size') === 'none' && await sortState('department') === 'asc', 'Activating department sort resets size sort to none');
		await waitFirstCell(2, await extreme('department', 'asc'));
		assert(await isOrdered(2, 'asc'), 'Rendered departments ascending');
	});

	// ─── Selection ─────────────────────────────────────────────

	await check('Row selection and select-all', async () => {
		await load();
		await page.evaluate(() => {
			window.__sel = [];
			document.getElementById('documents-table').addEventListener('ln-table:select', e => window.__sel.push(e.detail.count));
		});
		await page.click('#documents-table tbody tr[data-ln-table-row] input[data-ln-table-row-select]');
		await page.waitForFunction(() => window.__sel.length === 1, { timeout: 5000 });
		const one = await page.evaluate(() => ({
			count: document.getElementById('documents-table').lnTable.selectedIds.size,
			cls: document.querySelector('#documents-table tbody tr[data-ln-table-row]').classList.contains('ln-row-selected'),
			evt: window.__sel[0]
		}));
		assert(one.count === 1 && one.evt === 1, 'One row selected; ln-table:select count = 1');
		assert(one.cls, 'Selected row has ln-row-selected');

		await page.click('#documents-table th[data-ln-table-col-select] input[type="checkbox"]');
		await page.waitForFunction(() => {
			const rows = document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]');
			return rows.length > 0 && Array.from(rows).every(r => r.querySelector('input[data-ln-table-row-select]').checked);
		}, { timeout: 5000 });
		const all = await page.evaluate(() => ({
			rows: document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]').length,
			sel: document.getElementById('documents-table').lnTable.selectedIds.size
		}));
		assert(all.sel === all.rows, `Select-all selects every rendered row (${all.rows})`);

		await page.click('#documents-table th[data-ln-table-col-select] input[type="checkbox"]');
		await page.waitForFunction(() => document.getElementById('documents-table').lnTable.selectedIds.size === 0, { timeout: 5000 });
		const none = await page.evaluate(() => document.querySelectorAll('#documents-table tbody tr.ln-row-selected').length);
		assert(none === 0, 'Unchecking select-all clears selection and row classes');
	});

	console.log('');
	if (failures.length > 0) {
		console.error('Failed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
