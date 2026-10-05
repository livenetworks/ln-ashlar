import { run, assert, BASE_URL } from './_harness.mjs';

// Static/visual page: every fact below is read from demo/admin/src/pages/cards.html.
// Smoke test only - the page has no interactive components.

const PAGE_URL = BASE_URL + 'cards.html';

// [section id, expected direct <article> children, expected modifier classes in order]
const CARD_GROUPS = [
	['demo-basic-cards', 2, ['', '']],
	['demo-accent-top', 4, ['', 'success', 'error', 'warning']],
	['demo-accent-left', 4, ['', 'success', 'error', 'info']],
	['demo-accent-bottom', 4, ['', 'success', 'warning', 'error']],
	['demo-tinted', 4, ['', 'success', 'error', 'warning']],
	['demo-stat-cards', 4, ['', 'success', 'warning', 'error']],
	['demo-stacked', 2, ['', '']],
	['demo-full-cards', 2, ['', '']],
	['demo-secondary', 4, ['secondary', 'secondary', '', '']]
];

run('demo/admin/cards.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.getElementById('demo-flat-stack'), { timeout: 10000 });

	section('Card groups');
	for (const [id, count, classes] of CARD_GROUPS) {
		const found = await page.evaluate(sectionId => {
			const host = document.getElementById(sectionId);
			if (!host) return null;
			return Array.from(host.children)
				.filter(el => el.tagName === 'ARTICLE')
				.map(el => el.className.trim());
		}, id);
		assert(found !== null, `#${id} exists`);
		assert(found.length === count, `#${id} has ${count} articles (got ${found && found.length})`);
		assert(JSON.stringify(found) === JSON.stringify(classes), `#${id} article modifier classes are ${JSON.stringify(classes)}`);
	}

	section('Stat cards');
	const stats = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-stat-cards article')).map(a => [
		a.querySelector('.stat-value').textContent.trim(),
		a.querySelector('.stat-label').textContent.trim(),
		a.querySelector('.stat-change').textContent.trim()
	]));
	assert(JSON.stringify(stats) === JSON.stringify([
		['1,234', 'Total Users', '+12%'],
		['892', 'Active', '+5%'],
		['48', 'Pending', '+2'],
		['3', 'Errors', '-1']
	]), 'Stat cards show value/label/change from markup');

	section('Full cards');
	const full = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-full-cards article')).map(a => ({
		header: a.querySelector(':scope > header h3').textContent.trim(),
		body: !!a.querySelector(':scope > main p'),
		buttons: Array.from(a.querySelectorAll(':scope > footer button')).map(b => b.textContent.trim())
	})));
	assert(JSON.stringify(full) === JSON.stringify([
		{ header: 'User Profile', body: true, buttons: ['Cancel', 'Save'] },
		{ header: 'Settings', body: true, buttons: ['Apply'] }
	]), 'Full cards have header, body and footer buttons');

	section('Card with fields');
	const fields = await page.evaluate(() => {
		const host = document.getElementById('demo-card-fields');
		const cards = Array.from(host.querySelectorAll('.card'));
		return {
			cards: cards.length,
			fieldCounts: cards.map(c => c.querySelectorAll('.field').length),
			link: !!host.querySelector('.card > a[href="#"]'),
			badge: host.querySelector('.badge.success').textContent.trim()
		};
	});
	assert(fields.cards === 3, 'Three .card elements');
	assert(JSON.stringify(fields.fieldCounts) === JSON.stringify([3, 3, 2]), 'Fields per card are 3, 3, 2');
	assert(fields.link, 'Third card wraps content in a link');
	assert(fields.badge === 'Active', 'Status badge reads Active');

	section('Secondary brand accent');
	const secButtons = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-secondary-buttons > button'))
		.map(b => [b.className, b.textContent.trim()]));
	assert(JSON.stringify(secButtons) === JSON.stringify([
		['secondary', 'Secondary Action'],
		['secondary', 'Secondary Submit']
	]), 'Two secondary buttons');

	section('Flat stack');
	const flat = await page.evaluate(() => {
		const ul = document.querySelector('#demo-flat-stack ul.flat-stack');
		return ul ? Array.from(ul.children).map(li => li.tagName + ':' + li.querySelectorAll(':scope > article').length) : null;
	});
	assert(flat !== null, 'ul.flat-stack exists');
	assert(JSON.stringify(flat) === JSON.stringify(['LI:1', 'LI:1', 'LI:1']), 'Flat stack has three li each holding one article');

	section('Page structure');
	const sections = await page.evaluate(() => document.querySelectorAll('section.section-card').length);
	assert(sections === 12, `12 section-card blocks (got ${sections})`);
});
