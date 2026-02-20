# Tabs

Hash-aware tab component. File: `js/ln-tabs/ln-tabs.js`.

## HTML

```html
<div data-ln-tabs data-ln-tabs-default="first">
    <div>
        <button data-ln-tab="first">First</button>
        <button data-ln-tab="second">Second</button>
    </div>

    <div data-ln-panel="first">First content</div>
    <div data-ln-panel="second" class="hidden">Second content</div>
</div>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-tabs` | Container |
| `data-ln-tabs-default="key"` | Default active tab |
| `data-ln-tabs-focus` | Auto-focus first input on tab change (default: true) |
| `data-ln-tab="key"` | Tab button |
| `data-ln-panel="key"` | Panel content |

## Behavior

- URL hash sync: `#second` activates "second" tab
- Click updates `location.hash`
- Active tab gets `data-active` attribute (presence-based, not value-based)
- Inactive panels get `.hidden` class
- ARIA: `aria-selected` on tabs, `aria-hidden` on panels

## Styling

Active tab selector: `[data-ln-tab][data-active]` (attribute exists = active).
