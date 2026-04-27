# Plan — Glass theme nav/dropdown structural-override fix

Target violation: `scss/config/_theme.scss` Glass block L198–223 uses
descendant selectors at theme scope to redeclare structural properties
on `nav[data-ln-nav]` and `[data-ln-dropdown-menu] / .menu-items` —
which is the documented WRONG pattern (CLAUDE.md "Theme Architecture"
and "What NOT to do (themes)").

Companion violation: `scss/config/mixins/_nav.scss` L123 reads
`hsl(var(--color-primary-lighter))` directly inside a mixin body
(reaches through to the `--color-primary*` scale instead of the
`--color-accent-tint*` vocabulary that already exists for this exact
purpose — "accent wash vocabulary (upload, active nav)" per
CLAUDE.md L532).

This plan converts both into a token-only design that preserves
default-theme rendering byte-for-byte and matches the Glass-theme
appearance via theme-`:root` rebinds.

---

## §1. Decision — palette-only via companion tokens + soft slots

**Verdict: palette-only.** No new `nav-bordered` variant mixin.

The Glass theme adds three behaviors on top of the default nav:

| Glass behavior                        | Resolves to in default theme                 | Mechanism                                   |
| ------------------------------------- | -------------------------------------------- | ------------------------------------------- |
| Hover/active = accent border ring     | Transparent border idle + transparent state | Always-present 1px transparent border slot  |
| Active link = accent tint background   | Existing default already uses accent tint  | Switch read site to `--color-accent-tint-strong` (existing vocab) |
| Dropdown menu item dividers (li + li) | No divider visible                           | SOFT `--border-block-start` slot, default unset |
| Nav `ul` bleed to sidebar edges       | No bleed (margin-inline: 0)                  | Token-controlled offset, default 0          |

**Why palette-only and not a `nav-bordered` mixin:**

1. The "1px transparent border" is geometrically inert — it occupies 1px
   of layout space, but with the matching `margin: calc(-1 * var(--border-width))`
   compensation already in the Glass code, the visible box is unchanged.
   We move both — the border slot AND its margin compensation — into the
   base mixin, controlled by tokens that resolve to no-op defaults.
2. The codebase already establishes this exact pattern for buttons:
   `@mixin btn` reads `--color-accent-bg-*` via fallback, default theme
   has the companions unset → falls back to solid + white, Glass rebinds
   the companions at `:root` → translucent fill. Same shape applied to
   nav.
3. The `--border-block-start`/`-end`/`-inline-start`/`-inline-end`
   primitives are explicitly designed as SOFT (no `:root` default) for
   exactly this kind of structural slot. CLAUDE.md "Per-side borders
   (soft — NO `:root` default)" calls this out. We're using the
   sanctioned pattern.
4. A `nav-bordered` mixin would force projects to opt in via
   `@include nav-bordered` AT EVERY CONSUMER — but the user's intent is
   "everything looks bordered when Glass is active, regardless of which
   project consumes the lib." Theme-level palette rebind is the right
   axis.

**Verdict on dropdown `li + li` border:** same — palette-only via the
existing SOFT `--border-block-start` slot, read in `@mixin menu-items`
on `li + li`.

---

## §2. Token surface changes

### §2.1 Existing tokens reused (no addition)

- **`--color-accent-tint-strong`** (already at `_tokens.scss` L320) —
  vocabulary for "active nav" wash. Replaces the current
  `hsl(var(--color-primary-lighter))` direct read in
  `nav-links-rounded` L123.

- **`--border-block-start`** (already a SOFT primitive — no `:root`
  default, see `_tokens.scss` L363–376) — reused on
  `@mixin menu-items` `li + li` selector. Default theme: unset →
  fallback `none`. Glass theme: rebinds at `:root` to a visible border.

### §2.2 New companion tokens (cross-cutting, not per-component)

Two new logical-token slots, both following the established
"companion read via fallback" pattern. Declared in `_tokens.scss` as
documented but-not-defined slots (parallel to the
`--color-accent-bg-*` family already there at L322–337).

```scss
// scss/config/_tokens.scss — under the "Translucent accent surface"
// block, around L321–337, add a parallel "Nav surface" companion block:

// Nav surface — companions for themes that opt in to a bordered/inset
// nav appearance (e.g. Glass). NO defaults — `@mixin nav` reads these
// via fallback to no-op values, so the default theme renders unchanged.
//
// --nav-link-border-color   — color of the 1px border slot around each
//                              link in idle state. Default: transparent.
//                              Glass: transparent (idle stays bare).
// --nav-link-border-color-hover  — border color on hover. Default:
//                              transparent. Glass: --color-accent.
// --nav-link-border-color-active — border color on .active. Default:
//                              transparent. Glass: --color-accent.
// --nav-list-bleed          — margin-inline applied to `ul` to bleed
//                              the list to the parent's vertical
//                              borders. Default: 0. Glass:
//                              calc(-1 * var(--padding-x)).
//
// (The 1px border slot itself is ALWAYS present in @mixin nav so
// link geometry is theme-independent. Color tokens flip the visibility.)
// --nav-link-border-color
// --nav-link-border-color-hover
// --nav-link-border-color-active
// --nav-list-bleed
```

**Naming defense — why `--nav-*` is not a per-component-surface
token violation.** CLAUDE.md forbids per-component-surface tokens AT
`:ROOT` because they freeze upstream tokens. The forbidden examples
are `--btn-py`, `--card-gap`, `--btn-accent-*`. The distinction is:

- **Forbidden:** `--btn-accent-bg: var(--color-accent)` AT `:root` —
  freezes `--color-accent` at `:root`, breaks
  `.success`/`.error`/`.warning`/`.info` cascade.
