# Plan — Phase B: `--color-primary*` reads in mixin bodies → `--color-accent*`

CLAUDE.md "Token Surface — Primitives + Vocabulary / What NOT to do":

> Do not read `--color-primary*` inside a mixin body. Read
> `--color-accent`, `--color-accent-hover`, `--color-accent-fg`, or
> `--color-accent-tint*` instead.

This plan re-audits every `--color-primary*` read in mixin bodies and in
co-located JS SCSS, classifies each as B1/B2/B3, and ships the B1+B2
fixes. B3 (alpha-composable accent tokens) is documented and deferred.

The Phase C fix at `_nav.scss:123` already landed (was
`hsl(var(--color-primary-lighter))`, now `var(--color-accent-tint)`).

---

## §1. Re-audit — full finding list

Source: `grep -rn "color-primary" scss/config/mixins/ js/` plus inspection
of each mixin's surrounding context. Doc-only comments (`// .alert.success
{ --color-primary: var(--color-error); }`) are excluded — they describe
the consumer-cascade contract, not a value read.

### §1.1 Findings — solid reads (B1 candidates)

| File | Line | Current | Surrounding context |
| --- | --- | --- | --- |
| `scss/config/mixins/_ajax.scss` | 32 | `border: 2px solid hsl(var(--color-primary));` | `@mixin ajax-spinner` border color |

### §1.2 Findings — named-lightness scale reads (B2 candidates)

| File | Line | Current | Surrounding context |
| --- | --- | --- | --- |
| `js/ln-data-table/ln-data-table.scss` | 4 | `background: hsl(var(--color-primary-lighter));` | `.ln-row-selected` |
| `js/ln-data-table/ln-data-table.scss` | 8 | `outline: 2px solid hsl(var(--color-primary-focus));` | `.ln-row-focused` |

### §1.3 Findings — alpha-tint reads (B3 — deferred)

These all share the shape `hsl(var(--color-primary) / X)` where `X` is
a literal alpha. Mixin body composes alpha against the raw triplet; the
solid `--color-accent` (= `hsl(var(--color-primary))`) cannot be reused
because it has already collapsed the triplet into a complete `hsl(...)`
value.

| File | Line | Current |
| --- | --- | --- |
| `scss/config/mixins/_tabs.scss` | 47 | `background-color: hsl(var(--color-primary) / 0.05);` |
| `scss/config/mixins/_tabs.scss` | 48 | `border-bottom-color: hsl(var(--color-primary) / 0.3);` |
| `scss/config/mixins/_avatar.scss` | 71 | `background-color: hsl(var(--color-primary) / 0.15);` |
| `scss/config/mixins/_status-badge.scss` | 52 | `background: hsl(var(--color-primary) / 0.2);` (button hover) |
| `scss/config/mixins/_status-badge.scss` | 56 | `background: hsl(var(--color-primary) / 0.28);` (button active) |
| `scss/config/mixins/_status-badge.scss` | 70 | `box-shadow: 0 0 0 0 hsl(var(--color-primary) / 0.7);` (pulse keyframe) |
| `scss/config/mixins/_status-badge.scss` | 74 | `box-shadow: 0 0 0 0.6em hsl(var(--color-primary) / 0);` (pulse keyframe) |
| `scss/config/mixins/_ln-table.scss` | 155 | `background-color: hsl(var(--color-primary) / 0.1);` (active filter btn) |
| `scss/config/mixins/_ln-table.scss` | 270 | `background-color: hsl(var(--color-primary) / 0.1);` (active quick filter pill) |
| `scss/config/mixins/_ln-table.scss` | 286 | `background-color: hsl(var(--color-primary) / 0.03);` (filter chip bar bg) |
| `scss/config/mixins/_data-table.scss` | 63 | `box-shadow: 0 0 0 3px hsl(var(--color-primary) / 0.1);` (search focus halo) |
| `scss/config/mixins/_stepper.scss` | 70 | `box-shadow: 0 0 0 4px hsl(var(--color-primary) / 0.2);` (current step ring) |
| `scss/config/mixins/_card.scss` | 153 | `background-color: hsl(var(--color-primary) / 0.04);` (accent-card hover) |
| `scss/config/mixins/_card.scss` | 185 | `background-color: hsl(var(--color-primary) / 0.06);` (`@mixin card-bg`) |
| `scss/config/mixins/_card.scss` | 186 | `border-color: hsl(var(--color-primary) / 0.15);` (`@mixin card-bg`) |
| `scss/config/mixins/_alert.scss` | 76 | `border-bottom: var(--border-width) solid hsl(var(--color-primary) / 0.2);` (`@mixin alert-banner`) |
| `scss/config/mixins/_nav.scss` | 130 | `background-color: hsl(var(--color-primary) / 0.07);` (rounded-pill hover) |
| `scss/config/mixins/_nav.scss` | 158 | `box-shadow: inset 2px 0 0 hsl(var(--color-primary) / 0.3);` (border-left hover) |
| `scss/config/mixins/_nav.scss` | 159 | `background-color: hsl(var(--color-primary) / 0.04);` (border-left hover) |
| `scss/config/mixins/_nav.scss` | 164 | `background-color: hsl(var(--color-primary) / 0.07);` (border-left active) |
| `scss/config/mixins/_nav.scss` | 214 | `background-color: hsl(var(--color-primary) / 0.04);` (border-grow hover) |
| `scss/config/mixins/_nav.scss` | 218 | `background-color: hsl(var(--color-primary) / 0.07);` (border-grow active) |
| `scss/config/mixins/_colors.scss` | 14 | `background-color: hsl(var(--color-primary) / #{$opacity});` (`@mixin tinted-surface`) |
| `scss/config/mixins/_focus.scss` | 22-23 | `0 0 0 4px hsl($color / 0.6), 0 0 0 6px hsl($color / 0.15)` (focus-ring default `$color: var(--color-primary)`) |
| `scss/config/mixins/_focus.scss` | 37 | `box-shadow: 0 0 0 $width hsl($color / 0.12);` (focus-combination — same default) |
| `scss/config/mixins/_focus.scss` | 42 | `background-color: hsl($color / 0.04);` (focus-background-shift — same default) |
| `scss/config/mixins/_focus.scss` | 54 | `box-shadow: inset 0 0 0 $width hsl($color / 0.15);` (focus-inset-shadow — same default) |

### §1.4 Findings — solid reads inside `_focus.scss` (B1-shaped within B3 context)

| File | Line | Current |
| --- | --- | --- |
| `scss/config/mixins/_focus.scss` | 29 | `outline: 2px solid hsl($color);` (focus-border-thicken default) |
| `scss/config/mixins/_focus.scss` | 36 | `border-color: hsl($color);` (focus-combination default) |
| `scss/config/mixins/_focus.scss` | 48 | `border-bottom-color: hsl($color);` (focus-accent-line default) |

These are NOT direct `--color-primary` reads — they read a Sass param
`$color` whose default is `var(--color-primary)`. Treated as part of the
focus-ring special-case in §6 below.

### §1.5 Findings — by-design semantic-cascade reads (NOT violations)

These mixins read `--color-primary` BY DESIGN as the foundation of the
status-color cascade. Documented and excluded from this phase:

| File | Line | Why excluded |
| --- | --- | --- |
| `scss/config/mixins/_colors.scss` | 14-15 | `@mixin tinted-surface` — IS the canonical alpha-tint primitive. Every alert/badge/chip relies on it. Replacing with a vocabulary read would break `.success/.error/.warning/.info` (semantic-color rebinds `--color-primary` family at consumer scope; `tinted-surface` reads the rebound triplet to alpha-compose). |
| `scss/config/mixins/_colors.scss` | 25-29 | `@mixin semantic-color` — DEFINES the cascade. Rebinds the family on consumer; not a read. |
| `scss/config/mixins/_btn.scss` | 112-113 | `@mixin btn` — re-declares `--color-accent` from `--color-primary` at consumer scope. Documented in `_btn.scss` header L33-46 as the explicit cascade-preserving rebind. |
| `scss/config/_tokens.scss` | 175-177 | `--shadow-primary` etc. — token definitions at `:root`, not mixin reads. |
| `scss/config/_tokens.scss` | 316-320 | `--color-accent*` definitions — token definitions, not reads. |

**Why `tinted-surface` is canonical B3 and not fixable in scope:** the
`.success/.error/.warning/.info` semantic cascade works via
`@mixin semantic-color($family)` rebinding the entire `--color-primary*`
family on the consumer element. `tinted-surface` then alpha-composes
against the rebound triplet via `hsl(var(--color-primary) / X)`. To
replace this with `--color-accent`, we would need a new alpha-composable
accent triplet token (e.g. `--color-accent-raw: 216 95% 42%`) AND have
`semantic-color` rebind that token too. That is the B3 design problem.

### §1.6 Final tally

| Category | Count | Disposition |
| --- | --- | --- |
| B1 — solid `--color-primary` read | 1 | Fix in this plan |
| B2 — named-lightness read | 2 | Fix in this plan |
| B3 — alpha-tint read | ~26 | Deferred — see §5 |
| Focus-ring family ($color param defaulting to `--color-primary`) | 6 mixins, 7 lines | Special case — see §6 |
| By-design (excluded from rule) | 3 sites | No action |

---

## §2. Classification — table form (consolidated)

Total findings: **3 fixable now (B1+B2)**, **~26 deferred (B3)**, **6 mixins in the focus family** (special case).

| File:Line | Snippet | Class | Action |
| --- | --- | --- | --- |
| `_ajax.scss:32` | `border: 2px solid hsl(var(--color-primary));` | **B1** | → `var(--color-accent)` |
| `js/ln-data-table/ln-data-table.scss:4` | `background: hsl(var(--color-primary-lighter));` | **B2** | → `var(--color-accent-tint)` |
| `js/ln-data-table/ln-data-table.scss:8` | `outline: 2px solid hsl(var(--color-primary-focus));` | **B2'** | No vocabulary slot — see §3.2 |
| `_focus.scss:19-54` (6 mixins) | `$color: var(--color-primary)` default param | Special | See §6 |
| 26 lines across nav/card/alert/tabs/avatar/badge/ln-table/data-table/stepper | `hsl(var(--color-primary) / X)` | **B3** | Defer §5 |

---

## §3. B1 + B2 implementation plan

### §3.1 B1 — `_ajax.scss:32`

**File:** `/home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss`

**Change:**

```scss
// Before (L32)
border: 2px solid hsl(var(--color-primary));

// After
border: 2px solid var(--color-accent);
```

**Default-theme equivalence:** `--color-accent` at `:root`
(`_tokens.scss:316`) = `hsl(var(--color-primary))`. Substitution is
byte-equal at default theme. Under any consumer that overrides
`--color-primary` (e.g. status classes), the `var(--color-accent)`
rebound by `semantic-color` cascade through too — actually IMPROVES the
mixin because `--color-accent` is the documented vocabulary.

Wait — `semantic-color` rebinds `--color-primary*` but not
`--color-accent` directly. Let me trace: at consumer with `.success`
class, `semantic-color` sets `--color-primary: var(--color-success)`. At
the same element, `--color-accent` at `:root` is
`hsl(var(--color-primary))` — but `--color-accent` was DECLARED at
`:root`, not re-resolved at consumer. CSS variables resolve at the
DECLARATION site for nested `var()`, so `--color-accent` is frozen at
`:root` to `hsl(var(--color-primary))` evaluated AT `:ROOT`'s
`--color-primary`.

**Hold on — verify.** `--color-accent: hsl(var(--color-primary))` at
`:root`. When read at a `.success` consumer that overrides
`--color-primary`, what does `--color-accent` resolve to?

The CSS Custom Properties spec: `var()` inside a custom-property value
is resolved at the **using site** (where the custom property is
referenced for a real CSS property), NOT at the declaration site. So
when `border: 2px solid var(--color-accent)` is declared at the
spinner element, the engine substitutes `--color-accent` →
`hsl(var(--color-primary))`, then resolves `var(--color-primary)`
against the current cascade — which includes `.success`'s rebind. So
`--color-accent` cascades correctly for status-class overrides.

(This is exactly the cascade the `_btn.scss` header rationalizes — and
why `@mixin btn` re-declares `--color-accent` at consumer scope: not
because `--color-accent` is broken at `:root`, but to ensure the
cascade chain `--color-primary` → `--color-accent` → `--btn-bg` all
resolves at the consumer when a status class is also at consumer. For
`ajax-spinner`, no intermediate token surface exists, so just reading
`--color-accent` directly is fine.)

**Verdict:** byte-equal at default theme; cascade preserved for status
overrides.

### §3.2 B2 — `js/ln-data-table/ln-data-table.scss`

**File:** `/home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss`

**Scope decision (per audit prompt §7):** fix in place now. The Phase E
audit (extract co-located visual styling to mixin + component) is a
larger migration; cleaning up these two token reads now is one trivial
extra line during E if E ever re-touches the file. Defer-and-merge is
not safe: if E doesn't happen for a while, this file ships violating
the rule. Fix now.

**Change L4:**

```scss
// Before
.ln-row-selected {
	background: hsl(var(--color-primary-lighter));
}

// After
.ln-row-selected {
	background: var(--color-accent-tint);
}
```

`--color-accent-tint` at `:root` = `hsl(var(--color-primary-lighter))`
— byte-equal at default theme. Themes that rebind
`--color-primary-lighter` (Sport, Politika, Glass) automatically flow
through.

**Change L8 — needs vocabulary verdict.** `--color-primary-focus` has
**NO existing accent vocabulary slot**. Two options:

**Option A — add `--color-accent-focus` vocabulary token.** Parallel
to `--color-accent-tint` / `--color-accent-tint-strong`.

```scss
// Add to _tokens.scss after L320
--color-accent-focus: hsl(var(--color-primary-focus));
```

Then:

```scss
.ln-row-focused {
	outline: 2px solid var(--color-accent-focus);
}
```

**Option B — reuse `--color-accent` for the row-focus outline.**
Pragmatic: `--color-primary-focus` is a slightly brighter primary used
for focus halos. Visually, an accent outline (solid `--color-accent`)
on a row focus is functionally equivalent for "this row has keyboard
focus" — most products use the brand color directly. Lightness step
(brighter focus shade) is a subtle UX nuance that's rarely noticeable
on a 2px outline.

**Pick: Option A.** Reasons:

1. Faithful to the existing visual — focus tokens are intentionally
   brighter (50% lightness vs 42% for `--color-primary`) to read on
   bright surfaces.
2. The `--color-primary-focus` family is already rebound across all
   themes (default, dark, glass) in `_theme.scss` and `_tokens.scss`,
   confirming it's a real vocabulary value, not a stray.
3. Symmetric with `-tint` and `-tint-strong` — completes the accent
   vocabulary surface (`--color-accent-focus`, `--color-accent-tint`,
   `--color-accent-tint-strong`).
4. Cheap to add; future-proof for any focus-color reads in mixins.

**Vocabulary addition — `_tokens.scss` after L320 (in the `-- Accent`
block, immediately after `--color-accent-tint-strong`):**

```scss
--color-accent-focus:        hsl(var(--color-primary-focus));
```

**Default-theme equivalence:** `hsl(var(--color-primary-focus))` is
exactly what L8 currently writes. Byte-equal.

**Theme parity — verification.** Check whether other themes rebind
`--color-primary-focus`:

- Default `_tokens.scss:25` — `216 95% 50%`
- Glass `_theme.scss:147` — `218 95% 70%` (rebound)
- Sport, Politika, Sunset (theme.scss L121-138) — NOT rebound for
  `-focus` specifically; default cascades through
- Dark (theme.scss) — let me check if `-focus` is rebound

Need to confirm. Let me note this as **§3.2.1 follow-up: confirm
`--color-primary-focus` rebinds in all theme blocks**. If any theme
omits the `-focus` rebind, the `--color-accent-focus` vocabulary
inherits the default `:root` value at that theme — which is the SAME
behavior as the current direct read, so still byte-equal. No bug
introduced; just noting that the vocabulary surface honestly reflects
existing theme coverage.

### §3.3 Files modified — summary

1. `/home/ashlar/ln-ashlar/scss/config/_tokens.scss` — add 1 line:
   `--color-accent-focus`.
2. `/home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss` — change L32.
3. `/home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss` —
   change L4 and L8.

Three files, four edited lines plus one inserted line.

---

## §4. Default-theme equivalence reasoning — full trace

| Edit | Before | After (resolved at default theme) | Equivalence |
| --- | --- | --- | --- |
| `_ajax.scss:32` | `hsl(var(--color-primary))` = `hsl(216 95% 42%)` | `var(--color-accent)` = `hsl(var(--color-primary))` = `hsl(216 95% 42%)` | byte-equal |
| `ln-data-table.scss:4` | `hsl(var(--color-primary-lighter))` = `hsl(216 95% 97%)` | `var(--color-accent-tint)` = `hsl(var(--color-primary-lighter))` = `hsl(216 95% 97%)` | byte-equal |
| `ln-data-table.scss:8` | `hsl(var(--color-primary-focus))` = `hsl(216 95% 50%)` | `var(--color-accent-focus)` = `hsl(var(--color-primary-focus))` = `hsl(216 95% 50%)` | byte-equal |

Theme parity: all three accent tokens are wired through their respective
`--color-primary*` ancestors. Theme rebinds at `--color-primary*`
cascade through automatically.

---

## §5. B3 deferred list — alpha-composable accent token system

### §5.1 The pattern that needs solving

Every B3 finding has the shape `hsl(var(--color-primary) / X)` where
`X` is a literal alpha (0.03 to 0.7). Mixin body composes alpha against
the **raw HSL triplet** stored in `--color-primary` (a bare
`216 95% 42%` value). The vocabulary token `--color-accent` is already
collapsed into `hsl(...)`, so it cannot be reused inside another
`hsl(... / X)` expression cleanly.

Example — what does NOT work:

```scss
// We have:
//   --color-primary: 216 95% 42%;        (raw triplet)
//   --color-accent:  hsl(var(--color-primary));   (collapsed)

// This is what mixins currently do — reads the raw triplet:
background: hsl(var(--color-primary) / 0.07);

// Naive substitution — INVALID CSS:
background: hsl(var(--color-accent) / 0.07);
//             ^^^ var(--color-accent) is `hsl(216 95% 42%)`, not a triplet.
//                 Result: `hsl(hsl(216 95% 42%) / 0.07)` — nonsense.
```

### §5.2 Conceptual fixes

Three viable directions, all are NEW design:

**Path 1 — Sister "raw" accent token.** Add a new token holding the
raw triplet for accent.

```scss
:root {
	--color-accent-raw: var(--color-primary);  // raw triplet, mirror of --color-primary
	--color-accent: hsl(var(--color-accent-raw));
}
```

Then mixins read `hsl(var(--color-accent-raw) / 0.07)`. `semantic-color`
must also rebind `--color-accent-raw` per status family:

```scss
@mixin semantic-color($family) {
	--color-primary:         var(--color-#{$family});
	// ... existing
	--color-accent-raw:      var(--color-#{$family});  // new
}
```

Cleanest separation, but adds a parallel raw-triplet surface to every
status family.

**Path 2 — `color-mix(in srgb, var(--color-accent) X%, transparent)`.**
Use `color-mix()` for alpha composition. CSS spec.

```scss
background: color-mix(in srgb, var(--color-accent) 7%, transparent);
```

Pros: no new tokens; works on any color value (incl. `hsl(...)`).
Already used in `_ajax.scss:23` for the loading overlay — established
codebase pattern.

Cons: browser support — `color-mix()` is Baseline (widely supported)
but slightly newer than `hsl()`. Mixing percentages don't map 1:1 to
alpha — `color-mix(... 7%, transparent)` ≈ `hsl(... / 0.07)` to ~1
percent precision.

**Path 3 — Per-tint accent vocabulary tokens.** Add named alpha-tint
slots:

```scss
--color-accent-tint-3:    hsl(var(--color-primary) / 0.03);
--color-accent-tint-4:    hsl(var(--color-primary) / 0.04);
// ... 0.07, 0.1, 0.15, 0.2, 0.28, 0.3, 0.6, 0.7, etc.
```

Pros: vocabulary-driven, clear intent at consumer.

Cons: combinatorial explosion. The current B3 set uses 11 distinct
alpha values (0.03 / 0.04 / 0.05 / 0.06 / 0.07 / 0.1 / 0.12 / 0.15 /
0.2 / 0.28 / 0.3 / 0.6 / 0.7). 11 tokens just for accent alpha is
heavy; would also need to cascade through `semantic-color`.

### §5.3 Recommendation for the B3 phase

**Path 2 (`color-mix`) is the most likely winner.** The codebase
already establishes this pattern in `_ajax.scss:23`. It's vocabulary-
free, branchless on themes (cascades through `--color-accent`),
naturally extends to any new alpha. The only risk is cross-browser
parity for the precision of percentage→alpha conversion.

A B3 phase plan should: (a) prototype `color-mix` substitution in 2-3
mixins, (b) visually compare against current rendering at parity
zoom in 4 themes, (c) decide if precision drift is acceptable, (d) if
yes — bulk-replace; if no — fall back to Path 1 (raw token + semantic-
color rebind).

### §5.4 Why B3 cannot ride this plan

- It touches ≥26 lines across ≥9 files.
- It requires either a token-system addition (Path 1 or 3) or a
  rendering-equivalence verdict (Path 2) — both are architectural
  decisions, not mechanical substitutions.
- The semantic-color cascade through `tinted-surface` (the canonical
  alpha-tint mixin) is a load-bearing call site that must be solved
  consistently with whatever direction is chosen — it can't be fixed
  in one mixin and skipped in another without breaking the
  `.success/.error/.warning/.info` cascade.

B3 needs its own design pass, prototype, and visual diff. **Out of
scope for Phase B.**

---

## §6. `focus-ring` mixin family — special case

`_focus.scss` defines six mixins, each taking a Sass param `$color`
with default value `var(--color-primary)`:

```scss
@mixin focus-ring($color: var(--color-primary)) {
	box-shadow:
		0 0 0 2px var(--color-bg),
		0 0 0 4px hsl($color / 0.6),
		0 0 0 6px hsl($color / 0.15);
}
```

### §6.1 What "$color" actually is

`$color` is a **Sass variable**, evaluated at compile time to literal
text `var(--color-primary)`. The compiled output is:

```css
box-shadow:
	0 0 0 2px var(--color-bg),
	0 0 0 4px hsl(var(--color-primary) / 0.6),
	0 0 0 6px hsl(var(--color-primary) / 0.15);
```

So at runtime, the focus-ring reads `--color-primary` directly. Two
distinct violations stacked:

1. **B1-shaped** — `outline: 2px solid hsl($color);` in
   `focus-border-thicken` resolves to
   `outline: 2px solid hsl(var(--color-primary));` — solid read.
2. **B3-shaped** — every other focus mixin uses `hsl($color / 0.X)` —
   alpha read.

### §6.2 Default-param shape — does the mixin signature need changing?

The default `$color: var(--color-primary)` looks like a single concern
but is actually two:

- **At call sites where caller passes nothing**: compiler emits
  literal `var(--color-primary)`. Behavior identical to a mixin body
  reading `--color-primary` directly. Same B1/B3 violation.
- **At call sites where caller overrides** (e.g.
  `@include focus-ring(var(--color-error))`): the override flows into
  `$color`. No B1/B3 issue at THAT call site — it's the caller's
  responsibility to pass an appropriate value.

So the violation lives in the DEFAULT param value, not the param
shape itself. Fix: change the default.

### §6.3 The compound problem

The default also makes the param's TYPE ambiguous. Consider:

- `focus-border-thicken($color)` does `outline: ... solid hsl($color)`
  — expects `$color` to be an HSL **TRIPLET** (`216 95% 42%`).
- `focus-ring($color)` does `hsl($color / 0.6)` — also expects an HSL
  **TRIPLET** (so it can compose alpha).

The default `var(--color-primary)` IS a triplet. But if a caller wants
to use `--color-accent` (a collapsed `hsl(...)`) instead, it BREAKS
both:

- `outline: ... solid hsl(hsl(...))` — invalid
- `hsl(hsl(...) / 0.6)` — invalid

The mixin's param is fundamentally a triplet-typed param. So fixing
the default to `var(--color-accent)` (a collapsed value) would BREAK
the alpha composition.

### §6.4 Three viable paths for `_focus.scss`

**Path α — defer entire focus family to B3.** Acknowledge that the
focus mixins compose alpha against the raw triplet, same as B3
elsewhere. Fix as part of the B3 phase. Mark
`_focus.scss:19,28,35,41,47,53` as B3-deferred.

**Path β — split solid vs alpha defaults.** Two of the six mixins
(`focus-border-thicken`, `focus-accent-line`) only do solid reads
(`hsl($color)`). Could change those defaults to `var(--color-primary)`
→ a collapsed value isn't possible (param is still triplet-typed by
the alpha mixins sharing the param name). The signature can't be
inverted without rewriting all callers.

