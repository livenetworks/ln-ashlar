# 📝 ln-fill
> **Класификација:** 🟢 Едноставна компонента / Глобално однесување (Layer 1 - Form/Display Binder)

---

## 1. Заднинско дејство и одговорност
`ln-fill` не е класична изолирана DOM компонента, туку претставува декларативно глобално однесување (event delegation behavior) за брзо пополнување и чистење на форми и прикажувачки контејнери (`[data-ln-fillable]`).

*   **Главна Одговорност:** Слуша кликови на елементи со `data-ln-fill-form="formId"`, ги собира нивните `data-ln-fill-*` атрибути, ги мапира во camelCase објект (рекорд) и го испраќа тој рекорд до целната форма или контејнер преку CustomEvent-от `ln-fill`.
*   **Слободен проток на кликови:** Компонентата намерно НЕ извршува `e.preventDefault()`. Ова овозможува истата интеракција (клик) истовремено да отвори дијалог (преку `data-ln-modal-for` од `ln-modal`) и да го пополни со податоци во еден чекор. Кликовите со `Ctrl`/`Meta` модификатор и средното глувче се игнорираат (резервирани за нативно однесување на прелистувачот).
*   **Емитент кон Форми и Прикази:** `ln-fill` го повикува `window.lnCore.lnFill(container, record)`, кој пак испраќа CustomEvent `ln-fill` до самата цел и сите нејзини потомци што соодветствуваат на `[data-ln-form]` или `[data-ln-fillable]`.
*   **Декларативни Сврзувања (Bindings):** За прегледи (кои не се форми), постои вграден глобален слушател кој при примен `ln-fill` настан автоматски го повикува `fill()` помошникот:
    *   `data-ln-field="prop"`: Го пополнува `textContent` со вредноста од рекордот.
    *   `data-ln-attr="attr:prop, attr2:prop2"`: Го ажурира соодветниот HTML атрибут (`setAttribute`).
    *   `data-ln-show="prop"`: Ја контролира видливоста преку класата `hidden` (`classList.toggle('hidden', !value)`).
    *   `data-ln-class="className:prop"`: Додава/вади CSS класи во зависност од вистинитоста на вредноста во објектот.

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

```html
<!-- Иницирање пополнување на форма при клик (на пр. во табела со акции) -->
<button 
    data-ln-fill-form="user-edit-form"
    data-ln-fill-id="142"
    data-ln-fill-name="Петар Петровски"
    data-ln-fill-role="admin"
    data-ln-fill-is-active="true"
    data-ln-modal-for="user-modal">
    Уреди Корисник
</button>

<!-- Целна форма која го слуша пополнувањето -->
<form id="user-edit-form" data-ln-form action="/api/users/update" method="post">
    <input type="hidden" name="id" />
    <input type="text" name="name" />
    <select name="role">
        <option value="admin">Администратор</option>
        <option value="user">Корисник</option>
    </select>
</form>
```

