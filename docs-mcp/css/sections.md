---
name: sections
classification: css
status: active
domain: frontend
summary: Section containers, section-cards, and auto-flush table embedding via :has(> table:only-child).
source: theme/config/mixins/_card.scss
tags: [sections, containers, layout, tables, cards, auto-flush]
---

# 📁 sections

---

## 1. Core Behavior & Responsibility

The `sections` module (`theme/components/_sections.scss` and `theme/config/mixins/_card.scss`) governs page section wrappers and structured layout blocks:

- **Opt-In Section Wrapper (`.section` / `@include section`):** Defines clean vertical separation and constrained widths without colliding with generic HTML `<section>` elements.
- **Section Cards (`.section-card` / `@include section-card`):** Composed surface cards featuring distinct `<header>`, `<main>`, and `<footer>` sections.
- **Auto-Flush Table Embedding:** When a `<table>` or `.table-container` is the **only child** of `.section-card > main` (`:has(> table:only-child)`), outer padding and duplicate table borders are automatically stripped so the table sits flush against the card edges.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Section with Header)

```html
<section class="section">
    <header>
        <h2>Account Settings</h2>
        <div class="section-actions">
            <button type="button" class="btn btn-ghost">Discard</button>
        </div>
    </header>
    <main>
        <p>Manage security preferences and API credentials.</p>
    </main>
</section>
```

### Variant 1: Auto-Flush Table Section Card

```html
<section class="section-card">
    <header>
        <h3>Audit Records</h3>
    </header>
    <main>
        <!-- Table sits completely flush with the card boundary -->
        <table class="table">
            <thead>
                <tr><th>ID</th><th>Timestamp</th><th>Status</th></tr>
            </thead>
            <tbody>
                <tr><td>#1024</td><td>2026-09-01</td><td>Success</td></tr>
            </tbody>
        </table>
    </main>
</section>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `section` | mixin | — | Base page section wrapper with header bottom border and vertical margin |
| `section-card` | mixin | — | Composed card section with structured header, body, and footer |
| `.section` | class | — | Prototyping class for `section` |
| `.section-card` | class | — | Prototyping class for `section-card` |
| `.section-actions` | class | — | Action button container in section headers |
| `--margin-block` | token | `var(--size-xl)` | Bottom separation margin for sections |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Auto-Flush Trigger Invariant:** Auto-flush table padding removal triggers strictly on `:has(> table:only-child)`. If introductory text or headings are placed alongside the table in `<main>`, the card retains its regular padding to preserve layout rhythm.
> 2. **Opt-In Section Classes:** Do not assume bare `<section>` tags receive decorative borders or margins automatically; use `class="section"` or `@include section` explicitly.

---

## 5. Related Documents

- [`cards`](./cards.md) — Card container recipes and nested elevation.
- [`tables`](./tables.md) — Data table styling.
- [`page-header`](./page-header.md) — Top-of-page headers.
