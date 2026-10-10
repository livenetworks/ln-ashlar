import { run, assert } from './_harness.mjs';

// demo/scoped-theme.html — CSS-ONLY page. It loads dist/ln-ashlar.iife.js but carries no
// data-ln-* attribute, so no component mounts; the demo is pure data-mode (polarity) and
// data-theme (brand palette) scoping. Expected values are read from
// theme/config/_theme.scss (named presets, activation, derivations) and
// theme/config/_palette.scss (brand -> semantic derivation), not from page prose.
//
// URL: http://localhost/ln-ashlar/demo/... answers 302 for this page and its assets (redirect
// to /ln-ashlar/scoped-theme.html), so the page is loaded from the vhost whose docroot is
// demo/: http://ln-ashlar.test/ (the real deploy layout).

const PAGE_URL = new URL('http://ln-ashlar.test/scoped-theme.html').href;

// [source] _theme.scss named presets: --brand-primary per scope.
const OCEAN_LIGHT = '190 80% 24%';
const SUNSET_LIGHT = '10 80% 36%';
const MIDNIGHT_DARK = '265 70% 75%';   // card carries data-mode="dark"
const GLASS = '218 95% 71%';           // no polarity block, one value in both
// [source] _theme.scss root: :root{--brand-primary:221 83% 43%} in _palette.scss
const ROOT_BRAND = '221 83% 43%';

