# Density

File: `scss/config/_density.scss`. Added in v1.2, refactored in v1.3.

## Philosophy

ln-acme supports a global density toggle for data-dense UIs.
Compliance dashboards, audit log tables, settings pages with many
fields — these benefit from showing more content on screen. Marketing
pages, modals, and onboarding screens do not.

Density is implemented as a **cascade-driven base-token override**,
not a parallel token scale, not a component override. The
`.density-compact` class re-tunes the base `--spacing-*`, `--text-*`,
and `--lh-*` tokens on the element where the class is applied, and
every descendant that reads those tokens shrinks automatically.
Same mechanism as theme color overrides (`--color-primary`) — one
class, the cascade does the rest.

## Activation

Three activation paths:

### 1. Global

```html
<html class="density-compact">
```

The whole document switches to compact spacing. Persist the user's
choice client-side (`localStorage`, cookie); the library does not
persist.

### 2. Scoped

```html
<main class="density-compact">
	<!-- only this region is compact -->
</main>
```

Density is a normal CSS custom property cascade — it works at any
DOM scope, not just `<html>`. Use this for "compact data table on a
comfortable page" layouts.

### 3. Default (comfortable)

No class = comfortable mode. There is no `.density-comfortable`
form — comfortable IS the default `:root` state (values live in
`_tokens.scss`).

## What tokens the compact class overrides

| Token group | Overridden | Effect |
|---|---|---|
| `--spacing-xs/sm/md/lg` | yes | Form input padding, table cell padding, card body padding, panel header padding, alert/banner/tabs chrome, grid gaps |
| `--text-body-md`, `--lh-body-md` | yes | Body paragraphs, table cells, form inputs, nav link text |
| `--text-body-sm`, `--lh-body-sm` | yes | Small body text, breadcrumbs, nav links |
| `--text-label-md`, `--lh-label-md` | yes | Form labels, h6 |
| `--text-label-sm`, `--lh-label-sm` | yes | Table column headers (`th`) |
| `--text-title-md/sm`, `--lh-title-md/sm` | yes | h4, h5, panel header h3 |
| `--text-heading-sm/md/lg`, `--lh-heading-*` | yes | h3, h2, stat-card value |
| `--text-display-sm`, `--lh-display-sm` | yes | h1, page-header title |
| `--density-row-h` | yes | Table row min-height |

`--density-row-h` is the only token that stays density-named. It has
no analogue in the base token scale (there is no `--row-height` in
`_tokens.scss`) and is only consumed by table row `min-height`.

## What reacts to density

Short answer: everything that reads a base spacing or typography token.
Long answer — tested surfaces:

- Tables — header padding, body padding, body font + line-height, row min-height
- Forms — input/textarea/select padding, input font, label font
- Cards — body padding, footer padding, footer button gap, panel header padding + title font, card `section-card` outer
- Stat card — outer padding, value font, label font, trend font (all via heading-lg / label-md / body-sm tokens)
- Nav — link font
- Breadcrumbs — link font
- Alerts, banners, tabs — padding and gaps (via `--spacing-*`)
- Body paragraphs — `<p>` text
- All headings `h1`–`h6` — via `typography(...)` role mixin

## What does NOT react and why

Exempt surfaces — hardcoded rem or raw typography scale, intentionally.

| Component | Reason |
|---|---|
| Buttons (`<button>`, `@include btn`, btn-sm, btn-lg) | WCAG 2.5.5 hit-target floor (~44px). Shrinking buttons violates the floor. Padding and font stay raw-scale values. |
| Pill radio/checkbox | Interactive controls, same WCAG reasoning as buttons. |
| Close buttons (`close-button` mixin) | Fixed 2rem tap target. |
| Modal outer (`modal-sm/md/lg/xl`) | Only `max-width` declared in mixin — modal content inherits density via the cascade for its own `main` padding. |
| Toasts | Ephemeral notification overlay. Fixed visual scale. |
| Page-header outer chrome (pb, mb, gap) | Structural rhythm. Inner h1 DOES react via the display-sm token override. |
| Sidebar outer chrome (width, header padding, footer padding in `_shell.scss`) | Layout primitives. Inner nav link text DOES react. |
| Card accents, card `mb`, section `mb` | Decorative / page rhythm primitives. |
| Small, code, pre | Chrome typography — already at "compact" size (`text-sm` raw = 0.875rem). Shrinking further would hurt legibility. |
| Avatar text sizes | Fixed avatar sizing; text tracks the avatar pixel size, not content density. |
| Nav section dividers (`text-xs` raw) | Already tiny; shrinking breaks legibility. |

