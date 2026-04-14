# Plan: Design System v1.1 — Roadmap

> Master roadmap for filling design-system gaps in ln-acme. Each phase
> below becomes its own executor-ready plan file (`plans/v1.1-phase-N-*.md`)
> when the user picks it up.

## Context

ln-acme v1.0.1 ships a complete foundation: 15 SCSS components, 30+ JS
components, 121+ mixins, and a clean two-layer architecture. The core
decisions are sound. This roadmap is **not** a re-architecture — it is a
set of additions and refinements to push the library toward v1.1.

The trigger for this plan was a DocuFlow-side compliance audit on
2026-04-14. During that audit, the consuming project kept hitting the
same gaps: no responsive mixins, typography rebuilt per-project, no dark
mode, missing canonical patterns for empty states / page headers /
timelines / stat cards. None of these are architectural failures; they
are the normal gaps of a v1.0 library that has not yet had a v1.1
refinement pass.

**What this plan is:**
- A gap inventory written after reading the existing docs, CLAUDE.md,
  `docs/ln-acme-container-queries.md`, `docs/css/tokens.md`,
  `docs/css/layout.md`, and `SESSION-HANDOFF.md`.
- A phased sequence from lowest risk / highest unblock to highest effort.
- A declaration of what is **out of scope** so v1.1 does not balloon.

**What this plan is NOT:**
- An executor-ready spec. Each phase needs its own follow-up plan before
  handing to an executor. This file is the roadmap; the children are the
  route sheets.
- A rewrite. Existing behavior is preserved; new tokens/mixins/components
  are added alongside.

---

## Corrections from the triggering DocuFlow analysis

Before this plan was written, a DocuFlow-side analysis on 2026-04-14
proposed several ideas that **directly contradict existing ln-acme
decisions**. They are retracted here so this roadmap is internally
consistent with the project's documented architecture:

| Retracted proposal | Why it was wrong |
|---|---|
| `@include on(sm/md/lg)` responsive mixin for components | `docs/ln-acme-container-queries.md` is explicit: components use container queries. Media queries are reserved for the app shell. A responsive media-query mixin for components is off-doctrine. |
| `@include at(name, size)` container-query wrapper mixin | `docs/ln-acme-container-queries.md` line 82: "Child `@container` queries are always written as native CSS — no mixin wrapper." |
| Button lift + press micro-interactions (`translateY` + inner shadow) | `CLAUDE.md` § Button Architecture rules: "No `translateY` or `box-shadow` on hover — color change only." Stated decision, not an oversight. |
| Pagination component | `SESSION-HANDOFF.md` § Data Table: virtual scroll, deliberately not pagination. Users work with continuous data. |
| 12-column grid system | Doesn't align with the auto-fit / container-query philosophy. A future `grid-auto($min)` mixin serves the same need in-doctrine. |
| `@include container-query-helper` abstraction layer | Same as above — native `@container` is the rule. |

These retractions matter. Without them, v1.1 would drift away from the
core architecture and create two parallel responsive systems.

---

## Decisions preserved (do NOT touch in v1.1)

Any proposal in any phase below **must** respect these:

1. **Buttons:** no transform, no hover shadow — color change only.
2. **Responsive:** container queries for components, media queries only
   for app shell (header, sidebar, layout columns).
3. **Child `@container` queries:** always native CSS, no wrapper mixin.
4. **Two-layer architecture:** every new visual pattern ships as a mixin
   (recipe in `scss/config/mixins/`) AND a component (default applied in
   `scss/components/`).
5. **Zero hardcoded colors:** every color reads from `var(--token)`.
6. **Semantic consumer selectors:** `.btn`, `.grid`, `.badge`, etc.
   exist for prototyping only. Projects write semantic selectors with
   `@include`.
7. **Attribute-driven JS state:** `data-ln-*` is the single source of
   truth. MutationObserver drives reactions.
8. **Virtual scroll over pagination** for data tables.
9. **Form validation on keyup**, not blur, not submit-only.
10. **No BEM variant classes** like `btn--primary`, `btn--danger` — use
    `--color-primary` override on the element or parent.

---

## Genuine v1.1 gaps (the real targets)

After reading the existing architecture, these are the gaps that remain
and are worth closing in v1.1.

### A. Token system gaps

1. **No Sass-variable breakpoints for app shell.**
   `scss/config/mixins/_layout.scss` hardcodes `768px` and `1024px` inside
   `@media` declarations. Consumers cannot reference a shared
   `$bp-md` / `$bp-lg` when writing their own app-shell media queries.
   This is a real gap because ln-acme explicitly permits media queries
   for app shell — but provides no breakpoint vocabulary for them.

