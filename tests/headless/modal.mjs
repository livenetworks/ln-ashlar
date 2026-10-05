import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/modal.html and the components it
// mounts (ln-modal, ln-ui-coordinator, ln-fill, ln-form, ln-tabs, ln-toast, ln-core hash codec).
// Where page prose contradicts component source, the SOURCE is asserted (see "[source]" labels).

const PAGE_URL = BASE_URL + 'modal.html';
const MODAL_IDS = ['demo-basic', 'demo-form', 'demo-large', 'demo-tall', 'demo-destructive', 'demo-hash-modal', 'demo-events'];
const EVENT_LOG = '#modal-event-log';
const HASH_LOG = '#hash-demo-log';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/modal.html', async ({ page }) => {

	const failures = [];

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  (section aborted: ${err.message})`);
		}
	}

	// ─── Page helpers ──────────────────────────────────────────

	async function load(hash = '') {
		await page.goto('about:blank');
		await page.goto(PAGE_URL + hash, { waitUntil: 'load' });
		await page.waitForFunction(ids => {
			if (!ids.every(id => { const d = document.getElementById(id); return d && d.lnModal; })) return false;
			if (!document.getElementById('demo-tab').lnTabs) return false;
			if (!document.getElementById('demo-form-el').lnForm) return false;
			return true;
		}, { timeout: 10000 }, MODAL_IDS);
	}

	const state = id => page.evaluate(i => {
		const d = document.getElementById(i);
		return {
			attr: d.getAttribute('data-ln-modal'),
			native: d.open,
			inst: d.lnModal.isOpen,
			display: getComputedStyle(d).display,
			mode: d.getAttribute('data-ln-modal-mode')
		};
	}, id);

	const bodyLocked = () => page.evaluate(() => document.body.classList.contains('ln-modal-open'));

	async function expectOpen(id, open, label) {
		await page.waitForFunction((i, o) => {
			const d = document.getElementById(i);
			return (d.getAttribute('data-ln-modal') === 'open') === o && d.open === o;
		}, { timeout: 5000 }, id, open).catch(() => {});
		const s = await state(id);
		assert(s.native === open && s.inst === open && (s.attr === 'open') === open,
			`${label}: #${id} ${open ? 'open' : 'closed'} (attr=${JSON.stringify(s.attr)}, dialog.open=${s.native}, instance.isOpen=${s.inst})`);
		return s;
	}

	const jsClick = selector => page.evaluate(sel => document.querySelector(sel).click(), selector);
	const trigger = id => `button[data-ln-modal-for="${id}"]`;
	const activeInfo = () => page.evaluate(() => {
		const a = document.activeElement;
		return { tag: a.tagName, id: a.id, closeAttr: a.hasAttribute('data-ln-modal-close'), inHeader: !!a.closest('header') };
	});

	const toasts = () => page.evaluate(() => Array.from(document.querySelectorAll('ul[data-ln-toast] [data-ln-toast-item]'))
		.map(li => ({
			cls: li.className,
			title: li.querySelector('.title').textContent,
			body: li.querySelector('.body').textContent
		})));

	async function expectToast(title, body, label) {
		await page.waitForFunction(t => Array.from(document.querySelectorAll('ul[data-ln-toast] [data-ln-toast-item] .title'))
			.some(el => el.textContent === t), { timeout: 5000 }, title).catch(() => {});
		const found = (await toasts()).find(t => t.title === title);
		assert(!!found, `${label}: toast "${title}" enqueued`);
		assert(found.body === body, `${label}: toast body is ${JSON.stringify(body)} (got ${JSON.stringify(found.body)})`);
		assert(found.cls.split(/\s+/).includes('success'), `${label}: toast has class "success" (got ${JSON.stringify(found.cls)})`);
	}

	const parseHash = async () => {
		const raw = await page.evaluate(() => location.hash);
		const map = {};
		raw.replace(/^#/, '').split('&').filter(Boolean).forEach(part => {
			const i = part.indexOf(':');
			map[i > -1 ? part.slice(0, i) : part] = i > -1 ? decodeURIComponent(part.slice(i + 1)) : '';
		});
		return { raw, map, keys: Object.keys(map) };
	};

	const waitHash = (fnBody, label) => page.waitForFunction(new Function('return (' + fnBody + ')(location.hash)'), { timeout: 5000 })
		.catch(() => { throw new Error(`timeout waiting for hash: ${label}`); });

	const tabState = () => page.evaluate(() => ({
		active: document.getElementById('demo-tab').getAttribute('data-ln-tabs-active'),
		overviewHidden: document.querySelector('[data-ln-panel="overview"]').hidden,
		membersHidden: document.querySelector('[data-ln-panel="members"]').hidden
	}));

	const logLines = sel => page.evaluate(s => document.querySelector(s).textContent.split('\n'), sel);

	// ─── Sections ──────────────────────────────────────────────

	await section('Initial state: all 7 modals mounted and closed', async () => {
		await load();
		for (const id of MODAL_IDS) {
			const s = await state(id);
			assert(!s.native && !s.inst && s.attr !== 'open', `#${id} starts closed`);
			assert(s.display === 'none', `#${id} closed dialog computed display is none (got ${s.display})`);
		}
		assert(!(await bodyLocked()), 'body has no ln-modal-open class initially');
		const modeNew = await page.evaluate(() => ['demo-form', 'demo-hash-modal']
			.every(id => document.getElementById(id).getAttribute('data-ln-modal-mode') === 'new'));
		assert(modeNew, 'demo-form and demo-hash-modal start with data-ln-modal-mode="new"');
	});

	await section('Basic modal: open, scroll lock, focus, dismiss paths', async () => {
		await load();

		await page.click(trigger('demo-basic'));
		const s = await expectOpen('demo-basic', true, 'trigger click');
		assert(s.display === 'flex', `open dialog computed display is flex (got ${s.display})`);
		assert(await bodyLocked(), 'body gets ln-modal-open while open');
		assert(await page.evaluate(() => getComputedStyle(document.body).overflow === 'hidden'), 'body overflow is hidden while open');
		const focus = await activeInfo();
		assert(focus.tag === 'BUTTON' && focus.closeAttr && focus.inHeader,
			`no inputs: focus lands on first focusable (header close button) [${JSON.stringify(focus)}]`);

		await jsClick('#demo-basic header [data-ln-modal-close]');
		await expectOpen('demo-basic', false, 'header close button');
		assert(!(await bodyLocked()), 'ln-modal-open removed after close');
		const trigFocus = await page.evaluate(() => document.activeElement === document.querySelector('button[data-ln-modal-for="demo-basic"]'));
		assert(trigFocus, 'focus returns to the trigger that opened the modal');

		await page.click(trigger('demo-basic'));
		await expectOpen('demo-basic', true, 'reopen');
		await jsClick('#demo-basic footer [data-ln-modal-close]');
		await expectOpen('demo-basic', false, 'footer close button');

		await page.click(trigger('demo-basic'));
		await expectOpen('demo-basic', true, 'reopen for Escape');
		await page.keyboard.press('Escape');
		await expectOpen('demo-basic', false, 'Escape key');
		assert(!(await bodyLocked()), 'ln-modal-open removed after Escape');

		await page.click(trigger('demo-basic'));
		await expectOpen('demo-basic', true, 'reopen for backdrop click');
		await page.mouse.click(5, 5);
		await page.evaluate(() => new Promise(r => setTimeout(r, 300))); // negative check: give a (non-existent) handler time to act
		const s2 = await state('demo-basic');
		assert(s2.native && s2.attr === 'open',
			'[source] backdrop click does NOT close the modal (ln-modal.js has no backdrop handler; page prose claims it does)');
		await jsClick('#demo-basic footer [data-ln-modal-close]');
		await expectOpen('demo-basic', false, 'cleanup close');
	});

	await section('Cancelable before-open / before-close', async () => {
		await load();

		await page.evaluate(() => {
			const d = document.getElementById('demo-basic');
			window.__veto = e => e.preventDefault();
			d.addEventListener('ln-modal:before-open', window.__veto);
		});
		await jsClick(trigger('demo-basic'));
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
		const blocked = await state('demo-basic');
		assert(!blocked.native && !blocked.inst && blocked.attr === 'close', 'preventDefault on before-open keeps modal closed (attr reverted to "close")');
		assert(!(await bodyLocked()), 'scroll lock not applied when open is vetoed');
		await page.evaluate(() => document.getElementById('demo-basic').removeEventListener('ln-modal:before-open', window.__veto));

		await jsClick(trigger('demo-basic'));
		await expectOpen('demo-basic', true, 'open after veto removed');
		await page.evaluate(() => document.getElementById('demo-basic').addEventListener('ln-modal:before-close', window.__veto));
		await jsClick('#demo-basic header [data-ln-modal-close]');
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
		const stay = await state('demo-basic');
		assert(stay.native && stay.inst && stay.attr === 'open', 'preventDefault on before-close keeps modal open');
		assert(await bodyLocked(), 'scroll lock kept when close is vetoed');
		await page.evaluate(() => document.getElementById('demo-basic').removeEventListener('ln-modal:before-close', window.__veto));
		await jsClick('#demo-basic header [data-ln-modal-close]');
		await expectOpen('demo-basic', false, 'close after veto removed');
	});

	await section('Live event log (demo-events)', async () => {
		await load();
		assert((await logLines(EVENT_LOG))[0] === 'No events yet.', 'event log starts as "No events yet."');

		const strip = lines => lines.map(l => l.replace(/^\[\d\d:\d\d:\d\d\] /, ''));
		const stamped = lines => lines.every(l => /^\[\d\d:\d\d:\d\d\] ln-modal:/.test(l));

		await page.click(trigger('demo-events'));
		await expectOpen('demo-events', true, 'events modal open');
		let lines = await logLines(EVENT_LOG);
		assert(same(strip(lines), ['ln-modal:before-open', 'ln-modal:open']) && stamped(lines),
			`open logs before-open then open, timestamped (got ${JSON.stringify(lines)})`);

		await jsClick('#demo-events footer [data-ln-modal-close]');
		await expectOpen('demo-events', false, 'events modal closed');
		lines = await logLines(EVENT_LOG);
		assert(same(strip(lines), ['ln-modal:before-open', 'ln-modal:open', 'ln-modal:before-close', 'ln-modal:close']),
			`close appends before-close then close (got ${JSON.stringify(strip(lines))})`);

		// Log keeps the last 5 entries only.
		await page.click(trigger('demo-events'));
		await expectOpen('demo-events', true, 'events modal reopen');
		lines = await logLines(EVENT_LOG);
		assert(same(strip(lines), ['ln-modal:open', 'ln-modal:before-close', 'ln-modal:close', 'ln-modal:before-open', 'ln-modal:open'].slice(0, 5)),
			`log is capped at 5 entries (got ${JSON.stringify(strip(lines))})`);
		await jsClick('#demo-events footer [data-ln-modal-close]');
		await expectOpen('demo-events', false, 'events modal cleanup');

		const detail = await page.evaluate(() => new Promise(resolve => {
			const d = document.getElementById('demo-events');
			d.addEventListener('ln-modal:open', e => resolve({ keys: Object.keys(e.detail).sort(), modalId: e.detail.modalId, targetIsDialog: e.detail.target === d }), { once: true });
			document.querySelector('button[data-ln-modal-for="demo-events"]').click();
		}));
		assert(detail.modalId === 'demo-events' && detail.targetIsDialog, 'open detail carries modalId and target');
		assert(same(detail.keys, ['modalId', 'target']),
			`[source] ln-modal:open detail keys are exactly [modalId,target] — page table also lists hashNs,param (got ${JSON.stringify(detail.keys)})`);
		await jsClick('#demo-events footer [data-ln-modal-close]');
	});

	await section('Form modal: new mode, mode toggle, prefilled edit trigger', async () => {
		await load();
		const whenDisplay = (id, mode) => page.evaluate((i, m) => getComputedStyle(document.querySelector('#' + i + ' [data-ln-modal-when="' + m + '"]')).display, id, mode);

		await page.click(trigger('demo-form') + ':not([data-ln-fill-form])');
		const s = await expectOpen('demo-form', true, 'Form Modal (New)');
		assert(s.mode === 'new', 'mode is "new"');
		assert((await whenDisplay('demo-form', 'new')) === 'inline', 'New User title variant visible in new mode');
		assert((await whenDisplay('demo-form', 'edit')) === 'none', 'Edit User title variant hidden in new mode');
		const focusId = (await activeInfo()).id;
		assert(focusId === 'modal-user-name', `[autofocus] input receives focus on open (got "${focusId}")`);

		// Mode attribute is the CSS surface: switching to edit swaps the title variants; close resets to new.
		await page.evaluate(() => document.getElementById('demo-form').setAttribute('data-ln-modal-mode', 'edit'));
		assert((await whenDisplay('demo-form', 'edit')) === 'inline', 'edit title variant visible in edit mode');
		assert((await whenDisplay('demo-form', 'new')) === 'none', 'new title variant hidden in edit mode');
		await jsClick('#demo-form footer [data-ln-modal-close]');
		await expectOpen('demo-form', false, 'Cancel');
		assert((await state('demo-form')).mode === 'new', 'close resets data-ln-modal-mode to "new"');

		// Validation gate: empty required fields block the submit; no toast, modal stays open.
		await page.click(trigger('demo-form') + ':not([data-ln-fill-form])');
		await expectOpen('demo-form', true, 'reopen for invalid submit');
		await page.click('#demo-form-el button[type="submit"]');
		await page.evaluate(() => new Promise(r => setTimeout(r, 300)));
		assert((await state('demo-form')).attr === 'open' && (await toasts()).length === 0, 'invalid submit (required empty) keeps modal open and enqueues no toast');

		// Valid submit: demo script dispatches ln-ajax:success -> coordinator toasts + closes.
		await page.type('#modal-user-name', 'Test User');
		await page.type('#modal-user-email', 'test.user@example.com');
		await page.click('#demo-form-el button[type="submit"]');
		await expectToast('User Saved', 'User "Test User" was saved successfully.', 'valid submit');
		await expectOpen('demo-form', false, 'auto-close on ln-ajax:success');
		assert(!(await bodyLocked()), 'scroll lock released after auto-close');

		// Prefilled trigger: ln-fill copies data-ln-fill-* of the trigger into the form.
		await page.click('button[data-ln-fill-form="demo-form-el"]');
		const s2 = await expectOpen('demo-form', true, 'Form Modal (Edit - Prefilled)');
		const form = await page.evaluate(() => ({
			name: document.getElementById('modal-user-name').value,
			email: document.getElementById('modal-user-email').value,
			role: document.getElementById('modal-user-role').value,
			action: document.getElementById('demo-form-el').getAttribute('action'),
			method: document.querySelector('#demo-form-el input[name="_method"]').value,
			fieldName: document.querySelector('#demo-form [data-ln-field="name"]').textContent
		}));
		assert(form.name === 'Dalibor Sojic', `name prefilled (got ${JSON.stringify(form.name)})`);
		assert(form.email === 'dalibor@example.com', `email prefilled (got ${JSON.stringify(form.email)})`);
		assert(form.role === 'Administrator', `role prefilled (got ${JSON.stringify(form.role)})`);
		assert(form.fieldName === 'Dalibor Sojic', `[data-ln-fillable] title field name filled (got ${JSON.stringify(form.fieldName)})`);
		assert(form.action === '/api/users' && form.method === '', `no fill id => form stays in base action mode (action=${form.action}, _method=${JSON.stringify(form.method)})`);
		assert(s2.mode === 'new' && (await whenDisplay('demo-form', 'new')) === 'inline',
			'[source] prefilled trigger has no data-ln-modal-mode, so ln-modal sets the modal to "new" (title shows "New User", not "Edit User")');
		await jsClick('#demo-form footer [data-ln-modal-close]');
		await expectOpen('demo-form', false, 'edit modal closed');
	});

	await section('Large modal', async () => {
		await load();
		await page.click(trigger('demo-large'));
		await expectOpen('demo-large', true, 'Large Modal');
		const rows = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-large tbody tr'))
			.map(tr => Array.from(tr.cells).map(td => td.textContent.trim())));
		assert(JSON.stringify(rows) === JSON.stringify([['Marko', 'OK', '95'], ['Ana', 'OK', '88'], ['Ivan', 'Error', '42']]),
			`table rows rendered (got ${JSON.stringify(rows)})`);
		await jsClick('#demo-large header [data-ln-modal-close]');
		await expectOpen('demo-large', false, 'Large Modal closed');
	});

	await section('Tall content modal: only main scrolls, submit auto-closes', async () => {
		await load();
		await page.setViewport({ width: 1280, height: 500 });
		await page.click(trigger('demo-tall'));
		await expectOpen('demo-tall', true, 'Tall Content');
		const m = await page.evaluate(() => {
			const main = document.querySelector('#demo-tall main');
			const header = document.querySelector('#demo-tall header');
			const before = header.getBoundingClientRect().top;
			main.scrollTop = 80;
			return {
				scrollable: main.scrollHeight > main.clientHeight,
				scrolled: main.scrollTop > 0,
				headerStill: header.getBoundingClientRect().top === before
			};
		});
		await page.setViewport({ width: 1280, height: 900 });
		assert(m.scrollable, 'main content is taller than its box at 500px viewport height');
		assert(m.scrolled, 'main scrolls');
		assert(m.headerStill, 'header stays in place while main scrolls');

		await page.click('#demo-tall button[type="submit"]');
		await expectToast('Changes Saved', 'Tall content form saved successfully.', 'tall submit');
		await expectOpen('demo-tall', false, 'auto-close on ln-ajax:success');
	});

	await section('Destructive confirm', async () => {
		await load();
		await page.click(trigger('demo-destructive'));
		await expectOpen('demo-destructive', true, 'Delete Membership');
		const focus = await page.evaluate(() => document.activeElement === document.querySelector('#demo-destructive footer button[autofocus]'));
		assert(focus, 'focus lands on the [autofocus] Cancel button');
		const method = await page.evaluate(() => document.querySelector('#demo-destructive-form input[name="_method"]').value);
		assert(method === 'DELETE', '_method hidden input is DELETE');

		await jsClick('#demo-destructive footer button[data-ln-modal-close]');
		await expectOpen('demo-destructive', false, 'Cancel');
		assert((await toasts()).length === 0, 'Cancel enqueues no toast');

		await page.click(trigger('demo-destructive'));
		await expectOpen('demo-destructive', true, 'reopen');
		await page.click('#demo-destructive button[type="submit"]');
		await expectToast('Record Deleted', 'Membership record was permanently removed.', 'delete');
		await expectOpen('demo-destructive', false, 'auto-close on ln-ajax:success');
	});

	await section('Hash: modal segment merged with tab segment (tab first, then modal)', async () => {
		await load();
		assert((await logLines(HASH_LOG))[0] === 'No events yet.', 'hash log starts as "No events yet."');

		await jsClick('a[data-ln-tab][href="#demo-tab:members"]');
		await waitHash('h => h === "#demo-tab:members"', '#demo-tab:members');
		let t = await tabState();
		assert(t.active === 'members' && !t.membersHidden && t.overviewHidden, 'Members tab active, panel shown');

		await jsClick('a[href="#demo-hash-modal:5"]');
		await expectOpen('demo-hash-modal', true, 'Edit #5 anchor');
		let h = await parseHash();
		assert(h.map['demo-tab'] === 'members' && h.map['demo-hash-modal'] === '5' && h.keys.length === 2,
			`hash merges both segments (got ${h.raw})`);
		assert(same(h.keys, ['demo-tab', 'demo-hash-modal']), `segment order is tab, then modal (got ${h.raw})`);
		t = await tabState();
		assert(t.active === 'members' && !t.membersHidden, 'tab STAYS on Members after the modal anchor click');

		const f = await page.evaluate(() => ({
			title: document.getElementById('demo-hash-title').value,
			action: document.getElementById('demo-hash-form').getAttribute('action'),
			method: document.querySelector('#demo-hash-form input[name="_method"]').value,
			fieldId: document.querySelector('#demo-hash-modal [data-ln-field="id"]').textContent
		}));
		assert(f.title === 'Annual ISO report', `Title filled from trigger (got ${JSON.stringify(f.title)})`);
		assert(f.fieldId === '5', `[data-ln-field="id"] filled with 5 (got ${JSON.stringify(f.fieldId)})`);
		assert(f.action === '/api/records/5' && f.method === 'PUT', `ln-form edit action applied (action=${f.action}, _method=${f.method})`);

		const log = (await logLines(HASH_LOG)).join('\n');
		assert(/open {2}param=\(none\) {2}hash=#demo-tab:members&demo-hash-modal:5/.test(log),
			`[source] hash log shows open event with param=(none) (open detail has no param) (got ${JSON.stringify(log)})`);

		// Closing removes ONLY the modal segment.
		await jsClick('#demo-hash-modal footer [data-ln-modal-close]');
		await expectOpen('demo-hash-modal', false, 'Close button');
		await waitHash('h => h === "#demo-tab:members"', 'modal segment removed, tab kept');
		h = await parseHash();
		assert(h.raw === '#demo-tab:members', `close clears the modal segment and keeps the tab segment (got ${h.raw})`);
	});

	await section('Hash: modal first, then switch tab (modal stays open)', async () => {
		await load();
		await jsClick('a[href="#demo-hash-modal:5"]');
		await expectOpen('demo-hash-modal', true, 'Edit #5 anchor');
		let h = await parseHash();
		assert(h.raw === '#demo-hash-modal:5', `hash is #demo-hash-modal:5 (got ${h.raw})`);

		await jsClick('a[data-ln-tab][href="#demo-tab:members"]');
		await waitHash('h => h.indexOf("demo-tab:members") > -1', 'tab segment added');
		h = await parseHash();
		assert(h.map['demo-hash-modal'] === '5' && h.map['demo-tab'] === 'members' && h.keys.length === 2,
			`both segments present (got ${h.raw})`);
		const t = await tabState();
		assert(t.active === 'members' && !t.membersHidden, 'Members tab active');
		const s = await state('demo-hash-modal');
		assert(s.native && s.attr === 'open', 'modal STAYS open after switching tab');
		const title = await page.evaluate(() => document.getElementById('demo-hash-title').value);
		assert(title === 'Annual ISO report', `Title field still filled (got ${JSON.stringify(title)})`);
	});

	await section('Hash: New (no param) resets the previously filled form', async () => {
		await load();
		await jsClick('a[href="#demo-hash-modal:42"]');
		await expectOpen('demo-hash-modal', true, 'Edit #42 anchor');
		const filled = await page.evaluate(() => document.getElementById('demo-hash-title').value);
		assert(filled === 'Internal audit log', `Edit #42 fills title (got ${JSON.stringify(filled)})`);
		await jsClick('#demo-hash-modal footer [data-ln-modal-close]');
		await expectOpen('demo-hash-modal', false, 'close #42');
		assert((await parseHash()).raw === '', 'close leaves an empty hash');

		await jsClick('a[href="#demo-hash-modal"]');
		await expectOpen('demo-hash-modal', true, 'New (no param) anchor');
		assert((await parseHash()).raw === '#demo-hash-modal', 'hash is #demo-hash-modal (empty value encoded as bare namespace)');
		const f = await page.evaluate(() => ({
			title: document.getElementById('demo-hash-title').value,
			action: document.getElementById('demo-hash-form').getAttribute('action'),
			method: document.querySelector('#demo-hash-form input[name="_method"]').value
		}));
		assert(f.title === '', `form reset to empty (got ${JSON.stringify(f.title)})`);
		assert(f.action === '/api/records' && f.method === '', `base action restored (action=${f.action}, _method=${JSON.stringify(f.method)})`);
	});

	await section('Hash: deep link on load opens modal and activates tab', async () => {
		await load('#demo-tab:members&demo-hash-modal:42');
		await expectOpen('demo-hash-modal', true, 'deep link opens the modal');
		const t = await tabState();
		assert(t.active === 'members' && !t.membersHidden, 'Members tab active from deep link');
		const title = await page.evaluate(() => document.getElementById('demo-hash-title').value);
		assert(title === '',
			`[source] deep link does not fill the form (no component dispatches ln-fill:request on hash open; page prose says Title "Internal audit log" is filled) (got ${JSON.stringify(title)})`);
	});

	await section('Hash: Back after modal anchor', async () => {
		await load();
		await jsClick('a[data-ln-tab][href="#demo-tab:members"]');
		await waitHash('h => h === "#demo-tab:members"', '#demo-tab:members');
		await jsClick('a[href="#demo-hash-modal:5"]');
		await expectOpen('demo-hash-modal', true, 'Edit #5 anchor');
		await page.goBack();
		await waitHash('h => h === "#demo-tab:members"', 'hash back to tab only');
		const t = await tabState();
		assert(t.active === 'members' && !t.membersHidden, 'tab state intact after Back');
		const s = await state('demo-hash-modal');
		assert(s.native && s.attr === 'open',
			'[source] Back does not close the modal (ln-ui-coordinator only OPENS modals on hashchange; page prose step 4 says it closes)');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
