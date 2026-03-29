# Toggle

Generic toggle component — adds/removes `open` class on an element. CSS defines the animation. Works for sidebar, collapsible sections, dropdowns — anything. File: `js/ln-toggle/ln-toggle.js`.

## Single Source of Truth

The `data-ln-toggle` attribute is the single source of truth. All state changes flow through it — the JS API, trigger buttons, and external code all set the attribute, and the MutationObserver reacts by applying the `.open` class and dispatching events.

## HTML

```html
<!-- Sidebar -->
<aside id="sidebar" class="sidebar open" data-ln-toggle="open">
    <button class="ln-icon-close" data-ln-toggle-for="sidebar" data-ln-toggle-action="close"></button>
    <nav>...</nav>
</aside>
<button class="ln-icon-menu" data-ln-toggle-for="sidebar"></button>

<!-- Collapsible section -->
<header data-ln-toggle-for="section1">Title</header>
<section id="section1" data-ln-toggle="open" class="collapsible">
    <article class="collapsible-body">Content here</article>
</section>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-toggle` | target element | Creates instance, starts closed |
| `data-ln-toggle="open"` | target element | Starts open (gets `.open` class) |
| `data-ln-toggle-for="id"` | button | References target element by ID |
| `data-ln-toggle-action="open\|close"` | button | Explicit action (default: toggle) |

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-toggle:before-open` | yes | **yes** | `{ target }` |
| `ln-toggle:open` | yes | no | `{ target }` |
| `ln-toggle:before-close` | yes | **yes** | `{ target }` |
| `ln-toggle:close` | yes | no | `{ target }` |

If `before-open`/`before-close` is canceled (`preventDefault()`), the observer reverts the attribute.

## API

```js
const el = document.getElementById('sidebar');
el.lnToggle.open();       // sets attribute → observer applies state
el.lnToggle.close();      // sets attribute → observer applies state
el.lnToggle.toggle();     // toggles based on current state
el.lnToggle.isOpen;       // boolean

// Direct attribute change — identical result
el.setAttribute('data-ln-toggle', 'open');
el.setAttribute('data-ln-toggle', 'close');

// Manual initialization (Shadow DOM, iframe only)
window.lnToggle(container);
```
