# Аудит — ln-fill

2026-09-12 · Опсег: `components/ln-fill/src/ln-fill.js` (87 л.) · `components/ln-fill/README.md` (199 л.) · `components/ln-fill/ln-fill.schema.json` (19 л.) · **нема** `ln-fill.scss`, **нема** `ln-fill-dev.scss` · Доктрина: `_doctrine.md`

**Каде живее.** Спротивно на претпоставката во задачата, `ln-fill` **има сопствена
папка** — `components/ln-fill/` со `src/ln-fill.js`, `README.md` и шема. Влегува во
унифицираниот бандл преку `components/index.js:57`. Но **нема host елемент**: нема
`data-ln-fill` корен атрибут, нема `registerComponent`, нема инстанца, нема
`destroy()`. Тоа е модул со два `document` слушачи (`src/ln-fill.js:41`, `:65`).

**Како се применува доктрината на host-less модул (П5).** П5 (`_doctrine.md:74`,
`:310-315`) вели дека за `ln-core` модулските помошници §1 е **неприменлива** — нема
јазол што би носел атрибут. Истата логика важи и тука за делот „состојбата живее во
атрибут": `ln-fill` **не држи никаква состојба** (единствената модулска променлива е
`const RESERVED`, `:11`), па таа клаузула е вакуумна. Тоа **не** ги изземa:
именувањето од §1 (`data-ln-{component}-{attribute}`, `ln-{component}:{action}`),
**§2** (што JS смее да запише во DOM), **§3** (авторски markup, гласен отказ), **§4**
(настани и границата) и **§5**. Сите четири се мерени овде.

---

## Вердикт

Најтешкото не е во `ln-fill.js` туку во она што `ln-fill` постои да го активира:
целата fill патека завршува во `ln-core/helpers.js:145` и `:149-163`, кои пишуваат
класа `.hidden` и **произволни авторски класи** во DOM — двојно забрането по §2 и
П1, а `.hidden` уште и по П4. `ln-fill` го објавува тоа како свој договор
(`README.md:16-19`), па наодот му припаѓа на овој аудит колку и на `ln-core`.
Второ по тежина: `_findSource` (`:26-39`) пребарува низ **цел документ** и при
колизија тивко го зема првиот кандидат, па `container` аргументот не е граница туку
само предност. Трето: протоколот отстапува од §4 — `ln-fill:request` е гол `:request`
(само 2 такви во целата библиотека), а самиот настан `ln-fill` воопшто нема `:{action}`.
Четврто: двата неразрешени референци-случаи (`:58`, `:78`) паѓаат тивко, а компонентата
нема **ниту еден ред** dev-SCSS што би го изнудил договорот.

Самиот `ln-fill.js` е инаку исклучително дисциплиниран: 87 линии, нула состојба,
нула запис во DOM, нула `.style.`, нула зашиен текст.

## Што е добро

- **Нула запис во DOM од самата компонента.** `src/ln-fill.js` нема ниту еден
  `setAttribute`, `classList`, `.style.` или `textContent`. Таа само чита
  (`:32`, `:50`, `:56`) и испраќа (`:62`, `:73`, `:81`). По §2 тоа е чист резултат.
- **Нула состојба.** Целиот модул држи една константа (`:11`). Нема приватно
  огледало, нема кеш, нема `_isOpen`. §1 нема што да фати.
- **`e.preventDefault()` намерно изостанува**, со објаснет зошто во кодот
  (`:53-54`) — композицијата со `data-ln-modal-for` на истото копче зависи од тоа.
  Тоа е точно што §4 бара: компонентата не го киднапира настанот на соседот.
- **Резервираните суфикси се објаснети во изворот, не само во докот** (`:8-10`,
  `:11`) — читачот на кодот знае зошто `lnFillStore` постои без имплементација.
- **Шемата е точна во насоката.** Двата атрибута се `"direction": "author"`
  (`ln-fill.schema.json:7`, `:13`) — `ln-fill` навистина никогаш не ги пишува.

---

## Наоди

### 🟠 T1 — Fill патеката што `ln-fill` ја активира пишува класа `.hidden` и произволни класи во DOM

**Каде:** `components/ln-fill/src/ln-fill.js:62`, `:73`, `:81` → `components/ln-core/helpers.js:145`, `:149-163`

