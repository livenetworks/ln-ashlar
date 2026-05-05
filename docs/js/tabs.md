# tabs — architecture

> The 145-line N-way-exclusive state primitive. Tabs are deliberately NOT
> built on `ln-toggle` because the contracts diverge — N-way active vs
> binary open/close, tablist ARIA vs disclosure ARIA, hash-namespaced
> deep-linking vs per-element persistence. This document covers the
> internals — instance state, the hash-round-trip codepath, why
> `_applyActive` is owned exclusively by the `MutationObserver`, and the
> design decisions that produced this particular 145-line shape. For
> consumer-facing usage see [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md).

## Where this sits in the layered architecture

`ln-tabs` is **not** part of the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It
is a UI primitive — render layer adjacent (it shows and hides DOM)
but with no record awareness, no submit pipeline involvement, no
validate-layer hooks. A page can have zero tabs, twenty tabs, or
nested tabs; the data layer never knows.

But ln-tabs is a canonical embodiment of the cross-cutting principles
data-flow §10–§11 describe:

- **Markup-driven state.** The active key lives in
  `data-ln-tabs-active="<key>"` on the wrapper element. The
  component's `mapTabs` / `mapPanels` are caches of the markup;
  `defaultKey` / `nsKey` / `hashEnabled` / `autoFocus` are
  configuration parsed once at init.
- **Attribute is the contract.** Every consumer that wants to
  change the active tab writes the attribute. The component never
  exposes a "real" mutator under the hood that bypasses
  `setAttribute`. The imperative API method `activate(key)` reduces
  to `dom.setAttribute('data-ln-tabs-active', key)` (line 92). The
  click handler reduces to the same write (line 61) when hash sync
  is off, or to `location.hash = ...` when on (line 59), and
  `location.hash` triggers the component's own `hashchange`
  listener which re-routes back to `activate()`.
- **MutationObserver-mediated reaction.** State application — flipping
  `data-active` and `aria-selected` on tab buttons, toggling
  `.hidden` and `aria-hidden` on panels, optionally focusing the
  first focusable element, dispatching `ln-tabs:change`, writing to
  `localStorage` — happens inside `_applyActive`, which is called
  *only* by the `MutationObserver`'s `onAttributeChange` callback
  (line 140-142). There is no second codepath into state
  application.
- **No `document.querySelectorAll` post-init for the component.**
  The component is initialized via `registerComponent`
  (`ln-core/helpers.js:293`), which handles the document-level
  observer pattern. The only document-scope query inside the
  component is `_parseHash` reading `location.hash` — a string
  parse, not a DOM scan. All element queries (`tabs`, `panels`)
  are scoped to the wrapper element via `this.dom.querySelectorAll`
  at init time only.

The component does not import any other library component. It
imports `registerComponent` and `dispatch` from
`ln-core/helpers.js`, and `persistGet` / `persistSet` from
`ln-core/persist.js`. That is the entire dependency graph.

Components that compose with ln-tabs reach in two ways: by
listening for `ln-tabs:change` events, and by writing
`data-ln-tabs-active="<key>"` (or `location.hash =
'<ns>:<key>'`) on the wrapper. Neither requires importing or
instance-lookup; both are visible through the DOM and the event
system.

## Why not ln-toggle (architectural)

The README's "Why not ln-toggle" section is the consumer-facing
version. The architectural version is more compact:

**ln-toggle's state alphabet is `{open, close}`.** Two values, one
attribute (`data-ln-toggle`), one observer-driven sync. Adding a
third value (`"settings"`) would break every consumer that
compares to the literal string `"open"` (CSS rules at
`scss/components/_alert.scss:5`, `scss/config/mixins/_app-shell.scss:235-237`,
JS in `ln-accordion.js:14-22`).

**ln-tabs' state alphabet is the set of `data-ln-tab` keys**
declared in the markup, decided at init by reading the children.
A wrapper with `[data-ln-tab="info"]` and `[data-ln-tab="settings"]`
has alphabet `{info, settings}`; the alphabet IS the markup. There
is no fixed enumeration — three tabs and ten tabs use the same
attribute, just with different value space.

These are fundamentally different attribute contracts:

