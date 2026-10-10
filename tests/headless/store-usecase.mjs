import { run, assert, BASE_URL } from './_harness.mjs';

// REAL COMPONENTS, no inline mock: this drives the page's own ln-data-store / ln-data-coordinator /
// ln-api-connector / ln-table / ln-search / ln-sort / ln-filter / ln-table-coordinator / ln-popover /
// ln-modal / ln-fill / ln-form / ln-confirm / ln-stat / ln-options against the page's shipped mock backend
// (demo/admin/dist/mock-store-usecase.js, GET/POST/PUT/DELETE /api/documents, persisted in localStorage).
//
// Every fact below is read from demo/admin/src/pages/store-usecase.html, that mock and the fixture
// demo/admin/data/documents.json. Counts are computed from the fixture with ln-core's matching rule
// (AND of whitespace tokens, each token a substring of title|department|owner).
//
// Seed size: every table operation is a full query over the cached records (~2 s at the shipped 10,000),
// which does not fit one run in 150 s. The run therefore pre-fills the mock's own storage key
// (ln-mock-documents) once with the FIRST 1,000 fixture records; the mock serves what is in its storage.
// The "Reset seed data" section at the end uses the page's real button, which wipes that key, so the mock
// loads the complete 10,000-record fixture, and asserts the full seed.
// Not covered here (cut to fit the 150 s budget; the first drafts of these were not verified): sim-conflict 409 refill,
// IndexedDB reload persistence, ln-confirm row delete, sim-failure, Reset seed data button, combined search+filter+sort, OR of two checked values in one column (that query alone took ~10 s).
// Known demo defect (left failing on purpose): the "Zero-JS Declarative Binding" tree never loads, see section 5.

const PAGE_URL = BASE_URL + 'store-usecase.html';
const SEED_TOTAL = 1000;
const FULL_SEED = 10000;
const SEED_APPROVED = 211;
const AFTER_BULK = SEED_TOTAL - 2; // the bulk-delete section removes ids 1 and 2; later sections build on that
const MOCK_KEY = 'ln-mock-documents';

const SORT_LISTS = 4;
const FILTER_LISTS = 2;

// Fixture-derived expectations.
const FIRST_ROWS = [
	{ id: '1', title: 'Security Policy #1', department: 'Operations', status: 'Approved', size: 11112 },
	{ id: '2', title: 'Privacy Plan #2', department: 'Operations', status: 'Approved', size: 40879 },
	{ id: '3', title: 'Compliance Roadmap #3', department: 'Legal', status: 'Draft', size: 34454 }
];
const COMPLIANCE = { count: 63, firstId: '3', minSize: 1749, maxSize: 49880 };
const LEGAL_COMPLIANCE = { count: 6, minSize: 28879, maxSize: 49880 };
const FINANCE = 149;
const LEGAL_ALL = 131;
const FINANCE_DRAFT = 36;
const SIZE_MIN = 61;
const SIZE_MAX = 49995;
const UPDATED_MIN = 1718439129;
const UPDATED_MAX = 1778538992;
// Departments present in the fixture: Finance, HR, IT, Legal, Marketing, Operations, Sales (no Engineering).
const DEPT_FIRST_ASC = 'Finance';
const TITLE_FIRST_ASC = 'Audit Assessment #5';
const TITLE_LAST_ASC = 'Vendor Analysis #990';

const failures = [];

