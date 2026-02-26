# JS Components — Конвенции и Pattern-и

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
2. **Користи само јавен API** (`el.lnToggle.close()`, `.isOpen`) — никогаш директен DOM/state
3. **Емитувај свои events** за своите акции (`ln-accordion:change`)
4. **Никогаш не import-ирај** друга компонента — само CustomEvent комуникација

```javascript
// Точно — слуша post-action, користи public API, емитува свој event
dom.addEventListener('ln-toggle:open', function (e) {
    dom.querySelectorAll('[data-ln-toggle]').forEach(function (el) {
        if (el !== e.detail.target && el.lnToggle && el.lnToggle.isOpen) {
            el.lnToggle.close();  // public API
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

## Компонента = Data Layer, Координатор = UI Wiring

Компонентите се **чисти data layers** — менаџираат state, CRUD операции и dispatching на CustomEvent. **НЕ знаат** за конкретни UI елементи надвор од својот DOM root.

### Компонентата НЕ смее да:
- Слуша клик на конкретно копче (пр. `[data-ln-action="delete-profile"]`)
- Отвора/затвора модали (`lnModal.open(...)`)
- Покажува toast нотификации
- Чита input полиња од форми надвор од својот DOM
- Знае за `ln-form:submit` на надворешни форми

### Компонентата СМЕЕ да:
- Менаџира свој state (CRUD)
- Рендерира свој DOM (пр. profile buttons во `<nav data-ln-profile>`)
- Слуша клик на **свои** child елементи (пр. profile button → `switchTo()`)
- Dispatcha CustomEvents (`ln-profile:created`, `ln-profile:switched`)
- Expose-ува public API преку prototype (`create()`, `remove()`, `switchTo()`)

### Координатор (app-level wiring)
Проектот има **координатор** (пр. `ln-mixer.js`) — тенок IIFE кој:

1. **Фаќа UI акции** — клик на `[data-ln-action="new-profile"]`, `ln-form:submit` за `new-profile`
2. **Преведува во API повици** — `nav.lnProfile.create(name)`, `nav.lnProfile.remove(id)`
3. **Хендла UI реакции** — toast на `ln-profile:created`, затвори модал на `ln-profile:deleted`
4. **Bridges компоненти** — `ln-profile:switched` → сетирај `data-ln-playlist-profile` на sidebar

```javascript
// Координатор — слуша конкретни копчиња, вика component API
document.addEventListener('click', function (e) {
    if (e.target.closest('[data-ln-action="delete-profile"]')) {
        var profile = nav.lnProfile;
        if (profile) profile.remove(profile.currentId);
    }
});

// Координатор — реагира на component events со UI feedback
document.addEventListener('ln-profile:deleted', function () {
    lnModal.close('modal-settings');
    window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
        detail: { type: 'info', message: 'Profile deleted' }
    }));
});
```

**Зошто?** Компонентата е reusable. Координаторот е project-specific. Ако утре имаш друго копче или друг модал — менуваш само координаторот, не компонентата.

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