| Aspect | ln-toggle | ln-tabs |
|---|---|---|
| Attribute | `data-ln-toggle` | `data-ln-tabs-active` |
| Value space | `{"open", "close"}` (closed CSS-class set) | open string set, validated against `mapPanels` keys |
| ARIA flag | `aria-expanded` (disclosure) | `aria-selected` (tablist), `aria-hidden` (panels) |
| Persistence | `localStorage` per-element | URL hash (namespaced) OR `localStorage` (mutually exclusive) |
| Sibling coordination | external (`ln-accordion`) | internal (one attribute, all siblings react) |
| Lines of JS | 145 | 145 |

The size parity is coincidence — they're both small primitives, but
they own different concerns. Trying to subtype tabs out of toggle
would force ln-toggle's value space open (third value `"close-but-as-tab"`?),
require a coordinator that watches every toggle's `:open` event to
close N-1 siblings (the accordion pattern, but with the ARIA flip
duplicated because tablist semantics differ from disclosure), and
add a separate hash sync layer that re-implements key-namespace
parsing. The net result would be more code than ln-toggle +
ln-tabs combined, with a worse contract.

## Internal state

Each instance is the object created by `_component(dom)` and stored
as `dom.lnTabs`. The state surface:

| Field | Type | Set by | Read by |
|---|---|---|---|
| `dom` | `HTMLElement` | constructor (line 23) | every prototype method, every event handler closure |
| `tabs` | `Array<HTMLElement>` | `_init` (line 26) — `Array.from(this.dom.querySelectorAll("[data-ln-tab]"))` | click handler attachment loop (line 48); not read after init |
| `panels` | `Array<HTMLElement>` | `_init` (line 27) | not read after init except via `mapPanels` |
| `mapTabs` | `Object<key, HTMLElement>` | `_init` — keyed by the resolved key: either the lowercase-trimmed `data-ln-tab` value, or (when the trigger is `<a>` and `data-ln-tab` is boolean) the fragment of `href` matching the wrapper's `nsKey`, falling back to the last fragment | `_applyActive` (iterate to flip `data-active`); `dispatch` detail (`tab: this.mapTabs[key]`) |
| `mapPanels` | `Object<key, HTMLElement>` | `_init` (lines 35-38) | `_applyActive` (line 107 — iterate to toggle `.hidden`); `activate` (line 91 — validity guard); `_hashHandler` (line 72 — namespace lookup); persistence restore (line 82 — saved-key validation) |
| `defaultKey` | `string` | `_init` (lines 40-41) — `data-ln-tabs-default` value, falls back to first key in `mapTabs` | `activate` (line 91 — fallback when key invalid); `_applyActive` (line 96 — same fallback); `_hashHandler` (line 72 — fallback when namespace not in URL) |
| `autoFocus` | `boolean` | `_init` (line 42) — `data-ln-tabs-focus !== "false"` | `_applyActive` (line 113 — gate the focus call) |
| `nsKey` | `string` | `_init` (line 43) — `data-ln-tabs-key` or `dom.id`, lowercase-trimmed | `_init` (line 44 — derive `hashEnabled`); click handler (line 54-58 — write hash); `_hashHandler` (line 72 — read hash) |
| `hashEnabled` | `boolean` | `_init` (line 44) — `!!nsKey` | click handler (line 54 — fork between hash write and direct attribute write); `_hashHandler` (line 70 — guard); persistence restore (line 80 — gate the restore); `_applyActive` (line 118 — gate the persistence write); `destroy` (line 129 — gate hashchange listener removal) |
| `_clickHandlers` | `Array<{el, handler}>` | `_init` (line 47, then 66 push) | `destroy` (line 125 — `removeEventListener`) |
| `_hashHandler` | `Function` | `_init` (line 69) | `_init` (line 76 — `addEventListener('hashchange', ...)`); `destroy` (line 130 — `removeEventListener`) |

Re-querying tabs/panels at init time only is acceptable because
(a) tab markup is structural and changes infrequently, (b) the
markup-mutation case is "rebuild the tabs" which goes through
destroy + re-init anyway, and (c) caching in `mapTabs` /
`mapPanels` makes runtime lookups O(1).

## Init flow

1. **`registerComponent('data-ln-tabs', 'lnTabs', _component, 'ln-tabs', { extraAttributes: ['data-ln-tabs-active'], onAttributeChange: ... })`**
   on script load (line 138-144).
2. **Initial scan.** `registerComponent` walks `document.body`,
   finds every `[data-ln-tabs]`, and constructs `_component(el)`
   for each.
