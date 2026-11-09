import { run, assert, BASE_URL } from './_harness.mjs';

// Regression: ln-date builds its calendar button at runtime
// (<use href="#ln-icon-calendar">), so the icon must load when an ln-date input is
// inserted after page load. Page: demo/admin/forms.html, which loads the full bundle
// (ln-date + ln-icon) and has no static ln-date input and no static calendar icon,
// so the calendar symbol can only come from the late-inserted button.
//
// Network: the Tabler CDN (cdn.jsdelivr.net) is answered by Puppeteer request interception
// with a synthetic SVG, so the run is deterministic and offline-safe.

const PAGE_URL = BASE_URL + 'forms.html';
const CDN_PREFIX = 'https://cdn.jsdelivr.net/npm/@tabler/icons@3.31.0/icons/outline/';
const SYNTHETIC_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M0 0h24v24H0z"/></svg>';

const HOST = '#lc-test-host';
const INPUT = '#lc-test-date';
const SYMBOL = '#ln-icon-sprite defs symbol[id="ln-icon-calendar"]';

run('demo/admin/forms.html (ln-date late-inserted icon)', async ({ page }) => {

	const cdnRequests = [];
	await page.setRequestInterception(true);
	page.on('request', req => {
		const url = req.url();
		if (url.indexOf('https://cdn.jsdelivr.net/') === 0) {
			cdnRequests.push(url);
			req.respond({
				status: 200,
				contentType: 'image/svg+xml',
				headers: { 'access-control-allow-origin': '*' },
				body: SYNTHETIC_SVG
			}).catch(() => {});
		} else {
			req.continue().catch(() => {});
		}
	});

	// Load with localStorage cleared so no cached symbol masks the result.
	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.evaluate(() => localStorage.clear());
	await page.reload({ waitUntil: 'load' });
	cdnRequests.length = 0;

	try {
		console.log('\n--- Before injection ---');
		const before = await page.evaluate(sel => !!document.querySelector(sel), SYMBOL);
		assert(before === false, '#ln-icon-calendar is not in the sprite before injection');

		console.log('\n--- Inject ln-date input after load ---');
		await page.evaluate(() => {
			document.body.insertAdjacentHTML('beforeend',
				'<section id="lc-test-host"><input type="date" id="lc-test-date" name="lc_test_date" data-ln-date></section>');
		});

		await page.waitForFunction(sel => {
			const input = document.querySelector(sel);
			const field = input && input.closest('[data-ln-date-field]');
			return !!(field && field.querySelector('button use[href="#ln-icon-calendar"]'));
		}, { timeout: 5000 }, INPUT).catch(() => {});
		const buttonUse = await page.evaluate(sel => {
			const input = document.querySelector(sel);
			const field = input && input.closest('[data-ln-date-field]');
			return !!(field && field.querySelector('button use[href="#ln-icon-calendar"]'));
		}, INPUT);
		assert(buttonUse, 'ln-date created its calendar button with <use href="#ln-icon-calendar">');

		console.log('\n--- Calendar symbol loads ---');
		let appeared = true;
		await page.waitForFunction(sel => !!document.querySelector(sel), { timeout: 5000 }, SYMBOL)
			.catch(() => { appeared = false; });
		assert(appeared, '#ln-icon-calendar symbol appears in the sprite after late insertion');
		assert(cdnRequests.indexOf(CDN_PREFIX + 'calendar.svg') !== -1, 'calendar.svg was requested from the Tabler CDN');
	} finally {
		await page.evaluate(sel => {
			const host = document.querySelector(sel);
			if (host) host.remove();
		}, HOST).catch(() => {});
	}
});
