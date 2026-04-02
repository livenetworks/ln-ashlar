# ln-acme Documentation

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

## JS Components

| Component | Attribute | Docs |
|-----------|-----------|------|
| Core | — | [core.md](js/core.md) |
| Toggle | `data-ln-toggle` | [toggle.md](js/toggle.md) |
| Accordion | `data-ln-accordion` | [accordion.md](js/accordion.md) |
| Modal | `data-ln-modal` | [modal.md](js/modal.md) |
| Tabs | `data-ln-tabs` | [tabs.md](js/tabs.md) |
| Toast | `data-ln-toast` | [toast.md](js/toast.md) |
| Dropdown | `data-ln-dropdown` | [dropdown.md](js/dropdown.md) |
| Nav | `data-ln-nav` | [nav.md](js/nav.md) |
| Progress | `data-ln-progress` | [progress.md](js/progress.md) |
| Circular Progress | `data-ln-circular-progress` | [circular-progress.md](js/circular-progress.md) |
| Filter | `data-ln-filter` | [filter.md](js/filter.md) |
| Search | `data-ln-search` | [search.md](js/search.md) |
| Table | `data-ln-table` | [table.md](js/table.md) |
| Table Sort | `data-ln-sort` | [table-sort.md](js/table-sort.md) |
| Sortable | `data-ln-sortable` | [sortable.md](js/sortable.md) |
| Link | `data-ln-link` | [link.md](js/link.md) |
| Confirm | `data-ln-confirm` | [confirm.md](js/confirm.md) |
| Upload | `data-ln-upload` | [upload.md](js/upload.md) |
| AJAX | `data-ln-ajax` | [ajax.md](js/ajax.md) |
| HTTP | — | [http.md](js/http.md) |
| Select | `data-ln-select` | [select.md](js/select.md) |
| Autosave | `data-ln-autosave` | [autosave.md](js/autosave.md) |
| Autoresize | `data-ln-autoresize` | [autoresize.md](js/autoresize.md) |
| Translations | `data-ln-translations` | [translations.md](js/translations.md) |
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
import 'ln-acme';
import 'ln-acme/dist/ln-acme.css';
```
