# Avatar

Profile button or link with image, initials fallback, and optional name/role text. Files: `scss/config/mixins/_avatar.scss`, `scss/components/_avatar.scss`.

## HTML

Three usage patterns:

```html
<!-- Photo only — image with ring -->
<button class="avatar">
    <img src="photo.jpg" alt="Marko Ivanov">
</button>

<!-- Initials fallback — no <img>, no <span> -->
<abbr class="avatar" title="Marko Ivanov">MI</abbr>

<!-- Photo + name + role — full profile button -->
<button class="avatar">
    <img src="photo.jpg" alt="">
    <span>Marko Ivanov<small>Administrator</small></span>
</button>

<!-- As a link -->
<a href="/profile" class="avatar">
    <img src="photo.jpg" alt="Profile">
    <span>Marko Ivanov<small>Administrator</small></span>
</a>
```

## Sizes

| Class | Image size | Use |
|-------|-----------|-----|
| `.avatar-sm` | 2rem | Compact lists, table cells |
| `.avatar` | 2.5rem (default) | Navigation, toolbars |
| `.avatar-lg` | 3rem | Profile headers, cards |
| `.avatar-xl` | 5rem | Profile pages, user detail views |

```html
<button class="avatar avatar-sm"><img src="photo.jpg" alt=""></button>
<button class="avatar avatar-lg"><img src="photo.jpg" alt=""></button>
```

Size classes are applied alongside `.avatar`, not instead of it.

## Ring

The image has a double ring — a background-colored inner ring and a border-colored outer ring. This visually separates the avatar from any background color and creates a consistent inset effect.

## Hover

The avatar container has a subtle background on hover. Used for interactive avatars (buttons, links). Non-interactive avatars (static `<abbr>`) have `cursor: default` — override if needed.

## Project SCSS

```scss
// Apply to a custom selector
#user-menu-trigger { @include avatar; }
#user-menu-trigger { @include avatar; @include avatar-lg; }
```
