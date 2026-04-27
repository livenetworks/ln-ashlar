# Plan — Phase A: `--size-*` direct reads in mixin bodies

CLAUDE.md "Token Surface — Primitives + Vocabulary":

> **Mixins read primitives, not scale tokens.** Mixin bodies use
> `--padding-x`, `--padding-y`, `--gap`, `--radius`, ... — the public
> contract. The `--size-*` scale is back-end plumbing read only by
> `:root`, `.density-compact`, and region scopes that re-bind the
> primitives.

A mixin body IS a region scope. Canonical pattern:

```scss
@mixin x {
	--padding-x: var(--size-md);
	--padding-y: var(--size-sm);
	padding: var(--padding-y) var(--padding-x);
}
```

Re-audit produces 151 mixin-body lines that read `--size-*` directly
(177 total `--size-*` references − 26 documented rebinds). This plan
classifies each, introduces 2 new primitives where the existing four
(`--padding-x`, `--padding-y`, `--gap`, `--radius`) cannot cover the
property cleanly, ships the substitutions in three sequential phases,
and formalizes the exception class for genuinely intrinsic reads.

---

## §1. Re-audit — actual finding count

Source: `grep -rn "var(--size-" scss/config/mixins/ js/` (177 hits) minus
26 documented rebinds (`--padding-x|y|--gap|--radius: var(--size-*)`)
= **151 mixin-body direct reads** across **32 files**.

### §1.1 Property-type breakdown

| Property prefix | Count | Disposition |
| --- | --- | --- |
| `padding` (shorthand) | 39 | Rebind `--padding-x` / `--padding-y`, read |
| `padding-block` / `-inline` / `-top` / `-bottom` / `-left` / `-right` | 21 | Rebind primitive, read |
| `gap` | 20 | Rebind `--gap`, read |
| `margin-bottom` / `margin-top` / `margin` / `margin-block` | 30 | New primitive `--margin-block` |
| `margin-left` / `margin-right` / `margin-inline-start` | 10 | New primitive `--margin-inline` (or carve-out — see §2.4) |
| `top` / `right` / `bottom` / `left` | 18 | Mixed — rebind for trigger-gap / in-component-padding alignment, exception for viewport-edge / geometric layout math |
| `width` / `height` (calc / track) | 2 | Exception — intrinsic dimension |
| `background-position` / `background-size` | 3 | Exception — intrinsic icon decoration |
| `@mixin` SCSS arg defaults (`stack`, `row`) | 4 | Replace SCSS default with primitive |
| `@include mt(...)` | 1 | Rebind primitive, read |

Subtotal of property-prefix bins above (39+21+20+30+10+18+2+3+4+1) = 148.
The remaining 3 lines (background-position / background-size in
_translations.scss line 23 — multi-token `calc()` decoration math) round
out to 151. Verified by line-number cross-check below.

### §1.2 By file (alphabetical)

(Excludes the 26 documented rebind lines.)

| File | Violations | Notes |
| --- | --- | --- |
| `_accordion.scss` | 2 | trigger pad, body pad |
| `_alert.scss` | 2 | shorthand pad, banner padding-inline (1 rebind already) |
| `_app-shell.scss` | 4 | header gaps, header-actions gap (2 rebinds already in size-up at l119,120 — these correct) |
| `_avatar.scss` | 2 | gap, shorthand pad |
| `_borders.scss` | 2 | shadow-b decoration offset + height (calc geometric) |
| `_breadcrumbs.scss` | 2 | breadcrumb anchor pad ×2 |
| `_btn.scss` | 0 | only rebinds (correctly classified) |
| `_card.scss` | 5 | section margin / header bottom / panel-padding-bottom / section-card margin / field-list pad-block |
| `_chip.scss` | 2 | gap + shorthand pad |
| `_confirm.scss` | 1 | margin-bottom (tooltip-arrow gap) |
| `_data-table.scss` | 10 | search-label gap+pad, sort-button pad, filter-button pad+margin, filter-dropdown pad+margins, list-item pad-block |
| `_dropdown.scss` | 4 | menu-item pad, separator margin-block, menu margin-top, menu padding-block |
| `_empty-state.scss` | 3 | gap, shorthand pad, button margin-top |
| `_form.scss` | 7 | label margin-bottom, actions margin-top + padding-top, input pad, select bg-position, icon-group pad, search-clear pad, validate-errors margin-top, pill pad (3 rebinds already at l37,52,70) |
| `_kbd.scss` | 1 | shorthand pad |
| `_layout.scss` | 6 | grid `--gap` rebind ×3 (correct), stack/row SCSS defaults (4 sites = violations) |
| `_link.scss` | 1 | link-status pad |
| `_ln-table.scss` | 23 | toolbar-search-button gap, sort-icon margin-left, footer pad, filters gap+pad, fieldset gap, legend margin-right, button pad, chips gap+pad, chip pad+margin-left, clear-all margin-left, empty-state pad-block + h3/p margins |
| `_nav.scss` | 6 | a-rebind (1 correct), section pad-block + margin-top, divider margin-block, rounded li margin-top, border-left/grow/border-top padding-inline ×3 |
| `_page-header.scss` | 5 | gap, padding-bottom, margin-bottom, p margin, actions gap |
| `_progress.scss` | 1 | height (track thickness — intrinsic) |
| `_prose.scss` | 5 | blockquote pad-left, code pad-inline + pad-block, pre pad, table cell pad |
| `_sidebar.scss` | 6 | header pad-block, dismiss pos ×2 + close pad ×2 (rebinds correct), search mt, main pad-block (1 rebind already at l30, 41) |
| `_stat-card.scss` | 4 | gap, shorthand pad, trend gap, trend margin |
| `_stepper.scss` | 3 | connector top + 2 calc — geometric |
| `_table.scss` | 6 | margin-bottom, td pad, ::before left + width(calc) — geometric, action pad, filter pad |
| `_tabs.scss` | 2 | tab pad, panel pad |
| `_timeline.scss` | 6 | rail-left calc, li pad-left + pad-bottom, bullet pos calc + left, time margin-bottom, p margin |
| `_toast.scss` | 11 | container pos ×2, item-spacer margin, side pad-top, content pad, close pos ×2 (close pad rebinds correct), head gap, body margin-top, body-list margin + pad-left + li margin |
| `_tooltip.scss` | 5 | bubble pad, position offsets ×4 (calc trigger-gap) |
| `_translations.scss` | 11 | flag-input pad-left + bg-pos calc, flag-icon gap (already var(--gap)), actions/list/badge gap ×3 + badge pad + bg-pos + pad-left |
| `_upload.scss` | 11 | zone pad + small mt, list mt, item pad + margin-bottom + svg margin-right (close-pad rebinds correct), name (none), size margin-left, item-spinner margin-right (intrinsic icon dim ×2 = 1.25rem literal — out of scope), shorthand applied |

Per-file totals sum to 151.

---

## §2. Design decisions

### §2.1 Q3 — `padding-block` / `padding-inline` / per-side padding

**Decision: rebind primitive, read primitive.** Mechanical.

- `padding-block: var(--size-X)` → `--padding-y: var(--size-X); padding-block: var(--padding-y);`
- `padding-inline: var(--size-X)` → `--padding-x: var(--size-X); padding-inline: var(--padding-x);`
- `padding-{top,bottom}: var(--size-X)` → rebind `--padding-y`, read `padding-{top,bottom}: var(--padding-y);`
- `padding-{left,right}: var(--size-X)` → rebind `--padding-x`, read `padding-{left,right}: var(--padding-x);`
- `padding: var(--size-Y) var(--size-X)` shorthand → rebind both, `padding: var(--padding-y) var(--padding-x);`

**Justification.** `--padding-x` and `--padding-y` ARE the documented
public contract for shell rhythm. Direct `--size-*` reads bypass them.
Rebinds at mixin scope are exactly what CLAUDE.md prescribes. Density
mode reacts because density-compact rebinds the underlying `--size-*`
scale. No new primitives needed.

### §2.2 Q4 — `gap` directly applied

**Decision: rebind `--gap`, read.** Mechanical.

- `gap: var(--size-X)` → `--gap: var(--size-X); gap: var(--gap);`

Already the established pattern (see `_btn.scss:148`, `_form.scss:37`).

### §2.3 Q1 — `margin` (vertical, structural)

**Decision: introduce new primitive `--margin-block`.**

`margin-block`, `margin-top`, `margin-bottom`, and `margin: 0 0 X`
shorthand read this primitive. No `:root` default — soft token, like
the per-side border tokens. Each consumer rebinds locally.

**Why a new primitive (option a, not c):**

- Density-compact must be able to compress structural margins
  uniformly. Today, density-compact rebinds the `--size-*` scale, so
  scale-direct margin reads DO compress — but the cascade only works
  because of an indirection that CLAUDE.md explicitly forbids
  ("mixin bodies read primitives, not scale tokens").
- A future "comfortable-relaxed" or "spacious" theme cannot expand
  margins without reaching into the scale, unless margins go through
  a primitive.