Even the solid uses (`hsl($color)` where `$color = var(--color-primary)`
— compiles to `hsl(var(--color-primary))`) are the SAME alpha-shape
problem in disguise: the `hsl()` wrapper on a triplet is exactly what
`--color-accent` resolves to. We could rewrite those four lines to
`var(--color-accent)` directly — bypassing `$color` for the default
case. But then the param semantics become inconsistent (overrides go
through the alpha path, defaults bypass it).

**Path γ — refactor the focus family in B3.** When B3 introduces
either Path 1 (raw accent token) or Path 2 (`color-mix`), refactor
all six focus mixins together. With Path 1, default becomes
`$color: var(--color-accent-raw)` — clean. With Path 2, `$color`
param goes away entirely, replaced by `color-mix(in srgb,
var(--color-accent) X%, ...)`.

### §6.5 Recommendation

**Path α — defer the entire focus-ring family to B3.** Reasons:

1. The family is internally consistent (one param shape, six mixins).
   Splitting partial fixes across two phases would leave `$color`
   meaning different things in different mixins — confusing.
2. Five of the six lines are alpha-shape (`hsl($color / X)`), so
   fixing requires the same alpha-token system as the rest of B3.
3. The one B1-shaped line (`focus-border-thicken` L29) IS technically
   fixable independently, but at the cost of breaking the param
   convention for the family. Not worth it.
