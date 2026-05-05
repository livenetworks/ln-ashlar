# accordion — architecture

> Turns a list of `ln-toggle` panels into a single-open group, by listening for one bubbled event and writing to one attribute.

The implementation lives in
[`js/ln-accordion/ln-accordion.js`](../../js/ln-accordion/ln-accordion.js).
This document covers internals — instance state, render flow, event
lifecycle, and the design decisions that produced this particular
shape. For consumer-facing usage see
[`js/ln-accordion/README.md`](../../js/ln-accordion/README.md).

## Where this sits in the layered architecture

`ln-accordion` is not part of the data-flow pipeline described in
[`docs/architecture/data-flow.md`](../architecture/data-flow.md). It
is a UI-coordination component, not a data, submit, render or
validate layer. But it embodies the same cross-cutting principles:

- **Markup-driven state.** Open/closed is `data-ln-toggle="open"` on
  the panel element. The accordion does not store "which panel is
  open" in JS state.
- **Attribute is the contract.** Cross-component coordination happens
  by writing the attribute, not by calling methods on instances. See
  data-flow §10.2 — "store accepting `request-create` events from
  anywhere" is a generalisation of the same anti-pattern this
  component avoids.
- **MutationObserver-mediated init.** Component upgrade goes through
  `registerComponent` (in `ln-core/helpers.js`), which uses the
  document-level observer pattern from data-flow §11.
- **No `document.querySelectorAll` post-init.** Runtime work iterates
  scoped descendants of the wrapper, never the whole document. See
  Render flow below.

The component does not import or require any other library
component at runtime. It does require `ln-toggle` to be loaded so
that the events it listens to actually get dispatched — but that's a
coupling at the consumer side (loading order, see js/index.js), not
in the source.

## Internal state

Each instance is the object created by `_component(dom)` and stored
as `dom.lnAccordion`. The state surface is two fields:

| Field | Set by | Read by |
|---|---|---|
| `dom` | constructor argument | `destroy` (event dispatch target, listener detach) |
| `_onToggleOpen` | constructor | `addEventListener, removeEventListener` |

That is the entirety of the instance state. There is no:

- Cached list of toggles (re-queried on each event)
- Active-panel pointer
- Open/closed counter
- DOM reference cache (no `_triggers`, `_panels`, `_items`)

Re-querying `dom.querySelectorAll('[data-ln-toggle]')` on every
`ln-toggle:open` is acceptable because (a) the DOM is small (rarely
more than 10 panels), (b) the event is user-driven (one per click),
and (c) caching would require hooking into accordion-internal mutation
events to keep the list fresh. The trade-off favours simplicity.

## Render flow

There is no rendering. The component does not produce DOM. It does
not clone templates. It does not set classes. It only sets the
`data-ln-toggle` attribute on sibling toggles, and dispatches one
event.

### Init

1. `registerComponent('data-ln-accordion', 'lnAccordion', _component, 'ln-accordion')`
   on script load.
2. `registerComponent` performs an init scan of `document.body` for
   `[data-ln-accordion]` and instantiates `_component(el)` for each
   match. It also sets up a `MutationObserver` that reruns the scan
   on `childList` add and on `attributes` mutation of
   `data-ln-accordion`.
3. `_component(dom)`:
   - Stores `this.dom = dom`.
   - Defines `this._onToggleOpen` as a closure that captures `dom`.
   - Calls `dom.addEventListener('ln-toggle:open', this._onToggleOpen)`.
   - Returns.

No initial scan of children. No DOM read. No event dispatched at init.

### Reaction to a panel opening

When any descendant `[data-ln-toggle]` opens, `ln-toggle` dispatches
`ln-toggle:open` on the panel element. The event bubbles up through
the DOM. When it reaches the accordion wrapper, `_onToggleOpen` fires:

1. `dom.querySelectorAll('[data-ln-toggle]')` — collect every toggle
   inside the accordion subtree.
2. For each toggle, if it is not the one that just opened *and* its
   `data-ln-toggle` attribute equals `"open"`:
   - `el.setAttribute('data-ln-toggle', 'close')`.
3. Each set-attribute call triggers the affected toggle's own
   `MutationObserver` (registered by `ln-toggle`), which runs the close
   pipeline: `before-close` cancelable event, `.open` class removal,
   `aria-expanded="false"` sync on triggers, persistence write,
   `ln-toggle:close` event.
4. After the loop, `dispatch(dom, 'ln-accordion:change', { target: e.detail.target })`
   on the accordion wrapper. `target` is the panel that just opened,
   *not* the wrapper. The wrapper is the dispatch element.

### Destroy

`destroy()`:

1. Guard against double-destroy (`if (!this.dom[DOM_ATTRIBUTE]) return`).
2. `removeEventListener('ln-toggle:open', this._onToggleOpen)` —
   detach the bubbled-event listener.
3. Dispatch `ln-accordion:destroyed`.
4. `delete this.dom[DOM_ATTRIBUTE]` — drop the instance reference so
   the wrapper element can be garbage-collected and re-init won't
   skip via the `if (!el[attribute])` guard in `findElements`.

Children remain intact. `ln-toggle` instances on each panel are
independent and continue to work.

## Event lifecycle

### Inbound — what the component listens to

| Event | Source | Phase | Effect |
|---|---|---|---|
| `ln-toggle:open` | descendant `[data-ln-toggle]` panel | bubble | Close every other open toggle in subtree, dispatch `ln-accordion:change` |

`ln-toggle:close` is not listened to. The accordion does not run any
logic when a panel closes — it only enforces single-open, and a
panel closing on its own does not violate that rule.

