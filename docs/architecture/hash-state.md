# Hash-State Doctrine

URL fragments are the right place to store client-side UI state that should
be shareable, deep-linkable, or Back/Forward-dismissable — which tab is
active, which modal is open. This doctrine defines how ln-ashlar components
put state in the URL fragment, coexist in a compound hash, and work with the
browser's history API in both SPA and plain SSR pages.

Related cross-cutting docs: [Coordinator Doctrine](coordinator.md),
[Data-flow architecture](data-flow.md).

---

## 1. When to use hash state

The fragment (`location.hash`) is the right bucket for exactly one category
of state:

> **Client-side UI/component state that is shareable, deep-linkable, or
> dismissable via Back.**

| State type | Right storage |
|---|---|
| Which tab is active in an anchor-triggered tablist | **Hash** — bookmarkable, shareable, Back-navigable |
| Which modal is open (and with what record) | **Hash** — deep-linkable open, Back-dismissable |
| Whether a disclosure panel is open | Toggle attribute / `localStorage` — not shareable per se |
| Current sort column, active filter | Query string (belongs with the page's data request) |
| True navigation state — which page/view is shown | **`ln-router` path** (never the fragment) |
| Durable user preference — sidebar collapsed, theme | **`localStorage`** (persist) |

The fragment is also the natural choice on SSR pages because the browser
never sends the fragment to the server. A hash-bound modal can exist on any
static Blade page without a server route to handle it.

---

## 2. The grammar and codec (`ln-core/hash.js`)

### 2.1 Grammar

```
#nsA:valA&nsB:valB
```

- Segments are `&`-separated.
- Each segment is `namespace:value` — one namespace per component instance.
- A bare `#ns` (no `:`) encodes an empty/present-but-valueless state.
- Values are `encodeURIComponent`-encoded on write, `decodeURIComponent`-decoded on read.

### 2.2 Functions

All four functions live in `js/ln-core/hash.js` and are exposed at
`window.lnCore.{hashParse, hashGet, hashSet, hashLinkClick}`.

| Function | Signature | Purpose |
|---|---|---|
| `hashParse` | `(str = location.hash) → { ns: value }` | Parse a hash string into a plain object. Returns `{}` on empty/malformed input. |
| `hashGet` | `(ns) → string \| null` | Read one namespace from `location.hash`. `null` = absent; `''` = bare `#ns`; otherwise the decoded value. |
| `hashSet` | `(ns, value)` | Read-modify-write — updates only `ns`, preserves all other segments, then assigns `location.hash`. |
| `hashLinkClick` | `(e) → boolean` | Modifier / middle / shift-click guard. Applies `e.preventDefault()` and returns `true` when the click should be intercepted; returns `false` (and does NOT call `preventDefault`) for modifier/middle/shift clicks so the browser can open in a new tab. |

### 2.3 Three-state write semantics (`hashSet`)

| `value` argument | Effect on the fragment |
|---|---|
| `null` | Removes the `ns` segment entirely |
| `''` (empty string) | Writes a bare `#ns` (no `:`, e.g. `#modal-id`) |
| Any other string | Writes `#ns:encodeURIComponent(value)` |

**Identical-value no-op.** If the resulting full hash string equals the
current `location.hash`, the assignment is skipped entirely. No `hashchange`
event fires, and no loops are possible.

### 2.4 Example — compound hash

A page with a tablist (`user-tabs`) and a hash-bound modal (`user-edit`)
both active produces:

```
#user-tabs:members&user-edit:42
```

Switching the tab to `activity` via `hashSet('user-tabs', 'activity')`:

```
#user-tabs:activity&user-edit:42
```

The modal segment is untouched. The tab segment is the only thing that changed.

---

## 3. The five rules

These rules are the heart of the doctrine. A component that breaks any one
of them will corrupt the fragment for every other component on the page.

### Rule 1 — Namespace ownership

A component that stores state in the URL **owns exactly one namespace**: its
element's `id` attribute, or an explicit key declared via a data attribute
(e.g. `ln-tabs` uses `data-ln-tabs-key`). A component reads and writes ONLY
its own segment. It has no awareness of other namespaces.

```js
// CORRECT — reads only own namespace
const val = hashGet(this._hashNs);   // 'user-tabs' or 'user-edit', never both

// WRONG — reads a sibling's namespace
const tabKey = hashGet('user-tabs');  // modal should never do this
```

### Rule 2 — Foreign-segment preservation

Every hash write must go through `hashSet`, which rebuilds the full fragment
from the complete parsed map before assigning `location.hash`. This is the
mechanism that keeps `#tab:members&modal:5` intact when either component
writes a change.

```js
// CORRECT — foreign segments preserved automatically
hashSet(this._hashNs, 'members');

// WRONG — replaces the entire fragment, wiping every other component's state
location.hash = '#user-tabs:members';
```

**Never assign `location.hash` to a literal fragment string.** Any component
that constructs and assigns a full fragment string is broken by design —
it will wipe every other component's hash segment on every state change.

### Rule 3 — Anchors are intercepted, not native

Native `<a href="#ns:val">` click behaviour sets `location.hash` to the
LITERAL `href` value. That replaces the whole fragment, violating Rule 2.

Therefore any component whose triggers are hash anchors **must intercept the
click** and write through `hashSet` instead:

```js
trigger.addEventListener('click', function (e) {
    // hashLinkClick applies the modifier/middle/shift guard.
    // If it returns false, the browser handles it (open in new tab) — do nothing.
    if (!window.lnCore.hashLinkClick(e)) return;
    // Safe to write — foreign segments are preserved.
    hashSet(ns, value);
});
```

Interception is **per-component**, not global. Each component recognises only
its own anchors:

- `ln-tabs` intercepts clicks on its own `[data-ln-tab]` anchor triggers
  (scoped to the wrapper element).
- `ln-modal` intercepts clicks on `<a href="#id">` and `<a href="#id:param">`
  anchors whose fragment namespace resolves to a `[data-ln-modal]` id
  (checked via `document.getElementById`).

This scoping is load-bearing — see Rule 3's anti-pattern below.

### Rule 4 — Components are generic; cross-component wiring lives in a coordinator

A hash-state component's responsibility is narrow:

1. Read `hashGet(ns)` on init and on every `hashchange`.
2. Apply the resulting state to its own DOM.
3. Emit a generic event describing what happened (e.g. `ln-modal:open`
   with `{ hashNs, param }` in `detail`).

It does **not** know about other components, does not perform data fetches,
and does not fill forms. That cross-component behaviour lives in a
**coordinator** — a separate module that knows both the modal's event
contract AND the fill attribute contract, but imports neither component's
source.

`ln-modal-fill` is the canonical example: it listens for `ln-modal:open`,
reads `detail.param`, finds the matching `[data-ln-fill-id]` source, and
calls `window.lnCore.lnFill(modal, record)`. The modal knows nothing about
fill; the fill helper knows nothing about hash state. The coordinator bridges
them. See [Coordinator Doctrine](coordinator.md) and
[`docs/js/modal-fill.md`](../js/modal-fill.md).

### Rule 5 — Router fragment guard

`ln-router`'s `popstate` handler compares the incoming URL's path + query
against the current SPA state. When **only the fragment changed** (path and
query are identical), the router skips navigation entirely — no outlet
teardown, no template swap, no `ln-router:navigated`.

This is what makes "Back to dismiss a modal" work in an SPA. The user opened
a hash-bound modal (`#modal-id:42`), the router pushed no new path. Pressing
Back fires `popstate` to the previous URL (same path, no fragment). The
router skips the swap; `hashchange` fires independently; `ln-modal`'s
`_onHashChange` closes the modal. The table under the modal, the scroll
position, and all filter state are completely preserved.

Real path/query navigations are completely unaffected.

---

## 4. Recipe — making a component hash-addressable

Follow these steps to give a new or existing component hash-addressable
state.

**Step 1 — Own a namespace.** Choose the element's `id` as the namespace,
or add a `data-{component}-key` attribute for explicit control. Store it as
`this._hashNs = dom.id || null` in the constructor.

**Step 2 — React to `hashchange` and init.** Attach a `hashchange` listener
at construction time. Call the same handler immediately after attaching it
so the component seeds its state from the current URL on boot.

```js
this._hashHandler = function () {
    const val = hashGet(self._hashNs);  // null | '' | value
    if (val !== null) {
        // Hash segment is present — apply open/active state
        self._applyState(val);
    } else {
        // Hash segment absent — apply closed/default state
        self._clearState();
    }
};
window.addEventListener('hashchange', this._hashHandler);
this._hashHandler();  // seed from current URL
```

**Step 3 — Write via `hashSet`, never direct assignment.**

```js
// Opening (with a value):
hashSet(this._hashNs, recordId);

// Opening (bare presence, no param):
hashSet(this._hashNs, '');

// Closing (remove segment):
hashSet(this._hashNs, null);
```

**Step 4 — Intercept anchor triggers.** If the component uses `<a href="#">`
elements as triggers, add a click listener that calls `hashLinkClick(e)` and
then `hashSet`:

```js
anchor.addEventListener('click', function (e) {
    if (!window.lnCore.hashLinkClick(e)) return;
    hashSet(ns, key);
});
```

**Step 5 — Emit a generic open/close event.** Include `hashNs` and any
payload in `detail` so coordinators can react without needing to re-parse
the hash:

```js
dispatch(this.dom, 'my-component:open', { hashNs: this._hashNs, param: val });
```

**Step 6 — Remove the listener in `destroy`.** Detach the `hashchange`
listener to prevent stale handlers after the component is torn down.

```js
_component.prototype.destroy = function () {
    if (this._hashHandler) {
        window.removeEventListener('hashchange', this._hashHandler);
        this._hashHandler = null;
    }
    delete this.dom[DOM_ATTRIBUTE];
};
```

**What NOT to do in the component:** do not read another namespace, do not
fill a form, do not resolve a record id to data. Delegate all of that to a
coordinator (Rule 4).

---

## 5. Anti-patterns

### 5.1 Relying on native anchor navigation (violates Rule 2)

The anti-pattern is *letting the browser's native anchor behaviour write the
hash*. With no interceptor, a `<a href="#modal-id:42">` click sets
`location.hash` to the literal `#modal-id:42`, replacing the whole fragment
and wiping every other segment (`#user-tabs:…`, etc.).

The fix is **not** different markup — it is that the owning component
intercepts the click. The same anchor is correct precisely because `ln-modal`
recognises and intercepts it:

```html
<!-- CORRECT — same markup; ln-modal intercepts it because the namespace
     "modal-id" resolves to a [data-ln-modal] element. The component's
     listener calls hashLinkClick(e) then hashSet, so foreign segments
     survive. No extra attribute is needed — the modal's id IS the namespace. -->
<a href="#modal-id:42">Edit</a>
```

A plain `#section` scroll anchor (whose namespace does not resolve to a
`[data-ln-modal]` id) is deliberately left to native behaviour — that is why
interception is per-component and scoped, never global (see §5.2).

### 5.2 A global hash-link interceptor (violates Rule 3's scoping)

A single document-level click listener that intercepts ALL `<a href="#…">`
clicks looks attractive but is incorrect:

```js
// WRONG — global interceptor hijacks ordinary #section scroll links,
// footnote anchors, and any anchor not related to hash-state components
document.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    // … parse and dispatch …
});
```

Use per-component interceptors scoped to the component's own anchors.
Each component knows which anchors are its own — `ln-modal` checks whether
the fragment resolves to its own id; `ln-tabs` scopes to its own wrapper.

### 5.3 A component reading or writing another component's namespace

```js
// WRONG — the modal coordinator should never know about tab state
const activeTab = hashGet('user-tabs');
if (activeTab === 'members') { /* … */ }
```

Cross-component wiring belongs in a coordinator, not inside the component
that happens to see the hash. The coordinator reads BOTH event contracts and
connects them — without either component importing the other.

### 5.4 Baking fill / data logic into the component (violates Rule 4)

```js
// WRONG — ln-modal filling a form when it opens
_component.prototype._open = function () {
    const param = hashGet(this._hashNs);
    if (param) {
        const source = document.querySelector('[data-ln-fill-id="' + param + '"]');
        window.lnCore.lnFill(this.dom, buildRecord(source));
    }
    // …
};
```

`ln-modal` emits `ln-modal:open` with `{ param }` in `detail`. The
`ln-modal-fill` coordinator does the record lookup and `lnFill` call.
The modal remains a generic primitive; the coordinator knows the fill
contract.

### 5.5 Using hash state for true navigation or durable preferences

```js
// WRONG — the route is navigation state, not UI state
hashSet('page', 'users');        // use ln-router path instead
hashSet('theme', 'dark');        // use localStorage / persist instead
```

Hash state is for **component state** that maps cleanly to a UI element
being open or active. Page-level navigation belongs in the path (managed
by `ln-router`). User preferences that survive across sessions belong in
`localStorage` (managed by `persist.js`).

---

## 6. How existing components use hash state

| Component | Namespace source | Trigger type | Hash value meaning |
|---|---|---|---|
| `ln-modal` | `dom.id` | `<a href="#id">` or `<a href="#id:param">` | `''` = open (new mode); `'42'` = open with param (edit mode) |
| `ln-tabs` | `data-ln-tabs-key` or `dom.id` | `<a href="#ns:key">` | Tab key (e.g. `'members'`, `'settings'`) |

Both components delegate fill/data logic to coordinators. `ln-modal-fill`
fills the form when `ln-modal:open` carries a `param`. There is no
equivalent coordinator for tabs (tabs have no record-fill concept).

---

## 7. Relationship to other architecture layers

```
┌──────────────────────────────────────────────────────────────────┐
│  URL                                                             │
│  path + query ──→  ln-router (page/view navigation)            │
│  fragment     ──→  hash-state doctrine (component UI state)     │
│  (never sent to server)                                         │
└──────────────────────────────────────────────────────────────────┘
                                │
                    hashchange fires
                                │
              ┌─────────────────┼─────────────────┐
              ▼                                   ▼
          ln-modal                             ln-tabs
     reads hashGet(id)                  reads hashGet(nsKey)
     applies open/close                 applies active tab
     emits ln-modal:open                emits ln-tabs:change
              │
              ▼
       ln-modal-fill (coordinator)
       reads detail.param
       calls lnFill(modal, record)
```

The router's **fragment-only popstate guard** (Rule 5) is the load-bearing
connection between `ln-router` and this layer: it ensures that Back/Forward
navigation over a hash-state change never tears down the SPA view.

The **Coordinator Doctrine** ([coordinator.md](coordinator.md)) is the
load-bearing connection between hash-state components and fill/data logic:
components emit events, coordinators connect them, and neither imports the
other's source.
