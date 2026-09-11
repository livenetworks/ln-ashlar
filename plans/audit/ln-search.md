# Аудит — ln-search

**Датум:** 2026-09-11 · **Итерација:** 31/50 · **Слој 3 — форма и влез**
**Опсег:** `src/ln-search.js` (313), `README.md` (133), `ln-search.schema.json` · **Ревизор:** Opus 5

> **Забелешка за редоследот:** оваа итерација беше прескокната во кампањата (се скокна
> од 30 `ln-translations` на 32 `ln-http`) и се доврши по 40. Наодите не зависат од
> редоследот — нема компонента аудитирана меѓу 32 и 40 што ја менува оценката овде.

---

## Вердикт

Двохостниот раздел (Control пишува атрибут → State Host реагира) е најчистата примена
на Attribute Bridge обрасецот во библиотеката и е буквално примерот што `DOCTRINE.md:63`
го наведува по име — но реакцијата на тој атрибут не носи никаква пригушувачка ограда,
па во hash режим секој притиснат тастер запишува нова ставка во историјата на
прелистувачот, а трите документи во репото даваат три различни одговори на прашањето кој
го должи debounce-от.

---

## Што е добро

**Компонентата е именуваниот пример на доктрината и го исполнува дословно.**
`DOCTRINE.md:63` — *„**Instant DOM Attribute Writes:** Prototype methods and input
controls MUST write state directly to target DOM attributes via `setAttribute` (e.g. …
`target.setAttribute('data-ln-search', input.value)`)."* Тоа е точно `_write` (`:180-185`),
до последниот аргумент.

**Двата хоста се навистина независни.** `_stateComponent` (`:70`) не знае ништо за
контролите освен преку `document.querySelectorAll` по `id`; `_controlComponent` (`:160`)
не знае ништо за филтрирањето. Ниту еден од двата не држи референца кон другиот. Затоа
повеќе контроли на иста цел работат бесплатно (`_syncControls`, `:59-66`) — без регистар,
без broadcast, без координатор.

**Ехо-заштитата е решена со споредба, не со знаменце.** `_write` (`:183`) се откажува ако
атрибутот веќе ја има вредноста; `_syncAttribute` (`:291`) се откажува ако терминот не се
сменил; `_syncControls` (`:64`) пишува во `input.value` само ако се разликува; `hashSet`
(`ln-core/hash.js:58`) е no-op на идентичен hash. Четири независни прекини на циклусот,
ниту еден `_isUpdating` boolean. Тоа е поисправно од половина компоненти во кампањата.

**Исклучувањето има две значења и обете се точно имплементирани.**
`data-ln-search-exclude` на коренот на ставката ја вади од филтрирање (`:139`), на
потомок го вади поддрвото од текстот за пребарување (`:45`). Истиот атрибут, два слоја,
нула двосмисленост во кодот.

**`_destroyed` знаменцето постои и се почитува.** `:73`, проверено во `_onHashChange`
(`:80`), во `queueBoot` повикот (`:95`) и во `_syncAttribute` (`:280`). Тоа е токму
**Destroyed Component Invariant**-от од `DOCTRINE.md:105`, и малку компоненти во
кампањата го имаат така конзистентно.

**Кешот на текстот има инвалидација.** `onSubtreeChange` (`:303-309`) го брише
`_lnSearchText` при DOM промена. Непотполна е (види P1), но постои — за разлика од
`ln-sort` каде `th.cellIndex` се снима и никогаш не се освежува.

---

## Наоди

### 🔴 S1 — Во hash режим секој притиснат тастер запишува ставка во историјата

**Каде:** `src/ln-search.js:120-122` · `:191-193` · `ln-core/hash.js:59`

Синџирот, без ниту еден прекин помеѓу:

```
input event (:195)
  → _onInput (:191)          нема debounce
  → _write (:180)            target.setAttribute('data-ln-search', value)
  → споделен обсервер        микротаск
  → _syncAttribute (:295)    instance._apply()
  → _apply (:120)            hashSet(this.nsKey, this.term)
  → hash.js:59               location.hash = next
```