Cancelable events (`ln-toggle:before-open`, `ln-toggle:before-close`)
also bubble through the wrapper, but `ln-accordion` does not register
listeners on them. Cancellation is therefore the toggle's
responsibility — if a `before-close` is cancelled on a sibling
during the cascade close, `ln-toggle`'s observer reverts the
attribute back to `"open"`, and the accordion's `:change` event has
already fired anyway. The accordion is reactive; it does not gate.

### Outbound — what the component dispatches

| Event | Bubbles | Cancelable | `detail` | When |
|---|---|---|---|---|
| `ln-accordion:change` | yes | no | `{ target: HTMLElement }` | After every `ln-toggle:open` is processed, regardless of whether siblings actually needed closing |
| `ln-accordion:destroyed` | yes | no | `{ target: HTMLElement }` | Inside `destroy()` |

`ln-accordion:change` fires every time a panel opens — including
when none of the siblings was open (the loop ran but did nothing).
Consumers that care about "the active panel changed" can treat
`detail.target.id` as the new active panel.

`detail.target` for `:change` is the toggle panel (`e.detail.target`
forwarded from the inbound `ln-toggle:open`). For `:destroyed`, it
is the accordion wrapper itself.

## Coordinator / cross-component contract

The accordion is a [coordinator](../architecture/data-flow.md#14-glossary)
— it listens for `ln-toggle:open` and delegates the close work to
siblings via attribute writes, never by calling instance methods.
The contract:

- **Inputs.** `ln-toggle:open` bubbles from panels.
- **Outputs.** `data-ln-toggle="close"` on sibling panels;
  `ln-accordion:change` on the wrapper.

The accordion writes `data-ln-toggle="close"` on each open sibling —
that is the only path. Each toggle's own observer reacts and runs its
close pipeline. The split has three concrete benefits:

1. **Cancelable events still fire.** `ln-toggle:before-close`
   dispatches because the toggle's observer runs the full pipeline on
   attribute change. The accordion participates in the state machine
   through the same channel an external consumer (a button, a script,
   devtools) would use — one path, one test surface.
2. **Persistence is preserved.** When a sibling closes, its
   `data-ln-persist` write (if present) fires from the toggle's own
   close handler. The accordion knows nothing about persistence.
3. **`aria-expanded` syncs everywhere.** Every
   `[data-ln-toggle-for="<panelId>"]` trigger gets its
   `aria-expanded` updated by the toggle observer, regardless of
   where in the DOM those triggers live.

## Performance considerations

Cost per `ln-toggle:open` event:

- One `querySelectorAll('[data-ln-toggle]')` scoped to the wrapper.
  Linear in the number of toggles in the wrapper. For a typical
  FAQ accordion (5-15 panels), this is sub-microsecond work.
- One `setAttribute` per currently-open sibling. Each
  `setAttribute` triggers a `MutationObserver` callback inside
  `ln-toggle`, which walks its own state machine. Cost is linear
  in the number of *open* siblings.

Because at most one sibling is ever open at a time (the accordion
guarantees that), the observer-callback cost is effectively `O(1)`
amortised — typically zero (no other panel was open) or one (close
the previously-open one).

There is no virtualisation, no debouncing, no batching. None is
needed at this scale.

## Nested accordions

Nested accordions are supported. The mechanism is two
`closest('[data-ln-accordion]')` ownership checks inside
`_onToggleOpen`:

1. **Early exit on bubbled events.** When an inner accordion's panel
   opens, its `ln-toggle:open` event bubbles up through the outer
   accordion. The outer's listener checks
   `e.detail.target.closest('[data-ln-accordion]') !== dom` and
   returns immediately — the originating toggle's nearest accordion
   is the inner one, not the outer.
2. **Per-iteration skip on the cascade scan.** When this accordion's
   own panel opens, `dom.querySelectorAll('[data-ln-toggle]')` returns
   toggles from nested accordions too. Each candidate is filtered by
   `el.closest('[data-ln-accordion]') !== dom`; nested-accordion
   toggles are skipped, so the cascade close only affects siblings
   owned by this accordion.

The cost of `querySelectorAll` walking the full subtree plus a
`closest` call per match is negligible at typical accordion sizes
(low tens of toggles total). A more selective query
(`:scope > li > [data-ln-toggle]`, or a precomputed direct-child
list) would couple the JS to a specific markup shape; the
`closest` check supports arbitrary nesting depth and arbitrary
intermediate markup.

This is the "attribute is the contract" principle applied at a
second level: ownership is determined by DOM ancestry of the
attribute, not by JS-side bookkeeping. Each accordion stays
oblivious to the existence of any other accordion in the tree.

## Extension points

There are no documented extension points. The contract is small
enough that consumers should:

- Listen on `ln-accordion:change` for "panel changed" notifications.
- Set `data-ln-toggle` directly on a panel element to programmatically
  open or close.

If a consumer needs different coordination semantics (multi-open
groups, exclusive within-section, accordion-of-accordions with
scoped events), the path is to write a project-side coordinator,
not to extend ln-accordion. The accordion is intentionally not
configurable.

## Why not X?

### Why not a single component (no separate `ln-toggle`)?

Most toggle use cases are *not* accordions — sidebars, dropdowns,
expandable cards, info-banners. Folding the single-open semantics
into `ln-toggle` would mean every toggle in the library carries the
weight of accordion coordination. Splitting them lets `ln-toggle`
stay a pure individual-state primitive (the canonical "set an
attribute, toggle a class") and lets `ln-accordion` opt-in to the
extra behavior at the wrapper level.

