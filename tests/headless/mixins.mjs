import { run, assert, BASE_URL } from './_harness.mjs';

// Smoke test. demo/admin/src/pages/mixins.html is a static reference page: every mixin
// is documented in a table or a <pre><code> sample. The only live markup is the button
// variants row (nav#demo-btn-variants). No ln-* component is mounted by the page itself.

const PAGE_URL = BASE_URL + 'mixins.html';

const SECTION_IDS = ['two-layer-architecture', 'override-architecture', 'btn'];
const SECTION_HEADINGS = [
	'Overview & Philosophy',
	'Two-Layer Architecture: Mixins + Components',
	'Override Architecture — Zero Hardcoded Colors',
	'Spacing',
	'Display & Flex',
	'Width & Height',
	'Typography',
	'Colors',
	'Borders & Radius',
	'Shadows',
	'Transitions',
	'Position & Overflow',
	'Cursor & Interaction',
	'Z-Index',
	'Container Queries',
	'Collapsible',
	'Grid Layouts',
	'Card & Section',
	'Buttons',
	'Form',
	'Table',
	'Breadcrumbs & Loader',
	'Avatar',
	'Navigation'
];
// Button labels in nav#demo-btn-variants, in source order, with their type/class/disabled.
const VARIANTS = [
	{ text: 'Neutral', type: 'button', cls: [], disabled: false },
	{ text: 'Submit', type: 'submit', cls: [], disabled: false },
	{ text: 'Action (.btn)', type: 'button', cls: ['btn'], disabled: false },
	{ text: 'Danger', type: 'button', cls: ['btn', 'error'], disabled: false },
	{ text: 'Success', type: 'button', cls: ['btn', 'success'], disabled: false },
	{ text: 'Warning', type: 'button', cls: ['btn', 'warning'], disabled: false },
	{ text: 'Info', type: 'button', cls: ['btn', 'info'], disabled: false },
	{ text: 'Disabled', type: 'button', cls: ['btn'], disabled: true }
];

run('demo/admin/mixins.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	section('Page load');
	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(() => document.getElementById('demo-btn-variants'), { timeout: 10000 });
	assert(true, 'Page loaded and #demo-btn-variants is present');

	section('Structure');
	const h1 = await page.evaluate(() => {
		const el = document.querySelector('h1');
		return el ? el.textContent.trim() : null;
	});
	assert(h1 === 'Mixins Reference', `h1 is "Mixins Reference" (got ${JSON.stringify(h1)})`);

	const title = await page.title();
	assert(title === 'Mixins Reference — ln-ashlar', `document title is "Mixins Reference — ln-ashlar" (got ${JSON.stringify(title)})`);

	const headings = await page.evaluate(() => Array.from(document.querySelectorAll('section.section-card > header > h3'))
		.map(h => h.textContent.trim()));
	assert(headings.length === SECTION_HEADINGS.length, `${SECTION_HEADINGS.length} section-card headings (got ${headings.length})`);
	assert(SECTION_HEADINGS.every((h, i) => headings[i] === h), 'Section headings match source order');

	for (const id of SECTION_IDS) {
		const ok = await page.evaluate(i => {
			const el = document.getElementById(i);
			return !!el && el.matches('section.section-card');
		}, id);
		assert(ok, `section#${id} exists`);
	}

	const tables = await page.evaluate(() => document.querySelectorAll('section.section-card table').length);
	assert(tables === 26, `26 reference tables inside section cards (got ${tables})`);

	const pres = await page.evaluate(() => document.querySelectorAll('section.section-card pre > code').length);
	assert(pres === 18, `18 <pre><code> samples inside section cards (got ${pres})`);

	section('Live button variants');
	const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('nav#demo-btn-variants > button'))
		.map(b => ({
			text: b.textContent.trim(),
			type: b.getAttribute('type'),
			cls: Array.from(b.classList),
			disabled: b.disabled
		})));
	assert(buttons.length === VARIANTS.length, `${VARIANTS.length} buttons in #demo-btn-variants (got ${buttons.length})`);
	for (let i = 0; i < VARIANTS.length; i++) {
		const exp = VARIANTS[i];
		const got = buttons[i] || {};
		assert(got.text === exp.text && got.type === exp.type && got.disabled === exp.disabled
			&& got.cls.length === exp.cls.length && exp.cls.every(c => got.cls.includes(c)),
			`Button ${i + 1} "${exp.text}": type=${exp.type}, classes=[${exp.cls.join(' ')}], disabled=${exp.disabled}`);
	}

	const visible = await page.evaluate(() => Array.from(document.querySelectorAll('nav#demo-btn-variants > button'))
		.every(b => {
			const cs = getComputedStyle(b);
			const r = b.getBoundingClientRect();
			return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
		}));
	assert(visible, 'All 8 variant buttons are rendered visibly');
});
