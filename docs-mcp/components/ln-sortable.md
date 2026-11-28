---
name: ln-sortable
classification: simple
status: stable
domain: frontend
summary: A touch-friendly drag-and-drop reordering primitive using Pointer Events.
source: components/ln-sortable/src/ln-sortable.js
tags: [interactions, drag-and-drop, sorting, list]
---

# 🔀 ln-sortable

> **Classification:** 🟢 Simple Component / Drag & Drop Reordering Primitive  
> Applied to a `<ul data-ln-sortable>` or `<ol data-ln-sortable>` list (or `<div>` container). It listens for `pointerdown`,
> `pointermove`, and `pointerup` events on direct children (or `[data-ln-sortable-handle]`), applies `.ln-sortable--dragging`
> to the dragged item and `.ln-sortable--drop-before`/`.ln-sortable--drop-after` to the hovered sibling, and on release
> repositions via `insertBefore`, cleans up classes/ARIA, and emits `ln-sortable:reordered` (`{ item, oldIndex, newIndex }`).
> State is governed strictly by the `data-ln-sortable` attribute; it makes zero network requests (persist order via a thin coordinator using [`ln-http`](./ln-http.md) `ln-http:request` with a deduplication `key`).

---

## 1. Core Behavior & Responsibility

- **Core Role:** Provides drag-and-drop reordering of direct child DOM elements within a parent container (`[data-ln-sortable]`).
- **Touch-Friendly Interaction:** Operates exclusively using the modern browser Pointer Events API (`pointerdown`, `pointermove`, `pointerup`, `pointercancel`), supporting mouse, touch, and stylus input without reliance on heavy HTML5 drag-and-drop APIs.
- Located in [`components/ln-sortable/src/ln-sortable.js`](../../components/ln-sortable/src/ln-sortable.js).

> [!IMPORTANT]
> **What the component does NOT do (Orthogonality Doctrine):**
> - **Does NOT persist order to the backend** — `ln-sortable` only updates the visual/DOM hierarchy (`insertBefore`). Saving the new order is delegated to a thin project coordinator listening for `ln-sortable:reordered` and dispatching [`ln-http`](./ln-http.md) Path B (`ln-http:request` with an explicit `key` to abort superseded in-flight reorder POSTs).
> - **Does NOT inject inline styles** — It avoids inline visual changes (such as `transform` or `position: absolute`). State transformations are applied via CSS classes (`.ln-sortable--dragging`, `.ln-sortable--drop-before`, `.ln-sortable--drop-after`, `.ln-sortable--active`) and ARIA attributes.
> - **Does NOT implement domain business logic** — It maintains strict component isolation, managing only coordinates and child DOM reordering.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Drag-anywhere list)

Annotating the container (`<ul>`, `<ol>`, or `<div>`) with `data-ln-sortable` makes all direct children interactive and draggable:

```html
<ul data-ln-sortable>
    <li>First Item</li>
    <li>Second Item</li>
    <li>Third Item</li>
</ul>
```

### Variant 1: Dedicated Handles (`data-ln-sortable-handle`)

To prevent accidental drags on mobile when clicking text/buttons inside list items, drag handles can be specified. If present, dragging is initiated ONLY from the handle:

```html
<ol data-ln-sortable>
    <li>
        <span data-ln-sortable-handle class="sortable-handle" aria-label="Move item">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-grip-vertical"></use></svg>
        </span>
        <span>Board Configuration</span>
    </li>
    <li>
        <span data-ln-sortable-handle class="sortable-handle" aria-label="Move item">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-grip-vertical"></use></svg>
        </span>
        <span>User Management</span>
    </li>
</ol>
```

### Variant 2: Disabled List (`data-ln-sortable="disabled"`)

Drag interactions can be blocked dynamically or statically:

```html
<ul data-ln-sortable="disabled">
    <li>Locked Item 1</li>
    <li>Locked Item 2</li>
</ul>
```

