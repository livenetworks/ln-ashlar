# Аудит — ln-ajax

2026-09-11 · Опсег: `src/ln-ajax.js` (283), `README.md` (160), schema · Итерација 33/50

## Вердикт

Единствената компонента со табела **„DOM mutations performed"** — попис на секој
страничен ефект што го прави — и единствената со образложено **одбивање** да
санитизира, со линк кон безбедносниот документ. Но таа табела содржи
`history.pushState` без соодветен ред за враќање: компонентата гурка записи во
историјата и нема ниту еден `popstate` слушач.

## Што е добро

**Табелата „DOM mutations performed"** (`README.md:133-143`). Седум реда, секој со
фаза и точна мутација — класата, спинерот, `disabled` на копчињата, `innerHTML`
замената, `document.title`, `pushState`, чистењето. Ниту една друга компонента не ги
изнесува сопствените странични ефекти како попис.

**Одбивањето да санитизира е образложено и врзано за документ.** `README.md:149-151`:

> It performs **no** client-side sanitization or regex script/attribute filtering —
> that would be fragile and would corrupt valid markup (e.g. stripping
> `data-ln-confirm` values that contain event-like substrings). Sanitizing
> user-submitted HTML is the server's job … See
> [Security §5 — AJAX Fragment Trust Boundary](../../docs/architecture/security.md#5-ajax-fragment-trust-boundary).

Не е пропуст изнесен како функција — е граница, со причина и со надлежност. (Спореди
`ln-editor`, кој **има** чистач што не држи; овде нема чистач и тоа е изјавено.)

**Се повлекува пред друг пајплајн, еднаш и гласно.** `:49-55`:

```js
if (form.hasAttribute(SCOPE_ATTR)) {
	if (!form[DOM_ATTRIBUTE + 'ScopeWarned']) {
		form[DOM_ATTRIBUTE + 'ScopeWarned'] = true;
		console.warn('[ln-ajax] Form has data-ln-form-scope — the ln-data-coordinator write pipeline takes precedence; skipping ajax interception for this form.');
	}
	continue;
}
```

Еднократно по форма, со `[ln-` префикс (значи зад гејтот), и документирано во
Pitfalls (`README.md:97`). Компонента што знае кога не е нејзин ред.

**Го почитува `e.defaultPrevented`** (`:58`):

```js
if (e.defaultPrevented) return; // a prior handler (e.g. a validation gate) already blocked this submit
```

Тоа е она што ја прави `ln-validate`-овата submit порта функционална, и е причината
зошто `components/index.js:17-23` носи коментар од шест реда за редоследот на увоз.
Двете страни на тој договор се испочитувани.

**Локалната дивергенција на `findElements` е објаснета двапати** — во кодот (`:213`)
и во README (`:145-147`), со изречно *„The two must not be merged without updating all
call sites."*

**Опт-аутот е вграден во самите селектори** (`:222-223`):
`a:not([data-ln-ajax="false"])`. Не се фаќа па отфрла — не се фаќа воопшто.

**Приватниот `childList` обсервер е санкциониран облик.** `component-guide.md:337-340`
изречно дозволува компонента со сопствен `childList` животен циклус да држи свој
обсервер, под услов атрибутната половина да оди преку `observeAttributes` — што
`:261` го прави. Не е отстапување.

## Наоди

### 🔴 AJ1 — Гурка записи во историјата и нема `popstate`

**Каде:** `:185`, `:188` — и отсуство во целиот фајл

```js
if (element.tagName === 'A') {
	const historyUrl = element.getAttribute('href');
	if (historyUrl) {
		window.history.pushState({ ajax: true }, '', historyUrl);
	}
} else if (element.tagName === 'FORM' && element.method.toUpperCase() === 'GET') {
	window.history.pushState({ ajax: true }, '', finalUrl);
}
```

Grep низ `src/ln-ajax.js` за `popstate`: **нула**. Единствените слушачи во
компонентата се `click` (`:40`), `submit` (`:75`), `DOMContentLoaded` (`:279`) и
двата обсервера.

Значи: клик на врска → содржината се заменува, URL-то се менува, се додава запис во
историјата. Притискање **Назад** → URL-то се враќа, а содржината **останува**.
Корисникот гледа `/dashboard` содржина на адресата `/users`. Напред го прави истото
во обратна насока.

README:5 го продава спротивното:

> exchanging targeted DOM updates, **updating browser history states**, and
> re-attaching lifecycle managers

Табелата на мутации (`:142`) го наведува `history.pushState` како ред. Нема ред за
враќање, и нема ниту реченица во Pitfalls што вели дека Назад не е поддржан.

**Втор слој: судир со `ln-router`.** `ln-router` го поседува истиот стек —
`pushState` на `:325`, `popstate` слушач на `:471` — и истиот `document.title`
(`:363`, наспроти `ln-ajax:170`). Ако обете се вчитани, записот што `ln-ajax` го
гурнал со состојба `{ ajax: true }` подоцна го обработува `ln-router`-овиот
`popstate`, кој ќе се обиде да ја рутира таа адреса низ сопствениот пајплајн — значи
истата навигација минува низ два различни механизма за рендерирање. Ниту еден од
двата README не ја спомнува другата компонента.

(Полната анализа на таа интеракција оди во итерација #47 `ln-router`. Наодот тука е
дека `ln-ajax` сам по себе е некомплетен: гурка она што не може да го врати.)

**Достижност:** секоја ajax навигација проследена со Назад.

### 🟠 AJ2 — Чистењето не е врзано за барањето, а `ln-http` го прави прекинувањето вообичаено

**Каде:** `:111-116`, `:205-210` наспроти `ln-http/src/ln-http.js:73-76`

`_makeAjaxRequest` ја држи состојбата на **елементот**, не на барањето:

```js
element.classList.add('ln-ajax--loading');
…
function _cleanup() {
	element.classList.remove('ln-ajax--loading');
	const s = element.querySelector('.ln-ajax-spinner');
	if (s) s.remove();
	if (callback) callback();       // ← ги враќа СИТЕ копчиња
}
```

Две истовремени барања врз ист елемент ја делат таа состојба. Првото што ќе се
разреши — **вклучувајќи разрешување со прекин** — ја симнува класата и ги враќа
копчињата, додека второто сè уште трча.

`ln-http`-овиот Path A го прави тоа вообичаено, не рабно: два GET-а кон ист URL
даваат ист клуч, па вториот **го прекинува првиот** (`ln-http.js:73-76`). Двоен клик
на ајакс врска е точно тој случај.

И прекинот не завршува тивко. `.catch` на `:205` не го филтрира `AbortError`:

```js
.catch(function (error) {
	// True network failure / DNS / offline / abort (fetch itself threw)
	dispatch(element, 'ln-ajax:error', { method, url: finalUrl, status: 0, data: null, error: error });
	dispatch(element, 'ln-ajax:complete', { … });
	_cleanup();
});
```

Коментарот го именува прекинот — но го третира како отказ. Значи двоен клик на
навигациска врска произведува **`ln-ajax:error` со `status: 0`**, кој консументот не
може да го разликува од паднат сервер, плус предвремено чистење на индикаторот за
вчитување.

`ln-http` истиот случај во сопствениот Path B го решава со една линија
(`ln-http.js:165`): `if (err && err.name === 'AbortError') return;`.

**Достижност:** двоен клик на врска во ajax контејнер, на страница каде и `ln-http` е
вчитан. Обете компоненти се во `components/index.js`.

### 🟠 AJ3 — Спинерот е UI школка создадена од JS и вметната внатре во тригерот

**Каде:** `:106-109`

```js
element.classList.add('ln-ajax--loading');
const spinner = document.createElement('span');
spinner.className = 'ln-ajax-spinner';
element.appendChild(spinner);
```

`mindset.md:25`:

> **Ashlar way:** HTML is authored, complete, and semantic. **JS never creates UI
> chrome** … `<template>` exists for data-driven row repetition only, not for UI
> structure.

Три последици:

1. **Вметнувањето е внатре во тригерот.** За `<a>` спинерот станува дел од текстот на
   врската; за `<form>` — последно дете, значи grid/flex ставка во распоредот на
   формата, по копчињата.
2. **`ln-ajax--loading` е BEM модификатор искован во JS.** Префиксот е `ln-` (значи
   SYS-6 не важи), но `--` компаундот е точно она што конвенцијата на репото го
   одбива.
3. **Обете живеат само во темата.** `theme/components/_ajax.scss:3,7` ги дефинира;
   `theme/ln-ashlar-core.scss` не ги повлекува. Консумент со core-only CSS добива
   празен `<span>` без стил и класа без ефект — индикаторот за вчитување тивко не
   постои. SYS-7.

Компонентата веќе има авторски пат за истата работа: `ln-ajax:start` и
`ln-ajax:complete` буклаат (`README.md:80`), па консументот може да го држи својот
индикатор без ниту еден создаден јазол.

### 🟠 AJ4 — Сите копчиња се враќаат овозможени, вклучувајќи ги веќе оневозможените

**Каде:** `:64-72`

```js
for (const btn of form.querySelectorAll('button, input[type="submit"]')) {
	btn.disabled = true;
}

_makeAjaxRequest(method, action, formData, form, function () {
	for (const btn of form.querySelectorAll('button, input[type="submit"]')) {
		btn.disabled = false;
	}
});
```

Претходната состојба не се снима. Копче што авторот го напишал како
`<button disabled>` — затоа што дејството бара дозвола, избран ред, или завршен
претходен чекор — по првиот ajax submit станува **кликливо**.

Истиот избор го погодува и `<button type="button">` копчињата во формата, кои немаат
врска со праќањето — сите се оневозможуваат за време на барањето и сите се
овозможуваат потоа.

README:139 и `:143` го документираат однесувањето точно (*„`disabled` on all
`<button>` descendants"* … *„form buttons re-enabled"*), значи е свесно. Она што не е
запишано е дека враќањето не ја обновува претходната состојба, туку ја брише.

### 🟠 AJ5 — Internals пропишува заштита што не може да разликува ништо

**Каде:** `README.md:153-160` наспроти `:193-199` и `:207`

README-то тврди дека `ln-ajax:error` носи **една од две** форми:

> - **HTTP-status error** … `{ method, url, status, data }`
> - **Fetch rejection** … `{ method, url, error }` — the caught `Error`, **no
>   `status`/`data`**.
>
> A single `ln-ajax:error` listener must guard with `'status' in e.detail` before
> reading `status`, and `'error' in e.detail` before reading `error`.

Изворот испраќа **сите пет клуча во обата случаи**:

```js
// :193-199  HTTP статус или парс грешка
dispatch(element, 'ln-ajax:error', {
	method: method, url: finalUrl, status: status, data: data,
	error: parseError || null
});

// :207  мрежен отказ / прекин
dispatch(element, 'ln-ajax:error', {
	method: method, url: finalUrl, status: 0, data: null, error: error
});
```

Значи `'status' in e.detail` е **секогаш** точно и `'error' in e.detail` е **секогаш**
точно. Пропишаната заштита не разликува ништо, а активно заведува: слушач што ја
следи ќе го прочита `status: 0` од мрежен отказ како валиден HTTP статус.

Табелата на настани во истото README (`:87`) ја наведува точната форма —
`{ method, url, status, data, error }`. Документот си противречи, и погрешната
половина е онаа што дава упатство.

Точната дискриминанта постои: `status === 0` значи дека одговор не пристигнал.

### 🟡 AJ6 — Internals тврди авто-тост што компонентата не го прави

**Каде:** `README.md:122`, `:124`

> - **HTTP error** … dispatch `ln-ajax:error` …, **auto-toast if `data.message`**.
> - **Success**: update `document.title`, swap `target.innerHTML` …, **auto-toast if
>   `data.message`**, `history.pushState` …

Grep низ `src/ln-ajax.js` за `message`, `toast` или `ln-toast`: **нула**.
`_makeAjaxRequest` го чита `data.title` (`:169`) и `data.content` (`:173`) и ништо
повеќе.

Истото README го кажува точното однесување 50 реда погоре (`:74`):

> **`message`**: Optional. When present, **handled and dispatched as UI toasts by
> Layer 2 coordinators** (such as `ln-ui-coordinator`).

Договорната секција е точна, Internals секцијата ја припишува на `ln-ajax` работата
на координаторот. Седмо појавување на SYS-19.

### 🟡 AJ7 — Третиот консумент на методот на формата го заобиколува примитивот

**Каде:** `:60` наспроти `ln-core/helpers.js:421-429`

```js
const method = form.method.toUpperCase();
```

`ln-core` го носи `resolveFormMethod` со коментар што ја објаснува сопствената
причина за постоење:

> Effective HTTP method for a form: hidden `_method` input (non-empty) wins, else the
> form's own `method` attribute. **Shared by ln-form's submit gate and
> ln-data-coordinator's native-submit claim so both read the identical literal DOM
> state — no drift between the two independent checks.**

`ln-ajax` е трет независен читач на истата состојба и не го користи.

Функционално мрежниот повик е точен — `_method` патува во `FormData` и Laravel го
подигнува (README:115 го објаснува правилно). Дивергенцијата е во **испратените
настани**: форма во edit режим (`_method = PUT`) испраќа
`ln-ajax:before-start` / `:start` / `:success` со `detail.method === 'POST'`.
Координатор што слуша и гранка по `detail.method` го гледа погрешниот глагол.

## 🔵 Предлози

| # | Забелешка | Каде |
|---|---|---|
| P1 | Проверката на hostname е двојна во истата патека: `:25` при врзување, па повторно внатре во `shouldInterceptLink` (`helpers.js:947`) при кликот. Обете споредуваат само `hostname`, без порт и протокол — `http://host:3000` и `https://host` се сметаат за ист домаќин. **Ја затвора пренесената ставка** од `ln-external-links` EL2; истиот пар останува отворен за `#47 ln-router`. | `:25`, `:31` |
| P2 | `href.includes('#')` (`:28`) го исклучува **секој** href што содржи `#` било каде — `/users?tab=a#top` никогаш не се фаќа. `shouldInterceptLink` користи `startsWith('#')`. Две различни правила за хеш во иста интерцепција. Ист облик како `ln-fill` P2. | `:28` |
| P3 | Локалниот `findElements` (`:214`) го засенува истоименото извезено од `ln-core`, а `ln-core` во овој фајл **не** е увезен за тоа име (`:1` зема пет други). Дивергенцијата е документирана двапати, но идентичното име значи дека читател што го знае `ln-core`-овиот потпис ќе го прочита погрешно. | `:214` |
| P4 | `window.lnAjax.destroy` (`:274`) не е спомнат во README-то, нема `ln-ajax:destroyed` настан, и `_destroy` (`:80-98`) не го чисти `ScopeWarned` знаменцето — повторна иницијализација на иста форма нема да го повтори предупредувањето, што е точно за трајна страница и погрешно по вистински teardown. | `:80-98`, `:274` |
| P5 | `component-guide.md:339` вели дека **три** компоненти имаат сопствен животен циклус со `observeAttributes`. Grep дава четири: `ln-ajax:261`, `ln-external-links:87`, `ln-link:181`, `ln-debug/gate.js:100`. | доктрина |

## Drift табела

| нешто | извор | README | schema |
|---|---|---|---|
| `data-ln-ajax` (присуство) | `:11` | ✅ | ✅ |
| `data-ln-ajax="false"` (опт-аут) | `:217,219,222,223` | ✅ со изречно предупредување за други вредности | ✅ |
| `data-ln-form-scope` (туѓ, се чита) | `:6,49` | ✅ во Pitfalls | ✅ |
| `data-ln-debug` | само `-dev.scss` | ❌ | ✅ |
| `ln-ajax:before-start` (cancelable) | `:101` | ✅ | н/п |
| `ln-ajax:start` | `:104` | ✅ | н/п |
| `ln-ajax:success` | `:191` | ✅ | н/п |
| `ln-ajax:error` | `:193`, `:207` | ⚠️ табелата точна, Internals погрешна | н/п |
| `ln-ajax:complete` | `:202`, `:208` | ✅ | н/п |
| `ln-ajax:destroyed` | **не постои** | — | н/п |
| `.ln-ajax--loading` + `<span class="ln-ajax-spinner">` | `:106-109` | ✅ во табелата на мутации | н/п |
| `disabled` на сите копчиња | `:64-71` | ✅ (но не и дека состојбата не се враќа) | н/п |
| `document.title = data.title` | `:170` | ✅ | н/п |
| `data.content[id] → innerHTML` | `:177` | ✅ | н/п |
| `history.pushState` | `:185,188` | ✅ во табелата | н/п |
| **`popstate`** | **не постои** | ❌ неспомнато; `:5` тврди управување со историја | н/п |
| авто-тост од `data.message` | **не постои** | ❌ Internals тврди двапати | н/п |
| CSRF од `meta[name="csrf-token"]` | `:120-137` | ✅ во Pitfalls | н/п |
| `_method` во `FormData` | транспарентно | ✅ (но `detail.method` останува POST) | н/п |
| `resolveFormMethod` | **не се користи** | ❌ | н/п |
| `window.lnAjax.destroy` | `:274` | ❌ | н/п |
| Internals извор | `src/ln-ajax.js` | ❌ покажува на bundle | н/п |

## Затечена состојба

**Два компоненти го поседуваат `document.title` и стекот на историјата.**
`ln-ajax` (`:170`, `:185`, `:188`) и `ln-router` (`:363`, `:325`, `:471`). Ниту еден
README не ја спомнува другата компонента, и ниту еден од двата `pushState` повици не
остава ознака што другата страна би можела да ја препознае — `ln-ajax` пишува
`{ ajax: true }`, `ln-router` пишува `null`. Разрешувањето оди во #47.

**Четврта сервисна компонента без инстанца.** `window.lnAjax` е функција со
прикачен `destroy` (`:273-274`), а `domRoot[DOM_ATTRIBUTE] = true` (`:13`) е boolean
sentinel на елементот. Тоа е четврта семантика на `window.lnX` / `el.lnX` по
`ln-fill`, `ln-external-links` и `ln-http` — забелешката P1 од `ln-fill` останува
отворена и расте.

**`ln-ajax` и `ln-http` се единствените два консументи на CSRF метата**, со две
разидени имплементации — заведено во `ln-upload` U4 (`ln-upload:24` е третиот).
Овде разликата е во корист на `ln-ajax`: `:135` го поставува заглавјето **само** ако
токенот постои, што е точното однесување.

Конзолен излез: еден `console.warn` (`:52`), со `[ln-ajax]` префикс, еднократен по
форма. Inline стил: нула. Зашиен кориснички текст: нула (спинерот е празен `<span>`).
`createElement`: еден (`:107`) — наодот AJ3.
