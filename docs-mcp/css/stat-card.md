---
name: stat-card
classification: css
status: draft
domain: frontend
summary: Executive KPI metric tiles with large numerical values, title labels, and positive/negative trend indicators.
source: theme/config/mixins/_stat-card.scss
tags: [stat-card, kpi, metrics, dashboard, cards]
---

# 📈 stat-card

---

## 1. Core Behavior & Responsibility

The `stat-card` component (`theme/components/_stat-card.scss` and `theme/config/mixins/_stat-card.scss`) formats dashboard KPI metric tiles:
- **`[data-ln-stat-card]`:** Card surface with tabular typography for numbers.
- **Trend Indicators:** Formats percentage changes with color-coded positive (success emerald) or negative (error red) indicators.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<article data-ln-stat-card>
    <span data-ln-stat-title>Monthly Recurring Revenue</span>
    <strong data-ln-stat-value>$128,450</strong>
    <span data-ln-stat-change class="positive">+12.4% vs last month</span>
</article>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `stat-card` | mixin | — | Formats KPI card surface and tabular numerical values |
| `[data-ln-stat-card]` | class | — | Default component selector applying @include stat-card |
| `.positive` | class | — | Success emerald color modifier for upward trends |
| `.negative` | class | — | Error red color modifier for downward trends |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Tabular Numerals:** Metric figures must use tabular numerals (`@include font-tabular`) to prevent layout shifts during live data updates.

---

## 5. Related Documents

- [`cards`](./cards.md) — Base card surface and elevation.
- [`typography`](./typography.md) — Tabular numbers and font scales.
