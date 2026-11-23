# Changelog

All notable changes to `@livenetworks/ashlar` are documented here.
Generated from [`releases/`](https://github.com/livenetworks/ln-ashlar/tree/main/releases) via `npm run sync:changelog` — do not edit directly.

For GitHub releases and individual release pages, see [GitHub Releases](https://github.com/livenetworks/ln-ashlar/releases) and [`releases/README.md`](https://github.com/livenetworks/ln-ashlar/blob/main/releases/README.md).

---

## [v2.2.7](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.7.md) — November 23, 2026

> **Summary:** `ln-fill` reactivity and modal/dropdown styling fixes for `ln-translations`, keyboard-accessible wrapping pills and `fieldset`/`legend` defaults, new `@mixin icon-tile` / `card-add` / `btn-header` / `grid-fill` mixins with container-query grid support, plus root `CHANGELOG.md`, npm release-note packaging, and automated GitHub Releases workflow.

### Overview

**1. `ln-translations` `ln-fill` Integration & Dropdown/Modal Styling Fixes.**
- Added host-level `ln-fill` handling (`components/ln-translations/src/ln-translations.js`) to clear stale language fields cleanly and repopulate translations from `e.detail.trans`, registered in `scripts/sync-ln-events.mjs`, and demonstrated with a create/edit modal flow (`demo/admin/src/pages/translations.html`) and expanded headless tests (`tests/headless/translations.mjs`).
- Enforced `&:not(.open) { display: none; }` on `[data-ln-dropdown-menu]` (`components/ln-dropdown/ln-dropdown.scss`), added `display: block` to `li` in `theme/config/mixins/_dropdown.scss`, scoped `panel-header` list/button selectors in `theme/config/mixins/_card.scss` away from nested menus/popovers and translation controls, and fixed Tailwind's `[data-ln-dropdown-menu]` panel selector (`theme/tailwind/components.css`).
- Added vertical gap across stacked `[data-ln-translatable-lang]` fields, `@mixin translations-header`, asymmetrical `padding-inline` on badges, `--btn-*` hover/sizing fixes on translation add/remove buttons (`theme/config/mixins/_translations.scss`, `theme/components/_translations.scss`), and updated `.form-element`'s trailing slot selector to exclude sibling `select`/`textarea` clones (`theme/config/mixins/_form.scss`).

**2. Button Mixin Self-Inclusion & `@mixin btn-header`.**
- Included `@include button-base` directly inside `@mixin btn`, `btn-soft`, `btn-ghost`, `btn-outline`, `btn-link`, `btn-sm`, and `btn-lg` (`theme/config/mixins/_btn.scss`) so `.btn*` prototype classes (`theme/components/_button.scss`) and semantic selectors no longer require explicit `@include button-base` boilerplate, parameterized via `--btn-gap`, `--btn-font-size`, and `--btn-line-height`.
- Added `@mixin btn-header` (and `.btn-header`) shared across `<button>` and `<a>` header actions in `@mixin panel-header`.

**3. Cards, `@mixin icon-tile`, `@mixin card-add`, Container-Query Grids & Accessible Pills.**
- Extracted `@mixin icon-tile` into `theme/config/mixins/_icon-tile.scss` (adopted by `stat-card` in `_stat-card.scss`), added dashed empty-action tile `@mixin card-add`, folded `--surface-highlight` into `--shadow` on `card`/`floating-panel`, and added flush tablist and `[data-ln-table-coordinator]` handling inside `panel-header`/`panel-body` (`theme/config/mixins/_card.scss`).
- Added `@mixin grid-fill` and optional `$container` parameter on `grid`, `grid-2`, and `grid-4` for `@container`-driven column breakpoints (`theme/config/mixins/_layout.scss`), plus `--max-w-container-expanded` and table legend resets (`theme/config/mixins/_ln-table.scss`).
- Updated `@mixin pill` to use visual-only hiding (`position: absolute; clip-path: inset(50%)`) with `:focus-visible` focus rings so checkboxes/radios remain keyboard-focusable (`_form.scss`, `_popover.scss`, `_picklist.scss`), updated `pills`/`pills-outline` to wrap cleanly, and added border-less `fieldset`/`legend` defaults (`@mixin form-label-base` in `_form.scss`, `theme/components/_form.scss`).

**4. Changelog Generation, npm Release Visibility & Automated GitHub Releases.**
- Added `scripts/sync-changelog.mjs` (integrated into `npm run build` and `npm test` via `sync:changelog` / `sync:changelog:check`) generating root `CHANGELOG.md` from `releases/` with absolute GitHub URLs.
- Added `scripts/publish-github-releases.mjs` and `.github/workflows/release.yml` to publish GitHub Releases automatically on `v*` tag pushes and via manual backfill (`workflow_dispatch`).
- Added `CHANGELOG.md` and `releases/` to `package.json` `files` and added direct Releases/Changelog links at the top of `README.md`.

---

## [v2.2.6](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.6.md) — November 21, 2026

> **Summary:** Data layer query SSOT consolidation (`ln-data-coordinator`, `ln-data-store`, `ln-core/window-cache`), SSR table filtering/sorting restoration (`ln-table`), autonomous text-element subtree re-formatting (`ln-date`, `ln-number`, `ln-time`), hairline skin & layout token refinements, and 17 MB asset footprint reduction.

### Overview

**1. Data Layer Consolidation & Coordinator Query SSOT (`ln-data-coordinator`, `ln-data-store`, `ln-core/window-cache`).**
- Lifted sliding-window page caching into `ln-core` (`createWindowCache`), providing unified stale-while-revalidate windowing, `queryGen` generation guards, and LRU page eviction across `ln-table` and `ln-list`.
- Consolidated query state ownership exclusively on `ln-data-coordinator`: removed duplicate `ln-data-store:query-changed` event emission and store-side query listeners (`ln-search:change`, `ln-filter:change`, `ln-sort:change`), eliminating split-brain double renders.
- Updated `composeQuery(viewQuery, coordQuery)` in `components/ln-data-coordinator/src/data-read-policy.js` so empty coordinator query attributes never clobber view-originated sort, search, or filter state.
- Enabled transport-only coordinator topology (`ln-data-coordinator` paired directly with a connector without `ln-data-store`), synchronized `data-ln-search` with `data-ln-data-coordinator-search`, and wired declarative `ATTRIBUTES` effects.

**2. SSR Table Filtering, Sorting & Lifecycle Hardening (`ln-table`, `ln-list`, `ln-api-connector`, `ln-table-coordinator`).**
- Restored full in-memory SSR filtering (search tokenization, column filters, and row `data-*` attribute matching) and type-detected sorting (`detectValueType`, `compareValues`, `e.detail.field` column resolution) in `components/ln-table/src/ln-table.js`.
- Hardened `ln-table.destroy()` and `_disableVirtualScroll()` to tear down `ln-search:change` in both SSR and data-driven modes and clean up `overflowAnchor`, `.ln-table--loading`, and `aria-busy`.
- Fixed `attrEffects` host-element signatures (`_applyWindow`, `_applyWindowPage`, `_applyWindowThreshold`, `_applyCount`) and `prop` bindings in `components/ln-list/src/ln-list.js`.
- Unified `data-ln-api-param-sort-field` default fallback (`'sort_field'`) and `queryDebounce` fallback (`200ms`) in `components/ln-api-connector/src/ln-api-connector.js`.

**3. Autonomous Text-Element Subtree Re-Formatting (`ln-date`, `ln-number`, `ln-time`).**
- Registered `onSubtreeChange` hooks in `ln-date`, `ln-number`, and `ln-time` via `registerComponent`.
- Text elements (`<time data-ln-date>`, `<span data-ln-number>`, `<time data-ln-time>`) now autonomously detect external `textContent` mutations (e.g., virtual row pool recycling or template fills where `datetime` / `data-ln-value` remains unchanged) and re-format themselves without cross-component coupling.

**4. Layout Tokens, Hairline Skin & Repository Footprint Optimization.**
- Refined workspace layout tokens in `theme/config/_tokens.scss` (`--max-w-container: 88rem`, `--max-w-container-expanded: 100rem`, `--sidebar-width: 16.75rem`) and `.app-content-wrapper` spacing in `theme/config/mixins/_app-shell.scss`.
- Pruned unused SVG flag assets to the 58 supported language flags, deduplicated build target directories (`assets/flags` and `demo/assets/flags`), and resized oversized corporate/brand images, reducing repository size by ~17 MB.

---

## [v2.2.5](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.5.md) — November 9, 2026

> **Summary:** Dynamic `<use>` lifecycle detection in `ln-icon`, responsive breakpoint collapse and sibling margin reset in `@mixin form-grid`, modal form grid demo, and regression test suites.

### Overview

**1. Dynamic SVG Icon Lifecycle Observer (`ln-icon`).**
- Registered explicit query `use[href^="#ln-icon-"]` with ln-core's shared `observeLifecycle` observer in `components/ln-icon/src/ln-icon.js`.
- Automatically scans, downloads, and injects SVG symbols into `#ln-icon-sprite` whenever `<use>` elements enter the DOM after initial page load (via `insertAdjacentHTML`, `innerHTML`, `createElementNS`, or dynamic subtrees).
- Ensures seamless support for late-mounted components that construct icons dynamically at runtime, such as `ln-date`'s calendar toggle button.

**2. Responsive Form Grid Layout & Sibling Margin Reset (`@mixin form-grid`).**
- Updated `@mixin form-grid` in `theme/config/mixins/_form.scss` to collapse onto a single column using viewport media queries (`@include mq-down(md) { @include flex-col; }`).
- Replaced the previous container query collapse, allowing modal dialogs and narrow viewports to stack form elements vertically without breaking column spans.
- Enforced `> * { margin: 0; }` reset inside the grid container to prevent child `.form-element` wrappers from introducing additive sibling top margins across grid rows.

**3. Modal Form Grid Demonstration & Guidelines.**
- Added a dedicated multi-column modal form grid showcase in `demo/admin/src/pages/forms.html` (and generated `demo/admin/forms.html`) demonstrating 6-column spanning, hidden input placement, and responsive single-column collapse.
- Updated documentation in `docs-mcp/css/forms.md`, `docs-mcp/css/mixins.md`, and `docs/architecture/reference.md` clarifying container vs. viewport query architectural boundaries and form grid margin mechanics.

**4. Regression Test Suites.**
- Expanded headless testing suite (`tests/headless/icons.mjs`, `tests/headless/forms.mjs`, `tests/headless/date-icon.mjs`) covering late icon injection, href swaps, modal grid row alignment, and narrow viewport stacking.

---

## [v2.2.4](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.4.md) — November 7, 2026

> **Summary:** Dynamic expanded workspace container on sidebar collapse, smooth layout transitions, fluid workspace modifier, and `--max-w-container-expanded` design token.

### Overview

**1. Dynamic Workspace Container on Sidebar Collapse.**
- Updated `@mixin app-main` and `@mixin app-content-wrapper` in `theme/config/mixins/_app-shell.scss` to automatically expand the workspace when the main navigation sidebar is hidden.
- Introduced `--app-content-max-w` CSS custom property dynamically driven by `:has(> aside[data-ln-toggle="open"])`.
- When the sidebar is collapsed, the workspace expands to `--max-w-container-expanded` (96rem / 1536px) rather than remaining locked at 80rem (1280px), giving data tables, dashboards, and split views increased usable surface area.

**2. Synchronized App Shell Motion Transitions.**
- Added `@include motion-safe { transition: padding-left var(--transition); }` to `@mixin app-main`.
- Added `@include motion-safe { transition: max-width var(--transition); }` to `@mixin app-content-wrapper`.
- Eliminates layout jumps when toggling the sidebar, ensuring the content area resizes in lockstep with the drawer transform animation.

**3. Fluid / Full-Width Workspace Modifier.**
- Added `.fluid` and `[data-ln-fluid]` support to `@mixin app-content-wrapper` (`max-width: 100%`).
- Enables data-heavy screens (such as `ln-table` data grids, spreadsheet views, and kanban boards) to opt into full edge-to-edge canvas width while preserving the shell's clamped inline gutters.

**4. New Design Token.**
- Added `--max-w-container-expanded: 96rem` to `theme/config/_tokens.scss`.
- Fully documented across CSS token manifests and theme documentation.

---

## [v2.2.3](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.3.md) — November 7, 2026

> **Summary:** Decoupled `.dropdown` presentation class, geometry and typography normalization across interactive dropdown/popover menu items, embedded action form detection, semantic action statuses, and refreshed documentation manifests.

### Overview

**1. Decoupled `.dropdown` Presentation Class.**
- Mapped `.dropdown` class directly to `@mixin dropdown-menu` in `theme/components/_dropdown.scss` alongside `[data-ln-dropdown-menu]`.
- Enforces the global guideline of generic reusable components over specific one-offs, allowing floating menus and dropdown panels to be styled declaratively via `.dropdown` in markup even without runtime coordinator intervention.
- Included `.dropdown` in `theme/config/_theme.scss` for divider border-block resets.
- Updated [docs-mcp/components/ln-dropdown.md](https://github.com/livenetworks/ln-ashlar/blob/main/docs-mcp/components/ln-dropdown.md) with canonical `.dropdown` HTML usage and streamlined SCSS mixin documentation.

**2. Uniform Dropdown & Menu Items Geometry Inheritance.**
- Refined `theme/config/mixins/_dropdown.scss` item styling:
  - Items (`li > a`, `li > button`, `li > form > button`) inherit `--padding-y`, `--padding-x`, `--gap`, and `--color-fg` from the parent list.
  - Shields menu items from ancestor styling leaks (e.g. `@mixin app-header` zeroing button padding or muting text colors), ensuring `<form>` submit buttons have identical spacing, alignment, and ink as standard navigation anchors (`<a>`).
  - Added `white-space: normal` and `@include font-normal` to override button base defaults (`nowrap`, `font-medium`) for multiline dropdown descriptions and titles.

**3. Semantic Action States for Menu Items.**
- Introduced status color mappings for `.success`, `.error`, `.warning`, and `.info` within dropdown items.
- Destructive actions (e.g. `<button class="error">Delete</button>`) and success items automatically adopt status primary ink and matching hover tints (`--tint-hover`).

**4. Popover Embedded Action Forms Integration.**
- Updated `theme/config/mixins/_popover.scss` to detect and style action forms (`> ul > li > form > button` and `> nav > ul > li > form > button`).
- Ensures profile popovers containing POST/DELETE form buttons render captioned headers (`p + hr + nav > ul`) with accurate inline alignment and list item geometry.

**5. Documentation & Metadata Refresh.**
- Synchronized `docs/manifest.txt` and LLM index files (`llms.txt`, `llms-full.txt`).
- Updated `.claude` submodule and refreshed demo admin distribution assets.

---

## [v2.2.2](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.2.md) — November 1, 2026

> **Summary:** Presentation Layer architecture doctrine, responsive presentation navbar with collapsible mobile drawer, photo backdrop mixin with dynamic scrims, scoped card interaction gating, and refined popover/dropdown metrics.

### Overview

**1. Presentation Layer Architecture Doctrine.**
- Formalized [PRESENTATION-DOCTRINE.md](https://github.com/livenetworks/ln-ashlar/blob/main/PRESENTATION-DOCTRINE.md) and [docs-mcp/doctrine/presentation.md](https://github.com/livenetworks/ln-ashlar/blob/main/docs-mcp/doctrine/presentation.md).
- Established strict standards for marketing, landing, corporate, and presentation UI: semantic HTML5 landmarks, CSS-only composable mixins, and zero inline styles.
- Established typography link rules: inline links in running text (`p`, `li`) inherit primary underline, while title links inside headings (`h1`–`h6 a`) keep heading color and tint on hover without underlining.

**2. Responsive Presentation Navbar & Collapsible Mobile Drawer.**
- Introduced `$bp-nav: 820px;` and `--bp-nav` token in [theme/config/_breakpoints.scss](https://github.com/livenetworks/ln-ashlar/blob/main/theme/config/_breakpoints.scss) and documented in [docs-mcp/css/breakpoints.md](https://github.com/livenetworks/ln-ashlar/blob/main/docs-mcp/css/breakpoints.md).
- Updated `theme/presentation/_navbar.scss` to automatically hide `.nav-menu` and surface `.menu-toggle` below the `nav` breakpoint.
- Added direct-child collapsible navigation drawer (`ln-toggle` + `.collapsible`) with clean vertical list item styling and active route indicator.

**3. Photo Backdrop Mixin & Dynamic Scrim System.**
- Added `@mixin photo-backdrop` and `@function photo-scrim($angle, $from, $to)` in `theme/presentation/_effects.scss` (prototype class: `.photo-backdrop`).
- Automatically stretches full-bleed photography behind section content using `<figure><img ...></figure>` with an overlaid scrim gradient mixed dynamically from the section's active `--bg-base`.

**4. Scoped Card Interaction & Gating.**
- Refined `theme/config/mixins/_card.scss` to strictly scope whole-card link styling to `> a:only-child`.
- Prevents standalone links inside multi-element cards (e.g. "Read more" links inside paragraphs) from erroneously triggering whole-card border tinting and focus rings.

**5. Dropdown & Popover Metric Polish.**
- Preserved dropdown panel inset padding in `theme/config/mixins/_dropdown.scss` after `menu-items` reset, preventing item highlights from sitting flush against the panel border.
- Polish for profile menu popovers in `theme/config/mixins/_popover.scss`: captioned headers (`p + hr + nav > ul`) and normalized `nav > ul` structure.
- Updated landing and corporate demo pages to demonstrate new presentation capabilities.

---

## [v2.2.1](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.1.md) — October 31, 2026

> **Summary:** Architectural modernization of `ln-translations` following the Two-Tier model, zero hardcoded display text in JS, resilient primary field preservation, event delegation for dynamic menu/badges, data-driven CSS SVG flag pipeline, and server-rendered hydration fixes.

### Overview

**1. Two-Tier Model Architecture for `ln-translations`.**
- Extracted domain algorithms and deterministic functions into [translations-model.js](https://github.com/livenetworks/ln-ashlar/blob/main/components/ln-translations/src/translations-model.js) with zero DOM dependencies.
- Retained the lean, reactive DOM coordinator shell in [ln-translations.js](https://github.com/livenetworks/ln-ashlar/blob/main/components/ln-translations/src/ln-translations.js).
- Added comprehensive unit tests covering pure model methods (`tests/ln-translations.test.js`).

**2. Zero Hardcoded Display Text in JS Model.**
- Completely removed `DEFAULT_LOCALES` from JavaScript domain logic, strictly honoring DOCTRINE.md Section 1.D (Zero Display Text in JS).
- Locales are declared declaratively in HTML via `data-ln-translations-locales` JSON or extracted via `buildDict`.
- Fallback language names leverage browser native `Intl.DisplayNames`.

**3. Resilient Primary Field Preservation.**
- Prevented base form input destruction by strictly guarding `removeLanguage` against `defaultLang`.
- Automatically excludes `defaultLang` from the add-language dropdown (`filterAvailableLocales`).
- Simplified input cloning and removal to rely directly on natural DOM queries without synthetic markers or state mirrors.

**4. Robust Event Delegation on Menu and Badges.**
- Replaced per-element listener attachment churn with delegated click listeners on `menuEl` and `badgesEl`.
- Prevents listener loss when templates re-render dynamic items upon locale additions/removals.

**5. Server-Rendered Hydration & Demo Fix.**
- Corrected Example 2 in `translations.html` to demonstrate authentic pre-rendered server translations (Serbian `sr`) alongside base English (`en`), eliminating confusing duplicate default fields.
- `_detectExisting()` seamlessly hydrates active badges and updates dropdown options on load.

**6. Data-Driven SVG Flag Pipeline.**
- SVG country flags are bundled into `assets/flags/` and copied to `dist/flags/` and demo targets upon build.
- SCSS uses configurable `$flag-base-path` and `--ln-flag-*` custom property fallbacks with CSS Logical Properties (`padding-inline-start`, `margin-inline-start`, `padding-block`).

---

## [v2.2.0](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.2.0.md) — October 30, 2026

> **Summary:** A new default look, ported from Stefan Nikolic's UI refresh onto the token, theme and density architecture. Also new: a derived `relaxed` design bundle, page-sticky table headers by default, and tables that stack into record cards on narrow viewports.

### Overview

**1. New default look.**
- Applies to every page, with no opt-in attributes.
- Plus Jakarta Sans.
- A sky-blue accent (`--brand-primary: 201 96% 32%`) with a lifted accent in dark mode.
- A slate neutral ramp.
- Radii of 6/10/16/22px and soft single-layer shadows.
- White form fields with a visible focus ring.

**2. Density owns typography.**
- `comfortable` is the default: 16px text and 44px controls.
- `compact` uses 14px text and 36px controls.
- `spacious` uses 54px controls.
- A new `--control-line-height` token drives control heights.
- `--card-padding-*` and `--table-cell-padding-*` are density-reactive again.

**3. Components.**
- `stat-card`: a tone strip (via `.success`/`.warning`/`.error`/`.info`) and an icon tile.
- `tabs-nav-segmented`: a new mixin.
- `grid-auto`: a new mixin.
- `hgroup` panel headers.
- Cards are passive: only `a`/`button` cards respond to hover.
- Nav: icons, uppercase section headings, and counts as `a > data`.
- A navy sidebar region: `data-mode="dark" data-theme="navy"`.

**4. `relaxed` design bundle (`ln-ashlar-relaxed.css`).**
- Same markup, palette and tokens, with a different composition:
  - section cards render as transparent titled groups;
  - cards inside a section sit in an auto grid;
  - stat-card lists form a flat flex row.
- The demo switches engines (`ashlar` / `relaxed` / `tailwind`) through `ln-demo-engine`, with no FOUC.

**5. Sticky table headers.**
- Every `<thead>` pins to the top of the page scroller (`table-base($sticky: true)` is the default).
- Table wrappers (`.card`, panel bodies, `.table-container`, `[data-ln-table]`) use `overflow: clip`.
- A search toolbar placed directly before a table pins together with the header as one unit (`--table-toolbar-block-size`).

**6. Mobile record cards.**
- Below the `md` breakpoint, every table renders one record per card (`table-base($responsive: true)` → `table-responsive`).
- The label column comes from `td[data-label]`; cells without one span the full card.
- `.table-container` also switches based on its own width (`cq-down(md)`).

**7. ln-table.**
- Re-measures the virtual-scroll row height on window resize and keeps the same record at the top of the viewport.
- Defers the column-width lock while the header row is hidden.

**8. Demo.**
- A Dashboard is the home page, and the previous home page is now "Getting started".
- `data-label` is added to the demo tables and `ln-table` row templates.

---

### Upgrade notes

- **Font:** `--font-sans` now starts with `'Plus Jakarta Sans'`, and the font is not bundled. Load it on the page (for example via Google Fonts), or the stack falls back to Inter and the system fonts.
- **Removed `data-skin="soft"`:** its look is now the default. The `glass` and `outline` skins remain.
- **Removed `@mixin ln-table-card-mode`:** card mode is built into `table-base`. Use `table-base($responsive: false)` to opt a table out.
- **Wide tables:**
  - Table wrappers no longer scroll horizontally. They clip, so the header can pin to the page.
  - Wrap wide tables in `.table-container` so they stack into cards in narrow containers.
- **Mobile labels:** add `data-label` to each `<td>`, including the cells in `ln-table` row templates, so the record cards get their labels.
- **Contrast:**
  - Several design values, including the accent, the status tones and `--fg-subtle`, sit below the AAA 7:1 target.
  - Each one carries its measured ratio as a comment in `theme/config/_palette.scss`.

---

## [v2.1.13](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.13.md) — October 25, 2026

> **Summary:** SCSS selector performance optimization and CSS Logical Properties modernization: eliminates negative `:not(:has(...))` traversals, consolidates compound `:has()` tree queries using `:is(...)`, adopts direct-child combinators for navigation indicators, and migrates spacing mixins to CSS Logical Properties (`padding-inline`, `margin-inline`), resulting in measurable latency reductions across modals, forms, validation, and lists without visual regressions.

### Overview

Version `2.1.13` focuses on SCSS stylesheet performance and style recalculation optimizations across modern Chromium/Blink engines:
1. **CSS Logical Properties (`_spacing.scss`)**: Converted `px`, `py`, `mx`, `my` spacing mixins to standard CSS Logical Properties (`padding-inline`, `padding-block`, `margin-inline`, `margin-block`), reducing generated CSS declaration count by ~50% across consumer rulesets.
2. **Elimination of Negative Traversal (`:not(:has(...))` Pruning)**:
   - Replaced negative `:not(:has(.table-filter))` and `:not(:has([data-ln-sort]))` in table headers (`_table.scss`) with an additive, cascading single-action vs double-action layout model.
   - Replaced `:hover:not(:has(> input:checked))` in `pill`, `pill-outline`, and `check-list-nav` (`_form.scss`) with natural CSS source-order cascade (`:hover` followed by `&:has(> input:checked)`), eliminating unnecessary reverse tree traversals during hover and keyboard navigation.
3. **Selector Consolidation via `:is(...)`**:
   - Card table flush rules (`_card.scss` `panel-body`): Chained `:has(> table)` and `:has(> .table-container)` queries were collapsed into unified `:has(> :is(table, .table-container))` and `:has(> :is(table, .table-container, [data-ln-table]):only-child)`.
   - Form pill groups: Collapsed separate checkbox and radio selectors into `:has(> input:is([type="checkbox"], [type="radio"]))` across `pills`, `pills-outline`, and `pills-segmented`.
   - Disabled states: Unified into `&:has(> :is(input, select, button):disabled)`.
   - Tabular numerals: Consolidated into `td:has(:is(time, [data-ln-number]))`.
4. **Direct Child Navigation Scoping (`_nav.scss`)**:
   - Navigation indicator bars (`nav-links-border-grow` and `nav-links-border-top`) now scope hover and active checks strictly to immediate child anchors (`&:has(> a:hover)::before`, `&:has(> a.active)::before`), preventing recursive subtree inspection during menu navigation.

---

### Benchmark Highlights

- **`modal` interaction latency**: Dropped from 524.35ms to **397.43ms** (-24%).
- **`validate` interaction latency**: Dropped from 988.40ms to **896.25ms** (-9.3%).
- **`slug` generation latency**: Dropped from 352.92ms to **262.44ms** (-25.6%).
- **`toggle` latency**: Dropped from 276.54ms to **214.35ms** (-22.5%).
- **`list` virtual rendering latency**: Dropped from 186.24ms to **136.30ms** (-26.8%).
- **Historical Regressions**: Dropped from 15 to **2**.

---

## [v2.1.12](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.12.md) — October 20, 2026

> **Summary:** Eliminates severe 3+ second main-thread freeze during high-frequency DOM mutations and virtual row recycling by restricting `onInit` lifecycle dispatching to matching queries, guarding `ln-debug` verification behind `hasActiveDebug()`, optimizing Levenshtein string distance calculations with length difference cutoffs, and refactoring lifecycle mutation loops with lean guard clauses.

### Overview

Version `2.1.12` addresses a critical performance bottleneck identified during high-frequency DOM operations (such as table search, filtering, and virtual row recycling in `ln-table` with 1,000–10,000+ seed records):
1. **Scoped Lifecycle Initialization (`ln-core/lifecycle.js`)**: In `_handleChildListMutation`, `entry.onInit` previously fired unconditionally on every added DOM node across all registered components in `_lifecycleRegistry`. It is now strictly scoped so that `onInit` only executes when a node or its descendants match `entry.query`.
2. **Active Debug Guards (`ln-debug`)**: Verification scheduling is guarded by `hasActiveDebug()`. Pages that do not declare `data-ln-debug` completely bypass DOM contract audits and Levenshtein verifications, running in 0ms overhead.
3. **Optimized Levenshtein Verification (`debug-verifier.js`)**: Attribute spelling verification now performs fast bailouts for known attributes and skips quadratic Levenshtein matrix calculations when the string length difference exceeds 3 characters (`Math.abs(attrName.length - valid.length) > 3`) or exceeds the current minimum distance.
4. **Refactored Mutation Loops with Guard Clauses**: Redundant `if (!hasDescendants) ... else ...` branching in lifecycle mutation handlers has been replaced with negative-if guard clauses, resulting in a cleaner and more maintainable codebase (-33 lines net).

---

### Key Changes

1. **Lifecycle Engine (`components/ln-core/lifecycle.js`):**
   - Refactored `_handleChildListMutation` to check `node.nodeType !== 1` early and execute `_initElement` and `entry.onInit` only on elements matching `entry.query`.
   - Unified `addedNodes` and `removedNodes` traversal using flat guard clauses (`if (!q) continue;`), eliminating nested duplicate branches.

2. **Debug Verifier & Scheduler (`components/ln-debug/src/debug-verifier.js`):**
   - Added fast bailout (`validSet.has(attr.name)`) in `verifyAttributeSpelling`.
   - Added length-difference cutoff and pruning in `findClosestAttribute` to avoid quadratic Levenshtein matrix calculations.
   - Streamlined `scheduleVerification` to check `hasActiveDebug()` at entry and verify only the supplied subtree root.
   - Added `checkAttributeSpelling` alias for backward compatibility.

3. **Debug Component Wiring (`components/ln-debug/src/ln-debug.js`):**
   - Simplified `onInit` and `onSubtreeChange` handlers to lean one-liners delegating directly to `scheduleVerification`.

4. **Environment & Debug Gates (`components/ln-core/events.js`):**
   - Extended `hasActiveDebug()` to support `data-ln-debug` presence on `document.documentElement`.

5. **Performance Test Suite (`tests/performance_deductions.js`):**
   - Added headless benchmark measuring Filter and Sort latency on a table with 10,000 seed records, asserting execution under 150ms.

---

### Benchmark Verification

- **Filter Execution (10,000 records):** Dropped from **~3,800 ms down to ~117–126 ms**.
- **Sort Execution (10,000 records):** Dropped from **~3,800 ms down to ~92–105 ms**.
- **Full Test Suite (`npm test`):** 239/239 tests pass (0 regressions).

---

## [v2.1.11](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.11.md) — October 18, 2026

> **Summary:** Introduces injected JSON seed mode (`data-ln-table-seed`) with virtual DOM row recycling pool for instant rendering of 10,000+ records, eliminates runaway scroll feedback loops via systematic scroll-anchoring suppression, and resolves table header text collision with sort/filter controls via ellipsis truncation and action-aware minimum column widths.

### Overview

Version `2.1.11` delivers high-performance in-memory dataset handling and critical CSS improvements for data tables:
1. **Injected Seed Mode & Row Recycling**: Tables can now hydrate 10,000+ records instantly from an inlined `<script type="application/json">` without network roundtrips. A DOM row recycling pool maintains a constant footprint of 30–45 rows with virtual spacers, delivering 60fps scrolling and instantaneous 0ms search/filtering.
2. **Scroll Anchoring Loop Prevention**: Explicit suppression of browser scroll anchoring (`overflow-anchor: none`) across table roots, tbodies, spacers, and scroll containers prevents jitter and runaway feedback loops during dynamic spacer height calculations.
3. **Table Header Collision Protection**: Table headers (`th`) now enforce `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` alongside adaptive `min-width` rules, preventing column labels in compact or fixed-width grids from overflowing underneath absolutely-positioned sort and filter buttons.

---

### Key Changes

1. **Injected JSON Dataset & Row Recycling (`components/ln-table/src/ln-table.js` & `components/ln-data-store/src/ln-data-store.js`):**
   - Added `data-ln-table-seed` attribute to declare and bind inline dataset scripts.
   - Implemented virtual row recycling pool reusing existing `<tr>` elements instead of allocating thousands of DOM nodes.
   - Added top and bottom emulated spacer rows (`tr.ln-table__spacer`) to maintain accurate scrollbar thumb proportions.
   - Fixed scroll container resolution when table is placed inside a scrollable section or self-scrolling viewport.

2. **Scroll Stability (`components/ln-table/src/ln-table.js`, `theme/config/mixins/_ln-table.scss`):**
   - Disabled browser scroll anchoring on `table`, `tbody`, `_scrollContainer`, spacer rows, and placeholder rows (`overflow-anchor: none`).

3. **Table Header Layout & Styling (`theme/config/mixins/_table.scss`):**
   - Added `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` to `th` elements.
   - Added `--th-double-action-min-width: 8.5rem` for headers with both `[data-ln-sort]` and `.table-filter`.
   - Added `--th-single-action-min-width: 6rem` for headers with a single action control.
   - Scoped button dimensions with `--table-header-btn-size` and `--table-header-icon-size: 1.125rem`.

4. **Demos & Headless Test Suite:**
   - Created `demo/admin/table-seed.html` demonstrating 10,000 injected records with instant client-side search, sort, and popover filtering.
   - Added automated headless test suite `tests/headless/table-seed.mjs` verifying initial ingestion, zero network requests, row pool recycling, search, sort, and selection.

---

### Verification

- Run test suite: `npm test` (all 239 tests pass, 0 regressions).
- Headless verification: `node tests/headless/table-seed.mjs` (all functional checks passed).
- Schema integrity: `npm run sync:ln-schemas:check` (100% compliant).
- Event catalog synchronization: `npm run sync:ln-events:check` (100% compliant).

---

## [v2.1.10](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.10.md) — October 16, 2026

> **Summary:** Eliminates initial empty-state flashing in data-driven tables (`ln-table`) with declarative initial loading templates and `aria-busy` state, maintains existing rows during background queries with a dedicated footer loading indicator (`data-ln-table-loading`), and standardizes `data-ln-empty-state="loading"`.

### Overview

Version `2.1.10` addresses the UX gap in asynchronous Single Page Applications (SPAs) and dynamic tables where navigating to a view previously caused a momentary flash of the "No items found" empty state while the initial remote API fetch was in-flight. 

With this release:
1. **Initial Load (First Paint)**: When a data-driven table mounts with zero initial rows, it displays an initial loading state template (`{table}-loading` or `template[data-ln-table-loading]`) and sets `aria-busy="true"` until the authoritative dataset arrives.
2. **Subsequent Queries (Re-fetch / Filter / Sort)**: Once the table has completed its initial load (`_initialLoaded = true`), subsequent searches, column filter changes, or remote re-fetches keep the existing rows visible to preserve user context while activating a discreet loading indicator (`data-ln-table-loading`) on the far right of the table footer.
3. **Empty State Standard (`data-ln-empty-state="loading"`)**: Standardizes the `loading` semantic state within `data-ln-empty-state` alongside `no-data` and `no-results`, rendering an icon spinner and status message without BEM class pollution.

---

### Key Changes

1. **`ln-table` Initial Load & Background Query Mechanics (`components/ln-table/src/ln-table.js`):**
   - Added `data-ln-table-loading` attribute to component taxonomy (`type: 'marker'`).
   - Introduced `_showLoadingState()` method on prototype: clones scoped template `{table}-loading` or generic `template[data-ln-table-loading]` inside a full-width `<tr><td colspan="...">`, rendering with semantic classes (`table-empty ln-table__empty`).
   - Automatically renders `_showLoadingState()` and sets `aria-busy="true"` on mount for data-driven tables awaiting remote data.
   - Guarded `_render()`: calls `_showLoadingState()` instead of falling through to `_showEmptyState()` when `!this.isLoaded`.
   - Updated `_onSetLoading` handler: toggles `aria-busy` and displays `[data-ln-table-loading]` in the footer during background queries without wiping active rows once initially loaded.
   - Cleaned up indicators and references on `destroy()`.

2. **Semantic Styling (`theme/components/_ln-table.scss`):**
   - Added layout styling for `[data-ln-table-loading], .table-loading`: `margin-left: auto; display: inline-flex; align-items: center; color: var(--fg-muted);`.

3. **Empty State Component (`docs-mcp/css/empty-state.md`):**
   - Formally documented `data-ln-empty-state="loading"` alongside `no-data` and `no-results`.

4. **SPA Demo Updates (`demo/spa/`):**
   - Added `<template data-ln-template="tenants-loading">` and `<template data-ln-template="packages-loading">` with `<article data-ln-empty-state="loading">`.
   - Added `<div data-ln-table-loading class="table-loading hidden" aria-hidden="true">` to table footers on `/tenants` and `/packages`.

---

### Verification

- Run test suite: `npm test` (all 236 tests pass, 0 regressions).
- Schema integrity: `npm run sync:ln-schemas:check` (100% compliant).
- Event catalog synchronization: `npm run sync:ln-events:check` (241 canonical events).

---

## [v2.1.9](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.9.md) — October 16, 2026

> **Summary:** First-class URL query string (`?key=value`) state synchronization (`data-ln-query`) across data-layer components (`ln-search`, `ln-filter`, `ln-sort`), cleanly decoupled from hash-based UI overlays (`#modal`, `#tab`). Features zero-coordinator SPA and REST bookmarking, history replaceState without history pollution, and reactive popstate browser navigation.

### Overview

Version `2.1.9` introduces declarative, first-class URL query string parameter synchronization across Ashlar's data-layer primitives. In many modern SPAs and data-driven web applications, URL hash fragments (`#`) are dedicated to modal dialogs, tab panels, and sidebar toggles. Version `2.1.9` cleanly separates concerns by introducing `data-ln-query`, allowing searches (`?q=term` or `?search=term`), filters (`?category=design,qa`), and column sorts (`?sort=price.asc` or `?sort=amount.desc`) to live natively in `window.location.search`.

All query string mutations use `window.history.replaceState` to prevent intermediate keystrokes or filter toggles from polluting the browser history stack, while preserving full Back/Forward browser navigation via `popstate` event listeners.

---

### Key Changes

1. **Core Query Codecs (`components/ln-core/query.js`):**
   - Implemented high-performance, zero-dependency URL search parameter codecs:
     - `queryParse`: Parses `window.location.search` into a key-value dictionary.
     - `queryGet`: Retrieves string values safely from query strings.
     - `querySet`: Atomically updates, inserts, or removes parameters using `window.history.replaceState`.
     - `resolveQueryParam`: Inters and resolves parameter names from `data-ln-query`, input names, IDs, or component fallbacks.
     - `querySortEncode` / `querySortDecode`: Encodes and decodes dot-notation sort strings (e.g. `field.direction`) and legacy `sort_field`/`sort_dir` pairs.
     - `queryFilterEncode` / `queryFilterDecode`: Encodes and decodes comma-separated filter value lists.

2. **`ln-search` Query Synchronization:**
   - Added declarative `data-ln-query` attribute to search controls and targets.
   - Restores search query from URL during boot (`queueBoot`).
   - Syncs user typing immediately to the declared query parameter (e.g. `?q=term` or `?search=term`).
   - Listens to `window.addEventListener('popstate')` for seamless browser history navigation.

3. **`ln-filter` Query Synchronization:**
   - Added `data-ln-query` attribute to filter containers (`<ul>`, `<nav>`).
   - Automatically resolves parameter name from `data-ln-query="param"`, `data-ln-filter-col`, or `data-ln-filter-key`.
   - Restores checked filter states upon initial load and serializes active values into comma-delimited query strings.
   - Listens to `popstate` for history traversal.

4. **`ln-sort` Query Synchronization:**
   - Added `data-ln-query` attribute to sort controls (`<ul data-ln-sort>`).
   - Automatically synchronizes active column and direction into `?sort=field.direction` (e.g. `?sort=amount.desc`).
   - Deleting or clearing sort cleanly removes the parameter from the URL.
   - Decodes initial sort state during boot.

5. **Doctrine and Architecture Updates:**
   - Added **Section 8: URL Search Query Synchronization Doctrine (`data-ln-query`)** to `docs-mcp/doctrine/js-component-model.md`.
   - Defines strict precedence matrix: `data-ln-hash` > `data-ln-query` > `data-ln-persist` > authored DOM markup.
   - Updated component documentation and schemas across `ln-search`, `ln-filter`, `ln-sort`, `ln-table`, `ln-data-coordinator`, and `ln-core`.

6. **Interactive Demo Alignments:**
   - Updated `demo/admin/src/pages/search.html` with live `data-ln-query="q"` demo.
   - Updated `demo/admin/src/pages/filter.html` with live `data-ln-query="category"` demo.
   - Updated `demo/admin/src/pages/table.html` (SSR Table) with synchronized search, filter, and sort queries.
   - Updated `demo/admin/src/pages/table-api.html` (Client-Side Sliding Window Table) with `data-ln-query` on search, sort, and popover filters.

---

### Verification

- **Automated Test Suite:** 236/236 unit and integration tests passing (`npm test`), including dedicated `tests/query-codecs.test.js`.
- **Schema Freshness:** 100% synchronized against `ln-ashlar.html-data.json` and `web-types.json` (`npm run sync:ln-schemas:check`).
- **Production Demos:** Successfully built all 66 pages (`npm run build:demo-admin`).

---

## [v2.1.8](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.8.md) — October 16, 2026

> **Summary:** Component rendering & compositing performance optimizations: adds dedicated functional SCSS for `ln-sortable` with `touch-action: none` and GPU dragging hints, refactors `ln-toast` transitions to pure compositor properties (`transform`, `opacity`) with transient `will-change`, eliminates scroll chaining across all overlay and scroll containers via `overscroll-behavior: contain`, adds CSS containment (`contain: layout style;`) to stat cards and charts, and enables offscreen render skipping via `content-visibility: auto` on timelines.

### Overview

Version `2.1.8` introduces a targeted set of browser compositing and layout performance optimizations across multiple Ashlar UI components. It enforces clear GPU hardware acceleration boundaries—avoiding permanent composite layers that degrade ClearType font antialiasing or break `position: fixed` containing blocks—while utilizing hardware acceleration strictly during active drag or entrance/exit states. Additionally, it eliminates unwanted background page scroll chaining on modals, dropdowns, and picklists, and isolates layout reflows across complex dashboard grids.

---

### Key Changes

1. **`ln-sortable` Functional CSS & Touch/GPU Optimizations:**
   - **Dedicated Core Stylesheet:** Created `components/ln-sortable/ln-sortable.scss` aggregated into `ln-ashlar-core.css`.
   - **Touch Drag Priority:** Applied `touch-action: none; cursor: grab;` on `[data-ln-sortable-handle]` to eliminate competition between mobile touch scroll and pointer capture.
   - **Transient GPU Dragging Layer:** Added `will-change: transform, opacity;` to `.ln-sortable--dragging` for smooth 60/120 FPS drag-and-drop repositioning without layout recalculations.
   - **Visual Theme Styling:** Added `theme/components/_sortable.scss` defining drop indicators (`.ln-sortable--drop-before` / `.ln-sortable--drop-after`).

2. **`ln-toast` Compositor Transitions:**
   - **Replaced `transition: all`:** Replaced heavy `transition: all` in `_toast.scss` with explicit compositor-friendly properties: `transition: transform var(--transition-base) var(--easing-standard), opacity var(--transition-base) var(--easing-standard)`.
   - **Transient `will-change`:** Added `will-change: transform, opacity;` strictly to `.ln-enter` and `.ln-out` states, automatically releasing the composite layer upon resting state to preserve crisp font antialiasing.

3. **Scroll Chaining Elimination (`overscroll-behavior: contain`):**
   - Eliminated background page bounce and scroll hijacking across all nested scrollable surfaces upon reaching boundaries:
     - `_modal.scss` (`> main` body)
     - `_dropdown.scss` (`ul[data-ln-search]`)
     - `_popover.scss` (`> ul` filter options)
     - `_picklist.scss` (`[data-ln-picklist-list]`)
     - `_sidebar.scss` (`> main` navigation body)
     - `_table.scss` (`.table-container`) & `_position.scss` (`@mixin overflow-x-auto`)

4. **Reflow Isolation with CSS Containment:**
   - **Stat Cards (`_stat-card.scss`):** Added `contain: layout style;` to `@mixin stat-card`, ensuring dynamic metric changes or trend flips do not trigger reflow across dashboard grid parents.
   - **Data Charts (`_chart.scss`):** Added `contain: layout style;` on `.chart` container, isolating dataset updates and resizing.

5. **Offscreen Rendering Optimization for Timelines:**
   - **`_timeline.scss`:** Applied `content-visibility: auto; contain-intrinsic-size: auto 5rem;` to timeline `> li` elements, allowing browser engines to skip paint and layout work for offscreen timeline and audit trail items.

---

### Verification

- **Automated Test Suite:** 231/231 unit and integration tests passing (`npm test`).
- **Headless Chrome E2E Suite:** 100% pass rate in `tests/headless/sortable.mjs` verifying handle-only dragging, cancelable events, DOM reordering, and enable/disable cycles.
- **Production Build:** All modular SCSS and JS bundles compiled cleanly (`npm run build`).

---

## [v2.1.7](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.7.md) — October 16, 2026

> **Summary:** Eliminates SSR/API table hydration anti-pattern, establishes clean 3-Tier API table architecture with 10k virtual dataset demo (`table-api`), resolves stale-while-revalidate empty table flash on optimistic search/filter, stabilizes live query viewport position, and adds GPU composite acceleration for table sticky headers.

### Overview

Version `2.1.7` delivers significant architectural refinement and runtime stability for tabular data presentation in `ln-ashlar`. It decouples server-rendered DOM tables from remote API sliding-window virtualization, removing artificial row-scraping anti-patterns. Additionally, it addresses optimistic cache query resolution in `ln-data-store` to prevent temporary empty-state flashes during live searches, prevents viewport jump during toolbar interactions, and adds GPU layer compositing for butter-smooth scrolling across large datasets.

---

### Key Changes

1. **Clean Separation of SSR DOM and Remote API Table Architectures:**
   - **Removed Anti-Pattern:** Completely removed `data-ln-record` scraping and artificial badge/JSON text parsing from `ln-table._scanRows()`. Server-rendered HTML tables now operate purely on native DOM elements with zero synthetic model overhead.
   - **Pure 3-Tier Virtual API Table:** Converted the synchronization demo to a dedicated `table-api.html` showcasing the declarative contract: `ln-table` (view presenter with row template) $\leftrightarrow$ `ln-data-coordinator` (mediator) $\leftrightarrow$ `ln-data-store` + `ln-api-connector` (cache & transport).
   - **Catalog & Schema Cleanup:** Removed obsolete `data-ln-record` attribute declaration from `ln-table.schema.json` and synchronized schema catalog (`npm run sync:ln-schemas`).

2. **Optimistic Search & Stale-While-Revalidate Empty Table Flash Fix:**
   - **Provisional Marker Preservation:** In `ln-data-store.js`, provisional local IndexedDB results now reliably return `{ provisional: true }` even when local cache yields 0 matches for a new search term.
   - **Cache Reset Guard:** Prevents `window-cache.js` from mistaking an empty local provisional scan for an authoritative server response, preserving existing rendered rows with `.ln-table--loading` active rather than flashing "No results found" while awaiting remote fetch.
   - **Seamless Data Settlement:** Incoming authoritative slices from backend `api.php` seamlessly replace and append rows along the natural `id ASC` sorting order without jarring row jumps.

3. **Live Query Viewport Stability:**
   - **Preserved Scroll Position:** Removed redundant `scrollTop = 0` invocation in `ln-table._onRequestInvalidate()` which previously caused the entire admin page container to reset to the top whenever typing into search inputs or selecting filter options.

4. **Rendering & Virtual Scrolling Performance:**
   - **GPU Compositing Hint:** Added `will-change: transform; transform: translateZ(0);` on sticky `thead` and `tfoot` in `_ln-table.scss` to prevent repaint cycles during high-speed wheel scrolling.
   - **CSS Table Layout Token:** Changed `table-layout: auto !important;` to `table-layout: var(--table-layout, auto);` enabling fixed column layouts where needed.
   - **Viewport Boundary Guard:** Added early bailout in `ln-table._renderWindowed()` when start/end row indexes remain identical across frame ticks.

---

### Verification

- **Automated Test Suite:** 231/231 unit and integration tests passing (`npm test`).
- **Headless Chrome E2E Suite:** 100% pass rate in `tests/headless-table-api.mjs` across 10 sequential phases:
  - Initial 200-row page ingestion from backend `api.php`.
  - Virtual window scrolling downward to 1,000+ items and upward recovery.
  - Live search filtering (10,000 $\rightarrow$ 625 $\rightarrow$ 83 records) without empty table flashing.
  - Multi-criteria department and status filter popovers.
  - Multi-column sort toggle and row selection tracking.
  - Viewport scroll stability check confirming zero jump on typing/filtering.

---

## [v2.1.6](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.6.md) — October 14, 2026

> **Summary:** Resolves attribute collision in `ln-api-connector` where `data-ln-api-endpoint` shadowed `data-ln-api-path`, aligns remote sort parameter naming in backend API handlers, and introduces zero-dependency Python dev server for instant demo testing.

### Overview

Version `2.1.6` is a stability and bugfix release focused on remote data integration in `ln-api-connector`. An attribute specification collision previously caused elements specifying only `data-ln-api-path` to evaluate `this.path` as an empty string, breaking remote search, filter, and sort queries across tables and lists. This release also resolves sort parameter mismatches and adds a standalone local development server with built-in API emulation.

---

### Key Changes

1. **`ln-api-connector` Path Specification Collision Fix:**
   - **Unified Path Reader (`_readPath`):** Introduced a composite reader function `_readPath(el)` that inspects both `data-ln-api-path` and its alias `data-ln-api-endpoint`.
   - **Eliminated Property Shadowing:** Removed duplicate `prop: 'path'` assignment from `data-ln-api-endpoint` in `ATTRIBUTES`. In `attrSpec()`, mapping two attributes to the same property key caused the second attribute to overwrite the first, causing `this.path` to evaluate as `""` when only `data-ln-api-path` was declared on the DOM element.
   - **Distribution Sync:** Recompiled and synchronized `demo/dist/ln-ashlar.iife.js`, `demo/dist/ln-ashlar.js`, and standalone component bundle `components/ln-api-connector/ln-api-connector.js`.

2. **Backend Remote Query Sort Alignment (`api.php`):**
   - **Parameter Dual-Support:** Updated `demo/admin/data/api.php` sorting handler to accept both `sort_by` (the standard query parameter emitted by `ln-api-connector`) and `sort_field`.

3. **Zero-Dependency Local Dev Server (`scripts/serve.py`):**
   - **Instant Demo Server:** Added `scripts/serve.py` using Python 3 standard library (`http.server`) to serve static assets and emulate `api.php` CRUD and search endpoints directly against `documents.json` without requiring Apache or PHP.

4. **Documentation Updates:**
   - Documented `data-ln-api-endpoint` and query parameter attributes (`data-ln-api-param-offset`, `data-ln-api-param-limit`, `data-ln-api-param-search`, `data-ln-api-param-sort-field`, `data-ln-api-param-sort-dir`, `data-ln-api-connector-query-debounce`) in `components/ln-api-connector/README.md` and `docs-mcp/components/ln-api-connector.md`.

---

### Verification

- **Automated Query & Filter Test:** Verified remote queries with search, department filtering, and column sorting against simulated `api.php` endpoints.
- **Headless Runtime Validation:** Confirmed that `table-sync.html` successfully performs search narrowing (10,000 -> 625 -> 83 items) and table DOM re-rendering.

---

## [v2.1.5](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.5.md) — October 13, 2026

> **Summary:** Core `withoutLifecycle(fn)` observer suspension and moved-node fast bailouts eliminating 100% of redundant DOM queries during table sorting and DOM reordering.

### Overview

Version `2.1.5` eliminates major main-thread bottlenecks during DOM reordering and table sorting. Moving rows within the DOM previously triggered massive cascading `childList` MutationObserver sweeps across all registered Ashlar components. This release introduces `withoutLifecycle(fn)` in `ln-core` and moved-node bypass guards in `_handleChildListMutation`.

---

### Key Changes

1. **`withoutLifecycle(fn)` in `ln-core`:**
   - **Temporary Observer Suspension:** Adds `withoutLifecycle(fn)` to `components/ln-core/lifecycle.js`, safely disconnecting the core `childList` MutationObserver during synchronous DOM tree modifications.
   - **Queue Preservation (`takeRecords()`):** Drains any pending mutation records prior to disconnection so preceding asynchronous mutations are never dropped.
   - **Automatic Reconnection:** Automatically reconnects `obs.observe(document.body, { childList: true, subtree: true })` inside a `finally` block.
   - **Global & Module Access:** Re-exported through `helpers.js`, `index.js`, and globally available as `window.lnCore.withoutLifecycle`.

2. **Moved-Node Fast Bailout in `removedNodes`:**
   - **DOM Presence Check (`document.contains(node)`):** When nodes are moved or re-appended into the DOM (e.g., via `DocumentFragment`), they trigger `removedNodes` records. In `_handleChildListMutation`, `if (document.contains(node)) continue;` immediately exits before running any queries.
   - **Zero Pointless Traversal:** Completely eliminates thousands of redundant `node.querySelectorAll(entry.query)` sweeps across all 45+ registered components for elements that were never detached.

3. **`ln-sort` Integration:**
   - **Zero Mutation Records During Re-Append:** `_defaultSort` in `ln-sort` now wraps `parent.appendChild(frag)` inside `withoutLifecycle()`.
   - **Benchmark Impact:**
     - Drops `querySelectorAll` invocations during two consecutive sort clicks from **>7,200** to **0**.
     - Reduces table sorting phase execution time from **~930ms** to **<15ms** on tables with rich cell components.

---

### Verification

- **Node Unit & Integration Suite:** 231/231 passing (`npm test`).
- **Build Verification:** All 53 standalone component bundles and distribution packages compiled with zero errors (`npm run build`).

---

## [v2.1.4](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.4.md) — October 13, 2026

> **Summary:** Schwartzian Transform for `ln-sort`, inverted `readValue` priority (native `value` first), and consolidation of `ln-autoresize` into `ln-form`.

### Overview

Version `2.1.4` delivers key performance and architectural enhancements for table sorting and DOM value extraction, resolving long-standing DOM-query bottlenecks during table column sorting and prioritizing native HTML5 machine values.

---

### Key Changes

1. **`ln-sort` Performance Optimization (Schwartzian Transform):**
   - **Pre-computed Sort Keys:** In default DOM sorting (`_defaultSort`), table rows and list items are now mapped once upfront into `{ el, val }` pairs via `_readItemValue(el, field, column)`.
   - **Zero DOM Queries inside Comparator:** Eliminated $O(N \log N)$ repeated DOM traversals (`querySelector`, cell traversal, attribute checks) from inside `Array.prototype.sort()`.
   - **Benchmark Impact:**
     - **40 rows:** Reduced DOM reads from 94 to 40 (**-58%**).
     - **100 rows:** Reduced DOM reads from 991 to 100 (**-90%**), accelerating sort time by **~2×**.
     - **300 rows:** Reduced DOM reads from 2,883 to 300 (**-90%**), cutting CPU time from 5.1ms to 2.7ms.
     - On complex Blade/SSR tables with live interactive components (`ln-confirm`, `ln-date`, popovers), eliminates layout thrashing and prevents multi-second main-thread lockups.

2. **Inverted Priority in `ln-core.readValue`:**
   - **Native `value` takes First Priority:** Updated `readValue(el)` in `components/ln-core/dom.js` to evaluate `el.hasAttribute('value')` first, followed by `data-ln-value`, then `datetime` on `<time>`, and finally `textContent.trim()`.
   - **Numeric Timestamp Sorting:** Allows semantic elements like `<time value="1740000000">` and `<data value="1740000000">` to provide pure numeric seconds, locking comparison automatically to `type: "number"` (pure CPU arithmetic) regardless of localized display text.

3. **Consolidation of `ln-autoresize` into `ln-form`:**
   - Textarea auto-sizing is now natively supported via modern CSS `field-sizing: content` with fallback styling in `ln-form`, eliminating the standalone component overhead.

---

### Verification

- **Node Unit & Integration Suite:** 231/231 passing (`npm test`).
- **Chrome Headless Benchmarks:** Full 6-column benchmark verifying string, date, and number sorting across 40, 100, and 300 rows (`tests/headless/perf-sort.mjs`).
- **Demo & Schema Sync:** All 66 demo admin pages and `web-types.json` rebuilt and synchronized with v2.1.4.

---

## [v2.1.3](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.3.md) — October 13, 2026

> **Summary:** Hotfix for `ln-date` and `ln-number` constructors restoring component `self` reference.

### Overview

Version `2.1.3` is an immediate patch release resolving a runtime `TypeError` (`e._setHiddenRaw is not a function` / `self._handleInput is not a function`) introduced in `v2.1.2` during date and numeric input interactions.

---

### Root Cause & Resolution

1. **Restored `const self = this` in `ln-date` and `ln-number`**:
   - In `v2.1.2` (commit `7310ef72`), during the optimization that introduced shared module-level listener pooling (`_instances.add(this)` and `_ensureLocaleListener()`), `const self = this;` was inadvertently removed from the `_component(dom)` constructors of both `components/ln-date/src/ln-date.js` and `components/ln-number/src/ln-number.js`.
   - While `this._onLocaleChange` was replaced by the shared listener, multiple downstream event handlers and value property interceptors (`hidden.value` setter, `interceptValueProperty`, `_onInput`, `_onBlur`, `_onPaste`, etc.) still relied on `self` for lexical scoping.
   - In browser environments, undeclared `self` fell back to `window.self` (`window`), which does not implement component private methods (`_setHiddenRaw`, `_setDisplayRaw`, `_handleInput`), causing `TypeError` on user keystrokes or programmatic value assignments.
   - Restored `const self = this;` immediately following `this.dom = dom;` in both constructors.

2. **Full Framework Audit**:
   - Performed an AST scope analysis across all component source files in `components/*/src/*.js`.
   - Verified that `ln-time` (which also migrated to listener pooling) does not reference `self` anywhere in its implementation.
   - Confirmed that no other components in the library suffer from missing `self` declarations or broken lexical scopes.

---

### Verification

- **Node Test Suite:** 231/231 passing (`npm test`).
- **Headless Localization Suite:** Verified date and numeric input typing, programmatic value setters, blur reverts, and locale transitions execute cleanly without uncaught runtime errors.

---

## [v2.1.2](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.2.md) — October 12, 2026

> **Summary:** Component-wide DOM Write Guards, High-Frequency RAF Batching, Shared Listener Pooling, and Core Subtree Watcher Segregation.  
> **Detailed Benchmark Report:** [`perf-baseline.md`](https://github.com/livenetworks/ln-ashlar/blob/main/releases/perf-baseline.md)

### Overview

Version `2.1.2` delivers systemic performance optimizations across Ashlar components, cutting redundant DOM mutations by up to 100% and boosting execution speed by up to 46%. It builds upon the core lifecycle optimizations of `v2.1.0` and `v2.1.1` to ensure jank-free 60fps interactions across large tables, search lists, dropdowns, and forms.

---

### Key Changes

1. **DOM Write Guards (State Transition Checking):**
   - **`ln-search`**: Added `shouldHide !== isHidden` equality guards, cutting DOM mutations during queries from 3,910 down to 1,474 (**-62.3%**) and execution time by **-46.0%**.
   - **`ln-filter`**: Guarded list and table row visibility toggles with state checks, reducing DOM mutations from 1,584 down to 1,000 (**-36.9%**) and speeding up filtering by **-44.6%**.
   - **`ln-validate`**: Added internal valid/invalid state tracking, eliminating 100% of redundant `aria-invalid` mutations during keystrokes and cutting validation time by **-33.2%**.
   - **`ln-tabs`**: Guarded inactive tab mutations in `_applyActive()`, mutating only the newly active and previously active tab pair (**-100% redundant tab mutations**, **-34.8% faster**).

2. **High-Frequency RAF Batching & Layout Protection:**
   - **`ln-dropdown` & `ln-popover`**: Batched scroll and resize reposition passes via `requestAnimationFrame` with cancellation on close/destroy, and added write guards to placement attributes.
   - **`ln-sortable`**: Batched pointermove drag indicators via RAF, eliminating jitter during rapid dragging.
   - **`ln-list`**: Batched window resize re-measurements through RAF to prevent layout thrashing.
   - **`ln-autoresize`**: Added style height equality guards in `_resize()`, preventing redundant inline style churn.

3. **Global Listener Pooling for Micro-Components:**
   - **`ln-date`, `ln-number`, `ln-time`**: Replaced per-instance `document.addEventListener('ln-core:locale-change')` with a single module-scoped shared listener per component type (**-99.0% fewer document listeners**, **-39.1% faster dispatch**).

4. **Lifecycle Subtree Watcher Segregation (`ln-core/lifecycle.js`):**
   - Segregated `onSubtreeChange` handlers into a dedicated `_subtreeRegistry`. ChildList mutations now evaluate only the 1 component requesting subtree notifications instead of checking all 54 registered components (**-98.1% fewer registry checks**).

5. **Form Integration Fix:**
   - **`ln-form`**: Added prototype `reset()` method to restore base action mode and dispatch synthetic `input`/`change` events across form elements, aligning with the architectural specification.

---

### Benchmark Highlights

- **`ln-search` mutations:** Reduced from **3,910** to **1,474** (**-62.3%**).
- **`ln-search` execution time:** Reduced from **1,249.5 ms** to **675.1 ms** (**-46.0%**).
- **`ln-filter` mutations:** Reduced from **1,584** to **1,000** (**-36.9%**).
- **`ln-validate` redundant writes:** Reduced from **29** to **0** (**-100%**).
- **`ln-tabs` redundant mutations:** Reduced from **40** to **0** (**-100%**).
- **Global locale listeners (300 items):** Reduced from **300** to **3** (**-99.0%**).
- **Zero test regressions:** 231/231 passing (`npm test`).

---

## [v2.1.1](https://github.com/livenetworks/ln-ashlar/blob/main/releases/v2.1.1.md) — October 12, 2026

> **Summary:** Rich Text (`ln-editor`) and Core Lifecycle (`ln-core`) Performance Optimization.

### Overview

Version `2.1.1` resolves high-frequency DOM mutations and layout reflows during continuous typing in rich text editing surfaces (`ln-editor`).

### Key Changes

1. **`ln-core` Lifecycle Fast Bailout (`lifecycle.js`):**
   - Added an immediate early-return guard in `_handleChildListMutation()` for all mutations originating inside `contenteditable` or `[contenteditable="true"]` surfaces.
   - Prevents scanning all 50+ registered Ashlar components on every keystroke, line break, or text input.

2. **Focus-Scoped `selectionchange` Listener (`ln-editor.js`):**
   - The document-level `selectionchange` listener is now attached only when an editor receives `focus`, and removed immediately on `blur` and `destroy()`.
   - Eliminates redundant multi-editor event processing when multiple editors are present on the same page.

3. **Active State Batching & Attribute Write Guards (`ln-editor.js`):**
   - Formatting toolbar state calculations are batched via `requestAnimationFrame` (60fps).
   - Added guards to only execute `setAttribute('aria-pressed')` and `classList.toggle('ln-editor-active')` when the active state actually changes.

### Benchmark Highlights

- **Typing Mutations:** Reduced from **1,288** down to **4** (**-99.7%**).
- **Typing JS CPU:** Reduced from **380.2 ms** down to **127.3 ms** (**-66.5%**).
- **Total Form Lifecycle JS CPU:** Reduced by **-37.5%** (-408 ms saved).
- **Long Tasks (>50ms):** Reduced by **-50%** (from 6 down to 3).

---

## [v2.1.0](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.1.0) — October 11, 2026

Core engine consolidation uniting disparate MutationObservers into a unified lifecycle observer, introducing leaf-node fast paths, and echo guards. Significantly reduced observer overhead and idle memory footprint across all components.

---

## [v2.0.10](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.10) — October 11, 2026

Enhanced dynamic childList DOM reactivity, synchronized IDE schema definitions (web-types and HTML data), and updated documentation footers.

---

## [v2.0.8](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.8) — October 10, 2026

Major architectural refactoring of `ln-data-coordinator`, resolving query composition issues, window-cache `queryGen` synchronization, and introducing headless table integration tests.

---

## [v2.0.7](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.7) — October 9, 2026

Systemic stability release fixing event listener teardown leaks, enforcing custom event detail guards, and synchronizing native HTML popover states.

---

## [v2.0.0](https://github.com/livenetworks/ln-ashlar/releases/tag/v2.0.0) — October 2026

The Ashlar 2.0 architecture milestone: zero-dependency vanilla JS, Three-Layer architecture, strict Command & Query Separation, typed attribute contracts, and DOM-as-SSOT.
