# Filter toolbar

File: `scss/config/mixins/_filter-toolbar.scss`.

Layout pattern for list views: search + active filters + sort + bulk
actions. Not a default-applied component — consumer applies via
`@include filter-toolbar` on a semantic selector.

## Structure

```html
<div id="documents-filters">
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

```scss
// Apply to a semantic selector
#documents-filters { @include filter-toolbar; }

// Or bind the container context on the parent
#documents-page { @include container(docpage); }
```
