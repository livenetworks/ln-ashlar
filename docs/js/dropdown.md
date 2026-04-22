# Dropdown

Positioned dropdown menu. Wraps an `ln-toggle` element, teleports it to `<body>` with fixed positioning. File: `js/ln-dropdown/ln-dropdown.js`.

## HTML

```html
<nav data-ln-dropdown>
    <button data-ln-toggle-for="user-menu">Options</button>
    <ul id="user-menu" data-ln-toggle>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><button type="button">Logout</button></li>
    </ul>
</nav>
```

The `data-ln-dropdown` wrapper coordinates with the inner `data-ln-toggle` element. The trigger button uses `data-ln-toggle-for` (handled by ln-toggle).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-dropdown` | wrapper element | Creates instance |
| `data-ln-toggle` | menu element (inside wrapper) | The menu to position (managed by ln-toggle) |
| `data-ln-toggle-for="id"` | trigger button | Opens/closes the menu (managed by ln-toggle) |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-dropdown:open` | yes | no | `{ target }` |
| `ln-dropdown:close` | yes | no | `{ target }` |
| `ln-dropdown:destroyed` | yes | no | `{ target }` |

## API

```js
const dropdown = document.querySelector('[data-ln-dropdown]');
dropdown.lnDropdown.destroy();   // cleanup all listeners, teleport back

// Manual init (Shadow DOM, iframe only)
window.lnDropdown(container);
```

Open/close is controlled via the inner ln-toggle element, not directly on the dropdown instance.

## Behavior

- **Teleport**: on open, menu is moved to `<body>` with `position: fixed` to escape overflow/clipping contexts
- **Positioning**: below trigger (right-aligned), flips above if no room below, flips left-aligned if no room on the right
- **Close on outside click**: clicks outside both the wrapper and menu close the dropdown
- **Close on resize**: window resize closes the dropdown
- **Reposition on scroll**: window scroll repositions the menu (while open)
- **Teleport back**: on close, menu is returned to its original DOM position
- **ARIA**: sets `aria-haspopup="menu"` and `aria-expanded` on trigger, `role="menu"` on menu, `role="menuitem"` on direct children

---

## Internal Architecture

### State

Each `[data-ln-dropdown]` element gets a `_component` instance stored at `element.lnDropdown`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The wrapper element |
| `toggleEl` | Element | The `[data-ln-toggle]` menu inside the wrapper |
| `triggerBtn` | Element | The `[data-ln-toggle-for]` trigger button |
| `_menuParent` | Element | Original parent of the menu (before teleport) |
| `_placeholder` | Comment | DOM comment node marking the menu's original position |

### Teleport Mechanism

```
ln-toggle:open fires on toggleEl
    |
    v
_teleportToBody():
    1. Save reference to menu's current parent (_menuParent)
    2. Insert a comment node placeholder where the menu was
    3. appendChild(menu) to document.body
    4. Set position: fixed
    5. _positionMenu() — calculate coordinates
    |
    v
ln-toggle:close fires on toggleEl
    |
    v
_teleportBack():
    1. Clear inline position styles
    2. insertBefore(menu, placeholder) — return to original position
    3. Remove placeholder comment
```

### Positioning Algorithm

```
_positionMenu():
    1. Get trigger's bounding rect
    2. Measure menu dimensions (briefly show if hidden)
    3. Read --size-xs token for gap
    4. Vertical: prefer below trigger, flip above if no room, fallback to bottom of viewport
    5. Horizontal: prefer right-aligned to trigger, flip left-aligned if no room, fallback to right edge
    6. Apply top/left as fixed coordinates
```

### Event Listeners Lifecycle

| Listener | Added | Removed |
|----------|-------|---------|
| `ln-toggle:open` on toggleEl | construction | `destroy()` |
| `ln-toggle:close` on toggleEl | construction | `destroy()` |
| `click` on document (outside click) | on open (deferred via `setTimeout(0)`) | on close |
| `scroll` on window (reposition) | on open | on close |
| `resize` on window (close) | on open | on close |

The outside click listener is deferred by one tick (`setTimeout(0)`) to prevent the opening click from immediately closing the menu.

### Dependency on ln-toggle

Dropdown does not manage open/close state itself. It listens to `ln-toggle:open` and `ln-toggle:close` events from the inner toggle element. The toggle's `data-ln-toggle` attribute remains the single source of truth for the menu's open/closed state.

### MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `findElements` auto-initializes dropdowns
- **`attributes`** (`data-ln-dropdown`): attribute added to existing element → initializes
