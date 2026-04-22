# Progress

Animated progress bar. File: `js/ln-progress/ln-progress.js`.

## HTML

```html
<div data-ln-progress>
    <div data-ln-progress="65" class="success"></div>
</div>

<!-- Custom max -->
<div data-ln-progress>
    <div data-ln-progress="130" data-ln-progress-max="200" class="warning"></div>
</div>

<!-- Multiple segments -->
<div data-ln-progress>
    <div data-ln-progress="30" class="success"></div>
    <div data-ln-progress="20" class="error"></div>
</div>

<!-- Stacked with shared max — fills 100% proportionally -->
<div data-ln-progress data-ln-progress-max="15">
    <div data-ln-progress="7" class="success"></div>
    <div data-ln-progress="3" class="warning"></div>
    <div data-ln-progress="5" class="error"></div>
</div>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-progress` (empty) | outer | Track container |
| `data-ln-progress="value"` | inner | Current value |
| `data-ln-progress-max="100"` | inner | Maximum value (default: 100) |
| `data-ln-progress-max="N"` | outer | Shared max for stacked bars — children use this as denominator |

## Color Classes

| Class | Color |
|-------|-------|
| `.success` | `--color-success` |
| `.error` | `--color-error` |
| `.warning` | `--color-warning` |

> **Note**: These semantic classes parallel `status-badge`, `alert`, and `toast` — progress bars represent categorical status (success / warning / error), so class names map directly to the matching semantic color tokens (`--color-success`, `--color-warning`, `--color-error`). To use a custom color, skip the class and set `background-color` on the bar element directly, or override `--color-primary` on a parent scope.

## Events

| Event | Bubbles | `detail` | When |
|-------|---------|----------|------|
| `ln-progress:change` | yes | `{ target, value, max, percentage }` | On every value change (attribute mutation) |

```js
document.addEventListener('ln-progress:change', function (e) {
    console.log('Progress:', e.detail.percentage.toFixed(1) + '%');
    if (e.detail.percentage >= 100) {
        console.log('Complete!');
    }
});
```

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
- `data-ln-progress-max` on track → children fill proportionally (parent max > bar max > 100)
