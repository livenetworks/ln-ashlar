import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/time.html (live demos) and the
// components it mounts: components/ln-time/src/ln-time.js, time-model.js and
// ln-core date.js / locale.js.
//
// Determinism: the page computes NOW = Date.now() and ln-time reads Date.now() for relative
// output. A document-start shim freezes Date.now()/new Date() at FIXED_MS, so every offset in
// the demo (30 sec, 3 hr, 5 days ...) is exact. The shim also records 60000ms setInterval
// callbacks so the single ln-time ticker can be fired by hand after the frozen clock moves.
// Expected strings come from the native Intl APIs (the contract ln-time delegates to), fed
// with value/unit pairs derived from the thresholds in time-model.js.

const PAGE_URL = BASE_URL + 'time.html';
const FIXED_MS = Date.UTC(2026, 5, 15, 12, 0, 0);
const FIXED_S = FIXED_MS / 1000;

const COUNTS = { modes: 5, relative: 7, future: 5, locale: 8 };

const failures = [];

function installShim(fixedMs) {
	const RealDate = Date;
	window.__now = fixedMs;
	class FakeDate extends RealDate {
		constructor(...args) {
			if (args.length === 0) super(window.__now);
			else super(...args);
		}
		static now() { return window.__now; }
	}
	window.Date = FakeDate;

	window.__tickers = [];
	const realSetInterval = window.setInterval.bind(window);
	window.setInterval = function (fn, ms, ...rest) {
		if (ms === 60000) window.__tickers.push(fn);
		return realSetInterval(fn, ms, ...rest);
	};

	const relFmt = loc => new Intl.RelativeTimeFormat(loc, { numeric: 'auto', style: 'narrow' });
	window.__exp = {
		rel: (loc, v, u) => relFmt(loc).format(v, u),
		full: (loc, ms) => new Intl.DateTimeFormat(loc, { dateStyle: 'long', timeStyle: 'short' }).format(new RealDate(ms)),
		date: (loc, ms) => new Intl.DateTimeFormat(loc, { dateStyle: 'medium' }).format(new RealDate(ms)),
		time: (loc, ms) => new Intl.DateTimeFormat(loc, { timeStyle: 'short' }).format(new RealDate(ms)),
		short: (loc, ms, year) => {
			const o = { month: 'short', day: 'numeric' };
			if (year) o.year = 'numeric';
			return new Intl.DateTimeFormat(loc, o).format(new RealDate(ms));
		}
	};
}

