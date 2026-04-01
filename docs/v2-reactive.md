# ln-acme v2 — Architecture Improvement Proposal

## 1. Визија

ln-acme веќе докажа дека vanilla JS + zero dependencies + IIFE + CustomEvent е production-ready архитектура. 20+ компоненти го потврдуваат тоа.

Целта не е да го претвориме во framework — туку да ги елиминираме повторувачките patterns кои секој component рачно ги пишува, и да воведеме **internal reactivity** каде што тоа има смисла.

Две нови примитиви:
- **Proxy** (ES6 native) — internal state reactivity
- **`_fill` + `_renderList`** — declarative DOM rendering

Постоечките примитиви остануваат:
- **Attributes** — external state control (coordinator → component)
- **MutationObserver** — attribute change detection
- **CustomEvent** — component communication
- **`<template>` + `cloneNode`** — DOM structure

---

## 2. Двослоен State Model

### External State = Attributes (постоечки)

```
Coordinator → setAttribute('data-ln-profile-mode', 'edit')
    → MutationObserver fires
    → Component reacts
```

Coordinator-от контролира компоненти **отвор** преку атрибути.
State е видлив во DOM Inspector. Кој било код може да го чита и менува.
Ова е уникатната предност на ln-acme — state не е заклучен во JS closure.

**Use cases:** mode (view/edit), open/closed, active tab ID, loading state.

### Internal State = Proxy (ново)

```
Component internally: this.state.name = 'Dalibor'
    → Proxy set trap fires
    → this._render() called automatically
    → _fill + _renderList update DOM
    → CustomEvent emitted
```

Complex data (objects, arrays, nested structures) живее во JS — не во атрибути.
Proxy е **native browser API** (ES6), не dependency.

**Use cases:** user list, form data, track collection, permissions array.

### Конекција меѓу двата слоја

```
[Coordinator] setAttribute('data-ln-profile-mode', 'edit')
        ↓
[MutationObserver] detects attribute change
        ↓
[Component._onAttr] this.state.mode = 'edit'   ← internal state update
        ↓
[Proxy set trap] auto-calls this._render()
        ↓
[_fill + _renderList] targeted DOM updates
        ↓
[CustomEvent] ln-profile:changed bubbles up
```

Attributes = interface кон надвор. Proxy = internal engine. Не се заменуваат — се надополнуваат.

---

## 3. Rendering Helpers

### 3.1 `_fill(root, data)` — Declarative DOM Binding

Елиминира querySelector chains. Чита `data-ln-field`, `data-ln-attr`, `data-ln-show`, `data-ln-class` од DOM-от и ги применува податоците.

**HTML (во `<template>` или во live DOM):**

```html
<article data-ln-profile>
	<h3 data-ln-field="name"></h3>
	<p data-ln-field="email"></p>
	<img data-ln-attr="src:avatar, alt:name">
	<span data-ln-show="isAdmin">Admin</span>
	<span data-ln-class="active:isOnline, suspended:isBanned"></span>
</article>
```

**Имплементација:**

