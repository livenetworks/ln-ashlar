# ln-toggle

Generic toggle component — adds/removes `open` class on an element.
CSS on the element defines the animation. Works for sidebar, collapsible sections, dropdown — anything.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-toggle` | target element | Creates an instance, starts closed |
| `data-ln-toggle="open"` | target element | Starts open (gets `.open` class) |
| `data-ln-toggle-for="id"` | button | References the target element by ID |
| `data-ln-toggle-action="open\|close"` | button | Explicit action (default: toggle) |

## API

```javascript
// Instance API (on DOM element)
const el = document.getElementById('my-element');
el.lnToggle.open();
el.lnToggle.close();
el.lnToggle.toggle();
el.lnToggle.isOpen;  // boolean

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnToggle(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-toggle:before-open` | yes | **yes** | `{ target: HTMLElement }` |
| `ln-toggle:open` | yes | no | `{ target: HTMLElement }` |
| `ln-toggle:before-close` | yes | **yes** | `{ target: HTMLElement }` |
| `ln-toggle:close` | yes | no | `{ target: HTMLElement }` |
| `ln-toggle:request-close` | no | no | — |
| `ln-toggle:request-open` | no | no | — |

```javascript
// Listen for open
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Opened:', e.detail.target.id);
});

// Cancel opening conditionally
document.addEventListener('ln-toggle:before-open', function (e) {
    if (!userHasPermission()) e.preventDefault();
});

// Request toggle to close (e.g. from accordion coordinator)
element.dispatchEvent(new CustomEvent('ln-toggle:request-close'));

// Request toggle to open
element.dispatchEvent(new CustomEvent('ln-toggle:request-open'));
```

`ln-toggle:request-close` and `ln-toggle:request-open` are **incoming** events — external code dispatches them on the toggle element. Toggle listens on itself and reacts if the state is appropriate. Opening/closing goes through the normal lifecycle (`before-open/close` → `open/close`).

## Examples

### Sidebar

```html
<aside id="sidebar-left" class="sidebar open" data-ln-toggle="open">
    <button class="ln-icon-close" data-ln-toggle-for="sidebar-left" data-ln-toggle-action="close"></button>
    <nav>...</nav>
</aside>

<button class="ln-icon-menu" data-ln-toggle-for="sidebar-left"></button>
```

> **Icons:** ALWAYS use `.ln-icon-close` / `.ln-icon-menu` classes.
> NEVER use `&times;`, `☰`, or other Unicode characters.

CSS for sidebar (in `_app-layout.scss`):
```scss
.sidebar {
    transform: translateX(-100%);
    @include transition;
    &.open { transform: translateX(0); }
}
```

### Collapsible section

```html
<header data-ln-toggle-for="section1">Title</header>
<section id="section1" data-ln-toggle="open" class="collapsible">
    <article class="collapsible-body">
        Content here
    </article>
</section>
```

- `.collapsible` = parent, padding:0, collapses to 0
- `.collapsible-body` = child, padding/margins go here
- `data-ln-toggle-for` on `<header>` — entire header is a clickable trigger

> **Semantics:** The collapsible container must NOT be `<main>` — HTML spec allows
> only one `<main>` per page. Use `<section>` or `<div class="collapsible">`.

CSS for collapse — the framework provides the `.collapsible` class (grid-template-rows animation).
For semantic usage in project SCSS:
```scss
#section1              { @include collapsible; }
#section1 > .my-body   { @include collapsible-content; }
```

### Programmatic

```javascript
document.getElementById('sidebar-left').lnToggle.open();
document.getElementById('sidebar-left').lnToggle.close();

document.addEventListener('ln-toggle:close', function (e) {
    if (e.detail.target.id === 'sidebar-left') {
        console.log('Sidebar closed');
    }
});
```
