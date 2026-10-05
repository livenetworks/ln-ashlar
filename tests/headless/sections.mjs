import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/sections.html and the components it
// mounts (ln-toggle, ln-persist). The only live-behavior demos on the page are the banners
// (data-ln-toggle + data-ln-toggle-for/-action="close"; the last one has data-ln-persist).
// The other cards (breadcrumbs, section, section-card, inline alert, flat-stack) are static
// markup samples -> structural smoke only.

const PAGE_URL = BASE_URL + 'sections.html';
const DISMISSIBLE = ['demo-banner-info', 'demo-banner-success', 'demo-banner-warning', 'demo-banner-persisted'];
const NO_DISMISS = 'demo-banner-error';
const ALL_BANNERS = [...DISMISSIBLE, NO_DISMISS];
const PERSISTED = 'demo-banner-persisted';
// ln-persist key: data-ln-persist is empty -> el.id; global scope -> ln:{id}:{attr}
const PERSIST_KEY = 'ln:' + PERSISTED + ':data-ln-toggle';

run('demo/admin/sections.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Each section is isolated: a failing assertion is recorded, other sections still run.
	async function check(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function ready() {
		await page.waitForFunction(ids => ids.every(id => {
			const el = document.getElementById(id);
			return el && el.lnToggle;
		}), { timeout: 10000 }, ALL_BANNERS);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const bannerState = id => page.evaluate(i => {
		const el = document.getElementById(i);
		const btn = document.querySelector('button[data-ln-toggle-for="' + i + '"]');
		return {
			attr: el.getAttribute('data-ln-toggle'),
			open: el.classList.contains('open'),
			isOpen: el.lnToggle.isOpen,
			aria: btn ? btn.getAttribute('aria-expanded') : null
		};
	}, id);

	const clickDismiss = id => page.evaluate(i => {
		document.querySelector('button[data-ln-toggle-for="' + i + '"][data-ln-toggle-action="close"]').click();
	}, id);

	// Records ln-toggle events on every banner into window.__toggleEvents.
	const recordEvents = () => page.evaluate(ids => {
		window.__toggleEvents = [];
		ids.forEach(id => {
			['before-close', 'close', 'before-open', 'open'].forEach(name => {
				document.getElementById(id).addEventListener('ln-toggle:' + name, () => {
					window.__toggleEvents.push(id + ':' + name);
				});
			});
		});
	}, ALL_BANNERS);

	const storedValue = () => page.evaluate(k => localStorage.getItem(k), PERSIST_KEY);

	// ═══ Structure (static samples) ═══════════════════════════

	await check('Static samples structure', async () => {
		await load();
		const s = await page.evaluate(() => ({
			title: document.title,
			breadcrumbItems: document.querySelectorAll('nav.breadcrumbs[aria-label="Breadcrumbs"] ol > li').length,
			current: (document.querySelector('nav.breadcrumbs li[aria-current="page"]') || {}).textContent,
			plainSection: !!document.querySelector('section.section > header h2 + .section-actions button.btn'),
			sectionCardFooter: document.querySelectorAll('section.section-card > footer button').length,
			alerts: document.querySelectorAll('div.alert[role="alert"]').length,
			alertVariants: ['success', 'warning', 'error'].map(v => document.querySelectorAll('div.alert.' + v + '[role="alert"]').length),
			flatStack: document.querySelectorAll('.flat-stack > section.section-card').length,
			banners: document.querySelectorAll('div.alert.banner[data-ln-toggle]').length
		}));
		assert(s.title === 'Sections — ln-ashlar', 'page title is "Sections — ln-ashlar"');
		assert(s.breadcrumbItems === 3, 'breadcrumbs: 3 list items');
		assert(s.current === 'John Smith', 'breadcrumbs: aria-current="page" item is "John Smith"');
		assert(s.plainSection, 'section.section has header h2 + .section-actions buttons');
		assert(s.sectionCardFooter === 2, 'section-card sample footer has 2 buttons (Cancel, Save)');
		assert(s.alerts === 4, '4 inline alerts (default, success, warning, error)');
		assert(s.alertVariants.every(n => n === 1), 'one inline alert per success/warning/error variant');
		assert(s.flatStack === 3, 'flat-stack holds 3 section-cards');
		assert(s.banners === 5, '5 banners carry data-ln-toggle');
	});

	// ═══ Initial banner state ═════════════════════════════════

	await check('Banners start open', async () => {
		await load();
		for (const id of ALL_BANNERS) {
			const s = await bannerState(id);
			assert(s.attr === 'open' && s.open && s.isOpen, `${id} starts open (attr, .open class, lnToggle.isOpen)`);
			if (id !== NO_DISMISS) assert(s.aria === 'true', `${id} dismiss button aria-expanded="true"`);
		}
		const visible = await page.evaluate(ids => ids.map(id => {
			const r = document.getElementById(id).getBoundingClientRect();
			return r.width > 0 && r.height > 0;
		}), ALL_BANNERS);
		assert(visible.every(Boolean), 'all 5 banners have a rendered box');
	});

	// ═══ Dismiss ══════════════════════════════════════════════

	await check('Dismiss closes only its own banner', async () => {
		await load();
		await recordEvents();
		await clickDismiss('demo-banner-info');
		await page.waitForFunction(() => document.getElementById('demo-banner-info').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		const s = await bannerState('demo-banner-info');
		assert(s.attr === 'close' && !s.open && !s.isOpen, 'info banner: attr "close", .open removed, isOpen false');
		assert(s.aria === 'false', 'info banner dismiss button aria-expanded="false"');
		const events = await page.evaluate(() => window.__toggleEvents);
		assert(events.join(',') === 'demo-banner-info:before-close,demo-banner-info:close',
			'info banner fired ln-toggle:before-close then ln-toggle:close (got ' + events.join(',') + ')');
		const hidden = await page.evaluate(() => {
			const r = document.getElementById('demo-banner-info').getBoundingClientRect();
			return r.height === 0 || getComputedStyle(document.getElementById('demo-banner-info')).display === 'none'
				|| getComputedStyle(document.getElementById('demo-banner-info')).visibility === 'hidden';
		});
		assert(hidden, 'closed info banner is no longer rendered (zero height / display none / hidden)');
		for (const id of ['demo-banner-success', 'demo-banner-warning', 'demo-banner-persisted', NO_DISMISS]) {
			assert((await bannerState(id)).attr === 'open', `${id} stays open`);
		}
	});

	await check('Each dismissible banner closes via its own button', async () => {
		await load();
		for (const id of DISMISSIBLE) {
			await clickDismiss(id);
			await page.waitForFunction(i => document.getElementById(i).getAttribute('data-ln-toggle') === 'close', { timeout: 5000 }, id);
			assert((await bannerState(id)).attr === 'close', `${id} closed by its dismiss button`);
		}
		assert((await bannerState(NO_DISMISS)).attr === 'open', 'error banner (no dismiss button) is still open');
		const buttons = await page.evaluate(() => document.querySelectorAll('#demo-banner-error button').length);
		assert(buttons === 0, 'error banner has no dismiss button');
	});

	await check('Programmatic request-close / request-open events', async () => {
		await load();
		await page.evaluate(() => document.getElementById('demo-banner-success').dispatchEvent(new CustomEvent('ln-toggle:request-close')));
		await page.waitForFunction(() => document.getElementById('demo-banner-success').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		assert((await bannerState('demo-banner-success')).isOpen === false, 'ln-toggle:request-close closes the banner');
		await page.evaluate(() => document.getElementById('demo-banner-success').dispatchEvent(new CustomEvent('ln-toggle:request-open')));
		await page.waitForFunction(() => document.getElementById('demo-banner-success').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });
		const s = await bannerState('demo-banner-success');
		assert(s.isOpen && s.open && s.aria === 'true', 'ln-toggle:request-open re-opens it (isOpen, .open, aria-expanded)');
	});

	await check('Cancelable before-close keeps banner open', async () => {
		await load();
		await page.evaluate(() => {
			document.getElementById('demo-banner-warning').addEventListener('ln-toggle:before-close', e => e.preventDefault());
		});
		await clickDismiss('demo-banner-warning');
		await page.waitForFunction(() => document.getElementById('demo-banner-warning').getAttribute('data-ln-toggle') === 'open', { timeout: 5000 });
		const s = await bannerState('demo-banner-warning');
		assert(s.attr === 'open' && s.open && s.isOpen, 'preventDefault on before-close leaves the banner open');
	});

	// ═══ Persistence ══════════════════════════════════════════

	await check('Persisted banner stays closed after reload', async () => {
		await load();
		assert(await storedValue() === null, 'nothing stored before dismissal');
		await clickDismiss(PERSISTED);
		await page.waitForFunction(k => localStorage.getItem(k) === 'close', { timeout: 5000 }, PERSIST_KEY);
		assert(await storedValue() === 'close', `localStorage "${PERSIST_KEY}" = "close" after dismissal`);
		await page.reload({ waitUntil: 'load' });
		await ready();
		const s = await bannerState(PERSISTED);
		assert(s.attr === 'close' && !s.open && !s.isOpen, 'persisted banner is closed after reload');
		for (const id of ['demo-banner-info', 'demo-banner-success', 'demo-banner-warning', NO_DISMISS]) {
			assert((await bannerState(id)).attr === 'open', `${id} (not persisted) is open again after reload`);
		}
	});

	await check('Non-persisted banner dismissal is not stored', async () => {
		await load();
		await clickDismiss('demo-banner-info');
		await page.waitForFunction(() => document.getElementById('demo-banner-info').getAttribute('data-ln-toggle') === 'close', { timeout: 5000 });
		const keys = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('ln:demo-banner-')));
		assert(keys.length === 0, 'no ln:demo-banner-* key written for non-persisted banner (got ' + keys.join(',') + ')');
		await page.reload({ waitUntil: 'load' });
		await ready();
		assert((await bannerState('demo-banner-info')).attr === 'open', 'info banner is open again after reload');
	});

	await check('Persisted banner re-open clears stored closed state', async () => {
		await load();
		await clickDismiss(PERSISTED);
		await page.waitForFunction(k => localStorage.getItem(k) === 'close', { timeout: 5000 }, PERSIST_KEY);
		await page.evaluate(id => document.getElementById(id).dispatchEvent(new CustomEvent('ln-toggle:request-open')), PERSISTED);
		await page.waitForFunction(k => localStorage.getItem(k) === 'open', { timeout: 5000 }, PERSIST_KEY);
		await page.reload({ waitUntil: 'load' });
		await ready();
		assert((await bannerState(PERSISTED)).attr === 'open', 'persisted banner is open after reload once re-opened');
	});

	if (failures.length) {
		console.error('\nFailed sections:');
		failures.forEach(f => console.error('  - ' + f));
		throw new Error(`${failures.length} section(s) failed`);
	}
});
