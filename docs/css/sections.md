# Sections

Page section wrappers. File: `scss/components/_sections.scss`.

## `.section`

Simple page-section wrapper with bordered header. **Opt-in via class** — the mixin is NOT bound to the bare `<section>` element, because `<section>` is a generic semantic container used all over the place (nested groupings, split layouts, card bodies) and would collide with the content it's meant to hold.

```html
<section class="section">
    <header>
        <h2>Title</h2>
        <div class="section-actions"><button>Action</button></div>
    </header>
    <main>Content</main>
</section>
```

> **Breaking change (v1.3):** Previously applied automatically to every `<section>`. Projects that relied on the bare-element binding need to add `class="section"`, or apply `@include section` to a project-specific selector in their SCSS.

## .section-card

Card-like section with background, border, shadow, and transitions.

```html
<section class="section-card">
    <header><h3>Title</h3></header>
    <main>Content</main>
    <footer><button>Save</button></footer>
</section>
```

**Region styling** (all values read from spacing tokens so the density cascade applies automatically):

- `header` — `bg-secondary`, `px(--size-md) py(--size-sm)`, `border-b`, `transition`, h3 is `text-title-sm font-semibold margin:0`
- `main` — `p(--size-lg)`
- `footer` — `px(--size-md) py(--size-sm)`, `border-t`, `flex justify-end`, `gap(--size-sm)`

### Auto-flush for tables

When `main` contains a `<table>` (or `.table-container`) **as its only child**, padding is automatically removed and the table's own `border-radius`, `box-shadow`, and `margin-bottom` are stripped. The card's `overflow: hidden` handles the rounded corners.

```html
<!-- Pure table card — main contains ONLY the table -->
<section class="section-card">
    <header><h3>Items</h3></header>
    <main>
        <table>...</table>
    </main>
</section>
```

Works with `.table-container` too:

```html
<section class="section-card">
    <header><h3>Items</h3></header>
    <main>
        <div class="table-container">
            <table>...</table>
        </div>
    </main>
</section>
```

**Mixed content** — when `main` contains a table alongside other elements (intro paragraph, headings, demo blocks, etc.), padding stays and the table keeps its own chrome and vertical rhythm, flowing inside the card's content area:

```html
<!-- Mixed content — table keeps its radius/shadow/margin, padding stays -->
<section class="section-card">
    <header><h3>Rules</h3></header>
    <main>
        <p>Intro text explaining the table.</p>
        <h4>Subsection</h4>
        <table>...</table>
    </main>
</section>
```

> The flush rule uses `:has(> table:only-child)` — it triggers **only** when the table is the sole direct child of `main`. Adding any sibling (even a `<p>` or `<h4>`) turns it off. This is intentional: an `:has(> table)` rule without `:only-child` would silently strip padding from any card that happens to contain a table for explanatory purposes, which was the old v1.2 behavior — fixed in v1.3.
