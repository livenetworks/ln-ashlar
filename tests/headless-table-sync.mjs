import puppeteer from 'puppeteer-core';
import { existsSync } from 'node:fs';

const CHROME_PATH = [
	'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
	'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
	'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe'
].find(p => existsSync(p));

if (!CHROME_PATH) {
	console.error('No compatible browser executable found.');
	process.exit(1);
}

const URL = 'http://localhost/ln-ashlar/demo/admin/table-sync.html';

async function run() {
	console.log(`Starting Headless Chrome via: ${CHROME_PATH}`);
	const browser = await puppeteer.launch({
		executablePath: CHROME_PATH,
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 1280, height: 900 });

	const pageErrors = [];

	page.on('pageerror', err => {
		pageErrors.push(err.message);
		console.error(`  [BROWSER UNCAUGHT ERROR]`, err.message);
	});

	console.log(`Navigating to ${URL}...`);
	await page.goto(URL, { waitUntil: 'networkidle2' });

	async function getTableStats() {
		return page.evaluate(() => {
			const rows = Array.from(document.querySelectorAll('#hybrid-table tbody tr:not(.ln-table__spacer):not(.ln-table__placeholder)'));
			const totalEl = document.querySelector('#hybrid-table [data-ln-table-total]');
			const filteredEl = document.querySelector('#hybrid-table [data-ln-table-filtered]');
			const filteredWrap = filteredEl?.closest('span.hidden') || filteredEl?.parentElement;
			const isFilteredHidden = filteredWrap?.classList.contains('hidden') || false;
			const loading = document.getElementById('hybrid-table').classList.contains('ln-table--loading');
			const rowCount = rows.length;
			const sampleTitles = rows.slice(0, 5).map(r => r.cells[1]?.textContent?.trim() || '');
			const sampleDepts = rows.slice(0, 5).map(r => r.cells[2]?.textContent?.trim() || '');
			return {
				loading,
				rowCount,
				totalText: totalEl?.textContent?.trim() || '',
				filteredText: filteredEl?.textContent?.trim() || '',
				isFilteredHidden,
				sampleTitles,
				sampleDepts
			};
		});
	}

	function assert(condition, message) {
		if (!condition) {
			console.error(`❌ Assertion failed: ${message}`);
			throw new Error(`Assertion failed: ${message}`);
		}
		console.log(`  ✓ ${message}`);
	}

	// 1. Initial SSR State Check
	console.log('\n--- 1. Testing Initial SSR State ---');
	const initialStats = await getTableStats();
	console.log('Initial stats:', initialStats);
	assert(initialStats.totalText === '10,000', 'Total items is 10,000');
	assert(initialStats.isFilteredHidden === true, 'Filtered span is initially hidden');
	assert(initialStats.rowCount > 0, `Table rendered ${initialStats.rowCount} visible rows`);
	assert(initialStats.sampleTitles[0] === 'Security Policy #1', 'First row is Security Policy #1');

	// 2. Testing Search ("Risk")
	console.log('\n--- 2. Testing Search ("Risk") ---');
	const searchInput = await page.$('input[data-ln-search-for="hybrid-docs"]');
	assert(!!searchInput, 'Search input found');
	await searchInput.click();
	await searchInput.type('Risk', { delay: 40 });
	console.log('Typed "Risk", waiting for query debounce & network response...');
	await new Promise(r => setTimeout(r, 1800));

	const searchStats = await getTableStats();
	console.log('After Search "Risk":', searchStats);
	assert(searchStats.filteredText === '625', 'Filtered count is 625');
	assert(searchStats.isFilteredHidden === false, 'Filtered count is visible');
	assert(searchStats.sampleTitles.every(t => t.toLowerCase().includes('risk')), 'All sample rows contain "Risk" in title');

	// 3. Clear Search via Clear Button
	console.log('\n--- 3. Testing Clear Search via Button ---');
	await page.evaluate(() => {
		const btn = document.querySelector('#hybrid-table button[data-ln-search-clear]');
		if (btn) btn.click();
	});
	console.log('Clicked clear search button, waiting for query to reset...');
	await new Promise(r => setTimeout(r, 1800));

	const clearedStats = await getTableStats();
	console.log('After Clear Search:', clearedStats);
	assert(clearedStats.totalText === '10,000', 'Total items restored to 10,000');
	assert(clearedStats.isFilteredHidden === true, 'Filtered count is hidden again');
	assert(clearedStats.sampleTitles[0] === 'Security Policy #1', 'First row reverted to Security Policy #1');

	// 4. Testing Filter (Department: HR)
	console.log('\n--- 4. Testing Department Filter ("HR") ---');
	await page.evaluate(() => {
		const hr = document.querySelector('#filter-hybrid-dept-list input[data-ln-filter-value="HR"]');
		if (hr) hr.click();
	});
	console.log('Selected HR filter, waiting for network response...');
	await new Promise(r => setTimeout(r, 1800));

	const hrStats = await getTableStats();
	console.log('After Filter "HR":', hrStats);
	assert(hrStats.filteredText === '1,351', 'Filtered count for HR is 1,351');
	assert(hrStats.sampleDepts.every(d => d === 'HR'), 'All sample rows belong to HR department');

	// 5. Reset Filter (click All)
	console.log('\n--- 5. Resetting Department Filter to "All" ---');
	await page.evaluate(() => {
		const all = document.querySelector('#filter-hybrid-dept-list input[data-ln-filter-reset]');
		if (all) all.click();
	});
	console.log('Clicked All reset filter, waiting for response...');
	await new Promise(r => setTimeout(r, 1800));

	const resetDeptStats = await getTableStats();
	console.log('After Reset Filter:', resetDeptStats);
	assert(resetDeptStats.totalText === '10,000', 'Total items is 10,000');
	assert(resetDeptStats.isFilteredHidden === true, 'Filtered count is hidden');
	assert(resetDeptStats.sampleTitles[0] === 'Security Policy #1', 'First row restored to Security Policy #1');

	// 6. Testing Sort (Title asc -> desc -> none)
	console.log('\n--- 6. Testing Sort (Title ASC) ---');
	await page.evaluate(() => {
		const btn = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="asc"]');
		if (btn) btn.click();
	});
	await new Promise(r => setTimeout(r, 1800));
	const sortAscStats = await getTableStats();
	console.log('After Sort Title ASC:', sortAscStats);
	assert(sortAscStats.sampleTitles[0] === 'Audit Assessment #101', 'First row title ASC is Audit Assessment #101');

	console.log('\n--- 7. Testing Sort (Title DESC) ---');
	await page.evaluate(() => {
		const btn = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="desc"]');
		if (btn) btn.click();
	});
	await new Promise(r => setTimeout(r, 1800));
	const sortDescStats = await getTableStats();
	console.log('After Sort Title DESC:', sortDescStats);
	assert(sortDescStats.sampleTitles[0] === 'Vendor Analysis #9998', 'First row title DESC is Vendor Analysis #9998');

	console.log('\n--- 8. Testing Sort (Title NONE / Reset) ---');
	await page.evaluate(() => {
		const btn = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="none"]');
		if (btn) btn.click();
	});
	await new Promise(r => setTimeout(r, 1800));
	const sortNoneStats = await getTableStats();
	console.log('After Sort Title NONE:', sortNoneStats);
	assert(sortNoneStats.sampleTitles[0] === 'Security Policy #1', 'First row title NONE reset to Security Policy #1');

	// 9. Testing Combined: Search ("Audit") + Filter ("Finance") + Sort ("Title asc")
	console.log('\n--- 9. Testing Combined: Search "Audit" + Filter "Finance" + Sort "Title asc" ---');
	await page.evaluate(() => {
		const input = document.querySelector('input[data-ln-search-for="hybrid-docs"]');
		if (input) {
			input.value = 'Audit';
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
		const fin = document.querySelector('#filter-hybrid-dept-list input[data-ln-filter-value="Finance"]');
		if (fin) fin.click();

		const sortAsc = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="asc"]');
		if (sortAsc) sortAsc.click();
	});
	await new Promise(r => setTimeout(r, 2200));
	const combinedStats = await getTableStats();
	console.log('After Combined Query:', combinedStats);
	assert(combinedStats.sampleTitles.every(t => t.toLowerCase().includes('audit')), 'All combined rows contain "Audit" in title');
	assert(combinedStats.sampleDepts.every(d => d === 'Finance'), 'All combined rows belong to Finance department');

	// 10. Check Integration Log on Page for infinite loops
	const pageLogTerminal = await page.evaluate(() => {
		const el = document.getElementById('hybrid-log');
		return el ? el.textContent.trim().split('\n').slice(-10) : [];
	});
	console.log('\n--- Final Integration Log Terminal Snippet ---');
	pageLogTerminal.forEach(l => console.log('  ', l));

	await browser.close();

	console.log('\n=== Summary ===');
	console.log(`Uncaught page errors: ${pageErrors.length}`);
	assert(pageErrors.length === 0, 'Zero uncaught page errors');
	console.log('\n🎉 ALL HEADLESS BROWSER TABLE TESTS PASSED SUCCESSFULLY! 🎉');
}

run().catch(err => {
	console.error('\n❌ Headless test failed:', err);
	process.exit(1);
});