- Comments like "Structural margin (not shell rhythm; no logical
  token)" appear in `_form.scss`, `_card.scss`, `_translations.scss`
  — author already saw the gap. This plan closes it.

**Why no `:root` default:** value variation is too wide (xs through
xl across consumers). A single default would be wrong for most
callers, and a wrong default is worse than no default. Soft-token
pattern (per-side borders) precedent: NO `:root` default, every
consumer rebinds explicitly. Read site is paired with a rebind line
above it.

**Density-mode:** no rebind needed in `.density-compact`. The
density-compact scope already rebinds `--size-md`, `--size-lg`, etc.
to compact values. A consumer mixin `--margin-block: var(--size-md);`
re-resolves `--size-md` at the consumer scope each render, so density
compresses through the chain automatically.

### §2.4 Q1 — `margin` (horizontal, structural)

**Decision: introduce companion primitive `--margin-inline`** for
symmetry, applied to:

- `margin-left` / `margin-right` (4 sites in mixins — `_upload.scss`
  l91/l112/l149, `_ln-table.scss` l243/l311/l327, `_translations.scss`
  l51 — when used as element-pushing structural offset, NOT as
  flex/grid sibling spacing where `--gap` is correct)
- `margin-inline-start` / `margin-inline-end` (3 sites in
  `_data-table.scss` l96/l116, `_ln-table.scss` l171)

Same rules as `--margin-block`: no `:root` default, rebind locally,
density-mode reacts via underlying `--size-*` cascade.

**Carve-out:** `_upload.scss:149` `margin-right: var(--size-sm)` on the
deletion-spinner is geometric icon-spacing, not structural rhythm.
Convert to `--margin-inline: var(--size-sm); margin-right:
var(--margin-inline);` for consistency — the cost is zero and avoids
having to draw a line between "icon-text gap" and "structural
horizontal margin". Same primitive, same one-liner pattern.

### §2.5 Q2 — Positional offsets (`top`/`right`/`bottom`/`left`)

**Decision: split into four sub-cases.**

#### §2.5.1 Floating-element trigger-gap → rebind `--gap`

The visual concept is "spacing between the floating element and its
trigger" — semantically identical to flex/grid gap. Use `--gap`.

Sites:
- `_tooltip.scss:36/61/69/78` `bottom|top|right|left: calc(100% +
  var(--size-xs-up))` → rebind `--gap: var(--size-xs-up);` then
  `bottom|top|right|left: calc(100% + var(--gap));`
- `_dropdown.scss:126` `margin-top: var(--size-xs)` (dropdown menu
  offset from trigger) → could use `--gap`; treating as
  `--margin-block` because the property IS margin and the dropdown's
  internal `--gap` already serves the menu items. Use `--margin-block`
  for clarity.

#### §2.5.2 In-component absolute positioning → rebind `--padding-*`

The close-button at top-right of a card sits at the same offset as the
card's padding (visually flush with content edge, not floating in
space). Read `--padding-y` / `--padding-x`.

Sites:
- `_toast.scss:94-95` close-button `top: var(--size-sm); right:
  var(--size-sm)` → rebind `--padding-y: var(--size-sm); --padding-x:
  var(--size-sm);` then `top: var(--padding-y); right:
  var(--padding-x);` — but the close button's own `--padding-y` is
  rebound on the close button itself (lines 91-92) for tap-area; the
  `top`/`right` here is on the close button's positioning relative
  to `.ln-toast__content`. The read site is the close-button selector
  scope. Best path: rebind `--padding-y` / `--padding-x` AT the
  CLOSE-BUTTON scope right next to existing `--padding-y: var(--size-2xs)`
  (which is the button's INTERNAL padding, distinct token role from
  the offset). Conflict — same primitive, two different intents on the
  same element.

  Resolve by treating positional offsets here as **scale-direct
  geometric** (see §2.5.4) rather than primitive-rebind. Same pattern
  in `_sidebar.scss:70-71` (close button at top:size-sm right:size-sm).

  **Refined decision: treat in-component absolute close-button
  positioning as geometric-intrinsic, scale-direct + comment.**

#### §2.5.3 Viewport-edge offsets → exception (scale-direct)

Toast container distance from viewport edge is shell-scope, not
component-scope. No `--padding-*` token applies. No new primitive
warranted (single use site).

Sites:
- `_toast.scss:27-28` `right: var(--size-lg); bottom: var(--size-lg)`
  → keep, add comment `// viewport-edge offset, not shell rhythm`.

#### §2.5.4 Geometric layout math → exception (scale-direct)

Stepper connector geometry, timeline bullet alignment, table-cell
::before positioning, shadow decoration offsets, in-component
absolute close-button positioning — all use the `--size-*` scale as a
length input to a geometric calculation, not as a rhythm spacing.

Sites:
- `_stepper.scss:38-40` connector top + horizontal calc
- `_timeline.scss:16/36-37` rail/bullet positioning math
- `_table.scss:113/115` ::before label position + width calc
- `_borders.scss:23/26` shadow-b offset/height
- `_toast.scss:94-95` close-button position
- `_sidebar.scss:70-71` close-button position

Add a comment to each: `// Geometric — bullet/rail intrinsic
component math, not spacing rhythm.`

### §2.6 Q5 — `calc()` expressions with scale tokens

**Decision: depends on the `calc()` semantics.**

- **Trigger-gap calc** (`calc(100% + var(--size-xs-up))`) → rebind
  `--gap`, read in calc. Already covered by §2.5.1.
- **Geometric layout math** (`calc(50% - var(--size-lg))`,
  `calc(50% + var(--size-md))`, `calc(-1 * var(--size-sm-up))`,
  multi-token composite calcs in `_translations.scss:23`) →
  exception, scale-direct + comment.

### §2.7 Q-extra — SCSS arg defaults

**Decision: replace `var(--size-*)` defaults with the corresponding
primitive.**

```scss
// before
@mixin stack($gap: var(--size-md)) { ... }
@mixin row($gap: var(--size-sm)) { ... }
@mixin row-between($gap: var(--size-sm)) { @include row($gap); }
@mixin row-center($gap: var(--size-sm)) { @include row($gap); }

// after
@mixin stack($gap: var(--gap)) { ... }
@mixin row($gap: var(--gap)) { ... }
@mixin row-between($gap: var(--gap)) { @include row($gap); }
@mixin row-center($gap: var(--gap)) { @include row($gap); }
```

**Default-theme equivalence:** all current callers pass an explicit
arg (verified by grep: `_app-shell.scss:198 @include
stack(var(--gap))`, plus internal `_layout.scss:60/65 @include
row($gap)` which delegates the bound arg). The SCSS default arm of
`stack` / `row` / `row-between` / `row-center` never fires in the
current build → no emitted CSS change.

The default still matters for future callers and for the
mental-model. `var(--gap)` aligns with the "primitive-only" rule and
resolves to the consumer's `--gap` (default `var(--size-sm)`) at the
read site. Note: this changes the IMPLIED default behavior of `stack`
from `var(--size-md)` to `var(--gap)` (= `var(--size-sm)` at :root,
= `var(--size-xs-up)` at mobile) — but since no existing caller relies
on the implied default, no regression today.

### §2.8 Q-extra — intrinsic dimensions accepted as exceptions

**Decision: formalize the carve-out class in CLAUDE.md.**

Component-intrinsic uses where `--size-*` is a length input, not a
rhythm primitive:

- `height: var(--size-xs)` (progress-track thickness — intrinsic)
- `width: ...calc(... var(--size-*) ...)` (layout-math — intrinsic)
- `background-position: var(--size-*) ...` (icon-decoration — intrinsic)
- `background-size: var(--size-*) ...` (icon-size — intrinsic)
- Geometric `calc()` (positioning math — intrinsic)
- Multi-token composite `calc()` (`_translations.scss:23`) — intrinsic

These are "component design, not spacing rhythm" per the existing
CLAUDE.md exceptions list. The list mentions "icon sizes, avatar
sizes, toggle-switch geometry, stepper-node, timeline-bullet, modal
max-widths, toast widths, popover/dropdown/tooltip min-/max-widths,
loader width/height". This plan formalizes that the same exception
covers these property classes when the value is geometric, with a
required code comment.

---

## §3. New primitives — full token additions

### §3.1 `_tokens.scss` — soft-token declaration block

NO `:root` default. Add to the existing soft-token comment block (after
the `// -- Per-side borders (SOFT — no default)` block, around line
372-386):

```scss
// -- Margin (SOFT — no default) -------------------------------------
// --margin-block, --margin-inline
//
// Read by structural rhythm rules (label-to-input gap, section
// margin, header→body separation, sibling stacking) with a per-mixin
// rebind. NOT defined here — that is intentional. The value varies
// too widely across consumers for a single :root default to be
// useful. Each consumer rebinds locally:
//
//   @mixin section {
//       --margin-block: var(--size-xl);
//       margin-bottom: var(--margin-block);
//   }
//
// Density-compact reacts automatically: density-compact rebinds the
// underlying --size-* scale, and the consumer's
// `--margin-block: var(--size-xl)` re-resolves at the consumer
// element under the compact scope.
//
// --margin-inline is the horizontal companion. Used for element-
// pushing structural offsets (icon→text gap inside a row, sibling
// element offsets). NOT for flex/grid sibling spacing — that is --gap.
```

