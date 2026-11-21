# Nav groups — nested, collapsible groups in `@mixin nav`, most-specific `ln-nav` match, nested `ln-search`

**Requested by:** a consumer (an SSR Laravel app) that shows each module's sibling screens as children of
the module entry in the sidebar. Its sidebar is `<nav data-ln-nav="active">` filtered by `ln-search`.

**Baseline:** the source is at `2.2.5`. `theme/config/mixins/_nav.scss`, `components/ln-nav/src/ln-nav.js`,
`components/ln-search/src/ln-search.js` and `components/ln-nav/README.md` are byte-identical to the
published `2.2.3`, so nothing was changed in these areas between the two versions.

**Out of scope:** version bump, `releases/`, npm publish, commits (the user does these).

---

## 1. Findings (read from source)

| # | Finding | Source |
|---|---|---|
| F1 | `@mixin nav` styles only one level: `ul`, `li`, `a`, `a > .ln-icon`, `.nav-label`, `.nav-section`, `.nav-divider`. There are no rules for `li > ul`, and no rule styles a `<button>` as a nav row. `ul { margin-inline: var(--nav-list-bleed, 0) }` would also hit a nested `ul`. | `theme/config/mixins/_nav.scss:25-109` |
| F2 | A global `button` rebinds `--padding-x/-y/--gap` on itself and gets `button-base` (border, bg, centered, nowrap). A button inside the nav therefore does **not** line up with the `a` rows unless it takes those variables from the list (`inherit`). Precedent: `@mixin menu-items`. | `theme/base/_global.scss:46-61`, `theme/config/mixins/_dropdown.scss:52-77` |
| F3 | The collapse primitive already exists: `.collapsible` (grid 0fr→1fr on `[data-ln-toggle="open"]`), `.collapsible > *` gets `collapsible-content`. **It needs exactly one child**, because only the first grid track is `0fr`. So the nested `<ul>` must sit inside a single wrapper. The chevron convention also exists: `[data-ln-toggle-for][aria-expanded="true"] .ln-chevron { rotate(180deg) }`. ln-toggle writes `aria-expanded` on every trigger. | `theme/config/mixins/_collapsible.scss`, `theme/components/_toggle.scss:30-73`, `components/ln-toggle/src/ln-toggle.js:54-62` |
| F4 | `ln-nav.update()` marks **every** link that matches exactly or as a prefix. On `/docs/fields`, both `/docs` and `/docs/fields` get `aria-current="page"`. | `components/ln-nav/src/ln-nav.js:60-93` |
| F5 | ln-search with `data-ln-search-items="li"` already reaches nested items. An item's text is its **whole subtree** (`_collectText`). Effect on a group: query = a child's label → the group `li` and that child stay visible (correct). Query = the **group's** label → the group stays visible but **all its children are hidden** (wrong: you cannot navigate). CSS cannot override this, because `[data-ln-search-hide="true"] { display: none !important; }`. A small JS change is needed. | `components/ln-search/src/ln-search.js:63-85,194-210`, `components/ln-search/ln-search.scss` |
| F6 | The admin demo shell already uses `nav … data-ln-search="" data-ln-search-items="li"` (flat). | `demo/admin/src/shell.html:222` |
| F7 | Tests: `tests/headless/nav.mjs` counts `article.demo-nav-example nav[data-ln-nav]` (`NAV_COUNT = 4`), so new demo navs must **not** use that wrapper. Unit tests run with `node --test tests/*.test.js`. The model-file precedent is `components/ln-tabs/src/tabs-model.js` + `tests/ln-tabs.test.js`. | |
| F8 | The Tailwind engine mirrors nav rules by hand (`nav.nav …`, `.app-sidebar nav …`), and `.collapsible > *` only covers `.collapsible-body`/`article` there. | `theme/tailwind/components.css:408-479,750-770` |

---

## 2. Design

### 2.1 Canonical markup — nav group

```html
<nav id="main-nav" data-ln-nav="active" data-ln-search="" data-ln-search-items="li" aria-label="Main navigation">
	<ul>
		<!-- plain entry (unchanged) -->
		<li>
			<a href="/documents">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-file-text"></use></svg>
				<span class="nav-label">Documents</span>
			</a>
		</li>
		<!-- group -->
		<li>
			<button type="button" data-ln-toggle-for="nav-group-admin" aria-controls="nav-group-admin" aria-expanded="true">
				<svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-shield-check"></use></svg>
				<span class="nav-label">Administration</span>
				<svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-icon-chevron-down"></use></svg>
			</button>
			<div id="nav-group-admin" class="collapsible" data-ln-toggle="open">
				<ul>
					<li><a href="/admin/roles"><span class="nav-label">Roles</span></a></li>
					<li><a href="/admin/users"><span class="nav-label">User access</span></a></li>
				</ul>
			</div>
		</li>
	</ul>
</nav>
```