2. **Container breakpoints are documented but not formalized in code.**
   `docs/ln-acme-container-queries.md` lists the standard breakpoints
   (480 / 580 / 880 / 1120) but they are not Sass variables. Every
   consumer re-types the numbers. First place they drift is the first
   place the doctrine fails.

3. **Spacing scale is 6 steps.**
   Current: `xs` / `sm` / `md` / `lg` / `xl` / `2xl` (4 / 8 / 16 / 24 /
   32 / 48px). Missing `2xs` (2px) for tight gaps inside compound
   components (e.g., icon-next-to-text inside a chip) and
   `3xl` / `4xl` / `5xl` (64 / 96 / 128px) for hero layouts and section
   separators on large dashboards.

4. **Typography has no modular scale.**
   Current values (0.75, 0.875, 1.0, 1.125, 1.25, 1.5rem) do not follow
   a ratio. There are no **semantic roles** (display / heading / title /
   body / label / caption) — every consumer re-maps `text-*` mixins to
   heading levels, often differently per project. Line-heights are
   hardcoded inside the `text-*` mixins instead of being tokens.
   DocuFlow already overrides every single typography token, which is
   the visible symptom of this gap.

5. **Neutral color scale is implicit.**
   Greys are scattered across `--color-text-*`, `--color-bg-*`,
   `--color-border*`, and `--color-table-*`. There is no explicit
   `--color-neutral-50` through `--color-neutral-900` chain. This makes
   dark mode significantly harder: without a neutral scale to flip, every
   semantic token must be flipped individually, and the inter-token
   relationships (contrast, step distance) drift.

6. **No dark mode.**
   `scss/config/_theme.scss` is a 13-line empty placeholder with a
   comment explaining the pattern. No `prefers-color-scheme` wrapper, no
   `[data-theme="dark"]` layer, no per-component verification. For a B2B
   library in 2026 this is an expected feature.

7. **Motion tokens are shallow.**
   3 duration values (`--transition-fast/base/slow`) and no named
   easings. No `--easing-standard`, `--easing-decelerate`,
   `--easing-accelerate`, `--easing-spring`. Every component that needs
   a non-default curve re-defines it inline (see nav-links-border-grow
   spring in `_nav.scss`).

8. **`prefers-reduced-motion` is not respected.**
   All transitions and keyframe animations in the library play
   unconditionally. Modal slide-in, toggle collapse, loader spin,
   nav underline grow, badge pulse — all run regardless of user
   preference. This is an accessibility gap, not a stylistic one.

9. **No content-width tokens.**
   `.container` / `.container-sm` exist as selectors but not as tokens.
   Consumers that want to cap `<article>` content at 65ch (prose), or
   cap form width at 32rem, have to hardcode the value.

10. **No density system.**
    ISO / admin platforms are data-dense. Currently the only way to
    make a table or form denser is to manually override padding
    everywhere. A `[data-density="compact"]` token override that scales
    spacing and typography by a factor would let projects opt in
    without forking.

### B. SCSS component gaps

Confirmed missing (not in `scss/components/`, not in `scss/config/mixins/`,
and referenced as needed by one or more consumer projects or in the
claude-skills UI component specs):

| Component | Spec exists in claude-skills? | Needed by |
|---|---|---|
| Tooltip (CSS baseline) | — | Any form with helper text, any icon-only button |
| Popover | — | Filter dropdowns, info panels |
| Skeleton loader | `loading-state.md` | Data tables, async lists |
| Empty state pattern | `empty-state.md` | Every list view |
| Page header pattern | — | Every detail page |
| Timeline / activity feed | — | Audit log, version history (DocuFlow direct need) |
| Stepper / wizard | — | Approval flows, multi-step forms |
| Stat / KPI card | `kpi-card.md` | Dashboards |
| Toggle switch | — | Settings, feature flags |
| Chip / tag | — | Filter bar active filters, metadata display |
| Kbd | — | Keyboard-shortcut documentation inline |
| File card | — | Upload previews, attachment lists |
| Prose | — | TipTap rich-text output, long-form content |
| Filter toolbar | — | List views with search + filters + sort |

Note: `empty-state.md`, `loading-state.md`, `kpi-card.md` already exist
as specs in the claude-skills repo (per `SESSION-HANDOFF.md`). Phase 5
pulls those specs into concrete ln-acme mixins.

### C. JS component gaps

1. **Tooltip JS enhance** — positioning logic, `aria-describedby`
   wiring, dismissal on escape.
2. **Popover** — click-trigger, content slot, dismissal on outside click
   (similar architecture to `ln-dropdown` but with richer content slot).
3. **Copy to clipboard** — `navigator.clipboard.writeText` with a fade
   confirmation message; trivially reusable.
