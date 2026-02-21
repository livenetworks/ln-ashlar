# ln-toast

Toast notification компонента — прикажува привремени пораки (success, error, warn, info).
Секој toast има икона, наслов, порака и close копче. Автоматски исчезнува по timeout.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-toast` | контејнер (`<ul>`) | Го означува контејнерот за toast пораки |
| `data-ln-toast-timeout="6000"` | контејнер | Default timeout во ms (default: 6000) |
| `data-ln-toast-max="5"` | контејнер | Максимален број видливи toast-и (default: 5) |
| `data-ln-toast-item` | `<li>` внатре во контејнер | Server-side rendered toast (се хидрира при init) |
| `data-type="success\|error\|warn\|info"` | `<li>` | Тип на SSR toast |
| `data-title="..."` | `<li>` | Наслов на SSR toast (optional) |

## API

```javascript
// Додај toast програмски
lnToast.enqueue({
    type: 'success',           // success | error | warn | info
    title: 'Зачувано',        // optional, default по тип
    message: 'Промените се зачувани.',
    timeout: 6000,             // optional, 0 = не исчезнува
    container: '#my-toasts'    // optional, default = прв [data-ln-toast]
});

// Листа на пораки
lnToast.enqueue({
    type: 'error',
    message: ['Грешка 1', 'Грешка 2']
});

// Laravel validation errors
lnToast.enqueue({
    type: 'error',
    data: { errors: { email: ['Email е задолжителен'], name: ['Име е задолжителен'] } }
});

// Исчисти ги сите toast-и
lnToast.clear();
lnToast.clear('#my-toasts');

// Рачна иницијализација
lnToast(document.body);
```

## Events

| Event | На | Опис |
|-------|-----|------|
| `ln-toast:enqueue` | `window` | Enqueue toast преку CustomEvent (decoupled) |

```javascript
// Друга компонента може да испрати toast без директна референца
window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
    detail: { type: 'success', message: 'Готово!' }
}));
```

## Типови

| Тип | Default наслов | Икона |
|-----|---------------|-------|
| `success` | Success | Checkmark |
| `error` | Error | X circle |
| `warn` | Warning | Triangle |
| `info` | Information | Info circle |

## HTML структура

```html
<!-- Контејнер (обично во layout-от, горе десно) -->
<ul data-ln-toast data-ln-toast-timeout="6000" data-ln-toast-max="5"></ul>

<!-- Server-side rendered toast-и (Laravel flash) -->
<ul data-ln-toast>
    <li data-ln-toast-item data-type="success" data-title="Зачувано">
        Промените се зачувани успешно.
    </li>
    <li data-ln-toast-item data-type="error">
        Настана грешка при зачувување.
    </li>
</ul>
```

## Програмски

```javascript
// Од AJAX callback
fetch('/api/save', { method: 'POST', body: data })
    .then(res => res.json())
    .then(data => {
        lnToast.enqueue({ type: 'success', message: data.message });
    })
    .catch(() => {
        lnToast.enqueue({ type: 'error', message: 'Серверска грешка' });
    });
```