run('demo/admin/time.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated: a failing assertion is recorded, the other sections still run.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	await page.evaluateOnNewDocument(installShim, FIXED_MS);

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction((counts) => {
			const tables = {
				'demo-modes-table': counts.modes,
				'demo-relative-table': counts.relative,
				'demo-future-table': counts.future,
				'demo-locale-table': counts.locale
			};
			for (const id in tables) {
				const times = document.querySelectorAll('#' + id + ' time[data-ln-time]');
				if (times.length !== tables[id]) return false;
				if (!Array.from(times).every(t => t.lnTime && t.textContent !== 'loading…')) return false;
			}
			const reactive = document.getElementById('demo-reactive');
			return !!(reactive && reactive.lnTime && reactive.textContent !== 'loading...');
		}, { timeout: 10000 }, COUNTS);
	}

	// Returns [{ text, title, hasTitle, datetime, mode, locale }] for every <time> in a container.
	const timesIn = selector => page.evaluate(sel => Array.from(document.querySelectorAll(sel + ' time')).map(t => ({
		text: t.textContent,
		title: t.title,
		hasTitle: t.hasAttribute('title'),
		datetime: t.getAttribute('datetime'),
		mode: t.getAttribute('data-ln-time'),
		locale: t.getAttribute('data-ln-time-locale')
	})), selector);

	const exp = (fn, ...args) => page.evaluate((f, a) => window.__exp[f](...a), fn, args);

	const textOf = selector => page.evaluate(sel => document.querySelector(sel).textContent, selector);

	async function waitText(selector, expected) {
		await page.waitForFunction((sel, text) => document.querySelector(sel).textContent === text,
			{ timeout: 5000 }, selector, expected).catch(() => {});
		return textOf(selector);
	}

	await load();

	// ─── Modes: one timestamp (NOW - 3h), five modes ───────────

	await check('All Modes - same timestamp', async () => {
		const ts = FIXED_S - 3 * 3600;
		const ms = ts * 1000;
		const times = await timesIn('#demo-modes-table');
		assert(times.length === 5, `5 time elements in modes table, got ${times.length}`);
		assert(times.every(t => t.datetime === String(ts)), `all five share datetime=${ts}`);
		assert(times.map(t => t.mode).join(',') === 'relative,short,full,date,time', 'modes are relative,short,full,date,time');

		const [relative, short, full, date, time] = times;
		assert(relative.text === await exp('rel', 'en', -3, 'hour'), `relative: "${relative.text}" is Intl narrow -3 hour`);
		assert(/3/.test(relative.text) && /ago/.test(relative.text), `relative reads as "3 ... ago" (got "${relative.text}")`);
		assert(short.text === await exp('short', 'en', ms, false), `short: "${short.text}" is month+day, no year (same year as NOW)`);
		assert(full.text === await exp('full', 'en', ms), `full: "${full.text}" is dateStyle long + timeStyle short`);
		assert(date.text === await exp('date', 'en', ms), `date: "${date.text}" is dateStyle medium`);
		assert(time.text === await exp('time', 'en', ms), `time: "${time.text}" is timeStyle short`);

		assert(!full.hasTitle, 'full mode does not set a title tooltip');
		for (const [name, t] of [['relative', relative], ['short', short], ['date', date], ['time', time]]) {
			assert(t.title === full.text, `${name} mode title tooltip equals the full format ("${t.title}")`);
		}
	});

	// ─── Relative thresholds ───────────────────────────────────

	await check('Relative Time - thresholds', async () => {
		const times = await timesIn('#demo-relative-table');
		assert(times.length === 7, `7 rows, got ${times.length}`);
		// [datetime offset seconds, Intl value, unit]: from calculateRelativeTime in time-model.js
		const expected = [
			[-30, -30, 'second'],
			[-300, -5, 'minute'],
			[-3600, -1, 'hour'],
			[-10800, -3, 'hour'],
			[-86400, -1, 'day'],
			[-5 * 86400, -5, 'day']
		];
		for (let i = 0; i < expected.length; i++) {
			const [offset, value, unit] = expected[i];
			assert(times[i].datetime === String(FIXED_S + offset), `row ${i + 1} datetime is NOW${offset}`);
			const want = await exp('rel', 'en', value, unit);
			assert(times[i].text === want, `row ${i + 1} (${value} ${unit}): "${times[i].text}" === "${want}"`);
		}
		// 30 days is exactly 2592000s: not < 2592000, so month branch, isOlderThanMonth -> short format
		const monthMs = (FIXED_S - 30 * 86400) * 1000;
		assert(times[6].datetime === String(FIXED_S - 30 * 86400), 'row 7 datetime is NOW-30d');
		assert(times[6].text === await exp('short', 'en', monthMs, false),
			`row 7 (1 month ago) falls back to short date: "${times[6].text}"`);
		assert(/^[A-Z][a-z]{2} \d{1,2}$/.test(times[6].text), 'row 7 is "Mon D" without a year');
		assert(times[6].title === await exp('full', 'en', monthMs), 'row 7 title tooltip is the full format');
	});

	await check('Future Timestamps', async () => {
		const times = await timesIn('#demo-future-table');
		assert(times.length === 5, `5 rows, got ${times.length}`);
		const expected = [
			[30, 30, 'second'],
			[300, 5, 'minute'],
			[3600, 1, 'hour'],
			[86400, 1, 'day'],
			[7 * 86400, 1, 'week']
		];
		for (let i = 0; i < expected.length; i++) {
			const [offset, value, unit] = expected[i];
			assert(times[i].datetime === String(FIXED_S + offset), `row ${i + 1} datetime is NOW+${offset}`);
			const want = await exp('rel', 'en', value, unit);
			assert(times[i].text === want, `row ${i + 1} (+${value} ${unit}): "${times[i].text}" === "${want}"`);
		}
		assert(times[0].text.startsWith('in '), `future output starts with "in " ("${times[0].text}")`);
	});

	// ─── Locale override ───────────────────────────────────────

	await check('Locale Override', async () => {
		const ms = (FIXED_S - 2 * 86400) * 1000;
		const times = await timesIn('#demo-locale-table');
		assert(times.length === 8, `8 time elements (4 locales x full+relative), got ${times.length}`);
		const locales = ['en', 'mk', 'de', 'ja'];
		const relTexts = [];
		for (let i = 0; i < locales.length; i++) {
			const loc = locales[i];
			const full = times[i * 2];
			const rel = times[i * 2 + 1];
			assert(full.locale === loc && rel.locale === loc, `${loc}: both cells carry data-ln-time-locale="${loc}"`);
			const wantFull = await exp('full', loc, ms);
			const wantRel = await exp('rel', loc, -2, 'day');
			assert(full.text === wantFull, `${loc} full: "${full.text}" === "${wantFull}"`);
			assert(rel.text === wantRel, `${loc} relative: "${rel.text}" === "${wantRel}"`);
			relTexts.push(rel.text);
		}
		// mk has no ICU data in the test Chrome (Intl resolves it to en), so en/de/ja are the distinct ones.
		assert(new Set([relTexts[0], relTexts[2], relTexts[3]]).size === 3, `en, de, ja render three different relative strings: ${relTexts.join(' | ')}`);
		assert(/2/.test(times[1].text) && /ago/.test(times[1].text), `en relative reads as "2 ... ago" (got "${times[1].text}")`);
	});

	// ─── Dynamic insertion ─────────────────────────────────────

	await check('Dynamic Insertion (MutationObserver)', async () => {
		assert(await page.evaluate(() => document.querySelectorAll('#demo-dynamic-target time').length === 0), 'target starts empty');
		await page.click('#demo-dynamic-btn');
		const want = await exp('rel', 'en', 0, 'second');
		const text = await waitText('#demo-dynamic-target time', want);
		assert(text === want, `inserted <time> re-rendered from its "just now" placeholder to "${text}" (expected "${want}")`);
		const state = await page.evaluate(() => {
			const t = document.querySelector('#demo-dynamic-target time');
			return { init: !!t.lnTime, title: t.title };
		});
		assert(state.init, 'inserted element got an lnTime instance');
		assert(state.title === await exp('full', 'en', FIXED_MS), 'inserted element has the full-format title tooltip');
		await page.click('#demo-dynamic-btn');
		await page.waitForFunction(() => document.querySelectorAll('#demo-dynamic-target time').length === 2, { timeout: 5000 });
		const texts = await page.evaluate(() => Array.from(document.querySelectorAll('#demo-dynamic-target time')).map(t => t.textContent));
		assert(texts.every(t => t === want), `second insertion also initialised ("${texts.join('", "')}")`);
	});

	// ─── Reactive attribute changes ────────────────────────────

	await check('Reactive Attribute Changes', async () => {
		const SEL = '#demo-reactive';
		const initialMs = 1736952600 * 1000;
		const initial = await page.evaluate(sel => ({
			text: document.querySelector(sel).textContent,
			mode: document.querySelector(sel).getAttribute('data-ln-time')
		}), SEL);
		assert(initial.mode === 'full', 'starts in full mode');
		assert(initial.text === await exp('full', 'en', initialMs), `initial render: "${initial.text}" is the full format of 1736952600`);

		// Math.random is stubbed for the click only: offset = floor(0.25 * 14d) - 7d = -302400s (3.5 days back)
		await page.evaluate(() => { window.__realRandom = Math.random; Math.random = () => 0.25; });
		await page.click('#demo-reactive-ts');
		await page.evaluate(() => { Math.random = window.__realRandom; });
		const newTs = FIXED_S - 302400;
		const newMs = newTs * 1000;
		const wantFull = await exp('full', 'en', newMs);
		const afterTs = await waitText(SEL, wantFull);
		assert(await page.evaluate(sel => document.querySelector(sel).getAttribute('datetime'), SEL) === String(newTs),
			`datetime attribute now ${newTs}`);
		assert(afterTs === wantFull, `changing datetime re-rendered: "${afterTs}"`);

		// Cycle mode: full -> date -> time -> relative -> short -> full (modeIndex starts at 2)
		const cycle = [
			['date', await exp('date', 'en', newMs)],
			['time', await exp('time', 'en', newMs)],
			['relative', await exp('rel', 'en', -3, 'day')], // round(-3.5) = -3, 'day' branch
			['short', await exp('short', 'en', newMs, false)],
			['full', wantFull]
		];
		for (const [mode, want] of cycle) {
			await page.click('#demo-reactive-mode');
			await page.waitForFunction((sel, m, w) => {
				const el = document.querySelector(sel);
				return el.getAttribute('data-ln-time') === m && el.textContent === w;
			}, { timeout: 5000 }, SEL, mode, want).catch(() => {});
			const got = await page.evaluate(sel => ({
				mode: document.querySelector(sel).getAttribute('data-ln-time'),
				text: document.querySelector(sel).textContent
			}), SEL);
			assert(got.mode === mode, `cycle button set data-ln-time="${mode}"`);
			assert(got.text === want, `mode ${mode}: "${got.text}" === "${want}"`);
		}
	});

	// ─── Auto-update ticker (relative mode) ────────────────────

	await check('Relative auto-update ticker', async () => {
		const tickers = await page.evaluate(() => window.__tickers.length);
		assert(tickers >= 1, `a 60000ms interval was registered for relative elements (${tickers})`);
		const cell = '#demo-relative-table tbody tr:first-child time';
		const before = await textOf(cell);
		assert(before === await exp('rel', 'en', -30, 'second'), `before tick: "${before}" (30 sec ago)`);
		// Move the frozen clock forward one hour and fire the captured ticker callbacks.
		await page.evaluate(() => {
			window.__now += 3600 * 1000;
			window.__tickers.forEach(fn => fn());
		});
		// diff = floor(-3630s) -> round(-3630 / 3600) = -1 hour
		const want = await exp('rel', 'en', -1, 'hour');
		const after = await waitText(cell, want);
		assert(after === want, `after tick: "${after}" === "${want}" (1 hour)`);
		const nonRelative = await timesIn('#demo-modes-table');
		assert(nonRelative[2].text === await exp('full', 'en', (FIXED_S - 3 * 3600) * 1000), 'full-mode element is not touched by the ticker');
		await page.evaluate(() => { window.__now -= 3600 * 1000; });
	});

	// ─── Instance API ──────────────────────────────────────────

	await check('Instance API render()', async () => {
		const sel = '#demo-modes-table tbody tr:nth-child(4) time';
		const want = await textOf(sel);
		await page.evaluate(s => { document.querySelector(s).textContent = 'overwritten'; }, sel);
		assert(await textOf(sel) === 'overwritten', 'text overwritten by hand');
		await page.evaluate(s => document.querySelector(s).lnTime.render(), sel);
		assert(await textOf(sel) === want, `el.lnTime.render() restores "${want}"`);
	});

	// ─── Locale change broadcast ───────────────────────────────

	await check('Document lang change re-renders (ln-core:locale-change)', async () => {
		const origLang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
		assert(origLang === 'en', `<html lang> is "en" (got "${origLang}")`);
		const sel = '#demo-modes-table tbody tr:first-child time';
		const wantDe = await exp('rel', 'de', -3, 'hour');
		await page.evaluate(() => document.documentElement.setAttribute('lang', 'de'));
		const text = await waitText(sel, wantDe);
		assert(text === wantDe, `lang=de: relative cell becomes "${text}" (expected "${wantDe}")`);
		const overridden = await page.evaluate(() => document.querySelector('#demo-locale-table tbody tr:first-child time').textContent);
		assert(overridden === await exp('full', 'en', (FIXED_S - 2 * 86400) * 1000),
			'cell with data-ln-time-locale="en" ignores the document lang change');
		await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
		const wantEn = await exp('rel', 'en', -3, 'hour');
		assert(await waitText(sel, wantEn) === wantEn, 'lang restored to en re-renders back');
	});

	// ─── Edge cases ────────────────────────────────────────────

	await check('Edge Cases', async () => {
		const read = sel => page.evaluate(s => {
			const t = document.querySelector(s);
			return { text: t.textContent, hasTitle: t.hasAttribute('title'), inited: !!t.lnTime };
		}, sel);

		const empty = await read('time[data-ln-time="short"][datetime=""]');
		assert(empty.text === 'fallback text', `empty datetime: text preserved ("${empty.text}")`);
		assert(!empty.hasTitle, 'empty datetime: no title set');

		const missing = await read('time[data-ln-time="short"]:not([datetime])');
		assert(missing.text === 'no datetime attr', `missing datetime: text preserved ("${missing.text}")`);
		assert(!missing.hasTitle, 'missing datetime: no title set');
	});

	// Page prose says an ISO string is "Skipped - not a Unix timestamp". Source: parseDateInput
	// (ln-core/date.js) falls through Number() to new Date(str), so an ISO string IS rendered.
	await check('Edge Case: ISO datetime [source]', async () => {
		const sel = 'time[datetime="2025-01-15T14:30:00Z"]';
		const ms = Date.UTC(2025, 0, 15, 14, 30);
		const want = await exp('short', 'en', ms, true); // 2025 != frozen year 2026 -> year included
		await page.waitForFunction((s, w) => document.querySelector(s).textContent === w, { timeout: 3000 }, sel, want).catch(() => {});
		const text = await textOf(sel);
		assert(text === want, `[source] ISO string is rendered as short date with year: "${text}" === "${want}" (page prose claims it is skipped)`);
	});

	// Page prose says datetime="0" renders Jan 1, 1970. Source: parseDateInput requires num > 0,
	// so "0" falls to new Date("0"), which V8 reads as year 2000.
	await check('Edge Case: epoch zero [source]', async () => {
		const sel = 'time[data-ln-time="full"][datetime="0"]';
		const wantMs = await page.evaluate(() => new Date('0').getTime());
		const want = await exp('full', 'en', wantMs);
		await page.waitForFunction((s, w) => document.querySelector(s).textContent === w, { timeout: 3000 }, sel, want).catch(() => {});
		const text = await textOf(sel);
		assert(text !== 'epoch', 'epoch-zero element was rendered (placeholder replaced)');
		assert(text === want, `[source] datetime="0" renders new Date("0"): "${text}" === "${want}"`);
	});

	if (failures.length) {
		console.error(`\n${failures.length} section failure(s):`);
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