3. **Constructor → `_init`.** For each instance:
   1. Cache `tabs[]` and `panels[]` (deep query rooted at the
      wrapper).
   2. Build `mapTabs` and `mapPanels` keyed by lowercase-trimmed
      `data-ln-tab` / `data-ln-panel` values.
   3. Resolve `defaultKey` (explicit attribute, else first tab
      key, else empty).
   4. Read `autoFocus` (`data-ln-tabs-focus !== "false"`,
      defaulting to `true`).
   5. Resolve `nsKey` (`data-ln-tabs-key` or `dom.id`, normalized).
   6. Set `hashEnabled = !!nsKey`.
   7. **Attach click handlers** to every trigger (`<button>` or `<a>`). For
      anchor triggers, the handler calls `e.preventDefault()` after the
      modifier-key early-return so the browser's default navigation does not
      race with the JS state update. Guard against double-attach via
      `t[DOM_ATTRIBUTE + 'Trigger']` — important because re-init on attribute
      mutation could otherwise stack listeners.
   8. **Define `_hashHandler`** as a closure over `self`. It
      parses `location.hash`, looks up the namespace, and calls
      `self.activate(...)`.
   9. **Branch on hash vs persistence:**
      - If `hashEnabled === true`: `addEventListener('hashchange', _hashHandler)`,
        then call `_hashHandler()` immediately to apply the
        current URL.
      - Else: optionally restore from `localStorage`
        (`persistGet('tabs', dom)` if `data-ln-persist` and the
        saved key is valid). Then call `activate(initialKey)`.
4. **`activate(initialKey)` →
   `dom.setAttribute('data-ln-tabs-active', initialKey)` →
   `MutationObserver` → `onAttributeChange` →
   `_applyActive(key)`** — the standard pipeline.
5. **`MutationObserver`** continues watching `document.body` for:
   - `childList` (subtree add) — re-runs `findElements` and
     constructs new instances on freshly added wrappers.
   - `attributes` filtered to `data-ln-tabs` and
     `data-ln-tabs-active`. For `data-ln-tabs-active` changes on
     existing instances, calls `_applyActive(newKey)`.

The `extraAttributes: ['data-ln-tabs-active']` configuration is the
key piece — without it, the observer would only watch
`data-ln-tabs` itself, which is rare to mutate. With it, every
write to `data-ln-tabs-active` (from any source) triggers
`_applyActive`, making the attribute the single source of truth.

## The activation pipeline (`_applyActive`)

```js
_component.prototype._applyActive = function (key) {
    if (!key || !(key in this.mapPanels)) key = this.defaultKey;
    for (const k in this.mapTabs) {
        const btn = this.mapTabs[k];
        if (k === key) {
            btn.setAttribute("data-active", "");
            btn.setAttribute("aria-selected", "true");
        } else {
            btn.removeAttribute("data-active");
            btn.setAttribute("aria-selected", "false");
        }
    }
    for (const k in this.mapPanels) {
        const panel = this.mapPanels[k];
        const show = (k === key);
        panel.classList.toggle("hidden", !show);
        panel.setAttribute("aria-hidden", show ? "false" : "true");
    }
    if (this.autoFocus) {
        const first = this.mapPanels[key]?.querySelector('input,button,select,textarea,[tabindex]:not([tabindex="-1"])');
        if (first) setTimeout(() => first.focus({ preventScroll: true }), 0);
    }
    dispatch(this.dom, 'ln-tabs:change', { key: key, tab: this.mapTabs[key], panel: this.mapPanels[key] });
    if (this.dom.hasAttribute('data-ln-persist') && !this.hashEnabled) {
        persistSet('tabs', this.dom, key);
    }
};
```

Order matters:

1. **Validity guard** (line 96 — `if (!key || !(key in this.mapPanels))`).
   An invalid key (typo, removed panel, malicious URL) silently
   resolves to `defaultKey`. No console warning. Permissive on
   purpose — the component is downstream of attribute writes and
   should be defensive about input.
2. **Tab buttons first, then panels.** The order isn't load-bearing
   for correctness (no consumer reads partial state in between),
   but it's the natural read order for accessibility tooling — flip
   the active tab indicator first, then reveal the panel it
   controls.
