import { run, assert, BASE_URL } from './_harness.mjs';

// Pure-CSS page (no JS component is mounted). Facts come from
// demo/admin/src/pages/status-badge.html and theme/config/mixins/_status-badge.scss
// (@mixin badge, @mixin badge-live).

const PAGE_URL = BASE_URL + 'status-badge.html';

run('demo/admin/status-badge.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('ul.demo-badge-list').length > 0, { timeout: 10000 });

	const texts = selector => page.evaluate(sel => Array.from(document.querySelectorAll(sel))
		.map(el => el.textContent.trim()), selector);

	const styleOf = (selector, pseudo) => page.evaluate((sel, ps) => {
		const el = document.querySelector(sel);
		const cs = getComputedStyle(el, ps || null);
		return {
			display: cs.display,
			cursor: cs.cursor,
			content: cs.content,
			animationName: cs.animationName,
			animationDuration: cs.animationDuration,
			borderRadius: cs.borderRadius
		};
	}, selector, pseudo);

	// ─── Structure ─────────────────────────────────────────────
	section('Structure');

	const lists = await page.evaluate(() => document.querySelectorAll('ul.demo-badge-list').length);
	assert(lists === 3, `3 ul.demo-badge-list (variants, live, buttons), got ${lists}`);

	const demoSections = await page.evaluate(() => document.querySelectorAll('section.section-card[data-demo-html]').length);
	assert(demoSections === 4, `4 live demo sections (data-demo-html), got ${demoSections}`);

	const variantsList = await page.evaluate(() => {
		const ul = document.querySelectorAll('section[data-demo-html]')[0].querySelector('ul.demo-badge-list');
		return Array.from(ul.children).map(li => ({ text: li.textContent.trim(), cls: li.className }));
	});
	assert(JSON.stringify(variantsList) === JSON.stringify([
		{ text: 'Active', cls: 'success' },
		{ text: 'Pending', cls: 'warning' },
		{ text: 'Blocked', cls: 'error' },
		{ text: 'In Review', cls: 'info' },
		{ text: 'Inactive', cls: 'neutral' },
		{ text: 'Default', cls: '' }
	]), 'Semantic Variants: 6 badges with expected labels and classes');

	const liveList = await page.evaluate(() => {
		const ul = document.querySelectorAll('section[data-demo-html]')[1].querySelector('ul.demo-badge-list');
		return Array.from(ul.children).map(li => ({ text: li.textContent.trim(), cls: li.className }));
	});
	assert(JSON.stringify(liveList) === JSON.stringify([
		{ text: 'Live', cls: 'success live' },
		{ text: 'Syncing', cls: 'info live' },
		{ text: 'Processing', cls: 'warning live' }
	]), 'Live State: 3 badges with expected labels and classes');

	const buttonList = await page.evaluate(() => {
		const ul = document.querySelectorAll('section[data-demo-html]')[2].querySelector('ul.demo-badge-list');
		return Array.from(ul.querySelectorAll(':scope > li > button[type="button"]'))
			.map(b => ({ text: b.textContent.trim(), cls: b.className }));
	});
	assert(JSON.stringify(buttonList) === JSON.stringify([
		{ text: 'Active', cls: 'success' },
		{ text: 'Pending', cls: 'warning' },
		{ text: 'Blocked', cls: 'error' },
		{ text: 'Inactive', cls: 'neutral' }
	]), 'Actionable Badge: 4 <button type="button"> badges inside li');

	const tableRows = await page.evaluate(() => {
		const table = document.querySelectorAll('section[data-demo-html]')[3].querySelector('table');
		return Array.from(table.querySelectorAll('tbody tr')).map(tr => {
			const badge = tr.cells[2].querySelector('span.badge');
			return [tr.cells[0].textContent.trim(), tr.cells[1].textContent.trim(), badge.textContent.trim(), badge.className];
		});
	});
	assert(JSON.stringify(tableRows) === JSON.stringify([
		['Alice Johnson', 'Admin', 'Active', 'badge success live'],
		['Bob Smith', 'Editor', 'Pending', 'badge warning'],
		['Carol White', 'Viewer', 'Inactive', 'badge neutral'],
		['Dave Brown', 'Editor', 'Blocked', 'badge error']
	]), 'In Context table: 4 rows with expected badge labels and classes');

	const statusList = await texts('ul.status-list > li');
	assert(JSON.stringify(statusList) === JSON.stringify(['Active', 'Pending', 'Inactive']),
		'Production Usage: ul.status-list has Active / Pending / Inactive');

	// ─── Badge mixin (from _status-badge.scss) ─────────────────
	section('Badge mixin (computed style, source: @mixin badge)');

	const base = await styleOf('section[data-demo-html] ul.demo-badge-list > li.success');
	// @mixin badge sets inline-flex, but the li is a flex item of ul.demo-badge-list (display:flex), so it computes to blockified "flex".
	assert(base.display === 'flex', `[source] .demo-badge-list li (inline-flex, blockified as flex item) computes to flex (got ${base.display})`);
	const dot = await styleOf('section[data-demo-html] ul.demo-badge-list > li.success', '::before');
	assert(dot.content === '""', `[source] ::before dot has empty content (got ${dot.content})`);
	assert(dot.display === 'block', `[source] ::before dot is display:block (got ${dot.display})`);

	section('Actionable badge (source: &:is(button))');

	const btn = await styleOf('section[data-demo-html] li > button.success');
	assert(btn.display === 'inline-flex', `[source] button badge is inline-flex (got ${btn.display})`);
	assert(btn.cursor === 'pointer', `[source] button badge has cursor:pointer (got ${btn.cursor})`);

	// ─── Live pulse ────────────────────────────────────────────
	section('Live pulse (source: @mixin badge-live)');

	const live = await styleOf('section[data-demo-html] ul.demo-badge-list > li.live', '::before');
	assert(live.animationName === 'badge-pulse', `[source] .live ::before animation-name is badge-pulse (got ${live.animationName})`);
	assert(live.animationDuration === '1.8s', `[source] .live pulse duration is 1.8s (got ${live.animationDuration}); page prose says 2s`);

	const nonLive = await styleOf('section[data-demo-html] ul.demo-badge-list > li.success:not(.live)', '::before');
	assert(nonLive.animationName === 'none', `Non-live badge ::before has no animation (got ${nonLive.animationName})`);

	const tableBadge = await styleOf('table span.badge.success');
	assert(tableBadge.display === 'inline-flex', `[source] table span.badge is inline-flex (got ${tableBadge.display})`);

	const tableLive =await styleOf('table span.badge.live', '::before');
	assert(tableLive.animationName === 'badge-pulse', `[source] table .badge.live ::before pulses (got ${tableLive.animationName})`);

	// ─── No JS components ──────────────────────────────────────
	section('No JS behavior bound');

	const bound = await page.evaluate(() => document.querySelectorAll(
		'section[data-demo-html] ul.demo-badge-list [data-ln-modal], section[data-demo-html] ul.demo-badge-list [data-ln-popover]').length);
	assert(bound === 0, 'Badge demos carry no data-ln-* behavior hooks');
});
