import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_DIR = join(__dirname, '..', 'demo', 'admin');

const SIDEBAR_CANONICAL = `		<!-- Sidebar -->
		<aside class="sidebar open" id="demo-sidebar" data-ln-toggle="open">
			<div class="sidebar-header">
				<button data-ln-toggle-for="demo-sidebar" data-ln-toggle-action="close" aria-label="Close sidebar"><svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg></button>
				<img class="logo" src="ln-ashlar-logo.png" alt="ln-ashlar">
				<span class="app-name">ashlar-gui</span>
			</div>

			<label class="sidebar-search" data-ln-search="demo-nav" data-ln-search-items="li">
				<svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
				<input type="search" placeholder="Filter menu…">
			</label>

			<div class="sidebar-content">
				<nav class="nav" id="demo-nav" data-ln-nav="active">
					<ul>
						<li><a href="index.html"><svg class="ln-icon" aria-hidden="true"><use href="#ln-home"></use></svg><span class="nav-label">Dashboard</span></a></li>
					</ul>

					<h6 class="nav-section">CSS Components</h6>
					<ul>
						<li><a href="typography.html"><span class="nav-label">Typography</span></a></li>
						<li><a href="cards.html"><span class="nav-label">Cards</span></a></li>
						<li><a href="chip.html"><span class="nav-label">Chip</span></a></li>
						<li><a href="density.html"><span class="nav-label">Density</span></a></li>
						<li><a href="tables.html"><span class="nav-label">Tables</span></a></li>
						<li><a href="forms.html"><span class="nav-label">Forms &amp; Buttons</span></a></li>
						<li><a href="kbd.html"><span class="nav-label">Kbd</span></a></li>
						<li><a href="layout.html"><span class="nav-label">Layout &amp; Grid</span></a></li>
						<li><a href="sections.html"><span class="nav-label">Sections</span></a></li>
						<li><a href="icons.html"><span class="nav-label">Icons</span></a></li>
						<li><a href="utilities.html"><span class="nav-label">Utilities</span></a></li>
						<li><a href="mixins.html"><span class="nav-label">Mixins Reference</span></a></li>
						<li><a href="page-header.html"><span class="nav-label">Page Header</span></a></li>
						<li><a href="prose.html"><span class="nav-label">Prose</span></a></li>
						<li><a href="stat-card.html"><span class="nav-label">Stat Card</span></a></li>
						<li><a href="status-badge.html"><span class="nav-label">Status Badge</span></a></li>
						<li><a href="stepper.html"><span class="nav-label">Stepper</span></a></li>
						<li><a href="timeline.html"><span class="nav-label">Timeline</span></a></li>
						<li><a href="tooltip.html"><span class="nav-label">Tooltip</span></a></li>
						<li><a href="toggle-switch.html"><span class="nav-label">Toggle Switch</span></a></li>
						<li><a href="empty-state.html"><span class="nav-label">Empty State</span></a></li>
					</ul>

					<h6 class="nav-section">JS Components</h6>
					<ul>
						<li><a href="accordion.html"><span class="nav-label">Accordion</span></a></li>
						<li><a href="ajax.html"><span class="nav-label">AJAX</span></a></li>
						<li><a href="autosave.html"><span class="nav-label">Autosave</span></a></li>
						<li><a href="circular-progress.html"><span class="nav-label">Circular Progress</span></a></li>
						<li><a href="confirm.html"><span class="nav-label">Confirm</span></a></li>
						<li><a href="datatable.html"><span class="nav-label">Data Table</span></a></li>
						<li><a href="dropdown.html"><span class="nav-label">Dropdown</span></a></li>
						<li><a href="external-links.html"><span class="nav-label">External Links</span></a></li>
						<li><a href="filter.html"><span class="nav-label">Filter</span></a></li>
						<li><a href="link.html"><span class="nav-label">Link</span></a></li>
						<li><a href="modal.html"><span class="nav-label">Modal</span></a></li>
						<li><a href="nav.html"><span class="nav-label">Nav</span></a></li>
						<li><a href="persist.html"><span class="nav-label">Persist</span></a></li>
						<li><a href="popover.html"><span class="nav-label">Popover</span></a></li>
						<li><a href="progress.html"><span class="nav-label">Progress</span></a></li>
						<li><a href="search.html"><span class="nav-label">Search</span></a></li>
						<li><a href="select.html"><span class="nav-label">Select</span></a></li>
						<li><a href="sortable.html"><span class="nav-label">Sortable</span></a></li>
						<li><a href="store.html"><span class="nav-label">Store</span></a></li>
						<li><a href="table.html"><span class="nav-label">Table</span></a></li>
						<li><a href="tabs.html"><span class="nav-label">Tabs</span></a></li>
						<li><a href="time.html"><span class="nav-label">Time</span></a></li>
						<li><a href="toast.html"><span class="nav-label">Toast</span></a></li>
						<li><a href="toggle.html"><span class="nav-label">Toggle</span></a></li>
						<li><a href="translations.html"><span class="nav-label">Translations</span></a></li>
						<li><a href="upload.html"><span class="nav-label">Upload</span></a></li>
					</ul>
				</nav>
			</div>

			<div class="sidebar-footer">
				<small>ashlar-gui v1.2.0</small>
			</div>
		</aside>`;

