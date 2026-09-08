---
name: theming
classification: css
status: active
domain: frontend
summary: Dark mode, scoped theme islands, preset themes, and brand token overrides via vocabulary rebinding and load-order-independent derivations.
source: theme/config/_theme.scss
tags: [theming, dark-mode, colors, tokens, brand, scoped-theme]
---

# 🌓 theming

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` theming system enables Dark Mode, custom client branding (`brand.css`), named theme presets (`ocean`, `sunset`, `midnight`, `glass`), and arbitrary **Scoped Mode/Theme Islands** by decoupling raw theme **values** (`_palette.scss`) from the unified **derivation chain** (`_theme.scss`):

- **Scoped Mode/Theme Islands:** Any element at any DOM depth can declare `data-mode="dark"` (polarity) or `data-theme="glass"` (palette). Descendant elements render fully in that axis — including background, text, borders, shadows, buttons, and hover/active states — without requiring component-specific overrides.
- **Surface Elevation Inversion:** In dark mode, elevated surfaces become *lighter* (`--bg-elevated: hsl(var(--color-neutral-150))`, 18%) than the root canvas (`--bg-base: hsl(var(--color-neutral-100))`, 12%), while recessed areas (`--bg-recessed: hsl(var(--color-neutral-50))`, 8%) become darker. In light mode, surfaces are flat by design and separated by shadow. Both polarities bind to the neutral ramp, so rebinding `--color-neutral-*` moves them together.
- **Zero-Specificity Values (`:where()`):** Ashlar's default values are declared with `:where(:root)` and `:where([data-mode="..."])` (specificity 0,0,0). A consumer's `brand.css` at `:root` (0,1,0) always wins, regardless of stylesheet loading order.
- **Computed Accent Tints:** `--color-accent-tint` and `--color-accent-tint-strong` are computed dynamically via `color-mix()` against the local `--bg-base`.
- **Activation Paths:**
  1. Root level override: `<html data-mode="dark">`, `<html data-theme="glass">`, or `<html data-skin="glass">`.
  2. Scoped island: `<header data-mode="dark">` or `<section data-theme="sunset">`.
  3. Automatic system preference: `@media (prefers-color-scheme: dark)` when no explicit root polarity attribute is set.
  4. Structural activation: `<html data-skin="glass">` globally applies structural overrides like flatter radii and shadows. A skin can also be scoped to an island (`<section data-skin="glass">`): `[data-skin]` is one of the four axes in the base-defaults block, so `--radius` and the colour primitives re-derive there. Root-level scales the skin rebinds directly (`--radius-*`, `--shadow-*`) still resolve on the skin element itself — see R6 for what does and does not follow an island.
- **Brand.css Integration:** Custom brand tokens are injected by declaring bare HSL triplets on `:root` in a client stylesheet, without editing library sources. Brand is polarity-free — one declaration serves both modes.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Root Dark Mode)

```html
<html lang="en" data-mode="dark">
    <body>
        <div class="card">
            <h3>Dark Mode Card</h3>
            <p>Surface and all primitives cascade automatically.</p>
        </div>
    </body>
</html>
```

### Variant 1: Scoped Dark Island in Light Page

```html
<header data-mode="dark" class="app-header">
    <nav class="nav">
        <ul class="nav-list">
            <li><a href="#" class="nav-link active">Dashboard</a></li>
        </ul>
    </nav>
    <button type="submit" class="btn">Dark Button</button>
</header>
```

### Variant 2: Nested Inverse Island (Light inside Dark)

```html
<section data-mode="dark" class="card">
    <h3>Dark Container</h3>
    <!-- Nested Light Island -->
    <div data-mode="light" class="card">
        <h3>Clean White Island</h3>
    </div>
