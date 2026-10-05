import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/coordinator.html, the mock backend
// demo/admin/src/mock-related.js (seed: 3 documents) and the components the page mounts
// (ln-data-coordinator, ln-data-store, ln-api-connector, ln-table, ln-sort, ln-filter,
// ln-search, ln-popover, ln-modal, ln-form, ln-fill, ln-confirm).

const PAGE_URL = BASE_URL + 'coordinator.html';

const ISO = 'ISO 27001 Security Manual';
const Q1 = 'Q1 Financial Balance Sheet';
const EMP = 'Employment Agreement Template';
// Server (seed) order: doc_id 1, 2, 3.
const SEED_ORDER = [ISO, Q1, EMP];
// Seed server_timestamp: ISO 10:00, Q1 11:15, EMP 12:00.
const TITLE_ASC = [EMP, ISO, Q1];
const UPDATED_DESC = [EMP, Q1, ISO];

const SEARCH_INPUT = 'input[data-ln-search-for="demo-docs"]';
const ROW = '#demo-table tbody tr[data-ln-table-row]';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const reversed = list => list.slice().reverse();

run('demo/admin/coordinator.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	const titles = () => page.evaluate(sel => Array.from(document.querySelectorAll(sel))
		.map(tr => tr.cells[0].textContent.trim()), ROW);

	const rowCells = () => page.evaluate(sel => Array.from(document.querySelectorAll(sel))
		.map(tr => [0, 1, 2, 4].map(i => tr.cells[i].textContent.trim())), ROW);

	const counts = () => page.evaluate(() => ({
		total: document.querySelector('[data-ln-table-total]').textContent.trim(),
		filtered: document.querySelector('[data-ln-table-filtered]').textContent.trim()
	}));

	const backend = () => page.evaluate(() => {
		const raw = localStorage.getItem('ln-demo-documents');
		return raw ? JSON.parse(raw) : null;
	});

	const telemetry = () => page.evaluate(() => document.getElementById('telemetry-log').textContent);

	async function waitTitles(expected) {
		await page.waitForFunction((sel, exp) => {
			const t = Array.from(document.querySelectorAll(sel)).map(tr => tr.cells[0].textContent.trim());
			return t.length === exp.length && t.every((v, i) => v === exp[i]);
		}, { timeout: 8000 }, ROW, expected).catch(() => {});
	}

	async function expectTitles(expected, label) {
		await waitTitles(expected);
		const actual = await titles();
		assert(same(actual, expected), `${label}: expected [${expected.join(' | ')}], got [${actual.join(' | ')}]`);
	}

	async function waitTelemetry(text) {
		await page.waitForFunction(t => document.getElementById('telemetry-log').textContent.includes(t),
			{ timeout: 8000 }, text).catch(() => {});
	}

	async function expectTelemetry(text, label) {
		await waitTelemetry(text);
		assert((await telemetry()).includes(text), `telemetry: ${label}`);
	}

	// Fresh state: ln-demo-documents (mock backend) and the IndexedDB cache both wiped.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(async () => {
			localStorage.clear();
			const dbs = await indexedDB.databases();
			await Promise.all(dbs.map(d => new Promise(resolve => {
				const req = indexedDB.deleteDatabase(d.name);
				req.onsuccess = req.onerror = req.onblocked = () => resolve();
			})));
		});
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const co = document.getElementById('demo-coordinator');
			const store = document.getElementById('demo-docs');
			return !!(co && co.lnDataCoordinator && store && store.lnDataStore);
		}, { timeout: 10000 });
		const mapped = await page.evaluate(() => {
			const m = document.getElementById('demo-coordinator').lnDataCoordinator.mapper;
			return m.ingress({ doc_id: 7, title: 'x' }).id;
		});
		assert(mapped === 7, 'coordinator resolved the "demo-docs" mapper (ingress maps doc_id to id)');
		await waitTitles(SEED_ORDER);
		assert(same(await titles(), SEED_ORDER), 'the 3 seeded server documents are cached and rendered in the table');
	}

	// Skips the 600 ms artificial latency (the default-on state is asserted separately).
	const disableLatency = () => page.evaluate(() => {
		const cb = document.getElementById('sim-latency');
		if (cb.checked) cb.click();
	});

	const clickSort = (field, dir) => page.evaluate((f, d) => document
		.querySelector('ul[data-ln-sort][data-ln-sort-field="' + f + '"] button[data-ln-sort-dir="' + d + '"]').click(), field, dir);

	const clickFilter = (key, value) => page.evaluate((k, v) => {
		const sel = v === null
			? 'input[data-ln-filter-key="' + k + '"][data-ln-filter-reset]'
			: 'input[data-ln-filter-key="' + k + '"][data-ln-filter-value="' + v + '"]';
		document.querySelector('ul[data-ln-filter="demo-docs"] ' + sel).click();
	}, key, value);

	const checkedValues = key => page.evaluate(k => Array.from(document.querySelectorAll(
		'ul[data-ln-filter="demo-docs"] input[data-ln-filter-key="' + k + '"]:checked'))
		.map(i => i.hasAttribute('data-ln-filter-reset') ? '*' : i.getAttribute('data-ln-filter-value')), key);

	const openNewModal = () => page.evaluate(() => document.getElementById('open-modal-btn').click());

	const rowButton = (id, action) => 'tr[data-ln-table-row-id="' + id + '"] button[data-ln-table-row-action="' + action + '"]';

	const modalState = () => page.evaluate(() => {
		const m = document.getElementById('doc-modal');
		const whenDisplay = {};
		m.querySelectorAll('[data-ln-modal-when]').forEach(s => { whenDisplay[s.getAttribute('data-ln-modal-when')] = getComputedStyle(s).display; });
		return { attr: m.getAttribute('data-ln-modal'), open: m.open, mode: m.getAttribute('data-ln-modal-mode'), whenDisplay };
	});

	async function waitModalClosed() {
		await page.waitForFunction(() => {
			const m = document.getElementById('doc-modal');
			return m.getAttribute('data-ln-modal') === 'close' && !m.open;
		}, { timeout: 8000 }).catch(() => {});
	}

	async function submitForm(fields) {
		for (const [name, value] of Object.entries(fields)) {
			await page.$eval('#doc-form [name="' + name + '"]', (el, v) => { el.value = v; }, value);
		}
		await page.click('#doc-form button[type="submit"]');
	}

	// ═══ 0. Initial state ═════════════════════════════════════

	section('Initial sync: store cache, table, footer, controls, telemetry');
	await load();
	const first = await rowCells();
	assert(same(first[0], [ISO, 'IT', 'Approved', 'Dalibor Sojic']), 'row 1: ISO 27001 Security Manual / IT / Approved / author');
	assert(same(first[1], [Q1, 'Finance', 'Pending', 'Dalibor Sojic']), 'row 2: Q1 Financial Balance Sheet / Finance / Pending / author');
	assert(same(first[2], [EMP, 'HR', 'Approved', 'HR Manager']), 'row 3: Employment Agreement Template / HR / Approved / HR Manager');
	assert((await counts()).total === '3', 'footer data-ln-table-total shows 3 items in cache');
	const cached = await page.evaluate(() => document.getElementById('demo-docs').lnDataStore.getAll({}).then(r => r.data.map(x => x.id).sort()));
	assert(same(cached, [1, 2, 3]), 'IndexedDB store holds records keyed by mapped id 1, 2, 3');
	assert(await page.evaluate(() => document.getElementById('sim-latency').checked && !document.getElementById('sim-failure').checked),
		'sandbox defaults: latency checked, failure unchecked');
	const t0 = await telemetry();
	assert(t0.includes('Interactive Coordinator Sandbox initialized'), 'telemetry shows the sandbox init line');
	assert(t0.includes('ln-data-store:request-remote-sync bubbled UP to Parent Coordinator'), 'telemetry: store request-remote-sync bubbled to the coordinator');
	assert(t0.includes('GET /api/documents -> Query (matched 3 of 3 records)'), 'telemetry: connector GET returned 3 of 3 records');
	assert(t0.includes('ln-api-connector:fetched bubbled UP to Parent Coordinator'), 'telemetry: connector fetched event reached the coordinator');

	// ═══ 1. Sort ══════════════════════════════════════════════

	section('Sort (ln-sort -> store query)');
	await load();
	await disableLatency();
	await clickSort('title', 'asc');
	await expectTitles(TITLE_ASC, 'title asc');
	assert(await page.evaluate(() => document.querySelector('ul[data-ln-sort-field="title"]').getAttribute('data-ln-sort-state')) === 'asc',
		'title sort list data-ln-sort-state="asc"');
	await clickSort('title', 'desc');
	await expectTitles(reversed(TITLE_ASC), 'title desc');
	await clickSort('updated_at', 'desc');
	await expectTitles(UPDATED_DESC, 'updated_at desc (newest first)');
	await clickSort('updated_at', 'asc');
	await expectTitles(SEED_ORDER, 'updated_at asc (oldest first)');
	await clickSort('department', 'asc');
	await expectTitles([Q1, EMP, ISO], 'department asc: Finance, HR, IT');
	await clickSort('department', 'none');
	await expectTitles(SEED_ORDER, 'sort none restores the cache order');

	// ═══ 2. Search ════════════════════════════════════════════

	section('Search (title/department/owner fields) and clear');
	await load();
	await disableLatency();
	await page.focus(SEARCH_INPUT);
	await page.keyboard.type('financ');
	await expectTitles([Q1], 'search "financ"');
	let c = await counts();
	assert(c.filtered === '1' && c.total === '3', 'footer shows 1 filtered of 3 total');
	await page.evaluate(() => document.querySelector('#demo-table button[data-ln-search-clear]').click());
	await expectTitles(SEED_ORDER, 'clear button restores every row');

	section('Search with no match shows the filtered empty state; Clear Filters recovers');
	await page.focus(SEARCH_INPUT);
	await page.keyboard.type('zzzz');
	await page.waitForFunction(() => document.querySelector('#demo-table tbody').textContent.includes('No matching records'), { timeout: 8000 }).catch(() => {});
	assert(await page.evaluate(() => document.querySelector('#demo-table tbody').textContent.includes('No matching records')),
		'empty-filtered template "No matching records" is rendered');
	assert((await titles()).length === 0, 'no data rows are rendered');
	assert((await counts()).filtered === '0', 'footer filtered count is 0');
	await page.evaluate(() => document.querySelector('#demo-table button[data-ln-table-clear-all]').click());
	await expectTitles(SEED_ORDER, 'Clear Filters (data-ln-table-clear-all) restores every row');

	// ═══ 3. Filter ════════════════════════════════════════════

	section('Column filters (ln-filter -> store query)');
	await load();
	await disableLatency();
	assert(same(await checkedValues('department'), ['*']) && same(await checkedValues('status'), ['*']), 'both filters start on "All"');
	await clickFilter('department', 'IT');
	await expectTitles([ISO], 'department IT');
	assert(same(await checkedValues('department'), ['IT']), '"All" unchecked, only IT checked');
	await clickFilter('department', 'HR');
	await expectTitles([ISO, EMP], 'department IT OR HR');
	await clickFilter('department', null);
	await expectTitles(SEED_ORDER, 'department "All" restores every row');
	await clickFilter('status', 'Approved');
	await expectTitles([ISO, EMP], 'status Approved');
	await clickFilter('status', 'Approved');
	await clickFilter('status', 'Pending');
	await expectTitles([Q1], 'status Pending');
	await clickFilter('status', null);
	await clickFilter('department', 'IT');
	await clickFilter('status', 'Pending');
	await page.waitForFunction(sel => document.querySelectorAll(sel).length === 0, { timeout: 8000 }, ROW).catch(() => {});
	assert((await titles()).length === 0, 'department IT AND status Pending matches nothing (filters AND across columns)');

	section('Department popover: open, filter its options, close with Escape');
	await load();
	await page.evaluate(() => document.querySelector('button[data-ln-popover-for="filter-demo-table-dept"]').click());
	await page.waitForFunction(() => document.getElementById('filter-demo-table-dept').getAttribute('data-ln-popover') === 'open', { timeout: 5000 });
	const opened = await page.evaluate(() => ({
		topLayer: document.getElementById('filter-demo-table-dept').matches(':popover-open'),
		expanded: document.querySelector('button[data-ln-popover-for="filter-demo-table-dept"]').getAttribute('aria-expanded')
	}));
	assert(opened.topLayer && opened.expanded === 'true', 'popover is :popover-open and trigger aria-expanded="true"');
	await page.focus('input[data-ln-search-for="filter-demo-table-dept-list"]');
	await page.keyboard.type('fin');
	await page.waitForFunction(() => {
		const li = document.querySelector('#filter-demo-table-dept-list input[data-ln-filter-value="HR"]').closest('label');
		return getComputedStyle(li).display === 'none';
	}, { timeout: 5000 }).catch(() => {});
	const optionVisibility = await page.evaluate(() => Object.fromEntries(Array.from(
		document.querySelectorAll('#filter-demo-table-dept-list input[data-ln-filter-value]'))
		.map(i => [i.getAttribute('data-ln-filter-value'), getComputedStyle(i.closest('label')).display !== 'none'])));
	assert(optionVisibility.Finance === true && optionVisibility.HR === false && optionVisibility.Engineering === false,
		'typing "fin" keeps Finance and hides the other department options');
	await page.keyboard.press('Escape');
	await page.waitForFunction(() => document.querySelector('button[data-ln-popover-for="filter-demo-table-dept"]')
		.getAttribute('aria-expanded') === 'false', { timeout: 5000 }).catch(() => {});
	assert(await page.evaluate(() => !document.getElementById('filter-demo-table-dept').matches(':popover-open')),
		'Escape closes the popover');

	// ═══ 4. Create ════════════════════════════════════════════

	section('Create: modal in "new" mode, form -> coordinator -> connector POST -> store');
	await load();
	await disableLatency();
	await openNewModal();
	await page.waitForFunction(() => document.getElementById('doc-modal').open, { timeout: 5000 });
	let m = await modalState();
	assert(m.attr === 'open' && m.open && m.mode === 'new', 'New Document opens the dialog in mode "new"');
	assert(m.whenDisplay.new !== 'none' && m.whenDisplay.edit === 'none', 'title shows "New Document", hides "Edit Document"');
	await submitForm({ title: 'Headless Test Doc', department: 'Legal', status: 'Pending', author_name: 'Test Author' });
	await expectTitles([...SEED_ORDER, 'Headless Test Doc'], 'new document appears in the table');
	await waitModalClosed();
	m = await modalState();
	assert(m.attr === 'close' && !m.open, 'modal closes after the store reports created');
	const created = (await rowCells())[3];
	assert(same(created, ['Headless Test Doc', 'Legal', 'Pending', 'Test Author']), 'new row carries the submitted department, status and author');
	assert((await counts()).total === '4', 'footer total is 4');
	const saved = await backend();
	assert(saved && saved.length === 4 && saved[3].doc_id === 4 && saved[3].title === 'Headless Test Doc' && saved[3].author.name === 'Test Author',
		'mock server persisted doc_id 4 with the egress shape (nested author.name)');
	await expectTelemetry('POST /api/documents -> Created doc_id #4', 'POST created doc_id #4');
	const t1 = await telemetry();
	assert(t1.includes('ingress() mapped Raw Server JSON -> Normalized Flat Local Cache Record'), 'telemetry: ingress mapper action logged');

	// ═══ 5. Edit ══════════════════════════════════════════════

	section('Edit: row action fills the form in "edit" mode, PUT through the connector');
	await load();
	await disableLatency();
	await page.evaluate(sel => document.querySelector(sel).click(), rowButton(1, 'edit'));
	await page.waitForFunction(() => document.getElementById('doc-modal').open, { timeout: 5000 });
	m = await modalState();
	assert(m.mode === 'edit' && m.whenDisplay.edit !== 'none' && m.whenDisplay.new === 'none', 'edit button opens the dialog in mode "edit" with the Edit title');
	const filled = await page.evaluate(() => Object.fromEntries(new FormData(document.getElementById('doc-form'))));
	assert(filled.id === '1' && filled.title === ISO && filled.department === 'IT' && filled.status === 'Approved' && filled.author_name === 'Dalibor Sojic',
		'form is pre-filled from the row (id, title, department, status, author)');
	await submitForm({ title: 'ISO Renamed' });
	await expectTitles(['ISO Renamed', Q1, EMP], 'row title updated in place');
	await waitModalClosed();
	assert((await modalState()).attr === 'close', 'modal closes after the store reports updated');
	const edited = await backend();
	assert(edited && edited.find(r => r.doc_id === 1).title === 'ISO Renamed' && edited.length === 3, 'mock server updated doc_id 1 (PUT), still 3 documents');
	await expectTelemetry('PUT /api/documents/1 -> Confirmed update', 'PUT confirmed');

	// ═══ 6. Delete ════════════════════════════════════════════

	section('Delete: two-click ln-confirm, coordinator request-delete, DELETE through the connector');
	await load();
	await disableLatency();
	await page.evaluate(sel => document.querySelector(sel).click(), rowButton(2, 'delete'));
	await page.waitForFunction(sel => document.querySelector(sel).getAttribute('data-ln-confirm-state') === 'confirming', { timeout: 5000 }, rowButton(2, 'delete')).catch(() => {});
	assert(await page.evaluate(sel => document.querySelector(sel).getAttribute('data-ln-confirm-state'), rowButton(2, 'delete')) === 'confirming',
		'first click arms the button (data-ln-confirm-state="confirming")');
	assert(same(await titles(), SEED_ORDER), 'nothing is deleted after the first click');
	await page.evaluate(sel => document.querySelector(sel).click(), rowButton(2, 'delete'));
	await expectTitles([ISO, EMP], 'second click removes the document');
	assert((await counts()).total === '2', 'footer total is 2');
	const afterDelete = await backend();
	assert(afterDelete && same(afterDelete.map(r => r.doc_id), [1, 3]), 'mock server no longer holds doc_id 2');
	await expectTelemetry('DELETE /api/documents/2 -> Confirmed deletion', 'DELETE confirmed');
	await expectTelemetry('ln-data-store:deleted was captured by UI Presenter', 'store deleted event captured');

	// ═══ 7. Telemetry clear ═══════════════════════════════════

	section('Clear Telemetry');
	await load();
	assert((await telemetry()).length > 0, 'telemetry log has entries');
	await page.evaluate(() => document.getElementById('clear-telemetry').click());
	assert((await telemetry()) === '', 'Clear Telemetry empties the log');

	// ═══ 8. Wipe & re-seed ════════════════════════════════════

	section('Wipe Cache & Re-seed Server Data');
	await load();
	await disableLatency();
	await openNewModal();
	await page.waitForFunction(() => document.getElementById('doc-modal').open, { timeout: 5000 });
	await submitForm({ title: 'Doc To Wipe', department: 'HR', status: 'Draft', author_name: 'Test Author' });
	await expectTitles([...SEED_ORDER, 'Doc To Wipe'], 'extra document created');
	await waitModalClosed();
	await Promise.all([
		page.waitForNavigation({ waitUntil: 'load', timeout: 10000 }),
		page.evaluate(() => document.getElementById('reset-db').click())
	]);
	await waitTitles(SEED_ORDER);
	assert(same(await titles(), SEED_ORDER), 'after wipe + reload only the 3 seed documents are cached and rendered');

	// ═══ 9. Simulated write failure ═══════════════════════════

	section('Simulated write failure ("Fail ~15% of write requests (revert mutations)")');
	await load();
	await disableLatency();
	await page.evaluate(() => {
		document.getElementById('sim-failure').click();
		Math.random = () => 0;
	});
	await page.evaluate(sel => document.querySelector(sel).click(), rowButton(1, 'edit'));
	await page.waitForFunction(() => document.getElementById('doc-modal').open, { timeout: 5000 });
	await submitForm({ title: 'SHOULD REVERT' });
	await expectTelemetry('PUT /api/documents/1 -> Simulated 500 Server Error', 'server returned the simulated 500');
	await expectTelemetry('ln-api-connector:error bubbled UP to Parent Coordinator', 'connector error reached the coordinator');
	const failed = await backend();
	assert(!failed || failed.find(r => r.doc_id === 1).title === ISO, 'mock server record is unchanged after the failed PUT');
	await expectTitles(SEED_ORDER, 'failed mutation is reverted in the table (original title restored)');
});
