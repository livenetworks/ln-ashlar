# Аудит — ln-sortable

**Датум:** 2026-09-11 · **Итерација:** 40/50 · **Слој 5 — рендерери и упит**
**Опсег:** `src/ln-sortable.js` (203), `README.md` (133), `ln-sortable.schema.json` · **Ревизор:** Opus 5

---

## Вердикт

Структурно најчистиот фајл во кампањата досега — 203 линии, нула async, нула тајмери,
нула sibling import-и, нула `createElement`, нула `console.*` — но и единствената
компонента чиј визуелен договор е целосно документиран, а никогаш испорачан: четирите
`.ln-sortable--*` класи што JS-от ги пали немаат ниту едно CSS правило во целата
библиотека, а единствената мутација што ја прави испраќа настан што тврди дека
редоследот се сменил и кога не се сменил.

---

## Што е добро

**Конструкторот е чист по SYS-1.** `this.dom = dom` е првата линија (`:15`); нема
ниту една гранка што се враќа пред неа. `destroy()` (`:44`) може безбедно да се
повика — и е идемпотентен преку `if (!this.dom[DOM_ATTRIBUTE]) return`.

**Нула кеширана структура.** Секоја операција ги чита `this.dom.children` во моментот
(`:74`, `:114`, `:141`). Затоа компонентата нема потреба од `onSubtreeChange`, а
додадени/отстранети ставки работат веднаш без ниту една линија код за тоа. Спореди со
`ln-sort` каде `th.cellIndex` се снима еднаш и застарува (P2 таму).

**Разрешувањето на рачката е напишано како една вистина, не две.** `_handlePointerDown`
(`:53-72`) ги покрива трите случаи — има рачка под покажувачот, има рачки но не под
покажувачот, нема рачки воопшто — и во сите три завршува со истата валидација: ставката
мора да е **директно дете** на контејнерот (`:62`, `:70`). Нема втор пат низ кодот.

**Единствен извор на вистина што навистина држи.** `enable()`/`disable()` (`:34-42`) не
менуваат внатрешна состојба — само го пишуваат атрибутот, а `_syncEnabled` (`:189`)
реагира преку набљудувачот. Тоа е точно CQS обликот што DOCTRINE §2 го бара, и е
поисправен од половина компоненти што ги видовме.

**Схемата е точна до последниот клуч.** Три атрибути, сите три постојат, `direction`
точен за секој (`data-ln-sortable` = `both`, зашто JS-от го пишува преку `enable/disable`;
`data-ln-sortable-handle` = `author`). Нула SYS-15. Нула SYS-14 — целата состојба живее
во `data-ln-sortable`.

**`before-drag` се испраќа пред сè друго.** `:77-81` — пред `preventDefault`, пред
`setPointerCapture`, пред која било класа. Откажувањето не остава ниту еден трага.

---

## Наоди

### 🟠 SB1 — `aria-roledescription` е зашиен англиски кориснички текст

**Каде:** `src/ln-sortable.js:19`

```js
dom.setAttribute('aria-roledescription', 'sortable list');
```

**Извор на правилото:** `DOCTRINE.md:73` — *„**Zero Display Text in JS:** Hardcoded UI
text/labels in JS are strictly forbidden."* Исклучокот на `:74` покрива само
стандардизирани мерни единици (`'KB'`, `'ms'`) — не се однесува овде.

`aria-roledescription` не е машински атрибут; тоа е **текст што читачот на екран го
изговара дословно**, заменувајќи го native-от `list` role. На неанглиски сајт корисник
со NVDA/VoiceOver слуша „sortable list" среде македонски интерфејс, и авторот нема
начин да го смени — атрибутот се пишува безусловно при конструкција, без ниту еден
влезен атрибут.

**Санкционираниот образец постои и работи** — `data-ln-{name}-label`, во употреба во пет
компоненти:

| компонента | линија |
|---|---|
| `ln-circular-progress` | `src/ln-circular-progress.js:92` |
| `ln-date` | `src/ln-date.js:139`, `:150` |
| `ln-options` | `src/ln-options.js:15` |
| `ln-table` | `src/ln-table.js:1138` |
| `ln-translations` | `src/ln-translations.js:24` |