```javascript
function _fill(root, data) {
	// Text content: data-ln-field="propName" → textContent
	const fields = root.querySelectorAll('[data-ln-field]');
	for (const el of fields) {
		const key = el.getAttribute('data-ln-field');
		if (key in data) {
			const val = data[key];
			// Support formatted values: { value: '42', html: false }
			if (val !== null && val !== undefined) {
				el.textContent = val;
			}
		}
	}

	// Attributes: data-ln-attr="href:url, src:image" → setAttribute
	const attrEls = root.querySelectorAll('[data-ln-attr]');
	for (const el of attrEls) {
		const pairs = el.getAttribute('data-ln-attr').split(',');
		for (const pair of pairs) {
			const [attr, prop] = pair.trim().split(':').map(function (s) { return s.trim(); });
			if (prop && prop in data && data[prop] !== null && data[prop] !== undefined) {
				el.setAttribute(attr, data[prop]);
			}
		}
	}

	// Visibility: data-ln-show="propName" → toggle .hidden
	const showEls = root.querySelectorAll('[data-ln-show]');
	for (const el of showEls) {
		const key = el.getAttribute('data-ln-show');
		if (key in data) {
			el.classList.toggle('hidden', !data[key]);
		}
	}

	// CSS class: data-ln-class="className:propName" → classList.toggle
	const classEls = root.querySelectorAll('[data-ln-class]');
	for (const el of classEls) {
		const pairs = el.getAttribute('data-ln-class').split(',');
		for (const pair of pairs) {
			const [cls, prop] = pair.trim().split(':').map(function (s) { return s.trim(); });
			if (prop && prop in data) {
				el.classList.toggle(cls, !!data[prop]);
			}
		}
	}

	return root;
}
```

**Правила:**
- `_fill` е **idempotent** — повикај повторно со нови data, DOM се ажурира
- `_fill` е **IIFE-scoped** — секој component го добива (copy, не shared global)
- `_fill` **не создава** DOM — само пополнува постоечки елементи
- `null` / `undefined` вредности се прескокнуваат (не го бришат постоечкиот content)

### 3.2 `_renderList(container, items, templateName, keyFn, fillFn)` — Keyed List Rendering

Ефикасен list render: нови items се clone-ираат од template, постоечки се реупотребуваат (DOM node + event listeners преживуваат), избришани се cleanup-ираат.

```javascript
function _renderList(container, items, templateName, keyFn, fillFn) {
	const keyAttr = 'data-ln-key';

	// Index existing children by key
	const existing = new Map();
	for (const child of container.children) {
		const key = child.getAttribute(keyAttr);
		if (key) existing.set(key, child);
	}

	const fragment = document.createDocumentFragment();
	const seen = new Set();

	for (let i = 0; i < items.length; i++) {
		const item = items[i];
		const key = String(keyFn(item));
		seen.add(key);

		if (existing.has(key)) {
			// Reuse — update content, preserve DOM node + listeners
			const el = existing.get(key);
			fillFn(el, item, i);
			fragment.appendChild(el);
		} else {
			// New — clone template, fill, mark with key
			const tmpl = _cloneTemplate(templateName);
			if (!tmpl) continue;
			const el = tmpl.firstElementChild || tmpl;
			el.setAttribute(keyAttr, key);
			fillFn(el, item, i);
			fragment.appendChild(el);
		}
	}

	// Destroy removed items
	for (const [key, el] of existing) {
		if (!seen.has(key)) {
			if (el[DOM_ATTRIBUTE] && el[DOM_ATTRIBUTE].destroy) {
				el[DOM_ATTRIBUTE].destroy();
			}
		}
	}

	// Atomic DOM update — one reflow
	container.textContent = '';
	container.appendChild(fragment);
}
```

**Performance:**
- 200 items, 1 промена → 199 DOM nodes reused, 0 нови clones, 1 textContent update
- 200 items, 5 нови → 200 DOM nodes reused, 5 нови clones, 1 reflow
- Atomic replace: `container.textContent = '' + appendChild(fragment)` е побрз од item-by-item manipulation

**Употреба:**

```javascript
_component.prototype._render = function () {
	const self = this;

	// List rendering
	_renderList(
		this.dom.querySelector('[data-ln-list="users"]'),
		this.state.users,
		'user-item',
		function (u) { return u.id; },
		function (el, user, idx) {
			_fill(el, {
				name: user.name,
				email: user.email,
				role: user.role,
				avatar: user.avatar,
				isAdmin: user.role === 'admin',
				isSelected: user.id === self.state.selectedId
			});
		}
	);

	// Scalar bindings on the container
	_fill(this.dom, {
		'total-count': this.state.users.length,
		'has-users': this.state.users.length > 0
	});
};
```