4. **Keyboard shortcut registry** — global register/unregister with an
   optional `?` help overlay. Pairs well with `ln-command-palette`.
5. **Date / time picker** — native `<input type="date">` is inconsistent
   across browsers (Firefox and Safari quirks). Optional, not v1.1-blocking.
6. **Command palette** — Cmd+K fuzzy finder. Power-user feature; opt-in.

### D. Infrastructure gaps

1. **No auto-generated token reference.** `docs/css/tokens.md` is
   hand-maintained and has already drifted (e.g., the token comment
   `/* Cards, panels */` on `--color-bg-primary` doesn't cover every
   surface that now uses it).
2. **No visual regression testing.** Shadow changes, typography changes,
   component changes all ship on trust. A DocuFlow engineer doing a
   `composer update ln-acme` has no automated signal that something
   looks different.
3. **No migration guide discipline.** v1.1 will introduce breaking
   changes (neutral scale remap, typography role tokens). There is no
   template for documenting those migrations yet.

---

## Phases

The user-facing principle from `CLAUDE.md` and `SESSION-HANDOFF.md`
applies here: each phase must be usable on its own and visually testable
via `demo/admin/`. Phases are ordered by **risk × unblock value**, not by
conceptual flow.

### Phase 1 — Foundation tokens (pure additions, zero breakage)

**Goal:** Tokenize what isn't tokenized yet. Add, don't change.

**Scope:**
- Create `scss/config/_breakpoints.scss` with Sass variables:
  `$bp-sm: 480px`, `$bp-md: 768px`, `$bp-lg: 1024px`, `$bp-xl: 1280px`,
  `$bp-2xl: 1536px`, `$bp-3xl: 1920px`.
- Expose the same as `:root` CSS custom properties (`--bp-md`, etc.)
  for JS read via `getComputedStyle`.
- Add container-query breakpoint Sass variables in the same file:
  `$cq-narrow: 480px`, `$cq-compact: 580px`, `$cq-medium: 880px`,
  `$cq-wide: 1120px`. Codifies what `docs/ln-acme-container-queries.md`
  already declares as the standard.
- Add spacing scale extensions in `scss/config/_tokens.scss`:
  `--spacing-2xs: 0.125rem`, `--spacing-3xl: 4rem`,
  `--spacing-4xl: 6rem`, `--spacing-5xl: 8rem`.
- Add content-width tokens: `--max-w-prose: 65ch`,
  `--max-w-form: 32rem`, `--max-w-content: 48rem`,
  `--max-w-container: 80rem`.
- Add named easing tokens: `--easing-standard`, `--easing-decelerate`,
  `--easing-accelerate`, `--easing-spring`.
- Add border-width strong token: `--border-width-strong: 2px`.
- Create `scss/config/mixins/_motion.scss` with one mixin:
  `@mixin motion-safe { @media (prefers-reduced-motion: no-preference) { @content; } }`.
- Register the new mixin in `_index.scss`.
- Document additions in `docs/css/tokens.md` and create
  `docs/css/breakpoints.md`.

**Out of scope for this phase:**
- Changing any existing component to *use* the new tokens. Retrofits
  belong to later phases.
- Wrapping existing animations in `motion-safe`. That's Phase 3's job.
- Consuming the breakpoints inside any existing grid mixin. Grid mixins
  stay as they are until Phase 2 or later.

**Acceptance:**
- `npm run build` green with zero new warnings.
- Grep confirms new tokens present in `_tokens.scss`.
- Grep confirms `_breakpoints.scss` exists and exports the variables.
- `motion-safe` mixin importable and usable (test with a scratch file,
  delete after).
- `demo/admin/*.html` pages render byte-identically to pre-phase (pure
  addition — no visual change expected).
- DocuFlow can `@use 'ln-acme/scss/config/breakpoints' as *;` and
  reference `$bp-md` in its own media queries (manual verification).

**Risk:** Low. Pure addition, no existing code paths touched.

**Follow-up plan needed:** `plans/v1.1-phase-1-tokens.md` with exact file
diffs.

---

### Phase 2 — Neutral color scale + semantic remap

**Goal:** Introduce an explicit neutral scale and remap existing
semantic tokens to reference it. Prepares dark mode.

**Why this is separate from Phase 1:** It is **not** a pure addition.
Remapping `--color-text-primary` to `var(--color-neutral-900)` requires
the neutral-900 HSL value to equal the current hardcoded value exactly,
or every consuming project sees a visual regression. This phase needs a
visual diff check as part of acceptance.

