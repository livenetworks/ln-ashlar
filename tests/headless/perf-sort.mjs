import { run, BASE_URL } from './_harness.mjs';

run('Performance Benchmark: 6 Columns with Strings, ln-date, ln-number (Before vs After)', async ({ page }) => {
	console.log('\n========================================================================');
	console.log('   BENCHMARK: 6-COLUMN TABLE (STRINGS, LN-DATE, LN-NUMBER)');
	console.log('========================================================================\n');

	await page.goto(BASE_URL + 'tables.html', { waitUntil: 'load' });

	const results = await page.evaluate(async () => {
		const suiteResults = {};

		const names = [
			'Alexander Smith', 'Beatrix Potter', 'Charles Darwin', 'Diana Prince',
			'Edward Norton', 'Fiona Gallagher', 'George Clark', 'Hannah Abbott',
			'Ian Malcolm', 'Julia Roberts', 'Kevin Bacon', 'Laura Croft',
			'Michael Scott', 'Nina Simone', 'Oscar Wilde', 'Penelope Cruz'
		];

		const codes = ['DOC-A', 'INV-B', 'REC-C', 'ORD-D', 'REQ-E', 'TSK-F', 'LOG-G'];

		// Generates a 6-column SSR HTML table
		function generate6ColumnTable(rowCount) {
			const container = document.createElement('div');
			const table = document.createElement('table');
			table.className = 'table table--striped';
			const tbody = document.createElement('tbody');

			for (let i = 0; i < rowCount; i++) {
				const tr = document.createElement('tr');

				// 1. String Column (Code)
				const tdCode = document.createElement('td');
				const codeSpan = document.createElement('span');
				codeSpan.setAttribute('data-ln-field', 'code');
				codeSpan.textContent = codes[(i * 3 + 1) % codes.length] + '-' + (1000 + ((i * 37) % 9000));
				tdCode.appendChild(codeSpan);

				// 2. String Column (Full Name)
				const tdName = document.createElement('td');
				const nameSpan = document.createElement('span');
				nameSpan.setAttribute('data-ln-field', 'name');
				nameSpan.textContent = names[(i * 7 + 5) % names.length] + ' ' + (i % 20);
				tdName.appendChild(nameSpan);

				// 3. Date Column (ln-date: Created Date with timestamp in seconds)
				const tdCreated = document.createElement('td');
				const timeCreated = document.createElement('time');
				timeCreated.setAttribute('data-ln-field', 'created');
				timeCreated.setAttribute('data-ln-date', 'short');
				const createdTimestamp = 1740000000 + ((i * 86400 * 3) % 31536000);
				timeCreated.setAttribute('data-ln-value', String(createdTimestamp));
				timeCreated.setAttribute('datetime', '2025-06-14');
				timeCreated.textContent = '14 Окт 2025'; // Localized display string is decoupled from sort
				tdCreated.appendChild(timeCreated);

				// 4. Date Column (ln-date: Due Date with timestamp in seconds)
				const tdDue = document.createElement('td');
				const timeDue = document.createElement('time');
				timeDue.setAttribute('data-ln-field', 'due');
				timeDue.setAttribute('data-ln-date', 'medium');
				const dueTimestamp = 1770000000 + ((i * 86400 * 5) % 31536000);
				timeDue.setAttribute('data-ln-value', String(dueTimestamp));
				timeDue.setAttribute('datetime', '2026-09-22');
				timeDue.textContent = '22 Сеп 2026';
				tdDue.appendChild(timeDue);

				// 5. Number Column (ln-number: Amount with currency formatting)
				const tdAmount = document.createElement('td');
				const strongAmount = document.createElement('strong');
				strongAmount.setAttribute('data-ln-field', 'amount');
				strongAmount.setAttribute('data-ln-number', '');
				const rawAmount = ((i * 1234.56) % 85000 + 100).toFixed(2);
				strongAmount.setAttribute('data-ln-value', rawAmount);
				strongAmount.textContent = '$' + Number(rawAmount).toLocaleString('en-US');
				tdAmount.appendChild(strongAmount);

				// 6. Number Column (ln-number: Points with <data value="...">)
				const tdPoints = document.createElement('td');
				const dataPoints = document.createElement('data');
				dataPoints.setAttribute('data-ln-field', 'points');
				dataPoints.setAttribute('data-ln-number', '');
				const rawPoints = String((i * 47) % 5000);
				dataPoints.setAttribute('value', rawPoints);
				dataPoints.textContent = rawPoints + ' pts';
				tdPoints.appendChild(dataPoints);

				tr.appendChild(tdCode);
				tr.appendChild(tdName);
				tr.appendChild(tdCreated);
				tr.appendChild(tdDue);
				tr.appendChild(tdAmount);
				tr.appendChild(tdPoints);

				tbody.appendChild(tr);
			}

			table.appendChild(tbody);
			container.appendChild(table);
			document.body.appendChild(container);

			return { container, tbody };
		}

		// Core readValue function matching ln-core
		function readValue(el) {
			if (!el) return '';
			if (typeof el.getAttribute === 'function') {
				if (el.hasAttribute('value')) return el.getAttribute('value') || '';
				if (el.hasAttribute('data-ln-value')) return el.getAttribute('data-ln-value') || '';
				if (el.tagName === 'TIME' && el.hasAttribute('datetime')) return el.getAttribute('datetime') || '';
			}
			return (el.textContent || '').trim();
		}

		// Detect and compare matching ln-core
		function detectType(sampleVal) {
			if (!isNaN(Number(sampleVal)) && sampleVal.trim() !== '') return 'number';
			if (/^\d{4}-\d{2}-\d{2}/.test(sampleVal)) return 'date';
			return 'string';
		}

		function compareValues(a, b, type, collator) {
			if (type === 'number') {
				const numA = Number(a) || 0;
				const numB = Number(b) || 0;
				return numA - numB;
			}
			if (type === 'date') {
				const dateA = new Date(a).getTime() || 0;
				const dateB = new Date(b).getTime() || 0;
				return dateA - dateB;
			}
			if (collator) return collator.compare(a, b);
			return String(a).localeCompare(String(b));
		}

		function benchmarkField(rowCount, fieldName, iterations = 15) {
			const { container, tbody } = generate6ColumnTable(rowCount);
			const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true });

			// Read once to determine type
			const sampleEl = tbody.querySelector('[data-ln-field="' + fieldName + '"]');
			const type = detectType(readValue(sampleEl));

			// ─── BEFORE ALGORITHM (Legacy: reads DOM inside comparator) ───
			let beforeReads = 0;
			function readItemValueBefore(item) {
				beforeReads++;
				const el = item.querySelector('[data-ln-field="' + fieldName + '"]');
				return el ? readValue(el) : '';
			}

			const startBefore = performance.now();
			for (let iter = 0; iter < iterations; iter++) {
				const dir = iter % 2 === 0 ? 'asc' : 'desc';
				const mult = dir === 'desc' ? -1 : 1;
				const items = Array.from(tbody.children);

				const comparator = function (a, b) {
					const valA = readItemValueBefore(a);
					const valB = readItemValueBefore(b);
					return compareValues(valA, valB, type, collator) * mult;
				};

				const ordered = items.slice().sort(comparator);
				const frag = document.createDocumentFragment();
				for (let i = 0; i < ordered.length; i++) {
					frag.appendChild(ordered[i]);
				}
				tbody.appendChild(frag);
			}
			const durationBefore = performance.now() - startBefore;

			// ─── AFTER ALGORITHM (Schwartzian: maps DOM once, sorts in RAM) ───
			let afterReads = 0;
			function readItemValueAfter(item) {
				afterReads++;
				const el = item.querySelector('[data-ln-field="' + fieldName + '"]');
				return el ? readValue(el) : '';
			}

			const startAfter = performance.now();
			for (let iter = 0; iter < iterations; iter++) {
				const dir = iter % 2 === 0 ? 'asc' : 'desc';
				const mult = dir === 'desc' ? -1 : 1;
				const items = Array.from(tbody.children);

				const mapped = items.map(function (el) {
					return { el: el, val: readItemValueAfter(el) };
				});

				const comparator = function (entryA, entryB) {
					return compareValues(entryA.val, entryB.val, type, collator) * mult;
				};

				mapped.sort(comparator);
				const frag = document.createDocumentFragment();
				for (let i = 0; i < mapped.length; i++) {
					frag.appendChild(mapped[i].el);
				}
				tbody.appendChild(frag);
			}
			const durationAfter = performance.now() - startAfter;

			container.remove();

			const avgBeforeMs = durationBefore / iterations;
			const avgAfterMs = durationAfter / iterations;
			const readsPerSortBefore = beforeReads / iterations;
			const readsPerSortAfter = afterReads / iterations;

			return {
				field: fieldName,
				type,
				beforeAvgMs: Math.round(avgBeforeMs * 100) / 100,
				beforeReads: Math.round(readsPerSortBefore),
				afterAvgMs: Math.round(avgAfterMs * 100) / 100,
				afterReads: Math.round(readsPerSortAfter),
				readsReduction: Math.round((1 - (readsPerSortAfter / readsPerSortBefore)) * 100) + '%'
			};
		}

		// Run across the 3 core types: String, Date, and Number for 40 rows and 100 rows
		suiteResults['40_rows'] = {
			stringSort: benchmarkField(40, 'name'),
			dateSort: benchmarkField(40, 'created'),
			numberSort: benchmarkField(40, 'amount')
		};

		suiteResults['100_rows'] = {
			stringSort: benchmarkField(100, 'name'),
			dateSort: benchmarkField(100, 'created'),
			numberSort: benchmarkField(100, 'amount')
		};

		suiteResults['300_rows'] = {
			stringSort: benchmarkField(300, 'name', 10),
			dateSort: benchmarkField(300, 'created', 10),
			numberSort: benchmarkField(300, 'amount', 10)
		};

		return suiteResults;
	});

	console.log('RESULTS:');
	console.log(JSON.stringify(results, null, 2));
});
