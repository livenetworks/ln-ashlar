import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const BROWSER_CANDIDATES = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
];

const runsArg = process.argv.find(arg => arg.startsWith('--runs='));
const RUN_COUNT = runsArg ? Math.max(1, parseInt(runsArg.split('=')[1], 10) || 1) : 1;

const URL = 'http://localhost/ln-ashlar/demo/admin/table-seed.html';

async function runBenchmark() {
	const executablePath = BROWSER_CANDIDATES.find(p => existsSync(p));
	if (!executablePath) {
		console.error('No compatible browser executable found.');
		process.exit(1);
	}

	console.log(`\n========================================================================`);
	console.log(`   PERFORMANCE BENCHMARK: Injected Seed Table (10,000 Records)`);
	console.log(`   Target: Filter & Sort JS Execution < 150ms (Free of Debug Overhead)`);
	console.log(`   Runs: ${RUN_COUNT}`);
	console.log(`========================================================================\n`);

	const browser = await puppeteer.launch({
		executablePath,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	try {
		const page = await browser.newPage();
		await page.setViewport({ width: 1280, height: 900 });

		const filterTimes = [];
		const sortTimes = [];

		for (let run = 1; run <= RUN_COUNT; run++) {
			console.log(`--- Run #${run} ---`);
			await page.goto(URL, { waitUntil: 'load' });
			await new Promise(r => setTimeout(r, 600));

			// Measure Filter Performance
			const filterDuration = await page.evaluate(async () => {
				const searchInput = document.querySelector('input[data-ln-search-for="seed-docs"]');
				const t0 = performance.now();
				searchInput.value = 'Vendor Analysis';
				searchInput.dispatchEvent(new Event('input', { bubbles: true }));

				// Wait for debounce and filter update
				await new Promise(resolve => {
					const check = () => {
						const filteredEl = document.querySelector('[data-ln-table-filtered]');
						if (filteredEl && filteredEl.textContent.trim() !== '') {
							resolve();
						} else {
							requestAnimationFrame(check);
						}
					};
					requestAnimationFrame(check);
				});

				const t1 = performance.now();
				return t1 - t0;
			});

			filterTimes.push(filterDuration);
			console.log(`  Filter Execution: ${filterDuration.toFixed(2)} ms`);

			// Measure Sort Performance
			const sortDuration = await page.evaluate(async () => {
				const sortBtn = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="asc"]');
				const t0 = performance.now();
				sortBtn.click();

				await new Promise(resolve => {
					requestAnimationFrame(() => {
						requestAnimationFrame(resolve);
					});
				});

				const t1 = performance.now();
				return t1 - t0;
			});

			sortTimes.push(sortDuration);
			console.log(`  Sort Execution:   ${sortDuration.toFixed(2)} ms\n`);
		}

		const avgFilter = filterTimes.reduce((a, b) => a + b, 0) / filterTimes.length;
		const avgSort = sortTimes.reduce((a, b) => a + b, 0) / sortTimes.length;

		console.log('========================================================================');
		console.log(`  Average Filter Time: ${avgFilter.toFixed(2)} ms (Acceptance: < 150 ms)`);
		console.log(`  Average Sort Time:   ${avgSort.toFixed(2)} ms (Acceptance: < 150 ms)`);
		console.log('========================================================================\n');

		if (avgFilter > 150 || avgSort > 150) {
			console.error(`✗ BENCHMARK FAILED: Performance exceeded 150ms limit.`);
			process.exit(1);
		} else {
			console.log(`✓ BENCHMARK PASSED: All operations completed well below 150ms threshold!`);
		}
	} finally {
		await browser.close();
	}
}

runBenchmark().catch(err => {
	console.error('Benchmark execution error:', err);
	process.exit(1);
});
