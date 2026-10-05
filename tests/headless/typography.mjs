import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/typography.html (source demo/admin/src/pages/typography.html).
// Driver: CSS only. The page's content is static markup (headings, text, code,
// lists, a font-size token table); it has no live library component demo and
// no inline mock script. This is a smoke test: page loads, structural elements
// exist with their authored text, zero uncaught page errors.

const PAGE_URL = BASE_URL + 'typography.html';

// Texts read from the page source.
const HEADINGS = [
	['h1', 'h1 — Main heading (2.25rem)'],
	['h2', 'h2 — Secondary (1.5rem)'],
	['h3', 'h3 — Sub-heading (1.25rem)'],
	['h4', 'h4 — Smaller heading (1.125rem)'],
	['h5', 'h5 — Small heading (1rem, semibold)'],
	['h6', 'h6 — Smallest (0.875rem, semibold)']
];
const TOKENS = ['--text-xs', '--text-sm', '--text-base', '--text-lg', '--text-xl', '--text-2xl'];

run('demo/admin/typography.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('section.section-card').length > 0, { timeout: 10000 });

	section('Page structure');
	const pageH1 = await page.evaluate(() => document.querySelector('h1') && document.querySelector('h1').textContent.trim());
	assert(pageH1 === 'Typography', 'Page h1 reads "Typography"');

	const cardTitles = await page.evaluate(() => Array.from(document.querySelectorAll('section.section-card > header > h3'))
		.map(h => h.textContent.trim()));
	for (const t of ['Overview & Philosophy', 'Headings', 'Text', 'Code', 'Lists', 'Font Size Tokens']) {
		assert(cardTitles.includes(t), `Section card "${t}" present`);
	}

	section('Headings');
	for (const [tag, text] of HEADINGS) {
		const found = await page.evaluate((t, txt) => Array.from(document.querySelectorAll(`section.section-card main ${t}`))
			.some(el => el.textContent.trim() === txt), tag, text);
		assert(found, `${tag} sample "${text}" present`);
	}

	section('Text and code');
	const textFacts = await page.evaluate(() => ({
		strong: !!Array.from(document.querySelectorAll('main p strong')).find(e => e.textContent === 'bold text'),
		em: !!Array.from(document.querySelectorAll('main p em')).find(e => e.textContent === 'italic text'),
		small: !!Array.from(document.querySelectorAll('main p small')).find(e => e.textContent === 'small text'),
		link: !!Array.from(document.querySelectorAll('main p a[href="#"]')).find(e => e.textContent === 'Example link'),
		quote: !!Array.from(document.querySelectorAll('main blockquote')).find(e => e.textContent.trim() === 'Blockquote — a quote with a left border in primary color.'),
		inlineCode: !!Array.from(document.querySelectorAll('main p code')).find(e => e.textContent === 'var(--color-primary)'),
		preCode: !!Array.from(document.querySelectorAll('main pre > code')).find(e => e.textContent.startsWith('.card header {'))
	}));
	assert(textFacts.strong, 'strong "bold text" present');
	assert(textFacts.em, 'em "italic text" present');
	assert(textFacts.small, 'small "small text" present');
	assert(textFacts.link, 'Link "Example link" present');
	assert(textFacts.quote, 'Blockquote present');
	assert(textFacts.inlineCode, 'Inline code "var(--color-primary)" present');
	assert(textFacts.preCode, 'pre > code block present');

	section('Lists');
	const lists = await page.evaluate(() => ({
		ul: Array.from(document.querySelectorAll('section.prose > ul > li')).map(li => li.textContent.trim()),
		ol: Array.from(document.querySelectorAll('section.prose > ol > li')).map(li => li.textContent.trim())
	}));
	assert(JSON.stringify(lists.ul) === JSON.stringify(['First item', 'Second item', 'Third item']), 'Unordered list has 3 items in order');
	assert(JSON.stringify(lists.ol) === JSON.stringify(['First step', 'Second step', 'Third step']), 'Ordered list has 3 steps in order');

	section('Font size tokens table');
	const tokens = await page.evaluate(() => Array.from(document.querySelectorAll('.table-container table tbody tr'))
		.map(tr => tr.cells[0].textContent.trim()));
	assert(JSON.stringify(tokens) === JSON.stringify(TOKENS), 'Token table lists 6 tokens in order xs..2xl');
});
