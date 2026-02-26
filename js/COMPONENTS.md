# JS Components — Конвенции и Pattern-и

## Архитектура на ln-acme проект (задолжително)

Секој проект кој користи ln-acme JS компоненти **МОРА** да следи три слоја:

```
┌─────────────────────────────────────────────────────┐
│  Координатор (project-specific)                     │
│  Фаќа UI акции → dispatcha request events →         │
│  реагира на notification events со UI feedback       │
├─────────────────────────────────────────────────────┤
│  Компоненти (reusable)                              │
│  State + CRUD + request listeners + notifications    │
├─────────────────────────────────────────────────────┤
│  ln-acme (library)                                  │
│  ln-toggle, ln-accordion, ln-modal, ln-toast...      │
└─────────────────────────────────────────────────────┘
```

### Три правила

1. **Компонента = data layer.** Менаџира state, CRUD, свој DOM. НЕ отвора модали, НЕ покажува toast, НЕ чита надворешни форми.
2. **Координатор = UI wiring.** Фаќа копчиња/форми, dispatcha request events на компоненти, реагира на notification events со UI feedback (toast, модал, highlight).
3. **Commands → request events. Queries → direct API.** Координаторот НИКОГАШ не повикува prototype методи за state mutations (`el.lnProfile.create()`). СЕКОГАШ dispatcha request event (`ln-profile:request-create`). Читање на state е дозволено директно (`el.lnProfile.currentId`).

### Event flow

```
[Корисник клика копче]
        ↓
[Координатор] фаќа click на [data-ln-action="new-profile"]
        ↓
[Координатор] чита input, dispatcha request event:
    nav.dispatchEvent('ln-profile:request-create', { detail: { name } })
        ↓
[Компонента ln-profile] слуша request-create, повикува self.create(name)
        ↓
[Компонента] менува state, рендерира DOM, dispatcha notification:
    _dispatch(dom, 'ln-profile:created', { profileId, profile })
        ↓
[Координатор] слуша ln-profile:created → покажува toast, затвора модал
```

### Workflow за нова функционалност

1. **Компонента**: додај prototype метод (чист — прими параметри, менувај state, dispatcha notification event)
2. **Компонента**: додај request listener во `_bindEvents` (повикува го истиот prototype метод)
3. **Координатор**: додај UI trigger (click / form submit → dispatcha request event на компонента)
4. **Координатор**: додај UI reaction (слушај notification event → toast / modal / highlight)

### Тест: „Дали е компонента или координатор?"

| Прашање | Ако ДА → | Ако НЕ → |
|---------|----------|----------|
| Менува свој state (CRUD)? | компонента | координатор |
| Рендерира свој DOM (листа, копчиња)? | компонента | координатор |
| Отвора модал / покажува toast? | координатор | компонента |
| Чита input од форма? | координатор | компонента |
| Слуша `[data-ln-action="..."]` клик? | координатор | компонента |
| Слуша клик на **свој child** елемент? | компонента | координатор |
| Bridges две компоненти (A:event → B:attribute)? | координатор | — |

---

## IIFE Pattern (задолжителен)

Секоја компонента е IIFE (Immediately Invoked Function Expression) — нема exports, нема imports, нема зависности.

```javascript
(function () {
    const DOM_SELECTOR = 'data-ln-{name}';
    const DOM_ATTRIBUTE = 'ln{Name}';

    // Заштита од двојно вчитување
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    // ... компонента ...

    window[DOM_ATTRIBUTE] = constructor;
})();
```

---

## Instance-based Pattern (препорачан)

Компонентата се **закачува на DOM елемент**. API-то живее на елементот, НЕ на `window`.

```javascript
// window[DOM_ATTRIBUTE] е само constructor функција
function constructor(domRoot) {
    _findElements(domRoot);
}

function _findElements(root) {
    var items = Array.from(root.querySelectorAll('[' + DOM_SELECTOR + ']'));
    if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
        items.push(root);
    }
    items.forEach(function (el) {
        if (!el[DOM_ATTRIBUTE]) {
            el[DOM_ATTRIBUTE] = new _component(el);
        }
    });
}

function _component(dom) {
    this.dom = dom;
    // ... init ...
    return this;
}

// Prototype методи = public API
_component.prototype.open = function () { ... };
_component.prototype.close = function () { ... };
```

**Употреба:**
```javascript
// Instance API на елементот
document.getElementById('sidebar').lnToggle.open();
document.getElementById('sidebar').lnToggle.close();

// Constructor — само за нестандардни случаи (Shadow DOM, iframe)
// Динамички AJAX HTML НЕ бара рачна иницијализација — MutationObserver го прави тоа автоматски
window.lnToggle(container);
```