### Variant 3: Persisting Order with Automatic Cancellation (`ln-http` Path B + Rollback)

Wire `ln-sortable:reordered` to [`ln-http`](./ln-http.md) Path B (`ln-http:request` with a per-list `key`). If the user drags again before the previous save completes, `ln-http` automatically aborts the superseded in-flight POST silently (no `ln-http:error` is fired), so only the latest order commits. Track `lastConfirmedOrder` so rapid consecutive drags roll back cleanly to the last server-confirmed DOM state on failure:

```html
<ul id="task-list" data-ln-sortable>
    <li data-task-id="101">
        <span data-ln-sortable-handle class="sortable-handle">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-grip-vertical"></use></svg>
        </span>
        <span>Task 1: Database Config</span>
    </li>
    <li data-task-id="102">
        <span data-ln-sortable-handle class="sortable-handle">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-grip-vertical"></use></svg>
        </span>
        <span>Task 2: Implement REST APIs</span>
    </li>
</ul>

<script>
(function () {
    const list = document.getElementById('task-list');
    if (!list) return;

    let lastConfirmedOrder = Array.from(list.children);

    function rollback(message) {
        lastConfirmedOrder.forEach(function (node) {
            list.appendChild(node);
        });
        window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
            detail: { type: 'error', title: 'Error', message: message }
        }));
    }

    list.addEventListener('ln-sortable:reordered', function () {
        const body = new FormData();
        Array.from(list.children).forEach(function (child) {
            const id = child.getAttribute('data-task-id');
            if (id) body.append('ids[]', id);
        });

        // Same `key` tells ln-http Path B to abort any earlier in-flight POST for this list
        list.dispatchEvent(new CustomEvent('ln-http:request', {
            bubbles: true,
            detail: {
                url: '/api/tasks/reorder',
                method: 'POST',
                body: body,
                key: 'reorder-' + list.id
            }
        }));
    });

    list.addEventListener('ln-http:response', function (e) {
        if (!e.detail) return;
        if (!e.detail.ok) {
            rollback('Failed to sync order (' + e.detail.status + '). Rolled back changes.');
            return;
        }
        lastConfirmedOrder = Array.from(list.children);
        window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
            detail: { type: 'success', title: 'Saved', message: 'Order successfully saved.' }
        }));
    });

    // Aborted requests are silent and never dispatch ln-http:error
    list.addEventListener('ln-http:error', function () {
        rollback('Network error while saving order. Rolled back changes.');
    });
})();
</script>
```

> [!NOTE]
> `ln-http:request` intentionally forwards only `{ method, body, signal }` to `fetch()` (no custom `headers` field in `detail`). Use `FormData` with `ln-http:request` as shown above, or use Variant 4 when your backend requires custom headers such as `Content-Type: application/json`, `X-CSRF-TOKEN`, or `Authorization`.

### Variant 4: JSON POST with Custom Headers & Manual `AbortController`

When an endpoint requires JSON (`Content-Type: application/json`) or custom auth/CSRF headers, maintain a local `AbortController` per list in a lean IIFE coordinator:

```html
<script>
(function () {
    const list = document.getElementById('task-list');
    if (!list) return;

    let lastConfirmedOrder = Array.from(list.children);
    let controller = null;

    list.addEventListener('ln-sortable:reordered', async function () {
        if (controller) controller.abort();
        controller = new AbortController();
        const signal = controller.signal;

        const ids = Array.from(list.children)
            .map(function (child) { return child.getAttribute('data-task-id'); })
            .filter(Boolean);

        try {
            const response = await fetch('/api/tasks/reorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
                },
                body: JSON.stringify({ ids: ids }),
                signal: signal
            });
            if (!response.ok) throw new Error('Server error: ' + response.status);

            lastConfirmedOrder = Array.from(list.children);
            window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
                detail: { type: 'success', title: 'Saved', message: 'Order successfully saved.' }
            }));
        } catch (err) {
            if (err && err.name === 'AbortError') return; // Superseded by newer drag
            lastConfirmedOrder.forEach(function (node) { list.appendChild(node); });
            window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
                detail: { type: 'error', title: 'Error', message: 'Failed to sync order. Rolled back changes.' }
            }));
        }
    });
})();
</script>
```

