# ln-icons

On-demand SVG icon loader — scans the DOM for `<use href="#ln-*">` and `<use href="#lnc-*">`, fetches each icon individually from CDN, and builds a hidden `<svg>` sprite at runtime. No bundled SVG content.

## Two Prefixes

| Prefix | Source | Config required |
|--------|--------|----------------|
| `#ln-` | [Tabler Icons](https://tabler.io/icons) via jsDelivr | no |
| `#lnc-` | Your custom CDN | `window.LN_ICONS_CUSTOM_CDN` |

Routing is determined entirely by the prefix — no lists, no config arrays.

## HTML

```html
<!-- Tabler icon -->
<svg class="ln-icon" aria-hidden="true"><use href="#ln-home"></use></svg>

<!-- Custom icon -->
<svg class="ln-icon" aria-hidden="true"><use href="#lnc-file-pdf"></use></svg>

<!-- Icon in a button with text -->
<button>
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-plus"></use></svg>
    Add User
</button>

<!-- Icon-only button — aria-label required -->
<button aria-label="Close">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-x"></use></svg>
</button>
```

## Sizes

| Class | Size |
|-------|------|
| `ln-icon--sm` | 1rem |
| *(default)* | 1.25rem |
| `ln-icon--lg` | 1.5rem |
| `ln-icon--xl` | 4rem |

## Color

Icons inherit `currentColor` — set via CSS `color` on any ancestor:

```html
<span style="color: hsl(var(--color-error));">
    <svg class="ln-icon" aria-hidden="true"><use href="#ln-alert-triangle"></use></svg>
</span>
```

**Exception:** custom multi-color icons (`lnc-file-pdf`, `lnc-file-doc`, `lnc-file-epub`) have semantic stroke colors embedded in their SVG source and do not follow `currentColor`.

## Accordion Chevron

```html
<header data-ln-toggle-for="panel1">
    Section Title
    <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
</header>
```

## Available Tabler Icons

Any icon from [tabler.io/icons](https://tabler.io/icons). Full name list: `scss/tabler-icons.txt`

## Config

Set on `window` before the script loads:

| Property | Default | Description |
|---|---|---|
| `window.LN_ICONS_CDN` | `https://cdn.jsdelivr.net/npm/@tabler/icons@latest/icons` | Tabler CDN base URL |
| `window.LN_ICONS_CUSTOM_CDN` | — | CDN base URL for `lnc-` icons |

```html
<script>
    window.LN_ICONS_CUSTOM_CDN = 'https://your-cdn.com/icons';
</script>
<script src="dist/ln-acme.iife.js" defer></script>
```

## Adding a Custom Icon

1. Add `js/ln-icons/icons/{name}.svg` — use `stroke="currentColor"` or `fill="currentColor"`
2. Run `npm run build` → file appears in `dist/icons/`
3. Upload `dist/icons/{name}.svg` to your CDN
4. Use as `<use href="#lnc-{name}">`

No config update needed — the `lnc-` prefix routes automatically.

## No Init Required

Runs automatically on `DOMContentLoaded`. MutationObserver handles icons added dynamically after page load.
