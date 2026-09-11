# Аудит — ln-nav

**Датум:** 2026-09-11 · **Итерација:** 48/50 · **Слој 6 — координатори и навигација**
**Опсег:** `src/ln-nav.js` (149), `README.md` (113), `ln-nav.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Компонента од 149 линии со најдетално напишана Internals секција во кампањата — која чесно
го документира и она што е најтешкото во неа: дека при вчитување на бандлот, без ниту еден
`[data-ln-nav]` на страницата, ги заменува `history.pushState` и `history.replaceState` со
свои обвивки што никогаш не се враќаат.

---

## Што е добро

**Internals секцијата е модел за тоа како се пишува.** Шест под-секции на 27 линии
(`:87-113`), од кои `:91-93` го објаснува monkey-patch-от именувајќи го и guard-от
(`history._lnNavPatched`) и низата со повратни повици, а `:99-101` го опишува правилото за
совпаѓање до последниот раб-случај: *„with `/` excluded from the parent rule so root
doesn't match everything"*. Тоа е точно она што `ln-search` (S6), `ln-filter`, `ln-chart`
(CH5) и уште шест компоненти го немаат воопшто.

**Правилото за совпаѓање е исправно во трите свои делови.**

```js
const isExact  = normalizedHref === normalizedCurrent;
const isParent = !this.exact && normalizedHref !== '/' && normalizedCurrent.startsWith(normalizedHref + '/');
```

Исклучувањето на `/` (`:76`) го спречува коренот да свети на секоја страница; `+ '/'` го
спречува `/user` да се активира на `/users/42`. Обете се вистински грешки што се пропуштаат.

**Нормализацијата не се потпира на `new URL` да не фрли.** `_normalizeUrl:107-114` има
`try/catch` со разумна резерва (`url.replace(/\/$/, '') || '/'`), па малформиран `href` не
ја руши целата ажурирање-петелка.

**`aria-current="page"` се поставува и се трга симетрично.** `:80` и `:63`, `:70`, `:84` —
сите четири гранки што ја тргаат класата ја тргаат и ARIA ознаката. Ниту едно
несовпаѓање.

**Промената на името на класата ја чисти старата.** `_syncAttribute:129-135` — кога
`data-ln-nav="active"` стане `data-ln-nav="current"`, старата класа се брише од **сите**
анкори пред новата да почне да се применува. Тоа е чекор што лесно се пропушта.

**`ln-nav:destroyed` постои** (`:101`) — една од 23-те компоненти што го имаат, во слој
каде другите три координатори го немаат.

---

## Наоди

### 🟠 N1 — Две нативни History API се заменуваат при вчитување, без ниту еден консумент, и никогаш не се враќаат

**Каде:** `:9-24` — на ниво на IIFE, **пред** `registerComponent` (`:145`)

```js
history._lnNavCallbacks = history._lnNavCallbacks || [];

