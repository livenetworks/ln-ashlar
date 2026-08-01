# docs-mcp — User Documentation Corpus for ln-ashlar

This directory is the **sole source** indexed and served by the `ln-ashlar` MCP server.
The goal: ensure all agents, developers, and library users share the exact same mindset—specifically, which attributes exist, what values they accept, which events are emitted, alongside ready-to-copy HTML markup templates.

## Architectural Overview: Dual-Core Capabilities (SSR & SPA)

All agents consuming this corpus must understand that `ln-ashlar` supports **two distinct application architectures** on the same DOM-First foundation:

1. **Server-Rendered HTML (SSR Mode):** Progressive enhancement for backend frameworks (Laravel, Go, Django, Rails) where the server delivers HTML and `ln-ashlar` auto-activates interactivity via `data-ln-*` attributes.
2. **Client-Side Single Page Applications (SPA / JSON Mode):** Pure client-side SPAs consuming REST/JSON APIs powered by `ln-router` (path routing & region swapping), `hash.js` (compound hash state & deep-linking), `ln-http`/`ln-api-connector` (async JSON API client), `lnCore.renderList`/`lnCore.fill` (client-side template binding), and `spa-starter/` (`App.defineView()` / `App.defineModule()`).

## Audience and Layers

| Layer | Location | Audience |
|---|---|---|
| Low-level (Internals) | `js/ln-*/README.md` alongside code | Core library developers |
| **User Corpus (this folder)** | `docs-mcp/` | Library users, AI agents via MCP |
| In-context skills | `.claude/skills/` (separate repo) | Claude Code sessions |

## Directory Structure

```
docs-mcp/
  README.md          ← this file (NOT indexed)
  component-router.md ← component-selection matrix (NOT indexed — served as the routing contract)
  _templates/        ← authoring templates (NOT indexed)
  components/        ← JS components, one file per component: ln-<name>.md
  css/               ← SCSS components/mixins/tokens: <name>.md
  patterns/          ← composite recipes (table+sort+filter, modal-fill CRUD...): <kebab-name>.md
  guides/            ← workflow guides (write-workflow...)
  doctrine/          ← mindset, rules, doctrines
  skills/            ← standalone design decision rules; one subfolder per product context:
    app/             ←   data-dense business applications
    web/             ←   presentational sites (opposite rules by design)
    wordpress/       ←   WordPress builds
```

The MCP indexer reads ONLY from `components/`, `css/`, `patterns/`, `guides/`, `doctrine/`, and `skills/`.
`skills/` is read **recursively** — the subfolder name is the skill's `context`; no other indexed folder has subfolders.
Files starting with `_` or named `README.md` are ignored.

### `component-router.md` — the routing contract

`component-router.md` is the one top-level file the MCP server **serves without
indexing it as a document**. Its body is injected verbatim into every MCP
session's `instructions` (the client puts it in the model's system prompt before
the first token), and it is also served on demand by the `get_component_router`
tool. Purpose: the agent picks the right component from the matrix instead of
inventing markup, then calls `get_markup` for the canonical HTML.

Consequences for authors:

- It needs **no frontmatter** — it is read raw, never parsed as a corpus doc.
- It must contain **no markup**. Selection only; HTML lives in `components/`.
- It is deliberately kept out of the index so its name never collides with the
  real `ln-router` component in `components/`.
- Keep it short. It is paid for in tokens on *every* session, so it earns its
  place only by staying a map, not a manual.
- The filename is fixed and root-neutral: every product repo served by the
  server carries its own `docs-mcp/component-router.md`.

## Frontmatter (Mandatory for every document)

```yaml
---
name: ln-toggle              # slug — MUST equal the filename (without .md)
classification: simple       # see allowed classifications below
status: draft                # draft | stable
domain: frontend             # frontend | backend | process — corpus domain (absent = frontend)
summary: One-sentence summary shown in list/search results.
source: js/ln-toggle/src/ln-toggle.js   # main source files (supports arrays)
tags: [state, collapsible]
---
```

