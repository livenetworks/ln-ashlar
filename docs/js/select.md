# Select

Enhanced select dropdowns via TomSelect. File: `js/ln-select/ln-select.js`.

## HTML

```html
<!-- Basic -->
<select data-ln-select>
    <option>Option 1</option>
    <option>Option 2</option>
</select>

<!-- With config -->
<select data-ln-select='{"create": true, "maxItems": 3}'>
    <option>Tag 1</option>
    <option>Tag 2</option>
</select>
```

## Attributes

| Attribute | Description |
|-----------|-------------|
| `data-ln-select` | Initialize TomSelect |
| `data-ln-select='{"..."}` | TomSelect config as JSON |

## Default Config

- `create: false`
- `closeAfterSelect: true`
- `highlight: true`
- `placeholder` from element's `placeholder` attribute

## JS API

```js
window.lnSelect.initialize(element);
window.lnSelect.destroy(element);
window.lnSelect.getInstance(element);  // TomSelect instance
```

## Dependency

Requires TomSelect loaded globally (`window.TomSelect`). If not available, component gracefully degrades -- select works as native HTML.
