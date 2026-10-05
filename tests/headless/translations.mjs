import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/translations.html is driven by the REAL library component ln-translations
// (components/ln-translations/src/ln-translations.js). The three live examples are
// <form data-ln-translations> blocks; no mock script. Page prose / API snippets are <pre> only.
// Facts below come from demo/admin/src/pages/translations.html and the component source.
//
// KNOWN DEMO GAP (asserted as [source], expected to FAIL): the component renders the locale menu and
// the active-language badges by cloning the global templates "ln-translations-menu-item" and
// "ln-translations-badge" (cloneTemplate). The page declares neither (only ln-toast-item), so
// the menu stays empty and badges never render. Those checks live in their own sections.

const PAGE_URL = BASE_URL + 'translations.html';
const FORMS = 3;
const EX1 = 0;
const EX2 = 1;
const EX3 = 2;
// DEFAULT_LOCALES in source: { en: 'English', sq: 'Shqip', sr: 'Srpski' }
const LOCALES = { en: 'English', sq: 'Shqip', sr: 'Srpski' };

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

run('demo/admin/translations.html', async ({ page }) => {

	const consoleWarnings = [];
	page.on('console', msg => {
		if (msg.type() === 'warn') consoleWarnings.push(msg.text());
	});

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section runs isolated: a failing assertion is recorded, other sections still run.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		consoleWarnings.length = 0;
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(forms => {
			const els = document.querySelectorAll('form[data-ln-translations]');
			return els.length === forms && Array.from(els).every(f => f.lnTranslations);
		}, { timeout: 10000 }, FORMS);
	}

	// Runs fn(form, ...args) in the page on the idx-th translations form.
	const onForm = (idx, fn, ...args) => page.evaluate(
		(i, src, a) => {
			const form = document.querySelectorAll('form[data-ln-translations]')[i];
			return new Function('form', 'args', 'return (' + src + ')(form, ...args);').call(null, form, a);
		},
		idx, fn.toString(), args
	);

	const names = idx => onForm(idx, form => Array.from(form.querySelectorAll('input[name], textarea[name]'))
		.map(el => el.name));

	// [name, lang attr] of every element carrying data-ln-translatable-lang inside one translatable wrapper.
	const fieldLangs = (idx, field, nth = 0) => onForm(idx, (form, f, n) => {
		const wrapper = form.querySelectorAll('[data-ln-translatable="' + f + '"]')[n];
		return Array.from(wrapper.querySelectorAll('[data-ln-translatable-lang]'))
			.map(el => [el.name, el.getAttribute('data-ln-translatable-lang')]);
	}, field, nth);

	const active = idx => onForm(idx, form => Array.from(form.lnTranslations.getActiveLanguages()));

	// Records every ln-translations:* event bubbling to document into window.__tev.
	const recordEvents = () => page.evaluate(() => {
		window.__tev = [];
		['before-add', 'added', 'before-remove', 'removed'].forEach(n => {
			document.addEventListener('ln-translations:' + n, e => {
				window.__tev.push({
					type: e.type,
					cancelable: e.cancelable,
					bubbles: e.bubbles,
					lang: e.detail.lang,
					langName: e.detail.langName,
					targetIsForm: e.detail.target === e.target
				});
			});
		});
	});
	const events = () => page.evaluate(() => window.__tev);

	await load();

	await check('Mount: three forms carry an instance', async () => {
		assert(await page.evaluate(() => document.querySelectorAll('form[data-ln-translations]').length) === FORMS,
			`${FORMS} translations forms on the page`);
		for (const i of [EX1, EX2, EX3]) {
			const defaults = await onForm(i, form => form.lnTranslations.defaultLang);
			assert(defaults === 'en', `form ${i + 1}: defaultLang is "en" (data-ln-translations-default)`);
			assert((await active(i)).length === 0, `form ${i + 1}: no active languages on load`);
		}
	});

	await check('Default language flag on originals (_applyDefaultLang)', async () => {
		// Ex1: only the inputs inside [data-ln-translatable] get the flag (scope, address); name/ea_code do not.
		const flagged = await onForm(EX1, form => Array.from(form.querySelectorAll('[data-ln-translatable-lang]'))
			.map(el => [el.name, el.getAttribute('data-ln-translatable-lang')]));
		assert(same(flagged.map(f => f[0]), ['scope', 'address']), `Ex1 flagged originals: scope, address (got ${flagged.map(f => f[0])})`);
		assert(flagged.every(f => f[1] === 'en'), 'Ex1 flagged originals carry lang "en"');
		const unflagged = await onForm(EX1, form => ['name', 'ea_code']
			.map(n => form.querySelector('[name="' + n + '"]').hasAttribute('data-ln-translatable-lang')));
		assert(unflagged.every(v => v === false), 'Ex1 non-translatable name/ea_code are NOT flagged');
		// Ex3: three nested originals flagged.
		const ex3 = await onForm(EX3, form => Array.from(form.querySelectorAll('[data-ln-translatable-lang]'))
			.map(el => [el.name, el.getAttribute('data-ln-translatable-lang')]));
		assert(same(ex3.map(f => f[0]), ['items[1][title]', 'items[2][title]', 'items[3][title]']),
			'Ex3 flagged originals: items[1..3][title]');
		assert(ex3.every(f => f[1] === 'en'), 'Ex3 originals carry lang "en"');
	});

	await check('Ex2: pre-rendered default-lang translation fields are not treated as extra active languages', async () => {
		// _detectExisting skips lang === defaultLang, and the pre-rendered fields are lang "en" (the default).
		const all = await onForm(EX2, form => Array.from(form.querySelectorAll('[data-ln-translatable-lang]'))
			.map(el => [el.name, el.getAttribute('data-ln-translatable-lang')]));
		assert(same(all.map(f => f[0]), ['title', 'trans[en][title]', 'description', 'trans[en][description]']),
			`Ex2 lang-flagged elements (got ${all.map(f => f[0])})`);
		assert(all.every(f => f[1] === 'en'), 'Ex2 all four flagged "en"');
		assert((await active(EX2)).length === 0, 'Ex2 active set empty (en is the default)');
		assert(await onForm(EX2, form => form.lnTranslations.hasLanguage('en')) === false, 'Ex2 hasLanguage("en") is false');
	});

	await check('Ex1: addLanguage clones translatable fields with trans[lang][field] names', async () => {
		await load();
		await recordEvents();
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		assert(same(await active(EX1), ['sq']), 'active set is {sq}');
		assert(await onForm(EX1, form => form.lnTranslations.hasLanguage('sq')) === true, 'hasLanguage("sq") true');
		assert(same(await fieldLangs(EX1, 'scope'), [['scope', 'en'], ['trans[sq][scope]', 'sq']]), 'scope wrapper: original then trans[sq][scope]');
		assert(same((await fieldLangs(EX1, 'address')).map(f => f[0]), ['address', 'trans[sq][address]']), 'address wrapper: original then trans[sq][address]');
		const n = await names(EX1);
		assert(!n.some(x => x.startsWith('trans[sq][name]') || x.startsWith('trans[sq][ea_code]')), 'non-translatable name/ea_code not cloned');
		const clone = await onForm(EX1, form => {
			const el = form.querySelector('[name="trans[sq][scope]"]');
			return { tag: el.tagName, value: el.value, placeholder: el.placeholder, id: el.id };
		});
		assert(clone.tag === 'TEXTAREA', 'scope clone is a TEXTAREA');
		assert(clone.value === '', 'clone value is empty');
		assert(clone.placeholder === 'Shqip translation', `placeholder "{lang} translation" with langName (got "${clone.placeholder}")`);
		const origValue = await onForm(EX1, form => form.querySelector('[name="scope"]').value);
		assert(origValue === 'Food and beverage production', 'original scope value untouched');
		const fd = await onForm(EX1, form => Array.from(new FormData(form).keys()));
		assert(fd.includes('trans[sq][scope]') && fd.includes('trans[sq][address]'), 'native FormData serializes the cloned names');
		const ev = await events();
		assert(same(ev.map(e => e.type), ['ln-translations:before-add', 'ln-translations:added']), 'events: before-add then added');
		assert(ev[0].cancelable === true && ev[1].cancelable === false, 'before-add cancelable, added not');
		assert(ev.every(e => e.bubbles && e.lang === 'sq' && e.langName === 'Shqip' && e.targetIsForm), 'events bubble, detail {target, lang:"sq", langName:"Shqip"}');
	});

	await check('Ex1: duplicate add is a no-op; values argument fills clones; unknown code falls back to code', async () => {
		await load();
		await recordEvents();
		await onForm(EX1, form => {
			form.lnTranslations.addLanguage('sq', { scope: 'Prodhimi' });
			form.lnTranslations.addLanguage('sq');
			form.lnTranslations.addLanguage('xx');
		});
		const vals = await onForm(EX1, form => ({
			scope: form.querySelector('[name="trans[sq][scope]"]').value,
			address: form.querySelector('[name="trans[sq][address]"]').value,
			xxPlaceholder: form.querySelector('[name="trans[xx][scope]"]').placeholder
		}));
		assert(vals.scope === 'Prodhimi', 'values.scope prefilled into trans[sq][scope]');
		assert(vals.address === '', 'field without a value stays empty');
		assert(vals.xxPlaceholder === 'xx translation', 'unknown locale code: langName falls back to the code');
		assert((await names(EX1)).filter(x => x === 'trans[sq][scope]').length === 1, 'duplicate addLanguage did not clone twice');
		const added = (await events()).filter(e => e.type === 'ln-translations:added').map(e => e.lang);
		assert(same(added, ['sq', 'xx']), `added fired once per real add (got ${added})`);
	});

	await check('Ex1: second language is inserted after the previous clone', async () => {
		await load();
		await onForm(EX1, form => { form.lnTranslations.addLanguage('sq'); form.lnTranslations.addLanguage('sr'); });
		assert(same((await fieldLangs(EX1, 'scope')).map(f => f[0]), ['scope', 'trans[sq][scope]', 'trans[sr][scope]']), 'scope order: original, sq, sr');
		assert(same(await active(EX1), ['sq', 'sr']), 'active set {sq, sr}');
		const ph = await onForm(EX1, form => form.querySelector('[name="trans[sr][address]"]').placeholder);
		assert(ph === 'Srpski translation', `sr placeholder (got "${ph}")`);
	});

	await check('Ex1: removeLanguage removes only that language; events; default and unknown are no-ops', async () => {
		await load();
		await onForm(EX1, form => { form.lnTranslations.addLanguage('sq'); form.lnTranslations.addLanguage('sr'); });
		await recordEvents();
		await onForm(EX1, form => {
			form.lnTranslations.removeLanguage('sq');
			form.lnTranslations.removeLanguage('en');
			form.lnTranslations.removeLanguage('zz');
		});
		const n = await names(EX1);
		assert(!n.includes('trans[sq][scope]') && !n.includes('trans[sq][address]'), 'sq clones removed');
		assert(n.includes('trans[sr][scope]') && n.includes('trans[sr][address]'), 'sr clones kept');
		assert(n.includes('scope') && n.includes('address'), 'originals kept');
		assert(same(await active(EX1), ['sr']), 'active set {sr}');
		const ev = await events();
		assert(same(ev.map(e => e.type), ['ln-translations:before-remove', 'ln-translations:removed']), 'only sq produced before-remove + removed');
		assert(ev.every(e => e.lang === 'sq' && e.bubbles && e.targetIsForm), 'remove events bubble, detail {target, lang:"sq"}');
		assert(ev[0].cancelable === true && ev[1].cancelable === false, 'before-remove cancelable, removed not');
	});

	await check('Cancelable before-add / before-remove', async () => {
		await load();
		await page.evaluate(() => {
			window.__block = e => e.preventDefault();
			document.addEventListener('ln-translations:before-add', window.__block);
		});
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		assert((await active(EX1)).length === 0, 'prevented before-add: language not added');
		assert(!(await names(EX1)).includes('trans[sq][scope]'), 'prevented before-add: no clones');
		await page.evaluate(() => document.removeEventListener('ln-translations:before-add', window.__block));
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		await page.evaluate(() => document.addEventListener('ln-translations:before-remove', window.__block));
		await onForm(EX1, form => form.lnTranslations.removeLanguage('sq'));
		assert(same(await active(EX1), ['sq']), 'prevented before-remove: language stays active');
		assert((await names(EX1)).includes('trans[sq][scope]'), 'prevented before-remove: clones stay');
	});

	await check('Ex2: add clones next to pre-rendered fields (input and textarea)', async () => {
		await load();
		await onForm(EX2, form => form.lnTranslations.addLanguage('sq'));
		const n = await names(EX2);
		assert(n.includes('trans[sq][title]') && n.includes('trans[sq][description]'), 'trans[sq][title] and trans[sq][description] created');
		assert(n.includes('trans[en][title]') && n.includes('trans[en][description]'), 'pre-rendered trans[en][*] kept');
		const tags = await onForm(EX2, form => [form.querySelector('[name="trans[sq][title]"]').tagName, form.querySelector('[name="trans[sq][description]"]').tagName]);
		assert(same(tags, ['INPUT', 'TEXTAREA']), 'clone element types mirror the originals');
		await onForm(EX2, form => form.lnTranslations.removeLanguage('sq'));
		assert(!(await names(EX2)).some(x => x.startsWith('trans[sq]')), 'remove deletes the sq clones');
		assert((await names(EX2)).includes('trans[en][title]'), 'pre-rendered en field survives sq removal');
	});

	await check('Ex3: nested prefix produces prefix[trans][lang][field] names', async () => {
		await load();
		await onForm(EX3, form => form.lnTranslations.addLanguage('sq'));
		const n = await names(EX3);
		for (const i of [1, 2, 3]) {
			assert(n.includes(`items[${i}][trans][sq][title]`), `items[${i}][trans][sq][title] created`);
		}
		assert(!n.some(x => x.startsWith('trans[sq]')), 'no un-prefixed trans[sq] names');
		const perItem = await onForm(EX3, form => Array.from(form.querySelectorAll('[data-ln-translatable]'))
			.map(w => Array.from(w.querySelectorAll('input')).map(i => i.name)));
		assert(same(perItem[1], ['items[2][title]', 'items[2][trans][sq][title]']), 'item 2 wrapper holds its own original + clone');
		await onForm(EX3, form => form.lnTranslations.removeLanguage('sq'));
		assert(same(await names(EX3), ['items[1][title]', 'items[2][title]', 'items[3][title]']), 'remove restores the original names only');
	});

	await check('Forms are independent instances', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('sr'));
		assert((await active(EX2)).length === 0 && (await active(EX3)).length === 0, 'adding on Ex1 leaves Ex2/Ex3 untouched');
		assert(!(await names(EX3)).some(x => x.includes('[sr]')), 'Ex3 has no sr names');
	});

	await check('request-add / request-remove events on the form', async () => {
		await load();
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-add', { detail: { lang: 'sr' } }));
		});
		assert(same(await active(EX1), ['sr']), 'request-add {lang:"sr"} adds sr');
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-add', { detail: {} }));
			form.dispatchEvent(new CustomEvent('ln-translations:request-add'));
		});
		assert(same(await active(EX1), ['sr']), 'request-add without detail.lang is ignored');
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-remove', { detail: { lang: 'sr' } }));
		});
		assert((await active(EX1)).length === 0, 'request-remove {lang:"sr"} removes sr');
		assert(!(await names(EX1)).some(x => x.startsWith('trans[sr]')), 'sr clones gone after request-remove');
	});

	// ─── [source] sections expected to expose the missing page templates ─────────

	await check('[source] No "template not found" warnings for ln-translations templates', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		const missing = consoleWarnings.filter(w => w.includes('[ln-translations] Template'));
		assert(missing.length === 0, `templates ln-translations-menu-item / ln-translations-badge resolve (warnings: ${JSON.stringify(Array.from(new Set(missing)))})`);
	});

	await check('[source] Locale menu is populated from DEFAULT_LOCALES (excluding active languages)', async () => {
		await load();
		const menu = () => onForm(EX1, form => Array.from(form.querySelectorAll('#trans-menu-1 [data-ln-translations-lang]'))
			.map(b => [b.getAttribute('data-ln-translations-lang'), b.textContent]));
		assert(same(await menu(), Object.entries(LOCALES)), `menu lists en/sq/sr with labels (got ${JSON.stringify(await menu())})`);
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		assert(same((await menu()).map(m => m[0]), ['en', 'sr']), 'after adding sq the menu no longer lists sq');
	});

	await check('[source] Menu item click adds the language', async () => {
		await load();
		await page.evaluate(() => {
			document.querySelector('#trans-menu-1 [data-ln-translations-lang="sq"]').click();
		});
		assert(same(await active(EX1), ['sq']), 'clicking the sq menu item adds sq');
	});

	await check('[source] Active-language badge renders, and its remove button removes the language', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('sq'));
		const badge = await onForm(EX1, form => {
			const p = form.querySelector('[data-ln-translations-active] [data-ln-translations-lang="sq"]');
			if (!p) return null;
			return { label: p.querySelector('span').textContent, aria: p.querySelector('button').getAttribute('aria-label') };
		});
		assert(badge !== null, 'badge for sq exists in [data-ln-translations-active]');
		assert(badge.label === 'Shqip', `badge label "Shqip" (got "${badge.label}")`);
		assert(badge.aria === 'Remove Shqip', `remove button aria-label "Remove Shqip" (got "${badge.aria}")`);
		await onForm(EX1, form => form.querySelector('[data-ln-translations-active] [data-ln-translations-lang="sq"] button').click());
		assert((await active(EX1)).length === 0, 'clicking the badge button removes sq');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
