# JS Components — Conventions and Patterns

## ln-acme Project Architecture (mandatory)

Every project using ln-acme JS components **MUST** follow three layers:

```
┌─────────────────────────────────────────────────────┐
│  Coordinator (project-specific)                      │
│  Catches UI actions → dispatches request events →    │
│  reacts to notification events with UI feedback      │
├─────────────────────────────────────────────────────┤
│  Components (reusable)                               │
│  State + CRUD + request listeners + notifications    │
├─────────────────────────────────────────────────────┤
│  ln-acme (library)                                   │
│  ln-toggle, ln-accordion, ln-modal, ln-toast...      │
└─────────────────────────────────────────────────────┘
```

### Three Rules

1. **Component = data layer.** Manages state, CRUD, its own DOM. Does NOT open modals, does NOT show toast, does NOT read external forms.
2. **Coordinator = UI wiring.** Catches buttons/forms, dispatches request events to components, reacts to notification events with UI feedback (toast, modal, highlight).
3. **Commands → request events. Queries → direct API.** The coordinator NEVER calls prototype methods for state mutations (`el.lnProfile.create()`). ALWAYS dispatches a request event (`ln-profile:request-create`). Reading state directly is allowed (`el.lnProfile.currentId`).

### Event flow

```
[User clicks button]
        ↓
[Coordinator] catches click on [data-ln-action="new-profile"]
        ↓
[Coordinator] reads input, dispatches request event:
    nav.dispatchEvent('ln-profile:request-create', { detail: { name } })
        ↓
[Component ln-profile] listens for request-create, calls self.create(name)
        ↓
[Component] changes state, renders DOM, dispatches notification:
    _dispatch(dom, 'ln-profile:created', { profileId, profile })
        ↓
[Coordinator] listens for ln-profile:created → shows toast, closes modal
```

### Workflow for new functionality

1. **Component**: add prototype method (clean — accept params, change state, dispatch notification event)
2. **Component**: add request listener in `_bindEvents` (calls the same prototype method)
3. **Coordinator**: add UI trigger (click / form submit → dispatch request event to component)
4. **Coordinator**: add UI reaction (listen to notification event → toast / modal / highlight)

### Test: "Is it a component or coordinator?"

| Question | If YES → | If NO → |
|---------|----------|----------|
| Changes its own state (CRUD)? | component | coordinator |
| Renders its own DOM (list, buttons)? | component | coordinator |
| Opens modal / shows toast? | coordinator | component |
| Reads input from form? | coordinator | component |
| Listens to `[data-ln-action="..."]` click? | coordinator | component |
| Listens to click on **its own child** element? | component | coordinator |
| Bridges two components (A:event → B:attribute)? | coordinator | — |

---

## IIFE Pattern (mandatory)

Every component is an IIFE (Immediately Invoked Function Expression). Shared helpers are imported from `ln-core`; the IIFE body has no exports.

```javascript
import { dispatch } from '../ln-core';
import { deepReactive, createBatcher } from '../ln-core';

(function () {
    const DOM_SELECTOR = 'data-ln-{name}';
    const DOM_ATTRIBUTE = 'ln{Name}';

    // Guard against double loading
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    // ... component ...

    window[DOM_ATTRIBUTE] = constructor;
})();
```

### ln-core shared helpers

| Import | Purpose |
|--------|---------|
| `findElements(root, selector, attr, Constructor)` | Find all `[selector]` under root, skip initialized, instantiate |
| `dispatch(el, name, detail)` | Fire non-cancelable CustomEvent |
| `dispatchCancelable(el, name, detail)` | Fire cancelable CustomEvent, returns event |
| `cloneTemplate(name, tag)` | Clone `<template data-ln-template="name">`, cached |
| `fill(root, data)` | Declarative DOM binding via `data-ln-field`, `data-ln-attr`, `data-ln-show`, `data-ln-class` |
| `buildDict(root, selector)` | Read hidden i18n elements once at init, return plain object, remove from DOM |
| `renderList(container, items, tpl, keyFn, fillFn, tag)` | Keyed list rendering with DOM reuse |
| `reactiveState(initial, onChange)` | Shallow Proxy — onChange(prop, value, old) per set |
| `deepReactive(obj, onChange)` | Deep Proxy — onChange() on any nested change |
| `createBatcher(renderFn, afterRender)` | Coalesce multiple sync state changes into one render |

Import only what the component needs. Vite tree-shakes unused exports.

---

## Instance-based Pattern (recommended)

