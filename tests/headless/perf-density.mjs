// Dashboard Density Change Performance & Benchmark Suite
// Measures latency, reflow time, rendering frame times, and memory churn
// when switching data-density (compact / comfortable / spacious) via the Dashboard menu.
// Compares Ashlar SCSS vs Tailwind v4 engines on the full Dashboard page (demo/admin/index.html).
//
// Usage:
//   node tests/headless/perf-density.mjs                # Run full dual-engine benchmark (3 iterations)
//   node tests/headless/perf-density.mjs --iterations=5 # Run 5 iterations for tighter statistics
//   node tests/headless/perf-density.mjs --engine=ashlar # Benchmark Ashlar SCSS only
//   node tests/headless/perf-density.mjs --engine=tailwind # Benchmark Tailwind v4 only
//   node tests/headless/perf-density.mjs --rapid=20     # Rapid cycle stress test with 20 switches

import { launchBrowser, setCssEngine, sleep, BASE_URL } from './_dual_harness.mjs';

const args = process.argv.slice(2);

// Parse options
let iterations = 3;
const iterArg = args.find(a => a.startsWith('--iterations='));
if (iterArg) {
	const parsed = parseInt(iterArg.split('=')[1], 10);
	if (!isNaN(parsed) && parsed > 0) iterations = parsed;
}

let rapidSwitches = 10;
const rapidArg = args.find(a => a.startsWith('--rapid='));
if (rapidArg) {
	const parsed = parseInt(rapidArg.split('=')[1], 10);
	if (!isNaN(parsed) && parsed > 0) rapidSwitches = parsed;
}

let targetEngine = 'both';
const engineArg = args.find(a => a.startsWith('--engine='));
if (engineArg) {
	const eng = engineArg.split('=')[1].toLowerCase();
	if (['ashlar', 'tailwind', 'both'].includes(eng)) {
		targetEngine = eng;
	}
}

const DASHBOARD_URL = `${BASE_URL}index.html`;

/**
 * Measure transition latency when switching density
 * @param {Page} page Puppeteer page
 * @param {string} targetDensity 'compact' | 'comfortable' | 'spacious'
 * @param {boolean} viaMenu If true, opens popover and clicks the menu button; if false, directly triggers click
 */
async function measureDensitySwitch(page, targetDensity, viaMenu = true) {
	return await page.evaluate(async (density, useMenu) => {
		const trigger = document.getElementById('demo-density-trigger');
		const popover = document.getElementById('demo-density-picker');
		const targetBtn = document.querySelector(`[data-demo-density="${density}"]`);
		const root = document.documentElement;

		if (!targetBtn) {
			throw new Error(`Density button [data-demo-density="${density}"] not found`);
		}

		let menuOpenDuration = 0;
		if (useMenu && trigger && popover) {
			const menuStart = performance.now();
			trigger.click();
			// Wait for popover to register open
			let openChecks = 0;
			while (openChecks < 20 && popover.getAttribute('data-ln-popover') !== 'open') {
				await new Promise(r => setTimeout(r, 5));
				openChecks++;
			}
			menuOpenDuration = performance.now() - menuStart;
		}

		// Measure pure click + reflow + frame render
		const start = performance.now();
		targetBtn.click();

		// Force synchronous style recalculation & layout reflow to isolate reflow time
		const reflowStart = performance.now();
		const _h = root.offsetHeight; // Forces style recalc + layout flush
		const reflowDuration = performance.now() - reflowStart;

		// Wait for next 2 animation frames to ensure GPU commit and full paint render
		await new Promise(resolve => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve();
				});
			});
		});

		const totalDuration = performance.now() - start;
		const appliedDensity = root.getAttribute('data-density');

		return {
			targetDensity: density,
			appliedDensity,
			menuOpenMs: parseFloat(menuOpenDuration.toFixed(2)),
			reflowMs: parseFloat(reflowDuration.toFixed(2)),
			totalRenderMs: parseFloat(totalDuration.toFixed(2)),
			success: appliedDensity === density
		};
	}, targetDensity, viaMenu);
}

/**
 * Measure rapid cycling stress test
 */
