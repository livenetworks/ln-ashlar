import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/picklist.html (live demo, #countries)
// and the components it mounts (ln-picklist, ln-search).

const PAGE_URL = BASE_URL + 'picklist.html';
const TOTAL = 21;
const INITIAL_SELECTED = ['nl'];
const INITIAL_AVAILABLE_COUNT = 20;

const POOL_INPUT = 'input[data-ln-search-for="pool"]';
const PICKED_INPUT = 'input[data-ln-search-for="picked"]';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/picklist.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs one section; a failure is recorded so the remaining sections still run.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const host = document.getElementById('countries');
			const pool = document.getElementById('pool');
			const picked = document.getElementById('picked');
			return !!(host && host.lnPicklist && pool && pool.lnSearch && picked && picked.lnSearch
				&& document.querySelector('input[data-ln-search-for="pool"]').lnSearchControl
				&& document.querySelector('input[data-ln-search-for="picked"]').lnSearchControl
				&& picked.children.length === 1);
		}, { timeout: 10000 });
	}

	// Values (checkbox value attr) of the items currently in a list, in DOM order.
	const listValues = id => page.evaluate(i => Array.from(document.querySelectorAll('#' + i + ' > li'))
		.map(li => li.querySelector('input[type="checkbox"]').value), id);

	const checkedState = value => page.evaluate(v =>
		document.querySelector('#countries input[value="' + v + '"]').checked, value);

	const toggle = value => page.evaluate(v =>
		document.querySelector('#countries input[value="' + v + '"]').click(), value);

	async function expectLists(poolCount, pickedValues, label) {
		await page.waitForFunction((n, exp) => {
			const pool = document.querySelectorAll('#pool > li').length;
			const picked = Array.from(document.querySelectorAll('#picked > li'))
				.map(li => li.querySelector('input').value);
			return pool === n && picked.length === exp.length && picked.every((v, i) => v === exp[i]);
		}, { timeout: 5000 }, poolCount, pickedValues).catch(() => {});
		const pool = await listValues('pool');
		const picked = await listValues('picked');
		assert(pool.length === poolCount, `${label}: pool has ${poolCount} items (got ${pool.length})`);
		assert(same(picked, pickedValues), `${label}: selected = [${pickedValues.join(',')}] (got [${picked.join(',')}])`);
		assert(pool.length + picked.length === TOTAL, `${label}: total stays ${TOTAL}`);
	}

	// Items whose data-ln-search-hide is set, and whether CSS actually hides them.
	const hiddenIn = id => page.evaluate(i => Array.from(document.querySelectorAll('#' + i + ' > li'))
		.filter(li => li.getAttribute('data-ln-search-hide') === 'true')
		.map(li => ({
			value: li.querySelector('input').value,
			display: getComputedStyle(li).display
		})), id);

	const visibleIn = id => page.evaluate(i => Array.from(document.querySelectorAll('#' + i + ' > li'))
		.filter(li => getComputedStyle(li).display !== 'none')
		.map(li => li.querySelector('input').value), id);

	// Installs recording listeners on #countries; read back with events().
	const recordEvents = () => page.evaluate(() => {
		window.__events = [];
		const host = document.getElementById('countries');
		for (const name of ['ln-picklist:before-move', 'ln-picklist:move']) {
			host.addEventListener(name, e => {
				window.__events.push({
					name,
					value: e.detail.checkbox.value,
					from: e.detail.from.id,
					to: e.detail.to.id,
					item: e.detail.item === e.detail.checkbox.closest('li')
				});
			});
		}
	});
	const events = () => page.evaluate(() => window.__events);

	// ─── Sections ──────────────────────────────────────────────

	await guarded('Initial state', async () => {
		await load();
		await expectLists(INITIAL_AVAILABLE_COUNT, INITIAL_SELECTED, 'initial');
		assert(await checkedState('nl'), 'Netherlands (authored checked) is checked');
		const checkedInPool = await page.evaluate(() =>
			document.querySelectorAll('#pool input:checked').length);
		assert(checkedInPool === 0, 'no checked checkbox remains in the available list');
		const out = await page.evaluate(() => document.getElementById('picklist-output').textContent);
		assert(out === '(submit to see the body)', 'output placeholder shown before submit');
	});

	await guarded('Check moves item to selected, uncheck returns it', async () => {
		await load();
		await recordEvents();
		await toggle('be');
		await expectLists(19, ['nl', 'be'], 'after checking Belgium');
		assert(await checkedState('be'), 'Belgium checkbox is checked');
		await toggle('be');
		await expectLists(20, ['nl'], 'after unchecking Belgium');
		assert(!(await checkedState('be')), 'Belgium checkbox is unchecked');
		const poolVals = await listValues('pool');
		assert(poolVals.includes('be'), 'Belgium is back in the available list');
	});

	await guarded('Move events (before-move + move share one record)', async () => {
		await load();
		await recordEvents();
		await toggle('ca');
		const ev = await events();
		assert(ev.length === 2, `two events fired for one move (got ${ev.length})`);
		assert(ev[0].name === 'ln-picklist:before-move' && ev[1].name === 'ln-picklist:move',
			'order is before-move then move');
		assert(ev.every(e => e.value === 'ca' && e.from === 'pool' && e.to === 'picked' && e.item),
			'detail: checkbox=ca, from=pool, to=picked, item=its <li>');
		await toggle('ca');
		const ev2 = await events();
		assert(ev2.length === 4 && ev2[3].from === 'picked' && ev2[3].to === 'pool',
			'uncheck reports from=picked, to=pool');
	});

	await guarded('before-move is cancelable', async () => {
		await load();
		await page.evaluate(() => {
			window.__cancel = e => e.preventDefault();
			window.__moves = 0;
			const host = document.getElementById('countries');
			host.addEventListener('ln-picklist:before-move', window.__cancel);
			host.addEventListener('ln-picklist:move', () => { window.__moves++; });
		});
		await toggle('fr');
		await expectLists(20, ['nl'], 'cancelled move');
		assert(!(await checkedState('fr')), 'cancelled move reverts the checkbox');
		const moves = await page.evaluate(() => window.__moves);
		assert(moves === 0, 'no ln-picklist:move fired for a cancelled move');
		await page.evaluate(() => document.getElementById('countries')
			.removeEventListener('ln-picklist:before-move', window.__cancel));
		await toggle('fr');
		await expectLists(19, ['nl', 'fr'], 'move after un-cancelling');
	});

	await guarded('Selected order follows move order; unchecking selected-default item', async () => {
		await load();
		await toggle('jp');
		await toggle('ar');
		await expectLists(18, ['nl', 'jp', 'ar'], 'jp then ar');
		await toggle('nl');
		await expectLists(19, ['jp', 'ar'], 'Netherlands unchecked');
	});

	await guarded('Keyboard toggle keeps focus on the moved checkbox', async () => {
		await load();
		await page.focus('#pool input[value="de"]');
		await page.keyboard.press('Space');
		await expectLists(19, ['nl', 'de'], 'Space on Germany');
		const focused = await page.evaluate(() =>
			document.activeElement && document.activeElement.value);
		assert(focused === 'de', `focus restored to moved checkbox (got ${focused})`);
	});

	await guarded('Search on the available list', async () => {
		await load();
		await page.focus(POOL_INPUT);
		await page.keyboard.type('bel');
		await page.waitForFunction(() => document.getElementById('pool').getAttribute('data-ln-search') === 'bel');
		await page.waitForFunction(() =>
			document.querySelectorAll('#pool > li[data-ln-search-hide="true"]').length === 19);
		const visible = await visibleIn('pool');
		assert(same(visible, ['be']), `only Belgium visible (got [${visible.join(',')}])`);
		const hidden = await hiddenIn('pool');
		assert(hidden.length === 19 && hidden.every(h => h.display === 'none'),
			'19 non-matching items hidden by CSS (display:none)');
		const pickedVisible = await visibleIn('picked');
		assert(same(pickedVisible, ['nl']), 'selected list is not affected by the pool search');
	});

	await guarded('Search on the selected list, independent of the pool', async () => {
		await load();
		await toggle('be');
		await toggle('ca');
		await expectLists(18, ['nl', 'be', 'ca'], 'three selected');
		await page.focus(PICKED_INPUT);
		await page.keyboard.type('neth');
		await page.waitForFunction(() =>
			document.querySelectorAll('#picked > li[data-ln-search-hide="true"]').length === 2);
		const visible = await visibleIn('picked');
		assert(same(visible, ['nl']), `only Netherlands visible in selected (got [${visible.join(',')}])`);
		const poolVisible = await visibleIn('pool');
		assert(poolVisible.length === 18, 'pool list untouched by selected-list search');
	});

	await guarded('Clear button resets the search', async () => {
		await load();
		await page.focus(POOL_INPUT);
		await page.keyboard.type('bel');
		await page.waitForFunction(() =>
			document.querySelectorAll('#pool > li[data-ln-search-hide="true"]').length === 19);
		await page.evaluate(() => {
			document.querySelector('input[data-ln-search-for="pool"]')
				.closest('search').querySelector('button[data-ln-search-clear]').click();
		});
		await page.waitForFunction(() =>
			document.querySelectorAll('#pool > li[data-ln-search-hide]').length === 0);
		const state = await page.evaluate(() => ({
			input: document.querySelector('input[data-ln-search-for="pool"]').value,
			attr: document.getElementById('pool').getAttribute('data-ln-search')
		}));
		assert(state.input === '' && state.attr === '', 'input and data-ln-search are empty');
		const visible = await visibleIn('pool');
		assert(visible.length === INITIAL_AVAILABLE_COUNT, 'all 20 pool items visible again');
	});

	await guarded('Submit serializes native form body', async () => {
		await load();
		await toggle('ar');
		await toggle('au');
		await expectLists(18, ['nl', 'ar', 'au'], 'three selected');
		await page.evaluate(() => document.querySelector('#picklist-form button[type="submit"]').click());
		await page.waitForFunction(() =>
			document.getElementById('picklist-output').textContent !== '(submit to see the body)');
		const out = await page.evaluate(() => document.getElementById('picklist-output').textContent);
		const expected = 'countries%5B%5D=nl&countries%5B%5D=ar&countries%5B%5D=au';
		assert(out === expected, `body "${expected}" (got "${out}")`);
	});

	await guarded('Submit with nothing selected', async () => {
		await load();
		await toggle('nl');
		await expectLists(21, [], 'nothing selected');
		await page.evaluate(() => document.querySelector('#picklist-form button[type="submit"]').click());
		await page.waitForFunction(() =>
			document.getElementById('picklist-output').textContent === '(nothing selected)');
		assert(true, 'output is "(nothing selected)"');
	});

	await guarded('Reset restores authored state', async () => {
		await load();
		await toggle('ar');
		await toggle('nl');
		await expectLists(20, ['ar'], 'modified');
		await page.evaluate(() => document.querySelector('#picklist-form button[type="reset"]').click());
		await expectLists(INITIAL_AVAILABLE_COUNT, INITIAL_SELECTED, 'after reset');
		assert(await checkedState('nl') && !(await checkedState('ar')), 'checkbox states restored to defaults');
		const poolOrder = await listValues('pool');
		assert(poolOrder[0] === 'ar' && poolOrder[poolOrder.length - 1] === 'jp',
			'pool restored to authored order (ar first, jp last)');
	});

	await guarded('Disabled state reverts clicks (data-ln-picklist="disabled")', async () => {
		await load();
		await page.evaluate(() => document.getElementById('countries').setAttribute('data-ln-picklist', 'disabled'));
		await page.waitForFunction(() => document.getElementById('countries').lnPicklist.isEnabled === false);
		await toggle('be');
		await expectLists(INITIAL_AVAILABLE_COUNT, INITIAL_SELECTED, 'disabled click');
		assert(!(await checkedState('be')), 'checkbox reverted while disabled');
		await page.evaluate(() => document.getElementById('countries').setAttribute('data-ln-picklist', 'enabled'));
		await page.waitForFunction(() => document.getElementById('countries').lnPicklist.isEnabled === true);
		await toggle('be');
		await expectLists(19, ['nl', 'be'], 'after re-enable');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		for (const f of failures) console.error('  - ' + f);
		throw new Error(`${failures.length} section(s) failed`);
	}
});
