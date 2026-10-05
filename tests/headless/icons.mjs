import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/icons.html and the components it
// mounts: ln-icon (sprite loader), ln-filter (category pills), ln-search (icon filter box),
// plus theme/config/_icons.scss for the size modifiers.
//
// Network: the Tabler CDN (cdn.jsdelivr.net) is answered by Puppeteer request interception
// with a synthetic SVG, so the run is deterministic and offline-safe. LN_ICON_CUSTOM_CDN is
// NOT set on this page, so custom (#ln-icon-custom-*) icons cannot load; that is asserted.

const PAGE_URL = BASE_URL + 'icons.html';
const CDN_PREFIX = 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline/';
const SYNTHETIC_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z"/></svg>';

// Section data-category -> icon-cell count (counted from the markup).
const CATEGORY_CELLS = {
	'navigation': 5,
	'actions': 19,
	'arrows': 3,
	'status': 4,
	'data-content': 8,
	'people-contact': 4,
	'file-types': 4
};
const CATEGORIES = Object.keys(CATEGORY_CELLS);
const TOTAL_CELLS = 47;
const CUSTOM_HREFS = [
	'#ln-icon-custom-file',
	'#ln-icon-custom-file-pdf',
	'#ln-icon-custom-file-doc',
	'#ln-icon-custom-file-epub'
];

const INPUT = 'input[data-ln-search-for="icon-categories"]';
const CLEAR = 'search:has(input[data-ln-search-for="icon-categories"]) button[data-ln-search-clear]';

const sameSet = (a, b) => a.length === b.length && a.slice().sort().every((v, i) => v === b.slice().sort()[i]);

