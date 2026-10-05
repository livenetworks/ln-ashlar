import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/src/pages/toggle.html. The live demos are driven by REAL library components:
// ln-toggle (sidebar #demo-sidebar-example, collapsible #collapse-example, dropdown menu
// #dropdown-example), ln-dropdown (wrapper of the dropdown example) and ln-persist (storage
// of data-ln-persist panels). All other sections are prose / <pre><code> samples.
// Persistence, cancelable transitions, request-* events and dynamic DOM have no live demo
// panel on the page, so they are exercised on throw-away panels created at runtime
// from the markup patterns the page documents (components/ln-toggle/src, ln-persist/src).
// No network or mocks are involved.

const PAGE_URL = BASE_URL + 'toggle.html';

const SIDEBAR = 'demo-sidebar-example';
const COLLAPSE = 'collapse-example';
const DROPDOWN = 'dropdown-example';

run('demo/admin/toggle.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated so one broken demo does not hide the others.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction((ids) => ids.every(id => {
			const el = document.getElementById(id);
			return el && el.lnToggle;
		}) && document.getElementById('dropdown-example').closest('[data-ln-dropdown]').lnDropdown, { timeout: 10000 }, [SIDEBAR, COLLAPSE, DROPDOWN]);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Panel state: attribute, .open class, instance flag, aria-expanded of every trigger.
	const state = id => page.evaluate(i => {
		const el = document.getElementById(i);
		return {
			attr: el.getAttribute('data-ln-toggle'),
			cls: el.classList.contains('open'),
			isOpen: el.lnToggle.isOpen,
			aria: Array.from(document.querySelectorAll('[data-ln-toggle-for="' + i + '"]'))
				.map(t => t.getAttribute('aria-expanded'))
		};
	}, id);

	async function expectState(id, attr, label) {
		const open = attr === 'open';
		await page.waitForFunction((i, a) => document.getElementById(i).getAttribute('data-ln-toggle') === a
			&& document.getElementById(i).lnToggle.isOpen === (a === 'open'), { timeout: 5000 }, id, attr).catch(() => {});
		const s = await state(id);
		assert(s.attr === attr, `${label}: data-ln-toggle="${attr}" (got "${s.attr}")`);
		assert(s.cls === open, `${label}: .open class ${open ? 'present' : 'absent'}`);
		assert(s.isOpen === open, `${label}: lnToggle.isOpen === ${open}`);
		assert(s.aria.length > 0 && s.aria.every(v => v === String(open)), `${label}: all triggers aria-expanded="${open}" (got [${s.aria.join(',')}])`);
	}

	// Click via DOM so shell overlays cannot intercept.
	const click = sel => page.evaluate(s => document.querySelector(s).click(), sel);

	// Records ln-toggle:* events at document, keyed by name -> list of {id, target}.
	const recordEvents = () => page.evaluate(() => {
		window.__ev = [];
		['before-open', 'open', 'before-close', 'close'].forEach(n => {
			document.addEventListener('ln-toggle:' + n, e => {
				window.__ev.push({ name: n, id: e.target.id, targetId: e.detail.target.id, cancelable: e.cancelable });
			});
		});
	});
	const events = () => page.evaluate(() => window.__ev.slice());
	const waitEvents = n => page.waitForFunction(c => window.__ev.length >= c, { timeout: 5000 }, n);

	await check('Sidebar example: initial state (markup data-ln-toggle="open")', async () => {
		await load();
		await expectState(SIDEBAR, 'open', 'sidebar initial');
		const s = await state(SIDEBAR);
		assert(s.aria.length === 2, `sidebar has 2 triggers (close X + Toggle Sidebar), got ${s.aria.length}`);
	});

	await check('Sidebar example: toggle button, close-only action button, multiple triggers in sync', async () => {
		await load();
		await recordEvents();
		const toggleBtn = `button.btn[data-ln-toggle-for="${SIDEBAR}"]`;
		const closeBtn = `button[data-ln-toggle-for="${SIDEBAR}"][data-ln-toggle-action="close"]`;

		await click(toggleBtn);
		await expectState(SIDEBAR, 'close', 'after Toggle click');

		await click(toggleBtn);
		await expectState(SIDEBAR, 'open', 'after second Toggle click');

		// action="close" always closes, never re-opens
		await click(closeBtn);
		await expectState(SIDEBAR, 'close', 'after X click');
		await click(closeBtn);
		await expectState(SIDEBAR, 'close', 'X click again stays closed');

		await waitEvents(5);
		const ev = await events();
		const names = ev.map(e => e.name);
		const expected = ['before-close', 'close', 'before-open', 'open', 'before-close', 'close'];
		assert(JSON.stringify(names) === JSON.stringify(expected), `event sequence ${expected.join(' > ')} (got ${names.join(' > ')})`);
		assert(ev.every(e => e.targetId === SIDEBAR && e.id === SIDEBAR), 'detail.target is the panel element for every event');
		assert(ev.filter(e => e.name.startsWith('before')).every(e => e.cancelable) && ev.filter(e => !e.name.startsWith('before')).every(e => !e.cancelable), 'before-* cancelable, open/close not cancelable');
	});

	await check('Sidebar example: DevTools-style attribute write is the single path', async () => {
		await load();
		await page.evaluate(id => document.getElementById(id).setAttribute('data-ln-toggle', 'close'), SIDEBAR);
		await expectState(SIDEBAR, 'close', 'setAttribute close');
		await page.evaluate(id => document.getElementById(id).setAttribute('data-ln-toggle', 'open'), SIDEBAR);
		await expectState(SIDEBAR, 'open', 'setAttribute open');
		// anything other than "open" is closed (empty value included)
		await page.evaluate(id => document.getElementById(id).setAttribute('data-ln-toggle', ''), SIDEBAR);
		await expectState(SIDEBAR, '', 'empty value is closed');
	});

	await check('Programmatic API [source: ln-toggle.js] (page prose says setAttribute is the only path)', async () => {
		await load();
		const api = await page.evaluate(id => {
			const t = document.getElementById(id).lnToggle;
			return [typeof t.open, typeof t.close, typeof t.toggle, typeof t.destroy];
		}, COLLAPSE);
		assert(api.every(t => t === 'function'), `lnToggle.open/close/toggle/destroy are functions [source] (got ${api.join(',')})`);
		await page.evaluate(id => document.getElementById(id).lnToggle.open(), COLLAPSE);
		await expectState(COLLAPSE, 'open', 'lnToggle.open()');
		await page.evaluate(id => document.getElementById(id).lnToggle.toggle(), COLLAPSE);
		await expectState(COLLAPSE, 'close', 'lnToggle.toggle()');
		await page.evaluate(id => document.getElementById(id).lnToggle.open(), COLLAPSE);
		await page.evaluate(id => document.getElementById(id).lnToggle.close(), COLLAPSE);
		await expectState(COLLAPSE, 'close', 'lnToggle.close()');
	});

	await check('Collapsible example', async () => {
		await load();
		const btn = `button[data-ln-toggle-for="${COLLAPSE}"]`;
		// Markup has data-ln-toggle with no value: closed, no .open
		const initial = await state(COLLAPSE);
		assert(initial.attr === '' && initial.cls === false && initial.isOpen === false, 'initial: empty attribute is closed, no .open');
		assert(initial.aria.length === 1 && initial.aria[0] === 'false', 'initial: trigger aria-expanded="false" (synced at construct)');

		await click(btn);
		await expectState(COLLAPSE, 'open', 'after click');
		await click(btn);
		await expectState(COLLAPSE, 'close', 'after second click');
	});

	await check('Cancelable transitions: before-open / before-close preventDefault reverts the attribute', async () => {
		await load();
		await page.evaluate(() => {
			window.__cancel = { open: 0, close: 0, opened: 0, closed: 0, block: true };
			document.addEventListener('ln-toggle:before-open', e => {
				if (e.detail.target.id === 'collapse-example' && window.__cancel.block) { window.__cancel.open++; e.preventDefault(); }
			});
			document.addEventListener('ln-toggle:before-close', e => {
				if (e.detail.target.id === 'demo-sidebar-example' && window.__cancel.block) { window.__cancel.close++; e.preventDefault(); }
			});
			document.addEventListener('ln-toggle:open', e => { if (e.target.id === 'collapse-example') window.__cancel.opened++; });
			document.addEventListener('ln-toggle:close', e => { if (e.target.id === 'demo-sidebar-example') window.__cancel.closed++; });
		});

		await click(`button[data-ln-toggle-for="${COLLAPSE}"]`);
		await page.waitForFunction(() => window.__cancel.open === 1, { timeout: 5000 });
		await expectState(COLLAPSE, 'close', 'canceled before-open: reverted to close');
		let c = await page.evaluate(() => window.__cancel);
		assert(c.open === 1 && c.opened === 0, `before-open fired once, no ln-toggle:open (before-open=${c.open}, open=${c.opened}) - no revert loop`);

		await click(`button[data-ln-toggle-for="${SIDEBAR}"][data-ln-toggle-action="close"]`);
		await page.waitForFunction(() => window.__cancel.close === 1, { timeout: 5000 });
		await expectState(SIDEBAR, 'open', 'canceled before-close: reverted to open');
		c = await page.evaluate(() => window.__cancel);
		assert(c.close === 1 && c.closed === 0, `before-close fired once, no ln-toggle:close (before-close=${c.close}, close=${c.closed})`);

		// un-block: transitions work again
		await page.evaluate(() => { window.__cancel.block = false; });
		await click(`button[data-ln-toggle-for="${COLLAPSE}"]`);
		await expectState(COLLAPSE, 'open', 'after un-blocking, opens');
	});

	await check('request-open / request-close / request-toggle events [source]', async () => {
		await load();
		const fire = n => page.evaluate((id, name) => document.getElementById(id).dispatchEvent(new CustomEvent('ln-toggle:request-' + name)), COLLAPSE, n);
		await fire('open');
		await expectState(COLLAPSE, 'open', 'request-open');
		await fire('close');
		await expectState(COLLAPSE, 'close', 'request-close');
		await fire('toggle');
		await expectState(COLLAPSE, 'open', 'request-toggle (closed -> open)');
	});

	await check('Dropdown example: ARIA wiring done by ln-dropdown at init', async () => {
		await load();
		const info = await page.evaluate(id => {
			const menu = document.getElementById(id);
			const btn = document.querySelector('[data-ln-toggle-for="' + id + '"]');
			const items = Array.from(menu.querySelectorAll('a[href]'));
			return {
				menuAttr: menu.hasAttribute('data-ln-dropdown-menu'),
				role: menu.getAttribute('role'),
				popover: menu.getAttribute('popover'),
				haspopup: btn.getAttribute('aria-haspopup'),
				expanded: btn.getAttribute('aria-expanded'),
				liRoles: Array.from(menu.querySelectorAll('li')).map(l => l.getAttribute('role')),
				itemRoles: items.map(a => a.getAttribute('role')),
				tabindex: items.map(a => a.getAttribute('tabindex')),
				toggleAttr: menu.getAttribute('data-ln-toggle'),
				popoverOpen: menu.matches(':popover-open')
			};
		}, DROPDOWN);
		assert(info.menuAttr && info.role === 'menu' && info.popover === 'manual', 'menu has data-ln-dropdown-menu, role=menu, popover=manual');
		assert(info.haspopup === 'menu' && info.expanded === 'false', 'trigger aria-haspopup="menu", aria-expanded="false"');
		assert(info.liRoles.length === 3 && info.liRoles.every(r => r === 'none'), '3 <li> have role=none');
		assert(info.itemRoles.length === 3 && info.itemRoles.every(r => r === 'menuitem'), '3 links have role=menuitem');
		assert(info.tabindex.join(',') === '0,-1,-1', `roving tabindex 0,-1,-1 (got ${info.tabindex.join(',')})`);
		assert(info.toggleAttr === '' && !info.popoverOpen, 'menu starts closed (empty attribute, not :popover-open)');
	});

	await check('Dropdown example: open, ln-dropdown events, outside click closes', async () => {
		await load();
		await page.evaluate(() => {
			window.__dd = [];
			const host = document.getElementById('dropdown-example').closest('[data-ln-dropdown]');
			host.addEventListener('ln-dropdown:open', () => window.__dd.push('open'));
			host.addEventListener('ln-dropdown:close', () => window.__dd.push('close'));
		});
		const btn = `button[data-ln-toggle-for="${DROPDOWN}"]`;
		await click(btn);
		await page.waitForFunction(id => document.getElementById(id).matches(':popover-open'), { timeout: 5000 }, DROPDOWN);
		await expectState(DROPDOWN, 'open', 'dropdown open');
		const placement = await page.evaluate(id => document.getElementById(id).getAttribute('data-ln-dropdown-placement'), DROPDOWN);
		assert(!!placement, `placement attribute written on open (got "${placement}")`);
		const dd = await page.evaluate(() => window.__dd.slice());
		assert(dd.join() === 'open', `ln-dropdown:open dispatched once (got ${dd.join()})`);
		assert(await page.evaluate(id => document.querySelector('[data-ln-toggle-for="' + id + '"]').getAttribute('aria-expanded'), DROPDOWN) === 'true', 'trigger aria-expanded="true"');

		// outside-click listener is attached on a macrotask after open: yield one in-page
		await page.evaluate(() => new Promise(r => setTimeout(r, 0)));
		await page.evaluate(() => document.body.click());
		await page.waitForFunction(id => !document.getElementById(id).matches(':popover-open'), { timeout: 5000 }, DROPDOWN);
		await expectState(DROPDOWN, 'close', 'outside click closes');
		const after = await page.evaluate(id => ({
			dd: window.__dd.slice(),
			placement: document.getElementById(id).hasAttribute('data-ln-dropdown-placement'),
			expanded: document.querySelector('[data-ln-toggle-for="' + id + '"]').getAttribute('aria-expanded')
		}), DROPDOWN);
		assert(after.dd.join() === 'open,close', `ln-dropdown:close dispatched (got ${after.dd.join()})`);
		assert(!after.placement && after.expanded === 'false', 'placement attribute removed, aria-expanded="false"');
	});

	await check('Dropdown example: click inside the menu does not close; Escape closes and refocuses trigger', async () => {
		await load();
		const btn = `button[data-ln-toggle-for="${DROPDOWN}"]`;
		await click(btn);
		await expectState(DROPDOWN, 'open', 'open');
		await page.evaluate(() => new Promise(r => setTimeout(r, 0)));
		await page.evaluate(id => document.getElementById(id).dispatchEvent(new MouseEvent('click', { bubbles: true })), DROPDOWN);
		await page.evaluate(() => new Promise(r => setTimeout(r, 0)));
		const stay = await state(DROPDOWN);
		assert(stay.attr === 'open', 'click inside menu keeps it open');

		await page.focus(btn);
		await page.keyboard.press('Escape');
		await expectState(DROPDOWN, 'close', 'Escape closes');
		const focused = await page.evaluate(id => document.activeElement === document.querySelector('[data-ln-toggle-for="' + id + '"]'), DROPDOWN);
		assert(focused, 'focus is on the trigger after Escape');
	});

	await check('Dropdown example: keyboard ArrowDown opens + focuses first item, ArrowDown/Up/End/Home move focus, Tab closes', async () => {
		await load();
		const btn = `button[data-ln-toggle-for="${DROPDOWN}"]`;
		const active = () => page.evaluate(() => document.activeElement.textContent.trim());
		await page.focus(btn);
		await page.keyboard.press('ArrowDown');
		await page.waitForFunction(() => document.activeElement.textContent.trim() === 'Edit', { timeout: 5000 });
		await expectState(DROPDOWN, 'open', 'ArrowDown opens');
		await page.keyboard.press('ArrowDown');
		assert(await active() === 'Delete', 'ArrowDown -> Delete');
		await page.keyboard.press('End');
		assert(await active() === 'Archive', 'End -> Archive');
		await page.keyboard.press('ArrowDown');
		assert(await active() === 'Edit', 'ArrowDown wraps -> Edit');
		await page.keyboard.press('ArrowUp');
		assert(await active() === 'Archive', 'ArrowUp wraps -> Archive');
		await page.keyboard.press('Home');
		assert(await active() === 'Edit', 'Home -> Edit');
		await page.keyboard.press('Tab');
		await expectState(DROPDOWN, 'close', 'Tab closes');
	});

	await check('Dropdown example: window resize closes an open menu', async () => {
		await load();
		await click(`button[data-ln-toggle-for="${DROPDOWN}"]`);
		await expectState(DROPDOWN, 'open', 'open');
		try {
			await page.setViewport({ width: 1100, height: 800 });
			await page.waitForFunction(id => document.getElementById(id).getAttribute('data-ln-toggle') === 'close', { timeout: 5000 }, DROPDOWN);
			await expectState(DROPDOWN, 'close', 'resize closes');
		} finally {
			await page.setViewport({ width: 1280, height: 900 });
		}
	});

	await check('Persistence (ln-persist) on runtime panels: global, custom key, page scope, restore', async () => {
		await load();
		const make = (id, attrs, state) => page.evaluate((i, a, s) => {
			const wrap = document.createElement('section');
			wrap.className = 'tmp-toggle-test';
			wrap.innerHTML = '<button data-ln-toggle-for="' + i + '">t</button><section id="' + i + '" data-ln-toggle="' + s + '" ' + a + '></section>';
			document.body.appendChild(wrap);
		}, id, attrs, state);
		const stored = k => page.evaluate(key => localStorage.getItem(key), k);

		await make('tmp-p1', 'data-ln-persist', 'close');
		await make('tmp-p2', 'data-ln-persist="left-panel"', 'close');
		await make('tmp-p3', 'data-ln-persist data-ln-persist-scope="page"', 'close');
		await make('tmp-p4', '', 'close');
		await page.waitForFunction(() => ['tmp-p1', 'tmp-p2', 'tmp-p3', 'tmp-p4'].every(i => document.getElementById(i).lnToggle), { timeout: 5000 });

		for (const id of ['tmp-p1', 'tmp-p2', 'tmp-p3', 'tmp-p4']) {
			await click(`[data-ln-toggle-for="${id}"]`);
			await expectState(id, 'open', id + ' opened');
		}
		const path = await page.evaluate(() => (location.pathname.replace(/\/+$/, '').toLowerCase()) || '/');
		const keys = {
			global: 'ln:tmp-p1:data-ln-toggle',
			custom: 'ln:left-panel:data-ln-toggle',
			page: 'ln:tmp-p3:' + path + ':data-ln-toggle'
		};
		await page.waitForFunction(k => localStorage.getItem(k) === 'open', { timeout: 5000 }, keys.global);
		assert(await stored(keys.global) === 'open', `${keys.global} = open`);
		await page.waitForFunction(k => localStorage.getItem(k) === 'open', { timeout: 5000 }, keys.custom);
		assert(await stored(keys.custom) === 'open', `${keys.custom} = open`);
		await page.waitForFunction(k => localStorage.getItem(k) === 'open', { timeout: 5000 }, keys.page);
		assert(await stored(keys.page) === 'open', `${keys.page} = open`);
		assert(await stored('ln:tmp-p4:data-ln-toggle') === null, 'panel without data-ln-persist writes nothing');

		await click('[data-ln-toggle-for="tmp-p1"]');
		await page.waitForFunction(k => localStorage.getItem(k) === 'close', { timeout: 5000 }, keys.global);
		assert(await stored(keys.global) === 'close', `${keys.global} = close after closing`);

		// restore: stored value wins over markup default when the element is created
		await page.evaluate(() => localStorage.setItem('ln:tmp-restore:data-ln-toggle', 'open'));
		await make('tmp-restore', 'data-ln-persist', 'close');
		await page.waitForFunction(() => document.getElementById('tmp-restore').lnToggle, { timeout: 5000 });
		await expectState('tmp-restore', 'open', 'stored "open" restored over markup "close"');

		await page.evaluate(() => document.querySelectorAll('.tmp-toggle-test').forEach(n => n.remove()));
	});

	await check('Dynamic DOM: toggle initializes on elements added after load', async () => {
		await load();
		await page.evaluate(() => {
			const wrap = document.createElement('section');
			wrap.className = 'tmp-toggle-test';
			wrap.innerHTML = '<button data-ln-toggle-for="tmp-dyn">t</button><section id="tmp-dyn" data-ln-toggle></section>';
			document.body.appendChild(wrap);
		});
		await page.waitForFunction(() => document.getElementById('tmp-dyn').lnToggle, { timeout: 5000 });
		await click('[data-ln-toggle-for="tmp-dyn"]');
		await expectState('tmp-dyn', 'open', 'dynamic panel opens via trigger');
		await page.evaluate(() => document.querySelectorAll('.tmp-toggle-test').forEach(n => n.remove()));
	});

	await check('Common mistake: trigger for a panel with no instance / unknown id does nothing', async () => {
		await load();
		await page.evaluate(() => {
			const wrap = document.createElement('section');
			wrap.className = 'tmp-toggle-test';
			wrap.innerHTML = '<button id="tmp-orphan" data-ln-toggle-for="no-such-panel">t</button>';
			document.body.appendChild(wrap);
		});
		const before = await state(COLLAPSE);
		await click('#tmp-orphan');
		const afterState = await state(COLLAPSE);
		assert(JSON.stringify(before) === JSON.stringify(afterState), 'unknown-id trigger changes nothing');
		await page.evaluate(() => document.querySelectorAll('.tmp-toggle-test').forEach(n => n.remove()));
	});

	if (failures.length) {
		console.error('\nFailed sections:\n  - ' + failures.join('\n  - '));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
