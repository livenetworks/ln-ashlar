import { run, assert } from './_harness.mjs';

// demo/corporate/index.html — HAS LIVE COMPONENTS. Mounted by dist/ln-ashlar.iife.js:
//   ln-popover (theme picker), ln-number (4 metrics), ln-date (3 <time>), ln-modal + ln-form
//   (advisory dialog), ln-toggle / ln-icon markup. Plus one inline <script> in the page that
//   wires the mode toggle, theme/skin presets and the insights filter buttons.
// All expectations are read from the page markup, its inline script, and the component
// sources (ln-modal, ln-toggle, ln-number, ln-date, ln-popover) and theme/config/_theme.scss.
//
// URL: http://localhost/ln-ashlar/demo/... answers 302 for this page and its assets, so the page
// is loaded from the vhost whose docroot is demo/: http://ln-ashlar.test/ (the real deploy layout).
// Icons come from the Tabler CDN at runtime (ln-icon.js), so icon rendering is not asserted.

const PAGE_URL = new URL('http://ln-ashlar.test/corporate/index.html').href;

// [source] _theme.scss: --brand-primary per preset, dark polarity (page root is data-mode="dark").
const BRAND_DARK = {
	ocean: '190 80% 46%',
	midnight: '265 70% 75%',
	sunset: '10 80% 69%',
	aurora: '158 80% 55%'
};
const BRAND_OCEAN_LIGHT = '190 80% 24%';

// [source] markup: data-ln-number values, <html lang="en"> locale, no decimals attribute.
const NUMBERS = ['48.5', '28', '99.2', '32'];
// [source] markup <time data-ln-date="long|medium"> with datetime, en locale (Intl dateStyle).
const DATES = [
	{ datetime: '2026-09-18', text: 'September 18, 2026' },
	{ datetime: '2026-09-12', text: 'Sep 12, 2026' },
	{ datetime: '2026-09-04', text: 'Sep 4, 2026' },
	{ datetime: '2026-08-28', text: 'Aug 28, 2026' }
];