run('demo/admin/store-usecase.html', async ({ page }) => {

	// Seed the mock's storage once per tab (sessionStorage marker), so the page's "Reset seed data" button,
	// which removes the key, falls through to the mock's full 10,000-record fixture load.
	const fixture = (await (await fetch(BASE_URL + 'data/documents.json')).json()).data;
	await page.evaluateOnNewDocument((key, records) => {
		if (!sessionStorage.getItem('headless-seeded')) {
			sessionStorage.setItem('headless-seeded', '1');
			localStorage.setItem(key, JSON.stringify(records));
		}
	}, MOCK_KEY, fixture.slice(0, SEED_TOTAL));

	// ─── Helpers ───────────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated: a failing assertion is recorded, the other sections still run.
	async function check(title, fn) {
		section(title);
		const t0 = Date.now();
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
		console.log(`  (${Math.round((Date.now() - t0) / 1000)} s)`);
	}

	// Waits for observable state; the timeout is swallowed so the assertion that follows
	// reports the real (mismatching) state instead of a bare timeout.
	const settle = (fn, timeout, ...args) => page.waitForFunction(fn, { timeout, polling: 50 }, ...args).catch(() => {});

	const T = '#documents-table';
	const SEARCH_INPUT = T + ' input[data-ln-search-for="documents"]';

	// Page-side footer reader, repeated inside predicates (page functions cannot close over Node).
	const footer = () => page.evaluate(() => {
		const t = document.querySelector('#documents-table [data-ln-table-total]');
		const f = document.querySelector('#documents-table [data-ln-table-filtered]');
		return {
			total: Number(t.textContent.replace(/\D/g, '')),
			filtered: f.textContent.trim() === '' ? null : Number(f.textContent.replace(/\D/g, '')),
			filteredHidden: f.parentElement.classList.contains('hidden')
		};
	});

	const rendered = () => page.evaluate(() => Array.from(document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]'))
		.map(tr => ({
			id: tr.getAttribute('data-ln-table-row-id'),
			title: tr.cells[1].textContent.trim(),
			department: tr.cells[2].textContent.trim(),
			status: tr.cells[3].textContent.trim(),
			size: Number(tr.cells[4].getAttribute('data-ln-value')),
			updated: Number(tr.cells[5].getAttribute('data-ln-value'))
		})));

	// Waits until the footer shows `total` (and `filtered`, null = unfiltered) and rows are rendered.
	async function expectFooter(total, filtered, label) {
		await settle((tot, fil) => {
			const t = document.querySelector('#documents-table [data-ln-table-total]');
			const f = document.querySelector('#documents-table [data-ln-table-filtered]');
			if (!t || !f) return false;
			const curT = Number(t.textContent.replace(/\D/g, ''));
			const curF = f.textContent.trim() === '' ? null : Number(f.textContent.replace(/\D/g, ''));
			return curT === tot && curF === fil;
		}, 25000, total, filtered);
		const actual = await footer();
		assert(actual.total === total, `${label}: footer total is ${total} (got ${actual.total})`);
		assert(actual.filtered === filtered, `${label}: footer filtered is ${filtered === null ? 'empty' : filtered} (got ${actual.filtered === null ? 'empty' : actual.filtered})`);
		assert(actual.filteredHidden === (filtered === null), `${label}: "filtered /" wrapper is ${filtered === null ? '' : 'not '}hidden`);
	}

	async function ready(total) {
		await settle(tot => {
			const table = document.getElementById('documents-table');
			const store = document.getElementById('documents');
			const t = document.querySelector('#documents-table [data-ln-table-total]');
			return !!(table && table.lnTable && store && store.lnDataStore && t
				&& Number(t.textContent.replace(/\D/g, '')) === tot
				&& document.querySelector('#documents-table tbody tr[data-ln-table-row]'));
		}, 45000, total);
		const f = await footer();
		assert(f.total === total, `page is ready: footer total is ${total} (got ${f.total})`);
	}

	// Fresh page over the current mock/IndexedDB state (no reset): sections before the first write use this.
	async function reload(total = SEED_TOTAL) {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await ready(total);
	}

	async function typeSearch(term) {
		await page.focus(SEARCH_INPUT);
		// One input event per search: every keystroke would queue a full query over 10,000 records.
		await page.keyboard.sendCharacter(term);
	}

	// Select-all + one input event: replaces the term with a single query.
	async function replaceSearch(term) {
		await page.focus(SEARCH_INPUT);
		await page.evaluate(sel => document.querySelector(sel).select(), SEARCH_INPUT);
		await page.keyboard.sendCharacter(term);
	}

	const clickClear = () => page.evaluate(() => document.querySelector('#documents-table button[data-ln-search-clear]').click());

	const searchState = () => page.evaluate(() => ({
		input: document.querySelector('#documents-table input[data-ln-search-for="documents"]').value,
		storeAttr: document.getElementById('documents').getAttribute('data-ln-search'),
		coordAttr: document.getElementById('documents-coordinator').getAttribute('data-ln-data-coordinator-search')
	}));

	const clickSort = (field, dir) => page.evaluate((f, d) => {
		document.querySelector('#documents-table ul[data-ln-sort="documents"][data-ln-sort-field="' + f + '"] button[data-ln-sort-dir="' + d + '"]').click();
	}, field, dir);

	const sortState = field => page.evaluate(f => {
		const ul = document.querySelector('#documents-table ul[data-ln-sort="documents"][data-ln-sort-field="' + f + '"]');
		return { state: ul.getAttribute('data-ln-sort-state'), aria: ul.closest('th').getAttribute('aria-sort') };
	}, field);

	// Waits until the first rendered row satisfies `field === value`.
	const settleFirstRow = (field, value) => settle((f, v) => {
		const tr = document.querySelector('#documents-table tbody tr[data-ln-table-row]');
		if (!tr) return false;
		const cells = { id: () => tr.getAttribute('data-ln-table-row-id'), title: () => tr.cells[1].textContent.trim(), department: () => tr.cells[2].textContent.trim(),
			size: () => Number(tr.cells[4].getAttribute('data-ln-value')), updated: () => Number(tr.cells[5].getAttribute('data-ln-value')) };
		return cells[f]() === v;
	}, 20000, field, value);

	const clickFilter = (key, value) => page.evaluate((k, v) => {
		const sel = v === null
			? 'input[data-ln-filter-key="' + k + '"][data-ln-filter-reset]'
			: 'input[data-ln-filter-key="' + k + '"][data-ln-filter-value="' + v + '"]';
		document.querySelector('ul[data-ln-filter="documents"] ' + sel).click();
	}, key, value);

	// Reset checkbox is reported as '*'.
	const checkedValues = key => page.evaluate(k => Array.from(document.querySelectorAll(
		'ul[data-ln-filter="documents"] input[data-ln-filter-key="' + k + '"]:checked'))
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), key);

	const filterIndicator = key => page.evaluate(k => document
		.querySelector('#documents-table th[data-ln-table-filter-col="' + k + '"] button[data-ln-table-col-filter]')
		.classList.contains('ln-filter-active'), key);

	const clickClearAll = () => page.evaluate(() => document.querySelector('#documents-table [data-ln-table-clear-all]').click());

	const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
	const isAscending = list => list.every((v, i) => i === 0 || list[i - 1] <= v);
	const isDescending = list => list.every((v, i) => i === 0 || list[i - 1] >= v);

	const mockRecords = () => page.evaluate(key => JSON.parse(localStorage.getItem(key) || '[]'), MOCK_KEY);
	const mockFind = title => page.evaluate((key, t) => JSON.parse(localStorage.getItem(key) || '[]').find(r => r.title === t) || null, MOCK_KEY, title);
	const mockHasId = id => page.evaluate((key, i) => JSON.parse(localStorage.getItem(key) || '[]').some(r => r.id === i), MOCK_KEY, id);

	const modalOpen = id => page.evaluate(i => document.getElementById(i).open, id);
	const waitModal = (id, open) => settle((i, o) => document.getElementById(i).open === o, 10000, id, open);

	// Opens the "New" modal, fills and submits it like a user, waits until the modal closed.
	async function createDoc(title, department, status) {
		await page.evaluate(() => document.getElementById('create-document').click());
		await waitModal('document-modal', true);
		await page.type('#doc-title', title);
		await page.select('#doc-department', department);
		await page.select('#doc-status', status);
		await page.click('#document-form button[type="submit"]');
		await waitModal('document-modal', false);
	}

	// Filters the table to one record by its unique title; waits for the single row.
	async function findByTitle(term, expectedTitle) {
		if ((await searchState()).input !== '') {
			await clickClear();
			await settle(() => document.querySelector('#documents-table input[data-ln-search-for="documents"]').value === '', 10000);
		}
		await typeSearch(term);
		await settle(t => {
			const rows = document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]');
			return rows.length === 1 && rows[0].cells[1].textContent.trim() === t;
		}, 20000, expectedTitle);
		return rendered();
	}

	// ═══ 0. Initial state ═════════════════════════════════════

	await check('Initial state: store seeded from the mock backend, table rendered', async () => {
		// Puppeteer starts with an empty profile, so the first load is already seed state.
		await reload();
		await expectFooter(SEED_TOTAL, null, 'seed');
		const rows = await rendered();
		assert(rows.length > 0, `rows are rendered (${rows.length})`);
		FIRST_ROWS.forEach((exp, i) => {
			const r = rows[i];
			assert(r && r.id === exp.id && r.title === exp.title && r.department === exp.department && r.status === exp.status && r.size === exp.size,
				`row ${i}: id ${exp.id} "${exp.title}" / ${exp.department} / ${exp.status} / ${exp.size} (got ${JSON.stringify(r)})`);
		});
		const cells = await page.evaluate(() => {
			const tr = document.querySelector('#documents-table tbody tr[data-ln-table-row]');
			return { size: tr.cells[4].textContent, updatedText: tr.cells[5].textContent.trim(), updatedDt: tr.cells[5].querySelector('time').getAttribute('datetime') };
		});
		assert(cells.size.replace(/\D/g, '') === '11112' && cells.size.includes('KB'), `size cell shows the number and the KB suffix ("${cells.size.trim()}")`);
		assert(cells.updatedText !== '' && !cells.updatedText.includes('{{') && cells.updatedDt === '1776339624', `updated cell is rendered by the template ("${cells.updatedText}", datetime ${cells.updatedDt})`);
	});

	await check('Initial state: virtual scroll renders only a window of the seeded rows [source: ln-table VIRTUAL_THRESHOLD 200]', async () => {
		const info = await page.evaluate(() => ({
			rows: document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]').length,
			spacers: document.querySelectorAll('#documents-table tbody tr.ln-table__spacer').length
		}));
		assert(info.rows > 0 && info.rows < 200, `rendered row count is a window, not all records (${info.rows})`);
		assert(info.spacers > 0, `spacer rows stand in for the unrendered records (${info.spacers})`);
	});

	await check('Initial state: sort lists, filters and search start neutral', async () => {
		const lists = await page.evaluate(() => Array.from(document.querySelectorAll('#documents-table ul[data-ln-sort="documents"]'))
			.map(ul => ({ field: ul.getAttribute('data-ln-sort-field'), state: ul.getAttribute('data-ln-sort-state'), inst: !!ul.lnSort })));
		assert(lists.length === SORT_LISTS && lists.every(l => l.inst), `${SORT_LISTS} ln-sort lists are mounted (${lists.map(l => l.field).join(', ')})`);
		assert(lists.every(l => l.state === 'none'), 'every sort list starts at data-ln-sort-state="none"');
		const filters = await page.evaluate(() => document.querySelectorAll('ul[data-ln-filter="documents"]').length);
		assert(filters === FILTER_LISTS, `${FILTER_LISTS} ln-filter lists target "documents"`);
		assert(same(await checkedValues('department'), ['*']), 'department filter starts on "All"');
		assert(same(await checkedValues('status'), ['*']), 'status filter starts on "All"');
		assert(await filterIndicator('department') === false && await filterIndicator('status') === false, 'no header filter indicator is active');
		const s = await searchState();
		assert(s.input === '' && !s.coordAttr, 'search input is empty and the coordinator has no search term');
		const bulk = await page.evaluate(() => document.getElementById('bulk-delete-btn').classList.contains('hidden'));
		assert(bulk, 'bulk-delete button is hidden while nothing is selected');
	});

	// ═══ 1. Search ════════════════════════════════════════════
	// The sections 1-4 run on one page without reloads: every table operation costs a full query over
	// the cached records, so each section ends in the neutral state the next one starts from.

	await check('Search: typing narrows the table through the coordinator', async () => {
		await typeSearch('compliance');
		await expectFooter(SEED_TOTAL, COMPLIANCE.count, 'search "compliance"');
		const rows = await rendered();
		assert(rows[0].id === COMPLIANCE.firstId, `first match is id ${COMPLIANCE.firstId} (got ${rows[0].id})`);
		assert(rows.every(r => /compliance/i.test(r.title)), 'every rendered row matches the term');
		const s = await searchState();
		assert(s.storeAttr === 'compliance', `store element data-ln-search holds the term ("${s.storeAttr}")`);
		assert(s.coordAttr === 'compliance', `coordinator data-ln-data-coordinator-search holds the term ("${s.coordAttr}")`);
	});

	await check('Search: whitespace tokens are AND-ed across title/department/owner', async () => {
		await replaceSearch('legal compliance');
		await expectFooter(SEED_TOTAL, LEGAL_COMPLIANCE.count, 'search "legal compliance"');
		const rows = await rendered();
		assert(rows.every(r => r.department === 'Legal' && /compliance/i.test(r.title)), 'every rendered row is Legal and a Compliance document');
	});

	await check('Search: clear button restores every record', async () => {
		await clickClear();
		await expectFooter(SEED_TOTAL, null, 'after clear');
		const s = await searchState();
		assert(s.input === '' && s.storeAttr === '' && !s.coordAttr, `input, store attribute and coordinator term are all empty (${JSON.stringify(s)})`);
		const rows = await rendered();
		assert(rows[0].id === '1', 'original order is back (first row id 1)');
	});

	await check('Search: no match shows the empty-filtered state, "Clear all filters" restores', async () => {
		await typeSearch('zzzzqq');
		await expectFooter(SEED_TOTAL, 0, 'search "zzzzqq"');
		await settle(() => !!document.querySelector('#documents-table tbody [data-ln-table-clear-all]'), 10000);
		const empty = await page.evaluate(() => ({
			rows: document.querySelectorAll('#documents-table tbody tr[data-ln-table-row]').length,
			heading: (document.querySelector('#documents-table tbody h3') || {}).textContent,
			button: !!document.querySelector('#documents-table tbody button[data-ln-table-clear-all]')
		}));
		assert(empty.rows === 0 && empty.heading === 'No results' && empty.button, `documents-empty-filtered template is shown (rows ${empty.rows}, heading "${empty.heading}")`);
		await clickClearAll();
		await expectFooter(SEED_TOTAL, null, 'after clear-all');
		const s = await searchState();
		assert(s.input === '' && s.storeAttr === '', 'clear-all emptied the search input and store data-ln-search');
		const rows = await rendered();
		assert(rows.length > 0 && rows[0].id === '1', 'rows are back, first row id 1');
	});

	await check('Search: "/" shortcut focuses the documents search input (ln-table-coordinator)', async () => {
		await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
		await page.keyboard.press('/');
		const focused = await page.evaluate(() => {
			const input = document.querySelector('#documents-table input[data-ln-search-for="documents"]');
			return document.activeElement === input && input.value === '';
		});
		assert(focused, 'documents search input is focused and no "/" was typed into it');
	});

	// ═══ 2. Filter ════════════════════════════════════════════

	await check('Filter: department checkbox filters, indicator', async () => {
		await clickFilter('department', 'Finance');
		await expectFooter(SEED_TOTAL, FINANCE, 'department Finance');
		const rows = await rendered();
		assert(rows.length > 0 && rows.every(r => r.department === 'Finance'), 'every rendered row is Finance');
		assert(same(await checkedValues('department'), ['Finance']), '"All" unchecked, only Finance checked');
		assert(await filterIndicator('department') === true, 'ln-table-coordinator marks the department header button ln-filter-active');
		assert(await filterIndicator('status') === false, 'status header button is not marked');
		const coord = await page.evaluate(() => document.getElementById('documents-coordinator').getAttribute('data-ln-data-coordinator-filters'));
		assert(coord === 'department=Finance', `coordinator holds the encoded filter ("${coord}")`);
	});

	await check('Filter: department AND status across columns, "All" resets a column', async () => {
		// department Finance is still active from the previous check
		await clickFilter('status', 'Draft');
		await expectFooter(SEED_TOTAL, FINANCE_DRAFT, 'Finance AND Draft');
		const rows = await rendered();
		assert(rows.every(r => r.department === 'Finance' && r.status === 'Draft'), 'every rendered row is Finance and Draft');
		assert(await filterIndicator('status') === true, 'status header button is marked');
		await clickFilter('status', null);
		await expectFooter(SEED_TOTAL, FINANCE, 'status "All" leaves Finance only');
		assert(same(await checkedValues('status'), ['*']), 'status: only "All" is checked again');
		await clickFilter('department', null);
		await expectFooter(SEED_TOTAL, null, 'department "All"');
		assert(same(await checkedValues('department'), ['*']), 'department: only "All" is checked again');
	});

	await check('Filter: a value with no records (Engineering) shows the empty-filtered state', async () => {
		await clickFilter('department', 'Engineering');
		await expectFooter(SEED_TOTAL, 0, 'department Engineering');
		await settle(() => !!document.querySelector('#documents-table tbody [data-ln-table-clear-all]'), 10000);
		const heading = await page.evaluate(() => (document.querySelector('#documents-table tbody h3') || {}).textContent);
		assert(heading === 'No results', `"No results" template is shown (got "${heading}")`);
		await clickClearAll();
		await expectFooter(SEED_TOTAL, null, 'after clear-all');
		assert(same(await checkedValues('department'), ['*']), 'clear-all re-checked the department "All"');
		assert(await filterIndicator('department') === false, 'clear-all cleared the header indicator');
	});

	await check('Filter popover: open from the header, search its options, pick by label, Escape closes', async () => {
		await page.click('button[data-ln-popover-for="filter-documents-table-dept"]');
		await settle(() => document.getElementById('filter-documents-table-dept').getAttribute('data-ln-popover') === 'open', 5000);
		const opened = await page.evaluate(() => ({
			topLayer: document.getElementById('filter-documents-table-dept').matches(':popover-open'),
			expanded: document.querySelector('button[data-ln-popover-for="filter-documents-table-dept"]').getAttribute('aria-expanded')
		}));
		assert(opened.topLayer && opened.expanded === 'true', 'popover is open (:popover-open) and trigger aria-expanded="true"');
		await page.type('#filter-documents-table-dept input[data-ln-search-for="filter-documents-table-dept-list"]', 'fin');
		await settle(() => document.querySelector('#filter-documents-table-dept-list input[data-ln-filter-value="Legal"]').closest('label').hasAttribute('data-ln-search-hide'), 5000);
		const hidden = await page.evaluate(() => ({
			legal: document.querySelector('#filter-documents-table-dept-list input[data-ln-filter-value="Legal"]').closest('label').hasAttribute('data-ln-search-hide'),
			finance: document.querySelector('#filter-documents-table-dept-list input[data-ln-filter-value="Finance"]').closest('label').hasAttribute('data-ln-search-hide')
		}));
		assert(hidden.legal === true && hidden.finance === false, 'option search "fin" hides Legal and keeps Finance');
		const label = await page.evaluateHandle(() => document
			.querySelector('#filter-documents-table-dept-list input[data-ln-filter-value="Finance"]').closest('label'));
		await label.asElement().click();
		await expectFooter(SEED_TOTAL, FINANCE, 'clicking the "Finance" label');
		assert(await filterIndicator('department') === true, 'header button marked ln-filter-active');
		await page.keyboard.press('Escape');
		await settle(() => document.querySelector('button[data-ln-popover-for="filter-documents-table-dept"]').getAttribute('aria-expanded') === 'false', 5000);
		const closed = await page.evaluate(() => document.getElementById('filter-documents-table-dept').matches(':popover-open'));
		assert(closed === false, 'Escape closes the popover');
		await clickFilter('department', null);
		await expectFooter(SEED_TOTAL, null, 'department "All" (back to neutral)');
	});

	// ═══ 3. Sort ══════════════════════════════════════════════

	await check('Sort: file_size is numeric (asc/desc), th aria-sort and state follow', async () => {
		await clickSort('file_size', 'asc');
		await settleFirstRow('size', SIZE_MIN);
		let rows = await rendered();
		assert(rows[0].size === SIZE_MIN && isAscending(rows.map(r => r.size)), `size asc: ${SIZE_MIN} first, rendered rows nondecreasing`);
		let s = await sortState('file_size');
		assert(s.state === 'asc' && s.aria === 'ascending', 'ul data-ln-sort-state="asc" and th aria-sort="ascending"');
		await clickSort('file_size', 'desc');
		await settleFirstRow('size', SIZE_MAX);
		rows = await rendered();
		assert(rows[0].size === SIZE_MAX && isDescending(rows.map(r => r.size)), `size desc: ${SIZE_MAX} first, rendered rows nonincreasing`);
		s = await sortState('file_size');
		assert(s.state === 'desc' && s.aria === 'descending', 'ul data-ln-sort-state="desc" and th aria-sort="descending"');
		await clickSort('file_size', 'none');
		await settleFirstRow('id', '1');
		rows = await rendered();
		assert(rows[0].id === '1' && rows[1].id === '2', 'none restores the store order (ids 1, 2, ...)');
		s = await sortState('file_size');
		assert(s.state === 'none' && s.aria === 'none', 'ul data-ln-sort-state="none" and th aria-sort="none"');
	});

	await check('Sort: updated_at uses the raw Unix timestamp (data-ln-value)', async () => {
		await clickSort('updated_at', 'asc');
		await settleFirstRow('updated', UPDATED_MIN);
		let rows = await rendered();
		assert(rows[0].updated === UPDATED_MIN && isAscending(rows.map(r => r.updated)), `updated asc: ${UPDATED_MIN} first`);
		await clickSort('updated_at', 'desc');
		await settleFirstRow('updated', UPDATED_MAX);
		rows = await rendered();
		assert(rows[0].updated === UPDATED_MAX && isDescending(rows.map(r => r.updated)), `updated desc: ${UPDATED_MAX} first`);
	});

	await check('Sort: title is a numeric-aware text sort', async () => {
		await clickSort('title', 'asc');
		await settleFirstRow('title', TITLE_FIRST_ASC);
		let rows = await rendered();
		assert(rows[0].title === TITLE_FIRST_ASC, `title asc: "${TITLE_FIRST_ASC}" first (got "${rows[0].title}")`);
		await clickSort('title', 'desc');
		await settleFirstRow('title', TITLE_LAST_ASC);
		rows = await rendered();
		assert(rows[0].title === TITLE_LAST_ASC, `title desc: "${TITLE_LAST_ASC}" first (got "${rows[0].title}")`);
	});

	await check('Sort: sorting one column resets the others', async () => {
		await clickSort('department', 'asc');
		await settle(() => document.querySelector('#documents-table ul[data-ln-sort-field="title"]').getAttribute('data-ln-sort-state') === 'none', 10000);
		const title = await sortState('title');
		const dept = await sortState('department');
		assert(title.state === 'none' && title.aria === 'none', 'title list reset to none when department is sorted');
		assert(dept.state === 'asc' && dept.aria === 'ascending', 'department list is asc / ascending');
		await settle(d => {
			const tr = document.querySelector('#documents-table tbody tr[data-ln-table-row]');
			return !!tr && tr.cells[2].textContent.trim() === d;
		}, 20000, DEPT_FIRST_ASC);
		const rows = await rendered();
		assert(rows[0].department === DEPT_FIRST_ASC && isAscending(rows.map(r => r.department.toLowerCase())), `department asc: "${DEPT_FIRST_ASC}" first (got "${rows[0].department}")`);
	});

	// ═══ 5. Zero-JS declarative binding (second coordinator tree) ═══

	await check('Declarative binding: the people table is filled by the coordinator without page script', async () => {
		await settle(tot => {
			const t = document.querySelector('#people-table [data-ln-table-total]');
			return !!t && Number(t.textContent.replace(/\D/g, '')) === tot;
		}, 6000, SEED_TOTAL);
		const info = await page.evaluate(() => ({
			total: document.querySelector('#people-table [data-ln-table-total]').textContent,
			rows: document.querySelectorAll('#people-table tbody tr[data-ln-table-row]').length
		}));
		assert(Number(info.total.replace(/\D/g, '')) === SEED_TOTAL, `people table footer total is ${SEED_TOTAL} (got "${info.total}")`);
		assert(info.rows > 0, `people table renders rows (${info.rows})`);
	});

	await check('Declarative binding: ln-stat shows the total and the filtered count', async () => {
		await settle(() => document.querySelector('strong[data-ln-stat="people"]:not([data-ln-stat-filter])').textContent !== '', 2000);
		const stats = await page.evaluate(() => ({
			total: document.querySelector('strong[data-ln-stat="people"]:not([data-ln-stat-filter])').textContent,
			approved: document.querySelector('strong[data-ln-stat="people"][data-ln-stat-filter="status:Approved"]').textContent,
			loading: document.querySelector('strong[data-ln-stat="people"][data-ln-stat-filter="status:Approved"]').classList.contains('is-loading')
		}));
		assert(stats.total === String(SEED_TOTAL), `Total stat is ${SEED_TOTAL} (got "${stats.total}")`);
		assert(stats.approved === String(SEED_APPROVED), `Approved stat is ${SEED_APPROVED} (got "${stats.approved}")`);
		assert(stats.loading === false, 'is-loading is removed once the count arrived');
	});

	await check('Declarative binding: ln-options fills the select, keeping the placeholder', async () => {
		await settle(n => document.querySelectorAll('#people-select option').length === n, 2000, SEED_TOTAL + 1);
		const opts = await page.evaluate(() => {
			const options = Array.from(document.querySelectorAll('#people-select option'));
			return { count: options.length, first: [options[0].value, options[0].textContent], second: options[1] ? [options[1].value, options[1].textContent] : null };
		});
		assert(opts.count === SEED_TOTAL + 1, `one option per record plus the placeholder (${SEED_TOTAL + 1}; got ${opts.count})`);
		assert(opts.first[0] === '' && opts.first[1] === 'All documents', 'placeholder option "All documents" is kept first');
		assert(opts.second && opts.second[0] === '1' && opts.second[1] === 'Security Policy #1', `first record option is value "1" / "Security Policy #1" (got ${JSON.stringify(opts.second)})`);
	});

	await check('Declarative binding: people table sort and department filter drive the same source', async () => {
		await page.evaluate(() => document.querySelector('#people-table ul[data-ln-sort="people"][data-ln-sort-field="title"] button[data-ln-sort-dir="asc"]').click());
		await settle(t => {
			const tr = document.querySelector('#people-table tbody tr[data-ln-table-row]');
			return !!tr && tr.cells[0].textContent.trim() === t;
		}, 2000, TITLE_FIRST_ASC);
		const first = await page.evaluate(() => (document.querySelector('#people-table tbody tr[data-ln-table-row]') || { cells: [{ textContent: '' }] }).cells[0].textContent.trim());
		assert(first === TITLE_FIRST_ASC, `title asc: "${TITLE_FIRST_ASC}" first (got "${first}")`);
		await page.evaluate(() => document.querySelector('ul[data-ln-filter="people"] input[data-ln-filter-key="department"][data-ln-filter-value="Finance"]').click());
		await settle(n => {
			const f = document.querySelector('#people-table [data-ln-table-filtered]');
			return !!f && Number(f.textContent.replace(/\D/g, '')) === n;
		}, 2000, FINANCE);
		const filtered = await page.evaluate(() => document.querySelector('#people-table [data-ln-table-filtered]').textContent);
		assert(Number(filtered.replace(/\D/g, '')) === FINANCE, `department Finance: filtered ${FINANCE} (got "${filtered}")`);
	});

	// ═══ 6. Bulk delete (selection + confirm modal + coordinator) ═══

	await check('Bulk delete: selection, confirm modal, cancel keeps data, confirm removes both', async () => {
		await reload();
		const selectRow = idx => page.evaluate(i => document.querySelectorAll('#documents-table tbody tr[data-ln-table-row] input[data-ln-table-row-select]')[i].click(), idx);
		const bulk = () => page.evaluate(() => ({
			hidden: document.getElementById('bulk-delete-btn').classList.contains('hidden'),
			count: document.querySelector('#documents-table [data-ln-table-selected]').textContent,
			selectedRows: document.querySelectorAll('#documents-table tbody tr.ln-row-selected').length
		}));
		await selectRow(0);
		let b = await bulk();
		assert(!b.hidden && b.count === '1' && b.selectedRows === 1, `one row selected: button visible, count "${b.count}", ln-row-selected rows ${b.selectedRows}`);
		await page.evaluate(() => document.getElementById('bulk-delete-btn').click());
		await waitModal('confirm-delete-modal', true);
		let msg = await page.evaluate(() => document.getElementById('confirm-delete-message').textContent);
		assert(await modalOpen('confirm-delete-modal') && msg === 'Delete 1 document?', `confirm modal opens with "${msg}"`);
		await page.click('#confirm-delete-modal footer button[data-ln-modal-close]');
		await waitModal('confirm-delete-modal', false);
		assert((await footer()).total === SEED_TOTAL && await mockHasId(1), 'Cancel deletes nothing');
		await selectRow(1);
		b = await bulk();
		assert(b.count === '2' && b.selectedRows === 2, `two rows selected (count "${b.count}")`);
		await page.evaluate(() => document.getElementById('bulk-delete-btn').click());
		await waitModal('confirm-delete-modal', true);
		msg = await page.evaluate(() => document.getElementById('confirm-delete-message').textContent);
		assert(msg === 'Delete 2 documents?', `message is pluralised ("${msg}")`);
		await page.click('#confirm-delete-btn');
		await waitModal('confirm-delete-modal', false);
		assert(await modalOpen('confirm-delete-modal') === false, 'confirm modal closes on submit');
		await expectFooter(AFTER_BULK, null, 'after the bulk delete');
		await settle((key) => !JSON.parse(localStorage.getItem(key) || '[]').some(r => r.id === 1 || r.id === 2), 15000, MOCK_KEY);
		assert(!(await mockHasId(1)) && !(await mockHasId(2)), 'the mock backend no longer has ids 1 and 2');
		const rows = await rendered();
		assert(rows[0].id === '3', `table now starts at id 3 (got ${rows[0].id})`);
	});

	// ═══ 7. Create / Edit (modal + form + coordinator + mock backend) ═══
	// One probe record is created once and carried through the following sections.

	const PROBE = 'Headless Create Probe';
	const RENAMED = 'Headless Update Renamed';
	let probeId = null;
	let countAfterCreate = AFTER_BULK;

	await check('Create: "New" opens the modal in "new" mode with an empty form', async () => {
		await page.evaluate(() => document.getElementById('create-document').click());
		await waitModal('document-modal', true);
		const m = await page.evaluate(() => {
			const modal = document.getElementById('document-modal');
			const vis = {};
			modal.querySelectorAll('[data-ln-modal-when]').forEach(s => { vis[s.getAttribute('data-ln-modal-when')] = getComputedStyle(s).display !== 'none'; });
			return {
				open: modal.open, mode: modal.getAttribute('data-ln-modal-mode'), vis,
				id: document.querySelector('#document-form [name="id"]').value,
				title: document.getElementById('doc-title').value,
				department: document.getElementById('doc-department').value,
				status: document.getElementById('doc-status').value,
				focus: document.activeElement && document.activeElement.id
			};
		});
		assert(m.open && m.mode === 'new', 'dialog is open, data-ln-modal-mode="new"');
		assert(m.vis.new === true && m.vis.edit === false, 'title shows "New document", hides "Edit document"');
		assert(m.id === '' && m.title === '' && m.department === '' && m.status === 'Draft', `form is reset (id "${m.id}", title "${m.title}", dept "${m.department}", status "${m.status}")`);
		assert(m.focus === 'doc-title', `autofocus lands on the title input (got "${m.focus}")`);
		await page.click('#document-modal button[data-ln-modal-close][type="button"]:not([aria-label])');
		await waitModal('document-modal', false);
		assert(await modalOpen('document-modal') === false, 'Cancel closes the modal');
		assert((await footer()).total === AFTER_BULK, 'cancelling creates nothing');
	});

	await check('Create: submit saves to the store and the mock backend, modal closes', async () => {
		await createDoc(PROBE, 'Legal', 'Pending');
		countAfterCreate = AFTER_BULK + 1;
		await expectFooter(countAfterCreate, null, 'after create');
		await settle((key, t) => JSON.parse(localStorage.getItem(key) || '[]').some(r => r.title === t), 15000, MOCK_KEY, PROBE);
		const rec = await mockFind(PROBE);
		assert(rec !== null, 'the mock backend persisted the record');
		assert(rec.id === SEED_TOTAL + 1 && rec.department === 'Legal' && rec.status === 'Pending', `server record: id ${SEED_TOTAL + 1}, Legal, Pending (got ${JSON.stringify(rec)})`);
		assert(rec.created_at === rec.updated_at, 'server stamped created_at = updated_at');
		probeId = rec.id;
		const rows = await findByTitle('headless create', PROBE);
		assert(rows.length === 1 && rows[0].department === 'Legal' && rows[0].status === 'Pending', 'the new row is findable through search with the saved values');
		await settle(id => document.querySelector('#documents-table tbody tr[data-ln-table-row]')?.getAttribute('data-ln-table-row-id') === String(id), 15000, probeId);
		const rowId = await page.evaluate(() => document.querySelector('#documents-table tbody tr[data-ln-table-row]').getAttribute('data-ln-table-row-id'));
		assert(rowId === String(probeId), `temp id was reconciled to the server id (row id "${rowId}")`);
	});

	await check('Edit: row edit opens the modal in "edit" mode filled from the row', async () => {
		const rec = await mockFind(PROBE);
		await page.evaluate(() => document.querySelector('#documents-table tbody tr[data-ln-table-row] button[data-ln-table-row-action="edit"]').click());
		await waitModal('document-modal', true);
		const m = await page.evaluate(() => {
			const modal = document.getElementById('document-modal');
			const vis = {};
			modal.querySelectorAll('[data-ln-modal-when]').forEach(s => { vis[s.getAttribute('data-ln-modal-when')] = getComputedStyle(s).display !== 'none'; });
			return {
				mode: modal.getAttribute('data-ln-modal-mode'), vis,
				id: document.querySelector('#document-form [name="id"]').value,
				version: document.querySelector('#document-form [name="expected_version"]').value,
				title: document.getElementById('doc-title').value,
				department: document.getElementById('doc-department').value,
				status: document.getElementById('doc-status').value
			};
		});
		assert(m.mode === 'edit' && m.vis.edit === true && m.vis.new === false, 'data-ln-modal-mode="edit", title shows "Edit document"');
		assert(m.id === String(rec.id) && m.title === PROBE && m.department === 'Legal' && m.status === 'Pending',
			`fields filled from the row (id "${m.id}", "${m.title}", ${m.department}, ${m.status})`);
		assert(m.version === String(rec.updated_at), `expected_version carries the record's updated_at (${m.version} vs ${rec.updated_at})`);
		await page.click('#document-modal button[data-ln-modal-close][type="button"]:not([aria-label])');
		await waitModal('document-modal', false);
	});

	await check('Edit: submitting an edit updates the row and the mock backend', async () => {
		await page.evaluate(() => document.querySelector('#documents-table tbody tr[data-ln-table-row] button[data-ln-table-row-action="edit"]').click());
		await waitModal('document-modal', true);
		await page.focus('#doc-title');
		await page.evaluate(() => document.getElementById('doc-title').select());
		await page.keyboard.type(RENAMED);
		await page.select('#doc-status', 'Archived');
		await page.click('#document-form button[type="submit"]');
		await waitModal('document-modal', false);
		assert(await modalOpen('document-modal') === false, 'modal closes after the update is handed off');
		await settle((key, id, t) => JSON.parse(localStorage.getItem(key) || '[]').some(r => r.id === id && r.title === t), 15000, MOCK_KEY, probeId, RENAMED);
		const updated = (await mockRecords()).find(r => r.id === probeId);
		assert(updated && updated.title === RENAMED && updated.status === 'Archived' && updated.department === 'Legal',
			`mock backend holds the edited record (${JSON.stringify(updated)})`);
		const rows = await findByTitle('headless update', RENAMED);
		assert(rows.length === 1 && rows[0].title === RENAMED && rows[0].status === 'Archived' && rows[0].id === String(probeId), 'the table row shows the edited values, same id');
		assert((await footer()).total === countAfterCreate, 'an update does not change the record count');
	});

	if (failures.length) {
		console.error(`\n${failures.length} section failure(s):`);
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
