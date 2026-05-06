# toggle — architecture

> The primitive that defines ln-ashlar's attribute-as-contract pattern. Every consumer of toggle state — internal API, trigger click, sibling component, external script, DevTools — funnels through one `setAttribute` call into one `MutationObserver` callback that runs the entire open/close pipeline.

The implementation lives in
[`js/ln-toggle/ln-toggle.js`](../../js/ln-toggle/ln-toggle.js).
This document covers internals — instance state, attribute observer
wiring, event lifecycle, persistence semantics, and the design
decisions that produced this particular shape. For
consumer-facing usage see
[`js/ln-toggle/README.md`](../../js/ln-toggle/README.md).

## Where this sits in the layered architecture

`ln-toggle` is not part of the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It
is a UI primitive, not a data, submit, render or validate layer.
But it is the canonical embodiment of the cross-cutting principles
that data-flow §10–§11 describe:

- **Markup-driven state.** Open/closed lives in the
  `data-ln-toggle` attribute on the panel element, not in JS state
  with attribute as a side-effect. The component's `isOpen` field
  is a *cache* of the attribute, kept up-to-date by the observer,
  used only to skip no-op transitions.
- **Attribute is the contract.** Every consumer that wants to change
  the state writes the attribute. The component exposes no public
  state-mutating method — there is no second path. `setAttribute`,
  `MutationObserver`, `_syncAttribute`. One channel.
- **MutationObserver-mediated reaction.** State application
  (the `.open` class, aria sync, persistence write, post-event
  dispatch) happens inside `_syncAttribute`, which is called *only*
  by the observer. There is no second codepath into state
  application.
- **No `document.querySelectorAll` post-init for the component
  itself.** The component is initialized via `registerComponent`,
  which handles the document-level
  observer pattern. The only document-scope queries are
  `_syncTriggerAria` walking matching `[data-ln-toggle-for]`
  elements (necessary because triggers can live anywhere) and
  `destroy()` cleaning up listeners on those triggers (same
  reason).

The component does not import any other library component. It
imports `registerComponent`, `dispatch`, `dispatchCancelable` from
`ln-core/helpers.js`, and `persistGet` / `persistSet` from
`ln-core/persist.js`. That is the entire dependency graph.

Components that consume ln-toggle (`ln-accordion`, `ln-dropdown`)
reach in two ways: by listening for `ln-toggle:open` /
`ln-toggle:close` events, and by writing `data-ln-toggle="..."` on
the panel element. Neither requires importing or instance-lookup;
both are visible through the DOM and the event system.

## Internal state

Each instance is the object created by `_component(dom)` and stored
as `dom.lnToggle`. The state surface is two fields:

| Field | Set by | Read by |
|---|---|---|
| `dom` | constructor | `destroy` (event dispatch target, listener detach) |
| `isOpen` | constructor and `_syncAttribute` | `_syncAttribute` (transition-needed comparison); also exposed as a read-only property on the instance for ergonomic external reads. |

That is the entirety of the per-instance state. There is no:

- Cached array of trigger elements (re-queried on every aria sync
  and on destroy)
- Cached previous-attribute-value for revert (revert writes a
  literal `"open"` / `"close"` based on the inverse of the failed
  transition)
- Saved persistence-key (resolved on every `persistGet` /
  `persistSet` call)
- Internal timer or queue (no debouncing, no batching — every
  attribute change runs the pipeline immediately)

Re-querying triggers on each state change is acceptable because
(a) state changes are user-driven, not high-frequency, (b) the
matching set is small (typically 1-3 triggers per panel), and
(c) caching would require hooking into trigger-side mutation events
to keep the list fresh — the simplicity trade-off favours
re-querying.

## Init flow

1. `registerComponent('data-ln-toggle', 'lnToggle', _component, 'ln-toggle', { extraAttributes: ['data-ln-toggle-for'], onAttributeChange: _syncAttribute, onInit: _attachTriggers })`
   on script load.
