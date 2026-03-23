# ln-dropdown

Dropdown menu component — teleports menu to `<body>` for correct stacking, positions relative to trigger, repositions on scroll, closes on outside click or resize.

Built on top of `ln-toggle` for open/close state management.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-dropdown` | wrapper element | Creates dropdown instance; contains trigger + menu |
| `data-ln-toggle-for="menuId"` | trigger (`<button>`) | Opens/closes the menu by ID |
| `data-ln-toggle` | menu element | The toggleable menu (managed by ln-toggle) |
| `data-ln-dropdown-menu` | menu element | Auto-added by JS; used for CSS styling |

## HTML Pattern

```html
<div data-ln-dropdown>
    <button type="button" data-ln-toggle-for="my-menu">Open</button>
    <ul id="my-menu" data-ln-toggle>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/settings">Settings</a></li>
        <li><hr></li>
        <li><a href="/logout">Log out</a></li>
    </ul>
</div>
```

## Behavior

### Teleport

When the menu opens, it is moved to `<body>` with `position: fixed` to escape CSS stacking contexts (`overflow: hidden`, `z-index` layers). A placeholder comment preserves the original DOM position. On close, the menu returns to its original location.

### Positioning

Menu is positioned relative to the trigger element:

- **Vertical**: prefer below trigger; flip above if insufficient viewport space
- **Horizontal**: prefer right-aligned to trigger; flip left-aligned if no room
- **Gap**: uses `--spacing-xs` token between trigger and menu

### Scroll → reposition

While open, the menu repositions on every scroll event (including nested scrollable containers via capture phase). The menu follows the trigger — no detachment on scroll.

### Resize → close

Viewport resize closes the menu (layout reflow makes repositioning unreliable).

### Outside click → close

Clicking outside both the trigger wrapper and the teleported menu closes the dropdown.

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-dropdown:open` | yes | `{ target: menuElement }` |
| `ln-dropdown:close` | yes | `{ target: menuElement }` |
| `ln-dropdown:destroyed` | yes | `{ target: wrapperElement }` |

```javascript
document.addEventListener('ln-dropdown:open', function (e) {
    console.log('Dropdown opened:', e.detail.target.id);
});
```

## API

```javascript
var el = document.querySelector('[data-ln-dropdown]');
el.lnDropdown.destroy();  // cleanup, remove listeners, teleport back
```

## CSS

Consumer must provide menu styling. The `data-ln-dropdown-menu` attribute is auto-added for targeting:

```scss
[data-ln-dropdown-menu] {
    display: none;
    // ... menu styles (bg, border, shadow, padding)

    &.open {
        display: block;
    }

    a, button {
        // ... item styles
    }
}
```

See `ln-dropdown.scss` for the default implementation.

## Integration with ln-toggle

`ln-dropdown` delegates open/close state to `ln-toggle`. It listens for `ln-toggle:open` and `ln-toggle:close` events on the menu element to trigger teleport and positioning. The trigger button uses `data-ln-toggle-for` to target the menu.

## Dynamic elements

MutationObserver auto-initializes new `[data-ln-dropdown]` elements added to the DOM (AJAX, dynamic content).
