import { run, assert, BASE_URL } from './_harness.mjs';

// Static page: demo/admin/src/pages/prose.html has no interactive components, only an
// <article class="prose"> showcase of semantic HTML. Smoke test of its structure.
// Counts are read from that markup.

const PAGE_URL = BASE_URL + 'prose.html';

run('demo/admin/prose.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	const count = selector => page.evaluate(
		sel => document.querySelector('article.prose').querySelectorAll(sel).length,
		selector
	);

	section('Page load');
	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForSelector('article.prose', { timeout: 10000 });
	assert(await count('h1') === 1, 'prose article has 1 h1');

	section('Headings');
	assert(await page.evaluate(() => document.querySelector('article.prose h1').textContent.trim()) === 'Document Title (h1)', 'h1 text is "Document Title (h1)"');
	assert(await count('h2') === 7, 'prose article has 7 h2');
	assert(await count('h3') === 1, 'prose article has 1 h3');
	assert(await count('h4') === 1, 'prose article has 1 h4');

	section('Text and separators');
	assert(await count('hr') === 2, 'prose article has 2 hr');
	assert(await count('a[href="#"]') === 1, 'prose article has 1 link');
	assert(await count('strong') === 1, 'prose article has 1 strong');
	assert(await count('em') === 1, 'prose article has 1 em');

	section('Lists');
	assert(await count('ul > li') === 3, 'unordered list has 3 items');
	assert(await count('ol > li') === 3, 'ordered list has 3 items');

	section('Blockquote and code block');
	assert(await count('blockquote') === 1, 'prose article has 1 blockquote');
	assert(await count('pre > code') === 1, 'prose article has 1 pre > code block');
	assert(await page.evaluate(() => document.querySelector('article.prose pre > code').textContent.includes("fetch('/api/documents/123')")), 'code block contains the fetch sample');

	section('Figure');
	assert(await count('figure > img[alt="ln-ashlar logo example"]') === 1, 'figure has the logo image');
	assert(await page.evaluate(() => document.querySelector('article.prose figure > figcaption').textContent.trim()) === 'Figure caption styled with the caption typography role', 'figcaption text matches');
	await page.waitForFunction(() => {
		const img = document.querySelector('article.prose figure > img');
		return img.complete && img.naturalWidth > 0;
	}, { timeout: 5000 }).catch(() => {});
	assert(await page.evaluate(() => document.querySelector('article.prose figure > img').naturalWidth > 0), 'figure image loaded');

	section('Table');
	assert(await count('table th') === 3, 'table has 3 headers');
	assert(await count('table tbody tr') === 3, 'table has 3 body rows');
	const firstCol = await page.evaluate(() => Array.from(document.querySelectorAll('article.prose tbody tr')).map(tr => tr.cells[0].textContent.trim()));
	assert(firstCol.join('|') === 'Quality Manual|Risk Register|Incident Procedure', 'first column lists the three documents');

	section('Visibility');
	assert(await page.evaluate(() => {
		const el = document.querySelector('article.prose');
		const r = el.getBoundingClientRect();
		return getComputedStyle(el).display !== 'none' && r.width > 0 && r.height > 0;
	}), 'prose article is rendered');
});
