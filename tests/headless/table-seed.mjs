import { run, BASE_URL, assert, sleep } from './_harness.mjs';

run('Table Seed Injected Mode (table-seed.html) — Functional Verification', async ({ page }) => {
	let networkCalls = 0;
	page.on('request', req => {
		if (req.url().includes('api.php') || req.url().includes('data/')) networkCalls++;
	});

	await page.goto(BASE_URL + 'table-seed.html', { waitUntil: 'load' });
	await sleep(500);

	// 1. Initial State & In-Memory Ingestion
	console.log('\n--- 1. Initial Ingestion & Pool Verification ---');
	const initial = await page.evaluate(() => {
		const table = document.getElementById('seed-table');
		const totalEl = table.querySelector('[data-ln-table-total]');
		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const topSpacer = table.querySelector('tr.ln-table__spacer:first-child td');
		const bottomSpacer = table.querySelector('tr.ln-table__spacer:last-child td');
		const firstRowTitle = poolRows[0]?.querySelector('strong')?.textContent;

		return {
			total: totalEl?.textContent?.replace(/\D/g, ''),
			poolCount: poolRows.length,
			firstRowTitle,
			topSpacerHeight: parseInt(topSpacer?.style.height || '0', 10),
			bottomSpacerHeight: parseInt(bottomSpacer?.style.height || '0', 10)
		};
	});

	assert(initial.total === '10000', `Table total count is 10,000 (got ${initial.total})`);
	assert(initial.poolCount > 15 && initial.poolCount <= 60, `DOM row pool is recycled (~30-40 elements, got ${initial.poolCount})`);
	assert(initial.topSpacerHeight === 0, 'Initial top spacer is 0px');
	assert(initial.bottomSpacerHeight > 300000, `Initial bottom spacer simulates remaining 10k rows (> 300,000px, got ${initial.bottomSpacerHeight}px)`);
	assert(networkCalls === 0, 'Strictly zero secondary network requests (pure in-memory dataset)');

	// 2. Fast In-Memory Search
	console.log('\n--- 2. In-Memory Search ---');
	const searchResult = await page.evaluate(async () => {
		const searchInput = document.querySelector('input[data-ln-search-for="seed-docs"]');
		searchInput.value = 'Vendor Analysis';
		searchInput.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise(r => setTimeout(r, 200));

		const table = document.getElementById('seed-table');
		const filteredEl = table.querySelector('[data-ln-table-filtered]');
		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const titles = Array.from(poolRows).slice(0, 5).map(r => r.querySelector('strong')?.textContent);

		return {
			filtered: filteredEl?.textContent?.replace(/\D/g, ''),
			poolCount: poolRows.length,
			titles
		};
	});

	assert(searchResult.filtered === '625', `Search for "Vendor Analysis" filtered to 625 items (got ${searchResult.filtered})`);
	assert(searchResult.titles.every(t => t.includes('Vendor Analysis')), 'All visible rows match search query');

	// 3. Reset Search
	await page.evaluate(async () => {
		const searchInput = document.querySelector('input[data-ln-search-for="seed-docs"]');
		searchInput.value = '';
		searchInput.dispatchEvent(new Event('input', { bubbles: true }));
		await new Promise(r => setTimeout(r, 200));
	});

	// 4. Column Sorting
	console.log('\n--- 3. Column Sorting ---');
	const sortResult = await page.evaluate(async () => {
		const btnAsc = document.querySelector('ul[data-ln-sort-field="title"] button[data-ln-sort-dir="asc"]');
		btnAsc.click();
		await new Promise(r => setTimeout(r, 200));

		const table = document.getElementById('seed-table');
		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const firstTitles = Array.from(poolRows).slice(0, 3).map(r => r.querySelector('strong')?.textContent);

		return { firstTitles };
	});

	assert(sortResult.firstTitles[0].startsWith('Audit Assessment'), `Alphabetical sort correctly orders titles (got ${sortResult.firstTitles[0]})`);

	// 5. Column Filter Popover
	console.log('\n--- 4. Column Filter Popover ---');
	const filterResult = await page.evaluate(async () => {
		const deptCb = document.querySelector('#filter-seed-dept-list input[data-ln-filter-value="Legal"]');
		deptCb.click();
		await new Promise(r => setTimeout(r, 200));

		const table = document.getElementById('seed-table');
		const filteredEl = table.querySelector('[data-ln-table-filtered]');
		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const depts = Array.from(poolRows).slice(0, 5).map(r => r.cells[2]?.textContent);
		const filterBtn = table.querySelector('th[data-ln-table-col="department"] [data-ln-table-col-filter]');

		return {
			filtered: filteredEl?.textContent?.replace(/\D/g, ''),
			hasActiveIndicator: filterBtn?.classList.contains('ln-filter-active'),
			depts
		};
	});

	assert(filterResult.hasActiveIndicator, 'Department filter funnel button toggles .ln-filter-active');
	assert(filterResult.depts.every(d => d === 'Legal'), `All filtered rows belong to Legal department (sample: ${filterResult.depts.join(', ')})`);

	// Reset Department filter
	await page.evaluate(async () => {
		const resetCb = document.querySelector('#filter-seed-dept-list input[data-ln-filter-reset]');
		resetCb.click();
		await new Promise(r => setTimeout(r, 200));
	});

	// 6. Virtual Scrolling & Dynamic Row Pool Updates
	console.log('\n--- 5. Virtual Scrolling & Row Recycling ---');
	const scrollDown = await page.evaluate(async () => {
		const table = document.getElementById('seed-table');
		table.scrollTop = 5000 * 40; // Row ~5000
		table.dispatchEvent(new Event('scroll'));
		await new Promise(r => requestAnimationFrame(r));
		await new Promise(r => setTimeout(r, 100));

		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const topSpacer = table.querySelector('tr.ln-table__spacer:first-child td');
		const middleIds = Array.from(poolRows).slice(0, 5).map(r => parseInt(r.getAttribute('data-ln-table-row-id'), 10));

		return {
			poolCount: poolRows.length,
			topSpacerHeight: parseInt(topSpacer?.style.height || '0', 10),
			middleIds
		};
	});

	assert(scrollDown.poolCount > 15 && scrollDown.poolCount <= 60, `Pool size remains constant during scroll (got ${scrollDown.poolCount})`);
	assert(scrollDown.topSpacerHeight > 180000, `Top spacer expands to emulate scrolled offset (> 180,000px, got ${scrollDown.topSpacerHeight}px)`);
	assert(scrollDown.middleIds[0] > 100, `Middle rows dynamically updated in pool (first row id: ${scrollDown.middleIds[0]})`);

	// Scroll back to top
	const scrollUp = await page.evaluate(async () => {
		const table = document.getElementById('seed-table');
		table.scrollTop = 0;
		table.dispatchEvent(new Event('scroll'));
		await new Promise(r => requestAnimationFrame(r));
		await new Promise(r => setTimeout(r, 100));

		const poolRows = table.querySelectorAll('tbody tr:not(.ln-table__spacer)');
		const topSpacer = table.querySelector('tr.ln-table__spacer:first-child td');
		const firstId = poolRows[0]?.getAttribute('data-ln-table-row-id');

		return {
			topSpacerHeight: parseInt(topSpacer?.style.height || '0', 10),
			firstId
		};
	});

	assert(scrollUp.topSpacerHeight === 0, 'Top spacer returns to 0px on scroll back to top');
	assert(scrollUp.firstId === '1' || scrollUp.firstId === '5', `Row pool safely recycled back to top item (id: ${scrollUp.firstId})`);

	// 7. Checkbox Selection State
	console.log('\n--- 6. Row Selection ---');
	const selection = await page.evaluate(async () => {
		const table = document.getElementById('seed-table');
		const firstCb = table.querySelector('tbody tr:not(.ln-table__spacer) input[data-ln-table-row-select]');
		firstCb.click();
		await new Promise(r => setTimeout(r, 100));

		const selectedSpan = table.querySelector('[data-ln-table-selected]');
		const selectedCount = selectedSpan?.textContent;
		const isRowSelected = firstCb.closest('tr')?.classList.contains('ln-row-selected');

		return {
			selectedCount,
			isRowSelected
		};
	});

	assert(selection.selectedCount === '1', `Selection count updated to 1 (got ${selection.selectedCount})`);
	assert(selection.isRowSelected, 'Selected row receives .ln-row-selected class');

	console.log('\n✓ ALL TABLE SEED FUNCTIONAL TESTS PASSED!');
});