if (!history._lnNavPatched) {
	const _origPushState = history.pushState;
	history.pushState = function () {
		_origPushState.apply(history, arguments);
		for (const cb of history._lnNavCallbacks) { cb(); }
	};
	const _origReplaceState = history.replaceState;
	history.replaceState = function () { … };
	history._lnNavPatched = true;
}
```

Три посебни работи:

**1. Се инсталира без консумент.** Кодот не е во конструкторот — тој е на врвот на IIFE-то.
Значи вчитувањето на `ln-ashlar` бандлот ги заменува `history.pushState` и
`history.replaceState` на **секоја** страница, дури и таква што нема ниту еден `<nav
data-ln-nav>`. Спореди со `ln-ui-coordinator` UC5, каде десетте `document` слушачи исто се
модулни — но тие само слушаат; овој **ја менува имплементацијата** на две API што
страницата и секоја друга библиотека на неа ги користат.

**2. Никогаш не се враќа.** `destroy()` (`:91-103`) го вади сопствениот повратен повик од
низата, но `history.pushState` останува обвиткана, и `history._lnNavPatched` останува
`true`. Дури и кога **последната** nav инстанца ќе си отиде, обвивката останува — и
итерира празна низа при секој `pushState` до крајот на животот на страницата.

Спореди со `ln-http`, кој исто завива глобал (`window.fetch`) — но неговиот `destroy()`
**го враќа** (заведено како H5, зашто го враќа безусловно). Овде дури ни обидот го нема.
И спореди со `ln-data-coordinator`, каде `_uninstallGlobalSync` (`:52-64`) го демонтира
глобалниот синглтон штом последниот координатор ќе си отиде — истата задача, решена како
што треба, во истиот слој.

**Извор на правилото:** `DOCTRINE.md:105` — **Destroyed Component Invariant** бара
уништената компонента да не остава активни механизми зад себе.

**3. Тоа е трет пишувач во јазолот околу историјата.** Од итерација #47:
`ln-router:325` и `ln-ajax:185` обата викаат `pushState` со различни `state` објекти.
Обата повика **сега поминуваат низ обвивката на `ln-nav`** — што значи дека компонента
што ниту еден од двата не ја именува седи меѓу нив и нативниот API.

**Достижност:** безусловна. Бандлот е вчитан → патчот е таму.

---

### 🟠 N2 — Библиотечна состојба се чува на нативниот `history` објект

**Каде:** `:10` — `history._lnNavCallbacks`, `:23` — `history._lnNavPatched`

**SYS-14** — библиотечна состојба надвор од `data-ln-*` namespace-от, невидлива за
`sync-ln-schemas` и за CI портата.

Разликата од досегашните SYS-14 случаи (`ln-confirm` `data-confirming`, `ln-tabs`
`data-active`) е што таму состојбата барем беше DOM атрибут на сопствен елемент. Овде е
expando на **native browser singleton** што компонентата не го поседува — истиот објект
што секоја друга библиотека на страницата може да го чита, да го брише или да го
пре-дефинира.

Конкретна последица: ако друга библиотека (или друг ln-ashlar бандл со постара верзија)
го избрише `history._lnNavCallbacks`, петелката на `:16` фрла `TypeError` **внатре во
`history.pushState`** — што значи дека секој `pushState` на страницата, од која било
компонента, престанува да работи.

`window.lnCore` е санкционираниот namespace за токму ваква споделена состојба
(`ln-core/helpers.js:709-711` го објаснува зошто регистарот живее таму, а не во модулен
опсег). Овде не е искористен.

---

### 🟠 N3 — `destroy()` ги остава активните класи и `aria-current`, иако истиот фајл знае да ги исчисти

**Каде:** `destroy()` (`:91-103`) наспроти `_syncAttribute` (`:129-135`)

```js
// _syncAttribute — кога се менува ИМЕТО на класата:
const links = el.querySelectorAll('a');
for (const link of links) {
	if (oldClass) link.classList.remove(oldClass);      // :132
}
```

```js
// destroy() — ништо од тоа
_component.prototype.destroy = function () {
	if (!this.dom[DOM_ATTRIBUTE]) return;
	if (this.observer) this.observer.disconnect();
	window.removeEventListener('popstate', this.updateHandler);
	… splice callback …
	dispatch(this.dom, 'ln-nav:destroyed', { target: this.dom });
	delete this.dom[DOM_ATTRIBUTE];
};
```

Остануваат: `.active` (или каква и да е авторска класа) и `aria-current="page"` на секој
активен анкор.

**Достижноста овде е повисока од вообичаениот SYS-9**, зашто `destroy()` има **втор,
атрибутен повикувач**:

```js
if (!el.hasAttribute(DOM_SELECTOR)) {
	instance.destroy();                                  // :124
	return;
}
```

Тргањето на `data-ln-nav` од `<nav>`-от го уништува компонентот — и го остава менито
замрзнато со активен линк и со `aria-current="page"` што читачот на екран продолжува да го
изговара како тековна страница. Тоа е достижно со еден `removeAttribute`, документирано
однесување (`README:109`), и е точно спротивното од она што авторот го очекува кога го
тргa атрибутот.

Дека е превид се гледа по тоа што `_syncAttribute` го прави точно тоа чистење шест реда
погоре, за помалку важниот случај (преименување, не гасење).

---

### 🟠 N4 — Приватен `MutationObserver`, надвор од двата санкционирани исклучока

**Каде:** `:40-41`

```js
this.observer = new MutationObserver(() => this.update());
this.observer.observe(dom, { childList: true, subtree: true });
```

**Извор на правилото:** `docs/architecture/component-guide.md:169-175` — *„**Two narrow,
permanent exceptions** elsewhere in the library keep a private observer instead, and
neither is a pattern to copy from scratch: a component that must read an attribute on its
**parent** (`ln-progress`) … and a component that cannot afford to import anything at all
(`ln-icon`, bundle-size floor)."*

`ln-nav` не е ниту едното — таа веќе увезува три работи од `ln-core` (`:1`) и гледа
сопствено поддрво, не родител. А `registerComponent` нуди `onSubtreeChange` токму за овој
случај, и `ln-search` (`ln-search.js:303-309`) го користи за истата потреба.

Уништувањето е коректно (`:93-95`), што значи дека проблемот е избор на механизам, не
протекување. Четврт случај во кампањата, по `ln-list` P6, `ln-table` P8 и `ln-search`.

---

### 🟡 N5 — README-то тврди дека атрибутот не е реактивен, и дека е — во ист документ

| линија | тврдење |
|---|---|
| `:29` | *„`data-ln-nav-exact` … **Read at init; adding it after initialization requires re-init.**"* |
| `:109` | *„`_syncAttribute(el, attrName)` runs on `data-ln-nav`/`data-ln-nav-exact` mutation: … **an exact-mode change updates the flag and re-runs `update()`**."* |

Кодот е на страната на `:109`:

```js
} else if (attrName === 'data-ln-nav-exact') {
	instance.exact = el.hasAttribute('data-ln-nav-exact');   // :136-137
}
instance.update();                                            // :140
```

плус `extraAttributes: ['data-ln-nav-exact']` (`:146`) што го внесува во набљудуваниот сет.

Значи табелата со атрибути (первото место каде авторот ќе погледне) ја **потценува**
компонентата, и тоа со реченица што изречно бара повторна иницијализација што не е
потребна. Обратен облик од SYS-19 — тука документот тврди дека нешто **не** работи.

---

### 🟡 N6 — Три документациски пропусти во иста README

**1. Погрешно име во описот на teardown-от.** `:113` — *„splices `updateHandler` out of
the global **`_pushStateCallbacks`** array"*. Низата се вика `history._lnNavCallbacks`
(`:10`, `:37`, `:97`). Истиот README го користи **точното** име дваесет реда погоре
(`:93`). Два имиња за истото, во ист документ.

**2. SYS-3.** `:89` — `Source: components/ln-nav/ln-nav.js` → компајлираниот бандл (13.5 KB)
наместо `src/ln-nav.js` (5.2 KB). Четиринаесетти потврден случај.

**3. SYS-20 — две `file:///` апсолутни машински патишта.**