2. `registerComponent` performs an initial `findElements` scan of
   `document.body` for `[data-ln-toggle]` and instantiates
   `_component(el)` for each match. It also calls `_attachTriggers(document.body)`
   via the `onInit` hook.
3. The `MutationObserver` (set up by `registerComponent`) starts
   watching `document.body` for:
   - `childList` (subtree add) — re-runs `findElements` and
     `_attachTriggers` on the added node.
   - `attributes` filtered to `data-ln-toggle` and
     `data-ln-toggle-for` — for `data-ln-toggle` changes on
     existing instances, calls `_syncAttribute` (the state
     transition); for everything else (new attribute on a
     previously-untracked element, new trigger added), calls
     `findElements` + `_attachTriggers` to upgrade the new
     element.
4. `_component(dom)`:
   - Stores `this.dom = dom`.
   - **Persistence restore**: if
     `dom.hasAttribute('data-ln-persist')`, calls
     `persistGet('toggle', dom)`. If it returns a non-null
     saved value, calls `dom.setAttribute(DOM_SELECTOR, saved)`.
     This `setAttribute` happens *inside the constructor* — the
     observer is already registered (from step 3), so the
     attribute change *will* trigger an observer callback. But
     when that callback runs `_syncAttribute`, it reads
     `el[DOM_ATTRIBUTE]`, which at that moment is `undefined`
     (the constructor hasn't returned yet), and returns early.
     The pipeline does not run during restore.
   - Reads the (possibly restored) attribute value and sets
     `this.isOpen = dom.getAttribute(DOM_SELECTOR) === 'open'`.
   - If `isOpen`, adds the `.open` class.
   - Calls `_syncTriggerAria(dom, this.isOpen)` to set the
     initial `aria-expanded` on every matching trigger.

After construction, the instance is registered on the element
(`el[DOM_ATTRIBUTE] = instance`, done by `findElements` in
`ln-core/helpers.js`). From this point forward, the observer
handles all state changes through `_syncAttribute`.

No `:open` event fires during init, even if the panel is
server-rendered open. That is intentional — the
attribute is **already** in its final state at init; there has
been no transition. Consumers that want to react to "the page just
loaded with this panel open" should listen for `ln-store:ready` (if
they care about data being present) or scan `[data-ln-toggle="open"]`
themselves.

### Trigger attachment

`_attachTriggers(root)` is called from two places:
the `onInit` hook on every observer callback that adds nodes or
mutates non-state attributes, and on initial scan. It:

1. Collects every `[data-ln-toggle-for]` inside `root`, plus
   `root` itself if it carries the attribute.
2. For each trigger, if `btn[DOM_ATTRIBUTE + 'Trigger']` is
   already set, skip — already attached. This is the duplicate-listener
   guard for re-fires.
3. Define `handler`: on click, ignore modifier keys
   (`ctrlKey || metaKey || button === 1` — preserves browser-native
   open-in-new-tab semantics on `<a>`-shaped triggers, future-proofs
   for new-window patterns even on `<button>`), `preventDefault`,
   resolve the target by ID, and write `data-ln-toggle` directly:
   `"open"` for `data-ln-toggle-action="open"`, `"close"` for
   `data-ln-toggle-action="close"`, or the inverse of the current
   attribute value for the default `"toggle"` action. Unknown action
   values silently no-op. If target or instance is missing, return
   silently.
4. `addEventListener('click', handler)` and stash the handler on
   the button (`btn[DOM_ATTRIBUTE + 'Trigger'] = handler`) for
   later removal in `destroy`.
5. Read the current target state (if the target's instance
   exists) and set `aria-expanded` on this trigger immediately —
   so a trigger added to the DOM after its target was already
   open shows the right state without waiting for the next
   transition.

## State transition flow

When any consumer writes `data-ln-toggle="open"` or `"close"` on a
panel element, the `MutationObserver` (registered by
`registerComponent`) fires. The observer's logic distinguishes
between attribute changes on already-instantiated elements (state
transition) and attribute changes that should trigger upgrade
(new instance):

