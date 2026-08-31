---
name: chip
classification: css
status: draft
domain: frontend
summary: Compact interactive tokens and dismissible filter badges with remove buttons and tone variants.
source: theme/config/mixins/_chip.scss
tags: [chip, badge, token, filter, removable, tag]
---

# 🏷️ chip

---

## 1. Core Behavior & Responsibility

The `chip` component (`theme/components/_chip.scss` and `theme/config/mixins/_chip.scss`) renders compact badges representing active filter criteria, tags, or categorized metadata:
- **`@include chip` / `.chip`:** Pill-shaped inline element with subtle background and border.
- **Dismissible Action:** Supports embedded dismiss button (`button[aria-label="Remove"]`) with hover highlight.
- **Tones:** Supports tone classes (`.success`, `.warning`, `.error`, `.info`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<span class="chip">
    <span>Department: Sales</span>
    <button type="button" aria-label="Remove filter">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</span>
```

### Variant 1: Tone Chip

```html
<span class="chip success">
    <span>Verified</span>
</span>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `chip` | mixin | — | Base pill container with dismiss button styling |
| `.chip` | class | — | Default component class applying @include chip |
| `.success` | class | — | Tone modifier applying success emerald colors |
| `.warning` | class | — | Tone modifier applying warning amber colors |
| `.error` | class | — | Tone modifier applying error red colors |
| `.info` | class | — | Tone modifier applying info sky colors |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Dismiss Button Label:** Always provide an explicit `aria-label="Remove filter"` on the child button inside a chip.
> 2. **Chip vs Status Badge:** Use `chip` for interactive, dismissible tags and filters; use `status-badge` for read-only state indicators.

---

## 5. Related Documents

- [`status-badge`](./status-badge.md) — Read-only state indicators.
- [`toggles-and-pills`](./toggles-and-pills.md) — Selection pills.
