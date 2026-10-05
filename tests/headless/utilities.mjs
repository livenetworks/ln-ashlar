import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/utilities.html (source demo/admin/src/pages/utilities.html) is a static,
// CSS-only reference page: tables documenting utility classes plus sample buttons,
// shadow tiles and skeleton blocks. No ln-* component is mounted on it and there is no
// inline mock script, so this is a smoke test: page loads, structure exists (counts read
// from the page markup), zero uncaught page errors (checked by the harness).

const PAGE_URL = BASE_URL + 'utilities.html';
const CONTENT = '.app-content-wrapper';

const HEADINGS = [
	'Overview & Philosophy',
	'Infrastructure',
	'Semantic Color Overrides',
	'Button Style Variants',
	'Dual-Layer Shadow Elevation Scale',
	'Skeleton Loading Shimmer'
];
const INFRA_CLASSES = ['.hidden', '.sr-only', '.container', '.container-sm'];
const COLOR_CLASSES = ['.success', '.warning', '.error', '.info', '.secondary', '.neutral'];
const VARIANT_CLASSES = ['.btn', '.btn-soft', '.btn-outline', '.btn-ghost', '.btn-link'];
const SHADOWS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map(s => '--shadow-' + s);

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/utilities.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction(sel => document.querySelectorAll(sel + ' section.section-card').length > 0,
		{ timeout: 10000 }, CONTENT);

	const q = (fn, ...args) => page.evaluate(fn, CONTENT, ...args);

	section('Page structure');
	assert((await page.title()) === 'Utilities — ln-ashlar', 'Document title is "Utilities — ln-ashlar"');
	assert((await page.$eval('h1', el => el.textContent.trim())) === 'Utilities', 'h1 is "Utilities"');
	const headings = await q(c => Array.from(document.querySelectorAll(c + ' section.section-card > header > h3'))
		.map(h => h.textContent.trim()));
	assert(same(headings, HEADINGS), `Section headings match page markup: [${headings.join(' | ')}]`);

	section('Infrastructure table');
	const infra = await q(c => Array.from(document.querySelectorAll(c + ' section.section-card:nth-of-type(2) tbody tr td:first-child code'))
		.map(el => el.textContent.trim()));
	assert(same(infra, INFRA_CLASSES), `Infrastructure classes listed: [${infra.join(', ')}]`);

	section('Semantic color overrides');
	const color = await q(c => Array.from(document.querySelectorAll(c + ' section.section-card:nth-of-type(3) tbody tr'))
		.map(tr => ({
			name: tr.querySelector('td code').textContent.trim(),
			button: tr.querySelector('button').className
		})));
	assert(same(color.map(r => r.name), COLOR_CLASSES), 'Color override rows match page markup');
	assert(color.every(r => '.' + r.button === r.name), 'Each example button carries the class named in its row');

	section('Button style variants');
	const variants = await q(c => Array.from(document.querySelectorAll(c + ' section.section-card:nth-of-type(4) tbody tr'))
		.map(tr => ({
			name: tr.querySelector('td code').textContent.trim(),
			buttons: Array.from(tr.querySelectorAll('button')).map(b => b.className)
		})));
	assert(same(variants.map(r => r.name), VARIANT_CLASSES), 'Variant rows match page markup');
	assert(variants.every(r => r.buttons.length === 4), 'Each variant row has 4 example buttons (Default/Success/Error/Warning)');
	assert(variants.every(r => r.buttons[0] === r.name.slice(1)), 'First button of each row carries the variant class');
	assert(variants.every(r => ['success', 'error', 'warning'].every((m, i) => r.buttons[i + 1] === r.name.slice(1) + ' ' + m)),
		'Remaining buttons carry variant + success/error/warning modifier');

	section('Shadow scale');
	const shadows = await q(c => Array.from(document.querySelectorAll(c + ' section.section-card:nth-of-type(5) code'))
		.map(el => ({ name: el.textContent.trim(), value: el.parentElement.style.boxShadow })));
	assert(same(shadows.map(s => s.name), SHADOWS), 'Six shadow tiles named --shadow-xs..--shadow-2xl');
	assert(shadows.every(s => s.value.length > 0), 'Each shadow tile has a box-shadow applied');

	section('Skeleton blocks');
	const skeletons = await q(c => document.querySelectorAll(c + ' .skeleton').length);
	assert(skeletons === 3, `3 .skeleton blocks present (got ${skeletons})`);
});