---

## 3. Declarative API Contract (Attributes & Events)

### Attributes Table

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|
| `data-ln-sortable` | Wrapper | `"disabled"` \| `""` | `""` | Main component indicator. If `"disabled"`, drag reordering is deactivated. |
| `data-ln-sortable-handle` | Descendant of list item | Marker | — | If present, dragging can only start on this handle element. |
| `aria-roledescription` | Wrapper | `String` | `"sortable list"` | Automatically applied on initialization to assist screen readers. |
| `aria-grabbed` | Dragged item | `Boolean` string | `"true"` | Placed on the active item during drag; removed once dropped. |

### Programmatic JS API

Direct instance operations via `element.lnSortable`:

| Helper | Signature | Returns | Description |
|---|---|---|---|
| `element.lnSortable.isEnabled` | `(property)` | `Boolean` | Read-only query reflecting whether `data-ln-sortable` is active (not `"disabled"`). |
| `element.lnSortable.destroy` | `()` | `void` | Removes event bindings and cleans up the instance property. |

To enable or disable sorting programmatically, write the DOM attribute directly (`el.setAttribute('data-ln-sortable', '')` or `el.setAttribute('data-ln-sortable', 'disabled')`).

### Events API

All events bubble from the parent container (`this.dom`):

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|
| `ln-sortable:before-drag` | Emits | Yes | Dispatched on `pointerdown` before starting a drag. If canceled, dragging is aborted. | `{ item: HTMLElement, index: number }` |
| `ln-sortable:drag-start` | Emits | No | Dispatched when dragging commences and pointer capture is acquired. | `{ item: HTMLElement, index: number }` |
| `ln-sortable:reordered` | Emits | No | Dispatched upon pointer release ONLY if the DOM index changed. | `{ item: HTMLElement, oldIndex: number, newIndex: number }` |
| `ln-sortable:enabled` | Emits | No | Dispatched when transitioning from `"disabled"` to active. | `{ target: HTMLElement }` |
| `ln-sortable:disabled` | Emits | No | Dispatched when `data-ln-sortable` changes to `"disabled"`. | `{ target: HTMLElement }` |

---

## 4. CSS Styling & Behavioral Concept

### CSS State Hooks

| CSS Class | Target Element | Description |
|---|---|---|
| `.ln-sortable--active` | Container | Active while a drag session is in progress. Used to suppress text selection. |
| `.ln-sortable--dragging` | Dragged Item | Active on the item being moved. Usually lowers opacity (e.g., `opacity: 0.4`). |
| `.ln-sortable--drop-before` | Sibling Item | Applied to a sibling when the pointer is hovering in its top half. Displays top drop indicators. |
| `.ln-sortable--drop-after` | Sibling Item | Applied to a sibling when the pointer is hovering in its bottom half. Displays bottom drop indicators. |

### Recommended SCSS Styles

```scss
[data-ln-sortable] {
    list-style: none;
    padding: 0;
    margin: 0;

    &.ln-sortable--active {
        user-select: none;
    }

    > li, > div {
        user-select: none;
        transition: box-shadow 0.15s ease, opacity 0.15s ease;

        &.ln-sortable--dragging {
            opacity: 0.4;
        }

        &.ln-sortable--drop-before {
            box-shadow: inset 0 2px 0 0 hsl(var(--color-primary));
        }

        &.ln-sortable--drop-after {
            box-shadow: inset 0 -2px 0 0 hsl(var(--color-primary));
        }
    }
}

[data-ln-sortable-handle],
.sortable-handle {
    touch-action: none;
    cursor: grab;

    &:active {
        cursor: grabbing;
    }
}
```

### Behavioral Concept (Pointer Capture & Midpoint Collision)