### §3.2 `_density.scss` — no entry needed

Density-compact does NOT rebind `--margin-block` / `--margin-inline`
directly. The cascade-through-`--size-*` is sufficient (§2.3, §2.4
"Density-mode" notes). Verified by trace:

- Consumer scope: `--margin-block: var(--size-md)` → resolves at the
  consumer element.
- `:root` (default density): `--size-md = 1rem` → margin = 1rem.
- `.density-compact` ancestor scope: `--size-md = 0.625rem` →
  consumer's `--margin-block` re-resolves to `var(--size-md)` =
  `0.625rem` at the consumer → margin = 0.625rem.

Adding a parallel `--margin-block` rebind in density-compact would be
redundant.

### §3.3 CLAUDE.md — additions

#### §3.3.1 §"The primitives (what mixin bodies read)" — add bullets

Add after the structure-and-rhythm bullets:

```
- `--margin-block`, `--margin-inline` — vertical / horizontal
  structural margin (soft — NO `:root` default). Read by mixins that
  set element-pushing margin (label-to-input gap, section margins,
  sibling stacking, in-component element offsets).
```

#### §3.3.2 §"Per-side borders (SOFT — no default)" — extend the soft-token paragraph

Add a paragraph noting that `--margin-block` / `--margin-inline`
follow the same SOFT pattern.

#### §3.3.3 §"Exceptions (allowed literals)" — extend with property classes

Append:

```
- `--size-*` direct reads as length inputs to geometric component math
  (`top`/`right`/`bottom`/`left` for connector lines, bullet alignment,
  shadow offsets, in-component absolute positioning that is NOT
  flush-with-padding) — component design, not spacing rhythm. Required
  comment on each line.
- `--size-*` direct reads in `background-position` / `background-size`
  for intrinsic icon decoration — component design, not spacing rhythm.
- `--size-*` direct reads in `width` / `height` calcs that compute
  intrinsic component dimensions (track thickness, layout-math) —
  component design, not spacing rhythm.
- Viewport-edge offsets (toast container `right` / `bottom`) — shell
  positioning, not component rhythm. Required comment on each line.
```

#### §3.3.4 §"What NOT to do" — add bullet

```
- Do not introduce a per-component-surface margin token
  (`--card-margin`, `--toast-margin`). Use the cross-cutting
  `--margin-block` / `--margin-inline` primitives instead.
```

---

## §4. Substitution rule table (canonical)

| Property pattern (in mixin body) | Substitution |
| --- | --- |
| `padding: var(--size-Y) var(--size-X);` | `--padding-y: var(--size-Y);` `--padding-x: var(--size-X);` `padding: var(--padding-y) var(--padding-x);` |
| `padding: var(--size-X) var(--size-X);` (square) | `--padding-y: var(--size-X);` `--padding-x: var(--size-X);` `padding: var(--padding-y) var(--padding-x);` |
| `padding-block: var(--size-Y);` | `--padding-y: var(--size-Y);` `padding-block: var(--padding-y);` |
| `padding-inline: var(--size-X);` | `--padding-x: var(--size-X);` `padding-inline: var(--padding-x);` |
| `padding-{top,bottom}: var(--size-Y);` | `--padding-y: var(--size-Y);` `padding-{top,bottom}: var(--padding-y);` |
| `padding-{left,right}: var(--size-X);` | `--padding-x: var(--size-X);` `padding-{left,right}: var(--padding-x);` |
| `gap: var(--size-X);` | `--gap: var(--size-X);` `gap: var(--gap);` |
| `margin-block: var(--size-X);` | `--margin-block: var(--size-X);` `margin-block: var(--margin-block);` |
| `margin-{top,bottom}: var(--size-X);` | `--margin-block: var(--size-X);` `margin-{top,bottom}: var(--margin-block);` |
| `margin: 0 0 var(--size-X);` (block-only) | `--margin-block: var(--size-X);` `margin: 0 0 var(--margin-block);` |
| `margin: var(--size-X) 0 0;` (block-only top) | `--margin-block: var(--size-X);` `margin: var(--margin-block) 0 0;` |
| `margin-{left,right}: var(--size-X);` | `--margin-inline: var(--size-X);` `margin-{left,right}: var(--margin-inline);` |
| `margin-inline-{start,end}: var(--size-X);` | `--margin-inline: var(--size-X);` `margin-inline-{start,end}: var(--margin-inline);` |
| `@include mt(var(--size-X));` (single-value spacing helper) | `--margin-block: var(--size-X); @include mt(var(--margin-block));` |
| Floating-element trigger-gap `top|bottom|left|right: calc(100% +/- var(--size-X));` | `--gap: var(--size-X);` `top|...: calc(100% +/- var(--gap));` |
| In-component absolute close-button `top|right: var(--size-X)` (geometric) | Keep scale-direct, add comment `// Geometric — close-button positioning, not spacing rhythm.` |
| Viewport-edge offset `right|bottom: var(--size-X)` (toast container) | Keep scale-direct, add comment `// Viewport-edge offset, not shell rhythm.` |
| Geometric `calc()` (stepper / timeline / table-::before / shadow-b / translations bg-pos) | Keep scale-direct, add comment `// Geometric — <intent>, not spacing rhythm.` |
| `background-position`, `background-size` with `--size-*` | Keep scale-direct, add comment `// Intrinsic icon decoration, not spacing rhythm.` |
| `height: var(--size-X);` (progress track) | Keep scale-direct, add comment `// Intrinsic component dimension, not spacing rhythm.` |
| SCSS arg default `($gap: var(--size-X))` | Replace with `($gap: var(--gap))`. |

---

## §5. Phasing strategy

**Selected: three sequential phases.**

| Phase | Scope | Files | Lines | Risk |
| --- | --- | --- | --- | --- |
| A1 | Mechanical rebinds for existing primitives (`--padding-*`, `--gap`) | ~25 | ~80 | Low — pattern is fully mechanical, byte-equivalent |
| A2 | Introduce `--margin-block` / `--margin-inline`, apply to all margin reads, update `_tokens.scss` + CLAUDE.md sections | ~17 + tokens + CLAUDE.md | ~40 | Medium — new public primitives |
| A3 | Document exceptions (geometric / viewport-edge / intrinsic decoration) — comments only, plus SCSS arg defaults + CLAUDE.md exceptions list | ~10 + CLAUDE.md | ~30 | Low — comments + 4 SCSS-default lines |

Why not mega-phase: 151 line edits in one executor run risks losing
context on the design rationale per-substitution. Three phases means
each executor run has a coherent acceptance criterion (`grep` patterns
return zero/expected counts), and a build verification per phase
catches drift early.

Why not by-file: the substitution rule per LINE depends on the
property type, not the file. A file-by-file phasing would force the
executor to re-derive design decisions per file. Property-class
phasing aligns the executor's mental model with the design decisions.

Why not by-property exhaustively (one phase per property prefix):
overhead of 5+ phases vs. risk reduction is unfavorable. Three
phases group property-classes by token-introduction risk.

---

## §6. Default-theme equivalence — representative traces

Five property patterns × default theme + density-compact + Glass theme
= byte-equivalent computed values after substitution. Traces below
verify each.

### §6.1 `padding-block: var(--size-md)` → primitive rebind

**Before** (`_card.scss:269` `.field { padding-block: var(--size-xs-up); }`):

- Default theme (root): `--size-xs-up = 0.375rem`. Computed:
  `padding-block: 0.375rem`.
- Density-compact: `--size-xs-up = 0.25rem`. Computed:
  `padding-block: 0.25rem`.

**After:**

```scss
.field {
	--padding-y: var(--size-xs-up);
	padding-block: var(--padding-y);
}
```

- Default theme: consumer rebinds `--padding-y` to `var(--size-xs-up)`
  = `0.375rem`. Read resolves: `padding-block: 0.375rem`. ✓
- Density-compact: consumer rebinds `--padding-y` to `var(--size-xs-up)`
  = `0.25rem` (compact). Read resolves: `padding-block: 0.25rem`. ✓

### §6.2 `gap: var(--size-xs)` → `--gap` rebind

**Before** (`_chip.scss:11`):

- Default: `--size-xs = 0.25rem`. Computed: `gap: 0.25rem`.

**After:**

```scss
@mixin chip {
	--gap: var(--size-xs);
	gap: var(--gap);
}
```

- Default: rebind → `--gap = 0.25rem`. Read: `gap: 0.25rem`. ✓
- Density-compact: `--size-xs = 0.125rem`. Rebind re-resolves to
  `0.125rem`. Read: `gap: 0.125rem`. ✓

### §6.3 `margin-bottom: var(--size-xl)` → new `--margin-block` primitive