async function measureRapidCycling(page, count) {
	return await page.evaluate(async (switchCount) => {
		const densities = ['compact', 'spacious', 'comfortable'];
		const timings = [];
		const root = document.documentElement;
		const startHeap = performance.memory ? performance.memory.usedJSHeapSize : 0;
		const overallStart = performance.now();

		for (let i = 0; i < switchCount; i++) {
			const target = densities[i % densities.length];
			const btn = document.querySelector(`[data-demo-density="${target}"]`);
			if (!btn) continue;

			const t0 = performance.now();
			btn.click();
			const _ = root.offsetHeight; // flush reflow
			await new Promise(r => requestAnimationFrame(r));
			const duration = performance.now() - t0;
			timings.push(duration);
		}

		const overallDuration = performance.now() - overallStart;
		const endHeap = performance.memory ? performance.memory.usedJSHeapSize : 0;
		const avgMs = timings.reduce((a, b) => a + b, 0) / timings.length;
		const minMs = Math.min(...timings);
		const maxMs = Math.max(...timings);

		return {
			switchCount,
			overallDurationMs: parseFloat(overallDuration.toFixed(2)),
			avgMs: parseFloat(avgMs.toFixed(2)),
			minMs: parseFloat(minMs.toFixed(2)),
			maxMs: parseFloat(maxMs.toFixed(2)),
			heapDeltaMb: parseFloat(((endHeap - startHeap) / 1024 / 1024).toFixed(3))
		};
	}, count);
}

/**
 * Benchmark a single CSS engine
 */
async function benchmarkEngine(page, engine, iterations, rapidCount) {
	console.log(`\n---------------------------------------------------------------`);
	console.log(`⚙️  TESTING ENGINE: ${engine.toUpperCase()}`);
	console.log(`---------------------------------------------------------------`);

	await page.evaluateOnNewDocument((eng) => {
		localStorage.setItem('ln-demo-engine', eng);
		localStorage.setItem('ln-demo-density', 'comfortable');
	}, engine);

	await page.goto(DASHBOARD_URL, { waitUntil: 'load', timeout: 35000 });
	await setCssEngine(page, engine);
	await sleep(300);

	// Verify density buttons exist
	const buttonsCount = await page.evaluate(() => document.querySelectorAll('[data-demo-density]').length);
	if (buttonsCount !== 3) {
		throw new Error(`Expected 3 density buttons in dashboard menu, found: ${buttonsCount}`);
	}

	const transitions = [
		{ from: 'comfortable', to: 'compact', label: 'comfortable → compact (Compaction)' },
		{ from: 'compact', to: 'spacious', label: 'compact → spacious (Expansion)' },
		{ from: 'spacious', to: 'comfortable', label: 'spacious → comfortable (Restoration)' }
	];

	const transitionResults = {};
	for (const t of transitions) {
		transitionResults[t.label] = {
			menuOpenSamples: [],
			reflowSamples: [],
			totalRenderSamples: []
		};
	}

	// Warmup run
	await measureDensitySwitch(page, 'compact', true);
	await measureDensitySwitch(page, 'comfortable', true);
	await sleep(100);

	console.log(`Running ${iterations} iteration(s) across transitions...`);

	for (let iter = 1; iter <= iterations; iter++) {
		process.stdout.write(`  [Iteration ${iter}/${iterations}] `);
		// Ensure starting at comfortable
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-density', 'comfortable');
		});
		await sleep(50);

		for (const t of transitions) {
			const res = await measureDensitySwitch(page, t.to, true);
			if (!res.success) {
				console.error(`\nFailed to apply density "${t.to}" on ${engine}`);
			}
			transitionResults[t.label].menuOpenSamples.push(res.menuOpenMs);
			transitionResults[t.label].reflowSamples.push(res.reflowMs);
			transitionResults[t.label].totalRenderSamples.push(res.totalRenderMs);
			await sleep(50);
		}
		console.log(`✓ done`);
	}

	// Calculate averages
	const aggregated = {};
	for (const [label, samples] of Object.entries(transitionResults)) {
		const avgReflow = samples.reflowSamples.reduce((a, b) => a + b, 0) / samples.reflowSamples.length;
		const avgTotal = samples.totalRenderSamples.reduce((a, b) => a + b, 0) / samples.totalRenderSamples.length;
		const avgMenu = samples.menuOpenSamples.reduce((a, b) => a + b, 0) / samples.menuOpenSamples.length;
		aggregated[label] = {
			reflowMs: parseFloat(avgReflow.toFixed(2)),
			totalRenderMs: parseFloat(avgTotal.toFixed(2)),
			menuOpenMs: parseFloat(avgMenu.toFixed(2))
		};
	}

	// Rapid cycling stress test
	console.log(`Running rapid cycling stress test (${rapidCount} consecutive switches)...`);
	const rapidResult = await measureRapidCycling(page, rapidCount);

	const metrics = await page.metrics();
	const heapMb = parseFloat((metrics.JSHeapUsedSize / 1024 / 1024).toFixed(2));
	const nodes = metrics.Nodes;

	return {
		engine,
		transitions: aggregated,
		rapid: rapidResult,
		heapMb,
		nodes
	};
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXECUTION
// ─────────────────────────────────────────────────────────────────
console.log(`===============================================================`);
console.log(`⚡ DASHBOARD DENSITY SWITCH PERFORMANCE BENCHMARK`);
console.log(`Target Page: demo/admin/index.html (Dashboard)`);
console.log(`Iterations: ${iterations} | Rapid Stress Cycles: ${rapidSwitches}`);
console.log(`Engine Mode: ${targetEngine.toUpperCase()}`);
console.log(`===============================================================`);

