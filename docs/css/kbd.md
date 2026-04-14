# Kbd

File: `scss/config/mixins/_kbd.scss` — applied to `kbd` in `scss/base/_typography.scss`.

Keycap styling for inline keyboard shortcut documentation.

## Usage

```html
<p>Press <kbd>Ctrl</kbd> + <kbd>K</kbd> to open the command palette.</p>
<p>Save with <kbd>Ctrl</kbd>+<kbd>S</kbd>.</p>
```

## Styling

- Monospace font
- Neutral background + border
- Thicker bottom border (keycap illusion)
- Inline block, no line-break between letters

## Modifier keys

For cross-platform docs, use `<kbd>` with the canonical key name:

```html
<kbd>Cmd</kbd> / <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>
```