4. The fix in B3 will be either trivial (Path 1: change the default
   to `var(--color-accent-raw)` everywhere — 6 lines) or a rewrite
   (Path 2: replace `$color` param with `color-mix()` wherever alpha
   is composed — modest but surgical).

**Verdict:** add the focus family to the B3 deferred list with a note
that the default-param resolution flows from whatever B3's path
choice is.

---

## §7. Build verification

After the three edits land:

```bash
npm run build
```

Expected: clean build, no SCSS errors. Demo site renders with no visual
diff at default theme (greps in §9 confirm token surface).

Manual smoke checks:

1. Open a demo page that includes the data-table (e.g.
   `demo/admin/data-table.html` or wherever ln-data-table is exercised).
2. Click a row to select it — `.ln-row-selected` background should be
   the pale primary tint (visually identical to before).
3. Tab to focus a row — `.ln-row-focused` outline should be primary-
   focus color (visually identical).
4. Open any page with an ajax spinner (`.ln-ajax-spinner`) — verify the
   spinner border still renders in primary color.
5. Switch to `data-theme="glass"` and re-verify: row selected/focused
   tints inherit the Glass theme's `--color-primary*` rebinds via the
   `--color-accent-tint` and `--color-accent-focus` vocabulary cascade.

---

## §8. Vocabulary additions summary