**Before** (`_card.scss:117` `@mixin section`):

- Default: `--size-xl = 2rem`. Computed: `margin-bottom: 2rem`.

**After:**

```scss
@mixin section {
	--margin-block: var(--size-xl);
	margin-bottom: var(--margin-block);
}
```

- Default: rebind → `--margin-block = var(--size-xl) = 2rem`. Read:
  `margin-bottom: 2rem`. ✓
- Density-compact: `--size-xl` is NOT in the compact override list
  (only `xs`/`xs-up`/`sm`/`sm-up`/`md`/`md-up`/`lg`). So `--size-xl`
  retains `:root` value = 2rem under compact. Read: `margin-bottom:
  2rem`. ✓ (matches before — compact does not compress xl, by design.)

### §6.4 `gap: var(--size-md)` (toast-head) → `--gap` rebind, no leak

**Cascade leak check.** A mixin rebind of `--gap` cascades to
descendants. Risk: a child mixin that ALSO reads `--gap` for its own
flex/grid spacing would inherit the parent's narrower rebind.

Trace `_toast.scss:105 @mixin toast-head { gap: var(--size-md) }`:

**After:**

```scss
@mixin toast-head {
	--gap: var(--size-md);
	gap: var(--gap);
}
```

`toast-head` is a `<header>` inside `.ln-toast__content`. Children:
`<h3>` (toast-title), the close button. Neither child mixin reads
`--gap` for its own gap (toast-title sets typography only, close
button has its own `--padding-*` rebind). No leak.

For mixins where leak IS a risk, use the `@mixin section` pattern from
`_card.scss:117-125` (rebind on the ancestor element scope itself,
not on a parent that scopes children). Each substitution below is
verified case-by-case in Phase A1's executor prompt.

### §6.5 `bottom: calc(100% + var(--size-xs-up))` → `--gap` rebind in calc

**Before** (`_tooltip.scss:36` `&::after { bottom: calc(100% +
var(--size-xs-up)) }`):

- Default: `--size-xs-up = 0.375rem`. Computed:
  `bottom: calc(100% + 0.375rem)`.

**After:**

```scss
&::after {
	--gap: var(--size-xs-up);
	bottom: calc(100% + var(--gap));
}
```

- Default: rebind → `--gap = 0.375rem`. Read in calc resolves to
  `calc(100% + 0.375rem)`. ✓

`::after` pseudo-element scope: cascade leak limited to the pseudo
element itself, no descendants to inherit. Safe.

---

## §7. Build verification

Each phase ends with `npm run build`. Expected: build succeeds with no
new warnings.

Build alone does NOT prove byte-equivalence. The §6 traces and
acceptance greps (§9) carry the byte-equivalence argument.

---

## §8. Acceptance greps (after all three phases)

Run from repo root.

### §8.1 ZERO matches expected (in mixin bodies)

```sh
# Direct margin-block / margin-top / margin-bottom read of --size-* not preceded by --margin-block rebind on the same selector
grep -n "margin-block:\s*var(--size-" scss/config/mixins/
grep -n "margin-top:\s*var(--size-" scss/config/mixins/
grep -n "margin-bottom:\s*var(--size-" scss/config/mixins/
# Direct padding read of --size-* without --padding-* rebind on same selector
grep -n "padding[^:]*:\s*var(--size-" scss/config/mixins/ | grep -v "^.*--padding-"
# Direct gap of --size-* without --gap rebind on same selector
grep -n "^\s*gap:\s*var(--size-" scss/config/mixins/ | grep -v "^.*--gap:"
```

(Greps are guidance; visual review needed because rebind+read pairs
land on adjacent lines.)

### §8.2 EXPECTED matches (carved out as exceptions, must have comment)

```sh
# Geometric / intrinsic / viewport-edge / icon-decoration reads
grep -n "var(--size-" scss/config/mixins/
# Each remaining hit must be on a line preceded by or accompanied by a
# comment explaining the carve-out. Manual review.
```

