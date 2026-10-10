import { run, assert, BASE_URL } from './_harness.mjs';

// Page: demo/admin/write-workflow.html (source demo/admin/src/pages/write-workflow.html).
//
// The demo IS driven by real library components: ln-data-coordinator (#wwf-coordinator),
// ln-data-store (#wwf-documents, IndexedDB), ln-api-connector (#wwf-connector),
// ln-table (#wwf-table), ln-modal (#wwf-modal), ln-form + ln-fill (#wwf-form),
// ln-confirm (delete buttons). The only mock is the page's own backend
// (demo/admin/src/mock-write-workflow.js), a window.fetch interceptor for /documents with a
// 400ms delay, persisting to localStorage 'ln-demo-write-workflow'. Inline page scripts only
// wire the delete row-action -> coordinator request-delete and close the modal on store
// created/updated.
//
// Facts come from: ln-data-coordinator/src (_onFormSubmit, _fanOut*, _reconcileServerMutation),
// ln-form/src (_applyActionMode), ln-fill/src, ln-modal/src + ln-modal.scss, ln-confirm/src,
// ln-api-connector/src (update body/url), ln-table/src (row-action, empty template).
//
// KNOWN DEMO BUG (asserted in the first section, left failing on purpose): the page's
// <div data-ln-data-coordinator id="wwf-coordinator"> has an EMPTY attribute value, but the coordinator's name is
// that value (ln-data-coordinator.js _name / _owns). The table source and the form scope are "wwf-documents", so
// the coordinator never serves the table (0 rows) and never intercepts the form submit. The sections after it
// therefore fail on the unpatched page; they pass when the value is set to "wwf-documents".
//
// Not covered: toasts (the mock returns {message} envelopes but no component on this page maps
// api-connector results to ln-toast; ui-coordinator only listens to ln-ajax:*), and optimistic
// ROLLBACK (the coordinator only reports 'connector-error'; it never reverts the store).

const PAGE_URL = BASE_URL + 'write-workflow.html';
const MOCK_KEY = 'ln-demo-write-workflow';

const SEED = [
	{ id: 1, title: 'Onboarding Checklist', status: 'draft', expected_version: 1 },
	{ id: 2, title: 'Q3 Compliance Report', status: 'published', expected_version: 1 }
];

const ROWS = '#wwf-table tbody tr[data-ln-table-row]';

