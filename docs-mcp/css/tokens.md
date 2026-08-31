---
name: tokens
classification: css
status: draft
domain: frontend
summary: Three-layer design token architecture (Scale, Vocabulary, Primitives) managing colors, spacing, radius, and shadows.
source: theme/config/_tokens.scss
tags: [tokens, css-variables, theme, foundations]
---

# 🎨 tokens

---

## 1. Core Behavior & Responsibility

The `ln-ashlar` design token architecture lives within the **Visual Theme Layer** (`ln-ashlar-theme.css` / `theme/config/_tokens.scss`). 

> [!NOTE]
> The **Core Functional Layer** (`ln-ashlar-core.css`) is completely **token-free** (zero colors, zero typography, zero theme variables). Tokens only govern the visual presentation layer.

Within the theme system, design values follow a strict **3-Layer Token Model** to guarantee seamless theming and density adaptations:

```
Scale Tokens       →  --size-*, --color-neutral-*, --shadow-sm/md/xl
                      (Back-end plumbing; NEVER read inside mixin bodies)
         ↓ wired at :root
Vocabulary Tokens  →  --bg-base, --fg-default, --border-subtle, --shadow-resting,
                      --text-{role}, --lh-{role}
                      (Named design intent; themes and density rebind these)
         ↓ wired at :root
Primitive Tokens   →  --color-bg, --color-fg, --color-border, --shadow,
                      --padding-x, --padding-y, --gap, --radius, --font-size, --line-height
                      (What mixin bodies read and consume)
```

- **Rule:** Mixin bodies read **primitives**. Components rebind primitives on their local scope to select a vocabulary value. Themes and density modes rebind vocabulary at their root scope.
- **Semantic Relationship:** `--bg-*` vocabulary tokens are **not an elevation ladder**; their absolute values may invert or shift across themes while preserving their semantic relationship.

---

## 2. Minimal HTML Markup & Usage Variants

### Base HTML Markup

```html
<div class="card">
    <header>
        <h3>Token Architecture Example</h3>
    </header>
    <p>Primitives cascade automatically across light and dark modes.</p>
</div>
```

### Variant 1: Scoped Override

```html
<aside style="--color-bg: var(--bg-sunken); --color-border: var(--border-strong);">
    <p>Custom sunken surface</p>
</aside>
```

---

## 3. SCSS API (Mixins, Classes & Tokens)

| Name | Kind | Parameters / Values | Description |
|---|---|---|---|
| `--color-primary` | token | `221 83% 48%` | Primary royal blue bare HSL triplet |
| `--color-secondary` | token | `160 84% 36%` | Brand emerald accent bare HSL triplet |
| `--color-success` | token | `142 76% 36%` | Success status bare HSL triplet |
| `--color-error` | token | `0 84% 48%` | Error status bare HSL triplet |
| `--color-warning` | token | `32 95% 38%` | Caution status bare HSL triplet |
| `--color-info` | token | `200 95% 38%` | Info status bare HSL triplet |
| `--bg-base` | token | color | Base canvas background |
| `--bg-elevated` | token | color | Raised card background |
| `--bg-sunken` | token | color | Static sunken well and table header background |
| `--bg-recessed` | token | color | Recessed input background |
| `--bg-hover` | token | color | Neutral interactive hover background |
| `--bg-active` | token | color | Neutral interactive active/pressed background |
| `--tint-hover` | token | percentage (`7%`) | Accent-wash ratio for interactive hover |
| `--tint-selected` | token | percentage (`12%`) | Accent-wash ratio for selected/current items |
| `--tint-active` | token | percentage (`14%`) | Accent-wash ratio for active/pressed items |
| `--fg-default` | token | color | High-contrast primary text |
| `--fg-muted` | token | color | Muted secondary text and captions |
| `--border-subtle` | token | color | Subtle separator border |
| `--border-strong` | token | color | Focused and high-contrast border |
| `--size-xs` | token | `0.25rem` | 4px spacing unit |
| `--size-sm` | token | `0.5rem` | 8px spacing unit |
| `--size-md` | token | `1rem` | 16px base spacing unit |
| `--size-lg` | token | `1.5rem` | 24px spacing unit |
| `--size-xl` | token | `2rem` | 32px spacing unit |

---

## 4. Accessibility & Common Pitfalls

> [!CAUTION]
> 1. **Direct Scale Reaching:** Never read `--size-*` or raw HSL values directly inside a mixin body. Always read primitives (`--padding-x`, `--color-bg`) so themes and density modes cascade properly.
> 2. **Alpha Channel Transparency:** When using opacity with token colors, always use modern CSS slash syntax: `hsl(var(--color-primary) / 0.15)`.

---

## 5. Related Documents

- [`mixins`](./mixins.md) — Comprehensive SCSS mixin index.
- [`density`](./density.md) — Density tiers and runtime scaling.
- [`theming`](./theming.md) — Dark mode vocabulary rebinding.
