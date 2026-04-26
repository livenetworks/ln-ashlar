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
button    → --padding-y/x: size-2xs (tight tap area), margin-left: auto
```

## Banner Variant

Full-width strip at the top of a page or section — for system-level
conditions that affect the entire session. Apply by adding the `banner`
class on top of `alert`.

```html
<!-- Non-dismissible — user cannot resolve the condition -->
<div class="alert banner" role="status" aria-live="polite">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-alert-triangle"></use></svg>
    <p>Scheduled maintenance Sunday 02:00–04:00 UTC.</p>
</div>

<!-- Dismissible, remembered across reloads -->
<div class="alert banner" id="trial-notice" role="status" aria-live="polite"
     data-ln-toggle="open" data-ln-persist>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-info-circle"></use></svg>
    <p>Your trial expires in 3 days. <a href="/upgrade">Upgrade now →</a></p>
    <button type="button" aria-label="Dismiss"
            data-ln-toggle-for="trial-notice"
            data-ln-toggle-action="close">
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</div>
```

### Structural delta

```
border-left:    none                                      ← was 3px accent
border-radius:  0                                         ← was --radius
border-bottom:  1px solid hsl(var(--color-primary) / 0.2)
padding-inline: var(--size-lg)                            ← wider than alert
width:          100%
```

Status color variants (`.success`, `.warning`, `.error`, `.info`) work
identically to alert — they cascade `--color-primary` and the bottom
border tint follows.

### Dismissal — `ln-toggle` + `data-ln-persist`

Dismissal is driven by `ln-toggle`, not `ln-modal`:

- `data-ln-toggle="open"` on the banner element → starts visible
- `data-ln-toggle-for="<id>" data-ln-toggle-action="close"` on the close
  button → dismisses
- `data-ln-persist` on the banner → remembers dismissed state in
  `localStorage`, scoped per page path

Once a user dismisses a `data-ln-persist` banner, it stays closed across
reloads. Storage key format: `ln:toggle:{pagePath}:{id}`. See
`js/ln-toggle/README.md` for the persistence contract.

### When to use

| Condition | Dismissible | Reason |
|-----------|-------------|--------|
| Maintenance window | No | No user action resolves it |
| Trial expiring — upgrade available | Yes | User can act or acknowledge |
| Account suspended | No | No local action resolves it |
| Feature flag / beta notice | Yes (`data-ln-persist`) | Acknowledge once |

**One banner at a time.** Two simultaneous banners is an architectural
error. If two system-level conditions exist simultaneously, show the
higher-severity one.

**Banner vs. inline alert.** If the condition is caused by a specific
page action, use an inline alert (no `banner` class). If the condition
exists regardless of what the user does on the page, add the `banner`
class.