One new token added in this plan:

| Token | Wires to | Why |
| --- | --- | --- |
| `--color-accent-focus` | `hsl(var(--color-primary-focus))` | Completes accent vocabulary (parallels `--color-accent-tint`, `--color-accent-tint-strong`); used by `ln-data-table.scss` `.ln-row-focused` outline. |

No theme-block additions needed — `--color-accent-focus` reads
`--color-primary-focus`, which themes either rebind or inherit
defaults. The vocabulary's contract is "match whatever
`--color-primary-focus` is at this scope," same shape as the other
accent vocab.

---

## §9. Acceptance greps

After edits:

```bash
# Should be 0 — no remaining --color-primary or --color-primary-* reads
# in the three target files
grep -nE "hsl\(var\(--color-primary[a-z-]*\)" /home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss
# Expected: 0

grep -nE "hsl\(var\(--color-primary[a-z-]*\)" /home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss
# Expected: 0

# Should be 1 — the new vocabulary token landed
grep -c "color-accent-focus" /home/ashlar/ln-ashlar/scss/config/_tokens.scss
# Expected: 1

# Positive: the new accent reads landed
grep -n "var(--color-accent)" /home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss
# Expected: 1 match (L32)

grep -n "var(--color-accent-tint)\|var(--color-accent-focus)" /home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss
# Expected: 2 matches (L4 and L8)

# Sanity: B3 lines NOT touched (count unchanged)
grep -rc "hsl(var(--color-primary)" /home/ashlar/ln-ashlar/scss/config/mixins/
# Expected: same count as before this plan (~26 lines across 9 files)

# Sanity: build succeeded
ls -la /home/ashlar/ln-ashlar/demo/dist/ln-acme.css
# Expected: file exists, recently modified
```