`location.hash = …` **додава ставка во историјата на прелистувачот.** Тоа не е
`replaceState` — коментарот на `hash.js:12-13` изречно вели *„Write mechanism:
`location.hash =` … **Never pushState here**"*, што се однесува на History API-то; самото
доделување на `location.hash` сепак турка нова ставка.

Значи куцање на `john` во hash-овозможена пребарувалка дава четири ставки во историјата:

```
#demo-hash-list-search:j
#demo-hash-list-search:jo
#demo-hash-list-search:joh
#demo-hash-list-search:john
```

Бришењето назад додава уште четири. Копчето **Назад** на прелистувачот престанува да ја
напушта страницата — корисникот мора да го притисне осум пати за да се врати од каде
дошол, буква по буква во обратен редослед.

Дополнително, секој од тие записи испраќа `hashchange`, што го буди `_onHashChange`
(`:79-88`) на секоја инстанца — четири целосни кружни патувања што не прават ништо, зашто
вредноста веќе се совпаѓа (`:83`).

**Достижност — докажана во самото демо:**

```html
<!-- demo/admin/search.html:610 -->
<input type="search" placeholder="Type to sync to URL hash..."
       data-ln-search-for="demo-hash-list" data-ln-search-debounce="0" data-ln-hash>
```

`data-ln-hash` на контролата се разрешува преку `_resolveSearchHashNamespace:22-28`.
README:67 го документира како поддржан opt-in (*„Opt-in. Synchronizes search query to URL
hash fragment"*) без ниту еден збор предупредување.

**Забелешка:** `ln-sort` и `ln-filter` исто пишуваат во hash преку истиот `hashSet`, но
нивните записи се врзани за дискретни кликања. `ln-search` е единствената компонента во
библиотеката што вика `hashSet` по притиснат тастер.

---

### 🟠 S2 — Реакцијата врши тешка работа без пригушување, и доктрината бара таму да биде

**Каде:** `_apply` (`:115-147`), достигнат од `_syncAttribute` (`:295`) на секоја промена
на атрибутот

**Извор на правилото:** `DOCTRINE.md:64` — *„**Attribute-Reaction Debouncing:** When a
component's own reaction to an attribute change performs debounced work (fetches, heavy
renders), **the debounce lives inside that reaction** — declared via `effects` /
`onAttrChange` in `registerComponent`, or inside an `observeAttributes` handler …
**never in the writer's input event handler.**"*

Писателската страна е исправна — `_onInput` (`:191`) пишува веднаш и не пригушува ништо,
точно како што доктрината бара. Реакциската страна не носи ништо. Што прави `_apply` по
притиснат тастер:

| линија | работа |
|---|---|
| `:120-122` | `hashSet` → `location.hash =` (S1) |
| `:124` | `parseSearchFields` + `getAttribute` |
| `:125` | `dispatchCancelable('ln-search:change')` |
| `:134` | `dom.querySelectorAll(itemsSelector)` |
| `:136-146` | циклус низ **сите** ставки: `removeAttribute`, `hasAttribute`, `_searchText`, `matchesSearchTokens`, `setAttribute` |
| `:61` (преку `_syncControls`) | `document.querySelectorAll` низ цел документ |

Кај консументите тоа е потешко. `ln-data-store` го слуша настанот
(`src/ln-data-store.js:295-302`), го откажува, и го поставува `query.search` што повикува
`_emitQueryChanged` — **едно барање по притиснат тастер**. `ln-table:123` и `ln-list:137`
исто откажуваат безусловно и почнуваат сопствен циклус.

Регистрацијата користи `onAttributeChange` (`:302`) — наследната патека В — а не
`effects`/`onAttrChange` што доктрината ги именува како местото каде пригушувањето се
декларира.

**Дополнително — `docs/architecture/overview.md:103` тврди дека пригушувањето постои:**

> | **ln-search** | `data-ln-search` | Captures input keystrokes, **debounces them**, and dispatches search queries. |

