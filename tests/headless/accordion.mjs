import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/accordion.html (live demos),
// components/ln-accordion/src/ln-accordion.js and components/ln-toggle/src/ln-toggle.js.

const PAGE_URL = BASE_URL + 'accordion.html';

// Live demo accordions, in document order (the <ul data-ln-accordion> hosts).
// Anatomy snippets are inside <pre><code> as escaped text, so they are not live.
const ACCORDIONS = 4; // basic, rich headers, nested outer, nested inner

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/accordion.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Waits until every accordion host and every toggle panel has an instance.
	async function ready() {
		await page.waitForFunction(count => {
			const hosts = document.querySelectorAll('ul[data-ln-accordion]');
			if (hosts.length !== count || !Array.from(hosts).every(el => el.lnAccordion)) return false;
			const panels = document.querySelectorAll('section[data-ln-toggle]');
			return panels.length > 0 && Array.from(panels).every(el => el.lnToggle);
		}, { timeout: 10000 }, ACCORDIONS);
	}

	// Fresh page; records every ln-accordion:change into window.__changes.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
		await page.evaluate(() => {
			window.__changes = [];
			document.addEventListener('ln-accordion:change', e => {
				window.__changes.push(e.detail.target.id);
			});
		});
	}

	const trigger = id => `[data-ln-toggle-for="${id}"]`;

	const click = id => page.click(trigger(id));

	// Authoritative state of one panel: attribute, .open class, trigger aria, rendered height.
	const panelState = id => page.evaluate(pid => {
		const el = document.getElementById(pid);
		const trg = document.querySelector('[data-ln-toggle-for="' + pid + '"]');
		return {
			attr: el.getAttribute('data-ln-toggle'),
			open: el.classList.contains('open'),
			aria: trg.getAttribute('aria-expanded'),
			height: el.getBoundingClientRect().height
		};
	}, id);

	// Waits for the panel's data-ln-toggle attribute to equal `value`.
	function waitAttr(id, value) {
		return page.waitForFunction((pid, v) => document.getElementById(pid).getAttribute('data-ln-toggle') === v,
			{ timeout: 5000 }, id, value);
	}

	// Waits for the CSS collapse transition to settle: closed = 0 height, open > 0.
	function waitHeight(id, isOpen) {
		return page.waitForFunction((pid, o) => {
			const h = document.getElementById(pid).getBoundingClientRect().height;
			return o ? h > 0 : h === 0;
		}, { timeout: 5000 }, id, isOpen);
	}

	// Asserts a panel is fully open (attr + class + aria + rendered).
	async function expectOpen(id) {
		await waitAttr(id, 'open');
		await waitHeight(id, true);
		const s = await panelState(id);
		assert(s.attr === 'open' && s.open && s.aria === 'true' && s.height > 0,
			`#${id} is open (attr=open, .open, aria-expanded=true, height>0; got ${JSON.stringify(s)})`);
	}

	// Asserts a panel is fully closed. Panels that never opened have no data-ln-toggle value
	// ("anything else = closed"), so only "open" is excluded for the attribute.
	async function expectClosed(id) {
		await page.waitForFunction(pid => document.getElementById(pid).getAttribute('data-ln-toggle') !== 'open',
			{ timeout: 5000 }, id);
		await waitHeight(id, false);
		const s = await panelState(id);
		assert(s.attr !== 'open' && !s.open && s.aria === 'false' && s.height === 0,
			`#${id} is closed (attr!=open, no .open, aria-expanded=false, height=0; got ${JSON.stringify(s)})`);
	}

	const changes = () => page.evaluate(() => window.__changes.slice());

	// ─── 1. Smoke ──────────────────────────────────────────────

	section('Smoke: structure and initialisation');
	await load();

	const structure = await page.evaluate(() => ({
		accordions: document.querySelectorAll('ul[data-ln-accordion]').length,
		panels: Array.from(document.querySelectorAll('ul[data-ln-accordion] section[data-ln-toggle]')).map(el => el.id),
		triggers: Array.from(document.querySelectorAll('ul[data-ln-accordion] header[data-ln-toggle-for]')).map(el => el.getAttribute('data-ln-toggle-for'))
	}));
	assert(structure.accordions === ACCORDIONS, `${ACCORDIONS} live accordions present (got ${structure.accordions})`);
	const EXPECTED_PANELS = ['panel1', 'panel2', 'panel3', 'sec1', 'sec2', 'sec3', 'nest-outer1', 'nest-inner1', 'nest-inner2', 'nest-outer2'];
	assert(same(structure.panels.slice().sort(), EXPECTED_PANELS.slice().sort()),
		`panels present: ${EXPECTED_PANELS.join(', ')}`);
	assert(same(structure.triggers.slice().sort(), EXPECTED_PANELS.slice().sort()),
		'every panel has exactly one header trigger bound by data-ln-toggle-for');

	// ─── 2. Initial state ──────────────────────────────────────

	section('Initial state: markup-declared open panels, trigger aria-expanded');
	for (const id of ['panel1', 'sec1', 'nest-outer1', 'nest-inner1']) await expectOpen(id);
	for (const id of ['panel2', 'panel3', 'sec2', 'sec3', 'nest-inner2', 'nest-outer2']) await expectClosed(id);

	// ─── 3. Basic accordion: mutual exclusivity ───────────────

	section('Basic accordion: opening a panel closes the open sibling');
	await click('panel2');
	await expectOpen('panel2');
	await expectClosed('panel1');
	await expectClosed('panel3');
	assert(same(await changes(), ['panel2']), 'ln-accordion:change dispatched once with detail.target = panel2');

	await click('panel3');
	await expectOpen('panel3');
	await expectClosed('panel2');
	await expectClosed('panel1');
	assert(same(await changes(), ['panel2', 'panel3']), 'ln-accordion:change dispatched for panel3');

	section('Basic accordion: groups are independent');
	// The rich-header accordion was never touched by the clicks above.
	await expectOpen('sec1');
	await expectClosed('sec2');
	await expectClosed('sec3');

	section('Basic accordion: closing the only-open panel leaves all collapsed, no change event');
	const before = (await changes()).length;
	await click('panel3');
	await expectClosed('panel3');
	await expectClosed('panel1');
	await expectClosed('panel2');
	assert((await changes()).length === before, 'closing a panel dispatches no ln-accordion:change');

	section('Basic accordion: change fires even when nothing needs closing');
	await click('panel1');
	await expectOpen('panel1');
	assert(same((await changes()).slice(before), ['panel1']),
		'ln-accordion:change dispatched for panel1 while every sibling was already closed');

	section('Basic accordion: re-clicking the open panel toggles it closed');
	await click('panel1');
	await expectClosed('panel1');

	// ─── 4. Rich-content headers accordion ─────────────────────

	section('Rich headers accordion: click on nested <h4> inside header opens the panel');
	await load();
	await page.click(`${trigger('sec2')} h4`);
	await expectOpen('sec2');
	await expectClosed('sec1');
	await expectClosed('sec3');
	assert(same(await changes(), ['sec2']), 'ln-accordion:change detail.target = sec2');
	await expectOpen('panel1'); // other accordions untouched

	section('Rich headers accordion: panel content is reachable once open');
	const links = await page.evaluate(() =>
		Array.from(document.querySelectorAll('#sec2 a')).map(a => a.textContent.trim()));
	assert(same(links, ['Cards', 'Forms', 'Tables', 'Navigation', 'Layout']),
		'sec2 lists Cards, Forms, Tables, Navigation, Layout');

	// ─── 5. Nested accordions ──────────────────────────────────

	section('Nested: opening an inner panel closes only its inner sibling');
	await load();
	await click('nest-inner2');
	await expectOpen('nest-inner2');
	await expectClosed('nest-inner1');
	await expectOpen('nest-outer1');
	await expectClosed('nest-outer2');
	assert(same(await changes(), ['nest-inner2']),
		'only the inner accordion dispatched ln-accordion:change (target = nest-inner2)');

	section('Nested: opening Outer 2 closes Outer 1 but leaves inner state untouched');
	await click('nest-outer2');
	await expectOpen('nest-outer2');
	await expectClosed('nest-outer1');
	// Inner state is preserved in the attribute even though the outer panel collapsed it.
	assert(await page.evaluate(() => document.getElementById('nest-inner2').getAttribute('data-ln-toggle')) === 'open',
		'nest-inner2 still data-ln-toggle="open" while Outer 1 is collapsed');
	assert(await page.evaluate(() => document.getElementById('nest-inner1').getAttribute('data-ln-toggle')) !== 'open',
		'nest-inner1 still not open while Outer 1 is collapsed');
	assert(same(await changes(), ['nest-inner2', 'nest-outer2']),
		'outer accordion dispatched ln-accordion:change for nest-outer2');

	section('Nested: re-opening Outer 1 restores the inner accordion previous state');
	await click('nest-outer1');
	await expectOpen('nest-outer1');
	await expectClosed('nest-outer2');
	await expectOpen('nest-inner2');
	await expectClosed('nest-inner1');

	// ─── 6. Programmatic API (attribute is the contract) ───────

	section('API: setting data-ln-toggle="open" on a panel closes the open sibling');
	await load();
	await page.evaluate(() => document.getElementById('panel2').setAttribute('data-ln-toggle', 'open'));
	await expectOpen('panel2');
	await expectClosed('panel1');
	assert(same(await changes(), ['panel2']), 'attribute write dispatched ln-accordion:change for panel2');

	section('API: ln-toggle:request-open drives the same coordination');
	await page.evaluate(() => document.getElementById('panel3')
		.dispatchEvent(new CustomEvent('ln-toggle:request-open', { bubbles: true })));
	await expectOpen('panel3');
	await expectClosed('panel2');

	section('API: lnAccordion.destroy() stops coordination, children stay intact');
	await load();
	const destroyed = await page.evaluate(() => {
		const acc = document.getElementById('panel1').closest('[data-ln-accordion]');
		acc.lnAccordion.destroy();
		return acc.lnAccordion === undefined;
	});
	assert(destroyed, 'lnAccordion instance removed from the host');
	await click('panel2');
	await expectOpen('panel2');
	await expectOpen('panel1'); // no coordinator -> multi-open, panel1 not closed
	assert((await changes()).length === 0, 'no ln-accordion:change after destroy');
});
