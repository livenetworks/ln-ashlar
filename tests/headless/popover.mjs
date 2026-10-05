import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/popover.html (six live demos)
// and components/ln-popover/src/ln-popover.js (+ ln-core positioning.js computePlacement).

const PAGE_URL = BASE_URL + 'popover.html';
const POPOVER_COUNT = 12; // 10 demo popovers (1+4+1+2+1+1) + 2 shell pickers (demo-theme-picker, demo-density-picker)
const TRIGGER_COUNT = 12; // one trigger per popover

run('demo/admin/popover.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs a section so a failure in one does not stop the others; rethrows at the end.
	const failures = [];
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
		await page.waitForFunction((pc, tc) => {
			const pops = document.querySelectorAll('[data-ln-popover]');
			const trigs = document.querySelectorAll('[data-ln-popover-for]');
			return pops.length === pc && trigs.length === tc
				&& Array.from(pops).every(el => el.lnPopover)
				&& Array.from(trigs).every(el => el.lnPopoverTrigger);
		}, { timeout: 10000 }, POPOVER_COUNT, TRIGGER_COUNT);
	}

	const attr = (sel, name) => page.evaluate((s, n) => document.querySelector(s).getAttribute(n), sel, name);
	const isOpenNative = id => page.evaluate(i => document.getElementById(i).matches(':popover-open'), id);
	const visible = id => page.evaluate(i => {
		const el = document.getElementById(i);
		const cs = getComputedStyle(el);
		const r = el.getBoundingClientRect();
		return cs.display !== 'none' && cs.visibility !== 'hidden' && r.width > 0 && r.height > 0;
	}, id);

	async function waitState(id, state) {
		await page.waitForFunction((i, s) => document.getElementById(i).getAttribute('data-ln-popover') === s,
			{ timeout: 5000 }, id, state);
	}

	// Real mouse click on a trigger, after centering it in the viewport so placement has room.
	async function clickTrigger(selector) {
		await page.evaluate(s => document.querySelector(s).scrollIntoView({ block: 'center', inline: 'center' }), selector);
		await page.click(selector);
	}

	const trig = id => `[data-ln-popover-for="${id}"]`;

	// Click on a neutral spot (overview heading) -> counts as an outside click.
	const clickOutside = () => page.evaluate(() => document.querySelector('section.section-card header h3').click());

	// ═══ 0. Initial state ═════════════════════════════════════
	await guarded('Initial state', async () => {
		await load();
		const ids = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-popover]')).map(e => e.id));
		assert(ids.length === POPOVER_COUNT, `${POPOVER_COUNT} popover containers mounted (incl. 2 shell pickers)`);
		assert(await attr('#demo-account-popover', 'popover') === 'manual', 'popover="manual" written on mount');
		assert(await attr('#demo-account-popover', 'role') === 'dialog', 'role="dialog" written on mount');
		assert(await attr('#demo-account-popover', 'tabindex') === '-1', 'tabindex="-1" written on mount');
		const t = trig('demo-account-popover');
		assert(await attr(t, 'aria-haspopup') === 'dialog', 'trigger aria-haspopup="dialog"');
		assert(await attr(t, 'aria-expanded') === 'false', 'trigger aria-expanded="false"');
		assert(await attr(t, 'aria-controls') === 'demo-account-popover', 'trigger aria-controls = popover id');
		assert(!(await visible('demo-account-popover')), 'popover hidden initially');
	});

	// ═══ 1. Basic ═════════════════════════════════════════════
	await guarded('1. Basic - Account popover', async () => {
		await load();
		const t = trig('demo-account-popover');
		await page.evaluate(() => {
			window.__ev = [];
			const el = document.getElementById('demo-account-popover');
			['ln-popover:before-open', 'ln-popover:open', 'ln-popover:before-close', 'ln-popover:close']
				.forEach(n => el.addEventListener(n, () => window.__ev.push(n)));
		});
		await clickTrigger(t);
		await waitState('demo-account-popover', 'open');
		assert(await isOpenNative('demo-account-popover'), 'open: native :popover-open (top layer)');
		assert(await visible('demo-account-popover'), 'open: popover visible');
		assert(await attr(t, 'aria-expanded') === 'true', 'open: trigger aria-expanded="true"');
		assert(await attr('#demo-account-popover', 'data-ln-popover-placement') === 'bottom', 'open: default placement is bottom');
		assert(await page.evaluate(() => document.activeElement.textContent.trim() === 'Settings'
			&& document.getElementById('demo-account-popover').contains(document.activeElement)),
		'open: focus moved to first focusable inside popover (Settings link)');
		const ev = await page.evaluate(() => window.__ev);
		assert(ev.join(',') === 'ln-popover:before-open,ln-popover:open', `open events fired in order: ${ev.join(',')}`);

		// Click inside popover keeps it open
		await page.evaluate(() => document.querySelector('#demo-account-popover p').click());
		assert(await attr('#demo-account-popover', 'data-ln-popover') === 'open', 'click inside popover keeps it open');

		// Outside click closes
		await clickOutside();
		await waitState('demo-account-popover', 'closed');
		assert(!(await isOpenNative('demo-account-popover')), 'outside click: native popover closed');
		assert(!(await visible('demo-account-popover')), 'outside click: popover hidden');
		assert(await attr(t, 'aria-expanded') === 'false', 'outside click: aria-expanded="false"');
		assert(await attr('#demo-account-popover', 'data-ln-popover-placement') === null, 'close: placement attribute removed');
		const ev2 = await page.evaluate(() => window.__ev);
		assert(ev2.slice(2).join(',') === 'ln-popover:before-close,ln-popover:close', `close events fired in order: ${ev2.slice(2).join(',')}`);

		// Trigger toggles
		await clickTrigger(t);
		await waitState('demo-account-popover', 'open');
		await page.click(t);
		await waitState('demo-account-popover', 'closed');
		assert(!(await visible('demo-account-popover')), 'second trigger click closes popover');

		// Escape closes and returns focus to trigger
		await clickTrigger(t);
		await waitState('demo-account-popover', 'open');
		await page.keyboard.press('Escape');
		await waitState('demo-account-popover', 'closed');
		assert(!(await visible('demo-account-popover')), 'Escape: popover hidden');
		assert(await page.evaluate(s => document.activeElement === document.querySelector(s), t), 'Escape: focus restored to trigger');
	});

	// ═══ 2. Position attribute ════════════════════════════════
	await guarded('2. Position attribute', async () => {
		await load();
		for (const pos of ['top', 'bottom', 'left', 'right']) {
			const id = `demo-pos-${pos}`;
			assert(await attr('#' + id, 'data-ln-popover-position') === pos, `${id} declares position="${pos}"`);
			await clickTrigger(trig(id));
			await waitState(id, 'open');
			assert(await visible(id), `${pos}: popover visible`);
			const placement = await attr('#' + id, 'data-ln-popover-placement');
			assert(placement === pos, `${pos}: placement = "${placement}" (preferred side fits)`);
			const geo = await page.evaluate((i, s) => {
				const p = document.getElementById(i).getBoundingClientRect();
				const b = document.querySelector(s).getBoundingClientRect();
				return {
					p: { top: p.top, bottom: p.bottom, left: p.left, right: p.right },
					b: { top: b.top, bottom: b.bottom, left: b.left, right: b.right }
				};
			}, id, trig(id));
			const ok = pos === 'top' ? geo.p.bottom <= geo.b.top
				: pos === 'bottom' ? geo.p.top >= geo.b.bottom
					: pos === 'left' ? geo.p.right <= geo.b.left
						: geo.p.left >= geo.b.right;
			assert(ok, `${pos}: popover rect lies on the ${pos} side of its trigger`);
			// Close via Escape (trigger focused by real click)
			await page.keyboard.press('Escape');
			await waitState(id, 'closed');
		}
	});

	// ═══ 3. Auto-flip ═════════════════════════════════════════
	await guarded('3. Auto-flip near viewport edge', async () => {
		await load();
		assert(await attr('#demo-autoflip', 'data-ln-popover-position') === 'right', 'demo-autoflip prefers right');
		await clickTrigger(trig('demo-autoflip'));
		await waitState('demo-autoflip', 'open');
		const placement = await attr('#demo-autoflip', 'data-ln-popover-placement');
		assert(placement === 'left', `placement flipped to "left" (got "${placement}")`);
		const inView = await page.evaluate(() => {
			const r = document.getElementById('demo-autoflip').getBoundingClientRect();
			return r.left >= 0 && r.right <= window.innerWidth;
		});
		assert(inView, 'flipped popover is fully inside the viewport horizontally');
		await page.keyboard.press('Escape');
		await waitState('demo-autoflip', 'closed');
	});

	// ═══ 4. Nested ════════════════════════════════════════════
	await guarded('4. Nested popovers (LIFO Escape)', async () => {
		await load();
		await clickTrigger(trig('demo-nested-a'));
		await waitState('demo-nested-a', 'open');
		assert(await visible('demo-nested-a'), 'A open');
		await page.click(trig('demo-nested-b'));
		await waitState('demo-nested-b', 'open');
		assert(await attr('#demo-nested-a', 'data-ln-popover') === 'open', 'A stays open when B opens');
		assert(await isOpenNative('demo-nested-a') && await isOpenNative('demo-nested-b'), 'A and B both :popover-open');
		assert(await visible('demo-nested-a') && await visible('demo-nested-b'), 'A and B both visible');

		await page.keyboard.press('Escape');
		await waitState('demo-nested-b', 'closed');
		assert(await attr('#demo-nested-a', 'data-ln-popover') === 'open', 'Escape #1 closes B only; A still open');
		assert(!(await visible('demo-nested-b')), 'B hidden after first Escape');

		await page.keyboard.press('Escape');
		await waitState('demo-nested-a', 'closed');
		assert(!(await visible('demo-nested-a')), 'Escape #2 closes A');
	});

	// ═══ 5. Form inside popover ═══════════════════════════════
	await guarded('5. Form inside popover', async () => {
		await load();
		const t = trig('demo-form-popover');
		await page.evaluate(() => {
			window.__toasts = [];
			window.addEventListener('ln-toast:enqueue', e => window.__toasts.push(e.detail));
		});

		await clickTrigger(t);
		await waitState('demo-form-popover', 'open');
		assert(await page.evaluate(() => document.activeElement.id === 'invite-email'), 'open: focus on email input (first focusable)');

		await page.keyboard.type('colleague@example.test');
		assert(await attr('#demo-form-popover', 'data-ln-popover') === 'open', 'typing keeps popover open');
		assert(await page.evaluate(() => document.getElementById('invite-email').value) === 'colleague@example.test', 'email typed into input');

		await page.keyboard.press('Tab');
		assert(await page.evaluate(() => document.activeElement.textContent.trim()) === 'Send invite', 'Tab moves to "Send invite"');
		assert(await attr('#demo-form-popover', 'data-ln-popover') === 'open', 'Tab keeps popover open');

		// Cancel closes
		await page.click('#demo-form-popover-cancel');
		await waitState('demo-form-popover', 'closed');
		assert(!(await visible('demo-form-popover')), 'Cancel closes popover');

		// Submit: toast event + popover closes
		await clickTrigger(t);
		await waitState('demo-form-popover', 'open');
		await page.click('#demo-form-popover button[type="submit"]');
		await waitState('demo-form-popover', 'closed');
		assert(!(await visible('demo-form-popover')), 'Submit closes popover');
		const toasts = await page.evaluate(() => window.__toasts);
		assert(toasts.length === 1, `Submit enqueues exactly one toast (got ${toasts.length})`);
		assert(toasts[0].type === 'success' && toasts[0].title === 'Invited' && toasts[0].message === 'Invitation sent (demo)',
			'toast detail = {success, Invited, Invitation sent (demo)}');
	});

	// ═══ 6. aria-expanded indicator ═══════════════════════════
	await guarded('6. aria-expanded live indicator', async () => {
		await load();
		const valueText = () => page.evaluate(() => document.getElementById('demo-aria-value').textContent);
		await page.waitForFunction(() => document.getElementById('demo-aria-value').textContent === 'false', { timeout: 5000 });
		assert(await valueText() === 'false', 'indicator starts "false"');

		await clickTrigger('#demo-aria-trigger');
		await waitState('demo-aria-popover', 'open');
		await page.waitForFunction(() => document.getElementById('demo-aria-value').textContent === 'true', { timeout: 5000 });
		assert(await attr('#demo-aria-trigger', 'aria-expanded') === 'true', 'trigger aria-expanded="true" when open');
		assert(await valueText() === 'true', 'indicator shows "true" when open');

		await page.click('#demo-aria-trigger');
		await waitState('demo-aria-popover', 'closed');
		await page.waitForFunction(() => document.getElementById('demo-aria-value').textContent === 'false', { timeout: 5000 });
		assert(await valueText() === 'false', 'indicator back to "false" when closed');
	});

	if (failures.length) {
		console.error('\nFailed sections:\n  ' + failures.join('\n  '));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
