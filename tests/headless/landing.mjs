import { run, assert } from './_harness.mjs';

// demo/landing/index.html — HAS LIVE COMPONENTS. Mounted by dist/ln-ashlar.iife.js:
//   ln-popover (theme picker), ln-number (4 stats), ln-accordion + ln-toggle (FAQ),
//   ln-icon markup. Plus one inline <script> that wires the mode toggle and the theme/skin
//   presets. The rest (bento grid, pricing, testimonials, scoped violet island) is CSS-only.
// All expectations are read from the page markup, its inline script, the component sources
// (ln-accordion, ln-toggle, ln-number, ln-popover) and theme/config/_theme.scss.
//
// URL: http://localhost/ln-ashlar/demo/... answers 302 for this page and its assets, so the page
// is loaded from the vhost whose docroot is demo/: http://ln-ashlar.test/ (the real deploy layout).
// Icons come from the Tabler CDN at runtime (ln-icon.js), so icon rendering is not asserted.

const PAGE_URL = new URL('http://ln-ashlar.test/landing/index.html').href;

// [source] _theme.scss: --brand-primary per preset in dark polarity (page root is data-mode="dark").
const BRAND_DARK = {
	ocean: '190 80% 46%',
	sunset: '10 80% 69%',
	midnight: '265 70% 75%',
	glass: '218 95% 71%',
	aurora: '158 80% 55%',
	violet: '255 85% 72%',
	cyber: '198 95% 58%'
};
const BRAND_OCEAN_LIGHT = '190 80% 24%';

// [source] ln-number text element: parseFloat(data-ln-number), en locale, no decimals attribute.
// The markup's visible suffixes ("%", "ms", "kB", "M+") are overwritten by the formatted number.
const STATS = [
	{ attr: '99.9%', value: '99.9', text: '99.9' },
	{ attr: '50ms', value: '50', text: '50' },
	{ attr: '0kB', value: '0', text: '0' },
	{ attr: '10000000', value: '10000000', text: '10,000,000' }
];

