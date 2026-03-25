# Cards

Data containers with compact, table-like styling. File: `scss/components/_cards.scss`.

## Usage (HTML class — for prototyping)

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

## Semantic usage (project SCSS — recommended)

In project code, do NOT use `class="card"` on `<div>`. Use a semantic element + `@include card`:

```html
<!-- HTML — semantic -->
<section id="users">
    <ul>
        <li>
            <h3>John Smith</h3>
            <dl>
                <dt>Email</dt><dd>john@example.com</dd>
                <dt>Role</dt><dd>Admin</dd>
            </dl>
        </li>
    </ul>
</section>
```

```scss
// SCSS — style semantic selectors
#users {
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
#user-profile { @include card; }
```
