# Progress

Animated progress bar. File: `js/ln-progress/ln-progress.js`.

## HTML

```html
<div data-ln-progress>
    <div data-ln-progress="65" class="green"></div>
</div>

<!-- Custom max -->
<div data-ln-progress>
    <div data-ln-progress="130" data-ln-progress-max="200" class="yellow"></div>
</div>

<!-- Multiple segments -->
<div data-ln-progress>
    <div data-ln-progress="30" class="green"></div>
    <div data-ln-progress="20" class="red"></div>
</div>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-progress` (empty) | outer | Track container |
| `data-ln-progress="value"` | inner | Current value |
| `data-ln-progress-max="100"` | inner | Maximum value (default: 100) |

## Color Classes

| Class | Color |
|-------|-------|
| `.green` | `--color-success` |
| `.red` | `--color-error` |
| `.yellow` | `--color-warning` |

## Dynamic Update

```js
const bar = document.querySelector('[data-ln-progress="65"]');
bar.setAttribute('data-ln-progress', '80');
// MutationObserver auto-updates width
```

## Behavior

- Width calculated as `value / max * 100%`
- Starts at `width: 0`, animates to target via CSS transition
- MutationObserver watches `data-ln-progress` and `data-ln-progress-max`
