---
name: density
classification: css
status: active
domain: frontend
summary: Inverted density system scaling spacing, typography, control heights, and table row heights via data-density attribute.
source: theme/config/_density.scss
tags: [density, spacing, typography, compact, comfortable, spacious, wcag]
---

# 📏 density

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` density architecture (`theme/config/_density.scss`) scales the information density of the UI without altering color semantics or layout structures:

- **Inverted Default (Dense Base):** The default `:root` state is dense (14px body, 52px header, 232px sidebar).
- **Scale Upward via `[data-density]`:** Density scales upward into roomier tiers: `comfortable` and `spacious`.
- **Cascade-Driven Token Rebinds:** Density does not introduce parallel `--density-*` scales (except `--density-row-h`). It directly rebinds base spacing (`--padding-y`, `--gap`), typography roles (`--text-body-*`, `--text-heading-*`), and control heights (`--btn-padding-y`, `--input-padding-y`).
- **WCAG Target Size Invariant:**
  - Base / `compact`: ~38px control height (WCAG 2.5.5 Level AA compliant).
  - `comfortable`: ≥46px control height (WCAG 2.5.5 Level AAA compliant).
  - `spacious`: ≥54px control height (enhanced touch targets for kiosks/accessibility).
- **Explicit Scoping:** Works at any DOM boundary (`<html data-density="spacious">` or `<table data-density="compact">`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Root Comfortable Density)

```html
<html lang="en" data-density="comfortable">
    <body>
        <main class="app-main">
            <section class="app-content-wrapper">
                <h2>Settings</h2>
                <p>Comfortable spacing with larger body text.</p>
            </section>
        </main>
    </body>
</html>
```

### Variant 1: Scoped Compact Table in Comfortable Page

```html
<div class="card">
    <header>
        <h3>Audit Logs</h3>
    </header>
    <!-- Scoped compact density on the data grid only -->
    <table data-density="compact" class="table">
        <thead>
            <tr><th>Timestamp</th><th>Action</th><th>User</th></tr>
        </thead>
        <tbody>
            <tr><td>2026-09-01 10:00</td><td>Login</td><td>Admin</td></tr>
        </tbody>
    </table>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `data-density="compact"` | attribute | — | Explicit dense base (36px row height, 14px body) |
| `data-density="comfortable"` | attribute | — | Roomier typography (16px body) and larger padding |
| `data-density="spacious"` | attribute | — | Generous kiosk / touch density with 54px control targets |
| `--density-row-h` | token | `2.25rem` (compact) / `2.75rem` (comfortable) / `3.25rem` (spacious) | Minimum table row height floor |
| `--app-header-height` | token | `3.25rem` (compact) / `3.75rem` (comfortable) / `4.5rem` (spacious) | Density-reactive app header height |
| `--app-sidebar-width` | token | `14.5rem` (compact) / `16rem` (comfortable) / `18rem` (spacious) | Density-reactive sidebar width |
| `--btn-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) / `var(--size-sm-up)` (spacious) | Button vertical padding |
| `--input-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) / `var(--size-sm-up)` (spacious) | Input control vertical padding |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Density Never Changes Color Semantics:** Density tiers rebind only geometric and typographic properties. Colors, shadows, and borders remain identical across density modes.
> 2. **Do Not Switch Density by Viewport:** Density is an explicit user preference toggle, not a viewport breakpoint mechanism. Responsive viewport changes are handled via `@container` and `@media`.
> 3. **Preserve Explicit `--font-size` Rebinds:** When creating custom form controls, always read `var(--font-size)` and `var(--line-height)` rather than hardcoding rem units so the control scales across density modes.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Spacing and typography scale tokens.
- [`theming`](./theming.md) — Dark mode and theme island interactions.
- [`tables`](./tables.md) — Data table row density and scrolling.
- [`forms`](./forms.md) — Form controls and button height scaling.
- [`scss-architecture`](../doctrine/scss-architecture.md) — SCSS design system architecture.
