# ln-select

TomSelect wrapper — enhances the standard `<select>` with search, tagging and create functionality.
Depends on [TomSelect](https://tom-select.js.org/) (peer dependency, must be loaded before ln-acme).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-select` | `<select>` | Activates TomSelect with default configuration |
| `data-ln-select='{"create":true}'` | `<select>` | JSON configuration (merged with defaults) |

## Default configuration

```json
{
    "allowEmptyOption": true,
    "controlInput": null,
    "create": false,
    "highlight": true,
    "closeAfterSelect": true,
    "placeholder": "Select...",
    "loadThrottle": 300
}
```

The `placeholder` attribute on `<select>` is used if set.

## API

```javascript
// Constructor — only for non-standard cases (Shadow DOM, iframe)
// For AJAX/dynamic DOM or setAttribute: MutationObserver auto-initializes
window.lnSelect.initialize(selectElement);

// Destroy instance
window.lnSelect.destroy(selectElement);

// Get TomSelect instance (for direct access to TomSelect API)
const ts = window.lnSelect.getInstance(selectElement);
ts.addOption({ value: 'new', text: 'New option' });
ts.setValue('new');
```

## Behavior

- If `window.TomSelect` doesn't exist, the component silently does nothing (graceful degradation)
- On DOM remove, the instance is automatically destroyed (cleanup)
- On form reset, the selection is cleared automatically

## HTML Examples

```html
<!-- Basic -->
<select data-ln-select name="country">
    <option value="">Select country...</option>
    <option value="mk">Macedonia</option>
    <option value="rs">Serbia</option>
</select>

<!-- With create (tagging) -->
<select data-ln-select='{"create": true}' name="tags" multiple>
    <option value="php">PHP</option>
    <option value="js">JavaScript</option>
</select>

<!-- Multiple choices with limit -->
<select data-ln-select='{"maxItems": 3}' name="colors[]" multiple>
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
</select>
```

## Peer dependency

TomSelect must be loaded before ln-acme:

```html
<link rel="stylesheet" href="tom-select/dist/css/tom-select.css">
<script src="tom-select/dist/js/tom-select.complete.min.js"></script>
<script src="dist/ln-acme.iife.js" defer></script>
```
