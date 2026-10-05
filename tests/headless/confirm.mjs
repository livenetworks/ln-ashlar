import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/confirm.html (live demos) and
// components/ln-confirm/src/ln-confirm.js.

const PAGE_URL = BASE_URL + 'confirm.html';
const CONFIRM_BUTTONS = 18; // 2 + 2 + 3 + 3 + 1 + 1 + 1 + 1 + 2 + 2 across the live demos

run('demo/admin/confirm.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction(count => {
			const buttons = document.querySelectorAll('button[data-ln-confirm]');
			return buttons.length === count && Array.from(buttons).every(b => b.lnConfirm);
		}, { timeout: 10000 }, CONFIRM_BUTTONS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// The n-th button[data-ln-confirm] (or all buttons when `all`) inside the demo section whose h3 contains `title`.
	const button = (title, n = 0) => page.evaluateHandle((t, i) => {
		const sec = Array.from(document.querySelectorAll('section.section-card'))
			.find(s => s.querySelector('header h3') && s.querySelector('header h3').textContent.includes(t));
		return sec.querySelectorAll('button[data-ln-confirm]')[i];
	}, title, n);

	const armed = handle => handle.evaluate(el => el.getAttribute('data-ln-confirm-state') === 'confirming');

	async function waitArmed(handle, value, timeout = 5000) {
		await page.waitForFunction((el, v) =>
			(el.getAttribute('data-ln-confirm-state') === 'confirming') === v, { timeout }, handle, value);
	}

	await load();

	// ─── Mount ─────────────────────────────────────────────────
	section('Mount');
	assert(await page.evaluate(() => document.querySelectorAll('button[data-ln-confirm]').length) === CONFIRM_BUTTONS,
		`${CONFIRM_BUTTONS} confirm buttons on the page`);
	assert(await page.evaluate(() => Array.from(document.querySelectorAll('button[data-ln-confirm]'))
		.every(b => !b.hasAttribute('data-ln-confirm-state'))), 'No button starts armed');

	// ─── Example 1: two-element mode ───────────────────────────
	section('Two-element mode');
	{
		const btn = await button('Example 1', 0);
		assert(await btn.evaluate(el => el.lnConfirm.isTwoElementMode && el.lnConfirm.originalText === ''),
			'Two-element mode detected, originalText empty');
		assert(await btn.evaluate(el => el.lnConfirm.timeout) === 3, 'Default timeout is 3 seconds');

		await btn.click();
		assert(await armed(btn), 'First click sets data-ln-confirm-state="confirming"');
		const s = await btn.evaluate(el => ({
			idleHidden: el.querySelector('[data-ln-confirm-idle]').hasAttribute('hidden'),
			activeHidden: el.querySelector('[data-ln-confirm-active]').hasAttribute('hidden'),
			activeDisplay: getComputedStyle(el.querySelector('[data-ln-confirm-active]')).display,
			idleDisplay: getComputedStyle(el.querySelector('[data-ln-confirm-idle]')).display,
			label: el.getAttribute('aria-label'),
			live: el.getAttribute('aria-live'),
			confirming: el.lnConfirm.confirming
		}));
		assert(s.idleHidden && s.idleDisplay === 'none', 'Idle content hidden while armed');
		assert(!s.activeHidden && s.activeDisplay !== 'none', 'Active content shown while armed');
		assert(s.label === 'Are you sure?' && s.live === 'polite', 'aria-label = prompt, aria-live = polite while armed');
		assert(s.confirming === true, 'lnConfirm.confirming is true while armed');

		await btn.click();
		assert(!(await armed(btn)), 'Second click clears the armed state');
		const r = await btn.evaluate(el => ({
			idleHidden: el.querySelector('[data-ln-confirm-idle]').hasAttribute('hidden'),
			activeHidden: el.querySelector('[data-ln-confirm-active]').hasAttribute('hidden'),
			label: el.getAttribute('aria-label'),
			live: el.getAttribute('aria-live')
		}));
		assert(!r.idleHidden && r.activeHidden, 'Idle content restored, active content hidden again');
		assert(r.label === null && r.live === null, 'aria-label / aria-live removed (none authored)');

		const btn2 = await button('Example 1', 1);
		assert(await btn2.evaluate(el => el.lnConfirm.timeout) === 5, 'data-ln-confirm-timeout="5" read as 5');
		await btn2.click();
		assert(await btn2.evaluate(el => el.getAttribute('aria-label')) === 'Reset settings?',
			'Second two-element button uses its own prompt');
		await btn2.click();
		assert(!(await armed(btn2)), 'Second button disarmed by second click');
	}

	// ─── Example 2: shorthand ──────────────────────────────────
	section('Shorthand attribute mode');
	{
		const btn = await button('Example 2', 0);
		assert(await btn.evaluate(el => el.lnConfirm.originalText) === 'Delete record', 'originalText captured');
		assert(await btn.evaluate(el => el.lnConfirm.confirmText) === 'Are you sure?', 'confirmText read from attribute');
		await btn.click();
		assert(await armed(btn), 'Armed after first click');
		assert(await btn.evaluate(el => el.textContent) === 'Are you sure?', 'Label morphs into the prompt');
		await btn.click();
		assert(!(await armed(btn)), 'Disarmed after second click');
		assert(await btn.evaluate(el => el.textContent) === 'Delete record', 'Original label restored');

		const btn2 = await button('Example 2', 1);
		await btn2.click();
		assert(await btn2.evaluate(el => el.textContent) === 'Reset settings?', 'Second button shows its own prompt');
		await btn2.click();
		assert(await btn2.evaluate(el => el.textContent) === 'Reset defaults', 'Second button restored');
	}

	// ─── Icon-only ─────────────────────────────────────────────
	section('Icon-only mode');
	{
		const btn = await button('Icon-only buttons', 0);
		const href = () => btn.evaluate(el => el.querySelector('svg.ln-icon use').getAttribute('href'));
		assert(await href() === '#ln-icon-trash', 'Starts with the trash icon');
		await btn.click();
		assert(await armed(btn), 'Armed after first click');
		assert(await href() === '#ln-icon-check', 'Icon swapped to check');
		assert(await btn.evaluate(el => el.getAttribute('aria-label')) === 'Delete?', 'aria-label swapped to prompt');
		const ann = await btn.evaluate(el => {
			const a = el.querySelector('[data-ln-confirm-announcer]');
			return a ? { role: a.getAttribute('role'), text: a.textContent } : null;
		});
		assert(ann && ann.role === 'alert' && ann.text === 'Delete?', 'Transient announcer span role="alert" appended');
		await btn.click();
		assert(!(await armed(btn)), 'Disarmed after second click');
		assert(await href() === '#ln-icon-trash', 'Original icon restored');
		assert(await btn.evaluate(el => el.getAttribute('aria-label')) === 'Delete', 'Original aria-label restored');
		assert(await btn.evaluate(el => !el.querySelector('[data-ln-confirm-announcer]')), 'Announcer removed');

		const archive = await button('Icon-only buttons', 1);
		await archive.click();
		assert(await archive.evaluate(el => el.getAttribute('aria-label')) === 'Archive?', 'Archive button has its own prompt');
		await archive.click();
		const remove = await button('Icon-only buttons', 2);
		await remove.click();
		assert(await remove.evaluate(el => el.getAttribute('aria-label')) === 'Remove this?', 'Remove button has its own prompt');
		await remove.click();
	}

	// ─── Custom timeout ────────────────────────────────────────
	section('Custom timeout');
	{
		const fast = await button('Custom timeout', 0);
		const def = await button('Custom timeout', 1);
		const slow = await button('Custom timeout', 2);
		assert(await fast.evaluate(el => el.lnConfirm.timeout) === 1.5, 'Decimal timeout "1.5" parsed as 1.5');
		assert(await def.evaluate(el => el.lnConfirm.timeout) === 3, 'No attribute falls back to 3');
		assert(await slow.evaluate(el => el.lnConfirm.timeout) === 6, 'Timeout "6" parsed as 6');

		await fast.click();
		assert(await armed(fast), 'Armed after first click');
		const t0 = Date.now();
		await waitArmed(fast, false, 5000);
		const elapsed = Date.now() - t0;
		assert(elapsed >= 1000, `1.5s button stays armed until its timer fires (~${elapsed}ms after arm check)`);
		assert(await fast.evaluate(el => el.textContent) === '1.5s timeout', 'Auto-revert restores the original label');
		assert(await fast.evaluate(el => el.lnConfirm.confirming) === false, 'confirming false after revert');

		await def.click();
		assert(await armed(def), 'Default button armed');
		await waitArmed(def, false, 6000);
		assert(await def.evaluate(el => el.textContent) === '3s default', 'Default button auto-reverts after timeout');
	}

	// ─── Form submit ───────────────────────────────────────────
	section('Inside a form');
	{
		await page.evaluate(() => {
			window.__submits = 0;
			window.__toasts = [];
			document.getElementById('demo-form-submit').addEventListener('submit', () => { window.__submits++; });
			window.addEventListener('ln-toast:enqueue', e => window.__toasts.push(e.detail.title));
		});
		const urlBefore = page.url();
		const btn = await button('Inside a form', 0);
		await btn.click();
		assert(await armed(btn), 'Form button armed after first click');
		assert(await page.evaluate(() => window.__submits) === 0, 'First click does not submit the form');
		await btn.click();
		assert(!(await armed(btn)), 'Second click clears the armed state');
		await page.waitForFunction(() => window.__submits === 1, { timeout: 5000 });
		assert(true, 'Second click lets the native submit event fire exactly once');
		assert(await page.evaluate(() => window.__toasts.includes('Submitted')), 'Demo submit handler enqueued its toast');
		assert(page.url() === urlBefore, 'Page did not navigate');
	}

	// ─── AJAX click ────────────────────────────────────────────
	section('Non-form button with click listener');
	{
		const btn = await page.$('#demo-ajax-btn');
		await btn.click();
		assert(await armed(btn), 'AJAX button armed after first click');
		assert(await page.evaluate(() => window.__toasts.filter(t => t === 'Cleared').length) === 0,
			'Existing click listener does not run on the first click');
		await btn.click();
		assert(await page.evaluate(() => window.__toasts.filter(t => t === 'Cleared').length) === 1,
			'Existing click listener runs on the second click');
		assert(!(await armed(btn)), 'Disarmed after second click');
	}

	// ─── ln-confirm:waiting ────────────────────────────────────
	section('ln-confirm:waiting event');
	{
		const btn = await page.$('#demo-arm-track');
		await page.evaluate(() => {
			window.__waiting = [];
			document.getElementById('demo-arm-track').addEventListener('ln-confirm:waiting',
				e => window.__waiting.push(e.detail.target.id));
		});
		await btn.click();
		assert(await page.evaluate(() => window.__waiting.length) === 1, 'ln-confirm:waiting fired once on first click');
		assert(await page.evaluate(() => window.__waiting[0]) === 'demo-arm-track', 'detail.target is the button');
		const log = await page.$eval('#demo-arm-log', el => el.textContent);
		assert(/ln-confirm:waiting fired on button "Track me"$/.test(log), 'Demo log shows originalText "Track me"');
		await btn.click();
		assert(await page.evaluate(() => window.__waiting.length) === 1, 'Second click does not fire waiting again');
		assert(!(await armed(btn)), 'Disarmed after second click');
	}

	// ─── Clickable card containment ────────────────────────────
	section('Confirm inside a clickable card');
	{
		// Fresh page: the earlier toasts sit over the card's right-aligned button.
		await load();
		const cardLog = () => page.$eval('#demo-card-log', el => el.textContent);
		const cardTitle = await page.$('#demo-card-surface > header h3');
		await cardTitle.click();
		assert((await cardLog()).includes('CARD surface fired'), 'Clicking the card body fires the surface handler');

		const del = await page.$('#demo-card-delete');
		await del.click();
		assert(await armed(del), 'Delete button armed after first click');
		assert((await cardLog()).includes('CARD surface fired'), 'Arming click does not reach the card or the delete handler (log unchanged)');
		await del.click();
		assert(!(await armed(del)), 'Delete button disarmed after second click');
		const after = await cardLog();
		assert(after.includes('DELETE fired') && !after.includes('CARD surface fired'),
			'Second click runs the delete handler alone, card surface silent');
	}

	// ─── Button group ──────────────────────────────────────────
	section('Multiple confirms in a button group');
	{
		const archive = await button('Multiple confirms', 0);
		const del = await button('Multiple confirms', 1);
		assert(await page.evaluate(() => {
			const sec = Array.from(document.querySelectorAll('section.section-card'))
				.find(s => s.querySelector('header h3').textContent.includes('Multiple confirms'));
			return sec.querySelectorAll('main ul.demo-actions button').length === 4 && sec.querySelectorAll('button[data-ln-confirm]').length === 2;
		}), 'Group has 4 buttons, only 2 gated (Edit and Duplicate are plain)');
		await archive.click();
		assert(await armed(archive) && !(await armed(del)), 'Arming one does not arm the other');
		await del.click();
		assert(await armed(archive) && await armed(del), 'Arming the second does not reset the first');
		await archive.click();
		assert(!(await armed(archive)) && await armed(del), 'Accepting one leaves the other armed');
		await del.click();
		assert(!(await armed(del)), 'Second instance disarmed independently');
	}

	// ─── Inside [data-ln-table] ────────────────────────────────
	section('Inside [data-ln-table]');
	{
		const btn = await button('overflow escape', 0);
		const overflow = () => btn.evaluate(el => getComputedStyle(el.closest('[data-ln-table]')).overflowX);
		assert(await overflow() === 'clip', 'Table clips overflow while idle');
		await btn.click();
		assert(await armed(btn), 'Table button armed');
		assert(await overflow() === 'visible', 'Table overflow is visible while a descendant is armed');
		await btn.click();
		assert(!(await armed(btn)), 'Table button disarmed');
		assert(await overflow() === 'clip', 'Table clip restored after revert');
	}
});
