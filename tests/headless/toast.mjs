import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/toast.html is driven by the REAL ln-toast component (components/ln-toast),
// not an inline mock. The page's buttons only dispatch `ln-toast:enqueue` on window
// (inline onclick, as the demo prescribes); everything observable is the library's work.
//
// Facts come from demo/admin/src/pages/toast.html, the shell toast container in
// demo/admin/src/shell.html (<ul data-ln-toast> + template ln-toast-item) and
// components/ln-toast/src/ln-toast.js + ln-toast.scss.
//
// Timers: setTimeout calls with delay >= 1000 ms are captured by a fake clock injected
// before page scripts run (window.__timers / window.__fire). They never fire by
// themselves; the test fires them on demand. Shorter timers (the 200 ms removal after
// .ln-out, requestAnimationFrame) stay real. Side effect: any other page timer >= 1 s
// does not run in this test.

const PAGE_URL = BASE_URL + 'toast.html';
const SHELL = 'body > ul[data-ln-toast]';
const SSR = '#demo-ssr-toast';

const TYPES = [
	{ button: 'Success', type: 'success', title: 'Success', message: 'The record has been saved.' },
	{ button: 'Error', type: 'error', title: 'Error', message: 'Something went wrong.' },
	{ button: 'Warning', type: 'warn', title: 'Warning', message: 'Please check the data.' },
	{ button: 'Info', type: 'info', title: 'Info', message: 'A new version is available.' }
];

const failures = [];

