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

// Via hash
location.hash = 'user-tabs:settings';

// Multiple sections via hash
location.hash = 'user-tabs:settings&project-tabs:members';

// Constructor (manual initialization)
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

| Event | When | `detail` |
|-------|------|----------|
| `ln-tabs:change` | After activating a new tab | `{ key, tab, panel }` |

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

## CSS Styling

```scss
[data-ln-tab] {
    @include text-secondary;
    &[data-active] {
        @include text-primary;
        @include font-bold;
        border-bottom: 2px solid var(--color-primary);
    }
}
```
