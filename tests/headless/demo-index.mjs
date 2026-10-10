import { run, assert } from './_harness.mjs';

// demo/index.html — STATIC page. It loads only dist/ln-ashlar.css and index.css: no script tag,
// no data-ln-* attribute, nothing mounts. Smoke test: loads, hub structure, every card link
// resolves (HTTP 200 fetched from the page), zero uncaught page errors.
//
// URL: http://localhost/ln-ashlar/demo/... answers 302 for this page and its assets, so the page
// is loaded from the vhost whose docroot is demo/: http://ln-ashlar.test/ (the real deploy layout).

const PAGE_URL = new URL('http://ln-ashlar.test/index.html').href;

// [source] demo/index.html, one entry per <a class="demo-card">, in document order.
const CARDS = [
	{ href: 'admin/index.html', title: 'Admin Dashboard', badge: 'Current Style', icon: 'ln-icon-chart-bar' },
	{ href: 'spa/', title: 'DocuFlow SPA', badge: 'Available', icon: 'ln-icon-files' },
	{ href: 'corporate/index.html', title: 'Corporate & Enterprise', badge: 'Brand New', icon: 'ln-icon-building' },
	{ href: 'landing/index.html', title: 'Presentation & Marketing', badge: 'Marketing', icon: 'ln-icon-sparkles' },
	{ href: 'scoped-theme.html', title: 'Scoped Theming', badge: 'Feature Demo', icon: 'ln-icon-palette' }
];

run('demo/index.html', async ({ page }) => {

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	await section('Load', async () => {
		const loaded = [];
		page.on('response', r => loaded.push(r));
		const res = await page.goto(PAGE_URL, { waitUntil: 'load' });
		assert(res.status() === 200, `page responds 200 at ${PAGE_URL}`);
		assert((await page.title()) === 'ln-ashlar — Demos', 'document title matches source');
		assert(loaded.some(r => r.url().endsWith('/dist/ln-ashlar.css') && r.status() === 200), 'dist/ln-ashlar.css loaded with 200');
		assert(loaded.some(r => r.url().endsWith('/index.css') && r.status() === 200), 'index.css loaded with 200');
		const scripts = await page.evaluate(() => document.querySelectorAll('script').length);
		assert(scripts === 0, 'static page: no <script> element');
		const live = await page.evaluate(() => document.querySelectorAll('[data-ln-search],[data-ln-table],[data-ln-modal],[data-ln-tabs],[data-ln-icon]').length);
		assert(live === 0, 'no live data-ln-* components');
	});

	await section('Structure', async () => {
		const h1 = await page.evaluate(() => document.querySelector('.container > header h1')?.textContent.trim());
		assert(h1 === 'ln-ashlar Demos', `header h1 "ln-ashlar Demos", got ${h1}`);
		const logo = await page.evaluate(() => {
			const img = document.querySelector('header .brand-logo img');
			return img ? { alt: img.alt, ok: img.complete && img.naturalWidth > 0 } : null;
		});
		assert(logo && logo.alt === 'ln-ashlar logo' && logo.ok, 'logo <img alt="ln-ashlar logo"> decoded');

		const cards = await page.evaluate(() => Array.from(document.querySelectorAll('main.demo-grid > a.demo-card')).map(a => ({
			href: a.getAttribute('href'),
			title: a.querySelector('h3').textContent.trim(),
			badge: a.querySelector('.badge').textContent.trim(),
			icon: a.querySelector('svg.ln-icon use').getAttribute('href').slice(1)
		})));
		assert(cards.length === CARDS.length, `${CARDS.length} demo cards, got ${cards.length}`);
		CARDS.forEach((c, i) => {
			assert(cards[i] && cards[i].href === c.href && cards[i].title === c.title && cards[i].badge === c.badge,
				`card ${i + 1}: ${c.title} -> ${c.href} [${c.badge}]`);
		});

		const footerLink = await page.evaluate(() => document.querySelector('footer.footer a')?.getAttribute('href'));
		assert(footerLink === 'sitemap.xml', 'footer links to sitemap.xml');
	});

	await section('Styling applied (computed from source rules)', async () => {
		// [source] index.scss: .demo-grid { display: grid }, .demo-card { text-decoration: none; border: 1px solid }
		const s = await page.evaluate(() => {
			const grid = document.querySelector('main.demo-grid');
			const card = document.querySelector('a.demo-card');
			return {
				grid: getComputedStyle(grid).display,
				deco: getComputedStyle(card).textDecorationLine,
				border: getComputedStyle(card).borderTopWidth
			};
		});
		assert(s.grid === 'grid', 'main.demo-grid displays as grid');
		assert(s.deco === 'none', 'demo-card has no text decoration');
		assert(s.border === '1px', 'demo-card has 1px border');
	});

	await section('Card icons resolve to sprite symbols', async () => {
		// [source] theme/config/_icons.scss: icons render through an SVG sprite that ln-icon.js injects,
		// and every <use href="#ln-icon-*"> needs its symbol in the document. This page loads no script.
		for (const c of CARDS) {
			const found = await page.evaluate(id => !!document.getElementById(id), c.icon);
			assert(found, `#${c.icon} symbol exists in document (${c.title} card icon)`);
		}
	});

	await section('Links resolve (HTTP 200 fetched from the page)', async () => {
		const urls = await page.evaluate(() => {
			const set = new Set();
			document.querySelectorAll('a[href]').forEach(a => set.add(a.href));
			document.querySelectorAll('img[src]').forEach(i => set.add(i.src));
			document.querySelectorAll('link[href]').forEach(l => set.add(l.href));
			document.querySelectorAll('source[srcset]').forEach(s => set.add(new URL(s.getAttribute('srcset'), location.href).href));
			return [...set];
		});
		for (const url of urls) {
			const status = await page.evaluate(u => fetch(u).then(r => r.status).catch(() => 0), url);
			assert(status === 200, `${url} -> ${status}`);
		}
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
