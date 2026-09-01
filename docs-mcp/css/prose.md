---
name: prose
classification: css
status: active
domain: frontend
summary: Editorial rich-text typographic styling for articles, release notes, and WYSIWYG editor output with bullet lists and blockquotes.
source: theme/config/mixins/_prose.scss
tags: [prose, typography, rich-text, articles, lists, editor]
---

# 📖 prose

---

## 1. Core Behavior & Responsibility

The `prose` module (`theme/config/mixins/_prose.scss` and `theme/components/_prose.scss`) delivers typographic styling for editorial and rich-text content:

- **Editorial Rhythm:** Restores bullet discs on `<ul>`, decimal counters on `<ol>`, blockquote left accent borders, code block formatting, and paragraph vertical rhythm.
- **Reading Measure Constraint:** Constrains line length to `--max-w-prose` (65ch) for optimal reading comfort.
- **Editor Output Formatting:** Turnkey styling wrapper for TipTap, CKEditor, or Markdown rendered HTML.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup (Article Prose Container)

```html
<article class="prose">
    <h2>Release Notes</h2>
    <p>Version 2.0 introduces an inverted density architecture.</p>
    <ul>
        <li>Compact base density at 14px</li>
        <li>Accessible focus indicators</li>
    </ul>
    <blockquote>
        <p>Design systems thrive on clear boundaries and strict invariants.</p>
    </blockquote>
</article>
```

### Variant 1: Semantic SCSS Mixin Inclusion

```scss
#help-center-article {
    @include prose;
}
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `prose` | mixin | — | Editorial typography recipe with styled lists, blockquotes, and code |
| `.prose` | class | — | Prototyping wrapper class for rich-text content |
| `--max-w-prose` | token | `65ch` | Optimal reading measure width constraint |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Lists in UI vs. Editorial Prose:** Structural UI lists (menus, tabs, chips, accordions) must NEVER use `.prose` (they use unstyled `<ul>`). Use `.prose` only for editorial prose and documentation.
> 2. **Line Length Constraint:** Do not override `--max-w-prose` to 100% on ultra-wide screens, as lines beyond 75ch cause tracking strain for readers.

---

## 5. Related Documents

- [`typography`](./typography.md) — Typography roles and scales.
- [`tokens`](./tokens.md) — Font families and line heights.
