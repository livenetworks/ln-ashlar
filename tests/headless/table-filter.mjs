import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/table-filter.html (live demo,
// table#employee-table inside [data-ln-table-coordinator]) and the components it mounts:
// ln-search, ln-sort, ln-filter, ln-table-coordinator, ln-popover, ln-persist.
// The table is a plain <table> (no data-ln-table): ln-search / ln-sort / ln-filter act on the rows directly.

const PAGE_URL = BASE_URL + 'table-filter.html';
const TABLE = 'employee-table';
const SORT_LISTS = 5;
const FILTER_LISTS = 3;
const COL = { name: 0, dept: 1, role: 2, status: 3, location: 4 };

// Row names in server (DOM) order, from the tbody markup.
const ALL = [
	'Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Sara Dimitrova', 'Elena Ristova',
	'Toni Angelov', 'Boris Ilievski', 'Kristina Gjorgjevska', 'Darko Mitevski', 'Maja Kostadinova',
	'Petar Blazevski', 'Aleksandar Naumov', 'Vesna Todorova', 'Lidija Petrovska', 'Nikola Trajkovski',
	'Jovana Milosevska', 'Stefan Georgiev', 'Teodora Angelova'
];
const NAME_ASC = [
	'Aleksandar Naumov', 'Ana Petrova', 'Boris Ilievski', 'Darko Mitevski', 'Elena Ristova',
	'Ivan Stojanovski', 'Jovana Milosevska', 'Kristina Gjorgjevska', 'Lidija Petrovska', 'Maja Kostadinova',
	'Marko Nikolov', 'Nikola Trajkovski', 'Petar Blazevski', 'Sara Dimitrova', 'Stefan Georgiev',
	'Teodora Angelova', 'Toni Angelov', 'Vesna Todorova'
];
const DEPT_ASC = ['Design', 'Engineering', 'Finance', 'HR', 'Marketing', 'QA'];
const STATUS_ASC = ['Active', 'Inactive', 'On Leave'];
const LOCATION_ASC = ['Bitola', 'Ohrid', 'Prilep', 'Skopje'];

const ENGINEERING = ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski', 'Petar Blazevski', 'Aleksandar Naumov', 'Lidija Petrovska'];
const SKOPJE = ['Ana Petrova', 'Marko Nikolov', 'Sara Dimitrova', 'Toni Angelov', 'Boris Ilievski', 'Darko Mitevski',
	'Maja Kostadinova', 'Aleksandar Naumov', 'Lidija Petrovska', 'Jovana Milosevska', 'Stefan Georgiev'];

const INPUT = 'input[data-ln-search-for="' + TABLE + '"]';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const reversed = list => list.slice().reverse();
const groups = list => list.filter((v, i) => i === 0 || v !== list[i - 1]);
const inDomOrder = names => ALL.filter(n => names.includes(n));

run('demo/admin/table-filter.html', async ({ page }) => {

	const failures = [];

	// ─── Page helpers ──────────────────────────────────────────

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  [SECTION FAILED] ${title}`);
		}
	}

	async function ready() {
		await page.waitForFunction((sortLists, filterLists, id) => {
			const table = document.getElementById(id);
			if (!table || !table.lnSearch) return false;
			const input = document.querySelector('input[data-ln-search-for="' + id + '"]');
			if (!input || !input.lnSearchControl) return false;
			const host = table.closest('[data-ln-table-coordinator]');
			if (!host || !host.lnTableCoordinator) return false;
			const sorts = document.querySelectorAll('ul[data-ln-sort="' + id + '"]');
			if (sorts.length !== sortLists || !Array.from(sorts).every(el => el.lnSort)) return false;
			const filters = document.querySelectorAll('ul[data-ln-filter="' + id + '"]');
			if (filters.length !== filterLists || !Array.from(filters).every(el => el.lnFilter)) return false;
			return true;
		}, { timeout: 10000 }, SORT_LISTS, FILTER_LISTS, TABLE);
	}

	// Fresh, state-free page: ln-persist would otherwise restore a previous section's search term.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const visibleNames = () => page.evaluate(id => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
		.filter(tr => getComputedStyle(tr).display !== 'none')
		.map(tr => tr.cells[0].textContent.trim()), TABLE);

	const domNames = () => page.evaluate(id => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
		.map(tr => tr.cells[0].textContent.trim()), TABLE);

	const columnTexts = col => page.evaluate((id, c) => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
		.map(tr => tr.cells[c].textContent.trim()), TABLE, col);

	// Waits for the visible names (in DOM order) to equal `expected`, then asserts.
	async function expectVisible(expected, label) {
		await page.waitForFunction((id, exp) => {
			const names = Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
				.filter(tr => getComputedStyle(tr).display !== 'none')
				.map(tr => tr.cells[0].textContent.trim());
			return names.length === exp.length && names.every((n, i) => n === exp[i]);
		}, { timeout: 5000 }, TABLE, expected).catch(() => {});
		const actual = await visibleNames();
		assert(same(actual, expected), `${label}: expected [${expected.join(', ')}], got [${actual.join(', ')}]`);
	}

	// ─── Search helpers ────────────────────────────────────────

	async function typeSearch(term) {
		await page.focus(INPUT);
		await page.keyboard.type(term);
	}

	const searchState = () => page.evaluate((id, sel) => ({
		input: document.querySelector(sel).value,
		attr: document.getElementById(id).getAttribute('data-ln-search')
	}), TABLE, INPUT);

	const clickClear = () => page.evaluate(sel => {
		document.querySelector(sel).closest('search').querySelector('button[data-ln-search-clear]').click();
	}, INPUT);

	// ─── Sort helpers ──────────────────────────────────────────

	const clickSort = (col, dir) => page.evaluate((id, c, d) => {
		const th = document.getElementById(id).tHead.rows[0].cells[c];
		th.querySelector('ul[data-ln-sort="' + id + '"] button[data-ln-sort-dir="' + d + '"]').click();
	}, TABLE, col, dir);

	const sortState = col => page.evaluate((id, c) => {
		const th = document.getElementById(id).tHead.rows[0].cells[c];
		return {
			state: th.querySelector('ul[data-ln-sort="' + id + '"]').getAttribute('data-ln-sort-state'),
			aria: th.getAttribute('aria-sort')
		};
	}, TABLE, col);

	// ─── Filter helpers ────────────────────────────────────────

	// value === null clicks the "All" (data-ln-filter-reset) checkbox of that key.
	const clickFilter = (key, value) => page.evaluate((id, k, v) => {
		const sel = v === null
			? 'input[data-ln-filter-key="' + k + '"][data-ln-filter-reset]'
			: 'input[data-ln-filter-key="' + k + '"][data-ln-filter-value="' + v + '"]';
		document.querySelector('ul[data-ln-filter="' + id + '"] ' + sel).click();
	}, TABLE, key, value);

	// Reset checkbox is reported as '*'.
	const checkedValues = key => page.evaluate((id, k) => Array.from(document.querySelectorAll(
		'ul[data-ln-filter="' + id + '"] input[data-ln-filter-key="' + k + '"]:checked'))
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), TABLE, key);

	const filterIndicator = key => page.evaluate((id, k) => document
		.querySelector('#' + id + ' thead th[data-ln-table-filter-col="' + k + '"] button[data-ln-table-col-filter]')
		.classList.contains('ln-filter-active'), TABLE, key);

	async function openPopover(id) {
		await page.click('button[data-ln-popover-for="' + id + '"]');
		await page.waitForFunction(pid => document.getElementById(pid).getAttribute('data-ln-popover') === 'open', { timeout: 5000 }, id);
	}

	async function closePopover(id) {
		await page.keyboard.press('Escape');
		await page.waitForFunction(pid => document.querySelector('button[data-ln-popover-for="' + pid + '"]')
			.getAttribute('aria-expanded') === 'false', { timeout: 5000 }, id);
	}

	// ═══ 0. Initial state ═════════════════════════════════════

	await section('Initial state', async () => {
		await load();
		await expectVisible(ALL, 'all 18 rows visible on load');
		assert(same(await domNames(), ALL), 'DOM order is the server order');
		for (let c = 0; c < SORT_LISTS; c++) {
			const s = await sortState(c);
			assert(s.state === 'none', `sort list ${c} starts at data-ln-sort-state="none"`);
		}
		for (const key of ['dept', 'role', 'status']) {
			assert(same(await checkedValues(key), ['*']), `${key} filter starts on "All"`);
			assert(await filterIndicator(key) === false, `${key} header button is not marked ln-filter-active`);
		}
		assert((await searchState()).input === '', 'search input starts empty');
	});

	// ═══ 1. Search ════════════════════════════════════════════

	const searchCases = [
		['skopje', inDomOrder(SKOPJE), 'matches the Location cell'],
		['ENGINEERING', inDomOrder(ENGINEERING), 'is case-insensitive and matches the Department cell'],
		['design skopje', ['Marko Nikolov', 'Stefan Georgiev'], 'AND-s whitespace-separated tokens'],
		['inactive', ['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'], 'matches the badge text in the Status cell'],
		['zzzz', [], 'no match hides every row']
	];
	for (const [term, expected, what] of searchCases) {
		await section(`Search "${term}" ${what}`, async () => {
			await load();
			await typeSearch(term);
			await expectVisible(expected, `search "${term}"`);
		});
	}

	await section('Search writes data-ln-search and data-ln-search-hide', async () => {
		await load();
		await typeSearch('inactive');
		const expected = ['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'];
		await expectVisible(expected, 'search "inactive"');
		assert((await searchState()).attr === 'inactive', 'table data-ln-search holds the typed term');
		const hide = await page.evaluate(id => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
			.map(tr => [tr.cells[0].textContent.trim(), tr.getAttribute('data-ln-search-hide')]), TABLE);
		assert(hide.every(([n, v]) => (v === 'true') === !expected.includes(n)),
			'non-matching rows carry data-ln-search-hide="true", matching rows do not');
	});

	await section('Search clear button', async () => {
		await load();
		await typeSearch('inactive');
		await expectVisible(['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'], 'search "inactive"');
		await clickClear();
		await expectVisible(ALL, 'clear button restores every row');
		const cleared = await searchState();
		assert(cleared.input === '' && cleared.attr === '', 'input value and table data-ln-search are both empty');
	});

	await section('"/" shortcut focuses the search input (ln-table-coordinator)', async () => {
		await load();
		await page.keyboard.press('/');
		const focused = await page.evaluate(sel => {
			const input = document.querySelector(sel);
			return document.activeElement === input && input.value === '';
		}, INPUT);
		assert(focused, 'employee search input is focused and the "/" character was not typed into it');
	});

	// ═══ 2. Sort ══════════════════════════════════════════════

	await section('Sort Name (text, asc / desc / none)', async () => {
		await load();
		await clickSort(COL.name, 'asc');
		await expectVisible(NAME_ASC, 'name asc');
		let s = await sortState(COL.name);
		assert(s.state === 'asc' && s.aria === 'ascending', 'ul data-ln-sort-state="asc" and th aria-sort="ascending"');
		await clickSort(COL.name, 'desc');
		await expectVisible(reversed(NAME_ASC), 'name desc');
		s = await sortState(COL.name);
		assert(s.state === 'desc' && s.aria === 'descending', 'ul data-ln-sort-state="desc" and th aria-sort="descending"');
		await clickSort(COL.name, 'none');
		await expectVisible(ALL, 'name none restores the original order');
		s = await sortState(COL.name);
		assert(s.state === 'none' && s.aria === 'none', 'ul data-ln-sort-state="none" and th aria-sort="none"');
	});

	await section('Sort Department, Status, Location (grouped)', async () => {
		await load();
		await clickSort(COL.dept, 'asc');
		assert(same(groups(await columnTexts(COL.dept)), DEPT_ASC), 'department asc groups: ' + DEPT_ASC.join(' < '));
		await clickSort(COL.dept, 'desc');
		assert(same(groups(await columnTexts(COL.dept)), reversed(DEPT_ASC)), 'department desc groups are reversed');
		await clickSort(COL.status, 'asc');
		assert(same(groups(await columnTexts(COL.status)), STATUS_ASC), 'status asc groups: ' + STATUS_ASC.join(' < '));
		await clickSort(COL.status, 'desc');
		assert(same(groups(await columnTexts(COL.status)), reversed(STATUS_ASC)), 'status desc groups are reversed');
		await clickSort(COL.location, 'asc');
		assert(same(groups(await columnTexts(COL.location)), LOCATION_ASC), 'location asc groups: ' + LOCATION_ASC.join(' < '));
		await clickSort(COL.location, 'desc');
		assert(same(groups(await columnTexts(COL.location)), reversed(LOCATION_ASC)), 'location desc groups are reversed');
	});

	await section('Sort Role (text)', async () => {
		await load();
		await clickSort(COL.role, 'asc');
		let roles = await columnTexts(COL.role);
		assert(roles[0] === 'Accountant' && roles[roles.length - 1] === 'UX Researcher', 'role asc: Accountant first, UX Researcher last');
		await clickSort(COL.role, 'desc');
		roles = await columnTexts(COL.role);
		assert(roles[0] === 'UX Researcher' && roles[roles.length - 1] === 'Accountant', 'role desc: UX Researcher first, Accountant last');
	});

	await section('Sorting one column resets the others; none restores the first-seen order', async () => {
		await load();
		await clickSort(COL.location, 'asc');
		await clickSort(COL.name, 'asc');
		const location = await sortState(COL.location);
		const name = await sortState(COL.name);
		assert(location.state === 'none' && location.aria === 'none', 'location list reset to none when name is sorted');
		assert(name.state === 'asc' && name.aria === 'ascending', 'name list is asc / ascending');
		await clickSort(COL.name, 'none');
		await expectVisible(ALL, 'name none restores the original server order');
	});

	// ═══ 3. Filter ════════════════════════════════════════════

	await section('Filter Department = Engineering', async () => {
		await load();
		await clickFilter('dept', 'Engineering');
		await expectVisible(inDomOrder(ENGINEERING), 'dept Engineering');
		assert(same(await checkedValues('dept'), ['Engineering']), '"All" is unchecked, only Engineering is checked');
		const hide = await page.evaluate(id => Array.from(document.querySelectorAll('#' + id + ' tbody tr'))
			.map(tr => [tr.cells[0].textContent.trim(), tr.getAttribute('data-ln-filter-hide')]), TABLE);
		assert(hide.every(([n, v]) => (v === 'true') === !ENGINEERING.includes(n)),
			'non-matching rows carry data-ln-filter-hide="true", matching rows do not');
		assert(await filterIndicator('dept') === true, 'ln-table-coordinator marks the dept header button ln-filter-active');
		assert(await filterIndicator('status') === false, 'status header button is not marked');
	});

	await section('Filter values OR within a column, "All" resets', async () => {
		await load();
		await clickFilter('dept', 'Design');
		await clickFilter('dept', 'QA');
		await expectVisible(['Marko Nikolov', 'Elena Ristova', 'Toni Angelov', 'Jovana Milosevska', 'Stefan Georgiev'], 'dept Design OR QA');
		await clickFilter('dept', null);
		await expectVisible(ALL, 'dept "All" restores every row');
		assert(same(await checkedValues('dept'), ['*']), 'only "All" is checked again');
		assert(await filterIndicator('dept') === false, 'header indicator cleared');
	});

	await section('Unchecking the last value falls back to "All"', async () => {
		await load();
		await clickFilter('dept', 'HR');
		await expectVisible(['Maja Kostadinova', 'Vesna Todorova'], 'dept HR');
		await clickFilter('dept', 'HR');
		await expectVisible(ALL, 'every row visible again');
		assert(same(await checkedValues('dept'), ['*']), '"All" re-checked automatically');
	});

	await section('Zero-record domain option "Product" matches no row', async () => {
		await load();
		await clickFilter('dept', 'Product');
		await expectVisible([], 'dept Product (no employee has it)');
	});

	await section('Filter Status and Role', async () => {
		await load();
		await clickFilter('status', 'Inactive');
		await expectVisible(['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'], 'status Inactive (exact match, not "Active")');
		await clickFilter('status', 'Inactive');
		await clickFilter('status', 'On Leave');
		await expectVisible(['Elena Ristova', 'Aleksandar Naumov'], 'status On Leave');
		assert(await filterIndicator('status') === true, 'status header button marked ln-filter-active');
		await clickFilter('status', null);
		await clickFilter('role', 'QA Lead');
		await expectVisible(['Jovana Milosevska'], 'role QA Lead');
		assert(await filterIndicator('role') === true, 'role header button marked ln-filter-active');
	});

	await section('Filters AND across columns', async () => {
		await load();
		await clickFilter('dept', 'Engineering');
		await clickFilter('status', 'On Leave');
		await expectVisible(['Aleksandar Naumov'], 'dept Engineering AND status On Leave');
		await clickFilter('status', null);
		await expectVisible(inDomOrder(ENGINEERING), 'resetting status leaves dept Engineering only');
	});

	// ═══ 4. Column-filter popovers (real user path) ═══════════

	await section('Department popover: open, pick a value by clicking its label, close with Escape', async () => {
		await load();
		await openPopover('filter-dept');
		const opened = await page.evaluate(() => ({
			topLayer: document.getElementById('filter-dept').matches(':popover-open'),
			expanded: document.querySelector('button[data-ln-popover-for="filter-dept"]').getAttribute('aria-expanded')
		}));
		assert(opened.topLayer && opened.expanded === 'true', 'popover is open (:popover-open) and trigger aria-expanded="true"');
		const label = await page.evaluateHandle(() => document
			.querySelector('#filter-dept input[data-ln-filter-value="Finance"]').closest('label'));
		await label.asElement().click();
		await expectVisible(['Kristina Gjorgjevska', 'Darko Mitevski', 'Teodora Angelova'], 'clicking the "Finance" label filters the table');
		assert(await filterIndicator('dept') === true, 'header button marked ln-filter-active');
		await closePopover('filter-dept');
		const closed = await page.evaluate(() => document.getElementById('filter-dept').matches(':popover-open'));
		assert(closed === false, 'Escape closes the popover (no longer :popover-open, aria-expanded="false")');
	});

	await section('Status popover opens and filters', async () => {
		await load();
		await openPopover('filter-status');
		const label = await page.evaluateHandle(() => document
			.querySelector('#filter-status input[data-ln-filter-value="Inactive"]').closest('label'));
		await label.asElement().click();
		await expectVisible(['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'], 'clicking the "Inactive" label filters the table');
		await closePopover('filter-status');
	});

	await section('Department popover search narrows the option list; its clear button restores it', async () => {
		await load();
		await openPopover('filter-dept');
		await page.click('#filter-dept input[data-ln-search-for="filter-dept-list"]');
		await page.keyboard.type('eng');
		await page.waitForFunction(() => document.getElementById('filter-dept-list').getAttribute('data-ln-search') === 'eng', { timeout: 5000 });
		const options = () => page.evaluate(() => Array.from(document.querySelectorAll('#filter-dept-list li label'))
			.filter(l => l.getAttribute('data-ln-search-hide') !== 'true')
			.map(l => l.textContent.trim()));
		await page.waitForFunction(() => Array.from(document.querySelectorAll('#filter-dept-list li label'))
			.filter(l => l.getAttribute('data-ln-search-hide') !== 'true').length === 1, { timeout: 5000 });
		assert(same(await options(), ['Engineering']), 'typing "eng" leaves only the Engineering option un-hidden');
		await expectVisible(ALL, 'option search does not filter the table rows');
		await page.click('#filter-dept button[data-ln-search-clear]');
		await page.waitForFunction(() => Array.from(document.querySelectorAll('#filter-dept-list li label'))
			.every(l => l.getAttribute('data-ln-search-hide') !== 'true'), { timeout: 5000 });
		const cleared = await page.evaluate(() => ({
			input: document.querySelector('#filter-dept input[data-ln-search-for="filter-dept-list"]').value,
			attr: document.getElementById('filter-dept-list').getAttribute('data-ln-search')
		}));
		assert(cleared.input === '' && cleared.attr === '', 'clear empties the option search input and data-ln-search');
		assert((await options()).length === 8, 'all 8 options (All + 7 departments) are un-hidden again');
	});

	// ═══ 5. Combined search + filter + sort ═══════════════════

	await section('Search AND filter', async () => {
		await load();
		await typeSearch('skopje');
		await clickFilter('dept', 'Engineering');
		const both = ['Ana Petrova', 'Boris Ilievski', 'Aleksandar Naumov', 'Lidija Petrovska'];
		await expectVisible(both, 'search "skopje" AND dept Engineering');
		await clickClear();
		await expectVisible(inDomOrder(ENGINEERING), 'clearing search leaves dept Engineering');
		await clickFilter('dept', null);
		await expectVisible(ALL, 'resetting the filter shows every row');
	});

	await section('Filter AND sort', async () => {
		await load();
		await clickFilter('dept', 'Engineering');
		await expectVisible(inDomOrder(ENGINEERING), 'dept Engineering');
		await clickSort(COL.name, 'asc');
		await expectVisible(NAME_ASC.filter(n => ENGINEERING.includes(n)), 'name asc within Engineering');
		await clickSort(COL.name, 'none');
		await expectVisible(inDomOrder(ENGINEERING), 'sort none restores the original order inside the filter');
		await clickFilter('dept', null);
		await expectVisible(ALL, 'resetting the filter shows every row in the original order');
	});

	// ═══ 6. Persist ═══════════════════════════════════════════

	await section('Persist: search term survives a reload (data-ln-persist on the table)', async () => {
		await load();
		await typeSearch('inactive');
		const expected = ['Ivan Stojanovski', 'Darko Mitevski', 'Stefan Georgiev'];
		await expectVisible(expected, 'search "inactive"');
		const stored = await page.waitForFunction(id => localStorage.getItem('ln:' + id + ':data-ln-search') === 'inactive', { timeout: 5000 }, TABLE)
			.then(() => true, () => false);
		assert(stored, 'localStorage "ln:employee-table:data-ln-search" holds "inactive"');
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectVisible(expected, 'after reload the search is re-applied');
		const restored = await searchState();
		assert(restored.input === 'inactive' && restored.attr === 'inactive', 'input value and table data-ln-search are restored');
	});

	if (failures.length > 0) {
		console.error(`\n${failures.length} section(s) failed:`);
		for (const f of failures) console.error('  - ' + f);
		throw new Error(`${failures.length} section(s) failed`);
	}
});