**Достижност:** безусловна — секоја инстанца, при секоја конструкција.

**Дополнително:** ова е единствениот `aria-roledescription` во целата библиотека
(grep низ `components/*/src/` — 1 погодок), и README-то не го спомнува никаде. Ниту
атрибутот, ниту текстот, ниту фактот дека се менува она што читачот го изговара.

---

### 🟠 SB2 — четири state класи, нула CSS во библиотеката

**Каде:** `src/ln-sortable.js:88`, `:90`, `:128`, `:131` (палење) · `README.md:59-68`
(документација на ефектите)

**Извор на правилото:** `docs/architecture/mindset.md:66` — *„JS only toggles `.ln-*`
state classes or semantic attributes. **CSS translates those to visual output.**"* и
`:71` што го дава спарениот пример: `.ln-filter-active` → `@mixin table-filter-active`
во `theme/config/mixins/_table.scss`.

JS половината постои. CSS половината не постои никаде.

```
grep -rn "ln-sortable" --include=*.scss scss/ components/
→ components/ln-sortable/ln-sortable-dev.scss:5,6,10,11   (само dev-inline-error)
```

Компонентата има **само** `ln-sortable-dev.scss` (13 линии, две dev проверки). Нема
`ln-sortable.scss`. Седумнаесет други компоненти носат ко-лоциран не-dev `.scss`, а
петте други компоненти што палат `.ln-*--` state класи од JS сите го имаат своето
правило во авторски SCSS:

| компонента | класа | каде е стилизирана |
|---|---|---|
| `ln-ajax` | `.ln-ajax--loading` | `theme/components/_ajax.scss:3` |
| `ln-chart` | `.ln-chart--loading` | `components/ln-chart/ln-chart.scss:5` |
| `ln-link` | `.ln-link-status--visible` | `theme/config/mixins/_link.scss:25` |
| `ln-list` | `.ln-list--loading` | `components/ln-list/ln-list.scss:5` |
| `ln-table` | `.ln-table--loading` | (во авторски SCSS) |
| **`ln-sortable`** | **4 класи** | **нигде** |

**Последицата не е козметичка.** Компонентата **не ја движи ставката под покажувачот** —
нема `transform`, нема `translate`, нема клон што лебди. Единствениот сигнал за време на
влечење е индикаторската класа. Значи консумер што го препишува README блупринтот
(`README.md:21-27`) добива **нула визуелен одѕив**: ставката стои мирно, ништо не се
менува, и дури по пуштањето списокот скока. Влечењето изгледа скршено.

**README:63-68 опишува ефекти што не се испорачуваат** — SYS-19:

> `.ln-sortable--drop-before` · „Target item top-half placeholder. **Highlight top border.**"

Ниту една линија CSS во библиотеката не црта тој раб.

**Демото мораше да го напише рачно** — `demo/admin/src/scss/pages/_sortable.scss:23-33`,
врзано за четири конкретни `#id`-а, непрефрливо кај консумер:

```scss
&.ln-sortable--dragging   { opacity: 0.4; }
&.ln-sortable--drop-before { box-shadow: inset 0 2px 0 0 hsl(var(--color-primary)); }
&.ln-sortable--drop-after  { box-shadow: inset 0 -2px 0 0 hsl(var(--color-primary)); }
```

**Подточка — `.ln-sortable--active` нема консумент никаде, ни во демото.** JS-от ја пали
(`:90`) и гаси (`:165`); grep враќа нула CSS погодоци во целиот репозиториум. README:65
за неа тврди: *„Pointer events on text selection are locked."* Демото го постигнува тоа
со статичен `user-select: none` на `li` (`_sortable.scss:21`), не преку класата. Значи
имаме hook што се одржува во JS, се документира со ветен ефект, и никој никогаш не го
чита.

**Достижност:** секој консумер, секое влечење.

---

### 🟠 SB3 — мутацијата на редоследот нема cancelable пар

**Каде:** `src/ln-sortable.js:167-172` (мутацијата) наспроти `:77` (единствениот
cancelable настан)

