# Cards

File: `scss/config/mixins/_card.scss`. Applied: `scss/components/_cards.scss`.

---

## Two Components

| Mixin | Class | When |
|---|---|---|
| `@mixin card` | `.card` | Data card — bare container, no built-in header/footer |
| `@mixin section-card` | `.section-card` | Full layout card — composed header + main + footer |

---

## `@mixin card`

Bare container: `bg-primary`, `border`, `rounded-md`, `shadow-xs`, `flex-col`, `overflow-hidden`.

**Hover**: border-color → `hsl(--color-primary / 0.25)`, shadow upgrades to `shadow-sm`.

```html
<article>
    <h3>Title</h3>
    <p>Content</p>
</article>
```

```scss
article { @include card; }
```

---

## `@mixin section-card`

Composed card with structured regions. Internally calls `@include panel-header` for `header`.

```html
<section class="section-card">
    <header><h3>Title</h3></header>
    <main>...</main>
    <footer>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
    </footer>
</section>
```

```scss
// Project SCSS — semantic selector
#user-settings { @include section-card; }
```

**Regions:**
- `header` — `bg-secondary`, `px(1rem) py(0.75rem)`, `border-b`, h3 is `text-base font-semibold margin:0`
- `main` — `p(1rem)`
- `footer` — `px(1rem) py(0.75rem)`, `border-t`, `flex justify-end gap(0.75rem)`

---

## `@mixin panel-header`

Standalone header mixin — used internally by `section-card` and `ln-modal`. Use directly when you need a styled header without a full section-card.

```scss
#my-widget header { @include panel-header; }
```

---

## Accent Variants

Colored border line — color reads from `--color-primary`. Override per element.

```scss
#stats li { @include card; @include card-accent-top; }
#alerts li { @include card; @include card-accent-left; --color-primary: var(--color-error); }
```

| Mixin | Border side | Hover |
|---|---|---|
| `@mixin card-accent-top` | 3px top | restores top border + `bg primary/0.04` |
| `@mixin card-accent-bottom` | 3px bottom | restores bottom border + `bg primary/0.04` |
| `@mixin card-accent-left` | 3px left | restores left border + `bg primary/0.04` |

> Accent hover deliberately does NOT change border-color (unlike base card hover) — preserves the accent color.

---

## `@mixin card-bg`

Tinted background — for highlights, alerts, hero cards.

```scss
#welcome { @include card; @include card-bg; }
```

Background: `primary/0.06`, border: `primary/0.15`. Color via `--color-primary` override.

---

## `@mixin card-stacked`

Visual depth illusion — `::after` pseudo-element renders a "card behind" the main card.

```scss
#featured { @include card; @include card-stacked; }
```

> **Note:** `::after` is used by this mixin. Do not combine with other mixins that also use `::after`.

---

## Color Override

All card mixins read `--color-primary`. Override on the element or a parent:

```scss
#critical-alerts li {
    @include card;
    @include card-accent-left;
    --color-primary: var(--color-error);
}
```

---

## Prototyping vs Production

| Context | How |
|---|---|
| Prototyping / inspector | `class="card"` or `class="section-card"` |
| Production project | `@include card` on semantic selector — never `class="card"` on `<div>` |
