import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/stat-card.html and the only
// component it mounts, ln-number (components/ln-number/src/ln-number.js, text-element
// mode). [data-ln-stat-card] / -label / -value / -trend are pure SCSS hooks (no JS binds
// them); the data-ln-stat store binding described in the Overview prose has no live demo
// on the page, so it is not tested.

const PAGE_URL = BASE_URL + 'stat-card.html';

const CARD = 'article[data-ln-stat-card]';
const CARD_COUNT = 8;      // 4 in [data-demo-kpi-grid] + 4 in [data-demo-stat-flex]
const GRID_CARDS = 4;
const FLEX_CARDS = 4;
const NUMBER_ELEMENTS = 6; // 1247, 8, 34, 91, 3581 (p) + revenue (span)

// [label, value text pattern source, trend kind or null, trend text] in DOM order.
const CARDS = [
	{ label: 'Total Documents', value: 1247, trend: 'up', trendText: '12% from last month', formatted: true },
	{ label: 'Active Standards', value: 8, trend: 'neutral', trendText: 'No change', formatted: true },
	{ label: 'Pending Reviews', value: 34, trend: 'down', trendText: '5% from last week', formatted: true },
	{ label: 'Approved This Month', value: 91, trend: 'up', trendText: '22% from last month', formatted: true },
	{ label: 'Total Users', value: 3581, trend: null, trendText: null, formatted: true },
	{ label: 'Revenue', value: 42600, trend: 'up', trendText: '18.4% from last quarter', formatted: true },
	{ label: 'Overdue Items', value: 7, trend: 'down', trendText: '3 more than last week', formatted: false },
	{ label: 'Compliance Score', value: 97, trend: 'neutral', trendText: 'No change from last audit', formatted: false }
];