3. **`data-active` and `aria-selected` flip together** on every tab
   button. The non-active tabs explicitly set
   `aria-selected="false"` rather than removing the attribute,
   matching tablist convention (every tab in a tablist has
   `aria-selected`, exactly one is `"true"`).
4. **`.hidden` and `aria-hidden` flip together** on every panel.
   `classList.toggle("hidden", !show)` is the idiomatic compact form;
   the boolean second argument forces add/remove rather than toggling.
5. **Auto-focus is deferred via `setTimeout(..., 0)`.** The panel was
   un-hidden in step 4 but the browser hasn't finished the layout
   pass yet — focusing inside a not-yet-visible element silently
   fails on some browsers. The microtask delay lets layout settle
   before focus moves. `{ preventScroll: true }` keeps the page
   from jumping when focus lands on something below the fold.
6. **Event dispatches AFTER all DOM and ARIA work is done.**
   Listeners read consistent state (active tab in `mapTabs`,
   visible panel in `mapPanels`, `data-ln-tabs-active` matches
   the new key on the wrapper).
7. **Persistence write LAST.** Only fires if `data-ln-persist` is
   present AND `hashEnabled` is false. Saving a key that didn't
   pass the validity guard would be unsafe — the guard at line 96
   re-mapped the key to `defaultKey`, so the local `key` variable
   here IS the validated value.

## The hash round-trip

Hash sync is the most subtle piece of ln-tabs. The flow:

```
   user clicks tab A
        │
        ▼
   click handler runs (ln-tabs.js:50-67)
        │
        ▼
   if (hashEnabled) {
       newHash = build "ns1:k1&ns2:k2" string with this section's key replaced
       if (location.hash === '#' + newHash) {
           // already in URL — direct attribute write
           dom.setAttribute('data-ln-tabs-active', key)
       } else {
           location.hash = newHash    // browser fires hashchange
       }
   } else {
       dom.setAttribute('data-ln-tabs-active', key)
   }
        │
        ▼
   ┌─── browser fires `hashchange` ───┐
   │  _hashHandler runs                │
   │     parses location.hash          │
   │     reads map[nsKey] (or default) │
   │     calls self.activate(key)      │
   │         dom.setAttribute(           │
   │             'data-ln-tabs-active', │
   │             key)                   │
   └───────────────────────────────────┘
        │
        ▼
   MutationObserver sees attribute change
        │
        ▼
   onAttributeChange → _applyActive(key)
```

The interesting case is the `if (location.hash === '#' + newHash)`
branch (line 58). Why is it needed?

**Scenario.** The user is on a multi-section page where section A's
URL fragment is `#user-tabs:settings`. They click "Settings" in
section A — but it's already the active tab in the URL. Setting
`location.hash` to the same value does NOT fire `hashchange` (the
browser deduplicates). Without the special-case, the click
handler would do `location.hash = "user-tabs:settings"`, the
browser would notice it's the same, no `hashchange` event would
fire, and `_applyActive` would never run. The tab stays active —
which is correct from the user's perspective (no visible change),
EXCEPT that if the markup somehow drifted (a panel got removed,
the active panel got dynamically replaced), we'd miss the chance
to re-sync.

So the click handler explicitly forces a re-application by writing
the attribute directly when the hash already matches. This is the
ONE place where `_applyActive` runs without the
`hashchange`-driven path; the rest of the time, hash writes are
the canonical entry point.

The same edge case applies on first load: if the page loads with
`#user-tabs:settings` already in the URL, `_init` doesn't fire
`hashchange` (it's the existing hash, not a change). It explicitly
calls `this._hashHandler()` (line 77) to seed the initial state
from the URL.

## Anchor triggers

Triggers may be `<button>` or `<a href="#…">`. The shape `<a href="#nsKey:key" data-ln-tab>`
is the canonical form for namespaced tablists — the `href` IS the
canonical hash format the component already builds for click-driven
state writes.

The click handler calls `e.preventDefault()` for anchor triggers
(after the modifier-key early-return) so the browser's default
navigation does not race with the JS hash write. Without
`preventDefault`, the JS write of `location.hash = "nsKey:key"` is
followed by the browser's default navigation to `href = "#nsKey:key"`
— same value, no `hashchange` fires (deduplication), state never syncs
through `_applyActive`. This was the original bug that prevented
anchor support in earlier versions; line 1's header comment promised
anchor support but the click handler never delivered it.

The modifier-key early-return (`ctrlKey || metaKey || button === 1`)
is preserved exactly. Ctrl/Meta-click and middle-click skip
`preventDefault` and bubble to the browser, which opens the URL in a
new tab — the standard "open this link in a new tab" affordance that
makes anchor triggers worth having.

Key derivation for anchor triggers happens in `_keyFromTrigger`
(`ln-tabs.js`, after `_parseHash`):

1. Non-empty `data-ln-tab` value wins (explicit beats implicit).
2. Else, anchor `href` is parsed:
   - `&`-split into fragments (matches the multi-tablist hash format).
   - If a fragment's namespace prefix matches the wrapper's `nsKey`,
     the substring after `:` is the key.
   - Else the last fragment's value (after `:` if present, else the
     whole fragment) is the key.