```markdown
- **Active Development Source**: [components/ln-nav/src/ln-nav.js](file:///c:/laragon/www/ln-ashlar/components/ln-nav/src/ln-nav.js)
- **Compiled Standalone**: [components/ln-nav/ln-nav.js](file:///c:/laragon/www/ln-ashlar/components/ln-nav/ln-nav.js)
```

`ln-nav` е една од 16-те README-а со тој образец. Кај консумер обата линка водат никаде.
Иронијата: првиот линк покажува на **вистинскиот** извор — што е токму она што `:89` го
промашува.

---

### 🟡 N7 — Стандардната класа е гола `active`, што го отвора повторно SYS-6

**Каде:** `:30` — `this.activeClass = dom.getAttribute(DOM_SELECTOR) || 'active';`

**Извор на правилото:** `docs/architecture/mindset.md:66` — *„JS only toggles **`.ln-*`
state classes** or semantic attributes."*

`SYS-6` во трекерот е заведен како **затворен**, со ознака *„пописот е целосен"* — двата
случаи беа `.open` (`ln-toggle`) и `is-loading` (`ln-stat`). Ова е трет, и е поинаков по
два начина:

1. Тоа е **стандардната** вредност, не авторска — компонента без вредност на атрибутот
   пали `.active`.
2. Целата демо и тема инфраструктура се потпираат на неа: `theme/config/mixins/_nav.scss`
   има **шест** `.active` правила (`:98`, `:134`, `:164`, `:203`, `:220`, `:259`), а
   демото го пишува изречно (`nav.html:58`, `:66`, `:117`, `:125`).

