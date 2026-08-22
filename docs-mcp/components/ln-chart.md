---
name: ln-chart
classification: component
status: draft
domain: data-display
summary: Zero-dependency SVG line/area renderer bound to ln-data-coordinator datasets.
source: components/ln-chart/README.md, components/ln-chart/src/ln-chart.js
tags: [component, chart, svg, data, coordinator]
---

# ln-chart

`ln-chart` renders one ordered numeric dataset as a responsive SVG line or
area chart. It is a pure renderer: data arrives through `ln-chart:set-data`,
and `ln-data-coordinator` resolves `data-ln-chart-store` against its child
store/connector.

## Canonical markup

```html
<figure id="monthly-revenue"
        class="chart"
        data-ln-chart="monthly-revenue"
        data-ln-chart-source="sales"
        data-ln-chart-store="sales"
        data-ln-chart-x="month"
        data-ln-chart-y="revenue"
        data-ln-chart-type="area">
  <figcaption id="monthly-revenue-title">Monthly revenue</figcaption>
  <svg class="chart__plot" data-ln-chart-plot viewBox="0 0 1000 320"
       role="img" aria-labelledby="monthly-revenue-title"
       preserveAspectRatio="none">
    <polygon class="chart__area" data-ln-chart-area hidden></polygon>
    <polyline class="chart__line" data-ln-chart-line></polyline>
  </svg>
  <ol class="chart__labels" data-ln-chart-labels></ol>
  <template data-ln-template="monthly-revenue-label">
    <li class="chart__label"><span>{{ label }}</span> <strong>{{ value }}</strong></li>
  </template>
  <p class="chart__empty" data-ln-chart-empty hidden>No chart data available.</p>
</figure>
```

## Contract

| Surface | Values / payload | Meaning |
|---|---|---|
| `data-ln-chart-type` | `line`, `area`, `polygon` | `polygon` aliases the area renderer. |
| `data-ln-chart-x` | field name | Ordered category label. |
| `data-ln-chart-y` | field name | Numeric value; invalid records are ignored. |
| `data-ln-chart-sort` | `field:asc\|desc` | Optional query sort. |
| `data-ln-chart-zero` | `false` | Opts out of a zero-inclusive y domain. |
| `ln-chart:request-data` | `{chart, source, sort, filters, search}` | Renderer asks for records. |
| `ln-chart:set-data` | `{data, total?, filtered?}` | Coordinator delivers records. |
| `ln-chart:set-loading` | `{loading}` | Coordinator controls busy state. |
| `ln-chart:rendered` | `{chart, count, min, max}` | Rendering notification. |

## Principles

- Authored SVG and templates are preserved; JS updates geometry attributes and
  bound text only.
- `.chart` owns visual chrome through `theme/config/mixins/_chart.scss`.
- Instance customization rebinds `--chart-*` custom properties.
- Store/API knowledge remains exclusively in `ln-data-coordinator`.
- Scaling is category-based on x and linear numeric on y; the zero baseline is
  included by default to avoid misleading magnitude.

See [`components/ln-chart/README.md`](../../components/ln-chart/README.md) for the full markup,
CSS-variable list, and data-coordinator example.
