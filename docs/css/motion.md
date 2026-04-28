# Motion

Files:
- `scss/config/mixins/_motion.scss` — `motion-safe` mixin
- `scss/config/_tokens.scss` — duration and easing tokens

## Philosophy

ln-ashlar respects `prefers-reduced-motion: reduce`. Every animation
and every transform/height/opacity transition is gated so users who
have opted out of motion see instant state changes.

**What is gated:**
- `@keyframes` animations (spin, pulse, fade, slide)
- `transform` transitions (translate, scale, rotate)
- `opacity` transitions on appearance/disappearance
- `height` / `max-height` / `width` transitions

**What is NOT gated:**
- `color` transitions on hover/focus/active — these do not cause
  vestibular issues and removing them would make interactive
  elements feel broken.

## Using motion-safe

```scss
@use 'ln-ashlar/scss/config/mixins' as *;

.my-animated-panel {
	opacity: 0;
	transform: translateY(1rem);

	@include motion-safe {
		transition: opacity var(--transition-base),
		            transform var(--transition-base) var(--easing-decelerate);
	}

	&.is-open {
		opacity: 1;
		transform: translateY(0);
	}
}
```

When `prefers-reduced-motion: reduce` is set, the transition is never
declared — the browser applies the final state instantly on class
change.

## Duration tokens

| Token | Value | Use |
|---|---|---|
| `--transition-fast` | 150ms + standard easing | Hover, focus, small changes |
| `--transition-base` | 200ms + standard easing | Default UI motion |
| `--transition-slow` | 300ms + standard easing | Modal open/close, drawer |

## Easing tokens (curves only)

| Token | Curve | Use |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default |
| `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations |
| `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations |
| `--easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Emphasis / success |
