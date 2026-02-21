# ln-ajax

AJAX навигација компонента — линкови и форми се праќаат асинхроно, одговорот го ажурира DOM-от без full page reload.
Поддржува browser history (pushState), CSRF token, и JSON response protocol.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-ajax` | контејнер, `<a>`, или `<form>` | Активира AJAX на елементот и сите деца |
| `data-ln-ajax="false"` | `<a>` или `<form>` | Исклучи AJAX за конкретен елемент внатре во AJAX контејнер |

## Однесување

### Линкови (`<a>`)
- Клик прави GET AJAX request на `href`
- Ctrl/Cmd+Click и middle-click работат нормално (open in new tab)
- Линкови со `#` во href се прескокнуваат
- По успешен одговор, URL се додава во browser history (pushState)

### Форми (`<form>`)
- Submit прави AJAX request (method и action од формата)
- FormData автоматски се креира од формата
- Копчињата се disable-ираат за време на request
- GET форми: параметрите одат во URL query string + pushState
- POST/PUT/DELETE: body е FormData

### CSS класа за loading
- `.ln-ajax--loading` се додава на елементот за време на request

## Серверски JSON Response Protocol

```json
{
    "title": "Нова страница",
    "content": {
        "main-content": "<h1>Содржина</h1><p>Нов HTML</p>",
        "sidebar-nav": "<ul><li>Нова навигација</li></ul>"
    },
    "message": {
        "type": "success",
        "title": "Зачувано",
        "body": "Промените се зачувани.",
        "data": {}
    }
}
```

| Поле | Опис |
|------|------|
| `title` | Ажурирај `document.title` |
| `content` | Објект: клуч = ID на елемент, вредност = нов innerHTML |
| `message` | Toast порака (се прикажува преку `lnToast.enqueue`) |

## Headers

Секој AJAX request ги испраќа:
- `X-Requested-With: XMLHttpRequest`
- `Accept: application/json`
- `X-CSRF-TOKEN: {token}` (од `<meta name="csrf-token">`)

## HTML структура

```html
<!-- AJAX контејнер — сите линкови и форми внатре се AJAX -->
<div data-ln-ajax>
    <nav>
        <a href="/users">Корисници</a>
        <a href="/settings">Поставки</a>
        <a href="/external" data-ln-ajax="false">Надворешен (без AJAX)</a>
    </nav>

    <form method="POST" action="/users/create">
        <input name="name" type="text">
        <button type="submit">Зачувај</button>
    </form>
</div>

<!-- Или директно на елемент -->
<a href="/dashboard" data-ln-ajax>Dashboard</a>
<form data-ln-ajax method="POST" action="/api/save">...</form>
```

## API

```javascript
// Рачна иницијализација на нов AJAX контејнер
window.lnAjax(document.getElementById('new-content'));
```

## Програмски

```javascript
// CSS loading индикатор
.ln-ajax--loading {
    opacity: 0.5;
    pointer-events: none;
}
```
