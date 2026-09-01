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

The `ln-ashlar` theming system enables Dark Mode, custom client branding (`brand.css`), named theme presets (`ocean`, `sunset`, `midnight`, `glass`), and arbitrary **Scoped Theme Islands** by decoupling raw theme **values** (`_palette.scss`) from the unified **derivation chain** (`_theme.scss`):

- **Scoped Theme Islands:** Any element at any DOM depth can declare `data-theme="dark"` (or `data-theme="light"` / named preset), and all descendant elements render fully in that theme — including background, text, borders, shadows, buttons, and hover/active states — without requiring component-specific overrides.
- **Surface Elevation Inversion:** In dark mode, elevated surfaces become *lighter* (`--bg-elevated: hsl(220 16% 17%)`) than the root canvas (`--bg-base: hsl(220 16% 13%)`), while recessed areas (`--bg-recessed: hsl(220 16% 9%)`) become darker. In light mode, surfaces are flat by design and separated by shadow.
- **Zero-Specificity Values (`:where()`):** Ashlar's default values are declared with `:where(:root)` and `:where([data-theme="..."])` (specificity 0,0,0). A consumer's `brand.css` at `[data-theme="dark"]` (0,1,0) always wins, regardless of stylesheet loading order.
- **Computed Accent Tints:** `--color-accent-tint` and `--color-accent-tint-strong` are computed dynamically via `color-mix()` against the local `--bg-base`.
- **Activation Paths:**
  1. Root level override: `<html data-theme="dark">` or `<html data-theme="light">`.
  2. Scoped island: `<header data-theme="dark">`, `<section data-theme="dark">`, or `<aside data-theme="light">`.
  3. Automatic system preference: `@media (prefers-color-scheme: dark)` when no explicit root attribute is set.
- **Brand.css Integration:** Custom brand tokens are injected by declaring bare HSL triplets on `:root` and `[data-theme="dark"]` in a client stylesheet, without editing library sources.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Root Dark Mode)

```html
<html lang="en" data-theme="dark">
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
<header data-theme="dark" class="app-header">
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
<section data-theme="dark" class="card">
    <h3>Dark Container</h3>
    <!-- Nested Light Island -->
    <div data-theme="light" class="card">
        <h3>Clean White Island</h3>
    </div>
</section>
```

### Variant 3: Client Brand Customization (`brand.css`)

```css
/* brand.css - overrides brand tokens with zero specificity conflict */
:root,
[data-theme="light"] {
    --brand-primary:   215 85% 45%;
    --brand-secondary: 195 35% 35%;
}

[data-theme="dark"] {
    --brand-primary:   215 90% 65%;
    --brand-secondary: 195 30% 70%;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

<!-- sync:css-tokens:start -->
| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `ln-values-light` | mixin | — | Injects default light mode neutral scale, status tints, and vocabulary |
| `ln-values-dark` | mixin | — | Injects dark mode inverted neutral scale, status tints, and vocabulary |
| `ln-color-chain` | mixin | — | Evaluates semantic colors, shadows, and computed accent tints at `:root` & `[data-theme]` |
| `data-theme="dark"` | attribute | — | Activates dark mode vocabulary and color chain |
| `data-theme="light"` | attribute | — | Forces light mode vocabulary and color chain |
| `data-theme="ocean"` | attribute | — | Oceanic teal accent preset (`--brand-primary: 190 80% 35%`) |
| `data-theme="sunset"` | attribute | — | Sunset warm coral accent preset (`--brand-primary: 10 80% 50%`) |
| `data-theme="midnight"` | attribute | — | Midnight deep purple dark preset (`--brand-primary: 265 70% 60%`) |
| `data-theme="glass"` | attribute | — | Glass luminous flat dark preset (`--brand-primary: 218 95% 62%`) |
| `--brand-primary` | token | `221 83% 48%` | Primary brand color bare HSL triplet |
| `--brand-secondary` | token | `160 84% 36%` | Secondary brand color bare HSL triplet |
| `--bg-base` | token | `hsl(var(--color-white)) (light) / hsl(220 16% 13%) (dark)` | Base canvas background |
| `--bg-elevated` | token | `var(--bg-base) (light) / hsl(220 16% 17%) (dark)` | Elevated card surface (flat in light, +4% in dark) |
| `--bg-sunken` | token | `hsl(var(--color-neutral-100)) (light) / hsl(220 16% 20%) (dark)` | Sunken well surface (darker in light, +7% in dark) |
| `--bg-recessed` | token | `hsl(var(--color-neutral-50)) (light) / hsl(220 16% 9%) (dark)` | Page ground and recessed fill (darker in both themes) |
| `--fg-default` | token | `hsl(var(--color-neutral-900)) (light) / hsl(0 0% 95%) (dark)` | Primary text color |
| `--fg-muted` | token | `hsl(var(--color-neutral-500)) (light) / hsl(220 10% 68%) (dark)` | Muted text color |
<!-- sync:css-tokens:end -->

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Invert Neutral Tokens Manually:** Never rely on raw `--color-neutral-100` for backgrounds, as it inverts to dark grey in dark mode. Always use `--bg-base` or `--bg-elevated`.
> 2. **R6 — Scoped Themes Carry Colors and Shadows Only:** Structural dimensions, typography scale, and `--radius-*` remain root-level invariants and do not follow scoped theme islands.
> 3. **R7 — Presets Include Value Mixin:** Any custom or named preset must `@include ln-values-light` or `@include ln-values-dark` to declare its surface family, preventing accidental inheritance of ancestor surface tokens.
> 4. **Bare Triplets Requirement in Brand.css:** When customizing brand colors in `brand.css`, always provide bare HSL triplets (e.g. `215 85% 45%`), never `hsl(...)`, so that alpha transparency composition continues to work.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 4-layer design tokens and brand architecture.
- [`density`](./density.md) — Density tiers and runtime scaling.
- [`cards`](./cards.md) — Surface elevation and card styling.
- [`scss-architecture`](../doctrine/scss-architecture.md) — SCSS design system architecture and theming doctrine.
