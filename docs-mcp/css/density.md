---
name: density
classification: css
status: active
domain: frontend
summary: Density system scaling type roles, spacing, control heights, and card/table padding via the data-density attribute.
source: theme/config/_density.scss
tags: [density, spacing, typography, compact, comfortable, spacious, wcag]
---

# 📏 density

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` density architecture (`theme/config/_density.scss`) scales the information density of the UI without altering color semantics or layout structures:

- **Comfortable Default:** The default `:root` state is `comfortable` (16px body, 44px controls, 56px header, 256px sidebar).
- **Three Tiers via `[data-density]`:** `compact` (14px body, 36px controls, 52px header, 232px sidebar), `comfortable`, and `spacious` (18px body, 54px controls).
- **Cascade-Driven Token Rebinds:** Density does not introduce parallel `--density-*` scales (except `--density-row-h`). Each tier owns its type roles (`--text-body-*`, `--text-label-*`, `--text-title-*`, `--text-heading-*`), base spacing (`--padding-y`, `--gap`), control sizing (`--control-line-height`, `--btn-padding-y`, `--input-padding-y`), and structural padding (`--card-padding-x/y`, `--table-cell-padding-x/y`).
- **WCAG Target Size Invariant:**
  - Every control shares one contract: height = `--control-line-height` + 2 × padding-y + 2 × border.
  - `compact`: 22 + 2×6 + 2 = 36px (WCAG 2.5.5 Level AA).
  - `comfortable`: 26 + 2×8 + 2 = 44px (WCAG 2.5.5 Level AAA).
  - `spacious`: 28 + 2×12 + 2 = 54px (enhanced touch targets for kiosks/accessibility).
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
| `data-density="compact"` | attribute | — | Dense DocuFlow scale (36px controls and rows, 14px body) |
| `data-density="comfortable"` | attribute | — | The default: 16px body, 44px controls and rows |
| `data-density="spacious"` | attribute | — | Generous kiosk / touch density with 54px control targets |
| `--density-row-h` | token | `2.25rem` (compact) / `2.75rem` (comfortable) / `3rem` (spacious) | Minimum table row height floor |
| `--app-header-height` | token | `3.25rem` (compact) / `3.5rem` (comfortable) / `4rem` (spacious) | Density-reactive app header height |
| `--app-sidebar-width` | token | `14.5rem` (compact) / `16rem` (comfortable) / `17.5rem` (spacious) | Density-reactive sidebar width |
| `--control-line-height` | token | `1.375rem` (compact) / `1.625rem` (comfortable) / `1.75rem` (spacious) | Shared line box of buttons, inputs, selects, and pills |
| `--btn-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) / `var(--size-sm-up)` (spacious) | Button vertical padding |
| `--input-padding-y` | token | `var(--size-xs-up)` (compact) / `var(--size-sm)` (comfortable) / `var(--size-sm-up)` (spacious) | Input control vertical padding |
| `--card-padding-x` / `--card-padding-y` | token | `1rem` / `0.75rem` (compact), `1.5rem` / `1rem` (comfortable), `2rem` / `1.5rem` (spacious) | Panel header, body, and footer padding |
| `--table-cell-padding-x` / `--table-cell-padding-y` | token | `1rem` / `0.5rem` (compact), `1.5rem` / `0.75rem` (comfortable), `2rem` / `1rem` (spacious) | Table cell padding |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Density Never Changes Color Semantics:** Density tiers rebind only geometric and typographic properties (type roles, spacing, control sizing). Colors, shadows, and borders remain identical across density modes.
> 2. **Do Not Switch Density by Viewport:** Density is an explicit user preference toggle, not a viewport breakpoint mechanism. Responsive viewport changes are handled via `@container` and `@media`.
> 3. **Preserve Explicit `--font-size` Rebinds:** When creating custom form controls, always read `var(--font-size)` and `var(--line-height)` rather than hardcoding rem units so the control scales across density modes.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Spacing and typography scale tokens.
- [`theming`](./theming.md) — Dark mode and theme island interactions.
- [`tables`](./tables.md) — Data table row density and scrolling.
- [`forms`](./forms.md) — Form controls and button height scaling.
- [`scss-architecture`](../doctrine/scss-architecture.md) — SCSS design system architecture.
