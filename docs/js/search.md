# Search — architecture reference

> Implementation notes for `ln-search`. The user-facing contract
> lives in [`js/ln-search/README.md`](../../js/ln-search/README.md);
> this document is the why-behind-the-how, not a re-statement of usage.

File: `js/ln-search/ln-search.js` (114 lines).

The architectural pivot: the dispatched event is **cancelable**, with the
default behavior being a cheap DOM walk that hides non-matching items. A
passive consumer (no listener) gets the walk for free. An active consumer
(`ln-table`, custom server-search) calls `preventDefault()` and runs its own
filter pipeline — the default walk never fires. One event, two paths, no
configuration attribute. The README owns the user-facing contract; this file
covers the why-behind-the-how.

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

`targetId` is captured once at construction and never re-read. By contrast,
`getElementById(targetId)` runs fresh on every search — targets can be
re-rendered (AJAX, a parent component's re-paint) and forcing the search to
keep working across that lifecycle is cheaper than caching the node.

## Construction flow

`registerComponent('data-ln-search', 'lnSearch', _component, 'ln-search')` wires
the standard scaffolding:

1. The shared `MutationObserver` watches `document.body` for new `[data-ln-search]` elements and for the attribute landing on existing elements.
2. Each match runs `new _component(el)`.
3. The constructor short-circuits on `dom.hasAttribute(INIT_ATTR)` — a defensive guard; `registerComponent`'s own re-init check via `el.lnSearch` already covers the same case.
4. Input resolution runs the priority chain (own tag → `[name="search"]` → `input[type="search"]` → `input[type="text"]`).
5. `_attachHandler` wires the input listener and (if found) the clear-button listener.
6. **Browser form-restore detection.** If the input has a non-empty `value` at construction, `queueMicrotask` schedules `_search(value)` for the next microtask. The deferral matters: the constructor runs during the DOMContentLoaded chain, so other components (notably `ln-table`) may not yet have attached their `ln-search:change` listener on the target. The microtask waits for the current task to drain, by which time every other component has constructed.
7. `INIT_ATTR` is set on the element to gate future re-runs.

## Search dispatch flow

User types → platform fires `input` → component listener fires:

```
_onInput
  → clearTimeout(_debounceTimer)              // cancel previous timer
  → setTimeout(_search(input.value...), 150)  // schedule new fire
```

The debounce shape is **trailing-edge with cancellation**: rapid typing
produces only one `_search` call, fired 150ms after the LAST keystroke. There
is no leading-edge fire — leading-edge would flicker partial filtering before
the user finishes typing the term they meant.

The debounce is **bypassed** by the clear-button path: `_onClear` calls
`_search('')` synchronously. The user explicitly asked for a reset; no
keystroke storm to coalesce.

`_search` body in five steps:

1. Resolve target via `document.getElementById(this.targetId)`. Bail silently if missing.
2. Dispatch `ln-search:change` on the target via `dispatchCancelable`.
3. If `evt.defaultPrevented`, return — the consumer owns the visual response.
4. Walk children: default is `target.children`; with `itemsSelector`, use `target.querySelectorAll(itemsSelector)`.
5. For each child: remove `data-ln-search-hide`, then re-add it if term is non-empty and the child's normalized `textContent` does not contain the term.

Whitespace collapses (`\s+` → ` `), text lowercases, term is pre-trimmed and
pre-lowercased at the call site. Matching is substring `includes`, not
token-based. Consumers who need word-boundary or fuzzy search call
`preventDefault()` and run their own logic.

## Event shape

`ln-search:change` is dispatched via `dispatchCancelable` from
`js/ln-core/helpers.js` — bubbles, cancelable, `detail: { term, targetId }`.

The event fires **on the target**, not on the search input. Consumers listen
on the thing they care about (the table, the list), not on the input that
drives it. Bubbling from the target reaches `document` cleanly; a listener
on the input would need to filter out unrelated input events by targetId.

There is no `:before-change` event. The cancelable shape of `:change` IS the
before hook — calling `preventDefault()` prevents the DOM walk. Splitting into
a separate `:before-change` would mirror `ln-modal` and `ln-form`, but
ln-search has only one phase to gate, so a single cancelable event is
sufficient.

## Render flow

There is no render flow. `_search` mutates attributes synchronously inside the
same call as the dispatch — no Proxy state, no `requestAnimationFrame`, no
batcher. `ln-table`'s `ln-search:change` handler does batch (sets
`_searchTerm`, recomputes `_filteredData`, calls `_render`); that batching
lives in the consumer.

## Lifecycle

| Phase | Trigger | What runs |
|---|---|---|
| Construct | `registerComponent` observer fires on attribute landing or DOM insertion | Constructor body — input resolution, listener wire-up, microtask-deferred initial dispatch if pre-filled |
| Search | `input` event on the input element | `_onInput` clears the previous debounce timer and starts a new 150ms one |
| Fire | Debounce timer expires | `_search(term)` dispatches the event and (if not prevented) walks `target.children` |
| Clear | Click on `[data-ln-search-clear]` | `_onClear` empties the input value, calls `_search('')` synchronously, refocuses the input |
| Destroy | `el.lnSearch.destroy()` | Cancels active debounce timer, removes input + clear listeners, removes `data-ln-search-initialized`, deletes `el.lnSearch`. Does NOT clean up `data-ln-search-hide` on the target. |

`destroy()` does NOT walk the target to remove `data-ln-search-hide`. Past
visual state stays; teardown is for the search component, not its side effects.

## Cross-component coordination

The component composes by attribute and event, not by code reference. It does
not import any other component.

- **`ln-table`** consumes `ln-search:change` via `preventDefault()` and runs
  in-memory filtering (`js/ln-table/ln-table.js:70-83`). ln-search has no
  awareness of ln-table.
- **`ln-filter`** runs independently on the same target via a parallel hide
  attribute (`data-ln-filter-hide`). An item is visible iff both attributes
  are absent. CSS unions the hide rules; neither component knows about the
  other.

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
