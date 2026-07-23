---
name: ui-loading-state
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for loading indicators — button spinners vs content shimmers, scoping requirements, and anti-patterns.
tags: [ui, loading-state, spinner, shimmer, feedback]
---

# ⏳ Loading State Rules

## Summary

This skill defines the requirements for system loading indicators and visual progress feedback. Consult it when designing async action responses, table hydration, or content updates.

> For state machine definitions → [`./ux.md`](./ux.md)

---

## 1. Two Loading Indicator Patterns

| Pattern | Visual Form | Best Used For |
|---|---|---|
| **Spinner** | Rotating icon / indicator | Short waits (<2 seconds), button-level inline actions, form submission buttons |
| **Shimmer (Skeleton)** | Subtle animated sweep over structural layout | Longer loads (2-5 seconds), section or page panel hydration |

---

## 2. Mandatory Rules

- **Structural Alignment:** Shimmers MUST match the actual structural geometry of target content (table row height, card boundaries).
- **Disabled State:** Controls triggering an active loading state MUST enter a disabled state for the duration of processing to prevent duplicate submissions.
- **Progress Bar Transition:** Operations taking longer than 5 seconds with determinable progress MUST transition from spinners to progress indicators.
- **Scoped Loading:** Loading indicators MUST be scoped strictly to the affected DOM container. Triggering a button-level loading state MUST NEVER block or freeze the entire viewport.

---

## 3. Anti-Patterns — NEVER Do These

- Rendering full-page blocking loaders for localized element updates.
- Displaying blank, un-indicated screens during async data requests.
- Using generic spinner indicators for long multi-step processes where percentage progress is known.
- Rendering animated shimmer placeholders that do not align with the final content layout geometry.
