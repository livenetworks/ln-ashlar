import puppeteer from 'puppeteer-core';
import { existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const BASE_URL = 'http://localhost/ln-ashlar/demo/admin/';

const BROWSER_CANDIDATES = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

export const SCREENSHOTS_DIR = resolve('tests/headless/screenshots');
if (!existsSync(SCREENSHOTS_DIR)) {
	try { mkdirSync(SCREENSHOTS_DIR, { recursive: true }); } catch (_) {}
}

export function assert(condition, message) {
	if (!condition) {
		console.error(`  ✗ Assertion failed: ${message}`);
		throw new Error(`Assertion failed: ${message}`);
	}
	console.log(`  ✓ ${message}`);
}

export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function launchBrowser() {
	const executablePath = BROWSER_CANDIDATES.find(p => existsSync(p));
	if (!executablePath) {
		throw new Error('No compatible browser executable found.');
	}

	const browser = await puppeteer.launch({
		executablePath,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 1440, height: 900 });

	const pageErrors = [];
	page.on('pageerror', err => {
		pageErrors.push(err.message);
		console.error('  [BROWSER ERROR]', err.message);
	});

	return { browser, page, pageErrors };
}

export async function setCssEngine(page, engine) {
	await page.evaluate((eng) => {
		const KEY = 'ln-demo-engine';
		const linkAshlar = document.getElementById('theme-ashlar');
		const linkTailwind = document.getElementById('theme-tailwind');

		document.documentElement.setAttribute('data-css-engine', eng);
		if (eng === 'tailwind') {
			if (linkAshlar) linkAshlar.disabled = true;
			if (linkTailwind) linkTailwind.disabled = false;
		} else {
			if (linkAshlar) linkAshlar.disabled = false;
			if (linkTailwind) linkTailwind.disabled = true;
		}
		try { localStorage.setItem(KEY, eng); } catch (e) {}
	}, engine);

	// Allow browser layout recalculation and paint
	await sleep(150);
}

export async function getLayoutMetrics(page, extraSelectors = [], ignoreSelectors = []) {
	return await page.evaluate(({ selectors, ignored }) => {
		const noHorizontalOverflow = document.documentElement.scrollWidth <= (window.innerWidth + 2);

		const defaultSelectors = [
			'header',
			'main',
			'.section-card',
			'.demo-header',
			'.demo-sidebar',
			'.demo-main'
		];

		const ignoreSet = new Set(ignored || []);
		const targetSelectors = [...new Set([...defaultSelectors, ...selectors])].filter(s => !ignoreSet.has(s));
		const elements = {};

		for (const sel of targetSelectors) {
			const nodeList = Array.from(document.querySelectorAll(sel));
			if (nodeList.length === 0) continue;

			elements[sel] = nodeList.map(el => {
				const rect = el.getBoundingClientRect();
				const style = window.getComputedStyle(el);
				const isCollapsibleClosed = el.classList.contains('collapsible') && !el.classList.contains('open') && el.getAttribute('data-ln-toggle') !== 'open';
				const isToggleClosed = el.hasAttribute('data-ln-toggle') && el.getAttribute('data-ln-toggle') !== 'open';
				const isClosed = isCollapsibleClosed || isToggleClosed;

				return {
					tagName: el.tagName,
					width: Math.round(rect.width),
					height: Math.round(rect.height),
					top: Math.round(rect.top),
					left: Math.round(rect.left),
					visible: !isClosed && rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden',
					isClosed,
					display: style.display
				};
			});
		}

		return {
			noHorizontalOverflow,
			viewportWidth: window.innerWidth,
			scrollWidth: document.documentElement.scrollWidth,
			elements
		};
	}, { selectors: extraSelectors, ignored: ignoreSelectors });
}

export function assertLayoutEquivalence(ashlarLayout, twLayout, pageName) {
	console.log(`\n--- Layout Consistency Check (Ashlar SCSS vs Tailwind v4) ---`);

	// 1. Horizontal overflow check
	assert(ashlarLayout.noHorizontalOverflow, `Ashlar SCSS: No horizontal layout overflow`);
	assert(twLayout.noHorizontalOverflow, `Tailwind v4: No horizontal layout overflow (scrollWidth=${twLayout.scrollWidth}px, viewport=${twLayout.viewportWidth}px)`);

	// 2. Structural elements visibility and proportion
	for (const sel of Object.keys(ashlarLayout.elements)) {
		if (!twLayout.elements[sel]) continue;

		const aList = ashlarLayout.elements[sel];
		const tList = twLayout.elements[sel];

		assert(aList.length === tList.length, `Element count for "${sel}" matches (Ashlar=${aList.length}, Tailwind=${tList.length} items)`);

		for (let i = 0; i < Math.min(aList.length, tList.length); i++) {
			const aEl = aList[i];
			const tEl = tList[i];

			if (aEl.visible) {
				assert(tEl.visible, `"${sel}"[${i}] is visible in both Ashlar and Tailwind`);

				// Check width ratio (layout structure preserved within responsive bounds)
				if (aEl.width > 50) {
					const ratio = tEl.width / aEl.width;
					const withinBounds = ratio >= 0.58 && ratio <= 1.70;
					assert(withinBounds, `"${sel}"[${i}] layout width preserved: Ashlar=${aEl.width}px, Tailwind=${tEl.width}px (ratio=${ratio.toFixed(2)})`);
				}
			}
		}
	}
}

export async function measurePerf(page, actionFn, label) {
	const beforeMetrics = await page.metrics();
	const start = performance.now();
	await actionFn();
	const duration = performance.now() - start;
	const afterMetrics = await page.metrics();

	const heapMb = (afterMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2);
	const nodes = afterMetrics.Nodes;

	console.log(`  ⏱ [PERF] ${label}: ${duration.toFixed(2)}ms (DOM Nodes: ${nodes}, JS Heap: ${heapMb} MB)`);
	return {
		duration,
		nodes,
		heapMb: parseFloat(heapMb),
		metrics: afterMetrics
	};
}

export async function runDualEngineTest({
	name,
	selectors = [],
	ignoreSelectors = [],
	interactive = false,
	setup = null,
	interaction = null,
	captureScreenshot = false
}) {
	console.log(`\n==================================================`);
	console.log(`DUAL ENGINE TEST: ${name} (Ashlar SCSS vs Tailwind v4)`);
	console.log(`Interactive / JS Demo: ${interactive ? 'YES' : 'NO'}`);
	console.log(`==================================================`);

	const { browser, page, pageErrors } = await launchBrowser();
	let failure = null;

	try {
		const url = `${BASE_URL}${name}.html`;

		// ─── 1. ASHLAR SCSS ENGINE ────────────────────────────
		console.log(`\n--- Loading in Ashlar SCSS Mode ---`);
		await page.evaluateOnNewDocument(() => {
			localStorage.setItem('ln-demo-engine', 'ashlar');
		});
		await page.goto(url, { waitUntil: 'load', timeout: 35000 });
		await sleep(200);

		if (setup) {
			await setup(page, 'ashlar');
		}

		// Capture Ashlar layout in initial state (before mutations)
		const ashlarLayout = await getLayoutMetrics(page, selectors, ignoreSelectors);

		if (captureScreenshot) {
			const p = join(SCREENSHOTS_DIR, `${name}-ashlar.png`);
			await page.screenshot({ path: p, fullPage: false });
		}

		let ashlarPerf = null;
		if (interactive && interaction) {
			console.log(`\n--- Running Interactive Action (Ashlar SCSS) ---`);
			ashlarPerf = await measurePerf(page, () => interaction(page, 'ashlar'), `Ashlar Interaction`);
		}

		// ─── 2. TAILWIND V4 ENGINE ────────────────────────────
		console.log(`\n--- Switching to Tailwind v4 Mode ---`);
		// Reset to clean page in Tailwind mode
		await page.evaluateOnNewDocument(() => {
			localStorage.setItem('ln-demo-engine', 'tailwind');
		});
		await page.goto(url, { waitUntil: 'load', timeout: 35000 });
		await setCssEngine(page, 'tailwind');
		await sleep(200);

		if (setup) {
			await setup(page, 'tailwind');
		}

		// Capture Tailwind layout in initial state (before mutations)
		const twLayout = await getLayoutMetrics(page, selectors, ignoreSelectors);

		// 3. Layout similarity assertion on identical initial state
		assertLayoutEquivalence(ashlarLayout, twLayout, name);

		let twPerf = null;
		if (interactive && interaction) {
			console.log(`\n--- Running Interactive Action (Tailwind v4) ---`);
			twPerf = await measurePerf(page, () => interaction(page, 'tailwind'), `Tailwind Interaction`);

			console.log(`\n--- Performance Comparison (Ashlar vs Tailwind) ---`);
			console.log(`  Ashlar SCSS: ${ashlarPerf.duration.toFixed(2)}ms, ${ashlarPerf.nodes} nodes`);
			console.log(`  Tailwind v4: ${twPerf.duration.toFixed(2)}ms, ${twPerf.nodes} nodes`);

			// Tailwind interaction time shouldn't take more than 3.5x Ashlar time
			assert(twPerf.duration < Math.max(ashlarPerf.duration * 3.5, 300), `Tailwind execution duration is performant (${twPerf.duration.toFixed(2)}ms)`);
		}

		if (captureScreenshot) {
			const p = join(SCREENSHOTS_DIR, `${name}-tailwind.png`);
			await page.screenshot({ path: p, fullPage: false });
		}

		assert(pageErrors.length === 0, `Zero uncaught browser page errors (got ${pageErrors.length})`);

	} catch (err) {
		failure = err;
	} finally {
		await browser.close().catch(() => {});
	}

	if (failure) {
		console.error(`\n❌ FAILED DUAL TEST: ${name}\n`, failure);
		process.exit(1);
	}

	console.log(`\n✅ PASSED DUAL TEST: ${name}`);
}
