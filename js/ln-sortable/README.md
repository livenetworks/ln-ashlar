# ln-sortable

Drag & drop reorder component — moves elements in a list using the Pointer Events API.
Works with touch + mouse. The component only reorganizes the DOM — data model sync is the consumer's responsibility (via events).

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-sortable` | container (`<ol>`, `<ul>`, etc.) | Creates an instance. Sortable items = direct children. |
| `data-ln-sortable-handle` | element inside a child | Drag handle. If absent — the entire child is draggable. |

## API

```javascript
// Instance API (on the DOM element)
var list = document.querySelector('[data-ln-sortable]');
list.lnSortable.enable();
list.lnSortable.disable();
list.lnSortable.isEnabled;  // boolean

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM: MutationObserver auto-initializes
window.lnSortable(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-sortable:before-drag` | yes | **yes** | `{ item: HTMLElement, index: number }` |
| `ln-sortable:drag-start` | yes | no | `{ item: HTMLElement, index: number }` |
| `ln-sortable:reordered` | yes | no | `{ item: HTMLElement, oldIndex: number, newIndex: number }` |
| `ln-sortable:request-enable` | no | no | — |
| `ln-sortable:request-disable` | no | no | — |

```javascript
// Listen for reordering
document.addEventListener('ln-sortable:reordered', function (e) {
    console.log('Moved from', e.detail.oldIndex, 'to', e.detail.newIndex);
});

// Cancel drag conditionally
document.addEventListener('ln-sortable:before-drag', function (e) {
    if (listIsLocked) e.preventDefault();
});

// Request disable (e.g. while saving)
list.dispatchEvent(new CustomEvent('ln-sortable:request-disable'));
```

`ln-sortable:request-enable` and `ln-sortable:request-disable` are **incoming** events — external code dispatches them on the sortable element.

## CSS Classes

The component adds/removes these classes. **Does not ship CSS** — the consumer styles them.

| Class | On | When |
|-------|----|------|
| `ln-sortable--active` | container | While drag is in progress |
| `ln-sortable--dragging` | dragged element | While being dragged |
| `ln-sortable--drop-before` | target element | Pointer in top half |
| `ln-sortable--drop-after` | target element | Pointer in bottom half |

Example CSS:
```css
.my-list > li.ln-sortable--dragging {
    opacity: 0.4;
}
.my-list > li.ln-sortable--drop-before {
    box-shadow: inset 0 2px 0 0 var(--accent);
}
.my-list > li.ln-sortable--drop-after {
    box-shadow: inset 0 -2px 0 0 var(--accent);
}
```

> **Important:** The handle element needs `touch-action: none` and `cursor: grab` in CSS for correct behavior on touch devices.

## Examples

### List with drag handle

```html
<ol data-ln-sortable>
    <li>
        <span data-ln-sortable-handle>⋮⋮</span>
        First item
    </li>
    <li>
        <span data-ln-sortable-handle>⋮⋮</span>
        Second item
    </li>
</ol>
```

### List without handle (entire child is draggable)

```html
<ul data-ln-sortable>
    <li>Drag me</li>
    <li>Me too</li>
</ul>
```

### Programmatic

```javascript
// Disable while processing
list.lnSortable.disable();
saveOrder().then(function () {
    list.lnSortable.enable();
});

// Or via events
list.dispatchEvent(new CustomEvent('ln-sortable:request-disable'));
```
