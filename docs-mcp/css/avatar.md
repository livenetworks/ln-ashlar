---
name: avatar
classification: css
status: active
domain: frontend
summary: User profile image avatars, initials fallbacks (<abbr>), and composite user profile buttons with role captions.
source: theme/config/mixins/_avatar.scss
tags: [avatar, profile, user, image, initials, popover-trigger]
---

# 👤 avatar

---

## 1. Core Behavior & Responsibility

The `avatar` module (`theme/config/mixins/_avatar.scss` and `theme/components/_avatar.scss`) provides profile representation:

- **Photo & Initials Patterns:** Supports circular image avatars (`<img>`), fallback text initials using semantic `<abbr>`, and compound user buttons with name and role.
- **Double Separation Ring:** Incorporates an inner background gap ring and an outer border ring to visually decouple the avatar from dark or light surfaces.
- **Size Scale:** 4 standardized size variants (`avatar-sm`, base, `avatar-lg`, `avatar-xl`).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Compound Profile Button)

```html
<button type="button" class="avatar" data-ln-popover-for="account-menu" aria-label="User Account">
    <img src="/assets/avatar.jpg" alt="">
    <span>Jane Doe<small>Administrator</small></span>
</button>
```

### Variant 1: Initials Fallback

```html
<abbr class="avatar" title="Jane Doe">JD</abbr>
```

### Variant 2: Compact Sized Avatar

```html
<div class="avatar avatar-sm">
    <img src="/assets/avatar.jpg" alt="Jane Doe">
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `avatar` | mixin | — | Base avatar layout with double ring and flex label alignment |
| `avatar-sm` | mixin | — | Compact 2rem avatar size |
| `avatar-lg` | mixin | — | Prominent 3rem avatar size |
| `avatar-xl` | mixin | — | Large 5rem profile avatar size |
| `.avatar` | class | — | Prototyping class for `avatar` |
| `.avatar-sm`, `.avatar-lg`, `.avatar-xl` | class | — | Size modifier classes |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Initials Fallback Semantics:** When rendering text initials without an image, use the semantic `<abbr class="avatar" title="Full Name">` tag so assistive technology reads the full name.
> 2. **Avoid Redundant Alt Text in Compound Buttons:** If an avatar button includes visible `<span>Name<small>Role</small></span>`, keep the image alt text empty (`alt=""`) to prevent screen readers from announcing the name twice.

---

## 5. Related Documents

- [`app-shell`](./app-shell.md) — Header avatar trigger and top navigation bar.
- [`ln-popover`](../components/ln-popover.md) — User account dropdown popovers.