Rules:

- **Trigger:** `<button type="button" data-ln-toggle-for>`, the direct child of the group `li`. It is not a link: a group is not a page. ln-nav only scores `a`, so the button is never marked current.
- **Panel:** one `div.collapsible[data-ln-toggle]` with a unique `id`, holding a single `<ul>` (F3). The server renders `open` for the group that contains the current page, `close` otherwise. It authors `aria-expanded` to match, and ln-toggle keeps it in sync afterwards.
- **Children** have no icon. Their labels align under the group label via `--nav-indent`.
- **One level of nesting only.** Deeper trees are not supported (no precedent; ask before adding).
- `data-ln-persist` on the panel is allowed (ln-toggle declares persist), but it is not part of the canonical shape, because it fights a server-rendered open state.

### 2.2 SCSS — `@mixin nav` delta (`theme/config/mixins/_nav.scss`)

Only the delta, token-driven, reusing existing recipes:

1. **One row recipe for `a` and the group trigger.** In `@mixin nav`, the row rule `a { … }` becomes `:is(a, li > button) { … }`. The icon rule `a > .ln-icon` becomes `:is(a, li > button) > .ln-icon`. Then add the button-only delta, modelled on `@mixin menu-items` (`_dropdown.scss:52-77`):
   - `li > button { --padding-y: inherit; --padding-x: inherit; --gap: inherit; width: 100%; box-sizing: border-box; justify-content: flex-start; background: transparent; text-align: start; white-space: normal; cursor: pointer; font-family: inherit; }`
   - Keep the existing `border` slot (it is already on the row recipe), so button and links share geometry.
   - No hard-coded colours: `--color-fg` comes from the row recipe.
2. **Presets.** In `_nav-link-active`, `nav-links-rounded`, `nav-links-border-left` and `nav-links-border-grow`, every **hover** selector that targets `a` also targets `li > button`:
   - `a { &:hover … }` → `:is(a, li > button) { &:hover … }`;
   - `li:has(> a:hover)` → `li:has(> :is(a, button):hover)`.
   - `.active` rules stay on `a` only.
   - `nav-links-border-top` (horizontal navs) is not touched: groups are a vertical-nav feature, and the docs will say so.
3. **Nested level:**
   - `li ul { margin-inline: 0; padding-inline-start: var(--nav-indent); }`, where the mixin declares `--nav-indent: var(--nav-indent-override, calc(var(--nav-icon-size) + var(--size-sm)))`.
   - `--nav-icon-size: 1.25rem` is declared once in the mixin and replaces the literal in `@include size(1.25rem)`. Same value, now named once.
   - **Check before typing:** the row `--gap` value. The indent must equal icon size + row gap. Read the actual `--gap` in the row recipe (`var(--size-sm)`) and use that same token, not a guess. If the project prefers no `-override` indirection, declare `--nav-indent` directly; consumers can rebind it on their nav selector.
4. **Group contains the current page:**
   - `li:has(> .collapsible a[aria-current="page"]) > button` gets the same ink as the active link: `color: var(--color-accent-hover)` + `@include font-semibold`, **no background**. The wash stays reserved for the current link itself.
   - Key on `aria-current`, not on the class, because the class name is configurable through `data-ln-nav`.
5. **Forced open while filtering:**
   - `&[data-ln-search]:not([data-ln-search=""]) .collapsible { grid-template-rows: 1fr; }`
   - plus the same condition for the chevron: `… li > button .ln-chevron { transform: rotate(180deg); }`, so the chevron does not contradict the open panel.
   - Precedent for a mixin that keys on `data-ln-search`: `_dropdown.scss:169`.
6. The `.nav-label` truncation and the trailing `.ln-chevron` work as they are: the label is `flex-1`, the chevron is `flex-shrink-0` from `_toggle.scss`.

### 2.3 JS — `ln-nav`: the most specific link wins

New pure model `components/ln-nav/src/nav-model.js` (Two-Tier, precedent `tabs-model.js`):

```js
/**
 * Picks the single href that represents the current location.
 * Exact match wins; otherwise the longest prefix match (unless exact-only); root is exact-only.
 * @param {string[]} hrefs        normalized hrefs of the candidate links
 * @param {string}   current      normalized current pathname
 * @param {boolean}  exact        data-ln-nav-exact
 * @returns {string|null}
 */
export function pickActiveHref(hrefs, current, exact) { … }
```

`update()`:

1. Collect the candidates as today: skip `#`, `javascript:`, `mailto:`, `tel:` and cross-host links, and clear their state.
2. Normalize each candidate's href.
3. `winner = pickActiveHref(...)`.
4. Activate (class + `aria-current="page"`) **only** links whose normalized href `=== winner`; clear all others.
5. `ln-nav:before-update` / `ln-nav:update` stay unchanged; `activeLinks` now holds only the winners.