**Извор на правилото:** `DOCTRINE.md:82` — *„**Paired Events:** Components emit
cancelable `ln-{name}:before-{action}` **before state changes**, and post-fact bubbling
`ln-{name}:{action}` after state changes."*

Состојбената промена на оваа компонента е пренаредувањето на DOM-от. Таа нема пар.
`ln-sortable:before-drag` го чува **почетокот на гестот**, не мутацијата — во моментот
кога се испраќа (`:77`), целта на пуштањето сè уште не постои: `dropTarget` се пресметува
дури во `_handlePointerEnd` (`:147-158`). Не постои момент во кој консумер може да види
„B оди помеѓу A и C" и да каже не.

Тоа директно го погодува сценариото што самото README го пропишува (`:102-107`):
серверска синхронизација по `reordered`. Ако серверот го одбие редоследот (нема право,
позицијата е заклучена, конфликт), DOM-от веќе е преместен и консумерот мора сам да го
врати назад — нешто што компонентата не му го нуди со ниту еден метод.

**Достижност:** секој drop.

---

### 🟠 SB4 — `ln-sortable:reordered` се испраќа и кога ништо не е пренаредено

**Каде:** `src/ln-sortable.js:167-182`

**Извор на правилото:** `README.md:86` — *„Fired when an item drop **successfully changes
the DOM index order**."*

Условот за испраќање е `dropTarget && dropTarget !== item` (`:167`). Тој ја проверува
**целта**, не дали позицијата воопшто се сменила. Два од најобичните гестови даваат
`oldIndex === newIndex`:

Список `[A, B, C]`, се влече `B`:

| гест | класа | повик | резултат |
|---|---|---|---|
| покажувач врз **долната** половина на `A` | `A.--drop-after` | `insertBefore(B, A.nextElementSibling)` = `insertBefore(B, B)` | B останува на index 1 |
| покажувач врз **горната** половина на `C` | `C.--drop-before` | `insertBefore(B, C)` | B веќе е пред C |

Првиот случај не фрла исклучок: DOM спецификацијата за *pre-insert*, чекор 4, вели дека
ако `referenceChild === node`, референцата се префрла на `node`-овиот `nextSibling`. Значи
`insertBefore(B, B)` тивко станува `insertBefore(B, C)` — и во двата случаја **јазолот се
отстранува и повторно се вметнува на истото место**.

Последици:
1. `reordered` се испраќа со `oldIndex === newIndex` (`:177-181`), спротивно на README:86.
2. Re-insert значи вистинско `remove + insert` — фокус внатре во ставката се губи, CSS
   анимации се рестартираат, `<iframe>`/медиум содржина се презема одново.
3. Примерот што README-то самото го дава (`:102-107`) го претвора тоа во **непотребно
   серверско пишување** на гест што корисникот го откажал:
   ```js
   document.addEventListener('ln-sortable:reordered', function(e) {
     saveNewListOrder(e.target.id, e.detail.oldIndex, e.detail.newIndex);
   });
   ```

**Достижност:** секој список со две или повеќе ставки. Мрдање врз соседната ставка е
канонскиот „се предомислив" гест. Демото слуша токму тој настан и го логира
(`demo/admin/sortable.html:510`).

---

### 🟠 SB5 — README-то учи `<span>` како интерактивен елемент

**Каде:** `README.md:34`, `:40` (блупринтот) · повторено во демото
(`demo/admin/sortable.html:309`, `:313`, `:317`, `:321`, `:325`, `:353`…)

```html
<span data-ln-sortable-handle>
  <svg class="ln-icon" aria-hidden="true"><use href="#ln-icon-menu"></use></svg>
</span>
```

**Извор на правилото:** `DOCTRINE.md:78` — *„**Controls & Actions:** MUST use
`<button type="button">` / `<button type="submit">`, `<label>`, `<fieldset>`,
`<legend>`."* и `CLAUDE.md` Pre-Code checklist §1 — *„**Clickable Elements:** Are all
interactive/clickable elements using `<button>` or `<a>`? **NEVER** bind click events to
`<div>` or `<span>`."*

