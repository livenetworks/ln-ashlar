---
name: empty-state
classification: css
status: draft
domain: frontend
summary: Placeholder layout for zero-data states featuring an icon, title, description, and primary call-to-action button.
source: theme/components/_empty-state.scss
tags: [empty-state, placeholder, zero-data, cta, layout]
---

# 📭 empty-state

---

## 1. Core Behavior & Responsibility

The `empty-state` component (`theme/components/_empty-state.scss` and `theme/config/mixins/_empty-state.scss`) renders centered placeholders when data views, tables, or search queries yield no results:
- **Binding:** Automatically bound to `[data-ln-empty-state]` in the theme layer.
- **Layout:** Centered flex column capped at `28rem` max width.
- **Grid / Table Span:** Provides `@include empty-state-span` (`grid-column: 1 / -1`) so the empty state seamlessly spans across parent multi-column grids or tables.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div data-ln-empty-state>
    <svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-icon-folder-off"></use></svg>
    <h3>No documents found</h3>
    <p>Upload a new PDF or scan to get started with your workspace.</p>
    <button type="button" class="btn" data-ln-modal-for="upload-modal">Upload Document</button>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `empty-state` | mixin | — | Centers content with vertical rhythm, max width, and action margins |
| `empty-state-span` | mixin | — | Spans full width (grid-column: 1 / -1) across parent grids or tables |
| `[data-ln-empty-state]` | class | — | Default component selector applying @include empty-state |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Actionable Recovery:** Always provide a clear call-to-action (CTA) button or search reset trigger so users are never left stranded.
> 2. **Use Attribute Selector:** Use `[data-ln-empty-state]` rather than custom classes to leverage the built-in theme bindings.

---

## 5. Related Documents

- [`tables`](./tables.md) — Empty states inside data tables.
- [`loader`](./loader.md) — Loading states vs empty states.
