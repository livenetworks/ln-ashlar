import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/density.html (inline page script +
// markup) and demo/admin/src/shell.html (density picker buttons, density bootstrap).
// The page mounts no ln-* components; the behavior is the data-density attribute
// driven by two checkboxes and the shell's [data-demo-density] buttons.

const PAGE_URL = BASE_URL + 'density.html';
const KEY = 'ln-demo-density';
const GLOBAL_CB = '[data-demo-density-global]';
const SCOPED_CB = '[data-demo-density-scoped]';
const SCOPED_TARGET = '#density-scoped-target';
const TABLE_ROWS = 6;

run('demo/admin/density.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Fresh, state-free page: stored density would otherwise survive between loads.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(
			() => document.documentElement.hasAttribute('data-density')
				&& document.querySelector('[data-demo-density-global]'),
			{ timeout: 10000 }
		);
	}

	const rootDensity = () => page.evaluate(() => document.documentElement.getAttribute('data-density'));
	const scopedDensity = () => page.evaluate(sel => document.querySelector(sel).getAttribute('data-density'), SCOPED_TARGET);
	const checked = sel => page.evaluate(s => document.querySelector(s).checked, sel);
	const stored = () => page.evaluate(k => localStorage.getItem(k), KEY);
	const current = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-demo-density]'))
		.filter(b => b.getAttribute('aria-current') === 'true')
		.map(b => b.getAttribute('data-demo-density')));
	const pad = sel => page.evaluate(s => getComputedStyle(document.querySelector(s)).paddingTop, sel);
	const px = v => parseFloat(v);
	// Height of the first body row of the demo table (the one with a "Document" header).
	const rowH = () => page.evaluate(() => {
		const table = Array.from(document.querySelectorAll('table'))
			.find(t => t.querySelector('thead th') && t.querySelector('thead th').textContent.trim() === 'Document');
		return table.querySelector('tbody tr').getBoundingClientRect().height;
	});

	// Native click on the checkbox's label text path: toggles and fires 'change'.
	const toggle = sel => page.evaluate(s => document.querySelector(s).click(), sel);
	// Shell buttons live inside a closed popover; dispatch the click directly.
	const pick = value => page.evaluate(v => document.querySelector(`[data-demo-density="${v}"]`).click(), value);

	// ─── Structure ─────────────────────────────────────────────
	section('Structure');
	await load();
	assert(await page.evaluate(() => document.querySelectorAll('h1').length >= 1), 'page has an h1');
	assert(await page.evaluate(() => !!document.querySelector('#density-scoped-target form input#density-name')), 'scoped form section contains the form inputs');
	assert(await page.evaluate(n => document.querySelectorAll('table tbody tr').length === n, TABLE_ROWS), `demo table has ${TABLE_ROWS} body rows`);
	assert(await page.evaluate(() => !!document.querySelector('[data-ln-stat-card]')), 'stat card is present');
	assert(await page.evaluate(() => document.querySelectorAll('[data-demo-density]').length === 3), 'shell has 3 density buttons');

	// ─── Initial state ─────────────────────────────────────────
	section('Initial state (no stored preference)');
	assert(await rootDensity() === 'comfortable', 'html defaults to data-density="comfortable"');
	assert(await checked(GLOBAL_CB) === false, 'global checkbox unchecked');
	assert(await checked(SCOPED_CB) === false, 'scoped checkbox unchecked');
	assert(await scopedDensity() === null, 'scoped target has no data-density');
	assert(await stored() === null, 'nothing written to localStorage on load');
	assert((await current()).join() === 'comfortable', 'only the Comfortable button is aria-current');

	// ─── Global toggle ─────────────────────────────────────────
	section('Global compact toggle');
	const comfInputPad = px(await pad('#density-name'));
	const comfRowH = await rowH();
	const comfButtonPad = px(await pad('button[type="submit"]'));

	await toggle(GLOBAL_CB);
	await page.waitForFunction(() => document.documentElement.getAttribute('data-density') === 'compact', { timeout: 5000 });
	assert(await rootDensity() === 'compact', 'checking global sets html data-density="compact"');
	assert(await stored() === 'compact', 'localStorage ln-demo-density = compact');
	await page.waitForFunction(() => {
		const b = document.querySelector('[data-demo-density="compact"]');
		return b && b.getAttribute('aria-current') === 'true';
	}, { timeout: 5000 });
	assert((await current()).join() === 'compact', 'Compact button becomes the only aria-current');
	assert(await checked(GLOBAL_CB) === true, 'global checkbox stays checked');
	assert(px(await pad('#density-name')) < comfInputPad, 'input padding-top shrinks in compact');
	assert(await rowH() < comfRowH, 'demo table row height shrinks in compact (--density-row-h)');
	assert(px(await pad('button[type="submit"]')) === comfButtonPad, 'button padding-top unchanged in compact (buttons do not react)');

	await toggle(GLOBAL_CB);
	await page.waitForFunction(() => document.documentElement.getAttribute('data-density') === 'comfortable', { timeout: 5000 });
	assert(await rootDensity() === 'comfortable', 'unchecking global returns html to comfortable');
	assert(await stored() === 'comfortable', 'localStorage ln-demo-density = comfortable');
	assert(px(await pad('#density-name')) === comfInputPad, 'input padding restored');

	// ─── Persistence ───────────────────────────────────────────
	section('Persistence across reload');
	await toggle(GLOBAL_CB);
	await page.waitForFunction(k => localStorage.getItem(k) === 'compact', { timeout: 5000 }, KEY);
	await page.reload({ waitUntil: 'load' });
	await page.waitForFunction(() => document.documentElement.hasAttribute('data-density'), { timeout: 10000 });
	assert(await rootDensity() === 'compact', 'stored compact is restored after reload');
	assert(await checked(GLOBAL_CB) === true, 'global checkbox reflects restored compact');

	// ─── Scoped toggle ─────────────────────────────────────────
	section('Scoped compact toggle');
	await load();
	const scopedBefore = px(await pad('#density-name'));
	await toggle(SCOPED_CB);
	await page.waitForFunction(sel => document.querySelector(sel).getAttribute('data-density') === 'compact', { timeout: 5000 }, SCOPED_TARGET);
	assert(await scopedDensity() === 'compact', 'checking scoped sets data-density="compact" on the form section');
	assert(await rootDensity() === 'comfortable', 'html stays comfortable (scope is local)');
	assert(await stored() === null, 'scoped toggle does not write localStorage');
	assert(px(await pad('#density-name')) < scopedBefore, 'form input padding shrinks inside the scoped section');
	assert(await rowH() === comfRowH, 'table outside the scope keeps its row height');

	await toggle(SCOPED_CB);
	await page.waitForFunction(sel => !document.querySelector(sel).hasAttribute('data-density'), { timeout: 5000 }, SCOPED_TARGET);
	assert(await scopedDensity() === null, 'unchecking scoped removes the attribute');
	assert(px(await pad('#density-name')) === scopedBefore, 'form input padding restored');

	// ─── Shell density buttons ─────────────────────────────────
	section('Shell density buttons');
	await load();
	for (const value of ['spacious', 'compact', 'comfortable']) {
		await pick(value);
		await page.waitForFunction(v => document.documentElement.getAttribute('data-density') === v, { timeout: 5000 }, value);
		assert(await rootDensity() === value, `picking ${value} sets html data-density`);
		assert(await stored() === value, `picking ${value} stores it`);
		assert((await current()).join() === value, `${value} button is the only aria-current`);
		await page.waitForFunction((v, expectChecked) => document.querySelector('[data-demo-density-global]').checked === expectChecked,
			{ timeout: 5000 }, value, value === 'compact');
		assert(await checked(GLOBAL_CB) === (value === 'compact'), `global checkbox ${value === 'compact' ? 'checked' : 'unchecked'} for ${value}`);
	}
});
