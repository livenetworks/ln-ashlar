# ln-toggle

Open/close state primitive. The panel's `data-ln-toggle` attribute is the source of truth: API methods, trigger clicks, sibling components, external scripts, and DevTools all funnel through `setAttribute`, and a `MutationObserver` runs the open/close pipeline.

Used by `ln-accordion`, `ln-dropdown`, sidebar drawers, and dismissible alerts.

## Markup

Panel and trigger pair by ID; they can live anywhere in the DOM relative to each other.

```html
<button data-ln-toggle-for="my-panel">Toggle</button>

<section id="my-panel" data-ln-toggle class="collapsible">
    <article class="collapsible-body">
        <p>Hello.</p>
    </article>
</section>
```

- **Panel** — `[data-ln-toggle]`. Attribute presence creates the instance; value `"open"` means open, anything else means closed.
- **Trigger** — `[data-ln-toggle-for="id"]`. Click toggles the matching panel. Any tag works; `<button>` is the right semantic, `<header>` is common in accordions.
- **Multiple triggers per panel** are supported. All matching `[data-ln-toggle-for]` elements stay in sync — `aria-expanded` updates on every state change.

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-toggle` | panel | Creates the instance. `"open"` = open; anything else = closed. |
| `data-ln-toggle-for="id"` | trigger | References the panel by ID. Click toggles it. |
| `data-ln-toggle-action="open\|close"` | trigger | Forces one direction. Default: `toggle`. |
| `data-ln-persist` | panel | Opts in to `localStorage` persistence. Boolean, or `data-ln-persist="custom-key"`. |

`aria-expanded` on the trigger is written by the component — not an input.

### Trigger action

`data-ln-toggle-action="close"` is the canonical pattern for an inline close button (the X inside a drawer or alert):

```html
<button aria-label="Close" data-ln-toggle-for="drawer" data-ln-toggle-action="close">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
</button>
```

The button always closes — safe to leave in the DOM when the panel is closed (no-op on click).

### Chevron rotation

The library's `[data-ln-toggle-for][aria-expanded="true"] .ln-chevron { transform: rotate(180deg); }` rule (`scss/components/_toggle.scss`) rotates any chevron icon inside any matching trigger when its panel opens. Drop a `<svg class="ln-icon ln-chevron">` inside any trigger and it rotates automatically.

## Persistence

Add `data-ln-persist` to a panel to opt into `localStorage` persistence
via the shared `ln-core` persist helper. State restores on init before
any event fires; the persisted value wins over the markup default. See
[`docs/js/core.md`](../../docs/js/core.md) for the storage-key format
and lifecycle.

## Events

All events bubble. `detail.target` is always the panel element.

| Event | Cancelable | Dispatched when |
|---|---|---|
| `ln-toggle:before-open` | **yes** | After attribute flips to `"open"`, before `.open` class added. `preventDefault()` reverts to `"close"`. |
| `ln-toggle:open` | no | After `.open` class, `aria-expanded` sync, persist write. |
| `ln-toggle:before-close` | **yes** | After attribute flips to `"close"`, before `.open` class removed. `preventDefault()` reverts to `"open"`. |
| `ln-toggle:close` | no | After `.open` class removed, `aria-expanded` synced, persist written. |
| `ln-toggle:destroyed` | no | First action inside `destroy()`. |

```js
document.addEventListener('ln-toggle:before-open', function (e) {
    if (e.detail.target.id === 'admin-panel' && !userIsAdmin()) {
        e.preventDefault();
    }
});
```

## API

Each `[data-ln-toggle]` element carries an `lnToggle` property pointing to its instance.

```js
const el = document.getElementById('my-panel');

el.setAttribute('data-ln-toggle', 'open');   // open the panel
el.setAttribute('data-ln-toggle', 'close');  // close the panel
el.lnToggle.isOpen;                          // boolean — read-only
el.lnToggle.destroy();                       // detach trigger listeners, dispatch :destroyed
```

The attribute is the only mutator. There is no `open()` / `close()` /
`toggle()` method. `destroy()` is the only public method — it detaches
trigger listeners and dispatches `:destroyed`, work the attribute alone
cannot do.

`window.lnToggle(root)` upgrades a custom root (Shadow DOM, iframe). Ordinary AJAX inserts and `setAttribute` on existing elements are handled automatically by the document-level observer.

## Examples

### Sidebar drawer

```html
<aside id="app-sidebar" class="app-sidebar" data-ln-toggle="open" data-ln-persist>
    <header>
        <h2>Menu</h2>
        <button aria-label="Close sidebar"
                data-ln-toggle-for="app-sidebar"
                data-ln-toggle-action="close">
            <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
        </button>
    </header>
    <nav>
        <a href="/admin/users">Users</a>
        <a href="/admin/clients">Clients</a>
    </nav>
</aside>

<button class="menu-toggle" aria-label="Open menu" data-ln-toggle-for="app-sidebar">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-menu"></use></svg>
</button>
```

`@mixin sidebar-drawer` (`scss/config/mixins/_app-shell.scss`) reads `[data-ln-toggle="open"]` directly from CSS — no JS coordinator needed.

### Collapsible section

```html
<header data-ln-toggle-for="advanced">
    <strong>Advanced options</strong>
    <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
</header>
<section id="advanced" data-ln-toggle class="collapsible">
    <article class="collapsible-body">
        <p>Hidden by default.</p>
    </article>
</section>
```

`.collapsible` animates `grid-template-rows: 0fr ↔ 1fr`; `.collapsible-body` holds the padding. Padding goes on the body, never on `.collapsible` directly — the parent must collapse to zero height cleanly.

### Dismissible alert

```html
<div class="alert" id="trial-notice" data-ln-toggle="open" data-ln-persist role="status">
    <p>Your trial expires in 5 days.</p>
    <button aria-label="Dismiss"
            data-ln-toggle-for="trial-notice"
            data-ln-toggle-action="close">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</div>
```

`.alert[data-ln-toggle="close"] { display: none; }` (`scss/components/_alert.scss`) hides the alert; `data-ln-persist` keeps it dismissed across reloads.

## Related

- **[`ln-accordion`](../ln-accordion/README.md)** — single-open coordinator for a list of toggle panels.
- **[`ln-dropdown`](../ln-dropdown/README.md)** — menu wrapper that adds outside-click, resize-close, scroll-reposition, and body teleport.
- **`@mixin collapsible`** (`scss/config/mixins/_collapsible.scss`) — `grid-template-rows: 0fr → 1fr` height animation. `.collapsible` is the parent (zero padding); `.collapsible-body` is the padded child.
- **`@mixin sidebar-drawer`** (`scss/config/mixins/_app-shell.scss`) — translate-x animation. Reads `[data-ln-toggle="open"]` directly from CSS.
- **Architecture deep-dive:** [`docs/js/toggle.md`](../../docs/js/toggle.md) — internals, observer wiring, persistence semantics, design rationale.