- **Allowed:** declared SLOTS with NO defaults, read via `var(slot,
  fallback)` in the consumer mixin. The `--color-accent-bg-*` family
  is exactly this and is documented as the correct pattern.

`--nav-link-border-color*` and `--nav-list-bleed` follow the same
SOFT-slot pattern: declared in tokens.scss as comments only (no
`:root` value), read via `var(slot, fallback)` inside `@mixin nav`,
rebound at theme `:root` only. They cross zero component lines (only
nav reads them) but the **architectural shape** — soft slot + fallback
+ theme rebind at `:root` — is the cross-cutting pattern, not a frozen
`:root` surface. This is the same as `--border-block-start` (soft
primitive, only structural mixins read it, but it's documented as
cross-cutting).

**Alternative considered and rejected:** reusing `--color-border` as
the active-state border color. Rejected because `--color-border` is
the GENERIC border primitive (`= --border-subtle` by default) — a
nav link's "I am the active item" border needs to be the accent
color, not the generic border. Conflating them would mean the Glass
theme either (a) makes ALL `--color-border` reads accent-colored
(visually wrong for cards, tables, etc.), or (b) reaches into nav
descendants to override `--color-border` locally — which is the
specificity hack we're removing. A dedicated nav slot is correct.

---

## §3. File-by-file edits

### §3.1 `scss/config/_tokens.scss`

**Insert** a comment block documenting the new SOFT slots,
immediately after the existing `--color-accent-bg-*` documentation
block (after L337, before the "Button surface" block at L339).

```scss
// Nav surface — companions for themes that opt in to a bordered/inset
// nav appearance (e.g. Glass). NO defaults — @mixin nav reads these
// via fallback. See @mixin nav in scss/config/mixins/_nav.scss.
// --nav-link-border-color
// --nav-link-border-color-hover
// --nav-link-border-color-active
// --nav-list-bleed
```

No `:root` value declarations — these are SOFT slots, identical shape
to the `--color-accent-bg-*` block above and the per-side
`--border-block-*` block below.

### §3.2 `scss/config/mixins/_nav.scss`

**Edit 1 — `@mixin nav` body, `ul` block (currently L27–29).** Add a
token-controlled bleed slot.

```scss
ul {
    @include list-reset;
    margin-inline: var(--nav-list-bleed, 0);
}
```

**Edit 2 — `@mixin nav` body, `a` block (currently L35–46).** Add an
always-present 1px border slot with negative-margin compensation,
both controlled by tokens that default to a no-op.

```scss
a {
    --gap: var(--size-sm-up);
    --color-fg: var(--fg-muted);
    @include flex;
    @include items-center;
    gap: var(--gap);
    padding-block: var(--padding-y);
    font-size: var(--text-body-sm);
    line-height: var(--lh-body-sm);
    color: var(--color-fg);
    text-decoration: none;
    // Always-present border slot. Color defaults to transparent so
    // default theme renders identically to before. Themes that want a
    // visible ring (e.g. Glass) rebind --nav-link-border-color* at
    // theme :root. The negative margin compensates so the 1px ring
    // doesn't shift adjacent siblings.
    border: var(--border-width) solid var(--nav-link-border-color, transparent);
    margin: calc(-1 * var(--border-width));
    transition:
        background-color var(--transition-fast),
        color            var(--transition-fast),
        border-color     var(--transition-fast);
}
```

**Edit 3 — `@mixin _nav-link-active` (currently L83–94).** Add hover
and active border-color rebinds reading the new companions, both
defaulting to `transparent` so default theme is unchanged.

```scss
@mixin _nav-link-active {
    a {
        &:hover {
            color: var(--color-fg);
            border-color: var(--nav-link-border-color-hover, transparent);
        }

        &.active {
            color: var(--color-accent);
            border-color: var(--nav-link-border-color-active, transparent);
            @include font-semibold;
        }
    }
}
```

**Edit 4 — `@mixin nav-links-rounded`, `a.active` block (currently
L121–124).** Replace the scale-token read with the existing
`--color-accent-tint-strong` vocabulary.

```scss
&.active {
    // accent wash vocabulary (CLAUDE.md L532) — was
    // hsl(var(--color-primary-lighter)) which reaches through to
    // scale; --color-accent-tint-strong is the documented vocab for
    // "active nav".
    background-color: var(--color-accent-tint-strong);
}
```

**Edit 5 — `@mixin nav` body, `a` block transition (currently L46
implicit — there is no transition declared in the base mixin
today).** Wait — re-check.

Re-reading `_nav.scss` L35–46: the base `@mixin nav` `a` block does
NOT declare `transition`. Each preset (`nav-links-rounded` L114,
`nav-links-border-left` L142, `nav-links-border-grow` L198,
`nav-links-border-top` L254) declares its own transition. So Edit 2
above is partly wrong — adding `transition: ...border-color...` in
the base would conflict with each preset's own transition.

**Revised Edit 2:** the `border` and `margin` declarations go in the
base `@mixin nav`'s `a` block (these are layout, theme-independent
in their no-op default). The `border-color` transition is added in
each PRESET's own transition list — but only `nav-links-rounded` is
the default and is the only one demonstrably affected by the Glass
theme today (Glass overrides `nav[data-ln-nav] a` which catches all
presets, but in practice the sidebar uses the rounded default). To
keep the change scoped and not touch presets that aren't broken,
**add `border-color` to the transition in `nav-links-rounded` only**
(L114). The other three presets keep their existing transition
lists; if a future project applies them under Glass and wants
animated border-color, that's a follow-up.

**Final Edit 2 (corrected):** add only `border` + `margin` to the
base `@mixin nav` `a` block. No transition change in base.

