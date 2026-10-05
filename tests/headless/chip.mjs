import { run, assert, BASE_URL } from './_harness.mjs';

// Static page: every fact below is read from demo/admin/src/pages/chip.html.
// The page mounts no JS component; it only showcases the `chip` SCSS mixin, so this is a smoke test.

const PAGE_URL = BASE_URL + 'chip.html';

const SECTION_TITLES = [
	'Overview & Philosophy',
	'Plain Chips',
	'Tone Variants',
	'Chips with Close Button',
	'Active Filter Tags Context'
];

const PLAIN = ['Draft', 'In Review', 'Approved', 'Obsolete'];
const TONES = [
	['Neutral', ''],
	['Approved', 'approved'],
	['Pending review', 'pending-review'],
	['Rejected', 'rejected'],
	['In progress', 'in-progress']
];
const CLOSABLE = [
	['Quality Manual', 'Remove Quality Manual filter', ''],
	['ISO 9001', 'Remove ISO 9001 filter', ''],
	['In progress', 'Remove In progress filter', 'in-progress']
];
const FILTERS = [
	['Status: Draft', 'Remove Status: Draft filter'],
	['Standard: ISO 9001', 'Remove Standard: ISO 9001 filter'],
	['Type: Procedure', 'Remove Type: Procedure filter']
];

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/chip.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.querySelectorAll('.demo-chip-list').length === 4, { timeout: 10000 });

	// Chip items (text without the button label) of the nth .demo-chip-list.
	const chips = n => page.evaluate(i => Array.from(document.querySelectorAll('.demo-chip-list')[i].children)
		.map(li => ({
			tag: li.tagName,
			text: li.firstChild.textContent.trim() || li.textContent.trim(),
			cls: li.className.trim(),
			buttons: Array.from(li.querySelectorAll(':scope > button')).map(b => ({
				type: b.getAttribute('type'),
				label: b.getAttribute('aria-label'),
				iconHidden: b.querySelector('svg.ln-icon')?.getAttribute('aria-hidden'),
				iconHref: b.querySelector('svg.ln-icon use')?.getAttribute('href')
			}))
		})), n);

	section('Page structure');
	const titles = await page.evaluate(() => Array.from(document.querySelectorAll('section.section-card > header > h3'))
		.map(h => h.textContent.trim()));
	assert(same(titles, SECTION_TITLES), `Five section cards with expected titles (${titles.join(' | ')})`);
	const listTags = await page.evaluate(() => Array.from(document.querySelectorAll('.demo-chip-list')).map(el => el.tagName));
	assert(listTags.length === 4 && listTags.every(t => t === 'UL'), 'Four .demo-chip-list elements, all <ul>');

	section('Plain chips');
	const plain = await chips(0);
	assert(same(plain.map(c => c.text), PLAIN), 'Plain list has Draft, In Review, Approved, Obsolete');
	assert(plain.every(c => c.tag === 'LI' && c.cls === '' && c.buttons.length === 0), 'Plain chips are bare <li> with no tone class and no button');

	section('Tone variants');
	const tones = await chips(1);
	assert(same(tones.map(c => c.text), TONES.map(t => t[0])), 'Tone list has five chips in order');
	assert(same(tones.map(c => c.cls), TONES.map(t => t[1])), 'Tone classes: none, approved, pending-review, rejected, in-progress');
	const toneColors = await page.evaluate(() => Array.from(document.querySelectorAll('.demo-chip-list')[1].children)
		.map(li => getComputedStyle(li).color));
	assert(new Set(toneColors).size === 5, `Each tone chip renders a distinct text color (${toneColors.length} chips, ${new Set(toneColors).size} distinct)`);

	section('Chips with close button');
	const closable = await chips(2);
	assert(same(closable.map(c => c.text), CLOSABLE.map(c => c[0])), 'Closable list has Quality Manual, ISO 9001, In progress');
	assert(same(closable.map(c => c.cls), CLOSABLE.map(c => c[2])), 'Third closable chip carries in-progress tone class');
	assert(closable.every(c => c.buttons.length === 1 && c.buttons[0].type === 'button'), 'Each closable chip has exactly one <button type="button">');
	assert(same(closable.map(c => c.buttons[0].label), CLOSABLE.map(c => c[1])), 'Close buttons carry the expected aria-labels');
	assert(closable.every(c => c.buttons[0].iconHidden === 'true' && c.buttons[0].iconHref === '#ln-icon-x'), 'Close icons are aria-hidden and reference #ln-icon-x');

	section('Active filter tags context');
	const context = await page.evaluate(() => {
		const host = document.querySelector('[data-demo-filter-context]');
		return {
			hostExists: !!host,
			intro: host?.querySelector(':scope > p')?.textContent.trim(),
			listInside: !!host?.querySelector(':scope > ul.demo-chip-list')
		};
	});
	assert(context.hostExists && context.intro === 'Active filters:' && context.listInside, 'Filter context has "Active filters:" intro and the chip list');
	const filters = await chips(3);
	assert(same(filters.map(c => c.text), FILTERS.map(f => f[0])), 'Filter chips: Status: Draft, Standard: ISO 9001, Type: Procedure');
	assert(same(filters.map(c => c.buttons[0]?.label), FILTERS.map(f => f[1])), 'Filter chip close buttons carry the expected aria-labels');

	section('Close buttons are focusable');
	const focusable = await page.evaluate(() => {
		const btn = document.querySelector('.demo-chip-list button');
		btn.focus();
		return document.activeElement === btn;
	});
	assert(focusable, 'Close button accepts keyboard focus');
});
