# ln-acme JS Component Guide

> Concrete patterns for building ln-acme components.
> For general JS principles (IIFE, CustomEvent, coordinator pattern) → see `js` skill in claude-skills.
> This document covers ln-acme SPECIFIC conventions that go beyond the generic patterns.

---

## Component Skeleton

Every ln-acme component uses `findElements` from `ln-core` instead of raw MutationObserver setup:

```javascript
import { findElements } from '../ln-core'

;(function () {
    const DOM_SELECTOR = 'data-ln-{name}'
    const DOM_ATTRIBUTE = 'ln{Name}'

    if (window[DOM_ATTRIBUTE] !== undefined) return

    // --- Module-level state (shared across all instances) ---
    const _cache = {}

    // --- Constructor ---
    function _constructor(dom) {
        this.dom = dom
        // init logic here
    }

    // --- Instance methods (on prototype) ---
    _constructor.prototype.render = function () { /* ... */ }
    _constructor.prototype.destroy = function () {
        // cleanup: remove from pools, cancel timers, delete dom ref
        delete this.dom[DOM_ATTRIBUTE]
    }

    // --- Private helpers ---
    function _helper() { /* ... */ }

    // --- Boot ---
    function constructor(domRoot) {
        findElements(domRoot, DOM_SELECTOR, DOM_ATTRIBUTE, _constructor)
    }

    window[DOM_ATTRIBUTE] = constructor
    constructor(document)
})()
```

### What `findElements` Does

`findElements(root, selector, attribute, Constructor)` from `ln-core`:

1. Finds all `[data-ln-{name}]` elements under `root`
2. Skips already-initialized (checks `element[DOM_ATTRIBUTE]`)
3. Creates instance: `element[DOM_ATTRIBUTE] = new Constructor(element)`
4. Sets up MutationObserver for dynamic elements (childList + subtree)
5. Handles the initialization guard (no double-init)

You provide the constructor. `findElements` handles discovery, guarding, and observation.

---

## Zero Display Text — Hard Rule

**JS components contain ZERO user-facing text.** No strings that the user sees — not "Loading...", not "No results", not "Delete", not "Close". Nothing.

All display text comes from outside the component:

| Text Type | Source | Who Provides It |
|-----------|--------|-----------------|
| Static UI text (headings, labels, messages) | `<template>` elements | Blade renders translated text: `{{ __('No documents yet') }}` |
| Dynamic labels (button text, toast messages) | `data-ln-*-dict` attribute | Blade renders JSON with translations |
| Formatted values (dates, numbers, currency) | `Intl` API | Browser localizes automatically from `<html lang>` |

**Why:** ln-acme is a multilingual library. If "No results" is hardcoded in JS, it can't be translated. Templates and dictionaries are rendered by Blade, which has access to Laravel's translation system (`__()`, `@lang`).

**What IS allowed in JS:**
- Console messages: `console.warn('[ln-time] Missing datetime')` — developer-only, not user-facing
- Attribute values: `'true'`, `'false'`, class names — technical, not display
- Event names: `'ln-store:request-create'` — internal, not display

```javascript
// WRONG — hardcoded display text
dom.textContent = 'No results found'
dom.title = 'Click to sort ascending'
button.textContent = 'Loading...'

// RIGHT — text from template
const fragment = _cloneTemplate('empty-state')   // template has translated text
container.appendChild(fragment)

// RIGHT — text from dictionary
const dict = _getDict(dom)
button.textContent = dict.loading || 'Loading...'  // fallback only for dev, Blade always provides dict

// RIGHT — text from Intl
dom.textContent = new Intl.DateTimeFormat(locale).format(date)
```

---

## MutationObserver — Attribute Watching

`findElements` watches for NEW elements (childList). If your component also needs to react to ATTRIBUTE CHANGES on existing elements, add your own observer:

```javascript
function _constructor(dom) {
    this.dom = dom
    this._attrObserver = new MutationObserver(function (mutations) {
        for (const m of mutations) {
            if (m.type === 'attributes') {
                _render(dom[DOM_ATTRIBUTE])
            }
        }
    })
    this._attrObserver.observe(dom, {
        attributes: true,
        attributeFilter: ['datetime', 'data-ln-time']  // only watch relevant attrs
    })
    _render(this)
}

_constructor.prototype.destroy = function () {
    this._attrObserver.disconnect()
    delete this.dom[DOM_ATTRIBUTE]
}
```

**Use `attributeFilter`** — never observe ALL attributes. List only the ones your component cares about.

---

## Shared Resource Pools

When multiple instances share a resource (timer, formatter, connection), manage it at module level, not per-instance.

### Shared Interval (ln-time pattern)

For components that need periodic updates (relative timestamps, polling indicators):

