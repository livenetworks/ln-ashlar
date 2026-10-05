import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/slug.html (#slug-demo-form,
// #slug-prefill-form) and components/ln-slug/src/{ln-slug,slug-model}.js, plus
// components/ln-form/src/ln-form.js and ln-core/form.js (populateForm) for fill/reset.

const PAGE_URL = BASE_URL + 'slug.html';

const NAME = '#slug-name';
const SLUG = '#slug-slug';
const PF_NAME = '#slug-pf-name';
const PF_SLUG = '#slug-pf-slug';

run('demo/admin/slug.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Runs one section; a failing assertion is recorded so later sections still run.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => {
			const a = document.getElementById('slug-slug');
			const b = document.getElementById('slug-pf-slug');
			return a && a.lnSlug && b && b.lnSlug;
		}, { timeout: 10000 });
	}

	const val = sel => page.$eval(sel, el => el.value);

	async function clear(sel) {
		await page.$eval(sel, el => { el.focus(); el.select(); });
		await page.keyboard.press('Backspace');
	}

	async function type(sel, text) {
		await page.$eval(sel, el => { el.focus(); el.setSelectionRange(el.value.length, el.value.length); });
		await page.keyboard.type(text);
	}

	async function expectValue(sel, expected, label) {
		await page.waitForFunction((s, e) => document.querySelector(s).value === e, { timeout: 3000 }, sel, expected).catch(() => {});
		const actual = await val(sel);
		assert(actual === expected, `${label}: expected "${expected}", got "${actual}"`);
	}

	await check('Live mirroring', async () => {
		await load();
		assert(await val(SLUG) === '', 'Slug starts empty (pristine)');
		await type(NAME, 'My Article Title');
		await expectValue(SLUG, 'my-article-title', 'Slug mirrors name live');
		await clear(NAME);
		await expectValue(SLUG, '', 'Clearing name clears the mirrored slug');
		await type(NAME, 'Foo   Bar--Baz!!');
		await expectValue(SLUG, 'foo-bar-baz', 'Separators collapsed, edges trimmed');
		await clear(NAME);
		await type(NAME, 'Héllo Wörld');
		await expectValue(SLUG, 'hello-world', 'Diacritics stripped to base letters');
		await clear(NAME);
		await type(NAME, 'Здраво');
		await expectValue(SLUG, '', 'Cyrillic-only input yields empty slug (no transliteration)');
	});

	await check('Typing in slug stops mirroring; clearing resumes', async () => {
		await load();
		await type(NAME, 'First');
		await expectValue(SLUG, 'first', 'Mirrored before manual edit');
		await clear(SLUG);
		await type(SLUG, 'custom');
		await expectValue(SLUG, 'custom', 'Manual slug accepted');
		await type(NAME, ' Second');
		await expectValue(SLUG, 'custom', 'Name input no longer overwrites manual slug');
		await clear(SLUG);
		await expectValue(SLUG, '', 'Slug cleared');
		await type(NAME, ' Third');
		await expectValue(SLUG, 'first-second-third', 'Mirroring resumes after slug cleared to empty');
	});

	await check('Pre-filled slug is NOT overwritten', async () => {
		await load();
		assert(await val(PF_NAME) === 'My Article Title', 'Prefill name has initial value');
		await expectValue(PF_SLUG, 'my-custom-slug', 'Prefill slug untouched at init');
		await type(PF_NAME, ' Extra');
		assert(await val(PF_NAME) === 'My Article Title Extra', 'Prefill name accepted typing');
		await expectValue(PF_SLUG, 'my-custom-slug', 'Prefill slug not overwritten by name input');
		const other = await val(SLUG);
		assert(other === '', 'Other form unaffected (slug still empty)');
	});

	await check('Forms are independent', async () => {
		await load();
		await type(NAME, 'Alpha');
		await expectValue(SLUG, 'alpha', 'Demo form mirrors');
		await expectValue(PF_SLUG, 'my-custom-slug', 'Prefill form unchanged');
	});

	await check('Form reset while pristine keeps mirroring', async () => {
		await load();
		await type(NAME, 'Reset Me');
		await expectValue(SLUG, 'reset-me', 'Mirrored before reset');
		await page.evaluate(() => document.getElementById('slug-demo-form').reset());
		await expectValue(SLUG, '', 'Reset clears slug');
		await expectValue(NAME, '', 'Reset clears name');
		await type(NAME, 'After');
		await expectValue(SLUG, 'after', 'Mirroring still active after reset');
	});

	// Source (ln-slug.js) has no 'reset' listener: _pristine is only updated by slug 'input'
	// events, and a native reset fires none. The page prose says "Form reset clears slug to
	// empty -> Pristine, mirroring resumes". Asserting the SOURCE behaviour here.
	await check('Form reset after manual slug (source behaviour)', async () => {
		await load();
		await type(SLUG, 'manual');
		await page.evaluate(() => document.getElementById('slug-demo-form').reset());
		await expectValue(SLUG, '', 'Reset clears manual slug');
		await type(NAME, 'Later');
		await expectValue(SLUG, '', 'Slug stays empty: no reset handler re-arms pristine (source)');
	});

	// lnForm.fill sets name then slug (form.elements order), dispatching 'input' on each.
	// Name's input event reaches the still-pristine slug first and mirrors over the loaded
	// slug; the slug's own input then marks it non-pristine. Asserting the SOURCE behaviour.
	await check('lnForm.fill (source behaviour)', async () => {
		await load();
		await page.evaluate(() => document.getElementById('slug-demo-form').lnForm.fill({ name: 'Loaded Title', slug: 'custom-loaded' }));
		await expectValue(NAME, 'Loaded Title', 'fill sets name');
		await expectValue(SLUG, 'loaded-title', 'fill: name input mirrors over loaded slug before slug input arrives (source)');
		await type(NAME, ' More');
		await expectValue(SLUG, 'loaded-title', 'After fill, slug is non-pristine: later name input does not overwrite');
	});

	await check('Fill with slug matching generated value is preserved', async () => {
		await load();
		await page.evaluate(() => document.getElementById('slug-demo-form').lnForm.fill({ name: 'Same Thing', slug: 'same-thing' }));
		await expectValue(SLUG, 'same-thing', 'Slug value after fill');
		await type(NAME, ' Again');
		await expectValue(SLUG, 'same-thing', 'Non-pristine after fill: not overwritten');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
