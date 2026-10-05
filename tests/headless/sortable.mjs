import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/sortable.html (live demos
// #sortable-simple, #sortable-handle, #sortable-toggle, #sortable-events) and
// components/ln-sortable/src/ln-sortable.js.

const PAGE_URL = BASE_URL + 'sortable.html';
const LISTS = ['sortable-simple', 'sortable-handle', 'sortable-toggle', 'sortable-events'];
const EVENT_NAMES = [
	'ln-sortable:before-drag',
	'ln-sortable:drag-start',
	'ln-sortable:reordered',
	'ln-sortable:enabled',
	'ln-sortable:disabled',
	'ln-sortable:change'
];
const LOG_MAX = 10;

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/sortable.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
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
		await page.waitForFunction(ids => ids.every(id => {
			const el = document.getElementById(id);
			return el && el.lnSortable;
		}), { timeout: 10000 }, LISTS);
		// Record every ln-sortable event bubbling to the document.
		await page.evaluate(names => {
			window.__ev = [];
			names.forEach(name => document.addEventListener(name, e => {
				window.__ev.push({
					type: name,
					list: e.target.id,
					cancelable: e.cancelable,
					bubbles: e.bubbles,
					detail: {
						index: e.detail && e.detail.index,
						oldIndex: e.detail && e.detail.oldIndex,
						newIndex: e.detail && e.detail.newIndex,
						item: e.detail && e.detail.item ? e.detail.item.textContent.trim() : null
					}
				});
			}));
		}, EVENT_NAMES);
	}

	const order = id => page.evaluate(i => Array.from(document.getElementById(i).children)
		.map(li => li.textContent.trim()), id);

	const events = type => page.evaluate(t => window.__ev.filter(e => e.type === t), type);

	// Center point of the grab element of child `idx` (the handle when the child has one, else the child).
	// For `at` = 'text' the second span (label) of the child is used instead.
	async function point(id, idx, mode, frac) {
		return page.evaluate((i, n, m, f) => {
			const list = document.getElementById(i);
			list.scrollIntoView({ block: 'center' });
			const li = list.children[n];
			let el = li;
			if (m === 'handle') el = li.querySelector('[data-ln-sortable-handle]') || li;
			if (m === 'text') el = li.querySelector('span:not([data-ln-sortable-handle])');
			const r = el.getBoundingClientRect();
			if (m === 'target') {
				const t = li.getBoundingClientRect();
				return { x: t.left + t.width / 2, y: t.top + t.height * f };
			}
			return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
		}, id, idx, mode, frac);
	}

	// Real mouse drag: press on `from`, move over `to`, return before releasing when `hold`.
	async function drag(id, from, to, pos, opts = {}) {
		const mode = opts.grab || 'handle';
		const src = await point(id, from, mode, 0);
		const dst = await point(id, to, 'target', pos === 'before' ? 0.25 : 0.75);
		await page.mouse.move(src.x, src.y);
		await page.mouse.down();
		await page.mouse.move(dst.x, dst.y, { steps: 6 });
		if (opts.hold) return;
		await page.mouse.up();
	}

	async function release() {
		await page.mouse.up();
	}

	const expectOrder = async (id, expected, label) => {
		const actual = await order(id);
		assert(same(actual, expected), `${label}: expected [${expected.join(', ')}], got [${actual.join(', ')}]`);
	};

	// ─── Mount ─────────────────────────────────────────────────

	await section('Mount: instances and aria-roledescription', async () => {
		await load();
		for (const id of LISTS) {
			const role = await page.evaluate(i => document.getElementById(i).getAttribute('aria-roledescription'), id);
			assert(role === 'sortable list', `#${id} has aria-roledescription="sortable list"`);
		}
		const isEnabled = await page.evaluate(ids => ids.map(i => document.getElementById(i).lnSortable.isEnabled), LISTS);
		assert(isEnabled.every(Boolean), 'all four demo lists start enabled');
	});

	// ─── Simple list (no handle) ───────────────────────────────

	await section('Simple list: drag anywhere on the item', async () => {
		await load();
		await expectOrder('sortable-simple', ['First item', 'Second item', 'Third item', 'Fourth item', 'Fifth item'], 'initial order');

		// Mid-drag state
		await drag('sortable-simple', 0, 2, 'after', { hold: true });
		const mid = await page.evaluate(() => {
			const list = document.getElementById('sortable-simple');
			const [first, , third] = list.children;
			return {
				active: list.classList.contains('ln-sortable--active'),
				dragging: first.classList.contains('ln-sortable--dragging'),
				grabbed: first.getAttribute('aria-grabbed'),
				dropAfter: third.classList.contains('ln-sortable--drop-after'),
				dropBefore: third.classList.contains('ln-sortable--drop-before')
			};
		});
		assert(mid.active, 'container gets .ln-sortable--active during drag');
		assert(mid.dragging, 'dragged item gets .ln-sortable--dragging');
		assert(mid.grabbed === 'true', 'dragged item gets aria-grabbed="true"');
		assert(mid.dropAfter && !mid.dropBefore, 'pointer in bottom half of target gives .ln-sortable--drop-after');

		await release();
		await expectOrder('sortable-simple', ['Second item', 'Third item', 'First item', 'Fourth item', 'Fifth item'], 'after dropping First after Third');

		const after = await page.evaluate(() => {
			const list = document.getElementById('sortable-simple');
			return {
				active: list.classList.contains('ln-sortable--active'),
				leftover: list.querySelectorAll('.ln-sortable--dragging, .ln-sortable--drop-before, .ln-sortable--drop-after, [aria-grabbed]').length
			};
		});
		assert(!after.active && after.leftover === 0, 'all drag classes and aria-grabbed are cleaned up after drop');

		const start = await events('ln-sortable:drag-start');
		assert(start.length === 1 && start[0].list === 'sortable-simple' && start[0].detail.index === 0 && start[0].detail.item === 'First item',
			'ln-sortable:drag-start detail { item: First item, index: 0 }, bubbles to document');
		assert(start[0].cancelable === false, 'drag-start is not cancelable');
		const before = await events('ln-sortable:before-drag');
		assert(before.length === 1 && before[0].cancelable === true && before[0].detail.index === 0, 'ln-sortable:before-drag fires once, cancelable, index 0');
		const re = await events('ln-sortable:reordered');
		assert(re.length === 1 && re[0].detail.oldIndex === 0 && re[0].detail.newIndex === 2 && re[0].detail.item === 'First item',
			'ln-sortable:reordered detail { oldIndex: 0, newIndex: 2 }');
		assert(re[0].cancelable === false, 'reordered is not cancelable');

		// Drop in the top half of a target
		await drag('sortable-simple', 4, 0, 'before', { hold: true });
		const hasBefore = await page.evaluate(() => document.getElementById('sortable-simple').children[0].classList.contains('ln-sortable--drop-before'));
		assert(hasBefore, 'pointer in top half of target gives .ln-sortable--drop-before');
		await release();
		await expectOrder('sortable-simple', ['Fifth item', 'Second item', 'Third item', 'First item', 'Fourth item'], 'after dropping Fifth before Second');
		const re2 = await events('ln-sortable:reordered');
		assert(re2.length === 2 && re2[1].detail.oldIndex === 4 && re2[1].detail.newIndex === 0, 'second reordered detail { oldIndex: 4, newIndex: 0 }');
	});

	await section('Simple list: drop without a target does not reorder', async () => {
		await load();
		// Press and release on the same item: the dragged item is skipped as a drop target.
		const p = await point('sortable-simple', 1, 'handle', 0);
		await page.mouse.move(p.x, p.y);
		await page.mouse.down();
		await page.mouse.move(p.x + 2, p.y + 1, { steps: 2 });
		await release();
		await expectOrder('sortable-simple', ['First item', 'Second item', 'Third item', 'Fourth item', 'Fifth item'], 'order unchanged');
		const re = await events('ln-sortable:reordered');
		assert(re.length === 0, 'no ln-sortable:reordered when nothing was dropped on another item');
		const start = await events('ln-sortable:drag-start');
		assert(start.length === 1, 'drag-start still fired for the press');
	});

	await section('before-drag is cancelable and blocks the drag', async () => {
		await load();
		await page.evaluate(() => {
			document.getElementById('sortable-simple').addEventListener('ln-sortable:before-drag', e => e.preventDefault());
		});
		await drag('sortable-simple', 0, 2, 'after');
		await expectOrder('sortable-simple', ['First item', 'Second item', 'Third item', 'Fourth item', 'Fifth item'], 'order unchanged after prevented drag');
		assert((await events('ln-sortable:before-drag')).length === 1, 'before-drag fired');
		assert((await events('ln-sortable:drag-start')).length === 0, 'no drag-start after preventDefault');
		assert((await events('ln-sortable:reordered')).length === 0, 'no reordered after preventDefault');
		const active = await page.evaluate(() => document.getElementById('sortable-simple').classList.contains('ln-sortable--active'));
		assert(!active, 'container never became .ln-sortable--active');
	});

	// ─── Handle list ───────────────────────────────────────────

	await section('Handle list: only the handle starts a drag', async () => {
		await load();
		const initial = ['Dashboard', 'Users', 'Reports', 'Settings', 'Archive'];
		await expectOrder('sortable-handle', initial, 'initial order');

		// Grab the label text of "Users" (not the handle)
		await drag('sortable-handle', 1, 3, 'after', { grab: 'text' });
		await expectOrder('sortable-handle', initial, 'order unchanged when dragging by the label');
		assert((await events('ln-sortable:before-drag')).length === 0, 'no before-drag when pointerdown is outside a handle');

		// Grab the handle
		await drag('sortable-handle', 1, 3, 'after', { grab: 'handle' });
		await expectOrder('sortable-handle', ['Dashboard', 'Reports', 'Settings', 'Users', 'Archive'], 'after dragging Users by its handle below Settings');
		const re = await events('ln-sortable:reordered');
		assert(re.length === 1 && re[0].list === 'sortable-handle' && re[0].detail.oldIndex === 1 && re[0].detail.newIndex === 3 && re[0].detail.item === 'Users',
			'reordered detail { item: Users, oldIndex: 1, newIndex: 3 }');
	});

	// ─── Enable / Disable ──────────────────────────────────────

	await section('Enable / Disable toggle', async () => {
		await load();
		const status = () => page.evaluate(() => document.getElementById('toggle-status').textContent.trim());
		const clickButton = label => page.evaluate(l => {
			const nav = document.getElementById('sortable-toggle').closest('section').querySelector('nav.demo-actions');
			Array.from(nav.querySelectorAll('button')).find(b => b.textContent.trim() === l).click();
		}, label);

		assert(await status() === 'Status: enabled', 'status indicator starts as "Status: enabled"');
		await expectOrder('sortable-toggle', ['Alpha', 'Beta', 'Gamma'], 'initial order');

		await clickButton('Disable');
		await page.waitForFunction(() => window.__ev.some(e => e.type === 'ln-sortable:disabled'), { timeout: 5000 });
		const dis = await events('ln-sortable:disabled');
		assert(dis.length === 1 && dis[0].list === 'sortable-toggle', 'ln-sortable:disabled dispatched once on #sortable-toggle');
		assert(await page.evaluate(() => document.getElementById('sortable-toggle').getAttribute('data-ln-sortable')) === 'disabled', 'attribute data-ln-sortable="disabled"');
		assert(await page.evaluate(() => document.getElementById('sortable-toggle').lnSortable.isEnabled) === false, 'lnSortable.isEnabled is false');
		await page.waitForFunction(() => document.getElementById('toggle-status').textContent.trim() === 'Status: disabled', { timeout: 5000 });
		assert(await status() === 'Status: disabled', 'status indicator shows "Status: disabled"');

		await drag('sortable-toggle', 0, 2, 'after');
		await expectOrder('sortable-toggle', ['Alpha', 'Beta', 'Gamma'], 'drag ignored while disabled');
		assert((await events('ln-sortable:before-drag')).length === 0, 'no before-drag while disabled');

		await clickButton('Enable');
		await page.waitForFunction(() => window.__ev.some(e => e.type === 'ln-sortable:enabled'), { timeout: 5000 });
		const en = await events('ln-sortable:enabled');
		assert(en.length === 1 && en[0].list === 'sortable-toggle', 'ln-sortable:enabled dispatched once on #sortable-toggle');
		assert(await page.evaluate(() => document.getElementById('sortable-toggle').lnSortable.isEnabled) === true, 'lnSortable.isEnabled is true');
		await page.waitForFunction(() => document.getElementById('toggle-status').textContent.trim() === 'Status: enabled', { timeout: 5000 });
		assert(await status() === 'Status: enabled', 'status indicator shows "Status: enabled" again');

		await drag('sortable-toggle', 0, 2, 'after');
		await expectOrder('sortable-toggle', ['Beta', 'Gamma', 'Alpha'], 'drag works again after re-enable');
		const re = await events('ln-sortable:reordered');
		assert(re.length === 1 && re[0].detail.oldIndex === 0 && re[0].detail.newIndex === 2, 'reordered detail { oldIndex: 0, newIndex: 2 }');
	});

	// ─── Events log ────────────────────────────────────────────

	await section('Events log mirrors reordered events and caps at 10 entries', async () => {
		await load();
		const log = () => page.evaluate(() => Array.from(document.getElementById('sortable-log').children).map(li => li.textContent));
		assert((await log()).length === 0, 'log starts empty');

		await drag('sortable-events', 0, 2, 'after');
		await expectOrder('sortable-events', ['Item Two', 'Item Three', 'Item One', 'Item Four'], 'after dragging Item One below Item Three');
		const first = await log();
		assert(first.length === 1 && /^\[\d\d:\d\d:\d\d\] reordered: 0 → 2$/.test(first[0]), `log entry "[hh:mm:ss] reordered: 0 → 2", got ${JSON.stringify(first)}`);

		// 11 more reorders (0 -> 3) = 12 total; the log keeps only the newest 10, newest first.
		for (let i = 0; i < 11; i++) {
			await drag('sortable-events', 0, 3, 'after');
		}
		const full = await log();
		assert(full.length === LOG_MAX, `log capped at ${LOG_MAX} entries, got ${full.length}`);
		assert(full.every(t => /reordered: 0 → 3$/.test(t)), 'all remaining entries are the newest reorders (0 → 3), oldest entry dropped');
		assert((await events('ln-sortable:reordered')).length === 12, '12 reordered events in total');
	});

	// ─── Result ────────────────────────────────────────────────

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
