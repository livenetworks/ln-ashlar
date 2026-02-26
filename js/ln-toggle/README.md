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

// Constructor — само за нестандардни случаи (Shadow DOM, iframe)
// За AJAX/динамички DOM: MutationObserver автоматски иницијализира
window.lnToggle(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-toggle:before-open` | да | **да** | `{ target: HTMLElement }` |
| `ln-toggle:open` | да | не | `{ target: HTMLElement }` |
| `ln-toggle:before-close` | да | **да** | `{ target: HTMLElement }` |
| `ln-toggle:close` | да | не | `{ target: HTMLElement }` |
| `ln-toggle:request-close` | не | не | — |

```javascript
// Слушај по отворање
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Отворен:', e.detail.target.id);
});

// Откажи го отворањето условно
document.addEventListener('ln-toggle:before-open', function (e) {
    if (!userHasPermission()) e.preventDefault();
});

// Побарај toggle да се затвори (пр. од accordion координатор)
element.dispatchEvent(new CustomEvent('ln-toggle:request-close'));
```

`ln-toggle:request-close` е **incoming** event — надворешен код го dispatcha на toggle елементот. Toggle слуша на себе и се затвора ако е отворен. Затворањето минува низ нормалниот lifecycle (`before-close` → `close`).

## Примери

### Sidebar

```html
<aside id="sidebar-left" class="sidebar open" data-ln-toggle="open">
    <button class="ln-icon-close" data-ln-toggle-for="sidebar-left" data-ln-toggle-action="close"></button>
    <nav>...</nav>
</aside>

<button class="ln-icon-menu" data-ln-toggle-for="sidebar-left"></button>
```

> **Иконки:** СЕКОГАШ користи `.ln-icon-close` / `.ln-icon-menu` класи.
> НИКОГАШ `&times;`, `☰`, или други Unicode карактери.

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
<header data-ln-toggle-for="section1">Наслов</header>
<section id="section1" data-ln-toggle="open" class="collapsible">
    <article class="collapsible-body">
        Content here
    </article>
</section>
```

- `.collapsible` = парент, padding:0, се затвора до 0
- `.collapsible-body` = child, тука оди padding/margins
- `data-ln-toggle-for` на `<header>` — целиот header е кликабилен trigger

> **Семантика:** Collapsible контејнерот НЕ смее да биде `<main>` — HTML spec дозволува
> само еден `<main>` per page. Користи `<section>` или `<div class="collapsible">`.

CSS за collapse — framework ја обезбедува `.collapsible` класата (grid-template-rows анимација).
За семантичка употреба во проект SCSS:
```scss
#section1              { @include collapsible; }
#section1 > .my-body   { @include collapsible-content; }
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