Не постои. Ниту еден `setTimeout`, `debounce`, `throttle` или `requestAnimationFrame` во
целиот `src/ln-search.js` (grep: нула). **SYS-19**, овој пат во доктринарен документ, не
во README на компонентата.

---

### 🟠 S3 — `data-ln-search-fields` се парсира, се проследува, и никој не го чита

**Каде:** `:124` (парсирање), `:129` (проследување во `detail`)

**Извор на правилото:** `DOCTRINE.md` §2 — **No Speculative Code.**

Целата патека, проверена со grep:

| алка | состојба |
|---|---|
| `parseSearchFields` во `ln-core/matching.js:26` | извезен од `ln-core/index.js:11` |
| консументи на `parseSearchFields` | **точно еден** — `ln-search.js:124` |
| `detail.fields` читатели | **нула** — `ln-table`, `ln-list` и `ln-data-store` читаат само `detail.term` |
| `data-ln-search-fields` во авторски markup | **нула** — само во доковите табели (`demo/admin/search.html:330`) |

`ln-data-store` е местото каде полињата би имале смисла — тој има сопствени
`_searchFields` од `data-ln-data-store-search-fields` (`ln-data-store.js:222`). Ама
неговиот `ln-search:change` слушач (`:295-302`) го игнорира `detail.fields` целосно и
става само `term`. Значи **двата механизма за исти полиња постојат паралелно**, едниот
жив, едниот мртов.

README:62 и README:90 го документираат како дел од договорот.

---

### 🟠 S4 — Пет стратегии за наоѓање цел на „избриши", а пропишаниот markup паѓа на последната

**Каде:** `_resolveTargetAndInputFromClearBtn` (`:208-255`)

**Извор на правилото:** `DOCTRINE.md` §2 — **No Speculative Code.**

Функцијата пробува пет пати, по редослед:

| # | линија | стратегија |
|---|---|---|
| 1 | `:209` | експлицитен `data-ln-search-clear-for` |
| 2 | `:217` | `btn.closest('[data-ln-search]')` — копчето е **внатре** во целта |
| 3 | `:224` | `btn.closest('[data-ln-table-source], [data-ln-list-source]')` |
| 4 | `:235` | `btn.closest('[data-ln-search-for]')` — атрибутот на **предок** |
| 5 | `:243` | `btn.parentElement.querySelector('[data-ln-search-for]')` |

Сега го земаме markup-от што README:11 го прогласува за **„Hard rule — non-negotiable"**
(`:14-20`):

```html
<label class="search">
	<svg class="ln-icon" …></svg>
	<input type="search" data-ln-search-for="<targetId>">   ← атрибутот е тука
	<button type="button" data-ln-search-clear …>            ← копчето е БРАТ
</label>
```

- стратегија 1 → не, нема `-clear-for`
- стратегија 2 → не, целта е посебен `<ul>` подолу
- стратегија 3 → не
- стратегија 4 → **не** — `data-ln-search-for` е на `<input>`-от, кој е **брат**, не предок
- стратегија 5 → **да**

Значи задолжителниот блупринт се разрешува **само** преку последната резервна гранка —
онаа што гледа точно едно ниво нагоре (`btn.parentElement`, без качување по предци).
Обвиткај го копчето во кој било контејнер и врската пука тивко: `_resolveTargetAndInput…`
враќа `{ null, null }`, раната излезна гранка на `:262` враќа, и копчето не прави ништо —
без грешка, без dev афорданс, без trace.

**Достижност:** сите 74 демо страници го користат точно тој облик преку
`demo/admin/src/shell.html:126-130`, плус `demo/admin/filter.html:371-377` и
`demo/admin/coordinator.html:435-440`. Стратегиите 2 и 3 немаат ниту еден консумент во
репото (grep: нула копчиња `data-ln-search-clear` внатре во `[data-ln-search]` или
`[data-ln-table-source]`).

---

### 🟠 S5 — Двата хоста имаат независни животни векови; кој и да умре, ставките остануваат скриени

**Каде:** `_stateComponent.destroy` (`:149-156`) · `_controlComponent.destroy` (`:198-204`)