### 3.3 `_dispatch` / `_dispatchCancelable` — Стандардизиран Event Helper

```javascript
function _dispatch(element, eventName, detail) {
	element.dispatchEvent(new CustomEvent(eventName, {
		bubbles: true,
		detail: detail || {}
	}));
}

function _dispatchCancelable(element, eventName, detail) {
	const event = new CustomEvent(eventName, {
		bubbles: true,
		cancelable: true,
		detail: detail || {}
	});
	element.dispatchEvent(event);
	return event;
}
```

---

## 4. Reactive State (Proxy)

### 4.1 Shallow Proxy — За повеќето components

Повеќето components имаат flat state — нема длабоко вгнездени objects.

```javascript
function _reactiveState(initial, onChange) {
	return new Proxy(initial, {
		set: function (target, prop, value) {
			const old = target[prop];
			target[prop] = value;
			if (old !== value) {
				onChange(prop, value, old);
			}
			return true;
		}
	});
}
```

**Употреба во component constructor:**

```javascript
function _component(dom) {
	this.dom = dom;
	const self = this;

	this.state = _reactiveState({
		name: '',
		email: '',
		mode: 'view',
		selectedId: null
	}, function (prop, value, old) {
		// Auto-render on any state change
		self._render();
		// Emit change event
		_dispatch(self.dom, 'ln-profile:changed', {
			prop: prop, value: value, previous: old
		});
	});

	this._bindEvents();
	this._render();
	return this;
}
```

**Сега state промената е автоматска:**

```javascript
// Request listener — just change state, DOM updates automatically
this.dom.addEventListener('ln-profile:request-update', function (e) {
	// Before-event (cancelable)
	const before = _dispatchCancelable(self.dom, 'ln-profile:before-update', e.detail);
	if (before.defaultPrevented) return;

	// State change → Proxy → _render() → DOM updated → event
	self.state.name = e.detail.name;
	self.state.email = e.detail.email;
});
```

### 4.2 Deep Proxy — За components со nested data (arrays, objects)

Кога `state.users` е array, и сакаш `state.users.push(newUser)` да тригерира render:

```javascript
function _deepReactive(obj, onChange) {
	if (obj === null || typeof obj !== 'object') return obj;

	// Wrap arrays — intercept mutating methods
	if (Array.isArray(obj)) {
		const proxy = new Proxy(obj, {
			set: function (target, prop, value) {
				target[prop] = (typeof value === 'object' && value !== null)
					? _deepReactive(value, onChange)
					: value;
				// 'length' changes after push/splice — use as render trigger
				if (prop !== 'length') onChange();
				return true;
			},
			get: function (target, prop) {
				return target[prop];
			}
		});
		// Wrap existing items
		for (let i = 0; i < obj.length; i++) {
			if (typeof obj[i] === 'object' && obj[i] !== null) {
				obj[i] = _deepReactive(obj[i], onChange);
			}
		}
		return proxy;
	}

	// Wrap objects
	for (const key in obj) {
		if (typeof obj[key] === 'object' && obj[key] !== null) {
			obj[key] = _deepReactive(obj[key], onChange);
		}
	}

	return new Proxy(obj, {
		set: function (target, prop, value) {
			const old = target[prop];
			target[prop] = (typeof value === 'object' && value !== null)
				? _deepReactive(value, onChange)
				: value;
			if (old !== value) onChange();
			return true;
		}
	});
}
```

**Употреба:**

```javascript
function _component(dom) {
	this.dom = dom;
	const self = this;

	// Debounce render — multiple sync changes = one render
	let _renderQueued = false;
	function _queueRender() {
		if (_renderQueued) return;
		_renderQueued = true;
		queueMicrotask(function () {
			_renderQueued = false;
			self._render();
			_dispatch(self.dom, 'ln-user-list:changed', {});
		});
	}

	this.state = _deepReactive({
		users: [],
		selectedId: null,
		filter: '',
		mode: 'view'
	}, _queueRender);

	this._bindEvents();
	this._render();
	return this;
}
```

