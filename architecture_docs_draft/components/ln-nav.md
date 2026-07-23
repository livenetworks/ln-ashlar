# 🧭 ln-nav

> **Класификација:** 🟢 Едноставна компонента / UI Навигација (Layer 1 - UI Navigation)  
> **Изворен код:** [`js/ln-nav/src/ln-nav.js`](../../js/ln-nav/src/ln-nav.js)

---

## 1. Заднинско дејство и одговорност

`ln-nav` е едноставна помошна компонента која овозможува автоматско означување на активните линкови во навигациските менија врз основа на тековната URL патека (`pathname`) на прелистувачот.

*   **Главна Одговорност:** Ги пребарува сите `<a>` елементи внатре во навигацискиот контејнер, ја споредува нивната `href` вредност со тековната патека и ја додава дефинираната CSS класа за активност на оние кои се совпаѓаат, истовремено поставувајќи соодветни пристапни (ARIA) атрибути.
*   **Детекција на SPA рутирање (History Patching):** Бидејќи стандардниот настан `popstate` не реагира на програмски измени преку `history.pushState` (кои често се користат кај SPA рутери како `ln-router`), `ln-nav` користи заеднички механизам на пресретнување преку патчување на нативниот `history.pushState` метод на прелистувачот за автоматско пресметување на активните рути.
*   **Динамичко набљудување (Dynamic Mutation Observer):** Секој контејнер користи внатрешен `MutationObserver` кој континуирано ја следи неговата DOM структура. Доколку во менито динамички се додадат или отстранат нови линкови (на пр. при SPA транзиции или асинхроно вчитани подменија), тие веднаш се процесираат и ја добиваат соодветната состојба.
*   **Реактивност на Атрибути:** Поддржува динамичко менување на класата за активност преку `data-ln-nav` или промена на начинот на совпаѓање преку `data-ln-nav-exact` со целосна синхронизација во реално време (Attribute Bridge).

> [!IMPORTANT]
> **Што `ln-nav` НЕ прави (Ортогоналност):**
> * **НЕ управува со рутирање** — компонентата не врши вчитување страници, пресретнување кликови за SPA транзиции или модификација на URL-то на прелистувачот (тоа е задача на [ln-router](./ln-router.md)).
> * **НЕ дефинира визуелен изглед** — не содржи тврдо-кодирани CSS стилови за навигација туку само менаџира класи и пристапни состојби.
> * **НЕ ги зачувува состојбите во своја посебна база** — состојбата е целосно изведена од тековната URL патека (`window.location.pathname`).

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

Со цел да се зачува принципот на **Separation of Concerns**, визуелното стилизирање се врши строго преку CSS, додека JavaScript логиката реагира исклучиво на функционалните `data-ln-*` атрибути.

Изворниот код на компонентата е достапен во [js/ln-nav/src/ln-nav.js](../../js/ln-nav/src/ln-nav.js).

### 2.1. Стандардно мени (со префикс-совпаѓање за подпатеки)

Линковите што се совпаѓаат со тековната патека или се нејзин родител ќе бидат означени. На пример, ако сме на `/posts/123`, линкот кон `/posts` ќе биде означен како активен.

```html
<nav data-ln-nav="is-active" id="main-navigation">
    <ul>
        <li><a href="/">Почетна</a></li>
        <li><a href="/posts">Статии</a></li>
        <li><a href="/about">За нас</a></li>
    </ul>
</nav>
```

### 2.2. Мени со строго совпаѓање (exact matching)

Кога се користи атрибутот `data-ln-nav-exact`, префикс-совпаѓањето се оневозможува. Линковите ќе се активираат само ако нивната патека целосно се совпаѓа со тековната URL патека.

