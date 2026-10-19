import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw = JSON.parse(readFileSync(resolve(__dirname, 'documents.json'), 'utf8'));

const records = raw.data.map(r => {
	const b = r.file_size;
	const file_size_display = b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : (b / 1024).toFixed(1) + ' KB';
	const dateObj = new Date(r.updated_at * 1000);
	const updated_display = dateObj.toISOString().slice(0, 10);
	let status_badge = 'secondary';
	if (r.status === 'Approved') status_badge = 'success';
	else if (r.status === 'Draft') status_badge = 'info';
	else if (r.status === 'Pending') status_badge = 'warning';
	else if (r.status === 'Rejected') status_badge = 'danger';
	return {
		id: r.id,
		title: r.title,
		department: r.department,
		status: r.status,
		status_badge,
		priority: r.priority,
		owner: r.owner,
		file_size: r.file_size,
		file_size_display,
		updated_at: r.updated_at,
		updated_display
	};
});

// Minified JSON for compact embedding
const jsonSeed = JSON.stringify(records);

const html = `<!-- ln-page: title="Table — Injected JSON Seed — ln-ashlar" h1="Table — Injected JSON Seed" -->

<!-- 3 Table Architectures Comparison Banner -->
<section class="section-card">
	<header><h3>3 Architectural Modes for ln-table</h3></header>
	<main>
		<p>Ashlar provides three distinct architectural paradigms for data grids, allowing you to choose the exact trade-off between SEO/initial paint, client memory, and network throughput:</p>
		<div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--size-md); margin-top: var(--size-md);">
			<div class="card" style="border-top: 4px solid var(--color-info); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">1. SSR Pre-Rendered Table</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<a href="table.html" class="btn btn-sm">View SSR Demo &rarr;</a>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-warning); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">2. Remote API &amp; Virtual Window</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<a href="table-api.html" class="btn btn-sm">View Remote API Demo &rarr;</a>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-success); padding: var(--size-md); background: var(--bg-sunken); border: 2px solid var(--color-success); border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
				<header><h4 style="margin-top:0; color: var(--color-success);">3. Injected JSON Seed (Active)</h4></header>
				<main>
					<p><small>Backend injects 10,000 JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<span class="badge success">Active Demo</span>
				</main>
			</div>
		</div>
	</main>
</section>

<!-- Overview / Philosophy -->
<section class="section-card">
	<header><h3>How Injected Seed + Virtual Row Recycling Works</h3></header>
	<main>
		<p>Unlike traditional client-side SPAs that display loading spinners while fetching remote JSON after mount, the <strong>Injected Seed pattern</strong> allows backend engines (Laravel, Symfony, Django, Rails, Go, ASP.NET) to embed datasets directly into HTML:</p>
		<ol style="margin-bottom: var(--size-md); line-height: 1.7;">
			<li><strong>Zero Network Roundtrip (0ms latency):</strong> 10,000 enterprise records arrive embedded inside <code>&lt;script type="application/json"&gt;</code> nested directly inside <code>&lt;li data-ln-data-store&gt;</code> (or externally referenced via <code>data-ln-data-store-seed</code>). Zero secondary fetch requests.</li>
			<li><strong>Instant ln-data-store Ingestion:</strong> <code>ln-data-store</code> automatically parses the JSON, builds query indexes, and immediately serves read queries from memory or IndexedDB.</li>
			<li><strong>Cheetah / Glide-Style DOM Pool:</strong> Instead of creating 10,000 <code>&lt;tr&gt;</code> elements (which consumes 150MB+ of DOM heap and causes catastrophic browser freezing), <code>ln-table</code> creates a fixed pool of ~35-60 recycled rows. As the user scrolls, cell texts and attributes update in-place with zero element allocation.</li>
			<li><strong>Sub-Millisecond Search &amp; Sort:</strong> Search keywords and popover filters run against local indices with 0ms network latency.</li>
		</ol>
	</main>
</section>

<!-- Live Telemetry Panel -->
<section class="section-card">
	<header><h3>Live Engine Telemetry</h3></header>
	<main>
		<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--size-sm); text-align: center;">
			<div style="padding: var(--size-sm); background: var(--bg-sunken); border-radius: var(--radius-sm);">
				<div style="font-size: 1.8rem; font-weight: bold; color: var(--color-primary);" id="stat-total-seed">10,000</div>
				<small style="color: var(--fg-muted);">Total Injected Records</small>
			</div>
			<div style="padding: var(--size-sm); background: var(--bg-sunken); border-radius: var(--radius-sm);">
				<div style="font-size: 1.8rem; font-weight: bold; color: var(--color-success);" id="stat-pool-size">~38</div>
				<small style="color: var(--fg-muted);">DOM <code>&lt;tr&gt;</code> Pool Nodes</small>
			</div>
			<div style="padding: var(--size-sm); background: var(--bg-sunken); border-radius: var(--radius-sm);">
				<div style="font-size: 1.8rem; font-weight: bold; color: var(--color-info);" id="stat-network-reqs">0</div>
				<small style="color: var(--fg-muted);">HTTP API Requests</small>
			</div>
			<div style="padding: var(--size-sm); background: var(--bg-sunken); border-radius: var(--radius-sm);">
				<div style="font-size: 1.8rem; font-weight: bold; color: var(--color-warning);" id="stat-query-time">&lt; 1 ms</div>
				<small style="color: var(--fg-muted);">Filter/Search Latency</small>
			</div>
		</div>
	</main>
</section>

<!-- Interactive Table Demo -->
<section data-ln-table-coordinator>
	<section class="section-card" data-demo-html>
		<header><h3>Interactive Grid — 10,000 Records with Instant Search, Sort &amp; Filter</h3></header>
		<main>
			<!-- Declarative Injected Data Layer (NO API CONNECTOR) -->
			<ul data-ln-data-coordinator="seed-docs" id="seed-table-coordinator" hidden>
				<li data-ln-data-store="seed-docs"
				    data-ln-data-store-indexes="department,status,priority"
				    data-ln-data-store-search-fields="title,department,owner,status,priority"
				    data-ln-search=""
				    id="seed-docs">
					<!-- Injected JSON Dataset (10,000 records) nested directly in data-store -->
					<script type="application/json">
${jsonSeed}
					</script>
				</li>
			</ul>

			<section data-ln-table="seed-docs"
			         data-ln-table-source="seed-docs"
			         data-ln-table-selectable
			         id="seed-table"
			         class="data-table-demo"
			         style="max-height: 540px; overflow-y: auto;">
				<table>
					<thead>
						<tr>
							<th colspan="8">
								<div class="ln-table__toolbar" style="display: flex; gap: var(--size-md); align-items: center; justify-content: space-between;">
									<div>
										<h4 style="margin: 0;">Injected Documents Grid</h4>
									</div>
									<search aria-label="Search injected records">
										<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
										<input type="search" placeholder="Search 10,000 records instantly (0ms)..." data-ln-search-for="seed-docs" data-ln-query="search">
										<button type="button" data-ln-search-clear aria-label="Clear search">
											<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
										</button>
									</search>
								</div>
							</th>
						</tr>
						<tr>
							<th data-ln-table-col-select style="width: 40px;"></th>
							<th data-ln-table-col="title">
								Title
								<ul data-ln-sort="seed-docs" data-ln-sort-field="title" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="department" data-ln-table-filter-col="department">
								Department
								<button type="button" class="table-filter" data-ln-table-col-filter data-ln-popover-for="filter-seed-dept" aria-label="Filter department">
									<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-filter"></use></svg>
								</button>
								<ul data-ln-sort="seed-docs" data-ln-sort-field="department" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="status" data-ln-table-filter-col="status">
								Status
								<button type="button" class="table-filter" data-ln-table-col-filter data-ln-popover-for="filter-seed-status" aria-label="Filter status">
									<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-filter"></use></svg>
								</button>
								<ul data-ln-sort="seed-docs" data-ln-sort-field="status" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="priority">
								Priority
								<ul data-ln-sort="seed-docs" data-ln-sort-field="priority" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="owner">
								Owner
								<ul data-ln-sort="seed-docs" data-ln-sort-field="owner" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="file_size">
								Size
								<ul data-ln-sort="seed-docs" data-ln-sort-field="file_size" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
							<th data-ln-table-col="updated_at">
								Updated
								<ul data-ln-sort="seed-docs" data-ln-sort-field="updated_at" data-ln-sort-state="none" data-ln-query="sort">
									<li><button type="button" data-ln-sort-dir="asc" aria-label="Sort ascending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrows-sort"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="desc" aria-label="Sort descending"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up"></use></svg></button></li>
									<li><button type="button" data-ln-sort-dir="none" aria-label="Remove sort"><svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down"></use></svg></button></li>
								</ul>
							</th>
						</tr>
					</thead>
					<tbody data-ln-table-body>
					</tbody>
				</table>

				<footer class="ln-table__footer" style="display: flex; justify-content: space-between; align-items: center; padding: var(--size-sm) var(--size-md);">
					<p style="margin: 0;">
						<span class="hidden"><span data-ln-table-filtered></span> / </span>
						<span data-ln-table-total data-ln-number></span> items
						<span class="hidden">(<span data-ln-table-selected></span> selected)</span>
					</p>
					<span class="badge success" style="font-size: 0.8rem;">0ms In-Memory Engine</span>
				</footer>

				<!-- Row Template for Pool -->
				<template data-ln-template="seed-docs-row" data-ln-table-row>
					<tr data-ln-table-row data-ln-table-row-id="{{ id }}">
						<td><input type="checkbox" data-ln-table-row-select></td>
						<td><strong>{{ title }}</strong></td>
						<td><span>{{ department }}</span></td>
						<td><span class="badge {{ status_badge }}">{{ status }}</span></td>
						<td><span>{{ priority }}</span></td>
						<td><span>{{ owner }}</span></td>
						<td data-ln-value="{{ file_size }}"><span>{{ file_size_display }}</span></td>
						<td data-ln-value="{{ updated_at }}"><time datetime="{{ updated_at }}">{{ updated_display }}</time></td>
					</tr>
				</template>

				<!-- Empty State template -->
				<template data-ln-table-empty>
					<section data-ln-empty-state="no-results" style="padding: var(--size-xl); text-align: center;">
						<svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
						<h3>No matching records found</h3>
						<p>Try refining your search keyword or clearing active popover filters.</p>
						<button type="button" data-ln-table-clear-all class="btn">Clear Filters</button>
					</section>
				</template>
			</section>

			<!-- Department filter popover -->
			<div data-ln-popover id="filter-seed-dept">
				<ul id="filter-seed-dept-list" data-ln-filter="seed-docs" data-ln-query="department">
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-reset checked> All</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="IT"> IT</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Finance"> Finance</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Legal"> Legal</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Marketing"> Marketing</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="HR"> HR</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Sales"> Sales</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="department" data-ln-filter-value="Operations"> Operations</label></li>
				</ul>
			</div>

			<!-- Status filter popover -->
			<div data-ln-popover id="filter-seed-status">
				<ul id="filter-seed-status-list" data-ln-filter="seed-docs" data-ln-query="status">
					<li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-reset checked> All</label>
					<li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Approved"> Approved</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Draft"> Draft</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Pending"> Pending</label></li>
					<li><label><input type="checkbox" data-ln-filter-key="status" data-ln-filter-value="Archived"> Archived</label></li>
				</ul>
			</div>
		</main>
	</section>
</section>

<script>
(function() {
	const table = document.getElementById('seed-table');
	const poolStat = document.getElementById('stat-pool-size');
	const queryStat = document.getElementById('stat-query-time');

	function updateTelemetry() {
		if (!table) return;
		const tbody = table.querySelector('tbody[data-ln-table-body]');
		if (tbody) {
			const rows = tbody.querySelectorAll('tr:not(.ln-table__spacer)');
			if (poolStat && rows.length > 0) poolStat.textContent = rows.length + ' rows';
		}
	}

	table.addEventListener('ln-table:rendered', function(e) {
		updateTelemetry();
	});

	let queryStart = 0;
	document.addEventListener('input', function(e) {
		if (e.target && e.target.matches('[data-ln-search-for="seed-docs"]')) {
			queryStart = performance.now();
		}
	});

	table.addEventListener('ln-table:rendered', function() {
		if (queryStart > 0) {
			const duration = (performance.now() - queryStart).toFixed(1);
			if (queryStat) queryStat.textContent = duration + ' ms';
			queryStart = 0;
		}
	});

	setTimeout(updateTelemetry, 250);
})();
</script>
`;

const outPath = resolve(__dirname, '..', 'src', 'pages', 'table-seed.html');
writeFileSync(outPath, html, 'utf8');
console.log('Successfully wrote 10,000 records to', outPath);