Expected residual count after all three phases: ~25-30 lines (geometric
calc + viewport-edge + intrinsic dimension + bg-pos/bg-size + size-*
inside calc that doesn't reduce to a primitive).

### §8.3 New primitives are reachable (positive checks)

```sh
grep -n "\\-\\-margin-block:\s*var(--size-" scss/config/mixins/
grep -n "\\-\\-margin-inline:\s*var(--size-" scss/config/mixins/
# Each grep hit must have a paired margin-* read on the next 1-3 lines.
```

### §8.4 Token surface in `_tokens.scss`

```sh
grep -n "margin-block\|margin-inline" scss/config/_tokens.scss
# Expected: hits inside the SOFT comment block; NO :root declaration.
```

---

## §9. Out-of-scope items

- **`scss/components/_loader.scss:5` `margin-block: var(--size-3xl)`**
  — consumer scope, not mixin body. Components/ is the apply-mixin-to-
  default-selector layer; CLAUDE.md's "mixin bodies" rule does not
  cover components. The 1 hit is left as-is.
- **`scss/base/_typography.scss` raw `mb(1rem)` etc.** — base/ is
  not mixin scope, but uses raw rem values. Out of scope for THIS
  Phase A; could be a separate cleanup.
- **`--text-*`, `--lh-*`, `--shadow-*`, `--radius-*` direct reads**
  — already permitted under the "role scales" carve-out in CLAUDE.md.
  Not part of Phase A.
- **Project-side SCSS** — Phase A only governs the library's own
  mixin bodies. Consumer projects (Laravel apps) read primitives but
  may also choose to read `--size-*` in their own scopes (allowed by
  CLAUDE.md; consumer scope IS a region scope).
- **`--density-row-h`** — already correctly density-named (§ density
  spec). Out of scope.
- **JS-co-located SCSS visual reads** — verified zero `var(--size-*)`
  hits in `js/`. Nothing to migrate.

---

## §10. Phase A1 — Mechanical rebinds for existing primitives

Substitute every `padding`/`padding-block`/`padding-inline`/`gap`
direct `--size-*` read with a primitive rebind+read pair.

### §10.1 File-by-file edits

For each line below, the substitution follows §4. Indentation is
tab-based; rebind line(s) MUST sit immediately above the read line, at
the same indentation level.

#### `scss/config/mixins/_table.scss`

- L99 `padding: var(--size-sm-up) var(--size-md);` (in `@mixin
  table-responsive` `td`) → `--padding-y: var(--size-sm-up);
  --padding-x: var(--size-md); padding: var(--padding-y)
  var(--padding-x);`
- L156 `padding: var(--size-xs) var(--size-sm);` (`@mixin
  table-action`) → rebind+read.
- L180 `padding: var(--size-2xs) var(--size-2xs);` (`@mixin
  table-filter-button`) → rebind+read.

#### `scss/config/mixins/_translations.scss`

- L20-23: COMPLEX. The `padding-left` is a multi-token composite calc
  (intrinsic — see §11), keep scale-direct + comment. The `gap` lines
  L50/L59/L68 → rebind `--gap`, read.
- L69 `padding: var(--size-2xs) var(--size-xs);` → rebind+read.
- L79 `padding-left: var(--size-lg);` → rebind+read.

#### `scss/config/mixins/_ln-table.scss`

- L114 `gap: var(--size-xs);` → rebind+read.
- L139 `padding: var(--size-xs) var(--size-sm);` → rebind+read.
- L195 `padding: var(--size-sm) var(--size-md);` → rebind+read.
- L225 `gap: var(--size-lg);` → rebind+read.
- L226 `padding: var(--size-sm) var(--size-md);` → rebind+read.
- L235 `gap: var(--size-xs-up);` → rebind+read.
- L253 `padding: var(--size-2xs) var(--size-sm);` → rebind+read.
- L283 `gap: var(--size-xs-up);` → rebind+read.
- L284 `padding: var(--size-xs-up) var(--size-md);` → rebind+read.
- L292 `gap: var(--size-xs);` → rebind+read.
- L293 `padding: var(--size-2xs) var(--size-sm);` → rebind+read.

#### `scss/config/mixins/_stat-card.scss`

- L11 `gap: var(--size-xs);` → rebind+read.
- L12 `padding: var(--size-lg) var(--size-lg);` → rebind+read.
- L42 `gap: var(--size-xs);` → rebind+read.

#### `scss/config/mixins/_avatar.scss`

- L38 `gap: var(--size-sm-up);` → rebind+read.
- L39 `padding: var(--size-xs-up) var(--size-xs-up);` → rebind+read.

#### `scss/config/mixins/_app-shell.scss`

- L87 `gap: var(--size-sm-up);` (`@mixin app-header-left`) → rebind+read.
- L106 `gap: var(--size-md);` (`@mixin app-header-right`) → rebind+read.
- L112 `gap: var(--size-sm);` (`@mixin app-header-actions`) → rebind+read.

#### `scss/config/mixins/_link.scss`

- L31 `padding: var(--size-xs) var(--size-sm-up);` → rebind+read.

#### `scss/config/mixins/_breadcrumbs.scss`

- L57 `padding: var(--size-2xs) var(--size-xs);` (`a`) → rebind+read.
- L66 `padding: var(--size-2xs) var(--size-xs);` (`[aria-current="page"]`)
  → rebind+read.

#### `scss/config/mixins/_accordion.scss`

- L39 `padding: var(--size-md) var(--size-md);` → rebind+read.
- L58 `padding: var(--size-sm-up) var(--size-md);` → rebind+read.

#### `scss/config/mixins/_tabs.scss`

- L36 `padding: var(--size-sm) var(--size-md);` → rebind+read.
- L59 `padding: var(--size-lg) var(--size-lg);` → rebind+read.

#### `scss/config/mixins/_prose.scss`

- L48 `padding-left: var(--size-md);` (blockquote) → rebind+read.
- L57 `padding-inline: var(--size-xs-up);` (code) → rebind+read.
- L58 `padding-block: var(--size-2xs);` (code) → rebind+read.
- L68 `padding: var(--size-md);` (pre) → rebind+read.
- L103 `padding: var(--size-sm) var(--size-sm-up);` (table th/td) → rebind+read.

#### `scss/config/mixins/_card.scss`

- L124 `padding-bottom: var(--size-sm);` (`@mixin section header`) → rebind+read.
- L269 `padding-block: var(--size-xs-up);` (`.field`) → rebind+read.

#### `scss/config/mixins/_empty-state.scss`

- L8 `gap: var(--size-md);` → rebind+read.
- L9 `padding: var(--size-xl) var(--size-xl);` → rebind+read.

#### `scss/config/mixins/_toast.scss`

- L75 `padding-top: var(--size-md);` (`@mixin toast-side`) → rebind+read.
- L87 `padding: var(--size-md) var(--size-md) var(--size-md) var(--size-sm);`
  (`@mixin toast-content`) → asymmetric pad. Resolve as: `--padding-y:
  var(--size-md); --padding-x: var(--size-md); padding: var(--padding-y)
  var(--padding-x) var(--padding-y) var(--size-sm);` — the
  bottom/right/top all = `--size-md` so `--padding-y/x` rebind covers
  three sides; the left arm stays scale-direct (asymmetric content
  inset, NOT shell rhythm — the 4th arm is component-design choice
  for icon-side gutter). Add comment on the `var(--size-sm)` arm.
- L105 `gap: var(--size-md);` (`@mixin toast-head`) → rebind+read.
- L128 `padding-left: var(--size-md-up);` (`@mixin toast-body ul`)
  → rebind+read.

#### `scss/config/mixins/_tooltip.scss`

- L12 `padding: var(--size-xs) var(--size-sm);` (`@mixin tooltip-bubble`)
  → rebind+read.
- L36/L61/L69/L78 `calc(100% +/- var(--size-xs-up))` → §2.5.1 rebind
  `--gap` then `calc(100% +/- var(--gap))`.

#### `scss/config/mixins/_dropdown.scss`

- L72 `padding: var(--size-xs) var(--size-sm);` (`@mixin menu-items
  a,button,...`) → rebind+read.
- L127 `padding-block: var(--size-xs);` → rebind+read.

#### `scss/config/mixins/_kbd.scss`

- L9 `padding: var(--size-2xs) var(--size-xs-up);` → rebind+read.

#### `scss/config/mixins/_sidebar.scss`

- L47 `padding-block: var(--size-sm-up);` (`> header`) → rebind+read.
- L85 `padding-block: var(--size-xs);` (`> main`) → rebind+read.

#### `scss/config/mixins/_page-header.scss`

- L17 `gap: var(--size-md);` → rebind+read.
- L18 `padding-bottom: var(--size-lg);` → rebind+read.
- L58 `gap: var(--size-sm);` (`> div:has(> button), > div:has(> a)`)
  → rebind+read.

#### `scss/config/mixins/_nav.scss`

- L67 `padding-block: var(--size-sm);` (`.nav-section`) → rebind+read.
- L153 `padding-inline: var(--size-md);` (`@mixin
  nav-links-border-left a`) → rebind+read.
- L209 `padding-inline: var(--size-md);` (`@mixin
  nav-links-border-grow a`) → rebind+read.

#### `scss/config/mixins/_form.scss`

- L62 `padding-top: var(--size-md);` (`@mixin form-actions`) → rebind+read.
- L87 `padding: var(--size-sm) var(--size-md);` (`@mixin form-input`)
  → rebind+read.
- L163 `padding: var(--size-xs) var(--size-sm);` (`@mixin
  form-input-icon-group`) → rebind+read.
- L219 `padding: var(--size-2xs) var(--size-2xs);` (`>
  [data-ln-search-clear]`) → rebind+read.
- L295 `padding: var(--size-sm) var(--size-md);` (`@mixin pill-outline`)
  → rebind+read.

#### `scss/config/mixins/_alert.scss`

- L29 `padding: var(--size-sm) var(--size-md);` → rebind+read.
- L77 `padding-inline: var(--size-lg);` (`@mixin alert-banner`) → rebind+read.

#### `scss/config/mixins/_upload.scss`

- L27 `padding: var(--size-lg) var(--size-lg);` (`@mixin upload-zone`)
  → rebind+read.
- L78 `padding: var(--size-sm) var(--size-md);` (`@mixin upload-item`)
  → rebind+read.

#### `scss/config/mixins/_chip.scss`

- L11 `gap: var(--size-xs);` → rebind+read.
- L12 `padding: var(--size-xs) var(--size-sm-up);` → rebind+read.

#### `scss/config/mixins/_data-table.scss`

- L36 `gap: var(--size-xs-up);` (search label) → rebind+read.
- L37 `padding: var(--size-xs) var(--size-sm-up);` → rebind+read.
- L95 `padding: var(--size-2xs) var(--size-2xs);` (sort-button) → rebind+read.
- L115 `padding: var(--size-2xs) var(--size-2xs);` (filter-button) → rebind+read.
- L153 `padding: var(--size-sm) var(--size-sm);` (filter-dropdown) → rebind+read.
- L169 `padding: var(--size-xs) 0;` (li) → `--padding-y: var(--size-xs);
  padding: var(--padding-y) 0;`.

### §10.2 Acceptance for Phase A1

After A1 executor run:
- `npm run build` passes.
- `grep -n "^\s*gap:\s*var(--size-" scss/config/mixins/` returns
  zero matches that are NOT the documented exceptions.
- `grep -n "^\s*padding[^:]*:\s*var(--size-" scss/config/mixins/`
  returns zero matches that are NOT the documented exceptions
  (multi-token calc in `_translations.scss:20`, asymmetric 4th-arm
  in `_toast.scss:87`).
- Visual sanity: open `demo/` index, dashboard, table, form pages —
  no rendering regression.

### §10.3 Phase A1 — Executor Prompt

```
## Executor Prompt — Phase A1

### Context

ln-acme has a token-discipline rule: mixin bodies in `scss/config/
mixins/` must read primitives (`--padding-x`, `--padding-y`, `--gap`,
`--radius`, etc.) — never `--size-*` scale tokens directly. Phase A1
fixes ~80 lines across ~25 mixin files where `padding`/
`padding-block`/`padding-inline`/`gap` is read with `var(--size-*)`
directly. The fix is mechanical: rebind the primitive on the same
selector scope, then read the primitive.

### Constraints

- Tab indentation throughout. Match surrounding indent.
- No new tokens introduced in Phase A1 — only existing primitives
  (`--padding-x`, `--padding-y`, `--gap`).
- Rebind line(s) sit IMMEDIATELY above the read line, at the same
  indent level, in the same selector block.
- Default-theme rendering MUST be byte-equivalent. Do not change
  any value — only the indirection path.
- Do NOT touch margin reads, positional offsets, geometric calcs,
  or `background-position`/`background-size` reads. Those are A2/A3.
- Do NOT touch `_btn.scss` (already correctly classified) or rebind
  lines in other files (already correct).

### Prerequisites — read first

- `CLAUDE.md` §"Token Surface — Primitives + Vocabulary",
  §"What NOT to do", §"Cascade rebind pattern".
- `scss/config/_tokens.scss` lines 273-385 (logical-token block).
- `.tmp/plan-size-direct-reads.md` §4 (substitution rule table)
  and §10 (this phase's file-by-file edit list).
- `scss/config/mixins/_btn.scss` (reference for the rebind+read
  pattern — see `@mixin btn-sm` lines 130-136 and `@mixin btn-lg`
  lines 138-145).

### Steps

1. For each file listed in §10.1 of the plan, apply the substitutions
   exactly as specified. Order: top-to-bottom by file. Inside each
   file, top-to-bottom by line number. Use the canonical
   substitutions in §4.

2. For each substitution:
   a. Read the existing line.
   b. Add a rebind line (or two for shorthand `padding`) immediately
      above, with same indent, of the form `--padding-y: var(--size-X);`
      or `--padding-x: var(--size-X);` or `--gap: var(--size-X);`.
   c. Replace the value side of the original line with the primitive
      read: `padding: var(--padding-y) var(--padding-x);` or
      `gap: var(--gap);` etc.

3. Special cases inside this phase:
   - `_toast.scss:87` `padding: var(--size-md) var(--size-md)
     var(--size-md) var(--size-sm);` — rebind `--padding-y: var(--size-md);
     --padding-x: var(--size-md);`, read as `padding: var(--padding-y)
     var(--padding-x) var(--padding-y) var(--size-sm);`. Add a comment
     on the same line: `// 4th arm: icon-side gutter, component-design
     intrinsic.`
   - `_tooltip.scss:36/61/69/78` — calc trigger-gap pattern. Rebind
     `--gap: var(--size-xs-up);` THEN write
     `bottom|top|right|left: calc(100% +/- var(--gap));`.
   - `_data-table.scss:169` `padding: var(--size-xs) 0;` — rebind
     `--padding-y: var(--size-xs);` only, write `padding:
     var(--padding-y) 0;`.

4. After ALL files are edited, run `npm run build`.

5. Run the §8.1 acceptance greps from the plan. Document any
   residual hits in your report — they must match either the
   carved-out cases (margin, positional, geometric, intrinsic
   decoration — A2/A3 territory) or the explicitly-allowed
   exceptions (`_translations.scss:20-23` multi-token calc,
   `_toast.scss:87` 4th-arm).

### Acceptance criteria

- Build passes with no new warnings.
- Spot-check 3 mixin files in dev tools (no DOM render available
  in this environment — verified by reading the produced
  `demo/dist/ln-acme.css`):
  - Search for `padding:1rem .75rem` (former `_btn-sm` pattern after
    `padding-block: var(--padding-y); padding-inline: var(--padding-x)`
    expansion) or equivalent.
- §8.1 greps return zero hits except documented exceptions.

### Boundaries — what NOT to touch

- `_btn.scss` (already correct).
- Rebind lines: any line of the form
  `--padding-x|y|--gap|--radius: var(--size-...);` is a CORRECT
  rebind — leave it alone.
- All margin reads (margin-block / margin-top / margin-bottom /
  margin / margin-inline-start / margin-left / margin-right /
  `@include mt(...)`) — Phase A2.
- Positional offsets (top / right / bottom / left) and geometric
  calcs — Phase A3.
- `background-position`, `background-size`, `height` (intrinsic) —
  Phase A3.
- SCSS arg defaults `($gap: var(--size-md))` — Phase A3.
- `scss/components/_loader.scss:5` — out of scope (consumer layer).
- CLAUDE.md edits — A2/A3 carry the docs work.

### Report back

- List of files modified, with line counts.
- `npm run build` output: PASS/FAIL.
- Acceptance grep results: counts + line cites for any residual
  matches.
- Any line you could not classify cleanly — defer to architect.
```

---

## §11. Phase A2 — `--margin-block` / `--margin-inline` primitives

Introduce two new soft tokens in `_tokens.scss` documentation block.
Apply rebind+read substitution to all margin reads. Update CLAUDE.md
sections.

### §11.1 `_tokens.scss` edit

Insert into `:root` block right after the `// -- Per-side borders
(SOFT — no default)` comment block (around line 386, before closing
`}`):

```scss
		// -- Margin (SOFT — no default) --------------------------------
		// --margin-block, --margin-inline
		//
		// Read by structural rhythm rules (label-to-input gap, section
		// margin, header→body separation, sibling stacking,
		// element-pushing horizontal offsets) with a per-mixin rebind.
		// NOT defined here — the value varies too widely across
		// consumers for a single :root default to be useful. Each
		// consumer rebinds locally:
		//
		//   @mixin section {
		//       --margin-block: var(--size-xl);
		//       margin-bottom: var(--margin-block);
		//   }
		//
		// Density-compact reacts automatically: density-compact rebinds
		// the underlying --size-* scale, and the consumer's
		// `--margin-block: var(--size-md)` re-resolves at the consumer
		// element under the compact scope.
		//
		// --margin-inline is the horizontal companion. Used for
		// element-pushing structural offsets (icon→text gap inside a
		// row, sibling element offsets). NOT for flex/grid sibling
		// spacing — that is --gap.
```

NO `:root` declaration of either token. Pure documentation.

### §11.2 File-by-file substitutions (margin reads)

Apply §4 row "margin-* / margin-inline-* / @include mt(...)" rule.

#### `scss/config/mixins/_table.scss`

- L89 `margin-bottom: var(--size-md);` (`@mixin table-responsive
  tbody tr`) → `--margin-block: var(--size-md); margin-bottom:
  var(--margin-block);`

#### `scss/config/mixins/_translations.scss`

- L51 `margin-left: auto;` — already `auto` literal, NOT a `--size-*`
  read. Leave it. (Listed in audit as "margin" because the awk first
  word matched; no actual size-* read.)

  (Verification: grep `var(--size-` returns no margin-left hit in
  _translations.scss. Skip this line.)

#### `scss/config/mixins/_ln-table.scss`

- L171 `margin-left: var(--size-xs);` → `--margin-inline: var(--size-xs);
  margin-left: var(--margin-inline);`
- L243 `margin-right: var(--size-sm);` → `--margin-inline:
  var(--size-sm); margin-right: var(--margin-inline);`
- L311 `margin-left: var(--size-2xs);` → rebind+read.
- L327 `margin-left: var(--size-xs);` → rebind+read.
- L343 `margin-bottom: var(--size-md);` → rebind `--margin-block`, read.
- L351 `margin: 0 0 var(--size-sm);` → rebind `--margin-block:
  var(--size-sm);`, read `margin: 0 0 var(--margin-block);`.
- L358 `margin: 0 0 var(--size-lg);` → rebind+read shorthand.

#### `scss/config/mixins/_timeline.scss`

- L50 `margin-bottom: var(--size-xs);` (`> time`) → rebind+read.
- L63 `margin: var(--size-xs) 0 0;` (`> p`) → rebind `--margin-block:
  var(--size-xs);`, read `margin: var(--margin-block) 0 0;`.

#### `scss/config/mixins/_stat-card.scss`

- L44 `margin: var(--size-xs) 0 0;` (`> [data-ln-stat-trend]`) →
  rebind+read shorthand.

#### `scss/config/mixins/_card.scss`

- L117 `margin-bottom: var(--size-xl);` (`@mixin section`) → rebind+read.
- L123 `margin-bottom: var(--size-md);` (`@mixin section header`) →
  rebind+read.
- L220 `margin-bottom: var(--size-md);` (`@mixin section-card`) →
  rebind+read.

#### `scss/config/mixins/_confirm.scss`

- L28 `margin-bottom: var(--size-sm);` → rebind+read.

#### `scss/config/mixins/_empty-state.scss`

- L24 `margin-top: var(--size-sm);` (`button, a`) → rebind+read.

#### `scss/config/mixins/_toast.scss`

- L43 `& + & { margin-bottom: var(--size-md); }` → rebind+read inside
  the `& + &` block.
- L119 `margin-top: var(--size-sm);` (`@mixin toast-body`) → rebind+read.
- L127 `margin: var(--size-sm) 0 0 0;` (toast-body ul) → rebind
  `--margin-block: var(--size-sm);`, read `margin: var(--margin-block)
  0 0 0;`.
- L133 `margin-top: var(--size-xs);` (toast-body li + li) → rebind+read.

#### `scss/config/mixins/_dropdown.scss`

- L113 `margin-block: var(--size-xs);` (separator hr) → rebind+read.
- L126 `margin-top: var(--size-xs);` (`@mixin dropdown-menu`) →
  rebind+read.

#### `scss/config/mixins/_sidebar.scss`

- L78 `@include mt(var(--size-xs));` (`> [data-ln-search]`) → rebind
  `--margin-block: var(--size-xs);`, then `@include
  mt(var(--margin-block));`.

#### `scss/config/mixins/_page-header.scss`

- L50 `margin: var(--size-xs) 0 0;` (`> div:has(> h1) p`) → rebind+read
  shorthand.

#### `scss/config/mixins/_nav.scss`

- L74 `margin-top: var(--size-md);` (`.nav-section`) → rebind+read.
- L80 `margin-block: var(--size-sm);` (`.nav-divider`) → rebind+read.
- L117 `margin-top: var(--size-2xs);` (`@mixin nav-links-rounded li
  + li`) → rebind+read.

#### `scss/config/mixins/_form.scss`

- L23 `margin-bottom: var(--size-xs);` (`@mixin form-label`) → rebind+read.
- L58 `margin-top: var(--size-lg);` (`@mixin form-actions`) → rebind+read.
- L418 `margin-top: var(--size-xs);` (`@mixin form-validate-errors`) →
  rebind+read.

#### `scss/config/mixins/_data-table.scss`

- L96 `margin-inline-start: var(--size-xs);` (sort-button) → rebind
  `--margin-inline`, read.
- L116 `margin-inline-start: var(--size-2xs);` (filter-button) → rebind+read.
- L161 `margin-bottom: var(--size-sm);` (filter-search) → rebind+read.
- L183 `margin-top: var(--size-sm);` (filter-clear) → rebind+read.

#### `scss/config/mixins/_upload.scss`

- L53 `margin-top: var(--size-xs);` (small) → rebind+read.
- L65 `margin-top: var(--size-sm);` (`@mixin upload-list`) → rebind+read.
- L82 `margin-bottom: var(--size-sm);` (`@mixin upload-item`) → rebind+read.
- L91 `margin-right: var(--size-sm);` (svg.ln-icon) → rebind
  `--margin-inline`, read.
- L98 `margin-left: var(--size-sm);` (close button) → rebind+read.
- L112 `margin-left: var(--size-md);` (`@mixin upload-size`) → rebind+read.
- L149 `margin-right: var(--size-sm);` (deleting-spinner) → rebind+read.

### §11.3 CLAUDE.md edits

In project `CLAUDE.md`:

#### Section: "The primitives (what mixin bodies read)"

After the "Structure and rhythm" bullets, add:

```
- `--margin-block`, `--margin-inline` — vertical / horizontal
  structural margin (soft — NO `:root` default). Read by mixins that
  set element-pushing margin (label-to-input gap, section margins,
  sibling stacking, in-component element offsets).
```

#### Section: "Per-side borders (SOFT — no default)"

After the per-side borders paragraph, append a new sub-paragraph:

```
**Margin primitives `--margin-block` and `--margin-inline` follow the
same SOFT pattern.** No `:root` default — value variation is too wide
across consumers. Each mixin rebinds locally:

	@mixin section {
		--margin-block: var(--size-xl);
		margin-bottom: var(--margin-block);
	}

Density-compact reacts via the underlying `--size-*` cascade — no
parallel rebind needed in `.density-compact`.
```

#### Section: "What NOT to do"

Append:

```
- Do not introduce a per-component-surface margin token
  (`--card-margin`, `--toast-margin`). Use the cross-cutting
  `--margin-block` / `--margin-inline` primitives instead.
```

### §11.4 Acceptance for Phase A2

- `npm run build` passes.
- `grep -n "^\s*margin[^:]*:\s*var(--size-" scss/config/mixins/`
  returns zero hits.
- `grep -n "@include m[lrtb]\?(\s*var(--size-" scss/config/mixins/`
  returns zero hits.
- `grep -n "\\-\\-margin-block\|\\-\\-margin-inline"
  scss/config/mixins/` returns ~30 + ~10 hits respectively.
- `_tokens.scss` documentation block present, no `:root` declaration
  of either margin token.
- CLAUDE.md sections updated.

### §11.5 Phase A2 — Executor Prompt

```
## Executor Prompt — Phase A2

### Context

ln-acme introduces two new soft primitives `--margin-block` and
`--margin-inline` to cover structural margin reads in mixin bodies.
Phase A1 already migrated padding/gap reads. Phase A2 adds margin
primitives + documentation, then migrates ~40 margin reads across
~17 mixin files.

### Constraints

- Tab indentation throughout.
- Soft-token pattern: NO `:root` declaration of either token.
  Documentation comment block only in `_tokens.scss`.
- Rebind line sits immediately above the read line, same indent,
  same selector block.
- Default-theme rendering MUST be byte-equivalent.
- Do not touch padding/gap reads (Phase A1 territory) or positional
  offsets / geometric calcs / SCSS arg defaults (Phase A3 territory).

### Prerequisites — read first

- `.tmp/plan-size-direct-reads.md` §2.3, §2.4, §3.1, §3.3, §11.
- `scss/config/_tokens.scss` — locate the soft-borders comment block
  around line 372-386. The new margin block goes right after it.
- `CLAUDE.md` §"The primitives (what mixin bodies read)",
  §"Per-side borders (SOFT — no default)", §"What NOT to do".
- One reference file: `scss/config/mixins/_btn.scss` for the
  rebind+read pattern.

### Steps

1. Edit `scss/config/_tokens.scss` per plan §11.1 — add the new
   `// -- Margin (SOFT — no default) --` documentation block right
   after the per-side-borders block. NO `:root` declarations.

2. Edit `CLAUDE.md` per plan §11.3 — three additions:
   a. Add `--margin-block` / `--margin-inline` bullet to
      "The primitives (what mixin bodies read)".
   b. Append the SOFT-pattern paragraph to "Per-side borders (SOFT
      — no default)".
   c. Append the "no per-component margin token" bullet to
      "What NOT to do".

