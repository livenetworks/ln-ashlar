# Page header

File: `scss/config/mixins/_page-header.scss` + `scss/components/_page-header.scss`.

Standard page header pattern: breadcrumbs above, title + subtitle on
the left, action buttons on the right. Stacks vertically on narrow
containers.

**CSS-only.** No JS component backs this layout. The `data-ln-*` attribute
prefix is reserved for JS components — page headers use the `.page-header`
prototype-tier class.

## Structure

```html
<main class="main">
    <header class="page-header">
        <nav aria-label="Breadcrumb">
            <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">Quality Manual</li>
            </ol>
        </nav>
        <div>
            <h1>Quality Manual</h1>
            <p>Version 2.3 — Approved 2026-03-15</p>
        </div>
        <div>
            <button type="button">Edit</button>
            <button type="submit">Publish</button>
        </div>
    </header>
    <!-- ...rest of page content... -->
</main>
```

Breadcrumbs inside a page-header get styled automatically — you don't need `class="breadcrumbs"` on the inner `<nav>`. See [breadcrumbs.md](./breadcrumbs.md).

## Responsive

The header uses a viewport media query at `880px`:
- Below 880px: stacks `breadcrumbs → title → actions` vertically
- At 880px+: breadcrumbs on top full-width, title-left + actions-right

Self-contained — the flip triggers from viewport width regardless of
wrappers. No parent `container-type` required.

## Slots

- `> nav` — breadcrumbs (top row)
- `> div` with `> h1` — title + optional `p` subtitle
- `> div` with `> button` or `> a` — action buttons

The `:has()` selector picks the correct div for each slot. Works in
all modern browsers (Chrome 105+, Safari 15.4+, Firefox 121+).

## Project override

The library applies the mixin to `.page-header` by default. For a secondary page header, or to apply the layout to a different semantic selector:

```scss
#document-detail > header { @include page-header; }
```

Works in any layout — the responsive flip is viewport-driven and
requires no parent container context.
