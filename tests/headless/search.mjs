import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/search.html (live demos) and
// components/ln-search/src/ln-search.js + components/ln-core/{matching,hash}.js.
// The shell sidebar has its own search control, so every selector is scoped to the
// demo's own ids.

const PAGE_URL = BASE_URL + 'search.html';

const TARGETS = ['demo-list', 'demo-teams', 'demo-custom', 'demo-icon-grid', 'demo-server-target', 'demo-prefilled', 'demo-hash-list'];

const COUNTRIES = [
	'Argentina', 'Australia', 'Brazil', 'Canada', 'Denmark', 'Egypt', 'France', 'Germany', 'India', 'Japan', 'Kenya',
	'Mexico', 'Netherlands', 'Norway', 'Poland', 'Singapore', 'Spain', 'Sweden', 'United Kingdom', 'United States',
	'\u{1F30D} World Directory (Pinned / Exempt)'
];
const EXEMPT = '\u{1F30D} World Directory (Pinned / Exempt)';
const TEAMS = ['Engineering', 'Design', 'Marketing', 'Sales', 'Support', 'Finance', 'Legal', 'HR'];
const ICONS = [
	'home', 'arrow-left', 'arrow-right', 'menu', 'plus', 'trash', 'edit', 'copy', 'check', 'x', 'alert-triangle', 'info-circle'
];
const TECHS = ['JavaScript (ES2026)', 'TypeScript', 'React & Next.js', 'Vue & Nuxt', 'Svelte & SvelteKit'];
const HASH_NS = 'demo-hash-list-search';

const same = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);

