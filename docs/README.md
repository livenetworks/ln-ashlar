# ln-ashlar Documentation

Unified frontend library — SCSS CSS framework + vanilla JS components.

## How docs are organized

| Location | What | For whom |
|----------|------|----------|
| `CLAUDE.md` (root) | Project AI Core Rules & Pre-Code Checklist | AI — loaded every session |
| `docs/README.md` | This file — documentation index | Humans |
| `docs/css/*.md` | CSS architecture per topic (tokens, mixins, cards, forms, etc.) | Humans + AI on-demand |
| `js/ln-*/README.md` | Per-component usage guide (attributes, API, HTML, events) plus architecture reference (internal state, render flow, design decisions) | Humans |

---

## CSS

**Foundation** (tokens, config, mixins — consumed by every component)

| Topic | Source | Docs |
|-------|--------|------|
| Design Tokens | `scss/config/_tokens.scss` | [tokens.md](css/tokens.md) |
| Breakpoints | `scss/config/_breakpoints.scss` | [breakpoints.md](css/breakpoints.md) |
| Typography | `scss/config/mixins/_typography.scss` | [typography.md](css/typography.md) |
| Theming (Dark Mode) | `scss/config/_theme.scss` | [theming.md](css/theming.md) |
| Density | `scss/config/_density.scss` | [density.md](css/density.md) |
| Motion | `scss/config/mixins/_motion.scss` | [motion.md](css/motion.md) |
| Layout | `scss/config/mixins/_layout.scss` | [layout.md](css/layout.md) |
| Mixins Reference | `scss/config/mixins/` | [mixins.md](css/mixins.md) |
| Icons (CSS) | `scss/config/_icons.scss` | [../js/ln-icons/README.md](../js/ln-icons/README.md) |
| Container Queries | — | [ln-ashlar-container-queries.md](ln-ashlar-container-queries.md) |

**Components** (alphabetical)

| Topic | Source | Docs |
|-------|--------|------|
| Alert | `scss/components/_alert.scss` | [alert.md](css/alert.md) |
| Avatar | `scss/components/_avatar.scss` | [avatar.md](css/avatar.md) |
| Breadcrumbs | `scss/components/_breadcrumbs.scss` | [breadcrumbs.md](css/breadcrumbs.md) |
| Cards | `scss/components/_card.scss` | [cards.md](css/cards.md) |
| Chip | `scss/components/_chip.scss` | [chip.md](css/chip.md) |
| Empty State | `scss/components/_empty-state.scss` | [empty-state.md](css/empty-state.md) |
| Forms | `scss/components/_form.scss` | [forms.md](css/forms.md) |
| Kbd | `scss/config/mixins/_kbd.scss` | [kbd.md](css/kbd.md) |
| Loader | `scss/components/_loader.scss` | [loader.md](css/loader.md) |
| Navigation | `scss/components/_nav.scss` | [navigation.md](css/navigation.md) |
| Page Header | `scss/components/_page-header.scss` | [page-header.md](css/page-header.md) |
| Prose | `scss/components/_prose.scss` | [prose.md](css/prose.md) |
| Sections | `scss/components/_sections.scss` | [sections.md](css/sections.md) |
| Stat Card | `scss/components/_stat-card.scss` | [stat-card.md](css/stat-card.md) |
| Status Badge | `scss/components/_status-badge.scss` | [status-badge.md](css/status-badge.md) |
| Stepper | `scss/components/_stepper.scss` | [stepper.md](css/stepper.md) |
| Tables | `scss/components/_table.scss` | [tables.md](css/tables.md) |
| Timeline | `scss/components/_timeline.scss` | [timeline.md](css/timeline.md) |
| Tooltip | `scss/components/_tooltip.scss` | [tooltip.md](css/tooltip.md) |
| Pills & Switches | `scss/components/_form.scss` | [toggles-and-pills.md](css/toggles-and-pills.md) |

---

## JS Components

Each component ships one file — usage guide plus architecture reference
(internal state, render flow, design decisions) in the same document:

