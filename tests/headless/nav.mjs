import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/nav.html (live demos: four
// <nav data-ln-nav="active"> inside article.demo-nav-example) and
// components/ln-nav/src/ln-nav.js (match rules, events, attribute sync).

const PAGE_URL = BASE_URL + 'nav.html';
const NAVS = 'article.demo-nav-example nav[data-ln-nav]';
const NAV_COUNT = 4;
// Nav order on the page: 0 top, 1 side, 2 default (prefix), 3 exact-only (data-ln-nav-exact).
const PREFIX = 2;
const EXACT = 3;

run('demo/admin/nav.html', async ({ page }) => {

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

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction((sel, count) => {
			const navs = document.querySelectorAll(sel);
			return navs.length === count && Array.from(navs).every(n => n.lnNav);
		}, { timeout: 10000 }, NAVS, NAV_COUNT);
	}

	// Per nav: for each link -> { text, active, current } (class "active" / aria-current).
	const navState = idx => page.evaluate((sel, i) => {
		const nav = document.querySelectorAll(sel)[i];
		return Array.from(nav.querySelectorAll('a')).map(a => ({
			text: a.textContent.trim(),
			cls: a.classList.contains('active'),
			current: a.getAttribute('aria-current')
		}));
	}, NAVS, idx);

	const activeTexts = async idx => (await navState(idx)).filter(l => l.cls).map(l => l.text);

	const pushPath = path => page.evaluate(p => { history.pushState({}, '', p); }, path);

	async function expectActive(idx, expected, label) {
		await page.waitForFunction((sel, i, exp) => {
			const nav = document.querySelectorAll(sel)[i];
			const act = Array.from(nav.querySelectorAll('a.active')).map(a => a.textContent.trim());
			return act.length === exp.length && act.every((t, k) => t === exp[k]);
		}, { timeout: 5000 }, NAVS, idx, expected).catch(() => {});
		const actual = await activeTexts(idx);
		assert(JSON.stringify(actual) === JSON.stringify(expected),
			`${label}: expected [${expected.join(',')}], got [${actual.join(',')}]`);
	}

	// ─── 1. Initial highlight ──────────────────────────────────

	await guarded('Initial highlight on nav.html', async () => {
		await load();
		for (let i = 0; i < NAV_COUNT; i++) {
			const links = await navState(i);
			assert(links.length === 3, `nav ${i} has 3 links`);
			await expectActive(i, ['Nav (current)'], `nav ${i} active link`);
			assert(links[0].current === 'page', `nav ${i} active link has aria-current="page"`);
			assert(links.slice(1).every(l => !l.cls && l.current === null),
				`nav ${i} inactive links have no class and no aria-current`);
		}
	});

	// ─── 2. pushState: prefix vs exact matching ────────────────

	await guarded('pushState: parent (prefix) match vs data-ln-nav-exact', async () => {
		await load();
		await pushPath('/users');
		await expectActive(PREFIX, ['Users'], 'prefix nav on /users (exact path)');
		await expectActive(EXACT, ['Users'], 'exact nav on /users (exact path)');

		await pushPath('/users/42');
		await expectActive(PREFIX, ['Users'], 'prefix nav on /users/42 activates /users');
		await expectActive(EXACT, [], 'exact nav on /users/42 does NOT activate /users');
		const links = await navState(PREFIX);
		assert(links[1].current === 'page' && links[0].current === null && links[2].current === null,
			'aria-current="page" moved to Users, removed from the others');

		// Unrelated sibling-prefix path must not match (match requires href + "/").
		await pushPath('/usersX');
		await expectActive(PREFIX, [], 'prefix nav on /usersX activates nothing');
	});

	await guarded('Trailing slash is normalized', async () => {
		await load();
		await pushPath('/users/');
		await expectActive(PREFIX, ['Users'], 'prefix nav: /users/ matches href /users');
		await expectActive(EXACT, ['Users'], 'exact nav: /users/ matches href /users');
	});

	await guarded('Links in other navs follow the same path (multiple navigations)', async () => {
		await load();
		await pushPath('/settings/profile');
		await expectActive(1, ['Profile'], 'side nav activates Profile on /settings/profile');
		await expectActive(0, [], 'top nav activates nothing on /settings/profile');
		await pushPath('/reports');
		await expectActive(0, ['Reports'], 'top nav activates Reports on /reports');
		await expectActive(1, [], 'side nav clears Profile on /reports');
	});

	// ─── 3. popstate ───────────────────────────────────────────

	await guarded('popstate (browser back/forward)', async () => {
		await load();
		await pushPath('/users/42');
		await expectActive(PREFIX, ['Users'], 'after pushState /users/42');
		await page.evaluate(() => history.back());
		await expectActive(PREFIX, ['Nav (current)'], 'after back: nav.html active again');
		await page.evaluate(() => history.forward());
		await expectActive(PREFIX, ['Users'], 'after forward: Users active again');
	});

	// ─── 4. Events ─────────────────────────────────────────────

	await guarded('ln-nav:update event reports active links', async () => {
		await load();
		await page.evaluate(sel => {
			const nav = document.querySelectorAll(sel)[2];
			window.__navUpdates = [];
			nav.addEventListener('ln-nav:update', e => {
				window.__navUpdates.push(Array.from(e.detail.activeLinks).map(a => a.textContent.trim()));
			});
		}, NAVS);
		await pushPath('/users/42');
		await page.waitForFunction(() => window.__navUpdates.length > 0, { timeout: 5000 });
		const last = await page.evaluate(() => window.__navUpdates[window.__navUpdates.length - 1]);
		assert(JSON.stringify(last) === JSON.stringify(['Users']),
			`ln-nav:update detail.activeLinks = [Users], got [${last.join(',')}]`);
	});

	await guarded('ln-nav:before-update is cancelable', async () => {
		await load();
		await page.evaluate(sel => {
			const nav = document.querySelectorAll(sel)[2];
			nav.addEventListener('ln-nav:before-update', e => e.preventDefault());
		}, NAVS);
		await pushPath('/users/42');
		await page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
		await expectActive(PREFIX, ['Nav (current)'], 'prevented update leaves highlighting unchanged');
		await expectActive(EXACT, [], 'un-prevented exact nav still updated (nav.html no longer matches)');
	});

	// ─── 5. Dynamically added links ────────────────────────────

	await guarded('Dynamically added link is processed (MutationObserver)', async () => {
		await load();
		await pushPath('/dynamic/page');
		await page.evaluate((sel, i) => {
			const nav = document.querySelectorAll(sel)[i];
			const a = document.createElement('a');
			a.setAttribute('href', '/dynamic');
			a.textContent = 'Dynamic';
			nav.appendChild(a);
		}, NAVS, PREFIX);
		await expectActive(PREFIX, ['Dynamic'], 'added link /dynamic is highlighted on /dynamic/page');
		const links = await navState(PREFIX);
		assert(links[links.length - 1].current === 'page', 'added link has aria-current="page"');
	});

	// ─── 6. Attribute changes ──────────────────────────────────

	await guarded('Changing data-ln-nav value swaps the active class', async () => {
		await load();
		await page.evaluate(sel => {
			document.querySelectorAll(sel)[0].setAttribute('data-ln-nav', 'is-here');
		}, NAVS);
		await page.waitForFunction(sel => {
			const a = document.querySelectorAll(sel)[0].querySelector('a');
			return a.classList.contains('is-here') && !a.classList.contains('active');
		}, { timeout: 5000 }, NAVS);
		assert(true, 'top nav link: class "active" replaced by "is-here"');
		const aria = await page.evaluate(sel => document.querySelectorAll(sel)[0].querySelector('a').getAttribute('aria-current'), NAVS);
		assert(aria === 'page', 'aria-current="page" kept after class swap');
	});

	await guarded('Toggling data-ln-nav-exact re-evaluates matching', async () => {
		await load();
		await pushPath('/users/42');
		await expectActive(PREFIX, ['Users'], 'prefix nav active on /users/42');
		await page.evaluate(sel => {
			document.querySelectorAll(sel)[2].setAttribute('data-ln-nav-exact', '');
		}, NAVS);
		await expectActive(PREFIX, [], 'after adding data-ln-nav-exact: Users deactivated');
		await page.evaluate(sel => {
			document.querySelectorAll(sel)[2].removeAttribute('data-ln-nav-exact');
		}, NAVS);
		await expectActive(PREFIX, ['Users'], 'after removing data-ln-nav-exact: Users active again');
	});

	if (failures > 0) {
		throw new Error(`${failures} section(s) failed`);
	}
});