Рачката е **единствената** интерактивна површина во тој режим: таа го добива
`setPointerCapture` (`:84`) и сите три покажувачки слушачи (`:106-108`). Кога рачки
постојат, клик надвор од нив е тивко одбиен (`:64`) — значи `<span>`-от е целата
контрола.

Последица што се надоврзува: `<span>` не е фокусибилен, не е во tab редоследот, и во
целиот фајл нема ниту еден `keydown`/`keyup` слушач (grep: нула). Со тастатура
пренаредувањето е **невозможно**. `aria-grabbed` (`:89`) е поставен, но без
`aria-dropeffect`, без `tabindex`, без ARIA drag-and-drop образец — тоа е ARIA што
опишува интеракција до која корисникот на тастатура не може да дојде.

**Забелешка за затечена состојба, не пресуда:** рачка за влечење навистина не е копче —
`<button>` што не се кликнува е свој проблем. Доктрината како што е напишана и гестот
како што постои се влечат во спротивни насоки. Ова е виљушка за тебе, не препорака од
мене.

---

### 🟡 SB6 — `destroy()` го остава `aria-roledescription` на домаќинот

**Каде:** `:19` го поставува · `:44-49` не го трга

```js
_component.prototype.destroy = function () {
	if (!this.dom[DOM_ATTRIBUTE]) return;
	this.dom.removeEventListener('pointerdown', this._onPointerDown);
	dispatch(this.dom, 'ln-sortable:destroyed', { target: this.dom });
	delete this.dom[DOM_ATTRIBUTE];
};
```

**SYS-9, петти пат** во кампањата (по `ln-editor`, `ln-upload`, `ln-filter`, `ln-sort`).

**Достижност:** `destroy()` се вика автоматски од `ln-core` кога домаќинот се вади од
DOM-от (`components/ln-core/helpers.js`, `childList` гранката на набљудувачот во
`registerComponent`) — таму атрибутот е неважен зашто и јазолот заминува. Реалниот случај
е експлицитен `el.lnSortable.destroy()` додека јазолот останува: обичен `<ol>` што
продолжува да се изговара како „sortable list".

---

### 🟡 SB7 — три јавни методи, нула во API секцијата

**Каде:** `README.md:50-68` („🛠️ Declarative API Contract")

Таа секција има точно две табели: HTML Attributes и CSS Class Hooks. `enable()`,
`disable()` и `destroy()` се прототипски методи (`:34`, `:39`, `:44`) — ниту еден не е
наведен. `enable()/disable()` се појавуваат еднаш во проза (`:129`), `destroy()` само
косо, како „Fired inside `destroy()`" (`:94`). Инстанцните својства (`isEnabled`,
`_dragging`) се опишани во Internals (`:113`), самите методи не.

Демо страницата ја има табелата што README-то ја нема
(`demo/admin/sortable.html:470-472`), заедно со `window.lnSortable(container)` за рачна
иницијализација (`:479`) — што навистина постои (`helpers.js`: `window[attribute] =
constructor`), а README-то не го спомнува.

---

### 🟡 SB8 — SYS-3: Internals покажува на компајлираниот бандл

**Каде:** `README.md:113` — `Source: components/ln-sortable/ln-sortable.js`

Изворот е `components/ln-sortable/src/ln-sortable.js` (203 линии). Наведениот пат е
build артефакт (14.2 KB спрема 6.3 KB извор). **SYS-3, дванаесетти пат.** Од 39 README-а
со таа линија, само шест покажуваат на `src/` (`ln-data-coordinator`, `ln-list`,
`ln-modal`, `ln-number`, `ln-options`, `ln-progress`, `ln-router`, `ln-table-coordinator`,
`ln-upload`).

---

### 🟡 SB9 — README:101 ја објаснува причината наопаку

**Каде:** `README.md:101`

> *„**Missing `touch-action: none`:** Drag handles must carry `touch-action: none` in CSS.
> Failing to add this **prevents mobile browsers from scrolling**, causing the browser to
> capture pointer tracks and breaking touch drags."*

Механизмот е обратен: **без** `touch-action: none` прелистувачот **скролува** — и токму
затоа го одзема покажувачот и го прекинува влечењето. Реченицата вели дека пропуштањето
го спречува скролувањето, што е ефектот на атрибутот, не на неговото отсуство.