```
mutation.type === 'attributes'
mutation.attributeName === 'data-ln-toggle'

  ↓

if (onAttributeChange && mutation.target[attribute] && isMainAttr)
    → _syncAttribute(mutation.target, mutation.attributeName)
else
    → findElements(mutation.target, ...) + _attachTriggers(...)
```

So `_syncAttribute` only runs when the element already has an
`lnToggle` instance. For a brand-new element that just got the
attribute (e.g. `el.setAttribute('data-ln-toggle', 'open')` on an
element that previously had no toggle attribute), the observer
takes the upgrade path: `findElements` instantiates `_component`,
which reads the attribute as initial state, adds the `.open`
class, syncs aria. No `:before-open` cancelable runs in that case
— init is not a transition.

### `_syncAttribute(el)`

```
1. Look up instance: const instance = el[DOM_ATTRIBUTE]
   If missing, return. (Defensive — the observer's gate above
   already ensures this, but the function is also safe to call
   directly if someone wants to.)

2. Read attribute: const value = el.getAttribute(DOM_SELECTOR)
   Compute desired state: const shouldBeOpen = value === 'open'

3. Compare to instance.isOpen.
   If shouldBeOpen === instance.isOpen, return — no transition
   needed.

4. Branch on direction:

   IF shouldBeOpen (we want to open):
     a. dispatchCancelable('ln-toggle:before-open', { target: el })
     b. If preventDefault was called:
        - Revert: el.setAttribute(DOM_SELECTOR, 'close')
        - Return. (The revert re-fires the observer, but step 3
          comparison shows no change — instance.isOpen is still
          false — so the second observation is a no-op.)
     c. instance.isOpen = true
     d. el.classList.add('open')
     e. _syncTriggerAria(el, true) — set aria-expanded="true" on
        every [data-ln-toggle-for="<el.id>"] trigger
     f. dispatch('ln-toggle:open', { target: el })
     g. If el.hasAttribute('data-ln-persist'):
        persistSet('toggle', el, 'open')

   ELSE (we want to close):
     a-g. Mirror image — :before-close cancelable, revert to
          'open' on cancellation, otherwise:
          isOpen = false, remove .open, sync aria to false,
          dispatch :close, persist 'close'.
```

The order inside step 4 is deliberate. Each piece happens before
the next:

1. **Cancelable dispatches first** — listeners see `instance.isOpen` at its **current** (pre-transition) value, so a listener that vetoes the transition can compare against where the system *is*, not where it's headed.
2. **Class flips second** — so a CSS rule reading the class lands
   after the (non-canceled) cancelable.
3. **Aria sync third** — so the trigger's `aria-expanded` updates
   *before* the post-event fires. Listeners on `:open` reading
   the trigger's aria see the new state.
4. **Post-event dispatches fourth** — full DOM state is settled
   when listeners run.
5. **Persistence writes last** — after the in-DOM transition is
   complete. If a `:open` listener throws, persistence still
   runs (the dispatch does not bubble exceptions out of the
   observer callback in the platform's CustomEvent dispatch
   semantics — the `dispatch` helper does not catch). This is fine in
   practice; persistence reflects "the DOM agreed to open," not
   "every listener completed without error."

### Cancelable revert — why it's safe

Cancellation reverts the attribute by writing the inverse value
(`'close'` for a canceled open, `'open'` for a canceled close).
That `setAttribute` call fires the observer, which re-enters
`_syncAttribute`. But:

- `instance.isOpen` was never updated (it gets set in step 4c, not
  before).
- The reverted attribute value matches the original (pre-transition)
  state.
- Step 3's comparison
  (`shouldBeOpen === instance.isOpen`) is `true`, so the function
  returns at step 3 — the second observation is a quiet no-op.

No infinite loop. No duplicate event. No cleanup state to maintain
in the listener.

### `_syncTriggerAria(panelEl, isOpen)`