The pushState/popstate/`onSubtreeChange` wiring is untouched.

**Identical hrefs:** two anchors with the same normalized href point at the same page. Both are marked (see open question Q1). Distinct targets are never both current.

### 2.4 JS — `ln-search`: nested items inherit their ancestors' own text

Only when `data-ln-search-items` is set, an item is matched against:

> own text of every **ancestor item** (between the item and the target) + the item's full text

instead of its full text alone.

- **Own text** = the text collected like `_collectText`, but without descending into elements that themselves match the items selector (or carry `data-ln-search-exclude`). Cache it as `el._lnSearchOwnText`, mirroring the `_lnSearchText` cache.
- **Effect:** the query "admin" keeps the group *and* its children visible. The query "roles" keeps the group and only that child, as today.
- **Flat lists:** no item has an ancestor item, so behaviour is unchanged (tables, icon grids, label lists, the demo shell nav).
- Join the parts with the existing `collapseSearchParts`, then match with `matchesSearchTokens`. No new core helper (one consumer).

---

## 3. Executor prompt

> **Context.** ln-ashlar (vanilla JS + SCSS UI library) at `/mnt/c/laragon/www/ln-ashlar` (Windows mount under WSL; git is slow, so do **not** run git at all). Implement nested, collapsible nav groups, most-specific matching in `ln-nav`, and ancestor-aware nested filtering in `ln-search`, per `plans/nav-groups.md` §2 (read it fully first; §2.1 is the canonical markup).
>
> **Read first:** `CLAUDE.md`, `DOCTRINE.md`. Then the precedents:
> - `theme/config/mixins/_nav.scss`, `theme/config/mixins/_dropdown.scss` (`@mixin menu-items`), `theme/config/mixins/_collapsible.scss`, `theme/components/_toggle.scss`;
> - `components/ln-nav/src/ln-nav.js`, `components/ln-tabs/src/tabs-model.js` + `tests/ln-tabs.test.js`, `components/ln-search/src/ln-search.js`;
> - `tests/headless/nav.mjs`, `demo/admin/src/pages/nav.html`, `theme/tailwind/components.css` (nav + collapsible sections).
>
> **Constraints:**
> - Tabs for indentation.
> - Mixin-first, tokens only, no hex in the Ashlar SCSS. The Tailwind file follows its own existing literal-value convention.
> - No new `data-ln-*` attributes.
> - No classes for state.
> - No changes outside the files listed below.
> - Do not touch `package.json` version, `releases/`, `dist/` by hand, or `node_modules`.
> - **Never run git.**
>
> **Steps**
> 1. **MODIFY** `theme/config/mixins/_nav.scss` — §2.2 items 1–5. Verify the row `--gap` token before writing the indent `calc`. *Accept:* `npm run build:demo-admin` compiles. In the built `demo/admin/nav.html` (step 6), the group button aligns with the links, children are indented under the label, and the chevron rotates on toggle.
> 2. **CREATE** `components/ln-nav/src/nav-model.js` with `pickActiveHref` (§2.3). **CREATE** `tests/ln-nav.test.js` covering:
>    - exact beats prefix;
>    - longest prefix wins (`/docs` vs `/docs/fields` on `/docs/fields/3`);
>    - `exact=true` disables prefixes;
>    - root `/` exact-only;
>    - no match → `null`;
>    - sibling-prefix `/usersX` does not match `/users`.
>
>    *Accept:* `node --test tests/ln-nav.test.js` passes.
> 3. **MODIFY** `components/ln-nav/src/ln-nav.js` — import the model; rewrite `update()` per §2.3 steps 1–5. Leave the history patch, events and `_syncAttribute` as they are. *Accept:* existing `tests/headless/nav.mjs` expectations still hold (no demo nav there has nested hrefs).
> 4. **MODIFY** `components/ln-search/src/ln-search.js` — add `_ownText(el, itemsSelector)` (cached `_lnSearchOwnText`) and an ancestor-context walk used in `_apply` only when `itemsSelector` is set (§2.4). The `dom.children` path stays byte-for-byte equivalent in behaviour.
> 5. **MODIFY** `theme/tailwind/components.css` — mirror §2.2 for `nav.nav` / `.app-sidebar nav`:
>    - group button row;
>    - nested `ul` indent;
>    - group-contains-current ink;
>    - forced open while filtering;
>    - `.collapsible > ul` gets the same overflow/min-height as `.collapsible > .collapsible-body`.
>
>    Follow that file's existing literal-value and `[data-mode="dark"]` conventions.
> 6. **MODIFY** `demo/admin/src/pages/nav.html`:
>    1. In the "Match Rules" table, add the row **Most specific wins**: `/docs` + `/docs/fields` on `/docs/fields` → only `/docs/fields`.
>    2. Add a new `section.section-card` "Nav groups". Wrap it in `article.demo-nav-group` — **not** `.demo-nav-example`, which would break `NAV_COUNT` in the headless test. Contents:
>       - a `<search>` with `<input type="search" data-ln-search-for="demo-nav-groups">`;
>       - `<nav id="demo-nav-groups" data-ln-nav="active" data-ln-search="" data-ln-search-items="li">` with §2.1 markup: one plain link `/docs` and two groups, "Admin" (`/admin/roles`, `/admin/users`) and "Docs" (`/docs/fields`, `/docs/types`);
>       - group panel ids `demo-group-admin`, `demo-group-docs`; one open, one closed.
>
>    *Accept:* `npm run build:demo-admin` regenerates `demo/admin/nav.html`.
> 7. **MODIFY** `tests/headless/nav.mjs` — add guarded sections (selector `article.demo-nav-group nav[data-ln-nav]`):
>    1. `pushPath('/docs/fields')` → only "Fields" is `aria-current="page"` (the plain `/docs` link is not).
>    2. `pushPath('/docs/42')` → `/docs` is current.
>    3. Group trigger of the group holding the current link matches `li:has(> .collapsible a[aria-current="page"]) > button`, asserted through computed `font-weight` ≥ 600.
>    4. Clicking a closed group's button sets `data-ln-toggle="open"` and `aria-expanded="true"`.
>    5. Typing the group label into the search input leaves the group and **all** its children without `data-ln-search-hide`. Typing one child label hides the other children and the unrelated group.
>    6. While filtering, a closed group's panel has a computed height > 0.
> 8. **MODIFY docs:**
>    - `components/ln-nav/README.md` (Behavior + Internals: match rule; also correct the stale "per-instance MutationObserver" text to `onSubtreeChange`, since the source has no local observer);
>    - `docs-mcp/components/ln-nav.md` (§1 behavior, the prefix variant text, a nested example);
>    - `docs-mcp/css/navigation.md` (new "Nav groups" variant with §2.1 markup; rules from §2.1; SCSS API rows for `--nav-indent`, `--nav-icon-size`; vertical-only note; pitfall: the panel must have exactly one child);
>    - `components/ln-search/README.md` + `docs-mcp/components/ln-search.md` (nested items: ancestor own text, with a nav-group example).
>
>    Do not hand-edit generated schema/event JSON; the build regenerates them.
> 9. **Verify** (from the repo root):
>    1. `npm test` — schemas, events and tokens checks plus unit tests must pass.
>    2. `npm run build` — must pass.
>    3. If an npm command fails with a native/platform binary error (node_modules installed from Windows), **stop and report**. Do not reinstall.
>    4. Headless suites need Windows Chrome + `http://localhost/ln-ashlar/`. Try `node tests/headless/nav.mjs`; if no browser is found, report it as pending for the user rather than working around it.
>
> **Acceptance (whole task):**
> - Unit and schema checks are green, and the build is green.
> - The demo nav page shows working groups.
> - Never two distinct hrefs with `aria-current="page"` in one nav.
> - Flat-list search behaviour unchanged.
> - No files changed outside steps 1–8 (plus build outputs the build itself writes).
>
> **Boundaries:**
> - Do not modify `@mixin collapsible`, `ln-toggle`, `@mixin menu-items`, `nav-links-border-top`, `releases/`, `package.json`.
> - No new npm packages.
> - No git.
> - Report deviations instead of improvising (Rule Zero).

---

## 4. Open questions (for the user)

- **Q1 — identical hrefs.** If the same href appears twice in one nav, the plan marks both (same page). Alternative: only the first in DOM order. Which?
- **Q2 — version.** The `ln-nav` default changes. A parent link is no longer current when a more specific link to the current page exists in the same nav. It was wrong a11y-wise (two `aria-current`), but it is observable → `2.3.0` rather than `2.2.6`?
- **Q3 — focusable collapsed links.** Links inside a closed `.collapsible` stay Tab-reachable. This is library-wide (accordion, toggle), not specific to nav. Fix it separately in `@mixin collapsible` (e.g. `visibility` with a delayed transition)?
- **Q4 — auto-open on client navigation.** On pushState into a closed group, the trigger is marked but the group stays closed (CSS cannot force it open without overriding the user's own close). Leave it to a project coordinator listening to `ln-nav:update`?
- **Q5 — Tailwind parity.** Included as step 5. Confirm it is wanted for this feature.
- **Q6 — ln-search rule change.** For nested item selectors only, ancestor own text now participates in matching. Acceptable as the default (no opt-in attribute)?