**Сега ова работи автоматски:**

```javascript
// Сите тригерираат _render() автоматски:
this.state.users.push({ id: 4, name: 'New User' });
this.state.users[2].name = 'Updated Name';
this.state.users.splice(1, 1);
this.state.selectedId = 3;
this.state.filter = 'admin';
```

### 4.3 `queueMicrotask` Batching

Критичен детал: без batching, `state.users.push(item)` тригерира два пати —
еднаш за новиот елемент (index set), еднаш за `length` промена.

`queueMicrotask` го решава ова:

```
state.users.push(a)     → onChange() → queueMicrotask(_render)  [queued]
state.users.push(b)     → onChange() → queueMicrotask(_render)  [already queued, skip]
state.selectedId = 5    → onChange() → queueMicrotask(_render)  [already queued, skip]
--- microtask checkpoint ---
_render() fires ONCE with final state
```

Ова е истиот механизам што Vue 3 го користи (`nextTick`), но со native API.

### 4.4 Кога Shallow vs Deep?

| Situation | Use |
|-----------|-----|
| Flat state (strings, numbers, booleans) | `_reactiveState` (shallow) |
| State со arrays или nested objects | `_deepReactive` (deep) |
| Global service (ln-http) | Ниеден — нема state |

Повеќето ln-acme library components (toggle, modal, tabs) → shallow.
Project components (user list, playlist, deck) → deep.

---

## 5. Attribute ↔ Proxy Bridge

Attribute changes (од coordinator) автоматски се sync-ираат со internal Proxy state:

```javascript
// Inside MutationObserver callback (attributes type)
_component.prototype._onAttr = function (attrName, newValue) {
	// Map attribute to state property
	// data-ln-profile-mode="edit" → this.state.mode = 'edit'
	const prefix = DOM_SELECTOR + '-';
	if (attrName.indexOf(prefix) === 0) {
		const prop = attrName.slice(prefix.length);  // 'mode'
		if (this.state[prop] !== newValue) {
			this.state[prop] = newValue;  // Proxy triggers _render()
		}
	}
};
```

**MutationObserver configuration:**

```javascript
function _domObserver() {
	const observer = new MutationObserver(function (mutations) {
		for (const mutation of mutations) {
			if (mutation.type === 'childList') {
				for (const node of mutation.addedNodes) {
					if (node.nodeType === 1) {
						_findElements(node);
						_attachTriggers(node);
					}
				}
			} else if (mutation.type === 'attributes') {
				const el = mutation.target;
				if (el[DOM_ATTRIBUTE] && el[DOM_ATTRIBUTE]._onAttr) {
					el[DOM_ATTRIBUTE]._onAttr(
						mutation.attributeName,
						el.getAttribute(mutation.attributeName)
					);
				} else {
					_findElements(el);
				}
			}
		}
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true,
		attributes: true,
		attributeFilter: [
			DOM_SELECTOR,
			DOM_SELECTOR + '-mode',
			DOM_SELECTOR + '-for'
			// ... додај ги сите state attributes за овој component
		]
	});
}
```

**Flow:**

```
Coordinator: profileEl.setAttribute('data-ln-profile-mode', 'edit')
    ↓
MutationObserver: type=attributes, attributeName='data-ln-profile-mode'
    ↓
_onAttr('data-ln-profile-mode', 'edit')
    ↓
this.state.mode = 'edit'    ← Proxy set trap
    ↓
_queueRender() → _render() → _fill() updates DOM
    ↓
_dispatch('ln-profile:changed', { prop: 'mode', value: 'edit' })
```

---

## 6. Form Binding — `ln-form-bind`

Global service (како `ln-http`) за form ↔ state sync.

