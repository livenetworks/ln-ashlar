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

| Class | Description |
|-------|-------------|
| `.grid` | 1->2->3 columns responsive |
| `.grid-2` | 1->2 columns responsive |
| `.grid-4` | 1->2->4 columns responsive |
| `.stack` | Vertical flex, gap 1rem |
| `.stack-sm` | Vertical flex, gap 0.5rem |
| `.stack-lg` | Vertical flex, gap 1.5rem |
| `.row` | Horizontal flex + center + gap |
| `.row-between` | Horizontal flex + space-between |
| `.container` | Max 80rem, centered, responsive padding |
| `.container-sm` | Max 56rem, centered |

## Mobile

On screens below 768px, sidebar transforms off-screen. Toggle with `.open` class via JS.
