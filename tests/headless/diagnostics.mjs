import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/diagnostics.html and the dev
// stylesheet it loads (theme/ln-ashlar-dev.scss + components/ln-table|ln-modal|ln-tooltip
// /*-dev.scss, theme/config/mixins/_diagnostics.scss). The page's live demos are CSS
// diagnostics gated by <body data-ln-debug>; the only JS-driven part is the ln-sort
// control in demo 6 (#correct-demo-table).

const PAGE_URL = BASE_URL + 'diagnostics.html';

const MSG = {
	table: "[data-ln-table] is missing a required 'id' attribute for filter mapping.",
	modal: 'data-ln-modal-for is missing a target modal id',
	abbr: 'abbr is missing a title attribute',
	tooltip: 'data-ln-tooltip is empty and has no title fallback'
};

run('demo/admin/diagnostics.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const el = document.querySelector('#correct-demo-table ul[data-ln-sort]');
			return !!(el && el.lnSort);
		}, { timeout: 10000 });
	}

	// Computed generated-content string of a pseudo-element ('none' when absent).
	const pseudo = (selector, which) => page.evaluate((sel, w) => {
		const el = document.querySelector(sel);
		return el ? getComputedStyle(el, w).content : null;
	}, selector, which);

	const count = selector => page.evaluate(sel => document.querySelectorAll(sel).length, selector);

	const outline = selector => page.evaluate(sel => {
		const el = document.querySelector(sel);
		if (!el) return null;
		const cs = getComputedStyle(el);
		return { style: cs.outlineStyle, width: cs.outlineWidth };
	}, selector);

	await load();

	// ─── Setup ─────────────────────────────────────────────────
	section('Dev diagnostics are active');

	assert(await page.evaluate(() => document.body.hasAttribute('data-ln-debug')), '<body> carries data-ln-debug');
	assert(await page.evaluate(() => !!document.querySelector('link[href$="ln-ashlar-dev.css"]')), 'ln-ashlar-dev.css is linked');

	// ─── Demo 1: table wrapper without id ──────────────────────
	section('1. Missing table wrapper id');

	assert(await count('div[data-ln-table]:not([id])') === 1, 'exactly one [data-ln-table] without id');
	const tableBefore = await pseudo('div[data-ln-table]:not([id])', '::before');
	assert(tableBefore.includes(MSG.table), 'table wrapper shows the missing-id warning in ::before');
	const tableOutline = await outline('div[data-ln-table]:not([id])');
	assert(tableOutline.style === 'dashed' && tableOutline.width === '2px', 'table wrapper has the 2px dashed error outline');

	// ─── Demo 2: modal trigger with empty target ───────────────
	section('2. Modal trigger missing target');

	assert(await count('button[data-ln-modal-for=""]') === 1, 'exactly one empty data-ln-modal-for trigger');
	const modalAfter = await pseudo('button[data-ln-modal-for=""]', '::after');
	assert(modalAfter.includes(MSG.modal), 'modal trigger shows the missing-target warning in ::after');

	// ─── Demo 3: img without alt ───────────────────────────────
	section('3. Image missing alt');

	assert(await count('img:not([alt])') === 1, 'exactly one <img> without alt');
	const imgOutline = await outline('img:not([alt])');
	assert(imgOutline.style === 'dashed' && imgOutline.width === '2px', 'img without alt has the 2px dashed error outline');

	// ─── Demo 4: abbr without title ────────────────────────────
	section('4. Abbr missing title');

	assert(await count('abbr:not([title])') === 1, 'exactly one <abbr> without title');
	const abbrAfter = await pseudo('abbr:not([title])', '::after');
	assert(abbrAfter.includes(MSG.abbr), 'abbr shows the missing-title warning in ::after');

	// ─── Demo 5: empty tooltip ─────────────────────────────────
	section('5. Empty tooltip');

	assert(await count('button[data-ln-tooltip=""]:not([title])') === 1, 'exactly one empty tooltip without title');
	const tipAfter = await pseudo('button[data-ln-tooltip=""]:not([title])', '::after');
	assert(tipAfter.includes(MSG.tooltip), 'empty tooltip shows the no-title-fallback warning in ::after');

	// ─── Valid counterparts are NOT flagged (documented in the page copy) ──
	section('Valid markup is not flagged');

	const negatives = await page.evaluate(() => {
		const host = document.querySelector('main');
		const probe = document.createElement('section');
		probe.innerHTML = '<img id="probe-img" alt="" src="ln-ashlar-logo.png">'
			+ '<abbr id="probe-abbr" title="National Aeronautics and Space Administration">NASA</abbr>'
			+ '<button type="button" id="probe-tip" data-ln-tooltip="" title="Fallback">Tip</button>'
			+ '<div data-ln-table></div>';
		host.appendChild(probe);
		const out = {
			imgOutline: getComputedStyle(document.getElementById('probe-img')).outlineStyle,
			abbrAfter: getComputedStyle(document.getElementById('probe-abbr'), '::after').content,
			tipAfter: getComputedStyle(document.getElementById('probe-tip'), '::after').content,
			tableBeforeUnidentified: getComputedStyle(probe.querySelector('div[data-ln-table]'), '::before').content
		};
		probe.remove();
		return out;
	});
	assert(negatives.imgOutline !== 'dashed', 'img with alt="" is not flagged');
	assert(!negatives.abbrAfter.includes(MSG.abbr), 'abbr with title is not flagged');
	assert(!negatives.tipAfter.includes(MSG.tooltip), 'empty tooltip with title fallback is not flagged');
	assert(negatives.tableBeforeUnidentified.includes(MSG.table), 'control: injected id-less [data-ln-table] IS flagged');

	// ─── Demo 6: correct implementation ────────────────────────
	section('6. Correct implementation (no errors)');

	assert(!(await pseudo('#correct-demo-table', '::before')).includes(MSG.table), 'table wrapper with id has no missing-id warning');
	assert(await page.evaluate(() => getComputedStyle(document.getElementById('correct-demo-table')).outlineStyle !== 'dashed'), 'table wrapper with id has no error outline');

	// ln-sort control inside the header cell
	const state = () => page.evaluate(() => {
		const ul = document.querySelector('#correct-demo-table ul[data-ln-sort]');
		return {
			state: ul.getAttribute('data-ln-sort-state'),
			aria: ul.closest('th').getAttribute('aria-sort')
		};
	});

	assert(await page.evaluate(() => document.querySelector('#correct-demo-table ul[data-ln-sort]').getAttribute('data-ln-sort') === 'correct-demo-table'), 'sort control targets correct-demo-table');
	assert((await state()).state === 'none', 'sort control boots in state none');

	// Record ln-sort:change events dispatched on the target.
	await page.evaluate(() => {
		window.__sortEvents = [];
		document.getElementById('correct-demo-table').addEventListener('ln-sort:change', e => {
			window.__sortEvents.push({ direction: e.detail.direction, column: e.detail.column, targetId: e.detail.targetId });
		});
	});

	const clickDir = dir => page.click(`#correct-demo-table button[data-ln-sort-dir="${dir}"]`);
	const waitState = async (st, aria) => {
		await page.waitForFunction((s, a) => {
			const ul = document.querySelector('#correct-demo-table ul[data-ln-sort]');
			return ul.getAttribute('data-ln-sort-state') === s && ul.closest('th').getAttribute('aria-sort') === a;
		}, { timeout: 5000 }, st, aria);
	};

	await clickDir('asc');
	await waitState('asc', 'ascending');
	assert(true, 'asc button -> state asc, th aria-sort="ascending"');

	await clickDir('desc');
	await waitState('desc', 'descending');
	assert(true, 'desc button -> state desc, th aria-sort="descending"');

	await clickDir('none');
	await waitState('none', 'none');
	assert(true, 'none button -> state none, th aria-sort="none"');

	const events = await page.evaluate(() => window.__sortEvents);
	assert(events.length === 3
		&& events.map(e => e.direction).join(',') === 'asc,desc,none'
		&& events.every(e => e.column === 0 && e.targetId === 'correct-demo-table'),
		'ln-sort:change fired per click with direction asc,desc,none, column 0, targetId correct-demo-table');
});
