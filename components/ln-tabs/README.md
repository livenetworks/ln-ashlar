# ln-tabs

> N-way exclusive panel selection on a single container, managed reactively via the DOM.

---

## 1. Philosophy & The Tabs Mindset

In `ln-ashlar`, the core design principle is **orthogonality**. Rather than creating heavy components that mix state, visual presentation, and layout, `ln-tabs` separates them into isolated concerns:

1. **State & ARIA (JavaScript)**: The `ln-tabs` component (145 lines) only manages the active tab key in the DOM, maps namespace URL hashes, handles optional `localStorage` persistence, and synchronizes ARIA accessibility. It possesses zero visual styles.
2. **Visual Presentation (CSS)**: Visual layouts, borders, alignments, and active indicator designs are handled in Vanilla CSS. The library ships mixins like `@mixin tabs-nav`, `@mixin tabs-tab`, and `@mixin tabs-panel` to handle this elegantly.
3. **Decoupled Binding (HTML)**: Tab triggers and panels are paired purely by string keys (`data-ln-tab="key"` and `data-ln-panel="key"`), decoupled from their relative DOM positions.

### Why not built on `ln-toggle`?
While similar on the surface, their contracts diverge. `ln-toggle` is a binary disclosure primitive (using `aria-expanded`). `ln-tabs` is an N-way exclusive tablist (using `aria-selected` and `aria-hidden`) that supports advanced, namespace-scoped URL deep-linking out of the box.

---

## 2. Minimal Blueprint

Triggers and panels are bound via matching keys inside a wrapper. Inactive panels must carry `class="hidden"` to prevent a layout flash before initialization.

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <!-- Tab list (triggers) -->
    <nav>
        <button type="button" data-ln-tab="info">Information</button>
        <button type="button" data-ln-tab="settings">Settings</button>
    </nav>

    <!-- Tab panels -->
    <section data-ln-panel="info">
        <p>This is the info panel.</p>
    </section>
    <section data-ln-panel="settings" class="hidden">
        <p>This is the settings panel.</p>
    </section>
</section>
```

### Key Anatomy Rules
- **The Wrapper (`data-ln-tabs`)**: Creates the tabs root instance.
- **The Trigger (`data-ln-tab="key"`)**: Marks the element as a click target. Must be a `<button>` (with `type="button"` inside forms) or an `<a>` anchor.
- **The Panel (`data-ln-panel="key"`)**: Matches the trigger by key. Inactive panels must carry `class="hidden"`.

---

## 3. The Declarative API & State Contract

State changes are driven declaratively via the `data-ln-tabs-active` attribute. **The HTML attribute is the sole source of truth.**

Clicks, URL hash changes, localStorage restorations, and external scripts all change state by writing the active attribute on the wrapper, dispatching request events, or calling the instance helper method:

```js
const tabs = document.getElementById('user-tabs');

// Canonical write — switches the active tab
tabs.setAttribute('data-ln-tabs-active', 'settings');

// Or via command event
tabs.dispatchEvent(new CustomEvent('ln-tabs:request-select', { detail: { key: 'settings' }, bubbles: true }));

// Or via instance attribute-bridge method
tabs.lnTabs.select('settings');

