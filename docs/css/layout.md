# Layout

Grid and container query utilities. File: `scss/config/mixins/_layout.scss`.

## Grid

| Class | Mixin | Description |
|-------|-------|-------------|
| `.grid` | `@include grid` | 1→2→3 columns responsive |
| `.grid-2` | `@include grid-2` | 1→2 columns responsive |
| `.grid-4` | `@include grid-4` | 1→2→4 columns responsive |
| `.stack` | `@include stack` | Vertical flex, gap 1rem |
| `.stack-sm` | `@include stack(0.5rem)` | Vertical flex, gap 0.5rem |
| `.stack-lg` | `@include stack(1.5rem)` | Vertical flex, gap 1.5rem |
| `.container` | — | Max 80rem, centered, responsive padding |
| `.container-sm` | — | Max 56rem, centered |

All three grid mixins use `gap: 1.5rem`.

> **Important:** These classes exist for **rapid prototyping** in HTML.
> In project code, **ALWAYS** use `@include` on a semantic element:
>
> ```html
> <!-- WRONG — presentational class in HTML -->
> <div class="grid-4">
>     <div class="card">...</div>
> </div>
>
> <!-- RIGHT — semantic HTML + @include in SCSS -->
> <section id="stats">
>     <ul>
>         <li>...</li>
>     </ul>
> </section>
> ```
>
> ```scss
> #stats ul { @include grid-4; list-style: none; padding: 0; margin: 0; }
> #stats li { @include card; @include p(1rem); }
> ```

## Container Queries

Components don't know where they'll be placed. `@include container` on the parent, `@container` on the child — that's the only rule.

```scss
// Parent declares context
#folders        { @include container(foldersgrid); }
.search-results { @include container(searchresults); }
.modal-body     { @include container; }   // anonymous — no name needed
```

```scss
// Child queries — always native CSS, no mixin wrapper
#folders > ul {
    display: grid;
    grid-template-columns: 1fr;

    @container foldersgrid (min-width: 580px) {
        grid-template-columns: repeat(2, 1fr);
    }
    @container foldersgrid (min-width: 880px) {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

### When `@container`, when `@media`

| `@container` | `@media` |
|---|---|
| Reusable components | App shell (sidebar, header) |
| Cards, grids, lists | Global layout structure |
| Placed in multiple contexts | Single fixed context |

### Standard breakpoints

| Value | Use |
|-------|-----|
| `480px` | 1→2 columns in tight containers |
| `580px` | 1→2 columns (standard) |
| `880px` | 2→3 columns |
| `1120px` | 3→4 columns |

### Naming convention

**noun, singular, lowercase, no hyphens** — CSS custom ident rules.

```scss
// RIGHT
container-name: foldersgrid;
container-name: sidebar;
container-name: cardgrid;
container-name: searchresults;

// WRONG
container-name: left-panel;   // position-based
container-name: card-grid;    // hyphens not allowed
```

### Rules

- `container-type` always on the **parent**, `@container` always on the **child** — never on the same element
- Do **NOT** combine `container-type: inline-size` with `overflow: hidden` on the same element — they break containment. If you need clipping, wrap with an additional element
- Anonymous container (`@include container` without name) works with `@container (min-width: ...)` — only when there's a single container ancestor in scope