The component is **attached to a DOM element**. The API lives on the element, NOT on `window`.

```javascript
import { findElements } from '../ln-core';

// window[DOM_ATTRIBUTE] is just the constructor function
function constructor(domRoot) {
    findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
}

function _component(dom) {
    this.dom = dom;
    // ... init ...
}

// Prototype methods = public API
_component.prototype.open = function () { ... };
_component.prototype.close = function () { ... };
```

**Usage:**
```javascript
// Instance API on the element
document.getElementById('sidebar').lnToggle.open();
document.getElementById('sidebar').lnToggle.close();

// Constructor — only for non-standard cases (Shadow DOM, iframe)
// Dynamic AJAX HTML does NOT require manual init — MutationObserver handles it automatically
window.lnToggle(container);
```

---

## Attribute Bridge (mandatory)

Instance methods that change component state **must only call `setAttribute`**. The MutationObserver observes the attribute change and applies the actual state. Direct DOM manipulation inside instance methods is forbidden.

```javascript
// CORRECT — method is a thin setAttribute wrapper
_component.prototype.open = function () {
    if (this.isOpen) return;
    this.dom.setAttribute(DOM_SELECTOR, 'open');
    // MutationObserver fires → _syncAttribute() applies state
};

// WRONG — method bypasses the attribute and manipulates state directly
_component.prototype.open = function () {
    this.isOpen = true;
    this.dom.classList.add('open');
    document.addEventListener('keydown', this._onEscape);
    dispatch(this.dom, 'ln-component:open', { target: this.dom });
};
```

**Why:** The attribute is the single source of truth. Any external code can trigger the same state change with `el.setAttribute(...)` and get identical behaviour. The component never has two code paths to the same state.

**Rule:** If a prototype method changes state, its entire body is `this.dom.setAttribute(...)`. All state logic lives in `_syncAttribute()` (or equivalent), called only by the MutationObserver.

---

## MutationObserver (mandatory)

Every component must watch for **two types** of changes:

1. **`childList`** — new element added to DOM (AJAX, `innerHTML`, `appendChild`)
2. **`attributes`** — `data-ln-*` attribute added to existing element (Inspector, `setAttribute`)

```javascript
function _domObserver() {
    const observer = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        findElements(node, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
                    }
                }
            } else if (mutation.type === 'attributes') {
                findElements(mutation.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: [DOM_SELECTOR]
    });
}
```

**Rules:**
- `attributeFilter` always includes `DOM_SELECTOR` (and optionally trigger attributes like `'data-ln-toggle-for'`)
- `attributeFilter` is mandatory — without it the observer fires on EVERY attribute change (performance issue)
- On `attributes` mutation, `mutation.target` is the element whose attribute changed — call `findElements` directly on it

---

## Reactive Rendering Pattern

When a component has **multiple internal state properties** that together drive DOM updates, use `reactiveState` + `createBatcher` + `fill()` from ln-core. This eliminates manual querySelector chains and coalesces multiple synchronous state changes into a single DOM update.

### The three primitives

| Helper | Role |
|--------|------|
| `reactiveState(initial, onChange)` | Proxy — calls `onChange(prop, value, old)` on every top-level property set |
| `createBatcher(renderFn, afterRender)` | Coalesces sync state changes into one `renderFn` call via `queueMicrotask` |
| `fill(root, data)` | Writes state to DOM via `data-ln-field`, `data-ln-attr`, `data-ln-show`, `data-ln-class` |

### Pattern

```javascript
import { reactiveState, createBatcher, fill, dispatch } from '../ln-core';

function _component(dom) {
    this.dom = dom;
    const self = this;

    const queueRender = createBatcher(
        function () { self._render(); },      // runs after current sync block
        function () { self._afterRender(); }  // runs after render — dispatch events here
    );

    this.state = reactiveState({ key: null, value: null }, queueRender);
}

_component.prototype._render = function () {
    fill(this.dom, this.state);
    // additional DOM logic derived from state
};

_component.prototype._afterRender = function () {
    dispatch(this.dom, 'ln-component:changed', { key: this.state.key });
};
```

When multiple properties change in the same sync block:

```javascript
this.state.key = 'status';   // queues render
this.state.value = 'active'; // queues again — same microtask, no duplicate
// → microtask fires → _render() once → _afterRender() once
```

### `reactiveState` vs `deepReactive`

| | `reactiveState` | `deepReactive` |
|---|---|---|
| **Depth** | Shallow — top-level sets only | Deep — nested object/array mutations |
| **onChange args** | `(prop, value, old)` | `()` — no args |
| **Use when** | Flat state with primitive values | State contains nested objects or arrays |

