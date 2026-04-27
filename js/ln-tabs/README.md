# ln-tabs

Hash-aware tab navigation — tabs with panels, synchronized with URL hash.
Supports multiple independent tab sections on the same page via namespace (`id`).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `id="key"` | wrapper | Namespace for hash (required for hash sync) |
| `data-ln-tabs-key="key"` | wrapper | Alternative namespace (if `id` is not suitable) |
| `data-ln-tabs` | wrapper | Creates a tab instance |
| `data-ln-tabs-default="key"` | wrapper | Default active tab (default: the first one) |
| `data-ln-tabs-focus="false"` | wrapper | Disable auto-focus on first input in panel (default: true) |
| `data-ln-tab="key"` | tab button | Marks the tab with a key |
| `data-ln-panel="key"` | panel element | Links the panel to a tab by key |

## Hash format

```
#namespace:tabkey
```

Multiple sections on the same page — each stores its own state:

```
#user-tabs:settings&project-tabs:members
```

- Without `id` / `data-ln-tabs-key` — no hash sync, only activates `defaultKey`
- Clicking in one section preserves the states of all other sections
- Refresh — all sections restore their tabs

## HTML Structure

```html
<!-- Section 1 — namespace via id -->
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button data-ln-tab="info">Information</button>
        <button data-ln-tab="settings">Settings</button>
    </nav>

    <section data-ln-panel="info">...</section>
    <section data-ln-panel="settings" class="hidden">...</section>
</section>

<!-- Section 2 — independent, same page -->
<section id="project-tabs" data-ln-tabs data-ln-tabs-default="overview">
    <nav>
        <button data-ln-tab="overview">Overview</button>
        <button data-ln-tab="members">Members</button>
    </nav>

    <section data-ln-panel="overview">...</section>
    <section data-ln-panel="members" class="hidden">...</section>
</section>
```

## API

```javascript
// Instance API (on DOM element)
document.getElementById('user-tabs').lnTabs.activate('settings');
document.getElementById('user-tabs').lnTabs.destroy();   // removes listeners, dispatches ln-tabs:destroyed

// Via hash
location.hash = 'user-tabs:settings';

// Multiple sections via hash
location.hash = 'user-tabs:settings&project-tabs:members';

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnTabs(document.body);
```

## Behavior

- URL hash synchronization: `#namespace:tabkey` — activates the corresponding tab
- Multiple sections: `#ns1:tab&ns2:tab` — each section reads only its own namespace
- If the key doesn't match any tab, the default is activated
- Auto-focus: after activating a panel, the first focusable element gets focus
- ARIA: `aria-selected` on tabs, `aria-hidden` on panels
- Active tab gets `data-active` attribute (for CSS styling)
- Inactive panels get `.hidden` class

## Events

Events are dispatched on the wrapper element (`[data-ln-tabs]`) and bubble up.

| Event | Bubbles | Cancelable | When | `detail` |
|-------|---------|------------|------|----------|
| `ln-tabs:change` | yes | no | After activating a new tab | `{ key, tab, panel }` |
| `ln-tabs:destroyed` | yes | no | Instance destroyed | `{ target }` |

```javascript
document.getElementById('user-tabs').addEventListener('ln-tabs:change', function(e) {
    console.log('Active tab:', e.detail.key);
    console.log('Tab button:', e.detail.tab);    // DOM element
    console.log('Panel:', e.detail.panel);        // DOM element
});

// Or globally (for all tab sections)
document.addEventListener('ln-tabs:change', function(e) {
    analytics.track('tab_change', { tab: e.detail.key });
});
```

## Persistence

Add `data-ln-persist` to a tab wrapper to remember the active tab across page loads using `localStorage`. Only works when hash sync is **not** enabled (i.e., `data-ln-tabs-key` is absent and no `id` is used as namespace).

**Requirements:**
- Element must have an `id` attribute, OR a non-empty `data-ln-persist="custom-key"` value
- If neither is present, a `console.warn` is emitted and persistence is silently skipped — tabs still work normally

**Hash takes precedence:** If both `data-ln-tabs-key` (or `id`) and `data-ln-persist` are present, hash sync is used and `data-ln-persist` is ignored entirely. The two mechanisms are mutually exclusive.

**Graceful degradation:** If `localStorage` is unavailable (private browsing, storage full), tabs work normally without persistence.

**Saved key validation:** On restore, the saved tab key is checked against `mapPanels`. If the key no longer exists in the DOM, the component falls back to `defaultKey` silently.

```html
<div data-ln-tabs id="settings-tabs" data-ln-persist>
    <nav>
        <button data-ln-tab="general">General</button>
        <button data-ln-tab="security">Security</button>
    </nav>
    <div data-ln-panel="general">...</div>
    <div data-ln-panel="security" class="hidden">...</div>
</div>
```

Storage key: `ln:tabs:/admin/settings:settings-tabs`

With an explicit custom key instead of `id`:

```html
<div data-ln-tabs data-ln-persist="settings-tabs">
    ...
</div>
```

## CSS Styling

```scss
[data-ln-tab] {
    color: var(--fg-muted);
    &[data-active] {
        @include text-primary;
        @include font-bold;
        border-bottom: 2px solid var(--color-primary);
    }
}
```
