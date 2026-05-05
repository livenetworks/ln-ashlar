# tabs — architecture

Source: `js/ln-tabs/ln-tabs.js`. This document is for library
maintainers — for usage, see [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md).

## Where this sits in the layered architecture

`ln-tabs` is **not** part of the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It is a UI
primitive — render-layer adjacent (it shows and hides DOM) but with no record
awareness, no submit pipeline involvement, no validate-layer hooks. It is a
canonical embodiment of the markup-driven state and MutationObserver discipline
patterns that data-flow §10–§11 document. Read that doc for the cross-cutting
principles; this doc covers what is specific to tabs.

The component imports only `registerComponent` and `dispatch` from
`ln-core/helpers.js`, and `persistGet` / `persistSet` from
`ln-core/persist.js`. Zero cross-component dependencies.

## Why not ln-toggle (architectural)

The README's "Why not ln-toggle" is the consumer-facing version. The
architectural version is more compact:

**`ln-toggle`'s state alphabet is `{open, close}`.** Two values, one
attribute (`data-ln-toggle`), one observer-driven sync. Every consumer that
checks toggle state compares against the literal string `"open"` (CSS rules in
`_alert.scss`, `_app-shell.scss`; JS in `ln-accordion.js`). Adding a third
value would break every one of them.

**`ln-tabs`' state alphabet is the set of `data-ln-tab` keys** declared in the
markup, resolved at init by reading the children. A wrapper with
`[data-ln-tab="info"]` and `[data-ln-tab="settings"]` has alphabet
`{info, settings}`; the alphabet IS the markup. There is no fixed enumeration.

These are fundamentally different attribute contracts:

| Aspect | ln-toggle | ln-tabs |
|---|---|---|
| Attribute | `data-ln-toggle` | `data-ln-tabs-active` |
| Value space | `{"open", "close"}` (closed CSS-class set) | open string set, validated against `mapPanels` keys |
| ARIA flag | `aria-expanded` (disclosure) | `aria-selected` (tablist), `aria-hidden` (panels) |
| Persistence | `localStorage` per-element | URL hash (namespaced) OR `localStorage` (mutually exclusive) |
| Sibling coordination | external (`ln-accordion`) | internal (one attribute, all siblings react) |

Trying to subtype tabs out of toggle would force toggle's value space open,
require a coordinator that watches every toggle's `:open` event to close N-1
siblings (the accordion pattern, but with ARIA duplicated because tablist
semantics differ from disclosure), and add a separate hash sync layer that
re-implements key-namespace parsing. The net result is more code than
`ln-toggle` + `ln-tabs` combined, with a worse contract.

## Why hash sync is opt-in

Hash deep-linking is genuinely useful (a bookmarkable URL the user can share)
but it has one global side effect: clicking a tab modifies `window.location`.
A tabbed widget inside a modal or a dismissible card should not leave a
dangling `#some-tabs:something` in the URL bar.

`ln-tabs` makes hash sync **opt-in by presence of a namespace** — the wrapper
either declares an `id` (which doubles as the namespace) or
`data-ln-tabs-key="<name>"` (when `id` is unsuitable, e.g. multiple instances
from the same template). No namespace, no hash writes; the component falls back
to writing only `data-ln-tabs-active`, which is invisible to the URL bar but
still flows through the same `_applyActive` codepath.

This is also why `data-ln-persist` and hash sync are mutually exclusive. Both
want to own the "where does the active key persist?" question. If both are
present, the URL takes precedence — URLs are user-visible and shareable, and
`localStorage` is the silent fallback when no URL anchor is desired.

## Internal state

Each instance is the object created by `_component(dom)` and stored as
`dom.lnTabs`. The state surface:

