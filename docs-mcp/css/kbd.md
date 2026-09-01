---
name: kbd
classification: css
status: active
domain: frontend
summary: Keycap styling for keyboard shortcut documentation with keycap depth borders and monospace typography.
source: theme/config/mixins/_kbd.scss
tags: [kbd, keycap, keyboard-shortcuts, typography, code]
---

# ⌨️ kbd

---

## 1. Core Behavior & Responsibility

The `kbd` module (`theme/config/mixins/_kbd.scss` and `theme/base/_typography.scss`) styles inline keyboard shortcuts:

- **Auto-Applied to `<kbd>`:** Formats native HTML `<kbd>` elements with monospace font (`--font-mono`), subtle background, border, and a thicker bottom border for tactile keycap depth.
- **Inline Non-Breaking Layout:** Maintains inline-block rhythm without wrapping individual key sequences.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette.</p>
```

### Variant 1: Modifier Combination

```html
<p>Re-open closed tab: <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>T</kbd></p>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `kbd` | mixin | — | Keycap styling with tactile 2px bottom border |
| `kbd` | class | — | Default global element binding |
| `--font-mono` | token | `'JetBrains Mono', monospace` | Monospace typography stack |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Use Semantic `<kbd>` Elements:** Avoid using `<span>` or `<code>` for keyboard shortcuts; `<kbd>` provides semantic keyboard input context to assistive technologies.
> 2. **Separate Individual Keys:** Wrap each key in its own `<kbd>` tag (e.g. `<kbd>Ctrl</kbd> + <kbd>S</kbd>`) rather than combining them into a single string.

---

## 5. Related Documents

- [`typography`](./typography.md) — Font stacks and typography tokens.
- [`ln-key`](../components/ln-key.md) — JavaScript keyboard shortcut dispatcher.
