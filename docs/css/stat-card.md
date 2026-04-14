# Stat card / KPI card

File: `scss/config/mixins/_stat-card.scss` + `scss/components/_stat-card.scss`.

Dashboard KPI tile. Large numeric value, small uppercase label, and
optional trend indicator.

## Structure

```html
<article data-ln-stat-card>
	<p data-ln-stat-label>Total documents</p>
	<p data-ln-stat-value>1,247</p>
	<p data-ln-stat-trend="up">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-arrow-up"></use></svg>
		12% from last month
	</p>
</article>
```

## Trend variants

| Attribute | Color |
|---|---|
| `data-ln-stat-trend="up"` | Success (green) |
| `data-ln-stat-trend="down"` | Error (red) |
| `data-ln-stat-trend="neutral"` | Muted grey |

## Layout

Stat cards are typically displayed in a grid. Use container queries
to lay them out:

```scss
#dashboard [data-ln-stat-card] {
	// card styling inherited from component
}

#dashboard-kpis {
	@include container(kpigrid);
	display: grid;
	grid-template-columns: 1fr;
	@include gap(1rem);

	@container kpigrid (min-width: $cq-compact) {
		grid-template-columns: repeat(2, 1fr);
	}
	@container kpigrid (min-width: $cq-medium) {
		grid-template-columns: repeat(4, 1fr);
	}
}
```

## Project selectors

```scss
#dashboard .kpi { @include stat-card; }
```
