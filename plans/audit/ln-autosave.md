# Аудит — ln-autosave

2026-09-11 · Опсег: `src/ln-autosave.js` (145), `src/autosave-model.js` (34), `README.md` (124), schema · Итерација 29/50

## Вердикт

README-от е меѓу најчесните во репото — сам ги именува своите ограничувања, вклучувајќи
го тоа што `:save-failed` не постои и што `destroy()` не го брише нацртот. Но една
негова реченица тврди инваријанта што рамката не ја дозволува, и токму таа реченица го
крие SYS-1: конструкторот излегува пред `this.dom`, а `destroy()` потоа фрла.

## Што е добро

**README Internals кажува што компонентата НЕ прави.** Четири изречни ограничувања,
сите проверени како точни:

| тврдење | извор | ✓ |
|---|---|---|
| `form.submit()` не го чисти нацртот — користи `requestSubmit()` | `:137` слуша нативен `submit` | ✅ |
| неуспешен запис не испраќа настан — нема `:save-failed` | `:71-75` тивок `try/catch` | ✅ |
| `destroy()` **не** го брише нацртот | `:160-174` нема `_clear()` | ✅ |
| клучот се резолвира еднаш; History API навигација не го пре-клучува | `:57` еднократно | ✅ |

Тоа е ретка форма на документација — попис на она што ќе изненади, наместо попис на
функции.

**`parseAutosaveDebounce` ги разликува „отсутен" и „празен".**
`autosave-model.js:28-34`:

```js
if (rawValue === null || rawValue === undefined) return 0;   // нема атрибут → исклучено
if (rawValue === '') return fallbackMs;                      // гол атрибут → 1000ms
const parsed = parseInt(String(rawValue), 10);
if (isNaN(parsed) || parsed < 0) return fallbackMs;
return parsed;
```

Три различни исходи за три различни состојби на атрибутот, со JSDoc што ги именува
поименично (`:19-27`). Тоа е спротивното од SYS-2 идиомот `|| default`, кој сите три
ги слева во еден. Прва компонента во кампањата што ја прави таа разлика изречно.

**Листата исклучоци во README:92 е точна до збор.** Проверено наспроти
`serializeForm` (`helpers.js:452-453`): `!el.name`, `el.disabled`, `type="file"`,
`type="submit"`, `type="button"`, плус `exclude` селекторот што ги носи
`[data-ln-autosave-exclude]` и `input[type="password"]`. Шест тврдења, шест точни.

**Моделот е чист и тестиран.** `autosave-model.js` нема ниту `window` ниту
`document` ниту `localStorage` — сето тоа останува во компонентата. `tests/ln-autosave.test.js`
ги увезува обата извоза и ги проверува. Една од малкуте компоненти со жив тест над
сопствениот модел.

**`before-restore` е откажлив, со запишан вистински случај.** README:77-85 го дава
најважниот: страница каде серверот веќе прикажал понова состојба, па нацртот не смее да
ја прегази. Тоа е единствената cancelable порта што доаѓа со објаснување **зошто** би
ја откажал.

**`destroy()` го чисти и тајмерот**, не само слушачите (`:169-170`).

## Наоди

### 🔴 A1 — Конструкторот излегува пред `this.dom`; `destroy()` фрла, и README тврди дека тоа е невозможно

**Каде:** `:59-64` наспроти `:160-161` и `README.md:106`

```js
function _component(form) {
	const value = form.getAttribute(DOM_SELECTOR);
	const identifier = value || form.id;
	const key = buildAutosaveKey(window.location.pathname, identifier);

	if (!key) {
		console.warn('ln-autosave: form needs an id or data-ln-autosave value', form);
		return;                    // ← гол return
	}

	this.dom = form;               // ← никогаш не се стигнува
```

`new _component(el)` со гол `return;` го враќа `this` — обичен објект со прототипот на
компонентата. `findElements` (`helpers.js:348-350`) не проверува ништо:

```js
if (!el[attribute]) {
	el[attribute] = new ComponentClass(el);
}
```

Значи `form.lnAutosave` **се поставува**, на инстанца без `dom`, без `key` и без
ракувачи.

`README.md:106` тврди спротивното:

> missing both returns `null` and construction aborts with a console warning —
> **`form.lnAutosave` is never set.**

Тоа е инваријанта што рамката не може да ја исполни — `findElements` доделува
безусловно, а конструкторот нема начин да го спречи тоа.

**Три последици:**

1. **`destroy()` фрла.** `:161` е `if (!this.dom[DOM_ATTRIBUTE]) return;` — гардот за
   идемпотентност чита **низ** `this.dom`, кој е `undefined`. `TypeError: Cannot read
   properties of undefined`. Достижно преку `registerComponent`-овата removedNodes
   гранка кога формата ќе се отстрани.
