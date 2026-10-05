import { run, assert, BASE_URL } from './_harness.mjs';

// Page kind: demo/admin/src/pages/tooltip.html mixes TWO mechanisms.
//   Sections 1-3 (CSS baseline): pure CSS, no JS. The `tooltip` mixin renders the bubble
//     as `[data-ln-tooltip]::after { content: attr(data-ln-tooltip); opacity: 0 }`, which
//     becomes opacity 1 on :hover / :focus-visible (theme/config/mixins/_tooltip.scss).
//   Sections 4-8 (JS enhance): the REAL library component ln-tooltip
//     (components/ln-tooltip/src/ln-tooltip.js), bound to
//     [data-ln-tooltip-enhance], [data-ln-tooltip-enhanced], [data-ln-tooltip][title].
//     It mounts a `div.ln-tooltip` into the shared popover="manual" portal #ln-tooltip-portal,
//     sets data-ln-tooltip-placement (via ln-core computePlacement) and aria-describedby.
// There is no inline mock script on the page.

const PAGE_URL = BASE_URL + 'tooltip.html';
const PORTAL = '#ln-tooltip-portal';
const BUBBLE = '#ln-tooltip-portal .ln-tooltip';

const btn = text => `button[data-ln-tooltip="${text}"]`;
const SEL = {
	cssOnly: btn('Edit (CSS only)'),
	enhanced: btn('Edit (JS enhanced)'),
	flipFirst: btn('First button'),
	flipSecond: btn('Second button'),
	flipLast: btn('I flipped to the left — no room on right!'),
	long: 'button[data-ln-tooltip^="This is a very long tooltip text"]',
	keyboard: '#demo-keyboard-focus-btn',
	abbr: 'abbr[data-ln-tooltip][title]'
};
const ABBR_TITLE = 'International Organization for Standardization';

const failures = [];

