---
name: skill-name
classification: skill
status: draft
domain: frontend
summary: One sentence — which design/process decisions the skill governs.
tags: []
---

# [emoji] Skill Title

## Summary

2-3 sentences — which decisions this skill governs and when an agent should consult it.

---

Free form. Mandatory: frontmatter, `## Summary` as the first section,
relative links only to sibling skills in the same context subfolder (`./ux.md`).

Skills are prescriptive decision rules — WHEN/WHETHER something must exist —
not implementation reference. Conventions:

- **No persona sections.** "You are a senior designer..." prompting lives in the
  MCP server's serving layer, never in the document.
- **Decision tables over prose.** Applies-when conditions and enumerated
  exceptions — "except in some situations" without the actual list is forbidden.
  Anti-pattern lists are encouraged.
- **Standalone.** Skills are library-agnostic — naming a concrete component,
  attribute, event, mixin, or source path of any library is forbidden. Rules
  must hold outside ln-ashlar. No aspirational markers — a rule is stated
  normatively or not at all.
- `domain:` is `frontend` | `backend` | `process` (absent = `frontend`).
- `context` is not frontmatter — it is the subfolder the file lives in
  (`app/` | `web/` | `wordpress/`). Contexts carry OPPOSITE rules by design
  (density, motion, decoration flip between apps and presentational sites) —
  a ban scoped to one context must say so explicitly ("never in data tools",
  not "never"); the server never mixes two contexts in one served set.
- Links: only to sibling skills in the same context subfolder (`./ux.md`);
  links to `components/`, `css/`, `patterns/`, `doctrine/`, `guides/` are
  forbidden.
</content>
