---
name: cards
classification: css
status: active
domain: frontend
summary: Card containers, composed section-cards, nested elevation shifts, and structured panel-header/body/footer child regions.
source: theme/config/mixins/_card.scss
tags: [cards, containers, surfaces, elevation, layout, panels]
---

# 📇 cards

---

## 1. Core Behavior & Responsibility

The `cards` module (`theme/config/mixins/_card.scss` and `theme/components/_card.scss`) provides primary content surface containers:

- **`card`:** Bare content container applying `--color-bg`, `--color-border`, `--radius`, and resting shadow. Automatically elevates nested child cards to `--bg-elevated` and `--shadow-floating`.
- **`section-card`:** Composed layout card featuring pre-structured `<header>`, `<main>`, and `<footer>` sections with unified borders and paddings.
- **Direct Child Bindings:** Automatically formats direct child `> header` (`panel-header`), `> main` (`panel-body`), and `> footer` (`panel-footer`) without interfering with nested content components.
- **Whole-Card Links:** Wrapping content in a direct `> a` child converts the card into a clickable tile while preserving internal layout and inheriting colors.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Data Card)

```html
<article class="card">
    <header>
        <h3>Card Title</h3>
    </header>
    <main>
        <p>Card body content and metrics.</p>
    </main>
    <footer>
        <button type="button" class="btn btn-ghost">View Details</button>
    </footer>
</article>
```

### Variant 1: Clickable Link Card

```html
<article class="card">
    <a href="/projects/42">
        <main>
            <h3>Q4 Security Audit</h3>
            <p>Completed 2026-09-01</p>
        </main>
    </a>
</article>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `card` | mixin | — | Base container card with resting shadow and border |
| `section-card` | mixin | — | Composed layout card with structured header, body, and footer |
| `panel-header` | mixin | — | Card header region with title-sm typography and border |
| `panel-body` | mixin | — | Card content body with standard padding and flex rhythm |
| `panel-footer` | mixin | — | Card footer region with border-t and action alignment |
| `.card` | class | — | Prototyping class for `card` |
| `.section-card` | class | — | Prototyping class for `section-card` |
| `--color-bg` | token | `var(--bg-base)` | Active card background |
| `--shadow` | token | `var(--shadow-resting)` | Active card elevation shadow |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Avoid Nested Interactive Elements in Link Cards:** If a card uses the whole-card `> a` link pattern, do not place additional buttons or links inside it, as nested interactive elements violate HTML accessibility standards.
> 2. **Direct Child Scoping:** Child mixins are scoped to direct children (`> header`, `> main`). Always use semantic HTML5 elements inside the card rather than generic container divs.
> 3. **Elevation Semantics:** Nested cards automatically elevate. Do not manually override `--color-bg: white` in dark mode.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Surface tokens, border radii, and resting/floating shadows.
- [`theming`](./theming.md) — Dark mode surface elevation and scoped theme islands.
- [`sections`](./sections.md) — Macro page sections and container wrappers.
- [`stat-card`](./stat-card.md) — KPI metric cards.