Трите излези на `ln-fill` водат во еден повик:

```js
window.lnCore.lnFill(form, hasKeys ? record : null);   // :62
window.lnCore.lnFill(target, null);                    // :73
window.lnCore.lnFill(target, record);                  // :81
```

`lnFill` (`helpers.js:174-189`) испраќа `ln-fill` на секој `[data-ln-form]` и
`[data-ln-fillable]` (`:183-187`). Делегираниот fillable ракувач
(`helpers.js:198-208`) за секој `[data-ln-fillable]` вика `fill(e.target, e.detail)`
(`:201`). А `fill()` содржи две гранки што пишуваат класи:

```js
el.classList.toggle('hidden', !data[prop]);   // helpers.js:145  — data-ln-show
el.classList.toggle(cls, !!data[prop]);       // helpers.js:160  — data-ln-class
```

Првата е состојбена класа за криење — П4 (`_doctrine.md:245`, `:270`) изречно ја
именува токму оваа линија како затечен дефект и бара `el.hidden = bool` плус правило
опфатено со host атрибут. Втората е **полиња отворена врата**: `data-ln-class` му
дозволува на авторот да натера JS да напише класа со **кое било** име — визуелна
(`.text-red`), состојбена (`.is-loading`), било каква. §2 (`_doctrine.md:87-92`) ги
забранува и двете категории без исклучок, а §2.1 (`:96-103`) дозволува класа само ако
е преодна и никаде не се чита назад — ниту `data-ln-show` ниту `data-ln-class` не се
преодни, тие траат колку записот во формата.

Дефиницијата `.hidden { … }` живее **само** во темата
(`theme/utilities/_utilities.scss:16`). Консументот што носи core + Tailwind по
`data-ln-show` добива класа што не стилизира ништо — елементот останува видлив, без
грешка.

**Зошто е наод на `ln-fill`, а не само на `ln-core`.** Кодот е во `ln-core`, но
`ln-fill` е компонентата што го **објавува** тој договор како свој:
`README.md:16-19` го опишува `lnFill()` како „the underlying primitive", а целата
намена на модулот е да го активира. Кога П4 се мете хоризонтално (чекор 5), обете
страни се исти фронт.

**Достижност.** `[data-ln-fillable]` е во активна употреба
(`demo/admin/src/pages/modal.html:71`, `:278`), па патеката до `fill()` се гази на
секое отворање модал. Гранките `data-ln-show` / `data-ln-class` не ги најдов во
демоата — тие се латентни, но се дел од објавениот договор и се достижни за секој
консумент.

---

### 🟠 T2 — `_findSource` пребарува низ цел документ и при колизија тивко зема прв кандидат

**Каде:** `components/ln-fill/src/ln-fill.js:26-39`

```js
function _findSource(container, param) {
	const escaped = (window.CSS && CSS.escape) ? CSS.escape(param) : param;
	const candidates = document.querySelectorAll('[data-ln-fill-id="' + escaped + '"]');   // :28
	if (candidates.length === 0) return null;
	for (let i = 0; i < candidates.length; i++) {
		const formId = candidates[i].getAttribute('data-ln-fill-form');                   // :32
		if (formId) {
			const form = document.getElementById(formId);
			if (form && container.contains(form)) return candidates[i];                   // :35
		}
	}
	return candidates[0];                                                                 // :38
}
```

`container` **не е граница** — се користи само во јамката за предност (`:35`). Ако
ниту еден кандидат не покажува кон форма внатре во `container`, функцијата враќа
`candidates[0]` (`:38`): произволен јазол од каде било во документот, избран по
редослед во DOM-от.

Последица: две одвоени области на иста страница што користат исти вредности за
`data-ln-fill-id` (а тоа е бројот на записот — `5`, `42` — па колизијата е нормална,
не егзотична) ќе се хранат една со друга. Корисникот гледа туѓи податоци во формата,
без ниту еден сигнал. §3 (`_doctrine.md:121`) бара недостигот да падне гласно, не да
се крпи со тивок default; `candidates[0]` е токму тивок default врз двосмисленост.

