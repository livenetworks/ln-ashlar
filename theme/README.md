# 🎨 ln-ashlar Theme & CSS Architecture

`ln-ashlar` provides a high-performance visual layer with **Dual CSS Engine Support**:
1. **Ashlar SCSS (Native):** Semantic class-free, design token-driven stylesheet system optimized for minimal CSSOM invalidation and modern W3C standards.
2. **Tailwind CSS v4:** Utility-first engine compiling into a standalone bundle (`dist/ln-ashlar-tailwind.css`) with 100% design and visual layout parity.

---

## 🏛️ Directory Structure

```
theme/
├── base/                      # Global HTML5 element resets, typography, and defaults
├── components/                # Layer 2 component styling (card, table, form, modal, nav, etc.)
├── config/                    # Design tokens, density scales, color themes, and mixins
│   ├── mixins/                # Reusable SCSS mixins for semantic styling
│   ├── _tokens.scss           # Master CSS custom properties (colors, spacing, radius, shadows)
│   ├── _theme.scss            # Theme definitions (Default, Glass, Flat, Minimal)
│   └── _density.scss          # Density scale rebinds (compact, default, spacious)
├── tailwind/                  # Tailwind CSS v4 source definitions
│   ├── theme.css              # Design token mappings to Tailwind v4 @theme directive
│   ├── components.css         # Component utility recipes
│   └── entry.css              # Entrypoint bundle
├── ln-ashlar.scss             # Master bundle (Core + Theme)
└── ln-ashlar-theme.scss       # Theme-only visual design system bundle
```

---

## ⚡ SCSS Performance & Selector Best Practices

To prevent browser style invalidation storms during interactive DOM mutations, all SCSS mixins and components adhere to the following rules:

1. **Avoid Repeating `:has()` Inside Mixins:**
   - Never embed complex `:has()` selectors inside mixins that are `@include`d across multiple component variants or classes.
   - De-duplicate and hoist container-level `:has()` rules to global component scopes using `:is(...)` (e.g. `:is(.card, .section-card, [class*="card"]) > :is(main, a > main):has(...)`).

2. **Prefer Natural Cascade over `:not(:has(...))`:**
   - Negative `:not(:has(...))` selectors force the browser layout engine to traverse ancestor trees repeatedly to prove absence.
   - Use CSS source-order cascade instead:
     ```scss
     // ✅ RECOMMENDED: Natural cascade override
     &:hover { border-color: var(--color-accent); }
     &:has(> input:checked) {
       border-color: var(--color-accent);
       color: var(--color-accent);
     }
     ```

3. **Use Logical Properties for Sizing and Spacing:**
   - Mixins for padding and margin use modern CSS logical properties (`padding-inline`, `padding-block`, `margin-inline`, `margin-block`), reducing generated rules by 50% compared to separate physical properties (`-left`, `-right`, `-top`, `-bottom`).

4. **Anchor Pseudo-Elements to Direct Elements:**
   - Apply active indicators (e.g. `::before`) directly to the target element (`a::before`) with `position: relative`, rather than querying parent containers (`li:has(a.active)::before`).

---

## 💨 Tailwind CSS v4 Engine

To compile the Tailwind v4 bundle:
```sh
npm run build:tailwind
```

The output bundle is generated at:
- `dist/ln-ashlar-tailwind.css`
- `demo/admin/dist/admin-tailwind.css`
- `demo/dist/ln-ashlar-tailwind.css`

Consumers can toggle between engines dynamically in the browser or via:
```javascript
localStorage.setItem('ln-demo-engine', 'tailwind'); // or 'ashlar'
```
