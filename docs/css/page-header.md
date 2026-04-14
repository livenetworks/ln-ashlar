# Page header

File: `scss/config/mixins/_page-header.scss` + `scss/components/_page-header.scss`.

Standard page header pattern: breadcrumbs above, title + subtitle on
the left, action buttons on the right. Stacks vertically on narrow
containers.

## Structure

```html
<div style="container-type: inline-size;">
	<header data-ln-page-header>
		<nav aria-label="Breadcrumb">
			<ol>
				<li><a href="/">Home</a></li>
				<li aria-current="page">Quality Manual</li>
			</ol>
		</nav>
		<div>
			<h1>Quality Manual</h1>
			<p>Version 2.3 — Approved 2026-03-15</p>
		</div>
		<div>
			<button type="button">Edit</button>
			<button type="submit">Publish</button>
		</div>
	</header>
</div>
```

## Responsive

The header uses a container query at `880px`:
- Below 880px: stacks `breadcrumbs → title → actions` vertically
- At 880px+: breadcrumbs on top full-width, title-left + actions-right

The parent container must declare `container-type: inline-size` or
use `@include container` for the query to match.

## Slots

- `> nav` — breadcrumbs (top row)
- `> div` with `> h1` — title + optional `p` subtitle
- `> div` with `> button` or `> a` — action buttons

The `:has()` selector picks the correct div for each slot. Works in
all modern browsers (Chrome 105+, Safari 15.4+, Firefox 121+).

## Project selectors

```scss
#document-detail > header { @include page-header; }
```

In a project layout that already establishes `container-type` on the
main content area, the query fires automatically — no extra wrapper
needed.