3. For each file in plan §11.2, apply the substitutions:
   a. Read the line.
   b. Insert a rebind line immediately above: `--margin-block:
      var(--size-X);` (vertical) or `--margin-inline: var(--size-X);`
      (horizontal). Same indent.
   c. Replace the value side of the original with the primitive read.
   d. For shorthand margin (`margin: var(--size-X) 0 0;` or `margin:
      0 0 var(--size-X);`), rebind `--margin-block`, then replace
      ONLY the size-* arm with `var(--margin-block)`.
   e. For `@include mt(var(--size-X));`, rebind `--margin-block`,
      then replace with `@include mt(var(--margin-block));`.

4. Skip these (audit false positives — no actual `--size-*` read):
   - `_translations.scss:51 margin-left: auto;` — already `auto`,
     not a size-* read.

5. Run `npm run build`.

6. Run the §11.4 acceptance greps. Report counts.

### Acceptance criteria

- Build passes with no new warnings.
- `grep -n "^\s*margin[^:]*:\s*var(--size-" scss/config/mixins/`
  returns zero hits.
- `grep -n "@include m[lrtb]\?(\s*var(--size-" scss/config/mixins/`
  returns zero hits.
- `grep -c "\\-\\-margin-block:" scss/config/mixins/_*.scss` totals
  ~30 hits.
