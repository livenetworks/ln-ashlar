import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/autosave.html (live demo, #demo-autosave)
// and components/ln-autosave/src/ln-autosave.js (+ autosave-model.js, ln-core/form.js).
// The debounced-input feature (data-ln-autosave-debounce-input) is only documented on the
// page, not mounted on a live form, so it is not exercised here.

const PAGE_URL = BASE_URL + 'autosave.html';
const FORM = '#demo-autosave';
const KEY_PREFIX = 'ln-autosave:';
const KEY_SUFFIX = ':demo-autosave';

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

run('demo/admin/autosave.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction(() => {
			const form = document.getElementById('demo-autosave');
			return !!(form && form.lnAutosave);
		}, { timeout: 10000 });
	}

	// Fresh page, empty localStorage, instance mounted.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
		await recordEvents();
	}

	// Reload keeping localStorage (the "close and reopen" scenario).
	async function reopen() {
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Records every ln-autosave:* event into window.__events as { name, data }.
	const recordEvents = () => page.evaluate(() => {
		window.__events = [];
		['saved', 'restored', 'cleared', 'before-restore'].forEach(n => {
			document.addEventListener('ln-autosave:' + n, e => {
				window.__events.push({ name: n, hasTarget: e.detail && e.detail.target === document.getElementById('demo-autosave'), data: e.detail ? e.detail.data : undefined });
			});
		});
	});

	const eventCount = name => page.evaluate(n => window.__events.filter(e => e.name === n).length, name);

	const key = () => page.evaluate(() => document.getElementById('demo-autosave').lnAutosave.key);

	const stored = () => page.evaluate(() => {
		const raw = localStorage.getItem(document.getElementById('demo-autosave').lnAutosave.key);
		return raw === null ? null : JSON.parse(raw);
	});

	const hasDraftKeys = () => page.evaluate(() => Object.keys(localStorage).filter(k => k.indexOf('ln-autosave:') === 0).length);

	// Reads the live field values of the demo form.
	const formValues = () => page.evaluate(() => {
		const f = document.getElementById('demo-autosave');
		return {
			name: f.elements.name.value,
			email: f.elements.email.value,
			phone: f.elements.phone.value,
			password: f.elements.password.value,
			otp: f.elements.otp.value,
			country: f.elements.country.value,
			message: f.elements.message.value,
			role: (f.querySelector('input[name="role"]:checked') || {}).value || null,
			features: Array.from(f.querySelectorAll('input[name="features[]"]:checked')).map(c => c.value)
		};
	});

	const blurActive = () => page.evaluate(() => document.activeElement && document.activeElement.blur());

	const clickEl = selector => page.evaluate(s => document.querySelector(s).click(), selector);

	// Fills every field of the form like a user; the last interaction is a change event.
	async function fillAll() {
		await page.type('#as-name', 'Test User');
		await page.type('#as-email', 'test@example.com');
		await page.type('#as-phone', '5550100');
		await page.type('#as-password', 'secret-pw');
		await page.type('#as-otp', '123456');
		await page.type('#as-message', 'Draft message');
		await page.select('#as-country', 'de');
		await clickEl(FORM + ' input[name="role"][value="editor"]');
		await clickEl(FORM + ' input[name="features[]"][value="api"]');
		await clickEl(FORM + ' input[name="features[]"][value="audit"]');
	}

	const FILLED = {
		name: 'Test User',
		email: 'test@example.com',
		phone: '5550100',
		country: 'de',
		message: 'Draft message',
		role: 'editor',
		features: ['api', 'audit']
	};

	// ─── Mount + key ───────────────────────────────────────────

	section('Mount and storage key');
	await load();
	{
		const k = await key();
		const path = await page.evaluate(() => location.pathname);
		assert(k === KEY_PREFIX + path + KEY_SUFFIX, `Key is ln-autosave:{pathname}:{form id} (got "${k}")`);
		const same_dom = await page.evaluate(() => document.getElementById('demo-autosave').lnAutosave.dom === document.getElementById('demo-autosave'));
		assert(same_dom, 'lnAutosave.dom is the form element');
		assert(await hasDraftKeys() === 0, 'No draft stored on a clean load');
	}

	// ─── Save on focusout / change ─────────────────────────────

	section('Typing alone does not save; focusout does');
	await page.type('#as-name', 'Test User');
	assert(await stored() === null, 'Input events alone do not write a draft (no debounce attribute on this form)');
	assert(await eventCount('saved') === 0, 'No saved event while typing');
	await blurActive();
	{
		const d = await stored();
		assert(d !== null && d.name === 'Test User', 'Focusout on a named field saves the draft');
		assert(await eventCount('saved') >= 1, 'ln-autosave:saved fired (change and focusout both save)');
		const ev = await page.evaluate(() => window.__events.find(e => e.name === 'saved'));
		assert(ev.hasTarget === true, 'saved detail.target is the form');
		assert(ev.data && ev.data.name === 'Test User', 'saved detail.data carries the serialized form');
	}

	section('Exclusions: password and data-ln-autosave-exclude');
	const savedBaseline = await eventCount('saved');
	await page.type('#as-password', 'secret-pw');
	await blurActive();
	assert(await eventCount('saved') === savedBaseline, 'Focusout/change on the password field does not trigger a save');
	await page.type('#as-otp', '123456');
	await blurActive();
	assert(await eventCount('saved') === savedBaseline, 'Focusout/change on the data-ln-autosave-exclude field does not trigger a save');

	section('Full serialization (text, select, textarea, radio, checkboxes)');
	await page.type('#as-email', 'test@example.com');
	await page.type('#as-phone', '5550100');
	await page.type('#as-message', 'Draft message');
	await page.select('#as-country', 'de');
	await clickEl(FORM + ' input[name="role"][value="editor"]');
	await clickEl(FORM + ' input[name="features[]"][value="api"]');
	await clickEl(FORM + ' input[name="features[]"][value="audit"]');
	{
		const d = await stored();
		assert(d.name === FILLED.name, 'Draft has name');
		assert(d.email === FILLED.email, 'Draft has email');
		assert(d.phone === FILLED.phone, 'Draft has phone');
		assert(d.country === FILLED.country, 'Draft has select value');
		assert(d.message === FILLED.message, 'Draft has textarea value');
		assert(d.role === FILLED.role, 'Draft has the checked radio value');
		assert(same(d['features[]'], FILLED.features), 'Draft has checked checkbox values as an array');
		assert(!('password' in d), 'Password is never stored');
		assert(!('otp' in d), 'data-ln-autosave-exclude field is never stored');
		const raw = await page.evaluate(() => localStorage.getItem(document.getElementById('demo-autosave').lnAutosave.key));
		assert(raw.indexOf('secret-pw') === -1 && raw.indexOf('123456') === -1, 'Excluded values do not appear anywhere in the stored JSON');
	}

	// ─── Restore on reopen ─────────────────────────────────────

	section('Restore after reload');
	await reopen();
	{
		const v = await formValues();
		assert(v.name === FILLED.name && v.email === FILLED.email && v.phone === FILLED.phone, 'Text fields restored');
		assert(v.country === FILLED.country, 'Select restored');
		assert(v.message === FILLED.message, 'Textarea restored');
		assert(v.role === FILLED.role, 'Radio restored');
		assert(same(v.features, FILLED.features), 'Checkboxes restored');
		assert(v.password === '', 'Password is not restored');
		assert(v.otp === '', 'Excluded field is not restored');
	}

	section('Restore events (before-restore cancelable, restored)');
	{
		// Re-mount the instance to replay the restore with listeners attached.
		const result = await page.evaluate(() => {
			const form = document.getElementById('demo-autosave');
			const log = [];
			const onBefore = e => log.push({ name: 'before', cancelable: e.cancelable, data: e.detail.data, target: e.detail.target === form });
			const onRestored = e => log.push({ name: 'restored', data: e.detail.data, target: e.detail.target === form });
			document.addEventListener('ln-autosave:before-restore', onBefore);
			document.addEventListener('ln-autosave:restored', onRestored);
			form.lnAutosave.destroy();
			const destroyed = form.lnAutosave === undefined;
			window.lnAutosave(form.parentElement);
			document.removeEventListener('ln-autosave:before-restore', onBefore);
			document.removeEventListener('ln-autosave:restored', onRestored);
			return { destroyed, remounted: !!form.lnAutosave, log };
		});
		assert(result.destroyed, 'destroy() removes the lnAutosave back-reference');
		assert(result.remounted, 'window.lnAutosave(container) re-mounts the instance');
		assert(result.log.length === 2 && result.log[0].name === 'before' && result.log[1].name === 'restored', 'before-restore then restored fire in order');
		assert(result.log[0].cancelable === true, 'before-restore is cancelable');
		assert(result.log[0].target && result.log[1].target, 'Both events carry detail.target = form');
		assert(result.log[0].data.name === FILLED.name && result.log[1].data.name === FILLED.name, 'Both events carry the parsed draft in detail.data');
	}

	section('Synthetic input + change dispatched on restored fields');
	{
		const result = await page.evaluate(() => {
			const form = document.getElementById('demo-autosave');
			const seen = { input: 0, change: 0 };
			const onInput = () => seen.input++;
			const onChange = () => seen.change++;
			form.addEventListener('input', onInput);
			form.addEventListener('change', onChange);
			form.lnAutosave.destroy();
			window.lnAutosave(form.parentElement);
			form.removeEventListener('input', onInput);
			form.removeEventListener('change', onChange);
			return seen;
		});
		assert(result.input > 0 && result.change > 0, `Restore dispatches input (${result.input}) and change (${result.change}) on filled fields`);
	}

	section('Cancelled before-restore skips applying the draft');
	{
		const result = await page.evaluate(() => {
			const form = document.getElementById('demo-autosave');
			form.reset();
			// reset cleared the draft; write it back so there is something to restore.
			localStorage.setItem(form.lnAutosave.key, JSON.stringify({ name: 'Should Not Apply' }));
			let restored = 0;
			const onBefore = e => e.preventDefault();
			const onRestored = () => restored++;
			document.addEventListener('ln-autosave:before-restore', onBefore);
			document.addEventListener('ln-autosave:restored', onRestored);
			form.lnAutosave.destroy();
			window.lnAutosave(form.parentElement);
			document.removeEventListener('ln-autosave:before-restore', onBefore);
			document.removeEventListener('ln-autosave:restored', onRestored);
			return { restored, name: form.elements.name.value };
		});
		assert(result.name === '', 'preventDefault() on before-restore leaves field values untouched');
		assert(result.restored === 0, 'restored does not fire after a cancelled before-restore');
	}

	// ─── Cancel (clear draft) button ───────────────────────────

	section('data-ln-autosave-clear removes the draft but keeps values');
	await load();
	await fillAll();
	await blurActive();
	assert(await stored() !== null, 'Draft exists before clearing');
	await clickEl(FORM + ' button[data-ln-autosave-clear]');
	{
		assert(await stored() === null, 'Clear button removes the localStorage entry');
		assert(await eventCount('cleared') === 1, 'ln-autosave:cleared fired once');
		const v = await formValues();
		assert(v.name === FILLED.name && v.message === FILLED.message && v.role === FILLED.role, 'Clear button does NOT reset field values');
	}

	section('Cleared is idempotent');
	await clickEl(FORM + ' button[data-ln-autosave-clear]');
	assert(await eventCount('cleared') === 2, 'cleared fires again even with nothing stored');

	// ─── Reset ─────────────────────────────────────────────────

	section('Reset clears the draft and the fields');
	await load();
	await fillAll();
	assert(await stored() !== null, 'Draft exists before reset');
	await clickEl(FORM + ' button[type="reset"]');
	{
		assert(await stored() === null, 'Reset removes the draft');
		assert(await eventCount('cleared') >= 1, 'cleared fired on reset');
		const v = await formValues();
		assert(v.name === '' && v.email === '' && v.message === '' && v.country === '' && v.role === null && v.features.length === 0, 'Native reset empties the fields');
	}

	// ─── Submit ────────────────────────────────────────────────

	section('Submit clears the draft');
	await load();
	await fillAll();
	assert(await stored() !== null, 'Draft exists before submit');
	await clickEl(FORM + ' button[type="submit"]');
	{
		await page.waitForFunction(() => window.__events.some(e => e.name === 'cleared'), { timeout: 5000 });
		assert(await stored() === null, 'Submit removes the draft');
		assert(await hasDraftKeys() === 0, 'No ln-autosave key remains in localStorage');
		const txt = await page.evaluate(() => document.getElementById('autosave-log').textContent);
		assert(txt.indexOf('ln-autosave:cleared') !== -1, 'Page event log (#autosave-log) records the cleared event');
	}

	section('Page event log mirrors events');
	await load();
	await page.type('#as-name', 'Log Check');
	await blurActive();
	{
		const txt = await page.evaluate(() => document.getElementById('autosave-log').textContent);
		assert(txt.indexOf('ln-autosave:saved') !== -1, '#autosave-log shows ln-autosave:saved after a save');
	}
});
