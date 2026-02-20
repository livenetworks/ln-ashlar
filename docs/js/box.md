# Box

Collapsible container. File: `js/ln-box/ln-box.js`.

## HTML

```html
<div data-ln-box>
    <header>
        Title
        <button data-ln-box-action="collapse">Collapse</button>
        <button data-ln-box-action="expand">Expand</button>
    </header>
    <main data-ln-box-body>Content</main>
</div>

<!-- Collapsed by default -->
<div data-ln-box="collapsed">...</div>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-box` | Container (empty = expanded) |
| `data-ln-box="collapsed"` | Collapsed state |
| `data-ln-box-body` | Body content (animated) |
| `data-ln-box-action="collapse"` | Collapse button (hidden when collapsed) |
| `data-ln-box-action="expand"` | Expand button (hidden when expanded) |

## JS API

```js
const box = document.querySelector('[data-ln-box]');
box.lnBox.collapse();
box.lnBox.expand();
```

## CSS

Collapsed state: `max-height: 0`, `padding-top/bottom: 0`, `overflow: hidden` with CSS transition.