2. **Повторната иницијализација е блокирана.** `el[attribute]` е вистинито, па
   `findElements` никогаш повеќе нема да ја конструира — ни кога авторот ќе додаде `id`
   подоцна.
3. **README-то го води консументот во истата дупка.** `:54` документира
   `form.lnAutosave.key`, а `:82` и `:89` го советуваат
   `localStorage.removeItem(e.target.lnAutosave.key)`. На bail-инстанца `key` е
   `undefined` → `removeItem(undefined)` брише клуч по име `"undefined"`, тивко.

**Достижност:** `<form data-ln-autosave>` без `id`. `ln-autosave-dev.scss` правило 2 го
фаќа авторски (`form[data-ln-autosave=""]:not([id])` — гол атрибут има вредност `""`,
па селекторот совпаѓа ✅), но само во режим за развој.

Трета компонента со SYS-1, по `ln-autoresize` (×1) и `ln-slug` (×4). `ln-include`,
`ln-editor` и `ln-upload` го прават правилно — доделуваат пред bail-от.

### 🟠 A2 — Единственото предупредување во библиотеката што го промашува дебаг гејтот

**Каде:** `:60`

```js
console.warn('ln-autosave: form needs an id or data-ln-autosave value', form);
```

Гејтот во `ln-core/helpers.js:5-7`:

```js
const isLibraryWarning = typeof args[0] === 'string' &&
	(args[0].startsWith('[ln-') || args[0].startsWith('[lnCore'));
```

`'ln-autosave: …'` почнува со `ln-`, не со `[ln-`. Ниту еден од двата префикса не
совпаѓа, па `isLibraryWarning` е `false` и пораката оди право во конзолата — **без**
`data-ln-debug`, во продукција, на секое вчитување на страница со неисправна форма.

Секое друго предупредување во ревидираните компоненти го носи точниот облик:
`'[ln-key] …'`, `'[ln-upload] …'`, `'[ln-editor] …'`, `'[ln-autoresize] …'`. Ова е
единствената отстапка, и е тивка — гејтот не пријавува дека нешто го промашило.

### 🟠 A3 — Секое изменето поле запишува двапати

**Каде:** `:112-120`, `:135-136`

```js
this._onFocusout = function (e) { … _save(); };
this._onChange   = function (e) { … _save(); };
form.addEventListener('focusout', this._onFocusout);
form.addEventListener('change',   this._onChange);
```

За текстуално поле нативниот `change` се пали **при напуштање на фокусот**, ако
вредноста е изменета. Значи едно поле што корисникот го изменил и го напуштил дава:

1. `change` → `_save()` → `localStorage.setItem` + `ln-autosave:saved`
2. `focusout` → `_save()` → `localStorage.setItem` + `ln-autosave:saved`

Два синхрони записа во `localStorage` и **два идентични настана** за една корисничка
акција. Со вклучен debounce на `input` можат да бидат три.

