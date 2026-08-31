---
name: avatar
classification: css
status: draft
domain: frontend
summary: User profile avatars, fallback initials, size tiers (sm, md, lg, xl), and rounded circle styles.
source: theme/config/mixins/_avatar.scss
tags: [avatar, profile, image, initials, user]
---

# 👤 avatar

---

## 1. Core Behavior & Responsibility

The `avatar` component (`theme/components/_avatar.scss` and `theme/config/mixins/_avatar.scss`) renders circular user profile representations:
- **Image Avatar:** Scales `<img>` with `object-fit: cover` to prevent image distortion.
- **Initials Avatar:** Centered textual fallback displaying user initials using `--bg-sunken` and bold typography.
- **Size Tiers:** Supports size classes (`.avatar-sm`, `.avatar-lg`, `.avatar-xl`) with base size 36px.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<figure class="avatar">
    <img src="/avatars/user-12.jpg" alt="Alice Johnson">
</figure>
```

### Variant 1: Text Initials Fallback

```html
<div class="avatar avatar-sm" aria-label="Bob Smith">
    <span>BS</span>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `avatar` | mixin | — | Base circular avatar container (36px default) |
| `avatar-sm` | mixin | — | Small avatar tier (28px) |
| `avatar-lg` | mixin | — | Large avatar tier (48px) |
| `avatar-xl` | mixin | — | Extra-large avatar tier (64px) |
| `.avatar` | class | — | Default component class applying @include avatar |
| `.avatar-sm` | class | — | Component size modifier class |
| `.avatar-lg` | class | — | Component size modifier class |
| `.avatar-xl` | class | — | Component size modifier class |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Image Alt Attribute:** Always provide an informative `alt` attribute on `<img>` avatars, or an `aria-label` on initials fallbacks.

---

## 5. Related Documents

- [`page-header`](./page-header.md) — Avatars in page headers.
- [`app-shell`](./app-shell.md) — Avatars in header account menus.
