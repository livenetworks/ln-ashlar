import { run, assert, BASE_URL } from './_harness.mjs';

// Static/visual page: every fact below is counted from
// demo/admin/src/pages/page-header.html (4 live .ph-wrap demos, no JS behavior).

const PAGE_URL = BASE_URL + 'page-header.html';

run('demo/admin/page-header.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	const wraps = () => page.evaluate(() => Array.from(document.querySelectorAll('.ph-wrap')).map(w => ({
		narrow: w.classList.contains('ph-wrap--narrow'),
		headers: w.querySelectorAll(':scope > header').length,
		navs: w.querySelectorAll('header > nav[aria-label="Breadcrumb"]').length,
		crumbs: w.querySelectorAll('nav ol > li').length,
		current: w.querySelectorAll('nav ol > li[aria-current="page"]').length,
		h1: w.querySelectorAll('h1').length,
		h1Text: w.querySelector('h1') ? w.querySelector('h1').textContent.trim() : null,
		subtitle: w.querySelector('h1 + p') ? w.querySelector('h1 + p').textContent.trim() : null,
		buttons: Array.from(w.querySelectorAll('button')).map(b => b.textContent.trim() + ':' + b.type),
		visible: getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 0
	})));

	section('Load');
	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('.ph-wrap').length === 4, { timeout: 10000 });
	assert(true, 'Page loaded with 4 .ph-wrap demos');
	const title = await page.title();
	assert(title === 'Page Header — ln-ashlar', `Document title is "Page Header — ln-ashlar" (got "${title}")`);

	const data = await wraps();

	section('Demo 1: full header (wide)');
	{
		const d = data[0];
		assert(d.visible, 'Wrap is rendered');
		assert(!d.narrow, 'Wrap is not narrow');
		assert(d.headers === 1 && d.navs === 1, 'One header with one breadcrumb nav');
		assert(d.crumbs === 3 && d.current === 1, 'Three breadcrumbs, one aria-current');
		assert(d.h1Text === 'Quality Manual', 'Title is "Quality Manual"');
		assert(d.subtitle === 'Version 2.3 — Approved 2026-03-15', 'Subtitle text matches');
		assert(d.buttons.join('|') === 'Edit:button|Publish:submit', 'Actions: Edit (button), Publish (submit)');
	}

	section('Demo 2: full header (narrow container)');
	{
		const d = data[1];
		assert(d.visible, 'Wrap is rendered');
		assert(d.narrow, 'Wrap has ph-wrap--narrow');
		assert(d.crumbs === 3 && d.current === 1, 'Three breadcrumbs, one aria-current');
		assert(d.h1Text === 'Quality Manual', 'Title is "Quality Manual"');
		assert(d.buttons.join('|') === 'Edit:button|Publish:submit', 'Actions: Edit, Publish');
	}

	section('Demo 3: title only');
	{
		const d = data[2];
		assert(d.visible, 'Wrap is rendered');
		assert(d.h1Text === 'Dashboard', 'Title is "Dashboard"');
		assert(d.navs === 0 && d.buttons.length === 0 && d.subtitle === null, 'No breadcrumbs, no actions, no subtitle');
	}

	section('Demo 4: title + subtitle, no actions');
	{
		const d = data[3];
		assert(d.visible, 'Wrap is rendered');
		assert(d.crumbs === 2 && d.current === 1, 'Two breadcrumbs, one aria-current');
		assert(d.h1Text === 'Notification Settings', 'Title is "Notification Settings"');
		assert(d.subtitle === 'Manage how and when you receive system notifications.', 'Subtitle text matches');
		assert(d.buttons.length === 0, 'No actions');
	}
});
