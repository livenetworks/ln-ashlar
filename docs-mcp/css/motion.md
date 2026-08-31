---
name: motion
classification: css
status: draft
domain: frontend
summary: Motion safety, animation keyframes, entrance transitions, and prefers-reduced-motion gating.
source: theme/config/mixins/_motion.scss
tags: [motion, animation, transitions, accessibility, prefers-reduced-motion]
---

# 🎬 motion

---

## 1. Core Behavior & Responsibility

The `motion` system (`theme/config/mixins/_motion.scss`) provides purposeful micro-interactions while guaranteeing **Vestibular Safety**:
- **`@include motion-safe`:** Gates all scale, transform, slide, and keyframe animations behind `@media (prefers-reduced-motion: no-preference)`.
- **Color & Opacity Invariance:** Color transitions (e.g., hover background color shifts) do not trigger vestibular motion sickness and do not require reduced-motion gating.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<dialog class="ln-modal" data-ln-modal id="motion-modal">
    <p>Modal entrance animation</p>
</dialog>
```

```scss
.ln-modal {
    @include enter-scale-fade(var(--transition-fast));
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `motion-safe` | mixin | Content block | Wraps inner CSS in @media (prefers-reduced-motion: no-preference) |
| `enter-scale-fade` | mixin | `$duration: var(--transition-fast)` | Scale-up and fade-in entrance for modals and popovers |
| `enter-slide-fade` | mixin | `$duration: var(--transition-base)` | Slide-up and fade-in entrance for toasts and notifications |
| `--transition-fast` | token | `150ms` | Fast duration token for hover and tooltips |
| `--transition-base` | token | `250ms` | Base duration token for dropdowns and popovers |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Never Animate Movement Without `motion-safe`:** Always wrap sliding, scaling, or bouncing keyframe animations inside `@include motion-safe` to honor user OS accessibility preferences.
> 2. **Avoid Excessive Durations:** UI feedback animations must remain below `300ms` to maintain a crisp, responsive enterprise tool feel.

---

## 5. Related Documents

- [`theming`](./theming.md) — Surface transitions across themes.
- [`tokens`](./tokens.md) — Transition tokens.
