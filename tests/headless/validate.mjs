import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/validate.html (source demo/admin/src/pages/validate.html).
// Driven by a REAL library component: ln-validate (components/ln-validate/src/ln-validate.js
// + validate-model.js) for every field, ln-toast for the "Check isValid" button.
// The page's own inline script only adds: password-confirmation glue (dispatches the
// ln-validate:set-custom / clear-custom events), three API buttons, and an event log (#validate-log).
// No backend/network involved; nothing is mocked or intercepted.
//
// Facts come from the markup and component source. Where page prose contradicts source
// (prose says validation runs "on blur"; source has no blur listener) the source is asserted
// and labelled [source].
//
// Each feature runs in its own attempt(): a failing section is recorded, the others still run,
// and the file exits 1 at the end if anything failed.

const PAGE_URL = BASE_URL + 'validate.html';

const FIELD_IDS = ['demo-name', 'demo-email', 'demo-dept', 'demo-phone', 'demo-salary', 'demo-pass', 'demo-pass-confirm'];
const ERROR_ITEM_COUNT = 14; // 2 + 4 + 1 + 1 + 2 + 2 + 2 <li data-ln-validate-error> in the live demos

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/validate.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function attempt(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(ids => ids.every(id => {
			const el = document.getElementById(id);
			return el && el.lnValidate;
		}) && document.getElementById('demo-custom-form').hasAttribute('novalidate'),
		{ timeout: 10000 }, FIELD_IDS);
		await page.evaluate(() => {
			window.__events = [];
			const record = e => window.__events.push({
				type: e.type,
				id: e.target.id,
				field: e.detail && e.detail.field,
				errors: e.detail && e.detail.errors
			});
			document.addEventListener('ln-validate:valid', record);
			document.addEventListener('ln-validate:invalid', record);
			// Records whether the ln-validate gate blocked the submit, then stops the navigation.
			window.__submits = [];
			document.addEventListener('submit', e => {
				window.__submits.push({ prevented: e.defaultPrevented, id: e.target.id });
				e.preventDefault();
			});
		});
	}

	// Snapshot of one field: classes, aria-invalid, and its error <li>s (class-hidden and computed).
	const fieldState = id => page.evaluate(fid => {
		const el = document.getElementById(fid);
		const items = Array.from(el.closest('.form-element').querySelectorAll('[data-ln-validate-error]'));
		const key = li => li.getAttribute('data-ln-validate-error');
		return {
			valid: el.classList.contains('ln-validate-valid'),
			invalid: el.classList.contains('ln-validate-invalid'),
			aria: el.getAttribute('aria-invalid'),
			unhidden: items.filter(li => !li.classList.contains('hidden')).map(key).sort(),
			displayed: items.filter(li => getComputedStyle(li).display !== 'none').map(key).sort()
		};
	}, id);

	// Waits until the un-hidden error keys of a field equal `keys`, then asserts the full state.
	async function expectErrors(id, keys, label) {
		const expected = keys.slice().sort();
		await page.waitForFunction((fid, exp) => {
			const items = Array.from(document.getElementById(fid).closest('.form-element')
				.querySelectorAll('[data-ln-validate-error]'));
			const got = items.filter(li => !li.classList.contains('hidden'))
				.map(li => li.getAttribute('data-ln-validate-error')).sort();
			return got.length === exp.length && got.every((k, i) => k === exp[i]);
		}, { timeout: 5000 }, id, expected).catch(() => {});
		const s = await fieldState(id);
		assert(same(s.unhidden, expected), `${label}: un-hidden errors expected [${expected.join(',')}], got [${s.unhidden.join(',')}]`);
		assert(same(s.displayed, expected), `${label}: displayed errors (computed style) match un-hidden set`);
		const isInvalid = expected.length > 0;
		assert(s.invalid === isInvalid && s.valid === !isInvalid, `${label}: ${isInvalid ? 'ln-validate-invalid' : 'ln-validate-valid'} class only`);
		assert(s.aria === (isInvalid ? 'true' : 'false'), `${label}: aria-invalid="${isInvalid ? 'true' : 'false'}"`);
	}

	async function setValue(sel, text) {
		await page.focus(sel);
		await page.evaluate(s => document.querySelector(s).select(), sel);
		if (text === '') await page.keyboard.press('Backspace');
		else await page.keyboard.type(text);
	}

	const events = () => page.evaluate(() => window.__events);
	const clearEvents = () => page.evaluate(() => { window.__events.length = 0; });

	// ─── Structure + silence before interaction ────────────────

	await attempt('Initial state: structure, silent until touched', async () => {
		await load();
		const info = await page.evaluate(() => ({
			fields: document.querySelectorAll('main [data-ln-validate]').length,
			lists: document.querySelectorAll('[data-ln-validate-errors]').length,
			items: document.querySelectorAll('[data-ln-validate-error]').length,
			stateful: document.querySelectorAll('.ln-validate-valid, .ln-validate-invalid, [aria-invalid]').length,
			unhidden: document.querySelectorAll('[data-ln-validate-error]:not(.hidden)').length,
			novalidate: document.getElementById('demo-custom-form').hasAttribute('novalidate'),
			errorListsInWrappers: Array.from(document.querySelectorAll('[data-ln-validate-errors]'))
				.every(ul => ul.closest('.form-element'))
		}));
		assert(info.fields === FIELD_IDS.length, `${FIELD_IDS.length} validated fields mounted`);
		assert(info.lists === FIELD_IDS.length, 'one error list per field');
		assert(info.items === ERROR_ITEM_COUNT, `${ERROR_ITEM_COUNT} error <li> elements`);
		assert(info.errorListsInWrappers, 'every error list sits inside a .form-element');
		assert(info.stateful === 0, 'no valid/invalid classes or aria-invalid before interaction (empty required fields stay silent)');
		assert(info.unhidden === 0, 'every error message starts hidden');
		assert(info.novalidate, 'ln-validate set novalidate on the host form');
		assert((await events()).length === 0, 'no ln-validate events fired before interaction');
	});

	await attempt('Silent until touched [source]: focus/blur does not validate (no blur listener)', async () => {
		await load();
		await page.focus('#demo-name');
		await page.evaluate(() => document.getElementById('demo-name').blur());
		const s = await fieldState('demo-name');
		assert(!s.valid && !s.invalid && s.aria === null && s.unhidden.length === 0, 'blur without input leaves field silent');
		assert((await events()).length === 0, 'no event on blur');
	});

	// ─── Text input: required + minlength ──────────────────────

	await attempt('Text input (required + minlength=3)', async () => {
		await load();
		await setValue('#demo-name', 'ab');
		await expectErrors('demo-name', ['tooShort'], 'name "ab"');
		await setValue('#demo-name', 'abc');
		await expectErrors('demo-name', [], 'name "abc"');
		await setValue('#demo-name', '');
		await expectErrors('demo-name', ['required'], 'name cleared');

		const ev = (await events()).filter(e => e.id === 'demo-name');
		const last = ev[ev.length - 1];
		assert(last.type === 'ln-validate:invalid' && last.field === 'name' && same(last.errors, ['required']),
			'last event: ln-validate:invalid, detail.field="name", detail.errors=["required"]');
		assert(ev.some(e => e.type === 'ln-validate:valid' && e.field === 'name'), 'ln-validate:valid fired with detail.field="name"');

		const log = await page.$eval('#validate-log', el => el.textContent);
		assert(log.includes('ln-validate:invalid  field=name  target=demo-name'), 'page event log shows invalid event for demo-name');
		assert(log.includes('ln-validate:valid  field=name  target=demo-name'), 'page event log shows valid event for demo-name');
	});

	await attempt('Text input: change event alone also validates', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-name').dispatchEvent(new Event('change', { bubbles: true })));
		await expectErrors('demo-name', ['required'], 'name after change');
	});

	// ─── Email ─────────────────────────────────────────────────

	await attempt('Email: native typeMismatch + tooShort', async () => {
		await load();
		await setValue('#demo-email', 'abc');
		const s = await fieldState('demo-email');
		assert(s.unhidden.includes('typeMismatch') && s.unhidden.includes('tooShort'), `"abc" shows typeMismatch and tooShort (got [${s.unhidden.join(',')}])`);
		assert(s.invalid && s.aria === 'true', '"abc" marked invalid');
		await setValue('#demo-email', '');
		await expectErrors('demo-email', ['required'], 'email cleared');
		await setValue('#demo-email', 'test@');
		const t = await fieldState('demo-email');
		assert(t.unhidden.includes('typeMismatch'), '"test@" shows typeMismatch');
	});

	await attempt('Email [source]: pattern attribute drives patternMismatch', async () => {
		await load();
		// Diagnostic only: does Chrome accept the demo pattern under its `v` flag?
		const pattern = await page.$eval('#demo-email', el => el.getAttribute('pattern'));
		const vFlag = await page.evaluate(p => { try { new RegExp(p, 'v'); return 'valid'; } catch (e) { return 'invalid: ' + e.message; } }, pattern);
		console.log(`  (info) demo-email pattern under v flag: ${vFlag}`);
		await setValue('#demo-email', 'abc');
		await expectErrors('demo-email', ['typeMismatch', 'tooShort', 'patternMismatch'], 'email "abc"');
		await setValue('#demo-email', 'a@b.c');
		await expectErrors('demo-email', ['patternMismatch'], 'email "a@b.c" (valid type, no 2+ letter TLD)');
		await setValue('#demo-email', 'user@example.com');
		await expectErrors('demo-email', [], 'email "user@example.com"');
	});

	// ─── Select (change-based) ─────────────────────────────────

	await attempt('Select: change-based listener, required', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-dept').dispatchEvent(new Event('input', { bubbles: true })));
		let s = await fieldState('demo-dept');
		assert(!s.valid && !s.invalid && s.unhidden.length === 0, '[source] input event on a SELECT does not validate');
		await page.select('#demo-dept', 'it');
		await expectErrors('demo-dept', [], 'department "IT"');
		await page.select('#demo-dept', '');
		await expectErrors('demo-dept', ['required'], 'department reset to placeholder');
	});

	// ─── Pattern ───────────────────────────────────────────────

	await attempt('Pattern (phone)', async () => {
		await load();
		await setValue('#demo-phone', '123');
		await expectErrors('demo-phone', ['patternMismatch'], 'phone "123"');
		await setValue('#demo-phone', '+389 70 123456');
		await expectErrors('demo-phone', [], 'phone "+389 70 123456"');
		await setValue('#demo-phone', '');
		await expectErrors('demo-phone', [], 'phone cleared (optional field)');
	});

	// ─── Number range ──────────────────────────────────────────

	await attempt('Number range (min 20000, max 200000)', async () => {
		await load();
		await setValue('#demo-salary', '100');
		await expectErrors('demo-salary', ['rangeUnderflow'], 'salary 100');
		await setValue('#demo-salary', '300000');
		await expectErrors('demo-salary', ['rangeOverflow'], 'salary 300000');
		await setValue('#demo-salary', '50000');
		await expectErrors('demo-salary', [], 'salary 50000');
	});

	// ─── Custom validation (password confirmation) ─────────────

	await attempt('Custom error: password confirmation set-custom / clear-custom', async () => {
		await load();
		await setValue('#demo-pass', 'password1');
		await expectErrors('demo-pass', [], 'password "password1"');
		await setValue('#demo-pass-confirm', 'different');
		await expectErrors('demo-pass-confirm', ['passwordMismatch'], 'confirm mismatching');
		const mismatched = await page.evaluate(() => document.getElementById('demo-pass-confirm').lnValidate.isValid);
		assert(mismatched === false, 'isValid is false while a custom error is active');
		await setValue('#demo-pass-confirm', 'password1');
		await expectErrors('demo-pass-confirm', [], 'confirm matching');
		const matched = await page.evaluate(() => document.getElementById('demo-pass-confirm').lnValidate.isValid);
		assert(matched === true, 'isValid is true after clear-custom');
		// Changing the first field after the fact re-triggers the mismatch on the confirm field.
		await setValue('#demo-pass', 'password2');
		await expectErrors('demo-pass-confirm', ['passwordMismatch'], 'confirm after password edited');
	});

	await attempt('Custom error [source]: set-custom is silent, clear-custom({}) revalidates', async () => {
		await load();
		await clearEvents();
		await page.evaluate(() => document.getElementById('demo-phone').dispatchEvent(
			new CustomEvent('ln-validate:set-custom', { bubbles: true, detail: { error: 'serverError' } })));
		let s = await fieldState('demo-phone');
		assert(s.invalid && !s.valid && s.aria === 'true', 'set-custom flips classes to invalid and aria-invalid=true');
		assert((await events()).length === 0, 'set-custom dispatches no valid/invalid event');
		assert(await page.evaluate(() => document.getElementById('demo-phone').lnValidate.isValid) === false, 'isValid false with custom error');
		await page.evaluate(() => document.getElementById('demo-phone').dispatchEvent(
			new CustomEvent('ln-validate:clear-custom', { bubbles: true, detail: {} })));
		await expectErrors('demo-phone', [], 'phone after clear-custom {}');
		const ev = await events();
		assert(ev.length === 1 && ev[0].type === 'ln-validate:valid' && ev[0].field === 'phone', 'clear-custom on a touched field dispatches ln-validate:valid');
	});

	// ─── Submit gate on #demo-custom-form ──────────────────────

	await attempt('Submit gate: invalid form is blocked and shows inline errors', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-custom-form').requestSubmit());
		await expectErrors('demo-pass', ['required'], 'password after submit');
		await expectErrors('demo-pass-confirm', ['required'], 'confirm after submit');
		const submits = await page.evaluate(() => window.__submits);
		assert(submits.length === 1 && submits[0].prevented === true, 'submit event default prevented by ln-validate');
	});

	await attempt('Submit gate [source]: focus goes to the FIRST invalid field in document order', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-custom-form').requestSubmit());
		await page.waitForFunction(() => (window.__submits || []).length === 1, { timeout: 5000 });
		const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
		assert(focused === 'demo-pass', `first invalid field (demo-pass) focused, got "${focused}"`);
	});

	await attempt('Submit gate: only the second field invalid focuses it', async () => {
		await load();
		await setValue('#demo-pass', 'password1');
		await page.evaluate(() => document.getElementById('demo-custom-form').requestSubmit());
		await expectErrors('demo-pass-confirm', ['required'], 'confirm after submit');
		const focused = await page.evaluate(() => document.activeElement && document.activeElement.id);
		assert(focused === 'demo-pass-confirm', `demo-pass-confirm focused, got "${focused}"`);
	});

	await attempt('Submit gate: valid form is not blocked', async () => {
		await load();
		await setValue('#demo-pass', 'password1');
		await setValue('#demo-pass-confirm', 'password1');
		await page.evaluate(() => document.getElementById('demo-custom-form').requestSubmit());
		const submits = await page.evaluate(() => window.__submits);
		assert(submits.length === 1 && submits[0].prevented === false, 'valid submit passes the gate (not default-prevented by ln-validate)');
	});

	await attempt('Form reset resets fields', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-custom-form').requestSubmit());
		await expectErrors('demo-pass', ['required'], 'password before reset');
		await page.evaluate(() => document.getElementById('demo-custom-form').reset());
		await page.waitForFunction(() => !document.getElementById('demo-pass').classList.contains('ln-validate-invalid'), { timeout: 5000 });
		for (const id of ['demo-pass', 'demo-pass-confirm']) {
			const s = await fieldState(id);
			assert(!s.valid && !s.invalid && s.aria === null && s.unhidden.length === 0, `${id} silent after form reset`);
		}
	});

	// ─── Programmatic API buttons ──────────────────────────────

	await attempt('API: Force validate all, Check isValid, Reset all', async () => {
		await load();
		await clearEvents();
		await page.click('#demo-force-validate');
		await page.waitForFunction(() => window.__events.length === 7, { timeout: 5000 });
		const ev = await events();
		const invalidIds = ev.filter(e => e.type === 'ln-validate:invalid').map(e => e.id).sort();
		const validIds = ev.filter(e => e.type === 'ln-validate:valid').map(e => e.id).sort();
		assert(same(invalidIds, ['demo-dept', 'demo-email', 'demo-name', 'demo-pass', 'demo-pass-confirm']),
			`force validate: required-empty fields invalid (got [${invalidIds.join(',')}])`);
		assert(same(validIds, ['demo-phone', 'demo-salary']), `force validate: optional-empty fields valid (got [${validIds.join(',')}])`);
		await expectErrors('demo-name', ['required'], 'name after force validate (untouched field renders errors)');
		await expectErrors('demo-dept', ['required'], 'dept after force validate');
		await expectErrors('demo-phone', [], 'phone after force validate');

		await page.click('#demo-check-valid');
		await page.waitForFunction(() => Array.from(document.querySelectorAll('[data-ln-toast-item]'))
			.some(li => li.textContent.includes('2 valid, 5 invalid')), { timeout: 5000 });
		const toast = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-toast-item]'))
			.map(li => li.textContent).find(t => t.includes('2 valid, 5 invalid')));
		assert(toast.includes('Validity check'), 'toast title "Validity check" with "2 valid, 5 invalid"');

		await page.click('#demo-reset-validate');
		await page.waitForFunction(() => document.querySelectorAll('.ln-validate-valid, .ln-validate-invalid, [aria-invalid]').length === 0, { timeout: 5000 });
		const left = await page.evaluate(() => document.querySelectorAll('[data-ln-validate-error]:not(.hidden)').length);
		assert(left === 0, 'reset all: no classes, no aria-invalid, every error message hidden');
	});

	await attempt('API: reset() clears touched, custom errors and state', async () => {
		await load();
		await setValue('#demo-name', 'ab');
		await expectErrors('demo-name', ['tooShort'], 'name before reset');
		await page.evaluate(() => document.getElementById('demo-name').lnValidate.reset());
		const s = await fieldState('demo-name');
		assert(!s.valid && !s.invalid && s.aria === null && s.unhidden.length === 0, 'name silent after reset()');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
