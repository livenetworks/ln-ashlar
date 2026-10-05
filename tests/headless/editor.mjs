import { run, assert, BASE_URL } from './_harness.mjs';

// Every fact below is read from demo/admin/src/pages/editor.html (live demos) and
// components/ln-editor/src/ln-editor.js (+ ln-form.js for the form demo).

const PAGE_URL = BASE_URL + 'editor.html';
const EDITOR_COUNT = 5; // full, minimal, prefilled, form, programmatic
const EDITORS = ['demo-full', 'demo-minimal', 'demo-prefilled', 'demo-form-editor', 'demo-prog'];

const surfaceSel = id => `#${id}-surface`;
const btnSel = (id, action) => `[data-ln-editor]:has(#${id}) [data-ln-editor-action="${action}"]`;

run('demo/admin/editor.html', async ({ page }) => {

	function section(title) {
		console.log(`\n--- ${title} ---`);
	}

	async function ready() {
		await page.waitForFunction((count) => {
			const els = document.querySelectorAll('[data-ln-editor]');
			return els.length === count && Array.from(els).every(el => el.lnEditor && el.lnEditor._surface);
		}, { timeout: 10000 }, EDITOR_COUNT);
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.evaluate(() => localStorage.clear());
		await page.reload({ waitUntil: 'load' });
		await ready();
	}

	const textareaValue = id => page.$eval('#' + id, el => el.value);
	const surfaceHtml = id => page.$eval(surfaceSel(id), el => el.innerHTML);

	// Records every ln-editor:* notification on the editor that owns textarea `id` into window.__ev[id].
	async function record(id) {
		await page.evaluate(taId => {
			window.__ev = window.__ev || {};
			if (window.__ev[taId]) { window.__ev[taId].length = 0; return; }
			window.__ev[taId] = [];
			const dom = document.getElementById(taId).closest('[data-ln-editor]');
			['changed', 'focus', 'blur', 'before-change'].forEach(name => {
				dom.addEventListener('ln-editor:' + name, e => {
					window.__ev[taId].push({ name, detail: { html: e.detail.html, action: e.detail.action, targetIsHost: e.detail.target === dom } });
				});
			});
		}, id);
	}

	const events = (id, name) => page.evaluate((taId, n) => window.__ev[taId].filter(e => e.name === n), id, name);

	async function focusSurface(id) {
		await page.evaluate(sel => document.querySelector(sel).focus(), surfaceSel(id));
	}

	async function selectAll() {
		await page.keyboard.down('Control');
		await page.keyboard.press('a');
		await page.keyboard.up('Control');
	}

	async function typeInto(id, text) {
		await page.evaluate(taId => document.getElementById(taId).closest('[data-ln-editor]').lnEditor.setHTML(''), id);
		await focusSurface(id);
		await page.keyboard.type(text);
	}

	const pressed = (id, action) => page.$eval(btnSel(id, action), el => el.getAttribute('aria-pressed'));

	await load();

	// ─── Mount ─────────────────────────────────────────────────
	section('Mount: surface injected, textarea hidden, toolbar wiring');
	for (const id of EDITORS) {
		const info = await page.evaluate((taId, sSel) => {
			const ta = document.getElementById(taId);
			const surface = document.querySelector(sSel);
			const dom = ta.closest('[data-ln-editor]');
			const toolbar = dom.querySelector('[role="toolbar"]');
			return {
				hasSource: ta.hasAttribute('data-ln-editor-source'),
				taDisplay: getComputedStyle(ta).display,
				surfaceExists: !!surface,
				editable: surface && surface.getAttribute('contenteditable'),
				role: surface && surface.getAttribute('role'),
				multiline: surface && surface.getAttribute('aria-multiline'),
				placeholder: surface && surface.getAttribute('data-placeholder'),
				placeholderSrc: ta.getAttribute('placeholder'),
				controls: toolbar.getAttribute('aria-controls'),
				afterToolbar: toolbar.nextElementSibling === surface
			};
		}, id, surfaceSel(id));
		assert(info.surfaceExists, `${id}: surface #${id}-surface injected`);
		assert(info.editable === 'true' && info.role === 'textbox' && info.multiline === 'true', `${id}: surface is contenteditable role=textbox aria-multiline`);
		assert(info.hasSource && info.taDisplay === 'none', `${id}: textarea has data-ln-editor-source and is display:none`);
		assert(info.controls === `${id}-surface`, `${id}: toolbar aria-controls points at the surface`);
		assert(info.afterToolbar, `${id}: surface inserted right after the toolbar`);
		if (info.placeholderSrc) {
			assert(info.placeholder === info.placeholderSrc, `${id}: textarea placeholder copied to surface data-placeholder`);
		}
	}

	section('Mount: toggle buttons seeded aria-pressed=false, one-shot buttons not');
	assert(await pressed('demo-full', 'bold') === 'false', 'bold aria-pressed="false"');
	assert(await pressed('demo-full', 'heading-2') === 'false', 'heading-2 aria-pressed="false"');
	assert(await pressed('demo-full', 'link') === 'false', 'link aria-pressed="false"');
	assert(await pressed('demo-full', 'unlink') === null, 'unlink has no aria-pressed');
	assert(await pressed('demo-full', 'clear') === null, 'clear has no aria-pressed');

	// ─── Pre-filled ────────────────────────────────────────────
	section('Pre-filled: textarea HTML seeds the surface');
	const pre = await page.$eval(surfaceSel('demo-prefilled'), el => ({
		strong: Array.from(el.querySelectorAll('strong')).map(n => n.textContent),
		em: el.querySelectorAll('em').length,
		h3: el.querySelectorAll('h3').length,
		li: el.querySelectorAll('ul li').length,
		blockquote: el.querySelectorAll('blockquote').length,
		links: Array.from(el.querySelectorAll('a')).map(a => a.getAttribute('href'))
	}));
	assert(pre.strong.length === 1 && pre.strong[0] === 'Senior Software Engineer', 'one <strong> "Senior Software Engineer"');
	assert(pre.em === 2, 'two <em> elements');
	assert(pre.h3 === 1, 'one <h3> (Key achievements)');
	assert(pre.li === 3, 'three <li> achievements');
	assert(pre.blockquote === 1, 'one <blockquote>');
	assert(pre.links.length === 2 && pre.links[0] === 'https://linkedin.com' && pre.links[1] === 'https://github.com', 'two links (linkedin, github)');

	// ─── Inline formatting, events, shortcuts ──────────────────
	section('Full toolbar: bold via toolbar click syncs textarea + fires changed');
	await record('demo-full');
	await typeInto('demo-full', 'hello');
	assert(await textareaValue('demo-full') === 'hello', 'typing syncs plain text to textarea');
	assert((await events('demo-full', 'changed')).length > 0, 'ln-editor:changed fired while typing');
	await selectAll();
	await page.click(btnSel('demo-full', 'bold'));
	assert(/<(b|strong)>hello<\/(b|strong)>/.test(await textareaValue('demo-full')), 'bold wraps selection in textarea value');
	assert(await pressed('demo-full', 'bold') === 'true', 'bold button aria-pressed="true"');
	assert(await page.$eval(btnSel('demo-full', 'bold'), el => el.classList.contains('ln-editor-active')), 'bold button has ln-editor-active');
	const changed = await events('demo-full', 'changed');
	const last = changed[changed.length - 1];
	assert(/<(b|strong)>/.test(last.detail.html), 'last changed event detail.html carries the bold markup');
	assert(await page.evaluate(() => {
		const dom = document.getElementById('demo-full').closest('[data-ln-editor]');
		return document.getElementById('demo-full').value === dom.lnEditor.getHTML();
	}), 'getHTML() equals textarea value');

	await page.click(btnSel('demo-full', 'bold'));
	assert(!/<(b|strong)>/.test(await textareaValue('demo-full')), 'second bold click removes bold');
	assert(await pressed('demo-full', 'bold') === 'false', 'bold button aria-pressed back to "false"');

	section('Full toolbar: keyboard shortcuts');
	await page.keyboard.down('Control');
	await page.keyboard.press('i');
	await page.keyboard.up('Control');
	assert(/<(i|em)>hello<\/(i|em)>/.test(await textareaValue('demo-full')), 'Ctrl+I toggles italic');
	await page.keyboard.down('Control');
	await page.keyboard.press('u');
	await page.keyboard.up('Control');
	assert(/<u>/.test(await textareaValue('demo-full')), 'Ctrl+U toggles underline');
	await page.keyboard.down('Control');
	await page.keyboard.press('b');
	await page.keyboard.up('Control');
	assert(/<(b|strong)>/.test(await textareaValue('demo-full')), 'Ctrl+B toggles bold');

	section('Full toolbar: strikethrough and clear formatting');
	await page.click(btnSel('demo-full', 'strikethrough'));
	assert(/<(s|strike|del)>/.test(await textareaValue('demo-full')), 'strikethrough applied');
	await page.click(btnSel('demo-full', 'clear'));
	const cleared = await textareaValue('demo-full');
	assert(!/<(b|strong|i|em|u|s|strike|del)>/.test(cleared) && cleared.includes('hello'), 'clear removes inline formatting, keeps text');

	section('Full toolbar: before-change is cancelable and carries the action');
	await page.evaluate(() => {
		const dom = document.getElementById('demo-full').closest('[data-ln-editor]');
		window.__before = [];
		dom.addEventListener('ln-editor:before-change', e => {
			window.__before.push(e.detail.action);
			if (e.detail.action === 'underline') e.preventDefault();
		});
	});
	await typeInto('demo-full', 'abc');
	await selectAll();
	await page.click(btnSel('demo-full', 'italic'));
	assert((await page.evaluate(() => window.__before)).includes('italic'), 'before-change detail.action === "italic"');
	assert(/<(i|em)>abc<\/(i|em)>/.test(await textareaValue('demo-full')), 'non-cancelled action applied');
	const beforeCancel = await textareaValue('demo-full');
	await page.click(btnSel('demo-full', 'underline'));
	assert((await page.evaluate(() => window.__before)).includes('underline'), 'before-change fired for underline');
	assert(await textareaValue('demo-full') === beforeCancel, 'preventDefault on before-change blocks the formatting');

	section('Full toolbar: block formats toggle');
	await typeInto('demo-full', 'Title');
	await page.click(btnSel('demo-full', 'heading-2'));
	assert(/<h2>Title<\/h2>/.test(await textareaValue('demo-full')), 'heading-2 produces <h2>');
	assert(await pressed('demo-full', 'heading-2') === 'true', 'heading-2 aria-pressed="true"');
	await page.click(btnSel('demo-full', 'heading-2'));
	const toggledOff = await textareaValue('demo-full');
	assert(!/<h2>/.test(toggledOff) && /<p>Title<\/p>/.test(toggledOff), 'second heading-2 click reverts to <p>');
	await page.click(btnSel('demo-full', 'heading-3'));
	assert(/<h3>Title<\/h3>/.test(await textareaValue('demo-full')), 'heading-3 produces <h3>');
	await page.click(btnSel('demo-full', 'heading-4'));
	assert(/<h4>Title<\/h4>/.test(await textareaValue('demo-full')), 'heading-4 produces <h4>');
	await page.click(btnSel('demo-full', 'blockquote'));
	assert(/<blockquote>/.test(await textareaValue('demo-full')), 'blockquote produces <blockquote>');
	await page.click(btnSel('demo-full', 'code'));
	assert(/<pre>/.test(await textareaValue('demo-full')), 'code produces <pre>');

	section('Full toolbar: lists');
	await typeInto('demo-full', 'item');
	await page.click(btnSel('demo-full', 'unordered-list'));
	assert(/<ul><li>item<\/li><\/ul>/.test(await textareaValue('demo-full')), 'unordered-list produces <ul><li>');
	assert(await pressed('demo-full', 'unordered-list') === 'true', 'unordered-list aria-pressed="true"');
	await page.click(btnSel('demo-full', 'unordered-list'));
	assert(!/<ul>/.test(await textareaValue('demo-full')), 'second click removes the list');
	await page.click(btnSel('demo-full', 'ordered-list'));
	assert(/<ol><li>(<span[^>]*>)?item(<\/span>)?<\/li><\/ol>/.test(await textareaValue('demo-full')), 'ordered-list produces <ol><li>');

	// ─── Focus / blur ──────────────────────────────────────────
	section('Focus and blur notifications');
	await record('demo-minimal');
	await focusSurface('demo-minimal');
	await page.waitForFunction(() => window.__ev['demo-minimal'].some(e => e.name === 'focus'), { timeout: 3000 });
	assert((await events('demo-minimal', 'focus')).length >= 1, 'ln-editor:focus fired on surface focus');
	await page.evaluate(sel => document.querySelector(sel).blur(), surfaceSel('demo-minimal'));
	await page.waitForFunction(() => window.__ev['demo-minimal'].some(e => e.name === 'blur'), { timeout: 3000 });
	assert((await events('demo-minimal', 'blur')).length >= 1, 'ln-editor:blur fired on surface blur');

	// ─── Link popover ──────────────────────────────────────────
	section('Minimal toolbar: link popover insert');
	await typeInto('demo-minimal', 'site');
	await selectAll();
	await page.click(btnSel('demo-minimal', 'link'));
	await page.waitForSelector('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover', { timeout: 3000 });
	assert(await page.evaluate(() => {
		const dom = document.getElementById('demo-minimal').closest('[data-ln-editor]');
		return dom.querySelector('[role="toolbar"]').nextElementSibling.classList.contains('ln-editor__link-popover');
	}), 'link popover inserted right after the toolbar');
	await page.type('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover input[type="url"]', 'https://example.com');
	await page.click(btnSel('demo-minimal', 'confirm-link'));
	const linked = await textareaValue('demo-minimal');
	assert(/<a href="https:\/\/example\.com\/?"[^>]*>site<\/a>/.test(linked), 'confirm-link wraps selection in <a href>');
	assert(/rel="noopener noreferrer"/.test(linked), 'created link gets rel="noopener noreferrer"');
	assert(await page.$('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover') === null, 'popover removed after confirm');

	section('Minimal toolbar: link popover cancel via Escape');
	await typeInto('demo-minimal', 'plain');
	await selectAll();
	await page.click(btnSel('demo-minimal', 'link'));
	await page.waitForSelector('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover', { timeout: 3000 });
	await page.type('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover input[type="url"]', 'https://nope.example');
	await page.keyboard.press('Escape');
	assert(await page.$('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover') === null, 'Escape closes popover');
	assert(!/<a /.test(await textareaValue('demo-minimal')), 'Escape inserts no link');

	section('Minimal toolbar: link popover Enter applies');
	await selectAll();
	await page.click(btnSel('demo-minimal', 'link'));
	await page.waitForSelector('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover', { timeout: 3000 });
	await page.type('[data-ln-editor]:has(#demo-minimal) .ln-editor__link-popover input[type="url"]', 'https://enter.example');
	await page.keyboard.press('Enter');
	assert(/<a href="https:\/\/enter\.example\/?"/.test(await textareaValue('demo-minimal')), 'Enter in URL input applies the link');

	section('Full toolbar: unlink');
	await page.evaluate(() => {
		document.getElementById('demo-full').closest('[data-ln-editor]').lnEditor.setHTML('<p><a href="https://a.example">x</a></p>');
	});
	await page.evaluate(sel => {
		const a = document.querySelector(sel + ' a');
		document.querySelector(sel).focus();
		const range = document.createRange();
		range.selectNodeContents(a);
		const s = getSelection();
		s.removeAllRanges();
		s.addRange(range);
	}, surfaceSel('demo-full'));
	await page.click(btnSel('demo-full', 'unlink'));
	assert(!/<a /.test(await textareaValue('demo-full')), 'unlink removes the anchor');

	// ─── Paste sanitization ────────────────────────────────────
	section('Paste is sanitized (disallowed tags unwrapped, attributes stripped)');
	await typeInto('demo-minimal', '');
	await page.evaluate(sel => {
		const dt = new DataTransfer();
		dt.setData('text/html', '<p style="color:red" onclick="x()">ok <span class="s">unwrapped</span></p>');
		document.querySelector(sel).dispatchEvent(new ClipboardEvent('paste', { clipboardData: dt, bubbles: true, cancelable: true }));
	}, surfaceSel('demo-minimal'));
	const pasted = await surfaceHtml('demo-minimal');
	assert(pasted.includes('unwrapped'), 'pasted text kept');
	assert(!/<span|style=|onclick|class="s"/.test(pasted), 'span unwrapped, style/onclick/class stripped');

	// ─── Textarea -> surface ───────────────────────────────────
	section('Textarea input is mirrored back into the surface');
	await record('demo-minimal');
	await page.evaluate(() => {
		const ta = document.getElementById('demo-minimal');
		ta.value = '<p>from textarea</p>';
		ta.dispatchEvent(new Event('input', { bubbles: true }));
	});
	assert(await surfaceHtml('demo-minimal') === '<p>from textarea</p>', 'surface innerHTML follows textarea value');
	assert((await events('demo-minimal', 'changed')).length === 1, 'ln-editor:changed fired once for textarea-driven update');

	// ─── Programmatic control ──────────────────────────────────
	section('Programmatic: Set content (ln-editor:set-content request event)');
	await record('demo-prog');
	await page.click('#demo-prog-set');
	assert(await page.$eval(surfaceSel('demo-prog'), el => el.querySelector('h2') && el.querySelector('h2').textContent === 'Programmatic Content' && el.querySelectorAll('ul li').length === 3 && el.querySelector('strong').textContent === 'textarea value'), 'surface shows h2, 3 list items and <strong>');
	assert(await textareaValue('demo-prog') === await surfaceHtml('demo-prog'), 'textarea value synced to surface HTML');
	assert((await events('demo-prog', 'changed')).length === 1, 'ln-editor:changed fired once');

	section('Programmatic: Read HTML');
	assert(await page.$eval('#demo-prog-output', el => el.hidden), 'output <pre> hidden before Read');
	await page.click('#demo-prog-read');
	assert(await page.evaluate(() => {
		const out = document.getElementById('demo-prog-output');
		const dom = document.getElementById('demo-prog-editor');
		return !out.hidden && out.textContent === dom.lnEditor.getHTML() && out.textContent.includes('Programmatic Content');
	}), 'output shown and equals getHTML()');

	section('Programmatic: Destroy');
	await page.click('#demo-prog-destroy');
	const destroyed = await page.evaluate(() => {
		const ta = document.getElementById('demo-prog');
		return {
			instance: document.getElementById('demo-prog-editor').lnEditor === undefined,
			surface: document.getElementById('demo-prog-surface') === null,
			source: ta.hasAttribute('data-ln-editor-source'),
			display: getComputedStyle(ta).display,
			value: ta.value.includes('Programmatic Content')
		};
	});
	assert(destroyed.instance, 'lnEditor instance removed');
	assert(destroyed.surface, 'surface removed from DOM');
	assert(!destroyed.source && destroyed.display !== 'none', 'textarea visible again, data-ln-editor-source removed');
	assert(destroyed.value, 'textarea keeps the synced HTML');

	section('Programmatic: Re-init');
	await page.click('#demo-prog-reinit');
	await page.waitForFunction(() => {
		const dom = document.getElementById('demo-prog-editor');
		return dom.lnEditor && document.getElementById('demo-prog-surface');
	}, { timeout: 3000 });
	const reinit = await page.evaluate(() => {
		const ta = document.getElementById('demo-prog');
		return {
			display: getComputedStyle(ta).display,
			seeded: document.getElementById('demo-prog-surface').querySelector('h2') !== null
		};
	});
	assert(reinit.display === 'none', 'textarea hidden again after re-init');
	assert(reinit.seeded, 'new surface seeded from textarea value');

	// ─── Form integration (last: demo handlers call lnForm.populate / lnForm.reset) ───
	section('Form integration: Save submits current HTML');
	assert(await page.$eval('#demo-form-output', el => el.hidden), 'output <pre> hidden before Save');
	await typeInto('demo-form-editor', 'Draft');
	await page.click('#demo-editor-form button[type="submit"]');
	await page.waitForFunction(() => !document.getElementById('demo-form-output').hidden, { timeout: 3000 });
	const saved = await page.$eval('#demo-form-output', el => JSON.parse(el.textContent));
	assert(saved.title === 'My First Article', 'submitted title is the input value');
	assert(saved.content === 'Draft', 'submitted content is the editor HTML (textarea synced)');

	section('Form integration: Load record fills title and editor');
	await page.click('#demo-form-populate');
	const populated = await page.waitForFunction(() => document.getElementById('demo-title').value === 'Architecture Review: Layer 1 Components', { timeout: 3000 }).then(() => true, () => false);
	assert(populated, 'Load record sets the title input');
	assert(await page.$eval(surfaceSel('demo-form-editor'), el => el.querySelector('h3').textContent === 'Overview' && el.querySelectorAll('li').length === 3), 'editor surface shows loaded record HTML (h3 + 3 li)');
	assert((await textareaValue('demo-form-editor')).startsWith('<h3>Overview</h3>'), 'textarea holds the loaded HTML');

	section('Form integration: Reset restores initial state');
	await page.click('#demo-form-reset');
	const resetOk = await page.waitForFunction(() => document.getElementById('demo-title').value === 'My First Article' && document.getElementById('demo-form-editor-surface').innerHTML === '', { timeout: 3000 }).then(() => true, () => false);
	assert(resetOk, 'Reset restores title and empties the editor');
	assert(await page.$eval('#demo-form-output', el => el.hidden), 'output <pre> hidden again after Reset');
	assert(await surfaceHtml('demo-form-editor') === '', 'editor surface emptied by form reset');
});
