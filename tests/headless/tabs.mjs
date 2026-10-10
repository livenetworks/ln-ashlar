import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/tabs.html (live demos) and the
// components it mounts: components/ln-tabs/src/ln-tabs.js, tabs-model.js,
// components/ln-core/hash.js (hash codec) and components/ln-persist/src/ln-persist.js.
// Driven by the REAL components (no mock, no interception): the page needs no backend.
// Where page prose contradicts source (it says there is no :before-change), source is asserted and labelled [source].

const PAGE_URL = BASE_URL + 'tabs.html';

const PLAIN = 'section[data-ln-tabs]:not([id]):not([data-ln-persist])';
const USER = '#user-tabs';
const DOCS = '#docs-tabs';
const PROJECT = '#project-tabs';
const PERSIST = 'section[data-ln-persist="settings-tabs"]';
const ALL = [PLAIN, USER, DOCS, PROJECT, PERSIST];
const STORAGE_KEY = 'ln:settings-tabs:data-ln-tabs-active';
const LOG = '#tabs-event-log';

const PANELS = {
	[PLAIN]: ['overview', 'details', 'settings'],
	[USER]: ['info', 'settings', 'history'],
	[DOCS]: ['install', 'usage', 'api'],
	[PROJECT]: ['overview', 'members', 'info'],
	[PERSIST]: ['general', 'security', 'notifications']
};

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/tabs.html', async ({ page }) => {

	page.setDefaultTimeout(15000);
	page.setDefaultNavigationTimeout(30000);

	const failures = [];
	const started = Date.now();

	async function section(title, fn) {
		console.log(`\n--- ${title} --- (+${Date.now() - started}ms)`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  ✗ Section aborted: ${err.message}`);
		}
	}

	// ─── Page helpers ──────────────────────────────────────────

	async function ready() {
		await page.waitForFunction(selectors => selectors.every(sel => {
			const el = document.querySelector(sel);
			return el && el.lnTabs && el.getAttribute('data-ln-tabs-active');
		}), { timeout: 10000 }, ALL);
	}

	// Fresh, state-free page: ln-persist would otherwise restore a previous test's tab.
	// A unique query string forces a full navigation even when only the hash would differ
	// (a hash-only goto is a same-document navigation); going via about:blank stalls intermittently.
	let nonce = 0;
	async function load() {
		await page.goto(PAGE_URL + '?n=' + (++nonce), { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Loads PAGE_URL with a fragment as the very first paint (no localStorage touch).
	async function loadWithHash(hash) {
		await page.goto(PAGE_URL + '?n=' + (++nonce) + hash, { waitUntil: 'load' });
		await ready();
	}

	const snap = sel => page.evaluate(s => {
		const el = document.querySelector(s);
		const keyOf = t => {
			const explicit = (t.getAttribute('data-ln-tab') || '').toLowerCase().trim();
			if (explicit) return explicit;
			const href = t.getAttribute('href') || '';
			return href.slice(href.indexOf(':') + 1).toLowerCase();
		};
		return {
			active: el.getAttribute('data-ln-tabs-active'),
			tabs: Array.from(el.querySelectorAll('[data-ln-tab]')).map(t => ({
				key: keyOf(t),
				selected: t.getAttribute('aria-selected'),
				marked: t.hasAttribute('data-active')
			})),
			panels: Array.from(el.querySelectorAll('[data-ln-panel]')).map(p => ({
				key: p.getAttribute('data-ln-panel'),
				hidden: p.hidden,
				cls: p.classList.contains('hidden'),
				aria: p.getAttribute('aria-hidden'),
				shown: getComputedStyle(p).display !== 'none'
			}))
		};
	}, sel);

	// Waits for the wrapper's active key, then asserts the full synced DOM state.
	// `attr` is the raw wrapper attribute value when it differs from the resolved key
	// (an unknown key written from outside is kept verbatim; the DOM resolves to the default).
	async function expectActive(sel, key, label, attr = key) {
		await page.waitForFunction((s, k, a) => document.querySelector(s).getAttribute('data-ln-tabs-active') === a
			&& document.querySelector(s).lnTabs.activeKey === k,
			{ timeout: 5000 }, sel, key, attr).catch(() => {});
		const s = await snap(sel);
		assert(s.active === attr, `${label}: wrapper data-ln-tabs-active is "${attr}" (got "${s.active}")`);
		const shown = s.panels.filter(p => p.shown).map(p => p.key);
		assert(same(shown, [key]), `${label}: only panel "${key}" is visible (got [${shown.join(',')}])`);
		assert(s.panels.every(p => p.hidden === (p.key !== key) && p.cls === (p.key !== key)
			&& p.aria === (p.key === key ? 'false' : 'true')),
			`${label}: panels carry hidden + .hidden + aria-hidden consistently`);
		const marked = s.tabs.filter(t => t.marked).map(t => t.key);
		assert(same(marked, [key]), `${label}: only tab "${key}" has data-active (got [${marked.join(',')}])`);
		assert(s.tabs.every(t => t.selected === (t.key === key ? 'true' : 'false')),
			`${label}: aria-selected is true only on tab "${key}"`);
	}

	const tabSel = (sel, key) => `${sel} [data-ln-tab="${key}"], ${sel} a[data-ln-tab][href$=":${key}"]`;
	const clickTab = (sel, key) => page.click(tabSel(sel, key));
	const hash = () => page.evaluate(() => location.hash);
	const stored = () => page.evaluate(k => localStorage.getItem(k), STORAGE_KEY);

	// Records every ln-tabs:change on one wrapper into window.__changes.
	const recordChanges = sel => page.evaluate(s => {
		window.__changes = [];
		document.querySelector(s).addEventListener('ln-tabs:change', e => {
			window.__changes.push({
				key: e.detail.key,
				previousKey: e.detail.previousKey,
				tabKey: e.detail.tab && e.detail.tab.getAttribute('data-ln-tab'),
				panelKey: e.detail.panel && e.detail.panel.getAttribute('data-ln-panel'),
				targetIsWrapper: e.detail.target === e.currentTarget,
				bubbles: e.bubbles
			});
		});
	}, sel);

	const changes = () => page.evaluate(() => window.__changes);

	// ─── Sections ──────────────────────────────────────────────

	await section('Page structure', async () => {
		await load();
		for (const sel of ALL) {
			const s = await snap(sel);
			assert(same(s.panels.map(p => p.key), PANELS[sel]), `${sel}: panels are [${PANELS[sel].join(',')}]`);
			assert(s.tabs.length === 3, `${sel}: 3 tab triggers`);
		}
		const kinds = await page.evaluate(sels => sels.map(s =>
			Array.from(document.querySelector(s).querySelectorAll('[data-ln-tab]')).map(t => t.tagName).join(',')), ALL);
		assert(same(kinds, ['BUTTON,BUTTON,BUTTON', 'A,A,A', 'A,A,A', 'BUTTON,BUTTON,BUTTON', 'BUTTON,BUTTON,BUTTON']),
			'plain/project/persist use <button> triggers; user/docs use <a> triggers');
	});

	await section('Initial state: default keys', async () => {
		await load();
		await expectActive(PLAIN, 'overview', 'plain');
		await expectActive(USER, 'info', 'user-tabs');
		await expectActive(DOCS, 'install', 'docs-tabs');
		await expectActive(PROJECT, 'overview', 'project-tabs');
		await expectActive(PERSIST, 'general', 'persist');
		assert((await hash()) === '', 'Initial load writes nothing to the URL hash');
	});

	await section('Plain tabs: click switching, no hash, no persistence', async () => {
		await load();
		await recordChanges(PLAIN);
		await clickTab(PLAIN, 'details');
		await expectActive(PLAIN, 'details', 'after click Details');
		await clickTab(PLAIN, 'settings');
		await expectActive(PLAIN, 'settings', 'after click Settings');
		await clickTab(PLAIN, 'overview');
		await expectActive(PLAIN, 'overview', 'after click Overview');
		assert((await hash()) === '', 'URL hash stays empty for plain tabs');
		const keys = await page.evaluate(() => Object.keys(localStorage).filter(k => /^ln:(?!settings-tabs:)/.test(k)));
		assert(keys.length === 0, `Nothing written to ln: localStorage keys for plain tabs (got [${keys.join(',')}])`);
		const ch = await changes();
		assert(same(ch.map(c => c.key), ['details', 'settings', 'overview']), 'ln-tabs:change fired once per switch in order');
		assert(same(ch.map(c => c.previousKey), ['overview', 'details', 'settings']), 'ln-tabs:change detail.previousKey tracks the prior key');
		assert(ch.every(c => c.tabKey === c.key && c.panelKey === c.key && c.targetIsWrapper && c.bubbles),
			'ln-tabs:change detail carries key, tab, panel and target (wrapper); event bubbles');
		await clickTab(PLAIN, 'overview');
		assert((await changes()).length === 3, 'Clicking the already-active tab dispatches no further change event');
	});

	await section('Plain tabs: keyboard activation (Enter / Space on focused tab)', async () => {
		await load();
		await page.focus(tabSel(PLAIN, 'details'));
		await page.keyboard.press('Enter');
		await expectActive(PLAIN, 'details', 'Enter on Details');
		await page.focus(tabSel(PLAIN, 'settings'));
		await page.keyboard.press('Space');
		await expectActive(PLAIN, 'settings', 'Space on Settings');
	});

	await section('Plain tabs: reload resets to default', async () => {
		await load();
		await clickTab(PLAIN, 'settings');
		await expectActive(PLAIN, 'settings', 'before reload');
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectActive(PLAIN, 'overview', 'after reload');
	});

	await section('Live event log (#tabs-event-log)', async () => {
		await load();
		await clickTab(PLAIN, 'details');
		await page.waitForFunction(sel => /\(no id\) → details$/.test(document.querySelector(sel).textContent),
			{ timeout: 5000 }, LOG);
		let text = await page.$eval(LOG, el => el.textContent);
		let lines = text.split('\n');
		assert(/^\[\d\d:\d\d:\d\d\] \(no id\) → details$/.test(lines[lines.length - 1]), `Last log line is "[hh:mm:ss] (no id) → details" (got "${lines[lines.length - 1]}")`);
		await clickTab(USER, 'settings');
		await page.waitForFunction(sel => /user-tabs → settings$/.test(document.querySelector(sel).textContent),
			{ timeout: 5000 }, LOG);
		text = await page.$eval(LOG, el => el.textContent);
		lines = text.split('\n');
		assert(/^\[\d\d:\d\d:\d\d\] user-tabs → settings$/.test(lines[lines.length - 1]), 'Hash-mode switch is logged with the section id');
		await clickTab(PROJECT, 'members');
		await page.waitForFunction(sel => /project-tabs → members$/.test(document.querySelector(sel).textContent),
			{ timeout: 5000 }, LOG);
		for (const key of ['overview', 'details']) {
			await clickTab(PLAIN, key);
			await page.waitForFunction((sel, k) => new RegExp('\\(no id\\) → ' + k + '$').test(document.querySelector(sel).textContent),
				{ timeout: 5000 }, LOG, key);
		}
		await clickTab(PLAIN, 'settings');
		await page.waitForFunction(sel => /\(no id\) → settings$/.test(document.querySelector(sel).textContent),
			{ timeout: 5000 }, LOG);
		lines = (await page.$eval(LOG, el => el.textContent)).split('\n');
		assert(lines.length === 5, `Log keeps exactly the last 5 lines (got ${lines.length})`);
	});

	await section('Hash tabs (user-tabs): anchor click writes the hash', async () => {
		await load();
		await recordChanges(USER);
		await clickTab(USER, 'settings');
		await expectActive(USER, 'settings', 'after click Settings');
		assert((await hash()) === '#user-tabs:settings', `Hash is #user-tabs:settings (got "${await hash()}")`);
		await clickTab(USER, 'history');
		await expectActive(USER, 'history', 'after click History');
		assert((await hash()) === '#user-tabs:history', `Hash is #user-tabs:history (got "${await hash()}")`);
		const ch = await changes();
		assert(same(ch.map(c => c.key), ['settings', 'history']), 'One ln-tabs:change per hash-driven switch');
	});

	await section('Hash tabs: clicking the default tab with no hash writes the hash', async () => {
		await load();
		await clickTab(USER, 'info');
		await page.waitForFunction(() => location.hash === '#user-tabs:info', { timeout: 5000 });
		assert((await hash()) === '#user-tabs:info', 'Hash is #user-tabs:info');
		await expectActive(USER, 'info', 'info stays active');
	});

	await section('Hash tabs: back / forward navigation', async () => {
		await load();
		await clickTab(USER, 'settings');
		await expectActive(USER, 'settings', 'after Settings');
		await clickTab(USER, 'history');
		await expectActive(USER, 'history', 'after History');
		await page.goBack();
		await expectActive(USER, 'settings', 'Back -> Settings');
		assert((await hash()) === '#user-tabs:settings', 'Hash restored to #user-tabs:settings on Back');
		await page.goBack();
		await expectActive(USER, 'info', 'Back -> no hash -> default Info');
		await page.goForward();
		await expectActive(USER, 'settings', 'Forward -> Settings');
	});

	await section('Hash tabs: programmatic location.hash write', async () => {
		await load();
		await page.evaluate(() => { location.hash = 'user-tabs:history'; });
		await expectActive(USER, 'history', 'location.hash = user-tabs:history');
		await page.evaluate(() => { location.hash = 'user-tabs:bogus'; });
		await expectActive(USER, 'info', '[source] unknown hash key resolves to default tab (wrapper keeps the raw "bogus")', 'bogus');
	});

	await section('Hash tabs: deep link on first paint', async () => {
		await loadWithHash('#user-tabs:history&docs-tabs:api');
		await expectActive(USER, 'history', 'user-tabs from initial hash');
		await expectActive(DOCS, 'api', 'docs-tabs from initial hash');
		await expectActive(PROJECT, 'overview', 'project-tabs (buttons) ignores the hash');
		await loadWithHash('#docs-tabs:usage');
		await expectActive(DOCS, 'usage', 'docs-tabs alone from initial hash');
		await expectActive(USER, 'info', 'user-tabs falls back to default when its namespace is absent');
	});

	await section('Anchor triggers (docs-tabs) and foreign-segment preservation', async () => {
		await load();
		await clickTab(DOCS, 'usage');
		await expectActive(DOCS, 'usage', 'docs Usage');
		assert((await hash()) === '#docs-tabs:usage', `Hash is #docs-tabs:usage (got "${await hash()}")`);
		await clickTab(USER, 'settings');
		await expectActive(USER, 'settings', 'user Settings');
		const h = await hash();
		assert(h === '#docs-tabs:usage&user-tabs:settings', `Writing user-tabs preserves docs-tabs segment (got "${h}")`);
		await expectActive(DOCS, 'usage', 'docs-tabs unaffected by user-tabs write');
		await clickTab(DOCS, 'api');
		await expectActive(DOCS, 'api', 'docs API');
		const h2 = await hash();
		assert(h2 === '#docs-tabs:api&user-tabs:settings', `Rewriting docs-tabs preserves user-tabs segment (got "${h2}")`);
		await expectActive(USER, 'settings', 'user-tabs unaffected by docs-tabs write');
	});

	await section('Two independent sections share the key "info"', async () => {
		await load();
		await clickTab(PROJECT, 'info');
		await expectActive(PROJECT, 'info', 'project Info');
		await expectActive(USER, 'info', 'user-tabs default Info untouched');
		await clickTab(USER, 'settings');
		await expectActive(USER, 'settings', 'user Settings');
		await expectActive(PROJECT, 'info', 'project-tabs unaffected by user-tabs');
		await clickTab(PROJECT, 'members');
		await expectActive(PROJECT, 'members', 'project Members');
		assert(!(await hash()).includes('project-tabs'), 'Button-trigger group never touches the URL hash');
		const keys = await page.evaluate(() => Object.keys(localStorage).filter(k => /^ln:(?!settings-tabs:)/.test(k)));
		assert(keys.length === 0, `Button group without data-ln-persist writes no ln: localStorage key (got [${keys.join(',')}])`);
	});

	await section('Auto-focus: first focusable element of the activated panel', async () => {
		await load();
		await clickTab(USER, 'settings');
		await expectActive(USER, 'settings', 'user Settings');
		await page.waitForFunction(s => document.activeElement === document.querySelector(s + ' [data-ln-panel="settings"] select'),
			{ timeout: 5000 }, USER);
		assert(true, 'Focus moved to the <select> inside the Settings panel');
	});

	await section('Persisted tabs (settings-tabs): localStorage write and restore', async () => {
		await load();
		assert((await stored()) === null || (await stored()) === 'general', 'Nothing (or the default) stored on a clean load');
		await clickTab(PERSIST, 'security');
		await expectActive(PERSIST, 'security', 'persist Security');
		await page.waitForFunction(k => localStorage.getItem(k) === 'security', { timeout: 5000 }, STORAGE_KEY);
		assert((await stored()) === 'security', `localStorage ${STORAGE_KEY} is "security"`);
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectActive(PERSIST, 'security', 'restored after reload');
		await clickTab(PERSIST, 'notifications');
		await page.waitForFunction(k => localStorage.getItem(k) === 'notifications', { timeout: 5000 }, STORAGE_KEY);
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectActive(PERSIST, 'notifications', 'restored Notifications after reload');
		assert((await hash()) === '', 'Persist mode leaves the URL hash untouched');
	});

	await section('Persisted tabs: invalid stored key falls back to default', async () => {
		await load();
		await page.evaluate(k => localStorage.setItem(k, 'bogus'), STORAGE_KEY);
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectActive(PERSIST, 'general', 'stored "bogus" -> default General');
	});

	await section('Programmatic API: attribute write, select(), request-select', async () => {
		await load();
		await page.evaluate(s => document.querySelector(s).setAttribute('data-ln-tabs-active', 'details'), PLAIN);
		await expectActive(PLAIN, 'details', 'setAttribute data-ln-tabs-active');
		await page.evaluate(s => document.querySelector(s).lnTabs.select('settings'), PLAIN);
		await expectActive(PLAIN, 'settings', 'lnTabs.select("settings")');
		await page.evaluate(s => document.querySelector(s).dispatchEvent(
			new CustomEvent('ln-tabs:request-select', { detail: { key: 'overview' } })), PLAIN);
		await expectActive(PLAIN, 'overview', 'ln-tabs:request-select {key}');
		await page.evaluate(s => document.querySelector(s).setAttribute('data-ln-tabs-active', 'nope'), PLAIN);
		await expectActive(PLAIN, 'overview', '[source] unknown key keeps the current/default tab (wrapper keeps the raw "nope")', 'nope');
		await page.evaluate(s => document.querySelector(s).lnTabs.select('history'), USER);
		await page.waitForFunction(() => location.hash === '#user-tabs:history', { timeout: 5000 });
		await expectActive(USER, 'history', 'lnTabs.select on hash group goes through the hash');
	});

	await section('[source] ln-tabs:before-change is cancelable (page prose says there is none)', async () => {
		await load();
		await page.evaluate(s => {
			window.__cancel = true;
			window.__before = [];
			document.querySelector(s).addEventListener('ln-tabs:before-change', e => {
				window.__before.push({ key: e.detail.key, previousKey: e.detail.previousKey });
				if (window.__cancel) e.preventDefault();
			});
		}, PLAIN);
		await clickTab(PLAIN, 'details');
		await page.waitForFunction(() => window.__before.length === 1, { timeout: 5000 });
		const before = await page.evaluate(() => window.__before);
		assert(before[0].key === 'details' && before[0].previousKey === 'overview', '[source] before-change detail carries key and previousKey');
		await expectActive(PLAIN, 'overview', '[source] cancelled switch keeps Overview');
		await page.evaluate(() => { window.__cancel = false; });
		await clickTab(PLAIN, 'details');
		await expectActive(PLAIN, 'details', '[source] uncancelled switch proceeds');
	});

	// ─── Verdict ───────────────────────────────────────────────

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
