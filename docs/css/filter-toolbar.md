# Filter toolbar

File: `scss/components/_filter-toolbar.scss`.

Layout pattern for list views: search + active filters + sort + bulk
actions. The default `[data-ln-filter-toolbar]` attribute applies the
mixin automatically. Custom selectors via `@include filter-toolbar` are
still supported.

## Structure

```html
<div data-ln-filter-toolbar>
	<div data-ln-filter-search>
		<input type="search" placeholder="Search documents…">
	</div>
	<div data-ln-filter-group>
		<span data-ln-chip>Status: Draft <button type="button" aria-label="Remove">×</button></span>
		<span data-ln-chip>Tag: Quality <button type="button" aria-label="Remove">×</button></span>
	</div>
	<div data-ln-filter-sort>
		<select>
			<option>Sort: Newest</option>
			<option>Sort: Oldest</option>
			<option>Sort: A–Z</option>
		</select>
	</div>
	<div data-ln-filter-bulk>
		<button type="button">Bulk actions</button>
	</div>
</div>
```

## Slots

| Attribute | Slot | Use |
|---|---|---|
| `data-ln-filter-search` | `search` | Search input |
| `data-ln-filter-group` | `chips` | Active filter chips |
| `data-ln-filter-sort` | `controls` | Sort dropdown |
| `data-ln-filter-bulk` | `controls` | Bulk action button |

All slots optional.

## Layout

- **Below 880px (container query):** stacks vertically —
  search → chips → controls.
- **880px+:** single row — search left, chips center, controls right.

The parent needs `container-type: inline-size` (or `@include
container`) for the query to match.

## Usage

Use the default attribute — no extra CSS needed:

```html
<div data-ln-filter-toolbar>…</div>
```

For a custom selector (e.g. a semantic ID), use the mixin directly:

```scss
// Custom selector via mixin
#documents-filters { @include filter-toolbar; }

// The parent needs container-type for the 880px container query
#documents-page { @include container(docpage); }
```
