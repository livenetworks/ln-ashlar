# Reactive Architecture Reference

How ln-ashlar components manage internal state and drive DOM updates. Covers the four primitives exported from `ln-core` (`fill`, `renderList`, `reactiveState`, `deepReactive`) and the `createBatcher` scheduler.

For the high-level pattern summary, see [js/COMPONENTS.md — Reactive Rendering Pattern](../js/COMPONENTS.md).

---

## Two-Layer State Model

Every ln-ashlar component has two state layers that serve different purposes. They are not alternatives — they work together.

### External State — Attributes

Coordinators control components from outside via `setAttribute`. The component observes the change via `MutationObserver` and reacts.

```
coordinator.setAttribute('data-ln-profile-mode', 'edit')
    → MutationObserver fires
    → Component reacts to new attribute value
```

State is visible in the DOM inspector. Any code can read or set it. This is the intentional interface between the outside world and a component.

**Use for:** mode switches (`view`/`edit`), open/closed, loading state, active tab ID — any externally controlled flag.

### Internal State — Proxy

Complex data (objects, arrays, derived values) lives inside the component as a Proxy. State changes automatically schedule a render.

```
this.state.users.push(newUser)
    → Proxy set trap fires
    → queueMicrotask schedules _render()
    → fill() + renderList() update DOM
    → Component emits change event
```

Internal state is not visible in the DOM. It is not part of the coordinator interface.

**Use for:** record lists, form data, computed flags, pagination state — anything too complex for an attribute.

### How they connect

An attribute change bridges into internal state via the `MutationObserver` callback:

```
coordinator.setAttribute('data-ln-profile-mode', 'edit')
    ↓
MutationObserver: type=attributes, name='data-ln-profile-mode'
    ↓
this.state.mode = 'edit'    ← Proxy set trap
    ↓
createBatcher schedules _render()
    ↓
fill() updates DOM
    ↓
dispatch('ln-profile:changed', { mode: 'edit' })
```

The attribute is the interface. The Proxy is the internal engine.

---

## `fill(root, data)` — Declarative DOM Binding

`fill` reads four data attributes from the subtree of `root` and applies values from `data`. Eliminates manual `querySelector` + assignment chains.

```javascript
import { fill } from '../ln-core';

fill(containerEl, {
    name: 'Dalibor',
    email: 'dalibor@example.com',
    avatar: '/img/dalibor.jpg',
    isAdmin: true,
    isBanned: false
});
```

### Bindings

**`data-ln-field="prop"` → `textContent`**

```html
<h3 data-ln-field="name"></h3>
<p data-ln-field="email"></p>
```

Sets `el.textContent = data[prop]`. Skips if `data[prop]` is `null` or `undefined`.

---

**`data-ln-attr="attr:prop, attr:prop"` → `setAttribute`**

```html
<img data-ln-attr="src:avatar, alt:name">
<a data-ln-attr="href:url">Link</a>
```

Each comma-separated pair maps one attribute to one data property. Skips if `data[prop]` is `null` or `undefined`.

---

**`data-ln-show="prop"` → `classList.toggle('hidden', !value)`**

```html
<span data-ln-show="isAdmin">Admin</span>
<div data-ln-show="hasError">...</div>
```

Passes `!data[prop]` to `classList.toggle('hidden', ...)`. A truthy value shows the element; falsy hides it. Skips if `prop` is not in `data`.

---

**`data-ln-class="cls:prop, cls:prop"` → `classList.toggle(cls, !!value)`**

```html
<li data-ln-class="active:isSelected, disabled:isLocked">
```

Toggles each class based on the truthiness of its bound property. Skips if `prop` is not in `data`.

---

### Rules

- **Idempotent** — call again with new data, DOM updates in place
- **Non-destructive** — skips keys where value is `null` / `undefined`; does not erase existing content
- **No form values** — `fill` sets `textContent`, not `.value`. For `<input>`, `<textarea>`, `<select>`, set `.value` manually after `fill()`
- **Scoped** — only queries within `root`, not the full document

---

## `renderList(container, items, tpl, keyFn, fillFn, tag)` — Keyed List Rendering

Renders a list with DOM reuse. Existing elements are updated in place; their DOM nodes and event listeners survive. Only genuinely new items are cloned from the template.

```javascript
import { renderList, fill } from '../ln-core';

renderList(
    this.dom.querySelector('[data-ln-list="users"]'),
    this.state.users,
    'user-item',                          // <template data-ln-template="user-item">
    function (user) { return user.id; },  // key function — must return unique string/number
    function (el, user, idx) {
        fill(el, {
            name: user.name,
            email: user.email,
            isAdmin: user.role === 'admin'
        });
    },
    'ln-user-list'                        // optional — componentTag for template-not-found warning
);
```

### How it works

