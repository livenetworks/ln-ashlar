---
name: timeline
classification: css
status: active
domain: frontend
summary: Vertical chronological activity feed and audit trail layout with connecting rail and node bullets.
source: theme/config/mixins/_timeline.scss
tags: [timeline, audit-trail, history, events, feed]
---

# ⏱️ timeline

---

## 1. Core Behavior & Responsibility

The `timeline` module (`theme/config/mixins/_timeline.scss` and `theme/components/_timeline.scss`) formats vertical chronological event logs:

- **Vertical Connecting Rail:** A 2px connecting line (`::before` on `<ol>`) joining event nodes.
- **Node Bullets:** 12px primary bullets with surface-colored separation rings that adapt automatically across light and dark themes.
- **Semantic Event Nodes:** Each entry formats `<time>`, `<h4>` title, and `<p>` description with standard vertical typography rhythm.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Audit Trail Feed)

```html
<ol class="timeline" data-ln-timeline>
    <li>
        <time datetime="2026-09-01T10:00:00Z">Sep 1, 10:00</time>
        <h4>Document Published</h4>
        <p>Revision 2.4 approved and deployed to production.</p>
    </li>
    <li>
        <time datetime="2026-09-01T09:30:00Z">Sep 1, 09:30</time>
        <h4>Security Review Passed</h4>
        <p>Automated static analysis completed with zero warnings.</p>
    </li>
</ol>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `timeline` | mixin | — | Vertical timeline list with connecting rail and bullet nodes |
| `.timeline` | class | — | Prototyping class for `timeline` |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Machine-Readable Dates:** Always provide a machine-readable ISO datetime string on `<time datetime="...">` elements.
> 2. **Chronological Ordering:** Order events newest-first for audit feeds, using `<ol>` to indicate sequential ordering.

---

## 5. Related Documents

- [`stepper`](./stepper.md) — Horizontal sequential wizard steps.
- [`typography`](./typography.md) — Semantic heading and caption roles.
