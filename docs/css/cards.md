# Cards

Data containers with compact, table-like styling. File: `scss/components/_card.scss`.

## Usage (HTML класа — за прототипирање)

```html
<article class="card">
    <header><h3>Title</h3></header>
    <main>
        <div class="field">
            <span class="label">Name</span>
            <span class="value">John Doe</span>
        </div>
    </main>
</article>
```

## Семантичка употреба (проектен SCSS — препорачано)

Во проектен код, НЕ користи `class="card"` на `<div>`. Користи семантички елемент + `@include card`:

```html
<!-- HTML — семантички -->
<section id="korisnici">
    <ul>
        <li>
            <h3>Марко Петров</h3>
            <dl>
                <dt>Email</dt><dd>marko@example.com</dd>
                <dt>Улога</dt><dd>Админ</dd>
            </dl>
        </li>
    </ul>
</section>
```

```scss
// SCSS — стилирање на семантички селектори
#korisnici {
    ul { @include grid-2; list-style: none; padding: 0; margin: 0; }
    li { @include card; }
}
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
