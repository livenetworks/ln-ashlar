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
| `_teleportRestore` | Function\|null | Cleanup closure returned by `teleportToBody()`; restores menu to original DOM position on close |

### Teleport + Placement (delegated to ln-core)

```
ln-toggle:open fires on toggleEl
    |
    v
_onToggleOpen():
    1. this._teleportRestore = teleportToBody(toggleEl)  — moves menu to <body>, saves restore closure
    2. toggleEl.style.position = 'fixed'
    3. _reposition()  — measure + place via ln-core helpers
    |
    v
ln-toggle:close fires on toggleEl
    |
    v
_onToggleClose():
    1. Clear inline position styles (position, top, left, right, transform, margin)
    2. this._teleportRestore()  — returns menu to original DOM position
    3. this._teleportRestore = null
```

### Positioning Algorithm

```
_reposition():
    1. Get trigger's bounding rect (getBoundingClientRect)
    2. measureHidden(toggleEl)  — ln-core: hidden-safe dimension read
    3. Read --size-xs token for gap (~4px)
    4. computePlacement(rect, size, 'bottom-end', gap)  — ln-core: bottom-end = below trigger, right-aligned;
       flips to top-end if no room below; clamped to viewport
    5. Apply top/left as fixed coordinates
```

`computePlacement` accepts floating-ui-style `<side>-<alignment>` strings. `'bottom-end'` aligns the right edge of the menu to the right edge of the trigger. Alignment is preserved through the fallback chain (e.g. `bottom-end` → `top-end` when flipping above).

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
