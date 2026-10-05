import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/external-links.html (live demos)
// and components/ln-external-links/src/ln-external-links.js. The page is served from
// localhost, so example.com / github.com etc. are external; "/", "#...", mailto:, tel: are not.

const PAGE_URL = BASE_URL + 'external-links.html';
const HINT = '(opens in new tab)';

const EXTERNAL_HREFS = [
	'https://github.com',
	'https://www.mozilla.org',
	'https://example.com/page',
	'https://en.wikipedia.org/wiki/Tabnabbing'
];
const INTERNAL_COUNT = 5;

run('demo/admin/external-links.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// Component decorates on load; wait for the first demo link to carry the marker.
	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(() => {
			const a = document.querySelector('#external-links-demo article a');
			return a && a.getAttribute('data-ln-external-link') === 'processed';
		}, { timeout: 10000 });
		// Block real navigation / new tabs from click-driven tests; propagation is untouched.
		await page.evaluate(() => {
			window.addEventListener('click', e => e.preventDefault(), true);
		});
	}

	// Snapshot of a link by selector.
	const linkInfo = selector => page.evaluate(sel => {
		const a = document.querySelector(sel);
		if (!a) return null;
		const hints = a.querySelectorAll(':scope > span.sr-only');
		const last = a.lastElementChild;
		return {
			target: a.getAttribute('target'),
			rel: a.getAttribute('rel'),
			marker: a.getAttribute('data-ln-external-link'),
			hintCount: hints.length,
			hintText: hints.length ? hints[0].textContent : null,
			hintIsLast: !!last && last.classList.contains('sr-only')
		};
	}, selector);

	// ─── Live demo: decorated vs untouched ─────────────────────

	section('Live demo: external links are decorated');
	await load();

	const external = await page.evaluate(() => {
		const articles = document.querySelectorAll('#external-links-demo article');
		return Array.from(articles[0].querySelectorAll('a')).map(a => ({
			href: a.getAttribute('href'),
			target: a.getAttribute('target'),
			rel: a.getAttribute('rel'),
			marker: a.getAttribute('data-ln-external-link'),
			hints: Array.from(a.querySelectorAll(':scope > span.sr-only')).map(s => s.textContent),
			lastIsHint: !!a.lastElementChild && a.lastElementChild.classList.contains('sr-only')
		}));
	});
	assert(external.length === EXTERNAL_HREFS.length, `${EXTERNAL_HREFS.length} external demo links`);
	assert(external.every((l, i) => l.href === EXTERNAL_HREFS[i]), 'External hrefs match the markup');
	assert(external.every(l => l.target === '_blank'), 'Every external link has target="_blank"');
	assert(external.every(l => l.rel === 'noopener noreferrer'), 'Every external link has rel="noopener noreferrer"');
	assert(external.every(l => l.marker === 'processed'), 'Every external link carries data-ln-external-link="processed"');
	assert(external.every(l => l.hints.length === 1 && l.hints[0] === HINT), 'Exactly one "(opens in new tab)" hint span per external link');
	assert(external.every(l => l.lastIsHint), 'Hint span is the last child of the link');

	section('Live demo: sr-only hint is visually clipped');
	const hintBox = await page.evaluate(() => {
		const s = document.querySelector('#external-links-demo article a > span.sr-only');
		const r = s.getBoundingClientRect();
		return { w: r.width, h: r.height };
	});
	assert(hintBox.w <= 1 && hintBox.h <= 1, 'sr-only hint is clipped to a 1x1 box (not visible to sighted users)');

	section('Live demo: internal links are untouched');
	const internal = await page.evaluate(() => {
		const articles = document.querySelectorAll('#external-links-demo article');
		return Array.from(articles[1].querySelectorAll('a')).map(a => ({
			target: a.getAttribute('target'),
			rel: a.getAttribute('rel'),
			marker: a.getAttribute('data-ln-external-link'),
			hints: a.querySelectorAll('.sr-only').length
		}));
	});
	assert(internal.length === INTERNAL_COUNT, `${INTERNAL_COUNT} internal demo links`);
	assert(internal.every(l => l.target === null && l.rel === null && l.marker === null && l.hints === 0),
		'Relative, anchor, mailto: and tel: links get no target, rel, marker or hint');

	// ─── rel merge ─────────────────────────────────────────────

	section('rel="me" merge');
	const merged = await linkInfo('a[href="https://livenetworks.mk"]');
	assert(merged.rel === 'me noopener noreferrer', 'Authored rel="me" is preserved and noopener noreferrer appended');
	assert(merged.target === '_blank', 'rel-merge link has target="_blank"');
	assert(merged.marker === 'processed', 'rel-merge link is marked processed');
	assert(merged.hintCount === 1 && merged.hintIsLast, 'rel-merge link has the sr-only hint appended');

	// ─── Whitelist hatch ───────────────────────────────────────

	section('Pre-marked link is skipped');
	const hatch = await linkInfo('a[href="https://oauth.example.com/return"]');
	assert(hatch.marker === 'processed', 'Pre-marked link keeps its marker');
	assert(hatch.target === null, 'Pre-marked external link gets no target="_blank"');
	assert(hatch.rel === null, 'Pre-marked external link gets no rel');
	assert(hatch.hintCount === 0, 'Pre-marked external link gets no sr-only hint');

	// ─── Events: processed + clicked ───────────────────────────

	section('Event log: clicked');
	await page.click('#demo-event-clear');
	assert(await page.$eval('#demo-event-log', el => el.children.length) === 0, 'Clear log empties the event log');

	await page.click('#external-links-demo article a[href="https://example.com/page"]');
	await page.waitForFunction(() => document.querySelectorAll('#demo-event-log li').length === 1, { timeout: 5000 });
	const clickedText = await page.$eval('#demo-event-log li', li => li.textContent);
	assert(clickedText.includes('clicked — https://example.com/page'), 'Click on external link logs clicked with its href');
	assert(clickedText.includes('Example.com' + HINT), 'clicked detail.text includes the sr-only hint suffix');

	section('Clicked: internal link does not dispatch');
	await page.click('#external-links-demo article:nth-of-type(2) a[href="/"]');
	const afterInternal = await page.$$eval('#demo-event-log li', els => els.length);
	assert(afterInternal === 1, 'Click on internal link adds no log entry');

	section('Clicked: event detail and bubbling');
	const detail = await page.evaluate(() => new Promise(resolve => {
		const link = document.querySelector('#external-links-demo article a[href="https://github.com"]');
		document.addEventListener('ln-external-links:clicked', e => resolve({
			target: e.target === link,
			link: e.detail.link === link,
			href: e.detail.href,
			text: e.detail.text,
			cancelable: e.cancelable
		}), { once: true });
		link.click();
	}));
	assert(detail.target && detail.link, 'clicked fires on the link and detail.link is that link');
	assert(detail.href === 'https://github.com/', 'clicked detail.href is link.href');
	assert(detail.text === 'GitHub' + HINT, 'clicked detail.text is textContent including hint');
	assert(detail.cancelable === false, 'clicked is not cancelable');

	section('Clear log button');
	await page.click('#demo-event-clear');
	assert(await page.$eval('#demo-event-log', el => el.children.length) === 0, 'Log is empty after Clear');

	// ─── Dynamic insertion ─────────────────────────────────────

	section('Dynamic insertion');
	await page.click('#demo-event-clear');
	await page.click('#demo-insert-link');
	await page.waitForFunction(() => {
		const a = document.querySelector('#demo-insert-target a[href="https://duckduckgo.com"]');
		return a && a.getAttribute('data-ln-external-link') === 'processed';
	}, { timeout: 5000 });
	const inserted = await linkInfo('#demo-insert-target a[href="https://duckduckgo.com"]');
	assert(inserted.target === '_blank' && inserted.rel === 'noopener noreferrer', 'Inserted external link is decorated (target + rel)');
	assert(inserted.hintCount === 1 && inserted.hintText === HINT, 'Inserted external link gets the sr-only hint');
	const insertedInternal = await linkInfo('#demo-insert-target a[href="/dashboard"]');
	assert(insertedInternal.target === null && insertedInternal.rel === null && insertedInternal.marker === null && insertedInternal.hintCount === 0,
		'Inserted internal link is untouched');
	const processedLogged = await page.$$eval('#demo-event-log li', els => els.map(li => li.textContent));
	assert(processedLogged.length === 1 && processedLogged[0].includes('processed — https://duckduckgo.com/'),
		'processed event for the inserted link is logged exactly once');

	await page.click('#demo-insert-link');
	await page.waitForFunction(() => document.querySelectorAll('#demo-insert-target article').length === 2, { timeout: 5000 });
	await page.waitForFunction(() => Array.from(document.querySelectorAll('#demo-insert-target a[href="https://duckduckgo.com"]'))
		.every(a => a.getAttribute('data-ln-external-link') === 'processed'), { timeout: 5000 });
	assert(await page.$$eval('#demo-insert-target a[href="https://duckduckgo.com"] > span.sr-only', els => els.length) === 2,
		'Second batch decorated; each link has exactly one hint (idempotent)');

	await page.click('#demo-insert-clear');
	assert(await page.$eval('#demo-insert-target', el => el.children.length) === 0, 'Clear empties the insertion target');

	// ─── href mutation ─────────────────────────────────────────

	section('href mutation redecorates');
	await load();
	const stateText = () => page.$eval('#demo-mutating-state', el => el.textContent);
	const initialState = await stateText();
	assert(initialState.includes('[initial]'), 'State panel shows [initial] on load');
	assert(initialState.includes('href:    /dashboard'), 'Initial href is /dashboard');
	assert(initialState.includes('target:  (unset)') && initialState.includes('rel:     (unset)') && initialState.includes('marker:  (unset)'),
		'Initial link has no target, rel or marker');
	assert(initialState.includes('sr-only: absent'), 'Initial link has no sr-only hint');

	await page.click('#demo-href-flip');
	await page.waitForFunction(() => document.getElementById('demo-mutating-state').textContent.includes('[after ln-external-links:processed]'), { timeout: 5000 });
	const flipped = await stateText();
	assert(flipped.includes('href:    https://example.com'), 'Flipped href is https://example.com');
	assert(flipped.includes('target:  _blank'), 'After flip target is _blank');
	assert(flipped.includes('rel:     noopener noreferrer'), 'After flip rel is noopener noreferrer');
	assert(flipped.includes('marker:  processed'), 'After flip marker is processed');
	assert(flipped.includes('sr-only: present'), 'After flip sr-only hint is present');
	assert(await page.$$eval('#demo-mutating-link > span.sr-only', els => els.length) === 1, 'Exactly one hint span on the flipped link');

	section('Reset restores internal state');
	await page.click('#demo-href-reset');
	const reset = await stateText();
	assert(reset.includes('[reset]') && reset.includes('href:    /dashboard'), 'Reset restores href /dashboard');
	assert(reset.includes('target:  (unset)') && reset.includes('rel:     (unset)') && reset.includes('marker:  (unset)') && reset.includes('sr-only: absent'),
		'Reset clears target, rel, marker and hint');

	section('Flip again after reset redecorates');
	await page.click('#demo-href-flip');
	await page.waitForFunction(() => {
		const a = document.getElementById('demo-mutating-link');
		return a.getAttribute('data-ln-external-link') === 'processed' && a.querySelectorAll('.sr-only').length === 1;
	}, { timeout: 5000 });
	assert(true, 'Second flip decorates again with a single hint');

	// ─── API ───────────────────────────────────────────────────

	section('window.lnExternalLinks.process');
	assert(await page.evaluate(() => typeof window.lnExternalLinks.process === 'function'), 'window.lnExternalLinks.process is a function');
	const reprocessed = await page.evaluate(() => {
		const host = document.createElement('section');
		host.innerHTML = '<a href="https://api-test.example.org/x">x</a>';
		const a = host.firstElementChild;
		// Detached subtree: the observer cannot see it, so only the explicit call decorates it.
		window.lnExternalLinks.process(host);
		window.lnExternalLinks.process(host);
		return {
			marker: a.getAttribute('data-ln-external-link'),
			target: a.getAttribute('target'),
			hints: a.querySelectorAll('.sr-only').length
		};
	});
	assert(reprocessed.marker === 'processed' && reprocessed.target === '_blank', 'process(container) decorates links in a detached subtree synchronously');
	assert(reprocessed.hints === 1, 'process() twice is idempotent (one hint)');

	// ─── Confirm-before-leaving interstitial ───────────────────

	section('Interstitial: plain click opens the modal');
	await load();
	const modalOpen = () => page.$eval('#external-link-modal', d => d.open);
	assert(await modalOpen() === false, 'Modal is closed initially');

	await page.click('#demo-interstitial-links a[href="https://example.com"]');
	await page.waitForFunction(() => document.getElementById('external-link-modal').open, { timeout: 5000 });
	assert(await page.$eval('#external-link-modal', d => d.getAttribute('data-ln-modal')) === 'open', 'Modal host has data-ln-modal="open"');
	assert(await page.$eval('#external-link-url', el => el.textContent) === 'https://example.com/', 'Modal shows the clicked link URL');

	section('Interstitial: Cancel closes the modal');
	await page.click('#external-link-modal footer button[data-ln-modal-close]');
	await page.waitForFunction(() => !document.getElementById('external-link-modal').open, { timeout: 5000 });
	assert(await modalOpen() === false, 'Cancel closes the modal');

	section('Interstitial: Continue opens the URL and closes');
	await page.evaluate(() => {
		window.__opened = [];
		window.open = (...args) => { window.__opened.push(args); return null; };
	});
	await page.click('#demo-interstitial-links a[href="https://www.mozilla.org"]');
	await page.waitForFunction(() => document.getElementById('external-link-modal').open, { timeout: 5000 });
	assert(await page.$eval('#external-link-url', el => el.textContent) === 'https://www.mozilla.org/', 'Modal shows the second link URL');
	await page.click('#external-link-confirm');
	await page.waitForFunction(() => !document.getElementById('external-link-modal').open, { timeout: 5000 });
	const opened = await page.evaluate(() => window.__opened);
	assert(opened.length === 1 && opened[0][0] === 'https://www.mozilla.org/' && opened[0][1] === '_blank' && opened[0][2] === 'noopener,noreferrer',
		'Continue calls window.open(url, "_blank", "noopener,noreferrer") once');

	section('Interstitial: modifier-key click bypasses the modal');
	await page.keyboard.down('Control');
	await page.click('#demo-interstitial-links a[href="https://example.com"]');
	await page.keyboard.up('Control');
	await page.evaluate(() => new Promise(r => setTimeout(r, 0)));
	assert(await modalOpen() === false, 'Ctrl+click does not open the modal');
});