---

## §10. Surprises / honest disclosures

1. **`focus-ring` family is unfixable in scope.** Originally tagged as
   B1 candidate by the audit (`$color: var(--color-primary)` default
   param). On inspection, five of six mixins are alpha-shape and the
   sixth shares the same triplet-typed param. Defer entire family to
   B3. See §6.

2. **`--color-primary-focus` had no accent vocabulary.** Fixing
   `ln-data-table.scss:8` required adding `--color-accent-focus` (one
   new token). Justified — completes the vocabulary surface symmetric
   to `-tint` and `-tint-strong`.

3. **`@mixin tinted-surface` is canonical B3, not a violation to fix.**
   It IS the alpha-tint primitive that the `.success/.error` cascade
   relies on. Documenting it in §1.5 as by-design.

4. **B3 is a much bigger pattern than `_nav.scss` alpha tints.** The
   audit findings list flagged 5 mixins as B3; the actual count is
   ~26 lines across 9 mixins (`_nav`, `_card`, `_alert`, `_tabs`,
   `_avatar`, `_status-badge`, `_ln-table`, `_data-table`, `_stepper`)
   plus the `_focus` family (6 mixins, 7 lines). B3 is its own design
   problem, no question.

5. **No `box-shadow: ... hsl(var(--color-primary) / 0.3)` collapses to
   B1.** I checked — every box-shadow B3 finding uses non-zero alpha
   in a way that needs alpha composition. None of them can be replaced
   by a solid `--color-accent` read.