**Scope:**
- Add neutral scale in `scss/config/_tokens.scss`:
  ```
  --color-neutral-50:  220 20% 98%;
  --color-neutral-100: 220 16% 96%;
  --color-neutral-200: 220 14% 91%;
  --color-neutral-300: 220 13% 83%;
  --color-neutral-400: 220 11% 65%;
  --color-neutral-500: 220  9% 46%;
  --color-neutral-600: 220 11% 34%;
  --color-neutral-700: 220 14% 24%;
  --color-neutral-800: 220 20% 15%;
  --color-neutral-900: 220 30%  8%;
  ```
  Values must be chosen so the next step produces **identical pixels**
  against the current tokens.
- Remap semantic tokens to reference the neutral scale:
  ```
  --color-bg-body:       var(--color-neutral-50);
  --color-bg-primary:    var(--color-white);
  --color-bg-secondary:  var(--color-neutral-100);
  --color-text-primary:  var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-600);
  --color-text-muted:    var(--color-neutral-400);
  --color-border:        var(--color-neutral-200);
  --color-border-light:  var(--color-neutral-100);
  ```
  Each new value must be verified against the current hardcoded HSL.
  Any drift must be either eliminated or explicitly documented and
  signed off.
- Document the neutral scale in `docs/css/tokens.md` as the new
  canonical grey layer.

**Out of scope:**
- Inverting the scale for dark mode. That's Phase 4.
- Adding surface elevation layering (surface-1/2/3). Could come later
  if genuinely needed; not yet.

**Acceptance:**
- Visual diff on every `demo/admin/*.html` page: zero user-visible
  difference. Tolerance budget: 1% cross-browser anti-aliasing noise;
  anything more must be explained or fixed.
- `npm run build` green.
- Grep: `--color-neutral-50` through `--color-neutral-900` present.
- Grep: `--color-text-primary` etc. now reference `var(--color-neutral-*)`
  instead of bare HSL values.

**Risk:** Medium. Any color drift breaks downstream projects. Requires
visual regression budget. Do in a branch; do not merge without a
before/after diff check on at least 5 demo pages.

**Follow-up plan needed:** `plans/v1.1-phase-2-neutral-scale.md`.

---

### Phase 3 — Typography re-hierarchy

**Goal:** Introduce semantic typography roles and a modular scale
without breaking existing `text-*` mixins.

**Scope:**
- Add semantic role tokens in `_tokens.scss`:
  ```
  --text-display-lg: 3.75rem; --lh-display-lg: 1.1;
  --text-display-md: 3rem;    --lh-display-md: 1.1;
  --text-display-sm: 2.25rem; --lh-display-sm: 1.15;
  --text-heading-lg: 1.875rem; --lh-heading-lg: 1.2;
  --text-heading-md: 1.5rem;  --lh-heading-md: 1.25;
  --text-heading-sm: 1.25rem; --lh-heading-sm: 1.3;
  --text-title-md:   1.125rem; --lh-title-md: 1.4;
  --text-body-lg:    1.125rem; --lh-body-lg: 1.6;
  --text-body-md:    1rem;     --lh-body-md: 1.6;
  --text-body-sm:    0.875rem; --lh-body-sm: 1.5;
  --text-label-md:   0.875rem; --lh-label-md: 1.4;
  --text-label-sm:   0.75rem;  --lh-label-sm: 1.4;
  --text-caption:    0.75rem;  --lh-caption: 1.4;
  ```
- Add letter-spacing tokens: `--tracking-tight: -0.025em`,
  `--tracking-normal: 0`, `--tracking-wide: 0.025em`.
- Add a new mixin `@mixin typography($role)` that sets
  `font-size` + `line-height` + `letter-spacing` in one call:
  ```
  @include typography(display-lg);
  ```
- Keep existing `text-xs` through `text-2xl` mixins **unchanged** — they
  remain the low-level primitive. The new `typography($role)` mixin is
  the semantic layer on top.
- Switch `scss/base/_typography.scss` headings to use role tokens:
  `h1 { @include typography(display-sm); }`, etc.
- Add `font-variant-numeric: tabular-nums` to the `table-base` mixin so
  numeric columns align by default.

**Out of scope:**
- Fluid typography (`clamp()`). Future consideration; not v1.1-blocking.
- Optical sizing (InterDisplay variant). Requires font-file changes;
  defer.

**Acceptance:**
- Every existing `@include text-xs` / `text-sm` / `text-base` / `text-lg`
  / `text-xl` / `text-2xl` usage still compiles and produces identical
  CSS.
- New `@include typography(body-md)` compiles and produces the expected
  CSS block.
- `h1`–`h6` in `demo/admin/*.html` use the new role tokens.
- Numeric columns in the table demo align using tabular figures.

**Risk:** Low-medium. Heading visual weight may shift slightly if the
new role values drift from the old `text-*` values used by headings.
Accept only visible changes that are intentional and documented.

