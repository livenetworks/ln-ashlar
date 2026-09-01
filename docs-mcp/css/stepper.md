---
name: stepper
classification: css
status: active
domain: frontend
summary: Sequential step progress indicators with CSS counter numbering, connector lines, and step state highlights.
source: theme/config/mixins/_stepper.scss
tags: [stepper, wizard, progress, steps, workflow]
---

# 🔢 stepper

---

## 1. Core Behavior & Responsibility

The `stepper` module (`theme/config/mixins/_stepper.scss` and `theme/components/_stepper.scss`) formats linear multi-step progress indicators:

- **Sequential `<ol>` Structure:** Uses ordered list semantics with CSS `counter()` numbering for automatic step numbering.
- **State Progression:**
  - `complete`: Filled primary circle with completed connector line.
  - `current`: Highlighted primary circle with focus halo.
  - `upcoming`: Neutral muted circle and line.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<ol class="stepper" data-ln-stepper>
    <li data-ln-step="complete">
        <span>Account Info</span>
    </li>
    <li data-ln-step="current" aria-current="step">
        <span>Verification</span>
    </li>
    <li data-ln-step="upcoming">
        <span>Confirmation</span>
    </li>
</ol>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `stepper` | mixin | — | Linear horizontal stepper with CSS counter numbers and connectors |
| `.stepper` | class | — | Prototyping class for `stepper` |
| `data-ln-step` | attribute | `complete` \| `current` \| `upcoming` | Step completion state |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **ARIA Current Step Semantics:** Always place `aria-current="step"` on the currently active `<li>` item.
> 2. **Ordered List Invariant:** Always use `<ol>` rather than `<ul>` so assistive technologies announce total steps and sequential progress.

---

## 5. Related Documents

- [`timeline`](./timeline.md) — Vertical chronological timeline events.
- [`ln-progress`](../components/ln-progress.md) — Determinate percentage progress bars.
