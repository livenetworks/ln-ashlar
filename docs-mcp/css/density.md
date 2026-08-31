---
name: density
classification: css
status: draft
domain: frontend
summary: Inverted density system supporting compact, comfortable, and spacious information tiers via data-density attributes.
source: theme/config/_density.scss
tags: [density, layout, spacing, accessibility]
---

# 📏 density

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` density architecture features an **Inverted Density System**:
- **Default Base (`:root` / `compact`):** High information density optimized for enterprise data tools (14px body text, 36px table rows, 52px app header).
- **Expansion Tiers (`comfortable` / `spacious`):** Roomier layout, larger type, and expanded touch targets activated via the `data-density` attribute on `<html>` or scoped containers.

Density is an **explicit user preference** (e.g., settings toggle), not an automated viewport breakpoint.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<html lang="en" data-density="compact">
    <body>...</body>
</html>
```

### Variant 1: Scoped Region

```html
<section data-density="compact">
    <table>...</table>
</section>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `data-density="compact"` | token | attribute value | Dense base tier (36px table rows, 52px header) |
| `data-density="comfortable"` | token | attribute value | Medium tier (44px table rows, 64px header) |
| `data-density="spacious"` | token | attribute value | Spacious tier (52px table rows, 72px header) |
| `--density-row-h` | token | `2.25rem` – `3.25rem` | Minimum height for table rows across density tiers |
| `--app-header-height` | token | `3.25rem` – `4.5rem` | Header height across density tiers |
| `--app-sidebar-width` | token | `14.5rem` – `18rem` | Sidebar width across density tiers |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Auto-Switch Density via Media Queries:** Viewport breakpoints manage layout columns (`mq-up`), while density manages information pacing (`data-density`).
> 2. **WCAG Target Sizing:** Base tier interactive controls meet WCAG AA (≥38px height with vertical margins), while `comfortable` and `spacious` meet AAA criteria (≥44px+).

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 3-layer design tokens.
- [`tables`](./tables.md) — Table row density.
- [`app-shell`](./app-shell.md) — App shell header and sidebar dimensions.
