---
name: ux
classification: skill
status: draft
domain: frontend
context: app
summary: Decision rules for interaction flow — action-feedback loops, state machines, feedback channels, navigation, destructive-action confirmation, and error recovery for data-driven business UI.
source: .claude/skills/ux/SKILL.md
tags: [ux, interaction, feedback, states, navigation, forms, error-recovery]
---

# 🔄 UX Interaction Rules

## Summary

This skill governs HOW an interface behaves — what happens after a user acts, what feedback channel to use, where navigation goes, and how destructive actions and errors are handled. Consult it before designing any user flow, confirmation pattern, or feedback response; consult [`./ux-interaction-patterns.md`](./ux-interaction-patterns.md) for the concrete flows (search, sort, filter, bulk actions) that apply these rules.

---

> For visual layout and component anatomy → [`./ui.md`](./ui.md)
> For concrete interaction flows (search, sort, filter, bulk actions) → [`./ux-interaction-patterns.md`](./ux-interaction-patterns.md)
> For implementation: HTML → [`../doctrine/html-markup-rules.md`](../doctrine/html-markup-rules.md), CSS → [`../doctrine/scss-architecture.md`](../doctrine/scss-architecture.md), JS → [`../doctrine/js-component-model.md`](../doctrine/js-component-model.md)

---

## 1. The Action-Feedback Loop

Every user action follows this pattern:

```
USER ACTION → SYSTEM ACKNOWLEDGES → SYSTEM PROCESSES → SYSTEM RESPONDS → NEXT STATE
   click    →    "Saving..."      →   (server call)  →  "Saved" toast  → updated view
```

If any step is missing, the interaction is broken:
- No acknowledge → user doesn't know if the click registered
- No processing indicator → user clicks again (double action)
- No response → user doesn't know if it worked
- No next state → user doesn't know what to do now

---

## 2. State Machine Thinking

Every data-driven view is a state machine with exactly four states:

```
            ┌─────────┐
     load → │ LOADING │
            └────┬────┘
                 │
        ┌────────┼────────┐
        ▼        ▼        ▼
   ┌─────────┐ ┌────┐ ┌───────┐
   │  EMPTY  │ │ OK │ │ ERROR │
   └─────────┘ └────┘ └───────┘
```

**LOADING** — something is happening, be patient
**EMPTY** — nothing to show yet, here's what you can do
**OK** — here's your data
**ERROR** — something went wrong, here's how to recover

Design ALL FOUR states for every view. If you only design the OK state, the feature is incomplete.

### What Each State Must Provide

| State | Must Show | Must Offer |
|-------|-----------|------------|
| Loading | Indicator scoped to affected area | Nothing to click (disabled) |
| Empty | Explanation of what's missing | Action to create/add |
| OK | The data, well organized | Actions to interact with it |
| Error | What went wrong (human-readable) | Way to recover (retry, fix, go back) |

---

## 3. Feedback Strategy

### What Feedback to Give

| Action | Immediate Feedback | After Completion | Failure |
|--------|-------------------|------------------|---------|
| Save/Create | Button: "Saving..." | Toast: "Saved" | Inline errors or error toast |
| Delete | Inline confirm or modal | Toast: "Deleted" | Error toast |
| Toggle/Switch | Instant visual change | None (optimistic) | Revert + error toast |
| Search/Filter | Instant results update | None | Empty state (query returned zero) |
| Navigate | Page transition | None | 404 / error page |
| Upload | Progress indicator | Toast: "Uploaded" | Error with retry |
| Bulk action | Count: "Deleting 5 items..." | Toast: "5 items deleted" | Partial failure explanation |

### Feedback Channels

| Channel | Use For | Duration |
|---------|---------|----------|
| **Toast** ([`../components/ln-toast.md`](../components/ln-toast.md)) | Transient confirmations after actions | Auto-dismiss (success), persist (error) |
| **Inline message** | Field-specific errors, contextual help | Until resolved |
| **Button state** | Loading/processing indication | During action |
| **Visual change** | Direct manipulation result | Permanent |
| **Page/section error** | Cannot load/display content | Until retry succeeds |
| **Modal** ([`../components/ln-modal.md`](../components/ln-modal.md)) | Requires user decision before proceeding | Until dismissed |

### Toast Rules

