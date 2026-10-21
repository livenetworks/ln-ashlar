// JS Components Performance & Benchmark Suite Runner
// Measures interaction latency, DOM node churn, and JS heap memory across CSS engines.
// Automatically compares with previous benchmark runs and saves historical trends.
//
// Usage:
//   node tests/headless/perf-run.mjs              # Benchmark all interactive JS components
//   node tests/headless/perf-run.mjs forms modal  # Benchmark specific components
//   node tests/headless/perf-run.mjs --history    # View historical benchmark runs
//   node tests/headless/perf-run.mjs --compare    # Detailed diff of last two runs
//   node tests/headless/perf-run.mjs --iterations=3

import { PAGE_SPECS, getPageSpec } from './_page_specs.mjs';
import { benchmarkComponent } from './perf-harness.mjs';
import {
	loadHistory,
	getLatestRun,
	saveRun,
	compareWithPrevious,
	HISTORY_FILE
} from './perf-history-manager.mjs';
import { launchBrowser } from './_dual_harness.mjs';

const args = process.argv.slice(2);

// Check for --history command
if (args.includes('--history')) {
	showHistoryTimeline();
	process.exit(0);
}

// Check for --compare command
if (args.includes('--compare')) {
	showLastRunsComparison();
	process.exit(0);
}

// Parse options
const noSave = args.includes('--no-save');
let iterations = 1;
const iterArg = args.find(a => a.startsWith('--iterations='));
if (iterArg) {
	const parsed = parseInt(iterArg.split('=')[1], 10);
	if (!isNaN(parsed) && parsed > 0) iterations = parsed;
}

// Target components (only interactive specs)
const allInteractiveNames = Object.keys(PAGE_SPECS)
	.filter(name => PAGE_SPECS[name].interactive)
	.sort();

let targetNames = allInteractiveNames;
const specifiedNames = args.filter(a => !a.startsWith('--'));
if (specifiedNames.length > 0) {
	targetNames = specifiedNames.filter(n => allInteractiveNames.includes(n));
	if (targetNames.length === 0) {
		console.error(`No interactive JS components matched the provided arguments: ${specifiedNames.join(', ')}`);
		console.error(`Available interactive components: ${allInteractiveNames.join(', ')}`);
		process.exit(1);
	}
}

const previousRun = getLatestRun();

console.log(`\n===============================================================`);
console.log(`⚡ JS COMPONENTS PERFORMANCE & BENCHMARK SUITE`);
console.log(`Target: ${targetNames.length} interactive JS components (${iterations} iteration(s) per engine)`);
if (previousRun) {
	console.log(`Historical Baseline: ${previousRun.id} (${new Date(previousRun.timestamp).toLocaleString()})`);
	if (previousRun.git?.commit) console.log(`Baseline Commit: ${previousRun.git.commit} on ${previousRun.git.branch}`);
} else {
	console.log(`Historical Baseline: None (first run will establish baseline in ${HISTORY_FILE})`);
}
console.log(`===============================================================\n`);

// Shared browser instance for fast consecutive benchmarks
const { browser } = await launchBrowser();
const benchmarks = {};
let regressionsCount = 0;

