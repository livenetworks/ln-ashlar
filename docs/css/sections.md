# Sections

Page section wrappers. File: `scss/components/_sections.scss`.

## `<section>`

Simple section with bordered header. Applied automatically to `<section>` elements.

```html
<section>
    <header>
        <h2>Title</h2>
        <div class="section-actions"><button>Action</button></div>
    </header>
    <main>Content</main>
</section>
```

## .section-card

Card-like section with background, border, shadow.

```html
<section class="section-card">
    <header><h3>Title</h3></header>
    <main>Content</main>
    <footer><button>Save</button></footer>
</section>
```

- `header` -- bg-secondary, border-bottom, text-base semibold
- `main` -- padding 1rem
- `footer` -- bg-secondary, border-top, right-aligned buttons

### Auto-flush for tables

When `main` contains a direct `<table>` or `.table-container`, padding is automatically removed and the table's own border-radius/shadow are stripped. The card's `overflow: hidden` handles the rounded corners.

```html
<!-- No extra classes needed — :has() detects the table -->
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
