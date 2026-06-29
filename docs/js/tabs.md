# tabs — architecture

Source: `js/ln-tabs/ln-tabs.js`. This document is for library
maintainers — for usage, see [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md).

## Where this sits in the layered architecture

`ln-tabs` is a UI primitive — it shows and hides DOM but has no record
awareness, no submit pipeline involvement, no validate-layer hooks. It sits
outside the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md); read that
doc for the cross-cutting markup-driven state and MutationObserver
principles, and this doc for what is specific to tabs.

The component imports only `registerComponent` and `dispatch` from
`ln-core/helpers.js`, plus `persistGet` / `persistSet` from
`ln-core/persist.js`. Zero cross-component dependencies.

## Why not ln-toggle (architectural)

Tabs are deliberately not built on `ln-toggle`. The contracts diverge at the
attribute layer:

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
| Persistence | `localStorage` per-element | URL hash (anchor triggers) OR `localStorage` (button triggers) |
| Sibling coordination | external (`ln-accordion`) | internal (one attribute, all siblings react) |

Trying to subtype tabs out of toggle would force toggle's value space open,
require a coordinator that watches every toggle's `:open` event to close N-1
siblings (the accordion pattern, but with ARIA duplicated because tablist
semantics differ from disclosure), and add a separate hash sync layer that
re-implements key-namespace parsing. The net result is more code than
`ln-toggle` + `ln-tabs` combined, with a worse contract.

## Why the trigger type selects the mode

Hash deep-linking is genuinely useful (a bookmarkable URL the user can share)
but it has one global side effect: clicking a tab modifies `window.location`.
A tabbed widget inside a modal or a dismissible card should not leave a
dangling `#some-tabs:something` in the URL bar — though a top-level settings
page might want exactly that.

So the **trigger element declares the intent**, because the trigger tag already
carries that meaning in HTML:

- `<a href="#…">` is, by definition, navigation to a URL fragment. Anchor
  triggers run the group in **hash mode** — and need a namespace (`id` or
  `data-ln-tabs-key`) to scope the fragment.
- `<button>` is a scripted action with no URL semantics. Button triggers run the
  group in **persist mode**: state lives in `data-ln-tabs-active` (invisible to
  the URL bar) and, if `data-ln-persist` is present, in `localStorage`.

This decouples two axes that used to collide on `id`. Previously `hashEnabled`
was `!!nsKey`, so any `id` forced hash mode and silently disabled
`data-ln-persist`. Now `id` / `data-ln-tabs-key` only *namespace* the hash, and
`data-ln-persist` only names the storage key — neither selects the mode. A
button group with an `id` persists; an anchor group hashes. Mixed triggers in
one group fall back to persist with a `console.warn` rather than guessing.

This is also why `data-ln-persist` and hash sync never run together: a group is
either anchor-driven (hash) or button-driven (persist), never both.

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
| `nsKey` | `string` | `_init` — `data-ln-tabs-key` or `dom.id`, lowercase-trimmed | namespaces the hash; click handler hash write; `_hashHandler` read |
| `hashEnabled` | `boolean` | `_init` — every trigger is `<a href="#…">` AND `nsKey` is non-empty | click handler fork; `_hashHandler` guard; persistence restore gate; `_applyActive` persistence write gate; `destroy` listener removal gate |
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
   2. Detect the mode from the trigger tags (all `<a href="#…">` → hash, else persist) and resolve `nsKey` / `hashEnabled` BEFORE `mapTabs` build — anchor key derivation in `_keyFromTrigger` needs `nsKey` to pick the right fragment.
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

Once `_applyActive(key)` runs, the order of work matters:

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

Restore happens in `_init` BEFORE the first attribute write, so the initial
pipeline runs with the restored key. No flash of default-then-restored.
The check is `data-ln-persist` present AND `hashEnabled === false`; if both
fail, `initialKey` stays as `defaultKey`.

Save happens at the END of `_applyActive` AFTER `dispatch('ln-tabs:change',
…)`, so listeners see the new state when the save occurs.

The save runs after dispatch — listener exceptions are reported by the user
agent and do not unwind into `_applyActive`.

The hash-precedence guard (`!this.hashEnabled`) appears in both restore and save
paths. Because hash mode requires anchor triggers, it only engages for an
anchor-driven group that also carries `data-ln-persist`; the guard keeps that
group from writing to `localStorage` AND responding to hash changes — two
sources of truth, drifting apart.

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
- **`_applyActive`.** O(T + P) — iterates `mapTabs` and `mapPanels`.
- **`_hashHandler`.** O(N) where N = `&`-separated fragment count in the hash. The shared ln-core codec (`hashGet`/`hashParse`) builds a fresh map each call.
- **Persistence.** `persistGet` is one `localStorage.getItem` + `JSON.parse`; `persistSet` is one `JSON.stringify` + `localStorage.setItem`.
- **Memory.** Per instance: `tabs[]`, `panels[]`, `mapTabs`, `mapPanels`, `_clickHandlers` (one `{el, handler}` pair per trigger), one bound `_hashHandler`. No timers, no intervals, no `ResizeObserver`.

## Hash codec migration

> See also: [Hash-state doctrine](../architecture/hash-state.md) — the five rules (namespace ownership, foreign-segment preservation, anchor interception, coordinator separation, router fragment guard) that govern how `ln-tabs` and all other hash-state components coexist.

ln-tabs no longer contains a private `_parseHash` function. Hash parsing and
writing are now delegated to the shared ln-core hash codec
(`hashGet` / `hashSet` / `hashParse` from `js/ln-core/hash.js`). The
grammar (`#ns:value&ns2:value2`) and all behaviour are unchanged from the
consumer's perspective.

**Foreign-segment preservation.** Because `hashSet` is a read-modify-write
that updates only the tabs namespace, switching a tab now leaves any other
component's hash segment intact. For example, switching a tab while a
hash-bound `ln-modal` is open produces a compound hash like
`#demo-tab:members&demo-edit:5` — the modal segment is not cleared. Likewise,
opening a modal does not affect the tab segment.

No markup or API change — this is an internal implementation improvement only.

## Read further

- [`js/ln-tabs/README.md`](../../js/ln-tabs/README.md) — consumer usage, attributes, events, examples.
- [`docs/js/toggle.md`](toggle.md) — companion architecture doc for the binary primitive.
- [`docs/architecture/data-flow.md`](../architecture/data-flow.md) — cross-cutting principles (`ln-tabs` embodies them even though it sits outside the data-flow pipeline).
- `js/ln-core/helpers.js` — `registerComponent`, including `extraAttributes` and `onAttributeChange` options `ln-tabs` uses.
- `js/ln-core/persist.js` — `persistGet` / `persistSet`, the shared `localStorage` wrappers.
- `scss/config/mixins/_tabs.scss` — the underline-style visual recipe (`tabs-nav`, `tabs-tab`, `tabs-panel`).
- `scss/components/_tabs.scss` — applies the mixins to default selectors and scopes panel hiding to `[data-ln-tabs] [data-ln-panel].hidden`.