| Field | Type | Set by | Read by |
|---|---|---|---|
| `dom` | `HTMLElement` | constructor | every prototype method, every event handler closure |
| `tabs` | `Array<HTMLElement>` | `_init` — `querySelectorAll("[data-ln-tab]")` | click handler attachment loop; not read after init |
| `panels` | `Array<HTMLElement>` | `_init` | not read after init except via `mapPanels` |
| `mapTabs` | `Object<key, HTMLElement>` | `_init` — keyed by resolved key (lowercase-trimmed `data-ln-tab` value, or `href` fragment for boolean anchors) | `_applyActive` (iterate to flip `data-active`); `dispatch` detail |
| `mapPanels` | `Object<key, HTMLElement>` | `_init` | `_applyActive` (iterate to toggle `.hidden`); validity guard; `_hashHandler` namespace lookup; persistence restore |
| `defaultKey` | `string` | `_init` — `data-ln-tabs-default`, falls back to first key in `mapTabs` | validity guard in `_applyActive`; `_hashHandler` fallback |
| `autoFocus` | `boolean` | `_init` — `data-ln-tabs-focus !== "false"` | `_applyActive` focus gate |
| `nsKey` | `string` | `_init` — `data-ln-tabs-key` or `dom.id`, lowercase-trimmed | derives `hashEnabled`; click handler hash write; `_hashHandler` read |
| `hashEnabled` | `boolean` | `_init` — `!!nsKey` | click handler fork; `_hashHandler` guard; persistence restore gate; `_applyActive` persistence write gate; `destroy` listener removal gate |
| `_clickHandlers` | `Array<{el, handler}>` | `_init` | `destroy` — `removeEventListener` |
| `_hashHandler` | `Function` | `_init` | `_init` — `addEventListener('hashchange', ...)`; `destroy` — `removeEventListener` |

Re-querying tabs/panels at init time only is acceptable because tab markup is
structural and changes infrequently. The markup-mutation case ("add a new tab")
goes through `destroy` + re-init. Caching in `mapTabs` / `mapPanels` makes
runtime lookups O(1).

## Init flow

1. **`registerComponent('data-ln-tabs', 'lnTabs', _component, 'ln-tabs', { extraAttributes: ['data-ln-tabs-active'], onAttributeChange: ... })`** on script load.
2. **Initial scan.** `registerComponent` walks `document.body`, finds every `[data-ln-tabs]`, constructs `_component(el)` for each.
3. **Constructor → `_init`.** For each instance:
   1. Cache `tabs[]` and `panels[]` (deep query rooted at the wrapper).
   2. Resolve `nsKey` and `hashEnabled` BEFORE `mapTabs` build — anchor key derivation in `_keyFromTrigger` needs `nsKey` to pick the right fragment.
   3. Build `mapTabs` and `mapPanels` keyed by lowercase-trimmed values.
   4. Resolve `defaultKey` (explicit attribute, else first tab key, else empty).
   5. Read `autoFocus` (`data-ln-tabs-focus !== "false"`, defaulting to `true`).
   6. **Attach click handlers** to every trigger. Guard against double-attach via `t[DOM_ATTRIBUTE + 'Trigger']` — re-init on attribute mutation could otherwise stack listeners. Anchor triggers call `e.preventDefault()` after the modifier-key early-return.
   7. **Define `_hashHandler`** as a closure over `self`. Parses `location.hash` and writes `data-ln-tabs-active` directly.
   8. **Branch on hash vs persistence:**
      - If `hashEnabled === true`: `addEventListener('hashchange', _hashHandler)`, then call `_hashHandler()` immediately to seed from the current URL.
      - Else: optionally restore from `localStorage` (`persistGet('tabs', dom)` if `data-ln-persist` and the saved key is valid). Then write `dom.setAttribute('data-ln-tabs-active', initialKey)`.
4. The `setAttribute` write triggers the `MutationObserver` → `onAttributeChange` → `_applyActive(key)` — the standard pipeline.
5. **`MutationObserver`** continues watching `document.body` for:
   - `childList` (subtree add) — re-runs `findElements`, constructs new instances on freshly added wrappers.
   - `attributes` filtered to `data-ln-tabs` and `data-ln-tabs-active`. For `data-ln-tabs-active` changes on existing instances, calls `_applyActive(newKey)`.

The `extraAttributes: ['data-ln-tabs-active']` configuration is the key piece —
without it, the observer would only watch `data-ln-tabs` itself (rare to
mutate). With it, every write to `data-ln-tabs-active` (from any source)
triggers `_applyActive`, making the attribute the single source of truth.

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