**Извор на правилото:** `DOCTRINE.md:105` — **Destroyed Component Invariant.**

```js
_stateComponent.prototype.destroy = function () {
	if (!this.dom[DOM_ATTRIBUTE]) return;
	this._destroyed = true;
	if (this.hashEnabled && this._onHashChange) {
		window.removeEventListener('hashchange', this._onHashChange);
	}
	delete this.dom[DOM_ATTRIBUTE];
};
```

Ниту едно `data-ln-search-hide` не се брише. `ln-search.scss:5-7` дава `display: none`.
Значи по `destroy()` со непразен термин, сите неподударни ставки остануваат **невидливи**,
а компонентата што би можела да ги врати веќе не постои.

Асиметријата е тука вистинскиот проблем, зашто токму двохостниот раздел ја прави достижна:
**контролата и целта може да умрат одделно.** Контрола во лента со алатки што се заменува
при SPA навигација, а целта останува → `_controlComponent.destroy` (`:198`) го трга
`input` слушачот, копчето за бришење си заминува со неа, а целта задржува
`data-ln-search="john"` и скриени ставки. Нема влез да се исчисти, нема копче да се
ресетира, нема настан што би го известил.

**Достижност — искрено:** ниту едно место во репото не ги става контролата и целта во
различни заменливи региони (сите демо примери се соседни, `shell.html:126` наспроти
`demo-nav` на истата страница). Достижно по конструкција на самиот раздел, без потврден
случај во репото. **Не предлагам guard** — предлагам да се одлучи дали двата `destroy()`
воопшто се должни еден на друг.

---

### 🟡 S6 — Нема `## 🔧 Internals` секција

README завршува на „Common Pitfalls" (`:127-133`). Нема Internals.

Тоа не е само формален пропуст — недокументирано останува сè што оваа компонента го прави
нетривијално: кешот `_lnSearchText` и неговата инвалидација (`:50-57`, `:303-309`),
петстепената каскада за разрешување на копчето за бришење (`:208-255`), разрешувањето на
hash именскиот простор преку контролата (`:19-30`), и `queueBoot` семето (`:94-110`).

Втора компонента во кампањата без Internals, по `ln-fill` (FI6).

---

### 🟡 S7 — README тврди `!important`, SCSS-от го нема

**Каде:** `README.md:66` наспроти `components/ln-search/ln-search.scss:5-7`

> | `data-ln-search-hide="true"` | Items in target | State attribute automatically set on non-matching elements (**`display: none !important`**). |

```scss
[data-ln-search-hide="true"] {
	display: none;
}
```

Нема `!important`. Специфичноста е `0,1,0` — исто како една класа. Секое правило со
класа и елемент (`.table tbody tr`, `0,1,1`) или mixin што поставува `display` победува,
и неподударната ставка останува видлива.

Ова допира одлука што веќе е донесена во репото — `project_core-theme-scss-split`
пресудата за специфичност при криење. Овде е само drift: тврдењето во README е посилно од
испорачаното правило.

---

### 🟡 S8 — Схемата присвојува два туѓи атрибута

**Каде:** `ln-search.schema.json` — `data-ln-table-source`, `data-ln-list-source`

Обата се заведени со `"direction": "author"` и `"sources": ["src/ln-search.js"]`.
`ln-search` не ги поседува — само ги **чита**, во една гранка од каскадата за копчето за
бришење:

```js
// :224-226
const view = btn.closest('[data-ln-table-source], [data-ln-list-source]');
if (view) {
	const sourceId = view.getAttribute('data-ln-table-source') || view.getAttribute('data-ln-list-source');
```

Вистинските сопственици ги декларираат истите атрибути (`ln-table.schema.json`,
`ln-list.schema.json`, обата `author`). Ниту еден од двата не е спомнат во README-то на
`ln-search`, па читателот на схемата добива два атрибута без договор.

