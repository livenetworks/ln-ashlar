# ln-nav

Active link highlighter — автоматски го означува активниот линк во навигација врз основа на тековниот URL.
Работи со `pushState` (ln-ajax) и `popstate` (browser back/forward).

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-nav="active"` | `<nav>` елемент | Активира nav highlighter, вредноста е CSS класата за активен линк |

## Однесување

- При init, ги скенира сите `<a>` внатре во навигацијата
- Го споредува `href` на секој линк со `window.location.pathname`
- Додава CSS класа (дефинирана во `data-ln-nav`) на совпаѓачки линкови
- **Exact match**: `/users` совпаѓа со `/users`
- **Parent match**: `/users` совпаѓа и со `/users/123` (prefix match)
- **Root (`/`)**: не се третира како parent — точно совпаѓање само
- Trailing slash се нормализира (`/users/` == `/users`)
- При `pushState` (ln-ajax навигација) автоматски ги ажурира активните линкови
- При `popstate` (browser back/forward) исто ги ажурира
- Динамички додадени линкови (MutationObserver) автоматски се обработуваат

## HTML структура

```html
<nav data-ln-nav="active">
    <a href="/dashboard">Dashboard</a>
    <a href="/users">Корисници</a>
    <a href="/settings">Поставки</a>
</nav>
```

Ако URL е `/users/42`, линкот `/users` ќе добие класа `active`.

## CSS стилизирање

```scss
nav a {
    @include text-secondary;
    &.active {
        @include text-primary;
        @include font-bold;
        @include bg-secondary;
    }
}
```

## API

```javascript
// Рачна иницијализација
window.lnNav(document.getElementById('sidebar-nav'));
```

## Интеграција со ln-ajax

`ln-nav` се закачува на `history.pushState` за да детектира URL промени од ln-ajax. Override-от е **singleton** — се поставува само еднаш, без разлика колку `[data-ln-nav]` елементи постојат на страната. Не е потребна додатна конфигурација — активниот линк се ажурира по секој AJAX навигација.