Document-scoped query for every
`[data-ln-toggle-for="<panelEl.id>"]`, then `setAttribute('aria-expanded',
isOpen ? 'true' : 'false')` on each. Document-scoped because triggers
can live anywhere — a
trigger in the page header for a sidebar in the page footer, a
trigger inside a modal for a panel outside, etc. The query runs
on every state change; for typical page sizes this is sub-microsecond
work. There is no need to cache.

The `aria-expanded` attribute drives two things:

- **Screen reader announcement.** Pressing the trigger speaks
  "expanded" / "collapsed."
- **CSS chevron rotation.** The library's
  `[data-ln-toggle-for][aria-expanded="true"] .ln-chevron { transform: rotate(180deg); }`
  rule (`scss/components/_toggle.scss`) rotates any chevron
  icon inside any matching trigger. This works for any toggle
  shape — accordion, standalone, dropdown — without DOM-proximity
  requirements.

Called from three sites:

1. `_component(dom)` — init, so server-rendered open panels
   start with `aria-expanded="true"` on triggers. No flash.
2. `_syncAttribute` — every transition, before the post-event.
3. `_attachTriggers` — when a trigger is added to the DOM after
   its target's instance already exists (AJAX content,
   teleport). The trigger inherits the current state on attach.

## Persistence

Persistence is opt-in via `data-ln-persist` on the panel.
Mechanics live in `js/ln-core/persist.js`; ln-toggle is a thin
caller.

### Key derivation

`persist.js:_resolveKey('toggle', el)` builds the key from four parts:

| Part | Source |
|---|---|
| `'ln:'` | `PREFIX` constant. Library-wide namespace. |
| `'toggle'` | Component name passed by the caller. |
| `_pageKey()` | `location.pathname.toLowerCase()`, trailing slashes stripped, or `/` for root. |
| `id` | `data-ln-persist="key"` value if non-empty, else `el.id`. |

Path-scoping is non-overrideable. Two pages with the same panel
`id` get two different keys; the user's sidebar state on
`/admin/users` does not affect their sidebar state on
`/admin/clients`.

### Restore — constructor path

The constructor calls `persistGet('toggle', dom)` and,
if a saved value is found, applies it via `dom.setAttribute(DOM_SELECTOR, saved)`,
then re-reads the attribute to set `this.isOpen`. The `setAttribute` happens inside the constructor, before the
observer can react meaningfully (the instance is not yet stored on
the element — `el[DOM_ATTRIBUTE]` is `undefined` until
`findElements` assigns it). Even if the observer fires for the
attribute change, `_syncAttribute`'s
`if (!instance) return` guard catches it. The pipeline does not
run during restore — there's no `:before-open` that could veto the
restore, no `:open` event for a transition that didn't happen
visually.

After the `setAttribute`, the constructor reads the attribute
fresh and computes `this.isOpen`. From there, the rest of init
proceeds as if the markup had said `data-ln-toggle="open"` (or
`"close"`) all along.

### Save — `_syncAttribute` path

After the transition completes, if
`data-ln-persist` is present, `persistSet('toggle', el, 'open' | 'close')`
is called. Save runs *after* the post-event dispatches. If a listener
on `:open` calls `e.detail.target.removeAttribute('data-ln-persist')`
synchronously, the persist write does not happen — the
`hasAttribute` check is re-evaluated after dispatch. (Edge case;
not common.)

### Storage failure — silent

`persistGet` and `persistSet` wrap their `localStorage` calls in
`try/catch` and silently swallow exceptions. Private browsing, quota-exceeded, disabled storage —
the toggle continues to work without persistence; no error surfaces
to the consumer.

The `[ln-persist]` console warning fires once per init for elements
that opt in but lack a key. That is the only diagnostic emitted by
the persistence path.

## API surface

### Constructor — `window.lnToggle(root)`

