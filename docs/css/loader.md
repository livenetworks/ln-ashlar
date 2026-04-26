# Loader

CSS-only spinner. Mixin only — no default class selector. Files: `scss/config/mixins/_loader.scss`, `scss/components/_loader.scss` (keyframes only).

## Usage

Apply `@include loader` to a semantic selector in project SCSS:

```scss
#page-loader     { @include loader; }
#section-spinner { @include loader; }
```

```html
<div id="page-loader" aria-label="Loading" role="status"></div>
```

## Size

Size is controlled by `font-size` on the element. The spinner dimensions are relative (`em` units), so changing `font-size` scales the entire spinner proportionally.

Default is `font-size: 90px` — a prominent page-level spinner. Override for smaller contexts:

```scss
#inline-spinner {
    @include loader;
    font-size: 32px;  // smaller spinner
}
```

## Positioning

The mixin centers the spinner horizontally with `margin: auto`. It does NOT set vertical margin — layout rhythm is a consumer concern. The default `.loader` binding adds `margin-top/bottom: 4.5rem` for page-level empty-state usage; when applying the mixin to your own selector, add your own vertical spacing if you need it:

```scss
#inline-spinner {
    @include loader;
    @include my(2rem);
}
```

For full-page loading, wrap in a centered container:

```html
<div id="page-loader" role="status" aria-label="Loading"></div>
```

For inline or button-level loading states, see the pseudo-element guidance in CLAUDE.md — spinners injected via JS avoid pseudo-element conflicts with icon buttons.

## Color

The spinner uses `color: hsl(var(--color-primary))`. Override on the element:

```scss
#page-loader { @include loader; --color-primary: var(--color-text-subtle); }
```

## Note

This is a CSS `box-shadow` spinner — no images, no SVG, no extra elements. It requires the element to have no meaningful text content. Always include `role="status"` and `aria-label="Loading"` for screen readers.