1. Index all current children by their `data-ln-key` attribute
2. For each item in `items`:
   - If a node with matching key exists → call `fillFn(existingEl, item, i)` — node reused
   - If not → clone template, set `data-ln-key`, call `fillFn(newEl, item, i)`
3. Atomic replace: `container.textContent = ''` then `container.appendChild(fragment)` — one reflow
4. Orphaned nodes (keys no longer in `items`) are discarded

### Performance

| Scenario | Result |
|----------|--------|
| 200 items, 1 value changes | 200 nodes reused, 0 clones, 1 reflow |
| 200 items, 5 new records added | 195 nodes reused, 5 clones, 1 reflow |
| List cleared | `container.textContent = ''`, no iteration |

### Requirements

- Each item must have a stable unique key (typically `id`)
- The template name is `{value}` matching `<template data-ln-template="{value}">`
- `fillFn` signature: `(el, item, index)` — `el` is the cloned/reused root element

---

## Reactive State

### `reactiveState(initial, onChange)` — Shallow Proxy

A Proxy over a flat object. Calls `onChange(prop, value, old)` on every top-level property set, but only if the value actually changed.

```javascript
import { reactiveState } from '../ln-core';

this.state = reactiveState({
    name: '',
    mode: 'view',
    count: 0
}, function (prop, value, old) {
    scheduleRender();
});
```

Use when the state is a flat object with primitive values (strings, numbers, booleans). This covers most ln-ashlar library components.

Setting the same value twice does not call `onChange` (strict equality check before dispatch).

### `deepReactive(obj, onChange)` — Deep Proxy

Wraps an object recursively. Calls `onChange()` (no arguments) on any nested change — including array mutations (`push`, `splice`, index assignment) and nested object property sets.

```javascript
import { deepReactive } from '../ln-core';

this.state = deepReactive({
    users: [],
    selectedId: null
}, scheduleRender);

// All of these trigger onChange():
this.state.users.push({ id: 4, name: 'New' });
this.state.users[2].name = 'Updated';
this.state.users.splice(1, 1);
this.state.selectedId = 3;
```

Use when state contains arrays or nested objects that are mutated in place.

### When to use which

| | `reactiveState` | `deepReactive` |
|---|---|---|
| **Depth** | Top-level sets only | Any nested change |
| **onChange args** | `(prop, value, old)` | `()` — no args |
| **Use when** | Flat state, primitives | Arrays or nested objects |
| **Typical usage** | UI state, flags, scalar fields | Record lists, nested data |

---

## `createBatcher(renderFn, afterRender)` — Render Scheduler

Returns a `schedule()` function. The first call to `schedule()` enqueues `renderFn` via `queueMicrotask`. Subsequent calls within the same synchronous block are no-ops. After `renderFn` runs, `afterRender` is called (if provided).

```javascript
import { reactiveState, createBatcher } from '../ln-core';

const self = this;

const scheduleRender = createBatcher(
    function () { self._render(); },
    function () { self._afterRender(); }  // fires after render — dispatch events here
);

this.state = reactiveState({ key: null, count: 0 }, scheduleRender);
```

### Why batching matters

Without batching, multiple synchronous state mutations trigger multiple renders:

```javascript
this.state.name = 'Dalibor';   // onChange → _render()
this.state.email = 'a@b.com';  // onChange → _render()
this.state.mode = 'edit';      // onChange → _render()
// 3 renders for one logical operation
```

With `createBatcher`:

```javascript
this.state.name = 'Dalibor';   // onChange → schedule()  → queued
this.state.email = 'a@b.com';  // onChange → schedule()  → already queued, no-op
this.state.mode = 'edit';      // onChange → schedule()  → already queued, no-op
// --- microtask checkpoint ---
// _render() fires once with final state
```

This is the same mechanism as Vue 3's `nextTick`, using the native `queueMicrotask` API.

### The trinity

`reactiveState` + `createBatcher` + `fill` work as a unit:

```javascript
import { reactiveState, createBatcher, fill, dispatch } from '../ln-core';

function _component(dom) {
    this.dom = dom;
    const self = this;

    const scheduleRender = createBatcher(
        function () { self._render(); },
        function () {
            dispatch(self.dom, 'ln-example:changed', {
                value: self.state.value
            });
        }
    );

    this.state = reactiveState({
        label: '',
        value: null,
        isActive: false
    }, scheduleRender);
}

_component.prototype._render = function () {
    fill(this.dom, this.state);
};
```

Any change to `this.state` automatically schedules one render. The event fires after the DOM is updated.

---

## Attribute ↔ State Bridge

When a coordinator sets an attribute, the `MutationObserver` callback routes it into internal state. This is the standard bridge pattern.

```javascript
// Inside _domObserver() MutationObserver callback
} else if (mutation.type === 'attributes') {
    const el = mutation.target;
    if (el[DOM_ATTRIBUTE]) {
        el[DOM_ATTRIBUTE]._onAttr(
            mutation.attributeName,
            el.getAttribute(mutation.attributeName)
        );
    }
}
```