**SYS-15 варијанта** — овде атрибутите **постојат**, но припаѓаат на друга компонента.
Досегашните SYS-15 случаи (`ln-progress`, `ln-modal`, `ln-confirm`, `ln-tabs`) беа
атрибути што доаѓаат од ко-лоциран SCSS. Ова е нов облик: течење преку `closest()`
селектор во JS.

---

### 🟡 S9 — Нема `ln-search:destroyed`

Ниту еден од двата `destroy()` не испраќа настан (`:149-156`, `:198-204`). Компонентата
испраќа точно еден настан, `ln-search:change` (`:125`).

Исто како `ln-filter` FL6. Ако одлуката е дека примитивите за упит не известуваат за
уништување, тоа е конзистентно — ама `ln-sortable` испраќа `ln-sortable:destroyed`
(`ln-sortable.js:47`), па линијата не е повлечена никаде.

---

### 🔵 P1 — Инвалидацијата на кешот не го фаќа сопственикот на кешот

`_searchText` го кешира текстот **на самата ставка** (`:55`), а `onSubtreeChange`
(`:303-309`) брише само на `mut.target` и неговиот директен родител.

За `data-ln-search-items="tbody tr"`, промена во `<tr><td><span>текст</span></td></tr>`
дава `mut.target` = `<span>` (или `<td>`), па се бришат кешовите на `<span>` и `<td>` —
а кешот што `_apply` ќе го прочита седи на `<tr>`. Остарува тивко.

Плус: `onSubtreeChange` се вика само за `childList` мутации. Директна промена на
`node.nodeValue` или `el.textContent` на постоечки текстуален јазол не е `childList` —
таа не стигнува никогаш.

**Достижност:** мртво во data-driven режим, зашто `ln-table:123`, `ln-list:137` и
`ln-data-store:296` го откажуваат настанот безусловно и циклусот на `:136` никогаш не се
извршува. Живо само за статични контејнери чиј текст го менува друг код.

---

### 🔵 P2 — `data-ln-hash` вклучен во тек на работа не прави ништо до следната промена

`_syncAttribute` (`:282-288`) при промена на `data-ln-hash` го ре-врзува `hashchange`
слушачот и го пресметува `nsKey` — но не чита од hash-от, ниту го запишува тековниот
термин во него. Ако атрибутот се додаде додека веќе постои термин, URL-то останува чист
сè додека корисникот не напише уште еден знак.

---

### 🔵 P3 — `_controlComponent` нема `_destroyed` заштита за својот `queueBoot`

`_stateComponent` ја има (`:95`), `_controlComponent` не (`:169-174`). `queueBoot` е
`setTimeout(fn, 0)` кога нема holds (`ln-core/helpers.js:699`), значи прозорецот е еден
макротаск — контрола уништена во тој интервал сепак ќе запише во целта.
`DOCTRINE.md:105` бара **Zero Post-Destroy Side Effects**. Прозорецот е премал за да
предложам guard; заведено како асиметрија меѓу двата хоста во истиот фајл.

---

### 🔵 P4 — Примерот за длабоко таргетирање е токму случајот каде атрибутот е инертен

README:31-35 го покажува `data-ln-search-items` на `<table>`:

```html
<table id="<targetId>" data-ln-search="" data-ln-search-items="tbody tr">
```

Ако таа табела е и `data-ln-table` — што е речиси секогаш точно за табела со
пребарување — `ln-table._onSearchChange` (`ln-table.js:123-124`) го откажува настанот
безусловно, па `_apply`-евиот циклус на `:136` не се извршува и `data-ln-search-items`
не прави ништо.

Работниот пример во репото е `<nav … data-ln-search data-ln-search-items="li">`
(`demo/admin/src/shell.html`), обичен контејнер. README-то го дава оној што најверојатно
е мртов.

---

### 🔵 P5 — `_syncControls` пребарува низ цел документ по промена

`:61` — `document.querySelectorAll('[data-ln-search-for="…"]')` при секоја промена на
терминот, значи по притиснат тастер, за да најде контроли што во 99% од случаите се точно
една и веќе е позната (`_controlComponent.dom`). Врз S1 и S2.

---

### 🔵 P6 — Двојната заштита при вчитување покрива еден од двата регистрирани компоненти

