import { run, BASE_URL } from './_harness.mjs';

run('Performance Benchmarks (Baseline Evaluation)', async ({ page }) => {
	console.log('\n========================================');
	console.log('   STARTING PERFORMANCE BENCHMARKS');
	console.log('========================================\n');

	await page.goto(BASE_URL + 'search.html', { waitUntil: 'load' });

	const results = await page.evaluate(async () => {
		const suiteResults = {};

		const waitFrames = (n = 2) => new Promise(resolve => {
			let count = 0;
			function step() {
				if (++count >= n) resolve();
				else requestAnimationFrame(step);
			}
			requestAnimationFrame(step);
		});

		// ═════════════════════════════════════════════════════════
		// GROUP 1: DOM WRITE GUARDS
		// ═════════════════════════════════════════════════════════

		// 1.1: ln-search (500 items, 5 search queries)
		{
			const container = document.createElement('div');
			container.innerHTML = `
				<input id="bench-search-input" data-ln-search-for="bench-search-target" />
				<div id="bench-search-target" data-ln-search></div>
			`;
			document.body.appendChild(container);

			const target = document.getElementById('bench-search-target');
			const input = document.getElementById('bench-search-input');

			for (let i = 0; i < 500; i++) {
				const item = document.createElement('div');
				item.className = 'search-item';
				item.textContent = `User ${i} item with role ${i % 3 === 0 ? 'admin' : (i % 2 === 0 ? 'editor' : 'viewer')} department ${i % 5}`;
				target.appendChild(item);
			}

			window.lnSearch && window.lnSearch(target);
			window.lnSearchControl && window.lnSearchControl(input);

			let mutationCount = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'data-ln-search-hide') mutationCount++;
				}
			});
			observer.observe(target, { attributes: true, subtree: true, attributeFilter: ['data-ln-search-hide'] });

			const queries = ['admin', 'editor', 'user 1', 'viewer', ''];
			const start = performance.now();

			for (const q of queries) {
				input.value = q;
				input.dispatchEvent(new Event('input', { bubbles: true }));
				await waitFrames(1);
				mutationCount += observer.takeRecords().length;
			}

			const duration = performance.now() - start;
			observer.disconnect();
			target.lnSearch && target.lnSearch.destroy && target.lnSearch.destroy();
			input.lnSearchControl && input.lnSearchControl.destroy && input.lnSearchControl.destroy();
			container.remove();

			suiteResults.search = {
				name: 'ln-search (500 items, 5 queries)',
				mutations: mutationCount,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 1.2: ln-filter (500 table rows, 4 filter changes)
		{
			const container = document.createElement('div');
			container.innerHTML = `
				<div id="bench-filter" data-ln-filter="bench-filter-table">
					<input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="active" id="f-active">
					<input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="pending" id="f-pending">
				</div>
				<table id="bench-filter-table">
					<thead>
						<tr>
							<th data-ln-filter-key="status">Status</th>
							<th>Role</th>
						</tr>
					</thead>
					<tbody></tbody>
				</table>
			`;
			document.body.appendChild(container);

			const tbody = container.querySelector('tbody');
			for (let i = 0; i < 500; i++) {
				const tr = document.createElement('tr');
				const st = i % 2 === 0 ? 'active' : (i % 3 === 0 ? 'pending' : 'archived');
				tr.setAttribute('data-status', st);
				tr.innerHTML = `<td>${st}</td><td>User ${i}</td>`;
				tbody.appendChild(tr);
			}

			const filterEl = document.getElementById('bench-filter');
			window.lnFilter && window.lnFilter(filterEl);

			let mutationCount = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'data-ln-filter-hide') mutationCount++;
				}
			});
			observer.observe(tbody, { attributes: true, subtree: true, attributeFilter: ['data-ln-filter-hide'] });

			const start = performance.now();
			const cbActive = document.getElementById('f-active');
			const cbPending = document.getElementById('f-pending');

			cbActive.checked = true;
			cbActive.dispatchEvent(new Event('change', { bubbles: true }));
			await waitFrames(1);
			mutationCount += observer.takeRecords().length;

			cbPending.checked = true;
			cbPending.dispatchEvent(new Event('change', { bubbles: true }));
			await waitFrames(1);
			mutationCount += observer.takeRecords().length;

			cbActive.checked = false;
			cbActive.dispatchEvent(new Event('change', { bubbles: true }));
			await waitFrames(1);
			mutationCount += observer.takeRecords().length;

			cbPending.checked = false;
			cbPending.dispatchEvent(new Event('change', { bubbles: true }));
			await waitFrames(1);
			mutationCount += observer.takeRecords().length;

			const duration = performance.now() - start;
			observer.disconnect();
			filterEl.lnFilter && filterEl.lnFilter.destroy && filterEl.lnFilter.destroy();
			container.remove();

			suiteResults.filter = {
				name: 'ln-filter (500 rows, 4 filter changes)',
				mutations: mutationCount,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 1.3: ln-validate (Typing 30 keystrokes into touched field)
		{
			const container = document.createElement('div');
			container.innerHTML = `
				<form id="bench-val-form">
					<div class="form-element">
						<input id="bench-val-input" data-ln-validate required minlength="5" value="initial" />
						<div data-ln-errors><span data-ln-error="valueMissing" class="hidden">Required</span><span data-ln-error="tooShort" class="hidden">Too short</span></div>
					</div>
				</form>
			`;
			document.body.appendChild(container);

			const input = document.getElementById('bench-val-input');
			window.lnValidate && window.lnValidate(input);

			let attrMutations = 0;
			let customEvents = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'aria-invalid') attrMutations++;
				}
			});
			observer.observe(input, { attributes: true, attributeFilter: ['aria-invalid'] });

			input.addEventListener('ln-validate:valid', () => customEvents++);
			input.addEventListener('ln-validate:invalid', () => customEvents++);

			const text = 'testing_validation_perf_speed';
			const start = performance.now();

			for (let i = 0; i < text.length; i++) {
				input.value += text[i];
				input.dispatchEvent(new Event('input', { bubbles: true }));
				attrMutations += observer.takeRecords().length;
			}

			const duration = performance.now() - start;
			observer.disconnect();
			input.lnValidate && input.lnValidate.destroy && input.lnValidate.destroy();
			container.remove();

			suiteResults.validate = {
				name: 'ln-validate (30 keystrokes typing)',
				ariaInvalidMutations: attrMutations,
				dispatchedEvents: customEvents,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 1.4: ln-tabs (10 tabs/panels, 10 tab switches)
		{
			const container = document.createElement('div');
			let tabsHtml = '<section id="bench-tabs" data-ln-tabs><nav>';
			let panelsHtml = '';
			for (let i = 0; i < 10; i++) {
				tabsHtml += `<button type="button" data-ln-tab="t${i}">Tab ${i}</button>`;
				panelsHtml += `<div data-ln-panel="t${i}">Panel ${i}</div>`;
			}
			tabsHtml += '</nav>' + panelsHtml + '</section>';
			container.innerHTML = tabsHtml;
			document.body.appendChild(container);

			const tabsEl = document.getElementById('bench-tabs');
			window.lnTabs && window.lnTabs(tabsEl);

			let tabMutations = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (['aria-selected', 'data-active', 'aria-hidden', 'hidden'].includes(r.attributeName)) {
						tabMutations++;
					}
				}
			});
			observer.observe(tabsEl, { attributes: true, subtree: true, attributeFilter: ['aria-selected', 'data-active', 'aria-hidden', 'hidden'] });

			const start = performance.now();
			const buttons = tabsEl.querySelectorAll('button[data-ln-tab]');
			for (let i = 0; i < buttons.length; i++) {
				buttons[i].click();
				tabMutations += observer.takeRecords().length;
			}

			const duration = performance.now() - start;
			observer.disconnect();
			tabsEl.lnTabs && tabsEl.lnTabs.destroy && tabsEl.lnTabs.destroy();
			container.remove();

			suiteResults.tabs = {
				name: 'ln-tabs (10 tabs, 10 switches)',
				tabMutations: tabMutations,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// ═════════════════════════════════════════════════════════
		// GROUP 2: HIGH-FREQUENCY / RAF BATCHING
		// ═════════════════════════════════════════════════════════

		// 2.1: ln-autoresize (50 rapid keystrokes into textarea)
		{
			const container = document.createElement('div');
			container.innerHTML = `<textarea id="bench-textarea" data-ln-autoresize rows="2" style="overflow:hidden;"></textarea>`;
			document.body.appendChild(container);

			const ta = document.getElementById('bench-textarea');
			window.lnAutoresize && window.lnAutoresize(ta);

			const start = performance.now();
			for (let i = 0; i < 50; i++) {
				ta.value += `Line ${i} of text in autoresize test\n`;
				ta.dispatchEvent(new Event('input', { bubbles: true }));
			}
			await waitFrames(2);
			const duration = performance.now() - start;

			ta.lnAutoresize && ta.lnAutoresize.destroy && ta.lnAutoresize.destroy();
			container.remove();

			suiteResults.autoresize = {
				name: 'ln-autoresize (50 keystrokes)',
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 2.2: ln-dropdown (50 scroll events while open)
		{
			const container = document.createElement('div');
			container.innerHTML = `
				<div id="bench-dropdown" data-ln-dropdown style="position:relative; margin: 100px 0;">
					<button id="bench-drop-btn" data-ln-dropdown-trigger>Menu</button>
					<div data-ln-dropdown-menu class="hidden" style="position:absolute;">
						<a href="#1">Item 1</a>
						<a href="#2">Item 2</a>
					</div>
				</div>
			`;
			document.body.appendChild(container);

			const dropEl = document.getElementById('bench-dropdown');
			window.lnDropdown && window.lnDropdown(dropEl);

			const btn = document.getElementById('bench-drop-btn');
			btn.click(); // Open dropdown

			let placementWrites = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'data-ln-dropdown-placement') placementWrites++;
				}
			});
			observer.observe(dropEl, { attributes: true, subtree: true, attributeFilter: ['data-ln-dropdown-placement'] });

			const start = performance.now();
			for (let i = 0; i < 50; i++) {
				window.dispatchEvent(new Event('scroll'));
				placementWrites += observer.takeRecords().length;
			}
			await waitFrames(2);
			const duration = performance.now() - start;

			observer.disconnect();
			dropEl.lnDropdown && dropEl.lnDropdown.destroy && dropEl.lnDropdown.destroy();
			container.remove();

			suiteResults.dropdown = {
				name: 'ln-dropdown (50 scroll ticks while open)',
				placementAttrWrites: placementWrites,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 2.3: ln-popover (50 scroll events while open)
		{
			const container = document.createElement('div');
			container.innerHTML = `
				<button id="bench-pop-btn" data-ln-popover-trigger="bench-pop">Popover</button>
				<div id="bench-pop" popover data-ln-popover style="position:fixed;">
					Popover Content
				</div>
			`;
			document.body.appendChild(container);

			const popEl = document.getElementById('bench-pop');
			const btn = document.getElementById('bench-pop-btn');
			window.lnPopover && window.lnPopover(popEl);

			btn.click(); // Open popover

			let placementWrites = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'data-ln-popover-placement') placementWrites++;
				}
			});
			observer.observe(popEl, { attributes: true, subtree: true, attributeFilter: ['data-ln-popover-placement'] });

			const start = performance.now();
			for (let i = 0; i < 50; i++) {
				window.dispatchEvent(new Event('scroll'));
				placementWrites += observer.takeRecords().length;
			}
			await waitFrames(2);
			const duration = performance.now() - start;

			observer.disconnect();
			popEl.lnPopover && popEl.lnPopover.close && popEl.lnPopover.close();
			popEl.lnPopover && popEl.lnPopover.destroy && popEl.lnPopover.destroy();
			container.remove();

			suiteResults.popover = {
				name: 'ln-popover (50 scroll ticks while open)',
				placementAttrWrites: placementWrites,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// 2.4: ln-sortable (50 pointermove events while dragging)
		{
			const container = document.createElement('ul');
			container.setAttribute('data-ln-sortable', '');
			for (let i = 0; i < 20; i++) {
				const li = document.createElement('li');
				li.textContent = `Sortable Item ${i}`;
				container.appendChild(li);
			}
			document.body.appendChild(container);
			window.lnSortable && window.lnSortable(container);

			const first = container.children[0];
			first.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 10, clientY: 10, pointerId: 1 }));

			let classMutations = 0;
			const observer = new MutationObserver(records => {
				for (const r of records) {
					if (r.attributeName === 'class') classMutations++;
				}
			});
			observer.observe(container, { attributes: true, subtree: true, attributeFilter: ['class'] });

			const start = performance.now();
			for (let i = 0; i < 50; i++) {
				first.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 10, clientY: 15 + i * 2, pointerId: 1 }));
				classMutations += observer.takeRecords().length;
			}
			await waitFrames(2);
			const duration = performance.now() - start;

			first.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 10, clientY: 115, pointerId: 1 }));
			observer.disconnect();
			container.lnSortable && container.lnSortable.destroy && container.lnSortable.destroy();
			container.remove();

			suiteResults.sortable = {
				name: 'ln-sortable (50 pointermoves over 20 items)',
				classMutations: classMutations,
				timeMs: Math.round(duration * 100) / 100
			};
		}

		// ═════════════════════════════════════════════════════════
		// GROUP 3: GLOBAL LISTENER POOLING
		// ═════════════════════════════════════════════════════════

		// 3.1: ln-date / ln-number / ln-time (300 micro-instances mounting)
		{
			const container = document.createElement('div');
			let html = '';
			for (let i = 0; i < 100; i++) {
				html += `<time data-ln-date="short" datetime="2026-10-12">2026-10-12</time>`;
				html += `<strong data-ln-number="currency" data-ln-currency="EUR">1250</strong>`;
				html += `<time data-ln-time="relative" datetime="2026-10-12T10:00:00Z"></time>`;
			}
			container.innerHTML = html;

			const start = performance.now();
			document.body.appendChild(container);
			await waitFrames(1);

			const testStart = performance.now();
			document.dispatchEvent(new CustomEvent('ln-core:locale-change'));
			const dispatchDuration = performance.now() - testStart;

			const totalDuration = performance.now() - start;
			container.remove();

			suiteResults.microInstances = {
				name: 'ln-date/ln-number/ln-time (300 micro-components)',
				localeDispatchMs: Math.round(dispatchDuration * 100) / 100,
				totalMountMs: Math.round(totalDuration * 100) / 100
			};
		}

		// ═════════════════════════════════════════════════════════
		// GROUP 4: LIFECYCLE SUBTREE WATCHERS
		// ═════════════════════════════════════════════════════════

		// 4.1: 500 childList mutations on document
		{
			const container = document.createElement('div');
			document.body.appendChild(container);

			const start = performance.now();
			for (let i = 0; i < 500; i++) {
				const span = document.createElement('span');
				span.textContent = `Node ${i}`;
				container.appendChild(span);
			}
			await waitFrames(1);
			container.innerHTML = '';
			await waitFrames(1);
			const duration = performance.now() - start;

			container.remove();

			suiteResults.lifecycle = {
				name: 'ln-core lifecycle (500 childList DOM additions)',
				timeMs: Math.round(duration * 100) / 100
			};
		}

		return suiteResults;
	});

	console.log('\nBENCHMARK RESULTS (BASELINE):');
	console.log(JSON.stringify(results, null, 2));
});
