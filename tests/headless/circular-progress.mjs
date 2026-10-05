import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/circular-progress.html (live demos)
// and components/ln-circular-progress/src/ln-circular-progress.js + ln-core/progress.js.

const PAGE_URL = BASE_URL + 'circular-progress.html';
const RING_COUNT = 16; // 4 colour + 4 size + 3 max/label + 1 reactive + 2 theme + 2 indeterminate
const CIRCUMFERENCE = 2 * Math.PI * 16;

const ROW = '.demo-circular-progress-row';
const RING = ROW + ' > li > [data-ln-circular-progress]';
const REACT = '#demo-react-circle';

const near = (a, b) => Math.abs(a - b) < 1e-6;

run('demo/admin/circular-progress.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction((ringSel, count) => {
			const rings = document.querySelectorAll(ringSel);
			return rings.length === count && Array.from(rings).every(el => el.lnCircularProgress);
		}, { timeout: 10000 }, RING, RING_COUNT);
	}

	// Snapshot of one ring: ARIA, label, arc offset, classes, size.
	const snap = selector => page.evaluate(sel => {
		const el = document.querySelector(sel);
		return {
			attr: el.getAttribute('data-ln-circular-progress'),
			role: el.getAttribute('role'),
			min: el.getAttribute('aria-valuemin'),
			max: el.getAttribute('aria-valuemax'),
			now: el.getAttribute('aria-valuenow'),
			text: el.getAttribute('aria-valuetext'),
			label: el.querySelector('.ln-circular-progress__label').textContent,
			offset: parseFloat(el.lnCircularProgress.progressCircle.getAttribute('stroke-dashoffset')),
			cls: el.className
		};
	}, selector);

	// i-th demo ring (0-based) in document order.
	const nth = i => page.evaluate((sel, idx) => {
		const el = document.querySelectorAll(sel)[idx];
		return {
			attr: el.getAttribute('data-ln-circular-progress'),
			max: el.getAttribute('aria-valuemax'),
			now: el.getAttribute('aria-valuenow'),
			text: el.getAttribute('aria-valuetext'),
			label: el.querySelector('.ln-circular-progress__label').textContent,
			offset: parseFloat(el.lnCircularProgress.progressCircle.getAttribute('stroke-dashoffset')),
			width: el.getBoundingClientRect().width,
			cls: el.className
		};
	}, RING, i);

	await load();

	// ─── Structure ─────────────────────────────────────────────
	section('Structure');
	{
		const s = await page.evaluate(sel => {
			const el = document.querySelector(sel);
			const circles = el.querySelectorAll('svg > circle');
			return {
				viewBox: el.querySelector('svg').getAttribute('viewBox'),
				circles: circles.length,
				track: circles[0].classList.contains('ln-circular-progress__track'),
				fill: circles[1].classList.contains('ln-circular-progress__fill'),
				r: circles[1].getAttribute('r'),
				dasharray: parseFloat(circles[1].getAttribute('stroke-dasharray')),
				transform: circles[1].getAttribute('transform'),
				labelTag: el.querySelector('.ln-circular-progress__label').tagName
			};
		}, RING);
		assert(s.viewBox === '0 0 36 36', 'SVG viewBox is 0 0 36 36');
		assert(s.circles === 2 && s.track && s.fill, 'SVG holds track circle then fill circle');
		assert(s.r === '16', 'Radius is 16');
		assert(near(s.dasharray, CIRCUMFERENCE), 'Dasharray equals circumference (~100.53)');
		assert(s.transform === 'rotate(-90 18 18)', 'Fill rotated -90 about centre');
		assert(s.labelTag === 'STRONG', 'Label is a <strong>');
	}

	// ─── Colour variants (static values, ARIA, arc, classes) ───
	section('Colour variants');
	{
		const expected = [
			{ v: 75, cls: '' },
			{ v: 90, cls: 'success' },
			{ v: 55, cls: 'warning' },
			{ v: 25, cls: 'error' }
		];
		for (let i = 0; i < expected.length; i++) {
			const e = expected[i];
			const r = await nth(i);
			assert(r.now === String(e.v) && r.max === '100', `Ring ${i}: aria-valuenow=${e.v}, aria-valuemax=100`);
			assert(r.label === e.v + '%' && r.text === e.v + '%', `Ring ${i}: label and aria-valuetext "${e.v}%"`);
			assert(near(r.offset, CIRCUMFERENCE - (e.v / 100) * CIRCUMFERENCE), `Ring ${i}: dashoffset matches ${e.v}%`);
			assert(r.cls === e.cls, `Ring ${i}: class is "${e.cls}" (component leaves className alone)`);
		}
		const role = await page.$eval(RING, el => el.getAttribute('role') + '/' + el.getAttribute('aria-valuemin'));
		assert(role === 'progressbar/0', 'role="progressbar", aria-valuemin="0"');
		const strokes = await page.evaluate((sel) => Array.from(document.querySelectorAll(sel)).slice(0, 4)
			.map(el => getComputedStyle(el.querySelector('.ln-circular-progress__fill')).stroke), RING);
		assert(new Set(strokes).size === 4, 'Default, success, warning, error fills render four distinct stroke colours');
	}

	// ─── Size variants ─────────────────────────────────────────
	section('Size variants');
	{
		const rem = await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize));
		const sizes = [2.5, 4, 6, 8];
		for (let i = 0; i < sizes.length; i++) {
			const r = await nth(4 + i);
			assert(r.now === '65' && r.label === '65%', `Size ring ${i}: shows 65%`);
			assert(Math.abs(r.width - sizes[i] * rem) < 0.5, `Size ring ${i}: width is ${sizes[i]}rem`);
		}
	}

	// ─── Custom max + label ────────────────────────────────────
	section('Custom max and label');
	{
		const a = await nth(8);
		assert(a.now === '7' && a.max === '10', '7/10 ring: aria-valuenow=7, aria-valuemax=10');
		assert(a.label === '7/10' && a.text === '7/10', '7/10 ring: label override is shown and mirrored to aria-valuetext');
		assert(near(a.offset, CIRCUMFERENCE * 0.3), '7/10 ring: arc is 70% (dashoffset = 30% of circumference)');

		const b = await nth(9);
		assert(b.now === '85' && b.max === '100' && b.label === 'A+' && b.text === 'A+', 'Letter-grade ring: value 85, label "A+"');
		assert(near(b.offset, CIRCUMFERENCE * 0.15), 'Letter-grade ring: arc is 85%');

		const c = await nth(10);
		assert(c.now === '42' && c.label === '42' && c.text === '42', 'Raw-count ring: value 42, label "42" (no percent sign)');
		assert(near(c.offset, CIRCUMFERENCE * 0.58), 'Raw-count ring: arc is 42%');
	}

	// ─── Theme awareness rings + indeterminate ─────────────────
	section('Theme rings and empty/invalid values');
	{
		const t1 = await nth(12);
		const t2 = await nth(13);
		assert(t1.label === '60%' && t2.label === '60%', 'Theme rings show 60%');
		assert(t1.cls === 'lg' && t2.cls === 'lg success', 'Theme rings keep their authored classes');

		const empty = await nth(14);
		const invalid = await nth(15);
		assert(empty.attr === '' && empty.now === '0' && empty.label === '0%', 'Empty value renders as 0%');
		assert(invalid.attr === 'abc' && invalid.now === '0' && invalid.label === '0%', 'Invalid value "abc" renders as 0%');
		assert(near(empty.offset, CIRCUMFERENCE) && near(invalid.offset, CIRCUMFERENCE), 'Empty and invalid rings have an empty arc');
	}

	// ─── Reactive updates (button writes the attribute) ────────
	section('Reactive updates');
	{
		const initial = await snap(REACT);
		assert(initial.attr === '0' && initial.now === '0' && initial.label === '0%', 'Reactive ring starts at 0%');
		assert(initial.cls === 'xl', 'Reactive ring has class xl');

		const click = value => page.click(`[data-ln-set-progress="${value}"]`);
		const waitNow = now => page.waitForFunction((sel, n) =>
			document.querySelector(sel).getAttribute('aria-valuenow') === n, { timeout: 5000 }, REACT, now);

		for (const v of [25, 50, 75, 100]) {
			await click(v);
			await waitNow(String(v));
			const s = await snap(REACT);
			assert(s.attr === String(v) && s.label === v + '%' && s.text === v + '%', `Click ${v}%: attribute, label and aria-valuetext are ${v}%`);
			assert(near(s.offset, CIRCUMFERENCE - (v / 100) * CIRCUMFERENCE), `Click ${v}%: dashoffset updated`);
		}

		// Overshoot: attribute keeps raw value, rendering clamps.
		await click(150);
		await page.waitForFunction(sel => document.querySelector(sel).getAttribute('data-ln-circular-progress') === '150'
			&& document.querySelector(sel).getAttribute('aria-valuenow') === '100', { timeout: 5000 }, REACT);
		let s = await snap(REACT);
		assert(s.attr === '150', 'Overshoot: attribute keeps raw value 150');
		assert(s.now === '100' && s.label === '100%' && near(s.offset, 0), 'Overshoot: clamped to 100% (aria-valuenow 100, full ring)');

		// Undershoot.
		await click(-30);
		await page.waitForFunction(sel => document.querySelector(sel).getAttribute('data-ln-circular-progress') === '-30'
			&& document.querySelector(sel).getAttribute('aria-valuetext') === '0%', { timeout: 5000 }, REACT);
		s = await snap(REACT);
		assert(s.attr === '-30', 'Undershoot: attribute keeps raw value -30');
		assert(s.now === '0' && s.label === '0%' && near(s.offset, CIRCUMFERENCE), 'Undershoot: clamped to 0% (empty ring)');

		// Back to zero via the 0% button.
		await click(0);
		await waitNow('0');
		s = await snap(REACT);
		assert(s.attr === '0' && s.label === '0%' && near(s.offset, CIRCUMFERENCE), 'Click 0%: ring is empty again');
	}

	// ─── Event log ─────────────────────────────────────────────
	section('ln-circular-progress:change log');
	{
		const firstLine = () => page.$eval('#demo-event-log', el => el.textContent.split('\n')[0]);
		const waitLine = fragment => page.waitForFunction(f =>
			document.getElementById('demo-event-log').textContent.split('\n')[0].includes(f), { timeout: 5000 }, fragment);

		await page.click('[data-ln-set-progress="50"]');
		await waitLine('value=50  max=100  percentage=50.0%');
		assert((await firstLine()).includes('value=50  max=100  percentage=50.0%'), 'Log shows value=50 max=100 percentage=50.0%');

		await page.click('[data-ln-set-progress="150"]');
		await waitLine('value=150  max=100  percentage=100.0%');
		assert((await firstLine()).includes('value=150  max=100  percentage=100.0%'), 'Overshoot logs raw value=150 with percentage=100.0%');

		await page.click('[data-ln-set-progress="-30"]');
		await waitLine('value=-30  max=100  percentage=0.0%');
		assert((await firstLine()).includes('value=-30  max=100  percentage=0.0%'), 'Undershoot logs raw value=-30 with percentage=0.0%');

		const count = await page.$eval('#demo-event-log', el => el.textContent.split('\n').length);
		assert(count <= 8, 'Log keeps at most 8 entries');
	}

	// ─── Event contract + max/label attributes are reactive ────
	section('Event detail and reactive max/label');
	{
		await page.evaluate(sel => {
			const el = document.querySelector(sel);
			window.__events = [];
			document.addEventListener('ln-circular-progress:change', e => {
				if (e.target !== el) return;
				window.__events.push({
					value: e.detail.value,
					max: e.detail.max,
					percentage: e.detail.percentage,
					targetIsHost: e.detail.target === el,
					cancelable: e.cancelable,
					bubbles: e.bubbles
				});
			});
			el.setAttribute('data-ln-circular-progress', '50');
		}, REACT);
		await page.waitForFunction(() => window.__events.length >= 1, { timeout: 5000 });
		const ev = await page.evaluate(() => window.__events[window.__events.length - 1]);
		assert(ev.value === 50 && ev.max === 100 && ev.percentage === 50, 'Event detail is {value:50, max:100, percentage:50}');
		assert(ev.targetIsHost && ev.bubbles && !ev.cancelable, 'Event detail.target is host; event bubbles and is not cancelable');

		await page.evaluate(sel => document.querySelector(sel).setAttribute('data-ln-circular-progress-max', '200'), REACT);
		await page.waitForFunction(sel => document.querySelector(sel).getAttribute('aria-valuemax') === '200', { timeout: 5000 }, REACT);
		let s = await snap(REACT);
		assert(s.label === '25%' && s.now === '50' && near(s.offset, CIRCUMFERENCE * 0.75), 'Max=200 re-renders 50 as 25%');

		await page.evaluate(sel => document.querySelector(sel).setAttribute('data-ln-circular-progress-label', 'half'), REACT);
		await page.waitForFunction(sel => document.querySelector(sel).getAttribute('aria-valuetext') === 'half', { timeout: 5000 }, REACT);
		s = await snap(REACT);
		assert(s.label === 'half' && s.text === 'half', 'Label attribute overrides visible text and aria-valuetext');
	}

	// ─── Decimal rounding (Common mistakes #3) ─────────────────
	section('Decimal value');
	{
		await page.evaluate(sel => document.querySelector(sel).setAttribute('data-ln-circular-progress', '42.7'), REACT);
		await page.evaluate(sel => {
			const el = document.querySelector(sel);
			el.removeAttribute('data-ln-circular-progress-label');
			el.removeAttribute('data-ln-circular-progress-max');
		}, REACT);
		await page.waitForFunction(sel => document.querySelector(sel).getAttribute('aria-valuetext') === '43%', { timeout: 5000 }, REACT);
		const s = await snap(REACT);
		assert(s.label === '43%', '42.7 shows rounded label "43%"');
		assert(near(s.offset, CIRCUMFERENCE - 0.427 * CIRCUMFERENCE), 'Arc is drawn at exactly 42.7%');
	}
});
