# Stepper

File: `scss/config/mixins/_stepper.scss` + `scss/components/_stepper.scss`.

Linear progress indicator for multi-step workflows (approval flows,
wizards, onboarding).

## Structure

```html
<ol data-ln-stepper>
	<li data-ln-step="complete">
		<span data-ln-step-label>Draft</span>
	</li>
	<li data-ln-step="complete">
		<span data-ln-step-label>In Review</span>
	</li>
	<li data-ln-step="current" aria-current="step">
		<span data-ln-step-label>Approval</span>
	</li>
	<li data-ln-step="upcoming">
		<span data-ln-step-label>Published</span>
	</li>
</ol>
```

## States

| Attribute | Visual |
|---|---|
| `data-ln-step="complete"` | Filled primary circle, colored connector to next |
| `data-ln-step="current"` | Filled primary circle + halo ring |
| `data-ln-step="upcoming"` (default) | Neutral circle, neutral connector |

Number is auto-generated via CSS `counter()`. No explicit numbering
in HTML.

## Accessibility

- Use `<ol>` to convey sequence
- Mark the current step with `aria-current="step"` (in addition to
  `data-ln-step="current"`)
- Each step's accessible name is the `data-ln-step-label` text
