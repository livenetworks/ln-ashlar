# ln-accordion

Wrapper компонента — слуша `ln-toggle:open` events од деца и ги затвора останатите.
Само еден `ln-toggle` елемент може да биде отворен во исто време.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-accordion` | parent елемент | Креира accordion wrapper |

## Пример

```html
<div data-ln-accordion>
    <div>
        <header><button data-ln-toggle-for="panel1">Section 1</button></header>
        <main id="panel1" data-ln-toggle="open">Content 1</main>
    </div>
    <div>
        <header><button data-ln-toggle-for="panel2">Section 2</button></header>
        <main id="panel2" data-ln-toggle>Content 2</main>
    </div>
    <div>
        <header><button data-ln-toggle-for="panel3">Section 3</button></header>
        <main id="panel3" data-ln-toggle>Content 3</main>
    </div>
</div>
```

Кога се отвора `panel2`, автоматски се затвора `panel1` (и обратно).

## Зависности

Зависи од `ln-toggle` — accordion слуша `ln-toggle:open` events кои ги емитира `ln-toggle`.

## API

```javascript
// Constructor (рачна иницијализација)
window.lnAccordion(document.body);
```

Accordion нема instance методи — неговата работа е само да ги координира `ln-toggle` децата.
