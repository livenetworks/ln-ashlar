---
name: stat-card
classification: css
status: active
domain: frontend
summary: KPI metric card styling with large tabular values, label captions, and directional trend indicators.
source: theme/config/mixins/_stat-card.scss
tags: [stat-card, kpi, metrics, dashboard, trends, numbers]
---

# 📈 stat-card

---

## 1. Core Behavior & Responsibility

The `stat-card` module (`theme/config/mixins/_stat-card.scss` and `theme/components/_stat-card.scss`) formats dashboard KPI metric tiles:

- **Metric Hierarchy:** Structured rhythm with uppercase label, prominent numeric value with tabular numerals (`tnum`), and an optional trend indicator (`up`, `down`, `neutral`).
- **Trend Indicators:** Colored directional indicators displaying status colors (success green for `up`, error red for `down`).
- **Responsive Layout:** Grid layout adapting via container query breakpoints (`$cq-compact`, `$cq-medium`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (KPI Tile with Trend)

```html
<article class="stat-card">
    <p class="stat-label">Monthly Active Users</p>
    <p class="stat-value">24,580</p>
    <p class="stat-trend up">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-up-right"></use></svg>
        <span>+14.2% vs last month</span>
    </p>
</article>
```

### Variant 1: Negative Trend

```html
<article class="stat-card">
    <p class="stat-label">Error Rate</p>
    <p class="stat-value">0.04%</p>
    <p class="stat-trend down">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-arrow-down-right"></use></svg>
        <span>-0.02% improvement</span>
    </p>
</article>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `stat-card` | mixin | — | KPI card container layout with tabular numeral styling |
| `.stat-card` | class | — | Prototyping class for `stat-card` |
| `.stat-label`, `.stat-value`, `.stat-trend` | class | — | Child element structural styling classes |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Contextual Trend Text:** Ensure the trend element includes descriptive text (e.g. `+14% vs last month`) rather than relying on arrow icons alone.
> 2. **Tabular Numerals:** Always use tabular numerals (`tnum`) for animated or rapidly updating KPI values to prevent layout shift.

---

## 5. Related Documents

- [`cards`](./cards.md) — Card container recipes.
- [`typography`](./typography.md) — Font features and number scales.
- [`layout`](./layout.md) — Responsive grid layouts.
