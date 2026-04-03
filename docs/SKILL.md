# ln-acme Skill — Claude Code Reference

Quick reference for AI assistants working with the ln-acme library. For full details, see individual docs in `docs/js/` and `docs/css/`.

---

## What is ln-acme?

Unified frontend library: **SCSS CSS framework** + **vanilla JS components**. Zero dependencies. Used in Laravel projects via npm or git submodule.

## Core Principles

1. **Semantic HTML** — HTML describes WHAT, CSS describes HOW. No presentational classes in HTML.
2. **Two-layer CSS** — Mixins (recipes in `scss/config/mixins/`) + Components (applied to selectors in `scss/components/`).
3. **Attribute-driven JS** — `data-ln-*` attribute is the single source of truth. API methods set the attribute, MutationObserver reacts.
4. **Zero hardcoded colors** — Every color reads from `var(--token)`. Color change = `--color-primary` override.
5. **CustomEvent communication** — Components don't know about each other. Communication only via events.

## JS Component Pattern

Every component follows the same IIFE structure:

```
data-ln-{name} attribute → MutationObserver detects → _component instance created
API methods → setAttribute → MutationObserver → state sync + events dispatched
```

### Key imports from ln-core

| Function | Use |
|----------|-----|
| `dispatch(el, name, detail)` | Non-cancelable event |
| `dispatchCancelable(el, name, detail)` | Cancelable before-event |
| `findElements(root, sel, attr, Cls)` | Auto-init elements |
| `guardBody(fn, tag)` | Defer until `<body>` exists |
| `fill(root, data)` | Declarative DOM binding |
| `renderList(container, items, tpl, keyFn, fillFn)` | Keyed list rendering |
| `reactiveState(initial, onChange)` | Shallow Proxy |
| `deepReactive(obj, onChange)` | Deep Proxy |
| `createBatcher(renderFn)` | Microtask coalescing |

### Event naming

| Type | Format | Example |
|------|--------|---------|
| Lifecycle before | `ln-{name}:before-{action}` | `ln-toggle:before-open` (cancelable) |
| Lifecycle after | `ln-{name}:{action}` | `ln-toggle:open` |
| Request (command) | `ln-{name}:request-{action}` | `ln-profile:request-create` |
| Notification (fact) | `ln-{name}:{past-tense}` | `ln-profile:created` |

### Three-layer architecture (project integration)

```
Coordinator  — catches UI clicks, dispatches request events, shows toast/modal
Component    — manages state, CRUD, own DOM, request listeners, notifications
ln-acme      — library primitives (toggle, modal, toast, tabs, etc.)
```

## JS Components Quick Reference

