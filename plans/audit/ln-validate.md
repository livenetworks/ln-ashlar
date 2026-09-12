# Аудит — ln-validate

2026-09-12 · Опсег: `src/ln-validate.js` (195) · `src/validate-model.js` (52) · `ln-validate.scss` (7) · `ln-validate-dev.scss` (15) · `README.md` (182) · `ln-validate.schema.json` (44) · Доктрина: `plans/audit/_doctrine.md`

Компилираниот бандл `components/ln-validate/ln-validate.js` е генериран (1 линија, `(function(){"use strict";…`) — не е аудитиран.

> **Забелешка за нумерацијата:** сите `§` референци во овој аудит се на
> `plans/audit/_doctrine.md` (кампањската доктрина, §0–§8 + пресудите П1–П5) —
> **не** на коренскиот `DOCTRINE.md`, кој ги нумерира истите теми поинаку.

## Вердикт

Најтешкото е функционално: `hasInitialValue` (`src/ln-validate.js:115`) го чита `dom.value` на checkbox/radio, а таму нативната вредност е `"on"` и кога полето е неоткачено — секој неоткачен checkbox/radio со `data-ln-validate required` се пали како „touched" при init и ја прикажува грешката пред корисникот да пипне нешто, точно она што README-то го ветува дека не се случува. Второ по тежина е П4: компонентата крие на **пет** места преку класата `.hidden`, а нејзиниот co-located SCSS не содржи ниту едно правило за криење — дефиницијата живее само во темата (`theme/utilities/_utilities.scss:16`), па консументот на објавениот `./core.css` (`package.json:37`) добива форма во која **сите** пораки за грешка се трајно видливи. Трето, `destroy()` ги остава `novalidate`, submit-гејтот и `form._lnValidateGateBound` на туѓиот `<form>`, што значи дека по уривање формата се праќа без нативна и без ln валидација. Четврто, целиот DOM-договор виси на `.form-element` — класа од заменливиот слој — додека dev SCSS-от прифаќа и `[data-ln-form]`, кој JS никогаш не го гледа.

## Што е добро

