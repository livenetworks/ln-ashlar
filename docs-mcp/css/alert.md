---
name: alert
classification: css
status: draft
domain: frontend
summary: Contextual inline feedback banners, tone variants (success, warning, error, info), and title/content slots.
source: theme/config/mixins/_alert.scss
tags: [alert, feedback, notification, banner, tone]
---

# ⚠️ alert

---

## 1. Core Behavior & Responsibility

The `alert` component (`theme/components/_alert.scss` and `theme/config/mixins/_alert.scss`) presents contextual in-page notifications:
- **`@include alert` / `.alert`:** Renders a bordered panel with tinted background wash derived from `--color-accent`.
- **Tone Modifiers:** Automatically shifts border and tint colors when combined with tone classes (`.success`, `.warning`, `.error`, `.info`).
- **Semantic Structure:** Supports optional leading `<svg class="ln-icon">`, title `<strong>`, and description body `<p>`.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="alert warning" role="alert">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-alert-triangle"></use></svg>
    <div>
        <strong>Subscription Expiring</strong>
        <p>Your team plan will automatically renew on Sep 15, 2026.</p>
    </div>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `alert` | mixin | — | Base container with tinted surface and border derived from --color-accent |
| `alert-title` | mixin | — | Bold alert title styling |
| `alert-body` | mixin | — | Body text styling inside alert container |
| `.alert` | class | — | Default component class applying @include alert |
| `.success` | class | — | Tone modifier applying success emerald colors |
| `.warning` | class | — | Tone modifier applying warning amber colors |
| `.error` | class | — | Tone modifier applying error red colors |
| `.info` | class | — | Tone modifier applying info sky colors |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Add `role="alert"`:** Critical alerts requiring screen reader announcement must include `role="alert"`.
> 2. **Never Rely on Color Alone:** Always pair color tones with descriptive text and distinct icons so information is clear to colorblind users.

---

## 5. Related Documents

- [`status-badge`](./status-badge.md) — Read-only inline badges.
- [`theming`](./theming.md) — Status color tokens.