```javascript
const _pool = new Set()        // instances that need updates
let _intervalId = null

function _startInterval() {
    if (_intervalId) return
    _intervalId = setInterval(_tick, 60000)   // 60s
}

function _stopInterval() {
    if (_pool.size > 0) return
    clearInterval(_intervalId)
    _intervalId = null
}

function _tick() {
    for (const instance of _pool) {
        // Clean up orphaned elements (removed from DOM without destroy())
        if (!document.body.contains(instance.dom)) {
            _pool.delete(instance)
            continue
        }
        instance.render()
    }
    _stopInterval()   // stops if pool is now empty
}

// In constructor:
function _constructor(dom) {
    this.dom = dom
    _pool.add(this)
    _startInterval()
}

// In destroy:
_constructor.prototype.destroy = function () {
    _pool.delete(this)
    _stopInterval()
    delete this.dom[DOM_ATTRIBUTE]
}
```

**Rules:**
- ONE interval for ALL instances (never per-element)
- Interval starts when first instance needs it, stops when last is removed
- `_tick` always checks `document.body.contains()` — elements can be removed from DOM without `destroy()` being called (innerHTML replacement, etc.)
- `Set` (not `WeakSet`) because we need to iterate — but we clean up manually

### Formatter Cache (ln-time pattern)

`Intl.DateTimeFormat` and `Intl.RelativeTimeFormat` are expensive to create. Cache by key:

```javascript
const _formatters = {}

function _getFormatter(locale, options) {
    const key = locale + ':' + JSON.stringify(options)
    if (!_formatters[key]) {
        _formatters[key] = new Intl.DateTimeFormat(locale, options)
    }
    return _formatters[key]
}
```

Apply this pattern whenever creating reusable objects: formatters, regex patterns, template references.

---

## Template Cloning

DOM structure belongs in `<template>` elements. JS fills values, never creates structure.

```javascript
const _tmplCache = {}

function _cloneTemplate(name) {
    if (!_tmplCache[name]) {
        const tmpl = document.querySelector('[data-ln-template="' + name + '"]')
        if (!tmpl) {
            console.warn('[ln-' + name + '] Template not found: ' + name)
            return null
        }
        _tmplCache[name] = tmpl
    }
    return _tmplCache[name].content.cloneNode(true)
}
```

**Rules:**
- Template is cached on first use (never re-queried)
- Always check return value — template might not exist
- Missing template = `console.warn` + return null (never throw)
- JS fills values via `querySelector` on the cloned fragment, then appends to DOM

---

## Dictionary Pattern (Localization)

For components that display text to users, use the dictionary pattern:

```html
<div data-ln-toast
     data-ln-toast-dict='{
         "close": "Close",
         "dismiss": "Dismiss all"
     }'>
</div>
```

```javascript
function _getDict(dom) {
    const raw = dom.getAttribute('data-ln-' + COMPONENT_NAME + '-dict')
    if (!raw) return {}
    try {
        return JSON.parse(raw)
    } catch (e) {
        console.warn('[ln-' + COMPONENT_NAME + '] Invalid dict JSON')
        return {}
    }
}

// Usage — fallback to default if key missing:
const label = dict.close || 'Close'
```

**Rules:**
- Dict is a JSON object in a data attribute
- Always parse with try/catch (malformed JSON = warn, not crash)
- Always provide fallback defaults for every key
- Blade sets the dict attribute from server-side translations

### Intl API as Alternative

For date/number formatting, prefer `Intl` over dictionaries:

```javascript
// Locale from HTML lang attribute
const locale = dom.getAttribute('data-ln-time-locale')
    || document.documentElement.lang
    || undefined    // browser default

// Intl handles localization automatically
new Intl.DateTimeFormat(locale, { dateStyle: 'medium' })
new Intl.RelativeTimeFormat(locale, { style: 'short' })
new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' })
```

**Use `Intl` for:** dates, times, numbers, currencies, relative time.
**Use dict for:** UI labels, button text, messages, custom strings.

---

## Accessibility Attributes

Components that change DOM content must update ARIA attributes:

```javascript
// Title attribute for hover context (ln-time)
dom.title = fullFormattedDate    // "January 15, 2025 at 14:30"

// aria-expanded for toggles
trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false')

// aria-busy for loading
container.setAttribute('aria-busy', 'true')

// aria-live for dynamic content updates
container.setAttribute('aria-live', 'polite')   // screen readers announce changes
```

**Rules:**
- `title` attribute on abbreviated content (short dates, truncated text) — full value on hover
- `aria-expanded` on toggle triggers — JS updates, not just CSS
- `aria-live="polite"` on areas that update dynamically (search results, counters)
- `aria-busy="true"` during loading — removed when content ready

---

