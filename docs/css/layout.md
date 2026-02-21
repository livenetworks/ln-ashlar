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

## Mobile

On screens below 768px, sidebar transforms off-screen. Toggle with `.open` class via JS.
