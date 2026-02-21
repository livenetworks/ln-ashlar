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
    var items = root.querySelectorAll('[' + DOM_SELECTOR + ']') || [];
    if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR)) {
        items = Array.from(items);
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
// Constructor за scan на DOM (auto-init или рачно)
window.lnToggle(document.body);

// Instance API на елементот
document.getElementById('sidebar').lnToggle.open();
document.getElementById('sidebar').lnToggle.close();
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