Дополнително по §4 (`_doctrine.md:132`): `ln-fill:request` е испратен **на** конкретен
елемент (`ln-ui-coordinator.js:192` го праќа на модалот), што е точно моделот на
адресирана достава што `README.md:29-31` го брани. Потоа `_findSource` тој модел го
поништува со `document.querySelectorAll` — адресата ја има, па ја игнорира.

---

### 🟠 T3 — Протоколот отстапува од `ln-{name}:{action}` на две места

**Каде:** `components/ln-fill/src/ln-fill.js:65` · `components/ln-core/helpers.js:181`, `:186`

§4.1 (пресуда 2026-09-12): имиња `ln-{name}:{action}`; влезот има три легитимни форми — `:request-{action}`, `:set-{noun}`, исходен влез. Двете отстапувања подолу не паѓаат во ниту една од трите.

1. **Влезот е гол `:request`.** `document.addEventListener('ln-fill:request', …)`
   (`:65`); производителот е `ln-ui-coordinator.js:192` и `:224`. Канонската форма би
   била `ln-fill:request-fill`. Механичка проверка низ сите `src/*.js`: постојат ~40
   имиња од обликот `ln-{x}:request-{action}` (`ln-api-connector:request-create`,
   `ln-data-store:request-page`, `ln-chart:request-data`, …) и точно **две** голи
   `:request` — `ln-fill:request` и `ln-http:request`.

   Наодот не зависи од §8 виљушка 2. Таа виљушка прашува дали компонента без
   host смее да прима гол **глагол** (`ln-toast:enqueue`, `ln-http:cancel`);
   тука проблемот е поинаков — `{action}` отсуствува целосно, зборот `request`
   стои на негово место и не именува дејство. `ln-fill` навистина нема host
   (нема `registerComponent`), па `document`-слушачот сам по себе не е наод.

2. **Излезот воопшто нема `:{action}`.** Настанот што целиот механизам го носи се вика
   само `ln-fill` (`helpers.js:181`, `:186`) — име на компонента употребено како име на
   настан. Слушателите го врзуваат како таков (`ln-form/src/ln-form.js:37`,
   `helpers.js:198`).

Последицата е ограничена на конзистентност на протоколот — ништо не паѓа. Но §1:48
(„Секое отстапување … е наод") и §4:127 не оставаат простор за проценка, а `ln-fill`
е единствената компонента чиј **главен** настан ја нема формата воопшто.

---

### 🟠 T4 — Неразрешени референци паѓаат тивко, а нема ниту еден ред dev-SCSS

**Каде:** `components/ln-fill/src/ln-fill.js:58`, `:78` · отсуство на `ln-fill-dev.scss`

```js
const form = document.getElementById(formId);
if (!form) return;                 // :57-58 — data-ln-fill-form покажува во празно
…
const source = _findSource(target, param);
if (!source) return;               // :77-78 — нема [data-ln-fill-id] за тој param
```

Двата случаја се **авторска грешка** — печатна грешка во id, преименувана форма,
запис избришан од табелата. Обата завршуваат со тивко `return`: копчето изгледа
исправно, кликот не прави ништо, конзолата молчи, DOM-от не носи трага.

§3 (`_doctrine.md:121`): „Тоа што фали паѓа гласно (dev-scss порака), не се крпи со
тивок default." `components/ln-fill/` нема **ниту еден** `.scss` фајл — ни
функционален ни dev. Споредбата со бенчмаркот е директна: `ln-chart-dev.scss:3-19`
го изнудува авторскиот договор (`_doctrine.md:162`).

Чесно ограничување што го признавам: CSS не може да провери дали еден id се
разрешува, па `:58` и `:78` не се целосно покриени од dev-SCSS. Но делот што **е**
проверлив (на пр. `[data-ln-fill-id]` што не носи `data-ln-fill-form`, или
`data-ln-fill-*` payload на елемент без `data-ln-fill-form`) денес нема никаква
покриеност, затоа што фајлот не постои.

---

## 🟡 Doc-drift

| # | Наод | Каде |
|---|---|---|
| D1 | `data-ln-fill-id` **воопшто го нема** во „3. Attribute Reference" (`README.md:83-90`), иако изворот го чита (`src/ln-fill.js:28`), шемата го декларира (`ln-fill.schema.json:12`) и демоата го користат (`demo/admin/src/pages/modal.html:264`, `:267`). Консументот не може да ја состави координаторската патека од докот. | `README.md:83-90` |
| D2 | README **нема Events секција**. Влезот `ln-fill:request` е спомнат само во проза (`README.md:115`), а излезниот `ln-fill` само описно (`:17-18`). Ниту еден попис на протокол — payload, `bubbles`, цел на достава. | `README.md` (целина) |
| D3 | `data-ln-fill-id` игра **двојна улога** што нигде не е запишана: адреса за `_findSource` (`src/ln-fill.js:28`) **и** payload клуч — `RESERVED` (`src/ln-fill.js:11`) исклучува само `lnFillForm` и `lnFillStore`, па `_recordFrom` (`:16-22`) го претвора `data-ln-fill-id="42"` во `record.id`. Тоа е **носечко** однесување — `demo/admin/src/pages/modal.html:280` чита `data-ln-field="id"`, а записот доаѓа токму од адресниот атрибут. Ниту `README.md:85-86` ниту `:88-90` не го кажуваат тоа. | `README.md:85-90` ↔ `src/ln-fill.js:11`, `:28` |
| D4 | „Because `fillTemplate()` **now** interpolates…" (`README.md:121`) — временска формулација. Тврдењето е точно (`ln-core/helpers.js:229` „Pass 2: element attributes", `:244` `setAttribute`), само формулацијата е скеле. | `README.md:121` |
| D5 | `README.md:75` вели „`ln-form` receives `ln-fill` → calls `this.fill(record)`". Всушност `ln-form/src/ln-form.js:24` вика `self.fill(e.detail)` **и** `:25` `self._applyActionMode(e.detail)` — вториот го менува `action` на формата, што е видлив ефект што докот го крие. | `README.md:75` ↔ `ln-form/src/ln-form.js:24-25` |

