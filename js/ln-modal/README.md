# ln-modal

Modal dialog компонента — overlay со содржина (header/main/footer).
Отвара/затвара модал по ID. ESC затвара сите отворени модали. Body scroll се блокира кога модал е отворен.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-modal="modalId"` | trigger копче/линк | Кликот го toggle-ува модалот со тој ID |
| `data-ln-modal-close` | копче внатре во модал | Затвара го родителскиот модал |

## CSS класи

| Класа | Опис |
|-------|------|
| `.ln-modal` | Overlay контејнер (мора да има `id`) |
| `.ln-modal--open` | Отворен модал (додава ја JS) |
| `.ln-modal__content` | Внатрешен контејнер за содржина |
| `.ln-modal__content--sm` | Мал модал (max-width: 28rem) |
| `.ln-modal__content--md` | Среден модал (max-width: 32rem) |
| `.ln-modal__content--lg` | Голем модал (max-width: 42rem) |
| `.ln-modal__content--xl` | Екстра голем модал (max-width: 48rem) |

## API

```javascript
window.lnModal.open('my-modal');
window.lnModal.close('my-modal');
window.lnModal.toggle('my-modal');
```

## Events

Сите настани се dispatch-уваат на самиот модал елемент и bubble-аат нагоре.

| Настан | Cancelable | Кога | `detail` |
|--------|-----------|------|----------|
| `ln-modal:before-open` | ✅ | Пред отварање (може да се откаже) | `{ modalId, target }` |
| `ln-modal:open` | ❌ | Модалот се отвори | `{ modalId, target }` |
| `ln-modal:before-close` | ✅ | Пред затварање (може да се откаже) | `{ modalId, target }` |
| `ln-modal:close` | ❌ | Модалот се затвори | `{ modalId, target }` |

```javascript
// Откажи отварање условно
document.addEventListener('ln-modal:before-open', function(e) {
    if (e.detail.modalId === 'confirm-dialog' && !formIsValid()) {
        e.preventDefault(); // модалот нема да се отвори
    }
});

// Спречи затварање (unsaved changes)
document.getElementById('edit-modal').addEventListener('ln-modal:before-close', function(e) {
    if (hasUnsavedChanges()) {
        e.preventDefault();
        showConfirmation();
    }
});

document.addEventListener('ln-modal:open', function(e) {
    console.log('Отворен модал:', e.detail.modalId);
});

document.addEventListener('ln-modal:close', function(e) {
    if (e.detail.modalId === 'confirm-dialog') {
        // reset форма, исчисти state итн.
    }
});
```

## Однесување

- ESC тастер затвара сите отворени модали
- `body.ln-modal-open` се додава кога барем еден модал е отворен (спречува scroll)
- Backdrop: полу-транспарентен темен overlay со blur
- Анимација: slideIn од горе (0.3s ease)
- Ctrl/Cmd+Click и middle-click на trigger не го отвараат модалот (дозволува open in new tab)

## HTML структура

```html
<!-- Trigger копче -->
<button data-ln-modal="my-modal">Отвори</button>

<!-- Модал -->
<div id="my-modal" class="ln-modal">
    <div class="ln-modal__content">
        <header>
            <h3>Наслов</h3>
            <button class="ln-icon-close" data-ln-modal-close></button>
        </header>
        <main>
            <p>Содржина на модалот...</p>
        </main>
        <footer>
            <button data-ln-modal-close>Откажи</button>
            <button class="btn-primary">Зачувај</button>
        </footer>
    </div>
</div>
```

> **Иконки:** Close копчето користи `.ln-icon-close` класа — НИКОГАШ `&times;` карактер.
> `@include close-button` е веќе аплициран на `button[data-ln-modal-close]` во `ln-modal.scss`.

## Големини

```html
<div class="ln-modal__content ln-modal__content--sm">...</div>
<div class="ln-modal__content ln-modal__content--lg">...</div>
```
