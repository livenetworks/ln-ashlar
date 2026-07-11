---
name: skill-name
classification: skill
status: draft
domain: frontend
context: app
summary: One sentence — which design/process decisions the skill governs.
source:
tags: []
---

# [emoji] Skill Title

## Summary

2-3 sentences — which decisions this skill governs and when an agent should consult it.

---

Free form. Mandatory: frontmatter, `## Summary` as the first section,
relative links to components/css/patterns/doctrine for the cross-reference graph.

Skills are prescriptive decision rules — WHEN/WHETHER something must exist —
not implementation reference. Conventions:

- **No persona sections.** "You are a senior designer..." prompting lives in the
  MCP server's serving layer, never in the document.
- **Decision tables over prose.** Applies-when conditions and enumerated
  exceptions — "except in some situations" without the actual list is forbidden.
  Anti-pattern lists are encouraged.
- **Ground every claim.** A rule that names a component, attribute, or event
  must link to the real implementation (`../components/ln-*.md`,
  `../patterns/*.md`). A rule the library cannot fulfil yet is explicitly
  marked as aspirational.
- `domain:` is `frontend` | `backend` | `process` (absent = `frontend`).
- `context:` is `app` | `web` | `wordpress` — the product type the rules target
  (absent = `app`). Contexts carry OPPOSITE rules by design (density, motion,
  decoration flip between apps and presentational sites) — so a ban scoped to
  one context must say so explicitly ("never in data tools", not "never"), and
  the server never mixes two contexts in one served set.