try {
	for (const name of targetNames) {
		process.stdout.write(`Benchmarking ${name.padEnd(22)} `);
		const spec = getPageSpec(name);

		try {
			const res = await benchmarkComponent(spec, { iterations, browser });
			benchmarks[name] = res;

			// Compare with previous run for live feedback
			const prevBench = previousRun?.benchmarks?.[name];
			let prevComparison = '';
			if (prevBench && prevBench.tailwindMs > 0) {
				const delta = res.tailwindMs - prevBench.tailwindMs;
				const deltaPct = ((delta / prevBench.tailwindMs) * 100).toFixed(1);
				if (delta < -2) {
					prevComparison = ` | Δ prev: \x1b[32m${delta.toFixed(1)}ms (${deltaPct}%)\x1b[0m`;
				} else if (delta > 15 && deltaPct > 20) {
					prevComparison = ` | Δ prev: \x1b[31m+${delta.toFixed(1)}ms (+${deltaPct}%) ⚠️ REGRESSION\x1b[0m`;
					regressionsCount++;
				} else {
					prevComparison = ` | Δ prev: ${delta >= 0 ? '+' : ''}${delta.toFixed(1)}ms (${deltaPct}%)`;
				}
			}

			let speedupTag = '';
			if (res.fasterEngine === 'tailwind') {
				speedupTag = `\x1b[32m[TW +${res.speedupPercent}% faster]\x1b[0m`;
			} else if (res.fasterEngine === 'ashlar') {
				speedupTag = `\x1b[33m[Ashlar +${Math.abs(res.speedupPercent)}% faster]\x1b[0m`;
			} else {
				speedupTag = `[Equal ~0%]`;
			}

			console.log(`Ashlar: ${res.ashlarMs.toFixed(1)}ms | TW: ${res.tailwindMs.toFixed(1)}ms ${speedupTag}${prevComparison}`);
		} catch (err) {
			console.log(`\x1b[31mFAILED (${err.message})\x1b[0m`);
		}
	}
} finally {
	try { await browser.close(); } catch {}
}

// ─────────────────────────────────────────────────────────────
// Summary Table
// ─────────────────────────────────────────────────────────────
const comparisonData = compareWithPrevious(benchmarks, previousRun);

const headers = [
	'Component',
	'Ashlar (ms)',
	'Tailwind (ms)',
	'TW vs Ashlar',
	'Prev TW (ms)',
	'Δ vs Prev',
	'Nodes',
	'Heap (MB)'
];

const rows = [headers];

for (const [name, b] of Object.entries(benchmarks)) {
	const c = comparisonData.comparison[name];
	const deltaStr = c?.deltaTailwindMs !== null
		? `${c.deltaTailwindMs >= 0 ? '+' : ''}${c.deltaTailwindMs}ms (${c.deltaPercent}%)`
		: '-';

	const speedupStr = `${b.speedupPercent >= 0 ? '+' : ''}${b.speedupPercent}%`;
	const prevStr = c?.previousTailwindMs !== null ? `${c.previousTailwindMs}ms` : '-';

	rows.push([
		name,
		`${b.ashlarMs}ms`,
		`${b.tailwindMs}ms`,
		speedupStr,
		prevStr,
		c?.isRegression ? `${deltaStr} ⚠️` : deltaStr,
		`${b.tailwindNodes}`,
		`${b.tailwindHeapMb}`
	]);
}

const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
console.log('\n' + rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));

// Overall statistics
const entries = Object.values(benchmarks);
const totalAshlar = entries.reduce((acc, e) => acc + e.ashlarMs, 0);
const totalTw = entries.reduce((acc, e) => acc + e.tailwindMs, 0);
const avgAshlar = (totalAshlar / entries.length).toFixed(2);
const avgTw = (totalTw / entries.length).toFixed(2);
const overallSpeedup = (((avgAshlar - avgTw) / avgAshlar) * 100).toFixed(1);
const twWins = entries.filter(e => e.fasterEngine === 'tailwind').length;
const ashlarWins = entries.filter(e => e.fasterEngine === 'ashlar').length;

console.log(`\n---------------------------------------------------------------`);
console.log(`📊 SUMMARY METRICS:`);
console.log(`  • Average Latency: Ashlar SCSS = ${avgAshlar}ms | Tailwind v4 = ${avgTw}ms (Tailwind is \x1b[32m${overallSpeedup}%\x1b[0m overall faster)`);
console.log(`  • Engine Wins: Tailwind v4 faster on ${twWins}/${entries.length} components | Ashlar faster on ${ashlarWins}/${entries.length}`);
if (regressionsCount > 0) {
	console.log(`  • ⚠️  Detected \x1b[31m${regressionsCount} performance regression(s)\x1b[0m vs previous run.`);
} else {
	console.log(`  • ✅ Zero performance regressions detected vs previous run.`);
}