const HEADER_TEMPLATE = (title) => `		<!-- Header -->
		<header>
			<div class="header-left">
				<button class="menu-toggle" data-ln-toggle-for="demo-sidebar" aria-label="Open menu">
					<svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
				</button>
				<h1>${title}</h1>
			</div>
			<div class="header-right">
				<div class="header-actions">
					<button type="button" data-demo-theme-toggle aria-label="Toggle dark mode">
						<svg class="ln-icon" aria-hidden="true"><use href="#ln-moon"></use></svg>
					</button>
					<button type="button" onclick="window.lnToast.enqueue({type:'info', title:'Info', message:'This is a demo notification.'})">
						Test Toast
					</button>
				</div>
			</div>
		</header>`;

// Matches the first <header>…</header> block at tab-depth 2 (inside .app-wrapper).
// We anchor on the optional leading <!-- Header --> comment + the <header> line,
// then capture up to and including the matching </header>.
// Handles both 2-tab and 3-tab indentation across files.
const HEADER_REGION_RE = /(?:\t{2,3}<!-- Header -->\n)?\t{2,3}<header>[\s\S]*?\n\t{2,3}<\/header>/;

// Matches the sidebar block: optional leading comment + <aside …> through </aside>.
// Handles both 2-tab and 3-tab indentation (datatable.html uses 3-tab indent).
const SIDEBAR_REGION_RE = /(?:\t{2,3}<!-- Sidebar -->\n)?\t{2,3}<aside class="sidebar open" id="demo-sidebar"[\s\S]*?\n\t{2,3}<\/aside>/;

// Extract <h1>…</h1> text from inside the header block.
const H1_RE = /<h1>([\s\S]*?)<\/h1>/;

const files = readdirSync(ADMIN_DIR)
    .filter((f) => f.endsWith('.html'))
    .sort();

let processed = 0;
const problems = [];

for (const file of files) {
    const path = join(ADMIN_DIR, file);
    const original = readFileSync(path, 'utf8');

    const headerMatch = original.match(HEADER_REGION_RE);
    if (!headerMatch) {
        problems.push(`${file}: no header block matched`);
        continue;
    }

    const h1Match = headerMatch[0].match(H1_RE);
    if (!h1Match) {
        problems.push(`${file}: no <h1> inside header`);
        continue;
    }
    const pageTitle = h1Match[1].trim();

    const sidebarMatch = original.match(SIDEBAR_REGION_RE);
    if (!sidebarMatch) {
        problems.push(`${file}: no sidebar block matched`);
        continue;
    }

    let updated = original.replace(HEADER_REGION_RE, HEADER_TEMPLATE(pageTitle));
    updated = updated.replace(SIDEBAR_REGION_RE, SIDEBAR_CANONICAL);

    if (updated === original) {
        // Already canonical — count as processed without re-writing
        processed++;
        continue;
    }

    writeFileSync(path, updated, 'utf8');
    processed++;
}

console.log(`Consolidated ${processed} files.`);
if (problems.length) {
    console.error('Problems:');
    for (const p of problems) console.error('  - ' + p);
    process.exit(1);
}
