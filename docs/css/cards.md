# Cards

Data containers with compact, table-like styling. File: `scss/components/_card.scss`.

## Usage

```html
<div class="card">
    <header><h3>Title</h3></header>
    <main>
        <div class="field">
            <span class="label">Name</span>
            <span class="value">John Doe</span>
        </div>
    </main>
</div>
```

## Structure

- `header` -- compact, uppercase h3, `bg-secondary`
- `main` -- content area with flex-col + gap
- `.field` -- key-value pairs with border separator
  - `.label` -- xs uppercase, secondary color
  - `.value` -- sm semibold, primary color

## Hover

Subtle -- border color changes to primary, shadow upgrades to md.

## Semantic Usage (mixin)

```scss
#korisnik { @include card; }
```