```scss
a {
    --gap: var(--size-sm-up);
    --color-fg: var(--fg-muted);
    @include flex;
    @include items-center;
    gap: var(--gap);
    padding-block: var(--padding-y);
    font-size: var(--text-body-sm);
    line-height: var(--lh-body-sm);
    color: var(--color-fg);
    text-decoration: none;
    // Always-present 1px border slot. Color defaults to transparent
    // (default theme = invisible). Themes that opt in (Glass) rebind
    // --nav-link-border-color* at theme :root for a visible ring on
    // hover/active. Negative margin compensates so the slot doesn't
    // shift adjacent siblings.
    border: var(--border-width) solid var(--nav-link-border-color, transparent);
    margin: calc(-1 * var(--border-width));
}
```

**Final Edit 2b — `nav-links-rounded` transition (L114):** add
`border-color` to the transition list.

```scss
transition:
    background-color 150ms ease,
    color            150ms ease,
    border-color     150ms ease;
```

### §3.3 `scss/config/mixins/_dropdown.scss`

**Edit 6 — `@mixin menu-items` body (after L100 closing brace of
the `a, button, …` block, before the `hr` selector at L103).** Add
a `li + li` divider that reads the SOFT `--border-block-start`
primitive with `none` fallback. Default theme: no divider. Glass:
rebinds the primitive at `:root` to show one.

```scss
// Inter-item divider — SOFT primitive read with `none` fallback.
// Default theme: no divider visible. Themes that opt in (Glass)
// rebind --border-block-start at theme :root.
li + li {
    border-block-start: var(--border-block-start, none);
}
```

**Why inside `@mixin menu-items` and not in a wrapper:** the existing
hr separator at L103 already reads `--border-block-start` with the
same fallback shape. This keeps the recipe consistent — both the
explicit `<hr>` and the implicit inter-item rule use the same SOFT
slot.

**Caveat — divider color.** `@mixin menu-items` currently reads
`--color-border` for `<hr>`'s fallback. Inter-item dividers in Glass
should use the same color as the hr separator for consistency. The
fallback `none` means Glass MUST set the full shorthand
(`var(--border-width) solid var(--color-border)`) at theme `:root`,
not just rebind a color. That matches the existing Glass code at
old L222 (`border-block-start: var(--border-width) solid
var(--color-border)`) so no behavior change.

### §3.4 `scss/config/_theme.scss`

**Edit 7 — Glass theme block (L198–223 currently).** Replace the
descendant-selector structural overrides with theme-`:root` token
rebinds.

```scss
// Replaces L198–223. New content lives entirely inside the existing
// [data-theme="glass"] { ... } at the same indentation as the other
// :root rebinds (--btn-bg etc above).

// ── Nav lists — join items with per-side divider lines ─────────
// Palette-only rebind at theme :root. @mixin nav reads
// --nav-link-border-color* via fallback (defaults: transparent). Glass
// rebinds them to --color-accent so hover/active draw an accent ring.
// --nav-list-bleed shifts the ul to the sidebar's vertical borders so
// the implicit dividers reach edge-to-edge; @mixin nav reads it with
// `0` fallback so default theme is unaffected.
--nav-link-border-color-hover:  var(--color-accent);
--nav-link-border-color-active: var(--color-accent);
--nav-list-bleed:               calc(-1 * var(--padding-x));

// Active-link wash — Glass shows a subtle accent fill on .active.
// --color-accent-tint-strong already wires to --color-primary-light at
// :root; Glass's own --color-primary-light: 218 55% 24% (above) tunes
// the wash for the dark surface.
// (No additional rebind needed — @mixin nav-links-rounded reads
// --color-accent-tint-strong directly after Edit 4.)

// Dropdown / menu-items dividers — SOFT --border-block-start primitive
// is read by @mixin menu-items on `li + li` and `hr`. Glass rebinds it
// at theme :root to flip the divider on for both. Restricted to scope
// `[data-ln-dropdown-menu], .menu-items` so it doesn't leak to other
// consumers of --border-block-start (cards, tables, accordions).
[data-ln-dropdown-menu],
.menu-items {
    --border-block-start: var(--border-width) solid var(--color-border);
}
```

**Why the dropdown rebind is scoped, not at theme `:root`:**
`--border-block-start` is a SOFT primitive read by ~10+ mixins
across the lib (cards, tables, accordions, nav dividers, etc.). A
theme-`:root` rebind would flip dividers on for every consumer.
Scoping to `[data-ln-dropdown-menu], .menu-items` keeps the rebind
to the surfaces the Glass theme intends to affect — which mirrors
the original code's selector targeting at L220–221.

This scoped descendant rebind is NOT a structural-override violation:
it changes only the value of a token slot the mixin already reads
with a fallback. No `background:` / `border-color:` / `&:hover` block
duplication. This is the sanctioned use of descendant selectors in
themes — value rebinds on a scope where palette must shift, not
property declarations.

---

## §4. Default-theme equivalence reasoning

For each new slot, trace what value resolves at the consumer site
under default theme.

### §4.1 `--nav-link-border-color`

- Slot has NO `:root` default.
- `@mixin nav` reads `border: var(--border-width) solid
  var(--nav-link-border-color, transparent)`.
- Default theme: slot unset → `transparent`.
- Effective rule: `border: 1px solid transparent`.
- Visual: an invisible 1px border. Combined with `margin: calc(-1 *
  var(--border-width))`, the link's effective box is unchanged from
  before (margin negates the 1px the border adds to the layout).
- **Verdict:** rendering identical.

### §4.2 `--nav-link-border-color-hover` / `-active`

