import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/forms.html (live demos) and the
// components it mounts: ln-form, ln-validate, ln-fill, ln-autoresize, ln-modal, ln-ajax
// (components/ln-*/src/*.js) plus the ln-core populateForm / lnFill helpers.

const PAGE_URL = BASE_URL + 'forms.html';

const FORM = '#demo-form-grid';
const REST_FORM = '#demo-rest-form';
const REST_MODAL = '#demo-rest-modal';

// Declarative record on the "Fill (Declarative ln-fill)" button.
const DECLARATIVE = {
	fname: 'Dalibor', lname: 'Sojic', email: 'dalibor@example.com', phone: '+389 70 123 456',
	city: 'Skopje', zip: '1000', country: 'Germany', message: 'Filled declaratively via ln-fill!'
};
// sampleData from the page script (Fill API / Fill Coordinator); `confirmed` is checked separately.
const SAMPLE = {
	fname: 'Marko', lname: 'Petrovski', email: 'marko@example.com', phone: '+1 555 1234',
	city: 'Skopje', zip: '1000', country: 'Germany', message: 'Filled via demo coordinator.'
};

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

run('demo/admin/forms.html', async ({ page }) => {

	// ─── Page helpers ──────────────────────────────────────────

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs one feature group. A failed assertion (already logged as ✗) is recorded so the
	// remaining groups still run; any recorded failure fails the test at the end.
	async function part(title, fn) {
		section(title);
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
		await page.waitForFunction(() => {
			const form = document.getElementById('demo-form-grid');
			if (!form || !form.lnForm) return false;
			const validated = ['demo-fname', 'demo-email', 'demo-phone', 'rest-name', 'rest-max-users'];
			if (!validated.every(id => document.getElementById(id) && document.getElementById(id).lnValidate)) return false;
			const rest = document.getElementById('demo-rest-form');
			if (!rest || !rest.lnForm || !rest.lnAjax) return false;
			const modal = document.getElementById('demo-rest-modal');
			if (!modal || !modal.lnModal) return false;
			const ta = document.getElementById('demo-ta-auto');
			if (!ta || !ta.lnAutoresize) return false;
			return !!(window.lnFill && window.lnCore && window.lnCore.lnFill);
		}, { timeout: 10000 });
		// Record validity events bubbling to the live form.
		await page.evaluate(() => {
			window.__ev = [];
			const form = document.getElementById('demo-form-grid');
			['ln-validate:valid', 'ln-validate:invalid'].forEach(name => {
				form.addEventListener(name, e => window.__ev.push({ name, field: e.detail.field, errors: e.detail.errors }));
			});
		});
	}

	const waitFor = (fn, arg, timeout = 5000) => page.waitForFunction(fn, { timeout }, arg);

	// Visible = computed display not none.
	const isShown = sel => page.evaluate(s => {
		const el = document.querySelector(s);
		return !!el && getComputedStyle(el).display !== 'none';
	}, sel);

	const classes = sel => page.evaluate(s => Array.from(document.querySelector(s).classList), sel);
	const attr = (sel, name) => page.evaluate((s, n) => document.querySelector(s).getAttribute(n), sel, name);
	const val = sel => page.evaluate(s => document.querySelector(s).value, sel);

	// Which of a field's error <li> are visible, by data-ln-validate-error key.
	const visibleErrors = id => page.evaluate(fieldId => {
		const parent = document.getElementById(fieldId).closest('.form-element');
		return Array.from(parent.querySelectorAll('[data-ln-validate-error]'))
			.filter(li => getComputedStyle(li).display !== 'none')
			.map(li => li.getAttribute('data-ln-validate-error'));
	}, id);

	async function setValue(sel, value) {
		await page.focus(sel);
		await page.evaluate(s => document.querySelector(s).select(), sel);
		await page.keyboard.press('Backspace');
		if (value) await page.type(sel, value);
	}

	async function expectErrors(id, expected, label) {
		await waitFor(([fieldId, exp]) => {
			const parent = document.getElementById(fieldId).closest('.form-element');
			const got = Array.from(parent.querySelectorAll('[data-ln-validate-error]'))
				.filter(li => getComputedStyle(li).display !== 'none')
				.map(li => li.getAttribute('data-ln-validate-error'));
			return got.length === exp.length && exp.every(k => got.includes(k));
		}, [id, expected], 2000).catch(() => {});
		const got = await visibleErrors(id);
		assert(got.length === expected.length && expected.every(k => got.includes(k)),
			`${label}: visible errors [${expected.join(', ')}] (got [${got.join(', ')}])`);
	}

	// Subset check: every key in `expected` is visible (other keys may be too).
	async function expectIncludes(id, expected, label) {
		await waitFor(([fieldId, exp]) => {
			const parent = document.getElementById(fieldId).closest('.form-element');
			const got = Array.from(parent.querySelectorAll('[data-ln-validate-error]'))
				.filter(li => getComputedStyle(li).display !== 'none')
				.map(li => li.getAttribute('data-ln-validate-error'));
			return exp.every(k => got.includes(k));
		}, [id, expected], 2000).catch(() => {});
		const got = await visibleErrors(id);
		assert(expected.every(k => got.includes(k)), `${label}: visible errors include [${expected.join(', ')}] (got [${got.join(', ')}])`);
	}

	// Label click: the pill/switch inputs are visually replaced, so drive them through their label.
	const clickLabel = sel => page.evaluate(s => document.querySelector(s).closest('label').click(), sel);

	async function openRest(buttonText) {
		await page.evaluate(text => {
			const btn = Array.from(document.querySelectorAll('button[data-ln-modal-for="demo-rest-modal"]'))
				.find(b => b.textContent.trim() === text);
			btn.click();
		}, buttonText);
		await waitFor(() => document.getElementById('demo-rest-modal').open === true);
	}

	const readout = () => page.evaluate(() => document.getElementById('rest-action-readout').textContent);
	const taHeight = () => page.evaluate(() => document.getElementById('demo-ta-auto').getBoundingClientRect().height);

	// ─── 1. Page structure ─────────────────────────────────────

	await part('Structure', async () => {
		await load();
		assert(await page.evaluate(() => document.querySelectorAll('[data-ln-form]').length) === 2,
			'Two ln-form hosts (live form + REST modal form)');
		assert(await attr(FORM, 'novalidate') !== null, 'ln-validate injected novalidate on the live form');
		assert(await attr(REST_FORM, 'novalidate') !== null, 'ln-validate injected novalidate on the REST form');
		assert(await page.evaluate(() => !document.getElementById('demo-focus-ring').hasAttribute('novalidate')),
			'Focus-preset forms (no data-ln-validate field) keep native validation (no novalidate)');
		assert(await page.evaluate(() => !document.getElementById('demo-lname').lnValidate),
			'Last Name has no data-ln-validate, so no ln-validate instance');
		assert(await page.evaluate(() => document.querySelectorAll('form[id^="demo-focus-"]').length) === 6,
			'Six focus-preset forms are present');
		assert(await page.evaluate(() => !document.querySelector('#demo-form-grid input[name="_method"]')),
			'Live form has no _method input (no data-ln-form-action-edit)');
		assert(await val('#demo-disabled') === 'Cannot be changed'
			&& await page.evaluate(() => document.getElementById('demo-disabled').disabled),
			'Disabled field keeps its value and is disabled');
	});

	// ─── 2. ln-validate: initial state ────────────────────────

	await part('ln-validate initial state', async () => {
		for (const id of ['demo-fname', 'demo-email', 'demo-phone']) {
			const c = await classes('#' + id);
			assert(!c.includes('ln-validate-valid') && !c.includes('ln-validate-invalid'), `#${id}: pristine, no valid/invalid class`);
		}
		assert((await visibleErrors('demo-fname')).length === 0 && (await visibleErrors('demo-email')).length === 0,
			'No error message visible before interaction');
	});

	// ─── 3. Submit gate ───────────────────────────────────────

	await part('Submit gate (empty required fields)', async () => {
		await page.click(`${FORM} button[type="submit"]`);
		await waitFor(() => document.getElementById('demo-fname').classList.contains('ln-validate-invalid'));
		assert((await classes('#demo-fname')).includes('ln-validate-invalid'), 'First Name marked invalid after blocked submit');
		assert((await classes('#demo-email')).includes('ln-validate-invalid'), 'Email marked invalid after blocked submit');
		assert(await attr('#demo-fname', 'aria-invalid') === 'true', 'First Name aria-invalid=true');
		assert(!(await classes('#demo-phone')).includes('ln-validate-invalid'),
			'Phone (not required, empty) is not flagged by the gate');
		await expectErrors('demo-fname', ['required'], 'First Name');
		await expectErrors('demo-email', ['required'], 'Email');
		assert(await page.evaluate(() => document.activeElement && document.activeElement.id) === 'demo-fname',
			'Gate focuses the first invalid field in document order');
	});

	// ─── 4. ln-validate: live typing ──────────────────────────

	await part('Live validation while typing', async () => {
		await page.click('#demo-fname');
		await page.type('#demo-fname', 'Ann');
		await waitFor(() => document.getElementById('demo-fname').classList.contains('ln-validate-valid'));
		assert((await classes('#demo-fname')).includes('ln-validate-valid') && !(await classes('#demo-fname')).includes('ln-validate-invalid'),
			'First Name becomes valid once filled');
		assert(await attr('#demo-fname', 'aria-invalid') === 'false', 'First Name aria-invalid=false');
		await expectErrors('demo-fname', [], 'First Name valid');

		await page.evaluate(() => { window.__ev.length = 0; });
		await setValue('#demo-email', 'abc');
		await expectIncludes('demo-email', ['typeMismatch', 'tooShort'], 'Email "abc"');
		assert((await classes('#demo-email')).includes('ln-validate-invalid'), 'Email "abc" is invalid');
		const lastInvalid = await page.evaluate(() => window.__ev.filter(e => e.field === 'email').pop());
		assert(lastInvalid && lastInvalid.name === 'ln-validate:invalid'
			&& lastInvalid.errors.indexOf('typeMismatch') !== -1 && lastInvalid.errors.indexOf('tooShort') !== -1
			&& lastInvalid.errors.indexOf('typeMismatch') < lastInvalid.errors.indexOf('tooShort'),
			'ln-validate:invalid bubbles to the form with the active errors in ERROR_MAP order');

		await setValue('#demo-email', 'user@example.com');
		await expectErrors('demo-email', [], 'Email "user@example.com"');
		assert((await classes('#demo-email')).includes('ln-validate-valid'), 'Email "user@example.com" is valid');
		const lastValid = await page.evaluate(() => window.__ev.filter(e => e.field === 'email').pop());
		assert(lastValid && lastValid.name === 'ln-validate:valid' && lastValid.errors.length === 0,
			'ln-validate:valid bubbles to the form with no errors');

		await setValue('#demo-email', '');
		await expectErrors('demo-email', ['required'], 'Email cleared');

		await setValue('#demo-phone', 'abc');
		await expectErrors('demo-phone', ['patternMismatch'], 'Phone "abc"');
		await setValue('#demo-phone', '+389 70 123 456');
		await expectErrors('demo-phone', [], 'Phone "+389 70 123 456"');
		assert((await classes('#demo-phone')).includes('ln-validate-valid'), 'Phone valid format accepted');
	});

	await part('Email pattern error (patternMismatch)', async () => {
		await load();
		await page.click('#demo-email');
		await page.type('#demo-email', 'abc');
		await expectErrors('demo-email', ['typeMismatch', 'tooShort', 'patternMismatch'], 'Email "abc"');
		const ev = await page.evaluate(() => window.__ev.filter(e => e.field === 'email').pop());
		assert(ev && same(ev.errors, ['typeMismatch', 'tooShort', 'patternMismatch']),
			'ln-validate:invalid errors are [typeMismatch, tooShort, patternMismatch] in ERROR_MAP order');
		await setValue('#demo-email', 'a@bcd');
		await expectErrors('demo-email', ['patternMismatch'], 'Email "a@bcd" (type ok, length ok, no TLD)');
	});

	// ─── 5. Valid submit ──────────────────────────────────────

	await part('Valid submit writes the event log', async () => {
		await load();
		assert(await page.evaluate(() => document.getElementById('form-log').textContent) === '', 'Event log starts empty');
		await page.click('#demo-fname');
		await page.type('#demo-fname', 'Ann');
		await page.click('#demo-email');
		await page.type('#demo-email', 'ann@example.com');
		await page.click(`${FORM} input[name="confirmed"]`);
		await page.click(`${FORM} button[type="submit"]`);
		await waitFor(() => document.getElementById('form-log').textContent.includes('submit'));
		const logText = await page.evaluate(() => document.getElementById('form-log').textContent);
		const match = /^\[\d{2}:\d{2}:\d{2}\] submit {2}data=(.+)$/.exec(logText);
		assert(!!match, 'Log line has the [hh:mm:ss] submit  data=... format');
		assert(match && match[1] === JSON.stringify({
			fname: 'Ann', lname: '', email: 'ann@example.com', phone: '', city: '', zip: '',
			country: 'United States', message: '', confirmed: '1'
		}), 'Submitted FormData: disabled field omitted, checkbox "1", select default "United States"');
	});

	// ─── 6-8. Fill patterns ───────────────────────────────────

	await part('Fill (Declarative ln-fill)', async () => {
		await load();
		await page.click('button[data-ln-fill-form="demo-form-grid"]');
		await waitFor(() => document.getElementById('demo-fname').value === 'Dalibor');
		for (const [name, expected] of Object.entries(DECLARATIVE)) {
			assert(await val(`${FORM} [name="${name}"]`) === expected, `Declarative fill: ${name} = "${expected}"`);
		}
		assert((await classes('#demo-fname')).includes('ln-validate-valid'),
			'ln-form.fill dispatches input, so ln-validate marks First Name valid');
		assert((await classes('#demo-email')).includes('ln-validate-valid'), 'Filled Email is validated as valid');
		assert((await classes('#demo-phone')).includes('ln-validate-valid'), 'Filled Phone is validated as valid');
	});

	await part('Fill (API)', async () => {
		await load();
		await page.click('#demo-fill-api-btn');
		await waitFor(() => document.getElementById('demo-fname').value === 'Marko');
		for (const [name, expected] of Object.entries(SAMPLE)) {
			assert(await val(`${FORM} [name="${name}"]`) === expected, `API fill: ${name} = "${expected}"`);
		}
		assert(await page.evaluate(() => document.querySelector('#demo-form-grid input[name="confirmed"]').checked),
			'API fill: confirmed "1" checks the checkbox');
		assert(await val('#demo-disabled') === 'Cannot be changed', 'API fill: field absent from record stays untouched');
	});

	await part('Fill (Coordinator)', async () => {
		await load();
		await page.click('#demo-fill-coordinator-btn');
		await waitFor(() => document.getElementById('demo-fname').value === 'Marko');
		assert(await val('#demo-email') === 'marko@example.com', 'ln-table:row-click record routed into the form (email)');
		assert(await val('#demo-city') === 'Skopje' && await val('#demo-country') === 'Germany', 'Coordinator fill: city + select');
		assert(await page.evaluate(() => document.querySelector('#demo-form-grid input[name="confirmed"]').checked),
			'Coordinator fill: checkbox checked');
	});

	// ─── 9. Reset ─────────────────────────────────────────────

	await part('Reset via ln-fill null (native form reset)', async () => {
		await load();
		await page.click('#demo-fill-api-btn');
		await waitFor(() => document.getElementById('demo-fname').value === 'Marko');
		await page.evaluate(() => window.lnCore.lnFill(document.getElementById('demo-form-grid'), null));
		await waitFor(() => document.getElementById('demo-fname').value === '');
		assert(await val('#demo-fname') === '' && await val('#demo-email') === '', 'ln-fill null clears filled fields');
		assert(await val('#demo-country') === 'United States', 'Select returns to its default option');
		assert(!(await page.evaluate(() => document.querySelector('#demo-form-grid input[name="confirmed"]').checked)),
			'Checkbox returns to unchecked');
		const afterReset = await classes('#demo-fname');
		assert(!afterReset.includes('ln-validate-valid') && !afterReset.includes('ln-validate-invalid'),
			'ln-validate clears valid/invalid classes on form reset');
		assert(await attr('#demo-fname', 'aria-invalid') === null, 'ln-validate removes aria-invalid on form reset');
		await expectErrors('demo-email', [], 'After reset');
	});

	await part('Reset button (page script calls form.lnForm.reset())', async () => {
		await load();
		await page.click('#demo-fill-api-btn');
		await waitFor(() => document.getElementById('demo-fname').value === 'Marko');
		await page.click('#demo-reset-btn');
		await waitFor(() => document.getElementById('demo-fname').value === '', undefined, 1500).catch(() => {});
		assert(await val('#demo-fname') === '', 'Reset button clears the form');
	});

	// ─── 10. Autoresize ───────────────────────────────────────

	await part('ln-autoresize', async () => {
		await load();
		const h0 = await taHeight();
		await page.click('#demo-ta-auto');
		await page.type('#demo-ta-auto', 'l1\nl2\nl3\nl4\nl5\nl6\nl7\nl8\nl9\nl10');
		await waitFor(h => document.getElementById('demo-ta-auto').getBoundingClientRect().height > h, h0);
		const taState = await page.evaluate(() => {
			const el = document.getElementById('demo-ta-auto');
			return { h: el.getBoundingClientRect().height, styleH: el.style.height, scroll: el.scrollHeight };
		});
		assert(taState.h > h0, `Textarea grew while typing (${h0} -> ${taState.h})`);
		assert(taState.styleH === taState.scroll + 'px', 'Inline height equals scrollHeight (content fits)');
		await page.evaluate(() => {
			const el = document.getElementById('demo-ta-auto');
			el.value = '';
			el.dispatchEvent(new Event('input', { bubbles: true }));
		});
		await waitFor(h => document.getElementById('demo-ta-auto').getBoundingClientRect().height < h, taState.h);
		assert(await taHeight() < taState.h, 'Textarea shrinks back when content is cleared');
		assert(await page.evaluate(() => !document.getElementById('demo-ta1').lnAutoresize && !document.getElementById('demo-ta1').style.height),
			'Plain textarea (no data-ln-autoresize) is untouched');
	});

	// ─── 11. Native controls (pills, switches, states) ───────

	await part('Pills, switches and native controls', async () => {
		await load();
		assert(await page.evaluate(() => document.querySelectorAll('ul.pills input[type="radio"]').length) === 3,
			'Radio pill group has 3 options');
		await clickLabel('ul.pills input[value="employee"]');
		assert(await page.evaluate(() => {
			const r = n => document.querySelector('ul.pills input[value="' + n + '"]').checked;
			return !r('admin') && r('employee') && !r('external');
		}), 'Clicking Employee selects it exclusively');
		await clickLabel('ul.pills input[value="export"]');
		assert(same(await page.evaluate(() => Array.from(document.querySelectorAll('ul.pills input[name="pill-feat[]"]:checked')).map(i => i.value)),
			['api', 'export', 'audit']), 'Checkbox pills toggle independently');
		await clickLabel('ul.pills-outline input[value="2fa"]');
		assert(await page.evaluate(() => document.querySelector('ul.pills-outline input[value="2fa"]').checked), 'Outline pill toggles on');
		await clickLabel('input[name="basic-sms"]');
		assert(await page.evaluate(() => document.querySelector('input[name="basic-sms"]').checked), 'Switch toggles on');
		assert(await page.evaluate(() => {
			const off = document.querySelector('input[name="disabled-off"]');
			const on = document.querySelector('input[name="disabled-on"]');
			return off.disabled && !off.checked && on.disabled && on.checked;
		}), 'Disabled switches keep state (off stays off, on stays on)');
		assert(await page.evaluate(() => document.getElementById('state-readonly').readOnly && document.getElementById('state-disabled').disabled),
			'Readonly / disabled input states are applied');
		assert((await classes('#state-invalid')).includes('ln-validate-invalid')
			&& await isShown('#state-invalid ~ ul [data-ln-validate-error="typeMismatch"]'),
			'Static invalid sample shows its error message');
		assert((await classes('#state-valid')).includes('ln-validate-valid'), 'Static valid sample carries ln-validate-valid');
		await page.select('#demo-sel1', 'Option B');
		assert(await val('#demo-sel1') === 'Option B', 'Select accepts an option');
		assert(await page.evaluate(() => document.getElementById('demo-sel-dis').disabled && document.getElementById('demo-ta-dis').disabled),
			'Disabled select and textarea are disabled');
		assert(await page.evaluate(() => document.querySelectorAll('#demo-checks input[type="radio"]:checked').length) === 1,
			'Radio group has exactly one checked option');
	});

	// ─── 12. RESTful action routing (ln-form + ln-fill + ln-modal) ──

	await part('RESTful action routing', async () => {
		await load();
		assert(await page.evaluate(() => document.getElementById('demo-rest-modal').open) === false, 'REST modal starts closed');
		assert(await attr(REST_MODAL, 'data-ln-modal-mode') === 'new', 'REST modal starts in mode "new"');

		await openRest('Edit #7');
		await waitFor(() => document.getElementById('demo-rest-form').getAttribute('action') === '/api/packages/7');
		assert(await attr(REST_FORM, 'action') === '/api/packages/7', 'Edit #7 rewrites action via the :id template');
		assert(await val(`${REST_FORM} input[name="_method"]`) === 'PUT', 'Edit #7 injects hidden _method = PUT');
		assert(await page.evaluate(() => document.querySelector('#demo-rest-form input[name="_method"]').type) === 'hidden',
			'_method input is type hidden');
		assert(await val('#rest-name') === 'Starter', 'Edit #7 fills name');
		assert(await val('#rest-max-users') === '5', 'Edit #7 fills max_users via data-ln-fill-as="maxUsers"');
		assert(await page.evaluate(() => document.querySelector('#demo-rest-form h3 [data-ln-field="id"]').textContent) === '7',
			'Edit #7 fills the data-ln-field="id" title slot');

		await page.click(`${REST_FORM} footer button[data-ln-modal-close]`);
		await waitFor(() => document.getElementById('demo-rest-modal').open === false);
		assert(await attr(REST_MODAL, 'data-ln-modal-mode') === 'new', 'Closing the modal keeps/resets mode "new"');

		await openRest('Edit #42');
		await waitFor(() => document.getElementById('demo-rest-form').getAttribute('action') === '/api/packages/42');
		assert(await attr(REST_FORM, 'action') === '/api/packages/42', 'Edit #42 rewrites action to the new id');
		assert(await val('#rest-name') === 'Enterprise' && await val('#rest-max-users') === '500', 'Edit #42 fills Enterprise / 500');
		assert(await val(`${REST_FORM} input[name="_method"]`) === 'PUT', '_method stays PUT for Edit #42');
		await page.click(`${REST_FORM} footer button[data-ln-modal-close]`);
		await waitFor(() => document.getElementById('demo-rest-modal').open === false);

		await openRest('New package');
		await waitFor(() => document.getElementById('demo-rest-form').getAttribute('action') === '/api/packages');
		assert(await attr(REST_FORM, 'action') === '/api/packages', 'New package restores the base action');
		assert(await val(`${REST_FORM} input[name="_method"]`) === '', 'New package clears _method');
		assert(await val('#rest-name') === '' && await val('#rest-max-users') === '', 'New package resets the fields');
	});

	await part('REST form: submit gate + ln-ajax interception', async () => {
		await load();
		await openRest('New package');
		// Count ln-ajax:before-start and cancel it so no real request is made.
		await page.evaluate(() => {
			window.__ajax = [];
			document.getElementById('demo-rest-form').addEventListener('ln-ajax:before-start', e => {
				e.preventDefault();
				window.__ajax.push({ method: e.detail.method, url: e.detail.url });
			});
		});
		await page.click(`${REST_FORM} footer button[type="submit"]`);
		await waitFor(() => document.getElementById('rest-name').classList.contains('ln-validate-invalid'));
		assert((await classes('#rest-name')).includes('ln-validate-invalid'), 'Empty required Package name is flagged');
		assert((await classes('#rest-max-users')).includes('ln-validate-invalid'), 'Empty required Max users is flagged');
		await expectErrors('rest-name', ['required'], 'Package name');
		await expectErrors('rest-max-users', ['required'], 'Max users');
		assert(await page.evaluate(() => window.__ajax.length) === 0, 'Blocked submit never reaches ln-ajax');
		assert(await page.evaluate(() => document.getElementById('demo-rest-modal').open), 'Modal stays open after a blocked submit');

		await page.type('#rest-name', 'Pro');
		await page.type('#rest-max-users', '0');
		await expectErrors('rest-max-users', ['rangeUnderflow'], 'Max users "0"');
		await setValue('#rest-max-users', '25');
		await expectErrors('rest-max-users', [], 'Max users "25"');

		await page.click(`${REST_FORM} footer button[type="submit"]`);
		await waitFor(() => window.__ajax.length === 1);
		const req = await page.evaluate(() => window.__ajax[0]);
		assert(req.method === 'POST' && req.url.endsWith('/api/packages'), 'Valid submit reaches ln-ajax once (POST /api/packages)');
	});

	// ─── 13. REST demo page script (readout + event log) ──────

	// The inline script in the REST section does getElementById('demo-rest-modal') while the
	// page parses, but the <dialog> is declared after it; it wires the readout/log only if found.
	await part('REST demo readout and event log (page script)', async () => {
		await load();
		assert(await readout() === 'Click a trigger to see the DOM rewrite.', 'Readout shows its initial text');
		await openRest('Edit #7');
		await waitFor(() => document.getElementById('rest-action-readout').textContent === 'action: /api/packages/7\n_method: PUT',
			undefined, 2000).catch(() => {});
		assert(await readout() === 'action: /api/packages/7\n_method: PUT', 'Readout reflects the rewritten action and _method');
		await page.click(`${REST_FORM} footer button[type="submit"]`);
		await waitFor(() => document.getElementById('rest-event-log').textContent.length > 0, undefined, 2000).catch(() => {});
		const editLog = await page.evaluate(() => document.getElementById('rest-event-log').textContent);
		assert(/^\[\d{2}:\d{2}:\d{2}\] → would PUT \/api\/packages\/7 \(demo: no backend\)$/.test(editLog),
			'Valid edit submit logs "would PUT /api/packages/7"');
		await waitFor(() => document.getElementById('demo-rest-modal').open === false, undefined, 2000).catch(() => {});
		assert(await page.evaluate(() => document.getElementById('demo-rest-modal').open) === false,
			'Page closes the modal from ln-ajax:before-start');
	});

	if (failures.length > 0) {
		console.error('\nFailed groups:\n  - ' + failures.join('\n  - '));
		throw new Error(`${failures.length} feature group(s) failed`);
	}
});
