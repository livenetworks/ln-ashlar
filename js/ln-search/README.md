# ln-search

> A debounced text-search input that announces "the user typed X"
> and otherwise does almost nothing. The default behavior — hide
> non-matching items in a target list — is the cheap fallback for
> when no consumer steps in. The expensive cases (table filtering,
> async server search) take over by listening to one cancelable
> event and calling `preventDefault()`. 114 lines of JS that exist
> so no project hand-rolls debounce, event timing, and observer
> lifecycle for the third time.

## Philosophy

A search input does two things, and neither of them is "search."
First, it debounces a stream of `input` events so a user typing
"hello" does not fire five searches in 200ms. Second, it announces
to the rest of the page that the user wants to filter by some term.
Whatever the right answer is — DOM hide/show, in-memory table
filter, server request — that is somebody else's problem. The
search component does not own the search.

`ln-search` is the input-side of the contract. It dispatches
exactly one event, `ln-search:change`, on the **target** element
identified by `data-ln-search="targetId"`. That event is cancelable;
a consumer that wants to handle filtering itself listens for the
event, calls `preventDefault()`, and the component's default
behavior backs off entirely. A consumer that does NOT listen gets
the cheap fallback for free: the component walks `target.children`
and toggles `data-ln-search-hide="true"` on items whose textContent
does not contain the term.

This is the **sender / listening-consumer** pattern that recurs
across ln-ashlar: one component announces, others react. ln-table
listens for `ln-search:change` to drive its in-memory filter.
ln-filter does the same with its own dispatched events. A custom
script can listen and do whatever — fetch from a server, narrow a
canvas of cards, drive a CodeMirror search. The search component
does not need to know about any of those consumers.

The component does one piece of plumbing that matters and is worth
understanding before you use it. Browser form-restore (back-button
navigation, server-rendered pre-filled inputs) deposits a value
into the input *before* JS runs. Without intervention, the consumer
sees an unfiltered target with a non-empty search box. ln-search
detects the pre-filled value during construction and dispatches the
initial event — but it does it through `queueMicrotask`, not
synchronously. The microtask defers the dispatch until *after* the
current `DOMContentLoaded` tick finishes, which lets every other
component's constructor run first. Without that defer, the search
event would fire while ln-table was mid-init and have nothing to
attach to.

### What `ln-search` does NOT do

- **Does NOT make HTTP calls.** It dispatches a CustomEvent. If you
  want server-side search, listen to the event, call
  `preventDefault()`, and dispatch your own `ln-http:request` — see
  the `ln-http` README.
- **Does NOT highlight matches.** No `<mark>` insertion, no class
  toggling on matched substrings. The default behavior is binary:
  match or no-match, show or hide. Highlighting is project SCSS or
  consumer JS territory.
- **Does NOT remember query history.** No localStorage write, no
  recent-searches dropdown. The input's value is the input's value;
  the browser handles autocomplete history if `name="search"` is
  set.
- **Does NOT debounce on the cancelled path.** The component
  debounces every `input` event by 150ms — that part is uniform.
  But the clear-button click bypasses the debounce: `_search('')`
  runs synchronously so the user sees the list reset immediately
  on click.
- **Does NOT support a configurable debounce delay.** `DEBOUNCE_MS`
  is a module constant (line 8 of `ln-search.js`). There is no
  `data-ln-search-delay` attribute. If your project genuinely needs
  a different timing — sub-50ms for a tiny in-memory list, or
  500ms+ for an expensive remote query — handle the input directly
  on the consumer side and skip ln-search. (For most real cases,
  150ms is the right answer; raising it makes the UI feel laggy on
  fast typists, lowering it wastes work on common keystrokes.)
- **Does NOT dispatch a separate `:clear` event.** Clearing the
  input — via the clear button, programmatic value reset, or
  user-deletion — fires `ln-search:change` with `term: ''`. The
  consumer detects "cleared" by inspecting `e.detail.term === ''`.
  One event, one shape, easier to wire.
- **Does NOT dispatch a separate `:submit` event for Enter.** The
  component listens to `input` only — never `keydown` or
  `submit`. Pressing Enter inside the search input does whatever
  the platform does next: if the input is inside a `<form>`, the
  form submits (native behavior); if not, nothing happens. The
  150ms debounce means the last keystroke is *probably* still in
  the timer when Enter is pressed; the form submit may race the
  search dispatch. See "Common mistakes" item 1 if you need
  Enter-to-search semantics.
