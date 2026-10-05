import { run, assert, BASE_URL } from './_harness.mjs';

// Smoke test. data-ln-empty-state is a CSS-only attribute (no component in components/ln-*
// mounts it; ln-filter/ln-sort only skip it as a non-data row). All facts below are read from
// demo/admin/src/pages/empty-state.html.

const PAGE_URL = BASE_URL + 'empty-state.html';

run('demo/admin/empty-state.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForSelector('#demo-empty-variants [data-ln-empty-state]', { timeout: 10000 });

	section('Both Variants');
	const variants = await page.evaluate(() => Array.from(
		document.querySelectorAll('#demo-empty-variants [data-ln-empty-state]')
	).map(el => ({
		value: el.getAttribute('data-ln-empty-state'),
		title: el.querySelector('h3')?.textContent.trim(),
		desc: el.querySelector('p')?.textContent.trim(),
		button: el.querySelector('button[type="button"]')?.textContent.trim(),
		icon: el.querySelector('svg.ln-icon use')?.getAttribute('href'),
		visible: getComputedStyle(el).display !== 'none'
	})));
	assert(variants.length === 2, 'Two variants in #demo-empty-variants');
	assert(variants[0].value === 'no-data', 'First variant is no-data');
	assert(variants[0].title === 'No documents yet', 'no-data title text');
	assert(variants[0].desc === 'Upload your first document to get started.', 'no-data description text');
	assert(variants[0].button === 'Upload document', 'no-data action button text');
	assert(variants[0].icon === '#ln-icon-folder', 'no-data icon is folder');
	assert(variants[1].value === 'no-results', 'Second variant is no-results');
	assert(variants[1].title === 'No matches', 'no-results title text');
	assert(variants[1].desc === 'Try a different search or clear your filters.', 'no-results description text');
	assert(variants[1].button === 'Clear filters', 'no-results action button text');
	assert(variants[1].icon === '#ln-icon-search', 'no-results icon is search');
	assert(variants.every(v => v.visible), 'Both variants are rendered (not display:none)');

	section('Table contexts');
	const tables = await page.evaluate(() => Array.from(document.querySelectorAll('.table-container table')).map(t => {
		const el = t.querySelector('tbody td[colspan="4"] > [data-ln-empty-state]');
		return {
			heads: Array.from(t.querySelectorAll('thead th')).map(th => th.textContent.trim()),
			rows: t.querySelectorAll('tbody tr').length,
			value: el?.getAttribute('data-ln-empty-state'),
			title: el?.querySelector('h3')?.textContent.trim(),
			button: el?.querySelector('button')?.textContent.trim(),
			visible: el ? getComputedStyle(el).display !== 'none' : false
		};
	}));
	assert(tables.length === 2, 'Two table-context demos');
	assert(tables.every(t => t.heads.join('|') === 'Name|Type|Date|Size'), 'Both tables have Name/Type/Date/Size headers');
	assert(tables.every(t => t.rows === 1), 'Each table has a single tbody row holding the empty state');
	assert(tables[0].value === 'no-data' && tables[0].title === 'No files uploaded' && tables[0].button === 'Upload file',
		'no-data table context content');
	assert(tables[1].value === 'no-results' && tables[1].title === 'No matches for "contract"' && tables[1].button === 'Clear search',
		'no-results table context content');
	assert(tables.every(t => t.visible), 'Table-context empty states are rendered');

	section('Minimal');
	const minimal = await page.evaluate(() => {
		const el = Array.from(document.querySelectorAll('[data-ln-empty-state]'))
			.find(e => e.getAttribute('data-ln-empty-state') === '' && e.querySelector('h3')?.textContent.trim() === 'Nothing here yet');
		return el ? {
			hasIcon: !!el.querySelector('svg.ln-icon'),
			hasP: !!el.querySelector('p'),
			hasButton: !!el.querySelector('button'),
			visible: getComputedStyle(el).display !== 'none'
		} : null;
	});
	assert(minimal !== null, 'Minimal empty state (bare attribute) exists');
	assert(minimal.hasIcon && !minimal.hasP && !minimal.hasButton, 'Minimal has icon + title only');
	assert(minimal.visible, 'Minimal empty state is rendered');
});
