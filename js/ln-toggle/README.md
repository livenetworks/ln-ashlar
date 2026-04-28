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

## Trigger A11y — `aria-expanded`

When a toggle's open/closed state changes, every `[data-ln-toggle-for]`
pointing at it gets `aria-expanded="true"` or `aria-expanded="false"`
synced automatically. This works across DOM distance — triggers and the
target panel can live anywhere in the document.

The CSS chevron-rotation rule is driven by this attribute, so any
`<element class="ln-chevron">` inside a `[data-ln-toggle-for]` rotates
180° automatically on open. Works for accordion items AND standalone
toggles — no special wrapper needed.

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
    @include motion-safe {
        transition: transform var(--transition-base);
    }
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

## Persistence

Add `data-ln-persist` to any toggle element to remember its open/closed state across page loads. State is stored in `localStorage` and restored on the next visit.

**Requirements:**
- Element must have an `id` attribute, OR a non-empty `data-ln-persist="custom-key"` value
- If neither is provided, a `console.warn` is emitted and persistence is silently skipped — the toggle still works normally

**Storage key format:** `ln:toggle:{pagePath}:{id}` — keys are page-scoped so elements with the same `id` on different pages don't collide.

**Graceful degradation:** If `localStorage` is unavailable (e.g. private browsing, storage full), the toggle works normally without persistence.

### Using element `id` as key (default)

```html
<aside id="sidebar" data-ln-toggle="close" data-ln-persist>
    ...
</aside>
```

Storage key: `ln:toggle:/admin/users:sidebar`

### Using an explicit custom key

```html
<aside id="sidebar" data-ln-toggle="close" data-ln-persist="sidebar">
    ...
</aside>
```

The value of `data-ln-persist` overrides the `id` as the storage key.

### Works with ln-accordion automatically

Add `data-ln-persist` to each `[data-ln-toggle]` inside an accordion. Each panel persists its state individually. On page reload, the persisted panel is restored as open, and the accordion's single-open logic closes any others.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Section 1</header>
        <section id="panel1" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 1</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">Section 2</header>
        <section id="panel2" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 2</article>
        </section>
    </li>
</ul>
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
