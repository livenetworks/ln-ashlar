import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/filter.html (live demos) and the
// components it mounts: ln-filter (components/ln-filter/src), ln-search (components/ln-search/src).

const PAGE_URL = BASE_URL + 'filter.html';
const FILTER_ROOTS = 8; // basic, cards, combo, api, table-1, table-2 (x2), table-3

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

const ROOT = {
	basic: '[data-ln-filter="filter-basic-list"]',
	cards: '[data-ln-filter="filter-cards-list"]',
	combo: '[data-ln-filter="combo-list"]',
	api: '#api-filter-nav',
	t1: '[data-ln-filter="demo-table-1"]',
	t2dept: '[data-ln-filter="demo-table-2"][data-ln-filter-col="2"]',
	t2status: '[data-ln-filter="demo-table-2"][data-ln-filter-col="3"]',
	t3: '#filter-dept-list-3'
};

const ALL_BASIC = ['Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Sara Dimitrova', 'Elena Ristova', 'Toni Angelov', 'Boris Ilievski'];
const ALL_CARDS = ['Project Alpha', 'Project Beta', 'Project Gamma', 'Project Delta', 'Project Epsilon', 'Project Zeta'];
const ALL_COMBO = ['Maja Kostadinova', 'Petar Blazevski', 'Kristina Gjorgjevska', 'Aleksandar Naumov', 'Vesna Todorova', 'Darko Mitevski', 'Lidija Petrovska'];
const ALL_API = ['Task A', 'Task B', 'Task C', 'Task D', 'Task E'];
const ALL_T12 = ['Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Sara Dimitrova', 'Elena Ristova', 'Toni Angelov', 'Boris Ilievski'];
const ALL_T3 = ['Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Sara Dimitrova', 'Elena Ristova', 'Toni Angelov', 'Boris Ilievski', 'Kristina Gjorgjevska', 'Darko Mitevski', 'Maja Kostadinova'];
const ALL_T3_OPTIONS = ['All', 'Engineering', 'Design', 'Marketing', 'Finance', 'HR', 'QA'];

