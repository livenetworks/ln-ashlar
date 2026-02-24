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
| `message` | Порака — достапна во `ln-ajax:success` event, проектот одлучува како да ја прикаже |

## Events

Сите настани се dispatch-уваат на елементот кој го иницирал request-от (link или form) и bubble-аат нагоре.

| Настан | Cancelable | Кога | `detail` |
|--------|-----------|------|----------|
| `ln-ajax:before-start` | ✅ | Пред сè (може да откаже request) | `{ method, url }` |
| `ln-ajax:start` | ❌ | По додавање на spinner, пред fetch | `{ method, url }` |
| `ln-ajax:success` | ❌ | По успешен одговор | `{ method, url, data }` |
| `ln-ajax:error` | ❌ | По fetch грешка | `{ method, url, error }` |
| `ln-ajax:complete` | ❌ | По завршување (success или error) | `{ method, url }` |

### Откажување на request

```javascript
// Спречи AJAX за одреден елемент условно
document.addEventListener('ln-ajax:before-start', function(e) {
    if (!userIsAuthenticated()) {
        e.preventDefault(); // request се откажува, нема spinner
        redirectToLogin();
    }
});
```

### Интеграција со ln-toast

`ln-ajax` не знае за `ln-toast`. За приказ на пораки, слушај го `ln-ajax:success` во твојот проект:

```javascript
document.addEventListener('ln-ajax:success', function(e) {
    const message = e.detail.data.message;
    if (message && window.lnToast) {
        window.lnToast.enqueue({
            type: message.type,
            title: message.title,
            message: message.body,
            data: message.data
        });
    }
});
```

### Останати примери

```javascript
// Покажи custom loading индикатор
document.addEventListener('ln-ajax:start', function(e) {
    console.log('Request started:', e.detail.method, e.detail.url);
});

// Обнови компонента по успешен одговор
document.addEventListener('ln-ajax:success', function(e) {
    window.lnSelect && window.lnSelect.reinit();
});

// Глобален error handler
document.addEventListener('ln-ajax:error', function(e) {
    console.error('AJAX failed:', e.detail.url, e.detail.error);
});

// Завршување (секогаш)
document.addEventListener('ln-ajax:complete', function(e) {
    console.log('Request complete:', e.detail.url);
});
```

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
