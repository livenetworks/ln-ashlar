# Empty state

File: `scss/config/mixins/_empty-state.scss` + `scss/components/_empty-state.scss`.

Centered, icon-led placeholder for lists with no data.

## Two sub-types

1. **`no-data`** — list has never had items yet (onboarding moment).
   Show an inviting message and the primary "create" action.
2. **`no-results`** — list has items but the current filter/search
   returned zero. Show "no matches" messaging and a clear-filter
   action.

Distinguished by attribute value:

```html
<div data-ln-empty-state="no-data">
	<svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-folder"></use></svg>
	<h3>No documents yet</h3>
	<p>Upload your first document to get started.</p>
	<button type="button">Upload document</button>
</div>

<div data-ln-empty-state="no-results">
	<svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-search"></use></svg>
	<h3>No matches</h3>
	<p>Try a different search or clear your filters.</p>
	<button type="button">Clear filters</button>
</div>
```

## Structure

- **Icon** — `ln-icon--xl` (4rem), neutral-400 color
- **Title** — `h3`, typography role `heading-sm`
- **Description** — `p`, typography role `body-md`, secondary color
- **Action** — button or link, margin-top 0.5rem

All children optional. Consumer includes what makes sense.

## Default selector

`[data-ln-empty-state]` — applies `@include empty-state`. The attribute
value (`no-data` / `no-results` / any) is only for consumer CSS to
distinguish, if needed.

## Project selectors

```scss
#documents .empty { @include empty-state; }
```
