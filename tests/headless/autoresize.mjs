import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/autoresize.html (live demos)
// and components/ln-autoresize/src/ln-autoresize.js (writes inline style.height on
// construction and on every 'input' event) plus ln-form (data-ln-form reset wiring).

const PAGE_URL = BASE_URL + 'autoresize.html';
const MOUNTED_IDS = ['demo-basic', 'demo-prefilled', 'demo-capped', 'demo-prog', 'demo-reset', 'demo-hidden'];

run('demo/admin/autoresize.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction(ids => {
			const form = document.getElementById('demo-reset-form');
			if (!form || !form.lnForm) return false;
			return ids.every(id => {
				const el = document.getElementById(id);
				return el && el.lnAutoresize;
			});
		}, { timeout: 10000 }, MOUNTED_IDS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Inline height written by the component, as a number (NaN when unset).
	const inlineHeight = id => page.evaluate(i => parseFloat(document.getElementById(i).style.height), id);
	const scrollHeight = id => page.evaluate(i => document.getElementById(i).scrollHeight, id);
	const boxHeight = id => page.evaluate(i => document.getElementById(i).getBoundingClientRect().height, id);

	// Waits until the inline height of #id satisfies spec ({ gt: n } or { eq: n }), then asserts.
	async function waitHeight(id, spec, label) {
		await page.waitForFunction((i, sp) => {
			const h = parseFloat(document.getElementById(i).style.height);
			return 'gt' in sp ? h > sp.gt : h === sp.eq;
		}, { timeout: 5000 }, id, spec).catch(() => {});
		const h = await inlineHeight(id);
		assert('gt' in spec ? h > spec.gt : h === spec.eq, `${label} (inline height ${h}px)`);
		return h;
	}

	await load();

	// ─── Mount ─────────────────────────────────────────────────
	section('Mount');

	const mounted = await page.evaluate(() => Array.from(document.querySelectorAll('textarea[data-ln-autoresize]'))
		.map(el => ({ id: el.id, mounted: !!el.lnAutoresize })));
	assert(mounted.length === 6, '6 static textareas carry data-ln-autoresize');
	assert(mounted.every(m => m.mounted), 'Every static textarea has an lnAutoresize instance');

	// ─── Basic auto-grow ───────────────────────────────────────
	section('Basic auto-grow');

	const basicEmpty = await inlineHeight('demo-basic');
	assert(basicEmpty > 0, `Construction writes an inline height for the empty textarea (${basicEmpty}px)`);

	await page.click('#demo-basic');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.type('line ' + i);
		await page.keyboard.press('Enter');
	}
	const grown = await waitHeight('demo-basic', { gt: basicEmpty }, 'Height grows with ten lines');
	assert(grown === await scrollHeight('demo-basic'), 'Inline height equals scrollHeight after typing');

	await page.evaluate(() => { document.getElementById('demo-basic').value = ''; document.getElementById('demo-basic').dispatchEvent(new Event('input')); });
	await waitHeight('demo-basic', { eq: basicEmpty }, 'Height collapses back to the single-row height when emptied');

	// ─── Pre-filled ────────────────────────────────────────────
	section('Pre-filled content');

	const prefilledValue = await page.evaluate(() => document.getElementById('demo-prefilled').value.length);
	assert(prefilledValue > 100, 'Pre-filled textarea has long server-rendered content');
	const prefilledH = await inlineHeight('demo-prefilled');
	assert(await page.evaluate(() => { const el = document.getElementById('demo-prefilled'); return el.scrollHeight <= el.clientHeight; }), 'Pre-filled content fits without overflow on first paint');
	assert(prefilledH === await scrollHeight('demo-prefilled'), 'Pre-filled inline height equals scrollHeight');

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
	assert(Math.abs(cappedBox - cap.maxHeight) <= 1, `Rendered height stops at max-height (${cappedBox}px vs ${cap.maxHeight}px)`);
	assert(await page.evaluate(() => {
		const el = document.getElementById('demo-capped');
		return el.scrollHeight > el.clientHeight;
	}), 'Content overflows the cap, so the textarea scrolls');

	// ─── Programmatic value ────────────────────────────────────
	section('Programmatic value writes');

	const progEmpty = await inlineHeight('demo-prog');
	// Make the field tall by typing, so a stale height is distinguishable from a re-measured one.
	await page.click('#demo-prog');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.type('x');
		await page.keyboard.press('Enter');
	}
	const progTall = await waitHeight('demo-prog', { gt: progEmpty }, 'Typing makes the programmatic textarea tall');

	await page.click('#demo-prog-set-silent');
	const progSilent = await page.evaluate(() => {
		const el = document.getElementById('demo-prog');
		return { len: el.value.length, h: parseFloat(el.style.height), sh: el.scrollHeight };
	});
	assert(progSilent.len > 100, 'Silent button wrote the sample value');
	assert(progSilent.h === progTall, `Silent .value write leaves the stale height (${progSilent.h}px)`);
	assert(progSilent.h !== progSilent.sh, `Stale height does not match content (scrollHeight ${progSilent.sh}px)`);

	await page.click('#demo-prog-set-event');
	await page.waitForFunction(() => {
		const el = document.getElementById('demo-prog');
		return parseFloat(el.style.height) === el.scrollHeight;
	}, { timeout: 5000 }).catch(() => {});
	assert(await inlineHeight('demo-prog') === await scrollHeight('demo-prog'), 'Dispatching input re-measures: height equals scrollHeight');
	assert(await inlineHeight('demo-prog') < progTall, 'Re-measured height is shorter than the stale one');

	await page.click('#demo-prog-clear');
	await waitHeight('demo-prog', { eq: progEmpty }, 'Clear button (value + input) shrinks back to the single-row height');

	// ─── Reset ─────────────────────────────────────────────────
	section('Reset inside [data-ln-form]');

	const resetEmpty = await inlineHeight('demo-reset');
	await page.click('#demo-reset');
	await page.keyboard.type('a long reply');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.press('Enter');
		await page.keyboard.type('more text');
	}
	const resetGrown = await waitHeight('demo-reset', { gt: resetEmpty }, 'Typing grows the reset-form textarea');

	// Native reset (bare button): textarea clears, height stays tall (reset dispatches no input).
	await page.click('#demo-reset-form button[type="reset"]');
	await page.waitForFunction(() => document.getElementById('demo-reset').value === '', { timeout: 5000 });
	assert(await inlineHeight('demo-reset') === resetGrown, 'Bare native reset clears the value but leaves the height tall');

	// lnForm reset: page claims it clears AND shrinks back to one row.
	await page.click('#demo-reset');
	await page.keyboard.type('x');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.press('Enter');
		await page.keyboard.type('more text');
	}
	await waitHeight('demo-reset', { gt: resetEmpty }, 'Textarea grown again before lnForm reset');
	await page.click('#demo-reset-lnform');
	await page.waitForFunction(() => document.getElementById('demo-reset').value === '', { timeout: 3000 }).catch(() => {});
	assert(await page.evaluate(() => document.getElementById('demo-reset').value === ''), 'Reset (lnForm) clears the textarea');
	await waitHeight('demo-reset', { eq: resetEmpty }, 'Reset (lnForm) shrinks the textarea back to the single-row height');

	// ─── Dynamic insertion ─────────────────────────────────────
	section('Dynamically inserted textareas');

	assert(await page.evaluate(() => document.querySelectorAll('#demo-dynamic-container textarea').length === 0), 'Dynamic container starts empty');
	await page.click('#demo-add-textarea');
	await page.waitForFunction(() => {
		const el = document.querySelector('#demo-dynamic-container textarea');
		return el && el.lnAutoresize;
	}, { timeout: 5000 });
	assert(true, 'Inserted textarea is auto-mounted by the shared MutationObserver');
	assert(await page.evaluate(() => !isNaN(parseFloat(document.querySelector('#demo-dynamic-container textarea').style.height))), 'Inserted textarea received an inline height on construction');

	await page.click('#demo-dynamic-container textarea');
	await page.keyboard.type('a');
	for (let i = 0; i < 10; i++) {
		await page.keyboard.press('Enter');
		await page.keyboard.type('b');
	}
	await page.waitForFunction(() => {
		const el = document.querySelector('#demo-dynamic-container textarea');
		return parseFloat(el.style.height) === el.scrollHeight && el.scrollHeight > 94;
	}, { timeout: 5000 });
	assert(true, 'Inserted textarea grows while typing');

	// ─── Hidden parent ─────────────────────────────────────────
	section('Hidden-then-revealed');

	assert(await page.evaluate(() => document.getElementById('demo-hidden-container').hasAttribute('hidden')), 'Hidden container starts hidden');
	assert(await inlineHeight('demo-hidden') === 0, 'Textarea mounted inside a hidden parent measured scrollHeight 0');

	await page.click('#demo-toggle-hidden');
	await page.waitForFunction(() => !document.getElementById('demo-hidden-container').hasAttribute('hidden'), { timeout: 5000 });
	await waitHeight('demo-hidden', { gt: 0 }, 'Reveal calls _resize and re-measures to a positive height');
	assert(await inlineHeight('demo-hidden') === await scrollHeight('demo-hidden'), 'Hidden textarea inline height equals scrollHeight after reveal');
	assert(await page.evaluate(() => document.getElementById('demo-toggle-hidden').textContent.trim() === 'Hide textarea'), 'Toggle button label switches to "Hide textarea"');

	await page.click('#demo-toggle-hidden');
	await page.waitForFunction(() => document.getElementById('demo-hidden-container').hasAttribute('hidden'), { timeout: 5000 });
	assert(await page.evaluate(() => getComputedStyle(document.getElementById('demo-hidden-container')).display === 'none'), 'Container hides again');

	// ─── destroy ───────────────────────────────────────────────
	section('destroy()');

	await page.evaluate(() => document.getElementById('demo-basic').lnAutoresize.destroy());
	const destroyed = await page.evaluate(() => {
		const el = document.getElementById('demo-basic');
		return { inst: el.lnAutoresize, h: el.style.height, attr: el.hasAttribute('data-ln-autoresize') };
	});
	assert(destroyed.inst === undefined, 'destroy() removes the instance');
	assert(destroyed.h === '', 'destroy() clears the inline height');
	assert(destroyed.attr, 'destroy() leaves the data-ln-autoresize attribute in place');
});