Key shift from v1.2 docs: stat-card value (`heading-lg`) now DOES react,
but gently. The decision was reversed because the user wants coherent
compression across the whole UI. The compact value for `--text-heading-lg`
is intentionally tuned to a modest 1.75rem (28px) — only 0.125rem below
the comfortable 1.875rem — so the stat-card value stays unambiguously
"the big number": 2x body text, 0.5rem clear of `heading-md`, and just
below `display-sm` (the page h1). Hierarchy is preserved; only scale is
reduced. If a consumer wants the stat value to stay at comfortable size
even in compact mode, they can override `--text-heading-lg` back on the
stat-card selector.

## Use cases

- **Audit log table** — hundreds of rows; user wants to see as many
  as possible. Activate compact globally.
- **Settings page with many fields** — flip compact for power users
  who prefer to see all fields without scrolling.
- **Embedded data table inside a comfortable dashboard** — scope
  compact to the table container only.
- **User preference toggle** — surface a "Compact density" setting
  in the user's profile; persist with `localStorage`.

## Anti-patterns

- **Auto-switching density by viewport.** Density is an explicit user
  choice. Viewport breakpoints handle layout (sidebar shows/hides),
  density handles information density inside that layout. Mixing
  the two creates surprise.
- **Per-component compact selectors.** Do NOT write
  `.density-compact table td { padding: ... }`. That explodes
  specificity and duplicates rules. Use the token-override route
  (this file's `.density-compact` block) or — if a new component
  doesn't react — switch its hardcoded padding to `var(--spacing-*)`.
- **Shrinking buttons or interactive controls.** WCAG hit target is
  non-negotiable. Density shrinks chrome and content, never controls.
- **Introducing new `--density-*` tokens.** The refactor DELETED the
  parallel scale. New components react by consuming the existing
  base tokens (`--spacing-*`, `--text-body-md`, role typography
  tokens). If a component cannot be made to react with the base
  tokens alone, that is a signal the component is chrome, not content.

## Dark mode interaction

Density and dark mode are orthogonal. Density only touches `--spacing-*`
and typography tokens; dark mode (`_theme.scss`) only touches `--color-*`.
They cannot collide:

```html
<html data-theme="dark" class="density-compact">
```

## Container query interaction

Density only changes internal spacing, never outer dimensions. A
page-header with a container query at 880px still flips at 880px
in both comfortable and compact modes.

## Adding a new component to density

1. Use `var(--spacing-*)` for padding and gap instead of hardcoded rem.
2. Use `font-size: var(--text-body-md); line-height: var(--lh-body-md);`
   (or the matching role token) instead of raw `@include text-base`
   when the element is content text.
3. Leave structural chrome hardcoded.

That's it. No new tokens, no per-component density rules. The cascade
does the work.

## Migration from v1.2

Earlier v1.2 builds had a parallel `--density-pad-*`, `--density-gap-*`,
`--density-font-body` token scale. Those tokens are DELETED in v1.3.
Consumer code that referenced them directly (rare — they were documented
as private implementation detail) must switch:

- `var(--density-pad-md)` → `var(--spacing-md)`
- `var(--density-pad-sm)` → `var(--spacing-sm)`
- `var(--density-pad-lg)` → `var(--spacing-lg)`
- `var(--density-pad-xs)` → `var(--spacing-xs)`
- `var(--density-gap-md)` → `var(--spacing-sm)` (nearest equivalent)
- `var(--density-font-body)` → `var(--text-body-md)`
- `var(--density-lh-body)` → `var(--lh-body-md)`
- `var(--density-row-h)` → unchanged (still exists)

The `.density-compact` class selector itself is unchanged.