`registerComponent` registers the constructor on
`window[DOM_ATTRIBUTE]` (`window.lnToggle`). Calling it triggers
`findElements(root, ...)` + `onInit(root)` for the given root —
useful for Shadow DOM, iframes, or any context the document-level
observer doesn't see.

For ordinary AJAX inserts and `setAttribute` toggles on existing
elements, the document-level observer handles upgrade automatically.
The window constructor is escape-hatch only.

### Instance API

| Method / property | Body | Notes |
|---|---|---|
| `isOpen` | Boolean — last applied state. Set by `_syncAttribute`. | Read-only by convention; mutating it directly desyncs from the attribute and breaks the next transition's no-op check. Internally used by `_syncAttribute` to skip no-op transitions. |
| `dom` | The panel element. | Set in constructor. |
| `destroy()` | Guard against double-destroy, dispatch `:destroyed`, find every `[data-ln-toggle-for="<id>"]` trigger and remove its click listener (using the stashed handler reference), `delete this.dom[DOM_ATTRIBUTE]`. | Does NOT remove the `data-ln-toggle` attribute or the `.open` class. The element remains visually as it was; only the JS coupling is severed. To dispose entirely, follow `destroy()` with `removeAttribute('data-ln-toggle')` and `classList.remove('open')` from the consumer side. |

The component exposes no state-mutating method. The attribute is the
only path: `el.setAttribute('data-ln-toggle', 'open' | 'close')`.
Trigger click, sibling component, external script, DevTools — all write
the attribute and let the observer run `_syncAttribute`. There is no
imperative API to bypass.

## Event lifecycle

### Outbound — what the component dispatches

| Event | Bubbles | Cancelable | `detail` | Dispatched at |
|---|---|---|---|---|
| `ln-toggle:before-open` | yes | **yes** | `{ target: HTMLElement }` | After attribute flips to `"open"`, before `instance.isOpen` flip and `.open` class addition. |
| `ln-toggle:open` | yes | no | `{ target: HTMLElement }` | After `.open` class added, after `aria-expanded` synced, before persist write. |
| `ln-toggle:before-close` | yes | **yes** | `{ target: HTMLElement }` | After attribute flips to `"close"`, before `isOpen` flip and `.open` class removal. |
| `ln-toggle:close` | yes | no | `{ target: HTMLElement }` | After `.open` class removed, after `aria-expanded` synced, before persist write. |
| `ln-toggle:destroyed` | yes | no | `{ target: HTMLElement }` | First action inside `destroy()`, before listener detach and instance delete. |

`detail.target` is always the **panel element**. Even when the
event reaches a wrapper coordinator like ln-accordion, the target
is the panel that opened/closed, not the wrapper.

### Inbound — what the component listens to

The component does not listen to any events of its own. State
transitions are driven by the `MutationObserver` (which is set up
by `registerComponent`, not by the component itself); trigger
clicks are wired in `_attachTriggers`.

The trigger handler listens for `click` only — no
`keydown`, no `submit`, no `keypress`. `<button>` triggers fire
`click` for both mouse and keyboard activation (Space/Enter), so
keyboard accessibility is automatic. `<header>` triggers (the
common accordion pattern) require the `<header>` to be focusable
and to have its own keyboard handling for keyboard support — but
the click listener works fine for mouse, and screen readers
announce `aria-expanded` regardless. Most accordion implementations
in real projects work with the default click-only behavior;
projects with strict keyboard requirements should put a
`tabindex="0"` and a `role="button"` on the `<header>` plus a
`keydown` handler that maps Space/Enter to `.click()`.

### What the component does NOT listen for

- **No keyboard.** No ESC handler, no Space/Enter on the panel itself. Consumers wire ESC at the document level if needed.
- **No outside click.** No document-level click listener.
  Consumers wrap with `ln-dropdown` if they need menu-style
  outside-click-closes.
- **No focus.** No focus management on open. Consumers wrap with
  `ln-modal` if they need focus trap on open + restore on close.
- **No resize.** No window-size listener. Consumers
  (`ln-dropdown` for menu reposition / close) wire those.

