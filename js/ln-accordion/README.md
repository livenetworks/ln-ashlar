# ln-accordion

> Coordinator that enforces single-open across a list of `ln-toggle` panels — opening one closes the others, via attribute, not by calling anything.

## Philosophy

`ln-accordion` exists for one reason: a list of `ln-toggle` panels in
which only one should be open at a time. It is a 38-line coordinator,
and that's the entire feature surface. It does not animate the panels
(CSS does, via `.collapsible`), it does not own each panel's
open/closed state (`ln-toggle` does, via `data-ln-toggle`), and it does
not run any logic when nothing is opening — it sits idle until an
`ln-toggle:open` event bubbles up.

The shape it has — a wrapper `<ul data-ln-accordion>` around toggle
children — is a deliberate consequence of the architecture in
[`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md).
Components in this library do not call each other; they communicate
through events on the DOM, and they read each other's state from
attributes. So when one panel opens and the others must close, the
accordion's job is *not* to reach into a sibling's instance. The
toggle exposes no state-mutating method anyway, but the deeper reason
is the same one that drove the API shape: a sibling-instance call would
let the wrapper bypass the toggle's own state machine —
its `before-close` cancelable event, its `aria-expanded` sync, its
persistence write, all skipped. Instead, the accordion sets
`data-ln-toggle="close"` on each open sibling, and the toggle's own
`MutationObserver` reacts and runs the full close pipeline. The
attribute is the contract; everyone reads and writes the same field.
This is why the file is so short.

What this component does **not** do:

- **Does not animate.** Expand/collapse animation is the
  `.collapsible` mixin (`grid-template-rows: 0fr → 1fr`), applied to
  the panel element. The accordion never touches geometry.
- **Does not allow multi-open.** "Multi-open" is just `data-ln-toggle`
  panels without an accordion wrapper around them — drop the wrapper
  if you want that behavior.
- **Does not auto-open the first panel.** Initial state is whatever
  the markup says. Mark one panel `data-ln-toggle="open"` if you want
  it open on load.
- **Does not persist state.** Persistence is a per-toggle concern via
  `data-ln-persist` on individual `[data-ln-toggle]` elements.
  ln-accordion has zero persistence code.
- **Does not auto-init nested accordions** in any special way — but
  nested accordions are fully supported. Each accordion's listener
  only manages toggles whose nearest `[data-ln-accordion]` ancestor
  is itself, so an inner accordion's opens stay inside it and the
  outer leaves them alone. See "Nested accordions" under Examples.

How it relates to other components: ln-accordion is a thin layer over
`ln-toggle`. Every panel in the accordion is an independent
`ln-toggle` instance — its open/close API, persistence, cancelable
events, and aria sync all come from there. Read
[`js/ln-toggle/README.md`](../ln-toggle/README.md) first if you have
not. ln-accordion adds exactly one rule on top of that: when one
`ln-toggle:open` happens inside this wrapper, the others close.

## Markup anatomy

A complete minimal accordion. The shape below is what the JS expects;
read the prose after for the *why* behind each piece.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="panel1">
            Section 1
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
        </header>
        <section id="panel1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body">
                <p>Content 1 — starts open.</p>
            </article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="panel2">
            Section 2
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
        </header>
        <section id="panel2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">
                <p>Content 2 — starts closed.</p>
            </article>
        </section>
    </li>
</ul>
```

### The wrapper — `<ul data-ln-accordion>`

`<ul>` because an accordion is, semantically, an unordered list of
collapsible items (see the html skill — "any group of same-type items
uses `<ul>/<li>`"). The `data-ln-accordion` attribute is a marker; it
takes no value. The wrapper is the element that listens for the
bubbled `ln-toggle:open` event and that emits `ln-accordion:change`
back out. The default styled chrome — bordered card, dividers between
items, hover on the trigger — is provided by `@mixin accordion`
(`scss/config/mixins/_accordion.scss`) applied at
`scss/components/_accordion.scss`.

### Each item — `<li>` containing a trigger and a panel

Each `<li>` holds two siblings: the trigger header and the
collapsible panel. The pairing is by ID — the trigger declares which
panel it controls via `data-ln-toggle-for="panel1"` and the panel
declares its own ID. That ID-based binding (not DOM-proximity) is why
triggers and panels can live anywhere relative to each other; the
`<li>` just keeps them visually grouped.

### The trigger — `<header data-ln-toggle-for="panel1">`

`<header>` is the entire clickable surface — the user can click
anywhere across it to open the panel. The `data-ln-toggle-for`
attribute is interpreted by `ln-toggle`, not by `ln-accordion`. When
the user clicks, `ln-toggle` resolves the ID, calls `toggle()` on the
panel's instance, the panel's attribute flips to `"open"`, the panel's
own observer reacts and dispatches `ln-toggle:open` — and *that* event
is what bubbles up to `ln-accordion`. The accordion is reactive to the
event, not to the click.

The chevron inside the header is plain decoration. `ln-toggle`'s
default CSS rotates any `.ln-chevron` icon inside any
`[data-ln-toggle-for]` 180° when the controlled panel is open
(`scss/components/_toggle.scss`). Rotation is driven by
`aria-expanded` on the trigger, which `ln-toggle` keeps in sync. The
accordion does not touch the chevron.

### The panel — `<section id="panel1" data-ln-toggle class="collapsible">`

Three concerns layered on one element:

- **`id="panel1"`** — the lookup target for the trigger.
- **`data-ln-toggle`** — creates an `ln-toggle` instance. The
  attribute value is the open/closed state: `"open"` or anything else
  (typically empty / `"close"`).
- **`class="collapsible"`** — the visual animation. CSS sets
  `grid-template-rows: 0fr` by default and `1fr` when the panel
  carries `.open` (which `ln-toggle` adds based on its attribute).

The element type is `<section>` because the content is a thematic
group with optional heading. It cannot be `<main>` — the HTML spec
allows only one `<main>` per page.

### The body — `<article class="collapsible-body">`

The collapsible animation requires the parent (`.collapsible`) to
have zero padding — that's how it can animate to zero height
cleanly. So padding/margins live one level deeper, on the body
child. `<article>` is one valid choice; `<div class="collapsible-body">`
is another. What matters is that something with the
`.collapsible-body` class wraps the actual content.

### What state goes where

| Concern | Lives on | Owned by |
|---|---|---|
| Is this panel open? | `data-ln-toggle="open\|close"` on panel | `ln-toggle` |
| Is the chevron rotated? | `aria-expanded="true"` on trigger | `ln-toggle` (sets it from panel state) |
| Did opening this panel close the others? | nothing on the accordion — it's transient | `ln-accordion` (reactive only) |
| Should this panel be remembered across reloads? | `data-ln-persist` on panel | `ln-toggle` |

The accordion's own state is essentially zero. It is a pure event-to-attribute
translator.

## States & visual feedback

There is no "open accordion" state; only individual panels have state.

| Trigger | What JS sets | What CSS does |
|---|---|---|
| User clicks header | `ln-toggle` flips `data-ln-toggle` on panel | (nothing visual yet) |
| Panel attribute flips to `"open"` | `ln-toggle` adds `.open` class to panel and `aria-expanded="true"` to every matching trigger | `.collapsible.open` opens via `grid-template-rows: 1fr`; `.ln-chevron` inside `[aria-expanded="true"]` rotates 180° |
| `ln-toggle:open` bubbles up | `ln-accordion` sets `data-ln-toggle="close"` on every other open toggle inside the wrapper | each closed toggle's observer reverses the open animation and rotates its chevron back |
| Trigger hover | (no JS) | `.ln-chevron` color shifts; `<header>` background shifts via `--bg-sunken` |

Read it as: JS toggles attributes, CSS shows the result. There are no
JS-driven inline styles on the rendering path.

## Attributes

| Attribute | On | Description | Why this attribute |
|---|---|---|---|
| `data-ln-accordion` | wrapper (typically `<ul>`) | Marks the wrapper as an accordion. No value. | The presence of the attribute is what creates the coordinator instance and starts the bubbled-event listener. The wrapper is also the dispatch target for `ln-accordion:change`. |

That is the entire attribute surface. Every other attribute in an
accordion (`data-ln-toggle`, `data-ln-toggle-for`, `data-ln-persist`,
`id` on the panel, `class="collapsible"`) is owned by `ln-toggle` or
by the CSS mixin. Adding any new control surface here would mean
duplicating something `ln-toggle` already does — that's a smell, not
a feature.

## Events

### Emitted by the accordion

| Event | Bubbles | Cancelable | `detail` | Dispatched when | Common consumer |
|---|---|---|---|---|---|
| `ln-accordion:change` | yes | no | `{ target: HTMLElement }` | A panel finished opening (after siblings have been closed) | Analytics; URL sync; revealing context-specific UI per panel |
| `ln-accordion:destroyed` | yes | no | `{ target: HTMLElement }` | `destroy()` was called | Cleanup wiring that listened to `:change` |

`detail.target` on `:change` is the panel element that just opened
(the toggle target), **not** the accordion wrapper. The accordion
wrapper is the *dispatch* element.

### Listened to by the accordion

| Event | Source | What the accordion does |
|---|---|---|
| `ln-toggle:open` (bubbled) | any descendant `[data-ln-toggle]` | Iterates `dom.querySelectorAll('[data-ln-toggle]')` and sets `data-ln-toggle="close"` on every match that is currently `"open"` and is not the one that just opened. Then dispatches `ln-accordion:change`. |

The accordion does not listen for `ln-toggle:close`. Closing a panel
is uncoordinated — the user closing the only-open panel just leaves
the accordion in a fully-collapsed state. That is intentional, not an
oversight.

## API (component instance)

`window.lnAccordion(root)` re-runs the init scan over `root`.
`MutationObserver` already covers AJAX inserts and attribute
mutations; call this manually only when you need the scan to happen
synchronously after `innerHTML` injection.

`el.lnAccordion` on a DOM element exposes:

| Property | Type | Description |
|---|---|---|
| `dom` | `HTMLElement` | Back-reference to the wrapper element |
| `destroy()` | method | Removes the bubbled `ln-toggle:open` listener, dispatches `ln-accordion:destroyed`, deletes the `lnAccordion` instance reference. Children remain intact — `ln-toggle` instances are independent. |

There is no `open(panelId)` or `close(panelId)` method. To
programmatically change which panel is open, set the attribute
directly on the panel element you want open:

```js
document.getElementById('panel2').setAttribute('data-ln-toggle', 'open');
// → ln-toggle's observer applies the open state and dispatches ln-toggle:open
// → ln-accordion catches the bubble and closes panel1 / panel3
```

This is the "attribute is the contract" principle in action. There is
no second API path; there's just the attribute.

## Examples

### Minimal — three sections, one open by default

The smallest working accordion. Use this as the starting point and
add markup variations on top.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="p1">
            Section 1
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
        </header>
        <section id="p1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body"><p>Content 1.</p></article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="p2">
            Section 2
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
        </header>
        <section id="p2" data-ln-toggle class="collapsible">
            <article class="collapsible-body"><p>Content 2.</p></article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="p3">
            Section 3
            <svg class="ln-icon ln-chevron" aria-hidden="true"><use href="#ln-arrow-down"></use></svg>
        </header>
        <section id="p3" data-ln-toggle class="collapsible">
            <article class="collapsible-body"><p>Content 3.</p></article>
        </section>
    </li>
</ul>
```

### All-closed default

Drop the `="open"` from every panel. The accordion still works; the
user just starts with everything collapsed.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="p1">…</header>
        <section id="p1" data-ln-toggle class="collapsible">
            <article class="collapsible-body">…</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="p2">…</header>
        <section id="p2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">…</article>
        </section>
    </li>
</ul>
```

### Persistent open panel (across reloads)

Add `data-ln-persist` to each panel — `ln-toggle` writes its
open/closed state to `localStorage` keyed by page path + element ID.
The accordion stays out of it; on the next page load, whichever panel
restores as `"open"` will bubble its `ln-toggle:open` event and the
accordion's listener will close any other panels that also restored
as open.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="p1">Section 1</header>
        <section id="p1" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 1.</article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="p2">Section 2</header>
        <section id="p2" data-ln-toggle="close" data-ln-persist class="collapsible">
            <article class="collapsible-body">Content 2.</article>
        </section>
    </li>
</ul>
```

For storage-key format, fallback behavior in private browsing, and
`data-ln-persist="custom-key"` overrides, see the [`ln-toggle`
persistence section](../ln-toggle/README.md#persistence).

### Reacting to panel changes

Listen for `ln-accordion:change` to run side effects when the active
panel changes. Typical use cases: lazy-loading the panel's content,
syncing the active panel to the URL hash, or analytics.

```js
document.addEventListener('ln-accordion:change', function (e) {
    const panelId = e.detail.target.id;
    history.replaceState(null, '', '#' + panelId);
});
```

`detail.target` is the panel that opened, not the accordion wrapper.
If you have multiple accordions on a page, scope by listening on the
wrapper directly:

```js
document.getElementById('faq-accordion').addEventListener('ln-accordion:change', /* … */);
```

### Multi-open ("not an accordion")

If you want multiple panels open at once, don't wrap them in
`data-ln-accordion`. Each `[data-ln-toggle]` works perfectly well on
its own; the wrapper is what enforces single-open.

```html
<!-- No data-ln-accordion — each panel is independent -->
<section>
    <header data-ln-toggle-for="p1">Section 1</header>
    <section id="p1" data-ln-toggle="open" class="collapsible">
        <article class="collapsible-body">…</article>
    </section>
</section>
<section>
    <header data-ln-toggle-for="p2">Section 2</header>
    <section id="p2" data-ln-toggle="open" class="collapsible">
        <article class="collapsible-body">…</article>
    </section>
</section>
```

### Nested accordions

Nested accordions are supported. Each accordion's listener only
manages toggles whose `closest('[data-ln-accordion]')` ancestor is
itself — opening a panel in an inner accordion bubbles its
`ln-toggle:open` event upward, but the outer's listener early-exits
because the originating toggle's nearest accordion is the inner one.
Inner-accordion siblings stay untouched when the outer cascades, and
outer-accordion siblings stay untouched when the inner cascades.

```html
<ul data-ln-accordion>
    <li>
        <header data-ln-toggle-for="outer1">Outer 1</header>
        <section id="outer1" data-ln-toggle="open" class="collapsible">
            <article class="collapsible-body">
                <p>Outer 1 contains its own accordion:</p>
                <ul data-ln-accordion>
                    <li>
                        <header data-ln-toggle-for="inner1">Inner 1</header>
                        <section id="inner1" data-ln-toggle="open" class="collapsible">
                            <article class="collapsible-body">Inner 1 content.</article>
                        </section>
                    </li>
                    <li>
                        <header data-ln-toggle-for="inner2">Inner 2</header>
                        <section id="inner2" data-ln-toggle class="collapsible">
                            <article class="collapsible-body">Inner 2 content.</article>
                        </section>
                    </li>
                </ul>
            </article>
        </section>
    </li>
    <li>
        <header data-ln-toggle-for="outer2">Outer 2</header>
        <section id="outer2" data-ln-toggle class="collapsible">
            <article class="collapsible-body">Outer 2 content.</article>
        </section>
    </li>
</ul>
```

Opening Inner 2 closes Inner 1 and leaves Outer 1 open. Opening
Outer 2 closes Outer 1 (collapsing the inner accordion with it) and
does not touch the inner panels' `data-ln-toggle` state — they
remain whatever they were when the outer collapsed, ready to re-show
in their previous state if Outer 1 is re-opened.

## Common mistakes

### Mistake 1 — Putting `data-ln-toggle` on a panel that is *not* a child of the accordion's `<li>`

```html
<!-- WRONG — ID-based pairing across the accordion boundary -->
<ul data-ln-accordion>
    <li><header data-ln-toggle-for="p1">Section 1</header></li>
    <li><header data-ln-toggle-for="p2">Section 2</header></li>
</ul>

<section id="p1" data-ln-toggle class="collapsible">…</section>
<section id="p2" data-ln-toggle class="collapsible">…</section>
```

`ln-toggle` will work — it resolves panels by ID, not DOM proximity —
but the accordion's `_onToggleOpen` only looks inside its own
subtree. The `ln-toggle:open` event from a panel *outside* the
wrapper does not bubble through the accordion, so the single-open
rule won't fire. Keep panels inside the accordion's DOM subtree (the
canonical pattern is one `<li>` per panel + trigger pair).

### Mistake 2 — Adding padding directly to the `.collapsible` element

```html
<!-- WRONG — panel won't fully collapse to 0 height -->
<section id="p1" data-ln-toggle class="collapsible" style="padding: 1rem;">
    <p>Content</p>
</section>
```

The collapse animation works by transitioning `grid-template-rows`
from `0fr` to `1fr`. If the parent `.collapsible` has padding, that
padding remains visible at "collapsed" — you'll see a thin strip
where the content should be invisible. Padding/margins go on the
inner `.collapsible-body`, never on `.collapsible`.

### Mistake 3 — Adding `data-ln-toggle` to the `<header>`

```html
<!-- WRONG — header is the trigger, not the panel -->
<li>
    <header data-ln-toggle data-ln-toggle-for="p1">Section 1</header>
    <section id="p1" class="collapsible">…</section>
</li>
```

`data-ln-toggle` creates a panel (the thing that opens and closes).
`data-ln-toggle-for` creates a trigger (the thing that controls a
panel). Putting both on the header makes the header into a panel
that controls itself — the click listener would try to call
`toggle()` on the header, which would flip its own attribute and
animate its own height. Read [`ln-toggle` README](../ln-toggle/README.md)
for the trigger-vs-panel split; the accordion does not change those
semantics.

## Related

- **[`ln-toggle`](../ln-toggle/README.md)** — every panel in the
  accordion is an `ln-toggle` instance. All open/close behavior,
  persistence, cancelable events and aria sync come from there.
- **`@mixin collapsible`** (`scss/config/mixins/_collapsible.scss`)
  — the grid-template-rows animation. `.collapsible` is the parent
  (zero padding); `.collapsible-body` is the padded child.
- **`@mixin accordion`** (`scss/config/mixins/_accordion.scss`)
  — the bordered-card chrome and chevron rotation styling. Already
  applied to `[data-ln-accordion]` by default; re-apply it on a
  custom selector if you want the same look without the
  single-open coordinator.
- **Architecture deep-dive:** [`docs/js/accordion.md`](../../docs/js/accordion.md)
  for component internals and lifecycle.
- **Cross-component principles:** [`docs/architecture/data-flow.md`](../../docs/architecture/data-flow.md)
  for the broader story on attributes-as-contract and
  event-driven coordination.
