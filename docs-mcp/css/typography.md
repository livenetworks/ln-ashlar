---
name: typography
classification: css
status: active
domain: frontend
summary: Semantic typography roles, font scales, line-heights, tracking, font-features, and prose vs structural list distinctions.
source: theme/config/mixins/_typography.scss
tags: [typography, font-size, line-height, tracking, headings, prose]
---

# 🔤 typography

---

## 1. Core Behavior & Responsibility

The `typography` system (`theme/config/mixins/_typography.scss` and `theme/base/_typography.scss`) manages type hierarchy and rhythm across two layers:

1. **Semantic Typography Roles (`typography($role)`):** The primary abstraction. Rebinds `--font-size` and `--line-height` dynamically on the consuming element scope based on role (`display-sm`, `heading-md`, `title-md`, `body-md`, `label-md`, `caption`). Automatically scales across density tiers.
2. **Typography Primitives (`text-xs` through `text-2xl`):** Direct font-size helpers for un-roled micro-components.
3. **Structural Lists vs. Editorial Prose:** Structural lists (`<ul>`, `<ol>`) are clean UI primitives by default (`list-style: none`, `margin: 0`, `padding: 0`). Editorial prose with bullets, numbering, and vertical rhythm is opt-in via `@include prose` / `.prose`.
4. **Tabular Numerals:** Numerics in tables and stat-cards default to `tnum` (`font-variant-numeric: tabular-nums`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Semantic Heading Hierarchy)

```html
<article class="article-card">
    <header>
        <span class="meta"><time datetime="2026-09-01">Sep 1, 2026</time></span>
        <h1>Design Token Architecture</h1>
    </header>
    <main>
        <p>Primitives cascade seamlessly across light and dark modes.</p>
    </main>
</article>
```

```scss
// SCSS Usage:
.article-card {
    header {
        .meta {
            @include typography(caption);
            color: var(--fg-muted);
        }
        h1 {
            @include typography(display-sm);
            @include font-bold;
        }
    }
    main > p {
        @include typography(body-md);
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `typography` | mixin | `$role: keyword` | Applies font-size and line-height for given semantic role |
| `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl` | mixin | — | Direct font-size steps |
| `font-normal`, `font-medium`, `font-semibold`, `font-bold` | mixin | — | Font-weight presets (400, 500, 600, 700) |
| `tracking-tight`, `tracking-normal`, `tracking-wide` | mixin | — | Optical tracking letter-spacing presets |
| `truncate` | mixin | — | Single-line ellipsis overflow clipping |
| `--font-sans` | token | `'Inter', sans-serif` | Primary sans-serif font stack |
| `--font-mono` | token | `'JetBrains Mono', monospace` | Monospace code font stack |
| `--text-display-sm` | token | `1.875rem` / `1.1` | Page `h1` display title size |
| `--text-heading-md` | token | `1.25rem` / `1.2` | Section `h2` heading size |
| `--text-title-md` | token | `1rem` / `1.3` | Card `h4` title size |
| `--text-body-md` | token | `0.875rem` / `1.5` | Standard body copy (14px) |
| `--text-label-md` | token | `0.8125rem` / `1.4` | Form label size |
| `--text-caption` | token | `0.75rem` / `1.4` | Timestamp & caption size |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Prefer Semantic Roles Over Raw Sizes:** Always use `@include typography($role)` so that typography inherits density scaling adjustments correctly.
> 2. **Never Use Unstyled Lists for Editorial Content:** Raw `<ul>` and `<ol>` tags have bullets and padding removed for layout usage. For articles, blog posts, or release notes, wrap content in `.prose` or `@include prose`.
> 3. **Preserve Semantic HTML Tags:** Using `<time datetime="...">` for dates and `<strong>` / `<data>` for numerical values ensures full screen-reader and machine readability.

---

## 5. Related Documents

- [`prose`](./prose.md) — Editorial typography, prose styling, and text formatting.
- [`tokens`](./tokens.md) — Typography scales and design token values.
- [`density`](./density.md) — Information density scaling of type roles.
- [`page-header`](./page-header.md) — Page title headers.
