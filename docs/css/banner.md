# Banner

Full-width status strip at the top of the page — system-level conditions that affect the entire session. File: `scss/config/mixins/_banner.scss`.

Applied automatically to `.ln-banner` via `scss/components/_banner.scss`.

Uses `ln-modal` JS for open/close state (`data-ln-modal` attribute + `element.lnModal.open()` / `.close()`). Unlike `.ln-modal` dialogs — no overlay, no backdrop blur, no scroll lock. Banner is in document flow and pushes content downward.

## HTML

```html
<!-- Non-dismissible — user cannot resolve the condition -->
<div class="ln-modal ln-banner" data-ln-modal="open" id="maintenance-banner" role="status" aria-live="polite">
    <form>
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-alert-triangle"></use></svg>
        <p>Scheduled maintenance Sunday 02:00–04:00 UTC. Some features may be unavailable.</p>
    </form>
</div>

<!-- Dismissible — user can act or acknowledge -->
<div class="ln-modal ln-banner" data-ln-modal id="trial-banner" role="status" aria-live="polite">
    <form>
        <svg class="ln-icon" aria-hidden="true"><use href="#ln-info-circle"></use></svg>
        <p>Your trial expires in 3 days. <a href="/upgrade">Upgrade now →</a></p>
        <button type="button" aria-label="Dismiss" data-ln-modal-close>
            <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
        </button>
    </form>
</div>
```

Show on page load when a condition is met:

```js
document.getElementById('trial-banner').lnModal.open();
// or set server-side: data-ln-modal="open"
```

## Color Variants

Color is driven by `--color-primary`. Override on the element:

```scss
#trial-banner { --color-primary: var(--color-warning); }
#error-banner { --color-primary: var(--color-error); }
```

| Variant | `--color-primary` override | Recommended icon |
|---------|---------------------------|-----------------|
| Info (default) | — | `#ln-info-circle` |
| Warning | `var(--color-warning)` | `#ln-alert-triangle` |
| Error | `var(--color-error)` | `#ln-circle-x` |

## SCSS

```scss
// Default — .ln-banner class works out of the box
<div class="ln-modal ln-banner" data-ln-modal>...</div>

// Project semantic selector
#maintenance-notice { @include banner; --color-primary: var(--color-warning); }
```

## Structure

```
full-width · no border-radius · flex-row · items-center · gap-md · py-sm px-lg
in document flow — no overlay, no backdrop, no scroll lock

border-bottom: 1px solid hsl(var(--color-primary) / 0.2)
background:    hsl(var(--color-primary) / 0.06)

.ln-icon → primary color, flex-shrink-0
p        → flex-1, no margin, text-sm
button   → @include close-button, margin-left: auto
```

## When to use

| Condition | Dismissible | Reason |
|-----------|-------------|--------|
| Maintenance window | No | No user action resolves it |
| Trial expiring — upgrade available | Yes | User can act (upgrade) or choose to ignore |
| Account suspended | No | No local action resolves it |
| Feature flag / beta notice | Yes | Informational, user acknowledges once |

**One banner at a time.** Two simultaneous banners is an architectural error. If two system-level conditions exist simultaneously, show the higher severity one.

**Not for action feedback.** Use `@include alert` for section-specific messages and `ln-toast` for action confirmations.