Клучниот заклучок е точен (додај `touch-action: none`), но образложението што авторот го
чита е наопаку — а истата таа причинско-последична врска ја објаснува и P1 подолу.

**Дополнително:** `touch-action` постои на точно едно место во целиот репозиториум —
`demo/admin/src/scss/pages/_sortable.scss:44`, на демо класата `.sortable-handle`.
Библиотеката не го испорачува ниту за рачките.

---

### 🟡 SB10 — README:131-133 опишува еден набљудувач, а има два слоја

**Каде:** `README.md:131-133`

> *„One global observer on `document.body`: `childList` (subtree) auto-initializes new
> `[data-ln-sortable]` containers; `attributes` on `data-ln-sortable` re-syncs
> `isEnabled`."*

Затечено во `components/ln-core/helpers.js`:

1. **Еден споделен атрибутен набљудувач** за целата библиотека (`_ensureAttrObserver`) —
   `observe(document.body, { attributes: true, subtree: true, attributeOldValue: true })`.
   **Без `attributeFilter`.** Коментарот во изворот го кажува тоа изречно: *„the
   MutationObserver options below … no longer filter attributes at all."*
2. **Посебен `childList` набљудувач по секој `registerComponent` повик** — значи ~50 од
   нив на `document.body`, не еден.

Ефектот што README-то го опишува е точен — `_syncEnabled` навистина се вика само за
`data-ln-sortable` — но тоа доаѓа од регистарскиот пребарок по име
(`_handleAttrMutation`: `registry.byAttr.get(name)`), не од филтер на набљудувачот.
Опишан е механизам што повеќе не постои.

---

### 🔵 P1 — `pointercancel` го комитира пренаредувањето

`:99-104` го врзува `onEnd` и на `pointerup` и на `pointercancel`; `_handlePointerEnd`
(`:137`) не ги разликува. Откажан гест — прелистувачот презел скрол на допир, повик
прекинал, OS презел — сепак ја спушта ставката на последниот индикатор.

Синџирот што го прави реален е токму оној од SB9: авторот заборавил `touch-action: none`
→ прелистувачот скролува → `pointercancel` → **пренаредувањето сепак се случува**, без
корисникот да го пуштил.