```javascript
(function () {
	const DOM_ATTRIBUTE = 'lnFormBind';
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	function _dispatch(element, eventName, detail) {
		element.dispatchEvent(new CustomEvent(eventName, {
			bubbles: true, detail: detail || {}
		}));
	}

	// Populate form inputs from data object
	function _populate(form, data) {
		const inputs = form.querySelectorAll('[data-ln-form-bind]');
		for (const input of inputs) {
			const key = input.getAttribute('data-ln-form-bind');
			if (!(key in data)) continue;

			const val = data[key];
			if (input.type === 'checkbox') {
				input.checked = !!val;
			} else if (input.type === 'radio') {
				input.checked = (input.value === String(val));
			} else {
				input.value = (val !== null && val !== undefined) ? val : '';
			}
		}
	}

	// Collect form inputs into data object
	function _collect(form) {
		const result = {};
		const inputs = form.querySelectorAll('[data-ln-form-bind]');
		for (const input of inputs) {
			const key = input.getAttribute('data-ln-form-bind');
			if (input.type === 'checkbox') {
				result[key] = input.checked;
			} else if (input.type === 'radio') {
				if (input.checked) result[key] = input.value;
			} else if (input.type === 'number') {
				result[key] = input.value !== '' ? Number(input.value) : null;
			} else {
				result[key] = input.value;
			}
		}
		return result;
	}

	// Request events
	document.addEventListener('ln-form-bind:request-populate', function (e) {
		if (!e.detail || !e.detail.data) return;
		_populate(e.target, e.detail.data);
	});

	document.addEventListener('ln-form-bind:request-collect', function (e) {
		const data = _collect(e.target);
		_dispatch(e.target, 'ln-form-bind:collected', { data: data });
	});

	window[DOM_ATTRIBUTE] = true;
})();
```

**HTML:**

```html
<form id="edit-user" data-ln-form-for="user-profile">
	<label>
		Name
		<input type="text" name="name" data-ln-form-bind="name">
	</label>
	<label>
		Email
		<input type="email" name="email" data-ln-form-bind="email">
	</label>
	<label>
		<input type="checkbox" data-ln-form-bind="isAdmin"> Administrator
	</label>
	<div class="form-actions">
		<button type="button" data-ln-action="cancel">Cancel</button>
		<button type="submit">Save</button>
	</div>
</form>
```

**Coordinator:**

```javascript
// Populate form from component state
const form = document.getElementById('edit-user');
const profile = document.querySelector('[data-ln-profile]');

form.dispatchEvent(new CustomEvent('ln-form-bind:request-populate', {
	detail: { data: { name: profile.lnProfile.state.name, email: profile.lnProfile.state.email } }
}));

// On submit — collect and forward to component
form.addEventListener('submit', function (e) {
	e.preventDefault();
	form.dispatchEvent(new CustomEvent('ln-form-bind:request-collect'));
});

form.addEventListener('ln-form-bind:collected', function (e) {
	profile.dispatchEvent(new CustomEvent('ln-profile:request-update', {
		detail: e.detail.data
	}));
});
```

---

## 7. Нови Data Attributes — Целосен Преглед

| Attribute | Location | Reader | Purpose |
|-----------|----------|--------|---------|
| `data-ln-field="prop"` | template / live DOM | `_fill` | textContent binding |
| `data-ln-attr="attr:prop, ..."` | template / live DOM | `_fill` | setAttribute binding |
| `data-ln-show="prop"` | template / live DOM | `_fill` | visibility (.hidden toggle) |
| `data-ln-class="cls:prop, ..."` | template / live DOM | `_fill` | classList.toggle |
| `data-ln-key="id"` | rendered list item | `_renderList` | keyed DOM reuse |
| `data-ln-list="name"` | container (`ul`, `tbody`) | convention | identifies list container |
| `data-ln-form-bind="prop"` | form input | `ln-form-bind` | form ↔ data sync |
| `data-ln-form-for="id"` | form | convention | links form to component |

