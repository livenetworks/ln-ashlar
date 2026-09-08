---
name: tokens
classification: css
status: active
domain: frontend
summary: Layered design token architecture (Brand, Scale, Vocabulary, Primitives) managing colors, spacing, radius, typography, and shadows.
source: theme/config/_tokens.scss, theme/config/_palette.scss, theme/config/_theme.scss
tags: [tokens, css-variables, theme, foundations, brand]
---

# 🎨 tokens

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` design token architecture lives within the **Visual Theme Layer** (`ln-ashlar-theme.css` / `theme/config/_tokens.scss`, `_palette.scss`, and `_theme.scss`). 

> [!NOTE]
> The **Core Functional Layer** (`ln-ashlar-core.css`) is completely **token-free** (zero colors, zero typography, zero theme variables). Tokens only govern the visual presentation layer.

Within the theme system, design values flow through four strictly defined layers (see [`scss-architecture`](../doctrine/scss-architecture.md) for the complete doctrine):

```
1. Brand Tokens          ->  --brand-primary: 221 83% 48%; --brand-secondary: 160 84% 36%;
                             (Bare HSL numbers; enables slash-syntax alpha opacity composition)
            ↓
2. Scale Tokens          ->  --size-md: 1rem; --color-neutral-100: 220 14% 96%; --color-success: 142 76% 36%;
                             (Back-end scale plumbing; NEVER read directly inside mixin bodies)
            ↓ wired at theme scope (ln-values-light / ln-values-dark)
3. Vocabulary Tokens     ->  --bg-base, --bg-elevated, --bg-sunken, --bg-recessed,
                             --fg-default, --fg-muted, --border-subtle, --shadow-resting,
                             --text-title-md, --lh-title-md
                             (Named semantic design intent; rebound at theme :root, [data-skin], [data-mode], or [data-theme])
            ↓ primitives declared in the base-defaults block at
            ↓ :root, [data-mode], [data-theme], [data-skin]
            ↓ (ln-color-chain separately derives --color-primary/-secondary
            ↓  and the colour-aware shadows at :root, [data-mode], [data-theme])
4. Primitive Tokens      ->  re-derived at every axis (base-defaults block, _palette.scss):
                               --color-bg, --color-fg, --color-border, --shadow, --radius
                             root-only, substituted once at <html> (_tokens.scss :root):
                               --padding-x, --padding-y, --gap, --font-size, --line-height
                               (also rebound by [data-density] scopes and :root media queries)
                             (The ONLY tokens mixin bodies read and consume)
```

### Architectural Contract:
- **Values vs. Derivation Split:** Theme-specific values (`ln-values-light`, `ln-values-dark`) are shipped at zero specificity via `:where()`. `ln-color-chain` re-evaluates the semantic colours and colour-aware shadows at `:root`, `[data-mode]`, and `[data-theme]`; the primitives are re-derived by the base-defaults block, which adds `[data-skin]` as a fourth axis.
- **Mixins Read Primitives Only:** Mixin bodies reference `--color-bg`, `--color-fg`, `--color-border`, `--shadow`, `--padding-x`, `--padding-y`, and `--gap`. They never reference `--bg-*` or `--size-*` directly.
- **Components Rebind Primitives:** Custom components rebind the primitive on their local scope to select a vocabulary role (e.g. `.card-sunken { --color-bg: var(--bg-sunken); }`).
- **Relational Roles vs. Elevation Ladder:** `--bg-*` tokens represent **relational roles whose tonal direction is theme-defined**, not a static monotonic elevation ladder:
  - **Light mode is flat by design:** Nested surfaces are separated by **shadow** (`--shadow-resting`, `--shadow-floating`), not tone (`--bg-elevated` equals `--bg-base`).
  - **Dark mode uses tonal elevation:** Dark grounds cannot use shadows effectively, so surfaces separate by **lightness** (`--bg-elevated` is 18% vs `--bg-base` 12%).
  - `--bg-sunken` is darker than base in light mode (96% vs 100%), but **lighter** than base in dark mode (21% vs 12%). This prevents sunken inputs from punching through the card down to the 8% app-shell ground — which is why both polarities bind form fields directly to `--bg-sunken` rather than letting them fall through to `--bg-recessed`.
  - **Both polarities bind to the neutral ramp.** No `--bg-*` / `--fg-*` / `--border-*` token is a hand-tuned literal in either value mixin, so rebinding `--color-neutral-*` moves light and dark together.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="card">
    <header>
        <h3>Token Architecture Example</h3>
    </header>
    <p>Primitives cascade automatically across light and dark modes.</p>
</div>
```