---

## MutationObserver (задолжителен)

Секоја компонента мора да следи динамички додадени елементи:

```javascript
function _domObserver() {
    var observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        _findElements(node);
                    }
                });
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}
```

---

## CustomEvent комуникација

Компонентите НЕ знаат едни за други. Комуникација САМО преку CustomEvent.

```javascript
function _dispatch(element, eventName, detail) {
    element.dispatchEvent(new CustomEvent(eventName, {
        bubbles: true,
        detail: detail || {}
    }));
}

// Испрати
_dispatch(this.dom, 'ln-toggle:open', { target: this.dom });

// Слушај (во друга компонента или интеграциски код)
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Отворен:', e.detail.target);
});
```

---

## Lifecycle Events (животен циклус)

Секоја компонента со акции мора да емитува **пар events**: `before-{action}` (cancelable) + `{action}` (post).

```javascript
function _dispatchCancelable(element, eventName, detail) {
    var event = new CustomEvent(eventName, {
        bubbles: true,
        cancelable: true,
        detail: detail || {}
    });
    element.dispatchEvent(event);
    return event;
}

_component.prototype.open = function () {
    if (this.isOpen) return;
    var before = _dispatchCancelable(this.dom, 'ln-component:before-open', { target: this.dom });
    if (before.defaultPrevented) return;   // надворешен код може да го откаже
    this.isOpen = true;
    this.dom.classList.add('open');
    _dispatch(this.dom, 'ln-component:open', { target: this.dom });
};
```

**Правила:**
- `before-{action}` — `cancelable: true`, се fire-ува **пред** промена на состојба
- `{action}` — `cancelable: false`, се fire-ува **по** промена на состојба (fact, не prediction)
- Именување: `ln-{component}:before-{action}` и `ln-{component}:{action}`
- `detail` секогаш содржи `{ target: HTMLElement }` — елементот на кој се случи акцијата

**Употреба:**
```javascript
// Откажи условно
element.addEventListener('ln-toggle:before-open', function (e) {
    if (!userHasPermission()) e.preventDefault();
});

// Реагирај по факт
document.addEventListener('ln-toggle:open', function (e) {
    analytics.track('panel-opened', e.detail.target.id);
});
```

---

## Trigger re-init guard

Кога компонентата слуша click events на trigger елементи, мора да постави guard за да спречи дупли listeners при повторно скенирање на DOM (MutationObserver):

```javascript
function _attachTriggers(root) {
    var triggers = Array.from(root.querySelectorAll('[data-ln-{name}-for]'));
    triggers.forEach(function (btn) {
        if (btn[DOM_ATTRIBUTE + 'Trigger']) return;  // веќе иницијализиран
        btn[DOM_ATTRIBUTE + 'Trigger'] = true;
        btn.addEventListener('click', function (e) {
            if (e.ctrlKey || e.metaKey || e.button === 1) return;  // дозволи browser shortcuts
            e.preventDefault();
            // ...
        });
    });
}
```

**Правила:**
- Guard: `btn[DOM_ATTRIBUTE + 'Trigger'] = true` (property на DOM елементот)
- Секогаш дозволи ctrl/meta/middle-click пред `e.preventDefault()`

---

## Компонентни зависности

Кога компонента зависи од друга (пр. ln-accordion → ln-toggle):

1. **Слушај само post-action events** (`ln-toggle:open`) — не before-events, освен ако треба да откажеш
2. **Комуницирај само преку events** — dispatcha `request-*` events на целниот елемент, НИКОГАШ не викај друга компонента директно (`el.lnToggle.close()`)
3. **Емитувај свои events** за своите акции (`ln-accordion:change`)
4. **Никогаш не import-ирај** друга компонента — само CustomEvent комуникација

```javascript
// Точно — слуша post-action, dispatcha request event, емитува свој event
dom.addEventListener('ln-toggle:open', function (e) {
    dom.querySelectorAll('[data-ln-toggle]').forEach(function (el) {
        if (el !== e.detail.target) {
            el.dispatchEvent(new CustomEvent('ln-toggle:request-close'));
        }
    });
    _dispatch(dom, 'ln-accordion:change', { target: e.detail.target });  // свој event
});
```

---

## Auto-init на DOMContentLoaded

```javascript
window[DOM_ATTRIBUTE] = constructor;
_domObserver();

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
        constructor(document.body);
    });
} else {
    constructor(document.body);
}
```