This omission is the explicit philosophy: ln-toggle is the
state primitive, not a behavioral kitchen sink. Each behavioral
add-on lives in its own small component that consumes the
primitive.

## Cross-component contract

Other components in the library reach into ln-toggle's contract in
two ways:

### 1. Listen for `ln-toggle:open` / `:close`

```
ln-accordion        — listens on its wrapper
ln-dropdown         — listens on its inner [data-ln-toggle]
```

`ln-accordion` listens at the wrapper for the bubbled event from
any descendant panel. It uses the event to identify which panel
just opened, then writes `data-ln-toggle="close"` on every other
open sibling.

`ln-dropdown` listens directly on the inner toggle element for both
`:open` and `:close`. On `:open`, it teleports the menu to
`<body>`, adds outside-click and resize-close listeners, sets
`aria-expanded="true"` on the trigger button, and dispatches its
own `ln-dropdown:open`. On `:close`, it reverses the teleport,
removes the listeners, sets `aria-expanded="false"`, and dispatches
`ln-dropdown:close`.

In both cases, the consuming component is **reactive** — it does
not initiate the open/close. It reacts to the user's click on a
trigger or to external code writing the attribute.

### 2. Write `data-ln-toggle="..."` directly

```
ln-accordion        — writes 'close' on siblings
ln-dropdown         — writes 'close' from outside-click
                    — writes 'close' from resize-close
ln-modal/cancel     — does NOT use ln-toggle; ln-modal owns its own attribute (data-ln-modal)
```

The attribute is the only state-change path. Three concrete properties of
that contract:

1. **Cancelable events still fire.** A `:before-close` listener that
   calls `preventDefault()` halts the close. The consumer participates
   in the state machine through the same channel as every other caller
   — the attribute. There is no private mutator that bypasses it.
2. **Persistence writes naturally.** When a sibling closes via
   `ln-accordion`'s cascade, its `data-ln-persist` write fires
   from the toggle's own close handler. The accordion knows
   nothing about persistence.
3. **One audited path.** Every state change goes through
   `_syncAttribute`. Bugs in the pipeline manifest in one place;
   tests cover one path.

The corollary: there is no "private" mutator. Imperative API,
trigger click, sibling component, external script — all write the
attribute. ln-toggle's design assumes you can grep for
`data-ln-toggle` to find every place state changes; if a future
consumer reaches around the attribute, that grep stops being
truthful and the system becomes harder to reason about.

## Performance considerations

State transitions are sub-millisecond on weak mobile CPUs. The
observer's `attributeFilter` skips irrelevant attribute writes,
`_syncTriggerAria` runs a document-scoped `querySelectorAll` over a
typically small (1–3) trigger set, and `localStorage.setItem` is
synchronous but invisible at human-interaction frequency. There is
no virtualisation, debouncing, or batching — none is needed at this
scale.

## Why not X?

### Why not `<details>` / `<summary>`?

The library's collapse animation requires
`grid-template-rows: 0fr ↔ 1fr` transitions on a controllable
parent — `<details>` does not expose the geometry needed for a
smooth open/close animation across browsers. The native element's
open/close is binary with no transition surface. There is also no
clean way to attach a cancelable "before-open" event to it; the
`toggle` event fires after the state has already changed.

For sidebar drawers, dismissible alerts, dropdown menus — none of
which is a "summary + details" content shape — the native element
is also semantically wrong. ln-toggle is general-purpose; the
`<details>` element is content-specific.

### Why does `:before-open` fire *after* the attribute flips, not before?

Because the cancelable signal is "the system noticed someone wants
to change state." The attribute flip is what the *signal* is. If
`:before-open` fired before the attribute flip, the listener would
have to inspect the trigger or the call site to know what's about
to happen — much harder API surface.

The revert on cancellation costs one extra observer round-trip.
That is cheap, and the revert is a no-op for `instance.isOpen`
purposes (step 3's comparison catches it). The simpler API wins.
