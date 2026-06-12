# Design Tokens

> **Theming:** see `docs/css/theming.md` for dark mode and
> consumer theme extensions.

CSS custom properties defined in `scss/config/_tokens.scss`. Single source of truth for all design values.

## How to use

Colors are stored as **bare HSL triplets** — this enables alpha transparency. Status/brand/neutral scale tokens are stored as triplets. Vocabulary and primitive tokens are pre-composed `hsl(...)` values that mixins read directly.

```css
/* Scale token — bare triplet, compose at use site */
background-color: hsl(var(--color-primary));
background-color: hsl(var(--color-primary) / 0.5);

/* Primitive — pre-composed, read directly */
background: var(--color-bg);
color: var(--color-fg);

/* Rebind primitive on a scope to shift that component's surface */
.dark-section { --color-bg: var(--bg-elevated); }
#alert-panel  { --color-primary: var(--color-error); }
```

---

## Colors

### Primary
```css
--color-primary:         216 95% 42%;   /* Brand blue */
--color-primary-light:   216 95% 93%;   /* Active nav, focus rings */
--color-primary-lighter: 216 95% 97%;
```

Hover and focus states are derived at consumer scope via CSS relative color syntax — see [Status color overrides](#status-color-overrides) below.

### Secondary
```css
--color-secondary:         160 76% 40%;  /* Green */
--color-secondary-light:   160 76% 93%;
--color-secondary-lighter: 160 76% 97%;
```

### Status
```css
--color-success:         142 76% 36%;
--color-success-light:   142 76% 93%;
--color-success-lighter: 142 76% 97%;

--color-error:           0 84% 50%;
--color-error-light:     0 84% 93%;
--color-error-lighter:   0 84% 97%;

--color-warning:         32 95% 44%;
--color-warning-light:   32 95% 93%;
--color-warning-lighter: 32 95% 97%;

--color-info:            217 91% 60%;
--color-info-light:      217 91% 93%;
--color-info-lighter:    217 91% 97%;
```

### Status color overrides

To change a component's status color, prefer the library helper classes (`.success`, `.warning`, `.error`, `.info`) — they rebind `--color-primary` plus its `-light` / `-lighter` companions on the scope. Hover and focus states are dynamically derived from `--color-primary` at consumer scope via CSS relative color syntax (`hsl(from var(--color-accent) h s calc(l - 8))`), so they propagate to hover/focus states automatically. However, the tint surfaces (`-light` and `-lighter` tokens) are static HSL triplets defined at `:root` and do NOT propagate automatically; if you override `--color-primary` directly on a selector, you must also override its `-light` and `-lighter` companion tokens if you want the tint surfaces to follow.

### Neutral scale (v1.1)

The canonical grey layer. Status, vocabulary, and border tokens reference this scale. Dark mode rebinds vocabulary tokens directly.

| Token | Value | Feeds vocabulary |
|---|---|---|
| `--color-neutral-50` | `220 20% 98%` | `--bg-elevated` |
| `--color-neutral-100` | `220 16% 96%` | `--bg-sunken`, `--bg-recessed`, `--border-subtle` |
| `--color-neutral-300` | `220 13% 83%` | `--border-strong` |
| `--color-neutral-400` | `218 11% 65%` | `--fg-subtle`, placeholder |
| `--color-neutral-500` | `220  9% 46%` | `--fg-muted`, helper text |
| `--color-neutral-900` | `221 39% 11%` | `--fg-default` (maximum contrast) |

**Why stored as bare HSL triplets:** enables alpha transparency via
`hsl(var(--color-neutral-900) / 0.5)`.

### Value vocabulary

Vocabulary tokens are pre-composed `hsl(...)` values that provide the
available choices for each primitive. Components rebind the primitive
(`--color-bg`, `--color-fg`, `--color-border`, `--shadow`) on their
own scope to pick a different vocabulary value. Themes override
vocabulary at theme `:root`.

#### Background vocabulary

| Token | Value | Role |
|---|---|---|
| `--bg-base` | `hsl(var(--color-white))` | Page-level surface (cards, inputs, modals) |
| `--bg-elevated` | `hsl(var(--color-neutral-50))` | Raised surfaces (floating panels, dropdowns) |
| `--bg-sunken` | `hsl(var(--color-neutral-100))` | Sunken surfaces (`thead`, panel headers, scrollbar track) |
| `--bg-recessed` | `hsl(var(--color-neutral-100))` | Recessed fills (chip, code blocks, progress tracks) |

#### Foreground vocabulary

| Token | Value | Role |
|---|---|---|
| `--fg-default` | `hsl(var(--color-neutral-900))` | Primary text |
| `--fg-muted` | `hsl(var(--color-neutral-500))` | Secondary / helper text |
| `--fg-subtle` | `hsl(var(--color-neutral-400))` | Disabled / placeholder text |

#### Border vocabulary

| Token | Value | Role |
|---|---|---|
| `--border-subtle` | `hsl(var(--color-neutral-100))` | Dividers, floating-panel edges |
| `--border-strong` | `hsl(var(--color-neutral-300))` | Button borders, outlined controls |
| `--border-strong-hover` | `hsl(var(--color-neutral-400))` | Hover state for strong borders |

#### Shadow vocabulary

| Token | Wires to | Role |
|---|---|---|
| `--shadow-resting` | `var(--shadow-sm)` | Cards, tables, stat-cards |
| `--shadow-floating` | `var(--shadow-md)` | Tooltips, dropdowns, popovers |
| `--shadow-overlay` | `var(--shadow-xl)` | Modals |

### Primitives — what mixins read

Mixins read ONLY these single primitives. The primitive defaults wire to the vocabulary. Components rebind the primitive on their own scope.

| Primitive | Default (wires to vocabulary) | What reads it |
|---|---|---|
| `--color-bg` | `var(--bg-base)` | Background of any surface |
| `--color-fg` | `var(--fg-default)` | Text color |
| `--color-border` | `var(--border-subtle)` | Border color |
| `--shadow` | `var(--shadow-resting)` | Box shadow |
| `--color-scrim` | `hsl(var(--color-neutral-900) / 0.5)` | Modal overlay backdrop background |
| `--color-accent` | `hsl(var(--color-primary))` | Primary solid accent color (buttons, active indicators) |
| `--color-accent-fg` | `hsl(var(--color-white))` | Text color on solid accent background |
| `--color-accent-tint` | `hsl(var(--color-primary-lighter))` | Light accent wash (checked pills, active nav item background) |
| `--color-accent-tint-strong` | `hsl(var(--color-primary-light))` | Stronger light accent wash (focus halos, upload active zones) |
| `--font-size` | `var(--text-body-md)` | Base font size |
| `--line-height` | `var(--lh-body-md)` | Base line height |
| `--transition` | `var(--transition-base)` | Standard transition timing/curve |
| `--margin-block` | *None (soft primitive)* | Vertical spacing / rhythm (margin-bottom/top) |
| `--margin-inline` | *None (soft primitive)* | Horizontal spacing / rhythm (margin-left/right) |
| `--border-block-start` | *None (soft primitive)* | Top border override (joining elements) |
| `--border-block-end` | *None (soft primitive)* | Bottom border override |
| `--border-inline-start` | *None (soft primitive)* | Left border override |
| `--border-inline-end` | *None (soft primitive)* | Right border override |

**Rebind pattern — picking a different vocabulary value:**

```css
/* Floating panel — rebind primitives on its own scope */
.my-dropdown {
    --color-bg:     var(--bg-elevated);
    --color-border: var(--border-subtle);
    --shadow:       var(--shadow-floating);
}

/* Chip — recessed fill + muted text */
.chip {
    --color-bg: var(--bg-recessed);
    --color-fg: var(--fg-muted);
}

/* Modal — overlay shadow */
.my-modal {
    --shadow: var(--shadow-overlay);
}
```

**Theme override — rebind vocabulary at theme `:root`:**

```css
[data-theme="contrast"] {
    --bg-base:       hsl(0 0% 100%);
    --bg-sunken:     hsl(0 0% 92%);
    --fg-default:    hsl(0 0% 0%);
    --border-strong: hsl(0 0% 0%);
}
```

### Border

```css
--color-border:         var(--border-subtle);   /* primitive — composed */
--border-width:         1px;
--border-width-strong:  2px;
```

---

## Spacing

| Token | Value | px |
|-------|-------|----|
| `--size-0` | 0 | 0px |
| `--size-2xs` | 0.125rem | 2px |
| `--size-xs` | 0.25rem | 4px |
| `--size-xs-up` | 0.375rem | 6px |
| `--size-sm` | 0.5rem | 8px |
| `--size-sm-up` | 0.625rem | 10px |
| `--size-md` | 1rem | 16px |
| `--size-md-up` | 1.25rem | 20px |
| `--size-lg` | 1.5rem | 24px |
| `--size-xl` | 2rem | 32px |
| `--size-2xl` | 3rem | 48px |
| `--size-3xl` | 4rem | 64px |

---

## Border

```css
--border-width: 1px;
```

| Token | Value | px |
|-------|-------|----|
| `--radius-sm` | 0.25rem | 4px |
| `--radius-md` | 0.5rem | 8px |
| `--radius-lg` | 0.75rem | 12px |
| `--radius-xl` | 1rem | 16px |
| `--radius-full` | 9999px | circle |

---

## Shadows

All shadows use a cool-tinted base `hsl(220 40% 15% / alpha)` giving a modern, premium appearance.

| Token | Layers | Value in SCSS | Use |
|---|---|---|---|
| `--shadow-none` | — | `none` | Reset / disable shadows |
| `--shadow-xs` | 1 | `0 1px 2px 0 hsl(220 40% 15% / 0.04)` | Hairline lift (subtle cards) |
| `--shadow-sm` | 2 | `0 1px 3px 0 hsl(... / 0.08), 0 1px 2px -1px hsl(... / 0.04)` | Cards, dropdowns |
| `--shadow-md` | 2 | `0 4px 12px -2px hsl(... / 0.10), 0 2px 4px -2px hsl(... / 0.06)` | Floating panels, popovers, toast |
| `--shadow-lg` | 2 | `0 12px 24px -6px hsl(... / 0.12), 0 8px 12px -4px hsl(... / 0.08)` | Large floating panels |
| `--shadow-xl` | 2 | `0 24px 48px -12px hsl(... / 0.16), 0 12px 24px -6px hsl(... / 0.10)` | Modals, full-screen overlays |
| `--shadow-2xl` | 2 | `0 36px 72px -18px hsl(... / 0.20), 0 18px 36px -9px hsl(... / 0.12)` | Hero elevation |
| `--shadow-inner` | 1 | `inset 0 2px 4px 0 hsl(... / 0.06)` | Depressed / active state |
| `--shadow-primary` | 1 | `0 8px 24px -6px hsl(var(--color-primary) / 0.28)` | Primary-tinted glow (CTA emphasis) |
| `--shadow-success` | 1 | `0 8px 24px -6px hsl(var(--color-success) / 0.28)` | Success-tinted glow |
| `--shadow-error` | 1 | `0 8px 24px -6px hsl(var(--color-error) / 0.28)` | Error-tinted glow |

**Do not use hover shadows on buttons.** Buttons change colour only (`docs/architecture/reference.md` § Button Architecture).

### Focus ring (v1.1)

`@include focus-ring($color: var(--color-primary))` produces a
three-layer halo:

1. 2px inner ring in `--color-bg` — visual separator
2. 2px middle ring in `$color` at 60% alpha — main signal
3. 2px outer glow in `$color` at 15% alpha — soft halo

Error variant: `@include focus-ring(var(--color-error))`.

The v1.0 `$width` argument has been removed — the three-layer halo is
always 6px total. Projects that need a different thickness can use
`focus-combination`, `focus-inset-shadow`, or write a custom mixin.

---

## Transitions

| Token | Value |
|-------|-------|
| `--transition-fast` | `0.15s cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-base` | `0.2s cubic-bezier(0.4, 0, 0.2, 1)` |
| `--transition-slow` | `0.3s cubic-bezier(0.4, 0, 0.2, 1)` |

---

## Typography

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', monospace;
```

| Token | Value | px |
|-------|-------|----|
| `--text-xs` | 0.75rem | 12px |
| `--text-sm` | 0.875rem | 14px |
| `--text-base` | 1rem | 16px |
| `--text-lg` | 1.125rem | 18px |
| `--text-xl` | 1.25rem | 20px |
| `--text-2xl` | 1.5rem | 24px |

| Token | Value |
|-------|-------|
| `--font-normal` | 400 |
| `--font-medium` | 500 |
| `--font-semibold` | 600 |
| `--font-bold` | 700 |

---

## Z-Index

```
toast (50) > modal (40) > overlay (30) > dropdown (20) > sticky (10)
```

| Token | Value |
|-------|-------|
| `--z-sticky` | 10 |
| `--z-dropdown` | 20 |
| `--z-overlay` | 30 |
| `--z-modal` | 40 |
| `--z-toast` | 50 |

### Stacking Context & Teleportation Strategy

Components like dropdowns and popovers are teleported to `<body>` to prevent parent `overflow: hidden` clipping. However, because their base z-index is `--z-dropdown` (20), opening them inside a modal (`--z-modal` which is 40) would place them underneath the modal backdrop.

To resolve this, the framework uses a CSS `:has()` selector on `<body>` to automatically elevate teleported dropdowns and popovers to `z-index: 50` (modal z-index + 10) when a modal is active. Tooltips in JS portal mode are placed at `z-index: 50` (`--z-toast`) by default, so they automatically render above modals.

---

## Naming convention

Token names are always **semantic** (by function), never by color:

```css
/* Correct */
--color-primary: 216 95% 42%;
--color-error:   0 84% 50%;

/* Wrong */
--color-blue: 216 95% 42%;
--color-red:  0 84% 50%;
```

---

## v1.1 Additions

### Spacing (extended)

| Token | Value | Use |
|---|---|---|
| `--size-2xs` | 2px | Tight gaps inside compound components (icon-next-to-text) |
| `--size-3xl` | 4rem | Section separators on large dashboards |

### Content widths

| Token | Value | Use |
|---|---|---|
| `--max-w-prose` | 65ch | Rich-text article / TipTap output |
| `--max-w-form` | 32rem | Auth forms, short settings panels |
| `--max-w-content` | 48rem | Standard content column |
| `--max-w-container` | 80rem | Outer page container |

### Easings (curves only)

| Token | Curve | Use |
|---|---|---|
| `--easing-standard` | `cubic-bezier(0.4, 0, 0.2, 1)` | Default UI motion |
| `--easing-decelerate` | `cubic-bezier(0, 0, 0.2, 1)` | Enter animations (modal open) |
| `--easing-accelerate` | `cubic-bezier(0.4, 0, 1, 1)` | Exit animations (modal close) |
| `--easing-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Springy emphasis (nav underline, success check) |

### Border widths

| Token | Value | Use |
|---|---|---|
| `--border-width-strong` | 2px | Emphasis borders (active pill, focus inner ring) |

### Breakpoints

See `docs/css/breakpoints.md`.

### Motion safety

See `docs/css/motion.md` (added in v1.1 Phase 5).

### Typography roles (v1.1)

Semantic layer on top of the existing `text-*` primitives. Use when
the intent is "this is a page title" or "this is a helper label",
not "this is 14px text".

| Role | Size | Line-height | Use |
|---|---|---|---|
| `display-lg` | 3.75rem | 1.1 | Hero page headline |
| `display-md` | 3rem | 1.1 | Large page headline |
| `display-sm` | 2.25rem | 1.15 | `h1` default |
| `heading-lg` | 1.875rem | 1.2 | Section headline |
| `heading-md` | 1.5rem | 1.25 | `h2` default |
| `heading-sm` | 1.25rem | 1.3 | `h3` default |
| `title-md` | 1.125rem | 1.4 | `h4` default, card title |
| `title-sm` | 1rem | 1.4 | `h5` default, strong body lead |
| `body-lg` | 1.125rem | 1.6 | Emphasis paragraph |
| `body-md` | 1rem | 1.6 | Standard body (default `p`) |
| `body-sm` | 0.875rem | 1.5 | Secondary body, helper text |
| `label-md` | 0.875rem | 1.4 | `h6`, form label |
| `label-sm` | 0.75rem | 1.4 | Small label, meta |
| `caption` | 0.75rem | 1.4 | Captions, timestamps |

**Mixin:** `@include typography(<role>)`

See `typography.md` for full usage and role-selection guide.