const { browser } = await launchBrowser();
const context = await browser.createBrowserContext();
const page = await context.newPage();
await page.setViewport({ width: 1440, height: 900 });

const pageErrors = [];
page.on('pageerror', err => pageErrors.push(err.message));

let ashlarResult = null;
let tailwindResult = null;

try {
	if (targetEngine === 'both' || targetEngine === 'ashlar') {
		ashlarResult = await benchmarkEngine(page, 'ashlar', iterations, rapidSwitches);
	}

	if (targetEngine === 'both' || targetEngine === 'tailwind') {
		tailwindResult = await benchmarkEngine(page, 'tailwind', iterations, rapidSwitches);
	}

	// ─────────────────────────────────────────────────────────────
	// REPORT PRESENTATION
	// ─────────────────────────────────────────────────────────────
	console.log(`\n===============================================================`);
	console.log(`📊 BENCHMARK RESULTS SUMMARY`);
	console.log(`===============================================================`);

	if (ashlarResult && tailwindResult) {
		console.log(`\n1. TRANSITION LATENCY BREAKDOWN (Averages across ${iterations} iterations):\n`);
		console.log(
			`Transition`.padEnd(38) +
			`Ashlar Total`.padEnd(14) +
			`Ashlar Reflow`.padEnd(15) +
			`TW Total`.padEnd(12) +
			`TW Reflow`.padEnd(13) +
			`Speedup`
		);
		console.log('-'.repeat(105));

		const transitionKeys = Object.keys(ashlarResult.transitions);
		let totalAshlarTotal = 0;
		let totalTailwindTotal = 0;

		for (const key of transitionKeys) {
			const a = ashlarResult.transitions[key];
			const t = tailwindResult.transitions[key];
			totalAshlarTotal += a.totalRenderMs;
			totalTailwindTotal += t.totalRenderMs;

			const speedup = ((a.totalRenderMs - t.totalRenderMs) / a.totalRenderMs * 100);
			const speedupStr = speedup >= 0
				? `\x1b[32m+${speedup.toFixed(1)}% (TW)\x1b[0m`
				: `\x1b[33m+${Math.abs(speedup).toFixed(1)}% (Ashlar)\x1b[0m`;

			console.log(
				`${key.padEnd(38)}` +
				`${(a.totalRenderMs.toFixed(2) + 'ms').padEnd(14)}` +
				`${(a.reflowMs.toFixed(2) + 'ms').padEnd(15)}` +
				`${(t.totalRenderMs.toFixed(2) + 'ms').padEnd(12)}` +
				`${(t.reflowMs.toFixed(2) + 'ms').padEnd(13)}` +
				`${speedupStr}`
			);
		}

		const overallSpeedup = ((totalAshlarTotal - totalTailwindTotal) / totalAshlarTotal * 100);
		console.log('-'.repeat(105));
		console.log(
			`AVERAGE TOTAL LATENCY`.padEnd(38) +
			`${((totalAshlarTotal / transitionKeys.length).toFixed(2) + 'ms').padEnd(14)}` +
			` `.padEnd(15) +
			`${((totalTailwindTotal / transitionKeys.length).toFixed(2) + 'ms').padEnd(12)}` +
			` `.padEnd(13) +
			(overallSpeedup >= 0 ? `\x1b[32m+${overallSpeedup.toFixed(1)}% (TW)\x1b[0m` : `\x1b[33m+${Math.abs(overallSpeedup).toFixed(1)}% (Ashlar)\x1b[0m`)
		);

		console.log(`\n2. RAPID SWITCHING STRESS TEST (${rapidSwitches} consecutive toggles):\n`);
		console.log(
			`Metric`.padEnd(25) +
			`Ashlar SCSS`.padEnd(16) +
			`Tailwind v4`.padEnd(16) +
			`Comparison`
		);
		console.log('-'.repeat(75));

		console.log(
			`Avg Switch Latency`.padEnd(25) +
			`${(ashlarResult.rapid.avgMs.toFixed(2) + 'ms').padEnd(16)}` +
			`${(tailwindResult.rapid.avgMs.toFixed(2) + 'ms').padEnd(16)}` +
			(ashlarResult.rapid.avgMs > tailwindResult.rapid.avgMs
				? `\x1b[32mTailwind ${(ashlarResult.rapid.avgMs / tailwindResult.rapid.avgMs).toFixed(1)}x faster\x1b[0m`
				: `\x1b[33mAshlar ${(tailwindResult.rapid.avgMs / ashlarResult.rapid.avgMs).toFixed(1)}x faster\x1b[0m`)
		);

		console.log(
			`Min / Max Latency`.padEnd(25) +
			`${(ashlarResult.rapid.minMs + ' / ' + ashlarResult.rapid.maxMs + 'ms').padEnd(16)}` +
			`${(tailwindResult.rapid.minMs + ' / ' + tailwindResult.rapid.maxMs + 'ms').padEnd(16)}` +
			`-`
		);

		console.log(
			`Total Stress Duration`.padEnd(25) +
			`${(ashlarResult.rapid.overallDurationMs.toFixed(1) + 'ms').padEnd(16)}` +
			`${(tailwindResult.rapid.overallDurationMs.toFixed(1) + 'ms').padEnd(16)}` +
			`-`
		);

		console.log(
			`JS Heap Memory`.padEnd(25) +
			`${(ashlarResult.heapMb.toFixed(2) + ' MB').padEnd(16)}` +
			`${(tailwindResult.heapMb.toFixed(2) + ' MB').padEnd(16)}` +
			`-`
		);

		console.log(
			`DOM Nodes`.padEnd(25) +
			`${String(ashlarResult.nodes).padEnd(16)}` +
			`${String(tailwindResult.nodes).padEnd(16)}` +
			`-`
		);

	} else {
		const single = ashlarResult || tailwindResult;
		console.log(`Engine: ${single.engine.toUpperCase()}`);
		console.log(`Transitions:`);
		for (const [k, v] of Object.entries(single.transitions)) {
			console.log(`  • ${k}: Total = ${v.totalRenderMs}ms (Reflow = ${v.reflowMs}ms, Menu Open = ${v.menuOpenMs}ms)`);
		}
		console.log(`Rapid Cycling (${rapidSwitches} switches):`);
		console.log(`  • Avg = ${single.rapid.avgMs}ms | Min = ${single.rapid.minMs}ms | Max = ${single.rapid.maxMs}ms`);
		console.log(`  • Heap = ${single.heapMb} MB | Nodes = ${single.nodes}`);
	}

	console.log(`\n===============================================================`);
	if (pageErrors.length > 0) {
		console.warn(`⚠️  Page errors recorded (${pageErrors.length}):`);
		pageErrors.forEach(err => console.warn(`   - ${err}`));
	} else {
		console.log(`✅ Benchmark completed with ZERO page errors!`);
	}
	console.log(`===============================================================\n`);

} finally {
	await browser.close();
}
