---
name: empty-state
classification: css
status: active
domain: frontend
summary: Centered empty state and placeholder views for zero-data and zero-search-result conditions.
source: theme/config/mixins/_empty-state.scss
tags: [empty-state, placeholder, zero-data, search-empty, feedback]
---

# 📭 empty-state

---

## 1. Core Behavior & Responsibility

The `empty-state` component (`theme/config/mixins/_empty-state.scss` and `theme/components/_empty-state.scss`) renders centered, icon-led placeholders when a dataset or view contains no records:

- **Two Semantic Scenarios:**
  - `no-data`: First-time / onboarding state inviting the user to create records.
  - `no-results`: Filter / search results returned 0 matches, offering a clear filter action.
- **Vertical Stack Alignment:** Centers icon, title (`heading-sm`), subtitle (`body-md`), and primary call-to-action button vertically.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Zero-Data Onboarding State)

```html
<div data-ln-empty-state="no-data">
    <svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-icon-folder"></use></svg>
    <h3>No documents yet</h3>
    <p>Upload your first file or import an existing archive to get started.</p>
    <button type="button" class="btn">Upload Document</button>
</div>
```

### Variant 1: Filter / Search No-Results State

```html
<div data-ln-empty-state="no-results">
    <svg class="ln-icon ln-icon--xl" aria-hidden="true"><use href="#ln-icon-search"></use></svg>
    <h3>No matching records</h3>
    <p>Try adjusting your search keywords or clearing active filters.</p>
    <button type="button" class="btn btn-ghost">Reset Filters</button>
</div>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `empty-state` | mixin | — | Centered flex column layout with muted icon and title rhythm |
| `data-ln-empty-state` | attribute | `no-data` \| `no-results` | Declarative attribute selector for empty states |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Always Provide Recovery Actions:** An empty state should always provide a way forward (e.g. "Create Item" for `no-data` or "Clear Filters" for `no-results`).
> 2. **Icon Accessibility:** Decorative empty state illustration icons must carry `aria-hidden="true"` so screen readers focus directly on the heading text.

---

## 5. Related Documents

- [`ln-search`](../components/ln-search.md) — Real-time search filtering.
- [`cards`](./cards.md) — Card wrappers containing empty states.
