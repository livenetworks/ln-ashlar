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
const FORMS = 4;
const EX1 = 0;
const EX2 = 1;
const EX3 = 2;
// DEFAULT_LOCALES in source: { en: 'English', sq: 'Shqip', sr: 'Srpski' }; demo Ex1-3 offer de, mk (default en)
const LOCALES = { de: 'Deutsch', mk: 'Македонски' };

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
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		assert(same(await active(EX1), ['de']), 'active set is {de}');
		assert(await onForm(EX1, form => form.lnTranslations.hasLanguage('de')) === true, 'hasLanguage("de") true');
		assert(same(await fieldLangs(EX1, 'scope'), [['scope', 'en'], ['trans[de][scope]', 'de']]), 'scope wrapper: original then trans[de][scope]');
		assert(same((await fieldLangs(EX1, 'address')).map(f => f[0]), ['address', 'trans[de][address]']), 'address wrapper: original then trans[de][address]');
		const n = await names(EX1);
		assert(!n.some(x => x.startsWith('trans[de][name]') || x.startsWith('trans[de][ea_code]')), 'non-translatable name/ea_code not cloned');
		const clone = await onForm(EX1, form => {
			const el = form.querySelector('[name="trans[de][scope]"]');
			return { tag: el.tagName, value: el.value, placeholder: el.placeholder, id: el.id };
		});
		assert(clone.tag === 'TEXTAREA', 'scope clone is a TEXTAREA');
		assert(clone.value === '', 'clone value is empty');
		assert(clone.placeholder === 'Deutsch translation', `placeholder "{lang} translation" with langName (got "${clone.placeholder}")`);
		const origValue = await onForm(EX1, form => form.querySelector('[name="scope"]').value);
		assert(origValue === 'Food and beverage production', 'original scope value untouched');
		const fd = await onForm(EX1, form => Array.from(new FormData(form).keys()));
		assert(fd.includes('trans[de][scope]') && fd.includes('trans[de][address]'), 'native FormData serializes the cloned names');
		const ev = await events();
		assert(same(ev.map(e => e.type), ['ln-translations:before-add', 'ln-translations:added']), 'events: before-add then added');
		assert(ev[0].cancelable === true && ev[1].cancelable === false, 'before-add cancelable, added not');
		assert(ev.every(e => e.bubbles && e.lang === 'de' && e.langName === 'Deutsch' && e.targetIsForm), 'events bubble, detail {target, lang:"de", langName:"Deutsch"}');
	});

	await check('Ex1: duplicate add is a no-op; values argument fills clones; unknown code falls back to code', async () => {
		await load();
		await recordEvents();
		await onForm(EX1, form => {
			form.lnTranslations.addLanguage('de', { scope: 'Prodhimi' });
			form.lnTranslations.addLanguage('de');
			form.lnTranslations.addLanguage('xx');
		});
		const vals = await onForm(EX1, form => ({
			scope: form.querySelector('[name="trans[de][scope]"]').value,
			address: form.querySelector('[name="trans[de][address]"]').value,
			xxPlaceholder: form.querySelector('[name="trans[xx][scope]"]').placeholder
		}));
		assert(vals.scope === 'Prodhimi', 'values.scope prefilled into trans[de][scope]');
		assert(vals.address === '', 'field without a value stays empty');
		assert(vals.xxPlaceholder === 'xx translation', 'unknown locale code: langName falls back to the code');
		assert((await names(EX1)).filter(x => x === 'trans[de][scope]').length === 1, 'duplicate addLanguage did not clone twice');
		const added = (await events()).filter(e => e.type === 'ln-translations:added').map(e => e.lang);
		assert(same(added, ['de', 'xx']), `added fired once per real add (got ${added})`);
	});

	await check('Ex1: second language is inserted after the previous clone', async () => {
		await load();
		await onForm(EX1, form => { form.lnTranslations.addLanguage('de'); form.lnTranslations.addLanguage('mk'); });
		assert(same((await fieldLangs(EX1, 'scope')).map(f => f[0]), ['scope', 'trans[de][scope]', 'trans[mk][scope]']), 'scope order: original, de, mk');
		assert(same(await active(EX1), ['de', 'mk']), 'active set {de, mk}');
		const ph = await onForm(EX1, form => form.querySelector('[name="trans[mk][address]"]').placeholder);
		assert(ph === 'Македонски translation', `mk placeholder (got "${ph}")`);
	});

	await check('Ex1: removeLanguage removes only that language; events; default and unknown are no-ops', async () => {
		await load();
		await onForm(EX1, form => { form.lnTranslations.addLanguage('de'); form.lnTranslations.addLanguage('mk'); });
		await recordEvents();
		await onForm(EX1, form => {
			form.lnTranslations.removeLanguage('de');
			form.lnTranslations.removeLanguage('en');
			form.lnTranslations.removeLanguage('zz');
		});
		const n = await names(EX1);
		assert(!n.includes('trans[de][scope]') && !n.includes('trans[de][address]'), 'de clones removed');
		assert(n.includes('trans[mk][scope]') && n.includes('trans[mk][address]'), 'mk clones kept');
		assert(n.includes('scope') && n.includes('address'), 'originals kept');
		assert(same(await active(EX1), ['mk']), 'active set {mk}');
		const ev = await events();
		assert(same(ev.map(e => e.type), ['ln-translations:before-remove', 'ln-translations:removed']), 'only de produced before-remove + removed');
		assert(ev.every(e => e.lang === 'de' && e.bubbles && e.targetIsForm), 'remove events bubble, detail {target, lang:"de"}');
		assert(ev[0].cancelable === true && ev[1].cancelable === false, 'before-remove cancelable, removed not');
	});

	await check('Cancelable before-add / before-remove', async () => {
		await load();
		await page.evaluate(() => {
			window.__block = e => e.preventDefault();
			document.addEventListener('ln-translations:before-add', window.__block);
		});
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		assert((await active(EX1)).length === 0, 'prevented before-add: language not added');
		assert(!(await names(EX1)).includes('trans[de][scope]'), 'prevented before-add: no clones');
		await page.evaluate(() => document.removeEventListener('ln-translations:before-add', window.__block));
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		await page.evaluate(() => document.addEventListener('ln-translations:before-remove', window.__block));
		await onForm(EX1, form => form.lnTranslations.removeLanguage('de'));
		assert(same(await active(EX1), ['de']), 'prevented before-remove: language stays active');
		assert((await names(EX1)).includes('trans[de][scope]'), 'prevented before-remove: clones stay');
	});

	await check('Ex2: add clones next to pre-rendered fields (input and textarea)', async () => {
		await load();
		await onForm(EX2, form => form.lnTranslations.addLanguage('de'));
		const n = await names(EX2);
		assert(n.includes('trans[de][title]') && n.includes('trans[de][description]'), 'trans[de][title] and trans[de][description] created');
		assert(n.includes('trans[en][title]') && n.includes('trans[en][description]'), 'pre-rendered trans[en][*] kept');
		const tags = await onForm(EX2, form => [form.querySelector('[name="trans[de][title]"]').tagName, form.querySelector('[name="trans[de][description]"]').tagName]);
		assert(same(tags, ['INPUT', 'TEXTAREA']), 'clone element types mirror the originals');
		await onForm(EX2, form => form.lnTranslations.removeLanguage('de'));
		assert(!(await names(EX2)).some(x => x.startsWith('trans[de]')), 'remove deletes the de clones');
		assert((await names(EX2)).includes('trans[en][title]'), 'pre-rendered en field survives de removal');
	});

	await check('Ex3: nested prefix produces prefix[trans][lang][field] names', async () => {
		await load();
		await onForm(EX3, form => form.lnTranslations.addLanguage('de'));
		const n = await names(EX3);
		for (const i of [1, 2, 3]) {
			assert(n.includes(`items[${i}][trans][de][title]`), `items[${i}][trans][de][title] created`);
		}
		assert(!n.some(x => x.startsWith('trans[de]')), 'no un-prefixed trans[de] names');
		const perItem = await onForm(EX3, form => Array.from(form.querySelectorAll('[data-ln-translatable]'))
			.map(w => Array.from(w.querySelectorAll('input')).map(i => i.name)));
		assert(same(perItem[1], ['items[2][title]', 'items[2][trans][de][title]']), 'item 2 wrapper holds its own original + clone');
		await onForm(EX3, form => form.lnTranslations.removeLanguage('de'));
		assert(same(await names(EX3), ['items[1][title]', 'items[2][title]', 'items[3][title]']), 'remove restores the original names only');
	});

	await check('Forms are independent instances', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('mk'));
		assert((await active(EX2)).length === 0 && (await active(EX3)).length === 0, 'adding on Ex1 leaves Ex2/Ex3 untouched');
		assert(!(await names(EX3)).some(x => x.includes('[mk]')), 'Ex3 has no mk names');
	});

	await check('request-add / request-remove events on the form', async () => {
		await load();
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-add', { detail: { lang: 'mk' } }));
		});
		assert(same(await active(EX1), ['mk']), 'request-add {lang:"mk"} adds mk');
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-add', { detail: {} }));
			form.dispatchEvent(new CustomEvent('ln-translations:request-add'));
		});
		assert(same(await active(EX1), ['mk']), 'request-add without detail.lang is ignored');
		await page.evaluate(() => {
			const form = document.querySelectorAll('form[data-ln-translations]')[0];
			form.dispatchEvent(new CustomEvent('ln-translations:request-remove', { detail: { lang: 'mk' } }));
		});
		assert((await active(EX1)).length === 0, 'request-remove {lang:"mk"} removes mk');
		assert(!(await names(EX1)).some(x => x.startsWith('trans[mk]')), 'mk clones gone after request-remove');
	});

	// â”€â”€â”€ [source] sections expected to expose the missing page templates â”€â”€â”€â”€â”€â”€â”€â”€â”€

	await check('[source] No "template not found" warnings for ln-translations templates', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		const missing = consoleWarnings.filter(w => w.includes('[ln-translations] Template'));
		assert(missing.length === 0, `templates ln-translations-menu-item / ln-translations-badge resolve (warnings: ${JSON.stringify(Array.from(new Set(missing)))})`);
	});

	await check('[source] Locale menu is populated from DEFAULT_LOCALES (excluding active languages)', async () => {
		await load();
		const menu = () => onForm(EX1, form => Array.from(form.querySelectorAll('#trans-menu-1 [data-ln-translations-lang]'))
			.map(b => [b.getAttribute('data-ln-translations-lang'), b.textContent]));
		assert(same(await menu(), Object.entries(LOCALES)), `menu lists de/mk with labels (got ${JSON.stringify(await menu())})`);
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		assert(same((await menu()).map(m => m[0]), ['mk']), 'after adding de the menu no longer lists de');
	});

	await check('[source] Menu item click adds the language', async () => {
		await load();
		await page.evaluate(() => {
			document.querySelector('#trans-menu-1 [data-ln-translations-lang="de"]').click();
		});
		assert(same(await active(EX1), ['de']), 'clicking the de menu item adds de');
	});

	await check('[source] Active-language badge renders, and its remove button removes the language', async () => {
		await load();
		await onForm(EX1, form => form.lnTranslations.addLanguage('de'));
		const badge = await onForm(EX1, form => {
			const p = form.querySelector('[data-ln-translations-active] [data-ln-translations-lang="de"]');
			if (!p) return null;
			return { label: p.querySelector('span').textContent, aria: p.querySelector('button').getAttribute('aria-label') };
		});
		assert(badge !== null, 'badge for de exists in [data-ln-translations-active]');
		assert(badge.label === 'Deutsch', `badge label "Deutsch" (got "${badge.label}")`);
		assert(badge.aria === 'Remove Deutsch', `remove button aria-label "Remove Deutsch" (got "${badge.aria}")`);
		await onForm(EX1, form => form.querySelector('[data-ln-translations-active] [data-ln-translations-lang="de"] button').click());
		assert((await active(EX1)).length === 0, 'clicking the badge button removes de');
	});

	
	await check('Cycle: add multiple, remove all, re-add cleanly preserves original inputs', async () => {
		await load();
		await onForm(EX1, form => {
			form.lnTranslations.addLanguage('de');
			form.lnTranslations.addLanguage('mk');
		});
		assert(same(await active(EX1), ['de', 'mk']), 'de and mk added');
		await onForm(EX1, form => {
			form.lnTranslations.removeLanguage('de');
			form.lnTranslations.removeLanguage('mk');
		});
		assert((await active(EX1)).length === 0, 'all active languages removed');
		assert(await onForm(EX1, form => !!form.querySelector('[name="scope"]')), 'original scope input preserved');
		assert(await onForm(EX1, form => !!form.querySelector('[name="address"]')), 'original address input preserved');

		// Re-add again
		await onForm(EX1, form => {
			form.lnTranslations.addLanguage('de');
			form.lnTranslations.addLanguage('mk');
		});
		assert(same(await active(EX1), ['de', 'mk']), 're-add de and mk succeeded');
		assert(await onForm(EX1, form => !!form.querySelector('[name="trans[de][scope]"]')), 'trans[de][scope] created on re-add');
		assert(await onForm(EX1, form => !!form.querySelector('[name="trans[mk][scope]"]')), 'trans[mk][scope] created on re-add');
	});

	// ── ln-fill fixture ──────────────────────────────────────────
	const FX_HTML = `
<form id="fill-fx" data-ln-form data-ln-form-action-edit="/items/:id" action="/items" method="post"
	data-ln-translations data-ln-translations-default="mk"
	data-ln-translations-locales='{"mk":"Македонски","en":"English","sq":"Shqip"}'>
	<ul data-ln-translations-active></ul>
	<button type="button" data-ln-translations-add>Add</button>
	<ul data-ln-translations-menu></ul>
	<input type="hidden" name="id" value="">
	<div class="form-element" data-ln-translatable="title"><label for="fx-title">Title</label><input type="text" id="fx-title" name="title"></div>
	<div class="form-element" data-ln-translatable="scope"><label for="fx-scope">Scope</label><textarea id="fx-scope" name="scope"></textarea></div>
	<template data-ln-template="ln-translations-menu-item"><li><button type="button" data-ln-translations-lang></button></li></template>
	<template data-ln-template="ln-translations-badge"><li><p data-ln-translations-lang><span></span><button type="button" aria-label="Remove"></button></p></li></template>
</form>
<button type="button" id="fill-trigger" data-ln-fill-form="fill-fx" data-ln-fill-id="7"
	data-ln-fill-title="T-mk" data-ln-fill-scope="S-mk"
	data-ln-fill-trans='{"en":{"title":"T-en","scope":"S-en"}}'>Edit</button>`;

	// Replaces any previous fixture; waits for both component instances (auto-init via MutationObserver).
	const mountFx = async () => {
		await page.evaluate(html => {
			document.getElementById('fill-fx')?.remove();
			document.getElementById('fill-trigger')?.remove();
			document.body.insertAdjacentHTML('beforeend', html);
		}, FX_HTML);
		await page.waitForFunction(() => {
			const f = document.getElementById('fill-fx');
			return f && f.lnTranslations && f.lnForm;
		}, { timeout: 5000 });
	};

	const fill = record => page.evaluate(r => window.lnCore.lnFill(document.getElementById('fill-fx'), r), record);

	const snap = () => page.evaluate(() => {
		const f = document.getElementById('fill-fx');
		const count = {};
		f.querySelectorAll('[data-ln-translatable-lang]').forEach(el => {
			const l = el.getAttribute('data-ln-translatable-lang');
			count[l] = (count[l] || 0) + 1;
		});
		const langs = sel => Array.from(f.querySelectorAll(sel)).map(b => b.getAttribute('data-ln-translations-lang'));
		const values = {};
		f.querySelectorAll('input[type="text"], textarea').forEach(el => { values[el.name] = el.value; });
		const method = f.querySelector('[name="_method"]');
		return {
			count,
			active: Array.from(f.lnTranslations.getActiveLanguages()).sort(),
			badges: langs('[data-ln-translations-active] [data-ln-translations-lang]'),
			menu: langs('[data-ln-translations-menu] [data-ln-translations-lang]'),
			triggerHidden: f.querySelector('[data-ln-translations-add]').hidden,
			values,
			action: f.getAttribute('action'),
			method: method ? method.value : null
		};
	});

	const AB = { id: 1, title: 'T-mk', scope: 'S-mk', trans: { en: { title: 'T-en', scope: 'S-en' }, sq: { title: 'T-sq', scope: 'S-sq' } } };

	await check('ln-fill: fixture mounts', async () => {
		await load();
		await mountFx();
		assert(await page.evaluate(() => window.lnFill === true), 'window.lnFill is true');
		assert(await page.evaluate(() => typeof window.lnCore.lnFill === 'function'), 'lnCore.lnFill is a function');
		const s = await snap();
		assert(same(s.count, { mk: 2 }), `originals flagged mk (got ${JSON.stringify(s.count)})`);
		assert(same(s.active, []), 'no active languages');
		assert(same(s.menu, ['en', 'sq']), `menu en, sq (got ${JSON.stringify(s.menu)})`);
		assert(s.triggerHidden === false, 'add trigger visible');
	});

	await check('ln-fill: record with trans object (en + sq)', async () => {
		await mountFx();
		await fill(AB);
		const s = await snap();
		assert(same(s.count, { mk: 2, en: 2, sq: 2 }), `count (got ${JSON.stringify(s.count)})`);
		assert(same(s.active, ['en', 'sq']), 'active en, sq');
		assert(same(s.badges.slice().sort(), ['en', 'sq']), 'badges en and sq');
		assert(same(s.menu, []), 'menu empty');
		assert(s.triggerHidden === true, 'add trigger hidden');
		assert(s.values.title === 'T-mk' && s.values.scope === 'S-mk', 'base fields filled');
		assert(s.values['trans[en][title]'] === 'T-en' && s.values['trans[en][scope]'] === 'S-en', 'en values');
		assert(s.values['trans[sq][title]'] === 'T-sq' && s.values['trans[sq][scope]'] === 'S-sq', 'sq values');
	});

	await check('ln-fill: second fill with fewer languages removes the rest silently', async () => {
		await mountFx();
		await recordEvents();
		await fill(AB);
		await page.evaluate(() => { window.__tev = []; });
		await fill({ id: 2, title: 'T2', scope: 'S2', trans: { en: { title: 'T2-en' } } });
		const s = await snap();
		assert(same(s.count, { mk: 2, en: 2 }), `count (got ${JSON.stringify(s.count)})`);
		assert(same(s.active, ['en']), 'active en');
		assert(same(s.badges, ['en']), 'badges en');
		assert(same(s.menu, ['sq']), 'menu sq');
		assert(s.triggerHidden === false, 'add trigger visible');
		assert(s.values['trans[en][title]'] === 'T2-en', 'en title');
		assert(s.values['trans[en][scope]'] === '', 'en scope empty');
		assert(!Object.keys(s.values).some(k => k.startsWith('trans[sq]')), 'no sq fields');
		assert(s.values.title === 'T2', 'base title');
		const ev = await events();
		assert(ev.filter(e => e.type === 'ln-translations:before-remove').length === 0, 'no before-remove');
		assert(ev.filter(e => e.type === 'ln-translations:removed').length === 0, 'no removed');
		assert(ev.filter(e => e.type === 'ln-translations:added' && e.lang === 'en').length === 1, 'exactly one added for en');
	});

	await check('ln-fill: null after a record clears languages, keeps originals', async () => {
		await mountFx();
		await fill(AB);
		await fill(null);
		const s = await snap();
		assert(same(s.count, { mk: 2 }), `count (got ${JSON.stringify(s.count)})`);
		assert(same(s.active, []), 'active empty');
		assert(same(s.badges, []), 'badges empty');
		assert(same(s.menu, ['en', 'sq']), 'menu en, sq');
		assert(s.triggerHidden === false, 'add trigger visible');
		assert(same(Object.keys(s.values).sort(), ['scope', 'title']), `value keys (got ${Object.keys(s.values)})`);
		assert(s.values.title === '' && s.values.scope === '', 'originals reset');
		assert(s.action === '/items' && s.method === '', `action/method (got ${s.action} / ${s.method})`);
	});

	await check('ln-fill: repeated fills never duplicate inputs/badges', async () => {
		await mountFx();
		const A = { id: 1, title: 'a', scope: 'a', trans: { en: { title: 'e' }, sq: { title: 's' } } };
		const B = { id: 1, title: 'b', scope: 'b', trans: { sq: { title: 's' } } };
		const C = { id: 1, title: 'c', scope: 'c', trans: { en: { title: 'e' } } };
		const D = { id: 1, title: 'd', scope: 'd' };
		const seq = [[A, ['en', 'sq']], [B, ['sq']], [C, ['en']], [D, []], [A, ['en', 'sq']]];
		for (let i = 0; i < seq.length; i++) {
			const [rec, exp] = seq[i];
			await fill(rec);
			const s = await snap();
			assert(same(s.active, exp), `step ${i}: active (got ${JSON.stringify(s.active)})`);
			for (const l of Object.keys(s.count)) {
				assert(s.count[l] === 2, `step ${i}: ${l} has ${s.count[l]} elements`);
				assert(l === 'mk' || exp.includes(l), `step ${i}: unexpected language ${l}`);
			}
			assert(s.badges.length === exp.length, `step ${i}: badges ${s.badges.length}`);
			assert(same(s.menu, ['en', 'sq'].filter(l => !exp.includes(l))), `step ${i}: menu (got ${JSON.stringify(s.menu)})`);
		}
	});

	await check('ln-fill: trans as JSON string via lnFill', async () => {
		await mountFx();
		await fill({ id: 3, title: 'T', scope: 'S', trans: JSON.stringify({ sq: { title: 'T-sq' } }) });
		const s = await snap();
		assert(same(s.active, ['sq']), 'active sq');
		assert(s.values['trans[sq][title]'] === 'T-sq', 'sq title');
		assert(s.values['trans[sq][scope]'] === '', 'sq scope empty');
	});

	await check('ln-fill: real data-ln-fill-form click trigger with data-ln-fill-trans', async () => {
		await mountFx();
		await page.evaluate(() => document.getElementById('fill-trigger').click());
		const s = await snap();
		assert(same(s.active, ['en']), `active (got ${JSON.stringify(s.active)})`);
		assert(s.values.title === 'T-mk', 'base title');
		assert(s.values['trans[en][title]'] === 'T-en', 'en title');
		assert(s.values['trans[en][scope]'] === 'S-en', 'en scope');
		assert(s.action === '/items/7', `action (got ${s.action})`);
		assert(s.method === 'PUT', `method (got ${s.method})`);
	});

	await check('ln-fill: invalid JSON string in trans', async () => {
		await mountFx();
		consoleWarnings.length = 0;
		await fill(AB);
		await fill({ id: 4, title: 'T4', scope: 'S4', trans: '{not json' });
		const s = await snap();
		assert(same(s.active, []), 'active empty');
		assert(same(s.count, { mk: 2 }), 'count mk only');
		assert(same(s.menu, ['en', 'sq']), 'menu en, sq');
		assert(same(s.badges, []), 'badges empty');
		assert(s.values.title === 'T4', 'base title still filled by ln-form');
		assert(s.action === '/items/4', `action (got ${s.action})`);
		assert(consoleWarnings.filter(w => w.includes('[ln-translations]')).length === 0, 'no [ln-translations] warnings');
		await fill(AB);
		await fill({ id: 4, title: 'T4', scope: 'S4', trans: 'x' });
		assert(same((await snap()).active, []), 'string "x" activates nothing');
		await fill(AB);
		await fill({ id: 4, title: 'T4', scope: 'S4', trans: ['en'] });
		assert(same((await snap()).active, []), 'array activates nothing');
	});

	await check('ln-fill: trans containing the default language is not added as a dynamic language', async () => {
		await mountFx();
		await fill({ id: 5, title: 'T-mk', scope: 'S-mk', trans: { mk: { title: 'X' }, en: { title: 'T-en' } } });
		const s = await snap();
		assert(same(s.active, ['en']), 'active en only');
		assert(same(s.count, { mk: 2, en: 2 }), `count (got ${JSON.stringify(s.count)})`);
		assert(s.values.title === 'T-mk', 'base title not overwritten');
		assert(!Object.keys(s.values).some(k => k.startsWith('trans[mk]')), 'no trans[mk] keys');
	});

	await check('ln-fill: base fields and ln-form action mode unchanged', async () => {
		await mountFx();
		const hiddenId = () => page.evaluate(() => document.querySelector('#fill-fx [name="id"]').value);
		await fill({ id: 9, title: 'A', scope: 'B', trans: { en: { title: 'E' } } });
		let s = await snap();
		assert(s.action === '/items/9' && s.method === 'PUT', `action/method (got ${s.action} / ${s.method})`);
		assert(s.values.title === 'A' && s.values.scope === 'B', 'base values');
		assert(await hiddenId() === '9', 'hidden id 9');
		await fill(null);
		s = await snap();
		assert(s.action === '/items' && s.method === '', `reset action/method (got ${s.action} / ${s.method})`);
		assert(await hiddenId() === '', 'hidden id reset');
		assert(s.values.title === '', 'title reset');
	});

	await check('ln-fill: destroy detaches the listener', async () => {
		await mountFx();
		await fill({ id: 6, title: 'a', scope: 'b', trans: { en: { title: 'E' } } });
		await page.evaluate(() => document.getElementById('fill-fx').lnTranslations.destroy());
		await fill({ trans: { sq: { title: 'Z' } } });
		assert(await page.evaluate(() => document.querySelectorAll('#fill-fx [data-ln-translatable-lang="sq"]').length) === 0, 'no sq fields after destroy');
	});

	await check('destroy preserves SSR translation fields and authored hidden trigger state', async () => {
		await page.evaluate(() => {
			document.getElementById('ssr-destroy-fx')?.remove();
			document.body.insertAdjacentHTML('beforeend', `
				<form id="ssr-destroy-fx" data-ln-translations data-ln-translations-default="en"
					data-ln-translations-locales='{"en":"English","de":"Deutsch","sq":"Shqip"}'>
					<ul data-ln-translations-active></ul>
					<button type="button" data-ln-translations-add hidden>Add</button>
					<ul data-ln-translations-menu></ul>
					<div class="form-element" data-ln-translatable="title">
						<input type="text" name="title" value="Base">
						<input type="text" name="trans[de][title]" data-ln-translatable-lang="de" value="SSR Deutsch">
					</div>
					<template data-ln-template="ln-translations-menu-item"><li><button type="button" data-ln-translations-lang></button></li></template>
					<template data-ln-template="ln-translations-badge"><li><p data-ln-translations-lang><span></span><button type="button" aria-label="Remove"></button></p></li></template>
				</form>
			`);
		});
		await page.waitForFunction(() => !!document.getElementById('ssr-destroy-fx')?.lnTranslations, { timeout: 5000 });
		await page.evaluate(() => {
			const form = document.getElementById('ssr-destroy-fx');
			form.lnTranslations.addLanguage('sq', { title: 'Dynamic Shqip' });
			form.lnTranslations.destroy();
		});
		const state = await page.evaluate(() => {
			const form = document.getElementById('ssr-destroy-fx');
			const base = form.querySelector('[name="title"]');
			const ssr = form.querySelector('[name="trans[de][title]"]');
			const dyn = form.querySelector('[name="trans[sq][title]"]');
			const trigger = form.querySelector('[data-ln-translations-add]');
			const res = {
				hasInstance: !!form.lnTranslations,
				baseHasLang: base.hasAttribute('data-ln-translatable-lang'),
				ssrExists: !!ssr,
				ssrValue: ssr ? ssr.value : null,
				dynExists: !!dyn,
				triggerHidden: trigger.hidden
			};
			form.remove();
			return res;
		});
		assert(state.hasInstance === false, 'instance deleted on destroy');
		assert(state.baseHasLang === false, 'auto-tagged defaultLang removed from original input');
		assert(state.ssrExists === true && state.ssrValue === 'SSR Deutsch', 'SSR translation field preserved on destroy');
		assert(state.dynExists === false, 'dynamically cloned sq field removed on destroy');
		assert(state.triggerHidden === true, 'initial authored hidden state on add trigger preserved');
	});

	await page.evaluate(() => { document.getElementById('fill-fx')?.remove(); document.getElementById('fill-trigger')?.remove(); });

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
