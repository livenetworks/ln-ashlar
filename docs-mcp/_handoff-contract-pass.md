# Handoff — docs-mcp Contract-Compliance Pass (2026-07-21)

> For a teammate continuing in a new session. This file is self-contained — you do not
> need prior conversation history. The underscore prefix means that the MCP indexer
> does NOT read this file (it is not part of the corpus), but git tracks it.

---

## 1. Goal of the Task

`validate_docs` (ln-ashlar MCP, "Live Networks" connector) reported **14 component docs**
failing the parser contract. The task: fix contract violations WITHOUT touching source
`js/` and `demo/` files — only `docs-mcp/`.

The contract is defined in `docs-mcp/README.md` + `docs-mcp/_templates/*.md`.

---

## 2. KEY: Where the Validator Lives

The parser/validator logic (`validate_docs`) is **NOT in this repository** — it lives
in the **MCP server package** (`/home/mcp/server`). In the workspace tree there is NO
`tools/ashlar/lint-cli.js` nor `npm run lint:docs` (verified via grep; only `scripts/build.mjs`
and `scripts/consolidate-admin-demos.mjs` exist).

Consequences:
- **Local re-verification = grep only.** There is no runnable local linter.
- **Full re-verification = `validate_docs`**, which reads from the server copy
  `/home/mcp/server/resources/ln-ashlar` — reflecting changes only after the server
  **re-pulls** (after git push), not from the working directory.
- Any change to parser **BEHAVIOR** must be applied by the user on the server; the repository
  only modifies docs, `_templates/`, and `README.md`.

---

## 3. What Was Fixed and Pushed to Git

Both commits are already on `origin/main`:

### `c57f685` — Contract-compliance pass + none-declaration convention (12 files)
- `docs-mcp/README.md` — new "none-declaration" rule in §Normative Tables
- `docs-mcp/_templates/component.md` — none-sentence fallback comments under §3
- `docs-mcp/_parser-none-declaration-spec.md` — **spec for server parser change** (see §5)
- `docs-mcp/components/ln-ajax.md` — added `Default` column
- `docs-mcp/components/ln-link.md` — added `Default` column
- `docs-mcp/components/ln-validate.md` — split combined Direction row (Emits + Listens)
- `docs-mcp/components/ln-table.md` — §2 Variant heading + normative Events table (18 rows) + `### Configuration Attributes` → `### Attributes Table` (+ `Type` → `Type / Values`)
- `docs-mcp/components/ln-modal-fill.md` — none-sentence for attributes
- `docs-mcp/components/ln-autoresize.md` — none-sentence for events
- `docs-mcp/components/ln-time.md` — none-sentence for events
- `docs-mcp/components/ln-slug.md` — none-sentence for events
- `docs-mcp/components/ln-filter.md` — genuine Attributes + Events tables (from source) + `[!NOTE]` for `data-ln-filter-hide` (state marker, not config)

### `cf01dcd` — Service-docs fold (2 files)
- `docs-mcp/components/ln-http.md` — §3 Events API restructured into normative table (`ln-http:request`=Listens, `response`/`error`=Emits); `detail` fields formatted as a bullet list (deliberately NOT a second table)
- `docs-mcp/components/positioning.md` — §2/§3 renamed to prescribed headings (service retains JS-usage block + functions table; exempt from html-block rule)

---

## 4. Status Across the Original 14 Docs (10 Fixed, 4 Remaining)

| File | Status After Push |
|---|---|
| ln-ajax, ln-link, ln-validate, ln-table, ln-http, positioning | ✅ GREEN as soon as server re-pulls (tabular, compliant) |
| ln-modal-fill, ln-autoresize, ln-time, ln-slug | 🟡 RED until server receives **Rule 1** (they hold sentences, not tables) — EXPECTED, not a regression |
| **ln-api-queue, ln-autosave, ln-data-store, ln-toggle** | ⛔ UNTOUCHED — **§4 group, DECISION BELONGS TO USER** (see §6) |