3. Else, the trigger is logged with `console.warn` and skipped.

The `nsKey` resolution moved from after `mapTabs` build to before it
in the refactor, because the anchor key derivation needs `nsKey` to
pick the right fragment.

## The persistence path

```
   _init {
       if (data-ln-persist && !hashEnabled) {
           saved = persistGet('tabs', dom)         // reads ln:tabs:<path>:<id>
           if (saved && saved in mapPanels) {
               initialKey = saved
           }
       }
       activate(initialKey)
   }

   _applyActive(key) {
       // ... DOM and ARIA work ...
       dispatch('ln-tabs:change', ...)
       if (data-ln-persist && !hashEnabled) {
           persistSet('tabs', dom, key)            // writes ln:tabs:<path>:<id>
       }
   }
```

Restore happens in `_init` BEFORE the first `activate` call, so
the initial pipeline runs with the restored key — same as if the
markup had `data-ln-tabs-default` set to the restored key. There
is no flash of the default-then-restored sequence.

Save happens in `_applyActive` AFTER `dispatch('ln-tabs:change')`,
so listeners see the new state. If a listener throws, the save
still runs (no `try/catch` around the dispatch — the dispatch
itself is safe, throws in listeners propagate but don't unwind
the calling scope per the CustomEvent contract).

The hash-precedence guard (`!this.hashEnabled`) appears in BOTH
restore and save paths. Without it, a wrapper with both `id` and
`data-ln-persist` would write to `localStorage` AND respond to
hash changes — two sources of truth, drifting apart.

`persistGet` / `persistSet` resolve the storage key as
`ln:tabs:<location.pathname>:<persist-value-or-id>`. Path-scoping
is a feature: the same `id="user-tabs"` on `/admin/users` and
`/admin/clients` resolves to two different keys, so each page
remembers its own tab state. Path-scoping is non-overrideable; if
you genuinely need cross-page persistence, write to localStorage
yourself from a coordinator on the consumer side.

## The destroy path

```js
_component.prototype.destroy = function () {
    if (!this.dom[DOM_ATTRIBUTE]) return;
    for (const { el, handler } of this._clickHandlers) {
        el.removeEventListener("click", handler);
        delete el[DOM_ATTRIBUTE + 'Trigger'];
    }
    if (this.hashEnabled) {
        window.removeEventListener("hashchange", this._hashHandler);
    }
    dispatch(this.dom, 'ln-tabs:destroyed', { target: this.dom });
    delete this.dom[DOM_ATTRIBUTE];
};
```

What `destroy` does:

- Idempotent guard at the top. Calling `destroy()` twice is safe.
- Detach every click handler stored in `_clickHandlers`. Each entry
  also clears the per-button `[DOM_ATTRIBUTE + 'Trigger']` flag,
  re-enabling future re-init.
- Conditionally detach the `hashchange` listener (only if it was
  attached, i.e. `hashEnabled`).
- Dispatch `ln-tabs:destroyed` for any consumer that wants to know.
- Delete `dom.lnTabs` so a future `findElements` would re-init.

What `destroy` does NOT do:

- **Does NOT reset visual state.** The currently-active tab keeps
  its `data-active` and `aria-selected="true"` attributes. The
  active panel keeps its un-hidden state, the inactive panels keep
  `.hidden`. If you want to also tear down visuals, the consumer
  manually clears them — but typically `destroy` is followed by
  removing the wrapper from the DOM entirely, in which case
  visual cleanup is moot.
