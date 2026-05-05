# ln-tabs

> N-way exclusive panel selection on a single container — the tab
> primitive in ln-ashlar. 145 lines of JS that own three things at
> once: which tab is active (a string key on the wrapper), how to
> persist it (URL hash for namespaced sections, `localStorage` as the
> opt-in fallback), and how to keep ARIA in sync. Triggers may be
> `<button>` or `<a href="#…">` — the latter produces shareable,
> crawlable URLs. Tabs are deliberately NOT built on `ln-toggle` —
> the contracts they need (one-of-N exclusion, tablist semantics,
> hash-namespaced state) diverge enough from binary open/close that
> reuse would distort both components. See "Why not ln-toggle" below.

## Philosophy

A tab interface is, mechanically, a pile of show/hide rules with one
extra invariant: **exactly one panel visible at a time, ever**. Every
other piece of the contract — keyboard nav, URL deep-linking, ARIA
tablist semantics, focus management — is downstream of that
single invariant. ln-tabs centralises the invariant in one
attribute on the wrapper (`data-ln-tabs-active="<key>"`) and lets
everything else flow from it.

The shape is the same attribute-as-state pattern ln-toggle pioneered,
but the cardinality is different. ln-toggle's state is binary:
`"open"` vs `"close"`. ln-tabs' state is N-way: any one of the keys
declared by the wrapper's `[data-ln-tab="<key>"]` children. Every
mutation funnels through the same single codepath:

1. Caller writes `data-ln-tabs-active="settings"` on the wrapper —
   from a click handler, from a `hashchange` listener, from
   `el.lnTabs.activate('settings')`, from `location.hash =
   '#user-tabs:settings'`, from a DevTools attribute edit.
2. The `MutationObserver` (`extraAttributes:
   ['data-ln-tabs-active']` at `ln-tabs.js:139`) fires
   `onAttributeChange`, which calls `_applyActive(key)` on the
   instance.
3. `_applyActive` flips `data-active` + `aria-selected="true"` on the
   active tab button (clears them on every other), toggles `.hidden`
   + `aria-hidden` on every panel, optionally focuses the first
   focusable element inside the new panel, dispatches
   `ln-tabs:change`, and writes to `localStorage` if persistence is
   opted in.

There is no second path. Calling `lnTabs.activate(key)` is sugar for
`dom.setAttribute('data-ln-tabs-active', key)` — verify at
`ln-tabs.js:90-93`. Click handlers funnel through the same
attribute write (line 61) or, when hash sync is enabled, through
`location.hash` which the component's own `hashchange` listener
catches and re-routes back to `setAttribute`. Persistence restores
its value by reading `localStorage` and calling `activate(savedKey)`
which again is just `setAttribute`. Even the `_init` path that picks
the initial key ends in `activate(initialKey)`.

This single-codepath shape is what makes the architectural choices
below (persistence, hash sync, multi-section coexistence) compose
without special cases. They each only need to write the attribute
correctly; the application is shared.

### Why not ln-toggle

ln-toggle is the library's binary open/close primitive (see
[`ln-toggle`](../ln-toggle/README.md)). It would be tempting to model
each tab panel as its own toggle and add a coordinator on top — the
same shape `ln-accordion` uses to enforce single-open across a list
of toggles. We deliberately did not do that. The mismatch surfaces
in three places:

1. **Cardinality of state.** Toggle's contract is "the attribute is
   `"open"` or anything else, and `"open"` is rendered." That is
   binary by design. Tabs need *one of N keys*, where the keys are
   declared by the markup, not by the component. Squeezing N-way
   state into N independent two-state toggles forces a coordinator
   that watches each toggle's `:open` event and writes
   `data-ln-toggle="close"` on N-1 siblings — which is exactly the
   accordion pattern. That works, but it produces N events per tab
   click (one `:open`, N-1 `:close`s), each running a full toggle
   pipeline, when the user only ever wanted one logical change. The
   pattern leaks performance for an unrelated reason.

