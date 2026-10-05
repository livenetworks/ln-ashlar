import { run, assert, BASE_URL } from './_harness.mjs';

// demo/admin/upload.html (source: demo/admin/src/pages/upload.html).
// Driven by a REAL library component: ln-upload (components/ln-upload/src/ln-upload.js),
// with ln-core fill()/cloneTemplateScoped(). The page ships an inline mock script that
// replaces XMLHttpRequest.send for POST /api/files* (animated progress 25/50/75/100 at 120ms,
// then a JSON response {id, name, size}). It does NOT mock DELETE: ln-upload removes via
// fetch(DELETE), so this test uses Puppeteer request interception with synthetic responses
// for DELETE /api/files/{id} (200 or 500). Nothing else is intercepted.
// Not testable: a failing upload (the page mock always succeeds, so ln-upload:error from the
// XHR path, retry action and data-ln-upload-state="error" on an item cannot be reached).
//
// Contradiction (page prose vs source): the Overview says files are uploaded via
// "fetch(FormData)"; ln-upload.js uploads with XMLHttpRequest. Asserted as [source].

const PAGE_URL = BASE_URL + 'upload.html';
const SSR = 2; // third uploader: SSR-hydrated edit form
const CONTAINER = '[data-ln-upload]';

run('demo/admin/upload.html', async ({ page }) => {

	const failures = [];
	const deletes = []; // { method, url } seen by request interception
	let deleteStatus = 200;
	let deleteWaiters = [];

	// Resolves once a DELETE for `path` has been seen by the interceptor (or rejects on timeout).
	const waitDelete = path => new Promise((resolve, reject) => {
		if (deletes.some(d => d.path === path)) return resolve();
		const timer = setTimeout(() => reject(new Error('No DELETE seen for ' + path)), 8000);
		deleteWaiters.push({ path, resolve: () => { clearTimeout(timer); resolve(); } });
	});

	await page.setRequestInterception(true);
	page.on('request', req => {
		const url = new URL(req.url());
		if (url.pathname.startsWith('/api/files/')) {
			deletes.push({ method: req.method(), path: url.pathname });
			deleteWaiters = deleteWaiters.filter(w => {
				if (w.path !== url.pathname) return true;
				w.resolve();
				return false;
			});
			req.respond({
				status: deleteStatus,
				contentType: 'application/json',
				body: '{}'
			});
			return;
		}
		req.continue();
	});

	await page.evaluateOnNewDocument(() => {
		window.__net = { open: [], fetch: [] };
		const realOpen = XMLHttpRequest.prototype.open;
		XMLHttpRequest.prototype.open = function (method, url) {
			window.__net.open.push({ method: String(method).toUpperCase(), url: String(url) });
			return realOpen.apply(this, arguments);
		};
		const realFetch = window.fetch;
		window.fetch = function (input, init) {
			window.__net.fetch.push({ method: ((init && init.method) || 'GET').toUpperCase(), url: String(input) });
			return realFetch.apply(this, arguments);
		};
	});

	async function section(title, fn) {
		console.log(`\n--- ${title} ---`);
		try {
			await fn();
		} catch (err) {
			failures.push(`${title}: ${err.message}`);
			console.error(`  section failed: ${err.message}`);
		}
	}

	async function load() {
		await page.goto(PAGE_URL, { waitUntil: 'load' });
		await page.waitForFunction(sel => {
			const els = document.querySelectorAll(sel);
			return els.length === 3 && Array.from(els).every(el => el.lnUpload);
		}, { timeout: 10000 }, CONTAINER);
		deletes.length = 0;
		deleteStatus = 200;
		// Record every ln-upload:* notification/lifecycle event, sanitised for serialisation.
		await page.evaluate(sel => {
			window.__ev = [];
			const types = ['request-upload', 'request-remove', 'request-clear', 'before-upload', 'before-remove',
				'before-clear', 'uploaded', 'progress', 'removed', 'error', 'invalid', 'cleared'];
			document.querySelectorAll(sel).forEach((el, i) => {
				types.forEach(t => el.addEventListener('ln-upload:' + t, e => {
					const d = Object.assign({}, e.detail);
					if (d.file) d.file = { name: d.file.name, size: d.file.size };
					if (d.error) d.error = String(d.error);
					delete d.files;
					window.__ev.push({ i, type: t, detail: d });
				}));
			});
		}, CONTAINER);
	}

	const events = (i, type) => page.evaluate((idx, t) => window.__ev
		.filter(e => e.i === idx && e.type === t).map(e => e.detail), i, type);

	const waitEvents = (i, type, count) => page.waitForFunction((idx, t, n) =>
		window.__ev.filter(e => e.i === idx && e.type === t).length >= n, { timeout: 8000 }, i, type, count);

	const fileIds = i => page.evaluate(idx => document.querySelectorAll('[data-ln-upload]')[idx].lnUpload.getFileIds().map(String), i);

	const hiddenIds = i => page.evaluate(idx => Array.from(document.querySelectorAll('[data-ln-upload]')[idx]
		.querySelectorAll('input[type="hidden"][name="file_ids[]"]')).map(el => el.value), i);

	const itemCount = i => page.evaluate(idx => document.querySelectorAll('[data-ln-upload]')[idx]
		.querySelectorAll('[data-ln-upload-list] > [data-ln-upload-item]').length, i);

	// Builds File objects in the page and dispatches a drop on the uploader's zone.
	// Returns a snapshot of the list taken synchronously right after the drop.
	const dropFiles = (i, specs) => page.evaluate((idx, list) => {
		const root = document.querySelectorAll('[data-ln-upload]')[idx];
		const dt = new DataTransfer();
		list.forEach(s => dt.items.add(new File([new Uint8Array(s.size)], s.name, { type: s.type || '' })));
		root.querySelector('[data-ln-upload-zone]').dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
		return Array.from(root.querySelectorAll('[data-ln-upload-list] > [data-ln-upload-item]')).map(li => ({
			state: li.getAttribute('data-ln-upload-state'),
			removeDisabled: li.querySelector('[data-ln-upload-action="remove"]').disabled,
			size: li.querySelector('[data-ln-field="sizeText"]').textContent
		}));
	}, i, specs);

	// Expected sizeText derived from the component's own locale + native Intl (ln-upload formatFileSize).
	const sizeText = (i, bytes) => page.evaluate((idx, b) => {
		const locale = document.querySelectorAll('[data-ln-upload]')[idx].lnUpload.locale;
		const k = 1024;
		const units = ['B', 'KB', 'MB', 'GB'];
		const u = Math.min(Math.floor(Math.log(b) / Math.log(k)), 3);
		return new Intl.NumberFormat(locale, { maximumFractionDigits: 1, minimumFractionDigits: 0 }).format(b / Math.pow(k, u)) + ' ' + units[u];
	}, i, bytes);

	const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

	const itemInfo = (i, n) => page.evaluate((idx, pos) => {
		const li = document.querySelectorAll('[data-ln-upload]')[idx]
			.querySelectorAll('[data-ln-upload-list] > [data-ln-upload-item]')[pos];
		if (!li) return null;
		const btn = li.querySelector('[data-ln-upload-action="remove"]');
		return {
			state: li.getAttribute('data-ln-upload-state'),
			id: li.getAttribute('data-ln-upload-id'),
			localId: li.getAttribute('data-ln-upload-local-id'),
			ext: li.getAttribute('data-ln-upload-ext'),
			name: li.querySelector('[data-ln-field="name"]').textContent,
			size: li.querySelector('[data-ln-field="sizeText"]').textContent,
			progress: li.querySelector('[data-ln-progress]').getAttribute('data-ln-progress'),
			ariaLabel: btn.getAttribute('aria-label'),
			title: btn.getAttribute('title'),
			removeDisabled: btn.disabled,
			nameTag: li.querySelector('[data-ln-field="name"]').tagName
		};
	}, i, n);

	const clickRemove = (i, n) => page.evaluate((idx, pos) => {
		document.querySelectorAll('[data-ln-upload]')[idx]
			.querySelectorAll('[data-ln-upload-list] > [data-ln-upload-item]')[pos]
			.querySelector('[data-ln-upload-action="remove"]').click();
	}, i, n);

	// ─── Sections ──────────────────────────────────────────────

	await section('Mount and SSR hydration', async () => {
		await load();
		assert(await page.evaluate(sel => document.querySelectorAll(sel).length, CONTAINER) === 3, 'Three upload containers are mounted');
		assert(same(await fileIds(0), []) && same(await fileIds(1), []), 'Uploaders 1 and 2 start with no file ids');
		assert(same(await fileIds(SSR), ['101', '102']), 'SSR uploader getFileIds() === ["101","102"] [hidden inputs/items]');
		assert(same(await hiddenIds(SSR), ['101', '102']), 'SSR hidden inputs file_ids[] keep values 101,102');
		const files = await page.evaluate(idx => document.querySelectorAll('[data-ln-upload]')[idx].lnUpload.getFiles(), SSR);
		assert(same(files, [
			{ serverId: '101', name: 'financial_report_2025.pdf', size: 1258291 },
			{ serverId: '102', name: 'project_specifications.docx', size: 450560 }
		]), 'getFiles() hydrates name and size (from data-ln-upload-size) of SSR items');
		const locals = await page.evaluate(idx => Array.from(document.querySelectorAll('[data-ln-upload]')[idx]
			.querySelectorAll('[data-ln-upload-item]')).map(li => li.getAttribute('data-ln-upload-local-id')), SSR);
		assert(same(locals, ['file-1', 'file-2']), 'SSR items get data-ln-upload-local-id file-1, file-2');
		assert(await page.evaluate(() => !document.querySelector('[data-ln-upload-zone]').hasAttribute('data-ln-upload-state')),
			'Zone has no data-ln-upload-state at rest');
	});

	await section('Drag-and-drop zone states', async () => {
		await load();
		const states = await page.evaluate(() => {
			const zone = document.querySelector('[data-ln-upload-zone]');
			const fire = t => zone.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() }));
			const out = [];
			fire('dragenter'); out.push(zone.getAttribute('data-ln-upload-state'));
			fire('dragover'); out.push(zone.getAttribute('data-ln-upload-state'));
			fire('dragenter'); fire('dragleave'); out.push(zone.getAttribute('data-ln-upload-state'));
			fire('dragleave'); out.push(zone.getAttribute('data-ln-upload-state'));
			return out;
		});
		assert(same(states, ['dragover', 'dragover', 'dragover', null]),
			'dragenter/dragover set state=dragover; nested leave keeps it; final leave removes it: ' + JSON.stringify(states));
	});

	await section('Drop upload: progress, response, hidden input', async () => {
		await load();
		const snap = await dropFiles(0, [{ name: 'Report.PDF', size: 1536, type: 'application/pdf' }]);
		assert(snap.length === 1 && snap[0].state === 'uploading', 'Item is cloned from template with state=uploading');
		assert(snap[0].removeDisabled === true && snap[0].size === '0%', 'Remove disabled and sizeText "0%" while uploading');
		await waitEvents(0, 'uploaded', 1);
		const progress = (await events(0, 'progress')).map(d => d.percent);
		assert(same(progress, [25, 50, 75, 100]), 'Progress events 25,50,75,100 (page mock ticks): ' + JSON.stringify(progress));
		const up = (await events(0, 'uploaded'))[0];
		assert(up.name === 'Report.PDF' && up.size === 1536 && up.localId === 'file-1', 'uploaded detail has name, size, localId file-1');
		assert(String(up.serverId) === String(up.response.id) && up.response.size === 1536, 'uploaded detail serverId equals mock response id');
		const info = await itemInfo(0, 0);
		assert(info.state === null && info.id === String(up.serverId), 'Item loses state and gets data-ln-upload-id = serverId');
		assert(info.localId === 'file-1' && info.ext === 'pdf', 'Item local id file-1, ext normalised to "pdf"');
		assert(info.name === 'Report.PDF', 'Name field filled');
		assert(info.size === await sizeText(0, 1536), 'sizeText is locale-formatted size: ' + info.size);
		assert(info.progress === '100', 'data-ln-progress reaches 100');
		assert(info.removeDisabled === false, 'Remove enabled after success');
		assert(info.ariaLabel === 'Remove' && info.title === 'Remove', 'data-ln-attr sets aria-label/title from dict "Remove"');
		assert(same(await fileIds(0), [String(up.serverId)]) && same(await hiddenIds(0), [String(up.serverId)]),
			'getFileIds() and hidden input file_ids[] carry the server id');
		const net = await page.evaluate(() => window.__net);
		assert(net.open.some(o => o.method === 'POST' && o.url === '/api/files'), '[source] upload is an XMLHttpRequest POST to /api/files');
		assert(!net.fetch.some(f => f.method === 'POST'), '[source] no fetch POST is used for upload (page prose says fetch(FormData))');
	});

	await section('File picker change and zone click (custom template)', async () => {
		await load();
		const clicked = await page.evaluate(() => {
			const root = document.querySelectorAll('[data-ln-upload]')[1];
			const input = root.querySelector('input[type="file"]');
			let n = 0;
			input.addEventListener('click', e => { n++; e.preventDefault(); });
			root.querySelector('[data-ln-upload-zone]').click();
			return n;
		});
		assert(clicked === 1, 'Clicking the zone triggers the hidden file input click');
		await page.evaluate(() => {
			const root = document.querySelectorAll('[data-ln-upload]')[1];
			const input = root.querySelector('input[type="file"]');
			const dt = new DataTransfer();
			dt.items.add(new File([new Uint8Array(2048)], 'pic.png', { type: 'image/png' }));
			input.files = dt.files;
			input.dispatchEvent(new Event('change', { bubbles: true }));
		});
		await waitEvents(1, 'uploaded', 1);
		const info = await itemInfo(1, 0);
		assert(info.name === 'pic.png' && info.ext === 'png' && info.state === null, 'Picked file uploaded into second uploader');
		assert(info.nameTag === 'P', 'Custom template used (name rendered in <p> inside the scoped template)');
		assert(info.size === await sizeText(1, 2048), 'sizeText locale-formatted: ' + info.size);
		assert(await page.evaluate(() => document.querySelectorAll('[data-ln-upload]')[1].querySelector('input[type="file"]').files.length) === 0,
			'Input value is reset after change');
		assert(await itemCount(0) === 0, 'First uploader is unaffected');
	});

	await section('Validation: accept, max-size, max-files', async () => {
		await load();
		await dropFiles(0, [{ name: 'run.exe', size: 10 }]);
		let inv = await events(0, 'invalid');
		assert(inv.length === 1 && inv[0].reason === 'accept' && inv[0].file.name === 'run.exe', 'Disallowed extension -> invalid reason "accept"');
		assert(await itemCount(0) === 0, 'No item created for rejected file');
		await page.evaluate(() => document.querySelectorAll('[data-ln-upload]')[0].setAttribute('data-ln-upload-max-size', '1000'));
		await dropFiles(0, [{ name: 'big.pdf', size: 1500 }]);
		inv = await events(0, 'invalid');
		assert(inv.length === 2 && inv[1].reason === 'max-size', 'File over data-ln-upload-max-size -> invalid reason "max-size"');
		await page.evaluate(() => document.querySelectorAll('[data-ln-upload]')[0].removeAttribute('data-ln-upload-max-size'));
		await page.evaluate(idx => document.querySelectorAll('[data-ln-upload]')[idx].setAttribute('data-ln-upload-max-files', '2'), SSR);
		await dropFiles(SSR, [{ name: 'more.pdf', size: 10 }]);
		inv = await events(SSR, 'invalid');
		assert(inv.length === 1 && inv[0].reason === 'max-files', 'Third file with max-files=2 -> invalid reason "max-files"');
		assert(same(await fileIds(SSR), ['101', '102']), 'SSR files untouched after max-files rejection');
	});

	await section('Cancelable before-upload', async () => {
		await load();
		await page.evaluate(() => document.querySelectorAll('[data-ln-upload]')[1]
			.addEventListener('ln-upload:before-upload', e => e.preventDefault()));
		await dropFiles(1, [{ name: 'a.pdf', size: 10 }]);
		assert(await itemCount(1) === 0, 'preventDefault on before-upload creates no item');
		assert((await events(1, 'before-upload')).length === 1 && (await events(1, 'uploaded')).length === 0, 'before-upload fired once, no upload');
	});

	await section('Inbound request-upload command', async () => {
		await load();
		await page.evaluate(() => {
			const root = document.querySelectorAll('[data-ln-upload]')[0];
			root.dispatchEvent(new CustomEvent('ln-upload:request-upload', {
				detail: { files: [new File([new Uint8Array(100)], 'cmd.docx')] }
			}));
		});
		await waitEvents(0, 'uploaded', 1);
		const info = await itemInfo(0, 0);
		assert(info.name === 'cmd.docx' && info.ext === 'docx', 'request-upload uploads the file (ext docx)');
	});

	await section('Remove an uploaded file (DELETE succeeds)', async () => {
		await load();
		await dropFiles(0, [{ name: 'del.pdf', size: 100 }]);
		await waitEvents(0, 'uploaded', 1);
		const id = String((await events(0, 'uploaded'))[0].serverId);
		await clickRemove(0, 0);
		await waitEvents(0, 'removed', 1);
		assert(same(deletes, [{ method: 'DELETE', path: '/api/files/' + id }]), 'DELETE sent to data-ln-upload-delete pattern with {id} substituted: ' + JSON.stringify(deletes));
		assert(await itemCount(0) === 0, 'Item removed from list');
		assert(same(await fileIds(0), []) && same(await hiddenIds(0), []), 'File id and hidden input removed');
		const rem = (await events(0, 'removed'))[0];
		assert(String(rem.serverId) === id && rem.localId === 'file-1', 'removed detail has serverId and localId');
	});

	await section('Remove fails (DELETE 500)', async () => {
		await load();
		await dropFiles(0, [{ name: 'keep.pdf', size: 100 }]);
		await waitEvents(0, 'uploaded', 1);
		const id = String((await events(0, 'uploaded'))[0].serverId);
		deleteStatus = 500;
		await clickRemove(0, 0);
		await waitEvents(0, 'error', 1);
		const err = (await events(0, 'error'))[0];
		assert(err.status === 500, 'error event status 500');
		assert(await itemCount(0) === 1 && (await itemInfo(0, 0)).state === null, 'Item stays and deleting state is cleared');
		assert(same(await fileIds(0), [id]) && same(await hiddenIds(0), [id]), 'File id and hidden input kept after failed delete');
		assert((await events(0, 'removed')).length === 0, 'No removed event');
	});

	await section('SSR edit form: upload and remove keep server ids', async () => {
		await load();
		await dropFiles(SSR, [{ name: 'new.jpg', size: 100 }]);
		await waitEvents(SSR, 'uploaded', 1);
		const newId = String((await events(SSR, 'uploaded'))[0].serverId);
		assert(same(await fileIds(SSR), ['101', '102', newId]), 'New upload appended without wiping 101,102');
		assert(same(await hiddenIds(SSR), ['101', '102', newId]), 'Hidden inputs are 101,102 + new id');
		assert(await itemCount(SSR) === 3, 'Three items listed');
		await clickRemove(SSR, 0);
		await waitEvents(SSR, 'removed', 1);
		assert(same(deletes, [{ method: 'DELETE', path: '/api/files/101' }]), 'Removing SSR item 101 sends DELETE /api/files/101');
		assert(same(await hiddenIds(SSR), ['102', newId]) && same(await fileIds(SSR), ['102', newId]), 'Only 101 removed; 102 and new id remain');
		const ssrRem = (await events(SSR, 'removed'))[0];
		assert(ssrRem.serverId === '101' && ssrRem.localId === 'file-1', 'removed detail serverId "101", localId "file-1"');
	});

	await section('Inbound request-remove, cancelable before-remove, request-clear', async () => {
		await load();
		await page.evaluate(idx => {
			const root = document.querySelectorAll('[data-ln-upload]')[idx];
			root.addEventListener('ln-upload:before-remove', e => { if (window.__blockRemove) e.preventDefault(); });
			root.addEventListener('ln-upload:before-clear', e => { if (window.__blockClear) e.preventDefault(); });
			window.__blockRemove = true;
			root.dispatchEvent(new CustomEvent('ln-upload:request-remove', { detail: { serverId: '102' } }));
		}, SSR);
		assert((await events(SSR, 'before-remove')).length === 1 && (await itemCount(SSR)) === 2 && deletes.length === 0,
			'preventDefault on before-remove keeps item and sends no DELETE');
		await page.evaluate(idx => {
			window.__blockRemove = false;
			document.querySelectorAll('[data-ln-upload]')[idx]
				.dispatchEvent(new CustomEvent('ln-upload:request-remove', { detail: { serverId: '102' } }));
		}, SSR);
		await waitEvents(SSR, 'removed', 1);
		assert(same(deletes, [{ method: 'DELETE', path: '/api/files/102' }]) && same(await fileIds(SSR), ['101']),
			'request-remove by serverId removes 102 (DELETE /api/files/102)');
		await page.evaluate(idx => {
			window.__blockClear = true;
			document.querySelectorAll('[data-ln-upload]')[idx].dispatchEvent(new CustomEvent('ln-upload:request-clear', { detail: {} }));
		}, SSR);
		assert((await events(SSR, 'cleared')).length === 0 && await itemCount(SSR) === 1, 'preventDefault on before-clear keeps files');
		await page.evaluate(idx => {
			window.__blockClear = false;
			document.querySelectorAll('[data-ln-upload]')[idx].dispatchEvent(new CustomEvent('ln-upload:request-clear', { detail: {} }));
		}, SSR);
		await waitEvents(SSR, 'cleared', 1);
		assert(await itemCount(SSR) === 0 && same(await fileIds(SSR), []) && same(await hiddenIds(SSR), []),
			'request-clear empties list, ids and hidden inputs');
		await waitDelete('/api/files/101');
		assert(deletes.some(d => d.path === '/api/files/101'), 'clear() fires DELETE /api/files/101 for the remaining server file');
	});

	if (failures.length) {
		throw new Error('Sections failed:\n  - ' + failures.join('\n  - '));
	}
});