### Variant 1: Scoped Override via Primitive Rebind

```html
<!-- Rebinding primitives locally to select vocabulary roles -->
<aside style="--color-bg: var(--bg-sunken); --color-border: var(--border-strong);">
    <p>Custom sunken surface with strong border.</p>
</aside>
```

### Variant 2: SCSS Mixin Primitive Override

```scss
// In custom component stylesheet:
#audit-log-panel {
    @include card;
    --color-bg: var(--bg-recessed);
    --color-border: hsl(var(--color-neutral-300));
    --padding-x: var(--size-lg);
    --padding-y: var(--size-md);
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

<!-- sync:css-tokens:start -->
| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| **Brand & Status Triplets (Bare HSL)** | | | |
| `--brand-primary` | token | `221 83% 48%` | Primary brand bare HSL triplet |
| `--brand-secondary` | token | `160 84% 36%` | Brand secondary accent bare HSL triplet |
| `--color-success` | token | `142 76% 36%` | Success status bare HSL triplet |
| `--color-error` | token | `0 84% 48%` | Error status bare HSL triplet |
| `--color-warning` | token | `32 95% 38%` | Caution status bare HSL triplet |
| `--color-info` | token | `200 95% 38%` | Info status bare HSL triplet |
| **Vocabulary Tokens (Light vs. Dark)** | | | |
| `--bg-base` | token | `hsl(var(--color-white)) (light) / hsl(var(--color-neutral-100)) (dark)` | Base canvas background |
| `--bg-elevated` | token | `var(--bg-base) (light) / hsl(var(--color-neutral-150)) (dark)` | Raised card background |
| `--bg-sunken` | token | `hsl(var(--color-neutral-100)) (light) / hsl(var(--color-neutral-175)) (dark)` | Static sunken well and table header fill (flips lighter in dark) |
| `--bg-recessed` | token | `hsl(var(--color-neutral-50)) (light) / hsl(var(--color-neutral-50)) (dark)` | Recessed ground and input fill |
| `--bg-hover` | token | `hsl(var(--color-neutral-100)) (light) / hsl(var(--color-neutral-175)) (dark)` | Neutral interactive hover background |
| `--bg-active` | token | `hsl(var(--color-neutral-150)) (light) / hsl(var(--color-neutral-200)) (dark)` | Neutral interactive active/pressed background |
| `--fg-default` | token | `hsl(var(--color-neutral-900)) (light) / hsl(var(--color-neutral-900)) (dark)` | High-contrast primary text |
| `--fg-muted` | token | `hsl(var(--color-neutral-500)) (light) / hsl(var(--color-neutral-500)) (dark)` | Muted secondary text and captions |
| `--fg-subtle` | token | `hsl(var(--color-neutral-400)) (light) / hsl(var(--color-neutral-400)) (dark)` | Subtle secondary text |
| `--border-subtle` | token | `hsl(var(--color-neutral-200)) (light) / hsl(var(--color-neutral-175)) (dark)` | Subtle separator border |
| `--border-strong` | token | `hsl(var(--color-neutral-300)) (light) / hsl(var(--color-neutral-300)) (dark)` | Focused and high-contrast border |
| **Interaction State Tokens** | | | |
| `--tint-hover` | token | `7%` | Accent-wash ratio for interactive hover |
| `--tint-selected` | token | `12%` | Accent-wash ratio for selected items |
| `--tint-active` | token | `14%` | Accent-wash ratio for active/pressed items |
| `--color-accent-tint` | token | `var(--brand-primary-tint, color-mix(in srgb, hsl(var(--color-primary)) 8%, var(--bg-base)))` | Computed light accent wash |
| `--color-accent-tint-strong` | token | `var(--brand-primary-tint-strong, color-mix(in srgb, hsl(var(--color-primary)) 16%, var(--bg-base)))` | Computed strong accent wash |
| **Spacing Scale Primitives** | | | |
| `--size-2xs` | token | `0.125rem` | 2px spacing step |
| `--size-xs` | token | `0.25rem` | 4px spacing step |
| `--size-xs-up` | token | `0.375rem` | 6px spacing step |
| `--size-sm` | token | `0.5rem` | 8px spacing step |
| `--size-sm-up` | token | `0.75rem` | 12px spacing step |
| `--size-md` | token | `1rem` | 16px base spacing step |
| `--size-md-up` | token | `1.25rem` | 20px spacing step |
| `--size-lg` | token | `1.5rem` | 24px spacing step |
| `--size-xl` | token | `2rem` | 32px spacing step |
| `--size-2xl` | token | `3rem` | 48px spacing step |
| `--size-3xl` | token | `4rem` | 64px spacing step |
| **Radii & Dimensions** | | | |
| `--radius-xs` | token | `0.125rem` | 2px border radius |
| `--radius-sm` | token | `0.25rem` | 4px border radius |
| `--radius-md` | token | `0.375rem` | 6px border radius |
| `--radius-lg` | token | `0.5rem` | 8px border radius |
| `--radius-xl` | token | `0.75rem` | 12px border radius |
| `--radius-2xl` | token | `1rem` | 16px border radius |
| `--radius-full` | token | `9999px` | Pill / circular radius |
| `--border-width` | token | `1px` | Standard 1px border stroke |
| `--border-width-strong` | token | `2px` | Thick 2px border stroke |
| **Typography Primitives & Scale** | | | |
| `--font-size` | token | `var(--text-body-md)` | Default body font size primitive |
| `--line-height` | token | `var(--lh-body-md)` | Default line height primitive |
| `--text-heading-lg` | token | `1.75rem` | Large heading font size |
| `--text-heading-md` | token | `1.25rem` | Medium heading font size |
| `--text-title-md` | token | `1rem` | Title / card header font size |
| `--text-body-md` | token | `0.875rem` | Primary body font size (14px) |
| `--text-caption` | token | `0.75rem` | Small caption font size (12px) |
| **Z-Index Layer Scale** | | | |
| `--z-sticky` | token | `10` | Sticky elements |
| `--z-dropdown` | token | `20` | Dropdown menus (non-top-layer fallback) |
| `--z-overlay` | token | `30` | Backdrop overlays |
| `--z-modal` | token | `40` | Modal dialogs (non-top-layer fallback) |
| `--z-toast` | token | `50` | Toast notification stack |
| **Logical Primitives (What Mixins Read)** | | | |
| `--color-bg` | token | `var(--bg-base)` | Active surface background |
| `--color-fg` | token | `var(--fg-default)` | Active text color |
| `--color-border` | token | `var(--border-subtle)` | Active border color |
| `--shadow` | token | `var(--shadow-resting)` | Active surface elevation shadow |
| `--padding-x` | token | `var(--size-sm-up)` | Horizontal padding primitive |
| `--padding-y` | token | `var(--size-xs)` | Vertical padding primitive |
| `--gap` | token | `var(--size-xs-up)` | Layout gap primitive |
| `--radius` | token | `var(--radius-md)` | Component corner radius primitive |
<!-- sync:css-tokens:end -->

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Surface Semantics & The Flip Invariant:** `--bg-sunken` is darker than `--bg-base` in light mode (96% vs 100%), but **lighter** than `--bg-base` in dark mode (20% vs 13%). In dark mode, `--bg-base` is 13% and the page ground is 9%; stepping downwards for a sunken well would land directly on the ground color, punching a hole through the card.
> 2. **Ground Disappearance (`--bg-recessed`):** `--bg-recessed` matches the page ground in both themes. Placing a recessed component (like a chip or progress bar) directly onto the app shell ground without an enclosing card makes it appear boundary-less.
> 3. **Direct Scale Reaching is Forbidden:** Never read `--size-*` or raw HSL values directly inside a mixin body. Always read primitives (`--padding-x`, `--color-bg`) so themes, region overrides, and density modes cascade properly.
> 4. **Bare HSL Triplets:** Brand and status colors must remain bare triplets (no `hsl()`) to allow slash-syntax alpha composition (`hsl(var(--brand-primary) / 0.15)`).
> 5. **Interaction State Ratio Tokens:** Neutral interaction states are vocabulary entries (`--bg-hover`, `--bg-active`), whereas accent-derived states are ratio literals (`--tint-hover: 7%`). Do not pre-resolve accent hovers with `color-mix()` at `:root`, or they will freeze and break dynamic status cascades (`.success`, `.error`, `.warning`, `.info`).

---

## 5. Related Documents

- [`theming`](./theming.md) — Dark mode, scoped theme islands, presets, and `brand.css`.
- [`mixins`](./mixins.md) — Comprehensive SCSS mixin index and inclusion patterns.
- [`density`](./density.md) — Density tiers (`compact`, `spacious`) and runtime scaling.
- [`scss-architecture`](../doctrine/scss-architecture.md) — Governing architecture doctrine and multi-tier stylesheet distribution.
