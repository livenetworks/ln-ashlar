# ln-circular-progress

A circular (ring) progress indicator built with SVG. Reactive: automatically updates when attributes change via MutationObserver.

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-circular-progress="50"` | element | Current progress value |
| `data-ln-circular-progress-max="100"` | element | Maximum value (default: 100) |
| `data-ln-circular-progress-label="text"` | element | Custom center label (default: percentage) |

## Color Classes

| Class | Color |
|-------|-------|
| `.green` | `--color-success` |
| `.red` | `--color-error` |
| `.yellow` | `--color-warning` |
| (no class) | `--color-primary` |

## Size Classes

| Class | Size |
|-------|------|
| `.sm` | 2.5rem |
| (default) | 4rem |
| `.lg` | 6rem |
| `.xl` | 8rem |

## HTML Structure

```html
<!-- Basic usage -->
<div data-ln-circular-progress="75" class="green"></div>

<!-- Custom max -->
<div data-ln-circular-progress="7" data-ln-circular-progress-max="10"></div>

<!-- Custom label -->
<div data-ln-circular-progress="3" data-ln-circular-progress-max="5"
     data-ln-circular-progress-label="3/5"></div>

<!-- Size variant -->
<div data-ln-circular-progress="50" class="lg yellow"></div>
```

The component auto-generates an SVG ring and a `<strong>` label inside the element.

## Events

Events are dispatched on the element and bubble up.

| Event | When | `detail` |
|-------|------|----------|
| `ln-circular-progress:change` | On every value change | `{ target, value, max, percentage }` |

```javascript
document.addEventListener('ln-circular-progress:change', function(e) {
    console.log('Progress:', e.detail.percentage.toFixed(1) + '%');
});
```

## API

```javascript
// Manual initialization
window.lnCircularProgress(document.body);

// Dynamic update
const el = document.querySelector('[data-ln-circular-progress]');
el.setAttribute('data-ln-circular-progress', '90');
```

## Behavior

- SVG arc calculated as `(value / max) * circumference`
- Starts at 0, animates to target via CSS transition on `stroke-dashoffset`
- MutationObserver watches `data-ln-circular-progress` and `data-ln-circular-progress-max`
- Center label shows percentage by default, or custom text via `data-ln-circular-progress-label`