**Follow-up plan needed:** `plans/v1.1-phase-3-typography.md`.

---

### Phase 4 — Visual quality refinements (shadows + focus)

**Goal:** Raise perceptual quality of shadows and focus indicators
without violating the "no transform / no hover shadow" button rule.

**Scope:**
- Replace shadow tokens in `_tokens.scss` with cool-tinted dual-layer
  values:
  ```
  --shadow-xs: 0 1px 2px 0 hsl(220 40% 15% / 0.04);
  --shadow-sm:
      0 1px 3px 0 hsl(220 40% 15% / 0.08),
      0 1px 2px -1px hsl(220 40% 15% / 0.04);
  --shadow-md:
      0 4px 12px -2px hsl(220 40% 15% / 0.10),
      0 2px 4px -2px hsl(220 40% 15% / 0.06);
  --shadow-lg:
      0 12px 24px -6px hsl(220 40% 15% / 0.12),
      0 8px 12px -4px hsl(220 40% 15% / 0.08);
  --shadow-xl:
      0 24px 48px -12px hsl(220 40% 15% / 0.16),
      0 12px 24px -6px hsl(220 40% 15% / 0.10);
  ```
- Add new tokens: `--shadow-2xl`, `--shadow-inner` (depressed state),
  `--shadow-primary` / `--shadow-success` / `--shadow-error`
  (color-aware, for focus halos and coloured CTAs).
- Upgrade the `focus-ring` mixin in `scss/config/mixins/_focus.scss` to a
  dual-ring dual-halo style:
  ```
  box-shadow:
      0 0 0 2px hsl(var(--color-bg-primary)),
      0 0 0 4px hsl($color / 0.6),
      0 0 0 6px hsl($color / 0.15);
  ```
  This gives a visible separator ring between the focused element and
  the halo, so focus stays legible even on top of the element's own
  background.
- Verify accessibility: contrast between focus ring and body background
  must meet WCAG 2.1 1.4.11 (3:1 non-text contrast).

**Out of scope:**
- Button hover transforms. Explicitly disallowed.
- Button hover shadows. Explicitly disallowed.
- Coloured shadow on button click. Tempting but violates the rule.

**Acceptance:**
- Shadow tokens refreshed; demo card pages show visible quality lift
  (qualitative check; visual review by user).
- `focus-ring` produces the 3-layer halo on buttons, inputs, links.
- Button hover / active unchanged (color change only — rule respected).
- `npm run build` green.

**Risk:** Low. Shadows are additive. Focus-ring semantics unchanged; only
the visual rendering of the mixin changes.

**Follow-up plan needed:** `plans/v1.1-phase-4-shadows-focus.md`.

---

### Phase 5 — Motion safety + easing retrofit

**Goal:** Apply the Phase 1 `motion-safe` mixin and named easings to
every existing animation in the library.

**Scope:**
- Audit every `@keyframes` and `transition:` declaration in
  `scss/config/mixins/` and `scss/components/`.
- Wrap animation-only declarations in `@include motion-safe { … }`.
  Leave non-animation `transition` declarations (color transitions on
  hover) alone — those are fine and don't trigger vestibular issues.
- Replace hardcoded bezier curves with named easing tokens where the
  name matches intent.
- Verify `ln-modal` slide-in, `ln-toggle` collapse, `badge.live` pulse,
  `loader` spin, `nav-links-border-grow` spring all respect
  `prefers-reduced-motion` after retrofit.
- Document the `motion-safe` convention in a new `docs/css/motion.md`.

**Out of scope:**
- Adding new animations. This phase is retrofit only.
- Disabling color-transitions on hover. Those are fine.

**Acceptance:**
- Grep: every `@keyframes` used in a component is wrapped by or gated
  behind `motion-safe`.
- Manual check: load any demo page with browser `prefers-reduced-motion:
  reduce` set — modal opens instantly, accordion toggles instantly,
  badge does not pulse, loader does not spin (or spins with a static
  fallback).
- `npm run build` green.

**Risk:** Low-medium. Easy to miss one animation. Grep coverage on
`@keyframes` + a manual pass across `demo/admin/*.html` mitigates.

**Follow-up plan needed:** `plans/v1.1-phase-5-motion-safe.md`.

---

### Phase 6 — Dark mode

**Prerequisites:** Phase 2 (neutral scale), Phase 4 (cool shadows).

**Goal:** Full dark theme with minimum surface area.