run('demo/admin/stat-card.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section runs in its own try/catch so one failure does not hide the others.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	// Expected formatted text, produced the way formatNumber() does it:
	// Intl.NumberFormat(locale, { useGrouping, min 0, max = data-ln-number-decimals }).
	const expectedText = (num, locale, maxDecimals) => page.evaluate((n, loc, max) => {
		const opts = { useGrouping: true, minimumFractionDigits: 0 };
		if (max !== null) opts.maximumFractionDigits = max;
		return new Intl.NumberFormat(loc, opts).format(n);
	}, num, locale, maxDecimals);

	await page.goto(PAGE_URL, { waitUntil: 'load' });
	await page.waitForFunction((count) => {
		const els = document.querySelectorAll('[data-ln-stat-card] [data-ln-number], [data-ln-stat-card] [data-ln-number]');
		return els.length === count && Array.from(els).every(el => el.lnNumber);
	}, { timeout: 10000 }, NUMBER_ELEMENTS);

	await guarded('Structure: cards, labels, values, trends', async () => {
		const info = await page.evaluate((sel) => {
			const cards = Array.from(document.querySelectorAll(sel));
			return {
				total: cards.length,
				grid: document.querySelectorAll('[data-demo-kpi-grid] > ' + sel).length,
				flex: document.querySelectorAll('[data-demo-stat-flex] > ' + sel).length,
				cards: cards.map(card => {
					const trend = card.querySelector('[data-ln-stat-trend]');
					const norm = s => s.replace(/\s+/g, ' ').trim();
					return {
						label: norm(card.querySelector('[data-ln-stat-label]').textContent),
						hasValue: !!card.querySelector('[data-ln-stat-value]'),
						trend: trend ? trend.getAttribute('data-ln-stat-trend') : null,
						trendText: trend ? norm(trend.textContent) : null,
						trendIcon: trend ? !!trend.querySelector('svg.ln-icon[aria-hidden="true"]') : false
					};
				})
			};
		}, CARD);

		assert(info.total === CARD_COUNT, `${CARD_COUNT} stat cards on the page (got ${info.total})`);
		assert(info.grid === GRID_CARDS, `${GRID_CARDS} cards in [data-demo-kpi-grid] (got ${info.grid})`);
		assert(info.flex === FLEX_CARDS, `${FLEX_CARDS} cards in [data-demo-stat-flex] (got ${info.flex})`);
		CARDS.forEach((exp, i) => {
			const got = info.cards[i];
			assert(got.label === exp.label, `card ${i + 1} label "${exp.label}" (got "${got.label}")`);
			assert(got.hasValue, `card ${i + 1} "${exp.label}" has [data-ln-stat-value]`);
			assert(got.trend === exp.trend, `card ${i + 1} "${exp.label}" trend ${exp.trend} (got ${got.trend})`);
			assert(got.trendText === exp.trendText, `card ${i + 1} "${exp.label}" trend text "${exp.trendText}" (got "${got.trendText}")`);
			const directional = exp.trend === 'up' || exp.trend === 'down';
			assert(got.trendIcon === directional, `card ${i + 1} "${exp.label}" trend icon present only for up/down`);
		});
	});

	await guarded('Trend variants: up / down / neutral counts', async () => {
		const counts = await page.evaluate(() => {
			const c = {};
			document.querySelectorAll('[data-ln-stat-card] [data-ln-stat-trend]').forEach(el => {
				const v = el.getAttribute('data-ln-stat-trend');
				c[v] = (c[v] || 0) + 1;
			});
			return c;
		});
		assert(counts.up === 3, `3 up trends (got ${counts.up})`);
		assert(counts.down === 2, `2 down trends (got ${counts.down})`);
		assert(counts.neutral === 2, `2 neutral trends (got ${counts.neutral})`);
	});

	await guarded('ln-number formats stat values (locale en)', async () => {
		const values = await page.evaluate((sel) => Array.from(document.querySelectorAll(sel)).map(card => {
			const v = card.querySelector('[data-ln-stat-value]');
			const num = v.matches('[data-ln-number]') ? v : v.querySelector('[data-ln-number]');
			return {
				text: v.textContent.trim(),
				numText: num ? num.textContent.trim() : null,
				raw: num ? num.getAttribute('data-ln-value') : null,
				mounted: num ? !!num.lnNumber : false
			};
		}), CARD);

		CARDS.forEach((exp, i) => {
			const got = values[i];
			if (exp.formatted) {
				assert(got.mounted, `"${exp.label}" value element has an ln-number instance`);
				assert(got.raw === String(exp.value), `"${exp.label}" data-ln-value = ${exp.value} (got ${got.raw})`);
			} else {
				assert(!got.mounted && got.numText === null, `"${exp.label}" value is plain text, no ln-number`);
			}
		});

		const enGroup = await expectedText(1247, 'en', null);
		assert(enGroup === '1,247', `sanity: Intl en grouping gives "1,247" (got "${enGroup}")`);
		assert(values[0].text === '1,247', `Total Documents shows "1,247" (got "${values[0].text}")`);
		assert(values[1].text === '8', `Active Standards shows "8" (got "${values[1].text}")`);
		assert(values[2].text === '34', `Pending Reviews shows "34" (got "${values[2].text}")`);
		assert(values[3].text === '91', `Approved This Month shows "91" (got "${values[3].text}")`);
		assert(values[4].text === '3,581', `Total Users shows "3,581" (got "${values[4].text}")`);
		// [source] ln-number formats with minimumFractionDigits 0 and max = decimals attr,
		// so 42600 with decimals=2 renders "42,600", not "42,600.00".
		assert(values[5].numText === '42,600', `Revenue number span shows "42,600" [source] (got "${values[5].numText}")`);
		assert(values[5].text === '€42,600', `Revenue value shows "€42,600" [source] (got "${values[5].text}")`);
		assert(values[6].text === '7', `Overdue Items stays "7" (got "${values[6].text}")`);
		assert(values[7].text === '97%', `Compliance Score stays "97%" (got "${values[7].text}")`);
	});

	await guarded('Locale change re-formats ln-number values', async () => {
		await page.evaluate(() => document.documentElement.setAttribute('lang', 'de'));
		const deTotal = await expectedText(1247, 'de', null);
		const deRevenue = await expectedText(42600, 'de', '2');
		assert(deTotal !== '1,247', `sanity: de grouping differs from en ("${deTotal}")`);
		await page.waitForFunction((t) => {
			const el = document.querySelector('[data-ln-stat-card] [data-ln-stat-value][data-ln-number]');
			return el && el.textContent.trim() === t;
		}, { timeout: 5000 }, deTotal).catch(() => {});
		const after = await page.evaluate(() => ({
			total: document.querySelector('[data-ln-stat-card] [data-ln-stat-value][data-ln-number]').textContent.trim(),
			revenue: document.querySelector('[data-ln-stat-card] span[data-ln-number="42600"]').textContent.trim(),
			raw: document.querySelector('[data-ln-stat-card] [data-ln-stat-value][data-ln-number]').getAttribute('data-ln-value')
		}));
		assert(after.total === deTotal, `Total Documents re-formatted to "${deTotal}" after lang=de (got "${after.total}")`);
		assert(after.revenue === deRevenue, `Revenue re-formatted to "${deRevenue}" after lang=de (got "${after.revenue}")`);
		assert(after.raw === '1247', `data-ln-value stays raw "1247" after locale change (got "${after.raw}")`);
		await page.evaluate(() => document.documentElement.setAttribute('lang', 'en'));
		await page.waitForFunction(() => document.querySelector('[data-ln-stat-card] [data-ln-stat-value][data-ln-number]').textContent.trim() === '1,247', { timeout: 5000 }).catch(() => {});
		const back = await page.evaluate(() => document.querySelector('[data-ln-stat-card] [data-ln-stat-value][data-ln-number]').textContent.trim());
		assert(back === '1,247', `Total Documents back to "1,247" after lang=en (got "${back}")`);
	});

	await guarded('Cards are visible', async () => {
		const hidden = await page.evaluate((sel) => Array.from(document.querySelectorAll(sel))
			.filter(c => getComputedStyle(c).display === 'none' || c.getBoundingClientRect().height === 0).length, CARD);
		assert(hidden === 0, `All stat cards rendered with non-zero height (hidden: ${hidden})`);
	});

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
