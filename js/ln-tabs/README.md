# ln-tabs

> N-way exclusive panel selection on a single container. `data-ln-tabs-active`
> on the wrapper is the single source of truth for which tab is active; the JS
> API is a thin convenience layer over `setAttribute`.

## Philosophy

A tab interface is exactly one active panel at a time. `ln-tabs` centralises
that invariant in one attribute on the wrapper (`data-ln-tabs-active="<key>"`)
and lets everything else — ARIA sync, hash deep-linking, `localStorage`
persistence, auto-focus — flow from it.

Trigger clicks, `hashchange`, persistence restores, external scripts, and
DevTools all write `data-ln-tabs-active`. A single `MutationObserver` runs
the activation pipeline (tab button state, panel visibility, ARIA, focus,
event dispatch, persistence write). There is no second path. For why tabs
are not built on `ln-toggle`, see [`docs/js/tabs.md`](../../docs/js/tabs.md).

## HTML contract

The full annotated example. Every required attribute is called out.

```html
<!-- Wrapper — id doubles as the hash namespace. Use <section>, <div>, or <article>.
     Do NOT use <main> (spec allows only one per page). -->
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">

    <!-- Tab buttons — inside a <form> every button needs type="button"
         to prevent accidental form submission on click. -->
    <nav>
        <button type="button" data-ln-tab="info">Information</button>
        <button type="button" data-ln-tab="settings">Settings</button>
        <button type="button" data-ln-tab="history">History</button>
    </nav>

    <!-- Panels — inactive panels MUST start with class="hidden" to avoid
         a flash of all-panels-stacked before the component initializes. -->
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
    <section data-ln-panel="history"  class="hidden">…</section>

</section>
```

What each piece does:

- `data-ln-tabs` on wrapper — creates the instance. Value unused.
- `data-ln-tabs-active` — written by the component after init. The observer watches it.
- `id="user-tabs"` — doubles as the hash namespace; enables hash deep-linking. Omit for transient tabs (no URL change on click).
- `data-ln-tabs-default="info"` — which tab is active on first load. Falls back to the first `[data-ln-tab]` if absent.
- `data-ln-tab="key"` on a button or anchor — marks the element as a trigger; value is the key (normalized lowercase).
- `data-ln-panel="key"` on a panel — pairs with the trigger by key. Match must be exact (after normalization).
- `class="hidden"` on inactive panels — required to prevent flash of all-panels-visible before init.
- `type="button"` on tab buttons — required when tabs live inside a `<form>` (default type is `submit`).

### Trigger shape table

Tab triggers may be `<button>` or `<a href="…">`:

| Form | Markup | Notes |
|---|---|---|
| `<button>` | `<button data-ln-tab="settings">` | Key from attribute value. |
| `<a>` explicit | `<a href="#user-tabs:settings" data-ln-tab="settings">` | Explicit `data-ln-tab` value wins. |
| `<a>` boolean | `<a href="#user-tabs:settings" data-ln-tab>` | Key derives from `href`. Canonical form for shareable URLs. |

Anchor triggers get `e.preventDefault()` on click so the browser's default
navigation does not race with the JS hash write. Ctrl/Meta-click and
middle-click skip `preventDefault` — the standard "open in new tab" affordance
still works.

### Optional full WAI-ARIA triplet

The component writes `aria-selected` on tab buttons and `aria-hidden` on
panels but does NOT auto-inject `role="tablist"` / `role="tab"` /
`role="tabpanel"` — wrapper element type varies and we do not want to
overwrite a consumer's `role="region"`. If your audit requires full WAI-ARIA
compliance, ship the roles in markup:

```html
<section id="user-tabs" data-ln-tabs>
    <nav role="tablist">
        <button role="tab" aria-controls="info-panel" data-ln-tab="info">Info</button>
    </nav>
    <section role="tabpanel" id="info-panel" data-ln-panel="info">…</section>
</section>
```

## JS API

Each `[data-ln-tabs]` element gets a per-element instance at `element.lnTabs`.
The constructor is registered globally as `window.lnTabs`.