run('demo/landing/index.html', async ({ page }) => {

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	const rootAttr = name => page.evaluate(n => document.documentElement.getAttribute(n), name);
	const brandOf = selector => page.evaluate(s => getComputedStyle(document.querySelector(s)).getPropertyValue('--brand-primary').trim(), selector);
	const count = selector => page.evaluate(s => document.querySelectorAll(s).length, selector);
	const popoverOpen = () => page.evaluate(() => document.getElementById('landing-theme-popover').lnPopover.isOpen);

	async function openPopover() {
		if (await popoverOpen()) return;
		await page.click('#landing-theme-trigger');
		await page.waitForFunction(() => document.getElementById('landing-theme-popover').lnPopover.isOpen, { timeout: 5000 });
	}

	const panels = () => page.evaluate(() => [1, 2, 3, 4].map(n => document.getElementById(`faq-panel-${n}`).getAttribute('data-ln-toggle')));
	const expanded = () => page.evaluate(() => [1, 2, 3, 4].map(n => document.querySelector(`[data-ln-toggle-for="faq-panel-${n}"]`).getAttribute('aria-expanded')));

	async function waitPanels(expected) {
		await page.waitForFunction(exp => [1, 2, 3, 4].every((n, i) =>
			document.getElementById(`faq-panel-${n}`).getAttribute('data-ln-toggle') === exp[i]), { timeout: 5000 }, expected);
	}

	await section('Load and mount', async () => {
		const loaded = [];
		page.on('response', r => loaded.push(r));
		const res = await page.goto(PAGE_URL, { waitUntil: 'load' });
		assert(res.status() === 200, `page responds 200 at ${PAGE_URL}`);
		assert((await page.title()) === 'ln-ashlar — Modern Presentation & Marketing Design System', 'document title matches source');
		for (const tail of ['/dist/ln-ashlar.iife.js', '/dist/ln-ashlar-landing.css', '/dist/ln-ashlar-dev.css', '/landing/landing.css']) {
			assert(loaded.some(r => r.url().endsWith(tail) && r.status() === 200), `${tail} loaded with 200`);
		}
		await page.waitForFunction(() => {
			const pop = document.getElementById('landing-theme-popover');
			const acc = document.getElementById('faq-accordion');
			const nums = Array.from(document.querySelectorAll('[data-ln-number]'));
			const panelEls = Array.from(document.querySelectorAll('section[id^="faq-panel-"]'));
			return pop && pop.lnPopover && acc && acc.lnAccordion
				&& nums.length === 4 && nums.every(n => n.lnNumber)
				&& panelEls.length === 4 && panelEls.every(p => p.lnToggle);
		}, { timeout: 10000 });
		assert(true, 'ln-popover, ln-accordion, 4x ln-number, 4x ln-toggle panels mounted');
		assert(await rootAttr('data-mode') === 'dark' && await rootAttr('data-theme') === 'ocean' && await rootAttr('data-skin') === 'default',
			'<html> starts data-mode=dark data-theme=ocean data-skin=default');
	});

	await section('Structure', async () => {
		const sections = await page.evaluate(() => Array.from(document.querySelectorAll('main > section')).map(s => s.id));
		assert(sections.join() === 'hero,bento,bento-mixins,features,showcase,stats,pricing,testimonials,faq,cta', `main sections in order, got ${sections.join()}`);
		assert(await count('ul.nav-menu > li') === 6, '6 nav menu links');
		assert(await count('#bento article.bento-card') === 4, '4 bento cards');
		assert(await count('#bento-id-showcase > article') === 4, '4 semantic-ID bento cards');
		assert(await count('#features-list > li') === 6, '6 feature items');
		assert(await count('#stats-list > li') === 4, '4 stats');
		assert(await count('#pricing-list > li') === 3, '3 pricing plans');
		assert(await count('#testimonials ul.cards-grid > li') === 3, '3 testimonials');
		assert(await count('#faq-accordion > li') === 4, '4 FAQ items');
		assert(await count('.picker-grid [data-set-theme]') === 7 && await count('.picker-grid [data-set-skin]') === 4, 'popover lists 7 themes and 4 skins');
	});

	await section('ln-number: stats text elements', async () => {
		const got = await page.evaluate(() => Array.from(document.querySelectorAll('#stats-list [data-ln-number]')).map(n => ({
			attr: n.getAttribute('data-ln-number'), value: n.getAttribute('data-ln-value'), text: n.textContent.trim()
		})));
		STATS.forEach((s, i) => {
			assert(got[i].attr === s.attr, `stat ${i + 1}: data-ln-number="${s.attr}"`);
			assert(got[i].value === s.value, `stat ${i + 1}: data-ln-value ${s.value}, got ${got[i].value}`);
			assert(got[i].text === s.text, `stat ${i + 1}: formatted text "${s.text}" [source ln-number], got "${got[i].text}"`);
		});
	});

	await section('FAQ accordion (ln-accordion + ln-toggle)', async () => {
		assert((await panels()).join() === 'open,close,close,close', 'initial panels: 1 open, 2-4 closed [source markup]');
		await page.click('[data-ln-toggle-for="faq-panel-2"]');
		await waitPanels(['close', 'open', 'close', 'close']);
		assert((await panels()).join() === 'close,open,close,close', 'opening panel 2 closes panel 1 (accordion single-open)');
		assert((await expanded()).join() === 'false,true,false,false', 'triggers aria-expanded follow the panel state');
		await page.click('[data-ln-toggle-for="faq-panel-4"]');
		await waitPanels(['close', 'close', 'close', 'open']);
		assert((await panels()).join() === 'close,close,close,open', 'opening panel 4 closes panel 2');
		await page.click('[data-ln-toggle-for="faq-panel-4"]');
		await waitPanels(['close', 'close', 'close', 'close']);
		assert((await panels()).join() === 'close,close,close,close', 'default toggle action closes the open panel again');
	});

	await section('Brand token on <html> (ocean + dark)', async () => {
		const brand = await brandOf('html');
		assert(brand === BRAND_DARK.ocean, `ocean/dark --brand-primary ${BRAND_DARK.ocean} [source _theme.scss], got ${brand}`);
	});

	await section('Theme popover and presets', async () => {
		await page.click('#landing-theme-trigger');
		await page.waitForFunction(() => document.getElementById('landing-theme-popover').lnPopover.isOpen, { timeout: 5000 });
		assert(await page.evaluate(() => document.getElementById('landing-theme-popover').matches(':popover-open')), 'trigger opens the popover into the top layer');

		for (const theme of ['sunset', 'midnight', 'glass', 'aurora', 'violet', 'cyber', 'ocean']) {
			await openPopover();
			await page.click(`[data-set-theme="${theme}"]`);
			await page.waitForFunction(t => document.documentElement.getAttribute('data-theme') === t, { timeout: 5000 }, theme);
			await page.waitForFunction(() => !document.getElementById('landing-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			assert(await rootAttr('data-theme') === theme, `data-theme=${theme} applied to <html> and popover closes`);
			const brand = await brandOf('html');
			assert(brand === BRAND_DARK[theme], `${theme}/dark --brand-primary ${BRAND_DARK[theme]} [source], got ${brand}`);
		}

		for (const skin of ['soft', 'glass', 'outline', 'default']) {
			await openPopover();
			await page.click(`[data-set-skin="${skin}"]`);
			await page.waitForFunction(s => document.documentElement.getAttribute('data-skin') === s, { timeout: 5000 }, skin);
			await page.waitForFunction(() => !document.getElementById('landing-theme-popover').lnPopover.isOpen, { timeout: 5000 });
			assert(await rootAttr('data-skin') === skin, `data-skin=${skin} applied and popover closes`);
		}
	});

	await section('Mode toggle', async () => {
		const icon = () => page.evaluate(() => document.querySelector('#mode-icon use').getAttribute('href'));
		await page.click('#btn-toggle-mode');
		await page.waitForFunction(() => document.documentElement.getAttribute('data-mode') === 'light', { timeout: 5000 });
		assert(await icon() === '#ln-icon-moon', 'dark -> light: icon href #ln-icon-moon [source inline script]');
		await page.waitForFunction(b => getComputedStyle(document.documentElement).getPropertyValue('--brand-primary').trim() === b, { timeout: 5000 }, BRAND_OCEAN_LIGHT);
		assert(await brandOf('html') === BRAND_OCEAN_LIGHT, `ocean/light --brand-primary ${BRAND_OCEAN_LIGHT} [source _theme.scss]`);
		assert(await page.evaluate(() => getComputedStyle(document.documentElement).colorScheme) === 'light', 'light mode: color-scheme light');
		await page.click('#btn-toggle-mode');
		await page.waitForFunction(() => document.documentElement.getAttribute('data-mode') === 'dark', { timeout: 5000 });
		assert(await icon() === '#ln-icon-sun', 'light -> dark: icon href #ln-icon-sun [source inline script]');
	});

	await section('Scoped violet island', async () => {
		// [source] markup: .cta-island-card carries data-mode="dark" data-theme="violet"; _theme.scss violet dark block.
		const sel = '.cta-island-card[data-mode="dark"][data-theme="violet"]';
		assert(await count(sel) === 1, 'one violet dark island present');
		assert(await rootAttr('data-theme') === 'ocean', 'root theme is ocean again after the preset loop');
		const island = await brandOf(sel);
		const root = await brandOf('html');
		assert(island === BRAND_DARK.violet, `island --brand-primary ${BRAND_DARK.violet} [source], got ${island}`);
		assert(root === BRAND_DARK.ocean && island !== root, 'island rebinds brand without changing the root brand');
	});

	await section('Links and assets resolve (HTTP 200 fetched from the page)', async () => {
		const hashes = [...new Set(await page.evaluate(() => Array.from(document.querySelectorAll('a[href^="#"]'))
			.map(a => a.getAttribute('href')).filter(h => h.length > 1)))];
		for (const h of hashes) {
			assert(await page.evaluate(id => !!document.getElementById(id), h.slice(1)), `anchor ${h} has a target element`);
		}
		const urls = await page.evaluate(() => {
			const set = new Set();
			document.querySelectorAll('a[href]:not([href^="#"])').forEach(a => set.add(a.href));
			document.querySelectorAll('img[src]:not([src^="data:"])').forEach(i => set.add(i.src));
			document.querySelectorAll('link[href]:not([rel="preconnect"])').forEach(l => {
				if (l.href.startsWith(location.origin)) set.add(l.href);
			});
			return [...set];
		});
		assert(urls.length >= 10, `collected ${urls.length} same-origin URLs`);
		const bad = [];
		for (const url of urls) {
			const status = await page.evaluate(u => fetch(u).then(r => r.status).catch(() => 0), url);
			if (status !== 200) bad.push(`${url} -> ${status}`);
		}
		assert(bad.length === 0, `all ${urls.length} URLs answer 200; failing: ${bad.join(', ') || 'none'}`);
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