6. **`circular-progress`, `_btn`, `_colors` (semantic-color) are
   correctly NOT flagged.** Doc comments and by-design cascade rebinds.
   No action needed there.

7. **`--shadow-primary` token (`_tokens.scss:175`) reads
   `hsl(var(--color-primary) / 0.28)` — looks like B3 violation.**
   Excluded because it's a TOKEN DEFINITION at `:root`, not a mixin
   body read. The rule is "mixin bodies must not read
   `--color-primary*`" — the token surface is allowed to derive accent
   variants from `--color-primary*` (that's how `--color-accent` itself
   is built). Same rationale applies if a future B3 fix introduces
   `--color-accent-raw` — it would read `--color-primary` at `:root`.

8. **The `data-table` audit's Phase E flag is still pending.** The
   ln-data-table.scss file has visual styling (cursor, hover bg,
   opacity transitions for loading state) that arguably belongs in
   mixin + component. Phase B fixes the token reads but does NOT
   migrate the file. Phase E will, eventually.

---

## §11. Executor Prompt

### Context

You are implementing Phase B of the `ln-acme` token-discipline audit:
removing direct `--color-primary*` reads from mixin bodies and
replacing them with the documented `--color-accent*` vocabulary. This
phase fixes **3 lines** across 3 files and adds **1 new vocabulary
token**. A larger category (alpha-tinted reads, ~26 lines) is
deliberately deferred to a future B3 phase. Default-theme rendering
must be byte-equal; no visual diff at default theme.

