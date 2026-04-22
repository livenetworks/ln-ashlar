# Circular Progress

Circular (ring) progress indicator using SVG. File: `js/ln-circular-progress/ln-circular-progress.js`.

## HTML

```html
<!-- Basic -->
<div data-ln-circular-progress="75" class="success"></div>

<!-- Custom max -->
<div data-ln-circular-progress="7" data-ln-circular-progress-max="10"></div>

<!-- Custom label -->
<div data-ln-circular-progress="3" data-ln-circular-progress-max="5"
     data-ln-circular-progress-label="3/5"></div>

<!-- Size + color -->
<div data-ln-circular-progress="50" class="lg warning"></div>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-circular-progress="value"` | element | Current value |
| `data-ln-circular-progress-max="100"` | element | Maximum value (default: 100) |
| `data-ln-circular-progress-label="text"` | element | Custom center label (default: percentage) |

## Size Classes

`.sm` (2.5rem), default (4rem), `.lg` (6rem), `.xl` (8rem)

## Color Classes

| Class | Color |
|-------|-------|
| `.success` | `--color-success` |
| `.error` | `--color-error` |
| `.warning` | `--color-warning` |

## Events

| Event | When | `detail` |
|-------|------|----------|
| `ln-circular-progress:change` | On every value change | `{ target, value, max, percentage }` |

## Dynamic Update

```js
const el = document.querySelector('[data-ln-circular-progress]');
el.setAttribute('data-ln-circular-progress', '90');
// MutationObserver auto-updates the ring
```

## Behavior

- SVG arc animated via CSS transition on `stroke-dashoffset`
- MutationObserver watches value and max attributes
- Center label shows percentage by default, or custom text
