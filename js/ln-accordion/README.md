# ln-accordion

Wrapper компонента — слуша `ln-toggle:open` events од деца и ги затвора останатите.
Само еден `ln-toggle` елемент може да биде отворен во исто време.

## Атрибути

| Атрибут | На | Опис |
|---------|-----|------|
| `data-ln-accordion` | parent елемент | Креира accordion wrapper |

## Пример

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">Section 1</header>
        <section id="panel1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body">Content 1</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">Section 2</header>
        <section id="panel2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">Content 2</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel3">Section 3</header>
        <section id="panel3" data-ln-toggle class="collapsible">
            <article class="collapsible-body">Content 3</article>
        </section>
    </li>
</ul>
```

> **Семантика:** Collapsible контејнерот е `<section>`, НЕ `<main>` (HTML spec: само 1 `<main>` per page).
> Child-от е `<article>` со `.collapsible-body` класа, НЕ гол `<div>`.

- `ul/li` — accordion е листа на ставки
- `header` е целосно кликабилен trigger (`data-ln-toggle-for`)
- `.collapsible` на парент → grid collapse (padding:0, се затвора до 0)
- `.collapsible-body` на child → overflow:hidden, padding/margins одат тука
- Кога се отвора `panel2`, автоматски се затвора `panel1` (и обратно).

## Events

| Event | Bubbles | Cancelable | Detail |
|-------|---------|------------|--------|
| `ln-accordion:change` | да | не | `{ target: HTMLElement }` |

```javascript
document.addEventListener('ln-accordion:change', function (e) {
    console.log('Активен панел:', e.detail.target.id);
});
```

`ln-accordion:change` се fire-ува на accordion контејнерот кога ќе се отвори панел (по затворањето на браќата).

## Зависности

Accordion е координатор за `ln-toggle` деца. Комуникацијата е само преку events:
- **Слуша**: `ln-toggle:open` (bubbles нагоре од toggle дете)
- **Dispatcha**: `ln-toggle:request-close` на секој sibling toggle (toggle сам одлучува дали да се затвори)

Accordion **НЕ** вика директно toggle API (`el.lnToggle.close()`). Секој toggle самостојно реагира на `request-close`.

## API

```javascript
// Constructor (рачна иницијализација)
window.lnAccordion(document.body);
```

Accordion нема instance методи — неговата работа е само да ги координира `ln-toggle` децата.