## Data Flow With ln-store

Components that display server data connect to `ln-store` through the coordinator. The component never touches IndexedDB directly.

### Data Component Pattern

```javascript
// Component emits request for data
dom.dispatchEvent(new CustomEvent('ln-{component}:request-data', {
    bubbles: true,
    detail: { sort, filters, search }
}))

// Component receives data via event
dom.addEventListener('ln-{component}:set-data', function (e) {
    _renderData(instance, e.detail.data)
    _updateFooter(instance, e.detail.total, e.detail.filtered)
})
```

### Coordinator Connects Them

```javascript
// Coordinator listens for data requests
document.addEventListener('ln-{component}:request-data', function (e) {
    storeEl.lnStore.getAll(e.detail).then(function (result) {
        componentEl.dispatchEvent(new CustomEvent('ln-{component}:set-data', {
            bubbles: true, detail: result
        }))
    })
})

// Coordinator re-feeds data when store syncs
document.addEventListener('ln-store:synced', function (e) {
    // Re-query with component's current state
    storeEl.lnStore.getAll({
        sort: componentEl.lnComponent.currentSort,
        filters: componentEl.lnComponent.currentFilters,
        search: componentEl.lnComponent.currentSearch
    }).then(function (result) {
        componentEl.dispatchEvent(new CustomEvent('ln-{component}:set-data', {
            bubbles: true, detail: result
        }))
    })
})
```

**Rules:**
- Component NEVER imports or references store directly
- Component requests data via event, receives via event
- Coordinator is the ONLY bridge between component and store
- Re-feed data on `ln-store:synced` to pick up background changes

---

## Error Handling

```javascript
// Recoverable — warn and continue
if (!dom) {
    console.warn('[ln-time] Init called with null element')
    return
}

// Already initialized — silent (normal during MutationObserver re-fires)
if (dom[DOM_ATTRIBUTE]) return

// Missing required attribute — warn and skip
const value = dom.getAttribute('datetime')
if (!value) {
    console.warn('[ln-time] Missing datetime attribute:', dom)
    return
}

// JSON parse failure — warn with context
try {
    return JSON.parse(raw)
} catch (e) {
    console.warn('[ln-time] Invalid JSON in dict:', raw)
    return {}
}
```

**Rules:**
- Prefix ALL warnings: `[ln-{component}]`
- Missing element/attribute = warn + return (never throw)
- Already initialized = silent return (not a warning)
- JSON parse = try/catch, warn, return default
- Never `alert()`, `confirm()`, `prompt()`
- Never throw exceptions that break the page

---

## Naming Reference

| Element | Convention | Example |
|---------|-----------|---------|
| Data attribute | `data-ln-{component}` | `data-ln-time` |
| Window API | `window.ln{Component}` | `window.lnTime` |
| DOM instance | `el.ln{Component}` | `el.lnTime` |
| Event (notification) | `ln-{component}:{action}` | `ln-time:rendered` |
| Event (request) | `ln-{component}:request-{action}` | `ln-store:request-create` |
| Event (before, cancelable) | `ln-{component}:before-{action}` | `ln-modal:before-close` |
| Dictionary attribute | `data-ln-{component}-dict` | `data-ln-toast-dict` |
| Template | `data-ln-template="{name}"` | `data-ln-template="row"` |
| Private function | `_functionName` | `_render`, `_tick` |

---

## Checklist — Before Shipping a Component

### Code
- [ ] Guard: `if (window[DOM_ATTRIBUTE] !== undefined) return`
- [ ] Uses `findElements` from `ln-core` (not custom MutationObserver for init)
- [ ] **Zero display text in JS** — all user-facing text from templates, dict, or Intl
- [ ] `attributeFilter` if watching attribute changes (never observe ALL)
- [ ] Shared resources (intervals, connections) at module level, not per-instance
- [ ] Shared interval checks `document.body.contains()` on tick (orphan cleanup)
- [ ] Formatter/template caches at module level
- [ ] `destroy()` method: removes from pools, disconnects observers, deletes DOM reference
- [ ] All warnings prefixed with `[ln-{component}]`
- [ ] Dict pattern with try/catch and fallback defaults
- [ ] `title` attribute on abbreviated content (hover for full value)
- [ ] ARIA attributes updated on state changes
- [ ] No inline styles via JS — use class toggles or CSS-driven state
- [ ] No direct store/HTTP access — data via coordinator events
- [ ] Works when injected dynamically (MutationObserver auto-init)

### Documentation
- [ ] `js/ln-{name}/README.md` — usage guide: attributes, events, API, HTML examples
- [ ] `docs/js/{name}.md` — architecture reference: internal state, render flow, event lifecycle
- [ ] `demo/admin/{name}.html` — interactive demo with live examples