Постоечки attributes (`data-ln-toggle`, `data-ln-modal`, etc.) — непроменети.

---

## 8. Целосен Component Пример — ПРЕД и ПОСЛЕ

### ПРЕД (денешен ln-acme)

```javascript
(function () {
	const DOM_SELECTOR = 'data-ln-user-list';
	const DOM_ATTRIBUTE = 'lnUserList';
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	const _tmplCache = {};
	function _cloneTemplate(name) {
		if (!_tmplCache[name]) {
			_tmplCache[name] = document.querySelector('[data-ln-template="' + name + '"]');
		}
		return _tmplCache[name] ? _tmplCache[name].content.cloneNode(true) : null;
	}

	function _component(dom) {
		this.dom = dom;
		this.users = [];
		this.selectedId = null;
		this._bindEvents();
		return this;
	}

	_component.prototype._bindEvents = function () {
		const self = this;
		this.dom.addEventListener('ln-user-list:request-load', function (e) {
			self.users = e.detail.users || [];
			self._renderList();
		});
		this.dom.addEventListener('ln-user-list:request-select', function (e) {
			self.selectedId = e.detail.id;
			self._renderList();
		});
		this.dom.addEventListener('ln-user-list:request-add', function (e) {
			self.users.push(e.detail.user);
			self._renderList();
		});
		this.dom.addEventListener('ln-user-list:request-remove', function (e) {
			self.users = self.users.filter(function (u) { return u.id !== e.detail.id; });
			self._renderList();
		});
	};

	_component.prototype._renderList = function () {
		const container = this.dom.querySelector('ul');
		container.innerHTML = '';

		for (let i = 0; i < this.users.length; i++) {
			const user = this.users[i];
			const frag = _cloneTemplate('user-item');
			if (!frag) return;
			const li = frag.querySelector('li');
			li.setAttribute('data-user-id', user.id);
			li.querySelector('.user-name').textContent = user.name;
			li.querySelector('.user-email').textContent = user.email;
			li.querySelector('.user-role').textContent = user.role;
			li.querySelector('img').setAttribute('src', user.avatar);
			li.querySelector('img').setAttribute('alt', user.name);
			if (user.isAdmin) {
				li.querySelector('.admin-badge').classList.remove('hidden');
			} else {
				li.querySelector('.admin-badge').classList.add('hidden');
			}
			if (user.id === this.selectedId) {
				li.classList.add('active');
			}
			container.appendChild(li);
		}

		this.dom.querySelector('.user-count').textContent = this.users.length;
		this.dom.querySelector('.empty-state').classList.toggle('hidden', this.users.length > 0);

		this.dom.dispatchEvent(new CustomEvent('ln-user-list:rendered', {
			bubbles: true, detail: { count: this.users.length }
		}));
	};

	// ... constructor, _findElements, _domObserver, auto-init (20+ lines boilerplate)

	function constructor(domRoot) { /* ... */ }
	function _findElements(root) { /* ... */ }
	function _domObserver() { /* ... */ }

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () { constructor(document.body); });
	} else {
		constructor(document.body);
	}
})();
```

```html
<template data-ln-template="user-item">
	<li>
		<img src="" alt="">
		<p class="user-name"></p>
		<p class="user-email"></p>
		<p class="user-role"></p>
		<span class="admin-badge hidden">Admin</span>
	</li>
</template>
```

### ПОСЛЕ (ln-acme v2)

