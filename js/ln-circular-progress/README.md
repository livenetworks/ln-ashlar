# ln-circular-progress

> Attribute-driven SVG ring renderer. Set `data-ln-circular-progress="75"` on an
> empty host; the component builds the SVG, watches the attribute, and redraws on every change. The attribute IS the state — no imperative setter.

## Quick start

```html
<div data-ln-circular-progress="75" class="success"></div>
```

One attribute on an empty host element. The constructor creates an `<svg>` with a
track circle and fill circle, creates a `<strong>` label, and appends both to the
host. The SVG fills the host's dimensions via CSS (`width: 100%`, `height: 100%`),
so size comes from the host — or from a size class (`.sm`, `.lg`, `.xl`).

The host element must be empty at init — the constructor `appendChild`s the SVG and label; pre-existing children stay in the DOM and overlap the ring.

## Attributes

| Attribute | On | Description |
|---|---|---|
| `data-ln-circular-progress="N"` | host element | Current value. Creates the instance. Number; negative or above-max values are allowed — the rendered percentage clamps to 0–100, but the attribute is left as-written. Empty / non-numeric strings render as 0%. |
| `data-ln-circular-progress-max="N"` | host element | Maximum value. Default `100`. Used as denominator in `(value / max) × 100`. `max="0"` forces 0% (avoids divide-by-zero). |
| `data-ln-circular-progress-label="text"` | host element | Custom centre label, replaces the auto-computed percentage. Read inside `_render`, but **NOT in the MutationObserver filter** — mutating this attribute alone does not trigger a re-render. Update the label alongside a value or max write. |

`data-ln-circular-progress-initialized=""` is set by the constructor and removed by `destroy()`. It is an internal marker — do not read it from project code; use `el.lnCircularProgress` instead.

**Size variants** — apply a class to the host: `.sm` (2.5 rem), default (4 rem), `.lg` (6 rem), `.xl` (8 rem). Each rebinds the label font-size.

**Colour variants** — `.success`, `.warning`, `.error` override the fill stroke via `scss/components/_circular-progress.scss`. The default fill reads `--color-accent` and follows the active theme.

## Events

| Event | Bubbles | Cancelable | `detail` |
|---|---|---|---|
| `ln-circular-progress:change` | yes | no | `{ target, value, max, percentage }` |

`detail.value` is the raw `parseFloat` of the attribute — unclamped. `detail.percentage` is clamped 0–100. A value of 150 on a max-100 ring produces `value: 150, percentage: 100`. Read `detail.value` to detect overshoot; read `detail.percentage` to match the visible arc.

`detail.target` is the host element — useful when a single document-level listener handles multiple rings:

```js
document.addEventListener('ln-circular-progress:change', function (e) {
	const { target, percentage } = e.detail;
	if (percentage >= 100) {
		target.classList.add('done');
	}
});
```

The event fires on the initial render at construction, as well as on every subsequent value or max attribute change. A document-level listener sees a `:change` for every ring on the page during init.

## Accessibility

The component sets `aria-hidden="true"` on the constructed `<svg>` — screen readers skip the SVG element. The component does **not** write `role`, `aria-valuenow`, `aria-valuemin`, or `aria-valuemax` on the host. Consumer owns the accessibility tree:

```html
<div data-ln-circular-progress="75"
     role="progressbar"
     aria-valuenow="75"
     aria-valuemin="0"
     aria-valuemax="100"
     aria-label="Upload progress"
     class="success">
</div>
```

Keep `aria-valuenow` in sync when writing `data-ln-circular-progress` — the component does not do this automatically.

## API

`el.lnCircularProgress` on a constructed host element:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | Back-reference to the host element |
| `svg` | `SVGSVGElement` | The constructed `<svg>` |
| `trackCircle` | `SVGCircleElement` | Background circle (stroke = `--color-border`) |
| `progressCircle` | `SVGCircleElement` | Fill circle — `stroke-dashoffset` carries the progress |
| `labelEl` | `HTMLElement` | The `<strong>` element holding the percentage or custom label text |
| `destroy()` | method | Disconnects the attribute observer, removes the SVG and label from DOM, removes `data-ln-circular-progress-initialized`, deletes `el.lnCircularProgress`. Leaves the value attribute, colour class, and size class in place — setting the value attribute again re-instantiates. |

`window.lnCircularProgress(root)` re-runs the init scan over `root`. The shared `registerComponent` observer already covers AJAX inserts; call this manually only for Shadow DOM roots or foreign documents the observer cannot reach.

## Examples

### Minimal

```html
<div data-ln-circular-progress="75" class="success"></div>
```

75% green ring with the default 4 rem diameter. The centre label reads "75%" automatically. No JS required.

### Reactive — button-driven

```html
<div id="ring" data-ln-circular-progress="0" class="lg"></div>
<button id="advance">+10%</button>
```

```js
let pct = 0;
document.getElementById('advance').addEventListener('click', function () {
	pct = Math.min(100, pct + 10);
	document.getElementById('ring').setAttribute('data-ln-circular-progress', pct);
});
```

Each attribute write triggers a re-render and a `:change` event. The CSS
transition animates the arc from the previous offset to the new one.

### Custom max + label

```html
<!-- 7 out of 10 — arc fills to 70%, label shows the count -->
<div data-ln-circular-progress="7"
     data-ln-circular-progress-max="10"
     data-ln-circular-progress-label="7/10"
     class="lg success">
</div>
```

`max="10"` shifts the denominator so 7 maps to 70% of the arc. `label="7/10"` overrides the centre text — without it, the centre would read "70%". Both attributes are usually set together for non-percentage scales.

## What it does NOT do

- No indeterminate / spinner mode. An empty value renders 0% (empty track). For an indeterminate spinner use `@mixin loader`.
- No automatic ARIA. Consumer adds `role="progressbar"` and keeps `aria-valuenow` in sync.
- No debounce on rapid attribute writes — each write triggers a synchronous render and a `:change` event.
- No `setValue()` / `setMax()` / imperative API. `el.setAttribute('data-ln-circular-progress', n)` is the canonical update path.

## See also

- `@mixin circular-progress` (`scss/config/mixins/_circular-progress.scss`) — SVG layout, fill/track stroke tokens, motion-safe transition, size variant mixins.
- `scss/components/_circular-progress.scss` — default selector application and the `.success` / `.warning` / `.error` colour variant rules.
- [`ln-progress`](../ln-progress/README.md) — linear sibling. Same contract shape (`data-ln-progress` + `-max`); supports parent-track shared max.
- [`docs/js/circular-progress.md`](../../docs/js/circular-progress.md) — architecture reference: SVG geometry constants, render flow, MutationObserver filter, performance notes.
- `@mixin loader` (`scss/config/mixins/_loader.scss`) — indeterminate spinner for operations with no known fraction.
- [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md) — passive renderer pattern used by this component.
