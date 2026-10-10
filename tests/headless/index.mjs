import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/index.html is NOT a static link index. It is the admin shell (sidebar nav with
// 66 links, header with appearance/density pickers, toast host) wrapped around a live
// "Dashboard" page that mounts ln-modal, ln-tabs, ln-toggle, ln-progress, ln-toast,
// ln-upload, ln-ui-coordinator, ln-popover, ln-search, ln-nav and ln-persist.
//
// Every fact below is read from demo/admin/index.html (compiled from src/shell.html +
// src/pages/index.html), the inline <script> blocks at the bottom of it (mode / skin /
// theme / density pickers) and the components themselves (ln-toggle, ln-nav, ln-search,
// ln-persist, ln-popover, ln-modal, ln-tabs, ln-progress, ln-toast, ln-ui-coordinator).

const PAGE_URL = BASE_URL + 'index.html';
const NAV_LINK_COUNT = 66; // 1 Dashboard + 19 CSS Components + 46 JS Components
const NAV_SEARCH_KEY = 'ln:demo-nav:data-ln-search'; // ln:{data-ln-persist -> id demo-nav}:{attr}

const NAV_INPUT = 'input[data-ln-search-for="demo-nav"]';
const NAV_CLEAR = 'search button[data-ln-search-clear]';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/index.html', async ({ page }) => {

	let failures = 0;

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated so one failing section does not hide the others.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures++;
			console.error(`  section failed: ${err.message}`);
		}
	}

	// Waits until every component this page uses has an instance on its element.
	async function ready() {
		await page.waitForFunction(() => {
			const nav = document.getElementById('demo-nav');
			if (!nav || !nav.lnNav || !nav.lnSearch) return false;
			const input = document.querySelector('input[data-ln-search-for="demo-nav"]');
			if (!input || !input.lnSearchControl) return false;
			const sidebar = document.getElementById('demo-sidebar');
			if (!sidebar || !sidebar.lnToggle) return false;
			if (!document.getElementById('demo-theme-picker').lnPopover) return false;
			if (!document.getElementById('demo-density-picker').lnPopover) return false;
			if (!document.getElementById('demo-basic').lnModal || !document.getElementById('demo-form').lnModal) return false;
			if (!document.querySelector('[data-ln-tabs]').lnTabs) return false;
			if (!document.getElementById('server-status').lnToggle) return false;
			if (!document.querySelector('[data-ln-upload]').lnUpload) return false;
			const bars = document.querySelectorAll('[data-ln-progress]');
			return bars.length === 7 && Array.from(bars).every(b => b.getAttribute('role') === 'progressbar');
		}, { timeout: 10000 });
	}

	// Fresh, state-free page: pickers and the nav search persist to localStorage.
	// Storage is cleared on the open page, then a reload gives the clean state.
	let firstLoad = true;
	async function load() {
		if (firstLoad) {
			firstLoad = false;
			await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });
		}
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'domcontentloaded' });
		await ready();
	}

	const attr = (selector, name) => page.evaluate((s, n) => document.querySelector(s).getAttribute(n), selector, name);
	const rootAttr = name => page.evaluate(n => document.documentElement.getAttribute(n), name);
	const stored = key => page.evaluate(k => localStorage.getItem(k), key);

	// ─── Popover helpers (appearance + density pickers) ────────

	async function openPicker(triggerId, pickerId) {
		await page.click('#' + triggerId);
		await page.waitForFunction(id => document.getElementById(id).getAttribute('data-ln-popover') === 'open'
			&& document.getElementById(id).matches(':popover-open'), { timeout: 5000 }, pickerId);
	}

	async function waitPickerClosed(pickerId) {
		await page.waitForFunction(id => document.getElementById(id).getAttribute('data-ln-popover') !== 'open'
			&& !document.getElementById(id).matches(':popover-open'), { timeout: 5000 }, pickerId);
	}

	// Real click on an option button inside an open picker; the page script closes the picker.
	async function pick(triggerId, pickerId, optionSelector) {
		await openPicker(triggerId, pickerId);
		await page.click(optionSelector);
		await waitPickerClosed(pickerId);
	}

	const currentOf = selector => page.evaluate(s => Array.from(document.querySelectorAll(s))
		.filter(b => b.getAttribute('aria-current') === 'true')
		.map(b => b.textContent.trim()), selector);

	// ─── Nav search helpers ────────────────────────────────────

	const navState = () => page.evaluate(() => {
		const items = Array.from(document.querySelectorAll('#demo-nav li'));
		return {
			total: items.length,
			visible: items.filter(li => getComputedStyle(li).display !== 'none').map(li => li.textContent.trim()),
			hiddenAttr: items.filter(li => li.getAttribute('data-ln-search-hide') === 'true').length,
			input: document.querySelector('input[data-ln-search-for="demo-nav"]').value,
			attr: document.getElementById('demo-nav').getAttribute('data-ln-search')
		};
	});

	async function expectNavVisible(expected, label) {
		await page.waitForFunction(exp => {
			const vis = Array.from(document.querySelectorAll('#demo-nav li'))
				.filter(li => getComputedStyle(li).display !== 'none').map(li => li.textContent.trim());
			return vis.length === exp.length && vis.every((t, i) => t === exp[i]);
		}, { timeout: 5000 }, expected).catch(() => {});
		const s = await navState();
		assert(same(s.visible, expected), `${label}: expected [${expected.join(' | ')}], got ${s.visible.length} visible`);
	}

	async function typeNav(term) {
		await page.focus(NAV_INPUT);
		await page.keyboard.type(term);
	}

	// ─── Toast helpers ─────────────────────────────────────────

	const toasts = () => page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-toast] [data-ln-toast-item]'))
		.map(li => ({
			cls: Array.from(li.classList).filter(c => c !== 'ln-enter' && c !== 'ln-out'),
			title: li.querySelector('.title').textContent.trim(),
			body: li.querySelector('.body').textContent.trim(),
			bodyItems: Array.from(li.querySelectorAll('.body li')).map(x => x.textContent.trim())
		})));

	async function expectToastCount(n) {
		await page.waitForFunction(count => document.querySelectorAll('[data-ln-toast] [data-ln-toast-item]').length === count,
			{ timeout: 5000 }, n);
	}

	// ═══ 0. Page loads, shell mounts ═════════════════════════

	await guarded('Page loads and the shell mounts', async () => {
		await load();
		assert(await page.title() === 'ashlar-gui — Demo', 'document title is "ashlar-gui — Demo"');
		assert(await page.evaluate(() => document.querySelector('.app-header h1').textContent.trim()) === 'Dashboard', 'header h1 is "Dashboard"');
		const mounted = await page.evaluate(() => ({
			nav: !!document.getElementById('demo-nav').lnNav,
			search: !!document.getElementById('demo-nav').lnSearch,
			sidebar: !!document.getElementById('demo-sidebar').lnToggle,
			popovers: !!document.getElementById('demo-theme-picker').lnPopover && !!document.getElementById('demo-density-picker').lnPopover,
			links: document.querySelectorAll('#demo-nav a').length,
			active: Array.from(document.querySelectorAll('#demo-nav a.active')).map(a => a.getAttribute('href')),
			current: Array.from(document.querySelectorAll('#demo-nav a[aria-current="page"]')).map(a => a.getAttribute('href'))
		}));
		assert(mounted.nav && mounted.search && mounted.sidebar && mounted.popovers, 'ln-nav, ln-search, ln-toggle (sidebar) and both ln-popover pickers are mounted');
		assert(mounted.links === NAV_LINK_COUNT, `sidebar nav lists ${NAV_LINK_COUNT} links (got ${mounted.links})`);
		assert(same(mounted.active, ['index.html']) && same(mounted.current, ['index.html']),
			'ln-nav marks only the Dashboard link (index.html) as .active / aria-current="page"');
	});

	// ═══ 1. Every nav link points to an existing page ════════

	await guarded('Every nav href resolves to an existing demo page (HTTP 200)', async () => {
		await load();
		const results = await page.evaluate(async () => {
			const hrefs = Array.from(document.querySelectorAll('#demo-nav a')).map(a => a.getAttribute('href'));
			return Promise.all(hrefs.map(async href => {
				try {
					const res = await fetch(href, { method: 'GET' });
					return { href, status: res.status };
				} catch (err) {
					return { href, status: 'error: ' + err.message };
				}
			}));
		});
		assert(results.length === NAV_LINK_COUNT, `fetched ${NAV_LINK_COUNT} nav hrefs (got ${results.length})`);
		assert(new Set(results.map(r => r.href)).size === NAV_LINK_COUNT, 'all nav hrefs are unique');
		const bad = results.filter(r => r.status !== 200);
		assert(bad.length === 0, `all nav hrefs answer 200; non-200: ${bad.map(r => r.href + '=' + r.status).join(', ') || 'none'}`);
	});

	// ═══ 2. Sidebar toggle ═══════════════════════════════════

	await guarded('Sidebar toggle (ln-toggle on #demo-sidebar)', async () => {
		await load();
		const state = () => page.evaluate(() => {
			const el = document.getElementById('demo-sidebar');
			return {
				attr: el.getAttribute('data-ln-toggle'),
				open: el.classList.contains('open'),
				expanded: Array.from(document.querySelectorAll('[data-ln-toggle-for="demo-sidebar"]')).map(b => b.getAttribute('aria-expanded'))
			};
		});
		let s = await state();
		assert(s.attr === 'open' && s.open && same(s.expanded, ['true', 'true']), 'sidebar starts open (desktop), both triggers aria-expanded="true"');

		await page.evaluate(() => {
			window.__events = [];
			const el = document.getElementById('demo-sidebar');
			el.addEventListener('ln-toggle:close', () => window.__events.push('close'));
			el.addEventListener('ln-toggle:open', () => window.__events.push('open'));
		});
		await page.click('button[data-ln-toggle-action="close"][data-ln-toggle-for="demo-sidebar"]');
		await page.waitForFunction(() => document.getElementById('demo-sidebar').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		s = await state();
		assert(!s.open && same(s.expanded, ['false', 'false']), 'close action: .open removed, both triggers aria-expanded="false"');

		// .menu-toggle is the default (toggle) action; clicked via DOM because it is a mobile-only control.
		await page.evaluate(() => document.querySelector('button.menu-toggle[data-ln-toggle-for="demo-sidebar"]').click());
		await page.waitForFunction(() => document.getElementById('demo-sidebar').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });
		s = await state();
		assert(s.open && same(s.expanded, ['true', 'true']), 'menu toggle re-opens the sidebar');
		assert(same(await page.evaluate(() => window.__events), ['close', 'open']), 'ln-toggle:close then ln-toggle:open were dispatched');

		await page.evaluate(() => document.querySelector('button.menu-toggle[data-ln-toggle-for="demo-sidebar"]').click());
		await page.waitForFunction(() => document.getElementById('demo-sidebar').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		assert(true, 'menu toggle closes an open sidebar (toggle action)');
	});

	// ═══ 3. Appearance picker (mode / skin / theme) ══════════

	await guarded('Appearance picker: initial state', async () => {
		await load();
		assert(await rootAttr('data-mode') === null && await rootAttr('data-skin') === null && await rootAttr('data-theme') === null,
			'no data-mode / data-skin / data-theme on <html> without stored state');
		assert(same(await currentOf('[data-demo-mode]'), ['Light']), 'mode: "Light" is aria-current (fallback "light")');
		assert(same(await currentOf('[data-demo-skin]'), ['Solid']), 'skin: "Solid" is aria-current (fallback "default")');
		assert(same(await currentOf('[data-demo-theme]'), ['Default']), 'theme: "Default" is aria-current (fallback "default")');
		await openPicker('demo-theme-trigger', 'demo-theme-picker');
		assert(await attr('#demo-theme-trigger', 'aria-expanded') === 'true', 'theme trigger aria-expanded="true" while open');
		await page.keyboard.press('Escape');
		await waitPickerClosed('demo-theme-picker');
		assert(await attr('#demo-theme-trigger', 'aria-expanded') === 'false', 'Escape closes the picker, aria-expanded="false"');
	});

	await guarded('Appearance picker: mode', async () => {
		await load();
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-mode="dark"]');
		assert(await rootAttr('data-mode') === 'dark', '<html data-mode="dark">');
		assert(await stored('ln-demo-mode') === 'dark', 'localStorage "ln-demo-mode" = "dark"');
		assert(same(await currentOf('[data-demo-mode]'), ['Dark']), '"Dark" is aria-current');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-mode="light"]');
		assert(await rootAttr('data-mode') === 'light' && await stored('ln-demo-mode') === 'light', 'switching back sets data-mode="light" and stores it');
		assert(same(await currentOf('[data-demo-mode]'), ['Light']), '"Light" is aria-current again');
	});

	await guarded('Appearance picker: skin', async () => {
		await load();
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-skin="outline"]');
		assert(await rootAttr('data-skin') === 'outline' && await stored('ln-demo-skin') === 'outline', 'Outline: data-skin="outline" and stored');
		assert(same(await currentOf('[data-demo-skin]'), ['Outline']), '"Outline" is aria-current');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-skin="soft"]');
		assert(await rootAttr('data-skin') === 'soft', 'Soft: data-skin="soft"');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-skin="glass"]');
		assert(await rootAttr('data-skin') === 'glass', 'Glass: data-skin="glass"');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-skin="default"]');
		assert(await rootAttr('data-skin') === null && await stored('ln-demo-skin') === null, 'Solid ("default") removes data-skin and the stored key');
		assert(same(await currentOf('[data-demo-skin]'), ['Solid']), '"Solid" is aria-current again');
	});

	await guarded('Appearance picker: theme', async () => {
		await load();
		for (const name of ['ocean', 'sunset', 'midnight', 'glass']) {
			await pick('demo-theme-trigger', 'demo-theme-picker', `button[data-demo-theme="${name}"]`);
			assert(await rootAttr('data-theme') === name && await stored('ln-demo-theme') === name, `theme "${name}": data-theme set and stored`);
		}
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-theme="default"]');
		assert(await rootAttr('data-theme') === null && await stored('ln-demo-theme') === null, 'Default removes data-theme and the stored key');
		assert(same(await currentOf('[data-demo-theme]'), ['Default']), '"Default" is aria-current again');
	});

	await guarded('Appearance picker: state survives a reload (pre-paint bootstrap)', async () => {
		await load();
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-mode="dark"]');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-skin="soft"]');
		await pick('demo-theme-trigger', 'demo-theme-picker', 'button[data-demo-theme="ocean"]');
		await page.reload({ waitUntil: 'domcontentloaded' });
		await ready();
		assert(await rootAttr('data-mode') === 'dark' && await rootAttr('data-skin') === 'soft' && await rootAttr('data-theme') === 'ocean',
			'after reload <html> carries data-mode="dark" data-skin="soft" data-theme="ocean"');
		assert(same(await currentOf('[data-demo-mode]'), ['Dark']) && same(await currentOf('[data-demo-skin]'), ['Soft'])
			&& same(await currentOf('[data-demo-theme]'), ['Ocean']), 'the matching option buttons are aria-current');
	});

	// ═══ 4. Density picker ═══════════════════════════════════

	await guarded('Density picker', async () => {
		await load();
		assert(await rootAttr('data-density') === null, 'no data-density on <html> without stored state');
		assert(same(await currentOf('[data-demo-density]'), ['Compact']), '"Compact" is aria-current (fallback "compact")');
		await pick('demo-density-trigger', 'demo-density-picker', 'button[data-demo-density="spacious"]');
		assert(await rootAttr('data-density') === 'spacious' && await stored('ln-demo-density') === 'spacious', 'Spacious: data-density="spacious" and stored');
		assert(same(await currentOf('[data-demo-density]'), ['Spacious']), '"Spacious" is aria-current');
		await pick('demo-density-trigger', 'demo-density-picker', 'button[data-demo-density="comfortable"]');
		assert(await rootAttr('data-density') === 'comfortable', 'Comfortable: data-density="comfortable"');
		await page.reload({ waitUntil: 'domcontentloaded' });
		await ready();
		assert(await rootAttr('data-density') === 'comfortable', 'density survives a reload');
		assert(same(await currentOf('[data-demo-density]'), ['Comfortable']), '"Comfortable" is aria-current after reload');
		await openPicker('demo-density-trigger', 'demo-density-picker');
		await page.keyboard.press('Escape');
		await waitPickerClosed('demo-density-picker');
		assert(await attr('#demo-density-trigger', 'aria-expanded') === 'false', 'Escape closes the density picker');
	});

	// ═══ 5. Menu search ══════════════════════════════════════

	await guarded('Menu search filters the nav items', async () => {
		await load();
		let s = await navState();
		assert(s.total === NAV_LINK_COUNT && s.visible.length === NAV_LINK_COUNT && s.hiddenAttr === 0, 'all nav items visible initially');

		await typeNav('websocket');
		await expectNavVisible(['WebSocket Connector'], 'search "websocket"');
		s = await navState();
		assert(s.hiddenAttr === NAV_LINK_COUNT - 1, `${NAV_LINK_COUNT - 1} items carry data-ln-search-hide="true"`);
		assert(s.attr === 'websocket', 'nav data-ln-search holds the typed term');

		await page.click(NAV_CLEAR);
		await expectNavVisible(await page.evaluate(() => Array.from(document.querySelectorAll('#demo-nav li')).map(li => li.textContent.trim())), 'clear button restores every item');
		s = await navState();
		assert(s.input === '' && s.attr === '' && s.hiddenAttr === 0, 'input value, data-ln-search and hide attributes are all cleared');
		assert(await page.evaluate(() => document.activeElement === document.querySelector('input[data-ln-search-for="demo-nav"]')), 'clear button focuses the search input');

		await typeNav('WEBSOCKET');
		await expectNavVisible(['WebSocket Connector'], 'search is case-insensitive');
		await page.click(NAV_CLEAR);
		await typeNav('store usecase');
		await expectNavVisible(['Store — Usecase'], 'two tokens are AND-ed ("store usecase")');
		await page.click(NAV_CLEAR);
		await typeNav('table');
		await expectNavVisible(['Tables', 'Sortable', 'Table', 'Table — Filtering', 'Table — Data Sync'], 'substring "table" matches Tables, Sortable, Table, Table — Filtering, Table — Data Sync');
		await page.click(NAV_CLEAR);
		await typeNav('zzzz');
		await expectNavVisible([], 'no match hides every item');
	});

	await guarded('Menu search persists across a reload (data-ln-persist on #demo-nav)', async () => {
		await load();
		await typeNav('websocket');
		await expectNavVisible(['WebSocket Connector'], 'search "websocket"');
		const ok = await page.waitForFunction(k => localStorage.getItem(k) === 'websocket', { timeout: 5000 }, NAV_SEARCH_KEY)
			.then(() => true, () => false);
		assert(ok, `localStorage "${NAV_SEARCH_KEY}" holds "websocket"`);
		await page.reload({ waitUntil: 'domcontentloaded' });
		await ready();
		await expectNavVisible(['WebSocket Connector'], 'after reload the filter is re-applied');
		const s = await navState();
		assert(s.input === 'websocket' && s.attr === 'websocket', 'input value and data-ln-search are restored');
	});

	// ═══ 6. Modals ═══════════════════════════════════════════

	await guarded('Basic modal opens and closes', async () => {
		await load();
		await page.click('button[data-ln-modal-for="demo-basic"]');
		await page.waitForFunction(() => document.getElementById('demo-basic').getAttribute('data-ln-modal') === 'open'
			&& document.getElementById('demo-basic').open, { timeout: 5000 });
		assert(true, 'trigger opens #demo-basic (data-ln-modal="open", dialog.open)');
		assert(await page.evaluate(() => document.body.classList.contains('ln-modal-open')), 'body gets ln-modal-open');
		await page.click('#demo-basic header button[data-ln-modal-close]');
		await page.waitForFunction(() => !document.getElementById('demo-basic').open, { timeout: 5000 });
		assert(await attr('#demo-basic', 'data-ln-modal') === 'close', 'header close button closes it');

		await page.click('button[data-ln-modal-for="demo-basic"]');
		await page.waitForFunction(() => document.getElementById('demo-basic').open, { timeout: 5000 });
		await page.click('#demo-basic footer button[data-ln-modal-close]');
		await page.waitForFunction(() => !document.getElementById('demo-basic').open, { timeout: 5000 });
		assert(true, 'footer Close button closes it');

		await page.click('button[data-ln-modal-for="demo-basic"]');
		await page.waitForFunction(() => document.getElementById('demo-basic').open, { timeout: 5000 });
		await page.keyboard.press('Escape');
		await page.waitForFunction(() => !document.getElementById('demo-basic').open
			&& document.getElementById('demo-basic').getAttribute('data-ln-modal') === 'close', { timeout: 5000 });
		assert(await page.evaluate(() => !document.body.classList.contains('ln-modal-open')), 'Escape closes it and ln-modal-open is removed');
	});

	await guarded('Form modal: Save fires the success toast and closes the modal', async () => {
		await load();
		await page.click('button[data-ln-modal-for="demo-form"]');
		await page.waitForFunction(() => document.getElementById('demo-form').open, { timeout: 5000 });
		await page.type('#modal-name', 'Test User');
		await page.click('#demo-form footer button[type="submit"]');
		await expectToastCount(1);
		const t = await toasts();
		assert(t[0].title === 'User Saved' && t[0].body === 'User "Test User" was saved successfully.' && t[0].cls.includes('success'),
			'toast "User Saved" / User "Test User" was saved successfully. (success)');
		await page.waitForFunction(() => !document.getElementById('demo-form').open, { timeout: 5000 });
		assert(await attr('#demo-form', 'data-ln-modal') === 'close', 'ln-ui-coordinator closed the modal after ln-ajax:success');
		assert(await page.evaluate(() => location.hash === '' && location.pathname.endsWith('index.html')), 'submit was prevented (no navigation, no hash)');
	});

	await guarded('Form modal: Delete fires the success toast and closes the modal', async () => {
		await load();
		await page.click('button[data-ln-modal-for="demo-form"]');
		await page.waitForFunction(() => document.getElementById('demo-form').open, { timeout: 5000 });
		await page.click('#demo-form footer button.delete-action');
		await expectToastCount(1);
		const t = await toasts();
		assert(t[0].title === 'User Deleted' && t[0].body === 'User record was permanently removed.' && t[0].cls.includes('success'),
			'toast "User Deleted" / User record was permanently removed. (success)');
		await page.waitForFunction(() => !document.getElementById('demo-form').open, { timeout: 5000 });
		assert(true, 'modal closed');
	});

	// ═══ 7. Tabs ═════════════════════════════════════════════

	await guarded('Tabs switch panels (data-ln-tabs-default="overview")', async () => {
		await load();
		const tabState = () => page.evaluate(() => {
			const host = document.querySelector('[data-ln-tabs]');
			return {
				active: host.getAttribute('data-ln-tabs-active'),
				selected: Array.from(host.querySelectorAll('[data-ln-tab]')).filter(t => t.getAttribute('aria-selected') === 'true').map(t => t.getAttribute('data-ln-tab')),
				shown: Array.from(host.querySelectorAll('[data-ln-panel]')).filter(p => !p.hidden).map(p => p.getAttribute('data-ln-panel'))
			};
		});
		let s = await tabState();
		assert(s.active === 'overview' && same(s.selected, ['overview']) && same(s.shown, ['overview']), 'overview is active and the only visible panel');
		for (const key of ['users', 'settings', 'overview']) {
			await page.click(`[data-ln-tabs] [data-ln-tab="${key}"]`);
			await page.waitForFunction(k => document.querySelector('[data-ln-tabs]').getAttribute('data-ln-tabs-active') === k, { timeout: 5000 }, key);
			s = await tabState();
			assert(same(s.selected, [key]) && same(s.shown, [key]), `tab "${key}": aria-selected and the visible panel are "${key}" only`);
		}
	});

	// ═══ 8. Collapsible toggle ═══════════════════════════════

	await guarded('Server Status collapsible (ln-toggle)', async () => {
		await load();
		const st = () => page.evaluate(() => {
			const el = document.getElementById('server-status');
			return {
				attr: el.getAttribute('data-ln-toggle'),
				open: el.classList.contains('open'),
				expanded: document.querySelector('[data-ln-toggle-for="server-status"]').getAttribute('aria-expanded')
			};
		});
		let s = await st();
		assert(s.attr === 'open' && s.open && s.expanded === 'true', 'starts open, trigger aria-expanded="true"');
		await page.click('[data-ln-toggle-for="server-status"]');
		await page.waitForFunction(() => document.getElementById('server-status').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		s = await st();
		assert(!s.open && s.expanded === 'false', 'click closes it: .open removed, aria-expanded="false"');
		await page.click('[data-ln-toggle-for="server-status"]');
		await page.waitForFunction(() => document.getElementById('server-status').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });
		s = await st();
		assert(s.open && s.expanded === 'true', 'second click re-opens it');
	});

	// ═══ 9. Progress bars ════════════════════════════════════

	await guarded('Progress bars render value / max', async () => {
		await load();
		const bars = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-progress]')).map(b => ({
			value: b.getAttribute('data-ln-progress'),
			max: b.getAttribute('data-ln-progress-max'),
			now: b.getAttribute('aria-valuenow'),
			aMax: b.getAttribute('aria-valuemax'),
			aMin: b.getAttribute('aria-valuemin'),
			width: parseFloat(b.style.width)
		})));
		assert(bars.length === 7, '7 progress bars on the page (4 stats + CPU/RAM/Disk)');
		for (const b of bars) {
			const max = b.max === null ? 100 : Number(b.max);
			const pct = Number(b.value) / max * 100;
			assert(b.now === b.value && b.aMax === String(max) && b.aMin === '0' && Math.abs(b.width - pct) < 0.01,
				`value ${b.value}/${max}: aria-valuenow=${b.now}, aria-valuemax=${b.aMax}, width ${b.width.toFixed(2)}% (expected ${pct.toFixed(2)}%)`);
		}
	});

	// ═══ 10. Toasts ══════════════════════════════════════════

	await guarded('Header "Test Toast" button', async () => {
		await load();
		await page.click('.header-actions > button:last-of-type');
		await expectToastCount(1);
		const t = await toasts();
		assert(t[0].title === 'Info' && t[0].body === 'This is a demo notification.' && t[0].cls.includes('info'), 'info toast "Info" / This is a demo notification.');
	});

	await guarded('Toast demo buttons (success / error / warn / info / validation list)', async () => {
		await load();
		const buttons = await page.$$('section.section-card nav.demo-actions button.btn');
		const labels = await Promise.all(buttons.map(b => b.evaluate(el => el.textContent.trim())));
		const toastBtns = ['Success', 'Error', 'Warning', 'Info', 'Validation Errors'];
		for (const label of toastBtns) {
			const idx = labels.lastIndexOf(label);
			assert(idx !== -1, `demo button "${label}" exists`);
			await buttons[idx].click();
		}
		await expectToastCount(5);
		const t = await toasts();
		const expected = [
			['success', 'Success', 'The record has been saved.'],
			['error', 'Error', 'Something went wrong.'],
			['warn', 'Warning', 'Please check the data.'],
			['info', 'Info', 'A new version is available.']
		];
		expected.forEach(([type, title, body], i) => {
			assert(t[i].cls.includes(type) && t[i].title === title && t[i].body === body, `toast ${i + 1}: ${type} / "${title}" / "${body}"`);
		});
		assert(t[4].cls.includes('error') && t[4].title === 'Validation'
			&& same(t[4].bodyItems, ['Name is required', 'Email format is invalid', 'Password is too short']),
			'toast 5: error / "Validation" with the 3 messages as a <ul> list');

		await page.click('[data-ln-toast-item]:first-of-type [data-ln-toast-close]');
		await expectToastCount(4);
		assert(true, 'a toast close button dismisses that toast');
	});

	// ═══ 11. Upload (mount only) ═════════════════════════════

	await guarded('Upload zone is mounted', async () => {
		await load();
		const u = await page.evaluate(() => {
			const el = document.querySelector('[data-ln-upload]');
			return { mounted: !!el.lnUpload, url: el.getAttribute('data-ln-upload'), accept: el.getAttribute('data-ln-upload-accept') };
		});
		assert(u.mounted, 'ln-upload instance exists on the upload host');
		assert(u.url === '/api/files' && u.accept === 'pdf,doc,docx,jpg,png', 'host carries data-ln-upload="/api/files" and the accept list [source]');
	});

	if (failures > 0) {
		throw new Error(`${failures} section(s) failed`);
	}
});