- `grep -c "\\-\\-margin-inline:" scss/config/mixins/_*.scss` totals
  ~10 hits.
- `_tokens.scss` has the comment block, no margin-* declarations
  inside `:root`.
- CLAUDE.md sections updated.

### Boundaries — what NOT to touch

- Padding/gap reads (Phase A1 done).
- Positional offsets, geometric calcs, intrinsic decoration reads
  — Phase A3.
- SCSS arg defaults — Phase A3.
- `scss/components/_loader.scss` — out of scope.
- `_btn.scss` — already correct.

### Report back

- Files modified, with line counts.
- `npm run build`: PASS/FAIL.
- Acceptance grep results: counts.
- Any line you could not classify cleanly — defer to architect.
```

---

## §12. Phase A3 — Documented exceptions + SCSS arg defaults + CLAUDE.md exceptions list

### §12.1 SCSS arg default replacements

#### `scss/config/mixins/_layout.scss`

- L48 `@mixin stack($gap: var(--size-md))` → `@mixin stack($gap:
  var(--gap))`
- L53 `@mixin row($gap: var(--size-sm))` → `@mixin row($gap:
  var(--gap))`
- L59 `@mixin row-between($gap: var(--size-sm))` → `@mixin
  row-between($gap: var(--gap))`
- L64 `@mixin row-center($gap: var(--size-sm))` → `@mixin
  row-center($gap: var(--gap))`

All current callers pass an explicit arg; the SCSS default arm never
fires today. No emitted-CSS change.

### §12.2 Documented exception comments

For each line in §2.5.3, §2.5.4, §2.6, §2.8 (geometric / viewport-edge
/ intrinsic decoration / track thickness / multi-token calc), add a
comment on the same line or the line above explaining the carve-out.

#### `scss/config/mixins/_translations.scss`

- L20-23: composite calc decoration math. Add comment block above:
  ```scss
  // Intrinsic flag-icon decoration math — pad-left + bg-pos + bg-size
  // composed against the icon's own dimensions, not shell rhythm.
  ```
- L77 `background-position: var(--size-xs) center;` — Add comment:
  `// Intrinsic flag-icon position, not shell rhythm.`
- L79 `padding-left: var(--size-lg);` — this is a real padding read
  but tied to the badge's intrinsic icon-on-left decoration. PLAN A1
  classifies as rebind+read (§10.1 last bullet). Verify executor A1
  handled it. No A3 work here.

#### `scss/config/mixins/_borders.scss`

- L23 `bottom: calc(-1 * var(--size-sm-up));` — add comment:
  `// Geometric — shadow-b decoration offset, not spacing rhythm.`
- L26 `height: var(--size-sm-up);` — add comment:
  `// Intrinsic shadow-decoration height, not spacing rhythm.`

#### `scss/config/mixins/_progress.scss`

- L21 `height: var(--size-xs);` — add comment:
  `// Intrinsic component dimension — track thickness.`

#### `scss/config/mixins/_table.scss`

- L113 `left: var(--size-md);` — add comment:
  `// Geometric — ::before label inset matches td padding-x.`
- L115 `width: calc(50% - var(--size-lg));` — add comment:
  `// Geometric — label width less the gutter to value column.`

#### `scss/config/mixins/_stepper.scss`

- L38 `top: var(--size-md);` — add comment:
  `// Geometric — connector vertical center matches bullet radius.`