Значи ова не е ситен превид туку одлука што се провлекла низ темата. Заведено како
**повторно отворање** на SYS-6 — не како нов наод против компонентата, туку како факт
дека пописот не беше целосен.

---

### 🔵 P1 — Проверката за надворешен линк е дословна копија од `ln-core`

`:68` — `if (link.hostname && link.hostname !== window.location.hostname) {`
`ln-core/helpers.js:949` — `if (anchor.hostname && anchor.hostname !== window.location.hostname) return false;`

Идентична линија. А `:61` рачно ги отфрла `#`, `javascript:`, `mailto:`, `tel:` — што
`shouldInterceptLink` исто ги покрива (`helpers.js:945-948`).

Разликата е што `ln-nav` не проверува клик (нема `event`), па `shouldInterceptLink` како
целина не се вклопува — тој бара `(event, anchor)`. Значи ова не е чиста SYS-18 копија,
туку знак дека примитивот нема половина што работи **само** со анкор.

Заведено како можност за раздвојување (`isSameOriginNavigableHref(anchor)`), не како наод
— бидејќи таква функција не постои и не сум јас тој што ќе ја измисли.

---

### 🔵 P2 — `before-update` се испраќа при секоја промена во поддрвото

`update()` (`:51`) го отвора со `dispatchCancelable('ln-nav:before-update')`, а `update()`
се вика од: конструкторот (`:44`), `popstate` (`:36`), секој `pushState`/`replaceState`
(`:37`), секоја `childList` мутација во поддрвото (`:40`), и секоја промена на двата
атрибута (`:140`).

Во демото `demo-nav` носи и `data-ln-search` — значи филтрирањето на менито (кое работи
преку `data-ln-search-hide` атрибути, не преку `childList`) **не** го активира. Но секој
ajax-рендериран блок во менито активира полн пас со `querySelectorAll('a')` и два
настана.

---

### 🔵 P3 — Обвивката останува и кога низата е празна

Последица на N1: по уништување на последната инстанца, `history.pushState` сè уште е
обвиена и итерира `[]` при секој повик. Нула функционална штета, перманентна промена на
глобален API.

---

### 🔵 P4 — Три компоненти во еден јазол околу историјата

Од #47: `ln-router` (`:325`, state `null`) и `ln-ajax` (`:185`, state `{ajax:true}`)
пишуваат во истата историја, а `ln-router._onPopState` не го чита `e.state`. Сега `ln-nav`
седи **под** обете, како обвивка. Ниту едно од трите README не го спомнува другото:
`ln-nav/README.md:4` вели *„Works with `pushState` (ln-ajax)"* — го именува едниот, не го
именува `ln-router` кој исто пишува, и не кажува дека таа „работа со" е остварена преку
замена на API-то.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-nav` | `:4`, `:30` | ✅ `:28` | ✅ `author` |
| `data-ln-nav-exact` | `:31`, `:137`, `:146` | ⚠️ `:29` тврди „requires re-init" наспроти `:109` (N5) | ✅ `author` |
| `history.pushState` / `replaceState` патч | `:12-24` | ✅ `:91-93` — **документиран добро**, но не се вели дека се качува без консумент ниту дека не се враќа (N1) | n/a |
| `history._lnNavCallbacks` | `:10`, `:37`, `:97` | ⚠️ `:113` го именува `_pushStateCallbacks` (N6) | n/a — SYS-14 |
| `history._lnNavPatched` | `:12`, `:23` | ✅ `:93` | n/a — SYS-14 |
| приватен `MutationObserver` | `:40-41` | ✅ `:95-97` | n/a — N4 |
| `activeClass` default `'active'` | `:30` | ✅ `:28`, `:52` | n/a — SYS-6 (N7) |
| `aria-current="page"` | `:80`, тргнат на `:63`/`:70`/`:84` | ✅ `:36` | n/a — преживува `destroy()` (N3) |
| `window.lnNav(root)` | преку `registerComponent` | ✅ `:71` | n/a |
| `ln-nav:before-update` | `:51` | ✅ `:81` | n/a |
| `ln-nav:update` | `:88` | ✅ `:82` | n/a |
| `ln-nav:destroyed` | `:101` | ✅ `:83` | n/a |
| `destroy()` чистење на класи | ❌ не чисти (N3) | ⚠️ `:113` го опишува teardown-от без да го спомне | n/a |
| Internals извор | `src/ln-nav.js` | ❌ `:89` → бандл (N6) | n/a |
| `file:///` линкови | — | ❌ `:21`, `:22` (N6) | n/a |

