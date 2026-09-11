# Аудит — ln-chart

**Датум:** 2026-09-11 · **Итерација:** 43/50 · **Слој 5 — рендерери и упит**
**Опсег:** `src/ln-chart.js` (169), `src/chart-model.js` (154), `README.md` (143), `ln-chart.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Најдисциплинираниот рендерер во слојот — единствениот што крие преку нативниот `hidden`
атрибут наместо преку класа, со целосно усвоен чист модел покриен со тестови и README што
нигде не тврди нешто што кодот не го прави — но и единствената компонента во целата
кампања со **нула авторски појавувања во репозиториумот**, чиј `destroy()` ги остава сите
создадени елементи зад себе.

---

## Што е добро

**Крие со `hidden` атрибут, не со класа.** `:103`, `:107`, `:112` —
`toggleAttribute('hidden', …)`. Тоа е точно она што пресудата за core/theme расцепот го
пропишува (*криењето оди преку нативниот `hidden`, `.ln-hidden` не постои*), и `ln-chart`
е **првата и единствената** компонента во кампањата што го прави. Спореди со `ln-list`
(L4) и `ln-table` (T12) кои палат `.hidden` — класа што `ln-ashlar-core.scss` воопшто не
ја носи.

**Моделот е чист и целосно усвоен.** `chart-model.js` — нула `window`/`document`/
`localStorage`, три извози, сите три увезени и повикани (`:64`, `:98`, `:133`). Ниту еден
мртов извоз, за разлика од `ln-sort` (`SORT_DIRECTIONS`). Втор таков случај по `ln-table`.

**Пресметката на доменот ги покрива дегенерираните случаи експлицитно.**
`chart-model.js:101-109` — кога `domainMin === domainMax`, трите гранки (нула, позитивно,
негативно) даваат употреблив опсег наместо делење со нула. И `:119` — единечна точка се
центрира на `0.5` наместо да падне на `0/0`.

**Празниот модел враќа `null`, не `0`.** `chart-model.js:80-81` — `min: null, max: null`.
Потоа `formatNumber(null, locale)` враќа `''` (`ln-core/number.js`, првиот ред: сè што не
е конечен број → празен стринг). Значи празен график покажува празни ќелии, не лажна
нула. Тоа е точно обратното од **SYS-2** и вреди да се именува: некој свесно го одбрал
`null` наместо `0`.

**`clampPadding` не дозволува padding да го изеде графикот.** `chart-model.js:14` —
`Math.min(parsed, Math.min(width, height) / 2)`. Без тоа `data-ln-chart-padding="500"` на
`viewBox="0 0 1000 320"` дава негативна корисна висина.

**README-то не тврди ништо што кодот не го прави.** По `ln-table` (пет лажни тврдења) и
`ln-search` (едно доктринарно), ова е освежување: `data-ln-chart-sort` е точно опишан како
*„Optional store/API sort **passed with** `request-data`"* (`:78`) — не како локално
сортирање; `:137` вели дека компонентата никогаш не чита store или конектор — точно;
`:141` вели дека моделот е покриен со Node тестови — точно, два фајла.

---

## Наоди

### 🟠 CH1 — `.ln-chart--empty` се пали при секој рендер, и ниту едно CSS правило не ја чита

**Каде:** `src/ln-chart.js:111`

```js
const isEmpty = model.count === 0;
this.dom.classList.toggle('ln-chart--empty', isEmpty);
```

**Извор на правилото:** `docs/architecture/mindset.md:66` — *„JS only toggles `.ln-*`
state classes or semantic attributes. **CSS translates those to visual output.**"*, со
спарен пример на `:71`.

```
grep -rn "ln-chart--" --include=*.scss .
→ components/ln-chart/ln-chart.scss:5:   .ln-chart--loading .chart__plot { … }
```

Една класа стилизирана, другата не — во **истиот** фајл од седум линии. Не постои
`.ln-chart--empty` ниту во ко-лоцираниот SCSS, ниту во `theme/`, ниту во демото (кое не
постои, CH3).

Двојно е интересно што празната состојба **веќе е решена подобро** три реда подолу:
`:112` — `this.empty.toggleAttribute('hidden', !isEmpty)` го крие/покажува авторскиот
`[data-ln-chart-empty]` елемент преку нативен атрибут. Класата на `:111` е втор,
паралелен сигнал за истата состојба, што никој не го консумира.

**SYS-24, трета потврда** по `ln-sortable` SB2 (четири класи) и `ln-list` L6 (една).

---

### 🟠 CH2 — `destroy()` ги остава сите создадени елементи и целата состојба

**Каде:** `:139-147`

```js
_component.prototype.destroy = function () {
	if (!this.dom[DOM_ATTRIBUTE]) return;
	this.dom.removeEventListener('ln-chart:set-data', this._onSetData);
	this.dom.removeEventListener('ln-chart:set-loading', this._onSetLoading);
	this.dom.removeEventListener('ln-chart:request-refresh', this._onRefresh);
	this._data = [];
	this.model = null;
	delete this.dom[DOM_ATTRIBUTE];
};
```

Слушачите се тргнати коректно. Она што останува:

| остаток | запишано на | вид |
|---|---|---|
| `aria-busy="true"/"false"` | `:70` | ARIA на домаќинот |
| `.ln-chart--loading` | `:69` | state класа |
| `.ln-chart--empty` | `:111` | state класа |
| `points="…"` на `[data-ln-chart-line]` | `:102` | геометрија |
| `points="…"` на `[data-ln-chart-area]` | `:106` | геометрија |
| `hidden` на line/area/empty | `:103`, `:107`, `:112` | видливост |
| `textContent` на min/max/count | `:115-117` | текст |
| **сите label елементи во `[data-ln-chart-labels]`** | `:92` `appendChild` | **создаден DOM** |

Последниот ред е тежината овде. **SYS-9** досега значеше заостанат ARIA или состојбен
атрибут; ова е првиот случај каде `destroy()` остава цело дрво елементи што компонентата
самата го создала. `_renderLabels:75` знае да ги исчисти (`this.labels.replaceChildren()`)
— тој повик едноставно не е повторен во `destroy()`.

**Извор на правилото:** `DOCTRINE.md:105` — **Destroyed Component Invariant**; плус
`_checklist.md` A група (`destroy()` што ги чисти сите слушачи, тајмери и состојба).

**Достижност:** `destroy()` се вика автоматски од `ln-core` кога домаќинот се вади од
DOM-от — таму сè заминува заедно. Реалниот случај е експлицитен `el.lnChart.destroy()`
додека `<figure>`-от останува: графикот ја задржува целата исцртана геометрија и сите
етикети, како да е сè уште жив.

---

### 🟡 CH3 — Нула авторски појавувања во целиот репозиториум

```
grep -rln "data-ln-chart" --include=*.html .
→ (празно)
```

Ниту едно. Ни во `demo/admin/src/`, ни во компајлираните страници, ни во `spa-starter/`.
Единствената компонента во кампањата досега без **ниту еден** консумент — `ln-list` имаше
еден, `ln-table` шест, `ln-sortable` една демо страница.

Другата страна на врската **е** изградена: `ln-data-coordinator` го слуша
`ln-chart:request-data` (`src/ln-data-coordinator.js:767`), го мапира преку
`data-ln-chart-source` (`:792`, `:924-925`) и го отстранува при уништување (`:1042`).
Значи и координаторската патека никогаш не била извртена.

Тоа не е дефект во кодот — тоа е единствената компонента во библиотеката што никогаш не
поминала низ прелистувач во овој репозиториум. Сите наоди овде се од читање, зашто нема
што да се набљудува.

README:142 го признава обемот сам: *„The **v1** contract intentionally excludes
multi-series legends, interaction, and tooltips."*

---

### 🟡 CH4 — `this.name` е замрзната копија, `this.source` се освежува — во истиот фајл

**Каде:** `:17` наспроти `:129`

```js
this.name   = dom.getAttribute(DOM_SELECTOR) || '';               // :17 — еднаш, засекогаш
this.source = dom.getAttribute('data-ln-chart-source') || this.name;   // :18
…
_component.prototype.requestData = function () {
	this.source = this.dom.getAttribute('data-ln-chart-source') || this.name;   // :129 — се освежува
```

`source` се пречитува при секое барање; `name` никогаш. А `name` е идентитетот на
компонентата — влегува во `ln-chart:rendered` (`:121`), во `ln-chart:request-data`
(`:131`) и во името на шаблонот за етикети (`:78`, `this.name + '-label'`).

Регистрацијата го набљудува `data-ln-chart` (селекторот влегува во `observedAttributes`
автоматски), а `onAttributeChange` (`:159-167`) за него паѓа во последната гранка:
`instance._render()` — прецртува со **старото** име. Нов шаблон за етикети не се наоѓа,
а настанот носи идентитет што повеќе не е на елементот.

`_checklist.md` B група: *`data-ln-*` е единствен извор на вистина, без приватно огледало*.
Ова е една од 58-те копии што инверзијата на атрибутната реактивност (`3628e7d`) ги
таргетира; особеното е што `source` веќе е поправен во истиот фајл, а `name` не.

**Достижност:** преименување на график во тек на работа — нема консумент (CH3), значи
теоретски. Заведено заради несогласноста во истиот фајл.

---

### 🟡 CH5 — Нема `## 🔧 Internals`

README-то завршува со „Architecture notes" (`:135-143`) — четири буллети. Тоа не е
Internals секција: не објаснува ниту еден механизам што компонентата го прави
нетривијално — редоследот на подигање (конструктор → `requestData()` → чекање), фактот
дека `_render()` **никогаш** не се вика при конструкција, разрешувањето на шаблонот за
етикети преку `{chartName}-label`, или тоа што `onAttributeChange` прецртува за секој
неспомнат атрибут.

**SYS-22**, една од девет. Заедно со тоа: README скелетот е поинаков од секој сестрински
— наслов во backtick-и (`# \`ln-chart\``), нула emoji наслови, „Attributes" наместо
„🛠️ Attributes Reference", „Authored child roles" секција што ниту една друга нема.

---

### 🟡 CH6 — Схемата носи туѓ атрибут; README носи временска ознака

**Схема:** `data-ln-template` е заведен со `"sources": ["src/ln-chart.js"]`. Тој атрибут
му припаѓа на `ln-core` (системот за шаблони); `ln-chart` само го чита, во конкатениран
селектор на `:79`:

```js
const selector = '[data-ln-template="' + templateName + '"]';
```

Скенерот ја гледа литералната половина и го запишува како атрибут на `ln-chart`.
**SYS-15**, ист механизам како кај `ln-search` S8 — течење преку селектор-стринг.

**README:142** — *„The **v1** contract intentionally excludes…"*. **SYS-5**, четврта
појава по `ln-slug`, `ln-stat`, `ln-options`. Доктрината за докови бара финална состојба
без временско скеле.

---

### 🟡 CH7 — Нема `ln-chart:destroyed`; два документирани клуча се игнорираат

**`ln-chart:destroyed`** не постои — **SYS-23**, во групата од 27.

**README:104** — *„`ln-chart:set-data` `{ data, total?, filtered? }` — replaces the
current dataset and renders it."* Изворот (`:33-34`) чита само `detail.data`:

```js
const detail = event.detail || {};
self._data = Array.isArray(detail.data) ? detail.data : [];
```

`total` и `filtered` се примаат и тивко се фрлаат. Тие се означени како опционални, па не
е лага — но `[data-ln-chart-count]` покажува `model.count` (исцртани точки), што кај
прозорчен извор нема да е вкупниот број. Договорот не кажува кој од двата броја се
покажува.

---

### 🔵 P1 — Двојна проверка за шаблонот, и скенирање на цел документ по рендер

```js
const selector = '[data-ln-template="' + templateName + '"]';
if (!this.dom.querySelector(selector) && !document.querySelector(selector)) return;   // :80

const prototype = cloneTemplateScoped(this.dom, templateName, 'ln-chart');
if (!prototype) return;                                                                // :83
```

`cloneTemplateScoped` веќе враќа `null` кога шаблонот го нема, и `:83` го обработува тоа.
Значи `:79-80` е предпроверка што ја дуплира следната. И носи `document.querySelector`
низ цел документ при **секое** прецртување — додека `cloneTemplateScoped` веќе го знае
опсежното барање.

---

### 🔵 P2 — Седум `__` компаунди, сите во блупринтот на README-то

`.chart__plot` (`:31`), `.chart__area` (`:37`), `.chart__line` (`:38`), `.chart__labels`
(`:41`), `.chart__label` (`:43`), `.chart__empty` (`:49`), `.chart__summary` (`:50`) —
сите дефинирани во `theme/config/mixins/_chart.scss:23-77`.

Тоа е најголемата појава на **SYS-11** во кампањата (`ln-circular-progress` имаше четири).
Разликата е што овде компаундите не доаѓаат од JS — се авторски класи во markup, и токму
README-то ги учи.

**Зошто 🔵, а не 🟠:** забраната за BEM компаунди е делегирана на
`docs-mcp/doctrine/scss-architecture.md` (`DOCTRINE.md:145`), кој е **надвор од опсегот**
на оваа кампања. Во опсежните документи единствената појава е `reference.md:82` („no BEM
classes"), и таа се однесува на конкретен случај (коренот на модалната форма). Немам
цитирлив извор во опсег — значи предлог, слободно одбиј.

---

### 🔵 P3 — Два тест фајла за истиот модул, пет теста дуплирани збор-по-збор

`tests/chart-model.test.js` (5 теста) и `tests/ln-chart.test.js` (6 теста) обата увезуваат
**од `chart-model.js`**. Сите пет теста од првиот постојат во вториот со **идентични
имиња**:

```
'chart model can use the observed value range without forcing zero'      ×2
'chart model ignores non-numeric values and centers a single point'      ×2
'chart model maps an ordered dataset into line and area geometry'        ×2
'chart model uses the zero line as area baseline for mixed values'       ×2
'chart viewBox parser accepts SVG syntax and rejects invalid dimensions' ×2
```

Разликата е еден тест за `parseChartSort`. Значи `chart-model.test.js` е строг подмножество.
И фајлот именуван по компонентата не тестира ниту една линија од `ln-chart.js` — само
моделот.

Тестовите се надвор од опсегот на аудитот; заведено само затоа што README:141 се повикува
на нив (*„covered by Node behavioral tests"*) — тврдењето е точно за моделот, не за
компонентата.

---

### 🔵 P4 — `aria-busy` отсуствува до првиот настан

`_setLoading` (`:68-71`) е единственото место што го запишува `aria-busy`, а се вика само
од `_onSetData` (`:36`) и `_onSetLoading` (`:40`). Конструкторот испраќа
`ln-chart:request-data` (`:50`) и чека — во тој интервал графикот е празен и нема
`aria-busy`, иако токму тогаш е зафатен.

---

### 🔵 P5 — `polygon` како вредносен алијас на `area`

`:63` — `type === 'area' || type === 'polygon' ? 'area' : 'line'`; README:77 го документира
(*„`polygon` aliases `area`"*).

Пресудата за отсуство на алијаси се однесува на **имиња** на атрибути и настани, не на
вредности, па формално не е прекршување. Заведено затоа што е единствениот вредносен
алијас во библиотеката, и затоа што вториот назив не носи ништо — `<polygon>` е
елементот, `area` е режимот.

---

### 🔵 P6 — `onAttributeChange` прецртува за секој неспомнат атрибут

`:159-167` — две имиња се обработени поединечно (`-source`, `-sort` → `requestData()`),
сè друго паѓа на `instance._render()`. Тоа ги покрива петте геометриски атрибути точно,
но и `data-ln-chart` самиот (CH4). Експлицитна листа наместо `else` би ја затворила таа
гранка.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-chart` | `:5`, `:17` | ✅ `:73` | ✅ `author` |
| `data-ln-chart-source` | `:18`, `:129` | ✅ `:74` | ✅ `author` |
| `data-ln-chart-x` / `-y` | `:59`, `:60` | ✅ `:75-76` | ✅ `author` |
| `data-ln-chart-type` | `:57`, `:63` | ✅ `:77` | ✅ `author` |
| `data-ln-chart-sort` | `:133` | ✅ `:78` | ✅ `author` |
| `data-ln-chart-padding` | `:55` | ✅ `:79` | ✅ `author` |
| `data-ln-chart-zero` | `:61` | ✅ `:80` | ✅ `author` |
| `data-ln-chart-plot` | `:19` | ✅ `:86` | ✅ `author` |
| `data-ln-chart-line` / `-area` | `:20`, `:21` | ✅ `:87-88` | ✅ `author` |
| `data-ln-chart-labels` | `:22` | ✅ `:89` | ✅ `author` |
| `data-ln-chart-empty` | `:23` | ✅ `:90` | ✅ `author` |
| `data-ln-chart-min/max/count` | `:24-26` | ✅ `:91` | ✅ `author` |
| `data-ln-template` | `:79` (само се чита) | ⚠️ само во примерот `:42` | ⚠️ присвоен (CH6) |
| `.ln-chart--loading` | `:69` | ✅ `:107` | n/a — стилизирана `ln-chart.scss:5` |
| `.ln-chart--empty` | `:111` | ❌ недокументирана, **без CSS** (CH1) | n/a |
| `aria-busy` | `:70` | ✅ `:106` | n/a — преживува `destroy()` (CH2) |
| `ln-chart:request-data` | `:130` | ✅ `:97` | n/a |
| `ln-chart:rendered` | `:120` | ✅ `:99` | n/a |
| `ln-chart:set-data` | `:46` | ⚠️ `:104` — `total`/`filtered` игнорирани (CH7) | n/a |
| `ln-chart:set-loading` | `:47` | ✅ `:106` | n/a |
| `ln-chart:request-refresh` | `:48` | ✅ `:108` | n/a |
| `ln-chart:destroyed` | ❌ не постои | ❌ | n/a |
| `requestData()` јавен метод | `:128` | ❌ неспомнат како API | n/a |
| `## 🔧 Internals` | — | ❌ „Architecture notes", 4 буллети (CH5) | n/a |

---

## Затечена состојба

### Компонентата е напишана, врзана и никогаш вклучена

Трите слоја постојат: компонентата (`src/ln-chart.js`), моделот со тестови
(`chart-model.js` + два тест фајла), и координаторската врска
(`ln-data-coordinator.js:767`, `:792`, `:924-925`, `:1042`). Отсуствува само последното —
markup. Ниту едно `data-ln-chart` во ниту еден `.html` фајл.

Тоа го менува и начинот на читање на овој извештај: наодите се исклучиво од читање код.
Ништо овде не е потврдено во прелистувач, зашто нема што да се отвори.

### Атрибутите се сите `author`, и тоа е точно

Осумнаесет записи во схемата, сите со `direction: "author"` освен `data-ln-debug` и
`data-ln-template`. Компонентата **не запишува ниту еден `data-ln-*`** — сето нејзино
пишување оди во `points`, `hidden`, `aria-busy`, `textContent` и две класи. Тоа е чиста
поделба: атрибутите се влез, DOM-от е излез. Ниту една друга компонента во слој 5 не е
толку еднонасочна.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:16`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ **обратното** — `Number.isFinite` провери на `:56`, `:62`; празен модел враќа `null`, не `0` |
| SYS-3 (Internals → компајлиран bundle) | n/a — нема Internals (CH5) |
| SYS-7 (`.hidden` / `.sr-only` од theme) | ✅ **единствената компонента што користи нативен `hidden`** |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` |
| SYS-13 (зашиен кориснички текст) | ✅ нула — броевите одат преку `formatNumber(…, getLocale(dom))` |
| SYS-14 (состојба надвор од `data-ln-*`) | ✅ |
| SYS-18 (препишан `shouldIgnoreClick`) | ✅ нема клик слушачи воопшто |
| `file:///` апсолутни патишта | ✅ не е меѓу 16-те |
| модел фајл | ✅ целосно усвоен, 3/3 извози живи |

---

## Отворени прашања за тебе

1. **CH1 — `.ln-chart--empty` се брише или добива правило?** Празната состојба веќе е
   решена подобро три реда подолу преку `hidden` на `[data-ln-chart-empty]`. Класата
   изгледа како втор сигнал што никој не го побарал.

2. **CH2 — `destroy()` да го врати исцртаното?** Најмалку `this.labels.replaceChildren()`
   — повикот веќе постои на `:75`. Прашањето е дали `destroy()` воопшто должи да ја врати
   геометријата (`points=""`), или уништувањето значи „замрзни како што е".

3. **CH3 — демо страница за `ln-chart`?** Ако компонентата остане во библиотеката, таа е
   единствената без начин да се провери. Ако нема да се врзува, дали координаторската
   половина (`ln-data-coordinator` ×4 места) останува?

4. **CH7 — кој број го покажува `[data-ln-chart-count]`?** Сега е бројот на исцртани
   точки. Ако `set-data` носи `total`, договорот треба да каже кој од двата е.

5. **P3 — `tests/chart-model.test.js` наспроти `tests/ln-chart.test.js`.** Едниот е строг
   подмножество на другиот. Ако се задржува само еден, кој?

---

**Наоди:** 🔴 0 · 🟠 2 · 🟡 5 · 🔵 6
