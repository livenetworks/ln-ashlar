# ln-sortable

Drag & drop reorder component — moves elements in a list using the Pointer Events API.
Works with touch + mouse. The component only reorganizes the DOM — data model sync is the consumer's responsibility (via events).

## Single Source of Truth

The `data-ln-sortable` attribute is the single source of truth for enabled/disabled state:
- `data-ln-sortable` — enabled (default)
- `data-ln-sortable="disabled"` — disabled

All state changes flow through the attribute. The JS API methods (`enable()`, `disable()`) simply set the attribute — the MutationObserver detects the change and syncs the internal state. External code can set the attribute directly with the same result.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-sortable` | container (`<ol>`, `<ul>`, etc.) | Creates an instance, enabled by default |
| `data-ln-sortable="disabled"` | container | Creates an instance, starts disabled |
| `data-ln-sortable-handle` | element inside a child | Drag handle. If absent — the entire child is draggable. |

## API

```javascript
// Instance API (on the DOM element)
var list = document.querySelector('[data-ln-sortable]');
list.lnSortable.enable();     // sets data-ln-sortable="" → observer syncs state
list.lnSortable.disable();    // sets data-ln-sortable="disabled" → observer syncs state
list.lnSortable.isEnabled;    // boolean
list.lnSortable.destroy();    // removes all listeners, dispatches ln-sortable:destroyed

// Direct attribute change — identical result
list.setAttribute('data-ln-sortable', '');           // same as enable()
list.setAttribute('data-ln-sortable', 'disabled');   // same as disable()

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnSortable(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-sortable:before-drag` | yes | **yes** | `{ item: HTMLElement, index: number }` |
| `ln-sortable:drag-start` | yes | no | `{ item: HTMLElement, index: number }` |
| `ln-sortable:reordered` | yes | no | `{ item: HTMLElement, oldIndex: number, newIndex: number }` |
| `ln-sortable:enabled` | yes | no | `{ target: HTMLElement }` |
| `ln-sortable:disabled` | yes | no | `{ target: HTMLElement }` |
| `ln-sortable:destroyed` | yes | no | `{ target: HTMLElement }` |

```javascript
// Listen for reordering
document.addEventListener('ln-sortable:reordered', function (e) {
    console.log('Moved from', e.detail.oldIndex, 'to', e.detail.newIndex);
});

// Cancel drag conditionally
document.addEventListener('ln-sortable:before-drag', function (e) {
    if (listIsLocked) e.preventDefault();
});

// Disable while saving (via attribute or API — identical result)
list.setAttribute('data-ln-sortable', 'disabled');
saveOrder().then(function () {
    list.setAttribute('data-ln-sortable', '');
});
```

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
// Via API (sets the attribute, observer does the rest)
list.lnSortable.disable();
saveOrder().then(function () {
    list.lnSortable.enable();
});

// Via attribute (identical result)
list.setAttribute('data-ln-sortable', 'disabled');
```
