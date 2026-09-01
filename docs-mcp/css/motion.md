---
name: motion
classification: css
status: active
domain: frontend
summary: Accessible motion design, transition timing, easing curves, and prefers-reduced-motion gating via motion-safe.
source: theme/config/mixins/_motion.scss
tags: [motion, animation, transitions, easing, accessibility, a11y]
---

# 💫 motion

---

## 1. Core Behavior & Responsibility

The `motion` system (`theme/config/mixins/_motion.scss` and `theme/config/_tokens.scss`) governs animation timings, easing curves, and accessibility constraints:

- **Accessibility First (`prefers-reduced-motion`):** All spatial transforms, keyframes, and dimensional transitions are gated via `@include motion-safe` to prevent vestibular discomfort for users who request reduced motion.
- **Selective Gating:** Transforms, scale, opacity fades, and sliding animations are disabled under reduced motion. Subtle background and text color transitions remain active to provide instant interactive feedback.
- **Duration Tokens:** Standardized timing durations (`--transition-fast`, `--transition-base`, `--transition-slow`).
- **Easing Tokens:** Standardized cubic-bezier velocity curves (`--easing-standard`, `--easing-decelerate`, `--easing-accelerate`, `--easing-spring`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Animated Panel with Motion Gating)

```html
<div class="animated-card">
    <p>Card content with accessible entry transition.</p>
</div>
```

```scss
// SCSS Usage:
.animated-card {
    opacity: 0;
    transform: translateY(var(--size-md));

    @include motion-safe {
        transition: opacity var(--transition-base),
                    transform var(--transition-base) var(--easing-decelerate);
    }

    &.is-visible {
        opacity: 1;
        transform: translateY(0);
    }
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `motion-safe` | mixin | — | Wraps animations/transitions in `@media (prefers-reduced-motion: no-preference)` |
| `--transition-fast` | token | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` | Rapid micro-interactions (hover, active) |
| `--transition-base` | token | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` | Standard UI transitions (collapsible panels, tabs) |
| `--transition-slow` | token | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` | Large-scale spatial transitions (dialogs, drawers) |
| `--easing-standard` | token | `cubic-bezier(0.4, 0, 0.2, 1)` | Standard symmetrical easing curve |
| `--easing-decelerate` | token | `cubic-bezier(0, 0, 0.2, 1)` | Deceleration curve for entering elements |
| `--easing-accelerate` | token | `cubic-bezier(0.4, 0, 1, 1)` | Acceleration curve for exiting elements |
| `--easing-spring` | token | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Elastic bouncy easing for emphasis/success |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Always Gate Spatial Animations:** Never declare `transform`, `height`, or `scale` transitions without `@include motion-safe` or native media query gating.
> 2. **Collapse Animation Pattern:** For collapsible elements (accordions/toggles), use `grid-template-rows: 0fr/1fr` transitions rather than `max-height` hacks.
> 3. **Preserve Color State Transitions:** Do not disable subtle color/background transitions in reduced motion, as they provide necessary interactive feedback.

---

## 5. Related Documents

- [`tokens`](./tokens.md) — Design tokens for transitions and easing.
- [`toggles-and-pills`](./toggles-and-pills.md) — Collapsible transitions and toggles.
- [`scss-architecture`](../doctrine/scss-architecture.md) — SCSS visual defaults and transition doctrine.