(`ln-filter` was not in the 14, but received real tables as part of the convention.)

---

## 5. None-Declaration Convention + PENDING Server Parser Change

**Convention (already applied in docs):** In `simple`/`coordinator` docs, §3 ALWAYS contains
BOTH `### Attributes Table` and `### Events API`; an empty section holds an explicit sentence
instead of being omitted:
- Attributes: `This component reads no data-ln-* configuration attributes.`
- Events: `This component emits and listens to no custom ln-* events.`
  (The combined AND sentence is exhaustive — any event in either direction gets a row in the
  table via the `Direction` column, so a none-sentence strictly means zero events. There is no
  asymmetric case.)

**Server Spec:** `docs-mcp/_parser-none-declaration-spec.md` (on git):
- **Rule 1 (relaxation):** Under `### Attributes Table`/`### Events API`, if there is no pipe
  table → accept non-empty prose (none-declaration); empty body → error.
- **Rule 2 (enforcement):** For simple/coordinator, §3 must contain BOTH sub-headings; `service`
  is exempt.
- **Order:** Apply the documentation sweep (already on git) BEFORE enabling Rule 2, otherwise
  those docs fail validation.

⚠️ **Until the user applies Rule 1+2 on the server and re-pulls, the 4 none-sentence docs
REMAIN RED. This is expected.**

---

## 6. What Remains (Next Steps)

### (A) §4 Group — Remaining Repository Work, USER DECISION
`ln-toggle`, `ln-autosave`, `ln-data-store`, `ln-api-queue` have a legitimate
`## 4. State & Persistence` → resulting in 8 numbered sections. The template allows an optional
§4, but the validator was enforcing EXACTLY 7. A genuine template↔validator contradiction.
Two options:
- **(a) Conform docs** — Demote §4 to a `###` sub-section, renumber 5-8→4-7 (repo-only, immediate).
- **(b) Relax validator** — Allow optional §4 (7-or-8 skeleton) + sync template (touches server parser).

💡 **Synergy:** If the user is modifying the parser for Rule 1+2 anyway, option (b) is almost
free in the SAME server session. DO NOT DECIDE ALONE — this is an architectural user decision.

✅ **RESOLVED 2026-07-22 — User selected (b):** §4 is legitimate, docs remain as they are.
Rule 3 (optional §4, 7-or-8 skeleton) was added to `_parser-none-declaration-spec.md`. No remaining
repo work — the rest is server-side (§6 B: Rule 1+2+3, followed by re-pull + re-verification §6 C).

### (B) Server Parser Change (User Side)
Apply Rule 1 + Rule 2 (+ optional §4 Rule 3) on the MCP server, redeploy/re-pull.

### (C) Re-verification
After re-pull, run `validate_docs` again → confirm that the 10 fixed docs turned green and
inspect any actual remaining failures. (Note: The "Live Networks" connector was intermittently
disconnected — it must be active to work.)

---

## 7. Next Session Discipline (Mandatory)

- **Git-push scope:** "Push to git" = explicit list of files FROM THE SESSION. The workspace has
  many pre-existing dirty files that are not ours (`_temp/**`, `docs/**`, `plans/**`, root
  `README.md`, `ln-fill.md`) — DO NOT stage them. Always use `git add <path>` explicitly, never
  `git add -A`. Verify with `git show --name-only`.
- **Source is truth:** Defaults/events/attributes are read directly from `components/ln-*/src`,
  never guessed. Do not touch `js/` and `demo/`.
- **Timeless docs:** Avoid "future/planned/previously" phrases.
- **Plan files** (`.claude/plans/*.md`) are **gitignored** (submodule) → NOT shared via git.
  All required specification is in this handoff + `_parser-none-declaration-spec.md`.

---

## 8. Git Status of this Handoff

This file (`docs-mcp/_handoff-contract-pass.md`) was created during the handoff session.
If needed by teammates via `git pull`, commit and push following the scope discipline in §7.
