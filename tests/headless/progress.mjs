import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/progress.html (live demos) and
// components/ln-progress/src/ln-progress.js, progress-model.js and ln-core/progress.js.
// Page prose that contradicts the source is NOT asserted as written; see the notes inline.

const PAGE_URL = BASE_URL + 'progress.html';
const EPS = 0.01;

run('demo/admin/progress.html', async ({ page }) => {

	const failures = [];

	// Each section runs in its own try/catch so one broken demo does not hide the others.
	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  ✗ Section failed: ${title}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(() => {
			const bars = document.querySelectorAll('[data-ln-progress]');
			return bars.length > 0 && Array.from(bars).every(el => el.lnProgress);
		}, { timeout: 10000 });
	}

	const near = (a, b) => Math.abs(a - b) < EPS;

	function expectBars(bars, expectedPcts, label) {
		assert(bars.length === expectedPcts.length, `${label}: ${expectedPcts.length} bars (got ${bars.length})`);
		expectedPcts.forEach((p, i) => {
			assert(near(bars[i].pct, p), `${label}: bar ${i + 1} width is ${p}% (got "${bars[i].width}")`);
		});
	}

	// The rows of the live demos, selected by the label text of their <li>.
	const rowBars = (labelStart) => page.evaluate(start => {
		const li = Array.from(document.querySelectorAll('.demo-progress-row > li'))
			.find(item => item.querySelector('.label').textContent.trim().startsWith(start));
		if (!li) return null;
		return Array.from(li.querySelectorAll('[data-ln-progress]')).map(el => ({
			width: el.style.width,
			pct: parseFloat(el.style.width),
			role: el.getAttribute('role'),
			min: el.getAttribute('aria-valuemin'),
			max: el.getAttribute('aria-valuemax'),
			now: el.getAttribute('aria-valuenow')
		}));
	}, labelStart);

	async function rowExpect(labelStart, pcts, label) {
		const bars = await rowBars(labelStart);
		assert(bars !== null, `${label}: demo row found`);
		expectBars(bars, pcts, label);
		return bars;
	}

	// ═══ 1. Colour variants ════════════════════════════════════

	await section('Colour variants: width = value % of default max 100', async () => {
		await load();
		await rowExpect('Success (80%)', [80], 'success 80');
		await rowExpect('Warning (50%)', [50], 'warning 50');
		await rowExpect('Error (25%)', [25], 'error 25');
		const classes = await page.evaluate(() => ['80', '50', '25'].map(v => document.querySelector('[data-ln-progress="' + v + '"]').className));
		assert(classes.join(',') === 'success,warning,error', `bars keep their variant classes (got ${classes.join(',')})`);
	});

	// ═══ 2. ARIA ═══════════════════════════════════════════════

	await section('ARIA: role and aria-value* written on every bar', async () => {
		const bars = await rowBars('Success (80%)');
		assert(bars[0].role === 'progressbar', 'role="progressbar"');
		assert(bars[0].min === '0', 'aria-valuemin="0"');
		assert(bars[0].max === '100', 'aria-valuemax="100"');
		assert(bars[0].now === '80', 'aria-valuenow="80"');
		const all = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-progress]'))
			.every(el => el.getAttribute('role') === 'progressbar' && el.hasAttribute('aria-valuenow')));
		assert(all, 'every [data-ln-progress] bar on the page has role=progressbar and aria-valuenow');
	});

	// ═══ 3. Custom per-bar max ═════════════════════════════════

	await section('Custom per-bar max: (value / max) * 100', async () => {
		const storage = await rowExpect('Storage: 7.5 GB', [75], 'storage 7.5 of 10');
		assert(storage[0].max === '10' && storage[0].now === '7.5', 'aria-valuemax="10", aria-valuenow="7.5"');
		const backup = await rowExpect('Backup: 45 of 50', [90], 'backup 45 of 50');
		assert(backup[0].max === '50' && backup[0].now === '45', 'aria-valuemax="50", aria-valuenow="45"');
	});

	await section('Changing a bar\'s own data-ln-progress-max re-renders it', async () => {
		await page.evaluate(() => {
			document.querySelector('[data-ln-progress="7.5"]').setAttribute('data-ln-progress-max', '20');
		});
		await page.waitForFunction(() => parseFloat(document.querySelector('[data-ln-progress="7.5"]').style.width) === 37.5, { timeout: 5000 });
		const bars = await rowBars('Storage: 7.5 GB');
		assert(near(bars[0].pct, 37.5), '7.5 of 20 renders 37.5%');
		assert(bars[0].max === '20', 'aria-valuemax follows the new max');
	});

	// ═══ 4. Stacked, default max ═══════════════════════════════

	await section('Stacked bars, default max 100: each bar is its own percentage', async () => {
		await load();
		await rowExpect('Resources: CPU 40%', [40, 30, 30], 'CPU/RAM/Disk');
		await rowExpect('Three small values without parent max', [4, 2, 1], 'small values, no parent max');
	});

	// ═══ 5. Stacked, shared parent max ═════════════════════════

	await section('Stacked bars, shared max on the track', async () => {
		const full = await rowExpect('Tasks', [(4 / 7) * 100, (2 / 7) * 100, (1 / 7) * 100], 'parent max=7');
		assert(near(full[0].pct + full[1].pct + full[2].pct, 100), 'parent max=7: bars together fill the track (100%)');
		assert(full.every(b => b.max === '7'), 'parent max=7: aria-valuemax="7" on every bar');
		const partial = await rowExpect('Same values, parent max=15', [(4 / 15) * 100, (2 / 15) * 100, (1 / 15) * 100], 'parent max=15');
		assert(near(partial[0].pct + partial[1].pct + partial[2].pct, (7 / 15) * 100), 'parent max=15: track filled 7/15');
		assert(partial.every(b => b.max === '15'), 'parent max=15: aria-valuemax="15" on every bar');
	});

	await section('Parent max wins over the bar\'s own max', async () => {
		await page.evaluate(() => {
			const track = document.querySelector('.progress[data-ln-progress-max="7"]');
			track.firstElementChild.setAttribute('data-ln-progress-max', '3');
		});
		// Re-render happens synchronously-ish via the attribute observer; resolved max must stay 7.
		await page.waitForFunction(() => document.querySelector('.progress[data-ln-progress-max="7"]').firstElementChild.getAttribute('data-ln-progress-max') === '3');
		const bars = await rowBars('Tasks');
		assert(near(bars[0].pct, (4 / 7) * 100) && bars[0].max === '7', 'bar max=3 under parent max=7 still resolves to 7');
	});

	await section('Changing the track\'s data-ln-progress-max re-renders its bars', async () => {
		await page.evaluate(() => {
			document.querySelector('.progress[data-ln-progress-max="15"]').setAttribute('data-ln-progress-max', '30');
		});
		await page.waitForFunction(() => {
			const track = document.querySelector('.progress[data-ln-progress-max="30"]');
			return track && near2(parseFloat(track.firstElementChild.style.width), (4 / 30) * 100);
			function near2(a, b) { return Math.abs(a - b) < 0.01; }
		}, { timeout: 5000 });
		const bars = await rowBars('Same values, parent max=15');
		assert(bars.every(b => b.max === '30'), 'all three bars now report aria-valuemax="30"');
		assert(near(bars[0].pct, (4 / 30) * 100), 'bar 1 re-rendered at 4/30');
	});

	// Prose (Common mistakes 4 / Anatomy) says the parent is only observed if it had the attribute
	// at construction. The source (_listenParent) observes the parent unconditionally; asserting the source.
	await section('A track that gains data-ln-progress-max later re-renders its bars (source: _listenParent is unconditional)', async () => {
		const before = await page.evaluate(() => {
			const track = Array.from(document.querySelectorAll('.demo-progress-row > li'))
				.find(li => li.querySelector('.label').textContent.trim().startsWith('Three small values without parent max'))
				.querySelector('.progress');
			track.id = 'late-max-track';
			return track.hasAttribute('data-ln-progress-max');
		});
		assert(before === false, 'precondition: the track had no data-ln-progress-max');
		await page.evaluate(() => document.getElementById('late-max-track').setAttribute('data-ln-progress-max', '7'));
		await page.waitForFunction(() => {
			const first = document.getElementById('late-max-track').firstElementChild;
			return Math.abs(parseFloat(first.style.width) - (4 / 7) * 100) < 0.01;
		}, { timeout: 3000 }).catch(() => {});
		const bars = await page.evaluate(() => Array.from(document.getElementById('late-max-track').children).map(el => parseFloat(el.style.width)));
		assert(near(bars[0], (4 / 7) * 100), `bar 1 re-rendered at 4/7 after the track gained max=7 (got ${bars[0]}%)`);
	});

	// ═══ 6. Reactive updates + event log ═══════════════════════

	const reactState = () => page.evaluate(() => {
		const bar = document.getElementById('demo-react-bar');
		return {
			attr: bar.getAttribute('data-ln-progress'),
			width: bar.style.width,
			pct: parseFloat(bar.style.width),
			now: bar.getAttribute('aria-valuenow'),
			max: bar.getAttribute('aria-valuemax'),
			min: bar.getAttribute('aria-valuemin'),
			role: bar.getAttribute('role'),
			label: bar.getAttribute('aria-label'),
			log: document.getElementById('demo-event-log').textContent
		};
	});

	const clickSet = value => page.evaluate(v => {
		document.querySelector('[data-ln-set-progress="' + v + '"]').click();
	}, String(value));

	async function setAndWait(value, expectedPct) {
		await clickSet(value);
		await page.waitForFunction((v, p) => {
			const bar = document.getElementById('demo-react-bar');
			return bar.getAttribute('data-ln-progress') === v && parseFloat(bar.style.width) === p;
		}, { timeout: 5000 }, String(value), expectedPct);
		return reactState();
	}

	await section('Reactive demo: initial state', async () => {
		await load();
		const s = await reactState();
		assert(s.attr === '0' && s.pct === 0, 'bar starts at data-ln-progress="0", width 0%');
		assert(s.role === 'progressbar' && s.min === '0' && s.max === '100' && s.now === '0', 'ARIA initial: progressbar 0 / 0..100');
		assert(s.label === 'Reactive progress demo', 'consumer aria-label is untouched');
		const buttons = await page.evaluate(() => Array.from(document.querySelectorAll('[data-ln-set-progress]')).map(b => b.getAttribute('data-ln-set-progress')));
		assert(buttons.join(',') === '0,25,50,75,100,150,-30', `7 value buttons (got ${buttons.join(',')})`);
		// Source: the constructor's first _render dispatches ln-progress:change, which the page's inline listener (attached before init) logs.
		// The page prose placeholder 'No events yet' is therefore replaced at load.
		assert(/^\[[^\]]+\] {2}value=0 {2}max=100 {2}percentage=0\.0%$/.test(s.log), 'event log holds exactly the initial-render entry (got ' + JSON.stringify(s.log) + ')');
	});

	await section('Reactive demo: buttons write the attribute and the bar follows', async () => {
		for (const [value, pct] of [[25, 25], [50, 50], [75, 75], [100, 100], [0, 0]]) {
			const s = await setAndWait(value, pct);
			assert(s.attr === String(value) && near(s.pct, pct), `click ${value}: attribute "${value}", width ${pct}%`);
			assert(s.now === String(value), `click ${value}: aria-valuenow="${value}"`);
		}
	});

	await section('Reactive demo: overshoot (150) keeps raw attribute, clamps rendering', async () => {
		const s = await setAndWait(150, 100);
		assert(s.attr === '150', 'attribute still holds raw "150"');
		assert(s.pct === 100, 'width clamped to 100%');
		assert(s.now === '100', 'aria-valuenow clamped to max (100)');
	});

	await section('Reactive demo: undershoot (-30) keeps raw attribute, clamps rendering', async () => {
		const s = await setAndWait(-30, 0);
		assert(s.attr === '-30', 'attribute still holds raw "-30"');
		assert(s.pct === 0, 'width clamped to 0%');
		assert(s.now === '0', 'aria-valuenow clamped to min (0)');
	});

	await section('Event log: ln-progress:change detail (value, max, percentage)', async () => {
		await load();
		await setAndWait(150, 100);
		const log = await page.evaluate(() => document.getElementById('demo-event-log').textContent);
		const lines = log.split('\n');
		assert(/value=150 {2}max=100 {2}percentage=100\.0%$/.test(lines[0]), `newest line reports raw value 150 and clamped percentage 100.0% (got "${lines[0]}")`);
		await setAndWait(25, 25);
		const log2 = (await reactState()).log.split('\n');
		assert(/value=25 {2}max=100 {2}percentage=25\.0%$/.test(log2[0]), `newest line is value=25 percentage=25.0% (got "${log2[0]}")`);
		assert(/value=150 /.test(log2[1]), 'previous entry is kept below the newest (unshift order)');
	});

	await section('Event log keeps at most 8 entries, newest first', async () => {
		await load();
		const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95];
		for (const v of values) {
			await page.evaluate(x => document.getElementById('demo-react-bar').setAttribute('data-ln-progress', x), String(v));
			await page.waitForFunction(x => document.getElementById('demo-event-log').textContent.split('\n')[0].includes('value=' + x + ' '), { timeout: 5000 }, String(v));
		}
		const lines = (await reactState()).log.split('\n');
		assert(lines.length === 8, `log capped at 8 lines (got ${lines.length})`);
		assert(lines[0].includes('value=95 ') && lines[7].includes('value=30 '), 'first line is the newest (95), last is value=30');
	});

	await section('ln-progress:change bubbles with detail {target, value, max, percentage}', async () => {
		await load();
		const detail = await page.evaluate(() => new Promise(resolve => {
			const bar = document.getElementById('demo-react-bar');
			document.addEventListener('ln-progress:change', function handler(e) {
				if (e.target !== bar) return;
				document.removeEventListener('ln-progress:change', handler);
				resolve({
					sameTarget: e.detail.target === bar,
					value: e.detail.value,
					max: e.detail.max,
					percentage: e.detail.percentage,
					bubbles: e.bubbles,
					cancelable: e.cancelable
				});
			});
			bar.setAttribute('data-ln-progress', '42');
		}));
		assert(detail.bubbles === true && detail.cancelable === false, 'bubbles, not cancelable');
		assert(detail.sameTarget && detail.value === 42 && detail.max === 100 && detail.percentage === 42, 'detail = {target: bar, value: 42, max: 100, percentage: 42}');
	});

	// ═══ 7. Invalid value ══════════════════════════════════════

	await section('Invalid value "abc" renders 0%', async () => {
		await load();
		const bars = await rowBars('Invalid value');
		assert(bars !== null, 'invalid-value demo row found');
		expectBars(bars, [0], 'abc');
		assert(bars[0].now === '0' && bars[0].role === 'progressbar', 'aria-valuenow="0", role progressbar');
	});

	// ═══ 8. Page-wide ══════════════════════════════════════════

	await section('Every live bar mounted', async () => {
		await load();
		// 3 (colour) + 2 (custom max) + 3+3 (stacked default) + 3+3 (shared max) + 1 (reactive) + 1 (invalid)
		const mounted = await page.evaluate(() => ({
			total: document.querySelectorAll('[data-ln-progress]').length,
			live: Array.from(document.querySelectorAll('[data-ln-progress]')).filter(el => el.lnProgress).length
		}));
		assert(mounted.total === 19, `19 bars in the page markup (got ${mounted.total})`);
		assert(mounted.live === mounted.total, 'every bar has an lnProgress instance');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