- **Does NOT clear `localStorage`.** A persisted key remains for
  the next visit. Use `persistRemove('tabs', dom)` or
  `persistClear('tabs')` (clears all tab persistence keys) from
  `ln-core/persist.js` if you genuinely need to forget.
- **Does NOT remove `data-ln-tabs-active` from the wrapper.** The
  attribute remains; if a future re-init runs (`window.lnTabs(wrapper)`),
  the constructor will read it and resume.

## What the component reads vs writes

| | DOM read | DOM written |
|---|---|---|
| Wrapper | `data-ln-tabs-active` (observer), `data-ln-tabs-default`, `data-ln-tabs-focus`, `data-ln-tabs-key`, `id`, `data-ln-persist` | `data-ln-tabs-active` (via `activate` and the hash-already-matches branch) |
| Tab buttons | `data-ln-tab` value, `href` (anchor triggers) | `data-active`, `aria-selected` |
| Panels | `data-ln-panel` value | `.hidden` class, `aria-hidden` |
| Window | `location.hash`, `hashchange` event | `location.hash` (when hash sync enabled) |
| Storage | `localStorage` (via `persistGet`) | `localStorage` (via `persistSet`) |

That's the entire surface. No `aria-controls` wiring (the
component does not generate IDs to set on
`aria-controls`), no `role` attribute writes (the consumer ships
the roles they want), no scroll-position memory, no panel content
manipulation.

## Concurrency and re-entry

What happens if `_applyActive` is called recursively or
concurrently? The two scenarios:

1. **Listener of `ln-tabs:change` writes the attribute again.**
   ```js
   wrapper.addEventListener('ln-tabs:change', e => {
       if (e.detail.key === 'forbidden') {
           wrapper.setAttribute('data-ln-tabs-active', 'info');   // revert
       }
   });
   ```
   The dispatch in `_applyActive` is synchronous, so the listener
   runs synchronously. The `setAttribute` inside the listener
   triggers the `MutationObserver` synchronously (per the MO spec,
   attribute mutations are observed in microtasks — actually,
   asynchronously, but they're queued and drain immediately when
   the calling stack returns). So by the time the outer
   `_applyActive` finishes (writes to `localStorage`, etc.), the
   inner attribute write is already pending observation. The
   inner observation fires AFTER the outer call completes,
   running `_applyActive('info')` cleanly. End state: tab is on
   `'info'`. Persistence wrote `'forbidden'` first, then `'info'`
   — a fast double-write, harmless.

2. **Two concurrent attribute writes from different code paths.**
   E.g. user clicks a tab while a `hashchange` is in flight.
   Same answer: the `MutationObserver` queues observations and
   drains them in attribute-write order. Each `_applyActive` call
   is atomic; the second runs cleanly after the first. No
   interleaving, no torn state.

The guard at line 91 / 96 (key validity) makes every call
self-correcting — even if the attribute is rapidly toggled
through invalid intermediate values, every `_applyActive`
re-validates and never trusts the input blindly.

## Failure modes

| Scenario | Behavior | Why |
|---|---|---|
| `data-ln-tabs-active` set to a key with no matching panel | Falls back to `defaultKey` silently | `_applyActive` guard at line 96. Permissive on purpose — observer is downstream of attribute writes and shouldn't crash. |
| All tabs and panels removed dynamically before init | `defaultKey` resolves to `""`, `mapPanels` is empty, `_applyActive` falls back to `""`, the loops at 97/107 iterate empty objects, no errors | Edge case is handled by the empty-object iteration being a no-op. The component instance still exists; further calls are no-ops. |
| `data-ln-tab` and `data-ln-panel` keys don't match (typo) | Tab buttons whose key has no panel are still clickable but click falls back to default | Permissive — see "Does NOT validate" in the README. Easier to debug than a console error if the markup is in flux. |
| `location.hash` contains a key for an unrelated namespace | Ignored. `_hashHandler` reads `map[nsKey]` only; absent → falls back to `defaultKey` | Multi-section hash format is read-only-your-namespace by design. |
| `localStorage.setItem` throws (quota, private browsing) | `persistSet` swallows in `try/catch`, no error surfaces | Persistence is best-effort; never block tab functionality on storage availability. |
| Click on a tab while user holds Ctrl/Meta or middle-click | Click handler returns early at line 51 (`if (e.ctrlKey || e.metaKey || e.button === 1) return`) | Browsers map these to "open in new tab"; intercepting would break the user's intent. Same guard as in ln-toggle and other components. |
| Form submission triggered by tab button without `type="button"` | Page navigates (form submit) before tab activation completes | Markup bug — see README "Common mistakes" item 1. The component cannot defend against this without overriding form behavior, which would be worse. |
| Anchor trigger with no resolvable key (no `data-ln-tab` value, no `#…` href) | Skipped at init with `console.warn`; clicking does nothing | The only `console.warn` the component emits. The trigger is malformed and surfacing it loud helps diagnose typos. |
| Multiple wrappers share the same `id` | Both register with the same hash namespace; clicks in one update both | HTML-spec violation. The library does not enforce uniqueness of `id`. Distinct namespaces require distinct `id`s or `data-ln-tabs-key` values. |

