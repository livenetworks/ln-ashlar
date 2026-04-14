# ln-acme Documentation

Unified frontend library — SCSS CSS framework + vanilla JS components.

## How docs are organized

| Location | What | For whom |
|----------|------|----------|
| `CLAUDE.md` (root) | Project rules, coding standards, architectural decisions | AI — loaded every session |
| `docs/README.md` | This file — documentation index | Humans |
| `docs/css/*.md` | CSS architecture per topic (tokens, mixins, cards, forms, etc.) | Humans + AI on-demand |
| `docs/js/*.md` | JS component architecture (internal state, render flow, design decisions) | Humans + AI on-demand |
| `js/ln-*/README.md` | Per-component usage guide (attributes, API, HTML, events) | Humans |

---

## CSS

**Foundation** (tokens, config, mixins — consumed by every component)

| Topic | Source | Docs |
|-------|--------|------|
| Design Tokens | `scss/config/_tokens.scss` | [tokens.md](css/tokens.md) |
| Breakpoints | `scss/config/_breakpoints.scss` | [breakpoints.md](css/breakpoints.md) |
| Typography | `scss/config/mixins/_typography.scss` | [typography.md](css/typography.md) |
| Theming (Dark Mode) | `scss/config/_theme.scss` | [theming.md](css/theming.md) |
| Motion | `scss/config/mixins/_motion.scss` | [motion.md](css/motion.md) |
| Layout | `scss/config/mixins/_layout.scss` | [layout.md](css/layout.md) |
| Mixins Reference | `scss/config/mixins/` | [mixins.md](css/mixins.md) |
| Icons (CSS) | `scss/config/_icons.scss` | [../js/ln-icons/README.md](../js/ln-icons/README.md) |
| Container Queries | — | [ln-acme-container-queries.md](ln-acme-container-queries.md) |

**Components** (alphabetical)

| Topic | Source | Docs |
|-------|--------|------|
| Alert | `scss/components/_alert.scss` | [alert.md](css/alert.md) |
| Avatar | `scss/components/_avatar.scss` | [avatar.md](css/avatar.md) |
| Banner | `scss/components/_banner.scss` | [banner.md](css/banner.md) |
| Breadcrumbs | `scss/components/_breadcrumbs.scss` | [breadcrumbs.md](css/breadcrumbs.md) |
| Cards | `scss/components/_cards.scss` | [cards.md](css/cards.md) |
| Chip | `scss/components/_chip.scss` | [chip.md](css/chip.md) |
| Empty State | `scss/components/_empty-state.scss` | [empty-state.md](css/empty-state.md) |
| Forms | `scss/components/_forms.scss` | [forms.md](css/forms.md) |
| Kbd | `scss/config/mixins/_kbd.scss` | [kbd.md](css/kbd.md) |
| Loader | `scss/components/_loader.scss` | [loader.md](css/loader.md) |
| Navigation | `scss/components/_nav.scss` | [navigation.md](css/navigation.md) |
| Page Header | `scss/components/_page-header.scss` | [page-header.md](css/page-header.md) |
| Prose | `scss/components/_prose.scss` | [prose.md](css/prose.md) |
| Sections | `scss/components/_sections.scss` | [sections.md](css/sections.md) |
| Stat Card | `scss/components/_stat-card.scss` | [stat-card.md](css/stat-card.md) |
| Status Badge | `scss/components/_status-badge.scss` | [status-badge.md](css/status-badge.md) |
| Stepper | `scss/components/_stepper.scss` | [stepper.md](css/stepper.md) |
| Tables | `scss/components/_tables.scss` | [tables.md](css/tables.md) |
| Timeline | `scss/components/_timeline.scss` | [timeline.md](css/timeline.md) |
| Tooltip | `scss/components/_tooltip.scss` | [tooltip.md](css/tooltip.md) |
| Toggle Switch | `scss/components/_toggle-switch.scss` | [toggle-switch.md](css/toggle-switch.md) |

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

---

## Roadmap — v1.1 Design System (in flight)

Master roadmap: [../plans/design-system-v1.1-roadmap.md](../plans/design-system-v1.1-roadmap.md).
Each phase has its own executor-ready plan; pick by dependency, not file order.

| # | Phase | Plan | Track |
|---|-------|------|-------|
| 1 | Foundation tokens | [v1.1-phase-1-tokens.md](../plans/v1.1-phase-1-tokens.md) | MVP |
| 2 | Neutral color scale | [v1.1-phase-2-neutral-scale.md](../plans/v1.1-phase-2-neutral-scale.md) | MVP |
| 3 | Typography re-hierarchy | [v1.1-phase-3-typography.md](../plans/v1.1-phase-3-typography.md) | Full v1.1 |
| 4 | Shadows + focus halo | [v1.1-phase-4-shadows-focus.md](../plans/v1.1-phase-4-shadows-focus.md) | MVP |
| 5 | Motion-safe retrofit | [v1.1-phase-5-motion-safe.md](../plans/v1.1-phase-5-motion-safe.md) | MVP |
| 6 | Dark mode | [v1.1-phase-6-dark-mode.md](../plans/v1.1-phase-6-dark-mode.md) | Full v1.1 |
| 7a | Loading + empty states | [v1.1-phase-7a-loading-components.md](../plans/v1.1-phase-7a-loading-components.md) | Full v1.1 |
| 7b | Navigation components | [v1.1-phase-7b-navigation-components.md](../plans/v1.1-phase-7b-navigation-components.md) | Full v1.1 |
| 7c | Content components | [v1.1-phase-7c-content-components.md](../plans/v1.1-phase-7c-content-components.md) | Full v1.1 |
| 7d | Interaction components | [v1.1-phase-7d-interaction-components.md](../plans/v1.1-phase-7d-interaction-components.md) | Full v1.1 |
| 8 | JS-enhanced components | [v1.1-phase-8-js-components.md](../plans/v1.1-phase-8-js-components.md) | v1.2 candidate |
| 9 | Density system | [v1.1-phase-9-density.md](../plans/v1.1-phase-9-density.md) | v1.2 candidate |
| 10 | Infrastructure | [v1.1-phase-10-infrastructure.md](../plans/v1.1-phase-10-infrastructure.md) | v1.2 candidate |

Execution order: 1 → (2, 4, 5 in any order) → 3 → 6 → 7a–d → 8/9 → 10.
See [todo.md](../todo.md) § "Design System v1.1" for the live checklist.