- **Does NOT scope event listening to the input it owns.** Every
  search component listens to its OWN input's `input` event and
  dispatches on the target. Two `[data-ln-search="my-list"]` inputs
  on the same page each fire their own event when typed in;
  consumers see the most recent one. See "Common mistakes" item 4.

### Cross-component coordination

| Consumer | What it does | Verified at |
|---|---|---|
| `ln-table` | Listens for `ln-search:change` on the `[data-ln-table]` element; calls `preventDefault()`; runs its own in-memory filter against the parsed row data; re-renders virtual scroll. | `js/ln-table/ln-table.js:62-78`, `441` |
| `ln-filter` | Independent. Operates on the same target via its own `data-ln-filter-hide` attribute. An item is visible only when neither hide attribute is present. No event coordination. | `js/ln-filter/README.md:188-193` |
| `ln-data-table` | **Does not use `ln-search`.** Has its own `[data-ln-data-table-search]` input that dispatches `ln-data-table:search` and triggers a server request. Don't confuse the two — see "Common mistakes" item 5. | `js/ln-data-table/ln-data-table.js:321-333` |
| `ln-form` | No coordination. ln-search's input listener is independent of ln-form. If the search input lives inside a `<form data-ln-form>`, pressing Enter still submits the form (native). | grepped — no cross-references |

The asymmetry between `ln-table` (consumes `ln-search`) and
`ln-data-table` (rolls its own) is intentional. `ln-table` is the
client-side renderer for fully-loaded data; `ln-data-table` is the
server-coordinated renderer where search is part of the request
payload (`ln-store` joins it with sort + pagination state). Putting
`ln-search` in front of `ln-data-table` would create a parallel
search channel that the data-table layer would have to learn to
ignore. Keeping them separate keeps each layer's contract clean.

## Markup anatomy

The minimum invocation is `data-ln-search` directly on the input,
plus a target with the matching ID:

```html
<input type="search" placeholder="Search..." data-ln-search="my-list">

<ul id="my-list">
    <li>Argentina</li>
    <li>Brazil</li>
    <li>Canada</li>
</ul>
```

That is the entire setup. The input gets debounced; the list
filters by `textContent`; matched items stay, unmatched items get
`data-ln-search-hide="true"`. The CSS rule that hides them ships
with ln-ashlar (`js/ln-search/ln-search.scss`), so no consumer CSS
is required.

### Wrapper variant — for the icon-and-clear-button layout

The richer markup wraps the input in a `<label>` that holds a
search icon and an optional clear button. The component finds the
input inside the wrapper:

```html
<label data-ln-search="my-list">
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" placeholder="Search...">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</label>
```

The chrome (border, focus ring, icon spacing, clear-button
visibility) comes from `@mixin form-input-icon-group` in
`scss/config/mixins/_form.scss`, applied via the default
`<label>:has(input[type="search"])` selector in
`scss/components/_form.scss`. Neither ln-search nor your project
needs to add a class.

The input is found in this priority order: `[name="search"]`,
`input[type="search"]`, `input[type="text"]`. If you nest multiple
inputs inside the wrapper, the first match wins.

### Two render paths — `target.children` vs `data-ln-search-items`