**Scope:**
- Populate `scss/config/_theme.scss` with a `[data-theme="dark"]` block
  that inverts the neutral scale:
  ```
  [data-theme="dark"] {
      --color-neutral-50:  220 20%  8%;
      --color-neutral-100: 220 16% 12%;
      --color-neutral-200: 220 14% 18%;
      --color-neutral-300: 220 13% 28%;
      --color-neutral-400: 220 11% 45%;
      --color-neutral-500: 220  9% 60%;
      --color-neutral-600: 220 11% 72%;
      --color-neutral-700: 220 14% 82%;
      --color-neutral-800: 220 20% 91%;
      --color-neutral-900: 220 30% 97%;
      /* Shadow re-tuning: solid black, lower alpha */
      --shadow-sm: 0 1px 3px 0 hsl(0 0% 0% / 0.32);
      /* ... repeat for md/lg/xl/2xl */
      /* Primary tint layers need re-tuning for dark surfaces */
      --color-primary-light:   232 75% 22%;
      --color-primary-lighter: 232 50% 16%;
  }
  ```
- Add `prefers-color-scheme: dark` auto-apply gated by an opt-out
  selector:
  ```
  @media (prefers-color-scheme: dark) {
      :root:not([data-theme="light"]) {
          /* same overrides as [data-theme="dark"] */
      }
  }
  ```
- Sweep every component in `demo/admin/*.html` under dark theme:
  verify readability, focus visibility, contrast, shadow legibility.
- Add a theme-switcher example to `demo/admin/index.html` (consumer
  writes its own; library does not ship a switcher JS component).
- Create `docs/css/theming.md` covering: the `[data-theme="dark"]`
  pattern, `prefers-color-scheme` auto-apply + opt-out, tenant-level
  token overrides, per-component re-theming.

**Out of scope:**
- Automatic system-theme switching without the opt-out selector.
  Consumers must be able to force light or dark.
- Per-component dark variants. The neutral-scale flip should cover
  everything; any component that needs per-component tweaks is a signal
  of a deeper token gap to be fixed instead.

**Acceptance:**
- `<html data-theme="dark">` produces a complete, readable dark UI
  across every demo page.
- `prefers-color-scheme: dark` auto-applies unless
  `[data-theme="light"]` is set.
- WCAG AA on body text, AA-large on secondary text, 3:1 non-text
  contrast on focus rings.
- Manual visual review across all 30+ demo pages.

**Risk:** High. Biggest surface area in the roadmap. Every visual
decision must work in both modes. Allocate the most time here.

**Follow-up plan needed:** `plans/v1.1-phase-6-dark-mode.md`.

---

### Phase 7 — CSS-only components (batch)

**Goal:** Add the pure-CSS components that don't need JS. Each follows
the two-layer architecture (`scss/config/mixins/_{name}.scss` mixin +
`scss/components/_{name}.scss` default application + demo + docs).

**Components (ordered by dependency and user-visible impact):**

1. `kbd` — trivial; `<kbd>` styling. 20 lines.
2. `chip` — inline label + optional close button. Different from `pill`
   (pill is a radio/checkbox label).
3. `skeleton` — animated gradient loader block.
   Pulls `loading-state.md` from claude-skills.
4. `empty-state` — icon + title + description + action slot, centered.
   Pulls `empty-state.md` from claude-skills.
5. `tooltip` (CSS baseline) — `::before` / `::after` pseudo-elements
   positioned off `data-tooltip` attribute. No JS required for baseline.
6. `stat-card` — value + label + trend slot. Pulls `kpi-card.md`.
7. `page-header` — title + breadcrumbs slot + actions slot.
8. `toggle-switch` — `input[type="checkbox"]` with switch visual.
9. `prose` — `@include prose` for rich text: h1-h6, p, ul/ol, blockquote,
   code (inline + block), pre, table, img, figure. Used for TipTap
   output in DocuFlow.
10. `timeline` — vertical or horizontal sequence of events. Pure CSS
    if events are static; gets a JS companion in Phase 8 if interactive.
11. `stepper` — linear progress indicator for workflows. Same as
    timeline — pure CSS baseline.
12. `filter-toolbar` — pattern for search + active-filter chips + sort
    + bulk actions row. Not a single element; a layout pattern.

**Each component's sub-plan must specify:**
- Mixin signature and default parameters.
- Default selector (e.g., `[data-ln-empty-state]` or `.empty-state`).
- HTML example.
- Container-query responsive behavior.
- Dark-mode verification (after Phase 6).
- Motion-safe wrapping for any animations.
- Demo page in `demo/admin/`.
- Docs page in `docs/css/`.

**Acceptance:** Each component merges independently. Batch target: 12
components. Suggested split: 3 per sub-plan (4 sub-plans total).

**Risk:** Medium. Each component is isolated, but the batch is large.
Temptation to cut corners on dark-mode verification; resist it.

