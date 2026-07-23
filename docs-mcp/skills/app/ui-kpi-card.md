---
name: ui-kpi-card
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for KPI cards and metric indicators — single primary metric rule, structural label/value hierarchy, and dashboard caps.
tags: [ui, kpi-card, stat-card, metrics, dashboard]
---

# 📈 KPI Card Rules

## Summary

This skill governs the specification of Key Performance Indicator (KPI) cards and stat summary blocks. Consult it when designing dashboards, overview sections, or analytics summaries.

> For dashboard layout decisions → [`./ui.md`](./ui.md)

---

## 1. Core Principle

**One primary metric per card.** The number is the direct answer to the user's core question — label and trend indicators provide context.

---

## 2. Anatomy & Structure

```
┌──────────────────────┐
│ Total Employees      │ ← Label (small, muted)
│ 42                   │ ← Value (large, bold metric)
│ ▲ 12% vs last month  │ ← Trend indicator (optional)
└──────────────────────┘
```

- **Heading (`<h3>`):** Metric label (e.g. *"Total Employees"*).
- **Value (`<strong>`):** Prominent metric figure (e.g. *"42"*).
- **Trend:** Optional arrow indicator + percentage change vs comparison period.

---

## 3. Mandatory Rules

- **Single Metric Rule:** Exactly ONE primary metric figure per card. Secondary metrics MUST NOT compete for visual dominance within the same card.
- **Click Navigation:** KPI cards MUST be interactive triggers that navigate users directly to the corresponding filtered list or detail page for that metric.
- **Dashboard Limit:** Dashboards MUST feature a maximum of 3 to 5 KPI cards per dashboard row. Overloading dashboards with dozens of stat cards dilutes information hierarchy.
- **Semantic HTML Hierarchy:** Metric label functions as the section header; metric number represents the value.

---

## 4. Anti-Patterns — NEVER Do These

- Placing more than 5 KPI cards in a single dashboard section.
- Displaying multiple competing primary metric values within a single card block.
- Rendering static KPI cards that lack click-through functionality to detailed underlying records.
- Styling metric labels in larger font sizes than the actual metric value.
