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
| `ln-sortable:enabled` | yes | no | `{ target }` |
| `ln-sortable:disabled` | yes | no | `{ target }` |
| `ln-sortable:destroyed` | yes | no | `{ target }` |

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
list.lnSortable.destroy();    // removes all listeners, dispatches ln-sortable:destroyed

// Direct attribute change — identical result
list.setAttribute('data-ln-sortable', 'disabled');
```

## Behavior

- Only reorders DOM — data model sync is the consumer's responsibility (via events)
- Handle element needs `touch-action: none` and `cursor: grab` in CSS for proper touch behavior

---

## Internal Architecture

This section explains how the component works internally. A developer or AI reading this should fully understand the data flow, state model, and event pipeline without reading the source.

### State

Each `[data-ln-sortable]` container gets a `_component` instance stored at `element.lnSortable`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Reference to the container element |
| `isEnabled` | boolean | Whether sorting is active |
| `_dragging` | Element or null | The child element currently being dragged |
| `_onPointerDown` | Function | Bound pointerdown handler on the container |

### Attribute-Driven State

The `data-ln-sortable` attribute controls enabled/disabled state:

- `data-ln-sortable` or `data-ln-sortable=""` → enabled
- `data-ln-sortable="disabled"` → disabled

API methods (`enable()`, `disable()`) set the attribute. The MutationObserver detects the change and updates `instance.isEnabled` inline, then dispatches `ln-sortable:enabled` or `ln-sortable:disabled`. Unlike ln-toggle/ln-modal, there are no cancelable before-events for enable/disable — the state change is immediate.

### Pointer Events Lifecycle

The drag operation uses the Pointer Events API (unified mouse + touch):

```
pointerdown on handle (or child if no handles exist)
    |
    v
_handlePointerDown:
    1. Resolve which child is being dragged (walk up from target to direct child of container)
    2. Dispatch cancelable ln-sortable:before-drag — if prevented, abort
    3. setPointerCapture on the handle (captures all pointer events to this element)
    4. Set _dragging reference, add CSS classes, set aria-grabbed
    5. Dispatch ln-sortable:drag-start
    6. Attach pointermove + pointerup + pointercancel on the handle
    |
    v
pointermove (fires repeatedly during drag)
    |
    v
_handlePointerMove:
    1. Clear all --drop-before / --drop-after classes from children
    2. For each sibling (skipping the dragged element):
       - Get bounding rect, calculate vertical midpoint
       - If pointer is in upper half → add ln-sortable--drop-before, break
       - If pointer is in lower half → add ln-sortable--drop-after, break
    |
    v
pointerup (or pointercancel)
    |
    v
_handlePointerEnd:
    1. Find the child with --drop-before or --drop-after class
    2. Clean up all CSS classes and aria-grabbed
    3. If drop target found and it's not the dragged element:
       - insertBefore (for --drop-before) or insertBefore nextSibling (for --drop-after)
       - Dispatch ln-sortable:reordered with { item, oldIndex, newIndex }
    4. Set _dragging = null
    5. Remove pointermove/pointerup/pointercancel listeners
```

### Handle Resolution

On `pointerdown`, the component determines what to drag:

1. Check if the click target (or an ancestor) has `data-ln-sortable-handle`
2. **If handle found**: walk up from the handle to find the direct child of the container — that's the item being dragged
3. **If no handle found**: check if *any* handle exists in the container. If yes → abort (click was outside a handle). If no handles exist → the entire child is the handle
4. In either case, validate that the resolved item is a direct child of the container

### Drop Zone Calculation

During `pointermove`, each sibling's bounding rect is checked:

- **Upper half** (`clientY >= rect.top && clientY < midpoint`): `ln-sortable--drop-before` — item will be inserted before this sibling
- **Lower half** (`clientY >= midpoint && clientY <= rect.bottom`): `ln-sortable--drop-after` — item will be inserted after this sibling

Only one sibling gets a drop indicator at a time (loop breaks after first match).

### DOM Reorder

On `pointerup`, the actual reorder is a single `insertBefore` call:

- `--drop-before`: `container.insertBefore(item, dropTarget)`
- `--drop-after`: `container.insertBefore(item, dropTarget.nextElementSibling)`

This is pure DOM manipulation — **no data model is updated**. Consumers must listen for `ln-sortable:reordered` and sync their own data (e.g., update sort order on the server).

### CSS Classes Lifecycle

| Class | Added | Removed |
|-------|-------|---------|
| `ln-sortable--active` | on container at drag start | on container at drag end |
| `ln-sortable--dragging` | on dragged item at drag start | on dragged item at drag end |
| `ln-sortable--drop-before` | on target sibling during pointermove | cleared every pointermove + drag end |
| `ln-sortable--drop-after` | on target sibling during pointermove | cleared every pointermove + drag end |

### Before-Drag Cancelable Event

`ln-sortable:before-drag` fires before any visual drag state is applied. Calling `preventDefault()` on it aborts the drag entirely — no classes, no pointer capture, no further events. Use this to prevent drag on specific items:

```js
list.addEventListener('ln-sortable:before-drag', function (e) {
    if (e.detail.item.hasAttribute('data-locked')) {
        e.preventDefault();
    }
});
```

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `_findElements` auto-initializes sortable containers
- **`attributes`** (`data-ln-sortable`): attribute changes → updates `isEnabled` + dispatches `ln-sortable:enabled` or `ln-sortable:disabled`