| Component | Attribute | README |
|-----------|-----------|--------|
| Core helpers | — | [js/ln-core/README.md](../js/ln-core/README.md) |
| Icons | (auto-init) | [js/ln-icons/README.md](../js/ln-icons/README.md) |
| Toggle | `data-ln-toggle` | [js/ln-toggle/README.md](../js/ln-toggle/README.md) |
| Accordion | `data-ln-accordion` | [js/ln-accordion/README.md](../js/ln-accordion/README.md) |
| Modal | `data-ln-modal` | [js/ln-modal/README.md](../js/ln-modal/README.md) |
| Tabs | `data-ln-tabs` | [js/ln-tabs/README.md](../js/ln-tabs/README.md) |
| Toast | `data-ln-toast` | [js/ln-toast/README.md](../js/ln-toast/README.md) |
| Dropdown | `data-ln-dropdown` | [js/ln-dropdown/README.md](../js/ln-dropdown/README.md) |
| Popover | `data-ln-popover` | [js/ln-popover/README.md](../js/ln-popover/README.md) |
| Tooltip (JS) | `data-ln-tooltip-enhance` | [js/ln-tooltip/README.md](../js/ln-tooltip/README.md) |
| Nav | `data-ln-nav` | [js/ln-nav/README.md](../js/ln-nav/README.md) |
| Filter | `data-ln-filter` | [js/ln-filter/README.md](../js/ln-filter/README.md) |
| Search | `data-ln-search` | [js/ln-search/README.md](../js/ln-search/README.md) |
| Table | `data-ln-table` | [js/ln-table/README.md](../js/ln-table/README.md) |
| Table Sort | `data-ln-table-sort` | [js/ln-table/README.md](../js/ln-table/README.md) |
| Sortable | `data-ln-table-sortable` | [js/ln-sortable/README.md](../js/ln-sortable/README.md) |
| Progress | `data-ln-progress` | [js/ln-progress/README.md](../js/ln-progress/README.md) |
| Circular Progress | `data-ln-circular-progress` | [js/ln-circular-progress/README.md](../js/ln-circular-progress/README.md) |
| Link | `data-ln-link` | [js/ln-link/README.md](../js/ln-link/README.md) |
| Confirm | `data-ln-confirm` | [js/ln-confirm/README.md](../js/ln-confirm/README.md) |
| Debug | `data-ln-debug` | [js/ln-debug/README.md](../js/ln-debug/README.md) |
| Upload | `data-ln-upload` | [js/ln-upload/README.md](../js/ln-upload/README.md) |
| AJAX | `data-ln-ajax` | [js/ln-ajax/README.md](../js/ln-ajax/README.md) |
| Router | `data-ln-route` | [js/ln-router/README.md](../js/ln-router/README.md) |
| HTTP | — | [js/ln-http/README.md](../js/ln-http/README.md) |
| Store | `data-ln-data-store` | [js/ln-data-store/README.md](../js/ln-data-store/README.md) |
| Form | `data-ln-form` | [js/ln-form/README.md](../js/ln-form/README.md) |
| Validate | `data-ln-validate` | [js/ln-validate/README.md](../js/ln-validate/README.md) |
| Time | `data-ln-time` | [js/ln-time/README.md](../js/ln-time/README.md) |
| Autosave | `data-ln-autosave` | [js/ln-autosave/README.md](../js/ln-autosave/README.md) |
| Autoresize | `data-ln-autoresize` | [js/ln-autoresize/README.md](../js/ln-autoresize/README.md) |
| Translations | `data-ln-translations` | [js/ln-translations/README.md](../js/ln-translations/README.md) |
| External Links | (automatic) | [js/ln-external-links/README.md](../js/ln-external-links/README.md) |

---

## Architecture References

| Topic | File |
|-------|------|
| Master Architect Overview | [architecture/overview.md](architecture/overview.md) |
| JS Component Patterns | [architecture/component-guide.md](architecture/component-guide.md) |
| Reactive Architecture | [reactive.md](reactive.md) |
| Container Queries | [ln-ashlar-container-queries.md](ln-ashlar-container-queries.md) |
| Core Component & Styling Specs | [architecture/reference.md](architecture/reference.md) |
| Security Architecture & Best Practices | [architecture/security.md](architecture/security.md) |
| Dev Diagnostics & DOM Linter | [architecture/diagnostics.md](architecture/diagnostics.md) |