### Constraints

- Tab indentation throughout.
- No new mixins. No CSS classes. One token addition + three line
  edits.
- Do NOT touch any line not explicitly listed in Steps below — many
  `--color-primary` reads are intentionally deferred (B3) or by-design
  (semantic-color cascade). See plan §1.5 and §5 if curious.
- Do NOT run `git add` / `git commit` / any git command.

### Prerequisites — READ these before editing

1. `/home/ashlar/ln-ashlar/CLAUDE.md` — sections "Token Surface —
   Primitives + Vocabulary", "What NOT to do".
2. `/home/ashlar/ln-ashlar/scss/config/_tokens.scss` L315-320 —
   existing `--color-accent*` vocabulary block. The new token slots
   in beside `--color-accent-tint-strong`.
3. `/home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss` — entire
   file (it's small).
4. `/home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss` —
   entire file.

### Steps

#### Step 1. Add `--color-accent-focus` vocabulary token

File: `/home/ashlar/ln-ashlar/scss/config/_tokens.scss`

Locate the `-- Accent` block (around L315-320). The block currently
ends with `--color-accent-tint-strong` at L320:

```scss
	--color-accent:        hsl(var(--color-primary));
	--color-accent-hover:  hsl(var(--color-primary-hover));
	--color-accent-fg:     hsl(var(--color-white));
	--color-accent-tint:         hsl(var(--color-primary-lighter));
	--color-accent-tint-strong:  hsl(var(--color-primary-light));
```

After the `--color-accent-tint-strong` line, ADD:

```scss
	--color-accent-focus:        hsl(var(--color-primary-focus));
```

Resulting block:

```scss
	--color-accent:        hsl(var(--color-primary));
	--color-accent-hover:  hsl(var(--color-primary-hover));
	--color-accent-fg:     hsl(var(--color-white));
	--color-accent-tint:         hsl(var(--color-primary-lighter));
	--color-accent-tint-strong:  hsl(var(--color-primary-light));
	--color-accent-focus:        hsl(var(--color-primary-focus));
```

Indentation: tab + spaces to align the `:`-column with the surrounding
lines (match the existing `--color-accent-tint` / `-tint-strong` style
exactly).

#### Step 2. Fix `_ajax.scss` L32 — solid primary read

File: `/home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss`

Locate L32 in `@mixin ajax-spinner`:

```scss
	border: 2px solid hsl(var(--color-primary));
```

Replace with:

```scss
	border: 2px solid var(--color-accent);
```

#### Step 3. Fix `ln-data-table.scss` L4 and L8

File: `/home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss`

Replace L4 (inside `.ln-row-selected`):

```scss
	background: hsl(var(--color-primary-lighter));
```

with:

```scss
	background: var(--color-accent-tint);
```

Replace L8 (inside `.ln-row-focused`):

```scss
	outline: 2px solid hsl(var(--color-primary-focus));
```

with:

```scss
	outline: 2px solid var(--color-accent-focus);
```

#### Step 4. Build

Run:

```bash
npm run build
```

Expected: clean build, no SCSS errors.

#### Step 5. Acceptance greps

Run each and confirm output matches expected:

```bash
# 1. New vocabulary token landed (1 match)
grep -c "color-accent-focus" /home/ashlar/ln-ashlar/scss/config/_tokens.scss
# Expected: 1

# 2. ajax mixin no longer reads --color-primary (0 matches)
grep -cE "hsl\(var\(--color-primary[a-z-]*\)" /home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss
# Expected: 0

# 3. data-table JS SCSS no longer reads --color-primary* (0 matches)
grep -cE "hsl\(var\(--color-primary[a-z-]*\)" /home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss
# Expected: 0

# 4. Positive — accent reads landed
grep -c "var(--color-accent)" /home/ashlar/ln-ashlar/scss/config/mixins/_ajax.scss
# Expected: 1

grep -cE "var\(--color-accent-tint\)|var\(--color-accent-focus\)" /home/ashlar/ln-ashlar/js/ln-data-table/ln-data-table.scss
# Expected: 2

# 5. Sanity — B3 lines NOT touched. Total --color-primary alpha
#    reads across mixins should be unchanged.
grep -rcE "hsl\(var\(--color-primary\) /" /home/ashlar/ln-ashlar/scss/config/mixins/
# Expected: same total as before this run (sum across files)
# (B3 lines are intentionally deferred — they MUST still be there.)

# 6. Build artifact exists and is fresh
ls -la /home/ashlar/ln-ashlar/demo/dist/ln-acme.css
# Expected: exists, recently modified.
```

### What ln-acme already provides — DO NOT touch

- `--color-accent`, `--color-accent-hover`, `--color-accent-fg`,
  `--color-accent-tint`, `--color-accent-tint-strong` already exist in
  `_tokens.scss` — reuse, don't redefine.
- `@mixin tinted-surface` (in `_colors.scss`) reads `--color-primary`
  by design — it's the canonical alpha-tint primitive for the
  `.success/.error/.warning/.info` cascade. **Do NOT modify.**
- `@mixin semantic-color` (in `_colors.scss`) rebinds the
  `--color-primary*` family — that's how status classes work. **Do
  NOT modify.**
- `@mixin btn` re-declares `--color-accent: hsl(var(--color-primary))`
  at consumer scope — that's the documented cascade-preserving
  pattern. **Do NOT modify.**
- All B3 alpha-tint reads (`hsl(var(--color-primary) / X)`) across
  `_nav.scss`, `_card.scss`, `_alert.scss`, `_tabs.scss`,
  `_avatar.scss`, `_status-badge.scss`, `_ln-table.scss`,
  `_data-table.scss`, `_stepper.scss`, `_focus.scss` — deferred to
  separate phase. **Do NOT modify.**
- All theme blocks (default, dark, sport, politika, sunset, glass).
  **Do NOT modify.**

### Acceptance criteria (from plan §9)

1. All 6 grep checks in Step 5 return expected values.
2. `npm run build` succeeds with no errors.
3. Default-theme rendering unchanged in any demo page.

### Boundaries — what NOT to touch

- Do not modify `_focus.scss` — entire focus family deferred (plan §6).
- Do not modify any B3 alpha-tint read — deferred (plan §5).
- Do not modify `tinted-surface` or `semantic-color` mixins — by
  design (plan §1.5).
- Do not touch any theme block.
- Do not run `git add` / `git commit` / any git command.
- Do not change demo HTML or JS.

### Report back

When done, return:

- Paths of files modified (3 expected: `_tokens.scss`, `_ajax.scss`,
  `ln-data-table.scss`).
- Output of every grep in Step 5.
- Build success/failure.
- Any deviations from the plan and why.