- Position: bottom-right (desktop), full-width anchored to the bottom edge (mobile) — rationale in [`./ui-visual-language.md`](./ui-visual-language.md) § 14
- **Success/info:** auto-dismiss
- **Warning:** auto-dismiss, longer duration
- **Error:** persists until user dismisses
- Content: short, specific, past tense ("Employee saved", "3 items deleted")
- Never show technical details in toasts

`ln-toast` exists in the library ([`../components/ln-toast.md`](../components/ln-toast.md), dangling until authored); the desktop bottom-right position and mobile full-width bottom position match the library defaults (`scss/config/mixins/_toast.scss`).

---

## 4. Navigation Flow

### Where Does the User Go?

| After This | Navigate To |
|------------|-------------|
| Create new item | Detail page of the new item |
| Edit and save | Stay on edit page (with success feedback), OR back to detail |
| Delete from list | Stay on list (item removed) |
| Delete from detail | Back to list |
| Cancel form | Back to previous page (no save, no confirmation) |
| Click list item | Detail page |
| Bulk action | Stay on list (affected items updated/removed) |

### Breadcrumb Logic

```
List → Detail:           List > Item Name
List → Detail → Edit:    List > Item Name > Edit
List → Create New:       List > New Item
Dashboard → Section:     Dashboard > Section Name
```

### Navigation Rules

