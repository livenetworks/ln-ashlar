# Sortable

Drag & drop reorder component using Pointer Events API. Works with touch + mouse. File: `js/ln-sortable/ln-sortable.js`.

## Single Source of Truth

The `data-ln-sortable` attribute is the single source of truth. `data-ln-sortable="disabled"` disables sorting. API methods just set the attribute, and the MutationObserver syncs state.

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
| `data-ln-sortable` | container (`<ol>`, `<ul>`, etc.) | Creates instance, enabled by default |
| `data-ln-sortable="disabled"` | container | Creates instance, starts disabled |
| `data-ln-sortable-handle` | element inside child | Drag handle. If absent, entire child is draggable. |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-sortable:before-drag` | yes | **yes** | `{ item, index }` |
| `ln-sortable:drag-start` | yes | no | `{ item, index }` |
| `ln-sortable:reordered` | yes | no | `{ item, oldIndex, newIndex }` |

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
list.lnSortable.enable();     // sets attribute → observer syncs state
list.lnSortable.disable();    // sets attribute → observer syncs state
list.lnSortable.isEnabled;    // boolean

// Direct attribute change — identical result
list.setAttribute('data-ln-sortable', 'disabled');
```

## Behavior

- Only reorders DOM — data model sync is the consumer's responsibility (via events)
- Handle element needs `touch-action: none` and `cursor: grab` in CSS for proper touch behavior
