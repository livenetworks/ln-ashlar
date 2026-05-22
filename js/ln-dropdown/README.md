# ln-dropdown

> Dropdown menu — wraps an `[data-ln-toggle]` menu, teleports it to
> `<body>` on open, positions relative to the trigger, and closes on
> outside click or viewport resize. Open/close state lives on the
> inner `data-ln-toggle` attribute (managed by `ln-toggle`).

For internal mechanics — teleport flow, positioning algorithm, listener
lifecycle — see [`docs/js/dropdown.md`](../../docs/js/dropdown.md).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-dropdown` | wrapper element | Creates dropdown instance; contains trigger + menu |
| `data-ln-toggle-for="menuId"` | trigger (`<button>`) | Opens/closes the menu by ID |
| `data-ln-toggle` | menu element | The toggleable menu (managed by ln-toggle) |
| `data-ln-dropdown-menu` | menu element | Auto-added by JS; used for CSS styling |

**Auto-added ARIA**: `aria-haspopup="menu"` and `aria-expanded` on the trigger; `role="menu"` on the menu element; `role="menuitem"` on each direct child of the menu.

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

- **Teleport** — on open, the menu is moved to `<body>` so it escapes ancestor `overflow: hidden` and stacking contexts; on close it returns to its original DOM position.
- **Positioning** — menu opens below the trigger, right-aligned to it; flips above if there is no room below; flips left-aligned if there is no room on the right. Gap is the `--size-xs` token (override on the menu to tune).
- **Scroll** — while open, the menu repositions on every scroll (including nested scrollable containers) so it tracks the trigger.
- **Resize** — viewport resize closes the menu (layout reflow makes repositioning unreliable).
- **Outside click** — clicking outside the wrapper or the menu closes it.

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-dropdown:open` | yes | no | `{ target: menuElement }` |
| `ln-dropdown:close` | yes | no | `{ target: menuElement }` |
| `ln-dropdown:destroyed` | yes | no | `{ target: wrapperElement }` |

```javascript
document.addEventListener('ln-dropdown:open', function (e) {
    console.log('Dropdown opened:', e.detail.target.id);
});
```

## API

Each `[data-ln-dropdown]` element gets an instance at
`element.lnDropdown`. The dropdown does not have its own
`open()` / `close()` methods — open/close lives on the inner
`[data-ln-toggle]` element. To open or close programmatically,
toggle the `data-ln-toggle` attribute on the menu (or click the
trigger).

```javascript
const el = document.querySelector('[data-ln-dropdown]');
const menu = el.querySelector('[data-ln-toggle]');

// Open / close via attribute on the menu:
menu.setAttribute('data-ln-toggle', 'open');
menu.setAttribute('data-ln-toggle', 'close');

// Cleanup the dropdown instance:
el.lnDropdown.destroy();
```

## Integration & Development

### Integration

#### 1. In-Bundle (Standard Integration)
To use `ln-dropdown` as part of the main `ln-ashlar` bundle, include the compiled IIFE in your document:
```html
<script src="dist/ln-ashlar.iife.js" defer></script>
```

#### 2. Standalone (Zero-Dependency IIFE)
If you wish to use `ln-dropdown` standalone without the rest of the bundle, load its individual IIFE compiled script:
```html
<script src="js/ln-dropdown/ln-dropdown.js" defer></script>
```

### Source Files

For development, testing, and debugging, refer to the following local file paths:
- **Source of Truth (Active Development):** [js/ln-dropdown/src/ln-dropdown.js](file:///c:/laragon/www/ln-ashlar/js/ln-dropdown/src/ln-dropdown.js)
- **Compiled Standalone Build:** [js/ln-dropdown/ln-dropdown.js](file:///c:/laragon/www/ln-ashlar/js/ln-dropdown/ln-dropdown.js)