---

## 🔵 Предлози

| # | Набљудување | Каде |
|---|---|---|
| S1 | `DOM_ATTRIBUTE = 'lnFill'` (`:4`) и `window[DOM_ATTRIBUTE] = true` (`:86`) значи `window.lnFill === true`. Во библиотеката тоа е **единствениот** случај каде sentinel-от е boolean наместо конструктор (спореди `ln-ajax/src/ln-ajax.js:273`). Плус колизија на читање: `window.lnFill` е `true`, а `window.lnCore.lnFill` (`ln-core/helpers.js:1037`) е функцијата. Две работи со исто име, различни ствари. | `src/ln-fill.js:4`, `:86` |
| S2 | `import { } from '../../ln-core';` (`:1`) — празен import само за страничен ефект, единствен таков во `components/*/src/*.js`. Притоа фајлот три пати оди преку `window.lnCore.lnFill` (`:62`, `:73`, `:81`), иако `lnFill` е именуван извоз (`ln-core/index.js:1`) и можел да се увезе како и во секој друг модул (спореди `ln-external-links/src/ln-external-links.js:1`). | `src/ln-fill.js:1` |
| S3 | Модификаторската проверка е рачна: `if (e.ctrlKey \|\| e.metaKey \|\| e.button === 1) return;` (`:42`). `ln-core` веќе носи `shouldIgnoreClick(event)` (`helpers.js:365-370`), кој покрива и `shiftKey` и `altKey` (`:367`) и **секое** `button !== 0` (`:368`). Рачната верзија пропушта Shift-клик и притоа тестира `e.button === 1` на `click` настан, каде среден клик не стигнува (тоа е `auxclick`) — таа гранка е мртва. **Замената не ја крши апстиненцијата од `preventDefault()`** што е пофалена во „Што е добро“ (`src/ln-fill.js:53-54`): `shouldIgnoreClick` е чист предикат — тестира и враќа boolean, без страничен ефект; целиот `ln-core/helpers.js` (1042 линии) има **нула** погодоци за `preventDefault`. Не да се помеша со `hashLinkClick` (`ln-core/hash.js:80-84`), кој има потесен услов (`:81`, без `altKey`, `button === 1`), обрнат поларитет и **навистина** вика `e.preventDefault()` (`:82`) — тој не би бил употреблив тука. | `src/ln-fill.js:42` |
| S4 | `href="#"` е чест авторски образец во куќниот стил (`demo/admin/accordion.html`, `cards.html`, `mixins.html`). Ако некогаш се спои со `data-ln-fill-form`, guard-от на `:51` тивко го јаде fill-от, а координаторот нема хеш-сегмент што би го покрил. Денес **нема ниту еден таков случај** во `demo/`, а `README.md:115` го опишува правилото точно („its `href` attribute contains `#`“) — затоа е предлог, не наод и не doc-drift. | `src/ln-fill.js:50-51` |
| S5 | Нема `destroy()` и двата `document` слушачи се врзуваат еднаш и никогаш не се симнуваат. За host-less делегиран модул тоа е конструкцијата, не пропуст — §5 нема инстанца да мери. Го бележам само за да не се прочита како испуштено. | `src/ln-fill.js:41`, `:65`, `:86` |
| S6 | Именскиот простор `data-ln-fill-*` е делен: `data-ln-fill-as` го чита `ln-core/helpers.js:513` (`populateForm`), и е деклариран во `ln-core.schema.json:30`, `ln-date.schema.json:55`, `ln-number.schema.json:12` — во ниту една од нив не е `ln-fill`. По §1 („`data-ln-{component}-{attribute}`") `data-ln-fill-as` се чита како атрибут на `ln-fill`, а не е. Истиот простор истовремено носи и произволен кориснички payload (`data-ln-fill-title`, `data-ln-fill-event-id`). Три различни сопственици на еден префикс. | `ln-core/helpers.js:513` · `src/ln-fill.js:16-22` |
| S7 | Нема `data-ln-fill` корен атрибут — активацијата е преку `data-ln-fill-form`, што е суфиксиран атрибут. §1:37 бара корен без суфикс. За модул без host тоа нема каде да седне; бележам дека компонентата ја допира клаузулата, не дека може да ја исполни. | `src/ln-fill.js:44` |

---

## Затечена состојба — без пресуда

**Отворената виљушка од §8 (BEM компаунди) `ln-fill` не ја допира.** Компонентата
нема SCSS воопшто и не пишува ниту една класа од својот код; единствените класи што
влегуваат во игра се оние што **авторот** ги именува во `data-ln-class`
(`ln-core/helpers.js:160`) — тие не се библиотечни имиња и не се предмет на BEM
пресудата.

**Каде мислам дека доктрината не ми даде остра мерка.** §5 и П3 се напишани за
компонента со инстанца и `destroy()`. `ln-fill` е модул со два трајни `document`
слушача и boolean sentinel — нема што да урива и нема тест „дали ова ќе постоеше".
Затоа S5 стои како набљудување, не како наод; ако подоцна се одлучи дека и
host-less модулите должат teardown семе, оваа линија треба да се препрочита.

---

## Drift табела

| Нешто | Извор | README | schema.json |
|---|---|---|---|
| `data-ln-fill-form` | чита `src/ln-fill.js:44`, `:56` | ✔ `README.md:85` | ✔ `:6` `"direction": "author"` |
| `data-ln-fill-id` | чита `src/ln-fill.js:28` | ✖ нема во §3 | ✔ `:12` `"direction": "author"` |
| `data-ln-fill-<key>` (payload) | `src/ln-fill.js:16-22` | ✔ `README.md:86` | — (не е литерал, скенерот не го гледа) |
| `data-ln-fill-store` (резервиран) | `src/ln-fill.js:11` | ✔ `README.md:90` | ✖ нема запис |
| `data-ln-fill-as` | чита `ln-core/helpers.js:513` | спомнат само во „Related" `README.md:196` | ✖ во `ln-core.schema.json:30`, не во `ln-fill` |
| `data-ln-fillable` | чита `ln-core/helpers.js:179`, `:183`, `:199` | ✔ `README.md:17` | ✖ во `ln-core.schema.json:36`, не во `ln-fill` |
| настан `ln-fill:request` (влез) | `src/ln-fill.js:65` | само проза `README.md:115` | — |
| настан `ln-fill` (излез) | `ln-core/helpers.js:181`, `:186` | описно `README.md:17-18` | — |
| `ln-fill.scss` / `ln-fill-dev.scss` | не постојат | не се спомнати | — |