1. **Validity guard.** An invalid key (typo, removed panel, malicious URL) silently resolves to `defaultKey`. Permissive on purpose — the component is downstream of attribute writes and should be defensive.
2. **Tab buttons first, then panels.** Natural read order for accessibility tooling — flip the active tab indicator first, then reveal the panel it controls.
3. **`data-active` and `aria-selected` flip together** on every tab button. Non-active tabs explicitly get `aria-selected="false"` rather than removing the attribute — tablist convention requires every tab in a tablist to have `aria-selected`, exactly one `"true"`.
4. **`.hidden` and `aria-hidden` flip together** on every panel. `classList.toggle("hidden", !show)` forces add/remove (boolean second argument).
5. **Auto-focus is deferred via `setTimeout(..., 0)`.** The panel was un-hidden in step 4 but the browser hasn't completed layout — focusing inside a not-yet-visible element silently fails on some browsers. `{ preventScroll: true }` keeps the page from jumping when focus lands below the fold.
6. **Event dispatches AFTER all DOM and ARIA work.** Listeners read consistent state.
7. **Persistence write LAST.** Only if `data-ln-persist` is present AND `hashEnabled` is false. The local `key` variable here is already the validated value (re-mapped by the guard at step 1).

## The hash round-trip

Hash sync is the most subtle piece of `ln-tabs`. The flow:

```
   user clicks tab A
        │
        ▼
   click handler runs
        │
        ▼
   if (hashEnabled) {
       newHash = build "ns1:k1&ns2:k2" string, this section's key replaced
       if (location.hash === '#' + newHash) {
           // already in URL — force re-application via direct write
           dom.setAttribute('data-ln-tabs-active', key)
       } else {
           location.hash = newHash    // browser fires hashchange
       }
   } else {
       dom.setAttribute('data-ln-tabs-active', key)
   }
        │
        ▼
   browser fires `hashchange`
        │
   _hashHandler runs
       parses location.hash
       reads map[nsKey] (or default)
       dom.setAttribute('data-ln-tabs-active', key)
        │
        ▼
   MutationObserver sees attribute change
        │
        ▼
   onAttributeChange → _applyActive(key)
```

The interesting case is the `if (location.hash === '#' + newHash)` branch.
Why is it needed?

**Scenario.** The user is on a page where section A's hash is already
`#user-tabs:settings`. They click "Settings" — already the active tab. Setting
`location.hash` to the same value does NOT fire `hashchange` (browser
deduplicates). Without the special case, no `hashchange` event fires, no
`_applyActive` runs, no re-sync. The click handler explicitly forces a
re-application by writing the attribute directly when the hash already matches.

