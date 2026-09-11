# Аудит — ln-validate

2026-09-11 · Опсег: `src/ln-validate.js` (195), `src/validate-model.js` (52), `README.md` (182), schema · Итерација 21/50

## Вердикт

Компонентата ја носи целата валидација на библиотеката — таа го инјектира
`novalidate`, таа ја држи submit портата, таа е единствената што смее. Но
документираната „Touch Gate" инваријанта е заобиколена во конструкторот, а
сортирањето на невалидните полиња е обратно од она што README-то го ветува.

## Што е добро

**Портата е една по форма, не по поле.** `form._lnValidateGateBound` (`:98-99`) —
десет валидирани полиња даваат еден `submit` слушач, не десет.

**Портата работи преку настан, не преку регистар.** `:102` испраќа
`ln-validate:request-validate` со празна низа во `detail`; секое поле само се
запишува ако е невалидно (`:91-93`). Значи портата не води евиденција за полињата и
не ги знае — полињата се јавуваат. Тоа е точната насока на зависност.

**`novalidate` се инјектира преку `dom.form`**, не преку `closest('form')` (`:79`) —
па поле поврзано со `form="id"` атрибут надвор од формата исто работи.

**Прекинувачот `input`/`change` е точен** (`:24`, `:72-75`): `SELECT`, checkbox и
radio добиваат само `change`; текстуалните добиваат `input`. Двојно врзување би
дало двојна валидација.

**Класите се правилно префиксирани** — `ln-validate-valid` / `ln-validate-invalid`
(`:9-10`). Спротивно од SYS-6 случаите (`.open`, `is-loading`).

**README-то предупредува да не се потпираш на `:invalid`** (`:124`) — со точната
причина: прелистувачот го применува на празни `required` полиња веднаш при
вчитување. Тоа е знаење што штеди еден циклус дебагирање.

**`validate-model.js` е чист и жив** — двата извоза увезени (`:2`) и повикани
(`:127-128`, `:169`).

## Наоди

### 🔴 V1 — „Touch Gate" се заобиколува при конструкција; секое checkbox поле паѓа во тоа

**Каде:** `:115-119` наспроти `README.md:12`

README-то го изнесува како втор принцип:

> **The Touch Gate:** To prevent annoying page-load errors, validation is
> **completely visual-silent until a field receives its first user interaction**
> (`input` or `change`), setting its internal state `_touched = true`.

Конструкторот прави спротивно:

```js
const hasInitialValue = (dom.value && dom.value.trim() !== '') || dom.checked;
if (hasInitialValue) {
    this._touched = true;
    this.validate();          // ← рендерира класи, ARIA, грешки и настан
}
```

`validate()` (`:124-150`) не проверува `_touched` — гејтот постои само во тоа што
никој не ја вика. Овде се вика, при init.

**Два достижни случаи:**

**(а) Секое checkbox поле.** `input.value` за checkbox без `value` атрибут е
`"on"` — **без разлика дали е чекирано**. Значи `dom.value && dom.value.trim() !== ''`
е точно за секој checkbox, па:

```html
<input type="checkbox" required data-ln-validate>
```

добива `.ln-validate-invalid`, `aria-invalid="true"` и видлива „required" порака
**при вчитување на страницата**, пред корисникот да допре нешто. Тоа е буквално
„annoying page-load errors" — работата што README-то вели дека е спречена.

**(б) Секоја претходно пополнета форма.** Server-rendered edit форма е основниот
случај на библиотеката (`ln-form` `_applyActionMode`, `lnFill`). Сите нејзини полиња
имаат вредност, значи сите се валидираат при boot: зелени рабови за валидните,
црвени за невалидните, плус по еден `ln-validate:valid` / `:invalid` настан по поле.

### 🔴 V2 — Сортирањето на невалидните полиња е обратно

**Каде:** `:106-108`

```js
validationDetail.invalidFields.sort((a, b) => {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_PRECEDING ? -1 : 1;
});
validationDetail.invalidFields[0].focus();
```

`a.compareDocumentPosition(b)` ја опишува позицијата на **`b` во однос на `a`**.
Битот `DOCUMENT_POSITION_PRECEDING` (2) значи *„`b` доаѓа пред `a`"*.

Компараторот во тој случај враќа `-1`, што значи *„`a` оди прв"*. Значи: кога `b`
претходи, се распоредува `a` прв. **Инвертирано.**

Резултат: по сортирањето `invalidFields[0]` е **последното** невалидно поле во
документот, не првото.

README:27 го ветува спротивното:

> sorts them by document position, and **focuses the first one**

**Достижност:** секоја форма со две или повеќе невалидни полиња. Корисникот кликнува
Save, страницата скока на последната грешка, а првата останува горе непрочитана.

Дополнително: низата **веќе доаѓа во документен ред** — слушачите се врзуваат по
редот на иницијализација на полињата, што е редот од `querySelectorAll`. Значи
сортирањето не поправа ништо, туку активно го расипува точниот редослед.

### 🟠 V3 — Submit портата и `novalidate` преживуваат `destroy()`

**Каде:** `:98-112` наспроти `:173-190`

Портата се врзува со **анонимна функција** (`:100`) што никаде не се чува:

```js
if (!form._lnValidateGateBound) {
    form._lnValidateGateBound = true;
    form.addEventListener('submit', function (e) { … });   // ← нема референца
}
```

`destroy()` ги симнува слушачите на самото поле и двата на формата
(`reset`, `request-validate`) — но:

| работа | се чисти? |
|---|---|
| `input` / `change` / `set-custom` / `clear-custom` на полето | ✅ `:175-178` |
| `reset` / `ln-validate:request-validate` на формата | ✅ `:182-183` |
| **`submit` портата на формата** | ❌ анонимна, нема референца |
| **`form._lnValidateGateBound`** | ❌ останува `true` |
| **`novalidate` на формата** | ❌ останува |

Последица кога сите валидирани полиња на една форма се уништат додека формата
останува: формата има `novalidate` (нативната валидација е исклучена) **и** нема
никој што одговара на `ln-validate:request-validate`, па `invalidFields` останува
празна и портата пропушта сè.

**Формата не валидира ништо — ниту нативно, ниту преку JS.**

Плус, `_lnValidateGateBound` останува `true`, па ново поле додадено подоцна на
истата форма **нема** да ја врзе портата повторно — мисли дека веќе е врзана, а
стариот слушач е сè уште таму и функционира, но само ако некое поле сè уште слуша.

### 🟠 V4 — Видливоста на грешките зависи од theme-only класа

**Каде:** `:44`, `:58`, `:64`, `:137`, `:162`

Сите пораки за грешка се прикажуваат и кријат преку `.hidden`:

```js
items[i].classList.toggle('hidden', !activeErrors.includes(errorKey));
```

`.hidden` е дефинирана само во `theme/utilities/_utilities.scss:16`, а
`theme/ln-ashlar-core.scss` не ги повлекува utilities (SYS-7).

README:41-45 ја бара во авторскиот маркап:

```html
<li class="hidden" data-ln-validate-error="required">Email is required</li>
<li class="hidden" data-ln-validate-error="typeMismatch">Invalid email format</li>
```

Значи консумент со core-only CSS гледа **сите можни пораки за грешка на сите полиња,
трајно видливи**, пред и по init. Заедно со `ln-tabs` TB1, ова е најтешката
манифестација на SYS-7 досега.

### 🟠 V5 — JS се врзува за CSS класа `.form-element`

**Каде:** `:41`, `:53`, `:130`, `:158`

```js
const parent = dom.closest('.form-element');
```

`CLAUDE.md`, во делот Pre-Code Standards Verification §3:

> **JS Data Attributes:** Are all JS behavior bindings linked via `data-ln-*` or
> `data-*` attributes? **NEVER** bind JS behaviors to CSS classes (like
> `.js-toggle`).

Ова не е state класа — тоа е **структурно барање**: без предок со таа класа, ниту
една порака за грешка не се прикажува. Сите четири места го покриваат со
`if (parent)`, значи **откажувањето е тивко**.

Одлуката е свесна и документирана — README:51 (*„The surrounding wrapper **must**
carry the class `.form-element`"*) и README:123 (Common Pitfalls). Но документирано
не значи усогласено: тоа е единствената компонента досега што бара **класа** како
JS хук, кај правило што е напишано со голем збор „NEVER".

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `destroy()` ги враќа `.ln-validate-valid/-invalid` и `aria-invalid` (`:186-187`), но не ги крие пораките за грешка — за разлика од `reset()` (`:158-164`), кој го прави тоа. Уништено поле може да остави видлива црвена порака. | `:173-190` |
| P2 | Схемата декларира `data-ln-form` (сопственост на `ln-form`) и `data-ln-error` (не постои во `src/**`) — обете од ко-лоциран SCSS. SYS-15. | schema |
| P3 | `_onSetCustom` (`:36-49`) пишува класи и ARIA директно наместо да мине низ `validate()`, па состојбата се пресметува на две места со различен код. `_onClearCustom` пак вика `validate()` (`:69`). Асиметрија во ист пар. | `:36-70` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-validate` | `:5` | ✅ | ✅ |
| `data-ln-validate-error` | `:8` | ✅ + мапа на нативни клучеви | ✅ |
| `data-ln-validate-errors` | `:7` | ✅ | ✅ |
| `.form-element` (JS хук) | `:41,53,130,158` | ✅ „must carry" + Pitfall | н/п |
| `novalidate` инјекција | `:81-83` | ✅ „Authors never write it" | н/п |
| submit порта, еднаш по форма | `:98-112` | ✅ Philosophy §5 | н/п |
| `ln-validate:set-custom` / `:clear-custom` | `:76-77` | ✅ Received | н/п |
| `ln-validate:request-validate` | `:96,102` | ✅ со payload | н/п |
| `ln-validate:valid` / `:invalid` | `:146-147` | ✅ Emitted | н/п |
| `validate()` / `reset()` / `isValid` | `:124,152,167` | ✅ JS API | н/п |
| **Touch Gate при init** | заобиколен `:115-119` | ❌ тврди „completely visual-silent" | н/п |
| **фокус на прво невалидно** | последно (инвертиран сорт) | ❌ тврди „the first one" | н/п |
| **teardown на портата / `novalidate`** | не се чисти | ❌ неспомнато | н/п |

## Затечена состојба

`_touched` и `_customErrors` се вистинска instance состојба, не огледало на атрибут —
па прашањето `defineAttrs` овде не се поставува. Сите атрибути (`data-ln-validate-error`
клучевите) се читаат свежо во `validate()` (`:134-136`).

Конзолен излез: нула. Нема ни `-dev.scss` дијагностика — а `.form-element` што
недостасува е токму случајот што CSS афордансот би го фатил.
