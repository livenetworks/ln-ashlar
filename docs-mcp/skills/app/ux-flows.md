---
name: ux-flows
classification: skill
status: draft
domain: frontend
summary: Interaction flows — the action-feedback loop, four view states, feedback channels, navigation, the destructive-action ladder, error recovery, and motion.
tags: [skill, ux, feedback, states, navigation, ln-specific]
---

# UX Flows

Every interaction is a conversation: action → acknowledge → process → respond → next state. If any step is missing, the interaction is broken. No action goes unacknowledged; no edge case goes unplanned.

---

## Four states — design all of them

Every data-driven view is a state machine: **LOADING / EMPTY / OK / ERROR**. A feature with only the OK state designed is incomplete.

| State | Must show | Must offer |
|---|---|---|
| Loading | indicator scoped to the affected area (button spinner / shimmer — never full-page) | nothing clickable (disabled) |
| Empty | what's missing (two types — see `./data-views.md`) | the next action |
| OK | the data, organized | actions on it |
| Error | what went wrong, in human language | a recovery path |

## Feedback strategy

| Action | Immediate | On success | On failure |
|---|---|---|---|
| Save/Create | button "Saving…" | toast "Saved" | inline field errors / error toast |
| Delete | confirm (see ladder) | toast "Deleted" | error toast |
| Toggle | instant visual change (optimistic) | none | revert + error toast |
| Search/Filter | instant results | none | query-empty state |
| Upload | progress | toast | error + retry |
| Bulk | "Deleting 5…" | toast with count | partial-failure breakdown |

Toast rules: success/info auto-dismiss, error persists until dismissed; short, specific, past tense; never technical details. Contract: `../../components/ln-toast.md`.

## Navigation

| After | Go to |
|---|---|
| Create | detail of the new item |
| Edit + save | stay with feedback, or back to detail |
| Delete from list / bulk | stay on list |
| Delete from detail | back to list |
| Cancel | back, no confirmation |

- URLs reflect state (bookmarkable); back never loses data; returning to a list preserves search, filters, sort, and scroll.
- Breadcrumbs on anything deeper than top-level; max 3 levels of depth.

## Destructive actions — confirmation ladder

```
instant ──────── inline confirm ──────── modal
toggle off       delete 1 row            delete account / cascade /
remove tag       (button → "Confirm?",   bulk 5+ / overwrite
                  auto-reverts)          (explain consequences + count)
```

Only destructive actions confirm — "Are you sure?" everywhere teaches users to click through. Labels are descriptive actions ("Delete employee"), never OK/Cancel. Contract: `../../components/ln-confirm.md`, `../../components/ln-modal.md`.

## Error recovery

Match error to scope: field error → inline on the field; action error → toast; page error → full-page state. Always offer a next step (retry, fix, go back). Human language ("That email is already registered", not "409 Conflict"). Progress survives errors.

## Edge cases — always answered

First use (no data) · one item · 1000+ items · very long text/names (truncate, don't break) · slow network (loading visible promptly) · double click (disabled while processing) · browser back (state preserved or warned) · refresh mid-form · touch/mobile · concurrent edit (last write wins, indicated).

## Keyboard

`/` focuses search; `Escape` closes/cancels; Tab order sane; focus always visible; focus trapped in modals; arrow keys inside composite widgets (dropdowns, pill groups, tabs); no keyboard traps.

## Motion

Animation is communication — appear/disappear, expand/collapse, state progress. Never decorative, never blocking, never scroll-triggered in data tools; honor `prefers-reduced-motion`. Durations/easing → `../../doctrine/scss-architecture.md`.

## Anti-patterns

Actions with no feedback; blank loading/empty areas; error dead-ends; confirmation for non-destructive actions; success message sitting on the form page; losing filter/scroll state on back; deep nesting; only designing the happy path.
</content>
