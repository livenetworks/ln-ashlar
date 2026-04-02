# Autoresize

Auto-resize `<textarea>` height to fit content. File: `js/ln-autoresize/ln-autoresize.js`.

## HTML

```html
<textarea data-ln-autoresize>Pre-filled content expands on init</textarea>
```

Only works on `<textarea>` elements. Logs a warning if applied to anything else.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-autoresize` | `<textarea>` | Creates instance, resizes immediately |

## Events

None. This component has no custom events.

## API

```js
const textarea = document.querySelector('[data-ln-autoresize]');
textarea.lnAutoresize.destroy();   // removes listener, clears inline height

// Manual init (Shadow DOM, iframe only)
window.lnAutoresize(container);
```

## Behavior

- On every `input` event, sets `style.height = 'auto'` then `style.height = scrollHeight + 'px'`
- Initial resize on construction (handles pre-filled content and server-rendered values)
- `destroy()` removes the `input` listener and clears the inline `height` style
- MutationObserver auto-initializes dynamically added textareas

---

## Internal Architecture

### State

Each `[data-ln-autoresize]` textarea gets a `_component` instance stored at `element.lnAutoresize`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the textarea |
| `_onInput` | Function | Bound input handler |

### Resize Mechanism

```
input event (or initial construction)
    |
    v
_resize():
    1. Set height = 'auto' (collapse to content height)
    2. Read scrollHeight (actual content height)
    3. Set height = scrollHeight + 'px'
```

The two-step approach (`auto` then `scrollHeight`) is necessary because `scrollHeight` returns the wrong value if the element already has a fixed height larger than its content.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `findElements` auto-initializes textareas
- **`attributes`** (`data-ln-autoresize`): attribute added to existing textarea → initializes