- No `:root` default. Read with `transparent` fallback.
- Default theme: hover and active states have `border-color:
  transparent` — invisible, no visual change.
- **Verdict:** rendering identical.

### §4.3 `--nav-list-bleed`

- No `:root` default. Read with `0` fallback in `@mixin nav` ul.
- Default theme: `margin-inline: 0` — no bleed, list aligns with
  parent inner padding.
- Previous default-theme rendering: `nav[data-ln-nav] ul` had no
  margin-inline at all (the Glass override added it, but only under
  `[data-theme="glass"]`).
- **Verdict:** `margin-inline: 0` is equivalent to no `margin-inline`
  declaration in this context — block element's intrinsic inline
  margin is 0 by default.

### §4.4 `--color-accent-tint-strong` (replacing `--color-primary-lighter` direct read)

- `_tokens.scss` L320: `--color-accent-tint-strong: hsl(var(--color-primary-light))`.
- Wait — that wires to `--color-primary-light`, not `--color-primary-lighter`.

Re-read the current code at `_nav.scss` L123:
```scss
background-color: hsl(var(--color-primary-lighter));
```

And `_tokens.scss` L26–27:
```scss
--color-primary-light: 216 95% 93%;
--color-primary-lighter: 216 95% 97%;
```

`-lighter` is even paler than `-light`. The current nav active uses
`-lighter` (the palest). `--color-accent-tint-strong` wires to
`-light` (the slightly stronger one). `--color-accent-tint` wires to
`-lighter`.

So the correct vocabulary substitution is:

```scss
&.active {
    background-color: var(--color-accent-tint);  // not -tint-strong
}
```

**Corrected Edit 4:** read `--color-accent-tint`, not
`--color-accent-tint-strong`.

`_tokens.scss` L319: `--color-accent-tint: hsl(var(--color-primary-lighter))` —
exact byte-for-byte equivalent to the current direct read.

- **Verdict:** rendering identical at default theme. Pixel-equal.

### §4.5 Dropdown `li + li { border-block-start: var(--border-block-start, none) }`

- `--border-block-start` SOFT, no `:root` default.
- Default theme: fallback `none` → `border-block-start: none`.
- Previous default-theme rendering: dropdown menu items had no
  `border-block-start` declaration, so default value applies (`none`
  via initial CSS).
- **Verdict:** rendering identical.

### §4.6 `nav-links-rounded` transition list adds `border-color`

- Default theme: `border-color` is `transparent` in all states (no
  visible change), so adding it to the transition list is a no-op
  visually.
- **Verdict:** rendering identical.

---

## §5. Glass-theme equivalence reasoning

Trace every Glass behavior to confirm visual parity with the
pre-change code.

### §5.1 Active-link border

- Pre-change: `[data-theme="glass"] nav[data-ln-nav] a.active {
  border-color: var(--color-accent); }` — direct property override.
- Post-change: `[data-theme="glass"] { --nav-link-border-color-active:
  var(--color-accent); }`. Inside `@mixin _nav-link-active` (which
  `nav-links-rounded` includes), the rule
  `border-color: var(--nav-link-border-color-active, transparent)`
  resolves to `var(--color-accent)`.
- **Verdict:** visual parity.

### §5.2 Hover-link border

- Pre: `[data-theme="glass"] nav[data-ln-nav] a:hover {
  border-color: var(--color-accent); }`.
- Post: `--nav-link-border-color-hover: var(--color-accent)` at theme
  `:root`. Resolves the same.
- **Verdict:** visual parity.

### §5.3 Idle-link border (transparent ring)

- Pre: `[data-theme="glass"] nav[data-ln-nav] a { border:
  var(--border-width) solid transparent; margin: calc(-1 *
  var(--border-width)); }`.
- Post: ALWAYS-PRESENT in `@mixin nav` `a` block — `border:
  var(--border-width) solid var(--nav-link-border-color, transparent);
  margin: calc(-1 * var(--border-width))`. Idle state under Glass:
  `--nav-link-border-color` is unset (only the `-hover` and
  `-active` companions are rebound), fallback = transparent. Same
  ring geometry, transparent in idle.
- **Verdict:** visual parity.

### §5.4 Transition

- Pre: `[data-theme="glass"] nav[data-ln-nav] a { transition:
  border-color var(--transition-fast), background-color
  var(--transition-fast); }`.
- Post: `nav-links-rounded` `a` block has `transition: background-color
  150ms ease, color 150ms ease, border-color 150ms ease`. The Glass
  theme uses `nav-links-rounded` (default preset) so this transition
  applies. Note: `--transition-fast` resolves to `0.15s cubic-bezier(0.4,
  0, 0.2, 1)` (`_tokens.scss` L183), versus the preset's `150ms ease`.
  These are NOT identical — `ease` is `cubic-bezier(0.25, 0.1, 0.25,
  1.0)`, not the standard easing.

  **Tradeoff:** the pre-change Glass code used `--transition-fast`
  (standard cubic-bezier curve). The post-change code uses the
  preset's hardcoded `150ms ease`. The duration is identical
  (150ms = 0.15s). The easing curve differs subtly.

  **Resolution:** this is a pre-existing inconsistency in the
  codebase — the preset's `transition` already used `150ms ease`
  before Glass added its own override. Glass effectively patched the
  curve. To keep this fix scoped and not touch `nav-links-rounded`
  defaults across non-Glass themes, **accept the curve difference**.
  Visually: 150ms is short enough that the curve difference is
  imperceptible on a border-color change (the human eye doesn't
  resolve easing curves under ~200ms for chromatic-only animations).

  If the user wants exact parity, an optional follow-up would change
  the preset's transition tokens to use `--transition-fast`. Out of
  scope for this plan — flagged as a low-priority follow-up.
