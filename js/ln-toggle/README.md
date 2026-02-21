# ln-toggle

Генеричка toggle компонента — додава/тргни `open` класа на елемент.
CSS на елементот ја дефинира анимацијата. Работи за sidebar, collapsible секции, dropdown — било што.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-toggle` | целен елемент | Креира инстанца, почнува затворен |
| `data-ln-toggle="open"` | целен елемент | Почнува отворен (добива `.open` класа) |
| `data-ln-toggle-for="id"` | копче | Реферира на целниот елемент по ID |
| `data-ln-toggle-action="open\|close"` | копче | Експлицитна акција (default: toggle) |

## API

```javascript
// Instance API (на DOM елементот)
var el = document.getElementById('my-element');
el.lnToggle.open();
el.lnToggle.close();
el.lnToggle.toggle();
el.lnToggle.isOpen;  // boolean

// Constructor (рачна иницијализација на нов DOM)
window.lnToggle(document.body);
```

## Events

| Event | Bubbles | Detail |
|-------|---------|--------|
| `ln-toggle:open` | да | `{ target: HTMLElement }` |
| `ln-toggle:close` | да | `{ target: HTMLElement }` |

```javascript
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Отворен:', e.detail.target.id);
});
```

## Примери

### Sidebar

```html
<aside id="sidebar-left" class="sidebar open" data-ln-toggle="open">
    <button data-ln-toggle-for="sidebar-left" data-ln-toggle-action="close">&times;</button>
    <nav>...</nav>
</aside>

<button data-ln-toggle-for="sidebar-left">☰</button>
```

CSS за sidebar (во `_app-layout.scss`):
```scss
.sidebar {
    transform: translateX(-100%);
    @include transition;
    &.open { transform: translateX(0); }
}
```

### Collapsible секција

```html
<button data-ln-toggle-for="section1">▼</button>
<main id="section1" data-ln-toggle="open">
    Content here
</main>
```

CSS за collapse (во проект SCSS):
```scss
#section1 {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
    &.open { max-height: 100vh; }
}
```

### Програмски

```javascript
document.getElementById('sidebar-left').lnToggle.open();
document.getElementById('sidebar-left').lnToggle.close();

document.addEventListener('ln-toggle:close', function (e) {
    if (e.detail.target.id === 'sidebar-left') {
        console.log('Sidebar затворен');
    }
});
```
