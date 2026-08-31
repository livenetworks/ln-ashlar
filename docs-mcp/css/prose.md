---
name: prose
classification: css
status: draft
domain: frontend
summary: Longform editorial typography styling headings, paragraphs, bulleted lists, blockquotes, and code blocks.
source: theme/config/mixins/_prose.scss
tags: [prose, typography, editorial, articles, markdown, lists]
---

# 📖 prose

---

## 1. Core Behavior & Responsibility

The `prose` module (`theme/components/_prose.scss` and `theme/config/mixins/_prose.scss`) styles editorial reading content:
- **Structural vs Editorial Separation:** In `ln-ashlar`, base `<ul>` and `<ol>` tags are unstyled to serve as UI primitives (tabs, menus, button groups). The `.prose` wrapper opt-in restores standard editorial bullet discs, decimal numbers, and paragraph line spacing.
- **Reading Measure:** Caps line width at optimal readability (`65ch` max width).

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<article class="prose">
    <h1>Terms of Service</h1>
    <p>Welcome to our platform. Please review the following guidelines:</p>
    <ul>
        <li>Keep your account credentials secure.</li>
        <li>Do not share API keys across unverified environments.</li>
    </ul>
    <blockquote>
        Security is a shared responsibility across teams.
    </blockquote>
</article>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `prose` | mixin | — | Applies editorial typography, bulleted list styles, and reading rhythm |
| `.prose` | class | — | Default component class applying @include prose |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Do Not Style Global Lists:** Never set `list-style: disc` globally on `ul` at the root stylesheet level. Always confine editorial bullet styling to `.prose` containers.

---

## 5. Related Documents

- [`typography`](./typography.md) — Semantic typography scale.
- [`kbd`](./kbd.md) — Keycap styles inside prose.