### `fill()` — limitations

`fill()` sets `textContent` for `data-ln-field` — it does **not** set `.value` on `<input>`, `<textarea>`, or `<select>`. For form elements, set `.value` manually after `fill()`.

### When to use

Use reactive rendering when a component has **2+ state properties** that together drive DOM, and multiple changes happen in the same sync block.

**Don't use it for:**
- Single boolean state — `this.isOpen = true; dom.classList.toggle(...)` is simpler
- Event-driven rendering — components that receive data via `set-data` events (ln-data-table)
- One-shot renders — clone template + fill once, no ongoing state

### Used in

- **ln-filter** — `{ key, value }` state drives button active states and target element visibility

---

## CustomEvent Communication

Components do NOT know about each other. Communication ONLY via CustomEvent.

```javascript
import { dispatch } from '../ln-core';

// Dispatch
dispatch(this.dom, 'ln-toggle:open', { target: this.dom });

// Listen (in another component or integration code)
document.addEventListener('ln-toggle:open', function (e) {
    console.log('Opened:', e.detail.target);
});
```

---

## Lifecycle Events

Every component with actions must emit **paired events**: `before-{action}` (cancelable) + `{action}` (post).

```javascript
import { dispatch, dispatchCancelable } from '../ln-core';

_component.prototype.open = function () {
    if (this.isOpen) return;
    const before = dispatchCancelable(this.dom, 'ln-component:before-open', { target: this.dom });
    if (before.defaultPrevented) return;   // external code can cancel
    this.isOpen = true;
    this.dom.classList.add('open');
    dispatch(this.dom, 'ln-component:open', { target: this.dom });
};
```

**Rules:**
- `before-{action}` — `cancelable: true`, fires **before** state change
- `{action}` — `cancelable: false`, fires **after** state change (fact, not prediction)
- Naming: `ln-{component}:before-{action}` and `ln-{component}:{action}`
- `detail` always contains `{ target: HTMLElement }` — the element where the action occurred

**Usage:**
```javascript
// Cancel conditionally
element.addEventListener('ln-toggle:before-open', function (e) {
    if (!userHasPermission()) e.preventDefault();
});

// React after the fact
document.addEventListener('ln-toggle:open', function (e) {
    analytics.track('panel-opened', e.detail.target.id);
});
```

---

## Trigger Re-init Guard

When a component listens for click events on trigger elements, it must set a guard to prevent duplicate listeners on repeated DOM scans (MutationObserver):

```javascript
function _attachTriggers(root) {
    const triggers = Array.from(root.querySelectorAll('[data-ln-{name}-for]'));
    triggers.forEach(function (btn) {
        if (btn[DOM_ATTRIBUTE + 'Trigger']) return;  // already initialized
        btn[DOM_ATTRIBUTE + 'Trigger'] = true;
        btn.addEventListener('click', function (e) {
            if (e.ctrlKey || e.metaKey || e.button === 1) return;  // allow browser shortcuts
            e.preventDefault();
            // ...
        });
    });
}
```

**Rules:**
- Guard: `btn[DOM_ATTRIBUTE + 'Trigger'] = true` (property on DOM element)
- Always allow ctrl/meta/middle-click before `e.preventDefault()`

---

## Component Dependencies

When a component depends on another (e.g. ln-accordion → ln-toggle):

1. **Listen only to post-action events** (`ln-toggle:open`) — not before-events, unless you need to cancel
2. **Communicate only via events** — dispatch `request-*` events to the target element, NEVER call another component directly (`el.lnToggle.close()`)
3. **Emit your own events** for your own actions (`ln-accordion:change`)
4. **Never import** another component — CustomEvent communication only

```javascript
// Correct — listens to post-action, sets attribute on siblings, emits own event
dom.addEventListener('ln-toggle:open', function (e) {
    dom.querySelectorAll('[data-ln-toggle]').forEach(function (el) {
        if (el !== e.detail.target && el.getAttribute('data-ln-toggle') === 'open') {
            el.setAttribute('data-ln-toggle', 'close');
        }
    });
    _dispatch(dom, 'ln-accordion:change', { target: e.detail.target });  // own event
});
```

---

## Coordinator/Mediator Pattern — Canonical Example

The architecture follows the **Mediator pattern** (GoF): components do not communicate with each other. The coordinator mediates all cross-component interactions.

### Canonical Example: ln-accordion / ln-toggle

