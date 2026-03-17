# Sortable

Drag & drop reorder component using Pointer Events API. Works with touch + mouse. File: `js/ln-sortable/ln-sortable.js`.

## HTML

```html
<!-- List with drag handle -->
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

<!-- Without handle (entire child is draggable) -->
<ul data-ln-sortable>
    <li>Drag me</li>
    <li>Me too</li>
</ul>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-sortable` | container (`<ol>`, `<ul>`, etc.) | Creates instance. Sortable items = direct children. |
| `data-ln-sortable-handle` | element inside child | Drag handle. If absent, entire child is draggable. |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-sortable:before-drag` | yes | **yes** | `{ item, index }` |
| `ln-sortable:drag-start` | yes | no | `{ item, index }` |
| `ln-sortable:reordered` | yes | no | `{ item, oldIndex, newIndex }` |
| `ln-sortable:request-enable` | no | no | — |
| `ln-sortable:request-disable` | no | no | — |

`request-enable` and `request-disable` are **incoming** events — external code dispatches them on the sortable element.

## CSS Classes (set by JS, styled by consumer)

| Class | On | When |
|-------|----|------|
| `ln-sortable--active` | container | During drag |
| `ln-sortable--dragging` | dragged element | While being dragged |
| `ln-sortable--drop-before` | target element | Pointer in upper half |
| `ln-sortable--drop-after` | target element | Pointer in lower half |

## API

```js
const list = document.querySelector('[data-ln-sortable]');
list.lnSortable.enable();
list.lnSortable.disable();
list.lnSortable.isEnabled;  // boolean
```

## Behavior

- Only reorders DOM — data model sync is the consumer's responsibility (via events)
- Handle element needs `touch-action: none` and `cursor: grab` in CSS for proper touch behavior
