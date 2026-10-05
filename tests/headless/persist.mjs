import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/persist.html and the components it
// mounts: ln-persist (key = ln:{data-ln-persist || id}:{attr}, page scope inserts the
// lowercased pathname), ln-toggle, ln-accordion, ln-tabs, ln-sort, ln-filter.

const PAGE_URL = BASE_URL + 'persist.html';
const SORT_KEYS = ['name-sort', 'department-sort', 'role-sort', 'salary-sort', 'start-date-sort'];
const TOGGLE_IDS = ['persist-toggle-a', 'persist-toggle-b', 'no-persist-toggle', 'acc-panel-1', 'acc-panel-2', 'acc-panel-3'];

const NAMES_ORIGINAL = ['Alice Johnson', 'Bob Martinez', 'Carol White', 'David Lee', 'Eva Novak', 'Frank Okafor', 'Grace Park'];
// Salary values: Alice 95000, Bob 82000, Carol 74000, David 78000, Eva 90000, Frank 88000, Grace 69000.
const NAMES_SALARY_DESC = ['Alice Johnson', 'Eva Novak', 'Frank Okafor', 'Bob Martinez', 'David Lee', 'Carol White', 'Grace Park'];
// Departments: Alice Eng, Bob Design, Carol Eng, David Marketing, Eva Design, Frank Eng, Grace Marketing.
const DEPTS_ASC = ['Design', 'Design', 'Engineering', 'Engineering', 'Engineering', 'Marketing', 'Marketing'];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/persist.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section runs in its own try/catch so one broken feature does not hide the others.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// ─── Page helpers ──────────────────────────────────────────

	async function ready() {
		await page.waitForFunction((toggleIds, sortCount) => {
			if (!toggleIds.every(id => { const el = document.getElementById(id); return el && el.lnToggle; })) return false;
			const acc = document.querySelector('[data-ln-accordion]');
			if (!acc || !acc.lnAccordion) return false;
			const tabs = document.querySelector('[data-ln-persist="persist-settings-tabs"]');
			if (!tabs || !tabs.lnTabs) return false;
			const hashTabs = document.getElementById('hash-tabs-demo');
			if (!hashTabs || !hashTabs.lnTabs) return false;
			const sorts = document.querySelectorAll('ul[data-ln-sort="persist-table"]');
			if (sorts.length !== sortCount || !Array.from(sorts).every(el => el.lnSort)) return false;
			const filter = document.getElementById('persist-filter');
			if (!filter || !filter.lnFilter) return false;
			return true;
		}, { timeout: 10000 }, TOGGLE_IDS, SORT_KEYS.length);
	}

	// Fresh, state-free page: persisted state from a previous section must not leak.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	async function reload() {
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const ls = key => page.evaluate(k => localStorage.getItem(k), key);
	const lsKeys = () => page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ln:')).sort());
	const click = sel => page.evaluate(s => document.querySelector(s).click(), sel);
	const attr = (sel, name) => page.evaluate((s, n) => document.querySelector(s).getAttribute(n), sel, name);

	async function waitAttr(sel, name, value) {
		await page.waitForFunction((s, n, v) => {
			const el = document.querySelector(s);
			return !!el && el.getAttribute(n) === v;
		}, { timeout: 5000 }, sel, name, value);
	}

	async function waitStored(key, value) {
		await page.waitForFunction((k, v) => localStorage.getItem(k) === v, { timeout: 5000 }, key, value);
	}

	const toggleState = id => page.evaluate(i => {
		const el = document.getElementById(i);
		return {
			attr: el.getAttribute('data-ln-toggle'),
			open: el.classList.contains('open'),
			isOpen: el.lnToggle.isOpen
		};
	}, id);

	const toggleKey = id => `ln:${id}:data-ln-toggle`;

	async function expectToggle(id, state) {
		await waitAttr('#' + id, 'data-ln-toggle', state);
		const s = await toggleState(id);
		assert(s.attr === state && s.isOpen === (state === 'open') && s.open === (state === 'open'),
			`#${id} is ${state} (attr=${s.attr}, isOpen=${s.isOpen}, .open=${s.open})`);
	}

	// ─── Section 1: Toggle ─────────────────────────────────────

	await guarded('1 — Toggle persistence', async () => {
		await load();
		const trigger = id => `[data-ln-toggle-for="${id}"]`;

		await expectToggle('persist-toggle-a', 'close');
		await expectToggle('persist-toggle-b', 'close');
		await expectToggle('no-persist-toggle', 'close');

		await click(trigger('persist-toggle-a'));
		await expectToggle('persist-toggle-a', 'open');
		assert(await attr(trigger('persist-toggle-a'), 'aria-expanded') === 'true', 'Trigger A aria-expanded="true"');
		await waitStored(toggleKey('persist-toggle-a'), 'open');
		assert(await ls(toggleKey('persist-toggle-a')) === 'open', 'Toggle A stored under ln:persist-toggle-a:data-ln-toggle = "open"');

		await click(trigger('no-persist-toggle'));
		await expectToggle('no-persist-toggle', 'open');
		assert(await ls(toggleKey('no-persist-toggle')) === null, 'Control toggle writes nothing to localStorage');
		assert(await ls(toggleKey('persist-toggle-b')) === null, 'Untouched toggle B has nothing stored');

		await reload();
		await expectToggle('persist-toggle-a', 'open');
		await expectToggle('persist-toggle-b', 'close');
		await expectToggle('no-persist-toggle', 'close');
		assert(await attr(trigger('persist-toggle-a'), 'aria-expanded') === 'true', 'Trigger A aria-expanded="true" after reload');

		await click(trigger('persist-toggle-b'));
		await expectToggle('persist-toggle-b', 'open');
		await click(trigger('persist-toggle-a'));
		await expectToggle('persist-toggle-a', 'close');
		await waitStored(toggleKey('persist-toggle-a'), 'close');
		await reload();
		await expectToggle('persist-toggle-a', 'close');
		await expectToggle('persist-toggle-b', 'open');
	});

	// ─── Section 2: Accordion ──────────────────────────────────

	await guarded('2 — Accordion persistence', async () => {
		await load();
		const header = n => `[data-ln-toggle-for="acc-panel-${n}"]`;
		const id = n => `acc-panel-${n}`;

		await click(header(1));
		await expectToggle(id(1), 'open');
		await click(header(2));
		await expectToggle(id(2), 'open');
		await expectToggle(id(1), 'close');
		await expectToggle(id(3), 'close');
		await waitStored(toggleKey(id(1)), 'close');
		await waitStored(toggleKey(id(2)), 'open');
		assert(await ls(toggleKey(id(1))) === 'close', 'Panel 1 stored "close" after panel 2 opened');
		assert(await ls(toggleKey(id(2))) === 'open', 'Panel 2 stored "open"');

		await reload();
		await expectToggle(id(2), 'open');
		await expectToggle(id(1), 'close');
		await expectToggle(id(3), 'close');

		await click(header(3));
		await expectToggle(id(3), 'open');
		await expectToggle(id(2), 'close');
		await expectToggle(id(1), 'close');
		await waitStored(toggleKey(id(3)), 'open');
		await waitStored(toggleKey(id(2)), 'close');

		await reload();
		await expectToggle(id(3), 'open');
		await expectToggle(id(2), 'close');
		await expectToggle(id(1), 'close');
	});

	// ─── Section 3a: Tabs (localStorage) ───────────────────────

	const TABS = '[data-ln-persist="persist-settings-tabs"]';
	const TABS_KEY = 'ln:persist-settings-tabs:data-ln-tabs-active';

	const tabsView = () => page.evaluate(sel => {
		const host = document.querySelector(sel);
		const shown = el => !el.hidden && getComputedStyle(el).display !== 'none';
		return {
			active: host.getAttribute('data-ln-tabs-active'),
			selected: Array.from(host.querySelectorAll('[data-ln-tab]'))
				.filter(t => t.getAttribute('aria-selected') === 'true')
				.map(t => t.getAttribute('data-ln-tab')),
			visible: Array.from(host.querySelectorAll('[data-ln-panel]'))
				.filter(shown).map(p => p.getAttribute('data-ln-panel'))
		};
	}, TABS);

	async function expectTab(key) {
		await waitAttr(TABS, 'data-ln-tabs-active', key);
		const v = await tabsView();
		assert(v.active === key && same(v.selected, [key]) && same(v.visible, [key]),
			`Non-hash tabs: only "${key}" active/selected/visible (active=${v.active}, selected=[${v.selected}], visible=[${v.visible}])`);
	}

	await guarded('3a — Non-hash tabs persist via localStorage', async () => {
		await load();
		await expectTab('general');
		assert(!(await page.evaluate(() => location.hash)), 'Button tabs do not touch the URL hash at start');

		await click(`${TABS} [data-ln-tab="security"]`);
		await expectTab('security');
		await waitStored(TABS_KEY, 'security');
		assert(await ls(TABS_KEY) === 'security', 'Stored ln:persist-settings-tabs:data-ln-tabs-active = "security"');
		assert(!(await page.evaluate(() => location.hash)), 'Button tab click does not write the URL hash');

		await reload();
		await expectTab('security');

		await click(`${TABS} [data-ln-tab="notifications"]`);
		await expectTab('notifications');
		await waitStored(TABS_KEY, 'notifications');
		await reload();
		await expectTab('notifications');
	});

	// ─── Section 3b: Tabs (hash) ───────────────────────────────

	const hashTabsView = () => page.evaluate(() => {
		const host = document.getElementById('hash-tabs-demo');
		const shown = el => !el.hidden && getComputedStyle(el).display !== 'none';
		return {
			active: host.getAttribute('data-ln-tabs-active'),
			visible: Array.from(host.querySelectorAll('[data-ln-panel]'))
				.filter(shown).map(p => p.getAttribute('data-ln-panel')),
			hash: location.hash
		};
	});

	async function expectHashTab(key) {
		await waitAttr('#hash-tabs-demo', 'data-ln-tabs-active', key);
		const v = await hashTabsView();
		assert(v.active === key && same(v.visible, [key]),
			`Hash tabs: only "${key}" active/visible (active=${v.active}, visible=[${v.visible}])`);
	}

	await guarded('3b — Hash tabs sync to the URL, not localStorage', async () => {
		await load();
		await expectHashTab('alpha');

		await click('#hash-tabs-demo a[href="#hash-tabs-demo:beta"]');
		await expectHashTab('beta');
		assert((await hashTabsView()).hash === '#hash-tabs-demo:beta', 'URL hash is #hash-tabs-demo:beta');
		const keys = await lsKeys();
		assert(!keys.some(k => k.includes('hash-tabs-demo')), `No localStorage key written for hash tabs (keys: [${keys.join(', ')}])`);

		await page.goto(PAGE_URL + '#hash-tabs-demo:gamma', { waitUntil: 'load' });
		await reload();
		await expectHashTab('gamma');
		assert((await hashTabsView()).hash === '#hash-tabs-demo:gamma', 'Hash survives reload and restores gamma');
		await page.goto(PAGE_URL, { waitUntil: 'load' });
	});

	// ─── Section 4: Table sort ─────────────────────────────────

	const sortUl = key => `ul[data-ln-persist="${key}"]`;
	const sortKey = name => page.evaluate(n => {
		const path = location.pathname.replace(/\/+$/, '').toLowerCase() || '/';
		return 'ln:' + n + ':' + path + ':data-ln-sort-state';
	}, name);
	const clickSort = (key, dir) => click(`${sortUl(key)} button[data-ln-sort-dir="${dir}"]`);
	const colTexts = col => page.evaluate(c => Array.from(document.querySelectorAll('#persist-table tbody tr'))
		.map(tr => tr.cells[c].textContent.trim()), col);

	async function expectSortState(key, state) {
		await waitAttr(sortUl(key), 'data-ln-sort-state', state);
		assert(await attr(sortUl(key), 'data-ln-sort-state') === state, `${key} state is "${state}"`);
	}

	async function expectColumn(col, expected, label) {
		await page.waitForFunction((c, exp) => {
			const texts = Array.from(document.querySelectorAll('#persist-table tbody tr')).map(tr => tr.cells[c].textContent.trim());
			return texts.length === exp.length && texts.every((t, i) => t === exp[i]);
		}, { timeout: 5000 }, col, expected).catch(() => {});
		const actual = await colTexts(col);
		assert(same(actual, expected), `${label}: expected [${expected.join(', ')}], got [${actual.join(', ')}]`);
	}

	await guarded('4a — Sort state persists (page-scoped keys)', async () => {
		await load();

		await clickSort('salary-sort', 'desc');
		await expectSortState('salary-sort', 'desc');
		const salaryKey = await sortKey('salary-sort');
		await waitStored(salaryKey, 'desc');
		assert(await ls(salaryKey) === 'desc', `Stored ${salaryKey} = "desc" (plain string)`);
		assert(await page.evaluate(() => document.querySelector('#persist-table thead th.numeric').getAttribute('aria-sort')) === 'descending',
			'Salary th aria-sort="descending"');

		await reload();
		await expectSortState('salary-sort', 'desc');

		await clickSort('department-sort', 'asc');
		await expectSortState('department-sort', 'asc');
		await expectSortState('salary-sort', 'none');
		const deptKey = await sortKey('department-sort');
		await waitStored(deptKey, 'asc');
		await waitStored(salaryKey, 'none');
		assert(await ls(deptKey) === 'asc', `Stored ${deptKey} = "asc"`);
		// The page prose says sorting another column "clears" the previous key; the source
		// (mutual exclusion sets state="none", ln-persist stores any non-null attribute value) stores "none".
		assert(await ls(salaryKey) === 'none', `Previous column key ${salaryKey} is stored as "none" (not removed)`);

		await reload();
		await expectSortState('department-sort', 'asc');
		await expectSortState('salary-sort', 'none');

		await clickSort('department-sort', 'none');
		await expectSortState('department-sort', 'none');
		await waitStored(deptKey, 'none');
		await reload();
		await expectSortState('department-sort', 'none');
	});

	await guarded('4b — Sorting reorders the table rows', async () => {
		await load();
		await expectColumn(0, NAMES_ORIGINAL, 'Initial row order');

		await clickSort('salary-sort', 'desc');
		await expectColumn(0, NAMES_SALARY_DESC, 'Salary desc');
		await reload();
		await expectColumn(0, NAMES_SALARY_DESC, 'Salary desc restored after reload');

		await clickSort('department-sort', 'asc');
		await expectColumn(1, DEPTS_ASC, 'Department asc');
		await reload();
		await expectColumn(1, DEPTS_ASC, 'Department asc restored after reload');

		await clickSort('department-sort', 'none');
		await expectColumn(0, NAMES_ORIGINAL, 'Original order restored by "none"');
	});

	// ─── Section 5: Filter ─────────────────────────────────────

	const FILTER_KEY = 'ln:persist-filter:data-ln-filter-values';
	const checkbox = v => v === null
		? '#persist-filter input[data-ln-filter-reset]'
		: `#persist-filter input[data-ln-filter-value="${v}"]`;

	const filterView = () => page.evaluate(() => ({
		checked: Array.from(document.querySelectorAll('#persist-filter input[data-ln-filter-key]'))
			.filter(i => i.checked)
			.map(i => i.getAttribute('data-ln-filter-value') || 'ALL'),
		visible: Array.from(document.querySelectorAll('#persist-items > li'))
			.filter(li => getComputedStyle(li).display !== 'none')
			.map(li => li.textContent.trim().split(' — ')[0]),
		values: document.getElementById('persist-filter').getAttribute('data-ln-filter-values')
	}));

	async function expectFilter(checked, visibleNames, label) {
		await page.waitForFunction(count => Array.from(document.querySelectorAll('#persist-items > li'))
			.filter(li => getComputedStyle(li).display !== 'none').length === count,
		{ timeout: 5000 }, visibleNames.length).catch(() => {});
		const v = await filterView();
		assert(same(v.checked, checked) && same(v.visible, visibleNames),
			`${label}: checked=[${v.checked}] visible=[${v.visible}]`);
	}

	const ACTIVE = ['Alice Johnson', 'Carol White', 'Frank Okafor'];
	const ACTIVE_PENDING = ['Alice Johnson', 'Bob Martinez', 'Carol White', 'Eva Novak', 'Frank Okafor'];
	const ALL = ['Alice Johnson', 'Bob Martinez', 'Carol White', 'David Lee', 'Eva Novak', 'Frank Okafor', 'Grace Park'];

	await guarded('5 — Filter persistence', async () => {
		await load();
		await expectFilter(['ALL'], ALL, 'Initial: All checked, 7 items visible');

		await click(checkbox('active'));
		await expectFilter(['active'], ACTIVE, 'Active only');
		await waitStored(FILTER_KEY, 'active');
		assert(await ls(FILTER_KEY) === 'active', 'Stored ln:persist-filter:data-ln-filter-values = "active"');

		await click(checkbox('pending'));
		await expectFilter(['active', 'pending'], ACTIVE_PENDING, 'Active + Pending');
		await waitStored(FILTER_KEY, 'active,pending');
		assert(await ls(FILTER_KEY) === 'active,pending', 'Stored value = "active,pending"');

		await reload();
		await expectFilter(['active', 'pending'], ACTIVE_PENDING, 'Restored after reload (list filtered, boxes checked)');
		assert((await filterView()).values === 'active,pending', 'data-ln-filter-values restored as "active,pending"');

		await click(checkbox(null));
		await expectFilter(['ALL'], ALL, 'All resets the filter');
		await waitStored(FILTER_KEY, null);
		assert(await ls(FILTER_KEY) === null, 'Stored key removed once filter is reset');
		await reload();
		await expectFilter(['ALL'], ALL, 'Reset state persists across reload');
	});

	// ─── Section 6: Debug tools ────────────────────────────────

	await guarded('6 — Debug tools (show / clear localStorage)', async () => {
		await load();
		const OUT = '#persist-debug-output';
		const out = () => page.evaluate(s => document.querySelector(s).textContent, OUT);

		// ln-sort/ln-tabs write their initial state on boot, so empty the storage first.
		await page.evaluate(() => localStorage.clear());
		await click('#show-persist-keys-btn');
		assert((await out()).startsWith('(no ln:* keys yet'), 'Show with empty storage reports "(no ln:* keys yet ..."');

		await click('[data-ln-toggle-for="persist-toggle-a"]');
		await waitStored(toggleKey('persist-toggle-a'), 'open');
		await click(checkbox('archived'));
		await waitStored(FILTER_KEY, 'archived');

		await click('#show-persist-keys-btn');
		const shown = await out();
		assert(shown.includes('ln:persist-toggle-a:data-ln-toggle: open'), 'Show lists "ln:persist-toggle-a:data-ln-toggle: open"');
		assert(shown.includes('ln:persist-filter:data-ln-filter-values: archived'), 'Show lists the filter key and value');

		const before = (await lsKeys()).length;
		await click('#clear-persist-keys-btn');
		const cleared = await out();
		assert(cleared.startsWith(`Cleared ${before} keys.`), `Clear reports "Cleared ${before} keys." (got "${cleared}")`);
		assert((await lsKeys()).length === 0, 'No ln:* keys remain after clear');

		await reload();
		await expectToggle('persist-toggle-a', 'close');
		await expectFilter(['ALL'], ALL, 'Demos reset after clear + reload');
	});

	if (failures.length > 0) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