run('demo/admin/toast.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated: a failing assertion is recorded, the rest still run.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	await page.evaluateOnNewDocument(() => {
		const realSet = window.setTimeout.bind(window);
		const realClear = window.clearTimeout.bind(window);
		const list = [];
		let n = 0;
		window.__timers = list;
		window.setTimeout = function (fn, delay, ...args) {
			const d = Number(delay) || 0;
			if (d >= 1000 && typeof fn === 'function') {
				const id = 9000000 + (++n);
				list.push({ id, delay: d, fn, args, cleared: false, fired: false });
				return id;
			}
			return realSet(fn, delay, ...args);
		};
		window.clearTimeout = function (id) {
			const t = list.find(x => x.id === id);
			if (t) { t.cleared = true; return; }
			return realClear(id);
		};
		window.__fire = id => {
			const t = list.find(x => x.id === id);
			if (!t || t.cleared || t.fired) return false;
			t.fired = true;
			t.fn(...t.args);
			return true;
		};
	});

	// Fresh state: wait until ln-toast has bound the SSR container (and the shell container exists).
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const ssr = document.getElementById('demo-ssr-toast');
			const shell = document.querySelector('body > ul[data-ln-toast]');
			return !!(ssr && ssr.lnToast && shell && shell.querySelector('template[data-ln-template="ln-toast-item"]'));
		}, { timeout: 10000 });
	}

	const mark = () => page.evaluate(() => window.__timers.length);

	const timersSince = m => page.evaluate(from => window.__timers.slice(from)
		.map(t => ({ id: t.id, delay: t.delay, cleared: t.cleared, fired: t.fired })), m);

	const fire = id => page.evaluate(i => window.__fire(i), id);

	const enqueue = detail => page.evaluate(d => {
		window.dispatchEvent(new CustomEvent('ln-toast:enqueue', { detail: d }));
	}, detail);

	const clickDemoButton = text => page.evaluate(t => {
		const btn = Array.from(document.querySelectorAll('button[onclick*="ln-toast:enqueue"]'))
			.find(b => b.textContent.trim() === t);
		if (!btn) throw new Error('demo button not found: ' + t);
		btn.click();
	}, text);

	// Snapshot of toast items inside a container selector.
	const items = sel => page.evaluate(s => Array.from(document.querySelectorAll(s + ' > [data-ln-toast-item]')).map(li => {
		const title = li.querySelector('.title');
		const body = li.querySelector('.body');
		return {
			classes: Array.from(li.classList),
			title: title ? title.textContent.trim() : null,
			body: body ? body.textContent.trim() : null,
			bodyItems: body ? Array.from(body.querySelectorAll('li')).map(x => x.textContent.trim()) : [],
			closeLabel: (li.querySelector('[data-ln-toast-close]') || document.createElement('i')).getAttribute('aria-label'),
			visibleIcons: Array.from(li.querySelectorAll('.icon li[data-ln-toast-when]'))
				.filter(x => getComputedStyle(x).display !== 'none')
				.map(x => x.getAttribute('data-ln-toast-when'))
		};
	}), sel);

	const popoverOpen = sel => page.evaluate(s => document.querySelector(s).matches(':popover-open'), sel);

	const waitItemCount = (sel, count) => page.waitForFunction((s, c) =>
		document.querySelectorAll(s + ' > [data-ln-toast-item]').length === c, { timeout: 5000 }, sel, count);

	// First dynamic item has finished its enter transition (transient .ln-enter gone).
	const waitSettled = sel => page.waitForFunction(s => {
		const li = document.querySelector(s + ' > [data-ln-toast-item]');
		return !!li && !li.classList.contains('ln-enter');
	}, { timeout: 5000 }, sel);

	const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

	// ─── 1. SSR-authored flash messages ────────────────────────

	await guarded('SSR-authored toasts hydrate and auto-dismiss per item', async () => {
		await load();

		const info = await page.evaluate(sel => {
			const el = document.querySelector(sel);
			return {
				timeoutDefault: el.lnToast.timeoutDefault,
				max: el.lnToast.max,
				popover: el.getAttribute('popover'),
				open: el.matches(':popover-open'),
				titles: Array.from(el.querySelectorAll('[data-ln-toast-item] .title')).map(t => t.textContent.trim())
			};
		}, SSR);
		assert(info.timeoutDefault === 0, 'container data-ln-toast-timeout="0" -> timeoutDefault 0');
		assert(info.max === 5, 'data-ln-toast-max absent -> max falls back to 5');
		assert(same(info.titles, ['Saved', 'Session Expired']), 'two authored items present: Saved, Session Expired');
		assert(info.popover === 'manual', 'container promoted to popover="manual" because it has items');
		assert(info.open, 'container is :popover-open (top layer)');

		const t8000 = (await timersSince(0)).filter(t => t.delay === 8000);
		assert(t8000.length === 1, 'exactly one 8000 ms timer (item override); the timeout-0 item has none');
		assert(!t8000[0].cleared && !t8000[0].fired, '8000 ms timer is pending');

		assert(await fire(t8000[0].id), 'fire the 8000 ms timer');
		await page.waitForFunction(sel => {
			const lis = document.querySelectorAll(sel + ' > [data-ln-toast-item]');
			return lis.length === 1 && lis[0].querySelector('.title').textContent.trim() === 'Saved';
		}, { timeout: 5000 }, SSR);
		assert((await items(SSR))[0].title === 'Saved', 'Session Expired removed after .ln-out; persistent "Saved" remains');
		assert(await popoverOpen(SSR), 'container stays in top layer while an item remains');

		await page.evaluate(sel => document.querySelector(sel + ' [data-ln-toast-close]').click(), SSR);
		await waitItemCount(SSR, 0);
		assert(true, 'close button dismisses the persistent toast');
		await page.waitForFunction(sel => !document.querySelector(sel).matches(':popover-open'), { timeout: 5000 }, SSR);
		assert(!(await popoverOpen(SSR)), 'empty container leaves the top layer');
	});

	// ─── 2. Four categorized types via the demo buttons ────────

	for (const t of TYPES) {
		await guarded(`Demo button "${t.button}" -> ${t.type} toast`, async () => {
			await load();
			const m = await mark();
			await clickDemoButton(t.button);
			await waitItemCount(SHELL, 1);
			await waitSettled(SHELL);

			const [item] = await items(SHELL);
			assert(item.classes.includes(t.type), `item has class "${t.type}" (data-ln-attr="class:type")`);
			assert(!item.classes.includes('ln-enter'), 'transient .ln-enter removed after first frame');
			assert(item.title === t.title, `title is "${t.title}"`);
			assert(item.body === t.message, `body is "${t.message}"`);
			assert(item.closeLabel === 'Close', 'close button carries aria-label="Close"');
			assert(same(item.visibleIcons, [t.type]), `only the "${t.type}" icon is displayed`);
			assert(await popoverOpen(SHELL), 'shell container is :popover-open while it has items');

			const timers = await timersSince(m);
			assert(timers.length === 1 && timers[0].delay === 6000, 'one auto-dismiss timer at the 6000 ms default');
		});
	}

	// ─── 3. Array message renders a list ───────────────────────

	await guarded('Array message renders a bulleted list', async () => {
		await load();
		await clickDemoButton('Show validation errors');
		await waitItemCount(SHELL, 1);
		const [item] = await items(SHELL);
		assert(item.classes.includes('error'), 'type error class');
		assert(item.title === 'Validation', 'title is "Validation"');
		assert(same(item.bodyItems, ['Name is required', 'Email format is incorrect', 'Password is too short']),
			'body holds a <ul> with the three messages in order');
		const nested = await page.evaluate(sel => document.querySelectorAll(sel + ' > [data-ln-toast-item] .body > ul').length, SHELL);
		assert(nested === 1, 'exactly one <ul> inside .body');
	});

	// ─── 4. Auto-dismiss, hover, close button ──────────────────

	await guarded('Auto-dismiss timer removes the toast (.ln-out then removal)', async () => {
		await load();
		const m = await mark();
		await clickDemoButton('Success');
		await waitItemCount(SHELL, 1);
		await waitSettled(SHELL);
		const [timer] = await timersSince(m);
		assert(timer.delay === 6000, 'timer delay is 6000 ms');
		assert(await fire(timer.id), 'fire the auto-dismiss timer');
		await page.waitForFunction(sel => {
			const li = document.querySelector(sel + ' > [data-ln-toast-item]');
			return !li || li.classList.contains('ln-out');
		}, { timeout: 5000 }, SHELL);
		await waitItemCount(SHELL, 0);
		assert(true, 'toast removed from the DOM after the out animation');
		await page.waitForFunction(sel => !document.querySelector(sel).matches(':popover-open'), { timeout: 5000 }, SHELL);
		assert(!(await popoverOpen(SHELL)), 'empty shell container leaves the top layer');
	});

	await guarded('Hover does not pause the timer [source]', async () => {
		// Page prose says hovering pauses the timer; ln-toast.js has no hover/mouse handling.
		await load();
		const m = await mark();
		await clickDemoButton('Info');
		await waitItemCount(SHELL, 1);
		await waitSettled(SHELL);
		const box = await page.evaluate(sel => {
			const r = document.querySelector(sel + ' > [data-ln-toast-item]').getBoundingClientRect();
			return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
		}, SHELL);
		await page.mouse.move(box.x, box.y);
		const [timer] = await timersSince(m);
		assert(!timer.cleared, '[source] hovering the toast leaves the dismiss timer armed (prose claims it pauses)');
		assert(await fire(timer.id), 'timer still fires while hovered');
		await waitItemCount(SHELL, 0);
		assert(true, '[source] hovered toast is dismissed');
	});

	await guarded('Close button dismisses a dynamic toast and cancels its timer', async () => {
		await load();
		const m = await mark();
		await clickDemoButton('Warning');
		await waitItemCount(SHELL, 1);
		await page.evaluate(sel => document.querySelector(sel + ' > [data-ln-toast-item] [data-ln-toast-close]').click(), SHELL);
		await waitItemCount(SHELL, 0);
		assert(true, 'toast removed after clicking [data-ln-toast-close]');
		const [timer] = await timersSince(m);
		assert(timer.cleared, 'dismiss cleared the pending auto-dismiss timer');
	});

	// ─── 5. Event options: timeout, max, clear ─────────────────

	await guarded('detail.timeout overrides default; timeout 0 is persistent', async () => {
		await load();
		const m = await mark();
		await enqueue({ type: 'info', title: 'Short', message: 'x', timeout: 1500 });
		await enqueue({ type: 'info', title: 'Sticky', message: 'y', timeout: 0 });
		await waitItemCount(SHELL, 2);
		const timers = await timersSince(m);
		assert(timers.length === 1 && timers[0].delay === 1500, 'only the 1500 ms toast armed a timer; timeout 0 armed none');
		assert(await fire(timers[0].id), 'fire the 1500 ms timer');
		await page.waitForFunction(sel => {
			const lis = document.querySelectorAll(sel + ' > [data-ln-toast-item]');
			return lis.length === 1 && lis[0].querySelector('.title').textContent.trim() === 'Sticky';
		}, { timeout: 5000 }, SHELL);
		assert(true, 'only the sticky toast remains');
	});

	await guarded('Max 5 concurrent toasts: oldest evicted', async () => {
		await load();
		for (let i = 1; i <= 6; i++) await enqueue({ type: 'info', title: 'T' + i, message: 'm' + i });
		const list = await items(SHELL);
		assert(list.length === 5, 'six enqueued -> five visible (default max 5)');
		assert(same(list.map(x => x.title), ['T2', 'T3', 'T4', 'T5', 'T6']), 'T1 evicted, order T2..T6');
	});

	await guarded('ln-toast:clear dismisses every toast in every container', async () => {
		await load();
		const m = await mark();
		await enqueue({ type: 'success', title: 'A', message: 'a' });
		await enqueue({ type: 'error', title: 'B', message: 'b' });
		await waitItemCount(SHELL, 2);
		await page.evaluate(() => window.dispatchEvent(new CustomEvent('ln-toast:clear')));
		await page.waitForFunction(() => document.querySelectorAll('[data-ln-toast-item]').length === 0, { timeout: 5000 });
		assert(true, 'dynamic and SSR-authored items all removed');
		const timers = (await timersSince(m)).filter(t => t.delay === 6000);
		assert(timers.length === 2 && timers.every(t => t.cleared), 'both pending auto-dismiss timers cleared');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		for (const f of failures) console.error('  - ' + f);
		throw new Error(`${failures.length} section(s) failed`);
	}
});
