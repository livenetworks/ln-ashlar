# Search — architecture reference

> Implementation notes for `ln-search`. The user-facing contract
> lives in [`js/ln-search/README.md`](../../js/ln-search/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-search/ln-search.js` (114 lines).

## Position in the architecture

`ln-search` sits at the **input boundary** of the four-layer data
flow described in [`docs/architecture/data-flow.md`](../architecture/data-flow.md).
It is not itself in any of the four layers — it is the user-input
*adapter* that announces a filter intent the layers can choose to
react to. A natural way to think about it: ln-search is to filter
intent what `<input type="text">` is to a value — a primitive that
the rest of the page composes around.

The architectural decision worth flagging: the dispatched event is
**cancelable**, with the default behavior being a cheap DOM walk
that hides non-matching items. This shape lets the component serve
two very different consumers without either of them needing to opt
in:

- **A passive consumer** (no event listener at all) — the default
  walk runs, items get `data-ln-search-hide`, the global
  `display: none !important` rule from `js/ln-search/ln-search.scss`
  hides them. Zero JavaScript on the consumer side. The 80%-case
  for filtering a static `<ul>` or a card grid.
- **An active consumer** (`ln-table`, custom server-search code) —
  listens for `ln-search:change`, calls `preventDefault()`, runs its
  own filter pipeline. The default walk never fires; no wasted DOM
  mutation. The component yields control completely.

The cancelable-event pattern is what keeps the two paths in one
component instead of two. A non-cancelable "read-only notification"
event would force every consumer that cared about filtering to
explicitly disable the default by removing the hide attributes
afterwards — a coordination dance with race conditions. The
cancelable pattern routes the decision to the consumer at dispatch
time: "do you want this? say so and take it."

This is the same pattern `ln-form` uses for its `ln-form:before-submit`
event and `ln-confirm` does NOT use (because `ln-confirm` doesn't
dispatch its accept signal — the platform `click` is the signal).
The trade-off: a cancelable event requires consumers to know the
contract ("call preventDefault to opt out of default behavior"); a
non-cancelable event is simpler but forces the component to handle
both paths in ad-hoc ways. ln-search picked the contract because
its two consumers (default DOM walk vs. ln-table's in-memory filter)
are mutually exclusive — handling both at once would be wrong.

## State

Each `[data-ln-search]` element gets a `_component` instance stored
at `element.lnSearch`. Instance state is captured at construction;
no Proxy or reactive layer.

| Property | Type | Lifetime | Description |
|---|---|---|---|
| `dom` | `HTMLElement` | Whole instance | The element carrying `data-ln-search` — the input itself, or the wrapper |
| `targetId` | `string` | Captured at construction | Value of `data-ln-search` attribute. Resolved via `document.getElementById` on every `_search` call (no cached target reference — supports targets that get re-mounted) |
| `input` | `HTMLInputElement \| HTMLTextAreaElement \| null` | Captured at construction | The actual input element. Equal to `dom` when `data-ln-search` is on an input directly. Resolved via priority order `[name="search"]`, `input[type="search"]`, `input[type="text"]` when on a wrapper. |
| `itemsSelector` | `string \| null` | Captured at construction | Value of `data-ln-search-items`, or `null`. When set, replaces `target.children` with `target.querySelectorAll(selector)` |
| `_debounceTimer` | `number \| null` | Cycle-scoped | Active `setTimeout` handle for the 150ms debounce. Cleared on every new keystroke and on `destroy()` |
| `_clearBtn` | `HTMLButtonElement \| null` | Captured at construction | Located via `dom.querySelector('[data-ln-search-clear]')`. If missing at construct time, no clear behavior is wired — see "Common mistakes" item 6 in README |
| `_onInput` | `Function` | Whole instance | Bound handler for the debounced input listener. Held as a reference so `destroy()` can `removeEventListener` symmetrically |
| `_onClear` | `Function \| undefined` | Set only when `_clearBtn` exists | Bound handler for the clear button click |

The `targetId` is captured once and never re-read. Mutating
`data-ln-search` to point at a different target is invisible to the
running instance. The MutationObserver registered by
`registerComponent` DOES catch the attribute change, but its
reaction is "is this element still attached and uninitialized?" not
"sync the new value into the live instance." See the README's
"Common mistakes" item 7 for the destroy/re-init escape.

By contrast, the **target lookup itself** is fresh on every
`_search` call — `document.getElementById(this.targetId)` runs each
time. This is intentional: targets can be re-rendered (via AJAX, a
parent component's re-paint), and forcing the search to keep working
across that lifecycle is cheaper than caching the reference and
risking a stale node.

## Construction flow

`registerComponent('data-ln-search', 'lnSearch', _component, 'ln-search')`
at line 113 wires the standard scaffolding:

1. **Selector + attribute** registers the element type.
2. The shared `MutationObserver` watches `document.body` for new
   `[data-ln-search]` elements and for the attribute landing on
   existing elements. New matches run `new _component(el)`.
3. The constructor short-circuits on `dom.hasAttribute(INIT_ATTR)`
   — a defensive check, since `registerComponent`'s own re-init
   guard via `el.lnSearch` already covers the same case.
4. Input resolution runs the priority chain (own tag → `[name="search"]`
   → `input[type="search"]` → `input[type="text"]`).
5. `_attachHandler` wires the input listener and (if found) the
   clear-button listener.
6. **Browser form-restore detection.** If the input has a non-empty
   `value` at construction (browser back/forward, server-rendered
   input), `queueMicrotask` schedules `_search(value)` for the next
   microtask. The deferral matters: the DOMContentLoaded event
   handler chain has not finished when the constructor runs, so
   other components (notably `ln-table`) may not yet have attached
   their `ln-search:change` listener on the target. The microtask
   waits for the current task to drain, by which time every other
   component has constructed.
7. `INIT_ATTR` is set on the dom element to gate future re-runs.

## Search dispatch flow

The user types a character → the platform fires `input` on the
input element → the component's listener fires:

```
_onInput
  → clearTimeout(_debounceTimer)              // cancel previous timer
  → setTimeout(_search(input.value...), 150)  // schedule new fire
```

The debounce shape is **trailing-edge with cancellation**: rapid
typing produces only one `_search` call, fired 150ms after the LAST
keystroke. If the user types 8 characters in 200ms, the first 7
clear-and-reschedule and only the 8th's timer survives. There is no
leading-edge fire (no immediate first event). For a small in-memory
filter that's the right shape — leading-edge would cause a flicker
of partial filtering before the user finished typing the term they
meant.

The debounce is **bypassed** by the clear-button click path:
`_onClear` calls `_search('')` synchronously. Clearing should feel
instant (the user explicitly asked for the reset) and there's no
keystroke storm to coalesce.

`_search` itself is short:

1. Resolve the target via `document.getElementById(this.targetId)`.
   Bail silently if missing.
2. Dispatch `ln-search:change` on the target via
   `dispatchCancelable(target, 'ln-search:change', { term, targetId })`.
3. If `evt.defaultPrevented`, return. The consumer owns the
   visual response.
4. Otherwise, walk children:
   - Default: `target.children` (live `HTMLCollection` of element
     nodes — text and comment nodes skipped).
   - With `itemsSelector`: `target.querySelectorAll(itemsSelector)`
     (static `NodeList`, descendants regardless of depth).
5. For each child: remove `data-ln-search-hide`, then re-add it if
   `term` is non-empty AND the child's normalized `textContent` does
   NOT contain the term.

The `textContent` normalization is `.replace(/\s+/g, ' ').toLowerCase()`
— collapses runs of whitespace into a single space and lowercases.
The term is already pre-trimmed and pre-lowercased at the call site.
This means a search for `"hello world"` matches an item containing
`"Hello   World"` (multi-space, mixed case). Newlines and tabs in
the item are flattened to spaces.

The lookup is a substring `includes`, not a token match — searching
for `"oldwo"` matches `"hello world"`. This is intentional for the
"filter a small list" case; tokenization would over-engineer the
common path. Consumers who need word-boundary matching or fuzzy
search call `preventDefault()` and run their own logic.

## Event shape

`ln-search:change` is dispatched via `dispatchCancelable` from
`js/ln-core/helpers.js` — a bubbling, cancelable `CustomEvent` with
`detail: { term, targetId }` dispatched on the target element and
returned to the caller so `defaultPrevented` can be checked.

The event:

- **Bubbles** — listeners on `document` or any ancestor of the
  target catch it. This is what makes a "show a global searching
  spinner" listener trivial; no per-target wiring needed.
- **Cancels** — `preventDefault()` from any listener short-circuits
  the default DOM walk. The component checks `evt.defaultPrevented`
  immediately after dispatch.
- **Bears `term` and `targetId`** — `term` is normalized
  (lowercased, trimmed); `targetId` echoes `data-ln-search`'s value
  for delegate disambiguation.

The event is dispatched **on the target**, not on the search input.
This is load-bearing for two reasons:

1. Consumers naturally listen on the thing they care about (the
   table, the list), not on the input that drives it. A consumer
   that listens on the input would need to know the input's
   identity, which is fragile when multiple inputs target the same
   thing.
2. Bubbling-up from the target reaches `document` cleanly. Bubbling
   from the input would reach `document` too, but the listener
   would have to filter out other unrelated `:change` events from
   inputs — duplicating the targetId check.

There is no `:before-change` event. The cancelable shape of
`:change` itself is the "before" hook — calling `preventDefault()`
prevents the default action (the DOM walk). Splitting into a
separate `:before-change` would mirror what `ln-modal` and
`ln-form` do, but ln-search has only one phase to gate (the walk),
so a single cancelable event is sufficient.

There is no `:clear` or `:submit` event. Clearing dispatches
`ln-search:change` with `term: ''`; consumers detect "cleared" by
checking `e.detail.term === ''`. Enter is a platform event the
component does not see.

## Render flow

There is no render flow in the JS-component sense. The default DOM
walk is a single function (`_search`) that mutates attributes
synchronously inside the same call where it dispatches the event.
There is no Proxy state, no `requestAnimationFrame`, no batcher.

The reason: search filtering is a leaf concern. The component owns
no template, no scrollable virtual list, no animation. It either
hides items (cheap attribute write) or yields to a consumer who
owns the actual rendering. There is nothing to batch.

By contrast, `ln-table`'s `ln-search:change` handler DOES batch —
it sets `_searchTerm`, recomputes `_filteredData`, resets the
virtual scroll window, and calls `_render`. The batching lives in
the consumer; ln-search itself is a pure dispatcher.

## Lifecycle

| Phase | Trigger | What runs |
|---|---|---|
| Construct | `registerComponent` observer fires on attribute landing or DOM insertion | Constructor body — input resolution, listener wire-up, microtask-deferred initial dispatch if pre-filled |
| Search | `input` event on the input element | `_onInput` clears the previous debounce timer and starts a new 150ms one |
| Fire | Debounce timer expires | `_search(term)` dispatches the event and (if not prevented) walks `target.children` |
| Clear | Click on `[data-ln-search-clear]` | `_onClear` empties the input value, calls `_search('')` synchronously, refocuses the input |
| Destroy | `el.lnSearch.destroy()` | Cancels active debounce timer, removes input + clear listeners, removes `data-ln-search-initialized`, deletes `el.lnSearch`. Does NOT clean up `data-ln-search-hide` on the target. |

A subtle detail: `destroy()` does NOT walk the target to remove the
hide attributes. The visual side-effects of past searches stay on
the items. This is intentional — `destroy()` is for tear-down of
the search component itself, not the visual state it left behind.
A consumer that wants a full reset before destroy should call
`_search('')` first (or set `input.value = ''` and dispatch
`input`), then destroy.

## Re-init resilience

The MutationObserver registered by `registerComponent` watches the
attributeFilter generated from the selector — for ln-search, that
filter contains `data-ln-search`. Adding the attribute to an
existing element creates an instance. Adding new
`[data-ln-search]` elements to the DOM (AJAX inserts, programmatic
appends) creates instances.

The observer does NOT watch `data-ln-search-items`. That attribute
is read once at construction; mutating it later is a no-op for the
running instance. If you genuinely need to switch from `target.children`
to a deep selector mid-life, destroy and re-init.

The observer ALSO does not watch `data-ln-search` value mutations
in a way that re-binds the targetId. The mutation IS detected (the
attribute is in the filter), but the only thing the observer does
is ensure an instance exists — which it already does. The targetId
on the existing instance is unchanged. See "Common mistakes" item
7 in the README for the escape.

## Cross-component coordination

The component composes by attribute and event, not by code
reference. It does not import any other component. The composition
points:

- **`ln-table` → consumes `ln-search:change`.** Table-side listener
  at `js/ln-table/ln-table.js:70-83` calls `preventDefault()` and
  runs in-memory filtering. ln-search has no awareness of ln-table.
- **`ln-data-table` → does not consume `ln-search`.** Has its own
  `[data-ln-data-table-search]` input and `ln-data-table:search`
  event. The asymmetry is by design: ln-data-table's search is part
  of the request payload (joined with sort, pagination, column
  filters), so a parallel event channel would force the data-table
  layer to ignore one of them.
- **`ln-filter` → independent on the same target.** Both components
  manage their own hide attribute (`data-ln-search-hide` and
  `data-ln-filter-hide`). An item is visible iff both are absent.
  CSS handles the union via two-selector hide rule; neither
  component knows about the other.
- **`ln-form` → no coordination.** Search input inside
  `<form data-ln-form>` works the same as outside one. ln-form
  owns the form's submit lifecycle; ln-search owns the input's
  filter intent. They overlap only on the platform's Enter-key
  behavior, which neither component intercepts. See README "Common
  mistakes" item 2.
- **`ln-icons` → consumes the search-icon `<use href="#ln-search">`.**
  Indirect — the wrapper variant uses an icon that ln-icons resolves.
  Not a coordination point per se, just shared use of the icon
  sprite.

## Why no per-input opt-out for the default behavior

The default DOM walk is unconditional in the component. There is
no `data-ln-search-default="off"` attribute. The way to disable the
default is to attach a listener and call `preventDefault()` — the
event-cancelable contract is the opt-out.

This was a deliberate choice. An attribute-driven opt-out would be
a static decision baked into markup; the event-driven opt-out is a
dynamic decision made by whoever cares about the result. ln-table
opts out automatically when it's the consumer; a project script
opts out only when it's set up; if neither is true, the cheap
default is what fires. No mode confusion, no "is this configured?"
questions in code review.

## See also

- **[`js/ln-search/README.md`](../../js/ln-search/README.md)** —
  user-facing contract: attributes, events, examples, common
  mistakes.
- **[`js/ln-table/README.md`](../../js/ln-table/README.md)** — the
  canonical consumer of `ln-search:change` for in-memory table
  filtering.
- **[`docs/architecture/data-flow.md`](../architecture/data-flow.md)**
  — the four-layer data flow that ln-search sits at the input edge
  of, without being a member of any layer.
- **[`js/ln-core/helpers.js`](../../js/ln-core/helpers.js)** —
  `dispatchCancelable`, `registerComponent`. Read for the shared
  observer + re-init guard semantics.