```html
<!-- Пополнување на обичен информативен контејнер (Display Fillable) -->
<div id="user-profile-preview" data-ln-fillable>
    <!-- data-ln-field го презема textContent -->
    <h3 data-ln-field="name">--</h3>
    
    <!-- data-ln-attr за динамички атрибути (пр. src за слика) -->
    <img data-ln-attr="src:avatarUrl, alt:name" src="" alt="" />
    
    <!-- data-ln-show за контролирање на приказ -->
    <span class="badge" data-ln-show="isActive">Активен</span>
</div>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

| Атрибут | Тип | Опис |
| :--- | :--- | :--- |
| `data-ln-fill-form` | `String` | ID на целната форма или контејнер што ќе биде пополнет при клик. |
| `data-ln-fill-*` | `String` | Било кој атрибут со овој префикс (пр. `data-ln-fill-first-name`) ќе биде изваден и испратен како својство на рекордот во camelCase формат (пр. `firstName`). |
| `data-ln-fillable` | `Flag` | Го означува контејнерот како цел за приказ на податоци. Го слуша глобалниот `ln-fill` настан. |
| `data-ln-field` | `String` | Се користи внатре во `data-ln-fillable` за мапирање на текстуална содржина. |
| `data-ln-attr` | `String` | Формат `attr:prop, attr2:prop2` за мапирање вредности во HTML атрибути. |
| `data-ln-show` | `String` | Својство од рекордот; се применува само ако клучот постои во рекордот — falsy вредност додава класа `hidden`, truthy ја вади. Клуч што фали во рекордот го остава елементот недопрен. |
| `data-ln-class` | `String` | Формат `className:prop` за динамичко активирање класи врз основа на вредност. |

### DOM Барања и Настани (Слуша и Емитува)
*   **`ln-fill`** (CustomEvent): Се емитува од `lnFill` функцијата кон целниот елемент (ако одговара на `[data-ln-form]` или `[data-ln-fillable]`) и кон сите такви потомци. Неговиот `event.detail` го содржи рекордот со податоци.
*   **`detail = null`** (празен тригер, без `data-ln-fill-*` вредности): формата се ресетира нативно (`form.reset()`), а кај display контејнерите се празни само `textContent` на `[data-ln-field]` полињата — `data-ln-attr`, `data-ln-show` и `data-ln-class` состојбите остануваат недопрени.
*   **Прескокнување на вредности:** При пополнување со рекорд, `null`/`undefined` вредности за поединечни својства се прескокнуваат — постојната содржина на тоа поле се зачувува.

---

## 4. CSS Стилизирање и Поведенски Концепт
Како логичко однесување, `ln-fill` не носи свои визуелни стилови. Единствениот CSS концепт на кој се потпира е класата **`.hidden`** (`display: none;`), која ја вклучува/исклучува кај елементите означени со `data-ln-show`. Кај `data-ln-class` се вклучуваат/исклучуваат произволни класи наведени во самиот атрибут (форматот `className:prop`), не `.hidden`.

---

## 5. Пристапност (ARIA) и Чести Грешки
*   **Пристапност:** Бидејќи `ln-fill` го менува DOM-от динамички (текстови, атрибути), доколку овие промени се од суштинско значење за корисникот на екрански читач, размислете за додавање на соодветни `aria-live="polite"` региони околу целните контејнери.
*   **Честа грешка 1:** Користење на резервирани клучни зборови како `data-ln-fill-form` или `data-ln-fill-store` за пренос на податоци. Овие се резервирани за инфраструктурни цели и нема да се појават во крајниот објект.
*   **Честа грешка 2:** Несовпаѓање меѓу името на атрибутот и името во дестинацијата. Имајте предвид дека `data-ln-fill-user-id` станува `userId` во JS, па целното поле во формата мора да има `name="userId"` (или соодветниот `data-ln-field="userId"`). Ако името на полето не може да се совпадне со клучот на рекордот, полето може да декларира `data-ln-fill-as="userId"` — тој клуч има предност пред `name` при мапирањето.
*   **Честа грешка 3:** Целна форма без `data-ln-form` атрибут. Fan-out диспечерот испраќа `ln-fill` само на елементи што одговараат на `[data-ln-form]` или `[data-ln-fillable]` — ако формата го нема атрибутот, настанот воопшто не се испраќа на неа (освен на евентуални fillable потомци) и кликот поминува без ефект.

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    participant User
    participant Trigger as Button[data-ln-fill-form]
    participant FillJS as ln-fill Global listener
    participant Form as Form[id="formId"]
    participant Core as ln-core (helpers)

    User->>Trigger: Click
    Trigger->>FillJS: Click event bubbles to document
    
    Note over FillJS: Read data-ln-fill-* attributes
    FillJS->>FillJS: Construct camelCased record object
    
    FillJS->>Core: call window.lnCore.lnFill(Form, record)
    
    Core->>Form: dispatch CustomEvent('ln-fill', { detail: record })
    
    alt Form handles ln-fill
        Form->>Form: populate form fields with values
    else Target is data-ln-fillable display container
        Core->>Form: fill(target, record)
        Note over Form: Update data-ln-field textContent,<br/>update data-ln-attr attributes,<br/>toggle data-ln-show visibility
    end
```

---

## 7. Поврзани Компоненти
*   **`ln-form`**: Најчестата дестинација за `ln-fill`. Ја пресретнува вредноста и ги пополнува инпутите соодветно.
*   **`ln-modal-fill`**: Координатор кој овозможува deep-linking и автоматско активирање на `ln-fill` преку URL хаш промени.
*   **`ln-modal`**: Често се наоѓа на истиот тригер (`data-ln-modal-for`) за да се овозможи истовремено отворање и пополнување на дијалог прозорец.
