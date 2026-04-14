# TODO — ln-acme Next Steps

## Skills Rewrite (from SESSION-HANDOFF.md)

- [x] UX skill rewrite — `ux/SKILL.md` (principles, keyup validation, shortened motion)
- [x] UX companion — `ux/interaction-patterns.md` (search, sort, filter, bulk actions, keyboard nav)
- [x] Architecture skill — add cross-reference in § 5 pointing to `data-layer.md`
- [x] JS skill — fix cross-references, add ln-store/ln-data-table integration patterns
- [ ] CSS skill — remove motion duplication, add reference to ln-acme tokens
- [ ] HTML skill — fix cross-references (`SKILL-CSS.md` → correct path)

## Data Layer — Unix Timestamps

Decision: all API timestamps are Unix epoch (seconds), formatted client-side per user timezone.

- [x] **ln-time component** — ln-acme JS component for `<time>` elements
- [ ] **Laravel side** — API resources return Unix timestamps (`$model->updated_at->timestamp`)
- [x] **data-layer.md** — all ISO timestamps converted to Unix epoch across specs
- [x] **COMPONENTS.md** — "Zero Display Text in JS" rule added

## ln-acme Implementation (from SESSION-HANDOFF.md)

- [x] Build `ln-store.js` — IndexedDB data layer (plan: `plans/ln-store.md`, spec: `docs/js/ln-store.md`)
- [x] Build `ln-data-table.js` — virtual scroll table UI (plan: `plans/ln-data-table.md`, spec: `docs/js/ln-data-table.md`)
- [x] Build `ln-time.js` — timestamp formatting component

## Design System v1.1

Source: `plans/design-system-v1.1-roadmap.md`. Each phase has its own
executor-ready plan file under `plans/v1.1-phase-*`. Run in dependency
order — see roadmap § Execution Order.

### MVP (must-ship, unblocks DocuFlow polish)

- [x] **Phase 1** — Foundation tokens (breakpoints, spacing, max-widths, easings, motion-safe mixin) — `plans/v1.1-phase-1-tokens.md`
- [x] **Phase 2** — Neutral color scale + semantic remap — `plans/v1.1-phase-2-neutral-scale.md`
- [x] **Phase 4** — Cool-tinted shadows + three-layer focus halo — `plans/v1.1-phase-4-shadows-focus.md`
- [x] **Phase 5** — Motion-safe retrofit (wraps every animation) — `plans/v1.1-phase-5-motion-safe.md`

### Full v1.1

- [x] **Phase 3** — Typography re-hierarchy (role tokens, `typography($role)` mixin) — `plans/v1.1-phase-3-typography.md`
- [x] **Phase 6** — Full dark mode (`[data-theme]` + `prefers-color-scheme`) — `plans/v1.1-phase-6-dark-mode.md`
- [x] **Phase 7a** — Empty-state component (skeleton deferred — SSR renders with data) — `plans/v1.1-phase-7a-loading-components.md`
- [x] **Phase 7b** — Navigation components (page-header, stepper, timeline) — `plans/v1.1-phase-7b-navigation-components.md`
- [x] **Phase 7c** — Content components (stat-card, prose, kbd) — `plans/v1.1-phase-7c-content-components.md`
- [x] **Phase 7d** — Interaction components (tooltip CSS, toggle-switch, chip, filter-toolbar) — `plans/v1.1-phase-7d-interaction-components.md`

### v1.2 candidates (defer if time-boxed)

- [ ] **Skeleton** — loader placeholder mixins + `[data-ln-skeleton]` component (deferred from Phase 7a — not needed for SSR consumers, revive when first SPA consumer lands) — spec in `plans/v1.1-phase-7a-loading-components.md` Steps 2-3
- [ ] **Phase 8** — JS components (ln-tooltip, ln-popover, ln-copy, ln-shortcuts) — `plans/v1.1-phase-8-js-components.md`
- [ ] **Phase 9** — Density system (`[data-density="compact"]`) — `plans/v1.1-phase-9-density.md`
- [ ] **Phase 10** — Infrastructure (auto-token-docs, Playwright VR, CHANGELOG, migration guide) — `plans/v1.1-phase-10-infrastructure.md`
