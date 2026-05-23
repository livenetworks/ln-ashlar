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

### `ln-sortable:reordered`
Fired when an item drop successfully changes the DOM index order.
- **Payload (`detail`)**: `{ item: HTMLElement, oldIndex: number, newIndex: number }`

---

## ⚠️ Common Pitfalls

- **Missing `touch-action: none`:** Drag handles must carry `touch-action: none` in CSS. Failing to add this prevents mobile browsers from scrolling, causing the browser to capture pointer tracks and breaking touch drags.
- **Auto-Sync Assumptions:** The primitive does not call servers automatically. You must wire an `ln-sortable:reordered` listener and dispatch your sync request (e.g. via `ln-http`):
  ```javascript
  document.addEventListener('ln-sortable:reordered', function(e) {
    saveNewListOrder(e.target.id, e.detail.oldIndex, e.detail.newIndex);
  });
  ```
