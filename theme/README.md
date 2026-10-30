# 🎨 ln-ashlar Theme & CSS Architecture

`ln-ashlar` provides a high-performance visual layer with **Dual CSS Engine Support**:
1. **Ashlar SCSS (Native):** Semantic class-free, design token-driven stylesheet system optimized for minimal CSSOM invalidation and modern W3C standards.
2. **Tailwind CSS v4:** Utility-first engine compiling into a standalone bundle (`dist/ln-ashlar-tailwind.css`) with comprehensive layout and interaction parity verified across all 67 demo pages.

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
├── ln-ashlar-relaxed.scss     # Relaxed design bundle (Core + Theme + designs/relaxed/*)
└── ln-ashlar-theme.scss       # Theme-only visual design system bundle
```

---

## ⚡ SCSS Performance & Selector Best Practices

To prevent browser style invalidation storms during interactive DOM mutations, all SCSS mixins and components adhere to the following rules:

1. **Consolidate Compound `:has()` Queries via `:is(...)`:**
   - Within structural mixins (such as `panel-body` in `_card.scss`, `pills` in `_form.scss`, and numeric table cells in `_table.scss`), collapse chained `:has()` checks into a single `:has(> :is(...))` selector rather than authoring sequential `:has()` rules.

2. **Prefer Natural Cascade over `:not(:has(...))`:**
   - Negative `:not(:has(...))` selectors force the browser layout engine into exhaustive negative ancestor traversals.
   - Use CSS source-order cascade instead:
     ```scss
     // ✅ RECOMMENDED: Natural cascade override
     &:hover { border-color: var(--color-accent); }
     &:has(> input:checked) {
       border-color: var(--color-accent);
       color: var(--color-accent);
     }
     ```
   - For multi-action stacking (e.g. table header sorting and filtering in `_table.scss`), declare base single-action rules with `:has(:is(...))` and override with double-action `:has(...):has(...)` rather than mutual `:not(:has(...))` exclusions.

3. **Use Logical Properties for Sizing and Spacing:**
   - Mixins for padding and margin use modern CSS logical properties (`padding-inline`, `padding-block`, `margin-inline`, `margin-block`), reducing generated rules by 50% compared to separate physical properties (`-left`, `-right`, `-top`, `-bottom`).

4. **Scope Container State Checks to Direct Children:**
   - For container-level state indicators (e.g. navigation item active/hover lines on `li::before`), scope state queries strictly to direct children using `>` (e.g. `li:has(> a:hover)::before`, `li:has(> a.active)::before`). This avoids recursive descendant tree searches while preserving full-item indicator positioning and animations.

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
