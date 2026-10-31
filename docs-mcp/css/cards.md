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

- **`card`:** Bare content container applying `--color-bg`, `--color-border`, `--panel-radius`, and resting shadow. Nested child cards climb to `--bg-elevated` and stay flat (`--shadow: none`).
- **Passive Cards:** Only whole-card links and buttons (`a.card`, `button.card`, or a card with a direct `> a`) react to hover and focus. A card that merely contains content does not respond to the pointer.
- **Panel Radius:** `--panel-radius` (default `--radius-lg`) is the corner of cards, section-cards, and modals; control radii stay on `--radius`. A skin that zeroes `--radius-lg` flattens panels too.
- **Panel Header:** The header shares the panel surface. Title and description are an `<hgroup>` (`<h3>` plus `<p>`); `--panel-header-bg` and `--panel-footer-bg` opt in to a tint.
- **Body Lists:** The panel body styles no lists. A bulleted or numbered content list sits inside `.prose` (`@include prose`) on the text region of the body; a classless component list keeps the global list reset.
- **Padding:** Header, body, and footer read `--card-padding-x/y`, which density rebinds.
- **`section-card`:** Composed layout card featuring pre-structured `<header>`, `<main>`, and `<footer>` sections with unified borders and paddings.
- **Direct Child Bindings:** Automatically formats direct child `> header` (`panel-header`), `> main` (`panel-body`), and `> footer` (`panel-footer`) without interfering with nested content components.
- **Whole-Card Links:** Wrapping content in a direct `> a` child converts the card into a clickable tile while preserving internal layout and inheriting colors.
- **Auto-Flush Table Integration:** Pure table cards (`> main > table:only-child` or `> main > .table-container:only-child`) automatically strip cell padding and outer border-radius so tabular data spans edge-to-edge. Optimized globally via `:is()` to prevent CSSOM selector explosion.

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
| `section-card` | mixin | `$group: false` | Composed layout card with structured header, body, and footer. `$group: true` renders a transparent titled group on the canvas (bound to `.section-card` in the `relaxed` design) |
| `panel-header` | mixin | `$group: false` | Card header region with title-sm typography and border. `$group: true` drops the divider, surface, and inline padding |
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
