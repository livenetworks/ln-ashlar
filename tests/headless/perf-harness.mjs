// Dedicated Performance Harness for JS Components
// Benchmarks interaction latency, DOM node churn, and JS heap memory
// Compares Ashlar SCSS vs Tailwind v4 with multi-iteration support.

import { launchBrowser, setCssEngine, sleep, BASE_URL } from './_dual_harness.mjs';

/**
 * Measure execution metrics of a page interaction
 */
async function measureInteraction(page, actionFn) {
	// Garbage collection if available, or brief pause for idle heap
	await sleep(50);
	const beforeMetrics = await page.metrics();
	const start = performance.now();
	await actionFn();
	const duration = performance.now() - start;
	const afterMetrics = await page.metrics();

	const heapMb = parseFloat((afterMetrics.JSHeapUsedSize / 1024 / 1024).toFixed(2));
	const nodes = afterMetrics.Nodes;

	return {
		duration: parseFloat(duration.toFixed(2)),
		nodes,
		heapMb
	};
}

/**
 * Benchmark a single interactive component across Ashlar SCSS and Tailwind v4
 * @param {Object} spec - Page spec from _page_specs.mjs
 * @param {Object} options - { iterations: 1, browser: null }
 */
export async function benchmarkComponent(spec, options = {}) {
	const {
		name,
		setup = null,
		interaction = null
	} = spec;

	if (!interaction) {
		throw new Error(`Component "${name}" has no interaction defined in _page_specs.mjs`);
	}

	const iterations = options.iterations || 1;
	const externalBrowser = options.browser;
	let browserInstance = externalBrowser;
	let shouldCloseBrowser = false;

	if (!browserInstance) {
		const b = await launchBrowser();
		browserInstance = b.browser;
		shouldCloseBrowser = true;
	}

	const context = await browserInstance.createBrowserContext();
	const page = await context.newPage();
	await page.setViewport({ width: 1440, height: 900 });

	const pageErrors = [];
	page.on('pageerror', err => {
		pageErrors.push(err.message);
	});

	const url = `${BASE_URL}${name}.html`;

	try {
		// ─────────────────────────────────────────────────────────────
		// 1. ASHLAR SCSS BENCHMARK
		// ─────────────────────────────────────────────────────────────
		await page.evaluateOnNewDocument(() => {
			localStorage.setItem('ln-demo-engine', 'ashlar');
		});
		await page.goto(url, { waitUntil: 'load', timeout: 35000 });
		await sleep(250);

		if (setup) await setup(page, 'ashlar');

		const ashlarSamples = [];
		for (let i = 0; i < iterations; i++) {
			const sample = await measureInteraction(page, () => interaction(page, 'ashlar'));
			ashlarSamples.push(sample);
			if (i < iterations - 1) await sleep(100);
		}

		// ─────────────────────────────────────────────────────────────
		// 2. TAILWIND V4 BENCHMARK
		// ─────────────────────────────────────────────────────────────
		await page.evaluateOnNewDocument(() => {
			localStorage.setItem('ln-demo-engine', 'tailwind');
		});
		await page.goto(url, { waitUntil: 'load', timeout: 35000 });
		await setCssEngine(page, 'tailwind');
		await sleep(250);

		if (setup) await setup(page, 'tailwind');

		const twSamples = [];
		for (let i = 0; i < iterations; i++) {
			const sample = await measureInteraction(page, () => interaction(page, 'tailwind'));
			twSamples.push(sample);
			if (i < iterations - 1) await sleep(100);
		}

		// Calculate averages
		const avgAshlarMs = parseFloat((ashlarSamples.reduce((acc, s) => acc + s.duration, 0) / iterations).toFixed(2));
		const avgTwMs = parseFloat((twSamples.reduce((acc, s) => acc + s.duration, 0) / iterations).toFixed(2));

		const lastAshlar = ashlarSamples[ashlarSamples.length - 1];
		const lastTw = twSamples[twSamples.length - 1];

		let speedupPercent = 0;
		if (avgAshlarMs > 0) {
			speedupPercent = parseFloat((((avgAshlarMs - avgTwMs) / avgAshlarMs) * 100).toFixed(1));
		}

		let fasterEngine = 'equivalent';
		if (avgTwMs < avgAshlarMs * 0.95) fasterEngine = 'tailwind';
		else if (avgAshlarMs < avgTwMs * 0.95) fasterEngine = 'ashlar';

		return {
			name,
			success: pageErrors.length === 0,
			pageErrors,
			ashlarMs: avgAshlarMs,
			tailwindMs: avgTwMs,
			speedupPercent,
			fasterEngine,
			ashlarNodes: lastAshlar.nodes,
			tailwindNodes: lastTw.nodes,
			ashlarHeapMb: lastAshlar.heapMb,
			tailwindHeapMb: lastTw.heapMb,
			samples: {
				ashlar: ashlarSamples.map(s => s.duration),
				tailwind: twSamples.map(s => s.duration)
			}
		};
	} finally {
		try { await page.close(); } catch {}
		try { if (context) await context.close(); } catch {}
		if (shouldCloseBrowser && browserInstance) {
			try { await browserInstance.close(); } catch {}
		}
	}
}
