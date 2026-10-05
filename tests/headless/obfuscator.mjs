import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/obfuscator.html and
// components/ln-obfuscator/src/{ln-obfuscator,obfuscator-model}.js.

const PAGE_URL = BASE_URL + 'obfuscator.html';
const STATIC_COUNT = 5; // 2 links + 2 <p> + 1 <div> carrying data-ln-obfuscator in the static showcase
const DEFAULT_INPUT = 'Контакт: contact@example.com (тел: 070 123 456)';
const DEFAULT_KEY = 'тајна';

run('demo/admin/obfuscator.html', async ({ page }) => {

	const failures = [];

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	// One section failing must not stop the others; failures are rethrown at the end.
	async function guarded(title, fn) {
		section(title);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await page.waitForFunction(count => {
			if (!window.lnObfuscator || !window.lnObfuscator.obfuscate) return false;
			const els = document.querySelectorAll('[data-ln-obfuscator]');
			const statics = Array.from(els).filter(el => !el.closest('#obf-sandbox'));
			return statics.length === count && statics.every(el => el.lnObfuscator);
		}, { timeout: 10000 }, STATIC_COUNT);
	}

	const text = sel => page.$eval(sel, el => el.textContent.trim());
	const attr = (sel, name) => page.$eval(sel, (el, n) => el.getAttribute(n), name);

	// The static showcase cards, addressed by their authored attributes.
	const EMAIL = 'a[data-ln-obfuscator][href^="mailto:"]';
	const PHONE = 'a[data-ln-obfuscator][href^="tel:"]';
	const BASE64 = 'p[data-ln-obfuscator][data-ln-obfuscator-codec="base64"]';
	const XOR = 'p[data-ln-obfuscator][data-ln-obfuscator-codec="xor"]';
	const NESTED = 'div[data-ln-obfuscator]';

	async function setPlayground({ input, codec, key, shift, type }) {
		if (input !== undefined) await page.$eval('#obf-input-text', (el, v) => { el.value = v; }, input);
		if (codec !== undefined) await page.select('#obf-codec-select', codec);
		if (key !== undefined) await page.$eval('#obf-key-input', (el, v) => { el.value = v; }, key);
		if (shift !== undefined) await page.select('#obf-shift-select', shift);
		if (type !== undefined) await page.select('#obf-target-type', type);
	}

	async function clearSandbox() {
		await page.click('#obf-btn-clear');
		await page.waitForFunction(() => document.getElementById('obf-sandbox').children.length === 0);
	}

	// Clicks inject and waits until the injected element has been hydrated by the component.
	async function inject() {
		const before = await page.$eval('#obf-sandbox', el => el.children.length);
		await page.click('#obf-btn-inject');
		await page.waitForFunction(n => {
			const kids = document.getElementById('obf-sandbox').children;
			return kids.length === n + 1 && kids[n].lnObfuscator;
		}, { timeout: 5000 }, before);
		return before;
	}

	await load();

	// ─── Static showcase ───────────────────────────────────────

	await guarded('Static: ROT13 email link', async () => {
		assert(await text(EMAIL) === 'contact@example.com', 'Email link text deobfuscated to contact@example.com');
		assert(await attr(EMAIL, 'href') === 'mailto:contact@example.com', 'Email link href deobfuscated to mailto:contact@example.com');
	});

	await guarded('Static: ROT13 phone link (digits rotated)', async () => {
		// letters shift by 13, digits by 13 mod 10 = 3 backwards
		assert(await text(PHONE) === '+389-70-123-456', 'Phone link text digits rotated to +389-70-123-456');
		assert(await attr(PHONE, 'href') === 'tel:+389-70-123-456', 'Phone link href deobfuscated to tel:+389-70-123-456');
	});

	await guarded('Static: Base64 codec', async () => {
		assert(await text(BASE64) === 'Контакт телефон: 070 123 456', 'Base64 paragraph decoded to Cyrillic text');
	});

	await guarded('Static: XOR codec with custom key', async () => {
		assert(await text(XOR) === DEFAULT_INPUT, `XOR paragraph decoded to "${DEFAULT_INPUT}"`);
	});

	await guarded('Static: nested HTML preserved', async () => {
		const info = await page.$eval(NESTED, el => ({
			strong: el.querySelector('strong') && el.querySelector('strong').textContent,
			em: el.querySelector('em') && el.querySelector('em').textContent,
			code: el.querySelector('code') && el.querySelector('code').textContent,
			text: el.textContent.replace(/\s+/g, ' ').trim(),
			children: Array.from(el.children).map(c => c.tagName.toLowerCase())
		}));
		assert(info.children.join(',') === 'strong,em,code', 'Child tags strong, em, code intact (tag names not rotated)');
		assert(info.strong === 'bold emphasis', '<strong> text deobfuscated to "bold emphasis"');
		assert(info.em === 'italicstyle', '<em> text deobfuscated to "italicstyle"');
		assert(info.code === 'in-line code', '<code> text deobfuscated to "in-line code"');
		assert(info.text === 'This is a paragraph with bold emphasis, italicstyle, and in-line code without destroying an entire tag structure!', 'Full text of nested element deobfuscated');
	});

	await guarded('Idempotency: repeated deobfuscate() keeps text', async () => {
		const before = await text(EMAIL);
		await page.$eval(EMAIL, el => { el.lnObfuscator.deobfuscate(); el.lnObfuscator.deobfuscate(); });
		assert(await text(EMAIL) === before, 'Email text unchanged after repeated deobfuscate()');
		assert(await attr(EMAIL, 'href') === 'mailto:contact@example.com', 'Email href unchanged after repeated deobfuscate()');
	});

	// ─── Event telemetry ───────────────────────────────────────

	await guarded('Event: ln-obfuscator:deobfuscated detail and bubbling', async () => {
		const detail = await page.evaluate(() => new Promise(resolve => {
			const el = document.querySelector('p[data-ln-obfuscator][data-ln-obfuscator-codec="xor"]');
			document.addEventListener('ln-obfuscator:deobfuscated', e => resolve({
				target: e.target === el,
				codec: e.detail.codec,
				key: e.detail.key,
				shift: e.detail.shift
			}), { once: true });
			el.lnObfuscator.deobfuscate();
		}));
		assert(detail.target, 'Event bubbles to document with the element as target');
		assert(detail.codec === 'xor', 'detail.codec is xor');
		assert(detail.key === DEFAULT_KEY, 'detail.key is the authored key');
		assert(detail.shift === 13, 'detail.shift defaults to 13');
	});

	// ─── Playground: codec controls ────────────────────────────

	await guarded('Playground: codec select toggles key / shift wrappers', async () => {
		const shown = id => page.$eval(id, el => getComputedStyle(el).display !== 'none');
		await setPlayground({ codec: 'xor' });
		assert(await shown('#obf-key-wrap') && !await shown('#obf-shift-wrap'), 'xor: key visible, shift hidden');
		await setPlayground({ codec: 'rot' });
		assert(!await shown('#obf-key-wrap') && await shown('#obf-shift-wrap'), 'rot: key hidden, shift visible');
		await setPlayground({ codec: 'base64' });
		assert(!await shown('#obf-key-wrap') && !await shown('#obf-shift-wrap'), 'base64: key and shift hidden');
	});

	await guarded('Playground: Encode button output', async () => {
		const encode = async opts => {
			await setPlayground({ input: DEFAULT_INPUT, ...opts });
			await page.$eval('#obf-output-text', el => { el.value = ''; });
			await page.click('#obf-btn-encode');
			await page.waitForFunction(() => document.getElementById('obf-output-text').value !== '');
			return page.$eval('#obf-output-text', el => el.value);
		};
		const xorOut = await encode({ codec: 'xor', key: DEFAULT_KEY });
		assert(xorOut === await attrRaw(), 'XOR output equals the authored XOR payload');

		const b64 = await encode({ codec: 'base64' });
		const b64Round = await page.evaluate(v => window.lnObfuscator.deobfuscate(v, { codec: 'base64' }), b64);
		assert(b64Round === DEFAULT_INPUT, 'Base64 output decodes back to input');

		const rot = await encode({ codec: 'rot', shift: '7' });
		assert(rot === 'Контакт: jvuahja@lehtwsl.jvt (тел: 747 890 123)', 'ROT 7 output rotates letters and digits, leaves Cyrillic');

		const rot13 = await encode({ codec: 'rot', shift: '13' });
		assert(rot13 === 'Контакт: pbagnpg@rknzcyr.pbz (тел: 303 456 789)', 'ROT 13 output rotates letters and digits (mod 10)');
	});

	// ─── Playground: dynamic injection ─────────────────────────

	await guarded('Injection: XOR paragraph', async () => {
		await clearSandbox();
		await setPlayground({ input: DEFAULT_INPUT, codec: 'xor', key: DEFAULT_KEY, type: 'p' });
		await inject();
		const info = await page.$eval('#obf-sandbox > p', el => ({
			text: el.textContent.trim(),
			codec: el.getAttribute('data-ln-obfuscator-codec'),
			key: el.getAttribute('data-ln-obfuscator-key')
		}));
		assert(info.text === DEFAULT_INPUT, 'Injected XOR <p> deobfuscated to the input text');
		assert(info.codec === 'xor' && info.key === DEFAULT_KEY, 'Injected element carries codec=xor and the key');
	});

	await guarded('Injection: Base64 span', async () => {
		await clearSandbox();
		await setPlayground({ input: DEFAULT_INPUT, codec: 'base64', type: 'span' });
		await inject();
		assert(await text('#obf-sandbox > span') === DEFAULT_INPUT, 'Injected Base64 <span> deobfuscated to the input text');
	});

	await guarded('Injection: ROT13 email link', async () => {
		await clearSandbox();
		await setPlayground({ input: 'contact@example.com', codec: 'rot', shift: '13', type: 'email' });
		await inject();
		assert(await text('#obf-sandbox > a') === 'contact@example.com', 'Injected email <a> text deobfuscated');
		assert(await attr('#obf-sandbox > a', 'href') === 'mailto:contact@example.com', 'Injected email <a> href deobfuscated to mailto:');
		assert(await attr('#obf-sandbox > a', 'data-ln-obfuscator') === '', 'ROT13 injected element has empty data-ln-obfuscator');
	});

	await guarded('Injection: ROT 7 phone link', async () => {
		await clearSandbox();
		await setPlayground({ input: '070 123 456', codec: 'rot', shift: '7', type: 'phone' });
		await inject();
		assert(await attr('#obf-sandbox > a', 'data-ln-obfuscator') === '7', 'ROT 7 injected element carries data-ln-obfuscator="7"');
		assert(await text('#obf-sandbox > a') === '070 123 456', 'Injected phone <a> text deobfuscated with shift 7');
		assert(await attr('#obf-sandbox > a', 'href') === 'tel:070 123 456', 'Injected phone <a> href deobfuscated to tel:');
	});

	await guarded('Injection: telemetry log', async () => {
		const lines = await page.$$eval('#obf-event-log li', els => els.map(li => li.textContent));
		assert(lines.some(l => l.includes('Injected <p> with obfuscated payload')), 'Log records the injected <p>');
		assert(lines.some(l => l.includes('Injected <a> with obfuscated payload')), 'Log records the injected <a>');
		assert(lines.some(l => l.includes('ln-obfuscator:deobfuscated on <p> (codec: xor key="тајна")')), 'Log records deobfuscated event for xor <p> with key');
		assert(lines.some(l => l.includes('ln-obfuscator:deobfuscated on <span> (codec: base64)')), 'Log records deobfuscated event for base64 <span>');
		assert(lines.some(l => l.includes('ln-obfuscator:deobfuscated on <a> (codec: rot, shift: 7)')), 'Log records deobfuscated event for rot shift 7 <a>');
	});

	await guarded('Clear Sandbox button', async () => {
		await clearSandbox();
		assert(await page.$eval('#obf-sandbox', el => el.children.length) === 0, 'Sandbox emptied');
	});

	// Authored XOR payload read from the live markup is no longer available after hydration,
	// so it is taken from the component's stored raw text.
	async function attrRaw() {
		return page.$eval(XOR, el => el.lnObfuscator._originalTextNodes[0].raw);
	}

	if (failures.length) {
		throw new Error(`${failures.length} section(s) failed:\n  - ${failures.join('\n  - ')}`);
	}
});
