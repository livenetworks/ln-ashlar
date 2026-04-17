# Breadcrumbs

CSS-only navigation trail. No JS involvement.

**Files:**
- Mixin: `scss/config/mixins/_breadcrumbs.scss`
- Component: `scss/components/_breadcrumbs.scss`

## Usage

```html
<nav class="breadcrumbs" aria-label="Breadcrumb">
    <ol>
        <li><a href="/">Home</a></li>
        <li><a href="/users">Users</a></li>
        <li aria-current="page">Edit</li>
    </ol>
</nav>
```

The library applies `@include breadcrumbs` to `.breadcrumbs`. No other selector is bound — breadcrumbs are a page-level singleton.

- **`<nav>` is the container**, not the `<ol>`. The mixin internally targets `> ol` and its descendants so the browser's default `<ol>` padding/decimal-marker reset happens at the right depth.
- **`aria-label="Breadcrumb"`** is required for screen-reader landmark identification (WAI-ARIA).
- **Last item** uses `aria-current="page"` and renders without a link — gets primary text color + medium weight.
- **Separator** `»` is auto-generated via `li + li::before`. Decorative — the list order carries the semantic meaning.

## Automatic inclusion inside `page-header`

Any `<nav>` inside `.page-header` (or any element with `@include page-header`) gets breadcrumb styling automatically. You do **not** need `class="breadcrumbs"` when the breadcrumbs live inside a page header:

```html
<header class="page-header">
    <nav aria-label="Breadcrumb">
        <ol>
            <li><a href="#">Home</a></li>
            <li aria-current="page">Settings</li>
        </ol>
    </nav>
    <div><h1>Settings</h1></div>
</header>
```

## Project override

For a second breadcrumb instance on the same page (rare), apply the mixin to a project selector:

```scss
#secondary-breadcrumbs { @include breadcrumbs; }
```
