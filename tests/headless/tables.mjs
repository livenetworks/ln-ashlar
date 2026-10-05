import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/src/pages/tables.html is a static CSS showcase (table-base, section rows,
// striped + actions). It mounts no data-ln-* table components, so this is a smoke test:
// the page loads, the three demo tables exist with the markup counted from the source,
// and there are no uncaught page errors (checked by the harness).

const PAGE_URL = BASE_URL + 'tables.html';

run('demo/admin/tables.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('.app-main table').length > 0, { timeout: 10000 });

	section('Page shell');
	const heading = await page.evaluate(() => document.querySelector('h1').textContent.trim());
	assert(heading === 'Tables', 'h1 is "Tables"');
	assert((await page.title()) === 'Tables — ln-ashlar', 'document title is "Tables — ln-ashlar"');

	section('Basic table');
	const basic = await page.evaluate(() => {
		const t = document.querySelectorAll('.app-main table')[0];
		return {
			head: Array.from(t.tHead.rows[0].cells).map(c => c.textContent.trim()),
			rows: t.tBodies[0].rows.length,
			badges: t.querySelectorAll('tbody span.badge').length,
			numeric: t.querySelectorAll('tbody td.numeric').length,
			firstName: t.tBodies[0].rows[0].cells[0].textContent.trim(),
			labels: Array.from(t.tBodies[0].rows[0].cells).map(c => c.getAttribute('data-label'))
		};
	});
	assert(basic.head.join('|') === 'Name|Email|Status|Points', 'header: Name, Email, Status, Points');
	assert(basic.rows === 4, '4 body rows');
	assert(basic.badges === 4, '4 status badges');
	assert(basic.numeric === 4, '4 numeric cells');
	assert(basic.firstName === 'Marko Petrovski', 'first row name cell text');
	assert(basic.labels.join('|') === 'Name|Email|Status|Points', 'cells carry data-label for mobile stacking');

	section('Section rows');
	const sec = await page.evaluate(() => {
		const t = document.querySelectorAll('.app-main table')[1];
		const headers = Array.from(t.querySelectorAll('tr.section-header'));
		return {
			rows: t.tBodies[0].rows.length,
			headers: headers.map(r => r.textContent.trim()),
			colspan: headers.map(r => r.cells[0].getAttribute('colspan'))
		};
	});
	assert(sec.rows === 7, '7 body rows (2 section headers + 5 data rows)');
	assert(sec.headers.join('|') === 'Network|System', 'section headers: Network, System');
	assert(sec.colspan.every(c => c === '3'), 'section header cells span 3 columns');

	section('Striped + actions');
	const act = await page.evaluate(() => {
		const t = document.querySelectorAll('.app-main table')[2];
		return {
			rows: t.tBodies[0].rows.length,
			lists: t.querySelectorAll('ul.actions').length,
			buttons: t.querySelectorAll('ul.actions li > button.action').length,
			primary: t.querySelectorAll('button.action.primary').length,
			danger: t.querySelectorAll('button.action.danger').length,
			docs: Array.from(t.tBodies[0].rows).map(r => r.cells[0].textContent.trim())
		};
	});
	assert(act.rows === 2, '2 body rows');
	assert(act.docs.join('|') === 'Contract.pdf|Invoice.pdf', 'documents: Contract.pdf, Invoice.pdf');
	assert(act.lists === 2 && act.buttons === 4, '2 ul.actions with 4 action buttons');
	assert(act.primary === 2 && act.danger === 2, '2 primary and 2 danger action buttons');
});
