# ln-acme Documentation

Unified frontend library — SCSS CSS framework + vanilla JS components.

## How docs are organized

| Location | What | For whom |
|----------|------|----------|
| `CLAUDE.md` (root) | Project rules, coding standards, architectural decisions | AI — loaded every session |
| `.claude-skills/` | AI-optimized implementation reference (mixins, boilerplate, component wiring) | AI — preloaded into agents |
| `docs/README.md` | This file — documentation index | Humans |
| `docs/css/*.md` | CSS architecture per topic (tokens, mixins, cards, forms, etc.) | Humans + AI on-demand |
| `docs/js/*.md` | JS component architecture (internal state, render flow, design decisions) | Humans + AI on-demand |
| `js/ln-*/README.md` | Per-component usage guide (attributes, API, HTML, events) | Humans |

### AI Documentation Layers

```
Layer 1: .claude-skills/SKILL.md        ← Always preloaded. Quick reference.
Layer 2: .claude-skills/css/ + js/      ← Preloaded by domain architects. Implementation patterns.
Layer 3: docs/css/*.md + docs/js/*.md   ← Read on-demand. Deep architecture detail.
Layer 4: js/ln-*/README.md              ← Read on-demand. Usage examples and API reference.
```

---

## CSS

| Topic | Source | Docs |
|-------|--------|------|
| Design Tokens | `scss/config/_tokens.scss` | [tokens.md](css/tokens.md) |
| Mixins Reference | `scss/config/mixins/` | [mixins.md](css/mixins.md) |
| Cards | `scss/components/_cards.scss` | [cards.md](css/cards.md) |
| Sections | `scss/components/_sections.scss` | [sections.md](css/sections.md) |
| Navigation | `scss/components/_nav.scss` | [navigation.md](css/navigation.md) |
| Tables | `scss/components/_tables.scss` | [tables.md](css/tables.md) |
| Forms | `scss/components/_forms.scss` | [forms.md](css/forms.md) |
| Layout | `scss/config/mixins/_layout.scss` | [layout.md](css/layout.md) |
| Breadcrumbs | `scss/components/_breadcrumbs.scss` | [breadcrumbs.md](css/breadcrumbs.md) |
| Alert | `scss/components/_alert.scss` | [alert.md](css/alert.md) |
| Avatar | `scss/components/_avatar.scss` | [avatar.md](css/avatar.md) |
| Banner | `scss/components/_banner.scss` | [banner.md](css/banner.md) |
| Loader | `scss/components/_loader.scss` | [loader.md](css/loader.md) |
| Status Badge | `scss/components/_badge.scss` | [status-badge.md](css/status-badge.md) |
| Icons (CSS) | `scss/config/_icons.scss` | [../js/ln-icons/README.md](../js/ln-icons/README.md) |
| Container Queries | — | [ln-acme-container-queries.md](ln-acme-container-queries.md) |

---

## JS Components

Two files per component:
- **`js/ln-{name}/README.md`** — usage guide (attributes, API, HTML, events) — read this first
- **`docs/js/{name}.md`** — architecture reference (internal state, render flow, design decisions)

