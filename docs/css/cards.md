# Cards

File: `scss/config/mixins/_card.scss`. Applied: `scss/components/_card.scss`.

---

## Two Components

| Mixin | Class | When |
|---|---|---|
| `@mixin card` | `.card` | Data card — bare container, no built-in header/footer |
| `@mixin section-card` | `.section-card` | Full layout card — composed header + main + footer |

---

## `@mixin card`

Bare container + structured child bindings. Reads the logical
`--color-bg`, `--color-border-strong`, `--radius`, `--shadow-default`,
`--shadow-raised` tokens.

**Root chrome:** `bg`, `border`, `radius`, `flex-col`,
`overflow-hidden`, `shadow-default`.

**Hover:** border-color → `--color-border-strong`, shadow upgrades to
`--shadow-raised`.

**Direct-child bindings** (apply on `>`-child only, so nested
`<header>`/`<main>`/`<footer>` inside card content are NOT rewritten):

| Child | Applied mixin / rules |
|---|---|
| `> header` | `@include panel-header` |
| `> main` | `@include panel-body` + `flex-1` + `gap: var(--gap)` (tile rhythm) |
| `> footer` | `@include panel-footer` |
| `> a` | `flex-col` + `flex-1` + `text-decoration: none` + `color: inherit` (whole-card-as-link) |
| `> main h3` | `font-size: var(--text-body-sm)`, `font-semibold`, `margin: 0`, `color: inherit` (tile-title sizing) |

Two common shapes:

```html
<!-- Data card -->
<article>
    <h3>Title</h3>
    <p>Content</p>
</article>

<!-- Card as link tile -->
<article>
    <a href="/report/42">
        <main>
            <h3>Q4 compliance report</h3>
            <p>Compiled 2026-04-21</p>
        </main>
    </a>
</article>
```

```scss
article { @include card; }
```

The `> main h3` rule keeps tile titles at body-sm size. If a card uses
a `<header>` wrapper instead, the regular `panel-header` h3 (title-sm)
applies — hierarchy by structure, not by class.

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

**Regions** (all spacing reads from tokens so the density cascade applies automatically):

- `header` — `bg-secondary`, `px(--size-md) py(--size-sm)`, `border-b`, `transition`, h3 is `text-title-sm font-semibold margin:0`
- `main` — `p(--size-lg)`
- `footer` — `px(--size-md) py(--size-sm)`, `border-t`, `flex justify-end`, `gap(--size-sm)`

The section-card itself also gets `@include transition` on the root so border/shadow/background changes (density switches, hover states on parent cascades) animate smoothly.

**Auto-flush for tables** — when `main` contains a `<table>` or `.table-container` as its **only child**, padding is dropped to `0` and the table's own radius, shadow, and margin are stripped. Mixed-content cards (intro + table + text) keep their padding and the table flows naturally with its own chrome intact. See [sections.md](sections.md#auto-flush-for-tables) for HTML examples and the `:only-child` rationale.

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