`:15` — `if (window[DOM_ATTRIBUTE] !== undefined) return;` каде `DOM_ATTRIBUTE = 'lnSearch'`.
Фајлот регистрира **два** компонента (`:300` и `:312`), вториот под `lnSearchControl`.
Безопасно, зашто обата се во истиот IIFE — ама асиметрично со именувањето на константите,
и единствен таков случај во кампањата.

---

### 🔵 P7 — `_collectText` рекурзира низ сè, вклучувајќи `<script>` и `<style>`

`:36-48` собира секој текстуален јазол што не е под `data-ln-search-exclude`. Инлајн
`<script>` или `<style>` во ставка би станал дел од текстот за пребарување. Нема таков
случај во репото.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-search` | `:5`, `:72`, `:184` | ✅ `:60` | ✅ `both` |
| `data-ln-search-for` | `:7`, `:162` | ✅ `:59` | ✅ `author` |
| `data-ln-search-items` | `:9`, `:133` | ✅ `:61` | ✅ `author` |
| `data-ln-search-fields` | `:10`, `:124` | ✅ `:62` — но нула читатели (S3) | ✅ `author` |
| `data-ln-search-exclude` | `:11`, `:45`, `:139` | ✅ `:63` | ✅ `author` |
| `data-ln-search-hide` | `:12`, `:138`, `:144` | ⚠️ `:66` тврди `!important` (S7) | ✅ `runtime` |
| `data-ln-search-clear` | `:258` | ✅ `:64` | ✅ `author` |
| `data-ln-search-clear-for` | `:209`, `:258` | ✅ `:65` | ✅ `author` |
| `data-ln-hash` | `:13`, `:282` | ✅ `:67` — без збор за историјата (S1) | ⚠️ `direction: null` |
| `data-ln-table-source` | `:224` (само се чита) | ❌ неспомнат | ⚠️ присвоен (S8) |
| `data-ln-list-source` | `:224` (само се чита) | ❌ неспомнат | ⚠️ присвоен (S8) |
| `ln-search:change` | `:125` | ✅ `:81-92` | n/a |
| `ln-search:destroyed` | ❌ не постои | ❌ | n/a |
| `el.lnSearch` API | `term`, `nsKey`, `hashEnabled`, `_apply()`, `destroy()` | ✅ `:74` | n/a |
| `el.lnSearchControl` API | `targetId`, `input`, `destroy()` | ✅ `:73` | n/a |
| `## 🔧 Internals` | — | ❌ отсутна (S6) | n/a |
| пригушување | ❌ не постои | ❌ неспомнато во README | n/a |

---

## Затечена состојба

### Три документи, три различни сопственици на debounce-от

Ова е доктринарна виљушка, не наод против компонентата — се запишува, не се суди:

| извор | тврди |
|---|---|
| `docs/architecture/overview.md:103` | *„**ln-search** … Captures input keystrokes, **debounces them**, and dispatches search queries."* |
| `DOCTRINE.md:64` | пригушувањето живее **во реакцијата** на компонентата, декларирано преку `effects`/`onAttrChange`, *„never in the writer's input event handler"* |
| `DOCTRINE.md:133` | *„**Search Debounce:** Debounce is **owned by `ln-api-connector`** via `data-ln-api-connector-query-debounce`"* |

И четврта позиција, авторска: **`data-ln-search-debounce="0"` е напишан во 74 демо
фајла**, вклучувајќи ја школката `demo/admin/src/shell.html:128` што се компајлира во
секоја страница. Атрибутот **не постои** — нула погодоци во `components/`, `scripts/`,
`docs/` и во ниту една схема. Библиотеката никогаш не го чита.

Значи некој, во некој момент, очекувал `ln-search` да прима debounce атрибут, го напишал
низ цело демо, и никој не забележал дека не прави ништо. `ln-api-connector` навистина го
има својот (`src/ln-api-connector.js:63`, `:450` + схема), што е единствената жива
имплементација.