// Read-only state query
tabs.getAttribute('data-ln-tabs-active'); // Returns currently active key
```

### Mode is set by the trigger type

The wrapper runs in one of two modes, chosen by **what the triggers are** — not by any wrapper attribute:

- **Anchor triggers** (`<a href="#…">`) → **URL hash sync**: shareable, bookmarkable, back/forward aware. Needs a namespace (`id` or `data-ln-tabs-key`) on the wrapper.
- **Button triggers** (`<button>`) → **`localStorage` persist**, opt-in via `data-ln-persist`. The URL is never touched.

Mixing both trigger types in one group falls back to persist mode and logs a console warning. An `id` on a button-driven group no longer forces hash mode — it is free to be a plain DOM id or the persist storage key.

### Attributes
- `data-ln-tabs`: Placed on the wrapper to create the instance.
- `data-ln-tabs-active`: Currently active key (written by the component, watched by the observer).
- `data-ln-tabs-default="key"`: Default key selected on load. Falls back to the first tab trigger if omitted.
- `data-ln-tabs-focus="false"`: Opt out of auto-focusing the first focusable element inside the active panel. Default: enabled.
- `data-ln-tabs-key="name"`: Hash namespace for anchor-trigger groups. Falls back to wrapper `id` if omitted.
- `id="name"`: Doubles as the hash namespace for anchor-trigger groups when `data-ln-tabs-key` is absent. Does **not** select the mode — the trigger type does.
- `data-ln-persist`: Saves the active tab key in `localStorage` for button-trigger groups. Boolean form keys off the wrapper `id`; explicit form is `data-ln-persist="custom-key"`.

---

## 4. Transition & Command Events

All events bubble. The dispatch target is the wrapper element.

| Event | Direction | Cancelable | `detail` | Dispatched / Handled When |
|---|:---:|:---:|---|---|
| **`ln-tabs:request-select`** | Listens | No | `{ key }` | Command event sent by coordinators or external triggers to select a tab. |
| **`ln-tabs:before-change`** | Emits | **Yes** | `{ key, previousKey, tab, panel, target }` | Dispatched before active tab changes. Calling `event.preventDefault()` cancels the switch and reverts attribute/hash state. |
| **`ln-tabs:change`** | Emits | No | `{ key, previousKey, tab, panel, target }` | After the active panel is swapped, ARIA synced, focus moved (if enabled), and localStorage updated. |
| **`ln-tabs:destroyed`** | Emits | No | `{ target }` | Inside `destroy()`, after removing click and hashchange listeners. |

```js
// Example: Prevent tab change if unsaved changes exist
document.addEventListener('ln-tabs:before-change', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        alert('Please save changes before leaving this tab.');
    }
});

// Example: Listen for tab changes
document.addEventListener('ln-tabs:change', (e) => {
    console.log(`Active tab changed from ${e.detail.previousKey} to: ${e.detail.key}`);
});
```

---

## 5. Integration Patterns

### A. Hash-Deep-Linkable Tabs (URL-as-State)
Use **anchor triggers** and give the wrapper a namespace (`id` or `data-ln-tabs-key`). Clicking tabs writes to the URL hash (e.g. `#user-tabs:settings`); sharing, bookmarking, or using back/forward buttons restores the active tab on load.
```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <a href="#user-tabs:info" data-ln-tab>Information</a>
        <a href="#user-tabs:settings" data-ln-tab>Settings</a>
    </nav>
    ...
</section>
```

### B. Anchor Triggers (Deep Links)
Use `<a>` triggers with matching `href` format and boolean `data-ln-tab` attributes. Right-click copy link and middle-click "open in new tab" work out of the box.
```html
<a href="#user-tabs:info" data-ln-tab>Information</a>
<a href="#user-tabs:settings" data-ln-tab>Settings</a>
```

### C. Multiple Independent Tabsets
Multiple independent tabsets on the same page will coexist cleanly in the URL hash, namespaced by their respective wrapper `id`s (e.g., `#user-tabs:settings&project-tabs:members`).

### D. Persistent Tabs (Without URL Hash)
Use **button triggers** and add `data-ln-persist="key"` to remember the active tab in `localStorage` without touching the URL. An `id` on the wrapper is fine — it no longer forces hash mode.
```html
<section data-ln-tabs data-ln-persist="settings-tabs" data-ln-tabs-default="general">
    <nav>
        <button type="button" data-ln-tab="general">General</button>
        <button type="button" data-ln-tab="security">Security</button>
    </nav>
    ...
</section>
```

---

## 6. Integration & Source Files

- **Unified Bundle**: Loaded automatically with the main bundle:
  ```html
  <script src="dist/ln-ashlar.iife.js" defer></script>
  ```
- **Standalone IIFE**: For lightweight pages, load the standalone, self-registering IIFE version:
  ```html
  <script src="components/ln-tabs/ln-tabs.js" defer></script>
  ```