| Component | Attribute | Usage guide | Architecture |
|-----------|-----------|-------------|--------------|
| Core helpers | — | — | [core.md](js/core.md) |
| Icons | (auto-init) | [js/ln-icons/README.md](../js/ln-icons/README.md) | [icons.md](js/icons.md) |
| Toggle | `data-ln-toggle` | [js/ln-toggle/README.md](../js/ln-toggle/README.md) | [toggle.md](js/toggle.md) |
| Accordion | `data-ln-accordion` | [js/ln-accordion/README.md](../js/ln-accordion/README.md) | [accordion.md](js/accordion.md) |
| Modal | `data-ln-modal` | [js/ln-modal/README.md](../js/ln-modal/README.md) | [modal.md](js/modal.md) |
| Tabs | `data-ln-tabs` | [js/ln-tabs/README.md](../js/ln-tabs/README.md) | [tabs.md](js/tabs.md) |
| Toast | `data-ln-toast` | [js/ln-toast/README.md](../js/ln-toast/README.md) | [toast.md](js/toast.md) |
| Dropdown | `data-ln-dropdown` | [js/ln-dropdown/README.md](../js/ln-dropdown/README.md) | [dropdown.md](js/dropdown.md) |
| Nav | `data-ln-nav` | [js/ln-nav/README.md](../js/ln-nav/README.md) | [nav.md](js/nav.md) |
| Filter | `data-ln-filter` | [js/ln-filter/README.md](../js/ln-filter/README.md) | [filter.md](js/filter.md) |
| Search | `data-ln-search` | [js/ln-search/README.md](../js/ln-search/README.md) | [search.md](js/search.md) |
| Table | `data-ln-table` | [js/ln-table/README.md](../js/ln-table/README.md) | [table.md](js/table.md) |
| Table Sort | `data-ln-sort` | [js/ln-table/README.md](../js/ln-table/README.md) | [table-sort.md](js/table-sort.md) |
| Data Table | `data-ln-data-table` | [js/ln-data-table/README.md](../js/ln-data-table/README.md) | [data-table.md](js/data-table.md) |
| Sortable | `data-ln-sortable` | [js/ln-sortable/README.md](../js/ln-sortable/README.md) | [sortable.md](js/sortable.md) |
| Progress | `data-ln-progress` | [js/ln-progress/README.md](../js/ln-progress/README.md) | [progress.md](js/progress.md) |
| Circular Progress | `data-ln-circular-progress` | [js/ln-circular-progress/README.md](../js/ln-circular-progress/README.md) | [circular-progress.md](js/circular-progress.md) |
| Link | `data-ln-link` | [js/ln-link/README.md](../js/ln-link/README.md) | [link.md](js/link.md) |
| Confirm | `data-ln-confirm` | [js/ln-confirm/README.md](../js/ln-confirm/README.md) | [confirm.md](js/confirm.md) |
| Upload | `data-ln-upload` | [js/ln-upload/README.md](../js/ln-upload/README.md) | [upload.md](js/upload.md) |
| AJAX | `data-ln-ajax` | [js/ln-ajax/README.md](../js/ln-ajax/README.md) | [ajax.md](js/ajax.md) |
| HTTP | — | [js/ln-http/README.md](../js/ln-http/README.md) | [http.md](js/http.md) |
| Store | `data-ln-store` | [js/ln-store/README.md](../js/ln-store/README.md) | [store.md](js/store.md) |
| Form | `data-ln-form` | [js/ln-form/README.md](../js/ln-form/README.md) | [form.md](js/form.md) |
| Validate | `data-ln-validate` | [js/ln-validate/README.md](../js/ln-validate/README.md) | [validate.md](js/validate.md) |
| Time | `data-ln-time` | [js/ln-time/README.md](../js/ln-time/README.md) | [time.md](js/time.md) |
| Select | `data-ln-select` | [js/ln-select/README.md](../js/ln-select/README.md) | [select.md](js/select.md) |
| Autosave | `data-ln-autosave` | [js/ln-autosave/README.md](../js/ln-autosave/README.md) | [autosave.md](js/autosave.md) |
| Autoresize | `data-ln-autoresize` | [js/ln-autoresize/README.md](../js/ln-autoresize/README.md) | [autoresize.md](js/autoresize.md) |
| Translations | `data-ln-translations` | [js/ln-translations/README.md](../js/ln-translations/README.md) | [translations.md](js/translations.md) |
| External Links | (automatic) | [js/ln-external-links/README.md](../js/ln-external-links/README.md) | [external-links.md](js/external-links.md) |

---

## Architecture References

| Topic | File |
|-------|------|
| JS Component Patterns | [js/component-guide.md](js/component-guide.md) |
| Reactive Architecture (v2) | [v2-reactive.md](v2-reactive.md) |
| Container Queries | [ln-acme-container-queries.md](ln-acme-container-queries.md) |