---
name: status-badge
classification: css
status: active
domain: frontend
summary: Inline semantic status badges with colored status dots, live pulsing animations, and table cell integration.
source: theme/config/mixins/_status-badge.scss
tags: [status-badge, badge, status, indicators, live-pulse]
---

# 🟢 status-badge

---

## 1. Core Behavior & Responsibility

The `status-badge` module (`theme/config/mixins/_status-badge.scss` and `theme/components/_status-badge.scss`) provides compact inline status indicators:

- **Status Dot Indicator:** Integrates a circular colored status dot preceding the text label.
- **Semantic Levels:** Supports `.success`, `.warning`, `.error`, `.info`, and `.neutral` modifiers.
- **Live Pulse Animation (`.live`):** Adds a subtle pulsing animation to the dot for active ongoing processes (e.g. `Syncing`, `Connecting`).
- **Interactive Button Badges:** When applied to `<button class="badge">`, enables hover and active interactive states for filter toggles.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Active Status Badge)

```html
<span class="badge success">Active</span>
```

### Variant 1: Live Pulsing Indicator

```html
<span class="badge warning live">Synchronizing</span>
```

### Variant 2: Semantic SCSS Inclusion

```scss
.status-indicator {
    @include badge;
    &.confirmed { --color-primary: var(--color-success); }
    &.failed    { --color-primary: var(--color-error); }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `badge` | mixin | — | Base status badge recipe with colored dot indicator |
| `status-badge` | mixin | — | Alias for `badge` |
| `.badge` | class | — | Prototyping class for `badge` |
| `.success`, `.warning`, `.error`, `.info`, `.neutral` | class | — | Status color modifier classes |
| `.live` | class | — | Animated live pulse dot modifier |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Rely on Color Alone:** Always include clear, descriptive text inside the badge alongside the colored dot to ensure accessibility for color-blind users.
> 2. **Motion Gating for Live Badges:** The `.live` pulsing animation automatically respects `prefers-reduced-motion: reduce`.

---

## 5. Related Documents

- [`tables`](./tables.md) — Table row status indicators.
- [`chip`](./chip.md) — Dismissible metadata chips.
- [`tokens`](./tokens.md) — Semantic status color tokens.
