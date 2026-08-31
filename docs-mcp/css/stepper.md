---
name: stepper
classification: css
status: draft
domain: frontend
summary: Linear multi-step wizard progress indicator using CSS counters, connector lines, and aria-current="step".
source: theme/config/mixins/_stepper.scss
tags: [stepper, wizard, progress, multi-step, form]
---

# 🪜 stepper

---

## 1. Core Behavior & Responsibility

The `stepper` component (`theme/components/_stepper.scss` and `theme/config/mixins/_stepper.scss`) visualizes forward progress through sequential multi-step wizards:
- **CSS Counters:** Step numbers (1, 2, 3...) are automatically calculated and rendered via CSS `counter(ln-step)` inside numbered circular bullets.
- **Connectors:** Horizontal lines connect consecutive steps, changing to primary accent color upon completion.
- **States:** Controlled declaratively via `data-ln-step="complete"` and `data-ln-step="current"`. Unmarked steps represent pending steps.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<ol data-ln-stepper>
    <li data-ln-step="complete">
        <span data-ln-step-label>Account Details</span>
    </li>
    <li data-ln-step="current" aria-current="step">
        <span data-ln-step-label>Subscription Plan</span>
    </li>
    <li>
        <span data-ln-step-label>Payment</span>
    </li>
</ol>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `stepper` | mixin | — | Renders horizontal step list with numbered circles and connecting rails |
| `[data-ln-stepper]` | class | — | Automatic component binding in theme layer |
| `data-ln-step="complete"` | token | attribute value | Completed step: filled accent circle and filled rail |
| `data-ln-step="current"` | token | attribute value | Active step: filled accent circle with halo ring |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Hardcode Numbers:** Do not hardcode numbers into the HTML; CSS counters generate numbers automatically.
> 2. **Ordered List:** Always use `<ol>` to semantically convey sequence to screen readers, and place `aria-current="step"` on the active step.

---

## 5. Related Documents

- [`timeline`](./timeline.md) — Past event history vs forward-looking wizards.
- [`forms`](./forms.md) — Multi-step wizard forms.