2. **Tablist semantics.** ARIA's tablist contract is specifically
   one-of-N: `role="tablist"` wrapping `role="tab"` children with
   `aria-selected="true"` on exactly one. The active-tab attribute
   on the wrapper (`data-ln-tabs-active="<key>"`) maps cleanly to
   that — one source of truth, mirrored to one ARIA flag. Modeling
   N independent toggles, each maintaining its own
   `aria-expanded`, would require the coordinator to also flip
   `aria-selected` separately because tablist is a different
   contract from disclosure (toggle's). You'd be writing the same
   ARIA twice.

3. **Hash semantics.** ln-tabs supports `#namespace:key` for
   deep-linking, and the value of the key matters — it must match a
   `[data-ln-tab="<key>"]` declaration. ln-toggle's persistence
   stores `"open"` or `"close"` per element — there is no key
   space. Bolting a hash format onto a toggle-coordinator would
   require the coordinator to re-implement key registration,
   namespace parsing, and the `_parseHash` round-trip — the entire
   non-trivial part of ln-tabs, but built on the wrong primitive.

So tabs own their own state machine. The contract surface
(`data-ln-tabs-active`, `data-ln-tab`, `data-ln-panel`) is its own
vocabulary, deliberately disjoint from `data-ln-toggle`. A tab
panel is not a toggle, and trying to compose tabs out of toggles
puts coordinator logic in the wrong place.

The reusable principle: **N-way exclusive selection deserves a
single attribute on the parent, not N binary attributes on the
children.** When you find yourself reaching for an
"only-one-of-these-can-be-open" coordinator over N two-state
primitives, ask whether the right primitive is a one-of-N attribute
on the parent. Tabs say yes. Radio groups say yes (and they're a
browser-native primitive — the `name` attribute is exactly this
pattern). Stepper-active-step says yes. Single-page-route-active
says yes. The ln-accordion case is the exception, and it exists
because accordion items need their own toggle infrastructure
(triggers, persistence, animations) for reasons unrelated to the
exclusion — the exclusion is bolted on top.

### Why hash sync is opt-in via `id` / `data-ln-tabs-key`

Hash deep-linking is genuinely useful (a "tab=settings" URL the
user can bookmark or share) but it has one global side effect:
clicking a tab modifies `window.location`. That is not always
appropriate. A tabbed widget inside a modal or a card that the
user might dismiss should not leave a dangling
`#some-tabs:something` in the URL bar. ln-tabs makes hash sync
**opt-in by presence of a namespace** — the wrapper either
declares an `id` (which doubles as the namespace) or
`data-ln-tabs-key="<name>"` (when `id` is unsuitable, e.g.
multiple instances rendered from a template). No namespace, no
hash writes; the component falls back to writing only the
`data-ln-tabs-active` attribute, which is invisible to the URL
bar but still flows through the same `_applyActive` codepath.

This is also why `data-ln-persist` and hash sync are mutually
exclusive (`README.md:118` documents the precedence). Both want to
own the "where does the active key persist?" question; if both are
present, the URL takes precedence because URLs are user-visible
and shareable, and `localStorage` is the silent fallback when no
URL anchor is desired. The component does not try to keep both
in sync — it chooses one mechanism and ignores the other.

### What `ln-tabs` does NOT do

- **Does NOT animate panel transitions.** Switching the active key
  flips `.hidden` on the new and old panels — that's a
  `display: none` toggle by the library's
  `[data-ln-tabs] [data-ln-panel].hidden { @include hidden; }`
  rule (`scss/components/_tabs.scss:19`). No fade, no slide, no
  height crossfade. If you want an animation, layer it in CSS on
  the panel itself — but understand that the library's choice
  here is a UX statement, not an oversight: tab switches are
  navigational, and animations between unrelated content slow the
  user down without adding clarity. Compare `@mixin collapsible`
  for the case where animation IS the point (revealing nested
  detail).
- **Does NOT implement keyboard arrow navigation.** Pressing
  Left/Right/Home/End on a tab does NOT move focus or activation
  to a sibling tab. Tab buttons are plain `<button>` elements;
  Tab key cycles through them via the browser's default focus
  order, and Enter / Space activates each one via the browser's
  default click behavior. Arrow-key tab navigation is a
  WAI-ARIA Authoring Practices recommendation, not a hard
  requirement; ln-tabs ships without it because the cost (key
  handler, focus management, roving tabindex) is non-trivial and
  the benefit is small in admin-tool contexts where users
  typically click tabs. If your accessibility audit requires it,
  wire a `keydown` listener on the wrapper that maps
  `ArrowLeft`/`ArrowRight` to `el.lnTabs.activate(prevKey/nextKey)`.
- **Does NOT lazy-load panel content.** All panels are present in
  the DOM at init. Inactive panels are hidden via `.hidden`, not
  removed. This is intentional — lazy panels would force a
  decision about *when* to load (on hover? on first activation?
  on idle?), would complicate the persistence story (saved key
  pointing to a not-yet-loaded panel?), and would shift the
  responsibility for content fetching into the tab component
  itself. The library's stance: tabs show what's already there.
  Lazy loading is the consumer's call, wired on
  `ln-tabs:change`.
- **Does NOT enforce `role="tablist"` or `role="tab"` /
  `role="tabpanel"`.** The component sets `aria-selected` on
  tab buttons and `aria-hidden` on panels — the two ARIA
  attributes whose values genuinely change with state. The
  `role` triplet is static markup the consumer can add for full
  WAI-ARIA Authoring Practices compliance:

  ```html
  <section id="user-tabs" data-ln-tabs>
      <nav role="tablist">
          <button role="tab" aria-controls="info-panel" data-ln-tab="info">Info</button>
      </nav>
      <section role="tabpanel" id="info-panel" data-ln-panel="info">…</section>
  </section>
  ```

  We do NOT auto-inject these because (a) the wrapper element
  varies (`<section>`, `<div>`, `<aside>` are all valid hosts)
  and we don't want to overwrite a consumer's
  `role="region"` choice, and (b) `aria-controls` requires the
  panel's `id`, which we'd have to generate when missing — a
  fragile pattern. The minimal contract (`aria-selected` +
  `aria-hidden`) is what *changes* with state; the static
  `role`s are markup the consumer ships.
- **Does NOT remember scroll position per panel.** Switching from
  tab A scrolled halfway down back to tab A later starts at the
  top. If you need scroll-position memory, listen for
  `ln-tabs:change` and stash `panel.scrollTop` per key.
- **Does NOT validate that `data-ln-tab` keys match
  `data-ln-panel` keys.** A tab button with `data-ln-tab="foo"`
  and no panel with `data-ln-panel="foo"` will activate to the
  default key when clicked (the `activate()` guard at line 91:
  `if (!key || !(key in this.mapPanels)) key = this.defaultKey`).
  No console warning. This is permissive on purpose — it lets
  tabs render before their panels arrive in async-rendering
  scenarios — but it does mean a typo in either attribute
  silently falls back rather than failing loud.
- **Does NOT participate in form submission.** A tab's active
  state is not a form value, and the tab button is a plain
  `<button>` with no `type` attribute… which means inside a
  `<form>`, clicking a tab button would submit the form (default
  `type` for `<button>` is `submit`). **If your tabs live inside
  a form, every tab button needs `type="button"`** — see
  "Common mistakes" below.
- **Does NOT handle nested tabs specially.** You can put
  `[data-ln-tabs]` inside a `[data-ln-panel]` and it works —
  inner tabs are independent instances with their own
  attribute, their own panels, their own observer reactions.
  The hash format namespacing keeps them from colliding. But
  the inner tab's `data-ln-panel` lookup does
  `this.dom.querySelectorAll('[data-ln-panel]')` (line 27),
  which is a *deep* selector — if the inner tabs share the
  same wrapper element root (they don't, because each
  `[data-ln-tabs]` is its own root), you'd have a nesting
  bug. Verify nesting works by ensuring each `[data-ln-tabs]`
  scope is its own element.

### Cross-component coordination

ln-tabs is a UI primitive — it does not appear in the data-flow
pipeline at all (see
[`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)).
But it does coexist with several form- and render-layer
components that compose inside its panels.

| Component | Coordination | Notes |
|---|---|---|
| **`ln-toggle`** | None — independent state machines. Verified by grep: `ln-tabs.js` has zero references to `lnToggle` / `data-ln-toggle`; `ln-toggle.js` has zero references to `lnTabs` / `data-ln-tab`. The two components do not share an attribute, an event, or a code path. See "Why not ln-toggle" above for the architectural argument. |
| **`ln-accordion`** | Independent — accordion is built on ln-toggle, not on tabs. You can put an accordion inside a tab panel (or vice versa) and they coexist; they share no attribute or event channel. |
| **`ln-form` / `ln-validate`** | Independent at the JS level. A form can span tab panels (one form root, multiple panels each containing a subset of fields) and validation works as normal — `ln-validate` listens to `input` / `change` on the field directly, regardless of whether the field's panel is currently visible. Fields inside hidden panels still validate (the `.hidden` class is `display: none`, but the platform validates fields regardless of visibility — see `ln-validate/README.md` "Does NOT skip disabled or hidden fields"). The form's submit button gate (`ln-form._updateSubmitButton`) iterates *all* `[data-ln-validate]` fields in the form, hidden or not, so a required field in an inactive tab panel will keep the submit button disabled. The user clicking submit while a hidden-panel field is invalid sees no visible error indicator until they switch to that tab. **Coordinate UX**: listen for `ln-form:submit` cancellation or surface "errors in other tabs" yourself by checking the active panel against the invalid-fields list. |
| **`ln-data-table`** | Compose freely. A data-table inside a tab panel works — but be aware of the virtual-scroll geometry. `ln-data-table` registers `scroll` and `resize` listeners on `window` (`ln-data-table.js:781-782`) and computes row positions from `getBoundingClientRect()`. While the panel is hidden (`display: none`), the table's container has zero height and virtual scroll measurements are stale. On `ln-tabs:change` to a tab containing a data-table, the table re-measures correctly because `_renderVirtual` runs on the next scroll/resize event — but if the user does NOT scroll, the visible row range may be off by a few rows for an instant after the switch. **If exact first-paint correctness matters**, dispatch a synthetic `resize` event after `ln-tabs:change` activates a panel containing a data-table, or call the table's render directly. The library does not auto-wire this because cross-component side-effects on switch would defeat the "tabs do one thing" rule. |
| **Hash routing libraries** | The hash format ln-tabs writes is `ns1:key&ns2:key`, joined by `&`. If your project also uses the URL hash for routing (e.g. an SPA hash router writing `#/users/42`), the two formats may collide. ln-tabs does NOT URL-encode keys and does NOT escape special characters; the parser splits on the first `:` per fragment (`_parseHash` at `ln-tabs.js:12-21`). Keep tab keys alphanumeric and decide at the project level which subsystem owns the hash. The cleanest separation: don't use hash sync for tabs (omit `id` and `data-ln-tabs-key`), use `data-ln-persist` for the tab state instead. |

The shared pattern is the same as elsewhere in ln-ashlar: ln-tabs
writes to the platform (an attribute, ARIA flags, a class, a
custom event) and reads from the platform (clicks, hashchange,
attribute mutations). Other components compose with it by reading
the same platform surface, never by importing or instance lookup.

## What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Which tab is currently active? | `data-ln-tabs-active="<key>"` on the wrapper | `ln-tabs` |
| Which tabs and panels exist? | `[data-ln-tab="<key>"]` and `[data-ln-panel="<key>"]` children | consumer's markup; ln-tabs reads at init |
| Default tab when no other source picks one? | `data-ln-tabs-default="<key>"` on the wrapper, else first tab | `ln-tabs` (read once in `_init`) |
| Should auto-focus run after activation? | `data-ln-tabs-focus="false"` to opt out (default: opt in) | `ln-tabs` |
| Hash namespace? | wrapper's `id` attribute, or `data-ln-tabs-key="<name>"` if `id` is unsuitable | `ln-tabs` (resolves at init) |
| Persistence? | `data-ln-persist` (boolean) or `data-ln-persist="custom-key"` on the wrapper | `ln-tabs` (writes to `localStorage`, only when hash sync is OFF) |
| Tab "is selected" ARIA flag | `aria-selected="true|false"` on the tab button | `ln-tabs` (synced from `data-ln-tabs-active`) |
| Tab "is active" CSS hook | `data-active` (presence) on the tab button | `ln-tabs` (synced from `data-ln-tabs-active`); CSS reads via `[data-ln-tab][data-active]` |
| Panel "is hidden" ARIA flag | `aria-hidden="true|false"` on the panel | `ln-tabs` (synced from `data-ln-tabs-active`) |
| Panel "is hidden" CSS hook | `.hidden` class (presence) on the panel | `ln-tabs`; library SCSS at `scss/components/_tabs.scss:19` |

The component instance carries: `tabs[]`, `panels[]`, `mapTabs{}`,
`mapPanels{}`, `defaultKey`, `nsKey`, `hashEnabled`, `autoFocus`,
plus listener-tracking arrays for cleanup. Every observable piece
of state is on the DOM; the instance fields are caches and
configuration.

## Markup anatomy

A tabs section has three structural pieces — a wrapper, a list of
tab buttons, and a list of matching panels.

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button data-ln-tab="info">Information</button>
        <button data-ln-tab="settings">Settings</button>
        <button data-ln-tab="history">History</button>
    </nav>

    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
    <section data-ln-panel="history"  class="hidden">…</section>
</section>
```

### The wrapper — `[data-ln-tabs]`

The element with `data-ln-tabs` is the tabs root. Presence of the
attribute creates the instance; the value is unused
(`data-ln-tabs` typically has no value). The wrapper hosts the
active-key attribute (`data-ln-tabs-active`), the default-key
attribute (`data-ln-tabs-default`), and the namespace
(`id` or `data-ln-tabs-key`).

The element type is the consumer's choice — `<section>` is the
clean default for a self-contained tabbed region. `<div>` works.
`<article>` works inside a card. **Do NOT use `<main>`** — the
HTML spec allows only one `<main>` per page.

### The triggers — `[data-ln-tab]` or `<a href>`

Triggers are queried by `this.dom.querySelectorAll('[data-ln-tab]')`
— a deep query rooted at the wrapper. Triggers are typically inside a
`<nav>` for grouping, but the position is not enforced; any descendant
of the wrapper with `data-ln-tab` is counted as a trigger.

Three trigger forms are supported:

| Form | Markup | Notes |
|---|---|---|
| `<button>` (existing) | `<button data-ln-tab="settings">` | Unchanged. `data-ln-tab` value is the key. |
| `<a>` explicit | `<a href="#user-tabs:settings" data-ln-tab="settings">` | Both attributes carry the key — explicit wins. |
| `<a>` boolean (canonical) | `<a href="#user-tabs:settings" data-ln-tab>` | Boolean `data-ln-tab` opts the anchor in; key derives from `href`. |

The canonical anchor example:

```html
<a href="#user-tabs:settings" data-ln-tab>Settings</a>
```

Keys are normalized (`toLowerCase().trim()`) so `data-ln-tab="Info"` and
`data-ln-tab="info"` resolve to the same key. The active key in the
`data-ln-tabs-active` attribute and in the URL hash is the normalized form.

Each `<button>` trigger SHOULD have no `type` attribute (or explicit
`type="button"`) — inside a form, buttons need `type="button"` to avoid
submitting on click. See "Common mistakes" item 1.

### The panels — `[data-ln-panel="<key>"]`

Each panel matches a tab by key. Same deep query, same
normalization, same scoping rules. Inactive panels MUST be
shipped with `class="hidden"` so they start hidden — the
component does not auto-hide on first init for performance and
flash-of-content reasons (see "Init flow" in
[`docs/js/tabs.md`](../../docs/js/tabs.md)).

The panel element's tag is the consumer's choice — `<section>`,
`<article>`, `<div class="panel-body">`. The library's CSS
applies `@include tabs-panel` (`scss/components/_tabs.scss:15`),
which sets padding via `--padding-x` / `--padding-y`. If you
need different padding, rebind those primitives on your own
selector.

### The active-key attribute — `data-ln-tabs-active`

Written by the component, never written by markup at rest. The
component initializes this attribute in `_init()` after deciding
the initial key (default → persisted → hash override, in that
order). After init, it changes only via `_applyActive`, which
fires on `MutationObserver` events triggered by *anything*
writing the attribute — `lnTabs.activate(key)`, click handlers
that set the attribute directly when hash is unchanged, the
`hashchange` listener calling `activate`, or external code /
DevTools writing the attribute manually.

You can read the current key via
`wrapper.getAttribute('data-ln-tabs-active')` from anywhere. The
panel for that key is `wrapper.querySelector('[data-ln-panel="' + key + '"]')`.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-tabs` | wrapper | Creates the instance. Value unused. | Presence creates the component; the active key lives separately on `data-ln-tabs-active` so the create-vs-state concerns don't overlap. |
| `data-ln-tabs-active` | wrapper | The currently active key. **Written by the component**, watched by the observer. | Single source of truth for "which tab is active." Every consumer (API method, click handler, hashchange) funnels into `setAttribute('data-ln-tabs-active', key)`. |
| `data-ln-tabs-default="<key>"` | wrapper | Default key when nothing else picks one. | Falls back to the first `[data-ln-tab]` if absent. Read once at init. |
| `data-ln-tabs-focus="false"` | wrapper | Opt out of auto-focus on the panel's first focusable element. Default: enabled. | Auto-focus is the right default for keyboard-driven workflows; opt-out exists for tabs whose panels open something else (a chart, an iframe) where stealing focus is jarring. |
| `data-ln-tabs-key="<name>"` | wrapper | Hash namespace, when `id` is unsuitable. Falls back to `id` if absent. | Multiple instances rendered from the same template share an `id`-less DOM; `data-ln-tabs-key` lets each one have a distinct namespace. |
| `id="<name>"` | wrapper | Doubles as the hash namespace if `data-ln-tabs-key` is absent. | An `id` is good HTML hygiene (deep-linkable section); reusing it for the namespace avoids a redundant attribute. |
| `data-ln-tab="<key>"` | trigger (`<button>` or `<a>`) | Marks the element as a tab trigger; value is the key. | Explicit; works on any tag. Keys are normalized lowercase. |
| `data-ln-tab` (boolean) | `<a href="#…">` | Opts the anchor in as a trigger; key derives from `href`. | Boolean form valid only on `<a>`. The component picks the fragment whose namespace matches `nsKey`, falling back to the last fragment. |
| `href="#<nsKey>:<key>"` | `<a>` trigger | When `data-ln-tab` is boolean, this is where the key lives. | Required form for shareable deep-link URLs in namespaced tablists. |
| `data-ln-panel="<key>"` | panel | Marks the panel and declares its key. Match against `data-ln-tab` values. | Same — keys, not positions. |
| `data-ln-persist` | wrapper | Opt in to `localStorage` persistence. Boolean form requires `id`; explicit-key form is `data-ln-persist="custom-key"`. **Mutually exclusive with hash sync** — ignored when `id` or `data-ln-tabs-key` is present. | Consumer decides which mechanism owns the persistence: URL (shareable, namespaced), `localStorage` (silent, per-page), or neither (transient). |

That is the entire input attribute surface. `data-active` (on
buttons), `aria-selected` (on buttons), `aria-hidden` (on panels),
`.hidden` (on panels) are output — written by the component, read
by CSS and by you.

## API

### Instance API — on the wrapper element

After `[data-ln-tabs]` initializes, the element carries an `lnTabs`
property pointing to the component instance.

```js
const tabs = document.getElementById('user-tabs');

tabs.lnTabs.activate('settings');   // sets data-ln-tabs-active
tabs.lnTabs.destroy();              // detach listeners, dispatch :destroyed

// Read-only — current key from the DOM, not the instance
tabs.getAttribute('data-ln-tabs-active');

// Direct attribute write — same effect as activate()
tabs.setAttribute('data-ln-tabs-active', 'settings');

// Direct hash write — works when hash sync is enabled
location.hash = 'user-tabs:settings';
location.hash = 'user-tabs:settings&project-tabs:members';
```

`activate(key)` and `setAttribute('data-ln-tabs-active', key)` are
equivalent — both end at `_applyActive(key)` via the observer. Use
whichever reads better in context.

`activate(key)` validates the key against `mapPanels` and falls
back to the default key if the key is unknown — line 91. Writing
the attribute directly to a bogus key produces the same fallback
because `_applyActive` re-runs the same guard at line 96.

### Constructor — `window.lnTabs(root)`

Used only when the document-level `MutationObserver` does not see
new elements (Shadow DOM, iframe documents). For ordinary AJAX
inserts (`innerHTML`, `appendChild`, `replaceChildren`,
templating libraries), the observer auto-initializes new elements.

```js
window.lnTabs(myShadowRoot);
window.lnTabs(myIframeDocument.body);
```

## Events

All events bubble. The detail's `target` (where applicable) is the
wrapper element.

| Event | Cancelable | `detail` | Dispatched when |
|---|---|---|---|
| `ln-tabs:change` | no | `{ key, tab, panel }` | After the active panel has been swapped, ARIA synced, focus moved (if enabled), and `localStorage` written. The pipeline is fully complete. |
| `ln-tabs:destroyed` | no | `{ target }` | After `destroy()` removes click and hashchange listeners and deletes the instance. |

`ln-tabs:change` is the single after-event. There is no
`:before-change` because the activation pipeline has no
cancelable side-effects worth gating — switching tabs writes a few
classes and ARIA flags, all reversible by writing the attribute
back. If you need a "block this navigation" hook (unsaved form
changes in the current panel), wire it on the *trigger* side:
listen for clicks on `[data-ln-tab]`, check whether the current
panel is dirty, and call `event.preventDefault()` plus your own
confirmation flow before allowing the click to bubble.

```js
// Per-section listener
document.getElementById('user-tabs').addEventListener('ln-tabs:change', e => {
    console.log('Active key:', e.detail.key);
    console.log('Tab button:', e.detail.tab);    // DOM element
    console.log('Panel:',      e.detail.panel);  // DOM element
});

// Document-level — every tabs instance on the page
document.addEventListener('ln-tabs:change', e => {
    analytics.track('tab_change', {
        section: e.target.id,
        tab:     e.detail.key,
    });
});
```

## Persistence

Add `data-ln-persist` to a wrapper to remember the active key in
`localStorage` across page loads. **Only effective when hash sync
is OFF** — i.e. when neither `id` nor `data-ln-tabs-key` is
present. With hash sync on, the URL is the source of persistence
and `data-ln-persist` is silently ignored.

### Storage key format

```
ln:tabs:{pagePath}:{id}
```

| Part | Source |
|---|---|
| `ln:tabs:` | Hard-coded prefix. `ln:` is the library prefix; `tabs` is the component name. |
| `{pagePath}` | `location.pathname.toLowerCase()`, trailing slashes stripped, or `/` for root. |
| `{id}` | `data-ln-persist="key"` value if non-empty, else the wrapper's `id` attribute. |

### Restore lifecycle

In `_init()`, after the default key is resolved and the hash
handler does NOT take over (i.e. `hashEnabled === false`):

1. If the wrapper has `data-ln-persist`, call `persistGet('tabs', dom)`.
2. If a saved value exists AND it's a valid key
   (`saved in this.mapPanels`), use it as the initial key.
3. If invalid (panel removed from DOM), fall back to the default
   key silently — no console warning.
4. Call `activate(initialKey)`, which sets `data-ln-tabs-active`
   and triggers `_applyActive`.

### Save lifecycle

In `_applyActive`, after `dispatch('ln-tabs:change')`, if
`data-ln-persist` is present and `hashEnabled === false`:

```js
persistSet('tabs', el, key);
```

The write happens at the end of the pipeline, after all DOM and
event work is done. Saved values are plain strings (the key).

### Hash precedence — explicit

If both `id` (or `data-ln-tabs-key`) and `data-ln-persist` are
present:

| Scenario | Result |
|---|---|
| Clean URL, no `#tabs:key` fragment | Default key is used. `data-ln-persist` is ignored entirely (not read, not written). |
| URL has `#user-tabs:settings` | The hash key wins — settings is activated. `data-ln-persist` still does not write. |
| User clicks a different tab | The hash updates; `data-ln-persist` does not write. |

The two persistence mechanisms are mutually exclusive by design.
Mixing them creates a "which wins on next page load?" question
with no clean answer; making URLs always win removes the
question.

### Missing key — silent skip

```html
<!-- Wrapper has no id and no data-ln-persist value -->
<section data-ln-tabs data-ln-persist>...</section>
```

The persist module logs `[ln-persist] Element requires id or data-ln-persist="key"`
and `persistGet` returns `null`. Tabs work normally without
persistence.

### Storage unavailable — silent fallback

`persistGet` and `persistSet` are wrapped in `try/catch`. Private
browsing, quota-exceeded, disabled storage — none throw. Tabs
work without persistence in any of those scenarios.

## Examples

### Plain tabs, no hash, no persistence

```html
<section data-ln-tabs data-ln-tabs-default="overview">
    <nav>
        <button data-ln-tab="overview">Overview</button>
        <button data-ln-tab="details">Details</button>
    </nav>
    <section data-ln-panel="overview">…</section>
    <section data-ln-panel="details" class="hidden">…</section>
</section>
```

No `id`, no `data-ln-tabs-key`, no `data-ln-persist`. Active key
lives only in `data-ln-tabs-active` on the wrapper. Reload the
page and the default tab is selected — that's intentional for
ephemeral tab UIs (e.g. inside a modal that closes between visits).

### Hash-deep-linkable tabs

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <button data-ln-tab="info">Information</button>
        <button data-ln-tab="settings">Settings</button>
    </nav>
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
</section>
```

Open the page at `/admin/users#user-tabs:settings` → the Settings
tab is active on first paint. Click Information → URL becomes
`/admin/users#user-tabs:info`. Bookmark it, share it, hit the
browser back button — all the URL-as-state benefits.

### Anchor-trigger tabs (shareable links)

Tab buttons can be `<a href="#nsKey:key">` instead of `<button>`. The
URL the user sees in the address bar is the URL they can share, copy,
bookmark, or middle-click to open in a new tab — none of which work
with `<button>` triggers. The `data-ln-tab` attribute is boolean on
anchors; the key derives from the `href`.

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">
    <nav>
        <a href="#user-tabs:info" data-ln-tab>Information</a>
        <a href="#user-tabs:settings" data-ln-tab>Settings</a>
        <a href="#user-tabs:history" data-ln-tab>History</a>
    </nav>
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings" class="hidden">…</section>
    <section data-ln-panel="history" class="hidden">…</section>
</section>
```

When the user clicks an anchor, the click handler calls
`event.preventDefault()` (so the browser's default navigation does
not race with the JS state update), then writes the namespaced hash
format the rest of the component already handles. Right-click → copy
link → paste into a new browser → the right tab is active on first
paint.

**Hash-disabled tablists** (no `id` and no `data-ln-tabs-key`) can
still use `<a>` triggers, but the `href` is decorative — clicking
updates `data-ln-tabs-active` only; the URL stays clean. Use this
pattern when you want the right-click / middle-click affordances of
an anchor without committing to URL deep-linking.

### Multiple independent sections on the same page

```html
<section id="user-tabs" data-ln-tabs data-ln-tabs-default="info">…</section>
<section id="project-tabs" data-ln-tabs data-ln-tabs-default="overview">…</section>
```

Each instance reads only its own namespace from the hash. Hash
format `#user-tabs:settings&project-tabs:members` activates
Settings in the user section AND Members in the project section.
Clicking inside one section preserves the other section's hash
fragment via the `_parseHash` round-trip
(`ln-tabs.js:55-59`).

Both sections can have a tab key called `info` — they live in
separate namespaces, no collision.

### Persistent tabs without hash sync

```html
<section data-ln-tabs data-ln-persist="settings-tabs" data-ln-tabs-default="general">
    <nav>
        <button data-ln-tab="general">General</button>
        <button data-ln-tab="security">Security</button>
        <button data-ln-tab="notifications">Notifications</button>
    </nav>
    <section data-ln-panel="general">…</section>
    <section data-ln-panel="security" class="hidden">…</section>
    <section data-ln-panel="notifications" class="hidden">…</section>
</section>
```

No `id` (so no hash sync), explicit `data-ln-persist="settings-tabs"`
(so the storage key doesn't depend on a generated `id`).
Closes the URL pollution while keeping the user's choice across
page loads. Useful for tab UIs inside a "settings page" where the
user expects "the last tab I had open is the one I'll see when I
come back."

### Programmatic tab switching from external code

```js
// On a successful save, switch back to the overview tab
form.addEventListener('ln-form:success', () => {
    const tabs = document.getElementById('user-tabs');
    tabs.lnTabs.activate('overview');
});
```

Or equivalently:

```js
form.addEventListener('ln-form:success', () => {
    document.getElementById('user-tabs')
        .setAttribute('data-ln-tabs-active', 'overview');
});
```

Both produce identical behaviour — same `_applyActive` call, same
event dispatch, same focus move (if enabled).

### Listen for activation across all tabs

```js
document.addEventListener('ln-tabs:change', e => {
    if (e.detail.key === 'security' && e.target.id === 'user-tabs') {
        loadSecurityAuditLog(e.detail.panel);
    }
});
```

`ln-tabs:change` bubbles, so a single document listener can
delegate. Filter by `e.target.id` (the wrapper's id) and
`e.detail.key` (the active key).

### Lazy-load panel content on first activation

```js
const loaded = new Set();

document.addEventListener('ln-tabs:change', async e => {
    const key = e.detail.key;
    const panel = e.detail.panel;
    const cacheKey = e.target.id + ':' + key;

    if (loaded.has(cacheKey)) return;
    loaded.add(cacheKey);

    if (panel.dataset.lazy) {
        const html = await fetch(panel.dataset.lazy).then(r => r.text());
        panel.innerHTML = html;
    }
});
```

Mark each lazy panel with `data-lazy="/api/panels/foo"`; the
listener fetches once on first activation, populates the panel,
and remembers it. ln-tabs itself stays out of this — it just
tells you the active tab changed.

### Reset on a "reset filters" button

```js
document.getElementById('reset-filters').addEventListener('click', () => {
    document.getElementById('user-tabs').lnTabs.activate('info');  // back to default
});
```

If the wrapper has `data-ln-persist`, this also overwrites the
persisted value (which is correct — the user's "reset" intent
should win over the previous session).

## Common mistakes

### Mistake 1 — Tab buttons inside a `<form>` without `type="button"`

```html
<!-- WRONG — clicking a tab submits the form -->
<form>
    <section data-ln-tabs>
        <nav>
            <button data-ln-tab="info">Information</button>
            <button data-ln-tab="settings">Settings</button>
        </nav>
        …
    </section>
    <button type="submit">Save</button>
</form>
```

The HTML default for `<button>` is `type="submit"`. A tab click
inside a form will submit the form before the tab handler ever
runs (or after — the order is undefined and varies by browser).
Either way, the page navigates and the tab change is
imperceptible.

```html
<!-- RIGHT — tab buttons explicitly opt out of submit -->
<button type="button" data-ln-tab="info">Information</button>
<button type="button" data-ln-tab="settings">Settings</button>
```

This is the same trap as cancel/close buttons in `ln-modal` — see
[`CLAUDE.md`](../../CLAUDE.md) "Modal Architecture" for the
canonical wording.

### Mistake 2 — Forgetting `class="hidden"` on inactive panels

```html
<!-- WRONG — every panel renders on first paint -->
<section data-ln-tabs data-ln-tabs-default="info">
    <nav>…</nav>
    <section data-ln-panel="info">…</section>
    <section data-ln-panel="settings">…</section>
</section>
```

Until the component initializes (DOMContentLoaded → `_init` →
`activate(defaultKey)` → `_applyActive` → toggle `.hidden`), all
panels are visible. The user sees a flash of all-panels-stacked
before they collapse to one. Ship inactive panels with
`class="hidden"` — they start hidden, the active panel's
`.hidden` class is removed by `_applyActive`, the inactive
panels' `.hidden` is preserved.

```html
<!-- RIGHT — inactive panels start hidden -->
<section data-ln-panel="info">…</section>
<section data-ln-panel="settings" class="hidden">…</section>
```

Note: The library's `[data-ln-tabs] [data-ln-panel].hidden`
selector (`scss/components/_tabs.scss:19`) applies `display:
none`. The `.hidden` utility from `scss/utilities/_helpers.scss`
is the same `display: none`; either source produces the same
effect.

### Mistake 3 — Mixing hash sync and `data-ln-persist`

```html
<!-- WRONG — assumes both will work together -->
<section id="user-tabs" data-ln-tabs data-ln-persist>…</section>
```

The `id` enables hash sync, which **disables** `data-ln-persist`.
Reload the page at `/admin#user-tabs:settings` and Settings is
restored — but only because of the URL, not because of
`localStorage`. Reload at `/admin` (no hash) and you get the
default tab, not the previously-active tab. The mismatch is
silent.

If you want URL deep-linking, use only `id`. If you want silent
persistence, use only `data-ln-persist` and remove `id` (or
generate a synthetic key with `data-ln-persist="my-key"`).

### Mistake 4 — Putting tab keys in the URL hash that conflict with hash routing

```
/app#/users/42  ← hash routing
/app#user-tabs:settings  ← ln-tabs hash sync
```

If your project has a hash-based SPA router, both subsystems
write to `location.hash`. ln-tabs splits on `&` for fragments
and on the first `:` per fragment, so a router fragment like
`#/users/42` is parsed as a fragment with key `/users` and value
`42` — unlikely to match any of your tab namespaces, so it would
be silently ignored. But if your router writes
`#user-tabs:something-else`, that DOES match and ln-tabs will
activate `something-else` (or fall back to default if it's not a
known key).

Decide at the project level: either use ln-tabs hash sync OR a
hash router, not both. If you must coexist, omit `id` /
`data-ln-tabs-key` from your tabs and use `data-ln-persist`
instead — tabs write to `localStorage`, hash router writes to the
URL, no overlap.

### Mistake 5 — Counting on the active panel being in the DOM during `ln-tabs:change`

```js
document.addEventListener('ln-tabs:change', e => {
    e.detail.panel.querySelector('input').focus();   // panel is the new active one
});
```

`e.detail.panel` IS the new active panel and it IS un-hidden by
the time the event fires (the dispatch is the last step in
`_applyActive`, line 117, after the `.hidden` toggle on line
110). This usage is correct — but a related pitfall is querying
*which panel is active* from a `click` listener on a tab button:

```js
// WRONG — at click time, the attribute hasn't been updated yet
document.getElementById('settings-tab').addEventListener('click', () => {
    const active = wrapper.getAttribute('data-ln-tabs-active');   // STALE
});
```

The click handler that ln-tabs attaches and your project's click
handler run in attach-order. If yours runs first, the attribute
is still the previous value. Listen for `ln-tabs:change` instead
of inferring from the click — by the time `:change` fires,
everything is settled.

### Mistake 6 — Programmatically adding tabs after init

```js
// Adds a new tab button + matching panel, expecting it to "just work"
nav.insertAdjacentHTML('beforeend', '<button data-ln-tab="new">New</button>');
wrapper.insertAdjacentHTML('beforeend', '<section data-ln-panel="new" class="hidden">…</section>');
```

The instance's `tabs[]`, `panels[]`, `mapTabs{}`, `mapPanels{}`
were populated at `_init` — adding new elements to the DOM does
not retroactively register them. The `MutationObserver` at the
component level watches for `[data-ln-tabs]` (the wrapper)
appearing or its `data-ln-tabs-active` attribute changing — it
does NOT watch for new `[data-ln-tab]` / `[data-ln-panel]`
children inside an already-initialized wrapper.

Activate the new key via `el.lnTabs.activate('new')` and the
guard at line 91 falls back to the default key because `'new'`
is not in `this.mapPanels`. Click the new tab button and
nothing happens — its click handler was never attached because
`_init` already ran on the original tabs.

**To add tabs dynamically**, destroy and re-init:

```js
const wrapper = document.getElementById('user-tabs');
wrapper.lnTabs.destroy();
// (modify the DOM)
window.lnTabs(wrapper.parentElement);   // or just `wrapper`
```

Or, more cleanly, replace the entire wrapper subtree — the
document-level observer will see the new wrapper appear and
auto-init it.

### Mistake 7 — Removing the active panel while it's active

```js
// WRONG — orphan active key
const wrapper = document.getElementById('user-tabs');
wrapper.querySelector('[data-ln-panel="settings"]').remove();
// data-ln-tabs-active is still "settings", but the panel is gone
```

`_applyActive` iterates `this.mapPanels`, which was populated at
init — it doesn't notice that the DOM element it points to is
detached. The next activation will fall back to default if a
caller writes a different key, but until then the wrapper is in
a weird state where the active key references a removed panel.

If you need to remove the active panel, switch to a different
tab first:

```js
wrapper.lnTabs.activate('info');  // first, swap away
wrapper.querySelector('[data-ln-panel="settings"]').remove();
// then re-init if you also removed the corresponding [data-ln-tab]
```

### Mistake 8 — Putting `data-ln-tabs` on `<main>`

```html
<!-- WRONG — HTML spec allows only one <main> per page -->
<main data-ln-tabs>…</main>
```

`<main>` is a singleton. The library's `[data-ln-tabs]` selector
doesn't enforce this, but ARIA and screen readers will be
confused by multiple main landmarks. Use `<section>`, `<aside>`,
`<article>`, or `<div>`.

### Mistake 9 — Auto-focus stealing focus mid-typing

The default behavior is `data-ln-tabs-focus="true"`: after
activating a tab, the first focusable element in the new panel
is focused (line 113-116). For most flows this is correct
(keyboard users move from the tablist into the panel content).
But two scenarios produce friction:

1. **Tabs opened via deep-link to a panel containing a search
   input.** The page loads, `_init` calls `activate(defaultKey)`,
   the search input gets focus, and the user (who was about to
   type into the URL bar or a global search) finds their
   keystrokes redirected to a field they didn't see yet. Opt out
   with `data-ln-tabs-focus="false"`.
2. **Tabs whose panels host charts or iframes.** The first
   focusable element might be a hidden iframe element, a chart
   tooltip control, or a non-obvious target. Opt out with
   `data-ln-tabs-focus="false"` and focus a specific element
   yourself on `ln-tabs:change` if needed.

The `setTimeout(..., 0)` (line 115) defers the focus to the next
microtask so the panel is fully shown before focus moves —
necessary because focusing an element inside a `display: none`
panel does nothing.

### Mistake 10 — Expecting keyboard arrow nav

ln-tabs does not implement Arrow Left/Right or Home/End keyboard
navigation between tabs. Tab key cycles through tab buttons via
the browser's default focus order; Enter / Space activates the
focused tab via the browser's default click behavior. Arrow nav
is a WAI-ARIA enhancement, not a baseline. If your accessibility
audit requires it, wire it on the consumer side:

```js
document.querySelectorAll('[data-ln-tabs]').forEach(wrapper => {
    const tabs = Array.from(wrapper.querySelectorAll('[data-ln-tab]'));
    wrapper.addEventListener('keydown', e => {
        if (!e.target.matches('[data-ln-tab]')) return;
        const i = tabs.indexOf(e.target);
        let next = -1;
        if (e.key === 'ArrowLeft')  next = (i - 1 + tabs.length) % tabs.length;
        if (e.key === 'ArrowRight') next = (i + 1) % tabs.length;
        if (e.key === 'Home')       next = 0;
        if (e.key === 'End')        next = tabs.length - 1;
        if (next === -1) return;
        e.preventDefault();
        tabs[next].focus();
        tabs[next].click();   // activates via the existing click handler
    });
});
```

This is small enough to live in project code and does not warrant
a library-level abstraction.

### Mistake 11 — Forgetting `nsKey` when using anchor triggers in a multi-tablist page

Two tablists on the same page, both with `<a>` triggers but no `id` /
`data-ln-tabs-key`. The shared URL fragment can't distinguish which
tablist the link refers to — the parser will activate the same key on
the first matching tablist. Anchor triggers in multi-tablist pages
require an `id` (or `data-ln-tabs-key`) on each wrapper so the URL
fragment is namespaced (`#user-tabs:settings&project-tabs:members`).
Single-tablist pages are fine without `nsKey`.

## Related

- **[`ln-toggle`](../ln-toggle/README.md)** — the binary
  open/close primitive. ln-tabs and ln-toggle are deliberately
  separate state machines; see "Why not ln-toggle" above for the
  architectural argument. If you have a list of collapsibles
  where exactly one should be open at a time, use
  `ln-accordion` (which IS built on ln-toggle). If you have
  N-way exclusive panels with hash deep-linking, use ln-tabs.
- **[`ln-accordion`](../ln-accordion/README.md)** — single-open
  coordinator built on ln-toggle. Useful contrast: accordion
  enforces single-open after the fact (each toggle opens
  independently, accordion closes the others on `:open` bubble);
  tabs enforce single-active by construction (one attribute, one
  active key).
- **[`ln-modal`](../ln-modal/README.md)** — also has its own
  state machine separate from ln-toggle (modals own ESC + scrim
  + focus trapping). Same pattern: a piece of UI that feels
  "open/close-shaped" but ships with a different attribute
  surface because it needed a different contract.
- **`@mixin tabs-nav`, `@mixin tabs-tab`, `@mixin tabs-panel`**
  (`scss/config/mixins/_tabs.scss`) — the visual recipe.
  Underline-style tabs by default; the active tab gets
  `[data-ln-tab][data-active] { border-bottom-color:
  var(--color-accent); }`.
- **`scss/components/_tabs.scss`** — applies the mixins to the
  default selectors and adds the `.hidden` rule for inactive
  panels.
- **Architecture deep-dive:** [`docs/js/tabs.md`](../../docs/js/tabs.md)
  for component internals — observer wiring, the
  hash-round-trip codepath, why `_applyActive` is private to
  the observer.
- **Cross-cutting principle:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  for the broader "attributes-as-contract" pattern that ln-tabs
  embodies even though it sits outside the data-flow pipeline.
