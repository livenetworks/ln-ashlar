# Skills & Components Roadmap

Tracking file for skill improvements and component specs.
Discussion happens in main chat, execution in separate chats.

---

## 1. Architecture Skill Restructure (DONE)
- [x] Move Laravel-specific content to laravel/ skill
- [x] Add coordinator-pattern.md
- [x] Add state-ownership.md
- [x] Rendering boundary defined (SSR / IndexedDB / SPA)
- [x] Add rendering modes section to architecture/SKILL.md (§3b)
- [x] Fix broken reference: docs/js/ln-store.md → store.md in SKILL.md
- [x] Fix state-ownership.md "prop watcher" terminology

## 2. UI Skill — Component Specs (DONE)
- [x] ui/SKILL.md synced with all component specs
- [x] data-table.md, form.md, modal.md, tabs.md, search.md
- [x] status-badge.md, empty-state.md, loading-state.md, kpi-card.md
- [x] Fix: form.md custom validation — concrete approach (ln-validate:set-custom / clear-custom)
- [x] Fix: modal.md — mobile responsive section added
- [x] Fix: tabs.md — lazy load exception clarified

## 3. UX Skill — Review & Improve (DONE)
- [x] Synced with UI component specs, no duplication

## 4. ln-acme Documentation Refactor (DONE)
- [x] COMPONENTS.md — findElements in ln-core table + instance pattern updated
- [x] component-guide.md — trigger re-init guard + destroy() cleanup in checklist
- [x] v2-reactive.md — translate + rewrite as reference doc (pattern now in COMPONENTS.md)

## 5. ln-acme Component Refactor (DONE except new features)
- [x] Phase A — _findElements → findElements in 4 files (ln-ajax, ln-link, ln-progress, ln-table-sort)
- [x] Phase B1 — ln-store: threshold parsing, visibility staleness, synced event, listener cleanup
- [x] Phase B2 — ln-data-table: inline styles fix, template scoping (cloneTemplateScoped), ln-core export

## 6. Phase C — New Functionality (NEXT)
- [x] ln-data-table: footer selection count
- [ ] ln-data-table: sticky column — може да биде која било колона, не нужно прва (defer)
- [ ] ln-data-table: column resize (defer)
- [ ] Form: reserved error space in SCSS
- [x] Custom validation: ln-validate:set-custom / clear-custom events in ln-validate.js
- [x] Status badge actionable variant (mixin + component + demo)

## 7. JS Component Audit (DONE)
- [x] Review all js/ln-* components — 8 bugs fixed, 4 забелешки discussed and closed
- [x] ln-tabs attribute bridge refactor (prompt sent, new chat)
- [x] Reactive rendering pattern documented in COMPONENTS.md
- [x] Attribute Bridge principle documented in COMPONENTS.md

## 8. Discussions Complete
- [x] Rendering boundary — SSR / IndexedDB / SPA
- [x] Coordinator pattern — library + project coordinators
- [x] State ownership — external vs internal vs persistent

---

## 9. Visual Design Pass (IN PROGRESS)
- [x] Card accent hover — bg tint + restore border color per accent mixin
- [x] Accordion — `@mixin accordion` (contained card, chevron rotation via `:has()`)
- [x] Accordion collapse bug — padding on `> *` not `.collapsible-body` (overflow:hidden fix)
- [x] panel-header — bg-secondary + reduced padding (px 1rem, py 0.75rem)
- [x] section-card — spacing reduction (mb, main padding, footer padding) + shadow-xs base
- [x] .content shell — p(1.5rem)→p(1rem), stack gap 1.5rem→1rem
- [x] Design tokens — bg-body + bg-secondary (lighter, more blue-saturated)
- [x] card/section-card — rounded-lg→rounded-md + shadow-xs always-on
- [x] Modal footer — remove btn-sm, reduce py to 0.75rem
- [x] Modal cancel button — border at rest + bg-body on hover (fix invisible hover)
- [x] Inter font — token + antialiasing + all demo HTML files
- [x] Status badge — `&:is(button)` hover/active states in mixin

## 10. Documentation & Architecture Overview (NEXT)

### Фаза 1: Visual close-out
- [ ] Review current visual state — confirm all §9 fixes look correct
- [ ] Identify any remaining visual issues before moving to docs

### Фаза 2: Architect Overview Doc
One document for humans giving instructions — "read this first."
- [ ] Component inventory — all CSS mixins (what they are, when to use)
- [ ] Component inventory — all JS components (what they are, when to use)
- [ ] Design decisions rationale — no utility classes, mixins not classes, semantic selectors
- [ ] Override architecture — color → token, structure → mixin, full replace
- [ ] New project integration guide — what SCSS files to create, how to structure project SCSS

### Фаза 3: Existing Docs Gap Fill
- [ ] Audit `docs/css/` — accurate? complete?
- [ ] Audit `docs/js/` — accurate? complete?
- [ ] Audit `.claude/skills/` — fill gaps found in Фаза 2
