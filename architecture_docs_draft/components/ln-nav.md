# 🧭 ln-nav
> **Класификација:** 🟢 Едноставна компонента (Layer 1 - UI Navigation)

---

## 1. Заднинско дејство и одговорност
`ln-nav` е едноставна помошна компонента која овозможува автоматско означување на активните линкови во навигациските менија врз основа на тековната URL патека (`pathname`).

*   **Главна Одговорност:** Ги пребарува сите `<a>` елементи внатре во навигацискиот контејнер, ја споредува нивната `href` вредност со тековната патека на прелистувачот и ја додава дефинираната класа за активност на оние кои се совпаѓаат.
*   **Детекција на SPA рутирање (History Patching):** Бидејќи стандардниот настан `popstate` не реагира на програмски измени преку `history.pushState` (кои често се користат кај SPA рутерите), `ln-nav` го патчува нативниот `pushState` метод на прелистувачот за да може да ги пресретне промените на рутата и навремено да ги ажурира менијата.
*   **Динамичко набљудување (Dynamic Mutation Observer):** Контејнерот користи `MutationObserver` кој континуирано го следи внатрешното DOM дрво. Доколку во менито динамички се додадат или отстранат нови линкови (на пр. при вчитување на динамички подмениа), тие веднаш се регистрираат и ја добиваат соодветната состојба.
*   **Парент-Префикс совпаѓање:** Поддржува препознавање на активност кај родителски патеки (на пр. линкот со патека `/posts` ќе остане активен и кога корисникот е на подпатека `/posts/new`), освен ако не е експлицитно наложено строго совпаѓање.

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

```html
<!-- Стандардно мени (со префикс-совпаѓање за подпатеки) -->
<nav data-ln-nav="is-active" id="main-navigation">
    <ul>
        <li><a href="/">Почетна</a></li>
        <li><a href="/posts">Статии</a></li> <!-- ќе биде активно и на /posts/123 -->
        <li><a href="/about">За нас</a></li>
    </ul>
</nav>

<!-- Мени со строго совпаѓање (exact matching) -->
<nav data-ln-nav="active-tab" data-ln-nav-exact id="settings-tabs">
    <a href="/settings">Генерално</a>
    <a href="/settings/security">Безбедност</a> <!-- нема да се активира на /settings -->
</nav>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

| Атрибут | Тип | Опис |
| :--- | :--- | :--- |
| `data-ln-nav` | `String` | Го активира компонентот врз навигацискиот контејнер. Вредноста ја дефинира CSS класата за активност која ќе биде додадена на линковите (пр. `is-active`, `active`). |
| `data-ln-nav-exact` | `Flag` | Го оневозможува префикс-совпаѓањето. Линковите ќе бидат означени како активни само при целосно совпаѓање на нивната патека со тековната патека. |

### Настани
Компонентата нема свои CustomEvents. Таа работи исклучиво преку набљудување на нативните `popstate` настани на прелистувачот и промени во DOM структурата.

---

## 4. CSS Стилизирање и Поведенски Концепт
Кога ќе детектира активен линк, компонентата ја додава конфигурираната класа и му доделува нативен пристапен атрибут `aria-current="page"`.

```scss
// SCSS стилови за активен линк во менито
nav[data-ln-nav] {
    a {
        color: var(--color-text-muted, #64748b);
        text-decoration: none;
        transition: color 0.2s, border-color 0.2s;
        
        // Стил за активната класа дефинирана во атрибутот (на пр. .is-active)
        &.is-active {
            color: var(--color-primary, #3b82f6);
            font-weight: 600;
            border-bottom: 2px solid var(--color-primary);
        }
    }
}
```

---

## 5. Пристапност (ARIA) и Чести Грешки
*   **Пристапност:** Задолжително се користи атрибутот `aria-current="page"` на активниот линк. Ова им овозможува на екранските читачи експлицитно да му соопштат на корисникот на која страница се наоѓа во менито.
*   **Честа грешка 1:** Употреба на апсолутни URL адреси од друг домен во менито (пр. `https://external.com/posts`). Ваквите линкови никогаш нема да бидат означени како активни. Доколку се користат апсолутни URL патеки во рамки на сопствениот сајт, `ln-nav` ги нормализира и правилно ги споредува.
*   **Честа грешка 2:** Недодавање на `data-ln-nav-exact` кај линкот за почетна страница `/`. Доколку се изостави ова знаменце, линкот кон почетната страница ќе биде означен како активен на сите останати страници (бидејќи сите патеки започнуваат со `/`).

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    participant Browser as Browser URL
    participant Nav as nav[data-ln-nav]
    participant NavJS as ln-nav JS
    participant Links as a Elements

    Nav->>NavJS: Component Mount
    NavJS->>NavJS: Bind window 'popstate' listener
    NavJS->>NavJS: Monkey-patch history.pushState
    NavJS->>NavJS: Init internal MutationObserver (childList)
    NavJS->>NavJS: _updateActiveState() (Initial render)
    
    loop for each link
        alt matches current path (exact or prefix)
            NavJS->>Links: add activeClass & set aria-current="page"
        else does not match
            NavJS->>Links: remove activeClass & remove aria-current
        end
    end

    Note over Browser, NavJS: Route Transition (SPA click / Back Button)
    Browser->>NavJS: popstate / pushState fired
    NavJS->>NavJS: Trigger updateHandler
    NavJS->>NavJS: _updateActiveState() (Update classes)
```

---

## 7. Поврзани Компоненти
*   **`ln-router`**: SPA рутерот на кој се потпира `ln-nav` за детекција на промени на страници без целосно освежување на прелистувачот.
