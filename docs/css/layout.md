# Layout

App layout system. Files: `scss/layout/_app-layout.scss`, `_header.scss`, `_grid.scss`.

## App Layout

```html
<div class="app-wrapper">
    <aside class="sidebar">
        <div class="sidebar-header">
            <img class="logo" src="logo.svg">
            <span class="app-name">My App</span>
        </div>
        <div class="sidebar-content">
            <nav class="nav">...</nav>
        </div>
        <div class="sidebar-footer">v1.0</div>
    </aside>

    <div class="main-panel">
        <div class="header">...</div>
        <div class="content">...</div>
        <footer class="footer">...</footer>
    </div>
</div>
```

- `.sidebar` -- fixed, 16rem wide, responsive collapse on mobile
- `.main-panel` -- flex column, margin-left: 16rem
- `.content` -- flex-1, max-width 80rem, auto margins

## Header

```html
<div class="header">
    <div class="header-left">
        <button class="menu-toggle"><span class="ln-icon-menu"></span></button>
        <h1>Page Title</h1>
    </div>
    <div class="header-right">
        <div class="header-search">
            <input type="text" placeholder="Search...">
        </div>
        <div class="header-actions">...</div>
    </div>
</div>
```

Sticky, z-sticky, border-bottom. Menu toggle hidden on desktop, visible on mobile.

## Grid

| Class | Mixin | Description |
|-------|-------|-------------|
| `.grid` | `@include grid` | 1->2->3 columns responsive |
| `.grid-2` | `@include grid-2` | 1->2 columns responsive |
| `.grid-4` | `@include grid-4` | 1->2->4 columns responsive |
| `.stack` | `@include stack` | Vertical flex, gap 1rem |
| `.stack-sm` | `@include stack(0.5rem)` | Vertical flex, gap 0.5rem |
| `.stack-lg` | `@include stack(1.5rem)` | Vertical flex, gap 1.5rem |
| `.row` | — | Horizontal flex + center + gap |
| `.row-between` | — | Horizontal flex + space-between |
| `.container` | — | Max 80rem, centered, responsive padding |
| `.container-sm` | — | Max 56rem, centered |

> **Важно:** Овие класи постојат за **брзо прототипирање** во HTML.
> Во проектен код, **СЕКОГАШ** користи `@include` на семантички елемент:
>
> ```html
> <!-- ПОГРЕШНО — презентациска класа во HTML -->
> <div class="grid-4">
>     <div class="card">...</div>
> </div>
>
> <!-- ТОЧНО — семантички HTML + @include во SCSS -->
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

Components не знаат каде ќе бидат поставени. `@include container` на парентот, `@container` на детето — тоа е единственото правило.

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

### Кога `@container`, кога `@media`

| `@container` | `@media` |
|---|---|
| Reusable components | App shell (sidebar, header) |
| Cards, grids, lists | Global layout structure |
| Се поставува на повеќе места | Еден фиксен контекст |

### Стандардни breakpoints

| Value | Use |
|-------|-----|
| `480px` | 1→2 колони во тесни контејнери |
| `580px` | 1→2 колони (стандардно) |
| `880px` | 2→3 колони |
| `1120px` | 3→4 колони |

### Naming конвенција

**noun, singular, lowercase, без хифени** — CSS custom ident правила.

```scss
// RIGHT
container-name: foldersgrid;
container-name: sidebar;
container-name: cardgrid;
container-name: searchresults;

// WRONG
container-name: left-panel;   // позиција
container-name: card-grid;    // хифени не се дозволени
```

### Правила

- `container-type` секогаш на **парентот**, `@container` секогаш на **детето** — никогаш на ист елемент
- **НЕ** комбинирај `container-type: inline-size` со `overflow: hidden` на ист елемент — ги кршат containment. Ако треба клипирање, врапирај со дополнителен елемент
- Anonymous container (`@include container` без име) работи со `@container (min-width: ...)` — само кога има еден container ancestor во scope

## Mobile

On screens below 768px, sidebar transforms off-screen. Toggle with `.open` class via JS.