---

## Затечена состојба

### Најдобрата Internals секција, и најголемата недокументирана последица

`README:87-113` ги објаснува сите шест механизми — и го именува monkey-patch-от отворено,
со guard-от и низата. Она што го нема е **кога** патчот се качува (при вчитување на
модулот, не при прва инстанца) и дека **никогаш** не се симнува. Значи документацијата
опишува механизам точно, но не ја опишува неговата зона на дејство.

### Схемата е најмалата и најточната во кампањата

Два атрибута, обата вистински, обата `author`, обата документирани. Нула туѓи, нула
`sources: []`, нула мртви. Единствената схема досега без ниту една забелешка.

### Што оваа компонента НЕ ги има (проверено)

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ `this.dom = dom` е првата линија (`:29`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ нема нумерички атрибут |
| SYS-7 (`.hidden` / `.sr-only`) | ✅ не крие ништо |
| SYS-8 (сиров `console.error`) | ✅ **нула `console.*` воопшто** |
| SYS-11 (BEM `__`) | ✅ нула |
| SYS-13 (зашиен кориснички текст) | ✅ нула |
| SYS-15 (схема декларира туѓ атрибут) | ✅ два атрибута, обата свои |
| SYS-22 (README без Internals) | ✅ има, најдетална по линија код |
| SYS-23 (нема `:destroyed`) | ✅ **има** (`:101`) |
| SYS-24 (state класа без CSS) | ✅ — `.active` е стилизирана шестпати во `_nav.scss` |
| SYS-30 (без IIFE / двојна заштита) | ✅ обете ги има (`:3`, `:7`) |

---

## Отворени прашања за тебе

1. **N1 — патчот се преселува во конструкторот, и се симнува со последната инстанца?**
   `ln-data-coordinator._uninstallGlobalSync:52-64` е готовиот образец: се демонтира кога
   `_coordinators.size === 0`. Алтернатива: се тргa целосно и `ln-router` /`ln-ajax`
   испраќаат настан по навигација што `ln-nav` го слуша — тогаш нема патч воопшто.

2. **N2 — `history._lnNavCallbacks` се преселува на `window.lnCore`?** Тоа е
   санкционираниот namespace за споделена состојба, и го брани од друга библиотека што го
   гази `history` објектот.

3. **N3 — `destroy()` да ги чисти класите и `aria-current`?** Чистењето веќе е напишано
   на `:130-133`. Особено важно затоа што тргањето на `data-ln-nav` е документирана
   патека до `destroy()` (`:124`).

4. **N7 — SYS-6 се отвора повторно.** `.active` е стандард во кодот, шестпати во темата и
   четирипати во демото. Ако правилото `.ln-*` важи, тоа е преселба низ три слоја; ако не
   важи за авторски конфигурабилни класи, треба изречен исклучок.

5. **P4 — трите компоненти околу историјата.** Со R3 од `ln-router`, ова е трет учесник.
   Дали воопшто треба да постои еден запишан сопственик на `history` и `document.title`,
   и кој е тој?

---

**Наоди:** 🔴 0 · 🟠 4 · 🟡 3 · 🔵 4