```javascript
_component.prototype._onAttr = function (name, value) {
    // data-ln-profile-mode="edit" → this.state.mode = 'edit'
    if (name === DOM_SELECTOR + '-mode') {
        this.state.mode = value;    // Proxy → scheduleRender()
    }
};
```

The attribute is the external interface. The Proxy is the internal reaction engine. Attribute changes always go through state — the component does not apply DOM changes directly in `_onAttr`.

---

## Data Attributes Reference

| Attribute | Location | Read by | Effect |
|-----------|----------|---------|--------|
| `data-ln-field="prop"` | template / live DOM | `fill` | `el.textContent = data[prop]` |
| `data-ln-attr="attr:prop, ..."` | template / live DOM | `fill` | `el.setAttribute(attr, data[prop])` |
| `data-ln-show="prop"` | template / live DOM | `fill` | `classList.toggle('hidden', !data[prop])` |
| `data-ln-class="cls:prop, ..."` | template / live DOM | `fill` | `classList.toggle(cls, !!data[prop])` |
| `data-ln-key="id"` | rendered list item | `renderList` | keyed DOM node reuse |

Existing component attributes (`data-ln-modal`, `data-ln-tabs`, etc.) are not part of this layer.

---

## Complete Example

```javascript
import {
    dispatch, findElements, guardBody,
    deepReactive, createBatcher,
    fill, renderList
} from '../ln-core';

(function () {
    const DOM_SELECTOR = 'data-ln-user-list';
    const DOM_ATTRIBUTE = 'lnUserList';
    if (window[DOM_ATTRIBUTE] !== undefined) return;

    function _component(dom) {
        this.dom = dom;
        const self = this;

        const scheduleRender = createBatcher(
            function () { self._render(); },
            function () {
                dispatch(self.dom, 'ln-user-list:changed', {
                    count: self.state.users.length
                });
            }
        );

        this.state = deepReactive({
            users: [],
            selectedId: null
        }, scheduleRender);

        this._bindEvents();
        this._render();
        return this;
    }

    _component.prototype._bindEvents = function () {
        const self = this;
        this.dom.addEventListener('ln-user-list:request-load', function (e) {
            self.state.users = e.detail.users || [];
        });
        this.dom.addEventListener('ln-user-list:request-select', function (e) {
            self.state.selectedId = e.detail.id;
        });
        this.dom.addEventListener('ln-user-list:request-add', function (e) {
            self.state.users.push(e.detail.user);
        });
        this.dom.addEventListener('ln-user-list:request-remove', function (e) {
            const idx = self.state.users.findIndex(function (u) { return u.id === e.detail.id; });
            if (idx !== -1) self.state.users.splice(idx, 1);
        });
    };

    _component.prototype._render = function () {
        const self = this;

        renderList(
            this.dom.querySelector('[data-ln-list="users"]'),
            this.state.users,
            'user-item',
            function (u) { return u.id; },
            function (el, user) {
                fill(el, {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isAdmin: user.role === 'admin',
                    isSelected: user.id === self.state.selectedId
                });
            },
            DOM_SELECTOR
        );

        fill(this.dom, {
            'user-count': this.state.users.length,
            'has-users': this.state.users.length > 0
        });
    };

    _component.prototype.destroy = function () {
        delete this.dom[DOM_ATTRIBUTE];
    };

    function _domObserver() {
        guardBody(function () {
            const observer = new MutationObserver(function (mutations) {
                for (let i = 0; i < mutations.length; i++) {
                    const m = mutations[i];
                    if (m.type === 'childList') {
                        for (let j = 0; j < m.addedNodes.length; j++) {
                            if (m.addedNodes[j].nodeType === 1) {
                                findElements(m.addedNodes[j], DOM_SELECTOR, DOM_ATTRIBUTE, _component);
                            }
                        }
                    } else if (m.type === 'attributes') {
                        findElements(m.target, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
                    }
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: [DOM_SELECTOR]
            });
            findElements(document.body, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
        }, DOM_SELECTOR);
    }

    // Manual init API — window.lnUserList(someRoot)
    // Auto-init on document.body is handled inside _domObserver via guardBody
    function constructor(domRoot) {
        findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _component);
    }

    window[DOM_ATTRIBUTE] = constructor;
    _domObserver();
})();
```

```html
<template data-ln-template="user-item">
    <li>
        <img data-ln-attr="src:avatar, alt:name">
        <p data-ln-field="name"></p>
        <p data-ln-field="email"></p>
        <p data-ln-field="role"></p>
        <span data-ln-show="isAdmin">Admin</span>
    </li>
</template>

<section data-ln-user-list>
    <ul data-ln-list="users"></ul>
    <p data-ln-show="has-users">
        <span data-ln-field="user-count"></span> users
    </p>
</section>
```
