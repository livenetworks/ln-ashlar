# `ln-chart`

A zero-dependency, responsive SVG dataset renderer for `ln-ashlar`. It is the
chart equivalent of `ln-table` / `ln-list`: the component owns only its SVG DOM
and rendering state, while `ln-data-coordinator` owns local-store and API
routing.

The first contract supports a single numeric series rendered as a `line` or an
`area` (`polygon` is accepted as an alias). SVG geometry is calculated in the
authored `viewBox`; presentation is controlled entirely by CSS custom
properties.

## Data-coordinator example

```html
<ul data-ln-data-coordinator="sales" hidden>
  <li data-ln-data-store="sales"></li>
  <li data-ln-api-connector data-ln-api-endpoint="/api/sales"></li>
</ul>

<figure id="monthly-revenue"
        class="chart"
        data-ln-chart="monthly-revenue"
        data-ln-chart-source="sales"
        data-ln-chart-x="month"
        data-ln-chart-y="revenue"
        data-ln-chart-sort="month:asc"
        data-ln-chart-type="area">
  <figcaption id="monthly-revenue-title">Monthly revenue</figcaption>

  <svg class="chart__plot"
       data-ln-chart-plot
       viewBox="0 0 1000 320"
       role="img"
       aria-labelledby="monthly-revenue-title"
       preserveAspectRatio="none">
    <polygon class="chart__area" data-ln-chart-area hidden></polygon>
    <polyline class="chart__line" data-ln-chart-line></polyline>
  </svg>

  <ol class="chart__labels" data-ln-chart-labels></ol>
  <template data-ln-template="monthly-revenue-label">
    <li class="chart__label">
      <span>{{ label }}</span>
      <strong>{{ value }}</strong>
    </li>
  </template>

  <p class="chart__empty" data-ln-chart-empty hidden>No chart data available.</p>
  <dl class="chart__summary">
    <div><dt>Minimum</dt><dd data-ln-chart-min></dd></div>
    <div><dt>Maximum</dt><dd data-ln-chart-max></dd></div>
    <div><dt>Points</dt><dd data-ln-chart-count></dd></div>
  </dl>
</figure>
```

The dataset may come from IndexedDB or the connector. Records are expected to
contain the configured x/y fields, for example:

```json
[
  { "month": "Jan", "revenue": 1200 },
  { "month": "Feb", "revenue": 1850 },
  { "month": "Mar", "revenue": 1630 }
]
```

## Attributes

| Attribute | Description |
|---|---|
| `data-ln-chart="<name>"` | Component name and event identity. |
| `data-ln-chart-source="<source>"` | `id` of the `ln-data-store` this chart binds to. |
| `data-ln-chart-x="<field>"` | Record field used as the ordered category label. |
| `data-ln-chart-y="<field>"` | Record field containing the numeric value. Invalid/non-numeric records are ignored. |
| `data-ln-chart-type="line\|area\|polygon"` | Rendering mode. Default `line`; `polygon` aliases `area`. |
| `data-ln-chart-sort="field:asc\|desc"` | Optional store/API sort passed with `request-data`. |
| `data-ln-chart-padding="N"` | Inner SVG viewBox padding. Default `16`. |
| `data-ln-chart-zero="false"` | Opt out of the default zero-inclusive y domain. |

## Authored child roles

| Attribute | Expected element | Purpose |
|---|---|---|
| `data-ln-chart-plot` | `<svg viewBox="…">` | Responsive plotting surface. |
| `data-ln-chart-line` | `<polyline>` | Line geometry target. Required for both modes. |
| `data-ln-chart-area` | `<polygon>` | Optional area fill target. |
| `data-ln-chart-labels` | List/container | Optional x-label destination. Uses `{chartName}-label` template. |
| `data-ln-chart-empty` | Authored empty-state element | Shown only when no valid values exist. |
| `data-ln-chart-min/max/count` | Authored text elements | Optional numeric summary destinations. |

## Events

### Emitted

- `ln-chart:request-data` `{ chart, source, sort, filters, search }` — asks the
  coordinator for records.
- `ln-chart:rendered` `{ chart, count, min, max }` — geometry and optional
  labels have been updated.

### Listened

- `ln-chart:set-data` `{ data, total?, filtered? }` — replaces the current
  dataset and renders it.
- `ln-chart:set-loading` `{ loading }` — toggles `aria-busy` and the
  `ln-chart--loading` state class.
- `ln-chart:request-refresh` — asks the component to issue its data query again.

## CSS custom properties

The `.chart` mixin exposes:

- `--chart-height`
- `--chart-gap`
- `--chart-radius`
- `--chart-line-color`
- `--chart-line-width`
- `--chart-area-color`
- `--chart-grid-color`
- `--chart-grid-column-size`
- `--chart-grid-row-size`
- `--chart-label-color`

Override variables on the chart instance; do not override internal selectors:

```css
#monthly-revenue {
  --chart-height: 24rem;
  --chart-line-color: hsl(var(--color-success));
  --chart-area-color: hsl(var(--color-success) / 0.14);
}
```

## Architecture notes

- `ln-chart` never imports or reads `ln-data-store` or a connector.
- The SVG skeleton, labels template, empty state, caption, and summary are
  authored HTML. JavaScript updates only data geometry and bound text.
- The runtime has no charting dependency. Scaling lives in the pure
  `src/chart-model.js` module and is covered by Node behavioral tests.
- The v1 contract intentionally excludes multi-series legends, interaction,
  and tooltips. Those can be composed later without changing the read protocol.
