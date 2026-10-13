import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/autoresize.html (live demos)
// verifying pure-CSS native field-sizing: content behavior.

const PAGE_URL = BASE_URL + 'autoresize.html';
const MOUNTED_IDS = ['demo-basic', 'demo-prefilled', 'demo-capped', 'demo-prog', 'demo-reset', 'demo-hidden'];

run('demo/admin/autoresize.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction(ids => {
			const form = document.getElementById('demo-reset-form');
			if (!form) return false;
			return ids.every(id => !!document.getElementById(id));
		}, { timeout: 10000 }, MOUNTED_IDS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const scrollHeight = id => page.evaluate(i => document.getElementById(i).scrollHeight, id);
	const boxHeight = id => page.evaluate(i => document.getElementById(i).getBoundingClientRect().height, id);

	// Waits until the rendered box height of #id satisfies spec ({ gt: n } or { eq: n } or { lt: n }).
	async function waitBoxHeight(id, spec, label) {
		await page.waitForFunction((i, sp) => {
			const h = document.getElementById(i).getBoundingClientRect().height;
			if ('gt' in sp) return h > sp.gt;
			if ('lt' in sp) return h < sp.lt;
			return Math.abs(h - sp.eq) <= 1;
		}, { timeout: 5000 }, id, spec).catch(() => {});
		const h = await boxHeight(id);
		const pass = 'gt' in spec ? h > spec.gt : ('lt' in spec ? h < spec.lt : Math.abs(h - spec.eq) <= 1);
		assert(pass, `${label} (rendered box height ${h}px)`);
		return h;
	}

	await load();

	// ─── Mount ─────────────────────────────────────────────────
	section('Mount');

	const mounted = await page.evaluate(() => Array.from(document.querySelectorAll('textarea[data-ln-autoresize]'))
		.map(el => ({ id: el.id, hasAttr: el.hasAttribute('data-ln-autoresize') })));
	assert(mounted.length === 6, '6 static textareas carry data-ln-autoresize');
	assert(mounted.every(m => m.hasAttr), 'Every static textarea carries the data-ln-autoresize attribute');

	// ─── Basic auto-grow ───────────────────────────────────────
	section('Basic auto-grow');

	const basicEmpty = await boxHeight('demo-basic');
	assert(basicEmpty > 0, `Initial empty textarea renders a positive baseline height (${basicEmpty}px)`);

	await page.click('#demo-basic');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.type('line ' + i);
		await page.keyboard.press('Enter');
	}
	const grown = await waitBoxHeight('demo-basic', { gt: basicEmpty }, 'Height grows with ten lines');
	assert(grown > basicEmpty, 'Textarea box height expanded with multi-line content');

	await page.evaluate(() => {
		const el = document.getElementById('demo-basic');
		el.value = '';
		el.dispatchEvent(new Event('input', { bubbles: true }));
	});
	await waitBoxHeight('demo-basic', { eq: basicEmpty }, 'Height collapses back to baseline height when emptied');

	// ─── Pre-filled ────────────────────────────────────────────
	section('Pre-filled content');

	const prefilledValue = await page.evaluate(() => document.getElementById('demo-prefilled').value.length);
	assert(prefilledValue > 100, 'Pre-filled textarea has long server-rendered content');
	assert(await page.evaluate(() => {
		const el = document.getElementById('demo-prefilled');
		return el.scrollHeight <= el.clientHeight + 2;
	}), 'Pre-filled content fits without vertical overflow on first paint');

	// ─── Capped ────────────────────────────────────────────────
	section('Capped at 6rem with scroll');

	const cap = await page.evaluate(() => {
		const cs = getComputedStyle(document.getElementById('demo-capped'));
		return { maxHeight: parseFloat(cs.maxHeight), overflowY: cs.overflowY, resize: cs.resize };
	});
	assert(cap.maxHeight > 0, `Computed max-height comes from CSS (${cap.maxHeight}px)`);
	assert(cap.overflowY === 'auto', 'Capped textarea has overflow-y: auto');
	assert(cap.resize === 'none', 'Capped textarea has resize: none');

	await page.click('#demo-capped');
	for (let i = 0; i < 12; i++) {
		await page.keyboard.type('row ' + i);
		await page.keyboard.press('Enter');
	}
	await page.waitForFunction(() => {
		const el = document.getElementById('demo-capped');
		return el.scrollHeight > el.clientHeight;
	}, { timeout: 5000 });
	const cappedBox = await boxHeight('demo-capped');
	assert(Math.abs(cappedBox - cap.maxHeight) <= 2, `Rendered height stops at max-height (${cappedBox}px vs ${cap.maxHeight}px)`);

	// ─── Programmatic value ────────────────────────────────────
	section('Programmatic value writes');

	const progEmpty = await boxHeight('demo-prog');
	await page.click('#demo-prog-set');
	await waitBoxHeight('demo-prog', { gt: progEmpty }, 'Setting sample value expands box height');

	await page.click('#demo-prog-clear');
	await waitBoxHeight('demo-prog', { eq: progEmpty }, 'Clearing sample value snaps back to baseline height');

	// ─── Reset ─────────────────────────────────────────────────
	section('Reset inside [data-ln-form]');

	const resetEmpty = await boxHeight('demo-reset');
	await page.click('#demo-reset');
	for (let i = 0; i < 8; i++) {
		await page.keyboard.type('more text');
		await page.keyboard.press('Enter');
	}
	await waitBoxHeight('demo-reset', { gt: resetEmpty }, 'Typing grows the reset-form textarea');

	await page.click('#demo-reset-btn');
	await page.waitForFunction(() => document.getElementById('demo-reset').value === '', { timeout: 5000 });
	await waitBoxHeight('demo-reset', { eq: resetEmpty }, 'Reset clears content and collapses textarea back to baseline');

	// ─── Dynamic insertion ─────────────────────────────────────
	section('Dynamically inserted textareas');

	assert(await page.evaluate(() => document.querySelectorAll('#demo-dynamic-container textarea').length === 0), 'Dynamic container starts empty');
	await page.click('#demo-add-textarea');
	await page.waitForFunction(() => !!document.querySelector('#demo-dynamic-container textarea'), { timeout: 5000 });
	assert(true, 'Inserted textarea is present in DOM');

	const dynBox0 = await page.evaluate(() => document.querySelector('#demo-dynamic-container textarea').getBoundingClientRect().height);
	assert(dynBox0 > 0, 'Inserted textarea has positive baseline height');

	await page.click('#demo-dynamic-container textarea');
	for (let i = 0; i < 8; i++) {
		await page.keyboard.type('dynamic line ' + i);
		await page.keyboard.press('Enter');
	}
	await page.waitForFunction((h0) => {
		const el = document.querySelector('#demo-dynamic-container textarea');
		return el && el.getBoundingClientRect().height > h0;
	}, { timeout: 5000 }, dynBox0);
	assert(true, 'Dynamically inserted textarea auto-grows via pure CSS');

	// ─── Hidden parent ─────────────────────────────────────────
	section('Hidden-then-revealed');

	assert(await page.evaluate(() => document.getElementById('demo-hidden-container').hasAttribute('hidden')), 'Hidden container starts hidden');
	await page.click('#demo-toggle-hidden');
	await page.waitForFunction(() => !document.getElementById('demo-hidden-container').hasAttribute('hidden'), { timeout: 5000 });
	const hiddenBox = await boxHeight('demo-hidden');
	assert(hiddenBox > basicEmpty, 'Hidden-then-revealed textarea renders with content fit height');
});