**Што е наод, а што не:** дека `overview.md:103` опишува непостоечка функција е наод
(S2). Дека трите документи не се согласни кој го должи debounce-от е **затечена состојба**.
Дека `_apply` нема ограда, а `DOCTRINE.md:64` вели дека таму ѝ е местото — тоа е наодот.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ обата конструктора доделуваат прво (`:71`, `:161`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ нема нумерички атрибут |
| SYS-3 (Internals → компајлиран bundle) | n/a — нема Internals воопшто (S6) |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` |
| SYS-11 (BEM `__` компаунди) | ✅ нула класи од JS |
| SYS-13 (зашиен кориснички текст) | ✅ нула стрингови за приказ |
| SYS-14 (состојба надвор од `data-ln-*`) | ✅ — `_lnSearchText` е JS expando, не атрибут |
| `file:///` апсолутни патишта во README | ✅ не е меѓу 16-те |

### Схемата и `data-ln-hash`

`"direction": null` за `data-ln-hash`, идентично во `ln-search`, `ln-sort` и `ln-filter`.
Причината е скенерска: атрибутот се чита преку константа (`HASH_ATTR`, `:13`), никогаш
како литерал во `getAttribute('data-ln-hash')`, па генераторот го гледа името но не и
насоката. Тоа е познатото ограничување од `project_schema-scanner-literal-only`,
конзистентно низ трите консументи — **не е дефект на `ln-search`**.

### Однос кон консументите

Трите компоненти што го слушаат `ln-search:change` (`ln-table:123`, `ln-list:137`,
`ln-data-store:296`) го откажуваат **безусловно**, на првата линија од слушачот, и во
SSR и во data-driven режим. Значи целиот DOM циклус на `ln-search` (`:133-146`) е жив
само за обични контејнери — `<nav>`, `<ul>` во popover, checkbox листи. Тоа е конзистентно
со README:48 и е чиста поделба; вреди само да се знае дека половина од фајлот е мртва во
најчестата употреба.

---

## Отворени прашања за тебе

1. **S1 — кој е договорот за hash при куцање?** `replaceState` наместо `location.hash =`
   (само за ln-search, или во `hashSet` за сите), пригушување пред записот, или
   `data-ln-hash` да се документира како „запишува само при Enter/blur"?
   Забелешка: промена во `hashSet` ги допира и `ln-sort`, `ln-filter`, `ln-tabs`, `ln-modal`.

2. **S2 / затечената виљушка — кој го должи debounce-от?** Трите документи даваат три
   одговори, а демото пишува четврти што не постои. Пред да се поправи што било во кодот,
   треба една пресуда: `overview.md:103` се поправа, `DOCTRINE.md:64` се применува на
   `_apply`, или `ln-search` добива сопствен атрибут — и тогаш `data-ln-search-debounce`
   во 74 фајла станува вистинит наместо да се брише.

3. **S3 — `data-ln-search-fields` останува или си оди?** Ако останува, `ln-data-store`
   треба да го чита наместо да го дуплира преку
   `data-ln-data-store-search-fields`. Ако си оди, тргнувањето допира README, схема и
   `parseSearchFields` во `ln-core` (кој нема друг консумент).

4. **S4 — каскадата од пет стратегии.** Кои гранки се вистински договор? Двете без
   консумент (`:217`, `:224`) да се тргнат, или задолжителниот markup да се смени така
   што паѓа на построга гранка — на пр. `data-ln-search-for` на `<label class="search">`
   наместо на `<input>`, што би ја активирало стратегија 4 со полно качување по предци?

5. **S5 — должат ли двата `destroy()` еден на друг?** Дали уништувањето на State Host-от
   треба да ги исчисти `data-ln-search-hide` од ставките, и дали уништувањето на
   контролата треба воопшто нешто да ѝ каже на целта?

6. **S6 — Internals секција.** Да се напише за оваа компонента, или прашањето е пошироко
   (`ln-fill` исто ја нема) и бара одлука дали Internals е задолжителен дел од скелетот?

---

**Наоди:** 🔴 1 · 🟠 4 · 🟡 4 · 🔵 7
