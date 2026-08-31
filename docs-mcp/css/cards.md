---
name: cards
classification: css
status: draft
domain: frontend
summary: Card panel surfaces, nested elevation ladder, panel headers, bodies, footers, and accent borders.
source: theme/config/mixins/_card.scss
tags: [card, panel, surfaces, elevation, layout]
---

# 🃏 cards

---

## 1. Core Behavior & Responsibility

The `cards` mixin module (`theme/config/mixins/_card.scss`) styles surface containers with an automated nesting elevation ladder:
- **Surface Nesting:** Direct cards use `--bg-base`. When nested inside another card or `.section-card`, descendant cards automatically climb to `--bg-elevated` and `--shadow-floating`.
- **Structural Slots:** Automatically formats direct children: `> header` (`@include panel-header`), `> main` (`@include panel-body`), and `> footer` (`@include panel-footer`).
- **Accents:** Provides border accent mixins (`card-accent-top`, `card-accent-bottom`, `card-accent-left`) for status highlights.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<article class="card">
    <header>
        <h3>Tenant Profile</h3>
    </header>
    <main>
        <p>Enterprise subscription active through Dec 2026.</p>
    </main>
    <footer>
        <button type="button" class="btn btn-soft">Edit</button>
    </footer>
</article>
```

### Variant 1: Card with Top Accent

```html
<article class="card accent-top" style="--color-accent: hsl(var(--color-primary));">
    <header>
        <h3>Highlighted Metric</h3>
    </header>
    <main>
        <p>Active plan details...</p>
    </main>
</article>
```

```scss
.accent-top {
    @include card-accent-top;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `card` | mixin | — | Standard card shell with automatic slot styling and nesting elevation |
| `section-card` | mixin | — | Panel container with overflow: clip for sticky descendants |
| `panel-header` | mixin | — | Sunken header bar with integrated bottom border |
| `panel-body` | mixin | — | Main content container with padding |
| `panel-footer` | mixin | — | Action footer with right-aligned flex layout |
| `card-accent-top` | mixin | — | Adds 3px top border using --color-accent |
| `card-accent-bottom` | mixin | — | Adds 3px bottom border using --color-accent |
| `card-accent-left` | mixin | — | Adds 3px left border using --color-accent |
| `card-stacked` | mixin | — | Pseudo-element bottom shadow illusion for stacked deck cards |
| `card-bg` | mixin | — | Tinted background based on --color-accent |
| `.card` | class | — | Default component class applying @include card |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Direct Child Scoping:** The card's slot mixins apply only to direct children (`> header`, `> main`, `> footer`). Do not nest arbitrary `<header>` tags inside child components without wrapping them.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Surface vocabulary tokens.
- [`theming`](./theming.md) — Dark mode elevation ladder.
- [`sections`](./sections.md) — Page section layouts.