- **Нула зашиен кориснички текст.** Во целиот `src/` нема ниту една порака за грешка на англиски или македонски; пораките се авторски `<li>` јазли што се кријат/откриваат (`src/ln-validate.js:134-138`). Валидацијата е точно местото каде што речник најчесто се провлекува во JS — овде не е. Нема ни `setCustomValidity` со текст.
- **§3 целосно исполнета.** Нула `createElement`, нула `innerHTML`, нула `textContent` во фајлот — компонентата само наоѓа со `querySelector` (`:43, :57, :63, :132, :134, :160`) и превклучува видливост. Празната/грешната состојба е авторски markup (`README.md:40-46`).
- **Чист модел слој.** `src/validate-model.js` (52 линии) има **0** погодоци за `document` / `window` / `localStorage`; `isFieldValid` (`:17-20`) и `resolveActiveErrorKeys` (`:28-51`) се чисти функции врз `ValidityState`. Тоа е §0 како по учебник и е на ниво на бенчмаркот `ln-chart`.
- **Нативната платформа е носечка.** `validate()` чита `dom.validity` (`:126`) наместо `checkValidity()` — со тоа намерно го избегнува нативниот `invalid` настан и двојниот фокус. `ERROR_MAP` (`validate-model.js:1-9`) е чисто пресликување на `ValidityState`, без сопствени правила.
- **Границата со `ln-form` е навистина чиста.** `grep -n "submit" components/ln-form/src/*.js` враќа **нула** погодоци — тврдењето во `README.md:164` („`ln-form` has no involvement — it never listens for `submit`") е вистинито. Пресудата „Форма е форма" од 2026-07-13 е одржана: гејтот и `novalidate` се тука (`src/ln-validate.js:81-83`, `:98-112`), без преклопување.
- **Гејтот работи за секој HTTP метод.** `form.addEventListener('submit', …)` (`:100`) нема гранка по `method`, како што бара пресудата.
- **Префиксот на настаните е полното име на компонентата.** Сите шест настани почнуваат со `ln-validate:` — нула скратувања, нула алијаси. Формата на влезните имиња е друга работа: `:request-validate` (`:96`) и `:set-custom` (`:76`) се две легитимни форми по §4.1; `:clear-custom` (`:77`) не е ниту една од трите — види Затечена состојба.
- **`form="id"` асоцијација работи.** Слушачите се качени на `dom.form` (`:79`), не на `dom.closest('form')`, па поле надвор од формата сврзано преку `form="id"` учествува во гејтот.

## Наоди

### 🔴 T1 — `hasInitialValue` го смета неоткачениот checkbox/radio за пополнет и ја гаси touch-портата при init

**Каде:** `src/ln-validate.js:115-119`

```js
const hasInitialValue = (dom.value && dom.value.trim() !== '') || dom.checked;
if (hasInitialValue) {
	this._touched = true;
	this.validate();
}
```

Кај `<input type="checkbox">` без авторски `value`, `dom.value` враќа нативно `"on"` — и кога `dom.checked === false`. Кај `<input type="radio">` авторот речиси секогаш пишува `value="…"`, па истото важи за **секое** радио копче во групата. Условот значи: `"on" && "on".trim() !== ''` → `true`, гранката се влегува, `_touched = true`, `validate()` веднаш се пушта.

Дека checkbox/radio се декларирано поддржани полиња — не измислен сценарио — го кажува самиот извор: `:24`

```js
const isChangeBased = tag === 'SELECT' || type === 'checkbox' || type === 'radio';
```

и `README.md:145` („`change`-only fires on `<select>`, checkbox, radio").

**Последица.** Празна, недопрена форма со задолжителен checkbox („Се согласувам со условите") се прикажува со видлива порака за грешка и `aria-invalid="true"` (`:144`) веднаш по вчитување. Тоа директно го прекршува договорот запишан во `README.md:12` („validation is completely visual-silent until a field receives its first user interaction") и во `README.md:141` („Pristine empty fields remain `_touched = false`"). Истиот услов ги фаќа и `type="color"` (нативен default `#000000`) и `type="range"` (нативен default = средина на опсегот).

Забелешка за опфатот: втората гранка на условот (`|| dom.checked`) покажува дека авторот **намерно** ги имал предвид checkbox/radio и сакал да ги покрие преку `checked`. Ама првата гранка секогаш се пали пред неа, па `|| dom.checked` е де факто **мртов код** за секое поле што има вредност — тоа е самиот доказ дека намерата и понесувањето се разишле.

---

### 🟠 T2 — П4: пет криења преку класата `.hidden`, нула правила во co-located SCSS

**Каде:** `src/ln-validate.js:44, :58, :64, :137, :162` · `ln-validate.scss:1-7`

Затворена енумерација — **сите 5** погодоци на `'hidden'` во фајлот, сите се класа:

| # | линија | код | наод |
|---|---|---|---|
| 1 | `:44` | `if (el) el.classList.remove('hidden');` | откривање на custom грешка |
| 2 | `:58` | `if (el) el.classList.add('hidden');` | криење на една custom грешка |
| 3 | `:64` | `if (el) el.classList.add('hidden');` | криење при clear-all |
| 4 | `:137` | `items[i].classList.toggle('hidden', !activeErrors.includes(errorKey));` | главниот render циклус |
| 5 | `:162` | `items[i].classList.add('hidden');` | `reset()` |

Нула повици на `el.hidden = …` во фајлот. Бројот се совпаѓа точно со тоа што доктрината го наведува за оваа компонента (П4, „`ln-validate` (5)").

Целиот co-located `ln-validate.scss` е седум линии и **не** содржи правило за криење — единственото правило е `[data-ln-error]:empty` (`:5`, види T6). Дефиницијата `.hidden { @include hidden; }` живее само во темата, `theme/utilities/_utilities.scss:16`. Core агрегаторот го вклучува componentот (`theme/ln-ashlar-core.scss:24`), но не ја носи дефиницијата.

**Последица, и таа е достижна денес.** `package.json:37` го објавува `"./core.css": "./dist/ln-ashlar-core.css"` како засебен пакет извоз. Консумент што го зема само тој бандл (сценариото „core + Tailwind") добива: класата се додава и се вади коректно, но ништо не се стилизира — **сите** `[data-ln-validate-error]` пораки во сите форми остануваат трајно видливи. Нема ниту грешка ниту предупредување. Плус, самиот авторски markup во `README.md:41-45` учи `class="hidden"` како почетна состојба, што значи дека и „скриеното" пред JS воопшто да се вклучи е видливо кај тој консумент.

---

### 🟠 T3 — П1: состојбата на валидноста живее во класа и во JS поле, не во атрибут

**Каде:** `src/ln-validate.js:9-10, :18, :46-47, :142-143, :155, :186`

```js
const CSS_VALID = 'ln-validate-valid';
const CSS_INVALID = 'ln-validate-invalid';
…
dom.classList.toggle(CSS_VALID, isValid);
dom.classList.toggle(CSS_INVALID, !isValid);
```

Затворена енумерација — **сите 11** повици на `classList` во фајлот:

| # | линија | повик | пресуда |
|---|---|---|---|
| 1 | `:44` | `remove('hidden')` | П4 → T2 |
| 2 | `:46` | `remove(CSS_VALID)` | **П1 наод** |
| 3 | `:47` | `add(CSS_INVALID)` | **П1 наод** |
| 4 | `:58` | `add('hidden')` | П4 → T2 |
| 5 | `:64` | `add('hidden')` | П4 → T2 |
| 6 | `:137` | `toggle('hidden', …)` | П4 → T2 |
| 7 | `:142` | `toggle(CSS_VALID, isValid)` | **П1 наод** |
| 8 | `:143` | `toggle(CSS_INVALID, !isValid)` | **П1 наод** |
| 9 | `:155` | `remove(CSS_VALID, CSS_INVALID)` | **П1 наод** (`reset()`) |
| 10 | `:162` | `add('hidden')` | П4 → T2 |
| 11 | `:186` | `remove(CSS_VALID, CSS_INVALID)` | **П1 наод** (`destroy()`, легитимно чистење — но чисти класа што не смеела да постои) |

`grep -n "classList.contains" src/ln-validate.js` → **нула** погодоци, значи §2.1 услов 2 е задоволен. Но §2.1 услов 1 паѓа: класата трае колку што полето е невалидно — значи низ целиот живот на формата — што доктрината изречно го исклучува („Нешто што трае колку операција … не е преодно. Тоа е состојба."). Двете класи се и взаемно исклучиви по природа, а се држат како две независни множествени членства — точно невозможната состојба што П1 ја наведува како образложение.

Двете класи се стилизирани во **темата** (`theme/components/_form.scss:103, :107`), што ја потврдува дијагнозата: состојбата е паркирана во просторот на имиња на заменливиот слој (§0).

Дополнително, `_touched` (`:18`) е чиста животна состојба во JS поле, без огледало во DOM. По П5 таа спаѓа во категоријата „Животна/статусна состојба — §1 важи целосно". Ниту една од двете состојби не е достапна ниту за CSS ниту за друга компонента преку атрибут.

Најпосле, `registerComponent` е повикан со **четири** аргументи (`:194`):

```js
registerComponent(DOM_SELECTOR, DOM_ATTRIBUTE, _component, 'ln-validate');
```

Петтиот `options` аргумент (`ln-core/helpers.js:818`) го нема — нема `extraAttributes`, нема `onAttributeChange`, нема `effects`. Тоа е конзистентно со тоа што компонентата денес **нема** ниту еден сопствен состојбен атрибут; штом состојбата се пресели во атрибут по П1, декларираната реактивност ќе стане неопходна.

---

### 🟠 T4 — П3: `destroy()` остава три траги на туѓиот `<form>`, па формата се праќа без никаква валидација

**Каде:** `src/ln-validate.js:173-190` наспроти `:81-83, :98-112`

Што компонентата запишува на `<form>` елемент што **не е нејзин host**:

```js
if (!form.hasAttribute('novalidate')) {
	form.setAttribute('novalidate', '');          // :81-83
}
…
if (!form._lnValidateGateBound) {
	form._lnValidateGateBound = true;             // :98-99
	form.addEventListener('submit', function (e) {  // :100  ← анонимна
		…
	});
}
```

Што `destroy()` враќа (`:173-190`): двата **именувани** слушачи на формата (`:182-183`), четирите слушачи на host-от (`:175-178`), класите (`:186`), `aria-invalid` (`:187`).

Што **не** враќа:

1. **`novalidate`** (`:82`). Атрибутот не е авторски — `README.md:126-129` изречно вели „Don't write it by hand". Значи рабниот случај од П3 („авторски атрибут со сменета вредност") не важи: ова ќе не постоеше ако компонентата не се извршеше, па по П3 се брише. `README.md:20-22` тврди спротивно („never removed on field `destroy()`, since other validated fields on the same form may still own the gate") — тоа е реален проблем на сопственост, но решението не е трајна трага, туку броење на живите инстанци.
2. **Анонимниот `submit` слушач** (`:100`). Функцијата не е зачувана во поле, па е **технички неотстранлива** — нема референца за `removeEventListener`.
3. **`form._lnValidateGateBound`** (`:99`) — expando на туѓ елемент, никогаш избришан.
4. **Видливоста на пораките за грешка.** `destroy()` не ги крие `[data-ln-validate-error]` јазлите (`README.md:174` го признава: „leaves error `<li>` visibility as-is"), за разлика од `reset()` (`:160-163`). Класите `.hidden` што компонентата ги тргнала на `:44` / `:137` остануваат тргнати.

**Последица, и таа е најтешкиот дел.** Формата останува со `novalidate` (нативната валидација е трајно исклучена) и со гејт слушач што сега не наоѓа ниту едно поле — `validationDetail.invalidFields` останува празен (`:101-104`), гејтот не вика `preventDefault()`, и формата се праќа. По уривање на последната `ln-validate` инстанца формата не е „вратена на нативна валидација", туку е **без никаква** валидација, со видливи пораки за грешка од претходниот циклус како десетина. Ова е достижно преку рачен `destroy()` (`README.md:96`) и преку автоматското уривање при откачување на јазол (`ln-core/helpers.js:878-893`) — на пример кога `ln-router` или SPA замена ќе го отстрани полето, а формата остане.

Она што **не** е наод: `destroy()` не вика `removeAttribute('data-ln-validate')` — enumeration на `removeAttribute` во фајлот дава точно два погодоци, `:156` и `:187`, и двата се `aria-invalid`. Значи патот (C) на заедничкиот обсервер (`ln-core/helpers.js:776-780`, `findElements(el, entry.selector, …)`) не се пали и нема пресоздавање на инстанцата.

---

### 🟠 T5 — Договорот е закотвен на `.form-element`, класа од заменливиот слој; dev SCSS-от ветува втор котвен јазол што JS-от го нема

**Каде:** `src/ln-validate.js:41, :53, :130, :158` наспроти `ln-validate-dev.scss:12-13`

Сите четири пати кога компонентата бара контекст, таа бара класа:

```js
const parent = dom.closest('.form-element');
```

`.form-element` не е `data-ln-*` јазол и не е дефинирана од компонентата — таа е речник на темата, употребена во `theme/components/_form.scss:116` (`:where(.form-element > …)`). §1 бара котвата да биде `data-ln-{component}-{attribute}`; §0 бара компонентата да работи и кога сиот `theme/` слој ќе се тргне. Овде функционалноста не зависи од стиловите (класата останува во markup), но зависи од **имeнскиот речник** на темата: консумент што не го усвоил ashlar именувањето на формите нема да добие ниту една порака за грешка.

Полошо, dev линтерот ветува втора котва што изворот не ја имплементира:

```scss
// 2. Validation Nesting check: data-ln-validate must be wrapped inside .form-element or data-ln-form
[data-ln-validate]:not(.form-element [data-ln-validate]):not([data-ln-form] [data-ln-validate]) {
	@include dev-dom-error("data-ln-validate must be a child of .form-element or data-ln-form wrapper");
}
```

Поле внатре во `[data-ln-form]` но **без** `.form-element` предок го поминува dev линтерот молкум, а `:130` враќа `null` и цела error-render гранка (`:131-140`) се прескокнува. Корисникот добива токму состојбата што линтерот му вели дека ја избегнал: нула видливи пораки, без никаква дијагностика. `README.md:51` и `README.md:123` ја документираат само `.form-element` варијантата — значи `ln-validate-dev.scss:12` е изворот што лаже.

---

### 🟠 T6 — Единственото функционално CSS правило на компонентата цели атрибут што никој не го пишува

**Каде:** `ln-validate.scss:1-7` · `ln-validate.schema.json:12-17`

```scss
// ln-validate — Functional Empty Error Collapse
[data-ln-error]:empty {
	display: none;
}
```

Компонентата во JS работи со `data-ln-validate-error` (`src/ln-validate.js:8`) и `data-ln-validate-errors` (`:7`). Атрибутот `data-ln-error` нема **ниту еден** производител: `grep -rn "data-ln-error" components/ --include=*.scss --include=*.json` враќа само `ln-validate.scss:5` и `ln-validate.schema.json:12`; `grep -rn "data-ln-error" demo/ --include=*.html` (без `dist/`) враќа **нула**.

Два одделни проблема во едно правило:

1. **Име вон конвенција.** `data-ln-error` не е `data-ln-{component}-{attribute}` — тоа е глобално име во просторот на целата библиотека. §1: „Секое отстапување — скратен префикс, алијас, туѓо или глобално име — е наод."
2. **Мртво правило што се објавува.** Правилото се компајлира во `core.css` преку `theme/ln-ashlar-core.scss:24` и никогаш не се совпаѓа со ништо. Истовремено, скенерот го внесе како легитимен атрибут во схемата (`ln-validate.schema.json:12-17`, `"sources": ["ln-validate.scss"]`), од каде оди и во `components/ln-debug/src/generated-attributes.js:84` — значи библиотеката денес рекламира атрибут што не постои.

Ефектот што правилото го посакува (празен `<li>` да не зафаќа простор) е реален и корисен; само е врзан за погрешно име.

---

### 🟠 T7 — П2: `ln-validate:destroyed` постои и има нула консументи

**Каде:** `src/ln-validate.js:188`

```js
dispatch(this.dom, 'ln-validate:destroyed', { target: this.dom });
```

`grep -rn "ln-validate:destroyed" components/*/src demo/ docs/` дава точно три погодоци: самиот `dispatch` (`src/ln-validate.js:188`) и две **документациски табели** во демо страниците (`demo/admin/src/pages/validate.html:301`, `demo/admin/validate.html:518`). Нула `addEventListener` за тој настан во целата кодна база.

Плус, договорот е превртен токму како што П2 опишува: единствениот пат кој авто-уривањето го користи е `ln-core/helpers.js:878-893`, а таму `:889` проверува `!document.contains(item)` пред да го повика `destroy()` — јазолот е веќе откачен, па буклачкиот настан нема каде да стигне.

Настанот е документиран како дел од API-то (`README.md:109`), значи бришењето по П2 е и doc промена.

---

### 🟠 T8 — Мртва dev-афорданса: `dev-inline-error` качен на `<input>` / `<select>` / `<textarea>`

**Каде:** `ln-validate-dev.scss:5-9`

```scss
input[data-ln-validate]:not([id]),
select[data-ln-validate]:not([id]),
textarea[data-ln-validate]:not([id]) {
	@include dev-inline-error("data-ln-validate element is missing required 'id' attribute");
}
```

`dev-inline-error` пишува исклучиво во `::after` (`theme/config/mixins/_diagnostics.scss:29-37`). Сите три селектори се заменети елементи — `::before` / `::after` не се рендерираат на нив. Самата тема го знае ова: `theme/config/mixins/_diagnostics.scss:39-48` дефинира `dev-replaced-error` со коментар „Replaced elements do NOT render `::before`/`::after` generated content". Значи правило 1 од dev фајлот **не произведува ништо** — ниту текст, ниту визуелен сигнал.

Правило 2 (`:12-13`) користи `dev-dom-error` (`theme/config/mixins/_diagnostics.scss:11`), кој покрај `::before` поставува и `outline: 2px dashed` — outline-от се црта и на `<input>`, па тоа правило е **полу-живо**: развивачот гледа црвена испрекината рамка, но никогаш не ја гледа причината.

**Последица.** §3 бара „тоа што фали паѓа гласно (dev-scss порака)". Недостасувачкиот `id` — предуслов за `<label for>` спарување, што е суштината на пристапноста на едно поле — денес паѓа тивко. Тоа е осмиот случај на истиот образец во оваа кампања — `dev-inline-error` качен на заменет елемент.

### 🟠 T9 — `setCustomValidity` никогаш не се вика: платформата и компонентата даваат различен одговор на исто прашање (§1)

**Каде:** `src/ln-validate.js:19`, `:39`, `:126-128`, `:169`

`grep -rn "setCustomValidity" components/ --include=*.js` враќа **нула погодоци во
целата библиотека**. Custom грешките живеат во приватен JS Set:

```js
    19		this._customErrors = new Set();
    39			self._customErrors.add(error);
```

Она што го прави ова наод, а не отсуство на функција: компонентата **го чита**
нативниот `validity` објект и го меша со приватниот Set:

```js
   126		const validity = dom.validity;
   127		const isValid = isFieldValid(validity, this._customErrors.size);
   128		const activeErrors = resolveActiveErrorKeys(validity, this._customErrors);
```

И јавниот getter го прави истото (`:169`). Значи нативниот слот е **влез** за
компонентата, ама никогаш не е **излез** — половината од истината се враќа во него,
другата останува во JS.

§1 го именува точно ова: состојбата живее во DOM-от, секогаш, и нема приватно
огледало. Тука не е дури ни огледало — двата извора се **различни** и ниеден
не го знае другиот.

**Последица, три насоки:**

| Кој прашува | Што добива за поле невалидно само по custom правило |
|---|---|
| `component.isValid` (`:169`) | `false` — точно |
| `field.validity.valid` | **`true`** — неточно |
| `form.checkValidity()` | **`true`** — неточно |
| CSS `:invalid` | **не се совпаѓа** — неточно |

Тоа го засега и самиот гејт што компонентата го поставува: со `novalidate` на формата
(`:81-82`) платформата не ги прикажува своите пораки, па ништо не го открива
разминувањето на екран. Трет консумент — друга библиотека, серверски рендерер,
или обичен `form.checkValidity()` во авторски код — го гледа полето како валидно.

Ова е истиот облик како кај `ln-tabs` и `ln-time` во оваа кампања — DOM-от тврди едно,
компонентата друго — само што тука слотот што се заобиколува е нативен, не `data-ln-*`.

*(Заведено како набљудување во првиот нацрт. Подигнато во наод зашто клаузулата
може да се посочи: §1, и тоа во својата најостра форма — два извора на вистина
за едно тврдење, што се разминуваат.)*

---

## 🟡 Doc-drift

| # | наод | каде |
|---|---|---|
| 1 | README ја дава патеката на **бандлот** како извор: „Source: `components/ln-validate/ln-validate.js` (~160 lines)". Изворот е `src/ln-validate.js` (195) + `src/validate-model.js` (52); бандлот е една линија. Исто така „Imports only `dispatch`/`registerComponent` from `ln-core`" го премолчува увозот на моделот (`src/ln-validate.js:2`). | `README.md:135` |
| 2 | „Three fields per instance (`dom.lnValidate`): `dom`, `_touched`, `_customErrors`" — инстанцата има **девет** полиња: тие три (`:17-19`) плус `_onInput` (`:26`), `_onChange` (`:31`), `_onSetCustom` (`:36`), `_onClearCustom` (`:51`), `_onFormReset` (`:85`), `_onValidateRequest` (`:88`). | `README.md:139` |
| 3 | `validate()` е опишана како `nativeValid = dom.checkValidity()`; изворот чита `dom.validity` (`:126-127`). Разликата е значајна — `checkValidity()` испраќа нативен `invalid` настан, `.validity` не. Изворот е поисправен од докот. | `README.md:149` |
| 4 | Истото за `isValid` getter-от: „Pure read (`dom.checkValidity() && …`)"; изворот е `isFieldValid(this.dom.validity, this._customErrors.size)` (`:169`). | `README.md:168` |
| 5 | „keys NOT in the map are skipped — that's the mechanism that lets native and custom errors share one `<ul>`" — неточен опис. `:134-138` минува низ **сите** `[data-ln-validate-error]` јазли и ги крие сите што ги нема во `activeErrors`; custom клучевите се вклучуваат во `activeErrors` од `validate-model.js:42-48`, не се „прескокнуваат". Однесувањето е исправно, описот на механизмот не е. | `README.md:150` |
| 6 | „`attributes` (filtered to `data-ln-validate`)" — заедничкиот обсервер **не филтрира**: `ln-core/helpers.js:797-800` е `attributes: true, subtree: true, attributeOldValue: true`, а коментарот на `helpers.js:832-834` изречно вели „which no longer filter attributes at all". | `README.md:178` |
| 7 | „Removal is not observed — call `instance.destroy()` before detaching." Неточно: `ln-core/helpers.js:878-893` го набљудува `removedNodes` и вика `inst.destroy()` за секој откачен јазол. Докот бара од консументот рачна работа што веќе е автоматска. | `README.md:178` |
| 8 | Payload-от на `:valid` / `:invalid` е документиран како `{ target, field }`; изворот испраќа и трет клуч: `{ target, field: dom.name, errors: activeErrors }` (`:147`). Најкорисниот дел од payload-от е недокументиран. | `README.md:107-108` |
| 9 | „validation is completely visual-silent until a field receives its first user interaction" се коси со сопствената README:141 секција за initial-value патот и со `:115-119`. Двете тврдења се во ист документ. | `README.md:12` наспроти `README.md:141` |
| 10 | Табелата со атрибути во README ги наведува само трите `data-ln-validate*`; схемата носи и `data-ln-error` (мртов, T6) и `data-ln-debug` / `data-ln-form` (од dev SCSS-от, не се договор на оваа компонента). `direction` е `null` за `data-ln-validate` иако е чист author атрибут. | `README.md:59-63` наспроти `ln-validate.schema.json:6-30` |

## 🔵 Набљудувања — проверено, не подигнато

*(Секоја ставка е проверена и **не** е наод, зашто не може да се посочи клаузула што ја крши, или е вон опсегот. Ниту една не пропишува решение.)*

| # | набљудување | образложение |
|---|---|---|
| 1 | Нема `aria-describedby` врска меѓу полето и пораките | Компонентата пишува `aria-invalid` (`:48, :144`) но никогаш не ја врзува листата со грешки за полето. Читачот на екран соопштува „невалидно" без да каже зошто. Поврзувањето не е документирано како договор ниту во README, ниту во шемата — па нема клаузула што се крши. |
| 2 | Повеќе `data-ln-validate` полиња во еден `.form-element` делат една листа | `:132` зема `parent.querySelector('[data-ln-validate-errors]')` — **првата** листа во обвивката. Радио група (сите со `data-ln-validate`, по `:24` декларирано поддржани) дава N инстанци што пишуваат во исти `<li>` јазли. `reset()` е уште поширок: `:160` бара `parent.querySelectorAll` без ограничување на листата, па го брише и туѓото. |
| 3 | Submit гејтот е на bubble фаза, без capture | `:100`. `README.md:164` се потпира на тоа дека `ln-data-coordinator` чита `e.defaultPrevented` — тоа значи редоследот на врзување мора да биде гејт-прв. Редоследот денес е имплицитен (кој компонент прв ќе се иницијализира), не изнуден. Доктрината не пропишува фаза на слушање, па нема клаузула што се крши; се бележи само дека редоследот е имплицитен, не изнуден. |
| 4 | `_onSetCustom` дуплира логика од `validate()` | `:44-48` рачно ја откива пораката и ги превклучува класите наместо да го помине истиот render пат. Двата пата мора рачно да се држат во синхрон; README-то тоа го нарекува „asymmetry" (`:158`) и го документира како договор, но тоа е втора имплементација на истата работа. |

## Затечена состојба — без пресуда

- **ПОВЛЕЧЕН НАОД (бивш T10) · пресуда 2026-09-12.** Аудитот ги пријавуваше
  `ln-validate:set-custom` и `:clear-custom` (`:76`, `:77`) како §4 прекршок. По §4.1
  двата случаја се разликуваат:

  - **`:set-custom` е легитимен.** Тој е `set-{noun}` форма — испраќачот ја турка
    грешката внатре, компонентата нема што да одлучува. Истата фамилија како
    `ln-table:set-data`, `ln-stat:set-count`, `ln-editor:set-content` — 12 настани
    во 7 компоненти.
  - **`:clear-custom` останува отворено.** Тој е гол глагол на слушач врзан за
    host (`dom.`, `:77`), додека неговиот парњак `set-custom` (`:76`) стои на
    истиот host со префикс. Пописот на целата библиотека покажа дека ова е
    **единствениот** таков случај: секој друг гол влезен глагол е модулен
    слушач на `window`/`document`, каде адресат воопшто нема
    (`ln-toast:enqueue`/`:clear`, `ln-http:request`/`:cancel`, `ln-fill:request`).
    Тука адресат има, па отсуството на префикс е расчекор **внатре во една
    компонента**. Заведено е како §8 виљушка 2 (в) и не се пресудува тука.

  Шестте настани и нивната насока остануваат заведени во Drift табелата.

**§8 · BEM компаунди — не ја допира.** Единствените класи што компонентата ги пишува се `ln-validate-valid` / `ln-validate-invalid` (`src/ln-validate.js:9-10`) и `hidden` (`:44, :58, :64, :137, :162`). Ниту една не е BEM компаунд — нема `__` елементи ниту `--` модификатори. Класата што ја **чита** (`.form-element`, `:41, :53, :130, :158`) е генеричка со цртичка, не компаунд. Нема што да се пријави по оваа виљушка.

**Празнина во рецептот на П4 за оваа компонента, не во самата пресуда.** П4 го пропишува правилото во форма опфатена со host атрибутот:

```scss
[data-ln-list] [data-ln-list-selected-wrap][hidden] { display: none; }
```

Кај `ln-validate` host-от е самиот `<input data-ln-validate>` (`:194`), а скриениот јазол е `<li data-ln-validate-error>` внатре во `<ul data-ln-validate-errors>` — **сестра** на input-от во `.form-element`, не негов потомок. Селектор од обликот `[data-ln-validate] [data-ln-validate-error][hidden]` никогаш не би се совпаднал. Работливата форма со иста специфичност (0,2,0) би била опфатена со контејнерот на пораките, `[data-ln-validate-errors] [data-ln-validate-error][hidden]`, а не со host-от. Ова е имплементациска забелешка за чекор 5, не тврдење дека П4 греши.

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-validate` | `src/ln-validate.js:5, :194` (корен, author) | `:61` ✔ | `:24-30` — `direction: null` (треба `author`) |
| `data-ln-validate-errors` | `src/ln-validate.js:7, :132` (author) | `:62` ✔ | `:37-42` — `direction: "author"` ✔ |
| `data-ln-validate-error` | `src/ln-validate.js:8, :43, :134, :160` (author) | `:63` ✔ | `:31-36` — `direction: "author"` ✔ |
| `data-ln-error` | `ln-validate.scss:5` — **нула производители** | отсутен | `:12-17` — заведен како атрибут на компонентата ❌ |
| `data-ln-debug` | `ln-validate-dev.scss:3` (туѓ host атрибут) | отсутен | `:6-11` — скенерски артефакт |
| `data-ln-form` | `ln-validate-dev.scss:12` (туѓ, и JS-от не го чита — T5) | отсутен | `:18-23` — скенерски артефакт |
| `novalidate` | `src/ln-validate.js:82` (пишува JS, не се брише) | `:14-22, :126-129` ✔ | n/a (нативен) |
| `aria-invalid` | `src/ln-validate.js:48, :144, :156, :187` | недокументиран | n/a (нативен) |
| `.ln-validate-valid` / `.ln-validate-invalid` | `src/ln-validate.js:9-10, :142-143`; стил во `theme/components/_form.scss:103, :107` | `:124` — документирани како договор ❌ (П1) | n/a (класа) |
| `.hidden` | `src/ln-validate.js:44, :58, :64, :137, :162`; дефиниција само во `theme/utilities/_utilities.scss:16` | `:41-45` — авторски `class="hidden"` ❌ (П4) | n/a (класа) |
| `.form-element` | `src/ln-validate.js:41, :53, :130, :158` (се чита) | `:51, :123` ✔ | n/a (класа) |
| `ln-validate:valid` / `:invalid` | `src/ln-validate.js:146-147` — payload `{target, field, errors}` | `:107-108` — payload без `errors` ⚠ | n/a |
| `ln-validate:set-custom` | `src/ln-validate.js:76` | `:115` ✔ | n/a |
| `ln-validate:clear-custom` | `src/ln-validate.js:77` | `:116` ✔ | n/a |
| `ln-validate:request-validate` | `src/ln-validate.js:96, :102` | `:117` ✔ | n/a |
| `ln-validate:destroyed` | `src/ln-validate.js:188` — 0 консументи | `:109` ✔ (но П2 го брише) | n/a |
