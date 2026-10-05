import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/kbd.html and
// components/ln-key/src/{ln-key,key-model}.js (global keydown listener, shortcut
// normalisation, ln-key:trigger event detail, duplicate-shortcut warning, editable guard).

const PAGE_URL = BASE_URL + 'kbd.html';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/kbd.html', async ({ page }) => {

	const warnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warn') warnings.push(msg.text());
	});

	const failures = [];

	// Runs one section; a failing section is recorded and the others still run.
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// ─── Page helpers ──────────────────────────────────────────

	async function ready() {
		await page.waitForFunction(() => {
			const direct = document.querySelectorAll('[data-ln-key]');
			const external = document.querySelectorAll('[data-ln-key-for]');
			if (direct.length === 0 || external.length === 0) return false;
			return Array.from(direct).every(el => el.lnKey)
				&& Array.from(external).every(el => el.lnKeyFor);
		}, { timeout: 10000 });
	}

	// Records every ln-key:trigger and every click on the demo's action buttons.
	async function instrument() {
		await page.evaluate(() => {
			window.__triggers = [];
			window.__clicks = [];
			document.addEventListener('ln-key:trigger', e => {
				const d = e.detail;
				window.__triggers.push({
					key: d.key,
					action: d.action,
					source: d.source.id || d.source.tagName.toLowerCase(),
					target: d.target.id || d.target.tagName.toLowerCase()
				});
			});
			document.querySelectorAll('button[id]').forEach(btn => {
				btn.addEventListener('click', () => window.__clicks.push(btn.id));
			});
		});
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await ready();
		await instrument();
		warnings.length = 0;
	}

	const triggers = () => page.evaluate(() => window.__triggers);
	const clicks = () => page.evaluate(() => window.__clicks);
	const activeId = () => page.evaluate(() => document.activeElement && document.activeElement.id);

	// Presses `key` while holding `mods` (e.g. ['Control', 'Shift']).
	async function chord(mods, key) {
		for (const m of mods) await page.keyboard.down(m);
		await page.keyboard.press(key);
		for (const m of mods.slice().reverse()) await page.keyboard.up(m);
	}

	const logRows = () => page.evaluate(() => Array.from(document.querySelectorAll('#key-log-tbody tr'))
		.map(tr => tr.cells.length));

	// ─── Sections ──────────────────────────────────────────────

	await section('Initial state', async () => {
		await load();
		const state = await page.evaluate(() => ({
			status: document.getElementById('key-log-status').textContent,
			rows: document.querySelectorAll('#key-log-tbody tr').length,
			cells: document.querySelector('#key-log-tbody tr').cells.length,
			direct: document.querySelectorAll('[data-ln-key]').length,
			external: document.querySelectorAll('[data-ln-key-for]').length
		}));
		assert(state.status === 'Waiting for keyboard interaction...', 'Status shows waiting text');
		assert(state.rows === 1 && state.cells === 1, 'Log holds only the placeholder row');
		assert(state.direct === 8, 'Eight [data-ln-key] hosts are mounted (4 + 3 + 1 buttons/select)');
		assert(state.external === 3, 'Three [data-ln-key-for] badges are mounted');
	});

	await section('1. Direct action hotkeys', async () => {
		await load();

		await chord(['Control'], 'KeyS');
		assert(same(await clicks(), ['btn-save-draft']), 'Ctrl+S clicks #btn-save-draft');
		let t = await triggers();
		assert(t.length === 1 && t[0].key === 'Ctrl+S' && t[0].action === 'click'
			&& t[0].source === 'btn-save-draft' && t[0].target === 'btn-save-draft',
			'ln-key:trigger detail is {key: Ctrl+S, action: click, source/target: btn-save-draft}');

		await chord(['Meta'], 'KeyS');
		t = await triggers();
		assert(t.length === 2 && t[1].key === 'Meta+S' && t[1].target === 'btn-save-draft',
			'Meta+S (second shortcut in the list) clicks #btn-save-draft');

		await chord(['Alt'], 'KeyP');
		assert((await clicks()).pop() === 'btn-publish-post', 'Alt+P clicks #btn-publish-post');

		await chord(['Alt'], 'KeyN');
		assert((await clicks()).pop() === 'btn-new-item', 'Alt+N clicks #btn-new-item');

		await page.keyboard.press('Escape');
		assert((await clicks()).pop() === 'btn-cancel-action', 'Escape clicks #btn-cancel-action');

		t = await triggers();
		assert(same(t.map(x => x.key), ['Ctrl+S', 'Meta+S', 'Alt+P', 'Alt+N', 'Escape']),
			'Trigger keys are normalised: Ctrl+S, Meta+S, Alt+P, Alt+N, Escape');

		await page.keyboard.press('KeyZ');
		assert((await triggers()).length === 5, 'An undeclared key (Z) triggers nothing');
		await chord(['Control'], 'KeyJ');
		assert((await triggers()).length === 5, 'Ctrl+J (declared only with Ctrl+Shift context) triggers nothing');
	});

	await section('Live event monitor and Clear Log', async () => {
		await load();

		await chord(['Control'], 'KeyS');
		await page.waitForFunction(() => document.querySelectorAll('#key-log-tbody tr').length === 1
			&& document.querySelector('#key-log-tbody tr').cells.length === 5, { timeout: 5000 });
		const first = await page.evaluate(() => ({
			status: document.getElementById('key-log-status').textContent,
			combo: document.querySelector('#key-log-tbody tr').cells[1].textContent.trim(),
			action: document.querySelector('#key-log-tbody tr').cells[2].textContent.trim(),
			target: document.querySelector('#key-log-tbody tr').cells[3].textContent,
			source: document.querySelector('#key-log-tbody tr').cells[4].textContent
		}));
		assert(first.combo === 'Ctrl+S', 'First event replaces the placeholder row with key combo Ctrl+S');
		assert(first.action === 'click()', 'Action column shows click()');
		assert(first.target.includes('<button#btn-save-draft>'), 'Target column names <button#btn-save-draft>');
		assert(first.source.includes('<button#btn-save-draft>'), 'Source column names <button#btn-save-draft>');
		assert(first.status.startsWith('Ctrl+S') && first.status.includes('click()')
			&& first.status.includes('<button#btn-save-draft>'), 'Status bar reports Ctrl+S -> click() on the button');

		await chord(['Alt'], 'KeyP');
		const rows = await page.evaluate(() => ({
			count: document.querySelectorAll('#key-log-tbody tr').length,
			newest: document.querySelector('#key-log-tbody tr').cells[1].textContent.trim()
		}));
		assert(rows.count === 2 && rows.newest === 'Alt+P', 'Second event is prepended (2 rows, newest Alt+P first)');

		await page.click('#btn-clear-log');
		const cleared = await page.evaluate(() => ({
			status: document.getElementById('key-log-status').textContent,
			text: document.querySelector('#key-log-tbody tr').textContent.trim(),
			rows: document.querySelectorAll('#key-log-tbody tr').length
		}));
		assert(cleared.status === 'Waiting for keyboard interaction...', 'Clear Log resets the status text');
		assert(cleared.rows === 1 && cleared.text === 'Log cleared. Press a hotkey to record events.',
			'Clear Log leaves a single "Log cleared" row');

		await chord(['Alt'], 'KeyN');
		assert(same(await logRows(), [5]), 'After clearing, the next event replaces the "Log cleared" row');
	});

	await section('2. Target focus redirection (data-ln-key-target)', async () => {
		await load();

		await chord(['Control'], 'KeyK');
		assert(await activeId() === 'demo-search-input', 'Ctrl+K focuses #demo-search-input');
		let t = await triggers();
		assert(t.length === 1 && t[0].key === 'Ctrl+K' && t[0].action === 'focus' && t[0].target === 'demo-search-input',
			'Trigger detail is {key: Ctrl+K, action: focus, target: demo-search-input}');
		assert(t[0].source === 'button', 'Trigger source is the declaring button (no id)');

		await page.evaluate(() => document.activeElement.blur());
		await chord(['Meta'], 'KeyK');
		assert(await activeId() === 'demo-search-input', 'Meta+K focuses #demo-search-input');

		await page.evaluate(() => document.activeElement.blur());
		warnings.length = 0;
		await chord(['Alt'], 'KeyF');
		assert(await activeId() === 'demo-filter-select', 'Alt+F focuses #demo-filter-select');
		t = await triggers();
		const last = t[t.length - 1];
		assert(last.key === 'Alt+F' && last.action === 'focus' && last.source === 'demo-filter-select',
			'Duplicate Alt+F: first DOM match (the select itself) is the trigger source');
		assert(warnings.some(w => w.includes('[ln-key] Duplicate active shortcut "Alt+F"')),
			'Duplicate Alt+F logs the "first DOM match wins" console warning');
	});

	await section('4. Input protection and allow-input', async () => {
		await load();

		await page.focus('input[type="text"].form-control');
		await chord(['Alt'], 'KeyN');
		await page.keyboard.press('Escape');
		assert((await triggers()).length === 0 && (await clicks()).length === 0,
			'Alt+N and Escape typed inside a plain text input trigger nothing');

		await page.evaluate(() => document.activeElement.blur());
		await chord(['Alt'], 'KeyN');
		assert(same(await clicks(), ['btn-new-item']), 'Same Alt+N outside the input still triggers');

		await page.focus('#demo-comment-box');
		await page.keyboard.type('hello');
		await chord(['Control'], 'Enter');
		let t = await triggers();
		const last = t[t.length - 1];
		assert(last.key === 'Ctrl+Enter' && last.action === 'click' && last.target === 'btn-submit-comment',
			'Ctrl+Enter inside the textarea fires (data-ln-key-allow-input) and clicks #btn-submit-comment');
		assert((await clicks()).pop() === 'btn-submit-comment', 'The submit button received the click');
		await page.waitForFunction(() => document.getElementById('demo-comment-box').value === '', { timeout: 5000 });
		assert(true, 'Page click handler consumed the comment (textarea cleared)');

		await page.focus('#demo-comment-box');
		await chord(['Meta'], 'Enter');
		t = await triggers();
		assert(t[t.length - 1].key === 'Meta+Enter', 'Meta+Enter (second shortcut) also fires inside the textarea');
	});

	await section('3. Declarative shortcut map (data-ln-key-map / data-ln-key-for)', async () => {
		await load();

		// The page states Ctrl+Shift+C / P / J trigger the export buttons.
		const expected = [
			['KeyC', 'btn-export-csv', 'Ctrl+Shift+C'],
			['KeyP', 'btn-export-pdf', 'Ctrl+Shift+P'],
			['KeyJ', 'btn-export-json', 'Ctrl+Shift+J']
		];
		for (const [code, id, combo] of expected) {
			await chord(['Control', 'Shift'], code);
			const got = await clicks();
			assert(got[got.length - 1] === id && got.length > 0, `${combo} clicks #${id}`);
		}
	});

	await section('5. Keycap reference', async () => {
		await load();
		const counts = await page.evaluate(() => ({
			kbd: document.querySelectorAll('kbd').length,
			refRows: document.querySelectorAll('section:last-of-type table tbody tr, table tbody tr').length
		}));
		assert(counts.kbd > 0, 'Page renders <kbd> keycaps');
		assert(counts.refRows >= 4, 'Reference table lists its four shortcut rows');
	});

	if (failures.length) {
		console.error('\nFailing sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