run('demo/corporate/index.html', async ({ page }) => {

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	const attr = (selector, name) => page.evaluate((s, n) => document.querySelector(s)?.getAttribute(n), selector, name);
	const rootAttr = name => page.evaluate(n => document.documentElement.getAttribute(n), name);
	const rootBrand = () => page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim());
	const count = selector => page.evaluate(s => document.querySelectorAll(s).length, selector);

	await section('Load and mount', async () => {
		const loaded = [];
		page.on('response', r => loaded.push(r));
		const res = await page.goto(PAGE_URL, { waitUntil: 'load' });
		assert(res.status() === 200, `page responds 200 at ${PAGE_URL}`);
		assert((await page.title()) === 'Ashlar Global Partners — Strategic Advisory & Capital Markets', 'document title matches source');
		for (const tail of ['/dist/ln-ashlar.iife.js', '/dist/ln-ashlar-landing.css', '/dist/ln-ashlar-dev.css', '/corporate/corporate.css']) {
			assert(loaded.some(r => r.url().endsWith(tail) && r.status() === 200), `${tail} loaded with 200`);
		}
		await page.waitForFunction(() => {
			const pop = document.getElementById('corporate-theme-popover');
			const dlg = document.getElementById('modal-advisory');
			const nums = Array.from(document.querySelectorAll('[data-ln-number]'));
			const times = Array.from(document.querySelectorAll('time[data-ln-date]'));
			return pop && pop.lnPopover && dlg && dlg.lnModal
				&& nums.length === 4 && nums.every(n => n.lnNumber)
				&& times.length === 4 && times.every(t => t.lnDate);
		}, { timeout: 10000 });
		assert(true, 'ln-popover, ln-modal, 4x ln-number, 4x ln-date mounted');
		assert(await rootAttr('data-mode') === 'dark' && await rootAttr('data-theme') === 'ocean' && await rootAttr('data-skin') === 'default',
			'<html> starts data-mode=dark data-theme=ocean data-skin=default');
	});

	await section('Structure', async () => {
		const sections = await page.evaluate(() => Array.from(document.querySelectorAll('main > section')).map(s => s.id));
		assert(sections.join() === 'hero,about,capabilities,presence,insights,leadership,advisory-cta', `main sections in order, got ${sections.join()}`);
		assert(await count('ul.nav-links > li') === 5, '5 nav links');
		assert(await count('ul.capabilities-grid > li') === 4, '4 capability cards');
		assert(await count('ul.metrics-row > li') === 4, '4 metrics');
		assert(await count('ul.articles-grid > li > article') === 3, '3 grid articles');
		assert(await count('.featured-article > article') === 1, '1 featured article');
		assert(await count('ul.leadership-grid > li') === 2, '2 leaders');
		assert(await count('ul.pillars-list > li') === 4, '4 pillars');
		assert(await count('.offices-bar ul > li') === 8, '8 office hubs');
		assert(await count('.insights-filter button') === 5, '5 insight filter buttons');
		assert(await count('footer.corporate-footer .footer-col') === 3, '3 footer columns');
	});

	await section('Links and assets resolve', async () => {
		const hashes = await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]'))
			.map(a => a.getAttribute('href')).filter(h => h.length > 1));
		const unique = [...new Set(hashes)];
		assert(unique.length === 5, `5 distinct in-page anchors (${unique.join(' ')})`);
		for (const h of unique) {
			assert(await page.evaluate(id => !!document.getElementById(id), h.slice(1)), `anchor ${h} has a target element`);
		}
		const urls = await page.evaluate(() => {
			const set = new Set();
			document.querySelectorAll('img[src]').forEach(i => set.add(i.src));
			document.querySelectorAll('link[href]:not([rel="preconnect"])').forEach(l => {
				if (l.href.startsWith(location.origin)) set.add(l.href);
			});
			return [...set];
		});
		assert(urls.length >= 10, `collected ${urls.length} same-origin asset URLs`);
		for (const url of urls) {
			const status = await page.evaluate(u => fetch(u).then(r => r.status).catch(() => 0), url);
			assert(status === 200, `${url} -> ${status}`);
		}
		const imgsOk = await page.evaluate(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0));
		assert(imgsOk, 'all <img> decoded (naturalWidth > 0)');
	});

	await section('ln-number: metric text elements', async () => {
		const got = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-number]')).map(n => ({
			text: n.textContent.trim(), value: n.getAttribute('data-ln-value')
		})));
		NUMBERS.forEach((n, i) => {
			assert(got[i].value === n, `metric ${i + 1}: data-ln-value set to ${n}, got ${got[i].value}`);
			assert(got[i].text === n, `metric ${i + 1}: formatted text ${n} (en locale), got "${got[i].text}"`);
		});
	});

	await section('ln-date: <time> elements', async () => {
		const got = await page.evaluate(() => Array.from(document.querySelectorAll('time[data-ln-date]')).map(t => ({
			datetime: t.getAttribute('datetime'), text: t.textContent.trim()
		})));
		DATES.forEach((d, i) => {
			assert(got[i].datetime === d.datetime, `time ${i + 1}: datetime ${d.datetime} preserved`);
			assert(got[i].text === d.text, `time ${i + 1}: formatted "${d.text}", got "${got[i].text}"`);
		});
	});

	await section('Brand token on <html> (ocean + dark)', async () => {
		const brand = await rootBrand();
		assert(brand === BRAND_DARK.ocean, `ocean/dark --brand-primary ${BRAND_DARK.ocean} [source _theme.scss], got ${brand}`);
	});

	await section('Theme popover and presets', async () => {
		await page.click('#theme-picker-trigger');
		await page.waitForFunction(() => document.getElementById('corporate-theme-popover').lnPopover.isOpen, { timeout: 5000 });
		assert(await page.evaluate(() => document.getElementById('corporate-theme-popover').matches(':popover-open')), 'trigger opens the popover into the top layer');
		assert(await count('#corporate-theme-popover [data-set-theme]') === 4 && await count('#corporate-theme-popover [data-set-skin]') === 3, 'popover lists 4 themes and 3 skins');

		for (const theme of ['midnight', 'sunset', 'aurora', 'ocean']) {
			const isOpen = await page.evaluate(() => document.getElementById('corporate-theme-popover').lnPopover.isOpen);
			if (!isOpen) {
				await page.click('#theme-picker-trigger');
				await page.waitForFunction(() => document.getElementById('corporate-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			}
			await page.click(`[data-set-theme="${theme}"]`);
			await page.waitForFunction(t => document.documentElement.getAttribute('data-theme') === t, { timeout: 5000 }, theme);
			await page.waitForFunction(() => !document.getElementById('corporate-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			assert(await rootAttr('data-theme') === theme, `data-theme=${theme} applied to <html> and popover closes`);
			const brand = await rootBrand();
			assert(brand === BRAND_DARK[theme], `${theme}/dark --brand-primary ${BRAND_DARK[theme]} [source], got ${brand}`);
		}

		for (const skin of ['outline', 'soft', 'default']) {
			await page.click('#theme-picker-trigger');
			await page.waitForFunction(() => document.getElementById('corporate-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			await page.click(`[data-set-skin="${skin}"]`);
			await page.waitForFunction(s => document.documentElement.getAttribute('data-skin') === s, { timeout: 5000 }, skin);
			await page.waitForFunction(() => !document.getElementById('corporate-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			assert(await rootAttr('data-skin') === skin, `data-skin=${skin} applied and popover closes`);
		}
	});

	await section('Mode toggle', async () => {
		const icon = () => attr('#mode-icon use', 'href');
		await page.click('#btn-toggle-mode');
		await page.waitForFunction(() => document.documentElement.getAttribute('data-mode') === 'light', { timeout: 5000 });
		assert(await icon() === '#ln-icon-moon', 'dark -> light: icon href #ln-icon-moon [source inline script]');
		await page.waitForFunction(b => getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim() === b, { timeout: 5000 }, BRAND_OCEAN_LIGHT);
		assert(await rootBrand() === BRAND_OCEAN_LIGHT, `ocean/light --brand-primary ${BRAND_OCEAN_LIGHT} [source _theme.scss]`);
		assert(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme) === 'light', 'light mode: color-scheme light');
		await page.click('#btn-toggle-mode');
		await page.waitForFunction(() => document.documentElement.getAttribute('data-mode') === 'dark', { timeout: 5000 });
		assert(await icon() === '#ln-icon-sun', 'light -> dark: icon href #ln-icon-sun [source inline script]');
		assert(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme) === 'dark', 'dark mode: color-scheme dark');
	});

	await section('Insights filter buttons', async () => {
		const state = () => page.evaluate(() => Array.from(document.querySelectorAll('.insights-filter button')).map(b => ({
			active: b.classList.contains('active'), pressed: b.getAttribute('aria-pressed')
		})));
		let s = await state();
		assert(s[0].active && s[0].pressed === 'true' && s.slice(1).every(b => !b.active && b.pressed === 'false'), 'initially only "All Dispatches" active');
		await page.click('.insights-filter button:nth-child(3)');
		await page.waitForFunction(() => document.querySelectorAll('.insights-filter button')[2].getAttribute('aria-pressed') === 'true', { timeout: 5000 });
		s = await state();
		assert(s[2].active && s.every((b, i) => i === 2 || (!b.active && b.pressed === 'false')), 'clicking the 3rd button makes it the only active/pressed one');
	});

	await section('Advisory modal: open via header trigger', async () => {
		await page.click('.nav-actions > button[data-ln-modal-for="modal-advisory"]');
		const opened = await page.waitForFunction(() => document.getElementById('modal-advisory').open, { timeout: 5000 }).then(() => true, () => false);
		assert(opened, '"Request Advisory" opens #modal-advisory');
	});

	await section('Advisory modal: API open, form, cancel closes', async () => {
		await page.evaluate(() => document.getElementById('modal-advisory').lnModal.open());
		await page.waitForFunction(() => document.getElementById('modal-advisory').open, { timeout: 5000 });
		assert(await attr('#modal-advisory', 'data-ln-modal') === 'open', 'lnModal.open() sets data-ln-modal=open and opens the dialog');
		assert(await count('#form-advisory [required]') === 5, 'form has 5 required fields');
		assert(await page.evaluate(() => document.getElementById('form-advisory').lnForm !== undefined), 'ln-form mounted on #form-advisory');
		// [source] same data-ln-toggle-for mismatch as above, on the Cancel button.
		await page.click('#modal-advisory footer .btn-ghost');
		const closed = await page.waitForFunction(() => !document.getElementById('modal-advisory').open, { timeout: 2000 }).then(() => true, () => false);
		assert(closed, '"Cancel" closes #modal-advisory');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