| Component | Attribute | Events | Docs |
|-----------|-----------|--------|------|
| Core | — | — | [core.md](js/core.md) |
| Toggle | `data-ln-toggle` | `before-open`, `open`, `before-close`, `close` | [toggle.md](js/toggle.md) |
| Accordion | `data-ln-accordion` | `change` | [accordion.md](js/accordion.md) |
| Modal | `data-ln-modal` | `before-open`, `open`, `before-close`, `close` | [modal.md](js/modal.md) |
| Tabs | `data-ln-tabs` | `change` | [tabs.md](js/tabs.md) |
| Toast | `data-ln-toast` | — (enqueue via API/event) | [toast.md](js/toast.md) |
| Dropdown | `data-ln-dropdown` | `open`, `close` | [dropdown.md](js/dropdown.md) |
| Nav | `data-ln-nav` | — | [nav.md](js/nav.md) |
| Progress | `data-ln-progress` | `change` | [progress.md](js/progress.md) |
| Circular Progress | `data-ln-circular-progress` | `change` | [circular-progress.md](js/circular-progress.md) |
| Filter | `data-ln-filter` | `changed`, `reset` | [filter.md](js/filter.md) |
| Search | `data-ln-search` | `change` (cancelable) | [search.md](js/search.md) |
| Table | `data-ln-table` | `ready`, `filter`, `sorted`, `empty` | [table.md](js/table.md) |
| Table Sort | `data-ln-sort` | `ln-table:sort` | [table-sort.md](js/table-sort.md) |
| Sortable | `data-ln-sortable` | `before-drag`, `drag-start`, `reordered`, `enabled`, `disabled` | [sortable.md](js/sortable.md) |
| Link | `data-ln-link` | `navigate` (cancelable) | [link.md](js/link.md) |
| Confirm | `data-ln-confirm` | `waiting` | [confirm.md](js/confirm.md) |
| Upload | `data-ln-upload` | `uploaded`, `removed`, `error`, `invalid`, `cleared` | [upload.md](js/upload.md) |
| AJAX | `data-ln-ajax` | `before-start`, `start`, `success`, `error`, `complete` | [ajax.md](js/ajax.md) |
| HTTP | — | `ln-http:success`, `ln-http:error` | [http.md](js/http.md) |
| Select | `data-ln-select` | — (Tom Select wrapper) | [select.md](js/select.md) |
| Autosave | `data-ln-autosave` | `saved`, `before-restore`, `restored`, `cleared` | [autosave.md](js/autosave.md) |
| Autoresize | `data-ln-autoresize` | — | [autoresize.md](js/autoresize.md) |
| Translations | `data-ln-translations` | `before-add`, `added`, `before-remove`, `removed` | [translations.md](js/translations.md) |
| External Links | (automatic) | `processed`, `clicked` | [external-links.md](js/external-links.md) |
| Store | `data-ln-store` | `ln-store:change` | [store.md](js/store.md) |
| Form | `data-ln-form` | `ln-form:submit`, `ln-form:error` | [form.md](js/form.md) |
| Validate | `data-ln-validate` | `ln-validate:valid`, `ln-validate:invalid` | [validate.md](js/validate.md) |
| Time | `data-ln-time` | — | [time.md](js/time.md) |
| Data Table | `data-ln-data-table` | `ln-data-table:load`, `ln-data-table:sort`, `ln-data-table:page` | [data-table.md](js/data-table.md) |
| Icons | (auto-init) | — | [icons.md](js/icons.md) |

## CSS Architecture Quick Reference

### Tokens → Mixins → Components

```
scss/config/_tokens.scss     → :root CSS variables (--color-primary, --spacing-md, etc.)
scss/config/mixins/_*.scss   → @mixin recipes (btn, card, table-base, form-input, etc.)
scss/components/_*.scss      → Applied to default selectors (button, table, .ln-modal, etc.)
```

### Key patterns

- **Button colors**: every `<button>` gets states via `@include btn-colors` globally. Change color: `--color-primary` override.
- **Modal**: `<form>` is content root. Select via `.ln-modal > form`. Sizes: `@include modal-sm/md/lg/xl`.
- **Forms**: CSS Grid (`@include form-grid`) + `<div class="form-element">` + explicit `<label for="x">` / `<input id="x">`. Use `<div>` not `<p>` — `<ul data-ln-validate-errors>` inside `<p>` is invalid HTML.
- **Icons**: SVG sprite injected at init. Use `<svg class="ln-icon" aria-hidden="true"><use href="#ln-{name}"></use></svg>`. Sizes: `ln-icon--sm/lg/xl`. IDs: `#ln-home`, `#ln-x`, `#ln-trash`, etc. (Tabler names — full list: `scss/tabler-icons.txt`) See `js/ln-icons/README.md`.
- **Container queries**: `@include container(name)` on parent, `@container name (min-width: ...)` on child. Never on same element. Never combine with `overflow: hidden`.

### Override strategy

1. Use the default — do nothing
2. Color change — `--color-primary` override on element/parent
3. Structure tweak — re-apply mixin with modifications
4. Full replace — use only the mixin, skip the component

## File Structure

```
scss/
├── config/
│   ├── _tokens.scss          ← :root CSS variables
│   ├── _mixins.scss          ← @forward index
│   └── mixins/_*.scss        ← Individual mixin files
├── base/                     ← Reset, global defaults
├── components/               ← Applied mixins → CSS output
└── utilities/                ← Helper classes

js/
├── index.js                  ← Barrel import
├── ln-core/                  ← Shared helpers + reactive primitives
└── ln-{name}/                ← Component IIFE + optional co-located SCSS

docs/
├── README.md                 ← Documentation index (human)
├── SKILL.md                  ← This file (AI cheatsheet)
├── css/*.md                  ← CSS architecture docs
└── js/*.md                   ← JS architecture docs (internal, render flow)

js/ln-{name}/README.md        ← Per-component usage guide (human — attributes, API, HTML)
```

## Build

```bash
npm run build    # dist/ln-acme.css + .js + .iife.js
npm run dev      # Watch mode
```