run('demo/admin/filter.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs one showcased feature; records the failure and continues so one finding
	// does not hide the others. Rethrows at the end of the test.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction((count) => {
			const roots = document.querySelectorAll('[data-ln-filter]');
			if (roots.length !== count || !Array.from(roots).every(el => el.lnFilter)) return false;
			const combo = document.getElementById('combo-list');
			const dept = document.getElementById('filter-dept-list-3');
			if (!combo || !combo.lnSearch || !dept || !dept.lnSearch) return false;
			const inputs = document.querySelectorAll('input[data-ln-search-for="combo-list"], input[data-ln-search-for="filter-dept-list-3"]');
			return inputs.length === 2 && Array.from(inputs).every(el => el.lnSearchControl);
		}, { timeout: 10000 }, FILTER_ROOTS);
	}

	// Visible item names (display !== none) of a list (children) or table (tbody rows).
	// Defined in the page so waitForFunction can reuse it.
	async function defineHelpers() {
		await page.evaluate(() => {
			window.__names = function (id) {
				const el = document.getElementById(id);
				const items = el.tagName === 'TABLE'
					? Array.from(el.tBodies[0].rows)
					: Array.from(el.children);
				return items
					.filter(item => getComputedStyle(item).display !== 'none')
					.map(item => el.tagName === 'TABLE'
						? item.cells[1].textContent.trim()
						: (item.querySelector('strong') || item).textContent.split(' — ')[0].trim());
			};
		});
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await ready();
		await defineHelpers();
	}

	const names = id => page.evaluate(i => window.__names(i), id);

	async function expectNames(id, expected, label) {
		await page.waitForFunction((i, exp) => {
			const got = window.__names(i);
			return got.length === exp.length && got.every((v, k) => v === exp[k]);
		}, { timeout: 5000 }, id, expected).catch(() => {});
		const actual = await names(id);
		assert(same(actual, expected), `${label}: expected [${expected.join(', ')}], got [${actual.join(', ')}]`);
	}

	// value === null clicks the reset ("All") checkbox of that filter root.
	const clickOption = (root, value) => page.evaluate((r, v) => {
		const el = document.querySelector(r);
		const input = v === null
			? el.querySelector('[data-ln-filter-reset]')
			: el.querySelector('[data-ln-filter-value="' + v + '"]');
		input.click();
	}, root, value);

	// Checked state of a root: array of values, '*' = reset checkbox.
	const checkedOf = root => page.evaluate(r => Array.from(document.querySelector(r).querySelectorAll('[data-ln-filter-key]'))
		.filter(i => i.checked)
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), root);

	async function expectChecked(root, expected, label) {
		await page.waitForFunction((r, exp) => {
			const got = Array.from(document.querySelector(r).querySelectorAll('[data-ln-filter-key]'))
				.filter(i => i.checked)
				.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value'));
			return got.length === exp.length && got.every((v, k) => v === exp[k]);
		}, { timeout: 5000 }, root, expected).catch(() => {});
		const actual = await checkedOf(root);
		assert(same(actual, expected), `${label}: checked [${expected.join(', ')}], got [${actual.join(', ')}]`);
	}

	const valuesAttr = root => page.evaluate(r => document.querySelector(r).getAttribute('data-ln-filter-values'), root);

	// ─── Run ───────────────────────────────────────────────────

	await load();

	await check('Initial state: every demo shows all items, "All" checked', async () => {
		assert((await names('filter-basic-list')).length === 7, 'basic list: 7 items in DOM');
		await expectNames('filter-basic-list', ALL_BASIC, 'basic list initial');
		await expectNames('filter-cards-list', ALL_CARDS, 'cards list initial');
		await expectNames('combo-list', ALL_COMBO, 'combo list initial');
		await expectNames('api-filter-list', ALL_API, 'api list initial');
		await expectNames('demo-table-1', ALL_T12, 'table-1 initial');
		await expectNames('demo-table-2', ALL_T12, 'table-2 initial');
		await expectNames('demo-table-3', ALL_T3, 'table-3 initial');
		for (const key of Object.keys(ROOT)) {
			await expectChecked(ROOT[key], ['*'], `${key} initial checked`);
		}
		assert(await valuesAttr(ROOT.basic) === null, 'basic: no data-ln-filter-values while reset');
	});

	await check('Basic filter: attribute mode, OR within a key, reset sentinel sync', async () => {
		await clickOption(ROOT.basic, 'design');
		await expectNames('filter-basic-list', ['Ana Petrova', 'Elena Ristova'], 'design');
		await expectChecked(ROOT.basic, ['design'], 'design click unchecks reset');
		assert(await valuesAttr(ROOT.basic) === 'design', 'data-ln-filter-values = "design"');
		const hidden = await page.evaluate(() => Array.from(document.getElementById('filter-basic-list').children)
			.filter(li => li.getAttribute('data-ln-filter-hide') === 'true').length);
		assert(hidden === 5, 'non-matching items carry data-ln-filter-hide="true" (5 of 7)');

		await clickOption(ROOT.basic, 'dev');
		await expectNames('filter-basic-list', ['Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Elena Ristova', 'Boris Ilievski'], 'design + dev (OR)');
		assert(await valuesAttr(ROOT.basic) === 'design,dev', 'data-ln-filter-values = "design,dev"');

		await clickOption(ROOT.basic, 'design');
		await expectNames('filter-basic-list', ['Marko Nikolov', 'Ivan Stojanovski', 'Boris Ilievski'], 'dev only after unchecking design');

		await clickOption(ROOT.basic, 'dev');
		await expectChecked(ROOT.basic, ['*'], 'unchecking the last value re-checks reset');
		await expectNames('filter-basic-list', ALL_BASIC, 'all items back after last value unchecked');
		assert(await valuesAttr(ROOT.basic) === null, 'data-ln-filter-values removed on reset');

		await clickOption(ROOT.basic, 'qa');
		await expectNames('filter-basic-list', ['Sara Dimitrova', 'Toni Angelov'], 'qa');
		await clickOption(ROOT.basic, null);
		await expectChecked(ROOT.basic, ['*'], 'clicking All unchecks every value');
		await expectNames('filter-basic-list', ALL_BASIC, 'All restores every item');

		await clickOption(ROOT.basic, 'design');
		await clickOption(ROOT.basic, 'dev');
		await clickOption(ROOT.basic, 'qa');
		await expectChecked(ROOT.basic, ['*'], 'checking every value collapses back to reset');
		await expectNames('filter-basic-list', ALL_BASIC, 'all values checked shows every item');
	});

	await check('Filter with cards: status key, multi-value', async () => {
		await clickOption(ROOT.cards, 'active');
		await expectNames('filter-cards-list', ['Project Alpha', 'Project Delta', 'Project Zeta'], 'active');
		await clickOption(ROOT.cards, 'pending');
		await expectNames('filter-cards-list', ['Project Alpha', 'Project Beta', 'Project Delta', 'Project Epsilon', 'Project Zeta'], 'active + pending');
		await clickOption(ROOT.cards, 'active');
		await clickOption(ROOT.cards, 'pending');
		await clickOption(ROOT.cards, 'inactive');
		await expectNames('filter-cards-list', ['Project Gamma'], 'inactive');
		await clickOption(ROOT.cards, null);
		await expectNames('filter-cards-list', ALL_CARDS, 'cards reset');
	});

	await check('Events: ln-filter:change / ln-filter:reset detail and bubbling', async () => {
		await page.evaluate(() => {
			window.__events = [];
			['ln-filter:change', 'ln-filter:reset'].forEach(name => {
				document.addEventListener(name, e => {
					window.__events.push({
						name,
						targetId: e.target.id || null,
						isNav: e.target.hasAttribute('data-ln-filter'),
						cancelable: e.cancelable,
						detail: JSON.parse(JSON.stringify(e.detail))
					});
				});
			});
		});

		await clickOption(ROOT.basic, 'design');
		await page.waitForFunction(() => window.__events.some(e => e.name === 'ln-filter:change'), { timeout: 5000 });
		let events = await page.evaluate(() => window.__events);
		const onNav = events.find(e => e.name === 'ln-filter:change' && e.isNav);
		const onList = events.find(e => e.name === 'ln-filter:change' && e.targetId === 'filter-basic-list');
		assert(!!onNav, 'ln-filter:change dispatched on the filter root and bubbles to document');
		assert(onNav.detail.key === 'category' && same(onNav.detail.values, ['design']) && onNav.detail.targetId === 'filter-basic-list',
			'change detail = { key: "category", values: ["design"], targetId: "filter-basic-list" }');
		assert(!!onList && onList.cancelable === true, 'ln-filter:change also dispatched on the target list, cancelable');
		assert(!events.some(e => e.name === 'ln-filter:reset'), 'no ln-filter:reset while filter is active');

		await page.evaluate(() => { window.__events.length = 0; });
		await clickOption(ROOT.basic, null);
		await page.waitForFunction(() => window.__events.some(e => e.name === 'ln-filter:reset'), { timeout: 5000 });
		events = await page.evaluate(() => window.__events);
		const reset = events.find(e => e.name === 'ln-filter:reset' && e.isNav);
		assert(!!reset && reset.detail.targetId === 'filter-basic-list' && Object.keys(reset.detail).length === 1,
			'ln-filter:reset detail = { targetId } on transition into reset');
		const change = events.find(e => e.name === 'ln-filter:change' && e.isNav);
		assert(!!change && change.detail.values.length === 0, 'reset also emits ln-filter:change with empty values');
	});

	await check('Cancelable change on the target: preventDefault stops hiding', async () => {
		await page.evaluate(() => {
			window.__cancelHandler = e => e.preventDefault();
			document.getElementById('filter-cards-list').addEventListener('ln-filter:change', window.__cancelHandler);
		});
		await clickOption(ROOT.cards, 'active');
		await page.waitForFunction(() => document.querySelector('[data-ln-filter="filter-cards-list"]').getAttribute('data-ln-filter-values') === 'active', { timeout: 5000 });
		await expectNames('filter-cards-list', ALL_CARDS, 'claimed (default-prevented) change leaves items visible');
		await page.evaluate(() => {
			document.getElementById('filter-cards-list').removeEventListener('ln-filter:change', window.__cancelHandler);
		});
		await clickOption(ROOT.cards, null);
		await clickOption(ROOT.cards, 'active');
		await expectNames('filter-cards-list', ['Project Alpha', 'Project Delta', 'Project Zeta'], 'filtering works again once unclaimed');
		await clickOption(ROOT.cards, null);
		await expectNames('filter-cards-list', ALL_CARDS, 'cards reset after cancel test');
	});

	await check('Filter + Search combination: independent, item visible only if neither hides it', async () => {
		const searchTerm = async (term) => {
			await page.focus('input[data-ln-search-for="combo-list"]');
			await page.keyboard.type(term);
		};

		await searchTerm('engineer');
		await expectNames('combo-list', ['Aleksandar Naumov', 'Lidija Petrovska'], 'search "engineer"');
		assert(await page.evaluate(() => document.getElementById('combo-list').getAttribute('data-ln-search')) === 'engineer',
			'typing writes the term to data-ln-search on the list');

		await clickOption(ROOT.combo, 'it');
		await expectNames('combo-list', ['Aleksandar Naumov', 'Lidija Petrovska'], 'IT + "engineer"');

		await clickOption(ROOT.combo, 'it');
		await clickOption(ROOT.combo, 'hr');
		await expectNames('combo-list', [], 'HR + "engineer" (no overlap)');

		await clickOption(ROOT.combo, null);
		await expectNames('combo-list', ['Aleksandar Naumov', 'Lidija Petrovska'], 'search alone after reset filter');

		await clickOption(ROOT.combo, 'finance');
		await expectNames('combo-list', [], 'Finance + "engineer"');

		await page.evaluate(() => {
			document.querySelector('input[data-ln-search-for="combo-list"]').closest('search').querySelector('button[data-ln-search-clear]').click();
		});
		await expectNames('combo-list', ['Kristina Gjorgjevska', 'Darko Mitevski'], 'clear search leaves the Finance filter active');
		assert(await page.evaluate(() => document.querySelector('input[data-ln-search-for="combo-list"]').value) === '', 'clear button empties the input');

		await clickOption(ROOT.combo, null);
		await expectNames('combo-list', ALL_COMBO, 'combo fully reset');
	});

	await check('Table column filter (hardcoded): data-ln-filter-col text match', async () => {
		await clickOption(ROOT.t1, 'Engineering');
		await expectNames('demo-table-1', ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski'], 'Engineering');
		await clickOption(ROOT.t1, 'Design');
		await expectNames('demo-table-1', ['Ana Petrova', 'Marko Nikolov', 'Ivan Stojanovski', 'Elena Ristova', 'Boris Ilievski'], 'Engineering + Design (OR)');
		await clickOption(ROOT.t1, 'Engineering');
		await clickOption(ROOT.t1, 'Design');
		await clickOption(ROOT.t1, 'Marketing');
		await expectNames('demo-table-1', ['Sara Dimitrova', 'Toni Angelov'], 'Marketing');
		const hiddenRows = await page.evaluate(() => Array.from(document.getElementById('demo-table-1').tBodies[0].rows)
			.filter(r => r.getAttribute('data-ln-filter-hide') === 'true').length);
		assert(hiddenRows === 5, 'non-matching rows carry data-ln-filter-hide="true" (5 of 7)');
		await clickOption(ROOT.t1, null);
		await expectNames('demo-table-1', ALL_T12, 'table-1 reset');
		await expectChecked(ROOT.t1, ['*'], 'table-1 reset checked');
	});

	await check('Multi-column table filter: OR within a column, AND across columns', async () => {
		await clickOption(ROOT.t2dept, 'Engineering');
		await expectNames('demo-table-2', ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski'], 'dept Engineering');

		await clickOption(ROOT.t2status, 'Active');
		await expectNames('demo-table-2', ['Ana Petrova', 'Boris Ilievski'], 'Engineering AND Active (exact match, not "Inactive")');

		await clickOption(ROOT.t2status, 'Active');
		await clickOption(ROOT.t2status, 'Inactive');
		await expectNames('demo-table-2', ['Ivan Stojanovski'], 'Engineering AND Inactive');

		await clickOption(ROOT.t2dept, 'Design');
		await expectNames('demo-table-2', ['Ivan Stojanovski'], '(Engineering OR Design) AND Inactive');

		await clickOption(ROOT.t2status, 'Inactive');
		await clickOption(ROOT.t2status, 'Pending');
		await expectNames('demo-table-2', ['Elena Ristova'], '(Engineering OR Design) AND Pending');

		await clickOption(ROOT.t2dept, null);
		await expectNames('demo-table-2', ['Elena Ristova'], 'status Pending alone after dept reset');

		await clickOption(ROOT.t2dept, 'Marketing');
		await expectNames('demo-table-2', [], 'Marketing AND Pending (no row)');

		await clickOption(ROOT.t2status, null);
		await expectNames('demo-table-2', ['Sara Dimitrova', 'Toni Angelov'], 'Marketing alone after status reset');

		await clickOption(ROOT.t2dept, null);
		await expectNames('demo-table-2', ALL_T12, 'table-2 fully reset');
	});

	await check('Column filter with searchable options: search narrows option list, not the table', async () => {
		const optionNames = () => page.evaluate(() => Array.from(document.querySelectorAll('#filter-dept-list-3 label'))
			.filter(l => getComputedStyle(l).display !== 'none')
			.map(l => l.textContent.trim()));
		const expectOptions = async (expected, label) => {
			await page.waitForFunction(exp => {
				const got = Array.from(document.querySelectorAll('#filter-dept-list-3 label'))
					.filter(l => getComputedStyle(l).display !== 'none')
					.map(l => l.textContent.trim());
				return got.length === exp.length && got.every((v, k) => v === exp[k]);
			}, { timeout: 5000 }, expected).catch(() => {});
			const actual = await optionNames();
			assert(same(actual, expected), `${label}: options [${expected.join(', ')}], got [${actual.join(', ')}]`);
		};

		await expectOptions(ALL_T3_OPTIONS, 'all options initially');

		await page.focus('input[data-ln-search-for="filter-dept-list-3"]');
		await page.keyboard.type('eng');
		await expectOptions(['Engineering'], 'search "eng"');
		await expectNames('demo-table-3', ALL_T3, 'searching options does not filter the table');

		await clickOption(ROOT.t3, 'Engineering');
		await expectNames('demo-table-3', ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski'], 'Engineering selected through the narrowed list');

		await page.evaluate(() => {
			document.querySelector('input[data-ln-search-for="filter-dept-list-3"]').closest('search').querySelector('button[data-ln-search-clear]').click();
		});
		await expectOptions(ALL_T3_OPTIONS, 'clear restores every option');
		await expectChecked(ROOT.t3, ['Engineering'], 'selection survives clearing the option search');
		await expectNames('demo-table-3', ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski'], 'table still filtered after option search cleared');

		await clickOption(ROOT.t3, 'Finance');
		await clickOption(ROOT.t3, 'HR');
		await expectNames('demo-table-3', ['Ana Petrova', 'Ivan Stojanovski', 'Boris Ilievski', 'Kristina Gjorgjevska', 'Darko Mitevski', 'Maja Kostadinova'], 'Engineering + Finance + HR');

		await clickOption(ROOT.t3, 'Engineering');
		await clickOption(ROOT.t3, 'Finance');
		await clickOption(ROOT.t3, 'HR');
		await clickOption(ROOT.t3, 'QA');
		await expectNames('demo-table-3', ['Toni Angelov'], 'QA');
		await clickOption(ROOT.t3, null);
		await expectNames('demo-table-3', ALL_T3, 'table-3 reset');
	});

	await check('Driving filter state from outside (setApiFilter buttons, hidden nav, status line)', async () => {
		const status = () => page.evaluate(() => document.getElementById('api-filter-status').textContent);
		const clickDemoButton = label => page.evaluate(l => {
			const btn = Array.from(document.querySelectorAll('#api-demo-actions button'))
				.find(b => b.textContent.trim() === l);
			btn.click();
		}, label);
		const expectStatus = async (expected, label) => {
			await page.waitForFunction(exp => document.getElementById('api-filter-status').textContent === exp, { timeout: 5000 }, expected).catch(() => {});
			const actual = await status();
			assert(actual === expected, `${label}: status "${expected}", got "${actual}"`);
		};

		assert(await status() === 'Active filter: none', 'status line starts at "Active filter: none"');
		assert(await page.evaluate(() => document.getElementById('api-filter-nav').hasAttribute('hidden')), 'api filter nav is hidden (driven from outside only)');

		await clickDemoButton('Filter: High');
		await expectNames('api-filter-list', ['Task A', 'Task D'], 'Filter: High');
		await expectStatus('Active filter: priority = high', 'Filter: High');

		await clickDemoButton('Filter: Medium');
		await expectNames('api-filter-list', ['Task B', 'Task E'], 'Filter: Medium');
		await expectStatus('Active filter: priority = medium', 'Filter: Medium');

		await clickDemoButton('Filter: High + Medium');
		await expectNames('api-filter-list', ['Task A', 'Task B', 'Task D', 'Task E'], 'Filter: High + Medium');
		await expectStatus('Active filter: priority = high, medium', 'Filter: High + Medium');

		await clickDemoButton('Filter: Low');
		await expectNames('api-filter-list', ['Task C'], 'Filter: Low');
		await expectStatus('Active filter: priority = low', 'Filter: Low');

		await clickDemoButton('Reset');
		await expectNames('api-filter-list', ALL_API, 'Reset');
		await expectStatus('Active filter: none', 'Reset');
	});

	if (failures.length > 0) {
		console.error(`\n${failures.length} feature check(s) failed:`);
		failures.forEach(f => console.error(`  - ${f}`));
		throw new Error(`${failures.length} feature check(s) failed`);
	}
});
