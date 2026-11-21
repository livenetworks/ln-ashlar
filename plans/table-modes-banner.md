# Plan: "3 Architectural Modes for ln-table" banner fix

Scope: the banner `section.section-card` (three cards) in three demo source pages. Nothing else.

## Findings that shaped the plan (all read from source)

- List reset: global `ul, ol { list-style: none; }` and `* { margin:0; padding:0 }` in `theme/base/_reset.scss`. No mixin needed; `demo/admin/src/pages/index.html` `#dashboard-stats > ul` already relies on this.
- Grid: `@mixin grid-auto($min: var(--grid-item-min-width))` in `theme/config/mixins/_layout.scss:9`; it reads `var(--gap)`, so the host sets `--gap` (same as `#dashboard-stats > ul` in `demo/admin/src/scss/pages/_dashboard.scss`). `--grid-item-min-width` = 14rem (`theme/config/_tokens.scss:55`).
- Card: `@mixin card` (`theme/config/mixins/_card.scss:14`) already styles direct-child `> header` (panel-header), `> main` (panel-body), `> footer`. The card must NOT carry its own padding. `@mixin card-accent-top` (`_card.scss:274`) reads `--color-accent`.
- Card binding choice: `@include card` on a semantic id selector (`#table-modes > li`), not the `.card` helper class. Reason: every page partial in `demo/admin/src/scss/pages/_cards.scss` binds `card` by mixin on an id-scoped semantic element, and doctrine forbids presentational classes in markup.
- The card is the `<li>` itself (HTML skill: card/item = `<article>` or `<li>`), so no extra wrapper element.
- Wiring: demo partials live in `demo/admin/src/scss/pages/_*.scss`, listed in `demo/admin/src/scss/_demo-bundle.scss`; that file is consumed by both `admin.scss` and `admin-relaxed.scss`, so one partial serves both skins.
- `section-card > main` is `panel-body` (block, not flex), so the old `margin-top` on the grid becomes `@include mt(...)` on `#table-modes` (mixin `mt` in `theme/config/mixins/_spacing.scss:14`).
- No page currently has `aria-current`; no `#table-modes` id exists anywhere.
- States: default / active (`aria-current="page"` + accent) are the only states of a static banner. Hover, focus, disabled, loading, empty, error do not apply; the links are plain `.btn` buttons that keep their own states.

## Executor prompt (self-contained)

You are implementing a demo-only fix in ln-ashlar (repo root `c:\laragon\www\ln-ashlar`). Tabs for indentation everywhere. Do not run any git command. Do not touch anything outside the files listed below.

### Context
The banner "3 Architectural Modes for ln-table" (a `section.section-card` containing three cards) is broken: inline `padding` on `.card` insets the card's own `> header`; `var(--bg-surface)` does not exist; `var(--color-info|warning|success)` are bare HSL triplets used without `hsl()` so they are invalid; `.card-grid` does not exist in the library. Fix: remove every inline `style=""` from the banner, turn the three-card group into `<ul id="table-modes">` / `<li>`, and style it once in a shared SCSS partial. Only the active card (`aria-current="page"`) gets an accent.

### Boundaries (do NOT touch)
- Anything on the three pages outside the banner grid block (the table showcase, other `style=""` attributes, the `<style>` block at the top of `table-api.html`).
- Any other demo page, any file in `theme/`, `components/`, `demo/admin/data/make-seed-page.mjs`.
- Do not edit compiled outputs (`demo/admin/*.html`, `demo/admin/dist/*`) by hand; `npm run build` regenerates them.
- Keep all text, links, `.btn`, `.btn-sm`, `.badge` markup exactly as is. The only attribute removals inside the banner are the inline `style` attributes.

### Prerequisites (read first)
- `c:\laragon\www\ln-ashlar\demo\admin\src\scss\pages\_cards.scss` (pattern: id selector + `@include card`)
- `c:\laragon\www\ln-ashlar\demo\admin\src\scss\pages\_dashboard.scss` (pattern: `> ul { @include grid-auto; --gap: ... }`)
- `c:\laragon\www\ln-ashlar\demo\admin\src\scss\_demo-bundle.scss`