---

## Именување

| Елемент | Конвенција | Пример |
|---------|-----------|--------|
| Data attribute | `data-ln-{name}` | `data-ln-toggle` |
| Window constructor | `window.ln{Name}` | `window.lnToggle` |
| DOM instance | `element.ln{Name}` | `el.lnToggle` |
| Custom event | `ln-{name}:{action}` | `ln-toggle:open` |
| CSS класа | `.ln-{name}__{element}` | `.ln-toggle__backdrop` |
| Initialized flag | `data-ln-{name}-initialized` | `data-ln-toggle-for-initialized` |
| Приватна функција | `_functionName` | `_findElements` |

---

## Co-located SCSS

Ако компонентата потребува CSS, креирај `js/ln-{name}/ln-{name}.scss`:

```scss
@use '../../scss/config/mixins' as *;

// Користи @include mixins и var(--token) вредности
.ln-{name}__element {
    @include fixed;
    @include transition;
    z-index: var(--z-overlay);
}
```

Додај го во `js/index.js`:
```javascript
import './ln-{name}/ln-{name}.js';
import './ln-{name}/ln-{name}.scss';
```

---

## Request Events — детали

> Архитектурата е дефинирана во [Архитектура на ln-acme проект](#архитектура-на-ln-acme-проект-задолжително). Тука се само техничките детали.

### Имплементација во компонента

```javascript
// Во _bindEvents — слуша request events на себе
this.dom.addEventListener('ln-profile:request-create', function (e) {
    self.create(e.detail.name);  // повикува ист prototype метод
});
this.dom.addEventListener('ln-profile:request-remove', function (e) {
    self.remove(e.detail.id);
});
```

### Dispatching од координатор

```javascript
// Координатор — dispatcha request event (НЕ директен API повик)
nav.dispatchEvent(new CustomEvent('ln-profile:request-create', {
    detail: { name: 'My Profile' }
}));
```

### Именување

| Тип | Формат | Пример | Bubbles |
|-----|--------|--------|---------|
| Request (incoming) | `ln-{name}:request-{action}` | `ln-profile:request-create` | `false` |
| Notification (outgoing) | `ln-{name}:{past-tense}` | `ln-profile:created` | `true` |
| Lifecycle before | `ln-{name}:before-{action}` | `ln-toggle:before-open` | `true`, cancelable |
| Lifecycle after | `ln-{name}:{action}` | `ln-toggle:open` | `true` |

### Commands vs Queries

| Тип | Механизам | Пример |
|-----|-----------|--------|
| **Command** (менува state) | request event | `nav.dispatchEvent(new CustomEvent('ln-profile:request-remove', { detail: { id } }))` |
| **Query** (чита state) | директен пристап | `nav.lnProfile.currentId`, `sidebar.lnPlaylist.getTrack(idx)` |

---

## Координатор — целосен пример

> Координаторот е тенок IIFE, project-specific. Нема свој state, нема свој DOM. Само wiring.

```javascript
(function () {
    'use strict';
    if (window.myCoordinator !== undefined) return;
    window.myCoordinator = true;

    function _getNav() { return document.querySelector('[data-ln-profile]'); }
    function _getSidebar() { return document.querySelector('[data-ln-playlist]'); }

    function _init() {
        // 1. UI trigger → request event
        document.addEventListener('click', function (e) {
            if (e.target.closest('[data-ln-action="delete-profile"]')) {
                var nav = _getNav();
                if (nav && nav.lnProfile) {
                    nav.dispatchEvent(new CustomEvent('ln-profile:request-remove', {
                        detail: { id: nav.lnProfile.currentId }  // query е OK
                    }));
                }
            }
        });

        // 2. Form submit → request event
        document.addEventListener('ln-form:submit', function (e) {
            if (e.target.getAttribute('data-ln-form') !== 'new-profile') return;
            var input = document.querySelector('[data-ln-field="new-profile-name"]');
            var name = input ? input.value.trim() : '';
            if (!name) return;

            var nav = _getNav();
            if (nav) {
                nav.dispatchEvent(new CustomEvent('ln-profile:request-create', {
                    detail: { name: name }
                }));
            }
            input.value = '';
            lnModal.close('modal-new-profile');
        });

        // 3. Notification → UI feedback
        document.addEventListener('ln-profile:created', function () {
            window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
                detail: { type: 'success', message: 'Profile created' }
            }));
        });

        // 4. Bridge: component A event → component B attribute
        document.addEventListener('ln-profile:switched', function (e) {
            var sidebar = _getSidebar();
            if (sidebar) {
                sidebar.setAttribute('data-ln-playlist-profile', e.detail.profileId);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', _init);
    } else {
        _init();
    }
})();
```

**Четирите работи на координаторот:**
1. **UI trigger → request event** — клик/submit → dispatcha request на компонента
2. **Form processing** — чита input, валидира, чисти, затвора модал
3. **Notification → UI feedback** — toast, modal close, highlight
4. **Bridge** — event од компонента A → attribute/request на компонента B

---

## Template System — DOM структура во HTML, не во JS

**НИКОГАШ** не гради DOM структура со `createElement` chains во JS. Користи нативен HTML `<template>` елемент.

### Принцип

DOM структурата е **HTML одлука**, не JS одлука. Компонентата само ги полни податоците.

```
HTML:  <template> ги дефинира структурите (inert, не се рендерираат)
JS:    clone → querySelector → textContent/setAttribute
```

### HTML — дефинирај templates на крајот од `<body>`, пред `<script>` тагови

```html
<!-- Templates -->
<template data-ln-template="track-item">
    <li data-ln-track>
        <span class="track-number" data-ln-drag-handle></span>
        <article class="track-info">
            <p class="track-name"></p>
            <p class="track-artist"></p>
        </article>
        <nav class="track-actions">
            <button type="button" data-ln-load-to="a">A</button>
            <button type="button" data-ln-load-to="b">B</button>
        </nav>
    </li>
</template>

<template data-ln-template="profile-btn">
    <button type="button" class="profile-btn" data-ln-profile-id></button>
</template>

<script src="..."></script>
```

### JS — `_cloneTemplate` helper (IIFE-scoped, lazy-cached)

Секоја IIFE компонента добива свој `_cloneTemplate`:

```javascript
var _tmplCache = {};
function _cloneTemplate(name) {
    if (!_tmplCache[name]) {
        _tmplCache[name] = document.querySelector('[data-ln-template="' + name + '"]');
    }
    return _tmplCache[name].content.cloneNode(true);
}
```

### Употреба — clone + fill

```javascript
_component.prototype._buildTrackItem = function (track, idx) {
    var frag = _cloneTemplate('track-item');
    var li = frag.querySelector('[data-ln-track]');

    li.setAttribute('data-ln-track', idx);
    li.querySelector('.track-number').textContent = idx + 1;
    li.querySelector('.track-name').textContent = track.title;
    li.querySelector('.track-artist').textContent = track.artist;

    return li;
};
```

### Правила

1. **`<template data-ln-template="name">`** — конвенција за именување
2. **Место:** на крајот од `<body>`, пред `<script>` тагови, во коментар блок `TEMPLATES`
3. **`content.cloneNode(true)`** враќа DocumentFragment — query-ирај го root елементот со `querySelector`
4. **JS само полни:** `textContent`, `setAttribute`, `classList` — НЕ создава структура
5. **Услови:** мали условни елементи (1-2 spans за индикатори) се OK како `createElement`
6. **Еден template, една функција:** ако иста структура се создава на 2+ места, мора да биде `<template>` + заедничка функција

### Зошто

| createElement chains | `<template>` |
|---------------------|--------------|
| 60+ линии JS за еден `<li>` | 10 линии HTML + 8 линии JS |
| Структура скриена во JS | Структура видлива во HTML |
| Дупликација помеѓу методи | Една дефиниција, една функција |
| Тешко за дизајнер | HTML — лесно за промена |

---

## Компоненти (референца)

| Компонента | Pattern | Data Attr | Опис |
|-----------|---------|-----------|------|
| ln-toggle | Instance | `data-ln-toggle` | Генерички toggle (sidebar, collapse) |
| ln-accordion | Instance | `data-ln-accordion` | Wrapper — само еден toggle отворен |
| ln-tabs | Instance | `data-ln-tabs` | Hash-aware tab навигација |
| ln-nav | Instance | `data-ln-nav` | Active link highlighter |
| ln-modal | Functional | `data-ln-modal` | Modal dialog |
| ln-toast | Functional | `data-ln-toast` | Toast notifications |
| ln-upload | Functional | `data-ln-upload` | File upload |
| ln-ajax | Functional | `data-ln-ajax` | AJAX navigation |
| ln-progress | Functional | `data-ln-progress` | Progress bar |
| ln-select | Wrapper | `data-ln-select` | TomSelect wrapper |
| ln-external-links | Utility | — | External links handler |