Тоа не е само трошок. `ln-autosave:saved` е известување што консументот го користи за
индикатор „Зачувано" — двоен настан значи двојна анимација, а бројач на зачувувања
дава дупло. README:110 ги наведува трите извори (*„`focusout`, `change`, optional
debounced `input`"*) без да каже дека првите два се палат за истата акција.

`localStorage.setItem` е синхрона операција што го блокира главниот thread —
удвојувањето е мерливо кај големи форми.

### 🟠 A4 — Нацртите живеат неограничено, во чист текст, и договорот не го кажува тоа

**Каде:** `:72` наспроти `README.md:92`

```js
localStorage.setItem(key, JSON.stringify(data));
```

`_clear()` се вика на три места: нативен `submit` (`:137`), нативен `reset` (`:138`) и
клик на `[data-ln-autosave-clear]` (`:139`). Ниту едно од нив не се случува кога
корисникот едноставно ја напушти страницата — што е **точно сценариото поради кое
компонентата постои**. Значи секој напуштен нацрт останува во `localStorage` без рок,
достапен за секој скрипт на истиот потекло и за секој што ќе го отвори прелистувачот.

README:92 ги набројува исклучоците:

> `ln-autosave` automatically ignores disabled inputs, button elements, `type="file"`,
> `type="password"`, inputs missing a `name` attribute, and any element matching
> `[data-ln-autosave-exclude]`.

Тоа е попис што **имплицира** дека сè друго се чува намерно. Исклучувањето на
`type="password"` (`:43`) покажува дека прашањето е разгледано — но е запрено кај
лозинките. Форма со матичен број, број на картичка, медицинска белешка или платен
податок оди во чист текст, засекогаш, без ниту еден ред предупредување во договорот.

`README.md:75-92` има секција **Common Pitfalls** со два запишани случаи (застарен
нацрт врз серверски податоци; ESC затворање модал). Третиот — што се чува и колку долго
— недостасува, а е единствениот со последица надвор од страницата.

Наодот е за договорот, не за механизмот: `localStorage` е свесниот избор и README:9 го
образложува. Она што недостасува е реченицата за задржувањето и упатството дека
чувствителните полиња бараат `data-ln-autosave-exclude`.

### 🟡 A5 — README Internals именува две приватни функции што не постојат

**Каде:** `README.md:106` и `:116`

> `_getStorageKey` resolves `identifier` from the attribute value if non-empty, else `form.id`.

> The interval is read once at construction (`_resolveDebounceMs`).

Ниту едното име не постои во `src/**`. Вистинските се `buildAutosaveKey` и
`parseAutosaveDebounce`, обете во `autosave-model.js`, повикани inline на `:57` и
`:141`.

Тоа не е само погрешно име — ги крие обете функции што **навистина** ја носат логиката,
и го крие фактот дека се во тестиран модел. Читателот што ги бара наоѓа ништо и
заклучува дека доковите се застарени; всушност описите на однесувањето се точни,
само имињата се измислени.

### 🟡 A6 — Опишаниот механизам за `ln-autoresize` не е оној што работи

**Каде:** `README.md:11` наспроти `components/index.js:54-55`

> **Decoupled Event Restoration:** restored values are applied by dispatching standard
> synthetic `input` and `change` events. This ensures sibling primitives (such as
> `ln-validate` and **`ln-autoresize`**) re-evaluate automatically.

`registerComponent` го врзува својот почетен премин на `DOMContentLoaded` (`helpers.js:918`),
па компонентите бутаат по редоследот на увоз во `components/index.js`:

```
:24  ln-validate      ← пред autosave  ✅ синтетичкиот input стигнува
:29  ln-number        ← пред autosave  ✅
:30  ln-date          ← пред autosave  ✅
:54  ln-autosave      ← _restore() се извршува тука
:55  ln-autoresize    ← ПОСЛЕ autosave ✗ нема слушач што да го чуе
```

Кога `_restore()` (`:156`) ги испраќа синтетичките настани, `ln-autoresize` сè уште не
е иницијализиран — textarea-та нема ни инстанца ни `input` слушач. Настанот паѓа во
празно.

Резултатот сепак е точен, но **по друг пат**: `ln-autoresize` прави почетно
преоразмерување во конструкторот (`ln-autoresize.js:27`), а тој конструктор се
извршува еден увоз подоцна, кога вредноста е веќе вратена. Значи гаранцијата зависи од
редоследот во `components/index.js`, а не од механизмот што README-то го опишува.

Репото го има навикот да ги запишува ваквите зависности — `components/index.js:17-23`
носи коментар од шест реда зошто `ln-validate` мора пред `ln-ajax`. Оваа зависност нема
ниту еден.

Минималниот пример на самото README (`:21`) е точно тој случај:
`<textarea data-ln-autoresize rows="1">` внатре во `<form data-ln-autosave>`.

### 🟡 A7 — SYS-3 и SYS-4 во иста секција

**Каде:** `README.md:98` и `:120`

> Source: `components/ln-autosave/ln-autosave.js` (~150 lines).

Компајлираниот бандл е 15 375 бајти. Бројот „~150 линии" е точен — за
`src/ln-autosave.js` (145). Значи описот го мери изворот, а патеката покажува на
артефактот. Осмо појавување на SYS-3.

> `registerComponent` watches `childList` … and `attributes` (**filtered to
> `data-ln-autosave` only** — NOT `-clear` or `-debounce-input`).

По `3628e7d` споделениот обсервер нема `attributeFilter`; тој ги гледа сите мутации и
филтрира преку регистар. Заклучокот што README-то го извлекува (дека `-clear` и
`-debounce-input` не реагираат) останува точен — но од друга причина: тие едноставно
не се во `extraAttributes`, кој овде е празен. Петто појавување на SYS-4.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | `inputTimer` е затворачка променлива (`:67`), па `destroy()` ѝ пристапува преку наменски акцесор `this._getInputTimer` (`:152-154`, `:169`). Секоја друга компонента држи `this._timer`. Акцесорот постои само за да го премости затворачот. | `:67,152,169` |
| P2 | `STORAGE_PREFIX` и `DEFAULT_DEBOUNCE_MS` се извезени (`autosave-model.js:1-2`), а grep низ `components/` и `tests/` не наоѓа ниту еден увоз — тестот ги зема само двете функции. Извезена површина без консумент; `DOCTRINE.md` §2 „No Speculative Code". | `autosave-model.js:1-2` |
| P3 | `_restore()` испраќа и `input` и `change` на **секое** вратено поле (`:97-98`). `ln-form._triggerSyntheticEvents` (`ln-form.js:49-53`) го решава истиот проблем со гранка по тип на поле. Функционално обете се точни; разликата е дека овде секое поле добива двоен настан, и дека постојат две политики за иста работа во иста библиотека. README:111 ја образложува одлуката, што е повеќе отколку што повеќето вакви места имаат. | `:96-99` |
| P4 | `data-ln-autosave-exclude` се проверува со `el.matches(…)` (`:114`, `:119`, `:145`) и во `serializeForm` со `el.matches(exclude)` (`helpers.js:454`). Значи атрибутот исклучува **само елементот што го носи** — `<fieldset data-ln-autosave-exclude>` не го исклучува поддрвото. README:92 вели *„any element matching"*, што е буквално точно, но авторот што сака да исклучи група ќе го стави на групата. | `:43,114,119,145` |
| P5 | Три `try { … } catch (_) { return; }` блока (`:71-75`, `:81-85`, `:104-108`) без ниту една порака. За `_save()` тоа е документирано (README:110 — *„A failed write fires no event"*), но `_restore()` и `_clear()` тивко не прават ништо ни во режим за развој. Сценариото е реално: Safari во приватен режим фрла на `setItem`. | `:71,81,104` |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-autosave` | `:55` | ✅ „value overrides form ID" | ✅ |
| `data-ln-autosave-clear` | `:131` | ✅ | ✅ |
| `data-ln-autosave-debounce-input` | `:141` | ✅ со трите семантики | ✅ |
| `data-ln-autosave-exclude` | `:43` | ✅ во Pitfalls | ✅ `direction: null` |
| `data-ln-debug` | само `-dev.scss` | ❌ | ✅ |
| `ln-autosave:before-restore` (cancelable) | `:93` | ✅ со случај на употреба | н/п |
| `ln-autosave:restored` | `:100` | ✅ | н/п |
| `ln-autosave:saved` | `:76` | ✅ (но се пали двапати, A3) | н/п |
| `ln-autosave:cleared` | `:109` | ✅ | н/п |
| `ln-autosave:destroyed` | `:172` | ❌ **недокументиран** во табелата на настани | н/п |
| `.key` јавно поле | `:65` | ✅ | н/п |
| `destroy()` | `:160` | ✅ | н/п |
| `form.lnAutosave` при bail | **се поставува** | ❌ тврди „is never set" | н/п |
| `_getStorageKey` | **не постои** (`buildAutosaveKey`) | ❌ | н/п |
| `_resolveDebounceMs` | **не постои** (`parseAutosaveDebounce`) | ❌ | н/п |
| синтетички настани → `ln-autoresize` | не стигнуваат | ❌ тврди дека стигнуваат | н/п |
| клучен формат `ln-autosave:{path}:{id}` | `autosave-model.js:13` | ✅ точен | н/п |
| листа исклучоци (6 ставки) | `helpers.js:452-454` | ✅ сите шест точни | н/п |
| Internals извор | `src/ln-autosave.js` | ❌ покажува на bundle | н/п |
| атрибутен обсервер | нефилтриран | ❌ тврди филтриран | н/п |

## Затечена состојба

**`ln-autosave:destroyed` се испраќа (`:172`) и го нема во табелата на настани**
(README:66-71). Табелата е насловена „Emitted" и носи четири реда; петтиот настан
постои во кодот. Мала ставка, но истата табела е единственото место каде консументот
ги бара.

**`localStorage` живее во компонентата, не во моделот** — `autosave-model.js` е чист, а
сите три пристапа (`:72`, `:82`, `:105`) се во `ln-autosave.js`.
`component-coding-standards.md` §1 бара точно таа поделба, и е испочитувана буквално.

**Нема `.scss` фајл, и README го кажува тоа** (`:98`): *„No `.scss` file — the component
has no visual surface, no class it sets, no CSS-driving attribute."* Проверено ✅ —
компонентата не пишува ниту класа ниту `data-ln-*` состојбен атрибут. Единствената
компонента досега што изречно го изјавува отсуството на визуелен слој.

Конзолен излез: еден `console.warn`, и тој е единствениот во ревидираните компоненти
што не поминува низ гејтот (A2). Inline стил: нула. Зашиен кориснички текст: нула.
`createElement`: нула.