- **Active Source (ESM)**: Development source is located at [components/ln-tabs/src/ln-tabs.js](file:///c:/laragon/www/ln-ashlar/components/ln-tabs/src/ln-tabs.js).

---

## Hash codec (ln-core shared)

ln-tabs uses the shared ln-core hash codec (`hashGet` / `hashSet` /
`hashParse` from `components/ln-core/hash.js`) instead of a private parser. The
grammar and behaviour are unchanged — anchor-trigger groups still produce
`#nsKey:activeKey` fragments, still respond to `hashchange`, and still
support back/forward navigation.

**Foreign-segment preservation.** Because `hashSet` is a
read-modify-write that updates only the tabs namespace, switching a tab
now preserves any hash segment written by another component. For example,
if a hash-bound modal is open (`#demo-edit:5`), switching a tab produces
`#demo-edit:5&demo-tab:members` — the modal segment is not cleared.

No markup or API change — this is an internal implementation improvement.

---

## 🔧 Internals

Source: `components/ln-tabs/ln-tabs.js`. Zero cross-component imports — only `ln-core/helpers.js` (`registerComponent`, `dispatch`) and `ln-core/persist.js`.

### State

Each instance caches `tabs[]`/`panels[]` and derived `mapTabs`/`mapPanels` (keyed by lowercase-trimmed `data-ln-tab` value, or the resolved hash fragment for boolean anchors) once at init — re-querying happens only through `destroy()` + re-init, never on every activation. `nsKey`/`hashEnabled` are resolved *before* `mapTabs` is built, because anchor key derivation needs the namespace to pick the right hash fragment.

### Init flow

1. `registerComponent` scans for `[data-ln-tabs]`, with `extraAttributes: ['data-ln-tabs-active']` so the shared observer also watches writes to the active-key attribute (the real state channel), not just the marker attribute.
2. The constructor caches tabs/panels, detects mode, builds the maps, resolves `defaultKey` and `autoFocus`, wires click handlers (guarded against double-attach).
3. It branches on mode: hash-enabled groups attach `hashchange` and seed from the current URL immediately; persist groups optionally restore from `localStorage` *before* the first attribute write, so there's no flash of default-then-restored.
4. The resulting `setAttribute('data-ln-tabs-active', …)` is what triggers `_applyActive` through the observer — the write, not a direct call, is the single activation path.

### Activation order (`_applyActive`)

1. An invalid key (typo, removed panel) silently resolves to `defaultKey` — permissive by design, the component is downstream of attribute writes.
2. Tab buttons flip `data-active`/`aria-selected` first, then panels flip `.hidden`/`aria-hidden` — natural read order for assistive tech.
3. Auto-focus is deferred one `setTimeout(0)` (the panel was just un-hidden; layout hasn't settled) with `{ preventScroll: true }`.
4. Event dispatch happens after all DOM/ARIA writes; persistence save happens last, only when `data-ln-persist` is present and hash mode is off.

### The hash round-trip

Clicking an already-active anchor tab does not fire `hashchange` (the browser dedupes identical hash writes), so the click handler special-cases `location.hash === '#' + newHash` and force-writes the attribute directly instead of relying on the event. The same edge applies at boot: `_hashHandler()` is invoked once manually to seed state from a hash already present in the URL.

### Anchor key derivation

A non-empty `data-ln-tab` value wins if present; otherwise the `href` is split on `&`, matched against `nsKey`, and the substring after `:` is used; an anchor with no resolvable key is skipped with `console.warn`.

### Destroy

Idempotent. Detaches every click handler and clears their double-attach guards, detaches `hashchange` only if hash-enabled, dispatches `ln-tabs:destroyed`, deletes `dom.lnTabs`. Does NOT reset visual state (`data-active`/`aria-selected` survive), clear `localStorage`, or remove `data-ln-tabs-active` — a future re-init resumes from whatever is left.

### Failure modes

| Scenario | Behavior |
|---|---|
| Active key has no matching panel | Falls back to `defaultKey` silently |
| Mixed anchor + button triggers in one group | Falls back to persist mode, `console.warn` |
| `location.hash` references a foreign namespace | Ignored — `_hashHandler` reads only its own `nsKey` |
| `localStorage` write throws (quota, private mode) | Swallowed in `persistSet`'s `try/catch` |
| Tab button missing `type="button"` inside a form | Page navigates on click — markup bug, not defendable |

---

## Related
- **[`ln-toggle`](../ln-toggle/README.md)** — Binary disclosure state primitive.
- **[`ln-accordion`](../ln-accordion/README.md)** — Single-open coordinator built on `ln-toggle`.