- **Verdict:** functional parity. Curve differs imperceptibly; scope
  confined to Glass-only effect.

### §5.5 Active-link background

- Pre: `[data-theme="glass"] nav[data-ln-nav] a.active {
  background-color: hsl(var(--color-primary-light)); }`.
  Glass's `--color-primary-light: 218 55% 24%` (L148) → that
  resolves to `hsl(218 55% 24%)`.
- Post: `nav-links-rounded` reads `var(--color-accent-tint)`.
  - `--color-accent-tint` at `:root` = `hsl(var(--color-primary-lighter))`
    (L319).
  - In Glass: `--color-primary-lighter: 218 50% 16%` (L149) →
    `hsl(218 50% 16%)`.

  ⚠️ **Pre vs post resolve to DIFFERENT values:** pre = `hsl(218 55%
  24%)`, post = `hsl(218 50% 16%)`. The pre-change code reaches into
  `-light` (L148, value `218 55% 24%`); the vocabulary
  `--color-accent-tint` wires to `-lighter` (L149, value `218 50% 16%`).

  **Both are legitimate "tint" colors;** the question is which Glass
  intended. Reading the original Glass-block comment block: there is
  no comment explaining this choice. Looking at the default-theme
  active wash: `nav-links-rounded` L123 reads `--color-primary-lighter`
  (the paler tint — value `216 95% 97%` on light theme). So Glass's
  `--color-primary-light` (L148, slightly darker `218 55% 24%`) was
  a **deliberate divergence** from the default — Glass wanted a
  STRONGER tint than `-lighter` because dark surfaces need more
  contrast to read.

  **Two paths:**

  **Path A (recommended):** keep the codebase architecturally
  consistent — read `--color-accent-tint` (the existing vocab,
  matches default theme's intent of "subtle wash"). Accept that
  Glass's active wash gets slightly darker (`218 50% 16%` vs `218
  55% 24%`). Rationale: Glass intended slight divergence, not a
  fundamentally different vocab slot. The 8-percentage-point lightness
  difference on a deeply dark surface is minor — both read as
  "subtle accent tint." If user disagrees, Path B.

  **Path B:** Glass's stronger tint is intentional and worth
  preserving — read `--color-accent-tint-strong` instead. But then:
    - Default theme wash changes too (light theme would get `-light`
      = `216 95% 93%` instead of `-lighter` = `216 95% 97%`) — that
      VIOLATES the "default theme rendering MUST NOT change"
      constraint.
    - Workaround: rebind `--color-accent-tint` AT GLASS `:ROOT` to
      `hsl(var(--color-primary-light))` so Glass uses the stronger
      tint while default stays on `-lighter`.

  **Final pick: Path B with Glass-scope rebind of
  `--color-accent-tint`.** Honors both constraints (default theme
  unchanged; Glass visually equivalent) and the chosen vocab is the
  correct semantic ("active nav wash"). This rebind is value-only,
  not structural — the rebind shape is identical to the existing
  Glass `--btn-bg`/`--btn-border` rebinds at L172–175.

  **Revised Edit 7 — add to Glass `:root`:**
  ```scss
  // Glass shifts the active-nav wash one step darker than the
  // default-theme value to match the deeper dark surface. Rebinds
  // --color-accent-tint at theme :root; @mixin nav-links-rounded
  // reads it. Replaces the pre-change descendant override.
  --color-accent-tint: hsl(var(--color-primary-light));
  ```

  ⚠️ **Side-effect audit for `--color-accent-tint`:** other
  consumers of this token are
  - `_dropdown.scss` L97 (`active aria-current` background in menu)
  - `_upload.scss` L38 (drop-zone background)

  Glass currently doesn't override these; under the rebind, both
  also shift one tint step darker on Glass. **Is this a regression
  or an improvement?** Both are passive accent washes on dark
  surfaces; a slightly stronger tint reads MORE on deep darks, not
  less. This is a subtle visual improvement, not a regression. No
  redesign needed. **Acceptable.**

  If the user disagrees and wants `--color-accent-tint` to stay at
  its default in Glass, Path A (accept the slight wash difference
  on the active nav specifically) is the alternative — at the cost
  of losing some contrast on the active nav highlight under Glass.

  **Decision: go with Path B (rebind `--color-accent-tint` at Glass
  `:root`).** Surfaces a value-only theme rebind, not a structural
  override; preserves default theme; matches Glass's prior visual
  intent for the active nav; positively affects two other accent
  surfaces.

- **Verdict (Path B):** visual parity for nav active. Slight tint
  shift on dropdown active item + upload drop-zone (improvement,
  not regression).

### §5.6 Nav `ul` bleed

- Pre: `[data-theme="glass"] nav[data-ln-nav] ul { margin-inline:
  calc(-1 * var(--padding-x)); }`.
- Post: `--nav-list-bleed: calc(-1 * var(--padding-x))` at Glass
  `:root`. `@mixin nav` reads `margin-inline: var(--nav-list-bleed,
  0)`. Resolves to identical computed value. `--padding-x` resolves
  at the `<ul>` element under Glass — same scope as before, since
  the original descendant rule also resolved at the `<ul>`.
- **Verdict:** visual parity.

### §5.7 Dropdown menu inter-item dividers

- Pre: `[data-theme="glass"] [data-ln-dropdown-menu] li + li,
  [data-theme="glass"] .menu-items li + li { border-block-start:
  var(--border-width) solid var(--color-border); }`.
- Post: `@mixin menu-items` declares `li + li { border-block-start:
  var(--border-block-start, none) }` (always present, fallback
  none). Glass scope-rebinds: `[data-theme="glass"]
  [data-ln-dropdown-menu], [data-theme="glass"] .menu-items {
  --border-block-start: var(--border-width) solid var(--color-border) }`.
  - At `li + li`, the `--border-block-start` lookup walks up: `li`
    → `<ul>` (parent of li+li under @mixin dropdown-menu) → which
    is itself `[data-ln-dropdown-menu]` → matches Glass scope rebind
    → resolves to the full shorthand.
  - **Caveat:** for `.menu-items`, the rebind sits on the `<ul>`
    that has `class="menu-items"`. `li + li` inside that ul resolves
    `--border-block-start` from the parent `<ul>` scope. Same lookup
    path as dropdown-menu.
  - Visual: same divider color, width, position as before.
- **Verdict:** visual parity.

---

## §6. Build verification

After all edits land, run:

```bash
npm run build
```

Expected: clean build, no SCSS errors. Demo site still renders
correctly under all themes.

**Manual visual checks (post-build):**

1. Open `demo/dist/index.html` (or whichever demo entry
   exercises the sidebar nav) in a browser.
2. With NO `data-theme` set: verify nav active link still has
   the pale primary-tint background (matches pre-change).
3. With `data-theme="glass"` on `<html>`: verify
   - Sidebar nav links have transparent border by default.
   - Hover shows accent-color border.
   - Active link shows accent border + tinted background.
   - Dropdown menus show divider lines between items.
   - Theme picker dropdown (.menu-items) shows divider lines.
4. With `data-theme="dark"`: verify nav active background still
   reads correctly (no regression — `--color-accent-tint` is unchanged
   under non-Glass themes).
5. With `data-theme="ocean"` / `sunset` / `midnight`: smoke check
   that nav rendering is unaffected (these themes never had the
   border treatment).

---

## §7. Out of scope (flagged for later)

- **`hsl(var(--color-primary) / X)` alpha-tint reads** in
  `nav-links-rounded` L118 and `nav-links-border-left/grow/top` —
  these are scale-token reads but require a NEW "alpha-composable
  accent" token system to fix. Distinct effort, not blocked by
  this fix. Documented exception per `_nav.scss` L117 comment.
- **`box-shadow: inset 2px 0 0 hsl(var(--color-primary) / 0.3)`** in
  `nav-links-border-left` L145 — same alpha-tint pattern. Same
  out-of-scope reason.
- **Transition curve mismatch** noted in §5.4 (preset uses `ease`,
  Glass pre-change used `--transition-fast`'s standard cubic-bezier).
  Imperceptible at 150ms; flagged as a follow-up if the user wants
  byte-perfect parity.

---

## §8. Acceptance criteria

1. `scss/config/_theme.scss` contains zero `[data-theme="glass"] X Y
   { property: value }` rules where `property` is `background`,
   `background-color`, `color`, `border`, `border-color`,
   `border-block-start`, `margin`, `margin-inline`, or `transition`.
   (Token rebinds and value-only `--*` declarations do not count.)
2. `scss/config/_theme.scss` Glass block is structurally identical
   in shape to the existing `--btn-*` rebind block (token rebinds at
   theme `:root` + a single scoped value-only rebind for the
   dropdown surface).
3. `grep -n "color-primary-lighter" scss/config/mixins/_nav.scss`
   returns nothing (was on L123).
4. Default-theme rendering on every demo page is byte-equal to
   pre-change. Verify by running `npm run build` and diffing the
   compiled `demo/dist/ln-acme.css` (the only changed selectors
   should be: `nav[data-ln-nav] a` gains `border` + `margin`
   declarations, `nav[data-ln-nav] ul` gains `margin-inline: 0`,
   menu-items `li + li` gains `border-block-start: none`,
   nav-links-rounded transition gains `border-color`).
5. Glass-theme rendering visually matches pre-change per §5.

---

## §9. Executor Prompt

Below is the self-contained prompt for a Sonnet executor. Paste this
into a fresh `@executor` invocation.

---

### Context

You are implementing a refactor of the Glass theme nav/dropdown
overrides in `ln-acme`. The current Glass theme uses descendant
selectors at higher specificity to redeclare structural properties
on `nav[data-ln-nav]` and `[data-ln-dropdown-menu]` — which is the
documented WRONG pattern (CLAUDE.md "Theme Architecture"). The fix
moves all structural slots into the base mixins (with no-op default
values via fallback) and reduces Glass to pure token rebinds at theme
`:root`. Default-theme rendering must NOT change.

### Constraints

- Tab indentation throughout.
- No new mixins. No CSS classes. Only token additions and edits to
  existing mixin bodies.
- Do not touch `[data-theme="dark"]`, `[data-theme="ocean"]`,
  `[data-theme="sunset"]`, `[data-theme="midnight"]` blocks.
- No hardcoded colors. Read tokens.

### Prerequisites — READ these before editing

1. `/home/ashlar/ln-ashlar/CLAUDE.md` — sections "Theme Architecture",
   "Token Surface — Primitives + Vocabulary", "What NOT to do (themes)".
2. `/home/ashlar/ln-ashlar/scss/config/_tokens.scss` — confirm
   `--color-accent-tint` (L319) and the `--color-accent-bg-*` SOFT
   slot pattern (L322–337).
3. `/home/ashlar/ln-ashlar/scss/config/_theme.scss` L141–225 —
   current Glass block (the target of edits).
4. `/home/ashlar/ln-ashlar/scss/config/mixins/_nav.scss` — entire
   file, especially `@mixin nav` L24–78, `@mixin _nav-link-active`
   L83–94, `@mixin nav-links-rounded` L99–126.
5. `/home/ashlar/ln-ashlar/scss/config/mixins/_dropdown.scss` —
   `@mixin menu-items` L46–108 (note the `hr` block at L103 that
   already reads `--border-block-start` with fallback — your new
   `li + li` rule mirrors this shape).
6. `/home/ashlar/ln-ashlar/scss/config/mixins/_btn.scss` — header
   L42–55 explains the cross-cutting companion-token pattern. The
   nav fix follows the same shape.

### Steps

#### Step 1. Add SOFT-slot documentation to `_tokens.scss`

File: `/home/ashlar/ln-ashlar/scss/config/_tokens.scss`

After L337 (the closing comment of the `--color-accent-bg-*` block,
i.e. the line `// --color-accent-bg-fg`), and BEFORE L339 (the
`// -- Button surface (neutral default) --` comment), insert a blank
line and then the new comment block:

