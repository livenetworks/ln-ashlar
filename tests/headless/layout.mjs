import { run, assert, BASE_URL } from './_harness.mjs';

// Facts are read from demo/admin/src/pages/layout.html and demo/admin/src/demo.js.
// The page has no live component demos: the layout samples are static grids/stacks/rows.
// The only behavior is the code-viewer injected by demo.js into every
// `.section-card[data-demo-html]` (ln-toggle button + panel, ln-tabs HTML/SCSS tabs when a
// `script[data-demo-scss]` exists). Layout geometry is not asserted (no sourced values).

const PAGE_URL = BASE_URL + 'layout.html';

// Sections marked data-ln-demo-html in the page source, with their .demo-box counts.
const SAMPLES = [
	{ id: 'demo-grid-3', boxes: 6 },
	{ id: 'demo-grid-2', boxes: 2 },
	{ id: 'demo-grid-4', boxes: 4 },
	{ id: 'demo-stack-row', boxes: 8 }
];

run('demo/admin/layout.html', async ({ page }) => {
	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(count => {
			const cards = document.querySelectorAll('.section-card[data-demo-html]');
			if (cards.length !== count) return false;
			return Array.from(cards).every(card => {
				const toggle = card.querySelector('.collapsible[data-ln-toggle]');
				const tabs = card.querySelector('[data-ln-tabs]');
				return toggle && toggle.lnToggle && tabs && tabs.lnTabs;
			});
		}, { timeout: 10000 }, SAMPLES.length);
	}

	await guarded('Load', load);

	await guarded('Structure', async () => {
		const info = await page.evaluate(() => ({
			h1: document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : null,
			title: document.title,
			cards: document.querySelectorAll('.section-card').length,
			codeSamples: document.querySelectorAll('main pre code').length
		}));
		assert(info.title === 'Layout & Grid — ln-ashlar', 'Document title is "Layout & Grid — ln-ashlar"');
		assert(info.h1 === 'Layout & Grid', 'h1 is "Layout & Grid"');
		assert(info.cards === 7, 'Seven section cards (overview, 4 samples, app layout, grid html)');

		for (const sample of SAMPLES) {
			const n = await page.evaluate(id => document.querySelectorAll(`#${id} > main .demo-box`).length, sample.id);
			assert(n === sample.boxes, `#${sample.id} has ${sample.boxes} .demo-box items`);
		}

		const staticPre = await page.evaluate(() => Array.from(document.querySelectorAll('.section-card:not([data-demo-html]) > main pre code')).length);
		assert(staticPre === 2, 'Two static <pre><code> samples (App Layout structure, Grid HTML)');
	});

	await guarded('Code viewer injection', async () => {
		for (let i = 0; i < SAMPLES.length; i++) {
			const sample = SAMPLES[i];
			const info = await page.evaluate((id, idx) => {
				const card = document.getElementById(id);
				const btn = card.querySelector('header > button[data-ln-toggle-for]');
				const panel = document.getElementById('demo-code-' + idx);
				return {
					btnFor: btn ? btn.getAttribute('data-ln-toggle-for') : null,
					btnAction: btn ? btn.getAttribute('data-ln-toggle-action') : null,
					btnLabel: btn ? btn.getAttribute('aria-label') : null,
					panelInCard: !!panel && card.contains(panel),
					panelState: panel ? panel.getAttribute('data-ln-toggle') : null,
					htmlPre: !!document.getElementById('demo-code-' + idx + '-tabs:html'),
					scssPre: !!document.getElementById('demo-code-' + idx + '-tabs:scss'),
					tabLinks: document.querySelectorAll(`#demo-code-${idx}-tabs a[data-ln-tab]`).length
				};
			}, sample.id, i);
			assert(info.btnFor === `demo-code-${i}` && info.btnAction === 'toggle', `#${sample.id}: code button targets demo-code-${i} with action toggle`);
			assert(info.btnLabel === 'Show HTML / SCSS Code', `#${sample.id}: code button has aria-label`);
			assert(info.panelInCard, `#${sample.id}: code panel demo-code-${i} appended inside the card`);
			assert(info.panelState === 'close', `#${sample.id}: code panel starts closed`);
			assert(info.htmlPre && info.scssPre && info.tabLinks === 2, `#${sample.id}: HTML and SCSS panes + two tab links (script[data-demo-scss] present)`);
		}
	});

	await guarded('Toggle open / close', async () => {
		await load();
		const btnSel = '#demo-grid-3 > header > button[data-ln-toggle-for]';
		await page.click(btnSel);
		await page.waitForFunction(() => document.getElementById('demo-code-0').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });
		assert(true, 'Click sets panel data-ln-toggle="open"');
		assert(await page.$eval(btnSel, el => el.getAttribute('aria-expanded')) === 'true', 'Trigger aria-expanded="true" when open');
		await page.waitForFunction(() => document.getElementById('demo-code-0-tabs:html').getBoundingClientRect().height > 0, { timeout: 5000 });
		assert(true, 'HTML code pane is rendered with non-zero height when open');

		const generated = await page.$eval('#demo-code-0-tabs\\:html code', el => el.textContent);
		assert(generated.includes('demo-box') && generated.includes('>6<'), 'HTML pane contains the sample markup (6 demo boxes)');

		await page.click(btnSel);
		await page.waitForFunction(() => document.getElementById('demo-code-0').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		assert(true, 'Second click sets panel data-ln-toggle="close"');
		assert(await page.$eval(btnSel, el => el.getAttribute('aria-expanded')) === 'false', 'Trigger aria-expanded="false" when closed');
	});

	await guarded('Tabs HTML / SCSS', async () => {
		await load();
		await page.click('#demo-grid-3 > header > button[data-ln-toggle-for]');
		await page.waitForFunction(() => document.getElementById('demo-code-0').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });

		assert(await page.$eval('#demo-code-0-tabs', el => el.getAttribute('data-ln-tabs-active')) === 'html', 'Default tab is html (data-ln-tabs-default)');
		assert(await page.$eval('#demo-code-0-tabs\\:scss', el => el.hidden) === true, 'SCSS pane hidden initially');

		await page.waitForFunction(() => document.querySelector('#demo-code-0-tabs a[data-ln-tab]').getBoundingClientRect().height > 0, { timeout: 5000 });
		await page.click('#demo-code-0-tabs a[href="#demo-code-0-tabs:scss"]');
		await page.waitForFunction(() => document.getElementById('demo-code-0-tabs').getAttribute('data-ln-tabs-active') === 'scss', { timeout: 5000 });
		assert(true, 'Clicking SCSS tab sets data-ln-tabs-active="scss"');
		assert(await page.$eval('#demo-code-0-tabs\\:scss', el => el.hidden) === false, 'SCSS pane shown');
		assert(await page.$eval('#demo-code-0-tabs\\:html', el => el.hidden) === true, 'HTML pane hidden');
		const scss = await page.$eval('#demo-code-0-tabs\\:scss code', el => el.textContent);
		assert(scss.includes('@include grid;'), 'SCSS pane contains the sample SCSS (@include grid;)');

		await page.click('#demo-code-0-tabs a[href="#demo-code-0-tabs:html"]');
		await page.waitForFunction(() => document.getElementById('demo-code-0-tabs').getAttribute('data-ln-tabs-active') === 'html', { timeout: 5000 });
		assert(await page.$eval('#demo-code-0-tabs\\:html', el => el.hidden) === false, 'Back to HTML tab shows HTML pane');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
