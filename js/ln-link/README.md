# ln-link

Clickable rows component — makes entire rows (or other elements) click-navigable based on an `<a>` link inside.
Supports tables, lists, and generic containers. Shows URL preview (status bar) on hover.

## Attributes

| Attribute | On | Description |
|---------|-----|------|
| `data-ln-link` | `<table>`, `<tbody>`, `<tr>`, or other element | Activates clickable row behavior |

## Behavior

- Click on a row (outside of `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) → navigates to the `href` of the first `<a>` in the row
- Ctrl/Cmd+Click and middle-click → opens in a new tab (`window.open`)
- Hover → shows URL in the status bar (bottom-left, browser-style)
- `<table>` / `<tbody>` mode: each `<tr>` with an `<a>` inside becomes click-navigable
- `<tr>` mode: directly on a specific row
- Generic mode: the element itself is click-navigable

## HTML Structure

```html
<!-- Table — all rows become clickable -->
<table data-ln-link>
    <thead>
        <tr><th>User</th><th>Role</th><th>Actions</th></tr>
    </thead>
    <tbody>
        <tr>
            <td><a href="/users/1">Marko</a></td>
            <td>Admin</td>
            <td>
                <!-- Buttons inside a row do NOT trigger the row click -->
                <button class="btn btn--sm">Edit</button>
            </td>
        </tr>
    </tbody>
</table>

<!-- List of cards -->
<ul data-ln-link>
    <li>
        <a href="/projects/1"><h3>Project 1</h3></a>
        <p>Project description</p>
    </li>
    <li>
        <a href="/projects/2"><h3>Project 2</h3></a>
        <p>Project description</p>
    </li>
</ul>
```

## Events

The event is dispatched on the row (row/element) and bubbles up.

| Event | Cancelable | When | `detail` |
|--------|-----------|------|----------|
| `ln-link:navigate` | ✅ | Before navigation (can be canceled) | `{ target, href, link }` |

```javascript
// Cancel navigation conditionally
document.addEventListener('ln-link:navigate', function(e) {
    if (!confirm('Are you sure you want to go to: ' + e.detail.href + '?')) {
        e.preventDefault();
    }
});

// Log navigation
document.querySelector('table[data-ln-link]').addEventListener('ln-link:navigate', function(e) {
    analytics.track('row_click', { href: e.detail.href });
    // don't call e.preventDefault() — navigation continues normally
});
```

## CSS Styling

```scss
// Clickable row — cursor pointer + hover
table[data-ln-link] tbody tr {
    cursor: pointer;
    @include transition;

    &:hover {
        background-color: var(--bg-sunken);
    }
}
```

## API

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnLink.init(document.getElementById('my-table'));
window.lnLink.destroy(document.getElementById('my-table'));  // removes all row listeners
```
