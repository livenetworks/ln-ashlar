# 🔗 ln-modal-fill
> **Класификација:** ⚙️ Координатор (Layer 2 - Modal & Form Bridge)

---

## 1. Заднинско дејство и одговорност
`ln-modal-fill` ([изворен код](../../js/ln-modal-fill/src/ln-modal-fill.js)) е координатор на проектот кој служи како мост помеѓу системот за навигација преку хаш кај модалите ([ln-modal](./ln-modal.md) / `hash.js`) и декларативното пополнување форми ([ln-fill](./ln-fill.md)).

*   **Главна Одговорност:** Го слуша глобалниот настан `ln-modal:open` и емитува CustomEvent `ln-fill:request` кон отворениот модал, со цел да побара програмско пополнување или празнење на формите во модалот од страна на `ln-fill`.
*   **Нов Запис (New Mode):** Доколку модалот е отворен преку чист хаш (на пр. `#user-modal`, каде `param` е `null`), тоа означува нов запис. Координаторот испраќа настан `ln-fill:request` со вредност `null` во `detail.id`. Едноставната компонента `ln-fill` го пресретнува ова барање и ја ресетира формата (вклучително и ресетирање на RESTful акциските рути кај `ln-form`).
*   **Уредување Запис (Edit Mode):** Доколку хашот содржи параметар (на пр. `#user-modal:142`, каде `param` е `142`), координаторот испраќа настан `ln-fill:request` со вредност `142` во `detail.id`. Компонентата `ln-fill` го презема барањето, го пребарува DOM дрвото за изворен елемент со соодветно `data-ln-fill-id="142"`, ги собира неговите `data-ln-fill-*` атрибути и врши програмско пополнување.
*   **Двосмисленост (Disambiguation):** Двосмисленоста при пребарување на изворот за уредување е делегирана на `ln-fill`. Доколку постојат повеќе извори со исто ID, `ln-fill` го претпочита оној чиј `data-ln-fill-form` референцира форма која се наоѓа внатре во целниот модал.

---

## 2. Минимален HTML Маркап и Варијанти на Употреба

```html
<!-- Тригер за Креирање (Нов корисник - чист хаш) -->
<a href="#user-modal" class="btn">Креирај Нов Корисник</a>

<!-- Извори на податоци во табела (Уредување - хаш со параметри) -->
<table>
    <tr>
        <td>Петар Петровски</td>
        <td>
            <a href="#user-modal:142" 
               data-ln-fill-id="142"
               data-ln-fill-form="user-form"
               data-ln-fill-name="Петар Петровски"
               data-ln-fill-email="petar@example.com">
               Уреди
            </a>
        </td>
    </tr>
</table>

<!-- Модален Прозорец со Форма -->
<dialog class="ln-modal" id="user-modal" data-ln-modal>
    <form id="user-form" data-ln-form action="api/users">
        <input type="hidden" name="id" />
        <input type="text" name="name" />
        <input type="email" name="email" />
    </form>
</dialog>
```

---

## 3. Декларативен API Договор (Атрибути и Настани)

| Атрибут | Тип | Опис |
| :--- | :--- | :--- |
| `data-ln-fill-id` | `String` | Уникатен идентификатор на записот нанесен на тригерот. Ова мора да соодветствува на параметарот во хашот (на пр. `142` за `#modal:142`). |
| `data-ln-fill-form` | `String` | Се користи за прецизно лоцирање и поврзување кога повеќе форми на иста страница користат исти ID вредности. |

### DOM Барања и Настани (Слуша и Емитува)
| Настан | Насока | Payload `e.detail` | Опис |
| :--- | :--- | :--- | :--- |
| `ln-modal:open` | Слуша | `{ target: Node, param: String\|null }` | Се активира кога `ln-modal` компонентата ќе го отвори дијалогот. `param` ја носи вредноста на хаш параметарот. |
| `ln-fill:request` | Емитува | `{ id: String\|null }` | Се емитува од координаторот кон целниот модал за да се побара пополнување со записот што соодветствува на `id`. |

---

## 4. CSS Стилизирање и Поведенски Концепт
Како чисто логички координатор (Layer 2 Coordinator), `ln-modal-fill` нема своја визуелна репрезентација и не користи сопствени CSS класи. Целосно се потпира на стиловите на `ln-modal` и формите кои ги опслужува.

---

## 5. Пристапност (ARIA) и Чести Грешки
*   **Пристапност:** Бидејќи координаторот овозможува deep-linking (директно отворање преку URL хаш), осигурајте се дека модалот го фокусира првиот инпут во формата по успешното вчитување (нативниот Focus Trap на `ln-modal`), со цел корисниците на тастатура веднаш да знаат каде се наоѓа фокусот.
*   **Честа грешка 1:** Несовпаѓање меѓу хашот и вредноста на `data-ln-fill-id`. Ако одите на `#user-modal:142`, изворниот линк мора да има точна вредност `data-ln-fill-id="142"`. Доколку се разликуваат, формата нема да се пополни (deep-link-от ќе пропадне тивко).
*   **Честа грешка 2:** Непоставување на `data-ln-fill-form` кога користите исти ID-а во повеќе табели/складови на иста страница. Ова може да доведе до пополнување на погрешни податоци ако првиот најден елемент со тоа ID припаѓа на друг склад.

---

## 6. Дијаграм на Текот и Животен Циклус

```mermaid
sequenceDiagram
    participant User
    participant Hash as Browser Hash (hash.js)
    participant Modal as ln-modal [data-ln-modal]
    participant Coordinator as ln-modal-fill JS
    participant Fill as ln-fill JS
    participant DOM as document DOM
    participant Form as Form[data-ln-form]

    User->>Hash: Changes URL hash to #user-modal:142
    Hash->>Modal: Open triggered
    Modal->>Coordinator: dispatch ln-modal:open { target: Modal, param: '142' }
    Coordinator->>Modal: dispatch ln-fill:request { id: '142' }
    Modal->>Fill: bubbles to document
    
    alt param === null (New Record Mode)
        Fill->>Form: lnFill(Modal, null)
        Form->>Form: reset() fields & restore default action url
    else param !== null (Edit Record Mode)
        Fill->>DOM: Search for element with data-ln-fill-id="142"
        DOM-->>Fill: Return source element
        Fill->>Fill: Extract record from source dataset
        Fill->>Form: lnFill(Modal, record)
        Form->>Form: Populate fields with record data
    end
```

---

## 7. Поврзани Компоненти
*   [ln-modal](./ln-modal.md): Го активира процесот испраќајќи го настанот `ln-modal:open` со соодветните хаш параметри.
*   [ln-fill](./ln-fill.md): Механизмот кој физички ги чита атрибутите од изворниот елемент и ги распределува по полињата.
*   [ln-form](./ln-form.md): Главниот примател на податоците кој ја врши распределбата во формите и го менува своето RESTful однесување врз основа на тоа дали се работи за креирање или измена.