### Step 1. CREATE `c:\laragon\www\ln-ashlar\demo\admin\src\scss\pages\_table-modes.scss`

```scss
@use '../../../../../theme/config/mixins' as *;

// Banner shared by table.html, table-api.html and table-seed.html.
#table-modes {
	@include grid-auto;
	@include mt(var(--size-md));
	--gap: var(--size-md);

	> li {
		@include card;

		// Accent marks the current page only; the other cards stay neutral.
		&[aria-current="page"] { @include card-accent-top; }
	}
}
```

### Step 2. MODIFY `c:\laragon\www\ln-ashlar\demo\admin\src\scss\_demo-bundle.scss`
Add `@use 'pages/table-modes';` on a new line directly after `@use 'pages/table-filter';`.

### Step 3. MODIFY `c:\laragon\www\ln-ashlar\demo\admin\src\pages\table.html` (banner grid, approx lines 8-30)
Replace the block from `<div class="card-grid" ...>` through its matching closing `</div>` (the line directly before `\t</main>` of the banner) with the NEW block. Active card = card 1 (SSR).

OLD:
```html
		<div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--size-md); margin-top: var(--size-md);">
			<div class="card" style="border-top: 4px solid var(--color-info); padding: var(--size-md); background: var(--bg-sunken); border: 2px solid var(--color-info); border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
				<header><h4 style="margin-top:0; color: var(--color-info);">1. SSR Pre-Rendered Table (Active)</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<span class="badge info">Active Demo</span>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-warning); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">2. Remote API &amp; Virtual Window</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<a href="table-api.html" class="btn btn-sm">View Remote API Demo &rarr;</a>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-success); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">3. Injected JSON Seed</h4></header>
				<main>
					<p><small>Backend injects 1,000+ JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<a href="table-seed.html" class="btn btn-sm">View Injected Seed Demo &rarr;</a>
				</main>
			</div>
		</div>
```

NEW:
```html
		<ul id="table-modes">
			<li aria-current="page">
				<header><h4>1. SSR Pre-Rendered Table (Active)</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<span class="badge info">Active Demo</span>
				</main>
			</li>
			<li>
				<header><h4>2. Remote API &amp; Virtual Window</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<a href="table-api.html" class="btn btn-sm">View Remote API Demo &rarr;</a>
				</main>
			</li>
			<li>
				<header><h4>3. Injected JSON Seed</h4></header>
				<main>
					<p><small>Backend injects 1,000+ JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<a href="table-seed.html" class="btn btn-sm">View Injected Seed Demo &rarr;</a>
				</main>
			</li>
		</ul>
```

### Step 4. MODIFY `c:\laragon\www\ln-ashlar\demo\admin\src\pages\table-api.html` (banner grid, approx lines 21-43)
Same replacement scope. Active card = card 2 (Remote API). Do not touch the `<style>` block at the top.

OLD:
```html
		<div class="card-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--size-md); margin-top: var(--size-md);">
			<div class="card" style="border-top: 4px solid var(--color-info); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">1. SSR Pre-Rendered Table</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<a href="table.html" class="btn btn-sm">View SSR Demo &rarr;</a>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-warning); padding: var(--size-md); background: var(--bg-sunken); border: 2px solid var(--color-warning); border-radius: var(--radius-md); box-shadow: var(--shadow-md);">
				<header><h4 style="margin-top:0; color: var(--color-warning);">2. Remote API &amp; Virtual Window (Active)</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<span class="badge warning">Active Demo</span>
				</main>
			</div>
			<div class="card" style="border-top: 4px solid var(--color-success); padding: var(--size-md); background: var(--bg-surface); border-radius: var(--radius-md); box-shadow: var(--shadow-sm);">
				<header><h4 style="margin-top:0;">3. Injected JSON Seed</h4></header>
				<main>
					<p><small>Backend injects 1,000+ JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<a href="table-seed.html" class="btn btn-sm">View Injected Seed Demo &rarr;</a>
				</main>
			</div>
		</div>
```

