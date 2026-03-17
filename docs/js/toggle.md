# Toggle

Generic toggle component — adds/removes `open` class on an element. CSS defines the animation. Works for sidebar, collapsible sections, dropdowns — anything. File: `js/ln-toggle/ln-toggle.js`.

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
| `ln-toggle:request-close` | no | no | — |
| `ln-toggle:request-open` | no | no | — |

`request-close` and `request-open` are **incoming** events — external code dispatches them on the toggle element.

## API

```js
const el = document.getElementById('sidebar');
el.lnToggle.open();
el.lnToggle.close();
el.lnToggle.toggle();
el.lnToggle.isOpen;  // boolean

// Manual initialization
window.lnToggle(container);
```