// Save run to historical database
if (!noSave) {
	const saved = saveRun(benchmarks, { iterations });
	console.log(`  • 💾 Saved benchmark record to perf-history.json (Run ID: ${saved.id})`);
}
console.log(`---------------------------------------------------------------\n`);

function showHistoryTimeline() {
	const history = loadHistory();
	console.log(`\n===============================================================`);
	console.log(`📜 PERFORMANCE BENCHMARK HISTORICAL TIMELINE`);
	console.log(`File: ${HISTORY_FILE}`);
	console.log(`Total Recorded Runs: ${history.runs.length}`);
	console.log(`===============================================================\n`);

	if (history.runs.length === 0) {
		console.log('No historical runs recorded yet. Run `npm run test:perf` to record the first run.');
		return;
	}

	const rows = [
		['Run ID', 'Date & Time', 'Branch / Commit', 'Components', 'Avg Ashlar', 'Avg Tailwind', 'Overall Δ']
	];

	for (const r of history.runs) {
		const dt = new Date(r.timestamp).toLocaleString();
		const gitStr = `${r.git.branch}@${r.git.commit}`;
		const speedupStr = `${r.summary.overallSpeedupPercent >= 0 ? '+' : ''}${r.summary.overallSpeedupPercent}%`;
		rows.push([
			r.id,
			dt,
			gitStr,
			String(r.summary.totalComponents),
			`${r.summary.avgAshlarMs}ms`,
			`${r.summary.avgTailwindMs}ms`,
			speedupStr
		]);
	}

	const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
	console.log(rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));
	console.log('');
}

function showLastRunsComparison() {
	const history = loadHistory();
	if (history.runs.length < 2) {
		console.log(`\nNeed at least 2 recorded benchmark runs to compare. Currently recorded: ${history.runs.length}`);
		return;
	}

	const prev = history.runs[history.runs.length - 2];
	const curr = history.runs[history.runs.length - 1];

	console.log(`\n===============================================================`);
	console.log(`🔍 BENCHMARK COMPARISON: ${prev.id} ➔ ${curr.id}`);
	console.log(`Baseline Date: ${new Date(prev.timestamp).toLocaleString()} (${prev.git.branch}@${prev.git.commit})`);
	console.log(`Current Date:  ${new Date(curr.timestamp).toLocaleString()} (${curr.git.branch}@${curr.git.commit})`);
	console.log(`===============================================================\n`);

	const rows = [
		['Component', 'Prev Tailwind', 'Curr Tailwind', 'Latency Δ', 'Prev Ashlar', 'Curr Ashlar']
	];

	const allKeys = [...new Set([...Object.keys(prev.benchmarks || {}), ...Object.keys(curr.benchmarks || {})])].sort();

	for (const k of allKeys) {
		const p = prev.benchmarks?.[k];
		const c = curr.benchmarks?.[k];
		if (!p || !c) continue;

		const delta = parseFloat((c.tailwindMs - p.tailwindMs).toFixed(2));
		const deltaPct = ((delta / p.tailwindMs) * 100).toFixed(1);
		const deltaStr = `${delta >= 0 ? '+' : ''}${delta}ms (${deltaPct}%)`;

		rows.push([
			k,
			`${p.tailwindMs}ms`,
			`${c.tailwindMs}ms`,
			deltaStr,
			`${p.ashlarMs}ms`,
			`${c.ashlarMs}ms`
		]);
	}

	const widths = rows[0].map((_, i) => Math.max(...rows.map((row) => row[i].length)));
	console.log(rows.map((row) => row.map((c, i) => c.padEnd(widths[i])).join(' | ')).join('\n'));
	console.log('');
}
