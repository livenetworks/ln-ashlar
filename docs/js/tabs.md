# Tabs

Hash-aware tab component. File: `js/ln-tabs/ln-tabs.js`.

## HTML

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button data-ln-tab="info">Information</button>
        <button data-ln-tab="settings">Settings</button>
    </nav>
    <section data-ln-panel="info">...</section>
    <section data-ln-panel="settings" class="hidden">...</section>
</section>
```

## Attributes

| Attribute | On | Description |
|-----------|-----|-------------|
| `data-ln-tabs` | wrapper | Creates tab instance |
| `id="key"` | wrapper | Namespace for hash sync (required for hash) |
| `data-ln-tabs-key="key"` | wrapper | Alternative namespace (when `id` is not suitable) |
| `data-ln-tabs-default="key"` | wrapper | Default active tab (default: first tab) |
| `data-ln-tabs-focus="false"` | wrapper | Disable auto-focus on first input in panel |
| `data-ln-tab="key"` | tab button | Associates button with a key |
| `data-ln-panel="key"` | panel element | Associates panel with a key |

## Hash Format

```
#namespace:tabkey
```

Multiple sections on the same page — each stores its own state:

```
#user-tabs:settings&project-tabs:members
```

Without `id` / `data-ln-tabs-key`: no hash sync, only activates `defaultKey`.

## Events

| Event | Bubbles | Cancelable | `detail` |
|-------|---------|------------|----------|
| `ln-tabs:change` | yes | no | `{ key, tab, panel }` |
| `ln-tabs:destroyed` | yes | no | `{ target }` |

`ln-tabs:change` fires on the wrapper after activating a new tab.

## JS API

```js
const tabs = document.getElementById('user-tabs');
tabs.lnTabs.activate('settings');   // activates tab programmatically
tabs.lnTabs.destroy();              // removes listeners, dispatches ln-tabs:destroyed

// Direct hash control
location.hash = 'user-tabs:settings';
location.hash = 'user-tabs:settings&project-tabs:members';

// Manual init (Shadow DOM, iframe only)
window.lnTabs(container);
```

---

## Internal Architecture

### State

Each `[data-ln-tabs]` element gets a `_component` instance at `element.lnTabs`. State after `_init`:

| Property | Type | Description |
|----------|------|-------------|
| `dom` | Element | Wrapper element |
| `tabs` | Array | All `[data-ln-tab]` elements |
| `panels` | Array | All `[data-ln-panel]` elements |
| `mapTabs` | Object | `{ key → tab element }` |
| `mapPanels` | Object | `{ key → panel element }` |
| `defaultKey` | string | Key of the default tab |
| `nsKey` | string | Namespace for hash (from `id` or `data-ln-tabs-key`) |
| `hashEnabled` | boolean | `!!nsKey` |
| `autoFocus` | boolean | From `data-ln-tabs-focus` |
| `_clickHandlers` | Array | `{ el, handler }` pairs — stored for cleanup in `destroy()` |
| `_hashHandler` | Function | Bound `hashchange` listener |

Keys are normalized to lowercase and trimmed.

### Activation Flow

Tab click → click handler runs:

1. If `hashEnabled`: builds new hash string, sets `location.hash` → browser fires `hashchange` → `_hashHandler` → `activate(key)`
2. If not hash-enabled: calls `dom.setAttribute('data-ln-tabs-active', key)` directly

`activate(key)` sets the `data-ln-tabs-active` attribute.

MutationObserver detects the attribute change → calls `_applyActive(key)`:

1. Set `data-active` + `aria-selected="true"` on the active tab; remove from all others
2. Toggle `.hidden` and `aria-hidden` on all panels
3. Auto-focus first focusable element in the active panel (if `autoFocus === true`)
4. Dispatch `ln-tabs:change`

**Hash edge case**: if the hash already matches the new value (clicking active tab when it's already in hash), `location.hash` won't change and `hashchange` won't fire. The handler explicitly calls `dom.setAttribute('data-ln-tabs-active', key)` in this case.

### Persistence

Tabs support opt-in `localStorage` persistence via `data-ln-persist`. Only active when `hashEnabled === false`.

| Attribute | Description |
|-----------|-------------|
| `data-ln-persist` | Boolean — uses element `id` as storage key |
| `data-ln-persist="custom-key"` | Uses the given string as storage key |

**Storage key format:** `ln:tabs:{pagePath}:{id}`

- Example: `ln:tabs:/admin/settings:settings-tabs`
- Stored value: the active tab key string (e.g. `"security"`)

**Hash precedence:** If `hashEnabled === true` (element has `id` or `data-ln-tabs-key` set), `data-ln-persist` is ignored entirely. Hash sync and localStorage persistence are mutually exclusive.

**Restore timing:** In `_init()`, after `defaultKey` is determined. If `data-ln-persist` is present and `hashEnabled` is false, `persistGet` is called. If a saved key exists and is valid (`saved in this.mapPanels`), `initialKey` is set to that value before `activate()` is called. Invalid saved keys (panel removed from DOM) fall back to `defaultKey` silently.

**Save timing:** In `_applyActive()`, after `dispatch('ln-tabs:change')`. Saves only if `data-ln-persist` is present and `hashEnabled` is false.

**Graceful degradation:** All `localStorage` calls are in `persist.js` with `try/catch`. Storage errors are silently swallowed.

### Multiple Sections

Each section reads only its own namespace from the hash. Hash format: `ns1:key&ns2:key`. `_parseHash()` splits on `&` and parses `key:value` pairs. Each instance reads only `map[self.nsKey]`. Clicking in one section rewrites the whole hash but preserves all other namespaces.

### MutationObserver

Watches `data-ln-tabs` (new instances) and `data-ln-tabs-active` (activation changes). The observer is the single code path that calls `_applyActive()`.
