import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/src/pages/ajax.html is a documentation-only page: it has no live
// ln-ajax demo (the data-ln-ajax markup appears only inside <pre><code> samples).
// This is therefore a smoke test of the page structure, taken from that source.

const PAGE_URL = BASE_URL + 'ajax.html';
const SECTION_TITLES = [
	'Overview & Philosophy',
	'Basics',
	'AJAX Links',
	'AJAX Forms',
	'JSON Response Protocol',
	'CSS classes for loading state',
	'CSRF Token',
	'API',
	'Events'
];
const LIFECYCLE_EVENTS = [
	'ln-ajax:before-start',
	'ln-ajax:start',
	'ln-ajax:success',
	'ln-ajax:error',
	'ln-ajax:complete',
	'ln-ajax:aborted'
];
const RESPONSE_FIELDS = ['title', 'content', 'message'];

run('demo/admin/ajax.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('section.section-card').length > 0, { timeout: 10000 });

	section('Page shell');
	const title = await page.title();
	assert(title === 'AJAX — ln-ashlar', `Document title is "AJAX — ln-ashlar" (got "${title}")`);
	const h1 = await page.evaluate(() => (document.querySelector('h1') || {}).textContent);
	assert(h1 && h1.trim() === 'AJAX', 'h1 reads "AJAX"');

	section('Section cards');
	const headings = await page.evaluate(() => Array.from(document.querySelectorAll('section.section-card > header h3'))
		.map(h => h.textContent.trim()));
	assert(headings.length === SECTION_TITLES.length, `${SECTION_TITLES.length} section cards present (got ${headings.length})`);
	assert(headings.every((h, i) => h === SECTION_TITLES[i]), 'Section headings match source order');

	section('Basics table');
	const basics = await page.evaluate(() => {
		const card = Array.from(document.querySelectorAll('section.section-card'))
			.find(s => s.querySelector('header h3').textContent.trim() === 'Basics');
		return Array.from(card.querySelectorAll('tbody tr')).map(tr => tr.querySelector('code').textContent.trim());
	});
	assert(basics.length === 2, 'Basics table has 2 attribute rows');
	assert(basics[0] === 'data-ln-ajax' && basics[1] === 'data-ln-ajax="false"', 'Basics rows list data-ln-ajax and data-ln-ajax="false"');

	section('JSON response protocol table');
	const fields = await page.evaluate(() => {
		const card = Array.from(document.querySelectorAll('section.section-card'))
			.find(s => s.querySelector('header h3').textContent.trim() === 'JSON Response Protocol');
		return Array.from(card.querySelectorAll('tbody tr')).map(tr => tr.querySelector('code').textContent.trim());
	});
	assert(fields.length === RESPONSE_FIELDS.length && fields.every((f, i) => f === RESPONSE_FIELDS[i]),
		'Response fields are title, content, message');

	section('Lifecycle events table');
	const events = await page.evaluate(() => {
		const card = Array.from(document.querySelectorAll('section.section-card'))
			.find(s => s.querySelector('header h3').textContent.trim() === 'Events');
		return Array.from(card.querySelectorAll('tbody tr')).map(tr => tr.querySelector('code').textContent.trim());
	});
	assert(events.length === LIFECYCLE_EVENTS.length && events.every((e, i) => e === LIFECYCLE_EVENTS[i]),
		'Events table lists the 6 ln-ajax lifecycle events in order');

	section('Code samples');
	const preCount = await page.evaluate(() => document.querySelectorAll('section.section-card pre > code').length);
	assert(preCount === 8, `8 code samples present (got ${preCount})`);
});