```js
const tabs = document.getElementById('user-tabs');

tabs.setAttribute('data-ln-tabs-active', 'settings');  // switch tab
tabs.getAttribute('data-ln-tabs-active');               // read current key
tabs.lnTabs.destroy();                                  // detach listeners, dispatch :destroyed
```

The attribute is the only mutator. There is no `activate()` / `open()` /
`close()` method — every consumer (trigger click, hashchange listener, external
script, DevTools) writes `data-ln-tabs-active` and the observer runs the
pipeline. `destroy()` is the only public method, and it does real cleanup the
attribute alone cannot.

`window.lnTabs(root)` upgrades a custom root (Shadow DOM, iframe). Ordinary
AJAX inserts and `setAttribute` on existing elements are handled automatically
by the document-level observer.

## Events

All events bubble. The dispatch target is the wrapper element.

| Event | Cancelable | `detail` | Dispatched when |
|---|---|---|---|
| `ln-tabs:change` | no | `{ key, tab, panel }` | After the active panel is swapped, ARIA synced, focus moved (if enabled), and `localStorage` written. The pipeline is fully complete. |
| `ln-tabs:destroyed` | no | `{ target }` | After `destroy()` removes click and hashchange listeners and deletes the instance. |

There is no `:before-change` — the activation pipeline has no cancelable
side-effects worth gating. If you need a "block this navigation" hook (unsaved
form changes), wire it on the trigger click: listen on `[data-ln-tab]` clicks,
check the current panel, and call `event.preventDefault()` before the click
bubbles.

```js
// Document-level delegation — every tabs instance on the page
document.addEventListener('ln-tabs:change', e => {
    analytics.track('tab_change', {
        section: e.target.id,
        tab:     e.detail.key,
    });
});
```

## Attribute reference

| Attribute | On | Description |
|---|---|---|
| `data-ln-tabs` | wrapper | Creates the instance. Value unused. Presence creates the component; active key lives separately on `data-ln-tabs-active`. |
| `data-ln-tabs-active` | wrapper | Currently active key. **Written by the component**; watched by the observer. Single source of truth. |
| `data-ln-tabs-default="key"` | wrapper | Default key when nothing else picks one. Falls back to the first `[data-ln-tab]` if absent. |
| `data-ln-tabs-focus="false"` | wrapper | Opt out of auto-focus on the panel's first focusable element after activation. Default: enabled. Opt out for panels that host charts, iframes, or other elements where stealing focus is jarring. |
| `data-ln-tabs-key="name"` | wrapper | Hash namespace when `id` is unsuitable (e.g. multiple instances from the same template). Falls back to `id`. |
| `id="name"` | wrapper | Doubles as the hash namespace if `data-ln-tabs-key` is absent. An `id` enables hash sync; omit it for transient tabs that should not write to the URL. |
| `data-ln-tab="key"` | trigger | Marks the element as a tab trigger. Value is the key (normalized lowercase). Boolean form (`data-ln-tab` with no value) valid only on `<a href="…">`. |
| `data-ln-panel="key"` | panel | Marks the panel and declares its key. Must match a `data-ln-tab` value. |
| `data-ln-persist` | wrapper | Opt in to `localStorage` persistence. Boolean form requires `id`; explicit form is `data-ln-persist="custom-key"`. **Mutually exclusive with hash sync** — silently ignored when `id` or `data-ln-tabs-key` is present (hash wins). |

Output attributes written by the component (do not set these manually):

| Attribute | On | When |
|---|---|---|
| `data-ln-tabs-active` | wrapper | Set at init; updated on every tab switch. |
| `data-active` | active tab button | Present on the active tab; absent on others. |
| `aria-selected` | every tab button | `"true"` on the active tab, `"false"` on others. |
| `aria-hidden` | every panel | `"false"` on the active panel, `"true"` on others. |

## Persistence

Add `data-ln-persist` to a wrapper to remember the active key in
`localStorage` across page loads. **Only effective when hash sync is OFF**
(no `id` or `data-ln-tabs-key`). With hash sync on, the URL is the source of
persistence and `data-ln-persist` is silently ignored — the URL always wins
because it is user-visible and shareable.