The default behavior iterates `target.children` — direct children
only. That matches the common case (filter a `<ul>`'s `<li>`s, or
an `<article>`-grid's articles). For nested structures where the
items are not direct children, opt into a CSS-selector pass:

```html
<input type="search" data-ln-search="icon-grid" data-ln-search-items=".icon-cell">

<div id="icon-grid">
    <section data-category="navigation">
        <div class="icon-cell">#ln-home</div>
        <div class="icon-cell">#ln-users</div>
    </section>
    <section data-category="actions">
        <div class="icon-cell">#ln-plus</div>
        <div class="icon-cell">#ln-edit</div>
    </section>
</div>
```

With `data-ln-search-items=".icon-cell"`, the component runs
`target.querySelectorAll('.icon-cell')` — every matching descendant
regardless of depth — and toggles `data-ln-search-hide` on each.
The `<section>` wrappers are NOT touched; they remain visible even
if all their children are hidden. If you need section-level
collapsing (hide a whole section when none of its items match),
that's consumer code: listen for the event, walk sections, count
visible children.

### What state lives where

| Concern | Lives on | Owned by |
|---|---|---|
| Should this input drive search? | `data-ln-search="targetId"` (presence + value) | author |
| Search target | The element with matching `id` | author |
| Currently typed term | `input.value` | the platform (the input's own state) |
| Item is hidden by search | `data-ln-search-hide="true"` on the item | ln-search (default path only) |
| Items selector for deep search | `data-ln-search-items="selector"` on the search element | author |
| Active debounce timer | `_debounceTimer` on the JS instance | ln-search |
| Initialized? | `data-ln-search-initialized` on the search element | ln-search (set on first construct) |
| Custom filter logic | event listener on the target | consumer |

Note that `data-ln-search-initialized` is internal and exists
because the constructor early-returns on it before
`registerComponent`'s own re-init guard would fire — a slight
belt-and-suspenders. The marker is removed by `destroy()`. Don't
read it from project code; read `el.lnSearch` instead.

## States & visual feedback

The component itself has no visual state — there is no "searching"
or "matched" attribute on the input. The only visible effect is on
the target's items, via `data-ln-search-hide`.

| Trigger | What JS does | What the user sees |
|---|---|---|
| Component constructed with empty input | Constructor exits without dispatching; debounce timer never starts | No change to target items |
| Component constructed with pre-filled input (browser form-restore, SSR) | Constructor schedules `_search(value)` via `queueMicrotask`; dispatches `ln-search:change` after current tick | Items not matching the pre-filled term are hidden once all components have initialized |
| User types a character | `input` event fires; existing debounce timer cleared; new 150ms timer scheduled with current input value | No immediate visual change — wait for the debounce |
| Debounce timer fires | `_search(term)` runs; dispatches cancelable `ln-search:change` on target; if NOT prevented, walks `target.children` (or `target.querySelectorAll(itemsSelector)`) and toggles `data-ln-search-hide` per item | Non-matching items disappear (CSS `display: none !important` via the global rule); matching items stay |
| User clicks `[data-ln-search-clear]` | `input.value = ''`; `_search('')` runs synchronously (bypasses debounce); input refocuses | All items reappear; clear button hides itself via `:placeholder-shown` CSS |
| Listener calls `e.preventDefault()` | Component returns from `_search` immediately after dispatch; default DOM walk is skipped | Whatever the consumer does — table filter, server request, custom DOM swap |
| `destroy()` called | Clears active debounce timer; removes input listener and clear-button listener; removes `data-ln-search-initialized`; deletes `el.lnSearch` | Search input becomes a plain `<input>` again. Items currently hidden via `data-ln-search-hide` stay hidden — destroy does NOT clean up the target. |

The `display: none !important` on `[data-ln-search-hide="true"]`
lives in `js/ln-search/ln-search.scss` and is shipped with the
library bundle. The `!important` exists because items inside
opinionated layouts (CSS Grid, Flexbox, `display: contents`
parents) have their own display rules that would otherwise
override `display: none`.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-search="targetId"` | `<input>` directly, OR a wrapper element (`<label>`, `<div>`, `<form>`) | Marks the search input. Value is the `id` of the target element whose children will be filtered. | Presence creates the instance. The value is read once at construction and used by every subsequent `_search` call to look up the target via `document.getElementById`. Mutating the value mid-life does NOT re-resolve — destroy and re-create. |
| `data-ln-search-items="selector"` | Same element as `data-ln-search` | CSS selector passed to `target.querySelectorAll`. When set, replaces the default `target.children` iteration with deep matching. | Read once at construction (`this.itemsSelector`). Mid-life mutations are not observed. The selector is run against the target on every `_search` call, so newly-added matching elements DO get filtered on the next keystroke. |
| `data-ln-search-hide="true"` | Children of the target (auto) | Set by `_search` on items that do not match. Removed when the term changes or empties. | The public CSS hook. Project SCSS can hook into it for transitions or alternate hide modes (opacity, height collapse, etc.) — but the library's default `display: none !important` will win unless you increase specificity. |
| `data-ln-search-clear` | `<button>` inside the search element wrapper | Marks an in-input clear button. The component's constructor wires a click listener that empties the input, calls `_search('')`, and refocuses. | Found via `this.dom.querySelector('[data-ln-search-clear]')` at construction. Adding this attribute later via `setAttribute` is NOT picked up — see "Common mistakes" item 6. |
| `data-ln-search-initialized` | The search element (auto) | Set on first construct to short-circuit re-init. Removed by `destroy()`. | Internal marker; do not read from project code. The `registerComponent` helper has its own re-init guard via `el.lnSearch` — this attribute is a defensive secondary check at the top of `_component`. |

The input itself has no special attributes from ln-search.
`type="search"`, `placeholder`, `name`, `required`, `maxlength`,
`disabled`, `autofocus` are all native attributes the platform
handles. ln-search does not read or write them.

## Events

One event is dispatched. Bubbles. Cancelable.

| Event | Bubbles | Cancelable | `detail` | Dispatched on | Dispatched when |
|---|---|---|---|---|---|
| `ln-search:change` | yes | **yes** | `{ term: string, targetId: string }` | The target element (the `<ul>`, `<table>`, `<div>`, etc. matched by `targetId`) — NOT the search input | After the 150ms debounce expires, OR when the clear button is clicked (synchronous, bypasses debounce), OR via `queueMicrotask` on construction if the input has a pre-filled value |

`detail.term` is already lowercased and trimmed. The transformation
happens once in `ln-search.js:65` and again in the construction
microtask path. Listeners receive a normalized term — they should
NOT lowercase or trim again, both for consistency and because
re-trimming a pre-trimmed string is wasted work.

`detail.targetId` is the value of `data-ln-search` — useful when a
delegate listener at `document` catches search events from multiple
inputs and needs to disambiguate.

The event is dispatched on the **target**, not the input. This is
load-bearing: a consumer that wants to react to a particular table's
search listens for the event ON the table itself
(`tableEl.addEventListener('ln-search:change', ...)`) — no
`document` delegate, no querying for the input. The event bubbles,
so a `document.addEventListener('ln-search:change', ...)` ALSO
catches it; that's the right path for a global "show a 'searching'
spinner" indicator that doesn't care about which target.

`preventDefault()` is the off-switch for the default DOM walk. Call
it from a listener and `_search` returns immediately after dispatch
— no `data-ln-search-hide` mutation runs. The consumer is now
responsible for the visual response. ln-table uses this exact
pattern.

## API (component instance)

`window.lnSearch(root)` re-runs the init scan over `root`. The
shared `MutationObserver` registered by `registerComponent` already
covers AJAX inserts and `data-ln-search` attribute additions; call
this manually only when you inject markup into a Shadow DOM root or
another document context the observer cannot see.

`el.lnSearch` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | Back-reference to the search element (the input or the wrapper carrying `data-ln-search`) |
| `targetId` | `string` | The `id` value read from `data-ln-search` at construction |
| `input` | `HTMLInputElement \| HTMLTextAreaElement \| null` | The actual input element. Same as `dom` when `data-ln-search` is on the input directly. Null if the wrapper has no input inside (the component logs nothing in this case — it just does not attach handlers). |
| `itemsSelector` | `string \| null` | Value of `data-ln-search-items` at construction, or `null` |
| `_debounceTimer` | `number \| null` | Active `setTimeout` handle, or null between debounce windows |
| `_clearBtn` | `HTMLButtonElement \| null` | The clear button found at construction, or null |
| `destroy()` | method | Clears the debounce timer, removes the input and clear-button listeners, removes `data-ln-search-initialized`, deletes `el.lnSearch`. Does NOT clear `data-ln-search-hide` from target items — those remain in their last filtered state. |

There is no `arm()`, `search(term)`, or `clear()` method. To
trigger a search programmatically, set `input.value` and dispatch
an `input` event:

```js
const el = document.querySelector('[data-ln-search]');
const input = el.tagName === 'INPUT' ? el : el.querySelector('input');
input.value = 'argentina';
input.dispatchEvent(new Event('input', { bubbles: true }));
// → triggers the debounced search 150ms later
```

This works because ln-search listens to the `input` event, not to a
custom API. Programmatic value writes that bypass `input` (e.g.
`input.value = '...'` with no dispatch) do NOT trigger search —
this is a platform quirk, not an ln-search choice.

## Examples

### Minimal — filter a list

```html
<input type="search" placeholder="Search countries..." data-ln-search="countries">

<ul id="countries">
    <li>Argentina</li>
    <li>Brazil</li>
    <li>Canada</li>
    <li>Denmark</li>
</ul>
```

Type "ar" — Argentina stays, the rest get `data-ln-search-hide`.
Type "z" — every item gets the attribute (no match), the list
appears empty. Clear the input — every item's attribute is
removed. Zero JavaScript on the consumer side.

### Wrapper with icon and clear button — the canonical chrome

```html
<label data-ln-search="employees">
    <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-search"></use></svg>
    <input type="search" placeholder="Search employees...">
    <button type="button" data-ln-search-clear aria-label="Clear search">
        <svg class="ln-icon ln-icon--sm" aria-hidden="true"><use href="#ln-x"></use></svg>
    </button>
</label>

<table id="employees" data-ln-table>
    <!-- table markup ... -->
</table>
```

Notice three things. (1) The wrapper is a `<label>`, not a
`<div>` — clicking anywhere on the wrapper focuses the input (HTML
semantics). (2) The chrome (border, focus ring, icon position,
clear-button visibility) is provided by `@mixin
form-input-icon-group` automatically via the
`<label>:has(input[type="search"])` selector — no class on the
label. (3) The clear button is hidden via CSS while the input is
empty (`:placeholder-shown ~ [data-ln-search-clear]`); no JS toggle
runs.

### Custom event listener — driving an external visual change

```html
<input type="search" placeholder="Search..." data-ln-search="match-counter">
<p id="match-counter-result">Type to search...</p>
<ul id="match-counter">
    <li>Alpha framework</li>
    <li>Beta library</li>
    <li>Gamma toolkit</li>
</ul>
```

```js
const target = document.getElementById('match-counter');
const result = document.getElementById('match-counter-result');

target.addEventListener('ln-search:change', function (e) {
    e.preventDefault();   // skip the default hide/show

    const term = e.detail.term;
    const items = target.querySelectorAll(':scope > li');
    let matches = 0;
    items.forEach(function (li) {
        if (term === '' || li.textContent.toLowerCase().includes(term)) matches++;
    });

    if (term === '') {
        result.textContent = 'Type to search...';
    } else if (matches === 0) {
        result.textContent = 'No results for "' + term + '"';
    } else {
        result.textContent = matches + ' of ' + items.length + ' matches';
    }
});
```

The `preventDefault()` is the on-ramp for custom behavior — the
default DOM walk is skipped, the items are NOT hidden, and the
listener owns the visual response. Note that `e.detail.term` is
already lowercased and trimmed.

### Server-side search — handing off to ln-http

```html
<input type="search" placeholder="Search products..." data-ln-search="products-table">
<div id="products-table" data-ln-table>
    <!-- empty until first server response -->
</div>
```

```js
document.getElementById('products-table').addEventListener('ln-search:change', function (e) {
    e.preventDefault();   // skip default hide; we are going to the server

    document.dispatchEvent(new CustomEvent('ln-http:request', {
        detail: {
            url: '/api/products?q=' + encodeURIComponent(e.detail.term),
            method: 'GET',
            target: 'products-table-renderer'   // your render-handler ID
        }
    }));
});
```

For a real production setup you'd want the request to be
abortable (cancel the previous fetch when a new search arrives) —
ln-http does NOT track aborts across requests, so wire an
`AbortController` yourself or use ln-data-table, which integrates
this concern into its layer. For most "search a small server
list" cases the above is enough.

### Two views of the same target — independent searches

```html
<!-- Search by full text -->
<input type="search" placeholder="Search..." data-ln-search="employees">

<!-- Filter by department -->
<form data-ln-filter="employees">
    <ul>
        <li><label><input type="checkbox" data-ln-filter-key="dept" value="engineering"> Engineering</label></li>
        <li><label><input type="checkbox" data-ln-filter-key="dept" value="design"> Design</label></li>
    </ul>
</form>

<table id="employees" data-ln-table>
    <!-- ... -->
</table>
```

ln-search and ln-filter operate on the same target without
coordinating. Each manages its own hide attribute — `data-ln-search-hide`
and `data-ln-filter-hide` respectively. An item is visible only when
both are absent. The CSS rule lives in the library (covered by the
defaults shipped in ln-ashlar.css), but if your project ships a
narrowed bundle, both selectors must hide:

```scss
[data-ln-search-hide],
[data-ln-filter-hide] {
    display: none !important;
}
```

When the target is a `[data-ln-table]`, ln-table intercepts both
events and merges the search term and column filters into a single
in-memory pass — the hide attributes are not used in that path. See
`js/ln-table/README.md`.

### Deep nested filtering

```html
<input type="search"
       placeholder="Search icons..."
       data-ln-search="icons"
       data-ln-search-items=".icon-cell">

<div id="icons">
    <section>
        <h3>Navigation</h3>
        <ul>
            <li class="icon-cell">home — go home</li>
            <li class="icon-cell">arrow-left — back</li>
        </ul>
    </section>
    <section>
        <h3>Actions</h3>
        <ul>
            <li class="icon-cell">plus — add</li>
            <li class="icon-cell">trash — delete</li>
        </ul>
    </section>
</div>
```

Without `data-ln-search-items`, the default `target.children`
iteration would walk the two `<section>` elements. None of their
`textContent` directly matches a search term (the matching content
is inside the nested `<li>`s), but `textContent` recurses, so
"home" would still match — but the section as a whole is what gets
hidden, not the individual icon. With `data-ln-search-items=".icon-cell"`,
each `<li>` is checked individually and hidden independently. The
section headers stay visible regardless.

If a section ends up with all its `.icon-cell` children hidden but
the `<h3>` and surrounding `<section>` are still visible, that's
the trade-off — section-level collapsing is consumer code:

```js
target.addEventListener('ln-search:change', function () {
    target.querySelectorAll('section').forEach(function (section) {
        const visibleCells = section.querySelectorAll('.icon-cell:not([data-ln-search-hide])');
        section.style.display = visibleCells.length === 0 ? 'none' : '';
    });
}, { capture: false });   // runs AFTER ln-search's default mutation
```

The listener registers in the bubble phase so it sees the post-mutation
DOM. Capture-phase would run before the hide attributes are written.

### Browser form-restore — pre-filled input on page load

```html
<input type="search" name="search" placeholder="Search..." data-ln-search="results">

<ul id="results">
    <li>Alpha</li>
    <li>Beta</li>
    <li>Gamma</li>
</ul>
```

If the user navigates away after typing "alpha" and hits the back
button, the browser restores `value="alpha"` on the input before
ln-ashlar's bundle runs. The component's constructor detects the
non-empty value and schedules `_search('alpha')` via
`queueMicrotask`. The search dispatches AFTER the current tick
finishes — by then, every other component has constructed too, so a
listener wired in another component's init runs as expected.

If you write `input.value = 'something'` server-side via Blade and
expect the same behavior, that works identically — pre-filled
values from any source are detected the same way.

What does NOT work: setting `input.value` from JS *after* page load
without dispatching `input`. The component does not observe
attribute or property mutations on the input; only the `input`
event triggers a search. See "Common mistakes" item 3.

## Common mistakes

### Mistake 1 — Listening for `input` directly to bypass debounce

```js
// WRONG — bypasses ln-search's debounce, fires on every keystroke
document.querySelector('[data-ln-search]').addEventListener('input', function () {
    runExpensiveFilter();
});
```

If your filter is cheap (in-memory list, sub-millisecond), the
debounce is unnecessary overhead — but you're then duplicating
ln-search's wiring. If it's expensive, the un-debounced path is
exactly what ln-search exists to prevent.

The correct path is to listen for `ln-search:change` on the target.
You get the debounce for free, and `e.detail.term` is already
normalized:

```js
// RIGHT — debounced, normalized, cancelable
target.addEventListener('ln-search:change', function (e) {
    e.preventDefault();
    runFilter(e.detail.term);
});
```

### Mistake 2 — Pressing Enter in a `<form>` and not understanding what runs

```html
<form action="/search" method="GET">
    <input type="search" name="q" data-ln-search="results">
</form>
```

ln-search listens to `input` only, not to `keydown` or `submit`.
Pressing Enter in the search input does what the platform does:
the form submits. The 150ms debounce timer may still be running
when Enter is hit; the timer's eventual fire does dispatch
`ln-search:change`, but by then the page has already navigated.

Three resolutions depending on what you want:

```html
<!-- Option A: don't put the search in a form. Most ln-search use
     cases don't need server submission — they filter live. -->
<input type="search" data-ln-search="results">

<!-- Option B: keep the form, but wire its submit handler. The form's
     submit IS your "Enter to search" hook. -->
<form id="search-form">
    <input type="search" name="q" data-ln-search="results">
</form>
```

```js
// Option B continued
document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    runServerSearch(e.target.querySelector('input').value);
});
```

There is no Option C from inside ln-search — it has no opinion on
Enter. If you need "Enter focuses the first result" or "Enter runs
search immediately," wire it on the input directly.

### Mistake 3 — Setting `input.value` programmatically and expecting search to fire

```js
// WRONG — input.value is set, but ln-search never sees an `input` event
const input = document.querySelector('[data-ln-search] input');
input.value = 'argentina';
// → list is unchanged
```

The `input` event fires only on user-driven changes (keystrokes,
paste, IME composition). Property writes do not fire it. Three ways
to trigger a search after a programmatic value write:

```js
// Option A: dispatch the event yourself
input.value = 'argentina';
input.dispatchEvent(new Event('input', { bubbles: true }));