run('demo/admin/tooltip.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section runs in its own try/catch so one failure does not hide the others.
	async function step(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  (section failed, continuing) ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction((a, b, c, d) => {
			const enhanced = document.querySelector(a);
			const flipLast = document.querySelector(b);
			const kb = document.querySelector(c);
			const abbr = document.querySelector(d);
			return !!(enhanced && enhanced.lnTooltipEnhance
				&& flipLast && flipLast.lnTooltipEnhance
				&& kb && kb.lnTooltipEnhance
				&& abbr && abbr.lnTooltipEnhance);
		}, { timeout: 10000 }, SEL.enhanced, SEL.flipLast, SEL.keyboard, SEL.abbr);
		await page.mouse.move(0, 0);
	}

	const bubbleCount = () => page.evaluate(b => document.querySelectorAll(b).length, BUBBLE);
	const bubbleText = () => page.evaluate(b => {
		const n = document.querySelector(b);
		return n ? n.textContent : null;
	}, BUBBLE);
	const attr = (sel, name) => page.evaluate((s, n) => document.querySelector(s).getAttribute(n), sel, name);
	const popoverOpen = () => page.evaluate(p => {
		const el = document.querySelector(p);
		return !!el && el.matches(':popover-open');
	}, PORTAL);

	async function waitBubble() {
		await page.waitForFunction(b => document.querySelectorAll(b).length === 1, { timeout: 5000 }, BUBBLE);
	}
	async function waitNoBubble() {
		await page.waitForFunction(b => document.querySelectorAll(b).length === 0, { timeout: 5000 }, BUBBLE);
	}

	const afterStyle = (sel, prop) => page.evaluate((s, p) => getComputedStyle(document.querySelector(s), '::after')[p], sel, prop);

	async function waitAfterOpacity(sel, value) {
		await page.waitForFunction((s, v) => getComputedStyle(document.querySelector(s), '::after').opacity === v,
			{ timeout: 5000 }, sel, value);
	}

	// ─── 1-3. CSS baseline ────────────────────────────────────────

	await step('1. CSS baseline: icon toolbar (hover shows ::after)', async () => {
		await load();
		const sel = btn('Save as draft');
		assert(await page.evaluate(() => document.querySelectorAll('.tooltip-toolbar > button[data-ln-tooltip]').length) === 3,
			'Toolbar has 3 tooltip buttons');
		assert(await afterStyle(sel, 'content') === '"Save as draft"', '::after content is the data-ln-tooltip text');
		assert(await afterStyle(sel, 'opacity') === '0', '::after is hidden (opacity 0) at rest');
		await page.hover(sel);
		await waitAfterOpacity(sel, '1');
		assert(true, '::after becomes visible (opacity 1) on :hover');
		await page.mouse.move(0, 0);
		await waitAfterOpacity(sel, '0');
		assert(true, '::after hidden again after mouse leaves');
		assert(await bubbleCount() === 0, 'CSS-only tooltip mounts nothing in the JS portal');
		assert(await attr(sel, 'aria-describedby') === null, 'CSS-only tooltip does not set aria-describedby');
	});

	await step('2. CSS baseline: all four positions', async () => {
		await load();
		const expected = {
			top: 'Top tooltip', bottom: 'Bottom tooltip', left: 'Left tooltip', right: 'Right tooltip'
		};
		const count = await page.evaluate(() => document.querySelectorAll('.tooltip-grid > button[data-ln-tooltip-position]').length);
		assert(count === 4, 'Compass grid has 4 positioned buttons');
		for (const [pos, text] of Object.entries(expected)) {
			const sel = `.tooltip-grid > button[data-ln-tooltip-position="${pos}"]`;
			assert(await attr(sel, 'data-ln-tooltip') === text, `${pos} trigger carries "${text}"`);
			assert(await afterStyle(sel, 'content') === `"${text}"`, `${pos}: ::after content is the tooltip text`);
			await page.hover(sel);
			await waitAfterOpacity(sel, '1');
			assert(true, `${pos}: ::after visible on hover`);
			await page.mouse.move(0, 0);
			await waitAfterOpacity(sel, '0');
		}
	});

	await step('3. CSS baseline: inline text', async () => {
		await load();
		const sel = 'span[data-ln-tooltip="ISO 9001 Quality Management"]';
		assert(await afterStyle(sel, 'content') === '"ISO 9001 Quality Management"', '::after content is the full standard name');
		await page.hover(sel);
		await waitAfterOpacity(sel, '1');
		assert(true, 'Inline-text tooltip visible on hover');
		assert(await bubbleCount() === 0, 'No JS bubble for inline CSS-only tooltip');
	});

	// ─── 4. Side by side ──────────────────────────────────────────

	await step('4. JS enhance: side by side (CSS only vs enhanced)', async () => {
		await load();
		assert(await attr(SEL.enhanced, 'data-ln-tooltip-enhanced') === '', 'Enhanced button gets runtime data-ln-tooltip-enhanced marker');
		assert(await attr(SEL.cssOnly, 'data-ln-tooltip-enhanced') === null, 'CSS-only button has no enhanced marker');
		assert(await afterStyle(SEL.enhanced, 'content') === 'none', 'Enhanced button: CSS ::after content is none (JS took over)');
		assert(await bubbleCount() === 0, 'No bubble in portal at rest');
		assert(!(await popoverOpen()), 'Portal popover closed at rest');

		await page.hover(SEL.cssOnly);
		await waitAfterOpacity(SEL.cssOnly, '1');
		assert(await bubbleCount() === 0, 'Hovering CSS-only button mounts no portal bubble');
		await page.mouse.move(0, 0);

		await page.hover(SEL.enhanced);
		await waitBubble();
		assert(await bubbleText() === 'Edit (JS enhanced)', 'Hover mounts bubble with the tooltip text');
		assert(await popoverOpen(), 'Portal is open as a popover (top layer) while shown');
		assert(await page.evaluate(p => document.querySelector(p).getAttribute('popover'), PORTAL) === 'manual', 'Portal has popover="manual"');
		const describedBy = await attr(SEL.enhanced, 'aria-describedby');
		assert(/^ln-tooltip-\d+$/.test(describedBy), 'Hovered enhanced button gets aria-describedby ln-tooltip-N');
		assert(await page.evaluate(b => document.querySelector(b).id, BUBBLE) === describedBy, 'aria-describedby points at the bubble id');
		assert(/^(top|bottom|left|right)$/.test(await attr(BUBBLE, 'data-ln-tooltip-placement')), 'Bubble has data-ln-tooltip-placement');
		assert(await page.evaluate(b => document.querySelector(b).hasAttribute('style'), BUBBLE), 'Bubble carries coordinate styles');

		await page.mouse.move(0, 0);
		await waitNoBubble();
		assert(await attr(SEL.enhanced, 'aria-describedby') === null, 'aria-describedby removed on mouse leave');
		assert(!(await popoverOpen()), 'Portal popover closed after leave');
	});

	await step('4b. JS enhance: only one bubble at a time', async () => {
		await load();
		await page.hover(SEL.enhanced);
		await waitBubble();
		await page.hover(SEL.flipFirst);
		await page.waitForFunction(b => {
			const n = document.querySelectorAll(b);
			return n.length === 1 && n[0].textContent === 'First button';
		}, { timeout: 5000 }, BUBBLE);
		assert(true, 'Moving to another enhanced trigger replaces the bubble (exactly one)');
		assert(await attr(SEL.enhanced, 'aria-describedby') === null, 'Previous trigger loses aria-describedby');
	});

	// ─── 5. Edge auto-flip ────────────────────────────────────────

	await step('5. JS enhance: placement and edge auto-flip', async () => {
		await load();
		assert(await page.evaluate(() => document.querySelectorAll('.tooltip-flip-row > button[data-ln-tooltip-position="right"]').length) === 3,
			'Flip row has 3 buttons preferring right');

		// [source] ln-core computePlacement: 'right' fits iff rect.right + 6 + width <= innerWidth.
		for (const sel of [SEL.flipFirst, SEL.flipSecond, SEL.flipLast]) {
			await page.hover(sel);
			await waitBubble();
			const info = await page.evaluate((s, b) => {
				const rect = document.querySelector(s).getBoundingClientRect();
				const node = document.querySelector(b);
				return {
					rightFits: rect.right + 6 + node.offsetWidth <= window.innerWidth,
					placement: node.getAttribute('data-ln-tooltip-placement')
				};
			}, sel, BUBBLE);
			const label = await attr(sel, 'data-ln-tooltip');
			assert(info.placement === (info.rightFits ? 'right' : 'left'),
				`"${label}": placement ${info.placement} matches source rule (right fits: ${info.rightFits})`);
			if (sel === SEL.flipLast) {
				assert(info.placement === 'left', '[prose] far-right button flips to the left');
			} else {
				assert(info.placement === 'right', 'Button with room stays on the right');
			}
			await page.mouse.move(0, 0);
			await waitNoBubble();
		}
	});

	// ─── 6. Long text ─────────────────────────────────────────────

	await step('6. JS enhance: long text wraps at max-width 20rem', async () => {
		await load();
		await page.hover(SEL.long);
		await waitBubble();
		const m = await page.evaluate(b => {
			const node = document.querySelector(b);
			const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
			const cs = getComputedStyle(node);
			return {
				maxWidth: cs.maxWidth,
				maxPx: 20 * rem,
				width: node.getBoundingClientRect().width,
				height: node.getBoundingClientRect().height,
				whiteSpace: cs.whiteSpace,
				left: node.getBoundingClientRect().left,
				right: node.getBoundingClientRect().right
			};
		}, BUBBLE);
		assert(m.maxWidth === `${m.maxPx}px`, `max-width is 20rem (${m.maxWidth})`);
		assert(m.width <= m.maxPx + 0.5, `Bubble width ${m.width}px <= 20rem (${m.maxPx}px)`);
		assert(m.right <= 1280 && m.left >= 0, 'Bubble stays inside the viewport horizontally');
		// [source] tooltip-bubble sets white-space: nowrap and tooltip-element does not override it.
		assert(m.whiteSpace === 'nowrap', `[source] bubble white-space is ${m.whiteSpace} (mixin tooltip-bubble: nowrap)`);
		// [prose] page says the text "wraps instead of overflowing"; contradicts the source above.
		assert(m.height > 40, `[prose] Text wraps onto multiple lines (height ${m.height}px)`);
	});

	// ─── 7. Keyboard focus ────────────────────────────────────────

	await step('7. JS enhance: keyboard focus + aria-describedby + Escape', async () => {
		await load();
		await page.focus(SEL.keyboard);
		await waitBubble();
		assert(await bubbleText() === 'Focus this button to see aria-describedby wired', 'Focus shows the tooltip text');
		const describedBy = await attr(SEL.keyboard, 'aria-describedby');
		assert(/^ln-tooltip-\d+$/.test(describedBy), 'Focused button gets aria-describedby ln-tooltip-N');
		assert(await page.evaluate(b => document.querySelector(b).id, BUBBLE) === describedBy, 'aria-describedby matches the bubble id in the portal');

		await page.keyboard.press('Escape');
		await waitNoBubble();
		assert(await attr(SEL.keyboard, 'aria-describedby') === null, 'Escape hides the tooltip and removes aria-describedby');

		await page.evaluate(s => document.querySelector(s).blur(), SEL.keyboard);
		await page.focus(SEL.keyboard);
		await waitBubble();
		await page.keyboard.press('Tab');
		await waitNoBubble();
		assert(await attr(SEL.keyboard, 'aria-describedby') === null, 'Tabbing away removes aria-describedby');
		assert(!(await popoverOpen()), 'Portal closed after blur');
	});

	await step('7b. JS enhance: hover then Escape; hover keeps tooltip while focused', async () => {
		await load();
		await page.hover(SEL.enhanced);
		await waitBubble();
		await page.keyboard.press('Escape');
		await waitNoBubble();
		assert(true, 'Escape hides a hover-opened tooltip');

		await page.focus(SEL.keyboard);
		await waitBubble();
		await page.hover(SEL.keyboard);
		await page.mouse.move(0, 0);
		await page.waitForFunction(() => document.activeElement && document.activeElement.id === 'demo-keyboard-focus-btn');
		assert(await bubbleCount() === 1, '[source] mouseleave does not hide while the trigger still has focus');
	});

	// ─── 8. Title fallback ────────────────────────────────────────

	await step('8. JS enhance: auto-attach on [data-ln-tooltip][title] (abbr)', async () => {
		await load();
		assert(await attr(SEL.abbr, 'data-ln-tooltip') === '', 'abbr has empty data-ln-tooltip');
		assert(await attr(SEL.abbr, 'data-ln-tooltip-enhance') === null, 'abbr has no data-ln-tooltip-enhance flag');
		assert(await attr(SEL.abbr, 'data-ln-tooltip-enhanced') === '', 'abbr auto-enhanced (runtime marker set)');
		assert(await attr(SEL.abbr, 'title') === ABBR_TITLE, 'title present at rest');

		await page.hover(SEL.abbr.replace('[title]', ''));
		await waitBubble();
		assert(await bubbleText() === ABBR_TITLE, 'Bubble text falls back to the title');
		assert(await page.evaluate(() => document.querySelector('abbr[data-ln-tooltip]').getAttribute('title')) === null,
			'title is stripped while the tooltip is visible');
		await page.mouse.move(0, 0);
		await waitNoBubble();
		assert(await attr(SEL.abbr, 'title') === ABBR_TITLE, 'title restored on hide');
		assert(await attr(SEL.abbr, 'aria-describedby') === null, 'aria-describedby removed on hide');

		await page.focus(SEL.abbr);
		await waitBubble();
		assert(await bubbleText() === ABBR_TITLE, 'Keyboard focus (tabindex=0) also shows the title text');
		await page.keyboard.press('Escape');
		await waitNoBubble();
		assert(await attr(SEL.abbr, 'title') === ABBR_TITLE, 'title restored after Escape');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