For storage-key format, fallback behaviour in private browsing, and
`data-ln-persist="custom-key"` overrides, see
[`docs/js/core.md`](../../docs/js/core.md).

## What it does NOT do

The component is intentionally narrow. These are NOT tab concerns:

- **No animated panel transitions.** Switching flips `.hidden` on panels — a `display: none` toggle. No fade, no slide, no crossfade.
- **No keyboard arrow navigation.** Arrow Left/Right/Home/End do not move focus or activation. Tab key cycles through buttons via browser default; Enter/Space activates. Arrow nav is a WAI-ARIA enhancement; wire it on the consumer side if your audit requires it.
- **No lazy-loading.** All panels are in the DOM at init; inactive panels are hidden, not removed. Lazy loading is consumer-side — listen for `ln-tabs:change`.
- **No scroll-position memory per panel.** Switching from a scrolled panel back resets to the top.

## Examples

### Plain tabs (no hash, no persistence)

```html
<section data-ln-tabs data-ln-tabs-default="overview">
    <nav>
        <button type="button" data-ln-tab="overview">Overview</button>
        <button type="button" data-ln-tab="details">Details</button>
    </nav>
    <section data-ln-panel="overview">…</section>
    <section data-ln-panel="details" class="hidden">…</section>
</section>
```

No `id`, no `data-ln-tabs-key`, no `data-ln-persist`. Active key lives only in
`data-ln-tabs-active`. Reload the page and the default tab is selected — the
right choice for ephemeral tab UIs (e.g. inside a modal that closes between
visits).

### Hash-deep-linkable tabs

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button type="button" data-ln-tab="info">Information</button>
        <button type="button" data-ln-tab="settings">Settings</button>
    </nav>
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
</section>
```

Open the page at `/admin/users#user-tabs:settings` → Settings is active on
first paint. Click Information → URL becomes `#user-tabs:info`. Bookmark,
share, hit the back button — URL-as-state. Multiple independent tablists on the
same page use separate namespaces: `#user-tabs:info&project-tabs:members`.

### Anchor triggers (shareable links)

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <a href="#user-tabs:info"      data-ln-tab>Information</a>
        <a href="#user-tabs:settings"  data-ln-tab>Settings</a>
        <a href="#user-tabs:history"   data-ln-tab>History</a>
    </nav>
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
    <section data-ln-panel="history"  class="hidden">…</section>
</section>
```

Right-click → copy link → paste into a new browser → the right tab is active on
first paint. Middle-click opens in a new tab. The `href` IS the canonical hash
format — `data-ln-tab` without a value tells the component to derive the key
from the `href`.

### Persistent tabs without hash sync

```html
<section data-ln-tabs data-ln-persist="settings-tabs" data-ln-tabs-default="general">
    <nav>
        <button type="button" data-ln-tab="general">General</button>
        <button type="button" data-ln-tab="security">Security</button>
        <button type="button" data-ln-tab="notifications">Notifications</button>
    </nav>
    <section data-ln-panel="general">…</section>
    <section data-ln-panel="security"       class="hidden">…</section>
    <section data-ln-panel="notifications"  class="hidden">…</section>
</section>
```

No `id` (no hash sync), explicit `data-ln-persist="settings-tabs"` (storage key
doesn't depend on a generated `id`). The user's active tab is remembered across
page loads via `localStorage`. Useful for settings pages where "last tab I was
on" is the expected restore.

## See also

- **[`ln-toggle`](../ln-toggle/README.md)** — binary open/close primitive.
- **[`ln-accordion`](../ln-accordion/README.md)** — single-open coordinator built on `ln-toggle`. Contrast: accordion enforces single-open reactively; tabs enforce it by construction.
- **`@mixin tabs-nav`, `@mixin tabs-tab`, `@mixin tabs-panel`** (`scss/config/mixins/_tabs.scss`) — the visual recipe.
- **Architecture deep-dive:** [`docs/js/tabs.md`](../../docs/js/tabs.md) — observer wiring, hash round-trip, anchor key derivation, persistence internals.