```html
<nav data-ln-nav="active-tab" data-ln-nav-exact id="settings-tabs">
    <a href="/settings">Генерално</a>
    <a href="/settings/security">Безбедност</a>
</nav>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

### 3.1. Атрибути

| Атрибут | Тип | Стандардна вредност | Опис |
| :--- | :--- | :--- | :--- |
| `data-ln-nav` | `String` | (Задолжителен) | Ја активира компонентата на контејнерот и ја дефинира CSS класата што ќе се додели на активните линкови (пр. `is-active`, `active`). |
| `data-ln-nav-exact` | `Flag` | (Нема) | Го исклучува родителското префикс-совпаѓање. Само линкови со точна еднаквост на патеката ќе бидат активни. |

### 3.2. Настани (Events API)

Компонентата е целосно интегрирана со системот на настани во `ln-ashlar`:

| Настан | Насока | Опис | Детали (`event.detail`) |
| :--- | :--- | :--- | :--- |
| `ln-nav:before-update` | Диспачиран (Cancelable) | Се пушта пред да започне проверката и означувањето на линковите. Доколку се откаже, промените не се применуваат. | `{ target: HTMLElement }` |
| `ln-nav:update` | Диспачиран (Bubbling) | Се пушта откако сите линкови се успешно ажурирани и означени со соодветните класи и ARIA атрибути. | `{ target: HTMLElement }` |
| `ln-nav:destroyed` | Диспачиран (Bubbling) | Се пушта кога компонентата се уништува при отстранување на елементот од DOM дрвото. | `{ target: HTMLElement }` |

---

## 4. CSS Стилизирање и Поведенски Концепт

Кога ќе детектира активен линк, компонентата ја додава конфигурираната класа и му доделува нативен пристапен атрибут `aria-current="page"`.

### SCSS стилови за активен линк во менито

```scss
nav[data-ln-nav] {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    a {
        color: var(--color-text-muted, #64748b);
        text-decoration: none;
        padding: 0.5rem 1rem;
        border-radius: var(--border-radius-md, 4px);
        transition: color 0.2s, background-color 0.2s;
        
        // Стил за активната класа дефинирана во атрибутот (на пр. .is-active)
        &.is-active {
            color: var(--color-primary, #3b82f6);
            background-color: var(--color-primary-light, #eff6ff);
            font-weight: 600;
        }
    }
}
```

---

## 5. Пристапност (ARIA) и Чести Грешки

### 5.1. ARIA Поддршка
*   **Пристапност:** Се користи атрибутот `aria-current="page"` на активниот линк. Ова им овозможува на екранските читачи експлицитно да му соопштат на корисникот на која страница се наоѓа во менито. Кога страницата ќе се промени и линкот ќе го изгуби активниот статус, атрибутот се отстранува автоматски.

### 5.2. Чести Грешки и Анти-Патерни (Common Pitfalls)
*   **Употреба на апсолутни URL адреси од друг домен:** Доколку во менито користите линкови од друг домен (на пр. `https://external.com/posts`), тие автоматски се филтрираат од страна на `ln-nav` со цел да се спречи лажно означување на надворешни ресурси.
*   **Недодавање на `data-ln-nav-exact` кај линкот за почетна страница `/`:** Доколку се овозможи префикс совпаѓање на `/`, таа ќе се совпаѓа со секоја URL патека, па затоа `ln-nav` има заштитен механизам кој оневозможува совпаѓање на `/` како родителски префикс. Сепак, препорачливо е експлицитно користење на exact совпаѓање каде што е потребно.
*   **Филтрирање на лажни / не-рутабилни линкови:** Линкови со `href="#"`, `href="javascript:void(0)"` или протоколи како `mailto:`, `tel:` автоматски се прескокнуваат од компонентата и на нив не им се додава активната состојба.

---

## 6. Дијаграм на Текот и Животен Циклус

Следниот дијаграм на текот ја илустрира интеграцијата меѓу промената на URL патеката на прелистувачот, настаните и реактивноста на `ln-nav`:

```mermaid
sequenceDiagram
    participant Browser as Browser URL
    participant Nav as nav[data-ln-nav]
    participant NavJS as ln-nav JS
    participant Links as a Elements

    Note over Nav, NavJS: Component Lifecycle Initialization
    Nav->>NavJS: Instance registration via registerComponent
    NavJS->>NavJS: Monkey-patch history.pushState (once)
    NavJS->>NavJS: Bind popstate window listener
    NavJS->>NavJS: Initialize MutationObserver on child changes
    NavJS->>Nav: Dispatch "ln-nav:before-update" (not cancelled)
    NavJS->>Links: _normalizeUrl & score elements
    Links-->>NavJS: Link match check
    NavJS->>Links: add active class & set aria-current="page"
    NavJS->>Nav: Dispatch "ln-nav:update"

    Note over Browser, NavJS: URL Route Transition (SPA Click / History back)
    Browser->>NavJS: pushState / popstate triggers
    NavJS->>Nav: Dispatch "ln-nav:before-update"
    NavJS->>Links: update class styling and ARIA states
    NavJS->>Nav: Dispatch "ln-nav:update"

    Note over Nav, NavJS: Teardown
    Nav->>NavJS: Node removed from DOM
    NavJS->>NavJS: Observer disconnects & remove listeners
    NavJS->>Nav: Dispatch "ln-nav:destroyed"
```

---

## 7. Поврзани Компоненти

*   **[ln-router](./ln-router.md)**: SPA рутерот кој при интеракција го менува URL-то преку `history.pushState`, активирајќи ги ре-пресметките на `ln-nav`.
*   **[ln-ajax](./ln-ajax.md)**: Компонента за асинхроно вчитување на содржини што ја менува DOM структурата, на што реагира внатрешниот `MutationObserver` на `ln-nav`.
