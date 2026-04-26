# Timeline

File: `scss/config/mixins/_timeline.scss` + `scss/components/_timeline.scss`.

Vertical activity feed for audit logs, version history, comment
threads.

## Structure

```html
<ol data-ln-timeline>
	<li>
		<time datetime="2026-04-14T09:32">Apr 14, 09:32</time>
		<h4>Document approved</h4>
		<p>Review completed with no outstanding issues</p>
	</li>
	<li>
		<time datetime="2026-04-13T14:18">Apr 13, 14:18</time>
		<h4>Revision submitted</h4>
		<p>Draft saved with 3 changes</p>
	</li>
</ol>
```

## Elements

- **`<time>`** — ISO datetime attribute + formatted display text; renders in `caption` role (muted)
- **`<h4>`** — event title (`title-sm` role, primary text color)
- **`<p>`** — event description (`body-sm` role, secondary text color)

## Rail

A vertical 2px rail runs the full height of the list via `::before` on
the `<ol>`. Bullets are primary-coloured 12px circles rendered via
`::before` on each `<li>`. A 3px ring in `--color-bg-default` visually
separates the bullet from the rail, and adapts correctly in dark mode
because it reads the surface token.

## Accessibility

- Use `<ol>` to convey sequence
- Include `datetime` attribute on `<time>` for machine-readable timestamps
- Order entries newest-first (most recent at top) for audit log context

## Project selectors

```scss
#audit-log { @include timeline; }
```

## Related

If you need interactive updates (new entries appearing, live filters),
consider a JS layer on top — but the baseline timeline is pure CSS.
