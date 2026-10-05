import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/router.html (live playground),
// components/ln-router/src/ln-router.js + router-model.js, ln-core shouldInterceptLink,
// and demo/admin/tpl/router-profile.html (the ln-include'd /profile view).

const PAGE_URL = BASE_URL + 'router.html';
const OUTLET = '[data-ln-outlet]';

run('demo/admin/router.html', async ({ page }) => {

	// ─── Helpers ───────────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	const failures = [];
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  !! section failed: ${err.message}`);
		}
	}

	// Fresh page; collects ln-router:navigated events from here on.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			if (!window.lnRouter || !window.lnRouter.current()) return false;
			if (!document.querySelector('#router-sidebar h5')) return false;
			const tmpl = document.querySelector('template[data-ln-route="/profile"]:not([data-ln-route-target])');
			return !!(tmpl && tmpl.content.querySelector('h4'));
		}, { timeout: 10000 });
		await page.evaluate(() => {
			window.__nav = [];
			window.__notFound = 0;
			document.addEventListener('ln-router:navigated', e => {
				window.__nav.push({ region: e.detail.region, path: e.detail.path, pattern: e.detail.route.pattern });
			});
			document.addEventListener('ln-router:not-found', () => { window.__notFound++; });
		});
	}

	const clickLink = href => page.evaluate(h => {
		document.querySelector('a[href="' + h + '"]:not([download]):not([target])').click();
	}, href);

	const clickBtn = id => page.evaluate(i => document.getElementById(i).click(), id);

	const waitPath = (path, timeout = 5000) => page.waitForFunction(
		p => window.lnRouter.current() && window.lnRouter.current().path === p, { timeout }, path);

	const outletText = () => page.evaluate(sel => document.querySelector(sel).textContent.replace(/\s+/g, ' ').trim(), OUTLET);
	const regionText = id => page.evaluate(i => document.getElementById(i).textContent.replace(/\s+/g, ' ').trim(), id);
	const regionChildren = id => page.evaluate(i => document.getElementById(i).children.length, id);
	const urlParts = () => page.evaluate(() => ({ path: location.pathname, search: location.search }));
	const logText = () => page.evaluate(() => document.getElementById('diagnostics-log').textContent);

	// ─── Sections ──────────────────────────────────────────────

	await check('Boot: router API and initial hydration pass', async () => {
		await load();
		const api = await page.evaluate(() => ({
			navigate: typeof window.lnRouter.navigate,
			replace: typeof window.lnRouter.replace,
			base: window.lnRouter.base(),
			toUrl: window.lnRouter.toUrl('/x'),
			current: window.lnRouter.current().route.pattern,
			path: window.lnRouter.current().path,
			loc: location.pathname.replace(/\/+$/, '') || '/'
		}));
		assert(api.navigate === 'function' && api.replace === 'function', 'lnRouter.navigate and lnRouter.replace exist');
		assert(api.base === '', 'no base configured: router.base() is ""');
		assert(api.toUrl === '/x', 'no base: router.toUrl("/x") is "/x"');
		assert(api.path === api.loc, `boot path is the page URL path (${api.loc})`);
		assert(api.current === '*', 'boot matches the primary catch-all route "*" (page URL matches no other route)');

		// Source: hydrate guard reads the OUTLET element, the page puts data-ln-router-hydrate on an inner div.
		const outlet = await outletText();
		assert(outlet.includes('404 - Page Not Found'), 'primary outlet shows the catch-all view at boot');
		assert(!outlet.includes('SSR Server-Rendered View'), 'SSR placeholder inside the outlet is replaced (hydrate attr is not on the outlet itself)');

		assert((await regionText('router-sidebar')).includes('Sidebar — Default'), 'sidebar renders its "*" template at boot');
		assert((await regionChildren('detail-pane')) === 0, 'detail-pane has no matching route at boot and is cleared (not keep)');
		const log = await logText();
		assert(log.includes('ln-router:navigated — region: "__primary__"'), 'diagnostics log shows boot navigated event for the primary region');
		assert(log.includes('ln-router:navigated — region: "router-sidebar"'), 'diagnostics log shows boot navigated event for router-sidebar');
	});

	await check('Link interception: static routes, title, focus, history', async () => {
		await load();
		const histBefore = await page.evaluate(() => history.length);

		await clickLink('/');
		await waitPath('/');
		assert((await outletText()).includes('Dashboard View'), '/ renders the Dashboard view');
		assert((await urlParts()).path === '/', 'URL pathname pushed to "/"');
		assert(await page.evaluate(histBefore => history.length === histBefore + 1, histBefore), 'link click pushes one history entry');
		assert(await page.evaluate(sel => {
			const h = document.querySelector(sel + ' h4');
			return document.activeElement === h && h.getAttribute('tabindex') === '-1';
		}, OUTLET), 'first heading of the new view receives focus with tabindex -1');
		assert((await regionText('router-sidebar')).includes('Sidebar — Default'), 'sidebar template unchanged (same keep template stays mounted)');

		await clickLink('/profile');
		await waitPath('/profile');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('User Profile View'), { timeout: 5000 }, OUTLET);
		assert((await outletText()).includes('This is the profile page at static route /profile.'), '/profile renders the ln-include d external view');
		assert(await page.evaluate(() => document.title) === 'Profile — ln-router', 'document.title set from data-ln-route-title');
		assert((await regionText('router-sidebar')).includes('Sidebar — Profile Mode'), 'sidebar swaps to the /profile template (different keep template)');
	});

	await check('Route params, query params, specificity', async () => {
		await load();
		await clickLink('/users/42');
		await waitPath('/users/42');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('Displaying user with ID: 42'), { timeout: 5000 }, OUTLET);
		assert(await page.evaluate(sel => document.querySelector(sel + ' strong').textContent, OUTLET) === '42', '{{id}} filled with param 42 in the primary view');
		assert(await page.evaluate(sel => document.querySelector(sel + ' #user-query-log').textContent, OUTLET) === '{}', 'no query string: query log is "{}"');
		assert(await page.evaluate(() => document.title) === 'User Details', 'title from /users/:id route');
		assert((await regionText('router-sidebar')).includes('Sidebar — User 42'), 'sidebar /users/:id template filled with id 42');
		assert((await regionChildren('detail-pane')) === 0, 'detail-pane stays empty for /users/:id');

		await clickLink('/users/99?tab=settings&theme=dark');
		await waitPath('/users/99');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('Displaying user with ID: 99'), { timeout: 5000 }, OUTLET);
		assert(await page.evaluate(sel => document.querySelector(sel + ' #user-query-log').textContent, OUTLET) === '{"tab":"settings","theme":"dark"}', 'query params parsed into detail.query');
		const u = await urlParts();
		assert(u.path === '/users/99' && u.search === '?tab=settings&theme=dark', 'URL keeps the query string');
	});

	await check('Wildcard 404 route', async () => {
		await load();
		await clickLink('/non-existent-page');
		await waitPath('/non-existent-page');
		assert((await outletText()).includes('404 - Page Not Found'), 'unknown path renders the "*" view');
		assert((await urlParts()).path === '/non-existent-page', 'URL pushed to the unknown path');
		assert((await regionText('router-sidebar')).includes('Sidebar — Default'), 'sidebar renders its "*" template');
		assert(await page.evaluate(() => window.__notFound) === 0, 'ln-router:not-found is not fired when a "*" route exists in the primary region');
	});

	await check('Multi-region: sidebar survives param change, swaps on template change', async () => {
		await load();
		await clickLink('/users/42');
		await waitPath('/users/42');
		await page.waitForSelector('#sidebar-input');
		await page.evaluate(() => { window.__sb = document.getElementById('sidebar-input'); });
		await page.focus('#sidebar-input');
		await page.keyboard.type('hello');
		await page.evaluate(() => { window.__nav.length = 0; });

		await clickLink('/users/43');
		await waitPath('/users/43');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('Displaying user with ID: 43'), { timeout: 5000 }, OUTLET);
		const kept = await page.evaluate(() => ({
			same: document.getElementById('sidebar-input') === window.__sb,
			value: document.getElementById('sidebar-input').value,
			regions: window.__nav.map(n => n.region)
		}));
		assert(kept.same, 'sidebar input element is the same node after /users/42 -> /users/43');
		assert(kept.value === 'hello', 'typed sidebar input value survives the param change');
		assert(kept.regions.length === 1 && kept.regions[0] === '__primary__', 'only the primary region fires navigated on param-only change');

		await clickLink('/profile');
		await waitPath('/profile');
		await page.waitForFunction(() => document.getElementById('router-sidebar').textContent.includes('Profile Mode'), { timeout: 5000 });
		assert(await page.evaluate(() => document.getElementById('sidebar-input') === null), 'sidebar input is gone after the sidebar template swaps');
	});

	await check('Auxiliary target region: detail-pane (/users/:id/logs)', async () => {
		await load();
		await clickLink('/users/42/logs');
		await waitPath('/users/42/logs');
		await page.waitForFunction(() => document.getElementById('detail-pane').children.length > 0, { timeout: 5000 });
		assert((await outletText()).includes('User #42 — Log View (Primary)'), 'primary outlet shows the log context view with id filled');
		assert(await page.evaluate(() => document.querySelectorAll('#detail-pane li').length) === 3, 'detail-pane renders the three log entries');
		assert((await regionText('detail-pane')).includes('User logged in at 10:00 AM'), 'detail-pane log entry text rendered');
		assert((await regionText('router-sidebar')).includes('Sidebar — Default'), 'sidebar falls to "*" for /users/:id/logs (3 segments do not match /users/:id)');
		assert(await page.evaluate(() => window.__nav.some(n => n.region === 'detail-pane')), 'navigated event fired for region "detail-pane"');

		await clickLink('/');
		await waitPath('/');
		assert((await regionChildren('detail-pane')) === 0, 'detail-pane cleared when the next URL has no route for it');
	});

	// The page coordinator only fills {{id}} for primary and router-sidebar regions,
	// so the detail-pane heading keeps the literal placeholder (page bug candidate).
	await check('Auxiliary region {{id}} is filled (intended by the demo copy "Logs for User #42")', async () => {
		await load();
		await clickLink('/users/42/logs');
		await waitPath('/users/42/logs');
		await page.waitForFunction(() => document.getElementById('detail-pane').children.length > 0, { timeout: 5000 });
		const heading = await page.evaluate(() => document.querySelector('#detail-pane h5').textContent.trim());
		assert(heading.includes('Logs for User #42'), `detail-pane heading is "Logs for User #42", got "${heading}"`);
	});

	await check('Programmatic API: navigate and replace', async () => {
		await load();
		await clickBtn('btn-nav-user');
		await waitPath('/users/88');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('Displaying user with ID: 88'), { timeout: 5000 }, OUTLET);
		assert(await page.evaluate(sel => document.querySelector(sel + ' #user-query-log').textContent, OUTLET) === '{"src":"api"}', 'navigate("/users/88?src=api") passes query');
		const u = await urlParts();
		assert(u.path === '/users/88' && u.search === '?src=api', 'URL is /users/88?src=api');

		await clickBtn('btn-nav-dashboard');
		await waitPath('/');
		assert((await outletText()).includes('Dashboard View'), 'navigate("/") renders the dashboard');

		const histBefore = await page.evaluate(() => history.length);
		await clickBtn('btn-replace');
		await waitPath('/profile');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('User Profile View'), { timeout: 5000 }, OUTLET);
		assert(await page.evaluate(h => history.length === h, histBefore), 'replace("/profile") does not add a history entry');
		assert((await urlParts()).path === '/profile', 'URL replaced with /profile');
	});

	await check('popstate: browser back re-renders the previous route', async () => {
		await load();
		await clickLink('/profile');
		await waitPath('/profile');
		await clickLink('/users/42');
		await waitPath('/users/42');
		await page.evaluate(() => history.back());
		await waitPath('/profile');
		await page.waitForFunction(sel => document.querySelector(sel).textContent.includes('User Profile View'), { timeout: 5000 }, OUTLET);
		assert((await urlParts()).path === '/profile', 'back restores the /profile URL');
		assert((await regionText('router-sidebar')).includes('Profile Mode'), 'back restores the profile sidebar');
	});

	await check('Link interception safety guards', async () => {
		await load();
		const startPath = await page.evaluate(() => window.lnRouter.current().path);
		// Dispatch a cancelable click; the router's document listener runs first, a window listener
		// records whether it called preventDefault, then always cancels so nothing really navigates.
		const probe = (selector, init) => page.evaluate((sel, opts) => new Promise(resolve => {
			const a = document.querySelector(sel);
			const onClick = e => {
				window.removeEventListener('click', onClick);
				const prevented = e.defaultPrevented;
				e.preventDefault();
				resolve(prevented);
			};
			window.addEventListener('click', onClick);
			a.dispatchEvent(new MouseEvent('click', Object.assign({ bubbles: true, cancelable: true, button: 0 }, opts)));
		}), selector, init || {});

		assert(await probe('a[href="/profile"]:not([download])') === true, 'control: plain same-origin route link is intercepted');
		await waitPath('/profile');
		await load();
		assert(await probe('a[href="https://google.com"][target="_blank"]') === false, 'target="_blank" external link is not intercepted');
		assert(await probe('a[href="/profile"][download]') === false, 'download link is not intercepted');
		assert(await probe('a[href="#test-anchor"]') === false, 'hash-only link is not intercepted');
		assert(await probe('a[href="/profile"]:not([download])', { ctrlKey: true }) === false, 'ctrl-click is not intercepted');
		assert(await page.evaluate(() => window.lnRouter.current().path) === startPath, 'no guarded link changed the router path');
	});

	await check('before-navigate cancellation', async () => {
		await load();
		await clickLink('/users/42');
		await waitPath('/users/42');
		const before = await urlParts();

		await page.evaluate(() => { document.getElementById('block-navigation').click(); });
		await clickLink('/profile');
		await page.waitForFunction(() => document.getElementById('diagnostics-log').textContent.includes('Navigation BLOCKED via preventDefault()'), { timeout: 5000 });
		const log = await logText();
		assert(log.includes('ln-router:before-navigate from "/users/42" to "/profile"'), 'before-navigate detail carries from "/users/42" and to "/profile"');
		assert(await page.evaluate(() => window.lnRouter.current().path) === '/users/42', 'router state unchanged when blocked');
		assert((await urlParts()).path === before.path, 'URL unchanged when blocked');
		assert((await outletText()).includes('Displaying user with ID: 42'), 'outlet content unchanged when blocked');
		await page.waitForFunction(() => {
			const t = document.querySelector('ul[data-ln-toast]');
			return !!t && t.textContent.includes('Blocked!');
		}, { timeout: 5000 });
		assert(true, 'error toast "Blocked!" is shown');

		await page.evaluate(() => { document.getElementById('block-navigation').click(); });
		await clickLink('/profile');
		await waitPath('/profile');
		assert((await urlParts()).path === '/profile', 'navigation proceeds once the block checkbox is cleared');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
