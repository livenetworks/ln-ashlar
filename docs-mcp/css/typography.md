---
name: typography
classification: css
status: draft
domain: frontend
summary: Semantic role typography system, font family stacks, tabular numbers, and text alignment mixins.
source: theme/config/mixins/_typography.scss
tags: [typography, fonts, text-scale, font-weight, accessibility]
---

# 🔤 typography

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` typography system enforces **Semantic Roles** through the `@include typography($role)` mixin.
- **Rule:** Mixins and components never set raw `font-size` or read `--text-*` directly. They invoke `@include typography($role)` which rebinds `--font-size` and `--line-height` primitives at the element's scope.
- **Font Stack:** Standard UI font is **Inter** (`var(--font-sans)`), with monospace support via `var(--font-mono)` for code, hashes, and data values.
- **Tabular Numbers:** Numeric data (tables, timestamps, metrics) must use `@include font-tabular` for monospaced figure alignment.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<h1>Dashboard Overview</h1>
<p class="subtitle">System metrics for current billing period</p>
<span class="user-id">#USR-98421</span>
```

```scss
h1 { @include typography(heading-lg); }
.subtitle { @include typography(body-md); color: var(--fg-muted); }
.user-id { @include font-mono; @include font-tabular; }
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `typography` | mixin | `$role: keyword` | Rebinds font-size and line-height primitives |
| `font-tabular` | mixin | — | Applies tabular-nums for numeric column alignment |
| `truncate` | mixin | — | Single-line text truncation with ellipsis |
| `font-sans` | mixin | — | Applies Inter font-sans stack |
| `font-mono` | mixin | — | Applies JetBrains Mono / monospace font stack |
| `text-xs`, `text-sm`, `text-base` | mixin | — | Raw size helper mixins |
| `font-medium`, `font-semibold`, `font-bold` | mixin | — | Font weight helper mixins |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Skip Heading Levels:** Visual styling via `@include typography(...)` is decoupled from HTML heading levels (`<h1>` to `<h6>`). Always maintain sequential semantic HTML headings for screen readers.
> 2. **Tabular Numerics in Tables:** All numeric table cells (`<td>`) and metric tiles (`stat-card`) must use tabular numbers to prevent jitter on value updates.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — 3-layer design tokens.
- [`density`](./density.md) — Typography scaling across density modes.
- [`prose`](./prose.md) — Longform editorial typography.
