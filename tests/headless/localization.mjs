import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/localization.html (live demo, scope
// #demo-localization-scope) and the components it mounts: ln-number, ln-date, ln-core
// (locale.js, number.js), ln-popover and ln-search (locale picker).
// Expected strings are for en-US / de-DE / en-GB as produced by Intl (the library's formatter).

const PAGE_URL = BASE_URL + 'localization.html';
const NUMBER_INPUTS = 4;
const DATE_INPUTS = 7;
const NUMBER_TEXTS = 2;
const TIME_ELEMENTS = 3;
const LOCALE_COUNT = 13;

run('demo/admin/localization.html', async ({ page }) => {

	const failures = [];

	// ─── Page helpers ──────────────────────────────────────────

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction((numInputs, dateInputs, numTexts, times) => {
			const scope = document.getElementById('demo-localization-scope');
			if (!scope) return false;
			const ni = scope.querySelectorAll('#demo-number-form input[data-ln-number]');
			if (ni.length !== numInputs || !Array.from(ni).every(el => el.lnNumber)) return false;
			const nt = scope.querySelectorAll('.demo-number-cards strong[data-ln-number]');
			if (nt.length !== numTexts || !Array.from(nt).every(el => el.lnNumber)) return false;
			const di = scope.querySelectorAll('#demo-date-form input[data-ln-date]');
			if (di.length !== dateInputs || !Array.from(di).every(el => el.lnDate)) return false;
			const te = scope.querySelectorAll('.demo-date-cards time[data-ln-date]');
			if (te.length !== times || !Array.from(te).every(el => el.lnDate)) return false;
			const pop = document.getElementById('locale-popover');
			if (!pop || !pop.lnPopover) return false;
			return true;
		}, { timeout: 10000 }, NUMBER_INPUTS, DATE_INPUTS, NUMBER_TEXTS, TIME_ELEMENTS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Waits until read(arg) === expected, then asserts (read is evaluated in the page).
	async function expectEq(read, arg, expected, label) {
		await page.waitForFunction(
			(src, a, e) => (new Function('a', 'return (' + src + ')(a)'))(a) === e,
			{ timeout: 5000 }, read.toString(), arg, expected
		).catch(() => {});
		const actual = await page.evaluate(read, arg);
		assert(actual === expected, `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
	}

	const visible = id => document.getElementById(id).value;
	const numRaw = id => document.getElementById(id).lnNumber.value;
	const dateRaw = id => document.getElementById(id).lnDate.value;
	const outText = id => document.getElementById(id).textContent;
	const textOf = sel => document.querySelector(sel).textContent;

	async function typeInto(id, text) {
		await page.focus('#' + id);
		await page.keyboard.type(text);
	}

	async function typeDate(id, text) {
		await page.focus('#' + id);
		await page.keyboard.type(text);
		await page.keyboard.press('Tab');
	}

	const formData = id => page.evaluate(fid => Object.fromEntries(new FormData(document.getElementById(fid))), id);

	async function pickLocale(value) {
		await page.click('#locale-popover-trigger');
		await page.waitForFunction(() => document.getElementById('locale-popover').getAttribute('data-ln-popover') === 'open', { timeout: 5000 });
		await page.evaluate(v => document.querySelector('#locale-list input[value="' + v + '"]').click(), value);
		await page.waitForFunction(v => document.getElementById('demo-localization-scope').getAttribute('lang') === v, { timeout: 5000 }, value);
	}

	// ─── 1. Structure ──────────────────────────────────────────

	await section('Structure: enhanced markup', async () => {
		await load();

		const num = await page.evaluate(() => {
			const el = document.getElementById('demo-amount');
			const hidden = el.nextElementSibling;
			return {
				type: el.type,
				inputmode: el.getAttribute('inputmode'),
				name: el.getAttribute('name'),
				hiddenType: hidden.type,
				hiddenName: hidden.getAttribute('name')
			};
		});
		assert(num.type === 'text', 'ln-number: visible input becomes type=text');
		assert(num.inputmode === 'decimal', 'ln-number: inputmode=decimal');
		assert(num.name === null && num.hiddenType === 'hidden' && num.hiddenName === 'amount',
			'ln-number: name moves to a hidden sibling input');

		const date = await page.evaluate(() => {
			const el = document.getElementById('demo-birthday');
			const wrapper = el.parentElement;
			const kids = Array.from(wrapper.children);
			return {
				wrapperTag: wrapper.tagName,
				hasField: wrapper.hasAttribute('data-ln-date-field'),
				type: el.type,
				name: el.getAttribute('name'),
				hidden: kids.some(k => k.tagName === 'INPUT' && k.type === 'hidden' && k.getAttribute('name') === 'birthday'),
				picker: kids.some(k => k.tagName === 'INPUT' && k.type === 'date' && k.getAttribute('aria-hidden') === 'true'),
				button: kids.some(k => k.tagName === 'BUTTON' && k.type === 'button')
			};
		});
		assert(date.wrapperTag === 'SPAN' && date.hasField, 'ln-date: input wrapped in span[data-ln-date-field]');
		assert(date.type === 'text' && date.name === null, 'ln-date: visible input becomes type=text and loses name');
		assert(date.hidden && date.picker && date.button, 'ln-date: hidden ISO input, hidden native picker and calendar button created');

		const labels = await page.evaluate(() => {
			const wrapper = document.getElementById('demo-custom-label').parentElement;
			const btn = wrapper.querySelector('button');
			const picker = wrapper.querySelector('input[type="date"]');
			const hidden = wrapper.querySelector('input[type="hidden"]');
			const def = document.getElementById('demo-birthday').parentElement;
			return {
				btn: btn.getAttribute('aria-label'),
				picker: picker.getAttribute('aria-label'),
				fillAs: hidden.getAttribute('data-ln-fill-as'),
				hiddenName: hidden.getAttribute('name'),
				defBtn: def.querySelector('button').getAttribute('aria-label'),
				defPicker: def.querySelector('input[type="date"]').getAttribute('aria-label')
			};
		});
		assert(labels.btn === 'Избери датум од календар' && labels.picker === 'Избери датум од календар',
			'data-ln-date-label sets aria-label on calendar button and picker');
		assert(labels.fillAs === 'formatted_date' && labels.hiddenName === 'custom_label',
			'data-ln-fill-as is copied to the hidden ISO input');
		assert(labels.defBtn === 'Open date picker' && labels.defPicker === 'Date picker',
			'Default aria-labels: "Open date picker" / "Date picker"');

		const warn = await page.evaluate(() => document.getElementById('chrome-intl-warning-container').hasAttribute('hidden'));
		assert(warn === false, 'Chromium Intl warning banner is revealed in Chrome');
	});

	// ─── 2. ln-number: initial state ──────────────────────────

	await section('ln-number: pre-filled and text elements (en-US)', async () => {
		await load();
		await expectEq(visible, 'demo-budget', '1,500,000', 'Budget pre-filled display');
		await expectEq(numRaw, 'demo-budget', 1500000, 'Budget raw value');
		await expectEq(id => document.getElementById(id).nextElementSibling.value, 'demo-budget', '1500000', 'Budget hidden input');

		await expectEq(textOf, '.demo-number-cards article:nth-child(1) strong', '1,234,567.89', '<strong> formatted (free decimals)');
		await expectEq(sel => document.querySelector(sel).getAttribute('data-ln-value'), '.demo-number-cards article:nth-child(1) strong',
			'1234567.89', '<strong> data-ln-value holds raw number');
		await expectEq(textOf, '.demo-number-cards article:nth-child(2) strong', '5,000', '<strong data-ln-number="5000" decimals=2> formatted');
		await expectEq(sel => document.querySelector(sel).getAttribute('data-ln-value'), '.demo-number-cards article:nth-child(2) strong',
			'5000', '<strong> attribute value becomes data-ln-value');
	});

	// ─── 3. ln-number: typing ──────────────────────────────────

	await section('ln-number: typing, decimals, raw output', async () => {
		await load();

		await typeInto('demo-amount', '1234567.89');
		await expectEq(visible, 'demo-amount', '1,234,567.89', 'Amount live-formats with thousand separators');
		await expectEq(numRaw, 'demo-amount', 1234567.89, 'Amount raw value');
		await expectEq(outText, 'demo-amount-raw', 'Raw: 1234567.89', 'ln-number:input updates the raw <output>');

		await typeInto('demo-price', '12.345');
		await expectEq(visible, 'demo-price', '12.34', 'Price truncated to 2 decimals');
		await expectEq(numRaw, 'demo-price', 12.34, 'Price raw value');
		await expectEq(outText, 'demo-price-raw', 'Raw: 12.34', 'Price raw <output>');

		await typeInto('demo-qty', '123');
		await expectEq(visible, 'demo-qty', '123', 'Quantity small value');
		await expectEq(outText, 'demo-qty-raw', 'Raw: 123', 'Quantity raw <output>');
		await typeInto('demo-qty', '4567');
		await expectEq(visible, 'demo-qty', '999,999', 'Quantity clamped to data-ln-number-max');
		await expectEq(numRaw, 'demo-qty', 999999, 'Quantity raw value clamped to max');
		await expectEq(outText, 'demo-qty-raw', 'Raw: 999999', 'Quantity raw <output> after clamp');

		const data = await formData('demo-number-form');
		assert(data.amount === '1234567.89' && data.price === '12.34' && data.quantity === '999999' && data.budget === '1500000',
			`Form submits raw numeric values (got ${JSON.stringify(data)})`);
	});

	await section('ln-number: programmatic value and clear', async () => {
		await load();
		await page.evaluate(() => { document.getElementById('demo-price').lnNumber.value = 1234.5; });
		await expectEq(visible, 'demo-price', '1,234.5', 'lnNumber.value setter formats display');
		await expectEq(outText, 'demo-price-raw', 'Raw: 1234.5', 'Setter fires input and updates raw <output>');
		await page.evaluate(() => { document.getElementById('demo-price').value = ''; });
		await expectEq(visible, 'demo-price', '', 'Clearing visible value empties display');
		await expectEq(id => String(document.getElementById(id).lnNumber.value), 'demo-price', 'NaN', 'Cleared raw value is NaN');
		await expectEq(outText, 'demo-price-raw', 'Raw: —', 'Raw <output> shows dash when empty');
	});

	await section('ln-number: data-ln-number-min is enforced (documented contract)', async () => {
		// ATTRIBUTES: "Minimum allowed numeric value"; page prose: "clamped during input".
		await load();
		await typeInto('demo-qty', '-5');
		await expectEq(numRaw, 'demo-qty', 0, 'Quantity (min 0): typing -5 is clamped/rejected to >= 0');
	});

	// ─── 4. ln-date ────────────────────────────────────────────

	await section('ln-date: pre-filled and <time> elements (en-US)', async () => {
		await load();
		await expectEq(visible, 'demo-prefilled-date', 'Mar 15, 2024', 'Pre-filled medium display');
		await expectEq(dateRaw, 'demo-prefilled-date', '2024-03-15', 'Pre-filled ISO value');
		await expectEq(visible, 'demo-dict-date', 'април 2026', 'Dictionary date (MMMM yyyy, lang=mk) shows Macedonian month');
		await expectEq(dateRaw, 'demo-dict-date', '2026-04-19', 'Dictionary date ISO value');

		await expectEq(textOf, '.demo-date-cards article:nth-child(1) time', 'Jul 25, 2026', '<time> medium');
		await expectEq(textOf, '.demo-date-cards article:nth-child(2) time', 'July 25, 2026', '<time> long');
		await expectEq(textOf, '.demo-date-cards article:nth-child(3) time', '25.07.2026', '<time> dd.MM.yyyy');
		const dt = await page.evaluate(() => Array.from(document.querySelectorAll('.demo-date-cards time')).map(t => t.getAttribute('datetime')));
		assert(dt.every(v => v === '2026-07-25'), 'datetime attributes preserved (machine-readable)');
	});

	await section('ln-date: typed input formats per style and syncs ISO', async () => {
		await load();

		await typeDate('demo-birthday', '15.03.2024');
		await expectEq(visible, 'demo-birthday', 'Mar 15, 2024', 'Birthday (medium) typed dd.mm.yyyy');
		await expectEq(dateRaw, 'demo-birthday', '2024-03-15', 'Birthday ISO value');
		await expectEq(outText, 'demo-birthday-raw', 'Raw: 2024-03-15', 'ln-date:change updates raw <output>');

		await typeDate('demo-due', '15.03.24');
		await expectEq(visible, 'demo-due', '3/15/24', 'Due (short), 2-digit year pivots to 2024');
		await expectEq(dateRaw, 'demo-due', '2024-03-15', 'Due ISO value');

		await typeDate('demo-event', '3/15/2024');
		await expectEq(visible, 'demo-event', 'March 15, 2024', 'Event (long) typed mm/dd/yyyy');
		await expectEq(dateRaw, 'demo-event', '2024-03-15', 'Event ISO value');

		await typeDate('demo-custom-date', '2024-03-05');
		await expectEq(visible, 'demo-custom-date', '05.03.2024', 'Custom pattern dd.MM.yyyy from typed ISO');
		await expectEq(dateRaw, 'demo-custom-date', '2024-03-05', 'Custom pattern ISO value');
		await expectEq(outText, 'demo-custom-date-raw', 'Raw: 2024-03-05', 'Custom pattern raw <output>');

		await typeDate('demo-custom-label', '01.02.2025');
		await expectEq(visible, 'demo-custom-label', 'Feb 1, 2025', 'Custom-label field formats medium');
		await expectEq(outText, 'demo-custom-label-raw', 'Raw: 2025-02-01', 'Custom-label raw <output>');

		const data = await formData('demo-date-form');
		assert(data.birthday === '2024-03-15' && data.due === '2024-03-15' && data.event === '2024-03-15'
			&& data.custom === '2024-03-05' && data.prefilled === '2024-03-15' && data.custom_label === '2025-02-01'
			&& data.dict_date === '2026-04-19',
			`Form submits ISO dates under original names (got ${JSON.stringify(data)})`);
	});

	await section('ln-date: invalid, clear and native picker', async () => {
		await load();

		await typeDate('demo-birthday', '15.03.2024');
		await expectEq(visible, 'demo-birthday', 'Mar 15, 2024', 'Valid date accepted');

		await page.focus('#demo-birthday');
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.type('zz');
		await page.keyboard.press('Tab');
		await expectEq(visible, 'demo-birthday', 'Mar 15, 2024', 'Unparseable text reverts to last valid date on blur');
		await expectEq(dateRaw, 'demo-birthday', '2024-03-15', 'ISO unchanged after invalid input');

		await page.focus('#demo-birthday');
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
		await page.keyboard.press('Tab');
		await expectEq(dateRaw, 'demo-birthday', '', 'Emptying the field clears ISO value');
		await expectEq(outText, 'demo-birthday-raw', 'Raw: —', 'Raw <output> shows dash after clear');

		// Native picker change syncs the visible field and hidden ISO input.
		await page.evaluate(() => {
			const picker = document.getElementById('demo-due').parentElement.querySelector('input[type="date"]');
			Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(picker, '2025-12-31');
			picker.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await expectEq(visible, 'demo-due', '12/31/25', 'Picker change formats visible field (short)');
		await expectEq(dateRaw, 'demo-due', '2025-12-31', 'Picker change updates ISO value');

		// Programmatic API.
		await page.evaluate(() => { document.getElementById('demo-event').lnDate.value = '2030-01-02'; });
		await expectEq(visible, 'demo-event', 'January 2, 2030', 'lnDate.value setter formats (long)');
		await page.evaluate(() => { document.getElementById('demo-event').value = '2031-06-07'; });
		await expectEq(dateRaw, 'demo-event', '2031-06-07', 'Assigning input.value with ISO syncs hidden ISO value');
	});

	// ─── 5. Locale cascade ─────────────────────────────────────

	await section('Locale picker: search filter in popover', async () => {
		await load();
		const count = await page.evaluate(() => document.querySelectorAll('#locale-list input[type="radio"]').length);
		assert(count === LOCALE_COUNT, `Locale list has ${LOCALE_COUNT} radios`);

		await page.click('#locale-popover-trigger');
		await page.waitForFunction(() => document.getElementById('locale-popover').getAttribute('data-ln-popover') === 'open', { timeout: 5000 });
		const expanded = await page.evaluate(() => document.getElementById('locale-popover-trigger').getAttribute('aria-expanded'));
		assert(expanded === 'true', 'Trigger aria-expanded=true while popover is open');

		await page.focus('#locale-popover input[data-ln-search-for="locale-list"]');
		await page.keyboard.type('deu');
		await page.waitForFunction(() => document.querySelectorAll('#locale-list label[data-ln-search-hide]').length === 12, { timeout: 5000 });
		const shown = await page.evaluate(() => Array.from(document.querySelectorAll('#locale-list label:not([data-ln-search-hide]) input')).map(i => i.value));
		assert(shown.length === 1 && shown[0] === 'de-DE', `Search "deu" leaves only de-DE (got ${JSON.stringify(shown)})`);

		await page.evaluate(() => document.querySelector('#locale-popover button[data-ln-search-clear]').click());
		await page.waitForFunction(() => document.querySelectorAll('#locale-list label[data-ln-search-hide]').length === 0, { timeout: 5000 });
		assert(true, 'Clear button restores all locales');
	});

	await section('Locale switch to de-DE reformats numbers and dates', async () => {
		await load();
		await typeInto('demo-amount', '1234.5');
		await expectEq(visible, 'demo-amount', '1,234.5', 'Amount typed under en-US');
		await typeDate('demo-birthday', '15.03.2024');

		await pickLocale('de-DE');
		await expectEq(id => document.getElementById('locale-popover').getAttribute('data-ln-popover'), null, 'closed', 'Popover closes after selecting a locale');
		await expectEq(sel => document.querySelector(sel).textContent, '#locale-popover-trigger span',
			'Locale: Deutsch (DE) [de-DE]', 'Trigger label reflects selection');

		await expectEq(visible, 'demo-budget', '1.500.000', 'Budget regrouped for de-DE');
		await expectEq(numRaw, 'demo-budget', 1500000, 'Budget raw value unchanged');
		await expectEq(visible, 'demo-amount', '1.234,5', 'Typed amount re-formatted for de-DE');
		await expectEq(numRaw, 'demo-amount', 1234.5, 'Typed amount raw value unchanged');
		await expectEq(textOf, '.demo-number-cards article:nth-child(1) strong', '1.234.567,89', '<strong> re-formatted for de-DE');
		await expectEq(textOf, '.demo-number-cards article:nth-child(2) strong', '5.000', '<strong decimals=2> re-formatted for de-DE');

		await expectEq(visible, 'demo-prefilled-date', '15.03.2024', 'Pre-filled medium date for de-DE');
		await expectEq(visible, 'demo-birthday', '15.03.2024', 'Typed medium date for de-DE');
		await expectEq(dateRaw, 'demo-birthday', '2024-03-15', 'ISO value unchanged after locale switch');
		await expectEq(textOf, '.demo-date-cards article:nth-child(1) time', '25.07.2026', '<time> medium for de-DE');
		await expectEq(textOf, '.demo-date-cards article:nth-child(2) time', '25. Juli 2026', '<time> long for de-DE');
		await expectEq(textOf, '.demo-date-cards article:nth-child(3) time', '25.07.2026', '<time> dd.MM.yyyy for de-DE');
		await expectEq(visible, 'demo-dict-date', 'април 2026', 'lang=mk date field keeps its own locale');

		const data = await formData('demo-number-form');
		assert(data.amount === '1234.5' && data.budget === '1500000',
			`Submitted values stay raw/unlocalized after switch (got ${JSON.stringify(data)})`);
	});

	await section('Locale switch to en-GB and back to en-US', async () => {
		await load();
		await pickLocale('en-GB');
		await expectEq(textOf, '.demo-date-cards article:nth-child(1) time', '25 Jul 2026', '<time> medium for en-GB');
		await expectEq(textOf, '.demo-date-cards article:nth-child(2) time', '25 July 2026', '<time> long for en-GB');
		await expectEq(visible, 'demo-budget', '1,500,000', 'Budget unchanged for en-GB');
		await pickLocale('en-US');
		await expectEq(textOf, '.demo-date-cards article:nth-child(1) time', 'Jul 25, 2026', '<time> medium back in en-US');
		await expectEq(visible, 'demo-prefilled-date', 'Mar 15, 2024', 'Pre-filled date back in en-US');
	});

	await section('Locale switch to mk matches native Intl output', async () => {
		await load();
		await pickLocale('mk');
		const expected = await page.evaluate(() => ({
			budget: new Intl.NumberFormat('mk', { useGrouping: true }).format(1500000),
			strong: new Intl.NumberFormat('mk', { useGrouping: true }).format(1234567.89),
			// formatDateValue: when Intl resolves a different language than requested and a dict
			// fallback is registered (page registers 'mk'), it formats as dd.MM.yyyy.
			timeLong: new Intl.DateTimeFormat('mk', { dateStyle: 'long' }).resolvedOptions().locale.toLowerCase().split('-')[0] === 'mk'
				? new Intl.DateTimeFormat('mk', { dateStyle: 'long' }).format(new Date(2026, 6, 25))
				: '25.07.2026'
		}));
		await expectEq(visible, 'demo-budget', expected.budget, 'Budget matches Intl.NumberFormat(mk)');
		await expectEq(textOf, '.demo-number-cards article:nth-child(1) strong', expected.strong, '<strong> matches Intl.NumberFormat(mk)');
		await expectEq(textOf, '.demo-date-cards article:nth-child(2) time', expected.timeLong, '<time> long matches Intl.DateTimeFormat(mk)');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