**Follow-up plans needed:** `plans/v1.1-phase-7a-*`, `7b-*`, `7c-*`,
`7d-*`, grouped by theme (loading, navigation, content, interaction).

---

### Phase 8 — JS-enhanced components

**Goal:** Components that need JS behavior on top of a CSS baseline.

**Components:**
1. `ln-tooltip` — JS enhance for CSS tooltip: smart positioning,
   viewport collision detection, `aria-describedby` wiring.
2. `ln-popover` — click-triggered, content slot, outside-click
   dismissal, positioning. Shares helpers with `ln-dropdown`.
3. `ln-copy` — copy-to-clipboard with fade-out confirmation. Trivial
   but high-value UX.
4. `ln-shortcuts` — global keyboard shortcut registry with `?` help
   overlay. Opt-in; library does not auto-bind shortcuts.

**Each component follows** the `CLAUDE.md` § "Adding a New JS Component"
checklist: IIFE pattern, `data-ln-{name}` attribute, `<template>`
elements, `js/ln-{name}/README.md`, `docs/js/{name}.md`,
`demo/admin/{name}.html`.

**Out of scope (defer to v1.2 or later):**
- Command palette (Cmd+K). Interesting but large; defer.
- Date / time picker. Needs deep cross-browser work; defer.
- Virtualized list helper beyond `ln-data-table`. Solve when needed.

**Risk:** Medium. Each JS component has higher surface than a CSS-only
component (behavior + accessibility + tests + docs + demo).

**Follow-up plans needed:** `plans/v1.1-phase-8-js-components.md`.

---

### Phase 9 — Density system

**Prerequisites:** Phase 1 (token additions).

**Goal:** Enable `[data-density="compact"]` opt-in for data-dense pages
without forking spacing/typography tokens.

**Scope:**
- Add density-mode overrides that scale spacing and typography by a
  factor:
  ```
  [data-density="compact"] {
      --spacing-xs: 0.1875rem;
      --spacing-sm: 0.375rem;
      --spacing-md: 0.75rem;
      --spacing-lg: 1.125rem;
      --spacing-xl: 1.5rem;
      --spacing-2xl: 2.25rem;

      --text-body-md: 0.875rem;  /* 14px instead of 16px */
      --text-body-sm: 0.8125rem; /* 13px instead of 14px */
  }
  ```
- Document in `docs/css/density.md` when to use compact mode (data
  tables, admin lists), when not (forms, long-form reading).
- Retrofit `table-base` to respect density mode by default — i.e., a
  table inside `[data-density="compact"]` automatically gets compact
  row heights without consumer work.

**Out of scope:**
- Multiple density levels beyond `normal` / `compact`. YAGNI until
  proven.
- Per-component density overrides. The token cascade handles it.

**Acceptance:**
- `[data-density="compact"]` on a section shrinks spacing and text size
  as expected.
- Tables inside compact mode have tight row heights.
- Demo page showing both modes side-by-side.

**Risk:** Low. Pure additive overrides.

**Follow-up plan needed:** `plans/v1.1-phase-9-density.md`.

---

### Phase 10 — Infrastructure

**Goal:** Development-experience improvements. Can run in parallel with
any other phase that is not actively editing `docs/css/tokens.md`.

**Scope:**
- Auto-generate `docs/css/tokens.md` from `_tokens.scss` via a Node
  build script. Keeps docs from drifting.
- Add Playwright visual regression snapshots for every page in
  `demo/admin/`. Baseline + diff budget.
- Add `CHANGELOG.md` with Keep-a-Changelog format.
- Add commit-lint or similar for Conventional Commit enforcement.
- Add a migration guide template: `docs/migrations/v1.0-to-v1.1.md`
  listing every breaking change with before/after snippets and
  rationale.
- Add an interactive token explorer demo (`demo/tokens.html`) that
  reads the live `:root` values and renders them as a sortable matrix.

**Out of scope:**
- Storybook. Too heavy for a library of this size; the existing
  `demo/admin/*.html` system plus a visual regression layer is enough.
- Publishing to an internal npm registry. Already handled outside this
  plan.

**Risk:** Low. No runtime behavior changes.

**Follow-up plan needed:** `plans/v1.1-phase-10-infrastructure.md`.

---

## Phase dependency graph

```
Phase 1 (tokens)
   │
   ├─→ Phase 2 (neutral scale)
   │      │
   │      ├─→ Phase 3 (typography)
   │      │
   │      └─→ Phase 4 (shadows + focus)
   │             │
   │             └─→ Phase 6 (dark mode)
   │                    │
   │                    └─→ Phase 7 (CSS components)
   │                           │
   │                           └─→ Phase 8 (JS components)
   │
   ├─→ Phase 5 (motion safety)   [independent after Phase 1]
   │
   ├─→ Phase 9 (density)         [independent after Phase 1]
   │
   └─→ Phase 10 (infrastructure) [independent after Phase 1]
```

