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

> **Mental Model & Architectural Contract:**
> Density attaches declaratively via `[data-density]` at any DOM boundary (`compact`, `comfortable`, `spacious`), globally rebinding typography roles (`--font-size`), spacing primitives, and control heights in `rem`. Color semantics, elevation shadows, and component DOM structures remain completely untouched while layout compression adapts dynamically.

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` density architecture (`theme/config/_density.scss`) scales the information density of the UI without altering color semantics or layout structures:

- **Balanced Default (:root Base):** The default `:root` provides an accessible, comfortable base (0.875rem body, 2.75rem row height floor, 3.25rem header, 14.5rem sidebar).
- **Bidirectional Scaling via `[data-density]`:** Density scales downward into high-density enterprise mode (`compact`: 0.8125rem body, 2rem row height) or upward into generous touch mode (`spacious`: 1rem body, 3.25rem row height).
- **Cascade-Driven Token Rebinds:** Density does not introduce parallel `--density-*` scales (except `--density-row-h`). It directly rebinds base spacing (`--padding-y`, `--gap`), typography roles (`--font-size`, `--text-body-*`, `--text-heading-*`), and control heights (`--btn-padding-y`, `--input-padding-y`).
- **WCAG Target Size Invariant:**
  - Base / `compact`: ~2.375rem control height (WCAG 2.5.5 Level AA compliant).
  - `comfortable`: ≥2.875rem control height (WCAG 2.5.5 Level AAA compliant).
  - `spacious`: ≥3.375rem control height (enhanced touch targets for kiosks/accessibility).
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
| `data-density="compact"` | attribute | — | Dense enterprise tier: 0.8125rem body, 2rem row height |
| `data-density="comfortable"` | attribute | — | Standard balanced tier: 0.875rem body, 2.75rem row height |
| `data-density="spacious"` | attribute | — | Generous touch/kiosk tier: 1rem body, 3.25rem row height |
| `--font-size` | token | `0.8125rem` (compact) / `0.875rem` (comfortable) / `1rem` (spacious) | Density-reactive typography body font size |
| `--density-row-h` | token | `2rem` (compact) / `2.75rem` (comfortable) / `3.25rem` (spacious) | Minimum table row height floor |
| `--app-header-height` | token | `3.25rem` (compact) / `3.5rem` (comfortable) / `4rem` (spacious) | Density-reactive app header height |
| `--app-sidebar-width` | token | `14.5rem` (compact) / `16rem` (comfortable) / `17.5rem` (spacious) | Density-reactive sidebar width |
| `--btn-padding-y` | token | `0.25rem` (compact) / `0.4375rem` (comfortable) / `0.625rem` (spacious) | Button vertical padding |
| `--input-padding-y` | token | `0.25rem` (compact) / `0.4375rem` (comfortable) / `0.625rem` (spacious) | Input control vertical padding |

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
