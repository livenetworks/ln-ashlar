---
name: alert
classification: css
status: active
domain: frontend
summary: Contextual inline alerts and full-width system banners with status tints, left-border indicators, and dismiss buttons.
source: theme/config/mixins/_alert.scss
tags: [alert, banner, feedback, status, notifications]
---

# ⚠️ alert

---

## 1. Core Behavior & Responsibility

The `alert` component (`theme/config/mixins/_alert.scss` and `theme/components/_alert.scss`) delivers inline status feedback and page-level system banners:

- **Accent Left Border & Tinted Fill:** An 8% accent wash background paired with a 3px solid left accent border indicator.
- **Dynamic Semantic Colors:** Color is driven entirely by `--color-primary`. Status variants (`.success`, `.warning`, `.error`, `.info`) rebind `--color-primary`, shifting icon color, border, and wash background simultaneously.
- **Full-Width Banner (`.banner`):** A delta-only variant designed for page-top announcements with 0 border radius, bottom border, and full-width layout.
- **Dismissible Wiring:** Dismiss buttons align automatically to the right (`margin-left: auto`) and wire directly with `ln-toggle`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Warning Alert)

```html
<div class="alert warning" role="alert">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-alert-triangle"></use></svg>
    <p>Your subscription is set to renew in 3 days.</p>
    <button type="button" aria-label="Dismiss">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-x"></use></svg>
    </button>
</div>
```

### Variant 1: Full-Width Top Banner

```html
<div class="alert banner error" role="status" aria-live="polite">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-circle-x"></use></svg>
    <p>Database connection degraded. Retrying automatically...</p>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `alert` | mixin | — | Base inline alert recipe (tinted fill, 3px left border) |
| `banner` | mixin | — | Full-width banner variant (radius 0, bottom border) |
| `.alert` | class | — | Prototyping class for `alert` |
| `.banner` | class | — | Prototyping class for `banner` |
| `.success`, `.warning`, `.error`, `.info` | class | — | Status color rebind modifier classes |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **ARIA Roles:** Use `role="alert"` for critical or time-sensitive interruptions, and `role="status"` with `aria-live="polite"` for non-urgent advisory notices.
> 2. **Dismiss Button Labeling:** Always provide an explicit `aria-label="Dismiss"` or `aria-label="Close"` on dismiss button triggers when they contain only SVG icons.
> 3. **Never Override Backgrounds with Hex Colors:** Rebind `--color-primary: var(--color-danger);` so the 8% background wash and left-border stay visually harmonized.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Status color tokens and alpha transparency syntax.
- [`ln-toast`](../components/ln-toast.md) — Floating toast notification stack.
- [`ln-toggle`](../components/ln-toggle.md) — Dismissible state mechanics.