- **Pointer Capture:** On `pointerdown`, the handle obtains pointer capture (`setPointerCapture`). This prevents drag interruption if the mouse/finger moves outside the viewport or off the list items during rapid movement.
- **Midpoint Collision:** During movement, the component measures the center line of surrounding elements (`rect.top + rect.height / 2`). Hovering in the top half triggers `.ln-sortable--drop-before`, and the bottom half triggers `.ln-sortable--drop-after`.

---

## 5. Accessibility (ARIA) & Common Pitfalls

### ARIA & Keyboard

- **`aria-roledescription="sortable list"`:** Placed on the root container so screen readers describe the drag capability.
- **`aria-grabbed="true"`:** Dynamically toggled on the active element to indicate selection state.

### Common Pitfalls & Anti-patterns

> [!CAUTION]
> 1. **Omitting `touch-action: none;` on Drag Triggers:**
>    On touch devices, if drag handles or target elements lack `touch-action: none`, the browser will intercept touch gestures as page scrolling (pan-scroll). This terminates pointer capture immediately and triggers `pointercancel`.
> 2. **Assuming Auto-Syncing:**
>    `ln-sortable` is solely a DOM sorting primitive. It **never performs network requests**. Wire `ln-sortable:reordered` to [`ln-http`](./ln-http.md) (`ln-http:request` with a per-list `key`) — or a local `AbortController` when custom headers are needed — so rapid drags abort superseded POSTs.
> 3. **Improper Handle Nesting:**
>    `data-ln-sortable-handle` elements must reside within a direct child element of the `data-ln-sortable` container. If placed outside, the sorting engine cannot associate the target gesture with a list item.
> 4. **Drags Triggered on Form Elements:**
>    If no handle is defined, clicking links, buttons, or input text inside items starts a drag action. For lists with interactive controls, **always define a `data-ln-sortable-handle`**.

---

## 6. Flow Diagram & Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Pointer)
    participant DOM as DOM ([data-ln-sortable])
    participant JS as ln-sortable.js
    participant Coord as Coordinator / ln-http

    User->>DOM: PointerDown on handle or item
    DOM->>JS: event: pointerdown
    JS->>DOM: Emit cancelable 'ln-sortable:before-drag'
    alt if before-drag is canceled (preventDefault)
        DOM-->>User: Aborts interaction
    else is allowed
        JS->>DOM: e.preventDefault() & handle.setPointerCapture()
        JS->>DOM: Add .ln-sortable--dragging & aria-grabbed="true"
        JS->>DOM: Add .ln-sortable--active to container
        JS->>DOM: Emit 'ln-sortable:drag-start'
        
        loop Dragging Session
            User->>DOM: PointerMove
            DOM->>JS: event: pointermove
            JS->>DOM: Calculate collision midpoints, toggle --drop-before / --drop-after
        end

        User->>DOM: PointerUp / PointerCancel
        DOM->>JS: event: pointerup
        JS->>DOM: Perform DOM insertion (insertBefore)
        JS->>DOM: Clean up CSS classes & aria-grabbed
        JS->>DOM: Emit 'ln-sortable:reordered' { item, oldIndex, newIndex }
        DOM->>Coord: Dispatch ln-http:request (keyed POST, aborts prior in-flight reorder)
    end
```

---

## 7. Related Components

- [`ln-http.md`](./ln-http.md) — Explicit-key (`Path B`) request deduplication that aborts superseded in-flight reorder POSTs during rapid drags.
- [`ln-repeater.md`](./ln-repeater.md) — Composes `data-ln-sortable` on `[data-ln-repeater-list]` with optional sequential reindexing on `ln-sortable:reordered`.
- [`ln-table.md`](./ln-table.md) — Table displays that utilize sortable row primitives.
- [`ln-data-coordinator.md`](./ln-data-coordinator.md) — Mediates backend syncing for model order modifications.
- [`ln-toast.md`](./ln-toast.md) — Outputs success/error status toasts for reordering transactions.
