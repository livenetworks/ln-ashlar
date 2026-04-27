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

## Tokens read

The chip mixin rebinds the shared primitives on its own scope and reads
them. Override primitives or vocabulary on a parent scope to retheme
the chip in that context.

| Rebind inside mixin | Vocabulary chosen | Role |
|---|---|---|
| `--color-bg: var(--bg-recessed)` | `--bg-recessed` | Default chip background (neutral tone) |
| `--color-fg: var(--fg-muted)` | `--fg-muted` | Default chip text |

The chip mixin reads `--color-bg` for background and `--color-fg` for
text. The close button resting icon reads `--color-fg` at reduced
opacity; its hover background reads `--color-border`.

Tone variants resolve their background and text from the corresponding
status token at 12% alpha:

| Tone | Background | Text |
|---|---|---|
| `success` | `hsl(var(--color-success) / 0.12)` | `hsl(var(--color-success))` |
| `warning` | `hsl(var(--color-warning) / 0.12)` | `hsl(var(--color-warning))` |
| `error` | `hsl(var(--color-error) / 0.12)` | `hsl(var(--color-error))` |
| `info` | `hsl(var(--color-info) / 0.12)` | `hsl(var(--color-info))` |

Examples:

```scss
// Shift the chip to an elevated surface in one section
#filter-bar { --bg-recessed: var(--bg-elevated); }

// One-off custom tone (matches the success/warning/error pattern)
#legal-chip[data-ln-chip] {
	background: hsl(var(--color-secondary) / 0.12);
	color:      hsl(var(--color-secondary));
}
```

Note that rebinding `--bg-recessed` at a parent shifts every component
in scope that chooses that vocabulary value (chip, code blocks, progress
tracks, kbd) — by design. See `docs/css/tokens.md` § "Value vocabulary"
for the rationale.

## Accessibility

The close button uses `all: unset` to reset browser defaults.
A `:focus-visible` ring is explicitly restored so keyboard users
can see focus when tabbing to the button.
Always include an `aria-label` on the close button describing what
will be removed.