## Performance characteristics

- **Init.** O(T + P) where T = number of tab buttons and P = number of
  panels. One `querySelectorAll` per (rooted at the wrapper, not the
  document). Click handler attachment is O(T).
- **`_applyActive`.** O(T + P) — iterates `mapTabs` and `mapPanels`
  to flip attributes/classes. T and P are typically small (3-7
  tabs); the cost is negligible per switch.
- **`_hashHandler`.** O(N) where N = number of `&`-separated
  fragments in the hash. `_parseHash` builds a fresh map each
  time; we don't cache because hash is a small string.
- **Persistence.** `persistGet` is one `localStorage.getItem` +
  `JSON.parse`. `persistSet` is one `JSON.stringify` +
  `localStorage.setItem`. Neither is on a hot path.
- **Memory.** Per instance: `tabs[]` and `panels[]` arrays,
  `mapTabs` and `mapPanels` objects, `_clickHandlers` array of
  `{el, handler}` pairs (one per tab button), one bound
  `_hashHandler` function. No timers, no intervals, no
  `ResizeObserver`. The instance is GC'd when `destroy()` is
  called or the wrapper is removed from the DOM (the
  `MutationObserver` doesn't auto-destroy on remove, so an
  abandoned wrapper leaks the instance until the page navigates
  — same trade-off as ln-toggle).

## Comparison with sibling components

| Concern | ln-toggle | ln-tabs | ln-modal |
|---|---|---|---|
| State alphabet | `{open, close}` | open string set (markup-defined) | `{open, close}` |
| State attribute | `data-ln-toggle` | `data-ln-tabs-active` | `data-ln-modal` |
| Coordinator? | external (`ln-accordion`) | internal | internal |
| Cancelable open? | yes (`ln-toggle:before-open`) | no (no semantic gate) | no |
| Hash sync? | no | yes (opt-in via namespace) | no |
| Persistence? | per-element `localStorage` | hash OR `localStorage` (mutually exclusive) | no |
| Auto-focus? | no | yes (configurable) | yes |
| ESC-to-close? | no | n/a (tabs don't close) | yes |
| Outside-click? | no | n/a | yes (scrim click) |

Each component owns its concerns. The shared substrate is
`registerComponent`, `dispatch`, and the
attribute-as-source-of-truth pattern. Anything that could
plausibly be shared at this level (a generic "state machine on an
attribute" abstraction) would be smaller in lines saved than the
abstraction itself, so we ship the three primitives explicit.

## Read further

- [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md) — consumer
  usage, attributes, events, common mistakes.
- [`docs/js/toggle.md`](toggle.md) — companion architecture doc
  for the binary primitive. Compare cardinality, observer wiring,
  and persistence implementations.
- [`docs/architecture/data-flow.md`](../architecture/data-flow.md)
  — broader cross-cutting principles ln-tabs embodies (markup
  state, MutationObserver discipline) even though it sits outside
  the data-flow pipeline.
- `js/ln-core/helpers.js:293` — `registerComponent`, including the
  `extraAttributes` and `onAttributeChange` options ln-tabs uses.
- `js/ln-core/persist.js` — `persistGet` / `persistSet`, the
  shared `localStorage` wrappers used by ln-tabs, ln-toggle, and
  others.
- `scss/config/mixins/_tabs.scss` — the underline-style visual
  recipe (`tabs-nav`, `tabs-tab`, `tabs-panel`).
- `scss/components/_tabs.scss` — applies the mixins to default
  selectors.
