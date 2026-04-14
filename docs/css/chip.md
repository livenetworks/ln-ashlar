# Chip

File: `scss/config/mixins/_chip.scss` + `scss/components/_chip.scss`.

Inline passive label. For active filter tags, status labels, and
metadata display.

## Chip vs pill

| Component | Use |
|---|---|
| `pill` | Radio/checkbox-backed interactive option |
| `chip` | Passive label, optional close button |

## Usage

```html
<!-- Plain chip -->
<span data-ln-chip>Draft</span>

<!-- Chip with remove button (for active filters) -->
<span data-ln-chip>
	Quality Manual
	<button type="button" aria-label="Remove">
		<svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
	</button>
</span>

<!-- Tone variants -->
<span data-ln-chip="success">Approved</span>
<span data-ln-chip="warning">Pending</span>
<span data-ln-chip="error">Rejected</span>
<span data-ln-chip="info">Draft</span>
```

## Tone variants

| Attribute | Background tint |
|---|---|
| (none) | Neutral grey |
| `data-ln-chip="success"` | Success 12% |
| `data-ln-chip="warning"` | Warning 12% |
| `data-ln-chip="error"` | Error 12% |
| `data-ln-chip="info"` | Info 12% |

## Accessibility

The close button uses `all: unset` to reset browser defaults.
A `:focus-visible` ring is explicitly restored so keyboard users
can see focus when tabbing to the button.
Always include an `aria-label` on the close button describing what
will be removed.
