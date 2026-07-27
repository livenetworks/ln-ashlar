# ln-sortable

A zero-dependency, high-performance **Drag & Drop Reordering Primitive** driven by browser Pointer Events APIs, designed for seamless mouse and touch interactions.

It focuses strictly on visual DOM restructuring, delegating server-side synchronization, database persistence, and list state saves completely to the parent coordinator via telemetry events.

---

## 🧭 Philosophy & Architecture

1. **Pointer Concurrency:** Built natively on Pointer Events APIs (`pointerdown`, `pointermove`, `pointerup`). It replaces heavy HTML5 Drag & Drop frameworks, offering high-performance dragging and layout shifts across desktop, mobile, and hybrid touch displays.
2. **Visual Isolation:** The primitive does not import or inject inline styles or layout rules. Instead, it exposes CSS state hooks (e.g. `.ln-sortable--dragging`) on active elements, leaving transitions and placeholders fully to the stylesheet.
3. **HTML Attribute as Single Source of Truth:** Component states are governed entirely by the `data-ln-sortable` attribute. Standard JS API calls (`enable()`, `disable()`) write directly to the attribute, which is observed via `MutationObserver` to coordinate internals.

---

## 📦 Minimal Blueprint

### Drag Anywhere List
Mark the container list directly with `data-ln-sortable`. All direct children become instantly sortable.
```html
<ul data-ln-sortable>
  <li>First Item</li>
  <li>Second Item</li>
  <li>Third Item</li>
</ul>
```

### Handles-Only List (Premium Touch-Safe)
For touch screens, limit drag triggers to a specific nested grab handle via `data-ln-sortable-handle`.
```html
<ol data-ln-sortable>
  <li>
    <span data-ln-sortable-handle>
      <svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
    </span>
    <span>Dashboard</span>
  </li>
  <li>
    <span data-ln-sortable-handle>
      <svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
    </span>
    <span>Users</span>
  </li>
</ol>
```

---

## 🛠️ Declarative API Contract

### HTML Attributes

| Attribute | Elements | Description |
| :--- | :--- | :--- |
| `data-ln-sortable` | Container (`<ul>`, `<ol>`, etc.) | Component root. Can be empty (enabled) or `"disabled"`. |
| `data-ln-sortable-handle` | Descendant of list item | Identifies drag trigger. When present, pointer clicks outside fail to drag. |

### CSS Class Hooks

The component toggles these visual state classes at runtime:

| Class | Element | Description |
| :--- | :--- | :--- |
| `.ln-sortable--active` | Container | Drag session in progress. Pointer events on text selection are locked. |
| `.ln-sortable--dragging` | Dragged item | The item currently being dragged. Typically styled with reduced opacity. |
| `.ln-sortable--drop-before` | Neighbor item | Target item top-half placeholder. Highlight top border. |
| `.ln-sortable--drop-after` | Neighbor item | Target item bottom-half placeholder. Highlight bottom border. |

---

## ⚡ DOM Events

All events bubble from the container element.

### `ln-sortable:before-drag`
Fired when pointer down triggers drag.
- **Cancelable**: Yes. Call `e.preventDefault()` to cancel the drag action (e.g. list is locked).
- **Payload (`detail`)**: `{ item: HTMLElement, index: number }`

### `ln-sortable:drag-start`
Fired right after a drag is committed (after `before-drag` passes, capture is set, and drag classes are applied).
- **Payload (`detail`)**: `{ item: HTMLElement, index: number }`

### `ln-sortable:reordered`
Fired when an item drop successfully changes the DOM index order.
- **Payload (`detail`)**: `{ item: HTMLElement, oldIndex: number, newIndex: number }`

### `ln-sortable:enabled` / `ln-sortable:disabled`
Fired when `data-ln-sortable` toggles between enabled and `"disabled"` (via `enable()`/`disable()` or a direct attribute write, picked up by the shared `MutationObserver`).
- **Payload (`detail`)**: `{ target: HTMLElement }`

### `ln-sortable:destroyed`
Fired inside `destroy()`, after the `pointerdown` listener is removed.
- **Payload (`detail`)**: `{ target: HTMLElement }`

---

## ⚠️ Common Pitfalls

- **Missing `touch-action: none`:** Drag handles must carry `touch-action: none` in CSS. Failing to add this prevents mobile browsers from scrolling, causing the browser to capture pointer tracks and breaking touch drags.
- **Auto-Sync Assumptions:** The primitive does not call servers automatically. You must wire an `ln-sortable:reordered` listener and dispatch your sync request (e.g. via `ln-http`):
  ```javascript
  document.addEventListener('ln-sortable:reordered', function(e) {
    saveNewListOrder(e.target.id, e.detail.oldIndex, e.detail.newIndex);
  });
  ```

---

## 🔧 Internals

Source: `js/ln-sortable/ln-sortable.js`. Each `[data-ln-sortable]` container gets a `_component` instance at `element.lnSortable` (`dom`, `isEnabled`, `_dragging` — the child currently being dragged, or `null` — and the bound `pointerdown` handler).

### Handle resolution

On `pointerdown`: if the target (or an ancestor) carries `data-ln-sortable-handle`, walk up from the handle to the direct container child — that's the drag item. If no handle is under the pointer but handles exist elsewhere in the container, abort (click was outside a handle). If no handles exist anywhere in the container, the clicked child itself is the handle. Either way the resolved item is validated as a direct child of the container before drag starts.

### Pointer lifecycle

`pointerdown` → resolve item → dispatch cancelable `ln-sortable:before-drag` (abort on `preventDefault()`, before any class or capture is applied) → `setPointerCapture` on the handle → set `_dragging`, apply `.ln-sortable--active`/`--dragging`, `aria-grabbed` → attach `pointermove`/`pointerup`/`pointercancel` on the handle.

`pointermove` (repeated): clear all `--drop-before`/`--drop-after` classes, then for each sibling (skipping the dragged element) compare `clientY` to the sibling's vertical midpoint — upper half gets `--drop-before`, lower half gets `--drop-after`. Loop breaks after the first match, so only one sibling ever carries a drop indicator.

`pointerup`/`pointercancel`: find the sibling still carrying a drop class, strip all classes + `aria-grabbed`, and if a valid drop target exists, reorder with a single `insertBefore` (`container.insertBefore(item, dropTarget)` for `--drop-before`, or before `dropTarget.nextElementSibling` for `--drop-after`) then dispatch `ln-sortable:reordered`. This is pure DOM manipulation — no data model is touched; the event is the only signal for consumers to persist order.

### Attribute-driven enable/disable

`data-ln-sortable` (absent value) = enabled, `data-ln-sortable="disabled"` = disabled. `enable()`/`disable()` write the attribute; the shared `MutationObserver` picks up the change, updates `isEnabled` inline, and dispatches `ln-sortable:enabled`/`ln-sortable:disabled`. No cancelable before-event for enable/disable — the state change is immediate.

### MutationObserver

One global observer on `document.body`: `childList` (subtree) auto-initializes new `[data-ln-sortable]` containers; `attributes` on `data-ln-sortable` re-syncs `isEnabled` on existing instances.
