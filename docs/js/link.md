# Link

Clickable rows component — makes entire rows (or other elements) click-navigable based on an `<a>` link inside. File: `js/ln-link/ln-link.js`.

## HTML

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
            <td><button class="btn btn--sm">Edit</button></td>
        </tr>
    </tbody>
</table>

<!-- Card list -->
<ul data-ln-link>
    <li>
        <a href="/projects/1"><h3>Project 1</h3></a>
        <p>Project description</p>
    </li>
</ul>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-link` | `<table>`, `<tbody>`, `<tr>`, or other element | Activates clickable row behavior |

## Events

| Event | Cancelable | When | `detail` |
|-------|-----------|------|----------|
| `ln-link:navigate` | yes | Before navigation (can be cancelled) | `{ target, href, link }` |

## Behavior

- Click on row (outside `<a>`, `<button>`, `<input>`, `<select>`, `<textarea>`) navigates to the `href` of the first `<a>` in the row
- Ctrl/Cmd+Click and middle-click open in new tab (`window.open`)
- Hover shows URL in status bar (browser-style, bottom-left)
- `<table>` / `<tbody>` mode: each `<tr>` with an `<a>` inside becomes clickable
- Generic mode: the element itself is clickable

## API

```js
window.lnLink.init(document.getElementById('my-table'));
```