run('demo/admin/search.html', async ({ page }) => {

	const failures = [];

	// ─── Page helpers ──────────────────────────────────────────

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  [section failed] ${err.message}`);
		}
	}

	const inputSel = id => `input[data-ln-search-for="${id}"]`;

	async function ready() {
		await page.waitForFunction(targets => targets.every(id => {
			const target = document.getElementById(id);
			if (!target || !target.lnSearch) return false;
			const input = document.querySelector('input[data-ln-search-for="' + id + '"]');
			return !!input && !!input.lnSearchControl;
		}), { timeout: 10000 }, TARGETS);
	}

	// Fresh, state-free page: stored/hash state from a previous section must not leak in.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	// Visible items (computed display) mapped through label(text).
	const visible = (itemSel, sep) => page.evaluate((s, sp) => Array.from(document.querySelectorAll(s))
		.filter(el => getComputedStyle(el).display !== 'none')
		.map(el => {
			const t = el.textContent.trim();
			return sp ? t.split(sp)[0] : t;
		}), itemSel, sep || null);

	async function expectVisible(itemSel, sep, expected, label) {
		await page.waitForFunction((s, sp, exp) => {
			const got = Array.from(document.querySelectorAll(s))
				.filter(el => getComputedStyle(el).display !== 'none')
				.map(el => {
					const t = el.textContent.trim();
					return sp ? t.split(sp)[0] : t;
				});
			return got.length === exp.length && got.every((v, i) => v === exp[i]);
		}, { timeout: 5000 }, itemSel, sep, expected).catch(() => {});
		const actual = await visible(itemSel, sep);
		assert(same(actual, expected), `${label}: expected [${expected.join(' | ')}], got [${actual.join(' | ')}]`);
	}

	async function typeInto(id, text) {
		await page.focus(inputSel(id));
		await page.keyboard.type(text);
	}

	// Select-all + Backspace fires a real 'input' event with an empty value.
	async function eraseInput(id) {
		await page.focus(inputSel(id));
		await page.keyboard.down('Control');
		await page.keyboard.press('KeyA');
		await page.keyboard.up('Control');
		await page.keyboard.press('Backspace');
	}

	const state = id => page.evaluate(sel => {
		const input = document.querySelector('input[data-ln-search-for="' + sel + '"]');
		return { input: input.value, attr: document.getElementById(sel).getAttribute('data-ln-search') };
	}, id);

	async function expectState(id, term, label) {
		await page.waitForFunction((i, t) => {
			const input = document.querySelector('input[data-ln-search-for="' + i + '"]');
			return input.value === t && document.getElementById(i).getAttribute('data-ln-search') === t;
		}, { timeout: 5000 }, id, term).catch(() => {});
		const s = await state(id);
		assert(s.input === term && s.attr === term, `${label}: input="${s.input}" attr="${s.attr}" expected "${term}"`);
	}

	const clickClear = id => page.evaluate(sel => {
		const input = document.querySelector('input[data-ln-search-for="' + sel + '"]');
		input.closest('search').querySelector('button[data-ln-search-clear]').click();
	}, id);

	const hiddenAttrCount = itemSel => page.evaluate(s => document.querySelectorAll(s + '[data-ln-search-hide="true"]').length, itemSel);

	// Records every ln-search:change on a target into window.__events.
	const recordEvents = id => page.evaluate(i => {
		window.__events = [];
		document.getElementById(i).addEventListener('ln-search:change', e => {
			window.__events.push({
				term: e.detail.term,
				tokens: e.detail.tokens,
				targetId: e.detail.targetId,
				fields: e.detail.fields,
				bubbles: e.bubbles,
				cancelable: e.cancelable
			});
		});
	}, id);

	const events = () => page.evaluate(() => window.__events);

	// ─── 1. Filter a list ──────────────────────────────────────

	await section('Filter a list (demo-list)', async () => {
		await load();
		await expectVisible('#demo-list > li', null, COUNTRIES, 'initial: all 21 items visible');

		await recordEvents('demo-list');
		await typeInto('demo-list', 'u k');
		await expectVisible('#demo-list > li', null, ['United Kingdom', EXEMPT], 'tokenized AND "u k"');
		assert(await hiddenAttrCount('#demo-list > li') === 19, 'non-matching items carry data-ln-search-hide="true" (19)');
		await expectState('demo-list', 'u k', 'input and target attribute hold the term');

		const ev = await events();
		const last = ev[ev.length - 1];
		assert(last && last.term === 'u k' && same(last.tokens, ['u', 'k']), 'ln-search:change detail term/tokens for "u k"');
		assert(last.targetId === 'demo-list' && last.fields === null, 'detail.targetId is the target id and detail.fields is null');
		assert(last.bubbles === true && last.cancelable === true, 'ln-search:change bubbles and is cancelable');

		await eraseInput('demo-list');
		await typeInto('demo-list', 'unit stat');
		await expectVisible('#demo-list > li', null, ['United States', EXEMPT], 'tokenized AND "unit stat"');

		await eraseInput('demo-list');
		await typeInto('demo-list', 'kingdom united');
		await expectVisible('#demo-list > li', null, ['United Kingdom', EXEMPT], 'order-independent "kingdom united"');

		await eraseInput('demo-list');
		await typeInto('demo-list', '  UNIT   Stat ');
		await expectVisible('#demo-list > li', null, ['United States', EXEMPT], 'case-insensitive, whitespace-tolerant');
		const ev2 = await events();
		const last2 = ev2[ev2.length - 1];
		assert(last2.term === 'unit   stat' && same(last2.tokens, ['unit', 'stat']), `detail.term is lowercased+trimmed, tokens split on whitespace (got "${last2.term}")`);

		await eraseInput('demo-list');
		await typeInto('demo-list', 'zzzz');
		await expectVisible('#demo-list > li', null, [EXEMPT], 'no match: only the exempt item stays visible');

		await eraseInput('demo-list');
		await expectVisible('#demo-list > li', null, COUNTRIES, 'erasing the input restores all items');
		assert(await hiddenAttrCount('#demo-list > li') === 0, 'no data-ln-search-hide left after erase');
	});

	await section('Clear button (demo-list)', async () => {
		await load();
		await typeInto('demo-list', 'brazil');
		await expectVisible('#demo-list > li', null, ['Brazil', EXEMPT], 'filtered to "brazil"');
		await clickClear('demo-list');
		await expectVisible('#demo-list > li', null, COUNTRIES, 'clear restores all items');
		await expectState('demo-list', '', 'clear empties input and resets target attribute');
		const focused = await page.evaluate(() => document.activeElement === document.querySelector('input[data-ln-search-for="demo-list"]'));
		assert(focused, 'clear button refocuses the input');
	});

	await section('Attribute bridge (set data-ln-search on the target)', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-list').setAttribute('data-ln-search', 'argentina'));
		await expectVisible('#demo-list > li', null, ['Argentina', EXEMPT], 'writing the attribute filters the list');
		await expectState('demo-list', 'argentina', 'input value is reverse-synced from the attribute');
		const term = await page.evaluate(() => document.getElementById('demo-list').lnSearch.term);
		assert(term === 'argentina', 'target.lnSearch.term reflects the attribute');
		const targetId = await page.evaluate(() => document.querySelector('input[data-ln-search-for="demo-list"]').lnSearchControl.targetId);
		assert(targetId === 'demo-list', 'input.lnSearchControl.targetId === "demo-list"');
	});

	// ─── 2. Input directly, no wrapper ─────────────────────────

	await section('Directly on the input (demo-teams)', async () => {
		await load();
		await expectVisible('#demo-teams > li', ' — ', TEAMS, 'initial: all 8 teams visible');
		await typeInto('demo-teams', 'manages');
		await expectVisible('#demo-teams > li', ' — ', ['Finance', 'HR'], '"manages" matches Finance and HR');
		await eraseInput('demo-teams');
		await typeInto('demo-teams', 'product');
		await expectVisible('#demo-teams > li', ' — ', ['Engineering', 'Marketing'], '"product" matches Engineering and Marketing');
		await eraseInput('demo-teams');
		await typeInto('demo-teams', 'nothing-like-this');
		await expectVisible('#demo-teams > li', ' — ', [], 'no match hides every team');
		await eraseInput('demo-teams');
		await expectVisible('#demo-teams > li', ' — ', TEAMS, 'erase restores all teams');
	});

	// ─── 3. Custom handler with preventDefault ─────────────────

	await section('Custom handler with preventDefault (demo-custom)', async () => {
		await load();
		const result = () => page.evaluate(() => document.getElementById('demo-custom-result').textContent);
		const waitResult = async text => {
			await page.waitForFunction(t => document.getElementById('demo-custom-result').textContent === t, { timeout: 5000 }, text).catch(() => {});
		};

		assert(await result() === 'Type to search...', 'initial counter text is "Type to search..."');

		await typeInto('demo-custom', 'e');
		await waitResult('4 of 5 matches');
		assert(await result() === '4 of 5 matches', `"e" -> "4 of 5 matches" (got "${await result()}")`);

		await eraseInput('demo-custom');
		await typeInto('demo-custom', 'framework');
		await waitResult('1 of 5 match');
		assert(await result() === '1 of 5 match', `"framework" -> singular "1 of 5 match" (got "${await result()}")`);

		await eraseInput('demo-custom');
		await typeInto('demo-custom', 'zzz');
		await waitResult('No results for "zzz"');
		assert(await result() === 'No results for "zzz"', `"zzz" -> no-results text (got "${await result()}")`);

		assert(await expectNoHide() === 0, 'preventDefault disables default hiding: no data-ln-search-hide on any item');
		const allVisible = await visible('#demo-custom > li', null);
		assert(allVisible.length === 5, 'all 5 items stay visible while the handler owns the response');

		await eraseInput('demo-custom');
		await waitResult('Type to search...');
		assert(await result() === 'Type to search...', 'erasing resets the counter text');

		function expectNoHide() {
			return hiddenAttrCount('#demo-custom > li');
		}
	});

	// ─── 4. Deep targeting + subtree exclusion ─────────────────

	await section('Deep targeting data-ln-search-items (demo-icon-grid)', async () => {
		await load();
		const sel = '#demo-icon-grid .icon-cell';
		const itemsAttr = await page.evaluate(() => document.getElementById('demo-icon-grid').getAttribute('data-ln-search-items'));
		assert(itemsAttr === '.icon-cell', 'target carries data-ln-search-items=".icon-cell"');
		await expectVisible(sel, ' — ', ICONS, 'initial: all 12 cells visible');

		await typeInto('demo-icon-grid', 'nav');
		await expectVisible(sel, ' — ', ['menu'], '"nav" matches only the nested "menu" cell');
		const sectionsVisible = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-icon-grid > section'))
			.every(s => getComputedStyle(s).display !== 'none'));
		assert(sectionsVisible, 'category sections themselves are never hidden (only .icon-cell items)');

		await eraseInput('demo-icon-grid');
		await typeInto('demo-icon-grid', 'add');
		await expectVisible(sel, ' — ', ['plus'], '"add" matches only "plus"');

		await eraseInput('demo-icon-grid');
		await typeInto('demo-icon-grid', 'go home');
		await expectVisible(sel, ' — ', ['home'], '"go home" matches the home cell');

		await eraseInput('demo-icon-grid');
		await typeInto('demo-icon-grid', 'ignored');
		await expectVisible(sel, ' — ', [], '"ignored" (text inside data-ln-search-exclude) matches nothing');

		await eraseInput('demo-icon-grid');
		await expectVisible(sel, ' — ', ICONS, 'erase restores all cells');
	});

	// ─── 5. Server-search simulation ───────────────────────────

	await section('Server-search simulation (demo-server-target)', async () => {
		await load();
		const log = () => page.evaluate(() => document.getElementById('demo-server-log').textContent);
		const waitLog = (lines, firstPart) => page.waitForFunction((n, part) => {
			const t = document.getElementById('demo-server-log').textContent;
			const l = t.split('\n');
			return l.length === n && l[0].indexOf(part) !== -1;
		}, { timeout: 5000 }, lines, firstPart).catch(() => {});

		assert(await log() === 'Type to see dispatched search events...', 'initial log text is the placeholder');

		await typeInto('demo-server-target', 'ab');
		await waitLog(2, '"ab"');
		let lines = (await log()).split('\n');
		assert(lines.length === 2, `two events logged for two keystrokes (got ${lines.length})`);
		assert(/dispatch → "ab"$/.test(lines[0]) && /dispatch → "a"$/.test(lines[1]), `newest entry first: [${lines.join(' || ')}]`);

		await typeInto('demo-server-target', 'cdefghij');
		await waitLog(8, '"abcdefghij"');
		lines = (await log()).split('\n');
		assert(lines.length === 8, `log is capped at 8 entries (got ${lines.length})`);
		assert(/dispatch → "abcdefghij"$/.test(lines[0]), 'newest entry is the full term');

		await eraseInput('demo-server-target');
		await waitLog(8, '(empty — search cleared)');
		lines = (await log()).split('\n');
		assert(/dispatch → \(empty — search cleared\)$/.test(lines[0]), `clearing logs the empty-term entry (got "${lines[0]}")`);

		const hiddenOut = await page.evaluate(() => document.getElementById('demo-server-target').hasAttribute('hidden'));
		assert(hiddenOut, 'the <output> target stays hidden (handler owns the response)');
	});

	// ─── 6. Pre-filled input ───────────────────────────────────

	await section('Pre-filled input boot seeding (demo-prefilled)', async () => {
		await load();
		await expectVisible('#demo-prefilled > li', null, ['France'], 'value="france" filters the list at boot');
		await expectState('demo-prefilled', 'france', 'target attribute seeded from the input value');
		await eraseInput('demo-prefilled');
		await expectVisible('#demo-prefilled > li', null, ['Argentina', 'Brazil', 'Canada', 'France', 'Germany', 'Japan'], 'erasing restores all 6 countries');
	});

	// ─── 7. URL hash synchronization ───────────────────────────

	const hash = () => page.evaluate(() => location.hash);
	const waitHash = value => page.waitForFunction(v => location.hash === v, { timeout: 5000 }, value).catch(() => {});

	await section('Hash sync: input -> URL (data-ln-hash)', async () => {
		await load();
		assert(await hash() === '', 'no hash after a fresh load');
		await typeInto('demo-hash-list', 'react');
		await waitHash('#' + HASH_NS + ':react');
		assert(await hash() === '#' + HASH_NS + ':react', `hash is "#${HASH_NS}:react" (got "${await hash()}")`);
		await expectVisible('#demo-hash-list > li', null, ['React & Next.js'], '"react" filters the list');

		await eraseInput('demo-hash-list');
		await typeInto('demo-hash-list', 'script');
		await expectVisible('#demo-hash-list > li', null, ['JavaScript (ES2026)', 'TypeScript'], '"script" matches JavaScript and TypeScript');
		await waitHash('#' + HASH_NS + ':script');
		assert(await hash() === '#' + HASH_NS + ':script', 'hash follows the term');

		await clickClear('demo-hash-list');
		await expectVisible('#demo-hash-list > li', null, TECHS, 'clear restores all 5 items');
		await waitHash('');
		assert(await hash() === '', `clearing removes the hash segment (got "${await hash()}")`);
	});

	await section('Hash sync: URL -> input (hashchange + boot seeding)', async () => {
		await load();
		await page.evaluate(ns => { location.hash = ns + ':svelte'; }, HASH_NS);
		await expectVisible('#demo-hash-list > li', null, ['Svelte & SvelteKit'], 'hashchange drives the target');
		await expectState('demo-hash-list', 'svelte', 'input value is synced from the hash');

		await page.evaluate(() => { location.hash = ''; });
		await expectVisible('#demo-hash-list > li', null, TECHS, 'removing the hash segment clears the search');

		await page.evaluate(ns => { location.hash = ns + ':vue'; }, HASH_NS);
		await expectVisible('#demo-hash-list > li', null, ['Vue & Nuxt'], 'hash "vue" filters');
		await page.reload({ waitUntil: 'load' });
		await ready();
		await expectVisible('#demo-hash-list > li', null, ['Vue & Nuxt'], 'deep link: reload with hash seeds the search at boot');
		await expectState('demo-hash-list', 'vue', 'deep link: input and attribute seeded from the hash');
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
