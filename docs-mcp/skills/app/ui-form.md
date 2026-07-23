---
name: ui-form
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for forms and validation — reserved error space, keyup validation, field grouping, submit state behavior, and edit mode filling.
tags: [ui, form, validation, inputs, grid, editing]
---

# 📝 Form Rules

## Summary

This skill governs the design, layout, and completeness requirements for Forms. A form is an interactive conversation: labels ask questions, inputs provide answers, and instant validation gives feedback. Consult it when building create, edit, or settings interfaces.

> For form layout choices (Modal vs Page) → [`./ui.md`](./ui.md)  
> For state machine and error feedback → [`./ux.md`](./ux.md)

---

## 1. Core Principle

Every input field MUST validate on **keyup from the first keystroke**. Error message space MUST be reserved below every field from initial render — layout shifts when errors appear are strictly forbidden.

---

## 2. Standard Form Layout & Grid

```
┌─────────────────────────────────────────────────────────────────┐
│ <form>                                                          │
│  ┌────────────────────────┐ ┌────────────────────────────────┐  │
│  │ Name *                 │ │ Surname *                      │  │
│  │ ┌────────────────────┐ │ │ ┌────────────────────────────┐ │  │
│  │ │ input              │ │ │ │ input                      │ │  │
│  │ └────────────────────┘ │ │ └────────────────────────────┘ │  │
│  │ (reserved error space) │ │ (reserved error space)         │  │
│  └────────────────────────┘ └────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ [Cancel]                                     [Save]      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

- Multi-column layouts use structured CSS Grid spanning (e.g. 6 or 12 column grids).
- Column spans communicate expected input length (e.g., short inputs span 2 columns, long text spans full width).

---

## 3. Mandatory Requirements

### Declarative Validation
- Validation constraints MUST use native HTML attributes (`required`, `type="email"`, `minlength`, `pattern`).
- Error messages MUST be pre-rendered in HTML structure for accessibility and i18n support.
- Custom validation rules (e.g., password matching, server uniqueness checks) emit validation events.

### Input & Error Behavior
- **Keyup Validation:** Validation evaluates instantly on input/keyup.
- **Reserved Error Space:** Error message container occupies height in DOM even when hidden, preventing page jumps.
- **Initial Clean State:** Untouched required fields display no error on load; errors show only after user interaction.
- **Submit Button State:** Submit button remains enabled. Clicking submit on an invalid form blocks submission, triggers inline error messages, and focuses the first invalid field.
- **Processing State:** Submit button displays a loading spinner and enters disabled state *only* while server request is pending.

### Server Errors & Recovery
- When server submission fails, user input MUST be preserved — forms MUST NEVER be cleared on error.
- Success feedback causes navigation or modal dismissal + toast. Forms MUST NOT render inline "Success" text on themselves upon submit.

---

## 4. Modal vs Page Decision Matrix

| Form Characteristics | Placement |
|---|---|
| Single entity, flat fields (1-5 inputs), no conditional logic, no file uploads | **Modal** |
| Complex entities, conditional field visibility, tabbed sections, bulk uploads | **Page** |

---

## 5. Anti-Patterns — NEVER Do These

- Validating inputs only on blur or only on submit click.
- Clearing form input values when a server error occurs.
- Disabling the submit button until form is valid (prevents users from seeing why submit is blocked).
- Causing layout shifts by dynamically inserting error text containers into DOM flow.
- Displaying generic "Form is invalid" messages instead of highlighting specific invalid fields.