NEW:
```html
		<ul id="table-modes">
			<li>
				<header><h4>1. SSR Pre-Rendered Table</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<a href="table.html" class="btn btn-sm">View SSR Demo &rarr;</a>
				</main>
			</li>
			<li aria-current="page">
				<header><h4>2. Remote API &amp; Virtual Window (Active)</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<span class="badge warning">Active Demo</span>
				</main>
			</li>
			<li>
				<header><h4>3. Injected JSON Seed</h4></header>
				<main>
					<p><small>Backend injects 1,000+ JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<a href="table-seed.html" class="btn btn-sm">View Injected Seed Demo &rarr;</a>
				</main>
			</li>
		</ul>
```

### Step 5. MODIFY `c:\laragon\www\ln-ashlar\demo\admin\src\pages\table-seed.html` (banner grid, approx lines 8-30)
Same replacement scope. Active card = card 3 (Injected Seed).

OLD:
```html
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
```

NEW:
```html
		<ul id="table-modes">
			<li>
				<header><h4>1. SSR Pre-Rendered Table</h4></header>
				<main>
					<p><small>HTML <code>&lt;tr&gt;</code> DOM elements emitted by backend (PHP/Node). Instant initial paint &amp; SEO. Zero client template compile. In-memory DOM sorting &amp; filtering.</small></p>
					<a href="table.html" class="btn btn-sm">View SSR Demo &rarr;</a>
				</main>
			</li>
			<li>
				<header><h4>2. Remote API &amp; Virtual Window</h4></header>
				<main>
					<p><small>Paginates infinite backend data on-demand via <code>ln-api-connector</code>. Ideal for huge databases (100k+ records) with server-side SQL/querying.</small></p>
					<a href="table-api.html" class="btn btn-sm">View Remote API Demo &rarr;</a>
				</main>
			</li>
			<li aria-current="page">
				<header><h4>3. Injected JSON Seed (Active)</h4></header>
				<main>
					<p><small>Backend injects 10,000 JSON records directly into <code>&lt;script type="application/json"&gt;</code>. Ingested into <code>ln-data-store</code> in 0ms. Rendered via Cheetah/Glide virtual DOM row recycling pool (~35 recycled rows).</small></p>
					<span class="badge success">Active Demo</span>
				</main>
			</li>
		</ul>
```

Note: the three OLD blocks differ per page (card text/styles); if an `Edit` old_string does not match exactly, Read the lines and match what is on disk, then apply the NEW block for that page unchanged. If the on-disk banner differs materially from OLD, STOP and report.

### Step 6. Build
Run `npm run build` from the repo root. Must exit 0. Compiled `demo/admin/table.html`, `table-api.html`, `table-seed.html` and `demo/admin/dist/admin.css` / `admin-relaxed.css` are regenerated (committed artifacts; deploy is pull-only).

### Verification (acceptance)
1. `npm run build` exits 0.
2. In each of `demo/admin/src/pages/table.html`, `table-api.html`, `table-seed.html`: the lines from `<section class="section-card">` containing "3 Architectural Modes" down to its closing `</section>` contain no `style="`. (Other `style=` elsewhere on the pages are out of scope and must be unchanged.)
3. `Grep "card-grid"` in `demo/admin/src/pages/` and in `demo/admin/table.html`, `table-api.html`, `table-seed.html`: no matches.
4. Exactly one `aria-current="page"` per page inside the banner: table.html -> card 1, table-api.html -> card 2, table-seed.html -> card 3.
5. `id="table-modes"` appears exactly once in each of the three source pages; `_table-modes.scss` exists and `_demo-bundle.scss` contains `pages/table-modes`.
6. Compiled CSS contains the rule: `Grep "#table-modes" demo/admin/dist/admin.css` has a match; same for `admin-relaxed.css`.
7. Tests: `Grep -rln "table-modes|card-grid|Architectural Modes" tests/` was run during planning and returned no files. Re-run it; if still empty, state "no related tests" and run none. If any file matches, run only `node --test <that file>`. NEVER run `npm test` unfiltered and NEVER the headless suite.
8. No git commands.

Report: files changed, build exit code, results of checks 2-6, test-grep result.

## Review status
Plan was not submitted to `review_plan` (project memory: plan review disabled for budget; spot-check with greps instead).

Execute: @executor Implement plans/table-modes-banner.md