`context` is not frontmatter — for skills it is derived from the subfolder (`app` | `web` | `wordpress`). Skill documents also omit `source:` (standalone — no code source).

Allowed `classification` values by folder:

| Folder | classification |
|---|---|
| `components/` | `simple` \| `coordinator` \| `service` |
| `css/` | `css` |
| `patterns/` | `pattern` |
| `guides/` | `guide` |
| `doctrine/` | `doctrine` |
| `skills/` | `skill` |

## Skills Are Standalone

Skills are library-agnostic decision doctrine — they never reference components, mixins, source paths, or any concrete library. They link only to sibling skills within the same context subfolder. The WHEN/WHAT (skills) ↔ HOW (components/css/patterns) join happens at serving time, not through authored links. Contexts carry opposite rules by design; the server never mixes two contexts in one served set.

## Prescribed Headings (Parsing Contract)

The MCP parser binds directly to EXACT headings. Do not modify wording, order, or numbering.
The templates in `_templates/` are the only allowed structures:

- `_templates/component.md` → for `components/`
- `_templates/css.md` → for `css/`
- `_templates/pattern.md` → for `patterns/`
- `_templates/guide.md` → for `guides/` and `doctrine/`
- `_templates/skill.md` → for `skills/` (prescriptive decision rules; persona prompting lives on the MCP server, never in the document)

**Language:** All content in indexed documents is in **English** (prose, headings, tables). 

## Normative Tables

**Attributes** (components, §3 under `### Attributes Table`):

| Attribute | Element | Type / Values | Default | Description |
|---|---|---|---|---|

**Events** (components, §3 under `### Events API`):

| Event | Direction | Cancelable | Description | `detail` Object |
|---|---|---|---|---|

`Direction` is either `Emits` or `Listens`.

**Empty sub-sections — explicit none-declaration.** In `simple` and `coordinator` documents, §3 always contains BOTH `### Attributes Table` and `### Events API`. When a component has no configuration attributes (or no custom events), the sub-section is NOT omitted or left blank — it holds a single explicit sentence:
- Attributes: `This component reads no data-ln-* configuration attributes.`
- Events: `This component emits and listens to no custom ln-* events.`

A component with any custom event — in either direction — documents it in the Events table (the `Direction` column distinguishes emit vs listen); the events none-declaration is used only when the component has no custom events at all. `service` documents are exempt (their §3 is a functions API).

**SCSS API** (CSS documents, §3):

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|

`Kind` is one of `mixin` \| `class` \| `token` \| `attribute`.

**Included Components** (patterns, §3):

| Component | Role in the Pattern |
|---|---|

## Markup Templates (for `get_markup` tool)

In §2, each ```` ```html ```` block under `### Base HTML Markup` is the default template, and each block under `### Variant N: <name>` is a named variant. The MCP extracts these directly; the markup MUST be complete and functional out of the box, with no hallucinated attributes.

**Exception for `classification: service`:** Background APIs have no markup; §2 contains ```` ```js ```` blocks (import + call) instead of ```` ```html ````. `get_markup` returns these with their language tag; if no blocks are present, it returns an empty result referencing the §3 API table rather than throwing an error.

## Cross-References

Links between documents must be authored as relative markdown links:
`[ln-accordion](./ln-accordion.md)`, `[tables](../css/tables.md)`.
The MCP builds the cross-reference graph from these links automatically—no separate graph file is needed.
Skills are the exception: no outward links — only `./` links to sibling skills in the same context subfolder.

## Lifecycle

A new document begins as `status: draft`. Once it has been validated against the source code (attributes, values, events, markup), it moves to `status: stable`.
Documents should be updated in the SAME commit as the code changes they describe.

## Validation

The parsing contract is validated in ONE place: the MCP server (`validate_docs` tool / CLI linter). Run validation there before committing any new or modified document.
