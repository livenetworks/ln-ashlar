# Density

File: `scss/config/_density.scss`. Added in v1.2.

## Philosophy

ln-acme v1.2 supports a global density toggle for data-dense UIs.
Compliance dashboards, audit log tables, settings pages with many
fields — these benefit from showing more rows on screen. Marketing
pages, modals, and onboarding screens do not.

Density is implemented as a **CSS variable override**, not a
component override. A single attribute (`data-density="compact"`)
re-tunes the `--density-*` token scale, and every component
referencing those tokens shrinks automatically.

## Activation

Three activation paths:

### 1. Global

```html
<html data-density="compact">
```

The whole document switches to compact spacing. Persist user choice
client-side (`localStorage`, cookie); the library does not persist.

### 2. Scoped

```html
<main data-density="compact">
	<!-- only this region is compact -->
</main>
```

Density is a normal CSS custom property cascade — it works at any
DOM scope, not just `<html>`. Use this for "compact data table on a
comfortable page" layouts.

### 3. Default (comfortable)

No attribute = comfortable mode. There is no `data-density="comfortable"`
form — comfortable IS the default `:root` state. (You may write the
attribute explicitly to UN-set a parent `compact`, e.g. embedding a
comfortable preview inside a compact page; the override re-defines
the tokens back to their defaults.)

## Token reference

All tokens defined in `scss/config/_density.scss`.

### Padding scale

| Token | Comfortable | Compact | Used by |
|---|---|---|---|
| `--density-pad-xs` | `0.25rem` | `0.125rem` | reserved — not currently consumed |
| `--density-pad-sm` | `0.5rem` | `0.375rem` | input `py`, table cell `py`, panel header `py`, section-card footer `py` |
| `--density-pad-md` | `1rem` | `0.625rem` | input `px`, table cell `px`, panel header `px`, card body `p`, section-card footer `px` |
| `--density-pad-lg` | `1.5rem` | `1rem` | stat-card `p` |

### Gap scale

| Token | Comfortable | Compact | Used by |
|---|---|---|---|
| `--density-gap-sm` | `0.5rem` | `0.375rem` | reserved |
| `--density-gap-md` | `0.75rem` | `0.5rem` | section-card footer button gap |
| `--density-gap-lg` | `1rem` | `0.75rem` | reserved |

### Row height

| Token | Comfortable | Compact | Used by |
|---|---|---|---|
| `--density-row-h` | `2.75rem` | `2.25rem` | table `tbody tr` min-height (floor for sparse rows) |
| `--density-row-h-sm` | `2.25rem` | `1.875rem` | reserved |

### Body typography

| Token | Comfortable | Compact | Used by |
|---|---|---|---|
| `--density-font-body` | `var(--text-body-md)` (1rem) | `var(--text-body-sm)` (0.875rem) | table `td` font-size |
| `--density-lh-body` | `var(--lh-body-md)` (1.6) | `var(--lh-body-sm)` (1.5) | table `td` line-height |

## What reacts to density

| Component | Reacts? | What changes |
|---|---|---|
| Tables | YES | header cell padding, body cell padding, body cell font + line-height, row min-height |
| Forms (inputs) | YES | input/textarea/select horizontal and vertical padding |
| Cards (`section-card`) | YES | body padding, footer padding, footer button gap |
| Panel header (cards, dialogs) | YES | header padding |
| Stat card | YES | outer padding |

## What does NOT react to density and why

| Component | Why not |
|---|---|
| Buttons | Hit-target accessibility — WCAG 2.5.5 recommends ≥44px. Shrinking buttons by density violates this floor. |
| Form labels | Structural — labels NAME fields and must stay legible at any density. |
| Form actions row (`.form-actions`) | Contains buttons; cramping the gap doesn't save space if buttons themselves are full size. |
| Form grid gap | Layout — adjacent fields' focus rings must not overlap. |
| Pills, checkboxes, radios | Interactive controls; same a11y reasoning as buttons. |
| Modals | A modal is a focused interruption with its own scale. Shrinking modal padding makes it feel cramped without showing more data on screen. |
| Toast | Ephemeral, fixed visual size. Not a data display surface. |
| Page header | Fixed visual hierarchy at the top of the page. Reducing it does not improve information density of the content area. |
| Sidebar nav | Density semantics for nav are ambiguous (does compact nav mean smaller fonts, tighter rows, no labels?). Deferred until a consumer asks. |
| Card accents (`card-accent-top` etc.) | Decorative pixel borders, not content padding. |
| Section margin (`section { mb: 2rem }`) | Page rhythm primitive, not within-card density. |
| Stat card label / value / trend typography | The big number IS the stat card's identity; shrinking it defeats the component's purpose. |
| Table headers (`th` font) | Column labels are structural — must stay scannable. Header padding shrinks; header font does not. |
| Mobile-stacked table (`table-responsive`) | Already adapted by container query for small viewports; layering density would create test-matrix explosion. |

## Use cases

- **Audit log table** — hundreds of rows; user wants to see as many
  as possible. Activate compact globally.
- **Settings page with many fields** — flip compact for power users
  who navigate by keyboard and prefer to see all fields without
  scrolling.
- **Embedded data table inside a comfortable dashboard** — scope
  compact to the table only.
- **User preference toggle** — surface a setting "Compact density"
  in the user's profile; persist with `localStorage`.

## Anti-patterns

- **Auto-switching density by viewport.** Density is an explicit
  user choice. Viewport breakpoints handle layout (sidebar shows/hides),
  density handles information density inside that layout. Mixing the
  two creates surprise: the user resizes a window and content
  unexpectedly shrinks.
- **Per-component density selectors.** Do NOT write
  `[data-density="compact"] [data-ln-card] { padding: ... }`.
  That explodes specificity and duplicates rules. Use the
  `--density-*` tokens — components reference them, the override
  flows through the cascade.
- **Shrinking buttons or interactive controls.** WCAG hit target
  size is non-negotiable. Density shrinks chrome and content, never
  controls.
- **Shrinking body content text in non-table components.** Tables are
  the one exception (column scanability); everywhere else, content
  text stays at its declared size.
- **Defining new `--density-*` tokens per component.** The token
  surface is intentionally small (4 padding steps + 3 gap steps + 2
  row heights + body font/lh). New components opt in by referencing
  existing tokens, not by adding new ones.

## Dark mode interaction

Density and dark mode are orthogonal axes. Density only touches
`--density-*` tokens; dark mode (`scss/config/_theme.scss`) only
touches `--color-*` tokens. They cannot collide, and they compose:

```html
<html data-theme="dark" data-density="compact">
```

A compact, dark-mode UI works exactly as expected — every component
is both dark and dense.

## Container query interaction

Density only changes a component's INTERNAL spacing. It does NOT
change a component's outer dimensions. A filter-toolbar with a
container query at 880px still flips at 880px in both comfortable
and compact modes — the density change does not push the toolbar
across its breakpoint.

## Adding a new component to density

1. Identify spacing rules in the component's mixin file.
2. Decide for each: structural (border, label, control hit target,
   layout rhythm) or content (cell padding, card body, panel header)?
3. Replace content rules with `var(--density-pad-*)` /
   `var(--density-gap-*)`.
4. Leave structural rules literal.
5. Document the component in this file's "What reacts" table.