```javascript
(function () {
	const DOM_SELECTOR = 'data-ln-user-list';
	const DOM_ATTRIBUTE = 'lnUserList';
	if (window[DOM_ATTRIBUTE] !== undefined) return;

	// --- Helpers (IIFE-scoped) ---

	function _dispatch(el, name, detail) {
		el.dispatchEvent(new CustomEvent(name, { bubbles: true, detail: detail || {} }));
	}
	function _dispatchCancelable(el, name, detail) {
		const ev = new CustomEvent(name, { bubbles: true, cancelable: true, detail: detail || {} });
		el.dispatchEvent(ev);
		return ev;
	}

	const _tmplCache = {};
	function _cloneTemplate(name) {
		if (!_tmplCache[name]) {
			_tmplCache[name] = document.querySelector('[data-ln-template="' + name + '"]');
		}
		if (!_tmplCache[name]) {
			console.warn('[ln-user-list] Template not found: ' + name);
			return null;
		}
		return _tmplCache[name].content.cloneNode(true);
	}

	function _fill(root, data) {
		const fields = root.querySelectorAll('[data-ln-field]');
		for (const el of fields) {
			const key = el.getAttribute('data-ln-field');
			if (key in data && data[key] !== null && data[key] !== undefined) {
				el.textContent = data[key];
			}
		}
		const attrEls = root.querySelectorAll('[data-ln-attr]');
		for (const el of attrEls) {
			for (const pair of el.getAttribute('data-ln-attr').split(',')) {
				const [attr, prop] = pair.trim().split(':').map(function (s) { return s.trim(); });
				if (prop in data && data[prop] !== null && data[prop] !== undefined) {
					el.setAttribute(attr, data[prop]);
				}
			}
		}
		const showEls = root.querySelectorAll('[data-ln-show]');
		for (const el of showEls) {
			const key = el.getAttribute('data-ln-show');
			if (key in data) el.classList.toggle('hidden', !data[key]);
		}
		const classEls = root.querySelectorAll('[data-ln-class]');
		for (const el of classEls) {
			for (const pair of el.getAttribute('data-ln-class').split(',')) {
				const [cls, prop] = pair.trim().split(':').map(function (s) { return s.trim(); });
				if (prop in data) el.classList.toggle(cls, !!data[prop]);
			}
		}
		return root;
	}

	function _renderList(container, items, tmplName, keyFn, fillFn) {
		const keyAttr = 'data-ln-key';
		const existing = new Map();
		for (const child of container.children) {
			const k = child.getAttribute(keyAttr);
			if (k) existing.set(k, child);
		}
		const fragment = document.createDocumentFragment();
		const seen = new Set();
		for (let i = 0; i < items.length; i++) {
			const key = String(keyFn(items[i]));
			seen.add(key);
			if (existing.has(key)) {
				const el = existing.get(key);
				fillFn(el, items[i], i);
				fragment.appendChild(el);
			} else {
				const tmpl = _cloneTemplate(tmplName);
				if (!tmpl) continue;
				const el = tmpl.firstElementChild || tmpl;
				el.setAttribute(keyAttr, key);
				fillFn(el, items[i], i);
				fragment.appendChild(el);
			}
		}
		container.textContent = '';
		container.appendChild(fragment);
	}

	function _deepReactive(obj, onChange) {
		if (obj === null || typeof obj !== 'object') return obj;
		if (Array.isArray(obj)) {
			for (let i = 0; i < obj.length; i++) {
				if (typeof obj[i] === 'object' && obj[i] !== null) {
					obj[i] = _deepReactive(obj[i], onChange);
				}
			}
			return new Proxy(obj, {
				set: function (t, p, v) {
					t[p] = (typeof v === 'object' && v !== null) ? _deepReactive(v, onChange) : v;
					if (p !== 'length') onChange();
					return true;
				}
			});
		}
		for (const k in obj) {
			if (typeof obj[k] === 'object' && obj[k] !== null) {
				obj[k] = _deepReactive(obj[k], onChange);
			}
		}
		return new Proxy(obj, {
			set: function (t, p, v) {
				t[p] = (typeof v === 'object' && v !== null) ? _deepReactive(v, onChange) : v;
				onChange();
				return true;
			}
		});
	}

	// --- Component ---

	function _component(dom) {
		this.dom = dom;
		const self = this;

		let _queued = false;
		this.state = _deepReactive({
			users: [],
			selectedId: null
		}, function () {
			if (_queued) return;
			_queued = true;
			queueMicrotask(function () {
				_queued = false;
				self._render();
				_dispatch(self.dom, 'ln-user-list:changed', {
					count: self.state.users.length
				});
			});
		});

		this._bindEvents();
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

		_renderList(
			this.dom.querySelector('[data-ln-list="users"]'),
			this.state.users,
			'user-item',
			function (u) { return u.id; },
			function (el, user) {
				_fill(el, {
					name: user.name,
					email: user.email,
					role: user.role,
					avatar: user.avatar,
					isAdmin: user.role === 'admin'
				});
				el.classList.toggle('active', user.id === self.state.selectedId);
			}
		);

		_fill(this.dom, {
			'user-count': this.state.users.length,
			'has-users': this.state.users.length > 0
		});
	};

	// --- Standard boilerplate (unchanged) ---

	function constructor(domRoot) {
		_findElements(domRoot);
	}

	function _findElements(root) {
		const items = root.querySelectorAll('[' + DOM_SELECTOR + ']');
		for (const el of items) {
			if (!el[DOM_ATTRIBUTE]) {
				el[DOM_ATTRIBUTE] = new _component(el);
			}
		}
		if (root.hasAttribute && root.hasAttribute(DOM_SELECTOR) && !root[DOM_ATTRIBUTE]) {
			root[DOM_ATTRIBUTE] = new _component(root);
		}
	}

	function _domObserver() {
		const observer = new MutationObserver(function (mutations) {
			for (const mutation of mutations) {
				if (mutation.type === 'childList') {
					for (const node of mutation.addedNodes) {
						if (node.nodeType === 1) _findElements(node);
					}
				} else if (mutation.type === 'attributes') {
					_findElements(mutation.target);
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

	window[DOM_ATTRIBUTE] = constructor;
	_domObserver();
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', function () { constructor(document.body); });
	} else {
		constructor(document.body);
	}
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
```

