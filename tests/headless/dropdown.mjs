import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/dropdown.html (Examples 1 and 2)
// and components/ln-dropdown/src/ln-dropdown.js + components/ln-toggle/src/ln-toggle.js.

const PAGE_URL = BASE_URL + 'dropdown.html';

const MENUS = {
	basic: { id: 'demo-menu-1', items: ['Edit', 'Duplicate', 'Archive', 'Delete'] },
	start: { id: 'demo-menu-start', items: ['Action 1', 'Action 2', 'Action 3'], position: 'bottom-start' },
	end: { id: 'demo-menu-end', items: ['Action 1', 'Action 2', 'Action 3'], position: 'bottom-end' }
};

const trigger = menu => `button[data-ln-toggle-for="${menu.id}"]`;
const menuSel = menu => `#${menu.id}`;

run('demo/admin/dropdown.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Waits until all three dropdowns and their toggles are initialised.
	async function ready() {
		await page.waitForFunction(ids => {
			const hosts = document.querySelectorAll('[data-ln-dropdown]');
			if (hosts.length !== ids.length) return false;
			if (!Array.from(hosts).every(el => el.lnDropdown)) return false;
			return ids.every(id => {
				const el = document.getElementById(id);
				return el && el.lnToggle && el.getAttribute('popover') === 'manual';
			});
		}, { timeout: 10000 }, Object.values(MENUS).map(m => m.id));
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
		// Installed once per load: records ln-dropdown:open / ln-dropdown:close (bubbling to document).
		await page.evaluate(() => {
			window.__ddEvents = [];
			['open', 'close'].forEach(name => {
				document.addEventListener('ln-dropdown:' + name, e => {
					window.__ddEvents.push({ name, id: e.detail.target.id, host: e.target.contains(e.detail.target) });
				});
			});
		});
	}

	const bringIntoView = menu => page.evaluate(sel => {
		document.querySelector(sel).scrollIntoView({ block: 'start' });
	}, trigger(menu));

	const state = menu => page.evaluate((tSel, mSel) => {
		const t = document.querySelector(tSel);
		const m = document.querySelector(mSel);
		return {
			toggle: m.getAttribute('data-ln-toggle'),
			popoverOpen: m.matches(':popover-open'),
			display: getComputedStyle(m).display,
			expanded: t.getAttribute('aria-expanded'),
			placement: m.getAttribute('data-ln-dropdown-placement'),
			active: document.activeElement === t ? 'trigger' : (m.contains(document.activeElement) ? document.activeElement.textContent.trim() : 'other')
		};
	}, trigger(menu), menuSel(menu));

	async function expectOpen(menu, label) {
		await page.waitForFunction(sel => document.querySelector(sel).matches(':popover-open'), { timeout: 5000 }, menuSel(menu)).catch(() => {});
		const s = await state(menu);
		assert(s.toggle === 'open' && s.popoverOpen && s.display !== 'none' && s.expanded === 'true',
			`${label}: open (data-ln-toggle=${s.toggle}, popover-open=${s.popoverOpen}, display=${s.display}, aria-expanded=${s.expanded})`);
	}

	async function expectClosed(menu, label) {
		await page.waitForFunction(sel => !document.querySelector(sel).matches(':popover-open'), { timeout: 5000 }, menuSel(menu)).catch(() => {});
		const s = await state(menu);
		assert(s.toggle === 'close' && !s.popoverOpen && s.display === 'none' && s.expanded === 'false' && s.placement === null,
			`${label}: closed (data-ln-toggle=${s.toggle}, popover-open=${s.popoverOpen}, display=${s.display}, aria-expanded=${s.expanded}, placement=${s.placement})`);
	}

	async function expectActive(menu, expected, label) {
		await page.waitForFunction((mSel, tSel, exp) => {
			const m = document.querySelector(mSel);
			const t = document.querySelector(tSel);
			const a = document.activeElement;
			if (exp === 'trigger') return a === t;
			return m.contains(a) && a.textContent.trim() === exp;
		}, { timeout: 5000 }, menuSel(menu), trigger(menu), expected).catch(() => {});
		const s = await state(menu);
		assert(s.active === expected, `${label}: focus on ${expected} (got ${s.active})`);
	}

	const events = () => page.evaluate(() => window.__ddEvents.slice());

	// ─── Initialisation ────────────────────────────────────────
	section('Init: ARIA written by ln-dropdown');
	await load();

	const init = await page.evaluate(menus => menus.map(m => {
		const menu = document.getElementById(m.id);
		const t = document.querySelector('button[data-ln-toggle-for="' + m.id + '"]');
		const items = Array.from(menu.querySelectorAll('button'));
		return {
			id: m.id,
			menuAttr: menu.hasAttribute('data-ln-dropdown-menu'),
			role: menu.getAttribute('role'),
			popover: menu.getAttribute('popover'),
			haspopup: t.getAttribute('aria-haspopup'),
			expanded: t.getAttribute('aria-expanded'),
			liRoles: Array.from(menu.querySelectorAll('li')).every(li => li.getAttribute('role') === 'none'),
			itemRoles: items.every(b => b.getAttribute('role') === 'menuitem'),
			tabindexes: items.map(b => b.getAttribute('tabindex')),
			texts: items.map(b => b.textContent.trim()),
			closed: menu.getAttribute('data-ln-toggle'),
			display: getComputedStyle(menu).display
		};
	}), Object.values(MENUS));

	for (const m of init) {
		const spec = Object.values(MENUS).find(x => x.id === m.id);
		assert(m.menuAttr && m.role === 'menu' && m.popover === 'manual', `${m.id}: menu has data-ln-dropdown-menu, role=menu, popover=manual`);
		assert(m.haspopup === 'menu' && m.expanded === 'false', `${m.id}: trigger aria-haspopup=menu, aria-expanded=false`);
		assert(m.liRoles && m.itemRoles, `${m.id}: li role=none and buttons role=menuitem`);
		assert(m.tabindexes.every((v, i) => v === (i === 0 ? '0' : '-1')), `${m.id}: roving tabindex (first 0, rest -1): [${m.tabindexes.join(',')}]`);
		assert(m.texts.join('|') === spec.items.join('|'), `${m.id}: items [${m.texts.join(', ')}]`);
		assert(m.closed !== 'open' && m.display === 'none', `${m.id}: initially closed and hidden`);
	}

	// ─── Example 1: click open / close ─────────────────────────
	section('Example 1: trigger click opens and closes');
	await bringIntoView(MENUS.basic);
	await page.click(trigger(MENUS.basic));
	await expectOpen(MENUS.basic, 'Click trigger');
	let ev = await events();
	assert(ev.length === 1 && ev[0].name === 'open' && ev[0].id === MENUS.basic.id && ev[0].host,
		`ln-dropdown:open fired once with detail.target = #${MENUS.basic.id}`);

	// computePlacement reports the winning side ('bottom'), alignment is checked by geometry.
	const geo1 = await page.evaluate((tSel, mSel) => {
		const t = document.querySelector(tSel).getBoundingClientRect();
		const m = document.querySelector(mSel);
		const r = m.getBoundingClientRect();
		return { placement: m.getAttribute('data-ln-dropdown-placement'), dRight: r.right - t.right };
	}, trigger(MENUS.basic), menuSel(MENUS.basic));
	assert(geo1.placement === 'bottom', `Winning side written to data-ln-dropdown-placement = bottom (got ${geo1.placement})`);
	assert(Math.abs(geo1.dRight) <= 1.5, `Default position bottom-end: menu right edge aligns with trigger right (delta ${geo1.dRight.toFixed(2)}px)`);

	await page.click(trigger(MENUS.basic));
	await expectClosed(MENUS.basic, 'Click trigger again');
	ev = await events();
	assert(ev.length === 2 && ev[1].name === 'close' && ev[1].id === MENUS.basic.id,
		'ln-dropdown:close fired with detail.target after second click');

	// ─── Outside click ─────────────────────────────────────────
	section('Example 1: outside click closes');
	await page.click(trigger(MENUS.basic));
	await expectOpen(MENUS.basic, 'Reopen');
	await page.evaluate(() => document.querySelector('section.section-card header h3').click());
	await expectClosed(MENUS.basic, 'Click outside');

	section('Example 1: click inside menu does not close via outside handler');
	await page.click(trigger(MENUS.basic));
	await expectOpen(MENUS.basic, 'Reopen');
	await page.evaluate(sel => document.querySelector(sel + ' li').click(), menuSel(MENUS.basic));
	await new Promise(r => setTimeout(r, 100));
	assert((await state(MENUS.basic)).toggle === 'open', 'Click on a menu li (inside) leaves the menu open');
	await page.keyboard.press('Escape');
	await page.focus(trigger(MENUS.basic));
	await page.keyboard.press('Escape');
	await expectClosed(MENUS.basic, 'Escape cleanup');

	// ─── Keyboard ──────────────────────────────────────────────
	section('Example 1: keyboard navigation');
	await page.focus(trigger(MENUS.basic));
	await page.keyboard.press('ArrowDown');
	await expectOpen(MENUS.basic, 'ArrowDown on trigger');
	await expectActive(MENUS.basic, 'Edit', 'ArrowDown on trigger');

	await page.keyboard.press('ArrowDown');
	await expectActive(MENUS.basic, 'Duplicate', 'ArrowDown');
	await page.keyboard.press('ArrowDown');
	await expectActive(MENUS.basic, 'Archive', 'ArrowDown');
	await page.keyboard.press('End');
	await expectActive(MENUS.basic, 'Delete', 'End');
	await page.keyboard.press('ArrowDown');
	await expectActive(MENUS.basic, 'Edit', 'ArrowDown wraps last -> first');
	await page.keyboard.press('ArrowUp');
	await expectActive(MENUS.basic, 'Delete', 'ArrowUp wraps first -> last');
	await page.keyboard.press('ArrowUp');
	await expectActive(MENUS.basic, 'Archive', 'ArrowUp');
	await page.keyboard.press('Home');
	await expectActive(MENUS.basic, 'Edit', 'Home');

	const tabindexes = await page.evaluate(sel => Array.from(document.querySelectorAll(sel + ' button')).map(b => b.getAttribute('tabindex')), menuSel(MENUS.basic));
	assert(tabindexes.join(',') === '0,-1,-1,-1', `Roving tabindex follows focus (Home -> [${tabindexes.join(',')}])`);

	await page.keyboard.press('Escape');
	await expectClosed(MENUS.basic, 'Escape');
	await expectActive(MENUS.basic, 'trigger', 'Escape returns focus');

	section('Example 1: ArrowUp on trigger opens and focuses last item');
	await page.keyboard.press('ArrowUp');
	await expectOpen(MENUS.basic, 'ArrowUp on trigger');
	await expectActive(MENUS.basic, 'Delete', 'ArrowUp on trigger');

	section('Example 1: Tab closes the menu');
	await page.keyboard.press('Tab');
	await expectClosed(MENUS.basic, 'Tab');

	// ─── Resize ────────────────────────────────────────────────
	section('Example 1: window resize closes');
	await page.click(trigger(MENUS.basic));
	await expectOpen(MENUS.basic, 'Open before resize');
	await page.setViewport({ width: 1100, height: 900 });
	await expectClosed(MENUS.basic, 'Resize');
	await page.setViewport({ width: 1280, height: 900 });

	// ─── Example 2: placement ──────────────────────────────────
	section('Example 2: configurable placement');
	await page.evaluate(() => window.__ddEvents.length = 0);
	await bringIntoView(MENUS.start);

	await page.click(trigger(MENUS.start));
	await expectOpen(MENUS.start, 'bottom-start menu');
	const startGeo = await page.evaluate((tSel, mSel) => {
		const t = document.querySelector(tSel).getBoundingClientRect();
		const m = document.querySelector(mSel);
		const r = m.getBoundingClientRect();
		return { placement: m.getAttribute('data-ln-dropdown-placement'), dLeft: r.left - t.left, belowTrigger: r.top >= t.bottom };
	}, trigger(MENUS.start), menuSel(MENUS.start));
	assert(startGeo.placement === 'bottom', `bottom-start: winning side = bottom (got ${startGeo.placement})`);
	assert(Math.abs(startGeo.dLeft) <= 1.5, `bottom-start: menu left edge aligns with trigger left (delta ${startGeo.dLeft.toFixed(2)}px)`);
	assert(startGeo.belowTrigger, 'bottom-start: menu sits below the trigger');

	// Opening the sibling dropdown is an outside click for the first one.
	await page.click(trigger(MENUS.end));
	await expectOpen(MENUS.end, 'bottom-end menu');
	await expectClosed(MENUS.start, 'Opening sibling closes the first dropdown (outside click)');
	const endGeo = await page.evaluate((tSel, mSel) => {
		const t = document.querySelector(tSel).getBoundingClientRect();
		const m = document.querySelector(mSel);
		const r = m.getBoundingClientRect();
		return { placement: m.getAttribute('data-ln-dropdown-placement'), dRight: r.right - t.right, belowTrigger: r.top >= t.bottom };
	}, trigger(MENUS.end), menuSel(MENUS.end));
	assert(endGeo.placement === 'bottom', `bottom-end: winning side = bottom (got ${endGeo.placement})`);
	assert(Math.abs(endGeo.dRight) <= 1.5, `bottom-end: menu right edge aligns with trigger right (delta ${endGeo.dRight.toFixed(2)}px)`);
	assert(endGeo.belowTrigger, 'bottom-end: menu sits below the trigger');

	ev = await events();
	const seq = ev.map(e => `${e.name}:${e.id}`).join(',');
	const expectedSeq = `open:${MENUS.start.id},open:${MENUS.end.id},close:${MENUS.start.id}`;
	assert(seq === expectedSeq, `Event order [${seq}] equals [${expectedSeq}]`);

	await page.keyboard.press('Escape');
	await page.focus(trigger(MENUS.end));
	await page.keyboard.press('Escape');
	await expectClosed(MENUS.end, 'Escape closes bottom-end menu');

	section('Example 2: keyboard on a 3-item menu');
	await page.focus(trigger(MENUS.start));
	await page.keyboard.press('ArrowDown');
	await expectOpen(MENUS.start, 'ArrowDown on start trigger');
	await expectActive(MENUS.start, 'Action 1', 'ArrowDown on start trigger');
	await page.keyboard.press('End');
	await expectActive(MENUS.start, 'Action 3', 'End');
	await page.keyboard.press('Escape');
	await expectClosed(MENUS.start, 'Escape');
});