run('demo/admin/write-workflow.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated: one failure is recorded, the others still run.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	const client = await page.createCDPSession();

	// Wipes IndexedDB + localStorage of the origin so ln-data-store and the mock start from the seed.
	async function wipe() {
		await page.goto('about:blank');
		await client.send('Storage.clearDataForOrigin', {
			origin: new URL(BASE_URL).origin,
			storageTypes: 'indexeddb,local_storage'
		});
	}

	async function ready(rowCount) {
		await page.waitForFunction((n) => {
			const coord = document.getElementById('wwf-coordinator');
			const store = document.getElementById('wwf-documents');
			const conn = document.getElementById('wwf-connector');
			const table = document.getElementById('wwf-table');
			const modal = document.getElementById('wwf-modal');
			const form = document.getElementById('wwf-form');
			if (!coord || !coord.lnDataCoordinator || !store || !store.lnDataStore) return false;
			if (!conn || !conn.lnApiConnector || !table || !table.lnTable) return false;
			if (!modal || !modal.lnModal || !form || !form.lnForm) return false;
			return true;
		}, { timeout: 15000 }, rowCount);
		// Row count is only waited for here; each section asserts it, so a demo that never renders rows fails on
		// a clear assertion instead of a timeout that cascades through every section.
		await page.waitForFunction(n => document.querySelectorAll('#wwf-table tbody tr[data-ln-table-row]').length === n,
			{ timeout: 5000 }, rowCount).catch(() => {});
		// Observation only: log requests that reach window.fetch (the page's mock still answers) and coordinator errors.
		await page.evaluate(() => {
			window.__reqs = [];
			window.__errs = [];
			const f = window.fetch;
			window.fetch = function (input, init) {
				window.__reqs.push({
					url: typeof input === 'string' ? input : input.url,
					method: ((init && init.method) || 'GET').toUpperCase(),
					body: init && init.body ? JSON.parse(init.body) : null
				});
				return f.call(window, input, init);
			};
			document.addEventListener('ln-data-coordinator:error', e => {
				window.__errs.push({ operation: e.detail.operation });
			});
		});
	}

	async function load(rowCount, fresh) {
		if (fresh) await wipe();
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await ready(rowCount);
	}

	// ─── Helpers ───────────────────────────────────────────────

	const rows = () => page.evaluate(sel => Array.from(document.querySelectorAll(sel)).map(tr => ({
		id: tr.getAttribute('data-ln-table-row-id'),
		title: tr.cells[0].textContent.trim(),
		status: tr.cells[1].textContent.trim()
	})), ROWS);

	const mockRecords = () => page.evaluate(key => JSON.parse(localStorage.getItem(key) || 'null'), MOCK_KEY);
	const reqs = () => page.evaluate(() => window.__reqs.filter(r => r.method !== 'GET'));
	const errs = () => page.evaluate(() => window.__errs);

	const modalState = () => page.evaluate(() => {
		const m = document.getElementById('wwf-modal');
		const vis = el => getComputedStyle(el).display !== 'none';
		return {
			attr: m.getAttribute('data-ln-modal'),
			open: m.open,
			mode: m.getAttribute('data-ln-modal-mode'),
			whenNew: vis(m.querySelector('[data-ln-modal-when="new"]')),
			whenEdit: vis(m.querySelector('[data-ln-modal-when="edit"]'))
		};
	});

	const formState = () => page.evaluate(() => {
		const f = document.getElementById('wwf-form');
		const methodInput = f.querySelector('input[name="_method"]');
		return {
			action: f.getAttribute('action'),
			method: methodInput ? methodInput.value : null,
			id: f.elements.id.value,
			expectedVersion: f.elements.expected_version.value,
			title: f.elements.title.value,
			status: f.elements.status.value
		};
	});

	const waitModal = (open) => page.waitForFunction(o => {
		const m = document.getElementById('wwf-modal');
		return (m.getAttribute('data-ln-modal') === 'open') === o && m.open === o;
	}, { timeout: 5000 }, open);

	const clickNew = () => page.evaluate(() => document.querySelector('#wwf-table > header button[data-ln-modal-for="wwf-modal"]').click());
	const clickEdit = id => page.evaluate(i => document.querySelector('#wwf-table tbody tr[data-ln-table-row-id="' + i + '"] button[aria-label="Edit"]').click(), id);
	const clickSave = () => page.evaluate(() => document.querySelector('#wwf-form button[type="submit"]').click());
	const clickCancel = () => page.evaluate(() => document.querySelector('#wwf-form footer button[data-ln-modal-close]').click());

	async function setTitle(text) {
		await page.focus('#wwf-title');
		await page.$eval('#wwf-title', el => el.select());
		await page.keyboard.type(text);
	}

	const waitRows = (pred, arg) => page.waitForFunction((src, a) => {
		const list = Array.from(document.querySelectorAll('#wwf-table tbody tr[data-ln-table-row]')).map(tr => ({
			id: tr.getAttribute('data-ln-table-row-id'),
			title: tr.cells[0].textContent.trim(),
			status: tr.cells[1].textContent.trim()
		}));
		return (new Function('rows', 'arg', 'return (' + src + ')(rows, arg)'))(list, a);
	}, { timeout: 8000 }, pred.toString(), arg);

	const total = () => page.$eval('#wwf-table [data-ln-table-total]', el => el.textContent.trim());

	let createdId = null;

	// ─── Sections ──────────────────────────────────────────────

	await check('Coordinator is addressable: its name matches the table source, the form scope and the store id', async () => {
		await load(2, true);
		const names = await page.evaluate(() => ({
			coord: document.getElementById('wwf-coordinator').getAttribute('data-ln-data-coordinator'),
			source: document.getElementById('wwf-table').getAttribute('data-ln-table-source'),
			scope: document.getElementById('wwf-form').getAttribute('data-ln-data-coordinator-scope'),
			storeId: document.getElementById('wwf-documents').id
		}));
		// [source] ln-data-coordinator.js: _name = value of data-ln-data-coordinator; _owns(name) is `name === this._name`,
		// used by _refreshAll/_serveElement (table source) and _onFormSubmit (form scope).
		assert(names.coord === names.source && names.coord === names.scope && names.coord === names.storeId,
			`[source] data-ln-data-coordinator value "${names.coord}" equals table-source "${names.source}", form scope "${names.scope}" and store id "${names.storeId}"`);
	});

	await check('Initial sync: connector GET /documents -> store -> table rows', async () => {
		await load(2, true);
		const list = await rows();
		assert(list.length === 2, 'Two rows rendered from the mock seed');
		const byId = Object.fromEntries(list.map(r => [r.id, r]));
		assert(byId['1'] && byId['1'].title === SEED[0].title && byId['1'].status === 'draft', 'Row 1 is "Onboarding Checklist" / draft [source: mock seed]');
		assert(byId['2'] && byId['2'].title === SEED[1].title && byId['2'].status === 'published', 'Row 2 is "Q3 Compliance Report" / published [source: mock seed]');
		await page.waitForFunction(() => document.querySelector('#wwf-table [data-ln-table-total]').textContent.trim() === '2', { timeout: 5000 });
		assert(await total() === '2', 'Footer [data-ln-table-total] shows 2');
		const empty = await page.$('#wwf-table .ln-table__empty-state');
		assert(empty === null, 'No empty state while rows exist');
		const m = await modalState();
		// [source] ln-modal.js: data-ln-modal values are open|close with fallback 'close'; the markup carries the empty marker.
		assert(m.attr !== 'open' && m.open === false, `Modal starts closed (data-ln-modal "${m.attr}", dialog.open ${m.open})`);
		const gets = await page.evaluate(() => window.__reqs.filter(r => r.method === 'GET').length);
		assert(true, `GET requests seen after observer install: ${gets} (informational)`);
	});

	await check('New Document: modal opens in "new" mode with a reset form at the base action', async () => {
		await clickNew();
		await waitModal(true);
		const m = await modalState();
		assert(m.mode === 'new', 'Modal mode is "new"');
		assert(m.whenNew === true && m.whenEdit === false, '"New Document" title visible, "Edit Document" hidden');
		const f = await formState();
		assert(f.action === '/documents', 'Form action is the base action /documents');
		assert(!f.method, 'No _method override value in new mode');
		assert(f.id === '' && f.title === '' && f.status === 'draft', 'Fields are empty / default draft');
		const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
		assert(focused === 'wwf-title', '[autofocus] title input receives focus');
	});

	await check('Cancel closes the modal without any write request', async () => {
		await page.keyboard.type('Discarded');
		await clickCancel();
		await waitModal(false);
		assert((await reqs()).length === 0, 'No mutation request was sent');
		assert((await rows()).length === 2, 'Row count unchanged');
	});

	await check('Create: POST to the form action, optimistic temp row, reconcile to server id', async () => {
		await clickNew();
		await waitModal(true);
		await setTitle('Quarterly Budget');
		await page.select('#wwf-status', 'published');
		await clickSave();
		// Optimistic: the store emits created immediately (demo wiring closes the modal) and the row shows with a temp id
		// while the mock is still sleeping 400ms.
		await waitModal(false);
		await waitRows(r => r.some(x => x.title === 'Quarterly Budget' && x.id.startsWith('_temp_')));
		assert(true, 'Optimistic row with _temp_ id appears and modal closes before the server answers');
		await waitRows(r => r.length === 3 && r.some(x => x.title === 'Quarterly Budget' && x.id === '101'));
		const list = await rows();
		const created = list.find(r => r.title === 'Quarterly Budget');
		createdId = created.id;
		assert(created.id === '101' && created.status === 'published', 'Temp id replaced by server id 101 (mock nextId = 101), status published');
		assert(!list.some(r => r.id.startsWith('_temp_')), 'No _temp_ rows remain');
		const sent = await reqs();
		assert(sent.length === 1 && sent[0].method === 'POST' && sent[0].url === '/documents', 'Exactly one POST /documents');
		const body = sent[0].body;
		assert(JSON.stringify(Object.keys(body).sort()) === '["status","title"]' && body.title === 'Quarterly Budget' && body.status === 'published',
			'POST body is {title,status} only (id and expected_version stripped by the coordinator)');
		const rec = await mockRecords();
		assert(rec.length === 3 && rec[2].id === 101 && rec[2].expected_version === 1, 'Mock backend persisted the record with expected_version 1');
		assert(await total() === '3', 'Footer total is 3');
		assert(await page.evaluate(() => window.__errs.length) === 0, 'No coordinator errors');
	});

	await check('Edit: fill, edit mode, PUT to /documents/:id, optimistic update, version bump', async () => {
		await clickEdit(1);
		await waitModal(true);
		const m = await modalState();
		assert(m.mode === 'edit', 'Modal mode is "edit"');
		assert(m.whenEdit === true && m.whenNew === false, '"Edit Document" title visible, "New Document" hidden');
		const f = await formState();
		assert(f.id === '1' && f.title === SEED[0].title && f.status === 'draft', 'Form filled from the row: id=1, title, status=draft');
		assert(f.expectedVersion === '1', 'expected_version filled via data-ln-fill-as="expectedVersion"');
		assert(f.action === '/documents/1', 'Form action rewritten to /documents/1 (base + id)');
		assert(f.method === 'PUT', 'Hidden _method input is PUT');

		await setTitle('Onboarding Checklist v2');
		await page.select('#wwf-status', 'published');
		await clickSave();
		await waitModal(false);
		await waitRows(r => r.some(x => x.id === '1' && x.title === 'Onboarding Checklist v2' && x.status === 'published'));
		assert(true, 'Row 1 updated optimistically and modal closed');

		await page.waitForFunction(() => {
			const b = document.querySelector('#wwf-table tbody tr[data-ln-table-row-id="1"] button[aria-label="Edit"]');
			return b && b.getAttribute('data-ln-fill-expected-version') === '2';
		}, { timeout: 8000 });
		assert(true, 'After reconcile the row Edit button carries expected_version 2');

		const sent = (await reqs()).filter(r => r.method === 'PUT');
		assert(sent.length === 1 && sent[0].url === '/documents/1', 'Exactly one PUT /documents/1');
		const b = sent[0].body;
		assert(b.title === 'Onboarding Checklist v2' && b.status === 'published' && String(b.expected_version) === '1' && !('id' in b),
			'PUT body carries title, status and the expected_version read at edit time (1), no id');
		const rec = (await mockRecords()).find(r => r.id === 1);
		assert(rec.title === 'Onboarding Checklist v2' && rec.status === 'published' && rec.expected_version === 2, 'Mock backend record updated, expected_version 2');
		assert(await page.evaluate(() => window.__errs.length) === 0, 'No coordinator errors');
		assert((await modalState()).mode === 'new', 'Modal mode returns to "new" after close');
	});

	await check('New after Edit resets the form back to create mode', async () => {
		await clickNew();
		await waitModal(true);
		const f = await formState();
		// [source] ln-form.js _onLnFill: null record -> form.reset(); form.reset() restores each field's default value.
		assert(f.id === '' && f.title === '' && f.status === 'draft' && f.expectedVersion === '',
			`Form fields reset to defaults (id "", title "", status draft, expected_version ""), got ${JSON.stringify(f)}`);
		assert(f.action === '/documents' && !f.method, 'Action restored to /documents, _method cleared');
		assert((await modalState()).mode === 'new', 'Mode is "new"');
		await clickCancel();
		await waitModal(false);
	});

	await check('Persistence: reload keeps created and updated records (store cache + mock)', async () => {
		await load(3, false);
		const list = await rows();
		const byId = Object.fromEntries(list.map(r => [r.id, r]));
		assert(byId['1'] && byId['1'].title === 'Onboarding Checklist v2' && byId['1'].status === 'published', 'Updated row 1 persisted');
		assert(byId['101'] && byId['101'].title === 'Quarterly Budget', 'Created row 101 persisted');
	});

	await check('Delete: ln-confirm first click only arms, timeout reverts without DELETE', async () => {
		const sel = '#wwf-table tbody tr[data-ln-table-row-id="2"] button[data-ln-table-row-action="delete"]';
		await page.evaluate(s => document.querySelector(s).click(), sel);
		const state = await page.$eval(sel, b => b.getAttribute('data-ln-confirm-state'));
		assert(state === 'confirming', 'First click puts the button in data-ln-confirm-state="confirming"');
		assert((await reqs()).length === 0, 'No DELETE sent by the first click');
		assert((await rows()).length === 3, 'Row still present');
		await page.waitForFunction(s => !document.querySelector(s).hasAttribute('data-ln-confirm-state'), { timeout: 8000 }, sel);
		assert(true, 'Confirm state reverts after the default 3s timeout');
		assert((await reqs()).length === 0 && (await rows()).length === 3, 'Still no request, still 3 rows');
	});

	await check('Delete: second click removes the row optimistically and sends DELETE', async () => {
		const sel = '#wwf-table tbody tr[data-ln-table-row-id="2"] button[data-ln-table-row-action="delete"]';
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming', { timeout: 3000 }, sel);
		await page.evaluate(s => document.querySelector(s).click(), sel);
		await waitRows(r => r.length === 2 && !r.some(x => x.id === '2'));
		assert(true, 'Row 2 removed from the table');
		await page.waitForFunction(() => window.__reqs.some(r => r.method === 'DELETE'), { timeout: 5000 });
		const sent = (await reqs()).filter(r => r.method === 'DELETE');
		assert(sent.length === 1 && sent[0].url === '/documents/2', 'Exactly one DELETE /documents/2');
		await page.waitForFunction(key => {
			const r = JSON.parse(localStorage.getItem(key) || '[]');
			return !r.some(x => x.id === 2);
		}, { timeout: 5000 }, MOCK_KEY);
		assert(true, 'Mock backend no longer contains record 2');
		await page.waitForFunction(() => document.querySelector('#wwf-table [data-ln-table-total]').textContent.trim() === '2', { timeout: 5000 });
		assert(await total() === '2', 'Footer total is 2');
	});

	await check('Delete all rows shows the empty-state template', async () => {
		for (const id of ['1', '101']) {
			const sel = '#wwf-table tbody tr[data-ln-table-row-id="' + id + '"] button[data-ln-table-row-action="delete"]';
			await page.evaluate(s => document.querySelector(s).click(), sel);
			await page.waitForFunction(s => document.querySelector(s).getAttribute('data-ln-confirm-state') === 'confirming', { timeout: 3000 }, sel);
			await page.evaluate(s => document.querySelector(s).click(), sel);
			await page.waitForFunction(i => !document.querySelector('#wwf-table tbody tr[data-ln-table-row-id="' + i + '"]'), { timeout: 5000 }, id);
		}
		await page.waitForFunction(() => document.querySelector('#wwf-table .ln-table__empty-state'), { timeout: 5000 });
		const text = await page.$eval('#wwf-table .ln-table__empty-state h3', el => el.textContent.trim());
		assert(text === 'No documents yet', 'Empty state "No documents yet" rendered');
		assert((await rows()).length === 0, 'No data rows');
		await page.waitForFunction(() => document.querySelector('#wwf-table [data-ln-table-total]').textContent.trim() === '0', { timeout: 5000 });
		assert(await total() === '0', 'Footer total is 0');
	});

	await check('Server error on update is reported as ln-data-coordinator:error (connector-error)', async () => {
		await load(2, true);
		// Remove record 1 from the mock only, so PUT /documents/1 gets the mock's own 404.
		// The mock only writes localStorage on mutations, so on a fresh page it is still absent: start from its seed.
		await page.evaluate((key, seed) => {
			const r = JSON.parse(localStorage.getItem(key)) || seed;
			localStorage.setItem(key, JSON.stringify(r.filter(x => x.id !== 1)));
		}, MOCK_KEY, SEED);
		await clickEdit(1);
		await waitModal(true);
		await setTitle('Will Fail');
		await clickSave();
		await page.waitForFunction(() => window.__errs.length > 0, { timeout: 8000 });
		const e = await errs();
		assert(e[0].operation === 'connector-error', 'Coordinator reports operation "connector-error" for the 404');
		const sent = (await reqs()).filter(r => r.method === 'PUT');
		assert(sent.length === 1 && sent[0].url === '/documents/1', 'The PUT /documents/1 was sent');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
