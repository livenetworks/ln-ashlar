---
name: theming
classification: css
status: draft
domain: frontend
summary: Dark mode and theming architecture through vocabulary rebinding, surface elevation ladders, and system preference detection.
source: theme/config/_theme.scss
tags: [theming, dark-mode, colors, tokens]
---

# 🌓 theming

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` theming system enables Dark Mode and customized brand palettes by rebinding **Vocabulary Tokens** at the `:root` or container scope, without altering any mixin bodies:
- **Surface Elevation Inversion:** In dark mode, elevated surfaces become *lighter* (`--bg-elevated: hsl(220 16% 17%)`) than the root canvas (`--bg-base: hsl(220 16% 13%)`), while recessed areas (`--bg-recessed: hsl(220 16% 9%)`) become darker.
- **Activation Paths:**
  1. Explicit user override: `<html data-theme="dark">` or `<html data-theme="light">`.
  2. Automatic system preference: `@media (prefers-color-scheme: dark)` when no explicit attribute is set.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<html lang="en" data-theme="dark">
    <body>
        <div class="card">
            <h3>Dark Mode Card</h3>
            <p>Surface cascades automatically.</p>
        </div>
    </body>
</html>
```

### Variant 1: Scoped Container

```html
<section data-theme="dark" class="card">
    <h3>Dark Preview Box</h3>
</section>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `ln-dark-tokens` | mixin | — | Mixin applying dark mode neutral scale and vocabulary overrides |
| `data-theme="dark"` | token | attribute value | Activates dark mode vocabulary ladder |
| `data-theme="light"` | token | attribute value | Forces light mode vocabulary ladder |
| `--bg-base` | token | color | Base canvas surface (inverted in dark mode) |
| `--bg-elevated` | token | color | Raised card surface (lighter than canvas in dark mode) |
| `--bg-hover` | token | color | Neutral hover state (hsl(220 16% 20%) in dark mode) |
| `--bg-active` | token | color | Neutral active state (hsl(220 16% 24%) in dark mode) |
| `--color-scrim` | token | color | Modal backdrop overlay color |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Invert Neutral Tokens Manually:** Never rely on raw `--color-neutral-100` for backgrounds, as it inverts to dark grey in dark mode. Always use `--bg-base` or `--bg-elevated`.
> 2. **Contrast Invariants:** Status colors (`success`, `warning`, `error`, `info`) maintain strict WCAG AA contrast against both light and dark surface vocabularies.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 3-layer design tokens.
- [`density`](./density.md) — Density tiers.
- [`cards`](./cards.md) — Surface elevation and card styling.