- **Back = safe** — pressing back never loses data (if there's unsaved changes, warn)
- **Cancel = abandon** — cancel discards changes without confirmation (the action was intentional)
- **URLs reflect state** — every meaningful view has a unique URL (bookmarkable, shareable)
- **Preserve context** — returning to a list preserves filters, search, sort, and scroll position

---

## 5. Form Flow Design

> Full spec → [`../components/ln-form.md`](../components/ln-form.md) (dangling — planned; see [`../guides/write-workflow.md`](../guides/write-workflow.md) for the current write-pipeline behavior)

---

## 6. Destructive Action Flow

### Severity Scale

```
LOW RISK ──────────────────── HIGH RISK
Toggle off    Remove tag    Delete item    Delete account
                                           Delete + cascade
   (instant)    (instant)    (confirm)     (modal + explain)
```

### Three Confirmation Patterns

**No confirmation** (instant) — for reversible, low-impact actions:
- Toggling a switch
- Removing a filter
- Closing a panel

**Inline confirm** (double-click) — for single-item deletes in lists:
```
[Delete] → click → [Confirm?] → click → done
                  ↓ (timeout)
                  reverts to [Delete]
```
- Button transforms: text changes, color changes to danger
- Auto-reverts after a few seconds if user doesn't confirm
- Fast, doesn't break flow for lists where you delete often

The library ships [`ln-confirm`](../components/ln-confirm.md) (dangling — planned) for this pattern.

**Modal confirm** — for irreversible, high-impact, or cascading actions.
Full modal spec (sizes, anatomy, confirmation pattern) → [`../components/ln-modal.md`](../components/ln-modal.md) (dangling — planned)

### When to Use Which

| Action | Pattern | Why |
|--------|---------|-----|
| Delete 1 row from table | Inline confirm | Fast, frequent action |
| Remove a tag/category | Instant | Low impact, easy to re-add |
| Delete user account | Modal | Permanent, has cascading effects |
| Bulk delete (5+ items) | Modal | Scale increases risk |
| Overwrite existing data | Modal | Data loss needs explanation |
| Leave page with unsaved changes | Browser confirm dialog | Standard pattern |

---

## 7. Multi-Step Process Design

### When to Use Multi-Step

- Process has 3+ distinct phases with different data
- User needs context/preview before committing
- Steps have dependencies (step 2 depends on step 1 choice)

### Multi-Step Rules

```
[Step 1: Basics] → [Step 2: Details] → [Step 3: Review] → [Done]
     ●                  ○                    ○                ○
```

- **Show progress** — step indicator showing current position and total
- **Allow back** — user can go to previous steps without losing data
- **Validate per step** — don't let user advance with errors
- **Review step** — summary of all inputs before final commit
- **Save draft** — for long forms, allow saving incomplete progress
- **Single submit** — only the final step sends data to server

### When NOT to Use Multi-Step

- Simple forms (under 10 fields) — use a single form with sections
- All fields are independent — no need for sequential flow
- User fills the form repeatedly — multi-step adds friction

---

## 8. Error Recovery Design

### Error Categories and Recovery

| Error Type | User Sees | Recovery Path |
|------------|-----------|---------------|
| Validation (client) | Inline error on field | Fix the field, error clears instantly |
| Validation (server) | Inline error mapped to field | Fix and resubmit |
| Server error (generic) | Toast: "Something went wrong" | Retry button |
| Network error | Toast or page error | Check connection, retry |
| Permission error | Page error: "Access denied" | Contact admin or go back |
| Not found | Page error: "Not found" | Go back, search |
| Conflict | Inline: "Email already taken" | Change value and resubmit |
| Timeout | Toast: "Request timed out" | Retry |

Client-side validation is grounded via [`../components/ln-validate.md`](../components/ln-validate.md) (dangling — planned; component exists at `js/ln-validate/`).

### Recovery Rules

- **Always offer a next step** — never leave the user at a dead end
- **Match error to scope** — field error → inline, page error → full page, action error → toast
- **Human language** — "That email is already registered" not "409 Conflict: duplicate key violation"
- **Preserve progress** — form data, scroll position, filter state survive errors
- **Graceful degradation** — if one section fails to load, the rest of the page still works

---

## 9. Edge Cases to Always Design For

Every feature should have answers for these:

| Edge Case | Design Answer |
|-----------|---------------|
| First use (no data) | Empty state with guidance |
| One item | Works without looking broken |
| 1000+ items | Virtual scroll ([`../components/ln-table.md`](../components/ln-table.md), dangling — planned) or progressive loading |
| Very long text | Truncate with full text accessible |
| Very long name/title | Truncate, don't break layout |
| Slow network | Loading state visible promptly |
| Offline | Clear indication, queue actions for retry |
| Double click | Disabled during processing |
| Browser back | Preserves state OR warns about unsaved |
| Refresh mid-form | Data preserved (optional: localStorage) |
| Mobile screen | Responsive layout, touch-friendly targets |
| Concurrent edit | Last write wins with conflict indication |

Virtual scroll is grounded: `js/ln-table/src/ln-table.js` implements a `VIRTUAL_THRESHOLD` (200 rows) with `_enableVirtualScroll`/`_renderVirtual`; `js/ln-list/` implements the same pattern for lists.

---

## 10. Motion

Animation is communication — it tells the user what happened and where to look. If a motion doesn't communicate, it's decoration and should be removed.

### When to Animate

| State Change | Animate? |
|-------------|----------|
| Element appears (modal, toast, dropdown) | Yes — user needs to notice it |
| Element disappears (close, dismiss) | Yes — user needs to know it's gone |
| Content expands/collapses | Yes — user needs to track what moved |
| Hover/focus feedback | Yes — confirms interaction target |
| Button state (idle → loading → done) | Yes — progress feedback |
| Data updates in place | Subtle fade/highlight |
| Initial page render | No — content appears instantly |
| Scroll-triggered reveals | No — never in data tools |

### Rules

- **Functional, not decorative** — every animation answers "what did this tell the user?"
- **No blocking** — animation never prevents the user from acting
- **Respect preferences** — honor `prefers-reduced-motion`

> For motion implementation (durations, easing functions, CSS specifics) → [`../doctrine/scss-architecture.md`](../doctrine/scss-architecture.md)

---

## 11. Anti-Patterns — NEVER Do These

### Flow
- Action with no feedback (user clicks, nothing visible happens)
- Success message on the same page as the form (navigate away instead)
- Clearing form data on error
- "Are you sure?" for every action (only destructive needs confirmation)
- "OK" / "Cancel" instead of descriptive action labels

### State
- Only designing the happy path (OK state)
- Blank screen when data is loading (no indicator)
- Blank screen when data is empty (no guidance)
- Same treatment for "no data exists" and "query returned zero" (2 distinct types — see [`./ux-interaction-patterns.md`](./ux-interaction-patterns.md) § 8)
- Error without recovery path

### Navigation
- Losing scroll position when navigating back to list
- Losing filter/search/sort state when navigating back
- No breadcrumbs on detail pages
- Deep nesting (more than 3 levels of navigation depth)
- Destructive action without "where do I go after"

### Forms
- Submit button disabled until all fields valid — keep the button enabled; an invalid submit is intercepted and answered with inline errors, focus moving to the first invalid field (see [`./ui-visual-language.md`](./ui-visual-language.md) § 11); disabled is for processing only
- Validation only on blur (too late — should be on keyup from first keystroke)
- Required fields not visible until error
- Untouched required fields shown as errors on load
- Multi-step for simple forms (under 10 fields)
- No way to re-submit after server error

### Motion
- Animation that blocks user interaction
- Scroll-triggered animations in data tools
- Animations without `prefers-reduced-motion` support
