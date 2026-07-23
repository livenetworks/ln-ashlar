---
name: ui-status-badge
classification: skill
status: draft
domain: frontend
summary: Standalone completeness rules for status badges — three-signal accessibility rules (dot + text + tint), five semantic categories, and actionable badge dropdowns.
tags: [ui, status-badge, badge, accessibility, semantic-colors]
---

# 🏷️ Status Badge Rules

## Summary

This skill defines the requirements for Status Badges and state indicators. Consult it when displaying state badges in data tables, detail headers, card grids, or lists.

> For visual language and color semantics → [`./ui-visual-language.md`](./ui-visual-language.md)

---

## 1. Core Principle

A status badge MUST communicate state using **THREE simultaneous signals**: **colored indicator dot + readable text label + tinted background container**. Relying on color alone violates WCAG 1.4.1 accessibility guidelines.

---

## 2. Five Mandatory Semantic Categories

All application statuses MUST map into exactly one of five standardized semantic categories. Inventing custom non-standard status colors is forbidden:

| Category | Visual Tone | Use Cases |
|---|---|---|
| **Success** | Green | Active, Approved, Paid, Completed, Online |
| **Error** | Red | Rejected, Failed, Overdue, Cancelled, Offline |
| **Warning** | Amber | Pending, Draft, Expiring Soon, Attention Required |
| **Info** | Blue | In Progress, Scheduled, Processing, New |
| **Neutral** | Gray | Archived, Inactive, Unassigned, Disabled |

---

## 3. Mandatory Behavioral Rules

- **Three Signals Always Present:** Dot + human-readable text + tinted container background MUST be rendered together.
- **Human-Readable Text:** Text MUST display clean translated words (e.g. *"Active"*), never raw internal status codes (e.g. *"STATUS_ACT_12"*).
- **Actionable Badge Variant:** When status can be mutated directly from a list or header, badge MAY function as an interactive trigger opening a status transition dropdown or confirmation.

---

## 4. Anti-Patterns — NEVER Do These

- Indicating state using color alone (e.g. a plain red or green dot without text labels).
- Introducing non-standard custom badge colors (e.g., purple, neon yellow) outside the 5 semantic categories.
- Rendering raw database status codes or numeric IDs inside badges instead of human-readable labels.