The same edge applies on first load: the page loads with
`#user-tabs:settings` already in the URL. `_init` calls `this._hashHandler()`
immediately (it's the existing hash, not a change) to seed the initial state.

## Anchor triggers

Triggers may be `<button>` or `<a href="#…">`. The shape
`<a href="#nsKey:key" data-ln-tab>` is the canonical form for namespaced
tablists — the `href` IS the canonical hash format the component builds for
click-driven state writes.

The click handler calls `e.preventDefault()` for anchor triggers (after the
modifier-key early-return) so the browser's default navigation does not race
with the JS hash write. Without `preventDefault`, the JS write of
`location.hash = "nsKey:key"` is followed by the browser's default navigation
to `href = "#nsKey:key"` — same value, no `hashchange` fires (deduplication),
state never syncs.

The modifier-key early-return (`ctrlKey || metaKey || button === 1`) is
preserved exactly. Ctrl/Meta-click and middle-click skip `preventDefault` and
bubble to the browser — the standard "open in new tab" affordance.

Key derivation happens in `_keyFromTrigger`:

1. Non-empty `data-ln-tab` value wins (explicit beats implicit).
2. Else, anchor `href` is parsed: `&`-split into fragments, namespace prefix
   matched against `nsKey`, substring after `:` is the key. Falls back to the
   last fragment's value.
3. Else, the trigger is logged with `console.warn` and skipped.

`nsKey` is resolved before `mapTabs` build — anchor key derivation needs `nsKey`
to pick the right fragment.

## The persistence path

```
_init {
    if (data-ln-persist && !hashEnabled) {
        saved = persistGet('tabs', dom)        // reads ln:tabs:<path>:<id>
        if (saved && saved in mapPanels) {
            initialKey = saved
        }
    }
    dom.setAttribute('data-ln-tabs-active', initialKey)
}

_applyActive(key) {
    // ... DOM and ARIA work ...
    dispatch('ln-tabs:change', ...)
    if (data-ln-persist && !hashEnabled) {
        persistSet('tabs', dom, key)           // writes ln:tabs:<path>:<id>
    }
}
```

Restore happens in `_init` BEFORE the first attribute write, so the initial
pipeline runs with the restored key. No flash of default-then-restored.

Save happens in `_applyActive` AFTER event dispatch, so listeners see the new
state when the save occurs. If a listener throws, the save still runs (no
`try/catch` around the dispatch; throws in listeners propagate but don't unwind
the calling scope per the `CustomEvent` contract).

The hash-precedence guard (`!this.hashEnabled`) appears in both restore and save
paths. Without it, a wrapper with both `id` and `data-ln-persist` would write to
`localStorage` AND respond to hash changes — two sources of truth, drifting apart.

`persistGet` / `persistSet` resolve the storage key as
`ln:tabs:<location.pathname>:<persist-value-or-id>`. Path-scoping is a feature:
the same `id="user-tabs"` on `/admin/users` and `/admin/clients` resolves to two
different keys, so each page remembers its own tab state independently.

## The destroy path

`destroy()` performs the following cleanup:

What `destroy` does:

- **Idempotent guard** at the top. Calling `destroy()` twice is safe.
- **Detach every click handler** stored in `_clickHandlers`. Each entry also clears the per-button `[DOM_ATTRIBUTE + 'Trigger']` flag, re-enabling future re-init.
- **Conditionally detach the `hashchange` listener** (only if `hashEnabled`).
- **Dispatch `ln-tabs:destroyed`** for any consumer that wants to know.
- **Delete `dom.lnTabs`** so a future `findElements` would re-init.

What `destroy` does NOT do:

- **Does NOT reset visual state.** The active tab keeps its `data-active` and `aria-selected="true"`. If visual cleanup matters, the consumer clears them — but typically `destroy` precedes removing the wrapper from the DOM, making visual cleanup moot.
- **Does NOT clear `localStorage`.** A persisted key remains for the next visit. Use `persistRemove` / `persistClear` from `ln-core/persist.js` if needed.
- **Does NOT remove `data-ln-tabs-active`.** The attribute remains; a future re-init resumes from it.

## What the component reads vs writes

| | DOM read | DOM written |
|---|---|---|
| Wrapper | `data-ln-tabs-active` (observer), `data-ln-tabs-default`, `data-ln-tabs-focus`, `data-ln-tabs-key`, `id`, `data-ln-persist` | `data-ln-tabs-active` (hash-already-matches branch) |
| Tab buttons | `data-ln-tab` value, `href` (anchor triggers) | `data-active`, `aria-selected` |
| Panels | `data-ln-panel` value | `.hidden` class, `aria-hidden` |
| Window | `location.hash`, `hashchange` event | `location.hash` (when hash sync enabled) |
| Storage | `localStorage` (via `persistGet`) | `localStorage` (via `persistSet`) |

No `aria-controls` wiring (would require generating IDs), no `role` attribute
writes (consumer ships the roles), no scroll-position memory.

## Concurrency and re-entry

Two scenarios:

1. **Listener of `ln-tabs:change` writes the attribute again** (e.g. revert to `info` if forbidden key). The `dispatch` is synchronous so the listener runs synchronously. The `setAttribute` inside the listener triggers the `MutationObserver` asynchronously (queued microtask). By the time the outer `_applyActive` finishes, the inner write is pending. The inner observation fires after, running `_applyActive('info')` cleanly. Persistence wrote `'forbidden'` then `'info'` — a fast double-write, harmless.

2. **Two concurrent attribute writes from different code paths** (user click while a `hashchange` is in flight). The `MutationObserver` queues observations and drains in attribute-write order. Each `_applyActive` call is atomic; the second runs cleanly after the first.

The validity guard makes every call self-correcting — even rapidly toggled invalid intermediate values always produce a valid end state.

## Failure modes

| Scenario | Behavior | Why |
|---|---|---|
| `data-ln-tabs-active` set to a key with no matching panel | Falls back to `defaultKey` silently | `_applyActive` validity guard. Permissive on purpose. |
| All tabs and panels removed before init | `defaultKey` resolves to `""`, `mapPanels` is empty, loops iterate empty objects — no errors | Empty-object iteration is a no-op. |
| `data-ln-tab` and `data-ln-panel` keys don't match (typo) | Tab clickable but falls back to default | Permissive. Easier to debug in markup than a console error when markup is in flux. |
| `location.hash` contains a key for an unrelated namespace | Ignored. `_hashHandler` reads `map[nsKey]` only; absent → `defaultKey`. | Multi-section hash format is read-only-your-namespace by design. |
| `localStorage.setItem` throws (quota, private browsing) | `persistSet` swallows in `try/catch`; no error surfaces | Persistence is best-effort; never block tab functionality on storage availability. |
| Ctrl/Meta-click or middle-click on a tab | Click handler returns early | Browsers map these to "open in new tab"; intercepting would break user intent. |
| Tab button without `type="button"` inside a form | Page navigates (form submit) before tab activation | Markup bug — the component cannot defend against this without overriding form behavior. |
| Anchor trigger with no resolvable key | Skipped at init with `console.warn`; clicking does nothing | Only `console.warn` the component emits. Trigger is malformed; surfacing it helps diagnose typos. |
| Multiple wrappers share the same `id` | Both register with the same hash namespace; clicks in one update both | HTML-spec violation. The library does not enforce `id` uniqueness. |

## Performance characteristics

- **Init.** O(T + P) where T = tab button count, P = panel count. One `querySelectorAll` per wrapper (rooted at wrapper, not document). Click handler attachment is O(T).
- **`_applyActive`.** O(T + P) — iterates `mapTabs` and `mapPanels`. T and P are typically 3–7; cost is negligible per switch.
- **`_hashHandler`.** O(N) where N = `&`-separated fragment count in the hash. `_parseHash` builds a fresh map each time; hash is a small string, caching is not warranted.
- **Persistence.** `persistGet` is one `localStorage.getItem` + `JSON.parse`. `persistSet` is one `JSON.stringify` + `localStorage.setItem`. Neither is on a hot path.
- **Memory.** Per instance: `tabs[]`, `panels[]`, `mapTabs`, `mapPanels`, `_clickHandlers` (one `{el, handler}` pair per trigger), one bound `_hashHandler`. No timers, no intervals, no `ResizeObserver`. Instance is GC'd after `destroy()` or page navigation.

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
| ESC-to-close? | no | n/a | yes |

Each component owns its concerns. The shared substrate is `registerComponent`,
`dispatch`, and the attribute-as-source-of-truth pattern.

## Read further

- [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md) — consumer usage, attributes, events, examples.
- [`docs/js/toggle.md`](toggle.md) — companion architecture doc for the binary primitive.
- [`docs/architecture/data-flow.md`](../architecture/data-flow.md) — cross-cutting principles (`ln-tabs` embodies them even though it sits outside the data-flow pipeline).
- `js/ln-core/helpers.js` — `registerComponent`, including `extraAttributes` and `onAttributeChange` options `ln-tabs` uses.
- `js/ln-core/persist.js` — `persistGet` / `persistSet`, the shared `localStorage` wrappers.
- `scss/config/mixins/_tabs.scss` — the underline-style visual recipe (`tabs-nav`, `tabs-tab`, `tabs-panel`).
- `scss/components/_tabs.scss` — applies the mixins to default selectors and adds the `.hidden` rule.