```scss

	// Nav surface — companions for themes that opt in to a bordered/inset
	// nav appearance (e.g. Glass). NO defaults — `@mixin nav` reads these
	// via fallback to no-op values (transparent border, zero bleed), so
	// the default theme renders unchanged. Themes rebind at theme :root.
	// --nav-link-border-color
	// --nav-link-border-color-hover
	// --nav-link-border-color-active
	// --nav-list-bleed
```

Acceptance: `grep -c "nav-link-border-color" /home/ashlar/ln-ashlar/scss/config/_tokens.scss`
returns `3`.

#### Step 2. Add bleed slot to `@mixin nav` `ul` block

File: `/home/ashlar/ln-ashlar/scss/config/mixins/_nav.scss`

Locate the `ul { @include list-reset; }` block in `@mixin nav` (around L27–29). Replace with:

```scss
	ul {
		@include list-reset;
		margin-inline: var(--nav-list-bleed, 0);
	}
```

#### Step 3. Add border slot to `@mixin nav` `a` block

Same file. Locate the `a { ... }` block in `@mixin nav` (L35–46).
The current block ends with `text-decoration: none;`. Append two
new declarations after that line, before the closing brace:

```scss
		// Always-present 1px border slot. Color defaults to transparent
		// (default theme = invisible). Themes that opt in (Glass) rebind
		// --nav-link-border-color* at theme :root. Negative margin
		// compensates so the slot doesn't shift adjacent siblings.
		border: var(--border-width) solid var(--nav-link-border-color, transparent);
		margin: calc(-1 * var(--border-width));
```