run('demo/scoped-theme.html', async ({ page }) => {

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// Reads a custom property or computed style off an element found by selector.
	const token = (selector, name) => page.evaluate((s, n) => {
		const el = document.querySelector(s);
		return el ? getComputedStyle(el).getPropertyValue(n).trim() : null;
	}, selector, name);

	const style = (selector, prop) => page.evaluate((s, p) => {
		const el = document.querySelector(s);
		return el ? getComputedStyle(el)[p] : null;
	}, selector, prop);

	// Each island is addressed by its own attribute pair, taken from the markup.
	const SEL = {
		header: 'header.app-header[data-mode="dark"]',
		footer: 'footer.app-footer[data-mode="dark"]',
		lightRootCard: '#light-name',
		darkSection: 'section.section-card[data-mode="dark"]',
		darkCard: '#dark-server',
		nestedLight: 'div.card[data-mode="light"]',
		ocean: '.card[data-theme="ocean"]',
		sunset: '.card[data-theme="sunset"]',
		midnight: '.card[data-theme="midnight"][data-mode="dark"]',
		glass: '.card[data-theme="glass"]'
	};

	// Resolves a token on the closest ancestor-or-self island of a form field.
	const fieldToken = (id, name) => page.evaluate((i, n) => {
		const el = document.getElementById(i).closest('.card');
		return getComputedStyle(el).getPropertyValue(n).trim();
	}, id, name);

	await section('Load', async () => {
		const loaded = [];
		page.on('response', r => loaded.push(r));
		const res = await page.goto(PAGE_URL, { waitUntil: 'load' });
		assert(res.status() === 200, `page responds 200 at ${PAGE_URL}`);
		await page.waitForFunction(() => document.readyState === 'complete');
		const title = await page.title();
		assert(title === 'ln-ashlar — Scoped Theme Islands', 'document title matches source');
		const cssOk = loaded.some(r => r.url().endsWith('/dist/ln-ashlar.css') && r.status() === 200);
		const jsOk = loaded.some(r => r.url().endsWith('/dist/ln-ashlar.iife.js') && r.status() === 200);
		assert(cssOk, 'dist/ln-ashlar.css loaded with 200');
		assert(jsOk, 'dist/ln-ashlar.iife.js loaded with 200');
		const mode = await page.evaluate(() => document.documentElement.getAttribute('data-mode'));
		assert(mode === 'light', 'root <html data-mode="light">');
	});

	await section('Structure: islands present as authored', async () => {
		const counts = await page.evaluate(() => ({
			modeDark: document.querySelectorAll('[data-mode="dark"]').length,
			modeLight: document.querySelectorAll('[data-mode="light"]').length,
			themes: Array.from(document.querySelectorAll('[data-theme]')).map(e => e.getAttribute('data-theme')),
			ln: document.querySelectorAll('[data-ln-search],[data-ln-table],[data-ln-modal],[data-ln-tabs]').length
		}));
		// header, dark section, midnight card, footer
		assert(counts.modeDark === 4, `4 data-mode="dark" scopes (header, section, midnight card, footer), got ${counts.modeDark}`);
		// root <html> + nested light card
		assert(counts.modeLight === 2, `2 data-mode="light" scopes (html, nested island), got ${counts.modeLight}`);
		assert(counts.themes.join() === 'ocean,sunset,midnight,glass', `data-theme islands ocean,sunset,midnight,glass, got ${counts.themes.join()}`);
		assert(counts.ln === 0, 'no live data-ln-* components on the page (CSS-only)');
		for (const [name, sel] of Object.entries(SEL)) {
			const n = await page.evaluate(s => document.querySelectorAll(s).length, sel);
			assert(n === 1, `island selector ${name} matches exactly one element`);
		}
	});

	await section('Polarity: data-mode islands', async () => {
		const scheme = {
			root: await style('html', 'colorScheme'),
			header: await style(SEL.header, 'colorScheme'),
			darkSection: await style(SEL.darkSection, 'colorScheme'),
			nested: await style(SEL.nestedLight, 'colorScheme'),
			footer: await style(SEL.footer, 'colorScheme')
		};
		assert(scheme.root === 'light', `root color-scheme light [source _theme.scss], got ${scheme.root}`);
		assert(scheme.header === 'dark', `dark header island color-scheme dark, got ${scheme.header}`);
		assert(scheme.darkSection === 'dark', `dark section island color-scheme dark, got ${scheme.darkSection}`);
		assert(scheme.nested === 'light', `nested light island color-scheme light, got ${scheme.nested}`);
		assert(scheme.footer === 'dark', `dark footer island color-scheme dark, got ${scheme.footer}`);

		const bg = {
			root: await token('html', '--color-bg'),
			header: await token(SEL.header, '--color-bg'),
			darkSection: await token(SEL.darkSection, '--color-bg'),
			nested: await token(SEL.nestedLight, '--color-bg'),
			footer: await token(SEL.footer, '--color-bg')
		};
		assert(bg.root !== '' && bg.darkSection !== '', '--color-bg resolves on root and dark island');
		assert(bg.darkSection !== bg.root, 'dark island rebinds --color-bg away from the root value');
		assert(bg.header === bg.darkSection && bg.footer === bg.darkSection, 'header/footer dark islands share the dark --color-bg');
		assert(bg.nested === bg.root, 'nested data-mode="light" island snaps back to the root light --color-bg');

		// A card inside the dark island with no own scope inherits the dark island, not the root.
		const darkCardBg = await fieldToken('dark-server', '--color-bg');
		const rootCardBg = await fieldToken('light-name', '--color-bg');
		// [source] _card.scss: a card declares its own --color-bg from the local --bg-* scale, so it need not equal the island value;
		// the island polarity must still reach it.
		assert(darkCardBg !== rootCardBg, `card inside dark island resolves a different --color-bg than a root-canvas card (dark=${darkCardBg} root=${rootCardBg})`);

		// [source] _theme.scss: :where([data-mode]:not(html):not(body)) { background-color: var(--color-bg) }
		const paint = {
			root: await style(SEL.lightRootCard, 'backgroundColor'),
			darkSection: await style(SEL.darkSection, 'backgroundColor'),
			nested: await style(SEL.nestedLight, 'backgroundColor')
		};
		assert(paint.darkSection !== 'rgba(0, 0, 0, 0)', 'dark island paints a background (non-transparent)');
		assert(paint.nested !== 'rgba(0, 0, 0, 0)', 'nested light island paints a background (non-transparent)');
		assert(paint.darkSection !== paint.nested, 'dark island and nested light island paint different backgrounds');
		assert(paint.root !== undefined, 'root field resolves');

		// [source] _theme.scss: :where([data-mode]) { color: var(--color-fg) }
		const fg = {
			dark: await style(SEL.darkSection, 'color'),
			nested: await style(SEL.nestedLight, 'color')
		};
		assert(fg.dark !== fg.nested, 'dark island and nested light island resolve different foreground colors');
	});

	await section('Brand palette: data-theme islands', async () => {
		const brand = {
			root: await token('html', '--brand-primary'),
			ocean: await token(SEL.ocean, '--brand-primary'),
			sunset: await token(SEL.sunset, '--brand-primary'),
			midnight: await token(SEL.midnight, '--brand-primary'),
			glass: await token(SEL.glass, '--brand-primary')
		};
		assert(brand.root === ROOT_BRAND, `root --brand-primary ${ROOT_BRAND} [source _palette.scss], got ${brand.root}`);
		assert(brand.ocean === OCEAN_LIGHT, `ocean (light) --brand-primary ${OCEAN_LIGHT} [source _theme.scss], got ${brand.ocean}`);
		assert(brand.sunset === SUNSET_LIGHT, `sunset (light) --brand-primary ${SUNSET_LIGHT} [source _theme.scss], got ${brand.sunset}`);
		assert(brand.midnight === MIDNIGHT_DARK, `midnight (data-mode=dark) --brand-primary ${MIDNIGHT_DARK} [source _theme.scss], got ${brand.midnight}`);
		assert(brand.glass === GLASS, `glass --brand-primary ${GLASS} [source _theme.scss], got ${brand.glass}`);

		// Brand rebinds only inside the island: sibling content and the page header keep the root brand.
		const rootCardBrand = await fieldToken('light-name', '--brand-primary');
		const darkCardBrand = await fieldToken('dark-server', '--brand-primary');
		assert(rootCardBrand === ROOT_BRAND, 'root canvas card keeps the root brand (no leak from sibling islands)');
		assert(darkCardBrand === ROOT_BRAND, 'dark-mode island without data-theme keeps the root brand (polarity does not change brand)');

		// [source] _palette.scss: --color-primary derives from --brand-primary at every scope;
		// --color-accent = hsl(var(--color-primary)). A scope where brand moved but these did not is half-themed.
		for (const key of ['ocean', 'sunset', 'midnight', 'glass']) {
			const primary = await token(SEL[key], '--color-primary');
			const accent = await token(SEL[key], '--color-accent');
			assert(primary === brand[key], `${key}: --color-primary follows the local --brand-primary (${primary})`);
			assert(accent === `hsl(${brand[key]})`, `${key}: --color-accent resolves to hsl of the local brand (${accent})`);
		}

		// [source] _theme.scss: dark-lift block pairs --color-accent-fg with ink; unpaired light scopes keep white.
		const ink = await token(SEL.midnight, '--color-ink');
		const midnightFg = await token(SEL.midnight, '--color-accent-fg');
		assert(midnightFg === `hsl(${ink})`, `midnight (dark): --color-accent-fg is hsl(--color-ink), got ${midnightFg}`);
		const glassFg = await token(SEL.glass, '--color-accent-fg');
		assert(glassFg === `hsl(${ink})`, `glass: --color-accent-fg is hsl(--color-ink) [source], got ${glassFg}`);
		const oceanFg = await token(SEL.ocean, '--color-accent-fg');
		assert(oceanFg !== `hsl(${ink})`, 'ocean (light): --color-accent-fg not ink (no dark lift applies)');

		// [source] _theme.scss glass: local --color-accent-tint override; ocean keeps the default 8% derivation.
		const glassTint = await token(SEL.glass, '--color-accent-tint');
		const oceanTint = await token(SEL.ocean, '--color-accent-tint');
		assert(glassTint.includes('24%'), `glass: 24% tint mix [source], got ${glassTint}`);
		assert(oceanTint.includes('8%'), `ocean: default 8% tint mix, got ${oceanTint}`);
	});

	await section('Half-themed check: buttons follow their island brand', async () => {
		// Button fill is derived from the scope; a button in a rebound island must not render with the root's fill.
		const fills = await page.evaluate(sels => Object.fromEntries(Object.entries(sels).map(([k, s]) => {
			const btn = document.querySelector(s).querySelector('footer .btn');
			return [k, getComputedStyle(btn).backgroundColor];
		})), { ocean: SEL.ocean, sunset: SEL.sunset, midnight: SEL.midnight, glass: SEL.glass });
		const rootFill = await page.evaluate(() => getComputedStyle(document.querySelector('.page-header .btn')).backgroundColor);
		const distinct = new Set([rootFill, ...Object.values(fills)]);
		assert(distinct.size === 5, `root + 4 theme islands render 5 distinct button fills (${[...distinct].join(' | ')})`);
	});

	await section('Links and assets resolve (HTTP 200 fetched from the page)', async () => {
		const urls = await page.evaluate(() => {
			const set = new Set();
			document.querySelectorAll('a[href]').forEach(a => set.add(a.href));
			document.querySelectorAll('img[src]').forEach(i => set.add(i.src));
			document.querySelectorAll('link[rel="stylesheet"][href^="dist"],script[src]').forEach(e => set.add(e.href || e.src));
			return [...set];
		});
		assert(urls.length >= 5, `collected ${urls.length} same-page URLs`);
		for (const url of urls) {
			const status = await page.evaluate(u => fetch(u).then(r => r.status).catch(() => 0), url);
			assert(status === 200, `${url} -> ${status}`);
		}
		const imgsOk = await page.evaluate(() => Array.from(document.images).every(i => i.complete && i.naturalWidth > 0));
		assert(imgsOk, 'all <img> decoded (naturalWidth > 0)');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