The ln-acme library already implements this:

- **ln-toggle** is a component (state layer): `data-ln-toggle` attribute is the single source of truth. MutationObserver detects attribute changes → applies `.open` class, emits `ln-toggle:open` / `ln-toggle:close`. API methods (`open()`, `close()`) just set the attribute.
- **ln-accordion** is a coordinator (mediator): listens to `ln-toggle:open` from children, sets `data-ln-toggle="close"` on siblings. **Never** calls `el.lnToggle.close()`. Emits its own `ln-accordion:change`

```
[Toggle A opens — attribute set to "open"]
        ↓
    MutationObserver → .open class + ln-toggle:open event (bubbles up)
        ↓
[Accordion] catches it, sets data-ln-toggle="close" on B and C
        ↓
[Toggle B] observer detects attribute change → if was open → closes
[Toggle C] observer detects attribute change → already closed → no-op
```

Toggle **doesn't know** that other toggles exist. Accordion **doesn't know** about toggle's internal state. Communication = attribute changes + events only.

### Scaling to Project Level

The same pattern scales from library to application:

| ln-acme (library) | Project (application) | Role |
|---|---|---|
| ln-toggle | ln-profile, ln-playlist, ln-deck | Component (state + events) |
| ln-accordion | ln-mixer (coordinator) | Mediator (event wiring) |
| `ln-toggle:open` | `ln-profile:switched` | Notification event (fact) |
| `setAttribute('data-ln-toggle', 'close')` | `ln-deck:request-load` | Attribute change / Request event (command) |
| `ln-accordion:change` | toast / modal close | Coordinator reaction |

### Isolation Rules

1. **Component → sibling component: FORBIDDEN.** A component NEVER queries another component (`lnSettings.getApiUrl()`, `nav.lnProfile.getProfile()`). Only the coordinator knows about all of them.
2. **Component → storage/DB: FORBIDDEN.** A component does NOT call `lnDb.put()` or any storage backend. The coordinator decides which storage backend to call.
3. **Coordinator → component query: ALLOWED.** The coordinator reads state directly (`el.lnProfile.currentId`).
4. **Coordinator → component command: ONLY request events.** The coordinator dispatches `request-*` events, the component decides independently.

**Why?** Components become storage-agnostic and sibling-agnostic. Changing the backend (IndexedDB → API → localStorage) requires changes ONLY in the coordinator. Adding a new component requires changes ONLY in the coordinator.

---

## Auto-init on DOMContentLoaded

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

## Naming

| Element | Convention | Example |
|---------|-----------|--------|
| Data attribute | `data-ln-{name}` | `data-ln-toggle` |
| Window constructor | `window.ln{Name}` | `window.lnToggle` |
| DOM instance | `element.ln{Name}` | `el.lnToggle` |
| Custom event | `ln-{name}:{action}` | `ln-toggle:open` |
| CSS class | `.ln-{name}__{element}` | `.ln-toggle__backdrop` |
| Initialized flag | `data-ln-{name}-initialized` | `data-ln-toggle-for-initialized` |
| Private function | `_functionName` | `_render`, `_attachTriggers` |

---

## Co-located SCSS

If a component needs CSS, create `js/ln-{name}/ln-{name}.scss`:

```scss
@use '../../scss/config/mixins' as *;

// Use @include mixins and var(--token) values
.ln-{name}__element {
    @include fixed;
    @include transition;
    z-index: var(--z-overlay);
}
```

Add it to `js/index.js`:
```javascript
import './ln-{name}/ln-{name}.js';
import './ln-{name}/ln-{name}.scss';
```

---

## Request Events — Details

