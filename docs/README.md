# acme-gui Documentation

Unified frontend library — SCSS CSS framework + vanilla JS components.

## Architecture

```
scss/config/_tokens.scss    → CSS custom properties (:root)
scss/config/_mixins.scss    → SCSS @include utility mixins
scss/components/*.scss      → CSS components
js/ln-*/                    → Vanilla JS components (IIFE pattern)
```

## CSS Components

| Component | File | Docs |
|-----------|------|------|
| Design Tokens | `scss/config/_tokens.scss` | [tokens.md](css/tokens.md) |
| Mixins | `scss/config/_mixins.scss` | [mixins.md](css/mixins.md) |
| Cards | `scss/components/_cards.scss` | [cards.md](css/cards.md) |
| Sections | `scss/components/_sections.scss` | [sections.md](css/sections.md) |
| Navigation | `scss/components/_nav.scss` | [navigation.md](css/navigation.md) |
| Tables | `scss/components/_tables.scss` | [tables.md](css/tables.md) |
| Forms | `scss/components/_forms.scss` | [forms.md](css/forms.md) |
| Buttons | `scss/components/_buttons.scss` | — |
| Tabs | `scss/components/_tabs.scss` | — |
| Toggle | `scss/components/_toggle.scss` | — |
| Breadcrumbs | `scss/components/_breadcrumbs.scss` | [breadcrumbs.md](css/breadcrumbs.md) |
| Loader | `scss/components/_loader.scss` | — |
| Scrollbar | `scss/components/_scrollbar.scss` | — |
| Layout | `scss/layout/` | [layout.md](css/layout.md) |

## JS Components

| Component | Attribute | Docs |
|-----------|-----------|------|
| Modal | `data-ln-modal` | [modal.md](js/modal.md) |
| Toast | `data-ln-toast` | [toast.md](js/toast.md) |
| Tabs | `data-ln-tabs` | [tabs.md](js/tabs.md) |
| Progress | `data-ln-progress` | [progress.md](js/progress.md) |
| Upload | `data-ln-upload` | [upload.md](js/upload.md) |
| AJAX | `data-ln-ajax` | [ajax.md](js/ajax.md) |
| Select | `data-ln-select` | [select.md](js/select.md) |
| Nav | `data-ln-nav` | [nav.md](js/nav.md) |
| External Links | (automatic) | [external-links.md](js/external-links.md) |

## Build

```bash
npm run build   # dist/ln-acme.css + .js + .iife.js
npm run dev     # Watch mode
```

## Integration

```html
<link rel="stylesheet" href="dist/ln-acme.css">
<script src="dist/ln-acme.iife.js" defer></script>
```

```js
// npm module
import 'acme-gui';
import 'acme-gui/dist/ln-acme.css';
```