// Option B: dispatch the search event directly on the target
const target = document.getElementById(input.closest('[data-ln-search]').getAttribute('data-ln-search'));
target.dispatchEvent(new CustomEvent('ln-search:change', {
    detail: { term: 'argentina', targetId: target.id },
    bubbles: true,
    cancelable: true
}));

// Option C: if you're inside ln-form, ln-form:fill dispatches `input`
//          for every populated field automatically.
form.lnForm.fill({ search: 'argentina' });
```

Option A is the canonical path. The 150ms debounce still applies —
your dispatch starts the timer; the search fires on the next tick.

### Mistake 4 — Two `data-ln-search` inputs targeting the same target

```html
<!-- Top toolbar -->
<input type="search" data-ln-search="employees" placeholder="Toolbar search">
<!-- Sidebar -->
<input type="search" data-ln-search="employees" placeholder="Sidebar search">
```

Both inputs work independently. Typing in one does NOT clear or
sync the other — each has its own debounce timer, its own input
state, its own dispatch. Whichever input fires `ln-search:change`
last, that term is what the listener on the target sees. The other
input still shows the user's prior text.

If you genuinely want two search boxes on the same target,
listen at the document level and synchronize manually:

```js
document.addEventListener('ln-search:change', function (e) {
    if (e.detail.targetId !== 'employees') return;
    document.querySelectorAll('[data-ln-search="employees"] input, input[data-ln-search="employees"]').forEach(function (input) {
        if (input.value !== e.detail.term) input.value = e.detail.term;
    });
});
```

Two-input setups are usually a sign that the search box should live
in one canonical place (a sticky header, a fixed toolbar) and the
other location should hold a "Jump to search" button instead.

### Mistake 5 — Confusing `data-ln-search` with `data-ln-data-table-search`

```html
<!-- WRONG — does NOT trigger ln-data-table's request flow -->
<input data-ln-search="my-data-table">
<div id="my-data-table" data-ln-data-table data-ln-data-table-name="users">
    <!-- ... -->
