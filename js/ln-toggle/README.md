# ln-toggle

Generic toggle component — adds/removes `open` class on an element.
CSS on the element defines the animation. Works for sidebar, collapsible sections, dropdown — anything.

## Single Source of Truth

The `data-ln-toggle` attribute is the single source of truth for open/closed state:
- `data-ln-toggle="open"` — element is open
- `data-ln-toggle="close"` (or any other value) — element is closed

All state changes flow through the attribute. The JS API methods (`open()`, `close()`, `toggle()`) simply set the attribute — the MutationObserver detects the change and applies the actual state (`.open` class, events). This means external code can also set the attribute directly and the component reacts identically.

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
el.lnToggle.open();       // sets data-ln-toggle="open" → observer applies state
el.lnToggle.close();      // sets data-ln-toggle="close" → observer applies state
el.lnToggle.toggle();     // toggles based on current state
el.lnToggle.isOpen;       // boolean (read-only)
el.lnToggle.destroy();    // removes instance, dispatches ln-toggle:destroyed

// Direct attribute change — equivalent to calling the API
el.setAttribute('data-ln-toggle', 'open');   // same as el.lnToggle.open()
el.setAttribute('data-ln-toggle', 'close');  // same as el.lnToggle.close()

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
| `ln-toggle:destroyed` | yes | no | `{ target: HTMLElement }` |

```javascript
// Listen for open
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Opened:', e.detail.target.id);
});

// Cancel opening conditionally
document.addEventListener('ln-toggle:before-open', function (e) {
    if (!userHasPermission()) e.preventDefault();
    // observer reverts the attribute back to "close"
});

// Close from external code (e.g. accordion coordinator)
el.setAttribute('data-ln-toggle', 'close');
```

If `before-open` or `before-close` is canceled via `preventDefault()`, the observer automatically reverts the attribute to the previous value.

## Examples

### Sidebar

```html
<aside id="sidebar-left" class="sidebar open" data-ln-toggle="open">
    <button aria-label="Close sidebar" data-ln-toggle-for="sidebar-left" data-ln-toggle-action="close">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
    <nav>...</nav>
</aside>

<button aria-label="Open menu" data-ln-toggle-for="sidebar-left">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
</button>
```

> **Icons:** Use SVG sprite icons — `#ln-x` for close, `#ln-menu` for hamburger.
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
// Via API (sets the attribute, observer does the rest)
document.getElementById('sidebar-left').lnToggle.open();
document.getElementById('sidebar-left').lnToggle.close();

// Via attribute (identical result — attribute is the single source of truth)
document.getElementById('sidebar-left').setAttribute('data-ln-toggle', 'open');
document.getElementById('sidebar-left').setAttribute('data-ln-toggle', 'close');

document.addEventListener('ln-toggle:close', function (e) {
    if (e.detail.target.id === 'sidebar-left') {
        console.log('Sidebar closed');
    }
});
```