- L39-40 `calc(50% +/- var(--size-md))` — add comment:
  `// Geometric — connector horizontal endpoints clear bullet edge.`

#### `scss/config/mixins/_timeline.scss`

- L16 `calc(var(--size-sm) - var(--border-width))` — add comment:
  `// Geometric — rail x-position aligned with bullet center.`
- L36 `calc((var(--lh-caption) * var(--text-caption) - var(--size-sm-up)) / 2)`
  — add comment:
  `// Geometric — bullet vertical alignment to caption baseline.`
- L37 `left: var(--size-2xs);` — add comment:
  `// Geometric — bullet x-position inside li padding.`

#### `scss/config/mixins/_toast.scss`

- L27-28 `right/bottom: var(--size-lg);` — add comment block above:
  ```scss
  // Viewport-edge offsets — toast container distance from viewport,
  // not shell rhythm.
  ```
- L94-95 `top/right: var(--size-sm);` — add comment block above:
  ```scss
  // Geometric — close button positioned inside content padding.
  ```

#### `scss/config/mixins/_sidebar.scss`

- L70-71 `top/right: var(--size-sm);` — add comment block above:
  ```scss
  // Geometric — close button positioned inside header padding.
  ```

### §12.3 CLAUDE.md "Exceptions (allowed literals)" expansion

In project `CLAUDE.md`, in the "Size Tokens — Single Source of Truth"
section, the existing exceptions list reads:

```
**Exceptions (allowed literals).**

- `0` as unitless zero (or use `var(--size-0)` for clarity).
- `1px` / `2px` borders go through `--border-width` /
  `--border-width-strong`.
- Intrinsic values: `100%`, `100vh`, `auto`, fractions (`1fr`, `50%`),
  `9999px` for full radius.
- Genuinely component-intrinsic dimensions — icon sizes, avatar sizes,
  toggle-switch geometry, stepper-node, timeline-bullet, modal
  max-widths, toast widths, popover/dropdown/tooltip min-/max-widths,
  loader width/height. These are component design, not spacing rhythm.
- Font sizes / line heights / letter spacing use their own scales
  (`--text-*`, `--lh-*`, `--tracking-*`).
```

Append:

```
- **`--size-*` direct reads in geometric component math.** When
  `--size-*` is the length input to a positional / dimensional
  calculation (connector-line endpoints, bullet alignment to a
  text baseline, ::before label width inside a flex cell, shadow
  decoration offsets), it is component-intrinsic geometry, not
  spacing rhythm. Each occurrence needs a code comment explaining
  the intent (`// Geometric — <intent>, not spacing rhythm.`).
- **`--size-*` direct reads in `background-position` /
  `background-size`** for intrinsic icon decoration. Component
  design, not rhythm. Comment required.
- **Viewport-edge offsets** (toast container `right` / `bottom`,
  similar shell-positioning use cases). Single use site each;
  no shell-edge primitive warranted. Comment required.
- **`--size-*` direct reads inside `width` / `height` `calc()`** that
  compute intrinsic component dimensions (track thickness,
  label-width inside a stacked cell). Component design, not
  rhythm. Comment required.
```

### §12.4 Acceptance for Phase A3

- `npm run build` passes.
- `grep -n "var(--size-md)\|var(--size-sm)" scss/config/mixins/_layout.scss`
  shows zero hits except the `--gap: var(--size-lg)` rebinds.
- Each remaining `var(--size-*)` hit in `scss/config/mixins/` is
  accompanied by a comment matching one of the carve-out templates
  (`Geometric — ...`, `Intrinsic ...`, `Viewport-edge ...`).
- CLAUDE.md exceptions list expanded.

### §12.5 Phase A3 — Executor Prompt

```
## Executor Prompt — Phase A3

### Context

ln-acme finalizes Phase A by formalizing the exception class for
genuinely intrinsic `--size-*` reads (geometric calcs, viewport-edge
offsets, intrinsic icon decoration, track thickness) and replacing
SCSS function arg defaults that emit scale tokens. Adds carve-out
documentation to CLAUDE.md.

This phase is mostly comment additions + 4 SCSS arg-default edits.
No emitted-CSS change.

### Constraints

- Tab indentation throughout.
- Comment placement: same line OR immediately above the line being
  carved out, at the same indent. Pick whichever is more readable
  per case.
- Comment text follows the templates: `// Geometric — <intent>, not
  spacing rhythm.`, `// Intrinsic <intent>, not spacing rhythm.`,
  `// Viewport-edge offset, not shell rhythm.`
- SCSS arg-default change must be byte-equivalent at runtime
  (verified by greps showing all callers pass an explicit arg).

### Prerequisites — read first

- `.tmp/plan-size-direct-reads.md` §2.5, §2.6, §2.7, §2.8, §3.3.3,
  §12.
- `CLAUDE.md` §"Size Tokens — Single Source of Truth" §"Exceptions
  (allowed literals)".

### Steps

1. SCSS arg defaults (§12.1):
   a. Open `scss/config/mixins/_layout.scss`.
   b. L48 — change `@mixin stack($gap: var(--size-md))` to
      `@mixin stack($gap: var(--gap))`.
   c. L53 — change `@mixin row($gap: var(--size-sm))` to
      `@mixin row($gap: var(--gap))`.
   d. L59 — change `@mixin row-between($gap: var(--size-sm))` to
      `@mixin row-between($gap: var(--gap))`.
   e. L64 — change `@mixin row-center($gap: var(--size-sm))` to
      `@mixin row-center($gap: var(--gap))`.

2. Comment additions per §12.2. Files in order:
   `_translations.scss`, `_borders.scss`, `_progress.scss`,
   `_table.scss`, `_stepper.scss`, `_timeline.scss`, `_toast.scss`,
   `_sidebar.scss`.

3. CLAUDE.md exceptions list expansion per §12.3 — append four
   new exception bullets after the existing "component-intrinsic
   dimensions" bullet.

4. Run `npm run build`.

5. Run §12.4 acceptance greps. Report counts.

### Acceptance criteria

- Build passes with no new warnings.
- `grep -rn "var(--size-md)" scss/config/mixins/_layout.scss`
  returns zero hits (compared to four hits before — three `--gap`
  rebinds in `grid`/`grid-2`/`grid-4` retain `var(--size-lg)`,
  not `var(--size-md)`).
- Every remaining `var(--size-*)` line in `scss/config/mixins/`
  has a nearby comment matching one of the carve-out templates.
- CLAUDE.md exceptions list expanded.

### Boundaries — what NOT to touch

- Phase A1/A2 territory (already done): padding, gap, margin reads.
- The 26 documented rebind lines (correct as-is).
- `scss/components/_loader.scss` — out of scope.

### Report back

- Files modified.
- `npm run build`: PASS/FAIL.
- Acceptance grep results: counts.
- Final residual count: total `var(--size-*)` hits in
  `scss/config/mixins/` after this phase.
```

---

## §13. Surprises encountered during audit

1. **Author already commented intent on most violations.** Lines like
   "Structural margin (not shell rhythm; no logical token)" appear
   in `_form.scss`, `_card.scss`, `_translations.scss`. The plan
   formalizes the missing primitive (margin) and the missing
   exception class (geometric), turning informal author notes into
   architecturally-supported policy.

2. **`_translations.scss:23` is a multi-token calc decoration** —
   `background-position: var(--size-sm-up) calc(var(--size-sm) +
   (var(--size-lg) - var(--size-md-up) * 3 / 4) / 2)`. Rebinding
   each scale read into a primitive would explode the line length and
   obscure intent. Carve-out class (intrinsic decoration math) is the
   right call.

3. **`_layout.scss` SCSS arg defaults emit `--size-*` even when not
   called with arg.** All current callers pass arg, so today this is
   inert — but the default is a future bug. Fixed.

4. **Audit pre-population was 152 lines; my count is 151.** Within
   noise — different greps catch slightly different lines (e.g.
   comment lines mentioning `var(--size-*)` are match-but-not-
   violation). Final number is 151 mixin-body direct reads.

5. **`_translations.scss:51 margin-left: auto;`** appears in
   property-prefix audit but is NOT a `--size-*` read (it's `auto`).
   Audit script over-counted by one in the `margin-left` bin.
   Skipped in Phase A2.

6. **`_toast.scss:87` asymmetric padding shorthand** —
   `padding: var(--size-md) var(--size-md) var(--size-md) var(--size-sm)`
   is 3-of-4 sides equal + 1 side asymmetric (icon-side gutter).
   Cannot rebind cleanly to `--padding-x/y` alone. Hybrid:
   rebind `--padding-y` and `--padding-x` for three sides, leave the
   4th arm scale-direct with a comment.

7. **Stepper / timeline geometric math reads `--size-*` as a
   component-design length, not a rhythm.** Already covered by
   CLAUDE.md "stepper-node" / "timeline-bullet" intrinsic dimension
   exception, but the carve-out applies to property classes
   (top/left/calc) the existing list didn't enumerate. Phase A3
   makes this explicit.
