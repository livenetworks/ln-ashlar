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
