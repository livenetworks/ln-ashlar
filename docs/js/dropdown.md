# Dropdown

Implementation notes for `ln-dropdown`. The user-facing contract —
attributes, events, API examples — lives in
[`js/ln-dropdown/README.md`](../../js/ln-dropdown/README.md). This
document covers internal mechanics: per-component lifecycle around
the shared `ln-core` helpers (`computePlacement`, `teleportToBody`,
`measureHidden`).

File: `js/ln-dropdown/ln-dropdown.js`

## State

Each `[data-ln-dropdown]` element gets a `_component` instance stored at `element.lnDropdown`. Instance state:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | The wrapper element |
| `toggleEl` | Element | The `[data-ln-toggle]` menu inside the wrapper |
| `triggerBtn` | Element | The `[data-ln-toggle-for]` trigger button |
| `_teleportRestore` | Function\|null | Cleanup closure returned by `teleportToBody()`; restores menu to original DOM position on close |

## Teleport + Placement (delegated to ln-core)

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

## Positioning Algorithm

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

## Event Listeners Lifecycle

| Listener | Added | Removed |
|----------|-------|---------|
| `ln-toggle:open` on toggleEl | construction | `destroy()` |
| `ln-toggle:close` on toggleEl | construction | `destroy()` |
| `click` on document (outside click) | on open (deferred via `setTimeout(0)`) | on close |
| `scroll` on window (reposition) | on open | on close |
| `resize` on window (close) | on open | on close |

The outside click listener is deferred by one tick (`setTimeout(0)`) to prevent the opening click from immediately closing the menu.

## Dependency on ln-toggle

Dropdown does not manage open/close state. It listens for
`ln-toggle:open` and `ln-toggle:close` on the inner
`[data-ln-toggle]` element and runs its teleport / positioning /
listener-lifecycle steps in response.

## MutationObserver

A single global observer watches `document.body` for:

- **`childList`** (subtree): new elements → `findElements` auto-initializes dropdowns
- **`attributes`** (`data-ln-dropdown`): attribute added to existing element → initializes