> Architecture is defined in [ln-acme Project Architecture](#ln-acme-project-architecture-mandatory). This section covers technical details only.

### Implementation in Component

```javascript
// In _bindEvents — listen for request events on self
this.dom.addEventListener('ln-profile:request-create', function (e) {
    self.create(e.detail.name);  // calls the same prototype method
});
this.dom.addEventListener('ln-profile:request-remove', function (e) {
    self.remove(e.detail.id);
});
```

### Dispatching from Coordinator

```javascript
// Coordinator — dispatches request event (NOT direct API call)
nav.dispatchEvent(new CustomEvent('ln-profile:request-create', {
    detail: { name: 'My Profile' }
}));
```

### Naming

| Type | Format | Example | Bubbles |
|-----|--------|--------|---------|
| Request (incoming) | `ln-{name}:request-{action}` | `ln-profile:request-create` | `false` |
| Notification (outgoing) | `ln-{name}:{past-tense}` | `ln-profile:created` | `true` |
| Lifecycle before | `ln-{name}:before-{action}` | `ln-toggle:before-open` | `true`, cancelable |
| Lifecycle after | `ln-{name}:{action}` | `ln-toggle:open` | `true` |

### Commands vs Queries

| Type | Mechanism | Example |
|-----|-----------|--------|
| **Command** (changes state) | request event | `nav.dispatchEvent(new CustomEvent('ln-profile:request-remove', { detail: { id } }))` |
| **Query** (reads state) | direct access | `nav.lnProfile.currentId`, `sidebar.lnPlaylist.getTrack(idx)` |

---

## Coordinator — Full Example

> The coordinator is a thin IIFE, project-specific. No own state, no own DOM. Just wiring.

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
                const nav = _getNav();
                if (nav && nav.lnProfile) {
                    nav.dispatchEvent(new CustomEvent('ln-profile:request-remove', {
                        detail: { id: nav.lnProfile.currentId }  // query is OK
                    }));
                }
            }
        });

        // 2. Form submit → request event
        document.addEventListener('ln-form:submit', function (e) {
            if (e.target.getAttribute('data-ln-form') !== 'new-profile') return;
            const input = document.querySelector('[data-ln-field="new-profile-name"]');
            const name = input ? input.value.trim() : '';
            if (!name) return;

            const nav = _getNav();
            if (nav) {
                nav.dispatchEvent(new CustomEvent('ln-profile:request-create', {
                    detail: { name: name }
                }));
            }
            input.value = '';
            document.getElementById('modal-new-profile').lnModal.close();
        });

        // 3. Notification → UI feedback
        document.addEventListener('ln-profile:created', function () {
            window.dispatchEvent(new CustomEvent('ln-toast:enqueue', {
                detail: { type: 'success', message: 'Profile created' }
            }));
        });

        // 4. Bridge: component A event → component B attribute
        document.addEventListener('ln-profile:switched', function (e) {
            const sidebar = _getSidebar();
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

**The four jobs of a coordinator:**
1. **UI trigger → request event** — click/submit → dispatch request to component
2. **Form processing** — read input, validate, clear, close modal
3. **Notification → UI feedback** — toast, modal close, highlight
4. **Bridge** — event from component A → attribute/request on component B

---

## Template System — DOM Structure in HTML, Not in JS

**NEVER** build DOM structure with `createElement` chains in JS. Use the native HTML `<template>` element.

### Principle

DOM structure is an **HTML decision**, not a JS decision. The component only fills in the data.

### Zero Display Text in JS (mandatory)

JS components **NEVER** contain hardcoded strings intended for user display — no labels, messages, button text, status text, relative time words, or any translatable content. All display text lives in HTML templates where the server (Blade, backend) can translate it.

```
WRONG:  el.textContent = 'No results found';
WRONG:  el.textContent = '3 minutes ago';
WRONG:  const label = count === 1 ? 'item' : 'items';

RIGHT:  text comes from <template> → cloneTemplate → fill
RIGHT:  text comes from hidden dict elements → buildDict (error messages, labels)
RIGHT:  text comes from data-ln-* attribute set by server
RIGHT:  text comes from Intl API (dates, numbers — browser-native i18n)
```

**Intl APIs are the exception** — `Intl.DateTimeFormat`, `Intl.NumberFormat`, `Intl.RelativeTimeFormat` produce locale-aware output from the browser's own translations. These are acceptable because the browser handles i18n, not the component.

If a component needs display text that Intl can't provide, the text must come from HTML (template or data attribute) so the server can translate it.

```
HTML:  <template> defines structures (inert, not rendered)
HTML:  <span data-{component}-dict="key" hidden> defines translatable strings
JS:    clone → fill (structures) / buildDict (strings)
```

### Dictionary pattern (i18n strings)

For error messages, labels, and other translatable strings that aren't part of a template structure, use `buildDict` from ln-core:

```html
<!-- Hidden dict elements — server translates, JS reads once at init -->
<span data-ln-upload-dict="remove" hidden>{{ __('Remove') }}</span>
<span data-ln-upload-dict="error" hidden>{{ __('Error') }}</span>
<span data-ln-upload-dict="invalid-type" hidden>{{ __('This file type is not allowed') }}</span>
```

```js
import { buildDict } from '../ln-core';

// Init — reads all elements, builds object, removes from DOM
const dict = buildDict(container, 'data-ln-upload-dict');

// Usage — O(1) property access
dict['remove']        // 'Remove'
dict['invalid-type']  // 'This file type is not allowed'
```

**Convention:** `data-{component}-dict="key"` on hidden `<span>` elements inside the component root. Attribute name matches the component's naming pattern.

### HTML — define templates at the end of `<body>`, before `<script>` tags

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

### JS — `cloneTemplate` + `fill` from ln-core

```javascript
import { cloneTemplate, fill } from '../ln-core';
```

`cloneTemplate(name, componentTag)` caches the lookup and returns `tmpl.content.cloneNode(true)`.

### Usage — clone + fill (declarative)

Use `data-ln-field` for text, `data-ln-attr` for attributes:

```html
<template data-ln-template="track-item">
    <li data-ln-track>
        <span class="track-number" data-ln-field="number"></span>
        <article class="track-info">
            <p data-ln-field="title"></p>
            <p data-ln-field="artist"></p>
        </article>
    </li>
</template>
```

```javascript
_component.prototype._buildTrackItem = function (track, idx) {
    const frag = cloneTemplate('track-item', 'ln-playlist');
    const li = frag.querySelector('[data-ln-track]');
    fill(li, { number: idx + 1, title: track.title, artist: track.artist });
    return li;
};
```

### Rules

1. **`<template data-ln-template="name">`** — naming convention
2. **Placement:** at the end of `<body>`, before `<script>` tags, in a `TEMPLATES` comment block
3. **`content.cloneNode(true)`** returns a DocumentFragment — query the root element with `querySelector`
4. **JS only fills:** `textContent`, `setAttribute`, `classList` — does NOT create structure
5. **Conditions:** small conditional elements (1-2 spans for indicators) are OK as `createElement`
6. **One template, one function:** if the same structure is created in 2+ places, it must be a `<template>` + shared function

### Why

| createElement chains | `<template>` |
|---------------------|--------------|
| 60+ lines of JS for one `<li>` | 10 lines HTML + 8 lines JS |
| Structure hidden in JS | Structure visible in HTML |
| Duplication between methods | One definition, one function |
| Hard for designers | HTML — easy to change |

---

## Components (reference)

| Component | Pattern | Data Attr | Description |
|-----------|---------|-----------|------|
| ln-core | Shared module | — | dispatch, fill, renderList, reactiveState, deepReactive, createBatcher |
| ln-toggle | Instance | `data-ln-toggle` | Generic toggle (sidebar, collapse) |
| ln-accordion | Instance | `data-ln-accordion` | Wrapper — only one toggle open at a time |
| ln-tabs | Instance | `data-ln-tabs` | Hash-aware tab navigation |
| ln-nav | Instance | `data-ln-nav` | Active link highlighter |
| ln-modal | Instance | `data-ln-modal` | Modal dialog |
| ln-toast | Functional | `data-ln-toast` | Toast notifications |
| ln-upload | Functional | `data-ln-upload` | File upload |
| ln-ajax | Functional | `data-ln-ajax` | AJAX navigation |
| ln-progress | Functional | `data-ln-progress` | Progress bar |
| ln-circular-progress | Instance | `data-ln-circular-progress` | Circular (ring) progress indicator |
| ln-select | Wrapper | `data-ln-select` | TomSelect wrapper |
| ln-search | Instance | `data-ln-search` | Generic search (textContent filter) |
| ln-filter | Instance | `data-ln-filter` | Generic filter (data attribute filter) |
| ln-table | Instance | `data-ln-table` | Data table (search, filter, sort, virtual scroll) |
| ln-table-sort | Instance | `data-ln-sort` | Sort header handler (companion to ln-table) |
| ln-sortable | Instance | `data-ln-sortable` | Drag & drop reorder |
| ln-dropdown | Instance | `data-ln-dropdown` | Positioned dropdown menu (wraps ln-toggle) |
| ln-link | Instance | `data-ln-link` | Clickable rows/containers |
| ln-confirm | Instance | `data-ln-confirm` | Two-click confirmation for destructive actions |
| ln-autosave | Instance | `data-ln-autosave` | Auto-save form to localStorage on blur/change |
| ln-autoresize | Instance | `data-ln-autoresize` | Auto-resize textarea height |
| ln-translations | Instance | `data-ln-translations` | Multi-language form field management |
| ln-external-links | Utility | — | External links handler |
| ln-http | Global service | — | Event-driven JSON fetch with abort support |

---

> For the latest component skeleton and checklist →
> see [docs/js/component-guide.md](../docs/js/component-guide.md)
