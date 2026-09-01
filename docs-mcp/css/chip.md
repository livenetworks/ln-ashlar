---
name: chip
classification: css
status: active
domain: frontend
summary: Inline metadata tags, active filter chips, and dismissible token badges with status color washes.
source: theme/config/mixins/_chip.scss
tags: [chip, badge, tag, filters, metadata, dismissible]
---

# 🏷️ chip

---

## 1. Core Behavior & Responsibility

The `chip` module (`theme/config/mixins/_chip.scss` and `theme/components/_chip.scss`) formats inline metadata tokens and active filter tags:

- **Passive vs Interactive Labels:** Unlike interactive checkbox/radio pills, chips represent passive metadata tags with an optional dismissal remove button.
- **Recessed Tone Base:** Uses `--bg-recessed` and `--fg-muted` by default.
- **Status Washes:** Supports `.success`, `.warning`, `.error`, and `.info` color washes using a 12% alpha status background.
- **Dismiss Button Styling:** Features a compact remove button with dedicated `:focus-visible` keyboard focus indicators.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Active Filter Chip with Remove Action)

```html
<span class="chip">
    Category: Electronics
    <button type="button" aria-label="Remove filter: Category Electronics">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</span>
```

### Variant 1: Semantic Status Chips

```html
<span class="chip success">Approved</span>
<span class="chip warning">Under Review</span>
<span class="chip error">Expired</span>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `chip` | mixin | — | Base chip layout, typography (`label-sm`), and dismiss button rhythm |
| `.chip` | class | — | Prototyping class for `chip` |
| `.success`, `.warning`, `.error`, `.info` | class | — | Status color wash modifiers (12% alpha fill) |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Dismiss Button Accessible Description:** Always provide an explicit `aria-label` describing the exact item being removed (e.g. `aria-label="Remove tag JavaScript"`).
> 2. **Chip vs. Pill Distinction:** Do not use `chip` for mutually exclusive radio/checkbox selection. For selectable option groups, use `pills` from `toggles-and-pills.md`.

---

## 5. Related Documents

- [`toggles-and-pills`](./toggles-and-pills.md) — Interactive selection pills and switches.
- [`status-badge`](./status-badge.md) — Table status badges.
- [`ln-filter`](../components/ln-filter.md) — Interactive filter coordinator.