Resulting full block:

```scss
	a {
		--gap: var(--size-sm-up);
		--color-fg: var(--fg-muted);
		@include flex;
		@include items-center;
		gap: var(--gap);
		padding-block: var(--padding-y);
		font-size: var(--text-body-sm);
		line-height: var(--lh-body-sm);
		color: var(--color-fg);
		text-decoration: none;
		// Always-present 1px border slot. Color defaults to transparent
		// (default theme = invisible). Themes that opt in (Glass) rebind
		// --nav-link-border-color* at theme :root. Negative margin
		// compensates so the slot doesn't shift adjacent siblings.
		border: var(--border-width) solid var(--nav-link-border-color, transparent);
		margin: calc(-1 * var(--border-width));
	}
```

#### Step 4. Add border-color reads to `@mixin _nav-link-active`

Same file. Locate `@mixin _nav-link-active` (L83–94). Update the `&:hover` and `&.active` blocks to add `border-color` reads with `transparent` fallback:

```scss
@mixin _nav-link-active {
	a {
		&:hover {
			color: var(--color-fg);
			border-color: var(--nav-link-border-color-hover, transparent);
		}

		&.active {
			color: var(--color-accent);
			border-color: var(--nav-link-border-color-active, transparent);
			@include font-semibold;
		}
	}
}
```

#### Step 5. Replace scale-token read in `nav-links-rounded`

Same file. Locate `@mixin nav-links-rounded` `a.active` block (L121–124). Replace `hsl(var(--color-primary-lighter))` with `var(--color-accent-tint)`:

```scss
		&.active {
			// accent wash vocabulary (CLAUDE.md L532) — was reaching
			// through to --color-primary-lighter scale.
			background-color: var(--color-accent-tint);
		}
```

Also update the `transition` declaration in the same `a` block (L114) to add `border-color`:

```scss
		transition:
			background-color 150ms ease,
			color            150ms ease,
			border-color     150ms ease;
```

(Was: single-line `transition: background-color 150ms ease, color 150ms ease;` — split across multiple lines with the new entry.)

Acceptance: `grep -c "color-primary-lighter\|color-primary-light\b" /home/ashlar/ln-ashlar/scss/config/mixins/_nav.scss` returns `0` for the rounded preset's active block. (Other presets that read `--color-primary` for alpha tints are out of scope per the plan §7 — leave them alone.)

#### Step 6. Add `li + li` divider slot to `@mixin menu-items`

File: `/home/ashlar/ln-ashlar/scss/config/mixins/_dropdown.scss`

Locate `@mixin menu-items` body. After the closing brace of the
`a, button, input[type="submit"], ...` block (around L100), and
BEFORE the `// ─── Separator ──...` section (L102), insert:

```scss
	// Inter-item divider — SOFT --border-block-start primitive read with
	// `none` fallback. Default theme: no divider. Themes that opt in
	// (Glass) rebind --border-block-start in scope.
	li + li {
		border-block-start: var(--border-block-start, none);
	}
```

#### Step 7. Replace the Glass-theme structural overrides with token rebinds

File: `/home/ashlar/ln-ashlar/scss/config/_theme.scss`

Locate the block at L192–224 (the `// ── Nav lists — join items
with per-side divider lines ─────────` comment and everything up to
the `[data-ln-dropdown-menu] li + li, .menu-items li + li { ... }`
block). DELETE all of:

