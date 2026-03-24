# ln-autoresize

Auto-expanding textarea — grows with content, scrolls after max height.

## Usage

```html
<textarea data-ln-autoresize rows="1" placeholder="Type here…"></textarea>
```

The textarea starts at `rows="1"` and expands as the user types. Pair with CSS `max-height` to cap growth and enable scroll:

```scss
textarea[data-ln-autoresize] {
    resize: none;
    max-height: 6rem;
    overflow-y: auto;
}
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-autoresize` | `<textarea>` | Enables auto-resize behavior |

## API

```javascript
var el = document.querySelector('[data-ln-autoresize]');
el.lnAutoresize.destroy();  // remove listener, reset height
```

## Behavior

- On every `input` event: resets height to `auto`, then sets to `scrollHeight`
- Pre-filled content is auto-sized on initialization
- Works with dynamically added textareas (MutationObserver)
- Only applies to `<textarea>` elements — warns if used on other tags
