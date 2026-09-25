# П2 — remove the `ln-{component}:destroyed` event

**Ruling (2026-09-12):** the `:destroyed` lifecycle event is abolished. It is removed from every
component that emits it and is not added to any component that lacks it.

**Why:** 0 listeners anywhere (library, demos, tests; re-verified 2026-09-26 by grep for
`addEventListener('ln-*:destroyed'`). The contract is inverted: the event reaches listeners only on
paths where the listener already knows teardown is happening (router subtree swap, attribute removal,
manual `destroy()`). It stays silent on the one path a destroyed-event exists for: `helpers.js`
`removedNodes` (`components/ln-core/helpers.js:974`) fires `destroy()` only when the node is already
detached (`!document.contains(item)`), so a bubbling event never
reaches a document listener. It also sits on the edge of `DOCTRINE.md:120` ("A destroyed component
MUST NOT … dispatch … CustomEvents").

**Measured state (2026-09-26):** 28 dispatch calls in 26 components. The three components added after
the ruling (`ln-obfuscator`, `ln-picklist`, `ln-scroll`) emit it too, so the drift is growing.

---

## A. Code: delete the dispatch line, nothing else

Delete exactly the `dispatch(…, 'ln-X:destroyed', …)` statement. Nothing else in `destroy()` changes:
no reordering and no cleanup additions (П3 is a separate pass).

| File | Line(s) |
|---|---|
| `components/ln-accordion/src/ln-accordion.js` | 39 |
| `components/ln-api-connector/src/ln-api-connector.js` | 442 |
| `components/ln-api-queue/src/ln-api-queue.js` | 333 |
| `components/ln-autosave/src/ln-autosave.js` | 146 |
| `components/ln-confirm/src/ln-confirm.js` | 173 |
| `components/ln-couchdb-connector/src/ln-couchdb-connector.js` | 386 |
| `components/ln-data-store/src/ln-data-store.js` | 912 |
| `components/ln-date/src/ln-date.js` | 452 (text-element early-return branch), 477 |
| `components/ln-dropdown/src/ln-dropdown.js` | 286 |
| `components/ln-editor/src/ln-editor.js` | 381 |
| `components/ln-form/src/ln-form.js` | 99 |
| `components/ln-key/src/ln-key.js` | 140, 179 |
| `components/ln-modal/src/ln-modal.js` | 102 |
| `components/ln-nav/src/ln-nav.js` | 109 |
| `components/ln-number/src/ln-number.js` | 390 |
| `components/ln-obfuscator/src/ln-obfuscator.js` | 145 |
| `components/ln-picklist/src/ln-picklist.js` | 72 |
| `components/ln-popover/src/ln-popover.js` | 247 (multi-line call) |
| `components/ln-scroll/src/ln-scroll.js` | 143 |
| `components/ln-sortable/src/ln-sortable.js` | 43 |
| `components/ln-tabs/src/ln-tabs.js` | 189 |
| `components/ln-toast/src/ln-toast.js` | 80 |
| `components/ln-toggle/src/ln-toggle.js` | 121 |
| `components/ln-tooltip/src/ln-tooltip.js` | 205 |
| `components/ln-upload/src/ln-upload.js` | 644 |
| `components/ln-validate/src/ln-validate.js` | 194 |

**Unused imports:** in `ln-form`, `ln-toast` and `ln-tooltip`, `dispatch` is used only for
`:destroyed`. Remove `dispatch` from their `../../ln-core` import lists.

**Not touched:** the private `_destroyed` boolean flags in `ln-data-coordinator`, `ln-filter`,
`ln-include`, `ln-sort`, `ln-search` and `ln-picklist`. These are async guards required by the
DOCTRINE "Destroyed Component Invariant". They are not the event. `ln-picklist:69`
`this._destroyed = true` stays because it is read at `:134`.

## B. Descriptive docs, swept in the same pass as the code

A descriptive doc changes together with the code, never before it.

**`components/*/README.md` (22 files).** Delete each `:destroyed` table row or `###` sub-section. In
prose that describes `destroy()`, delete only the "dispatches `ln-X:destroyed`" clause and leave the
rest of the sentence intact:
accordion 172/180 · api-queue 109 · autosave 127 · data-store 196 · date 102 · dropdown 77 (drop the
"(except `:destroyed` …)" parenthetical)/83 · editor 139/273 · form 91 · key 114 · modal 106/189 ·
nav 84/114 · number 57 · obfuscator 45 · picklist 165-167 · popover 164 · scroll 46 · sortable 93-95 ·
tabs 103/224 · toggle 190 · tooltip 64 (rewrite as "dispatches no events")/95 · upload 104/134 ·
validate 110/175.
`ln-progress/README.md:97` ("There is no `:initialized` and no `:destroyed` event") is still true and
is left alone.

**`docs-mcp/components/*.md` (25 files).** Delete the Events-table row in: accordion, api-connector,
api-queue, autosave, couchdb-connector, data-store, date, dropdown, editor, form, key, modal, nav,
number, obfuscator, picklist, popover, scroll, sortable, tabs, toast, toggle, tooltip, upload and
validate. Also delete the "dispatches `ln-X:destroyed`" clause from the `destroy()` API-table
description in accordion:158, date:138, tabs:123 and toast:125.
`ln-tooltip.md` is left with an empty Events table. Replace it with the canonical none-declaration
(`docs-mcp/README.md:121-124`): `This component emits and listens to no custom ln-* events.`
`ln-form.md` keeps its `ln-fill` Listens row. `ln-toast.md` keeps its `enqueue`/`clear` rows.

**`demo/admin/src/pages/*.html` (10 files).** Delete the event-table rows and the code-comment
mentions: accordion 325 (rewrite "one per panel-open and one on destroy" to "one per panel-open")/331/352 ·
autosave 159/184 · dropdown 126 · editor 372 · modal 341 · store 156 · tabs 374 · toggle 78/116 ·
upload 359 (whole `<tr>`) · validate 267/301.

## C. Prescriptive docs

- `docs/architecture/component-refactoring-blueprint.md:61`: this line still prescribes "Emit
  `ln-{component}:destroyed`". Delete that clause.
- `docs-mcp/_templates/component.md:75`: delete `:destroyed` from the lifecycle-event examples in the
  comment.
- **DECISION D1 (user):** the ruling currently has no home in the repo. It lived in
  `.claude/plans/audit/_doctrine.md`, which left with the `.claude` submodule (`1d1106cc`). Proposal:
  add one bullet under the Destroyed Component Invariant in `DOCTRINE.md` (after line 120): "No
  `:destroyed` lifecycle event. A teardown signal, if one is ever needed, is published by whoever tears
  down (router/coordinator), never by the dying component." Without it, the next new component
  reintroduces the event, as obfuscator, picklist and scroll already did.

## D. Generated artifacts

`npm run build` regenerates:
- `docs-mcp/schemas/ln-ashlar-events-by-component.json` and `…-events-index.json` (`sync:ln-events`,
  26 `:destroyed` event keys in each today)
- the tracked compiled bundles `components/ln-*/ln-*.js`, `dist/` and `demo/dist/`
- the compiled `demo/admin/*.html`

Deploy is pull-only, so the compiled demo pages must be committed. Stage an explicit file list, never
`git add -A`: the build dirties unrelated bundles.

## Out of scope

- `docs-mcp/_incoming/**`: gitignored (`.gitignore:13`), untracked, read by no script and not by the
  MCP server. Local-only; not part of the repo.
- П1 (state classes → attributes) and П3 (`destroy()` removes everything it made).
- Attribute schemas: no `data-ln-*` changes.

## Verification

1. `grep -rn ":destroyed'" components/*/src` → 0.
2. `grep -rIn ":destroyed" --exclude-dir={node_modules,.git,graphify-out,plans,_incoming}` → only
   `ln-progress/README.md:97`.
3. `dispatch` is no longer imported in `ln-form`, `ln-toast` or `ln-tooltip`, and every other touched
   file still uses it.
4. `npm run build` then `npm test` (includes `sync:ln-events:check` and `sync:ln-schemas:check`):
   both green.

## Release note

This is a public-API removal for external npm consumers (library is at 1.7.0). There are no internal
consumers. It belongs in the next release notes as a breaking change.
