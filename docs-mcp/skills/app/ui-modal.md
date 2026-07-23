---
name: ui-modal
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for modals and dialog overlays — four sizes, form root requirements, focus trapping, destructive confirmations, and modal vs page decision trees.
tags: [ui, modal, dialog, overlay, confirmation, decision-tree]
---

# 💬 Modal Rules

## Summary

This skill governs the structure, sizing, accessibility, and interaction rules for Modal dialogs. A modal interrupts the user flow and MUST be justified by consequence weight or focused user intent. Consult it when designing dialog overlays.

> For form design rules inside modals → [`./ui-form.md`](./ui-form.md)  
> For interaction feedback strategies → [`./ux.md`](./ux.md)

---

## 1. Core Principle

A modal is an explicit interruption. `<form>` MUST always be the root container of a modal's content structure. Modals are reserved for decisions and short focused forms — complex workflows belong on dedicated pages.

---

## 2. Anatomy & Structure

```
┌─────────────────────────────────────────────────────────┐
│ Modal Header: Title                             [ ✕ ]   │ ← Header (sticky)
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Modal Body (scrollable content area)                    │
│                                                         │
├─────────────────────────────────────────────────────────┤
│ [ Cancel ]                             [ Save Changes ] │ ← Footer (sticky)
└─────────────────────────────────────────────────────────┘
```

- **Header:** Contains modal title and close button `[ ✕ ]` top-right.
- **Body:** Scrollable content area; contains fields or message text.
- **Footer:** Contains actions. Secondary/Cancel action on left, Primary action on right. Exactly ONE primary button per modal.

---

## 3. Four Standard Sizes

| Size | Primary Use Case | Width Guideline |
|---|---|---|
| **Small (sm)** | Short confirmations, single-question prompts | ~400px |
| **Medium (md)** | Short forms (3-5 inputs), simple resource creation | ~560px |
| **Large (lg)** | Multi-field forms, complex configurations | ~720px |
| **Extra-Large (xl)** | Tabbed modal dialogs, data previews | ~900px |

Modal size is determined strictly by content requirements, never aesthetic preference.

---

## 4. Mandatory Behavioral Rules

- **Form Root:** Content container MUST be wrapped in a `<form>` root element.
- **Backdrop Behavior:** Backdrop darkens page content. Clicking the backdrop MUST NOT dismiss the modal (prevents accidental data loss).
- **Keyboard Trapping:** Focus MUST be trapped within modal while open. Pressing `ESC` closes the modal.
- **No Nested Modals:** Modals MUST NOT spawn child modals on top of themselves. Use in-place inline confirmations or page transitions instead.
- **Open Boundary Normalization:** Modal contents and input fields MUST be reset and normalized upon receiving open commands.

---

## 5. Destructive Confirmations

- Destructive action buttons use error styling.
- Default focus MUST land on the **Cancel** button (not the destructive action).
- Title MUST explicitly name the consequence (e.g., *"Delete User Account"* instead of *"Are you sure?"*).

---

## 6. Anti-Patterns — NEVER Do These

- Spawning a modal on top of an existing open modal (nested modals).
- Allowing backdrop clicks to dismiss forms with active user inputs.
- Using generic "OK" / "Cancel" labels instead of descriptive action verbs (e.g., "Save User", "Delete File").
- Placing two primary action buttons inside a single modal footer.
- Rendering full-viewport modals on desktop screens (use a dedicated page instead).