README:125 го опишува верно („`pointerup`/`pointercancel`: find the sibling still carrying
a drop class"), значи е одлука, не drift. Нема доктринарен извор што го забранува → 🔵.

---

### 🔵 P2 — `isEnabled` е копија што ја чува јавната API

`:16` копира од атрибутот, `:194` ја пресинхронизира од набљудувачот — а набљудувачките
повици се микротаскови.

```js
_component.prototype.enable = function () {
	if (this.isEnabled) return;          // ← чита копија
	this.dom.setAttribute(DOM_SELECTOR, '');
};
```

Синхронна секвенца `el.setAttribute('data-ln-sortable','disabled'); el.lnSortable.enable();`
не прави ништо — набљудувачот сè уште не се извршил, копијата вели `true`, методот излегува.

Ова е една од 58-те атрибутни копии во 25 компоненти што `defineAttrs` инверзијата ги
таргетира (commit `3628e7d`); разликата овде е што копијата **ја чува јавната API
површина**, а не само внатрешна пресметка.

**Достижност — искрено:** ниту едно место во репозиториумот не ги меша двата пата
синхроно. Демото користи или атрибут (`sortable.html:347-348`) или методи (`:470-471`),
никогаш обата во иста секвенца. Пријавено како образец, не како достижен баг.

---

### 🔵 P3 — вертикално-само, ненајавено

`_handlePointerMove` (`:124-133`) чита само `e.clientY` и `rect.top`/`height`/`bottom`.
Хоризонтален (`flex-direction: row`) или grid контејнер добива бесмислени индикатори.

Тоа не е ограничување што е некаде запишано:
- `README.md:56` вели „Container (`<ul>`, `<ol>`, **etc.**)"
- `ln-sortable-dev.scss:5` изречно ги благословува `div` и `tbody` како домаќини
- имињата на класите (`--drop-before`/`--drop-after`) се оскно-неутрални, логиката не е

Единствената навестување е во табелата на класи (`:67-68`, „top border" / „bottom border").

---

### 🔵 P4 — мртва зона меѓу ставките

`:127` и `:130` бараат `clientY` строго внатре во `[rect.top, rect.bottom]` на некое дете.
Секој список со `gap` или `margin` меѓу ставките има ленти каде ниту еден индикатор не се
пали — а пуштање таму не прави ништо, тивко.

Демото го има точно тоа растојание (`_sortable.scss:10`, `@include stack(var(--size-sm))`).

---

### 🔵 P5 — `querySelector` низ целото поддрво на секој `pointerdown`

`:64` — `this.dom.querySelector('[data-ln-sortable-handle]')` се извршува при **секој**
покажувачки притисок што не паднал врз рачка, вклучувајќи го секое означување текст во
списокот.

Истиот ред е и причината зошто вгнездувањето е кревко: рачка што припаѓа на **внатрешен**
sortable список го гаси drag-anywhere режимот на надворешниот. Нема вгнездена употреба во
репозиториумот, па е забелешка, не наод.

---

### 🔵 P6 — `aria-grabbed` е мртов атрибут

`:89` / `:164`. Застарен во ARIA 1.1, отстранет во ARIA 1.2; ниту еден помошен алат не го
имплементира. Единствената појава во библиотеката.

---

### 🔵 P7 — `detail: { target: this.dom }`

`:47` и `:195` го дуплираат она што `e.target` веќе го носи. Конзистентно со сестринските
компоненти, па забележано, не наплатено.

---

## Drift табела

| нешто | извор | README | schema.json |
|---|---|---|---|
| `data-ln-sortable` | `:6`, `:16`, `:192` | ✅ `:56` | ✅ `both` |
| `data-ln-sortable-handle` | `:8`, `:54`, `:64` | ✅ `:57` | ✅ `author` |
| `data-ln-debug` | (dev SCSS) | — | ✅ (dev извор) |
| `aria-roledescription` | `:19` | ❌ неспомнат | n/a (SB1) |
| `aria-grabbed` | `:89`, `:164` | ❌ неспомнат | n/a |
| `.ln-sortable--active` | `:90`, `:165` | ✅ `:65` (ефект што не постои) | n/a |
| `.ln-sortable--dragging` | `:88`, `:163` | ✅ `:66` | n/a |
| `.ln-sortable--drop-before/after` | `:128`, `:131` | ✅ `:67-68` (ефект што не постои) | n/a |
| `enable()` | `:34` | ⚠️ само проза `:129` | n/a |
| `disable()` | `:39` | ⚠️ само проза `:129` | n/a |
| `destroy()` | `:44` | ⚠️ само косо `:94` | n/a |
| `window.lnSortable(container)` | `helpers.js` | ❌ (само во демото) | n/a |
| `ln-sortable:before-drag` | `:77` | ✅ `:76-79` | n/a |
| `ln-sortable:drag-start` | `:92` | ✅ `:81-83` | n/a |
| `ln-sortable:reordered` | `:177` | ⚠️ `:86` — тврди „successfully changes the DOM index order" (SB4) | n/a |
| `ln-sortable:enabled/disabled` | `:195` | ✅ `:89-91` | n/a |
| `ln-sortable:destroyed` | `:47` | ✅ `:93-95` | n/a |
| Internals извор | `src/ln-sortable.js` | ❌ `:113` → бандл (SB8) | n/a |

---

## Затечена состојба

**Што оваа компонента НЕ ги има (проверено, не претпоставено):**

| системски образец | состојба овде |
|---|---|
| SYS-1 (`destroy()` фрла по ран `return`) | ✅ чисто — `this.dom` е првата линија (`:15`) |
| SYS-2 (`\|\| default` јаде `0`) | ✅ нема нумерички атрибут |
| SYS-8 (сиров `console.error`) | ✅ нула `console.*` во фајлот |
| SYS-13 (зашиен текст во JS) | ❌ SB1 |
| SYS-14 (состојба надвор од `data-ln-*`) | ✅ сè живее во `data-ln-sortable` |
| SYS-15 (схема декларира туѓ атрибут) | ✅ трите атрибути постојат |
| `file:///` апсолутни патишта во README | ✅ не е меѓу 16-те |

**BEM `--` модификатори — намерно НЕ наплатено.** `.ln-sortable--dragging` и роднините
изгледаат како BEM, но `ln-*--state` е воспоставен идиом за JS state класи низ
библиотеката (`ln-ajax--loading`, `ln-chart--loading`, `ln-chart--empty`,
`ln-list--loading`, `ln-table--loading`, `ln-link-status--visible`) и се совпаѓа со
`mindset.md:66` („JS only toggles `.ln-*` state classes"). Пресудата
`feedback_no-bem-contextual-selectors` таргетира `__` element compounds, не `--`
модификатори. SYS-11 не се применува овде.

**Раскинување на живо влечење — теоретско, без предложен guard.** Ако `destroy()` се
повика среде влечење, слушачите на рачката (`pointermove`/`pointerup`/`pointercancel`,
`:106-108`) и `setPointerCapture` (`:84`) преживуваат, `_dragging` останува, а класите и
`aria-grabbed` остануваат на ставката. Слично, ако **влечената ставка** се извади од
DOM-от среде влечење, `_handlePointerEnd` ќе ја **врати назад** во списокот преку
`insertBefore` (`:169`/`:171`) — избришана ставка воскреснува. Ниту едно од двете не е
достижно: `ln-sortable` не е врзан за ниту еден координатор во репозиториумот (grep:
`lnSortable` се појавува само во демо страниците и во сопствениот извор), сите демо
списоци се статични, и нема re-render патека. Затоа: забележано, **не предложен ниту
еден одбранбен guard**.

**Единствена компонента во Слој 5 без модел фајл.** `ln-filter` има `filter-model.js`,
`ln-sort` има `sort-model.js`; `ln-sortable` е еден фајл. Оправдано — нема ништо чисто за
издвојување: секоја операција е геометрија на `getBoundingClientRect` или DOM мутација.

---

## Отворени прашања за тебе

1. **SB2 — кој го должи CSS-от?** Дали `.ln-sortable--*` треба да добијат правило во
   `components/ln-sortable/ln-sortable.scss` (како `ln-chart`/`ln-list`), да одат во
   `theme/config/mixins/` (како `ln-ajax`/`ln-link`), или свесно остануваат чист hook за
   консумерот — во кој случај README:63-68 треба да престане да опишува конкретни ефекти?
   Поврзано: `.ln-sortable--active` има ли воопшто причина да постои ако никој не ја чита?

2. **SB1 — каде оди „sortable list"?** `data-ln-sortable-label` по воспоставената
   конвенција, dict, или се трга `aria-roledescription` целосно (native-от `list` role
   веќе е точен, а „sortable" е состојба, не улога)?

3. **SB4 — кој е договорот на `reordered`?** Да се зачува како е (испраќање на секој drop,
   консумерот проверува `oldIndex !== newIndex`), да се стесни на вистинска промена, или
   README:86 да се смени да го опише постоечкото однесување?

4. **SB3 — треба ли `ln-sortable:before-reorder`?** Тоа е единственото место каде
   консумер може да го одбие редоследот пред DOM-от да се помести. Или пренаредувањето
   свесно останува незаобиколиво, а консумерот враќа со сопствен код?

5. **SB5 — виљушката `<span>` vs `<button>`.** Рачка за влечење не е копче. Доктрината
   `DOCTRINE.md:78` вели дека интерактивните елементи мораат да се `<button>`/`<a>`.
   Едното мора да попушти — или доктрината добива изречен исклучок за drag рачки, или
   блупринтот се менува. Поврзано: сака ли `ln-sortable` тастатурна патека воопшто?

6. **P3 — хоризонтални списоци во опсег?** Ако да, `_handlePointerMove` е вертикален по
   конструкција. Ако не, dev SCSS-от не треба да ги благословува `div` контејнерите без
   ограда.

---

**Наоди:** 🔴 0 · 🟠 5 · 🟡 5 · 🔵 7
