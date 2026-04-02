# Skills & Components Roadmap

Tracking file for skill improvements and component specs.
Discussion happens in main chat, execution in separate chats.

---

## 1. Architecture Skill Restructure
- [x] Move Laravel-specific content to laravel/ skill — PROMPT SENT
- [ ] Review result, iterate if needed

## 2. UI Skill — Component Specs
- [x] Review existing: ui/SKILL.md — synced §4 layout, §6 component table, §10 checklists, §11 anti-patterns with new specs
- [x] Review existing: ui/components/data-table.md (470 lines)
- [x] Create: ui/components/form.md — DONE (ln-validate + ln-form, validation, fill, submit)
- [x] Create: ui/components/modal.md — DONE (sizes, modal vs page, behavior, confirmation pattern)
- [x] Create: ui/components/tabs.md — DONE (URL hash sync, multiple groups, badge counts, tabs vs sections)
- [x] Create: ui/components/search.md — DONE (ln-search client-side, server-side → form auto-submit)
- [x] Create: ui/components/status-badge.md — DONE (5 categories, actionable variant via ln-confirm/ln-dropdown)
- [x] Create: ui/components/empty-state.md — DONE (two types: no data vs filter zero)
- [x] Create: ui/components/loading-state.md — DONE (button spinner + shimmer)

## 2c. Status Badge — Actionable Variant
- [ ] Design: inline status change via badge button (2 statuses → ln-confirm toggle, 3+ → ln-dropdown)
- [ ] Implementation: badge CSS on `<button>` + ln-confirm / ln-dropdown integration

## 2b. Form Implementation (from form.md spec)
- [ ] Check: does ln-validate exist? If not, create
- [ ] Check: does ln-form exist? If not, create
- [ ] Check: existing form SCSS — does it support reserved error space?
- [ ] Check: existing ln-autosave — confirm independence from ln-form
- [ ] TODO (future): custom validation mechanism (password match, async checks)

## 3. UX Skill — Review & Improve
- [x] Review existing: ux/SKILL.md — synced form anti-patterns (submit disabled, not validate-on-submit)
- [x] Review existing: interaction-patterns.md — fixed search (instant keyup, / shortcut), shimmer not skeleton, inline editing marked Future
- [x] Sync with UI component specs — form §6 and modal §7 reference specs, no duplication

## 4. Data Table — Full Implementation
- [x] Review ln-data-table.js — quality check + spec alignment
- [x] Fix prompt sent: inline styles, var/let, BEM classes, Ctrl+K→/, search spec, template scoping
- [ ] Feature: column resize (drag border, double-click auto-fit, persist widths)
- [ ] Feature: footer selection count + bulk actions
- [ ] Feature: sticky first column(s)
- [ ] Create docs/js/ln-data-table.md (architecture reference)
- [ ] Create/update demo/admin/datatable.html

## 5. ln-store — Full Implementation
- [x] Review ln-store.js (948 lines) — quality check done
- [ ] Fix: var → const/let, guardBody, synced event, visibility staleness check, event cleanup in destroy(), Infinity staleness option
- [ ] Create docs/js/ln-store.md (architecture reference)
- [ ] Sync architecture/data-layer.md with actual ln-store implementation
- [ ] TODO (future): ln-http integration — ln-store uses raw fetch. If global HTTP layer needed (shared headers, auth refresh, interceptors), extract shared fetch wrapper. Not needed now but if mysterious HTTP failures appear, this is why.

## 6. Discussions Pending (separate chats)
- [ ] Rendering boundary — Blade SSR vs JS dynamic, exact rules
- [x] Coordinator pattern — DONE (architecture/coordinator-pattern.md) — two types: library (ln-accordion, ln-form) + project (ln-mixer pattern)
- [x] State ownership hierarchy — DONE (architecture/state-ownership.md) — external vs internal vs persistent
