---
name: kbd
classification: css
status: draft
domain: frontend
summary: Monospace keyboard shortcut keycaps styled with 3D bottom border and sunken background.
source: theme/config/mixins/_kbd.scss
tags: [kbd, keyboard, shortcut, keycap, typography]
---

# ⌨️ kbd

---

## 1. Core Behavior & Responsibility

The `kbd` component (`theme/components/_kbd.scss` and `theme/config/mixins/_kbd.scss`) formats keyboard keycaps for hotkey documentation:
- **`@include kbd`:** Applied automatically to native `<kbd>` elements in the theme.
- **Visual Appearance:** Monospace font (`var(--font-mono)`), sunken background (`var(--bg-sunken)`), and a thicker bottom border (`2px`) for a tactile keycap appearance.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to search anywhere.</p>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `kbd` | mixin | — | Styles keycaps with monospace font, sunken background, and 3D border |
| `kbd` | class | — | Default tag selector applying @include kbd in theme layer |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Semantic HTML:** Always use native `<kbd>` elements for keyboard shortcuts rather than generic `<span>` tags.

---

## 5. Related Documents

- [`typography`](./typography.md) — Monospace typography fonts.
- [`prose`](./prose.md) — Editorial documentation typography.
