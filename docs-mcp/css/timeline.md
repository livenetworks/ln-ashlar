---
name: timeline
classification: css
status: draft
domain: frontend
summary: Chronological event history and audit logs using ordered lists, time elements, and connecting rails.
source: theme/config/mixins/_timeline.scss
tags: [timeline, audit-log, events, history, chronological]
---

# ⏱️ timeline

---

## 1. Core Behavior & Responsibility

The `timeline` component (`theme/components/_timeline.scss` and `theme/config/mixins/_timeline.scss`) styles chronological history trails:
- **Semantic Structure:** Ordered list (`<ol class="timeline">`) with `<time datetime="...">` timestamps.
- **Visual Rail:** Continuous vertical connecting line anchored to the left of the event list.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<ol class="timeline">
    <li>
        <time datetime="2026-08-31T14:30">Aug 31, 14:30</time>
        <div>
            <strong>Password Changed</strong>
            <p>User updated authentication credentials.</p>
        </div>
    </li>
    <li>
        <time datetime="2026-08-30T09:15">Aug 30, 09:15</time>
        <div>
            <strong>Account Created</strong>
            <p>Initial registration completed.</p>
        </div>
    </li>
</ol>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `timeline` | mixin | — | Styles vertical chronological event list with left border rail |
| `.timeline` | class | — | Default component class applying @include timeline |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Use Semantic `<time>` Tags:** Always wrap timestamps in `<time datetime="ISO_DATE">` for machine-readable dates.
> 2. **Timeline vs Stepper:** Use `timeline` for past historical event logs; use `stepper` for forward multi-step form wizards.

---

## 5. Related Documents

- [`stepper`](./stepper.md) — Forward wizard progress indicators.
- [`typography`](./typography.md) — Tabular numbers for timestamps.
