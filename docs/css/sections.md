# Sections

Page section wrappers. File: `scss/components/_sections.scss`.

## .section

Simple section with bordered header.

```html
<section class="section">
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

## .section-empty

Empty state placeholder.

```html
<div class="section-empty">
    <div class="empty-icon">icon</div>
    <h3>No data</h3>
    <p>Add items to see them here.</p>
</div>
```