</section>
```

### Variant 3: Client Brand Customization (`brand.css`)

```css
/* brand.css - overrides brand tokens with zero specificity conflict */
:root {
    --brand-primary:   215 85% 45%;
    --brand-secondary: 195 35% 35%;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

<!-- sync:css-tokens:start -->
| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `ln-values-light` | mixin | — | Injects default light mode neutral scale, status tints, and vocabulary |
| `ln-values-dark` | mixin | — | Injects dark mode inverted neutral scale, status tints, and vocabulary |
| `ln-color-chain` | mixin | — | Evaluates semantic colors, shadows, and computed accent tints at `:root`, `[data-theme]`, `[data-mode]` |
| `data-mode="dark"` | attribute | — | Activates dark polarity (bg/fg base values + native color-scheme) |
| `data-mode="light"` | attribute | — | Forces light polarity vocabulary and color-scheme |
| `data-theme="ocean"` | attribute | — | Oceanic teal brand palette preset (`--brand-primary: 190 80% 35%`) |
| `data-theme="sunset"` | attribute | — | Sunset warm coral brand palette preset (`--brand-primary: 10 80% 50%`) |
| `data-theme="midnight"` | attribute | — | Midnight deep purple brand palette preset (`--brand-primary: 265 70% 60%`); pair with `data-mode="dark"` |
| `data-theme="glass"` | attribute | — | Glass luminous blue brand palette preset (`--brand-primary: 218 95% 62%`) |
| `data-skin="glass"` | attribute | — | Glass structural preset — flat radius/shadow, translucent button chrome, accent nav/menu rebinds. Polarity-agnostic |
| `--brand-primary` | token | `221 83% 48%` | Primary brand color bare HSL triplet |
| `--brand-secondary` | token | `160 84% 36%` | Secondary brand color bare HSL triplet |
| `--bg-base` | token | `hsl(var(--color-white)) (light) / hsl(var(--color-neutral-100)) (dark)` | Base canvas background |
| `--bg-elevated` | token | `var(--bg-base) (light) / hsl(var(--color-neutral-150)) (dark)` | Elevated card surface (flat in light, +6% in dark) |
| `--bg-sunken` | token | `hsl(var(--color-neutral-100)) (light) / hsl(var(--color-neutral-175)) (dark)` | Sunken well surface (darker in light, +9% in dark) |
| `--bg-recessed` | token | `hsl(var(--color-neutral-50)) (light) / hsl(var(--color-neutral-50)) (dark)` | Page ground and recessed fill (darker in both themes) |
| `--fg-default` | token | `hsl(var(--color-neutral-900)) (light) / hsl(var(--color-neutral-900)) (dark)` | Primary text color |
| `--fg-muted` | token | `hsl(var(--color-neutral-500)) (light) / hsl(var(--color-neutral-500)) (dark)` | Muted text color |
<!-- sync:css-tokens:end -->

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Invert Neutral Tokens Manually:** Never rely on raw `--color-neutral-100` for backgrounds, as it inverts to dark grey in dark mode. Always use `--bg-base` or `--bg-elevated`.
> 2. **R6 — What Follows a Scoped Island, and What Does Not:** The colour primitives
>    (`--color-bg`, `--color-fg`, `--color-border`, `--shadow`) and `--radius` are
>    declared in the four-axis base-defaults block in `_palette.scss`, so they
>    re-derive at `:root`, `[data-mode]`, `[data-theme]`, and `[data-skin]` — a
>    scoped `<section data-skin="glass">` genuinely flattens its descendants.
>    `--padding-x`, `--padding-y`, `--gap`, `--font-size` and `--line-height` are
>    declared at `_tokens.scss :root` (rebound only by `:root` media queries and by
>    `[data-density]` scopes), so they substitute once and inherit frozen: a
>    `[data-mode]` / `[data-theme]` / `[data-skin]` island does **not** move them.
>    The `--size-*`, `--text-*` and `--lh-*` scales are likewise root-level.
> 3. **R7 — Presets Are Palette-Only; Never Include a Value Mixin:** A
>    `[data-theme]` preset declares brand tokens and nothing else. It must NOT
>    `@include ln-values-light` / `ln-values-dark`: that would force a polarity onto
>    a palette-only axis (a `<section data-theme="ocean">` inside a dark page would
>    snap to light surfaces), and it would re-declare every literal in the mixin on
>    that element, clobbering whatever an ancestor axis had set. A nested island
>    inheriting its ancestor's surfaces is the intended behaviour, not a leak — see
>    the Declaration-Site Invariant in `scss-architecture`. (Supersedes the earlier
>    R7, which was authored but never implemented.)
> 4. **Bare Triplets Requirement in Brand.css:** When customizing brand colors in `brand.css`, always provide bare HSL triplets (e.g. `215 85% 45%`), never `hsl(...)`, so that alpha transparency composition continues to work.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 4-layer design tokens and brand architecture.
- [`density`](./density.md) — Density tiers and runtime scaling.
- [`cards`](./cards.md) — Surface elevation and card styling.
- [`scss-architecture`](../doctrine/scss-architecture.md) — SCSS design system architecture and theming doctrine.