**Minimum viable v1.1 (must-ship):** Phases 1, 2, 4, 5. Gives the
library real breakpoint vocabulary, a neutral foundation, refined
shadows, and accessibility-correct motion.

**Full v1.1:** Phases 1–7. Dark mode + CSS components shipped.

**v1.2 candidates:** Phase 8 (JS components), Phase 9 (density), Phase
10 (infrastructure). Any of these can slip without blocking v1.1 ship.

---

## Out of scope for v1.1 (do not ask about these in a sub-plan)

- Tailwind migration. Documented rejection in DocuFlow `CLAUDE.md`.
- Web components / custom elements. ln-acme's IIFE is the stated pattern.
- CSS-in-JS. Off-philosophy.
- Server-side theming / runtime CSS generation. Off-philosophy.
- Pagination component. Virtual scroll is the policy.
- Date / time picker. Deferred to v1.2 per cross-browser complexity.
- Command palette. Interesting but non-blocking.
- Fluid typography (`clamp()`). Defer until a consumer actually needs it.
- Subgrid, masonry. Defer until a consumer actually needs them.
- Motion presets (`fade-in`, `slide-up`, etc.). Phase 1 gives the
  primitives (`motion-safe` + named easings); presets can grow organically.
- Chart primitives. Out of library scope; downstream concern.

---

## Open questions for the user

Before picking a phase to execute, these need answers:

1. **DocuFlow cross-repo verification.** DocuFlow currently overrides
   most tokens in `resources/scss/_layout.scss`. Phase 2 (neutral
   remap) and Phase 3 (typography roles) will interact with those
   overrides. Should Phase 2 / Phase 3 sub-plans include a DocuFlow
   verification step, or is "don't break DocuFlow" an implicit
   requirement verified manually after each phase?

2. **Dark-mode default.** When a user visits with
   `prefers-color-scheme: dark`, should the library auto-apply dark
   theme, or should it require an explicit `[data-theme="dark"]`
   opt-in? Phase 6 above assumes auto-apply with `[data-theme="light"]`
   opt-out; confirm or change.

3. **Density blocker.** Is DocuFlow currently blocked on lack of
   density mode, or can Phase 9 slip to v1.2? If DocuFlow needs it in
   v1.1, move Phase 9 to the must-ship list.

4. **DocuFlow `--text-xs: 0.6875rem` (11px).** Phase 3 restores the
   default floor to 12px. DocuFlow's 11px override would still work
   (CSS cascade), but the WCAG concern raised in the 2026-04-14 audit
   (body text below 14px) is not resolved. Should Phase 3 include a
   DocuFlow-side recommendation to restructure its typography to use
   role tokens so 11px only applies to `[data-density="compact"]` data
   cells and not general body text?

5. **Timeline / stepper as pure CSS or JS?** Phase 7 lists them as pure
   CSS. If they need interactive progress animation (e.g., stepper that
   animates between states), they move to Phase 8. Confirm baseline
   needs are static.

6. **Visual regression budget.** Phase 2 and Phase 4 will produce small
   pixel-level differences from cross-browser anti-aliasing changes.
   What tolerance is acceptable? I suggest 1% per-page pixel difference
   as the hard limit, with anything above that requiring explicit
   review.

---

## How to execute this roadmap

1. **Pick one phase.** Start with Phase 1 — lowest risk, highest
   unblock value.
2. **Ask for a per-phase executor plan.** Hand this roadmap to the
   `scss-architect` (or equivalent) sub-agent with the chosen phase.
   Ask it to produce `plans/v1.1-phase-{N}-{name}.md` with exact file
   diffs, before/after blocks, and acceptance checks — matching the
   format of `plans/ln-data-table.md`.
3. **Hand the per-phase plan to an executor.** Same pattern as the
   DocuFlow Phase 1 backend work on 2026-04-14.
4. **Verify.** Run the verifier agent against the executor's output.
   Confirm the acceptance checks.
5. **Update `todo.md`** — mark the phase done. Link to the PR/commit.
6. **Move to the next phase.**

---

## References

- `CLAUDE.md` — ln-acme project conventions (read first)
- `docs/ln-acme-container-queries.md` — responsive strategy doctrine
- `docs/css/tokens.md` — current token reference
- `docs/css/layout.md` — current grid and container-query guidance
- `SESSION-HANDOFF.md` — prior design decisions (data table, empty
  state, form validation, modal scroll)
- `plans/ln-data-table.md` — format reference for per-phase plans
- `plans/skills-roadmap.md` — parallel work on claude-skills repo
