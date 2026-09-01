# ln-ashlar Documentation

Unified frontend library — SCSS CSS framework + vanilla JS components.

## How docs are organized

| Location | What | For whom |
|----------|------|----------|
| `CLAUDE.md` (root) | Project AI Core Rules & Pre-Code Checklist | AI — loaded every session |
| `docs/README.md` | This file — documentation index | Humans |
| `docs-mcp/css/*.md` | CSS architecture per topic (tokens, mixins, cards, forms, etc.) | Humans + AI on-demand |
| `components/ln-*/README.md` | Per-component usage guide (attributes, API, HTML, events) plus architecture reference (internal state, render flow, design decisions) | Humans |

---

## CSS

**Foundation** (tokens, config, mixins — consumed by every component)

| Topic | Source | Docs |
|-------|--------|------|
| Design Tokens | `theme/config/_tokens.scss` | [tokens.md](../docs-mcp/css/tokens.md) |
| Breakpoints | `theme/config/_breakpoints.scss` | [breakpoints.md](../docs-mcp/css/breakpoints.md) |
| Typography | `theme/config/mixins/_typography.scss` | [typography.md](../docs-mcp/css/typography.md) |
| Theming (Dark Mode) | `theme/config/_theme.scss` | [theming.md](../docs-mcp/css/theming.md) |
| Density | `theme/config/_density.scss` | [density.md](../docs-mcp/css/density.md) |
| Motion | `theme/config/mixins/_motion.scss` | [motion.md](../docs-mcp/css/motion.md) |
| Layout | `theme/config/mixins/_layout.scss` | [layout.md](../docs-mcp/css/layout.md) |
| Mixins Reference | `theme/config/mixins/` | [mixins.md](../docs-mcp/css/mixins.md) |
| Icons (CSS) | `theme/config/_icons.scss` | [../components/ln-icon/README.md](../components/ln-icon/README.md) |
| Container Queries | — | [ln-ashlar-container-queries.md](ln-ashlar-container-queries.md) |

**Components** (alphabetical)

| Topic | Source | Docs |
|-------|--------|------|
| Alert | `theme/components/_alert.scss` | [alert.md](../docs-mcp/css/alert.md) |
| Avatar | `theme/components/_avatar.scss` | [avatar.md](../docs-mcp/css/avatar.md) |
| Breadcrumbs | `theme/components/_breadcrumbs.scss` | [breadcrumbs.md](../docs-mcp/css/breadcrumbs.md) |
| Cards | `theme/components/_card.scss` | [cards.md](../docs-mcp/css/cards.md) |
| Chip | `theme/components/_chip.scss` | [chip.md](../docs-mcp/css/chip.md) |
| Empty State | `theme/components/_empty-state.scss` | [empty-state.md](../docs-mcp/css/empty-state.md) |
| Forms | `theme/components/_form.scss` | [forms.md](../docs-mcp/css/forms.md) |
| Kbd | `theme/config/mixins/_kbd.scss` | [kbd.md](../docs-mcp/css/kbd.md) |
| Loader | `theme/components/_loader.scss` | [loader.md](../docs-mcp/css/loader.md) |
| Navigation | `theme/components/_nav.scss` | [navigation.md](../docs-mcp/css/navigation.md) |
| Page Header | `theme/components/_page-header.scss` | [page-header.md](../docs-mcp/css/page-header.md) |
| Prose | `theme/components/_prose.scss` | [prose.md](../docs-mcp/css/prose.md) |
| Sections | `theme/components/_sections.scss` | [sections.md](../docs-mcp/css/sections.md) |
| Stat Card | `theme/components/_stat-card.scss` | [stat-card.md](../docs-mcp/css/stat-card.md) |
| Status Badge | `theme/components/_status-badge.scss` | [status-badge.md](../docs-mcp/css/status-badge.md) |
| Stepper | `theme/components/_stepper.scss` | [stepper.md](../docs-mcp/css/stepper.md) |
| Tables | `theme/components/_table.scss` | [tables.md](../docs-mcp/css/tables.md) |
| Timeline | `theme/components/_timeline.scss` | [timeline.md](../docs-mcp/css/timeline.md) |
| Tooltip | `theme/components/_tooltip.scss` | [tooltip.md](../docs-mcp/css/tooltip.md) |
| Pills & Switches | `theme/components/_form.scss` | [toggles-and-pills.md](../docs-mcp/css/toggles-and-pills.md) |

---

## JS Components

Each component ships one file — usage guide plus architecture reference
(internal state, render flow, design decisions) in the same document:

| Component | Attribute | README |
|-----------|-----------|--------|
| Core helpers | — | [components/ln-core/README.md](../components/ln-core/README.md) |
| Icons | (auto-init) | [components/ln-icon/README.md](../components/ln-icon/README.md) |
| Toggle | `data-ln-toggle` | [components/ln-toggle/README.md](../components/ln-toggle/README.md) |
| Accordion | `data-ln-accordion` | [components/ln-accordion/README.md](../components/ln-accordion/README.md) |
| Modal | `data-ln-modal` | [components/ln-modal/README.md](../components/ln-modal/README.md) |
| Tabs | `data-ln-tabs` | [components/ln-tabs/README.md](../components/ln-tabs/README.md) |
| Toast | `data-ln-toast` | [components/ln-toast/README.md](../components/ln-toast/README.md) |
| Dropdown | `data-ln-dropdown` | [components/ln-dropdown/README.md](../components/ln-dropdown/README.md) |
| Popover | `data-ln-popover` | [components/ln-popover/README.md](../components/ln-popover/README.md) |
| Tooltip (JS) | `data-ln-tooltip-enhance` | [components/ln-tooltip/README.md](../components/ln-tooltip/README.md) |
| Nav | `data-ln-nav` | [components/ln-nav/README.md](../components/ln-nav/README.md) |
| Filter | `data-ln-filter` | [components/ln-filter/README.md](../components/ln-filter/README.md) |
| Search | `data-ln-search` | [components/ln-search/README.md](../components/ln-search/README.md) |
| Table | `data-ln-table` | [components/ln-table/README.md](../components/ln-table/README.md) |
| Sort | `data-ln-sort` | [components/ln-sort/README.md](../components/ln-sort/README.md) |
| Sortable | `data-ln-sortable` | [components/ln-sortable/README.md](../components/ln-sortable/README.md) |
| Progress | `data-ln-progress` | [components/ln-progress/README.md](../components/ln-progress/README.md) |
| Circular Progress | `data-ln-circular-progress` | [components/ln-circular-progress/README.md](../components/ln-circular-progress/README.md) |
| Link | `data-ln-link` | [components/ln-link/README.md](../components/ln-link/README.md) |
| Confirm | `data-ln-confirm` | [components/ln-confirm/README.md](../components/ln-confirm/README.md) |
| Debug | `data-ln-debug` | [components/ln-debug/README.md](../components/ln-debug/README.md) |
| Upload | `data-ln-upload` | [components/ln-upload/README.md](../components/ln-upload/README.md) |
| AJAX | `data-ln-ajax` | [components/ln-ajax/README.md](../components/ln-ajax/README.md) |
| Router | `data-ln-route` | [components/ln-router/README.md](../components/ln-router/README.md) |
| HTTP | — | [components/ln-http/README.md](../components/ln-http/README.md) |
| Store | `data-ln-data-store` | [components/ln-data-store/README.md](../components/ln-data-store/README.md) |
| Form | `data-ln-form` | [components/ln-form/README.md](../components/ln-form/README.md) |
| Validate | `data-ln-validate` | [components/ln-validate/README.md](../components/ln-validate/README.md) |
| Time | `data-ln-time` | [components/ln-time/README.md](../components/ln-time/README.md) |
| Autosave | `data-ln-autosave` | [components/ln-autosave/README.md](../components/ln-autosave/README.md) |
| Autoresize | `data-ln-autoresize` | [components/ln-autoresize/README.md](../components/ln-autoresize/README.md) |
| Translations | `data-ln-translations` | [components/ln-translations/README.md](../components/ln-translations/README.md) |
| External Links | (automatic) | [components/ln-external-links/README.md](../components/ln-external-links/README.md) |

---

## Architecture References

| Topic | File |
|-------|------|
| Master Architect Overview | [architecture/overview.md](architecture/overview.md) |
| Component Coding Standards (Two-Tier Model) | [architecture/component-coding-standards.md](architecture/component-coding-standards.md) |
| JS Component Patterns | [architecture/component-guide.md](architecture/component-guide.md) |
| Reactive Architecture | [reactive.md](reactive.md) |
| Container Queries | [ln-ashlar-container-queries.md](ln-ashlar-container-queries.md) |
| Core Component & Styling Specs | [architecture/reference.md](architecture/reference.md) |
| Security Architecture & Best Practices | [architecture/security.md](architecture/security.md) |
| Dev Diagnostics & DOM Linter | [architecture/diagnostics.md](architecture/diagnostics.md) |


