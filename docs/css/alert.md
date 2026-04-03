# Alert

Inline contextual feedback element — left-border + tinted background with icon, message, and optional dismiss. File: `scss/config/mixins/_alert.scss`.

Applied automatically to `.alert` via `scss/components/_alert.scss`.

## HTML

```html
<!-- Info (default) -->
<div class="alert" role="alert">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-info-circle"></use></svg>
    <p>Your session will expire in 5 minutes.</p>
</div>

<!-- With dismiss button -->
<div class="alert" role="alert">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-circle-check"></use></svg>
    <p>Changes have been saved.</p>
    <button type="button" aria-label="Dismiss">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</div>
```

## Color Variants

Color is driven entirely by `--color-primary`. Override on the element or a parent:

```scss
.alert.success { --color-primary: var(--color-success); }
.alert.warning { --color-primary: var(--color-warning); }
.alert.error   { --color-primary: var(--color-error); }
```

| Variant | `--color-primary` override | Recommended icon |
|---------|---------------------------|-----------------|
| Info (default) | — | `#ln-info-circle` |
| Success | `var(--color-success)` | `#ln-circle-check` |
| Warning | `var(--color-warning)` | `#ln-alert-triangle` |
| Error | `var(--color-error)` | `#ln-circle-x` |

## SCSS

```scss
// Default — .alert class works out of the box
<div class="alert">...</div>

// Project semantic selector
#system-notice { @include alert; --color-primary: var(--color-warning); }
```

## Structure

```
flex-row · items-center · gap-sm · py-sm px-md · rounded-md · text-sm

border-left: 3px solid hsl(var(--color-primary))
background:  hsl(var(--color-primary) / 0.08)   ← 8% tint

.ln-icon  → primary color, flex-shrink-0
p         → flex-1, no margin
button    → @include close-button, margin-left: auto
```