### Споредба

| Metric | Пред | После |
|--------|------|-------|
| `_bindEvents` линии | 16 | 12 (нема `self._renderList()` повици) |
| `_render` линии | 22 | 16 (декларативно) |
| querySelector chains | 8 per item | 0 |
| innerHTML = '' | Да (губи DOM nodes) | Не (keyed reuse) |
| Рачен render повик по секоја промена | Да (4 места) | Не (автоматски преку Proxy) |
| Event dispatch | Рачен | `_dispatch` helper |
| Template HTML | CSS класи за binding | `data-ln-*` атрибути |

---

## 9. Backward Compatibility

Ниеден постоечки component не мора да се менува. Новите helpers се opt-in:

- Постоечки components **продолжуваат да работат** без промена
- Нови components можат да ги користат helpers
- Постоечки components можат постепено да се рефакторираат
- `_fill`, `_renderList`, `_deepReactive` се IIFE-scoped — нема global pollution

**Редослед на миграција (препорака):**

1. Нови components → пиши со новите patterns
2. Components со листи (table, playlist, profile nav) → рефакторирај прво
3. Едноставни components (toggle, modal, tabs) → не треба миграција

---

## 10. Што НЕ правиме (финална верзија)

| Концепт | Зошто не |
|---------|----------|
| Virtual DOM | `_fill` + `_renderList` се targeted updates — побрзи од vdom diffing |
| Global state store | Component = свој state. Coordinator = wiring. Store ги спојува |
| JSX / template literals | HTML `<template>` е стандардот, видлив за дизајнери |
| Build-time compilation | Zero build dependency е принцип |
| Base class inheritance | IIFE nema `extends`. Helpers се copy-paste per IIFE |
| Shared global helpers | `_fill` е IIFE-scoped copy — нема shared dependency |