</div>
```

ln-data-table does NOT listen for `ln-search:change`. It uses its
own input attribute, `data-ln-data-table-search`, placed inside the
data-table element:

```html
<!-- RIGHT — ln-data-table's own search input -->
<div id="my-data-table" data-ln-data-table data-ln-data-table-name="users">
    <header>
        <input type="search" data-ln-data-table-search placeholder="Search...">
    </header>
    <!-- ... -->
</div>
```

The reason: ln-data-table's search is part of the request payload
(joined with sort, pagination, column filters in the
`ln-data-table:request-data` event consumed by `ln-store`). Putting
ln-search in front would create a parallel channel the data-table
layer would need to ignore. They are different problems with
different lifecycles.

ln-table (the static, fully-loaded variant) DOES consume
ln-search — that's the table-filter integration documented in
`js/ln-table/README.md`. The naming is the source of confusion;
choose the renderer that matches your data shape and use the
search input it expects.

### Mistake 6 — Adding the clear button after construction

```html
<input type="search" data-ln-search="my-list">
```

```js
// Later...
const wrapper = /* the input or its parent — but ln-search wraps the input directly here, not a label */;
const btn = document.createElement('button');
btn.setAttribute('data-ln-search-clear', '');
btn.textContent = 'Clear';
wrapper.appendChild(btn);
// → click does nothing; the listener was never attached
```

The constructor finds the clear button via `this.dom.querySelector('[data-ln-search-clear]')`
once, at construction time. There is no MutationObserver inside the
component watching for the clear button to appear — adding one
after the fact gives you an unwired button.

Two fixes:

```html
<!-- Option A: include the clear button in the initial markup -->
<label data-ln-search="my-list">
    <input type="search">
    <button type="button" data-ln-search-clear>Clear</button>