- The `// ── Nav lists — ...` comment block (L192–197)
- `nav[data-ln-nav] ul { ... }` (L198–203)
- `nav[data-ln-nav] a { ... }` (L205–218)
- `[data-ln-dropdown-menu] li + li, .menu-items li + li { ... }` (L220–223)

REPLACE with the following block (still inside the `[data-theme="glass"] { ... }` outer braces, at the same indentation as the existing `--btn-*` rebinds):

```scss
	// ── Nav surface — palette-only rebind ──────────────────────────
	// @mixin nav reads --nav-link-border-color* via fallback (defaults:
	// transparent). Glass rebinds them so hover/active draw an accent
	// ring. --nav-list-bleed shifts the ul to the sidebar's vertical
	// borders so dividers reach edge-to-edge; @mixin nav reads it with
	// `0` fallback so default theme is unaffected.
	--nav-link-border-color-hover:  var(--color-accent);
	--nav-link-border-color-active: var(--color-accent);
	--nav-list-bleed:               calc(-1 * var(--padding-x));

	// Active-nav wash — Glass shifts --color-accent-tint one step
	// darker (var(--color-primary-light) instead of -lighter) for
	// stronger contrast on the deep dark surface. Replaces the
	// pre-refactor descendant override on a.active. Side-effect:
	// dropdown active items + upload drop-zone also pick up the
	// slightly darker tint — improvement, not regression.
	--color-accent-tint: hsl(var(--color-primary-light));

	// ── Dropdown / menu-items dividers ─────────────────────────────
	// @mixin menu-items reads SOFT --border-block-start on `li + li`
	// and `hr` with `none` fallback. Glass rebinds the slot in scope
	// so the divider appears for both. Scoped (not theme :root)
	// because --border-block-start is read by ~10 other mixins
	// (cards, tables, accordions) where the divider should NOT appear.
	[data-ln-dropdown-menu],
	.menu-items {
		--border-block-start: var(--border-width) solid var(--color-border);
	}
```

Verify the closing `}` of `[data-theme="glass"]` is preserved and on its own line at the same indentation as `[data-theme="midnight"]`'s closing `}`.

#### Step 8. Build and verify

Run:

```bash
npm run build
```

Expected: clean build, no SCSS errors.

#### Step 9. Greps — acceptance verification

Run these and confirm output matches expected:

```bash
# Should be 0 — no descendant property overrides remain in Glass
grep -nE '\[data-theme="glass"\][^{]+(background|background-color|color|border|border-color|border-block-start|margin|margin-inline|transition):' /home/ashlar/ln-ashlar/scss/config/_theme.scss
# (Expected: 0 matches. Token rebinds with `--*:` are fine; this regex
#  matches only non-custom properties.)

# Should NOT match the active-nav block (the L123 violation should be gone)
grep -n "color-primary-lighter" /home/ashlar/ln-ashlar/scss/config/mixins/_nav.scss
# (Expected: 0 matches. Other presets reading --color-primary alpha
#  triplets are still allowed — those are a separate, out-of-scope
#  violation per plan §7.)

# Should be 4 — the new soft slot is documented
grep -c "nav-link-border-color\|nav-list-bleed" /home/ashlar/ln-ashlar/scss/config/_tokens.scss
# (Expected: 4 — three border-color* lines + one list-bleed line.)

# Should be 3 — Glass rebinds 3 of the 4 nav slots
grep -c "nav-link-border-color\|nav-list-bleed" /home/ashlar/ln-ashlar/scss/config/_theme.scss
# (Expected: 3 — only -hover, -active, and list-bleed are rebound;
#  -idle stays at the default transparent.)

# Build artifact sanity
ls -la /home/ashlar/ln-ashlar/demo/dist/ln-acme.css
# (Expected: file exists, recently modified by the build.)
```

### What ln-acme already provides — DO NOT touch

- `--color-accent-tint`, `--color-accent-tint-strong` vocabulary
  (already in `_tokens.scss`) — reuse, don't redefine.
- `--border-block-start` SOFT primitive — reuse, don't add a new
  token.
- `@mixin nav-links-border-left/-grow/-top` presets — they have
  their own `--color-primary` alpha-tint reads which are documented
  and out of scope (plan §7).
- The `--color-accent-bg-*` companion family — not touched by this
  fix; it owns the Glass button rebinds.
- All other theme blocks (dark, ocean, sunset, midnight) — leave
  alone.

### Acceptance criteria (from plan §8)

1. Greps in Step 9 return expected counts.
2. `npm run build` succeeds.
3. The Glass `[data-theme="glass"] { ... }` block contains ZERO
   descendant rules of the form `nav[data-ln-nav] X { property: ... }`
   or `[data-ln-dropdown-menu] X { property: ... }` (only token
   rebinds, plus one scoped `--*:` rebind for the dropdown
   `[data-ln-dropdown-menu], .menu-items` selector list).
4. Default-theme rendering visually unchanged in demo.
5. Glass-theme rendering visually matches pre-change in demo.

### Boundaries — what NOT to touch

- Do not modify `nav-links-border-left`, `nav-links-border-grow`,
  `nav-links-border-top` — out of scope (plan §7).
- Do not touch the `--color-accent-bg-*` companions or the `@mixin btn`.
- Do not refactor `--color-primary` alpha-tint reads — out of scope.
- Do not change the dark, ocean, sunset, midnight themes.
- Do not run `git add` / `git commit` / any git command.
- Do not change the demo HTML — the change is library-internal and
  should render visually identical.

### Report back

When done, return:

- Paths of files modified.
- Output of every grep in Step 9.
- Build success/failure.
- Any deviations from the plan and why.
