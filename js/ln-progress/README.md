# ln-progress

A visual progress indicator. Reactive: automatically updates when `data-ln-progress` attributes change (MutationObserver on attributes).

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-progress` | track (outer) | Marks the progress track container (empty value) |
| `data-ln-progress="50"` | bar (inner) | Current progress value |
| `data-ln-progress-max="100"` | bar | Maximum value for a single bar (default: 100) |
| `data-ln-progress-max="N"` | track | Shared max for stacked bars — all children use this as denominator |

## Color Classes

| Class | Color |
|-------|-------|
| `.green` | Success (green) |
| `.red` | Error (red) |
| `.yellow` | Warning (yellow) |
| (no class) | Default background |

## Behavior

- Bar width is calculated as `(value / max) * 100%`
- When `data-ln-progress` or `data-ln-progress-max` attributes change, the bar reactively updates
- Supports multiple bars in one track (stacked progress)
- `data-ln-progress-max` on track — all children use that max (bars fill the entire space proportionally)
- Max priority: parent track max > bar's own max > default 100
- The last bar gets a rounded right edge

## HTML Structure

```html
<!-- Single progress bar -->
<div data-ln-progress role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
    <div data-ln-progress="75" class="green"></div>
</div>

<!-- Custom maximum value -->
<div data-ln-progress role="progressbar" aria-valuenow="30" aria-valuemin="0" aria-valuemax="50">
    <div data-ln-progress="30" data-ln-progress-max="50" class="green"></div>
</div>

<!-- Stacked (multiple segments) — each bar is a % of 100 -->
<div data-ln-progress role="progressbar" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
    <div data-ln-progress="40" class="green"></div>
    <div data-ln-progress="20" class="yellow"></div>
    <div data-ln-progress="10" class="red"></div>
</div>

<!-- Stacked with shared max — fills 100% proportionally -->
<div data-ln-progress data-ln-progress-max="15">
    <div data-ln-progress="7" class="green"></div>
    <div data-ln-progress="3" class="yellow"></div>
    <div data-ln-progress="5" class="red"></div>
</div>
```

> **Accessibility:** Add `role="progressbar"` and ARIA attributes (`aria-valuenow`,
> `aria-valuemin`, `aria-valuemax`) to the track element for screen readers.

## Events

Events are dispatched on the bar element (`[data-ln-progress="N"]`) and bubble up.

| Event | When | `detail` |
|-------|------|----------|
| `ln-progress:change` | On every value change | `{ target, value, max, percentage }` |

```javascript
document.addEventListener('ln-progress:change', function(e) {
    console.log('Progress:', e.detail.percentage.toFixed(1) + '%');
    console.log('Value:', e.detail.value, '/', e.detail.max);

    if (e.detail.percentage >= 100) {
        console.log('Complete!');
    }
});
```

## API

```javascript
// Manual initialization
window.lnProgress(document.body);
```

## Reactive Updates

```javascript
// Change the value — bar auto-updates
const bar = document.querySelector('[data-ln-progress="75"]');
bar.setAttribute('data-ln-progress', '90');
```

## Example: Upload Progress

```javascript
const bar = document.getElementById('upload-bar');

xhr.upload.addEventListener('progress', function(e) {
    if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        bar.setAttribute('data-ln-progress', percent);
    }
});
```
