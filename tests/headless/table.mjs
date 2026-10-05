import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/table.html (live demo, #demo-table)
// and the components it mounts (ln-search, ln-sort, ln-filter, ln-table-coordinator,
// ln-popover, ln-persist). See the row table in .claude/plans/headless-table.md.

const PAGE_URL = BASE_URL + 'table.html';
const ROW_COUNT = 20;
const SORT_LISTS = 6;
const FILTER_LISTS = 2;
const COL = { id: 0, product: 1, category: 2, price: 3, stock: 4, status: 5 };

const ALL_IDS = Array.from({ length: ROW_COUNT }, (_, i) => i + 1);
// Row ids ordered by price ascending (prices are unique: data-ln-value on column 3).
const PRICE_ASC_IDS = [15, 16, 2, 14, 3, 6, 18, 9, 4, 13, 19, 10, 7, 17, 8, 12, 20, 5, 11, 1];
const CATEGORIES_ASC = ['Accessories', 'Components', 'Electronics', 'Networking', 'Peripherals', 'Storage'];
const STATUSES_ASC = ['In Stock', 'Low Stock', 'Out of Stock'];

const INPUT = 'input[data-ln-search-for="demo-table"]';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const reversed = list => list.slice().reverse();
const groups = list => list.filter((v, i) => i === 0 || v !== list[i - 1]);
const isAscending = list => list.every((v, i) => i === 0 || list[i - 1] <= v);
const isDescending = list => list.every((v, i) => i === 0 || list[i - 1] >= v);

run('demo/admin/table.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Waits until every component this page uses has an instance on its element.
	async function ready() {
		await page.waitForFunction((sortLists, filterLists) => {
			const table = document.getElementById('demo-table');
			if (!table || !table.lnSearch) return false;
			const input = document.querySelector('input[data-ln-search-for="demo-table"]');
			if (!input || !input.lnSearchControl) return false;
			const host = table.closest('[data-ln-table-coordinator]');
			if (!host || !host.lnTableCoordinator) return false;
			const sorts = document.querySelectorAll('ul[data-ln-sort="demo-table"]');
			if (sorts.length !== sortLists || !Array.from(sorts).every(el => el.lnSort)) return false;
			const filters = document.querySelectorAll('ul[data-ln-filter="demo-table"]');
			if (filters.length !== filterLists || !Array.from(filters).every(el => el.lnFilter)) return false;
			return true;
		}, { timeout: 10000 }, SORT_LISTS, FILTER_LISTS);
	}

	// Fresh, state-free page: ln-persist would otherwise restore a previous test's search term.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const visibleIds = () => page.evaluate(() => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.filter(tr => getComputedStyle(tr).display !== 'none')
		.map(tr => Number(tr.cells[0].textContent.trim())));

	const domIds = () => page.evaluate(() => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.map(tr => Number(tr.cells[0].textContent.trim())));

	const columnTexts = col => page.evaluate(c => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.map(tr => tr.cells[c].textContent.trim()), col);

	const columnValues = col => page.evaluate(c => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.map(tr => Number(tr.cells[c].getAttribute('data-ln-value'))), col);

	// Waits for the visible row ids (in DOM order) to equal `expected`, then asserts.
	async function expectVisible(expected, label) {
		await page.waitForFunction(exp => {
			const ids = Array.from(document.querySelectorAll('#demo-table tbody tr'))
				.filter(tr => getComputedStyle(tr).display !== 'none')
				.map(tr => Number(tr.cells[0].textContent.trim()));
			return ids.length === exp.length && ids.every((id, i) => id === exp[i]);
		}, { timeout: 5000 }, expected).catch(() => {});
		const actual = await visibleIds();
		assert(same(actual, expected), `${label}: expected [${expected.join(',')}], got [${actual.join(',')}]`);
	}

	// ─── Search helpers ────────────────────────────────────────

	async function typeSearch(term) {
		await page.focus(INPUT);
		await page.keyboard.type(term);
	}

	const searchState = () => page.evaluate(() => ({
		input: document.querySelector('input[data-ln-search-for="demo-table"]').value,
		attr: document.getElementById('demo-table').getAttribute('data-ln-search')
	}));

	const clickClear = () => page.evaluate(() => {
		const input = document.querySelector('input[data-ln-search-for="demo-table"]');
		input.closest('search').querySelector('button[data-ln-search-clear]').click();
	});

	// ─── Sort helpers ──────────────────────────────────────────

	const clickSort = (col, dir) => page.evaluate((c, d) => {
		const th = document.getElementById('demo-table').tHead.rows[0].cells[c];
		th.querySelector('ul[data-ln-sort="demo-table"] button[data-ln-sort-dir="' + d + '"]').click();
	}, col, dir);

	const sortState = col => page.evaluate(c => {
		const th = document.getElementById('demo-table').tHead.rows[0].cells[c];
		return {
			state: th.querySelector('ul[data-ln-sort="demo-table"]').getAttribute('data-ln-sort-state'),
			aria: th.getAttribute('aria-sort')
		};
	}, col);

	// ─── Filter helpers ────────────────────────────────────────

	// value === null clicks the "All" (data-ln-filter-reset) checkbox of that key.
	const clickFilter = (key, value) => page.evaluate((k, v) => {
		const sel = v === null
			? 'input[data-ln-filter-key="' + k + '"][data-ln-filter-reset]'
			: 'input[data-ln-filter-key="' + k + '"][data-ln-filter-value="' + v + '"]';
		document.querySelector('ul[data-ln-filter="demo-table"] ' + sel).click();
	}, key, value);

	// Reset checkbox is reported as '*'.
	const checkedValues = key => page.evaluate(k => Array.from(document.querySelectorAll(
		'ul[data-ln-filter="demo-table"] input[data-ln-filter-key="' + k + '"]:checked'))
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), key);

	const filterIndicator = key => page.evaluate(k => document
		.querySelector('#demo-table thead th[data-ln-table-filter-col="' + k + '"] button[data-ln-popover-for]')
		.classList.contains('ln-filter-active'), key);

	// ═══ 0. Initial state ═════════════════════════════════════

	section('Initial state');
	await load();
	await expectVisible(ALL_IDS, `all ${ROW_COUNT} rows visible on load`);
	assert(same(await domIds(), ALL_IDS), 'DOM order is the server order (1..20)');
	for (let c = 0; c < SORT_LISTS; c++) {
		const s = await sortState(c);
		assert(s.state === 'none', `sort list ${c} starts at data-ln-sort-state="none"`);
	}
	assert(same(await checkedValues('category'), ['*']), 'category filter starts on "All"');
	assert(same(await checkedValues('status'), ['*']), 'status filter starts on "All"');
	assert((await searchState()).input === '', 'search input starts empty');

	// ═══ 1. Search ════════════════════════════════════════════

	const searchCases = [
		['usb', [3, 18, 19], 'matches product text'],
		['MOUSE', [2, 15], 'is case-insensitive'],
		['wireless mouse', [2], 'AND-s whitespace-separated tokens'],
		['storage', [9, 18], 'matches the Category cell, not only the product name'],
		['zzzz', [], 'no match hides every row']
	];
	for (const [term, expected, what] of searchCases) {
		section(`Search "${term}" ${what}`);
		await load();
		await typeSearch(term);
		await expectVisible(expected, `search "${term}"`);
	}

	section('Search writes data-ln-search and data-ln-search-hide');
	await load();
	await typeSearch('usb');
	await expectVisible([3, 18, 19], 'search "usb"');
	assert((await searchState()).attr === 'usb', 'table data-ln-search holds the typed term');
	const searchHide = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.map(tr => tr.getAttribute('data-ln-search-hide')));
	assert(searchHide.every((v, i) => (v === 'true') === ![3, 18, 19].includes(i + 1)),
		'non-matching rows carry data-ln-search-hide="true", matching rows do not');

	section('Search clear button');
	await load();
	await typeSearch('usb');
	await expectVisible([3, 18, 19], 'search "usb"');
	await clickClear();
	await expectVisible(ALL_IDS, 'clear button restores every row');
	const cleared = await searchState();
	assert(cleared.input === '' && cleared.attr === '', 'input value and table data-ln-search are both empty');

	section('"/" shortcut focuses the search input (ln-table-coordinator)');
	await load();
	await page.keyboard.press('/');
	const focused = await page.evaluate(() => {
		const input = document.querySelector('input[data-ln-search-for="demo-table"]');
		return document.activeElement === input && input.value === '';
	});
	assert(focused, 'search input is focused and the "/" character was not typed into it');

	// ═══ 2. Sort ══════════════════════════════════════════════

	section('Sort # column is numeric');
	await load();
	await clickSort(COL.id, 'desc');
	await expectVisible(reversed(ALL_IDS), '# desc gives 20..1 (a string sort would give 9..1 first)');
	let s = await sortState(COL.id);
	assert(s.state === 'desc' && s.aria === 'descending', 'ul data-ln-sort-state="desc" and th aria-sort="descending"');
	await clickSort(COL.id, 'none');
	await expectVisible(ALL_IDS, '# none restores the original order');
	s = await sortState(COL.id);
	assert(s.state === 'none' && s.aria === 'none', 'ul data-ln-sort-state="none" and th aria-sort="none"');

	section('Sort Price uses data-ln-value (numeric)');
	await load();
	await clickSort(COL.price, 'asc');
	await expectVisible(PRICE_ASC_IDS, 'price asc: 19 first, 1499 last');
	await clickSort(COL.price, 'desc');
	await expectVisible(reversed(PRICE_ASC_IDS), 'price desc: 1499 first, 19 last');
	await clickSort(COL.price, 'none');
	await expectVisible(ALL_IDS, 'price none restores the original order');

	section('Sort Stock uses data-ln-value (numeric, ties allowed)');
	await load();
	await clickSort(COL.stock, 'asc');
	let values = await columnValues(COL.stock);
	assert(isAscending(values) && values[0] === 0 && values[values.length - 1] === 500, 'stock asc: nondecreasing, 0 first, 500 last');
	await clickSort(COL.stock, 'desc');
	values = await columnValues(COL.stock);
	assert(isDescending(values) && values[0] === 500 && values[values.length - 1] === 0, 'stock desc: nonincreasing, 500 first, 0 last');

	section('Sort Product (text)');
	await load();
	await clickSort(COL.product, 'asc');
	let ids = await domIds();
	assert(ids[0] === 14 && ids[ids.length - 1] === 2, 'product asc: "Cable Kit Modular sleeve" (14) first, "Wireless Mouse M1" (2) last');
	await clickSort(COL.product, 'desc');
	ids = await domIds();
	assert(ids[0] === 2 && ids[ids.length - 1] === 14, 'product desc: "Wireless Mouse M1" (2) first, "Cable Kit Modular sleeve" (14) last');

	section('Sort Category and Status (text, grouped)');
	await load();
	await clickSort(COL.category, 'asc');
	assert(same(groups(await columnTexts(COL.category)), CATEGORIES_ASC), 'category asc groups: ' + CATEGORIES_ASC.join(' < '));
	await clickSort(COL.category, 'desc');
	assert(same(groups(await columnTexts(COL.category)), reversed(CATEGORIES_ASC)), 'category desc groups are reversed');
	await clickSort(COL.status, 'asc');
	assert(same(groups(await columnTexts(COL.status)), STATUSES_ASC), 'status asc groups: ' + STATUSES_ASC.join(' < '));
	await clickSort(COL.status, 'desc');
	assert(same(groups(await columnTexts(COL.status)), reversed(STATUSES_ASC)), 'status desc groups are reversed');

	section('Sorting one column resets the others; none restores the first-seen order');
	await load();
	await clickSort(COL.price, 'asc');
	await clickSort(COL.product, 'asc');
	const price = await sortState(COL.price);
	const product = await sortState(COL.product);
	assert(price.state === 'none' && price.aria === 'none', 'price list reset to none when product is sorted');
	assert(product.state === 'asc' && product.aria === 'ascending', 'product list is asc / ascending');
	await clickSort(COL.product, 'none');
	await expectVisible(ALL_IDS, 'product none restores the original server order');

	// ═══ 3. Filter ════════════════════════════════════════════

	section('Filter Category = Electronics');
	await load();
	await clickFilter('category', 'Electronics');
	await expectVisible([1, 5], 'category Electronics');
	assert(same(await checkedValues('category'), ['Electronics']), '"All" is unchecked, only Electronics is checked');
	const filterHide = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-table tbody tr'))
		.map(tr => tr.getAttribute('data-ln-filter-hide')));
	assert(filterHide.every((v, i) => (v === 'true') === ![1, 5].includes(i + 1)),
		'non-matching rows carry data-ln-filter-hide="true", matching rows do not');
	assert(await filterIndicator('category') === true, 'ln-table-coordinator marks the category header button ln-filter-active');
	assert(await filterIndicator('status') === false, 'status header button is not marked');

	section('Filter values OR within a column, "All" resets');
	await load();
	await clickFilter('category', 'Electronics');
	await clickFilter('category', 'Storage');
	await expectVisible([1, 5, 9, 18], 'category Electronics OR Storage');
	await clickFilter('category', null);
	await expectVisible(ALL_IDS, 'category "All" restores every row');
	assert(same(await checkedValues('category'), ['*']), 'only "All" is checked again');
	assert(await filterIndicator('category') === false, 'header indicator cleared');

	section('Unchecking the last value falls back to "All"');
	await load();
	await clickFilter('category', 'Electronics');
	await expectVisible([1, 5], 'category Electronics');
	await clickFilter('category', 'Electronics');
	await expectVisible(ALL_IDS, 'every row visible again');
	assert(same(await checkedValues('category'), ['*']), '"All" re-checked automatically');

	section('Filter Status');
	await load();
	await clickFilter('status', 'Out of Stock');
	await expectVisible([6, 15], 'status Out of Stock');
	await clickFilter('status', 'Out of Stock');
	await clickFilter('status', 'Low Stock');
	await expectVisible([4, 5, 11, 12, 17, 20], 'status Low Stock');

	section('Filters AND across columns');
	await load();
	await clickFilter('category', 'Accessories');
	await clickFilter('status', 'In Stock');
	await expectVisible([7, 8, 14, 16, 19], 'category Accessories AND status In Stock');
	await clickFilter('status', null);
	await expectVisible([7, 8, 14, 15, 16, 19, 20], 'resetting status leaves category Accessories only');

	// ═══ 4. Column-filter popover (real user path) ════════════

	section('Category popover: open, pick a value by clicking its label, close with Escape');
	await load();
	await page.click('button[data-ln-popover-for="filter-category"]');
	await page.waitForFunction(() => document.getElementById('filter-category').getAttribute('data-ln-popover') === 'open', { timeout: 5000 });
	const opened = await page.evaluate(() => ({
		topLayer: document.getElementById('filter-category').matches(':popover-open'),
		expanded: document.querySelector('button[data-ln-popover-for="filter-category"]').getAttribute('aria-expanded')
	}));
	assert(opened.topLayer && opened.expanded === 'true', 'popover is open (:popover-open) and trigger aria-expanded="true"');
	const label = await page.evaluateHandle(() => document
		.querySelector('#filter-category input[data-ln-filter-value="Storage"]').closest('label'));
	await label.asElement().click();
	await expectVisible([9, 18], 'clicking the "Storage" label filters the table');
	assert(await filterIndicator('category') === true, 'header button marked ln-filter-active');
	await page.keyboard.press('Escape');
	await page.waitForFunction(() => document.querySelector('button[data-ln-popover-for="filter-category"]')
		.getAttribute('aria-expanded') === 'false', { timeout: 5000 });
	const closedTopLayer = await page.evaluate(() => document.getElementById('filter-category').matches(':popover-open'));
	assert(closedTopLayer === false, 'Escape closes the popover (no longer :popover-open, aria-expanded="false")');

	// ═══ 5. Combined search + filter + sort ═══════════════════

	section('Search AND filter');
	await load();
	await typeSearch('usb');
	await clickFilter('category', 'Peripherals');
	await expectVisible([3], 'search "usb" AND category Peripherals');
	await clickClear();
	await expectVisible([2, 3, 4, 6], 'clearing search leaves category Peripherals');
	await clickFilter('category', null);
	await expectVisible(ALL_IDS, 'resetting the filter shows every row');

	section('Filter AND sort');
	await load();
	await clickFilter('category', 'Accessories');
	await expectVisible([7, 8, 14, 15, 16, 19, 20], 'category Accessories');
	await clickSort(COL.price, 'asc');
	await expectVisible([15, 16, 14, 19, 7, 8, 20], 'price asc within Accessories');
	await clickSort(COL.price, 'desc');
	await expectVisible([20, 8, 7, 19, 14, 16, 15], 'price desc within Accessories');
	await clickSort(COL.price, 'none');
	await expectVisible([7, 8, 14, 15, 16, 19, 20], 'sort none restores the original order inside the filter');
	await clickFilter('category', null);
	await expectVisible(ALL_IDS, 'resetting the filter shows every row in the original order');

	// ═══ 6. Persist ═══════════════════════════════════════════

	section('Persist: search term survives a reload (data-ln-persist on the table)');
	await load();
	await typeSearch('usb');
	await expectVisible([3, 18, 19], 'search "usb"');
	const stored = await page.waitForFunction(() => localStorage.getItem('ln:demo-table:data-ln-search') === 'usb', { timeout: 5000 })
		.then(() => true, () => false);
	assert(stored, 'localStorage "ln:demo-table:data-ln-search" holds "usb"');
	await page.reload({ waitUntil: 'load' });
	await ready();
	await expectVisible([3, 18, 19], 'after reload the search is re-applied');
	const restored = await searchState();
	assert(restored.input === 'usb' && restored.attr === 'usb', 'input value and table data-ln-search are restored');
});