</label>
```

```js
// Option B: destroy and re-init after appending
wrapper.appendChild(btn);
wrapper.lnSearch.destroy();
window.lnSearch(wrapper.parentElement);   // or document.body
```

Option A is the right answer for 99% of cases. Option B is a sign
the markup is being assembled in the wrong order.

### Mistake 7 — Mutating `data-ln-search` value to switch targets

```js
// WRONG — does NOT re-resolve the target
const el = document.querySelector('[data-ln-search]');
el.setAttribute('data-ln-search', 'different-list');
// → next keystroke still searches the original target
```

`this.targetId` is captured at construction:

```js
this.targetId = dom.getAttribute(DOM_SELECTOR);
```

Every subsequent `_search` call uses that captured value, not a
fresh `getAttribute` read. The MutationObserver's `attributeFilter`
is built from the selector by `registerComponent`, so it DOES fire
on the value change — but the observer's reaction is to look for
re-init, not to re-bind the targetId on the existing instance.

To switch targets:

```js
el.lnSearch.destroy();
el.setAttribute('data-ln-search', 'different-list');
window.lnSearch(el.parentElement);   // re-creates the instance
```

In practice, switching targets is rare. The right shape is usually
a separate search input per target, with appropriate visibility
controls — search-box reuse across views is an antipattern that
hides the user's mental model ("am I searching the same thing?").

## Related

- **`@mixin form-input-icon-group`** (`scss/config/mixins/_form.scss`)
  — provides the chrome for the wrapper variant: border, focus ring,
  icon and clear-button positioning, the `:placeholder-shown ~`
  selector that hides the clear button while empty. Applied via
  `<label>:has(input[type="search"])` in
  `scss/components/_form.scss` — no class needed on the label.
- **[`ln-table`](../ln-table/README.md)** — the canonical
  `ln-search` consumer. Listens for `ln-search:change` on the
  table element, calls `preventDefault()`, and applies the term in
  its in-memory filter pipeline (search + column filters + sort).
  No coordinator wiring needed.
- **[`ln-filter`](../ln-filter/README.md)** — the orthogonal
  filter component. Operates on the same target as ln-search via
  its own `data-ln-filter-hide` attribute. The two compose without
  knowing about each other; an item is visible iff neither hide
  attribute is present.
- **[`ln-data-table`](../ln-data-table/README.md)** — the
  server-coordinated table renderer. Has its own search input
  (`data-ln-data-table-search`) wired into the request payload.
  ln-search is NOT used in front of `ln-data-table`; see "Common
  mistakes" item 5 for why.
- **[`ln-form`](../ln-form/README.md)** — when the search input
  lives inside `<form data-ln-form>`, `ln-form` does NOT
  intercept search-related behavior. Pressing Enter still triggers
  the form's native submit; ln-search has no opinion on it. See
  "Common mistakes" item 2.
- **[`ln-http`](../ln-http/README.md)** — the natural integration
  point for server-side search. Listen for `ln-search:change`,
  `preventDefault()`, dispatch `ln-http:request` with the term
  encoded in the URL or body.
- **Architecture deep-dive:** [`docs/js/search.md`](../../docs/js/search.md)
  for component internals, the construction microtask, and the
  filtering iteration shapes.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  — `ln-search` sits at the input boundary of the data flow. It
  does not own data, validation, transport, or rendering; it
  announces user intent via one cancelable event and lets
  whichever layer cares the most respond.
