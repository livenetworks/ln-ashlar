---
name: sections
classification: css
status: draft
domain: frontend
summary: Page section layout mixins providing section headers, divider margins, and section-card containers.
source: theme/components/_sections.scss
tags: [sections, section, card, layout, structure]
---

# 📑 sections

---

## 1. Core Behavior & Responsibility

The `sections` styling module (`theme/components/_sections.scss` and `theme/config/mixins/_card.scss`) formats major content divisions on a page:
- **`@include section` / `.section`:** Applies top-level page section margins (`--margin-block: var(--size-xl)`), structured `<header>` flex alignment, and bottom borders.
- **`@include section-card`:** Card container with `overflow: clip` ensuring sticky table headers inside remain attached to the outer scroll viewport.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<section class="section">
    <header>
        <h2>Organization Settings</h2>
        <div class="section-actions">
            <button type="button" class="btn">Edit</button>
        </div>
    </header>
    <main>
        <div class="card">
            <p>Section body content...</p>
        </div>
    </main>
</section>
```

### Variant 1: Section Card with Table

```html
<section class="section-card">
    <header>
        <h3>Audit Records</h3>
    </header>
    <main>
        <table>
            <thead>
                <tr><th>Event</th><th>Date</th></tr>
            </thead>
            <tbody>
                <tr><td>Login</td><td>2026-08-31</td></tr>
            </tbody>
        </table>
    </main>
</section>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `section` | mixin | — | Applies vertical rhythm and header alignment for page sections |
| `section-card` | mixin | — | Panel container with overflow: clip for sticky descendants |
| `.section` | class | — | Default component class applying @include section |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Opt-in Class vs Bare Tag:** In `ln-ashlar`, the bare `<section>` tag is not automatically styled to prevent unwanted double borders when nested inside cards. Always apply `.section` or `@include section` explicitly to major page sections.

---

## 5. Related Documents

- [`cards`](./cards.md) — Card panel surfaces.
- [`layout`](./layout.md) — Grid and flex layout helpers.