run('demo/admin/icons.html', async ({ page }) => {

	// ─── Network interception (synthetic Tabler CDN) ───────────

	const cdnRequests = [];
	await page.setRequestInterception(true);
	page.on('request', req => {
		const url = req.url();
		if (url.indexOf('https://cdn.jsdelivr.net/') === 0) {
			cdnRequests.push(url);
			req.respond({
				status: 200,
				contentType: 'image/svg+xml',
				headers: { 'access-control-allow-origin': '*' },
				body: SYNTHETIC_SVG
			}).catch(() => {});
		} else {
			req.continue().catch(() => {});
		}
	});

	const warnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warn') warnings.push(msg.text());
	});

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs one section; a failure is recorded and re-thrown at the very end so the
	// remaining sections still run (the run still exits 1).
	const failures = [];
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction(() => {
			const nav = document.querySelector('nav[data-ln-filter="icon-categories"]');
			const target = document.getElementById('icon-categories');
			const input = document.querySelector('input[data-ln-search-for="icon-categories"]');
			return !!(nav && nav.lnFilter && target && target.lnSearch && input && input.lnSearchControl);
		}, { timeout: 10000 });
	}

	async function load({ clearStorage }) {
		cdnRequests.length = 0;
		warnings.length = 0;
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		if (clearStorage) {
			await page.evaluate(() => localStorage.clear());
			cdnRequests.length = 0;
			warnings.length = 0;
			await page.reload({ waitUntil: 'load' });
		}
		await ready();
	}

	// Distinct non-custom icon hrefs referenced by <use> anywhere on the page.
	const tablerHrefs = () => page.evaluate(() => {
		const set = new Set();
		document.querySelectorAll('use[href^="#ln-icon-"]').forEach(u => {
			const h = u.getAttribute('href');
			if (h.indexOf('#ln-icon-custom-') !== 0) set.add(h);
		});
		return Array.from(set);
	});

	const symbolIds = () => page.evaluate(() => Array.from(
		document.querySelectorAll('#ln-icon-sprite defs symbol')).map(s => s.id));

	async function waitSymbol(id) {
		await page.waitForFunction(i => !!document.querySelector('#ln-icon-sprite defs symbol[id="' + i + '"]'),
			{ timeout: 5000 }, id);
	}

	const visibleCellCount = () => page.evaluate(() => Array.from(
		document.querySelectorAll('#icon-categories .icon-cell')).filter(c => c.checkVisibility()).length);

	const visibleCellTexts = () => page.evaluate(() => Array.from(
		document.querySelectorAll('#icon-categories .icon-cell'))
		.filter(c => c.checkVisibility()).map(c => c.textContent.trim()));

	const visibleCategories = () => page.evaluate(() => Array.from(
		document.querySelectorAll('#icon-categories > section[data-category]'))
		.filter(s => s.checkVisibility()).map(s => s.getAttribute('data-category')));

	async function waitCells(n) {
		await page.waitForFunction(count => Array.from(
			document.querySelectorAll('#icon-categories .icon-cell')).filter(c => c.checkVisibility()).length === count,
		{ timeout: 5000 }, n).catch(() => {});
	}

	async function waitCategories(expected) {
		await page.waitForFunction(exp => {
			const vis = Array.from(document.querySelectorAll('#icon-categories > section[data-category]'))
				.filter(s => s.checkVisibility()).map(s => s.getAttribute('data-category'));
			return vis.length === exp.length && exp.every(c => vis.indexOf(c) !== -1);
		}, { timeout: 5000 }, expected).catch(() => {});
	}

	const pillChecked = () => page.evaluate(() => Array.from(
		document.querySelectorAll('nav[data-ln-filter="icon-categories"] input[data-ln-filter-key]'))
		.filter(i => i.checked).map(i => i.hasAttribute('data-ln-filter-reset') ? '(reset)' : i.getAttribute('data-ln-filter-value')));

	const clickPill = value => page.evaluate(v => {
		const sel = v === null
			? 'nav[data-ln-filter="icon-categories"] input[data-ln-filter-reset]'
			: 'nav[data-ln-filter="icon-categories"] input[data-ln-filter-value="' + v + '"]';
		document.querySelector(sel).click();
	}, value);

	// Records ln-search:change / ln-filter:change / ln-filter:reset into window.__ev.
	const installRecorders = () => page.evaluate(() => {
		window.__ev = [];
		const target = document.getElementById('icon-categories');
		target.addEventListener('ln-search:change', e => window.__ev.push({ type: e.type, detail: e.detail }));
		target.addEventListener('ln-filter:change', e => window.__ev.push({ type: e.type, detail: e.detail }));
		target.addEventListener('ln-filter:reset', e => window.__ev.push({ type: e.type, detail: e.detail }));
	});
	const events = type => page.evaluate(t => window.__ev.filter(e => e.type === t), type);

	// ─── Run ───────────────────────────────────────────────────

	await load({ clearStorage: true });

	await guarded('Page structure', async () => {
		const cells = await page.evaluate(() => document.querySelectorAll('#icon-categories .icon-cell').length);
		assert(cells === TOTAL_CELLS, `47 icon cells inside #icon-categories (got ${cells})`);

		const perCat = await page.evaluate(() => {
			const out = {};
			document.querySelectorAll('#icon-categories > section[data-category]').forEach(s => {
				out[s.getAttribute('data-category')] = s.querySelectorAll('.icon-cell').length;
			});
			return out;
		});
		for (const cat of CATEGORIES) {
			assert(perCat[cat] === CATEGORY_CELLS[cat], `Category "${cat}" has ${CATEGORY_CELLS[cat]} icon cells (got ${perCat[cat]})`);
		}

		const pills = await page.evaluate(() => document.querySelectorAll('#icon-category-pills input[data-ln-filter-key]').length);
		assert(pills === 8, `8 filter pills (reset + 7 categories) (got ${pills})`);
	});

	await guarded('ln-icon: sprite and on-demand loading', async () => {
		const sprite = await page.evaluate(() => {
			const s = document.getElementById('ln-icon-sprite');
			if (!s) return null;
			return {
				first: document.body.firstElementChild === s,
				hidden: s.hasAttribute('hidden'),
				ariaHidden: s.getAttribute('aria-hidden'),
				hasDefs: !!s.querySelector('defs')
			};
		});
		assert(sprite !== null, '#ln-icon-sprite exists');
		assert(sprite.first, 'Sprite is the first child of <body>');
		assert(sprite.hidden, 'Sprite has the hidden attribute');
		assert(sprite.ariaHidden === 'true', 'Sprite has aria-hidden="true"');
		assert(sprite.hasDefs, 'Sprite contains <defs>');

		const hrefs = await tablerHrefs();
		assert(hrefs.length > 0, `Page references Tabler icons (${hrefs.length} distinct)`);
		await page.waitForFunction(n => document.querySelectorAll('#ln-icon-sprite defs symbol').length >= n,
			{ timeout: 10000 }, hrefs.length);
		const ids = await symbolIds();
		const missing = hrefs.filter(h => ids.indexOf(h.slice(1)) === -1);
		assert(missing.length === 0, `Every referenced Tabler icon has a <symbol> in the sprite (missing: ${missing.join(', ') || 'none'})`);

		const sym = await page.evaluate(() => {
			const s = document.querySelector('#ln-icon-sprite symbol[id="ln-icon-home"]');
			return s && {
				viewBox: s.getAttribute('viewBox'),
				stroke: s.getAttribute('stroke'),
				strokeWidth: s.getAttribute('stroke-width'),
				linecap: s.getAttribute('stroke-linecap'),
				linejoin: s.getAttribute('stroke-linejoin'),
				fill: s.getAttribute('fill'),
				hasPath: !!s.querySelector('path')
			};
		});
		assert(sym !== null, 'Symbol #ln-icon-home exists');
		assert(sym.viewBox === '0 0 24 24', 'Symbol copies viewBox from the SVG');
		assert(sym.stroke === 'currentColor' && sym.fill === 'none', 'Symbol copies stroke/fill attributes');
		assert(sym.strokeWidth === '2' && sym.linecap === 'round' && sym.linejoin === 'round', 'Symbol copies stroke-width/linecap/linejoin');
		assert(sym.hasPath, 'Symbol contains the SVG inner content');

		assert(cdnRequests.indexOf(CDN_PREFIX + 'home.svg') !== -1, 'Fetched home.svg from the pinned Tabler CDN base');
		assert(cdnRequests.every(u => u.indexOf(CDN_PREFIX) === 0), 'Every CDN request targets the Tabler base path');
		assert(cdnRequests.length === hrefs.length, `One fetch per distinct icon (${cdnRequests.length} vs ${hrefs.length})`);

		const cache = await page.evaluate(() => ({
			ver: localStorage.getItem('lni:v'),
			home: localStorage.getItem('lni:ln-icon-home')
		}));
		assert(cache.ver === '1', 'localStorage lni:v cache version is "1"');
		assert(cache.home === SYNTHETIC_SVG, 'Fetched SVG cached under lni:ln-icon-home');
	});

	await guarded('ln-icon: custom icons without LN_ICON_CUSTOM_CDN', async () => {
		const ids = await symbolIds();
		for (const href of CUSTOM_HREFS) {
			assert(ids.indexOf(href.slice(1)) === -1, `No symbol created for ${href}`);
			assert(warnings.some(w => w.indexOf('Custom icon requested but no CUSTOM_CDN configured') !== -1 && w.indexOf(href) !== -1),
				`console.warn emitted for ${href}`);
		}
		assert(cdnRequests.every(u => u.indexOf('custom') === -1), 'No fetch attempted for custom icons');
	});

	await guarded('ln-icon: MutationObserver picks up runtime icons', async () => {
		await page.evaluate(() => {
			const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svg.setAttribute('class', 'ln-icon');
			svg.setAttribute('id', 'test-added-icon');
			const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
			use.setAttribute('href', '#ln-icon-bolt');
			svg.appendChild(use);
			document.body.appendChild(svg);
		});
		await waitSymbol('ln-icon-bolt');
		assert(true, 'Dynamically added <use href="#ln-icon-bolt"> gets a symbol');
		assert(cdnRequests.indexOf(CDN_PREFIX + 'bolt.svg') !== -1, 'bolt.svg fetched from CDN');

		await page.evaluate(() => {
			document.querySelector('#test-added-icon use').setAttribute('href', '#ln-icon-flag');
		});
		await waitSymbol('ln-icon-flag');
		assert(true, 'Swapping a <use> href at runtime loads the new icon (#ln-icon-flag)');
		assert(cdnRequests.indexOf(CDN_PREFIX + 'flag.svg') !== -1, 'flag.svg fetched from CDN');
		await page.evaluate(() => document.getElementById('test-added-icon').remove());
	});

	await guarded('ln-icon: localStorage cache on reload', async () => {
		const hrefs = await tablerHrefs();
		await load({ clearStorage: false });
		await page.waitForFunction(n => document.querySelectorAll('#ln-icon-sprite defs symbol').length >= n,
			{ timeout: 10000 }, hrefs.length);
		const ids = await symbolIds();
		const missing = hrefs.filter(h => ids.indexOf(h.slice(1)) === -1);
		assert(missing.length === 0, 'Sprite rebuilt from cache for every Tabler icon');
		assert(cdnRequests.length === 0, `Zero CDN requests on a cached reload (got ${cdnRequests.length})`);
	});

	await guarded('Sizes (theme/config/_icons.scss)', async () => {
		const sizes = await page.evaluate(() => {
			const root = parseFloat(getComputedStyle(document.documentElement).fontSize);
			const out = { root };
			document.querySelectorAll('figure.icon-cell').forEach(fig => {
				const svg = fig.querySelector('svg.ln-icon');
				const cs = getComputedStyle(svg);
				out[fig.querySelector('figcaption').textContent.trim()] = [parseFloat(cs.width), parseFloat(cs.height)];
			});
			return out;
		});
		const expect = {
			'ln-icon--sm (1rem)': 1,
			'default (1.25rem)': 1.25,
			'ln-icon--lg (1.5rem)': 1.5,
			'ln-icon--xl (4rem)': 4
		};
		for (const caption of Object.keys(expect)) {
			const px = expect[caption] * sizes.root;
			const got = sizes[caption];
			assert(got && got[0] === px && got[1] === px, `${caption} renders ${px}px square (got ${got})`);
		}
	});

	await guarded('ln-search: filter icon cells', async () => {
		await load({ clearStorage: true });
		await installRecorders();
		assert(await visibleCellCount() === TOTAL_CELLS, 'All 47 cells visible initially');

		await page.click(INPUT);
		await page.keyboard.type('arrow');
		await waitCells(3);
		const texts = await visibleCellTexts();
		assert(sameSet(texts, ['#ln-arrow-up', '#ln-arrow-down', '#ln-arrows-sort']), `"arrow" matches the 3 arrow cells (got ${texts.join(', ')})`);

		const attr = await page.evaluate(() => document.getElementById('icon-categories').getAttribute('data-ln-search'));
		assert(attr === 'arrow', 'data-ln-search on #icon-categories mirrors the input value');

		const hiddenAttr = await page.evaluate(() => document.querySelectorAll('#icon-categories .icon-cell[data-ln-search-hide="true"]').length);
		assert(hiddenAttr === TOTAL_CELLS - 3, `Non-matching cells carry data-ln-search-hide="true" (${hiddenAttr})`);

		const outside = await page.evaluate(() => Array.from(document.querySelectorAll('figure.icon-cell')).every(c => c.checkVisibility()));
		assert(outside, 'Size cells outside #icon-categories are unaffected by search');

		const evts = await events('ln-search:change');
		assert(evts.length > 0 && evts[evts.length - 1].detail.term === 'arrow' && evts[evts.length - 1].detail.targetId === 'icon-categories',
			'ln-search:change fired with term "arrow" and targetId "icon-categories"');

		await page.type(INPUT, ' up');
		await waitCells(1);
		const multi = await visibleCellTexts();
		assert(multi.length === 1 && multi[0] === '#ln-arrow-up', `Multi-token "arrow up" narrows to #ln-arrow-up (got ${multi.join(', ')})`);

		await page.focus(INPUT);
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.type('ARROW');
		await waitCells(3);
		assert(await visibleCellCount() === 3, 'Search is case-insensitive ("ARROW" -> 3)');

		await page.focus(INPUT);
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.type('zzzz');
		await waitCells(0);
		assert(await visibleCellCount() === 0, 'No-match term hides every cell');

		await page.click(CLEAR);
		await waitCells(TOTAL_CELLS);
		{ const n = await visibleCellCount(); assert(n === TOTAL_CELLS, `Clear button restores all 47 cells (got ${n})`); }
		const cleared = await page.evaluate(() => ({
			value: document.querySelector('input[data-ln-search-for="icon-categories"]').value,
			attr: document.getElementById('icon-categories').getAttribute('data-ln-search'),
			focused: document.activeElement === document.querySelector('input[data-ln-search-for="icon-categories"]')
		}));
		assert(cleared.value === '' && cleared.attr === '', 'Clear empties the input and data-ln-search');
		assert(cleared.focused, 'Clear refocuses the input');
	});

	await guarded('ln-filter: category pills', async () => {
		await load({ clearStorage: true });
		await installRecorders();

		assert(sameSet(await pillChecked(), ['(reset)']), 'Only the "All" reset pill is checked initially');
		assert(sameSet(await visibleCategories(), CATEGORIES), 'All 7 category sections visible initially');

		await clickPill('actions');
		await waitCategories(['actions']);
		assert(sameSet(await visibleCategories(), ['actions']), 'Checking "Actions" shows only the actions section');
		assert(sameSet(await pillChecked(), ['actions']), 'Reset pill unchecks when a category is checked');
		const values = await page.evaluate(() => document.querySelector('nav[data-ln-filter="icon-categories"]').getAttribute('data-ln-filter-values'));
		assert(values === 'actions', 'data-ln-filter-values on the nav mirrors the active value');
		const hide = await page.evaluate(() => document.querySelectorAll('#icon-categories > section[data-ln-filter-hide="true"]').length);
		assert(hide === 6, `Six other sections carry data-ln-filter-hide="true" (got ${hide})`);
		let ev = await events('ln-filter:change');
		assert(ev.length > 0 && ev[ev.length - 1].detail.key === 'category'
			&& sameSet(ev[ev.length - 1].detail.values, ['actions'])
			&& ev[ev.length - 1].detail.targetId === 'icon-categories',
		'ln-filter:change detail { key: "category", values: ["actions"], targetId: "icon-categories" }');

		await clickPill('arrows');
		await waitCategories(['actions', 'arrows']);
		assert(sameSet(await visibleCategories(), ['actions', 'arrows']), 'Checking "Arrows" too shows both sections (OR within key)');
		assert(await visibleCellCount() === 22, 'Visible cells = 19 actions + 3 arrows');

		// Combined with search: filter hides sections, search hides cells.
		await page.click(INPUT);
		await page.keyboard.type('down');
		await waitCells(2);
		const combo = await visibleCellTexts();
		assert(sameSet(combo, ['#ln-download', '#ln-arrow-down']), `Filter + search compose: "down" within actions+arrows -> #ln-download, #ln-arrow-down (got ${combo.join(', ')})`);
		await page.click(CLEAR);
		await waitCells(22);

		await clickPill('actions');
		await clickPill('arrows');
		await waitCategories(CATEGORIES);
		assert(sameSet(await pillChecked(), ['(reset)']), 'Unchecking every category re-checks the reset pill');
		assert(sameSet(await visibleCategories(), CATEGORIES), 'All sections visible again after unchecking all');
		const resets = await events('ln-filter:reset');
		assert(resets.length > 0 && resets[resets.length - 1].detail.targetId === 'icon-categories', 'ln-filter:reset fired on return to the reset state');
		assert(await page.evaluate(() => !document.querySelector('nav[data-ln-filter="icon-categories"]').hasAttribute('data-ln-filter-values')),
			'data-ln-filter-values removed on reset');

		await clickPill('status');
		await waitCategories(['status']);
		await clickPill(null);
		await waitCategories(CATEGORIES);
		assert(sameSet(await pillChecked(), ['(reset)']), 'Clicking "All" clears the checked category');
		assert(sameSet(await visibleCategories(), CATEGORIES), 'Clicking "All" shows every section');

		for (const cat of CATEGORIES) await clickPill(cat);
		await page.waitForFunction(() => Array.from(document.querySelectorAll('nav[data-ln-filter="icon-categories"] input[data-ln-filter-key]'))
			.filter(i => i.checked).length === 1, { timeout: 5000 }).catch(() => {});
		assert(sameSet(await pillChecked(), ['(reset)']), 'Checking all 7 categories collapses back to "All"');
		assert(sameSet(await visibleCategories(), CATEGORIES), 'All sections visible after checking all 7');
	});

	if (failures.length > 0) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
