---
name: ui-tabs
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for tabbed interfaces — URL hash synchronization, badge counts, initial DOM mounting, and responsive overflow handling.
tags: [ui, tabs, navigation, hash-sync, badges]
---

# 📑 Tabs Rules

## Summary

This skill governs the structure and behavior of Tabbed interfaces. Tabs organize content sharing a single parent entity context into distinct views. Consult it when designing detail views, settings panels, or multi-section views.

> For page layout decision rules → [`./ui.md`](./ui.md)

---

## 1. Core Principle

Tabs represent **different VIEWS of the SAME entity** — not navigation to different entities. All tab panel content MUST be rendered in the DOM from initial page load; lazy-loading content panels on tab click is forbidden.

---

## 2. Mandatory Functional Requirements

### DOM Structure & Loading
- Tab bar headers + all content panels MUST exist in DOM from initial paint.
- Tab switching toggles visibility instantly with zero latency.

### URL Hash Synchronization
- Active tab state MUST sync with URL hash (e.g., `#details`, `#history`).
- Loading a page with a URL hash automatically activates the corresponding tab panel.

### Namespace Scoping
- Pages supporting multiple tab groups MUST scope tab groups using distinct namespace attributes to prevent cross-group collisions.

### Badges & Visual Signals
- Tab headers MAY display count badges (e.g., *"Comments (5)"*).
- Active tab MUST be clearly distinguished using a high-contrast visual indicator (fill, border-bottom, or background shift).

---

## 3. Responsive Behavior

- When viewport space is insufficient to display all tab headers inline, tab bar MUST support smooth horizontal scrolling with overflow gradients.
- If tab count exceeds 5 items on small screens, tab bar MAY collapse into a dropdown selector.

---

## 4. Anti-Patterns — NEVER Do These

- Rendering a single tab (if only one view exists, omit tabs entirely).
- Lazy-loading tab panel contents on tab click (causes artificial visual delays).
- Omitting URL hash synchronization (prevents users from sharing direct links to specific tab views).
- Using tabs for primary navigation between different entities (use navigation bars or sidebars instead).
