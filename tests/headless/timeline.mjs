import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/timeline.html (source demo/admin/src/pages/timeline.html) is NOT driven by a
// JS component or an inline mock script: the timeline is pure CSS (the `timeline` mixin in
// theme/config/mixins/_timeline.scss, bound to `.timeline` and `#audit-log` in
// theme/components/_timeline.scss). The page has no interaction, so this is a smoke test
// of structure plus the CSS facts that the mixin source declares.

const PAGE_URL = BASE_URL + 'timeline.html';

// [list selector, expected <li> count, expected titles in order]
const LISTS = [
	['#audit-log', 6, ['Document approved', 'Comment added', 'Revision submitted', 'Review requested', 'Draft created', 'Workflow started']],
	['ol.timeline:not(#audit-log)', 3, null]
];

run('demo/admin/timeline.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.getElementById('audit-log') !== null, { timeout: 10000 });

	section('Structure');

	const structure = await page.evaluate(() => {
		const titles = id => Array.from(document.querySelectorAll(id + ' > li > h4')).map(h => h.textContent.trim());
		const minimal = Array.from(document.querySelectorAll('ol.timeline')).map(ol => ({
			items: ol.querySelectorAll(':scope > li').length,
			titles: Array.from(ol.querySelectorAll(':scope > li > h4')).map(h => h.textContent.trim()),
			descriptions: ol.querySelectorAll(':scope > li > p').length
		}));
		return {
			auditTag: document.getElementById('audit-log').tagName,
			auditItems: document.querySelectorAll('#audit-log > li').length,
			auditTitles: titles('#audit-log'),
			auditTimes: document.querySelectorAll('#audit-log > li > time[datetime]').length,
			auditDescriptions: document.querySelectorAll('#audit-log > li > p').length,
			minimal
		};
	});

	assert(structure.auditTag === 'OL', '#audit-log is an <ol>');
	assert(structure.auditItems === 6, `#audit-log has 6 entries (got ${structure.auditItems})`);
	assert(structure.auditTitles.join('|') === LISTS[0][2].join('|'), 'Audit log titles in order: ' + structure.auditTitles.join(', '));
	assert(structure.auditTimes === 6, 'Every audit entry has a <time datetime>');
	assert(structure.auditDescriptions === 6, 'Every audit entry has a description <p>');
	assert(structure.minimal.length === 2, `Two ol.timeline lists (got ${structure.minimal.length})`);
	assert(structure.minimal[0].items === 2, 'Minimal timeline has 2 entries');
	assert(structure.minimal[0].titles.join('|') === 'Published|Draft saved', 'Minimal timeline titles: Published, Draft saved');
	assert(structure.minimal[0].descriptions === 0, 'Minimal timeline entries have no descriptions');
	assert(structure.minimal[1].items === 1, 'Single-entry timeline has 1 entry');
	assert(structure.minimal[1].titles[0] === 'Record created', 'Single entry title: Record created');

	section('No JS component mounted (pure CSS)');

	const instances = await page.evaluate(() => {
		const lists = [document.getElementById('audit-log'), ...document.querySelectorAll('ol.timeline')];
		return lists.filter(el => Object.keys(el).some(k => /^ln[A-Z]/.test(k))).length;
	});
	assert(instances === 0, 'No ln* component instance on any timeline list');

	section('CSS from the timeline mixin [source]');

	// [source] theme/config/mixins/_timeline.scss: list position:relative + ::before rail
	// (content '', position:absolute); each > li position:relative + ::before bullet
	// (content '', position:absolute); > li > time display:block.
	const css = await page.evaluate(() => {
		const read = (el, pseudo) => {
			const cs = getComputedStyle(el, pseudo);
			return { position: cs.position, content: cs.content, display: cs.display };
		};
		return Array.from([document.getElementById('audit-log'), ...document.querySelectorAll('ol.timeline')]).map(ol => {
			const li = ol.querySelector(':scope > li');
			const time = li.querySelector(':scope > time');
			return {
				list: read(ol),
				rail: read(ol, '::before'),
				li: read(li),
				bullet: read(li, '::before'),
				timeDisplay: getComputedStyle(time).display
			};
		});
	});

	css.forEach((c, i) => {
		const name = i === 0 ? '#audit-log' : 'ol.timeline #' + i;
		assert(c.list.position === 'relative', `${name}: list is position:relative`);
		assert(c.rail.content === '""' && c.rail.position === 'absolute', `${name}: ::before rail rendered (content "", absolute)`);
		assert(c.li.position === 'relative', `${name}: <li> is position:relative`);
		assert(c.bullet.content === '""' && c.bullet.position === 'absolute', `${name}: <li>::before bullet rendered (content "", absolute)`);
		assert(c.timeDisplay === 'block', `${name}: <time> is display:block`);
	});

	section('Layout');

	const stacked = await page.evaluate(() => {
		const lis = Array.from(document.querySelectorAll('#audit-log > li'));
		const tops = lis.map(li => li.getBoundingClientRect().top);
		return tops.every((t, i) => i === 0 || t > tops[i - 1]);
	});
	assert(stacked, 'Audit entries are stacked vertically in DOM order');
});
