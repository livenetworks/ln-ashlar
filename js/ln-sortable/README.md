# ln-sortable

Drag & drop reorder компонента — преместува елементи во листа со Pointer Events API.
Работи со touch + mouse. Компонентата само го реорганизира DOM-от — data model sync е одговорност на consumer-от (преку events).

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-sortable` | контејнер (`<ol>`, `<ul>`, итн.) | Креира инстанца. Sortable items = директни деца. |
| `data-ln-sortable-handle` | елемент внатре во дете | Drag handle. Ако нема — целото дете е draggable. |

## API

```javascript
// Instance API (на DOM елементот)
var list = document.querySelector('[data-ln-sortable]');
list.lnSortable.enable();
list.lnSortable.disable();
list.lnSortable.isEnabled;  // boolean

// Constructor — само за нестандардни случаи (Shadow DOM, iframe)
// За AJAX/динамички DOM: MutationObserver автоматски иницијализира
window.lnSortable(container);
```

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-sortable:before-drag` | да | **да** | `{ item: HTMLElement, index: number }` |
| `ln-sortable:drag-start` | да | не | `{ item: HTMLElement, index: number }` |
| `ln-sortable:reordered` | да | не | `{ item: HTMLElement, oldIndex: number, newIndex: number }` |
| `ln-sortable:request-enable` | не | не | — |
| `ln-sortable:request-disable` | не | не | — |

```javascript
// Слушај реорганизирање
document.addEventListener('ln-sortable:reordered', function (e) {
    console.log('Преместено од', e.detail.oldIndex, 'на', e.detail.newIndex);
});

// Откажи drag условно
document.addEventListener('ln-sortable:before-drag', function (e) {
    if (listIsLocked) e.preventDefault();
});

// Побарај disable (пр. додека се зачувува)
list.dispatchEvent(new CustomEvent('ln-sortable:request-disable'));
```

`ln-sortable:request-enable` и `ln-sortable:request-disable` се **incoming** events — надворешен код ги dispatcha на sortable елементот.

## CSS класи

Компонентата ги додава/тргни овие класи. **Не испорачува CSS** — consumer-от ги стилизира.

| Класа | На | Кога |
|-------|----|------|
| `ln-sortable--active` | контејнер | Додека трае drag |
| `ln-sortable--dragging` | влечен елемент | Додека се влече |
| `ln-sortable--drop-before` | целен елемент | Покажувач во горна половина |
| `ln-sortable--drop-after` | целен елемент | Покажувач во долна половина |

Пример CSS:
```css
.my-list > li.ln-sortable--dragging {
    opacity: 0.4;
}
.my-list > li.ln-sortable--drop-before {
    box-shadow: inset 0 2px 0 0 var(--accent);
}
.my-list > li.ln-sortable--drop-after {
    box-shadow: inset 0 -2px 0 0 var(--accent);
}
```

> **Важно:** Handle елементот треба `touch-action: none` и `cursor: grab` во CSS за правилно однесување на touch уреди.

## Примери

### Листа со drag handle

```html
<ol data-ln-sortable>
    <li>
        <span data-ln-sortable-handle>⋮⋮</span>
        Прва ставка
    </li>
    <li>
        <span data-ln-sortable-handle>⋮⋮</span>
        Втора ставка
    </li>
</ol>
```

### Листа без handle (целото дете е draggable)

```html
<ul data-ln-sortable>
    <li>Влечи ме</li>
    <li>И мене</li>
</ul>
```

### Програмски

```javascript
// Disable додека се процесира
list.lnSortable.disable();
saveOrder().then(function () {
    list.lnSortable.enable();
});

// Или преку events
list.dispatchEvent(new CustomEvent('ln-sortable:request-disable'));
```
